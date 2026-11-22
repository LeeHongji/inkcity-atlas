import * as React from "react"

import { Paper } from "@/components/ui/paper"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Highlight } from "@/components/ui/highlight"
import { Kbd } from "@/components/ui/kbd"
import { Hanzi } from "../hanzi"
import { CJK } from "../cjk"
import type { Guide as GuideData, LookFor, MarginNote, Place } from "./types"

type View = ReturnType<NonNullable<Window["SF"]>["view"]>
const SF = () => window.SF!

/* the camera, read every frame; React only hears about real changes */
function useView(): View | null {
  const [v, setV] = React.useState<View | null>(null)
  React.useEffect(() => {
    let id = 0, last = ""
    const loop = () => {
      id = requestAnimationFrame(loop)
      const n = SF().view(), key = `${n.mode}|${n.z.toFixed(4)}|${n.cx.toFixed(1)}|${n.cy.toFixed(1)}|${n.w}|${n.h}|${n.paused}|${n.gliding}`
      if (key !== last) { last = key; setV(n) }
    }
    loop()
    return () => cancelAnimationFrame(id)
  }, [])
  return v
}

const isCJK = (s?: string) => !!s && /[\u3040-\u30ff\u3400-\u9fff]/.test(s)
// rounded CJK faces sit best beside Kevin Sans; the language picks the right glyph forms
const CJK_FONT: Record<string, string> = {
  ja: '"Hiragino Maru Gothic ProN", "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif',
  "zh-Hans": '"Yuanti SC", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", sans-serif',
  "zh-Hant": '"Yuanti TC", "PingFang TC", "PingFang HK", "Noto Sans TC", sans-serif',
}
const LangCtx = React.createContext<string>("")
function LocalName({ text, size }: { text?: string; size: number }) {
  const lang = React.useContext(LangCtx)
  if (!text) return null
  if (isCJK(text) && [...text].every((c) => CJK[c]))     // every character drawn with the cities' own pen strokes
    return <><Hanzi text={text} size={size} className="inline-block text-pencil-text" /><span className="sr-only">{text}</span></>
  if (isCJK(text))
    return <span lang={lang || undefined} className="text-pencil-text" style={{ fontSize: size * 0.78, fontFamily: CJK_FONT[lang] || CJK_FONT.ja, fontWeight: 500 }}>{text}</span>
  return <span className="font-hand text-pencil-text" style={{ fontSize: size * 0.8 }}>{text}</span>
}

/* ---------- a hand-drawn arrow and a pen circle, in the overlay's own SVG ---------- */
function hash(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
function arrowPath(ax: number, ay: number, bx: number, by: number, seed: string) {
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L
  const bend = ((hash(seed) % 2) ? 1 : -1) * Math.min(40, L * 0.16)
  const mx = (ax + bx) / 2 - uy * bend, my = (ay + by) / 2 + ux * bend
  // the head follows the curve's last direction
  const tx = bx - mx, ty = by - my, tl = Math.hypot(tx, ty) || 1, hx = tx / tl, hy = ty / tl, hs = 9
  const h1 = [bx - hx * hs - hy * hs * 0.55, by - hy * hs + hx * hs * 0.55], h2 = [bx - hx * hs + hy * hs * 0.5, by - hy * hs - hx * hs * 0.5]
  return `M${ax.toFixed(1)} ${ay.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)} M${h1[0].toFixed(1)} ${h1[1].toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)} L${h2[0].toFixed(1)} ${h2[1].toFixed(1)}`
}
function loopPath(cx: number, cy: number, rx: number, ry: number, seed: string) {
  const h = hash(seed), a0 = -2.3 + (h % 100) / 200, n = 36
  let d = ""
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = a0 + Math.PI * 2 * 1.1 * t, k = 1 + 0.06 * Math.sin(t * 9 + (h % 7)) + t * 0.08
    d += `${i ? "L" : "M"}${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)}`
  }
  return d
}

const HALO = "0 0 2px #F0EEE4, 0 0 4px #F0EEE4, 0 0 7px #F0EEE4, 0 0 12px #F0EEE4"

/* where the overlay's paper sits on screen (CSS px, padded) */
type Rect = [number, number, number, number]
const rectOf = (id: string, pad = 10): Rect | null => { const r = document.getElementById(id)?.getBoundingClientRect(); return r && r.width && r.height ? [r.left - pad, r.top - pad, r.right + pad, r.bottom + pad] : null }
/* the part of the screen the guidebook leaves free: left of a side panel, above a bottom sheet */
function freeRect(v: View): Rect {
  const b = rectOf("ink-guide-book", 0), m = 12
  if (!b) return [0, 0, v.w, v.h]
  if (b[1] > v.h * 0.35 && b[2] - b[0] > v.w * 0.6) return [0, 0, v.w, Math.max(v.h * 0.35, b[1] - m)]   // a bottom sheet
  if (b[0] > v.w * 0.4) return [0, 0, Math.max(v.w * 0.4, b[0] - m), v.h]                               // a side panel
  return [0, 0, v.w, v.h]
}
/* a camera that puts what `cam` centres in the middle of the free part of the screen */
function framed(cam: { z: number; cx: number; cy: number }) {
  const v = SF().view(), f = freeRect(v), pz = cam.z * (v.pz / v.z)
  return { z: cam.z, cx: cam.cx - ((f[0] + f[2]) / 2 - v.w / 2) / pz, cy: cam.cy - ((f[1] + f[3]) / 2 - v.h / 2) / pz }
}

