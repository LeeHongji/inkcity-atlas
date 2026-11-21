'use strict';
/* Lisbon's own kit: the palette, calçada pavements, azulejo cladding, Pombaline and Alfama houses (tall French windows,
   iron balconies, terracotta hip roofs, washing lines), stone terraces with parapets and stairs, jacarandas and stone
   pines, Santo António garlands, basil pots and sardine braziers, the people of a June afternoon, and the vehicles: the
   Remodelado tram, tuk-tuks, cream taxis, the Carris bus, the cacilheiro ferry. Tile-local u unless a name ends in 2. */
const LX = {};
const LC = {
  calc: '#F4F1E8', calcS: '#E4DED0', basalt: '#3D3A37', setts: '#C2BDB2', settsD: '#ABA59A', rail: '#6E6A64',
  stone: '#EAE3D2', stoneD: '#D3C9B3', wall: '#DCCFB2', wallD: '#C2B394', wallT: '#E6DCC4',
  roof: '#CC6A40', roofD: '#8E4426',
  ochre: '#E6B552', pink: '#EBA99C', rose: '#E58F86', sky: '#AFC7D9', white: '#F4F0E6', mint: '#B3D3B4', rust: '#CF7650',
  lemon: '#F0D77E', lilac: '#C9B6DA', sand: '#E7D2AE',
  jac: '#9F86D6', jacD: '#7D64B9', pine: '#5F7F45', pineD: '#46632F', grass: '#B4CC86',
  tram: '#F2C12E', tramD: '#D6A01C', cream: '#F4EEDC',
  water: '#8DBFC3', waterD: '#6DA3AA', waterL: '#B6D8D7',
  festa: ['#E2483D', '#F2C230', '#3F8FD2', '#5DB26A', '#E77FB3', '#F7F3EA', '#F08A3A'],
};
LX.FACADE = [LC.ochre, LC.pink, LC.white, LC.sky, LC.mint, LC.rust, LC.lemon, LC.rose, LC.white, LC.sand, LC.lilac];
/* azulejo looks: base glaze, pattern colour */
LX.AZ = { b: ['#D3E0EC', '#3B6CB0'], g: ['#BFDCC9', '#2E7A5A'], y: ['#F2E2AE', '#B98A26'], w: ['#EEF0EC', '#4A78B8'] };
LX.SHOPS = ['PASTELARIA', 'FARMÁCIA', 'TABACARIA', 'MERCEARIA', 'TASCA', 'LIVRARIA', 'CERVEJARIA', 'PADARIA', 'CONSERVAS',
  'VINHOS', 'BIFANAS', 'GELADOS', 'BARBEARIA', 'CHAPELARIA', 'FLORISTA', 'SAPATARIA', 'GINJINHA', 'RETROSARIA', 'CAFÉ',
  'TABERNA', 'AZULEJOS', 'DROGARIA', 'LUVARIA', 'PEIXARIA', 'CHURRASQUEIRA'];

/* ---------------- faces ---------------- */
/* the outward normal of a face and a point on it, pushed d out from the wall */
LX.out = (face, p, a, z, d) => (face === 'L' ? [a, p + (d || 0), z] : [p + (d || 0), a, z]);

