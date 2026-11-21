'use strict';
/* Chongqing's own kit: the palette of a damp March morning in the mountain city, retaining walls and stone stairs,
   concrete residential blocks (window cages, air conditioners, laundry poles), old houses with grey tile roofs, timber
   stilt houses (diaojiaolou), the huangjue fig, the people (bangbang porters with bamboo poles, old men with
   birdcages, mahjong players, noodle eaters), hotpot tables and their red steam, vehicles (yellow taxis, buses,
   motorbikes, the Line 2 monorail, cable-car cabins, river boats). Everything in tile-local u unless the name ends
   in 2 (wide px). Chinese lettering is in src/37_hanzi.js (CQH). */
const CQ = {};
const CQC = {
  asph: '#CFCAC0', asphS: '#DCD8CE', pave: '#E2DED3', paveS: '#D0CABD', line: '#F4F2EA',
  stone: '#CDC6B6', stoneS: '#B9B19F', stoneD: '#A39B89', wall: '#C2BAA8', wallD: '#A9A190', wallT: '#D9D3C4', moss: '#93A876',
  jl: '#9FC2B3', jlD: '#83A898', jlL: '#BAD5CA',               // the Jialing: clearer, green
  yz: '#BFAE8E', yzD: '#A59474', yzL: '#D6CAB0',               // the Yangtze: brown with silt
  shoal: '#D9D0BE', shoalD: '#C2B8A2',
  plaster: '#E7E3D9', concrete: '#C9C8C1', concreteD: '#AEADA6', grey: '#A9A8A2', brick: '#A87A64', brickG: '#8F8C86',
  timber: '#6F4F3B', timberL: '#8C6749', timberD: '#55392A', roof: '#71747A', roofD: '#5A5D63',
  red: '#C8392E', redD: '#9E2A22', lantern: '#D9442F', gold: '#E0B64A', glass: '#B8CCD6', win: '#56606A',
  fig: '#8DAE62', figD: '#6A8C49', figL: '#B5CF84', blossom: '#F1D5DD', mag: '#F6F1E6',
};
CQ.SHOPS = [['火锅', CQC.red], ['小面', '#E6B84A'], ['茶馆', '#3F6B4E'], ['重庆', '#2F4A6B'], ['火锅', '#B8322A'], ['小面', '#D9732F']];

/* ---------------- ground, walls, stairs ---------------- */
/* paving scuffs in a rectangle at height z */
CQ.paving = function (g, x0, y0, x1, y1, z, o) {
  o = o || {}; const p = K.rect(x0, y0, x1, y1, z || 0);
  g.scuff(p, { dir: Math.atan2(AY, AX), len: o.len || 2.4, c: o.c || CQC.paveS, dens: o.dens || 0.45, w: 0.45, spread: 0.5 });
};
/* raised ground: a block of retaining wall (big stone courses, weep holes, moss streaks), its top paved */
CQ.terrace = function (g, x0, y0, x1, y1, z0, z1, o) {
  o = o || {}; g.boilP = 0.25;
  K.box(g, x0, y0, x1, y1, z0, z1, { t: o.top || CQC.pave, l: o.wall || CQC.wall, r: o.wallR || CQC.wallD }, { w: 0.9 });
  const segs = [], R = RNG(Math.round(x0 * 13 + y1 * 7 + z1));
  for (let z = z0 + 1.6; z < z1 - 0.3; z += 1.6) {
    const a = g.p(x0, y1, z), b = g.p(x1, y1, z), c = g.p(x1, y0, z); segs.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]);
    const k = Math.round(z / 1.6);
    for (let x = x0 + (k % 2 ? 1.2 : 2.6); x < x1 - 0.6; x += 2.8) { const p = g.p(x, y1, z), q = g.p(x, y1, Math.min(z1, z + 1.6)); segs.push(p[0], p[1], q[0], q[1]); }
    for (let y = y0 + (k % 2 ? 1.2 : 2.6); y < y1 - 0.6; y += 2.8) { const p = g.p(x1, y, z), q = g.p(x1, y, Math.min(z1, z + 1.6)); segs.push(p[0], p[1], q[0], q[1]); }
  }
  g.segs2(segs, o.course || '#9E9583', 0.28);
  // moss and damp streaks running down from the top, weep holes
  const ms = [];
  for (let i = 0; i < Math.max(2, (x1 - x0) / 5); i++) { const x = x0 + 1 + R() * (x1 - x0 - 2), l = 2 + R() * (z1 - z0) * 0.5; const a = g.p(x, y1 + 0.04, z1 - 0.2), b = g.p(x, y1 + 0.04, z1 - l); ms.push(a[0], a[1], b[0], b[1]); }
  for (let i = 0; i < Math.max(2, (y1 - y0) / 5); i++) { const y = y0 + 1 + R() * (y1 - y0 - 2), l = 2 + R() * (z1 - z0) * 0.5; const a = g.p(x1 + 0.04, y, z1 - 0.2), b = g.p(x1 + 0.04, y, z1 - l); ms.push(a[0], a[1], b[0], b[1]); }
  g.segs2(ms, 'rgba(110,128,84,0.45)', 1.3);
  // a fig's roots and creepers spilling over the top edge of the lit face
  if (o.vines !== false && x1 - x0 > 10) { const vx = x0 + (x1 - x0) * (0.25 + 0.5 * R()), top = g.p(vx, y1 + 0.05, z1), vs = []; for (let i = 0; i < 7; i++) { const dx = (i - 3) * 1.6, l = (z1 - z0) * (0.3 + 0.4 * R()); vs.push(top[0] + dx * 0.8, top[1], top[0] + dx + (R() - 0.5) * 2, top[1] + l * VZ); } g.segs2(vs, '#7F9A5E', 0.7); const b = []; for (let i = 0; i < 9; i++) { const dx = (R() - 0.5) * 9, dy = R() * 5; b.push([top[0] + dx, top[1] + dy]); } for (const p of b) g.disc2(p, 1.4 + R(), R() < 0.5 ? '#8DAE62' : '#6A8C49'); }
  if (z1 - z0 > 5) for (let x = x0 + 3; x < x1 - 1; x += 6) g.disc2(g.p(x, y1 + 0.05, z0 + 1.2), 0.45, '#5E574A');
  if (o.scuff !== false) CQ.paving(g, x0, y0, x1, y1, z1, { dens: 0.3 });
};
/* a railing along a terrace edge at height z: face 'L' (along x at y = p) or 'R' (along y at x = p) */
CQ.rail = function (g, face, p, a0, a1, z, o) {
  o = o || {}; const h = o.h || 1.6, col = o.col || '#6A6358', segs = [];
  const P = (a, zz) => g.p.apply(g, K.pt(face, p, a, zz));
  const t0 = P(a0, z + h), t1 = P(a1, z + h), m0 = P(a0, z + h * 0.5), m1 = P(a1, z + h * 0.5);
  segs.push(t0[0], t0[1], t1[0], t1[1], m0[0], m0[1], m1[0], m1[1]);
  for (let a = a0; a <= a1 + 0.01; a += o.sp || 1.4) { const b = P(a, z), t = P(a, z + h); segs.push(b[0], b[1], t[0], t[1]); }
  g.segs2(segs, col, 0.35);
};
/* a flight of stone steps from z0 (low) to z1 (high). axis 'y': climbs towards -y over [y0, y1] (risers face +y, lit);
   'x': climbs towards -x (risers face +x). o.wall: draw the visible side wall down to z0b (default z0) */
CQ.steps = function (g, x0, y0, x1, y1, z0, z1, axis, o) {
  o = o || {}; const n = Math.max(2, Math.round((z1 - z0) / (o.rise || 0.55))), tread = o.tread || '#D9D2C2', riser = o.riser || '#BDB5A3', zb = o.zb == null ? z0 : o.zb;
  const ln = [];
  if (axis === 'y') {
    const L = y1 - y0;
    if (o.wall !== false) { g.fill([[x1, y0, z1], [x1, y0, zb], [x1, y1, zb], [x1, y1, z0]], CQC.wallD); }
    for (let i = 0; i < n; i++) {
      const ya = y0 + L * i / n, yb = y0 + L * (i + 1) / n, zt = z1 - (z1 - z0) * i / n, zr = z1 - (z1 - z0) * (i + 1) / n;
      g.fill(K.rect(x0, ya, x1, yb, zt), tread); g.fill([[x0, yb, zr], [x1, yb, zr], [x1, yb, zt], [x0, yb, zt]], riser);
      const a = g.p(x0, yb, zt), b = g.p(x1, yb, zt); ln.push(a[0], a[1], b[0], b[1]);
    }
    if (o.wall !== false) g.line([[x1, y0, z1], [x1, y1, z0]], { w: 0.6, boil: false });
  } else {
    const L = x1 - x0;
    if (o.wall !== false) { g.fill([[x0, y1, z1], [x0, y1, zb], [x1, y1, zb], [x1, y1, z0]], CQC.wall); }
    for (let i = 0; i < n; i++) {
      const xa = x0 + L * i / n, xb = x0 + L * (i + 1) / n, zt = z1 - (z1 - z0) * i / n, zr = z1 - (z1 - z0) * (i + 1) / n;
      g.fill(K.rect(xa, y0, xb, y1, zt), tread); g.fill([[xb, y0, zr], [xb, y1, zr], [xb, y1, zt], [xb, y0, zt]], shade(riser, 0.06));
      const a = g.p(xb, y0, zt), b = g.p(xb, y1, zt); ln.push(a[0], a[1], b[0], b[1]);
    }
    if (o.wall !== false) g.line([[x0, y1, z1], [x1, y1, z0]], { w: 0.6, boil: false });
  }
  g.segs2(ln, '#8C8472', 0.28);
};
/* the height of a flight at a point along it (for walkers): t 0 at the low end, 1 at the top */
CQ.stepZ = (z0, z1, t) => z0 + (z1 - z0) * clamp(t, 0, 1);

