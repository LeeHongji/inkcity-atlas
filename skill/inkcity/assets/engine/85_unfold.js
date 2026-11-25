'use strict';
/* the unfold: the city arrives folded, as a paper street map, and opens on the table (SCENE.unfold: true, or ?unfold).
   The map is cut along the street centre lines into a 3 x 3 sheet, letter-folded one way and then the other, so the nine
   panels lie in one stack with a cover on top. The folds open one at a time. A panel turns rigidly about its crease and
   stays flat, so in this parallel projection it is its own flat drawing under one affine map (three of its corners fix
   the map). The ground (roads, lawns, water) is printed on the paper; whatever stands (buildings, trees, the viaduct)
   lies flat until its panel is open and uncovered, then stands up like a pop-up card, in a wave away from the crease.
   The back of the paper is blank, with the print showing through. The satellites are folded notes that open last.
   Then the people pop in and the ordinary renderer takes over: the unfold's last frame is the city without its people,
   so nothing jumps. Like the build it replaces, every frame is a function of its number.
   Folding order (the reverse of opening): the left-hand column over the middle one, the right-hand column over both,
   then the near row over the middle row, the far row over all. Opening, the far row lifts first (the cover with it),
   then the near row: blank paper. Then the right column comes over towards the viewer and lands face up, and last
   the left column rises with its print turned to the viewer, while the middle it uncovers stands up in front of it. */

const UF = SF.unfold = (() => {
  const q = new URLSearchParams(location.search), cfg = typeof SCENE !== 'undefined' ? SCENE.unfold : null;
  const on = !!(cfg || q.has('unfold')) && !q.has('build');
  // frames: hold (the folded map lies still), fold (one fold opening), gap (between two folds of a pair), pause
  // (between the two pairs), note/noteGap (the satellites' notes), pop (a pop-up standing), wave (delay per u from the
  // crease), jitter, fade (the paper's edges and creases going), tau (paper thickness, u)
  const o = Object.assign({ hold: 10, fold: 36, gap: 24, pause: 6, note: 26, noteGap: 5, pop: 10, wave: 0.11, jitter: 4, fade: 26, tau: 0.5 }, typeof cfg === 'object' && cfg ? cfg : {});
  const A1 = o.hold, A2 = A1 + o.gap, B1 = A2 + o.gap + o.pause, B2 = B1 + o.gap, N0 = B2 + o.fold - 8;
  const S = { A1: [A1, A1 + o.fold], A2: [A2, A2 + o.fold], B1: [B1, B1 + o.fold], B2: [B2, B2 + o.fold], notes: (k) => [N0 + k * o.noteGap, N0 + k * o.noteGap + o.note] };
  const lastNote = S.notes(3)[1];
  const end = Math.ceil(lastNote + 8 + 40 * o.wave + o.jitter + o.pop + 2);       // the unfold's last frame + 1
  return { on, o, S, end, plan: null, cache: null };
})();
if (UF.on) for (const t of SF.tiles) {
  // no construction drawing: every tile counts as built, and its people pop in when the paper is done, centre first
  t.unfold = true; t.rim = -1; t.castAt = UF.end + Math.round(clamp(Math.hypot(t.cx, t.cy) / 70, 0, 3));
}

/* ---------- small 3-D maths: a rigid map is { m: 3x3 row-major, t: [x, y, z] } ---------- */
const UF_I = { m: [1, 0, 0, 0, 1, 0, 0, 0, 1], t: [0, 0, 0] };
function ufApply(T, p) { const m = T.m; return [m[0] * p[0] + m[1] * p[1] + m[2] * p[2] + T.t[0], m[3] * p[0] + m[4] * p[1] + m[5] * p[2] + T.t[1], m[6] * p[0] + m[7] * p[1] + m[8] * p[2] + T.t[2]]; }
function ufDir(T, p) { const m = T.m; return [m[0] * p[0] + m[1] * p[1] + m[2] * p[2], m[3] * p[0] + m[4] * p[1] + m[5] * p[2], m[6] * p[0] + m[7] * p[1] + m[8] * p[2]]; }
function ufThen(A, B) {               // A after B
  const a = A.m, b = B.m, m = new Array(9);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) m[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
  return { m, t: ufApply({ m: a, t: A.t }, B.t) };
}
/* a turn by phi about the line through p along the unit vector a */
function ufTurn(a, p, phi) {
  const c = Math.cos(phi), s = Math.sin(phi), k = 1 - c, [x, y, z] = a;
  const m = [c + x * x * k, x * y * k - z * s, x * z * k + y * s, y * x * k + z * s, c + y * y * k, y * z * k - x * s, z * x * k - y * s, z * y * k + x * s, c + z * z * k];
  const r = ufApply({ m, t: [0, 0, 0] }, p);
  return { m, t: [p[0] - r[0], p[1] - r[1], p[2] - r[2]] };
}
const UF_VIEW = (() => { const k = 2 * AY / VZ, l = Math.hypot(1, 1, k); return [1 / l, 1 / l, k / l]; })();   // towards the camera
const UF_LIGHT = (() => { const l = Math.hypot(0.25, 0.55, 1); return [0.25 / l, 0.55 / l, 1 / l]; })();     // the kit's light: tops, then left faces
const ufDot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const ufSmoother = (u) => { u = clamp(u, 0, 1); return u * u * u * (u * (u * 6 - 15) + 10); };

