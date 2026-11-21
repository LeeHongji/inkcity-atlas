'use strict';
/* the shared kit: solids, roofs, windows, trees, people, vehicles, street furniture.
   Every function draws into a recorder g, in tile-local u (x to the lower right, y to the lower left, z up).
   Faces: "L" is the face looking lower-left (constant y, the lit side), "R" looks lower-right (constant x),
   "T" is the top. Light comes from the upper left. */
const K = {};
const SX = AX * Math.SQRT2;        // wide px per u across the screen (4.13)
const SQ = AY * Math.SQRT2;        // vertical squash of a ground circle (2.25)

/* colour triple for a solid: top, lit left, shaded right */
K.tones = function (col, k) {
  if (typeof col === 'object') return col;
  k = k == null ? 1 : k;
  return { t: shade(col, -0.22 * k), l: col, r: shade(col, 0.13 * k) };
};
K.STONE = { t: '#E7E4DB', l: '#F3F1EA', r: '#E2DFD5' };
K.STONE2 = { t: '#F0EEE7', l: '#F3F1EA', r: '#E2DFD5' };

/* a box. o: {w line weight, c line colour, nb: no bottom edges, nt: no top face, faces: 'tlr', scuff} */
K.box = function (g, x0, y0, x1, y1, z0, z1, col, o) {
  o = o || {}; const c = K.tones(col), f = o.faces || 'tlr', lo = { w: o.w == null ? 1 : o.w, c: o.c, boil: o.boil };
  const li = { w: (o.w == null ? 1 : o.w) * (o.wi == null ? 0.8 : o.wi), c: o.c, boil: o.boil };
  const A = [x0, y1, z0], B = [x1, y1, z0], Cc = [x1, y0, z0], A1 = [x0, y1, z1], B1 = [x1, y1, z1], C1 = [x1, y0, z1], D1 = [x0, y0, z1];
  if (f.indexOf('l') >= 0) g.fill([A, B, B1, A1], c.l);
  if (f.indexOf('r') >= 0) g.fill([B, Cc, C1, B1], c.r);
  if (f.indexOf('t') >= 0) g.fill([A1, B1, C1, D1], c.t);
  if (o.line === false) return;
  if (!o.nohid && f === 'tlr') { const hid = { w: 0.55, c: o.c, co: true }; g.line([[x0, y1, z0], [x0, y0, z0], [x1, y0, z0]], hid); g.line([[x0, y0, z0], [x0, y0, z1]], hid); }
  if (!o.nb) { if (f.indexOf('l') >= 0) g.line([A, B], lo); if (f.indexOf('r') >= 0) g.line([B, Cc], lo); }
  if (f.indexOf('l') >= 0) g.line([A, A1], lo);
  if (f.indexOf('r') >= 0) g.line([Cc, C1], lo);
  if (f.indexOf('l') >= 0 || f.indexOf('r') >= 0) g.line([B, B1], li);
  if (f.indexOf('t') >= 0) { g.line([A1, B1], li); g.line([B1, C1], li); g.line([C1, D1], lo); g.line([D1, A1], lo); }
  else { if (f.indexOf('l') >= 0) g.line([A1, B1], lo); if (f.indexOf('r') >= 0) g.line([B1, C1], lo); }
};
/* points of a rectangle lying on a face. face 'L': plane y = p, a runs along x. face 'R': plane x = p, a runs along y */
K.on = function (face, p, a0, a1, z0, z1) {
  return face === 'L' ? [[a0, p, z0], [a1, p, z0], [a1, p, z1], [a0, p, z1]] : [[p, a0, z0], [p, a1, z0], [p, a1, z1], [p, a0, z1]];
};
K.pt = function (face, p, a, z) { return face === 'L' ? [a, p, z] : [p, a, z]; };
/* window. style: 'navy' (solid pane with sparse pale skips), 'glass' (pale glass, white glint, dark frame), 'slit' */
K.win = function (g, face, p, a0, a1, z0, z1, o) {
  o = o || {}; const st = o.style || 'navy', arch = o.arch;
  let pts;
  if (arch) {
    pts = [K.pt(face, p, a0, z0), K.pt(face, p, a1, z0)];
    const r = Math.abs(a1 - a0) / 2, m = (a0 + a1) / 2, zc = z1 - r * 0.9, n = 7;
    for (let i = 0; i <= n; i++) { const t = Math.PI * i / n; pts.push(K.pt(face, p, m + (a1 - m) * Math.cos(t), zc + r * 0.9 * Math.sin(t))); }
  } else pts = K.on(face, p, a0, a1, z0, z1);
  const col = o.col || (st === 'navy' ? C.navy : st === 'glass' ? C.glass : st === 'dark' ? '#3A3530' : C.glassD);
  g.fill(pts, col);
  const P = g.P(pts);
  if (st === 'navy' && o.skips !== false) g.scuff2(P, { n: 1 + (Math.abs((a1 - a0) * (z1 - z0)) > 6 ? 2 : 0), len: 1.2, c: '#DDE3EA', w: 0.5, dir: -0.9, spread: 1.2 });
  if (st === 'glass') {
    const a = P[0], b = P[2]; const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, d = Math.min(2.2, Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.22);
    g.segs2([mx - d * 0.2, my + d * 0.7, mx + d * 0.5, my - d * 0.7], C.white, 0.6);
  }
  if (o.line !== false) g.outline2(P, { w: o.w == null ? 0.55 : o.w, c: o.lc || (st === 'glass' ? C.ink : C.navyD), boil: false, ext: 0.4 });
};
/* gable roof. dir 'x': ridge runs along x (gable end faces lower-right); dir 'y': ridge along y (gable end faces lower-left) */
K.gable = function (g, x0, y0, x1, y1, z, h, dir, col, o) {
  o = o || {}; const c = typeof col === 'object' ? col : { a: shade(col, -0.1), b: shade(col, 0.1), e: o.end || C.wall };
  const lo = { w: o.w == null ? 1 : o.w, c: o.c }, li = { w: 0.8 * (o.w == null ? 1 : o.w), c: o.c };
  if (dir === 'x') {
    const ym = (y0 + y1) / 2;
    g.fill([[x0, y0, z], [x1, y0, z], [x1, ym, z + h], [x0, ym, z + h]], shade(c.a, 0.12));
    g.fill([[x0, y1, z], [x1, y1, z], [x1, ym, z + h], [x0, ym, z + h]], c.a);
    if (!o.noEnd) g.fill([[x1, y0, z], [x1, y1, z], [x1, ym, z + h]], c.e);
    g.line([[x0, y1, z], [x1, y1, z]], lo); g.line([[x0, ym, z + h], [x1, ym, z + h]], li);
    g.line([[x0, y1, z], [x0, ym, z + h]], lo); g.line([[x0, ym, z + h], [x0, y0, z]], lo);
    g.line([[x1, y1, z], [x1, ym, z + h]], li); g.line([[x1, ym, z + h], [x1, y0, z]], lo); if (!o.noEnd) g.line([[x1, y1, z], [x1, y0, z]], li);
  } else {
    const xm = (x0 + x1) / 2;
    g.fill([[x0, y0, z], [x0, y1, z], [xm, y1, z + h], [xm, y0, z + h]], shade(c.b, -0.12));
    g.fill([[x1, y0, z], [x1, y1, z], [xm, y1, z + h], [xm, y0, z + h]], c.b);
    if (!o.noEnd) g.fill([[x0, y1, z], [x1, y1, z], [xm, y1, z + h]], c.e);
    g.line([[x1, y0, z], [x1, y1, z]], lo); g.line([[xm, y0, z + h], [xm, y1, z + h]], li);
    g.line([[x1, y0, z], [xm, y0, z + h]], lo); g.line([[xm, y0, z + h], [x0, y0, z]], lo);
    g.line([[x1, y1, z], [xm, y1, z + h]], li); g.line([[xm, y1, z + h], [x0, y1, z]], lo); if (!o.noEnd) g.line([[x0, y1, z], [x1, y1, z]], li);
  }
};
/* hip (pyramid) roof with apex or short ridge */
K.hip = function (g, x0, y0, x1, y1, z, h, col, o) {
  o = o || {}; const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2, rl = o.ridge || 0;
  const lo = { w: o.w == null ? 1 : o.w, c: o.c }, li = { w: 0.8 * (o.w == null ? 1 : o.w), c: o.c };
  let a, b;                                     // ridge ends
  if (x1 - x0 >= y1 - y0) { a = [xm - rl / 2, ym, z + h]; b = [xm + rl / 2, ym, z + h]; }
  else { a = [xm, ym - rl / 2, z + h]; b = [xm, ym + rl / 2, z + h]; }
  const alongX = x1 - x0 >= y1 - y0;
  const P0 = [x0, y0, z], P1 = [x1, y0, z], P2 = [x1, y1, z], P3 = [x0, y1, z];
  g.fill(alongX ? [P0, P1, b, a] : [P0, P1, a], shade(col, 0.16));          // back
  g.fill(alongX ? [P0, P3, a] : [P0, P3, b, a], shade(col, -0.04));          // back-left
  g.fill(alongX ? [P3, P2, b, a] : [P3, P2, b], shade(col, -0.1));           // lit front-left
  g.fill(alongX ? [P1, P2, b] : [P1, P2, b, a], shade(col, 0.1));            // front-right
  g.line([P3, P2], lo); g.line([P2, P1], lo); g.line([P3, a], lo); g.line([P1, alongX ? b : a], lo);
  g.line([P2, b], li); if (rl) g.line([a, b], li);
  g.line([P0, a], { w: 0.6, c: o.c });
};
/* ground-circle arc as world points */
K.arc = function (cx, cy, z, r, a0, a1, n) { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]); } return p; };
const A_R = -Math.PI / 4, A_L = Math.PI * 3 / 4;       // right and left silhouette tangents of a vertical cylinder
/* vertical cylinder. o: {top colour, nt: no top, w, c, band: shade split 0..1} */
K.cyl = function (g, cx, cy, r, z0, z1, col, o) {
  o = o || {}; const c = K.tones(col), n = o.n || 14;
  const lo = { w: o.w == null ? 1 : o.w, c: o.c };
  const front0 = K.arc(cx, cy, z0, r, A_L, A_R, n), front1 = K.arc(cx, cy, z1, r, A_R, A_L, n);
  g.fill(front0.concat(front1), c.l);
  const k = Math.round(n * (o.band == null ? 0.62 : o.band));
  g.fill(front0.slice(k).concat(front1.slice(0, n - k + 1)), c.r);
  if (!o.nt) g.fill(K.arc(cx, cy, z1, r, 0, TAU, 24), o.top || c.t);
  g.line(K.arc(cx, cy, z0, r, A_L, A_R + TAU, n), { w: 0.5, c: o.c, co: true });
  g.line(front0, lo);
  g.line([front0[0], front1[n]], lo); g.line([front0[n], front1[0]], lo);
  if (!o.nt) g.line(K.arc(cx, cy, z1, r, 0, TAU, 28), { w: lo.w * 0.85, c: o.c, close: false });
  else g.line(front1, { w: lo.w * 0.85, c: o.c });
};
/* a dome (half ellipsoid) of radius r and height h standing at z0 */
K.domePts = function (g, cx, cy, z0, r, h) {
  const c = g.p(cx, cy, z0), a = r * SX, b = Math.hypot(h * VZ, r * SQ), pts = [];
  for (let i = 0; i <= 24; i++) { const t = Math.PI - Math.PI * i / 24; pts.push([c[0] + a * Math.cos(t), c[1] - b * Math.sin(t)]); }
  return { c, a, b, top: pts };
};
K.dome = function (g, cx, cy, r, z0, h, col, o) {
  o = o || {}; const d = K.domePts(g, cx, cy, z0, r, h);
  const base = g.P(K.arc(cx, cy, z0, r, A_R, A_L, 14));      // front half of the base circle, right to left
  g.fill2(d.top.concat(base), col);
  if (o.shadow) {
    if (o.band) {                                            // a cool shadow band falling from the crown down the right-hand side
      const m = (th, al) => g.p(cx + r * Math.cos(al) * Math.cos(th), cy + r * Math.cos(al) * Math.sin(th), z0 + h * Math.sin(al));
      const a0 = -0.16, a1 = 0.62, L = [], Rr = [];
      for (let k = 0; k <= 10; k++) { const al = (Math.PI / 2) * (k / 10) * 0.97; L.push(m(a1 - 0.12 * (1 - k / 10), al)); Rr.push(m(a0, al)); }
      g.fill2(L.concat(Rr.reverse()), o.shadow);
    } else {                                                 // or a crescent along the right-hand silhouette
      const out = [], inn = [];
      for (let i = 0; i <= 12; i++) { const t = lerp(-0.02, 1.25, i / 12); out.push([d.c[0] + d.a * Math.cos(t), d.c[1] - d.b * Math.sin(t)]); inn.push([d.c[0] + d.a * 0.56 * Math.cos(t) + d.a * 0.08, d.c[1] - d.b * Math.sin(t)]); }
      g.fill2(base.slice(0, 5).reverse().concat(out, inn.reverse()), o.shadow);
    }
  }
  if (o.ribs) {
    const n = o.ribs, V = [0.593, 0.593, 0.545];
    for (let i = 0; i < n; i++) {
      const th = TAU * i / n + (o.rib0 || 0), line = [];
      for (let k = 0; k <= 12; k++) {
        const al = (Math.PI / 2) * k / 12 * 0.96, x = r * Math.cos(al) * Math.cos(th), y = r * Math.cos(al) * Math.sin(th), z = h * Math.sin(al);
        if (V[0] * x / (r * r) + V[1] * y / (r * r) + V[2] * z / (h * h) < 0.004) { if (line.length > 1) break; else { line.length = 0; continue; } }
        line.push([cx + x, cy + y, z0 + z]);
      }
      if (line.length > 2) g.line(line, { c: o.ribCol || C.gold, w: o.ribW || 1.1, boil: false, ext: 0, taper: 0 });
    }
  }
  if (o.line !== false) { g.line2(d.top, { w: o.w == null ? 1 : o.w, c: o.c, ext: 0 }); if (!o.noBase) g.line2(base, { w: 0.85 * (o.w == null ? 1 : o.w), c: o.c }); }
  return d;
};
/* a cone / spire */
K.cone = function (g, cx, cy, r, z0, h, col, o) {
  o = o || {}; const apex = g.p(cx, cy, z0 + h), base = g.P(K.arc(cx, cy, z0, r, A_R, A_L, 12));
  g.fill2(base.concat([apex]), col);
  g.fill2(base.slice(0, 6).concat([apex]), shade(col, 0.14));
  g.line2(base, { w: 0.85, c: o.c }); g.line2([base[0], apex], { c: o.c }); g.line2([base[12], apex], { c: o.c });
};

