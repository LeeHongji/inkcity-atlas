'use strict';
/* (100,0) Wangfujing, east of the palace, running down to Chang'an Avenue.
   What it is: a paved pedestrian street (north-south) between big stores. On the west, the department store with its
   name in giant characters on the roof (王府井); in front of it the snack street, entered under a painted archway
   (小吃), with a row of stalls under red awnings: candied hawthorns (糖葫芦), noodles (面), dumplings (饺子), a
   souvenir stall (北京). Old shops face the street lower down: roast duck (烤鸭), tea (茶). On the east, St Joseph's
   church (the East Church), grey brick with three green domes, its square in front, and a modern bookstore. At the
   south end, the tall street sign with 王府井 down it.
   Who: a bride and groom having their wedding photos taken in front of the church (with the photographer kneeling
   and an assistant with a reflector), crowds strolling, a family sharing tanghulu, stall keepers calling out,
   a street sweeper.
   What moves: walkers up and down the street in both directions, the snack-street crowd, steam from the noodle pot. */
SF.tile('wangfujing', 100, 0, { rim: 46 }, function (T) {
  const H = 37;
  T.ground(function (g) {
    K.slab(g, H, { top: '#E3DED3', cut: 'x' });
    g.fill(K.rect(-6, -H, 5, H), '#D9D2C4');
    const segs = []; for (let y = -H; y < H; y += 2.2) { const a = g.p(-6, y, 0), b = g.p(5, y, 0); segs.push(a[0], a[1], b[0], b[1]); } for (let x = -6; x <= 5; x += 2.2) { const a = g.p(x, -H, 0), b = g.p(x, H, 0); segs.push(a[0], a[1], b[0], b[1]); } g.segs2(segs, '#CAC3B4', 0.25);
    g.fill(K.rect(-35, 0.4, -6, 7.6), '#D6CFC1');
    g.fill(K.rect(8, -16, 35, -2), '#E9E4D9');
  }, { rim: true });
  BJ.sidewalk(T, ['n', 'w', 's'], { sp: 13, skip: { n: [[-8, 7]], s: [[-8, 9]], w: [[-3, 9]] }, bikes: [['s', 24, 6], ['w', 20, 4]] });

  /* ---------------- the department store ---------------- */
  T.obj([-35, -35, -9, -14], function (g) {
    g.boilP = 0.25;
    K.box(g, -35, -35, -9, -14, 0, 16, { t: '#E3DED3', l: '#EDE8DE', r: '#D6D0C4' }, { w: 1 });
    g.fill(K.on('L', -13.97, -34, -10, 0.3, 4.6), '#3F4A55'); K.win(g, 'L', -14, -33, -27, 0.6, 4.2, { style: 'glass' }); K.win(g, 'L', -14, -18, -11, 0.6, 4.2, { style: 'glass' });
    g.fill(K.on('R', -8.97, -34, -15, 0.3, 4.6), '#3F4A55'); K.win(g, 'R', -9, -33, -26, 0.6, 4.2, { style: 'glass' }); K.win(g, 'R', -9, -23, -16, 0.6, 4.2, { style: 'glass' });
    for (const z of [6, 9.2, 12.4]) { for (let x = -34; x < -10; x += 3) K.win(g, 'L', -14, x, x + 2, z, z + 2, { style: 'navy' }); for (let y = -34; y < -15; y += 3) K.win(g, 'R', -9, y, y + 2, z, z + 2, { style: 'navy' }); }
    K.box(g, -35.4, -35.4, -8.6, -13.6, 16, 16.8, { t: '#D6D0C4', l: '#E3DED3', r: '#CFC9BD' }, { w: 0.7 });
    // the name on the roof in big red characters on a white board
    const b0 = -33, b1 = -11; for (const x of [b0 + 1, b1 - 1]) { const a = g.p(x, -18, 16.8), t = g.p(x, -18, 23); g.segs2([a[0], a[1], t[0], t[1]], '#6E6A62', 0.45); }
    BJ.sign(g, 'L', -18, b0, b1, 17.6, 23, '#F7F5EF', '王府井', { ink: '#C42C25', c: '#9A968E' });
  }, { name: 'department store' });

  /* ---------------- the snack street ---------------- */
  T.obj([-7.4, 0, -6.6, 8], (g) => BJ.pailou(g, 'R', -7, 0.2, 7.8, { bays: 3, h: 9, word: '小吃', roof: '#5E8A6A', board: '#9E2E24' }), { name: 'archway' });
  const STALLS = [[-33, '糖葫芦', '#C9382E'], [-26, '面', '#E2A13A'], [-19, '饺子', '#C9382E'], [-12.4, '北京', '#3E6FB0']];
  STALLS.forEach(([x, w, col], i) => T.obj([x - 3, -9, x + 3, -1.2], function (g) {
    K.box(g, x - 3, -6.4, x + 3, -1.2, 0, 2.8, { t: '#D9B57E', l: '#C9A26B', r: '#B58F58' }, { w: 0.6, boil: false });
    K.box(g, x - 3, -9, x + 3, -6.4, 0, 7.4, { t: '#B9B6AE', l: '#C6C3BB', r: '#ADAAA2' }, { w: 0.6 });
    const R = RNG(i * 7 + 1); for (let k = 0; k < 7; k++) { const c = g.p(x - 2.4 + k * 0.8, -1.6, 2.8); if (i === 0) { g.segs2([c[0], c[1], c[0], c[1] - 4.6], '#C9A26B', 0.3); for (let j = 0; j < 4; j++) g.disc2([c[0], c[1] - 1.6 - j * 0.9], 0.55, '#D2342A'); } else g.disc2([c[0], c[1] - 0.6], 0.8, R.pick(i === 3 ? ['#C9382E', '#F3F1EA', '#3E6FB0', '#E6C24F'] : ['#F3E3B8', '#E2B13A', '#C9A26B', '#F7F2E2'])); }
    // the red awning and the name board above it
    const aw = [[x - 3.4, -6.4, 6.0], [x + 3.4, -6.4, 6.0], [x + 3.4, -1.0, 4.8], [x - 3.4, -1.0, 4.8]]; g.fill(aw, col); g.outline(aw, { w: 0.5, c: shade(col, 0.5), boil: false });
    const st = []; for (let k = 1; k < 6; k++) { const a = lerp(x - 3.4, x + 3.4, k / 6), p0 = g.p(a, -6.4, 6.0), p1 = g.p(a, -1.0, 4.8); st.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(st, shade(col, 0.25), 0.35);
    BJ.sign(g, 'L', -6.4, x - 2.6, x + 2.6, 6.2, 7.2, '#2A2420', w, { ink: '#F2C94C' });
  }, { name: 'stall' }));
  // stall keepers at the ends of their counters, customers in the lane
  T.cast([-22, 2], (g) => {
    BJ.person(g, -29.6, -0.6, 0, BJ.who(1000, { dir: 1, pose: 'wave', ph: 0.3, top: '#F3F1EA' }));
    BJ.person(g, -26, 1.4, 0, BJ.who(1001, { dir: 3, pose: 'hold', phone: true }));
    BJ.person(g, -24.6, 2.2, 0, BJ.kid(1002, { dir: 3 }));
    BJ.person(g, -16, 1.6, 0, BJ.who(1003, { dir: 3, pose: 'stand' }));
    BJ.person(g, -33, 2.0, 0, BJ.who(1004, { dir: 3, tanghulu: true }));
    BJ.person(g, -10, 2.6, 0, BJ.tourist(1005, '#F2C230', { dir: 3, pose: 'hold', phone: true }));
  }, { on: false });
  T.actor({ sample: 5, period: 3, grow: false, at(t) { const u = (t % 3) / 3; return { x: -26, y: -2.6, z: 3 + u * 5, key: 's' + Math.floor(u * 10), u }; }, draw(g, st) { const o = g.p(0, 0, 0); g.fill2(arcPts(o[0], o[1], 2 + st.u * 2, 0, TAU, 10), `rgba(240,240,236,${(0.7 * (1 - st.u)).toFixed(2)})`, true); } });
  // old shops lower down the street
  [[-14, 10, -7.4, 21, '烤鸭', 1010], [-14, 22, -7.4, 33.4, '茶', 1011]].forEach(([x0, y0, x1, y1, w, s]) => T.obj([x0, y0, x1, y1], (g) => BJ.shop(g, x0, y0, x1, y1, { front: 'R', word: w, seed: s }), { name: 'shop' }));
  BJ.court(T, { x0: -35, y0: 10, x1: -16, y1: 33.4, gate: 'E', ga: 14, east: 'wall', nd: 6, sd: 5 });

  /* ---------------- St Joseph's church ---------------- */
  T.obj([8, -35, 33, -18], function (g) {
    g.boilP = 0.25;
    const GR = { t: '#A9A6A0', l: '#B6B3AC', r: '#A09D96' };
    K.box(g, 14, -32, 33, -21, 0, 11, GR, { w: 0.9 });
    for (let x = 16; x < 32; x += 3.2) K.win(g, 'L', -21, x, x + 1.4, 3, 8.6, { style: 'navy', arch: true });
    K.win(g, 'R', 33, -29, -24, 3, 8.6, { style: 'navy', arch: true });
    BJ.roof(g, 14, -32, 33, -21, 11, 4.2, { type: 'gable', col: '#7E8A86', over: 0.5, lift: 0, ridge: 'x', curl: 0, gcol: '#B6B3AC', tiles: false });
    // the west front: three towers with green domes (the middle one tallest), a rose window
    for (const [y0, y1, h, r] of [[-34.6, -30, 15, 2.0], [-23, -18.4, 15, 2.0], [-30, -23, 18, 2.8]]) {
      K.box(g, 8.6, y0, 14, y1, 0, h, GR, { w: 0.9 });
      const cy = (y0 + y1) / 2; K.win(g, 'R', 14, cy - 1, cy + 1, h - 5, h - 1.4, { style: 'dark', arch: true });
      K.cyl(g, 11.3, cy, r * 0.9, h, h + 1.2, GR, { w: 0.6, n: 12 });
      K.dome(g, 11.3, cy, r, h + 1.2, r * 1.5, '#5E9A7A', { w: 0.7, shadow: '#4A7E62' });
      const t = g.p(11.3, cy, h + 1.2 + r * 1.5); g.segs2([t[0], t[1], t[0], t[1] - 5, t[0] - 1.4, t[1] - 3.4, t[0] + 1.4, t[1] - 3.4], '#4A4540', 0.5);
    }
    const rw = g.p(14.05, -26.5, 9.6); g.disc2(rw, 2.4, '#3E5E8E'); g.ring2(rw, 2.4, { w: 0.5, c: '#4A4540' });
  }, { name: 'east church' });
  // the wedding photo on the church square
  T.cast([20, -9], (g) => {
    const br = BJ.person(g, 19.4, -10, 0, BJ.who(1020, { dir: 1, dress: '#FBFAF6', top: '#FBFAF6', hairStyle: 'bun', pose: 'hold' }));
    const vb = br.crown; g.fill2([[vb[0] - 1.6, vb[1] + 0.2], [vb[0] + 1.8, vb[1] + 0.4], [vb[0] + 3.4, vb[1] + 12], [vb[0] - 0.6, vb[1] + 13]], 'rgba(251,250,246,0.75)', true);
    g.disc2(br.hands[0], 1.2, '#E7A9A0'); g.disc2([br.hands[0][0] + 0.8, br.hands[0][1] - 0.6], 0.8, '#F2C230');
    BJ.person(g, 21.0, -10.4, 0, BJ.who(1021, { dir: 1, top: '#2F343B', bot: '#2F343B', jacket: '#FBFAF6', tie: '#2F343B', hairStyle: 'short' }));
    BJ.person(g, 20.4, -4.0, 0, BJ.who(1022, { dir: 3, pose: 'kneel', hands: [[-0.6, -9], [0.8, -9]] }));
    const r = BJ.person(g, 16.4, -6.4, 0, BJ.who(1023, { dir: 0, pose: 'hold', reach: [2.6, -9] })); const hd = r.hands[0]; g.fill2(arcPts(hd[0] + 2, hd[1] - 2, 3.0, 0, TAU, 12), '#F2E3A0', true); g.ring2([hd[0] + 2, hd[1] - 2], 3.0, { w: 0.35, c: '#A99A5A' });
  }, { on: false });

  /* ---------------- the bookstore and the street sign ---------------- */
  T.obj([12, 3, 35, 28], function (g) {
    g.boilP = 0.25;
    K.box(g, 12, 3, 35, 28, 0, 14, { t: '#D9DEE2', l: '#C9D6DF', r: '#AFBFCB' }, { w: 1 });
    const gr = []; for (let z = 4.4; z < 14; z += 3.2) for (const [f, p, a0, a1] of [['L', 28, 12, 35], ['R', 35, 3, 28]]) { const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z)); gr.push(a[0], a[1], b[0], b[1]); }
    for (const [f, p, a0, a1] of [['L', 28, 12, 35], ['R', 35, 3, 28]]) for (let a = a0 + 2.3; a < a1; a += 2.3) { const P0 = g.p.apply(g, K.pt(f, p + 0.02, a, 4.4)), P1 = g.p.apply(g, K.pt(f, p + 0.02, a, 14)); gr.push(P0[0], P0[1], P1[0], P1[1]); }
    g.segs2(gr, '#8EA7B6', 0.35);
    g.fill(K.on('L', 28.03, 13, 34, 0.3, 3.8), '#E9D3A6'); K.win(g, 'L', 28, 14, 21, 0.6, 3.6, { style: 'glass' }); K.win(g, 'L', 28, 25, 33, 0.6, 3.6, { style: 'glass' });
    K.sign(g, 'L', 28, 14, 33, 9.4, 12.6, '#C42C25', 'BOOKSTORE');
  }, { name: 'bookstore' });
  T.obj([6.6, 30.6, 9.4, 31.4], function (g) {
    for (const x of [6.9, 9.1]) { const a = g.p(x, 31, 0), b = g.p(x, 31, 14); g.fill2([[a[0] - 0.35, a[1]], [a[0] + 0.35, a[1]], [b[0] + 0.35, b[1]], [b[0] - 0.35, b[1]]], '#6E6A62'); }
    BJ.sign(g, 'L', 31.2, 6.6, 9.4, 3.4, 13.6, '#F7F5EF', '王府井', { vert: true, ink: '#C42C25', c: '#8C8576' });
  }, { name: 'street sign' });

  /* ---------------- the crowd on the street ---------------- */
  // two loops up one side of the street and down the other, four strollers on each
  [[-4.6, -2.6, 1.1], [1.8, 3.8, 1.25]].forEach(([xa, xb, v], li) => { for (let k = 0; k < 4; k++) K.walker(T, k === 2 ? BJ.tourist(1040 + li * 4 + k, '#E85A3A') : BJ.who(1040 + li * 4 + k), [[xa, -36], [xa, 36], [xb, 36], [xb, -36]], v, { phase: k / 4 + li * 0.11 }); });
  K.walker(T, BJ.who(1060, { top: '#E8742A', cap: '#E8742A' }), [[30, -1], [10, -1]], 0.5, { phase: 0.2 });
  // people standing about: shoppers with bags, friends with tanghulu, a selfie, onlookers at the wedding
  [[-0.4, -24, 1061, 1], [-0.4, -21.6, 1062, 3], [-0.4, 14, 1063, 1], [-0.4, 16.4, 1064, 3], [24, -4.2, 1065, 2], [26, -5.4, 1066, 2], [13, 31.6, 1067, 1], [-0.4, 30.6, 1068, 1], [-0.4, 33.0, 1069, 3]].forEach(([x, y, s, d], i) => T.cast([x, y], (g) => BJ.person(g, x, y, 0, BJ.who(s, Object.assign({ dir: d }, i % 3 === 0 ? { pose: 'hold', phone: true, reach: [0.4, -9] } : i % 3 === 1 ? { tanghulu: true } : {}))), { on: false }));
});
