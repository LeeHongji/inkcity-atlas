'use strict';
/* Paris's own kit: Haussmann blocks (limestone, balconies, zinc mansards with dormers and chimney pots), café
   terraces (red awnings, round tables, wicker chairs facing the street, a waiter), street furniture (plane trees in
   early autumn, Wallace fountains, Morris columns, Guimard Métro entrances, kiosks, lamps, Vélib' docks, bouquinistes'
   boxes), Parisians, vehicles (small cars, taxis, scooters, the green-and-white bus, Vélib'), the segmented
   bateau-mouche. Everything in tile-local u unless the name ends in 2 (wide px).
   Map orientation: north is +x (lower right), west is -y (upper right). The Seine runs along y in the channel x = -50. */
const PA = {};
const PC = {
  stone: '#F0E6D0', stoneR: '#DDCFB2', stoneT: '#F6EFDF', groove: '#CDBE9E', sill: '#F8F3E6',
  zinc: '#8D99A6', zincL: '#A7B1BC', zincD: '#6F7C89', seam: '#76838F',
  iron: '#2E3332', green: '#2F5D4B', greenL: '#45775F', greenD: '#21443A',
  awn: '#B8443A', awnD: '#8E3029', pane: '#5B6873', paneL: '#7D8B96',
  pave: '#E6E0D2', paveD: '#D7CFBE', asph: '#D0CBC0', cobble: '#D8CEBB',
  water: '#9DBDBC', waterD: '#7FA2A3', waterL: '#C2D8D3', quai: '#D9CEB6', quaiD: '#C2B596', quaiL: '#E6DDCA',
  gravel: '#EADFC4', gravelD: '#D8C9A4', lawn: '#B9CC8C', lawnD: '#9FB873',
  plane: '#AFC26A', planeY: '#DCC45E', planeO: '#D2904A', planeInk: '#6B7638',
  gold: '#D8AE48', goldD: '#A9832C', slate: '#5F6670', brick: '#B7614A', brickD: '#94493A',
};
const RIVER = { X0: -63, X1: -37, WZ: -5.6, LQ: 3.4, LQZ: -4.4 };   // the Seine's channel (world x), water level, lower quai

/* ---------------- lettering ---------------- */
/* real words on signs (pseudo-letters read as misspellings once you zoom in). A row centred on wide-px c along the
   face direction dir, cap height h, shrunk to fit width w. word: a string, or a number that picks a shop name. */
PA.SHOPS = ['BOULANGERIE', 'PHARMACIE', 'FROMAGERIE', 'LIBRAIRIE', 'FLEURS', 'TABAC', 'PÂTISSERIE', 'ÉPICERIE', 'CHOCOLATIER',
  'BOUCHERIE', 'OPTICIEN', 'CAVE À VINS', 'PRESSE', 'MODES', 'BIJOUX', 'GALERIE'];
PA.CAFES = ['CAFÉ', 'BRASSERIE', 'BISTROT', 'LE SELECT', 'CAFÉ DU COIN', 'LE ZINC', 'BAR TABAC', 'LA ROTONDE'];
PA.letters2 = function (g, c, w, h, col, word, wt, dir) {
  const s = (typeof word === 'string' ? word : PA.SHOPS[Math.floor(h1(Math.abs(Math.round(word || 0)) * 7 + 3) * PA.SHOPS.length) % PA.SHOPS.length]).toUpperCase();
  const hh = Math.min(h, w / K.textW(s, 1)), u = hh / 6, d = dir || [1, 0], segs = [];
  let a = -K.textW(s, hh) / 2;
  for (const ch of s) {
    const gl = K.FONT[ch];
    if (gl) for (const pl of gl) for (let i = 0; i + 3 < pl.length; i += 2) {
      const x0 = a + pl[i] * u, y0 = hh / 2 - pl[i + 1] * u, x1 = a + pl[i + 2] * u, y1 = hh / 2 - pl[i + 3] * u;
      segs.push(c[0] + x0 * d[0], c[1] + x0 * d[1] + y0, c[0] + x1 * d[0], c[1] + x1 * d[1] + y1);
    }
    a += 5.5 * u;
  }
  g.segs2(segs, col, Math.max(0.18, Math.min(wt || hh * 0.16, hh * 0.2)));
};
PA.dirOf = (face) => (face === 'L' ? [0.878, 0.478] : face === 'R' ? [0.878, -0.478] : [1, 0]);
/* a sign board on a face with a row of letters */
PA.sign = function (g, face, p, a0, a1, z0, z1, col, o) {
  o = o || {}; const q = K.on(face, p + 0.06, a0, a1, z0, z1);
  g.fill(q, col); if (o.line !== false) g.outline(q, { w: 0.4, c: shade(col, 0.5), boil: false, ext: 0 });
  const c = g.p.apply(g, K.pt(face, p + 0.08, (a0 + a1) / 2, (z0 + z1) / 2)), L = Math.abs(a1 - a0) * SX * 0.5 * 0.8;
  PA.letters2(g, [c[0], c[1]], L, (z1 - z0) * VZ * 0.55, o.ink || '#F6F1E4', o.word || o.seed || 1, 0, PA.dirOf(face));
};

/* ---------------- facades ---------------- */
/* a tall French window on a face: pale stone surround, blue-grey panes, a white cross bar. o.rail: a little iron rail */
PA.win = function (g, face, p, a0, a1, z0, z1, o) {
  o = o || {};
  if (o.surround !== false) g.fill(K.on(face, p + 0.02, a0 - 0.22, a1 + 0.22, z0 - 0.15, z1 + 0.3), o.sc || PC.sill);
  const q = K.on(face, p + 0.04, a0, a1, z0, z1), P = g.P(q);
  g.fill2(P, o.pane || PC.pane);
  const m = g.P([K.pt(face, p + 0.05, (a0 + a1) / 2, z0), K.pt(face, p + 0.05, (a0 + a1) / 2, z1), K.pt(face, p + 0.05, a0, z1 - (z1 - z0) * 0.3), K.pt(face, p + 0.05, a1, z1 - (z1 - z0) * 0.3)]);
  g.segs2([m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1], m[3][0], m[3][1]], '#E9E2D2', 0.32);
  g.segs2([P[0][0], P[0][1], P[1][0], P[1][1], P[1][0], P[1][1], P[2][0], P[2][1], P[2][0], P[2][1], P[3][0], P[3][1], P[3][0], P[3][1], P[0][0], P[0][1]], '#4A443B', 0.3);
  if (o.rail) {   // balconnet: a low iron rail across the lower part of the window
    const r0 = g.P([K.pt(face, p + 0.25, a0 - 0.1, z0 + 0.9), K.pt(face, p + 0.25, a1 + 0.1, z0 + 0.9)]), segs = [r0[0][0], r0[0][1], r0[1][0], r0[1][1]];
    for (let i = 0; i <= 4; i++) { const t = i / 4, a = lerp(a0 - 0.1, a1 + 0.1, t), b = g.P([K.pt(face, p + 0.25, a, z0), K.pt(face, p + 0.25, a, z0 + 0.9)]); segs.push(b[0][0], b[0][1], b[1][0], b[1][1]); }
    g.segs2(segs, PC.iron, 0.3);
  }
};
/* a continuous wrought-iron balcony on a stone ledge along a face from a0 to a1 at height z */
PA.balcony = function (g, face, p, a0, a1, z, o) {
  o = o || {}; const out = o.out || 0.7;
  const L = face === 'L' ? [a0 - 0.2, p, a1 + 0.2, p + out] : [p, a0 - 0.2, p + out, a1 + 0.2];
  K.box(g, L[0], L[1], L[2], L[3], z - 0.35, z, { t: PC.stoneT, l: PC.sill, r: PC.stoneR }, { w: 0.45, boil: false, nohid: true });
  const fr = face === 'L' ? (a, zz) => g.p(a, p + out - 0.05, zz) : (a, zz) => g.p(p + out - 0.05, a, zz);
  const segs = [], n = Math.max(2, Math.round((a1 - a0) / 0.42));
  for (let i = 0; i <= n; i++) { const a = lerp(a0 - 0.1, a1 + 0.1, i / n), b = fr(a, z), c = fr(a, z + 1.0); segs.push(b[0], b[1], c[0], c[1]); }
  g.segs2(segs, PC.iron, 0.26);
  const t0 = fr(a0 - 0.15, z + 1.0), t1 = fr(a1 + 0.15, z + 1.0), m0 = fr(a0 - 0.15, z + 0.3), m1 = fr(a1 + 0.15, z + 0.3);
  g.segs2([t0[0], t0[1], t1[0], t1[1], m0[0], m0[1], m1[0], m1[1]], PC.iron, 0.42);
  // the return at the visible end
  const e = face === 'L' ? [g.p(a1 + 0.15, p, z + 1.0), g.p(a1 + 0.15, p + out, z + 1.0)] : [g.p(p, a1 + 0.15, z + 1.0), g.p(p + out, a1 + 0.15, z + 1.0)];
  g.segs2([e[0][0], e[0][1], e[1][0], e[1][1]], PC.iron, 0.4);
};
/* a zinc mansard over the box [x0,y0,x1,y1] at height z: a steep lower slope with standing seams and dormers, a low
   top, chimney stacks with terracotta pots on the party walls. o: { h, d, dormers: spacing, col, chim: [[x, y, 'x'|'y'], ...] } */
