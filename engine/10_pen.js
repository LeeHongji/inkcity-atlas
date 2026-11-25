'use strict';
/* the pen and the paint.
   A recorder (G) turns drawing calls into a display list stored in wide px.
   Display lists are replayed into canvases at any zoom; line weight is applied at replay time,
   so a drawing is re-inked crisply at every zoom instead of being scaled. */

/* main-contour screen width (px) as one smooth curve through 1.4 @x1, 2.25 @x3, 4.8 @x9.3 */
function lineW(zoom) { const x = Math.log(Math.max(zoom, 0.3)); return Math.exp(0.336 + 0.3154 * x + 0.1065 * x * x); }

const K_FILL = 0, K_RIB = 1, K_STROKE = 2, K_DISC = 3, K_SEGS = 4, K_TRIS = 5, K_RING = 6;
const BOIL_N = 6;

function polyArea(p) { let a = 0; for (let i = 0, n = p.length; i < n; i += 2) { const j = (i + 2) % n; a += p[i] * p[j + 1] - p[j] * p[i + 1]; } return a / 2; }
function pointInPoly(x, y, p) {
  let inside = false;
  for (let i = 0, n = p.length, j = n - 2; i < n; j = i, i += 2) {
    const xi = p[i], yi = p[i + 1], xj = p[j], yj = p[j + 1];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function flat(pts) { const a = new Float32Array(pts.length * 2); for (let i = 0; i < pts.length; i++) { a[2 * i] = pts[i][0]; a[2 * i + 1] = pts[i][1]; } return a; }

/* Build one pen stroke: per-segment resample (corners are kept), sideways low-frequency wobble plus a tiny
   tremor, a speed-like width profile (a little heavier at the start, each end pools or flicks),
   and ends that overshoot or stop short by a hair. */
function mkRibbon(pts, seed, o) {
  const step = o.step || 2.6, wob = o.wob == null ? 1 : o.wob;
  let P = pts;
  if (o.close) P = pts.concat([pts[0]]);
  // end overshoot / undershoot (wide px)
  const r0 = h2(seed, 11), r1 = h2(seed, 12);
  const ext = o.close ? [0, 0] : [(o.ext == null ? 1 : o.ext) * (r0 < 0.18 ? -0.45 * h2(seed, 13) : 0.15 + 0.75 * r0 * r0),
                                  (o.ext == null ? 1 : o.ext) * (r1 < 0.18 ? -0.45 * h2(seed, 14) : 0.15 + 0.75 * r1 * r1)];
  const xs = [], ys = [], ss = [];
  let s = 0;
  for (let i = 0; i < P.length - 1; i++) {
    let ax = P[i][0], ay = P[i][1], bx = P[i + 1][0], by = P[i + 1][1];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
    if (len < 1e-4) continue;
    if (i === 0 && ext[0]) { ax -= dx / len * ext[0]; ay -= dy / len * ext[0]; }
    if (i === P.length - 2 && ext[1]) { bx += dx / len * ext[1]; by += dy / len * ext[1]; }
    const L = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.ceil(L / step));
    for (let k = (xs.length ? 1 : 0); k <= n; k++) { const t = k / n; xs.push(ax + (bx - ax) * t); ys.push(ay + (by - ay) * t); ss.push(s + L * t); }
    s += L;
  }
  const n = xs.length;
  if (n < 2) return null;
  const c = new Float32Array(n * 2), nr = new Float32Array(n * 2), w = new Float32Array(n);
  const amp = wob * Math.min(0.55, 0.2 + 0.004 * s), lam = 16 + 10 * h2(seed, 3);
  const startHeavy = h2(seed, 5) < 0.6, endKind = h2(seed, 6);          // <0.45 flick, <0.7 pool, else plain
  const taper = o.taper == null ? 1 : o.taper;
  for (let i = 0; i < n; i++) {
    const i0 = Math.max(0, i - 1), i1 = Math.min(n - 1, i + 1);
    let tx = xs[i1] - xs[i0], ty = ys[i1] - ys[i0];
    if (o.close && (i === 0 || i === n - 1)) { tx = xs[1] - xs[n - 2]; ty = ys[1] - ys[n - 2]; }
    const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const nx = -ty, ny = tx;
    const si = ss[i];
    // fade the wobble out at closed-loop seams so the loop meets itself
    const edge = o.close ? Math.min(1, Math.min(si, s - si) / 4) : 1;
    const off = edge * (amp * vnoise(si / lam, seed) + 0.06 * wob * vnoise(si / 2.3, seed + 7));
    c[2 * i] = xs[i] + nx * off; c[2 * i + 1] = ys[i] + ny * off;
    nr[2 * i] = nx; nr[2 * i + 1] = ny;
    let wi = 1 + 0.16 * vnoise(si / 21, seed + 21);
    if (!o.close && taper) {
      if (startHeavy) wi *= 1 + 0.28 * taper * Math.max(0, 1 - si / 2.2);
      const e = s - si;
      if (endKind < 0.45) wi *= 1 - 0.6 * taper * Math.max(0, 1 - e / 3.5);
      else if (endKind < 0.7) wi *= 1 + 0.3 * taper * Math.max(0, 1 - e / 1.8);
      if (o.flick) wi *= Math.min(1, 0.25 + e / (0.5 * s + 0.01)) * Math.min(1, 0.4 + si / (0.3 * s + 0.01));
    }
    w[i] = wi;
  }
  let bo = null;
  if (o.boil) {
    bo = new Float32Array(BOIL_N * n);
    for (let k = 0; k < BOIL_N; k++) for (let i = 0; i < n; i++) {
      bo[k * n + i] = 0.5 * vnoise(ss[i] / 8.5 + 31 * k, seed + 101 + k) + 0.22 * vnoise(ss[i] / 2.2, seed + 301 + k * 17);
    }
  }
  return { k: K_RIB, c, n: nr, w, len: s, bo };
}

class G {
  constructor(seed) {
    this.cmds = []; this.seed = typeof seed === 'string' ? hstr(seed) : (seed | 0); this.cnt = 0;
    this.ox = 0; this.oy = 0; this.oz = 0; this.stack = [];
    this.bb = [1e9, 1e9, -1e9, -1e9];
    this.ink = C.ink; this.boilP = 0.5; this.swap = false;
  }
  /* world -> wide px (with the recorder's current origin) */
  p(x, y, z) { return this.swap ? prj(this.ox + y, this.oy + x, this.oz + (z || 0)) : prj(this.ox + x, this.oy + y, this.oz + (z || 0)); }
  P(pts) { const o = new Array(pts.length); for (let i = 0; i < pts.length; i++) o[i] = this.p(pts[i][0], pts[i][1], pts[i][2]); return o; }
  /* draw with a shifted origin; swap=true mirrors the drawing across the X=Y diagonal (turns a +X-facing thing to face +Y) */
  at(x, y, z, fn, swap) {
    this.stack.push([this.ox, this.oy, this.oz, this.swap]);
    if (this.swap) { this.ox += y; this.oy += x; } else { this.ox += x; this.oy += y; }
    this.oz += (z || 0); if (swap) this.swap = !this.swap;
    fn(this);
    const s = this.stack.pop(); this.ox = s[0]; this.oy = s[1]; this.oz = s[2]; this.swap = s[3];
  }
  _bb(a) { const b = this.bb; for (let i = 0; i < a.length; i += 2) { if (a[i] < b[0]) b[0] = a[i]; if (a[i] > b[2]) b[2] = a[i]; if (a[i + 1] < b[1]) b[1] = a[i + 1]; if (a[i + 1] > b[3]) b[3] = a[i + 1]; } }
  _seed() { return (this.seed + Math.imul(++this.cnt, 2654435761)) | 0; }

  /* ----- wide-px (2-D) primitives ----- */
  fill2(pts, col, exact) {
    if (!col || pts.length < 3) return;
    let a = flat(pts);
    // a hair of hand-registration: vertices move by a position-keyed amount, so shared edges stay shared
    // (exact: off, for parts smaller than the wobble itself, such as a face)
    if (!exact) for (let i = 0; i < a.length; i += 2) { const k = Math.round(a[i] * 8) * 4099 + Math.round(a[i + 1] * 8); a[i] += (h2(k, 71) - 0.5) * 0.3; a[i + 1] += (h2(k, 72) - 0.5) * 0.3; }
    if (polyArea(a) < 0) { const r = new Float32Array(a.length); for (let i = 0, n = a.length / 2; i < n; i++) { r[2 * i] = a[2 * (n - 1 - i)]; r[2 * i + 1] = a[2 * (n - 1 - i) + 1]; } a = r; }
    this._bb(a); this.cmds.push({ k: K_FILL, p: a, c: col });
  }
  line2(pts, o) {
    o = o || {};
    if (pts.length < 2) return;
    const seed = this._seed(), wt = o.w == null ? 1 : o.w;
    const boil = o.co ? false : (o.boil == null ? (wt >= 0.7 && h2(seed, 91) < this.boilP) : !!o.boil);
    const r = mkRibbon(pts, seed, { close: o.close, boil, wob: o.wob, ext: o.ext, taper: o.taper, flick: o.flick, step: o.step });
    if (!r) return;
    r.col = o.c || this.ink; r.wt = wt; r.cons = o.cons !== false; if (o.co) r.co = true;
    this._bb(r.c); this.cmds.push(r);
  }
  fine2(pts, o) {
    o = o || {};
    if (pts.length < 2) return;
    const a = flat(o.close ? pts.concat([pts[0]]) : pts);
    this._bb(a); this.cmds.push({ k: K_STROKE, p: a, col: o.c || this.ink, wt: o.w == null ? 0.5 : o.w, cons: o.cons !== false });
  }
  /* outline of a polygon: each straight run is its own stroke, so corners are joined by hand */
  outline2(pts, o) {
    o = o || {};
    const n = pts.length; if (n < 2) return;
    const closed = o.open ? false : true;
    const corner = (i) => {
      const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n];
      const ux = b[0] - a[0], uy = b[1] - a[1], vx = c[0] - b[0], vy = c[1] - b[1];
      const d = (ux * vx + uy * vy) / ((Math.hypot(ux, uy) || 1) * (Math.hypot(vx, vy) || 1));
      return d < 0.82;
    };
    let starts = [];
    for (let i = 0; i < n; i++) if ((closed || (i > 0 && i < n - 1)) && corner(i)) starts.push(i);
    if (!closed) {
      let run = [pts[0]];
      for (let i = 1; i < n; i++) { run.push(pts[i]); if (starts.indexOf(i) >= 0) { this.line2(run, o); run = [pts[i]]; } }
      if (run.length > 1) this.line2(run, o);
      return;
    }
    if (starts.length === 0) { this.line2(pts, Object.assign({}, o, { close: true })); return; }
    for (let k = 0; k < starts.length; k++) {
      const a = starts[k], b = starts[(k + 1) % starts.length], run = [];
      let i = a; run.push(pts[i]);
      do { i = (i + 1) % n; run.push(pts[i]); } while (i !== b);
      if (o.skip && o.skip(k, run)) continue;
      this.line2(run, o);
    }
  }
  poly2(pts, col, o) { this.fill2(pts, col); if (o !== false) this.outline2(pts, o); }
  /* ----- night (see LOOK in 00_core.js) ----- */
  /* set properties on the fills drawn since command `from` (default: the last one): mark({ win: 0.6 }) a window pane lit
     60 % of the time (true: the scene's share); mark({ nc }) its colour at night: a colour, true (its own day colour: a
     lit sign, a lantern) or a function of its day colour (undefined: graded as usual); mark({ light: true }) in a
     person's or a car's drawing: this fill casts a halo */
  mark(o, from) {
    for (let k = from == null ? this.cmds.length - 1 : from; k < this.cmds.length; k++) {
      const d = this.cmds[k]; if (!d || !(d.k === K_FILL || d.k === K_DISC || d.k === K_TRIS)) continue;
      for (const key in o) { const v = o[key]; if (key !== 'nc') { d[key] = v; continue; } const c = v === true ? d.c : typeof v === 'function' ? v(d.c) : v; if (c) d.nc = c; }
    }
  }
  /* everything filled inside fn takes o at night: lit({ win: true }, fn) panes lit at the scene's share, lit({ nc }, fn) */
  lit(o, fn) { const i = this.cmds.length; fn(this); if (this.cmds.length > i) this.mark(o, i); }
  /* a light at a world point: kind 'lamp' (a halo and a pool of light on the ground), 'lantern' | 'neon' (a halo in its
     colour), 'tree' | 'bloom' (motes float over it). o: r (wide px), col, base (z of the ground under it), pool: false */
  glow(kind, x, y, z, o) { o = o || {}; this.glow2(kind, this.p(x, y, z), this.p(x, y, o.base || 0), o); }
  /* something this drawing lets fall in some seasons (SCENE.air[season].fall lists the kinds drawn): 'petal' from a cherry,
     'leaf' from a turned tree. pt where it starts (a crown's centre), gp the ground under it, o: r (wide px), cols, n */
  emit(kind, pt, gp, o) { o = o || {}; (this.emits || (this.emits = [])).push({ k: kind, x: pt[0], y: pt[1], gx: gp[0], gy: gp[1], r: o.r || 6, cols: o.cols || ['#C8663A'], n: o.n || 2 }); }
  /* the same in wide px: the light at pt, the ground under it at gp */
  glow2(kind, pt, gp, o) {
    o = o || {}; gp = gp || pt;
    (this.glows || (this.glows = [])).push({ k: kind, x: pt[0], y: pt[1], gx: gp[0], gy: gp[1], r: o.r || 3, col: o.col || null, pool: o.pool !== false });
  }
  disc2(pt, r, col) { if (r <= 0) return; this._bb([pt[0] - r, pt[1] - r, pt[0] + r, pt[1] + r]); this.cmds.push({ k: K_DISC, x: pt[0], y: pt[1], r, c: col }); }
  ring2(pt, r, o) { o = o || {}; this._bb([pt[0] - r, pt[1] - r, pt[0] + r, pt[1] + r]); this.cmds.push({ k: K_RING, x: pt[0], y: pt[1], r, col: o.c || this.ink, wt: o.w == null ? 0.6 : o.w, cons: true }); }
  /* batches of tiny marks */
  segs2(arr, col, wt, cons) { if (!arr.length) return; for (let i = 0; i < arr.length; i += 2400) { const a = Float32Array.from(arr.slice(i, i + 2400)); this._bb(a); this.cmds.push({ k: K_SEGS, p: a, col, wt: wt == null ? 0.5 : wt, cons: !!cons }); } }
  tris2(arr, col, cons) { if (!arr.length) return; for (let i = 0; i < arr.length; i += 2400) { const a = Float32Array.from(arr.slice(i, i + 2400)); this._bb(a); this.cmds.push({ k: K_TRIS, p: a, c: col, cons: !!cons }); } }

  /* ----- world (3-D) versions ----- */
  /* a 3-D fill also records how much it faces up (d.up: 1 flat ground or a box top, 0 a wall), for snow lying on it */
  fill(pts, col) {
    const n0 = this.cmds.length; this.fill2(this.P(pts), col);
    if (this.cmds.length > n0 && pts.length >= 3) {
      let nx = 0, ny = 0, nz = 0;
      for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], az = a[2] || 0, bz = b[2] || 0; nx += (a[1] - b[1]) * (az + bz); ny += (az - bz) * (a[0] + b[0]); nz += (a[0] - b[0]) * (a[1] + b[1]); }
      const l = Math.hypot(nx, ny, nz); if (l > 1e-9) this.cmds[this.cmds.length - 1].up = Math.abs(nz) / l;
    }
  }
  line(pts, o) { this.line2(this.P(pts), o); }
  fine(pts, o) { this.fine2(this.P(pts), o); }
  outline(pts, o) { this.outline2(this.P(pts), o); }
  poly(pts, col, o) { this.poly2(this.P(pts), col, o); }

  /* ----- marks inside paint (all take a wide-px polygon) ----- */
  _scatter(poly, n, seed, fn) {
    const a = flat(poly); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < a.length; i += 2) { x0 = Math.min(x0, a[i]); x1 = Math.max(x1, a[i]); y0 = Math.min(y0, a[i + 1]); y1 = Math.max(y1, a[i + 1]); }
    const area = Math.abs(polyArea(a));
    const cnt = typeof n === 'function' ? n(area) : n;
    const r = RNG(seed);
    let made = 0, tries = 0;
    while (made < cnt && tries < cnt * 12) {
      tries++;
      const x = x0 + (x1 - x0) * r(), y = y0 + (y1 - y0) * r();
      if (!pointInPoly(x, y, a)) continue;
      fn(x, y, r, a); made++;
    }
  }
  /* pale dry-brush scuffs: short strokes along dir (radians, screen) */
  scuff2(poly, o) {
    o = o || {};
    const dir = o.dir == null ? -0.5 : o.dir, len = o.len || 5, segs = [];
    const dens = o.dens == null ? 1 : o.dens;
    this._scatter(poly, o.n || ((A) => A / 55 * dens), this._seed(), (x, y, r, a) => {
      const l = len * (0.4 + r()), d = dir + (r() - 0.5) * (o.spread == null ? 0.25 : o.spread);
      const ex = x + Math.cos(d) * l, ey = y + Math.sin(d) * l;
      if (!pointInPoly(ex, ey, a)) return;
      segs.push(x, y, ex, ey);
    });
    this.segs2(segs, o.c || C.paveScuff, o.w == null ? 0.55 : o.w);
  }
  /* grass: dark tapered blades in groups of two or three, plus a few lighter ticks */
  grass2(poly, o) {
    o = o || {};
    const dens = o.dens == null ? 1 : o.dens, dark = [], light = [];
    this._scatter(poly, (A) => A / 70 * dens, this._seed(), (x, y, r) => {
      const k = 1 + (r() < 0.75 ? 1 : 0) + (r() < 0.35 ? 1 : 0), lightOne = r() < 0.22;
      for (let i = 0; i < k; i++) {
        const bx = x + (i - (k - 1) / 2) * 1.0 + (r() - 0.5) * 0.4, h = 1.5 + r() * 1.4, lean = (r() - 0.35) * 1.3, hw = 0.24 + r() * 0.1;
        (lightOne ? light : dark).push(bx - hw, y, bx + hw, y, bx + lean, y - h);
      }
    });
    this.tris2(dark, o.c || C.grassD, true); this.tris2(light, o.cl || C.grassL);
  }
  /* water: a few long shallow arcs and sparse white crests with room between them */
  water2(poly, o) {
    o = o || {};
    const dens = o.dens == null ? 1 : o.dens, arcs = [], crest = [];
    this._scatter(poly, (A) => A / 260 * dens, this._seed(), (x, y, r, a) => {
      const L = 6 + r() * 7, sag = 0.8 + r() * 0.7, tilt = 0.52 * (r() < 0.5 ? 1 : -1) * 0.25;
      const pts = [];
      for (let i = 0; i <= 4; i++) { const t = i / 4 - 0.5; pts.push([x + t * L, y + t * L * tilt + sag * (1 - 4 * t * t) * -1 + sag]); }
      if (!pointInPoly(pts[0][0], pts[0][1], a) || !pointInPoly(pts[4][0], pts[4][1], a)) return;
      const tgt = r() < 0.3 ? crest : arcs;
      for (let i = 0; i < 4; i++) tgt.push(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
    });
    this.segs2(arcs, o.c || '#7C9EC6', 0.62, true); this.segs2(crest, '#FCFDFB', 0.85);
  }
  /* a few ruled scratches on a face (slab sides, earth walls) */
  scratch2(poly, o) {
    o = o || {}; const segs = [];
    this._scatter(poly, (A) => A / 180 * (o.dens == null ? 1 : o.dens), this._seed(), (x, y, r, a) => {
      const l = 3 + r() * 9, d = (o.dir == null ? 0.5 : o.dir);
      const ex = x + Math.cos(d) * l, ey = y + Math.sin(d) * l;
      if (!pointInPoly(ex, ey, a)) return; segs.push(x, y, ex, ey);
    });
    this.segs2(segs, o.c || C.slabD, o.w == null ? 0.45 : o.w);
  }
  scuff(poly, o) { this.scuff2(this.P(poly), o); }
  grass(poly, o) { this.grass2(this.P(poly), o); }
  water(poly, o) { this.water2(this.P(poly), o); }
  scratch(poly, o) { this.scratch2(this.P(poly), o); }
}

