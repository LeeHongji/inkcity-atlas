'use strict';
/* (-100,0) The Flatiron and Madison Square.
   What it is: Burnham's 1902 Flatiron Building, a 22-storey wedge on the triangle where Broadway slants across the grid.
   Drawn as it is built: a three-storey rusticated limestone base, a tall shaft of cream terracotta with rows of windows
   between continuous piers, the rounded prow, a deep cornice and a crown of arched top-floor windows. Its prow points
   at us (north), so both long faces show: the lit one on Broadway, the shaded one on the plaza side. Broadway runs
   diagonally through the tile as a real road with its own bike lane, from the avenue at the far left into the prow
   plaza; on the other side of the wedge a pedestrian plaza (the Flatiron plazas) with granite blocks, green tables and
   planters. North of the prow lies Madison Square Park: lawns under big plane trees, a fenced dog run, the burger kiosk
   with its long queue, benches, a statue. Low lofts and walk-ups (fire escapes, a water tank) fill the edges.
   Who is there: people queueing for burgers and eating them on the benches, dogs chasing a ball in the run, a tourist
   lying on the plaza to fit the whole wedge into a photo, chess at a plaza table, a parked cab dropping someone off.
   What moves: Citi Bike riders down Broadway and out along the plaza, walkers in the park and on the plaza, the dogs. */
