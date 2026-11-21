'use strict';
/* (100,0) The Opéra and the grands boulevards. Palais Garnier turned to face the Place de l'Opéra on this tile's +y
   side: the front block with its arcade of seven arches, the loggia of paired columns with the composers' busts
   between them, the attic with gilded masks and its lettering, the corner pavilions crowned by the two gilded groups
   (Harmony and Poetry); behind, the low green copper dome of the auditorium with its gilded crown, and the tall stage
   house whose green gable carries Apollo raising his golden lyre. People sit on the wide steps. On the left, the Grand
   Hôtel with the Café de la Paix: its green-and-gold awnings, a full terrace on two sides, waiters with trays (the
   film's close-up). Far right, the Galeries Lafayette with its glass dome and flags; a lower Haussmann block with shops
   on the near right. The place: big candelabra lamps, a Morris column, a kiosk, a Métro entrance, crowds. */
SF.tile('opera', 100, 0, { rim: 48 }, function (T) {
  const H = 37, OX0 = -8, OX1 = 20, OY1 = 12, GOLD = PC.gold, COP = '#7FAE97', COPD = '#5E8E78';
  const STN = { t: '#EFE6D0', l: '#ECE0C4', r: '#D6C8A8' };
  T.ground(function (g) {
    K.slab(g, H, { top: '#E7E0D0', cut: 'x' });
    g.scuff(K.rect(-H, -H, H, H), { dir: -0.6, len: 3, c: '#F4EFE4', dens: 0.4, w: 0.5, spread: 0.6 });
    const gr = []; for (let a = -H; a < H; a += 4) { const p = g.p(a, 14, 0), q = g.p(a, H, 0); gr.push(p[0], p[1], q[0], q[1]); } g.segs2(gr, '#D9D1BF', 0.3);
    // the steps up to the front
    for (let i = 0; i < 4; i++) { const y = OY1 + 3 - i * 0.75, q = [[OX0 - 1, y - 0.75, 0.3 * i + 0.3], [OX1 + 1, y - 0.75, 0.3 * i + 0.3], [OX1 + 1, y, 0.3 * i + 0.3], [OX0 - 1, y, 0.3 * i + 0.3]]; g.fill(q, i % 2 ? '#EAE2CF' : '#E2D9C4'); g.fill([[OX0 - 1, y, 0.3 * i], [OX1 + 1, y, 0.3 * i], [OX1 + 1, y, 0.3 * i + 0.3], [OX0 - 1, y, 0.3 * i + 0.3]], '#CFC4AC'); g.line([[OX0 - 1, y, 0.3 * i + 0.3], [OX1 + 1, y, 0.3 * i + 0.3]], { w: 0.4, c: '#A99A7B', boil: false }); }
    // the alley between the Opéra and the shops on the right
    g.fill(K.rect(21, -H, 24, 15), PC.asph);
  }, { rim: true });

  /* ---------------- Palais Garnier ---------------- */
  // the stage house (far) with Apollo on its gable
  T.obj([-6, -28, 18, -14], function (g) {
    g.boilP = 0.3;
    K.box(g, -6, -28, 18, -14, 0, 17, STN, { w: 0.9 });
    for (let a = -4; a < 17; a += 3) PA.win(g, 'L', -14, a, a + 1.2, 8, 12, { pane: '#5E6B76' });
    K.gable(g, -6.3, -28.3, 18.3, -13.7, 17, 6.5, 'y', { a: COP, b: COPD, e: '#EFE6D0' }, { c: '#3E6B58' });
    // Apollo with his lyre at the gable's apex, Pegasi at its feet
    const ap = g.p(6, -13.7, 23.5); g.fill2([[ap[0] - 1.2, ap[1]], [ap[0] + 1.2, ap[1]], [ap[0] + 0.8, ap[1] - 6.2], [ap[0] - 0.8, ap[1] - 6.2]], GOLD, true); g.disc2([ap[0], ap[1] - 7.0], 0.9, GOLD);
    g.line2([[ap[0], ap[1] - 6.6], [ap[0] + 1.4, ap[1] - 11.4]], { w: 0.6, c: GOLD, boil: false }); g.fill2([[ap[0] + 0.4, ap[1] - 12.8], [ap[0] + 2.6, ap[1] - 12.2], [ap[0] + 2.0, ap[1] - 10.0], [ap[0] + 0.8, ap[1] - 10.4]], '#E6C25A', true);
    for (const x of [-5.5, 17.5]) { const c = g.p(x, -13.7, 17.2); g.fill2([[c[0] - 2.4, c[1]], [c[0] + 2.0, c[1] - 0.4], [c[0] + 2.8, c[1] - 3.0], [c[0] + 1.0, c[1] - 3.4], [c[0] - 1.8, c[1] - 2.6]], '#4E8A70', true); }
  }, { name: 'stage house' });
  // the auditorium drum and its green dome with the gilded crown
  T.obj([-4, -14, 16, 4], function (g) {
    g.boilP = 0.3;
    K.box(g, -4, -14, 16, 4, 0, 13.5, STN, { w: 0.85 });
    K.cyl(g, 6, -5, 7.6, 13.5, 15.2, STN, { w: 0.75, n: 20 });
    const ms = []; for (let k = 0; k < 10; k++) { const a = -Math.PI * 0.2 + Math.PI * 0.95 * k / 9; ms.push(g.p(6 + Math.cos(a) * 7.65, -5 + Math.sin(a) * 7.65, 14.4)); } for (const p of ms) g.disc2(p, 0.6, GOLD);
    K.dome(g, 6, -5, 7.2, 15.2, 3.8, COP, { w: 0.85, ribs: 16, ribCol: '#3E6B58', ribW: 0.45, shadow: COPD, band: true });
    const cr = g.p(6, -5, 19.0); g.fill2([[cr[0] - 2.2, cr[1]], [cr[0] + 2.2, cr[1]], [cr[0] + 1.6, cr[1] - 2.2], [cr[0] - 1.6, cr[1] - 2.2]], GOLD, true); for (let k = 0; k < 5; k++) g.disc2([cr[0] - 2 + k, cr[1] - 2.6], 0.45, GOLD); g.disc2([cr[0], cr[1] - 3.6], 0.6, GOLD);
  }, { name: 'auditorium' });
  // the front block: arcade, loggia, attic, the corner pavilions with the gilded groups
  T.obj([OX0, 4, OX1, OY1], function (g) {
    g.boilP = 0.3;
    const p = OY1, Z = 13.5;
    K.box(g, OX0, 4, OX1, OY1, 0, Z, STN, { w: 1.0 });
    // ground floor: seven arches
    for (let i = 0; i < 7; i++) { const m = OX0 + 4.6 + i * (OX1 - OX0 - 9.2) / 6, hw = 1.05, ar = [K.pt('L', p + 0.03, m - hw, 0.8), K.pt('L', p + 0.03, m + hw, 0.8)]; for (let k = 0; k <= 6; k++) { const t = Math.PI * k / 6; ar.push(K.pt('L', p + 0.03, m + Math.cos(t) * hw, 3.6 + Math.sin(t) * hw)); } g.fill(ar, '#4A4238'); g.line(ar.slice(2), { w: 0.45, boil: false }); }
    g.fill(K.on('L', p + 0.03, OX0, OX1, 5.0, 5.5), '#E2D6B8');
    // the loggia: paired columns with dark bays and gilded busts between
    for (let i = 0; i < 7; i++) { const m = OX0 + 4.6 + i * (OX1 - OX0 - 9.2) / 6; g.fill(K.on('L', p + 0.04, m - 1.0, m + 1.0, 5.8, 10.4), '#5A5246'); const w2 = g.P([K.pt('L', p + 0.05, m - 0.6, 6.6), K.pt('L', p + 0.05, m + 0.6, 9.6)]); g.fill2([[w2[0][0], w2[0][1]], [w2[1][0], w2[0][1] - 0.6], [w2[1][0], w2[1][1]], [w2[0][0], w2[1][1] + 0.6]], '#8C9AA6', true); }
    const cols = []; for (let i = 0; i <= 7; i++) { const m = OX0 + 3.5 + i * (OX1 - OX0 - 7) / 7; for (const d of [-0.35, 0.35]) { const a = g.p(m + d, p + 0.2, 5.6), b = g.p(m + d, p + 0.2, 10.8); cols.push(a[0], a[1], b[0], b[1]); } } g.segs2(cols, '#F4EEDF', 1.3);
    for (let i = 0; i < 6; i++) { const m = OX0 + 4.6 + (i + 0.5) * (OX1 - OX0 - 9.2) / 6, c = g.p(m, p + 0.1, 11.6); g.disc2(c, 0.9, GOLD); }
    // attic with lettering and masks
    g.fill(K.on('L', p + 0.03, OX0, OX1, 11.0, Z), '#E6DABD');
    const lt = g.p((OX0 + OX1) / 2, p + 0.05, 12.6); PA.letters2(g, lt, 60, 1.6, '#A9832C', 'ACADÉMIE NATIONALE DE MUSIQUE', 0.4, PA.dirOf('L'));
    for (const x of [OX0 + 1.5, OX1 - 1.5]) { const c = g.p(x, p + 0.05, 12.3); g.disc2(c, 1.4, GOLD); }
    K.box(g, OX0 - 0.3, 3.7, OX1 + 0.3, OY1 + 0.3, Z, Z + 0.6, STN, { w: 0.6, nohid: true });
    // the side face we see (R): windows
    for (let a = 5; a < OY1 - 0.5; a += 2.5) PA.win(g, 'R', OX1, a, a + 1.0, 6.4, 9.8, { pane: '#5E6B76' });
    // the corner pavilions' raised attics and the gilded groups
    for (const [x0, x1] of [[OX0, OX0 + 3.4], [OX1 - 3.4, OX1]]) {
      K.box(g, x0, 4, x1, OY1, Z + 0.6, Z + 2.6, STN, { w: 0.7, nohid: true });
      const c = g.p((x0 + x1) / 2, OY1 - 1.5, Z + 2.6);
      g.fill2([[c[0] - 3.8, c[1]], [c[0] + 3.8, c[1]], [c[0] + 3.0, c[1] - 3.2], [c[0] - 3.0, c[1] - 3.2]], '#C9A955', true);
      g.fill2([[c[0] - 1.4, c[1] - 2.8], [c[0] + 1.4, c[1] - 2.8], [c[0] + 1.0, c[1] - 8.6], [c[0] - 1.0, c[1] - 8.6]], GOLD, true); g.disc2([c[0], c[1] - 9.6], 1.0, GOLD);
      g.fill2([[c[0] - 1.0, c[1] - 7.6], [c[0] - 6.4, c[1] - 11.6], [c[0] - 5.4, c[1] - 8.2]], '#E6C25A', true); g.fill2([[c[0] + 1.0, c[1] - 7.6], [c[0] + 6.4, c[1] - 11.6], [c[0] + 5.4, c[1] - 8.2]], '#C9A040', true);
      for (const d of [-2.6, 2.6]) { g.fill2([[c[0] + d - 0.9, c[1] - 0.4], [c[0] + d + 0.9, c[1] - 0.4], [c[0] + d + 0.6, c[1] - 4.6], [c[0] + d - 0.6, c[1] - 4.6]], GOLD, true); g.disc2([c[0] + d, c[1] - 5.2], 0.7, GOLD); }
      g.line2([[c[0] - 3.8, c[1]], [c[0] - 3.0, c[1] - 3.2], [c[0] + 3.0, c[1] - 3.2], [c[0] + 3.8, c[1]]], { w: 0.4, c: '#7A5A1E', boil: false });
    }
  }, { name: 'opera front' });
  // the candelabra lamps with their bronze figures flanking the steps
  for (const x of [OX0 - 2.5, OX1 + 2.5]) T.obj([x, 15.5], (g) => { const f = g.p(x, 15.5, 0); g.fill2([[f[0] - 1.6, f[1]], [f[0] + 1.6, f[1]], [f[0] + 1.2, f[1] - 6], [f[0] - 1.2, f[1] - 6]], '#4E5A52', true); g.fill2([[f[0] - 0.5, f[1] - 6], [f[0] + 0.5, f[1] - 6], [f[0] + 0.35, f[1] - 30], [f[0] - 0.35, f[1] - 30]], '#4E5A52', true); for (const d of [-4, 0, 4]) { g.segs2([f[0], f[1] - 27, f[0] + d, f[1] - 29], '#4E5A52', 0.5); g.disc2([f[0] + d, f[1] - 30.5], 1.5, '#F2E3A6'); g.ring2([f[0] + d, f[1] - 30.5], 1.5, { c: '#7A6A3A', w: 0.35 }); } g.disc2([f[0], f[1] - 34], 1.6, '#F2E3A6'); }, { name: 'candelabra' });

  /* ---------------- the Grand Hôtel and the Café de la Paix ---------------- */
  const CAFE = { x0: -36, y0: -6, x1: -21, y1: 16 };
  T.obj([-36, -36, -21, -8], (g) => PA.haus(g, { x0: -36, y0: -36, x1: -21, y1: -8, et: 5, seed: 801, faces: 'R', shopsR: [[-34, -28, '#2F3A4F', 'shop'], [-20, -16, '#2F4A3E', 'door']], chim: [[-28.5, -35, 'x', 4]] }), { name: 'haus left far' });
  T.obj([CAFE.x0, CAFE.y0, CAFE.x1, CAFE.y1], (g) => PA.haus(g, { x0: CAFE.x0, y0: CAFE.y0, x1: CAFE.x1, y1: CAFE.y1, et: 5, seed: 802, shopsL: [[-35.4, -21.6, '#2E5B48', 'cafe']], shopsR: [[-5, 15, '#2E5B48', 'cafe']], chim: [[-28.5, -5, 'x', 4], [-35, 5, 'y', 3]] }), { name: 'grand hotel' });
  const tL = PA.terrace(T, 'L', CAFE.y1, -35.4, -21.6, { seed: 81, word: 'CAFÉ DE LA PAIX', col: '#2E5B48', stripe: '#D8AE48', z: 5.6, sp: 2.3 });
  const tR = PA.terrace(T, 'R', CAFE.x1, -4.6, 14.6, { seed: 82, word: 'CAFÉ DE LA PAIX', col: '#2E5B48', stripe: '#D8AE48', z: 5.6, sp: 2.3 });
  PA.waiter(T, tL, 3, {}); PA.waiter(T, tR, 5, { t0: 4 });
  // a newspaper seller between the terraces, a couple arriving
  T.cast([-17.6, 19.6], (g) => { const r = PA.person(g, -17.6, 19.6, 0, PA.who(1201, { dir: 1, pose: 'hold', beret: '#2A2622' })); const h = r.hands[0]; g.fill2([[h[0] - 1.6, h[1] - 0.6], [h[0] + 1.6, h[1] - 1.2], [h[0] + 1.6, h[1] + 1.2], [h[0] - 1.6, h[1] + 1.8]], '#F3EBD6', true); }, { on: true });

  /* ---------------- Galeries Lafayette and the right-hand block ---------------- */
  T.obj([24, -36, 36, -10], function (g) {
    const top = PA.haus(g, { x0: 24, y0: -36, x1: 36, y1: -10, et: 5, seed: 803, shopsL: [[25, 35, '#1E2A3A', 'glass']], shopsR: [[-35, -12, '#1E2A3A', 'glass']], mans: { dormers: 0, h: 1.6, h2: 0 } });
    K.dome(g, 30, -23, 3.6, top, 3.6, 'rgba(190,214,222,0.9)', { w: 0.7, ribs: 10, ribCol: '#5E7A86', ribW: 0.4 });
    for (const [x, y] of [[25, -10.5], [35, -10.5], [35.6, -23]]) { const b = g.p(x, y, top - 0.6), t = g.p(x, y, top + 5); g.line2([b, t], { w: 0.4, c: '#3A3530', boil: false }); g.fill2([[t[0], t[1]], [t[0] + 3.4, t[1] + 0.8], [t[0] + 3.4, t[1] + 3.0], [t[0], t[1] + 2.2]], ['#2F4A8F', '#C9463E', '#E6C24F'][Math.round(x + y) % 3 < 0 ? 0 : Math.round(x + y) % 3], true); }
    PA.sign(g, 'L', -10, 26, 34, 18.4, 19.8, '#1E2A3A', { seed: 61, word: 'GALERIES LAFAYETTE', ink: '#E6C24F' });
  }, { name: 'galeries lafayette' });
  T.obj([25, -6, 36, 15], (g) => PA.haus(g, { x0: 25, y0: -6, x1: 36, y1: 15, et: 3, seed: 804, shopsL: [[26, 34, '#7E2A24', 'shop']], shopsR: [[-5, 3, '#3F5F8F', 'shop'], [5, 14, '#2F3A4F', 'shop']], chim: [[30, -5.5, 'x', 3]] }), { name: 'haus right' });
  T.obj([26, 15, 34, 17.2], (g) => { /* the shops' awning row */ PA.awning(g, 'L', 15, 26, 34, 4.4, 2.2, { col: '#7E2A24', seed: 9 }); }, { name: 'awning right' });

  /* ---------------- the place ---------------- */
  // people on the steps: sitting, eating, taking pictures
  T.cast([6, 13.6], function (g) {
    const sp = [[-6, 13.0, 2], [-3.4, 13.8, 1], [-1.0, 13.2, 3], [2.4, 14.4, 1], [5.2, 13.0, 2], [8.6, 13.7, 1], [11.2, 14.5, 1], [14.6, 13.1, 3], [17, 13.9, 1]];
    sp.forEach(([x, y, k], i) => PA.person(g, x, y, (y < 13.5 ? 0.9 : 0.6), PA.who(1210 + i, { dir: 1, pose: k === 3 ? 'hold' : 'sit' })));
  }, { on: true, name: 'steps people' });
  T.cast([12, 22], (g) => { PA.person(g, 12, 22, 0, PA.who(1225, { dir: 3, pose: 'hold', phone: true })); PA.person(g, 13.6, 23.2, 0, PA.who(1226, { dir: 3 })); }, { on: true });
  T.cast([-6, 26], (g) => { PA.person(g, -6, 26, 0, PA.who(1227, { dir: 0, pose: 'wave', ph: 0.3 })); PA.person(g, -4.4, 26.8, 0, PA.who(1228, { dir: 1 })); }, { on: true });
  T.obj([2, 30], (g) => PA.morris(g, 2, 30), { name: 'morris' });
  T.obj([22, 27.5, 26, 32.5], (g) => PA.kiosk(g, 24, 30), { name: 'kiosk' });
  T.obj([-12.6, 27.6, -9.4, 35.4], (g) => PA.metro(g, -11, 31.5, { ax: 'y' }), { name: 'metro' });
  for (const [x, y] of [[-30, 30], [-20, 34], [32, 33]]) T.obj([x, y], (g) => PA.plane(g, x, y, { r: 3.4, h: 6.2, turn: 0.6 }), { name: 'tree' });
  for (const x of [-14, 8, 17]) T.obj([x, 33.5], (g) => PA.lamp(g, x, 33.5, {}), { name: 'lamp' });
  // crowds crossing the place, a tour group, a cyclist on a Vélib'
  PA.walker(T, PA.who(1230), [[-18, 28], [30, 28]], 1.5, { phase: 0.1 });
  PA.walker(T, PA.who(1231), [[30, 25.5], [-18, 25.5]], 1.4, { phase: 0.4 });
  PA.walker(T, PA.who(1232), [[21.7, -30], [21.7, 22]], 1.3, { phase: 0.6 });
  PA.walker(T, PA.who(1233, { baguette: true }), [[-18, 36], [20, 36]], 1.2, { phase: 0.8 });
  PA.walker(T, PA.who(1234), [[33, 20], [-18, 20]], 1.5, { phase: 0.25 });
  T.actor({ sample: 0.25, period: 16, at(t) { const u = ((t / 16) % 1 + 1) % 1, y = -40 + u * 80, a = Math.min(1, (40 - Math.abs(y)) / 5); if (a <= 0.02) return null; return { x: 23.3, y, key: 0, alpha: a < 1 ? a : null }; }, draw(g) { PA.velib(g, Math.PI / 2, { who: PA.who(1240), seed: 1240 }); } });
  PA.streetSide(T, { furn: [[41.5, -16.5, 'kiosk'], [41.5, 16, 'wallace']] });
});