/* ---------------- buildings ---------------- */
/* a concrete residential block: d = {x0,y0,x1,y1, z (base), h, col, n (storeys), seed, shop: [word, col] on the
   ground floor of face L, shopR, tank (rooftop water tank), cage (window cages), laundry, roofGarden} */
CQ.block = function (g, d) {
  const z0 = d.z || 0, z1 = z0 + d.h, col = d.col || CQC.plaster, R = RNG(d.seed || Math.round(d.x0 * 7 + d.y1 * 13));
  g.boilP = 0.2;
  K.box(g, d.x0, d.y0, d.x1, d.y1, z0, z1, { t: shade(col, -0.12), l: col, r: shade(col, 0.12) }, { w: 0.85 });
  const st = d.st || 3.0, gf = d.gf == null ? 3.6 : d.gf, faces = [['L', d.y1, d.x0, d.x1], ['R', d.x1, d.y0, d.y1]];
  const wins = [], cages = [], acs = [], laundry = [];
  for (const [f, p, a0, a1] of faces) {
    const W = a1 - a0, nw = Math.max(1, Math.floor(W / (d.bay || 2.6)));
    for (let z = z0 + gf + 0.6; z + st * 0.55 < z1 - 0.4; z += st) {
      for (let i = 0; i < nw; i++) {
        const a = a0 + W * (i + 0.5) / nw, hw = Math.min(0.75, W / nw * 0.3);
        if (h2(Math.round(a * 7 + z * 3), d.seed || 3) < (d.blank || 0.06)) continue;
        const q = K.on(f, p + 0.03, a - hw, a + hw, z, z + st * 0.5);
        wins.push(q);
        const rr = h2(Math.round(a * 11 + z * 5), (d.seed || 3) + 9);
        if (d.cage !== false && rr < 0.35) cages.push([f, p, a - hw - 0.15, a + hw + 0.15, z - 0.1, z + st * 0.5 + 0.1]);
        else if (rr < 0.5) acs.push([f, p, a + hw + 0.2, z]);
        else if (d.laundry !== false && rr > 0.72) laundry.push([f, p, a, z - 0.25]);
      }
    }
  }
  for (const q of wins) g.fill(q, d.win || CQC.win);
  const cs = [];
  for (const [f, p, a0, a1, za, zb] of cages) {
    const q = K.on(f, p + 0.45, a0, a1, za, zb); g.fill(q, 'rgba(120,124,124,0.35)');
    for (let a = a0; a <= a1 + 0.01; a += 0.35) { const s = g.p.apply(g, K.pt(f, p + 0.45, a, za)), t = g.p.apply(g, K.pt(f, p + 0.45, a, zb)); cs.push(s[0], s[1], t[0], t[1]); }
    const t0 = g.p.apply(g, K.pt(f, p + 0.45, a0, zb)), t1 = g.p.apply(g, K.pt(f, p + 0.45, a1, zb)); cs.push(t0[0], t0[1], t1[0], t1[1]);
  }
  g.segs2(cs, '#6F6E68', 0.22);
  for (const [f, p, a, z] of acs) { const q = K.on(f, p + 0.5, a, a + 0.9, z, z + 0.7); g.fill(q, '#EEEDE7'); g.disc2(g.p.apply(g, K.pt(f, p + 0.52, a + 0.45, z + 0.35)), 0.32, '#A8A6A0'); }
  for (const [f, p, a, z] of laundry) {
    const s = g.p.apply(g, K.pt(f, p, a - 1, z)), e = g.p.apply(g, K.pt(f, p + 1.6, a + 0.6, z)); g.fine2([s, e], { w: 0.25, c: '#5A564E' });
    for (let k = 0; k < 3; k++) { const t = 0.2 + k * 0.28, c = [lerp(s[0], e[0], t), lerp(s[1], e[1], t)]; g.fill2([[c[0] - 0.9, c[1]], [c[0] + 0.9, c[1]], [c[0] + 0.8, c[1] + 3], [c[0] - 0.8, c[1] + 3]], R.pick(['#E2725B', '#F4F1E8', '#6E9BC8', '#E6C24F', '#9FC07A', '#D98AA4']), true); }
  }
  // the ground floor: shop fronts with signs
  for (const [f, p, a0, a1, s] of [['L', d.y1, d.x0, d.x1, d.shop], ['R', d.x1, d.y0, d.y1, d.shopR]]) {
    if (!s) continue;
    g.fill(K.on(f, p + 0.03, a0 + 0.5, a1 - 0.5, z0, z0 + gf - 1.1), '#4A4744');
    for (let a = a0 + 2.5; a < a1 - 1; a += 2.5) g.fine([K.pt(f, p + 0.05, a, z0), K.pt(f, p + 0.05, a, z0 + gf - 1.1)], { w: 0.3, c: '#8C8576' });
    if (s[0]) CQH.sign(g, f, p, a0 + 0.4, a1 - 0.4, z0 + gf - 1.1, z0 + gf - 0.05, s[1], s[0]);
    const aw = d.awning == null ? CQ.AWN[Math.abs(Math.round(a0 * 7 + (d.seed || 0))) % CQ.AWN.length] : d.awning;
    if (aw) CQ.awning(g, f, p, a0 + 0.6, a1 - 0.6, z0 + gf - 1.15, 1.8, aw[0], aw[1]);
    if (d.lanterns !== false) for (let a = a0 + 1.4; a < a1 - 1; a += 2.6) CQ.lantern2(g, g.p.apply(g, K.pt(f, p + 2.0, a, z0 + gf - 2.3)), 0.75);
    else g.fill(K.on(f, p + 0.05, a0 + 0.4, a1 - 0.4, z0 + gf - 1.1, z0 + gf - 0.05), s[1]);
  }
  // rooftop: a parapet line, a water tank, sometimes a little garden of pots
  const rt = (x, y) => g.p(x, y, z1);
  if (d.tank !== false && (d.x1 - d.x0) > 4 && (d.y1 - d.y0) > 4) {
    const cx = d.x0 + (d.x1 - d.x0) * 0.35, cy = d.y0 + (d.y1 - d.y0) * 0.35;
    const blue = (d.seed || 0) % 3 === 0;
    K.box(g, cx - 1.2, cy - 1.2, cx + 1.2, cy + 1.2, z1, z1 + 1.8, blue ? { t: '#7FA9D0', l: '#5F8FC0', r: '#4A78A8' } : { t: '#D7D9D6', l: '#C3C6C3', r: '#A9ACA9' }, { w: 0.55, boil: false });
  }
  // most flat roofs carry a little garden of pots and greens, or a red tarp shelter
  if (d.garden == null && (d.x1 - d.x0) > 6 && (d.y1 - d.y0) > 5) d.garden = (Math.abs(d.seed || 1) % 2) === 0;
  if ((d.x1 - d.x0) > 6 && (d.y1 - d.y0) > 5 && !d.garden && (Math.abs(d.seed || 1) % 3) === 1) { const q = [[d.x1 - 4.5, d.y1 - 4, z1 + 1.6], [d.x1 - 0.8, d.y1 - 4, z1 + 1.6], [d.x1 - 0.8, d.y1 - 0.8, z1 + 1.2], [d.x1 - 4.5, d.y1 - 0.8, z1 + 1.2]]; g.fill(q, CQ.AWN[(d.seed || 0) % 4][0]); g.outline(q, { w: 0.45, c: '#5A564E', boil: false }); }
  if (d.garden) { g.fill(K.rect(d.x0 + 0.8, d.y1 - 3.4, d.x1 - 0.8, d.y1 - 0.8, z1), '#A9BE84'); g.grass2(g.P(K.rect(d.x0 + 0.8, d.y1 - 3.4, d.x1 - 0.8, d.y1 - 0.8, z1)), { dens: 0.5 }); const pts = []; for (let i = 0; i < 6; i++) { const p = rt(d.x0 + 1 + R() * (d.x1 - d.x0 - 2), d.y1 - 1 - R() * 2); pts.push(p); } for (const p of pts) { g.fill2([[p[0] - 0.7, p[1]], [p[0] + 0.7, p[1]], [p[0] + 0.5, p[1] - 1.2], [p[0] - 0.5, p[1] - 1.2]], '#B07A5A', true); g.disc2([p[0], p[1] - 2.0], 1.2, R.pick([CQC.fig, CQC.figL, '#7FA35E'])); } }
  void rt;
  return z1;
};
/* an old house: plaster ground floor (a shop, open front), timber upper floor with dark framing, grey tile roof.
   d = {x0,y0,x1,y1, z, n (1..3 storeys), ridge 'x'|'y', sign: [word, col] on face L or R (signFace), col} */