/* azulejo cladding on a face: a pale glaze with a pattern of small diamonds (or crosses) in a lattice */
LX.azulejo = function (g, face, p, a0, a1, z0, z1, look, seed) {
  const [base, ink] = LX.AZ[look] || LX.AZ.b, q = K.on(face, p + 0.03, a0, a1, z0, z1);
  g.fill(q, base);
  const c = 0.95, na = Math.max(1, Math.round(Math.abs(a1 - a0) / c)), nz = Math.max(1, Math.round((z1 - z0) / c)), tri = [], kind = (seed || 0) % 3;
  for (let i = 0; i < na; i++) for (let j = 0; j < nz; j++) {
    const a = lerp(a0, a1, (i + 0.5) / na), z = lerp(z0, z1, (j + 0.5) / nz), m = g.p.apply(g, LX.out(face, p, a, z, 0.05));
    if (kind === 2 && (i + j) % 2) continue;
    const r = kind === 1 ? 0.75 : 0.95;
    tri.push(m[0] - r, m[1], m[0], m[1] - r, m[0] + r, m[1], m[0] - r, m[1], m[0], m[1] + r, m[0] + r, m[1]);
  }
  g.tris2(tri, ink);
};
/* a tall Lisbon window: a white stone surround, dark glass with a mullion; o.bal adds an iron balcony at the sill */
LX.win = function (g, face, p, a0, a1, z0, z1, o) {
  o = o || {}; const sur = o.sur || '#F7F4EC';
  g.fill(K.on(face, p + 0.04, a0 - 0.22, a1 + 0.22, z0 - 0.25, z1 + 0.3), sur);
  const q = K.on(face, p + 0.06, a0, a1, z0, z1); g.fill(q, o.glass || '#566E7E');
  const m = (a0 + a1) / 2, P = g.P(q);
  g.fine([LX.out(face, p, m, z0, 0.08), LX.out(face, p, m, z1, 0.08)], { w: 0.25, c: '#E9E3D4' });
  g.segs2([lerp(P[0][0], P[2][0], 0.6), lerp(P[0][1], P[2][1], 0.35), lerp(P[0][0], P[2][0], 0.75), lerp(P[0][1], P[2][1], 0.55)], '#C9D6DE', 0.45);
  if (o.shut) { for (const s of [-1, 1]) g.fill(K.on(face, p + 0.07, s < 0 ? a0 : a1 - (a1 - a0) * 0.3, s < 0 ? a0 + (a1 - a0) * 0.3 : a1, z0, z1), o.shut); }
  g.outline2(P, { w: 0.35, c: '#4A4236', boil: false, ext: 0 });
  if (o.bal) {   // a shallow iron balcony: a slab and railing bars
    const d = 0.75, zb = z0 - 0.1, bA = a0 - 0.35, bB = a1 + 0.35;
    g.fill([LX.out(face, p, bA, zb, 0), LX.out(face, p, bB, zb, 0), LX.out(face, p, bB, zb, d), LX.out(face, p, bA, zb, d)], '#CFC7B6');
    const top = [LX.out(face, p, bA, zb + 1.35, d), LX.out(face, p, bB, zb + 1.35, d)], segs = [];
    for (let k = 0; k <= 6; k++) { const a = lerp(bA, bB, k / 6), s0 = g.p.apply(g, LX.out(face, p, a, zb, d)), s1 = g.p.apply(g, LX.out(face, p, a, zb + 1.35, d)); segs.push(s0[0], s0[1], s1[0], s1[1]); }
    for (const a of [bA, bB]) { const s0 = g.p.apply(g, LX.out(face, p, a, zb + 1.35, 0)), s1 = g.p.apply(g, LX.out(face, p, a, zb + 1.35, d)); segs.push(s0[0], s0[1], s1[0], s1[1]); }
    g.segs2(segs, '#3A3530', 0.28); g.fine(top, { w: 0.4, c: '#2E2A26' });
    if (o.pot) LX.manjerico2(g, g.p.apply(g, LX.out(face, p, lerp(bA, bB, 0.22), zb + 1.35, d * 0.6)), 0.8, o.pot);
  }
};
/* a door with a stone surround and a fanlight */
LX.door = function (g, face, p, a0, a1, z0, h, col) {
  g.fill(K.on(face, p + 0.04, a0 - 0.3, a1 + 0.3, z0, z0 + h + 0.4), '#F2EEE3');
  const q = K.on(face, p + 0.06, a0, a1, z0, z0 + h); g.fill(q, col || '#6B4A33');
  g.fill(K.on(face, p + 0.07, a0 + 0.15, a1 - 0.15, z0 + h - 0.9, z0 + h - 0.15), '#9DB0B8');
  g.outline(q, { w: 0.4, c: '#3A2A1E', boil: false, ext: 0 });
};
/* washing on a line strung along a face at height z, d out from the wall: shirts, towels, sheets */
LX.washing = function (g, face, p, a0, a1, z, seed) {
  const R = RNG(seed * 31 + 7), d = 0.45, n = 4 + R.int(0, 3), A = g.p.apply(g, LX.out(face, p, a0, z, d)), B = g.p.apply(g, LX.out(face, p, a1, z, d));
  const at = (t) => [lerp(A[0], B[0], t), lerp(A[1], B[1], t) + 1.6 * t * (1 - t) * 4 * 0.35];
  const ln = []; for (let i = 0; i <= 8; i++) ln.push(at(i / 8)); g.fine2(ln, { w: 0.22, c: '#5A544A' });
  const cols = ['#F7F5EF', '#E2483D', '#3F8FD2', '#F2C230', '#E77FB3', '#7FB7D9', '#F7F5EF', '#5DB26A', '#E9DCC0'];
  const fl = face === 'L' ? 1 : -1;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n + (R() - 0.5) * 0.06, c = at(t), w = 1.3 + R() * 1.6, h = 1.8 + R() * 2.6, col = R.pick(cols), k = R.int(0, 2), slope = (B[1] - A[1]) / Math.max(1, Math.abs(B[0] - A[0])) * w * 0.5 * fl;
    let pts;
    if (k === 0) pts = [[c[0] - w, c[1] - slope], [c[0] + w, c[1] + slope], [c[0] + w, c[1] + h + slope], [c[0] - w, c[1] + h - slope]];   // a towel / sheet
    else if (k === 1) pts = [[c[0] - w, c[1] - slope], [c[0] + w, c[1] + slope], [c[0] + w * 1.1, c[1] + 1.2 + slope], [c[0] + w * 0.55, c[1] + 1.1], [c[0] + w * 0.55, c[1] + h], [c[0] - w * 0.55, c[1] + h], [c[0] - w * 0.55, c[1] + 1.1], [c[0] - w * 1.1, c[1] + 1.2 - slope]];   // a shirt
    else pts = [[c[0] - w * 0.6, c[1]], [c[0] + w * 0.6, c[1]], [c[0] + w * 0.6, c[1] + h * 1.1], [c[0] + 0.1, c[1] + h * 0.5], [c[0] - 0.1, c[1] + h * 0.5], [c[0] - w * 0.6, c[1] + h * 1.1]];   // trousers
    g.fill2(pts, col, true); g.outline2(pts, { w: 0.22, c: shade(col, 0.45), boil: false, ext: 0 });
  }
};

/* ---------------- roofs ---------------- */
/* a terracotta hip roof with tile channels running down the two slopes we see */
LX.roof = function (g, x0, y0, x1, y1, z, h, o) {
  o = o || {}; const col = o.col || LC.roof, ov = o.over == null ? 0.5 : o.over;
  x0 -= ov; y0 -= ov; x1 += ov; y1 += ov;
  const rl = o.ridge == null ? Math.max(0, Math.abs((x1 - x0) - (y1 - y0))) : o.ridge;
  K.hip(g, x0, y0, x1, y1, z, h, col, { ridge: rl, c: o.c || LC.roofD, w: 0.8 });
  const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2, alongX = x1 - x0 >= y1 - y0;
  const ax = alongX ? xm - rl / 2 : xm, bx = alongX ? xm + rl / 2 : xm, ay = alongX ? ym : ym - rl / 2, by = alongX ? ym : ym + rl / 2;
  const segs = [], sp = 0.8;
  for (let x = x0 + sp * 0.6; x < x1 - sp * 0.3; x += sp) {          // the lit slope facing +y
    const t = Math.min(1, (x - x0) / Math.max(0.01, ax - x0), (x1 - x) / Math.max(0.01, x1 - bx)) * 0.96;
    const a = g.p(x, y1, z), b = g.p(x, lerp(y1, alongX ? ym : by, t), z + h * t); segs.push(a[0], a[1], b[0], b[1]);
  }
  for (let y = y0 + sp * 0.6; y < y1 - sp * 0.3; y += sp) {          // the slope facing +x
    const t = Math.min(1, (y - y0) / Math.max(0.01, ay - y0), (y1 - y) / Math.max(0.01, y1 - by)) * 0.96;
    const a = g.p(x1, y, z), b = g.p(lerp(x1, alongX ? bx : xm, t), y, z + h * t); segs.push(a[0], a[1], b[0], b[1]);
  }
  g.segs2(segs, shade(col, 0.22), 0.3);
};
/* a white chimney with a little hood */
LX.chimney = function (g, x, y, z) {
  K.box(g, x - 0.5, y - 0.5, x + 0.5, y + 0.5, z, z + 2.0, { t: '#E9E4D8', l: '#F4F0E6', r: '#DCD5C5' }, { w: 0.45, boil: false });
  K.box(g, x - 0.75, y - 0.75, x + 0.75, y + 0.75, z + 2.0, z + 2.35, { t: '#D9D2C2', l: '#E9E4D8', r: '#D3CBBA' }, { w: 0.4, boil: false });
};

/* ---------------- houses ---------------- */
/* d: {x0,y0,x1,y1, z base, n storeys, col, az (azulejo look on the upper floors), roof 'hip'|'flat'|'none', shop word,
   sc shop colour, seed, wash: true, bal: 0..1 balconies, faces 'LR' (which faces get openings), door 'L'|'R'} */
