'use strict';
/* (100,-100) Sugarloaf and Urca, at the corner where Guanabara Bay meets the ocean.
   Built: Sugarloaf (Pão de Açúcar) as a granite object — a steep bullet-shaped dome of bare pale rock streaked by
   rain, a cap of forest on its shoulders and the glass summit station on top — and Morro da Urca, lower and broad,
   forested on top with its own station. The cable car (bondinho) runs in two spans: from the Praia Vermelha station
   (a long low glass building) up to Urca, then across the gap to Sugarloaf. Each span has two cables and two glass
   cars that shuttle in opposite directions and pass in the middle. Below: Urca's low houses with tiled roofs, the
   sand of Praia Vermelha (reddish), the Pista Cláudio Coutinho trail along the foot of the rock, and out in the surf
   at the corner of the map the Pedra do Leme.
   Who: a queue of tourists at the station, people waving from the cars, climbers on the rock face, visitors at the
   summit rails, joggers on the trail, beachgoers, a marmoset family on Urca's trees, fishermen on the Pedra do Leme.
   The cars' clock is phased so both spans' cars pass mid-span during the `paodeacucar` shot. */
SF.tile('paodeacucar', 100, -100, { rim: 14 }, function (T) {
  const SUG = [17, -17], URC = [-15, -10];
  const SR = [[0, 13.2, 11.4, 0, 0], [8, 12.9, 11.1, 0.3, 0], [16, 12.1, 10.4, 0.7, 0.2], [23, 10.9, 9.4, 1.0, 0.3], [29, 9.2, 8.0, 1.2, 0.4], [34, 7.0, 6.1, 1.3, 0.5], [37.6, 4.8, 4.2, 1.3, 0.5], [39.6, 2.9, 2.6, 1.2, 0.5], [40.4, 1.4, 1.2, 1.2, 0.5]];
  const UR = [[0, 15, 12, 0, 0], [5, 14.6, 11.6, 0.2, 0], [10, 13.4, 10.6, 0.4, 0.2], [15, 11.2, 8.8, 0.6, 0.3], [18.6, 8.4, 6.6, 0.6, 0.3], [20.8, 5.2, 4.0, 0.5, 0.2], [21.6, 2.6, 2.0, 0.4, 0.2]];
  const ST = [-22, 16, 5.4];                                     // the Praia Vermelha station's cable outlet
  const UT = [URC[0] + 0.6, URC[1] + 0.3, 22.4], STOP = [SUG[0] + 1.2, SUG[1] + 0.5, 41.2];
  const SAG = 1.6;
  const spans = [{ a: ST, b: UT, off: 0, per: 22 }, { a: [UT[0] + 1.6, UT[1] - 0.4, UT[2]], b: STOP, off: 1, per: 22 }];
  // shot timing: the cars of both spans pass mid-span ~1.6 s and ~2.4 s after the cut
  const sh = SCENE.shots.find((s) => s.name === 'paodeacucar'), t0 = sh ? sh.a / 30 : 0;
  spans[0].ph = t0 + 1.6 - 6.75; spans[1].ph = t0 + 2.4 - 6.75;
  const pp = (t, per) => { const u = ((t % per) + per) % per, half = per / 2, dw = 2.5; if (u < dw) return 0; if (u < half) return smooth((u - dw) / (half - dw)); if (u < half + dw) return 1; return 1 - smooth((u - half - dw) / (half - dw)); };
  const along = (S, u, side) => {
    const dx = S.b[0] - S.a[0], dy = S.b[1] - S.a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    return [lerp(S.a[0], S.b[0], u) + nx * side, lerp(S.a[1], S.b[1], u) + ny * side, lerp(S.a[2], S.b[2], u) - SAG * 4 * u * (1 - u)];
  };

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    K.slab(g, 37, { top: '#E7E1D2' });
    // forest floor under the two hills, the reddish sand of Praia Vermelha, Urca's street
    const blob = (cx, cy, rx, ry, n, col, seed) => { const pts = []; for (let i = 0; i < n; i++) { const a = TAU * i / n, r = 1 + 0.08 * vnoise(i * 1.3, seed); pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r, 0]); } g.fill(pts, col); return pts; };
    blob(URC[0], URC[1], 19, 15, 18, '#9DB27A', 3); blob(SUG[0], SUG[1], 16.5, 14.5, 18, '#A3B482', 5);
    const sand = [[8, 8, 0], [37, 0, 0], [37, 37, 0], [14, 37, 0], [6, 24, 0]]; g.fill(sand, '#E9C59A'); g.scuff(sand, { dir: -0.4, len: 1.6, c: '#D6AE80', dens: 0.5, w: 0.45, spread: 1.2 });
    g.line(sand.concat([sand[0]]), { w: 0.5, c: '#B98E62', boil: false });
    // the trail along the foot of Sugarloaf
    const tr = K.curve([[4, 6, 0], [16, 2, 0], [28, -2, 0], [36, -4, 0]], 5); for (let i = 0; i < tr.length - 1; i++) g.line([tr[i], tr[i + 1]], { w: 1.6, c: '#D9CBB0', boil: false, ext: 0 });
    g.fill(K.rect(-37, 24, 4, 27.5), '#D6D0C2');
    RJ.mosaic(g, -30, 21, 2, 24, { sp: 2.2 });
  }, { rim: true });

  /* ---------------- the two hills ---------------- */
  T.obj([URC[0] - 16, URC[1] - 13, URC[0] + 16, URC[1] + 13], function (g) {
    g.boilP = 0.2;
    RJ.rock(g, URC[0], URC[1], UR, { seed: 7, col: '#BDB6A6', forest: '#5E8F4E', bare: [[-0.76, 0.25, 0, 4]], canopy: 120 });
    // the summit station and its restaurant terrace, the first span's cables to the Praia Vermelha station
    const iU = g.cmds.length;
    K.box(g, UT[0] - 2.6, UT[1] - 3.2, UT[0] + 2.6, UT[1] + 2.4, 21.2, 24.6, { t: '#E9E6DC', l: '#CFE0E6', r: '#B4C9D2' }, { w: 0.6 });
    K.box(g, UT[0] - 3.0, UT[1] - 3.6, UT[0] + 3.0, UT[1] + 2.8, 24.6, 25.3, '#D9463B', { w: 0.5 });
    // at night the station and its restaurant are lit on the dark hilltop
    RJ.nightEach(g, iU, (c, d) => (d.k !== K_FILL ? undefined : c === '#CFE0E6' ? '#FFE4A4' : c === '#B4C9D2' ? '#F5C978' : RJ.litCol(c, 0.55)));
    for (const [dx, dy] of [[2.6, 0], [0, 2.4], [2.6, -2.4]]) g.glow2('lantern', g.p(UT[0] + dx, UT[1] + dy, 23), g.p(UT[0] + dx + 2, UT[1] + dy + 2, 21.2), { r: 2.2, col: '#FFD9A0' });
    for (const side of [-1.1, 1.1]) { const pts = []; for (let k = 0; k <= 16; k++) pts.push(along(spans[0], k / 16, side)); g.fine(pts.map((p) => [p[0], p[1], p[2] + 0.2]), { w: 0.42, c: '#2F2B27' }); }
  }, { name: 'morro da urca' });
  T.obj([SUG[0] - 14, SUG[1] - 12, SUG[0] + 14, SUG[1] + 12], function (g) {
    g.boilP = 0.2;
    RJ.rock(g, SUG[0], SUG[1], SR, { seed: 11, col: '#C2BCAE', veg: [0, 10, 1.1], streaks: 40,
      extra: (gg, S) => {   // a second band of scrub on the shoulders, near the top
        const R = RNG(91); for (let k = 0; k < 22; k++) { const i = 6 + Math.floor(R() * 2.5), p = S(Math.min(i, SR.length - 1), lerp(-0.4, 2.2, R())), r = 1.6 + R() * 1.8; gg.fill2(arcPts(p[0], p[1], r, 0, TAU, 7).map((q) => [q[0], p[1] + (q[1] - p[1]) * 0.7]), k % 3 ? RP.forest : RP.forestL); }
      } });
    const iS = g.cmds.length;
    K.box(g, STOP[0] - 2.4, STOP[1] - 2.6, STOP[0] + 2.4, STOP[1] + 2.2, 39.6, 42.6, { t: '#E9E6DC', l: '#CFE0E6', r: '#B4C9D2' }, { w: 0.6 });
    K.box(g, STOP[0] - 2.8, STOP[1] - 3.0, STOP[0] + 2.8, STOP[1] + 2.6, 42.6, 43.2, '#D9463B', { w: 0.5 });
    // at night the summit station is a lit box on the top of the dark rock
    RJ.nightEach(g, iS, (c, d) => (d.k !== K_FILL ? undefined : c === '#CFE0E6' ? '#FFE4A4' : c === '#B4C9D2' ? '#F5C978' : RJ.litCol(c, 0.55)));
    for (const [dx, dy] of [[2.4, 0], [0, 2.2]]) g.glow2('lantern', g.p(STOP[0] + dx, STOP[1] + dy, 41), g.p(STOP[0] + dx + 2, STOP[1] + dy + 2, 39.6), { r: 2.2, col: '#FFD9A0' });
    g.glow('lantern', STOP[0], STOP[1], 44, { r: 0.7, col: '#FF5A48', base: 43.2 });
    for (const side of [-1.1, 1.1]) { const pts = []; for (let k = 0; k <= 20; k++) pts.push(along(spans[1], k / 20, side)); g.fine(pts.map((p) => [p[0], p[1], p[2] + 0.2]), { w: 0.42, c: '#2F2B27' }); }
  }, { name: 'pão de açúcar' });
  const SW = RJ.rockW(SUG[0], SUG[1], SR, { seed: 11 });
  // climbers on the lit face, roped together
  T.cast([SUG[0] - 6, SUG[1] + 9], function (g) {
    const a = SW(3, 2.05, 0.4), b = SW(4, 1.95, 0.5), rope = [SW(5, 2.0, 0.2), b, a, SW(2, 2.1, 0.3)];
    g.fine(rope, { w: 0.3, c: '#D9463B' });
    for (const [p, s] of [[a, 6010], [b, 6011]]) RJ.person(g, p[0] + 0.3, p[1] + 0.3, p[2] - 3.2, Object.assign(RJ.who(s, { carnaval: false }), { dir: 2, pose: 'stand', hands: [[-1.5, -21], [1.8, -19]], top: s % 2 ? '#EE8A2E' : '#2F6DB5', cap: '#F2C230', k: 0.85 }));
  }, { on: true });
  // visitors at the summit rail and on Urca's terrace
  for (const [x, y, z, d, s] of [[STOP[0] - 1, STOP[1] + 2.9, 39.6, 1, 6020], [STOP[0] + 1.4, STOP[1] + 2.7, 39.6, 0, 6021], [UT[0] - 1.6, UT[1] + 3.2, 21.2, 1, 6022], [UT[0] + 1.2, UT[1] + 3.0, 21.2, 0, 6023]])
    T.cast([x, y], (g) => RJ.person(g, x, y, z, Object.assign(RJ.who(s), { dir: d, pose: s % 2 ? 'hold' : 'wave', phone: s % 2 === 1, ph: 0.3, k: 0.85 })), { on: true });

  /* ---------------- the station, Urca's houses ---------------- */
  T.obj([-27, 11, -16, 20], function (g) {
    K.box(g, -27, 11, -16, 20, 0, 4.8, { t: '#E9E6DC', l: '#CFE0E6', r: '#B4C9D2' }, { w: 0.8 });
    for (const [f, p, a0, a1] of [['L', 20, -27, -16], ['R', -16, 11, 20]]) for (let a = a0 + 1.4; a < a1; a += 1.4) g.line([K.pt(f, p + 0.03, a, 0.2), K.pt(f, p + 0.03, a, 4.6)], { w: 0.3, c: '#7E97A3', boil: false });
    K.box(g, -27.6, 10.4, -15.4, 20.6, 4.8, 5.5, '#E9E6DC', { w: 0.7 });
    K.box(g, -25, 14, -19, 18, 5.5, 6.6, '#BDB6A6', { w: 0.5 });
    g.fill(K.on('L', 20.62, -26, -17, 4.85, 5.45), '#D9463B'); K.text(g, 'L', 20.66, -21.5, 4.92, 0.48, 'BONDINHO PÃO DE AÇÚCAR', '#F6F3EA', { center: true, w: 0.36 });
    // at night the station's glass hall is lit, its red name band too, lamps over the queue
    RJ.nightEach(g, 0, (c, d) => (d.k !== K_FILL ? (c === '#F6F3EA' ? '#FFF6DC' : c === '#7E97A3' ? '#C9A46A' : undefined) : c === '#CFE0E6' ? '#FFE4A4' : c === '#B4C9D2' ? '#F5C978' : c === '#D9463B' ? '#E8584A' : RJ.litCol(c, 0.45)));
    for (const a of [-25, -21.5, -18]) g.glow('lamp', a, 21.0, 4.4, { r: 1.2 });
    g.glow('neon', -21.5, 21.2, 5.15, { r: 7, col: '#FF8A70', base: 0 });
  }, { name: 'station' });
  T.cast([-17, 22], (g) => { for (let i = 0; i < 6; i++) RJ.person(g, -26 + i * 1.7, 21.6 + (i % 2) * 0.5, 0, Object.assign(RJ.who(6030 + i), { dir: 2, pose: i % 3 === 1 ? 'hold' : 'stand', phone: i % 3 === 1, sunhat: i === 4 })); }, {});
  const HC = ['#F3EFE4', '#F0D9A8', '#E9B9A0', '#CFE0D0', '#F3E3B8'];
  for (let i = 0; i < 5; i++) {
    const x0 = -36.5 + i * 7.6, x1 = x0 + 6.2, y0 = 29, y1 = 36, col = HC[i];
    T.obj([x0, y0, x1, y1], function (g) {
      K.box(g, x0, y0, x1, y1, 0, 6.8, col, { w: 0.8 });
      RJ.colonial(g, 'L', y1, x0 + 0.4, x1 - 0.4, 0, 6.6, col, 6040 + i, { lamps: true });
      TK_hip(g, x0, y0, x1, y1, 6.8);
    }, { name: 'casa' });
  }
  function TK_hip(g, x0, y0, x1, y1, z) { K.hip(g, x0 - 0.6, y0 - 0.6, x1 + 0.6, y1 + 0.6, z, 2.6, '#C9704F', { c: '#7A3A2A' }); }
  for (const [x, y] of [[4, 31], [8, 35.5], [-8, 21], [2, 20]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.4, h: 4.4, col: '#7FAE5E' }), { name: 'tree' });

  /* ---------------- Praia Vermelha ---------------- */
  for (const [x, y, a, b] of [[20, 14, '#D9463B', '#F6F3EA'], [28, 22, '#2F6DB5', '#F2C230'], [17, 28, '#3A9A5B', '#F6F3EA']]) T.obj([x, y], (g) => RJ.umbrella2(g, g.p(x, y, 0), a, b), { name: 'umbrella' });
  const bea = [[21.4, 15.6, 6050, 0, 'sit'], [29.5, 23.6, 6051, 1, 'sit'], [18.6, 29.6, 6052, 0, 'sit'], [25, 31, 6053, 1, 'stand'], [31, 12, 6054, 0, 'stand']];
  for (const [x, y, s, d, pose] of bea) T.cast([x, y], (g) => { const w = RJ.who(s, { beach: true }); if (pose === 'sit') { RJ.chair2(g, g.p(x, y, 0), ['#F2C230', '#2F6DB5', '#E86A9A'][s % 3], d ? 'L' : 'R'); RJ.person(g, x, y, 1.2, Object.assign(w, { dir: d, pose: 'sit' })); } else RJ.person(g, x, y, 0, Object.assign(w, { dir: d, pose: 'hold', cup: '#F2C230' })); }, {});
  // joggers on the trail and a family heading for the beach
  RJ.walker(T, RJ.who(6060, { beach: true }), [[4, 6], [16, 2], [28, -2], [35, -4], [28, -2], [16, 2]], 2.6, { phase: 0.2 });
  RJ.walker(T, RJ.who(6061), [[35, -4.6], [16, 1.4], [4, 5.4], [16, 1.4]], 1.1, { phase: 0.6 });
  RJ.walker(T, RJ.who(6062), [[-10, 25.6], [2, 25.6], [8, 30], [2, 25.6]], 0.9, { phase: 0.1 });
  // a marmoset family in Urca's trees (little grey bodies, ringed tails, white ear tufts)
  T.cast([4.2, 31.2], function (g) {
    for (const [dx, dy, s] of [[-1.6, -16, 1], [1.4, -13, 0.8], [3, -17.5, 0.7]]) {
      const c = g.p(4, 31, 0), p = [c[0] + dx * 3, c[1] + dy];
      g.fill2(arcPts(p[0], p[1], 1.4 * s, 0, TAU, 8).map((q) => [q[0], p[1] + (q[1] - p[1]) * 0.8]), '#7E7A72', true);
      g.disc2([p[0] + 1.3 * s, p[1] - 1.1 * s], 0.9 * s, '#6E6A62'); g.disc2([p[0] + 1.7 * s, p[1] - 1.4 * s], 0.42 * s, '#F3F1EA');
      g.line2([[p[0] - 1.2 * s, p[1] + 0.4], [p[0] - 2.6 * s, p[1] + 2.2], [p[0] - 2.2 * s, p[1] + 4.4]], { w: 0.5 * s, c: '#5A564E', boil: false });
    }
  }, { on: true });

  /* ---------------- the cable cars ---------------- */
  spans.forEach((S, si) => [0, 1].forEach((k) => {
    const side = k ? 1.1 : -1.1, dx = S.b[0] - S.a[0], dy = S.b[1] - S.a[1], ang = Math.atan2(dy, dx);
    const looks = []; for (let i = 0; i < 4; i++) looks.push(RJ.who(6100 + si * 10 + k * 4 + i));
    T.actor({ sample: 0.3, period: S.per, layer: 'top', grow: false,
      at(t) { let u = pp(t - S.ph, S.per); if (k) u = 1 - u; const p = along(S, u, side); return { x: p[0], y: p[1], z: p[2] - 0.2, key: 'c', u }; },
      draw(g) {
        // the carriage running on the cable, the hanger arm, the glass cabin with a yellow band and dark roof
        const h0 = g.p(0, 0, 0.2), h1_ = g.p(0, 0, -2.2);
        g.fill2([[h0[0] - 2.2, h0[1] - 0.9], [h0[0] + 2.2, h0[1] - 0.9], [h0[0] + 2.0, h0[1] + 0.9], [h0[0] - 2.0, h0[1] + 0.9]], '#3A3F44', true);
        g.disc2([h0[0] - 1.3, h0[1] - 0.9], 0.6, '#5A5F64'); g.disc2([h0[0] + 1.3, h0[1] - 0.9], 0.6, '#5A5F64');
        g.line2([h0, h1_], { w: 0.8, c: '#3A3F44', boil: false, ext: 0 });
        K.rbox(g, 0, 0, 1.7, 1.35, ang, -2.6, -2.2, '#3A3F44', { w: 0.5 });
        const iB = g.cmds.length, B = K.rbox(g, 0, 0, 1.9, 1.5, ang, -5.8, -2.6, { t: '#5A5F64', l: '#CFE6EE', r: '#B4D2DD' }, { w: 0.6 });
        RJ.nightEach(g, iB, (c, d) => (d.k === K_FILL && c !== '#5A5F64' ? mix('#FFE8B8', '#E9BE7A', clamp((0.81 - hex2rgb(c)[0] / 255) * 6, 0, 1)) : undefined)); { const d = g.cmds.find((q, k) => k >= iB && q.k === K_FILL && q.c !== '#5A5F64'); if (d) d.light = true; }   // (night: lit cabins)
        for (let i = 0; i < 3; i++) { const p = g.p.apply(g, B.pt(-1.2 + i * 1.2, 0.3, -4.2)); g.disc2(p, 1.1, looks[i].skin); g.fill2(arcPts(p[0], p[1] - 0.2, 1.15, Math.PI, TAU, 6), looks[i].hair, true); }
        for (const f of ['pv', 'nv', 'pu', 'nu']) if (B.vis[f]) { g.fill(B.quad(f, -1, 1, -5.8, -5.2), '#F2C230'); const m = B.quad(f, 0, 0, -5.2, -2.6); g.line([m[0], m[3]], { w: 0.3, c: '#7E97A3', boil: false, ext: 0 }); }
            } });
  }));

  /* ---------------- Pedra do Leme, in the surf at the map's corner ---------------- */
  T.obj([69, -50, 87, -34], function (g) {
    g.boilP = 0.2;
    RJ.rock(g, 78, -42, [[RS.WZ, 9, 8, 0, 0], [3, 8.4, 7.4, 0.2, 0.2], [7, 6.8, 6.0, 0.4, 0.3], [10, 4.6, 4.0, 0.5, 0.3], [11.6, 2.2, 1.9, 0.5, 0.3]], { seed: 23, col: '#B8B1A2', veg: [3, 12, 0.7], streaks: 10 });
    const sp = []; for (let i = 0; i < 9; i++) { const a = -0.6 + i * 0.32, p = g.p(78 + Math.cos(a) * 9.6, -42 + Math.sin(a) * 8.6, RS.WZ); sp.push([p[0], p[1]]); } g.line2(sp, { w: 0.8, c: '#F6F8F3', boil: false });
  }, { name: 'pedra do leme' });
  T.cast([77, -35.5], (g) => { g.glow('lantern', 75.8, -35, 3.5, { r: 1.2, col: '#FFD27A', base: 3 }); RJ.person(g, 77, -35.5, 3, Object.assign(RJ.who(6080, { carnaval: false }), { dir: 1, pose: 'hold', cap: '#F3F1EA', hands: [[4, -14], [3, -12]] })); const h = g.p(77, -35.5, 3), t = [h[0] + 18, h[1] - 26]; g.line2([[h[0] + 3.5, h[1] - 12.5], t], { w: 0.35, c: '#5A4632', boil: false }); g.fine2([t, [t[0] + 4, t[1] + 34]], { w: 0.2, c: '#8C8576' }); }, { on: true });
});