CQ.oldhouse = function (g, d) {
  const z0 = d.z || 0, st = 3.4, n = d.n || 2, z1 = z0 + n * st, col = d.col || CQC.plaster;
  g.boilP = 0.25;
  K.box(g, d.x0, d.y0, d.x1, d.y1, z0, z0 + st, { t: '#D9D3C4', l: col, r: shade(col, 0.12) }, { w: 0.8 });
  if (n > 1) K.box(g, d.x0, d.y0, d.x1, d.y1, z0 + st, z1, { t: '#D9D3C4', l: d.wood || CQC.timberL, r: shade(d.wood || CQC.timberL, 0.15) }, { w: 0.8 });
  // timber framing on the upper floors, windows with lattice
  const fr = [];
  for (const [f, p, a0, a1] of [['L', d.y1, d.x0, d.x1], ['R', d.x1, d.y0, d.y1]]) {
    if (n > 1) for (let a = a0; a <= a1 + 0.01; a += (a1 - a0) / Math.max(1, Math.round((a1 - a0) / 2.4))) { const b = g.p.apply(g, K.pt(f, p + 0.03, a, z0 + st)), t = g.p.apply(g, K.pt(f, p + 0.03, a, z1)); fr.push(b[0], b[1], t[0], t[1]); }
    for (let k = 1; k < n; k++) { const zz = z0 + st * k + st * 0.55; const W = a1 - a0, nw = Math.max(1, Math.round(W / 3.2)); for (let i = 0; i < nw; i++) { const a = a0 + W * (i + 0.5) / nw; const q = K.on(f, p + 0.04, a - 0.7, a + 0.7, zz - 1.0, zz + 0.6); g.fill(q, '#EFE6CF'); const c = g.P(q); fr.push(c[0][0], c[0][1], c[2][0], c[2][1], c[1][0], c[1][1], c[3][0], c[3][1]); } }
    // the open shop front
    if (d.open !== false) { const q = K.on(f, p + 0.03, a0 + 0.6, a1 - 0.6, z0, z0 + st - 0.9); g.fill(q, '#4E4A44'); const w = K.on(f, p + 0.04, a0 + 0.6, a1 - 0.6, z0 + st - 0.9, z0 + st - 0.6); g.fill(w, CQC.timberD); }
  }
  g.segs2(fr, CQC.timberD, 0.4);
  if (d.sign) { const f = d.signFace || 'L', p = f === 'L' ? d.y1 : d.x1, a0 = f === 'L' ? d.x0 : d.y0, a1 = f === 'L' ? d.x1 : d.y1; CQH.sign(g, f, p + 0.1, a0 + 0.8, a1 - 0.8, z0 + st - 0.55, z0 + st + 0.75, d.sign[1], d.sign[0]); }
  CQ.tileRoof(g, d.x0, d.y0, d.x1, d.y1, z1, d.rh || 2.6, d.ridge || ((d.x1 - d.x0) >= (d.y1 - d.y0) ? 'x' : 'y'));
  return z1;
};
/* a grey tile gable roof with a little overhang and tile channels */
CQ.tileRoof = function (g, x0, y0, x1, y1, z, h, dir, o) {
  o = o || {}; const ov = o.over == null ? 0.7 : o.over, col = o.col || CQC.roof;
  K.gable(g, x0 - ov, y0 - ov, x1 + ov, y1 + ov, z, h, dir, col, { c: shade(col, 0.45), w: 0.75 });
  const segs = [];
  if (dir === 'x') { for (let x = x0; x < x1 + ov; x += 0.8) { const a = g.p(x, y1 + ov, z), b = g.p(x, (y0 + y1) / 2, z + h); segs.push(a[0], a[1], b[0], b[1]); } }
  else { for (let y = y0; y < y1 + ov; y += 0.8) { const a = g.p(x1 + ov, y, z), b = g.p((x0 + x1) / 2, y, z + h); segs.push(a[0], a[1], b[0], b[1]); } }
  g.segs2(segs, shade(col, 0.25), 0.28);
};
/* a timber stilt house (diaojiaolou) whose floor is at zf, standing on posts down to zb (a slope or the water side):
   d = {x0,y0,x1,y1, zb, zf, n storeys above the floor, lanterns} */