PA.mansard = function (g, x0, y0, x1, y1, z, o) {
  o = o || {}; const h = o.h || 2.8, d = o.d || 1.15, col = o.col || PC.zinc, zt = z + h, h2 = o.h2 == null ? 0.7 : o.h2;
  const ink = shade(col, 0.55);
  const Lf = [[x0, y1, z], [x1, y1, z], [x1 - d, y1 - d, zt], [x0 + d, y1 - d, zt]];
  const Rf = [[x1, y1, z], [x1, y0, z], [x1 - d, y0 + d, zt], [x1 - d, y1 - d, zt]];
  g.fill(Lf, shade(col, -0.08)); g.fill(Rf, shade(col, 0.12));
  // standing seams down both slopes
  const segs = [], sp = o.sp || 0.75;
  for (let a = x0 + sp * 0.6; a < x1 - 0.2; a += sp) { const t = (a - x0) / (x1 - x0), ta = lerp(x0 + d, x1 - d, t), p0 = g.p(a, y1, z), p1 = g.p(ta, y1 - d, zt); segs.push(p0[0], p0[1], p1[0], p1[1]); }
  for (let a = y0 + sp * 0.6; a < y1 - 0.2; a += sp) { const t = (a - y0) / (y1 - y0), ta = lerp(y0 + d, y1 - d, t), p0 = g.p(x1, a, z), p1 = g.p(x1 - d, ta, zt); segs.push(p0[0], p0[1], p1[0], p1[1]); }
  g.segs2(segs, o.seam || PC.seam, 0.26);
  // the low top (a shallow hip) in a lighter zinc
  const tx0 = x0 + d, ty0 = y0 + d, tx1 = x1 - d, ty1 = y1 - d;
  if (tx1 > tx0 && ty1 > ty0) {
    if (h2 > 0) K.hip(g, tx0, ty0, tx1, ty1, zt, h2, shade(col, -0.18), { ridge: Math.max(0, Math.abs((tx1 - tx0) - (ty1 - ty0)) * 0.92), c: ink, w: 0.6 });
    else { g.fill(K.rect(tx0, ty0, tx1, ty1, zt), shade(col, -0.2)); g.outline(K.rect(tx0, ty0, tx1, ty1, zt), { w: 0.55, c: ink, boil: false }); }
  }
  g.line([[x0, y1, z], [x1, y1, z], [x1, y0, z]], { w: 0.8, c: ink });
  g.line([[x1, y1, z], [x1 - d, y1 - d, zt]], { w: 0.55, c: ink, boil: false });
  g.line([[x0, y1, z], [x0 + d, y1 - d, zt]], { w: 0.5, c: ink, boil: false });
  g.line([[x1, y0, z], [x1 - d, y0 + d, zt]], { w: 0.5, c: ink, boil: false });
  // dormers: a little stone front with a window and a curved cap, standing on the lower slope
  const dsp = o.dormers || 2.6;
  if (dsp > 0) {
    const dorm = (face, a, base) => {
      const w = 0.62, p = base, z0 = z + 0.55, z1 = z + 2.15;
      const fr = K.on(face, p, a - w, a + w, z0, z1);
      // the dormer's side cheek (the face towards +x or +y we see)
      if (face === 'L') g.fill([[a + w, p, z0], [a + w, p - 0.55, z0 + 0.6], [a + w, p - 0.55, z1 + 0.35], [a + w, p, z1]], shade(col, 0.15));
      else g.fill([[p, a + w, z0], [p - 0.55, a + w, z0 + 0.6], [p - 0.55, a + w, z1 + 0.35], [p, a + w, z1]], shade(col, -0.02));
      g.fill(fr, PC.sill);
      g.fill(K.on(face, p + 0.03, a - w + 0.22, a + w - 0.22, z0 + 0.2, z1 - 0.15), PC.pane);
      const cap = []; for (let k = 0; k <= 6; k++) { const t = Math.PI * k / 6; cap.push(K.pt(face, p + 0.02, a + Math.cos(t) * (w + 0.12), z1 + Math.sin(t) * 0.55)); }
      g.fill(cap, PC.sill); g.outline(fr.concat([]), { w: 0.35, c: '#7A6E58', boil: false, ext: 0 });
      g.line(cap, { w: 0.35, c: '#7A6E58', boil: false, ext: 0 });
    };
    const nL = Math.max(1, Math.floor((x1 - x0 - 1.4) / dsp)), offL = (x1 - x0 - (nL - 1) * dsp) / 2;
    for (let i = 0; i < nL; i++) dorm('L', x0 + offL + i * dsp, y1 - 0.5);
    const nR = Math.max(1, Math.floor((y1 - y0 - 1.4) / dsp)), offR = (y1 - y0 - (nR - 1) * dsp) / 2;
    for (let i = 0; i < nR; i++) dorm('R', y0 + offR + i * dsp, x1 - 0.5);
  }
  // chimney stacks with pots
  for (const c of o.chim || []) PA.chimney(g, c[0], c[1], zt + h2 * 0.4, c[2] || 'x', c[3] || 3);
  return zt + h2;
};
/* a chimney stack: a stucco slab along the party wall with a row of terracotta pots */
PA.chimney = function (g, x, y, z, ax, n) {
  const L = 0.3 + n * 0.36, W = 0.38, b = ax === 'x' ? [x - L, y - W, x + L, y + W] : [x - W, y - L, x + W, y + L];
  K.box(g, b[0], b[1], b[2], b[3], z - 0.4, z + 1.3, { t: '#B9A688', l: '#CDB896', r: '#B29E7E' }, { w: 0.45, boil: false, nohid: true });
  for (let i = 0; i < n; i++) {
    const u = n === 1 ? 0 : -L + 0.36 + i * (2 * L - 0.72) / (n - 1), c = ax === 'x' ? g.p(x + u, y, z + 1.3) : g.p(x, y + u, z + 1.3);
    g.fill2([[c[0] - 0.6, c[1]], [c[0] + 0.6, c[1]], [c[0] + 0.5, c[1] - 2.4], [c[0] - 0.5, c[1] - 2.4]], '#C9734F', true);
    g.fill2([[c[0] + 0.05, c[1]], [c[0] + 0.6, c[1]], [c[0] + 0.5, c[1] - 2.4], [c[0] + 0.05, c[1] - 2.4]], '#A85C3E', true);
    g.fill2([[c[0] - 0.65, c[1] - 2.4], [c[0] + 0.65, c[1] - 2.4], [c[0] + 0.65, c[1] - 2.8], [c[0] - 0.65, c[1] - 2.8]], '#8E4A32', true);
  }
};
/* a Haussmann building: a limestone box, rusticated ground floor (shops, a carriage door), étages with tall windows,
   continuous balconies on the 2nd and 5th, little rails elsewhere, a cornice, a zinc mansard.
   d: { x0,y0,x1,y1, et (étages, default 5), sh (storey), rdc (ground floor), bay, faces 'LR', shopsL / shopsR:
        [[a0, a1, colour, kind: 'shop'|'cafe'|'door'|'glass']], mans: {...}, chim, col, noRoof } */
PA.haus = function (g, d) {
  const bp = g.boilP; g.boilP = 0.25;
  const { x0, y0, x1, y1 } = d, et = d.et == null ? 5 : d.et, sh = d.sh || 3.2, rdc = d.rdc || 4.6, bay = d.bay || 2.5;
  const H = rdc + et * sh, col = d.col || PC.stone, tone = { t: PC.stoneT, l: col, r: shade(col, 0.09) };
  K.box(g, x0, y0, x1, y1, 0, H, tone, { w: 0.9 });
  const faces = d.faces || 'LR';
  for (const face of ['L', 'R']) {
    if (faces.indexOf(face) < 0) continue;
    const p = face === 'L' ? y1 : x1, A0 = face === 'L' ? x0 : y0, A1 = face === 'L' ? x1 : y1;
    // rustication: grooves across the ground floor
    const gr = [];
    for (let z = 0.9; z < rdc - 0.2; z += 0.85) { const a = g.p.apply(g, K.pt(face, p + 0.01, A0, z)), b = g.p.apply(g, K.pt(face, p + 0.01, A1, z)); gr.push(a[0], a[1], b[0], b[1]); }
    g.segs2(gr, PC.groove, 0.3);
    const nb = Math.max(1, Math.round((A1 - A0) / bay)), bw = (A1 - A0) / nb, mids = [];
    for (let i = 0; i < nb; i++) mids.push(A0 + bw * (i + 0.5));
    // ground floor: shops and doors
    const shops = d['shops' + face] || [];
    for (const [s0, s1, sc, kind] of shops) PA.shop(g, face, p, s0, s1, rdc, sc, kind || 'shop', d.seed || Math.round(s0 * 7 + p));
    for (const m of mids) {
      if (shops.some((s) => m > s[0] - 0.6 && m < s[1] + 0.6)) continue;
      PA.win(g, face, p, m - bw * 0.2, m + bw * 0.2, 1.2, rdc - 1.1, { pane: '#6B7782' });
    }
    // a band between the shops and the étages
    g.fill(K.on(face, p + 0.03, A0, A1, rdc - 0.35, rdc), PC.stoneT);
    g.line([K.pt(face, p + 0.04, A0, rdc), K.pt(face, p + 0.04, A1, rdc)], { w: 0.35, c: '#A99A7B', boil: false, ext: 0 });
    // the étages
    for (let k = 1; k <= et; k++) {
      const zb = rdc + (k - 1) * sh, z0 = zb + 0.45, z1 = zb + sh - 0.55 - (k === et ? 0.15 : 0);
      for (const m of mids) PA.win(g, face, p, m - bw * 0.19, m + bw * 0.19, z0, z1, { rail: !(k === 2 || k === et) });
      if (k === 2 || k === et) PA.balcony(g, face, p, A0 + 0.3, A1 - 0.3, zb + 0.4, {});
    }
  }
  // the cornice
  K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, H, H + 0.55, { t: PC.stoneT, l: PC.sill, r: PC.stoneR }, { w: 0.6, nohid: true });
  let top = H + 0.55;
  if (!d.noRoof) top = PA.mansard(g, x0, y0, x1, y1, H + 0.55, Object.assign({ chim: d.chim }, d.mans || {}));
  g.boilP = bp;
  return top;
};
/* a shopfront on the ground floor of a face: painted wooden frame, a fascia with lettering, glass, a door.
   kind 'cafe': a red fascia and wide open glass; 'door': a tall carriage door with an arched head; 'glass': plain glass */
