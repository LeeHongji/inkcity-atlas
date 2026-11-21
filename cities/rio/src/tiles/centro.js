'use strict';
/* (0,-100) Centro: Cinelândia, on the day of the Cordão da Bola Preta.
   Built: the Theatro Municipal at the far corner (1909, after the Paris Opéra: an arcaded entrance front with paired
   columns, corner pavilions with green copper cupolas, the auditorium's green dome with a gilded eagle), a row of
   eclectic office fronts along the far right with the Amarelinho's yellow umbrellas, the square paved in black and
   white stone round the Floriano monument, the VLT tram's rails across the near side. Out in the bay on Pier Mauá:
   Calatrava's Museum of Tomorrow, a long white building whose spine carries rows of fins, its roof cantilevered far
   out over a reflecting pool.
   Who: the Cordão da Bola Preta — a brass band (trombones, trumpets, a sousaphone, snare and surdo) behind the black
   ball flag, and a crowd in white with black polka dots, sailor hats and wings, dancing round the square after it;
   people at the Amarelinho's tables; the white-and-teal VLT gliding past; visitors on the pier; pigeons. */
SF.tile('centro', 0, -100, { rim: 10 }, function (T) {
  const GOLD = '#D9AD45', COPPER = '#6FB59A';
  T.ground(function (g) {
    K.slab(g, 37, { top: '#EEEAE0' });
    // Cinelândia's stone: wide black waves across the square, the usual motifs elsewhere
    const sq = [-8, -12, 26, 18];
    g.fill(K.rect(sq[0], sq[1], sq[2], sq[3]), '#F3F0E7');
    for (let c = sq[1] + 1.4; c < sq[3] - 0.5; c += 3.2) { const A = [], B = []; for (let x = sq[0]; x <= sq[2] + 0.01; x += 0.8) { const s = Math.sin(x / 7 * TAU) * 0.9; A.push([x, clamp(c + s, sq[1], sq[3]), 0]); B.push([x, clamp(c + 1.1 + s, sq[1], sq[3]), 0]); } g.fill(A.concat(B.reverse()), '#3A3530'); }
    RJ.mosaic(g, -37, -12, -8, 37, { sp: 2.6 }); RJ.mosaic(g, 26, -14, 37, 37, { sp: 2.6 }); RJ.mosaic(g, -8, 18, 26, 37, { sp: 2.6, skip: (x, y) => y > 22.6 && y < 29.4 });
    // the VLT's rails and its stop
    g.fill(K.rect(-37, 23, 37, 29), '#D9D3C6');
    for (const y of [25.2, 26.8]) g.line([[-37, y, 0], [37, y, 0]], { w: 0.45, c: '#6E6A60', boil: false });
    /* ---- Pier Mauá out in the bay: its deck, the reflecting pools ---- */
    const PY0 = -84, PY1 = -63;
    g.fill(K.rect(-34, PY0, 36, PY1, 0.4), '#E6E2D8'); RJ.mosaic(g, -34, PY0, 36, PY1, { sp: 3.0 });
    g.fill([[36, PY0, 0.4], [36, PY1, 0.4], [36, PY1, RS.WZ], [36, PY0, RS.WZ]], '#B8B2A4'); g.line([[36, PY0, 0.4], [36, PY1, 0.4], [36, PY1, RS.WZ]], { w: 0.7, boil: false });
    g.line([[-34, PY0, 0.4], [36, PY0, 0.4]], { w: 0.7, boil: false });
    for (const q of [K.rect(-30, -83.2, 34, -81, 0.45), K.rect(26, -81, 34, -68, 0.45)]) { g.fill(q, '#8CC6D2'); g.water(q, { dens: 0.6 }); g.outline(q, { w: 0.4, c: '#5E8F9A', boil: false }); }
  }, { rim: true });

  /* ---------------- the Theatro Municipal ---------------- */
  const TX0 = -35, TY0 = -35, TX1 = -12, TY1 = -14, TH_ = 11;
  const ST = { t: '#EDE6D2', l: '#F3EDDD', r: '#DDD3BB' };
  T.obj([TX0, TY0, TX1, TY1], function (g) {
    g.boilP = 0.2;
    K.box(g, TX0, TY0, TX1, TY1, 0, TH_, ST, { w: 1 });
    // the entrance front: an arcade below, paired columns and tall windows above, a frieze
    for (let x = TX0 + 4; x < TX1 - 4; x += 2.6) K.win(g, 'L', TY1, x, x + 1.6, 0, 3.6, { style: 'dark', arch: true });
    for (let x = TX0 + 4; x < TX1 - 4; x += 2.6) { K.win(g, 'L', TY1, x + 0.3, x + 1.3, 5, 8.2, { style: 'navy', arch: true }); for (const dx of [-0.35, 1.95]) { const a = g.p(x + dx, TY1 + 0.1, 4.4), b = g.p(x + dx, TY1 + 0.1, 9.4); g.line2([a, b], { w: 0.9, c: '#CFC2A0', boil: false }); } }
    g.fill(K.on('L', TY1 + 0.05, TX0, TX1, 9.5, 10.4), '#E2D2A8'); g.fill(K.on('L', TY1 + 0.06, TX0 + 7, TX1 - 7, 9.6, 10.3), GOLD);
    for (let y = TY0 + 3; y < TY1 - 3; y += 2.8) K.win(g, 'R', TX1, y, y + 1.4, 1, 3.6, { style: 'navy', arch: true });
    for (let y = TY0 + 3; y < TY1 - 3; y += 2.8) K.win(g, 'R', TX1, y + 0.2, y + 1.2, 5.2, 8.0, { style: 'navy' });
    // the corner pavilions with their cupolas
    for (const [x, y] of [[TX0 + 2.4, TY1 - 2.4], [TX1 - 2.4, TY1 - 2.4], [TX1 - 2.4, TY0 + 2.4]]) {
      K.box(g, x - 2.4, y - 2.4, x + 2.4, y + 2.4, TH_, TH_ + 2.4, ST, { w: 0.7 });
      K.dome(g, x, y, 2.2, TH_ + 2.4, 3.2, COPPER, { shadow: shade(COPPER, 0.15), ribs: 6, ribCol: shade(COPPER, 0.3), ribW: 0.5 });
      const t = g.p(x, y, TH_ + 5.6); g.segs2([t[0], t[1], t[0], t[1] - 3], '#5A564E', 0.4); g.disc2([t[0], t[1] - 3.2], 0.6, GOLD);
    }
    // the auditorium drum and its great green dome, the eagle on top
    const DC = [-24, -27];
    K.cyl(g, DC[0], DC[1], 5.4, TH_, TH_ + 3, ST, { w: 0.8, n: 18 });
    K.dome(g, DC[0], DC[1], 5.6, TH_ + 3, 6.8, COPPER, { shadow: shade(COPPER, 0.16), band: true, ribs: 10, ribCol: shade(COPPER, 0.32), ribW: 0.55 });
    const e = g.p(DC[0], DC[1], TH_ + 10.4);
    g.fill2([[e[0] - 6, e[1] - 2.4], [e[0] - 1, e[1] - 0.6], [e[0], e[1] - 3.6], [e[0] + 1, e[1] - 0.6], [e[0] + 6, e[1] - 2.4], [e[0] + 1.4, e[1] + 1.6], [e[0] - 1.4, e[1] + 1.6]], GOLD, true);
    g.line2([[e[0] - 6, e[1] - 2.4], [e[0] - 1, e[1] - 0.6], [e[0], e[1] - 3.6], [e[0] + 1, e[1] - 0.6], [e[0] + 6, e[1] - 2.4]], { w: 0.45, c: '#8A6A1E', boil: false });
    K.text(g, 'L', TY1 + 0.08, (TX0 + TX1) / 2, 10.5, 0.75, 'THEATRO MUNICIPAL', '#8A6A1E', { center: true, w: 0.45 });
  }, { name: 'theatro municipal' });
  // the steps in front of the theatre and people on them
  T.obj([TX0 + 3, TY1, TX1 - 3, TY1 + 2.4], (g) => { for (let k = 0; k < 3; k++) K.box(g, TX0 + 3, TY1, TX1 - 3, TY1 + 2.4 - k * 0.8, 0, 0.35 + k * 0.35, '#E9E2CF', { w: 0.5, nb: true }); }, { name: 'escadaria' });
  for (const [x, s, d] of [[-30, 1501, 1], [-27.6, 1502, 0], [-20, 1503, 1], [-16, 1504, 2]]) T.cast([x, TY1 + 3.2], (g) => RJ.person(g, x, TY1 + 3.2, 0, Object.assign(RJ.who(s), { dir: d, pose: s % 2 ? 'hold' : 'stand', phone: s % 2 === 1 })), {});

  /* ---------------- the far-right row and the Amarelinho ---------------- */
  const ROW = [[-8, -36, 6, -26, 13.6, '#E9DDC4'], [6.5, -36, 20, -26, 15.2, '#D9CDB4'], [20.5, -36, 36.5, -26, 12.4, '#E9D2BC']];
  ROW.forEach(([x0, y0, x1, y1, h, c], i) => T.obj([x0, y0, x1, y1], (g) => {
    g.boilP = 0.25; K.box(g, x0, y0, x1, y1, 0, h, c, { w: 0.9 });
    for (let z = 4.2; z < h - 1.5; z += 2.6) for (let x = x0 + 1; x < x1 - 1; x += 2.2) K.win(g, 'L', y1, x, x + 1.2, z, z + 1.7, { style: 'navy' });
    g.fill(K.on('L', y1 + 0.03, x0 + 0.5, x1 - 0.5, 0.2, 3.4), i === 0 ? '#F2C230' : '#9FB9C4');
    K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, h, h + 0.6, shade(c, 0.1), { w: 0.6 });
    if (i === 0) K.sign(g, 'L', y1 + 0.05, x0 + 1, x1 - 1, 3.5, 4.5, '#F2C230', 'AMARELINHO');
    if (i === 1) K.sign(g, 'L', y1 + 0.05, x0 + 1.5, x1 - 1.5, 3.5, 4.4, '#2F3A4F', 'CINE ODEON');
  }, { name: 'prédio' }));
  for (const [x, y] of [[-5, -21.5], [0.5, -20], [-2.5, -17.5]]) T.cast([x, y], (g) => {
    const f = g.p(x, y, 0); RJ.table2(g, f, '#F2C230', '#F2C230');
    RJ.person(g, x - 1.1, y + 0.6, 1.3, Object.assign(RJ.who(1510 + x * 7 + y), { dir: 0, pose: 'sit', cup: '#F2C230' }));
    RJ.person(g, x + 1.1, y - 0.6, 1.3, Object.assign(RJ.who(1511 + x * 7 + y), { dir: 1, pose: 'sit' }));
  }, {});
  // trees round the square
  for (const [x, y] of [[-10, -9], [30, -10], [-10, 20], [30, 20]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 4.2, h: 5.2, col: '#5E8F4E' }), { name: 'árvore' });

  /* ---------------- the left side: a costume seller's rack, benches, a hot-dog cart ---------------- */
  T.obj([-24, 2, -20, 6], function (g) {
    const a = g.p(-23.6, 4, 0), b = g.p(-20.4, 4, 0), a2 = g.p(-23.6, 4, 6), b2 = g.p(-20.4, 4, 6);
    g.segs2([a[0], a[1], a2[0], a2[1], b[0], b[1], b2[0], b2[1], a2[0], a2[1], b2[0], b2[1]], '#6E6A60', 0.5);
    const R = RNG(1620);
    for (let k = 0; k < 7; k++) { const t = (k + 0.5) / 7, p = [lerp(a2[0], b2[0], t), lerp(a2[1], b2[1], t) + 1]; const kind = k % 3; if (kind === 0) RJ.fan2(g, [p[0], p[1] + 2], 4, -Math.PI * 0.9, -Math.PI * 0.1, 5, [R.pick(['#E86A9A', '#F2C230', '#5FC0B0', '#D9463B'])]); else if (kind === 1) { g.fill2([[p[0] - 1.6, p[1]], [p[0] + 1.6, p[1]], [p[0] + 1.2, p[1] + 6], [p[0] - 1.2, p[1] + 6]], R.pick(['#9B7FC9', '#F2C230', '#E86A9A']), true); } else { g.fill2([[p[0] - 2, p[1] + 1], [p[0], p[1] + 4], [p[0] + 2, p[1] + 1], [p[0], p[1] + 2]], '#BFE3EE', true); } }
    K.sign(g, 'L', 4.1, -23.4, -20.6, 6.2, 7.2, '#E86A9A', 'FANTASIAS');
  }, { name: 'fantasias' });
  T.cast([-19, 7], (g) => { RJ.person(g, -19, 7, 0, Object.assign(RJ.who(1621, { carnaval: false }), { dir: 1, pose: 'hold', sunhat: true })); RJ.person(g, -22, 8.6, 0, Object.assign(RJ.who(1622, { set: { fem: true, hairStyle: 'long' } }), { dir: 2, pose: 'hold', asas: '#F3D3E6' })); }, {});
  for (const [x, y] of [[-30, -4], [-30, 10]]) T.cast([x, y], (g) => { K.bench(g, x, y, { face: 'R', L: 2.4 }); RJ.person(g, x + 1.1, y - 0.8, 1.3, Object.assign(RJ.who(1630 + y, { carnaval: false }), { dir: 0, pose: 'sit', hair: '#C9C6BD' })); RJ.person(g, x + 1.1, y + 1.0, 1.3, Object.assign(RJ.who(1631 + y), { dir: 0, pose: 'sit', cup: '#F2C230' })); }, {});
  T.obj([-16, 16], (g) => K.stall(g, -16, 16, { face: 'L', L: 2.0, D: 1.3, a: '#D9463B', b: '#F6F3EA', goods: (g2, D, L) => { for (let i = 0; i < 4; i++) { const p = g2.p(-D + 0.6 + (i % 2) * 1.2, -L + 0.8 + Math.floor(i / 2) * 2, 2.9); g2.fill2([[p[0] - 1, p[1] - 0.4], [p[0] + 1, p[1] - 0.4], [p[0] + 1, p[1] + 0.4], [p[0] - 1, p[1] + 0.4]], '#E2B07A', true); } } }), { name: 'cachorro-quente' });
  T.cast([-14, 19.2], (g) => RJ.person(g, -14, 19.2, 0, Object.assign(RJ.who(1640), { dir: 2, pose: 'hold', cup: '#D9463B' })), {});
  /* ---------------- more street life round the square ---------------- */
  RJ.banca(T, -20, -5.5, 1650);
  RJ.suco(T, -29, 18, 1655, 'CALDO DE CANA');
  RJ.shadeTree(T, -35, 1, 1660); RJ.shadeTree(T, -13, 8, 1663); RJ.shadeTree(T, -35, 16, 1666, { r: 4.2 });
  RJ.shadeTree(T, 33.5, 12, 1669); RJ.shadeTree(T, 33.5, -12, 1672, { r: 4.2 }); RJ.shadeTree(T, 20, 34, 1675); RJ.shadeTree(T, -6, 34, 1678, { r: 4.0 });
  RJ.parked(T, -36, 33.5, 6, 'x', 1680); RJ.parked(T, 26, 32.5, 4, 'x', 1686);
  RJ.busker(T, 6, 32, 1690);
  for (const [x, y, a, word] of [[32.5, -3, '#E86A9A', 'AÇAÍ'], [32.5, 4.5, '#F2C230', 'PIPOCA']]) {
    T.obj([x, y], (g) => K.stall(g, x, y, { L: 2.2, D: 1.4, a, b: '#F6F3EA', goods: (g2, D, L) => { for (let i = 0; i < 4; i++) { const p = g2.p(-D + 0.6 + (i % 2) * 1.4, -L + 0.7 + Math.floor(i / 2) * 2.2, 2.9); g2.disc2(p, 0.8, a); } } }), { name: 'carrinho' });
    T.cast([x - 3.2, y + 0.8], (g) => { RJ.person(g, x - 3.2, y + 0.8, 0, Object.assign(RJ.who(1700 + y * 3), { dir: 0, pose: 'hold', cup: a })); RJ.person(g, x - 4.8, y + 2.0, 0, Object.assign(RJ.who(1701 + y * 3), { dir: 0, pose: 'stand' })); }, {});
  }
  // a living statue painted silver, kids chasing pigeons, a dog
  T.cast([27.5, 13.5], (g) => { const f = g.p(27.5, 13.5, 0); g.fill2([[f[0] - 2.4, f[1] - 2.4], [f[0] + 2.4, f[1] - 2.4], [f[0] + 2.4, f[1]], [f[0] - 2.4, f[1]]], '#BDB6A6', true); RJ.person(g, 27.5, 13.5, 0.7, { skin: '#C9CDD0', hair: '#A9AEB2', top: '#C9CDD0', bot: '#A9AEB2', shoe: '#A9AEB2', dir: 1, pose: 'wave', ph: 0.3, cap: '#A9AEB2' }); }, {});
  for (let k = 0; k < 3; k++) RJ.walker(T, RJ.who(1710 + k, { set: { k: 0.74 } }), [[14 + k * 2, 19.5], [24, 21.4 - k], [18, 22]], 2.2, { phase: k * 0.3 });
  RJ.dog(T, [[-4, 20], [22, 21], [10, 22]], 1.6, '#B07A44', 0.2);
  for (const [x, y] of [[-9.6, 3], [27.6, -1], [8, -12.6]]) T.obj([x, y], (g) => K.lamp(g, x, y, { h: 9, n: 3, col: '#2F3A33' }), { name: 'poste' });
  RJ.walker(T, RJ.who(1720), [[-36, -9], [-10, -9], [-10, 21], [-36, 21]], 1.1, { phase: 0.4 });
  RJ.walker(T, RJ.who(1721, { set: { sunhat: true } }), [[27, -14], [36, -14], [36, 21], [27, 21]], 0.9, { phase: 0.1 });
  /* ---------------- the Floriano monument ---------------- */
  T.obj([7, 1, 11, 5], function (g) {
    K.box(g, 7, 1, 11, 5, 0, 1.0, '#D9D3C6', { w: 0.6 });
    K.box(g, 7.8, 1.8, 10.2, 4.2, 1, 7.4, { t: '#C9C2B2', l: '#D9D3C6', r: '#BDB6A6' }, { w: 0.7 });
    const t = g.p(9, 3, 7.4), B = '#5A6B5E'; g.fill2([[t[0] - 1.4, t[1]], [t[0] + 1.4, t[1]], [t[0] + 1.0, t[1] - 9], [t[0] - 1.0, t[1] - 9]], B, true); g.disc2([t[0], t[1] - 10.2], 1.3, B);
    g.line2([[t[0] + 0.8, t[1] - 7.8], [t[0] + 4, t[1] - 10.5]], { w: 0.8, c: B, boil: false, ext: 0 });
    for (const [dx, dz] of [[-1.2, 2.5], [1.2, 2.0]]) { const p = g.p(9 + dx, 4.4, dz); g.fill2([[p[0] - 1, p[1]], [p[0] + 1, p[1]], [p[0] + 0.7, p[1] - 5], [p[0] - 0.7, p[1] - 5]], B, true); g.disc2([p[0], p[1] - 5.8], 0.9, B); }
  }, { name: 'monumento' });

  /* ---------------- the Bola Preta: the band and its crowd going round the square ---------------- */
  const LP = [[-5, -9], [23, -9], [23, 15], [-5, 15]], seg = [], LL = [0];
  for (let i = 0; i < 4; i++) { const a = LP[i], b = LP[(i + 1) % 4]; seg.push([a, b]); LL.push(LL[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const TOT = LL[4], SPD = 1.1;
  const onLoop = (d) => { d = ((d % TOT) + TOT) % TOT; let i = 0; while (i < 3 && d > LL[i + 1]) i++; const [a, b] = seg[i], u = (d - LL[i]) / (LL[i + 1] - LL[i]); return { x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), dx: Math.sign(b[0] - a[0]), dy: Math.sign(b[1] - a[1]) }; };
  const dirOf = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3);
  // the flag of the black ball, carried at the front
  T.actor({ sample: 0.3, period: TOT / SPD,
    at(t) { const p = onLoop(t * SPD + 3), ph = Math.floor((t * 1.3) % 1 * 6); return { x: p.x, y: p.y, key: dirOf(p.dx, p.dy) + '.' + ph, dir: dirOf(p.dx, p.dy), ph }; },
    draw(g, st) {
      const r = RJ.person(g, 0, 0, 0, Object.assign(RJ.who(1530, { carnaval: false }), { dir: st.dir, pose: 'walk', ph: st.ph / 6, top: '#F6F4EE', dots: true, hands: [[1.2, -15], [1.6, -19]] }));
      const h = r.hands[1], top = [h[0], h[1] - 12]; g.line2([[h[0], h[1] + 4], top], { w: 0.5, c: '#6E5A44', boil: false, ext: 0 });
      const wv = (u) => Math.sin(u * 3 + st.ph) * 1.0 * u, W = 12, H = 8, cl = [];
      for (let k = 0; k <= 6; k++) cl.push([top[0] + W * k / 6, top[1] + wv(k / 6)]); for (let k = 6; k >= 0; k--) cl.push([top[0] + W * k / 6, top[1] + H + wv(k / 6)]);
      g.fill2(cl, '#F6F4EE', true); g.disc2([top[0] + W * 0.5, top[1] + H * 0.5 + wv(0.5)], 2.6, '#1F1C1A'); g.line2(cl, { w: 0.35, c: '#5A564E', close: true, boil: false });
    } });
  // the band: two trombones, two trumpets, a sousaphone, a snare and a surdo
  const BAND = ['tromb', 'tromb', 'trump', 'trump', 'tuba', 'caixa', 'surdo'];
  BAND.forEach((ins, k) => { const look = RJ.who(1540 + k, { carnaval: false, set: { top: '#2A2622', bot: '#F6F4EE', bare: false, shorts: false, dress: undefined, cap: '#F6F4EE', drum: ins === 'caixa' || ins === 'surdo' ? ins : undefined } });
    T.actor({ sample: 0.3, period: TOT / SPD,
      at(t) { const back = 2.4 + Math.floor(k / 2) * 2.2, side = (k % 2 ? 1 : -1) * 1.4, p = onLoop(t * SPD + 3 - back), x = p.x - p.dy * side, y = p.y + p.dx * side, ph = Math.floor((t * 1.6 + k * 0.2) % 1 * 8); return { x, y, key: dirOf(p.dx, p.dy) + '.' + ph, dir: dirOf(p.dx, p.dy), ph: ph / 8 }; },
      draw(g, st) {
        const blow = ins !== 'caixa' && ins !== 'surdo', sg = st.dir === 0 || st.dir === 3 ? 1 : -1;
        const r = RJ.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: blow ? 'stand' : 'hold', ph: st.ph, hands: blow ? [[2.6, -17.4], [4.2, -17.0]] : undefined }));
        if (!blow) return; const h = r.hands[1], hd = r.head, back = st.dir >= 2;
        if (back) return;
        if (ins === 'tuba') { g.fill2(arcPts(hd[0] + sg * 1, hd[1] + 5, 3.4, 0, TAU, 12), '#E2B84A', true); g.fill2(arcPts(hd[0] - sg * 2, hd[1] - 3, 2.6, 0, TAU, 10).map((q) => [q[0], hd[1] - 3 + (q[1] - hd[1] + 3) * 0.6]), '#F2D27A', true); g.ring2([hd[0] + sg * 1, hd[1] + 5], 3.4, { w: 0.4, c: '#8A6A1E' }); }
        else { const L = ins === 'tromb' ? 9 : 6; g.line2([[hd[0] + sg * 1.6, hd[1] + 1.4], [hd[0] + sg * (1.6 + L), hd[1] + 2.4]], { w: 0.7, c: '#E2B84A', boil: false, ext: 0 }); g.disc2([hd[0] + sg * (1.6 + L), hd[1] + 2.4], 1.4, '#F2D27A'); if (ins === 'tromb') g.line2([[hd[0] + sg * 3, hd[1] + 3.6], [hd[0] + sg * 8, hd[1] + 4.2]], { w: 0.5, c: '#E2B84A', boil: false, ext: 0 }); void h; }
      } }); });
  // the crowd: polka dots, sailor hats, wings, flower crowns; they dance after the band in a loose snake
  const NC = 26;
  for (let k = 0; k < NC; k++) {
    const R2 = RNG(1560 + k), look = RJ.who(1560 + k, { set: R2() < 0.7 ? { top: '#F6F4EE', dots: true, dress: R2() < 0.3 ? '#F6F4EE' : undefined, bare: true } : {} });
    if (look.dress) look.dots = true;
    const back = 9 + k * 0.85 + R2() * 1.5, side = (R2() - 0.5) * 6.4;
    T.actor({ sample: 0.3, period: TOT / SPD,
      at(t) { const p = onLoop(t * SPD + 3 - back), x = p.x - p.dy * side, y = p.y + p.dx * side, q = Math.floor((t * 1.8 + k * 0.37) % 1 * 8), cheer = (k + Math.floor(t * 0.7)) % 3 === 0; return { x, y, key: dirOf(p.dx, p.dy) + '.' + q + (cheer ? 'c' : ''), dir: dirOf(p.dx, p.dy), ph: q / 8, cheer }; },
      draw(g, st) { RJ.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.cheer ? 'cheer' : 'walk', ph: st.ph })); } });
  }
  // confetti and streamers over the band
  T.actor({ sample: 0.3, period: TOT / SPD, layer: 'top', grow: false,
    at(t) { const p = onLoop(t * SPD - 6), f = Math.floor(t * 4) % 6; return { x: p.x, y: p.y, z: 9, key: f, f }; },
    draw(g, st) { const R3 = RNG(77 + st.f), c = g.p(0, 0, 0), seg = []; for (let i = 0; i < 40; i++) { const x = c[0] + (R3() - 0.5) * 60, y = c[1] + (R3() - 0.5) * 30; seg.push([x, y, R3.pick(['#E86A9A', '#F2C230', '#2F6DB5', '#3A9A5B', '#D9463B', '#F6F4EE'])]); } for (const [x, y, col] of seg) g.fill2([[x - 0.5, y - 0.3], [x + 0.5, y - 0.3], [x + 0.5, y + 0.3], [x - 0.5, y + 0.3]], col, true); } });

  /* ---------------- the VLT ---------------- */
  T.actor({ sample: 0.25, period: 26, grow: false,
    at(t) { const u = (t / 26) % 1, x = lerp(-60, 60, u), a = clamp(Math.min((x + 44) / 8, (44 - x) / 8), 0, 1); if (a <= 0.02) return null; return { x: x + 7.5, y: 27.4, key: 'v', alpha: a < 1 ? a : null }; },
    draw(g) { g.at(-7.5, -1.4, 0, (g2) => RJ.vlt(g2, 0)); } });
  T.obj([-24, 29.4, -18, 31], (g) => { K.box(g, -24, 29.4, -18, 31, 0, 0.3, '#D9D3C6', { w: 0.4 }); for (const x of [-23.6, -18.4]) { const a = g.p(x, 30.6, 0.3), b = g.p(x, 30.6, 4.6); g.segs2([a[0], a[1], b[0], b[1]], '#6E6A60', 0.5); } g.fill([[-24.4, 29, 4.6], [-17.6, 29, 4.6], [-17.6, 31.4, 4.6], [-24.4, 31.4, 4.6]], 'rgba(200,226,236,0.7)'); g.outline([[-24.4, 29, 4.6], [-17.6, 29, 4.6], [-17.6, 31.4, 4.6], [-24.4, 31.4, 4.6]], { w: 0.5, boil: false }); }, { name: 'parada vlt' });
  for (const [x, s] of [[-22.5, 1590], [-20, 1591]]) T.cast([x, 30.4], (g) => RJ.person(g, x, 30.4, 0.3, Object.assign(RJ.who(s, { carnaval: false }), { dir: 3, pose: 'hold', phone: s % 2 === 0 })), {});
  RJ.walker(T, RJ.who(1592), [[-36, 33], [36, 33]], 1.2, { phase: 0.2 });
  RJ.walker(T, RJ.who(1593, { set: { marin: true } }), [[36, 21], [-36, 21]], 1.0, { phase: 0.7 });
  T.cast([16, 20], (g) => { for (let i = 0; i < 6; i++) { const p = g.p(14 + i * 1.2, 20 + (i % 2) * 0.8, 0); g.fill2(arcPts(p[0], p[1] - 0.8, 0.9, 0, TAU, 6).map((q) => [q[0], p[1] - 0.8 + (q[1] - p[1] + 0.8) * 0.6]), '#8C8A88', true); g.disc2([p[0] + 0.8, p[1] - 1.4], 0.45, '#7A7876'); } }, {});

  /* ---------------- the Museum of Tomorrow on the pier ---------------- */
  T.obj([-30, -81, 26, -68], function (g) {
    g.boilP = 0.15;
    const z0 = 0.4, W = { t: '#F3F2EE', l: '#F6F5F1', r: '#DFDDD6' };
    K.box(g, -26, -79, 24, -70, z0, z0 + 4.4, W, { w: 0.8 });
    g.fill(K.on('L', -69.97, -24, 22, z0 + 0.4, z0 + 3.4), '#AFC9D3');
    for (let x = -22; x < 22; x += 3) g.line([[x, -69.95, z0 + 0.4], [x, -69.95, z0 + 3.4]], { w: 0.3, c: '#7E97A3', boil: false });
    // the spine with its fins rising either side, and the roof's long cantilever over the pool
    const spine = [[-30, -74.5, z0 + 7.6], [32, -74.5, z0 + 6.4]];
    for (let k = 0; k <= 22; k++) {
      const x = lerp(-28, 30, k / 22), zt = lerp(z0 + 9.8, z0 + 6.8, k / 22) + Math.sin(k / 22 * Math.PI) * 1.2, zb = z0 + 4.4;
      g.fill([[x, -79.6, zb], [x + 1.4, -79.6, zb], [x + 1.2, -74.5, zt], [x - 0.2, -74.5, zt]], '#E6E4DE'); g.fine([[x, -79.6, zb], [x - 0.2, -74.5, zt]], { w: 0.3, c: '#9A9890' });
    }
    for (let k = 0; k <= 22; k++) {
      const x = lerp(-28, 30, k / 22), zt = lerp(z0 + 9.8, z0 + 6.8, k / 22) + Math.sin(k / 22 * Math.PI) * 1.2, zb = z0 + 4.4;
      g.fill([[x - 0.2, -74.5, zt], [x + 1.2, -74.5, zt], [x + 1.4, -69.4, zb], [x, -69.4, zb]], '#F8F7F3'); g.fine([[x - 0.2, -74.5, zt], [x, -69.4, zb]], { w: 0.3, c: '#9A9890' });
    }
    g.line(spine, { w: 0.9, boil: false });
    g.line([[-28, -69.4, z0 + 4.4], [31, -69.4, z0 + 4.4]], { w: 0.7, boil: false });
    for (const x of [27, 31]) { const a = g.p(x, -69.6, z0), b = g.p(x, -69.6, z0 + 4.6); g.segs2([a[0], a[1], b[0], b[1]], '#9A9890', 0.5); }
  }, { name: 'museu do amanhã' });
  for (const [x, y, s, d] of [[-14, -66, 1600, 0], [-4, -65.6, 1601, 1], [10, -66.2, 1602, 3], [20, -65.4, 1603, 0]]) T.cast([x, y], (g) => RJ.person(g, x, y, 0.4, Object.assign(RJ.who(s), { dir: d, pose: s % 2 ? 'hold' : 'stand', phone: s % 2 === 1 })), {});
  RJ.walker(T, RJ.who(1605), [[-30, -66.8], [30, -66.8]], 0.9, { phase: 0.4, z: 0.4 });
});