/* ---------- plants ---------- */
/* round faceted tree. o: {r crown radius u, h trunk height u, col, seed} */
K.tree = function (g, x, y, o) {
  o = o || {}; const r = (o.r || 5) * 3.3, h = o.h == null ? 5.5 : o.h, seed = o.seed == null ? Math.round(x * 31 + y * 17) : o.seed;
  const f = g.p(x, y, o.z || 0), tw = o.tw || 1.25, top = f[1] - h * VZ;
  const col = o.col || C.leaf, R = RNG(seed * 7 + 3);
  g.fill2([[f[0] - tw, f[1]], [f[0] + tw, f[1]], [f[0] + tw * 0.85, top - r * 0.3], [f[0] - tw * 0.85, top - r * 0.3]], C.trunk);
  g.fill2([[f[0] + tw * 0.15, f[1]], [f[0] + tw, f[1]], [f[0] + tw * 0.85, top - r * 0.3], [f[0] + tw * 0.2, top - r * 0.3]], C.trunkD);
  g.line2([[f[0] - tw, f[1]], [f[0] - tw * 0.85, top]], { w: 0.6, c: '#5A4030' }); g.line2([[f[0] + tw, f[1]], [f[0] + tw * 0.85, top]], { w: 0.6, c: '#5A4030' });
  const cx = f[0], cy = top - r * 0.62, n = 9, pts = [];
  const a0 = R() * TAU;
  for (let i = 0; i < n; i++) { const a = a0 + TAU * i / n, rr = r * (0.9 + R() * 0.2); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.9]); }
  g.fill2(pts, col);
  // a broad shadow facet on the lower right, a lighter one upper left
  const sh = pts.map((p) => [p[0], p[1]]).filter((p) => (p[0] - cx) * 0.55 + (p[1] - cy) > -r * 0.12);
  if (sh.length >= 2) { sh.push([cx + r * 0.05, cy + r * 0.15]); g.fill2(sortAround(sh), shade(col, 0.13)); }
  const hl = pts.filter((p) => (p[0] - cx) * 0.6 + (p[1] - cy) < -r * 0.55);
  if (hl.length >= 2) { hl.push([cx - r * 0.25, cy - r * 0.3]); g.fill2(sortAround(hl), shade(col, -0.2)); }
  g.outline2(pts, { c: o.ink || C.leafInk, w: 0.9, ext: 0.5 });
  const segs = [];
  for (let i = 0; i < 4; i++) {            // a few C-shaped leaf marks
    const a = R() * TAU, d = r * (0.2 + R() * 0.5), px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.9, l = r * (0.12 + R() * 0.12), t = -0.9 + R() * 0.6;
    segs.push(px, py, px + Math.cos(t) * l, py + Math.sin(t) * l, px + Math.cos(t) * l, py + Math.sin(t) * l, px + Math.cos(t + 0.9) * l * 1.6, py + Math.sin(t + 0.9) * l * 1.6);
  }
  g.segs2(segs, o.ink || C.leafInk, 0.55);
};
function sortAround(pts) {
  let cx = 0, cy = 0; for (const p of pts) { cx += p[0]; cy += p[1]; } cx /= pts.length; cy /= pts.length;
  return pts.slice().sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx));
}
/* pointed dark cypress */
K.cypress = function (g, x, y, o) {
  o = o || {}; const f = g.p(x, y, o.z || 0), h = (o.h || 13) * VZ, w = (o.r || 2.6) * 3.2, col = o.col || C.cyp;
  g.fill2([[f[0] - 0.8, f[1]], [f[0] + 0.8, f[1]], [f[0] + 0.8, f[1] - h * 0.2], [f[0] - 0.8, f[1] - h * 0.2]], C.trunkD);
  const L = [], Rr = [], n = 6;
  for (let i = 0; i <= n; i++) { const t = i / n, ww = w * Math.sin(Math.PI * Math.pow(t, 0.62)) * (0.92 + 0.16 * h2(i, Math.round(x * 13 + y))); L.push([f[0] - ww, f[1] - h * 0.12 - h * 0.88 * t]); Rr.push([f[0] + ww, f[1] - h * 0.12 - h * 0.88 * t]); }
  const pts = L.concat(Rr.reverse());
  g.fill2(pts, col);
  g.fill2([[f[0] + w * 0.1, f[1] - h * 0.12]].concat(pts.slice(n + 1)), shade(col, 0.16));
  g.outline2(pts, { c: '#2F4A2C', w: 0.9 });
};
/* palm: segmented trunk, drooping fronds */
K.palm = function (g, x, y, o) {
  o = o || {}; const f = g.p(x, y, o.z || 0), h = (o.h || 14) * VZ, lean = (o.lean || 0) * 3, R = RNG(Math.round(x * 91 + y * 7));
  const top = [f[0] + lean, f[1] - h];
  g.fill2([[f[0] - 1.3, f[1]], [f[0] + 1.3, f[1]], [top[0] + 0.9, top[1]], [top[0] - 0.9, top[1]]], '#B08A5E');
  g.line2([[f[0] - 1.3, f[1]], [top[0] - 0.9, top[1]]], { w: 0.6, c: '#6B4F35' }); g.line2([[f[0] + 1.3, f[1]], [top[0] + 0.9, top[1]]], { w: 0.6, c: '#6B4F35' });
  const segs = []; for (let i = 1; i < 8; i++) { const t = i / 8; segs.push(lerp(f[0], top[0], t) - 1.1, lerp(f[1], top[1], t), lerp(f[0], top[0], t) + 1.1, lerp(f[1], top[1], t) - 0.5); }
  g.segs2(segs, '#6B4F35', 0.45);
  const fr = o.fr || 7, r = (o.r || 5.5) * 3;
  for (let i = 0; i < fr; i++) {
    const a = -Math.PI * 0.95 + (Math.PI * 0.9) * (i / (fr - 1)) + (R() - 0.5) * 0.2, len = r * (0.85 + R() * 0.3), droop = r * (0.35 + 0.5 * Math.abs(Math.cos(a)));
    const ex = top[0] + Math.cos(a) * len, ey = top[1] + Math.sin(a) * len * 0.55 + droop * 0.75;
    const mx = top[0] + Math.cos(a) * len * 0.55, my = top[1] + Math.sin(a) * len * 0.6 - r * 0.1;
    const pts = [top, [mx - 0.5, my - 1.8], [ex, ey], [mx + 0.5, my + 2.2]];
    g.fill2(pts, i % 2 ? '#7FA95C' : '#95BD6C');
    g.outline2(pts, { c: C.leafInk, w: 0.7, boil: false });
  }
  g.disc2(top, 1.5, '#7A5A3C');
};
/* clipped box hedge */
K.hedge = function (g, x0, y0, x1, y1, h, o) {
  o = o || {}; const col = o.col || '#7FA65A';
  K.box(g, x0, y0, x1, y1, 0, h, { t: shade(col, -0.16), l: col, r: shade(col, 0.13) }, { c: '#42602F', w: 0.9 });
  g.scuff(K.on('L', y1, x0, x1, 0, h), { c: shade(col, 0.28), len: 1.3, dir: -1.2, spread: 1.4, dens: 1.1, w: 0.5 });
  g.scuff([[x0, y1, h], [x1, y1, h], [x1, y0, h], [x0, y0, h]], { c: shade(col, 0.2), len: 1.2, dir: -1.2, spread: 1.4, dens: 0.7, w: 0.5 });
};
/* round flowering shrub / bush */
K.bush = function (g, x, y, o) {
  o = o || {}; const f = g.p(x, y, o.z || 0), r = (o.r || 2) * 3.1, col = o.col || C.leaf, R = RNG(Math.round(x * 57 + y * 13));
  const pts = []; for (let i = 0; i < 8; i++) { const a = TAU * i / 8 + R(), rr = r * (0.88 + R() * 0.24); pts.push([f[0] + Math.cos(a) * rr, f[1] - r * 0.75 + Math.sin(a) * rr * 0.85]); }
  g.fill2(pts, col); g.fill2(sortAround(pts.filter((p) => p[0] - f[0] + (p[1] - f[1] + r * 0.75) > -r * 0.1).concat([[f[0], f[1] - r * 0.7]])), shade(col, 0.12));
  g.outline2(pts, { c: o.ink || shade(col, 0.5), w: 0.75 });
};
/* a low bed with rows of blooms. Soil box is static; draw blooms separately with K.blooms for the cast */
K.blooms = function (g, x0, y0, x1, y1, z, cols, o) {
  o = o || {}; const R = RNG(Math.round(x0 * 31 + y0 * 77 + x1)), sp = o.sp || 1.5, r = o.r || 1.7;
  for (let x = x0 + sp / 2; x < x1; x += sp) for (let y = y0 + sp / 2; y < y1; y += sp) {
    const p = g.p(x + (R() - 0.5) * 0.5, y + (R() - 0.5) * 0.5, z + 0.5), col = R.pick(cols);
    g.disc2(p, r * (0.8 + R() * 0.35), col); g.ring2(p, r, { c: shade(col, 0.45), w: 0.4 });
  }
};

/* ---------- people ---------- */
/* A person is a small figure in three-quarter view, built on a skeleton that is posed in 2-D and dressed in layers.
   dir: 0 faces lower-right, 1 lower-left, 2 upper-left (back to us), 3 upper-right (back to us).
   pose: 'stand' | 'walk' (ph 0..1) | 'cheer' (ph) | 'sit' | 'wave' (ph) | 'hold' | 'crouch' | 'kneel'.
   The figure is laid out turned to the right (u = towards the way they face, v = down, wide px at k = 1) and mirrored
   for the left: feet on v = 0, hips -10, shoulders -15.6, crown about -21.3, so the head is a fifth of the height.
   The far side of the body (+u) is drawn a little narrower and darker; light comes from the upper left of the screen.
   Options: skin hair top bot shoe | hairStyle short buzz bob long pony bun curly bald | dress (colour) | shorts | bare
   (short sleeves) | jacket (colour of the shirt seen in an open jacket) | tie | cap | blush | beard | glasses | build 0..1
   | reach [dx,dy] hands to a point (screen offsets / k) | hands [[dx,dy],[dx,dy]] each hand to its own point | pedal [[dx,dy],
   [dx,dy]] feet to points | glove (colour, near hand) | sway (crouch) | noLegs | lean | lie (screen angle of
   the head end: the figure lies down with its hips on the anchor). Feet at (x, y, z) otherwise.
   Returns attachment points in wide px: { crown, head, headR, hands: [near, far], hip, shoulders }. */
