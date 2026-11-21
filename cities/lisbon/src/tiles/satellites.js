'use strict';
/* Three satellites on paint blobs off the grid:
   upper right  Sintra (north of the map): the Pena Palace on its crag above the forest, yellow and red towers, a Moorish dome, the mist;
   lower left   Almada across the river: Cristo Rei on his tall pedestal, arms open over the city, where the 25 de Abril
                bridge comes down; the Cacilhas ferry pier;
   right        the Oceanário on the water at Parque das Nações, its glass crown, the cable car along the shore. */
(function () {
  const blob = (g, pts, col, seed) => K.blob2(g, g.P(pts.map((p) => [p[0], p[1], p[2] || 0])), col, { seed, rag: 0.8 });

  /* ---------------- Sintra ---------------- */
  SF.tile('sintra', 10, -222, { rim: 90, castAt: 160, order: -3, half: 30 }, function (T) {
    T.ground(function (g) { blob(g, [[-30, -10], [-22, -30], [2, -32], [26, -22], [32, 4], [24, 26], [0, 30], [-26, 22]], '#9DB878', 3); blob(g, [[-20, -6], [-10, -20], [12, -18], [20, 2], [10, 18], [-14, 14]], '#86A866', 5); });
    // the crag: a lump of grey granite rising out of the forest
    T.obj([-16, -16, 14, 12], function (g) {
      const c = g.p(-1, -2, 0), pts = []; const R = RNG(12);
      for (let k = 0; k <= 16; k++) { const a = Math.PI + Math.PI * k / 16, r = 46 + R() * 8; pts.push([c[0] + Math.cos(a) * r, c[1] + 10 + Math.sin(a) * r * 0.62]); }
      g.fill2(pts, '#A6A39A'); g.fill2(pts.slice(8).concat([[c[0], c[1] + 10]]), '#8E8B84'); g.line2(pts, { w: 0.9, c: '#5E5A52' });
      const cr = []; for (let i = 0; i < 14; i++) { const x = c[0] + (R() - 0.5) * 70, y = c[1] - R() * 22; cr.push(x, y, x + 3, y + 4); } g.segs2(cr, '#7A766E', 0.45);
      // forest clumps over its foot
      for (let i = 0; i < 16; i++) { const x = c[0] + (R() - 0.5) * 96, y = c[1] + 6 - R() * 10, r = 6 + R() * 5; g.fill2(arcPts(x, y, r, 0, TAU, 10).map((p) => [p[0], y + (p[1] - y) * 0.8]), R() < 0.5 ? '#5F8A45' : '#4E7A3A', true); g.outline2(arcPts(x, y, r, Math.PI, TAU, 6), { w: 0.4, c: '#3A5A2A' }); }
    }, { name: 'crag' });
    // the palace on top: the yellow wing and its dome, the red clock tower, the grey walls with merlons
    T.obj([-10, -14, 8, 2], function (g) {
      const Z = 15;
      K.box(g, -9, -13, 1, -5, Z, Z + 6, { t: '#9C9A92', l: '#B5B2AA', r: '#9C9A92' }, { w: 0.7 });
      K.box(g, -6, -6, 6, 0, Z, Z + 7, { t: '#E9C24F', l: '#F2CC5A', r: '#D9AE40' }, { w: 0.8 });
      for (let x = -5; x < 6; x += 2) K.win(g, 'L', 0, x, x + 0.9, Z + 2, Z + 4.4, { style: 'navy', arch: true });
      K.cyl(g, 3.5, -3, 2.0, Z + 7, Z + 12, { t: '#E9C24F', l: '#F2CC5A', r: '#D9AE40' }, { n: 12, w: 0.7 });
      K.dome(g, 3.5, -3, 2.4, Z + 12, 3.2, '#C9463E', { w: 0.7, band: true });
      K.box(g, -9, -4, -5, 0, Z, Z + 13, { t: '#B84238', l: '#C9463E', r: '#A83A30' }, { w: 0.8 });
      const ck = g.p(-7, 0, Z + 10.5); g.disc2(ck, 1.3, '#F3F1EA'); g.ring2(ck, 1.3, { w: 0.35 });
      K.cone(g, -7, -2, 2.0, Z + 13, 3.0, '#5E7A8E', { w: 0.6 });
      for (let x = -8.6; x < 1; x += 1.4) K.box(g, x, -5.6, x + 0.8, -5, Z + 6, Z + 7, { t: '#9C9A92', l: '#B5B2AA', r: '#9C9A92' }, { w: 0.3, boil: false, nohid: true });
    }, { on: true, name: 'pena' });
    // the mist drifting across the crag
    T.actor({ layer: 'top', sample: 5, period: 30, grow: false, at(t) { const u = ((t / 30) % 1 + 1) % 1; return { x: -20 + u * 40, y: 10, z: 8, key: 'm' + Math.floor(u * 24), alpha: Math.sin(u * Math.PI) * 0.9 + 0.05 }; },
      draw(g) { const o = g.p(0, 0, 0); for (const [dx, dy, r] of [[0, 0, 10], [12, 3, 8], [-10, 4, 7], [5, -4, 7]]) g.fill2(arcPts(o[0] + dx, o[1] + dy - 20, r, 0, TAU, 14).map((p) => [p[0], o[1] + dy - 20 + (p[1] - o[1] - dy + 20) * 0.45]), 'rgba(248,247,242,0.85)', true); } });
    T.cast([10, 18], (g) => { g.at(10, 18, 0, (g2) => LX.tuk(g2, -0.6, { col: '#3E9A6A', roof: { t: '#2E2A26', l: '#3A3530', r: '#2E2A26' }, riders: [LX.who(1400), LX.who(1401)] })); });
  });

  /* ---------------- Almada and Cristo Rei ---------------- */
  SF.tile('almada', -50, 268, { rim: 84, castAt: 156, order: 3.5, half: 30 }, function (T) {
    T.ground(function (g) { blob(g, [[-34, -24], [-8, -34], [24, -30], [36, -6], [30, 20], [4, 30], [-26, 22], [-38, 0]], '#C9B98E', 7); blob(g, [[-22, -14], [4, -20], [22, -12], [20, 10], [-4, 16], [-24, 6]], '#B4C890', 9); });
    // the bridge's abutment where the deck comes down to land
    T.obj([-6, -36, 6, -28], (g) => { K.box(g, -6, -36, 6, -28, 0, 13.6, { t: '#D9D3C6', l: '#E4DED2', r: '#CFC8B9' }, { w: 0.85 }); }, { name: 'abutment' });
    // Cristo Rei: the four-legged portal pedestal, the figure with open arms (seen from behind: he faces the city)
    T.obj([10, -12, 22, 0], function (g) {
      const c = [16, -6], W = { t: '#E9E4D8', l: '#F3F0E8', r: '#DCD6C8' };
      K.box(g, 10, -12, 22, 0, 0, 1.6, W, { w: 0.7 });
      for (const [x, y] of [[11.5, -10.5], [20.5, -10.5], [11.5, -1.5], [20.5, -1.5]]) K.box(g, x - 1, y - 1, x + 1, y + 1, 1.6, 24, W, { w: 0.7 });
      K.box(g, 10.5, -11, 21.5, -1, 24, 28, W, { w: 0.8 });
      const b = g.p(c[0], c[1], 28), P = (u, v) => [b[0] + u, b[1] + v];
      g.fill2([P(-3, 0), P(3, 0), P(2.4, -22), P(-2.4, -22)], '#E2DCCE', true);
      g.fill2([P(-17, -20.5), P(17, -20.5), P(17, -18.4), P(2.6, -17), P(-2.6, -17), P(-17, -18.4)], '#E2DCCE', true);
      g.disc2(P(0, -24.4), 2.4, '#E2DCCE');
      g.line2([P(-3, 0), P(-2.6, -17), P(-17, -18.4), P(-17, -20.5), P(-2.2, -21.6), P(-1.6, -22.4)], { w: 0.6, c: '#9C9484', boil: false });
      g.line2([P(3, 0), P(2.6, -17), P(17, -18.4), P(17, -20.5), P(2.2, -21.6)], { w: 0.6, c: '#9C9484', boil: false });
    }, { name: 'cristo rei' });
    [[-20, -6], [-14, 8], [26, 6]].forEach(([x, y], i) => T.obj([x, y], (g) => LX.pine(g, x, y, { h: 8, r: 4.4, seed: 1410 + i }), { name: 'pine' }));
    [[2, 6, 1], [6, 9, 1], [-2, 2, 3]].forEach(([x, y, d], i) => T.cast([x, y], (g) => LX.person(g, x, y, 0, LX.who(1420 + i, { dir: d, pose: 'hold', phone: i === 1, reach: i === 1 ? [0.4, -12.5] : undefined }))));
  });

  /* ---------------- the Oceanário ---------------- */
  SF.tile('oceanario', 228, 118, { rim: 94, castAt: 160, order: 3.6, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-36, -18], [-12, -32], [20, -30], [36, -8], [30, 22], [2, 32], [-30, 20]], '#A8CDD0', 11);
      const w = K.curve([[-28, -8], [-4, -22], [22, -18], [26, 8], [4, 20], [-22, 12]], 6, true); g.water(w.map((p) => [p[0], p[1], 0]), { dens: 0.8 });
      blob(g, [[-36, -30], [10, -38], [36, -30], [30, -22], [-10, -24], [-34, -20]], '#D9CFB6', 13);
    });
    // the pier to the building and the building on the water: blue-tiled walls under a glass crown with masts
    T.obj([-8, -24, -4, -10], (g) => { K.box(g, -8, -24, -4, -10, 0, 1.0, { t: '#C9C2B2', l: '#B9B2A2', r: '#A39C8E' }, { w: 0.6 }); }, { name: 'pier' });
    T.obj([-10, -10, 10, 8], function (g) {
      K.box(g, -10, -10, 10, 8, -1, 8, { t: '#D9DEE2', l: '#5E86B0', r: '#4E74A0' }, { w: 0.9 });
      const az = []; for (let x = -9; x < 10; x += 1.2) for (let z = 0; z < 7.6; z += 1.2) { const p = g.p(x, 8.02, z); az.push(p[0] - 0.4, p[1], p[0] + 0.4, p[1] - 0.4); } g.segs2(az, '#D9E6F0', 0.45);
      K.box(g, -6, -6, 6, 4, 8, 12, { t: '#CFE4EA', l: '#B9D9E2', r: '#A3C9D4' }, { w: 0.7 });
      const ms = []; for (const [x, y] of [[-6, -6], [6, -6], [-6, 4], [6, 4]]) { const a = g.p(x, y, 12), b = g.p(x, y, 17); ms.push(a[0], a[1], b[0], b[1]); } g.segs2(ms, '#4A4540', 0.5);
      K.sign(g, 'L', 8, -8, 0, 5.2, 6.6, '#F3F1EA', 'OCEANÁRIO', { ink: '#2F4F80' });
    }, { name: 'oceanario' });
    // the cable car: towers along the shore, cabins sliding along the cable
    for (const x of [-30, 0, 30]) T.obj([x, -27], (g) => { const a = g.p(x, -27, 0), b = g.p(x, -27, 14); g.line2([a, b], { w: 0.9, c: '#6E6A64', boil: false }); g.segs2([b[0] - 2, b[1], b[0] + 2, b[1]], '#4A4540', 0.6); }, { name: 'cable tower' });
    T.obj([-34, -27.6, 34, -26.4], (g) => { g.fine([[-34, -27, 13.6], [0, -27, 12.6], [34, -27, 13.6]], { w: 0.35, c: '#4A4540' }); }, { name: 'cable' });
    for (let i = 0; i < 4; i++) T.actor({ sample: 0.3, period: 40, at(t) { const u = (((t / 40) + i / 4) % 1 + 1) % 1, x = lerp(-32, 32, u); return { x, y: -26, z: 0, key: 'g', zc: 12.4 + Math.abs(x) / 34 * 0.8 - 0.6 }; },
      draw(g, st) { const t = g.p(0, -1, st.zc), b = g.p(0, -1, st.zc - 4); g.line2([t, [b[0], b[1] + 1]], { w: 0.4, c: '#4A4540', boil: false }); g.fill2([[b[0] - 1.8, b[1] - 2.6], [b[0] + 1.8, b[1] - 2.6], [b[0] + 1.8, b[1] + 1.4], [b[0] - 1.8, b[1] + 1.4]], ['#E2483D', '#3F8FD2', '#F2C230', '#5DB26A'][i], true); g.fill2([[b[0] - 1.3, b[1] - 1.9], [b[0] + 1.3, b[1] - 1.9], [b[0] + 1.3, b[1] - 0.2], [b[0] - 1.3, b[1] - 0.2]], '#DDE6E8', true); } });
    [[-6, -16, 1], [-6.2, -20, 3]].forEach(([x, y, d], i) => T.cast([x, y], (g) => LX.person(g, x, y, 1.0, LX.who(1430 + i, { dir: d })), { on: true }));
  });
})();