PA.shop = function (g, face, p, a0, a1, rdc, col, kind, seed) {
  if (kind === 'door') {
    const m = (a0 + a1) / 2, w = (a1 - a0) / 2, pts = [K.pt(face, p + 0.04, m - w, 0), K.pt(face, p + 0.04, m + w, 0)];
    for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; pts.push(K.pt(face, p + 0.04, m + Math.cos(t) * w, rdc - 1.0 - w + Math.sin(t) * w)); }
    g.fill(pts, col || '#2F4A3E'); g.outline(pts, { w: 0.45, c: '#2A2622', boil: false });
    const a = g.P([K.pt(face, p + 0.06, m, 0), K.pt(face, p + 0.06, m, rdc - 1.0)]); g.segs2([a[0][0], a[0][1], a[1][0], a[1][1]], '#1E2A24', 0.35);
    const kb = g.p.apply(g, K.pt(face, p + 0.07, m + w * 0.25, 1.6)); g.disc2(kb, 0.35, PC.gold);
    return;
  }
  const fr = K.on(face, p + 0.03, a0, a1, 0, rdc - 0.5);
  g.fill(fr, col);
  const gl = K.on(face, p + 0.05, a0 + 0.3, a1 - 0.3, 0.35, rdc - 1.75);
  g.fill(gl, kind === 'cafe' ? '#E8D6AE' : C.glass);
  if (kind === 'cafe') {   // inside: a warm room, the zinc counter, bottles
    const R = RNG(seed), dots = [];
    for (let i = 0; i < 7; i++) { const c = g.p.apply(g, K.pt(face, p + 0.06, lerp(a0 + 0.6, a1 - 0.6, R()), 1.6 + R() * 0.8)); dots.push(c); }
    for (const c of dots) g.fill2([[c[0] - 0.3, c[1]], [c[0] + 0.3, c[1]], [c[0] + 0.3, c[1] - 1.1], [c[0] - 0.3, c[1] - 1.1]], R.pick(['#5E7E4A', '#8E3A2E', '#D8AE48', '#3A4A5A']), true);
  } else {
    const G = g.P(gl), m = [(G[0][0] + G[2][0]) / 2, (G[0][1] + G[2][1]) / 2], dd = Math.min(2, Math.hypot(G[2][0] - G[0][0], G[2][1] - G[0][1]) * 0.18);
    g.segs2([m[0] - dd * 0.3, m[1] + dd, m[0] + dd * 0.4, m[1] - dd], C.white, 0.55);
    const R = RNG(seed + 3); for (let i = 0; i < 4; i++) { const c = g.p.apply(g, K.pt(face, p + 0.06, lerp(a0 + 0.7, a1 - 0.7, (i + 0.5) / 4), 0.9)); g.fill2([[c[0] - 0.8, c[1]], [c[0] + 0.8, c[1]], [c[0] + 0.8, c[1] - 1.4], [c[0] - 0.8, c[1] - 1.4]], R.pick(['#D98AA4', '#E6C24F', '#7FB7D9', '#C9584B', '#8FBF73', '#F3F1EA']), true); }
  }
  const mul = []; for (let i = 1; i < 3; i++) { const a = lerp(a0 + 0.3, a1 - 0.3, i / 3), q = g.P([K.pt(face, p + 0.06, a, 0.35), K.pt(face, p + 0.06, a, rdc - 1.75)]); mul.push(q[0][0], q[0][1], q[1][0], q[1][1]); }
  g.segs2(mul, shade(col, 0.2), 0.4);
  g.outline(gl, { w: 0.35, c: shade(col, 0.5), boil: false, ext: 0 });
  PA.sign(g, face, p, a0 + 0.15, a1 - 0.15, rdc - 1.6, rdc - 0.65, kind === 'cafe' ? '#7E2A24' : shade(col, 0.15), { seed, word: kind === 'cafe' ? PA.CAFES[seed % PA.CAFES.length] : PA.SHOPS[Math.floor(h1(seed * 31 + Math.round(Math.abs(a0) * 3 + p)) * PA.SHOPS.length)], ink: kind === 'cafe' ? '#F3DFA0' : '#F6F1E4' });
};
/* a red awning (store banne) sloping out from a face, with a scalloped valance and lettering */
PA.awning = function (g, face, p, a0, a1, z, out, o) {
  o = o || {}; const col = o.col || PC.awn, drop = o.drop || 0.9, P = (a, dd, zz) => face === 'L' ? [a, p + dd, zz] : [p + dd, a, zz];
  const q = [P(a0, 0, z), P(a1, 0, z), P(a1, out, z - drop), P(a0, out, z - drop)];
  g.fill(q, col);
  if (o.stripe) { const n = Math.max(2, Math.round(Math.abs(a1 - a0) / 1.0)); for (let i = 0; i < n; i += 2) { const s0 = lerp(a0, a1, i / n), s1 = lerp(a0, a1, (i + 1) / n); g.fill([P(s0, 0, z), P(s1, 0, z), P(s1, out, z - drop), P(s0, out, z - drop)], o.stripe); } }
  const v = [P(a0, out, z - drop), P(a1, out, z - drop), P(a1, out, z - drop - 0.75), P(a0, out, z - drop - 0.75)];
  g.fill(v, shade(col, 0.1));
  const sc = [], n = Math.max(3, Math.round(Math.abs(a1 - a0) / 0.8));
  for (let i = 0; i < n; i++) { const a = lerp(a0, a1, (i + 0.5) / n), c = g.p.apply(g, P(a, out, z - drop - 0.75)); sc.push([c[0], c[1]]); }
  for (const c of sc) g.fill2(arcPts(c[0], c[1], Math.abs(a1 - a0) / n * 1.4, 0, Math.PI, 5), shade(col, 0.1), true);
  const c = g.p.apply(g, P((a0 + a1) / 2, out + 0.02, z - drop - 0.38));
  PA.letters2(g, c, Math.min(Math.abs(a1 - a0) * SX * 0.45, 26), 1.2, o.ink || '#F6EBD0', o.word || PA.CAFES[(o.seed || 7) % PA.CAFES.length], 0.28, PA.dirOf(face));
  g.outline(q, { w: 0.5, c: shade(col, 0.5), boil: false });
  g.line([v[3], v[2]], { w: 0.45, c: shade(col, 0.5), boil: false });
};

/* ---------------- the café terrace ---------------- */
/* a wicker chair (seat at 1.3), the sitter facing the street, and a little round marble table in front with a cup or
   a glass. face: 'L' (street towards +y) or 'R' (towards +x). Drawn as one piece, so the chair never covers its sitter. */
PA.sitter = function (g, x, y, w, face, drink) {
  const fx = face === 'R' ? 1 : 0, fy = face === 'L' ? 1 : 0, dir = face === 'L' ? 1 : 0;
  const back = g.p(x - fx * 0.55, y - fy * 0.55, 1.3), seat = g.p(x, y, 1.3);
  // chair back: woven rattan, an arc
  const bw = 2.0, bk = [[back[0] - bw, back[1]], [back[0] - bw * 0.95, back[1] - 5.6], [back[0], back[1] - 6.6], [back[0] + bw * 0.95, back[1] - 5.6], [back[0] + bw, back[1]]];
  g.fill2(K.curve(bk, 3, false), '#B88E57', true);
  const wv = []; for (let i = 1; i < 5; i++) { const yy = back[1] - i * 1.3; wv.push(back[0] - bw * 0.9, yy, back[0] + bw * 0.9, yy); } g.segs2(wv, '#8E6A3E', 0.3);
  g.line2(K.curve(bk, 3, false), { w: 0.35, c: '#6E4E2C', boil: false, wob: 0.2 });
  const legs = []; for (const dx of [-1.6, 1.4]) legs.push(seat[0] + dx, seat[1], seat[0] + dx * 0.9, seat[1] + 4.4); g.segs2(legs, '#6E4E2C', 0.35);
  g.fill2(arcPts(seat[0], seat[1], 2.0, 0, TAU, 10).map((q) => [q[0], seat[1] + (q[1] - seat[1]) * 0.4]), '#C79E62', true);
  const r = PA.person(g, x, y, 1.3, Object.assign({}, w, { dir, pose: 'sit' }));
  // the table
  const tx = x + fx * 1.25, ty = y + fy * 1.25, tb = g.p(tx, ty, 0), tt = g.p(tx, ty, 2.35);
  g.segs2([tb[0], tb[1], tt[0], tt[1]], '#3A3530', 0.5);
  g.fill2([[tb[0] - 1.1, tb[1]], [tb[0] + 1.1, tb[1]], [tb[0] + 0.6, tb[1] - 0.4], [tb[0] - 0.6, tb[1] - 0.4]], '#3A3530', true);
  const top = arcPts(tt[0], tt[1], 2.4, 0, TAU, 12).map((q) => [q[0], tt[1] + (q[1] - tt[1]) * 0.45]);
  g.fill2(top, '#ECE8DF', true); g.line2(top, { w: 0.35, c: '#7A7468', close: true, boil: false, wob: 0.2 });
  if (drink === 'wine') { g.fill2([[tt[0] - 0.3, tt[1] - 0.2], [tt[0] + 0.3, tt[1] - 0.2], [tt[0] + 0.5, tt[1] - 1.6], [tt[0] - 0.5, tt[1] - 1.6]], '#8E2A36', true); g.segs2([tt[0], tt[1] - 0.2, tt[0], tt[1] + 0.4], '#C9C6BD', 0.25); }
  else if (drink === 'beer') g.fill2([[tt[0] - 0.4, tt[1]], [tt[0] + 0.4, tt[1]], [tt[0] + 0.5, tt[1] - 1.8], [tt[0] - 0.5, tt[1] - 1.8]], '#E3B23C', true);
  else { g.fill2([[tt[0] - 0.55, tt[1]], [tt[0] + 0.55, tt[1]], [tt[0] + 0.5, tt[1] - 0.8], [tt[0] - 0.5, tt[1] - 0.8]], '#FBF8F0', true); g.disc2([tt[0] + 0.8, tt[1] - 0.1], 0.35, '#FBF8F0'); }
  return r;
};
/* a terrace along a face: the awning plus the sitters under it, as one cast object (so the awning covers them), and an
   outer row of sitters in the sun as their own cast objects. Returns the waiter's aisle (a line in front). */
