'use strict';
/* (100,100) Alfama, between the castle hill and the river.
   The lane: Rua de São João da Praça running into Rua do Limoeiro, one tram track wide, bending past the Sé. It is
   grey setts with a thin white kerb each side and one pair of rails; the wire hangs over it from brackets on the house
   fronts. North of it: the Sé, a Romanesque fortress-church, two crenellated towers either side of a deep porch with
   the rose window above, the nave and the lantern behind; then a row of tall narrow houses with azulejo fronts, iron
   balconies, washing and basil pots, backing onto a terrace of upper-Alfama houses (z 6); and at the east end the
   Miradouro de Santa Luzia, a terrace (z 8) whose retaining wall stands right on the lane, with tile panels on the
   wall, a pergola, the little church, and people leaning on the parapet watching the trams below. South of the lane
   lower Alfama is single-storey (so the lane and the trams in it stay in sight), roof terraces with washing and
   basil, and in front, by the river, the Largo do Chafariz de Dentro: a tasca with its tables out, a fadista in her
   black shawl between two guitarists, a sardine grill smoking, garlands across.
   What moves: tram 28 in both directions (src/37_traffic.js), and the people in the lane, who stop and flatten
   themselves against the house fronts whenever a tram comes by (the moment of this place). */
SF.tile('alfama', 100, 100, { rim: 40 }, function (T) {
  const H = 37, LW = 4.7;
  // the lane's centre line in tile-local coordinates (from LXT, world)
  const LN = LXT.LANE.map((p) => [p[0] - 100, p[1] - 100]);
  const laneY = (x) => { for (let i = 0; i < LN.length - 1; i++) { const a = LN[i], b = LN[i + 1]; if ((x <= a[0] && x >= b[0]) || (x >= a[0] && x <= b[0])) return lerp(a[1], b[1], (x - a[0]) / ((b[0] - a[0]) || 1)); } return x > 0 ? LN[0][1] : LN[LN.length - 1][1]; };
  const edgeN = (x0, x1) => { let m = 1e9; for (let x = x0; x <= x1 + 0.01; x += 0.5) m = Math.min(m, laneY(x) - LW); return m; };
  const edgeS = (x0, x1) => { let m = -1e9; for (let x = x0; x <= x1 + 0.01; x += 0.5) m = Math.max(m, laneY(x) + LW); return m; };
  const side = (k) => { const out = []; for (let x = -H; x <= H + 0.01; x += 1) out.push([x, laneY(x) + k]); return out; };
  const ZA = 6, ZB = 8;

  T.ground(function (g) {
    K.slab(g, H, { top: LC.calc, cut: 'x' });
    g.boilP = 0.15;
    // the lane: setts between two thin kerbs; one pair of rails
    const n = side(-LW), s = side(LW);
    g.fill(n.concat(s.slice().reverse()).map((p) => [p[0], p[1], 0.01]), LC.setts);
    g.scuff(n.concat(s.slice().reverse()).map((p) => [p[0], p[1], 0.01]), { dir: Math.atan2(AY, AX), len: 0.9, c: LC.settsD, dens: 1.2, w: 0.4, spread: 1.2 });
    for (const k of [-LW + 0.9, LW - 0.9]) g.line(side(k).map((p) => [p[0], p[1], 0.02]), { w: 0.4, c: '#A39C8E', boil: false });
    for (const k of [-0.72, 0.72]) g.fine(side(k).map((p) => [p[0], p[1], 0.03]), { w: 0.42, c: LC.rail });
    // the largo by the river: calçada with a black wave border and the fountain basin
    LX.pave(g, -H, 27, H, H, { edge: 's', z: 0.005 });
    const bas = K.arc(24, 32, 0.02, 2.6, 0, TAU, 20); g.fill(bas, '#D9D2C2'); g.fill(K.arc(24, 32, 0.03, 2.0, 0, TAU, 20), LC.water); g.outline(bas, { w: 0.5, boil: false });
  }, { rim: true });

  /* ---------------- north of the lane: the Sé ---------------- */
  const SE = { t: '#E3DCCB', l: '#EFE9DC', r: '#D9D1BF' }, yF = 2.4, DXS = 11;   // the Sé is drawn about x = -24 and moved 11 east
  T.obj([-29 + DXS, -34, -19 + DXS, -6], (g0) => g0.at(DXS, 0, 0, function (g) {      // the nave and the crossing lantern behind the towers
    g.boilP = 0.3;
    K.box(g, -29, -34, -19, -6, 0, 13, SE, { w: 0.9 });
    for (let y = -31; y < -8; y += 4.5) { K.win(g, 'R', -19, y - 0.5, y + 0.5, 6, 10, { style: 'slit', arch: true }); }
    LX.roof(g, -29, -34, -19, -6, 13, 3.0, { ridge: 18 });
    K.box(g, -27.5, -22, -20.5, -15, 13, 19, SE, { w: 0.8 });
    for (const [f, p, a] of [['L', -15, -24], ['R', -20.5, -18.5]]) K.win(g, f, p, a - 0.6, a + 0.6, 14.5, 17.5, { style: 'slit', arch: true });
    K.hip(g, -27.9, -22.4, -20.1, -14.6, 19, 2.6, '#C9C2B2', { c: '#6E665A' });
  }), { name: 'se nave' });
  T.obj([-35 + DXS, -6, -13 + DXS, yF], (g0) => g0.at(DXS, 0, 0, function (g) {        // the west front: two towers, the porch, the rose
    g.boilP = 0.35;
    const tower = (x0, x1) => {
      K.box(g, x0, -6, x1, yF, 0, 19.5, SE, { w: 1 });
      // battlements
      for (let x = x0 + 0.4; x < x1 - 0.5; x += 1.6) K.box(g, x, yF - 0.8, x + 0.9, yF, 19.5, 20.6, SE, { w: 0.4, boil: false, nohid: true });
      for (let y = -5.6; y < yF - 0.5; y += 1.6) K.box(g, x1 - 0.8, y, x1, y + 0.9, 19.5, 20.6, SE, { w: 0.4, boil: false, nohid: true });
      K.win(g, 'L', yF, (x0 + x1) / 2 - 0.9, (x0 + x1) / 2 + 0.9, 13, 17, { style: 'dark', arch: true });
      K.win(g, 'L', yF, (x0 + x1) / 2 - 0.5, (x0 + x1) / 2 + 0.5, 6.5, 9, { style: 'slit', arch: true });
      g.fill(K.on('L', yF + 0.04, x0, x1, 0, 0.8), '#D3CBB8');
    };
    tower(-35, -27); tower(-21, -13);
    K.box(g, -27, -5, -21, yF - 1.2, 0, 15, SE, { w: 0.9 });
    // the porch: stepped arches round a dark door
    for (let k = 0; k < 3; k++) { const r = 2.6 - k * 0.55, pts = [K.pt('L', yF - 1.15 + k * 0.01, -24 - r, 0), K.pt('L', yF - 1.15, -24 + r, 0)]; for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10; pts.push(K.pt('L', yF - 1.15 + k * 0.01, -24 + r * Math.cos(t), 5.2 + r * Math.sin(t))); } g.fill(pts, ['#D9D1BF', '#C9C0AC', '#5E4A36'][k]); if (k < 2) g.line(pts.slice(1), { w: 0.35, c: '#8C8270', boil: false }); }
    const rose = g.p(-24, yF - 1.1, 10.4); g.disc2(rose, 6.2, '#D9D1BF'); g.disc2(rose, 4.6, '#4E5E76'); g.ring2(rose, 6.2, { w: 0.5, c: '#8C8270' });
    const sp = []; for (let k = 0; k < 12; k++) { const a = TAU * k / 12; sp.push(rose[0], rose[1], rose[0] + Math.cos(a) * 4.6, rose[1] + Math.sin(a) * 4.6 * 0.95); } g.segs2(sp, '#D9D1BF', 0.45);
    for (let x = -26.8; x < -21.2; x += 1.5) K.box(g, x, yF - 2.0, x + 0.8, yF - 1.2, 15, 15.9, SE, { w: 0.35, boil: false, nohid: true });
  }), { name: 'se front' });

  /* ---------------- north of the lane: the house row and the upper terrace ---------------- */
  // the upper-Alfama terrace behind the row, its houses
  T.obj([-6, -37, 15, -9], (g) => {
    LX.terrace(g, -6, -37, 15, -9, 0, ZA, { top: '#E9E2D2' });
  }, { name: 'terrace A' });
  [[-5, -36, 4, -25, 2, 'y', 31], [4, -35, 15, -26, 2, 'b', 33], [-5, -21, 4, -12, 1, null, 34], [5, -21, 14, -11.5, 1, 'g', 35]].forEach(([x0, y0, x1, y1, n, az, sd]) =>
    T.obj([x0, y0, x1, y1], (g) => LX.house(g, { x0, y0, x1, y1, z: ZA, n: n + 1, az, seed: sd, wash: sd % 2 === 1, roof: sd === 34 ? 'flat' : 'hip' }), { on: true, name: 'upper house' }));
  // the row on the lane: tall narrow fronts with tiles, balconies, washing; an old lady at her window
  const ROW = [[-2, 6.5, 3, 'b', 42, 'MERCEARIA'], [6.5, 15, 3, 'g', 43, 'GINJINHA']];
  ROW.forEach(([x0, x1, n, az, sd, shop]) => {
    const y1 = edgeN(x0, x1) - 0.15;
    T.obj([x0, -9, x1, y1], function (g) {
      LX.house(g, { x0, y0: -9, x1, y1, n, az, seed: sd, wash: true, shop, sc: sd === 43 ? '#7A2E2A' : '#2F4A3A', door: 'L', bal: 0.9, faces: 'LR' });
      // a bracket from the front holding the tram wire over the lane, and the wire along this stretch
      const m = (x0 + x1) / 2, w0 = [m, y1, 12.4], w1 = [m, laneY(m), 12.6]; g.fine([w0, w1], { w: 0.35, c: '#3A3530' });
      g.fine([[x0, laneY(x0), 12.6], [m, laneY(m), 12.55], [x1, laneY(x1), 12.6]], { w: 0.28, c: '#3A3530' });
      if (sd === 42) {   // the old lady at the first-floor window, elbows on the sill
        const wy = y1 + 0.1; LX.person(g, (x0 + x1) / 2 - 1.4, wy, LX.GF + 0.6, LX.who(4301, { dir: 1, noLegs: true, hair: '#D9D5CB', hairStyle: 'bun', top: '#2F343B', glasses: true }));
      }
    }, { name: 'row house' });
  });
  // the wire in front of the Sé and the miradouro wall
  T.obj([-37, 4, -2, 5.5], (g) => { for (const [a, b] of [[-37, -25], [-25, -13], [-13, -2]]) g.fine([[a, laneY(a), 12.6], [(a + b) / 2, laneY((a + b) / 2), 12.5], [b, laneY(b), 12.6]], { w: 0.28, c: '#3A3530' }); const p = [-13, laneY(-13), 12.6]; g.fine([p, [-13, yF + 0.2, 12.4]], { w: 0.35, c: '#3A3530' }); }, { name: 'wire' });

  /* ---------------- the Largo at the lane mouth: Santo António, benches, a ginjinha stand ---------------- */
  T.obj([-37, -37, -25, -16], (g) => { LX.terrace(g, -37, -37, -25, -16, 0, ZA, { top: '#E9E2D2' }); }, { name: 'terrace W' });
  T.obj([-36, -35, -27, -24], (g) => LX.house(g, { x0: -36, y0: -35, x1: -27, y1: -24, z: ZA, n: 2, col: LC.rose, seed: 36, wash: true }), { on: true, name: 'upper house' });
  T.ground(function (g) { LX.waves(g, -36, -14, -25.5, 2.4, { axis: 'y', amp: 1.2, wl: 6, band: 1.0, gap: 2.6, z: 0.01 }); });
  T.obj([-30.5, -8.5, -28.5, -6.5], function (g) {      // the saint on a stepped pedestal, the Child in his arm, flowers and candles at his feet
    K.box(g, -30.5, -8.5, -28.5, -6.5, 0, 0.7, K.STONE, { w: 0.5 }); K.box(g, -30, -8, -29, -7, 0.7, 3.6, K.STONE, { w: 0.55 });
    const b = g.p(-29.5, -7.5, 3.6); g.fill2([[b[0] - 1.6, b[1]], [b[0] + 1.6, b[1]], [b[0] + 1.1, b[1] - 7.5], [b[0] - 1.1, b[1] - 7.5]], '#6E5A44', true); g.disc2([b[0], b[1] - 8.6], 1.2, '#E9D2B4'); g.fill2(arcPts(b[0], b[1] - 8.9, 1.25, Math.PI, TAU, 6), '#4A3A2C', true);
    g.disc2([b[0] + 1.0, b[1] - 5.2], 0.8, '#F2DCC0'); g.ring2([b[0], b[1] - 9.2], 1.9, { w: 0.35, c: '#C9A44A' });
    const f = g.p(-29.5, -6.3, 0.7), R = RNG(5); for (let i = 0; i < 9; i++) g.disc2([f[0] + (R() - 0.5) * 6, f[1] - R() * 1.6], 0.6, R.pick(LC.festa)); g.segs2([f[0] - 2, f[1], f[0] - 2, f[1] - 2.2, f[0] + 2.4, f[1] + 0.2, f[0] + 2.4, f[1] - 1.8], '#F7F5EF', 0.5);
  }, { name: 'santo antonio' });
  for (const [x, y] of [[-34, -3.5], [-26.5, -11.5]]) T.obj([x, y], (g) => K.bench(g, x, y, { face: 'L', L: 2.2, col: '#4F7A5E' }), { name: 'bench' });
  T.obj([-34.5, -12], (g) => K.tree(g, -34.5, -12, { r: 3.4, h: 4.2, col: '#7FA65A' }), { name: 'lemon tree' });
  T.cast([-34, -3.5], (g) => { LX.person(g, -34, -3.5, 1.3, LX.who(4390, { dir: 1, pose: 'sit', hair: '#D9D5CB', top: '#2F343B', cap: '#2F343B' })); LX.person(g, -34.4, -1.4, 1.3, LX.who(4391, { dir: 1, pose: 'sit', hair: '#BDB8AE', dress: '#3B3F47' })); });
  T.cast([-27.5, -4], function (g) {     // the ginjinha stand: a little counter, bottles, two tourists with tiny cups
    K.box(g, -28.6, -5, -26.4, -3, 0, 3.0, { t: '#7A2E2A', l: '#8E3A32', r: '#6E2A24' }, { w: 0.5, boil: false });
    K.sign(g, 'L', -3, -28.5, -26.5, 2.0, 2.8, '#F2E3C0', 'GINJINHA', { ink: '#7A2E2A' });
    const t = g.p(-27.5, -4, 3.0); for (let i = 0; i < 3; i++) g.fill2([[t[0] - 1.2 + i * 1.1, t[1]], [t[0] - 0.8 + i * 1.1, t[1]], [t[0] - 0.8 + i * 1.1, t[1] - 2.2], [t[0] - 1.2 + i * 1.1, t[1] - 2.2]], '#5E1A2A', true);
    LX.person(g, -27.6, -6.6, 0, LX.who(4392, { dir: 0, pose: 'stand', noLegs: false }));
    LX.person(g, -25.6, -1.4, 0, LX.who(4393, { dir: 2, pose: 'hold', beer: false })); LX.person(g, -27.9, -0.6, 0, LX.who(4394, { dir: 3, pose: 'hold' }));
  }, { name: 'ginjinha' });

  /* ---------------- the Miradouro de Santa Luzia ---------------- */
  const mw = (x) => edgeN(x, x) - 0.15;
  const MW = [[18.5, 26, Math.min(mw(18.5), mw(26))], [26, H, Math.min(mw(26), mw(H))]];
  const SY = edgeN(15.5, 18.5) - 0.2;   // the stairs' foot on the lane (they are drawn with the first wall piece, so no cycle in the sort)
  // one object for the whole terrace (both wall pieces and the stairs), so the things standing on it sort without cycles
  T.obj([15.5, -37, H, Math.max(MW[0][2], SY)], function (g) {
    MW.forEach(([x0, x1, y1], i) => {
      if (!i) { K.box(g, 15.5, -9, 18.5, -6, 0, ZB, { t: '#EEE8DA', l: LC.wall, r: LC.wallD }, { w: 0.7 }); LX.steps(g, 15.5, -6, 18.5, SY, 0, ZB, 'y'); }
      LX.terrace(g, x0, -37, x1, y1, 0, ZB, { top: '#EEE8DA' });
      // the tile panels on the wall, a little fountain at its foot
      LX.azulejo(g, 'L', y1, x0 + 1.5, x1 - 1.5, 2.2, ZB - 1.2, 'w', 5 + i);
      g.outline(K.on('L', y1 + 0.05, x0 + 1.5, x1 - 1.5, 2.2, ZB - 1.2), { w: 0.45, c: '#2F4F80', boil: false });
      const ar = K.on('L', y1 + 0.06, x0 + 1.5, x1 - 1.5, 2.2, ZB - 1.2), P = g.P(ar), cx = (P[0][0] + P[2][0]) / 2, cy = (P[0][1] + P[2][1]) / 2;
      g.ring2([cx, cy], 3.2, { w: 0.5, c: '#2F4F80' }); g.segs2([cx - 2, cy + 1, cx + 2, cy - 1, cx - 2, cy - 1, cx + 2, cy + 1], '#2F4F80', 0.4);
      // the wire along the wall
      g.fine([[x0, laneY(x0), 12.6], [(x0 + x1) / 2, laneY((x0 + x1) / 2), 12.5], [x1, laneY(x1), 12.6]], { w: 0.28, c: '#3A3530' });
      const m = (x0 + x1) / 2; g.fine([[m, y1, ZB + 0.6], [m, laneY(m), 12.6]], { w: 0.35, c: '#3A3530' });
    });
  }, { name: 'miradouro' });
  // the stairs up from the lane to the terrace
  // the parapet along the terrace edge (pieces), with tile insets
  for (const [x0, x1, y1] of [[MW[0][0] + 0.1, MW[0][1], MW[0][2]], [MW[1][0], H - 0.6, MW[1][2]]]) { T.obj([x0, y1 - 0.6, x1, y1], (g) => LX.parapet(g, 'L', y1, x0, x1, ZB, { az: 'b', seed: 9 }), { on: true, name: 'parapet' }); }
  T.obj([H - 0.6, -37, H, MW[1][2] - 0.6], (g) => LX.parapet(g, 'R', H, -36, MW[1][2] - 0.6, ZB, {}), { on: true, name: 'parapet e' });
  // the little church of Santa Luzia, the pergola, a jacaranda
  T.obj([24, -36, 36, -26], function (g) {
    K.box(g, 24, -36, 36, -26, ZB, ZB + 9, { t: '#E9E3D6', l: '#F6F3EB', r: '#E1DBCE' }, { w: 0.85 });
    LX.door(g, 'L', -26, 28.5, 31.5, ZB, 4.0, '#6B4A33');
    K.win(g, 'L', -26, 29.3, 30.7, ZB + 5.2, ZB + 7.4, { style: 'dark', arch: true });
    const gb = [K.pt('L', -26.02, 24, ZB + 9), K.pt('L', -26.02, 36, ZB + 9), K.pt('L', -26.02, 30, ZB + 12.4)]; g.fill(gb, '#F6F3EB'); g.outline(gb, { w: 0.7, boil: false });
    K.gable(g, 24, -36, 36, -26, ZB + 9, 3.4, 'y', { a: '#C96A42', b: '#B85C38', e: '#F6F3EB' }, { c: '#7E3A22', noEnd: true });
    const c = g.p(30, -26, ZB + 12.4); g.segs2([c[0], c[1], c[0], c[1] - 3.6, c[0] - 1.1, c[1] - 2.6, c[0] + 1.1, c[1] - 2.6], '#4A4540', 0.5);
  }, { on: true, name: 'santa luzia' });
  T.obj([18, -24, 34, -16], function (g) {        // the pergola: white columns, beams, the bougainvillea over it
    const cols = []; for (let x = 18.5; x <= 33.6; x += 3) for (const y of [-23.5, -16.5]) { const a = g.p(x, y, ZB), b = g.p(x, y, ZB + 6); cols.push([a, b]); }
    for (const [a, b] of cols) { g.fill2([[a[0] - 0.7, a[1]], [a[0] + 0.7, a[1]], [b[0] + 0.7, b[1]], [b[0] - 0.7, b[1]]], '#F6F3EB'); g.line2([[a[0] + 0.7, a[1]], [b[0] + 0.7, b[1]]], { w: 0.35, c: '#9C9484', boil: false }); }
    for (const y of [-23.5, -16.5]) g.line([[18.5, y, ZB + 6.2], [33.6, y, ZB + 6.2]], { w: 0.6, c: '#8C8270', boil: false });
    const R = RNG(17), pts = []; for (let i = 0; i < 70; i++) { const p = g.p(lerp(18, 34, R()), lerp(-24, -16, R()), ZB + 6.3 + R() * 0.8); pts.push(p); }
    for (const p of pts) g.disc2(p, 1.0 + (p[0] % 3) * 0.25, ['#C9367A', '#D9488A', '#5E8A3E', '#B62E6A'][Math.floor(p[1]) % 4]);
  }, { on: true, name: 'pergola' });

  /* ---------------- south of the lane: lower Alfama ---------------- */
  const LOW = [[-37, -28, 27, 51, 'flat'], [-28, -19, 26, 52, 'hip'], [-15, -8, 25.5, 53, 'flat'], [-8, 3, 27, 54, 'tasca'], [3, 12, 26.5, 55, 'flat'], [15.5, 23, 25, 56, 'hip'], [23, 31, 26, 57, 'flat'], [31, H, 25, 58, 'hip']];
  // a long low planter wall between the lane's pavement and the houses: one object in front of the whole lane, so the
  // trams and the people in the lane all find it as the first thing in front of them and are ordered among themselves
  T.obj([-H, 18.3, H, 19.1], function (g) {
    K.box(g, -H, 18.3, H, 19.1, 0, 0.9, { t: '#E6DCC4', l: '#F2EEE3', r: '#D9D0BC' }, { w: 0.6, boil: false });
    const R = RNG(88); for (let x = -35; x < 36; x += 2.6 + R() * 2) { if (x > -17.5 && x < -13.5 || x > 11.5 && x < 15.5) continue; LX.manjerico2(g, g.p(x, 18.7, 0.9), 0.9, R.pick(LC.festa)); }
  }, { name: 'planter wall' });
  LOW.forEach(([x0, x1, y1, sd, kind]) => {
    const y0 = 19.3;
    T.obj([x0, y0, x1, y1], function (g) {
      const col = [LC.ochre, LC.pink, LC.white, '#E9C9A0', LC.sky, LC.mint, LC.rose, LC.lemon][sd % 8];
      LX.house(g, { x0, y0, x1, y1, n: 1, col: kind === 'tasca' ? '#F4F0E6' : col, seed: sd, roof: kind === 'tasca' ? 'hip' : kind, rh: 1.8, shop: kind === 'tasca' ? 'TASCA' : (sd === 57 ? 'PEIXARIA' : null), sc: '#3F5F4F', door: 'L', faces: 'LR' });
      if (kind === 'tasca') { const s = g.p(-6.6, y1 + 1.0, 4.4); g.fill2([[s[0] - 2.6, s[1]], [s[0] + 2.6, s[1]], [s[0] + 2.6, s[1] + 2.8], [s[0] - 2.6, s[1] + 2.8]], '#2F3A4F', true); K.text(g, 'L', y1 + 1.0, -6.6, 3.65, 0.55, 'FADO', '#F2C230', { center: true }); }
      if (kind === 'flat') {   // the roof terrace: washing, a basil pot, a cat
        const zt = LX.GF + 1.0, R = RNG(sd), ln = [g.p(x0 + 1, (y0 + y1) / 2, zt + 3.2), g.p(x1 - 1, (y0 + y1) / 2 + 1, zt + 3.2)];
        for (const a of [x0 + 1, x1 - 1]) { const b = g.p(a, (y0 + y1) / 2 + (a > x0 + 1 ? 1 : 0), zt), t = g.p(a, (y0 + y1) / 2 + (a > x0 + 1 ? 1 : 0), zt + 3.3); g.segs2([b[0], b[1], t[0], t[1]], '#6E6A64', 0.35); }
        void ln; LX.washing(g, 'L', (y0 + y1) / 2 + 0.5, x0 + 1.4, x1 - 1.4, zt + 3.1, sd);
        LX.manjerico2(g, g.p(x1 - 1.2, y1 - 1.0, zt + 0.9), 1.0, R.pick(LC.festa));
      }
    }, { name: 'low house' });
  });

  /* ---------------- the largo: fado, the grill, the tables ---------------- */
  T.cast([-3, 29], function (g) {
    // two guitarists on stools (the Portuguese guitar's round body), the fadista between them in her black shawl
    for (const [x, y, d, sd, rnd] of [[-6.4, 29.4, 0, 4320, true], [0.6, 29.4, 1, 4321, false]]) {
      K.box(g, x - 0.6, y - 0.6, x + 0.6, y + 0.6, 0, 1.3, { t: '#7A5A3C', l: '#8E6A48', r: '#6E4E34' }, { w: 0.35, boil: false });
      const r = LX.person(g, x, y, 1.3, LX.who(sd, { dir: d, pose: 'sit', top: '#2F343B', bot: '#2F343B', hands: [[d ? -2.4 : 2.4, -6.8], [d ? 1.8 : -1.8, -9.6]] }));
      const h = r.hip, s = d ? -1 : 1; g.fill2(arcPts(h[0] + s * 1.2, h[1] - 3.4, rnd ? 2.4 : 2.0, 0, TAU, 12).map((p) => [p[0], h[1] - 3.4 + (p[1] - h[1] + 3.4) * 1.1]), rnd ? '#C08A4A' : '#A8743D', true);
      g.line2([[h[0] + s * 1.2, h[1] - 4.4], [h[0] - s * 3.6, h[1] - 9.4]], { w: 0.7, c: '#4A3A2C', boil: false, ext: 0 });
    }
    const f = LX.person(g, -2.9, 28.8, 0, LX.who(4322, { dir: 1, pose: 'hold', dress: '#1F1A18', top: '#1F1A18', hair: '#1F1A18', hairStyle: 'bun', skin: SKIN[1] }));
    g.fill2([[f.shoulders[0][0] - 2.4, f.shoulders[0][1] - 0.4], [f.shoulders[1][0] + 2.4, f.shoulders[1][1] - 0.4], [f.hip[0] + 2.8, f.hip[1] + 2.0], [f.hip[0] - 2.8, f.hip[1] + 2.0]], '#2A2622', true);
  }, { name: 'fado' });
  // the listeners at two tables
  [[-12, 32, 4330], [5, 33, 4334]].forEach(([x, y, sd]) => T.cast([x, y], function (g) {
    const tt = g.p(x, y, 2.4), tb = g.p(x, y, 0); g.segs2([tb[0], tb[1], tt[0], tt[1]], '#5A4A3C', 0.5); g.fill2(arcPts(tt[0], tt[1], 3.4, 0, TAU, 12).map((p) => [p[0], tt[1] + (p[1] - tt[1]) * 0.5]), '#F3F1EA', true);
    g.fill2([[tt[0] - 1.2, tt[1] - 0.2], [tt[0] - 0.6, tt[1] - 0.2], [tt[0] - 0.7, tt[1] - 2.0], [tt[0] - 1.1, tt[1] - 2.0]], '#5E2A3A', true);
    for (const [dx, dy, d, k] of [[-2.2, -0.6, 0, 0], [2.2, -0.4, 1, 1], [0.2, 2.2, 2, 2]]) { K.box(g, x + dx - 0.6, y + dy - 0.6, x + dx + 0.6, y + dy + 0.6, 0.9, 1.3, { t: '#B9824A', l: '#A87440', r: '#94653A' }, { w: 0.3, boil: false }); LX.person(g, x + dx, y + dy, 1.3, LX.who(sd + k, { dir: d, pose: 'sit', beer: k === 1 })); }
  }));
  // the sardine grill, the griller in his apron, people eating sardines on bread
  T.cast([12, 31], function (g) {
    LX.grill(g, 12, 31, { axis: 'x', L: 1.9 });
    LX.person(g, 12, 28.6, 0, LX.who(4340, { dir: 1, pose: 'hold', reach: [0.5, -5.5], top: '#F7F5EF', bot: '#3F4D63', cap: '#F7F5EF' }));
    LX.person(g, 16.2, 33.2, 0, LX.who(4341, { dir: 2, pose: 'hold', sardine: true })); LX.person(g, 9.4, 34.4, 0, LX.who(4342, { dir: 3, pose: 'hold', sardine: true }));
  }, { name: 'grill' });
  T.actor({ sample: 5, period: 3, at(t) { const f = Math.floor((t / 3 % 1) * 12); return { x: 12, y: 31, z: 3.4, key: 's' + f, f }; }, draw(g, st) { LX.smoke2(g, st.f / 12, 1.1); }, layer: 'top' });
  // a mother and child going down the beco to the largo; children chasing round the fountain; a cat on a roof
  LX.walker(T, LX.who(4350, { k: 0.72 }), [[20, 30], [27, 29], [28, 35], [21, 35.5]], 1.8, { phase: 0.2 });
  LX.walker(T, LX.who(4351, { k: 0.7 }), [[20, 30], [27, 29], [28, 35], [21, 35.5]], 1.8, { phase: 0.45 });
  LX.walker(T, LX.who(4352), [[-15.5, 24], [-15.5, 33], [-24, 34], [-30, 30]], 1.0, { phase: 0.1 });
  T.cast([-23.5, 28], (g) => { const c = g.p(-23.5, 27.4, LX.GF + 2.6 + 0.4); g.fill2([[c[0] - 1.4, c[1]], [c[0] + 1.0, c[1]], [c[0] + 1.2, c[1] - 1.4], [c[0] - 1.2, c[1] - 1.2]], '#3A3530', true); g.disc2([c[0] + 1.2, c[1] - 1.8], 0.8, '#3A3530'); g.fill2([[c[0] + 0.8, c[1] - 2.4], [c[0] + 1.0, c[1] - 3.1], [c[0] + 1.3, c[1] - 2.5]], '#3A3530', true); g.line2([[c[0] - 1.4, c[1] - 0.4], [c[0] - 2.8, c[1] - 2.2]], { w: 0.4, c: '#3A3530', boil: false }); });

  /* ---------------- on the miradouro: watchers at the parapet, a busker, a couple ---------------- */
  [[20.5, 1], [23, 2], [28.6, 3], [31, 4], [34, 5]].forEach(([x, i]) => { const y = (x < 26 ? MW[0][2] : MW[1][2]) - 1.3; T.cast([x, y], (g) => LX.person(g, x, y, ZB, LX.who(4360 + i, { dir: 1, pose: 'hold', reach: [-0.4, -6.4], phone: i % 3 === 0 })), { on: true }); });
  T.cast([21, -9], (g) => { const r = LX.person(g, 21, -9, ZB, LX.who(4366, { dir: 1, pose: 'stand', hands: [[1.6, -10.4], [-2.4, -12.2]], top: '#2F3A4F', hat: '#E9D8A6' })); const h = r.hip; g.fill2(K.curve([[h[0] - 3.4, h[1] - 1.8], [h[0] + 0.6, h[1] - 5.4], [h[0] + 2.2, h[1] - 3.6], [h[0] - 1.6, h[1] + 0.2]], 3, true), '#B8743A', true); g.line2([[h[0] + 1.6, h[1] - 4.4], [h[0] + 6.4, h[1] - 8.2]], { w: 0.55, c: '#3A2A1E', boil: false }); }, { on: true });
  T.cast([22, -2], (g) => { LX.person(g, 21.4, -2, ZB, LX.who(4367, { dir: 3 })); LX.person(g, 22.8, -1.6, ZB, LX.who(4368, { dir: 2, dress: '#E77FB3' })); }, { on: true });
  T.obj([31.5, -14.5, 35.5, -10.5], function (g) {     // the quiosque: a green iron kiosk with a dome
    const c = [33.5, -12.5]; K.cyl(g, c[0], c[1], 2.0, ZB, ZB + 4.2, { t: '#4F7A5E', l: '#5E8A6A', r: '#46705A' }, { n: 8, w: 0.6 });
    const w = g.p(c[0], c[1] + 2.0, ZB + 1.4), w2 = g.p(c[0] + 1.4, c[1] + 1.4, ZB + 3.6); g.fill2([[w[0] - 3, w[1]], [w[0] + 3, w[1] - 1.5], [w2[0] + 1, w2[1]], [w2[0] - 4, w2[1] + 1.5]], '#F3E3B0', true);
    K.cyl(g, c[0], c[1], 2.4, ZB + 4.2, ZB + 4.7, { t: '#3F6A4E', l: '#4F7A5E', r: '#3A604A' }, { n: 8, w: 0.5 });
    K.dome(g, c[0], c[1], 2.2, ZB + 4.7, 2.0, '#4F7A5E', { w: 0.6 }); const t = g.p(c[0], c[1], ZB + 6.7); g.line2([t, [t[0], t[1] - 2]], { w: 0.4, c: '#2E3A32', boil: false });
  }, { on: true, name: 'quiosque' });
  [[27.5, -7], [24, -12.5], [30.5, -3.5]].forEach(([x, y], i) => T.cast([x, y], function (g) {
    const tt = g.p(x, y, ZB + 2.4), tb = g.p(x, y, ZB); g.segs2([tb[0], tb[1], tt[0], tt[1]], '#5A4A3C', 0.45); g.fill2(arcPts(tt[0], tt[1], 2.6, 0, TAU, 12).map((p) => [p[0], tt[1] + (p[1] - tt[1]) * 0.5]), '#F3F1EA', true);
    for (const [dx, dy, d, k] of [[-1.8, 0, 0, 0], [1.8, 0.3, 1, 1]]) { K.box(g, x + dx - 0.6, y + dy - 0.6, x + dx + 0.6, y + dy + 0.6, ZB + 0.9, ZB + 1.3, { t: '#B9824A', l: '#A87440', r: '#94653A' }, { w: 0.3, boil: false }); LX.person(g, x + dx, y + dy, ZB + 1.3, LX.who(4372 + i * 2 + k, { dir: d, pose: 'sit', beer: k === 1 && i !== 1 })); }
    const up = g.p(x, y, ZB + 7); g.segs2([tt[0], tt[1], up[0], up[1]], '#5A4A3C', 0.4); const um = arcPts(up[0], up[1] + 2.2, 7.6, Math.PI, TAU, 10).concat([[up[0] + 7.6, up[1] + 3.2], [up[0] - 7.6, up[1] + 3.2]]); g.fill2(um, ['#E2483D', '#F3F1EA', '#3F8FD2'][i], true); g.outline2(um, { w: 0.35, c: '#6E5A44', boil: false });
  }, { on: true }));
  T.obj([35.2, -22], (g) => LX.jacaranda(g, 35.2, -22, { z: ZB, r: 4.4, h: 5.2, fallen: true }), { on: true, name: 'jacaranda' });
  LX.walker(T, LX.who(4370), [[-8, -30], [12, -30]], 0.9, { z: ZA, phase: 0.3 });

  /* ---------------- garlands across the lane ---------------- */
  [[-8.5, 1], [0.5, 2], [10.5, 3], [-31, 4]].forEach(([x, i]) => {
    const yN = edgeN(x, x) - 0.2, yS = edgeS(x, x) + 0.2;
    LX.still(T, x, yS, 0, (g) => { const a = g.p(0, yN - yS, 10.8 - (i % 2) * 0.8), b = g.p(i % 2 ? 2.5 : -2.5, 0, 7.6); LX.garland2(g, a, b, 70 + i, { sag: 5, balloons: i % 2 === 0 }); const c = g.p(i % 2 ? 2.5 : -2.5, 0, 6.6); g.segs2([c[0], c[1], b[0], b[1]], '#6E6A64', 0.35); }, { layer: 'top' });
  });

  /* ---------------- the people in the lane: they flatten against the fronts when a tram comes ---------------- */
  const LP = LXT.LP, SL = LXT.S_LANE;
  const tramsInLane = (t) => { const out = []; for (const st of LXT.trams(t)) { let s = null; if (st.dir === 'W' && st.s < SL + 8) s = st.s; else if (st.dir === 'E' && st.s > LXT.EB.len - SL - 8) s = LXT.EB.len - st.s; if (s != null) out.push(s); } return out; };
  const PED = [[14, 0.3, 1, 4380], [30, -0.4, -1, 4381], [48, 0.6, 1, 4382], [64, -0.2, -1, 4383], [76, 0.4, 1, 4384], [40, 0.1, -1, 4385]];
  PED.forEach(([s0, v0, dirS, sd]) => {
    const who = LX.who(sd), span = 46, speed = 0.75;
    T.actor({ sample: 0.2, period: LXT.P * 2,
      at(t) {
        // a stroll up and down a stretch of the lane, stopped and pressed to the north fronts while a tram is near
        const u = ((t * speed / span + (s0 % span) / span) % 2 + 2) % 2, back = u > 1, f = back ? 2 - u : u;
        let s = clamp(s0 - span / 2 + f * span, 6, SL - 4);
        let near = 0; for (const ts of tramsInLane(t)) near = Math.max(near, 1 - Math.abs(ts - s) / 11);
        const press = smooth(clamp(near * 1.6, 0, 1));
        const p = LXT.at(LP, s), x = p.x - 100, y = p.y - 100 + lerp(v0, -(LW - 0.85), press);   // north = smaller y
        const walkDir = (dirS > 0) !== back ? 2 : 0;                            // along the lane: +s runs west (screen up-left)
        if (press > 0.2) return { x, y, key: 'p', dir: 1, pose: 'stand' };
        const ph = Math.floor(((t * speed) / 2.4 % 1) * 8);
        return { x, y, key: walkDir + '.' + ph, dir: walkDir, pose: 'walk', ph: ph / 8 };
      },
      draw(g, st) {
        LX.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: st.pose, ph: st.ph || 0, hands: st.pose === 'stand' ? [[-1.2, -8.6], [1.4, -8.8]] : undefined }));
        // an invisible tail below the feet: it makes this person's box reach the planter wall in front of the lane, as the
        // trams' boxes do, so both are drawn in that slot and ordered by depth between themselves
        const o = g.p(0, 0, 0); g.fill2([[o[0] - 0.2, o[1] + 52], [o[0] + 0.2, o[1] + 52], [o[0], o[1] + 51.6]], 'rgba(0,0,0,0)', true);
      } });
  });
});
