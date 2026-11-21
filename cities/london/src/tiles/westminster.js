'use strict';
/* (-100,0) Westminster. What it is: the Palace of Westminster along the river, honey-coloured Gothic Revival stone,
   a long front of buttress strips and tall lancet windows, steep grey roofs bristling with pinnacles; the Victoria
   Tower at its west end with the Union flag, the octagonal Central Tower with its spire, and Elizabeth Tower (Big Ben)
   at the east end beside Westminster Bridge: a slender square shaft, the gilded clock stage with four white dials,
   the open belfry, the tall dark-and-gold spire. Behind (north) Parliament Square: a lawn with statues and the flags,
   Westminster Abbey on its west side (twin west towers, a long nave with flying buttresses), little St Margaret's.
   Who is there: protesters with placards and a banner on the square, a bobby in his helmet, tourists photographing Big
   Ben and squeezing into a red phone box for the picture, an ice-cream van, a few umbrellas; MPs on the river terrace.
   What moves: walkers, the flag, pigeons on the square. */
SF.tile('westminster', -100, 0, { rim: 8 }, function (T) {
  const H = 37, RN = LT.RIV.N - 1.2, GO = LK.C.gothic, GOT = { t: '#D2BC90', l: GO, r: LK.C.gothicD }, ROOF = '#7E8B98', GRASS = '#A8CB7E';
  T.ground(function (g) {
    LK.ground(g, -H, -H, H, RN, '#E2DED3');
    LK.paving(g, -H, 25, H, RN, { step: 2.4, col: '#E6E1D5' });                     // the river terrace
    // Parliament Square: the lawn in a ring of paving, paths
    g.fill(K.rect(-12, -30, 22, -6), '#E1DCD0');
    K.lawn(g, -9, -27, 19, -9, { col: GRASS, dens: 0.8 });
    g.fill([[-9, -18.6, 0.01], [19, -18.6, 0.01], [19, -17.4, 0.01], [-9, -17.4, 0.01]], '#E1DCD0');
    // the Abbey's precinct and the pavements, puddles
    g.fill(K.rect(-36, -36, -14, -10), '#E3DDCF');
    for (const [x, y, rx, ry] of [[-2, -4, 2.2, 1.0], [24, -24, 1.6, 0.8], [8, 27, 1.8, 0.7], [-20, -6, 1.2, 0.7], [30, -3, 1.4, 0.8]]) LK.puddle(g, x, y, rx, ry, Math.round(x * 11 + y * 3 + 900));
  }, { rim: true });

  /* ---------------- Westminster Abbey (west of the square) ---------------- */
  T.obj([-35, -33, -15, -21], function (g) {
    g.boilP = 0.3;
    const S = { t: '#D8CDB4', l: '#E2D6BC', r: '#C6B99C' };
    // the nave with its aisles and the steep lead roof, the east apse
    K.box(g, -30, -31, -17, -23, 0, 5.2, S, { w: 0.8 });
    K.box(g, -30, -29.5, -17, -24.5, 5.2, 9.4, S, { w: 0.75, nohid: true });
    for (let x = -28.6; x < -17.5; x += 2.2) { K.win(g, 'L', -23.02, x, x + 0.9, 1.0, 4.0, { style: 'dark', arch: 'gothic', col: '#5A5E68', w: 0.3 }); K.win(g, 'L', -24.48, x + 0.1, x + 0.8, 6.0, 8.6, { style: 'dark', arch: 'gothic', col: '#5A5E68', w: 0.3 }); const a = g.p(x - 0.2, -23, 5.0), b = g.p(x - 0.2, -24.5, 8.2); g.line2([a, b], { w: 0.55, c: '#A8987A', boil: false }); }
    K.gable(g, -30.2, -29.7, -16.8, -24.3, 9.4, 3.2, 'x', { a: '#8E979E', b: '#7C858C', e: S.l }, { w: 0.7 });
    K.cyl(g, -16.4, -27, 3.0, 0, 8.4, S, { w: 0.7, n: 12 }); K.cone(g, -16.4, -27, 3.1, 8.4, 3.0, '#8E979E');
    // the north transept with its rose window, facing the square
    K.box(g, -24.5, -33, -21, -21, 0, 9.8, S, { w: 0.75 }); K.gable(g, -24.7, -33.2, -20.8, -20.8, 9.8, 3.0, 'y', { a: '#8E979E', b: '#7C858C', e: S.l }, { w: 0.65 });
    { const c = g.p(-22.75, -20.98, 6.6); g.fill2(arcPts(c[0], c[1], 3.6, 0, TAU, 16).map((q) => [q[0], c[1] + (q[1] - c[1]) * 1.0]), '#5A5E68', true); const sp = []; for (let i = 0; i < 8; i++) { const a = TAU * i / 8; sp.push(c[0], c[1], c[0] + Math.cos(a) * 3.4, c[1] + Math.sin(a) * 3.4); } g.segs2(sp, '#C9B98F', 0.4); g.ring2(c, 3.6, { w: 0.5, c: '#A8987A' }); }
    K.win(g, 'L', -20.98, -24.0, -21.5, 0, 3.2, { style: 'dark', arch: 'gothic', col: '#4A4640', w: 0.4 });
    // the twin west towers
    for (const y of [-31.5, -25.5]) { K.box(g, -34.5, y - 2.0, -30, y + 2.0, 0, 15.5, S, { w: 0.75 }); K.win(g, 'L', y + 2.02, -33.2, -31.6, 9.5, 13.5, { style: 'dark', arch: 'gothic', col: '#5A5E68', w: 0.35 }); for (const [px, py] of [[-34.5, y - 2], [-30, y - 2], [-30, y + 2], [-34.5, y + 2]]) { const b = g.p(px, py, 15.5), t = g.p(px, py, 18); g.fill2([[b[0] - 0.6, b[1]], [b[0] + 0.6, b[1]], [t[0], t[1]]], S.l); g.outline2([[b[0] - 0.6, b[1]], [t[0], t[1]], [b[0] + 0.6, b[1]]], { w: 0.4, boil: false }); } LK.battle(g, -34.5, y - 2, -30, y + 2, 15.5, S.l, { mw: 0.5, st: 1.1, mh: 0.6 }); }
  }, { name: 'abbey' });
  T.obj([-14, -21, -8, -15], (g) => { K.box(g, -13, -20, -8.5, -16, 0, 4.6, { t: '#D2C6AC', l: '#DED2B8', r: '#C3B597' }, { w: 0.7 }); K.gable(g, -13.2, -20.2, -8.3, -15.8, 4.6, 2.2, 'x', { a: '#8E979E', b: '#7C858C', e: '#DED2B8' }, { w: 0.6 }); K.box(g, -14, -19.5, -12, -17.5, 0, 8.6, { t: '#D2C6AC', l: '#DED2B8', r: '#C3B597' }, { w: 0.65 }); LK.battle(g, -14, -19.5, -12, -17.5, 8.6, '#DED2B8', { mw: 0.45, st: 0.9, mh: 0.55 }); K.win(g, 'L', -15.98, -11.8, -10.2, 1.0, 3.6, { style: 'dark', arch: 'gothic', col: '#5A5E68', w: 0.3 }); }, { name: "st margaret's" });

  /* ---------------- the Palace of Westminster ---------------- */
  // the Victoria Tower at the west end
  T.obj([-35, 11, -26, 21], function (g) {
    g.boilP = 0.3;
    K.box(g, -34.5, 11.5, -26.5, 20.5, 0, 26, GOT, { w: 0.85 });
    LK.gothicFace(g, 'L', 20.5, -34.5, -26.5, 0, 26, { bay: 2.0, st: 5.2 }); LK.gothicFace(g, 'R', -26.5, 11.5, 20.5, 0, 26, { bay: 2.2, st: 5.2 });
    const a = [K.pt('L', 20.52, -32.2, 0)]; for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10; a.push(K.pt('L', 20.52, -30.5 - 1.7 * Math.cos(t), 4.2 + 2.6 * Math.sin(t))); } a.push(K.pt('L', 20.52, -28.8, 0)); g.fill(a, '#4A4640');
    LK.battle(g, -34.5, 11.5, -26.5, 20.5, 26, GO, { mw: 0.6, st: 1.2, mh: 0.7 });
    for (const [px, py] of [[-34.5, 11.5], [-26.5, 11.5], [-26.5, 20.5], [-34.5, 20.5]]) K.cone(g, px, py, 0.9, 25.0, 5.2, GO);
    LK.pole(g, -30.5, 16, 26, 7.5);
  }, { name: 'victoria tower' });
  LK.flag(T, -30.5, 16, 33.5, { L: 4.4, H: 2.4, ph: 0.6 });
  // the long river front in two pieces, the Central Tower over the middle
  const front = (x0, x1, central) => T.obj([x0, 12, x1, 26], function (g) {
    g.boilP = 0.25;
    K.box(g, x0, 12, x1, 26, 0, 10.5, GOT, { w: 0.9 });
    LK.gothicFace(g, 'L', 26, x0, x1, 0, 10.5, { bay: 2.1, st: 4.6 });
    if (x1 > 20) LK.gothicFace(g, 'R', x1, 12, 26, 0, 10.5, { bay: 2.1, st: 4.6 });
    K.gable(g, x0 + 0.4, 12.5, x1 - 0.4, 25.5, 10.5, 4.4, 'x', { a: ROOF, b: shade(ROOF, 0.12), e: GO }, { w: 0.75, c: '#4E5864' });
    const pin = []; for (let x = x0 + 1.6; x < x1 - 1; x += 3.2) { for (const [y, z] of [[26, 10.5], [19, 14.9]]) { const b = g.p(x, y, z), t = g.p(x, y, z + 2.4); pin.push(b); g.fill2([[b[0] - 0.55, b[1]], [b[0] + 0.55, b[1]], [t[0], t[1]]], z > 11 ? '#6E7A86' : GO); } }
    // pavilions with their own tall roofs break the long front
    for (const px of [x0 + 7, x1 - 7]) { K.box(g, px - 1.8, 23.8, px + 1.8, 26.6, 0, 13.6, GOT, { w: 0.75, nohid: true }); LK.gothicFace(g, 'L', 26.6, px - 1.8, px + 1.8, 0, 13.6, { bay: 1.2, st: 4.6 }); LK.battle(g, px - 1.8, 23.8, px + 1.8, 26.6, 13.6, GO, { mw: 0.45, st: 0.9, mh: 0.5 }); for (const [qx, qy] of [[px - 1.8, 26.6], [px + 1.8, 26.6], [px + 1.8, 23.8], [px - 1.8, 23.8]]) { const b = g.p(qx, qy, 13.6), t = g.p(qx, qy, 16.4); g.fill2([[b[0] - 0.55, b[1]], [b[0] + 0.55, b[1]], [t[0], t[1]]], GO); g.line2([[b[0] - 0.55, b[1]], [t[0], t[1]], [b[0] + 0.55, b[1]]], { w: 0.35, c: '#8A7448', boil: false }); } }
    if (central) { const cx = central, cy = 19; K.cyl(g, cx, cy, 2.6, 10, 19.5, GOT, { w: 0.75, n: 8 }); LK.gothicFace(g, 'L', cy + 2.5, cx - 1.2, cx + 1.2, 12, 19, { bay: 1.2, st: 3.4 }); K.cone(g, cx, cy, 2.7, 19.5, 8.5, '#6E7A86'); const t = g.p(cx, cy, 28), tt = g.p(cx, cy, 29.4); g.line2([t, tt], { w: 0.5, c: '#3E4650', boil: false, ext: 0 }); }
  }, { name: 'palace' });
  front(-26.5, -2, -4); front(-2, 25);

  /* ---------------- Elizabeth Tower (Big Ben) ---------------- */
  T.obj([26, 15.5, 32.5, 22], function (g) {
    g.boilP = 0.35;
    const x0 = 26.6, x1 = 31.8, y0 = 16.2, y1 = 21.4, z1 = 19.5, z2 = 24.6, z3 = 27.6, Z = 37;
    K.box(g, x0, y0, x1, y1, 0, z1, GOT, { w: 0.9 });
    LK.gothicFace(g, 'L', y1, x0, x1, 0, z1, { bay: 1.3, st: 3.6 }); LK.gothicFace(g, 'R', x1, y0, y1, 0, z1, { bay: 1.3, st: 3.6 });
    // the clock stage: gilded, a white dial on each face with black hands
    K.box(g, x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35, z1, z2, { t: '#D8BE7C', l: '#E2C47A', r: '#C2A35C' }, { w: 0.85, nohid: true });
    for (const [f, p, a0, a1] of [['L', y1 + 0.37, x0 - 0.35, x1 + 0.35], ['R', x1 + 0.37, y0 - 0.35, y1 + 0.35]]) {
      const am = (a0 + a1) / 2, zm = (z1 + z2) / 2, r = 1.95, dial = [];
      for (let i = 0; i < 20; i++) { const t = TAU * i / 20; dial.push(K.pt(f, p, am + Math.cos(t) * r, zm + Math.sin(t) * r)); }
      g.fill(dial, '#F6F1E2'); g.outline(dial, { w: 0.55, c: '#3A3128', boil: false });
      const tick = []; for (let i = 0; i < 12; i++) { const t = TAU * i / 12, a = g.p.apply(g, K.pt(f, p, am + Math.cos(t) * r * 0.8, zm + Math.sin(t) * r * 0.8)), b = g.p.apply(g, K.pt(f, p, am + Math.cos(t) * r * 0.95, zm + Math.sin(t) * r * 0.95)); tick.push(a[0], a[1], b[0], b[1]); } g.segs2(tick, '#2A2622', 0.4);
      const c = g.p.apply(g, K.pt(f, p, am, zm)), hh = g.p.apply(g, K.pt(f, p, am + 0.7, zm + 0.6)), mm = g.p.apply(g, K.pt(f, p, am - 0.1, zm + 1.5)); g.segs2([c[0], c[1], hh[0], hh[1]], '#1E1B19', 0.55); g.segs2([c[0], c[1], mm[0], mm[1]], '#1E1B19', 0.4);
    }
    // the open belfry and the spire with its pinnacles
    K.box(g, x0, y0, x1, y1, z2, z3, GOT, { w: 0.8, nohid: true });
    for (const [f, p, a0, a1] of [['L', y1 + 0.02, x0, x1], ['R', x1 + 0.02, y0, y1]]) for (let i = 0; i < 3; i++) { const a = lerp(a0, a1, (i + 0.5) / 3); K.win(g, f, p, a - 0.55, a + 0.55, z2 + 0.6, z3 - 0.4, { style: 'dark', arch: 'gothic', col: '#3E4148', w: 0.3 }); }
    const ap = g.p((x0 + x1) / 2, (y0 + y1) / 2, Z), base = [g.p(x0, y1, z3), g.p(x1, y1, z3), g.p(x1, y0, z3)];
    g.fill2([base[0], base[1], ap], '#3E4650'); g.fill2([base[1], base[2], ap], '#2E353E');
    const gl = []; for (let i = 1; i < 5; i++) { const t = i / 5; for (const [a, b] of [[base[0], base[1]], [base[1], base[2]]]) { gl.push(lerp(a[0], ap[0], t), lerp(a[1], ap[1], t), lerp(b[0], ap[0], t), lerp(b[1], ap[1], t)); } } g.segs2(gl, '#D9A93E', 0.45);
    g.line2([base[0], ap, base[2]], { w: 0.7, c: '#1E1B19', boil: false }); g.line2([base[1], ap], { w: 0.5, c: '#1E1B19', boil: false });
    for (const [px, py] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) { const b = g.p(px, py, z3), t = g.p(px, py, z3 + 3.2); g.fill2([[b[0] - 0.6, b[1]], [b[0] + 0.6, b[1]], [t[0], t[1]]], '#D9A93E'); g.line2([[b[0] - 0.6, b[1]], [t[0], t[1]], [b[0] + 0.6, b[1]]], { w: 0.35, c: '#8A6A2A', boil: false }); }
    const t0 = g.p((x0 + x1) / 2, (y0 + y1) / 2, Z), t1 = g.p((x0 + x1) / 2, (y0 + y1) / 2, Z + 2.2); g.line2([t0, t1], { w: 0.5, c: '#D9A93E', boil: false, ext: 0 }); g.disc2(t1, 0.4, '#D9A93E');
  }, { name: 'elizabeth tower' });

  /* ---------------- the square's furniture: statues, the phone box, the Tube, the river parapet ---------------- */
  const statue = (x, y, col) => T.obj([x, y], (g) => { K.box(g, x - 1.2, y - 1.2, x + 1.2, y + 1.2, 0, 3.2, { t: '#CFC9BB', l: '#D9D4C8', r: '#BDB6A6' }, { w: 0.55 }); LK.person(g, x, y, 3.2, { skin: col, hair: col, top: col, bot: col, shoe: col, hairStyle: 'bald', dir: 1, pose: 'stand', build: 0.9, k: 1.05, ink: '#2A2E2A' }); }, { name: 'statue' });
  statue(16, -10.5, '#5E6B60'); statue(-6, -10.5, '#5E6B60'); statue(5, -28, '#6B6458');
  T.obj([33.2, -6.5], (g) => LK.phonebox(g, 33.2, -6.5), { name: 'phone box' });
  T.obj([14, -33.5], (g) => LK.pillar(g, 14, -33.5), { name: 'pillar box' });
  T.ground(function (g) { LK.tube(g, 32, -25, { axis: 'y' }); });
  T.obj([34.6, -25], (g) => LK.roundel(g, 34.6, -25, { name: 'WESTMINSTER' }), { name: 'roundel' });
  for (let x = -H; x < H - 0.1; x += 18.5) { const x1 = Math.min(H, x + 18.5); T.obj([x, RN - 0.7, x1, RN], (g) => { K.box(g, x, RN - 0.7, x1, RN, 0, 1.3, { t: '#D9D4C8', l: '#CFC9BB', r: '#BDB6A6' }, { w: 0.55, boil: false }); }, { name: 'parapet' }); }
  for (const [x, y] of [[-35, -6], [-35, 6], [27, -35], [-4, -35], [35, -15]]) T.obj([x, y], (g) => LK.plane(g, x, y, { r: 4.6 }), { name: 'tree' });
  for (const x of [-20, 8]) T.obj([x, 27.4], (g) => LK.lamp(g, x, 27.4), { name: 'lamp' });
  // flagpoles round the square
  for (const [x, y] of [[-11, -29], [21, -29]]) { T.obj([x, y], (g) => LK.pole(g, x, y, 0, 11), { name: 'flagpole' }); LK.flag(T, x, y, 11, { L: 3.0, H: 1.7, ph: x * 0.07 }); }
  // the ice-cream van
  T.obj([22, -4, 32, 0], (g) => { g.at(27, -2, 0, (g2) => K.bus(g2, 0, { L: 4.6, W: 2.0, h: 4.8, n: 2, col: '#F6F3EA', band: '#E7A9C0' })); K.text(g, 'L', 0.02, 27, 2.0, 0.75, 'ICE CREAM', '#B24A6E', { center: true, w: 0.5 }); const p = g.p(31.2, -2, 6.3); g.fill2([[p[0] - 0.9, p[1]], [p[0] + 0.9, p[1]], [p[0], p[1] + 2.4]], '#C9A26B', true); g.disc2([p[0], p[1] - 0.6], 1.0, '#F6E0EA'); }, { name: 'ice cream van' });

  /* ---------------- the living layer ---------------- */
  // protesters on the square: placards and a long banner
  const placard = (g, r, col, word) => { const h = r.hands[0], t = [h[0] + 0.4, h[1] - 6.5]; g.line2([h, t], { w: 0.4, c: '#7A5A3C', boil: false, ext: 0 }); g.fill2([[t[0] - 2.6, t[1] - 3.0], [t[0] + 2.6, t[1] - 3.0], [t[0] + 2.6, t[1] + 0.6], [t[0] - 2.6, t[1] + 0.6]], col, true); g.outline2([[t[0] - 2.6, t[1] - 3.0], [t[0] + 2.6, t[1] - 3.0], [t[0] + 2.6, t[1] + 0.6], [t[0] - 2.6, t[1] + 0.6]], { w: 0.3, c: '#7A6A5A', boil: false }); LK.label2(g, [t[0], t[1] - 1.2], word, Math.min(0.55, 4.4 / (K.textW(word, 1) * 2.92)), '#2A2622', { w: 0.35 }); };
  T.cast([4, -14], (g) => {
    const ps = [[1, -15.5, '#F3F1EA', 'VOTE'], [3.2, -14.4, '#E6C24F', 'PEACE'], [5.6, -15.8, '#F3F1EA', 'SAVE BEES'], [7.6, -14.6, '#8FBF73', 'GREEN NOW'], [2.2, -12.4, '#E7A9A0', ''], [6.4, -12.6, '#F3F1EA', 'HONK!']];
    ps.forEach(([x, y, col, word], i) => { const r = LK.person(g, x, y, 0, LK.who(2100 + i, { dir: i % 2 ? 1 : 0, pose: i === 4 ? 'cheer' : 'hold', ph: 0.3 })); if (i !== 4) placard(g, r, col, word); });
    const a = g.p(-2.2, -11.2, 5.4), b = g.p(9.6, -11.2, 5.4); const bn = [[a[0], a[1]], [b[0], b[1]], [b[0], b[1] + 5.2], [a[0], a[1] + 5.2]]; g.fill2(bn, '#F6F3EA', true); g.outline2(bn, { w: 0.4, c: '#5A544C', boil: false }); K.textP(g, (u, z) => [3.7 + u, -11.18, z], 0, 4.05, 1.0, 'LOVE LONDON', '#C8372D', { center: true, w: 0.6 });
    LK.person(g, -2.4, -10.8, 0, LK.who(2107, { dir: 1, pose: 'hold' })); LK.person(g, 9.8, -10.8, 0, LK.who(2108, { dir: 1, pose: 'hold' }));
  }, { on: true });
  // a bobby keeping an eye on things
  LK.stand(T, 12, -6.5, LK.bobby(31, { dir: 2 }));
  // tourists photographing Big Ben, a selfie, a couple squeezing into the phone box
  T.cast([22, 8], (g) => { LK.person(g, 20.4, 7.4, 0, LK.tourist(2201, { dir: 3, pose: 'hold', phone: true })); LK.person(g, 22.2, 8.8, 0, LK.tourist(2202, { dir: 0, pose: 'wave', ph: 0.25 })); LK.person(g, 24.0, 7.8, 0, LK.who(2203, { dir: 3, umb: '#26314F', pose: 'stand' })); }, { on: true });
  T.cast([31.4, -3.6], (g) => { LK.person(g, 30.8, -3.4, 0, LK.tourist(2204, { dir: 1, pose: 'hold', phone: true })); LK.person(g, 32.4, -4.2, 0, LK.tourist(2205, { dir: 0, pose: 'cheer', ph: 0.3 })); }, { on: true });
  // MPs on the terrace by the river, a family at the ice-cream van
  T.cast([-12, 27.2], (g) => { LK.person(g, -13, 27.0, 0, LK.banker(2301, { dir: 1, pose: 'hold', pint: '#E9B53C' })); LK.person(g, -11.2, 27.6, 0, LK.banker(2302, { dir: 2 })); }, { on: true });
  T.cast([28, 1.6], (g) => { LK.person(g, 27.6, 1.4, 0, LK.who(2303, { dir: 2, k: 0.72 })); LK.person(g, 29.2, 1.8, 0, LK.who(2304, { dir: 2, pose: 'hold' })); }, { on: true });
  // walkers: the pavements round the square, the terrace
  LK.walker(T, LK.who(2401, { umb: '#2A2622' }), [[-12, -7.5], [23, -7.5]], 1.4, { phase: 0.2 });
  LK.walker(T, LK.tourist(2402), [[23, -31], [-12, -31]], 1.5, { phase: 0.5 });
  LK.walker(T, LK.banker(2403), [[24, -32], [24, -8]], 1.7, { phase: 0.1 });
  LK.walker(T, LK.who(2404), [[-34, 27], [24, 27]], 1.3, { phase: 0.6 });
  LK.walker(T, LK.tourist(2405), [[35.8, 4], [35.8, -34]], 1.5, { phase: 0.3 });
  LK.walker(T, LK.who(2406), [[-13, -9], [-13, -34]], 1.2, { phase: 0.7 });
  // pigeons pecking on the square
  for (let i = 0; i < 6; i++) T.actor({ sample: 5, period: 10, at(t) { const f = Math.floor(t * 2 + i * 1.3) % 3; return { x: 9 + (i % 3) * 1.6, y: -21 + Math.floor(i / 3) * 2.1, key: f, f }; }, draw(g, st) { const o = g.p(0, 0, 0), d = st.f === 1 ? 0.7 : 0; g.fill2([[o[0] - 1.0, o[1] - 0.8 + d * 0.3], [o[0] + 0.8, o[1] - 1.2 + d], [o[0] + 1.2, o[1] - 0.4 + d], [o[0], o[1]], [o[0] - 1.1, o[1] - 0.2]], '#8E939E', true); g.disc2([o[0] + 1.0, o[1] - 1.3 + d], 0.5, '#6E7380'); } });
});
