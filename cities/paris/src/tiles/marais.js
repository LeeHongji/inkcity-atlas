'use strict';
/* (0,100) Le Marais. Place des Vosges fills the far part: its pavilions of red brick with white stone quoins and
   window frames over a vaulted arcade, each under its own steep slate roof with dormers and tall chimneys, close the
   two far sides; the square garden in the middle has its clipped limes, lawns, four fountains and Louis XIII on his
   horse, people on the grass and the benches, a violinist in the arcade. In front runs the rue des Rosiers, a cobbled
   lane: the falafel shop with its famous queue, a Jewish bakery, a little café with a terrace, low old houses with
   shutters; the corner square on the right with plane trees, a Wallace fountain, a florist. Bikes and walkers. */
SF.tile('marais', 0, 100, { rim: 40 }, function (T) {
  const H = 37, GX0 = -24, GY0 = -24, GX1 = 12, GY1 = 12, LY = 26;
  T.ground(function (g) {
    K.slab(g, H, { top: '#E3DCCB', cut: 'y' });
    // the place: gravel round the garden, the garden's lawns and paths
    g.fill(K.rect(-28, -28, 16, 16), '#E8DFC9');
    g.fill(K.rect(GX0, GY0, GX1, GY1), PC.lawn); g.grass(K.rect(GX0, GY0, GX1, GY1), { dens: 1 });
    const mx = (GX0 + GX1) / 2, my = (GY0 + GY1) / 2;
    g.fill(K.rect(mx - 1.6, GY0, mx + 1.6, GY1), PC.gravel); g.fill(K.rect(GX0, my - 1.6, GX1, my + 1.6), PC.gravel);
    g.fill(K.arc(mx, my, 0, 5.2, 0, TAU, 24), PC.gravel);
    g.outline(K.rect(GX0, GY0, GX1, GY1), { w: 0.55, c: '#86A05E', boil: false });
    // the fountain basins in the four quarters
    for (const [qx, qy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const cx = mx + qx * 9, cy = my + qy * 9; g.fill(K.arc(cx, cy, 0, 2.4, 0, TAU, 18), '#D8CEB8'); g.fill(K.arc(cx, cy, -0.2, 1.9, 0, TAU, 18), PC.water); g.line(K.arc(cx, cy, 0, 2.4, 0, TAU, 18), { w: 0.45, boil: false }); }
    // the rue des Rosiers: cobbles between kerbs
    g.fill(K.rect(-H, LY - 3.5, H, LY + 3.5), PC.cobble);
    g.scuff(K.rect(-H, LY - 3.5, H, LY + 3.5), { dir: Math.atan2(AY, AX), len: 1.0, c: '#C4B89E', dens: 1.4, w: 0.45, spread: 1.4 });
    for (const s of [-1, 1]) g.line([[-H, LY + s * 3.5, 0], [H, LY + s * 3.5, 0]], { w: 0.45, c: '#A99A7B', boil: false });
    // the corner square on the right
    g.fill(K.rect(22, -30, 35, 16), '#E9E1CF');
  }, { rim: true });

  /* ---------------- the Place des Vosges pavilions ---------------- */
  const BRICK = { t: '#C98A6E', l: '#BA6A50', r: '#A25A44' }, SLATE = '#5F6670';
  const pav = (x0, y0, x1, y1, i, king) => T.obj([x0, y0, x1, y1], function (g) {
    g.boilP = 0.3;
    const Z = king ? 13 : 11.2;
    K.box(g, x0, y0, x1, y1, 0, Z, BRICK, { w: 0.9 });
    for (const face of ['L', 'R']) {
      const p = face === 'L' ? y1 : x1, A0 = face === 'L' ? x0 : y0, A1 = face === 'L' ? x1 : y1, n = Math.max(1, Math.round((A1 - A0) / 2.6)), bw = (A1 - A0) / n;
      // the arcade: stone arches over a shadowed walk
      for (let k = 0; k < n; k++) { const m = A0 + bw * (k + 0.5), hw = bw * 0.38, ar = [K.pt(face, p + 0.03, m - hw, 0), K.pt(face, p + 0.03, m + hw, 0)]; for (let j = 0; j <= 6; j++) { const t = Math.PI * j / 6; ar.push(K.pt(face, p + 0.03, m + Math.cos(t) * hw, 2.8 + Math.sin(t) * hw)); } g.fill(ar, '#7A5E4E'); g.line(ar.slice(2), { w: 0.4, c: '#F1E8D6', boil: false }); }
      g.fill(K.on(face, p + 0.02, A0, A1, 0, 0.4), '#E9E0CB');
      g.line([K.pt(face, p + 0.03, A0, 4.4), K.pt(face, p + 0.03, A1, 4.4)], { w: 0.45, c: '#F1E8D6', boil: false });
      // two floors of tall windows in white stone frames; stone quoins at the corners
      for (const [z0, z1] of [[5.0, 7.8], [8.4, 10.6]]) for (let k = 0; k < n; k++) { const m = A0 + bw * (k + 0.5); PA.win(g, face, p, m - 0.5, m + 0.5, z0, z1, { sc: '#F4EDDC', pane: '#5E6B76' }); }
      const q = []; for (let z = 0.5; z < Z - 0.3; z += 1.1) { const a = g.p.apply(g, K.pt(face, p + 0.03, A1 - 0.8, z)), b = g.p.apply(g, K.pt(face, p + 0.03, A1, z)); q.push(a[0], a[1], b[0], b[1]); } g.segs2(q, '#F1E8D6', 1.1);
    }
    // the steep slate roof, a hip with dormers, two tall brick chimneys
    K.hip(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, Z, king ? 7.5 : 6.0, SLATE, { ridge: Math.max(0, Math.abs((x1 - x0) - (y1 - y0)) * 0.95), c: '#3A4048' });
    const sl = []; for (let a = x0; a < x1; a += 0.7) { const p0 = g.p(a, y1 + 0.3, Z), p1 = g.p(lerp(a, (x0 + x1) / 2, 0.3), lerp(y1, (y0 + y1) / 2, 0.45), Z + 2.6); sl.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(sl, '#4E555E', 0.25);
    for (const face of ['L', 'R']) { const p = face === 'L' ? y1 - 0.8 : x1 - 0.8, A0 = face === 'L' ? x0 : y0, A1 = face === 'L' ? x1 : y1, m = (A0 + A1) / 2; for (const d of [-2.2, 2.2]) { const fr = K.on(face, p, m + d - 0.55, m + d + 0.55, Z + 0.6, Z + 2.2); g.fill(fr, '#F1E8D6'); g.fill(K.on(face, p + 0.02, m + d - 0.35, m + d + 0.35, Z + 0.8, Z + 1.9), '#5E6B76'); } }
    for (const [cx, cy] of [[x0 + 1.2, (y0 + y1) / 2], [(x0 + x1) / 2, y0 + 1.2]]) K.box(g, cx - 0.3, cy - 0.55, cx + 0.3, cy + 0.55, Z + 2, Z + (king ? 4.8 : 4.2), BRICK, { w: 0.45, boil: false, nohid: true });
  }, { name: 'pavilion ' + i });
  // the far side along x (y -36..-28) and the left side along y (x -36..-28); the King's pavilion in the middle of one
  const RX = [-36, -26, -16, -6, 4, 14, 22], RY = [-26, -16, -6, 4, 14, 22];
  pav(-36, -36, -27, -27, 0, false);
  for (let i = 0; i + 1 < RX.length; i++) if (RX[i] >= -26) pav(RX[i], -36, RX[i + 1], -28, 10 + i, i === 3);
  for (let i = 0; i + 1 < RY.length; i++) pav(-36, RY[i], -28, RY[i + 1], 20 + i, i === 2);
  // the garden's railings, the clipped limes, Louis XIII
  const mx = (GX0 + GX1) / 2, my = (GY0 + GY1) / 2;
  for (const [ax, c, a0, a1] of [['x', GY1, GX0, GX1], ['y', GX1, GY0, GY1]]) T.obj(ax === 'x' ? [a0, c - 0.2, a1, c + 0.2] : [c - 0.2, a0, c + 0.2, a1], function (g) {
    const r = []; for (let a = a0; a <= a1; a += 0.45) { if (Math.abs(a - (ax === 'x' ? mx : my)) < 1.7) continue; const p = ax === 'x' ? g.p(a, c, 0) : g.p(c, a, 0), q = [p[0], p[1] - 1.5 * VZ]; r.push(p[0], p[1], q[0], q[1]); }
    g.segs2(r, '#2E3332', 0.3); g.line(ax === 'x' ? [[a0, c, 1.5], [mx - 1.7, c, 1.5]] : [[c, a0, 1.5], [c, my - 1.7, 1.5]], { w: 0.45, c: '#2E3332', boil: false }); g.line(ax === 'x' ? [[mx + 1.7, c, 1.5], [a1, c, 1.5]] : [[c, my + 1.7, 1.5], [c, a1, 1.5]], { w: 0.45, c: '#2E3332', boil: false });
  }, { name: 'railing' });
  for (const s of [-1, 1]) for (let a = GX0 + 2; a < GX1 - 1; a += 4.5) { if (Math.abs(a - mx) < 3) continue; T.obj([a, my + s * 15.5], (g) => PA.clipped(g, a, my + s * 15.5, { s: 1.3, h: 3.0, hh: 3.2, col: '#8DAA5C', turn: true }), { name: 'lime' }); T.obj([mx + s * 15.5, a], (g) => PA.clipped(g, mx + s * 15.5, a, { s: 1.3, h: 3.0, hh: 3.2, col: '#8DAA5C', turn: true }), { name: 'lime' }); }
  T.obj([mx - 1.6, my - 1.2, mx + 1.6, my + 1.2], function (g) {
    K.box(g, mx - 1.6, my - 1.2, mx + 1.6, my + 1.2, 0, 3.0, { t: '#F1E8D6', l: '#ECE2CC', r: '#D7CAAD' }, { w: 0.6 });
    const c = g.p(mx, my, 3.0), W2 = '#E9E4D8';
    g.fill2([[c[0] - 5, c[1] - 2], [c[0] + 4, c[1] - 3], [c[0] + 5.6, c[1] - 7], [c[0] + 3, c[1] - 7.6], [c[0] - 4, c[1] - 6.6]], W2, true);
    g.fill2([[c[0] + 4.4, c[1] - 6.6], [c[0] + 6.6, c[1] - 10.6], [c[0] + 5.2, c[1] - 11.2], [c[0] + 3.6, c[1] - 7.4]], W2, true);
    for (const dx of [-4, -2.4, 2.6, 4.2]) g.segs2([c[0] + dx, c[1] - 2.4, c[0] + dx - 0.2, c[1]], '#B8B0A0', 0.9);
    g.fill2([[c[0] - 0.8, c[1] - 7], [c[0] + 1, c[1] - 7], [c[0] + 0.8, c[1] - 11.6], [c[0] - 0.6, c[1] - 11.6]], W2, true); g.disc2([c[0], c[1] - 12.6], 1.1, W2);
    g.line2([[c[0] - 5, c[1] - 2], [c[0] - 4, c[1] - 6.6], [c[0] + 3, c[1] - 7.6], [c[0] + 5.6, c[1] - 7]], { w: 0.4, c: '#9A9384', boil: false });
  }, { name: 'louis xiii' });

  /* ---------------- the rue des Rosiers ---------------- */
  // low old houses on the far side of the lane (y 17..22): pale plaster, shutters, shopfronts at street level
  const SHOP = [[-H, -26, '#E9DCC0', 'L', '#2F5D4B', 'falafel'], [-26, -15, '#F1E8D6', 'L', '#7E2A24', 'bakery'], [-15, -3, '#E3D3B8', 'L', '#2F3A4F', 'shop'], [-3, 9, '#EFE1C9', 'L', '#7E2A24', 'cafe'], [9, 20, '#E6D8BE', 'L', '#3F5F8F', 'shop']];
  SHOP.forEach(([x0, x1, col, f, sc, kind], i) => T.obj([x0, 16.5, x1, 22.5], function (g) {
    g.boilP = 0.3;
    const Z = 10.5 + (i % 2) * 1.2;
    K.box(g, x0, 16.5, x1, 22.5, 0, Z, { t: shade(col, -0.15), l: col, r: shade(col, 0.1) }, { w: 0.85 });
    PA.shop(g, 'L', 22.5, x0 + 0.6, x1 - 0.6, 4.6, sc, kind === 'cafe' ? 'cafe' : 'shop', 700 + i);
    const n = Math.max(1, Math.round((x1 - x0) / 2.8)); for (let k = 0; k < n; k++) { const m = x0 + (x1 - x0) * (k + 0.5) / n; for (const z0 of [5.4, 8.2]) { PA.win(g, 'L', 22.5, m - 0.5, m + 0.5, z0, z0 + 2.0, { pane: '#5E6B76', rail: true }); for (const s of [-1, 1]) g.fill(K.on('L', 22.53, m + s * 0.55, m + s * 1.05, z0, z0 + 2.0), ['#4F7A5E', '#5E7E9A', '#8A5A3A'][i % 3]); } }
    PA.mansard(g, x0, 16.5, x1, 22.5, Z, { h: 2.4, d: 1.0, h2: 0.4, dormers: 3.2, chim: [[x0 + 0.6, 19.5, 'y', 2]] });
    if (kind === 'falafel') { const q = K.on('L', 22.6, x0 + 1.5, x1 - 1.5, 4.7, 5.6); g.fill(q, '#E6C24F'); const c = g.p((x0 + x1) / 2, 22.62, 5.15); PA.letters2(g, c, 18, 1.4, '#2F5D4B', "L'AS DU FALLAFEL", 0.35, PA.dirOf('L')); }
  }, { name: 'rosiers ' + kind }));
  // the café terrace on the lane and its waiter; the falafel queue; the bakery's customer with a baguette
  PA.waiter(T, PA.terrace(T, 'L', 22.5, -2.6, 8.6, { seed: 41, z: 4.9, out: 2.2, sp: 2.4 }), 7, {});
  T.cast([-31, 24.6], function (g) { const sp = []; for (let i = 0; i < 8; i++) sp.push([-34.6 + i * 1.5, 24.2 + (i % 2) * 0.7]); sp.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])); sp.forEach(([x, y], i) => PA.person(g, x, y, 0, PA.who(1100 + i, { dir: 2, pose: i % 3 === 0 ? 'hold' : 'stand' }))); }, { name: 'falafel queue' });
  T.cast([-20, 24.8], (g) => { PA.person(g, -20, 24.6, 0, PA.who(1110, { dir: 1, baguette: true })); }, { on: true });
  // the corner square: plane trees, a Wallace fountain, the florist
  for (const [x, y] of [[25, -26], [32, -26], [25, -14], [32, -14], [25, -2], [32, -2], [28.5, 9]]) T.obj([x, y], (g) => PA.plane(g, x, y, { r: 3.3, h: 6.0, turn: 0.4 + h1(x * 3 + y) * 0.5 }), { name: 'square tree' });
  T.obj([28.5, -8], (g) => PA.wallace(g, 28.5, -8), { name: 'wallace' });
  T.obj([29, 13.4], (g) => K.stall(g, 29, 13.4, { face: 'L', L: 2.6, D: 1.2, a: '#7A5BA0', b: '#F3F1EA', goods: (g2, D, L) => K.blooms(g2, -D, -L, D, L, 2.7, ['#C9463E', '#E6C24F', '#E9806A', '#D98AA4', '#F3F1EA', '#8FBF73'], { sp: 0.8, r: 0.9 }) }), { name: 'florist' });
  T.cast([25.5, 11.5], (g) => PA.person(g, 25.5, 11.5, 0, PA.who(1115, { dir: 0, pose: 'hold' })), { on: true });
  T.cast([31, -20], (g) => { K.bench(g, 31, -20, { face: 'R', L: 2.6 }); PA.person(g, 31.6, -21, 1.3, PA.who(1116, { dir: 0, pose: 'sit' })); PA.person(g, 31.6, -18.8, 1.3, PA.who(1117, { dir: 0, pose: 'sit', dress: '#7A5BA0' })); }, { on: true });
  // the garden's people: a picnic on the grass, readers on benches, children running, a violinist in the arcade
  T.cast([-15, 5], function (g) { const q = [[-18, 3, 0.05], [-13, 3, 0.05], [-13, 7, 0.05], [-18, 7, 0.05]]; g.fill(q, '#E6C24F'); g.outline(q, { w: 0.4, c: '#8A6A1E', boil: false }); PA.person(g, -17, 2.6, 0, PA.who(1120, { dir: 1, pose: 'sit' })); PA.person(g, -12.6, 4.6, 0, PA.who(1121, { dir: 2, pose: 'sit' })); PA.person(g, -16, 7.6, 0, PA.who(1122, { dir: 3, pose: 'sit' })); }, { on: true });
  T.cast([2, -14], (g) => { PA.person(g, 2, -14, 0.05, PA.who(1123, { dir: 0, lie: -2.4 })); PA.person(g, 4.4, -12.6, 0, PA.who(1124, { dir: 2, pose: 'sit', book: true })); }, { on: true });
  T.cast([-26.2, 0], (g) => { const r = PA.person(g, -26.2, 0, 0, PA.who(1125, { dir: 0, pose: 'stand', hands: [[1.6, -15.8], [3.6, -13.8]] })); const h = r.hands[1]; g.fill2([[h[0] - 1.6, h[1] + 1.6], [h[0] + 1.2, h[1] - 1.8], [h[0] + 2.0, h[1] - 1.0], [h[0] - 0.8, h[1] + 2.4]], '#8A4A2A', true); g.line2([[h[0] - 2.4, h[1] - 2.2], [h[0] + 3.4, h[1] + 1.6]], { w: 0.35, c: '#3A3530', boil: false }); }, { on: true });
  [[-22.5, -10, 1126], [-22.5, 8, 1127]].forEach(([x, y, s]) => T.cast([x, y], (g) => PA.person(g, x, y, 0, PA.who(s, { dir: 0 })), { on: true }));
  PA.walker(T, PA.who(1130, { k: 0.72 }), [[-20, -6], [6, -6], [6, 4], [-20, 4]], 2.2, { phase: 0.1 });
  PA.walker(T, PA.who(1131, { k: 0.75 }), [[6, 4], [-20, 4], [-20, -6], [6, -6]], 2.0, { phase: 0.3 });
  PA.walker(T, PA.who(1132), [[-27, -27], [-27, 14], [14, 14], [14, -27]], 1.3, { phase: 0.0 });
  PA.walker(T, PA.who(1133), [[14, 14], [14, -27], [-27, -27], [-27, 14]], 1.4, { phase: 0.5 });
  PA.walker(T, PA.who(1134), [[-36, 29.4], [36, 29.4]], 1.4, { phase: 0.2 });
  PA.walker(T, PA.who(1135), [[36, 24.6], [11, 24.6]], 1.3, { phase: 0.6 });
  // the pavement beyond the lane: a Vélib' dock, bollards, people waiting, a lamp
  T.obj([-15, 32.2, -5, 33.8], (g) => PA.velibDock(g, -10, 33, 6, 'x'), { name: 'velib dock' });
  T.obj([-30, 33], (g) => PA.lamp(g, -30, 33, {}), { name: 'lamp' }); T.obj([12, 33], (g) => PA.lamp(g, 12, 33, {}), { name: 'lamp' });
  T.cast([2, 33.5], (g) => { PA.person(g, 2, 33.5, 0, PA.who(1150, { dir: 3, pose: 'hold', phone: true })); PA.person(g, 3.6, 34.4, 0, PA.who(1151, { dir: 2 })); }, { on: true });
  T.cast([24, 33], (g) => { PA.person(g, 24, 33, 0, PA.who(1152, { dir: 1, pose: 'wave', ph: 0.2 })); PA.person(g, 25.4, 33.8, 0, PA.who(1153, { dir: 0, k: 0.74 })); }, { on: true });
  PA.walker(T, PA.who(1154), [[36, 35.4], [-36, 35.4]], 1.2, { phase: 0.45 });
  PA.streetSide(T, { furn: [[-16.5, 41.6, 'wallace'], [27.5, 41.6, 'metro', 'x']] });
});