PA.terrace = function (T, face, p, a0, a1, o) {
  o = o || {}; const out = o.out || 2.8, zA = o.z || 5.3, seed = o.seed || 1, sp = o.sp || 2.35;
  const n = Math.max(1, Math.floor((a1 - a0 - 0.6) / sp)), off = (a1 - a0 - (n - 1) * sp) / 2;
  const fp = face === 'L' ? [a0, p, a1, p + out] : [p, a0, p + out, a1];
  const drinks = ['coffee', 'wine', 'coffee', 'beer', 'coffee', 'wine'];
  const row1 = [];
  for (let i = 0; i < n; i++) if (h1(seed * 31 + i) > 0.18) row1.push(i);
  T.cast(fp, function (g) {
    for (const i of row1) { const a = a0 + off + i * sp; PA.sitter(g, face === 'L' ? a : p + 0.9, face === 'L' ? p + 0.9 : a, PA.who(seed * 50 + i), face, drinks[(i + seed) % 6]); }
    PA.awning(g, face, p, a0, a1, zA, out, { col: o.col, stripe: o.stripe, seed, word: o.word });
  }, { name: 'terrace' });
  for (let i = 0; i < n; i++) {
    if (h1(seed * 17 + i + 5) < 0.3) continue;
    const a = a0 + off + i * sp + 0.3, x = face === 'L' ? a : p + 3.9, y = face === 'L' ? p + 3.9 : a;
    T.cast([x, y], (g) => PA.sitter(g, x, y, PA.who(seed * 50 + 20 + i), face, drinks[(i + seed + 3) % 6]), { on: false });
  }
  return { face, p: p + 6.0, a0, a1 };
};
/* the waiter: black waistcoat, white shirt, long white apron, a tray on the near hand; he walks the aisle in front of the
   terrace, stops at a table, and walks back. Pure function of t. */
PA.waiter = function (T, aisle, seed, o) {
  o = o || {}; const { face, p, a0, a1 } = aisle, L = a1 - a0 - 2, v = 1.4, stopT = 2.4, leg = L / v, per = 2 * leg + 2 * stopT;
  const look = { skin: SKIN[1 + (seed % 3)], hair: HAIR[seed % 3], hairStyle: 'short', top: '#2A2622', jacket: '#F6F3EA', bot: '#2A2622', shoe: '#2A2622', bare: false, tie: '#2A2622' };
  T.actor({ sample: 0.25, period: per,
    at(t) {
      const u = ((t + (o.t0 || 0)) % per + per) % per;
      let s, mv = 0, d = 1;
      if (u < leg) { s = u * v; mv = 1; d = 1; } else if (u < leg + stopT) { s = L; d = 1; } else if (u < 2 * leg + stopT) { s = L - (u - leg - stopT) * v; mv = 1; d = -1; } else { s = 0; d = -1; }
      const a = a0 + 1 + s, x = face === 'L' ? a : p, y = face === 'L' ? p : a;
      const dir = face === 'L' ? (d > 0 ? 0 : 2) : (d > 0 ? 1 : 3), facing = mv ? dir : (face === 'L' ? 3 : 2), ph = mv ? Math.floor((s / 2.4) % 1 * 8) : 0;
      return { x, y, key: (mv ? 'w' : 's') + facing + '.' + ph, dir: facing, ph: ph / 8, mv };
    },
    draw(g, st) {
      const r = K.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.mv ? 'walk' : 'stand', ph: st.ph, hands: [[3.2, -15.5], [-2.0, -8.8]] }));
      // the apron, then the tray held up on the near hand with a glass and a cup
      const hp = r.hip; g.fill2([[hp[0] - 2.2, hp[1] - 0.6], [hp[0] + 2.2, hp[1] - 0.6], [hp[0] + 2.4, hp[1] + 7.6], [hp[0] - 2.4, hp[1] + 7.6]], '#FBFAF4', true);
      g.line2([[hp[0] - 2.4, hp[1] + 7.6], [hp[0] + 2.4, hp[1] + 7.6]], { w: 0.3, c: '#8C8576', boil: false });
      const h = r.hands[0], tr = arcPts(h[0], h[1] - 0.4, 3.0, 0, TAU, 12).map((q) => [q[0], h[1] - 0.4 + (q[1] - h[1] + 0.4) * 0.4]);
      g.fill2(tr, '#C9CCCC', true); g.line2(tr, { w: 0.3, c: '#6E6A60', close: true, boil: false, wob: 0.2 });
      g.fill2([[h[0] - 1.2, h[1] - 0.6], [h[0] - 0.6, h[1] - 0.6], [h[0] - 0.4, h[1] - 2.4], [h[0] - 1.4, h[1] - 2.4]], '#8E2A36', true);
      g.fill2([[h[0] + 0.4, h[1] - 0.5], [h[0] + 1.4, h[1] - 0.5], [h[0] + 1.3, h[1] - 1.4], [h[0] + 0.5, h[1] - 1.4]], '#FBF8F0', true);
    } });
};

