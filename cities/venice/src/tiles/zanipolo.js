'use strict';
/* (-100, -100) Campo Santi Giovanni e Paolo ("Zanipolo"), the hospital and the Colleoni.
   - The basilica of Santi Giovanni e Paolo: a huge Dominican church of bare brick, its tall gabled front with an
     unfinished marble portal, a round window and pinnacles; behind, the dome over the crossing.
   - The Scuola Grande di San Marco beside it, now the city hospital: a marble front with semicircular crests and the
     famous trompe-l'oeil arches with lions at the ground floor.
   - Verrocchio's bronze Colleoni on horseback on his tall pedestal in the middle of the campo.
   - Along the rio dei Mendicanti: the hospital's quay with two ambulance boats moored; a crew wheels a stretcher.
   - A café's tables, children kicking a ball, a nun, a man walking his dog, a Carnival couple taking a selfie. */
SF.tile('zanipolo', -100, -100, { rim: 4 }, function (T) {
  const P = VN.PLASTER;
  T.ground(function (g) {
    g.boilP = 0.15;
    K.slab(g, 37, { top: VN.paveC });
    VN.pave(g, -37, -37, 37, 37, { col: '#D2CCC0', step: 2.4 });
    g.fill(K.rect(36.3, -37, 37, 37), VN.istria); g.fill(K.rect(-37, 36.3, 37, 37), VN.istria);
  }, { rim: true });
  const H = (d, nm) => T.obj([d.x0, d.y0, d.x1, d.y1], (g) => VN.house(g, d), { name: nm || 'house' });

  /* ---------- the basilica ---------- */
  T.obj([-35, -36, -11, -13], function (g) {
    g.boilP = 0.25;
    const B = { t: '#B9715A', l: '#C47A5E', r: '#A9634B' }, x0 = -35, x1 = -11, y0 = -36, y1 = -13;
    // aisles, nave, the dome over the crossing behind
    K.box(g, x0, y0, -29, y1, 0, 11, B, { w: 0.85 }); K.box(g, -17, y0, x1, y1, 0, 11, B, { w: 0.85 });
    K.box(g, -29, y0 + 6, -17, y1, 0, 18, B, { w: 0.9 });
    K.cyl(g, -23, -31, 4.6, 14, 20, { t: '#B9715A', l: '#C47A5E', r: '#A9634B' }, { w: 0.7, n: 16 });
    K.dome(g, -23, -31, 4.6, 20, 4.4, '#9AA8AC', { w: 0.7, shadow: '#84929A' });
    const lt = g.p(-23, -31, 24.4); g.fill2([[lt[0] - 0.8, lt[1]], [lt[0] + 0.8, lt[1]], [lt[0] + 0.5, lt[1] - 2.6], [lt[0] - 0.5, lt[1] - 2.6]], '#E9E3D6', true);
    K.gable(g, -29.4, y0 + 5.6, -16.6, y1, 18, 5.6, 'y', { a: VN.roof, b: shade(VN.roof, 0.12), e: '#C47A5E' }, { c: '#7A3A28' });
    for (const [a, b] of [[x0, -29], [-17, x1]]) K.gable(g, a - 0.3, y0, b + 0.3, y1, 11, 3.2, 'y', { a: VN.roof, b: shade(VN.roof, 0.12), e: '#C47A5E' }, { c: '#7A3A28' });
    // the front: pilasters, the marble portal, a round window, gothic pinnacles on the gables
    const F = y1 + 0.02;
    for (const a of [-29, -17]) g.fill(K.on('L', F, a - 0.5, a + 0.5, 0, 18.5), '#B5654C');
    g.fill(VN.archPts('L', F, -25.6, -20.4, 0, 8.2, 'round', 0.6), '#F0E9DD');
    g.fill(VN.archPts('L', F + 0.01, -24.6, -21.4, 0, 6.8, 'round', 0), '#5A3E2E');
    for (const a of [-25.4, -20.6]) { const p0 = g.p(a, F + 0.02, 0), p1 = g.p(a, F + 0.02, 6.4); g.line2([p0, p1], { w: 0.9, c: '#D9B8A4', boil: false, ext: 0 }); }
    const rc = g.p(-23, F, 13.4); g.fill2(arcPts(rc[0], rc[1], 3.2, 0, TAU, 16).map((q) => [q[0], rc[1] + (q[1] - rc[1]) * 1.15 - (q[0] - rc[0]) * 0.52]), '#F0E9DD', true); g.fill2(arcPts(rc[0], rc[1], 2.3, 0, TAU, 16).map((q) => [q[0], rc[1] + (q[1] - rc[1]) * 1.15 - (q[0] - rc[0]) * 0.52]), '#4F5963', true);
    for (const a of [-34, -29, -17, -12]) VN.win(g, 'L', F, a + 1.2, a + 2.6, 3.0, 8.4, { arch: 'gothic', sh: null, pane: '#4F5963' });
    for (const [x, z] of [[-29, 21], [-23, 24], [-17, 21], [x0 + 0.4, 13], [x1 - 0.4, 13]]) { const c = g.p(x, F, z); g.fill2([[c[0] - 0.6, c[1]], [c[0] + 0.6, c[1]], [c[0], c[1] - 3.4]], '#F0E9DD', true); g.disc2([c[0], c[1] - 3.6], 0.4, C.gold); }
  }, { name: 'santi giovanni e paolo' });

  /* ---------- the Scuola Grande di San Marco (the hospital) ---------- */
  T.obj([-9, -36, 15, -18], function (g) {
    g.boilP = 0.22;
    const x0 = -9, x1 = 15, y1 = -18, F = y1 + 0.02, M = { t: '#E9E3D6', l: '#F1ECE1', r: '#DED7C9' };
    K.box(g, x0, -36, x1, y1, 0, 12.5, M, { w: 0.9 });
    // the crests: semicircles over the bays
    for (const [a, b] of [[x0, -1], [-1, 7], [7, x1]]) { const m = (a + b) / 2, r = (b - a) / 2, pts = []; for (let i = 0; i <= 14; i++) { const t = Math.PI * i / 14; pts.push([m + Math.cos(t) * r, F, 12.5 + Math.sin(t) * r * 0.8]); } g.fill(pts, '#F1ECE1'); g.line(pts, { w: 0.6, boil: false }); const c = g.p(m, F, 12.5 + r * 0.35); g.ring2(c, 1.2, { w: 0.35, c: '#8E877A' }); g.disc2([c[0], c[1] - r * 0.8 * 3.46 * 0.75], 0.5, '#E9E3D6'); }
    // coloured marble panels, the windows, the trompe-l'oeil arches with lions at the ground floor, the portal
    for (const [a, b] of [[x0 + 0.8, x0 + 6.8], [8.2, 14.2]]) { g.fill(K.on('L', F, a, b, 0.8, 5.4), '#C9D3C8'); g.fill(VN.archPts('L', F + 0.01, a + 0.6, b - 0.6, 1.2, 5.0, 'round', 0), '#A9B8B0'); const q = g.p((a + b) / 2, F + 0.02, 1.6); g.fill2([[q[0] - 2.2, q[1]], [q[0] + 1.8, q[1] - 0.6], [q[0] + 2.0, q[1] - 2.4], [q[0] + 0.6, q[1] - 3.2], [q[0] - 1.8, q[1] - 2.0]], '#E2D3BC', true); }
    VN.door(g, 'L', F, -0.6, 2.6, 6.0, { arch: 'round', col: '#4A3A30' });
    for (const zf of [7.2]) for (const a of [-7.6, -4.6, 4.2, 7.6, 11.6]) VN.win(g, 'L', F, a, a + 1.4, zf, zf + 3.4, { arch: 'round', sh: null, pane: '#55606A', frameCol: '#F6F1E8' });
    for (let a = -34; a < -19; a += 2.6) VN.win(g, 'R', x1 + 0.02, a, a + 1.2, 7.2, 10.4, { arch: 'round', sh: null, pane: '#55606A' });
    K.sign(g, 'L', F + 0.01, -1.8, 3.8, 6.6, 7.0, '#F1ECE1', 'OSPEDALE', { ink: '#B5303A' });
  }, { name: 'scuola grande' });
  H({ x0: 17, y0: -37, x1: 27, y1: -24, n: 3, col: P[4], chim: [[21, -32]], shopL: [18.5, 25.5, '#3E5A44', 'FARMACIA'] });
  H({ x0: 27, y0: -37, x1: 37, y1: -24, n: 3, z0: VN.WL, col: P[1], chim: [[31, -32], [34, -28, 'square']], altana: [32, -31, { wash: ['#F3F1EA', '#E6C24F', '#F3F1EA'] }] });
  H({ x0: -37, y0: -8, x1: -27, y1: 8, n: 3, col: P[6], chim: [[-32, -3]], shopR: [-6, 6, '#7A2E35', 'PASTICCERIA'] });
  H({ x0: -37, y0: 10, x1: -27, y1: 26, n: 4, col: P[0], chim: [[-32, 14], [-32, 21]], balcony: ['R', 18, ['#C9463E', '#E6C24F']] });
  H({ x0: -37, y0: 28, x1: -24, y1: 37, n: 3, z0: VN.WL, col: P[2], roof: 'x', chim: [[-30, 32]] });

  /* ---------- the Colleoni ---------- */
  T.obj([1, 3, 6, 9], function (g) {
    g.boilP = 0.3;
    const x = 3.5, y = 6;
    K.box(g, x - 2.4, y - 3, x + 2.4, y + 3, 0, 1.0, { t: '#E2DCCF', l: '#ECE7DC', r: '#D6CFC1' }, { w: 0.6 });
    K.box(g, x - 1.8, y - 2.4, x + 1.8, y + 2.4, 1.0, 7.4, { t: '#E2DCCF', l: '#E9DED0', r: '#D3C8B7' }, { w: 0.75 });
    const col = []; for (const [f, p, a0, a1] of [['L', y + 2.4, x - 1.8, x + 1.8], ['R', x + 1.8, y - 2.4, y + 2.4]]) for (let i = 0; i < 4; i++) { const a = lerp(a0 + 0.4, a1 - 0.4, i / 3), q0 = g.p.apply(g, K.pt(f, p + 0.02, a, 2.2)), q1 = g.p.apply(g, K.pt(f, p + 0.02, a, 6.4)); col.push(q0[0], q0[1], q1[0], q1[1]); }
    g.segs2(col, '#B9AE9C', 0.7);
    K.box(g, x - 2.0, y - 2.6, x + 2.0, y + 2.6, 7.4, 8.0, { t: '#E2DCCF', l: '#ECE7DC', r: '#D6CFC1' }, { w: 0.55 });
    // the horse striding (one foreleg raised), the condottiere upright in the saddle in his helmet: bronze
    const c = g.p(x, y, 8.0), BR = '#55604F', BD = '#3E483E', s = 1.6, P = (a, b) => [c[0] + a * s, c[1] + b * s];
    const leg = (a, b, e, f, w) => g.line2([P(a, b), P(e, f)], { w: w || 0.9, c: BD, boil: false, ext: 0 });
    leg(3.4, -3.8, 3.0, 0); leg(-2.2, -3.9, -0.8, -1.8); leg(-0.8, -1.8, -0.4, -0.4, 0.8);
    g.fill2(K.curve([P(-4, -5.8), P(-2, -6.8), P(2.4, -6.8), P(4.3, -5.8), P(4.1, -4.0), P(2.0, -3.4), P(-2.0, -3.4), P(-4.0, -4.2)], 3, true), BR, true);
    g.fill2([P(-3.4, -5.4), P(-5.2, -8.8), P(-4.0, -9.8), P(-2.0, -6.8)], BR, true);
    g.fill2([P(-5.2, -8.6), P(-7.4, -7.8), P(-7.6, -8.7), P(-5.8, -10.3), P(-4.2, -9.9)], BR, true);
    leg(2.4, -3.8, 2.8, 0); leg(-3.0, -3.8, -3.6, 0);
    g.line2([P(4.2, -5.4), P(5.0, -4.4), P(5.4, -2.8)], { w: 0.8, c: BD, boil: false, ext: 0 });
    g.line2(K.curve([P(-4, -5.8), P(-2, -6.8), P(2.4, -6.8), P(4.3, -5.8), P(4.1, -4.0), P(2.0, -3.4), P(-2.0, -3.4), P(-4.0, -4.2)], 3, true), { w: 0.4, c: '#2A3028', boil: false, close: true });
    // the rider
    g.line2([P(0.4, -6.4), P(-0.2, -4.2)], { w: 1.0, c: BD, boil: false, ext: 0 });
    g.fill2([P(-0.6, -6.6), P(1.4, -6.6), P(1.5, -10.6), P(-0.3, -10.8)], BD, true);
    g.line2([P(1.2, -10.0), P(2.8, -8.6), P(3.6, -9.2)], { w: 0.7, c: BD, boil: false, ext: 0 });
    g.disc2(P(0.6, -11.6), 1.05 * s, BD); g.fill2([P(-0.6, -11.8), P(1.8, -11.8), P(0.6, -13.0)], '#2E362E', true);
  }, { name: 'colleoni', tall: true });

  /* ---------- the hospital quay: moored ambulances, the café, the campo ---------- */
  for (const [y, ph] of [[12, 0], [24, 1]]) T.obj([37.6, y - 4.4, 40.4, y + 4.4], (g) => g.at(39, y, VN.WL, (g2) => VN.drawBoat(g2, 'ambulanza', Math.PI / 2, -99, 99, { seed: 1500 + y, flash: ph })), { name: 'moored ambulance' });
  for (const y of [5.5, 18, 30]) T.obj([37.4, y], (g) => VN.palina(g, 37.4, y, { c1: '#C9463E', c2: '#F3F1EA', h: 5.5 }), { name: 'palina' });
  for (const [x, y] of [[-14, 30], [8, 30]]) T.cast([x, y], function (g) {
    VN.table(g, x, y, 0, { cups: ['#F3F1EA', '#5A3E2E'] });
    VN.person(g, x - 1.4, y - 0.8, 1.3, VN.who(1510 + Math.round(x), { dir: 0, pose: 'sit' })); VN.person(g, x + 1.5, y + 0.6, 1.3, VN.who(1520 + Math.round(x), { dir: 2, pose: 'sit' }));
  }, { name: 'café' });
  T.obj([-5, 20], (g) => VN.well(g, -5, 20), { name: 'well' });
  for (const [x, y] of [[20, -8], [-20, 26]]) T.obj([x, y], (g) => VN.lamp(g, x, y, {}), { name: 'lamp' });
  // the crew wheel a stretcher from the boat to the hospital door and back
  const crew = [VN.who(1530, { top: '#D9542F', bot: '#2F3A55', beanie: null, colombina: null, scarf: null }), VN.who(1531, { top: '#D9542F', bot: '#2F3A55', beanie: null, colombina: null, scarf: null })];
  T.actor({ sample: 0.25, period: 28,
    at(t) {
      const u = (t % 28) / 28, A = [34, 14], B = [1, -15];
      let k, back;
      if (u < 0.4) { k = u / 0.4; back = 0; } else if (u < 0.5) { k = 1; back = 0; } else if (u < 0.9) { k = 1 - (u - 0.5) / 0.4; back = 1; } else { k = 0; back = 1; }
      const x = lerp(A[0], B[0], smooth(k)), y = lerp(A[1], B[1], smooth(k)), moving = (u < 0.4 || (u >= 0.5 && u < 0.9));
      const ph = moving ? Math.floor((t * 1.3 / 2.4) % 1 * 8) / 8 : 0;
      return { x, y, back, ph, mv: moving ? 1 : 0, key: back + '.' + ph + '.' + moving };
    },
    draw(g, st) {
      const dx = -33, dy = -29, L = Math.hypot(dx, dy), ux = dx / L * (st.back ? -1 : 1), uy = dy / L * (st.back ? -1 : 1);
      const dir = Math.abs(ux) > Math.abs(uy) ? (ux > 0 ? 0 : 2) : (uy > 0 ? 1 : 3);
      const pf = [ux * 1.6, uy * 1.6], pb = [-ux * 1.6, -uy * 1.6];
      const order = (pf[0] + pf[1]) > (pb[0] + pb[1]) ? [pb, pf] : [pf, pb];
      VN.person(g, order[0][0], order[0][1], 0, Object.assign({}, crew[0], { dir, pose: st.mv ? 'walk' : 'stand', ph: st.ph }));
      const s0 = g.p(-ux * 1.2, -uy * 1.2, 2.6), s1 = g.p(ux * 1.2, uy * 1.2, 2.6);
      g.line2([s0, s1], { w: 2.2, c: '#F3F1EA', boil: false, ext: 0 }); g.line2([s0, s1], { w: 0.5, c: '#D9542F', boil: false, ext: 0 });
      VN.person(g, order[1][0], order[1][1], 0, Object.assign({}, crew[1], { dir, pose: st.mv ? 'walk' : 'stand', ph: (st.ph + 0.5) % 1 }));
    } });
  // children with a ball, a dog walker, a nun, Carnival selfies
  T.actor({ sample: 0.3, period: 6,
    at(t) { const u = (t % 6) / 6, a = u * TAU, bx = 14 + Math.cos(a) * 5, by = 14 + Math.sin(a * 2) * 3, f = Math.floor(t * 4) % 8; return { x: 14, y: 14, key: f, f, bx, by }; },
    draw(g, st) { const a = st.f / 8 * TAU; VN.person(g, -5, -1, 0, VN.who(1540, { dir: 0, k: 0.75, pose: 'walk', ph: st.f / 8 })); VN.person(g, 5, 1, 0, VN.who(1541, { dir: 2, k: 0.72, pose: 'walk', ph: (st.f / 8 + 0.5) % 1 })); const b = g.p(Math.cos(a) * 4, Math.sin(a * 2) * 1.6, 0.6 + Math.abs(Math.sin(a * 2)) * 1.6); g.disc2(b, 0.8, '#F3F1EA'); g.ring2(b, 0.8, { w: 0.3 }); } });
  const Wk = (seed, pts, v, ph, o) => VN.walker(T, seed > 0 ? VN.who(seed, o) : VN.carnival(-seed, (o && o.kind) || 'gown', o), pts, v, { phase: ph });
  Wk(1550, [[5, 33], [5, -12], [26, -12], [26, 4], [34, 0]], 1.3, 0); Wk(1551, [[34, 0], [16, 0], [16, 30], [-20, 30]], 1.4, 0.4);
  Wk(1552, [[-22, -10], [-22, 22], [18, 22], [18, -10]], 1.0, 0.25, { top: '#2B2A2C', dress: '#2B2A2C', hair: '#F3F1EA', hairStyle: 'bun' });
  Wk(1553, [[30, 34], [30, -16]], 1.2, 0.6); Wk(-1554, [[-14, -4], [12, -4], [12, -12], [-14, -12]], 0.8, 0.1, { kind: 'cape' });
  const dogW = VN.who(1555, { fedora: '#3B3F47' });
  VN.walker(T, dogW, [[-18, 14], [24, 14], [24, 26], [-18, 26]], 1.1, { phase: 0.3, extra: (g, st) => { const s = st.dir === 0 || st.dir === 3 ? 1 : -1, p = g.p(0, 0, 0), d = [p[0] + s * 4.6, p[1] + 1.2]; g.line2([[p[0] + s * 1.2, p[1] - 5.6], d], { w: 0.25, c: '#3A3530', boil: false, ext: 0 }); g.fill2([[d[0] - 1.4, d[1]], [d[0] + 1.4, d[1]], [d[0] + 1.6, d[1] - 1.6], [d[0] - 1.4, d[1] - 1.6]], '#C9A26B', true); g.disc2([d[0] + s * 1.6, d[1] - 2.0], 0.8, '#C9A26B'); } });
  T.cast([-8, 6], (g) => { VN.person(g, -8.6, 5.4, 0, VN.carnival(1560, 'gown', { dir: 0, pose: 'hold' })); VN.person(g, -7.2, 6.8, 0, VN.carnival(1561, 'bauta', { dir: 0, pose: 'hold' })); const r = VN.person(g, -3.8, 7.6, 0, VN.who(1562, { dir: 2, pose: 'hold' })); const h = r.hands[0]; g.fill2([[h[0] - 1, h[1] - 1.8], [h[0] + 0.4, h[1] - 1.8], [h[0] + 0.4, h[1]], [h[0] - 1, h[1]]], '#2A2622', true); }, { name: 'selfie' });
  T.cast([10, 18], (g) => { K.bench(g, 10, 18, { face: 'L', L: 3 }); VN.person(g, 9.2, 18, 1.3, VN.who(1570, { dir: 1, pose: 'sit', hair: '#8E8A84', fedora: '#3B3F47' })); VN.person(g, 10.9, 18.1, 1.3, VN.who(1571, { dir: 1, pose: 'sit', hair: '#B9B4AC', hairStyle: 'bun', dress: '#5A4A6A' })); }, { name: 'bench' });
  T.cast([20, 4], (g) => { VN.person(g, 19.4, 3.4, 0, VN.carnival(1572, 'medico', { dir: 1, pose: 'stand' })); VN.person(g, 21.2, 4.8, 0, VN.carnival(1573, 'gown', { dir: 2, pose: 'wave', ph: 0.2 })); VN.person(g, 22.6, 2.6, 0, VN.who(1574, { dir: 2, k: 0.74, pose: 'cheer', ph: 0.4 })); }, { name: 'masks' });
  for (let i = 0; i < 6; i++) { const hx = -10 + h1(i * 2.3) * 8, hy = 12 + h1(i * 4.1) * 6; T.actor({ sample: 5, period: 3, at(t) { const f = Math.floor(t * 2 + i) % 3; return { x: hx, y: hy, key: f, f }; }, draw(g, st) { VN.pigeon(g, g.p(0, 0, 0), st.f ? 'peck' : 'stand', 0, i % 2 ? 1 : -1); } }); }
  VN.finish(T);
});
