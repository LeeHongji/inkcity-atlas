'use strict';
/* (-100,0) Chiado and Bica, the hill west of the Baixa.
   The ground climbs to the west in two steps of stone retaining wall: a middle terrace (z 7) and the top of the hill
   (z 13) along the whole west side. Down the south of the tile runs the Rua da Bica de Duarte Belo, carried on an
   embankment: a steep stone street with steps either side of one funicular track that splits into a passing loop half
   way. The Ascensor da Bica's two yellow cars (stepped floors, a white roof, BICA on the side) are tied by their cable:
   one climbs while the other comes down, and they pass each other at the loop (the moment of this place). Tall narrow
   houses line the street's north side, each standing where the street meets it, with washing strung across to the
   parapet and pots of basil on the balconies. On the top of the hill: the Miradouro de Santa Catarina with its rock
   giant Adamastor and young people on the grass looking at the river; in the far corner A Brasileira, the green and
   gold café front, with Fernando Pessoa in bronze at his table and tourists sitting beside him.
   At the foot of the street, people drinking outside a bar.
   At night: the funicular's cars lit as they pass, the houses' lanterns down the steep street, A Brasileira's green
   front glowing gold, lamps along Santa Catarina's parapet over the young crowd, the bars at the foot. */
SF.tile('bica', -100, 0, { rim: 12 }, function (T) {
  const H = 37, ZM = 7, ZW = 13, XB = 32, XT = -16, Y0 = 21.5, Y1 = 30.5, YC = 26;
  const zs = (x) => ZW * clamp((XB - x) / (XB - XT), 0, 1);           // the street's height
  T.ground(function (g) {
    K.slab(g, H, { top: LC.calc });
    LX.pave(g, -H, Y1, H, H, { edge: 's' });
    LX.pave(g, 10, -H, H, Y0, { edge: '' });
  }, { rim: true });

  /* ---------------- the terraces ---------------- */
  T.obj([-H, -H, XT, 9], (g) => {
    LX.terrace(g, -H, -H, XT, 9, 0, ZW, { top: '#E9E2D2' });
  }, { name: 'top terrace n' });
  T.obj([XT, -H, 10, 9], (g) => { LX.terrace(g, XT, -H, 10, 9, 0, ZM, { top: '#E6DFCE' }); for (let x = -12; x < 9; x += 5) LX.win(g, 'L', 9, x, x + 1.2, 1.4, 4.0, { glass: '#6A7F8C' }); }, { name: 'mid terrace' });
  // the miradouro's ground: the hilltop south of the houses, grass sloping a little to its parapet
  T.obj([-H, 9, XT, Y1], function (g) {
    LX.terrace(g, -H, 9, XT, Y1, 0, ZW, { top: '#E9E2D2' });
    const gr = K.rect(-H + 1, 10, XT - 1.5, Y1 - 1.5, ZW + 0.02); g.fill(gr, LC.grass); g.grass(gr, { dens: 0.7 });
    // rooms built into the wall: windows, a door, a tile panel
    for (let b = 0; b < 5; b++) { const m = lerp(-H, XT, (b + 0.5) / 5); if (b === 2) LX.door(g, 'L', Y1, m - 0.8, m + 0.8, 0, 3.4, '#4F6A5E'); else LX.win(g, 'L', Y1, m - 0.6, m + 0.6, 1.4, 3.6, { glass: '#6A7F8C' }); LX.win(g, 'L', Y1, m - 0.55, m + 0.55, 6.2, 8.6, { bal: b % 2 === 1, glass: '#5E7380' }); }
    LX.azulejo(g, 'L', Y1, -31, -22, 10.0, 12.2, 'b', 6);
  }, { name: 'santa catarina' });
  T.obj([-H, Y1 - 0.6, XT, Y1], (g) => LX.parapet(g, 'L', Y1, -H, XT, ZW, { h: 1.1, lamps: 7 }), { on: true, name: 'parapet' });

  /* ---------------- the street on its embankment ---------------- */
  const LOOP = [1.2, 13.2];
  const trackY = (x, k) => { const u = x < LOOP[0] - 3 || x > LOOP[1] + 3 ? 0 : x < LOOP[0] ? (x - LOOP[0] + 3) / 3 : x > LOOP[1] ? (LOOP[1] + 3 - x) / 3 : 1; return YC + k * 1.6 * smooth(u); };
  T.obj([XT, Y0, H, Y1], function (g) {
    g.boilP = 0.15;
    // the south wall of the embankment, the street surface, the steps either side, the rails
    const face = []; for (let x = XT; x <= H + 0.01; x += 2) face.push([x, Y1, zs(x)]); face.push([H, Y1, 0], [XT, Y1, 0]);
    g.fill(face, LC.wall);
    const cs = []; for (let z = 0.9; z < ZW; z += 0.9) { let xa = XT; const xb = XB - z / ZW * (XB - XT); if (xb <= xa) continue; const a = g.p(xa, Y1, z), b = g.p(xb, Y1, z); cs.push(a[0], a[1], b[0], b[1]); }
    g.segs2(cs, '#B5A585', 0.28);
    g.line(face.slice(0, face.length - 2), { w: 0.8, boil: false }); g.line([[XT, Y1, 0], [XT, Y1, ZW]], { w: 0.8, boil: false });
    const top = (y0, y1, col) => { const q = []; for (let x = XT; x <= H + 0.01; x += 2) q.push([x, y0, zs(x) + 0.02]); for (let x = H; x >= XT - 0.01; x -= 2) q.push([x, y1, zs(x) + 0.02]); g.fill(q, col); };
    top(Y0, Y1, '#E8E1D0'); top(Y0 + 2.6, Y1 - 2.6, LC.setts);
    for (const [ya, yb] of [[Y0, Y0 + 2.4], [Y1 - 2.4, Y1]]) { const st = []; for (let x = XT; x < XB; x += 0.9) { const a = g.p(x, ya, zs(x) + 0.03), b = g.p(x, yb, zs(x) + 0.03); st.push(a[0], a[1], b[0], b[1]); } g.segs2(st, '#B9AE96', 0.3); }
    for (const k of [-1, 1]) for (const r of [-0.6, 0.6]) { const pts = []; for (let x = XT; x <= H; x += 1) pts.push([x, trackY(x, k) + r, zs(x) + 0.05]); g.fine(pts, { w: 0.4, c: LC.rail }); }
    // a tile plaque on the wall
    const m = 20; K.sign(g, 'L', Y1, m - 6, m + 6, 0.6, 2.2, '#EEF0EC', 'ASCENSOR DA BICA', { ink: '#2F4F80' });
  }, { name: 'bica street' });
  // the stations: the little top house on the hill, a shelter at the foot
  T.obj([XT - 6, Y0 + 1, XT, Y1 - 1], (g) => { const z = ZW; K.box(g, XT - 6, Y0 + 1, XT, Y1 - 1, z, z + 5.6, { t: '#E9E3D6', l: '#F6F3EB', r: '#E1DBCE' }, { w: 0.8 }); LX.door(g, 'R', XT, YC - 1.2, YC + 1.2, z, 3.8, '#3F5F4F'); K.hip(g, XT - 6.4, Y0 + 0.6, XT + 0.4, Y1 - 0.6, z + 5.6, 2.0, LC.roof, { c: LC.roofD }); }, { on: true, name: 'top station' });

  /* ---------------- the houses along the street ---------------- */
  [[-16, -6, 3, 'y', 81], [-6, 4, 3, null, 82], [4, 14, 3, 'b', 83], [14, 24, 3, null, 84], [24, 34, 2, 'g', 85]].forEach(([x0, x1, n, az, sd]) => {
    const z = zs(x1);
    T.obj([x0, 9.5, x1, Y0], (g) => LX.house(g, { x0, y0: 9.5, x1, y1: Y0, z, n, az, seed: sd, wash: true, bal: 0.9, door: 'L', shop: sd === 85 ? 'TABERNA' : null, sc: '#7A2E2A' }), { name: 'street house' });
  });
  // the lower Bica: houses on the street level towards the Rua de São Paulo, backing onto the middle terrace
  [[10, -36, 22, -24, 3, null, 86], [24, -36, 36, -26, 3, 'b', 87], [12, -20, 22, -8, 2, null, 88], [25, -21, 36, -10, 2, 'y', 89]].forEach(([x0, y0, x1, y1, n, az, sd]) =>
    T.obj([x0, y0, x1, y1], (g) => LX.house(g, { x0, y0, x1, y1, n, az, seed: sd, wash: sd % 2 === 0, door: 'L', shop: sd === 89 ? 'CERVEJARIA' : sd === 88 ? 'PADARIA' : null }), { name: 'lower house' }));
  // upper houses on the middle terrace and the top
  [[-14, -35, -2, -24, 2, null, 91], [0, -34, 9, -22, 2, 'g', 92], [-13, -18, -3, -8, 1, 'b', 93], [-1, -18, 8, -7, 1, null, 94]].forEach(([x0, y0, x1, y1, n, az, sd]) =>
    T.obj([x0, y0, x1, y1], (g) => LX.house(g, { x0, y0, x1, y1, z: ZM, n, az, seed: sd, wash: true, roof: sd === 94 ? 'flat' : 'hip' }), { on: true, name: 'mid house' }));

  /* ---------------- A Brasileira and Pessoa ---------------- */
  T.obj([-35, -35, -20, -16], function (g) {
    LX.house(g, { x0: -35, y0: -35, x1: -20, y1: -16, z: ZW, n: 3, col: '#EFE6D4', seed: 95, bal: 1, faces: 'LR' });
    // the green and gold front
    const p = -16, z = ZW; g.fill(K.on('L', p + 0.08, -34.5, -20.5, z, z + 4.4), '#2F5A44');
    for (let x = -33.5; x < -21; x += 3) { const q = K.on('L', p + 0.1, x, x + 1.8, z + 0.4, z + 3.4); g.fill(q, '#B9C9C2'); g.mark({ nc: '#FFCF86', spill: true }); g.outline(q, { w: 0.35, c: '#C9A44A', boil: false }); }   // (the café's gold interior at night)
    { const i0 = g.cmds.length; K.sign(g, 'L', p + 0.1, -34, -21, z + 3.5, z + 4.3, '#2F5A44', 'A BRASILEIRA', { ink: '#E9C766', c: '#C9A44A' }); g.mark({ nc: '#3C7458' }, i0); }
    for (const x of [-33, -27.5, -22]) g.glow('lamp', x, p + 0.7, z + 4.9, { r: 1.3, base: z });
  }, { on: true, name: 'a brasileira' });
  T.cast([-27, -12.5], function (g) {
    const z = ZW;
    // the bronze poet at his table, his empty chair beside him, a tourist sitting in it; café tables
    const tt = g.p(-27, -12.5, z + 2.4), tb = g.p(-27, -12.5, z); g.segs2([tb[0], tb[1], tt[0], tt[1]], '#3C4A42', 0.5); g.fill2(arcPts(tt[0], tt[1], 2.2, 0, TAU, 12).map((q) => [q[0], tt[1] + (q[1] - tt[1]) * 0.5]), '#4E5E56', true);
    K.box(g, -29.4, -13.1, -28.2, -11.9, z + 0.9, z + 1.3, { t: '#4E5E56', l: '#55665C', r: '#46554D' }, { w: 0.3, boil: false });
    const r = K.person(g, -28.8, -12.5, z + 1.3, { skin: '#55705F', hair: '#3C5449', top: '#4E6A5E', bot: '#4E6A5E', shoe: '#3C5449', dir: 0, pose: 'sit', glasses: true, hairStyle: 'short' });
    g.fill2([[r.crown[0] - 2.4, r.crown[1] + 0.9], [r.crown[0] + 2.4, r.crown[1] + 0.9], [r.crown[0] + 1.6, r.crown[1] - 0.3], [r.crown[0] + 1.4, r.crown[1] - 1.4], [r.crown[0] - 1.4, r.crown[1] - 1.4], [r.crown[0] - 1.6, r.crown[1] - 0.3]], '#3C5449', true);
    K.box(g, -25.8, -13.1, -24.6, -11.9, z + 0.9, z + 1.3, { t: '#B9824A', l: '#A87440', r: '#94653A' }, { w: 0.3, boil: false });
    LX.person(g, -25.2, -12.5, z + 1.3, LX.who(700, { dir: 1, pose: 'sit', hat: '#E9D8A6' }));
    LX.person(g, -23.2, -9.6, z, LX.who(701, { dir: 2, pose: 'hold', reach: [-0.4, -12.5], phone: true }));
  }, { on: true, name: 'pessoa' });
  [[-33, -9], [-19.5, -9.5]].forEach(([x, y], i) => T.cast([x, y], function (g) {
    const tt = g.p(x, y, ZW + 2.4), tb = g.p(x, y, ZW); g.segs2([tb[0], tb[1], tt[0], tt[1]], '#3A3530', 0.45); g.fill2(arcPts(tt[0], tt[1], 2.2, 0, TAU, 12).map((q) => [q[0], tt[1] + (q[1] - tt[1]) * 0.5]), '#F3F1EA', true);
    for (const [dx, d, k] of [[-1.7, 0, 0], [1.7, 1, 1]]) { K.box(g, x + dx - 0.6, y - 0.6, x + dx + 0.6, y + 0.6, ZW + 0.9, ZW + 1.3, { t: '#3F5F4F', l: '#4F6F5F', r: '#3A5848' }, { w: 0.3, boil: false }); LX.person(g, x + dx, y, ZW + 1.3, LX.who(702 + i * 2 + k, { dir: d, pose: 'sit', beer: k === 0 })); }
  }, { on: true }));
  LX.walker(T, LX.who(706), [[-35, -6], [-18, -6]], 0.9, { z: ZW, phase: 0.2 });

  /* ---------------- Santa Catarina: Adamastor, the grass, the view ---------------- */
  T.obj([-31, 12, -26, 17], function (g) {
    K.box(g, -31, 12, -26, 17, ZW, ZW + 2.2, { t: '#C9C0AC', l: '#D3CAB6', r: '#BDB4A0' }, { w: 0.7 });
    const b = g.p(-28.5, 14.5, ZW + 2.2), R = RNG(4), rock = [];
    for (let k = 0; k < 12; k++) { const a = TAU * k / 12, r = 7 + R() * 2.5; rock.push([b[0] + Math.cos(a) * r * 0.9, b[1] - 9 + Math.sin(a) * r * 1.25]); }
    g.fill2(rock, '#B8AE98', true); g.fill2(rock.slice(0, 6).concat([[b[0], b[1] - 9]]), '#A39880', true); g.outline2(rock, { w: 0.6, c: '#6E665A' });
    g.disc2([b[0] - 2.4, b[1] - 15.5], 2.6, '#B8AE98'); g.ring2([b[0] - 2.4, b[1] - 15.5], 2.6, { w: 0.5, c: '#6E665A' }); g.segs2([b[0] - 3.4, b[1] - 15.2, b[0] - 2.4, b[1] - 16, b[0] - 1.4, b[1] - 15.4, b[0] - 2.8, b[1] - 14], '#6E665A', 0.45);
    g.segs2([b[0] + 3, b[1] - 6, b[0] + 5.5, b[1] - 3, b[0] - 4, b[1] - 4, b[0] - 6, b[1] - 1.5], '#6E665A', 0.5);
  }, { on: true, name: 'adamastor' });
  // the young crowd on the grass and at the parapet, a guitarist, a couple
  [[-22, 26, 1, 'sit'], [-24.4, 27.2, 1, 'sit'], [-33, 25.6, 1, 'sit'], [-30.6, 27, 1, 'sit'], [-19.4, 22, 0, 'sit'], [-27.5, 21.5, 1, 'sit']].forEach(([x, y, d, pose], i) => T.cast([x, y], (g) => LX.person(g, x, y, ZW, LX.who(710 + i, { dir: d, pose, beer: i % 2 === 0 })), { on: true }));
  T.cast([-35, 22], (g) => { const r = LX.person(g, -35, 22, ZW, LX.who(717, { dir: 0, pose: 'sit', hands: [[2.4, -6.8], [-1.8, -9.6]] })); const h = r.hip; g.fill2(K.curve([[h[0] - 1.4, h[1] - 3.2], [h[0] + 2.4, h[1] - 6.4], [h[0] + 3.8, h[1] - 4.6], [h[0] + 0.2, h[1] - 1.4]], 3, true), '#B8743A', true); }, { on: true });
  T.cast([-20, 13], (g) => { LX.person(g, -20.6, 13, ZW, LX.who(718, { dir: 1, lie: -2.6 })); LX.person(g, -18.6, 12.4, ZW, LX.who(719, { dir: 1, pose: 'sit' })); }, { on: true });

  /* ---------------- the funicular ---------------- */
  // the two cars on the cable: car 0 climbs as car 1 descends, passing at the loop; phased to the Bica shot
  const sh = SCENE.shots.find((s) => s.name === 'bica'), PER = 40, XA = 27, XU = XT + 3.4;
  const pOf = (t) => { const u = ((((t - sh.a / 30 - 2.6) / PER + 0.175) % 1) + 1) % 1; return u < 0.35 ? smooth(u / 0.35) * 1 : u < 0.5 ? 1 : u < 0.85 ? 1 - smooth((u - 0.5) / 0.35) : 0; };
  // u = 0.175 is mid-climb (p = 0.5): the shot's cut lands 2.6 s before the cars meet at the loop
  const car = (g, x, k) => {
    // a sloped box: its floor follows the street, the ends stay vertical; the far side's door, the near side's windows
    const L = 5.2, Wd = 1.35, yc = trackY(x, k), z0 = (xx) => zs(xx) + 0.7, z1 = (xx) => zs(xx) + 6.0;
    const P = (xx, y, z) => [xx, y, z], near = [P(x - L, yc + Wd, z0(x - L)), P(x + L, yc + Wd, z0(x + L)), P(x + L, yc + Wd, z1(x + L)), P(x - L, yc + Wd, z1(x - L))];
    const end = [P(x + L, yc - Wd, z0(x + L)), P(x + L, yc + Wd, z0(x + L)), P(x + L, yc + Wd, z1(x + L)), P(x + L, yc - Wd, z1(x + L))];
    const roof = [P(x - L - 0.3, yc - Wd - 0.2, z1(x - L) + 0.3), P(x + L + 0.3, yc - Wd - 0.2, z1(x + L) + 0.3), P(x + L + 0.3, yc + Wd + 0.2, z1(x + L) + 0.3), P(x - L - 0.3, yc + Wd + 0.2, z1(x - L) + 0.3)];
    g.fill(near, LC.tram); g.fill(end, LC.tramD);
    for (let i = 0; i < 4; i++) { const a = x - L + 0.6 + i * 2.5, b = a + 1.8; const q = [P(a, yc + Wd + 0.02, z0(a) + 2.4), P(b, yc + Wd + 0.02, z0(b) + 2.4), P(b, yc + Wd + 0.02, z0(b) + 4.6), P(a, yc + Wd + 0.02, z0(a) + 4.6)]; g.fill(q, '#5F7380'); g.mark({ nc: '#FFE3A6' }); if (i % 2 === k > 0 ? 1 : 0) { const m = g.p(a + 0.9, yc + Wd * 0.5, z0(a + 0.9) + 3.4); g.disc2(m, 0.75, SKIN[(i + 1) % 5]); } }
    g.fill(end.map((q, i) => i < 2 ? [q[0], lerp(yc - Wd, yc + Wd, i ? 0.85 : 0.15), q[2] + 2.4] : [q[0], lerp(yc - Wd, yc + Wd, i === 2 ? 0.85 : 0.15), q[2] - 1.0]), '#5F7380'); g.mark({ nc: '#FFE6B0', light: true });
    g.fill([P(x - L, yc + Wd + 0.02, z0(x - L)), P(x + L, yc + Wd + 0.02, z0(x + L)), P(x + L, yc + Wd + 0.02, z0(x + L) + 0.6), P(x - L, yc + Wd + 0.02, z0(x - L) + 0.6)], '#8A6A1E');
    g.fill(roof, '#F3F1EA'); g.outline(roof, { w: 0.55, boil: false });
    g.outline(near, { w: 0.65, boil: false }); g.outline(end, { w: 0.55, boil: false });
    K.textP(g, (a, z) => [a, yc + Wd + 0.04, z + (zs(a) - zs(x))], x - 1.3, z0(x) + 1.0, 0.75, 'BICA', '#5A3A10');
  };
  // anchored at the car's front-most corner at the street's height there; on the straight slope the drawing relative to
  // that anchor never changes, so one pose serves the whole climb
  for (let k = 0; k < 2; k++) T.actor({ sample: 0.25, period: PER, grow: false,
    at(t) {
      const p = pOf(t), x = k ? lerp(XU, XA, p) : lerp(XA, XU, p), kk = k ? 1 : -1, y = trackY(x, kk), lin = x - 5.2 >= XT && x + 5.2 <= XB;
      return { x: x + 5.2, y: y + 1.35, z: zs(x), key: lin ? 'lin' : 'x' + Math.round(x * 2), cx: lin ? 10 : Math.round(x * 2) / 2, kk };
    },
    draw(g, st) { g.at(-st.cx - 5.2, -trackY(st.cx, st.kk) - 1.35, -zs(st.cx), (g2) => car(g2, st.cx, st.kk)); } });
  // people on the steps beside the track, climbing and coming down
  LX.walker(T, LX.who(720), [[30, Y0 + 1.2], [XT + 1, Y0 + 1.2]], 0.7, { z: (x) => zs(x), phase: 0.1 });
  LX.walker(T, LX.who(721), [[XT + 1, Y1 - 1.2], [30, Y1 - 1.2]], 0.8, { z: (x) => zs(x), phase: 0.55 });
  LX.walker(T, LX.who(722, { k: 0.72 }), [[XT + 2, Y1 - 1.4], [28, Y1 - 1.4]], 0.85, { z: (x) => zs(x), phase: 0.3 });
  // washing across the street: from the houses' second floors to poles on the south parapet (high, over the cars' roofs)
  [[-10, 1], [0, 2], [9, 3], [19, 4]].forEach(([x, i]) => LX.still(T, x, Y1, zs(x), (g) => {
    const a = g.p(0, Y0 - Y1, LX.GF + LX.STOREY + 1.6 + (zs(x + 5) - zs(x))), b = g.p(1.5, 0, 9.6), b0 = g.p(1.5, 0, 0);
    g.segs2([b0[0], b0[1], b[0], b[1]], '#6E6A64', 0.4);
    const ln = []; for (let k = 0; k <= 8; k++) { const t = k / 8; ln.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t) + 4 * t * (1 - t) * 2.2]); } g.fine2(ln, { w: 0.22, c: '#5A544A' });
    const R = RNG(900 + i); for (let k = 0; k < 4; k++) { const t = 0.15 + k * 0.22, c = [lerp(a[0], b[0], t), lerp(a[1], b[1], t) + 4 * t * (1 - t) * 2.2], w = 1.2 + R() * 1.0, h = 2 + R() * 2; g.fill2([[c[0] - w, c[1]], [c[0] + w, c[1]], [c[0] + w, c[1] + h], [c[0] - w, c[1] + h]], R.pick(['#F7F5EF', '#E2483D', '#3F8FD2', '#F2C230', '#E77FB3']), true); }
  }, { layer: 'top' }));
  // the bar at the foot of the street: people drinking outside, standing and leaning
  T.cast([33, 33], function (g) {
    for (const [x, y, d, sd, beer] of [[30, 33, 1, 730, true], [32, 34.6, 2, 731, true], [34.6, 33.2, 1, 732, false], [36, 35, 3, 733, true]]) LX.person(g, x, y, 0, LX.who(sd, { dir: d, pose: 'hold', beer }));
  });
  T.cast([12, 34], (g) => { LX.person(g, 12, 34, 0, LX.who(734, { dir: 0, pose: 'hold', phone: true })); LX.person(g, 14, 33.4, 0, LX.who(735, { dir: 3 })); });
});
