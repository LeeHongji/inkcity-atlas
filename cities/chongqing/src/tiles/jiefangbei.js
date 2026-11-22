'use strict';
/* (0,0) Jiefangbei: the Liberation Monument in its walking square.
   What it is: an octagonal stone clock tower on a stepped base (27.5 m: here 26 u), a balcony ring, four clock faces
   under a little octagonal cap and spire, the name in gold down its shaft; round it a pedestrian square of pale
   granite with planters and benches, ringed by department stores (a big screen on the tallest), shops along the far
   street. It is the heart of the city: everyone crosses it.
   Levels: all at z 0 (a walking street); the department store sits back from the car street behind it.
   Who: shoppers crossing in every direction, bangbang porters waiting by the planters with their poles and ropes, a
   shoe-shiner and his customer, a balloon seller, a street singer with a small crowd, schoolkids, couples taking
   selfies with the monument, an old man reading a newspaper on a bench.
   Moving: a dozen walkers on criss-cross routes round the monument, the balloons bobbing, the screen changing.
   Kept clear of the car street behind (y -50): the tall store starts 32 u in from its lane. */
SF.tile('jiefangbei', 0, 0, { rim: 18 }, function (T) {
  const H = 37, MX = 6, MY = 8;

  T.ground(function (g) {
    K.slab(g, H, { top: '#E4D9C6' });
    // granite paving with a ring of darker stone round the monument and spokes out to the corners
    const R = []; for (let i = 0; i < 28; i++) { const a = TAU * i / 28; R.push([MX + Math.cos(a) * 11, MY + Math.sin(a) * 11, 0]); }
    g.fill(R, '#D2CABA'); g.outline(R, { w: 0.4, c: '#A89E8A', boil: false });
    const sp = []; for (const [a, b] of [[[-37, -37], [37, 37]], [[-37, 37], [37, -37]]]) { const p = g.p(a[0], a[1], 0), q = g.p(b[0], b[1], 0); sp.push(p[0], p[1], q[0], q[1]); } g.segs2(sp, '#CFC7B6', 2.0);
    CQ.paving(g, -37, -37, 37, 37, 0, { dens: 0.35, len: 3 });
  }, { rim: true });
  // pigeons pecking on the granite
  T.ground(function (g) { CQ.pigeons(g, -2, 16, 9, 3); CQ.pigeons(g, 22, 6, 7, 4); CQ.pigeons(g, -18, -2, 6, 5); });

  /* ---- the monument ---- */
  T.obj([MX - 5, MY - 5, MX + 5, MY + 5], (g) => {
    g.boilP = 0.3;
    const i0 = g.cmds.length;
    const W = { t: '#ECE8DF', l: '#E9E4D9', r: '#D3CDC0' };
    K.cyl(g, MX, MY, 4.6, 0, 0.7, { t: '#D9D3C4', l: '#CFC8B8', r: '#B9B2A2' }, { n: 8, w: 0.7 });
    K.cyl(g, MX, MY, 3.8, 0.7, 1.4, { t: '#E0DACD', l: '#D6CFC0', r: '#C0B9A9' }, { n: 8, w: 0.7 });
    K.cyl(g, MX, MY, 2.6, 1.4, 17, W, { n: 8, w: 0.85 });
    K.cyl(g, MX, MY, 3.3, 17, 17.6, '#D3CDC0', { n: 8, w: 0.7 });                          // the balcony ring
    const rl = []; for (let i = 0; i < 16; i++) { const a = Math.PI * 0.1 + Math.PI * 0.9 * i / 15, p = g.p(MX + Math.cos(a) * 3.3, MY + Math.sin(a) * 3.3, 17.6), q = g.p(MX + Math.cos(a) * 3.3, MY + Math.sin(a) * 3.3, 18.5); rl.push(p[0], p[1], q[0], q[1]); } g.segs2(rl, '#8C8576', 0.3);
    K.cyl(g, MX, MY, 2.3, 17.6, 22, W, { n: 8, w: 0.8 });
    for (const a of [Math.PI * 0.25, Math.PI * 0.75]) { const c = g.p(MX + Math.cos(a) * 2.25, MY + Math.sin(a) * 2.25, 20); g.disc2(c, 2.6, '#F7F4EA'); g.ring2(c, 2.6, { w: 0.5, c: '#3A3530' }); g.segs2([c[0], c[1], c[0], c[1] - 1.9, c[0], c[1], c[0] + 1.3, c[1] + 0.4], '#2A2622', 0.45); }
    K.cyl(g, MX, MY, 2.7, 22, 22.6, '#D3CDC0', { n: 8, w: 0.7 });
    K.cone(g, MX, MY, 1.9, 22.6, 3.2, '#D9D2C2');
    const t0 = g.p(MX, MY, 25.6), t1 = g.p(MX, MY, 28); g.segs2([t0[0], t0[1], t1[0], t1[1]], '#8C8576', 0.6); g.disc2(t1, 0.6, '#D23B2F');
    // the name on a stone plaque at the foot, in gold
    K.box(g, MX - 2.6, MY + 4.4, MX + 2.6, MY + 5.1, 0, 2.4, { t: '#C9C2B2', l: '#8C7A62', r: '#6E5E4A' }, { w: 0.55 });
    CQH.text(g, 'L', MY + 5.1, MX, 0.5, 1.4, '解放碑', '#E2B550', { center: true, w: 0.5, lit: true });
    // at night: floodlit warm ivory from its foot, gold LEDs round the base, the clock faces glowing, the red light on top
    CQ.nmark(g, i0, null, { nc: (c) => c === '#D23B2F' ? '#FF4A3A' : c === '#F7F4EA' ? '#FFF6DC' : c[0] === '#' ? shade(mix(c, '#F0B060', 0.42), 0.12) : undefined });
    for (const [z, r] of [[2, 3.2], [9, 2.2], [17.5, 2.4], [23.5, 1.4]]) g.glow('lantern', MX, MY, z, { r, col: '#FFC870' });
    g.glow('lantern', MX, MY, 28, { r: 0.7, col: '#FF5A48' });
    for (let k = 0; k < 4; k++) { const a = Math.PI * (0.1 + 0.27 * k); g.glow('lamp', MX + Math.cos(a) * 4.9, MY + Math.sin(a) * 4.9, 0.6, { r: 0.8, base: 0 }); }
  }, { name: 'monument' });

  /* ---- the stores: the tall department store with its screen, shop rows along the far street ---- */
  T.obj([-24, -14, -8, 2], (g) => {
    CQ.block(g, { x0: -24, y0: -14, x1: -8, y1: 2, h: 28, col: '#D8D6CF', seed: 11, st: 3.2, bay: 2.2, shop: ['重庆', '#2F4A6B'], shopR: ['火锅', CQC.red], cage: false, laundry: false, lit: 0.85, crown: '#F4E2B8' });
    const s = K.on('R', -7.95, -12, -2, 12, 22); g.fill(s, '#2E3238'); g.outline(s, { w: 0.7, boil: false });
  }, { name: 'store' });
  T.actor({ sample: 5, period: 12, grow: false, at(t) { const c = Math.floor(t / 4) % 3; return { x: -7.9, y: -2, z: 12, key: c, c }; },
    draw(g, st) { const P = (a, z) => [0, -a, z]; const bg = ['#C8392E', '#2F5F8F', '#E6B84A'][st.c]; g.fill([P(0.4, 0.4), P(9.6, 0.4), P(9.6, 9.6), P(0.4, 9.6)], bg); g.mark({ nc: true, light: true });   // a screen shines at night
      if (st.c === 0) CQH.textP(g, (a, z) => P(a, z), 1.6, 3.2, 3.0, '火锅', '#F6E7B8', { lit: true });
      else if (st.c === 1) CQH.textP(g, (a, z) => P(a, z), 1.6, 3.2, 3.0, '重庆', '#F4F1E6', { lit: true });
      else { const c = g.p.apply(g, P(5, 5)); g.disc2(c, 9, '#F4F1E6'); g.mark({ nc: true }); CQH.textP(g, (a, z) => P(a, z), 1.6, 3.2, 3.0, '小面', '#C8392E', { lit: true }); } } });
  for (const [x0, x1, n, sg, col] of [[-34, -26, 3, ['茶馆', '#3F6B4E'], '#E3DCCB'], [-24, -15, 2, ['小面', '#D9732F'], CQC.plaster], [-13, -4, 3, null, '#D9CDB4'], [-2, 8, 2, ['火锅', CQC.red], CQC.plaster], [10, 20, 3, ['重庆', '#2F4A6B'], '#E7E1D2'], [22, 34, 2, ['小面', '#E6B84A'], CQC.plaster]]) {
    T.obj([x0, -35, x1, -27], (g) => CQ.block(g, { x0, y0: -35, x1, y1: -27, h: n * 3.2 + 0.4, gf: 3.6, st: 3.2, col, seed: x0 + 40, shop: sg || [null, '#B9A27D'], tank: n > 2 }), { name: 'shop' });
  }
  for (const [y0, y1, sg] of [[-24, -16, ['茶馆', '#3F6B4E']], [6, 14, ['火锅', CQC.red]], [17, 26, null]]) T.obj([-35, y0, -27, y1], (g) => CQ.block(g, { x0: -35, y0, x1: -27, y1, h: 10, gf: 3.6, st: 3.2, col: '#E3DCCB', seed: y0 + 90, shopR: sg || [null, '#7FA9C9'] }), { name: 'shop' });

  /* ---- furniture: round planters with figs, benches, lamps ---- */
  for (const [x, y, r] of [[22, -12, 6.4], [-12, 22, 6.2], [26, 24, 4.6], [-18, 30, 4.4]]) T.obj([x, y], (g) => { K.cyl(g, x, y, 2.8, 0, 1.2, { t: '#7F9A5E', l: '#C9C1B0', r: '#ADA594' }, { n: 12, w: 0.6 }); CQ.fig(g, x, y, { z: 1.2, r, h: 3.8 }); }, { name: 'planter' });
  for (const [x, y] of [[-28, -20], [32, 32]]) T.obj([x, y], (g) => CQ.bloom(g, x, y, { r: 3.8 }), { name: 'plum' });
  // a noodle stall with its stools, shoppers with bags, a fruit seller with a shoulder pole, people in the figs' shade
  T.cast([-12, -16], (g) => CQ.noodleStall(g, -12, -16, 0, 840), { name: 'noodles' });
  CQ.steamActor(T, -11.4, -16.4, 3.8, 0.9);
  const BAGS = ['#C8392E', '#E6B84A', '#3F6FA8', '#E08A3C', '#F3F1EA', '#3F8F5A', '#D98AA4'];
  for (const [x, y, d, sd] of [[-27, -12, 0, 850], [-25.5, -10.5, 3, 851], [-23, -13, 2, 852], [26, 8, 1, 853], [27.5, 9.5, 2, 854], [28.5, 12.5, 1, 855], [27, 35, 3, 856], [29, 34.6, 2, 857], [-30, 9, 0, 858], [-28.5, 10.5, 3, 859]]) T.cast([x, y], (g) => CQ.person(g, x, y, 0, CQ.who(sd, { dir: d, pose: sd % 3 ? 'hold' : 'stand', bag: BAGS[sd % BAGS.length], phone: sd % 4 === 0 })), { name: 'shopper' });
  // window shoppers along the shop fronts, people outside the store
  for (let i = 0; i < 14; i++) { const x = -30 + i * 4.4 + h1(i * 3) * 1.4, y = -24.5 + h1(i * 5) * 2.2; T.cast([x, y], (g) => CQ.person(g, x, y, 0, CQ.who(870 + i, { dir: [2, 3, 1, 0][i % 4], pose: i % 3 ? 'hold' : 'stand', bag: i % 2 ? BAGS[i % BAGS.length] : undefined, phone: i % 5 === 2 })), { name: 'window shopper' }); }
  for (let i = 0; i < 5; i++) { const x = -22 + i * 3, y = 3.6 + (i % 2) * 1.2; T.cast([x, y], (g) => CQ.person(g, x, y, 0, CQ.who(885 + i, { dir: i % 2 ? 3 : 1, pose: 'hold', bag: BAGS[(i + 2) % BAGS.length] })), { name: 'store shopper' }); }
  // a face-changer (bian lian) in his red costume with a ring of spectators
  T.cast([26, 17], (g) => {
    const ring = []; for (let i = 0; i < 9; i++) { const a = Math.PI * (0.95 + 1.1 * i / 8), x = 26 + Math.cos(a) * 3.8, y = 17 + Math.sin(a) * 3.8; ring.push([x, y, i]); }
    const back = ring.filter((r) => r[0] + r[1] < 43), front = ring.filter((r) => r[0] + r[1] >= 43);
    const dirTo = (x, y) => { const dx = 26 - x, dy = 17 - y; return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3); };
    for (const [x, y, i] of back) CQ.person(g, x, y, 0, CQ.who(890 + i, { dir: dirTo(x, y), pose: i % 3 ? 'stand' : 'hold', phone: i % 3 === 0 }));
    const r = K.person(g, 26, 17, 0, CQ.who(899, { dir: 1, pose: 'wave', ph: 0.3, top: '#C8392E', bot: '#2F2A26', dress: '#C8392E' }));
    const h = r.head; g.fill2(arcPts(h[0], h[1], r.headR * 1.05, 0, TAU, 10), '#E9C04A', true); g.fill2([[h[0] - r.headR, h[1] - 0.2], [h[0] + r.headR, h[1] - 0.2], [h[0], h[1] + r.headR]], '#C8392E', true); g.disc2([h[0] - 0.6, h[1] - 0.4], 0.35, '#2A2622'); g.disc2([h[0] + 0.6, h[1] - 0.4], 0.35, '#2A2622');
    for (const [x, y, i] of front) CQ.person(g, x, y, 0, CQ.who(890 + i, { dir: dirTo(x, y), pose: i % 3 ? 'stand' : 'hold', phone: i % 3 === 0 }));
  }, { name: 'face changer' });
  T.cast([35, 27], (g) => CQ.porter(g, 35, 27, 0, CQ.elder(860, { dir: 1, pose: 'stand' }), { load: ['#E08A3C', '#C8392E'] }), { name: 'fruit seller' });
  T.cast([17, -7], (g) => { CQ.person(g, 17, -7, 0, CQ.elder(861, { dir: 1, cage: true, pose: 'hold', bird: '#E6C24F' })); CQ.person(g, 19, -17.5, 0, CQ.elder(862, { dir: 0, cage: true, pose: 'hold', bird: '#7FA9C9' })); }, { name: 'birdcages' });
  T.cast([-14.5, 25], (g) => { CQ.dog(g, -14.5, 25.5, 0, '#E9E2CF', 1); CQ.person(g, -16.5, 25, 0, CQ.who(863, { dir: 0, pose: 'hold', k: 0.75 })); }, { name: 'kid and dog' });
  T.actor({ sample: 5, period: 10, at(t) { const f = Math.floor(t * 4) % 8; return { x: 2, y: 20, key: f, f }; }, draw(g, st) { K.person(g, 0, 0, 0, CQ.who(864, { dir: 0, pose: 'cheer', ph: st.f / 8, k: 0.72, top: '#E6C24F' })); for (let i = 0; i < 3; i++) CQ.bird2(g, g.p(2 + i * 1.5, -1 - i, 4 + (st.f + i * 3) % 8 * 0.6), st.f + i, '#8E9096'); } });
  for (const [x, y, f] of [[18, 4, 'L'], [-6, 20, 'R'], [30, 10, 'L']]) T.obj([x, y], (g) => K.bench(g, x, y, { face: f, L: 2.4, col: '#8A6446' }), { name: 'bench' });

  /* ---- people ---- */
  // porters waiting by the planters with their poles upright
  for (const [x, y, s] of [[25, -9, 800], [26.5, -14, 801], [-9, 25, 802]]) T.cast([x, y], (g) => { const r = CQ.person(g, x, y, 0, CQ.bangWho(s, { dir: 1, pose: 'hold' })); const h = r.hands[0]; g.line2([[h[0] + 0.6, h[1] + 9], [h[0] + 0.2, h[1] - 9]], { w: 0.7, c: '#B8A060', boil: false, ext: 0 }); g.segs2([h[0] + 0.5, h[1] + 2, h[0] + 1.6, h[1] + 4, h[0] + 1.6, h[1] + 4, h[0] + 0.4, h[1] + 6], '#7A6A55', 0.35); }, { name: 'porter' });
  // the shoe-shiner on a low stool and his customer on a chair
  T.cast([14, 26], (g) => { CQ.stool(g, 15.5, 26.8, '#4F7FB8'); K.person(g, 15.5, 26.8, 1.3, CQ.elder(803, { dir: 2, pose: 'sit', reach: [-3, 4] })); K.box(g, 12.2, 25, 14.2, 27, 0, 2.0, '#8A6446', { w: 0.5 }); K.person(g, 13.2, 26, 2.0, CQ.who(804, { dir: 1, pose: 'sit', top: '#2F3A4F', jacket: '#F3F1EA', tie: '#C8392E' })); }, { name: 'shoeshine' });
  // the singer and listeners
  T.cast([-14, 8], (g) => { CQ.person(g, -14, 8, 0, CQ.who(805, { dir: 0, pose: 'hold', hairStyle: 'long' })); for (const [dx, dy, s] of [[4, 2, 806], [3.5, 5, 807], [1.5, 6.5, 808], [5, -1, 809]]) CQ.person(g, -14 + dx, 8 + dy, 0, CQ.who(s, { dir: 2, pose: s % 2 ? 'stand' : 'hold', phone: s === 808 })); }, { name: 'singer' });
  // selfie couples and a reader on a bench
  T.cast([12, 14], (g) => { CQ.person(g, 12, 14, 0, CQ.who(810, { dir: 1, pose: 'hold', phone: true })); CQ.person(g, 13.6, 14.8, 0, CQ.who(811, { dir: 1, pose: 'wave', ph: 0.2 })); }, { name: 'selfie' });
  T.cast([17.5, 4], (g) => CQ.person(g, 19.2, 4, 1.3, CQ.elder(812, { dir: 1, pose: 'sit', reach: [3, 2.4] })), { on: true, name: 'reader' });
  // the balloon seller: an actor so the balloons bob
  T.actor({ sample: 5, period: 8, at(t) { const f = Math.floor(t * 3) % 6; return { x: -4, y: 28, key: f, f }; },
    draw(g, st) { const r = CQ.person(g, 0, 0, 0, CQ.elder(813, { dir: 1, pose: 'hold' })); const h = r.hands[0], cols = ['#D23B2F', '#E6C24F', '#5F8FC9', '#8FBF73', '#D98AA4', '#F3F1EA'];
      for (let i = 0; i < 6; i++) { const b = [h[0] - 5 + i * 2 + Math.sin(st.f + i) * 0.5, h[1] - 16 - (i % 3) * 3 + Math.cos(st.f * 1.3 + i) * 0.4]; g.fine2([[h[0], h[1]], b], { w: 0.2, c: '#5A564E' }); g.disc2(b, 1.9, cols[i]); g.mark({ nc: true, light: true }); g.disc2([b[0] - 0.6, b[1] - 0.6], 0.5, '#FBF8F0'); g.mark({ nc: true }); } } });   // light-up balloons at night
  // walkers criss-crossing the square
  const routes = [[[-30, 30], [30, -24]], [[34.5, 30], [34.5, -24]], [[-30, 0], [32, 0], [32, 30]], [[0, 34], [-1, -22], [26, -22]], [[17, 34], [17, -22]], [[-30, 33], [22, 33]], [[-22, 34], [34, -4]], [[9, -22], [9, 2]], [[-30, -6], [32, -6]]];
  routes.forEach((pts, i) => CQ.walk(T, i % 4 === 3 ? CQ.elder(820 + i) : CQ.who(820 + i, i === 2 ? { umbrella: '#C8392E' } : i === 6 ? { phone: true } : {}), pts.concat(pts.slice(1, -1).reverse()), 1.2 + h1(i * 5) * 0.5, { phase: h1(i * 9 + 1) }));
  CQ.walk(T, CQ.bangWho(835), [[34, 30], [-26, 30], [-26, 4]], 0.9, { porter: { load: ['#E9E2CF', '#7FA35E'] }, phase: 0.3 });
  CQ.walk(T, CQ.who(836, { k: 0.75 }), [[-24, 18], [2, 18]], 1.6, { phase: 0.5 });
});
