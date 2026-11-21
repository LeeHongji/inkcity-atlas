'use strict';
/* (100,-100) Graça, the highest of the old quarters.
   A terrace (z 8) holds the Miradouro da Graça: big stone pines over a gravel square, a green iron kiosk with café
   tables, a long parapet along the south and east edges where everyone leans to look across the city to the castle
   and the river. Behind, the Igreja da Graça: a white church front with a bell tower, the convent's long wing.
   Below the terrace at street level, Graça's tiled houses and a vila (workers' row) with washing over its yard.
   Who: a row of people at the parapet, a couple taking a selfie, a guitarist and his listeners on the steps, people at
   the kiosk tables, a grandmother on a bench with her grandson, a dog. */
SF.tile('graca', 100, -100, { rim: 36 }, function (T) {
  const H = 37, ZT = 8, W = { t: '#ECE7DC', l: '#F6F3EB', r: '#E1DBCE' };
  T.ground(function (g) { K.slab(g, H, { top: LC.calc, cut: 'x' }); }, { rim: true });
  T.obj([-H, -H, 20, 14], function (g) {
    LX.terrace(g, -H, -H, 20, 14, 0, ZT, { top: '#E3D9C2' });
    // rooms in the wall: arched openings at the foot (old stables, now workshops)
    for (const [f, p, a0, a1] of [['L', 14, -H, 20], ['R', 20, -H, 14]]) { const n = Math.round((a1 - a0) / 6); for (let b = 0; b < n; b++) { const m = lerp(a0, a1, (b + 0.5) / n); K.win(g, f, p, m - 1.2, m + 1.2, 0, 4.6, { style: 'dark', arch: true }); } }
    LX.azulejo(g, 'L', 14, -6, 6, 5.2, 7.4, 'b', 2);
  }, { name: 'terrace' });
  for (const [x0, x1] of [[-H, -10], [-10, 19.4]]) T.obj([x0, 13.4, x1, 14], (g) => LX.parapet(g, 'L', 14, x0, x1, ZT, { h: 1.1 }), { on: true, name: 'parapet' });
  for (const [y0, y1] of [[-H, -6.2], [0.2, 13.4]]) T.obj([19.4, y0, 20, y1], (g) => LX.parapet(g, 'R', 20, y0, y1, ZT, { h: 1.1 }), { on: true, name: 'parapet' });

  /* ---------------- the church and the convent ---------------- */
  T.obj([-35, -35, -15, -20], function (g) {
    K.box(g, -35, -35, -15, -20, ZT, ZT + 12, W, { w: 0.9 });
    LX.door(g, 'L', -20, -27, -23, ZT, 4.8, '#5E4A36');
    for (const m of [-31, -19]) K.win(g, 'L', -20, m - 0.8, m + 0.8, ZT + 2, ZT + 5, { style: 'navy', arch: true });
    K.win(g, 'L', -20, -26, -24, ZT + 6.5, ZT + 9.5, { style: 'navy', arch: true });
    const gb = [K.pt('L', -19.98, -35, ZT + 12), K.pt('L', -19.98, -15, ZT + 12), K.pt('L', -19.98, -25, ZT + 16)]; g.fill(gb, '#F6F3EB'); g.outline(gb, { w: 0.8, boil: false });
    K.gable(g, -35, -35, -15, -20, ZT + 12, 4, 'y', { a: '#C96A42', b: '#B85C38', e: '#F6F3EB' }, { c: '#7E3A22', noEnd: true });
    const c = g.p(-25, -20, ZT + 16); g.segs2([c[0], c[1], c[0], c[1] - 4, c[0] - 1.2, c[1] - 3, c[0] + 1.2, c[1] - 3], '#4A4540', 0.5);
  }, { on: true, name: 'church' });
  T.obj([-14, -35, -8, -29], function (g) {        // the bell tower beside the front
    K.box(g, -14, -35, -8, -29, ZT, ZT + 20, W, { w: 0.95 });
    for (const [f, p, a] of [['L', -29, -11], ['R', -8, -32]]) { K.win(g, f, p, a - 1.2, a + 1.2, ZT + 15, ZT + 18.4, { style: 'dark', arch: true }); const bl = g.p.apply(g, LX.out(f, p, a, ZT + 16.2, 0.1)); g.disc2(bl, 1.0, '#9C7A3A'); }
    K.box(g, -14.4, -35.4, -7.6, -28.6, ZT + 20, ZT + 20.8, W, { w: 0.6 });
    K.cone(g, -11, -32, 3.0, ZT + 20.8, 4.0, '#9AA9A8', { w: 0.7 }); const t = g.p(-11, -32, ZT + 24.8); g.segs2([t[0], t[1], t[0], t[1] - 2.4, t[0] - 0.9, t[1] - 1.6, t[0] + 0.9, t[1] - 1.6], '#4A4540', 0.45);
  }, { on: true, name: 'bell tower' });
  T.obj([-6, -35, 18, -26], (g) => { LX.house(g, { x0: -6, y0: -35, x1: 18, y1: -26, z: ZT, n: 2, col: '#F1ECDF', seed: 900, bal: 0.2, faces: 'LR' }); }, { on: true, name: 'convent' });

  /* ---------------- the miradouro ---------------- */
  [[-28, -6], [-12, 4], [4, -10], [12, 6]].forEach(([x, y], i) => T.obj([x, y], (g) => LX.pine(g, x, y, { z: ZT, h: 10 + (i % 2) * 1.6, r: 5.8, lean: i % 2 ? -1.0 : 1.0, seed: 90 + i }), { on: true, name: 'pine' }));
  T.obj([-24, -17, -18, -11], function (g) {      // the kiosk: green iron, a dome, a counter with its awning
    const c = [-21, -14]; K.cyl(g, c[0], c[1], 2.2, ZT, ZT + 4.2, { t: '#4F7A5E', l: '#5E8A6A', r: '#46705A' }, { n: 8, w: 0.6 });
    K.cyl(g, c[0], c[1], 2.6, ZT + 4.2, ZT + 4.7, { t: '#3F6A4E', l: '#4F7A5E', r: '#3A604A' }, { n: 8, w: 0.5 });
    K.dome(g, c[0], c[1], 2.4, ZT + 4.7, 2.2, '#4F7A5E', { w: 0.6 });
    const w = g.p(c[0], c[1] + 2.2, ZT + 1.4), w2 = g.p(c[0] + 1.6, c[1] + 1.6, ZT + 3.6); g.fill2([[w[0] - 3, w[1]], [w[0] + 3, w[1] - 1.5], [w2[0] + 1, w2[1]], [w2[0] - 4, w2[1] + 1.5]], '#F3E3B0', true);
  }, { on: true, name: 'kiosk' });
  [[-18, -5], [-24, 2], [-6, -4]].forEach(([x, y], i) => T.cast([x, y], function (g) {
    const tt = g.p(x, y, ZT + 2.4), tb = g.p(x, y, ZT); g.segs2([tb[0], tb[1], tt[0], tt[1]], '#3A3530', 0.45); g.fill2(arcPts(tt[0], tt[1], 2.4, 0, TAU, 12).map((q) => [q[0], tt[1] + (q[1] - tt[1]) * 0.5]), '#F3F1EA', true);
    for (const [dx, d, k] of [[-1.8, 0, 0], [1.8, 1, 1]]) { K.box(g, x + dx - 0.6, y - 0.6, x + dx + 0.6, y + 0.6, ZT + 0.9, ZT + 1.3, { t: '#3F5F4F', l: '#4F6F5F', r: '#3A5848' }, { w: 0.3, boil: false }); LX.person(g, x + dx, y, ZT + 1.3, LX.who(910 + i * 2 + k, { dir: d, pose: 'sit', beer: (i + k) % 2 === 0 })); }
  }, { on: true }));
  // the row at the parapet, looking out over the city (we see their faces), the couple's selfie
  [[-33, 1], [-29.5, 2], [-25, 3], [-17.5, 4], [-9, 5], [-4.6, 6], [3, 7], [8, 8], [15.2, 9]].forEach(([x, i]) => T.cast([x, 12.6], (g) => LX.person(g, x, 12.6, ZT, LX.who(920 + i, { dir: 1, pose: i % 3 ? 'stand' : 'hold', reach: i % 3 ? undefined : [-0.4, -6.4] })), { on: true }));
  [[18.6, 8], [18.6, 3.4], [18.6, -14]].forEach(([x, y], i) => T.cast([x, y], (g) => LX.person(g, x, y, ZT, LX.who(930 + i, { dir: 0, pose: 'stand' })), { on: true }));
  T.cast([-1, 9], (g) => { LX.person(g, -1.8, 9, ZT, LX.who(935, { dir: 1, pose: 'hold', reach: [-3, -13], phone: true })); LX.person(g, -0.2, 9.4, ZT, LX.who(936, { dir: 1, dress: '#E77FB3' })); }, { on: true });
  T.cast([8, -2], (g) => { const r = LX.person(g, 8, -2, ZT, LX.who(937, { dir: 1, pose: 'stand', hands: [[1.6, -10.4], [-2.4, -12.2]] })); const h = r.hip; g.fill2(K.curve([[h[0] - 3.4, h[1] - 1.8], [h[0] + 0.6, h[1] - 5.4], [h[0] + 2.2, h[1] - 3.6], [h[0] - 1.6, h[1] + 0.2]], 3, true), '#B8743A', true); for (const [dx, dy, s] of [[-2.6, 3, 938], [2.6, 3.4, 939]]) LX.person(g, 8 + dx, -2 + dy, ZT, LX.who(s, { dir: 2, pose: 'sit' })); }, { on: true });
  T.cast([-30, -10], (g) => { K.bench(g, -30, -10, { face: 'L', L: 2.4, z: ZT, col: '#4F7A5E' }); LX.person(g, -30.2, -8.8, ZT + 1.3, LX.who(940, { dir: 1, pose: 'sit', hair: '#D9D5CB', dress: '#3B3F47' })); LX.person(g, -28.4, -7.6, ZT, LX.who(941, { dir: 1, k: 0.66, pose: 'wave', ph: 0.2 })); }, { on: true });
  LX.walker(T, LX.who(942), [[-34, 8], [16, 8], [16, -20], [-6, -20], [-6, 8]], 0.85, { z: ZT, phase: 0.3 });
  // the steps up from the street on the east side
  T.obj([20, -6, 30, 0], (g) => LX.steps(g, 20, -6, 30, 0, 0, ZT, 'x'), { name: 'steps' });

  /* ---------------- the houses below ---------------- */
  [[22, -36, 36, -24, 3, 'g', 950, 'MERCEARIA'], [22, -22, 34, -10, 2, null, 951, null], [23, 4, 36, 16, 2, 'b', 952, 'BARBEARIA'], [-34, 18, -20, 30, 2, null, 953, null], [-18, 18, -6, 28, 1, 'y', 954, null], [2, 20, 14, 31, 2, null, 955, 'TABACARIA'], [18, 20, 30, 32, 1, null, 956, null]].forEach(([x0, y0, x1, y1, n, az, sd, shop]) =>
    T.obj([x0, y0, x1, y1], (g) => LX.house(g, { x0, y0, x1, y1, n, az, seed: sd, wash: sd % 2 === 0, door: 'L', shop, roof: n === 1 ? 'flat' : 'hip' }), { name: 'house' }));
  LX.walker(T, LX.who(960), [[-36, 34], [35, 34]], 1.0, { phase: 0.2 });
  LX.walker(T, LX.who(961, { k: 0.75 }), [[35, 18.5], [-2, 18.5]], 1.2, { phase: 0.6 });
  T.cast([-3, 33], (g) => { const c = g.p(-3, 33, 0); g.fill2([[c[0] - 2.2, c[1] - 0.4], [c[0] + 1.8, c[1] - 0.6], [c[0] + 2.0, c[1] - 2.4], [c[0] - 2.0, c[1] - 2.4]], '#C9A06A', true); g.disc2([c[0] + 2.4, c[1] - 3.0], 1.0, '#C9A06A'); g.segs2([c[0] - 1.8, c[1] - 0.4, c[0] - 1.8, c[1] + 0.6, c[0] + 1.4, c[1] - 0.4, c[0] + 1.4, c[1] + 0.6, c[0] - 2.2, c[1] - 2.0, c[0] - 3.4, c[1] - 3.2], '#8A6A3E', 0.5); LX.person(g, -5, 32.4, 0, LX.who(962, { dir: 0, pose: 'hold' })); });
});
