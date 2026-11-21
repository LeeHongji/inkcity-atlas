'use strict';
/* (0,-100) "8D": the tower whose 11th floor is a ground floor (after the Kuixing Building).
   What it is: a slim residential tower standing in a lower street, built against the hill; the upper road runs along
   the top of a 28 u retaining wall behind it and a short bridge walks straight from the road into the tower's 11th
   floor, so the building has a ground floor at the bottom and another halfway up. A public lift in a glass shaft
   on the wall's face carries people between the two streets; a bus stop on the upper road, a market at the bottom.
   Levels: the lower street at z 0 (meets the walking street and the car street in front); the upper road on its
   terrace at z 28, its far edge the map's edge (so nothing behind it can be hidden).
   Who: commuters coming out of the bridge door, a bus waiting at the stop on the upper road with a queue, a fruit and
   vegetable market at the bottom with a porter loading up, kids at the lift doors, an old man airing his birds on the
   bridge, a woman hanging washing on a balcony.
   Moving: the lift cabin going up and down its shaft, walkers on both streets and across the bridge. */
SF.tile('kuixing', 0, -100, { rim: 12 }, function (T) {
  const H = 37, ZU = 28, TX0 = -6, TX1 = 12, TY0 = -24, TY1 = 2, ST = 2.8, NS = 17;
  T.ground(function (g) {
    K.slab(g, H, { top: '#DCD3BF' });
    g.fill(K.rect(-14, 6, 37, 37), '#D8D0BF'); CQ.paving(g, -14, 6, 37, 37, 0, { dens: 0.5 });
  }, { rim: true });

  /* ---- the upper road on its wall ---- */
  T.obj([-37, -37, -14, 37], (g) => {
    CQ.terrace(g, -37, -37, -14, 37, 0, ZU, { top: '#D3CBBB' });
    g.fill(K.rect(-31, -37, -19, 37, ZU), '#C4BCAC');
    for (const x of [-25.4, -24.6]) g.line([[x, -37, ZU], [x, 37, ZU]], { c: '#E3B940', w: 0.5, boil: false });
    CQ.rail(g, 'R', -14.4, -36, 36.5, ZU, { h: 1.4 }); CQ.rail(g, 'L', 36.6, -36, -14.5, ZU, { h: 1.4 });
    // a painted slogan band along the wall's face
    CQH.sign(g, 'R', -14, 16, 30, 10, 14, '#2F4A6B', '重庆', { ink: '#F4F1E6' });
  }, { name: 'upper road' });
  // the bus stop and a bus waiting at it
  T.obj([-18.5, -30, -16, -22], (g) => { const z = ZU; for (const y of [-29.5, -22.5]) { const a = g.p(-17.2, y, z), b = g.p(-17.2, y, z + 5); g.segs2([a[0], a[1], b[0], b[1]], '#5A564E', 0.5); } K.box(g, -18.5, -30, -16, -22, z + 5, z + 5.5, '#3F6FA8', { w: 0.5 }); K.sign(g, 'R', -16, -29, -23, z + 3.4, z + 4.8, '#3F6FA8', '461'); }, { on: true, name: 'bus stop' });
  T.obj([-25.3, -33.3, -19.7, -18.7], (g) => g.at(-22.5, -26, ZU, (g2) => CQ.bus(g2, Math.PI / 2, { band: '#2F8F5A' })), { on: true, name: 'bus' });
  for (let i = 0; i < 5; i++) T.cast([-15.6, -28 + i * 1.7], (g) => CQ.person(g, -15.6, -28 + i * 1.7, ZU, CQ.who(1500 + i, { dir: 2, pose: i % 2 ? 'hold' : 'stand', phone: i % 2 === 1 })), { on: true, name: 'queue' });

  /* ---- the tower ---- */
  T.obj([TX0, TY0, TX1, TY1], (g) => {
    g.boilP = 0.2;
    const ZT = NS * ST, col = '#E3DFD4';
    K.box(g, TX0, TY0, TX1, TY1, 0, ZT, { t: '#D2CDC1', l: col, r: '#CCC6B8' }, { w: 0.95 });
    const W = [], cs = [], R = RNG(31);
    for (let k = 0; k < NS; k++) {
      const z = k * ST;
      for (const [f, p, a0, a1] of [['L', TY1, TX0, TX1], ['R', TX1, TY0, TY1]]) {
        const n = Math.round((a1 - a0) / 2.6);
        for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (i + 0.5) / n; if (k === 10) continue; W.push([f, p, a, z]); }
      }
    }
    for (const [f, p, a, z] of W) { g.fill(K.on(f, p + 0.03, a - 0.6, a + 0.6, z + 0.7, z + 2.2), '#56606A'); if (R() < 0.3) { const q = K.on(f, p + 0.45, a - 0.75, a + 0.75, z + 0.55, z + 2.35); g.fill(q, 'rgba(120,124,124,0.35)'); const P = g.P(q); for (let s = 0; s <= 4; s++) cs.push(lerp(P[0][0], P[1][0], s / 4), lerp(P[0][1], P[1][1], s / 4), lerp(P[3][0], P[2][0], s / 4), lerp(P[3][1], P[2][1], s / 4)); } else if (R() < 0.25) for (let j = 0; j < 3; j++) g.fill(K.on(f, p + 0.6, a - 0.6 + j * 0.45, a - 0.3 + j * 0.45, z + 0.3, z + 1.4), R.pick(['#E2725B', '#F4F1E8', '#6E9BC8', '#E6C24F', '#9FC07A'])); }
    g.segs2(cs, '#6F6E68', 0.22);
    // the 11th floor, where the bridge comes in: a lit lobby band round the tower and its number
    for (const [f, p, a0, a1] of [['L', TY1, TX0, TX1], ['R', TX1, TY0, TY1]]) { g.fill(K.on(f, p + 0.04, a0 + 0.3, a1 - 0.3, 10 * ST + 0.3, 11 * ST - 0.2), '#F2CF7E'); const m = []; for (let a = a0 + 1.5; a < a1; a += 1.5) { const q0 = g.p.apply(g, K.pt(f, p + 0.05, a, 10 * ST + 0.3)), q1 = g.p.apply(g, K.pt(f, p + 0.05, a, 11 * ST - 0.2)); m.push(q0[0], q0[1], q1[0], q1[1]); } g.segs2(m, '#8A6A3A', 0.3); }
    g.fill(K.on('L', TY1 + 0.06, TX0 + 0.6, TX0 + 4.6, 11 * ST, 11 * ST + 2.2), '#C8392E'); K.text(g, 'L', TY1 + 0.08, TX0 + 2.6, 11 * ST + 0.45, 1.3, '11F', '#FBF4E2', { center: true });
    // the ground floor's lobby: glass doors and the name board
    g.fill(K.on('R', TX1 + 0.03, TY0 + 2, TY1 - 2, 0, 3.4), '#4E555B');
    CQH.sign(g, 'R', TX1 + 0.05, TY0 + 4, TY1 - 4, 3.6, 5.0, '#C8392E', '出口');
    // rooftop: tank, a red neon frame
    K.box(g, TX0 + 2, TY0 + 3, TX0 + 6, TY0 + 7, ZT, ZT + 2.4, { t: '#D7D9D6', l: '#C3C6C3', r: '#A9ACA9' }, { w: 0.5, boil: false });
    CQH.sign(g, 'L', TY1 - 2, TX0 + 2, TX1 - 2, ZT + 0.6, ZT + 3.6, '#C8392E', '重庆', { ink: '#F6E7B8' });
  }, { name: 'tower' });
  // the bridge from the upper road into the 11th floor (its back face, z 28), at the tower's front corner so it shows
  T.obj([-14, -3, TX0, 2], (g) => {
    K.box(g, -14, -3, TX0, 2, ZU - 1.2, ZU, { t: '#D9D3C4', l: '#BDB6A6', r: '#A9A190' }, { w: 0.7 });
    CQ.rail(g, 'L', 1.7, -14, TX0, ZU, { h: 1.5, sp: 0.9 }); CQ.rail(g, 'L', -2.7, -14, TX0, ZU, { h: 1.5, sp: 0.9 });
    for (const x of [-13.6, -10, -6.4]) for (const y of [-2.6, 1.6]) { const a = g.p(x, y, ZU), b = g.p(x, y, ZU + 4.4); g.segs2([a[0], a[1], b[0], b[1]], '#7A2A22', 0.5); }
    CQ.person(g, -10, -0.5, ZU, CQ.elder(1510, { dir: 0, cage: true, pose: 'hold', bird: '#E6C24F' }));
    K.box(g, -14.3, -3.3, TX0, 2.3, ZU + 4.4, ZU + 5.0, { t: '#C8392E', l: '#A3322A', r: '#8A2A22' }, { w: 0.6 });
    for (const x of [-12.5, -9, -7]) CQ.lantern2(g, g.p(x, 2.1, ZU + 3.6), 0.85);
  }, { name: 'bridge' });
  T.cast([-16, 20], (g) => { CQ.pots(g, [-15.5, 4, ZU], [-15.5, 36, ZU], 9, 51); }, { on: true, name: 'road pots' });
  T.obj([-36, 28], (g) => CQ.fig(g, -36, 28, { z: ZU, r: 5, h: 4 }), { on: true, name: 'road fig' });

  /* ---- the public lift on the wall's face, its cabin an actor ---- */
  const LX0 = -14, LX1 = -10, LY0 = 10, LY1 = 15;
  T.obj([LX0, LY0, LX1, LY1], (g) => {
    const posts = []; for (const [x, y] of [[LX1, LY0], [LX1, LY1], [LX0, LY1]]) { const a = g.p(x, y, 0), b = g.p(x, y, ZU + 5); posts.push(a[0], a[1], b[0], b[1]); }
    for (let z = 3; z < ZU + 5; z += 3) { const a = g.p(LX0, LY1, z), b = g.p(LX1, LY1, z), c = g.p(LX1, LY0, z); posts.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); }
    g.fill(K.on('L', LY1, LX0, LX1, 0, ZU + 5), 'rgba(196,214,222,0.3)'); g.fill(K.on('R', LX1, LY0, LY1, 0, ZU + 5), 'rgba(170,192,202,0.3)');
    g.segs2(posts, '#5A646C', 0.45);
    K.box(g, LX0 - 0.3, LY0 - 0.3, LX1 + 0.3, LY1 + 0.3, ZU + 5, ZU + 5.8, '#9A9D9A', { w: 0.6 });
    K.box(g, -14, LY0, LX0, LY1, ZU - 1, ZU, '#BDB6A6', { w: 0.5 });
  }, { under: 99, name: 'lift shaft' });
  T.actor({ grow: false, sample: 0.3, period: 24,
    at(t) { const c = t % 24, u = c < 5 ? 0 : c < 12 ? smooth((c - 5) / 7) : c < 17 ? 1 : 1 - smooth((c - 17) / 7); return { x: (LX0 + LX1) / 2, y: (LY0 + LY1) / 2, z: 0.2 + u * (ZU - 0.2), key: 'lift' }; },
    draw(g) { const B = K.rbox(g, 0, 0, 1.7, 2.2, 0, 0, 4.2, { t: '#D9DCDA', l: '#E9C04A', r: '#C9A03A' }, { w: 0.6 }); K.rwin(g, B, 'pv', -0.7, 0.7, 1.0, 3.6, { col: '#CFE0EA' }); K.person(g, 0.2, 0.6, 0, CQ.who(1520, { dir: 1, k: 0.85 })); K.rwin(g, B, 'pv', -0.7, 0.7, 1.0, 3.6, { col: 'rgba(207,224,234,0.4)', glint: true }); } });

  /* ---- the market on the lower street ---- */
  const goods = (cols) => (g2, D, L) => { for (let i = 0; i < 10; i++) g2.disc2(g2.p(-D * 0.4 + (i % 2) * 0.8, -L + 0.5 + i * 0.45, 2.9), 0.8, cols[i % cols.length]); };
  for (const [x, y, a, cols] of [[2, 14, '#3F7F4F', ['#8FBF73', '#5E8F4A', '#B5CF84']], [12, 14, '#C8392E', ['#E08A3C', '#E6C24F', '#C8392E']], [22, 14, '#3F6FA8', ['#E9E2CF', '#C9B48A', '#8FBF73']], [32, 14, '#C8392E', ['#C8392E', '#7A1E18', '#E6C24F']]]) T.obj([x, y], (g) => K.stall(g, x, y, { face: 'L', L: 3.2, D: 1.6, a, b: '#F3F1EA', goods: goods(cols) }), { name: 'market' });
  for (let i = 0; i < 6; i++) { const x = 1 + i * 5.6, y = 18.5 + (i % 2) * 1.5; T.cast([x, y], (g) => CQ.person(g, x, y, 0, (i % 3 ? CQ.who : CQ.elder)(1530 + i, { dir: 3, pose: 'hold', bowl: false })), { name: 'shopper' }); }
  T.cast([30, 26], (g) => CQ.porter(g, 30, 26, 0, CQ.bangWho(1540, { dir: 1, pose: 'stand' }), { load: ['#8FBF73', '#E08A3C'] }), { name: 'porter' });
  for (const [x, y] of [[26, 32], [-6, 32]]) T.obj([x, y], (g) => CQ.fig(g, x, y, { r: 5.6, h: 4.2 }), { name: 'fig' });
  T.cast([8, 29.5], (g) => CQ.mahjong(g, 8, 29.5, [1560, 1561, 1562, 1563]), { name: 'mahjong' });
  T.cast([-1, 27], (g) => CQ.noodleStall(g, -1, 27, 0, 1564, { col: '#3F8F5A' }), { name: 'noodles' });
  CQ.steamActor(T, -0.4, 26.6, 3.8, 0.9);
  T.cast([33, 30], (g) => { K.cyl(g, 33, 30, 1.4, 0, 2.2, { t: '#B07A5A', l: '#8A5E44', r: '#6E4A36' }, { n: 10, w: 0.5 }); for (const [dx, dy, d, s] of [[-2.4, 0, 0, 1570], [0, -2.4, 1, 1571]]) { CQ.stool(g, 33 + dx, 30 + dy, '#8A6446'); K.person(g, 33 + dx, 30 + dy, 1.3, CQ.elder(s, { dir: d, pose: 'sit', reach: [3, 2] })); } const c = g.p(33, 30, 2.3); g.disc2([c[0] - 0.8, c[1]], 0.5, '#F3F1EA'); g.disc2([c[0] + 1, c[1] + 0.3], 0.5, '#F3F1EA'); CQ.stool(g, 33, 32.4, '#8A6446'); K.person(g, 33, 32.4, 1.3, CQ.elder(1572, { dir: 3, pose: 'sit', reach: [2, 3] })); }, { name: 'tea' });
  T.cast([18, 9], (g) => { CQ.dog(g, 18, 9.5, 0, '#8A6446', -1); K.person(g, 20, 9, 0, CQ.who(1573, { dir: 2, pose: 'cheer', ph: 0.5, k: 0.72 })); K.person(g, 22, 10.5, 0, CQ.who(1574, { dir: 2, pose: 'wave', ph: 0.1, k: 0.75 })); }, { name: 'kids' });
  T.ground((g) => { CQ.pigeons(g, 14, 24, 7, 11); });

  /* ---- walkers ---- */
  CQ.walk(T, CQ.who(1550), [[-28, -14], [-28, 36]], 1.3, { z: ZU, phase: 0.1 });
  CQ.walk(T, CQ.who(1551, { umbrella: '#C8392E' }), [[-32, 36], [-32, -14]], 1.1, { z: ZU, phase: 0.5 });
  CQ.walk(T, CQ.who(1552), [[-16.5, -0.5], [TX0 + 0.5, -0.5], [-16.5, -0.5], [-16.5, 8]], 0.9, { z: ZU, phase: 0.3 });
  CQ.walk(T, CQ.who(1553), [[-8, 8], [36, 8]], 1.4, { phase: 0.2 });
  CQ.walk(T, CQ.who(1554), [[36, 24], [-9, 24], [-9, 17]], 1.2, { phase: 0.6 });
  CQ.walk(T, CQ.who(1555, { k: 0.76 }), [[-8, 17], [-8, 34], [20, 34]], 1.5, { phase: 0.4 });
  CQ.walk(T, CQ.who(1556), [[14, 6], [14, -0.5], [14, 6], [36, 6]], 1.0, { phase: 0.8 });
});