LX.STOREY = 4.0; LX.GF = 4.6;
LX.house = function (g, d) {
  const R = RNG((d.seed || 1) * 97 + 13), z = d.z || 0, n = d.n || 3, H = LX.GF + (n - 1) * LX.STOREY + 1.0, zt = z + H;
  const col = d.col || R.pick(LX.FACADE), faces = d.faces || 'LR';
  const tones = d.az ? { t: '#E8E2D4', l: LX.AZ[d.az][0], r: shade(LX.AZ[d.az][0], 0.1) } : { t: shade(col, -0.18), l: col, r: shade(col, 0.11) };
  g.boilP = 0.3;
  K.box(g, d.x0, d.y0, d.x1, d.y1, z, zt, tones, { w: 0.85 });
  const shut = R() < 0.35 ? R.pick(['#4F7A5E', '#5E7E9A', '#7A5A3C', '#3F6A7A']) : null;
  for (const face of ['L', 'R']) {
    if (faces.indexOf(face) < 0) continue;
    const p = face === 'L' ? d.y1 : d.x1, a0 = face === 'L' ? d.x0 : d.y0, a1 = face === 'L' ? d.x1 : d.y1, len = a1 - a0;
    if (d.az) { LX.azulejo(g, face, p, a0, a1, z + LX.GF - 0.2, zt - 1.0, d.az, d.seed || 1); g.fill(K.on(face, p + 0.04, a0, a1, z, z + 0.9), '#DAD3C4'); }
    // the cornice and the stone band over the ground floor
    g.fill(K.on(face, p + 0.05, a0, a1, zt - 1.0, zt - 0.6), '#F6F2E8');
    g.fill(K.on(face, p + 0.05, a0, a1, z + LX.GF - 0.35, z + LX.GF - 0.1), '#EEE8DA');
    const nb = Math.max(1, Math.round(len / 3.1)), bw = Math.min(1.35, len / nb * 0.42);
    const doorBay = d.door === face ? (R.int(0, nb - 1)) : -1;
    // ground floor: the door, a shopfront or small windows
    const shopHere = d.shop && face === (d.shopFace || (len > 5 ? face : 'L'));
    for (let b = 0; b < nb; b++) {
      const m = a0 + len * (b + 0.5) / nb;
      if (b === doorBay) LX.door(g, face, p, m - 0.8, m + 0.8, z, 3.3, R.pick(['#6B4A33', '#3F5F4F', '#7A2E2A', '#2F4A6A']));
      else if (shopHere) { const q = K.on(face, p + 0.06, m - bw * 0.95, m + bw * 0.95, z + 0.5, z + 3.2); g.fill(q, '#8FA6B0'); g.fill(K.on(face, p + 0.07, m - bw * 0.95, m + bw * 0.95, z + 0.5, z + 1.1), d.sc || '#5A4A3C'); g.outline(q, { w: 0.35, c: '#3A3128', boil: false, ext: 0 }); }
      else LX.win(g, face, p, m - bw * 0.6, m + bw * 0.6, z + 1.4, z + 3.3, { glass: '#6A7F8C' });
    }
    if (shopHere) K.sign(g, face, p, a0 + 0.5, a1 - 0.5, z + 3.45, z + 4.25, d.sc || '#2F4A3A', d.shop, { ink: '#F7F1DC' });
    // upper floors: tall French windows, the first floor with balconies
    for (let s = 1; s < n; s++) {
      const z0 = z + LX.GF + (s - 1) * LX.STOREY + 0.45;
      for (let b = 0; b < nb; b++) {
        const m = a0 + len * (b + 0.5) / nb, bal = (s === 1 && R() < (d.bal == null ? 0.7 : d.bal)) || R() < 0.15;
        LX.win(g, face, p, m - bw * 0.5, m + bw * 0.5, z0 + (bal ? 0 : 0.5), z0 + 2.9, { bal, shut, pot: bal && R() < 0.35 ? R.pick(LC.festa) : null });
      }
    }
    if (d.wash && face === (d.washFace || 'L') && n > 1) { const s = R.int(1, n - 1), zw = z + LX.GF + (s - 1) * LX.STOREY + 0.4; LX.washing(g, face, p, a0 + 0.6, a1 - 0.6, zw, (d.seed || 1) + s); }
  }
  // the roof
  const roof = d.roof || 'hip';
  if (roof === 'hip') {
    const rh = d.rh || Math.min(3.0, Math.min(d.x1 - d.x0, d.y1 - d.y0) * 0.32);
    LX.roof(g, d.x0, d.y0, d.x1, d.y1, zt, rh, {});
    if (R() < 0.6) LX.chimney(g, lerp(d.x0, d.x1, 0.3 + R() * 0.2), lerp(d.y0, d.y1, 0.35 + R() * 0.2), zt + rh * 0.45);
  } else if (roof === 'flat') {   // a roof terrace (açoteia) behind a low parapet
    K.box(g, d.x0, d.y0, d.x1, d.y1, zt, zt + 0.9, { t: '#D9CFBC', l: shade(tones.l, 0.04), r: shade(tones.r, 0.04) }, { w: 0.55, nt: true, faces: 'lr' });
    g.fill(K.rect(d.x0 + 0.3, d.y0 + 0.3, d.x1 - 0.3, d.y1 - 0.3, zt + 0.02), '#D9CFBC');
  }
  return zt;
};

