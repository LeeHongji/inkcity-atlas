'use strict';
/* (-100, 0) Cannaregio: a campo with its well-head, and the Ca' d'Oro on the Grand Canal.
   - The Ca' d'Oro (1430s): the most delicate gothic front on the canal, asymmetric: on the left a water portico and two
     loggias of lace-like tracery one above the other, on the right a wall of pale marble with ogee windows, a white
     crest of spiky merlons; it rises straight from the water, the Ca' d'Oro vaporetto stop moored in front of it.
   - The campo: grey masegni with white bands, a carved vera da pozzo in the middle (old women talk beside it with their
     shopping trolleys, a child climbs its step), a brick parish church at the far corner with a round window and its
     bell tower, houses in ochre and rose with green shutters, altane on the roofs (washing, a man with his paper).
   - Along the far side: a bacaro (people standing outside with spritz and cicchetti), a mask-maker's shop with masks
     in the window, a calle to the bridge over the rio with washing hung across it.
   - Carnival: a family in costume, children throwing confetti, a jester juggling.
   What moves: people crossing the campo and the two bridges, a juggler's balls, a cat, the confetti. */
SF.tile('cannaregio', -100, 0, { rim: 22 }, function (T) {
  const P = VN.PLASTER;
  T.ground(function (g) {
    g.boilP = 0.15;
    K.slab(g, 37, { top: VN.paveC });
    VN.pave(g, -37, -37, 37, 37, { col: '#D2CDC2', step: 2.6 });
    // the campo's white bands round the well, a fondamenta along the Grand Canal
    const b = []; for (const r of [7, 13]) { const pts = g.P(VN.ell(6, 0, 0, r, r, 28)); for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; b.push(p[0], p[1], q[0], q[1]); } } g.segs2(b, '#EFEBE2', 0.8);
    g.fill(K.rect(-6, 36.3, 37, 37), VN.istria); g.fill(K.rect(36.3, -37, 37, 37), VN.istria);
  }, { rim: true });

  /* ---------- the church and its bell tower ---------- */
  T.obj([-35, -35, -18, -16], function (g) {
    g.boilP = 0.25;
    const B = { t: '#B9715A', l: '#C47A5E', r: '#A9634B' };
    K.box(g, -35, -35, -18, -16, 0, 12, B, { w: 0.9 });
    K.gable(g, -35.4, -35.4, -17.6, -15.6, 12, 4.4, 'x', { a: VN.roof, b: shade(VN.roof, 0.12), e: '#C47A5E' }, { c: '#7A3A28' });
    // the brick front (R face) with its Istrian trim, rose window, portal, statues in niches
    const F = -17.99;
    g.fill(K.on('R', F, -33.5, -17.5, 0, 0.8), VN.istria);
    VN.door(g, 'R', F, -27.6, -23.8, 5.2, { arch: 'gothic', col: '#4A3A30' });
    const c = g.p(F, -25.7, 10.2); g.fill2(arcPts(c[0], c[1], 3.4, 0, TAU, 16).map((q) => [q[0], c[1] + (q[1] - c[1]) * 1.15 + (q[0] - c[0]) * 0.52]), VN.istria, true); g.fill2(arcPts(c[0], c[1], 2.5, 0, TAU, 16).map((q) => [q[0], c[1] + (q[1] - c[1]) * 1.15 + (q[0] - c[0]) * 0.52]), '#4F5963', true);
    const sp = []; for (let i = 0; i < 8; i++) { const a = TAU * i / 8; sp.push(c[0], c[1], c[0] + Math.cos(a) * 2.5, c[1] + (Math.sin(a) * 1.15 + Math.cos(a) * 0.52) * 2.5); } g.segs2(sp, VN.istria, 0.4);
    for (const a of [-31.5, -20]) { g.fill(VN.archPts('R', F, a - 0.8, a + 0.8, 2.4, 6.4, 'gothic', 0.25), VN.istria); g.fill(VN.archPts('R', F, a - 0.8, a + 0.8, 2.4, 6.4, 'gothic', 0), '#8E5A48'); const s = g.p(F, a, 2.6); g.fill2([[s[0] - 0.6, s[1]], [s[0] + 0.6, s[1]], [s[0] + 0.5, s[1] - 10.5], [s[0] - 0.5, s[1] - 10.5]], '#EDE8DD', true); g.disc2([s[0], s[1] - 11.2], 0.65, '#EDE8DD'); }
    const fr = []; for (let a = -34; a < -17.5; a += 1.0) { const p = g.p(F, a, 11.2), q = g.p(F, a + 0.5, 11.8); fr.push(p[0], p[1], q[0], q[1]); } g.segs2(fr, '#E9E3D6', 0.4);
    const ap = g.p(F, -25.7, 16.4); g.fill2([[ap[0] - 0.5, ap[1]], [ap[0] + 0.5, ap[1]], [ap[0], ap[1] - 3]], VN.istria, true);
  }, { name: 'church' });
  T.obj([-35, -14.5, -30, -9.5], function (g) {
    K.box(g, -35, -14.5, -30, -9.5, 0, 22, { t: '#B9715A', l: '#C47A5E', r: '#A9634B' }, { w: 0.9 });
    for (const [f, p, a0, a1] of [['L', -9.5, -35, -30], ['R', -30, -14.5, -9.5]]) { for (let k = 0; k < 2; k++) g.fill(VN.archPts(f, p + 0.02, a0 + 0.8 + k * 2.1, a0 + 2.2 + k * 2.1, 17, 20.5, 'round', 0), '#4A3E34'); g.fill(K.on(f, p + 0.03, a0, a1, 16.4, 16.9), VN.istria); }
    K.cone(g, -32.5, -12, 2.6, 22, 6, '#6F9A86', {});
  }, { name: 'bell tower', tall: true });

  /* ---------- houses ---------- */
  const H = (d, nm) => T.obj([d.x0, d.y0, d.x1, d.y1], (g) => VN.house(g, d), { name: nm || 'house' });
  H({ x0: -37, y0: -10, x1: -27, y1: 6, n: 3, col: P[0], roof: 'y', chim: [[-32, -4], [-32, 2, 'square']], closedP: 0.3 });
  H({ x0: -37, y0: 8, x1: -28, y1: 22, n: 4, col: P[1], chim: [[-33, 12]], altana: [-32.5, 18, { wash: ['#F3F1EA', '#5F8FC9', '#C9463E', '#F3F1EA'] }] });
  H({ x0: -14, y0: -37, x1: -4, y1: -27, n: 3, col: P[3], shopL: [-12, -6, '#7A2E35', 'FORNO'], chim: [[-9, -33]] });
  H({ x0: 4, y0: -37, x1: 16, y1: -27, n: 3, col: P[2], shopL: [5.5, 14.5, '#3E5A44', 'BACARO'], chim: [[8, -33], [13, -31, 'square']], altana: [10, -32, { who: (g, z) => VN.person(g, 11, -31.5, z, VN.who(1201, { dir: 1, pose: 'sit' })) }], flowers: ['#C9463E', '#E6C24F'] }, 'bacaro');
  H({ x0: 16, y0: -37, x1: 26, y1: -27, n: 4, col: P[6], shopL: [17.5, 24.5, '#2F3A55', 'MASCHERE'], chim: [[21, -33]], goods: (g, f, p, s0, s1) => { for (let i = 0; i < 4; i++) { const c = g.p.apply(g, K.pt(f, p + 0.05, lerp(s0 + 1, s1 - 1, i / 3), 1.9 + (i % 2) * 0.8)); g.fill2(arcPts(c[0], c[1], 1.1, 0, TAU, 8).map((q) => [q[0], c[1] + (q[1] - c[1]) * 1.2]), ['#F4F1EA', '#D9B24A', '#C9463E', '#F4F1EA'][i], true); g.disc2([c[0] - 0.4, c[1] - 0.2], 0.2, '#2A2622'); g.disc2([c[0] + 0.4, c[1] - 0.2], 0.2, '#2A2622'); } } });
  H({ x0: 26, y0: -37, x1: 37, y1: -26, n: 3, z0: VN.WL, col: P[7], chim: [[31, -32]], balcony: ['R', -31.5, ['#C9463E', '#8E79C0']] });
  H({ x0: 27, y0: 8, x1: 37, y1: 22, n: 2, z0: VN.WL, col: P[8], roof: 'x', chim: [[31, 14]], doorL: [29, 31.4] });
  // washing across the calle to the bridge
  T.obj([-4, -30.4, 4, -29.6], (g) => VN.washLine(g, [-4, -30, 10.2], [4, -30, 10.2], ['#F3F1EA', '#E6C24F', '#5F8FC9', '#F3F1EA', '#D98AA4']), { name: 'washing' });

  /* ---------- the Ca' d'Oro ---------- */
  T.obj([-33, 27, -6, 37], function (g) {
    g.boilP = 0.2;
    const x0 = -33, x1 = -6, y1 = 37, Z = 14.5, W = VN.WL, F = y1;
    K.box(g, x0, 27, x1, y1, W, Z, { t: '#E9DCCB', l: '#F1E6D6', r: '#DDCDB9' }, { w: 0.9 });
    g.fill(K.on('L', F + 0.01, x0, x1, W, W + 0.6), '#6F8A62');
    // the right-hand wall: pale pink marble, ogee windows in three floors, a red-and-white corner band
    g.fill(K.on('L', F + 0.01, -20, x1, 0.4, Z), '#EBD3C6');
    for (const zf of [1.2, 5.6, 10.0]) for (const a of [-18, -14.6, -11.2, -8.4]) VN.win(g, 'L', F + 0.02, a, a + 1.4, zf, zf + 3.2, { arch: 'ogee', sh: null, frameCol: '#F6F1E8' });
    // the left: water portico, then two loggias of tracery
    for (let i = 0; i < 5; i++) { const a = x0 + 1 + i * 2.5; g.fill(VN.archPts('L', F + 0.02, a, a + 1.9, W, 3.4, 'round', 0), '#3E4A44'); }
    for (const [z0, z1, n] of [[4.4, 8.4, 7], [9.0, 12.8, 7]]) {
      g.fill(K.on('L', F + 0.015, x0 + 0.6, -20.6, z0 - 0.2, z1 + 0.3), '#F6F1E8');
      for (let i = 0; i < n; i++) { const a = x0 + 1.0 + i * 1.75; g.fill(VN.archPts('L', F + 0.02, a, a + 1.2, z0, z1 - 1.0, 'ogee', 0), '#4A4E52'); }
      const qf = []; for (let i = 0; i < n - 1; i++) qf.push(g.p.apply(g, K.pt('L', F + 0.03, x0 + 2.45 + i * 1.75, z1 - 0.3)));
      for (const q of qf) { g.ring2(q, 0.75, { w: 0.35, c: '#8A7A6A' }); g.disc2(q, 0.38, '#4A4E52'); }
      g.line([K.pt('L', F + 0.03, x0 + 0.6, z1 + 0.3), K.pt('L', F + 0.03, -20.6, z1 + 0.3)], { w: 0.4, boil: false, c: '#A39A8A' });
    }
    // the corner bands, the cornice, the spiky white crest
    for (const a of [x0 + 0.15, -20.3, x1 - 0.3]) { const q = K.on('L', F + 0.03, a, a + 0.35, W + 0.6, Z); g.fill(q, '#C9584B'); const Q = g.P(q); VN.hatch(g, Q, 14, '#F3F0E8', 0.35); }
    g.fill(K.on('L', F + 0.03, x0, x1, Z - 0.7, Z), '#F6F1E8');
    const mer = []; for (let a = x0 + 0.5; a < x1; a += 1.1) { const c = g.p(a, F, Z); mer.push(c[0] - 0.8, c[1], c[0] + 0.8, c[1], c[0], c[1] - 2.6); } g.tris2(mer, '#F6F1E8');
    g.line([[x0, F, Z], [x1, F, Z]], { w: 0.7 });
  }, { name: "ca' d'oro" });

  /* ---------- the campo: the well, the bacaro's crowd, benches ---------- */
  T.obj([6, 0], (g) => VN.well(g, 6, 0), { name: 'well' });
  T.obj([18, 14], (g) => VN.lamp(g, 18, 14, {}), { name: 'lamp' });
  T.obj([-8, 14], (g) => VN.lamp(g, -8, 14, {}), { name: 'lamp' });
  T.obj([-10, 26], (g) => K.tree(g, -10, 26, { r: 3.4, h: 5, col: '#97A774' }), { name: 'tree' });
  T.obj([24, -12], (g) => K.bench(g, 24, -12, { face: 'L', L: 2.6 }), { name: 'bench' });
  // the bacaro's customers standing outside with their spritz and cicchetti
  T.cast([10, -24.5], function (g) {
    const spots = [[6.5, -25.2, 1, 'hold'], [8.2, -24.4, 2, 'hold'], [10.4, -24.8, 0, 'stand'], [12.2, -23.9, 3, 'hold'], [14, -25.0, 1, 'hold']];
    spots.forEach(([x, y, d, pose], i) => { const w = i === 3 ? VN.carnival(1210 + i, 'volto') : VN.who(1210 + i); const r = VN.person(g, x, y, 0, Object.assign({}, w, { dir: d, pose })); if (pose === 'hold' && r.hands) { const h = r.hands[0]; g.fill2([[h[0] - 0.5, h[1] - 1.6], [h[0] + 0.5, h[1] - 1.6], [h[0] + 0.35, h[1] + 0.1], [h[0] - 0.35, h[1] + 0.1]], '#E8712F', true); g.disc2([h[0] + 0.1, h[1] - 1.4], 0.25, '#F2E3A6'); } });
  }, { name: 'bacaro crowd' });
  // two old friends at the well with their trolleys, a child on the well's step
  T.cast([6, 3.6], function (g) {
    VN.person(g, 3.6, 3.4, 0, VN.who(1220, { dir: 0, hair: '#8E8A84', hairStyle: 'bun', dress: '#5A4A6A', top: '#5A4A6A', pose: 'hold' }));
    g.fill(K.rect(2.0, 4.2, 2.8, 5.0, 0), '#3B3F47'); K.box(g, 2.0, 4.2, 2.8, 5.0, 0.3, 2.4, { t: '#7A2E35', l: '#8E3A40', r: '#6E2830' }, { w: 0.4 });
    VN.person(g, 6.6, 4.4, 0, VN.who(1221, { dir: 3, hair: '#B9B4AC', hairStyle: 'short', top: '#2F3A55', beanie: '#C9463E' }));
    VN.person(g, 8.4, 2.4, 0.35, VN.carnival(1222, 'jester', { dir: 1, k: 0.72, pose: 'cheer', ph: 0.3 }));
  }, { name: 'friends at the well' });
  T.cast([24, -11.2], (g) => { VN.person(g, 23.4, -11.4, 1.3, VN.who(1225, { dir: 1, pose: 'sit', fedora: '#3B3F47', hair: '#8E8A84' })); const p = g.p(25.0, -10.6, 2.2); g.fill2([[p[0] - 1.6, p[1]], [p[0] + 1.6, p[1] - 0.6], [p[0] + 1.6, p[1] - 2.6], [p[0] - 1.6, p[1] - 2.0]], '#F3F1EA', true); }, { name: 'reader' });

  /* ---------- the living: walkers, a juggler, a cat, confetti ---------- */
  const W = (seed, pts, v, ph, o) => VN.walker(T, seed > 0 ? VN.who(seed, o) : VN.carnival(-seed, (o && o.kind) || 'gown', o), pts, v, { phase: ph });
  W(1230, [[0, -26], [0, 20], [26, 20], [26, -14]], 1.4, 0);
  W(1231, [[26, 0], [-12, 0], [-12, -20], [24, -20]], 1.3, 0.3);
  W(-1232, [[-14, 24], [20, 24], [20, -18], [-14, -18]], 1.0, 0.5, { kind: 'gown' });
  W(-1233, [[-14, 24], [20, 24], [20, -18], [-14, -18]], 1.0, 0.54, { kind: 'bauta' });
  W(1234, [[-4, 32], [30, 32]], 1.5, 0.2);
  W(1235, [[30, 33.5], [-4, 33.5]], 1.3, 0.6);
  W(1236, [[12, -20], [12, 18]], 1.2, 0.7);
  W(1237, [[-2, -22], [30, 6]], 1.4, 0.1);
  // a juggling jester
  const jw = VN.carnival(1240, 'jester');
  T.actor({ sample: 5, period: 6,
    at(t) { const f = Math.floor(t * 6) % 6; return { x: 15, y: -9, key: f, f }; },
    draw(g, st) { const r = VN.person(g, 0, 0, 0, Object.assign({}, jw, { dir: 1, pose: 'cheer', ph: st.f / 6 })); const c = [(r.hands[0][0] + r.hands[1][0]) / 2, Math.min(r.hands[0][1], r.hands[1][1]) - 3]; for (let k = 0; k < 3; k++) { const a = TAU * (st.f / 6 + k / 3); g.disc2([c[0] + Math.cos(a) * 2.4, c[1] + Math.sin(a) * 2.0], 0.55, ['#C9463E', '#E6C24F', '#5F8FC9'][k]); } } });
  T.cast([18, -6.5], (g) => { for (let i = 0; i < 3; i++) VN.person(g, 17.5 + i * 1.6, -6 - i * 0.4 + (i % 2) * 1.2, 0, VN.who(1241 + i, { dir: 2, k: i === 1 ? 0.72 : 1, pose: i === 1 ? 'cheer' : 'stand', ph: 0.2 })); }, { name: 'audience' });
  // children throwing confetti
  T.actor({ sample: 5, period: 4,
    at(t) { const f = Math.floor(t * 5) % 8; return { x: 0, y: 10, key: f, f }; },
    draw(g, st) {
      VN.person(g, 0, 0, 0, VN.who(1250, { dir: 0, k: 0.7, pose: 'cheer', ph: st.f / 8, colombina: '#D98AA4' }));
      VN.person(g, 2.4, 1.6, 0, VN.carnival(1251, 'gown', { dir: 2, k: 0.7, pose: 'cheer', ph: st.f / 8 + 0.5 }));
      const R = RNG(st.f + 3), cf = []; for (let i = 0; i < 26; i++) { const c = g.p(R.range(-2, 4), R.range(-1, 3), R.range(1, 7)); const col = ['#C9463E', '#E6C24F', '#5F8FC9', '#8FBF73', '#D98AA4'][i % 5]; g.fill2([[c[0], c[1]], [c[0] + 0.7, c[1] + 0.2], [c[0] + 0.5, c[1] + 0.8]], col, true); }
      void cf;
    } });
  // a cat on the bridge landing's step
  T.actor({ sample: 5, period: 8,
    at(t) { const f = Math.floor(t / 2) % 4; return { x: 3.4, y: -26.5, key: f, f }; },
    draw(g, st) { const p = g.p(0, 0, 0); g.fill2([[p[0] - 1.6, p[1]], [p[0] + 1.2, p[1]], [p[0] + 1.4, p[1] - 1.6], [p[0] - 1.4, p[1] - 1.6]], '#3B3532', true); g.disc2([p[0] + 1.4, p[1] - 2.0], 0.9, '#3B3532'); g.fill2([[p[0] + 0.8, p[1] - 2.6], [p[0] + 1.1, p[1] - 3.4], [p[0] + 1.4, p[1] - 2.7]], '#3B3532', true); g.fill2([[p[0] + 1.6, p[1] - 2.7], [p[0] + 2.0, p[1] - 3.4], [p[0] + 2.1, p[1] - 2.5]], '#3B3532', true); const tl = st.f % 2 ? [[p[0] - 1.6, p[1] - 0.6], [p[0] - 3.0, p[1] - 2.6]] : [[p[0] - 1.6, p[1] - 0.6], [p[0] - 3.2, p[1] - 0.8]]; g.line2(tl, { w: 0.5, c: '#3B3532', boil: false, ext: 0 }); } });
  VN.finish(T);
});
