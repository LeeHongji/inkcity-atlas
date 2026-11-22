'use strict';
/* (-100,0) Süleymaniye. What it is: Sinan's great mosque for Süleyman the Magnificent on the third hill above the
   Golden Horn. Built of pale limestone: a square prayer hall whose central lead dome rises on a ring of windows, held
   by two half-domes on the qibla axis (east and west) and by buttressed tympanum walls on the sides, four little
   weight turrets at the dome's corners; in front of it (west) the arcaded courtyard with its row of small domes and
   the şadırvan in the middle; four minarets at the courtyard's corners, the two by the mosque taller with three
   balconies, the far two with two. The whole complex stands on a terrace above the city: a stone retaining wall with
   an arched gate and steps. Along its south edge the row of medrese cells, each with its own little dome. In the
   garden east of the mosque Süleyman's octagonal tomb among cypresses and turbaned gravestones. Below the terrace, the
   street of bean restaurants (KURU FASULYE) with their tables out, and on the east edge the avenue's ramp up to the
   Galata Bridge.
   Who is there: people at the terrace parapet looking out over the Horn, a family on the steps, a man washing at the
   fountain, students under the arcade, diners at the bean restaurants, a porter with a towering load of boxes, cats in
   the cemetery. What moves: walkers on the terrace and the street, the porter, pigeons, a flag. */
