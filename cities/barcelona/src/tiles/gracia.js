'use strict';
/* (-100,0) Vila de Gràcia: the old village swallowed by the city — a tight weave of narrow lanes and low houses round
   little squares, out late with a drink.
   Built: a grid of lanes (3 u) between small blocks of three- and four-storey houses in ochre, rose and cream, with
   shutters, balconies, flags; strings of festival pennants across the lanes. Plaça de la Vila in the middle with its
   clock tower (the Torre del Rellotge: a slim ochre shaft, clock faces, an open belfry with its bell, a little
   pyramid roof); Plaça del Sol on the right with café terraces; on the near corner Casa Vicens, Gaudí's first house,
   in green-and-white chequered tile with little turrets, behind its palm-leaf iron railing.
   Who: people at the terrace tables, kids kicking a football in Plaça del Sol, a guitarist on a bench with friends,
   neighbours chatting under the tower, a grandmother with her shopping trolley, a dog. What moves: the kids and the
   ball, walkers in the lanes, the dog trotting after its owner, the bell swinging on the hour (every 20 s here). */
SF.tile('gracia', -100, 0, { rim: 18 }, function (T) {
  const COLS = ['#E8C49A', '#EBCFB0', '#E6B89C', '#F0DFC2', '#E2C08E', '#EAD4B8', '#DDB49A'];
  T.ground(function (g) {
    BC.ground(g, '#E1D7C3');
    g.scuff(K.rect(-37, -37, 37, 37), { dir: -0.6, len: 2.4, c: '#ECE4D4', dens: 0.45, w: 0.45, spread: 0.6 });
    // Plaça de la Vila and Plaça del Sol: warm paving in squares
    for (const r of [[-11.5, -11.5, 13.5, 13.5], [16.5, -11.5, 36, 13.5]]) { const p = K.rect(r[0], r[1], r[2], r[3]); g.fill(p, '#E8DABC'); const jt = []; for (let a = r[0]; a <= r[2]; a += 3) { const q = g.p(a, r[1], 0), w = g.p(a, r[3], 0); jt.push(q[0], q[1], w[0], w[1]); } for (let a = r[1]; a <= r[3]; a += 3) { const q = g.p(r[0], a, 0), w = g.p(r[2], a, 0); jt.push(q[0], q[1], w[0], w[1]); } g.segs2(jt, '#D6C5A2', 0.25); }
    // Casa Vicens's garden
    const gd = [[18, 18, 0], [37, 18, 0], [37, 27, 0], [27, 37, 0], [18, 37, 0]]; g.fill(gd, '#BCD093'); g.grass(gd, { dens: 0.7 });
  }, { rim: true });

  const HOUSE = (poly, z, seed, o) => T.obj(BC.bbox(poly), (g) => BC.house(g, Object.assign({ poly, z, seed, gf: 3.8, fl: 2.9, bay: 2.3, col: COLS[seed % COLS.length], flags: 0.3, closedP: 0.2, tiled: poly.length === 4 && seed % 3 === 0 }, o || {})), { name: 'house' });
  // far blocks (taller), then the sides, then the low near ones
  HOUSE([[-37, -27], [-27, -37], [-25, -37], [-25, -14.5], [-37, -14.5]], 13.5, 101);
  HOUSE([[-24, -37], [-14.5, -37], [-14.5, -14.5], [-24, -14.5]], 12.5, 102);
  HOUSE([[-11.5, -37], [1, -37], [1, -14.5], [-11.5, -14.5]], 13, 103);
  HOUSE([[2, -37], [13.5, -37], [13.5, -14.5], [2, -14.5]], 12, 104);
  HOUSE([[16.5, -37], [27, -37], [37, -27], [37, -14.5], [16.5, -14.5]], 12.5, 105);
  HOUSE([[-37, -11.5], [-14.5, -11.5], [-14.5, 1], [-37, 1]], 11.5, 106);
  HOUSE([[-37, 2], [-14.5, 2], [-14.5, 13.5], [-37, 13.5]], 12, 107);
  HOUSE([[-37, 16.5], [-14.5, 16.5], [-14.5, 37], [-27, 37], [-37, 27]], 9.5, 108);
  HOUSE([[-11.5, 16.5], [1, 16.5], [1, 37], [-11.5, 37]], 9, 109);
  HOUSE([[2, 16.5], [13.5, 16.5], [13.5, 37], [2, 37]], 9.5, 110);
  // pennants over the lanes
  T.obj([-14.5, -13.5, 37, -12.5], (g) => { BC.bunting(g, [-14.5, -13, 11], [13.5, -13, 11], 14); BC.bunting(g, [16.5, -13, 11], [37, -13, 11], 10, [BP.yellow, BP.red]); }, { name: 'pennants' });
  T.obj([-15.5, -11.5, -14.5, 13.5], (g) => BC.bunting(g, [-15, -11.5, 11], [-15, 13.5, 11], 12, ['#F6F1E4', '#4F8FBF', BP.red]), { name: 'pennants' });
  T.obj([-11.5, 14.5, 13.5, 15.5], (g) => BC.bunting(g, [-11.5, 15, 8.5], [13.5, 15, 8.5], 12, [BP.yellow, BP.red, '#F6F1E4']), { name: 'pennants' });

  /* ---- the clock tower in Plaça de la Vila ---- */
  T.obj([-0.6, -0.6, 2.6, 2.6], function (g) {
    g.boilP = 0.2;
    const ST = { t: '#F0D9B4', l: '#E8C79A', r: '#CFAE80' }, x0 = -0.5, y0 = -0.5, x1 = 2.5, y1 = 2.5;
    K.box(g, x0 - 0.8, y0 - 0.8, x1 + 0.8, y1 + 0.8, 0, 2.2, ST, { w: 0.7 });
    K.box(g, x0, y0, x1, y1, 2.2, 20, ST, { w: 0.85, nohid: true });
    for (const z of [6, 11]) { K.win(g, 'L', y1, x0 + 1, x1 - 1, z, z + 2.2, { style: 'slit', arch: true, lit: 0 }); K.win(g, 'R', x1, y0 + 1, y1 - 1, z, z + 2.2, { style: 'slit', arch: true, lit: 0 }); }
    // at night the clock faces are lit from inside and the tower is floodlit over the square
    for (const [f, p, a] of [['L', y1, (x0 + x1) / 2], ['R', x1, (y0 + y1) / 2]]) { const c = g.p.apply(g, K.pt(f, p + 0.05, a, 17)); g.disc2(c, 2.6, '#F6F1E4'); g.mark({ nc: '#FFF0C8' }); g.ring2(c, 2.6, { w: 0.45, c: '#5A4632' }); g.segs2([c[0], c[1], c[0] + 0.6, c[1] - 1.8, c[0], c[1], c[0] + 1.3, c[1] + 0.3], '#2A2622', 0.35); g.glow2('lantern', c, c, { r: 2.0, col: '#FFEAB8' }); }
    K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, 20, 20.6, ST, { w: 0.6, nohid: true });
    // the open belfry: four posts, the bell inside, the little pyramid roof
    for (const [x, y] of [[x0, y1], [x1, y1], [x1, y0]]) { const a = g.p(x, y, 20.6), b = g.p(x, y, 24); g.segs2([a[0], a[1], b[0], b[1]], '#CFAE80', 1.4); }
    K.hip(g, x0 - 0.5, y0 - 0.5, x1 + 0.5, y1 + 0.5, 24, 3.2, '#C9734F', { ridge: 0 });
    const t = g.p(1, 1, 27.2); g.segs2([t[0], t[1], t[0], t[1] - 4], '#3A3530', 0.45); g.disc2([t[0], t[1] - 4.4], 0.6, '#D8AE48');
    BC.flood(g, 0, 0.72); g.glow('lantern', 2.5, 2.5, 4, { r: 2.6, col: '#FFDCA0' }); g.glow('lantern', 1, 1, 22, { r: 1.4, col: '#FFDCA0' });
  }, { name: 'clock tower' });
  // the bell: swings every 20 s
  T.actor({ sample: 5, period: 20, grow: false, bias: 0.2,
    at(t) { const u = t % 20, sw = u < 4 ? Math.round(Math.sin(u * 5) * 3) : 0; return { x: 1, y: 1, z: 21, key: sw, sw }; },
    draw(g, st) { const c = g.p(0, 0, 2.1), a = st.sw * 0.18, d = [Math.sin(a), Math.cos(a)]; const p = (u, v) => [c[0] + u * d[1] + v * d[0], c[1] - u * d[0] + v * d[1]]; g.fill2([p(-1.2, 0), p(1.2, 0), p(1.6, 3.4), p(-1.6, 3.4)], '#B8913A', true); g.fill2([p(-1.8, 3.2), p(1.8, 3.2), p(1.8, 3.8), p(-1.8, 3.8)], '#9A7A2E', true); g.disc2(p(0, 4.2), 0.5, '#6E5A2E'); } });

  /* ---- Casa Vicens on the near corner ---- */
  T.obj([21, 21, 31, 31], function (g) {
    g.boilP = 0.2;
    const x0 = 21, y0 = 21, x1 = 31, y1 = 31, Z = 11;
    K.box(g, x0, y0, x1, y1, 0, Z, { t: '#E9DCC2', l: '#D9B48E', r: '#C49E78' }, { w: 0.85 });
    // chequered tile bands of green and white, stripes of marigold tiles
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
      for (const zb of [3.5, 7.4]) for (let i = 0; i < 2; i++) for (let a = a0; a < a1 - 0.4; a += 0.8) { const g0 = (Math.round((a - a0) / 0.8) + i) % 2; g.fill(K.on(f, p + 0.04, a, a + 0.8, zb + i * 0.6, zb + i * 0.6 + 0.6), g0 ? '#3E8A5A' : '#F3F1EA'); }
      for (let a = a0 + 0.5; a < a1; a += 1.2) { const c = g.p.apply(g, K.pt(f, p + 0.05, a, 6.6)); g.disc2(c, 0.5, '#E6A43A'); }
      for (let a = a0 + 1.2; a < a1 - 1; a += 2.6) { K.win(g, f, p, a, a + 1.2, 1.0, 3.2, { style: 'dark', lit: 0 }); K.win(g, f, p, a, a + 1.2, 4.8, 6.4, { style: 'dark', lit: 0 }); }
    }
    K.box(g, x0 - 0.4, y0 - 0.4, x1 + 0.4, y1 + 0.4, Z, Z + 0.6, { t: '#F3F1EA', l: '#3E8A5A', r: '#2E6A44' }, { w: 0.6, nohid: true });
    for (const [x, y] of [[x0, y1], [x1, y1], [x1, y0], [x0, y0]]) { K.cyl(g, x, y, 0.9, Z, Z + 3.4, { t: '#F3F1EA', l: '#F3F1EA', r: '#D9D5CA' }, { w: 0.5, n: 8 }); const c = g.p(x, y, Z + 3.4); g.fill2([[c[0] - 2.2, c[1]], [c[0] + 2.2, c[1]], [c[0], c[1] - 4]], '#3E8A5A', true); g.fill2([[c[0], c[1]], [c[0] + 2.2, c[1]], [c[0], c[1] - 4]], '#2E6A44', true); }
  }, { name: 'casa vicens' });
  // the railing of cast-iron palm leaves round its garden
  T.obj([18, 36, 27, 37], (g) => { const r = []; for (let x = 18.5; x < 27; x += 0.9) { const a = g.p(x, 36.5, 0), b = g.p(x, 36.5, 3.4); r.push(a[0], a[1], b[0], b[1]); g.fill2([[b[0] - 1, b[1] + 1.2], [b[0], b[1] - 0.6], [b[0] + 1, b[1] + 1.2]], '#3E6E52', true); } g.segs2(r, '#2E4A3A', 0.35); }, { name: 'railing' });
  T.obj([36, 18, 37, 27], (g) => { const r = []; for (let y = 18.5; y < 27; y += 0.9) { const a = g.p(36.5, y, 0), b = g.p(36.5, y, 3.4); r.push(a[0], a[1], b[0], b[1]); g.fill2([[b[0] - 1, b[1] + 1.2], [b[0], b[1] - 0.6], [b[0] + 1, b[1] + 1.2]], '#3E6E52', true); } g.segs2(r, '#2E4A3A', 0.35); }, { name: 'railing' });
  for (const [x, y] of [[19.5, 33], [33.5, 19.5]]) T.obj([x, y], (g) => K.palm(g, x, y, { h: 12, r: 4.2 }), { name: 'palm' });

  /* ---- Plaça del Sol: terraces, plane trees ---- */
  for (const [x, y] of [[20, -8], [33, -8], [33, 10]]) T.obj([x, y], (g) => BC.plane(g, x, y, { r: 3.6, h: 5.8 }), { name: 'tree' });
  const table = (g, x, y, seed) => { const tt = g.p(x, y, 2.3), tb = g.p(x, y, 0); g.segs2([tb[0], tb[1], tt[0], tt[1]], '#3A3530', 0.45); g.fill2(arcPts(tt[0], tt[1], 2.2, 0, TAU, 10).map((q) => [q[0], tt[1] + (q[1] - tt[1]) * 0.45]), '#ECE8DF', true); g.mark({ nc: '#C9A472' }); g.fill2([[tt[0] - 0.4, tt[1]], [tt[0] + 0.4, tt[1]], [tt[0] + 0.5, tt[1] - 1.6], [tt[0] - 0.5, tt[1] - 1.6]], seed % 2 ? '#E3B23C' : '#8E2A36', true); g.mark({ nc: seed % 2 ? '#FFC65A' : '#E0566A' }); g.glow2('lantern', [tt[0], tt[1] - 1.0], tb, { r: 0.8, col: '#FFC874' }); };   // at night a candle on each terrace table
  for (const [x, y, s] of [[18.5, -9.5, 120], [18.5, -4, 121], [18.5, 1.5, 122], [18.5, 7, 123], [-9.5, 9, 124], [-9.5, 3.5, 125]]) T.cast([x, y], (g) => { table(g, x + 1.3, y, s); BC.person(g, x, y, 1.3, BC.who(s, { dir: 0, pose: 'sit' })); BC.person(g, x + 2.6, y - 0.4, 1.3, BC.who(s + 40, { dir: 3, pose: 'sit' })); }, {});
  // the guitarist on a bench with friends standing round
  T.cast([28, 3], (g) => { K.bench(g, 28, 3, { face: 'R', L: 2.6 }); const r = BC.person(g, 29.1, 3, 1.3, BC.who(130, { dir: 0, pose: 'sit', hands: [[2.4, -10.4], [-0.6, -12.6]] })); const hp = r.hip; g.fill2(K.curve([[hp[0] - 1, hp[1] - 1], [hp[0] + 2, hp[1] - 3.2], [hp[0] + 4.4, hp[1] - 1.8], [hp[0] + 3.4, hp[1] + 0.8], [hp[0] + 0.6, hp[1] + 0.8]], 3, true), '#B5763E', true); g.segs2([hp[0] + 1, hp[1] - 1.6, hp[0] - 3.6, hp[1] - 6.6], '#5A3E2E', 0.6); BC.person(g, 29.4, 5.0, 1.3, BC.who(131, { dir: 0, pose: 'sit' })); }, {});
  for (const [x, y, s, d] of [[32, 2, 132, 2], [32.6, 4.6, 133, 2], [31.4, 6.4, 134, 3]]) T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(s, { dir: d, pose: s === 133 ? 'hold' : 'stand' })), {});
  // neighbours chatting under the tower
  for (const [x, y, s, d] of [[-4, 6, 140, 0], [-2.4, 7.2, 141, 2], [6, -6, 142, 1], [7.4, -4.6, 143, 3], [8, 7, 144, 1]]) T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(s, { dir: d, pose: 'stand', hair: s === 140 ? '#C9C6BD' : undefined })), {});

  /* ---- the kids' football game in Plaça del Sol ---- */
  const kids = [[22, -2], [27, -6], [30, -1], [25, 4]];
  kids.forEach(([x, y], i) => { const look = BC.who(150 + i, { k: 0.72, shorts: true, bare: true, top: i % 2 ? '#C9392E' : '#3F70A8' });
    T.actor({ sample: 0.4, period: 8, at(t) { const ph = Math.floor((t * 2.4 + i * 1.3) % 8), wx = x + Math.sin(t * 0.8 + i) * 2.2, wy = y + Math.cos(t * 0.7 + i * 2) * 1.6, d = Math.cos(t * 0.8 + i) > 0 ? 0 : 2; return { x: wx, y: wy, key: d + '.' + ph, dir: d, ph: ph / 8 }; }, draw(g, st) { BC.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: 'walk', ph: st.ph })); } }); });
  T.actor({ sample: 0.2, period: 8, grow: false, at(t) { const u = (t / 2) % 1, k = Math.floor(t / 2) % 4, a = kids[k], b = kids[(k + 1) % 4]; return { x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u) + 0.6, z: Math.sin(Math.PI * u) * 2.4, key: 'b' }; }, draw(g) { const c = g.p(0, 0, 0.5); g.disc2(c, 0.95, '#F6F3EA'); g.disc2([c[0] - 0.3, c[1] - 0.2], 0.35, '#2A2622'); g.ring2(c, 0.95, { w: 0.3, c: '#3A3530' }); } });
  // walkers in the lanes: a grandmother with her trolley, a man with his dog
  BC.walker(T, BC.who(160, { hair: '#C9C6BD', dress: '#3F4D63' }), [[-35, -13], [13, -13], [15, 14.5], [-35, 15]], 0.8, { phase: 0.1, extra: (g, st) => { const s = st.dir === 0 || st.dir === 3 ? 1 : -1, p = g.p(0, 0, 0); g.fill2([[p[0] - s * 2.4, p[1] - 1], [p[0] - s * 4.0, p[1] - 1], [p[0] - s * 4.0, p[1] - 6.6], [p[0] - s * 2.4, p[1] - 6.6]], '#C9392E', true); } });
  BC.walker(T, BC.who(161), [[15, -35], [15, 35]], 1.2, { phase: 0.4 });
  T.actor({ sample: 0.3, period: 70 / 1.2, at(t) { const d = ((t * 1.2 + 0.4 * 70 - 2.2) % 70 + 70) % 70, y = -35 + d, f = Math.floor(t * 6) % 2; if (y > 35) return null; return { x: 15.6, y, key: f, f }; }, draw(g, st) { const c = g.p(0, 0, 0); g.fill2([[c[0] - 1.6, c[1] - 1.6], [c[0] + 1.4, c[1] - 2.0], [c[0] + 1.6, c[1] - 1.0], [c[0] - 1.6, c[1] - 0.8]], '#8A5A3A', true); g.disc2([c[0] - 1.8, c[1] - 2.0], 0.8, '#8A5A3A'); g.segs2([c[0] - 1.2, c[1] - 1, c[0] - 1.2 - (st.f ? 0.5 : -0.3), c[1], c[0] + 1.2, c[1] - 1, c[0] + 1.2 + (st.f ? 0.4 : -0.4), c[1], c[0] + 1.5, c[1] - 1.8, c[0] + 2.3, c[1] - 2.8], '#6E4A2C', 0.4); } });

  BC.block(T, { corners: { nn: 'bins', np: 'motos', pn: 'bicing', pp: 'none' }, noTrees: ['x-'] });
});