CQ.stilt = function (g, d) {
  const st = 3.2, zf = d.zf, z1 = zf + (d.n || 2) * st, wd = d.wood || CQC.timber;
  g.boilP = 0.25;
  // posts and braces under the floor
  const posts = [];
  for (const x of [d.x0 + 0.4, (d.x0 + d.x1) / 2, d.x1 - 0.4]) for (const y of [d.y0 + 0.4, d.y1 - 0.4]) { const a = g.p(x, y, d.zb), b = g.p(x, y, zf); posts.push(a[0], a[1], b[0], b[1]); }
  for (const x of [d.x0 + 0.4, d.x1 - 0.4]) { const a = g.p(x, d.y1 - 0.4, d.zb + (zf - d.zb) * 0.2), b = g.p((d.x0 + d.x1) / 2, d.y1 - 0.4, zf - 0.3); posts.push(a[0], a[1], b[0], b[1]); }
  { const a = g.p(d.x1 - 0.4, d.y0 + 0.4, d.zb + (zf - d.zb) * 0.25), b = g.p(d.x1 - 0.4, d.y1 - 0.4, zf - 0.3); posts.push(a[0], a[1], b[0], b[1]); }
  g.segs2(posts, CQC.timberD, 0.75);
  K.box(g, d.x0, d.y0, d.x1, d.y1, zf, z1, { t: '#D9D3C4', l: shade(wd, -0.12), r: wd }, { w: 0.8 });
  // plank lines, windows, a balcony with a rail on the L face
  const pl = [];
  for (let z = zf + 0.7; z < z1; z += 0.7) { const a = g.p(d.x0, d.y1 + 0.03, z), b = g.p(d.x1, d.y1 + 0.03, z), c = g.p(d.x1 + 0.03, d.y0, z); pl.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); }
  g.segs2(pl, shade(wd, 0.3), 0.22);
  for (let k = 0; k < (d.n || 2); k++) {
    const zz = zf + k * st + 0.9;
    for (let a = d.x0 + 1.2; a < d.x1 - 1; a += 2.8) g.fill(K.on('L', d.y1 + 0.05, a, a + 1.4, zz, zz + 1.5), k === 0 && d.lit ? '#F2D58A' : '#E8DDC0');
    for (let a = d.y0 + 1.2; a < d.y1 - 1; a += 2.8) g.fill(K.on('R', d.x1 + 0.05, a, a + 1.4, zz, zz + 1.5), '#DCD0B2');
  }
  CQ.rail(g, 'L', d.y1 + 0.9, d.x0, d.x1, zf, { h: 1.1, col: CQC.timberD, sp: 0.7 });
  g.fill(K.rect(d.x0, d.y1, d.x1, d.y1 + 0.9, zf), shade(wd, -0.2));
  CQ.tileRoof(g, d.x0, d.y0, d.x1, d.y1, z1, 2.4, d.ridge || 'x', { over: 1.0 });
  if (d.lanterns) for (let a = d.x0 + 1.2; a < d.x1; a += 2.6) CQ.lantern2(g, g.p(a, d.y1 + 1.1, zf + st - 0.6), 0.9);
};
/* shop awnings: orange, green, red, blue, with a stripe */
CQ.AWN = [['#E08A3C', '#F4EBD8'], ['#3F8F5A', '#F4EBD8'], ['#C8392E', '#F4EBD8'], ['#3F6FA8', '#F4EBD8'], ['#E6B84A', '#C8392E'], null];
CQ.awning = function (g, face, p, a0, a1, z, out, col, stripe) {
  const P = (a, d, zz) => face === 'L' ? [a, p + d, zz] : [p + d, a, zz], drop = 1.0;
  g.fill([P(a0, 0, z), P(a1, 0, z), P(a1, out, z - drop), P(a0, out, z - drop)], col);
  if (stripe) { const n = Math.max(2, Math.round(Math.abs(a1 - a0) / 1.2)); for (let i = 1; i < n; i += 2) { const s0 = lerp(a0, a1, i / n), s1 = lerp(a0, a1, (i + 1) / n); g.fill([P(s0, 0, z), P(s1, 0, z), P(s1, out, z - drop), P(s0, out, z - drop)], stripe); } }
  g.fill([P(a0, out, z - drop), P(a1, out, z - drop), P(a1, out, z - drop - 0.5), P(a0, out, z - drop - 0.5)], shade(col, 0.12));
  g.line([P(a0, out, z - drop), P(a1, out, z - drop)], { w: 0.45, c: shade(col, 0.5), boil: false });
};
/* a row of potted plants along a line (world points a -> b at height z) */
CQ.pots = function (g, a, b, n, seed) {
  const R = RNG(seed || 3);
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, p = g.p(lerp(a[0], b[0], t), lerp(a[1], b[1], t), a[2]); g.fill2([[p[0] - 0.9, p[1]], [p[0] + 0.9, p[1]], [p[0] + 1.1, p[1] - 1.5], [p[0] - 1.1, p[1] - 1.5]], R.pick(['#B5623E', '#9C5A3C', '#C9784A', '#3F6FA8']), true); const c = R.pick([CQC.fig, '#6E9F4F', '#A4C66B', CQC.figD]); g.disc2([p[0], p[1] - 2.8], 1.5 + R() * 0.7, c); if (R() < 0.35) g.disc2([p[0] + 0.6, p[1] - 3.4], 0.55, R.pick(['#D9442F', '#F2C230', '#F1D5DD'])); }
};
/* a laundry line between two world points, sagging, hung with clothes */
CQ.washing = function (g, a, b, seed) {
  const R = RNG(seed || 5), pa = g.p.apply(g, a), pb = g.p.apply(g, b), pts = [];
  for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push([lerp(pa[0], pb[0], t), lerp(pa[1], pb[1], t) + 2.5 * 4 * t * (1 - t)]); }
  g.fine2(pts, { w: 0.25, c: '#5A564E' });
  const n = Math.max(2, Math.round(Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) / 5));
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, c = [lerp(pa[0], pb[0], t), lerp(pa[1], pb[1], t) + 2.5 * 4 * t * (1 - t)], w = 1.2 + R() * 0.9, h = 2.4 + R() * 2.4; g.fill2([[c[0] - w, c[1]], [c[0] + w, c[1]], [c[0] + w * 0.9, c[1] + h], [c[0] - w * 0.9, c[1] + h]], R.pick(['#E2725B', '#F4F1E8', '#6E9BC8', '#E6C24F', '#9FC07A', '#D98AA4', '#3F5F8F']), true); }
};
/* pigeons pecking on the ground round (x, y): little grey birds, flat */
CQ.pigeons = function (g, x, y, n, seed, z) {
  const R = RNG(seed || 9);
  for (let i = 0; i < n; i++) { const p = g.p(x + (R() - 0.5) * 7, y + (R() - 0.5) * 7, z || 0), d = R() < 0.5 ? 1 : -1; g.fill2([[p[0] - 1.1 * d, p[1]], [p[0] + 0.9 * d, p[1] - 0.2], [p[0] + 1.3 * d, p[1] - 1.2], [p[0] - 0.4 * d, p[1] - 1.4]], R() < 0.3 ? '#C9C6BD' : '#8E9096', true); g.disc2([p[0] + 1.4 * d, p[1] - 1.6], 0.55, '#6E7076'); }
};
/* a small dog at (x, y, z) facing d (+1 right / -1 left on screen) */
CQ.dog = function (g, x, y, z, col, d) {
  const p = g.p(x, y, z || 0); d = d || 1; col = col || '#C9A26B';
  g.fill2([[p[0] - 2 * d, p[1] - 1.4], [p[0] + 1.6 * d, p[1] - 1.4], [p[0] + 1.6 * d, p[1] - 3], [p[0] - 2 * d, p[1] - 3]], col, true);
  g.disc2([p[0] + 2.2 * d, p[1] - 3.5], 1.1, col); g.fill2([[p[0] + 1.9 * d, p[1] - 4.3], [p[0] + 2.4 * d, p[1] - 5.4], [p[0] + 2.7 * d, p[1] - 4.3]], shade(col, 0.2), true);
  g.segs2([p[0] - 1.6 * d, p[1] - 1.4, p[0] - 1.6 * d, p[1], p[0] + 1.2 * d, p[1] - 1.4, p[0] + 1.2 * d, p[1], p[0] - 2 * d, p[1] - 2.8, p[0] - 3 * d, p[1] - 4], shade(col, 0.3), 0.5);
};
/* a noodle stall with its cook, low stools round it and people slurping (all in one cast drawing at x, y, z) */
CQ.noodleStall = function (g, x, y, z, seed, o) {
  o = o || {};
  g.at(x, y, z || 0, (g2) => {
    const eat = (dx, dy, d, s) => { CQ.stool(g2, dx, dy, s % 2 ? '#C9463E' : '#4F7FB8'); CQ.person(g2, dx, dy, 1.3, CQ.who(s, { dir: d, pose: 'sit', bowl: true, reach: [2.6, 3] })); };
    eat(-3.2, -2, 0, seed + 1);
    K.box(g2, -1.6, -1.4, 1.6, 1.4, 0, 2.6, { t: '#D9D3C4', l: o.col || '#C9463E', r: shade(o.col || '#C9463E', 0.15) }, { w: 0.6 });
    CQH.sign(g2, 'L', 1.4, -1.4, 1.4, 0.6, 2.2, '#E6B84A', '小面', { line: false });
    K.cyl(g2, 0.6, -0.4, 0.9, 2.6, 3.6, { t: '#5A564E', l: '#9C9A94', r: '#7A7872' }, { w: 0.45, n: 10 });
    CQ.person(g2, 2.6, -0.6, 0, CQ.who(seed, { dir: 2, pose: 'hold', top: '#F3F1EA', cap: '#F3F1EA' }));
    eat(-1, 3.4, 3, seed + 2); eat(2.2, 3.6, 2, seed + 3); eat(4.6, 2.2, 2, seed + 4);
  });
};
/* a red paper lantern at wide-px point c */
CQ.lantern2 = function (g, c, r, col) {
  col = col || CQC.lantern; const rx = r * 0.82, pts = [];
  for (let i = 0; i < 12; i++) { const t = TAU * i / 12; pts.push([c[0] + Math.cos(t) * rx, c[1] + Math.sin(t) * r]); }
  g.fill2(pts, col, true);
  g.fill2([[c[0] - rx * 0.55, c[1] - r - 0.25], [c[0] + rx * 0.55, c[1] - r - 0.25], [c[0] + rx * 0.55, c[1] - r + 0.15], [c[0] - rx * 0.55, c[1] - r + 0.15]], '#3A2A22', true);
  g.fill2([[c[0] - rx * 0.55, c[1] + r - 0.15], [c[0] + rx * 0.55, c[1] + r - 0.15], [c[0] + rx * 0.55, c[1] + r + 0.25], [c[0] - rx * 0.55, c[1] + r + 0.25]], '#3A2A22', true);
  g.segs2([c[0], c[1] + r + 0.25, c[0], c[1] + r + 1.0], CQC.gold, 0.35);
};
/* the huangjue fig, Chongqing's city tree: a thick pale trunk with aerial roots, a wide crown in fresh spring leaf */
CQ.fig = function (g, x, y, o) {
  o = o || {}; const z = o.z || 0, r = (o.r || 5) * 3.3, h = (o.h == null ? 4.2 : o.h), f = g.p(x, y, z), top = [f[0], f[1] - h * VZ], R = RNG(o.seed || Math.round(x * 31 + y * 17 + z * 5));
  const tr = '#9C8D78', col = o.col || CQC.fig;
  g.fill2([[f[0] - 1.8, f[1]], [f[0] + 1.8, f[1]], [top[0] + 1.0, top[1]], [top[0] - 1.0, top[1]]], tr);
  g.fill2([[f[0] + 0.2, f[1]], [f[0] + 1.8, f[1]], [top[0] + 1.0, top[1]], [top[0] + 0.1, top[1]]], shade(tr, 0.15));
  const roots = []; for (let i = 0; i < 4; i++) { const dx = (R() - 0.5) * 3.2; roots.push(top[0] + dx * 0.4, top[1] + 2, f[0] + dx, f[1] + 0.3); } g.segs2(roots, '#7F7262', 0.35);
  g.line2([[top[0], top[1] + 2], [top[0] - r * 0.5, top[1] - r * 0.3]], { w: 1.1, c: tr, boil: false }); g.line2([[top[0], top[1] + 2], [top[0] + r * 0.45, top[1] - r * 0.35]], { w: 1.0, c: tr, boil: false });
  const cy = top[1] - r * 0.5, lobes = [[-r * 0.5, r * 0.08, r * 0.6], [r * 0.48, 0.02 * r, r * 0.58], [0, -r * 0.3, r * 0.66], [-r * 0.1, r * 0.22, r * 0.55], [r * 0.25, -r * 0.05, r * 0.5]];
  const ink = shade(col, 0.5), dk = shade(col, 0.16), lt = o.light || CQC.figL;
  lobes.map(([dx, dy, rr]) => { const pts = []; const a0 = R() * TAU; for (let k = 0; k < 9; k++) { const a = a0 + TAU * k / 9, q = rr * (0.86 + R() * 0.24); pts.push([top[0] + dx + Math.cos(a) * q, cy + dy + Math.sin(a) * q * 0.78]); } return pts; })
    .map((b) => ({ b, cy: b.reduce((s, p) => s + p[1], 0) / b.length })).sort((p, q) => p.cy - q.cy).forEach(({ b }) => {
      const cx = b.reduce((s, p) => s + p[0], 0) / b.length, cyy = b.reduce((s, p) => s + p[1], 0) / b.length;
      g.fill2(b, col); const sh = b.filter((p) => (p[0] - cx) * 0.5 + (p[1] - cyy) > 0); if (sh.length > 2) g.fill2(sortAround(sh.concat([[cx, cyy + 1]])), dk);
      g.outline2(b, { c: ink, w: 0.6, ext: 0.2 });
    });
  const lf = []; for (let i = 0; i < 22; i++) { const a = R() * TAU, d = R() * r * 0.8, px = top[0] + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.7 - r * 0.1; lf.push(px - 0.6, py + 0.3, px + 0.6, py - 0.3); }
  g.segs2(lf, lt, 0.8);
};
/* a blossoming tree (plum / magnolia in March) */
CQ.bloom = function (g, x, y, o) { o = o || {}; CQ.fig(g, x, y, Object.assign({ r: 3.2, h: 3.6, col: o.col || CQC.blossom, light: '#FBF6F4' }, o)); };