K.person = function (g, x, y, z, o) {
  o = o || {}; const k = o.k || 1, F = g.p(x, y, z || 0), dir = o.dir | 0, back = dir >= 2, sg = (dir === 0 || dir === 3) ? 1 : -1;
  const skin = o.skin || SKIN[2], hair = o.hair || HAIR[1], top = o.top || CLOTH[5], bot = o.bot || '#3F4D63', ink = o.ink || '#3A3128';
  const shoe = o.shoe || '#F3F1EA', pose = o.pose || 'stand', ph = o.ph || 0, sit = pose === 'sit', hs = o.hairStyle || 'short';
  const b = o.build == null ? 0.5 : o.build, LW = 0.46, LF = 0.3;
  // lean: the upper body shears forward about the hips (a rider reaching for the bars)
  const crouch = pose === 'crouch', kneel = pose === 'kneel', swayU = (o.sway || 0) * 0.9;
  let lean = 0, hipV = sit ? -4.4 : crouch ? -7.3 + Math.abs(o.sway || 0) * 0.5 : kneel ? -5.6 : -10.0;
  // sway: the body leans sideways over planted feet
  const shear = (v) => lean * clamp((hipV - v) / 5.6, 0, 1.7) + swayU * clamp(v / hipV, 0, 1);
  // lie: a screen angle for the head end; the figure is laid down about its hips, which sit on (x, y, z)
  const rot = o.lie == null ? 0 : o.lie + Math.PI / 2, rc = Math.cos(rot), rs = Math.sin(rot);
  const P = (u, v) => {
    const a = sg * (u + shear(v)) * k; if (!rot) return [F[0] + a, F[1] + v * k];
    const b = (v - hipV) * k; return [F[0] + a * rc - b * rs, F[1] + a * rs + b * rc];
  };
  const PP = (pts) => pts.map((p) => P(p[0], p[1]));
  const fillX = (pts, col) => g.fill2(pts, col, true);
  const shape = (pts, col, w) => { const s = PP(pts); fillX(s, col); if (w !== 0) g.line2(s, { w: w || LW, c: ink, boil: false, close: true, wob: 0.35 }); return s; };
  const smooth = (pts, n) => K.curve(pts, n || 3, true);
  const oval = (c, rx, ry, col, w, rot) => { const pts = [], ca = Math.cos(rot || 0), sa = Math.sin(rot || 0); for (let i = 0; i < 12; i++) { const t = TAU * i / 12, a = Math.cos(t) * rx, bb = Math.sin(t) * ry; pts.push([c[0] + a * ca - bb * sa, c[1] + a * sa + bb * ca]); } return shape(pts, col, w); };
  const add = (a, d, s) => [a[0] + d[0] * (s == null ? 1 : s), a[1] + d[1] * (s == null ? 1 : s)];
  const nrm = (a, c) => { const dx = c[0] - a[0], dy = c[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  /* a limb as one tapered tube through its joints: [[u, v, r], ...], rounded at both ends */
  const tube = (ch, col, w) => {
    const s = ch.length > 2 ? K.curve(ch, 4) : ch, n = s.length, A = [], B = [];
    for (let i = 0; i < n; i++) {
      const a = s[Math.max(0, i - 1)], c = s[Math.min(n - 1, i + 1)], t = nrm(a, c), r = s[i][2];
      A.push([s[i][0] - t[1] * r, s[i][1] + t[0] * r]); B.push([s[i][0] + t[1] * r, s[i][1] - t[0] * r]);
    }
    const cap = (c, t, r, from) => { const out = [], th = Math.atan2(t[1], t[0]); for (let j = 1; j < 6; j++) { const a = th + from - Math.PI * j / 6; out.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]); } return out; };
    const tE = nrm(s[n - 2], s[n - 1]), tS = nrm(s[0], s[1]);
    const pts = A.concat(cap(s[n - 1], tE, s[n - 1][2], Math.PI / 2), B.reverse(), cap(s[0], tS, s[0][2], -Math.PI / 2));
    return shape(pts, col, w);
  };
  /* two-bone reach: the middle joint of a limb a->c with bone lengths l1, l2, bent towards pref */
  const ik = (a, c, l1, l2, pref) => {
    let dx = c[0] - a[0], dy = c[1] - a[1]; const d = Math.hypot(dx, dy) || 1e-3; dx /= d; dy /= d;
    const dd = Math.min(d, l1 + l2 - 0.02), m = (l1 * l1 - l2 * l2 + dd * dd) / (2 * dd), h = Math.sqrt(Math.max(0, l1 * l1 - m * m));
    let px = -dy, py = dx; if (px * pref[0] + py * pref[1] < 0) { px = -px; py = -py; }
    const j = [a[0] + dx * m + px * h, a[1] + dy * m + py * h], e = d > l1 + l2 ? [a[0] + dx * (l1 + l2), a[1] + dy * (l1 + l2)] : c;
    return [j, e];
  };
  // the far side of the body is foreshortened by the turn
  const FAR = 0.84, sw = 2.3 + 0.5 * b, ww = 1.68 + 0.42 * b, hw = 2.12 + 0.12 * (1 - b);

  /* ----- the pose: hips, shoulders, the ends of the limbs ----- */
  const fwdV = back ? -0.3 : 0.3, s2 = TAU * ph;
  let lift = 0;
  if (pose === 'walk') hipV += 0.32 * (Math.abs(Math.sin(s2)));
  if (pose === 'cheer') lift = 0.7 * Math.max(0, Math.sin(s2));
  hipV -= lift;
  const sv = hipV - 5.6, HC = [0.22, sv - 3.25];
  const hipJ = [[-0.92, hipV + 0.15], [0.8, hipV - 0.15]];                 // near, far
  const shJ = [[-sw + 0.2, sv + 1.0], [(sw - 0.2) * FAR, sv + 1.0]];
  const feet = [], knees = [], legSwing = [0, 0];
  const L1 = 4.78, L2 = 4.47;
  for (let i = 0; i < 2; i++) {
    const H = hipJ[i]; let A, pref = [1, 0];
    if (sit && o.pedal) { const r = ik(H, [o.pedal[i][0] * sg, o.pedal[i][1]], L1 * 0.9, L2 * 0.9, [1, -0.5]); knees.push(r[0]); feet.push(r[1]); continue; }
    if (sit) {
      const kn = back ? [H[0] + 1.7, H[1] - 1.0] : [H[0] + 3.1, H[1] + 0.6];
      const an = [kn[0] - (back ? 0.2 : 0.35), back ? kn[1] + 2.2 : -0.62 + i * -0.3];
      knees.push(kn); feet.push(an); continue;
    }
    if (kneel) {                                           // the near knee on the ground, its foot behind; the far foot planted, knee up
      if (i === 0) { knees.push([H[0] + 0.5, -0.75]); feet.push([H[0] - 3.0, -0.55]); }
      else { const r = ik(H, [H[0] + 2.4, -0.87], L1, L2, [1, -1]); knees.push(r[0]); feet.push(r[1]); }
      continue;
    }
    if (crouch) {                                          // the fielder's ready stance: feet wide, knees out
      const r = ik(H, [i ? 2.15 : -2.45, -0.62 + (i ? -0.25 : 0.1)], L1, L2, [i ? 1 : -1, -0.3]); knees.push(r[0]); feet.push(r[1]); continue;
    }
    if (pose === 'walk') {
      const p = s2 + (i ? Math.PI : 0), s = Math.sin(p), c = Math.cos(p), st = 2.25;
      legSwing[i] = s;
      A = [H[0] * 0.55 + s * st * 0.88, -0.72 + s * st * fwdV - 1.0 * Math.pow(Math.max(0, c), 1.5) + (i ? -0.25 : 0.1)];
      if (c <= 0.15) {                                     // the stance leg stays straight; perspective only shortens it
        const d = Math.hypot(A[0] - H[0], A[1] - H[1]), t = L1 / (L1 + L2), kn = [lerp(H[0], A[0], t) + 0.18, lerp(H[1], A[1], t)];
        knees.push(kn); feet.push(d > L1 + L2 ? [H[0] + (A[0] - H[0]) * (L1 + L2) / d, H[1] + (A[1] - H[1]) * (L1 + L2) / d] : A); continue;
      }
    } else A = [H[0] * 0.92 + (i ? 0.15 : -0.1), -0.72 - lift * 0.6 + (i ? -0.25 : 0.1)];
    const r = ik(H, A, L1, L2, pref); knees.push(r[0]); feet.push(r[1]);
  }
  // hands: [target, elbow preference] per arm
  const hand = [], elbowPref = [[-1, 0.3], [-1, 0.3]];
  const reach = o.reach ? [o.reach[0] * sg, o.reach[1]] : null;
  lean = o.lean != null ? o.lean : reach ? 1.5 : crouch ? 1.1 : kneel ? 0.8 : 0;
  if (reach) reach[0] -= shear(reach[1]);
  for (let i = 0; i < 2; i++) {
    const S = shJ[i], sd = i ? 1 : -1; let T;
    if (o.hands) { const h = o.hands.map((q) => [q[0] * sg, q[1]]).sort((a, c) => a[0] - c[0]); T = [h[i][0] - shear(h[i][1]), h[i][1]]; elbowPref[i] = [i ? 1 : -1, 0.6]; }
    else if (reach) { T = [reach[0] + (i ? 0.35 : -0.35), reach[1] + (i ? -0.25 : 0.2)]; elbowPref[i] = [-0.3, 1]; }
    else if (crouch) { T = [knees[i][0] + 0.45, knees[i][1] - 0.7]; elbowPref[i] = [i ? 1 : -1, 0]; }
    else if (kneel) { T = [knees[1][0] + (i ? 0.45 : -0.25), knees[1][1] - (i ? 0.45 : 0.15)]; elbowPref[i] = [-0.6, 1]; }
    else if (pose === 'cheer') { const w = Math.sin(s2 + i * 1.3); T = [S[0] + sd * 1.3, sv - 5.4 - w * 0.6]; elbowPref[i] = [sd, 0.2]; }
    else if (pose === 'wave' && i === 1) { const w = Math.sin(s2); T = [S[0] + 1.2 + w * 0.75, sv - 4.6]; elbowPref[i] = [1, 0.6]; }
    else if (pose === 'hold') { T = [i ? 1.55 : 1.0, sv + 4.0 + (i ? -0.15 : 0.15)]; elbowPref[i] = [-0.8, 1]; }
    else if (sit) { T = back ? [S[0] + 1.6, sv + 5.0] : [hipJ[i][0] + (i ? 2.4 : 2.2), hipV - 0.75 + (i ? -0.2 : 0.1)]; elbowPref[i] = [-1, 0.2]; }
    else if (pose === 'walk') { const s = -legSwing[1 - i], du = s * 1.15; T = [S[0] * 1.03 + du, S[1] + Math.sqrt(6.3 * 6.3 - du * du) - 0.5 + s * fwdV]; elbowPref[i] = [-1, 0.1]; }
    else T = [S[0] * 1.04 + (i ? 0.12 : -0.1), sv + 6.7];
    hand.push(T);
  }
  const elbows = [], wrists = [];
  for (let i = 0; i < 2; i++) { const r = ik(shJ[i], hand[i], 3.3, 3.0, elbowPref[i]); elbows.push(r[0]); wrists.push(r[1]); }

  /* ----- parts ----- */
  const farCol = (c) => shade(c, 0.1);
  const bareLeg = o.dress || o.shorts;
  const drawShoe = (i) => {
    const an = feet[i], kn = knees[i], col = i ? farCol(shoe) : shoe;
    if (back && !sit) {   // heel towards us, the toe runs away behind the leg
      const R = (u, v) => [an[0] + u, an[1] + v], L = hex2rgb(shoe);
      shape(smooth([R(-0.74, 0.12), R(0.2, -0.3), R(1.02, 0.02), R(1.06, 0.7), R(0.3, 1.1), R(-0.62, 0.98)], 2), col);
      fillX(PP([R(-0.55, 0.78), R(0.95, 0.66), R(0.86, 0.9), R(0.3, 1.0), R(-0.5, 0.92)]), L[0] + L[1] + L[2] > 560 ? '#CFC8B9' : '#EDE8DC');
      return;
    }
    const a = Math.atan2(an[0] - kn[0], an[1] - kn[1]), rot = clamp(-a * 0.9, -0.25, 0.95), ca = Math.cos(rot), sa = Math.sin(rot);
    const R = (u, v) => [an[0] + u * ca - v * sa, an[1] + u * sa + v * ca];
    const up = [R(-0.5, -0.38), R(0.45, -0.48), R(1.55, -0.05), R(2.12, 0.38), R(2.05, 0.72), R(-0.55, 0.74), R(-0.7, 0.2)];
    shape(smooth(up, 2), col);
    const L = hex2rgb(shoe); fillX(PP([R(-0.5, 0.4), R(1.98, 0.43), R(1.94, 0.6), R(-0.5, 0.6)]), L[0] + L[1] + L[2] > 560 ? '#CFC8B9' : '#EDE8DC');
  };
  const drawLeg = (i) => {
    const H = hipJ[i], kn = knees[i], an = feet[i], fc = (c) => i ? farCol(c) : c;
    const mid = (a, c, t) => [lerp(a[0], c[0], t), lerp(a[1], c[1], t)];
    const th = mid(H, kn, 0.45), cf = mid(kn, an, 0.3);
    if (bareLeg && !(o.dress && sit)) tube([[H[0], H[1], 1.15], [th[0], th[1], 1.02], [kn[0], kn[1], 0.74], [cf[0], cf[1], 0.8], [an[0], an[1], 0.46]], fc(skin));
    else if (o.dress && sit) { tube([[H[0], H[1], 1.3], [kn[0], kn[1], 1.15]], fc(o.dress)); tube([[kn[0], kn[1], 0.72], [cf[0], cf[1], 0.78], [an[0], an[1], 0.46]], fc(skin)); }
    else tube([[H[0], H[1], 1.28], [th[0], th[1], 1.16], [kn[0], kn[1], 0.98], [cf[0], cf[1], 0.95], [an[0], an[1], 0.84]], fc(bot));
    if (o.shorts) { const e = mid(H, kn, 0.72); tube([[H[0], H[1], 1.36], [e[0], e[1], 1.3]], fc(bot)); }
  };
  const drawArm = (i) => {
    const S = shJ[i], E = elbows[i], W = wrists[i], fc = (c) => i ? farCol(c) : c, cloth = fc(o.sleeve || top);
    const ua = [lerp(S[0], E[0], 0.5), lerp(S[1], E[1], 0.5)], fa = [lerp(E[0], W[0], 0.45), lerp(E[1], W[1], 0.45)];
    if (o.bare) {
      tube([[S[0], S[1], 0.82], [ua[0], ua[1], 0.72], [E[0], E[1], 0.56], [fa[0], fa[1], 0.6], [W[0], W[1], 0.42]], fc(skin));
      const e = [lerp(S[0], E[0], 0.55), lerp(S[1], E[1], 0.55)];
      tube([[S[0], S[1], 0.94], [e[0], e[1], 0.88]], cloth);
    } else tube([[S[0], S[1], 0.92], [ua[0], ua[1], 0.84], [E[0], E[1], 0.74], [fa[0], fa[1], 0.72], [W[0], W[1], 0.62]], cloth);
    // the hand: a mitten along the forearm with a thumb on the inside
    const d = nrm(E, W), n = [-d[1], d[0]], fist = pose === 'cheer', L = fist ? 0.5 : 0.66;
    const hc = add(W, d, fist ? 0.42 : 0.55), side = (n[0] > 0 ? 1 : -1);
    if (o.glove && i === 0) { const gc = add(W, d, 0.75); oval(gc, 1.05, 0.9, o.glove, LW, Math.atan2(d[1], d[0])); oval(add(gc, d, 0.1), 0.5, 0.42, shade(o.glove, 0.25), 0); return; }
    oval(add(add(W, d, 0.18), n, 0.36 * side), 0.36, 0.22, fc(skin), LF, Math.atan2(d[1], d[0]) + 0.5 * side);
    oval(hc, L, fist ? 0.48 : 0.42, fc(skin), LF, Math.atan2(d[1], d[0]));
  };
  /* ----- head ----- */
  const RX = 1.92, RY = 2.2;
  const skull = () => {
    const pts = [];
    for (let i = 0; i < 22; i++) {
      const t = TAU * i / 22, c = Math.cos(t), s = Math.sin(t); let u = c * RX, v = s * RY;
      if (s > 0) { u *= 1 - 0.27 * s * s; u += (back ? 0.12 : 0.34) * s; v += 0.1 * s; }
      if (c < 0) u *= 1.04;
      pts.push([HC[0] + u, HC[1] + v]);
    }
    return pts;
  };
  const HD = (pts) => pts.map((p) => [HC[0] + p[0], HC[1] + p[1]]);
  const hairCol = hs === 'buzz' ? mix(hair, skin, 0.32) : hair;
  const hairShape = (pts, n) => shape(smooth(HD(pts), n || 3), hairCol);
  const bump = (c, rx, ry, a0, a1, lobes) => { const out = []; const N = 40; for (let i = 0; i <= N; i++) { const a = a0 + (a1 - a0) * i / N, r = 0.93 + 0.11 * Math.abs(Math.sin(lobes * a)); out.push([c[0] + Math.cos(a) * rx * r, c[1] + Math.sin(a) * ry * r]); } return out; };
  const capFront = {
    short: [[-1.7, 1.0], [-2.14, -0.1], [-1.96, -1.32], [-1.05, -2.33], [0.3, -2.5], [1.48, -1.97], [2.06, -0.95], [1.72, -0.78], [1.15, -1.12], [0.35, -1.02], [-0.32, -0.78], [-0.6, 0.22], [-0.74, 0.78], [-1.25, 0.98]],
    buzz: [[-1.62, 0.95], [-2.02, -0.1], [-1.86, -1.28], [-1.0, -2.24], [0.3, -2.36], [1.4, -1.86], [1.84, -1.1], [1.4, -1.22], [0.45, -1.36], [-0.32, -1.0], [-0.55, 0.25], [-0.7, 0.75], [-1.2, 0.95]],
    bob: [[-2.15, 1.75], [-2.32, 0.2], [-2.06, -1.36], [-1.05, -2.42], [0.35, -2.56], [1.62, -1.96], [2.22, -0.7], [2.16, 0.9], [1.86, 1.58], [1.56, 1.22], [1.46, -0.12], [1.02, -0.82], [0.22, -0.74], [-0.5, -0.72], [-0.7, 0.4], [-1.0, 1.42], [-1.62, 1.86]],
    long: [[-2.0, 3.65], [-2.36, 1.5], [-2.32, 0.0], [-2.06, -1.36], [-1.05, -2.46], [0.35, -2.56], [1.62, -1.96], [2.2, -0.6], [2.2, 1.0], [1.95, 2.1], [1.6, 1.4], [1.5, -0.2], [1.0, -1.0], [0.3, -1.0], [-0.45, -0.66], [-0.76, 0.9], [-1.06, 2.4], [-1.46, 3.7]],
  };
  capFront.pony = capFront.short.map((p, j) => j >= 7 && j <= 10 ? [p[0], p[1] - 0.12] : p); capFront.bun = capFront.short;
  const capBack = {
    short: [[0.95, 1.12], [-0.3, 1.45], [-1.56, 1.05], [-2.12, -0.1], [-1.92, -1.36], [-1.0, -2.36], [0.4, -2.48], [1.56, -1.86], [2.06, -0.75], [1.56, -0.42], [1.16, 0.32]],
    buzz: [[0.9, 1.0], [-0.3, 1.3], [-1.5, 0.95], [-2.0, -0.1], [-1.82, -1.3], [-0.96, -2.26], [0.4, -2.36], [1.46, -1.8], [1.86, -0.8], [1.46, -0.5], [1.1, 0.3]],
    bob: [[2.05, 1.6], [2.2, -0.6], [1.6, -1.96], [0.4, -2.56], [-1.05, -2.42], [-2.05, -1.36], [-2.3, 0.2], [-2.15, 1.75], [-0.8, 2.06], [0.8, 2.0]],
    long: [[1.75, 0.6], [2.04, -0.7], [1.58, -1.98], [0.4, -2.54], [-1.0, -2.44], [-1.98, -1.38], [-2.36, 0.2], [-2.5, 2.7], [-2.25, 4.9], [-1.3, 5.75], [0.0, 5.95], [1.2, 5.55], [1.95, 4.4], [2.15, 2.6]],
  };
  capBack.pony = capBack.short; capBack.bun = capBack.short;
  const drawHairBehind = () => {        // what hangs behind the head and body
    if (back) return;
    if (hs === 'long') hairShape([[-1.5, -1.8], [-2.36, 0.0], [-2.56, 2.6], [-2.4, 5.3], [-1.3, 5.82], [-0.2, 5.4], [0.9, 4.2], [1.6, 2.4], [1.9, 0.3], [1.4, -1.4]]);
    if (hs === 'pony') { tube(HD([[-1.6, -1.0, 0.55], [-2.5, 0.3, 0.72], [-2.62, 1.9, 0.6], [-2.3, 3.3, 0.22]]).map((p, j) => p.concat([[0.55, 0.72, 0.6, 0.22][j]])), hair); }
    if (hs === 'bun') { oval(HD([[-1.12, -2.28]])[0], 1.0, 0.92, hair); }
  };
  const drawHead = () => {
    // neck, in the shadow of the jaw
    tube([[0.18, sv - 0.1, 0.66], [0.26, HC[1] + 1.2, 0.62]], shade(skin, 0.13), LF);
    const sk = shape(skull(), skin);
    const ear = back ? [1.2, 0.3] : [-1.06, 0.22];
    if (!back) {
      const fc = [0.6, 0.15], eyeN = [fc[0] - 0.74, fc[1] - 0.12], eyeF = [fc[0] + 0.66, fc[1] - 0.14];
      // shade on the far side of the face, under the cheekbone
      fillX(PP(HD([[1.5, 0.2], [1.62, 1.0], [1.12, 1.95], [0.75, 2.1], [1.15, 1.2]])), shade(skin, 0.07));
      if (o.blush) { g.disc2(P(HC[0] + fc[0] - 0.98, HC[1] + fc[1] + 0.82), 0.44 * k, 'rgba(226,128,118,0.5)'); g.disc2(P(HC[0] + fc[0] + 0.86, HC[1] + fc[1] + 0.8), 0.32 * k, 'rgba(226,128,118,0.5)'); }
      if (o.beard) shape(smooth(HD([[-0.68, 0.42], [-0.6, 1.35], [0.05, 2.15], [0.7, 2.36], [1.42, 1.8], [1.72, 0.9], [1.32, 1.02], [0.75, 1.12], [0.3, 1.16], [-0.2, 0.98]]), 2), shade(hair, 0.06), LF);
      const brow = shade(hair === '#8E8A84' ? '#6E6A64' : hair, 0.25);
      for (const [e, s] of [[eyeN, 1], [eyeF, 0.86]]) {
        const c = HD([e])[0];
        g.disc2(P(c[0], c[1]), 0.235 * s * k, '#2A2420');
        for (let j = 0; j < 5; j++) { const t = j / 4; g.disc2(P(c[0] + (t - 0.5) * 0.62 * s, c[1] - 0.6 - 0.1 * Math.sin(t * Math.PI) + (t - 0.5) * -0.06), 0.085 * k, brow); }
      }
      fillX(PP(HD([[fc[0] + 0.12, fc[1] + 0.12], [fc[0] + 0.66, fc[1] + 0.78], [fc[0] + 0.1, fc[1] + 0.86]])), shade(skin, 0.18));
      const m = HD([[fc[0] + 0.05, fc[1] + 1.32]])[0];
      if (pose === 'cheer') oval(m, 0.36, 0.3, '#7A3530', 0);
      else fillX(PP([[m[0] - 0.42, m[1] - 0.08], [m[0], m[1] + 0.1], [m[0] + 0.36, m[1] - 0.1], [m[0] + 0.02, m[1] + 0.26]]), '#9B5148');
      if (o.glasses) { const a = HD([eyeN])[0], c = HD([eyeF])[0]; g.ring2(P(a[0], a[1]), 0.48 * k, { c: ink, w: 0.26 }); g.ring2(P(c[0], c[1]), 0.42 * k, { c: ink, w: 0.26 }); g.fine2([P(a[0] + 0.48, a[1]), P(c[0] - 0.42, c[1])], { c: ink, w: 0.26 }); }
    }
    // hair
    const capT = (back ? capBack : capFront)[hs];
    if (hs === 'curly') {
      const c = [HC[0] - 0.25, HC[1] - 0.55];
      const outer = back ? bump(c, 2.5, 2.45, 1.25, TAU - 0.32, 6) : bump(c, 2.55, 2.45, 2.55, 6.05, 6);
      const inner = back ? HD([[1.6, -0.45], [1.22, 0.45]]) : HD([[1.62, -0.62], [1.0, -1.08], [0.3, -1.02], [-0.4, -0.82], [-0.64, 0.2], [-0.84, 0.85], [-1.62, 1.15]]);
      shape(outer.concat(inner), hairCol);
    } else if (capT) hairShape(capT);
    if (capT || hs === 'curly') fillX(PP(HD([[-0.9, -1.85], [0.1, -2.18], [0.9, -1.9], [0.15, -1.72]])), shade(hairCol, -0.22));
    // the ear sits on top of short hair
    if (!(hs === 'long' || hs === 'bob' || hs === 'curly') || back && hs === 'curly') {
      const e = HD([ear])[0]; oval(e, 0.33, 0.52, skin, LF); fillX(PP([[e[0] - 0.05, e[1] - 0.25], [e[0] + 0.12, e[1] - 0.05], [e[0] - 0.02, e[1] + 0.28]]), shade(skin, 0.2));
    }
    if (back) {
      if (hs === 'bun') oval(HD([[-0.3, -1.65]])[0], 1.02, 0.95, hair);
      if (hs === 'pony') { tube(HD([[-0.2, -0.9], [-0.5, 0.5], [-0.55, 1.7], [-0.4, 2.8]]).map((p, j) => p.concat([[0.62, 0.74, 0.6, 0.24][j]])), hair); }
    }
    if (back && hs === 'long') for (const [a, c] of [[[-0.9, 1.0], [-1.3, 5.2]], [[0.2, 1.4], [0.05, 5.6]], [[1.1, 1.2], [1.45, 4.9]]]) g.line2(PP(HD([a, c])), { w: LF * 0.7, c: mix(hair, '#F6F3EA', 0.2), boil: false, wob: 0.6 });
    if (hs === 'pony') oval(HD([back ? [-0.22, -0.6] : [-1.72, -0.72]])[0], 0.32, 0.28, '#C9584B', LF);
    if (o.cap) {
      const cp = shade(o.cap, 0);
      shape(smooth(HD([[-2.18, -0.3], [-2.08, -1.4], [-1.1, -2.48], [0.35, -2.66], [1.6, -2.06], [2.12, -0.86], [0.2, -0.95]]), 3), cp);
      if (!back) shape(HD([[1.3, -1.02], [3.25, -0.62], [3.12, -0.18], [1.4, -0.48]]), shade(o.cap, 0.16));
      fillX(PP(HD([[-0.2, -2.62], [0.3, -2.66], [0.3, -2.42], [-0.2, -2.4]])), shade(o.cap, 0.25));
    }
  };
  /* ----- torso ----- */
  const torsoPts = (topV) => {
    const neckDip = back ? 0.05 : 0.62;
    return smooth([[-0.72, sv - 0.32], [-1.75, sv - 0.12], [-sw, sv + 0.55], [-sw + 0.12, sv + 2.25], [-ww, sv + 4.0], [-hw, topV], [0.1, topV + 0.24],
      [hw * FAR, topV], [ww * FAR, sv + 4.0], [(sw - 0.12) * FAR, sv + 2.25], [sw * FAR, sv + 0.55], [1.5, sv - 0.12], [0.62, sv - 0.32], [0.05, sv + neckDip]], 3);
  };
  const shadeRight = (pts, cut, col) => {                 // the screen-right part of a shape, a shade darker
    const S = PP(pts), cx = P(cut, 0)[0], run = [];
    let start = S.findIndex((p, j) => p[0] <= cx && S[(j + 1) % S.length][0] > cx);
    if (start < 0) return;
    for (let j = 1; j <= S.length; j++) { const p = S[(start + j) % S.length]; if (p[0] < cx) break; run.push(p); }
    if (run.length < 2) return;
    fillX([[cx, run[0][1]]].concat(run, [[cx, run[run.length - 1][1]]]), shade(col, 0.11));
  };
  const drawPelvis = () => {
    if (o.dress) return;
    // seen from behind on a seat, the legs are hidden: the seat of the trousers comes down to rest on it
    const low = back && sit && !o.pedal ? 2.6 : 0;
    shape([[-hw + 0.06, sv + 4.4], [hw * FAR - 0.04, sv + 4.4], [hw * FAR + 0.02 + low * 0.04, hipV + 0.35 + low], [0.3, hipV + 1.15 + low * 0.7], [-hw - 0.02 - low * 0.04, hipV + 0.55 + low]], bot, LF);
  };
  const drawTorso = () => {
    const hem = o.dress ? sv + 4.25 : sv + 5.62, tp = torsoPts(hem);
    shape(tp, top);
    shadeRight(tp, sg > 0 ? 0.75 : -0.35, top);
    if (!back) {
      if (o.jacket) {
        const cl = 0.42;
        shape([[cl - 0.62, sv - 0.25], [cl + 0.55, sv - 0.25], [cl + 0.05, sv + 3.9]], o.jacket, LF);
        if (o.tie) shape([[cl - 0.1, sv + 0.1], [cl + 0.18, sv + 0.1], [cl + 0.22, sv + 2.9], [cl + 0.03, sv + 3.25], [cl - 0.16, sv + 2.9]], o.tie, 0);
        shape([[cl - 0.62, sv - 0.25], [cl - 0.05, sv + 3.5], [cl - 1.3, sv + 1.35], [cl - 1.05, sv + 0.4]], shade(top, -0.08), LF);
        shape([[cl + 0.55, sv - 0.25], [cl + 0.05, sv + 3.5], [cl + 0.95, sv + 1.3], [cl + 0.8, sv + 0.35]], shade(top, 0.06), LF);
        for (const vv of [4.25, 5.0]) g.disc2(P(cl + 0.22, sv + vv), 0.2 * k, shade(top, 0.35));
      } else {
        // a round neckline and a seam where the sleeve meets the body
        fillX(PP(smooth([[-0.62, sv - 0.2], [0.05, sv + 0.55], [0.58, sv - 0.2], [0.05, sv + 0.85]], 2)), shade(top, 0.2));
      }
      if (!o.dress) g.line2(PP([[-ww + 0.4, sv + 4.4], [-0.6, sv + 4.85]]), { w: LF * 0.8, c: shade(top, 0.38), boil: false, wob: 0.3 });
    } else g.line2(PP([[0.1, sv + 0.4], [0.15, sv + 4.6]]), { w: LF * 0.8, c: shade(top, 0.3), boil: false, wob: 0.3 });
  };
  const drawDress = () => {
    if (!o.dress || sit) return;
    const hemV = -1.0 - lift, sway = pose === 'walk' ? Math.sin(s2) * 0.35 : 0;
    const pts = smooth([[-ww - 0.05, sv + 3.95], [ww * FAR + 0.05, sv + 3.95], [2.2 + sway, hemV - 2.0], [2.95 + sway, hemV - 0.1], [0.35, hemV + 0.42], [-2.95 + sway, hemV + 0.05], [-2.35 + sway, hemV - 2.0]], 3);
    shape(pts, o.dress);
    shadeRight(pts, sg > 0 ? 0.9 : -0.5, o.dress);
    for (const [a, c] of [[[-0.6, sv + 5], [-1.2 + sway, hemV - 0.1]], [[0.8, sv + 5.2], [1.25 + sway, hemV + 0.1]]]) g.line2(PP([a, c]), { w: LF * 0.8, c: shade(o.dress, 0.3), boil: false, wob: 0.5 });
  };
  if (o.dress && sit) {   // a skirt over the lap
    // (the thighs are drawn in the dress colour by drawLeg)
  }

  /* ----- paint, back to front ----- */
  drawHairBehind();
  const legs = !o.noLegs && !(back && sit && !o.pedal);   // a sitter seen from behind hides their legs; noLegs: in a boat
  if (back && legs) { drawShoe(1); drawShoe(0); }
  drawArm(1);
  if (legs) { drawLeg(1); if (!back) drawShoe(1); drawLeg(0); if (!back) drawShoe(0); }
  drawPelvis();
  if (o.dress && !sit) drawDress();
  drawTorso();
  drawArm(0);
  drawHead();
  // where things attach (wide px): a hat on the crown, a bouquet or a phone in the hands
  return { crown: P(HC[0], HC[1] - RY), head: P(HC[0], HC[1]), headR: RX * k, hands: wrists.map((w) => P(w[0], w[1])), hip: P(0, hipV), shoulders: shJ.map((q) => P(q[0], q[1])) };
};
function arcPts(cx, cy, r, a0, a1, n) { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; }
/* a walker on a closed route through tile-local points (straight legs between them), at `speed` u/s. Facing comes from
   each leg, the walk cycle advances one step pair per 2.4 u, so the feet do not slide. o: phase (0..1 along the route),
   pose overrides, z (a constant height or a function (x, y) => z for slopes), sample, cast. Returns the actor. */
