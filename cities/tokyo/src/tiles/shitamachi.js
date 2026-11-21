'use strict';
/* (100,0) Shitamachi: an old low neighbourhood. One lane runs along x. On its far side two-storey wooden houses face
   us (sliding glass doors, a little tiled pent roof over them, potted plants on the step, a balcony with a futon
   airing over the rail), a block of flats rises behind with laundry on every balcony, and the sentō stands in the
   row with its curved temple-like gable, an indigo noren and a tall chimney breathing steam. On the near side, so the
   lane stays in view, only low things: a coin car park, a tiny shrine with a red torii, a playground with a panda
   rider and a swing. Kids in yellow caps walk home, a granny waters her plants, the postman rides by, a cat walks the
   wall, someone beats a futon. */
SF.tile('shitamachi', 100, 0, { rim: 46 }, function (T) {
  const H = 37, LANE = [-5.5, 1.5];
  T.ground(function (g) {
    K.slab(g, H, { top: '#E6E1D5' });
    g.fill(K.rect(-H, LANE[0], H, LANE[1]), '#D6D0C2'); g.scuff(K.rect(-H, LANE[0], H, LANE[1]), { dir: Math.atan2(AY, AX), len: 7, c: '#C9C3B4', dens: 0.6, w: 0.5, spread: 0.05 });
    g.line([[-H, LANE[0] + 0.5, 0], [H, LANE[0] + 0.5, 0]], { w: 0.45, c: '#F4F1EA', boil: false }); g.line([[-H, LANE[1] - 0.5, 0], [H, LANE[1] - 0.5, 0]], { w: 0.45, c: '#F4F1EA', boil: false });
    // the coin car park: asphalt, white bays, a yellow kerb
    g.fill(K.rect(-36, 3.5, -12, 21), '#CFCAC0'); for (let x = -36; x <= -12; x += 8) g.line([[x, 4, 0], [x, 15, 0]], { w: 0.7, c: '#F7F5EE', boil: false });
    g.line([[-36, 15, 0], [-12, 15, 0]], { w: 0.7, c: '#F7F5EE', boil: false });
    // the playground: sand, and a sandpit
    g.fill(K.rect(2, 4, 34, 33), '#E9DDBA'); g.scuff(K.rect(2, 4, 34, 33), { dir: -0.4, len: 2, c: '#D8C79C', dens: 0.8, w: 0.5, spread: 1.2 });
    g.fill(K.rect(20, 20, 28, 27), '#EFE2BC'); g.outline(K.rect(20, 20, 28, 27), { w: 0.6, c: '#B9A27D', boil: false });
    K.lawn(g, -36, 22, -6, 35, { col: '#B9CF94', dens: 0.6 });
  }, { rim: true });

  /* a two-storey wooden house facing the lane (its front is the face at y = y1) */
  const house = (g, x0, x1, y0, y1, o) => {
    const h = o.h || 8.6, R = RNG(o.seed);
    K.box(g, x0, y0, x1, y1, 0, 4.2, { t: '#D9CDB5', l: o.low || '#8A6A50', r: '#745740' }, { w: 0.85 });
    K.box(g, x0, y0, x1, y1, 4.2, h, { t: '#E9E2CF', l: o.wall || '#F1EAD8', r: '#DCD2BC' }, { w: 0.85 });
    // sliding glass doors in thin frames, a tiled pent roof over them
    const dw = (x1 - x0) * 0.55, dm = x0 + (x1 - x0) * (o.door || 0.42);
    g.fill(K.on('L', y1 + 0.03, dm - dw / 2, dm + dw / 2, 0.2, 3.5), '#CFE0EA');
    for (let k = 0; k <= 4; k++) { const a = dm - dw / 2 + dw * k / 4; g.line([K.pt('L', y1 + 0.05, a, 0.2), K.pt('L', y1 + 0.05, a, 3.5)], { w: 0.35, c: '#5A4636', boil: false }); }
    g.line([K.pt('L', y1 + 0.05, dm - dw / 2, 1.9), K.pt('L', y1 + 0.05, dm + dw / 2, 1.9)], { w: 0.3, c: '#5A4636', boil: false });
    g.fill([[x0 - 0.2, y1, 4.4], [x1 + 0.2, y1, 4.4], [x1 + 0.2, y1 + 1.4, 3.7], [x0 - 0.2, y1 + 1.4, 3.7]], o.roof || '#6E747C');
    g.line([[x0 - 0.2, y1 + 1.4, 3.7], [x1 + 0.2, y1 + 1.4, 3.7]], { w: 0.6, boil: false });
    // upstairs: a window and a balcony with a futon over the rail
    K.win(g, 'L', y1, x0 + 1, x1 - 1, 5.2, 7.6, { style: 'glass' });
    K.box(g, x0 + 0.6, y1, x1 - 0.6, y1 + 1.3, 4.6, 4.9, '#C9C6BD', { w: 0.45, boil: false });
    const rl = []; for (let a = x0 + 0.8; a < x1 - 0.6; a += 0.7) { const p0 = g.p(a, y1 + 1.3, 4.9), p1 = g.p(a, y1 + 1.3, 6.2); rl.push(p0[0], p0[1], p1[0], p1[1]); }
    g.segs2(rl, '#8C8576', 0.3); g.line([[x0 + 0.6, y1 + 1.3, 6.2], [x1 - 0.6, y1 + 1.3, 6.2]], { w: 0.5, boil: false });
    if (o.futon) { const a0 = x0 + 1.2, a1 = a0 + (x1 - x0) * 0.45; g.fill([[a0, y1 + 1.35, 6.3], [a1, y1 + 1.35, 6.3], [a1, y1 + 1.45, 4.3], [a0, y1 + 1.45, 4.3]], o.futon); g.fill([[a0, y1 + 1.36, 6.3], [a1, y1 + 1.36, 6.3], [a1, y1 + 1.4, 5.9], [a0, y1 + 1.4, 5.9]], shade(o.futon, 0.18)); g.outline([[a0, y1 + 1.35, 6.3], [a1, y1 + 1.35, 6.3], [a1, y1 + 1.45, 4.3], [a0, y1 + 1.45, 4.3]], { w: 0.4, c: shade(o.futon, 0.5), boil: false }); }
    if (o.laundry) { const pts = []; const b = x1 - 1.2, a = b - (x1 - x0) * 0.4; g.fine([[a, y1 + 0.9, 7.3], [b, y1 + 0.9, 7.3]], { w: 0.3, c: '#5A564E' }); for (let k = 0; k < 4; k++) { const xx = lerp(a + 0.3, b - 0.3, k / 3), c = R.pick(['#F3F1EA', '#7FB7D9', '#E7A9A0', '#E6C24F', '#8FBF73']); g.fill([[xx - 0.35, y1 + 0.92, 7.25], [xx + 0.35, y1 + 0.92, 7.25], [xx + 0.3, y1 + 0.92, 6.2], [xx - 0.3, y1 + 0.92, 6.2]], c); pts.push(xx); } }
    TK.roof(g, x0, y0, x1, y1, h, o.rh || 3.4, { over: 1.0, lift: 0.4, col: o.roof || '#6E747C', ridge: 'x', gable: o.gable || 0, end: '#F1EAD8' });
    // pots on the step
    for (let k = 0; k < (o.pots || 3); k++) { const x = lerp(x0 + 0.6, dm - dw / 2 - 0.3, k / Math.max(1, (o.pots || 3) - 1)), p = g.p(x, y1 + 0.7, 0); g.fill2([[p[0] - 0.9, p[1]], [p[0] + 0.9, p[1]], [p[0] + 1.1, p[1] - 1.6], [p[0] - 1.1, p[1] - 1.6]], '#B5624B', true); K.bush(g, x, y1 + 0.7, { r: 0.75, z: 0.5, col: R.pick([C.leaf, C.leafD, '#9FCF8A']) }); }
  };

  /* ---------------- the back: flats with laundry on every balcony ---------------- */
  T.obj([-36, -36, -12, -24], function (g) {
    K.box(g, -36, -36, -12, -24, 0, 17, { t: '#DAD6CA', l: '#E9E2CF', r: '#D3CBB6' }, { w: 0.95 });
    const R = RNG(5);
    for (let f = 0; f < 4; f++) {
      const z = 1 + f * 4;
      K.box(g, -35.4, -24, -12.6, -22.8, z + 2.8, z + 3.1, '#C9C6BD', { w: 0.45, boil: false });
      g.fill([[-35.4, -22.8, z + 3.1], [-12.6, -22.8, z + 3.1], [-12.6, -22.8, z + 4.1], [-35.4, -22.8, z + 4.1]], '#D9D6CC');
      g.outline([[-35.4, -22.8, z + 3.1], [-12.6, -22.8, z + 3.1], [-12.6, -22.8, z + 4.1], [-35.4, -22.8, z + 4.1]], { w: 0.4, boil: false });
      for (let k = 0; k < 4; k++) { const a = -34.6 + k * 5.6; K.win(g, 'L', -24, a, a + 3.6, z + 0.4, z + 2.7, { style: 'glass' }); if (R() < 0.7) { const c = R.pick(['#F3F1EA', '#7FB7D9', '#E7A9A0', '#E6C24F', '#F2C6D0']); g.fill([[a + 0.4, -22.7, z + 4.1], [a + 2.6, -22.7, z + 4.1], [a + 2.6, -22.7, z + 3.0], [a + 0.4, -22.7, z + 3.0]], c); } }
    }
    K.cyl(g, -16, -32, 1.8, 17, 19.6, { t: '#E9E6DE', l: '#D9D6CC', r: '#BDBAB1' }, { w: 0.6, n: 10 });
  }, { name: 'flats' });

  /* ---------------- the far row of houses and the sentō ---------------- */
  const ROW = [[-36, -26, { seed: 1, futon: '#E7A9A0', laundry: true, roof: '#5E6E8A' }], [-25.5, -15, { seed: 2, wall: '#EFE6CF', roof: '#7E5A44', gable: 0.4, futon: '#8FB7D9' }], [-14.5, -4, { seed: 3, laundry: true, roof: '#6E747C', low: '#6E5A48' }], [-3.5, 8, { seed: 4, futon: '#F3E3A0', roof: '#5E6E8A', door: 0.6 }]];
  ROW.forEach(([x0, x1, o]) => T.obj([x0, -20, x1, -6.6], (g) => house(g, x0, x1, -20, -7, o), { name: 'house' }));
  T.obj([10, -21, 34, -6.6], function (g) {
    g.boilP = 0.4;
    K.box(g, 10, -21, 34, -7, 0, 7, { t: '#E9E2CF', l: '#F1EAD8', r: '#DCD2BC' }, { w: 0.95 });
    // the entrance under a curved gable, the indigo noren with "yu"
    g.fill(K.on('L', -6.97, 18.5, 25.5, 0, 4.6), '#4A3A30');
    TK.noren(g, 'L', -7, 18.8, 25.2, 2.2, 4.4, '#2F3F63', { n: 3, glyph: 9 });
    TK.roof(g, 10, -21, 34, -7, 7, 6.5, { gable: 0.46, over: 1.8, lift: 1.1, col: '#6E747C', ridge: 'y', end: '#F1EAD8' });
    TK.roof(g, 17.5, -8.4, 26.5, -6.6, 5.0, 2.6, { over: 1.0, lift: 0.9, col: '#6E747C', ridge: 'x', tiles: false });
    TK.sign(g, 'L', -6.6, 18.5, 25.5, 7.4, 8.8, '#F6F1E4', { seed: 160, n: 3 });
    // the chimney behind
    K.cyl(g, 30.5, -17, 1.4, 7, 27, { t: '#C9C6BD', l: '#E3DED2', r: '#C9C3B4' }, { w: 0.8, n: 10 });
    for (const z of [12, 18, 24]) { const b = []; for (let i = 0; i <= 8; i++) { const a = lerp(Math.PI * 0.78, -Math.PI * 0.28, i / 8); b.push([30.5 + Math.cos(a) * 1.42, -17 + Math.sin(a) * 1.42, z]); } g.line(b, { w: 0.45, c: '#8C8576', boil: false }); }
    K.cyl(g, 30.5, -17, 1.7, 26, 27, { t: '#3A3530', l: '#5A564E', r: '#4A4540' }, { w: 0.6, n: 10 });
  }, { name: 'sento' });
  // vending machines against the house wall, a postbox, bicycles
  T.obj([-1.8, -6.8, 4.6, -5.4], (g) => { TK.vend(g, -0.6, -6.1, { face: 'L', col: '#F1EFE8', top: '#C9463E' }); TK.vend(g, 1.8, -6.1, { face: 'L', col: '#5F8FC9' }); TK.vend(g, 4.2, -6.1, { face: 'L', col: '#C9463E', top: '#F3F1EA' }); }, { name: 'vending' });
  T.obj([8.8, -6.2], (g) => { K.cyl(g, 8.8, -6.2, 0.75, 0, 3.4, { t: '#C9463E', l: '#D4553A', r: '#B9432C' }, { w: 0.55, n: 8 }); K.cyl(g, 8.8, -6.2, 0.9, 3.4, 3.8, { t: '#B9432C', l: '#C9463E', r: '#A8382F' }, { w: 0.5, n: 8 }); }, { on: true });

  /* ---------------- the near side: car park, shrine, playground ---------------- */
  [[-32, 9.5, '#F1EFE8'], [-24, 9.5, '#2F343B'], [-16, 9.5, '#C9CCCC']].forEach(([x, y, col], i) => { if (i === 1) return; T.obj([x - 2.7, y - 5.4, x + 2.7, y + 5.4], (g) => g.at(x, y, 0, (g2) => K.car(g2, Math.PI / 2, { col })), { name: 'parked car' }); });
  T.obj([-12.8, 4.4, -11.6, 5.6], (g) => { K.box(g, -12.8, 4.4, -11.6, 5.6, 0, 3.0, '#E6C24F', { w: 0.5 }); const p = g.p(-12.2, 5.6, 4.6); g.disc2(p, 1.6, '#3F6FA8'); g.ring2(p, 1.6, { w: 0.4, c: '#F3F1EA' }); }, { name: 'parking sign' });
  T.obj([-9.5, 6, -3.5, 12], function (g) {                            // the little shrine and its torii
    K.box(g, -9, 6.5, -5, 9.5, 0, 0.8, { t: '#D7D2C6', l: '#C9C3B6', r: '#B9B3A6' }, { w: 0.6 });
    K.box(g, -8.4, 7, -5.6, 9, 0.8, 3.0, { t: '#C9A26B', l: '#D9B57E', r: '#B58F58' }, { w: 0.6 });
    TK.roof(g, -8.4, 7, -5.6, 9, 3.0, 1.6, { over: 0.6, lift: 0.3, col: '#6E8A7E', ridge: 'y', gable: 0.4, end: '#C9A26B', tiles: false });
    TK.torii(g, -7, 11.2, { w: 2.4, h: 3.6, axis: 'x', r: 0.22 });
    for (const x of [-8.6, -5.4]) { const p = g.p(x, 10.4, 0.8); g.fill2([[p[0] - 0.5, p[1]], [p[0] + 0.5, p[1]], [p[0] + 0.4, p[1] - 1.6], [p[0], p[1] - 2.2], [p[0] - 0.4, p[1] - 1.6]], '#F3F1EA', true); }
  }, { name: 'hokora' });
  T.obj([7, 9, 15, 12], function (g) {                                 // the slide
    K.box(g, 7, 9, 8.6, 12, 0, 4.2, { t: '#E6C24F', l: '#E9C543', r: '#C9A03A' }, { w: 0.6 });
    g.fill([[8.6, 9.4, 4.2], [8.6, 11.6, 4.2], [15, 11.6, 0.2], [15, 9.4, 0.2]], '#5F8FC9'); g.outline([[8.6, 9.4, 4.2], [8.6, 11.6, 4.2], [15, 11.6, 0.2], [15, 9.4, 0.2]], { w: 0.6, boil: false });
  }, { name: 'slide' });
  T.obj([11, 18], function (g) {                                       // the panda on its spring
    const p = g.p(11, 18, 0); g.line2([p, [p[0], p[1] - 3]], { w: 0.9, c: '#8C8576', boil: false });
    g.fill2(K.curve([[p[0] - 3, p[1] - 3.2], [p[0] + 3, p[1] - 3.2], [p[0] + 3.2, p[1] - 6.6], [p[0] - 3.2, p[1] - 6.6]], 3, true), '#F6F3EA', true);
    g.disc2([p[0] + 2.8, p[1] - 7.4], 2.0, '#F6F3EA'); g.disc2([p[0] + 1.5, p[1] - 9.2], 0.8, '#2A2622'); g.disc2([p[0] + 4.1, p[1] - 9.2], 0.8, '#2A2622'); g.disc2([p[0] + 2.3, p[1] - 7.6], 0.5, '#2A2622'); g.disc2([p[0] + 3.5, p[1] - 7.6], 0.5, '#2A2622');
    g.fill2([[p[0] - 3, p[1] - 4.6], [p[0] - 1.5, p[1] - 4.6], [p[0] - 1.5, p[1] - 3.2], [p[0] - 3, p[1] - 3.2]], '#2A2622', true);
    g.line2(K.curve([[p[0] - 3, p[1] - 3.2], [p[0] + 3, p[1] - 3.2], [p[0] + 3.2, p[1] - 6.6], [p[0] - 3.2, p[1] - 6.6]], 3, true), { w: 0.5, close: true, boil: false });
  }, { name: 'panda', on: true });
  T.obj([16, 12, 30, 16], function (g) {                               // the swing frame (the swings are actors)
    const posts = []; for (const [x, y] of [[16.4, 12.4], [16.4, 15.6], [29.6, 12.4], [29.6, 15.6]]) { const a = g.p(x, y, 0), b = g.p(x, 14, 8); posts.push(a[0], a[1], b[0], b[1]); }
    g.segs2(posts, '#C9463E', 0.9); g.line([[16.4, 14, 8], [29.6, 14, 8]], { w: 1.0, c: '#C9463E', boil: false });
  }, { name: 'swings' });
  for (const [x, y, r, s] of [[33, 6, 4.2, 1], [-30, 30, 4.4, 0], [-18, 31, 3.8, 1], [33, 30, 4.0, 0]]) T.obj([x, y], (g) => s ? TK.sakura(g, x, y, { r }) : K.tree(g, x, y, { r, h: 5 }), { on: true });
  T.obj([22, 30.5], (g) => K.bench(g, 22, 30.5, { face: 'L', L: 2.6 }), { on: true });
  // utility poles along the lane, wires to the next
  const PL = [-30, -12, 6, 24];
  PL.forEach((x, i) => T.obj([x, 2.4], (g) => { const a = TK.upole(g, x, 2.4, { h: 12.5, across: 'y', band: i === 1 }); if (i + 1 < PL.length) TK.wires(g, a, [[PL[i + 1], 0.8, 11.7], [PL[i + 1], 4.0, 11.7], [PL[i + 1], 1.3, 10.2], [PL[i + 1], 3.5, 10.2]], 1.4); }, { name: 'pole' }));

  /* ---------------- the living layer ---------------- */
  T.cast([22, 31.2], (g) => TK.person(g, 22, 31.2, 1.3, TK.who(1601, { dir: 1, pose: 'sit', hair: '#8E8A84', top: '#B9A27D', glasses: true })), { on: true });
  T.cast([24, 23.5], (g) => { TK.person(g, 22.5, 23.4, 0, TK.who(1602, { dir: 1, k: 0.72, pose: 'kneel', hands: [[2, -2], [3, -1.6]] })); TK.person(g, 25.6, 24.4, 0, TK.who(1603, { dir: 1, k: 0.7, pose: 'kneel', hands: [[-2, -1.6], [-1, -2]] })); const p = g.p(24, 22.6, 0.1); g.fill2(K.curve([[p[0] - 2, p[1]], [p[0], p[1] - 2.6], [p[0] + 2, p[1]]], 3, false).concat([[p[0], p[1] + 0.6]]), '#D8C79C', true); }, { on: true });
  T.cast([-7, 13.4], (g) => TK.person(g, -7, 13.4, 0, TK.who(1604, { dir: 3, pose: 'hold', hair: '#8E8A84', top: '#5A6B5A', dress: '#6C7A89' })), { on: true });
  T.cast([-28.5, -5.4], (g) => { const r = TK.person(g, -28.5, -5.6, 0, TK.who(1605, { dir: 3, pose: 'hold', hair: '#8E8A84', top: '#D98AA4', bot: '#6C7A89' })); void r; }, { on: true });
  // the granny's watering can: a little arc of water to the pots
  T.actor({ sample: 5, period: 10, grow: false, at(t) { const f = Math.floor(t * 4) % 4; return { x: -29.6, y: -6.4, z: 2.6, key: f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), pts = []; for (let k = 0; k <= 6; k++) { const u = k / 6; pts.push([o[0] - u * 5.5, o[1] + u * u * 7 - u * 1.5]); } g.line2(pts, { w: 0.45, c: '#7FB7D9', boil: false }); for (let k = 0; k < 3; k++) { const u = ((st.f / 4 + k / 3) % 1); g.disc2([o[0] - 5.5 - u * 0.5, o[1] + 5.5 + u * 2.2], 0.3, '#A9CDE6'); } g.fill2([[o[0] - 0.4, o[1] - 0.8], [o[0] + 1.8, o[1] - 0.8], [o[0] + 1.6, o[1] + 1.2], [o[0] - 0.2, o[1] + 1.2]], '#8FBF73', true); } });
  // the swings: two kids, one swinging high, one gently
  [[19.5, 1.0, 1611], [26.5, 0.55, 1612]].forEach(([x, amp, seed]) => {
    const who = TK.who(seed, { k: 0.7, cap: '#E6C24F' });
    T.actor({ sample: 5, period: 10, grow: false,
      at(t) { const f = Math.round(Math.sin(t * 2.4 + x) * 4) + 4; return { x, y: 14, z: 0, key: f, a: (f - 4) / 4 * amp * 0.55 }; },
      draw(g, st) {
        const sy = Math.sin(st.a) * 5.6, sz = 8 - Math.cos(st.a) * 5.6, ch = [];
        for (const dx of [-0.9, 0.9]) { const a = g.p(dx, 0, 8), b = g.p(dx, sy, sz); ch.push(a[0], a[1], b[0], b[1]); }
        g.segs2(ch, '#5A564E', 0.35);
        g.fill([[-1.1, sy - 0.5, sz], [1.1, sy - 0.5, sz], [1.1, sy + 0.5, sz], [-1.1, sy + 0.5, sz]], '#6E5A44');
        K.person(g, 0, sy, sz, Object.assign({}, who, { dir: 1, pose: 'sit', k: 0.7 }));
      } });
  });
  // the futon beater on the balcony of the second house
  T.actor({ sample: 5, period: 10, grow: false, at(t) { const f = Math.floor(t * 3) % 3; return { x: -19.6, y: -5.9, z: 4.9, key: f, f }; },
    draw(g, st) { const who = TK.who(1620, { dir: 1, top: '#E7A9A0', hairStyle: 'bun', noLegs: true }), F = g.p(0, 0, 0); const r = K.person(g, 0, 0, 0, Object.assign(who, { hands: [[3.6, -8.6 - st.f * 1.2], [2.8, -9.2 - st.f * 1.2]] })); const h = r.hands[0]; g.line2([h, [h[0] + 3.6, h[1] - 2.4 + st.f * 1.6]], { w: 0.55, c: '#B58F58', boil: false }); g.ring2([h[0] + 3.9, h[1] - 2.8 + st.f * 1.6], 0.9, { w: 0.4, c: '#B58F58' }); void F; } });
  // kids walking home along the lane, a salaryman, the postman's red scooter
  for (let i = 0; i < 3; i++) K.walker(T, TK.who(1630 + i, { k: 0.72, cap: '#E6C24F', randoseru: i % 2 ? '#C9463E' : '#2E2A26', top: '#F3F1EA', bot: '#3F4D63' }), [[-34 + i * 1.6, -1.8 + i * 0.5], [34, -1.8 + i * 0.5]], 1.7, { phase: 0.1 + i * 0.04 });
  K.walker(T, TK.salary(1640), [[34, -3.4], [-34, -3.4]], 2.4, { phase: 0.4 });
  K.walker(T, TK.who(1641, { dress: '#B9A27D' }), [[-20, 0.4], [30, 0.4]], 1.6, { phase: 0.7 });
  T.actor({ sample: 0.3, period: 20,
    at(t) { const u = (t / 20) % 1, dir = u < 0.5 ? 1 : -1, s = u < 0.5 ? u * 2 : (1 - u) * 2, x = -34 + s * 68, a = Math.min(1, Math.min(s, 1 - s) * 16); return { x, y: dir > 0 ? -0.6 : -4.0, key: dir, dir, alpha: a < 1 ? a : null }; },
    draw(g, st) { const ang = st.dir > 0 ? 0 : Math.PI; K.bike(g, ang, { col: '#C9463E', who: TK.who(1650, { top: '#3F5F8F', bot: '#3F5F8F', cap: '#3F5F8F' }) }); const ca = Math.cos(ang); const c = g.p(-2.6 * ca, 0, 2.6); g.fill2([[c[0] - 1.8, c[1] - 1.2], [c[0] + 1.8, c[1] - 1.2], [c[0] + 1.8, c[1] + 1.0], [c[0] - 1.8, c[1] + 1.0]], '#C9463E', true); } });
  // the cat walking along the wall of the car park
  T.actor({ sample: 0.4, period: 16,
    at(t) { const u = (t / 16) % 1, s = u < 0.5 ? u * 2 : (1 - u) * 2, dir = u < 0.5 ? 1 : -1, f = Math.floor(t * 6) % 4; return { x: -35 + s * 22, y: 21.6, z: 2.0, key: dir + '.' + f, dir, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), s = st.dir, P = (u, v) => [o[0] + s * u, o[1] + v]; g.fill2([P(-2.4, -1.4), P(1.2, -1.6), P(1.6, -0.4), P(-2.2, -0.2)], '#E08A3C', true); g.disc2(P(2.0, -2.0), 1.1, '#E08A3C'); g.fill2([P(1.4, -2.9), P(1.7, -3.7), P(2.1, -2.9)], '#E08A3C', true); g.fill2([P(2.3, -2.9), P(2.7, -3.6), P(2.9, -2.6)], '#E08A3C', true); const lg = [-1.8, -0.9, 0.4, 1.1].map((u, i) => { const sw = ((st.f + i) % 2) * 0.5; return P(u + sw, -0.3).concat(P(u + sw - 0.2, 0.9)); }).flat(); g.segs2(lg, '#B9622A', 0.5); g.line2([P(-2.4, -1.2), P(-3.6, -3.0), P(-3.2, -3.8)], { w: 0.55, c: '#E08A3C', boil: false }); g.disc2(P(2.4, -2.1), 0.18, '#2A2622'); } });
  // the wall the cat walks on
  T.obj([-36, 20.8, -12, 22.2], (g) => K.box(g, -36, 20.8, -12, 22.2, 0, 2.0, { t: '#D7D2C6', l: '#C9C3B6', r: '#B9B3A6' }, { w: 0.6 }), { name: 'wall' });
  // steam from the sentō chimney
  T.actor({ sample: 5, period: 10, grow: false, layer: '',
    at(t) { const f = Math.floor(t * 3) % 8; return { x: 30.5, y: -17, z: 27, key: f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0); for (let k = 0; k < 4; k++) { const u = ((st.f / 8) + k / 4) % 1, y = o[1] - u * 22, x = o[0] + u * 10 + Math.sin(u * 4 + k) * 1.5, r = 1.6 + u * 3.4; const pts = []; for (let i = 0; i < 9; i++) { const a = TAU * i / 9; pts.push([x + Math.cos(a) * r * 1.4, y + Math.sin(a) * r * 0.7]); } g.fill2(pts, mix('#F6F4EE', '#DCD8CE', 0.4 - u * 0.35), true); g.line2(pts.slice(0, 5), { w: 0.3, c: '#B9B3A6', boil: false, wob: 0.6 }); } } });
});