SF.tile('flatiron', -100, 0, { rim: 14 }, function (T) {
  /* the wedge: prow P pointing at us and a little to the right, its angle a touch wider than the real one so both faces read */
  const TH = 40 * Math.PI / 180, P = [8, 4], LEN = 31.5, ax = [-Math.cos(TH), -Math.sin(TH)], hw = LEN * Math.tan(18 * Math.PI / 180), pp = [-Math.sin(TH), Math.cos(TH)];
  const BK = [P[0] + ax[0] * LEN, P[1] + ax[1] * LEN], B1 = [BK[0] + pp[0] * hw, BK[1] + pp[1] * hw], B2 = [BK[0] - pp[0] * hw, BK[1] - pp[1] * hw];
  const nrm = (a, b) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
  const uL = nrm(P, B1), uR = nrm(P, B2), nL = [uL[1], -uL[0]], nR = [-uR[1], uR[0]];   // outward normals of the two faces
  const along = (u, n, t, d) => [P[0] + u[0] * t + n[0] * d, P[1] + u[1] * t + n[1] * d];
  // Broadway: a band beside the lit face, d 2.6..11; the plaza beside the shaded face, d 2.6..9
  const band = (u, n, d0, d1, t0, t1) => [along(u, n, t0, d0), along(u, n, t0, d1), along(u, n, t1, d1), along(u, n, t1, d0)];
  const BW = [along(uL, nL, -6, 2.6), along(uL, nL, -6, 11.2), along(uL, nL, 44.0, 11.2), along(uL, nL, 47.5, 2.6)];
  const PZ = [along(uR, nR, -6, 2.6), along(uR, nR, -6, 9.5), along(uR, nR, 42.4, 9.5), along(uR, nR, 46.8, 2.6)];

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    NK.lot(g, { inner: '#E3DED3' });
    // Madison Square Park (near left): lawn inside a low fence
    const park = [[-31, 2.4], [2.5, 16.0], [4, 31], [-31, 31]];
    g.fill(park.map((p) => [p[0], p[1], 0]), C.grass); g.grass(park.map((p) => [p[0], p[1], 0]), { dens: 0.9 });
    // park paths: a loop and a diagonal
    const path = K.curve([[-27, 6, 0], [-14, 9, 0], [-3, 17, 0], [-6, 27, 0], [-20, 28, 0], [-28, 20, 0]], 6, true);
    g.line(path, { w: 3.2, c: '#E2D6BC', boil: false }); g.line(path, { w: 0.4, c: '#C7B998', boil: false });
    g.line([[-14, 9, 0], [-20, 28, 0]], { w: 2.4, c: '#E2D6BC', boil: false });
    // the dog run: gravel inside a fence
    g.fill(K.rect(-29, 21, -21, 29), '#D9C9A8'); g.scuff(K.rect(-29, 21, -21, 29), { dir: 0.3, len: 1, c: '#C2B08C', dens: 1, w: 0.5, spread: 3 });
    // Broadway: asphalt, a green bike lane on its park side, a dashed centre
    const bw = BW.map((p) => [p[0], p[1], 0]); g.fill(bw, NYC.asph);
    g.scuff(bw, { dir: Math.atan2(uL[0] * AY + uL[1] * AY, uL[0] * AX - uL[1] * AX), len: 8, c: '#DCD8CF', dens: 0.4, w: 0.5, spread: 0.05 });
    g.fill([along(uL, nL, -6, 8.6), along(uL, nL, -6, 11.0), along(uL, nL, 44.2, 11.0), along(uL, nL, 45.6, 8.6)].map((p) => [p[0], p[1], 0.01]), NYC.bike);
    const dl = []; for (let t = -4; t < 44; t += 6) { const a = g.p.apply(g, along(uL, nL, t, 5.6).concat([0.02])), b = g.p.apply(g, along(uL, nL, t + 3, 5.6).concat([0.02])); dl.push(a[0], a[1], b[0], b[1]); }
    g.segs2(dl, '#F7F5EE', 0.7);
    
    // the plaza on the other side: terracotta-tinted paving with joints
    const pz = PZ.map((p) => [p[0], p[1], 0]); g.fill(pz, '#E7D7C4'); g.scuff(pz, { dir: -0.5, len: 2.5, c: '#D6C2A8', dens: 0.8, w: 0.45 });
    g.outline(pz, { w: 0.4, c: '#BFAE95', boil: false });
    // the prow plaza in front of the wedge
    const pr = [[4.5, 16.4, 0], [12.6, 8.0, 0], [19.2, 3.2, 0], [31, 3.2, 0], [31, 31, 0], [6, 31, 0]]; g.fill(pr, '#E7D7C4'); g.scuff(pr, { dir: -0.5, len: 2.5, c: '#D6C2A8', dens: 0.8, w: 0.45 });
  }, { rim: true });

  /* ---------------- the Flatiron ---------------- */
  T.obj([Math.min(B1[0], B2[0]), Math.min(B1[1], B2[1]), P[0] + 0.6, P[1] + 0.6], function (g) {
    g.boilP = 0.3;
    const lit = { l: '#E7D7BB', r: '#C9B79A', t: '#EFE6D4' }, base = { l: '#D7D1C2', r: '#BAB3A2' };
    const tone = (n, c) => mix(c.l, c.r, clamp(0.5 + 0.5 * (n[0] - n[1]) / Math.SQRT2 * 1.4, 0, 1));
    const Z0 = 4.2, Z1 = 24.2, ZT = 26.2;
    // faces (the back one is hidden): base, shaft, crown
    const face = (a, b, z0, z1, col) => g.fill([[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], col);
    for (const [B, n] of [[B1, nL], [B2, nR]]) { face(P, B, 0, Z0, tone(n, base)); face(P, B, Z0, ZT, tone(n, lit)); }
    // windows: dark rows between continuous piers on both faces
    const rows = [], piers = [];
    for (const [B, n] of [[B1, nL], [B2, nR]]) {
      const L = Math.hypot(B[0] - P[0], B[1] - P[1]), at = (s, z) => [P[0] + (B[0] - P[0]) * s / L + n[0] * 0.04, P[1] + (B[1] - P[1]) * s / L + n[1] * 0.04, z];
      for (let z = Z0 + 0.4; z < Z1 - 0.6; z += 1.3) g.fill([at(1.2, z), at(L - 0.4, z), at(L - 0.4, z + 0.62), at(1.2, z + 0.62)], n === nL ? '#5E6670' : '#4F5760');
      for (let s = 1.2; s < L - 0.3; s += 1.7) { const a = g.p.apply(g, at(s, Z0 + 0.2)), b = g.p.apply(g, at(s, Z1 - 0.2)); piers.push(a[0], a[1], b[0], b[1]); }
      // the rusticated base: shop windows and coursing
      for (let s = 2.5; s < L - 2; s += 3.6) g.fill([at(s, 0.3), at(s + 2.6, 0.3), at(s + 2.6, 2.6), at(s, 2.6)], '#CFE0EA');
      for (let z = 0.9; z < Z0; z += 0.9) { const a = g.p.apply(g, at(0.5, z)), b = g.p.apply(g, at(L, z)); rows.push(a[0], a[1], b[0], b[1]); }
      // the crown: arched windows in the top floors, the deep cornice above them
      for (let s = 1.6; s < L - 0.6; s += 1.7) { const c = at(s, Z1 + 0.3), d = at(s + 0.9, Z1 + 0.3); g.fill([c, d, [d[0], d[1], Z1 + 1.3], [(c[0] + d[0]) / 2, (c[1] + d[1]) / 2, Z1 + 1.6], [c[0], c[1], Z1 + 1.3]], '#5E6670'); }
      const k0 = [P[0] + n[0] * 0.7 - (B[0] - P[0]) / L * 0.4, P[1] + n[1] * 0.7 - (B[1] - P[1]) / L * 0.4], k1 = [B[0] + n[0] * 0.7, B[1] + n[1] * 0.7];
      g.fill([[P[0], P[1], ZT - 0.3], [B[0], B[1], ZT - 0.3], [k1[0], k1[1], ZT + 0.3], [k0[0], k0[1], ZT + 0.3]], shade(tone(n, lit), 0.12));
      g.fill([[k0[0], k0[1], ZT + 0.3], [k1[0], k1[1], ZT + 0.3], [k1[0], k1[1], ZT + 0.75], [k0[0], k0[1], ZT + 0.75]], tone(n, lit));
      g.line([[P[0], P[1], 0], [B[0], B[1], 0]], { w: 0.9 }); g.line([[k0[0], k0[1], ZT + 0.75], [k1[0], k1[1], ZT + 0.75]], { w: 0.8 });
      g.line([[P[0], P[1], Z0], [B[0], B[1], Z0]], { w: 0.5, boil: false }); g.line([[P[0], P[1], Z1], [B[0], B[1], Z1]], { w: 0.45, boil: false });
    }
    g.segs2(piers, '#E9DCC3', 0.42); g.segs2(rows, '#A9A292', 0.3);
    g.fill([[P[0], P[1], ZT + 0.75], [B1[0] + nL[0] * 0.7, B1[1] + nL[1] * 0.7, ZT + 0.75], [B2[0] + nR[0] * 0.7, B2[1] + nR[1] * 0.7, ZT + 0.75]], '#D9CFBC');
    g.line([[B1[0], B1[1], 0], [B1[0], B1[1], ZT]], { w: 0.9 }); g.line([[B2[0], B2[1], 0], [B2[0], B2[1], ZT]], { w: 0.9 });
    // a small penthouse and a flagpole at the back of the roof
    { const c = [BK[0] + ax[0] * -4, BK[1] + ax[1] * -4]; K.box(g, c[0] - 2.2, c[1] - 2.2, c[0] + 2.2, c[1] + 2.2, ZT + 0.75, ZT + 2.6, { t: '#E4DCCB', l: '#D9CBB0', r: '#BFAF93' }, { w: 0.6 }); }
    // the rounded prow: a slim drum with its own windows
    K.cyl(g, P[0] - 0.5, P[1] - 0.5, 0.9, 0, ZT + 0.75, { t: '#EFE6D4', l: '#E7D7BB', r: '#C9B79A' }, { w: 0.9, n: 10 });
    const pw = []; for (let z = Z0 + 0.4; z < Z1; z += 1.3) { const a = g.p(P[0] - 0.6, P[1] + 0.3, z), b = g.p(P[0] + 0.2, P[1] - 0.6, z); pw.push(a[0], a[1] + 0.3, b[0], b[1] + 0.3); }
    g.segs2(pw, '#5E6670', 1.2);
  }, { name: 'flatiron' });

  /* ---------------- the edges: lofts and walk-ups ---------------- */
  T.obj([16, -31, 31, -4], (g) => { const h = NK.castIron(g, 16, -31, 31, -4, 3, { col: '#E3DCCB' }); NK.tank(g, 21, -26, h + 0.6, { r: 1.7, h: 3.2 }); NK.shop(g, 'L', -4, 17, 30, { h: 4.4, col: '#2F2C2A', word: 'TOYS', signCol: '#C9463E', awning: '#C9463E' }); NK.shop(g, 'R', 31, -30, -5, { h: 4.4, col: '#2F2C2A', word: 'MARKET', signCol: '#3E6B4F', goods: ['#E08A3C', '#C9463E', '#8FBF73', '#E6C24F'] }); }, { name: 'toy building' });
  T.obj([5.5, -31, 14.5, -22], (g) => NK.walkup(g, 5.5, -31, 14.5, -22, 4, { face: 'R', col: NYC.brick3, shop: { col: '#2F6DB5', word: 'PIZZA', awning: '#C9463E', stripe: '#F3F1EA' } }), { name: 'walkup pizza' });
  T.obj([-31, -31, -20, -18], (g) => { NK.block(g, -31, -31, -20, -18, 8, { t: '#D9D2C4', l: '#C9BFA9', r: '#B3A891' }); NK.windows(g, 'L', -18, -30.5, -20.5, 1.2, 3.4, 2, 4, { style: 'glass' }); });

  /* ---------------- Worth Square: the obelisk on the plaza in front of the prow ---------------- */
  T.obj([21, 19], function (g) {
    K.box(g, 19.6, 17.6, 22.4, 20.4, 0, 1.2, '#BDB6A6', { w: 0.6 });
    const b = g.p(21, 19, 1.2), t = g.p(21, 19, 13.5);
    g.fill2([[b[0] - 1.9, b[1]], [b[0] + 1.9, b[1]], [t[0] + 0.7, t[1] + 1.5], [t[0] - 0.7, t[1] + 1.5]], '#D9D2C2');
    g.fill2([[b[0] + 0.1, b[1]], [b[0] + 1.9, b[1]], [t[0] + 0.7, t[1] + 1.5], [t[0] + 0.05, t[1] + 1.5]], '#BDB5A3');
    g.fill2([[t[0] - 0.7, t[1] + 1.5], [t[0] + 0.7, t[1] + 1.5], [t[0], t[1] - 1]], '#C9C1AE');
    g.outline2([[b[0] - 1.9, b[1]], [t[0] - 0.7, t[1] + 1.5], [t[0], t[1] - 1], [t[0] + 0.7, t[1] + 1.5], [b[0] + 1.9, b[1]]], { w: 0.7 });
    const fs = []; for (let k = 0; k <= 16; k++) { const a = TAU * k / 16, p0 = g.p(21 + Math.cos(a) * 3.2, 19 + Math.sin(a) * 3.2, 0), p1 = g.p(21 + Math.cos(a) * 3.2, 19 + Math.sin(a) * 3.2, 1.1); fs.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(fs, '#3E4A3E', 0.3);
  }, { name: 'worth obelisk' });
  for (const [x, y] of [[13, 24], [25, 10], [26, 27]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.4, h: 5.4, col: '#8DB868' }));
  T.obj([24, 4, 31, 14], (g) => { NK.castIron(g, 24, 4, 31, 14, 2, { col: '#CFC6B4', arch: true }); NK.shop(g, 'L', 14, 24.4, 30.6, { h: 4.4, col: '#3A3530', word: 'CAFE', signCol: '#E9E1CC', ink: '#3A3128', awning: '#2F4A3A' }); }, { name: 'loft' });

  /* ---------------- the park ---------------- */
  for (const [x, y, r] of [[-26, 7, 4.6], [-27, 15, 4.4], [-9, 13.5, 4.2], [-2, 24, 4.2], [-15, 20, 4.6], [-12, 29, 3.8], [-30, 30, 3.6]]) T.obj([x, y], (g) => K.tree(g, x, y, { r, h: 6.2, col: (x * 7 + y) % 3 ? '#8DB868' : '#7DAE5E' }));
  // the low iron fence along the park's Broadway side
  T.obj([-31, 2.4, 2.5, 16], (g) => { const a = [-31, 2.4], b = [2.5, 16], fs = []; for (let k = 0; k <= 30; k++) { const t = k / 30, p0 = g.p(lerp(a[0], b[0], t), lerp(a[1], b[1], t), 0), p1 = g.p(lerp(a[0], b[0], t), lerp(a[1], b[1], t), 1.2); fs.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(fs, '#3E4A3E', 0.3); g.fine([[a[0], a[1], 1.2], [b[0], b[1], 1.2]], { w: 0.4, c: '#3E4A3E' }); }, { name: 'fence' });
  // the dog run fence
  T.obj([-29, 21, -21, 29], (g) => { const fs = []; for (const [a, b] of [[[-29, 21], [-21, 21]], [[-21, 21], [-21, 29]], [[-29, 21], [-29, 29]], [[-29, 29], [-21, 29]]]) { for (let k = 0; k <= 8; k++) { const t = k / 8, p0 = g.p(lerp(a[0], b[0], t), lerp(a[1], b[1], t), 0), p1 = g.p(lerp(a[0], b[0], t), lerp(a[1], b[1], t), 1.8); fs.push(p0[0], p0[1], p1[0], p1[1]); } } g.segs2(fs, '#5E5A52', 0.28); }, { name: 'dog run' });
  // the burger kiosk: a small pavilion with a green roof and a big menu board
  T.obj([-9, 22, -4, 27], function (g) {
    K.box(g, -9, 22, -4, 27, 0, 3.4, { t: '#B9B4AA', l: '#8E9A8A', r: '#77836F' }, { w: 0.8 });
    K.win(g, 'L', 27, -8.5, -4.5, 1.2, 3.0, { style: 'glass' }); K.win(g, 'R', -4, 22.5, 26.5, 1.2, 3.0, { style: 'glass' });
    K.box(g, -9.8, 21.2, -3.2, 27.8, 3.4, 4.0, '#6F8C5E', { w: 0.7 });
    K.box(g, -8.6, 22.4, -4.4, 26.6, 4.0, 5.4, { t: '#D9D3C6', l: '#E9E1CC', r: '#CFC6B4' }, { w: 0.6 });
    NK.text(g, 'L', 26.6, -6.5, 4.3, 0.85, 'BURGERS', '#3E6B4F', { center: true, w: 0.35 });
  }, { name: 'kiosk' });
  // a statue on a plinth
  T.obj([-29.5, 11.5], (g) => { K.box(g, -30.5, 10.5, -28.5, 12.5, 0, 2.6, K.STONE, { w: 0.6 }); const p = g.p(-29.5, 11.5, 2.6); g.fill2([[p[0] - 1, p[1]], [p[0] + 1, p[1]], [p[0] + 0.7, p[1] - 6], [p[0] - 0.7, p[1] - 6]], '#5C7F72', true); g.disc2([p[0], p[1] - 6.9], 0.9, '#5C7F72'); });
  // street furniture
  for (const [x, y] of [[33.5, -24], [33.5, -12], [33.5, 2], [-24, 33.5], [-12, 33.5], [8, 33.5]]) T.obj([x, y], (g) => NK.tree(g, x, y, { r: 3.2 }));
  T.obj([33.6, 24], (g) => NK.hydrant(g, 33.6, 24));
  T.obj([12, 33.4], (g) => NK.basket(g, 12, 33.4));
  T.obj([-33.4, -26], (g) => NK.newsbox(g, -33.4, -26, '#2F6DB5'));
  // green planters and granite blocks on the plazas
  for (const t of [6, 16, 26, 36]) { const p = along(uR, nR, t, 8.6); T.obj([p[0], p[1]], (g) => { K.box(g, p[0] - 0.9, p[1] - 0.9, p[0] + 0.9, p[1] + 0.9, 0, 1.4, '#7E8A86', { w: 0.5, boil: false }); K.bush(g, p[0], p[1], { z: 1.4, r: 1.3, col: '#7FAE62' }); }); }
  for (const t of [3, 13, 23, 33]) { const p = along(uL, nL, t, 1.6); T.obj([p[0], p[1]], (g) => K.box(g, p[0] - 0.5, p[1] - 0.5, p[0] + 0.5, p[1] + 0.5, 0, 1.0, '#BDB6A6', { w: 0.45, boil: false })); }
  T.obj([28.5, 18], (g) => NK.citibikes(g, 28.5, 18, 'y', 6), { name: 'citibikes' });
  // a cab at the Broadway kerb, its passenger getting out
  const cabP = along(uL, nL, 30, 5.1);
  T.obj([cabP[0], cabP[1]], (g) => g.at(cabP[0], cabP[1], 0, (g2) => NK.cab(g2, Math.atan2(-uL[1], -uL[0]))), { name: 'cab' });
  const trP = along(uR, nR, 12, 6.2);
  T.obj([trP[0], trP[1]], (g) => NK.cart(g, trP[0], trP[1], { along: 'y', umb: ['#C9463E', '#F3F1EA'] }), { name: 'cart' });

  /* ---------------- the living layer ---------------- */
  // the burger queue, snaking from the kiosk window along the path
  T.cast([-7, 30], (g) => { for (let i = 0; i < 9; i++) { const x = -8 + i * 1.5, y = 28.6 + (i > 4 ? (i - 4) * 0.4 : 0); NK.person(g, x - (i > 5 ? (i - 5) * 0.3 : 0), y, 0, NK.who(1100 + i, { dir: 2, pose: i % 3 === 1 ? 'hold' : 'stand', phone: i % 3 === 1 })); } }, { on: true });
  // eating burgers on benches along the path
  for (const [x, y, s] of [[-24, 9.5, 1110], [-9, 18.5, 1112]]) T.cast([x, y], (g) => { K.bench(g, x, y, { face: 'L', L: 2.4 }); NK.person(g, x + 0.9, y - 1.2, 1.3, NK.who(s, { dir: 1, pose: 'sit', reach: [1.5, -6] })); NK.person(g, x + 0.9, y + 1.2, 1.3, NK.who(s + 1, { dir: 1, pose: 'sit' })); }, { on: true });
  // a picnic on the lawn
  T.cast([-18, 15], (g) => { const q = K.rect(-20, 14, -16, 17, 0.02); g.fill(q, '#D96B5C'); for (let k = -19.5; k < -16; k += 1) g.fine([[k, 14, 0.03], [k, 17, 0.03]], { w: 0.3, c: '#F3F1EA' }); NK.person(g, -19, 15.5, 0, NK.who(1120, { pose: 'sit', dir: 0 })); NK.person(g, -17, 16.2, 0, NK.who(1121, { lie: -2.6 })); }, { on: true });
  // the tourist on the plaza photographing the whole wedge, a friend posing at the prow
  T.cast([15, 15.5], (g) => { NK.person(g, 15, 15.5, 0, NK.tourist(1130, { dir: 3, pose: 'hold', phone: true })); NK.person(g, 13.4, 5.6, 0, NK.who(1131, { dir: 1, pose: 'wave', ph: 0.25 })); }, { on: true });
  // green tables and umbrellas on Worth Square
  for (const [x, y, sd] of [[16, 22, 1190], [18, 27.5, 1193], [27, 23, 1196]]) T.cast([x, y], (g) => {
    NK.person(g, x - 1.4, y, 1.3, NK.who(sd, { dir: 0, pose: 'sit', coffee: sd % 2 === 0 }));
    K.cyl(g, x, y, 0.9, 2.0, 2.2, '#4E7B5F', { w: 0.35, n: 10 }); const st = g.p(x, y, 2.0), sb = g.p(x, y, 0); g.segs2([st[0], st[1], sb[0], sb[1]], '#3E6B4F', 0.4);
    NK.person(g, x + 1.4, y, 1.3, NK.who(sd + 1, { dir: 2, pose: 'sit' }));
    const pt = g.p(x, y, 7.4); g.segs2([st[0], st[1], pt[0], pt[1]], '#5E5A52', 0.35);
    for (let i = 0; i < 8; i++) { const a0 = TAU * i / 8, a1 = TAU * (i + 1) / 8; g.fill2([pt, g.p(x + Math.cos(a0) * 3, y + Math.sin(a0) * 3, 6.6), g.p(x + Math.cos(a1) * 3, y + Math.sin(a1) * 3, 6.6)], i % 2 ? '#3E6B4F' : '#4E7B5F'); }
  }, { on: true });
  // chess at a plaza table
  { const p = along(uR, nR, 20, 5.6); T.cast([p[0], p[1]], (g) => { K.cyl(g, p[0], p[1], 1.0, 2.0, 2.2, '#4E7B5F', { w: 0.4, n: 10 }); const c = g.p(p[0], p[1], 2.2); g.fill2([[c[0] - 1.6, c[1]], [c[0], c[1] - 0.9], [c[0] + 1.6, c[1]], [c[0], c[1] + 0.9]], '#E9E1CC', true); NK.person(g, p[0] - 1.6, p[1], 1.3, NK.who(1140, { dir: 0, pose: 'sit', reach: [2, -5] })); NK.person(g, p[0] + 1.6, p[1], 1.3, NK.who(1141, { dir: 2, pose: 'sit', beard: true })); }, { on: true }); }
  // the cab's passenger with a suitcase
  { const p = along(uL, nL, 30, 1.5); T.cast([p[0], p[1]], (g) => { const r = NK.person(g, p[0], p[1], 0, NK.suit(1150, { dir: 2, pose: 'hold' })); const h = r.hands[0]; g.fill2([[h[0] - 1.4, h[1]], [h[0] + 1.4, h[1]], [h[0] + 1.4, h[1] + 3.6], [h[0] - 1.4, h[1] + 3.6]], '#2F3440', true); }, { on: true }); }
  // dogs chasing a ball round the run, their owners watching
  T.cast([-22, 30], (g) => { NK.person(g, -22.5, 28, 0, NK.who(1160, { dir: 2 })); NK.person(g, -27.5, 22, 0, NK.who(1161, { dir: 0, pose: 'hold', coffee: true })); }, { on: true });
  for (let k = 0; k < 2; k++) T.actor({ sample: 0.2, period: 6,
    at(t) { const a = t * (1.1 + k * 0.3) + k * 2.5, x = -25 + Math.cos(a) * 2.6, y = 25 + Math.sin(a) * 2.6, ph = Math.floor((t * 3) % 1 * 4); return { x, y, key: (Math.sin(a) > 0 ? 'l' : 'r') + ph, fl: Math.sin(a) > 0 ? -1 : 1, ph: ph / 4 }; },
    draw(g, st) { NK.dog2(g, g.p(0, 0, 0), st.fl, k ? '#3A3128' : '#C99A5A', st.ph); } });
  // Citi Bike riders down Broadway into the plaza, then out along the plaza side
  for (let k = 0; k < 3; k++) {
    const who = NK.who(1170 + k), pts = [along(uL, nL, 47, 9.8), along(uL, nL, -2, 9.8), along(uR, nR, -3, 4.8), along(uR, nR, 45, 4.8)];
    const segL = []; let tot = 0; for (let i = 0; i < 3; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segL.push(l); tot += l; }
    T.actor({ sample: 0.25, period: 30,
      at(t) {
        let d = ((t * 9 + k * tot / 3) % (tot + 30)); if (d > tot) return null;
        let i = 0; while (i < 2 && d > segL[i]) { d -= segL[i]; i++; }
        const a = pts[i], b = pts[i + 1], f = d / segL[i], x = lerp(a[0], b[0], f), y = lerp(a[1], b[1], f), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
        const dd = (i === 0 ? d : i === 1 ? segL[0] + d : segL[0] + segL[1] + d), al = Math.min(1, dd / 5, (tot - dd) / 5);
        return { x, y, key: 'b' + Math.round(ang * 16 / Math.PI), ang: Math.round(ang * 16 / Math.PI) * Math.PI / 16, alpha: al < 1 ? Math.max(al, 0.01) : null };
      },
      draw(g, st) { K.bike(g, st.ang, { col: '#2F6DB5', who }); } });
  }
  // walkers: round the park path, along the plaza, along the edges
  NK.walker(T, NK.who(1180), [[-27, 6], [-14, 9], [-3, 17], [-6, 27], [-20, 28], [-28, 20]], 4.2, { phase: 0.1 });
  NK.walker(T, NK.who(1181, { tote: '#C9A26B' }), [[-28, 20], [-20, 28], [-6, 27], [-3, 17], [-14, 9], [-27, 6]], 4.6, { phase: 0.6 });
  NK.walker(T, NK.suit(1182), [along(uR, nR, -2, 3.6), along(uR, nR, 44, 3.6)], 5.4, { phase: 0.2 });
  NK.walker(T, NK.tourist(1183), [along(uR, nR, 44, 7.6), along(uR, nR, -2, 7.6)], 4.4, { phase: 0.4 });
  NK.walker(T, NK.who(1184, { phone: true }), [[33.6, -30], [33.6, 30]], 4.8, { phase: 0.3 });
  NK.walker(T, NK.who(1187), [[9, 30], [18, 14], [22, 3.6], [18, 14]], 4.3, { phase: 0.2 });
  NK.walker(T, NK.who(1185), [[30, 33.8], [-30, 33.8]], 5.0, { phase: 0.7 });
  NK.walker(T, NK.who(1186), [[-33.6, 30], [-33.6, -30]], 4.6, { phase: 0.5 });
  NK.corners(T);
});