/* the whole city framed on the screen so that no tile or satellite lies under the title, the guidebook or the
   controls: the largest zoom (up to the scene's wide zoom) with a placement that clears them, nearest the middle */
let homeCleared = true
function homeCam() {
  const sf = SF(), v = sf.view(), e = sf.extent(), s = v.pz / v.z, M = 16
  const blocks = [rectOf("ink-guide-title"), rectOf("ink-guide-book"), rectOf("ink-guide-controls")].filter(Boolean) as Rect[]
  const ea = (e[2] - e[0]) * (e[3] - e[1])
  const boxes = (sf.boxes?.() || []).filter((q) => (q[2] - q[0]) * (q[3] - q[1]) < ea * 0.45)   // map-wide tiles (streets, sea) cover everything: skip
  const aw = v.w - 2 * M, ah = v.h - 2 * M
  const fit = Math.min(sf.wide.z, Math.min(aw / (e[2] - e[0]), ah / (e[3] - e[1])) * 0.97 / s)
  const F = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
  const fr = freeRect(v), cx0 = ((fr[0] + fr[2]) / 2 - M) / aw, cy0 = ((fr[1] + fr[3]) / 2 - M) / ah
  const order = F.flatMap((fx) => F.map((fy) => [fx, fy])).sort((a, b) => Math.hypot(a[0] - cx0, a[1] - cy0) - Math.hypot(b[0] - cx0, b[1] - cy0))
  for (let k = 0; k < 18; k++) {
    const z = Math.max(sf.zMin(), fit * Math.pow(0.97, k)), pz = z * s
    const cw = (e[2] - e[0]) * pz, ch = (e[3] - e[1]) * pz, sx = aw - cw, sy = ah - ch
    for (const [fx, fy] of order) {
      const left = M + Math.min(0, sx) * 0.5 + Math.max(0, sx) * fx, topY = M + Math.min(0, sy) * 0.5 + Math.max(0, sy) * fy
      const hit = boxes.some((q) => { const x0 = left + (q[0] - e[0]) * pz, y0 = topY + (q[1] - e[1]) * pz, x1 = left + (q[2] - e[0]) * pz, y1 = topY + (q[3] - e[1]) * pz
        return blocks.some((r) => x0 < r[2] && x1 > r[0] && y0 < r[3] && y1 > r[1]) })
      if (!hit) { homeCleared = true; return { z, cx: e[0] - (left - v.w / 2) / pz, cy: e[1] - (topY - v.h / 2) / pz } }
      if (sx <= 0 && sy <= 0) break                                   // no room to move: try a smaller zoom
    }
    if (z <= sf.zMin()) break
  }
  homeCleared = false
  const z = Math.max(sf.zMin(), fit)                                   // nothing clears: centre it in the free part
  return framed({ z, cx: (e[0] + e[2]) / 2, cy: (e[1] + e[3]) / 2 })
}

/* ---------- notes written in the margins of the whole-city view ----------
   A note is written out only where it fits cleanly: on blank paper (the map canvas is read at a tenth of its size),
   clear of the title, the guidebook, the controls, the satellites and the other notes, with a short arrow that crosses
   no other arrow or note. A note that does not fit becomes a small numbered pen ring on its target; a tap (or a hover)
   opens it on a slip of paper. On a small screen most notes are rings, on a large one most are text. */