/* ---------------- people ---------------- */
const CQ_TOPS = ['#3B3F47', '#5A6B7A', '#8E8A84', '#B9A27D', '#2F3A4F', '#E7E2D6', '#6E7F5E', '#C9584B', '#D98AA4', '#7FA9C9', '#E6C24F', '#F3F1EA', '#4A5A78', '#A4C66B', '#9C6B5A', '#E08A5C'];
const CQ_BOTS = ['#2F343B', '#3F4D63', '#4A4A4A', '#6B6E72', '#3B3F47', '#5A4A3C', '#2A3550', '#8A8F96'];
/* a Chongqing citizen in a March morning: quiet layered clothes, mostly dark hair, some grey */
CQ.who = function (seed, o) {
  const R = RNG(seed * 7717 + 5), w = K.who(seed);
  w.skin = R.pick([SKIN[0], SKIN[0], SKIN[1], SKIN[1], '#EBC7A6', SKIN[2]]);
  const hr = R(); w.hair = hr < 0.72 ? R.pick(['#1F1A18', '#2B2420', '#2B2420', '#3A2A20']) : hr < 0.86 ? R.pick(['#5A3A24', '#7B4E2C']) : R.pick(['#8E8A84', '#B5B1A8']);
  w.top = R.pick(CQ_TOPS); w.bot = R.pick(CQ_BOTS); w.bare = false; w.shorts = false; w.beard = false; w.build = R() * 0.7;
  w.hairStyle = R.pick(['short', 'short', 'bob', 'long', 'buzz', 'pony', 'bun', 'short']); w.glasses = R() < 0.18;
  w.cap = R() < 0.05 ? R.pick(['#3B3F47', '#C9584B', '#3F5F8F']) : undefined; w.dress = R() < 0.1 ? R.pick(['#3B3F47', '#B9A27D', '#D98AA4']) : undefined;
  if (R() < 0.35) w.jacket = R.pick(['#F3F1EA', '#E7E2D6', '#C9CCCC']);
  return Object.assign(w, o || {});
};
/* an older resident: grey hair, a dark padded jacket */
CQ.elder = function (seed, o) { const R = RNG(seed * 31 + 7); return CQ.who(seed, Object.assign({ hair: R.pick(['#B5B1A8', '#8E8A84', '#D6D2C8']), top: R.pick(['#2F3A4F', '#4A3F38', '#3B3F47', '#5A4A3C', '#6B4A3A']), bot: R.pick(['#2F343B', '#3B3F47']), hairStyle: R.pick(['short', 'buzz', 'bun', 'short']), glasses: R() < 0.4, dress: undefined, jacket: undefined, build: 0.5 }, o || {})); };
/* a bangbang porter: worn work jacket, cap, rope over the shoulder */
CQ.bangWho = function (seed, o) { const R = RNG(seed * 53 + 3); return CQ.who(seed, Object.assign({ top: R.pick(['#5F6B4E', '#3F4D63', '#6E5A44', '#4F5A62', '#7A6A55']), bot: R.pick(['#3B3F47', '#4A4A4A', '#5A4A3C']), hair: '#2B2420', hairStyle: 'buzz', cap: R() < 0.5 ? R.pick(['#5F6B4E', '#3B3F47', '#B9A27D']) : undefined, shoe: '#5A564E', dress: undefined, jacket: undefined, glasses: false, build: 0.2 }, o || {})); };
/* K.person plus: a birdcage, a bowl and chopsticks, a phone, a cup of tea */
CQ.person = function (g, x, y, z, w) {
  const r = K.person(g, x, y, z, w), hd = r.hands[0], k = w.k || 1;
  if (w.cage) { const c = [hd[0], hd[1] + 3.2 * k], pts = []; for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10; pts.push([c[0] + Math.cos(t) * 1.9 * k, c[1] - 2.2 * k - Math.sin(t) * 1.6 * k]); }
    g.fill2(pts.concat([[c[0] + 1.9 * k, c[1]], [c[0] - 1.9 * k, c[1]]]), 'rgba(222,212,186,0.55)', true); const b = []; for (let i = 0; i <= 6; i++) { const u = -1.9 + 3.8 * i / 6; b.push(c[0] + u * k, c[1], c[0] + u * k, c[1] - 2.2 * k - Math.sqrt(Math.max(0, 1 - (u / 1.9) * (u / 1.9))) * 1.6 * k); } g.segs2(b, '#8A6446', 0.25);
    g.fill2([[c[0] - 2.1 * k, c[1]], [c[0] + 2.1 * k, c[1]], [c[0] + 2.1 * k, c[1] + 0.5 * k], [c[0] - 2.1 * k, c[1] + 0.5 * k]], '#6F4F3B', true); g.segs2([hd[0], hd[1], c[0], c[1] - 3.8 * k], '#6F4F3B', 0.3);
    if (w.bird) g.disc2([c[0] + 0.3, c[1] - 1.5 * k], 0.6 * k, w.bird); }
  if (w.bowl) { const c = [hd[0], hd[1] - 0.4]; g.fill2(arcPts(c[0], c[1], 1.1 * k, 0, Math.PI, 6), '#F3F1EA', true); g.segs2([c[0] + 0.4, c[1] - 0.4, c[0] + 1.6 * k, c[1] - 2.6 * k], '#8A6446', 0.25); }
  if (w.bag) { const b = r.hands[1] || hd; g.fill2([[b[0] - 1.3, b[1] + 0.2], [b[0] + 1.3, b[1] + 0.2], [b[0] + 1.5, b[1] + 3.6], [b[0] - 1.5, b[1] + 3.6]], w.bag, true); g.segs2([b[0] - 0.7, b[1] + 0.2, b[0], b[1] - 0.8, b[0], b[1] - 0.8, b[0] + 0.7, b[1] + 0.2], shade(w.bag, 0.4), 0.3); }
  if (w.phone) g.fill2([[hd[0] - 0.45, hd[1] - 1.1], [hd[0] + 0.45, hd[1] - 1.1], [hd[0] + 0.45, hd[1] + 0.3], [hd[0] - 0.45, hd[1] + 0.3]], '#2A2622', true);
  if (w.umbrella) { const c = [hd[0], hd[1] - 13 * k]; g.segs2([hd[0], hd[1], c[0], c[1]], '#3A3530', 0.35); g.fill2(arcPts(c[0], c[1] + 0.8, 4.2 * k, Math.PI, TAU, 10), w.umbrella, true); }
  return r;
};
/* a bangbang porter: a bamboo pole across the near shoulder, a load hanging from each end on ropes. dir as K.person;
   pose 'walk' (ph) or 'stand'; load: colours of the two loads; 'rest' leans the pole on the ground */
