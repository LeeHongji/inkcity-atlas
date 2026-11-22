'use strict';
/* (-100,-100) Eling Park: the ridge at the top of the peninsula, the highest ground in the map.
   What it is: a hilltop garden on two terraces of old retaining wall (z 10 and z 22), with the Liangjiang Pavilion
   on the summit: a five-tiered tower-pavilion, each storey a gallery under its own upturned eaves, from which you see
   both rivers. Stairs climb from the park gate at street level through the terraces; figs and blossoming plum.
   Levels: the gate forecourt at z 0 (on the two streets in front), the lower terrace z 10, the summit terrace z 22;
   the far edges are the map's edge, so the tall pavilion hides nothing.
   Who: square-dancing aunties with their speaker on the lower terrace, old men who have hung their birdcages in a fig
   and play xiangqi beneath it, a man practising calligraphy with water on the paving, a couple at the summit rail,
   walkers on the stairs (one carrying a thermos).
   Moving: the dancers (in step), walkers, the birds in their cages, mist drifting past the pavilion. */
SF.tile('eling', -100, -100, { rim: 0 }, function (T) {
  const H = 37, Z1 = 10, Z2 = 22;
  T.ground(function (g) {
    K.slab(g, H, { top: '#DDD6C4' });
    g.fill(K.rect(-37, 20, 37, 37), '#D8D0BF'); g.fill(K.rect(20, -37, 37, 20), '#D8D0BF'); CQ.paving(g, -37, 20, 37, 37, 0); CQ.paving(g, 20, -37, 37, 20, 0);
  }, { rim: true });

  /* ---- the terraces and stairs ---- */
  T.obj([-37, -37, 18, 18], (g) => {
    CQ.terrace(g, -37, -37, 18, 18, 0, Z1, { top: '#C9D6AE' });
    g.grass2(g.P(K.rect(-36, -36, 17, 17, Z1)), { dens: 0.5 });
    g.fill(K.rect(-6, -6, 16, 16, Z1 + 0.02), '#DCD5C5'); CQ.paving(g, -6, -6, 16, 16, Z1);
    CQ.rail(g, 'L', 17.6, -36, 17.5, Z1, { h: 1.3 }); CQ.rail(g, 'R', 17.6, -36, 17.5, Z1, { h: 1.3 });
    CQ.railLamps(g, [-35, 17.6, Z1 + 1.4], [17.6, 17.6, Z1 + 1.4], 8.5, { base: Z1 }); CQ.railLamps(g, [17.6, -35, Z1 + 1.4], [17.6, 17.6, Z1 + 1.4], 8.5, { base: Z1, ends: false });   // park lamps on the railings (night)
  }, { name: 'lower terrace' });
  T.obj([-37, -37, -8, -8], (g) => {
    CQ.terrace(g, -37, -37, -8, -8, Z1, Z2, { top: '#DCD5C5' });
    CQ.rail(g, 'L', -8.4, -36, -8.5, Z2, { h: 1.3 }); CQ.rail(g, 'R', -8.4, -36, -8.5, Z2, { h: 1.3 });
    CQ.railLamps(g, [-34, -8.4, Z2 + 1.4], [-8.4, -8.4, Z2 + 1.4], 9, { base: Z2 }); CQ.railLamps(g, [-8.4, -34, Z2 + 1.4], [-8.4, -8.4, Z2 + 1.4], 9, { base: Z2, ends: false });
  }, { on: true, name: 'summit' });
  T.obj([2, 18, 14, 24], (g) => { CQ.steps(g, 2, 18, 14, 24, 0, Z1, 'y', { rise: 0.55 }); CQ.rail(g, 'R', 14.1, 18, 24, 0, { h: 1.1 }); }, { name: 'gate stair' });
  T.obj([-8, -24, -2, -8], (g) => { CQ.steps(g, -8, -24, -2, -8, Z1, Z2, 'x', { rise: 0.55 }); }, { on: true, name: 'summit stair' });
  // the park gate: two posts and a tiled roof over the stair foot
  T.obj([1, 25, 15, 27], (g) => { for (const x of [1.6, 14.4]) K.box(g, x - 0.6, 25.4, x + 0.6, 26.6, 0, 6.6, { t: '#B9B09C', l: '#7A4A3A', r: '#5E382C' }, { w: 0.6 }); K.box(g, 0.8, 25.2, 15.2, 26.8, 6.6, 7.6, '#7A4A3A', { w: 0.6 }); K.gable(g, -0.4, 24.6, 16.4, 27.4, 7.6, 1.6, 'x', CQC.roof, { c: '#33302C', w: 0.7 }); for (const x of [1.6, 14.4]) g.glow('lamp', x, 26.8, 5.8, { r: 1.1, base: 0 }); }, { name: 'gate' });   // a lamp on each gate post (night)

  /* ---- the Liangjiang Pavilion on the summit ---- */
  T.obj([-36, -36, -23, -23], (g) => {   // footprint kept off the summit's centre: both are 'on', see pitfalls
    g.boilP = 0.3;
    const cx = -29.5, cy = -29.5, tiers = 5, ROOF = '#4E5157', WALL = '#B9433A', i0 = g.cmds.length;
    let z = Z2, r = 6.4;
    K.cyl(g, cx, cy, 6.8, Z2, Z2 + 1, { t: '#D9D2C2', l: '#CFC7B5', r: '#B3AA96' }, { n: 8, w: 0.7 });
    z = Z2 + 1;
    for (let i = 0; i < tiers; i++) {
      const h = i === 0 ? 5.6 : 4.4;
      K.cyl(g, cx, cy, r * 0.62, z, z + h, { t: '#D9D2C2', l: WALL, r: shade(WALL, 0.15) }, { n: 8, w: 0.7 });
      // gallery windows round the drum
      for (let k = 0; k < 4; k++) { const a = Math.PI * (0.15 + 0.22 * k), p = g.p(cx + Math.cos(a) * r * 0.63, cy + Math.sin(a) * r * 0.63, z + h * 0.35), q = g.p(cx + Math.cos(a) * r * 0.63, cy + Math.sin(a) * r * 0.63, z + h * 0.8); g.fill2([[p[0] - 1, p[1]], [p[0] + 1, p[1]], [q[0] + 1, q[1]], [q[0] - 1, q[1]]], '#F2D58A', true); }
      z += h;
      // an eave: a wide flat octagonal skirt with turned-up tips
      const sk = []; for (let k = 0; k < 8; k++) { const a = TAU * k / 8 + Math.PI / 8; sk.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z - 0.9]); }
      const top = []; for (let k = 0; k < 8; k++) { const a = TAU * k / 8 + Math.PI / 8; top.push([cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55, z + 0.6]); }
      for (let k = 0; k < 8; k++) { const a = sk[k], b = sk[(k + 1) % 8], c = top[(k + 1) % 8], d = top[k]; const n = Math.cos(TAU * (k + 0.5) / 8 + Math.PI / 8) + Math.sin(TAU * (k + 0.5) / 8 + Math.PI / 8); if (n > -0.3) g.fill([a, b, c, d], n > 0.9 ? shade(ROOF, -0.1) : shade(ROOF, 0.1)); }
      const iE = g.cmds.length;
      g.line(sk.concat([sk[0]]).filter((p, k) => true), { w: 0.6, c: '#2E2A26', boil: false });
      for (const p of sk) { const s = g.p.apply(g, p); if (s[1] > g.p(cx, cy, z - 0.9)[1] - 6) g.line2([s, [s[0] + (s[0] > g.p(cx, cy, z)[0] ? 0.8 : -0.8), s[1] - 1.8]], { w: 0.55, c: '#2E2A26', boil: false, ext: 0 }); }
      CQ.nmark(g, iE, null, { nc: CQ.GOLD }, true);                              // at night every eave is a ring of gold light
      r *= 0.88;
    }
    K.cone(g, cx, cy, r * 0.6, z + 0.6, 4.2, ROOF);
    const t0 = g.p(cx, cy, z + 4.6), t1 = g.p(cx, cy, z + 7.2); g.segs2([t0[0], t0[1], t1[0], t1[1]], '#C99A33', 0.8); g.disc2(t0, 0.8, '#C99A33');
    // the tower glows gold at night: its red drums lit warm, the gallery windows bright, a glow up its height
    CQ.nmark(g, i0, WALL, { nc: '#D9703A' }); CQ.nmark(g, i0, shade(WALL, 0.15), { nc: '#B4552C' }); CQ.nmark(g, i0, '#C99A33', { nc: '#FFD27A' });
    for (const [zz, r] of [[Z2 + 4, 4.6], [Z2 + 11, 3.8], [Z2 + 18, 3.0], [Z2 + 25, 2.2]]) g.glow('lantern', cx, cy, zz, { r, col: '#FFB958' });
  }, { on: true, name: 'pavilion' });
  for (const [x, y, z, o] of [[-32, -12, Z2, { r: 4.4 }], [-12, -32, Z2, { r: 4.6 }], [-28, 6, Z1, { r: 5.6 }], [10, -26, Z1, { r: 5.2 }], [28, 30, 0, { r: 4.6 }], [-30, 30, 0, { r: 4.4 }]]) T.obj([x, y], (g) => CQ.fig(g, x, y, Object.assign({ z }, o)), { on: z > 0, name: 'fig' });
  for (const [x, y, z] of [[-16, 10, Z1], [-30, 12, Z1], [-12, -12, Z2]]) T.obj([x, y], (g) => CQ.bloom(g, x, y, { z, r: 3.4 }), { on: true, name: 'plum' });

  /* ---- the xiangqi players under the birdcage fig, the calligrapher ---- */
  T.cast([-24, 8], (g) => {
    const z = Z1; K.box(g, -25.2, 8.6, -22.8, 11, 0 + z, 2.1 + z, { t: '#D9C68A', l: '#8A6446', r: '#6E4A36' }, { w: 0.5 });
    const c = g.p(-24, 9.8, z + 2.15); const d = []; for (let i = 0; i < 6; i++) d.push([c[0] - 2.5 + i, c[1] - 0.4 + (i % 2) * 0.8]); for (const p of d) g.disc2(p, 0.42, i0(p) ? '#C8392E' : '#2A2622');
    CQ.stool(g, -27, 9.8, '#8A6446'); K.person(g, -27, 9.8, z + 1.3, CQ.elder(1400, { dir: 0, pose: 'sit', reach: [3.4, 2.4] }));
    CQ.stool(g, -21, 9.8, '#8A6446'); K.person(g, -21, 9.8, z + 1.3, CQ.elder(1401, { dir: 2, pose: 'sit', reach: [3.4, 2.4] }));
    CQ.person(g, -23, 13, z, CQ.elder(1402, { dir: 3, pose: 'stand' }));
    // the cages hanging from the fig's low branch
    for (const [dx, col] of [[-3, '#E6C24F'], [0, '#7FA9C9'], [3, '#D98AA4']]) { const p = g.p(-28 + dx * 0.6, 6 + dx * 0.4, z + 7.6); g.segs2([p[0], p[1] - 3, p[0], p[1]], '#5A4A3C', 0.3); const pts = arcPts(p[0], p[1] + 2.6, 1.8, Math.PI, TAU, 8); g.fill2(pts.concat([[p[0] + 1.8, p[1] + 3.6], [p[0] - 1.8, p[1] + 3.6]]), 'rgba(222,212,186,0.6)', true); g.disc2([p[0], p[1] + 2.6], 0.55, col); g.fill2([[p[0] - 2, p[1] + 3.6], [p[0] + 2, p[1] + 3.6], [p[0] + 2, p[1] + 4.1], [p[0] - 2, p[1] + 4.1]], '#6F4F3B', true); }
    function i0(p) { return Math.round(p[0] * 3) % 2 === 0; }
  }, { on: true, name: 'xiangqi' });
  T.cast([-4, 13], (g) => { const r = CQ.person(g, -4, 13, Z1, CQ.elder(1403, { dir: 1, pose: 'hold' })); const h = r.hands[0]; g.segs2([h[0], h[1], h[0] - 3, h[1] + 9], '#6F4F3B', 0.5); const s = g.p(-7, 17, Z1 + 0.02); g.segs2([s[0] - 6, s[1] - 2, s[0] - 2, s[1], s[0] - 1, s[1] - 3, s[0] + 3, s[1] - 1, s[0] + 4, s[1] - 4, s[0] + 6, s[1] - 2], '#A49A86', 0.8); }, { on: true, name: 'calligraphy' });
  T.cast([-14, -12], (g) => { CQ.person(g, -10.5, -14, Z2, CQ.who(1404, { dir: 0, pose: 'hold', phone: true })); CQ.person(g, -10, -11.6, Z2, CQ.who(1405, { dir: 0, umbrella: '#9C6B5A', pose: 'hold' })); }, { on: true, name: 'summit couple' });

  /* ---- the square dance: twelve aunties in rows, in step with the speaker's beat ---- */
  T.obj([14, -2], (g) => { K.box(g, 13.2, -2.8, 14.8, -1.2, Z1, Z1 + 1.8, '#3A3530', { w: 0.5 }); g.disc2(g.p(14, -1.15, Z1 + 1.1), 0.5, '#8C8576'); g.mark({ nc: '#7FD6FF' }); g.glow2('lantern', g.p(14, -1.15, Z1 + 1.1), null, { r: 0.6, col: '#7FD6FF' }); }, { on: true, name: 'speaker' });   // the dance speaker's little LED (night)
  for (let i = 0; i < 12; i++) {
    const x = -2 + (i % 4) * 4, y = -2 + Math.floor(i / 4) * 5, look = CQ.elder(1410 + i, { top: ['#C8392E', '#D98AA4', '#E6C24F', '#5F8FC9'][i % 4], hairStyle: i % 3 ? 'bob' : 'bun', dress: i % 5 === 0 ? '#C8392E' : undefined });
    T.actor({ sample: 5, period: 4, at(t) { const b = Math.floor(t * 4) % 8, d = b < 4 ? 0 : 3; return { x: x + (b < 4 ? b : 7 - b) * 0.25, y, z: Z1, key: b, b, d }; },
      draw(g, st) { K.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.d, pose: st.b % 2 ? 'cheer' : 'wave', ph: st.b / 8 })); } });
  }
  /* ---- walkers ---- */
  const zg = (x, y) => y < 18 ? Z1 : clamp((24 - y) / 6, 0, 1) * Z1;
  CQ.walk(T, CQ.who(1430), [[8, 34], [8, 18], [8, 14], [8, 18]], 1.0, { z: zg, phase: 0.1 });
  CQ.walk(T, CQ.elder(1431), [[10, 14], [10, 34], [30, 34], [30, 22], [10, 22]], 0.8, { z: (x, y) => x < 16 && y < 24 ? zg(x, y) : 0, phase: 0.5 });
  const zs = (x, y) => x < -8 ? Z2 : x > -2 ? Z1 : Z1 + (Z2 - Z1) * (-2 - x) / 6;
  CQ.walk(T, CQ.who(1432), [[2, -16], [-12, -16], [-12, -26], [-12, -16]], 1.0, { z: zs, phase: 0.3 });
  CQ.walk(T, CQ.who(1433), [[-36, 27], [36, 27]], 1.3, { phase: 0.2 });
  CQ.walk(T, CQ.who(1434), [[20, 30], [36, 30]], 1.2, { phase: 0.7 });
});
