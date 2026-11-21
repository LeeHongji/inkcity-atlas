'use strict';
/* Beijing's own kit (BJ, started in 36_hanzi.js with the lettering): Chinese roofs (hipped, hip-and-gable, gabled,
   pyramid and round, with concave slopes, upturned corners and a dark ridge with end curls), timber halls (red columns,
   lattice doors, the blue-green painted beam band under the eaves), white marble terraces with balustrades, red palace
   walls with yellow coping, grey-brick courtyard houses (siheyuan) with their red gates, autumn trees (ginkgo,
   persimmon, jujube, willow, pine), the people of Beijing, and its vehicles (taxi, bus, delivery tricycle, pedicab,
   shared bikes, e-bike riders). Everything in tile-local u unless the name ends in 2 (wide px). */
const BC = {
  yellow: '#E7B53C', yellowD: '#B88628', grey: '#8E9197', greyD: '#6A6E75', green: '#4F8F6A',
  red: '#B5463C', redD: '#8E3329', redL: '#C65A4D', column: '#B33A2F', lattice: '#9C3A2C',
  marble: '#F2EFE7', marbleD: '#DAD5C8', marbleS: '#E6E2D7', brick: '#A7A6A0', brickL: '#BAB8B1', brickD: '#8F8D87',
  band: '#3F8A80', band2: '#3E679E', gold: '#D9A63A',
  ground: '#E4DFD3', hutong: '#D8D2C5', pave: '#E6E2D8', asph: '#CBC7BE',
  ginkgo: '#F0BE2C', ginkgoL: '#F7D660', ginkgoInk: '#A9781E', persimmon: '#EE7A2B', maple: '#D45A38',
  pine: '#4E6E4B', pineD: '#3E5A3C', willow: '#B9C46A', willowD: '#94A04E',
  water: '#9FC4DC', waterD: '#7FA5C2', lake: '#A7CAE0',
};

/* ---------------- roofs ---------------- */
/* a Chinese roof over the wall box [x0,y0,x1,y1] at eave height z, rising h.
   o.type: 'hip' (庑殿, four slopes to a short ridge), 'xie' (歇山, hip below and a gable above on the short ends),
   'gable' (硬山, two slopes, flush gable walls), 'pyr' (攒尖, a pyramid to a finial). o.top (0..1): stop the slopes at
   this level (no ridge): the lower skirt of a double-eaved roof. The slopes are concave (shallow at the eaves, steep at
   the ridge: two bands per slope), the eaves overhang by o.over and the corners turn up by o.lift. */
BJ.roof = function (g, x0, y0, x1, y1, z, h, o) {
  o = o || {}; const type = o.type || 'hip', ov = o.over == null ? 1.6 : o.over, lift = o.lift == null ? 0.7 : o.lift, col = o.col || BC.grey;
  const alongX = o.ridge ? o.ridge === 'x' : (x1 - x0) >= (y1 - y0), top = o.top == null ? 1 : o.top;
  const W = alongX ? (u, v, zz) => [u, v, zz] : (u, v, zz) => [v, u, zz];
  const U0 = (alongX ? x0 : y0) - ov, U1 = (alongX ? x1 : y1) + ov, V0 = (alongX ? y0 : x0) - ov, V1 = (alongX ? y1 : x1) + ov;
  const half = (V1 - V0) / 2, Lh = (U1 - U0) / 2;
  const dI = type === 'gable' ? 0 : type === 'pyr' ? Lh : Math.min(half * (type === 'xie' ? 1 : 1.05), Lh - 0.01), dg = 0.5;
  // the profile: (d = fraction of the way in from the eave to the ridge line, e = fraction of the height)
  const prof = [[0, 0], [0.42, 0.3], [1, 1]].filter((p) => p[0] <= top + 1e-6);
  if (prof[prof.length - 1][0] < top) prof.push([top, top < 0.42 ? top / 0.42 * 0.3 : 0.3 + (top - 0.42) / 0.58 * 0.7]);
  const uin = (d) => (type === 'xie' ? Math.min(d, dg) : d) * dI;
  const zAt = (e) => z + h * e;
  const N = 8;
  // a ring at level k: the four edges sampled, corner lift only on the eave ring
  const edge = (k, side) => {   // side: 'F' (+v), 'B' (-v), 'E' (+u end), 'A' (-u end); returns points left to right as seen
    const [d, e] = prof[k], ua = U0 + uin(d), ub = U1 - uin(d), va = V0 + half * d, vb = V1 - half * d, zz = zAt(e), L = k === 0 ? lift : k === 1 ? lift * 0.25 : 0;
    const pts = [], n = side === 'F' || side === 'B' ? N : 5;
    for (let i = 0; i <= n; i++) {
      const t = i / n, up = L * Math.pow(Math.abs(2 * t - 1), 3);
      if (side === 'F') pts.push(W(lerp(ua, ub, t), vb, zz + up)); else if (side === 'B') pts.push(W(lerp(ub, ua, t), va, zz + up));
      else if (side === 'E') pts.push(W(ub, lerp(vb, va, t), zz + up)); else pts.push(W(ua, lerp(va, vb, t), zz + up));
    }
    return pts;
  };
  const tone = (s, k) => { const b = s === 'F' ? (alongX ? -0.12 : 0.06) : s === 'E' ? (alongX ? 0.08 : -0.12) : s === 'B' ? 0.2 : 0.12; return shade(col, b + (k === 0 ? 0.04 : -0.02)); };
  const band = (s, k) => { const a = edge(k, s), b = edge(k + 1, s); return a.concat(b.slice().reverse()); };
  const ink = o.c || shade(col, 0.5), lo = { w: o.w || 0.9, c: ink }, li = { w: (o.w || 0.9) * 0.65, c: ink };
  const K_ = prof.length - 1;
  const ends = type === 'gable' ? [] : ['A', 'E'];
  // back slopes first, then the -u end, then the visible end and the front slope
  for (let k = 0; k < K_; k++) { g.fill(band('B', k), tone('B', k)); }
  for (const s of ends) for (let k = 0; k < K_; k++) {
    if (type === 'xie' && prof[k][0] >= dg - 1e-6) continue;
    g.fill(band(s, k), tone(s, k));
  }
  // gable faces: the triangle above level dg (xie) or the whole end (gable)
  const gableAt = (s) => {
    if (type !== 'xie' && type !== 'gable') return null;
    const d0 = type === 'xie' ? dg : 0, u = s === 'E' ? U1 - d0 * dI : U0 + d0 * dI;
    const pts = [], ks = prof.map((p, i) => i).filter((i) => prof[i][0] >= d0 - 1e-6 || type === 'gable');
    if (type === 'xie') {   // the triangle from the dg level to the ridge
      const eg = 0.3 + (dg - 0.42) / 0.58 * 0.7, zg = zAt(eg);
      return [W(u, V0 + half * dg, zg), W(u, V1 - half * dg, zg), W(u, (V0 + V1) / 2, zAt(top))];
    }
    for (const i of ks) pts.push(W(u, V1 - half * prof[i][0], zAt(prof[i][1])));
    for (let i = ks.length - 2; i >= 0; i--) pts.push(W(u, V0 + half * prof[ks[i]][0], zAt(prof[ks[i]][1])));
    return pts;
  };
  if (type === 'gable' || type === 'xie') {
    const gA = gableAt('A'); if (gA && type === 'xie') { g.fill(gA, shade(o.gcol || col, 0.15)); }
  }
  if (type === 'xie') {   // the upper slopes of the sides above dg join the gable: fill the xie side triangles' roof (front/back already lofted)
    const gE = gableAt('E'); g.fill(gE, o.gcol || BC.red); g.outline(gE, li);
    const tri = []; const segs = [];
    for (let i = 1; i < 5; i++) { const t = i / 5, a = g.p.apply(g, lerp3(gE[0], gE[1], t)), b = g.p.apply(g, lerp3(t < 0.5 ? gE[0] : gE[1], gE[2], t < 0.5 ? t * 2 : (1 - t) * 2)); segs.push(a[0], a[1], b[0], b[1]); }
    g.segs2(segs, shade(o.gcol || BC.red, 0.35), 0.28); void tri;
  }
  for (let k = 0; k < K_; k++) {
    if (!(type === 'xie' && prof[k][0] >= dg - 1e-6) && ends.length) g.fill(band('E', k), tone('E', k));
    g.fill(band('F', k), tone('F', k));
  }
  if (type === 'gable') { const gE = gableAt('E'); g.fill(gE, o.gcol || BC.brick); g.outline(gE, li); }
  // tile channels down the visible slopes
  if (o.tiles !== false) {
    const segs = [], sp = o.sp || 0.9;
    for (let k = 0; k < K_; k++) {
      const a = edge(k, 'F'), b = edge(k + 1, 'F');
      const n = Math.max(2, Math.round((U1 - U0) / sp));
      for (let i = 1; i < n; i++) { const t = i / n, p = lerp3s(a, t), q = lerp3s(b, t); const P0 = g.p.apply(g, p), P1 = g.p.apply(g, q); segs.push(P0[0], P0[1], P1[0], P1[1]); }
      if (ends.length && !(type === 'xie' && prof[k][0] >= dg - 1e-6)) {
        const c = edge(k, 'E'), d = edge(k + 1, 'E'), m = Math.max(2, Math.round((V1 - V0) / sp));
        for (let i = 1; i < m; i++) { const t = i / m, p = lerp3s(c, t), q = lerp3s(d, t); const P0 = g.p.apply(g, p), P1 = g.p.apply(g, q); segs.push(P0[0], P0[1], P1[0], P1[1]); }
      }
    }
    g.segs2(segs, o.tc || shade(col, 0.28), 0.3);
  }
  // lines: the eave fronts (and a pale eave edge), the hips, the ridge
  const e0F = edge(0, 'F'), e0E = edge(0, 'E');
  g.line(e0F, lo); if (ends.length) g.line(e0E, lo); else g.line([e0F[N], edge(0, 'B')[0]], lo);
  if (ends.length) {
    for (const [s, c0] of [['F', 0], ['F', N], ['B', 0]]) {   // hips from the eave corners
      const pts = []; for (let k = 0; k <= K_; k++) { if (type === 'xie' && prof[k][0] > dg + 1e-6) break; pts.push(edge(k, s)[c0 === 0 ? 0 : (s === 'F' || s === 'B' ? N : 5)]); }
      g.line(pts, s === 'B' ? { w: 0.5, c: ink } : li);
    }
  }
  if (top >= 1) {
    const A = W(U0 + uin(1), (V0 + V1) / 2, zAt(1)), B = W(U1 - uin(1), (V0 + V1) / 2, zAt(1)), rA = g.p.apply(g, A), rB = g.p.apply(g, B);
    const rc = o.rc || shade(col, 0.42);
    if (type === 'pyr') {
      const f = g.p.apply(g, W((U0 + U1) / 2, (V0 + V1) / 2, zAt(1)));
      g.fill2([[f[0] - 0.9, f[1]], [f[0] + 0.9, f[1]], [f[0] + 0.5, f[1] - 2.6], [f[0] - 0.5, f[1] - 2.6]], o.fin || BC.gold); g.disc2([f[0], f[1] - 3.0], 1.0, o.fin || BC.gold);
      g.ring2([f[0], f[1] - 3.0], 1.0, { w: 0.35, c: '#7A5A20' });
    } else {
      g.line2([rA, rB], { w: o.rw || 1.8, c: rc, boil: false, ext: 0 });
      // ridge-end curls (吻 on palaces, a raised tail on houses)
      const cs = o.curl == null ? 1 : o.curl;
      if (cs) { for (const [p, sg] of [[rA, -1], [rB, 1]]) { g.fill2([[p[0] - 0.7, p[1] + 0.6], [p[0] + 0.7, p[1] + 0.6], [p[0] + sg * 0.9 * cs, p[1] - 2.2 * cs], [p[0] - sg * 0.3, p[1] - 2.6 * cs]], rc, true); } }
    }
  }
  return { zt: zAt(top), U0, U1, V0, V1 };
};
function lerp3(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
function lerp3s(pts, t) { const f = t * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)); return lerp3(pts[i], pts[i + 1], f - i); }

