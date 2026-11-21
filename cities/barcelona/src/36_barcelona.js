'use strict';
/* Barcelona's own kit. Eixample buildings are prisms on polygons (chamfered corners), so the facade helpers work on
   any face of a polygon, not only the engine's 'L' / 'R' planes: BC.faces(poly) gives each edge with its outward
   normal, whether we see it, its tone, and P(a, z, d) -> world point (a along the edge, d out from the wall).
   Then: sand-stone houses with green louvred shutters, wrought-iron balconies, senyeres, ground-floor shops with
   Catalan names, roof terraces; street furniture (plane trees, palms, Eixample lamps, Falqués's bench-lamps, the
   coloured recycling containers, Bicing docks, parked motorbikes, kiosks); the people of Barcelona (and its
   castellers); vehicles (black-and-yellow taxis, red buses, the open-top tourist bus, scooters, Bicing, vans) and
   boats. Everything in tile-local u unless the name ends in 2 (wide px). */
const BC = {};
const BP = {
  stone: '#ECDAB3', stoneR: '#D9C39A', stoneT: '#F4E8CE', sill: '#F6EEDB', groove: '#D4BE94',
  ochre: '#E4BE84', rose: '#EBC3A8', cream: '#F2E7CF', peach: '#EFCFA6', grey: '#DCD6CA',
  shut: '#5E8A63', shutD: '#456C4B', shutL: '#7FA77F', iron: '#2E3230', pane: '#4F5B63',
  pave: '#E4DED2', paveD: '#D2C9B7', paveL: '#EFEAE0', asph: '#CEC8BC', asphD: '#BAB3A5', kerb: '#A99F8C',
  sea: '#93C6CB', seaD: '#6FA6AF', seaL: '#BEDDDC', sand: '#F1E0B8', sandD: '#E2CB98', sandW: '#D9C08C',
  plane: '#97B65E', planeY: '#D5C35A', planeInk: '#566E31', roof: '#D59A72', roofD: '#B97D58',
  red: '#C9392E', yellow: '#F0C341', trenc: ['#4F8FBF', '#7DBF9A', '#E6C24F', '#E07A5A', '#F3F1EA', '#3F6FA8', '#9AC4D8', '#C9584B'],
  gold: '#D8AE48', green: '#3E6E52', greenD: '#2C5240',
};
BC.SHOPS = ['FARMÀCIA', 'FORN DE PA', 'FLECA', 'QUEVIURES', 'LLIBRERIA', 'PASTISSERIA', 'FRUITERIA', 'BODEGA', 'GRANJA',
  'VERMUTERIA', 'ESTANC', 'FERRETERIA', 'MERCERIA', 'PERRUQUERIA', 'VINS I CAVES', 'XURRERIA', 'PEIXATERIA', 'FLORISTERIA',
  'CAFÈ', 'BAR', 'TAPES', 'GELATS', 'ÒPTICA', 'CARNISSERIA', 'ESPARDENYES', 'BOTIGA'];
BC.shopWord = (seed) => BC.SHOPS[Math.floor(h1(Math.abs(Math.round(seed)) * 7 + 13) * BC.SHOPS.length) % BC.SHOPS.length];

/* ---------------- geometry of faces ---------------- */
/* a rectangle with 45° cuts at chosen corners. cut: { pp, pn, np, nn } leg lengths for the corners (x1,y1), (x1,y0),
   (x0,y1), (x0,y0). The polygon runs round the outline (any orientation: normals are found from the centroid). */
BC.cham = function (x0, y0, x1, y1, cut) {
  cut = cut || {}; const p = [];
  const nn = cut.nn || 0, pn = cut.pn || 0, pp = cut.pp || 0, np = cut.np || 0;
  if (nn) p.push([x0, y0 + nn], [x0 + nn, y0]); else p.push([x0, y0]);
  if (pn) p.push([x1 - pn, y0], [x1, y0 + pn]); else p.push([x1, y0]);
  if (pp) p.push([x1, y1 - pp], [x1 - pp, y1]); else p.push([x1, y1]);
  if (np) p.push([x0 + np, y1], [x0, y1 - np]); else p.push([x0, y1]);
  return p;
};
BC.bbox = (poly) => { let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity; for (const [x, y] of poly) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); } return [a, b, c, d]; };
/* every edge of a polygon as a face: A, B, unit u along it, outward normal n, length L, vis, tone t (0 lit .. 1 shaded) */
BC.faces = function (poly) {
  let cx = 0, cy = 0; for (const p of poly) { cx += p[0] / poly.length; cy += p[1] / poly.length; }
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const A = poly[i], B = poly[(i + 1) % poly.length], dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy);
    if (L < 1e-6) continue;
    const u = [dx / L, dy / L]; let n = [u[1], -u[0]];
    const mx = (A[0] + B[0]) / 2 - cx, my = (A[1] + B[1]) / 2 - cy; if (n[0] * mx + n[1] * my < 0) n = [-n[0], -n[1]];
    const F = { A, B, u, n, L, i, vis: n[0] + n[1] > 0.05, t: clamp(0.5 + 0.5 * (n[0] - n[1]), 0, 1) };
    F.P = (a, z, d) => [A[0] + u[0] * a + n[0] * (d || 0), A[1] + u[1] * a + n[1] * (d || 0), z];
    F.q = (a0, a1, z0, z1, d) => [F.P(a0, z0, d), F.P(a1, z0, d), F.P(a1, z1, d), F.P(a0, z1, d)];
    F.rtl = (u[0] - u[1]) < 0;          // the edge runs right-to-left on screen
    out.push(F);
  }
  return out;
};
BC.tone = (col, t) => { const c = K.tones(col); return mix(c.l, c.r, t); };
/* a prism on a convex polygon: the visible side faces, the top, the ink. Returns the faces. o: { w, c, nt, top, nb } */
BC.prism = function (g, poly, z0, z1, col, o) {
  o = o || {}; const c = K.tones(col), F = BC.faces(poly), lo = { w: o.w == null ? 0.9 : o.w, c: o.c, boil: o.boil }, li = { w: lo.w * 0.75, c: o.c, boil: o.boil };
  if (o.hid !== false) for (const f of F) if (!f.vis) g.line([[f.A[0], f.A[1], z0], [f.B[0], f.B[1], z0]], { w: 0.5, c: o.c, co: true });
  for (const f of F) if (f.vis) g.fill(f.q(0, f.L, z0, z1), mix(c.l, c.r, f.t));
  if (!o.nt) g.fill(poly.map((p) => [p[0], p[1], z1]), o.top || c.t);
  if (o.line === false) return F;
  const n = F.length;
  for (let i = 0; i < n; i++) {
    const f = F[i], prev = F[(i + n - 1) % n];
    if (f.vis && !o.nb) g.line([[f.A[0], f.A[1], z0], [f.B[0], f.B[1], z0]], lo);
    if (f.vis || prev.vis) g.line([[f.A[0], f.A[1], z0], [f.A[0], f.A[1], z1]], f.vis !== prev.vis ? lo : li);
    if (!o.nt) g.line([[f.A[0], f.A[1], z1], [f.B[0], f.B[1], z1]], f.vis ? li : lo);
    else if (f.vis) g.line([[f.A[0], f.A[1], z1], [f.B[0], f.B[1], z1]], lo);
  }
  return F;
};
/* text along a face, centred at a (reads left to right on screen whichever way the edge runs) */
BC.text = function (g, F, a, z0, h, str, col, o) {
  const P = F.rtl ? (s, z) => F.P(-s, z, 0.08) : (s, z) => F.P(s, z, 0.08);
  K.textP(g, P, F.rtl ? -a : a, z0, h, str, col, Object.assign({ center: true }, o || {}));
};
BC.sign = function (g, F, a0, a1, z0, z1, col, word, o) {
  o = o || {}; const q = F.q(a0, a1, z0, z1, 0.06); g.fill(q, col); if (o.line !== false) g.outline(q, { w: 0.4, c: shade(col, 0.5), boil: false, ext: 0 });
  if (word) { const hh = Math.min((z1 - z0) * 0.62, Math.abs(a1 - a0) * 0.9 / K.textW(word, 1)); BC.text(g, F, (a0 + a1) / 2, (z0 + z1) / 2 - hh / 2, hh, word, o.ink || (hex2rgb(col).reduce((x, y) => x + y) > 430 ? '#2C271C' : '#FBF6E8')); }
};

