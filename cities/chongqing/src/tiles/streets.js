'use strict';
/* Chongqing's streets and its two rivers, in one map-wide tile.
   - Car streets y = -50 and y = +50 run from the far (west) edge across the map and out over the Jialing on bridges
     (the plain girder bridge at y = -50, Qiansimen's white sail pylon at y = +50). Double yellow centre lines.
   - The pedestrian streets x = -50 (a morning market) and x = +50 (the Jiefangbei walking street) are paved in stone.
   - The Jialing riverside road runs along the near-right edge (x 137..153), the Yangtze riverside road along the
     near-left edge (y 137..153); both end in tunnels under the Chaotianmen square at the tip (chaotianmen.js).
   - Below the promenade railings the quay walls drop 4.3 u to a pebble shoal (the rivers are low in March) and the
     water: the green Jialing, the brown Yangtze, and the line where the two colours meet runs out from the tip.
   Traffic: src/38_traffic.js (searched timetable). Boats run along the rivers, anchored at their far end so they
   slide under the bridges correctly. Nothing that stands is put in front of a car lane: the river railings are drawn
   flat with the ground (they never truly hide a car) so that no street object is pulled into the sprite layer. */
const CQS = { E0: -142, Q: 153, SH: 158, CUT: 196, WL: -5, SHZ: -4.3, POD: 126 };

SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const S = CQS, E0 = S.E0, A = CQC.asph, PV = CQC.pave, LN = CQC.line, YL = '#E3B940', WL = S.WL;
  T.ground(function (g) {
    g.boilP = 0.15;
    /* ---- the water: Jialing (x > SH), Yangtze (y > SH), meeting along the diagonal from the tip ---- */
    const jl = [[S.SH, E0, WL], [S.CUT, E0, WL], [S.CUT, S.CUT, WL], [S.SH, S.SH, WL]];
    const yz = [[E0, S.SH, WL], [S.SH, S.SH, WL], [S.CUT, S.CUT, WL], [E0, S.CUT, WL]];
    g.fill(jl, CQC.jl); g.fill(yz, CQC.yz);
    g.water2(g.P(jl), { c: CQC.jlL, dens: 0.5 }); g.water2(g.P(yz), { c: CQC.yzL, dens: 0.5 });
    // the colour line: feathered streaks of each river into the other, running out from the tip
    { const R = RNG(41), sg = []; for (let i = 0; i < 70; i++) { const t = S.SH + 4 + R() * (S.CUT - S.SH - 6), off = (R() - 0.5) * 4.5, l = 2 + R() * 4; const a = g.p(t + off * 0.5, t - off * 0.5, WL), b = g.p(t + off * 0.5 + l * 0.7, t - off * 0.5 + l * 0.7, WL); sg.push([a, b, off > 0 ? CQC.yz : CQC.jl]); }
      for (const [a, b, c] of sg) g.segs2([a[0], a[1], b[0], b[1]], c, 1.1); g.line([[S.SH + 2, S.SH + 2, WL], [S.CUT, S.CUT, WL]], { w: 0.4, c: '#A89A7A', boil: false, wob: 2 }); }
    // the cut section of the water at the map's near edges
    const D = 1.1;
    g.fill([[S.CUT, S.CUT, WL - D], [S.CUT, E0, WL - D], [S.CUT, E0, WL], [S.CUT, S.CUT, WL]], shade(CQC.jl, 0.25));
    g.fill([[E0, S.CUT, WL - D], [S.CUT, S.CUT, WL - D], [S.CUT, S.CUT, WL], [E0, S.CUT, WL]], shade(CQC.yz, 0.18));
    g.line([[E0, S.CUT, WL], [E0, S.CUT, WL - D], [S.CUT, S.CUT, WL - D], [S.CUT, E0, WL - D], [S.CUT, E0, WL]], { w: 0.85, boil: false });
    g.line([[S.CUT, S.CUT, WL], [S.CUT, S.CUT, WL - D]], { w: 0.7, boil: false });
    g.line([[E0, S.CUT, WL], [S.CUT, S.CUT, WL], [S.CUT, E0, WL]], { w: 0.6, c: '#6F7A70', boil: false });
    /* ---- the pebble shoals and the quay walls ---- */
    const shJ = [[S.Q, E0, S.SHZ], [S.SH, E0, WL], [S.SH, S.POD + 34, WL], [S.Q, S.POD + 34, S.SHZ]];
    const shY = [[E0, S.Q, S.SHZ], [S.POD + 34, S.Q, S.SHZ], [S.POD + 34, S.SH, WL], [E0, S.SH, WL]];
    for (const sh of [shJ, shY]) { g.fill(sh, CQC.shoal); const P = g.P(sh), R = RNG(sh === shJ ? 5 : 6), d = []; for (let i = 0; i < 260; i++) { const u = R(), v = R(); const q = sh === shJ ? g.p(lerp(S.Q, S.SH, v), lerp(E0, S.POD + 34, u), lerp(S.SHZ, WL, v)) : g.p(lerp(E0, S.POD + 34, u), lerp(S.Q, S.SH, v), lerp(S.SHZ, WL, v)); d.push(q[0] - 0.4, q[1], q[0] + 0.4, q[1] + 0.1); } g.segs2(d, CQC.shoalD, 0.7); void P; }
    g.line([[S.SH, E0, WL], [S.SH, S.POD + 34, WL]], { w: 0.5, c: '#7F9A8C', boil: false }); g.line([[E0, S.SH, WL], [S.POD + 34, S.SH, WL]], { w: 0.5, c: '#9A8B6A', boil: false });
    // quay walls: the faces that look over the rivers (x = Q faces +x, y = Q faces +y), stone courses
    const qj = [[S.Q, S.POD, 0], [S.Q, E0, 0], [S.Q, E0, S.SHZ], [S.Q, S.POD, S.SHZ]], qy = [[E0, S.Q, 0], [S.POD, S.Q, 0], [S.POD, S.Q, S.SHZ], [E0, S.Q, S.SHZ]];
    g.fill(qj, CQC.wallD); g.fill(qy, CQC.wall);
    { const c = []; for (let z = -1.1; z > S.SHZ + 0.3; z -= 1.1) { for (const [a, b] of [[g.p(S.Q, E0, z), g.p(S.Q, S.POD, z)], [g.p(E0, S.Q, z), g.p(S.POD, S.Q, z)]]) c.push(a[0], a[1], b[0], b[1]); }
      for (let u = E0 + 2; u < S.POD; u += 3.2) { const k = Math.floor(u); for (let z = 0; z > S.SHZ + 0.5; z -= 1.1) { const o = (Math.round(z / 1.1) % 2) * 1.6; const a = g.p(S.Q, u + o, z), b = g.p(S.Q, u + o, z - 1.1), p = g.p(u + o, S.Q, z), q = g.p(u + o, S.Q, z - 1.1); c.push(a[0], a[1], b[0], b[1], p[0], p[1], q[0], q[1]); } void k; }
      g.segs2(c, '#958C79', 0.26); }
    g.line([[S.Q, E0, 0], [S.Q, S.POD, 0]], { w: 0.85, boil: false }); g.line([[E0, S.Q, 0], [S.POD, S.Q, 0]], { w: 0.85, boil: false });
    g.line([[S.Q, E0, S.SHZ], [S.Q, S.POD, S.SHZ]], { w: 0.6, boil: false }); g.line([[E0, S.Q, S.SHZ], [S.POD, S.Q, S.SHZ]], { w: 0.6, boil: false });

    /* ---- streets ---- */
    // the riverside roads: inner pavement, roadway, the promenade by the railing
    g.fill(K.rect(137, E0, S.Q, S.POD), PV); g.fill(K.rect(139, E0, 151, S.POD), A);
    g.fill(K.rect(E0, 137, S.POD, S.Q), PV); g.fill(K.rect(E0, 139, S.POD, 151), A);
    // the cross streets (car) and their bridges' approaches over the Jialing road
    for (const c of [-50, 50]) { g.fill(K.rect(E0, c - 13, 137, c + 13), PV); g.fill(K.rect(E0, c - 10, S.Q, c + 10), A); }
    // the pedestrian streets: stone slabs
    for (const c of [-50, 50]) { for (const [y0, y1] of [[E0, -63], [-37, 37], [63, 137]]) { g.fill(K.rect(c - 13, y0, c + 13, y1), '#DCD5C6'); const s = []; for (let y = y0 + 2.4; y < y1; y += 2.4) { const a = g.p(c - 13, y, 0), b = g.p(c + 13, y, 0); s.push(a[0], a[1], b[0], b[1]); } for (let x = c - 13 + 3.2; x < c + 13; x += 3.2) { const a = g.p(x, y0, 0), b = g.p(x, y1, 0); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#C7BFAE', 0.25); } }
    // the riverside road's ends at the far edges: a dry brush
    for (const [ax, c] of [['y', 145], ['x', 145], ['x', -50], ['x', 50], ['y', -50], ['y', 50]]) {
      const R = RNG(Math.round(c * 3 + (ax === 'x' ? 1 : 2))), pts = [];
      for (let k = 0; k <= 8; k++) { const t = -13 + 26 * k / 8, j = (R() - 0.5) * 3; pts.push(ax === 'x' ? [E0 - 1 - j, c + t * (c === 145 ? 8 / 13 : 1), 0] : [c + t * (c === 145 ? 8 / 13 : 1), E0 - 1 - j, 0]); }
      g.fill(pts.concat(ax === 'x' ? [[E0 + 0.5, c + (c === 145 ? 8 : 13), 0], [E0 + 0.5, c - (c === 145 ? 8 : 13), 0]] : [[c + (c === 145 ? 8 : 13), E0 + 0.5, 0], [c - (c === 145 ? 8 : 13), E0 + 0.5, 0]]), c === 145 || (ax === 'x' && Math.abs(c) === 50) ? A : '#DCD5C6');
    }
    // scuffs
    for (const c of [-50, 50]) g.scuff(K.rect(E0, c - 10, S.Q, c + 10), { dir: Math.atan2(AY, AX), len: 9, c: CQC.asphS, dens: 0.4, w: 0.55, spread: 0.05 });
    g.scuff(K.rect(139, E0, 151, S.POD), { dir: Math.atan2(AY, -AX), len: 9, c: CQC.asphS, dens: 0.4, w: 0.55, spread: 0.05 });
    g.scuff(K.rect(E0, 139, S.POD, 151), { dir: Math.atan2(AY, AX), len: 9, c: CQC.asphS, dens: 0.4, w: 0.55, spread: 0.05 });
    // double yellow centre lines (broken at the crossings), white edge lines
    const yl = (pts) => g.line(pts, { c: YL, w: 0.55, boil: false, ext: 0 });
    for (const c of [-50, 50]) for (const [x0, x1] of [[E0, -66], [-34, 34], [66, 136]]) for (const d of [-0.4, 0.4]) yl([[x0, c + d, 0], [x1, c + d, 0]]);
    for (const [a0, a1] of [[E0, -63], [-37, 37], [63, S.POD]]) for (const d of [-0.4, 0.4]) { yl([[145 + d, a0, 0], [145 + d, a1, 0]]); yl([[a0, 145 + d, 0], [a1, 145 + d, 0]]); }
    // zebras where the pedestrian streets cross the car streets, and across the riverside roads' far ends
    for (const px of [-50, 50]) for (const cy of [-50, 50]) { for (let x = px - 11; x < px + 11; x += 2.2) g.fill(K.rect(x, cy - 9.5, x + 1.2, cy + 9.5), LN); for (const s of [-1, 1]) g.line([[px - 12.5 * s - 1.5 * s, cy + 0.5 * s, 0], [px - 12.5 * s - 1.5 * s, cy + 9.5 * s, 0]], { c: LN, w: 0.9, boil: false }); }
    for (const cy of [-50, 50]) { for (let y = cy - 9; y < cy + 9; y += 2.2) g.fill(K.rect(130, y, 134.5, y + 1.2), LN); for (let x = 139.5; x < 151; x += 2.2) { g.fill(K.rect(x, cy - 16, x + 1.2, cy - 11.5), LN); g.fill(K.rect(x, cy + 11.5, x + 1.2, cy + 16), LN); } }
    for (const px of [-50, 50]) for (let x = px - 11; x < px + 11; x += 2.2) g.fill(K.rect(x, 139.5, x + 1.2, 150.5), LN);
    // kerbs
    const kb = { w: 0.5, c: '#A39C8E', boil: false };
    for (const c of [-50, 50]) for (const d of [-10, 10]) g.line([[E0, c + d, 0], [137, c + d, 0]], kb);
    g.line([[139, E0, 0], [139, S.POD, 0]], kb); g.line([[151, E0, 0], [151, S.POD, 0]], kb); g.line([[E0, 139, 0], [S.POD, 139, 0]], kb); g.line([[E0, 151, 0], [S.POD, 151, 0]], kb);
    // the promenade railings along the rivers: flat with the ground (see the header), with gaps at the stairs and streets
    const railJ = [], railY = [];
    for (let y = E0; y < S.POD - 1; y += 1.5) { if (Math.abs(y + 50) < 11 || Math.abs(y - 50) < 11 || [-120, -8, 92].some((q) => y > q - 1 && y < q + 2)) continue; railJ.push(y); }
    for (let x = E0; x < S.POD - 1; x += 1.5) { if ([-118, -12, 70].some((q) => x > q - 1 && x < q + 2)) continue; railY.push(x); }
    const rs = [];
    for (const y of railJ) { const a = g.p(152.6, y, 0), b = g.p(152.6, y, 1.5); rs.push(a[0], a[1], b[0], b[1]); }
    for (const x of railY) { const a = g.p(x, 152.6, 0), b = g.p(x, 152.6, 1.5); rs.push(a[0], a[1], b[0], b[1]); }
    g.segs2(rs, '#6A6358', 0.3);
    const tr = [[E0, -61], [-39, 39], [61, S.POD]].map(([a, b]) => [g.p(152.6, a, 1.5), g.p(152.6, b, 1.5)]).concat([[g.p(E0, 152.6, 1.5), g.p(S.POD, 152.6, 1.5)]]);
    for (const [a, b] of tr) g.line2([a, b], { w: 0.55, c: '#4E4840', boil: false, ext: 0 });
    // at night: a lamp on every eighth railing post along the promenades, and lights set in the quay walls below them,
    // laying columns of light on the rivers
    for (let k = 0; k < railJ.length; k += 4) { const y = railJ[k]; if (k % 8 === 0) g.glow('lamp', 152.6, y, 1.6, { r: 0.9, base: 0 }); else g.glow('lantern', S.Q + 0.05, y, -1.6, { r: 0.75, col: '#FFC27A', base: S.SHZ }); }
    for (let k = 0; k < railY.length; k += 4) { const x = railY[k]; if (k % 8 === 0) g.glow('lamp', x, 152.6, 1.6, { r: 0.9, base: 0 }); else g.glow('lantern', x, S.Q + 0.05, -1.6, { r: 0.75, col: '#FFC27A', base: S.SHZ }); }
    // the map's far ends are plain cut lines
    g.line([[137, E0, 0], [S.Q, E0, 0]], { w: 0.8, boil: false }); g.line([[E0, 137, 0], [E0, S.Q, 0]], { w: 0.8, boil: false });
    // river fog: soft layered bands lying low over the water and the foot of the quays, thinning away from the bank
    const band = (ax, a0, a1, c0, c1, z, alpha, seed) => { const R = RNG(seed), pts = [], n = 28; for (let i = 0; i <= n; i++) { const u = lerp(a0, a1, i / n), w = c0 + (R() - 0.5) * 2.4; pts.push(ax === 'y' ? [w, u, z] : [u, w, z]); } for (let i = n; i >= 0; i--) { const u = lerp(a0, a1, i / n), w = c1 + (R() - 0.5) * 4; pts.push(ax === 'y' ? [w, u, z] : [u, w, z]); } g.fill2(K.curve(g.P(pts), 2, true), 'rgba(248,247,242,' + alpha + ')', true); };
    for (const [c0, c1, a, sd] of [[S.Q + 0.3, S.Q + 9, 0.38, 1], [S.Q + 0.3, S.Q + 16, 0.22, 2], [S.Q + 12, S.Q + 30, 0.16, 3]]) { band('y', E0, S.POD + 34, c0, c1, S.SHZ + 0.4, a, sd); band('x', E0, S.POD + 34, c0, c1, S.SHZ + 0.4, a, sd + 9); }
    { const R = RNG(17), st = []; for (let i = 0; i < 90; i++) { const u = E0 + R() * (S.POD + 30 - E0), w = S.Q + 2 + R() * 20, l = 4 + R() * 9; const a = R() < 0.5 ? g.p(w, u, S.SHZ + 0.5) : g.p(u, w, S.SHZ + 0.5); st.push(a[0], a[1], a[0] + l, a[1] - l * 0.05); } g.segs2(st, 'rgba(250,249,245,0.55)', 1.1); }
    // still mist lying on the water near the far ends
    for (const [x, y, w, h, s] of [[176, -120, 70, 16, 1], [178, 20, 60, 14, 2], [-100, 178, 80, 15, 3], [40, 182, 60, 12, 4]]) g.at(x, y, WL + 0.2, (g2) => CQ.mist2(g2, w, h, s, 0.5));
  });

  /* ---- the morning market down the walking street x = -50, and flower beds along x = +50 (all flat or people) ---- */
  T.ground(function (g) {
    const R = RNG(88), goods = [['#8FBF73', '#5E8F4A', '#B5CF84'], ['#E08A3C', '#E6C24F', '#C8392E'], ['#E9E2CF', '#C9B48A', '#D98AA4'], ['#C8392E', '#7A1E18', '#E6C24F'], ['#6E9F4F', '#F3EFE2', '#A4C66B']];
    for (let i = 0; i < 12; i++) {
      const side = i % 2, y = -34 + Math.floor(i / 2) * 11.5 + side * 4, x0 = side ? -45.5 : -60, cols = goods[i % goods.length];
      const mat = K.rect(x0, y, x0 + 5.5, y + 4.5, 0); g.fill(mat, R.pick(['#3F6FA8', '#C8392E', '#E6B84A', '#3F8F5A', '#D9CDB4'])); g.outline(mat, { w: 0.35, c: '#5A564E', boil: false });
      for (let k = 0; k < 10; k++) { const p = g.p(x0 + 0.8 + (k % 5) * 1.0, y + 1.0 + Math.floor(k / 5) * 2.2, 0.3); g.disc2(p, 0.9, cols[k % 3]); }
      const b = g.p(x0 + 6.4, y + 3.6, 0); g.fill2([[b[0] - 1.6, b[1]], [b[0] + 1.6, b[1]], [b[0] + 1.9, b[1] - 2.2], [b[0] - 1.9, b[1] - 2.2]], '#B89A62', true); g.disc2([b[0], b[1] - 2.6], 1.5, cols[0]);
      g.glow('lamp', x0 + 6.4, y + 3.6, 1.1, { r: 0.7 });                        // a stall lamp clipped to the basket (night)
    }
    for (const y of [-26, -6, 14, 30, 80, 110, -90, -120]) { const c = []; for (let k = 0; k < 14; k++) { const a = TAU * k / 14; c.push([50 + Math.cos(a) * 4, y + Math.sin(a) * 4, 0]); } g.fill(c, '#B07A5A'); g.fill(c.map((p) => [50 + (p[0] - 50) * 0.8, y + (p[1] - y) * 0.8, 0.4]), '#7FA35E'); g.glow('lamp', 50, y, 0.9, { r: 0.8 }); const R2 = RNG(y + 500); for (let k = 0; k < 16; k++) { const a = R2() * TAU, d = R2() * 2.8, p = g.p(50 + Math.cos(a) * d, y + Math.sin(a) * d, 0.5); g.disc2(p, 0.7, R2.pick(['#D9442F', '#F2C230', '#F1D5DD', '#F4F1E8', '#E08A3C'])); } }
  });
  for (let i = 0; i < 12; i++) {
    const side = i % 2, y = -34 + Math.floor(i / 2) * 11.5 + side * 4, x0 = side ? -45.5 : -60;
    const vx = side ? x0 + 6.6 : x0 - 1.3, vy = y + 2.2;
    T.cast([vx, vy], (g) => { CQ.stool(g, vx, vy, '#4F7FB8'); K.person(g, vx, vy, 1.3, CQ.elder(2000 + i, { dir: side ? 2 : 0, pose: 'sit', reach: [3, 3] })); }, { name: 'vendor' });
    const sx = x0 + 2.8 + (side ? -4.8 : 4.6), sy = y + 2 + (i % 3) * 0.6;
    T.cast([sx, sy], (g) => CQ.person(g, sx, sy, 0, CQ.who(2020 + i, { dir: side ? 0 : 2, pose: 'hold', bag: ['#C8392E', '#E6B84A', '#3F6FA8', undefined][i % 4] })), { name: 'shopper' });
  }
  for (const [x, y, sd] of [[54.5, -22, 2040], [45.5, -3, 2041], [54.5, 16, 2042], [45.5, 84, 2043], [54.5, 106, 2044], [45.5, -94, 2045]]) T.cast([x, y], (g) => { CQ.person(g, x, y, 0, CQ.elder(sd, { dir: x > 50 ? 2 : 0, pose: sd % 2 ? 'hold' : 'stand', cage: sd % 3 === 0, bird: '#E6C24F' })); }, { name: 'stroller' });

  /* No lamps or trees stand on the pavements: a standing thing beside a car lane is taken for something that can
     hide the cars, becomes a sprite, and drags its neighbours on the places into the sprite layer (bake budget). */

  /* ---- the bridges over the Jialing: deck pieces with { under: 0 } (boats pass beneath, cars ride on top) ---- */
  const bridge = (c, sail) => {
    const xs = [S.Q, 167, 181, S.CUT];
    for (let i = 0; i < 3; i++) {
      const x0 = xs[i], x1 = xs[i + 1];
      T.obj([x0, c - 11, x1, c + 11], (g) => {
        g.boilP = 0.2;
        // piers in the water under this piece
        if (i < 2) for (const yy of [c - 7, c + 7]) K.box(g, x1 - 1.4, yy - 1.3, x1 + 1.4, yy + 1.3, WL, -1.4, { t: '#C9C6BD', l: '#BDB9AE', r: '#A6A296' }, { w: 0.6 });
        // the deck: fascia on its near side (+y) and the cut end at the map edge
        g.fill([[x0, c + 11, -1.4], [x1, c + 11, -1.4], [x1, c + 11, 0], [x0, c + 11, 0]], sail ? '#E7E6E0' : '#C9C6BD');
        g.fill(K.rect(x0, c - 11, x1, c + 11, 0), PV); g.fill(K.rect(x0, c - 10, x1, c + 10, 0), A);
        g.scuff(K.rect(x0, c - 10, x1, c + 10, 0), { dir: Math.atan2(AY, AX), len: 8, c: CQC.asphS, dens: 0.4, w: 0.5, spread: 0.05 });
        for (const d of [-0.4, 0.4]) g.line([[x0, c + d, 0], [x1, c + d, 0]], { c: YL, w: 0.55, boil: false, ext: 0 });
        if (i === 2) { g.fill([[x1, c + 11, -1.4], [x1, c - 11, -1.4], [x1, c - 11, 0], [x1, c + 11, 0]], C.slabD); g.line([[x1, c + 11, 0], [x1, c + 11, -1.4], [x1, c - 11, -1.4], [x1, c - 11, 0]], { w: 0.8, boil: false }); }
        g.line([[x0, c + 11, 0], [x1, c + 11, 0]], { w: 0.8, boil: false }); g.line([[x0, c + 11, -1.4], [x1, c + 11, -1.4]], { w: 0.6, boil: false });
        // parapets: low rails both sides (the near one never hides a car: drawn with the deck)
        const iR = g.cmds.length;
        CQ.rail(g, 'L', c - 10.6, x0, x1, 0, { h: 1.3, col: '#6A6358', sp: 1.2 }); CQ.rail(g, 'L', c + 10.6, x0, x1, 0, { h: 1.3, col: '#6A6358', sp: 1.2 });
        // at night: the parapets are strings of amber light, and a row of amber points along the deck's edge (Qiansimen's
        // trusses are lit with amber point lights) lays its reflection on the Jialing
        CQ.nmark(g, iR, null, { nc: sail ? '#F2B24E' : '#E8A24A' }, true);
        for (let x = x0 + 1.1; x < x1; x += 2.2) g.glow('lantern', x, c + 11.05, -0.7, { r: 0.55, col: '#FFB347', base: WL });
      }, { under: 0, name: 'bridge' });
    }
  };
  bridge(-50, false); bridge(50, true);
  // Qiansimen: one white sail-shaped pylon standing in the water just off the deck's far side, its cables fanning down
  // to the deck edge. Its own object, wholly behind the deck and the cars on it.
  T.obj([166, 33, 178, 38.9], (g) => {
    const c = 50, px = 172, py = c - 12.5, H = 34;
    K.box(g, px - 1.4, py - 1.2, px + 1.4, py + 1.2, WL, 0.2, '#D9D6CC', { w: 0.6 });
    const sailP = [[px - 1.2, py, 0], [px + 1.2, py, 0], [px + 2.6, py, H * 0.55], [px + 1.4, py, H], [px - 0.6, py, H * 0.92], [px - 1.6, py, H * 0.45]];
    g.fill(sailP, '#F4F3EE'); g.mark({ nc: '#FFF0CF' }); g.fill([[px + 1.2, py, 0], [px + 1.2, py + 0.6, 0], [px + 2.6, py + 0.6, H * 0.55], [px + 1.4, py + 0.6, H], [px + 1.4, py, H], [px + 2.6, py, H * 0.55]], '#DAD8D0'); g.mark({ nc: '#E9BE7A' });   // floodlit at night
    g.outline(sailP, { w: 0.8 });
    const cs = []; for (let k = 0; k < 9; k++) { const z = H * (0.5 + k * 0.055), a = g.p(px + 0.6, py, z); for (const xx of [px - 13 + k * 0.9, px + 13 - k * 0.9]) { const b = g.p(xx, c - 10.6, 0.6); cs.push(a[0], a[1], b[0], b[1]); } } g.segs2(cs, '#8C8576', 0.28);
    g.cmds[g.cmds.length - 1].nc = '#E8B466';                                    // the stay cables catch the light
    for (const [z, r] of [[H * 0.18, 3.4], [H * 0.45, 3.0], [H * 0.72, 2.6], [H * 0.93, 2.0]]) g.glow('lantern', px + 0.6, py + 0.3, z, { r, col: '#FFE7B8', base: WL });
  }, { name: 'qiansimen pylon' });

  /* ---- traffic ---- */
  const CARS = ['#F1EFE8', '#C9CCCC', '#2F343B', '#8FA3B5', '#B9A27D', '#E7E2D6', '#6C7A89', '#A9473D'];
  CQT.LANES.forEach((L, li) => [0, 1].forEach((k) => {
    const kind = CQT.KIND[li][k], col = CARS[(li * 3 + k * 5) % CARS.length], who = CQ.who(300 + li * 2 + k);
    T.actor({ cast: false, sample: 0.18, period: CQT.P,
      at(t) { const s = CQT.at(li, k, t); if (!s || s.hidden) return null; return { x: s.x, y: s.y, key: 'v', ang: s.ang, alpha: s.alpha }; },
      draw(g, st) { if (kind === 'taxi') CQ.taxi(g, st.ang); else if (kind === 'bus') CQ.bus(g, st.ang, { band: li % 2 ? '#3F6FA8' : '#C8392E' }); else if (kind === 'moto') CQ.moto(g, st.ang, { who, col: '#3F6FA8', helmet: '#E6C24F' }); else K.car(g, st.ang, { col }); } });
  }));

  /* ---- boats: each anchored at its far end (smallest x + y) so a bridge deck hides it correctly ---- */
  const boat = (o) => {
    const len = o.b - o.a, per = (len + 2 * o.L) / o.v * 2;
    if (o.at) { const u = (o.at[1] - o.a + o.L) / (len + 2 * o.L); o.ph = (((u / 2 - o.at[0] / per) % 1) + 1) % 1; }
    T.actor({ grow: false, sample: 0.4, period: per,
      at(t) {
        const ph = (((t / per + (o.ph || 0)) % 1) + 1) % 1;               // out along the river and back
        const out = ph < 0.5, u = out ? ph * 2 : (1 - ph) * 2, s = o.a - o.L + (len + 2 * o.L) * u, head = out ? 1 : -1;
        const alpha = clamp(Math.min(s - o.a, o.b - s) / 12 + 1, 0, 1); if (alpha < 0.03) return null;
        const ang = o.ax === 'y' ? (head > 0 ? Math.PI / 2 : -Math.PI / 2) : (head > 0 ? 0 : Math.PI);
        const far = s - o.L;                                              // the far end along the axis
        return { x: o.ax === 'y' ? o.c : far, y: o.ax === 'y' ? far : o.c, z: WL, key: o.kind + head, ang, head, alpha: alpha < 1 ? alpha : null };
      },
      draw(g, st) { g.at(o.ax === 'y' ? 0 : o.L, o.ax === 'y' ? o.L : 0, 0, (g2) => CQ.boat(g2, st.ang, { kind: o.kind, L: o.L, load: o.load })); } });
  };
  boat({ ax: 'y', c: 176, a: E0, b: S.CUT, L: 12, v: 3.2, kind: 'barge', ph: 0.1 });
  boat({ ax: 'y', c: 187, a: E0, b: S.CUT, L: 5.5, v: 4.5, kind: 'ferry', ph: 0.62 });
  // the container barge passes under the cable car as its two cabins meet over the river (the suodao shot)
  const SD = SCENE.shots.find((q) => q.name === 'suodao');
  boat({ ax: 'x', c: 172, a: E0, b: S.CUT, L: 12, v: 3.0, kind: 'barge', load: 'box', ph: 0.35, at: SD ? [SD.a / 30 + 4, -104] : null });
  boat({ ax: 'x', c: 186, a: E0, b: S.CUT, L: 11, v: 2.6, kind: 'cruise', ph: 0.8 });

  /* ---- life on the shoals and the promenades ---- */
  // anglers on the Jialing shoal, a kite flyer and a dog walker on the Yangtze shoal, winter swimmers
  const SHZ = S.SHZ - 0.3;
  for (const [x, y, s, d] of [[156, -100, 11, 0], [156, -30, 12, 0], [156, 80, 13, 0]]) T.cast([x, y], (g) => { const r = K.person(g, x, y, SHZ, CQ.elder(s, { dir: d, pose: 'hold' })); const h = r.hands[0], e = g.p(x + 7, y - 2, WL + 0.2); g.fine2([[h[0], h[1]], [h[0] + 9, h[1] - 12], [e[0], e[1]]], { w: 0.3, c: '#4A4540' }); K.cyl(g, x - 0.8, y + 1.2, 0.6, SHZ, SHZ + 1.0, '#4F7FB8', { w: 0.35, n: 8 }); g.glow2('lantern', e, e, { r: 0.6, col: '#8CFF9E' }); }, { on: true });   // night fishing: a glowing float
  T.cast([-60, 155.5], (g) => { K.person(g, -60, 155.5, SHZ, CQ.who(21, { dir: 1, pose: 'cheer', ph: 0.3, k: 0.8 })); K.person(g, -57.5, 156, SHZ, CQ.who(22, { dir: 1, pose: 'hold' })); }, { on: true });
  T.actor({ sample: 5, period: 12, at(t) { const f = Math.floor(t * 4) % 8; return { x: -62, y: 166, z: 12 + Math.sin(t * 0.8) * 1.2, key: f, f }; }, draw(g, st) { const c = g.p(0, 0, 0), s = Math.sin(st.f * TAU / 8); g.fill2([[c[0], c[1] - 4], [c[0] + 3, c[1]], [c[0], c[1] + 4.5], [c[0] - 3, c[1]]], '#D9442F', true); g.fill2([[c[0], c[1] - 4], [c[0] + 3, c[1]], [c[0], c[1]]], '#E6C24F', true); g.fine2([[c[0], c[1] + 4.5], [c[0] + 1 + s, c[1] + 9], [c[0] - 1, c[1] + 14]], { w: 0.4, c: '#D9442F' }); const e = g.p(0, -10, -12 + 3); g.fine2([[c[0], c[1]], [e[0], e[1]]], { w: 0.2, c: '#5A564E' }); } });
  CQ.walk(T, CQ.who(23), [[-30, 155.5], [20, 155.5]], 1.4, { z: SHZ, phase: 0.2 });
  CQ.walk(T, CQ.elder(24), [[40, 155.5], [110, 155.5]], 1.3, { z: SHZ, phase: 0.6 });
  T.cast([5, 157], (g) => { K.person(g, 5, 157, SHZ, CQ.elder(25, { dir: 1, top: '#C9463E', bot: '#C9463E', shorts: true, bare: true, hairStyle: 'buzz', cap: '#E6C24F' })); }, { on: true });
  // walkers along the promenades (in front of the cars, behind the railing line)
  CQ.walk(T, CQ.who(31), [[152, -130], [152, -64], [152, -36], [152, 30]], 1.5, { phase: 0.1 });
  CQ.walk(T, CQ.who(32, { umbrella: '#3F6FA8' }), [[152, 120], [152, 64]], 1.4, { phase: 0.5 });
  CQ.walk(T, CQ.elder(33, { cage: true, bird: '#E6C24F' }), [[-130, 152], [-20, 152]], 1.2, { phase: 0.3 });
  CQ.walk(T, CQ.who(34), [[10, 152], [110, 152]], 1.6, { phase: 0.7 });
  // morning mist drifting slowly along the rivers and over the far ridge
  for (const [x0, y0, dx, dy, w, h, z, sd] of [[170, -150, 0, 1, 110, 26, -2, 11], [178, -10, 0, 1, 90, 20, -2, 12], [-150, 176, 1, 0, 120, 24, -2, 13], [10, 184, 1, 0, 100, 20, -2, 14], [-120, -150, 1, 0.3, 90, 22, 30, 15], [-60, -170, 0.4, 1, 80, 18, 34, 16]]) {
    T.actor({ layer: 'top', grow: false, sample: 5, period: 60, cast: false,
      at(t) { const u = ((t / 160 + sd * 0.137) % 1), d = u * 90 - 45, a = Math.min(1, u * 5, (1 - u) * 5); return { x: x0 + dx * d, y: y0 + dy * d, z, key: 'm', alpha: a < 1 ? a * 0.9 : 0.9 }; },
      draw(g) { CQ.mist2(g, w, h, sd, 0.55); } });
  }
  // birds over the water
  for (let i = 0; i < 4; i++) T.actor({ layer: 'top', sample: 5, period: 30, at(t) { const u = ((t / 30 + i * 0.27) % 1); const x = i < 2 ? 160 + u * 30 : -120 + u * 230, y = i < 2 ? -120 + u * 260 : 165 + Math.sin(u * 9 + i) * 6; return { x, y, z: 10 + i * 2, key: Math.floor(t * 4 + i) % 4, f: Math.floor(t * 4 + i) % 4 }; }, draw(g, st) { CQ.bird2(g, g.p(0, 0, 0), st.f, '#F6F3EA'); g.segs2([], '#000', 0.1); } });
});
