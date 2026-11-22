'use strict';
/* (100,0) Hongyadong: the stilt-house complex hung down the cliff above the Jialing.
   What it is: eleven storeys of timber-fronted halls stacked down the cliff face from Cangbai Road to the riverside,
   each tier set forward and lower than the one behind, every floor wrapped in a balcony with red lanterns, the
   layered grey-tiled eaves of a diaojiaolou, the lowest tier standing on timber stilts. Here four tiers step down
   from z 30 to the riverside plaza at z 0; the top road (Cangbai Road) runs on a terrace at z 22 behind them and walks
   straight into the top tier: the 11th floor is the street's ground floor.
   Levels: riverside plaza z 0 (meets the Jialing road); the terrace z 22 with a retaining wall and a switchback stair
   on its front (+y) face; the tiers' roofs are viewing terraces at 23, 15 and 8.
   Who: tourists on Cangbai Road and the roof terraces, photographers at the rails, a tanghulu seller, an ice-jelly
   (bingfen) stall, a porter resting at the stair foot, a family on the riverside plaza, lanterns everywhere.
   Moving: walkers on the road and the stair, people on the roof terraces, lantern glow; the Qiansimen bridge and its
   traffic beside it (streets). Kept clear of the car street behind (y -50): the terrace starts 24 u in from its lane. */