/* ---------------- facades ---------------- */
/* a tall balcony door with louvred shutters (persianes): open (folded back beside the opening) or closed */
BC.win = function (g, F, a0, a1, z0, z1, o) {
  o = o || {}; const sc = o.shut || BP.shut, w = a1 - a0;
  g.fill(F.q(a0 - 0.18, a1 + 0.18, z0 - 0.1, z1 + 0.28, 0.02), o.sc || BP.sill);
  const closed = o.closed, P = g.P(F.q(a0, a1, z0, z1, 0.04));
  if (closed) {
    g.fill2(P, sc, true);
    const lv = [], n = Math.max(3, Math.round((z1 - z0) / 0.32));
    for (let i = 1; i < n; i++) { const t = i / n; lv.push(lerp(P[0][0], P[3][0], t), lerp(P[0][1], P[3][1], t), lerp(P[1][0], P[2][0], t), lerp(P[1][1], P[2][1], t)); }
    const m0 = g.p.apply(g, F.P((a0 + a1) / 2, z0, 0.05)), m1 = g.p.apply(g, F.P((a0 + a1) / 2, z1, 0.05)); lv.push(m0[0], m0[1], m1[0], m1[1]);
    g.segs2(lv, shade(sc, 0.3), 0.22);
  } else {
    g.fill2(P, o.pane || BP.pane, true);
    const m0 = g.p.apply(g, F.P((a0 + a1) / 2, z0, 0.05)), m1 = g.p.apply(g, F.P((a0 + a1) / 2, z1, 0.05)), r0 = g.p.apply(g, F.P(a0, z1 - (z1 - z0) * 0.25, 0.05)), r1 = g.p.apply(g, F.P(a1, z1 - (z1 - z0) * 0.25, 0.05));
    g.segs2([m0[0], m0[1], m1[0], m1[1], r0[0], r0[1], r1[0], r1[1]], '#E7DFCC', 0.28);
    // the two shutter leaves folded back against the wall
    for (const [b0, b1] of [[a0 - w * 0.5, a0 - 0.05], [a1 + 0.05, a1 + w * 0.5]]) g.fill2(g.P(F.q(b0, b1, z0, z1, 0.06)), sc, true);
  }
  g.outline2(P, { w: 0.3, c: '#4A443B', boil: false, ext: 0 });
};
/* a wrought-iron balcony: a stone slab out from the face and a rail; curvy: the modernista whiplash rail */
BC.bal = function (g, F, a0, a1, z, o) {
  o = o || {}; const out = o.out || 0.85, rh = 1.05;
  const slab = [F.P(a0, z, 0), F.P(a1, z, 0), F.P(a1, z, out), F.P(a0, z, out)];
  g.fill(slab, BP.stoneT); g.fill(F.q(a0, a1, z - 0.3, z, out), BP.sill); g.line([F.P(a0, z - 0.3, out), F.P(a1, z - 0.3, out)], { w: 0.3, c: '#9A8A68', boil: false, ext: 0 });
  const segs = [], n = Math.max(2, Math.round((a1 - a0) / 0.38));
  for (let i = 0; i <= n; i++) { const a = lerp(a0 + 0.05, a1 - 0.05, i / n), b = g.p.apply(g, F.P(a, z, out - 0.05)), c = g.p.apply(g, F.P(a, z + rh, out - 0.05)); segs.push(b[0], b[1], c[0], c[1]); }
  g.segs2(segs, BP.iron, 0.22);
  const top = []; for (let i = 0; i <= 8; i++) { const a = lerp(a0, a1, i / 8), bump = o.curvy ? Math.sin(Math.PI * i / 8) * 0.35 : 0; top.push(g.p.apply(g, F.P(a, z + rh + bump, out - 0.05))); }
  g.line2(top, { w: 0.42, c: BP.iron, boil: false, ext: 0, wob: 0.2 });
  if (o.curvy) { const sc = []; for (let i = 0; i < Math.max(1, Math.round((a1 - a0) / 1.1)); i++) { const a = lerp(a0 + 0.5, a1 - 0.5, (i + 0.5) / Math.max(1, Math.round((a1 - a0) / 1.1))), c = g.p.apply(g, F.P(a, z + 0.55, out - 0.04)); sc.push(c); } for (const c of sc) g.ring2(c, 0.9, { c: BP.iron, w: 0.26 }); }
  if (o.flag) BC.drape(g, F, (a0 + a1) / 2, z + rh, out, o.flag);
  if (o.pots) { const R = RNG(Math.round(a0 * 13 + z * 7)); for (let i = 0; i < 2; i++) { const c = g.p.apply(g, F.P(lerp(a0 + 0.4, a1 - 0.4, i), z, out * 0.5)); g.fill2([[c[0] - 0.6, c[1]], [c[0] + 0.6, c[1]], [c[0] + 0.5, c[1] - 1.0], [c[0] - 0.5, c[1] - 1.0]], '#B9674A', true); g.disc2([c[0], c[1] - 1.8], 1.1, R.pick(['#7FA65A', '#6E9A50', '#D85A7A', '#E07A5A'])); } }
};
/* a flag draped over a balcony rail: kind 'senyera' (nine stripes, yellow and red), 'merce' (a white banner) */
BC.drape = function (g, F, a, z, out, kind) {
  const w = 1.35, h = 2.3, a0 = a - w, a1 = a + w, P = (aa, zz) => F.P(aa, zz, out + 0.02);
  if (kind === 'senyera' || kind === true) {
    for (let i = 0; i < 9; i++) { const z0 = z - h + h * i / 9, z1 = z - h + h * (i + 1) / 9; g.fill([P(a0, z0), P(a1, z0), P(a1, z1), P(a0, z1)], i % 2 ? BP.red : BP.yellow); }
  } else {   // the flag of Barcelona: Sant Jordi's cross (red on white) and the senyera, quartered
    const q = (b0, b1, z0, z1) => [P(b0, z0), P(b1, z0), P(b1, z1), P(b0, z1)], zm = z - h / 2;
    for (const [b0, b1, z0, z1, cross] of [[a0, a, zm, z, true], [a, a1, z - h, zm, true], [a, a1, zm, z, false], [a0, a, z - h, zm, false]]) {
      if (cross) { g.fill(q(b0, b1, z0, z1), '#F6F1E4'); const bm = (b0 + b1) / 2, zc = (z0 + z1) / 2; g.fill(q(bm - 0.13, bm + 0.13, z0, z1), BP.red); g.fill(q(b0, b1, zc - 0.13, zc + 0.13), BP.red); }
      else for (let i = 0; i < 7; i++) g.fill(q(lerp(b0, b1, i / 7), lerp(b0, b1, (i + 1) / 7), z0, z1), i % 2 ? BP.red : BP.yellow);
    }
  }
  g.outline([P(a0, z - h), P(a1, z - h), P(a1, z), P(a0, z)], { w: 0.3, c: '#7A3A2A', boil: false, ext: 0 });
};
/* a ground-floor shopfront in a bay: painted frame, glass, a fascia with a Catalan name; kind 'closed' pulls the
   metal roller shutter down (with a burst of graffiti); 'door' is the tall wooden street door of the stair */
BC.shop = function (g, F, a0, a1, h, kind, seed, col) {
  const R = RNG(seed * 31 + 7); col = col || R.pick(['#3E6E52', '#2F4A63', '#7A2E2A', '#5A4632', '#2E3230', '#8A6A3A', '#3F5F8F']);
  if (kind === 'door') {
    const m = (a0 + a1) / 2, w = Math.min(1.1, (a1 - a0) / 2), pts = [F.P(m - w, 0, 0.04), F.P(m + w, 0, 0.04)];
    for (let i = 0; i <= 6; i++) { const t = Math.PI * i / 6; pts.push(F.P(m + Math.cos(t) * w, h - 1.2 - w + Math.sin(t) * w, 0.04)); }
    g.fill(pts, '#6B4A30'); g.outline(pts, { w: 0.4, c: '#3A2A1E', boil: false });
    const a = g.p.apply(g, F.P(m, 0, 0.06)), b = g.p.apply(g, F.P(m, h - 1.2, 0.06)); g.segs2([a[0], a[1], b[0], b[1]], '#3A2A1E', 0.3);
    return;
  }
  g.fill(F.q(a0, a1, 0, h - 0.4, 0.03), col);
  if (kind === 'closed') {
    const q = g.P(F.q(a0 + 0.25, a1 - 0.25, 0, h - 1.5, 0.05)); g.fill2(q, '#A9ADA8', true);
    const lv = []; for (let i = 1; i < 9; i++) { const t = i / 9; lv.push(lerp(q[0][0], q[3][0], t), lerp(q[0][1], q[3][1], t), lerp(q[1][0], q[2][0], t), lerp(q[1][1], q[2][1], t)); } g.segs2(lv, '#8C908B', 0.22);
    const c = [lerp(q[0][0], q[2][0], 0.5), lerp(q[0][1], q[2][1], 0.55)], sp = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]) * 0.35;
    for (let i = 0; i < 3; i++) g.disc2([c[0] + (R() - 0.5) * sp, c[1] + (R() - 0.5) * 3], 1.4 + R() * 1.4, R.pick(['#E07A5A', '#4F8FBF', '#E6C24F', '#9A7CC0', '#7DBF9A', '#2A2622']));
    g.segs2([c[0] - sp * 0.4, c[1], c[0] + sp * 0.4, c[1] - 1.2], '#2A2622', 0.5);
  } else {
    const gl = F.q(a0 + 0.3, a1 - 0.3, 0.3, h - 1.65, 0.05); g.fill(gl, kind === 'bar' ? '#E8D3A6' : '#CFE0E4');
    const G = g.P(gl), dots = [];
    for (let i = 0; i < 4; i++) { const t = (i + 0.5) / 4, b = [lerp(G[0][0], G[1][0], t), lerp(G[0][1], G[1][1], t)]; dots.push(b); }
    for (const b of dots) g.fill2([[b[0] - 0.7, b[1] - 0.2], [b[0] + 0.7, b[1] - 0.2], [b[0] + 0.7, b[1] - 1.6], [b[0] - 0.7, b[1] - 1.6]], R.pick(['#D98AA4', '#E6C24F', '#7FB7D9', '#C9584B', '#8FBF73', '#F3F1EA', '#E08A3C']), true);
    const m = [(G[0][0] + G[2][0]) / 2, (G[0][1] + G[2][1]) / 2]; g.segs2([m[0] - 0.6, m[1] + 1.4, m[0] + 0.8, m[1] - 1.4], '#FBFAF4', 0.5);
    g.outline(gl, { w: 0.3, c: shade(col, 0.5), boil: false, ext: 0 });
  }
  BC.sign(g, F, a0 + 0.1, a1 - 0.1, h - 1.55, h - 0.5, kind === 'closed' ? shade(col, 0.1) : col, kind === 'closed' ? null : BC.shopWord(seed), { ink: '#F3E3B0' });
  if (kind === 'closed') BC.text(g, F, (a0 + a1) / 2, h - 1.3, 0.62, BC.shopWord(seed + 1), '#F3E3B0');
};
/* an Eixample house on a polygon: a sand-stone prism, a tall ground floor of shops and doors, storeys of balcony
   doors (a continuous balcony on the principal floor), a cornice, the roof terrace with its parapet.
   d: { poly, z (top of the wall), gf, fl, bay, col, shut, faces: 'all' | [indices], shops: fn(F, i) -> kind,
        flags: 0..1 share of senyeres, curvy, tribune: [faceIndex, a0, a1], noRoof, seed, closedP } */