CQ.porter = function (g, x, y, z, w, o) {
  o = o || {}; const k = w.k || 1, dir = w.dir | 0, F = g.p(x, y, z || 0);
  const dv = [[2.92, 1.59], [-2.92, 1.59], [-2.92, -1.59], [2.92, -1.59]][dir], L = 3.0 * k;
  const sh = [F[0] + (dir === 0 || dir === 3 ? 0.6 : -0.6) * k, F[1] - 15.4 * k];
  const A = [sh[0] + dv[0] * L, sh[1] + dv[1] * L - 0.6], B = [sh[0] - dv[0] * L, sh[1] - dv[1] * L - 0.6];
  const lc = o.load || ['#C9B48A', '#7A8A5A'];
  const load = (p, col) => { const b = [p[0], p[1] + 8.6 * k]; g.segs2([p[0], p[1], b[0] - 1.4 * k, b[1] - 2.6 * k, p[0], p[1], b[0] + 1.4 * k, b[1] - 2.6 * k], '#6A5A44', 0.25);
    const q = [[b[0] - 1.9 * k, b[1] - 2.8 * k], [b[0] + 1.9 * k, b[1] - 2.8 * k], [b[0] + 1.7 * k, b[1] + 0.4 * k], [b[0] - 1.7 * k, b[1] + 0.4 * k]]; g.fill2(q, col, true); g.outline2(q, { w: 0.35, c: shade(col, 0.5), boil: false }); g.segs2([b[0] - 1.8 * k, b[1] - 1.4 * k, b[0] + 1.8 * k, b[1] - 1.4 * k], shade(col, 0.3), 0.3); };
  const [back, front] = A[1] > B[1] ? [B, A] : [A, B], [cb, cf] = A[1] > B[1] ? [lc[1], lc[0]] : [lc[0], lc[1]];
  load(back, cb);
  const rel = (q) => [(dir === 0 || dir === 3 ? 1 : -1) * (q[0] - F[0]) / k, (q[1] - F[1]) / k];
  const hp = [lerp(sh[0], front[0], 0.45), lerp(sh[1], front[1], 0.45)];
  CQ.person(g, x, y, z, Object.assign({}, w, { hands: [rel(hp), rel([hp[0] + 0.3, hp[1] + 3.6])] }));
  g.line2([B, A], { w: 0.7, c: '#B8A060', boil: false, ext: 0 });
  load(front, cf);
};
/* walkers on a closed route (like K.walker) with z(x, y) for stairs, and an optional draw(g, look, st) */
CQ.walk = function (T, who, pts, speed, o) {
  o = o || {}; const seg = [], L = [0];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const total = L[L.length - 1], per = total / speed;
  return T.actor({ sample: o.sample || 0.3, period: per, cast: o.cast, bias: o.bias,
    at(t) {
      let d = (((t * speed + (o.phase || 0) * total) % total) + total) % total, i = 0;
      while (i < seg.length - 1 && d > L[i + 1]) i++;
      const [a, b] = seg[i], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1];
      const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor((d / (o.step || 2.4)) % 1 * 8);
      const x = a[0] + dx * u, y = a[1] + dy * u, z = typeof o.z === 'function' ? o.z(x, y) : (o.z || 0);
      return { x, y, z, key: dir + '.' + ph, dir, ph: ph / 8 };
    },
    draw(g, st) { const w = Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph }); if (o.draw) o.draw(g, w, st); else if (o.porter) CQ.porter(g, 0, 0, 0, w, o.porter); else CQ.person(g, 0, 0, 0, w); } });
};
/* steam or smoke puffs rising from the origin, keyed by phase 0..7 (draw inside an actor) */
CQ.steam2 = function (g, ph, k, col) {
  const o = g.p(0, 0, 0); col = col || 'rgba(246,244,238,0.72)';
  for (let i = 0; i < 4; i++) {
    const t = ((ph / 8) + i / 4) % 1, r = (1.0 + t * 2.4) * k, c = [o[0] + Math.sin((t + i) * 4.2) * 1.3 * k + t * 2.2 * k, o[1] - t * 11 * k];
    const pts = []; for (let q = 0; q < 8; q++) { const a = TAU * q / 8; pts.push([c[0] + Math.cos(a) * r * (0.9 + 0.2 * Math.sin(q * 2.3 + i)), c[1] + Math.sin(a) * r * 0.75]); }
    g.fill2(pts, col.replace(/[\d.]+\)$/, (1 - t) * parseFloat(col.match(/[\d.]+\)$/)[0]) + ')'), true);
  }
};
/* a steam actor at (x, y, z) in tile T */
CQ.steamActor = function (T, x, y, z, k, col, seed) {
  const off = h1(seed || Math.round(x * 13 + y * 7)) * 8;
  T.actor({ sample: 5, period: 10, at(t) { const ph = Math.floor(t * 5 + off) % 8; return { x, y, z, key: ph, ph }; }, draw(g, st) { CQ.steam2(g, st.ph, k || 1, col); } });
};
/* a hotpot table: a round table with the split pot (red chilli broth and pale broth) and stools; diners drawn by the
   caller. At (x, y) */
CQ.hotpot = function (g, x, y, o) {
  o = o || {}; const r = o.r || 2.1, h = 2.3, top = g.p(x, y, h);
  K.cyl(g, x, y, 0.35, 0, h, { t: '#6A5A4A', l: '#6A5A4A', r: '#4A3A30' }, { w: 0.4, n: 6, nt: true });
  K.cyl(g, x, y, r, h - 0.25, h, { t: o.top || '#E9E3D3', l: '#B07A5A', r: '#8A5E44' }, { w: 0.55, n: 16 });
  const pr = 1.0 * 3.3; g.fill2(arcPts(top[0], top[1] - 0.4, pr, 0, TAU, 14).map((p) => [p[0], top[1] - 0.4 + (p[1] - top[1] + 0.4) * 0.55]), '#8C8E90', true);
  g.fill2(arcPts(top[0], top[1] - 0.8, pr * 0.85, 0, TAU, 14).map((p) => [p[0], top[1] - 0.8 + (p[1] - top[1] + 0.8) * 0.55]), '#C8392E', true);
  g.fill2(arcPts(top[0], top[1] - 0.8, pr * 0.42, 0, TAU, 10).map((p) => [p[0], top[1] - 0.8 + (p[1] - top[1] + 0.8) * 0.55]), '#E9D9B0', true);
  const dots = []; for (let i = 0; i < 7; i++) { const a = i * 0.9, d = pr * 0.62; dots.push(top[0] + Math.cos(a) * d - 0.3, top[1] - 0.8 + Math.sin(a) * d * 0.5, top[0] + Math.cos(a) * d + 0.3, top[1] - 0.8 + Math.sin(a) * d * 0.5); } g.segs2(dots, '#7A1E18', 0.55);
  const pl = []; for (let i = 0; i < 5; i++) { const a = 0.5 + i * 1.25, c = [top[0] + Math.cos(a) * r * 2.6, top[1] + Math.sin(a) * r * 1.3]; pl.push(c); } for (const c of pl) g.fill2(arcPts(c[0], c[1], 0.9, 0, TAU, 8).map((p) => [p[0], c[1] + (p[1] - c[1]) * 0.55]), '#F6F3EA', true);
};
/* a low stool (round, plastic red or blue) at (x, y) */
CQ.stool = function (g, x, y, col) { K.cyl(g, x, y, 0.75, 0, 1.3, { t: shade(col || '#C9463E', -0.15), l: col || '#C9463E', r: shade(col || '#C9463E', 0.2) }, { w: 0.4, n: 8 }); };
/* a mahjong table at (x, y): a square table, green baize, the wall of tiles, four players (seeds) on stools */
CQ.mahjong = function (g, x, y, seeds, o) {
  o = o || {}; const h = 2.3, s = 1.7;
  // the far two players first (backs/side to us), then the table, then the near two
  const pl = [[x - s - 1.4, y, 0], [x, y - s - 1.4, 1], [x + s + 1.4, y, 2], [x, y + s + 1.4, 3]];
  const seat = (i) => { const [px, py, d] = pl[i]; CQ.stool(g, px, py, ['#C9463E', '#4F7FB8', '#C9463E', '#E0B64A'][i]); K.person(g, px, py, 1.3, CQ.who(seeds[i], { dir: [0, 1, 2, 3][d], pose: 'sit', reach: [3.8, 2.6] })); };
  seat(0); seat(1);
  K.box(g, x - s, y - s, x + s, y + s, h - 0.3, h, { t: '#3F7A55', l: '#7A5A44', r: '#5E4434' }, { w: 0.55 });
  const lg = []; for (const [a, b] of [[x - s + 0.2, y + s - 0.2], [x + s - 0.2, y + s - 0.2], [x + s - 0.2, y - s + 0.2]]) { const p = g.p(a, b, 0), q = g.p(a, b, h - 0.3); lg.push(p[0], p[1], q[0], q[1]); } g.segs2(lg, '#4A3A2C', 0.6);
  const tl = []; for (let i = -3; i <= 3; i++) for (const [ax, ay] of [[1, 0], [0, 1]]) for (const sg of [-1, 1]) { const px = x + (ax ? i * 0.35 : sg * 1.05), py = y + (ay ? i * 0.35 : sg * 1.05); const c = g.p(px, py, h + 0.2); tl.push(c); }
  for (const c of tl) g.fill2([[c[0] - 0.5, c[1] - 0.3], [c[0] + 0.5, c[1] - 0.3], [c[0] + 0.5, c[1] + 0.3], [c[0] - 0.5, c[1] + 0.3]], '#F3EFE2', true);
  seat(2); seat(3);
};