/* ---------------- terraces, parapets, stairs ---------------- */
/* raised ground: a block of stone retaining walls with coursing, its top paved (o.top) */
LX.terrace = function (g, x0, y0, x1, y1, z0, z1, o) {
  o = o || {}; const top = o.top || LC.calc;
  g.boilP = 0.2;
  K.box(g, x0, y0, x1, y1, z0, z1, { t: top, l: LC.wall, r: LC.wallD }, { w: 0.85 });
  const segs = [];
  for (let z = z0 + 0.9; z < z1 - 0.2; z += 0.9) {
    const a = g.p(x0, y1, z), b = g.p(x1, y1, z), c = g.p(x1, y0, z); segs.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]);
    const k = Math.round(z / 0.9);
    for (let x = x0 + (k % 2 ? 0.8 : 1.8); x < x1 - 0.5; x += 2.0) { const p = g.p(x, y1, z), q = g.p(x, y1, Math.min(z1, z + 0.9)); segs.push(p[0], p[1], q[0], q[1]); }
    for (let y = y0 + (k % 2 ? 0.8 : 1.8); y < y1 - 0.5; y += 2.0) { const p = g.p(x1, y, z), q = g.p(x1, y, Math.min(z1, z + 0.9)); segs.push(p[0], p[1], q[0], q[1]); }
  }
  g.segs2(segs, '#B5A585', 0.28);
  if (o.scuff !== false) g.scuff(K.rect(x0, y0, x1, y1, z1), { dir: Math.atan2(AY, AX), len: 2.2, c: LC.calcS, dens: 0.35, w: 0.45, spread: 0.6 });
};
/* a low parapet wall with a white coping along a terrace edge at height z: face 'L' (along x at y = p) or 'R' (along y) */
LX.parapet = function (g, face, p, a0, a1, z, o) {
  o = o || {}; const t = 0.6, h = o.h || 1.2, col = o.col || LC.wallT;
  if (face === 'L') K.box(g, a0, p - t, a1, p, z, z + h, { t: '#F7F4EC', l: col, r: shade(col, 0.1) }, { w: 0.6, boil: false });
  else K.box(g, p - t, a0, p, a1, z, z + h, { t: '#F7F4EC', l: col, r: shade(col, 0.1) }, { w: 0.6, boil: false });
  if (o.az) LX.azulejo(g, face, p, a0 + 0.3, a1 - 0.3, z + 0.15, z + h - 0.2, o.az, o.seed || 3);
};
/* a flight of steps climbing from z0 to z1. axis 'y': it climbs towards -y over [y0, y1] (risers face +y, lit);
   axis 'x': it climbs towards -x (risers face +x). Side walls on the visible side. */
LX.steps = function (g, x0, y0, x1, y1, z0, z1, axis, o) {
  o = o || {}; const n = Math.max(2, Math.round((z1 - z0) / 0.45)), tread = o.tread || '#EEE9DD', riser = o.riser || '#CFC6B2';
  if (axis === 'y') {
    const L = y1 - y0;
    for (let i = n - 1; i >= 0; i--) {          // from the top step down to the bottom one
      const ya = y0 + L * i / n, yb = y0 + L * (i + 1) / n, zt = z1 - (z1 - z0) * i / n, zr = z1 - (z1 - z0) * (i + 1) / n;
      g.fill(K.rect(x0, ya, x1, yb, zt), tread); g.fill([[x0, yb, zr], [x1, yb, zr], [x1, yb, zt], [x0, yb, zt]], riser);
      g.fine([[x0, yb, zt], [x1, yb, zt]], { w: 0.25, c: '#9C9077' });
    }
    g.fill([[x1, y0, z1], [x1, y0, z0], [x1, y1, z0]], LC.wallD); g.line([[x1, y0, z1], [x1, y1, z0]], { w: 0.6, boil: false });
  } else {
    const L = x1 - x0;
    for (let i = n - 1; i >= 0; i--) {
      const xa = x0 + L * i / n, xb = x0 + L * (i + 1) / n, zt = z1 - (z1 - z0) * i / n, zr = z1 - (z1 - z0) * (i + 1) / n;
      g.fill(K.rect(xa, y0, xb, y1, zt), tread); g.fill([[xb, y0, zr], [xb, y1, zr], [xb, y1, zt], [xb, y0, zt]], shade(riser, 0.06));
      g.fine([[xb, y0, zt], [xb, y1, zt]], { w: 0.25, c: '#9C9077' });
    }
    g.fill([[x0, y1, z1], [x0, y1, z0], [x1, y1, z0]], LC.wall); g.line([[x0, y1, z1], [x1, y1, z0]], { w: 0.6, boil: false });
  }
};

/* ---------------- pavements ---------------- */
/* calçada portuguesa: white limestone with black basalt wave bands (Rossio's "mar largo"). axis: the waves run along x or y */
LX.waves = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const axis = o.axis || 'x', amp = o.amp || 2.2, wl = o.wl || 9, band = o.band || 2.1, gap = o.gap || 4.4, z = o.z || 0.02;
  g.fill(K.rect(x0, y0, x1, y1, z - 0.01), LC.calc);
  const A0 = axis === 'x' ? x0 : y0, A1 = axis === 'x' ? x1 : y1, B0 = axis === 'x' ? y0 : x0, B1 = axis === 'x' ? y1 : x1;
  const W = (a, b) => (axis === 'x' ? [a, b, z] : [b, a, z]);
  for (let b = B0 - amp; b < B1 + amp; b += gap) {
    const top = [], bot = [];
    const n = Math.max(24, Math.ceil((A1 - A0) / wl * 12));
    for (let i = 0; i <= n; i++) {
      const a = lerp(A0, A1, i / n), off = Math.sin((a - A0) / wl * TAU) * amp;
      top.push(W(a, clamp(b + off, B0, B1))); bot.push(W(a, clamp(b + off + band, B0, B1)));
    }
    g.fill(top.concat(bot.reverse()), LC.basalt);
  }
  g.scuff(K.rect(x0, y0, x1, y1, z), { dir: Math.atan2(AY, AX), len: 1.4, c: '#FBFAF5', dens: 0.25, w: 0.4, spread: 1 });
};
/* a plain calçada pavement: white with a black border line (o.edge: which edges get it) */
LX.pave = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const z = o.z || 0;
  g.fill(K.rect(x0, y0, x1, y1, z), o.col || LC.calc);
  g.scuff(K.rect(x0, y0, x1, y1, z), { dir: Math.atan2(AY, AX), len: 1.8, c: LC.calcS, dens: 0.3, w: 0.4, spread: 0.8 });
  const e = o.edge || '', inset = 0.8, bw = 0.34;
  if (e.indexOf('n') >= 0) g.fill(K.rect(x0, y0 + inset, x1, y0 + inset + bw, z + 0.01), LC.basalt);
  if (e.indexOf('s') >= 0) g.fill(K.rect(x0, y1 - inset - bw, x1, y1 - inset, z + 0.01), LC.basalt);
  if (e.indexOf('w') >= 0) g.fill(K.rect(x0 + inset, y0, x0 + inset + bw, y1, z + 0.01), LC.basalt);
  if (e.indexOf('e') >= 0) g.fill(K.rect(x1 - inset - bw, y0, x1 - inset, y1, z + 0.01), LC.basalt);
};

