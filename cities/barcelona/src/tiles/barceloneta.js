'use strict';
/* (100,-100) La Barceloneta, the old fishermen's quarter and its beach, on the right corner (the sea is at +x).
   Built: three rows of narrow four-storey houses (Barceloneta's "quarts de casa": narrow, tall-windowed, laundry and
   senyeres on every balcony) with lanes between; the Passeig Marítim with palms; the sand, which runs on past the
   tile's edge to the water. On the sand: L'Estel Ferit (Rebecca Horn's four rusty cubes stacked off true), a
   chiringuito (a beach bar under a canvas roof), a volleyball net, a red lifeguard chair, umbrellas and towels; at
   the far end the golden lattice of Gehry's fish (El Peix) on its low podium.
   Who: sunbathers on towels, a family with a sandcastle, people at the chiringuito with drinks, a beer-and-water
   seller walking the sand, the lifeguard, a game of volleyball (players and the ball on a timetable), strollers and
   a skater on the Passeig, old neighbours on their balconies. In the sea: swimmers and a paddle-boarder. */
SF.tile('barceloneta', 100, -100, { rim: 36 }, function (T) {
  const SAND = BP.sand;
  T.ground(function (g) {
    BC.ground(g, '#E3DCCB');
    // the Passeig Marítim, then the sand to the tile's edge (the streets tile carries it on to the water)
    g.fill(K.rect(-6, -37, 6, 37), '#E3DACA'); g.scuff(K.rect(-6, -37, 6, 37), { dir: Math.atan2(AY, -AX), len: 3, c: '#EFE9DC', dens: 0.6, w: 0.45, spread: 0.5 });
    const sand = BC.oct(0, 0, 37, 10).filter((p) => p[0] > 6).concat([[6, 37], [6, -37]]);
    const sp = [[6, -37], [27, -37], [37, -27], [37, 27], [27, 37], [6, 37]].map(([x, y]) => [x, y, 0]);
    g.fill(sp, SAND); g.scuff(sp, { dir: -0.4, len: 1.6, c: BP.sandD, dens: 0.6, w: 0.45, spread: 1.2 }); void sand;
    for (const tri of [[[27, 37, 0], [37, 27, 0], [37, 37, 0]], [[37, -27, 0], [27, -37, 0], [37, -37, 0]]]) g.fill(tri, SAND);
    g.line([[6, -37, 0], [6, 37, 0]], { w: 0.5, c: '#B8A57E', boil: false });
    // footprints and towels
    const R = RNG(1201), tw = [[14, -24, '#E07A5A'], [19, -20, '#4F8FBF'], [24, -27, '#E6C24F'], [15, 4, '#D98AA4'], [20, 10, '#7DBF9A'], [28, 4, '#F3F1EA'], [16, 26, '#C9392E'], [30, 18, '#3F6FA8'], [23, 30, '#E6C24F']];
    for (const [x, y, c] of tw) { const q = [[x - 1.3, y - 2.6, 0.02], [x + 1.3, y - 2.6, 0.02], [x + 1.3, y + 2.6, 0.02], [x - 1.3, y + 2.6, 0.02]]; g.fill(q, c); g.fill([[x - 1.3, y - 0.4, 0.03], [x + 1.3, y - 0.4, 0.03], [x + 1.3, y + 0.4, 0.03], [x - 1.3, y + 0.4, 0.03]], '#F6F1E4'); g.outline(q, { w: 0.3, c: shade(c, 0.4), boil: false }); }
    void R;
    // the volleyball court lines
    g.outline([[19, -12, 0.02], [33, -12, 0.02], [33, -4, 0.02], [19, -4, 0.02]], { w: 0.5, c: '#3F6FA8', boil: false });
  }, { rim: true });

  /* ---- the houses: three rows, each split into narrow houses ---- */
  const COLS = ['#EDD9B6', '#E9C9A0', '#F0E2C8', '#E6BFA0', '#EAD3AE', '#F2E6CF', '#DCC7A8'];
  const rows = [[-37, -30.5], [-28, -21.5], [-19, -12.5]];
  let hs = 1;
  rows.forEach(([x0, x1], ri) => {
    for (let y = -30; y < 26; y += 9.5) {
      const y0 = y, y1 = Math.min(y + 8.2, 27); let poly = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
      if (ri === 0 && y0 < -26) poly = [[x0, -27], [x0 + 3, -30], [x1, -30], [x1, y1], [x0, y1]];
      const seed = 1300 + hs++, z = 12 + (seed % 3) * 1.4;
      const pl = poly.map((p) => [Math.max(p[0], -37), p[1]]);
      T.obj(BC.bbox(pl), (g) => {
        const F = BC.house(g, { poly: pl, z, seed, gf: 3.8, fl: 2.9, bay: 2.2, col: COLS[seed % COLS.length], flags: 0.35, shops: (f, i) => (ri === 2 && f.n[0] > 0.5 ? (i % 2 ? 'bar' : 'shop') : (h1(seed + i) < 0.4 ? 'door' : null)) });
        // laundry hanging from the balcony rails on the visible faces
        const R = RNG(seed * 7);
        for (const f of F) if (f.vis && f.L > 3) for (let k = 1; k < 3; k++) { const z0 = 3.8 + k * 2.9 + 1.0; if (R() < 0.45) continue; const a = f.L * (0.2 + R() * 0.6); for (let j = 0; j < 3; j++) { const c = g.p.apply(g, f.P(a + j * 0.7 - 0.7, z0, 0.9)); g.fill2([[c[0] - 0.9, c[1]], [c[0] + 0.9, c[1]], [c[0] + 0.8, c[1] + 2.2], [c[0] - 0.8, c[1] + 2.2]], R.pick(['#F3F1EA', '#5F8FC9', '#E6C24F', '#C9584B', '#8FBF73', '#D98AA4']), true); } }
      }, { name: 'house' });
    }
  });
  // neighbours on balconies of the near row
  for (const [y, s] of [[-14, 1401], [6, 1402]]) T.cast([-12.2, y], (g) => BC.person(g, -12.2, y, 6.8, BC.who(s, { dir: 0, pose: 'stand', hair: '#C9C6BD', noLegs: false })), { on: false });

  /* ---- the Passeig: palms, a lamp, benches ---- */
  for (let y = -32; y <= 32; y += 9) T.obj([0, y], (g) => K.palm(g, 0, y, { h: 14 + h1(y * 3 + 7) * 3, r: 4.8, lean: (h1(y) - 0.5) * 0.7 }), { name: 'palm' });
  for (const y of [-26, 8]) T.cast([4.6, y], (g) => { K.bench(g, 4.6, y, { face: 'R', L: 2.4 }); BC.person(g, 5.7, y - 0.6, 1.3, BC.who(1410 + y, { dir: 0, pose: 'sit', hair: '#C9C6BD' })); }, {});

  /* ---- L'Estel Ferit ---- */
  T.obj([9, 20, 15, 26], function (g) {
    const cube = (x, y, z, s, tw) => { const c = { t: '#B8653A', l: '#A65A34', r: '#8A4828' }; const a = tw; K.rbox(g, x, y, s, s, a, z, z + s * 2, c, { w: 0.7 }); };
    cube(12, 23, 0, 1.6, 0.05); cube(12.3, 23.1, 3.2, 1.6, -0.08); cube(11.8, 22.8, 6.4, 1.6, 0.12); cube(12.6, 23.3, 9.6, 1.6, -0.15);
    const g2 = []; for (let i = 0; i < 4; i++) { const p = g.p(13.6, 24.6, i * 3.2 + 1.6); g2.push(p); } for (const p of g2) g.fill2([[p[0] - 0.8, p[1] - 0.6], [p[0] + 0.8, p[1] - 0.6], [p[0] + 0.8, p[1] + 0.6], [p[0] - 0.8, p[1] + 0.6]], '#CFE0EA', true);
  }, { name: 'estel ferit' });
  /* ---- the chiringuito ---- */
  T.obj([8, -2, 15, 6], function (g) {
    K.box(g, 8.5, -1.5, 13, 4, 0, 3.2, { t: '#C9A26B', l: '#D9B57E', r: '#B58F58' }, { w: 0.7 });
    g.fill(K.on('L', 4.02, 9, 12.5, 2.2, 3.0), '#3F6FA8'); K.text(g, 'L', 4.06, 10.75, 2.35, 0.55, 'XIRINGUITO', '#F6F1E4', { center: true });
    for (const [x, y] of [[8.2, -1.8], [15, -1.8], [15, 5.8], [8.2, 5.8]]) { const a = g.p(x, y, 0), b = g.p(x, y, 6); g.segs2([a[0], a[1], b[0], b[1]], '#8A6A4A', 0.6); }
    const iR = g.cmds.length, roof = [[7.6, -2.4, 6], [15.6, -2.4, 6], [15.6, 6.4, 5.4], [7.6, 6.4, 5.4]]; g.fill(roof, '#F3F1EA');
    for (let i = 0; i < 8; i += 2) g.fill([[7.6 + i, -2.4, 6], [8.6 + i, -2.4, 6], [8.6 + i, 6.4, 5.4], [7.6 + i, 6.4, 5.4]], '#E07A5A');
    g.outline(roof, { w: 0.6, boil: false });
    // at night the beach bar is open late: the bar lit, a string of bulbs round the eaves lighting its striped canvas
    BC.nightCol(g, 0, (c, fill) => (!fill ? undefined : c === '#3F6FA8' ? c : c === '#D9B57E' ? '#FFC874' : BC.floodCol(c, 0.6, '#FFD49A')), { to: iR }); BC.nightCol(g, 0, (c, fill) => (!fill && c === '#F6F1E4' ? '#FFF6E0' : undefined), { lines: true, to: iR });
    BC.nightCol(g, iR, (c, fill) => (fill ? BC.floodCol(c, 0.55, '#FFD08A') : undefined));
    for (let i = 0; i <= 6; i++) { g.glow('lantern', lerp(7.8, 15.4, i / 6), 6.3, lerp(5.45, 5.4, i / 6) - 0.3, { r: 0.6, col: '#FFD27A' }); g.glow('lantern', 15.5, lerp(6.2, -2.2, i / 6), lerp(5.4, 6, i / 6) - 0.3, { r: 0.6, col: '#FFD27A' }); }
    g.glow('lamp', 11, 4.4, 4.6, { r: 1.2 });
  }, { name: 'chiringuito' });
  // stools and drinkers at the bar's counter (drawn as one piece so the stools never cover them)
  T.cast([13.6, 4.8], (g) => { for (const [x, y, s] of [[10, 4.9, 1420], [11.8, 4.9, 1421], [13.6, 4.9, 1422]]) { const a = g.p(x, y, 0), b = g.p(x, y, 1.6); g.segs2([a[0], a[1], b[0], b[1]], '#5A4632', 0.5); g.fill2(arcPts(b[0], b[1], 1.2, 0, TAU, 8).map((q) => [q[0], b[1] + (q[1] - b[1]) * 0.45]), '#C9584B', true); const r = BC.person(g, x, y, 1.6, BC.who(s, { dir: 2, pose: 'sit', shorts: true, bare: true })); void r; } }, {});
  T.cast([14.6, 1.0], (g) => BC.person(g, 14.6, 1.0, 0, BC.who(1425, { dir: 1, pose: 'hold', top: '#3F6FA8' })), {});
  /* ---- the lifeguard chair, umbrellas ---- */
  T.obj([30, -20], function (g) {
    const f = g.p(30, -20, 0), t = g.p(30, -20, 7);
    g.segs2([f[0] - 2.4, f[1], t[0] - 1.2, t[1], f[0] + 2.4, f[1], t[0] + 1.2, t[1], f[0] - 1.8, f[1] - 8, f[0] + 1.8, f[1] - 8], '#C9392E', 0.8);
    g.fill2([[t[0] - 1.8, t[1]], [t[0] + 1.8, t[1]], [t[0] + 1.8, t[1] - 1.2], [t[0] - 1.8, t[1] - 1.2]], '#C9392E', true);
    BC.person(g, 30, -20, 7.2, BC.who(1430, { dir: 0, pose: 'sit', top: '#C9392E', shorts: true, cap: '#F3F1EA' }));
    const fl = [t[0] + 2, t[1] - 8]; g.segs2([t[0] + 2, t[1], fl[0], fl[1]], '#5A564E', 0.35); g.fill2([[fl[0], fl[1]], [fl[0] + 4, fl[1] + 1], [fl[0], fl[1] + 2.2]], '#E6C24F', true);
  }, { name: 'lifeguard' });
  for (const [x, y, c] of [[16.5, -22.5, '#E07A5A'], [21.5, 12, '#3F6FA8'], [18.5, 28, '#E6C24F'], [31, 6, '#F3F1EA'], [27, -30, '#7DBF9A']]) T.obj([x, y], (g) => { const b = g.p(x, y, 0), t = g.p(x, y, 6); g.segs2([b[0], b[1], t[0], t[1]], '#6E6A60', 0.4); const um = arcPts(t[0], t[1] + 3, 8.4, Math.PI * 1.1, Math.PI * 1.9, 10).concat([[t[0], t[1] - 1]]); g.fill2(um, c, true); for (let i = 1; i < 10; i += 2) { const a = Math.PI * (1.1 + 0.08 * i); g.fill2([[t[0], t[1] - 1], [t[0] + Math.cos(a) * 8.4, t[1] + 3 + Math.sin(a) * 8.4], [t[0] + Math.cos(a + 0.25) * 8.4, t[1] + 3 + Math.sin(a + 0.25) * 8.4]], '#F6F1E4', true); } g.line2(um.slice(0, 11), { w: 0.4, c: shade(c, 0.5), boil: false }); }, { name: 'umbrella', bias: 3 });
  /* ---- El Peix, Gehry's golden fish, at the far end ---- */
  T.obj([16, -37, 36, -30], function (g) {
    K.box(g, 17, -36.5, 35, -31, 0, 3, { t: '#D9D3C6', l: '#E6DDCB', r: '#CFC4AE' }, { w: 0.7 });
    const P = (u, v) => g.p(26 + u, -33.5, 3 + v), body = [P(-11, 6), P(-6, 10), P(2, 11.5), P(8, 9), P(11, 5), P(8, 3.5), P(2, 2.8), P(-6, 3.5)], tail = [P(-11, 6), P(-15, 11), P(-14, 6), P(-15, 2)];
    g.fill2(tail, '#D8AE48', true); g.fill2(body, '#E2BA5A', true);
    const lat = []; for (let i = 0; i < 14; i++) { const a = P(-10 + i * 1.5, 3), b = P(-8 + i * 1.5, 11); lat.push(a[0], a[1], b[0], b[1]); } g.segs2(lat, '#B8913A', 0.35);
    g.line2(body.concat([body[0]]), { w: 0.6, c: '#8A6A2C', boil: false }); g.line2(tail, { w: 0.5, c: '#8A6A2C', boil: false });
    for (const [u, v] of [[-6, 3.5], [0, 2.9], [6, 3.3]]) { const a = P(u, 0), b = P(u, v); g.segs2([a[0], a[1], b[0], b[1]], '#8A8A84', 0.6); }
    // at night the golden fish is lit from its podium
    BC.nightCol(g, 0, (c, fill) => (fill && (c === '#D8AE48' || c === '#E2BA5A') ? BC.mixA(nightColour(c), c, 0.75) : undefined)); BC.nightCol(g, 0, (c, fill) => (!fill && c === '#B8913A' ? '#E0B04C' : undefined), { lines: true });
    g.glow('lantern', 26, -32, 9, { r: 3.4, col: '#FFD27A' }); g.glow('lantern', 18, -32, 9, { r: 1.8, col: '#FFD27A' });
  }, { name: 'el peix' });

  /* ---- people on the sand ---- */
  const lie = [[14, -24, 1440, -2.4], [19, -20, 1441, -2.4], [24, -27, 1442, -2.4], [15, 4, 1443, -2.4], [20, 10, 1444, -2.4], [28, 4, 1445, -2.4], [16, 26, 1446, -2.4], [30, 18, 1447, -2.4], [23, 30, 1448, -2.4]];
  for (const [x, y, s] of lie) T.cast([x, y], (g) => BC.person(g, x, y, 0.15, BC.who(s, { pose: 'stand', lie: -2.6, shorts: true, bare: true, top: BC.who(s).top, dir: 0 })), {});
  // a family building a sandcastle
  T.cast([25, 22], (g) => { const c = g.p(25.5, 21.2, 0); g.fill2([[c[0] - 3, c[1]], [c[0] + 3, c[1]], [c[0] + 2, c[1] - 3], [c[0] - 2, c[1] - 3]], '#E2CB98', true); g.fill2([[c[0] - 1, c[1] - 3], [c[0] + 1, c[1] - 3], [c[0] + 1, c[1] - 5], [c[0] - 1, c[1] - 5]], '#E2CB98', true); g.outline2([[c[0] - 3, c[1]], [c[0] - 2, c[1] - 3], [c[0] - 1, c[1] - 3], [c[0] - 1, c[1] - 5], [c[0] + 1, c[1] - 5], [c[0] + 1, c[1] - 3], [c[0] + 2, c[1] - 3], [c[0] + 3, c[1]]], { w: 0.4, c: '#A88C5A', boil: false }); BC.person(g, 24, 23, 0, BC.who(1450, { dir: 3, pose: 'kneel', k: 0.72, shorts: true, bare: true, hands: [[3, -3], [4, -2]] })); BC.person(g, 27.4, 22.6, 0, BC.who(1451, { dir: 2, pose: 'kneel', k: 0.68, shorts: true, hands: [[3, -3], [2, -2]] })); }, {});
  // the volleyball game: two a side, the ball arcing over the net
  T.obj([25.8, -12, 26.2, -4], (g) => { const a = g.p(26, -12, 0), b = g.p(26, -4, 0), a2 = g.p(26, -12, 6), b2 = g.p(26, -4, 6); g.segs2([a[0], a[1], a2[0], a2[1], b[0], b[1], b2[0], b2[1]], '#5A564E', 0.5); const n = []; for (let i = 0; i <= 8; i++) { const t = i / 8, p = [lerp(a2[0], b2[0], t), lerp(a2[1], b2[1], t)]; n.push(p[0], p[1], p[0], p[1] + 5); } for (let k = 0; k < 4; k++) { const z = 4.6 + k * 0.4, p = g.p(26, -12, z), q = g.p(26, -4, z); n.push(p[0], p[1], q[0], q[1]); } g.segs2(n, '#3A3530', 0.2); g.line2([a2, b2], { w: 0.6, c: '#F3F1EA', boil: false }); }, { name: 'net' });
  const VP = 4.0, players = [[21.5, -9.8, 0], [23.5, -6, 0], [29, -10, 1], [30.6, -6.4, 1]];
  players.forEach(([x, y, side], i) => { const look = BC.who(1460 + i, { shorts: true, bare: true, top: side ? '#E6C24F' : '#3F6FA8' });
    T.actor({ sample: 5, period: VP * 2, at(t) { const u = ((t / VP) % 2 + 2) % 2, hit = side === 0 ? (u < 0.25) : (u >= 1 && u < 1.25), jump = hit ? Math.sin(Math.PI * ((u % 1) / 0.25)) * 1.4 : 0; return { x, y, z: jump, key: (hit ? 'h' : 's') + Math.round(jump * 4), hit }; },
      draw(g, st) { BC.person(g, 0, 0, 0, Object.assign({}, look, { dir: side ? 2 : 0, pose: st.hit ? 'cheer' : 'crouch', ph: 0.25 })); } }); });
  T.actor({ sample: 0.2, period: VP * 2, layer: 'top', grow: false,
    at(t) { const u = ((t / VP) % 2 + 2) % 2, f = u % 1, from = u < 1 ? [22.5, -8] : [29.8, -8.2], to = u < 1 ? [29.8, -8.2] : [22.5, -8]; return { x: lerp(from[0], to[0], f), y: lerp(from[1], to[1], f), z: 7 + Math.sin(Math.PI * f) * 6, key: 'b' }; },
    draw(g) { const c = g.p(0, 0, 0); g.disc2(c, 1.1, '#F6F3EA'); g.segs2([c[0] - 1, c[1], c[0] + 1, c[1]], '#E6C24F', 0.4); g.ring2(c, 1.1, { w: 0.3, c: '#6E6A60' }); } });
  // the beer-and-water seller walking the sand, strollers and a skater on the Passeig
  BC.walker(T, BC.who(1470, { top: '#F3F1EA', cap: '#C9392E', bag: '#3F6FA8' }), [[11, -30], [33, -16], [12, 18], [33, 32]], 0.9, { phase: 0.1 });
  for (let i = 0; i < 4; i++) BC.walker(T, BC.who(1480 + i, i === 1 ? { sunhat: true, shorts: true } : {}), i % 2 ? [[-3, 34], [-3, -34]] : [[3, -34], [3, 34]], 1.2 + i * 0.1, { phase: h1(i * 5) });
  BC.walker(T, BC.who(1490, { top: '#E07A5A', shorts: true }), [[-1.5, -34], [-1.5, 34]], 3.4, { phase: 0.3 });
  // in the sea: swimmers and a paddle-boarder (heads and arms above the water)
  for (let i = 0; i < 4; i++) T.actor({ sample: 0.5, period: 20, grow: false,
    at(t) { const x = 55 + i * 4 + Math.sin(t * 0.3 + i) * 2, y = -30 + i * 14 + Math.sin(t * 0.2 + i * 2) * 4, f = Math.floor(t * 2 + i) % 2; return { x, y, z: BST.WZ, key: f, f }; },
    draw(g, st) { const c = g.p(0, 0, 0); g.fill2(arcPts(c[0], c[1], 2.4, 0, TAU, 10).map((q) => [q[0], c[1] + (q[1] - c[1]) * 0.4]), '#BEDDDC', true); g.disc2([c[0], c[1] - 1.4], 1.3, SKIN[(i * 2) % 6]); g.fill2(arcPts(c[0], c[1] - 1.8, 1.35, Math.PI, TAU, 6), HAIR[i % 4], true); g.line2([[c[0] + 1, c[1] - 1], [c[0] + (st.f ? 3.4 : 2.4), c[1] - (st.f ? 3.4 : 1.2)]], { w: 0.9, c: SKIN[(i * 2) % 6], boil: false }); } });
  T.actor({ sample: 0.4, period: 40, grow: false,
    at(t) { const u = (t / 40) % 1, y = lerp(-34, 34, u < 0.5 ? u * 2 : 2 - u * 2), x = 68; return { x, y, z: BST.WZ, key: u < 0.5 ? 1 : 0, d: u < 0.5 }; },
    draw(g, st) { const a = st.d ? Math.PI / 2 : -Math.PI / 2; K.rbox(g, 0, 0, 2.6, 0.55, a, 0, 0.25, { t: '#E6C24F', l: '#D8AE48', r: '#B8913A' }, { w: 0.4 }); const r = BC.person(g, 0, 0, 0.25, BC.who(1495, { dir: st.d ? 1 : 3, pose: 'stand', hands: [[3, -14], [2.5, -10]], shorts: true, bare: true })); const h = r.hands[0]; g.line2([h, [h[0] + 1, h[1] + 12]], { w: 0.5, c: '#5A4632', boil: false }); } });

  BC.block(T, { noTrees: ['x+', 'y-'], corners: { nn: 'motos', np: 'bins' } });
});
