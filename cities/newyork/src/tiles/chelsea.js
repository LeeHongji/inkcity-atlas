'use strict';
/* (100,0) Chelsea, the High Line and Hudson Yards (the west side, by the Hudson).
   What it is: the High Line, the old freight railway lifted on a riveted steel viaduct and turned into a park in the air.
   Drawn as it is built: pairs of steel columns, a deep plate girder painted dark green-grey, and on the deck a ribbon of
   concrete planks that taper into wild planting (tall grasses, perennials, little birches), the old rails surfacing in
   the beds, a sundeck of wooden loungers, railings on both edges, a stair down at the north end. Beside it Chelsea
   Market: the old biscuit factory, a big dark-red brick block with arched windows, a loading-dock canopy and water
   tanks. A white-box gallery with tall glass. North, at Hudson Yards, the Vessel: a copper honeycomb of stair flights
   rising as an upturned bowl, on a paved square with planting.
   Who is there: strollers on the High Line, sunbathers on the loungers, a couple taking a selfie at the rail, people
   looking at a huge canvas in the gallery, a queue for the Vessel and tourists on its landings, a food truck with
   customers, a market shopper with bags, a dog walker. What moves: walkers on the deck both ways, walkers on the square
   and the sidewalks, a Citi Bike rider, steam from the market's vent. */