SF.tile('hongyadong', 100, 0, { rim: 30 }, function (T) {
  const H = 37, ZR = 22, WOOD = '#4F372B', WOODL = '#634536', ROOF = '#4E5157';

  T.ground(function (g) {
    K.slab(g, H, { top: '#D9CDB8' });
    g.fill(K.rect(-2, 26, 37, 37), '#D8CFBE'); CQ.paving(g, -2, 26, 37, 37, 0);
    g.fill(K.rect(30, -30, 37, 26), '#DED6C6'); CQ.paving(g, 30, -30, 37, 26, 0, { dens: 0.3 });
    // a strip of dark slate along the stilts
    g.fill(K.rect(25, -14, 30.5, 25), '#BEB5A3');
  }, { rim: true });

  /* ---- the Cangbai Road terrace and its stair ---- */
  T.obj([-34, -20, -2, 30], (g) => {
    CQ.terrace(g, -34, -20, -2, 30, 0, ZR, { top: '#D3CBBB' });
    g.fill(K.rect(-22, -20, -10, 30, ZR), '#C4BCAC');                           // the road's carriageway
    CQ.rail(g, 'L', 29.6, -34, -2, ZR, { h: 1.4 });
    // the terrace front wall: a slogan board and lamps
    CQH.sign(g, 'L', 30, -30, -12, ZR - 7, ZR - 3, '#9E2A22', '洪崖洞', { ink: '#F2D27A' });
    CQ.railLamps(g, [-33, 29.6, ZR + 1.5], [-3, 29.6, ZR + 1.5], 7.5, { base: ZR });          // lamps on the road's railing (night)
  }, { name: 'cangbai road' });
  T.obj([-34, 30, -4, 35], (g) => {
    // switchback: the lower flight climbs towards -x from x -4 (z 0) to x -19 (z 11), the upper from there to x -34
    CQ.steps(g, -19, 30.2, -4, 32.5, 0, 11, 'x', { rise: 0.6 });
    g.fill(K.rect(-22, 30.2, -19, 35, 11), '#D9D2C2'); K.box(g, -22, 32.5, -19, 35, 0, 11, { t: '#D9D2C2', l: CQC.wall, r: CQC.wallD }, { w: 0.6 });
    CQ.steps(g, -34, 32.5, -22, 35, 11, ZR, 'x', { rise: 0.6, zb: 0 });
    CQ.rail(g, 'L', 34.9, -34, -22, ZR - 11 + 11, { h: 1.2 }); CQ.rail(g, 'L', 32.4, -19, -4, 0, { h: 1.2 });
    for (const [x, y, z] of [[-4.5, 32.4, 1.3], [-19, 32.4, 12.3], [-22, 34.9, 12.3], [-33.5, 34.9, 23.3]]) g.glow('lamp', x, y, z, { r: 0.9, base: z - 1.3 });   // a lamp at each turn of the stair (night)
  }, { name: 'stair' });
  for (const [x0, y0, x1, y1, sg, col] of [[-34, -18, -25, -8, ['茶馆', '#3F6B4E'], CQC.plaster], [-34, -6, -25, 4, ['火锅', CQC.red], '#E3DCCB'], [-34, 6, -25, 16, ['小面', '#D9732F'], CQC.plaster], [-34, 18, -25, 27, null, '#D9CDB4']]) {
    T.obj([x0, y0, x1, y1], (g) => CQ.oldhouse(g, { x0, y0, x1, y1, z: ZR, n: 2, sign: sg, signFace: 'R', col, ridge: 'y' }), { on: true, name: 'road house' });
  }
  T.obj([-7, -16], (g) => CQ.fig(g, -7, -16, { z: ZR, r: 5, h: 4.2 }), { on: true });

  /* ---- the tiers, back to front ---- */
  const tier = (g, x0, y0, x1, y1, z1, o) => {
    o = o || {}; const st = 2.8, zb = o.zb || 0;
    g.boilP = 0.18;
    const i0 = g.cmds.length;
    K.box(g, x0, y0, x1, y1, zb, z1, { t: '#C9C1B0', l: WOODL, r: WOOD }, { w: 0.85 });
    CQ.nmark(g, i0, WOODL, { nc: '#C47A34' }); CQ.nmark(g, i0, WOOD, { nc: '#94562A' });   // at night: lit gold from top to bottom
    // floors: warm windows in timber frames, a balcony band every floor, lanterns on the river face
    const wins = [], fr = [], lan = [];
    for (let z = zb + (o.stilt ? 3.2 : 0.5); z + 2 < z1 - 0.6; z += st) {
      for (let y = y0 + 1.2; y < y1 - 1.6; y += 2.6) { wins.push(K.on('R', x1 + 0.03, y, y + 1.6, z + 0.5, z + 2.0)); }
      for (let x = x0 + 1.0; x < x1 - 1.4; x += 2.6) { wins.push(K.on('L', y1 + 0.03, x, x + 1.6, z + 0.5, z + 2.0)); }
      for (const [a, b] of [[g.p(x1 + 0.7, y0, z), g.p(x1 + 0.7, y1, z)], [g.p(x1 + 0.7, y0, z + 1.1), g.p(x1 + 0.7, y1, z + 1.1)], [g.p(x0, y1 + 0.7, z + 1.1), g.p(x1 + 0.7, y1 + 0.7, z + 1.1)]]) fr.push(a[0], a[1], b[0], b[1]);
      for (let y = y0 + 0.6; y < y1; y += 1.3) { const a = g.p(x1 + 0.7, y, z), b = g.p(x1 + 0.7, y, z + 1.1); fr.push(a[0], a[1], b[0], b[1]); }
      for (let y = y0 + 2; y < y1 - 1; y += 4.4) lan.push(g.p(x1 + 0.9, y, z + 2.2));
    }
    for (const q of wins) { g.fill(q, h2(Math.round(q[0][0] * 3 + q[0][1] * 7 + q[0][2] * 11), 5) < 0.7 ? '#F4C96A' : '#E9DEC0'); const P = g.P(q); fr.push((P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2, (P[2][0] + P[3][0]) / 2, (P[2][1] + P[3][1]) / 2); }
    g.segs2(fr, '#3E2A20', 0.3); g.cmds[g.cmds.length - 1].nc = '#F2B656';      // the balconies traced in gold light
    for (const c of lan) CQ.lantern2(g, c, 0.85, null, { halo: 0.7 });
    // layered eaves: a grey tile skirt round the two faces we see, every two floors
    let kk = 0;
    for (let z = zb + st; z < z1 - 1; z += st, kk++) {
      const d = kk % 2 ? 1.0 : 1.7, sk = [[x0, y1, z], [x1, y1, z], [x1, y0, z], [x1 + d, y0 - 0.6, z - d * 0.6], [x1 + d, y1 + d, z - d * 0.6], [x0 - 0.6, y1 + d, z - d * 0.6]];
      g.fill([sk[0], sk[1], sk[4], sk[5]], ROOF); g.mark({ nc: '#5C4A3C' }); g.fill([sk[1], sk[2], sk[3], sk[4]], shade(ROOF, 0.12)); g.mark({ nc: '#4A3C32' });   // lit warm from below at night
      const tl = []; for (let y = y0; y < y1; y += 0.7) { const a = g.p(x1, y, z), b = g.p(x1 + d, y, z - d * 0.6); tl.push(a[0], a[1], b[0], b[1]); } g.segs2(tl, '#3E4045', 0.22);
      const iE = g.cmds.length;
      g.line([sk[5], sk[4], sk[3]], { w: 0.6, c: '#2E2A26', boil: false });
      const c = g.p.apply(g, sk[4]); g.line2([c, [c[0] + 0.6, c[1] - 1.6]], { w: 0.55, c: '#2E2A26', boil: false, ext: 0 });
      CQ.nmark(g, iE, null, { nc: CQ.GOLD }, true);                              // every eave edge a line of gold light
    }
    // the roof: a broad grey gable along y with upturned corners, a viewing terrace on lower tiers
    if (o.flat) { g.fill(K.rect(x0, y0, x1, y1, z1), '#CFC5B2'); g.mark({ nc: '#8E7458' }); CQ.rail(g, 'R', x1 - 0.3, y0, y1, z1, { h: 1.2, col: '#3E2A20' }); CQ.rail(g, 'L', y1 - 0.3, x0, x1, z1, { h: 1.2, col: '#3E2A20' });
      // little pavilions on the roof terrace, at the far end and the near end
      for (const py of [y0 + 1.5, y1 - 5.5]) { const px0 = x0 + 0.8, px1 = Math.min(x1 - 1, x0 + 5); const posts = []; for (const [a, b] of [[px0, py], [px1, py], [px1, py + 4], [px0, py + 4]]) { const p = g.p(a, b, z1), q = g.p(a, b, z1 + 3.6); posts.push(p[0], p[1], q[0], q[1]); } g.segs2(posts, '#3E2A20', 0.6);
        const iH = g.cmds.length; K.hip(g, px0 - 1.2, py - 1.2, px1 + 1.2, py + 5.2, z1 + 3.6, 2.2, ROOF, { c: '#2E2A26' }); CQ.nmark(g, iH, null, { nc: CQ.GOLD }, true); CQ.lantern2(g, g.p(px1, py + 4, z1 + 3.2), 0.9); }
    }
    else { const iG = g.cmds.length; K.gable(g, x0 - 1.2, y0 - 1.2, x1 + 1.2, y1 + 1.2, z1, o.rh || 4, 'y', ROOF, { c: '#33302C', w: 0.8 }); CQ.nmark(g, iG, '#33302C', { nc: CQ.GOLD }, true); const s = []; for (let y = y0 - 1; y < y1 + 1.2; y += 0.8) { const a = g.p(x1 + 1.2, y, z1), b = g.p((x0 + x1) / 2, y, z1 + (o.rh || 4)); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#4A4D52', 0.25); }
    if (o.sign) CQH.sign(g, 'R', x1 + 0.1, o.sign[0], o.sign[1], o.sign[2], o.sign[3], '#9E2A22', '洪崖洞', { ink: '#F2D27A', vert: true });
    // the floodlit glow up the faces (night)
    for (let z = zb + 3; z < z1 - 1; z += 7) { g.glow('lantern', x1 + 0.5, (y0 + y1) / 2, z, { r: 3.6, col: '#FFB347' }); g.glow('lantern', (x0 + x1) / 2, y1 + 0.5, z, { r: 2.4, col: '#FFB347' }); }
  };
  T.obj([-2, -16, 8, 28], (g) => {
    tier(g, -2, -16, 8, 28, 30, { rh: 4.6 });
    CQH.sign(g, 'L', 28.1, 0.6, 4.4, 9, 27, '#9E2A22', '洪崖洞', { ink: '#F2D27A', vert: true });
    // the top tier opens onto Cangbai Road: a doorway at road level on its back, a gate arch with lanterns over the road
    CQ.lantern2(g, g.p(-1.5, 2, ZR + 3.6), 1.4); CQ.lantern2(g, g.p(-1.5, 9, ZR + 3.6), 1.4);
  }, { name: 'tier 1' });
  T.obj([8, -14, 17, 27], (g) => tier(g, 8, -14, 17, 27, 23, { flat: true }), { name: 'tier 2' });
  T.obj([17, -12, 25, 26], (g) => tier(g, 17, -12, 25, 26, 15, { flat: true }), { name: 'tier 3' });
  T.obj([25, -10, 30.5, 24.5], (g) => {
    // the lowest tier on timber stilts: posts and braces, the hall above them
    const posts = [];
    for (let y = -9.5; y <= 24; y += 3.4) for (const x of [25.4, 30.1]) { const a = g.p(x, y, 0), b = g.p(x, y, 3.2); posts.push(a[0], a[1], b[0], b[1]); }
    for (let y = -9.5; y < 24 - 3.4; y += 3.4) { const a = g.p(30.1, y, 0.2), b = g.p(30.1, y + 3.4, 3.0); posts.push(a[0], a[1], b[0], b[1]); }
    g.segs2(posts, CQC.timberD, 0.8);
    tier(g, 25, -10, 30.5, 24.5, 9, { zb: 3.2, flat: true, stilt: false });
  }, { name: 'tier 4' });

  /* ---- people on the roof terraces, the road, the riverside ---- */
  const at = (z) => (x, y, s, d, o) => T.cast([x, y], (g) => CQ.person(g, x, y, z, CQ.who(s, Object.assign({ dir: d }, o || {}))), { on: true, name: 'roof person' });
  const r2 = at(23), r3 = at(15), r4 = at(9);
  r2(15.5, -6, 610, 0, { pose: 'hold', phone: true }); r2(15.6, 4, 611, 0); r2(15.2, 14, 612, 0, { pose: 'wave', ph: 0.4 }); r2(11, 24, 613, 1, { pose: 'hold', phone: true });
  r3(23.6, -4, 614, 0, { pose: 'hold' }); r3(23.4, 8, 615, 0, { umbrella: '#C8392E', pose: 'hold' }); r3(20, 22, 616, 1); r3(23.8, 18, 617, 0, { pose: 'hold', phone: true });
  r4(29.2, 0, 618, 0, { pose: 'hold' }); r4(29.4, 12, 619, 0); r4(27, 21, 620, 1, { pose: 'hold', phone: true });
  // Cangbai Road: crowds, a tanghulu seller with his straw post, a man selling bingfen from a cart
  for (let i = 0; i < 10; i++) { const x = -20 + (i % 3) * 3.4 + h1(i * 7) * 1.2, y = -12 + Math.floor(i / 3) * 9 + h1(i * 3) * 2; T.cast([x, y], (g) => CQ.person(g, x, y, ZR, CQ.who(630 + i, { dir: [0, 1, 2, 3][i % 4], pose: i % 3 ? 'stand' : 'hold', phone: i % 4 === 1 })), { on: true, name: 'road crowd' }); }
  T.cast([-6, 6], (g) => { const r = CQ.person(g, -6, 6, ZR, CQ.elder(650, { dir: 1, pose: 'hold' })); const h = r.hands[0]; g.segs2([h[0], h[1], h[0], h[1] - 12], '#B8A060', 0.5); g.fill2(arcPts(h[0], h[1] - 13, 2.4, 0, TAU, 10), '#D9C68A', true); for (let k = 0; k < 9; k++) { const a = k * 0.7; g.disc2([h[0] + Math.cos(a) * 2.6, h[1] - 13 + Math.sin(a) * 2.2], 0.6, '#C8392E'); } }, { on: true, name: 'tanghulu' });
  T.cast([-6, 20], (g) => { K.box(g, -7.2, 18.6, -4.8, 21.4, ZR, ZR + 2.4, { t: '#F3F1EA', l: '#3F7FB8', r: '#2F6A9E' }, { w: 0.5 }); CQ.person(g, -8.6, 20, ZR, CQ.who(651, { dir: 0, pose: 'hold', top: '#F3F1EA' })); CQ.person(g, -3.4, 22.4, ZR, CQ.who(652, { dir: 2, pose: 'hold', bowl: true })); }, { on: true, name: 'bingfen' });
  // the riverside plaza: a family, a resting porter, a photographer, red lantern posts
  T.cast([4, 33], (g) => { const w = CQ.bangWho(653, { dir: 1, pose: 'sit' }); K.box(g, 3, 32.4, 6, 33.6, 0, 1.3, '#BDB5A3', { w: 0.5 }); K.person(g, 4.5, 33, 1.3, w); g.line2([g.p(6.5, 31, 0), g.p(7.5, 35, 6.5)], { w: 0.7, c: '#B8A060', boil: false }); }, { name: 'porter rest' });
  T.cast([16, 32], (g) => { CQ.person(g, 16, 32, 0, CQ.who(654, { dir: 3, pose: 'hold', phone: true })); CQ.person(g, 17.6, 33.2, 0, CQ.who(655, { dir: 3, k: 0.72, pose: 'wave', ph: 0.1 })); CQ.person(g, 14.4, 33.6, 0, CQ.who(656, { dir: 3 })); }, { name: 'family' });
  for (const y of [-26, -12, 2, 16]) T.obj([34.5, y], (g) => { const b = g.p(34.5, y, 0), t = g.p(34.5, y, 6); g.fill2([[b[0] - 0.4, b[1]], [b[0] + 0.4, b[1]], [t[0] + 0.3, t[1]], [t[0] - 0.3, t[1]]], '#3E2A20'); CQ.lantern2(g, [t[0] + 1.6, t[1] + 2.2], 1.1); g.segs2([t[0], t[1], t[0] + 1.6, t[1]], '#3E2A20', 0.4); g.glow2('lamp', [t[0] + 1.6, t[1] + 2.2], b, { r: 1.2 }); }, { name: 'lantern post' });

  /* ---- walkers: the road, the stair, the plaza ---- */
  CQ.walk(T, CQ.who(660), [[-16, -18], [-16, 28]], 1.3, { z: ZR, phase: 0.1 });
  CQ.walk(T, CQ.who(661, { umbrella: '#E6C24F' }), [[-13, 28], [-13, -18]], 1.2, { z: ZR, phase: 0.6 });
  CQ.walk(T, CQ.who(662), [[-19, 28], [-19, -18]], 1.4, { z: ZR, phase: 0.35 });
  const zs = (x, y) => y < 32.5 ? clamp((-4 - x) / 15, 0, 1) * 11 : 11 + clamp((-22 - x) / 12, 0, 1) * 11;
  CQ.walk(T, CQ.who(663), [[-3, 31.3], [-19, 31.3], [-20.5, 33.7], [-33.5, 33.7], [-20.5, 33.7], [-19, 31.3]], 1.0, { z: zs, phase: 0.2 });
  CQ.walk(T, CQ.bangWho(664), [[-3, 31.4], [-19, 31.4], [-20.5, 33.8], [-33.5, 33.8], [-20.5, 33.8], [-19, 31.4]], 0.8, { z: zs, phase: 0.7, porter: { load: ['#B9A27D', '#C9584B'] } });
  CQ.walk(T, CQ.who(665), [[0, 29], [33, 29], [33, -20], [33, 29]], 1.4, { phase: 0.4 });
  CQ.walk(T, CQ.who(666), [[33, -26], [33, 22]], 1.1, { phase: 0.1 });
});