/* a round roof (the Temple of Heaven): concave cone over radius r at z rising h; o.top < 1: a skirt to that level */
BJ.roundRoof = function (g, cx, cy, r, z, h, o) {
  o = o || {}; const col = o.col || '#3F64A8', top = o.top == null ? 1 : o.top, n = 28, lift = o.lift == null ? 0.3 : o.lift;
  const prof = [[0, 0], [0.42, 0.3], [top, top < 0.42 ? top / 0.42 * 0.3 : 0.3 + (top - 0.42) / 0.58 * 0.7]];
  const ring = (k, a) => { const [d, e] = prof[k], rr = r * (1 - d) + (k === 2 && top >= 1 ? 0 : 0); return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, z + h * e + (k === 0 ? lift * (0.5 + 0.5 * Math.cos(a * 8)) * 0 : 0)]; };
  const facets = [];
  for (let k = 0; k < 2; k++) for (let i = 0; i < n; i++) {
    const a0 = TAU * i / n, a1 = TAU * (i + 1) / n, am = (a0 + a1) / 2;
    const q = [ring(k, a0), ring(k, a1), ring(k + 1, a1), ring(k + 1, a0)], lit = clamp(0.5 + 0.5 * Math.cos(am - Math.PI * 0.75), 0, 1);
    facets.push({ q, d: Math.cos(am) + Math.sin(am) + k * 0.01, c: mix(shade(col, 0.22), shade(col, -0.14), lit) });
  }
  facets.sort((a, b) => a.d - b.d);
  for (const f of facets) g.fill(f.q, f.c);
  const segs = [];
  for (let i = 0; i < 40; i++) { const a = A_R + (A_L - A_R) * i / 39; for (let k = 0; k < 2; k++) { const p = g.p.apply(g, ring(k, a)), q = g.p.apply(g, ring(k + 1, a)); segs.push(p[0], p[1], q[0], q[1]); } }
  g.segs2(segs, shade(col, 0.3), 0.28);
  const eave = []; for (let i = 0; i <= 24; i++) eave.push(ring(0, A_L + (A_R + TAU - A_L) * i / 24 - TAU));
  const eave2 = []; for (let i = 0; i <= 24; i++) { const a = A_R + (A_L - A_R) * i / 24; eave2.push(ring(0, a)); }
  g.line(eave2, { w: 0.9, c: shade(col, 0.5) }); void eave;
  if (top < 1) { const rim = []; for (let i = 0; i <= 24; i++) rim.push(ring(2, A_R + (A_L - A_R) * i / 24)); g.line(rim, { w: 0.6, c: shade(col, 0.5) }); }
  return z + h * prof[2][1];
};

/* ---------------- timber halls ---------------- */
/* the walls of a hall between z0 and z1: red columns at each bay on the faces we see, red lattice doors between them,
   and the painted beam band (blue and green) under the eaves. o.bays: number of bays along x (L face) and y (R face) */
BJ.hallBody = function (g, x0, y0, x1, y1, z0, z1, o) {
  o = o || {}; const red = o.red || BC.red, H = z1 - z0, bandH = Math.min(1.1, H * 0.2);
  K.box(g, x0, y0, x1, y1, z0, z1, { t: shade(red, -0.1), l: red, r: shade(red, 0.12) }, { w: 0.8 });
  for (const [f, p, a0, a1, nb] of [['L', y1, x0, x1, o.bx || Math.max(1, Math.round((x1 - x0) / 3.2))], ['R', x1, y0, y1, o.by || Math.max(1, Math.round((y1 - y0) / 3.2))]]) {
    const segs = [], bw = (a1 - a0) / nb;
    for (let i = 0; i < nb; i++) {
      const b0 = a0 + i * bw + 0.32, b1 = a0 + (i + 1) * bw - 0.32;
      if (o.doors !== false) {
        const q = K.on(f, p + 0.03, b0, b1, z0 + 0.25, z1 - bandH - 0.15); g.fill(q, f === 'L' ? o.door || BC.lattice : shade(o.door || BC.lattice, 0.12));
        // the lattice: a grid of fine bars in the upper two thirds
        const zm = lerp(z0 + 0.25, z1 - bandH - 0.15, 0.35);
        for (let a = b0 + 0.45; a < b1 - 0.2; a += 0.45) { const P0 = g.p.apply(g, K.pt(f, p + 0.05, a, zm)), P1 = g.p.apply(g, K.pt(f, p + 0.05, a, z1 - bandH - 0.2)); segs.push(P0[0], P0[1], P1[0], P1[1]); }
        for (let zz = zm; zz < z1 - bandH - 0.2; zz += 0.5) { const P0 = g.p.apply(g, K.pt(f, p + 0.05, b0, zz)), P1 = g.p.apply(g, K.pt(f, p + 0.05, b1, zz)); segs.push(P0[0], P0[1], P1[0], P1[1]); }
        const P0 = g.p.apply(g, K.pt(f, p + 0.05, b0, zm)), P1 = g.p.apply(g, K.pt(f, p + 0.05, b1, zm)); segs.push(P0[0], P0[1], P1[0], P1[1]);
      }
      // a column at the bay's start
      const c0 = g.p.apply(g, K.pt(f, p + 0.06, a0 + i * bw, z0)), c1 = g.p.apply(g, K.pt(f, p + 0.06, a0 + i * bw, z1 - bandH));
      g.fill2([[c0[0] - 0.55, c0[1]], [c0[0] + 0.55, c0[1]], [c1[0] + 0.55, c1[1]], [c1[0] - 0.55, c1[1]]], o.column || BC.column, true);
    }
    if (segs.length) g.segs2(segs, shade(o.door || BC.lattice, 0.4), 0.22);
    // the painted beam band: blue-green with a gold line
    const bq = K.on(f, p + 0.04, a0, a1, z1 - bandH, z1); g.fill(bq, f === 'L' ? (o.band || BC.band) : shade(o.band || BC.band, 0.12));
    const bq2 = K.on(f, p + 0.05, a0, a1, z1 - bandH * 0.55, z1 - bandH * 0.25); g.fill(bq2, f === 'L' ? (o.band2 || BC.band2) : shade(o.band2 || BC.band2, 0.12));
    const gl = [K.pt(f, p + 0.06, a0, z1 - bandH * 0.62), K.pt(f, p + 0.06, a1, z1 - bandH * 0.62)]; g.fine(gl, { w: 0.25, c: '#E9C55A' });
    const c0 = g.p.apply(g, K.pt(f, p + 0.06, a1, z0)), c1 = g.p.apply(g, K.pt(f, p + 0.06, a1, z1 - bandH));
    g.fill2([[c0[0] - 0.55, c0[1]], [c0[0] + 0.55, c0[1]], [c1[0] + 0.55, c1[1]], [c1[0] - 0.55, c1[1]]], o.column || BC.column, true);
  }
};
/* a white marble terrace (or a plinth) with a balustrade along the edges we see and steps down the middle of its
   front (L) face. o.steps: 'L' | 'R' | 'LR' | ''. o.rail: false for none */
BJ.terrace = function (g, x0, y0, x1, y1, z0, z1, o) {
  o = o || {}; const col = o.col || { t: BC.marbleS, l: BC.marble, r: BC.marbleD };
  K.box(g, x0, y0, x1, y1, z0, z1, col, { w: 0.85 });
  // a moulding line and slab joints on the faces
  const segs = [];
  for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
    const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z1 - 0.35)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z1 - 0.35)); segs.push(a[0], a[1], b[0], b[1]);
    for (let s = a0 + 1.6; s < a1; s += 1.6) { const P0 = g.p.apply(g, K.pt(f, p + 0.02, s, z0)), P1 = g.p.apply(g, K.pt(f, p + 0.02, s, z1 - 0.35)); segs.push(P0[0], P0[1], P1[0], P1[1]); }
  }
  g.segs2(segs, '#B9B3A4', 0.26);
  const steps = o.steps == null ? 'L' : o.steps, sw = o.sw || Math.min(6, (x1 - x0) * 0.25);
  if (o.rail !== false) BJ.rail(g, x0, y0, x1, y1, z1, { gapL: steps.indexOf('L') >= 0 ? [(x0 + x1) / 2 - sw / 2, (x0 + x1) / 2 + sw / 2] : null, gapR: steps.indexOf('R') >= 0 ? [(y0 + y1) / 2 - sw / 2, (y0 + y1) / 2 + sw / 2] : null, back: o.back !== false });
  if (steps.indexOf('L') >= 0) BJ.stairs(g, 'L', y1, (x0 + x1) / 2, sw, z0, z1);
  if (steps.indexOf('R') >= 0) BJ.stairs(g, 'R', x1, (y0 + y1) / 2, sw, z0, z1);
};
/* a balustrade: white posts with round heads and a rail, along the top edges of a box (the visible two, and the back
   two thinner if o.back) */
