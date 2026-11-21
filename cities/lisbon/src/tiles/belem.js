'use strict';
/* (-100,100) Belém, where the ships left.
   At the back the Mosteiro dos Jerónimos: a long white limestone front of the Manueline monastery, rows of carved
   windows, the great south portal like lace, and the church's square tower with its dome at the west end. In front the
   Praça do Império garden: clipped lawns, a fountain, palms. On the east side Pastéis de Belém under its blue awnings,
   with its queue down the pavement. Across the promenade, on the quay, the Padrão dos Descobrimentos: a tall white
   slab shaped like a caravel's prow, the navigators climbing both sides behind Henry, the cross of the Order on its
   back. Out in the river the Torre de Belém on its bastion: turrets with ribbed domes, a balcony, crenellations with
   shields, a little footbridge back to the shore.
   Who: the queue for pastéis de nata and people eating them on the kerb; tourists photographing the tower from the
   footbridge; a guide's group at the Padrão; a family at the fountain; a man selling cork hats; kite flying. */
SF.tile('belem', -100, 100, { rim: 48 }, function (T) {
  const H = 37, W = { t: '#ECE6D6', l: '#F5F0E2', r: '#E0D8C4' }, TW = { t: '#ECE6D4', l: '#F6F0DE', r: '#E2D9C2' };
  T.ground(function (g) {
    K.slab(g, H, { top: '#ECE5D3' });
    g.boilP = 0.1;
    for (const [x0, y0, x1, y1] of [[-30, -10, -8, 10], [6, -10, 20, 10], [-30, 16, -8, 30], [6, 16, 20, 30]]) K.lawn(g, x0, y0, x1, y1, { dens: 0.5 });
    const f = K.arc(-1, 13, 0.02, 5, 0, TAU, 28); g.fill(f, '#D9D2C2'); g.fill(K.arc(-1, 13, 0.03, 4.2, 0, TAU, 28), LC.water); g.outline(f, { w: 0.5, boil: false });
    LX.pave(g, 22, -H, H, H, { edge: 'w' });
  }, { rim: true });

  /* ---------------- the Jerónimos ---------------- */
  T.obj([-H, -H, 20, -24], function (g) {
    g.boilP = 0.3;
    K.box(g, -H, -H, 20, -24, 0, 11, W, { w: 0.95 });
    for (let x = -H + 2; x < 19; x += 3.2) { if (x > -8 && x < -1) continue; K.win(g, 'L', -24, x, x + 1.4, 2, 4.4, { style: 'navy', arch: true }); K.win(g, 'L', -24, x, x + 1.4, 6.2, 8.8, { style: 'navy', arch: true }); }
    // the south portal: a tall carved panel of niches and pinnacles
    const pp = K.on('L', -23.95, -8, -1, 0, 13); g.fill(pp, '#EFE8D6'); g.outline(pp, { w: 0.7, boil: false });
    const lace = []; for (let z = 1.2; z < 12.6; z += 1.4) for (let x = -7.4; x < -1.4; x += 1.2) { const a = g.p(x, -23.9, z), b = g.p(x + 0.6, -23.9, z + 0.9); lace.push(a[0], a[1], b[0], b[1]); } g.segs2(lace, '#C9BFA6', 0.35);
    K.win(g, 'L', -23.9, -5.6, -3.4, 0, 4.6, { style: 'dark', arch: true });
    for (let x = -7.6; x <= -1.4; x += 2) { const t = g.p(x, -23.9, 13); g.line2([t, [t[0], t[1] - 3]], { w: 0.5, c: '#C9BFA6', boil: false }); }
    LX.roof(g, -H, -H, 20, -24, 11, 2.0, { col: '#B9B4AA', c: '#5E5A52' });
    for (let x = -H + 1; x < 20; x += 2.4) { const t = g.p(x, -24, 11), u = g.p(x, -24, 12.4); g.line2([t, u], { w: 0.45, c: '#D3CAB3', boil: false }); }
    // the church tower at the west end with its dome
    K.box(g, -H, -H, -27, -26, 11, 18, W, { w: 0.85 });
    K.win(g, 'L', -26, -33.4, -30.6, 13, 16.4, { style: 'dark', arch: true }); K.win(g, 'R', -27, -32.8, -30.2, 13, 16.4, { style: 'dark', arch: true });
    K.dome(g, -32, -31.5, 4.6, 18, 4.6, '#D9D3C4', { w: 0.7, band: true });
    const fn = g.p(-32, -31.5, 22.6); g.line2([fn, [fn[0], fn[1] - 3.4]], { w: 0.45, c: '#8C8576', boil: false });
  }, { name: 'jeronimos' });

  /* ---------------- the garden: palms, the fountain ---------------- */
  [[-32, -14], [-4, -14], [24, -14], [-32, 33], [-4, 33]].forEach(([x, y], i) => T.obj([x, y], (g) => K.palm(g, x, y, { h: 12 + (i % 2) * 2, lean: i % 2 ? 0.8 : -0.6 }), { name: 'palm' }));
  T.obj([-2.2, 11.8, 0.2, 14.2], (g) => { K.cyl(g, -1, 13, 1.0, 0, 2.2, K.STONE, { n: 10, w: 0.5 }); K.cyl(g, -1, 13, 2.2, 2.2, 2.6, K.STONE, { n: 12, w: 0.5 }); K.cyl(g, -1, 13, 0.5, 2.6, 4.0, K.STONE, { n: 8, w: 0.45 }); }, { name: 'fountain' });
  T.actor({ sample: 5, period: 2, at(t) { const f = Math.floor((t / 2 % 1) * 6); return { x: -1, y: 17, key: 'j' + f, f }; },
    draw(g, st) { const lo = g.p(0, -4, 4.0); for (let k = 0; k < 8; k++) { const a = TAU * k / 8 + st.f * 0.1, e = g.p(Math.cos(a) * 3.4, -4 + Math.sin(a) * 3.4, 0.2), m = [lerp(lo[0], e[0], 0.5), lerp(lo[1], e[1], 0.5) - 3.6]; g.line2([lo, m, e], { w: 0.5, c: '#CFE6EC', boil: false, ext: 0 }); } } });
  T.cast([3, 15], (g) => { LX.person(g, 3.4, 15.6, 0, LX.who(1300, { dir: 2, k: 0.7, pose: 'hold', reach: [-3, -4] })); LX.person(g, 5, 13.8, 0, LX.who(1301, { dir: 2 })); LX.person(g, 4.4, 17.4, 0, LX.who(1302, { dir: 2, pose: 'hold' })); });
  T.cast([-20, 22], (g) => { const q = [[-22, 20.8], [-18, 20.8], [-18, 23.6], [-22, 23.6]].map(([a, b]) => [a, b, 0.05]); g.fill(q, '#3F8FD2'); LX.person(g, -21.4, 21.6, 0, LX.who(1303, { dir: 0, pose: 'sit' })); LX.person(g, -18.6, 22.8, 0, LX.who(1304, { dir: 3, pose: 'sit', dress: '#F2C230' })); });
  // a kite over the lawn, its flyer
  T.cast([12, 26], (g) => { const r = LX.person(g, 12, 26, 0, LX.who(1305, { dir: 3, pose: 'hold', reach: [2, -11] })); const h = r.hands[0], k = [h[0] + 18, h[1] - 34]; g.fine2([h, [h[0] + 8, h[1] - 18], k], { w: 0.25, c: '#6E6A64' }); g.fill2([[k[0], k[1] - 3], [k[0] + 2.2, k[1]], [k[0], k[1] + 3.2], [k[0] - 2.2, k[1]]], '#E2483D', true); g.segs2([k[0], k[1] - 3, k[0], k[1] + 3.2, k[0] - 2.2, k[1], k[0] + 2.2, k[1]], '#F7F5EF', 0.3); g.fine2([[k[0], k[1] + 3.2], [k[0] - 1, k[1] + 6], [k[0] + 0.6, k[1] + 8.4]], { w: 0.3, c: '#F2C230' }); }, { name: 'kite' });

  /* ---------------- Pastéis de Belém and its queue ---------------- */
  T.obj([24, -22, 36, -6], function (g) {
    LX.house(g, { x0: 24, y0: -22, x1: 36, y1: -6, n: 2, col: '#F4F0E6', seed: 1310, faces: 'LR', bal: 0.3 });
    for (let i = 0; i < 4; i++) { const y0 = lerp(-21, -7, i / 4) + 0.3, y1 = lerp(-21, -7, (i + 1) / 4) - 0.3, P = (y, d, z) => [36 + d, y, z]; const q = [P(y0, 0, 4.4), P(y1, 0, 4.4), P(y1, 1.8, 3.3), P(y0, 1.8, 3.3)]; g.fill(q, '#2F5FA8'); g.fill([P(y0, 1.8, 3.3), P(y1, 1.8, 3.3), P(y1, 1.8, 2.8), P(y0, 1.8, 2.8)], '#264E8A'); g.outline(q, { w: 0.45, c: '#1E3A66', boil: false }); }
    K.sign(g, 'R', 36, -20, -8, 4.8, 5.8, '#2F5FA8', 'PASTÉIS DE BELÉM', { ink: '#F7F1DC' });
  }, { name: 'pasteis' });
  for (let i = 0; i < 9; i++) { const y = -4 + i * 2.2, x = 31.5 + (i % 2) * 0.6; T.cast([x, y], (g) => LX.person(g, x, y, 0, LX.who(1320 + i, { dir: 3, pose: i % 3 === 2 ? 'hold' : 'stand', phone: i % 4 === 1 }))); }
  T.cast([28, 14], (g) => { LX.person(g, 27.4, 14, 0, LX.who(1335, { dir: 1, pose: 'hold', reach: [1, -9] })); LX.person(g, 29.6, 15.2, 0, LX.who(1336, { dir: 1, pose: 'hold' })); const c = g.p(28.4, 14.4, 2.6); g.fill2([[c[0] - 1.6, c[1]], [c[0] + 1.6, c[1]], [c[0] + 1.2, c[1] - 0.9], [c[0] - 1.2, c[1] - 0.9]], '#E8B04A', true); });

  /* ---------------- the Padrão dos Descobrimentos on the quay ---------------- */
  T.obj([4.5, 38.5, 13.5, 47], function (g) {
    const z0 = 0, PW = { t: '#ECE7DC', l: '#F7F4EC', r: '#E2DCCE' };
    K.box(g, 4.5, 38.5, 13.5, 46, z0, z0 + 1.2, PW, { w: 0.7 });
    // the slab with the cross of the Order cut into its back (a tall thin box along y), the prow rising to it
    K.box(g, 7.6, 39, 10.4, 44, 1.2, 24, PW, { w: 0.95 });
    const cr = K.on('R', 10.42, 40.4, 42.6, 15, 21); g.fill(cr, '#E2DCCE'); g.outline(cr, { w: 0.4, boil: false });
    const cc = g.p(10.43, 41.5, 18); g.segs2([cc[0] - 1.8, cc[1] - 0.4, cc[0] + 1.8, cc[1] + 0.4, cc[0], cc[1] - 3.6, cc[0], cc[1] + 3.6], '#9C9484', 0.8);
    // the prow: a wedge rising south out of the slab, the figures on its two flanks stepping up behind Henry
    const prow = [[9, 44, 1.2], [9, 50, 1.2], [9, 44, 13]];
    g.fill([[7.6, 44, 1.2], [9, 50, 1.2], [9, 44, 14], [7.6, 44, 14]], '#E8E2D4'); g.fill([[10.4, 44, 1.2], [9, 50, 1.2], [9, 44, 14], [10.4, 44, 14]], '#F7F4EC');
    g.line([[10.4, 44, 1.2], [9, 50, 1.2], [9, 44, 14]], { w: 0.8, boil: false }); void prow;
    for (let k = 0; k < 7; k++) { const t = k / 7, y = lerp(49, 44.4, t), z = lerp(2.0, 12, t), p = g.p(10.3, y, z); g.fill2([[p[0] - 1.1, p[1]], [p[0] + 1.1, p[1]], [p[0] + 0.8, p[1] - 3.6], [p[0] - 0.8, p[1] - 3.6]], '#E2DCCE', true); g.disc2([p[0], p[1] - 4.3], 0.8, '#E2DCCE'); g.outline2([[p[0] - 1.1, p[1]], [p[0] + 1.1, p[1]], [p[0] + 0.8, p[1] - 3.6], [p[0] - 0.8, p[1] - 3.6]], { w: 0.3, c: '#9C9484', boil: false }); }
    const hp = g.p(9.4, 48.6, 2.4); g.fill2([[hp[0] - 1.4, hp[1]], [hp[0] + 1.4, hp[1]], [hp[0] + 1.0, hp[1] - 5.6], [hp[0] - 1.0, hp[1] - 5.6]], '#E2DCCE', true); g.disc2([hp[0], hp[1] - 6.4], 0.95, '#E2DCCE'); g.line2([[hp[0] + 1.0, hp[1] - 4.6], [hp[0] + 2.4, hp[1] - 1.0]], { w: 0.6, c: '#9C9484', boil: false });
  }, { name: 'padrao' });
  T.cast([0, 42], (g) => { const r = LX.person(g, 1.6, 40.6, 0, LX.who(1340, { top: '#E2483D', dir: 0, pose: 'hold', reach: [1, -14] })); const h = r.hands[0]; g.segs2([h[0], h[1], h[0] + 0.6, h[1] - 8], '#3A3530', 0.4); g.fill2([[h[0] + 0.6, h[1] - 8], [h[0] + 4, h[1] - 7.2], [h[0] + 0.6, h[1] - 6]], '#F2C230', true); for (let i = 1; i < 6; i++) LX.person(g, -1.6 - (i % 3) * 1.8, 39.4 + Math.floor(i / 3) * 2.6 + (i % 2) * 0.6, 0, LX.who(1340 + i, { dir: i % 2 ? 0 : 3, pose: i === 2 ? 'hold' : 'stand', phone: i === 2 })); });

  /* ---------------- the Torre de Belém in the river ---------------- */
  const TX = -24, TY = 60, WZ = LS.wz;
  T.obj([-29, 44, -26, 54], (g) => {        // the footbridge on piles
    K.box(g, -29, 44, -26, 54, 0.1, 0.6, { t: '#9C7A52', l: '#8A6A44', r: '#7A5A3A' }, { w: 0.5 });
    const p = []; for (let y = 46; y < 54; y += 2.6) for (const x of [-28.8, -26.2]) { const a = g.p(x, y, WZ), b = g.p(x, y, 0.1); p.push(a[0], a[1], b[0], b[1]); } g.segs2(p, '#6E5A44', 0.5);
    g.line([[-26, 44, 1.5], [-26, 54, 1.5]], { w: 0.35, c: '#6E5A44', boil: false });
  }, { name: 'footbridge' });
  T.obj([TX - 8, TY - 6, TX + 8, TY + 7], function (g) {
    g.boilP = 0.35;
    // the bastion: a many-sided platform out in the water, crenellated, with ribbed-dome turrets on its corners
    K.box(g, TX - 8, TY - 6, TX + 8, TY + 6, WZ, 4.2, TW, { w: 0.95 });
    const sh = []; for (let x = TX - 7.4; x < TX + 8; x += 1.6) { const p = g.p(x, TY + 6, 4.2); sh.push(p); } for (const p of sh) { g.fill2([[p[0] - 0.6, p[1]], [p[0] + 0.6, p[1]], [p[0] + 0.6, p[1] - 1.8], [p[0] - 0.6, p[1] - 1.8]], '#F6F0DE', true); g.disc2([p[0], p[1] - 1.0], 0.45, '#C94A3E'); }
    for (let y = TY - 5.4; y < TY + 6; y += 1.6) { const p = g.p(TX + 8, y, 4.2); g.fill2([[p[0] - 0.6, p[1]], [p[0] + 0.6, p[1]], [p[0] + 0.6, p[1] - 1.8], [p[0] - 0.6, p[1] - 1.8]], '#ECE4CC', true); }
    for (const x of [TX - 4, TX + 1, TX + 6]) K.win(g, 'L', TY + 6, x - 0.6, x + 0.6, 0, 2.2, { style: 'dark', arch: true });
    const turret = (x, y, z) => { K.cyl(g, x, y, 0.9, z, z + 2.0, TW, { n: 8, w: 0.5 }); K.dome(g, x, y, 1.0, z + 2.0, 1.3, '#F6F0DE', { w: 0.5, ribs: 6, ribCol: '#C9BFA6' }); };
    turret(TX + 8, TY + 6, 4.2); turret(TX - 8, TY + 6, 4.2); turret(TX + 8, TY - 6, 4.2);
    // the tower: five storeys, a loggia balcony on the river face, battlements with shields, corner turrets
    K.box(g, TX - 6, TY - 6, TX + 1, TY + 1, 4.2, 24, TW, { w: 1 });
    for (const [f, p, a0, a1] of [['L', TY + 1, TX - 6, TX + 1], ['R', TX + 1, TY - 6, TY + 1]]) {
      const m = (a0 + a1) / 2;
      K.win(g, f, p, m - 0.7, m + 0.7, 8, 10.4, { style: 'dark', arch: true }); K.win(g, f, p, m - 0.6, m + 0.6, 13, 15, { style: 'dark', arch: true }); K.win(g, f, p, m - 0.9, m + 0.9, 18, 20.4, { style: 'dark', arch: true });
      const sh2 = g.p.apply(g, LX.out(f, p, m, 16.5, 0.05)); g.disc2(sh2, 1.0, '#C9463E'); g.ring2(sh2, 1.0, { w: 0.3, c: '#7A2A22' });
    }
    // the loggia on the south face
    K.box(g, TX - 5, TY + 1, TX, TY + 2.6, 10.8, 11.4, TW, { w: 0.5 }); for (let x = TX - 4.6; x <= TX - 0.4; x += 1.4) { const a = g.p(x, TY + 2.5, 11.4), b = g.p(x, TY + 2.5, 14.6); g.line2([a, b], { w: 0.45, c: '#C9BFA6', boil: false }); } K.box(g, TX - 5, TY + 1, TX, TY + 2.6, 14.6, 15.2, TW, { w: 0.5 });
    for (let x = TX - 5.6; x < TX + 1; x += 1.4) K.box(g, x, TY + 0.4, x + 0.8, TY + 1, 24, 25.2, TW, { w: 0.35, boil: false, nohid: true });
    for (let y = TY - 5.6; y < TY + 1; y += 1.4) K.box(g, TX + 0.4, y, TX + 1, y + 0.8, 24, 25.2, TW, { w: 0.35, boil: false, nohid: true });
    for (const [x, y] of [[TX + 1, TY + 1], [TX - 6, TY + 1], [TX + 1, TY - 6]]) { K.cyl(g, x, y, 0.8, 22, 24.6, TW, { n: 8, w: 0.5 }); K.dome(g, x, y, 0.9, 24.6, 1.4, '#F6F0DE', { w: 0.5, ribs: 6, ribCol: '#C9BFA6' }); }
  }, { name: 'torre de belem' });
  T.cast([-27.5, 49], (g) => { LX.person(g, -27.6, 48.2, 0.6, LX.who(1350, { dir: 1, pose: 'hold', reach: [0.4, -12.5], phone: true })); LX.person(g, -27.0, 51.6, 0.6, LX.who(1351, { dir: 3, pose: 'hold', reach: [0.4, -12.5], phone: true })); }, { on: true });
  T.cast([-22, 64.5], (g) => { LX.person(g, -21, 64.4, 4.2, LX.who(1352, { dir: 1, pose: 'hold' })); LX.person(g, -18, 63.8, 4.2, LX.who(1353, { dir: 0, phone: true, pose: 'hold', reach: [0.4, -12.5] })); }, { on: true });
  // a seller of cork hats on the promenade
  T.cast([-14, 40], (g) => { K.box(g, -15.4, 39.2, -12.6, 40.8, 0, 2.4, { t: '#B9824A', l: '#C9945A', r: '#A87440' }, { w: 0.45, boil: false }); for (let k = 0; k < 3; k++) { const p = g.p(-14.6 + k * 0.9, 40, 2.4); g.fill2(arcPts(p[0], p[1] - 0.2, 1.4, Math.PI, TAU, 6).concat([[p[0] + 1.9, p[1]], [p[0] - 1.9, p[1]]]), '#A87A4A', true); } LX.person(g, -16.4, 38.6, 0, LX.who(1355, { dir: 0, hat: '#A87A4A' })); });
  LX.walker(T, LX.who(1356), [[-36, 34], [20, 34]], 1.0, { phase: 0.4 });
  LX.walker(T, LX.who(1357, { hat: '#E9D8A6' }), [[-6.6, -20], [-6.6, 34]], 1.1, { phase: 0.2 });
});
