'use strict';
/* (100,-100) Yonghegong, the Lama Temple, and its ginkgo avenue.
   What it is: a red-walled temple precinct on its own north-south axis. At the front, outside the wall, a painted
   archway (pailou) over the entrance avenue, which is lined with ginkgo trees in their October gold (the leaves
   carpet the paving). The Hall of the Heavenly Kings is the gate; inside, a courtyard with a great bronze incense
   burner smoking, two old ginkgos, side halls, the main Hall of Harmony and Peace on its terrace, and behind it the
   tall three-storey Wanfu Pavilion. All yellow roofs (it was an imperial palace before it was a temple).
   Who: worshippers with bundles of incense raised to their foreheads, others kneeling on cushions before the main
   hall, monks in maroon and saffron crossing the courtyard, visitors photographing the ginkgos, a man raking leaves.
   What moves: smoke from the burner and the incense sticks, monks and visitors walking, leaves. */
SF.tile('yonghegong', 100, -100, { rim: 26 }, function (T) {
  const H = 37, PAVE = '#E4DFD3';
  T.ground(function (g) {
    K.slab(g, H, { top: PAVE, cut: 'x' });
    g.fill(K.rect(-4, 18, 4, H), '#DCD5C6');
    g.fill(K.rect(-28, -14, 28, 12), '#DCD5C6');
    g.scuff(K.rect(-28, -14, 28, 12), { dir: -0.5, len: 3, c: '#E8E3D7', dens: 0.5, w: 0.45 });
    // the ginkgo leaves carpeting the avenue
    BJ.leaves(g, -5, 26, 6, 11); BJ.leaves(g, 5, 30, 6, 12); BJ.leaves(g, 0, 34, 5, 13); BJ.leaves(g, -3, 22, 4, 14);
  }, { rim: true });
  BJ.sidewalk(T, ['s', 'w'], { sp: 12, skip: { s: [[-7, 7]] }, bikes: [['w', 26, 5]] });

  /* ---------------- the precinct walls ---------------- */
  T.obj([-31, -36, 31, -34.8], (g) => BJ.wall(g, -31, -36, 31, -34.8, 6), { name: 'wall' });
  T.obj([-31, -34.8, -29.8, 17.2], (g) => BJ.wall(g, -31, -34.8, -29.8, 17.2, 6), { name: 'wall' });
  T.obj([29.8, -34.8, 31, 17.2], (g) => BJ.wall(g, 29.8, -34.8, 31, 17.2, 6), { name: 'wall' });
  T.obj([-31, 16, -9, 17.2], (g) => BJ.wall(g, -31, 16, -9, 17.2, 6), { name: 'wall' });
  T.obj([9, 16, 31, 17.2], (g) => BJ.wall(g, 9, 16, 31, 17.2, 6), { name: 'wall' });

  /* ---------------- the gate hall ---------------- */
  T.obj([-9, 12, 9, 19.6], function (g) {
    BJ.terrace(g, -9, 12, 9, 19.6, 0, 0.8, { rail: false, sw: 5 });
    BJ.hallBody(g, -7.4, 13, 7.4, 18.6, 0.8, 7.4, { bx: 5, by: 2 });
    BJ.roof(g, -7.4, 13, 7.4, 18.6, 7.4, 4.6, { type: 'xie', col: BC.yellow, over: 1.6, lift: 0.7 });
  }, { name: 'gate hall' });
  // the archway on the avenue
  T.obj([-8, 29.4, 8, 30.6], (g) => BJ.pailou(g, 'L', 30, -8, 8, { bays: 3, h: 9.4 }), { name: 'archway' });
  // ginkgos along the avenue
  for (const [x, y] of [[-6.4, 22.6], [6.4, 23.4], [-6.4, 34.6], [6.4, 35]]) T.obj([x, y], (g) => BJ.ginkgo(g, x, y, { r: 3.6, h: 5.4, seed: Math.round(x * 3 + y) }), { name: 'ginkgo' });

  /* ---------------- the courtyard ---------------- */
  T.obj([-28, -13, -20, 10], (g) => { BJ.hallBody(g, -28, -13, -21, 10, 0, 6.2, { bx: 2, by: 6 }); BJ.roof(g, -28, -13, -21, 10, 6.2, 3.4, { type: 'xie', col: BC.yellow, over: 1.2, lift: 0.5 }); }, { name: 'side hall' });
  T.obj([21, -13, 28, 10], (g) => { BJ.hallBody(g, 21, -13, 28, 10, 0, 6.2, { bx: 2, by: 6 }); BJ.roof(g, 21, -13, 28, 10, 6.2, 3.4, { type: 'xie', col: BC.yellow, over: 1.2, lift: 0.5 }); }, { name: 'side hall' });
  T.obj([-16, 4], (g) => BJ.ginkgo(g, -16, 4, { r: 4.6, h: 6.8, seed: 21 }), { name: 'ginkgo' });
  T.obj([16, -2], (g) => BJ.ginkgo(g, 16, -2, { r: 4.4, h: 6.6, seed: 22 }), { name: 'ginkgo' });
  // the bronze incense burner: a tripod with a little roof, smoking
  T.obj([-2, 2, 2, 6], function (g) {
    K.box(g, -1.8, 2.2, 1.8, 5.8, 0, 0.8, K.STONE, { w: 0.5 });
    const c = g.p(0, 4, 0.8), B = '#6E5A3E', D = '#4E3E2A';
    for (const dx of [-2.2, 0, 2.2]) g.fill2([[c[0] + dx - 0.5, c[1] + (dx ? 0 : 1.2)], [c[0] + dx + 0.5, c[1] + (dx ? 0 : 1.2)], [c[0] + dx * 0.7 + 0.5, c[1] - 3.4], [c[0] + dx * 0.7 - 0.5, c[1] - 3.4]], D, true);
    g.fill2(arcPts(c[0], c[1] - 5.6, 4.2, 0, Math.PI, 10).concat([[c[0] - 4.2, c[1] - 5.6]]).map((q) => [q[0], c[1] - 5.6 + (q[1] - c[1] + 5.6) * 0.9]), B, true);
    g.fill2([[c[0] - 4.6, c[1] - 6.0], [c[0] + 4.6, c[1] - 6.0], [c[0] + 4.2, c[1] - 7.0], [c[0] - 4.2, c[1] - 7.0]], D, true);
    const t = [c[0], c[1] - 9]; g.fill2([[t[0] - 1.8, t[1] + 1.8], [t[0] + 1.8, t[1] + 1.8], [t[0] + 1.4, t[1] - 1.4], [t[0] - 1.4, t[1] - 1.4]], B, true);
    g.fill2([[t[0] - 3.6, t[1] - 1.2], [t[0] + 3.6, t[1] - 1.2], [t[0] + 0.6, t[1] - 4.2], [t[0] - 0.6, t[1] - 4.2]], '#C9A23A', true);
    g.disc2([t[0], t[1] - 4.8], 0.8, '#C9A23A');
  }, { name: 'burner' });
  T.actor({ layer: 'top', sample: 5, period: 4, grow: false,
    at(t) { const u = (t % 4) / 4; return { x: 0, y: 4, z: 9 + u * 9, key: 's' + Math.floor(u * 16), u }; },
    draw(g, st) { const o = g.p(0, 0, 0); for (let k = 0; k < 3; k++) { const v = (st.u + k / 3) % 1, c = [o[0] + Math.sin(v * 5 + k) * 2.4, o[1] + (0.5 - v) * 30]; const r = 2.2 + v * 3.6; g.fill2(arcPts(c[0], c[1], r, 0, TAU, 12), `rgba(140,146,156,${(0.7 * (1 - v)).toFixed(2)})`, true); g.fill2(arcPts(c[0] - r * 0.25, c[1] - r * 0.25, r * 0.6, 0, TAU, 10), `rgba(214,218,224,${(0.75 * (1 - v)).toFixed(2)})`, true); } } });
  // worshippers with incense round the burner
  [[-4.6, 7, 3], [4.2, 7.6, 3], [-1.2, 9.2, 3], [5.6, 2.6, 2]].forEach(([x, y, d], i) => T.cast([x, y], (g) => { const r = BJ.person(g, x, y, 0, BJ.who(1100 + i, { dir: d, pose: 'hold', reach: [0, -12] })); const hd = r.hands[0]; g.segs2([hd[0] - 0.4, hd[1], hd[0] - 0.8, hd[1] - 4.2, hd[0], hd[1], hd[0], hd[1] - 4.4, hd[0] + 0.4, hd[1], hd[0] + 0.8, hd[1] - 4.2], '#C9584B', 0.3); for (const dx of [-0.8, 0, 0.8]) g.disc2([hd[0] + dx, hd[1] - 4.4], 0.3, '#F2A33A'); }, { on: false }));

  /* ---------------- the Hall of Harmony and Peace ---------------- */
  T.obj([-15, -22, 15, -8], function (g) {
    g.boilP = 0.3;
    BJ.terrace(g, -15, -22, 15, -8, 0, 1.4, { sw: 6 });
    BJ.hallBody(g, -12, -20, 12, -10.4, 1.4, 9.4, { bx: 7, by: 3 });
    BJ.roof(g, -12, -20, 12, -10.4, 9.4, 5.6, { type: 'xie', col: BC.yellow, over: 2.0, lift: 0.8 });
  }, { name: 'main hall' });
  // kneeling worshippers on cushions before the hall
  [[-7, -6.4], [-4, -6], [5, -6.2]].forEach(([x, y], i) => T.cast([x, y], (g) => { const c = g.p(x, y + 0.6, 0); g.fill2(arcPts(c[0], c[1], 1.8, 0, TAU, 10).map((q) => [q[0], c[1] + (q[1] - c[1]) * 0.5]), '#C9A23A', true); BJ.person(g, x, y, 0, BJ.who(1110 + i, { dir: 3, pose: 'kneel', hands: [[-0.4, -10], [0.4, -10]] })); }, { on: false }));

  /* ---------------- the Wanfu Pavilion ---------------- */
  T.obj([-9, -35, 9, -24], function (g) {
    g.boilP = 0.3;
    BJ.terrace(g, -9, -34, 9, -24, 0, 1.0, { rail: false, steps: 'L', sw: 4 });
    BJ.hallBody(g, -7, -32.6, 7, -25.4, 1.0, 8.4, { bx: 4, by: 2 });
    BJ.roof(g, -7, -32.6, 7, -25.4, 8.4, 3.6, { type: 'hip', col: BC.yellow, top: 0.42, over: 1.8, lift: 0.6 });
    BJ.rail(g, -6.6, -32.2, 6.6, -25.8, 9.9, { h: 0.8 });
    BJ.hallBody(g, -6.4, -32, 6.4, -26, 9.9, 15.6, { bx: 4, by: 2 });
    BJ.roof(g, -6.4, -32, 6.4, -26, 15.6, 3.4, { type: 'hip', col: BC.yellow, top: 0.42, over: 1.8, lift: 0.6 });
    BJ.hallBody(g, -5.6, -31.4, 5.6, -26.6, 17.0, 21.6, { bx: 3, by: 2 });
    BJ.roof(g, -5.6, -31.4, 5.6, -26.6, 21.6, 5.6, { type: 'xie', col: BC.yellow, over: 1.8, lift: 0.8 });
  }, { name: 'wanfu pavilion' });

  /* ---------------- shops on the avenue outside the wall ---------------- */
  [[-34, 20.4, -22, 27, '面', 1130], [-21, 20.4, -10, 27, '茶', 1131], [10, 20.4, 21, 27, '福', 1132], [22, 20.4, 34, 27, '饺子', 1133]].forEach(([x0, y0, x1, y1, w, sd]) => T.obj([x0, y0, x1, y1], (g) => BJ.shop(g, x0, y0, x1, y1, { front: 'L', word: w, seed: sd, goods: ['#E2B13A', '#C9584B', '#F3E3B8', '#8E3A2C'] }), { name: 'shop' }));
  [[-28, 29.4, 1134, 1], [-16, 29.8, 1135, 0], [16, 29.4, 1136, 1], [27, 30, 1137, 2]].forEach(([x, y, sd, d]) => T.cast([x, y], (g) => BJ.person(g, x, y, 0, BJ.who(sd, { dir: d })), { on: false }));
  // more visitors in the courtyard
  [[-10, 0, 1140, 2], [9, 8, 1141, 1], [12, -1, 1142, 3], [-6, -2, 1143, 3]].forEach(([x, y, sd, d]) => T.cast([x, y], (g) => BJ.person(g, x, y, 0, BJ.tourist(sd, '#2E8F5A', { dir: d, pose: d === 3 ? 'hold' : 'stand', phone: d === 3, reach: d === 3 ? [0.4, -9] : undefined })), { on: false }));

  /* ---------------- walkers ---------------- */
  const monk = (s) => BJ.who(s, { top: '#8E2E2A', bot: '#8E2E2A', dress: '#8E2E2A', hairStyle: 'buzz', hair: '#3A3128', jacket: '#E2A13A', glasses: false, cap: undefined });
  K.walker(T, monk(1120), [[-18, -4.6], [18, -4.6], [18, 10.6], [-18, 10.6]], 0.8, { phase: 0.1 });
  K.walker(T, monk(1121), [[-18, -4.6], [18, -4.6], [18, 10.6], [-18, 10.6]], 0.8, { phase: 0.16 });
  K.walker(T, BJ.tourist(1122, '#2E8F5A'), [[-1.4, 36], [-1.4, 21], [1.6, 21], [1.6, 36]], 1.0, { phase: 0.2 });
  K.walker(T, BJ.who(1123), [[-1.4, 36], [-1.4, 21], [1.6, 21], [1.6, 36]], 1.0, { phase: 0.7 });
  T.cast([-9, 26], (g) => { BJ.person(g, -9.4, 26, 0, BJ.who(1124, { dir: 0, pose: 'hold', phone: true, reach: [0.6, -9] })); BJ.person(g, -10.4, 28.4, 0, BJ.who(1125, { dir: 0, dress: '#F2C230', pose: 'wave', ph: 0.3 })); }, { on: false });
  T.cast([11, 33], (g) => { const r = BJ.person(g, 11, 33, 0, BJ.who(1126, { old: true, dir: 2, pose: 'stand', top: '#E8742A', hands: [[-3, -5], [-1.4, -8]] })); const hd = r.hands[0], tip = [hd[0] - 3.4, hd[1] + 4.6]; g.segs2([hd[0] + 1.2, hd[1] - 3.6, tip[0], tip[1]], '#B9A27D', 0.4); g.segs2([tip[0] - 1.6, tip[1] - 0.4, tip[0] + 1.4, tip[1] + 0.8, tip[0] - 1.0, tip[1] + 0.2, tip[0] + 0.4, tip[1] + 1.4], '#8A6A3E', 0.3); }, { on: false });
});