BJ.rail = function (g, x0, y0, x1, y1, z, o) {
  o = o || {}; const hh = o.h || 1.1, segs = [], dots = [];
  const run = (A, B, gap) => {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), n = Math.max(1, Math.round(L / 1.2));
    let prev = null;
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = lerp(A[0], B[0], t), y = lerp(A[1], B[1], t), s = A[0] === B[0] ? y : x;
      if (gap && s > gap[0] && s < gap[1]) { prev = null; continue; }
      const p0 = g.p(x, y, z), p1 = g.p(x, y, z + hh); segs.push(p0[0], p0[1], p1[0], p1[1]); dots.push(p1);
      const r = g.p(x, y, z + hh * 0.75); if (prev) segs.push(prev[0], prev[1], r[0], r[1]); prev = r;
    }
  };
  if (o.back) { run([x0, y0], [x1, y0]); run([x0, y0], [x0, y1]); }
  run([x0, y1], [x1, y1], o.gapL); run([x1, y0], [x1, y1], o.gapR);
  g.segs2(segs, '#A9A394', 0.5);
  for (const d of dots) g.disc2([d[0], d[1] - 0.3], 0.42, '#F7F5EF');
};
/* steps down from a terrace face: face 'L' (plane y = p, centred at a, width w) runs out to +y; 'R' to +x */
BJ.stairs = function (g, face, p, a, w, z0, z1) {
  const run = (z1 - z0) * 1.3, n = Math.max(3, Math.round((z1 - z0) / 0.45));
  const P = (s, d, zz) => face === 'L' ? [a + s, p + d, zz] : [p + d, a + s, zz];
  for (let i = 0; i < n; i++) {
    const zt = lerp(z1, z0, i / n), zb = lerp(z1, z0, (i + 1) / n), d0 = run * i / n, d1 = run * (i + 1) / n;
    g.fill([P(-w / 2, d0, zt), P(w / 2, d0, zt), P(w / 2, d1, zt), P(-w / 2, d1, zt)], i % 2 ? '#EDE9DF' : '#F4F1EA');
    g.fill([P(-w / 2, d1, zt), P(w / 2, d1, zt), P(w / 2, d1, zb), P(-w / 2, d1, zb)], '#DCD7CB');
  }
  // the carved ramp in the middle (the dragon slab) and the side walls
  g.fill([P(-w * 0.18, 0, z1 + 0.02), P(w * 0.18, 0, z1 + 0.02), P(w * 0.18, run, z0 + 0.02), P(-w * 0.18, run, z0 + 0.02)], '#E9E3D3');
  g.fine([P(-w * 0.18, 0, z1 + 0.03), P(-w * 0.18, run, z0 + 0.03)], { w: 0.3, c: '#B9B3A4' }); g.fine([P(w * 0.18, 0, z1 + 0.03), P(w * 0.18, run, z0 + 0.03)], { w: 0.3, c: '#B9B3A4' });
  const sideA = [P(w / 2, 0, z1), P(w / 2, run, z0), P(w / 2, 0, z0)];
  g.fill(sideA, '#E3DED2'); g.outline([P(-w / 2, 0, z1), P(-w / 2, run, z0), P(w / 2, run, z0), P(w / 2, 0, z1)], { w: 0.6, boil: false });
};

/* ---------------- walls ---------------- */
/* a palace wall: red plaster on a grey base, a small yellow (or grey) tiled coping on top. Along x or y */
BJ.wall = function (g, x0, y0, x1, y1, h, o) {
  o = o || {}; const red = o.red || BC.red;
  K.box(g, x0, y0, x1, y1, 0, 0.8, { t: '#B9B6AE', l: '#A9A69E', r: '#97948D' }, { w: 0.6, boil: false });
  K.box(g, x0, y0, x1, y1, 0.8, h, { t: shade(red, -0.08), l: red, r: shade(red, 0.12) }, { w: 0.75, boil: false });
  const alongX = (x1 - x0) >= (y1 - y0);
  BJ.roof(g, x0, y0, x1, y1, h, o.ch || 1.1, { type: 'gable', col: o.cap || BC.yellow, over: 0.5, lift: 0, ridge: alongX ? 'x' : 'y', tiles: false, curl: 0, rw: 1.0, w: 0.6, gcol: shade(red, 0.15) });
};
/* a grey-brick wall (hutong walls, courtyard fronts) with a tiled coping */
BJ.greyWall = function (g, x0, y0, x1, y1, h, o) {
  o = o || {};
  K.box(g, x0, y0, x1, y1, 0, h, { t: BC.brickL, l: BC.brickL, r: BC.brick }, { w: 0.7, boil: false });
  const segs = [];
  for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) for (let z = 0.5; z < h; z += 0.5) { const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z)); segs.push(a[0], a[1], b[0], b[1]); }
  g.segs2(segs, '#9E9C95', 0.2);
  const alongX = (x1 - x0) >= (y1 - y0);
  BJ.roof(g, x0, y0, x1, y1, h, 0.8, { type: 'gable', col: BC.grey, over: 0.35, lift: 0, ridge: alongX ? 'x' : 'y', tiles: false, curl: 0, rw: 0.9, w: 0.55, gcol: BC.brick });
};

/* ---------------- courtyard houses ---------------- */
/* one grey wing of a courtyard house: brick walls, a gabled grey roof with the ridge along its length. o.front: the face
   towards the courtyard that we can see ('L' or 'R'), which gets red-brown lattice windows and a door; other visible
   faces are plain brick with a small high window. Returns the eave height. */
BJ.wing = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const h = o.h || 4.2, rh = o.rh || 2.6, alongX = (x1 - x0) >= (y1 - y0);
  K.box(g, x0, y0, x1, y1, 0, h, { t: BC.brickL, l: '#C2C0B9', r: '#AEACA5' }, { w: 0.8 });
  K.box(g, x0, y0, x1, y1, 0, 0.7, { t: BC.brick, l: '#A3A19A', r: '#93918A' }, { w: 0.5, boil: false, nohid: true, faces: "lr" });
  for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
    if (f === o.front) {
      const L = a1 - a0, nb = Math.max(1, Math.round(L / 3.4)), bw = L / nb;
      for (let i = 0; i < nb; i++) {
        const b0 = a0 + i * bw + 0.3, b1 = a0 + (i + 1) * bw - 0.3, door = i === Math.floor(nb / 2);
        const q = K.on(f, p + 0.03, b0, b1, door ? 0.15 : 1.1, h - 0.55); g.fill(q, door ? '#8E3A2C' : '#A54A36');
        const inner = K.on(f, p + 0.05, b0 + 0.25, b1 - 0.25, door ? 2.6 : 1.6, h - 0.85); g.fill(inner, '#E8E2CF');
        const segs = []; for (let a = b0 + 0.6; a < b1 - 0.3; a += 0.55) { const P0 = g.p.apply(g, K.pt(f, p + 0.06, a, door ? 2.6 : 1.6)), P1 = g.p.apply(g, K.pt(f, p + 0.06, a, h - 0.85)); segs.push(P0[0], P0[1], P1[0], P1[1]); }
        for (let zz = (door ? 2.6 : 1.6) + 0.5; zz < h - 0.9; zz += 0.55) { const P0 = g.p.apply(g, K.pt(f, p + 0.06, b0 + 0.25, zz)), P1 = g.p.apply(g, K.pt(f, p + 0.06, b1 - 0.25, zz)); segs.push(P0[0], P0[1], P1[0], P1[1]); }
        g.segs2(segs, '#A54A36', 0.2);
        if (door && o.fu) { const c = g.p.apply(g, K.pt(f, p + 0.08, (b0 + b1) / 2, 1.6)); BJ.fu2(g, c, 1.6); }
      }
      // red posts at the bay lines and the painted band
      const segs = []; for (let i = 0; i <= nb; i++) { const P0 = g.p.apply(g, K.pt(f, p + 0.06, a0 + i * bw, 0.7)), P1 = g.p.apply(g, K.pt(f, p + 0.06, a0 + i * bw, h)); segs.push(P0[0], P0[1], P1[0], P1[1]); }
      g.segs2(segs, '#8E3A2C', 0.9);
      g.fill(K.on(f, p + 0.05, a0, a1, h - 0.5, h), o.band || '#4C7E78');
    } else if (o.back !== false) {
      const am = (a0 + a1) / 2; g.fill(K.on(f, p + 0.03, am - 0.9, am + 0.9, h - 1.6, h - 0.7), '#5F5A52');
    }
  }
  BJ.roof(g, x0, y0, x1, y1, h, rh, { type: 'gable', col: o.roof || BC.grey, over: 0.7, lift: 0.15, ridge: alongX ? 'x' : 'y', rw: 1.4, gcol: '#B5B3AC', curl: 0.6 });
  return h;
};
/* a red courtyard gate (on a wall face): a little gatehouse with its own roof, red double doors with brass knockers, two
   stone drums. face 'L' (opening to +y) or 'R' (to +x); a: its centre along the face */
BJ.gate = function (g, face, p, a, o) {
  o = o || {}; const w = o.w || 3.4, h = o.h || 4.6, d = 1.4;
  const box = face === 'L' ? [a - w / 2, p - d, a + w / 2, p + 0.4] : [p - d, a - w / 2, p + 0.4, a + w / 2];
  K.box(g, box[0], box[1], box[2], box[3], 0, h, { t: BC.brickL, l: '#C2C0B9', r: '#AEACA5' }, { w: 0.7 });
  const fp = face === 'L' ? box[3] : box[2];
  const q = K.on(face, fp + 0.03, a - w * 0.36, a + w * 0.36, 0, h - 1.0); g.fill(q, o.door || '#B8382E'); g.outline(q, { w: 0.5, c: '#5E1E16', boil: false });
  g.line([K.pt(face, fp + 0.05, a, 0), K.pt(face, fp + 0.05, a, h - 1.0)], { w: 0.35, c: '#5E1E16', boil: false });
  for (const s of [-0.35, 0.35]) { const c = g.p.apply(g, K.pt(face, fp + 0.06, a + s, 2.1)); g.disc2(c, 0.28, '#D9A63A'); }
  // couplets or a 福 on the doors
  if (o.fu !== false) { const c = g.p.apply(g, K.pt(face, fp + 0.07, a - w * 0.18, 3.0)); BJ.fu2(g, [c[0], c[1]], 1.25); const c2 = g.p.apply(g, K.pt(face, fp + 0.07, a + w * 0.18, 3.0)); BJ.fu2(g, [c2[0], c2[1]], 1.25); }
  g.fill(K.on(face, fp + 0.04, a - w / 2, a + w / 2, h - 1.0, h - 0.5), '#4C7E78');
  // two stone drums at the foot
  for (const s of [-1, 1]) { const c = face === 'L' ? [a + s * w * 0.42, fp + 0.6] : [fp + 0.6, a + s * w * 0.42]; K.cyl(g, c[0], c[1], 0.45, 0, 1.0, { t: '#D9D5CB', l: '#C9C5BA', r: '#B5B1A6' }, { w: 0.4, n: 8 }); }
  BJ.roof(g, box[0], box[1], box[2], box[3], h, 1.6, { type: 'gable', col: BC.grey, over: 0.5, lift: 0.3, ridge: face === 'L' ? 'x' : 'y', rw: 1.1, curl: 0.5, gcol: '#B5B3AC' });
};
/* a red diamond with 福 (good fortune) on it, as on doors at the new year (wide px centre c, half-diagonal s) */
BJ.fu2 = function (g, c, s) {
  g.fill2([[c[0], c[1] - s], [c[0] + s, c[1]], [c[0], c[1] + s], [c[0] - s, c[1]]], '#D23A2E', true);
  if (s < 1.0) return;
  const h = s * 0.95 / 3.46 * 1.0, segs = [];   // 福 drawn flat in the diamond, as a sticker on the door
  const u = s * 0.11, ox = c[0] - 5 * u, oy = c[1] - 5 * u;
  for (const st of HZ['福']) for (let i = 0; i + 3 < st.length; i += 2) segs.push(ox + st[i] * u, oy + st[i + 1] * u, ox + st[i + 2] * u, oy + st[i + 3] * u);
  g.segs2(segs, '#F2C94C', Math.max(0.12, s * 0.07)); void h;
};