SF.tile('suleymaniye', -100, 0, { rim: 8, order: -1.2 }, function (T) {
  const H = 37, TZ = 3.4, TX0 = -35, TY0 = -25, TX1 = 24, TY1 = 23;   // the terrace
  const S = { t: IS.C.lime, l: IS.C.limeL, r: IS.C.limeD };
  T.ground(function (g) {
    IS.ground(g, -H, -28, H, H, '#E4DCCA', { water: 'n' });
    IS.paving(g, -H, -28, H, H, { len: 2.4 });
    g.fill(K.rect(TX1, -28, H, H), '#E9E2D2');                              // the street below the terrace (east)
    g.fill(K.rect(-H, TY1, H, H), '#E9E2D2');                               // and south
  }, { rim: true });

  /* ---- the south ramp of the Galata Bridge ---- */

  /* ---- the terrace: retaining walls, the gate and steps on the east side, the garden on top ---- */
  T.obj([TX0, TY0, TX1, TY1], function (g) {
    g.boilP = 0.3;
    K.box(g, TX0, TY0, TX1, TY1, 0, TZ, { t: '#DCD3BE', l: '#CFC5AE', r: '#BDB29A' }, { w: 0.9 });
    const st = []; for (let z = 0.85; z < TZ; z += 0.85) { for (const [f, p, a0, a1] of [['L', TY1, TX0, TX1], ['R', TX1, TY0, TY1]]) { const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z)); st.push(a[0], a[1], b[0], b[1]); } }
    g.segs2(st, '#B3A88F', 0.3);
    g.fill(K.rect(TX0 + 0.5, TY0 + 0.5, TX1 - 0.5, TY1 - 0.5, TZ), '#E5DDCB');
    // the cemetery garden east of the mosque
    g.fill(K.rect(10, -22, TX1 - 1, 4, TZ + 0.01), '#B9CF92'); g.grass(K.rect(10, -22, TX1 - 1, 4, TZ + 0.01), { dens: 0.7 });
    // the gate in the east wall, steps down to the street
    const q = [[TX1 + 0.02, 0.5, 0], [TX1 + 0.02, 5.5, 0]]; for (let k = 0; k <= 8; k++) { const t = Math.PI * k / 8; q.push([TX1 + 0.02, 3 + 2.5 * Math.cos(t), TZ - 0.4 + 0.9 * Math.sin(t)]); } g.fill(q, '#6E6658');
    for (let i = 0; i < 4; i++) K.box(g, TX1, 7 + i * 0.01, TX1 + 4 - i, 12, 0, TZ * (i + 1) / 4, { t: '#E2DACA', l: '#D3CAB6', r: '#BFB6A2' }, { w: 0.5 });
    // the parapet along the north edge (people lean on it, looking at the Horn)
    g.fill(K.rect(TX0, TY0, TX1, TY0 + 0.8, TZ + 1.0), '#DCD3BE'); g.line([[TX0, TY0 + 0.8, TZ + 1.0], [TX1, TY0 + 0.8, TZ + 1.0]], { w: 0.5, boil: false });
    for (const x of [-31, -18, -4, 12]) g.glow('lamp', x, TY0 + 0.4, TZ + 1.6, { r: 0.9, base: TZ });   // at night lamps on the parapet
  }, { name: 'terrace' });

  /* ---- the mosque and its courtyard (the courtyard on the near side, so it can be seen) ---- */
  T.obj([-14, -22, 10, -1], (g) => g.at(0, 0, TZ, (g2) => IS.mosque(g2, { cx: -2, cy: -11.5, s: 12, sx: 12, sy: 10.5, H: 9.5, R: 5.6, semis: ['y-', 'y+'], towers: true, domeH: 0.92 })), { on: true, name: 'süleymaniye' });
  IS.avlu(T, -14, -1, 10, 19, { d: 3, H: 5.0, z0: TZ, near: 's' });
  // the four minarets at the courtyard's corners
  for (const [x, y, h, nb] of [[-14.7, -1.6, 33, 3], [10.7, -1.6, 33, 3], [-14.7, 19.7, 27, 2], [10.7, 19.7, 27, 2]]) {
    T.obj([x, y], (g) => IS.minaret(g, x, y, h, { r: 0.85, z0: TZ, bal: nb === 3 ? [h * 0.5, h * 0.64, h * 0.76] : [h * 0.56, h * 0.72] }), { on: true, name: 'minaret' });
  }
  // the medrese row along the west edge: cells with a little dome each, chimneys
  T.obj([-34, -22, -28, 20], function (g) {
    const i0 = g.cmds.length;
    K.box(g, -34, -22, -28, 20, TZ, TZ + 3.4, S, { w: 0.7 });
    for (let y = -20.5; y < 19; y += 3) { K.win(g, 'R', -27.98, y + 0.8, y + 1.8, TZ + 0.8, TZ + 2.4, { style: 'dark', arch: true, col: '#4E5866', w: 0.3 }); IS.dome(g, -31, y + 1.3, 1.25, TZ + 3.4, { drum: 0.2, win: 0, h: 1.0, ribs: 0, alem: false, w: 0.45 }); }
    for (const y of [-14, -2, 11]) K.box(g, -33.6, y, -33, y + 0.6, TZ + 3.4, TZ + 5.2, '#CDC3AE', { w: 0.4 });
    IS.flood(g, i0, 0.55);   // at night softly floodlit with the mosque
  }, { on: true, name: 'medrese' });
  // Süleyman's tomb: an octagon with a dome and a portico, cypresses, gravestones
  T.obj([12, -18, 20, -10], (g) => g.at(0, 0, TZ, (g2) => IS.floodlit(g2, 0.62, null, () => {
    K.cyl(g2, 16, -14, 3.4, 0, 6.2, S, { n: 8, w: 0.75, nt: true });
    for (let i = 0; i < 4; i++) { const a = A_L + (A_R - A_L) * (i + 0.5) / 4, q = []; for (const [dz, da] of [[1.4, -0.12], [1.4, 0.12], [4.6, 0.12], [4.6, -0.12]]) q.push([16 + 3.42 * Math.cos(a + da), -14 + 3.42 * Math.sin(a + da), dz]); g2.fill(q, '#4E5866'); }
    IS.dome(g2, 16, -14, 3.1, 6.2, { drum: 0.6, win: 0, h: 2.8, ribs: 10 });
  })), { on: true, name: 'tomb' });
  for (const [x, y] of [[11.5, -5], [21.5, -20], [22, -6], [12, 1.5], [20, 2]]) T.obj([x, y], (g) => K.cypress(g, x, y, { h: 10, r: 1.5, z: TZ }), { on: true, name: 'cypress' });
  T.cast([16, -4], (g) => { const R = RNG(55); for (let i = 0; i < 9; i++) { const x = 12 + (i % 3) * 3.4 + R() * 0.6, y = -6 + Math.floor(i / 3) * 3 + R() * 0.6, b = g.p(x, y, TZ), t = g.p(x, y, TZ + 2.2 + R() * 0.6); g.fill2([[b[0] - 0.6, b[1]], [b[0] + 0.6, b[1]], [t[0] + 0.5, t[1]], [t[0] - 0.5, t[1]]], '#EDE7DA', true); if (i % 2) g.disc2([t[0], t[1] - 0.6], 0.9, '#EDE7DA'); g.outline2([[b[0] - 0.6, b[1]], [t[0] - 0.5, t[1]], [t[0] + 0.5, t[1]], [b[0] + 0.6, b[1]]], { w: 0.3, c: '#8C8576', boil: false }); } }, { on: true, name: 'gravestones' });
  for (const [x, y] of [[-33, -21], [-20, -21], [3, -21]]) T.obj([x, y], (g) => IS.plane(g, x, y, { r: 3.6, h: 4.5, z: TZ }), { on: true, name: 'plane' });
  IS.flag(T, 22.6, 21.6, TZ + 7.4, { L: 2.4, H: 1.6 }); T.obj([22.6, 21.6], (g) => IS.pole(g, 22.6, 21.6, TZ, 7.4), { on: true, name: 'flagpole' });

  /* ---- the street below: bean restaurants on the south side, shops on the east ---- */
  T.obj([-36, 27, -16, 35], (g) => IS.konak(g, -36, 27, -16, 35, { floors: 2, col: '#E9C97E', cumba: true, shop: { word: 'KURU FASULYE', sign: '#B8322A', aw: '#B8322A' } }), { name: 'house' });
  T.obj([-12, 27, 4, 35], (g) => IS.konak(g, -12, 27, 4, 35, { floors: 2, col: '#D98F6B', shop: { word: 'LOKANTA', sign: '#2E6E5A', aw: '#E9E2D2', stripe: '#2E6E5A' } }), { name: 'house' });
  T.obj([8, 27, 22, 35], (g) => IS.konak(g, 8, 27, 22, 35, { floors: 3, col: '#B9D0A4', shop: { word: 'HIRDAVAT', sign: '#3B3F47' } }), { name: 'house' });
  T.obj([28, 4, 36, 20], (g) => IS.konak(g, 28, 4, 36, 20, { floors: 2, col: '#E6B5A8', cumba: false, shop: { word: 'KUMAŞ', sign: '#7A2E3A', aw: '#7A2E3A' } }), { name: 'house' });
  T.obj([28, -20, 36, -6], (g) => IS.konak(g, 28, -20, 36, -6, { floors: 2, col: '#EDE1BE', cumba: false, shop: { word: 'FIRIN', sign: '#6E4A33', aw: '#C9A26B' } }), { name: 'house' });
  // the bean restaurants' tables
  for (const [x, s] of [[-31, 1], [-24, 2], [-7, 3]]) T.cast([x, 25.5], (g) => { IS.stool2(g, g.p(x - 1.5, 25, 1.3)); IS.person(g, x - 1.5, 25, 1.3, IS.who(1200 + s * 2, { dir: 0, pose: 'sit' })); IS.teaTable2(g, x, 25.6, 0); IS.stool2(g, g.p(x + 1.4, 26.4, 1.3)); IS.person(g, x + 1.4, 26.4, 1.3, IS.who(1201 + s * 2, { dir: 1, pose: 'sit', cup: true })); }, { name: 'table' });

  /* ---- the living layer ---- */
  // at the north parapet, looking out over the Horn (backs to us)
  for (const [x, s] of [[-27, 1211], [-25.6, 1212], [-6, 1213], [6, 1214], [7.4, 1215]]) T.cast([x, -23.4], (g) => IS.person(g, x, -23.4, TZ, IS.who(s, { dir: 3, pose: s % 3 === 0 ? 'hold' : 'stand', phone: s % 3 === 0 })), { on: true });
  // in the courtyard: a man at the fountain, students under the arcade, a family
  T.cast([0.6, 8.8], (g) => IS.person(g, 0.6, 8.8, TZ, IS.who(1221, { dir: 2, pose: 'kneel' })), { on: true });
  T.cast([-8, 4], (g) => { IS.person(g, -8.4, 3.6, TZ, IS.who(1222, { dir: 0, pose: 'hold' })); IS.person(g, -6.8, 4.6, TZ, IS.who(1223, { dir: 2 })); }, { on: true });
  T.cast([6, 14], (g) => { IS.person(g, 6, 14, TZ, IS.who(1224, { dir: 1 })); IS.person(g, 7.4, 15, TZ, IS.who(1225, { dir: 1, k: 0.75 })); IS.person(g, 8.6, 14.2, TZ, IS.who(1226, { dir: 1, scarf: '#8E79C0', dress: '#3F5F8F' })); }, { on: true });
  // walkers on the terrace and the street, a porter
  IS.walker(T, IS.who(1231), [[-26, 21], [21, 21], [21, 6], [12, 6], [12, 21]], 1.2, { z: TZ, phase: 0.2 });
  IS.walker(T, IS.who(1232, { scarf: '#3F5F8F', dress: '#3B3F47' }), [[-24, -23.6 + 2], [10, -23.6 + 2], [10, -23.6 + 3.4], [-24, -23.6 + 3.4]], 1.1, { z: TZ, phase: 0.5 });
  IS.walker(T, IS.who(1233, { load: 'boxes', top: '#8A7A64', bot: '#5A4A3C', cap: '#3B3F47', scarf: undefined, dress: undefined }), [[33, -24], [33, 22], [30, 25], [33, -24]], 0.8, { phase: 0.1 });
  IS.walker(T, IS.who(1234), [[-34, 25.2], [24, 25.2]], 1.2, { phase: 0.4 });
  IS.walker(T, IS.who(1235, { tray: true, top: '#F3F1EA', scarf: undefined }), [[26, 24.5], [-30, 24.5]], 1.1, { phase: 0.7 });
  IS.cat(T, 18, -0.6, TZ, { c: 5, pose: 'loaf' });
  IS.cat(T, 13.5, -9, TZ, { c: 0, pose: 'sit', fl: -1 });
  IS.cat(T, -10, 24.6, 0, { c: 1, pose: 'sit' });
});