BC.house = function (g, d) {
  const bp = g.boilP; g.boilP = 0.22;
  const poly = d.poly, Z = d.z, gf = d.gf || 4.6, fl = d.fl || 3.3, bay = d.bay || 2.6, col = d.col || BP.stone, seed = d.seed || 1;
  const tones = { t: BP.stoneT, l: col, r: shade(col, 0.1) }, R = RNG(seed * 977 + 3);
  const F = BC.prism(g, poly, 0, Z + 0.9, tones, { w: 0.9, nt: true });
  const nfl = Math.max(1, Math.floor((Z - gf - 0.6) / fl));
  for (const f of F) {
    if (!f.vis || f.L < 1.6) continue;
    // rustication grooves on the ground floor, a band above it
    const gr = []; for (let z = 0.9; z < gf - 0.3; z += 0.9) { const a = g.p.apply(g, f.P(0, z, 0.01)), b = g.p.apply(g, f.P(f.L, z, 0.01)); gr.push(a[0], a[1], b[0], b[1]); } g.segs2(gr, BP.groove, 0.26);
    g.fill(f.q(0, f.L, gf - 0.3, gf + 0.05, 0.03), BP.stoneT);
    const nb = Math.max(1, Math.round(f.L / bay)), bw = f.L / nb;
    for (let i = 0; i < nb; i++) {
      const a0 = bw * i + 0.25, a1 = bw * (i + 1) - 0.25, kind = d.shops ? d.shops(f, i, nb) : (h1(seed * 13 + f.i * 7 + i) < 0.18 ? 'door' : h1(seed * 17 + f.i * 3 + i) < (d.closedP == null ? 0.15 : d.closedP) ? 'closed' : h1(seed * 5 + i) < 0.3 ? 'bar' : 'shop');
      if (kind) BC.shop(g, f, a0, a1, gf - 0.3, kind, seed * 41 + f.i * 11 + i);
    }
    const shut = d.shut || BP.shut;
    for (let k = 0; k < nfl; k++) {
      const zb = gf + k * fl, z0 = zb + 0.35, z1 = zb + fl - 0.55;
      for (let i = 0; i < nb; i++) {
        const m = bw * (i + 0.5), ww = Math.min(0.62, bw * 0.24);
        if (d.tribune && d.tribune[0] === f.i && k === 0 && m > d.tribune[1] && m < d.tribune[2]) continue;
        BC.win(g, f, m - ww, m + ww, z0, z1, { closed: h1(seed * 3 + k * 31 + i * 7 + f.i) < 0.3, shut });
      }
      if (k === 0) BC.bal(g, f, 0.4, f.L - 0.4, zb + 0.1, { curvy: d.curvy, flag: false });
      else for (let i = 0; i < nb; i++) { const m = bw * (i + 0.5), fg = h1(seed * 11 + k * 5 + i * 3 + f.i) < (d.flags == null ? 0.12 : d.flags); BC.bal(g, f, m - Math.min(1.05, bw * 0.42), m + Math.min(1.05, bw * 0.42), zb + 0.1, { curvy: d.curvy, flag: fg ? 'senyera' : false, pots: !fg && h1(seed + k * 7 + i) < 0.25 }); }
    }
    if (d.tribune && d.tribune[0] === f.i) BC.tribune(g, f, d.tribune[1], d.tribune[2], gf, gf + fl, d.tribColor);
    // the cornice
    g.fill(f.q(-0.05, f.L + 0.05, Z - 0.4, Z, 0.25), BP.sill);
    g.line([f.P(0, Z - 0.4, 0.25), f.P(f.L, Z - 0.4, 0.25)], { w: 0.35, c: '#9A8A68', boil: false, ext: 0 });
  }
  if (d.tiled) BC.tiledRoof(g, poly, Z + 0.9, seed);
  else if (!d.noRoof) BC.terrat(g, poly, Z + 0.9, seed, d.roofItems);
  g.boilP = bp;
  return F;
};
/* a tribuna: a glazed bay with stained glass hung on the principal floor */
BC.tribune = function (g, F, a0, a1, z0, z1, col) {
  col = col || '#E9DDC2'; const o = 1.0;
  const sides = [[F.P(a0, z0, 0), F.P(a0, z0, o), F.P(a0, z1, o), F.P(a0, z1, 0)], [F.P(a1, z0, 0), F.P(a1, z0, o), F.P(a1, z1, o), F.P(a1, z1, 0)]];
  for (const s of sides) g.fill(s, shade(col, 0.12));
  const fr = F.q(a0, a1, z0, z1, o); g.fill(fr, col);
  const n = Math.max(2, Math.round((a1 - a0) / 0.9));
  for (let i = 0; i < n; i++) { const b0 = lerp(a0, a1, i / n) + 0.12, b1 = lerp(a0, a1, (i + 1) / n) - 0.12; g.fill(F.q(b0, b1, z0 + 0.6, z1 - 0.35, o + 0.02), '#7FA4B8'); g.fill(F.q(b0, b1, z1 - 0.95, z1 - 0.35, o + 0.03), ['#E6C24F', '#C9584B', '#7DBF9A', '#4F8FBF'][i % 4]); }
  g.fill([F.P(a0 - 0.15, z1, 0), F.P(a1 + 0.15, z1, 0), F.P(a1 + 0.15, z1, o + 0.2), F.P(a0 - 0.15, z1, o + 0.2)], BP.sill);
  g.outline(fr, { w: 0.4, c: '#7A6A4A', boil: false });
};
/* the roof terrace (terrat): a pale tiled floor inside a parapet, the stair house, water tanks, laundry lines */
BC.terrat = function (g, poly, z, seed, items) {
  const R = RNG(seed * 53 + 1), F = BC.faces(poly), [x0, y0, x1, y1] = BC.bbox(poly);
  const floor = R.pick(['#E8D9BE', '#E2CDAE', '#DCC4A2', '#D9AE8C', '#E6D6BA']);
  g.fill(poly.map((p) => [p[0], p[1], z]), floor);
  // the parapet's inner faces on the far sides, and its top
  const ins = 0.4;
  for (const f of F) if (!f.vis) { const q = [f.P(0, z - 0.9, -ins), f.P(f.L, z - 0.9, -ins), f.P(f.L, z, -ins), f.P(0, z, -ins)]; g.fill(q, shade(BP.stone, 0.06)); }
  const tiles = []; for (let a = x0 + 1.2; a < x1 - 0.6; a += 1.6) { const p = g.p(a, y0 + 0.5, z - 0.85), q = g.p(a, y1 - 0.5, z - 0.85); tiles.push(p[0], p[1], q[0], q[1]); }
  g.segs2(tiles, shade(floor, 0.08), 0.25);
  g.outline(poly.map((p) => [p[0], p[1], z]), { w: 0.6, c: '#8A7A5A', boil: false });
  if (items === false) return;
  const w = x1 - x0, h = y1 - y0, zf = z - 0.85;
  const at = (fx, fy) => [x0 + w * fx, y0 + h * fy];
  if (w > 7 && h > 7 && R() < 0.75) {   // the stair house, sometimes with a water tank or two
    const [sx, sy] = at(0.22 + R() * 0.25, 0.22 + R() * 0.25), sw = 1.3 + R() * 0.6;
    K.box(g, sx - sw, sy - 1.3, sx + sw, sy + 1.3, zf, z + 2.2 + R() * 0.6, { t: '#D9C9A8', l: '#EDE2CC', r: '#D6C7A8' }, { w: 0.55, nohid: true });
    g.fill(K.on('L', sy + 1.32, sx - 0.55, sx + 0.55, zf, z + 1.4), R.pick(['#6B4A30', '#3E6E52', '#8A3A30']));
    if (R() < 0.45) K.cyl(g, sx + sw + 1.6, sy - 0.6, 0.9, zf, z + 1.1, { t: '#F1EFE8', l: '#ECEAE2', r: '#CFCCC2' }, { w: 0.5, n: 10 });
  }
  const kind = R();
  if (w > 9 && h > 4 && kind < 0.45) {   // a washing line with clothes
    const ly = y0 + h * (0.55 + R() * 0.3), la = x0 + w * 0.15, lb = x0 + w * 0.15 + Math.min(8, w * 0.6);
    const a = g.p(la, ly, z + 1.6), b = g.p(lb, ly, z + 1.6); g.segs2([a[0], a[1], b[0], b[1], a[0], a[1], a[0], a[1] + 1.6 * VZ, b[0], b[1], b[0], b[1] + 1.6 * VZ], '#6E6A60', 0.25);
    for (let i = 0; i < 5; i++) { const t = (i + 0.5) / 5, c = [lerp(a[0], b[0], t), lerp(a[1], b[1], t)], col = R.pick(['#F3F1EA', '#5F8FC9', '#E6C24F', '#C9584B', '#8FBF73', '#F3F1EA', '#D98AA4']); g.fill2([[c[0] - 1.2, c[1]], [c[0] + 1.2, c[1]], [c[0] + 1.1, c[1] + 2.6], [c[0] - 1.1, c[1] + 2.6]], col, true); }
  } else if (w > 8 && h > 6 && kind < 0.7) {   // a pergola with a vine, a table and chairs
    const [px, py] = at(0.62, 0.6), pts = [[px - 2.2, py - 1.6], [px + 2.2, py - 1.6], [px + 2.2, py + 1.6], [px - 2.2, py + 1.6]];
    const posts = []; for (const [x, y] of pts) { const p0 = g.p(x, y, zf), p1 = g.p(x, y, zf + 3); posts.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(posts, '#8A6A4A', 0.45);
    const tp = pts.map(([x, y]) => [x, y, zf + 3]); g.fill(tp, 'rgba(127,166,90,0.9)'); g.scuff(tp, { c: '#5E8A3E', len: 1.0, dir: -1.2, spread: 1.4, dens: 1.2, w: 0.5 });
    const tc = g.p(px, py, zf + 1.4); g.fill2(arcPts(tc[0], tc[1], 1.8, 0, TAU, 10).map((q) => [q[0], tc[1] + (q[1] - tc[1]) * 0.45]), '#F3F1EA', true);
  } else if (w > 6 && h > 5) {   // potted plants along the parapet, a solar water heater
    for (let i = 0; i < 4; i++) { const p = g.p(x0 + 1 + i * 1.6, y1 - 0.9, zf); g.fill2([[p[0] - 0.6, p[1]], [p[0] + 0.6, p[1]], [p[0] + 0.5, p[1] - 1.2], [p[0] - 0.5, p[1] - 1.2]], '#B9674A', true); g.disc2([p[0], p[1] - 2.0], 1.2, R.pick(['#7FA65A', '#6E9A50', '#D85A7A', '#E07A5A'])); }
    if (R() < 0.6) { const [qx, qy] = at(0.7, 0.3); const q = [[qx - 1.8, qy - 1, zf + 0.4], [qx + 1.8, qy - 1, zf + 0.4], [qx + 1.8, qy + 1, zf + 1.6], [qx - 1.8, qy + 1, zf + 1.6]]; g.fill(q, '#3F5F8F'); g.outline(q, { w: 0.35, c: '#2A3A5A', boil: false }); }
  }
  if (R() < 0.35) { const [ax, ay] = at(0.8, 0.8), a0 = g.p(ax, ay, zf), a1 = g.p(ax, ay, zf + 5); g.segs2([a0[0], a0[1], a1[0], a1[1], a1[0] - 2, a1[1] + 1, a1[0] + 2, a1[1] - 1, a1[0] - 1.4, a1[1] + 2.4, a1[0] + 1.4, a1[1] + 0.4], '#5A5A54', 0.3); }
};
/* a tiled hip roof (Gràcia's older houses) over a rectangular house */
BC.tiledRoof = function (g, poly, z, seed) {
  const [x0, y0, x1, y1] = BC.bbox(poly), R = RNG(seed);
  K.hip(g, x0 - 0.4, y0 - 0.4, x1 + 0.4, y1 + 0.4, z, 2.6 + R() * 0.8, R.pick(['#C9734F', '#B9674A', '#D08458']), { ridge: Math.max(0, Math.abs((x1 - x0) - (y1 - y0)) * 0.8) });
};

/* ---------------- plants ---------------- */
/* a plane tree (plàtan) of late summer: a mottled pale trunk, a broad green crown with a few yellowing patches */
BC.plane = function (g, x, y, o) {
  o = o || {}; const r = (o.r || 4.2) * 3.3, h = o.h == null ? 6.2 : o.h, f = g.p(x, y, o.z || 0), top = [f[0], f[1] - h * VZ], R = RNG(o.seed || Math.round(x * 41 + y * 13 + 7));
  g.fill2([[f[0] - 1.0, f[1]], [f[0] + 1.0, f[1]], [top[0] + 0.7, top[1] - r * 0.2], [top[0] - 0.7, top[1] - r * 0.2]], '#BDB291');
  const mot = []; for (let i = 0; i < 4; i++) { const yy = f[1] - (i + 0.5) * h * VZ / 4, xx = f[0] + (R() - 0.5) * 1.1; mot.push(xx - 0.4, yy, xx + 0.4, yy - 0.7); } g.segs2(mot, '#8C8064', 0.5);
  g.line2([[f[0] - 1.0, f[1]], [top[0] - 0.7, top[1]]], { w: 0.45, c: '#6E6450', boil: false }); g.line2([[f[0] + 1.0, f[1]], [top[0] + 0.7, top[1]]], { w: 0.45, c: '#6E6450', boil: false });
  const cx = top[0], cy = top[1] - r * 0.55, n = 11, pts = [], a0 = R() * TAU;
  for (let i = 0; i < n; i++) { const a = a0 + TAU * i / n, rr = r * (0.86 + R() * 0.26); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.82]); }
  const col = o.col || BP.plane; g.fill2(pts, col);
  const sh = pts.filter((p) => (p[0] - cx) * 0.55 + (p[1] - cy) > -r * 0.1); if (sh.length > 1) { sh.push([cx + r * 0.05, cy + r * 0.12]); g.fill2(sortAround(sh), shade(col, 0.15)); }
  for (let i = 0; i < 2; i++) { const a = R() * TAU, d = r * (0.3 + R() * 0.45), px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.8, rr = r * (0.14 + R() * 0.1), blob = []; for (let k = 0; k < 7; k++) { const t = TAU * k / 7; blob.push([px + Math.cos(t) * rr, py + Math.sin(t) * rr * 0.75]); } g.fill2(blob, BP.planeY); }
  const hl = pts.filter((p) => (p[0] - cx) * 0.6 + (p[1] - cy) < -r * 0.5); if (hl.length > 1) { hl.push([cx - r * 0.3, cy - r * 0.3]); g.fill2(sortAround(hl), shade(col, -0.22)); }
  g.outline2(pts, { c: BP.planeInk, w: 0.85, ext: 0.4 });
  const segs = []; for (let i = 0; i < 5; i++) { const a = R() * TAU, d = r * (0.2 + R() * 0.55), px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.8, l = r * 0.13; segs.push(px, py, px + l, py - l * 0.5, px + l, py - l * 0.5, px + l * 1.8, py + l * 0.2); }
  g.segs2(segs, BP.planeInk, 0.5);
};