/* ---------------- vehicles ---------------- */
/* a Chongqing taxi: yellow, a green roof sign */
CQ.taxi = function (g, ang, o) { o = o || {}; K.car(g, ang, { col: o.col || '#E8C23C', L: 5.0, W: 2.45, roof: (gg, cab) => K.rbox(gg, cab.cx, cab.cy, 0.5, 1.0, ang + Math.PI / 2, 4.8, 5.5, '#F4F1E6', { w: 0.45, nb: true }) }); };
/* a city bus: white with a red or blue band */
CQ.bus = function (g, ang, o) { o = o || {}; K.bus(g, ang, { band: o.band || '#C8392E', L: 7.2 }); };
/* a motorbike with its rider (a moto-taxi), heading ang */
CQ.moto = function (g, ang, o) {
  o = o || {}; const ca = Math.cos(ang), sa = Math.sin(ang), col = o.col || '#C9463E', pt = (u, z) => g.p(u * ca, u * sa, z);
  const wheel = (u) => { const t = [], h = pt(u, 1.1); for (let i = 0; i < 18; i++) { const a = TAU * i / 18; t.push(pt(u + Math.cos(a) * 1.1, 1.1 + Math.sin(a) * 1.1)); } g.fill2(t, '#3A3632', true); g.disc2(h, 0.4, '#B9B4A8'); };
  wheel(-2.0); wheel(2.0);
  const B = K.rbox(g, -0.1 * ca, -0.1 * sa, 1.5, 0.55, ang, 1.4, 2.6, { t: shade(col, -0.15), l: col, r: shade(col, 0.15) }, { w: 0.5 });
  K.rbox(g, -0.9 * ca, -0.9 * sa, 1.0, 0.6, ang, 2.6, 3.0, '#3A3530', { w: 0.4, nb: true });
  const bar = pt(1.7, 3.9), fk = pt(2.0, 1.1); g.segs2([fk[0], fk[1], bar[0], bar[1]], '#5A564E', 0.5);
  const hb = (v) => g.p(1.7 * ca - sa * v, 1.7 * sa + ca * v, 3.9); g.line2([hb(-0.8), hb(0.8)], { c: '#3A3632', w: 0.5, boil: false, ext: 0 });
  const d = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2), kk = 0.86, F = pt(-0.7, 3.0), rel = (q) => [(q[0] - F[0]) / kk * (d === 0 || d === 3 ? 1 : -1), (q[1] - F[1]) / kk];
  const r = K.person(g, -0.7 * ca, -0.7 * sa, 3.0, Object.assign({}, o.who || CQ.who(o.seed || 5), { dir: d, pose: 'sit', k: kk, reach: rel(bar) }));
  if (o.helmet !== false) { const c = r.crown; g.fill2(arcPts(c[0], c[1] + 1.4, 2.3, Math.PI, TAU, 8), o.helmet || '#E6C24F', true); }
  void B;
};
/* one car of the Line 2 monorail, centred on the origin, heading ang, its floor at z 0 standing on the beam top.
   Silver-white body with an orange-red band; the skirt hangs down both sides of the beam. cab: +1/-1 a driver's end */
CQ.monoCar = function (g, ang, o) {
  o = o || {}; const hl = (o.hl || 3.9) + (o.half ? 0.06 : 0), hw = 1.45, z0 = -1.3, z1 = 3.5, body = '#E9EBE8', band = o.band || '#E0602F', cab = o.cab || 0;
  const B = K.rbox(g, 0, 0, hl, hw, ang, z0, z1, { t: '#D9DCDA', l: body, r: '#CDD1CF' }, { w: 0.75, nb: false, line: !o.half });
  if (o.half) {   // half a car: outline only the long edges and the true ends, so the two halves read as one car
    const lo = { w: 0.75, boil: false }, real = (f) => (f === 'pu' && (cab > 0 || o.gw === 'pu')) || (f === 'nu' && (cab < 0 || o.gw === 'nu'));
    for (const f of ['pv', 'nv']) if (B.vis[f]) { const q = B.quad(f, -1, 1, z0, z1); g.line([q[0], q[1]], lo); g.line([q[3], q[2]], lo); }
    for (const v of [-1, 1]) g.line([B.pt(-hl, v * hw, z1), B.pt(hl, v * hw, z1)], lo);
    for (const [e, u] of [['pu', 1], ['nu', -1]]) if (real(e)) { g.line([B.pt(u * hl, -hw, z1), B.pt(u * hl, hw, z1)], lo); if (B.vis[e]) g.outline(B.quad(e, -1, 1, z0, z1), lo); else for (const v of [-1, 1]) if (B.vis[v > 0 ? 'pv' : 'nv']) g.line([B.pt(u * hl, v * hw, z0), B.pt(u * hl, v * hw, z1)], lo); }
  }
  for (const f of ['pv', 'nv']) if (B.vis[f]) {
    g.fill(B.quad(f, -1, 1, z0, z0 + 0.9), '#B9BDBB');
    g.fill(B.quad(f, -1, 1, 0.5, 1.0), band);
    for (const [a, b] of (o.half ? [[-0.7, 0.55]] : [[-0.86, -0.56], [-0.42, -0.12], [0.02, 0.32], [0.46, 0.76]])) K.rwin(g, B, f, a, b, 1.3, 2.9, { col: '#9FB8C6' });
    if (!o.half) for (const d of [-0.49, 0.39]) { const q = B.quad(f, d - 0.05, d + 0.05, 0.0, 3.0); g.fill(q, '#C9CDCB'); }
    if (o.half && o.gw) { const e = o.gw === 'pu' ? 1 : -1; g.fill(B.quad(f, e > 0 ? 0.9 : -1, e > 0 ? 1 : -0.9, z0 + 0.5, z1 - 0.3), '#4A4E50'); }
    if (o.half) for (const d of [-0.15]) { const q = B.quad(f, d - 0.04, d + 0.04, 0.0, 3.0); g.fill(q, '#C9CDCB'); }
  }
  for (const f of ['pu', 'nu']) if (B.vis[f]) {
    const isCab = (f === 'pu' && cab > 0) || (f === 'nu' && cab < 0);
    if (isCab) { g.fill(B.quad(f, -0.85, 0.85, 1.2, 3.0), '#2E3A44'); g.fill(B.quad(f, -1, 1, 0.5, 1.0), band); for (const s of [-0.65, 0.65]) g.fill(B.quad(f, s - 0.15, s + 0.15, -0.6, -0.1), f === 'pu' ? '#F6E7A8' : '#D0483A'); }
    else if (!o.half || o.gw === f) g.fill(B.quad(f, -0.4, 0.4, -0.6, 3.0), '#6A6E70');
  }
};
/* a Yangtze cable-car cabin hanging from its grip: centred on the grip at the origin; ang the travel heading */
CQ.cabin = function (g, ang, o) {
  o = o || {}; const col = o.col || '#C23B2F', top = g.p(0, 0, 0), hang = 3.2;
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const B = K.rbox(g, 0, 0, 2.6, 1.6, ang, -hang - 4.4, -hang, { t: '#F1ECE0', l: col, r: shade(col, 0.15) }, { w: 0.75 });
  for (const f of ['pv', 'nv', 'pu', 'nu']) if (B.vis[f]) { const a = f[0] === 'p' && f[1] === 'u' || f === 'nu' ? [-0.75, 0.75] : [-0.85, 0.85]; K.rwin(g, B, f, a[0], a[1], -hang - 2.6, -hang - 0.5, { col: '#C9DCE4' }); g.fill(B.quad(f, -1, 1, -hang - 4.4, -hang - 3.9), '#F1ECE0'); }
  const b = g.p(0, 0, -hang); g.segs2([top[0], top[1], b[0], b[1]], '#3A3530', 0.6);
  g.fill2([[top[0] - 1.2, top[1] - 0.4], [top[0] + 1.2, top[1] - 0.4], [top[0] + 1.0, top[1] + 0.9], [top[0] - 1.0, top[1] + 0.9]], '#4A4540', true);
  if (o.riders) { const ps = o.riders; for (let i = 0; i < ps.length; i++) { const p = B.pt(-1.2 + i * 1.3, 0.2, -hang - 4.4); K.person(g, p[0], p[1], p[2], Object.assign({}, ps[i], { dir: (ca + sa > 0) ? 1 : 3, noLegs: true, k: 0.82 })); } K.rwin(g, B, 'pv', -0.85, 0.85, -hang - 2.6, -hang - 0.5, { col: 'rgba(201,220,228,0.45)', glint: true }); }
};
/* a river boat around the origin, bow to ang. kind 'cruise' (white, three decks), 'barge' (dark hull, a load of sand
   or containers), 'ferry' (small, a cabin), 'fish' (a little sampan). L half-length */