/* ---------------- plants ---------------- */
/* a jacaranda in June bloom: a dark crooked trunk, a wide lacy cloud of violet with paler flecks */
LX.jacaranda = function (g, x, y, o) {
  o = o || {}; const r = (o.r || 4.6) * 3.3, h = o.h == null ? 5.0 : o.h, f = g.p(x, y, o.z || 0), top = [f[0] + 0.6, f[1] - h * VZ], R = RNG(o.seed || Math.round(x * 37 + y * 11 + 5));
  const col = o.col || LC.jac, dk = shade(col, 0.16), ink = '#5E4A8A';
  g.fill2([[f[0] - 0.9, f[1]], [f[0] + 0.9, f[1]], [top[0] + 0.55, top[1]], [top[0] - 0.55, top[1]]], '#4E3E36');
  g.line2([[top[0], top[1] + 1.4], [top[0] - r * 0.4, top[1] - r * 0.3]], { w: 0.8, c: '#4E3E36', boil: false }); g.line2([[top[0], top[1] + 1], [top[0] + r * 0.42, top[1] - r * 0.4]], { w: 0.75, c: '#4E3E36', boil: false });
  const cy = top[1] - r * 0.5, lobes = [[-r * 0.48, r * 0.06, r * 0.56], [r * 0.46, 0, r * 0.55], [0, -r * 0.3, r * 0.62], [r * 0.02, r * 0.18, r * 0.5]];
  lobes.map(([dx, dy, rr]) => { const pts = []; const a0 = R() * TAU; for (let k = 0; k < 10; k++) { const a = a0 + TAU * k / 10, q = rr * (0.84 + R() * 0.26); pts.push([top[0] + dx + Math.cos(a) * q, cy + dy + Math.sin(a) * q * 0.78]); } return pts; })
    .map((b) => ({ b, cy: b.reduce((s, p) => s + p[1], 0) / b.length })).sort((p, q) => p.cy - q.cy).forEach(({ b }) => {
      const cxx = b.reduce((s, p) => s + p[0], 0) / b.length, cyy = b.reduce((s, p) => s + p[1], 0) / b.length;
      g.fill2(b, col);
      const sh = b.filter((p) => (p[0] - cxx) * 0.5 + (p[1] - cyy) > 0); if (sh.length > 2) g.fill2(sortAround(sh.concat([[cxx, cyy + 1]])), dk);
      g.outline2(b, { c: ink, w: 0.55, ext: 0.2 });
    });
  const fl = []; for (let i = 0; i < 22; i++) { const a = R() * TAU, d = R() * r * 0.8, px = top[0] + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.72; fl.push(px - 0.35, py, px + 0.35, py); }
  g.segs2(fl, '#D9CCF2', 0.7);
  const tw = []; for (let i = 0; i < 10; i++) { const a = R() * TAU, d = R() * r * 0.7, px = top[0] + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.7; tw.push(px, py, px + 0.9, py - 0.5); }
  g.segs2(tw, ink, 0.4);
  if (o.fallen) { const pts = []; for (let i = 0; i < 26; i++) { const a = R() * TAU, d = Math.sqrt(R()) * (o.r || 4.6) * 1.1, q = g.p(x + Math.cos(a) * d, y + Math.sin(a) * d, o.z || 0); pts.push(q[0] - 0.3, q[1], q[0] + 0.3, q[1]); } g.segs2(pts, col, 0.6); }
};
/* a stone pine (umbrella pine): a tall bare leaning trunk under a wide flat dark canopy */
LX.pine = function (g, x, y, o) {
  o = o || {}; const h = o.h || 9, r = (o.r || 5.2) * 3.3, lean = o.lean || 0.9, f = g.p(x, y, o.z || 0), top = [f[0] + lean * 3.3, f[1] - h * VZ], R = RNG(o.seed || Math.round(x * 41 + y * 13 + 3));
  g.fill2([[f[0] - 0.9, f[1]], [f[0] + 0.9, f[1]], [top[0] + 0.45, top[1]], [top[0] - 0.45, top[1]]], '#7A5A44');
  g.line2([[f[0] + 0.9, f[1]], [top[0] + 0.45, top[1]]], { w: 0.5, c: '#4E3A2C', boil: false });
  g.line2([[top[0], top[1] + 3], [top[0] - r * 0.35, top[1] - 1]], { w: 0.6, c: '#5E4636', boil: false }); g.line2([[top[0], top[1] + 2], [top[0] + r * 0.4, top[1] - 1.5]], { w: 0.6, c: '#5E4636', boil: false });
  // the canopy: a wide flat dome of clumps, darker underneath
  const clumps = [[0, -2.6, 1.0, 0.5], [-0.55, -1.0, 0.62, 0.42], [0.55, -1.2, 0.6, 0.42], [-0.15, -3.6, 0.7, 0.36], [0.3, 0.2, 0.55, 0.3]];
  for (const [dx, dy, rr, ry] of clumps) {
    const cx = top[0] + dx * r, cy = top[1] + dy * 3.3, pts = [];
    for (let k = 0; k < 14; k++) { const a = TAU * k / 14, q = rr * r * (0.9 + R() * 0.16); pts.push([cx + Math.cos(a) * q, cy + Math.sin(a) * q * ry]); }
    g.fill2(pts, LC.pine); g.fill2(pts.filter((p) => p[1] > cy - 0.3).concat([[cx - rr * r * 0.9, cy + 0.2]]).sort((p, q) => p[0] - q[0]).concat([[cx + rr * r * 0.95, cy - 0.2]]), LC.pineD);
    g.outline2(pts, { c: '#3A4E26', w: 0.55, ext: 0.2 });
  }
  const tf = []; for (let i = 0; i < 22; i++) { const a = R() * TAU, d = R() * r * 0.8, px = top[0] + Math.cos(a) * d, py = top[1] - 8.6 + Math.sin(a) * d * 0.3; tf.push(px - 0.8, py, px + 0.8, py - 0.3); }
  g.segs2(tf, '#7F9F5E', 0.5);
};
/* a basil pot (manjerico) with its paper carnation and little flag, at wide-px point c */
LX.manjerico2 = function (g, c, k, flower) {
  k = k || 1;
  g.fill2([[c[0] - 0.8 * k, c[1]], [c[0] + 0.8 * k, c[1]], [c[0] + 1.0 * k, c[1] - 1.4 * k], [c[0] - 1.0 * k, c[1] - 1.4 * k]], '#B8643C', true);
  g.disc2([c[0], c[1] - 2.4 * k], 1.4 * k, '#5E9A4A'); g.disc2([c[0] - 0.4 * k, c[1] - 2.8 * k], 0.8 * k, '#7FB65E');
  g.segs2([c[0] + 0.3 * k, c[1] - 2.6 * k, c[0] + 0.5 * k, c[1] - 5 * k], '#3A5A2A', 0.3);
  g.disc2([c[0] + 0.5 * k, c[1] - 5.2 * k], 0.7 * k, flower || '#E2483D');
};