/* ---------------- street furniture ---------------- */
/* an Eixample street lamp: a slim dark post with a curved arm and a lantern */
BC.lamp = function (g, x, y, o) {
  o = o || {}; const h = o.h || 10, f = g.p(x, y, o.z || 0), t = g.p(x, y, (o.z || 0) + h), col = '#3A4440';
  g.fill2([[f[0] - 0.9, f[1]], [f[0] + 0.9, f[1]], [f[0] + 0.6, f[1] - 2.2], [f[0] - 0.6, f[1] - 2.2]], col, true);
  g.fill2([[f[0] - 0.38, f[1] - 2], [f[0] + 0.38, f[1] - 2], [t[0] + 0.3, t[1]], [t[0] - 0.3, t[1]]], col, true);
  const s = o.side || 1, arm = K.curve([[t[0], t[1]], [t[0] + s * 1.5, t[1] - 2.4], [t[0] + s * 4.0, t[1] - 2.6], [t[0] + s * 5.2, t[1] - 1.6]], 3, false);
  g.line2(arm, { w: 0.5, c: col, boil: false, ext: 0 });
  const L = [t[0] + s * 5.2, t[1] - 1.2]; g.fill2([[L[0] - 1.3, L[1]], [L[0] + 1.3, L[1]], [L[0] + 0.9, L[1] + 2.0], [L[0] - 0.9, L[1] + 2.0]], '#F3E3A8', true);
  g.fill2([[L[0] - 1.6, L[1] + 0.1], [L[0] + 1.6, L[1] + 0.1], [L[0], L[1] - 1.2]], col, true);
};
/* Falqués's bench-lamp on Passeig de Gràcia: a curved bench of white trencadís and a wrought-iron lamp rising from it */
BC.benchLamp = function (g, x, y, ax) {
  const R = RNG(Math.round(x * 7 + y * 3)), L = 3.0, W = (u0, u1, v0, v1) => ax === 'x' ? [x + u0, y + v0, x + u1, y + v1] : [x + v0, y + u0, x + v1, y + u1];
  const tr = (q, n) => { const P = g.P(q); for (let i = 0; i < n; i++) { const s = R(), t = R(), p = [lerp(lerp(P[0][0], P[1][0], s), lerp(P[3][0], P[2][0], s), t), lerp(lerp(P[0][1], P[1][1], s), lerp(P[3][1], P[2][1], s), t)]; g.fill2([[p[0] - 0.5, p[1] - 0.3], [p[0] + 0.45, p[1] - 0.45], [p[0] + 0.4, p[1] + 0.4], [p[0] - 0.35, p[1] + 0.35]], R.pick(BP.trenc), true); } };
  // the seat and the curved back: white stone clad in broken tile, all one piece
  const s0 = W(-L, L, -0.2, 1.0), b0 = W(-L, L, -0.6, -0.2), WH = { t: '#F4F1E8', l: '#EDE9DE', r: '#D9D4C6' };
  K.box(g, b0[0], b0[1], b0[2], b0[3], 0, 3.0, WH, { w: 0.5, nohid: true, boil: false });
  if (ax === 'x') tr(K.on('L', b0[3], b0[0], b0[2], 1.4, 3.0), 30); else tr(K.on('R', b0[2], b0[1], b0[3], 1.4, 3.0), 30);
  K.box(g, s0[0], s0[1], s0[2], s0[3], 0, 1.4, WH, { w: 0.5, nohid: true, boil: false });
  if (ax === 'x') tr(K.on('L', s0[3], s0[0], s0[2], 0, 1.4), 30); else tr(K.on('R', s0[2], s0[1], s0[3], 0, 1.4), 30);
  // the iron lamp rising from the middle of the back, three lanterns on curling arms
  const b = g.p(x, y - (ax === 'x' ? 0.4 : 0), 3.0), t = g.p(x, y - (ax === 'x' ? 0.4 : 0), 12.5);
  g.fill2([[b[0] - 0.45, b[1]], [b[0] + 0.45, b[1]], [t[0] + 0.3, t[1]], [t[0] - 0.3, t[1]]], '#2E3230', true);
  for (const s of [-1, 1]) { g.line2(K.curve([[t[0], t[1] + 2], [t[0] + s * 2.5, t[1] - 0.5], [t[0] + s * 3.6, t[1] + 1.2]], 3, false), { w: 0.45, c: '#2E3230', boil: false }); g.disc2([t[0] + s * 3.6, t[1] + 2.0], 1.1, '#F3E3A8'); g.ring2([t[0] + s * 3.6, t[1] + 2.0], 1.1, { c: '#2E3230', w: 0.3 }); }
  g.disc2([t[0], t[1] - 1.0], 1.2, '#F3E3A8'); g.ring2([t[0], t[1] - 1.0], 1.2, { c: '#2E3230', w: 0.3 });
};
/* the coloured recycling containers in a row along ax: refuse, packaging, paper, glass (an igloo), organic */
BC.bins = function (g, x, y, ax, n) {
  const cols = [['#8E918C', '#767975'], ['#E7BF3C', '#C9A22A'], ['#3F70A8', '#2F5A8C'], ['#5E9A5A', '#4A7E47'], ['#8A6040', '#6E4A30']];
  n = n || 5;
  for (let i = 0; i < n; i++) {
    const u = (i - (n - 1) / 2) * 2.5, bx = ax === 'x' ? x + u : x, by = ax === 'x' ? y : y + u, c = cols[i % 5];
    if (i % 5 === 3) { K.dome(g, bx, by, 1.1, 0, 2.6, c[0], { w: 0.5, shadow: c[1] }); continue; }
    K.box(g, bx - 1.05, by - 0.85, bx + 1.05, by + 0.85, 0, 2.2, { t: shade(c[0], -0.12), l: c[0], r: c[1] }, { w: 0.5, boil: false, nohid: true });
    K.box(g, bx - 1.12, by - 0.92, bx + 1.12, by + 0.92, 2.2, 2.45, { t: shade(c[0], 0.1), l: shade(c[0], 0.15), r: shade(c[1], 0.1) }, { w: 0.4, boil: false, nohid: true });
  }
};
/* a parked Bicing bike (white frame with red parts) along an axis */
BC.bikeParked = function (g, ang) {
  const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, z) => g.p(u * ca, u * sa, z);
  for (const u of [-2.0, 2.0]) { const pts = []; for (let i = 0; i < 14; i++) { const t = TAU * i / 14; pts.push(pt(u + Math.cos(t) * 1.25, 1.25 + Math.sin(t) * 1.25)); } g.line2(pts, { c: '#3A3632', w: 0.55, close: true, boil: false, wob: 0.2 }); }
  const A = pt(-2.0, 1.25), B = pt(2.0, 1.25), s = pt(-0.6, 3.3), h = pt(1.5, 3.6), bb = pt(0, 1.3);
  g.segs2([A[0], A[1], bb[0], bb[1], bb[0], bb[1], s[0], s[1], bb[0], bb[1], h[0], h[1], h[0], h[1], B[0], B[1]], '#ECEBE4', 0.8);
  g.segs2([A[0], A[1] - 1.0, A[0] + 1.2, A[1] - 2.0], '#C9392E', 0.5);
  const bk = pt(2.2, 3.4); g.fill2([[bk[0] - 1.0, bk[1]], [bk[0] + 1.0, bk[1]], [bk[0] + 0.9, bk[1] + 1.4], [bk[0] - 0.9, bk[1] + 1.4]], '#C9392E', true);
};
BC.bicingDock = function (g, x, y, n, ax) {
  for (let i = 0; i < n; i++) {
    const u = (i - (n - 1) / 2) * 1.5, bx = ax === 'x' ? x + u : x, by = ax === 'x' ? y : y + u;
    const post = g.p(bx, by, 0), pt = g.p(bx, by, 2.2); g.segs2([post[0], post[1], pt[0], pt[1]], '#5E6462', 0.7);
    if (h1(Math.round(bx * 13 + by * 7)) < 0.75) g.at(bx, by, 0, (g2) => BC.bikeParked(g2, ax === 'x' ? Math.PI / 2 : 0));
  }
};
/* parked motorbikes (scooters) side by side, noses to the kerb */
BC.motoParked = function (g, ang, col) {
  const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, z) => g.p(u * ca, u * sa, z);
  const wheel = (u) => { const pts = []; for (let i = 0; i < 12; i++) { const t = TAU * i / 12; pts.push(pt(u + Math.cos(t) * 0.8, 0.8 + Math.sin(t) * 0.8)); } g.fill2(pts, '#3A3632', true); };
  wheel(-1.6); wheel(1.8);
  const body = [pt(-2.3, 1.0), pt(0.4, 0.9), pt(1.2, 1.2), pt(1.5, 3.4), pt(1.9, 3.7), pt(1.1, 3.7), pt(0.7, 1.9), pt(-0.6, 2.2), pt(-2.0, 2.6), pt(-2.5, 2.0)];
  g.fill2(body, col, true); g.line2(body, { w: 0.4, c: shade(col, 0.55), close: true, boil: false, wob: 0.2 });
  g.fill2([pt(-2.0, 2.6), pt(-0.5, 2.3), pt(-0.5, 2.75), pt(-2.0, 3.0)], '#3A3530', true);
  const hb0 = g.p(1.7 * ca - 0.8 * sa, 1.7 * sa + 0.8 * ca, 4.0), hb1 = g.p(1.7 * ca + 0.8 * sa, 1.7 * sa - 0.8 * ca, 4.0); g.segs2([hb0[0], hb0[1], hb1[0], hb1[1]], '#3A3530', 0.45);
};
BC.motoRow = function (g, x, y, n, ax, seed) {
  const R = RNG(seed || 5);
  for (let i = 0; i < n; i++) {
    const u = (i - (n - 1) / 2) * 1.6, bx = ax === 'x' ? x + u : x, by = ax === 'x' ? y : y + u;
    if (R() < 0.15) continue;
    g.at(bx, by, 0, (g2) => BC.motoParked(g2, ax === 'x' ? Math.PI / 2 : 0, R.pick(['#F1EFE8', '#2E3230', '#C9392E', '#8FA3B5', '#E6C24F', '#3F5F8F', '#F1EFE8'])));
  }
};
/* a news kiosk (quiosc): a dark green box with magazines on the front and a roof that overhangs */
BC.kiosk = function (g, x, y) {
  K.box(g, x - 2, y - 2, x + 2, y + 2, 0, 5.0, { t: BP.green, l: '#4C7E60', r: BP.green }, { w: 0.6 });
  const R = RNG(Math.round(x * 7 + y * 5));
  for (const [f, p] of [['L', y + 2], ['R', x + 2]]) {
    const a0 = f === 'L' ? x - 1.7 : y - 1.7;
    g.fill(K.on(f, p + 0.03, a0, a0 + 3.4, 0.9, 4.0), '#E9E2CC');
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) g.fill(K.on(f, p + 0.05, a0 + 0.15 + i * 0.82, a0 + 0.85 + i * 0.82, 1.1 + r * 0.95, 1.85 + r * 0.95), R.pick(['#C9463E', '#E6C24F', '#3F5F8F', '#F3F1EA', '#D98AA4', '#5F8F6A', '#2A2622']));
  }
  K.box(g, x - 2.5, y - 2.5, x + 2.5, y + 2.5, 5.0, 5.6, { t: BP.greenD, l: BP.green, r: BP.greenD }, { w: 0.6, nohid: true });
  K.sign(g, 'L', y + 2.5, x - 2.3, x + 2.3, 5.0, 5.6, BP.green, 'PREMSA', { line: false, ink: '#F3E3B0' });
};
/* a strip of festival pennants between two world points (sagging), colours cycling */
BC.bunting = function (g, a, b, n, cols, sag) {
  const A = g.p.apply(g, a), B = g.p.apply(g, b), s = sag == null ? 2.5 : sag, pt = (t) => [lerp(A[0], B[0], t), lerp(A[1], B[1], t) + s * 4 * t * (1 - t)];
  const line = []; for (let i = 0; i <= 12; i++) line.push(pt(i / 12));
  g.fine2(line, { w: 0.25, c: '#4A4540' });
  cols = cols || [BP.yellow, BP.red, '#F6F1E4', '#4F8FBF'];
  for (let i = 0; i < n; i++) { const t0 = (i + 0.15) / n, t1 = (i + 0.85) / n, p0 = pt(t0), p1 = pt(t1), m = pt((t0 + t1) / 2); g.fill2([p0, p1, [m[0], m[1] + 2.4]], cols[i % cols.length], true); }
};
/* a senyera flag on a pole: an actor whose free edge waves. o: { h, w, ht (cloth height), dir: +1 flies to screen right } */
BC.flagActor = function (T, x, y, z, o) {
  o = o || {}; const fw = o.w || 5, fh = o.ht || 3.4, sd = o.dir || 1, pole = o.pole !== false;
  T.actor({ sample: 5, period: 3, layer: o.layer,
    at(t) { const ph = Math.floor(((t * 1.3 + x * 0.07) % 1) * 8); return { x, y, z, key: ph, ph }; },
    draw(g, st) {
      const b = g.p(0, 0, 0), hh = (o.h || 8) * VZ;
      if (pole) g.segs2([b[0], b[1], b[0], b[1] - hh - 0.6], '#5A564E', 0.5);
      const top = [b[0], b[1] - hh], W = fw * 3.0, H = fh * 3.0, wave = (u) => Math.sin(u * 2.8 - st.ph / 8 * TAU) * 1.0 * u;
      for (let i = 0; i < 9; i++) {
        const v0 = H * i / 9, v1 = H * (i + 1) / 9, row = [];
        for (let k = 0; k <= 6; k++) { const u = k / 6; row.push([top[0] + sd * W * u, top[1] + v0 + wave(u)]); }
        for (let k = 6; k >= 0; k--) { const u = k / 6; row.push([top[0] + sd * W * u, top[1] + v1 + wave(u)]); }
        g.fill2(row, i % 2 ? BP.red : BP.yellow, true);
      }
      const ol = []; for (let k = 0; k <= 6; k++) { const u = k / 6; ol.push([top[0] + sd * W * u, top[1] + wave(u)]); } for (let k = 6; k >= 0; k--) { const u = k / 6; ol.push([top[0] + sd * W * u, top[1] + H + wave(u)]); }
      g.line2(ol, { w: 0.35, c: '#7A3A2A', close: true, boil: false, wob: 0.2 });
    } });
};