/* ---------------- street furniture ---------------- */
/* a plane tree in early autumn: a mottled pale trunk, a broad crown of yellow-green with ochre and rust patches */
PA.plane = function (g, x, y, o) {
  o = o || {}; const r = (o.r || 4.4) * 3.3, h = o.h == null ? 5.8 : o.h, f = g.p(x, y, o.z || 0), top = [f[0], f[1] - h * VZ], R = RNG(o.seed || Math.round(x * 41 + y * 13 + 7));
  g.fill2([[f[0] - 1.1, f[1]], [f[0] + 1.1, f[1]], [top[0] + 0.75, top[1] - r * 0.2], [top[0] - 0.75, top[1] - r * 0.2]], '#B9AE8E');
  const mot = []; for (let i = 0; i < 5; i++) { const yy = f[1] - (i + 0.5) * h * VZ / 5, xx = f[0] + (R() - 0.5) * 1.2; mot.push(xx - 0.4, yy, xx + 0.4, yy - 0.7); } g.segs2(mot, '#8C8064', 0.55);
  g.line2([[f[0] - 1.1, f[1]], [top[0] - 0.75, top[1]]], { w: 0.5, c: '#6E6450', boil: false }); g.line2([[f[0] + 1.1, f[1]], [top[0] + 0.75, top[1]]], { w: 0.5, c: '#6E6450', boil: false });
  const cx = top[0], cy = top[1] - r * 0.55, n = 11, pts = [], a0 = R() * TAU;
  for (let i = 0; i < n; i++) { const a = a0 + TAU * i / n, rr = r * (0.86 + R() * 0.26); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.82]); }
  const col = o.col || PC.plane;
  g.fill2(pts, col);
  const sh = pts.filter((p) => (p[0] - cx) * 0.55 + (p[1] - cy) > -r * 0.1); if (sh.length > 1) { sh.push([cx + r * 0.05, cy + r * 0.12]); g.fill2(sortAround(sh), shade(col, 0.14)); }
  // autumn patches: ochre and rust blobs on the lit side and the edges
  const turn = o.turn == null ? 0.5 : o.turn;
  for (let i = 0; i < 3 + Math.round(turn * 4); i++) {
    const a = R() * TAU, d = r * (0.25 + R() * 0.5), px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.8, rr = r * (0.16 + R() * 0.14), pc = R() < 0.65 ? PC.planeY : PC.planeO, blob = [];
    for (let k = 0; k < 7; k++) { const t = TAU * k / 7; blob.push([px + Math.cos(t) * rr * (0.8 + R() * 0.4), py + Math.sin(t) * rr * 0.75]); }
    g.fill2(blob, pc);
  }
  const hl = pts.filter((p) => (p[0] - cx) * 0.6 + (p[1] - cy) < -r * 0.5); if (hl.length > 1) { hl.push([cx - r * 0.3, cy - r * 0.3]); g.fill2(sortAround(hl), shade(col, -0.22)); }
  g.outline2(pts, { c: o.ink || PC.planeInk, w: 0.85, ext: 0.4 });
  const segs = []; for (let i = 0; i < 5; i++) { const a = R() * TAU, d = r * (0.2 + R() * 0.55), px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.8, l = r * 0.13; segs.push(px, py, px + l, py - l * 0.5, px + l, py - l * 0.5, px + l * 1.8, py + l * 0.2); }
  g.segs2(segs, o.ink || PC.planeInk, 0.5);
};
/* a clipped chestnut / lime in a box shape (Luxembourg, Tuileries alleys) */
PA.clipped = function (g, x, y, o) {
  o = o || {}; const s = o.s || 2.6, h = o.h || 4.2, hh = o.hh || 4.6, col = o.col || '#93AE62';
  const f = g.p(x, y, 0), t = g.p(x, y, h);
  g.fill2([[f[0] - 0.7, f[1]], [f[0] + 0.7, f[1]], [t[0] + 0.5, t[1]], [t[0] - 0.5, t[1]]], '#9A8468');
  K.box(g, x - s, y - s, x + s, y + s, h, h + hh, { t: shade(col, -0.18), l: col, r: shade(col, 0.14) }, { w: 0.7, c: '#56702F', nohid: true });
  g.scuff(K.on('L', y + s, x - s, x + s, h, h + hh), { c: shade(col, 0.25), len: 1.0, dir: -1.2, spread: 1.2, dens: 0.9, w: 0.45 });
  if (o.turn) g.scuff(K.on('L', y + s, x - s, x + s, h, h + hh), { c: PC.planeY, len: 0.9, dir: -1.1, spread: 1.4, dens: 0.5, w: 0.55 });
};
/* a Paris street lamp: a dark green cast-iron post with a lantern */
PA.lamp = function (g, x, y, o) {
  o = o || {}; const h = o.h || 8.4, f = g.p(x, y, o.z || 0), t = g.p(x, y, (o.z || 0) + h), col = o.col || '#2C3B35';
  g.fill2([[f[0] - 1.0, f[1]], [f[0] + 1.0, f[1]], [f[0] + 0.7, f[1] - 2.4], [f[0] - 0.7, f[1] - 2.4]], col, true);
  g.fill2([[f[0] - 0.4, f[1] - 2.2], [f[0] + 0.4, f[1] - 2.2], [t[0] + 0.3, t[1]], [t[0] - 0.3, t[1]]], col, true);
  const L = [[t[0] - 1.5, t[1] - 0.6], [t[0] + 1.5, t[1] - 0.6], [t[0] + 1.9, t[1] - 4.0], [t[0] - 1.9, t[1] - 4.0]];
  g.fill2(L, '#F3E5B0', true); g.fill2([[t[0] + 0.2, t[1] - 0.6], [t[0] + 1.5, t[1] - 0.6], [t[0] + 1.9, t[1] - 4.0], [t[0] + 0.3, t[1] - 4.0]], '#E2CC86', true);
  g.fill2([[t[0] - 2.3, t[1] - 4.0], [t[0] + 2.3, t[1] - 4.0], [t[0], t[1] - 5.6]], col, true);
  g.line2(L, { w: 0.35, c: col, close: true, boil: false, wob: 0.2 });
  g.disc2([t[0], t[1] - 5.9], 0.45, col);
};
/* a Wallace fountain: a dark green cast-iron canopy on four caryatids, over a basin plinth (about 2.7 m: ~9.5 u) */
PA.wallace = function (g, x, y) {
  const f = g.p(x, y, 0), G = '#2F5D4B', GD = '#21443A', GL = '#4F8A6C';
  g.fill2(arcPts(f[0], f[1], 3.4, 0, TAU, 12).map((q) => [q[0], f[1] + (q[1] - f[1]) * 0.45]), '#CFC7B6', true);
  const s = (u, v) => [f[0] + u, f[1] - v];
  g.fill2([s(-2.6, 0), s(2.6, 0), s(2.4, 3.6), s(-2.4, 3.6)], G, true); g.fill2([s(0.5, 0), s(2.6, 0), s(2.4, 3.6), s(0.5, 3.6)], GD, true);   // the plinth
  for (const u of [-1.7, -0.6, 0.6, 1.7]) g.fill2([s(u - 0.42, 3.6), s(u + 0.42, 3.6), s(u + 0.32, 9.6), s(u - 0.32, 9.6)], u > 0.2 ? GD : G, true);  // caryatids
  for (const u of [-1.7, -0.6, 0.6, 1.7]) g.disc2(s(u, 9.9), 0.42, u > 0.2 ? GD : GL);
  g.fill2([s(-2.7, 10.2), s(2.7, 10.2), s(2.2, 11.4), s(-2.2, 11.4)], G, true);
  g.fill2(K.curve([s(-2.2, 11.4), s(-1.4, 13.4), s(0, 14.0), s(1.4, 13.4), s(2.2, 11.4)], 3, false), G, true);
  g.fill2([s(0.3, 11.4), s(2.2, 11.4), s(1.4, 13.4), s(0.3, 13.9)], GD, true);
  g.disc2(s(0, 14.3), 0.5, G);
  g.line2([s(-2.6, 0), s(-2.4, 3.6), s(-2.7, 10.2), s(-2.2, 11.4), s(-1.4, 13.4), s(0, 14.0), s(1.4, 13.4), s(2.2, 11.4), s(2.7, 10.2), s(2.4, 3.6), s(2.6, 0)], { w: 0.45, c: '#16302A', boil: false, wob: 0.2 });
  g.segs2([f[0], f[1] - 9.6, f[0], f[1] - 4.2], '#BFE0E8', 0.35);   // the thin jet of water
};
/* a Morris column: a dark green drum dressed with posters, a scalloped cornice and a small dome with a finial */
PA.morris = function (g, x, y, o) {
  o = o || {}; const r = 1.45, h = o.h || 8.2;
  K.cyl(g, x, y, r + 0.2, 0, 0.9, { t: '#2F5D4B', l: '#2F5D4B', r: '#21443A' }, { w: 0.5, n: 10, nt: true });
  K.cyl(g, x, y, r, 0.9, h, { t: '#E7DCC0', l: '#E9DFC6', r: '#D5C9AC' }, { w: 0.6, n: 10, nt: true });
  // posters on the visible side
  const R = RNG(Math.round(x * 13 + y * 31)), cols = ['#C9463E', '#E6C24F', '#3F5F8F', '#E9806A', '#5F8F6A', '#2A2622', '#D98AA4'];
  for (let i = 0; i < 4; i++) { const a0 = lerp(A_L, A_R + TAU, 0) ; void a0; }
  for (let i = 0; i < 3; i++) {
    const a = Math.PI * 0.25 + (i - 1) * 0.75, z0 = 1.4, z1 = h - 1.0;
    const q = [[x + Math.cos(a - 0.3) * (r + 0.03), y + Math.sin(a - 0.3) * (r + 0.03), z0], [x + Math.cos(a + 0.3) * (r + 0.03), y + Math.sin(a + 0.3) * (r + 0.03), z0], [x + Math.cos(a + 0.3) * (r + 0.03), y + Math.sin(a + 0.3) * (r + 0.03), z1], [x + Math.cos(a - 0.3) * (r + 0.03), y + Math.sin(a - 0.3) * (r + 0.03), z1]];
    g.fill(q, R.pick(cols));
    const c = g.p(x + Math.cos(a) * r, y + Math.sin(a) * r, (z0 + z1) / 2); PA.letters2(g, [c[0], c[1] - 3], 2.6, 1.2, '#F6F1E4', ['OPÉRA', 'CINÉMA', 'EXPO', 'JAZZ'][(i + Math.round(Math.abs(x))) % 4], 0.25);
  }
  K.cyl(g, x, y, r + 0.35, h, h + 0.6, { t: '#2F5D4B', l: '#3E7560', r: '#21443A' }, { w: 0.55, n: 10 });
  const c = g.p(x, y, h + 0.6); g.fill2(K.curve([[c[0] - 4.2, c[1]], [c[0] - 2.6, c[1] - 2.6], [c[0], c[1] - 3.4], [c[0] + 2.6, c[1] - 2.6], [c[0] + 4.2, c[1]]], 3, false), '#2F5D4B', true);
  g.disc2([c[0], c[1] - 4.0], 0.55, '#2F5D4B');
};
/* a Guimard Métro entrance: the stair opening with cast-iron railings, two lily stalks with orange lamps and the
   "Métropolitain" sign between them. ax: the stair runs along 'x' or 'y'; the sign faces the open end at +ax. */
