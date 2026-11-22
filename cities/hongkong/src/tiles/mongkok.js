'use strict';
/* (100,100) Mong Kok, the densest place on earth, at dusk (land from the seawall, local y -24).
   What it is: a canyon. Along the far side of the market street (local y 0) stand five slim towers shoulder to
   shoulder, 15-27 u, pastel walls pocked with air-conditioners and laundry, lit shopfronts at their feet, and from
   their faces the neon blades project out over the street one above another (酒家 金 大押 士多 旺角 金魚 and Latin
   ones), glowing as the light goes. In the street the Ladies' Market: two rows of stalls under tarps selling bags,
   T-shirts and phone cases, shoppers squeezing between. On the near side, low: the goldfish shops of Tung Choi Street
   with their walls of water bags, each holding a fish or two, a sneaker shop, an MTR exit (旺角 MONG KOK), a pawnshop
   with its bat-and-coin sign. A red minibus waits at the corner. At the harbour end, a strip of promenade.
   Who: shoppers with phones and bags, a busker with a guitar and a ring of listeners, a kid with a bag of goldfish,
   tourists photographing the signs, a stall-holder folding T-shirts. */
SF.tile('mongkok', 100, 100, { rim: 36 }, function (T) {
  const H = 37, Y0 = HT.HAR.K - 100;
  T.ground(function (g) {
    HK.ground(g, -H, Y0, H, H, HK.C.pave, { cut: 'xy' });
    HK.paving(g, -H, Y0, H, H, { step: 2.4 });
    g.fill(K.rect(-H, -6.4, H, 6.4), '#DAD3C2'); HK.paving(g, -H, -6.4, H, 6.4, { step: 1.8, joint: '#C9C0AC' });
    g.line([[-H, -6.4, 0], [H, -6.4, 0]], { w: 0.5, c: '#A9A296', boil: false }); g.line([[-H, 6.4, 0], [H, 6.4, 0]], { w: 0.5, c: '#A9A296', boil: false });
    g.fill(K.rect(-H, Y0, H, Y0 + 3.4), '#E9E3D4');
  }, { rim: true });

  /* ---- the far wall of towers ---- */
  const TW = [[-36, -24, 25, '#E9C9C0', '酒家', '#C8372D'], [-23, -11, 19, '#CFE0D2', '金', '#D9A93E'], [-10, 3, 27, '#F0E3BC', '士多', '#2F6B4A'], [4, 17, 22, '#D3DDE8', null, '#2C2622', 'CAMERAS'], [18, 36, 16, '#E8D3E2', '海味', '#8E2F2F']];
  TW.forEach(([x0, x1, h, col, shop, bc, en]) => T.obj([x0, -22, x1, -7.6], (g) => HK.shopTower(g, x0, -22, x1, -7.6, h, { col, shop, boardCol: bc, en, lit: 0.3 }), { name: 'tower' }));
  // the neon blades over the street: from the towers' faces out along +y, stacked
  const BL = [
    [-33, 6.0, 15.0, '#2C2622', '酒家', HK.C.neon[0]], [-28.4, 9.0, 21.0, '#2C2622', '大押', HK.C.neon[3]],
    [-20, 6.4, 13.4, '#2C2622', '金', HK.C.neon[3]], [-14.6, 8.0, 17.0, '#C8372D', '旺角', null],
    [-6.6, 6.2, 12.6, '#2C2622', '士多', HK.C.neon[5]], [-1.4, 11.0, 23.0, '#2C2622', '香港', HK.C.neon[2]],
    [8.0, 6.4, 14.4, '#2C2622', '金魚', HK.C.neon[1]], [13.4, 10.0, 18.6, '#F2C230', '大押', null],
    [22.6, 6.0, 12.8, '#2C2622', '海味', HK.C.neon[4]], [30.4, 7.0, 13.0, '#2C2622', '酒家', HK.C.neon[0]],
  ];
  BL.forEach(([x, z0, z1, col, str, neon], i) => HK.bladeObj(T, x, -7.6, 'y', 4.2 + (i % 3) * 0.6, z0, z1, col, str, { neon, ink: neon ? undefined : (col === '#F2C230' ? '#8E2620' : '#FBF8EE') }));
  // wide Latin neon boxes higher up
  for (const [x, z, w, txt, nc] of [[-31, 18.6, 7, 'KARAOKE', HK.C.neon[4]], [10, 16.6, 6, 'HOTEL', HK.C.neon[2]], [26, 13.6, 7, 'SAUNA', HK.C.neon[0]]]) T.obj([x, -7.6], (g) => { const q = K.on('L', -7.5, x - w / 2, x + w / 2, z, z + 2.0); g.fill(q, '#2C2622'); g.outline(q, { w: 0.4, boil: false }); const h = Math.min(1.2, (w - 0.6) / K.textW(txt, 1)); const i0 = g.cmds.length; K.text(g, 'L', -7.45, x, z + 1 - h / 2, h, txt, nc + '88', { center: true, w: 1.1 }); K.text(g, 'L', -7.44, x, z + 1 - h / 2, h, txt, '#FFF6EC', { center: true, w: 0.45 }); HK.nite(g, i0, { nc: true }); HK.signGlow(g, 'L', -7.5, x - w / 2, x + w / 2, z, z + 2, nc, 0.4); }, { name: 'neon box' });

  /* ---- the Ladies' Market: two rows of stalls along the street ---- */
  const GOODS = [['#C8372D', '#E6C24F', '#3F5F8F'], ['#E06A8A', '#F3F1EA', '#2F343B'], ['#5FA58F', '#E6C24F', '#B07CC9'], ['#7FB7D9', '#F0A23A', '#F3F1EA']];
  for (let i = 0; i < 9; i++) for (const yy of [-3.0, 3.0]) {
    const x = -33 + i * 8.2 + (yy > 0 ? 3 : 0); if (x > 34) continue;
    T.obj([x - 2.4, yy - 1.2, x + 2.4, yy + 1.2], (g) => {
      K.box(g, x - 2.2, yy - 1.0, x + 2.2, yy + 1.0, 0, 1.8, { t: '#B9A27D', l: '#8E7A5C', r: '#7A684E' }, { w: 0.45, boil: false });
      const gd = GOODS[(i + (yy > 0 ? 1 : 0)) % GOODS.length], i0 = g.cmds.length; for (let k = 0; k < 8; k++) { const q = g.p(x - 1.8 + (k % 4) * 1.2, yy - 0.5 + Math.floor(k / 4) * 1.0, 1.85); g.fill2([[q[0] - 1.2, q[1] - 0.5], [q[0] + 1.2, q[1] - 0.5], [q[0] + 1.2, q[1] + 0.4], [q[0] - 1.2, q[1] + 0.4]], gd[k % 3], true); }
      // a rail of hanging T-shirts and the tarp above
      const ps = []; for (const xx of [x - 2.2, x + 2.2]) { const a = g.p(xx, yy, 1.8), b = g.p(xx, yy, 5.8); ps.push(a[0], a[1], b[0], b[1]); } g.segs2(ps, '#5A564E', 0.3);
      for (let k = 0; k < 4; k++) { const q = g.p(x - 1.6 + k * 1.05, yy, 5.2); g.fill2([[q[0] - 1.1, q[1]], [q[0] + 1.1, q[1]], [q[0] + 0.9, q[1] + 3.0], [q[0] - 0.9, q[1] + 3.0]], gd[(k + 1) % 3], true); }
      HK.nite(g, i0, { nc: (c) => (c === '#5A564E' ? undefined : HK.lift(0.6)(c)) }); g.glow(i % 2 ? 'lantern' : 'lamp', x, yy, 5.5, { r: 1.0, col: '#FFD58A' });   // at night a bulb under the tarp lights the goods
      const tp = [[x - 2.8, yy - 1.6, 6.2], [x + 2.8, yy - 1.6, 6.2], [x + 2.8, yy + 1.6, 6.0], [x - 2.8, yy + 1.6, 6.0]]; g.fill(tp, ['#3F5F8F', '#C8372D', '#3E7A5A', '#E6B83E'][(i * 2 + (yy > 0 ? 1 : 0)) % 4]); g.outline(tp, { w: 0.4, c: '#3A3530', boil: false });
    }, { name: 'stall' });
  }

  /* ---- the near side: goldfish shops, a sneaker shop, the MTR exit, a pawnshop ---- */
  // goldfish shops: low shopfronts whose walls are hung with water bags
  T.obj([-36, 10, -12, 20], (g) => {
    K.box(g, -36, 10, -12, 20, 0, 8.6, { t: '#E3DED3', l: '#ECE7DB', r: '#D6D0C2' }, { w: 0.8 });
    for (let k = 0; k < 3; k++) {
      const a0 = -35.4 + k * 7.8, a1 = a0 + 7.2;
      // a wall of water bags facing the street (the shop's far face, seen as the bags hung out on its front rails)
      g.fill(K.on('L', 20.02, a0, a1, 0, 5.4), '#2F4A5A'); g.mark({ nc: '#3F8696' }); g.glow('lantern', (a0 + a1) / 2, 20.4, 0.8, { r: 2.6, col: '#9FE6EE' });   // lit tanks at night
      HK.board(g, 'L', 20.05, a0, a1, 5.6, 7.4, ['#E6C24F', '#C8372D', '#3F7F5A'][k], '金魚', { en: 'GOLDFISH' });
    }
    // the bags themselves: rows of little clear pouches with an orange fish in each
    const bags = [], fish = [];
    for (let k = 0; k < 3; k++) for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const q = g.p(-35 + k * 7.8 + c * 1.18 + 0.6, 20.3, 4.6 - r * 1.5); bags.push(q); }
    const ib = g.cmds.length;
    for (const q of bags) { g.fill2([[q[0] - 1.3, q[1] - 0.2], [q[0] + 1.3, q[1] - 0.2], [q[0] + 1.6, q[1] + 2.6], [q[0], q[1] + 3.6], [q[0] - 1.6, q[1] + 2.6]], 'rgba(214,236,242,0.75)', true); fish.push(q[0] - 0.4, q[1] + 2.1, q[0] + 0.5, q[1] + 1.9); }
    g.segs2(fish, '#F08A2A', 0.7);
    HK.nite(g, ib, { nc: (c) => (c === '#F08A2A' ? c : 'rgba(206,240,248,0.82)') });   // the bags glow under the shop lights
  }, { name: 'goldfish shops' });
  T.obj([-8, 10, 8, 22], (g) => {
    K.box(g, -8, 10, 8, 22, 0, 10.4, { t: '#2F343B', l: '#3B3F47', r: '#2A2E35' }, { w: 0.8 });
    g.fill(K.on('L', 22.02, -7.4, 7.4, 0.2, 7.6), '#F2DDA8');
    const s = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) { const q = g.p(-6.6 + c * 1.6, 22.05, 1.2 + r * 1.6); s.push(q[0] - 1.6, q[1], q[0] + 1.6, q[1]); } g.segs2(s, '#C9584B', 1.0); HK.nite(g, g.cmds.length - 1, { nc: true });
    const i0 = g.cmds.length; K.sign(g, 'L', 22.05, -7.6, 7.6, 8.0, 10.0, '#C8372D', 'SNEAKERS', { w: 0.3 }); HK.nite(g, i0, { nc: true }); HK.signGlow(g, 'L', 22.05, -7.6, 7.6, 8.0, 10.0, '#FF6A5A', 0.3);
  }, { name: 'sneaker shop' });
  // the MTR exit: a canopy over a stair down, the station's name
  T.obj([12, 11, 22, 19], (g) => {
    K.box(g, 12, 11, 22, 12.4, 0, 3.6, { t: '#C9C3B5', l: '#D9D4C8', r: '#BFB9AC' }, { w: 0.6 });
    g.fill(K.rect(12.6, 12.4, 21.4, 18.6, 0.01), '#5E584E'); const st = []; for (let k = 1; k < 8; k++) { const a = g.p(12.6, 12.4 + k * 0.8, 0.02), b = g.p(21.4, 12.4 + k * 0.8, 0.02); st.push(a[0], a[1], b[0], b[1]); } g.segs2(st, '#8E877A', 0.35);
    HK.rail(g, [12.4, 12.4], [12.4, 18.8], { h: 1.8 }); HK.rail(g, [21.6, 12.4], [21.6, 18.8], { h: 1.8 });
    const r = [[11.6, 10.8, 4.6], [22.4, 10.8, 4.6], [22.4, 16, 4.2], [11.6, 16, 4.2]]; g.fill(r, '#C8372D'); g.outline(r, { w: 0.5, c: '#6E1E18', boil: false });
    for (const x of [14.5, 19.5]) g.glow('lamp', x, 13.6, 4.0, { r: 1.1 });          // night: the lights under the canopy
    HK.board(g, 'L', 12.42, 13.4, 20.6, 1.0, 3.4, '#C8372D', '旺角', { en: 'MONG KOK', rim: '#F3F1EA' });
  }, { name: 'mtr exit' });
  // the pawnshop on the corner with its bat-and-coin sign
  T.obj([24, 10, 36, 22], (g) => {
    HK.tonglau(g, 24, 10, 36, 19.4, { floors: 2, col: '#D9CDB4', d: 2.4, shopCol: '#8E6E4E' });
    HK.board(g, 'L', 21.8, 25, 30, 1.2, 3.6, '#2C2622', '大押', { neon: HK.C.neon[3] });
  }, { name: 'pawnshop' });
  T.obj([34, 24], (g) => HK.pawn(g, 34, 24, 8.4, { out: 2 }), { name: 'pawn sign' });
  // a red minibus waiting at the corner, its sign in the window
  T.obj([26, 27, 36, 32], (g) => g.at(31, 29.5, 0, (g2) => HK.minibus(g2, 0, { red: true })), { name: 'minibus' });

  /* ---- people ---- */
  for (let i = 0; i < 6; i++) HK.walker(T, HK.who(7100 + i, i % 3 === 0 ? { phone: true } : i % 3 === 1 ? { bag: ['#C8372D', '#E6C24F', '#3F5F8F'][i % 3] } : {}), i % 2 ? [[-35, -5.2 + i * 0.2], [35, -5.2 + i * 0.2]] : [[35, 5.0 - i * 0.2], [-35, 5.0 - i * 0.2]], 0.9 + (i % 3) * 0.15, { phase: i * 0.17 });
  for (let i = 0; i < 4; i++) HK.walker(T, HK.who(7110 + i, { rwb: i === 2 }), [[-34 + i * 17, 8.0], [-34 + i * 17, 30]], 0.8, { phase: i * 0.29 });
  [[-30, 0.4, 0], [-22, -0.6, 2], [-6, 0.6, 1], [5, -0.2, 3], [16, 0.3, 0], [27, -0.4, 2]].forEach(([x, y, d], i) => HK.stand(T, x, y, HK.who(7130 + i, { dir: d, pose: 'hold', phone: i % 2 === 0, bag: i % 2 ? '#E06A8A' : undefined }), { name: 'shopper' }));
  // the busker and his ring of listeners
  T.actor({ sample: 0.3, period: 1.6,
    at(t) { const f = Math.floor(t * 5) % 4; return { x: -2, y: 26, key: 'b' + f, f }; },
    draw(g, st) { const r = HK.person(g, 0, 0, 0, HK.who(7150, { dir: 1, pose: 'hold', hands: [[3 + (st.f % 2) * 0.8, -10.6], [-2.6, -12.4]], cap: '#3B3F47', top: '#2F343B', jacket: '#C8372D' })); const h = r.hip; g.fill2([[h[0] - 2.8, h[1] - 3.6], [h[0] + 2.0, h[1] - 3.0], [h[0] + 2.6, h[1] + 0.6], [h[0] - 2.4, h[1] + 0.6]], '#A0682E', true); g.line2([[h[0] + 0.6, h[1] - 3.4], [h[0] - 5.6, h[1] - 7.6]], { w: 0.5, c: '#3A2A1E', boil: false, ext: 0 }); g.disc2([h[0] - 0.2, h[1] - 1.4], 0.7, '#3A2A1E'); if (st.f % 2) { const o = g.p(0, 0, 0); g.disc2([o[0] + 6, o[1] - 14], 0.5, '#3A3530'); g.segs2([o[0] + 6.4, o[1] - 14, o[0] + 6.4, o[1] - 16.4, o[0] + 6.4, o[1] - 16.4, o[0] + 7.4, o[1] - 15.8], '#3A3530', 0.3); } } });
  [[-5.4, 29.4, 3], [0.8, 30.0, 3], [-3, 31.2, 3], [2.6, 27.4, 2]].forEach(([x, y, d], i) => HK.stand(T, x, y, HK.who(7160 + i, { dir: d, pose: i === 1 ? 'hold' : 'stand', phone: i === 1 }), { name: 'listener' }));
  HK.stand(T, -20, 24.6, HK.who(7170, { dir: 0, k: 0.75, pose: 'hold', cap: '#E6C24F' }), { name: 'kid with goldfish' });
  HK.stand(T, 10, -3.4, HK.who(7171, { dir: 3, pose: 'hold', phone: true, cap: '#F0EDE4' }), { name: 'tourist' });
});