const hitR = (a: Rect, b: Rect) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1]
const overlap = (a: Rect, b: Rect) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]))
type Seg = [number, number, number, number]
function segsCross(p: Seg, q: Seg) {
  const d = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
  const d1 = d(q[0], q[1], q[2], q[3], p[0], p[1]), d2 = d(q[0], q[1], q[2], q[3], p[2], p[3]), d3 = d(p[0], p[1], p[2], p[3], q[0], q[1]), d4 = d(p[0], p[1], p[2], p[3], q[2], q[3])
  return d1 * d2 < 0 && d3 * d4 < 0
}
function segHitsRect(sg: Seg, r: Rect) {
  for (let i = 1; i < 10; i++) { const t = i / 10, x = sg[0] + (sg[2] - sg[0]) * t, y = sg[1] + (sg[3] - sg[1]) * t; if (x > r[0] && x < r[2] && y > r[1] && y < r[3]) return true }
  return false
}
type Ink = { g: Uint8Array; cw: number; ch: number; k: number }
function readInk(): Ink | null {
  const cv = document.getElementById("sf") as HTMLCanvasElement | null
  if (!cv || !cv.width) return null
  const k = 0.1, cw = Math.ceil(cv.clientWidth * k), ch = Math.ceil(cv.clientHeight * k)
  const c = document.createElement("canvas"); c.width = cw; c.height = ch
  const x = c.getContext("2d", { willReadFrequently: true }); if (!x) return null
  x.drawImage(cv, 0, 0, cw, ch)
  const d = x.getImageData(0, 0, cw, ch).data, g = new Uint8Array(cw * ch)
  const P = SF().paper?.() || [240, 238, 228]                     // the paper by day, the night's paper at night
  for (let i = 0; i < cw * ch; i++) { const r = d[i * 4], gg = d[i * 4 + 1], bb = d[i * 4 + 2]; g[i] = Math.abs(r - P[0]) + Math.abs(gg - P[1]) + Math.abs(bb - P[2]) > 26 ? 1 : 0 }
  return { g, cw, ch, k }
}
function inkIn(ink: Ink, r: Rect) {
  const x0 = Math.max(0, Math.floor(r[0] * ink.k)), x1 = Math.min(ink.cw, Math.ceil(r[2] * ink.k)), y0 = Math.max(0, Math.floor(r[1] * ink.k)), y1 = Math.min(ink.ch, Math.ceil(r[3] * ink.k))
  let n = 0, t = 0
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { t++; n += ink.g[y * ink.cw + x] }
  const outside = Math.max(0, (r[2] - r[0]) * (r[3] - r[1]) * ink.k * ink.k - t)
  return (n + outside) / Math.max(1, t + outside)                 // off-screen counts as ink
}
type Laid = { n: MarginNote; i: number; tx: number; ty: number; text: null | { ax: number; ay: number; w: number; left: boolean; sx0: number; sy0: number } }
function layoutNotes(notes: MarginNote[], v: View, fs: number, wk: number, ink: Ink | null, hs: number[]): Laid[] {
  const blocks = [rectOf("ink-guide-title", 14), rectOf("ink-guide-book", 14), rectOf("ink-guide-controls", 14)].filter(Boolean) as Rect[]
  const e = SF().extent(), ea = (e[2] - e[0]) * (e[3] - e[1])
  for (const q of SF().boxes?.() || []) {
    if ((q[2] - q[0]) * (q[3] - q[1]) > ea * 0.06) continue
    const a = SF().toScreen(q[0], q[1], v), b = SF().toScreen(q[2], q[3], v); blocks.push([a[0] + 4, a[1] + 4, b[0] - 4, b[1] - 4])
  }
  const maxLen = Math.max(110, Math.min(330, Math.min(v.w, v.h) * 0.3)), M = 12
  const placed: Rect[] = [], arrows: Seg[] = []
  const targets = notes.map((n) => { const [wx, wy] = SF().prj(n.at[0], n.at[1], n.at[2] || 0); return SF().toScreen(wx, wy, v) })
  return notes.map((n, ni) => {
    const [wx, wy] = SF().prj(n.at[0], n.at[1], n.at[2] || 0), [tx, ty] = SF().toScreen(wx, wy, v)
    const w = Math.min((n.w || 230) * wk, v.w * 0.42), h = hs[ni] || Math.max(1, Math.ceil(n.text.length * fs * 0.6 / w)) * fs * 1.3
    const boxAt = (ax: number, ay: number, left: boolean): Rect => { const x0 = left ? ax - w - 4 : ax + 4; return [x0, ay - h / 2, x0 + w, ay + h / 2] }
    const arrowOf = (r: Rect): Seg => { const sx = Math.max(r[0], Math.min(tx, r[2])), sy = Math.max(r[1], Math.min(ty, r[3])); return [sx, sy, tx, ty] }
    // hard faults make a spot unusable for text; the rest only rank the usable spots
    const judge = (r: Rect, d: number) => {
      const sg = arrowOf(r), len = Math.hypot(sg[2] - sg[0], sg[3] - sg[1])
      let fault = r[0] < M || r[1] < M || r[2] > v.w - M || r[3] > v.h - M || len > maxLen
      for (const q of blocks) if (hitR(r, q) || (segHitsRect(sg, q) && !(tx > q[0] && tx < q[2] && ty > q[1] && ty < q[3]))) fault = true
      for (const q of placed) if (hitR(r, q) || segHitsRect(sg, q)) fault = true
      for (const q of arrows) if (segsCross(sg, q)) fault = true
      for (const [j, t] of targets.entries()) if (j !== ni && t[0] > r[0] - 16 && t[0] < r[2] + 16 && t[1] > r[1] - 16 && t[1] < r[3] + 16) fault = true
      const inkf = ink ? inkIn(ink, r) : 0
      if (inkf > 0.05) fault = true
      return { fault, sc: d * 0.002 + len * 0.004 + inkf * 40 }
    }
    const cands: { ax: number; ay: number; left: boolean; d: number }[] = [{ ax: tx + n.dx * v.pz, ay: ty + n.dy * v.pz, left: n.dx < 0, d: 0 }]
    for (const R of [55, 80, 110, 145, 185, 230, 280]) for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2, ax = tx + Math.cos(a) * R * 1.2, ay = ty + Math.sin(a) * R
      cands.push({ ax, ay, left: Math.cos(a) < 0, d: R })
    }
    let best: typeof cands[0] | null = null, bs = 1e9
    for (const [ci, c] of cands.entries()) {
      const j = judge(boxAt(c.ax, c.ay, c.left), c.d); if (j.fault) continue
      const sc = j.sc - (ci === 0 ? 0.6 : 0)                         // the author's spot wins near-ties
      if (sc < bs) { bs = sc; best = c }
    }
    if (!best) return { n, i: ni, tx, ty, text: null }
    const r = boxAt(best.ax, best.ay, best.left), sg = arrowOf(r)
    placed.push([r[0] - 8, r[1] - 6, r[2] + 8, r[3] + 6]); arrows.push(sg)
    return { n, i: ni, tx, ty, text: { ax: best.ax, ay: best.ay, w, left: best.left, sx0: sg[0], sy0: sg[1] } }
  })
}
function NoteRing({ x, y, label, seed }: { x: number; y: number; label: string; seed: string }) {
  return (
    <svg className="pointer-events-none absolute overflow-visible" style={{ left: x - 13, top: y - 13 }} width={26} height={26} aria-hidden>
      <circle cx={13} cy={13} r={11} fill="#F7F3E8" />
      <path d={loopPath(13, 13, 10.5, 10.5, seed)} fill="none" stroke="#c8553d" strokeWidth={1.6} strokeLinecap="round" />
      <text x={13} y={17.5} textAnchor="middle" fontSize={13} fontFamily="var(--font-hand)" fill="#2a2420">{label}</text>
    </svg>
  )
}
function MarginNotes({ notes, v, show, night }: { notes: MarginNote[]; v: View; show: boolean; night: boolean }) {
  const k = v.pz / SF().wide.z                     // 1 at the wide zoom on a 1920 x 1080 screen
  const fs = Math.max(13, Math.min(19, 17 * k)), wk = Math.max(0.66, Math.min(1.35, k))
  const [ink, setInk] = React.useState<{ key: string; ink: Ink | null } | null>(null)
  const [openNote, setOpenNote] = React.useState(-1)
  const key = `${v.z.toFixed(3)}|${v.cx.toFixed(0)}|${v.cy.toFixed(0)}|${v.w}|${v.h}|${night}`
  React.useEffect(() => {
    if (!show || v.gliding) return
    const t = setTimeout(() => setInk({ key, ink: readInk() }), night ? 1300 : 450)   // after the bakes have sharpened (and a change of look has faded in)
    return () => clearTimeout(t)
  }, [key, show, v.gliding])
  React.useEffect(() => { setOpenNote(-1) }, [key, show])
  const [hs, setHs] = React.useState<number[]>([])
  const refs = React.useRef<(HTMLParagraphElement | null)[]>([])
  const ready = !!ink && ink.key === key
  const L = React.useMemo(() => layoutNotes(notes, v, fs, wk, ready ? ink!.ink : null, hs), [notes, key, fs, wk, ready, hs])   // eslint-disable-line react-hooks/exhaustive-deps
  React.useLayoutEffect(() => {                                       // the real text heights, then lay out again
    const m = refs.current.map((p) => (p ? p.offsetHeight : 0))
    if (m.some((h, i) => h && Math.abs(h - (hs[i] || 0)) > 1)) setHs((o) => m.map((h, i) => h || o[i] || 0))
  })
  const rings = L.filter((q) => !q.text)
  const ringNo = (i: number) => String(rings.findIndex((q) => q.i === i) + 1)
  // the slip of paper for an opened ring: beside it, inside the free part of the screen
  let slip: React.ReactNode = null
  const oq = L.find((q) => q.i === openNote && !q.text)
  if (oq) {
    const fr = freeRect(v), sw = Math.min(260, fr[2] - fr[0] - 24)
    const left = Math.max(fr[0] + 12, Math.min(oq.tx + 18, fr[2] - sw - 12)), below = oq.ty < (fr[1] + fr[3]) / 2
    slip = (
      <div className="pointer-events-auto absolute" style={{ left, top: below ? oq.ty + 20 : undefined, bottom: below ? undefined : v.h - oq.ty + 20, width: sw }}>
        <Paper tape="corner" tapeKind="masking" seed={`slip-${oq.i}`} className="px-3.5 pt-3 pb-2.5">
          <p className="m-0 font-hand text-[14.5px] leading-[1.4] text-ink">{oq.n.text}</p>
        </Paper>
      </div>
    )
  }
  return (
    <div aria-hidden={!show} className="pointer-events-none absolute inset-0 transition-opacity duration-500" style={{ opacity: show && ready ? 1 : 0, visibility: show ? "visible" : "hidden" }}>
      <svg className="on-map absolute inset-0 size-full overflow-visible" fill="none" stroke="var(--ll-ink-soft, #4a423b)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        {L.map(({ n, tx, ty, text }, i) => {
          if (!text) return null
          const D = Math.hypot(tx - text.sx0, ty - text.sy0) || 1
          const sx = text.sx0 + (tx - text.sx0) / D * 6, sy = text.sy0 + (ty - text.sy0) / D * 6, ex = tx - (tx - text.sx0) / D * 7, ey = ty - (ty - text.sy0) / D * 7
          return <path key={i} d={arrowPath(sx, sy, ex, ey, n.text)} />
        })}
      </svg>
      {L.map(({ n, text }, i) => text ? (
        <p key={i} ref={(el) => { refs.current[i] = el }} className="on-map absolute m-0 font-hand leading-[1.3] text-ink"
          style={{ left: text.left ? text.ax - text.w - 4 : text.ax + 4, top: text.ay, width: text.w, fontSize: fs, textAlign: text.left ? "right" : "left", transform: "translateY(-50%)", textWrap: "balance", textShadow: HALO }}>
          {n.text}
        </p>
      ) : (
        // measured off screen so a ring can become text again when the screen grows
        <p key={i} ref={(el) => { refs.current[i] = el }} aria-hidden className="invisible absolute -left-[9999px] m-0 font-hand leading-[1.3]" style={{ width: Math.min((n.w || 230) * wk, v.w * 0.42), fontSize: fs, textWrap: "balance" }}>{n.text}</p>
      ))}
      {rings.map((q) => (
        <React.Fragment key={`r${q.i}`}>
          <NoteRing x={q.tx} y={q.ty} label={ringNo(q.i)} seed={`ring-${q.i}`} />
          <button aria-label={q.n.text} className="pointer-events-auto absolute size-9 rounded-full focus-visible:outline-2 focus-visible:outline-ink-you"
            style={{ left: q.tx - 18, top: q.ty - 18 }} onClick={() => setOpenNote((o) => (o === q.i ? -1 : q.i))}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") setOpenNote(q.i) }} onPointerLeave={(e) => { if (e.pointerType === "mouse") setOpenNote(-1) }} />
        </React.Fragment>
      ))}
      {slip}
    </div>
  )
}

