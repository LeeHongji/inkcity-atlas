'use strict';
/* (0, 100) The Rialto market, across the Grand Canal from the Fondaco.
   - The Pescheria: the fish market's neo-gothic loggia on the canal, an open ground floor of pointed arches on
     columns where the fishmongers work at their marble counters (fish on ice, a swordfish, crabs), a steep tiled roof.
   - The Erberia: rows of fruit and vegetable stalls under red and white awnings (artichokes, radicchio, oranges,
     lemons), sellers at the stall ends calling, shoppers with bags and trolleys.
   - San Giacomo di Rialto, the oldest church in Venice, with its great 24-hour clock over a gothic portico.
   - The Fabbriche along the near side: a low arcade of shops.
   - On the rio: a delivery barge moored at the bank, a porter wheeling crates from it to the stalls.
   - Gulls on the Pescheria roof; one swoops.
   The Rialto Bridge's stairs come down here from the canal. */
SF.tile('mercato', 0, 100, { rim: 28 }, function (T) {
  const P = VN.PLASTER;
  T.ground(function (g) {
    g.boilP = 0.15;
    K.slab(g, 37, { top: VN.paveC });
    VN.pave(g, -37, -37, 37, 37, { col: '#D1CBBF', step: 2.6, ax: 'y' });
    g.fill(K.rect(36.3, -37, 37, 37), VN.istria);
    // the market's litter: crate slats, a cabbage leaf
    const lt = []; for (let i = 0; i < 30; i++) { const c = g.p(lerp(-28, 6, h1(i * 1.7)), lerp(-22, 6, h1(i * 2.3)), 0); lt.push(c[0], c[1], c[0] + 1.4, c[1] - 0.3); } g.segs2(lt, '#B9A27D', 0.4);
  }, { rim: true });

  /* ---------- the Pescheria ---------- */
  T.obj([10, -36, 36, -25], function (g) {
    g.boilP = 0.2;
    const x0 = 10, y0 = -36, x1 = 36, y1 = -25, Z1 = 6.6, Z2 = 11.2;
    // the back wall, the fishmongers at their counters, then the columns and arches in front
    K.box(g, x0, y0, x1, -29.5, 0, Z1, { t: '#E2DCCF', l: '#9E9284', r: '#8E8274' }, { w: 0.6, nohid: true });
    g.fill(K.rect(x0, -29.5, x1, y1, 0.02), '#B9B4A8');
    for (let a = x0 + 1.5, i = 0; a < x1 - 2; a += 4.2, i++) {
      VN.person(g, a + 1.6, -28.6, 0, VN.who(1400 + i, { dir: 1, pose: 'hold', top: '#F3F1EA', bot: '#3F5F8F', beanie: null, colombina: null, scarf: null, cap: '#3F5F8F' }));
      K.box(g, a, -27.6, a + 3.4, -26.2, 0, 1.9, { t: '#E9F2F4', l: '#E6E2D8', r: '#D3CCBF' }, { w: 0.5 });
      const fish = []; for (let k = 0; k < 6; k++) { const c = g.p(a + 0.4 + k * 0.5, -27.2 + (k % 2) * 0.6, 1.92); fish.push([c, k]); }
      for (const [c, k] of fish) g.fill2([[c[0] - 1.1, c[1]], [c[0] + 0.7, c[1] - 0.4], [c[0] + 1.3, c[1] - 0.9], [c[0] + 1.2, c[1] + 0.3], [c[0] + 0.7, c[1] + 0.3]], ['#A9B3BA', '#C9CFD3', '#E07A5F', '#8E979E'][(k + i) % 4], true);
    }
    const Ps = { t: '#E2DCCF', l: '#EFEAE0', r: '#DED7C9' };
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
      const n = Math.round((a1 - a0) / 3.0);
      for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); const pt = K.pt(f, p, a, 0), A = f === 'L' ? [a - 0.35, p - 0.35] : [p - 0.35, a - 0.35]; K.box(g, A[0], A[1], A[0] + 0.7, A[1] + 0.7, 0, Z1 - 1.2, Ps, { w: 0.5, nohid: true }); void pt; }
      for (let i = 0; i < n; i++) { const a = lerp(a0, a1, i / n), b = lerp(a0, a1, (i + 1) / n), m = (a + b) / 2, hw = (b - a) / 2 - 0.35, pts = [K.pt(f, p, a + 0.35, Z1 - 1.2)]; for (let k = 0; k <= 8; k++) { const t = 1 - 2 * k / 8; pts.push(K.pt(f, p, m - t * hw, Z1 - 1.2 + (1.5) * Math.pow(1 - Math.abs(t), 0.6))); } pts.push(K.pt(f, p, b - 0.35, Z1 - 1.2), K.pt(f, p, b - 0.35, Z1), K.pt(f, p, a + 0.35, Z1)); g.fill(pts, Ps.l); }
    }
    K.box(g, x0, y0, x1, y1, Z1, Z2, { t: '#E2DCCF', l: '#EFE3D2', r: '#DDCDB8' }, { w: 0.85, nb: true });
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) for (let a = a0 + 1.2; a < a1 - 1.5; a += 2.2) VN.win(g, f, p + 0.02, a, a + 1.0, Z1 + 1.0, Z1 + 3.6, { arch: 'gothic', sh: null, pane: '#55606A', lit: 0.45 });
    // at night lanterns hang in the loggia's arches; the ones on the canal shine in it
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) { const n = Math.round((a1 - a0) / 3.0); for (let i = 1; i < n; i += 3) { const a = lerp(a0, a1, (i + 0.5) / n); VN.glowDry(g, 'lantern', ...K.pt(f, p - 0.4, a, Z1 - 1.6), { r: 1.1, col: '#FFC77E' }); } }
    K.gable(g, x0 - 0.5, y0 - 0.5, x1 + 0.5, y1 + 0.5, Z2, 4.2, 'x', { a: VN.roof, b: shade(VN.roof, 0.12), e: '#EFE3D2' }, { c: '#7A3A28' });
    { const i0 = g.cmds.length; K.sign(g, 'L', y1 + 0.05, x0 + 6, x1 - 6, Z1 - 0.2, Z1 + 0.6, '#EFEAE0', 'PESCHERIA', { ink: '#7A3A28' }); g.mark({ nc: '#F2E2C0' }, i0); }
  }, { name: 'pescheria' });

  /* ---------- San Giacomo di Rialto with its clock ---------- */
  T.obj([-30, 6, -19, 17], function (g) {
    g.boilP = 0.2;
    K.box(g, -30, 6, -19, 17, 0, 9.5, { t: '#E2D5C2', l: '#E8C2A6', r: '#D9B092' }, { w: 0.85 });
    K.gable(g, -30.4, 5.6, -18.6, 17.4, 9.5, 3.4, 'y', { a: VN.roof, b: shade(VN.roof, 0.12), e: '#E8C2A6' }, { c: '#7A3A28' });
    // the great clock: a blue 24-hour dial, gold
    const c = g.p(-18.98, 11.5, 7.0); g.fill2(arcPts(c[0], c[1], 6.0, 0, TAU, 20).map((q) => [q[0], c[1] + (q[1] - c[1]) * 1.25 + (q[0] - c[0]) * 0.52]), '#F3EFE6', true);
    g.fill2(arcPts(c[0], c[1], 4.8, 0, TAU, 20).map((q) => [q[0], c[1] + (q[1] - c[1]) * 1.25 + (q[0] - c[0]) * 0.52]), '#2F4F8F', true);
    const st = []; for (let i = 0; i < 24; i++) { const a = TAU * i / 24, r1 = 3.6, r2 = 4.4; st.push(c[0] + Math.cos(a) * r1, c[1] + (Math.sin(a) * 1.25 + Math.cos(a) * 0.52) * r1, c[0] + Math.cos(a) * r2, c[1] + (Math.sin(a) * 1.25 + Math.cos(a) * 0.52) * r2); } g.segs2(st, C.gold, 0.45);
    g.line2([c, [c[0] - 1.8, c[1] - 2.4]], { w: 0.55, c: C.gold, boil: false, ext: 0 });
    g.mark({ nc: (cc) => (cc === '#F3EFE6' ? '#F0DDB4' : cc === '#2F4F8F' ? '#3F67B8' : undefined) }, 0); g.glow('lantern', -18.4, 11.5, 7.0, { r: 2.4, col: '#FFDDA0' });   // the clock lit at night
    // the gothic portico in front (posts and a lean-to roof)
    const po = []; for (let a = 7; a < 17; a += 2.4) { const b = g.p(-17.2, a, 0), t = g.p(-17.2, a, 4.0); po.push(b[0], b[1], t[0], t[1]); } g.segs2(po, '#8A6440', 0.7);
    g.fill([[-19, 6.2, 4.6], [-19, 16.8, 4.6], [-16.6, 16.8, 3.9], [-16.6, 6.2, 3.9]], VN.roof); g.outline([[-19, 6.2, 4.6], [-19, 16.8, 4.6], [-16.6, 16.8, 3.9], [-16.6, 6.2, 3.9]], { w: 0.5, boil: false, c: '#7A3A28' });
    // a little bell gable
    K.box(g, -26, 8.5, -24, 10.5, 12.9, 15.4, { t: '#E2D5C2', l: '#E8C2A6', r: '#D9B092' }, { w: 0.5 }); g.disc2(g.p(-25, 10.5, 14.0), 0.6, '#7A6A3E');
  }, { name: 'san giacomo' });

  /* ---------- the Erberia: stalls ---------- */
  const goods = [['#E6C24F', '#8FBF73', '#E0623F'], ['#7A2E5A', '#C9463E', '#8FBF73'], ['#E8862F', '#E6C24F', '#F3E3A0'], ['#8FBF73', '#5E8A3E', '#A4C66B'], ['#C9463E', '#7A2E5A', '#E8862F']];
  let si = 0;
  for (const y of [-19, -8]) for (const x of [-26, -16, -6]) {
    const k = si++, aw = k % 2 ? '#C9463E' : '#F3F1EA', gd = goods[k % goods.length];
    T.obj([x - 3.6, y - 2.4, x + 3.6, y + 2.4], function (g) {
      g.boilP = 0.2;
      K.box(g, x - 3.4, y - 2.0, x + 3.4, y + 1.6, 0, 2.2, { t: '#B8875A', l: '#9C7450', r: '#8A6440' }, { w: 0.5 });
      // crates of produce on the slanted counter top
      const i0 = g.cmds.length;
      for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { const c = g.p(x - 2.8 + i * 1.12, y - 1.4 + j * 1.6, 2.25 + j * 0.2); const col = gd[(i + j) % 3]; g.disc2([c[0] - 0.5, c[1]], 0.75, col); g.disc2([c[0] + 0.5, c[1] - 0.2], 0.75, shade(col, 0.1)); g.disc2([c[0], c[1] + 0.3], 0.7, col); }
      g.mark({ nc: (c) => mix(c, nightColour(c), 0.4) }, i0);                                                  // at night the produce glows under the stall's bulb
      // the awning on poles, stripes
      const zt = 6.6, zb = 5.6, pts = [[x - 3.8, y - 2.6, zt], [x + 3.8, y - 2.6, zt], [x + 3.8, y + 2.6, zb], [x - 3.8, y + 2.6, zb]];
      const posts = []; for (const [px, py] of [[x - 3.4, y + 2.2], [x + 3.4, y + 2.2], [x + 3.4, y - 2.2]]) { const b = g.p(px, py, 0), t = g.p(px, py, zb + 0.4); posts.push(b[0], b[1], t[0], t[1]); } g.segs2(posts, '#5E4A3C', 0.5);
      g.fill(pts, aw);
      if (aw !== '#F3F1EA') { const st = []; for (let i = 1; i < 6; i += 2) { const a = lerp(x - 3.8, x + 3.8, i / 6), b2 = lerp(x - 3.8, x + 3.8, (i + 1) / 6); st.push([[a, y - 2.6, zt], [b2, y - 2.6, zt], [b2, y + 2.6, zb], [a, y + 2.6, zb]]); } for (const q of st) g.fill(q, '#F3F1EA'); }
      g.outline(pts, { w: 0.5, boil: false, c: shade(aw, 0.4) });
      g.glow('lantern', x, y + 2.5, zb - 0.6, { r: 1.1, col: '#FFE0A0' });                              // a bulb hung from the awning's front at night
      const vf = []; for (let i = 0; i <= 8; i++) { const a = g.p(lerp(x - 3.8, x + 3.8, i / 8), y + 2.6, zb), b2 = g.p(lerp(x - 3.8, x + 3.8, (i + 0.5) / 8), y + 2.6, zb - 0.5); vf.push(a[0], a[1], b2[0], b2[1]); } g.segs2(vf, shade(aw, 0.3), 0.4);
    }, { name: 'stall' });
    // the seller at the stall's end
    T.cast([x + 4.4, y - 0.4], (g) => VN.person(g, x + 4.4, y - 0.4, 0, VN.who(1420 + k, { dir: k % 2 ? 1 : 2, pose: k % 3 ? 'hold' : 'wave', ph: 0.25, colombina: null, top: ['#3F5F8F', '#5A4A3C', '#7A2E35'][k % 3] })), { name: 'seller' });
  }
  // the Fabbriche: a low arcade of shops along the near side (the Rialto's stairs come down to the left of it)
  T.obj([10, 28, 37, 37], function (g) {
    g.boilP = 0.2;
    K.box(g, 10, 28, 37, 37, 0, 8.6, { t: '#D9CDB8', l: '#E3C9A8', r: '#D3B795' }, { w: 0.9 });
    // the arcade's shops are lit at night and throw their light out on the paving
    for (let a = 10.8; a < 36; a += 2.6) { g.fill(VN.archPts('L', 37.01, a, a + 1.9, 0, 4.0, 'round', 0), '#5E4E42'); g.mark({ nc: '#C98A4E', spill: true }); }
    for (let a = 11.2; a < 36; a += 2.6) VN.win(g, 'L', 37.02, a, a + 1.1, 5.0, 7.4, { sh: VN.shutter, pane: '#55606A' });
    for (let a = 28.8; a < 36.5; a += 2.6) { g.fill(VN.archPts('R', 37.01, a, a + 1.9, 0, 4.0, 'round', 0), '#5E4E42'); g.mark({ nc: '#C98A4E', spill: true }); }
    K.hip(g, 9.6, 27.6, 37.4, 37.4, 8.6, 2.2, VN.roof, { ridge: 18, c: '#7A3A28' });
    VN.chimney(g, 16, 31, 9.6); VN.chimney(g, 30, 31, 9.6);
  }, { name: 'fabbriche' });
  for (const [x, y] of [[-34, 26], [-12, 30]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.4, h: 5, col: '#97A774' }), { name: 'tree' });
  T.obj([-24, 34], (g) => VN.lamp(g, -24, 34, {}), { name: 'lamp' });
  T.obj([-37, 18, -28, 37], (g) => VN.house(g, { x0: -37, y0: 18, x1: -28, y1: 37, n: 3, col: P[0], chim: [[-33, 24], [-33, 32]], shopL: [-36, -30, '#3E5A44', 'FRUTTA'] }), { name: 'house' });

  /* ---------- the moored barge and the porter ---------- */
  T.obj([37.6, 7, 41.0, 17], (g) => g.at(39.3, 12, VN.WL, (g2) => VN.drawBoat(g2, 'topo', Math.PI / 2, -99, 99, { seed: 1460, who: VN.who(1460, { top: '#3F5F8F', beanie: '#C9463E', colombina: null }) })), { name: 'moored topo' });
  T.obj([37.4, 18], (g) => VN.palina(g, 37.4, 18, { c1: '#3E5A44' }), { name: 'palina' });
  const porter = VN.who(1461, { top: '#5A4A3C', beanie: '#3B3F47', colombina: null, scarf: null });
  T.actor({ sample: 0.25, period: 30,
    at(t) {
      const u = (t % 30) / 30, A = [33, 12], B = [0, -2], C2 = [0, -12];
      let x, y, dir, load;
      if (u < 0.45) { const k = u / 0.45; x = lerp(A[0], B[0], k); y = lerp(A[1], B[1], k); dir = 2; load = 1; }
      else if (u < 0.55) { const k = (u - 0.45) / 0.1; x = B[0]; y = lerp(B[1], C2[1], k); dir = 3; load = 1; }
      else { const k = (u - 0.55) / 0.45; x = lerp(C2[0], A[0], k); y = lerp(C2[1], A[1], k); dir = 0; load = 0; }
      const ph = Math.floor((t * 1.6 / 2.4) % 1 * 8) / 8;
      return { x, y, dir, ph, load, key: dir + '.' + ph + '.' + load };
    },
    draw(g, st) {
      const r = VN.person(g, 0, 0, 0, Object.assign({}, porter, { dir: st.dir, pose: 'walk', ph: st.ph }));
      // a two-wheeled hand truck pushed ahead of him: the frame from his hands down to the wheels, crates on it
      const s = st.dir === 0 || st.dir === 3 ? 1 : -1, F = g.p(0, 0, 0), h = r.hands[0], wh = [F[0] + s * 4.6, F[1] - 1.0];
      if (st.load) for (let k = 0; k < 2; k++) { const c = [lerp(wh[0], h[0], 0.18 + k * 0.3) + s * 0.6, lerp(wh[1], h[1], 0.18 + k * 0.3) - 1.0]; g.fill2([[c[0] - 1.8, c[1] + 1.0], [c[0] + 1.8, c[1] + 1.0], [c[0] + 1.8, c[1] - 1.6], [c[0] - 1.8, c[1] - 1.6]], '#C9A26B', true); g.disc2([c[0] - 0.7, c[1] - 1.8], 0.75, k ? '#8FBF73' : '#E8862F'); g.disc2([c[0] + 0.7, c[1] - 1.8], 0.75, k ? '#E6C24F' : '#C9463E'); }
      g.line2([h, wh], { w: 0.5, c: '#3A3530', boil: false, ext: 0 }); g.line2([[h[0] - s * 0.8, h[1] + 0.4], [wh[0] - s * 0.8, wh[1] + 0.4]], { w: 0.4, c: '#3A3530', boil: false, ext: 0 });
      g.fill2(arcPts(wh[0], wh[1] + 0.2, 1.1, 0, TAU, 10).map((q) => [q[0], wh[1] + 0.2 + (q[1] - wh[1] - 0.2) * 1.1]), '#2A2622', true);
    } });

  /* ---------- shoppers, gulls ---------- */
  const Wk = (seed, pts, v, ph, o) => VN.walker(T, seed > 0 ? VN.who(seed, o) : VN.carnival(-seed, (o && o.kind) || 'gown', o), pts, v, { phase: ph });
  Wk(1470, [[-30, -13.5], [4, -13.5]], 1.1, 0); Wk(1471, [[4, -2.6], [-30, -2.6]], 1.0, 0.3); Wk(1472, [[-30, -13], [4, -13]], 1.2, 0.6);
  Wk(1473, [[-10, 26], [-10, -24], [8, -24], [8, 22]], 1.3, 0.2); Wk(-1474, [[-14, 20], [6, 20], [6, 4], [-14, 4]], 0.9, 0.5, { kind: 'volto' }); Wk(1475, [[24, -20], [24, 20]], 1.4, 0.4);
  Wk(1476, [[30, 2], [-34, 2]], 1.3, 0.8); Wk(1477, [[-4, -24], [-4, 24]], 1.2, 0.1);
  T.cast([-11, -2], (g) => { VN.person(g, -11.6, -2.6, 0, VN.who(1480, { dir: 3, pose: 'hold', hair: '#8E8A84' })); VN.person(g, -10.2, -1.6, 0, VN.who(1481, { dir: 3, k: 0.72 })); }, { name: 'shoppers' });
  T.cast([-21, -2], (g) => VN.person(g, -21, -2.4, 0, VN.who(1482, { dir: 2, pose: 'hold' })), { name: 'shopper' });
  for (let i = 0; i < 3; i++) T.actor({ sample: 0.3, period: 14, layer: i === 2 ? 'top' : '',
    at(t) {
      if (i < 2) { const f = Math.floor((t + i * 3) / 2) % 3; return { x: 16 + i * 8, y: -29, z: 13.8, key: 's' + f, f, fly: 0 }; }
      const u = (t % 14) / 14, a = u * TAU; return { x: 18 + Math.cos(a) * 16, y: -14 + Math.sin(a) * 10, z: 15 + Math.sin(a * 2) * 2, key: 'f' + Math.floor(t * 6) % 4 + (Math.sin(a) > 0 ? 'r' : 'l'), f: Math.floor(t * 6) % 4, fly: 1, fl: -Math.sin(a) > 0 ? 1 : -1 };
    },
    draw(g, st) {
      const p = g.p(0, 0, 0);
      if (st.fly) { const up = [-3, -1, 1, -1][st.f]; g.fill2([[p[0] - 1.6, p[1]], [p[0] + 1.8, p[1] - 0.3], [p[0] + 0.4, p[1] + 0.8]], '#F3F1EA', true); g.fill2([[p[0] - 0.4, p[1]], [p[0] + 0.6, p[1]], [p[0] - 1.2 * st.fl, p[1] + up * 1.4 - 1.2]], '#D6D9DC', true); g.fill2([[p[0], p[1]], [p[0] + 0.8, p[1]], [p[0] + 1.6 * st.fl, p[1] + up]], '#C9CDD1', true); g.disc2([p[0] + 1.8 * st.fl, p[1] - 0.6], 0.6, '#F3F1EA'); g.segs2([p[0] + 2.2 * st.fl, p[1] - 0.6, p[0] + 2.9 * st.fl, p[1] - 0.4], '#E6C24F', 0.4); }
      else { g.fill2([[p[0] - 1.8, p[1] - 1.2], [p[0] + 1.2, p[1] - 2.4], [p[0] + 1.4, p[1] - 1.0], [p[0], p[1] - 0.2]], '#F3F1EA', true); g.fill2([[p[0] - 1.8, p[1] - 1.2], [p[0] - 0.2, p[1] - 1.9], [p[0] - 0.6, p[1] - 0.9]], '#9AA0A6', true); g.disc2([p[0] + 1.4, p[1] - 2.6 + (st.f === 1 ? 0.6 : 0)], 0.65, '#F3F1EA'); g.segs2([p[0] + 1.9, p[1] - 2.6, p[0] + 2.6, p[1] - 2.4], '#E6C24F', 0.4); }
    } });
  VN.finish(T);
});