K.walker = function (T, who, pts, speed, o) {
  o = o || {}; const seg = [], L = [0];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const total = L[L.length - 1], per = total / speed;
  return T.actor({ sample: o.sample || 0.25, period: per, cast: o.cast,
    at(t) {
      let d = (((t * speed + (o.phase || 0) * total) % total) + total) % total, i = 0;
      while (i < seg.length - 1 && d > L[i + 1]) i++;
      const [a, b] = seg[i], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1];
      const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor((d / 2.4) % 1 * 8);
      const x = a[0] + dx * u, y = a[1] + dy * u, z = typeof o.z === 'function' ? o.z(x, y) : (o.z || 0);
      return { x, y, z, key: dir + '.' + ph, dir, ph: ph / 8 };
    },
    draw(g, st) { K.person(g, 0, 0, 0, Object.assign({}, who, o.who || {}, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
};
/* a varied citizen from a seed */
K.who = function (seed, o) {
  const R = RNG(seed * 9176 + 11); const sk = R.pick(SKIN), hr = R.pick(HAIR);
  const w = { skin: sk, hair: hr, top: R.pick(CLOTH), bot: R.pick(['#3F4D63', '#4A5A78', '#6B7B8C', '#5A4A3C', '#39414B', '#7A6A55', '#3C5C8A', '#8A9AAA']),
    hairStyle: R.pick(['short', 'short', 'buzz', 'long', 'pony', 'bun', 'bob', 'curly']), k: 0.95 + R() * 0.12, shorts: R() < 0.15 };
  w.build = R(); w.bare = R() < 0.4; w.shoe = R.pick(['#F3F1EA', '#F3F1EA', '#3A3530', '#7A5A3C', '#C9584B', '#5F8FC9']);
  if ((w.hairStyle === 'short' || w.hairStyle === 'buzz') && R() < 0.3) w.beard = true;
  if (R() < 0.14) w.glasses = true;
  if (R() < 0.12) w.cap = R.pick(['#C9584B', '#3F5F8F', '#E6C24F', '#3B3F47']);
  return Object.assign(w, o || {});
};

/* ---------- vehicles ---------- */
/* a box turned to any heading. ang: radians in the ground plane, 0 = +x, PI/2 = +y. hl/hw: half length/width.
   Returns the box so windows, wheels and lights can be put on whichever faces are visible. */
K.rbox = function (g, cx, cy, hl, hw, ang, z0, z1, col, o) {
  o = o || {}; const ca = Math.cos(ang), sa = Math.sin(ang), c = K.tones(col);
  const B = { cx, cy, hl, hw, ca, sa, z0, z1 };
  B.pt = (u, v, z) => [cx + u * ca - v * sa, cy + u * sa + v * ca, z];
  const N = { pu: [ca, sa], nu: [-ca, -sa], pv: [-sa, ca], nv: [sa, -ca] };
  B.vis = {}; B.tone = {};
  for (const f in N) { const n = N[f]; B.vis[f] = n[0] + n[1] > 0.02; B.tone[f] = mix(c.l, c.r, clamp(0.5 + 0.5 * (n[0] - n[1]), 0, 1)); }
  /* a quad on a face; a0..a1 in [-1,1] along the face */
  B.quad = (f, a0, a1, za, zb) => {
    if (f === 'pu') return [B.pt(hl, hw * a0, za), B.pt(hl, hw * a1, za), B.pt(hl, hw * a1, zb), B.pt(hl, hw * a0, zb)];
    if (f === 'nu') return [B.pt(-hl, hw * a0, za), B.pt(-hl, hw * a1, za), B.pt(-hl, hw * a1, zb), B.pt(-hl, hw * a0, zb)];
    if (f === 'pv') return [B.pt(hl * a0, hw, za), B.pt(hl * a1, hw, za), B.pt(hl * a1, hw, zb), B.pt(hl * a0, hw, zb)];
    return [B.pt(hl * a0, -hw, za), B.pt(hl * a1, -hw, za), B.pt(hl * a1, -hw, zb), B.pt(hl * a0, -hw, zb)];
  };
  const lo = { w: o.w == null ? 0.85 : o.w, c: o.c, boil: false };
  for (const f of ['pu', 'nu', 'pv', 'nv']) if (!B.vis[f] && o.line !== false) g.outline(B.quad(f, -1, 1, z0, z1), { w: 0.5, c: o.c, co: true });
  for (const f of ['pu', 'nu', 'pv', 'nv']) if (B.vis[f]) { const q = B.quad(f, -1, 1, z0, z1); g.fill(q, B.tone[f]); if (o.line !== false) g.outline(q, Object.assign({}, lo, { skip: o.nb ? (k) => k === 0 : null })); }
  const top = [B.pt(-hl, -hw, z1), B.pt(hl, -hw, z1), B.pt(hl, hw, z1), B.pt(-hl, hw, z1)];
  if (!o.nt) { g.fill(top, o.top || c.t); if (o.line !== false) g.outline(top, lo); }
  return B;
};
K.rwin = function (g, B, f, a0, a1, z0, z1, o) {
  if (!B.vis[f]) return;
  o = o || {}; const q = B.quad(f, a0, a1, z0, z1), P = g.P(q);
  g.fill2(P, o.col || C.glass);
  const a = P[0], b = P[2], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, d = Math.min(2, Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.2);
  if (o.glint !== false) g.segs2([mx - d * 0.2, my + d * 0.7, mx + d * 0.5, my - d * 0.7], C.white, 0.6);
  g.outline2(P, { w: 0.45, boil: false, ext: 0.3 });
};
/* wheels in the plane of the body's sides (true ellipses), tyre and hub. which: 'far' = the hidden side (draw before the body),
   'near' = the side we see (draw after it, each in a dark wheel arch cut into the body). r, zc in world units. */
K.wheels = function (g, B, us, r, which, o) {
  o = o || {}; const zc = o.zc == null ? r : o.zc, arch = o.arch;
  for (const f of ['pv', 'nv']) {
    if ((which === 'near') !== !!B.vis[f]) continue;
    const v = (f === 'pv' ? 1 : -1) * (B.hw + 0.06);
    for (const u of us) {
      const ring = (rr, dz) => { const pts = []; for (let i = 0; i < 16; i++) { const t = TAU * i / 16; pts.push(B.pt(u + Math.cos(t) * rr, v, zc + dz + Math.sin(t) * rr)); } return pts; };
      if (which === 'near' && arch) { const a = []; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; a.push(B.pt(u + Math.cos(t) * r * 1.18, v - Math.sign(v) * 0.04, zc + Math.sin(t) * r * 1.18)); } g.fill(a, arch); }
      const t = ring(r, 0); g.fill(t, '#3A3632'); g.fill(ring(r * 0.48, 0), '#B9B4A8'); g.fill(ring(r * 0.2, 0), '#7A746A');
      if (which === 'near') g.outline(t, { w: 0.45, c: '#2A2622', boil: false });
    }
  }
};
K.shadow = function (g, B, e) { e = e || 0.4; g.fill([B.pt(-B.hl - e, -B.hw - e, 0), B.pt(B.hl + e, -B.hw - e, 0), B.pt(B.hl + e, B.hw + e, 0), B.pt(-B.hl - e, B.hw + e, 0)], 'rgba(96,84,66,0.17)'); };
K.lights = function (g, B, z) {
  for (const [f, col] of [['pu', '#F6E7A8'], ['nu', '#D0483A']]) if (B.vis[f]) { g.fill(B.quad(f, 0.45, 0.85, z, z + 0.75), col); g.fill(B.quad(f, -0.85, -0.45, z, z + 0.75), col); }
};
/* a car heading ang */
K.car = function (g, ang, o) {
  o = o || {}; const col = o.col || '#7FA7CF', L = o.L || 5.3, Wd = o.W || 2.55;
  const tone = { t: shade(col, -0.2), l: col, r: shade(col, 0.15) };
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  const wu = [-L * 0.6, L * 0.6];
  K.wheels(g, sh, wu, 0.95, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.8, 2.9, tone, {});
  // bumpers, a crease along the side, a door seam with its handle
  for (const f of ['pu', 'nu']) if (B.vis[f]) g.fill(B.quad(f, -1, 1, 0.8, 1.25), shade(col, 0.3));
  for (const f of ['pv', 'nv']) if (B.vis[f]) {
    const crease = B.quad(f, -1, 1, 2.05, 2.05); g.line([crease[0], crease[1]], { w: 0.3, c: shade(col, 0.32), boil: false, ext: 0 });
    const seam = B.quad(f, -0.08, -0.08, 0.95, 2.85); g.line([seam[0], seam[3]], { w: 0.3, c: shade(col, 0.32), boil: false, ext: 0 });
    const h = B.quad(f, 0.06, 0.2, 2.3, 2.3); g.line([h[0], h[1]], { w: 0.42, c: shade(col, 0.45), boil: false, ext: 0 });
  }
  K.wheels(g, sh, wu, 0.95, 'near', { arch: shade(col, 0.55) });
  K.lights(g, B, 1.7);
  const ca = Math.cos(ang), sa = Math.sin(ang), off = -L * 0.1;
  const cab = K.rbox(g, off * ca, off * sa, L * 0.5, Wd - 0.35, ang, 2.9, 4.8, tone, { nb: true, w: 0.8 });
  K.rwin(g, cab, 'pv', -0.82, -0.06, 3.1, 4.5); K.rwin(g, cab, 'pv', 0.06, 0.82, 3.1, 4.5);
  K.rwin(g, cab, 'nv', -0.82, -0.06, 3.1, 4.5); K.rwin(g, cab, 'nv', 0.06, 0.82, 3.1, 4.5);
  K.rwin(g, cab, 'pu', -0.8, 0.8, 3.1, 4.5); K.rwin(g, cab, 'nu', -0.8, 0.8, 3.1, 4.5);
  if (o.roof) o.roof(g, cab);
};
/* bus / van: white body with a coloured band */
K.bus = function (g, ang, o) {
  o = o || {}; const col = o.col || '#F1EFE8', band = o.band || '#5E8FC9', L = o.L || 6.8, Wd = o.W || 2.7, zt = o.h || 6.0;
  const tone = { t: shade(col, -0.12), l: col, r: shade(col, 0.1) };
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  const wu = [-L * 0.62, L * 0.62];
  K.wheels(g, sh, wu, 1.1, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 1, zt, tone, { w: 0.9 });
  for (const f of ['pu', 'nu', 'pv', 'nv']) if (B.vis[f]) { g.fill(B.quad(f, -1, 1, 1, 3.1), mix(band, shade(band, 0.14), f === 'pv' || f === 'nu' ? 0 : 1)); g.line([B.quad(f, -1, 1, 3.1, 3.1)[0], B.quad(f, -1, 1, 3.1, 3.1)[1]], { w: 0.55, boil: false }); g.line([B.quad(f, -1, 1, 1, 1)[0], B.quad(f, -1, 1, 1, 1)[1]], { w: 0.85, boil: false }); }
  const n = o.n || 5;
  for (const f of ['pv', 'nv']) for (let i = 0; i < n; i++) K.rwin(g, B, f, -0.92 + 1.84 * i / n + 0.03, -0.92 + 1.84 * (i + 1) / n - 0.03, 3.7, zt - 0.9);
  K.rwin(g, B, 'pu', -0.82, 0.82, 3.6, zt - 0.9); K.rwin(g, B, 'nu', -0.82, 0.82, 3.6, zt - 0.9);
  K.wheels(g, sh, wu, 1.1, 'near', { arch: '#3F3A34' });
  K.lights(g, B, 1.6);
  K.rbox(g, 0, 0, L * 0.45, Wd * 0.5, ang, zt, zt + 0.7, { t: shade(col, -0.05), l: shade(col, 0.08), r: shade(col, 0.16) }, { w: 0.6, nb: true });
};
/* cable car / vintage tram: body, posts, a flat roof with a clerestory, riders at the open ends */
K.cablecar = function (g, ang, o) {
  o = o || {}; const L = o.L || 7.8, Wd = o.W || 2.8, red = o.col || '#B94A3E', roof = o.roof || '#E9D9A0';
  const tone = { t: shade(red, -0.1), l: red, r: shade(red, 0.15) };
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, red, { line: false, nt: true }); K.shadow(g, sh);
  const wu = [-L * 0.6, L * 0.6];
  K.wheels(g, sh, wu, 0.75, 'far', { zc: 0.75 });
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.7, 3.1, tone, { w: 0.9 });
  for (const f of ['pu', 'nu', 'pv', 'nv']) if (B.vis[f]) g.fill(B.quad(f, -1, 1, 0.7, 1.3), '#7E332B');
  K.wheels(g, sh, wu, 0.75, 'near', { zc: 0.75 });
  const cab = K.rbox(g, 0, 0, L * 0.44, Wd - 0.2, ang, 3.1, 6.3, tone, { w: 0.75, nb: true });
  for (const f of ['pv', 'nv']) for (let i = 0; i < 3; i++) K.rwin(g, cab, f, -0.9 + 1.8 * i / 3 + 0.05, -0.9 + 1.8 * (i + 1) / 3 - 0.05, 3.6, 5.8);
  K.rwin(g, cab, 'pu', -0.7, 0.7, 3.6, 5.8); K.rwin(g, cab, 'nu', -0.7, 0.7, 3.6, 5.8);
  if (o.riders) o.riders(g, B);
  const posts = [];
  for (const u of [-L + 0.4, L - 0.4]) for (const v of [-Wd, Wd]) { const a = g.p.apply(g, B.pt(u, v, 3.1)), b = g.p.apply(g, B.pt(u, v, 6.5)); posts.push(a[0], a[1], b[0], b[1]); }
  g.segs2(posts, '#5A2A24', 0.9);
  K.rbox(g, 0, 0, L + 0.5, Wd + 0.4, ang, 6.5, 7.3, { t: shade(roof, -0.12), l: roof, r: shade(roof, 0.15) }, { w: 0.9 });
  K.rbox(g, 0, 0, L * 0.7, Wd * 0.45, ang, 7.3, 7.9, { t: shade(roof, -0.2), l: shade(roof, 0.05), r: shade(roof, 0.17) }, { w: 0.6, nb: true });
};
/* cyclist. K.bike(g, ang, o) with any heading (0 = +x); the old form K.bike(g, {rev}) still works */
K.bike = function (g, ang, o) {
  if (typeof ang === 'object' || ang == null) { o = ang || {}; ang = o.rev ? Math.PI : 0; }
  o = o || {}; const ca = Math.cos(ang), sa = Math.sin(ang), col = o.col || '#C9584B';
  const pt = (u, z) => g.p(u * ca, u * sa, z);
  // wheels: a dark tyre, a pale rim, four spokes and a hub
  const wheel = (u) => {
    const tyre = [], rim = [], sp = [], h = pt(u, 1.45);
    for (let i = 0; i < 24; i++) { const t = TAU * i / 24; tyre.push(pt(u + Math.cos(t) * 1.45, 1.45 + Math.sin(t) * 1.45)); rim.push(pt(u + Math.cos(t) * 1.15, 1.45 + Math.sin(t) * 1.15)); }
    for (let i = 0; i < 4; i++) { const t = TAU * i / 4 + 0.4, e = pt(u + Math.cos(t) * 1.15, 1.45 + Math.sin(t) * 1.15); sp.push(h[0], h[1], e[0], e[1]); }
    g.line2(tyre, { c: '#3A3632', w: 0.85, close: true, boil: false, wob: 0.2 }); g.line2(rim, { c: '#9A9384', w: 0.32, close: true, boil: false, wob: 0.2 });
    g.segs2(sp, '#9A9384', 0.22); g.disc2(h, 0.32, '#3A3632');
  };
  wheel(-2.3); wheel(2.3);
  const A = pt(-2.3, 1.45), B = pt(2.3, 1.45), seat = pt(-0.8, 3.7), bar = pt(1.7, 4.0), bb = pt(0, 1.5);
  g.segs2([A[0], A[1], seat[0], seat[1], seat[0], seat[1], bb[0], bb[1], bb[0], bb[1], bar[0], bar[1], bar[0], bar[1], B[0], B[1], A[0], A[1], bb[0], bb[1], seat[0], seat[1], bar[0], bar[1]], col, 0.65);
  const s0 = pt(-1.15, 3.8), s1 = pt(-0.45, 3.75), hb = (v) => g.p(1.7 * ca - sa * v, 1.7 * sa + ca * v, 4.05);
  g.line2([s0, s1], { c: '#3A3632', w: 0.9, boil: false, ext: 0 }); g.line2([hb(-0.75), hb(0.75)], { c: '#3A3632', w: 0.55, boil: false, ext: 0 });
  // rider: facing follows the heading
  const d = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2);
  const kk = 0.86, F = pt(-0.6, 2.75), rel = (q) => [(q[0] - F[0]) / kk, (q[1] - F[1]) / kk], pa = pt(0.55, 1.15), pb = pt(-0.45, 2.0);
  K.person(g, -0.6 * ca, -0.6 * sa, 2.75, Object.assign({}, o.who || K.who(o.seed || 5), { dir: d, pose: 'sit', k: kk, reach: rel(bar), pedal: [rel(pa), rel(pb)] }));
};

