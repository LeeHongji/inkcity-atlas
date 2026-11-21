'use strict';
/* (100,0) Castelo de São Jorge on its hill.
   The hill steps up to the far corner: an outer ring of crenellated retaining wall (z 5) and the castle's own platform
   (z 11). On top, the Moorish castle: thick curtain walls with merlons on the two sides we see, square towers at the
   corners and along the walls, the keep with the green-and-red flag, a gateway with a pointed arch. In front of it the
   esplanade (Praça de Armas): bronze cannons pointing over the parapet at the river, umbrella pines, benches, a kiosk,
   and the castle's peacocks. Below, at street level, the last houses of the Castelo quarter.
   Who: tourists on the wall walk and at the cannons; children sitting astride a cannon; a peacock with its tail open
   and people photographing it; a guide and her group; a couple under a pine; someone selling cold drinks. */
SF.tile('castelo', 100, 0, { rim: 26 }, function (T) {
  const H = 37, Z1 = 5, Z2 = 11, ST = { t: '#E3DAC4', l: '#E9DFC8', r: '#CFC3A8' }, WT = 7.5;
  T.ground(function (g) { K.slab(g, H, { top: LC.calc, cut: 'x' }); LX.pave(g, -H, 23, H, H, { edge: '' }); }, { rim: true });
  // merlons along a wall top on face f
  const merlons = (g, f, p, a0, a1, z) => { for (let a = a0 + 0.3; a < a1 - 0.6; a += 1.6) { if (f === 'L') K.box(g, a, p - 0.7, a + 0.9, p, z, z + 1.1, ST, { w: 0.35, boil: false, nohid: true }); else K.box(g, p - 0.7, a, p, a + 0.9, z, z + 1.1, ST, { w: 0.35, boil: false, nohid: true }); } };

  /* ---------------- the hill: the outer ring and the castle platform ---------------- */
  T.obj([-H, -H, 30, 22], function (g) {
    LX.terrace(g, -H, -H, 30, 22, 0, Z1, { top: '#D9CFB6' });
    merlons(g, 'L', 22, -H, 30, Z1); merlons(g, 'R', 30, -H, 22, Z1);
  }, { name: 'outer ring' });
  T.obj([-H, -H, 16, 8], function (g) {
    LX.terrace(g, -H, -H, 16, 8, Z1, Z2, { top: '#D3C8AC' });
  }, { on: true, name: 'castle platform' });
  // the esplanade's paving and the stair up from the street
  T.obj([-8, 22, -2, 32], (g) => { LX.steps(g, -8, 22, -2, 32, 0, Z1, 'y'); }, { name: 'stairs' });

  /* ---------------- the castle ---------------- */
  // the curtain walls on the south and east of the platform, towers, the keep
  T.obj([-H, -H, 14, -30], (g) => { K.box(g, -H, -H, 14, -31, Z2, Z2 + WT, ST, { w: 0.8 }); merlons(g, 'L', -31, -H, 14, Z2 + WT); }, { on: true, name: 'north wall' });
  T.obj([-H, -31, -31, 6], (g) => { K.box(g, -H, -31, -32, 6, Z2, Z2 + WT, ST, { w: 0.8 }); merlons(g, 'R', -32, -31, 6, Z2 + WT); }, { on: true, name: 'west wall' });
  // the keep and the inner towers, with the courtyard between (pines inside)
  T.obj([-26, -28, -16, -18], (g) => { K.box(g, -26, -28, -16, -18, Z2, Z2 + 15, ST, { w: 0.95 }); merlons(g, 'L', -18, -26, -16, Z2 + 15); merlons(g, 'R', -16, -28, -18, Z2 + 15); K.win(g, 'L', -18, -22, -20, Z2 + 9, Z2 + 11.5, { style: 'slit', arch: true }); K.win(g, 'R', -16, -24, -22, Z2 + 6, Z2 + 8.5, { style: 'slit', arch: true }); }, { on: true, name: 'keep' });
  [[-10, -24], [0, -22], [-20, -8]].forEach(([x, y], i) => T.obj([x, y], (g) => LX.pine(g, x, y, { z: Z2, h: 8, r: 4.4, seed: 50 + i }), { on: true, name: 'pine' }));
  T.obj([-H, 0, 14, 6], function (g) {          // the south curtain with its towers and the gate
    K.box(g, -H, 0, 14, 6, Z2, Z2 + WT, ST, { w: 0.9 }); merlons(g, 'L', 6, -H, 14, Z2 + WT);
    for (const x of [-28, -12, 4]) { K.box(g, x - 3, -1, x + 3, 7.4, Z2, Z2 + WT + 4, ST, { w: 0.9 }); merlons(g, 'L', 7.4, x - 3, x + 3, Z2 + WT + 4); merlons(g, 'R', x + 3, -1, 7.4, Z2 + WT + 4); K.win(g, 'L', 7.4, x - 0.5, x + 0.5, Z2 + 6, Z2 + 8.5, { style: 'slit', arch: true }); }
    const gt = [K.pt('L', 6.05, -21.5, Z2), K.pt('L', 6.05, -18.5, Z2)]; for (let k = 0; k <= 8; k++) { const t = Math.PI * k / 8; gt.push(K.pt('L', 6.05, -20 + 1.5 * Math.cos(t), Z2 + 3.4 + 1.8 * Math.sin(t) * (1 - Math.abs(Math.cos(t)) * 0.15))); } g.fill(gt, '#3A3128'); g.line(gt.slice(1), { w: 0.5, boil: false });
  }, { on: true, name: 'south wall' });
  T.obj([10, -31, 16, 6], function (g) {          // the east curtain, a corner tower
    K.box(g, 10, -31, 16, 0, Z2, Z2 + WT, ST, { w: 0.9 }); merlons(g, 'R', 16, -31, 0, Z2 + WT);
    K.box(g, 9.5, -33, 16.5, -26, Z2, Z2 + WT + 5, ST, { w: 0.9 }); merlons(g, 'L', -26, 9.5, 16.5, Z2 + WT + 5); merlons(g, 'R', 16.5, -33, -26, Z2 + WT + 5);
    K.win(g, 'R', 16.5, -30.5, -29.5, Z2 + 7, Z2 + 9.5, { style: 'slit', arch: true });
  }, { on: true, name: 'east wall' });
  // the flag on the keep
  T.actor({ layer: 'top', sample: 5, period: 3, at(t) { const f = Math.floor((t / 3 % 1) * 8); return { x: -21, y: -23, z: Z2 + 16.1, key: 'f' + f, f }; },
    draw(g, st) { const b = g.p(0, 0, 0), t = g.p(0, 0, 6.5); g.line2([b, t], { w: 0.5, c: '#3A3530', boil: false }); const ph = st.f / 8 * TAU, pts = []; for (let k = 0; k <= 6; k++) pts.push([t[0] + k * 1.6, t[1] + 0.3 + Math.sin(ph + k * 0.8) * 0.7 * k / 6]); const bot = pts.map((p) => [p[0], p[1] + 4.6]); g.fill2(pts.concat(bot.slice().reverse()), '#C8352E', true); g.fill2(pts.slice(0, 3).concat(bot.slice(0, 3).reverse()), '#2F7A3E', true); g.disc2([pts[2][0], pts[2][1] + 2.3], 1.0, '#E9C230'); } });

  /* ---------------- the esplanade: cannons, pines, peacocks ---------------- */
  T.obj([-H, 21.4, 30, 22], (g) => LX.parapet(g, 'L', 22, -H, -9, Z1, { h: 1.1 }), { on: true, name: 'parapet w' });
  T.obj([-1, 21.4, 30, 22], (g) => LX.parapet(g, 'L', 22, -1, 30, Z1, { h: 1.1 }), { on: true, name: 'parapet e' });
  T.obj([29.4, -H, 30, 21.4], (g) => LX.parapet(g, 'R', 30, -H, 21.4, Z1, { h: 1.1 }), { on: true, name: 'parapet r' });
  const cannon = (g, x, y) => {
    const B = '#4A5A52', b = g.p(x, y, Z1);
    for (const dx of [-1.0, 1.0]) { const c = g.p(x + dx, y + 0.4, Z1 + 0.8); g.disc2(c, 0.9, '#5E4A36'); g.ring2(c, 0.9, { w: 0.35, c: '#2E2A26' }); }
    g.line2([g.p(x - 0.4, y - 2.0, Z1 + 1.3), g.p(x, y + 1.6, Z1 + 1.1)], { w: 2.6, c: B, boil: false, ext: 0, taper: 0.3 });
    g.disc2(g.p(x, y + 1.7, Z1 + 1.1), 0.5, '#2E2A26'); void b;
  };
  for (const x of [-30, -20, 6, 16, 24]) T.obj([x, 19.5], (g) => cannon(g, x, 19.4), { on: true, name: 'cannon' });
  [[-25, 13], [12, 12], [24, 4], [-4, 14]].forEach(([x, y], i) => T.obj([x, y], (g) => LX.pine(g, x, y, { z: Z1, h: 9 + (i % 2) * 1.5, r: 5, lean: i % 2 ? -0.8 : 1.0, seed: 60 + i }), { on: true, name: 'pine' }));
  T.obj([20, -6, 26, 0], (g) => { K.box(g, 20, -6, 26, 0, Z1, Z1 + 3.4, { t: '#F3F1EA', l: '#F6F3EC', r: '#DDD7CA' }, { w: 0.6 }); K.sign(g, 'L', 0, 20.4, 25.6, Z1 + 2.2, Z1 + 3.2, '#2F4A3A', 'BEBIDAS', { ink: '#F7F1DC' }); K.hip(g, 19.6, -6.4, 26.4, 0.4, Z1 + 3.4, 1.4, LC.roof, { c: LC.roofD }); }, { on: true, name: 'kiosk' });
  // people at the cannons and the parapet, children astride a cannon
  [[-27, 20.2, 1], [-23, 20.0, 1], [9, 20.3, 1], [12.6, 20.2, 1], [20.4, 20.2, 1], [27.5, 18, 0], [27.6, 10, 0]].forEach(([x, y, d], i) => T.cast([x, y], (g) => LX.person(g, x, y, Z1, LX.who(800 + i, { dir: d, pose: i % 3 === 0 ? 'hold' : 'stand', reach: i % 3 === 0 ? [0.6, -12.5] : undefined, phone: i % 3 === 0 })), { on: true }));
  T.cast([16, 19.4], (g) => { LX.person(g, 15.6, 19.0, Z1 + 1.9, LX.who(810, { dir: 1, pose: 'sit', k: 0.72 })); LX.person(g, 16.6, 19.8, Z1, LX.who(811, { dir: 3, pose: 'hold', reach: [-2, -9] })); }, { on: true });
  // the peacocks: one with its tail open, two pecking
  const peacock = (g, x, y, open) => {
    const b = g.p(x, y, Z1), S = (u, v) => [b[0] + u * 1.6, b[1] + v * 1.6];
    if (open) {
      const fan = []; for (let k = 0; k <= 12; k++) { const a = Math.PI + Math.PI * k / 12; fan.push(S(Math.cos(a) * 6.5, -3 + Math.sin(a) * 5.5)); } fan.push(S(0, -2));
      g.fill2(fan, '#3E7A5E', true); g.outline2(fan, { w: 0.35, c: '#2A5A44', boil: false });
      for (let k = 1; k < 12; k++) { const a = Math.PI + Math.PI * k / 12; g.disc2(S(Math.cos(a) * 5.2, -3 + Math.sin(a) * 4.4), 0.8, '#2F5FA8'); g.disc2(S(Math.cos(a) * 3.4, -3 + Math.sin(a) * 2.9), 0.65, '#C9A44A'); }
    } else g.fill2([S(-0.4, -1.6), S(-4.6, -0.6), S(-4.2, -0.1), S(-0.2, -0.8)], '#3E7A5E', true);
    g.fill2([S(-1.2, -0.6), S(1.0, -0.6), S(1.2, -2.4), S(-1.0, -2.6)], '#2F5FA8', true);
    g.line2([S(0.6, -2.4), S(0.9, -4.6)], { w: 1.0, c: '#2F5FA8', boil: false }); g.disc2(S(0.9, -4.8), 0.8, '#2F5FA8');
    const c1 = S(0.9, -5.2), c2 = S(0.7, -6), c3 = S(1.2, -6); g.segs2([c1[0], c1[1], c2[0], c2[1], c1[0], c1[1], c3[0], c3[1]], '#2F5FA8', 0.3);
  };
  T.cast([2, 8.5], (g) => { peacock(g, 2, 8.5, true); LX.person(g, 5.4, 11.6, Z1, LX.who(812, { dir: 2, pose: 'hold', reach: [0.4, -12.5], phone: true })); LX.person(g, 7.4, 10.4, Z1, LX.who(813, { dir: 2, k: 0.74 })); }, { on: true });
  T.cast([-14, 16], (g) => { peacock(g, -14, 16, false); peacock(g, -16.5, 13.5, false); }, { on: true });
  T.cast([-26, 15], (g) => { LX.person(g, -27.4, 15, Z1, LX.who(814, { dir: 1, pose: 'sit' })); LX.person(g, -25.4, 15.4, Z1, LX.who(815, { dir: 1, pose: 'sit', dress: '#F2C230' })); }, { on: true });
  // the guide's group crossing the esplanade towards the gate; a walker on the wall walk; the rampart walk
  for (let i = 0; i < 5; i++) LX.walker(T, i === 0 ? LX.who(820, { top: '#3F8FD2' }) : LX.who(820 + i), [[26, 17], [-8, 17], [-20, 9], [-20, 9.1], [-8, 17.1], [26, 17.1]], 0.8, { z: Z1, phase: 0.1 - i * 0.025 });
  LX.walker(T, LX.who(830), [[-34, 9], [12, 9]], 0.7, { z: Z1, phase: 0.4 });

  // the old governor's house on the east of the ring, now a café, its terrace under a pine
  T.obj([18, -33, 28, -16], (g) => LX.house(g, { x0: 18, y0: -33, x1: 28, y1: -16, z: Z1, n: 2, col: '#EFE3C8', seed: 850, shop: 'CAFÉ', sc: '#7A2E2A', door: 'R', faces: 'LR' }), { on: true, name: 'cafe house' });
  [[23, -11], [20, -6.5]].forEach(([x, y], i) => T.cast([x, y], function (g) {
    const tt = g.p(x, y, Z1 + 2.4), tb = g.p(x, y, Z1); g.segs2([tb[0], tb[1], tt[0], tt[1]], '#5A4A3C', 0.45); g.fill2(arcPts(tt[0], tt[1], 2.4, 0, TAU, 12).map((q) => [q[0], tt[1] + (q[1] - tt[1]) * 0.5]), '#F3F1EA', true);
    for (const [dx, d, k] of [[-1.8, 0, 0], [1.8, 1, 1]]) LX.person(g, x + dx, y, Z1 + 1.3, LX.who(852 + i * 2 + k, { dir: d, pose: 'sit', beer: k === 1 }));
  }, { on: true }));
  T.obj([27, -2], (g) => LX.pine(g, 27, -2, { z: Z1, h: 10, r: 5.4, lean: -1, seed: 77 }), { on: true, name: 'pine' });

  /* ---------------- the houses below, at street level ---------------- */
  [[-36, 24, -26, 35, 2, 'b', 840], [-26, 24, -16, 34, 2, null, 841], [8, 25, 18, 35, 2, 'y', 842], [18, 24, 28, 34, 1, null, 843]].forEach(([x0, y0, x1, y1, n, az, sd]) =>
    T.obj([x0, y0, x1, y1], (g) => LX.house(g, { x0, y0, x1, y1, n, az, seed: sd, wash: true, door: 'L', shop: sd === 843 ? 'AZULEJOS' : null, sc: '#2F4F80', roof: sd === 843 ? 'flat' : 'hip' }), { name: 'house' }));
  T.cast([33, 30], (g) => { LX.person(g, 30.6, 26.4, 0, LX.who(845, { dir: 1, pose: 'stand', cap: '#C9463E' })); g.at(33, 30, 0, (g2) => LX.tuk(g2, -Math.PI / 2, { col: '#C9463E', roof: { t: '#F3F1EA', l: '#E9E4D8', r: '#D9D3C6' } })); });
  LX.walker(T, LX.who(846), [[-12, 34], [-5, 33], [-5, 22.5]], 0.9, { phase: 0.2, z: (x, y) => (x > -8 && x < -2 ? clamp((32 - y) / 10, 0, 1) * Z1 : 0) });
  LX.walker(T, LX.who(847), [[3, 36], [30, 36]], 1.0, { phase: 0.6 });
});