/* ---------------- people ---------------- */
const BC_TOPS = ['#F3F1EA', '#3B3F47', '#E6C24F', '#4F8FBF', '#C9584B', '#8FBF73', '#E7A9A0', '#2F3A4F', '#F0EDE4', '#7FB7D9', '#D98AA4', '#E08A3C', '#5FA58F', '#B9A27D', '#2A2622', '#F3E3A0'];
const BC_BOTS = ['#3F4D63', '#2F343B', '#E7E2D6', '#B9A27D', '#4A5A78', '#6B7B8C', '#2A2622', '#8FA3B5'];
/* a Barcelona citizen: Mediterranean skin and dark hair mostly, light summer clothes; tourists in shorts and caps */
BC.who = function (seed, o) {
  const R = RNG(seed * 4421 + 17), w = K.who(seed), tourist = R() < 0.3;
  w.skin = R.pick([SKIN[0], SKIN[1], SKIN[1], SKIN[2], SKIN[2], SKIN[3], SKIN[4], '#EFCDB0']);
  w.hair = R() < 0.7 ? R.pick(['#2B2420', '#3D2B1F', '#2B2420', '#5A3A24']) : R.pick(HAIR);
  w.top = R.pick(BC_TOPS); w.bot = R.pick(BC_BOTS); w.bare = R() < 0.6; w.cap = undefined;
  w.shorts = tourist ? R() < 0.7 : R() < 0.15;
  if (R() < 0.18) w.dress = R.pick(['#E7A9A0', '#F3F1EA', '#4F8FBF', '#E6C24F', '#2F3A4F', '#C9584B', '#8FBF73']);
  if (tourist && R() < 0.35) w.cap = R.pick(['#F3F1EA', '#3F5F8F', '#C9584B', '#E6C24F']);
  if (R() < 0.18) w.glasses = true;
  if (R() < 0.1) w.bag = R.pick(['#E9DFC6', '#C9584B', '#3F5F8F']);
  if (tourist && R() < 0.15) w.sunhat = true;
  return Object.assign(w, o || {});
};
/* a casteller: the colla's shirt, white trousers, the black faixa wound round the waist, a red-and-white mocador */
BC.casteller = function (seed, o) {
  const R = RNG(seed * 811 + 3), w = BC.who(seed);
  return Object.assign(w, { top: o && o.shirt || '#C9392E', bot: '#F3F1EA', shoe: '#F3F1EA', bare: false, shorts: false, dress: undefined, cap: undefined, sunhat: false, bag: undefined, glasses: false, faixa: true, mocador: R() < 0.6, hairStyle: R.pick(['short', 'short', 'buzz', 'pony', 'bun', 'short', 'curly']) }, o || {});
};
/* K.person plus Barcelona extras on the returned points */
BC.person = function (g, x, y, z, w) {
  const r = K.person(g, x, y, z, w), k = w.k || 1, sp = r.shoulders, hp = r.hip, back = (w.dir | 0) >= 2;
  if (w.faixa && sp && hp) {
    const mx = (sp[0][0] + sp[1][0]) / 2, top = lerp(sp[0][1], hp[1], 0.7), bot = hp[1] + 0.6 * k, hw = 2.2 * k;
    g.fill2([[mx - hw, top], [mx + hw, top], [mx + hw * 1.02, bot], [mx - hw * 1.02, bot]], '#2A2622', true);
  }
  if (w.helmet && r.crown) { const c = r.crown; g.fill2(arcPts(c[0], c[1] + 1.5 * k, 2.25 * k, Math.PI, TAU, 9).concat([[c[0] + 2.25 * k, c[1] + 2.2 * k], [c[0] - 2.25 * k, c[1] + 2.2 * k]]), '#F6F3EA', true); g.line2(arcPts(c[0], c[1] + 1.5 * k, 2.25 * k, Math.PI, TAU, 9), { w: 0.25, c: '#8C8576', boil: false }); }
  else if (w.mocador && r.crown) { const c = r.crown; g.fill2([[c[0] - 2.1 * k, c[1] + 1.6 * k], [c[0] + 2.1 * k, c[1] + 1.6 * k], [c[0] + 1.9 * k, c[1] + 0.6 * k], [c[0] - 1.9 * k, c[1] + 0.6 * k]], '#C9392E', true); g.segs2([c[0] - 1.6 * k, c[1] + 1.1 * k, c[0] - 0.8 * k, c[1] + 1.1 * k, c[0] + 0.2 * k, c[1] + 1.1 * k, c[0] + 1.0 * k, c[1] + 1.1 * k], '#F6F3EA', 0.3 * k); }
  if (w.sunhat && r.crown) { const c = r.crown; g.fill2(arcPts(c[0], c[1] + 1.8 * k, 3.6 * k, 0, TAU, 12).map((q) => [q[0], c[1] + 1.8 * k + (q[1] - c[1] - 1.8 * k) * 0.3]), '#E9D29A', true); g.fill2(arcPts(c[0], c[1] + 1.6 * k, 1.9 * k, Math.PI, TAU, 7), '#E2C47F', true); }
  if (w.bag && sp && !back) { const s = sp[1], a = [s[0] - 0.4, s[1] + 3.4 * k]; g.fill2([[a[0] - 1.3 * k, a[1]], [a[0] + 1.3 * k, a[1]], [a[0] + 1.5 * k, a[1] + 3.2 * k], [a[0] - 1.5 * k, a[1] + 3.2 * k]], w.bag, true); g.segs2([s[0], s[1], a[0], a[1]], shade(w.bag, 0.4), 0.3); }
  if (w.phone) { const hd = r.hands[0]; g.fill2([[hd[0] - 0.5, hd[1] - 1.3], [hd[0] + 0.5, hd[1] - 1.3], [hd[0] + 0.5, hd[1] + 0.2], [hd[0] - 0.5, hd[1] + 0.2]], '#2A2622', true); }
  if (w.fan) { const hd = r.hands[0]; g.fill2(arcPts(hd[0], hd[1], 2.4 * k, -Math.PI * 0.95, -Math.PI * 0.35, 6).concat([hd]), w.fan, true); }
  return r;
};
/* a walker on a closed route (BC.person, so the extras show) */
BC.walker = function (T, who, pts, speed, o) {
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
    draw(g, st) { BC.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); if (o.extra) o.extra(g, st); } });
};
/* a crowd bust (queues, spectators, bus passengers) */
BC.bust2 = function (g, p, w, k) {
  k = k || 1; const s = (u, v) => [p[0] + u * k, p[1] + v * k];
  g.fill2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], w.top, true);
  g.fill2([s(-0.55, -4.6), s(0.55, -4.6), s(0.5, -5.8), s(-0.5, -5.8)], shade(w.skin, 0.12), true);
  g.disc2(s(0, -7.6), 1.95 * k, w.skin); g.fill2(K.curve([s(-2.05, -7.2), s(-1.9, -8.9), s(0, -9.75), s(1.9, -8.9), s(2.05, -7.3), s(1.2, -8.2), s(-1.0, -8.25)], 2, true), w.hair, true);
  g.disc2(s(-0.6, -7.4), 0.22 * k, '#2A2420'); g.disc2(s(0.65, -7.4), 0.2 * k, '#2A2420');
  g.outline2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], { w: 0.35, c: '#3A3128', boil: false });
};
/* a facing (0..3) from a heading angle */
BC.dirOf = (ca, sa) => (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2);

