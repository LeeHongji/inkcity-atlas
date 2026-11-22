'use strict';
/* (-100,100) Qianmen and Dashilar, south-west of the square.
   What it is: at the back the Zhengyangmen arrow tower, a massive grey-brick bastion on a podium with a great arch,
   its walls pierced by rows of small archers' windows, under a double-eaved grey roof edged in green. From it runs
   Qianmen Street, paved, with a vintage tram ("dangdang che") going up and down its track, under the five-bay painted
   archway (五牌楼) with its 前门 board. West of it the lane of Dashilar opens under its iron arch, 大栅栏, lined with
   old shops: the roast-duck restaurant (烤鸭), a tea house (茶), dumplings (饺子). Traditional two-storey shopfronts
   with carved red posts, green lattices and black-and-gold signboards line both streets. A subway entrance (地铁 前门).
   Who: crowds of visitors, a tanghulu seller with his straw pole bristling with red sticks, children with tanghulu,
   a family photographing the archway, a rickshaw puller waiting, a chef hanging ducks in the restaurant window.
   What moves: the tram (back and forth), walkers up and down both streets. */
SF.tile('qianmen', -100, 100, { rim: 60 }, function (T) {
  const H = 37, PAVE = '#E2DCCF';
  T.ground(function (g) {
    K.slab(g, H, { top: PAVE, cut: 'y' });
    // Qianmen Street: big grey slabs, the tram rails; Dashilar lane
    g.fill(K.rect(-5, -20, 9, H), '#D6D0C3');
    const segs = []; for (let y = -20; y < H; y += 2.6) { const a = g.p(-5, y, 0), b = g.p(9, y, 0); segs.push(a[0], a[1], b[0], b[1]); } g.segs2(segs, '#C6BFB1', 0.3);
    for (const x of [1.2, 2.8]) g.fine([[x, -18, 0.02], [x, H, 0.02]], { w: 0.45, c: '#7E766A' });
    g.fill(K.rect(-H, 1, -5, 9), BC.hutong);
    g.scuff(K.rect(-H, 1, -5, 9), { dir: Math.atan2(AY, AX), len: 4, c: '#E4DFD4', dens: 0.6, w: 0.45 });
  }, { rim: true });
  BJ.sidewalk(T, ['n', 'e'], { sp: 13, skip: { n: [[-8, 12]], e: [[-24, -16]] }, bikes: [['e', 22, 5]] });

  /* ---------------- the Zhengyangmen arrow tower ---------------- */
  T.obj([10, -35, 35, -21], function (g) {
    g.boilP = 0.25; const i0 = g.cmds.length;
    const x0 = 10, y0 = -35, x1 = 35, y1 = -21;
    K.box(g, x0, y0, x1, y1, 0, 8, { t: '#A3A098', l: '#AFACA4', r: '#9A978F' }, { w: 1 });
    const pts = [K.pt('L', y1 + 0.03, 22.5 - 2.6, 0)]; for (let k = 0; k <= 10; k++) { const t = Math.PI * k / 10; pts.push(K.pt('L', y1 + 0.03, 22.5 - 2.6 * Math.cos(t), 3.6 + 2.6 * Math.sin(t))); } pts.push(K.pt('L', y1 + 0.03, 22.5 + 2.6, 0)); g.fill(pts, '#3A3530'); g.line(pts, { w: 0.6, boil: false });
    K.box(g, x0 + 1, y0 + 1, x1 - 1, y1 - 1, 8, 18, { t: '#A3A098', l: '#B2AFA7', r: '#9E9B93' }, { w: 1 });
    // rows of small archers' windows on both faces we see
    for (const [f, p, a0, a1] of [['L', y1 - 1, x0 + 2.2, x1 - 2.2], ['R', x1 - 1, y0 + 2.2, y1 - 2.2]]) for (const z of [9.6, 12.2, 14.8]) for (let a = a0; a <= a1 + 0.01; a += (a1 - a0) / Math.round((a1 - a0) / 2.4)) { const q = K.on(f, p + 0.03, a - 0.45, a + 0.45, z, z + 1.2); g.fill(q, '#3A3530'); }
    const sg = []; for (const [f, p, a0, a1] of [['L', y1 - 1, x0 + 1, x1 - 1], ['R', x1 - 1, y0 + 1, y1 - 1]]) for (let z = 8.5; z < 18; z += 0.6) { const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z)); sg.push(a[0], a[1], b[0], b[1]); } g.segs2(sg, '#97948C', 0.18);
    const iR = g.cmds.length;
    BJ.roof(g, x0 + 1, y0 + 1, x1 - 1, y1 - 1, 18, 2.8, { type: 'hip', col: '#7E8A86', top: 0.42, over: 1.4, lift: 0.4, c: '#3E5A4E' });
    BJ.hallBody(g, x0 + 3, y0 + 3, x1 - 3, y1 - 3, 18.8, 20.4, { doors: false, red: '#8E9A94', column: '#6E7A74', bx: 7, by: 3 });
    BJ.roof(g, x0 + 3, y0 + 3, x1 - 3, y1 - 3, 20.4, 5.0, { type: 'xie', col: '#7E8A86', over: 1.6, lift: 0.7, c: '#3E5A4E', rc: '#3E6E4E', gcol: '#A3A098' });
    // at night the arrow tower is floodlit from below: the brick walls glow warm, the roofs catch less of it, the
    // archers' windows stay dark
    BN.flood(g, i0, 0.75, BN.FLOOD, { lines: 0.2, to: iR }); BN.flood(g, iR, 0.4, BN.FLOOD, { lines: 0.2 });
    for (const [x, y, z, r] of [[16, -20.8, 3, 2.6], [22.5, -20.8, 4.5, 3.2], [29, -20.8, 3, 2.6], [35.2, -28, 3, 2.6], [17, -21.8, 13, 3.0], [27, -21.8, 13, 3.0], [34.2, -28, 13, 3.0]]) g.glow2('lantern', g.p(x, y, z), g.p(x, y + 0.6, 0), { r, col: '#FFC07A' });
  }, { name: 'arrow tower' });
  // the subway entrance under it
  T.obj([-34, -34, -26, -27], function (g) {
    K.box(g, -34, -34, -26, -27, 0, 4.4, { t: '#CFD8DE', l: '#DCE6EC', r: '#BFCBD3' }, { w: 0.8 });
    g.fill(K.on('L', -26.97, -33, -27, 0, 3.4), '#3F4A55'); g.mark({ nc: '#DCEBF6', win: 1, spill: true });   // (night: lit white inside)
    BJ.sign(g, 'L', -27, -33.6, -26.4, 3.5, 4.35, '#2E5E9E', '地铁前门');
    K.box(g, -34.4, -34.4, -25.6, -26.6, 4.4, 5.0, { t: '#9AA7B0', l: '#AAB6BE', r: '#8E9AA3' }, { w: 0.6 });
  }, { name: 'subway' });

  /* ---------------- the five-bay archway over Qianmen Street ---------------- */
  T.obj([-6, -16.6, 10, -15.4], (g) => BJ.pailou(g, 'L', -16, -6, 10, { bays: 5, h: 10, word: '前门', roof: '#5E8A6A' }), { name: 'archway' });

  /* ---------------- shopfronts ---------------- */
  // west side of Qianmen Street, north of Dashilar (fronts face the street, +x)
  [[-12, -27, -6, -15, '茶', 900], [-12, -14, -6, -1.4, '饺子', 901]].forEach(([x0, y0, x1, y1, w, s]) => T.obj([x0, y0, x1, y1], (g) => BJ.shop(g, x0, y0, x1, y1, { front: 'R', word: w, seed: s }), { name: 'shop' }));
  // Dashilar: the iron arch at its mouth, shops along its north side facing the lane
  T.obj([-6.6, 0.6, -5.4, 9.4], function (g) {
    for (const y of [1.0, 9.0]) { const a = g.p(-6, y, 0), b = g.p(-6, y, 8.6); g.fill2([[a[0] - 0.5, a[1]], [a[0] + 0.5, a[1]], [b[0] + 0.5, b[1]], [b[0] - 0.5, b[1]]], '#2E2A26'); }
    const iA = g.cmds.length, arc = []; for (let k = 0; k <= 12; k++) { const t = k / 12; arc.push([-6, lerp(1, 9, t), 7.4 + Math.sin(Math.PI * t) * 1.6]); } g.line(arc, { w: 0.9, c: '#2E2A26', boil: false });
    BN.litLines(g, iA, BN.GOLD);                               // (night: the arch is traced in lights)
    for (let k = 1; k < 6; k++) { const q = arc[k * 2]; g.glow('lantern', q[0] + 0.1, q[1], q[2], { r: 0.8, col: '#FFC870' }); }
    const lat = []; for (let k = 1; k < 12; k++) { const t = k / 12, y = lerp(1, 9, t), a = g.p(-6, y, 7.4), b = g.p(-6, y, 7.4 + Math.sin(Math.PI * t) * 1.6); lat.push(a[0], a[1], b[0], b[1]); } g.segs2(lat, '#2E2A26', 0.3);
    BJ.sign(g, 'R', -6, 2.4, 7.6, 5.6, 7.3, '#2E2A26', '大栅栏', { ink: '#E9C55A', c: '#C9A23A' });
  }, { name: 'dashilar arch' });
  [[-36, -9, -26, -1.2, '烤鸭', 910, '#A8382E'], [-25, -9, -16, -1.2, '茶', 911, '#3E5E8E'], [-15, -9, -7.4, -1.2, '饺子', 912, '#A8382E']].forEach(([x0, y0, x1, y1, w, s, c]) => T.obj([x0, y0, x1, y1], (g) => BJ.shop(g, x0, y0, x1, y1, { front: 'L', word: w, seed: s, col: c }), { name: 'shop' }));
  // south of Dashilar: shops facing Qianmen Street, and a courtyard behind
  [[-12, 10.8, -6, 22, '烤鸭', 920], [-12, 23, -6, 34, '面', 921]].forEach(([x0, y0, x1, y1, w, s]) => T.obj([x0, y0, x1, y1], (g) => BJ.shop(g, x0, y0, x1, y1, { front: 'R', word: w, seed: s, lat: '#3E6E8E' }), { name: 'shop' }));
  BJ.court(T, { x0: -35, y0: 11, x1: -15, y1: 34, gate: 'E', ga: 30, east: 'wall', nd: 6, sd: 5 });
  // east of the street: two rows of shops facing south
  [[13, -16, 34, -9, '茶', 930], [13, 2, 34, 9, '烤鸭', 931], [13, 20, 34, 27, '饺子', 932]].forEach(([x0, y0, x1, y1, w, s]) => T.obj([x0, y0, x1, y1], (g) => BJ.shop(g, x0, y0, x1, y1, { front: 'L', word: w, seed: s }), { name: 'shop' }));

  /* ---------------- the tram on Qianmen Street ---------------- */
  const TRAM = (t) => { const P = 34, u = ((t % P) + P) % P, ys = -7.4, ye = 31; if (u < 4) return { y: ys, d: 1 }; if (u < 17) { const s = (u - 4) / 13, e = s * s * (3 - 2 * s); return { y: lerp(ys, ye, e), d: 1 }; } if (u < 21) return { y: ye, d: -1 }; const s = (u - 21) / 13, e = s * s * (3 - 2 * s); return { y: lerp(ye, ys, e), d: -1 }; };
  T.actor({ sample: 0.3, period: 34, grow: false,
    at(t) { const s = TRAM(t); return { x: 2.0, y: s.y, key: 't' + s.d, ang: s.d > 0 ? Math.PI / 2 : -Math.PI / 2 }; },
    draw(g, st) {
      const i0 = g.cmds.length;
      K.cablecar(g, st.ang, { col: '#3E6E4E', roof: '#E9DCB8', L: 5.6, W: 2.2, riders: (gg, B) => { for (const u of [-3.2, 3.2]) { const p = B.pt(u, 0, 0.7); BJ.person(gg, p[0], p[1], 0.7, BJ.tourist(940 + u, '#F2C230', { dir: 1, pose: 'stand' })); } } });
      BN.each(g, i0, (c, f) => (f && c === C.glass ? { nc: BN.LIT, light: true } : undefined));   // (night: its windows lit)
      const top = g.p(0, 0, 7.9), pole = g.p(0 + Math.cos(st.ang) * -3.6, Math.sin(st.ang) * -3.6, 11.6); g.segs2([top[0], top[1], pole[0], pole[1]], '#2E2A26', 0.4);
    } });
  // the overhead wire for the tram, on two posts by the street
  for (const y of [-10, 12, 32]) T.obj([5.6, y], (g) => { const b = g.p(5.6, y, 0), t = g.p(5.6, y, 12.2), e = g.p(2.0, y, 11.8); g.fill2([[b[0] - 0.35, b[1]], [b[0] + 0.35, b[1]], [t[0] + 0.25, t[1]], [t[0] - 0.25, t[1]]], '#4A4540'); g.segs2([t[0], t[1], e[0], e[1]], '#4A4540', 0.4); if (y < 30) { const n = g.p(2.0, y + (y === -10 ? 22 : 20), 11.6); g.fine2([e, n], { w: 0.25, c: '#4A4540' }); } g.glow('lamp', 5.6, y, 10.4, { r: 1.4 }); }, { name: 'tram post' });   // (night: each post carries a street lamp)

  /* ---------------- people ---------------- */
  T.cast([-1, 14], (g) => {
    const r = BJ.person(g, -3.8, 14, 0, BJ.who(950, { old: true, dir: 0, pose: 'hold', reach: [0.4, -6], cap: '#5A5A55', top: '#F3F1EA' }));
    const hd = r.hands[0], top = [hd[0] + 0.3, hd[1] - 12]; g.segs2([hd[0], hd[1] + 6, top[0], top[1]], '#B9A27D', 0.6);
    g.fill2(arcPts(top[0], top[1] + 2.4, 2.6, 0, TAU, 12).map((q) => [q[0], top[1] + 2.4 + (q[1] - top[1] - 2.4) * 1.1]), '#E9D9A8', true);
    for (let k = 0; k < 14; k++) { const a = k / 14 * TAU, p = [top[0] + Math.cos(a) * 3.1, top[1] + 2.4 + Math.sin(a) * 3.2]; g.segs2([top[0], top[1] + 2.4, p[0], p[1]], '#C9A26B', 0.25); for (let j = 1; j <= 3; j++) g.disc2([lerp(top[0], p[0], 0.45 + j * 0.18), lerp(top[1] + 2.4, p[1], 0.45 + j * 0.18)], 0.55, '#D2342A'); }
    BJ.person(g, -2.6, 15.6, 0, BJ.kid(951, { dir: 2, tanghulu: true })); BJ.person(g, -1.6, 16.4, 0, BJ.kid(952, { dir: 2 }));
  }, { on: false });
  T.cast([-2.6, -12.2], (g) => { BJ.person(g, -3.4, -12, 0, BJ.who(953, { dir: 3, pose: 'hold', phone: true, reach: [0.4, -9] })); BJ.person(g, -1.6, -12.4, 0, BJ.who(954, { dir: 3 })); }, { on: false });
  T.cast([-31, 4], (g) => { g.at(-31, 4.6, 0, (g2) => TK_rickshawBJ(g2)); }, { on: false });
  K.walker(T, BJ.tourist(960, '#E85A3A'), [[7.2, 35], [7.2, -10]], 1.2, { phase: 0.1 });
  K.walker(T, BJ.tourist(961, '#E85A3A'), [[7.2, 35], [7.2, -10]], 1.2, { phase: 0.13 });
  K.walker(T, BJ.who(962), [[-3.6, -10], [-3.6, 35]], 1.1, { phase: 0.4 });
  K.walker(T, BJ.who(963), [[-3.0, 35], [-3.0, -10]], 1.0, { phase: 0.7 });
  K.walker(T, BJ.who(964), [[-26, 3.4], [-8, 3.4]], 1.0, { phase: 0.2 });
  K.walker(T, BJ.who(965, { old: true }), [[-8, 6.6], [-26, 6.6]], 0.8, { phase: 0.6 });
  K.walker(T, BJ.who(967), [[11, 12], [34, 12], [34, 17], [11, 17]], 1.0, { phase: 0.3 });
  K.walker(T, BJ.who(968), [[11, -6], [34, -6], [34, -1], [11, -1]], 1.1, { phase: 0.8 });
});
/* a parked pedicab with its driver waiting (Dashilar) */
function TK_rickshawBJ(g) { BJ.pedicab(g, Math.PI, { riders: [], seed: 970 }); }