SF.tile('chelsea', 100, 0, { rim: 38 }, function (T) {
  const HX0 = 22, HX1 = 30, HY0 = -31, HY1 = 23, DZ = 6.6;          // the High Line's footprint and deck height
  const STEEL = { t: '#6E7C76', l: '#5C6B66', r: '#4C5A55' };

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    NK.lot(g, { inner: '#E3DED3' });
    // the Hudson Yards square: big pale pavers, planted beds
    const sq = K.rect(-31, 10, 20, 31);
    g.fill(sq, '#E8E1D2'); g.scuff(sq, { dir: -0.5, len: 3, c: '#D6CCB8', dens: 0.6, w: 0.45 });
    for (const [x0, y0, x1, y1] of [[-30, 27, -20, 30], [2, 26, 10, 30], [-30, 11, -26, 18]]) { const q = K.rect(x0, y0, x1, y1); g.fill(q, '#A9C47E'); g.grass(q, { dens: 1.2 }); g.outline(q, { w: 0.4, c: '#7F9A5E', boil: false }); }
    // the sidewalk strip under the High Line
    const ul = K.rect(HX0 - 1, HY0, HX1 + 1, 31); g.fill(ul, '#DDD8CC'); g.scuff(ul, { dir: Math.atan2(AY, -AX), len: 4, c: '#CFC9BB', dens: 0.5, w: 0.4, spread: 0.05 });
    // the old rail spur through the passage, rusty, in the paving
    g.fine([[20.4, -31, 0.01], [20.4, 10, 0.01]], { w: 0.4, c: '#8E6E52' }); g.fine([[21.4, -31, 0.01], [21.4, 10, 0.01]], { w: 0.4, c: '#8E6E52' });
  }, { rim: true });

  /* ---------------- Chelsea Market ---------------- */
  T.obj([-31, -31, 6, -12], function (g) {
    const col = '#9E4E3C', nf = 4, fh = 3.6, H = 4.6 + nf * fh;
    K.box(g, -31, -31, 6, -12, 0, H, { t: '#C9BCA8', l: col, r: shade(col, 0.15) }, { w: 1 });
    const bc = []; for (const [f, pl, A0, A1] of [['L', -12, -31, 6], ['R', 6, -31, -12]]) for (let z = 5.4; z < H - 0.6; z += 1.1) { const p0 = g.p.apply(g, K.pt(f, pl + 0.02, A0, z)), p1 = g.p.apply(g, K.pt(f, pl + 0.02, A1, z)); bc.push(p0[0], p0[1], p1[0], p1[1]); }
    g.segs2(bc, shade(col, 0.18), 0.25);
    NK.windows(g, 'L', -12, -30.6, 5.6, 4.6, fh, nf, 12, { style: 'glass', arch: true, hfill: 0.62, sillCol: '#D9CDB8' });
    NK.windows(g, 'R', 6, -30.6, -12.4, 4.6, fh, nf, 6, { style: 'glass', arch: true, hfill: 0.62, sillCol: '#D9CDB8' });
    // the ground floor: dark brick piers, shop windows, the entrance with its name
    for (let x = -30; x < 5; x += 4.4) K.win(g, 'L', -11.98, x, x + 3.0, 0.3, 3.6, { style: 'glass', arch: true });
    g.fill(K.on('L', -11.96, -14, -9, 0, 3.8), '#3A3028');
    NK.sign(g, 'L', -12, -18.5, -4.5, 4.0, 5.0, '#2F2C2A', 'CHELSEA MARKET', { ink: '#E9D9A8' });
    // the loading-dock canopy on its steel brackets
    K.box(g, -30, -12, -19, -9.8, 4.2, 4.6, '#5C6B66', { w: 0.6, boil: false });
    const br = []; for (let x = -29; x < -19; x += 3) { const a = g.p(x, -9.9, 4.2), b = g.p(x, -12, 3.0); br.push(a[0], a[1], b[0], b[1]); } g.segs2(br, '#3E4A45', 0.4);
    NK.cornice(g, -31, -31, 6, -12, H - 0.2, { t: '#C9BCA8', l: '#8C4434', r: '#763A2C' }, { h: 0.7, d: 0.4 });
    NK.tank(g, -24, -25, H + 0.4, { r: 2.0, h: 3.8 }); NK.tank(g, -8, -27, H + 0.4, { r: 1.6, h: 3.0, leg: 1.5 });
    NK.roofStuff(g, -30, -30, 4, -14, H + 0.4, 11);
  }, { name: 'chelsea market' });

  /* ---------------- the gallery, the far-right garage ---------------- */
  T.obj([-31, -6, -12, 8], function (g) {
    K.box(g, -31, -6, -12, 8, 0, 9.4, { t: '#E9E6DE', l: '#F3F1EA', r: '#DCD8CE' }, { w: 0.9 });
    g.fill(K.on('L', 8.02, -30, -13, 0.3, 6.6), '#F4F3EE');
    // a huge canvas and two smaller ones inside the white room
    g.fill(K.on('L', 8.04, -27.5, -22, 1.6, 5.6), '#2F6DB5'); g.fill(K.on('L', 8.05, -26.5, -24, 2.6, 4.4), '#E6C24F');
    g.fill(K.on('L', 8.04, -19.5, -17, 2.2, 4.8), '#C9463E'); g.fill(K.on('L', 8.04, -16, -14, 2.6, 4.2), '#2F2C2A');
    const mu = []; for (let x = -30; x <= -13; x += 4.25) { const a = g.p(x, 8.06, 0.3), b = g.p(x, 8.06, 6.6); mu.push(a[0], a[1], b[0], b[1]); } g.segs2(mu, '#5E5A52', 0.45);
    g.outline(K.on('L', 8.06, -30, -13, 0.3, 6.6), { w: 0.6, boil: false });
    NK.text(g, 'L', 8.06, -21.5, 7.4, 1.0, 'GALLERY', '#2C271C', { center: true, w: 0.4 });
    K.win(g, 'R', -12, -5, 7, 2, 6, { style: 'glass' });
    for (let x = -29; x < -14; x += 5) { K.box(g, x, -3, x + 3, 5, 9.4, 10.2, { t: '#CFE0EA', l: '#B9CCD8', r: '#9DB6C8' }, { w: 0.5, boil: false }); }
    NK.roofStuff(g, -30, -5, -13, 7, 9.4, 21);
  }, { name: 'gallery' });
  T.obj([10, -31, 19, -20], (g) => { NK.block(g, 10, -31, 19, -20, 8.5, { t: '#D9D2C4', l: '#B9B2A2', r: '#9F9888' }); g.fill(K.on('R', 19.02, -29, -23, 0, 5), '#7A756C'); const sl = []; for (let z = 0.5; z < 5; z += 0.5) { const a = g.p(19.04, -29, z), b = g.p(19.04, -23, z); sl.push(a[0], a[1], b[0], b[1]); } g.segs2(sl, '#5E5A52', 0.3); NK.sign(g, 'L', -20, 11, 18, 5.6, 7.4, '#E6C24F', 'ART'); }, { name: 'garage gallery' });
  T.obj([10, -17, 19, -3], (g) => NK.walkup(g, 10, -17, 19, -3, 4, { face: 'R', col: NYC.brick2, shop: { col: '#3E6B4F', word: 'COFFEE', awning: '#3E6B4F' }, tx: 0.5, ty: 0.3 }), { name: 'walkup coffee' });
  T.obj([10, -1, 19, 9], (g) => NK.walkup(g, 10, -1, 19, 9, 3, { face: 'R', col: NYC.brick, shop: { col: '#2F2C2A', word: 'WINE', awning: '#7A2E3A' }, tank: false }), { name: 'walkup wine' });

  /* ---------------- the High Line ---------------- */
  const PIECES = [[-31, -20], [-20, -9], [-9, 2], [2, 13], [13, HY1]];
  PIECES.forEach(([y0, y1], k) => T.obj([HX0, y0, HX1, y1], function (g) {
    g.boilP = 0.3;
    // the columns (pairs), the plate girders on both sides, the deck edge
    for (let y = y0 + 2.5; y < y1 - 0.5; y += 7.2) for (const x of [HX0 + 0.7, HX1 - 0.7]) K.box(g, x - 0.45, y - 0.45, x + 0.45, y + 0.45, 0, DZ - 1.4, STEEL, { w: 0.55, boil: false });
    K.box(g, HX0, y0, HX1, y1, DZ - 1.6, DZ, STEEL, { w: 0.85, faces: k === PIECES.length - 1 ? 'tlr' : 'tr' });
    const rv = []; for (let y = y0 + 0.6; y < y1; y += 1.2) { const a = g.p(HX1 + 0.02, y, DZ - 0.25), b = g.p(HX1 + 0.02, y, DZ - 1.35); rv.push(a[0], a[1], b[0], b[1]); } g.segs2(rv, '#3E4A45', 0.22);
    // on the deck: planting beds with tall grasses, the plank walk, the old rails
    const bed = K.rect(HX0 + 0.3, y0, HX1 - 0.3, y1, DZ + 0.02); g.fill(bed, '#9DB873'); g.grass(bed, { dens: 1.5 });
    const R = RNG(k * 17 + 3), walk = [];
    for (let y = y0; y < y1; y += 1.0) { const c = 26 + Math.sin((y + 31) * 0.12) * 1.6, w = 1.5 + 0.5 * Math.sin(y * 0.4); walk.push([c - w, y, c + w]); }
    walk.push([walk[walk.length - 1][0], y1, walk[walk.length - 1][2]]);
    g.fill(walk.map((q) => [q[0], q[1], DZ + 0.04]).concat(walk.slice().reverse().map((q) => [q[2], q[1], DZ + 0.04])), '#D9D3C6');
    const pl = []; for (const q of walk) { const a = g.p(q[0], q[1], DZ + 0.05), b = g.p(q[2], q[1], DZ + 0.05); pl.push(a[0], a[1], b[0], b[1]); } g.segs2(pl, '#BDB6A6', 0.25);
    g.fine([[HX0 + 1.0, y0, DZ + 0.06], [HX0 + 1.0, y1, DZ + 0.06]], { w: 0.35, c: '#8E6E52' }); g.fine([[HX0 + 2.1, y0, DZ + 0.06], [HX0 + 2.1, y1, DZ + 0.06]], { w: 0.35, c: '#8E6E52' });
    // perennials, little birches, the lounge deck on one piece
    const fl = []; for (let i = 0; i < 26; i++) { const x = HX0 + 0.6 + R() * (HX1 - HX0 - 1.2), y = y0 + R() * (y1 - y0), c = 26 + Math.sin((y + 31) * 0.12) * 1.6; if (Math.abs(x - c) < 2.2) continue; const p = g.p(x, y, DZ); fl.push([p, R.pick(['#B98AC9', '#E6C24F', '#F3F1EA', '#D96B5C', '#8E79C0'])]); }
    for (const [p, c] of fl) { g.segs2([p[0], p[1], p[0] + 0.3, p[1] - 3], '#6E8A4A', 0.3); g.disc2([p[0] + 0.3, p[1] - 3], 0.6, c); }
    for (let i = 0; i < 2; i++) { const x = i ? HX1 - 1.2 : HX0 + 1.3, y = y0 + 3 + i * 5; if (y < y1 - 1) K.tree(g, x, y, { r: 1.7, h: 4.2, z: DZ, col: '#A6CB7E', tw: 0.5 }); }
    // railings on both edges
    for (const x of [HX0 + 0.15, HX1 - 0.15]) { const rl = []; for (let y = y0; y <= y1; y += 1.4) { const a = g.p(x, y, DZ), b = g.p(x, y, DZ + 1.3); rl.push(a[0], a[1], b[0], b[1]); } g.segs2(rl, '#3E4A45', 0.3); g.fine([[x, y0, DZ + 1.3], [x, y1, DZ + 1.3]], { w: 0.4, c: '#3E4A45' }); }
  }, { name: 'high line', under: DZ }));
  // the stair down at the north end
  T.obj([HX0 + 2, HY1, HX1 - 1, 30.5], function (g) {
    const n = 10, x0 = HX0 + 2, x1 = HX1 - 1;
    for (let i = 0; i < n; i++) { const y = HY1 + (30.5 - HY1) * i / n, y2 = HY1 + (30.5 - HY1) * (i + 1) / n, z = DZ * (1 - i / n), z2 = DZ * (1 - (i + 1) / n); g.fill([[x0, y, z], [x1, y, z], [x1, y2, z], [x0, y2, z]], '#CFC9BC'); g.fill([[x0, y2, z], [x1, y2, z], [x1, y2, z2], [x0, y2, z2]], '#B3AC9C'); }
    g.fill([[x1, HY1, 0], [x1, HY1, DZ], [x1, 30.5, 0]], '#8E968F'); g.outline([[x1, HY1, DZ], [x1, 30.5, 0], [x1, HY1, 0]], { w: 0.6, boil: false });
    for (const x of [x0, x1]) g.fine([[x, HY1, DZ + 1.3], [x, 30.5, 1.3]], { w: 0.45, c: '#3E4A45' });
  }, { name: 'stair' });

  /* ---------------- the Vessel ---------------- */
  const VX = -12, VY = 19, VZ = 15;
  T.obj([VX - 6.5, VY - 6.5, VX + 6.5, VY + 6.5], function (g) {
    g.boilP = 0.3;
    const rAt = (z) => 3.0 + 3.6 * Math.pow(z / VZ, 0.85), CU = '#C98A5C', CUD = '#A86E48', IN = '#94593A';
    const ring = (z, a0, a1, n) => { const p = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); p.push(g.p(VX + Math.cos(a) * rAt(z), VY + Math.sin(a) * rAt(z), z)); } return p; };
    // the inside of the bowl (the far half), seen over the near rim
    g.fill2(ring(VZ, A_R + TAU, A_L, 18).concat(ring(0.4, A_L, A_R + TAU, 18)), IN);
    // the near half: copper shell with the diamond lattice of stair flights
    const outer = ring(0, A_L, A_R + TAU, 18).concat(ring(VZ, A_R + TAU, A_L, 18).reverse().reverse());
    g.fill2(ring(0, A_L, A_R, 18).concat(ring(VZ, A_R, A_L, 18)), CU);
    g.fill2(ring(0, Math.PI * 0.2, A_R, 8).concat(ring(VZ, A_R, Math.PI * 0.2, 8)), CUD);
    const lat = [], NZ = 8, NA = 14;
    for (let i = 0; i < NZ; i++) for (let j = 0; j < NA; j++) {
      const z0 = VZ * i / NZ, z1 = VZ * (i + 1) / NZ, a0 = A_L + (A_R - A_L) * j / NA + (i % 2 ? 0.5 : 0) * (A_R - A_L) / NA, a1 = a0 + (A_R - A_L) / NA;
      if (a0 < A_R) continue;
      const P = (z, a) => g.p(VX + Math.cos(a) * rAt(z), VY + Math.sin(a) * rAt(z), z), am = Math.max((a0 + a1) / 2, A_R);
      const p0 = P(z0, a0), p1 = P(z1, am), p2 = P(z0, Math.max(a1, A_R));
      lat.push(p0[0], p0[1], p1[0], p1[1], p1[0], p1[1], p2[0], p2[1]);
    }
    g.segs2(lat, '#6E4026', 0.6);
    { const il = []; for (let i = 0; i < NZ; i++) for (let j = 0; j < NA; j++) { const z0 = VZ * i / NZ, z1 = VZ * (i + 1) / NZ, b0 = A_R + TAU - (A_R + TAU - A_L) * j / NA - (i % 2 ? 0.5 : 0) * (A_R + TAU - A_L) / NA, b1 = b0 - (A_R + TAU - A_L) / NA; if (b1 < A_L) continue; const Q = (z, a) => g.p(VX + Math.cos(a) * rAt(z) * 0.98, VY + Math.sin(a) * rAt(z) * 0.98, z); const q0 = Q(z0, b0), q1 = Q(z1, (b0 + b1) / 2), q2 = Q(z0, b1); il.push(q0[0], q0[1], q1[0], q1[1], q1[0], q1[1], q2[0], q2[1]); } g.segs2(il, '#7A4A2E', 0.4); }
    for (let i = 1; i <= NZ; i++) g.fine2(ring(VZ * i / NZ, A_L, A_R, 18), { w: 0.45, c: '#EBC097' });
    g.line2(ring(VZ, 0, TAU, 32), { w: 0.85, c: '#5E3A24', boil: false });
    g.line2(ring(0, A_L, A_R, 18), { w: 0.8, c: '#5E3A24' });
    g.line2([ring(0, A_L, A_L, 1)[0], ring(VZ, A_L, A_L, 1)[0]], { w: 0.85, c: '#5E3A24' }); g.line2([ring(0, A_R, A_R, 1)[0], ring(VZ, A_R, A_R, 1)[0]], { w: 0.85, c: '#5E3A24' });
    // tiny visitors on the landings (busts against the copper)
    const R = RNG(77);
    for (let i = 0; i < 9; i++) { const z = VZ * (0.25 + R() * 0.7), a = lerp(A_L + 0.3, A_R - 0.3, R()), p = g.p(VX + Math.cos(a) * (rAt(z) + 0.1), VY + Math.sin(a) * (rAt(z) + 0.1), z); g.fill2([[p[0] - 0.8, p[1]], [p[0] + 0.8, p[1]], [p[0] + 0.6, p[1] - 2.2], [p[0] - 0.6, p[1] - 2.2]], R.pick(['#C9463E', '#F3F1EA', '#2F6DB5', '#E6C24F', '#2F2C2A']), true); g.disc2([p[0], p[1] - 2.9], 0.65, R.pick(SKIN)); }
    void outer;
  }, { name: 'vessel' });

  /* ---------------- furniture ---------------- */
  for (const [x, y] of [[-25, 33.5], [-6, 33.5], [8, 33.5], [-33.5, -20], [-33.5, 4], [-33.5, 22]]) T.obj([x, y], (g) => NK.tree(g, x, y, { r: 3.2 }));
  for (const [x, y] of [[-24, 22], [2, 14]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.0, h: 5, col: '#9BC475' }));
  T.obj([33.6, 26], (g) => NK.hydrant(g, 33.6, 26));
  T.obj([-2, 33.4], (g) => NK.basket(g, -2, 33.4));
  T.obj([-4, 13.5], (g) => NK.citibikes(g, -4, 13.5, 'x', 5), { name: 'citibikes' });
  // the food truck parked on the square
  T.obj([4, 21], (g) => g.at(4, 21, 0, (g2) => { NK.truck(g2, -Math.PI / 2, { col: '#E6C24F', cab: '#E6C24F', stripe: '#C9463E' }); g2.fill(K.on('R', 2.64, -1.2, 3.6, 3.6, 5.6), '#3A3530'); NK.text(g2, 'R', 2.62, -1.2, 6.0, 0.9, 'TACOS', '#C9463E', { center: true, w: 0.4 }); }), { name: 'food truck' });

  /* ---------------- the living layer ---------------- */
  // loungers on the High Line sundeck with sunbathers
  for (const [y, s] of [[-27, 1300], [-24.5, 1301], [-6, 1302]]) T.cast([HX0 + 1.8, y], (g) => {
    const x = HX0 + 1.8, q = [[x - 1.0, y - 2.2, DZ + 0.6], [x + 1.0, y - 2.2, DZ + 0.6], [x + 1.0, y + 2.0, DZ + 1.3], [x - 1.0, y + 2.0, DZ + 1.3]];
    g.fill(q, '#B98A5A'); g.outline(q, { w: 0.4, c: '#6E4E30', boil: false });
    NK.person(g, x, y - 0.6, DZ + 0.95, NK.who(s, { dir: 1, pose: 'sit', shorts: true, bare: true, glasses: true }));
  }, { on: true });
  // the selfie couple at the rail, a photographer
  T.cast([HX1 - 1.4, -13], (g) => { NK.person(g, HX1 - 1.4, -13.6, DZ, NK.who(1310, { dir: 1, pose: 'hold', phone: true })); NK.person(g, HX1 - 1.4, -12.2, DZ, NK.who(1311, { dir: 1, pose: 'wave', ph: 0.2 })); }, { on: true });
  T.cast([HX1 - 1.3, 8], (g) => NK.person(g, HX1 - 1.3, 8, DZ, NK.tourist(1312, { dir: 0, pose: 'hold', phone: true })), { on: true });
  // in the gallery: three people before the big canvas
  T.cast([-23, 9.6], (g) => { NK.person(g, -25, 10.2, 0, NK.who(1320, { dir: 3, glasses: true, top: '#2F2C2A' })); NK.person(g, -22.5, 10.6, 0, NK.who(1321, { dir: 3, top: '#2F2C2A', dress: '#2F2C2A' })); NK.person(g, -16, 10.3, 0, NK.who(1322, { dir: 2, pose: 'hold' })); }, { on: true });
  // the queue for the Vessel and two tourists photographing it
  T.cast([-3, 24], (g) => { for (let i = 0; i < 6; i++) NK.person(g, -4.6 + i * 1.5, 25.2 + (i % 2) * 0.4, 0, NK.tourist(1330 + i, { dir: 2, pose: i % 3 === 1 ? 'hold' : 'stand', phone: i % 3 === 1 })); }, { on: true });
  T.cast([-18, 29], (g) => { NK.person(g, -18, 29, 0, NK.tourist(1340, { dir: 3, pose: 'hold', phone: true })); NK.person(g, -15.8, 29.6, 0, NK.who(1341, { dir: 3 })); }, { on: true });
  // the food truck's customers
  T.cast([9, 19], (g) => { NK.person(g, 9.2, 17.5, 0, NK.who(1350, { dir: 2, pose: 'hold' })); NK.person(g, 9.8, 20, 0, NK.who(1351, { dir: 2 })); NK.person(g, 9.4, 22.6, 0, NK.suit(1352, { dir: 2, pose: 'hold', phone: true })); }, { on: true });
  // a shopper at the market door with her bags
  T.cast([-10.5, -9.5], (g) => { const r = NK.person(g, -10.5, -9.5, 0, NK.who(1360, { dir: 1, pose: 'hold' })); const h = r.hands[0]; g.fill2([[h[0] - 1.3, h[1]], [h[0] + 1.3, h[1]], [h[0] + 1.2, h[1] + 3], [h[0] - 1.2, h[1] + 3]], '#E9E1CC', true); }, { on: true });

  // strollers on the High Line deck, both ways
  for (let k = 0; k < 5; k++) {
    const who = k % 3 === 2 ? NK.tourist(1370 + k) : NK.who(1370 + k), up = k % 2, sp = 3.4 + k * 0.25;
    T.actor({ sample: 0.25, period: 30,
      at(t) {
        const L = HY1 - HY0 - 1, d = ((t * sp + k * 13) % L), y = up ? HY1 - 0.5 - d : HY0 + 0.5 + d, x = 26 + Math.sin((y + 31) * 0.12) * 1.6 + (up ? 0.8 : -0.8), ph = Math.floor((d / 2.4) % 1 * 8);
        return { x, y, z: DZ, key: (up ? 3 : 1) + '.' + ph, dir: up ? 3 : 1, ph: ph / 8 };
      },
      draw(g, st) { NK.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
  }
  // walkers on the square, under the High Line and on the sidewalks
  NK.walker(T, NK.who(1380), [[-12, 11], [9, 11]], 4.6, { phase: 0.15 });
  NK.walker(T, NK.who(1381, { tote: '#2F2C2A' }), [[21, -30], [21, 30]], 4.4, { phase: 0.4 });
  NK.walker(T, NK.suit(1382, { coffee: true }), [[26, 30], [26, -30]], 5.4, { phase: 0.6 });
  NK.walker(T, NK.who(1383), [[30, 33.8], [-30, 33.8]], 4.8, { phase: 0.25 });
  NK.walker(T, NK.who(1384, { phone: true }), [[33.6, -30], [33.6, 30]], 4.6, { phase: 0.7 });
  NK.walker(T, NK.who(1385), [[-30, -33.6], [30, -33.6]], 5.0, { phase: 0.35 });
  NK.walker(T, NK.who(1386), [[-33.6, 30], [-33.6, -30]], 4.4, { phase: 0.55 });
  // a dog walker crossing the square
  const dw = NK.who(1390);
  T.actor({ sample: 0.25, period: 20,
    at(t) { const L = 14, d = (t * 3.2) % (2 * L), fw = d < L, y = fw ? 12 + d : 12 + (2 * L - d), ph = Math.floor((d / 2.4) % 1 * 8); return { x: -21.6, y, key: (fw ? 'f' : 'b') + ph, fw, ph: ph / 8 }; },
    draw(g, st) { const r = NK.person(g, 0, 0, 0, Object.assign({}, dw, { dir: st.fw ? 1 : 3, pose: 'walk', ph: st.ph })); const p = g.p(st.fw ? 0.5 : -0.5, st.fw ? 2.6 : -2.6, 0); NK.dog2(g, p, st.fw ? -1 : 1, '#3A3128', st.ph); g.fine2([r.hands[0], [p[0] + (st.fw ? 2.8 : -2.8), p[1] - 3]], { w: 0.22, c: '#3A3128' }); } });
  NK.steamActor(T, -5, -21, { z: 19.2, H: 8, n: 4, w: 1.2, drift: 4, per: 2.4, phase: 0.6 });
  NK.corners(T);
});