/* ---------- street furniture ---------- */
/* lamp post with a cluster of pale globes (n = 1, 3 or 4) */
K.lamp = function (g, x, y, o) {
  o = o || {}; const z0 = o.z || 0, h = o.h || 9, f = g.p(x, y, z0), t = g.p(x, y, z0 + h), n = o.n || 1, col = o.col || '#2E2A26';
  g.fill2([[f[0] - 1.1, f[1]], [f[0] + 1.1, f[1]], [f[0] + 0.9, f[1] - 2.2], [f[0] - 0.9, f[1] - 2.2]], col);
  g.fill2([[f[0] - 0.55, f[1] - 2], [f[0] + 0.55, f[1] - 2], [t[0] + 0.5, t[1]], [t[0] - 0.5, t[1]]], col);
  const globe = (dx, dy, r) => { g.disc2([t[0] + dx, t[1] + dy], r, '#F2E3A6'); g.fill2(arcPts(t[0] + dx + r * 0.2, t[1] + dy + r * 0.2, r * 0.8, -0.6, 1.9, 6), '#E3CE85'); g.ring2([t[0] + dx, t[1] + dy], r, { c: '#7A6A3A', w: 0.45 }); };
  if (n === 1) globe(0, -1.6, 2.1);
  else { if (n >= 4) globe(0, -4.3, 1.9); globe(-2.5, -1.2, 1.9); globe(2.5, -1.2, 1.9); globe(0, -0.6, 2.0); }
};
/* bench facing lower-right (face 'R') or lower-left ('L'); length along the other axis */
K.bench = function (g, x, y, o) {
  o = o || {}; const L = o.L || 3.2, col = o.col || C.wood;
  const draw = (g2) => {
    K.box(g2, -0.2, -L, 0.2, L, 0, 3.3, { t: shade(col, -0.1), l: col, r: shade(col, 0.15) }, { w: 0.6, boil: false });       // back
    K.box(g2, 0.2, -L, 1.8, L, 1.3, 1.7, { t: shade(col, -0.15), l: col, r: shade(col, 0.2) }, { w: 0.6, boil: false });        // seat
    const legs = []; for (const ly of [-L + 0.3, L - 0.3]) { const a = g2.p(1.7, ly, 1.3), b = g2.p(1.7, ly, 0); legs.push(a[0], a[1], b[0], b[1]); }
    g2.segs2(legs, '#4A3A2C', 0.7);
  };
  g.at(x, y, o.z || 0, draw, o.face === 'L');
};
/* a flagpole; the flag itself is an actor (K.flagActor) so its free edge can move */
K.pole = function (g, x, y, h, o) {
  o = o || {}; const f = g.p(x, y, 0), t = g.p(x, y, h);
  K.cyl(g, x, y, 0.75, 0, 1.3, { t: '#EDEAE2', l: '#F1EFE8', r: '#D9D5CA' }, { w: 0.7, n: 8 });
  g.fill2([[f[0] - 0.55, f[1] - 4], [f[0] + 0.55, f[1] - 4], [t[0] + 0.4, t[1]], [t[0] - 0.4, t[1]]], o.col || '#E9E6DD');
  g.line2([[f[0] - 0.55, f[1] - 4], [t[0] - 0.4, t[1]]], { w: 0.75, boil: false }); g.line2([[f[0] + 0.55, f[1] - 4], [t[0] + 0.4, t[1]]], { w: 0.75, boil: false });
  g.disc2([t[0], t[1] - 0.8], 1.2, C.gold); g.ring2([t[0], t[1] - 0.8], 1.2, { c: '#7A6A3A', w: 0.45 });
};
/* market stall / cart with a striped awning. faces lower-left when face 'L' */
K.stall = function (g, x, y, o) {
  o = o || {}; const L = o.L || 3.4, D = o.D || 1.8, a = o.a || '#C9584B', b = o.b || '#F3F1EA';
  const draw = (g2) => {
    K.box(g2, -D, -L, D, L, 0, 2.7, { t: '#D9B57E', l: '#C9A26B', r: '#B58F58' }, { w: 0.7, boil: false });
    const posts = []; for (const [px, py] of [[-D, L], [D, L], [D, -L], [-D, -L]]) { const p0 = g2.p(px, py, 2.7), p1 = g2.p(px, py, 6.6); posts.push(p0[0], p0[1], p1[0], p1[1]); }
    g2.segs2(posts, '#5A4A3C', 0.6);
    if (o.goods) o.goods(g2, D, L);
    const n = o.n || 6, e = 0.7;
    for (let i = 0; i < n; i++) {
      const y0 = -L - e + (2 * L + 2 * e) * i / n, y1 = -L - e + (2 * L + 2 * e) * (i + 1) / n;
      g2.fill([[-D - e, y0, 7.5], [-D - e, y1, 7.5], [D + e + 0.6, y1, 6.3], [D + e + 0.6, y0, 6.3]], i % 2 ? b : a);
    }
    g2.outline([[-D - e, -L - e, 7.5], [-D - e, L + e, 7.5], [D + e + 0.6, L + e, 6.3], [D + e + 0.6, -L - e, 6.3]], { w: 0.75, boil: false });
    g2.fill([[D + e + 0.6, -L - e, 6.3], [D + e + 0.6, L + e, 6.3], [D + e + 0.6, L + e, 5.6], [D + e + 0.6, -L - e, 5.6]], shade(a, 0.1));
    g2.line([[D + e + 0.6, -L - e, 5.6], [D + e + 0.6, L + e, 5.6]], { w: 0.6, boil: false });
  };
  g.at(x, y, o.z || 0, draw, o.face === 'L');
};