/* ---------------- trees ---------------- */
/* a ginkgo in its October gold: a straight grey trunk, an upright egg-shaped crown cut into facets (lit upper left,
   a deeper gold lower right), a few fan-shaped leaf marks and pale flecks */
BJ.ginkgo = function (g, x, y, o) {
  o = o || {}; const r = (o.r || 3.4) * 3.3, h = o.h == null ? 5 : o.h, f = g.p(x, y, o.z || 0), R = RNG(o.seed || Math.round(x * 31 + y * 17 + 3));
  const top = f[1] - h * VZ, cx = f[0], cy = top - r * 0.95, col = o.col || BC.ginkgo, ink = BC.ginkgoInk;
  g.fill2([[f[0] - 0.9, f[1]], [f[0] + 0.9, f[1]], [f[0] + 0.55, top - r * 0.2], [f[0] - 0.55, top - r * 0.2]], '#8A7A66');
  g.fill2([[f[0] + 0.1, f[1]], [f[0] + 0.9, f[1]], [f[0] + 0.55, top - r * 0.2], [f[0] + 0.1, top - r * 0.2]], '#6E604E');
  const n = 11, pts = [], a0 = -Math.PI / 2;
  for (let i = 0; i < n; i++) { const a = a0 + TAU * i / n, rr = (0.9 + R() * 0.2), ey = Math.sin(a) < 0 ? 1.32 : 1.0; pts.push([cx + Math.cos(a) * r * rr * 0.92, cy + Math.sin(a) * r * rr * ey]); }
  g.fill2(pts, col);
  const sh = pts.filter((p) => (p[0] - cx) * 0.6 + (p[1] - cy) > -r * 0.05); if (sh.length >= 2) { sh.push([cx + r * 0.1, cy + r * 0.1]); g.fill2(sortAround(sh), shade(col, 0.12)); }
  const hl = pts.filter((p) => (p[0] - cx) * 0.7 + (p[1] - cy) < -r * 0.6); if (hl.length >= 2) { hl.push([cx - r * 0.2, cy - r * 0.35]); g.fill2(sortAround(hl), BC.ginkgoL); }
  g.outline2(pts, { c: ink, w: 0.8, ext: 0.4 });
  const mk = []; for (let i = 0; i < 5; i++) { const a = R() * TAU, d = r * (0.2 + R() * 0.5), px = cx + Math.cos(a) * d * 0.8, py = cy + Math.sin(a) * d, l = r * 0.13; mk.push(px - l, py, px, py + l * 0.8, px, py + l * 0.8, px + l, py); }
  g.segs2(mk, ink, 0.5);
  const fl = []; for (let i = 0; i < 9; i++) { const a = R() * TAU, d = Math.sqrt(R()) * r * 0.75, px = cx + Math.cos(a) * d * 0.8, py = cy + Math.sin(a) * d * 1.1; fl.push(px - 0.4, py, px + 0.4, py - 0.2); }
  g.segs2(fl, '#FBE89A', 0.7);
};
/* fallen ginkgo leaves on the ground round a tree (world), a scatter of yellow flecks */
BJ.leaves = function (g, x, y, r, seed, col) {
  const R = RNG(seed || 7), segs = []; for (let i = 0; i < 28; i++) { const a = R() * TAU, d = Math.sqrt(R()) * r, p = g.p(x + Math.cos(a) * d, y + Math.sin(a) * d, 0.02); segs.push(p[0] - 0.5, p[1], p[0] + 0.4, p[1] - 0.2); }
  g.segs2(segs, col || '#EFC23A', 0.75);
};
/* a persimmon (or jujube) tree: a crooked trunk, a sparse crown of autumn leaves and orange fruit hanging all over */
BJ.persimmon = function (g, x, y, o) {
  o = o || {}; const r = (o.r || 3.8) * 3.3, h = o.h == null ? 4.6 : o.h, f = g.p(x, y, o.z || 0), R = RNG(o.seed || Math.round(x * 13 + y * 29 + 1));
  const top = [f[0] + 1.2, f[1] - h * VZ];
  g.line2([f, [f[0] + 0.6, f[1] - h * VZ * 0.5], top], { w: 1.6, c: '#5E4636', boil: false });
  g.line2([[top[0], top[1] + 2], [top[0] - r * 0.5, top[1] - r * 0.45]], { w: 0.9, c: '#5E4636', boil: false });
  g.line2([[top[0], top[1] + 1], [top[0] + r * 0.45, top[1] - r * 0.55]], { w: 0.8, c: '#5E4636', boil: false });
  const leaf = o.leaf || '#C99A42', cy = top[1] - r * 0.55;
  for (const [dx, dy, rr] of [[-r * 0.38, 0, r * 0.5], [r * 0.36, -r * 0.08, r * 0.48], [0, -r * 0.4, r * 0.52]]) {
    const pts = [], a0 = R() * TAU; for (let k = 0; k < 9; k++) { const a = a0 + TAU * k / 9, q = rr * (0.8 + R() * 0.3); pts.push([top[0] + dx + Math.cos(a) * q, cy + dy + Math.sin(a) * q * 0.82]); }
    g.fill2(pts, shade(leaf, R() * 0.12)); g.outline2(pts, { c: shade(leaf, 0.45), w: 0.5, ext: 0.2 });
  }
  const br = []; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (R() - 0.5) * 2.4, l = r * (0.4 + R() * 0.4); br.push(top[0], top[1], top[0] + Math.cos(a) * l, cy + Math.sin(a) * l * 0.6); }
  g.segs2(br, '#5E4636', 0.45);
  const fruit = o.fruit || BC.persimmon;
  for (let i = 0; i < (o.n || 16); i++) { const a = R() * TAU, d = Math.sqrt(R()) * r * 0.85, p = [top[0] + Math.cos(a) * d, cy + Math.sin(a) * d * 0.75]; g.disc2(p, o.fr || 0.95, fruit); g.disc2([p[0] - 0.3, p[1] - 0.3], 0.3, '#F7B07A'); }
};
/* a weeping willow by the lake: a leaning trunk, a rounded head and long hanging strands, autumn yellow-green */
BJ.willow = function (g, x, y, o) {
  o = o || {}; const r = (o.r || 4.2) * 3.3, h = o.h == null ? 6 : o.h, f = g.p(x, y, 0), lean = o.lean || 2, R = RNG(o.seed || Math.round(x * 7 + y * 41));
  const top = [f[0] + lean * 2.4, f[1] - h * VZ];
  g.line2([f, [f[0] + lean * 0.8, f[1] - h * VZ * 0.5], top], { w: 1.8, c: '#6A5644', boil: false });
  const col = o.col || BC.willow, cy = top[1] - r * 0.15;
  // the head: an arch; the curtain: strands falling to a ragged hem well above the ground
  const head = []; for (let k = 0; k <= 10; k++) { const a = Math.PI + Math.PI * k / 10, q = r * (0.92 + R() * 0.16); head.push([top[0] + Math.cos(a) * q, cy + Math.sin(a) * q * 0.62]); }
  const hem = []; for (let k = 0; k <= 8; k++) { const t = k / 8, xx = top[0] + r * 1.02 - 2.04 * r * t; hem.push([xx, cy + r * (0.95 + 0.35 * Math.sin(Math.PI * t)) + (R() - 0.5) * 3]); }
  const shape = head.concat(hem);
  g.fill2(shape, col);
  g.fill2(head.slice(5).concat(hem.slice(0, 4)), shade(col, 0.1));
  g.outline2(head, { c: BC.willowD, w: 0.55, ext: 0.2 });
  const st = []; for (let i = 0; i < 22; i++) { const t = R(), xx = top[0] + r * (0.95 - 1.9 * t), y0 = cy - r * 0.35 * Math.sin(Math.PI * t), l = r * (0.9 + R() * 0.5); st.push(xx, y0, xx + 0.4, y0 + l); }
  g.segs2(st, BC.willowD, 0.45);
  const fl = []; for (let i = 0; i < 10; i++) { const xx = top[0] + (R() - 0.5) * r * 1.8, yy = cy + (R() - 0.3) * r; fl.push(xx, yy, xx + 0.2, yy + 1.4); } g.segs2(fl, '#E9DE8A', 0.55);
};
/* an old pine / cypress (Temple of Heaven, Jingshan): a leaning trunk, a dense dark crown with flat layered edges */
BJ.pine = function (g, x, y, o) {
  o = o || {}; const r = (o.r || 3.4) * 3.3, h = o.h == null ? 5 : o.h, f = g.p(x, y, o.z || 0), R = RNG(o.seed || Math.round(x * 19 + y * 23 + 5));
  const top = [f[0] + (R() - 0.5) * 3, f[1] - h * VZ], col = o.col || BC.pine;
  g.line2([f, [f[0] - 0.8, f[1] - h * VZ * 0.45], top], { w: 1.9, c: '#5A4A3E', boil: false });
  const cy = top[1] - r * 0.45, pts = [];
  for (let k = 0; k < 14; k++) { const a = TAU * k / 14, q = r * (0.8 + R() * 0.3) * (k % 2 ? 0.9 : 1.05); pts.push([top[0] + Math.cos(a) * q * 1.08, cy + Math.sin(a) * q * 0.7]); }
  g.fill2(pts, col);
  const sh = pts.filter((p) => (p[0] - top[0]) * 0.4 + (p[1] - cy) > -r * 0.05); if (sh.length > 2) { sh.push([top[0] + r * 0.1, cy + r * 0.05]); g.fill2(sortAround(sh), shade(col, 0.15)); }
  // flat layered pads along the top, lit, with dark undersides
  for (const [dx, dy, rr] of [[-r * 0.35, -r * 0.42, r * 0.5], [r * 0.32, -r * 0.3, r * 0.52], [0, -r * 0.62, r * 0.42]]) {
    const p2 = []; for (let k = 0; k < 9; k++) { const a = TAU * k / 9, q = rr * (0.85 + R() * 0.2); p2.push([top[0] + dx + Math.cos(a) * q, cy + dy + Math.sin(a) * q * 0.36]); }
    g.fill2(p2, shade(col, -0.12)); g.line2(p2.filter((p) => p[1] > cy + dy).sort((a, b) => a[0] - b[0]), { c: BC.pineD, w: 0.5, boil: false });
  }
  g.outline2(pts, { c: BC.pineD, w: 0.7, ext: 0.3 });
  const mk = []; for (let k = 0; k < 7; k++) { const px = top[0] + (R() - 0.5) * r * 1.5, py = cy + (R() - 0.6) * r * 0.8; mk.push(px, py, px + 1.6, py - 0.2); } g.segs2(mk, '#7FA07A', 0.45);
};
/* a maple in red (Fragrant Hills, the Great Wall slopes): a rounded crown in reds and oranges */
BJ.maple = function (g, x, y, o) { o = o || {}; K.tree(g, x, y, Object.assign({ col: o.col || BC.maple, ink: '#8E3424', r: 3.2, h: 3.6 }, o)); };