/* ---------- replay ---------- */
/* ctx must already be scaled so 1 unit = 1 wide px. hw = half-width of a main contour in wide px.
   boilAmp = boil amplitude in wide px (0 = steady); variant = which of the six drawings.
   filter(cmd) may skip commands. */
function ribPath(ctx, r, hw, m, off, amp) {
  const c = r.c, nr = r.n, w = r.w, n = m == null ? w.length : m, h = hw * r.wt;
  if (n < 2) return;
  let i = 0, d = off < 0 ? 0 : r.bo[off] * amp;
  ctx.moveTo(c[0] + nr[0] * (d + w[0] * h), c[1] + nr[1] * (d + w[0] * h));
  for (i = 1; i < n; i++) { d = off < 0 ? 0 : r.bo[off + i] * amp; const k = d + w[i] * h; ctx.lineTo(c[2 * i] + nr[2 * i] * k, c[2 * i + 1] + nr[2 * i + 1] * k); }
  for (i = n - 1; i >= 0; i--) { d = off < 0 ? 0 : r.bo[off + i] * amp; const k = d - w[i] * h; ctx.lineTo(c[2 * i] + nr[2 * i] * k, c[2 * i + 1] + nr[2 * i + 1] * k); }
  ctx.closePath();
}
/* the colour a command is drawn in: its own by day, nightOf at night */
const colOf = (d, c) => (LOOK.night ? nightOf(d, c) : dayCol(c));
function replay(ctx, cmds, hw, opt) {
  opt = opt || {};
  const skipBoil = opt.skipBoil, onlyBoil = opt.onlyBoil, variant = opt.variant | 0, amp = opt.boilAmp || 0;
  let mode = -1, col = null, wt = -1, open = false;
  const flush = () => { if (!open) return; if (mode === 0) ctx.fill(); else ctx.stroke(); open = false; };
  const begin = (m, c, w) => {
    if (open && mode === m && col === c && (m === 0 || wt === w)) return;
    flush(); mode = m; col = c; wt = w;
    if (m === 0) ctx.fillStyle = c; else { ctx.strokeStyle = c; ctx.lineWidth = Math.max(0.35 * hw, w * hw * 2); }
    ctx.beginPath(); open = true;
  };
  for (let q = 0; q < cmds.length; q++) {
    const d = cmds[q];
    if (d.co) continue;                                  // construction-only line: seen while the tile is being drawn, never after
    if (onlyBoil && !(d.k === K_RIB && d.bo && d.live)) continue;
    switch (d.k) {
      case K_FILL: { begin(0, colOf(d, d.c), 0); const p = d.p; ctx.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]); ctx.closePath(); break; }
      case K_RIB: {
        if (skipBoil && d.bo && d.live) break;
        begin(0, colOf(d, d.col), 0);
        ribPath(ctx, d, hw, null, (d.bo && amp) ? variant * d.w.length : -1, amp); break;
      }
      case K_STROKE: { begin(1, colOf(d, d.col), d.wt); const p = d.p; ctx.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]); break; }
      case K_DISC: { begin(0, colOf(d, d.c), 0); ctx.moveTo(d.x + d.r, d.y); ctx.arc(d.x, d.y, d.r, 0, TAU); ctx.closePath(); break; }
      case K_RING: { begin(1, colOf(d, d.col), d.wt); ctx.moveTo(d.x + d.r, d.y); ctx.arc(d.x, d.y, d.r, 0, TAU); break; }
      case K_SEGS: { begin(1, colOf(d, d.col), d.wt); const p = d.p; for (let i = 0; i < p.length; i += 4) { ctx.moveTo(p[i], p[i + 1]); ctx.lineTo(p[i + 2], p[i + 3]); } break; }
      case K_TRIS: { begin(0, colOf(d, d.c), 0); const p = d.p; for (let i = 0; i < p.length; i += 6) { ctx.moveTo(p[i], p[i + 1]); ctx.lineTo(p[i + 2], p[i + 3]); ctx.lineTo(p[i + 4], p[i + 5]); ctx.closePath(); } break; }
    }
  }
  flush();
}
/* the construction-drawing pass: only the line work of a display list, each stroke grown to a fraction */
function strokeCount(d) { return d.k === K_RIB ? d.w.length : d.k === K_STROKE ? d.p.length / 2 : 0; }
function drawPartial(ctx, d, hw, f) {
  if (d.k === K_RIB) {
    const m = Math.max(2, Math.round(d.w.length * f)); ctx.fillStyle = colOf(d, d.col); ctx.beginPath(); ribPath(ctx, d, hw, m, -1, 0); ctx.fill();
  } else if (d.k === K_STROKE) {
    const p = d.p, m = Math.max(2, Math.round(p.length / 2 * f));
    ctx.strokeStyle = colOf(d, d.col); ctx.lineWidth = Math.max(0.35 * hw, d.wt * hw * 2); ctx.beginPath(); ctx.moveTo(p[0], p[1]); for (let i = 1; i < m; i++) ctx.lineTo(p[2 * i], p[2 * i + 1]); ctx.stroke();
  } else if (d.k === K_RING) {
    ctx.strokeStyle = colOf(d, d.col); ctx.lineWidth = Math.max(0.35 * hw, d.wt * hw * 2); ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, TAU * f); ctx.stroke();
  }
}