/* ---------- ground helpers ---------- */
K.rect = function (x0, y0, x1, y1, z) { z = z || 0; return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]; };
/* a flat lawn with blades */
K.lawn = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const p = K.rect(x0, y0, x1, y1, o.z || 0);
  g.fill(p, o.col || C.grass);
  g.grass(p, { dens: o.dens == null ? 1 : o.dens });
  if (o.edge !== false) g.outline(p, { w: 0.55, c: '#7F9A5E', boil: false });
};
/* the ground a neighbourhood stands on: its top at z 0, the same level as the streets and the water round it, and a rim.
   It has no sides: a lip hanging below z 0 would be under the road, and drawing it makes the place a raised plinth
   with cars driving at its top's height. o.lip > 0 only for ground that truly stands above everything round it (a
   plinth on open paper, never next to a street or a quay); it then rises from z 0 to z lip.
   o.cut: the sides that are the outer edge of the whole map ('y' = the +y side, lower left; 'x' = the +x side, lower
   right; 'xy' both). There the ground is cut like a diorama base and its section shows from z 0 down to -1.1, the
   same as the streets' cut edge beside it. Never on a side that meets a street or another place. */
K.slab = function (g, half, o) {
  o = o || {}; const h = half, lip = o.lip || 0, top = o.top || C.pave, cut = o.cut || '', D = 1.1;
  if (cut.indexOf('y') >= 0) { g.fill([[-h, h, -D], [h, h, -D], [h, h, 0], [-h, h, 0]], C.slab); g.line([[-h, h, 0], [-h, h, -D], [h, h, -D], [h, h, 0]], { w: 0.9 }); }
  if (cut.indexOf('x') >= 0) { g.fill([[h, h, -D], [h, -h, -D], [h, -h, 0], [h, h, 0]], C.slabD); g.line([[h, h, 0], [h, h, -D], [h, -h, -D], [h, -h, 0]], { w: 0.9 }); }
  if (lip > 0) {
    g.fill([[-h, h, 0], [h, h, 0], [h, h, lip], [-h, h, lip]], C.slab);
    g.fill([[h, h, 0], [h, -h, 0], [h, -h, lip], [h, h, lip]], C.slabD);
    g.line([[-h, h, lip], [-h, h, 0], [h, h, 0], [h, -h, 0], [h, -h, lip]], { w: 0.9 });
    g.line([[h, h, lip], [h, h, 0]], { w: 0.7 });
  }
  g.fill(K.rect(-h, -h, h, h, lip), top);
  g.outline(K.rect(-h, -h, h, h, lip), { w: 0.9 });
};