/* ---------------- people ---------------- */
const BJ_TOPS = ['#3B3F47', '#E9E4D8', '#6C7A89', '#B9A27D', '#3F5F8F', '#8E8A84', '#C9584B', '#2F343B', '#5A6B5A', '#D98AA4', '#7FB7D9', '#E6C24F', '#A4C66B', '#E7A9A0', '#F3F1EA', '#8E5A4A', '#4E6E8E', '#D9A15A'];
const BJ_BOTS = ['#2F343B', '#3F4D63', '#6B7B8C', '#4A4F57', '#3B3F47', '#5A4A3C', '#7A7A72', '#2E3A4F'];
/* a Beijinger: dark hair, autumn jackets; o.old for a retiree (grey or white hair, quieter colours) */
BJ.who = function (seed, o) {
  const R = RNG(seed * 7741 + 13), w = K.who(seed), old = (o && o.old) || R() < 0.12, tourist = R() < 0.1;
  if (!tourist) {
    w.skin = R.pick([SKIN[0], SKIN[0], SKIN[1], SKIN[1], '#EFCDB0', SKIN[2]]);
    w.hair = old ? R.pick(['#D9D5CB', '#B9B5AC', '#8E8A84', '#2B2420']) : R.pick(['#1F1A18', '#2B2420', '#2B2420', '#3D2B1F', '#5A3A24']);
    w.top = R.pick(BJ_TOPS); w.bot = R.pick(BJ_BOTS); w.beard = false; w.bare = false; w.shorts = false;
    w.hairStyle = old ? R.pick(['short', 'curly', 'buzz', 'short', 'bob']) : R.pick(['short', 'short', 'bob', 'long', 'pony', 'buzz', 'bun']);
    w.glasses = R() < 0.18; w.cap = old && R() < 0.35 ? R.pick(['#5A5A55', '#3B3F47', '#7A6A55']) : R() < 0.05 ? '#3B3F47' : undefined;
    if (!old && R() < 0.14) w.dress = R.pick(['#E7E2D6', '#3B3F47', '#B9A27D', '#8FB7D9', '#C9584B']);
    if (R() < 0.25) w.jacket = R.pick(['#F3F1EA', '#3B3F47', '#E9E4D8']);
  }
  return Object.assign(w, o || {});
};
/* a schoolchild in the blue-and-white tracksuit, with a red scarf */
BJ.kid = function (seed, o) { return BJ.who(seed, Object.assign({ k: 0.72, top: '#3F6FB8', bot: '#3F6FB8', jacket: '#F3F1EA', tie: '#D23A2E', hairStyle: RNG(seed).pick(['short', 'pony', 'bob', 'buzz']), cap: undefined, glasses: false, dress: undefined, old: false }, o || {})); };
/* an honour guard soldier: olive-green tunic and peaked cap, white gloves */
BJ.guard = function (seed, o) { return Object.assign(BJ.who(seed, { old: false }), { skin: SKIN[1], hair: '#1F1A18', hairStyle: 'buzz', top: '#3E5638', bot: '#3E5638', shoe: '#2A2622', cap: '#3E5638', glove: '#FBFAF6', glasses: false, dress: undefined, jacket: undefined, beard: false, k: 1.06, build: 0.5 }, o || {}); };
/* a tour-group member in the group's yellow (or red) cap */
BJ.tourist = function (seed, cap, o) { return BJ.who(seed, Object.assign({ cap: cap || '#F2C230' }, o || {})); };

/* K.person plus Beijing extras drawn on the returned points: a rifle, a birdcage, a fan, a phone, a little flag */
BJ.person = function (g, x, y, z, w) {
  const r = K.person(g, x, y, z, w), k = w.k || 1;
  if (w.rifle) {   // a rifle sloped on the near shoulder: stock at the hand, muzzle and bayonet up behind the head
    const hd = r.hands[0], sh = r.shoulders[0], d = [sh[0] - hd[0], sh[1] - hd[1]], L = Math.hypot(d[0], d[1]) || 1, ux = d[0] / L, uy = d[1] / L;
    const tip = [hd[0] + ux * 13 * k, hd[1] + uy * 13 * k];
    g.line2([[hd[0] - ux * 1.2, hd[1] - uy * 1.2], tip], { w: 0.9, c: '#3A2E26', boil: false, ext: 0 });
    g.line2([tip, [tip[0] + ux * 2.6 * k, tip[1] + uy * 2.6 * k]], { w: 0.35, c: '#D9D6CC', boil: false, ext: 0 });
  }
  if (w.cage) {   // a birdcage hanging from the hand, under its blue cloth or open
    const hd = r.hands[0], c = [hd[0] + 0.2, hd[1] + 3.6 * k], rr = 1.9 * k;
    g.segs2([hd[0], hd[1], c[0], c[1] - rr * 1.3], '#5A4A3C', 0.3);
    if (w.cage === 'cloth') g.fill2(K.curve([[c[0] - rr, c[1] + rr * 0.6], [c[0] - rr * 0.95, c[1] - rr * 0.4], [c[0], c[1] - rr * 1.25], [c[0] + rr * 0.95, c[1] - rr * 0.4], [c[0] + rr, c[1] + rr * 0.6]], 2, true), '#3E5E9E', true);
    else { g.fill2(K.curve([[c[0] - rr, c[1] + rr * 0.6], [c[0] - rr * 0.95, c[1] - rr * 0.4], [c[0], c[1] - rr * 1.25], [c[0] + rr * 0.95, c[1] - rr * 0.4], [c[0] + rr, c[1] + rr * 0.6]], 2, true), 'rgba(240,230,205,0.55)', true); const s = []; for (let i = -2; i <= 2; i++) s.push(c[0] + i * rr * 0.42, c[1] - rr * (1.1 - Math.abs(i) * 0.12), c[0] + i * rr * 0.45, c[1] + rr * 0.6); g.segs2(s, '#8A6A3E', 0.18); g.disc2([c[0] + 0.2, c[1] + 0.1], 0.45 * k, '#E6C24F'); }
    g.fill2([[c[0] - rr * 1.05, c[1] + rr * 0.55], [c[0] + rr * 1.05, c[1] + rr * 0.55], [c[0] + rr, c[1] + rr * 0.8], [c[0] - rr, c[1] + rr * 0.8]], '#7A5A3C', true);
  }
  if (w.fan) {    // a red dance fan open in the far hand
    const hd = r.hands[w.fanHand || 1], a0 = w.fanA == null ? -2.4 : w.fanA;
    const pts = [hd]; for (let i = 0; i <= 6; i++) { const a = a0 + i * 0.32; pts.push([hd[0] + Math.cos(a) * 3.6 * k, hd[1] + Math.sin(a) * 3.6 * k]); }
    g.fill2(pts, w.fan, true); g.segs2([hd[0], hd[1], pts[4][0], pts[4][1]], '#F2D06A', 0.2);
  }
  if (w.phone) { const hd = r.hands[0]; g.fill2([[hd[0] - 0.45, hd[1] - 1.2], [hd[0] + 0.45, hd[1] - 1.2], [hd[0] + 0.45, hd[1] + 0.25], [hd[0] - 0.45, hd[1] + 0.25]], '#2A2622', true); }
  if (w.flag) {   // a little hand flag (red with yellow stars), stick up from the hand
    const hd = r.hands[w.flagHand || 0], t = [hd[0], hd[1] - 5 * k];
    g.segs2([hd[0], hd[1], t[0], t[1]], '#6E5A44', 0.25);
    g.fill2([[t[0], t[1]], [t[0] + 3.0 * k, t[1] + 0.3 * k], [t[0] + 3.0 * k, t[1] + 2.2 * k], [t[0], t[1] + 2.0 * k]], '#D23A2E', true);
    g.disc2([t[0] + 0.7 * k, t[1] + 0.7 * k], 0.32 * k, '#F2C94C');
  }
  if (w.tanghulu) { // a stick of candied hawthorns
    const hd = r.hands[0]; g.segs2([hd[0], hd[1] + 0.5, hd[0] + 0.6, hd[1] - 5], '#C9A26B', 0.25);
    for (let i = 0; i < 4; i++) g.disc2([hd[0] + 0.12 + i * 0.13, hd[1] - 1.2 - i * 1.0], 0.55, '#D2342A');
  }
  return r;
};

/* ---------------- flags, kites, birds ---------------- */
/* a waving flag of China at wide-px point a (the top of the hoist), w x h wide px, ph the wave phase */
BJ.flag2 = function (g, a, w, h, ph) {
  const n = 8, top = [], bot = [];
  for (let i = 0; i <= n; i++) { const t = i / n, dy = Math.sin(ph + t * 4.2) * h * 0.14 * t; top.push([a[0] + t * w, a[1] + dy]); bot.push([a[0] + t * w * 0.98, a[1] + h + dy]); }
  const pts = top.concat(bot.reverse()); g.fill2(pts, '#D8322A', true);
  g.fill2(top.slice(n / 2).concat(bot.slice(0, n / 2 + 1)), '#C42C25', true);
  const star = (cx, cy, r, rot) => { const p = []; for (let i = 0; i < 10; i++) { const ang = rot - Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.4 : r; p.push([cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr]); } g.fill2(p, '#F6CF3A', true); };
  const yo = (t) => Math.sin(ph + t * 4.2) * h * 0.14 * t;
  star(a[0] + w * 0.17, a[1] + h * 0.27 + yo(0.17), h * 0.16, 0);
  for (const [tx, ty] of [[0.33, 0.1], [0.4, 0.2], [0.4, 0.35], [0.33, 0.45]]) star(a[0] + w * tx, a[1] + h * ty + yo(tx), h * 0.055, 0.4);
  g.line2(pts, { w: 0.35, c: '#7A1E18', close: true, boil: false, wob: 0.3 });
};
/* a swallow kite (sha yan), the Beijing classic: wide swept wings, a forked tail, painted black, white and red */
BJ.kite2 = function (g, c, s, col, ph) {
  const fl = Math.sin(ph) * 0.12, P = (u, v) => [c[0] + u * s, c[1] + v * s];
  const wing = [P(0, -1.1), P(1.6, -1.6 - fl), P(2.3, -0.9 - fl), P(0.7, -0.1), P(0, 0.2), P(-0.7, -0.1), P(-2.3, -0.9 + fl), P(-1.6, -1.6 + fl)];
  g.fill2(wing, '#F6F2E6', true);
  g.fill2([P(0.5, -1.2), P(1.6, -1.6 - fl), P(2.3, -0.9 - fl), P(1.4, -0.75)], '#2A2622', true); g.fill2([P(-0.5, -1.2), P(-1.6, -1.6 + fl), P(-2.3, -0.9 + fl), P(-1.4, -0.75)], '#2A2622', true);
  g.fill2([P(-0.35, -1.6), P(0.35, -1.6), P(0.45, 0.6), P(-0.45, 0.6)], col || '#D23A2E', true);
  g.fill2([P(-0.4, 0.5), P(0, 0.9), P(0.4, 0.5), P(0.9, 2.1), P(0.2, 1.3), P(0, 1.4), P(-0.2, 1.3), P(-0.9, 2.1)], '#2A2622', true);
  g.disc2(P(0, -1.75), 0.38 * s, '#2A2622');
  g.outline2(wing, { w: 0.3, c: '#3A3128', boil: false });
};
/* a pigeon in flight (wide px), wings up or down */
BJ.pigeon2 = function (g, c, s, up, col) {
  const P = (u, v) => [c[0] + u * s, c[1] + v * s], wy = up ? -1.4 : 0.7;
  g.fill2([P(-1.3, 0), P(-0.2, -0.35), P(1.2, -0.1), P(1.5, 0.15), P(-0.2, 0.35)], col || '#9AA0A8', true);
  g.fill2([P(-0.3, -0.1), P(0.2, -0.1), P(-0.6, wy), P(-1.2, wy * 0.9)], shade(col || '#9AA0A8', 0.15), true);
  g.fill2([P(0.0, 0), P(0.5, 0), P(0.9, wy * 1.1), P(0.3, wy * 1.1)], shade(col || '#9AA0A8', -0.1), true);
};

