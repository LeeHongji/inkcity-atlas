'use strict';
/* (-100, 100) A squero: one of the last boatyards where gondolas are built and mended.
   - The squero's houses look like mountain chalets (the craftsmen came from the Dolomites): white plaster below,
     dark timber above, a long wooden balcony full of geraniums, broad eaves.
   - The slipway: a stone ramp sloping down into the rio, gondolas on trestles keel-up being scraped and tarred black,
     one on its side being varnished; planks, oars, a forcola on a bench. Every half minute the men launch a mended
     gondola: it slides down the slipway into the rio, floats, and is hauled back up.
   - Around it, a quiet corner: washing over a calle, a woman at her window, a man fishing from the fondamenta, a
     little sandolo moored with its oars shipped. */
SF.tile('squero', -100, 100, { rim: 32 }, function (T) {
  const P = VN.PLASTER, WL = VN.WL, SX0 = 12, SY0 = 7, SY1 = 31;
  const slope = (x) => x <= SX0 ? 0 : WL * (x - SX0) / (37 - SX0);
  T.ground(function (g) {
    g.boilP = 0.15;
    K.slab(g, 37, { top: VN.paveC });
    VN.pave(g, -37, -37, 37, 37, { col: '#D2CDC2', step: 2.4 });
    g.fill(K.rect(36.3, -37, 37, SY0), VN.istria); g.fill(K.rect(36.3, SY1, 37, 37), VN.istria); g.fill(K.rect(-37, 36.3, 37, 37), VN.istria);
    // the slipway cut into the bank: its far side wall, the sloping floor of worn stones and timbers
    g.fill([[SX0, SY0, 0], [37, SY0, 0], [37, SY0, WL]], '#B59479');
    g.fill([[SX0, SY0, 0], [37, SY0, WL], [37, SY1, WL], [SX0, SY1, 0]], '#B9A88E');
    const tb = []; for (let x = SX0 + 1.5; x < 37; x += 2.2) { const a = g.p(x, SY0, slope(x)), b = g.p(x, SY1, slope(x)); tb.push(a[0], a[1], b[0], b[1]); } g.segs2(tb, '#8E7A60', 0.45);
    g.scuff([[SX0, SY0, 0], [37, SY0, WL], [37, SY1, WL], [SX0, SY1, 0]], { dir: Math.atan2(AY, AX), len: 2.4, c: '#A3927A', dens: 0.5, w: 0.5 });
    g.line([[SX0, SY0, 0], [37, SY0, WL]], { w: 0.6, boil: false }); g.line([[SX0, SY1, 0], [SX0, SY0, 0]], { w: 0.5, boil: false });
    // the water lapping at the slipway's foot
    g.fill([[33, SY0, WL + 0.02], [37, SY0, WL + 0.02], [37, SY1, WL + 0.02], [33, SY1, WL + 0.02]], VN.water);
  }, { rim: true });
  VN.finish(T);
  const H = (d, nm) => T.obj([d.x0, d.y0, d.x1, d.y1], (g) => VN.house(g, d), { name: nm || 'house' });

  /* ---------- the chalet-like squero houses ---------- */
  const chalet = (x0, y0, x1, y1, nm) => T.obj([x0, y0, x1, y1], function (g) {
    g.boilP = 0.22;
    const WD = { t: '#7A5A3C', l: '#8A6440', r: '#6E5034' };
    K.box(g, x0, y0, x1, y1, 0, 4.6, { t: '#EDE8DD', l: '#F3EFE6', r: '#E2DCCF' }, { w: 0.85 });
    VN.door(g, 'R', x1, y0 + 2, y0 + 4.6, 3.6, { col: '#5A3E2E' }); VN.win(g, 'R', x1, y1 - 4, y1 - 2.6, 1.4, 3.2, { sh: VN.shutterB });
    K.box(g, x0, y0, x1, y1, 4.6, 9.4, WD, { w: 0.85 });
    const pl = []; for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) for (let a = a0 + 0.6; a < a1; a += 0.6) { const A = g.p.apply(g, K.pt(f, p + 0.01, a, 4.7)), B = g.p.apply(g, K.pt(f, p + 0.01, a, 9.3)); pl.push(A[0], A[1], B[0], B[1]); }
    g.segs2(pl, '#5E4228', 0.3);
    for (let a = y0 + 1.2; a < y1 - 1; a += 3) VN.win(g, 'R', x1 + 0.02, a, a + 1.4, 5.6, 8.0, { sh: '#3E5A44', frameCol: '#C9A26B', sill: false });
    // the long balcony with geraniums
    K.box(g, x1, y0 + 0.4, x1 + 1.3, y1 - 0.4, 5.0, 5.3, WD, { w: 0.45, nohid: true });
    const bl = []; for (let a = y0 + 0.5; a < y1 - 0.4; a += 0.45) { const A = g.p(x1 + 1.3, a, 5.3), B = g.p(x1 + 1.3, a, 6.5); bl.push(A[0], A[1], B[0], B[1]); } g.segs2(bl, '#5E4228', 0.4);
    g.line([[x1 + 1.3, y0 + 0.4, 6.5], [x1 + 1.3, y1 - 0.4, 6.5]], { w: 0.45, boil: false, c: '#3E2A18' });
    K.blooms(g, x1 + 0.3, y0 + 0.6, x1 + 1.2, y1 - 0.6, 6.0, ['#C9463E', '#E0623F', '#C9463E', '#F3F1EA'], { sp: 0.8, r: 0.95 });
    K.gable(g, x0 - 1.4, y0 - 0.8, x1 + 2.0, y1 + 0.8, 9.4, 3.6, 'y', { a: '#8C6A4A', b: '#7A5A3C', e: '#8A6440' }, { c: '#4A3420' });
  }, { name: nm });
  chalet(-30, -30, -16, -12, 'squero chalet');
  chalet(-14, -34, -2, -22, 'squero chalet 2');
  // a timber shed open on its slipway side
  T.obj([-2, 6, 10, 32], function (g) {
    K.box(g, -2, 6, 0, 32, 0, 7, { t: '#7A5A3C', l: '#8A6440', r: '#6E5034' }, { w: 0.7 });
    const ps = []; for (let y = 7; y < 32; y += 4) { const A = g.p(9.6, y, 0), B = g.p(9.6, y, 6.2); ps.push(A[0], A[1], B[0], B[1]); } g.segs2(ps, '#5E4228', 0.8);
    // oars and a forcola on the back wall, planks stacked
    for (let i = 0; i < 4; i++) { const A = g.p(0.05, 10 + i * 1.2, 0.5), B = g.p(0.05, 12 + i * 1.2, 6.2); g.line2([A, B], { w: 0.45, c: '#A07A50', boil: false, ext: 0 }); }
    K.box(g, 1, 24, 4, 30, 0, 1.4, { t: '#C9A26B', l: '#B58F5E', r: '#A07A50' }, { w: 0.45 });
    for (const y of [11, 23]) g.glow('lamp', 9.4, y, 5.6, { r: 1.1 });                                 // work lamps hung under the eave at night
    K.gable(g, -2.6, 5.4, 10.4, 32.6, 7, 3, 'y', { a: '#8C6A4A', b: '#7A5A3C', e: '#8A6440' }, { c: '#4A3420' });
  }, { name: 'shed' });

  /* ---------- gondolas being mended on the slipway ---------- */
  const keelUp = (x, y, ang) => T.obj([x - 1.6, y - 6.4, x + 1.6, y + 6.4], function (g) {
    const z = slope(x);
    for (const s of [-4, 0, 4]) { const a = g.p(x - 1, y + s, z), b = g.p(x + 1, y + s, z); const ta = g.p(x - 1, y + s, z + 1.6), tb = g.p(x + 1, y + s, z + 1.6); g.line2([a, ta], { w: 0.5, c: '#6E5034', boil: false, ext: 0 }); g.line2([b, tb], { w: 0.5, c: '#6E5034', boil: false, ext: 0 }); }
    // the hull upside down: a long black curve on the trestles
    const pts = []; for (let i = 0; i <= 16; i++) { const u = lerp(-6, 6, i / 16), w = 0.9 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u) / 6, 2.2)), 0.55); pts.push([x, y + u, z + 1.6 + w * 1.2 + 0.4 * Math.pow(Math.abs(u) / 6, 4) * 3]); }
    const lo = pts.map((p, i) => { const u = lerp(-6, 6, i / 16); const w = 0.9 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u) / 6, 2.2)), 0.55); return [x + w, p[1], z + 1.6]; });
    g.fill(lo.concat(pts.slice().reverse()), '#2B282A'); g.fill(pts.map((p, i) => [x - lo[i][0] + x, p[1], z + 1.6]).concat(pts.slice().reverse()), '#3B3436');
    g.line(pts, { w: 0.6, boil: false, c: '#1F1C1D' }); g.line(lo, { w: 0.5, boil: false, c: '#1F1C1D' });
    void ang;
  }, { name: 'gondola on trestles' });
  keelUp(19, 15, 0); keelUp(25, 24, 0);
  // the craftsmen: scraping, tarring with a long brush
  T.actor({ sample: 5, period: 2,
    at(t) { const f = Math.floor(t * 3) % 4; return { x: 21.6, y: 18.4, z: slope(21.6), key: f, f }; },
    draw(g, st) { const r = VN.person(g, 0, 0, 0, VN.who(1900, { dir: 3, pose: 'hold', top: '#5A4A3C', bot: '#3B3F47', beanie: '#C9463E', colombina: null, scarf: null, hands: [[-3 + st.f * 0.7, -10], [-1 + st.f * 0.7, -9]] })), h = r.hands[0]; g.line2([h, [h[0] - 2.4, h[1] + 2.6]], { w: 0.5, c: '#7A5A3C', boil: false, ext: 0 }); g.disc2([h[0] - 2.4, h[1] + 2.6], 0.6, '#1F1C1D'); } });
  T.actor({ sample: 5, period: 2,
    at(t) { const f = Math.floor(t * 2.5) % 4; return { x: 27.4, y: 21, z: slope(27.4), key: f, f }; },
    draw(g, st) { VN.person(g, 0, 0, 0, VN.who(1901, { dir: 2, pose: 'hold', top: '#3F5F8F', bot: '#5A4A3C', fedora: '#5A4A3C', colombina: null, scarf: null, hands: [[-2 + (st.f % 2) * 1.2, -9.4], [-0.4 + (st.f % 2) * 1.2, -8.6]] })); } });
  T.cast([6, 20], (g) => { K.bench(g, 6, 20, { face: 'R', L: 3 }); VN.person(g, 6, 20, 1.3, VN.who(1902, { dir: 0, pose: 'sit', hair: '#8E8A84', top: '#5A4A3C', colombina: null })); const p = g.p(6.4, 22.2, 1.4); g.fill2([[p[0] - 1, p[1]], [p[0] + 1.6, p[1] - 0.4], [p[0] + 1.2, p[1] - 2.6], [p[0] + 0.2, p[1] - 2.0]], '#A07A50', true); }, { name: 'forcola maker' });
  // the launch: every 30 s a mended gondola slides down the slipway, floats, and is hauled back up
  T.actor({ sample: 0.25, period: 30, grow: false,
    at(t) {
      const u = (t % 30) / 30; let x;
      if (u < 0.15) x = 14; else if (u < 0.3) x = lerp(14, 31, smooth((u - 0.15) / 0.15)); else if (u < 0.55) x = 31 + Math.sin((u - 0.3) * 25) * 0.3; else if (u < 0.95) x = lerp(31, 14, smooth((u - 0.55) / 0.4)); else x = 14;
      const z = Math.max(slope(Math.min(37, x + 5)), WL);
      return { x: x + 6, y: 27.5, z: x > 26 ? WL : z, key: (x > 26 ? 'w' : 's') + Math.round(x * 2), xx: x };
    },
    draw(g, st) {
      const tilt = st.xx > 33 ? 0 : -0.06;
      const F = VN.frame(0); void F; void tilt;
      g.at(-6, 0, 0, (g2) => VN.drawBoat(g2, 'gondola', 0, -99, 99, { empty: true, moored: true }));
    } });
  for (let i = 0; i < 2; i++) T.actor({ sample: 0.25, period: 30,
    at(t) {
      const u = (t % 30) / 30; let x;
      if (u < 0.55) x = 13 + i * 2; else if (u < 0.95) x = lerp(31, 13 + i * 2, smooth((u - 0.55) / 0.4)); else x = 13 + i * 2;
      const pull = u >= 0.55 && u < 0.95, ph = pull ? Math.floor(t * 3) % 8 / 8 : 0;
      return { x, y: 25.4 + i * 1.2, z: slope(x), key: (pull ? 'p' : 's') + ph, pull, ph };
    },
    draw(g, st) { const r = VN.person(g, 0, 0, 0, VN.who(1905 + i, { dir: 2, pose: st.pull ? 'walk' : 'stand', ph: st.ph, top: i ? '#7A2E35' : '#3E5A44', colombina: null, scarf: null })); if (st.pull) { const h = r.hands[0]; g.line2([h, [h[0] + 9, h[1] + 4]], { w: 0.3, c: '#C9A26B', boil: false, ext: 0 }); } } });

  /* ---------- the quiet corner ---------- */
  H({ x0: -37, y0: -8, x1: -26, y1: 8, n: 3, col: P[4], chim: [[-32, -3]], flowers: ['#C9463E', '#E6C24F'] });
  H({ x0: -37, y0: 10, x1: -24, y1: 24, n: 3, col: P[7], chim: [[-31, 15], [-31, 20, 'square']], altana: [-30, 17, { wash: ['#F3F1EA', '#C9463E', '#F3F1EA', '#5F8FC9'] }] });
  H({ x0: 4, y0: -37, x1: 18, y1: -26, n: 3, col: P[0], chim: [[10, -32]] });
  H({ x0: 18, y0: -37, x1: 37, y1: -26, n: 4, col: P[6], chim: [[24, -32], [32, -31]], shopL: [20, 28, '#3E5A44', 'OSTERIA'] });
  T.obj([-24, 30], (g) => K.tree(g, -24, 30, { r: 3.2, h: 4.8, col: '#97A774' }), { name: 'tree' });
  T.obj([-8, 32], (g) => VN.lamp(g, -8, 32, {}), { name: 'lamp' });
  T.cast([-14, 35.2], function (g) {
    const r = VN.person(g, -14, 35.2, 0, VN.who(1910, { dir: 1, pose: 'hold', fedora: '#5A4A3C', colombina: null, hands: [[-2, -9], [-1, -8]] })), h = r.hands[0], tip = [h[0] - 8, h[1] + 9];
    g.line2([h, tip], { w: 0.4, c: '#4A3A2C', boil: false, ext: 0 }); const wl = g.p(-17, 41, WL); g.fine2([tip, wl], { w: 0.2, c: '#6E6A60' });
  }, { name: 'angler' });
  T.obj([-30, 37.6, -22, 39.4], (g) => g.at(-26, 38.5, WL, (g2) => VN.drawBoat(g2, 'sandolo', Math.PI, -99, 99, { who: null, riders: null, ph: 0, moored: true })), { name: 'moored sandolo' });
  const Wk = (seed, pts, v, ph, o) => VN.walker(T, seed > 0 ? VN.who(seed, o) : VN.carnival(-seed, (o && o.kind) || 'gown', o), pts, v, { phase: ph });
  Wk(1920, [[-20, 34], [-4, 34], [-4, -6], [-20, -6]], 1.2, 0); Wk(1921, [[24, -6], [-10, -6], [-10, -20]], 1.3, 0.4); Wk(-1922, [[-6, 4], [-6, 30], [-20, 30]], 0.9, 0.6, { kind: 'cape' });
});
