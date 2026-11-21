'use strict';
/* (0, -100) Campo Santa Maria Formosa in Carnival: the city's big neighbourhood campo given over to the masks.
   - The church of Santa Maria Formosa: a white Istrian front with pediments, its domes and lantern; the baroque bell
     tower beside it with the grotesque stone mask at its door.
   - A little stage where a commedia dell'arte troupe plays (Arlecchino tumbles, Pantalone shakes his fist, Colombina
     laughs) to children on their parents' shoulders; a frittelle stall (the Carnival doughnuts) with its queue; a
     balloon seller; a mask shop.
   - The parade: a drummer leads a line of costumes round the campo (gowns, a bauta, a plague doctor, a jester), on a
     loop that keeps clear of the stage and the stalls; confetti on the stones.
   Houses in ochre and rose round it, altane, bridges over the rii on three sides. */
SF.tile('formosa', 0, -100, { rim: 10 }, function (T) {
  const P = VN.PLASTER;
  T.ground(function (g) {
    g.boilP = 0.15;
    K.slab(g, 37, { top: VN.paveC });
    VN.pave(g, -37, -37, 37, 37, { col: '#D3CEC2', step: 2.6 });
    g.fill(K.rect(36.3, -37, 37, 37), VN.istria); g.fill(K.rect(-37, 36.3, 37, 37), VN.istria);
    const cf = []; for (let i = 0; i < 220; i++) { const c = g.p(lerp(-22, 26, h1(i * 1.31)), lerp(-14, 26, h1(i * 2.17)), 0); cf.push([c, ['#C9463E', '#E6C24F', '#5F8FC9', '#8FBF73', '#D98AA4'][i % 5]]); }
    for (const [c, col] of cf) g.fill2([[c[0], c[1]], [c[0] + 0.6, c[1] + 0.2], [c[0] + 0.4, c[1] + 0.6]], col, true);
  }, { rim: true });
  const H = (d, nm) => T.obj([d.x0, d.y0, d.x1, d.y1], (g) => VN.house(g, d), { name: nm || 'house' });

  /* ---------- the church and the bell tower ---------- */
  T.obj([-34, -35, -12, -15], function (g) {
    g.boilP = 0.22;
    const W = { t: '#E9E3D6', l: '#F3EFE6', r: '#E2DCCF' }, x0 = -34, x1 = -12, y1 = -15, F = y1 + 0.02;
    K.box(g, x0, -35, x1, y1, 0, 10, W, { w: 0.9 });
    K.cyl(g, -23, -26, 4.4, 10, 14, W, { w: 0.7, n: 16 }); K.dome(g, -23, -26, 4.4, 14, 4.2, '#AAB3B6', { w: 0.7, shadow: '#919CA0' });
    K.cyl(g, -23, -26, 0.9, 18.2, 20, W, { w: 0.45, n: 8 }); K.dome(g, -23, -26, 1.0, 20, 1.2, '#AAB3B6', { w: 0.45 });
    K.hip(g, x0 + 0.5, -34.5, x1 - 0.5, y1 - 0.5, 10, 2.0, VN.roof, { ridge: 10, c: '#7A3A28' });
    // the front: a temple front with columns, a pediment, statues
    g.fill(K.on('L', F, -28, -18, 0, 12.6), '#F3EFE6');
    const pd = [[-28.4, F + 0.02, 12.6], [-17.6, F + 0.02, 12.6], [-23, F + 0.02, 15.4]]; g.fill(pd, '#F6F2EA'); g.outline(pd, { w: 0.6, boil: false });
    const cl = []; for (const a of [-27.4, -25.2, -20.8, -18.6]) { const p0 = g.p(a, F + 0.03, 0.8), p1 = g.p(a, F + 0.03, 11.4); cl.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(cl, '#D9D2C4', 1.1);
    VN.door(g, 'L', F, -24.2, -21.8, 5.4, { arch: 'round', col: '#4A3A30' });
    VN.win(g, 'L', F, -24, -22, 7.4, 10.6, { arch: 'round', sh: null, pane: '#55606A' });
    for (const a of [-31.5, -14.5]) VN.win(g, 'L', F, a - 0.8, a + 0.8, 3, 7.6, { arch: 'round', sh: null, pane: '#55606A' });
    for (const a of [-28.4, -23, -17.6]) { const c = g.p(a, F, a === -23 ? 15.4 : 12.6); g.fill2([[c[0] - 0.5, c[1]], [c[0] + 0.5, c[1]], [c[0] + 0.4, c[1] - 2.8], [c[0] - 0.4, c[1] - 2.8]], '#F6F2EA', true); g.disc2([c[0], c[1] - 3.2], 0.5, '#F6F2EA'); }
  }, { name: 'santa maria formosa' });
  T.obj([-36, -12, -31, -7], function (g) {
    K.box(g, -36, -12, -31, -7, 0, 20, { t: '#E2DCCF', l: '#EDE8DD', r: '#D9D2C4' }, { w: 0.85 });
    for (const [f, p, a0, a1] of [['L', -7, -36, -31], ['R', -31, -12, -7]]) { g.fill(VN.archPts(f, p + 0.02, a0 + 1.2, a1 - 1.2, 15, 18.6, 'round', 0), '#4A3E34'); g.fill(K.on(f, p + 0.03, a0, a1, 14.4, 14.9), VN.istria); }
    K.cyl(g, -33.5, -9.5, 1.8, 20, 22.4, { t: '#E2DCCF', l: '#EDE8DD', r: '#D9D2C4' }, { w: 0.6, n: 10 });
    K.dome(g, -33.5, -9.5, 1.9, 22.4, 2.6, '#6F9A86', { w: 0.6 });
    // the grotesque mask over the door
    const m = g.p(-30.97, -9.5, 3.8); g.fill2(arcPts(m[0], m[1], 1.6, 0, TAU, 10).map((q) => [q[0], m[1] + (q[1] - m[1]) * 1.25]), '#D9D2C4', true); g.disc2([m[0] - 0.5, m[1] - 0.4], 0.28, '#2A2622'); g.disc2([m[0] + 0.5, m[1] - 0.5], 0.28, '#2A2622'); g.fill2([[m[0] - 0.8, m[1] + 0.8], [m[0] + 0.8, m[1] + 0.6], [m[0], m[1] + 1.3]], '#6E5040', true);
    VN.door(g, 'R', -30.98, -10.4, -8.6, 2.6, { col: '#4A3A30' });
  }, { name: 'bell tower', tall: true });

  /* ---------- houses ---------- */
  H({ x0: -8, y0: -37, x1: 4, y1: -27, n: 4, col: P[0], chim: [[-3, -33], [1, -30, 'square']], shopL: [-6.5, 2.5, '#2F3A55', 'MASCHERE'], altana: [-2, -32, { wash: ['#F3F1EA', '#D98AA4', '#5F8FC9'] }], goods: (g, f, p, s0, s1) => { for (let i = 0; i < 5; i++) { const c = g.p.apply(g, K.pt(f, p + 0.05, lerp(s0 + 1, s1 - 1, i / 4), 1.9 + (i % 2) * 0.8)); g.fill2(arcPts(c[0], c[1], 1.1, 0, TAU, 8).map((q) => [q[0], c[1] + (q[1] - c[1]) * 1.2]), ['#F4F1EA', '#D9B24A', '#C9463E', '#2F4F8F', '#F4F1EA'][i], true); g.disc2([c[0] - 0.4, c[1] - 0.2], 0.2, '#2A2622'); g.disc2([c[0] + 0.4, c[1] - 0.2], 0.2, '#2A2622'); } } });
  H({ x0: 4, y0: -37, x1: 16, y1: -27, n: 3, col: P[3], chim: [[9, -33]], shopL: [5.5, 14.5, '#7A2E35', 'TABACCHI'] });
  H({ x0: 16, y0: -37, x1: 27, y1: -27, n: 4, col: P[7], chim: [[21, -32], [24, -30]], balcony: ['L', 21.5, ['#C9463E', '#E6C24F']] });
  H({ x0: 27, y0: -37, x1: 37, y1: -26, n: 3, z0: VN.WL, col: P[2], chim: [[31, -32]] });
  H({ x0: -37, y0: 6, x1: -27, y1: 20, n: 3, col: P[8], chim: [[-32, 11]], shopR: [8, 18, '#3E5A44', 'GELATERIA'] });
  H({ x0: -37, y0: 22, x1: -25, y1: 37, n: 4, z0: VN.WL, col: P[5], chim: [[-31, 27]], altana: [-31, 31, {}] });
  H({ x0: 26, y0: 8, x1: 37, y1: 24, n: 2, z0: VN.WL, col: P[6], roof: 'x', chim: [[31, 14]], shopL: [27.5, 35, '#5A4A6A', 'COSTUMI'] });

  /* ---------- the stage and the troupe ---------- */
  T.obj([-8, -24, 6, -17], function (g) {
    g.boilP = 0.2;
    K.box(g, -8, -24, 6, -17, 0, 1.8, { t: '#B8875A', l: '#9C7450', r: '#8A6440' }, { w: 0.6 });
    // the painted backdrop on two posts, a red curtain swag
    g.fill(K.on('L', -23.6, -7.4, 5.4, 1.8, 9.6), '#E9D9A0'); g.fill(K.on('L', -23.58, -7.4, 5.4, 1.8, 4.6), '#9DB8C4');
    const bk = g.P(K.on('L', -23.55, -7.4, 5.4, 4.6, 9.6)); g.fill2([[lerp(bk[0][0], bk[1][0], 0.2), bk[0][1] - 0.2], [lerp(bk[0][0], bk[1][0], 0.5), bk[0][1] - 9], [lerp(bk[0][0], bk[1][0], 0.8), bk[1][1] + 1]], '#C9A26B', true);
    g.fill(K.on('L', -23.5, -7.6, 5.6, 8.6, 10.2), '#B5303A'); g.outline(K.on('L', -23.6, -7.4, 5.4, 1.8, 10.2), { w: 0.6, boil: false });
    K.sign(g, 'L', -23.45, -4, 2, 8.8, 9.9, '#B5303A', 'COMMEDIA', { ink: '#E9D9A0' });
  }, { name: 'stage' });
  T.actor({ sample: 5, period: 4,
    at(t) { const f = Math.floor(t * 2) % 8; return { x: -1, y: -19.5, z: 1.8, key: f, f }; },
    draw(g, st) {
      const f = st.f;
      VN.person(g, -4.0, -0.6, 0, VN.carnival(1601, 'volto', { dir: 1, pose: f % 4 < 2 ? 'wave' : 'stand', ph: 0.25, top: '#7A2E35', bot: '#7A2E35', volto: '#2A2622' }));          // Pantalone
      VN.person(g, 0.6, 0, 0, VN.carnival(1602, 'jester', { dir: f % 2 ? 0 : 1, pose: f % 3 === 0 ? 'cheer' : 'walk', ph: f / 8, harlequin: true }));                         // Arlecchino
      VN.person(g, 3.8, -0.4, 0, VN.carnival(1603, 'gown', { dir: 1, pose: f % 4 === 3 ? 'cheer' : 'hold', ph: 0.2, gown: '#F3F1EA', gownT: '#5F8FC9', plume: null }));     // Colombina
    } });
  T.cast([-1, -12], function (g) {
    const sp = [[-6, -13.6, 0.75, 'cheer'], [-3.6, -13, 1, 'stand'], [-1.2, -12.6, 0.72, 'cheer'], [1.4, -13.2, 1, 'hold'], [4, -12.8, 0.75, 'stand'], [-5, -10.6, 1, 'stand'], [-2.2, -10.2, 1, 'hold'], [0.8, -10.4, 0.7, 'cheer'], [3.6, -10.0, 1, 'stand']];
    sp.forEach(([x, y, k, pose], i) => VN.person(g, x, y, 0, Object.assign({}, i % 4 === 2 ? VN.carnival(1610 + i, 'gown', { k }) : VN.who(1610 + i, { k }), { dir: 3, pose, ph: 0.3 })));
  }, { name: 'audience' });
  // the frittelle stall and its queue, a balloon seller
  T.obj([16, -12, 22, -7], function (g) {
    K.box(g, 16, -12, 22, -8, 0, 2.4, { t: '#E9DFC2', l: '#F1E6CC', r: '#D9CDB0' }, { w: 0.6 });
    const pile = []; for (let i = 0; i < 9; i++) { const c = g.p(16.8 + (i % 5) * 1.1, -10.5 + Math.floor(i / 5) * 1.2, 2.5); pile.push(c); } for (const c of pile) { g.disc2(c, 0.9, '#C98A3E'); g.disc2([c[0] - 0.2, c[1] - 0.3], 0.35, '#F6F1E4'); }
    const pts = [[15.6, -12.4, 6], [22.4, -12.4, 6], [22.4, -7.6, 5.2], [15.6, -7.6, 5.2]]; g.fill(pts, '#E6C24F'); g.outline(pts, { w: 0.5, boil: false, c: '#8A6A1E' });
    K.sign(g, 'L', -7.58, 16.4, 21.6, 4.2, 5.0, '#C9463E', 'FRITTELLE', { ink: '#F6F1E4' });
    const ps = []; for (const [x, y] of [[15.8, -7.8], [22.2, -7.8]]) { const a = g.p(x, y, 0), b = g.p(x, y, 5.2); ps.push(a[0], a[1], b[0], b[1]); } g.segs2(ps, '#6E5A44', 0.45);
  }, { name: 'frittelle' });
  T.cast([23.5, -9], (g) => VN.person(g, 23.5, -9, 0, VN.who(1620, { dir: 1, pose: 'hold', top: '#F3F1EA', colombina: null })), { name: 'seller' });
  T.cast([19, -4], (g) => { for (let i = 0; i < 4; i++) VN.person(g, 19 + i * 0.4, -5.4 + i * 1.7, 0, Object.assign({}, i === 2 ? VN.carnival(1625, 'cape') : VN.who(1621 + i, { k: i === 1 ? 0.75 : 1 }), { dir: 3 })); }, { name: 'queue' });
  T.actor({ sample: 5, period: 6, layer: '',
    at(t) { const f = Math.floor(t * 2) % 4; return { x: 17, y: 18, key: f, f }; },
    draw(g, st) {
      const r = VN.person(g, 0, 0, 0, VN.who(1630, { dir: 1, pose: 'hold', beanie: '#C9463E', colombina: null })), h = r.hands[0];
      const cols = ['#C9463E', '#E6C24F', '#5F8FC9', '#8FBF73', '#D98AA4', '#8E79C0'];
      cols.forEach((c, i) => { const a = -Math.PI / 2 + (i - 2.5) * 0.28 + Math.sin(st.f * 1.6 + i) * 0.06, b = [h[0] + Math.cos(a) * 12, h[1] + Math.sin(a) * 12 - 2]; g.fine2([h, b], { w: 0.2, c: '#6E6A60' }); g.fill2(arcPts(b[0], b[1] - 1.6, 1.6, 0, TAU, 10).map((q) => [q[0], q[1] + (q[1] > b[1] - 1.6 ? (q[1] - b[1] + 1.6) * 0.35 : 0)]), c, true); });
    } });
  T.obj([-18, 22], (g) => VN.well(g, -18, 22), { name: 'well' });
  for (const [x, y] of [[-16, 6], [24, 26]]) T.obj([x, y], (g) => VN.lamp(g, x, y, {}), { name: 'lamp' });

  /* ---------- the parade ---------- */
  const loop = [[-18, -4], [10, -4], [10, 28], [-14, 28]], LL = 2 * (28 + 32), sp = 1.0;
  const ppl = [VN.who(1640, { top: '#B5303A', bot: '#F3F1EA', tricorn: '#2A2622', beanie: null, colombina: null }), VN.carnival(1641, 'gown'), VN.carnival(1642, 'bauta'), VN.carnival(1643, 'gown'), VN.carnival(1644, 'medico'), VN.carnival(1645, 'jester'), VN.carnival(1646, 'cape'), VN.carnival(1647, 'gown'), VN.carnival(1648, 'volto')];
  ppl.forEach((w, i) => {
    const lp = loop.concat([loop[0]]);
    T.actor({ sample: 0.25, period: LL / sp,
      at(t) {
        let d = ((t * sp - i * 3.0) % LL + LL) % LL, k = 0; while (k < 3 && d > Math.hypot(lp[k + 1][0] - lp[k][0], lp[k + 1][1] - lp[k][1])) { d -= Math.hypot(lp[k + 1][0] - lp[k][0], lp[k + 1][1] - lp[k][1]); k++; }
        const a = lp[k], b = lp[k + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]), u = d / l, dx = b[0] - a[0], dy = b[1] - a[1];
        const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor((((t * sp - i * 3) / 2.4) % 1 + 1) % 1 * 8) / 8;
        return { x: a[0] + dx * u, y: a[1] + dy * u, dir, ph, key: dir + '.' + ph };
      },
      draw(g, st) {
        const r = VN.person(g, 0, 0, 0, Object.assign({}, w, { dir: st.dir, pose: i === 0 ? 'hold' : 'walk', ph: st.ph }));
        if (i === 0) { const h = r.hands[0], c = [h[0], h[1] + 1.6]; g.fill2(arcPts(c[0], c[1], 2.2, 0, TAU, 12).map((q) => [q[0], c[1] + (q[1] - c[1]) * 0.5]), '#F3F1EA', true); g.fill2([[c[0] - 2.2, c[1]], [c[0] + 2.2, c[1]], [c[0] + 2.2, c[1] + 2.4], [c[0] - 2.2, c[1] + 2.4]], '#B5303A', true); g.segs2([c[0] - 2.2, c[1] + 0.2, c[0], c[1] + 2.2, c[0], c[1] + 2.2, c[0] + 2.2, c[1] + 0.2], '#E6C24F', 0.35); }
      } });
  });
  const Wk = (seed, pts, v, ph) => VN.walker(T, VN.who(seed), pts, v, { phase: ph });
  Wk(1650, [[-33, 4], [24, 4], [24, -22], [32, -22]], 1.4, 0); Wk(1651, [[5, 33], [5, 6], [23, 6]], 1.3, 0.5); Wk(1652, [[33, 0], [-20, 0]], 1.2, 0.2); Wk(1653, [[-22, 32], [22, 32]], 1.3, 0.7);
  VN.finish(T);
});