/* ---------------- vehicles ---------------- */
/* a Beijing taxi: golden-yellow upper half, a coloured lower half (band), a roof sign */
BJ.taxi = function (g, ang, o) {
  o = o || {}; const lo = o.band || '#3F7F8F', hi = '#E9C443', L = 5.0, Wd = 2.45, ca = Math.cos(ang), sa = Math.sin(ang);
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, lo, { line: false, nt: true }); K.shadow(g, sh);
  K.wheels(g, sh, [-L * 0.6, L * 0.6], 0.95, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.8, 2.9, { t: shade(hi, -0.2), l: lo, r: shade(lo, 0.15) }, {});
  for (const f of ['pv', 'nv', 'pu', 'nu']) if (B.vis[f]) g.fill(B.quad(f, -1, 1, 2.2, 2.9), f === 'pv' || f === 'nu' ? hi : shade(hi, 0.12));
  for (const f of ['pu', 'nu']) if (B.vis[f]) g.fill(B.quad(f, -1, 1, 0.8, 1.25), shade(lo, 0.3));
  K.wheels(g, sh, [-L * 0.6, L * 0.6], 0.95, 'near', { arch: shade(lo, 0.55) });
  K.lights(g, B, 1.7);
  const off = -L * 0.1, tone = { t: shade(hi, -0.2), l: hi, r: shade(hi, 0.15) };
  const cab = K.rbox(g, off * ca, off * sa, L * 0.5, Wd - 0.35, ang, 2.9, 4.7, tone, { nb: true, w: 0.8 });
  K.rwin(g, cab, 'pv', -0.82, -0.06, 3.1, 4.4); K.rwin(g, cab, 'pv', 0.06, 0.82, 3.1, 4.4);
  K.rwin(g, cab, 'nv', -0.82, -0.06, 3.1, 4.4); K.rwin(g, cab, 'nv', 0.06, 0.82, 3.1, 4.4);
  K.rwin(g, cab, 'pu', -0.8, 0.8, 3.1, 4.4); K.rwin(g, cab, 'nu', -0.8, 0.8, 3.1, 4.4);
  K.rbox(g, cab.cx, cab.cy, 0.45, 1.0, ang, 4.7, 5.4, '#F3F1EA', { w: 0.45, nb: true });
};
/* a Beijing city bus: white with a red skirt (o.band), a big front window, route number box */
BJ.bus = function (g, ang, o) {
  o = o || {}; K.bus(g, ang, { col: '#F3F1EA', band: o.band || '#C9463E', L: o.L || 6.8, W: 2.6, h: 5.8, n: 5 });
};
/* an electric delivery tricycle: the rider on the front wheel, a closed box (or a flat bed with cargo) behind */
BJ.tri = function (g, ang, o) {
  o = o || {}; const ca = Math.cos(ang), sa = Math.sin(ang), box = o.box || '#3E6FB0';
  const sh = K.rbox(g, -1.0 * ca, -1.0 * sa, 2.2, 1.35, ang, 0, 0.01, box, { line: false, nt: true }); K.shadow(g, sh, 0.2);
  K.wheels(g, sh, [-1.0], 0.75, 'far');
  const bed = K.rbox(g, -1.0 * ca, -1.0 * sa, 1.9, 1.35, ang, 0.9, 1.2, { t: '#6A6E75', l: '#5A5E66', r: '#4A4E56' }, { w: 0.5 });
  if (o.flat) { if (o.cargo) o.cargo(g, bed); }
  else { const B = K.rbox(g, -1.1 * ca, -1.1 * sa, 1.7, 1.3, ang, 1.2, 3.9, { t: shade(box, -0.15), l: box, r: shade(box, 0.15) }, { w: 0.7 }); void B; }
  K.wheels(g, sh, [-1.0], 0.75, 'near', { arch: '#3F3A34' });
  // the front: a wheel under the rider, the handlebars
  const pt = (u, z) => g.p(u * ca, u * sa, z), wc = pt(2.2, 0.75), tyre = [];
  for (let i = 0; i < 18; i++) { const t = TAU * i / 18; tyre.push(pt(2.2 + Math.cos(t) * 0.75, 0.75 + Math.sin(t) * 0.75)); }
  g.line2(tyre, { c: '#3A3632', w: 0.8, close: true, boil: false, wob: 0.2 }); g.disc2(wc, 0.25, '#3A3632');
  const seat = pt(1.0, 2.2), bar = pt(2.0, 3.4); g.segs2([wc[0], wc[1], bar[0], bar[1], seat[0], seat[1], pt(0.6, 1.0)[0], pt(0.6, 1.0)[1]], '#3A3632', 0.6);
  const d = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2), kk = 0.86, F = pt(1.0, 2.2), rel = (q) => [(q[0] - F[0]) / kk, (q[1] - F[1]) / kk];
  K.person(g, 1.0 * ca, 1.0 * sa, 2.2, Object.assign({}, o.who || BJ.who(o.seed || 7), { dir: d, pose: 'sit', k: kk, reach: rel(bar), pedal: [rel(pt(1.6, 1.0)), rel(pt(1.4, 1.2))] }));
};
/* a pedicab (hutong tour rickshaw): the cyclist in front, a red-canopied seat for two behind */
BJ.pedicab = function (g, ang, o) {
  o = o || {}; const ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z);
  const visP = (-sa + ca) > 0, sv = visP ? 1 : -1;
  const wheel = (u, v, r) => { const pts = [], hub = P(u, v, r); for (let i = 0; i < 18; i++) { const t = TAU * i / 18; pts.push(P(u + Math.cos(t) * r, v, r + Math.sin(t) * r)); } g.line2(pts, { w: 0.7, c: '#2E2A26', close: true, boil: false, wob: 0.2 }); g.disc2(hub, 0.25, '#2E2A26'); };
  wheel(-1.4, -sv * 1.4, 1.05);
  const seat = K.rbox(g, -1.4 * ca, -1.4 * sa, 1.1, 1.5, ang, 1.1, 2.4, { t: '#8E2E26', l: '#A8382E', r: '#8E2E26' }, { w: 0.55 });
  void seat;
  const dir = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2);
  const hood = []; for (let k = 0; k <= 6; k++) { const t = k / 6 * Math.PI / 2; hood.push(P(-2.6 + Math.sin(t) * 1.6, -1.6, 2.4 + Math.sin(t) * 2.8)); }
  const hoodN = hood.map((q, k) => P(-2.6 + Math.sin(k / 6 * Math.PI / 2) * 1.6, 1.6, 2.4 + Math.sin(k / 6 * Math.PI / 2) * 2.8));
  g.fill2(hood.concat(hoodN.slice().reverse()), '#C9382E'); g.outline2(hood.concat(hoodN.slice().reverse()), { w: 0.4, boil: false });
  g.fill2([P(-2.6, -1.6, 2.4), P(-1.0, -1.6, 5.2), P(-1.0, -1.6, 2.4)], '#A82E26');
  (o.riders || []).forEach((w, i) => { const v = (i - ((o.riders.length - 1) / 2)) * 1.2; K.person(g, -1.5 * ca - v * sa, -1.5 * sa + v * ca, 2.4, Object.assign({}, w, { dir, pose: 'sit', k: 0.86 })); });
  wheel(-1.4, sv * 1.4, 1.05);
  wheel(2.1, 0, 0.95);
  const bar = P(1.9, 0, 3.5), bb = P(1.0, 0, 1.0), sd = P(0.7, 0, 2.6);
  g.segs2([P(-0.4, 0, 1.2)[0], P(-0.4, 0, 1.2)[1], bb[0], bb[1], bb[0], bb[1], P(2.1, 0, 0.95)[0], P(2.1, 0, 0.95)[1], sd[0], sd[1], bb[0], bb[1], bar[0], bar[1], P(2.1, 0, 0.95)[0], P(2.1, 0, 0.95)[1]], '#2E2A26', 0.55);
  const F = P(0.7, 0, 2.6), kk = 0.88, rel = (q) => [(q[0] - F[0]) / kk, (q[1] - F[1]) / kk];
  K.person(g, 0.7 * ca, 0.7 * sa, 2.6, Object.assign({}, o.who || BJ.who(o.seed || 11, { old: true }), { dir, pose: 'sit', k: kk, reach: rel(bar), pedal: [rel(P(1.3, 0, 0.9)), rel(P(0.9, 0, 1.4))] }));
};
/* an e-bike delivery rider (a yellow or blue jacket and helmet, the insulated box behind) */
BJ.ebike = function (g, ang, o) {
  o = o || {}; const col = o.col || '#F2C230', ca = Math.cos(ang), sa = Math.sin(ang);
  K.bike(g, ang, { col: '#3A3632', who: BJ.who(o.seed || 3, { top: col, cap: col, bot: '#2F343B' }) });
  const b = K.rbox(g, -2.2 * ca, -2.2 * sa, 0.9, 0.9, ang, 2.4, 4.1, { t: shade(col, -0.15), l: col, r: shade(col, 0.15) }, { w: 0.5 });
  void b;
};
/* a parked shared bike (wide px cheap drawing): two thin wheels, a frame, a coloured basket and fender */
BJ.parked = function (g, x, y, ang, col) {
  const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, z) => g.p(x + u * ca, y + u * sa, z);
  const w1 = pt(-1.9, 1.2), w2 = pt(1.9, 1.2), r = 1.2 * 3.32;
  const ell = (c) => { const ps = []; for (let i = 0; i < 14; i++) { const t = TAU * i / 14, q = pt(0, 0); void q; const e = g.p(x + (c === 0 ? -1.9 : 1.9) * ca + Math.cos(t) * 1.2 * ca, y + (c === 0 ? -1.9 : 1.9) * sa + Math.cos(t) * 1.2 * sa, 1.2 + Math.sin(t) * 1.2); ps.push(e); } return ps; };
  g.line2(ell(0), { c: '#3A3632', w: 0.5, close: true, boil: false, wob: 0.2 }); g.line2(ell(1), { c: '#3A3632', w: 0.5, close: true, boil: false, wob: 0.2 });
  const s = pt(-0.6, 3.0), h = pt(1.4, 3.3), bb = pt(0, 1.2);
  g.segs2([w1[0], w1[1], s[0], s[1], s[0], s[1], bb[0], bb[1], bb[0], bb[1], h[0], h[1], h[0], h[1], w2[0], w2[1], w1[0], w1[1], bb[0], bb[1]], col, 0.7);
  const bk = pt(1.9, 2.9); g.fill2([[bk[0] - 1.1, bk[1] - 1.2], [bk[0] + 1.1, bk[1] - 1.2], [bk[0] + 0.9, bk[1] + 0.4], [bk[0] - 0.9, bk[1] + 0.4]], col, true);
  void r;
};