/* ---------- the plan: panels, notes, what stands on each, and when ---------- */
function ufGroundExt(ob) {
  let e = [1e9, 1e9, -1e9, -1e9];
  const add = (wx, wy) => { const p = unprj(wx, wy); if (p[0] < e[0]) e[0] = p[0]; if (p[1] < e[1]) e[1] = p[1]; if (p[0] > e[2]) e[2] = p[0]; if (p[1] > e[3]) e[3] = p[1]; };
  for (const d of ob.list) { const p = d.p || d.c; if (p) for (let i = 0; i < p.length; i += 2) add(p[i], p[i + 1]); else if (d.x != null) add(d.x, d.y); }
  return e;
}
function ufPlan() {
  if (UF.plan && UF.plan.world === SF.statics) return UF.plan;
  const o = UF.o, S = UF.S, tau = o.tau;
  const far = (t) => !t.o.shared && Math.max(Math.abs(t.cx), Math.abs(t.cy)) > 160;
  const ext = new Map();
  for (const t of SF.live) {
    let e = [1e9, 1e9, -1e9, -1e9];
    for (const ob of t.statics) { if (ob.cast) continue; const f = ob.ground ? ufGroundExt(ob) : ob.fp; e = [Math.min(e[0], f[0]), Math.min(e[1], f[1]), Math.max(e[2], f[2]), Math.max(e[3], f[3])]; }
    ext.set(t, e);
  }
  let half = 0;
  for (const t of SF.live) if (!far(t)) { const e = ext.get(t); if (e[0] < e[2]) half = Math.max(half, -e[0], -e[1], e[2], e[3]); }
  half = Math.ceil(half) + 2;
  const s3 = half / 3, xs = [-half, -s3, s3, half];
  const panels = [];
  const mk = (name, x0, y0, x1, y1, parent, hinge, when) => {
    const p = { name, poly: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], parent, hinge, when, kids: [], objs: [] };
    if (parent) parent.kids.push(p);
    panels.push(p); return p;
  };
  // c: twice the hinge's height = the stack under the fold + the stack it folds over (both in sheets)
  const cell = {};
  const root = cell['0,0'] = mk('0,0', xs[1], xs[1], xs[2], xs[2], null, null, null);
  for (const j of [-1, 1]) cell['0,' + j] = mk('0,' + j, xs[1], xs[j + 1], xs[2], xs[j + 2], root, { q: [0, j * s3], s: [0, j], c: (j < 0 ? 9 : 6) * tau }, j < 0 ? S.A1 : S.A2);
  for (const j of [-1, 0, 1]) for (const i of [-1, 1]) cell[i + ',' + j] = mk(i + ',' + j, xs[i + 1], xs[j + 1], xs[i + 2], xs[j + 2], cell['0,' + j], { q: [i * s3, 0], s: [i, 0], c: (i > 0 ? 3 : 2) * tau }, i > 0 ? S.B1 : S.B2);
  const cover = cell['0,-1'];
  // the satellites: a note folded in half across the line from the city, its outer half over its inner half
  const sats = SF.live.filter(far).sort((a, b) => Math.atan2(a.cy, a.cx) - Math.atan2(b.cy, b.cx));
  const order = [];
  const notes = sats.map((t, k) => {
    const e = ext.get(t), m = 3, r = [e[0] - m, e[1] - m, e[2] + m, e[3] + m];
    const ax = Math.abs(t.cx) >= Math.abs(t.cy), sg = Math.sign(ax ? t.cx : t.cy) || 1;
    const mid = ax ? (r[0] + r[2]) / 2 : (r[1] + r[3]) / 2;
    const when = S.notes(k);
    let inner, outer;
    if (ax) {
      inner = sg > 0 ? mk(t.name + ':in', r[0], r[1], mid, r[3], null, null, null) : mk(t.name + ':in', mid, r[1], r[2], r[3], null, null, null);
      outer = sg > 0 ? mk(t.name + ':out', mid, r[1], r[2], r[3], inner, { q: [mid, 0], s: [1, 0], c: 2 * tau }, when) : mk(t.name + ':out', r[0], r[1], mid, r[3], inner, { q: [mid, 0], s: [-1, 0], c: 2 * tau }, when);
    } else {
      inner = sg > 0 ? mk(t.name + ':in', r[0], r[1], r[2], mid, null, null, null) : mk(t.name + ':in', r[0], mid, r[2], r[3], null, null, null);
      outer = sg > 0 ? mk(t.name + ':out', r[0], mid, r[2], r[3], inner, { q: [0, mid], s: [0, 1], c: 2 * tau }, when) : mk(t.name + ':out', r[0], r[1], r[2], mid, inner, { q: [0, mid], s: [0, -1], c: 2 * tau }, when);
    }
    order.push(t); outer.note = true;
    return { tile: t, inner, outer, ax, sg, mid };
  });
  // when a panel is open and nothing lies on it: its own folds (and its parents') have landed, and the flaps that
  // folded over it have passed the upright. The pop-ups then rise in a wave from a line: the crease it turned about,
  // or, for a panel that was covered, its edge the covering flap lifted off first
  const landing = (p) => { let a = 0; for (let x = p; x; x = x.parent) if (x.when) a = Math.max(a, x.when[1]); return a; };
  for (const p of panels) {
    let at = landing(p), line = p.hinge ? { q: p.hinge.q, s: p.hinge.s } : null;
    for (const k of p.kids) {
      const up = (k.when[0] + k.when[1]) / 2 + 2;                 // the covering flap is upright: the panel shows behind it
      if (up <= at) continue;
      // its free edge lay along the panel's far side from the crease: that side is uncovered first
      const sx = k.hinge.s[0], sy = k.hinge.s[1];
      at = up; line = { q: [sx > 0 ? p.poly[0][0] : sx < 0 ? p.poly[2][0] : 0, sy > 0 ? p.poly[0][1] : sy < 0 ? p.poly[2][1] : 0], s: k.hinge.s };
    }
    p.reveal = at; p.line = line;
  }
  // what stands, and on which panel (its footprint's centre); the satellites' things on their notes
  const inPoly = (p, x, y) => x >= p.poly[0][0] - 1e-6 && x <= p.poly[2][0] + 1e-6 && y >= p.poly[0][1] - 1e-6 && y <= p.poly[2][1] + 1e-6;
  const stands = [];
  const rng = RNG('unfold');
  for (const ob of SF.statics) {
    if (ob.cast || ob.ground) continue;
    const cx = (ob.fp[0] + ob.fp[2]) / 2, cy = (ob.fp[1] + ob.fp[3]) / 2;
    // a thing across a crease waits for the last panel under it (it never stands over paper still folded)
    let p = null;
    for (const q of panels) if (ob.fp[0] < q.poly[2][0] - 0.5 && ob.fp[2] > q.poly[0][0] + 0.5 && ob.fp[1] < q.poly[2][1] - 0.5 && ob.fp[3] > q.poly[0][1] + 0.5 && (!p || q.reveal > p.reveal)) p = q;
    if (!p) p = panels.find((q) => inPoly(q, cx, cy));
    if (!p) { let best = 1e18; for (const q of panels) { const d = Math.hypot(cx - (q.poly[0][0] + q.poly[2][0]) / 2, cy - (q.poly[0][1] + q.poly[2][1]) / 2); if (d < best) { best = d; p = q; } } }
    const L = p.line, dist = L ? Math.abs((cx - L.q[0]) * L.s[0] + (cy - L.q[1]) * L.s[1]) : 0;
    const at = p.reveal + o.wave * dist + rng() * o.jitter;
    // it stands up from its ground line: through the footprint's front corner, along its longer side (level when square)
    const fx = ob.fp[2] - ob.fp[0], fy = ob.fp[3] - ob.fp[1], front = prj(ob.fp[2], ob.fp[3], 0);
    stands.push({ ob, p, at, gx: front[0], gy: front[1], gb: (AY / AX) * (fx - fy) / Math.max(1e-6, fx + fy), c: [cx, cy, 0] });
    p.objs.push(ob);
  }
  // the base: things no actor passes behind, drawn first by the ordinary renderer too; then the sprites, in depth order
  stands.sort((a, b) => (a.ob.promoted - b.ob.promoted) || (a.ob.gi - b.ob.gi));
  let lastLand = 0; for (const p of panels) if (p.when) lastLand = Math.max(lastLand, p.when[1]);
  // a wobbly ink edge for every panel, in its own flat coordinates, so it turns with the paper
  for (const p of panels) {
    p.edge = [];
    const P = p.poly, sd = hstr(p.name);
    for (let e = 0; e < 4; e++) {
      const a = P[e], b = P[(e + 1) % 4], len = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
      const n = Math.max(4, Math.round(len / 6));
      for (let k = (e ? 1 : 0); k <= n; k++) { const u = k / n, w = (k === 0 || k === n) ? 0 : 0.35 * vnoise(u * len / 14, sd + e); p.edge.push([a[0] + (b[0] - a[0]) * u + nx * w, a[1] + (b[1] - a[1]) * u + ny * w]); }
    }
  }
  UF.plan = { world: SF.statics, half, s3, panels, root, cover, notes, stands, lastLand, fadeAt: UF.end - o.fade - 2 };
  return UF.plan;
}