/* ---------------- vehicles ---------------- */
/* a small Barcelona car: a low body, a short glasshouse set back, wheels in dark arches. o.roof(g, cab), o.side(g, B) */
BC.car = function (g, ang, o) {
  o = o || {}; const col = o.col || '#C9584B', L = o.L || 4.3, Wd = o.W || 2.1, ca = Math.cos(ang), sa = Math.sin(ang);
  const tone = { t: shade(col, -0.2), l: col, r: shade(col, 0.15) };
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  const wu = [-L * 0.62, L * 0.6];
  K.wheels(g, sh, wu, 0.8, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.6, 2.2, tone, { w: 0.8, top: o.bonnet });
  for (const f of ['pu', 'nu']) if (B.vis[f]) g.fill(B.quad(f, -1, 1, 0.6, 0.95), shade(col, 0.32));
  if (o.side) o.side(g, B);
  for (const f of ['pv', 'nv']) if (B.vis[f]) { const s = B.quad(f, 0.0, 0.0, 0.75, 2.15); g.line([s[0], s[3]], { w: 0.28, c: shade(col, 0.35), boil: false, ext: 0 }); }
  K.wheels(g, sh, wu, 0.8, 'near', { arch: shade(col, 0.6) });
  K.lights(g, B, 1.25);
  const off = -L * 0.14, cab = K.rbox(g, off * ca, off * sa, L * 0.52, Wd - 0.25, ang, 2.2, 3.6, o.cabTone || tone, { nb: true, w: 0.7 });
  K.rwin(g, cab, 'pv', -0.84, -0.06, 2.35, 3.45); K.rwin(g, cab, 'pv', 0.06, 0.84, 2.35, 3.45);
  K.rwin(g, cab, 'nv', -0.84, -0.06, 2.35, 3.45); K.rwin(g, cab, 'nv', 0.06, 0.84, 2.35, 3.45);
  K.rwin(g, cab, 'pu', -0.8, 0.8, 2.35, 3.45); K.rwin(g, cab, 'nu', -0.8, 0.8, 2.35, 3.45);
  if (o.roof) o.roof(g, cab);
};
/* a Barcelona taxi: black, with yellow doors, the green LLIURE light on the roof */
BC.taxi = function (g, ang) {
  BC.car(g, ang, { col: '#2B2D2F', L: 4.5, W: 2.2, cabTone: { t: '#2F3133', l: '#E8BE34', r: '#C9A22A' },
    side: (gg, B) => { for (const f of ['pv', 'nv']) if (B.vis[f]) gg.fill(B.quad(f, -0.42, 0.36, 0.75, 2.2), f === 'pv' ? '#EDC23A' : '#CDA42C'); },
    roof: (gg, cab) => { K.rbox(gg, cab.cx, cab.cy, 0.42, 0.95, ang + Math.PI / 2, 3.6, 4.15, { t: '#9FDCA0', l: '#7CC47E', r: '#5FA862' }, { w: 0.4 }); } });
};
/* the red TMB bus */
BC.bus = function (g, ang) { K.bus(g, ang, { col: '#E25646', band: '#B93A2F', L: 6.6, W: 2.45, h: 5.6, n: 5 }); };
BC.van = function (g, ang, col) { K.bus(g, ang, { col: col || '#F1EFE8', band: '#8FA3B5', L: 4.6, W: 2.2, h: 4.8, n: 2 }); };
/* the open-top tourist bus: a red lower deck, the open upper deck with rows of tourists */
BC.tourBus = function (g, ang, seed) {
  const ca = Math.cos(ang), sa = Math.sin(ang), L = 6.8, Wd = 2.45;
  K.bus(g, ang, { col: '#D8443A', band: '#2F5A8C', L, W: Wd, h: 5.2, n: 5 });
  const B = K.rbox(g, 0, 0, L, Wd, ang, 5.2, 5.25, { t: '#C9C4B8', l: '#D8443A', r: '#B93A2F' }, { w: 0.5, line: false });
  const rows = []; for (let u = -L + 1.4; u < L - 1.0; u += 1.5) for (const v of [-0.9, 0.9]) rows.push([u, v]);
  rows.sort((p, q) => (p[0] * ca - p[1] * sa + p[0] * sa + p[1] * ca) - (q[0] * ca - q[1] * sa + q[0] * sa + q[1] * ca));
  for (const [u, v] of rows) { const i = Math.round(u * 3 + v * 7 + (seed || 0)); if (h1(i * 17) < 0.2) continue; BC.bust2(g, g.p(u * ca - v * sa, u * sa + v * ca, 5.2), BC.who(i + 300 + (seed || 0)), 0.6); }
  for (const f of ['pv', 'nv']) if (B.vis[f]) { const q = B.quad(f, -1, 1, 5.2, 6.4); g.fill([q[0], q[1], q[2], q[3]], 'rgba(216,68,58,0.85)'); g.outline(q, { w: 0.4, boil: false }); }
  for (const f of ['pu', 'nu']) if (B.vis[f]) { const q = B.quad(f, -1, 1, 5.2, 6.4); g.fill(q, 'rgba(201,57,46,0.85)'); }
};
/* a scooter with its rider */
BC.scooter = function (g, ang, who, col) {
  col = col || '#E9E2CC'; const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z);
  const wheel = (u) => { const pts = []; for (let i = 0; i < 14; i++) { const t = TAU * i / 14; pts.push(pt(u + Math.cos(t) * 0.85, 0, 0.85 + Math.sin(t) * 0.85)); } g.fill2(pts, '#3A3632', true); g.disc2(pt(u, 0, 0.85), 0.35, '#B9B4A8'); };
  wheel(-1.7); wheel(1.9);
  const body = [pt(-2.4, 0, 1.0), pt(-0.6, 0, 1.0), pt(0.4, 0, 0.9), pt(1.2, 0, 1.2), pt(1.5, 0, 3.6), pt(1.9, 0, 3.9), pt(1.1, 0, 3.9), pt(0.7, 0, 1.9), pt(-0.6, 0, 2.2), pt(-2.0, 0, 2.6), pt(-2.6, 0, 2.0)];
  g.fill2(body, col, true); g.line2(body, { w: 0.45, c: shade(col, 0.55), close: true, boil: false, wob: 0.2 });
  const bar = pt(1.7, 0, 4.2); g.line2([pt(1.7, -0.8, 4.2), pt(1.7, 0.8, 4.2)], { w: 0.5, c: '#3A3530', boil: false, ext: 0 });
  if (!who) return;
  const d = BC.dirOf(ca, sa), kk = 0.88, F = pt(-1.1, 0, 2.6), rel = (q) => [(q[0] - F[0]) / kk, (q[1] - F[1]) / kk];
  const r = K.person(g, -1.1 * ca, -1.1 * sa, 2.6, Object.assign({}, who, { dir: d, pose: 'sit', k: kk, reach: rel(bar), pedal: [rel(pt(0.6, 0.4, 1.1)), rel(pt(0.4, -0.4, 1.1))] }));
  if (r.crown) { const c = r.crown; g.fill2(arcPts(c[0], c[1] + 1.4, 2.4, Math.PI, TAU, 8).concat([[c[0] + 2.4, c[1] + 2.4], [c[0] - 2.4, c[1] + 2.4]]), who.helmet || '#F3F1EA', true); }
};
/* a Bicing bike (white and red) with its rider */
BC.bicing = function (g, ang, who, seed) { K.bike(g, ang, { col: '#D8443A', who, seed }); };