/* ---------------- festival ---------------- */
/* a paper garland sagging between two wide-px points: a string with little paper flags in the festival colours */
LX.garland2 = function (g, a, b, seed, o) {
  o = o || {}; const R = RNG(seed * 13 + 1), sag = o.sag == null ? 6 : o.sag, n = o.n || Math.max(4, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 3.2));
  const at = (t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t) + sag * 4 * t * (1 - t)];
  const ln = []; for (let i = 0; i <= 12; i++) ln.push(at(i / 12)); g.fine2(ln, { w: 0.25, c: '#4A4540' });
  const cols = o.cols || LC.festa, off = R.int(0, 6);
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, p = at(t), c = cols[(i + off) % cols.length], s = o.s || 1;
    if (o.balloons && i % 3 === 1) { g.disc2([p[0], p[1] + 2.0 * s], 1.4 * s, c); g.fill2([[p[0] - 0.9 * s, p[1] + 0.5 * s], [p[0] + 0.9 * s, p[1] + 0.5 * s], [p[0] + 0.6 * s, p[1] + 0.9 * s], [p[0] - 0.6 * s, p[1] + 0.9 * s]], '#3A3530', true); continue; }
    g.fill2([[p[0] - 0.85 * s, p[1]], [p[0] + 0.85 * s, p[1]], [p[0] + (R() - 0.5) * 0.4, p[1] + 2.1 * s]], c, true);
  }
};
/* a sardine brazier: a steel trough on legs, glowing coals, a grate of sardines (drawn around x, y) */
LX.grill = function (g, x, y, o) {
  o = o || {}; const ax = o.axis || 'x', L = o.L || 1.8, Wd = 0.75, z = 2.6;
  const box = ax === 'x' ? [x - L, y - Wd, x + L, y + Wd] : [x - Wd, y - L, x + Wd, y + L];
  const legs = []; for (const [px, py] of [[box[0] + 0.2, box[3] - 0.1], [box[2] - 0.2, box[3] - 0.1], [box[2] - 0.1, box[1] + 0.2]]) { const a = g.p(px, py, 0), b = g.p(px, py, z); legs.push(a[0], a[1], b[0], b[1]); }
  g.segs2(legs, '#2E2A26', 0.5);
  K.box(g, box[0], box[1], box[2], box[3], z, z + 0.7, { t: '#2E2A26', l: '#5A5550', r: '#47433F' }, { w: 0.5, boil: false });
  const R = RNG(Math.round(x * 7 + y * 3)), coal = [];
  for (let i = 0; i < 14; i++) { const p = g.p(lerp(box[0] + 0.3, box[2] - 0.3, R()), lerp(box[1] + 0.2, box[3] - 0.2, R()), z + 0.72); coal.push(p[0] - 0.35, p[1], p[0] + 0.35, p[1]); }
  g.segs2(coal, '#F07A2A', 0.7);
  const fish = [];
  const n = Math.round(L * 2.4);
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, cx = ax === 'x' ? lerp(box[0] + 0.2, box[2] - 0.2, t) : x, cy = ax === 'x' ? y : lerp(box[1] + 0.2, box[3] - 0.2, t);
    const a = ax === 'x' ? g.p(cx, cy - 0.6, z + 0.85) : g.p(cx - 0.6, cy, z + 0.85), b = ax === 'x' ? g.p(cx, cy + 0.6, z + 0.85) : g.p(cx + 0.6, cy, z + 0.85);
    fish.push([a, b]);
  }
  for (const [a, b] of fish) { g.line2([a, b], { w: 1.25, c: '#8C9AA0', boil: false, ext: 0, taper: 0.5 }); g.segs2([a[0], a[1], lerp(a[0], b[0], 0.3), lerp(a[1], b[1], 0.3)], '#4E5A60', 0.5); }
};
/* grill smoke: a few soft puffs rising and drifting, keyed by phase (an actor's draw at its origin) */
LX.smoke2 = function (g, ph, k) {
  k = k || 1; const o = g.p(0, 0, 0);
  for (let i = 0; i < 4; i++) {
    const u = (ph + i / 4) % 1, x = Math.sin(u * 5 + i) * 2 * k + u * 6 * k, y = -4 * k - u * 22 * k, r = (1.6 + u * 3.6) * k, a = 0.62 * (1 - u * 0.8);
    g.fill2(arcPts(o[0] + x, o[1] + y, r, 0, TAU, 10), 'rgba(176,170,160,' + a.toFixed(2) + ')', true);
  }
};