PA.metro = function (g, x, y, o) {
  o = o || {}; const ax = o.ax || 'y', W = 1.6, L = 3.6, G = '#3B6B55', GD = '#24453A';
  const P = (u, v, z) => ax === 'y' ? [x + v, y + u, z] : [x + u, y + v, z];
  // the opening with the first steps going down
  g.fill([P(-L, -W, 0), P(L, -W, 0), P(L, W, 0), P(-L, W, 0)], '#4A443B');
  for (let i = 0; i < 5; i++) g.fill([P(L - i * 1.2, -W + 0.2, -i * 0.5), P(L - i * 1.2 - 0.9, -W + 0.2, -i * 0.5), P(L - i * 1.2 - 0.9, W - 0.2, -i * 0.5), P(L - i * 1.2, W - 0.2, -i * 0.5)], shade('#B9B2A2', i * 0.12));
  // railings on three sides: low cast-iron with loops
  const rail = (a, b) => { const pa = g.p.apply(g, a), pb = g.p.apply(g, b), n = 6, segs = [pa[0], pa[1] - 3.4, pb[0], pb[1] - 3.4]; for (let i = 0; i <= n; i++) { const t = i / n, q = [lerp(pa[0], pb[0], t), lerp(pa[1], pb[1], t)]; segs.push(q[0], q[1], q[0], q[1] - 3.4); } g.segs2(segs, GD, 0.45); for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, q = [lerp(pa[0], pb[0], t), lerp(pa[1], pb[1], t) - 2.0]; g.ring2(q, 0.7, { c: G, w: 0.35 }); } };
  rail(P(-L, -W, 0), P(L, -W, 0)); rail(P(-L, -W, 0), P(-L, W, 0)); rail(P(-L, W, 0), P(L, W, 0));
  // two stalks at the open end, the sign between, the orange "eye" lamps
  const s1 = g.p.apply(g, P(L, -W, 0)), s2 = g.p.apply(g, P(L, W, 0)), h = 10.5 * VZ / 3.46 * 3.46;
  for (const s of [s1, s2]) { g.line2(K.curve([[s[0], s[1]], [s[0] + 0.3, s[1] - h * 0.5], [s[0] - 0.4, s[1] - h * 0.85], [s[0] + 0.6, s[1] - h]], 3, false), { w: 0.75, c: G, boil: false, wob: 0.2 }); g.fill2(arcPts(s[0] + 0.6, s[1] - h - 1.2, 1.2, 0, TAU, 8).map((q) => [q[0], s[1] - h - 1.2 + (q[1] - s[1] + h + 1.2) * 1.5]), '#E9873C', true); g.ring2([s[0] + 0.6, s[1] - h - 1.2], 1.2, { c: '#8A4A1E', w: 0.3 }); }
  const zs = 7.2, a = [s1[0], s1[1] - zs * VZ], b = [s2[0], s2[1] - zs * VZ], ab = [[a[0], a[1] + 0.3], [b[0], b[1] + 0.3], [b[0], b[1] - 2.3], [a[0], a[1] - 2.3]];
  g.fill2(ab, '#EAD9A4', true); g.outline2(ab, { w: 0.4, c: GD, boil: false, ext: 0 });
  PA.letters2(g, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 1.0], Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.8, 1.1, '#3B6B55', 'MÉTROPOLITAIN', 0.28);
  g.line2([[a[0], a[1] + 0.5], [lerp(a[0], b[0], 0.5), lerp(a[1], b[1], 0.5) - 1.0], [b[0], b[1] + 0.5]], { w: 0.5, c: G, boil: false });
};
/* a newspaper kiosk: a green hexagonal booth with a domed roof and magazines on the front */
PA.kiosk = function (g, x, y, o) {
  o = o || {};
  K.box(g, x - 1.8, y - 1.8, x + 1.8, y + 1.8, 0, 5.2, { t: '#2F5D4B', l: '#3E7560', r: '#2F5D4B' }, { w: 0.65 });
  const R = RNG(Math.round(x * 7 + y * 5));
  for (const [f, p] of [['L', y + 1.8], ['R', x + 1.8]]) {
    const a0 = f === 'L' ? x - 1.5 : y - 1.5;
    g.fill(K.on(f, p + 0.03, a0, a0 + 3.0, 1.0, 4.2), '#E9E2CC');
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) g.fill(K.on(f, p + 0.05, a0 + 0.15 + i * 0.72, a0 + 0.75 + i * 0.72, 1.2 + r * 1.0, 1.95 + r * 1.0), R.pick(['#C9463E', '#E6C24F', '#3F5F8F', '#F3F1EA', '#D98AA4', '#5F8F6A', '#2A2622']));
  }
  const c = g.p(x, y, 5.2); g.fill2(K.curve([[c[0] - 9.6, c[1] + 1.2], [c[0] - 6, c[1] - 3.2], [c[0], c[1] - 5.2], [c[0] + 6, c[1] - 3.2], [c[0] + 9.6, c[1] + 1.2]], 3, false), '#2F5D4B', true);
  g.line2(K.curve([[c[0] - 9.6, c[1] + 1.2], [c[0] - 6, c[1] - 3.2], [c[0], c[1] - 5.2], [c[0] + 6, c[1] - 3.2], [c[0] + 9.6, c[1] + 1.2]], 3, false), { w: 0.5, c: '#16302A', boil: false });
  g.disc2([c[0], c[1] - 5.8], 0.6, PC.gold);
  PA.sign(g, 'L', y + 1.8, x - 1.6, x + 1.6, 4.4, 5.1, '#E9E2CC', { ink: '#2F5D4B', seed: 4, line: false });
};
/* a Vélib' dock: a row of mint-green bikes in their posts along an axis */
PA.velibDock = function (g, x, y, n, ax) {
  for (let i = 0; i < n; i++) {
    const u = (i - (n - 1) / 2) * 1.5, bx = ax === 'x' ? x + u : x, by = ax === 'x' ? y : y + u;
    const post = g.p(bx, by, 0), pt = g.p(bx, by, 2.4); g.segs2([post[0], post[1], pt[0], pt[1]], '#5A6B66', 0.7);
    g.at(bx, by, 0, (g2) => PA.velib(g2, ax === 'x' ? Math.PI / 2 : 0, { empty: true }));
  }
};
/* a bouquiniste's box on the quai parapet: a long dark green chest; open, its lid stands up behind it hung with prints */
PA.bouquin = function (g, x, y, ax, open, seed) {
  const L = 2.0, W = 0.7, z0 = 1.2, z1 = 2.4, b = ax === 'y' ? [x - W, y - L, x + W, y + L] : [x - L, y - W, x + L, y + W];
  K.box(g, b[0], b[1], b[2], b[3], z0, z1, { t: '#3E6B57', l: '#2F5D4B', r: '#244A3C' }, { w: 0.5, boil: false, nohid: true });
  if (!open) return;
  // books on the open box, the lid propped up behind with prints pinned to it
  const R = RNG(seed || Math.round(x * 3 + y * 7)), segs = [];
  for (let i = 0; i < 10; i++) { const u = -L + 0.25 + i * 0.37, p = ax === 'y' ? g.p(x, y + u, z1) : g.p(x + u, y, z1); segs.push(p); }
  for (const p of segs) g.fill2([[p[0] - 0.55, p[1]], [p[0] + 0.55, p[1]], [p[0] + 0.55, p[1] - 1.0], [p[0] - 0.55, p[1] - 1.0]], R.pick(['#C9584B', '#E6C24F', '#3F5F8F', '#E9E2CC', '#8E5A3A', '#5F8F6A']), true);
  const lid = ax === 'y' ? [[x - W, y - L, z1], [x - W, y + L, z1], [x - W - 0.2, y + L, z1 + 2.2], [x - W - 0.2, y - L, z1 + 2.2]] : [[x - L, y - W, z1], [x + L, y - W, z1], [x + L, y - W - 0.2, z1 + 2.2], [x - L, y - W - 0.2, z1 + 2.2]];
  g.fill(lid, '#2F5D4B'); g.outline(lid, { w: 0.4, c: '#16302A', boil: false });
  for (let i = 0; i < 3; i++) { const u = -L + 0.6 + i * 1.3, q = ax === 'y' ? [[x - W - 0.08, y + u, z1 + 0.4], [x - W - 0.08, y + u + 0.9, z1 + 0.4], [x - W - 0.15, y + u + 0.9, z1 + 1.8], [x - W - 0.15, y + u, z1 + 1.8]] : [[x + u, y - W - 0.08, z1 + 0.4], [x + u + 0.9, y - W - 0.08, z1 + 0.4], [x + u + 0.9, y - W - 0.15, z1 + 1.8], [x + u, y - W - 0.15, z1 + 1.8]]; g.fill(q, R.pick(['#F3EBD6', '#E7D4A8', '#D8C9A4', '#EFE6CF'])); }
};
/* a stone parapet along a quai edge from a0 to a1 (ax along which it runs), at the plane c */
PA.parapet = function (g, ax, c, a0, a1, o) {
  o = o || {}; const t = o.t || 0.7, h = o.h || 1.2, b = ax === 'y' ? [c - t / 2, a0, c + t / 2, a1] : [a0, c - t / 2, a1, c + t / 2];
  K.box(g, b[0], b[1], b[2], b[3], 0, h, { t: PC.quaiL, l: PC.quai, r: PC.quaiD }, { w: 0.6, boil: false, nohid: true });
};

/* ---------------- people ---------------- */
const PA_TOPS = ['#2F3A4F', '#F0EDE4', '#3B3F47', '#B9A27D', '#C9584B', '#6C7A89', '#E7E2D6', '#8E5A3A', '#3F5F8F', '#D9C9A4', '#2A2622', '#7A8C6E', '#E6C24F', '#B24A3E', '#F3F1EA', '#5A4A6E'];
const PA_BOTS = ['#2F343B', '#3F4D63', '#2A2622', '#B9A27D', '#4A5A78', '#6B5A48', '#E7E2D6', '#3B3F47'];
/* a Parisian: quiet colours, a trench or a marinière, scarves in autumn, sometimes a beret or a baguette */
PA.who = function (seed, o) {
  const R = RNG(seed * 6151 + 29), w = K.who(seed);
  w.top = R.pick(PA_TOPS); w.bot = R.pick(PA_BOTS); w.shorts = false; w.bare = R() < 0.12;
  w.shoe = R.pick(['#2A2622', '#2A2622', '#F3F1EA', '#6B4A30', '#3B3F47']);
  w.cap = undefined;
  const r = R();
  if (r < 0.14) { w.dress = R.pick(['#B9A27D', '#C8A97A', '#B49A6E']); w.top = w.dress; w.trench = true; }     // a trench coat
  else if (r < 0.26) w.stripes = true;                                                                     // a marinière
  else if (r < 0.36) w.dress = R.pick(['#2F3A4F', '#C9584B', '#E7E2D6', '#3B3F47', '#7A8C6E', '#D98AA4']);
  if (R() < 0.3) w.scarf = R.pick(['#C9463E', '#E6C24F', '#3F5F8F', '#E9806A', '#7A5BA0', '#F3F1EA', '#5F8F6A']);
  if (R() < 0.07) w.beret = R.pick(['#2A2622', '#B24A3E', '#2F3A4F']);
  if (R() < 0.07) w.baguette = true;
  if (R() < 0.08) w.glasses = true;
  return Object.assign(w, o || {});
};
/* K.person plus Paris extras on the returned points: marinière stripes, a scarf, a beret, a baguette under the arm */
PA.person = function (g, x, y, z, w) {
  const r = K.person(g, x, y, z, w), k = w.k || 1, sp = r.shoulders, hp = r.hip;
  if (w.stripes && sp && hp && !w.dress) {
    const st = [], x0 = Math.min(sp[0][0], sp[1][0]) - 0.2, x1 = Math.max(sp[0][0], sp[1][0]) + 0.2;
    for (let i = 1; i <= 4; i++) { const yy = lerp(Math.min(sp[0][1], sp[1][1]) + 0.9 * k, hp[1] - 0.4 * k, i / 5); st.push(x0 + 0.5, yy, x1 - 0.5, yy); }
    g.segs2(st, '#2F3A63', 0.42 * k);
  }
  if (w.scarf && sp) {
    const mx = (sp[0][0] + sp[1][0]) / 2, my = Math.min(sp[0][1], sp[1][1]);
    g.fill2([[mx - 2.0 * k, my - 0.6 * k], [mx + 2.0 * k, my - 0.6 * k], [mx + 1.7 * k, my + 1.0 * k], [mx - 1.7 * k, my + 1.0 * k]], w.scarf, true);
    if ((w.dir | 0) < 2) g.fill2([[mx - 0.2 * k, my + 0.6 * k], [mx + 0.9 * k, my + 0.6 * k], [mx + 0.6 * k, my + 4.2 * k], [mx - 0.3 * k, my + 4.0 * k]], shade(w.scarf, 0.08), true);
  }
  if (w.beret && r.crown) { const c = r.crown; g.fill2(arcPts(c[0], c[1] + 1.0 * k, 2.3 * k, Math.PI, TAU, 8).concat([[c[0] + 2.3 * k, c[1] + 1.4 * k], [c[0] - 2.3 * k, c[1] + 1.4 * k]]), w.beret, true); g.disc2([c[0], c[1] - 1.0 * k], 0.3 * k, w.beret); }
  if (w.baguette && sp && (w.pose === 'walk' || w.pose === 'stand' || !w.pose)) {
    const s = sp[0], a = [s[0] - 2.5 * k, s[1] + 5.4 * k], b = [s[0] + 2.8 * k, s[1] - 2.8 * k];
    g.line2([a, b], { w: 1.15 * k, c: '#D9A85A', boil: false, ext: 0, taper: 0 });
    g.segs2([lerp(a[0], b[0], 0.3), lerp(a[1], b[1], 0.3), lerp(a[0], b[0], 0.3) + 0.6, lerp(a[1], b[1], 0.3) - 0.2, lerp(a[0], b[0], 0.6), lerp(a[1], b[1], 0.6), lerp(a[0], b[0], 0.6) + 0.6, lerp(a[1], b[1], 0.6) - 0.2], '#A9763A', 0.3);
  }
  return r;
};
/* a Parisian walker on a closed route (PA.person, so the extras show) */
PA.walker = function (T, who, pts, speed, o) {
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
    draw(g, st) { PA.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); if (o.extra) o.extra(g, st); } });
};
/* a crowd bust (for queues seen over each other, and spectators) */
PA.bust2 = function (g, p, w, k) {
  k = k || 1; const s = (u, v) => [p[0] + u * k, p[1] + v * k];
  g.fill2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], w.top, true);
  g.fill2([s(-0.55, -4.6), s(0.55, -4.6), s(0.5, -5.8), s(-0.5, -5.8)], shade(w.skin, 0.12), true);
  g.disc2(s(0, -7.6), 1.95 * k, w.skin); g.fill2(K.curve([s(-2.05, -7.2), s(-1.9, -8.9), s(0, -9.75), s(1.9, -8.9), s(2.05, -7.3), s(1.2, -8.2), s(-1.0, -8.25)], 2, true), w.hair, true);
  g.disc2(s(-0.6, -7.4), 0.22 * k, '#2A2420'); g.disc2(s(0.65, -7.4), 0.2 * k, '#2A2420');
  g.outline2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], { w: 0.35, c: '#3A3128', boil: false });
};
/* a painter at an easel (Place du Tertre, the quais): the easel with a canvas facing them, the painter with a brush */
PA.painter = function (g, x, y, w, face, seed) {
  const dir = face === 'R' ? 2 : 3, R = RNG(seed || 5);
  // the easel stands in front of the painter (towards -x or -y), so it is drawn first; we see the canvas's back
  const ex = face === 'R' ? x - 1.6 : x, ey = face === 'R' ? y : y - 1.6, b = g.p(ex, ey, 0);
  const legs = [b[0] - 1.6, b[1] + 0.4, b[0], b[1] - 15.5, b[0] + 1.6, b[1] + 0.4, b[0], b[1] - 15.5, b[0], b[1] + 1.4, b[0], b[1] - 14.5];
  g.segs2(legs, '#8A6440', 0.55);
  const cv = [[b[0] - 3.4, b[1] - 6.8], [b[0] + 3.4, b[1] - 6.8], [b[0] + 3.4, b[1] - 14.2], [b[0] - 3.4, b[1] - 14.2]];
  g.fill2(cv, '#E8E1CF', true);
  g.fill2([[b[0] - 2.8, b[1] - 7.5], [b[0] + 2.8, b[1] - 7.5], [b[0] + 2.8, b[1] - 10.5], [b[0] - 2.8, b[1] - 10.5]], R.pick(['#9DBDBC', '#B9CC8C', '#E7A9A0', '#C3D6E0']), true);
  g.fill2([[b[0] - 2.8, b[1] - 10.5], [b[0] + 2.8, b[1] - 10.5], [b[0] + 2.8, b[1] - 13.5], [b[0] - 2.8, b[1] - 13.5]], R.pick(['#DDE8EE', '#F3E3A0', '#F2D3B8']), true);
  g.outline2(cv, { w: 0.4, c: '#6E5A44', boil: false });
  const r = PA.person(g, x, y, 0, Object.assign({}, w, { dir, pose: 'stand', hands: [[3.8, -13.6], [1.0, -9.5]] }));
  const h = r.hands[0]; g.segs2([h[0], h[1], h[0] + 1.6, h[1] - 1.8], '#5A3E2E', 0.4); g.disc2([h[0] + 1.7, h[1] - 1.9], 0.35, R.pick(['#C9463E', '#3F5F8F', '#E6C24F']));
  return r;
};