/* ---------------- boats ---------------- */
/* a golondrina: the white double-decked harbour boat, with people on the open top deck */
BC.golondrina = function (g, ang, seed) {
  const ca = Math.cos(ang), sa = Math.sin(ang), L = 7.2, Wd = 2.3;
  K.boat(g, ang, { kind: 'motor', L, W: Wd, hull: '#F4F1E8', stripe: '#2F6A8C', deck: '#C9B48C', stack: false });
  const B = K.rbox(g, -L * 0.1 * ca, -L * 0.1 * sa, L * 0.62, Wd * 0.8, ang, 2.6, 2.7, { t: '#E9E2CF', l: '#F3EFE3', r: '#DCD4C0' }, { w: 0.5 });
  const rows = []; for (let u = -L * 0.6; u < L * 0.45; u += 1.4) for (const v of [-0.8, 0.8]) rows.push([u - L * 0.1, v]);
  rows.sort((p, q) => (p[0] * (ca + sa) + p[1] * (ca - sa)) - (q[0] * (ca + sa) + q[1] * (ca - sa)));
  for (const [u, v] of rows) { const i = Math.round(u * 5 + v * 3 + (seed || 0) * 11); if (h1(i * 13) < 0.3) continue; BC.bust2(g, g.p(u * ca - v * sa, u * sa + v * ca, 2.7), BC.who(i + 500), 0.55); }
  for (const f of ['pv', 'nv']) if (B.vis[f]) { const q = B.quad(f, -1, 1, 2.7, 3.5); g.line([q[3], q[2]], { w: 0.4, c: '#2F6A8C', boil: false }); }
};

