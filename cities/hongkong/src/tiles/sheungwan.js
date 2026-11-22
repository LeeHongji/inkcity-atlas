'use strict';
/* (100,0) Sheung Wan, the old western waterfront (land to the seawall, local y 24; the map's west edge on +x).
   What is there: Western Market, an Edwardian market hall of red brick banded with cream stone, corner towers with
   little hipped roofs; the twin dark towers of the Shun Tak Centre with their red bands, over the Macau ferry
   terminal; Wing Lok Street's dried-seafood shops (海味), tong lau with verandahs and their goods out on the pavement
   in baskets and sacks (scallops, mushrooms, fish maw, abalone tins), a 士多 corner store; a little sitting-out garden
   where old men crowd round a game of Chinese chess under a banyan; the seawall where people fish at dusk.
   Who: shopkeepers weighing goods, a porter with a hand trolley, the chess players and kibitzers, anglers. */
SF.tile('sheungwan', 100, 0, { rim: 26 }, function (T) {
  const H = 37, I = HT.HAR.I;
  T.ground(function (g) {
    HK.ground(g, -H, -H, H, I, HK.C.pave, { cut: 'x' });
    HK.paving(g, -H, -H, H, I, { step: 2.4 });
    // Wing Lok Street: a narrow lane along x
    g.fill(K.rect(-H, -6, H, 2), HK.C.asph); g.line([[-H, -6, 0], [H, -6, 0]], { w: 0.5, c: '#9E9A90', boil: false }); g.line([[-H, 2, 0], [H, 2, 0]], { w: 0.5, c: '#9E9A90', boil: false });
    for (let x = -H + 2; x < H - 3; x += 7) g.line([[x, -2, 0], [x + 3.2, -2, 0]], { c: HK.C.line, w: 0.7, boil: false });
    // the sitting-out garden
    g.fill(K.rect(-34, 6, -12, 20), '#E2D9C2'); HK.paving(g, -34, 6, -12, 20, { step: 1.6, joint: '#CFC3A6' });
    g.fill(K.rect(-H, 20, H, I), '#E9E3D4');
  }, { rim: true });

  /* ---- Western Market ---- */
  T.obj([-35, -35, -13, -15], (g) => {
    g.boilP = 0.3; const i0 = g.cmds.length;
    const BR = { t: '#C98A6A', l: '#C2694E', r: '#A65A42' }, ST = { t: '#ECE6D6', l: '#F3EEE0', r: '#DCD5C1' };
    K.box(g, -34, -34, -14, -16, 0, 10.6, BR, { w: 0.85 });
    for (const z of [0, 3.6, 7.2, 10.0]) K.box(g, -34.1, -34.1, -13.9, -15.9, z, z + 0.6, ST, { w: 0.35, boil: false });
    for (const [f, p, a0, a1] of [['L', -16, -34, -14], ['R', -14, -34, -16]]) for (let a = a0 + 2.4; a < a1 - 2.4; a += 2.6) { K.win(g, f, p + 0.02, a, a + 1.4, 4.4, 6.8, { style: 'navy', arch: true, w: 0.3 }); K.win(g, f, p + 0.02, a, a + 1.4, 0.8, 3.3, { style: 'navy', arch: true, w: 0.3 }); }
    for (const [x, y] of [[-34, -34], [-14, -34], [-14, -16], [-34, -16]]) { K.box(g, x - 1.6, y - 1.6, x + 1.6, y + 1.6, 0, 12.6, BR, { w: 0.7 }); for (const z of [3.6, 7.2, 10.6]) K.box(g, x - 1.7, y - 1.7, x + 1.7, y + 1.7, z, z + 0.5, ST, { w: 0.3, boil: false }); K.hip(g, x - 2, y - 2, x + 2, y + 2, 12.6, 2.0, '#8E9AA3', { w: 0.55 }); }
    K.hip(g, -33.6, -33.6, -14.4, -16.4, 10.6, 3.2, '#B9654C', { w: 0.7, ridge: 8 });
    const i1 = g.cmds.length; K.sign(g, 'L', -15.9, -29, -19, 8.0, 9.2, '#2C2622', 'WESTERN MARKET', { ink: '#E6C24F', w: 0.3 });
    // at night the brick and its stone bands are floodlit warm, its name lit
    const FL = new Set(['#C98A6A', '#C2694E', '#A65A42', '#ECE6D6', '#F3EEE0', '#DCD5C1', '#B9654C', '#8E9AA3']);
    HK.nite(g, i0, { nc: (c) => (FL.has(c) ? mix(mix(nightColour(c), c, 0.58), '#FFC890', 0.16) : undefined) }); HK.nite(g, i1, { nc: true });
    for (const [x, y, z, r] of [[-24, -15.8, 2.0, 3.0], [-14, -15.8, 7.0, 2.4], [-34, -15.8, 7.0, 2.4], [-13.8, -25, 2.0, 2.6]]) g.glow('lantern', x, y, z, { r, col: '#FFD9A0' });
  }, { name: 'western market' });

  /* ---- the Shun Tak Centre: two dark towers with red bands ---- */
  for (const [x0, x1, y0, y1, h] of [[6, 18, -35, -23, 36], [22, 34, -33, -21, 32]]) T.obj([x0, y0, x1, y1], (g) => {
    HK.tower(g, x0, y0, x1, y1, 0, h, { col: '#4A5560', tone: { t: '#3A444E', l: '#4E5A66', r: '#3A444E' }, fl: 2.0, ml: 2.0, lit: 0.3, grid: '#2E363E', seed: x0, nwin: x0 === 6 ? { L: 0.25, R: 0.62 } : 0.62 });
    for (const z of [h - 4, h - 2.2]) K.box(g, x0 - 0.1, y0 - 0.1, x1 + 0.1, y1 + 0.1, z, z + 0.9, { t: '#B8322A', l: '#C8372D', r: '#A42C24' }, { w: 0.4, boil: false });
    if (x0 === 6) HK.snowflakes(g, 'L', y1, [[9, 25, 2.4], [14.6, 19, 2.0], [9.6, 12.6, 1.7], [14.8, 7.6, 1.4], [11.8, 30.4, 1.2]]);   // December: snowflakes of light on its face to the harbour
  }, { name: 'shun tak' });
  T.obj([4, -20, 36, -10], (g) => { K.box(g, 4, -20, 36, -10, 0, 5.2, { t: '#D9D4C8', l: '#E6E1D5', r: '#CFC9BC' }, { w: 0.8 }); g.fill(K.on('L', -9.98, 5, 35, 1.0, 4.2), '#93AEBD'); g.mark({ nc: '#FFE6B4', spill: true }); const i0 = g.cmds.length; K.sign(g, 'L', -9.95, 8, 32, 4.3, 5.1, '#2F4F6E', 'MACAU FERRY TERMINAL', { w: 0.3 }); HK.nite(g, i0, { nc: true }); }, { name: 'ferry terminal' });

  /* ---- Wing Lok Street: dried-seafood tong lau along the far side of the lane, goods out on the pavement ---- */
  const SHOPS = [[-36, -26, '海味', '#8E2F2F'], [-25, -15, '海味', '#2F4F6E'], [-14, -4, '士多', '#2F6B4A'], [-3, 8, '海味', '#B8322A']];
  // (the lane's far side: tong lau x -36..8 between the market and the lane; they face the lane, +y)
  SHOPS.forEach(([x0, x1, str, bc], i) => T.obj([x0, -14, x1, -6.2], (g) => {
    HK.tonglau(g, x0, -14, x1, -8.8, { floors: 3, col: ['#E2D3B8', '#D3DDE8', '#E8D9C0', '#CFE0D2'][i], d: 2.4, shopCol: '#E9C98A' });
    HK.board(g, 'L', -8.8 + 0.05, x0 + 0.6, x1 - 0.6, 3.9, 4.55, bc, str, { vert: false });
  }, { name: 'dried seafood shop' }));
  // baskets and sacks on the pavement in front of the shops
  const BASK = ['#E9C98A', '#C9A26B', '#8E5E3A', '#F3EBD8', '#6E4A30'];
  for (let k = 0; k < 14; k++) { const x = -34.5 + k * 3.1, y = -5.6 + (k % 2) * 0.4; T.obj([x, y], (g) => { const c = g.p(x, y, 0); g.fill2([[c[0] - 1.6, c[1] - 1.6], [c[0] + 1.6, c[1] - 1.6], [c[0] + 1.3, c[1] + 0.4], [c[0] - 1.3, c[1] + 0.4]], '#A88654', true); g.fill2(arcPts(c[0], c[1] - 1.7, 1.6, Math.PI, TAU, 8).map((p) => [p[0], c[1] - 1.7 + (p[1] - c[1] + 1.7) * 0.45]), BASK[k % 5], true); const d = []; for (let i = 0; i < 5; i++) { const xx = c[0] - 1.1 + i * 0.55; d.push(xx, c[1] - 1.9, xx + 0.2, c[1] - 1.8); } g.segs2(d, shade(BASK[k % 5], 0.3), 0.5); }, { name: 'basket' }); }

  /* ---- the sitting-out garden: a banyan, stone tables, Chinese chess ---- */
  T.obj([-30, 8], (g) => { K.tree(g, -30, 8, { r: 5.4, h: 5.6, col: '#5E8F52' }); const r = []; for (let i = 0; i < 7; i++) { const a = g.p(-31.6 + i * 0.5, 8.4, 5.4), b = g.p(-31.8 + i * 0.5, 8.4, 1.4 + (i % 3)); r.push(a[0], a[1], b[0], b[1]); } g.segs2(r, '#6E5A44', 0.25); }, { name: 'banyan' });
  T.cast([-22, 13], (g) => {
    const stool = (x, y) => K.cyl(g, x, y, 0.5, 0, 1.3, { t: '#C9C3B5', l: '#D9D4C8', r: '#B9B3A6' }, { n: 8, w: 0.3 });
    // far side sitter, the table with the board, near sitter, kibitzers standing round
    stool(-22, 11.2); HK.person(g, -22, 11.2, 0, HK.elder(8101, { dir: 1, pose: 'sit', reach: [-2, -9] }));
    K.cyl(g, -22, 13, 1.3, 0, 2.4, { t: '#D2CCBF', l: '#DCD7CB', r: '#C3BDB0' }, { n: 12, w: 0.4 });
    const b = g.p(-22, 13, 2.42); g.fill2([[b[0] - 2.4, b[1]], [b[0], b[1] - 1.3], [b[0] + 2.4, b[1]], [b[0], b[1] + 1.3]], '#E9C98A', true);
    for (let k = 0; k < 9; k++) g.disc2([b[0] - 1.6 + (k % 3) * 1.0 + (k / 3 | 0) * 0.4, b[1] - 0.7 + (k / 3 | 0) * 0.5], 0.28, k % 2 ? '#C8372D' : '#2A2622');
    stool(-20.2, 14.8); HK.person(g, -20.2, 14.8, 0, HK.elder(8102, { dir: 2, pose: 'sit', reach: [-3, -9] }));
  }, { name: 'chess' });
  [[-25.6, 15.6, 3], [-18.4, 11.4, 2], [-24.4, 10.0, 0], [-17.6, 13.4, 2]].forEach(([x, y, d], i) => HK.stand(T, x, y, HK.elder(8110 + i, { dir: d, pose: i % 2 ? 'hold' : 'stand', cage: i === 2 }), { name: 'kibitzer' }));
  for (const [x, y] of [[-14, 8], [-14, 18], [-34, 19]]) T.obj([x, y], (g) => K.bench(g, x, y, { face: 'L', L: 1.6, col: '#5E7B5A' }), { name: 'bench' });

  /* ---- the waterfront: anglers on the seawall, lamps ---- */
  for (const [x, s] of [[-8, 8121], [2, 8122], [18, 8123], [30, 8124]]) T.cast([x, 23], (g) => { HK.person(g, x, 23, 0, HK.who(s, { dir: 1, pose: 'hold', cap: s % 2 ? '#3B3F47' : undefined })); const a = g.p(x - 0.4, 23.4, 4.2), b = g.p(x - 1.6, 27.6, 7.2), c = g.p(x - 1.8, 30, HT.HAR.WL); g.line2([a, b], { w: 0.45, c: '#3A3128', boil: false, ext: 0 }); g.fine2([b, c], { w: 0.22, c: '#5A564E' }); const bk = g.p(x + 1.1, 22.4, 0); g.fill2([[bk[0] - 1, bk[1]], [bk[0] + 1, bk[1]], [bk[0] + 1.2, bk[1] - 1.8], [bk[0] - 1.2, bk[1] - 1.8]], '#C8372D', true); }, { name: 'angler' });
  for (const [a, b] of [[-36.6, 36.6]]) T.obj([a, I - 0.5, b, I - 0.1], (g) => { HK.rail(g, [a, I - 0.3], [b, I - 0.3], { h: 1.7 }); HK.railLights(g, a, b, I - 0.3); }, { name: 'seawall rail' });
  for (const [x, y] of [[-12, 21], [12, 21], [-36, 3.4], [10, 3.4], [30, 3.4]]) T.obj([x, y], (g) => HK.lamp(g, x, y, { h: 8, arm: 1.8 }), { name: 'lamp' });

  /* ---- life on the lane ---- */
  HK.walker(T, HK.who(8131, { rwb: true }), [[-36, 1.1], [36, 1.1]], 1.0, { phase: 0.3 });
  HK.walker(T, HK.elder(8132), [[30, -3.0], [-30, -3.0]], 0.7, { phase: 0.6 });
  HK.walker(T, HK.who(8133, { phone: true }), [[36, 5], [-10, 5], [-10, 20]], 1.1, { phase: 0.1 });
  [[-31.6, -4.6, 1], [-20.4, -4.4, 1], [-9.6, -4.7, 1], [1.4, -4.5, 1]].forEach(([x, y, d], i) => HK.stand(T, x, y, HK.who(8140 + i, { dir: d, pose: 'hold', apron: i % 2 ? '#3F5F8F' : undefined, glasses: i === 0 }), { name: 'shopkeeper' }));
  // a porter pushing a trolley of sacks along the lane
  T.actor({ sample: 0.25, period: 2 * 68 / 1.4,
    at(t) { const L = 68, d = ((t * 1.4) % (2 * L) + 2 * L) % (2 * L), fw = d < L, x = fw ? -34 + d : 34 - (d - L), ph = Math.floor((d / 2.4) % 1 * 8); return { x, y: -1.3, key: (fw ? 'f' : 'b') + ph, fw, ph: ph / 8 }; },
    draw(g, st) { const dx = st.fw ? 2.6 : -2.6, cart = () => { K.box(g, dx - 1.0, -0.9, dx + 1.0, 0.9, 0.4, 0.8, { t: '#8E8A84', l: '#7A766E', r: '#66625C' }, { w: 0.35, boil: false }); for (let k = 0; k < 2; k++) K.box(g, dx - 0.9, -0.8, dx + 0.9, 0.8, 0.8 + k * 1.2, 2.0 + k * 1.2, { t: '#E9DCC0', l: '#D9C9A6', r: '#C2B08A' }, { w: 0.35, boil: false }); };
      if (st.fw) { HK.person(g, 0, 0, 0, HK.who(8150, { dir: 0, pose: 'walk', ph: st.ph, reach: [4, -8], cap: '#3B3F47' })); cart(); } else { cart(); HK.person(g, 0, 0, 0, HK.who(8150, { dir: 2, pose: 'walk', ph: st.ph, reach: [-4, -8], cap: '#3B3F47' })); } } });
});