/* ---------------- vehicles ---------------- */
/* a small Paris hatchback: a low body, a short glasshouse set back, wheels in dark arches. o.roof(g, cab) adds a sign */
PA.car = function (g, ang, o) {
  o = o || {}; const col = o.col || '#C9584B', L = o.L || 4.1, Wd = o.W || 2.1, ca = Math.cos(ang), sa = Math.sin(ang);
  const tone = { t: shade(col, -0.2), l: col, r: shade(col, 0.15) };
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  const wu = [-L * 0.62, L * 0.6];
  K.wheels(g, sh, wu, 0.78, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.6, 2.15, tone, { w: 0.8 });
  for (const f of ['pu', 'nu']) if (B.vis[f]) g.fill(B.quad(f, -1, 1, 0.6, 0.95), shade(col, 0.32));
  for (const f of ['pv', 'nv']) if (B.vis[f]) { const s = B.quad(f, 0.0, 0.0, 0.75, 2.1); g.line([s[0], s[3]], { w: 0.28, c: shade(col, 0.35), boil: false, ext: 0 }); const h = B.quad(f, 0.1, 0.24, 1.75, 1.75); g.line([h[0], h[1]], { w: 0.4, c: shade(col, 0.5), boil: false, ext: 0 }); }
  K.wheels(g, sh, wu, 0.78, 'near', { arch: shade(col, 0.6) });
  K.lights(g, B, 1.25);
  const off = -L * 0.14, cab = K.rbox(g, off * ca, off * sa, L * 0.52, Wd - 0.25, ang, 2.15, 3.55, tone, { nb: true, w: 0.7 });
  K.rwin(g, cab, 'pv', -0.84, -0.06, 2.3, 3.4); K.rwin(g, cab, 'pv', 0.06, 0.84, 2.3, 3.4);
  K.rwin(g, cab, 'nv', -0.84, -0.06, 2.3, 3.4); K.rwin(g, cab, 'nv', 0.06, 0.84, 2.3, 3.4);
  K.rwin(g, cab, 'pu', -0.8, 0.8, 2.3, 3.4); K.rwin(g, cab, 'nu', -0.8, 0.8, 2.3, 3.4);
  if (o.roof) o.roof(g, cab);
};
/* a Paris taxi: black, the lit TAXI PARISIEN sign on the roof */
PA.taxi = function (g, ang) {
  PA.car(g, ang, { col: '#2E3134', L: 4.4, W: 2.2, roof: (gg, cab) => { K.rbox(gg, cab.cx, cab.cy, 0.42, 0.9, ang + Math.PI / 2, 3.55, 4.15, { t: '#F3F1EA', l: '#9FD0A8', r: '#86BC90' }, { w: 0.4 }); } });
};
/* the green-and-white bus */
PA.bus = function (g, ang) { K.bus(g, ang, { col: '#EEF0EC', band: '#3E8E6E', L: 6.6, W: 2.6, h: 5.6, n: 5 }); };
/* a delivery van */
PA.van = function (g, ang, col) { K.bus(g, ang, { col: col || '#F1EFE8', band: '#C9584B', L: 4.8, W: 2.3, h: 5.0, n: 2 }); };
/* a Vélib': the mint-green city bike with its front basket; o.empty: parked, no rider */
PA.velib = function (g, ang, o) {
  o = o || {};
  if (o.empty) {
    const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, z) => g.p(u * ca, u * sa, z);
    for (const u of [-2.1, 2.1]) { const pts = []; for (let i = 0; i < 16; i++) { const t = TAU * i / 16; pts.push(pt(u + Math.cos(t) * 1.3, 1.3 + Math.sin(t) * 1.3)); } g.line2(pts, { c: '#3A3632', w: 0.6, close: true, boil: false, wob: 0.2 }); }
    const A = pt(-2.1, 1.3), B = pt(2.1, 1.3), s = pt(-0.7, 3.4), h = pt(1.6, 3.7), bb = pt(0, 1.4);
    g.segs2([A[0], A[1], bb[0], bb[1], bb[0], bb[1], s[0], s[1], bb[0], bb[1], h[0], h[1], h[0], h[1], B[0], B[1]], '#7CC4B0', 0.75);
    const bk = pt(2.3, 3.5); g.fill2([[bk[0] - 1.1, bk[1]], [bk[0] + 1.1, bk[1]], [bk[0] + 1.0, bk[1] + 1.6], [bk[0] - 1.0, bk[1] + 1.6]], '#5E8F84', true);
    return;
  }
  K.bike(g, ang, { col: '#7CC4B0', who: o.who, seed: o.seed });
};
/* a scooter (a Vespa-like body under the seat, the leg shield, two small wheels) with its rider */
PA.scooter = function (g, ang, who, col) {
  col = col || '#E9E2CC'; const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z);
  const wheel = (u) => { const pts = []; for (let i = 0; i < 14; i++) { const t = TAU * i / 14; pts.push(pt(u + Math.cos(t) * 0.85, 0, 0.85 + Math.sin(t) * 0.85)); } g.fill2(pts, '#3A3632', true); g.disc2(pt(u, 0, 0.85), 0.35, '#B9B4A8'); };
  wheel(-1.7); wheel(1.9);
  const body = [pt(-2.4, 0, 1.0), pt(-0.6, 0, 1.0), pt(0.4, 0, 0.9), pt(1.2, 0, 1.2), pt(1.5, 0, 3.6), pt(1.9, 0, 3.9), pt(1.1, 0, 3.9), pt(0.7, 0, 1.9), pt(-0.6, 0, 2.2), pt(-2.0, 0, 2.6), pt(-2.6, 0, 2.0)];
  g.fill2(body, col, true); g.line2(body, { w: 0.45, c: shade(col, 0.55), close: true, boil: false, wob: 0.2 });
  const seat = [pt(-2.0, 0, 2.6), pt(-0.5, 0, 2.3), pt(-0.5, 0, 2.75), pt(-2.0, 0, 3.0)]; g.fill2(seat, '#3A3530', true);
  const bar = pt(1.7, 0, 4.2), hb = [pt(1.7, -0.8, 4.2), pt(1.7, 0.8, 4.2)]; g.line2(hb, { w: 0.5, c: '#3A3530', boil: false, ext: 0 });
  if (!who) return;
  const d = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2), kk = 0.88, F = pt(-1.1, 0, 2.6), rel = (q) => [(q[0] - F[0]) / kk, (q[1] - F[1]) / kk];
  const r = K.person(g, -1.1 * ca, -1.1 * sa, 2.6, Object.assign({}, who, { dir: d, pose: 'sit', k: kk, reach: rel(bar), pedal: [rel(pt(0.6, 0.4, 1.1)), rel(pt(0.4, -0.4, 1.1))] }));
  // a helmet
  if (r.crown) { const c = r.crown; g.fill2(arcPts(c[0], c[1] + 1.4, 2.4, Math.PI, TAU, 8).concat([[c[0] + 2.4, c[1] + 2.4], [c[0] - 2.4, c[1] + 2.4]]), who.helmet || '#F3F1EA', true); }
};