/* ---------------- a block's pavement ---------------- */
/* What stands on the pavement ring round a place (planted by the place, so it sorts with its buildings): plane trees
   near the kerb along the four sides, a lamp on each chamfer, and the chamfer furniture.
   o: { skip: { 'y+': [[a0, a1], ...], ... } stretches without trees (in front of a landmark), corners: { pp, pn, np, nn }
        with 'bins' | 'motos' | 'bicing' | 'kiosk' | 'lamp' | null, palms: true (the seafront side x+ gets palms),
        noTrees: ['x+', ...], seed } */
BC.block = function (T, o) {
  // Only the sides and corners that lie behind the traffic: trees on the place's near sides (the far pavements of
  // the streets in front of it) and furniture on its near corner (the far corner of that crossing). A tree or a lamp in
  // front of a lane becomes a sprite that only some of the cars beside each other overlap, which can draw a car in the
  // far lane over its neighbour in the near lane; things behind the traffic never do.
  o = o || {}; const skip = o.skip || {}, no = (o.noTrees || []).concat(['y-', 'x-']), seed = o.seed || Math.round(T.cx * 3 + T.cy * 7 + 500);
  const sides = { 'y-': (a) => [a, -41.2], 'y+': (a) => [a, 41.2], 'x-': (a) => [-41.2, a], 'x+': (a) => [41.2, a] };
  for (const s in sides) {
    if (no.indexOf(s) >= 0) continue;
    if (s === 'x+' && T.cx === 100) continue;
    for (const a of [-23, -12, -1, 10, 21]) {
      if ((skip[s] || []).some(([a0, a1]) => a > a0 && a < a1)) continue;
      const [x, y] = sides[s](a + (h1(seed + a * 7) - 0.5) * 1.4);
      T.obj([x, y], (g) => BC.plane(g, x, y, { r: 3.7 + h1(seed * 3 + a) * 0.9, h: 6.0 + h1(seed + a) * 0.8 }), { name: 'plane tree' });
    }
  }
  if (o.palms) for (let a = -33; a <= 33; a += 11) { const x = 45.6, y = a + 2; T.obj([x, y], (g) => K.palm(g, x, y, { h: 13 + h1(seed + a) * 3, r: 4.6, lean: (h1(seed * 5 + a) - 0.5) * 0.8 }), { name: 'palm' }); }
  const C4 = o.corners || {};
  const at = { pp: [1, 1], pn: [1, -1], np: [-1, 1], nn: [-1, -1] };
  for (const k in at) {
    const [sx, sy] = at[k], kind = C4[k]; if (kind === undefined && o.corners) continue;
    // see above: the near corner carries the furniture and the lamp; the side corners only low things; the far none
    if (k === 'nn' || (k !== 'pp' && kind !== 'bins' && kind !== 'motos')) continue;
    const cx = sx * 34.4, cy = sy * 34.4;
    if (k === 'pp' && kind !== 'none' && !(T.cx === 100 && sx > 0)) { const lx = sx * 38.3, ly = sy * 38.3; T.obj([lx, ly], (g) => BC.lamp(g, lx, ly, { side: sx === sy ? (sx > 0 ? 1 : -1) : sx })); }
    if (kind === 'bins') { const ax = (k === 'pp' || k === 'nn') ? 'x' : 'y'; T.obj(ax === 'x' ? [cx - 3.8, cy - 1, cx + 3.8, cy + 1] : [cx - 1, cy - 3.8, cx + 1, cy + 3.8], (g) => BC.bins(g, cx, cy, ax, 3), { name: 'bins' }); }
    else if (kind === 'bicing') { const ax = (k === 'pp' || k === 'nn') ? 'y' : 'x'; T.obj(ax === 'x' ? [cx - 3.5, cy - 1, cx + 3.5, cy + 1] : [cx - 1, cy - 3.5, cx + 1, cy + 3.5], (g) => BC.bicingDock(g, cx, cy, 4, ax), { name: 'bicing' }); }
    else if (kind === 'motos') { const ax = (k === 'pp' || k === 'nn') ? 'x' : 'y'; T.obj(ax === 'x' ? [cx - 4.5, cy - 1.5, cx + 4.5, cy + 1.5] : [cx - 1.5, cy - 4.5, cx + 1.5, cy + 4.5], (g) => BC.motoRow(g, cx, cy, 5, ax, seed + cx), { name: 'motos' }); }
    else if (kind === 'kiosk') T.obj([cx - 2.5, cy - 2.5, cx + 2.5, cy + 2.5], (g) => BC.kiosk(g, cx, cy), { name: 'kiosk' });
  }
};
/* the ground of a place: its octagon (half 37, chamfer 10) at z 0, a top colour, a rim; cut: the sides that are the
   map's outer edge ('y' near-left) show the section like the streets' cut edge */
BC.ground = function (g, top, o) {
  o = o || {}; const P = BC.oct(0, 0, 37, 10).map((p) => [p[0], p[1], 0]);
  g.fill(P, top); g.outline(P, { w: 0.85, boil: false });
};
