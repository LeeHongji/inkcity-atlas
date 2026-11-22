'use strict';
/* (-100,0) A hutong quarter west of the palace: the grey heart of old Beijing.
   What it is: an east-west lane (the hutong) and a north-south one cross between four plots. Three are courtyard houses
   (siheyuan): grey-brick wings with lattice fronts round an open brick yard, each with a red gate (and a 福 on the doors).
   The north houses open their gates onto the lane; the south-west house onto the cross lane. The fourth corner is the
   neighbourhood's living room: a tea shop and a noodle shop, a big pagoda tree where the old men hang their birdcages,
   a xiangqi game on a folding table, the jianbing cart. A blue street plaque says 胡同.
   Who: in the yards, an old man knocking down persimmons with a long pole, a grandmother hanging out washing, a child
   doing homework, a family round a table of dumplings; cabbages stacked for the winter, bicycles against the walls, a
   cat on a wall. In the lane (the hutong morning): a grandfather walking his bird, a man walking backwards for his
   health, cyclists, a delivery tricycle and a pedicab of tourists threading past each other.
   What moves: the lane traffic (two lines, opposite ways, slow), walkers, a flock of pigeons wheeling overhead. */
SF.tile('hutong', -100, 0, { rim: 10 }, function (T) {
  const H = 37, LANE = BC.hutong;
  T.ground(function (g) {
    K.slab(g, H, { top: '#DAD4C7' });
    // the lanes: worn grey paving with a gutter line
    g.fill(K.rect(-H, -6, H, 6), LANE); g.fill(K.rect(-5, -H, 5, H), LANE);
    g.scuff(K.rect(-H, -6, H, 6), { dir: Math.atan2(AY, AX), len: 5, c: '#E4DFD4', dens: 0.6, w: 0.5, spread: 0.08 });
    g.scuff(K.rect(-5, -H, 5, H), { dir: Math.atan2(AY, -AX), len: 5, c: '#E4DFD4', dens: 0.6, w: 0.5, spread: 0.08 });
    g.line([[-H, 0, 0], [-6, 0, 0]], { w: 0.3, c: '#C2BBAD', boil: false }); g.line([[6, 0, 0], [H, 0, 0]], { w: 0.3, c: '#C2BBAD', boil: false });
    // the corner square: packed earth and brick
    g.fill(K.rect(5, 13.5, 34, 33.6), '#D9CFBC');
    g.scuff(K.rect(5, 13.5, 34, 33.6), { dir: -0.4, len: 3, c: '#E6DDCB', dens: 0.6, w: 0.45 });
  }, { rim: true });
  BJ.sidewalk(T, ['n', 's', 'e'], { skip: { n: [[-7, 7]], s: [[-7, 7]], e: [[-8, 8]] }, bikes: [['e', -14, 5], ['s', 22, 4], ['n', -20, 4]], off: { n: 1, s: 3, e: 0 } });

  /* ---------------- the courtyard houses ---------------- */
  const NW = BJ.court(T, { x0: -35, y0: -33.4, x1: -6, y1: -6.4, gate: 'S', ga: -10, east: 'wing', fu: true });
  const NE = BJ.court(T, { x0: 6, y0: -33.4, x1: 33.4, y1: -6.4, gate: 'S', ga: 29.6, east: 'wing' });
  const SW = BJ.court(T, { x0: -35, y0: 6.4, x1: -6, y1: 33.4, gate: 'E', ga: 11.5, east: 'wall', south: 'wall' });
  // the street plaque on the corner of the north-west house's front wall
  T.obj([-6.2, -10.6, -5.8, -7.4], (g) => { BJ.sign(g, 'R', -6.0, -10.4, -7.6, 2.4, 3.6, '#2E5E9E', '胡同', { ink: '#FBF8EE', lit: false }); g.glow('lamp', -5.4, -9.0, 4.6, { r: 1.0 }); }, { on: false, name: 'plaque' });   // (night: a lamp on the wall over the plaque)
  // the two shops on the corner square
  T.obj([6, 6.4, 19, 13.4], function (g) {
    BJ.wing(g, 6, 6.4, 19, 13.4, { front: null, h: 5.4, rh: 2.8, lanterns: false });
    g.fill(K.on('L', 13.43, 7, 18, 0.2, 4.4), '#8E3A2C'); BN.shopWin(g, 'L', 13.4, 7.6, 14, 1.2, 4.0, { style: 'glass' });
    g.fill(K.on('L', 13.45, 15, 17.6, 0.2, 4.0), '#5E3A2A'); g.mark({ nc: '#E9A85A', win: 1, spill: true });   // (night: the tea shop open and lit)
    g.glow('lamp', 11.5, 13.9, 5.0, { r: 1.1 });
    BJ.sign(g, 'L', 13.42, 9.2, 15.8, 4.5, 5.35, '#3F2A20', '茶', { ink: '#E9C55A' });
    const st = g.p(16.3, 14.6, 0); for (let k = 0; k < 3; k++) { const c = [st[0] + k * 2.6 - 2, st[1] - k * 0.5]; g.fill2(arcPts(c[0], c[1] - 2, 1.4, 0, TAU, 8).map((q) => [q[0], c[1] - 2 + (q[1] - c[1] + 2) * 0.6]), '#5E8A6A', true); }
  }, { name: 'tea shop' });
  T.obj([20, 6.4, 33.4, 13.4], function (g) {
    BJ.wing(g, 20, 6.4, 33.4, 13.4, { front: null, h: 5.4, rh: 2.8, lanterns: false });
    g.fill(K.on('L', 13.43, 21, 32.4, 0.2, 4.4), '#9C4A32'); BN.shopWin(g, 'L', 13.4, 21.6, 28, 1.2, 4.0, { style: 'glass' });
    g.fill(K.on('L', 13.45, 29, 31.8, 0.2, 4.0), '#5E3A2A'); g.mark({ nc: '#F0B060', win: 1, spill: true });   // (night: the noodle shop open late)
    BJ.sign(g, 'L', 13.42, 23, 30.4, 4.5, 5.35, '#C9382E', '面');
    // steam from the pot by the door
    const c = g.p(28.5, 14.4, 2.2); g.fill2([[c[0] - 1.6, c[1]], [c[0] + 1.6, c[1]], [c[0] + 1.4, c[1] - 2], [c[0] - 1.4, c[1] - 2]], '#9AA0A8', true);
    g.glow('lamp', 24.5, 13.9, 5.0, { r: 1.1 });               // at night a lamp on the wall over the door
    // and two red lanterns either side of the door, hung out for the evening
    for (const x of [28.6, 32.2]) BN.lantern2(g, g.p(x, 14.3, 4.2), 1.4, g.p(x, 14.6, 0));
  }, { name: 'noodle shop' });
  T.obj([33.4, 6.4, 34.4, 33.6], (g) => BJ.greyWall(g, 33.6, 6.4, 34.4, 33.6, 3.4), { name: 'wall' });

  /* ---------------- trees ---------------- */
  T.obj([-23, -20], (g) => BJ.persimmon(g, -23, -20, { r: 4.2, h: 5.4, seed: 11 }), { name: 'persimmon' });
  T.obj([20, -22], (g) => BJ.persimmon(g, 20, -22, { r: 3.6, h: 5.2, seed: 12, fruit: '#B8342A', fr: 0.7, n: 22, leaf: '#B9A04A' }), { name: 'jujube' });
  T.obj([-20, 22], (g) => BJ.persimmon(g, -20, 22, { r: 3.8, h: 5.0, seed: 13 }), { name: 'persimmon' });
  T.obj([29, 29], (g) => K.tree(g, 29, 29, { r: 5.4, h: 6.2, col: '#B3BE62', ink: '#5E6A30', seed: 5 }), { name: 'pagoda tree' });

  /* ---------------- the yards ---------------- */
  // north-west: persimmon picking, cabbages, a bike, a birdcage under the eaves
  T.cast([-20, -15], (g) => { const r = BJ.person(g, -20, -15, 0, BJ.who(501, { old: true, dir: 2, pose: 'stand', hands: [[-2.6, -16.6], [-1.6, -12.8]] })); const hd = r.hands[0]; g.segs2([hd[0] + 0.8, hd[1] + 3.8, hd[0] - 3.2, hd[1] - 12], '#B9A27D', 0.4); const b = g.p(-18.4, -14.2, 0); g.fill2([[b[0] - 1.6, b[1]], [b[0] + 1.6, b[1]], [b[0] + 1.9, b[1] - 2.2], [b[0] - 1.9, b[1] - 2.2]], '#C9A26B', true); for (let k = 0; k < 4; k++) g.disc2([b[0] - 1 + k * 0.7, b[1] - 2.4], 0.6, BC.persimmon); }, { on: true });
  T.cast([-16, -25.6], (g) => BJ.cabbages(g, -16, -25.6, 9), { on: true });
  T.cast([-27.4, -12], (g) => BJ.parked(g, -27.4, -12, Math.PI / 2, '#2F343B'), { on: true });
  T.cast([-12.6, -26.2], (g) => { const c = g.p(-12.6, -26.2, 5.2); g.segs2([c[0], c[1], c[0], c[1] + 2.4], '#5A4A3C', 0.3); const cc = [c[0], c[1] + 4.6], rr = 1.8; g.fill2(K.curve([[cc[0] - rr, cc[1] + rr * 0.6], [cc[0] - rr * 0.95, cc[1] - rr * 0.4], [cc[0], cc[1] - rr * 1.25], [cc[0] + rr * 0.95, cc[1] - rr * 0.4], [cc[0] + rr, cc[1] + rr * 0.6]], 2, true), 'rgba(240,230,205,0.55)', true); const s = []; for (let i = -2; i <= 2; i++) s.push(cc[0] + i * rr * 0.42, cc[1] - rr * 0.9, cc[0] + i * rr * 0.45, cc[1] + rr * 0.6); g.segs2(s, '#8A6A3E', 0.18); g.disc2([cc[0] + 0.3, cc[1] + 0.1], 0.5, '#E6C24F'); }, { on: true });
  // north-east: washing on a line, homework at a little table, a cat on the wall
  T.cast([18, -14], (g) => {
    const a = g.p(13, -16, 0), b = g.p(26, -11, 0), a2 = [a[0], a[1] - 5.6 * VZ], b2 = [b[0], b[1] - 5.6 * VZ];
    g.segs2([a[0], a[1], a2[0], a2[1], b[0], b[1], b2[0], b2[1]], '#6E5A44', 0.45);
    const line = []; for (let k = 0; k <= 10; k++) { const t = k / 10; line.push([lerp(a2[0], b2[0], t), lerp(a2[1], b2[1], t) + 3 * t * (1 - t) * 2]); } g.fine2(line, { w: 0.25, c: '#4A4540' });
    ['#F3F1EA', '#8FB7D9', '#E7A9A0', '#F3F1EA', '#E6C24F'].forEach((c, i) => { const t = 0.15 + i * 0.17, p = [lerp(a2[0], b2[0], t), lerp(a2[1], b2[1], t) + 6 * t * (1 - t)]; g.fill2([[p[0] - 2, p[1]], [p[0] + 2, p[1] + 0.6], [p[0] + 1.8, p[1] + 6], [p[0] - 2.1, p[1] + 5.4]], c, true); g.outline2([[p[0] - 2, p[1]], [p[0] + 2, p[1] + 0.6], [p[0] + 1.8, p[1] + 6], [p[0] - 2.1, p[1] + 5.4]], { w: 0.25, c: '#8C8576', boil: false }); });
    BJ.person(g, 21.5, -11.8, 0, BJ.who(502, { old: true, dir: 2, pose: 'stand', hands: [[-1.2, -15.8], [1.0, -16.4]], hairStyle: 'curly' }));
  }, { on: true });
  T.cast([14, -9], (g) => { K.box(g, 13, -9.8, 15.4, -8.2, 2.2, 2.5, { t: '#C9A26B', l: '#B58F58', r: '#A07C4C' }, { w: 0.4, boil: false }); const p = g.p(13.6, -9.4, 2.5); g.fill2([[p[0] - 1, p[1]], [p[0] + 1.6, p[1] - 0.4], [p[0] + 1.8, p[1] + 0.6], [p[0] - 0.8, p[1] + 1]], '#F7F5EF', true); BJ.person(g, 14.2, -7.4, 1.1, BJ.kid(503, { dir: 3, pose: 'sit' })); K.box(g, 13.6, -7.9, 14.8, -6.9, 0, 1.1, '#C9584B', { w: 0.35, boil: false }); }, { on: true });
  T.cast([27.6, -6.6], (g) => { const p = g.p(27.6, -6.6, 3.6 + 0.8); g.fill2([[p[0] - 1.6, p[1]], [p[0] + 1.2, p[1]], [p[0] + 1.4, p[1] - 1.2], [p[0] - 1.4, p[1] - 1.4]], '#E08A3C', true); g.disc2([p[0] + 1.4, p[1] - 1.8], 0.9, '#E08A3C'); g.fill2([[p[0] + 1.0, p[1] - 2.4], [p[0] + 1.3, p[1] - 3.2], [p[0] + 1.6, p[1] - 2.4]], '#E08A3C', true); g.segs2([p[0] - 1.6, p[1] - 0.4, p[0] - 2.8, p[1] - 2.4], '#E08A3C', 0.45); }, { on: true });
  // south-west: the family round a table of dumplings
  T.cast([-14, 22], (g) => {
    const seat = (x, y, d, w) => { K.box(g, x - 0.5, y - 0.5, x + 0.5, y + 0.5, 0, 1.3, '#C9A26B', { w: 0.3, boil: false }); BJ.person(g, x, y, 1.3, Object.assign(w, { dir: d, pose: 'sit' })); };
    seat(-15.4, 20.4, 0, BJ.who(504, { old: true }));
    seat(-12.6, 20.4, 1, BJ.who(505));
    K.cyl(g, -14, 22, 1.8, 0, 2.6, { t: '#C9A26B', l: '#B58F58', r: '#A07C4C' }, { w: 0.5, n: 12 });
    const tp = g.p(-14, 22, 2.62); for (let k = 0; k < 7; k++) { const a = k * 0.9, q = [tp[0] + Math.cos(a) * 2.4, tp[1] + Math.sin(a) * 1.1]; g.fill2(arcPts(q[0], q[1], 0.8, Math.PI, TAU, 5).concat([[q[0] + 0.8, q[1] + 0.3], [q[0] - 0.8, q[1] + 0.3]]), '#F7F2E2', true); }
    g.fill2(arcPts(tp[0], tp[1], 1.2, 0, TAU, 10).map((q) => [q[0], tp[1] + (q[1] - tp[1]) * 0.5]), '#F3F1EA', true);
    seat(-15.4, 23.6, 3, BJ.kid(506));
    seat(-12.6, 23.6, 2, BJ.who(507));
  }, { on: true });
  T.cast([-27.6, 30], (g) => BJ.cabbages(g, -27.6, 30, 6), { on: true });
  // the corner square: xiangqi under the pagoda tree, birdcages hanging in it, the jianbing cart
  T.cast([12, 22], (g) => {
    K.box(g, 11.1, 21.1, 12.9, 22.9, 0, 2.3, '#B58F58', { w: 0.4, boil: false });
    const tp = g.p(12, 22, 2.31); g.fill2([[tp[0] - 4.6, tp[1]], [tp[0], tp[1] - 2.6], [tp[0] + 4.6, tp[1]], [tp[0], tp[1] + 2.6]], '#E9C98A', true);
    const pcs = []; for (let k = 0; k < 10; k++) pcs.push([tp[0] + (h1(k * 7) - 0.5) * 6, tp[1] + (h1(k * 11) - 0.5) * 3.2]); pcs.forEach((q, k) => { g.disc2(q, 0.55, '#F3E3B8'); g.disc2(q, 0.35, k % 2 ? '#C9382E' : '#2A2622'); });
    K.box(g, 9.2, 21.5, 10.2, 22.5, 0, 1.3, '#5E8A6A', { w: 0.3, boil: false }); BJ.person(g, 9.7, 22, 1.3, BJ.who(510, { old: true, dir: 0, pose: 'sit', reach: [3.2, -3] }));
    K.box(g, 13.8, 21.5, 14.8, 22.5, 0, 1.3, '#5E8A6A', { w: 0.3, boil: false }); BJ.person(g, 14.3, 22, 1.3, BJ.who(511, { old: true, dir: 2, pose: 'sit' }));
    BJ.person(g, 11.6, 24.6, 0, BJ.who(512, { old: true, dir: 3, pose: 'stand', cage: 'cloth' }));
    BJ.person(g, 13.2, 25, 0, BJ.who(513, { old: true, dir: 3, pose: 'hold' }));
  }, { on: false });
  T.cast([29.2, 31.6], (g) => {
    for (const [dx, dz, cl] of [[-3.5, 7.2, 'cloth'], [2.6, 7.8, 'open'], [0, 8.6, 'open']]) {
      const top = g.p(29 + dx, 29, dz + 2.2), c = [top[0], top[1] + 4.6], rr = 1.7;
      g.segs2([top[0], top[1], c[0], c[1] - rr * 1.2], '#5A4A3C', 0.3);
      g.fill2(K.curve([[c[0] - rr, c[1] + rr * 0.6], [c[0] - rr * 0.95, c[1] - rr * 0.4], [c[0], c[1] - rr * 1.25], [c[0] + rr * 0.95, c[1] - rr * 0.4], [c[0] + rr, c[1] + rr * 0.6]], 2, true), cl === 'cloth' ? '#3E5E9E' : 'rgba(240,230,205,0.6)', true);
      if (cl !== 'cloth') { const s = []; for (let i = -2; i <= 2; i++) s.push(c[0] + i * rr * 0.42, c[1] - rr * 0.9, c[0] + i * rr * 0.45, c[1] + rr * 0.6); g.segs2(s, '#8A6A3E', 0.18); g.disc2([c[0] + 0.3, c[1] + 0.1], 0.5, '#E6C24F'); }
    }
    BJ.person(g, 27.6, 31.8, 0, BJ.who(514, { old: true, dir: 1, pose: 'stand' })); BJ.person(g, 30.8, 32.4, 0, BJ.who(515, { old: true, dir: 2, pose: 'wave', ph: 0.4 }));
  }, { on: false });
  T.cast([29, 18], (g) => { BJ.jianbing(g, 29, 18); BJ.person(g, 32.2, 18.2, 0, BJ.who(516, { dir: 2, pose: 'hold', top: '#F3F1EA' })); BJ.person(g, 29, 21.4, 0, BJ.who(517, { dir: 3, pose: 'stand', phone: true })); }, { on: false });
  T.cast([31.4, 9.2], (g) => BJ.cabbages(g, 31.4, 9.2, 0), { on: false });

  /* ---------------- the lane: the hutong morning ---------------- */
  // two lines, opposite ways (right-hand: eastbound on the +y side), slow; two vehicles per line, half a lap apart
  const LV = 3.4, SPAN = 74 + 8;
  [[2.2, 1, ['tri', 'bike']], [-2.2, -1, ['pedicab', 'bike']]].forEach(([y, d, kinds], li) => kinds.forEach((kind, k) => {
    const who = BJ.who(520 + li * 2 + k), ang = d > 0 ? 0 : Math.PI;
    T.actor({ sample: 0.3, period: SPAN / LV,
      at(t) { const s = ((((t * LV + k * SPAN / 2 + li * 13) % SPAN) + SPAN) % SPAN) - SPAN / 2, x = d * s; const fade = Math.min(1, (40 - Math.abs(x)) / 5); if (fade <= 0.03) return null; return { x, y, key: kind, alpha: fade < 1 ? fade : null }; },
      draw(g) {
        if (kind === 'tri') BJ.tri(g, ang, { box: '#3E6FB0', seed: 520 });
        else if (kind === 'pedicab') BJ.pedicab(g, ang, { riders: [BJ.tourist(530, '#E85A3A'), BJ.tourist(531, '#E85A3A')], seed: 532 });
        else K.bike(g, ang, { col: li ? '#2F343B' : '#C9584B', who });
      } });
  }));
  // a grandfather walking his bird (slow, the north edge of the lane) and a man walking backwards (the south edge)
  K.walker(T, BJ.who(540, { old: true, cage: 'cloth', cap: '#5A5A55' }), [[-34, -4.6], [34, -4.6]], 0.55, { phase: 0.3 });
  T.actor({ sample: 0.3, period: 2 * 66 / 0.7,
    at(t) { const L = 66, u = ((t * 0.7) % (2 * L) + 2 * L) % (2 * L), out = u < L, x = out ? -33 + u : 33 - (u - L), ph = Math.floor((u / 2.0) % 1 * 8); return { x, y: 4.6, key: (out ? 'b' : 'c') + ph, dir: out ? 2 : 0, ph: ph / 8 }; },
    draw(g, st) { BJ.person(g, 0, 0, 0, BJ.who(541, { old: true, dir: st.dir, pose: 'walk', ph: 1 - st.ph, top: '#3F5F8F', bot: '#3B3F47' })); } });
  K.walker(T, BJ.who(542), [[-1.6, -34], [-1.6, -8]], 1.1, { phase: 0.1 });
  K.walker(T, BJ.kid(543), [[1.8, 34], [1.8, 8]], 1.4, { phase: 0.6 });
  K.walker(T, BJ.who(544, { top: '#F2C230', cap: '#F2C230' }), [[2.4, -8], [2.4, -34]], 1.3, { phase: 0.4 });
  K.walker(T, BJ.who(545, { old: true }), [[-2.6, 8], [-2.6, 34]], 0.8, { phase: 0.2 });
  // pigeons wheeling over the roofs
  T.actor({ layer: 'top', sample: 5, period: 16, grow: false,
    at(t) { const a = t * 0.4; return { x: Math.cos(a) * 18, y: Math.sin(a) * 12, z: 26, key: 'p' + (Math.floor(t * 5) % 2), up: Math.floor(t * 5) % 2 }; },
    draw(g, st) { const o = g.p(0, 0, 0); for (let i = 0; i < 9; i++) BJ.pigeon2(g, [o[0] + (i % 3) * 5 - 5 + (i % 2) * 1.5, o[1] + Math.floor(i / 3) * 3.6 - 3], 1.5, (st.up + i) % 2, i === 4 ? '#F1EFE8' : i === 7 ? '#6E737A' : '#9AA0A8'); } });
  void NW; void NE; void SW;
});