/* ---------- the guidebook: the places, a place's story, the moment ---------- */
/* the intro at the top of the guidebook: three lines, the rest a tap away, so the places stay in view */
function Intro({ text }: { text: string }) {
  const [more, setMore] = React.useState(false)
  return (
    <div className="mb-4">
      <p className="m-0 font-hand text-[15px] leading-[1.5] text-ink-soft" style={more ? undefined : { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{text}</p>
      <button onClick={() => setMore((m) => !m)} className="mt-1 font-hand text-[13px] text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink">{more ? "less" : "more"}</button>
    </div>
  )
}

function PlaceList({ g, onPlace, onMoment, intro }: { g: GuideData; onPlace: (i: number) => void; onMoment: () => void; intro: boolean }) {
  const visit = (window.SF as unknown as { visit?: string[] }).visit || []
  return (
    <div>
      {intro ? <Intro text={g.intro} /> : null}
      <ol className="m-0 list-none space-y-0.5 p-0">
        {g.places.map((p, i) => {
          const key = visit.indexOf(p.shot) + 1
          return (
            <li key={p.shot}>
              <button onClick={() => onPlace(i)} className="group flex w-full items-baseline gap-3 rounded-sm px-1.5 py-1.5 text-start hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-ink-you">
                <span className="w-5 shrink-0 font-mono text-[12px] text-pencil-text">{key > 0 && key < 10 ? key : "·"}</span>
                <span className="font-hand text-[17px] leading-tight text-ink group-hover:underline group-hover:decoration-dotted group-hover:underline-offset-4">{p.title}</span>
                {p.local ? <span className="ms-auto shrink-0 ps-2"><LocalName text={p.local} size={15} /></span> : null}
              </button>
            </li>
          )
        })}
      </ol>
      <button onClick={onMoment} className="mt-4 w-full rounded-sm px-1.5 py-2 text-start hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-ink-you">
        <span className="font-hand text-[17px] text-ink"><Highlight tone="orange" seed="moment-entry">★ The moment</Highlight></span>
        <span className="mt-1 block font-hand text-[14px] leading-snug text-ink-soft">{g.moment.title}</span>
      </button>
    </div>
  )
}

function PlaceStory({ p, seen, active, onLook, onBack, onStep, idx, count }: {
  p: Place; seen: Set<string>; active: number; onLook: (i: number) => void; onBack: () => void; onStep: (d: number) => void; idx: number; count: number
}) {
  return (
    <div>
      <button onClick={onBack} className="font-hand text-[14px] text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink">← all places</button>
      <h2 className="mt-2 mb-0 flex flex-wrap items-baseline gap-x-3 font-script text-[2.1rem] leading-[1.05] font-bold text-ink">
        {p.title}<LocalName text={p.local} size={21} />
      </h2>
      <div className="mt-3 space-y-3 font-hand text-[15.5px] leading-[1.55] text-ink-soft">
        {p.story.split(/\n\n+/).map((t, i) => <p key={i}>{t}</p>)}
      </div>
      {p.look.length ? (
        <>
          <h3 className="mt-5 mb-1.5 font-hand text-[13px] font-bold tracking-[0.12em] text-pencil-text uppercase">Look for</h3>
          <ul className="m-0 list-none space-y-1 p-0">
            {p.look.map((l, i) => {
              const id = `${p.shot}:${i}`
              return (
                <li key={id}>
                  <button onClick={() => onLook(i)} aria-pressed={active === i}
                    className={`flex w-full items-start gap-2.5 rounded-sm px-1 py-1 text-start hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-ink-you ${active === i ? "bg-sticky-yellow/45" : ""}`}>
                    <Checkbox checked={seen.has(id)} tabIndex={-1} aria-hidden className="pointer-events-none mt-[3px] shrink-0" seed={id} />
                    <span className="font-hand text-[15px] leading-snug text-ink">{l.text}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      ) : null}
      <div className="mt-5 flex items-center justify-between">
        <Button size="sm" variant="ghost" onClick={() => onStep(-1)}>← prev</Button>
        <span className="font-mono text-[11px] text-pencil-text">{idx + 1} / {count}</span>
        <Button size="sm" variant="ghost" onClick={() => onStep(1)}>next →</Button>
      </div>
    </div>
  )
}

function MomentStory({ g, onBack, onGo }: { g: GuideData; onBack: () => void; onGo: () => void }) {
  return (
    <div>
      <button onClick={onBack} className="font-hand text-[14px] text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink">← all places</button>
      <p className="mt-3 mb-0 font-hand text-[13px] font-bold tracking-[0.12em] text-pencil-text uppercase">The moment</p>
      <h2 className="mt-1 mb-0 font-script text-[2.1rem] leading-[1.05] font-bold text-ink">{g.moment.title}</h2>
      <div className="mt-3 space-y-3 font-hand text-[15.5px] leading-[1.55] text-ink-soft">
        {g.moment.text.split(/\n\n+/).map((t, i) => <p key={i}>{t}</p>)}
      </div>
      {g.moment.when ? <p className="mt-3 font-hand text-[14px] text-ink"><Highlight tone="yellow" seed="when">{g.moment.when}</Highlight></p> : null}
      <Button className="mt-5" onClick={onGo}>Watch it →</Button>
    </div>
  )
}

/* ---------- the whole overlay ----------
   Two layouts. "side": a landscape screen; the guidebook is a sheet on the right and the controls sit bottom left.
   "sheet": a portrait screen (or a narrow one); the guidebook is a bottom sheet, folded to one line until opened,
   and carries the controls. The intro is written on the paper only when the screen has room for it; otherwise it
   opens the guidebook. Every camera move centres its target in the part of the screen the guidebook leaves free. */
type Target = { kind: "home" } | { kind: "cam"; cam: { z: number; cx: number; cy: number } }
export function Guide({ g }: { g: GuideData }) {
  const v = useView()
  const [explore, setExplore] = React.useState(() => SF().app.mode === "explore")
  const [notesOn, setNotesOn] = React.useState(() => localStorage.getItem("inkcity-notes") !== "off")
  const [night, setNight] = React.useState(() => !!SF().look?.night)
  const [page, setPage] = React.useState<{ kind: "list" } | { kind: "place"; i: number } | { kind: "moment" }>({ kind: "list" })
  const [look, setLook] = React.useState<{ place: number; i: number; arrived: boolean } | null>(null)
  const [seen, setSeen] = React.useState<Set<string>>(() => new Set())
  const sideAt = (w: number, h: number) => w >= 840 && w / h >= 1.15
  const [open, setOpen] = React.useState(() => sideAt(window.innerWidth, window.innerHeight))
  const target = React.useRef<Target>({ kind: "home" })
  const homeZ = React.useRef(SF().wide.z)
  const [introFits, setIntroFits] = React.useState(true)
  const coarse = React.useMemo(() => matchMedia("(pointer: coarse)").matches, [])

  const go = React.useCallback((t: Target, ms?: number) => {
    target.current = t
    const cam = t.kind === "home" ? homeCam() : framed(t.cam)
    if (t.kind === "home") {
      homeZ.current = cam.z
      if (!homeCleared && document.getElementById("ink-guide-intro")) { setIntroFits(false); return }   // the intro moves into the guidebook; the next layout frames again
    }
    SF().glideTo(cam, ms)
  }, [])
  React.useEffect(() => {
    SF().home = () => { target.current = { kind: "home" }; const c = homeCam(); homeZ.current = c.z; return c }
    SF().on("explore", (a) => {
      setExplore(true)
      // after the build (watched to the end, or skipped with a click) frame the whole city beside the guidebook;
      // leaving the tour part-way keeps the camera where the tour was
      const w = SF().wide, c = SF().view()
      const atWide = Math.abs(c.z - w.z) < 1e-3 && Math.abs(c.cx - w.cx) < 1 && Math.abs(c.cy - w.cy) < 1
      if ((a as { intro?: boolean })?.intro || atWide) setTimeout(() => go({ kind: "home" }, 1300), 250)
    })
    SF().on("film", () => { setExplore(false); setLook(null) })
    SF().on("arrive", () => setLook((l) => (l ? { ...l, arrived: true } : l)))
    SF().on("look", (a) => setNight(!!(a as { night?: boolean })?.night))
  }, [go])
  React.useEffect(() => { localStorage.setItem("inkcity-notes", notesOn ? "on" : "off") }, [notesOn])

  React.useEffect(() => { setIntroFits(true) }, [v?.w, v?.h])   // eslint-disable-line react-hooks/exhaustive-deps
  // the layout of this screen; when it changes (rotation, resize, the guidebook opened or folded) re-frame the target
  const layoutKey = v ? `${sideAt(v.w, v.h) ? "side" : "sheet"}|${open}|${v.w}|${v.h}|${introFits}` : ""
  const firstLayout = React.useRef(true)
  React.useEffect(() => {
    if (!layoutKey) return
    if (firstLayout.current) { firstLayout.current = false; return }
    if (SF().app.mode !== "explore") return
    const t = setTimeout(() => go(target.current, 700), 60)       // after the panel has its new size
    return () => clearTimeout(t)
  }, [layoutKey, go])

  // keys 1-9 and 0 move the camera in the engine: follow them with the guidebook
  React.useEffect(() => {
    if (!v || v.gliding || v.mode !== "explore") return
    const at = g.places.findIndex((p) => { const s = SF().shot(p.shot); if (!s) return false; const f = framed(s); return (Math.abs(s.z - v.z) < 0.02 && Math.abs(s.cx - v.cx) < 3 && Math.abs(s.cy - v.cy) < 3) || (Math.abs(f.z - v.z) < 0.02 && Math.abs(f.cx - v.cx) < 3 && Math.abs(f.cy - v.cy) < 3) })
    if (at >= 0 && !(page.kind === "place" && page.i === at) && !look) setPage({ kind: "place", i: at })
  }, [v, g.places, page, look])

  if (!v) return null
  const side = sideAt(v.w, v.h)
  const roomy = side && introFits && v.w >= 1180 && v.h >= 700       // the intro may sit on the paper
  const small = v.w < 560 || v.h < 480
  const isWide = v.z <= Math.max(SF().wide.z, homeZ.current) * 1.25
  const goPlace = (i: number) => { setLook(null); setPage({ kind: "place", i }); const s = SF().shot(g.places[i].shot); if (s) go({ kind: "cam", cam: s }) }
  const goLook = (i: number) => {
    if (page.kind !== "place") return
    const l: LookFor = g.places[page.i].look[i], [wx, wy] = SF().prj(l.at[0], l.at[1], l.at[2] || 0)
    setLook({ place: page.i, i, arrived: false })
    setSeen((s) => new Set(s).add(`${g.places[page.i].shot}:${i}`))
    go({ kind: "cam", cam: { z: l.z || 6, cx: wx, cy: wy } })
  }
  const goWide = () => { setLook(null); go({ kind: "home" }) }
  const goMoment = () => { const s = SF().shot(g.moment.shot); if (s) go({ kind: "cam", cam: s }) }

  // the pen circle round the detail being looked at
  let circle: React.ReactNode = null
  if (look && look.arrived && page.kind === "place" && page.i === look.place) {
    const l = g.places[look.place].look[look.i], [wx, wy] = SF().prj(l.at[0], l.at[1], l.at[2] || 0), [sx, sy] = SF().toScreen(wx, wy, v)
    const r = (l.r || 5) * 3.3 * v.pz
    circle = (
      <svg className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden>
        <path key={`${look.place}-${look.i}`} d={loopPath(sx, sy, r * 1.25, r, `${look.place}-${look.i}`)} fill="none" stroke="#c8553d" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
          className="ll-guide-draw" />
      </svg>
    )
  }

  const panel = page.kind === "list"
    ? <PlaceList g={g} intro={!roomy} onPlace={goPlace} onMoment={() => setPage({ kind: "moment" })} />
    : page.kind === "moment"
      ? <MomentStory g={g} onBack={() => setPage({ kind: "list" })} onGo={goMoment} />
      : <PlaceStory p={g.places[page.i]} idx={page.i} count={g.places.length} seen={seen} active={look && look.place === page.i ? look.i : -1}
          onLook={goLook} onBack={() => { setPage({ kind: "list" }); goWide() }}
          onStep={(d) => goPlace((page.i + d + g.places.length) % g.places.length)} />

  const notesSwitch = (
    <label className="flex items-center gap-2 font-hand text-[15px] text-ink">
      <Switch checked={notesOn} onCheckedChange={setNotesOn} aria-label="Notes on the map" /> notes
    </label>
  )
  const nightSwitch = SF().setLook ? (
    <label className="flex items-center gap-2 font-hand text-[15px] text-ink" title="night (N)">
      <Switch checked={night} onCheckedChange={(c) => SF().setLook?.({ night: c })} aria-label="Night" /> night
    </label>
  ) : null
  const ui = Math.max(1, Math.min(1.45, Math.min(v.w / 1920, v.h / 1080)))   // the paper pieces grow on big screens
  const panelW = side ? Math.round(Math.max(300, Math.min(360, v.w * 0.24))) : Math.min(v.w - 20, 560)

  return (
    <LangCtx.Provider value={g.lang || ""}>
    <div className="ll-guide pointer-events-none fixed inset-0 z-10 overflow-hidden" data-explore={explore} data-layout={side ? "side" : "sheet"} data-night={night}>
      {/* while the city draws itself: only a quiet hint */}
      <p className="on-map pointer-events-none absolute bottom-6 left-1/2 m-0 w-max max-w-[90vw] -translate-x-1/2 text-center font-hand text-[15px] text-pencil-text transition-opacity duration-700"
        style={{ opacity: explore ? 0 : 0.85 }}>the city is drawing itself · {coarse ? "tap" : "click"} anywhere to skip</p>

      <div className="transition-opacity duration-700" style={{ opacity: explore ? 1 : 0, visibility: explore ? "visible" : "hidden" }}>
        <MarginNotes notes={g.notes} v={v} show={notesOn && isWide && !v.gliding} night={night} />
        {circle}

        {/* the title, written on the map's paper; once zoomed in it moves onto a small taped label */}
        <div id="ink-guide-title" className="pointer-events-auto absolute"
          style={{ zoom: ui, left: small ? 14 : 28, top: small ? 10 : 22, maxWidth: roomy ? 390 : Math.min(320, v.w - (side ? panelW + 60 : 28)) }}>
          {isWide && !small ? (
            <>
              <a href="../../index.html" className="on-map font-hand text-[14px] text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink">← the Atlas</a>
              <h1 className={`on-map m-0 mt-1 flex flex-wrap items-baseline gap-x-3 font-script leading-none font-bold text-ink ${small ? "text-[2.1rem]" : roomy ? "text-[3.1rem]" : "text-[2.6rem]"}`} style={{ textShadow: HALO }}>
                {g.city}<LocalName text={g.local} size={small ? 21 : 28} />
              </h1>
              {roomy ? (
                <p id="ink-guide-intro" className="on-map mt-3 mb-0 font-hand text-[15.5px] leading-[1.5] text-ink-soft transition-opacity duration-500"
                  style={{ opacity: notesOn ? 1 : 0, textShadow: HALO }}>{g.intro}</p>
              ) : null}
            </>
          ) : (
            <Paper tape="corner" tapeKind="masking" seed={`label-${g.city}`} className={small ? "px-3 pt-2 pb-1.5" : "px-4 pt-2.5 pb-2"}>
              <a href="../../index.html" className="font-hand text-[13px] text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink">← the Atlas</a>
              <p className={`m-0 flex items-baseline gap-x-2 font-script leading-tight font-bold text-ink ${small ? "text-[1.4rem]" : "text-[1.7rem]"}`}>{g.city}<LocalName text={g.local} size={small ? 15 : 18} /></p>
            </Paper>
          )}
        </div>

        {/* the guidebook */}
        {side ? (
          <div id="ink-guide-book" className="pointer-events-auto absolute" style={{ zoom: ui, right: 16, top: 16, width: open ? panelW : undefined }}>
            {open ? (
              <Paper tape="top" tapeKind="washi-stripes" seed={`guidebook-${g.city}`} className="px-5 pt-6 pb-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-hand text-[13px] font-bold tracking-[0.14em] text-pencil-text uppercase">The guidebook</span>
                  <button onClick={() => setOpen(false)} className="font-hand text-[13px] text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink">fold</button>
                </div>
                <div className="overflow-y-auto pe-1" style={{ maxHeight: v.h / ui - 32 - 84 }}>{panel}</div>
              </Paper>
            ) : (
              <Button variant="outline" onClick={() => setOpen(true)}>Open the guidebook</Button>
            )}
          </div>
        ) : (
          <div id="ink-guide-book" className="pointer-events-auto absolute" style={{ left: (v.w - panelW) / 2, bottom: 10, width: panelW }}>
            <Paper tape={open ? "top" : false} tapeKind="washi-stripes" seed={`guidebook-sheet-${g.city}`} className={open ? "px-4 pt-5 pb-3" : "px-4 py-2.5"}>
              <div className="flex items-center justify-between gap-3">
                <button onClick={() => setOpen((o) => !o)} aria-expanded={open}
                  className="flex items-baseline gap-2 font-hand text-[14px] font-bold tracking-[0.12em] text-pencil-text uppercase">
                  Guidebook <span className="text-[12px]">{open ? "▾" : "▴"}</span>
                </button>
                <div className="flex items-center gap-3">
                  <Button size="xs" variant="outline" onClick={goWide}>whole city</Button>
                  {nightSwitch}
                  {notesSwitch}
                </div>
              </div>
              {open ? <div className="mt-3 overflow-y-auto pe-1" style={{ height: Math.round(Math.min(v.h * 0.5, 460)) }}>{panel}</div> : null}
            </Paper>
          </div>
        )}

        {/* the controls (side layout): where the map's own pen icons were */}
        {side ? (
          <div id="ink-guide-controls" className="pointer-events-auto absolute flex flex-wrap items-center gap-2" style={{ zoom: ui, left: small ? 12 : 20, bottom: small ? 10 : 16 }}>
            {small ? null : <Button size="sm" variant="outline" onClick={() => SF().togglePause()}>{v.paused ? "▶ play" : "❚❚ pause"}</Button>}
            <Button size="sm" variant="outline" onClick={goWide}>whole city{small ? null : <Kbd className="ms-1">0</Kbd>}</Button>
            <Button size="sm" variant="outline" onClick={() => SF().replay()}>the tour{small ? null : <Kbd className="ms-1">R</Kbd>}</Button>
            <span className="ms-2">{notesSwitch}</span>
            {nightSwitch ? <span className="ms-1">{nightSwitch}</span> : null}
          </div>
        ) : null}
      </div>
    </div>
    </LangCtx.Provider>
  )
}