CQ.boat = function (g, ang, o) {
  o = o || {}; const kind = o.kind || 'ferry', ca = Math.cos(ang), sa = Math.sin(ang);
  if (kind === 'fish') { K.boat(g, ang, { kind: 'row', L: 3.2, W: 1.2, hull: '#7A5A3C', rower: o.who || CQ.elder(77), ph: o.ph || 0 }); return; }
  const L = o.L || (kind === 'cruise' ? 11 : kind === 'barge' ? 12 : 5.5), Wd = o.W || (kind === 'cruise' ? 3.2 : kind === 'barge' ? 3 : 1.9);
  K.boat(g, ang, { kind: 'motor', L, W: Wd, hull: kind === 'barge' ? '#4A4A48' : kind === 'cruise' ? '#F3F1EA' : '#E9E2CF', stripe: kind === 'cruise' ? '#2F5FA8' : kind === 'ferry' ? '#C23B2F' : '#B9A27D' });
  if (kind === 'barge') {
    const B = K.rbox(g, -L * 0.15 * ca, -L * 0.15 * sa, L * 0.6, Wd * 0.75, ang, 1.4, 2.6, o.load === 'box' ? { t: '#D9734A', l: '#C9584B', r: '#A9483B' } : { t: '#D9C9A4', l: '#C9B48A', r: '#B39D72' }, { w: 0.6 });
    if (o.load === 'box') for (const f of ['pv', 'nv']) if (B.vis[f]) for (const a of [-0.5, 0, 0.5]) g.fine([B.quad(f, a, a, 1.4, 2.6)[0], B.quad(f, a, a, 1.4, 2.6)[3]], { w: 0.3, c: '#7A3A2E' });
    const h = K.rbox(g, -L * 0.88 * ca, -L * 0.88 * sa, L * 0.1, Wd * 0.7, ang, 1.4, 4.2, { t: '#E9E6DE', l: '#F3F1EA', r: '#D9D6CC' }, { w: 0.6 });
    K.rwin(g, h, 'pu', -0.7, 0.7, 3.2, 3.9); K.rwin(g, h, 'pv', -0.6, 0.6, 3.2, 3.9); K.rwin(g, h, 'nv', -0.6, 0.6, 3.2, 3.9);
  } else if (kind === 'cruise') {
    const zs = [1.4, 3.4, 5.2, 6.8];
    for (let i = 0; i < 3; i++) {
      const f = 1 - i * 0.14, cx = -L * (0.12 + i * 0.05);
      const D = K.rbox(g, cx * ca, cx * sa, L * 0.72 * f, Wd * (0.86 - i * 0.05), ang, zs[i], zs[i + 1], { t: '#E6E3DA', l: '#F5F3EC', r: '#DEDBD2' }, { w: 0.6, nb: true });
      for (const fc of ['pv', 'nv']) if (D.vis[fc]) { const n = 10 - i * 2; for (let k = 0; k < n; k++) { const a = -0.92 + 1.84 * k / n; g.fill(D.quad(fc, a + 0.03, a + 1.84 / n - 0.03, zs[i] + 0.45, zs[i + 1] - 0.45), i === 0 ? '#3F5F8F' : '#5F7FA8'); } }
      for (const fc of ['pu', 'nu']) if (D.vis[fc]) g.fill(D.quad(fc, -0.8, 0.8, zs[i] + 0.45, zs[i + 1] - 0.45), '#5F7FA8');
    }
    const fn = K.rbox(g, -L * 0.45 * ca, -L * 0.45 * sa, 0.8, 0.7, ang, zs[3], zs[3] + 2.2, { t: '#2F343B', l: '#C23B2F', r: '#A3322A' }, { w: 0.5 });
    void fn;
  } else {
    const h = K.rbox(g, -L * 0.1 * ca, -L * 0.1 * sa, L * 0.55, Wd * 0.8, ang, 1.4, 3.8, { t: '#D9D6CC', l: '#F3F1EA', r: '#DEDBD2' }, { w: 0.6 });
    for (const f of ['pv', 'nv']) for (const [a, b] of [[-0.8, -0.35], [-0.2, 0.25], [0.4, 0.8]]) K.rwin(g, h, f, a, b, 2.2, 3.3);
  }
};
/* a gull or egret flying, at wide-px point c, wings phase ph 0..3 */
CQ.bird2 = function (g, c, ph, col) { const w = [2.6, 1.6, 0.4, 1.6][ph % 4]; g.segs2([c[0] - 3, c[1] - w, c[0], c[1], c[0], c[1], c[0] + 3, c[1] - w], col || '#4A4540', 0.45); };

/* a rock mass: a convex footprint (world [x, y] points, anticlockwise on screen) whose corners rise to their own heights;
   the faces that look at us lit by their facing, a mossy top, vertical cracks */
CQ.rock = function (g, pts, z0, tops, o) {
  o = o || {}; const n = pts.length, col = o.col || '#CFC8B8', ink = o.ink || '#5E574A';
  const faces = [];
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], nx = b[1] - a[1], ny = -(b[0] - a[0]); faces.push({ a, b, ta: tops[i], tb: tops[(i + 1) % n], f: (nx + ny) / Math.hypot(nx, ny), lit: (ny - nx) / Math.hypot(nx, ny) }); }
  const cs = [];
  for (const q of faces) if (q.f > 0.02) {
    const quad = [[q.a[0], q.a[1], z0], [q.b[0], q.b[1], z0], [q.b[0], q.b[1], q.tb], [q.a[0], q.a[1], q.ta]];
    g.fill(quad, shade(col, q.lit > 0 ? -0.05 : 0.12 + 0.08 * (1 - q.f)));
    g.outline(quad, { w: 0.8, c: ink });
    const L = Math.hypot(q.b[0] - q.a[0], q.b[1] - q.a[1]); for (let k = 1; k < L / 2.6; k++) { const t = clamp(k * 2.6 / L + 0.07 * Math.sin(k * 3.1), 0.06, 0.94), zt = lerp(q.ta, q.tb, t); const p0 = g.p(lerp(q.a[0], q.b[0], t), lerp(q.a[1], q.b[1], t), z0 + (zt - z0) * (0.15 + 0.3 * h1(k * 7))), p1 = g.p(lerp(q.a[0], q.b[0], t), lerp(q.a[1], q.b[1], t), zt - (zt - z0) * 0.1 * h1(k * 3)); cs.push(p0[0], p0[1], p1[0], p1[1]); }
  }
  g.segs2(cs, shade(col, 0.32), 0.35);
  const top = pts.map((p, i) => [p[0], p[1], tops[i]]);
  g.fill(top, o.top || '#9FB27E'); g.outline(top, { w: 0.7, c: '#5E7A46' });
};

/* ---------------- mist ---------------- */
/* a translucent morning mist bank around the origin (wide px), drifting: soft cream blobs with brushed edges */
CQ.mist2 = function (g, w, h, seed, a) {
  const o = g.p(0, 0, 0), R = RNG(seed || 3), col = 'rgba(247,245,239,' + (a || 0.55) + ')';
  for (let i = 0; i < 4; i++) {
    const cx = o[0] + (R() - 0.5) * w * 0.7, cy = o[1] + (R() - 0.5) * h * 0.4, rx = w * (0.22 + R() * 0.18), ry = h * (0.28 + R() * 0.2), pts = [];
    for (let k = 0; k < 10; k++) { const t = TAU * k / 10; pts.push([cx + Math.cos(t) * rx * (0.85 + R() * 0.3), cy + Math.sin(t) * ry * (0.8 + R() * 0.4)]); }
    g.fill2(K.curve(pts, 3, true), col, true);
  }
  const segs = []; for (let i = 0; i < 14; i++) { const x = o[0] + (R() - 0.5) * w, y = o[1] + (R() - 0.5) * h * 0.8, l = 3 + R() * 7; segs.push(x, y, x + l, y - l * 0.06); }
  g.segs2(segs, 'rgba(250,249,244,0.7)', 1.0);
};
