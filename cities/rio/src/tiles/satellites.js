'use strict';
/* Three satellites off the grid, each on an unlined paint blob:
   upper right  Niterói across the bay: Niemeyer's Contemporary Art Museum, a white saucer on a cylindrical stem
                standing in a round reflecting pool on its cliff, the red ramp curling up to the door, visitors;
   top          Ilha Fiscal: the little green neo-Gothic customs house on its islet in the bay, a launch at the jetty;
   lower left   Pedra da Gávea, the great flat-topped granite block over São Conrado, hang-gliders spiralling down
                to the beach where a crowd watches them land. */
(function () {
  const blob = (g, pts, col, seed) => K.blob2(g, g.P(pts.map((p) => [p[0], p[1], 0])), col, { seed, rag: 0.8 });

  /* ---------------- Niterói: the MAC ---------------- */
  SF.tile('niteroi', 60, -262, { rim: 70, castAt: 150, order: -3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-30, -6], [-20, -28], [6, -30], [28, -18], [30, 6], [18, 24], [-6, 28], [-26, 16]], '#9FBF86', 21);
      g.grass([[-22, -16, 0], [20, -20, 0], [24, 14, 0], [-18, 20, 0]], { dens: 0.5 });
      const pool = []; for (let i = 0; i < 24; i++) { const a = TAU * i / 24; pool.push([Math.cos(a) * 11, Math.sin(a) * 11, -0.3]); }
      g.fill(pool, '#86BBC4'); g.water(pool, { dens: 0.6 }); g.outline(pool.map((p) => [p[0], p[1], 0]), { w: 0.6, c: '#5E8F9A', boil: false });
      // the path to the ramp's foot
      g.line([[14, 18, 0], [20, 10, 0]], { w: 2, c: '#E3D8BE', boil: false });
    });
    T.obj([-12, -12, 12, 12], function (g) {
      g.boilP = 0.2;
      // the red ramp first (it curls round in front of the stem up to the door), then the stem, then the saucer
      const rp = []; for (let k = 0; k <= 20; k++) { const u = k / 20, a = lerp(0.9, 2.6, u), r = lerp(17, 9.2, u); rp.push([Math.cos(a) * r, Math.sin(a) * r, lerp(0, 6.2, u)]); }
      const outer = rp.map((p) => [p[0], p[1], p[2]]), inner = rp.map((p) => { const l = Math.hypot(p[0], p[1]); return [p[0] * (l - 1.6) / l, p[1] * (l - 1.6) / l, p[2]]; });
      K.cyl(g, 0, 0, 3.0, 0, 6.2, { t: '#E9E6DE', l: '#F6F4EE', r: '#D9D5CA' }, { w: 0.8, n: 16 });
      // the saucer: a flared bowl widening up to the rim, a glazed band all round, a shallow dome on top
      const z0 = 6.2, z1 = 9.4, R0 = 4.2, R1 = 12.4, bowl = [];
      for (let i = 0; i <= 24; i++) { const a = -Math.PI / 4 + Math.PI * i / 24; bowl.push(g.p(Math.cos(a) * R1, Math.sin(a) * R1, z1)); }
      for (let i = 24; i >= 0; i--) { const a = -Math.PI / 4 + Math.PI * i / 24; bowl.push(g.p(Math.cos(a) * R0, Math.sin(a) * R0, z0)); }
      g.fill2(bowl, '#F6F4EE'); g.line2(bowl.slice(0, 25), { w: 0.9, boil: false }); g.line2(bowl.slice(25), { w: 0.7, boil: false });
      const band = []; for (let i = 0; i <= 24; i++) { const a = -Math.PI / 4 + Math.PI * i / 24; band.push(g.p(Math.cos(a) * R1, Math.sin(a) * R1, z1)); } for (let i = 24; i >= 0; i--) { const a = -Math.PI / 4 + Math.PI * i / 24; band.push(g.p(Math.cos(a) * R1, Math.sin(a) * R1, z1 + 1.8)); }
      g.fill2(band, '#3F4A54'); for (let i = 0; i <= 24; i += 2) { const a = -Math.PI / 4 + Math.PI * i / 24, p = g.p(Math.cos(a) * R1, Math.sin(a) * R1, z1 + 0.2), q = g.p(Math.cos(a) * R1, Math.sin(a) * R1, z1 + 1.6); g.segs2([p[0], p[1], q[0], q[1]], '#6E7C88', 0.3); }
      const top = []; for (let i = 0; i < 32; i++) { const a = TAU * i / 32; top.push(g.p(Math.cos(a) * R1, Math.sin(a) * R1, z1 + 1.8)); }
      g.fill2(top, '#ECEAE3'); g.line2(top.concat([top[0]]), { w: 0.8, boil: false });
      K.dome(g, 0, 0, 8, z1 + 1.8, 1.6, '#F2F0EA', { line: true });
      // the ramp, in front of all of it on the near side
      g.fill(outer.concat(inner.slice().reverse()), '#D9463B');
      g.fill(outer.concat(outer.slice().reverse().map((p) => [p[0], p[1], p[2] - 0.9])), '#B3352C');
      g.line(outer, { w: 0.7, boil: false }); g.line(inner, { w: 0.5, boil: false });
      // at night the saucer is floodlit white from below over its pool, the glazed band lit, the red ramp lit
      RJ.nightEach(g, 0, (c, d) => (d.k !== K_FILL ? (c === '#6E7C88' ? '#E9D2A0' : undefined) : c === '#3F4A54' ? '#F2D69A' : c === '#D9463B' || c === '#B3352C' ? RJ.litCol(c, 0.75) : RJ.floodCol(c, 1.1, '#E2ECFF')));
      for (let i = 0; i < 6; i++) { const a = -Math.PI / 4 + Math.PI * (i + 0.5) / 6; g.glow('lantern', Math.cos(a) * 12.4, Math.sin(a) * 12.4, 10.3, { r: 1.6, col: '#FFE0A8', base: -0.3 }); }
      for (const a of [0.2, 0.9, 1.6]) g.glow2('lantern', g.p(Math.cos(a) * 6, Math.sin(a) * 6, 5.4), g.p(Math.cos(a) * 9, Math.sin(a) * 9, -0.3), { r: 2.6, col: '#DCE8FF' });
      for (let k = 0; k <= 20; k += 5) { const p = outer[k]; g.glow('lantern', p[0], p[1], p[2] + 0.9, { r: 0.8, col: '#FFD6A0', base: p[2] }); }
    }, { name: 'mac niterói' });
    for (const [x, y, s, d] of [[16, 16, 8901, 3], [19, 12, 8902, 2], [-16, 14, 8903, 1], [-20, -4, 8904, 0]]) T.cast([x, y], (g) => RJ.person(g, x, y, 0, Object.assign(RJ.who(s), { dir: d, pose: s % 2 ? 'hold' : 'stand', phone: s % 2 === 1 })), {});
  });

  /* ---------------- Ilha Fiscal ---------------- */
  SF.tile('ilhafiscal', -78, -214, { rim: 64, castAt: 140, order: -3, half: 18 }, function (T) {
    T.ground(function (g) {
      const isle = [[-14, -6], [-6, -14], [8, -12], [14, -2], [10, 10], [-2, 14], [-12, 8]];
      g.fill(K.curve(isle.map((p) => [p[0] * 1.35, p[1] * 1.35, -0.6]), 5, true), '#86BBC0');
      g.water(K.curve(isle.map((p) => [p[0] * 1.35, p[1] * 1.35, -0.6]), 5, true), { dens: 0.6 });
      g.fill(K.curve(isle.map((p) => [p[0], p[1], 0]), 5, true), '#B5CF8E'); g.outline(K.curve(isle.map((p) => [p[0], p[1], 0]), 5, true), { w: 0.6, c: '#5E7A3E', boil: false });
      g.fill(K.rect(10, 4, 18, 6.4, 0.2), '#C9A26B');
      // (night: the open water on the near side of the islet, where the palace's light falls: a clear fill)
      const cr = []; for (let k = 0; k <= 16; k++) { const a = lerp(-Math.PI * 0.4, Math.PI * 0.9, k / 16); cr.push([Math.cos(a) * 18.2, Math.sin(a) * 18.2, -0.6]); }
      for (let k = 16; k >= 0; k--) { const a = lerp(-Math.PI * 0.4, Math.PI * 0.9, k / 16); cr.push([Math.cos(a) * 15.6, Math.sin(a) * 15.6, -0.6]); }
      g.fill(cr, RP.WMASK);
    });
    T.obj([-6, -6, 6, 6], function (g) {
      const GR = { t: '#B9D9C4', l: '#8CC4A4', r: '#72AA8A' };
      K.box(g, -6, -6, 6, 6, 0, 6.4, GR, { w: 0.9 });
      for (const [f, p, a0, a1] of [['L', 6, -5, 5], ['R', 6, -5, 5]]) for (let a = a0 + 0.6; a < a1; a += 2.4) { K.win(g, f, p, a, a + 1.2, 1, 4.2, { style: 'navy', arch: true }); }
      K.box(g, -2.2, -2.2, 2.2, 2.2, 6.4, 11.2, GR, { w: 0.8 });
      K.cone(g, 0, 0, 2.6, 11.2, 5.4, '#2F6A55');
      for (const [x, y] of [[-6, 6], [6, 6], [6, -6]]) K.cone(g, x, y, 1.1, 6.4, 3.4, '#2F6A55');
      K.gable(g, -6.4, -6.4, 6.4, 6.4, 6.4, 2.0, 'x', '#3F7F66');
      // at night the little palace is floodlit warm over the bay, its windows lit, lamps along the jetty
      RJ.nightEach(g, 0, (c, d) => (d.k === K_FILL && RJ_HEX(c) ? mix(RJ.litCol(c, 0.68), '#FFD9A0', 0.16) : undefined));
      for (const [x, y, z, r] of [[0, 6.4, 2.5, 3.0], [6.4, 0, 2.5, 3.0], [0, 2.2, 9, 2.2], [0, 0, 14.5, 1.4], [-6, 6, 8.5, 1.2], [6, 6, 8.5, 1.2], [6, -6, 8.5, 1.2]]) g.glow2('lantern', g.p(x, y, z), g.p(x + 2.5, y + 2.5, 0), { r, col: '#FFD08A' });
    }, { name: 'ilha fiscal' });
    T.actor({ sample: 0.5, period: 30, grow: false,
      at(t) { const u = (t / 30) % 1, f = u < 0.4 ? 0 : u < 0.7 ? (u - 0.4) / 0.3 : 1 - (u - 0.7) / 0.3; return { x: 20 + f * 18, y: 5.2, z: -0.6, key: u < 0.7 ? 0 : 1, d: u < 0.7 }; },
      draw(g, st) { K.boat(g, st.d ? 0 : Math.PI, { kind: 'motor', L: 3.2, W: 1.2, hull: '#F3F1EA', stripe: '#2F6A55' }); } });
    T.cast([12, 5.2], (g) => RJ.person(g, 12, 5.2, 0.2, Object.assign(RJ.who(8920, { carnaval: false }), { dir: 0, pose: 'hold', phone: true, k: 0.9 })), {});
  });

  /* ---------------- Pedra da Gávea and the hang-gliders over São Conrado ---------------- */
  SF.tile('gavea', -40, 262, { rim: 60, castAt: 140, order: 3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-32, -10], [-24, -30], [6, -32], [30, -20], [32, 6], [20, 26], [-4, 30], [-28, 18]], '#A9C48C', 31);
      const sand = K.curve([[4, 26, 0], [18, 16, 0], [28, 6, 0], [27, 16, 0], [16, 26, 0], [6, 29, 0]], 4, true); g.fill(sand, '#EED9A6');
      const sea = K.curve([[16, 26, -0.4], [27, 16, -0.4], [26, 22, -0.4], [18, 27, -0.4]], 4, true); g.fill(sea, '#7FC0C9'); g.water(sea, { dens: 0.6 });
    });
    // the mountain: a tall granite block with a flat top of forest, its face streaked
    T.obj([-26, -26, 4, 4], function (g) {
      g.boilP = 0.2;
      RJ.rock(g, -11, -11, [[0, 15, 14, 0, 0], [8, 14.4, 13.4, 0.2, 0.2], [16, 13.2, 12.2, 0.4, 0.4], [24, 12.4, 11.4, 0.5, 0.5], [30, 12.0, 11.0, 0.5, 0.5], [32, 10.6, 9.8, 0.5, 0.5], [33.2, 7, 6.4, 0.5, 0.5]], { seed: 51, col: '#B6AE9E', forest: '#5E8F4E', bare: [[-0.76, 2.35, 1, 5]], canopy: 120 });
    }, { name: 'pedra da gávea' });
    T.obj([8, -14, 22, 0], function (g) {
      RJ.rock(g, 15, -7, [[0, 7, 6.4, 0, 0], [6, 6.2, 5.6, 0.2, 0.2], [11, 4.6, 4.0, 0.3, 0.3], [13.6, 2.6, 2.2, 0.3, 0.3], [14.4, 1.2, 1.0, 0.3, 0.3]], { seed: 53, col: '#BDB6A6', forest: '#6E9C52', bare: [[-0.76, 0.6, 2, 4]], canopy: 50 });
      const r = g.p(15.6, -6.6, 14.2); g.fill2([[r[0] - 4, r[1] + 1], [r[0] + 5, r[1] - 1], [r[0] + 5, r[1]], [r[0] - 4, r[1] + 2]], '#C9A26B', true);
    }, { name: 'pedra bonita' });
    for (const [x, y, s] of [[12, 22, 8930], [15, 20, 8931], [9, 24, 8932], [19, 16.5, 8933]]) T.cast([x, y], (g) => RJ.person(g, x, y, 0, Object.assign(RJ.who(s, { beach: true }), { dir: 3, pose: s % 2 ? 'wave' : 'stand', ph: 0.4 })), {});
    // the hang-gliders: triangular wings spiralling down from the ramp to the beach
    for (let i = 0; i < 3; i++) T.actor({ sample: 0.3, period: 24, layer: 'top', grow: false,
      at(t) { const u = ((t / 24 + i / 3) % 1), a = u * TAU * 2.2 + i, r = lerp(14, 5, u), x = lerp(15, 20, u) + Math.cos(a) * r, y = lerp(-6, 24, u) + Math.sin(a) * r * 0.8, z = lerp(22, 1, u), q = Math.round(((a + Math.PI / 2) % TAU) / (TAU / 12)) % 12, al = Math.min(1, u * 8, (1 - u) * 8); return { x, y, z, key: q + '.' + i, q, alpha: al < 1 ? al : null }; },
      draw(g, st) {
        const ang = st.q / 12 * TAU, ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z);
        const wing = [P(2.2, 0, 1.2), P(-1.8, -4.2, 0.6), P(-1.2, 0, 0.9), P(-1.8, 4.2, 0.6)];
        g.fill2(wing, ['#F2C230', '#D9463B', '#2F6DB5'][i], true); g.line2(wing.concat([wing[0]]), { w: 0.4, c: '#3A3530', boil: false });
        const b = P(0, 0, -0.6), h = P(0, 0, 0.9); g.segs2([b[0], b[1], h[0], h[1]], '#5A564E', 0.3);
        g.fill2([[b[0] - 2.2, b[1] - 0.6], [b[0] + 2.2, b[1] - 0.6], [b[0] + 2.2, b[1] + 0.8], [b[0] - 2.2, b[1] + 0.8]], '#3A3530', true);
      } });
    // the last tile defined: the city's night-only things are made here, after everything else (see RJ.late)
    RJ.runLate(T);
  });
})();