/* ---------------- people ---------------- */
const LX_TOPS = ['#F7F5EF', '#E2483D', '#3F8FD2', '#F2C230', '#5DB26A', '#E77FB3', '#7FB7D9', '#2F3A4F', '#F08A3A', '#E9DCC0', '#C9584B', '#A4C66B', '#5A6B8A', '#F3E3C0', '#3B3F47', '#9C7FCF'];
const LX_BOTS = ['#3F4D63', '#E9E2D0', '#2F343B', '#7A6A55', '#4A5A78', '#B9A27D', '#F3F1EA', '#5A4A3C'];
/* a Lisboeta or a summer visitor */
LX.who = function (seed, o) {
  const R = RNG(seed * 6151 + 5), w = K.who(seed);
  const tourist = R() < 0.3;
  w.top = R.pick(LX_TOPS); w.bot = R.pick(LX_BOTS); w.bare = R() < 0.72; w.shorts = R() < (tourist ? 0.5 : 0.15);
  w.skin = tourist ? R.pick([SKIN[0], SKIN[0], SKIN[1], SKIN[2], SKIN[4]]) : R.pick([SKIN[1], SKIN[1], SKIN[2], SKIN[2], SKIN[3], SKIN[0], SKIN[5]]);
  if (!tourist) w.hair = R.pick(['#2B2420', '#3D2B1F', '#3D2B1F', '#5A3A24', '#1F1A18', '#8E8A84']);
  if (R() < 0.16) w.dress = R.pick(['#F7F5EF', '#E77FB3', '#7FB7D9', '#F2C230', '#E2483D', '#A4C66B']);
  if (tourist && R() < 0.4) w.hat = R.pick(['#E9D8A6', '#F3F1EA', '#E9D8A6']);
  w.cap = tourist && !w.hat && R() < 0.3 ? R.pick(['#3F8FD2', '#E2483D', '#F3F1EA']) : undefined;
  w.glasses = R() < (tourist ? 0.3 : 0.1);
  return Object.assign(w, o || {});
};
/* K.person plus: a straw hat, a sardine on bread or a beer in the hand, an accordion */
LX.person = function (g, x, y, z, w) {
  const r = K.person(g, x, y, z, w), k = w.k || 1, sg = ((w.dir | 0) === 0 || (w.dir | 0) === 3) ? 1 : -1;
  if (w.hat) { const c = r.crown; g.fill2([[c[0] - 3.0 * k, c[1] + 1.0 * k], [c[0] + 3.0 * k, c[1] + 1.0 * k], [c[0] + 2.2 * k, c[1] + 0.3 * k], [c[0] - 2.2 * k, c[1] + 0.3 * k]], w.hat, true); g.fill2([[c[0] - 1.5 * k, c[1] + 0.6 * k], [c[0] + 1.5 * k, c[1] + 0.6 * k], [c[0] + 1.2 * k, c[1] - 1.1 * k], [c[0] - 1.2 * k, c[1] - 1.1 * k]], w.hat, true); g.fill2([[c[0] - 1.5 * k, c[1] + 0.6 * k], [c[0] + 1.5 * k, c[1] + 0.6 * k], [c[0] + 1.5 * k, c[1] + 0.05 * k], [c[0] - 1.5 * k, c[1] + 0.05 * k]], '#3A3530', true); }
  const hd = r.hands[0];
  if (w.sardine) { g.fill2([[hd[0] - 1.6, hd[1] - 0.2], [hd[0] + 1.6, hd[1] - 0.2], [hd[0] + 1.4, hd[1] + 0.6], [hd[0] - 1.4, hd[1] + 0.6]], '#E2C08A', true); g.fill2([[hd[0] - 1.7, hd[1] - 0.5], [hd[0] + 1.3, hd[1] - 0.8], [hd[0] + 1.9, hd[1] - 0.2], [hd[0] - 1.5, hd[1] - 0.1]], '#8C9AA0', true); }
  if (w.beer) { g.fill2([[hd[0] - 0.55, hd[1] - 1.6], [hd[0] + 0.55, hd[1] - 1.6], [hd[0] + 0.45, hd[1] + 0.3], [hd[0] - 0.45, hd[1] + 0.3]], '#F2C25A', true); g.fill2([[hd[0] - 0.6, hd[1] - 1.9], [hd[0] + 0.6, hd[1] - 1.9], [hd[0] + 0.55, hd[1] - 1.5], [hd[0] - 0.55, hd[1] - 1.5]], '#FBF8EE', true); }
  if (w.phone) g.fill2([[hd[0] - 0.45, hd[1] - 1.2], [hd[0] + 0.45, hd[1] - 1.2], [hd[0] + 0.45, hd[1] + 0.3], [hd[0] - 0.45, hd[1] + 0.3]], '#2A2622', true);
  if (w.accordion) { const hp = r.hip, sp = r.shoulders, mx = (sp[0][0] + sp[1][0]) / 2, my = lerp(sp[0][1], hp[1], 0.55), ph = w.squeeze || 0, half = 2.0 + ph * 0.8; g.fill2([[mx - half, my - 2.6], [mx + half, my - 2.6], [mx + half, my + 2.4], [mx - half, my + 2.4]], '#C9463E', true); const fo = []; for (let i = 1; i < 5; i++) { const xx = mx - half + 2 * half * i / 5; fo.push(xx, my - 2.5, xx, my + 2.3); } g.segs2(fo, '#7A2A22', 0.3); g.fill2([[mx - half - 1.0, my - 2.8], [mx - half, my - 2.8], [mx - half, my + 2.6], [mx - half - 1.0, my + 2.6]], '#F3F1EA', true); }
  return r;
};

/* ---------------- vehicles ---------------- */
/* draw text along a vehicle face so it reads left to right on screen. B: an rbox; f: its face; u0..u1 in u */
LX.vtext = function (g, B, f, u, z0, h, str, col) {
  const v = f === 'pv' ? B.hw + 0.04 : -B.hw - 0.04, s0 = g.p.apply(g, B.pt(-1, v, 0)), s1 = g.p.apply(g, B.pt(1, v, 0)), sg = s1[0] > s0[0] ? 1 : -1;
  K.textP(g, (a, z) => B.pt(sg * a, v, z), sg * u, z0, h, str, col, { center: true });
};
/* text across a vehicle's end face (pu / nu), reading left to right on screen */
LX.etext = function (g, B, f, z0, h, str, col) {
  const u = f === 'pu' ? B.hl + 0.06 : -B.hl - 0.06, s0 = g.p.apply(g, B.pt(u, -1, 0)), s1 = g.p.apply(g, B.pt(u, 1, 0)), sg = s1[0] > s0[0] ? 1 : -1;
  K.textP(g, (a, z) => B.pt(u, sg * a, z), 0, z0, h, str, col, { center: true });
};
/* the Remodelado tram, centred on the origin, heading ang: yellow below, a cream window band, a grey roof with its
   lantern, a trolley pole trailing back to the wire, the 28 on its ends. o.dest: destination, o.riders: seed */
