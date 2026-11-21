'use strict';
/* (-100,-100) Wan Chai, old working Hong Kong behind the tram line (Johnston Road on its near edge).
   What is there, front to back: a row of tong lau facing the tram street, their verandahs on square columns over the
   pavement: the pawnshop (大押 board, the bat-and-coin sign hung out at the corner), the cha chaan teng (茶餐廳, booths
   in the lit window, a waiter with milk tea), one in bamboo scaffolding with green netting and two workers in yellow
   helmets lashing poles, a Cantonese restaurant (酒家) with red lanterns. Behind, Tai Yuen Street's market lane:
   stalls of toys, fruit and dried goods under canvas. Behind that the Blue House, its balconies painted cobalt, and a
   dai pai dong under a tarp with diners on red stools; at the back, the pastel residential towers.
   Who: shoppers with the red-white-blue bag, an old man with his bird cage, kids at the toy stall, a hawker pushing a
   cart, diners, the waiter. */
SF.tile('wanchai', -100, -100, { rim: 0 }, function (T) {
  const H = 37;
  T.ground(function (g) {
    HK.ground(g, -H, -H, H, H, HK.C.pave);
    HK.paving(g, -H, -H, H, H, { step: 2.4 });
    // the market lane along x, and a back lane
    g.fill(K.rect(-H, 9, H, 21), '#DCD5C4'); HK.paving(g, -H, 9, H, 21, { step: 1.8, joint: '#CBC2AE' });
    g.fill(K.rect(-H, -11, H, -7), HK.C.asph);
  }, { rim: true });

  /* ---- the back: residential towers ---- */
  for (const [x0, x1, y0, y1, h, col] of [[-36, -22, -36, -24, 32, '#E9C9C0'], [-20, -6, -35, -23, 27, '#D3DDE8'], [-3, 12, -36, -24, 30, '#F0E3BC'], [15, 35, -34, -22, 24, '#CFE0D2']]) T.obj([x0, y0, x1, y1], (g) => HK.resi(g, x0, y0, x1, y1, 0, h, { col, lit: 0.3 }), { name: 'tower' });
  // one tower wrapped in bamboo up its face
  T.obj([15, -21.6, 35, -20.4], (g) => HK.scaffold(g, 'L', -22, 15, 35, 0, 22, { off: 0.6, net: [15, 26, 14] }), { name: 'scaffold' });

  /* ---- the Blue House and the dai pai dong ---- */
  T.obj([-36, -6, -12, 6.8], (g) => {
    HK.tonglau(g, -36, -6, -12, 4.2, { floors: 4, col: '#5E8FC9', d: 2.4, shopCol: '#E9C98A' });
    K.sign(g, 'L', 6.68, -30, -18, 3.85, 4.5, '#F3F1EA', 'BLUE HOUSE', { ink: '#2F4F9A', w: 0.3 });
  }, { name: 'blue house' });
  T.obj([-8, -4, 8, 6], (g) => {
    K.box(g, -8, -4, -3, -1, 0, 2.6, { t: '#C9CDD0', l: '#B9C0C4', r: '#9AA3A8' }, { w: 0.55 });
    K.cyl(g, -5.6, -2.5, 0.9, 2.6, 3.2, { t: '#3A3530', l: '#4A4540', r: '#2E2A26' }, { n: 10, w: 0.4 });
    const ps = []; for (const [x, y] of [[-8, -4], [8, -4], [-8, 6], [8, 6]]) { const a = g.p(x, y, 0), b = g.p(x, y, 6.6); ps.push(a[0], a[1], b[0], b[1]); } g.segs2(ps, '#5A564E', 0.32);
    // the diners: two tables, stools, people (drawn inside the tarp's object so the tarp stays above them)
    for (const [tx, ty] of [[-1, 1.0], [4.6, 2.6]]) {
      const seats = [[-1.7, -1.0, 0], [1.7, -0.6, 2], [0.2, 1.8, 3]];
      for (const [dx, dy, d] of seats.filter((s) => s[0] + s[1] < 0)) { K.box(g, tx + dx - 0.4, ty + dy - 0.4, tx + dx + 0.4, ty + dy + 0.4, 0, 1.3, { t: '#C8372D', l: '#B8322A', r: '#A42C24' }, { w: 0.3, boil: false }); HK.person(g, tx + dx, ty + dy, 0, HK.who(Math.round(9600 + tx * 10 + dx * 3 + d), { dir: d, pose: 'sit', reach: d === 0 ? [3, -9] : [-3, -9] })); }
      K.cyl(g, tx, ty, 1.6, 2.2, 2.35, { t: '#F3EFE3', l: '#E9E2CF', r: '#D9D0BA' }, { n: 14, w: 0.4 }); K.cyl(g, tx, ty, 0.2, 0, 2.2, { t: '#8E8A84', l: '#7A766E', r: '#66625C' }, { n: 6, w: 0.3 });
      const q = g.p(tx, ty, 2.4); g.fill2(arcPts(q[0], q[1], 1.0, 0, TAU, 10).map((p) => [p[0], q[1] + (p[1] - q[1]) * 0.5]), '#E9E2CF', true); g.disc2([q[0], q[1] - 0.3], 0.5, '#E8813A');
      for (const [dx, dy, d] of seats.filter((s) => s[0] + s[1] >= 0)) { K.box(g, tx + dx - 0.4, ty + dy - 0.4, tx + dx + 0.4, ty + dy + 0.4, 0, 1.3, { t: '#C8372D', l: '#B8322A', r: '#A42C24' }, { w: 0.3, boil: false }); HK.person(g, tx + dx, ty + dy, 0, HK.who(Math.round(9600 + tx * 10 + dx * 3 + d), { dir: d, pose: 'sit', reach: d === 0 ? [3, -9] : [-3, -9] })); }
    }
    const tp = [[-8.6, -4.6, 7.0], [8.6, -4.6, 7.0], [8.6, 6.6, 6.2], [-8.6, 6.6, 6.2]]; g.fill(tp, '#3F7FB8'); g.outline(tp, { w: 0.5, c: '#1F4E79', boil: false });
    const bl = g.p(0, 1, 5.6); g.disc2(bl, 2.4, 'rgba(255,214,140,0.3)'); g.disc2(bl, 0.5, '#FFF0C8');
  }, { name: 'dai pai dong' });
  T.cast([-3.6, -2.6], (g) => HK.person(g, -3.6, -2.6, 0, HK.who(9620, { dir: 2, pose: 'hold', reach: [-5, -8], apron: '#F3F1EA' })), { name: 'cook' });
  T.actor({ sample: 0.2, period: 1.2, grow: false,
    at(t) { const f = Math.floor(t * 10) % 6; return { x: -5.6, y: -2.5, z: 3.2, key: 'f' + f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), h = [3.0, 4.2, 2.4, 3.6, 4.6, 2.8][st.f]; g.fill2([[o[0] - 1.1, o[1]], [o[0] - 0.3, o[1] - h * 0.6], [o[0] + 0.1, o[1] - h], [o[0] + 0.6, o[1] - h * 0.5], [o[0] + 1.2, o[1]]], 'rgba(255,140,60,0.85)', true); g.fill2([[o[0] - 0.5, o[1]], [o[0], o[1] - h * 0.5], [o[0] + 0.5, o[1]]], '#FFE08A', true); } });

  /* ---- Tai Yuen Street: stalls along the market lane ---- */
  const SG = [['#C8372D', '#E6C24F', '#3F7FB8', '#5FA58F'], ['#E8813A', '#8FBF4E', '#E6C24F'], ['#7A5A3C', '#E9DCC0', '#C9A26B'], ['#E06A8A', '#46A6C9', '#F3F1EA', '#E6C24F']];
  for (let i = 0; i < 8; i++) { const x = -33 + i * 9; T.obj([x - 2.8, 9.6, x + 2.8, 12.6], (g) => HK.stall(g, x, 11.1, { face: 'L', L: 2.6, D: 1.4, goods: SG[i % SG.length], sheet: ['#3F7F5A', '#2F5B8A', '#C8372D', '#E6B83E'][i % 4], zt: 6.4 }), { name: 'stall' }); }
  for (let i = 0; i < 7; i++) { const x = -29 + i * 9.6; T.obj([x - 2.8, 17.4, x + 2.8, 20.4], (g) => HK.stall(g, x, 18.9, { face: 'L', L: 2.6, D: 1.4, goods: SG[(i + 2) % SG.length], sheet: ['#C8372D', '#E6B83E', '#3F7F5A', '#2F5B8A'][i % 4], zt: 6.2, cards: false }), { name: 'stall' }); }
  [[-31, 13.6, 2], [-13, 13.8, 0], [5, 13.4, 3], [23, 13.6, 2], [-22, 21.6, 3], [14, 21.4, 2]].forEach(([x, y, d], i) => HK.stand(T, x, y, (i % 3 === 2 ? HK.elder : HK.who)(9640 + i, { dir: d, pose: 'hold', rwb: i % 2 === 0, k: i === 4 ? 0.72 : undefined }), { name: 'shopper' }));
  HK.walker(T, HK.elder(9650, { cage: true }), [[-36, 15.6], [36, 15.6]], 0.6, { phase: 0.3 });
  HK.walker(T, HK.who(9651, { rwb: true }), [[36, 14.6], [-36, 14.6]], 0.9, { phase: 0.6 });
  HK.walker(T, HK.helper(9652, { bag: '#E6C24F' }), [[-36, 16.6], [36, 16.6]], 1.0, { phase: 0.1 });

  /* ---- the front row: tong lau facing the tram street ---- */
  const FR = [
    { x0: -36, x1: -21, col: '#E2D3B8', shop: (g, f, p, a0, a1) => { HK.board(g, f, p + 0.05, a0 + 1, a1 - 1, 3.95, 4.55, '#2C2622', '大押', { neon: HK.C.neon[3] }); } },
    { x0: -20, x1: -4, col: '#E9DCC4', shop: (g, f, p, a0, a1) => { g.fill(K.on(f, p + 0.04, a0 + 1, a1 - 1, 0.4, 3.2), '#F6E2A8'); const s = []; for (let a = a0 + 2; a < a1 - 1; a += 2.6) { const q0 = g.p.apply(g, K.pt(f, p + 0.05, a, 0.4)), q1 = g.p.apply(g, K.pt(f, p + 0.05, a, 2.2)); s.push(q0[0], q0[1], q1[0], q1[1]); } g.segs2(s, '#8E2F2F', 1.4); } },
    { x0: -3, x1: 13, col: '#D9CDB4', shop: null },
    { x0: 14, x1: 36, col: '#E8D9C0', shop: null },
  ];
  FR.forEach((b, i) => T.obj([b.x0, 24, b.x1, 36.4], (g) => {
    const r = HK.tonglau(g, b.x0, 24, b.x1, 33.8, { floors: 4, col: b.col, d: 2.6, shopCol: i === 1 ? '#F6E2A8' : '#E9C98A', shop: b.shop });
    if (i === 1) { HK.board(g, 'L', 36.42, b.x0 + 1.2, b.x1 - 1.2, r.Z - 4.0, r.Z - 1.2, '#2E6B4E', '茶餐廳', { en: 'CAFE', rim: '#F3ECD8' }); }
    if (i === 2) { HK.scaffold(g, 'L', 36.4, b.x0 + 0.2, b.x1 - 0.2, 4.6, r.Z + 0.6, { off: 0.3, net: [b.x0 + 0.2, b.x0 + 9, r.Z] });
      // two workers on the scaffold, yellow helmets
      for (const [x, z, s] of [[b.x0 + 11, 8.2, 9661], [b.x0 + 5, 14.6, 9662]]) HK.person(g, x, 37.0, z, HK.who(s, { dir: 1, pose: 'hold', reach: [2, -14], helmet: '#E6C24F', top: '#3F5F8F', jacket: undefined, scarf: undefined })); }
    if (i === 3) { HK.board(g, 'L', 36.42, b.x0 + 2, b.x1 - 2, r.Z - 4.2, r.Z - 1.0, '#C8372D', '酒家', { neon: '#F7D046', rim: '#D9A93E' }); const L = []; for (let x = b.x0 + 2; x < b.x1 - 1; x += 3.4) L.push(g.p(x, 36.3, 4.0)); for (const q of L) { g.disc2([q[0], q[1] + 1.6], 1.5, '#C8372D'); g.fill2([[q[0] - 0.5, q[1] + 3.0], [q[0] + 0.5, q[1] + 3.0], [q[0] + 0.3, q[1] + 3.8], [q[0] - 0.3, q[1] + 3.8]], '#E6C24F', true); } }
  }, { name: 'tong lau' }));
  T.obj([-35.4, 38.4], (g) => HK.pawn(g, -35.4, 38.4, 9.0, { out: 2.4 }), { name: 'pawn sign' });
  // the waiter crossing to the dai pai dong with a tray of milk tea, a hawker with a cart
  HK.walker(T, HK.who(9670, { top: '#F3F1EA', jacket: undefined, cup: '#E9C98A', scarf: undefined }), [[-14.6, 22.6], [-14.6, 15], [-10.5, 15], [-10.5, 8], [-4, 8], [-4, 6.9]], 0.9, { phase: 0.2 });
  T.actor({ sample: 0.25, period: 2 * 64 / 1.1,
    at(t) { const L = 64, d = HT.mod(t * 1.1, 2 * L), fw = d < L, x = fw ? -32 + d : 32 - (d - L), ph = Math.floor((d / 2.4) % 1 * 8); return { x, y: 23.0, key: (fw ? 'f' : 'b') + ph, fw, ph: ph / 8 }; },
    draw(g, st) { const dx = st.fw ? 2.6 : -2.6, cart = () => { K.box(g, dx - 1.2, -0.9, dx + 1.2, 0.9, 0.6, 2.4, { t: '#C9A26B', l: '#B58F58', r: '#9E7B48' }, { w: 0.4, boil: false }); for (const s of [-1, 1]) { const c = g.p(dx + s * 0.8, 0.95, 0.5); g.disc2(c, 0.5, '#3A3632'); } const q = g.p(dx, 0, 2.5); g.disc2([q[0], q[1] - 0.8], 1.0, 'rgba(246,244,238,0.6)'); };
      if (st.fw) { HK.person(g, 0, 0, 0, HK.elder(9671, { dir: 0, pose: 'walk', ph: st.ph, reach: [4, -8] })); cart(); } else { cart(); HK.person(g, 0, 0, 0, HK.elder(9671, { dir: 2, pose: 'walk', ph: st.ph, reach: [-4, -8] })); } } });
  for (const [x, y] of [[-36, -14], [-10, -14], [10, -14], [36, -12]]) T.obj([x, y], (g) => HK.lamp(g, x, y, { h: 8, arm: 1.8 }), { name: 'lamp' });
  HK.walker(T, HK.who(9680, { phone: true }), [[-36, -9], [36, -9]], 1.1, { phase: 0.4 });
  HK.walker(T, HK.who(9681), [[30, -8.4], [-30, -8.4]], 0.9, { phase: 0.8 });
});