/* ---------- a panel at frame n ---------- */
/* the angle a fold is turned by (pi: folded flat, 0: open), with a small bounce when the paper lands */
function ufPhi(w, n) {
  if (!w) return 0;
  if (n <= w[0]) return Math.PI;
  if (n < w[1]) { const u = (n - w[0]) / (w[1] - w[0]); return Math.PI * (1 - ufSmoother(u * 0.94 + 0.06 * u * u)); }
  const k = (n - w[1]) / 8; return k < 1 ? 0.05 * Math.sin(Math.PI * k) * (1 - k) : 0;
}
function ufWorld(p, n, memo) {
  let T = memo.get(p); if (T) return T;
  if (!p.parent) T = UF_I;
  else {
    const h = p.hinge, phi = ufPhi(p.when, n);
    // turning by phi takes the flap's outward direction s up into +z: the axis is s x z
    const turn = phi ? ufTurn([h.s[1], -h.s[0], 0], [h.q[0], h.q[1], h.c / 2], phi) : UF_I;
    T = ufThen(ufWorld(p.parent, n, memo), turn);
  }
  memo.set(p, T); return T;
}

/* ---------- the caches: the printed ground, and a sprite for every standing thing ---------- */
const night0 = () => LOOK.night;
function ufCache(v) {
  const pl = ufPlan(), key = v.pz.toFixed(5) + (LOOK.night ? 'n' : 'd') + LOOK.season;
  if (UF.cache && UF.cache.key === key && UF.cache.world === pl.world) return UF.cache;
  const pz = v.pz, hw = v.hw;
  // the print: every panel's flat box, the paper under it (locked to the world, as the table's), the ground with paint grain
  let bb = [1e9, 1e9, -1e9, -1e9];
  for (const p of pl.panels) for (const c of p.poly) { const s = prj(c[0], c[1], 0); bb = [Math.min(bb[0], s[0]), Math.min(bb[1], s[1]), Math.max(bb[2], s[0]), Math.max(bb[3], s[1])]; }
  bb = [bb[0] - 4, bb[1] - 4, bb[2] + 4, bb[3] + 4];
  const dr = devRect(bb, pz);
  const gcv = mkCanvas(dr[2], dr[3]), g = gcv.getContext('2d');
  g.setTransform(pz, 0, 0, pz, -dr[0], -dr[1]); g.lineCap = 'round'; g.lineJoin = 'round';
  for (const ob of SF.statics) if (ob.ground && !ob.cast) replay(g, ob.list, hw, {});
  grainOver(g, dr[0], dr[1], dr[2], dr[3]);
  const cv = mkCanvas(dr[2], dr[3]), c = cv.getContext('2d');
  c.save(); c.translate((((-dr[0]) % 512) + 512) % 512 - 512, (((-dr[1]) % 512) + 512) % 512 - 512);
  c.fillStyle = c.createPattern(LOOK.night ? R.tex.paperN : R.tex.paper, 'repeat'); c.fillRect(0, 0, dr[2] + 1024, dr[3] + 1024); c.restore();
  c.drawImage(gcv, 0, 0); gcv.width = 0;
  // sprites: a tile's exact bake already has one for every thing an actor can pass behind; the rest are drawn here
  const sp = new Map();
  for (const t of SF.live) { const b = findBake(t, v); if (b) for (const s of b.sprites) if (!s.ob.cast) sp.set(s.ob, s); }
  for (const st of pl.stands) {
    if (sp.has(st.ob)) continue;
    const r = devRect(st.ob.bb, pz); if (r[2] <= 0 || r[3] <= 0) continue;
    const scv = mkCanvas(r[2], r[3]), sx = scv.getContext('2d');
    sx.setTransform(pz, 0, 0, pz, -r[0], -r[1]); sx.lineCap = 'round'; sx.lineJoin = 'round';
    replay(sx, st.ob.list, hw, {}); grainOver(sx, r[0], r[1], r[2], r[3]);
    sp.set(st.ob, { ob: st.ob, cv: scv, x: r[0], y: r[1], w: r[2], h: r[3], boil: null, own: true });
  }
  if (UF.cache) { if (UF.cache.print) UF.cache.print.cv.width = 0; for (const s of UF.cache.sprites.values()) if (s.own) s.cv.width = 0; }
  // hatching, for paper turned away from the light
  const HS = 64, hc = mkCanvas(HS, HS), hx = hc.getContext('2d'), hr = RNG('hatch');
  hx.strokeStyle = night0() ? 'rgb(8,10,20)' : 'rgb(60,52,40)'; hx.lineCap = 'round';
  for (let k = 0; k < 7; k++) {
    const off = (k + 0.2 * (hr() - 0.5)) * HS / 7 * 2 - HS, w = 0.55 + 0.5 * hr();
    hx.globalAlpha = 0.55 + 0.45 * hr(); hx.lineWidth = w; hx.beginPath();
    for (const o of [-2 * HS, -HS, 0, HS]) { hx.moveTo(o + off, HS); hx.quadraticCurveTo(o + off + HS / 2 + (hr() - 0.5) * 3, HS / 2 + (hr() - 0.5) * 3, o + off + HS, 0); }
    hx.stroke();
  }
  UF.cache = { key, world: pl.world, print: { cv, x: dr[0], y: dr[1], w: dr[2], h: dr[3] }, sprites: sp, hatch: hc, paperPat: null };
  return UF.cache;
}