LX.tram = function (g, ang, o) {
  o = o || {}; const hl = 6.8, hw = 2.15, ca = Math.cos(ang), sa = Math.sin(ang), Y = LC.tram, YD = LC.tramD;
  const sh = K.rbox(g, 0, 0, hl, hw, ang, 0, 0.01, Y, { line: false, nt: true }); K.shadow(g, sh, 0.5);
  K.rbox(g, 0, 0, hl * 0.45, hw * 0.8, ang, 0.2, 1.0, { t: '#3A3530', l: '#3F3A34', r: '#2E2A26' }, { line: false });
  const B = K.rbox(g, 0, 0, hl, hw, ang, 0.9, 7.0, { t: '#E9E4D6', l: Y, r: YD }, { w: 0.85, nb: true, nt: true });
  const R = RNG(o.riders || 1);
  for (const f of ['pv', 'nv']) if (B.vis[f]) {
    const tone = B.tone[f], cr = mix(LC.cream, shade(LC.cream, 0.12), f === 'nv' ? 0.4 : 0);
    g.fill(B.quad(f, -1, 1, 4.0, 6.5), cr);
    g.fill(B.quad(f, -1, 1, 0.9, 1.25), '#8A6A1E');
    g.fine([B.quad(f, -1, 1, 3.95, 3.95)[0], B.quad(f, -1, 1, 3.95, 3.95)[1]], { w: 0.4, c: '#7A5A1A' });
    // windows between cream pillars; heads of riders in some of them
    const nw = 7;
    for (let i = 0; i < nw; i++) {
      const a0 = -0.9 + 1.8 * i / nw + 0.035, a1 = -0.9 + 1.8 * (i + 1) / nw - 0.035, q = B.quad(f, a0, a1, 4.35, 6.2);
      g.fill(q, '#5F7380');
      if (R() < 0.55) { const m = g.p.apply(g, B.pt(hl * (a0 + a1) / 2, (f === 'pv' ? 1 : -1) * hw * 0.6, 5.1)); g.disc2(m, 1.1, R.pick(SKIN.slice(0, 5))); g.fill2(arcPts(m[0], m[1] - 0.2, 1.15, Math.PI, TAU, 6), R.pick(['#2B2420', '#5A3A24', '#8E8A84', '#D9B560']), true); }
      g.outline(q, { w: 0.3, c: '#5A4A2A', boil: false, ext: 0 });
    }
    LX.vtext(g, B, f, 0, 1.7, 1.15, 'CARRIS', '#5A3A10');
    void tone;
  }
  for (const f of ['pu', 'nu']) if (B.vis[f]) {
    g.fill(B.quad(f, -1, 1, 4.0, 6.5), shade(LC.cream, 0.05));
    g.fill(B.quad(f, -0.75, 0.75, 4.2, 6.2), '#4E6270');
    g.fill(B.quad(f, -0.5, 0.5, 6.55, 6.95), '#2E2A26');
    LX.etext(g, B, f, 6.6, 0.3, '28', '#F2C230');
    g.disc2(g.p.apply(g, B.pt(f === 'pu' ? hl + 0.06 : -hl - 0.06, 0, 2.6)), 0.55, f === 'pu' ? '#F6E7A8' : '#D0483A');
    g.fill(B.quad(f, -1, 1, 0.9, 1.25), '#8A6A1E');
  }
  // the roof and its raised lantern, the trolley pole
  const roof = K.rbox(g, 0, 0, hl + 0.15, hw + 0.15, ang, 7.0, 7.45, { t: '#D9D5CB', l: '#C9C4B9', r: '#B9B4A8' }, { w: 0.7 });
  K.rbox(g, 0, 0, hl * 0.6, hw * 0.45, ang, 7.45, 8.0, { t: '#E4E0D6', l: '#CFCABE', r: '#BDB8AC' }, { w: 0.5, nb: true });
  const back = o.back == null ? -1 : o.back, base = g.p(back * hl * 0.55 * ca, back * hl * 0.55 * sa, 8.0), tip = g.p(back * hl * 1.35 * ca, back * hl * 1.35 * sa, 12.6);
  g.line2([base, tip], { w: 0.5, c: '#2E2A26', boil: false, ext: 0 }); g.disc2(tip, 0.45, '#2E2A26');
  void roof;
};
/* the overhead wire: a fine line at height 12.6 along world points (z ignored) */
LX.wire = function (g, pts) { g.fine(pts.map((p) => [p[0], p[1], 12.6]), { w: 0.3, c: '#4A4540' }); };
/* a tuk-tuk full of tourists, heading ang */
LX.tuk = function (g, ang, o) {
  o = o || {}; const col = o.col || '#3E9A6A', ca = Math.cos(ang), sa = Math.sin(ang), L = 2.9, Wd = 1.45;
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  K.wheels(g, sh, [-L * 0.62, L * 0.7], 0.6, 'far');
  const B = K.rbox(g, -0.4 * ca, -0.4 * sa, L - 0.4, Wd, ang, 0.6, 2.2, { t: shade(col, -0.15), l: col, r: shade(col, 0.15) }, { w: 0.7 });
  const dir = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2);
  const seats = [[-1.4, -0.65], [-1.4, 0.65], [0.3, -0.6], [0.3, 0.6]];
  (o.riders || []).forEach((w, i) => { if (i >= seats.length) return; const [u, v] = seats[i]; K.person(g, u * ca - v * sa, u * sa + v * ca, 2.2, Object.assign({}, w, { dir, pose: 'sit', noLegs: true, k: 0.82 })); });
  if (o.driver) K.person(g, 1.9 * ca, 1.9 * sa, 2.2, Object.assign({}, o.driver, { dir, pose: 'sit', noLegs: true, k: 0.85 }));
  const posts = []; for (const [u, v] of [[-L + 0.3, -Wd + 0.2], [-L + 0.3, Wd - 0.2], [L - 0.6, -Wd + 0.2], [L - 0.6, Wd - 0.2]]) { const a = g.p(u * ca - v * sa, u * sa + v * ca, 2.2), b = g.p(u * ca - v * sa, u * sa + v * ca, 5.4); posts.push(a[0], a[1], b[0], b[1]); }
  g.segs2(posts, '#2E2A26', 0.45);
  K.wheels(g, sh, [-L * 0.62, L * 0.7], 0.6, 'near', { arch: '#2E2A26' });
  K.rbox(g, -0.2 * ca, -0.2 * sa, L + 0.2, Wd + 0.2, ang, 5.4, 5.9, o.roof || { t: '#F3F1EA', l: '#E9E4D8', r: '#D9D3C6' }, { w: 0.6 });
  const nose = K.rbox(g, (L - 0.2) * ca, (L - 0.2) * sa, 0.5, Wd * 0.8, ang, 0.6, 3.2, { t: shade(col, -0.15), l: col, r: shade(col, 0.15) }, { w: 0.6 });
  void nose;
};
/* a Lisbon taxi: cream (o.old: black with a green roof) with a TÁXI lamp */
LX.taxi = function (g, ang, o) {
  o = o || {}; const old = o.old;
  K.car(g, ang, { col: old ? '#2E2E2C' : '#EDE4C9', L: 5.1, W: 2.3, roof: (gg, cab) => { if (old) gg.fill([cab.pt(-cab.hl, -cab.hw, 4.82), cab.pt(cab.hl, -cab.hw, 4.82), cab.pt(cab.hl, cab.hw, 4.82), cab.pt(-cab.hl, cab.hw, 4.82)], '#4F8A5A'); K.rbox(gg, cab.cx, cab.cy, 0.45, 1.0, ang + Math.PI / 2, 4.8, 5.5, '#F3F1EA', { w: 0.45, nb: true }); } });
};
/* the cacilheiro: the orange river ferry */
LX.ferry = function (g, ang) {
  K.boat(g, ang, { kind: 'ferry', L: 9.5, W: 3.0, hull: '#E8742E', stripe: '#F3F1EA', deck: '#CFC6B4', stackCol: { t: '#2E2A26', l: '#E8742E', r: '#C95E22' } });
};
/* a walker whose route can be bent (pts world-local), with LX looks: K.walker drawn with LX.person */
LX.walker = function (T, who, pts, speed, o) {
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
    draw(g, st) { LX.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
};
/* a static actor (a flag, a garland over a square): layer top, present with the place */
LX.still = function (T, x, y, z, fn, o) {
  return T.actor(Object.assign({ sample: 5, grow: false, at() { return { x, y, z, key: 0 }; }, draw: fn }, o || {}));
};