/* ---------------- the city's fabric ---------------- */
/* a courtyard house (siheyuan) as objects in tile T: the main wing on the north (its lattice front faces us), a side
   wing on the west (front to the courtyard, facing us), the east side a wing (its blank back to the lane) or a wall,
   the south side a low wall or a wing, the red gate on the south or east wall. Returns the open courtyard [x0,y0,x1,y1].
   o: { x0, y0, x1, y1, gate: 'S' | 'E', ga (gate centre along that side), east: 'wing' | 'wall', south: 'wall' | 'wing',
   nd (north wing depth), sd (side wing depth), fu, seed } */
BJ.court = function (T, o) {
  const { x0, y0, x1, y1 } = o, nd = o.nd || 7, sd = o.sd || 6, east = o.east || 'wing', south = o.south || 'wall', gate = o.gate || 'S';
  const sy = south === 'wing' ? y1 - 6 : y1 - 0.8, ex = east === 'wing' ? x1 - sd : x1 - 0.8;
  T.obj([x0, y0, x1, y0 + nd], (g) => BJ.wing(g, x0, y0, x1, y0 + nd, { front: 'L', h: 5.6, rh: 3.2, fu: o.fu }), { name: 'house' });
  T.obj([x0, y0 + nd, x0 + sd, sy], (g) => BJ.wing(g, x0, y0 + nd, x0 + sd, sy, { front: 'R', h: 5.0, rh: 2.8 }), { name: 'house' });
  if (east === 'wing') T.obj([ex, y0 + nd, x1, sy], (g) => BJ.wing(g, ex, y0 + nd, x1, sy, { front: null, h: 5.0, rh: 2.8 }), { name: 'house' });
  const gw = 1.9;
  if (east === 'wall') {
    const ys = gate === 'E' ? [[y0 + nd, o.ga - gw], [o.ga + gw, y1]] : [[y0 + nd, y1]];
    for (const [a, b] of ys) if (b - a > 0.5) T.obj([ex, a, x1, b], (g) => BJ.greyWall(g, ex, a, x1, b, 3.4), { name: 'wall' });
  }
  if (south === 'wall') {
    const xs = gate === 'S' ? [[x0, o.ga - gw], [o.ga + gw, east === 'wall' ? ex : x1]] : [[x0, east === 'wall' ? ex : x1]];
    for (const [a, b] of xs) if (b - a > 0.5) T.obj([a, sy, b, y1], (g) => BJ.greyWall(g, a, sy, b, y1, 3.4), { name: 'wall' });
  } else T.obj([x0, sy, x1, y1], (g) => BJ.wing(g, x0, sy, x1, y1, { front: null, h: 4.6, rh: 2.6 }), { name: 'house' });
  if (gate === 'S') T.obj([o.ga - gw, y1 - 1.4, o.ga + gw, y1 + 0.4], (g) => BJ.gate(g, 'L', y1, o.ga, { fu: o.fu !== false }), { name: 'gate' });
  else T.obj([x1 - 1.4, o.ga - gw, x1 + 0.4, o.ga + gw], (g) => BJ.gate(g, 'R', x1, o.ga, { fu: o.fu !== false }), { name: 'gate' });
  const c = [x0 + sd, y0 + nd, east === 'wing' ? ex : ex, south === 'wing' ? sy : sy];
  T.ground(function (g) {
    const q = K.rect(c[0], c[1], c[2], c[3]); g.fill(q, '#D3CCBE');
    const segs = []; for (let a = c[0] + 1.2; a < c[2]; a += 1.2) { const p0 = g.p(a, c[1], 0), p1 = g.p(a, c[3], 0); segs.push(p0[0], p0[1], p1[0], p1[1]); }
    for (let b = c[1] + 0.6; b < c[3]; b += 0.6) { const p0 = g.p(c[0], b, 0), p1 = g.p(c[2], b, 0); segs.push(p0[0], p0[1], p1[0], p1[1]); }
    g.segs2(segs, '#C4BDAE', 0.22);
    // the brick path from the gate to the main house
    const mx = (c[0] + c[2]) / 2; g.fill(K.rect(mx - 1.2, c[1], mx + 1.2, c[3]), '#C9C1B1');
  });
  return c;
};
/* the pavement along a tile's edges (sides: 'n' -y, 's' +y, 'e' +x, 'w' -x): grey paving, the kerb, ginkgo trees with
   their fallen leaves (skipping o.skip ranges per side), and rows of shared bikes (o.bikes: [[side, a, n], ...]) */
BJ.sidewalk = function (T, sides, o) {
  o = o || {}; const H = 37, W = o.w || 3.2, sp = o.sp || 11;
  const P = (side, a, d) => side === 'n' ? [a, -H + d] : side === 's' ? [a, H - d] : side === 'e' ? [H - d, a] : [-H + d, a];
  T.ground(function (g) {
    for (const side of sides) {
      const q = [P(side, -H, 0), P(side, H, 0), P(side, H, W), P(side, -H, W)].map((p) => [p[0], p[1], 0]);
      g.fill(q, '#DEDAD0');
      const segs = []; for (let a = -H + 1.6; a < H; a += 1.6) { const p0 = P(side, a, 0), p1 = P(side, a, W), A = g.p(p0[0], p0[1], 0), B = g.p(p1[0], p1[1], 0); segs.push(A[0], A[1], B[0], B[1]); }
      g.segs2(segs, '#CDC8BC', 0.25);
      const k0 = P(side, -H, W), k1 = P(side, H, W); g.line([[k0[0], k0[1], 0], [k1[0], k1[1], 0]], { w: 0.5, c: '#B5AFA2', boil: false });
    }
  });
  for (const side of sides) {
    const skip = (o.skip && o.skip[side]) || [];
    for (let a = -H + 5 + ((o.off && o.off[side]) || 0); a < H - 3; a += sp) {
      if (skip.some(([s0, s1]) => a > s0 && a < s1)) continue;
      const p = P(side, a, 1.5), seed = Math.round(p[0] * 7 + p[1] * 13);
      T.ground((g) => BJ.leaves(g, p[0], p[1], 3.4, seed));
      T.obj([p[0], p[1]], (g) => BJ.ginkgo(g, p[0], p[1], { r: 3.1, h: 4.6, seed }), { name: 'ginkgo' });
    }
  }
  for (const [side, a, n] of (o.bikes || [])) {
    const p = P(side, a, 1.6), along = side === 'n' || side === 's', ang = along ? Math.PI / 2 : 0;
    T.cast([p[0], p[1]], (g) => { for (let i = 0; i < n; i++) { const q = along ? [p[0] + (i - n / 2) * 1.05, p[1]] : [p[0], p[1] + (i - n / 2) * 1.05]; BJ.parked(g, q[0], q[1], ang, (i + n) % 3 === 0 ? '#3E8FD0' : '#F2C230'); } }, { on: false });
  }
};
/* napa cabbages stacked against a wall for the winter (wide-px heap at world point) */
BJ.cabbages = function (g, x, y, n) {
  const c = g.p(x, y, 0); const R = RNG(Math.round(x * 3 + y * 5));
  for (let k = 0; k < n; k++) { const row = Math.floor(k / 4), i = k % 4, p = [c[0] + (i - 1.5) * 3.2 + row * 1.5, c[1] - row * 2.4 - R() * 0.4]; g.fill2(arcPts(p[0], p[1] - 1.4, 1.9, 0, TAU, 10).map((q) => [q[0], p[1] - 1.4 + (q[1] - p[1] + 1.4) * 0.75]), '#E8EBC6', true); g.fill2(arcPts(p[0] - 0.5, p[1] - 1.8, 1.1, 0, TAU, 8), '#A9C27A', true); g.outline2(arcPts(p[0], p[1] - 1.4, 1.9, 0, TAU, 10).map((q) => [q[0], p[1] - 1.4 + (q[1] - p[1] + 1.4) * 0.75]), { w: 0.3, c: '#7A8A4A', boil: false }); }
};
/* a jianbing cart: a tricycle with a glass box and a round griddle, the seller at the end */
BJ.jianbing = function (g, x, y, o) {
  o = o || {};
  K.box(g, x - 2.6, y - 1.3, x + 2.6, y + 1.3, 1.0, 3.6, { t: '#E9E6DE', l: '#F2F0EA', r: '#D9D6CC' }, { w: 0.6, boil: false });
  K.box(g, x - 2.6, y - 1.3, x + 2.6, y + 1.3, 3.6, 5.6, { t: 'rgba(220,235,240,0.5)', l: 'rgba(214,232,238,0.55)', r: 'rgba(200,220,228,0.55)' }, { w: 0.45, boil: false });
  BJ.sign(g, 'L', y + 1.3, x - 2.4, x + 2.4, 1.4, 3.2, '#D8322A', o.word || '煎饼', { ink: '#FBF4DE' });
  const gr = g.p(x + 0.8, y, 3.62); g.fill2(arcPts(gr[0], gr[1], 3.2, 0, TAU, 14).map((q) => [q[0], gr[1] + (q[1] - gr[1]) * 0.5]), '#3A3530', true); g.fill2(arcPts(gr[0], gr[1], 2.4, 0, TAU, 14).map((q) => [q[0], gr[1] + (q[1] - gr[1]) * 0.5]), '#E9C47A', true);
  for (const dx of [-2.2, 2.2]) { const w = g.p(x + dx, y + 1.35, 0.8); g.ring2(w, 2.6, { w: 0.5, c: '#3A3632' }); }
};
/* a round hall body (the Temple of Heaven): a red drum with columns and lattice doors on its front half, the painted
   band under the eaves */
