'use strict';
/* (100,0) Copacabana: the beachfront and the beach.
   Built: the wall of buildings facing the sea along Avenida Atlântica — the white Copacabana Palace (1923: an arched
   ground floor, rows of balconies, a central bay with a pediment, flags on the roof) between pastel apartment blocks
   with balcony slabs; behind them lower blocks with laundry, water tanks and a rooftop pool, and at the back a little
   praça with mango trees, a newsstand and domino tables. Beyond the avenue (local x 57-92, drawn by this tile): two
   kiosks on the calçadão, coconut palms, Posto 4, the sand with umbrellas and chairs, a footvolley court, an altinha
   circle, a sand sculpture; surfers and swimmers in the surf.
   Who: neighbours on their balconies, sunbathers, the footvolley four (the ball over the net, a bicycle kick), five
   friends keeping a ball up, the mate seller in orange with his two silver barrels, the biscoito Globo seller, a
   canga seller with sarongs on a pole, a lifeguard, surfers, old men at dominoes, a newsstand owner. */
SF.tile('copacabana', 100, 0, { rim: 22 }, function (T) {
  T.ground(function (g) {
    K.slab(g, 37, { top: '#E6E0D2' });
    RJ.mosaic(g, -36, -36, -6, -5, { sp: 2.4 });
    g.fill(K.rect(-6, -37, 22, 37), '#D9D3C6');
    g.fill(K.rect(18, -37, 23.5, 37), '#D3CDC0');
    // the praça: a sandy ground under the mango trees
    g.fill(K.rect(-35, -35, -8, -7), '#E3D6BA'); g.scuff(K.rect(-35, -35, -8, -7), { dir: -0.5, len: 1.5, c: '#D2C29E', dens: 0.5, w: 0.45, spread: 1.0 });
    // towels and footprints on the sand beyond the avenue; the footvolley court's lines
    const tw = [[71, -30, '#E86A9A'], [74, -26, '#F2C230'], [83, -31, '#2F6DB5'], [70, 6, '#3A9A5B'], [84, 4, '#D9463B'], [72, 32, '#5FC0B0'], [82, 26, '#F2C230'], [79, -22, '#F3F1EA']];
    for (const [x, y, c] of tw) { g.fill([[x - 1.2, y - 2.6, 0.02], [x + 1.2, y - 2.6, 0.02], [x + 1.2, y + 2.6, 0.02], [x - 1.2, y + 2.6, 0.02]], c); g.fill([[x - 1.2, y - 0.4, 0.03], [x + 1.2, y - 0.4, 0.03], [x + 1.2, y + 0.4, 0.03], [x - 1.2, y + 0.4, 0.03]], '#F6F3EA'); }
    g.outline([[72, -17, 0.02], [82, -17, 0.02], [82, -5, 0.02], [72, -5, 0.02]], { w: 0.5, c: '#2F6DB5', boil: false });
  }, { rim: true });

  /* ---------------- the beachfront ---------------- */
  const PAL = { t: '#EDEAE2', l: '#F6F4EE', r: '#E4E0D6' };
  T.obj([24, -13, 36, 13], function (g) {
    g.boilP = 0.25;
    K.box(g, 24, -13, 36, 13, 0, 13.4, PAL, { w: 1 });
    // ground floor: an arcade of round arches on the sea face, a canopy over the door
    for (let y = -12; y < 12; y += 2.4) K.win(g, 'R', 36, y, y + 1.6, 0.3, 3.2, { style: 'dark', arch: true });
    for (const [f, p, a0, a1] of [['R', 36, -12.5, 12.5], ['L', 13, 24.5, 35.5]]) {
      for (let z = 4.4; z < 12; z += 2.4) {
        const n = Math.floor((a1 - a0) / 2.4);
        for (let i = 0; i < n; i++) { const c = a0 + (a1 - a0) * (i + 0.5) / n; if (f === 'L' && z < 4.5) continue; K.win(g, f, p, c - 0.6, c + 0.6, z, z + 1.5, { style: 'navy' }); }
        const b0 = g.p.apply(g, K.pt(f, p + 0.6, a0, z - 0.1)), b1 = g.p.apply(g, K.pt(f, p + 0.6, a1, z - 0.1)); g.line2([b0, b1], { w: 0.5, c: '#B9B3A6', boil: false });
      }
    }
    // the central bay with its pediment, the name, a cornice and the roof balustrade with flags
    K.box(g, 36, -4, 36.8, 4, 0, 14.6, PAL, { w: 0.8 });
    g.fill([[36.82, -4.2, 14.6], [36.82, 4.2, 14.6], [36.82, 0, 16.6]], '#F6F4EE'); g.outline([[36.82, -4.2, 14.6], [36.82, 4.2, 14.6], [36.82, 0, 16.6]], { w: 0.7, boil: false });
    K.text(g, 'R', 36.86, 0, 12.6, 0.9, 'COPACABANA PALACE', '#B08A3E', { center: true, w: 0.5 });
    K.box(g, 23.6, -13.4, 36.4, 13.4, 13.4, 14.0, '#E9E5DB', { w: 0.6 });
    const ff = []; for (let y = -12; y <= 12; y += 1.2) { const a = g.p(36.3, y, 14), b = g.p(36.3, y, 14.8); ff.push(a[0], a[1], b[0], b[1]); } g.segs2(ff, '#B9B3A6', 0.35);
    for (const [y, c] of [[-8, '#3A9A5B'], [8, '#2F6DB5']]) { const b = g.p(33, y, 14), t = g.p(33, y, 19); g.segs2([b[0], b[1], t[0], t[1]], '#6E6A60', 0.4); g.fill2([[t[0], t[1]], [t[0] + 5, t[1] + 0.6], [t[0] + 5, t[1] + 3.2], [t[0], t[1] + 2.6]], c, true); }
    // the awnings of the restaurant at the corner
    for (let y = -11; y < -4; y += 2.4) g.fill([[36, y, 3.4], [36, y + 1.8, 3.4], [37.4, y + 1.8, 2.6], [37.4, y, 2.6]], '#F2C230');
    // at night the Palace is floodlit, its white front warm over the avenue; the name in gold, the restaurant's awnings lit
    RJ.flood(g, 0, 1.0, '#F6D29A', (c, d) => (d.k === K_FILL && c === '#F2C230' ? '#FFD45E' : d.k !== K_FILL && c === '#B08A3E' ? '#F6CB6A' : undefined));
    for (let y = -11; y <= 11; y += 5.5) g.glow2('lantern', g.p(36.6, y, 3.6), g.p(39, y, 0), { r: 2.0, col: '#FFD9A0' });
    for (const y of [-9.8, -7.4, -5.0]) g.glow('lamp', 37.0, y + 0.9, 2.6, { r: 1.0 });
    g.glow2('lantern', g.p(36.9, 0, 15.2), g.p(39, 0, 0), { r: 2.6, col: '#FFE0A8' });
    for (const x of [26, 30, 34]) g.glow2('lantern', g.p(x, 13.6, 3.2), g.p(x, 16, 0), { r: 1.6, col: '#FFD9A0' });
  }, { name: 'copacabana palace' });
  const BLK = [[24, -36.5, 36, -15.5, 16.5, '#F0D9A8', 7101], [24, 15.5, 36, 36.5, 15.2, '#CFE3D8', 7102]];
  for (const [x0, y0, x1, y1, h, c, sd] of BLK) T.obj([x0, y0, x1, y1], (g) => { g.boilP = 0.25; RJ.block(g, x0, y0, x1, y1, h, c, sd, { pool: sd === 7102, shops: { face: 'L', words: sd === 7102 ? ['SUCOS', 'FARMÁCIA'] : ['PADARIA', 'BAR'], cols: ['#3A9A5B', '#D9463B', '#2F6DB5', '#F2C230'] } }); }, { name: 'prédio' });
  // neighbours on the beachfront balconies, someone waving a flag
  const BAL = [[36.8, -30, 6.6, 7111], [36.8, -21, 11.8, 7112], [36.8, 20, 9.2, 7113], [36.8, 30, 4.0, 7114], [36.8, 26, 11.8, 7115]];
  BAL.forEach(([x, y, z, s], i) => T.actor({ sample: 5, period: 4, at(t) { const ph = Math.floor(((t * 1.1 + i * 0.3) % 1) * 4); return { x, y, z, key: i === 2 ? ph : 0, ph: ph / 4 }; },
    draw(g, st) { RJ.person(g, 0, 0, 0, Object.assign(RJ.who(s), { dir: i % 2 ? 0 : 1, pose: i === 2 ? 'wave' : 'hold', cup: i === 1 ? '#F2C230' : undefined, ph: st.ph, k: 0.92 })); } }));

  /* ---------------- the inner blocks and the praça ---------------- */
  const INN = [[-4, -36, 17, -20, 9.4, '#E9B9A0', 7121], [-4, -17, 17, 4, 8.2, '#F3EFE4', 7122], [-4, 7, 17, 36, 10.4, '#D9E3EE', 7123], [-36, 2, -24, 36, 7.4, '#F2D24B', 7124]];
  for (const [x0, y0, x1, y1, h, c, sd] of INN) T.obj([x0, y0, x1, y1], (g) => {
    g.boilP = 0.25; RJ.block(g, x0, y0, x1, y1, h, c, sd, { balc: sd !== 7124, gf: 3.6, shops: sd === 7124 ? { face: 'R', words: ['BAR', 'SUCOS', 'PADARIA', 'ÓTICA'], cols: ['#D9463B', '#3A9A5B', '#F2C230', '#2F6DB5'] } : null, pool: sd === 7121 });
    if (sd === 7122) { for (let i = 0; i < 3; i++) K.cyl(g, 2 + i * 4, -8, 0.9, h, h + 1.2, { t: '#5E9AD6', l: '#3E7FC1', r: '#2F6AA6' }, { w: 0.45, n: 10 }); const a = g.p(0, -2, h + 1.6), b = g.p(14, -2, h + 1.6); g.fine2([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 1], b], { w: 0.2, c: '#5A564E' }); for (let k = 1; k < 6; k++) { const t = k / 6, c2 = [lerp(a[0], b[0], t), lerp(a[1], b[1], t) + 0.8]; g.fill2([[c2[0] - 1, c2[1]], [c2[0] + 1, c2[1]], [c2[0] + 0.9, c2[1] + 2.4], [c2[0] - 0.9, c2[1] + 2.4]], ['#F3F1EA', '#E86A9A', '#2F6DB5', '#F2C230', '#3A9A5B'][k % 5], true); } }
  }, { name: 'prédio' });
  // a rooftop party on the near inner block: a grill's smoke, friends dancing, a speaker
  T.cast([10, 28], (g) => { const z = 10.4; K.box(g, 3, 30, 5, 31.5, z, z + 1.0, '#3A3530', { w: 0.4 }); for (let k = 0; k < 6; k++) RJ.bulb(g, 3 + k * 2.6, 35.8, z + 0.3, { r: 0.7, col: ['#FFD27A', '#FF8AB8', '#8AD8FF'][k % 3], base: z }); /* (night: party lights along the parapet) */ for (const [x, y, s, d] of [[6, 27, 7131, 0], [9, 29, 7132, 1], [12, 26, 7133, 0], [8, 32, 7134, 1]]) RJ.person(g, x, y, z, Object.assign(RJ.who(s), { dir: d, pose: s % 2 ? 'cheer' : 'hold', cup: s % 2 ? undefined : '#F2C230', ph: 0.25 })); }, { on: true });
  T.cast([0, -28], (g) => { const z = 9.4; for (const [x, y, s] of [[13, -24, 7136], [12, -21, 7137]]) RJ.person(g, x, y, z + 0.1, Object.assign(RJ.who(s, { beach: true }), { lie: -2.5, pose: 'stand', dir: 0 })); }, { on: true });
  // the praça: mango trees, a newsstand, two domino tables, pigeons
  for (const [x, y] of [[-31, -31], [-14, -30], [-28, -14], [-12, -12]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 5.0, h: 5.2, col: '#4F8A45' }), { name: 'mangueira' });
  T.obj([-24, -27, -20, -23], function (g) {
    K.box(g, -24, -27, -20, -23, 0, 4.0, { t: '#2F7A4F', l: '#3A9A5B', r: '#2F7A4F' }, { w: 0.7 });
    for (const [f, p, a0, a1] of [['L', -23, -23.7, -20.3], ['R', -20, -26.7, -23.3]]) for (let i = 0; i < 4; i++) g.fill(K.on(f, p + 0.04, a0 + i * 0.85, a0 + i * 0.85 + 0.7, 1.4, 2.8), ['#E86A9A', '#F2C230', '#5FC0B0', '#D9463B'][i]);
    K.box(g, -24.4, -27.4, -19.6, -22.6, 4.0, 4.5, '#2F7A4F', { w: 0.5 });
    K.text(g, 'L', -22.58, -22, 4.05, 0.4, 'BANCA', '#F6F3EA', { center: true, w: 0.34 });
  }, { name: 'banca' });
  for (const [x, y, sd] of [[-20, -16, 7140], [-15, -21, 7144]]) T.cast([x, y], (g) => {
    const f = g.p(x, y, 0); g.fill2(arcPts(f[0], f[1] - 3.6, 3.3, 0, TAU, 12).map((q) => [q[0], f[1] - 3.6 + (q[1] - f[1] + 3.6) * 0.5]), '#E9E2CC', true); g.segs2([f[0], f[1], f[0], f[1] - 3.6], '#6E6A60', 0.5);
    const tiles = []; for (let i = 0; i < 6; i++) { const p = [f[0] - 2 + i * 0.8, f[1] - 3.8 + (i % 2) * 0.4]; tiles.push(p); } for (const p of tiles) g.fill2([[p[0] - 0.3, p[1] - 0.15], [p[0] + 0.3, p[1] - 0.15], [p[0] + 0.3, p[1] + 0.15], [p[0] - 0.3, p[1] + 0.15]], '#F6F3EA', true);
    for (const [dx, dy, d, k] of [[-2.2, -1.2, 0, 0], [2.2, 1.2, 1, 1], [-1.6, 2.0, 0, 2], [1.8, -2.0, 3, 3]]) RJ.person(g, x + dx * 0.6, y + dy * 0.6, 1.3, Object.assign(RJ.who(sd + k, { carnaval: false }), { dir: d, pose: 'sit', hair: '#C9C6BD', hairStyle: k % 2 ? 'bald' : 'short' }));
  }, {});
  RJ.walker(T, RJ.who(7150), [[-34, -4], [-9, -4], [-9, -34], [-34, -34]], 1.0, { phase: 0.2 });
  RJ.walker(T, RJ.who(7151, { set: { dress: '#E86A9A', fem: true } }), [[-9, -36], [-9, -2], [-30, -2]], 1.2, { phase: 0.6 });
  T.cast([-17, -9], (g) => { for (let i = 0; i < 5; i++) { const p = g.p(-18 + i * 1.3, -9 + (i % 2), 0); g.fill2(arcPts(p[0], p[1] - 0.8, 0.9, 0, TAU, 6).map((q) => [q[0], p[1] - 0.8 + (q[1] - p[1] + 0.8) * 0.6]), '#8C8A88', true); g.disc2([p[0] + 0.8, p[1] - 1.4], 0.45, '#7A7876'); } }, {});

  /* ---------------- the building-side pavement of the avenue: trees, a banca, a juice bar, mopeds ---------------- */
  for (const y of [-31, -2.5, 12.5, 33]) RJ.shadeTree(T, 40.2, y, 7300 + Math.round(y), { r: 3.8 });
  RJ.banca(T, 40.2, -21, 7310);
  RJ.suco(T, 40, -11.6, 7315, 'SUCOS');
  RJ.parked(T, 39.6, 16, 6, 'y', 7320);
  // the praça: kids playing, a popcorn cart, a dog
  T.obj([-30, -20], (g) => { K.stall(g, -30, -20, { L: 1.8, D: 1.2, a: '#F2C230', b: '#F6F3EA' }); RJ.bulb(g, -30, -20, 5.9, { r: 1.2 }); }, { name: 'pipoca' });
  for (let k = 0; k < 3; k++) RJ.walker(T, RJ.who(7330 + k, { set: { k: 0.72 } }), [[-34 + k, -11], [-16, -10 - k], [-24, -8]], 2.0, { phase: k * 0.31 });
  RJ.dog(T, [[-33, -34], [-10, -33], [-20, -26]], 1.5, '#E6D2B0', 0.5);
  // a feira livre in the side street: fruit and vegetable stalls under striped awnings, shoppers with trolleys
  const FG = [['#E04A3A', '#F2C230', '#9CCB4A'], ['#EE8A2E', '#F2C230', '#7A3A6A'], ['#9CCB4A', '#5E8F4E', '#E04A3A'], ['#F6F3EA', '#E9C9A0', '#F2C230']];
  [[-16, 6, '#3A9A5B'], [-16, 14.5, '#D9463B'], [-16, 23, '#2F6DB5'], [-16, 31.5, '#F2C230']].forEach(([x, y, a], i) => {
    T.obj([x, y], (g) => { K.stall(g, x, y, { L: 3.2, D: 1.6, a, b: '#F6F3EA', goods: (g2, D, L) => { const R = RNG(7400 + i); for (let k = 0; k < 10; k++) { const p = g2.p(-D + 0.5 + (k % 2) * 1.2, -L + 0.5 + Math.floor(k / 2) * 1.3, 2.9); g2.disc2(p, 0.75, R.pick(FG[i])); } } }); for (const v of [-1.6, 1.6]) RJ.bulb(g, x, y + v, 5.9, { r: 1.1 }); }, { name: 'feira' });
    T.cast([x + 2.6, y - 2.6], (g) => RJ.person(g, x + 2.6, y - 2.6, 0, Object.assign(RJ.who(7410 + i, { carnaval: false }), { dir: 0, pose: 'hold', cap: '#F6F3EA' })), {});
  });
  for (let k = 0; k < 5; k++) RJ.walker(T, RJ.who(7420 + k, { set: k % 2 ? { sunhat: true } : {} }), [[-10.5 - (k % 2), 2], [-10.5 - (k % 2), 35]], 0.6 + h1(k) * 0.3, { phase: h1(k * 3 + 1), extra: k % 2 ? (g, st, r) => { const h = r.hands[0]; g.fill2([[h[0] - 1.4, h[1]], [h[0] + 1.4, h[1]], [h[0] + 1.2, h[1] + 3], [h[0] - 1.2, h[1] + 3]], '#2F6DB5', true); } : undefined });
  /* ---------------- the calçadão and the beach (beyond the avenue) ---------------- */
  for (const y of [-34, -22, -9, 15, 30]) T.obj([66.4, y], (g) => RJ.coco(g, 66.4, y, { h: 13 + h1(y + 9) * 3, lean: (h1(y) - 0.5) * 0.8 }), { name: 'coqueiro' });
  for (const [y, word, col] of [[-28, 'COCO GELADO', '#2A8C7A'], [24, 'CHOPP', '#D9463B']]) {
    T.obj([60, y - 3.2, 64.4, y + 3.2], (g) => RJ.kiosk(g, 62.2, y, word, col), { name: 'quiosque' });
    T.cast([64.8, y + 4], (g) => { for (const [dx, dy, s] of [[0.5, 0.8, 7160], [2.8, -1.4, 7162]]) { const f = g.p(64.8 + dx, y + 4 + dy, 0); RJ.table2(g, f, '#F3F1EA', col); RJ.person(g, 64.8 + dx - 1.1, y + 4 + dy + 0.6, 1.3, Object.assign(RJ.who(s), { dir: 0, pose: 'sit', cup: '#F2C230' })); RJ.person(g, 64.8 + dx + 1.1, y + 4 + dy - 0.6, 1.3, Object.assign(RJ.who(s + 1, { beach: true }), { dir: 1, pose: 'sit' })); } }, {});
  }
  T.obj([68, -2, 72, 2], (g) => RJ.posto(g, 70, 0, 4), { name: 'posto 4' });
  T.cast([71.5, 2.8], (g) => RJ.person(g, 71.5, 2.8, 0, Object.assign(RJ.who(7170, { beach: true }), { dir: 0, pose: 'stand', bot: '#D9463B', top: RJ.who(7170).skin, cap: '#D9463B' })), {});
  // umbrellas, chairs and the people under them
  const UMB = [[73, -29, '#E86A9A', '#F6F3EA'], [82, -27, '#2F6DB5', '#F2C230'], [72, 9, '#3A9A5B', '#F2C230'], [83, 7, '#D9463B', '#F6F3EA'], [74, 30, '#5FC0B0', '#F6F3EA'], [83, 30, '#F2C230', '#3A9A5B']];
  UMB.forEach(([x, y, a, b], i) => {
    T.obj([x, y], (g) => RJ.umbrella2(g, g.p(x, y, 0), a, b, { h: 5.6, r: 3.1 }), { name: 'barraca' });
    T.cast([x + 1.4, y + 1.6], (g) => { RJ.chair2(g, g.p(x + 1.4, y + 1.6, 0), a, 'R'); RJ.person(g, x + 1.4, y + 1.6, 1.2, Object.assign(RJ.who(7180 + i, { beach: true }), { dir: 0, pose: 'sit' })); }, {});
    if (i % 2 === 0) T.cast([x - 1.4, y + 3.2], (g) => RJ.person(g, x - 1.4, y + 3.2, 0.15, Object.assign(RJ.who(7190 + i, { beach: true }), { lie: -2.5, pose: 'stand', dir: 0 })), {});
  });
  for (const [x, y, s] of [[71, -30, 7201], [83, -31, 7202], [70, 6, 7203], [72, 32, 7204], [82, 26, 7205], [79, -22, 7206]]) T.cast([x, y], (g) => RJ.person(g, x, y, 0.15, Object.assign(RJ.who(s, { beach: true }), { lie: -2.5, pose: 'stand', dir: 0 })), {});
  // the sand sculpture: a sand Christ in a moat, a little flag, its sculptor
  T.cast([70, 20], (g) => {
    const f = g.p(70, 20, 0); g.fill2(arcPts(f[0], f[1], 6, 0, TAU, 14).map((q) => [q[0], f[1] + (q[1] - f[1]) * 0.45]), '#D9BE86', true);
    g.fill2([[f[0] - 1.6, f[1]], [f[0] + 1.6, f[1]], [f[0] + 1.2, f[1] - 9], [f[0] - 1.2, f[1] - 9]], '#E6CB92', true); g.fill2([[f[0] - 6, f[1] - 9.6], [f[0] + 6, f[1] - 9.6], [f[0] + 6, f[1] - 8.2], [f[0] - 6, f[1] - 8.2]], '#E6CB92', true); g.disc2([f[0], f[1] - 11], 1.4, '#E6CB92');
    g.line2([[f[0] - 1.6, f[1]], [f[0] - 1.2, f[1] - 8.2], [f[0] - 6, f[1] - 8.2], [f[0] - 6, f[1] - 9.6], [f[0] + 6, f[1] - 9.6], [f[0] + 6, f[1] - 8.2], [f[0] + 1.2, f[1] - 8.2], [f[0] + 1.6, f[1]]], { w: 0.45, c: '#9A7A4A', boil: false });
    RJ.person(g, 72.6, 21.2, 0, Object.assign(RJ.who(7210, { beach: true }), { dir: 1, pose: 'kneel', hands: [[-4, -6], [-3, -5]] }));
  }, {});

  // more life on the calçadão: a samba busker, a coconut cart, roller skaters, a couple with a dog
  RJ.busker(T, 59.4, 4, 7340);
  T.cast([60, -14], (g) => { const c = g.p(60, -14, 0); g.fill2([[c[0] - 5, c[1] - 3], [c[0] + 5, c[1] - 1], [c[0] + 5, c[1] - 5], [c[0] - 5, c[1] - 7]], '#3A9A5B', true); for (let k = 0; k < 9; k++) g.disc2([c[0] - 4 + k, c[1] - 7 - (k % 3) * 1.2 + k * 0.2], 1.2, k % 2 ? '#7FB04A' : '#6E9C3E'); g.disc2([c[0] - 3.5, c[1] - 0.5], 1.3, '#3A3530'); g.disc2([c[0] + 3.5, c[1] + 1.4], 1.3, '#3A3530'); RJ.person(g, 61.6, -16.2, 0, Object.assign(RJ.who(7345, { carnaval: false }), { dir: 1, pose: 'hold', cap: '#F6F3EA' })); RJ.person(g, 58.6, -11.6, 0, Object.assign(RJ.who(7346, { beach: true }), { dir: 3, pose: 'hold', cup: '#7FB04A' })); }, {});
  RJ.walker(T, RJ.who(7347, { set: { shorts: true } }), [[62.6, -36], [62.6, 36]], 3.0, { phase: 0.2 });
  RJ.walker(T, RJ.who(7348, { set: { dress: '#5FC0B0', fem: true } }), [[61, 36], [61, -36]], 1.0, { phase: 0.6 });
  RJ.dog(T, [[60.2, 36], [60.2, -36]], 1.0, '#2A2622', 0.6);
  /* ---- footvolley: two a side, the ball over the net, now and then a bicycle kick ---- */
  T.obj([76.8, -17, 77.2, -5], (g) => { const a = g.p(77, -17, 0), b = g.p(77, -5, 0), a2 = g.p(77, -17, 4.8), b2 = g.p(77, -5, 4.8); g.segs2([a[0], a[1], a2[0], a2[1], b[0], b[1], b2[0], b2[1]], '#5A564E', 0.5); const n = []; for (let i = 0; i <= 10; i++) { const p = g.p(77, -17 + 1.2 * i, 4.8), q = g.p(77, -17 + 1.2 * i, 3.6); n.push(p[0], p[1], q[0], q[1]); } g.segs2(n, '#8C8576', 0.25); g.line2([a2, b2], { w: 0.5, c: '#F6F3EA', boil: false }); g.line2([g.p(77, -17, 3.6), g.p(77, -5, 3.6)], { w: 0.3, c: '#5A564E', boil: false }); }, { name: 'rede' });
  const FV = 3.2, players = [[73.6, -14, 0], [74.4, -8, 0], [80.4, -13.6, 1], [79.6, -7.6, 1]];
  players.forEach(([x, y, side], i) => { const look = RJ.who(7220 + i, { beach: true, set: { bot: side ? '#F2C230' : '#2F6DB5' } });
    T.actor({ sample: 5, period: FV * 2,
      at(t) { const u = ((t / FV) % 2 + 2) % 2, mine = side === 0 ? u < 1 : u >= 1, f = u % 1, hit = mine && f < 0.22 && (i % 2 === Math.floor(t / (FV * 2)) % 2), kick = hit && i === 1 && Math.floor(t / (FV * 2)) % 3 === 0; const z = hit ? Math.sin(Math.PI * f / 0.22) * (kick ? 2.6 : 1.2) : 0; return { x, y, z, key: (kick ? 'k' : hit ? 'h' : 's') + Math.round(z * 4), hit, kick }; },
      draw(g, st) { if (st.kick) RJ.person(g, 0, 0, 0, Object.assign({}, look, { lie: -0.9, pose: 'stand', dir: 0 })); else RJ.person(g, 0, 0, 0, Object.assign({}, look, { dir: side ? 2 : 0, pose: st.hit ? 'cheer' : 'crouch', ph: 0.25 })); } }); });
  T.actor({ sample: 0.2, period: FV * 2, layer: 'top', grow: false,
    at(t) { const u = ((t / FV) % 2 + 2) % 2, f = u % 1, k = Math.floor(t / (FV * 2)) % 2, from = u < 1 ? (k ? [74.4, -8] : [73.6, -14]) : (k ? [79.6, -7.6] : [80.4, -13.6]), to = u < 1 ? (k ? [79.6, -7.6] : [80.4, -13.6]) : (k ? [74.4, -8] : [73.6, -14]); return { x: lerp(from[0], to[0], f), y: lerp(from[1], to[1], f), z: 6 + Math.sin(Math.PI * f) * 6, key: 'b' }; },
    draw(g) { const c = g.p(0, 0, 0); g.disc2(c, 1.1, '#F6F3EA'); g.segs2([c[0] - 1, c[1], c[0] + 1, c[1]], '#F2C230', 0.45); g.ring2(c, 1.1, { w: 0.3, c: '#6E6A60' }); } });
  // altinha: five friends in a ring keeping the ball up
  const AC = [79, 17], AR = 3.4;
  for (let i = 0; i < 5; i++) { const a = TAU * i / 5 + 0.3, x = AC[0] + Math.cos(a) * AR, y = AC[1] + Math.sin(a) * AR, look = RJ.who(7230 + i, { beach: true });
    T.actor({ sample: 5, period: 5, at(t) { const q = Math.floor((t * 1.6) % 5), mine = q === i; return { x, y, key: mine ? 'k' : 's', mine }; },
      draw(g, st) { const dx = AC[0] - x, dy = AC[1] - y, d = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3); RJ.person(g, 0, 0, 0, Object.assign({}, look, { dir: d, pose: st.mine ? 'crouch' : 'stand', sway: st.mine ? 0.6 : 0 })); } }); }
  T.actor({ sample: 0.2, period: 5, layer: 'top', grow: false,
    at(t) { const u = t * 1.6, q = Math.floor(u % 5), f = u % 1, a0 = TAU * q / 5 + 0.3, a1 = TAU * ((q + 2) % 5) / 5 + 0.3; return { x: AC[0] + lerp(Math.cos(a0), Math.cos(a1), f) * AR * 0.8, y: AC[1] + lerp(Math.sin(a0), Math.sin(a1), f) * AR * 0.8, z: 2 + Math.sin(Math.PI * f) * 7, key: 'b' }; },
    draw(g) { const c = g.p(0, 0, 0); g.disc2(c, 1.0, '#F6F3EA'); g.ring2(c, 1.0, { w: 0.3, c: '#6E6A60' }); g.disc2([c[0] + 0.3, c[1] - 0.2], 0.4, '#2F6DB5'); } });

  /* ---- the sellers walking the sand ---- */
  RJ.walker(T, RJ.who(7240, { carnaval: false, set: { top: '#EE8A2E', bot: '#EE8A2E', bare: true, shorts: true, cap: '#EE8A2E' } }), [[70, -34], [86, -20], [70, 0], [86, 22], [70, 34], [86, 22], [70, 0], [86, -20]], 0.8,
    { phase: 0.1, extra: (g, st, r) => { const s = r.shoulders[0], d = st.dir === 0 || st.dir === 3 ? 1 : -1; g.line2([[s[0] - 6 * d, s[1] + 0.5], [s[0] + 6 * d, s[1] - 0.5]], { w: 0.5, c: '#6E5A44', boil: false, ext: 0 }); for (const e of [-6, 6]) { const c = [s[0] + e * d, s[1] + 5]; g.fill2([[c[0] - 1.6, c[1] - 4], [c[0] + 1.6, c[1] - 4], [c[0] + 1.6, c[1] + 2.6], [c[0] - 1.6, c[1] + 2.6]], '#C9CDD0', true); g.fill2([[c[0] + 0.3, c[1] - 4], [c[0] + 1.6, c[1] - 4], [c[0] + 1.6, c[1] + 2.6], [c[0] + 0.3, c[1] + 2.6]], '#A9AEB2', true); g.segs2([c[0], c[1] - 4, s[0] + e * d, s[1] - 0.3 * Math.sign(e)], '#5A564E', 0.3); } } });
  RJ.walker(T, RJ.who(7241, { carnaval: false, set: { top: '#F3F1EA', cap: '#F3F1EA' } }), [[86, 34], [72, 14], [86, -6], [72, -34], [86, -6], [72, 14]], 0.75,
    { phase: 0.5, extra: (g, st, r) => { const h = r.hands[1]; g.segs2([h[0], h[1], h[0], h[1] - 12], '#8A6A4A', 0.4); for (let k = 0; k < 5; k++) { const c = [h[0] + (k % 2 ? 1.6 : -1.6), h[1] - 12 + k * 2.2]; g.fill2([[c[0] - 1.3, c[1]], [c[0] + 1.3, c[1]], [c[0] + 1.3, c[1] + 1.8], [c[0] - 1.3, c[1] + 1.8]], k % 2 ? '#3A9A5B' : '#F2C230', true); } } });
  RJ.walker(T, RJ.who(7242, { carnaval: false }), [[69, -36], [69, 36]], 0.7,
    { phase: 0.3, extra: (g, st, r) => { const h = r.hands[0]; g.segs2([h[0], h[1], h[0], h[1] - 16], '#8A6A4A', 0.4); for (let k = 0; k < 3; k++) g.fill2([[h[0] - 3.5, h[1] - 15 + k * 4.5], [h[0] + 3.5, h[1] - 15 + k * 4.5], [h[0] + 3.2, h[1] - 11 + k * 4.5], [h[0] - 3.2, h[1] - 11 + k * 4.5]], ['#E86A9A', '#5FC0B0', '#F2C230'][k], true); } });
  // in the surf: swimmers' heads and surfers on their boards
  for (let i = 0; i < 5; i++) T.actor({ sample: 0.5, period: 20, grow: false,
    at(t) { const x = 89 + (i % 3) * 3 + Math.sin(t * 0.3 + i) * 1.5, y = -30 + i * 14 + Math.sin(t * 0.2 + i * 2) * 3, f = Math.floor(t * 2 + i) % 2; return { x, y, z: RS.WZ, key: f, f }; },
    draw(g, st) { const c = g.p(0, 0, 0); g.fill2(arcPts(c[0], c[1], 2.4, 0, TAU, 10).map((q) => [q[0], c[1] + (q[1] - c[1]) * 0.4]), '#BEE0E2', true); g.disc2([c[0], c[1] - 1.4], 1.3, RJ_SKIN[(i * 3) % 8]); g.fill2(arcPts(c[0], c[1] - 1.8, 1.35, Math.PI, TAU, 6), '#2B2420', true); if (st.f) g.segs2([c[0] + 1, c[1] - 1.5, c[0] + 3, c[1] - 3.2], RJ_SKIN[(i * 3) % 8], 0.7); } });
  for (let i = 0; i < 2; i++) T.actor({ sample: 0.3, period: 9, grow: false,
    at(t) { const u = ((t / 9 + i * 0.5) % 1), x = lerp(104, 90, u), y = -10 + i * 22 + u * 6, a = Math.min(1, u * 6, (1 - u) * 6); return { x, y, z: RS.WZ, key: 's', alpha: a < 1 ? a : null }; },
    draw(g) { K.rbox(g, 0, 0, 1.6, 0.42, Math.PI * 0.9, 0, 0.2, { t: '#F6F3EA', l: '#EE8A2E', r: '#D9752A' }, { w: 0.4 }); g.fill(K.rect(-2.2, -1.4, 1.5, 1.4).map((p) => [p[0], p[1], 0]), 'rgba(246,248,243,0.6)'); RJ.person(g, 0, 0, 0.2, Object.assign(RJ.who(7250 + i, { beach: true }), { dir: 1, pose: 'crouch', sway: -0.5 })); } });
});