/* ---------------- the bateau-mouche ---------------- */
/* A long low river boat that fits under the arches: a white hull with a dark band, a long glazed saloon with a glass
   roof, rows of tourists inside seen through it (heads and shoulders), a little wheelhouse at the bow with the flag.
   Drawn in pieces: PA.bateau(g, dirY, u0, u1) draws only the part of the boat between u0 and u1 along its length (u
   from -BM.L at the stern to +BM.L at the bow), so each piece can be its own actor and sort on its own when the boat
   slides under a bridge. The boat heads along +y (dirY 1) or -y (-1); its side towards +x is the one we see.
   Origin: the boat's centre at the waterline. Its top stays 3 u above the water (the arches leave about 3.4). */
const BM = { L: 8.4, W: 2.0 };
PA.bateau = function (g, dirY, u0, u1, o) {
  o = o || {}; const L = BM.L, W = BM.W, s = dirY, hull = '#F4F1E8', band = o.band || '#2F4A63';
  const P = (u, v, z) => [v, s * u, z];
  const half = (u) => u > L - 2.6 ? W * Math.sqrt(Math.max(0, (L - u) / 2.6)) : W;
  const us = []; const n = Math.max(2, Math.ceil((u1 - u0) / 0.6)); for (let i = 0; i <= n; i++) us.push(lerp(u0, u1, i / n));
  const zD = 1.1;
  g.fill(us.map((u) => P(u, half(u) * 1.25 + 0.15, 0)).concat(us.slice().reverse().map((u) => P(u, -half(u) * 1.25 - 0.15, 0))), '#DCEAE8');
  g.fill(us.map((u) => P(u, half(u), 0)).concat(us.slice().reverse().map((u) => P(u, half(u), zD))), shade(hull, 0.06));
  g.fill(us.map((u) => P(u, half(u) + 0.01, 0.12)).concat(us.slice().reverse().map((u) => P(u, half(u) + 0.01, 0.55))), band);
  g.fill(us.map((u) => P(u, -half(u), zD)).concat(us.slice().reverse().map((u) => P(u, half(u), zD))), '#C9B48C');
  g.line(us.map((u) => P(u, half(u), zD)), { w: 0.55, boil: false, ext: 0 });
  g.line(us.map((u) => P(u, half(u), 0)), { w: 0.5, c: '#5F7F80', boil: false, ext: 0 });
  // the saloon: tourists first (busts), then its glass side and glass roof over them
  const s0 = Math.max(u0, -L + 0.8), s1 = Math.min(u1, L - 2.8), zr = zD + 1.75, sw = W - 0.3;
  if (s1 > s0) {
    const rows = []; for (let u = -L + 1.4; u < L - 3.0; u += 1.25) if (u >= u0 && u < u1) rows.push(u);
    rows.sort((a, b) => s * (a - b));
    for (const u of rows) for (const v of [-0.8, 0.8]) {
      const idx = Math.round((u + L) * 10 + (v > 0 ? 1 : 0)); if (h1(idx * 13 + (o.seed || 0)) < 0.15) continue;
      const w = PA.who(idx * 7 + (o.seed || 0)), p = g.p.apply(g, P(u, v, zD + 0.1));
      PA.bust2(g, p, w, 0.62);
    }
    g.fill([P(s0, sw, zD), P(s1, sw, zD), P(s1, sw, zr), P(s0, sw, zr)], 'rgba(185,205,214,0.62)');
    const mul = []; for (let u = Math.ceil((s0 + L) / 1.4) * 1.4 - L; u <= s1; u += 1.4) { const a = g.p.apply(g, P(u, sw + 0.02, zD)), b = g.p.apply(g, P(u, sw + 0.02, zr)); mul.push(a[0], a[1], b[0], b[1]); }
    g.segs2(mul, '#E9EEF0', 0.4);
    g.fill([P(s0, -sw, zr), P(s1, -sw, zr), P(s1, sw, zr), P(s0, sw, zr)], 'rgba(205,224,230,0.55)');
    const rb = []; for (let u = Math.ceil((s0 + L) / 1.4) * 1.4 - L; u <= s1; u += 1.4) { const a = g.p.apply(g, P(u, -sw, zr)), b = g.p.apply(g, P(u, sw, zr)); rb.push(a[0], a[1], b[0], b[1]); }
    g.segs2(rb, '#E9EEF0', 0.35);
    const gl = []; for (let u = Math.ceil((s0 + L) / 2.8) * 2.8 - L + 0.5; u < s1 - 0.4; u += 2.8) { const a = g.p.apply(g, P(u, sw + 0.03, zD + 0.4)), b = g.p.apply(g, P(u + 0.5, sw + 0.03, zD + 1.3)); gl.push(a[0], a[1], b[0], b[1]); }
    g.segs2(gl, C.white, 0.5);
    g.line([P(s0, sw, zr), P(s1, sw, zr)], { w: 0.5, boil: false, ext: 0 });
    if (s0 <= -L + 0.8 + 1e-6) g.line([P(s0, -sw, zr), P(s0, sw, zr), P(s0, sw, zD)], { w: 0.45, boil: false, ext: 0 });
  }
  // the wheelhouse near the bow, the flag
  const w0 = Math.max(u0, L - 2.8), w1 = Math.min(u1, L - 1.5);
  if (w1 > w0) {
    const ww = W - 0.6, zt = zD + 1.95;
    g.fill([P(w0, ww, zD), P(w1, ww, zD), P(w1, ww, zt), P(w0, ww, zt)], '#F3F0E6');
    g.fill([P(w0 + 0.2, ww + 0.02, zD + 0.9), P(w1 - 0.1, ww + 0.02, zD + 0.9), P(w1 - 0.1, ww + 0.02, zt - 0.25), P(w0 + 0.2, ww + 0.02, zt - 0.25)], '#3F4D63');
    if (w1 >= L - 1.5 - 1e-6 && s > 0) { g.fill([P(w1, -ww, zD), P(w1, ww, zD), P(w1, ww, zt), P(w1, -ww, zt)], '#E2DED2'); g.fill([P(w1 + 0.01, -ww + 0.3, zD + 0.9), P(w1 + 0.01, ww - 0.3, zD + 0.9), P(w1 + 0.01, ww - 0.3, zt - 0.25), P(w1 + 0.01, -ww + 0.3, zt - 0.25)], '#3F4D63'); }
    g.fill([P(w0, -ww - 0.15, zt), P(w1, -ww - 0.15, zt), P(w1, ww + 0.15, zt), P(w0, ww + 0.15, zt)], '#E9E6DC');
    g.outline([P(w0, -ww - 0.15, zt), P(w1, -ww - 0.15, zt), P(w1, ww + 0.15, zt), P(w0, ww + 0.15, zt)], { w: 0.45, boil: false });
    if (w0 <= L - 2.2 && w1 >= L - 2.2) { const fb = g.p.apply(g, P(L - 2.2, 0, zt)), ft = [fb[0], fb[1] - 4.2]; g.segs2([fb[0], fb[1], ft[0], ft[1]], '#3A3530', 0.4); for (const [k, c] of [[0, '#2F4A8F'], [1, '#F6F3EA'], [2, '#C9463E']]) g.fill2([[ft[0] - s * k * 0.9, ft[1] + 0.2 * k], [ft[0] - s * (k + 1) * 0.9, ft[1] + 0.2 * (k + 1)], [ft[0] - s * (k + 1) * 0.9, ft[1] + 1.8 + 0.2 * (k + 1)], [ft[0] - s * k * 0.9, ft[1] + 1.8 + 0.2 * k]], c, true); }
  }
  if (u1 >= L - 1e-6) { const tip = P(L, 0, zD), a = P(L - 0.01, half(L - 0.01), zD); g.line([a, tip], { w: 0.5, boil: false, ext: 0 }); }
  if (u0 <= -L + 1e-6) { const q = [P(-L, -W, 0), P(-L, W, 0), P(-L, W, zD), P(-L, -W, zD)]; if (s < 0) { g.fill(q, shade(hull, 0.02)); g.outline(q, { w: 0.5, boil: false }); } else g.line([P(-L, W, 0), P(-L, W, zD)], { w: 0.5, boil: false }); }
};
/* the river's boats: a bateau-mouche running along the channel as NSEG piece-actors. lane x (world), dirY, period,
   phase; each piece anchored at its front-most end so a bridge's near face covers exactly the pieces still under it */
PA.boatActors = function (T, x, dirY, per, ph, o) {
  o = o || {}; const L = BM.L, N = 6, y0 = o.y0 || -176, y1 = o.y1 || 176, span = y1 - y0 + 2 * L;
  for (let i = 0; i < N; i++) {
    const u0 = -L + 2 * L * i / N, u1 = -L + 2 * L * (i + 1) / N;
    T.actor({ sample: 0.2, period: per, grow: false, cast: o.cast,
      at(t) {
        const f = (((t / per + ph) % 1) + 1) % 1, yc = dirY > 0 ? y0 - L + f * span : y1 + L - f * span;
        const yA = dirY > 0 ? yc + u1 : yc - u0;                         // the piece's end nearest the viewer (largest y)
        const fade = Math.min(1, (y1 + 4 - Math.abs(yc)) / 14); if (fade <= 0.02) return null;
        return { x, y: yA, z: RIVER.WZ, key: 'b', yc, alpha: fade < 1 ? fade : null };
      },
      draw(g, st) { g.at(0, -(dirY > 0 ? u1 : -u0), 0, (g2) => PA.bateau(g2, dirY, u0, u1, { seed: o.seed || 0, band: o.band })); } });
  }
};