/* ---------- the frame ---------- */
UF.covers = (o, t) => UF.on && !(o && o.allLive) && (o && o.n != null ? o.n : t * FPS) < UF.end;
UF.draw = function (ctx, v, t, o) {
  o = o || {};
  const n = Math.max(0, o.n == null ? t * FPS : o.n), pl = ufPlan(), K = ufCache(v), pz = v.pz, tx = v.tx, ty = v.ty, night = LOOK.night;
  const tau = UF.o.tau, ink = night ? '#C9CEDD' : C.ink;
  if (n >= 2 && night && !R.lights) nightPrep();
  if (n >= 3 && !R.air && typeof SCENE !== 'undefined' && SCENE.air && SCENE.air[LOOK.season]) airPrep();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // the table: the same paper as the map, locked to the world
  if (!R.paperPat) R.paperPat = ctx.createPattern(R.tex.paper, 'repeat');
  if (night && !R.paperPatN) R.paperPatN = ctx.createPattern(R.tex.paperN, 'repeat');
  const pox = ((tx % 512) + 512) % 512, poy = ((ty % 512) + 512) % 512;
  ctx.save(); ctx.translate(pox - 512, poy - 512); ctx.fillStyle = night ? R.paperPatN : R.paperPat; ctx.fillRect(0, 0, v.cw + 1024, v.ch + 1024); ctx.restore();
  if (v.clip) { ctx.save(); ctx.beginPath(); ctx.rect(v.clip[0], v.clip[1], v.clip[2], v.clip[3]); ctx.clip(); }
  // where every panel is: its corners in the world, the affine map from its flat print to the screen, which side shows
  const memo = new Map(), lift = tau / 2 * (1 - smooth((n - pl.lastLand - 2) / 8));
  const edgeA = 1 - smooth((n - pl.fadeAt) / UF.o.fade);
  const st = pl.panels.map((p) => {
    const T = ufWorld(p, n, memo);
    let moving = false, chainPhi = 0;
    for (let x = p; x && x.parent; x = x.parent) { const f = ufPhi(x.when, n); chainPhi = Math.max(chainPhi, f); if (f > 0.12 && f < Math.PI - 1e-6) moving = true; }
    const W = p.poly.map((c) => ufApply(T, [c[0], c[1], lift]));
    const F = p.poly.map((c) => prj(c[0], c[1], 0)), Sc = W.map((w) => prj(w[0], w[1], w[2]));
    const u = [F[1][0] - F[0][0], F[1][1] - F[0][1]], w = [F[3][0] - F[0][0], F[3][1] - F[0][1]], U = [Sc[1][0] - Sc[0][0], Sc[1][1] - Sc[0][1]], V = [Sc[3][0] - Sc[0][0], Sc[3][1] - Sc[0][1]];
    const det = u[0] * w[1] - u[1] * w[0];
    const a = (U[0] * w[1] - V[0] * u[1]) / det, c = (V[0] * u[0] - U[0] * w[0]) / det, b = (U[1] * w[1] - V[1] * u[1]) / det, d = (V[1] * u[0] - U[1] * w[0]) / det;
    const A = [a, b, c, d, Sc[0][0] - a * F[0][0] - c * F[0][1], Sc[0][1] - b * F[0][0] - d * F[0][1]];      // canvas order: x' = a x + c y + e
    const nf = ufDir(T, [0, 0, 1]), front = ufDot(nf, UF_VIEW) > 0;
    const nv = front ? nf : [-nf[0], -nf[1], -nf[2]];
    const key = (W[0][0] + W[2][0]) / 2 + (W[0][1] + W[2][1]) / 2 + (UF_VIEW[2] / UF_VIEW[0]) * (W[0][2] + W[1][2] + W[2][2] + W[3][2]) / 4;
    return { p, T, W, F, Sc, A, front, nv, key, moving, landed: chainPhi === 0 && !p.kids.some((k) => ufPhi(k.when, n) > 0) };
  });
  const devM = (A) => [pz * A[0], pz * A[1], pz * A[2], pz * A[3], pz * A[4] + tx, pz * A[5] + ty];
  const flatPoly = (ctx2, s) => { ctx2.beginPath(); ctx2.moveTo(s.F[0][0], s.F[0][1]); for (let i = 1; i < 4; i++) ctx2.lineTo(s.F[i][0], s.F[i][1]); ctx2.closePath(); };
  const P = K.print, allOpen = st.every((s) => s.landed);
  const face = (s) => {
    const M = devM(s.A);
    ctx.save(); ctx.setTransform(M[0], M[1], M[2], M[3], M[4], M[5]);
    flatPoly(ctx, s); ctx.clip();
    if (s.front) ctx.drawImage(P.cv, P.x / pz, P.y / pz, P.w / pz, P.h / pz);
    else {
      // the back: plain paper, a shade cooler, with the print showing through (mirrored, as it is)
      if (!K.paperPat) K.paperPat = ctx.createPattern(night ? R.tex.paperN : R.tex.paper, 'repeat');
      ctx.fillStyle = K.paperPat; ctx.fill();
      ctx.fillStyle = night ? 'rgba(20,24,40,0.10)' : 'rgba(120,110,90,0.07)'; ctx.fill();
      ctx.globalAlpha = night ? 0.08 : 0.075; ctx.drawImage(P.cv, P.x / pz, P.y / pz, P.w / pz, P.h / pz); ctx.globalAlpha = 1;
      if (s.p === pl.cover) ufCover(ctx, pl, s, ink, night);
      else if (s.p.note) ufSeal(ctx, s.p, 4.2);
    }
    // light: paper turned from the light darkens, and past a point the pen hatches it
    const b0 = UF_LIGHT[2], b = Math.max(0, ufDot(s.nv, UF_LIGHT)), dk = clamp((b0 - b) / b0, 0, 1), lt = clamp((b - b0) / (1 - b0), 0, 1);
    if (dk > 0.01) { ctx.fillStyle = night ? 'rgba(4,6,14,' + (0.22 * dk) + ')' : 'rgba(58,50,38,' + (0.22 * dk) + ')'; ctx.fill(); }
    if (lt > 0.01) { ctx.fillStyle = 'rgba(255,253,246,' + (0.22 * lt) + ')'; ctx.fill(); }
    const hk = clamp((dk - 0.45) / 0.45, 0, 1);
    if (hk > 0) { ctx.globalAlpha = (night ? 0.16 : 0.2) * hk; ctx.fillStyle = ctx.createPattern(K.hatch, 'repeat'); ctx.fill(); ctx.globalAlpha = 1; }
    ctx.restore();
  };
  const edge = (s, alpha) => {
    if (alpha <= 0.004) return;
    const T = s.T;
    ctx.setTransform(pz, 0, 0, pz, tx, ty);
    ctx.beginPath();
    s.p.edge.forEach((e, i) => { const w = ufApply(T, [e[0], e[1], lift]), q = prj(w[0], w[1], w[2]); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); });
    ctx.closePath(); ctx.globalAlpha = alpha; ctx.strokeStyle = ink; ctx.lineWidth = Math.max(0.5, 1.05 * v.hw * 2 * 0.75); ctx.stroke(); ctx.globalAlpha = 1;
  };
  // 1) the paper lying on the table, bottom of a stack first
  const lying = st.filter((s) => !s.moving).sort((a, b) => a.key - b.key), turning = st.filter((s) => s.moving).sort((a, b) => a.key - b.key);
  if (allOpen) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(P.cv, P.x + tx, P.y + ty);
    for (const s of lying) edge(s, 0.42 * edgeA);
  } else for (const s of lying) { face(s); edge(s, (s.landed ? 0.42 * edgeA : 0.62)); }
  // 2) the shadows of the paper in the air, on the table and the paper lying there
  for (const s of turning) {
    const L = UF_LIGHT, sh = s.W.map((w) => prj(w[0] - w[2] * L[0] / L[2], w[1] - w[2] * L[1] / L[2], 0));
    const hgt = Math.max(...s.W.map((w) => w[2]));
    ctx.save(); ctx.setTransform(pz, 0, 0, pz, tx, ty); ctx.filter = 'blur(' + Math.max(1, 0.06 * hgt * pz).toFixed(1) + 'px)';
    ctx.beginPath(); ctx.moveTo(sh[0][0], sh[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(sh[i][0], sh[i][1]); ctx.closePath();
    ctx.fillStyle = night ? 'rgba(2,4,12,0.32)' : 'rgba(58,48,34,0.16)'; ctx.fill(); ctx.restore();
  }
  // 3) what stands: a pop-up card rising from its panel, overshooting a little, in the ordinary depth order; and
  // 4) the paper turning, farthest first. Before each turning panel, whatever stands behind its plane (a plane
  // between two things puts them in order); the rest after the last
  const D = UF.o.pop, up = [];
  for (const sd of pl.stands) { const u = (n - sd.at) / D; if (u > 0 && K.sprites.has(sd.ob)) up.push({ sd, u }); }
  const done = new Uint8Array(up.length);
  const stand = (i) => {
    const { sd, u } = up[i], sp = K.sprites.get(sd.ob); done[i] = 1;
    // its height scaled by k above its ground line y = gy + gb (x - gx), which stays put: one affine map
    const k = u >= 1 ? 1 : 1 + 2.6 * Math.pow(u - 1, 3) + 1.6 * Math.pow(u - 1, 2);
    if (k === 1) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(sp.cv, sp.x + tx, sp.y + ty); }
    else { ctx.setTransform(pz, pz * (1 - k) * sd.gb, 0, pz * k, tx, ty + pz * (1 - k) * (sd.gy - sd.gb * sd.gx)); ctx.drawImage(sp.cv, sp.x / pz, sp.y / pz, sp.w / pz, sp.h / pz); }
    if (sp.boil && !SF.noBoil) { ctx.setTransform(pz, pz * (1 - k) * sd.gb, 0, pz * k, tx, ty + pz * (1 - k) * (sd.gy - sd.gb * sd.gx)); for (const g of sp.boil[0]) { ctx.fillStyle = g.col; ctx.fill(g.path); } }
  };
  for (const s of turning) {
    const nf = ufDir(s.T, [0, 0, 1]), cam = ufDot(nf, UF_VIEW), w0 = s.W[0];
    for (let i = 0; i < up.length; i++) if (!done[i]) { const c = up[i].sd.c; if (cam * ((c[0] - w0[0]) * nf[0] + (c[1] - w0[1]) * nf[1] + (c[2] - w0[2]) * nf[2]) < 0) stand(i); }
    face(s); edge(s, 0.72);
  }
  for (let i = 0; i < up.length; i++) if (!done[i]) stand(i);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (v.clip) ctx.restore();
};
/* a small red seal in the middle of a panel's back (the satellites' notes) */
function ufSeal(ctx, p, r) {
  const cx = (p.poly[0][0] + p.poly[2][0]) / 2, cy = (p.poly[0][1] + p.poly[2][1]) / 2, F = (x, y) => prj(x, y, 0);
  const q = (m) => { const a = [F(cx - r + m, cy - r + m), F(cx + r - m, cy - r + m), F(cx + r - m, cy + r - m), F(cx - r + m, cy + r - m)]; ctx.beginPath(); ctx.moveTo(a[0][0], a[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(a[i][0], a[i][1]); ctx.closePath(); };
  ctx.save(); ctx.globalAlpha = 0.88; q(0); ctx.fillStyle = '#C4503C'; ctx.fill(); q(r * 0.3); ctx.strokeStyle = '#F3DCCF'; ctx.lineWidth = 0.7; ctx.stroke(); ctx.restore();
}
/* the cover: a double rule, a compass rose and a red seal, printed on the back of the top panel */
function ufCover(ctx, pl, s, ink, night) {
  const P = s.p.poly, x0 = P[0][0], y0 = P[0][1], x1 = P[2][0], y1 = P[2][1], cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const F = (x, y) => prj(x, y, 0);
  const rect = (m) => { const a = [F(x0 + m, y0 + m), F(x1 - m, y0 + m), F(x1 - m, y1 - m), F(x0 + m, y1 - m)]; ctx.beginPath(); ctx.moveTo(a[0][0], a[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(a[i][0], a[i][1]); ctx.closePath(); };
  ctx.save();
  ctx.strokeStyle = ink; ctx.globalAlpha = 0.85;
  ctx.lineWidth = 1.6; rect(7); ctx.stroke();
  ctx.lineWidth = 0.7; rect(10); ctx.stroke();
  // the rose: a ring, and a star of four long points and four short ones, each point half inked
  ctx.lineWidth = 0.9; ctx.beginPath();
  for (let i = 0; i <= 48; i++) { const a = i / 48 * TAU, q = F(cx + Math.cos(a) * 15, cy + Math.sin(a) * 15); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU - Math.PI / 4, r = i % 2 ? 11 : 22, wdt = i % 2 ? 2.2 : 3.4;
    const tip = F(cx + Math.cos(a) * r, cy + Math.sin(a) * r), l = F(cx + Math.cos(a + Math.PI / 2) * wdt, cy + Math.sin(a + Math.PI / 2) * wdt), rr = F(cx + Math.cos(a - Math.PI / 2) * wdt, cy + Math.sin(a - Math.PI / 2) * wdt), o = F(cx, cy);
    ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(l[0], l[1]); ctx.lineTo(tip[0], tip[1]); ctx.closePath(); ctx.fillStyle = ink; ctx.fill();
    ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(rr[0], rr[1]); ctx.lineTo(tip[0], tip[1]); ctx.closePath(); ctx.fillStyle = night ? '#2A3048' : '#F6F3EA'; ctx.fill(); ctx.lineWidth = 0.6; ctx.stroke();
  }
  // the seal, in a corner
  const sx = x1 - 26, sy = y1 - 26, seal = [F(sx, sy), F(sx + 11, sy), F(sx + 11, sy + 11), F(sx, sy + 11)];
  ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.moveTo(seal[0][0], seal[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(seal[i][0], seal[i][1]); ctx.closePath();
  ctx.fillStyle = '#C4503C'; ctx.fill();
  const in1 = [F(sx + 2.5, sy + 2.5), F(sx + 8.5, sy + 2.5), F(sx + 8.5, sy + 8.5), F(sx + 2.5, sy + 8.5)];
  ctx.beginPath(); ctx.moveTo(in1[0][0], in1[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(in1[i][0], in1[i][1]); ctx.closePath(); ctx.strokeStyle = '#F3DCCF'; ctx.lineWidth = 0.8; ctx.stroke();
  ctx.restore();
}
if (UF.on) {
  const draw0 = UF.draw0 = SF.draw;
  SF.draw = function (ctx, v, t, o) { return UF.covers(o, t) ? UF.draw(ctx, v, t, o) : draw0(ctx, v, t, o); };
}
