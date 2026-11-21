'use strict';
/* The islands of the lagoon, off the grid on their own patches of water:
   upper left   Murano (north): the glass island. A furnace with its tall chimneys and the glow of the open mouth
                where a glassblower turns a gather of molten glass on his pipe; glass shops on the fondamenta; the
                white lighthouse at the island's tip; a vaporetto calling.
   upper right  Burano (north-east): rows of fishermen's houses painted every colour along a little canal, the
                leaning bell tower, women making lace on chairs outside their doors, washing, small boats.
   lower right  San Giorgio Maggiore (south, across the Bacino from San Marco): Palladio's white temple front, the
                dome, the tall brick campanile with its green spire, the little harbour with sailing boats. */
(function () {
  const WL = VN.WL;
  const water = (g, pts, seed) => { const P = g.P(pts.map((p) => [p[0], p[1], WL])); K.blob2(g, P, VN.lagoon, { seed, rag: 1.0 }); g.water(pts.map((p) => [p[0] * 0.8, p[1] * 0.8, WL]), { dens: 0.5 }); };
  const land = (g, pts, col) => { const P = pts.map((p) => [p[0], p[1], 0]); g.fill(pts.map((p) => [p[0], p[1], WL]), '#B59479'); g.fill(P, col); g.outline(P, { w: 0.8, boil: false }); };
  const H = (T, d) => T.obj([d.x0, d.y0, d.x1, d.y1], (g) => VN.house(g, d), { name: 'house' });

  /* ---------------- Murano ---------------- */
  SF.tile('murano', -222, -30, { rim: 70, castAt: 150, order: -3.5, half: 34 }, function (T) {
    T.ground(function (g) {
      water(g, [[-36, -10], [-26, -32], [0, -38], [26, -30], [36, -6], [32, 22], [8, 34], [-22, 30], [-36, 12]], 31);
      land(g, [[-24, -18], [-12, -26], [14, -24], [24, -10], [22, 14], [6, 22], [-16, 20], [-26, 6]], VN.paveC);
      VN.pave(g, -18, -18, 18, 14, { col: '#D2CDC2', scuff: false });
    });
    // the furnace: a brick hall with two tall chimneys, the open mouth glowing
    T.obj([-16, -18, 4, -6], function (g) {
      g.boilP = 0.25;
      K.box(g, -16, -18, 4, -6, 0, 8, { t: '#B9715A', l: '#C47A5E', r: '#A9634B' }, { w: 0.85 });
      K.gable(g, -16.4, -18.4, 4.4, -5.6, 8, 3, 'x', { a: VN.roof, b: shade(VN.roof, 0.12), e: '#C47A5E' }, { c: '#7A3A28' });
      for (const x of [-12, -2]) { K.box(g, x - 0.9, -14.9, x + 0.9, -13.1, 9, 20, { t: '#A9634B', l: '#B9715A', r: '#9A5640' }, { w: 0.6 }); }
      g.fill(VN.archPts('L', -5.98, -10, -4, 0, 4.6, 'round', 0), '#4A2A1E'); g.fill(VN.archPts('L', -5.97, -8.6, -5.4, 0.6, 3.2, 'round', 0), '#F2A03C'); g.fill(VN.archPts('L', -5.96, -7.8, -6.2, 1.0, 2.4, 'round', 0), '#F8E07A');
      K.sign(g, 'L', -5.97, -14.6, -10.6, 5.2, 6.4, '#2F3A55', 'VETRERIA', { ink: '#E9D9A0' });
      K.sign(g, 'R', 4.02, -16, -8, 5.2, 6.4, '#2F3A55', 'MURANO', { ink: '#E9D9A0' });
    }, { name: 'fornace' });
    // smoke from the chimneys
    T.actor({ sample: 5, period: 3, grow: false, layer: 'top',
      at(t) { const f = Math.floor(t * 3) % 6; return { x: -7, y: -14, z: 20, key: f, f }; },
      draw(g, st) { for (const dx of [-5, 5]) { const p = g.p(dx, 0, 0); for (let k = 0; k < 3; k++) { const u = ((st.f / 6) + k / 3) % 1; g.disc2([p[0] + u * 6, p[1] - u * 10], 1.4 + u * 2.6, 'rgba(206,202,196,' + (0.75 - u * 0.65).toFixed(2) + ')'); } } } });
    // the glassblower at the furnace mouth, the glowing gather turning on his pipe
    T.actor({ sample: 5, period: 2,
      at(t) { const f = Math.floor(t * 4) % 4; return { x: -6.6, y: -3.4, key: f, f }; },
      draw(g, st) {
        const r = VN.person(g, 0, 0, 0, VN.who(2000, { dir: 3, pose: 'hold', top: '#F3F1EA', bot: '#5A4A3C', colombina: null, scarf: null, beanie: null }));
        const h = r.hands[0], end = [h[0] - 5.4, h[1] - 1.6 + [0, -0.4, 0, 0.4][st.f]];
        g.line2([h, end], { w: 0.45, c: '#5E5A52', boil: false, ext: 0 }); g.disc2(end, 1.2, '#F2A03C'); g.disc2(end, 0.6, '#F8E07A');
      } });
    H(T, { x0: 6, y0: -22, x1: 18, y1: -12, n: 3, col: VN.PLASTER[1], chim: [[12, -18]], shopR: [-20, -14, '#2F3A55', 'VETRI'] });
    H(T, { x0: -22, y0: 2, x1: -12, y1: 16, n: 2, col: VN.PLASTER[0], chim: [[-17, 8]], shopR: [4, 12, '#7A2E35', 'GIOIELLI'] });
    // the lighthouse at the tip
    T.obj([16, 6, 20, 10], function (g) {
      K.cyl(g, 18, 8, 1.8, 0, 1.0, { t: '#E2DCCF', l: '#ECE7DC', r: '#D6CFC1' }, { w: 0.5, n: 10 });
      K.cyl(g, 18, 8, 1.3, 1.0, 14, { t: '#F3F1EA', l: '#F6F4EE', r: '#DDD8CC' }, { w: 0.8, n: 10 });
      K.cyl(g, 18, 8, 1.6, 14, 14.6, { t: '#5E6660', l: '#6E7670', r: '#5E6660' }, { w: 0.5, n: 10 });
      K.cyl(g, 18, 8, 1.0, 14.6, 16.4, { t: '#F2E3A6', l: '#F6EBC0', r: '#E2D59A' }, { w: 0.5, n: 10 });
      K.cone(g, 18, 8, 1.2, 16.4, 1.6, '#5E6660', {});
    }, { name: 'faro' });
    VN.walker(T, VN.who(2010), [[-14, 0], [12, 0], [12, -4], [-14, -4]], 1.1, { phase: 0 });
    VN.walker(T, VN.carnival(2011, 'gown'), [[10, 10], [-10, 10], [-10, -2]], 0.9, { phase: 0.4 });
    T.actor({ sample: 0.3, period: 40, grow: false,
      at(t) { const u = (t % 40) / 40, y = lerp(-34, 30, u); return { x: 28, y, z: WL, key: 'v', alpha: clamp(Math.min(y + 34, 30 - y) / 6, 0, 1) }; },
      draw(g) { VN.drawBoat(g, 'vaporetto', Math.PI / 2, -99, 99, { line: 4.1, seed: 2012 }); } });
  });

  /* ---------------- Burano ---------------- */
  SF.tile('burano', -30, -222, { rim: 76, castAt: 156, order: -3.4, half: 34 }, function (T) {
    T.ground(function (g) {
      water(g, [[-36, -14], [-24, -34], [4, -38], [30, -26], [36, 0], [28, 26], [4, 34], [-26, 28], [-36, 8]], 33);
      land(g, [[-26, -22], [-6, -28], [20, -22], [26, -2], [20, 18], [-2, 24], [-22, 18], [-28, 0]], VN.paveC);
      // a little canal through the island
      g.fill(K.rect(-28, -3, 26, 3, WL), VN.water); g.water(K.rect(-28, -3, 26, 3, WL), { dens: 0.8 });
      g.fill(K.on('L', -3, -26, 24, WL, 0), '#C9A88E'); g.fill(K.on('L', -3, -26, 24, -0.4, 0), VN.istria);
      g.fill(K.rect(-26, 3, 24, 4, 0), VN.paveC);
    });
    const BC = ['#E8483C', '#F2C230', '#3D7FC4', '#3FA06A', '#E87FAE', '#8E5BC0', '#F08A2E', '#2FB0B0', '#E6D84A', '#C2384A'];
    // a row of houses along each side of the canal, every one a different colour
    for (let i = 0; i < 6; i++) { const x0 = -22 + i * 7; H(T, { x0, y0: -14, x1: x0 + 6, y1: -4.6, n: 2, col: BC[i], roof: 'x', chim: [[x0 + 3, -9]], shut: true, shutCol: '#F3F1EA', closedP: 0.1, doorL: [x0 + 2, x0 + 3.6, '#F3F1EA'] }); }
    for (let i = 0; i < 5; i++) { const x0 = -20 + i * 7.2; H(T, { x0, y0: 5, x1: x0 + 6.2, y1: 13, n: 2, col: BC[(i + 6) % 10], roof: 'x', chim: [[x0 + 3, 9]], shutCol: '#F3F1EA', closedP: 0.1, doorL: [x0 + 2.2, x0 + 3.8, '#3A3530'] }); }
    // the leaning campanile
    T.obj([12, -22, 16, -18], function (g) {
      const lean = 1.6;
      g.at(0, 0, 0, (g2) => {
        const b = [[12, -18, 0], [16, -18, 0], [16, -22, 0]], t = b.map((p) => [p[0] + lean, p[1] + lean * 0.3, 20]);
        g2.fill([b[0], b[1], t[1], t[0]], '#E8DCC6'); g2.fill([b[1], b[2], t[2], t[1]], '#D6C8AE');
        g2.line([b[0], t[0]], { w: 0.8 }); g2.line([b[1], t[1]], { w: 0.6 }); g2.line([b[2], t[2]], { w: 0.8 });
        const bl = [[12 + lean * 0.9, -18 + lean * 0.27, 16], [16 + lean * 0.9, -18 + lean * 0.27, 16], [16 + lean * 0.9, -18 + lean * 0.27, 18.6], [12 + lean * 0.9, -18 + lean * 0.27, 18.6]]; g2.fill(bl, '#4A3E34');
        g2.fill([t[0], t[1], t[2], [12 + lean, -22 + lean * 0.3, 20]], '#C9BBA6');
        const ap = [14 + lean * 1.1, -20 + lean * 0.33, 24.4]; g2.fill([t[0], t[1], ap], '#B9715A'); g2.fill([t[1], t[2], ap], '#A9634B'); g2.line([t[0], ap, t[2]], { w: 0.6 });
      });
    }, { name: 'campanile storto', tall: true });
    // lace makers outside their doors, washing, boats in the canal
    T.cast([-10, -3.4], (g) => { for (const [x, i] of [[-15, 0], [-8, 1], [3, 2]]) { VN.person(g, x, -3.6, 1.3, VN.who(2100 + i, { dir: 1, pose: 'hold', hair: '#8E8A84', hairStyle: 'bun', dress: '#3B3F47', colombina: null })); const p = g.p(x + 0.2, -3.0, 2.4); g.fill2(arcPts(p[0], p[1], 1.4, 0, TAU, 10).map((q) => [q[0], p[1] + (q[1] - p[1]) * 0.5]), '#F6F4EE', true); } }, { name: 'lace makers' });
    T.obj([-6, -14.2, 4, -13.8], (g) => VN.washLine(g, [-6, -14, 6.8], [4, -14, 6.8], ['#F3F1EA', '#E8483C', '#3D7FC4', '#F3F1EA', '#F2C230']), { name: 'washing' });
    for (const [x, c] of [[-18, '#3D7FC4'], [10, '#E8483C']]) T.obj([x - 3, -0.6, x + 3, 0.6], (g) => g.at(x, 0, WL, (g2) => VN.drawBoat(g2, 'sandolo', 0, -99, 99, { who: null, ph: 0.3 })), { name: 'boat' });
    VN.walker(T, VN.who(2110), [[-24, 15], [16, 15]], 1.0, { phase: 0 });
    VN.walker(T, VN.carnival(2111, 'jester'), [[18, 16.2], [-20, 16.2]], 0.9, { phase: 0.5 });
  });

  /* ---------------- San Giorgio Maggiore ---------------- */
  SF.tile('sangiorgio', 222, 10, { rim: 82, castAt: 162, order: 3.5, half: 34 }, function (T) {
    T.ground(function (g) {
      water(g, [[-36, -18], [-22, -36], [8, -38], [32, -24], [38, 4], [30, 30], [2, 36], [-28, 28], [-38, 6]], 35);
      land(g, [[-26, -24], [-4, -30], [20, -22], [26, 0], [20, 22], [-6, 26], [-26, 16], [-30, -4]], VN.paveC);
      VN.pave(g, -22, -6, 6, 20, { col: '#DDD8CE', scuff: false });
      // the little harbour
      g.fill(K.rect(10, 4, 22, 18, WL), VN.lagoon); g.fill(K.on('L', 4, 10, 22, WL, 0), '#C9A88E'); g.fill(K.on('R', 10, 4, 18, WL, 0), '#B59479');
    });
    const W = { t: '#ECE8DF', l: '#F4F1EA', r: '#E0DBD0' };
    T.obj([-24, -26, 2, -6], function (g) {
      g.boilP = 0.22;
      K.box(g, -22, -26, 0, -8, 0, 11, W, { w: 0.9 });
      K.gable(g, -22.3, -26.3, 0.3, -7.7, 11, 3.4, 'x', { a: VN.roof, b: shade(VN.roof, 0.12), e: '#F4F1EA' }, { c: '#7A3A28' });
      K.cyl(g, -11, -17, 4.0, 14, 18, W, { w: 0.7, n: 16 }); K.dome(g, -11, -17, 4.0, 18, 4.2, '#AAB3B6', { w: 0.7, shadow: '#919CA0' }); K.cyl(g, -11, -17, 0.8, 22.2, 24, W, { w: 0.45, n: 8 });
      // Palladio's temple front on the R face: four giant columns on pedestals, a pediment, the lower side pediments
      const F = 0.02;
      g.fill(K.on('R', F, -22, -12, 0, 14), '#F6F3EC');
      const pd = [[F + 0.02, -22.4, 14], [F + 0.02, -11.6, 14], [F + 0.02, -17, 17.4]]; g.fill(pd, '#F6F3EC'); g.outline(pd, { w: 0.6, boil: false });
      for (const s of [[-26, -22], [-12, -8]]) { const sp = [[F + 0.01, s[0], 9], [F + 0.01, s[1], 9], [F + 0.01, s[0] < -20 ? s[1] : s[0], 11]]; g.fill(sp, '#F2EEE5'); g.outline(sp, { w: 0.45, boil: false }); }
      const cl = []; for (const a of [-21.2, -18.6, -15.4, -12.8]) { const A = g.p(F + 0.03, a, 1.6), B = g.p(F + 0.03, a, 13.4); cl.push(A[0], A[1], B[0], B[1]); } g.segs2(cl, '#D9D3C6', 1.4);
      VN.door(g, 'R', F, -18, -16, 5.6, { arch: 'round', col: '#4A3A30' });
      g.ring2(g.p(F + 0.03, -17, 15.4), 0.9, { w: 0.35, c: '#8E877A' });
    }, { name: 'san giorgio' });
    T.obj([-26, -30, -20, -24], function (g) {
      K.box(g, -26, -30, -20, -24, 0, 22, { t: '#B9715A', l: '#C47A5E', r: '#A9634B' }, { w: 0.85 });
      K.box(g, -26.2, -30.2, -19.8, -23.8, 22, 26, W, { w: 0.7 });
      for (const [f, p, a0] of [['L', -23.78, -25.2], ['R', -19.78, -29.2]]) g.fill(VN.archPts(f, p, a0 + 1.2, a0 + 3.6, 22.6, 25.4, 'round', 0), '#4A3E34');
      K.cyl(g, -23, -27, 2.2, 26, 27.4, W, { w: 0.55, n: 10 });
      K.cone(g, -23, -27, 2.3, 27.4, 7, '#6F9A86', {});
      const an = g.p(-23, -27, 34.4); g.disc2([an[0], an[1] - 1], 0.6, C.gold);
    }, { name: 'campanile', tall: true });
    // the monastery behind: two cloister wings, cypresses, a moored boat and a waiting sandolo in the harbour
    T.obj([2, -28, 22, -18], (g) => VN.house(g, { x0: 2, y0: -28, x1: 22, y1: -18, n: 2, col: '#EDE6D8', shut: false, arch2: 'round', roof: 'x', chim: [[8, -23], [16, -23]], winL: 7, seed: 9 }), { name: 'monastery' });
    T.obj([-26, 4, -16, 18], (g) => VN.house(g, { x0: -26, y0: 4, x1: -16, y1: 18, n: 2, col: '#E9E1D2', shut: false, arch2: 'round', roof: 'y', chim: [[-21, 10]], winR: 5, seed: 7 }), { name: 'monastery wing' });
    for (const [x, y] of [[-4, 20], [-1, 22], [2, 20]]) T.obj([x, y], (g) => K.cypress(g, x, y, { h: 9 }), { name: 'cypress' });
    T.obj([12, 6.6, 20, 8.4], (g) => g.at(16, 7.5, WL, (g2) => VN.drawBoat(g2, 'taxi', 0, -99, 99, { seed: 2205 })), { name: 'moored taxi' });
    T.obj([12, 12.6, 19.6, 14.4], (g) => g.at(16, 13.5, WL, (g2) => VN.drawBoat(g2, 'sandolo', 0, -99, 99, { seed: 2206, ph: 0.1 })), { name: 'moored sandolo' });
    T.cast([-6, 6], (g) => { VN.person(g, -6, 6, 0, VN.carnival(2212, 'cape', { dir: 3, pose: 'hold' })); const r = VN.person(g, -3.6, 8.2, 0, VN.who(2213, { dir: 2, pose: 'hold' })); const h = r.hands[0]; g.fill2([[h[0] - 1, h[1] - 1.4], [h[0] + 1, h[1] - 1.4], [h[0] + 1, h[1] + 0.2], [h[0] - 1, h[1] + 0.2]], '#2A2622', true); }, { name: 'photo of san marco' });
    VN.walker(T, VN.who(2210), [[2, 18], [-18, 18], [-18, 0], [2, 0]], 1.0, { phase: 0.2 });
    VN.walker(T, VN.carnival(2211, 'gown'), [[-20, 2], [4, 2]], 0.8, { phase: 0.6 });
  });
})();