BJ.roundBody = function (g, cx, cy, r, z0, z1, o) {
  o = o || {}; const bandH = Math.min(1.0, (z1 - z0) * 0.22);
  K.cyl(g, cx, cy, r, z0, z1, { t: '#C9B7A0', l: BC.red, r: shade(BC.red, 0.14) }, { w: 0.8, n: 24 });
  const n = o.n || 12, segs = [];
  for (let i = 0; i < n; i++) {
    const a = TAU * (i + 0.5) / n; if (Math.cos(a) + Math.sin(a) < -0.15) continue;
    const a0 = a - Math.PI / n * 0.75, a1 = a + Math.PI / n * 0.75;
    if (o.doors !== false) {
      const q = [[cx + Math.cos(a0) * (r + 0.03), cy + Math.sin(a0) * (r + 0.03), z0 + 0.3], [cx + Math.cos(a1) * (r + 0.03), cy + Math.sin(a1) * (r + 0.03), z0 + 0.3], [cx + Math.cos(a1) * (r + 0.03), cy + Math.sin(a1) * (r + 0.03), z1 - bandH - 0.2], [cx + Math.cos(a0) * (r + 0.03), cy + Math.sin(a0) * (r + 0.03), z1 - bandH - 0.2]];
      g.fill(q, shade(BC.lattice, clamp(0.12 - 0.12 * (Math.cos(a - Math.PI * 0.75)), -0.05, 0.2)));
      for (let k = 1; k < 4; k++) { const t = lerp(a0, a1, k / 4), p0 = g.p(cx + Math.cos(t) * (r + 0.05), cy + Math.sin(t) * (r + 0.05), lerp(z0, z1, 0.4)), p1 = g.p(cx + Math.cos(t) * (r + 0.05), cy + Math.sin(t) * (r + 0.05), z1 - bandH - 0.3); segs.push(p0[0], p0[1], p1[0], p1[1]); }
    }
    const c0 = g.p(cx + Math.cos(a - Math.PI / n) * (r + 0.06), cy + Math.sin(a - Math.PI / n) * (r + 0.06), z0), c1 = g.p(cx + Math.cos(a - Math.PI / n) * (r + 0.06), cy + Math.sin(a - Math.PI / n) * (r + 0.06), z1 - bandH);
    g.fill2([[c0[0] - 0.5, c0[1]], [c0[0] + 0.5, c0[1]], [c1[0] + 0.5, c1[1]], [c1[0] - 0.5, c1[1]]], BC.column, true);
  }
  g.segs2(segs, shade(BC.lattice, 0.4), 0.22);
  const band = []; for (let i = 0; i <= 24; i++) { const a = A_L + (A_R + TAU - A_L) * i / 24 - TAU; band.push(a); }
  const ring = (zz, rr) => { const p = []; for (let i = 0; i <= 20; i++) { const a = A_R + (A_L - A_R) * i / 20; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, zz]); } return p; };
  const top = ring(z1, r + 0.04), bot = ring(z1 - bandH, r + 0.04); g.fill(top.concat(bot.slice().reverse()), BC.band);
  const mid1 = ring(z1 - bandH * 0.62, r + 0.05), mid2 = ring(z1 - bandH * 0.3, r + 0.05); g.fill(mid1.concat(mid2.slice().reverse()), BC.band2);
  void band;
};
/* a circle of balustrade posts round a round terrace (front half heavy, back half light), a gap facing +y for stairs */
BJ.roundRail = function (g, cx, cy, r, z, o) {
  o = o || {}; const n = Math.max(12, Math.round(TAU * r / 1.3)), segs = [], dots = [], gap = o.gap == null ? 0.3 : o.gap;
  let prev = null;
  for (let i = 0; i <= n; i++) {
    const a = TAU * i / n; if (Math.abs(((a - Math.PI / 2 + Math.PI) % TAU + TAU) % TAU - Math.PI) < gap) { prev = null; continue; }
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, p0 = g.p(x, y, z), p1 = g.p(x, y, z + 1.0), m = g.p(x, y, z + 0.75);
    segs.push(p0[0], p0[1], p1[0], p1[1]); if (prev) segs.push(prev[0], prev[1], m[0], m[1]); prev = m; dots.push(p1);
  }
  g.segs2(segs, '#A9A394', 0.45); for (const d of dots) g.disc2([d[0], d[1] - 0.3], 0.38, '#F7F5EF');
};
/* a musical note rising (wide px) */
BJ.note2 = function (g, c, s, col) { g.disc2(c, 0.9 * s, col); g.segs2([c[0] + 0.8 * s, c[1], c[0] + 0.8 * s, c[1] - 3.2 * s, c[0] + 0.8 * s, c[1] - 3.2 * s, c[0] + 2.0 * s, c[1] - 2.4 * s], col, 0.4 * s); };
/* a traditional two-storey shop (Qianmen, Dashilar, Wangfujing): grey brick behind a carved front of red posts, a green
   lattice upper floor, a little tiled eave between the floors, a black board with gold characters (o.word), and an
   open shop floor with goods. front: 'L' (faces +y) or 'R' (faces +x) */
BJ.shop = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const f = o.front || 'L', h = o.h || 9.6, gf = 4.8, col = o.col || '#A8382E';
  K.box(g, x0, y0, x1, y1, 0, h, { t: BC.brickL, l: '#BFBDB6', r: '#ABA9A2' }, { w: 0.8 });
  const p = f === 'L' ? y1 : x1, a0 = f === 'L' ? x0 : y0, a1 = f === 'L' ? x1 : y1, n = Math.max(2, Math.round((a1 - a0) / 3.4)), bw = (a1 - a0) / n;
  // the shop floor: open bays with goods, red posts
  g.fill(K.on(f, p + 0.03, a0 + 0.3, a1 - 0.3, 0.2, gf - 0.4), '#4A3428');
  const R = RNG(o.seed || 3), dots = [];
  for (let i = 0; i < 14; i++) { const c = g.p.apply(g, K.pt(f, p + 0.05, a0 + 0.8 + R() * (a1 - a0 - 1.6), 0.8 + R() * 2.2)); dots.push(c); }
  for (const c of dots) g.disc2(c, 0.9, R.pick(o.goods || ['#E2B13A', '#C9584B', '#F3E3B8', '#8FBF73', '#E08A3C']));
  for (let i = 0; i <= n; i++) { const c0 = g.p.apply(g, K.pt(f, p + 0.06, a0 + i * bw, 0)), c1 = g.p.apply(g, K.pt(f, p + 0.06, a0 + i * bw, h - 0.6)); g.fill2([[c0[0] - 0.5, c0[1]], [c0[0] + 0.5, c0[1]], [c1[0] + 0.5, c1[1]], [c1[0] - 0.5, c1[1]]], col, true); }
  // the upper floor: a lattice front
  const up = K.on(f, p + 0.03, a0 + 0.3, a1 - 0.3, gf + 1.2, h - 0.9); g.fill(up, o.lat || '#5E8A6A');
  const segs = []; for (let a = a0 + 0.8; a < a1 - 0.4; a += 0.6) { const P0 = g.p.apply(g, K.pt(f, p + 0.05, a, gf + 1.3)), P1 = g.p.apply(g, K.pt(f, p + 0.05, a, h - 1.0)); segs.push(P0[0], P0[1], P1[0], P1[1]); } g.segs2(segs, shade(o.lat || '#5E8A6A', 0.35), 0.25);
  g.fill(K.on(f, p + 0.04, a0, a1, h - 0.9, h), BC.band);
  // a little tiled eave between the floors, then the signboard on it
  const P = (a, d, z) => f === 'L' ? [a, p + d, z] : [p + d, a, z];
  const ev = [P(a0 - 0.3, 0, gf + 1.1), P(a1 + 0.3, 0, gf + 1.1), P(a1 + 0.3, 1.4, gf + 0.1), P(a0 - 0.3, 1.4, gf + 0.1)]; g.fill(ev, BC.grey); g.outline(ev, { w: 0.5, c: '#4A4E56', boil: false });
  if (o.word) BJ.sign(g, f, p + 0.1, a0 + (a1 - a0) * 0.18, a1 - (a1 - a0) * 0.18, gf + 1.5, gf + 3.4, o.board || '#2A2420', o.word, { ink: o.ink || '#E9C55A', c: '#C9A23A' });
  const alongX = (x1 - x0) >= (y1 - y0);
  BJ.roof(g, x0, y0, x1, y1, h, 2.6, { type: 'gable', col: BC.grey, over: 0.6, lift: 0.2, ridge: alongX ? 'x' : 'y', rw: 1.3, curl: 0.5, gcol: '#B5B3AC' });
};
/* a memorial archway (pailou): posts, painted beams and little roofs over each bay. Spans [a0, a1] along x (face 'L',
   plane y = p) or along y (face 'R', plane x = p); o.word on the middle board; o.bays 3 or 5 */
BJ.pailou = function (g, face, p, a0, a1, o) {
  o = o || {}; const nb = o.bays || 3, h = o.h || 9, bw = (a1 - a0) / nb, post = o.post || '#B33A2F';
  const P = (a, d, z) => face === 'L' ? [a, p + d, z] : [p + d, a, z];
  for (let i = 0; i <= nb; i++) { const a = a0 + i * bw; K.box(g, ...(face === 'L' ? [a - 0.4, p - 0.4, a + 0.4, p + 0.4] : [p - 0.4, a - 0.4, p + 0.4, a + 0.4]), 0, h - (i === 0 || i === nb ? 1.6 : 0), { t: shade(post, -0.1), l: post, r: shade(post, 0.15) }, { w: 0.5, boil: false }); const b = face === 'L' ? [a - 0.8, p - 0.8, a + 0.8, p + 0.8] : [p - 0.8, a - 0.8, p + 0.8, a + 0.8]; K.box(g, b[0], b[1], b[2], b[3], 0, 1.2, K.STONE, { w: 0.4, boil: false }); }
  for (let i = 0; i < nb; i++) {
    const b0 = a0 + i * bw, b1 = b0 + bw, mid = i === Math.floor(nb / 2), zt = mid ? h : h - 1.6;
    const beam = [P(b0, 0.45, zt - 2.6), P(b1, 0.45, zt - 2.6), P(b1, 0.45, zt - 0.4), P(b0, 0.45, zt - 0.4)]; g.fill(beam, BC.band); g.outline(beam, { w: 0.4, boil: false });
    g.fill([P(b0, 0.47, zt - 1.9), P(b1, 0.47, zt - 1.9), P(b1, 0.47, zt - 1.2), P(b0, 0.47, zt - 1.2)], BC.band2);
    const r0 = face === 'L' ? [b0 - 0.6, p - 1.0, b1 + 0.6, p + 1.0] : [p - 1.0, b0 - 0.6, p + 1.0, b1 + 0.6];
    BJ.roof(g, r0[0], r0[1], r0[2], r0[3], zt - 0.4, 1.8, { type: 'xie', col: o.roof || BC.yellow, over: 0.5, lift: 0.5, ridge: face === 'L' ? 'x' : 'y', tiles: false, rw: 1.0, curl: 0.6 });
    if (mid && o.word) BJ.sign(g, face, p + 0.5, b0 + bw * 0.22, b1 - bw * 0.22, zt - 2.5, zt - 0.5, o.board || '#2E4E8E', o.word, { ink: '#F2C94C', c: '#C9A23A' });
  }
};
