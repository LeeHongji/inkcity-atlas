'use strict';
/* (0,100) Shibati: the Eighteen Steps, the old way down from the upper town to the Yangtze.
   What it is: a stone stairway that drops through the old quarter in short steep flights and landings, with houses
   of plaster and dark timber under grey tile roofs stepping down beside it, each on its own terrace of retaining wall.
   A paifang gate at the top carries the name.
   Levels: five terraces across the tile, z 18, 13.5, 9, 4.5 and 0 (the bottom one meets the Yangtze road); a flight in
   the middle of each terrace's far edge climbs to the one above. The top terrace starts 20 u in from the car street
   behind it (y +50) so its traffic is never hidden; along that street a strip of low shops stands at z 0.
   Who: bangbang porters climbing with loads on their bamboo poles while others come down empty-handed, a noodle stall
   with low stools on a landing, a teahouse with its doors open, a mahjong game on a terrace, an old man with his
   birdcage, washing on poles, a cat on a wall.
   Moving: the porters' climb (one carries a load all the way up, past the noodle stall, the teahouse and the mahjong),
   people going up and down, noodle steam, a game of shuttlecock-kicking (jianzi) on the bottom terrace. */
SF.tile('shibati', 0, 100, { rim: 46 }, function (T) {
  const H = 37, ZS = [18, 13.5, 9, 4.5, 0], YB = [-26, -12, 2, 16, 28, 37], CW = 4;
  const zAt = (y) => {                                           // the stair surface along the corridor
    for (let k = 1; k < 5; k++) { const ya = YB[k]; if (y >= ya && y < ya + 4.5) return ZS[k] + (ZS[k - 1] - ZS[k]) * (1 - (y - ya) / 4.5); }
    for (let k = 0; k < 5; k++) if (y >= YB[k] && y < YB[k + 1]) return ZS[k];
    return y < YB[0] ? 0 : 0;
  };

  T.ground(function (g) {
    K.slab(g, H, { top: '#D6CCB8' });
    g.fill(K.rect(-37, -37, 37, -26, 0), '#DAD3C4'); CQ.paving(g, -37, -37, 37, -26, 0, { dens: 0.4 });
  }, { rim: true });

  /* ---- the terraces with their flights ---- */
  // the four terraces are ONE terrain object, drawn back to front inside it: the walkers on them are then inside its
  // footprint and never make it a sprite (a lower, nearer terrace never truly hides someone on a higher one)
  T.obj([-37, YB[0], 37, YB[4]], (g) => {
    for (let k = 0; k < 4; k++) {
      const y0 = YB[k], y1 = YB[k + 1], z = ZS[k];
      CQ.terrace(g, -37, y0, 37, y1, 0, z, { top: k % 2 ? '#D6CEBD' : '#DCD5C5' });
      g.fill(K.rect(-CW, y0, CW, y1, z), '#CFC6B3');
      const j = []; for (let y = y0 + 1.5; y < y1; y += 1.5) { const a = g.p(-CW, y, z), b = g.p(CW, y, z); j.push(a[0], a[1], b[0], b[1]); } g.segs2(j, '#B3A991', 0.25);
      if (k > 0) { CQ.steps(g, -CW, y0, CW, y0 + 4.5, z, ZS[k - 1], 'y', { rise: 0.5, zb: z }); CQ.rail(g, 'R', CW + 0.2, y0, y0 + 4.5, z, { h: 1.0 }); }
    }
  }, { name: 'terraces' });
  // the last flight, from the bottom ground up onto terrace 3
  T.obj([-CW, 28, CW, 32.5], (g) => { CQ.steps(g, -CW, 28, CW, 32.5, 0, ZS[3], 'y', { rise: 0.5 }); }, { name: 'flight 4' });
  // the paifang gate over the top of the stairs
  T.obj([-6, -13.5, 6, -11], (g) => {
    const z = ZS[0];
    for (const x of [-5, 5]) K.box(g, x - 0.6, -12.9, x + 0.6, -11.7, z, z + 8, { t: '#B9B09C', l: '#9E9483', r: '#8A8070' }, { w: 0.6 });
    K.box(g, -6.4, -13.2, 6.4, -11.4, z + 8, z + 9.6, { t: '#5E6168', l: '#7A4A3A', r: '#5E382C' }, { w: 0.7 });
    K.gable(g, -7.6, -13.8, 7.6, -10.8, z + 9.6, 1.6, 'x', CQC.roof, { c: '#33302C', w: 0.7 });
    CQH.sign(g, 'L', -11.4, -4, 4, z + 6, z + 7.8, '#9E2A22', '十八梯', { ink: '#F2D27A' });
  }, { on: true, name: 'gate' });

  /* ---- houses stepping down either side ---- */
  const HS = [
    [0, -34, -19, -8, -13, 2, '#E3DCCB', ['小面', '#E6B84A']], [0, 8, -19, 30, -13, 2, CQC.plaster, null],
    [1, -36, -10, -26, -3, 2, '#D9CDB4', null], [1, -13, -10, -6, -3, 2, CQC.plaster, ['火锅', CQC.red]], [1, 8, -10, 20, -3, 2, '#E3DCCB', ['重庆', '#2F4A6B']],
    [2, -34, 3, -10, 10, 2, '#E7E1D2', ['茶馆', '#3F6B4E']], [2, 14, 4, 30, 11, 2, '#D9CDB4', null],
    [3, -32, 18, -12, 24, 1, CQC.plaster, null], [3, 20, 18, 34, 25, 2, '#E3DCCB', ['小面', '#D9732F']],
  ];
  for (const [k, x0, y0, x1, y1, n, col, sg] of HS) {
    const z = ZS[k];
    T.obj([x0, y0, x1, y1], (g) => CQ.oldhouse(g, { x0, y0, x1, y1, z, n, col, sign: sg, signFace: x0 > 0 ? 'L' : 'R', ridge: (x1 - x0) > (y1 - y0) ? 'x' : 'y' }), { on: true, name: 'house' });
  }
  // a stilt house hanging off the front of terrace 1, washing on bamboo poles
  T.obj([24, -3, 34, 6], (g) => { CQ.stilt(g, { x0: 24, y0: -3, x1: 34, y1: 6, zb: ZS[2], zf: ZS[1] + 0.3, n: 1, lanterns: true }); }, { on: true, name: 'stilt' });
  // the low shops along the car street at the bottom of the top terrace
  for (const [x0, x1, sg] of [[-34, -22, ['火锅', '#B8322A']], [-18, -6, ['小面', '#E6B84A']], [6, 18, ['茶馆', '#3F6B4E']], [22, 34, null]]) T.obj([x0, -35, x1, -28], (g) => CQ.block(g, { x0, y0: -35, x1, y1: -28, h: 5.2, gf: 3.6, col: '#E3DCCB', seed: x0 + 300, shop: sg || [null, '#7FA9C9'], tank: false }), { name: 'street shop' });
  for (const [x, y, k] of [[33, 14, 2], [-8, 26, 3], [10, 33, 4], [-30, -0.5, 1]]) T.obj([x, y], (g) => CQ.fig(g, x, y, { z: ZS[k], r: 4.8, h: 4.0 }), { on: true, name: 'fig' });

  /* ---- the noodle stall on terrace 3, the teahouse tables, mahjong on terrace 1 ---- */
  T.cast([8, 20], (g) => {
    const z = ZS[3];
    K.box(g, 6, 17.5, 10, 20.5, z, z + 2.6, { t: '#D9D3C4', l: '#C9463E', r: '#A9382F' }, { w: 0.6 });
    K.cyl(g, 8.8, 19, 1.0, z + 2.6, z + 3.8, { t: '#5A564E', l: '#9C9A94', r: '#7A7872' }, { w: 0.45, n: 10 });
    CQ.person(g, 11, 18.6, z, CQ.who(900, { dir: 2, pose: 'hold', top: '#F3F1EA', cap: '#F3F1EA' }));
  }, { on: true, name: 'noodles' });
  CQ.steamActor(T, 8.8, 19, ZS[3] + 4, 0.9);
  for (const [x, y, d, s] of [[6.5, 24, 3, 901], [9.5, 24.5, 2, 902], [12.5, 23.5, 2, 903], [14, 20, 2, 904]]) T.cast([x, y], (g) => g.at(x, y, ZS[3], (g2) => { CQ.stool(g2, 0, 0, s % 2 ? '#C9463E' : '#4F7FB8'); CQ.person(g2, 0, 0, 1.3, CQ.who(s, { dir: d, pose: 'sit', bowl: true, reach: [2.6, 3] })); }), { on: true, name: 'eater' });
  for (const [x, y, s] of [[-12, 12, 910], [-18, 12.5, 912]]) T.cast([x, y], (g) => g.at(x, y, ZS[2], (g2) => { CQ.stool(g2, -2.2, 0.4, '#8A6446'); K.person(g2, -2.2, 0.4, 1.3, CQ.elder(s, { dir: 0, pose: 'sit', reach: [3, 2] })); K.cyl(g2, 0, 0, 1.4, 0, 2.2, { t: '#B07A5A', l: '#8A5E44', r: '#6E4A36' }, { n: 10, w: 0.5 }); const c = g2.p(0, 0, 2.3); g2.disc2([c[0] - 1, c[1]], 0.5, '#F3F1EA'); g2.disc2([c[0] + 1.2, c[1] + 0.4], 0.5, '#F3F1EA'); CQ.stool(g2, 0.6, 2.3, '#8A6446'); K.person(g2, 0.6, 2.3, 1.3, CQ.elder(s + 1, { dir: 3, pose: 'sit', reach: [2, 3] })); }), { on: true, name: 'tea' });
  T.cast([-19, -3.5], (g) => g.at(-19, -3.5, ZS[1], (g2) => CQ.mahjong(g2, 0, 0, [920, 921, 922, 923])), { on: true, name: 'mahjong' });
  T.cast([10, 13], (g) => CQ.person(g, 10, 13, ZS[2], CQ.elder(925, { dir: 1, cage: true, pose: 'hold', bird: '#E6C24F' })), { on: true, name: 'birdcage' });
  T.cast([-8, 14], (g) => { const c = g.p(-8, 14, ZS[2]); g.fill2([[c[0] - 1.8, c[1]], [c[0] + 1.6, c[1]], [c[0] + 1.4, c[1] - 1.6], [c[0] - 1.2, c[1] - 1.8]], '#E08A3C', true); g.disc2([c[0] + 1.6, c[1] - 2.2], 1.0, '#E08A3C'); g.fill2([[c[0] + 1.0, c[1] - 3.0], [c[0] + 1.4, c[1] - 3.8], [c[0] + 1.7, c[1] - 3.0]], '#E08A3C', true); g.segs2([c[0] - 1.8, c[1] - 0.6, c[0] - 3.2, c[1] - 2.4], '#E08A3C', 0.7); }, { on: true, name: 'cat' });
  // kids kicking a shuttlecock on the bottom ground
  T.actor({ sample: 5, period: 10, at(t) { const f = Math.floor(t * 4) % 8; return { x: -16, y: 33, key: f, f }; },
    draw(g, st) { K.person(g, -3, 0, 0, CQ.who(930, { dir: 0, pose: 'cheer', ph: st.f / 8, k: 0.8 })); K.person(g, 3, 0, 0, CQ.who(931, { dir: 2, pose: 'walk', ph: st.f / 8, k: 0.8 })); const c = g.p(0, 0, 3 + Math.abs(Math.sin(st.f * Math.PI / 4)) * 5); g.disc2(c, 0.6, '#3A3530'); g.fill2([[c[0] - 0.8, c[1] - 0.4], [c[0], c[1] - 2.2], [c[0] + 0.8, c[1] - 0.4]], '#D23B2F', true); } });

  /* ---- more life: a noodle stall at the bottom, a porter resting, pots and washing on the terraces, blossom ---- */
  T.cast([24, 31], (g) => CQ.noodleStall(g, 24, 31, 0, 950, { col: '#3F8F5A' }), { name: 'bottom noodles' });
  CQ.steamActor(T, 24.6, 30.6, 3.8, 0.9);
  T.cast([-28, 33], (g) => { K.box(g, -30, 32.4, -26, 33.6, 0, 1.3, '#BDB5A3', { w: 0.5 }); K.person(g, -28, 33, 1.3, CQ.bangWho(951, { dir: 1, pose: 'sit' })); g.line2([g.p(-25.5, 31.5, 0), g.p(-24.8, 35, 6.5)], { w: 0.7, c: '#B8A060', boil: false }); CQ.dog(g, -23, 35.5, 0, '#C9A26B', 1); }, { name: 'porter rest' });
  for (let k = 0; k < 4; k++) { const y = YB[k + 1] - 0.7, z = ZS[k]; for (const [x0, x1] of [[-36, -6], [6, k === 1 ? 22 : 36]]) T.cast([(x0 + x1) / 2, y], (g) => CQ.pots(g, [x0, y, z], [x1, y, z], 6, k * 7 + (x0 > 0 ? 1 : 2)), { on: true, name: 'pots' }); }
  T.cast([-22, 10.6], (g) => CQ.washing(g, [-33, 10.6, ZS[2] + 4.4], [-12, 10.6, ZS[2] + 4.6], 61), { on: true, name: 'washing' });
  T.cast([20, -2.6], (g) => CQ.washing(g, [9, -2.6, ZS[1] + 4.4], [19, -2.6, ZS[1] + 4.4], 62), { on: true, name: 'washing' });
  T.cast([-20, -12.6], (g) => CQ.washing(g, [-33, -12.6, ZS[0] + 4.4], [-10, -12.6, ZS[0] + 4.4], 63), { on: true, name: 'washing' });
  T.cast([-27, 26.5], (g) => { CQ.person(g, -28.5, 26, ZS[3], CQ.elder(955, { dir: 0, pose: 'hold' })); CQ.person(g, -26.5, 27, ZS[3], CQ.elder(956, { dir: 2, pose: 'stand' })); CQ.person(g, -25, 25.6, ZS[3], CQ.who(957, { dir: 2, pose: 'hold', bag: '#C8392E' })); CQ.dog(g, -23, 27, ZS[3], '#8A6446', -1); }, { on: true, name: 'chat' });
  T.cast([16, 0], (g) => { K.person(g, 15, -0.5, ZS[1], CQ.who(958, { dir: 1, pose: 'cheer', ph: 0.4, k: 0.72 })); K.person(g, 17.5, 0.5, ZS[1], CQ.who(959, { dir: 2, pose: 'wave', ph: 0.2, k: 0.74 })); }, { on: true, name: 'kids' });
  T.cast([-24, 14], (g) => { const z = ZS[2]; g.at(-24, 14, z, (g2) => { CQ.stool(g2, -2, 0, '#C9463E'); K.person(g2, -2, 0, 1.3, CQ.elder(960, { dir: 0, pose: 'sit', reach: [3, 2] })); K.box(g2, -0.8, -0.8, 0.8, 0.8, 0, 2.0, '#8A6446', { w: 0.5 }); CQ.stool(g2, 2, 0.5, '#4F7FB8'); K.person(g2, 2, 0.5, 1.3, CQ.elder(961, { dir: 2, pose: 'sit', reach: [3, 2] })); }); }, { on: true, name: 'xiangqi' });
  for (const [x, y, k] of [[-33, 14, 2], [-16, 26, 3]]) T.obj([x, y], (g) => CQ.bloom(g, x, y, { z: ZS[k], r: 3.4 }), { on: true, name: 'blossom' });

  /* ---- the climb: porters up with loads, people up and down ---- */
  const up = [[0.8, 36], [0.8, -24]], dn = [[-1.8, -24], [-1.8, 36]];
  const zf = (x, y) => zAt(y);
  CQ.walk(T, CQ.bangWho(940), up.concat([[0.8, -24.5], [-2.6, -24.5], [-2.6, 36], [-2.6, 36.5]]), 0.75, { z: zf, porter: { load: ['#C9B48A', '#7A8A5A'] }, phase: 0.02 });
  CQ.walk(T, CQ.bangWho(941), up.concat([[0.8, -24.5], [-2.6, -24.5], [-2.6, 36], [-2.6, 36.5]]), 0.7, { z: zf, porter: { load: ['#E9E2CF', '#C9584B'] }, phase: 0.55 });
  CQ.walk(T, CQ.who(942), dn.concat([[2.6, 36], [2.6, -24]]), 1.0, { z: zf, phase: 0.3 });
  CQ.walk(T, CQ.elder(943), dn.concat([[2.4, 36], [2.4, -24]]), 0.6, { z: zf, phase: 0.75 });
  CQ.walk(T, CQ.who(944, { umbrella: '#3F6FA8' }), dn.concat([[1.8, 36], [1.8, -24]]), 0.9, { z: zf, phase: 0.1 });
  CQ.walk(T, CQ.who(945), [[-34, -16], [-8, -16]], 1.3, { z: ZS[0], phase: 0.2 });
  CQ.walk(T, CQ.who(946), [[34, -24], [-34, -24]], 1.1, { z: ZS[0], phase: 0.6 });
});