/* ---------- curves and organic shapes ---------- */
/* Catmull-Rom through 2-D or 3-D points; n samples per span */
K.curve = function (pts, n, closed) {
  n = n || 6; const out = [], m = pts.length, dim = pts[0].length;
  const get = (i) => closed ? pts[((i % m) + m) % m] : pts[clamp(i, 0, m - 1)];
  const last = closed ? m : m - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t, q = [];
      for (let d = 0; d < dim; d++) q.push(0.5 * ((2 * p1[d]) + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3));
      out.push(q);
    }
  }
  if (!closed) out.push(pts[m - 1].slice());
  return out;
};
/* screen px of a shot's 1920x1080 frame -> wide px (for drawing a thing where it sits in a framed shot) */
K.shotPx = function (name) {
  const c = SCENE.shots.find((q) => q.name === name) || SCENE.wide, s = [c.z, c.cx, c.cy];
  return (x, y) => [(x - 960) / s[0] + s[1], (y - 540) / s[0] + s[2]];
};
/* a paint blob with a brushed, unlined edge (grass islands, fog, foam). pts: wide px outline */
K.blob2 = function (g, pts, col, o) {
  o = o || {}; const c = K.curve(pts, o.n || 5, true), seed = o.seed || 1, rag = o.rag == null ? 0.7 : o.rag, out = [];
  let cx = 0, cy = 0; for (const p of c) { cx += p[0]; cy += p[1]; } cx /= c.length; cy /= c.length;
  for (let i = 0; i < c.length; i++) { const p = c[i], d = Math.hypot(p[0] - cx, p[1] - cy) || 1, k = rag * (vnoise(i * 0.9, seed) + 0.5 * vnoise(i * 2.7, seed + 3)); out.push([p[0] + (p[0] - cx) / d * k, p[1] + (p[1] - cy) / d * k]); }
  g.fill2(out, col);
  return out;
};
/* cloud / fog bank drawn around the origin: opaque cream with dry-brushed, broken edges */
K.fog = function (g, w, h, seed) {
  const o = g.p(0, 0, 0), R = RNG(seed || 3), col = '#F6F4EE';
  for (let i = 0; i < 5; i++) {
    const cx = o[0] + (R() - 0.5) * w * 0.7, cy = o[1] + (R() - 0.5) * h * 0.5, rx = w * (0.22 + R() * 0.2), ry = h * (0.3 + R() * 0.25), pts = [];
    for (let k = 0; k < 9; k++) { const a = TAU * k / 9; pts.push([cx + Math.cos(a) * rx * (0.85 + R() * 0.3), cy + Math.sin(a) * ry * (0.8 + R() * 0.4)]); }
    K.blob2(g, pts, col, { seed: i + (seed || 3) * 7, rag: 0.9 });
  }
  const segs = [];
  for (let i = 0; i < 26; i++) { const x = o[0] + (R() - 0.5) * w * 1.15, y = o[1] + (R() - 0.5) * h * 0.95, l = 2 + R() * 5; segs.push(x, y, x + l, y - l * 0.08); }
  g.segs2(segs, col, 1.1);
  const sh = [];
  for (let i = 0; i < 7; i++) { const x = o[0] + (R() - 0.5) * w * 0.7, y = o[1] + h * (0.12 + R() * 0.25), l = 2 + R() * 4; sh.push(x, y, x + l, y); }
  g.segs2(sh, '#E3E1D9', 0.7);
};
/* a small boat around the origin, bow towards ang. kind: 'steamer' | 'sail' | 'row' | 'ferry' | 'motor' */
K.boat = function (g, ang, o) {
  o = o || {}; const kind = o.kind || 'motor', L = o.L || (kind === 'ferry' ? 9 : 5.2), Wd = o.W || (kind === 'ferry' ? 3 : 2), hull = o.hull || '#F3F1EA', ca = Math.cos(ang), sa = Math.sin(ang);
  const pt = (u, v, z) => [u * ca - v * sa, u * sa + v * ca, z];
  // waterline shape with a pointed bow
  const deck = [pt(-L, -Wd, 1.3), pt(L * 0.55, -Wd, 1.3), pt(L * 1.15, 0, 1.5), pt(L * 0.55, Wd, 1.3), pt(-L, Wd, 1.3)];
  const wl = [pt(-L * 0.92, -Wd * 0.85, 0), pt(L * 0.5, -Wd * 0.85, 0), pt(L * 1.0, 0, 0), pt(L * 0.5, Wd * 0.85, 0), pt(-L * 0.92, Wd * 0.85, 0)];
  // foam ring on the water
  g.fill(wl.map((p) => [p[0] * 1.12, p[1] * 1.12, 0]), '#DCEAF3');
  // side planks: draw every hull side, far ones first
  const sides = []; for (let i = 0; i < 5; i++) { const j = (i + 1) % 5; sides.push({ q: [wl[i], wl[j], deck[j], deck[i]], d: (wl[i][0] + wl[j][0] + wl[i][1] + wl[j][1]) }); }
  sides.sort((a, b) => a.d - b.d);
  for (const s of sides) { const nx = (s.q[0][0] + s.q[1][0]) / 2, ny = (s.q[0][1] + s.q[1][1]) / 2; g.fill(s.q, mix(hull, shade(hull, 0.16), clamp(0.5 + 0.2 * (nx - ny), 0, 1))); }
  if (o.stripe) for (const s of sides.slice(2)) g.fill([s.q[0], s.q[1], [lerp(s.q[1][0], s.q[2][0], 0.4), lerp(s.q[1][1], s.q[2][1], 0.4), 0.5], [lerp(s.q[0][0], s.q[3][0], 0.4), lerp(s.q[0][1], s.q[3][1], 0.4), 0.5]], o.stripe);
  g.fill(deck, o.deck || shade(hull, -0.3));
  for (const s of sides.slice(2)) g.outline(s.q, { w: 0.7, boil: false });
  g.outline(deck, { w: 0.75, boil: false });
  if (kind === 'steamer' || kind === 'ferry' || kind === 'motor') {
    const cl = kind === 'ferry' ? 0.62 : 0.5, B = K.rbox(g, -L * 0.12 * ca, -L * 0.12 * sa, L * cl, Wd * 0.68, ang, 1.3, kind === 'motor' ? 2.6 : 3.4, { t: '#F6F4EE', l: '#F3F1EA', r: '#DAD6CC' }, { w: 0.7, nb: true });
    const n = kind === 'ferry' ? 5 : 3;
    for (const f of ['pv', 'nv']) for (let i = 0; i < n; i++) if (B.vis[f]) { const q = B.quad(f, -0.85 + 1.7 * i / n + 0.06, -0.85 + 1.7 * (i + 1) / n - 0.06, 1.9, kind === 'motor' ? 2.4 : 2.9); g.fill(q, C.navy); }
    if (kind === 'ferry') { const B2 = K.rbox(g, -L * 0.12 * ca, -L * 0.12 * sa, L * 0.42, Wd * 0.5, ang, 3.4, 4.9, { t: '#F6F4EE', l: '#F3F1EA', r: '#DAD6CC' }, { w: 0.65, nb: true }); for (const f of ['pv', 'nv']) for (let i = 0; i < 4; i++) if (B2.vis[f]) g.fill(B2.quad(f, -0.85 + 1.7 * i / 4 + 0.06, -0.85 + 1.7 * (i + 1) / 4 - 0.06, 3.8, 4.5), C.navy); }
    if (o.stack !== false && kind !== 'motor') K.cyl(g, -L * 0.25 * ca, -L * 0.25 * sa, 0.75, kind === 'ferry' ? 4.9 : 3.4, kind === 'ferry' ? 7 : 5.6, o.stackCol || { t: '#8A3A30', l: '#C9463E', r: '#A8382F' }, { w: 0.65, n: 8 });
    if (kind === 'motor' && o.stack) K.cyl(g, -L * 0.3 * ca, -L * 0.3 * sa, 0.5, 2.6, 4.0, { t: '#8A3A30', l: '#C9463E', r: '#A8382F' }, { w: 0.6, n: 6 });
  } else if (kind === 'sail') {
    const m0 = g.p(0, 0, 1.3), m1 = g.p(0, 0, o.mast || 11);
    const a = g.p.apply(g, pt(-L * 0.85, 0, 2.2)), b = g.p.apply(g, pt(L * 0.95, 0, 2.0));
    g.fill2([m1, [m0[0], m0[1] - 2.5], a], '#F6F4EE'); g.fill2([[m1[0], m1[1] + 2], [m0[0], m0[1] - 2.2], b], '#EAE6DB');
    g.outline2([m1, [m0[0], m0[1] - 2.5], a], { w: 0.65, boil: false }); g.outline2([[m1[0], m1[1] + 2], [m0[0], m0[1] - 2.2], b], { w: 0.65, boil: false });
    g.line2([m0, m1], { w: 0.75, boil: false });
  } else if (kind === 'row') {
    // the rower faces the stern and pulls two oars; the far oar goes behind them, the near one in front
    if (o.rower) {
      const kk = 0.8, zr = 0.6, F = g.p(0, 0, zr), rel = (q) => [(q[0] - F[0]) / kk, (q[1] - F[1]) / kk];
      const bc = Math.cos(ang + Math.PI), bs = Math.sin(ang + Math.PI), d = (bc + bs > 0) ? (bc - bs > 0 ? 0 : 1) : (bc - bs > 0 ? 3 : 2);
      const sw = Math.sin((o.ph || 0) * TAU) * 0.5;
      const oar = (s) => ({ grip: g.p.apply(g, pt(0.15 + sw * 0.3, s * Wd * 0.45, 2.0)), blade: g.p.apply(g, pt(-0.6 - sw, s * Wd * 2.7, 0.08)) });
      const oars = [oar(1), oar(-1)].sort((a, b) => a.grip[1] - b.grip[1]);
      const drawOar = (q) => {
        g.line2([q.grip, q.blade], { w: 0.6, c: '#7A5A3C', boil: false, ext: 0 });
        const dx = q.blade[0] - q.grip[0], dy = q.blade[1] - q.grip[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
        g.fill2([[q.blade[0] - ux * 2.2 - uy * 0.8, q.blade[1] - uy * 2.2 + ux * 0.8], [q.blade[0] - uy * 0.9, q.blade[1] + ux * 0.9], [q.blade[0] + uy * 0.9, q.blade[1] - ux * 0.9], [q.blade[0] - ux * 2.2 + uy * 0.8, q.blade[1] - uy * 2.2 - ux * 0.8]], '#C9A26B');
      };
      drawOar(oars[0]);
      K.person(g, 0, 0, zr, Object.assign({ pose: 'sit', k: kk }, o.rower, { dir: d, noLegs: true, lean: 0, hands: [rel(oars[0].grip), rel(oars[1].grip)] }));
      drawOar(oars[1]);
    }
  }
};

/* ---------- lettering: a hand-cut stroke font (cap height 6, width 4, z up) ----------
   Real words for every sign written in Latin letters. Random pseudo-letters read as misspellings once you zoom in;
   cities in other scripts draw their own glyphs (Tokyo's TK.glyph2). Lower case is set as capitals; the accents
   cover French, Spanish, Portuguese, Italian, German and Turkish. */
K.FONT = (function () {
  const O = [1, 0, 0, 1, 0, 5, 1, 6, 3, 6, 4, 5, 4, 1, 3, 0, 1, 0];
  const P = [0, 0, 0, 6, 3, 6, 4, 5, 4, 4, 3, 3, 0, 3];
  const F = {
    A: [[0, 0, 2, 6, 4, 0], [0.8, 2.4, 3.2, 2.4]], B: [[0, 0, 0, 6, 3, 6, 4, 5, 4, 4, 3, 3.2, 0, 3.2], [3, 3.2, 4, 2.2, 4, 1, 3, 0, 0, 0]],
    C: [[4, 5.2, 3, 6, 1, 6, 0, 5, 0, 1, 1, 0, 3, 0, 4, 0.8]], D: [[0, 0, 0, 6, 2.5, 6, 4, 4.5, 4, 1.5, 2.5, 0, 0, 0]],
    E: [[4, 6, 0, 6, 0, 0, 4, 0], [0, 3.1, 3, 3.1]], F: [[4, 6, 0, 6, 0, 0], [0, 3.1, 3, 3.1]],
    G: [[4, 5.2, 3, 6, 1, 6, 0, 5, 0, 1, 1, 0, 3, 0, 4, 1, 4, 2.8, 2.4, 2.8]], H: [[0, 0, 0, 6], [4, 0, 4, 6], [0, 3.1, 4, 3.1]],
    I: [[2, 0, 2, 6], [1, 6, 3, 6], [1, 0, 3, 0]], J: [[4, 6, 4, 1, 3, 0, 1, 0, 0, 1]], K: [[0, 0, 0, 6], [4, 6, 0, 2.4], [1.4, 3.6, 4, 0]],
    L: [[0, 6, 0, 0, 4, 0]], M: [[0, 0, 0, 6, 2, 3, 4, 6, 4, 0]], N: [[0, 0, 0, 6, 4, 0, 4, 6]], O: [O], P: [P],
    Q: [O, [2.6, 1.4, 4.2, -0.4]], R: [P, [2, 3, 4, 0]], S: [[4, 5.2, 3, 6, 1, 6, 0, 5, 0, 4, 1, 3.1, 3, 3, 4, 2, 4, 1, 3, 0, 1, 0, 0, 0.8]],
    T: [[0, 6, 4, 6], [2, 6, 2, 0]], U: [[0, 6, 0, 1, 1, 0, 3, 0, 4, 1, 4, 6]], V: [[0, 6, 2, 0, 4, 6]], W: [[0, 6, 1, 0, 2, 4, 3, 0, 4, 6]],
    X: [[0, 0, 4, 6], [0, 6, 4, 0]], Y: [[0, 6, 2, 3, 4, 6], [2, 3, 2, 0]], Z: [[0, 6, 4, 6, 0, 0, 4, 0]],
    0: [O], 1: [[1, 4.8, 2, 6, 2, 0], [1, 0, 3, 0]], 2: [[0, 5, 1, 6, 3, 6, 4, 5, 4, 4, 0, 0, 4, 0]],
    3: [[0, 5.2, 1, 6, 3, 6, 4, 5, 4, 4, 3, 3.1, 1.5, 3.1], [3, 3.1, 4, 2, 4, 1, 3, 0, 1, 0, 0, 0.8]], 4: [[3, 0, 3, 6, 0, 2, 4, 2]],
    5: [[4, 6, 0.4, 6, 0, 3.4, 3, 3.6, 4, 2.5, 4, 1, 3, 0, 0.5, 0, 0, 0.6]], 6: [[3.6, 6, 1.6, 6, 0, 4, 0, 1, 1, 0, 3, 0, 4, 1, 4, 2.4, 3, 3.4, 1, 3.4, 0, 2.4]],
    7: [[0, 6, 4, 6, 1.5, 0]], 8: [[1, 3.2, 0, 4.2, 0, 5, 1, 6, 3, 6, 4, 5, 4, 4.2, 3, 3.2, 1, 3.2, 0, 2.2, 0, 1, 1, 0, 3, 0, 4, 1, 4, 2.2, 3, 3.2]],
    9: [[4, 3.6, 3, 2.6, 1, 2.6, 0, 3.6, 0, 5, 1, 6, 3, 6, 4, 5, 4, 1, 3, 0, 1, 0]],
    '-': [[0.6, 3, 3.4, 3]], '.': [[1.8, 0, 2.2, 0, 2.2, 0.4, 1.8, 0.4, 1.8, 0]], ',': [[2.2, 0.4, 2.2, 0, 1.6, -0.9]],
    ':': [[2, 0, 2, 0.4], [2, 3.6, 2, 4]], "'": [[2, 6, 2, 4.6]], '/': [[0, 0, 4, 6]], '!': [[2, 6, 2, 1.6], [2, 0.4, 2, 0]],
    '&': [[4, 0, 0.6, 4.2, 0.6, 5.2, 1.4, 6, 2.4, 5.2, 2.4, 4.4, 0, 2, 0, 0.8, 1, 0, 2.4, 0, 4, 2]], '·': [[2, 2.8, 2, 3.2]],
  };
  const M = { acute: [[1.6, 6.8, 2.8, 7.9]], grave: [[1.2, 7.9, 2.4, 6.8]], circ: [[1, 6.8, 2, 7.8, 3, 6.8]], uml: [[1.2, 7, 1.2, 7.5], [2.8, 7, 2.8, 7.5]],
    tilde: [[0.8, 7, 1.6, 7.6, 2.4, 7, 3.2, 7.6]], ced: [[2, 0, 2, -0.8, 1.2, -1.3]], dot: [[2, 7, 2, 7.5]], breve: [[1, 7.8, 2, 6.9, 3, 7.8]], ring: [[1.6, 7, 2.4, 7, 2.4, 7.8, 1.6, 7.8, 1.6, 7]] };
  const acc = { 'É': 'E acute', 'È': 'E grave', 'Ê': 'E circ', 'Ë': 'E uml', 'À': 'A grave', 'Á': 'A acute', 'Â': 'A circ', 'Ã': 'A tilde', 'Ä': 'A uml', 'Å': 'A ring',
    'Í': 'I acute', 'Ì': 'I grave', 'Î': 'I circ', 'Ï': 'I uml', 'İ': 'I dot', 'Ó': 'O acute', 'Ò': 'O grave', 'Ô': 'O circ', 'Õ': 'O tilde', 'Ö': 'O uml',
    'Ú': 'U acute', 'Ù': 'U grave', 'Û': 'U circ', 'Ü': 'U uml', 'Ñ': 'N tilde', 'Ç': 'C ced', 'Ş': 'S ced', 'Ğ': 'G breve' };
  for (const ch in acc) { const [b, m] = acc[ch].split(' '); F[ch] = F[b].concat(M[m]); }
  return F;
})();
/* text on any plane: P(a, z) -> world point. The string starts at a0 (or is centred on it with o.center) and runs to
   increasing a; z0 is the baseline, h the cap height in u. o.track: advance per letter in font units (5.5), o.italic,
   o.w: stroke width in wide px. All strokes go out as one batch of segments, so a long sign is cheap. */
K.textP = function (g, P, a0, z0, h, str, col, o) {
  o = o || {}; const u = h / 6, adv = (o.track || 5.5) * u, s = String(str).toUpperCase(), segs = [], it = o.italic || 0;
  let a = o.center ? a0 - (s.length * adv - 1.5 * u) / 2 : a0;
  for (const ch of s) {
    const gl = K.FONT[ch];
    if (gl) for (const pl of gl) for (let i = 0; i + 3 < pl.length; i += 2) {
      const p0 = g.p.apply(g, P(a + (pl[i] + pl[i + 1] * it) * u, z0 + pl[i + 1] * u)), p1 = g.p.apply(g, P(a + (pl[i + 2] + pl[i + 3] * it) * u, z0 + pl[i + 3] * u));
      segs.push(p0[0], p0[1], p1[0], p1[1]);
    }
    a += adv;
  }
  g.segs2(segs, col, o.w || clamp(h * 0.5, 0.22, 1.6));
};
/* the width in u of a string set at cap height h (to fit a sign: h = width / K.textW(str, 1)) */
K.textW = function (str, h, o) { const u = h / 6; return String(str).length * ((o && o.track) || 5.5) * u - 1.5 * u; };
/* text on a building face, in K.on's coordinates: face 'L' (plane y = p, reads along +x), 'R' (plane x = p, reads
   along -y, i.e. left to right on screen). a: where it starts (or its centre with o.center). */
K.text = function (g, face, p, a, z0, h, str, col, o) {
  const P = face === 'L' ? (s, z) => [s, p + 0.06, z] : (s, z) => [p + 0.06, -s, z];
  K.textP(g, P, face === 'L' ? a : -a, z0, h, str, col, o);
};
/* a sign board on a face (K.on's coordinates) with a word centred on it, as big as fits; ink dark or light by the board */
K.sign = function (g, face, p, a0, a1, z0, z1, col, word, o) {
  o = o || {}; const q = K.on(face, p + 0.05, a0, a1, z0, z1);
  g.fill(q, col); if (o.line !== false) g.outline(q, { w: o.w || 0.45, c: o.c || shade(col, 0.5), boil: false });
  if (word) {
    const h = Math.min((z1 - z0) * 0.6, Math.abs(a1 - a0) * 0.92 / K.textW(word, 1, o));
    K.text(g, face, p + 0.02, (a0 + a1) / 2, (z0 + z1) / 2 - h / 2, h, word, o.ink || (hex2rgb(col).reduce((x, y) => x + y) > 430 ? '#2C271C' : '#FBF8EE'), { center: true, track: o.track });
  }
};
