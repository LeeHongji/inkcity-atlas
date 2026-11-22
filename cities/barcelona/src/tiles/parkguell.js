'use strict';
/* (-100,-100) Park Güell, at the top of the map (north, up the hill).
   Built: the boundary wall on the near side with the trencadís medallions, the gate between the two gingerbread
   lodges (the porter's lodge with its tall chequered tower and cross, and the other with the mushroom roof, both with
   cream icing eaves and brown rubble walls); the dragon stair climbing from the gate in two flights round El Drac, the
   mosaic salamander; at its head the Hypostyle Hall, a forest of white Doric columns on a rubble plinth, carrying the
   great sand terrace (Plaça de la Natura) whose edge is the serpentine bench of broken tile; the Laundry Portico, a
   wave of leaning stone columns carrying a path, on the right; Gaudí's pink house with its little spire behind; pines
   and palms round the edges.
   Who: tourists at the bench taking pictures, people sitting along it, a guitarist under the colonnade, souvenir
   sellers on cloths, a queue at the gate, photographers on the stair with El Drac. What moves: walkers on the
   terrace and on the stair, a flock of green parakeets wheeling over the park. */
SF.tile('parkguell', -100, -100, { rim: 0 }, function (T) {
  const RUB = { t: '#C9AE86', l: '#BFA27A', r: '#A88C66' }, CREAM = '#F6EEDC', TER = 9.2, HALL = [-33, -33, 6, 2];
  const stairZ = (x, y) => (y >= 30 ? 0 : y <= 6 ? 2.5 : 2.5 * (30 - y) / 24);
  const trenc = (g, pts, seed, dens) => { const R = RNG(seed), P = g.P(pts); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of P) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); } const flat = []; for (const p of P) flat.push(p[0], p[1]); let n = 0; for (let i = 0; i < 2400 && n < (dens || 40) * 2; i++) { const x = lerp(x0, x1, R()), y = lerp(y0, y1, R()); if (!pointInPoly(x, y, flat)) continue; n++; g.fill2([[x - 0.8, y - 0.5], [x + 0.7, y - 0.7], [x + 0.6, y + 0.6], [x - 0.55, y + 0.55]], R.pick(BP.trenc), true); } };

  T.ground(function (g) {
    BC.ground(g, '#E3D3AE');
    // gravel paths and the dry hillside
    g.scuff(K.rect(-37, -37, 37, 37), { dir: -0.6, len: 2.5, c: '#EEE2C6', dens: 0.5, w: 0.45, spread: 0.6 });
    for (const pl of [[[8, -37], [37, -37], [37, -8], [24, 6], [12, -6]], [[-37, 4], [-21, 4], [-21, 30], [-37, 27]], [[-4, 4], [8, 4], [22, 14], [27, 36], [-2, 36]]]) { const p = pl.map(([x, y]) => [x, y, 0]); g.fill(p, '#C9D39A'); g.grass(p, { dens: 0.6 }); }
  }, { rim: true });

  /* ---- the Hypostyle Hall with the terrace on top and the serpentine bench round its edge ---- */
  T.obj(HALL, function (g) {
    g.boilP = 0.18;
    const [x0, y0, x1, y1] = HALL;
    K.box(g, x0, y0, x1, y1, 0, 2.5, RUB, { w: 0.85 });
    const rub = []; { const R = RNG(77); for (let i = 0; i < 70; i++) { const along = R(), z = 0.3 + R() * 1.9, onL = R() < 0.5, p = onL ? g.p(lerp(x0, x1, along), y1 + 0.02, z) : g.p(x1 + 0.02, lerp(y0, y1, along), z); rub.push(p[0] - 0.8, p[1], p[0] + 0.8, p[1] - 0.2); } } g.segs2(rub, '#8C7458', 0.4);
    // the dark hall behind the columns, then the columns, the entablature with lion-head spouts
    g.fill(K.on('L', y1 - 0.1, x0, x1, 2.5, 8.2), '#5A5048'); g.fill(K.on('R', x1 - 0.1, y0, y1, 2.5, 8.2), '#4A4038');
    for (let x = x0 + 1.2; x < x1; x += 2.6) { const b = g.p(x, y1 - 0.3, 2.5), t = g.p(x, y1 - 0.3, 7.6); g.fill2([[b[0] - 1.25, b[1]], [b[0] + 1.25, b[1]], [t[0] + 1.0, t[1]], [t[0] - 1.0, t[1]]], '#F1EBDD', true); g.fill2([[b[0] + 0.3, b[1]], [b[0] + 1.25, b[1]], [t[0] + 1.0, t[1]], [t[0] + 0.3, t[1]]], '#DCD3C1', true); g.fill2([[t[0] - 1.6, t[1]], [t[0] + 1.6, t[1]], [t[0] + 1.6, t[1] - 1.6], [t[0] - 1.6, t[1] - 1.6]], '#F6F1E6', true); g.line2([[b[0] - 1.25, b[1]], [t[0] - 1.0, t[1]]], { w: 0.4, boil: false }); g.line2([[b[0] + 1.25, b[1]], [t[0] + 1.0, t[1]]], { w: 0.4, boil: false }); }
    for (let y = y0 + 1.2; y < y1; y += 2.6) { const b = g.p(x1 - 0.3, y, 2.5), t = g.p(x1 - 0.3, y, 7.6); g.fill2([[b[0] - 1.25, b[1]], [b[0] + 1.25, b[1]], [t[0] + 1.0, t[1]], [t[0] - 1.0, t[1]]], '#E6DFD0', true); g.fill2([[t[0] - 1.6, t[1]], [t[0] + 1.6, t[1]], [t[0] + 1.6, t[1] - 1.6], [t[0] - 1.6, t[1] - 1.6]], '#F1EBDD', true); g.line2([[b[0] + 1.25, b[1]], [t[0] + 1.0, t[1]]], { w: 0.4, boil: false }); }
    g.fill(K.on('L', y1, x0, x1, 8.0, TER), '#EDE3CC'); g.fill(K.on('R', x1, y0, y1, 8.0, TER), '#D8CBB0');
    for (let x = x0 + 2.5; x < x1; x += 5.2) { const c = g.p(x, y1 + 0.05, 8.6); g.disc2(c, 0.55, '#C9A86A'); }
    g.line([[x0, y1, TER], [x1, y1, TER], [x1, y0, TER]], { w: 0.85, boil: false }); g.line([[x0, y1, 8.0], [x1, y1, 8.0], [x1, y0, 8.0]], { w: 0.5, boil: false }); g.line([[x1, y1, 0], [x1, y1, TER]], { w: 0.8 });
    // the terrace: pale sand
    g.fill(K.rect(x0, y0, x1, y1, TER), '#EFE2C2');
    g.scuff(K.rect(x0, y0, x1, y1, TER), { dir: -0.6, len: 2.6, c: '#F8EED6', dens: 0.5, w: 0.45, spread: 0.6 });
    // the serpentine bench along the two near edges: an undulating ribbon of trencadís with its back to the drop
    const wave = (t) => Math.sin(t * 0.55) * 1.4;
    const benchL = [], benchB = []; for (let x = x0 + 1; x <= x1 - 1; x += 0.8) { const w = wave(x); benchL.push([x, y1 - 1.6 + w * 0.7, TER]); benchB.push([x, y1 - 0.3 + w * 0.4, TER + 2.2]); }
    const benchR = [], benchRB = []; for (let y = y1 - 1; y >= y0 + 1; y -= 0.8) { const w = wave(y + 3); benchR.push([x1 - 1.6 + w * 0.7, y, TER]); benchRB.push([x1 - 0.3 + w * 0.4, y, TER + 2.2]); }
    for (const [front, back, seed] of [[benchL, benchB, 5], [benchR, benchRB, 9]]) {
      const top = front.map((p) => [p[0], p[1], p[2] + 1.3]);
      const face = front.concat(top.slice().reverse()); g.fill(face, '#EAF0EE'); trenc(g, face, seed, 260);
      const bk = top.concat(back.slice().reverse()); g.fill(bk, '#E2ECEA'); trenc(g, bk, seed + 1, 240);
      g.line(top, { w: 0.55, boil: false }); g.line(back, { w: 0.6, boil: false }); g.line(front, { w: 0.4, c: '#8C8576', boil: false });
    }
    // pines along the back of the terrace
    for (const [x, y] of [[-30, -30], [-22, -31], [-14, -31], [-31, -20], [-31, -10]]) K.tree(g, x, y, { r: 3.4, h: 4.2, z: TER, col: '#6E9A50' });
  }, { name: 'hypostyle hall' });

  /* ---- the dragon stair, El Drac ---- */
  T.obj([-19, 3, -5, 30], function (g) {
    g.boilP = 0.2;
    // two flights of steps with a mosaic wall up the middle and on the sides
    const steps = 14;
    for (let i = 0; i < steps; i++) {
      const ya = 30 - i * (24 / steps), yb = ya - 24 / steps, z = 2.5 * (i + 1) / steps;
      for (const [xa, xb] of [[-18, -13.5], [-10.5, -6]]) { g.fill([[xa, yb, z], [xb, yb, z], [xb, ya, z], [xa, ya, z]], i % 2 ? '#E6D9BC' : '#DCCDAE'); g.fill([[xa, ya, z - 2.5 / steps], [xb, ya, z - 2.5 / steps], [xb, ya, z], [xa, ya, z]], '#BFAE8C'); }
    }
    const mid = [[-13.5, 30, 0], [-10.5, 30, 0], [-10.5, 6, 2.5], [-13.5, 6, 2.5]];
    for (const [xa, xb] of [[-13.5, -10.5]]) { const wall = [[xb, 30, 0], [xb, 6, 2.5], [xb, 6, 4.2], [xb, 30, 1.7]]; g.fill(wall, '#EDE6D6'); trenc(g, wall, 31, 90); g.fill([[xa, 30, 1.7], [xb, 30, 1.7], [xb, 6, 4.2], [xa, 6, 4.2]], '#F4EFE3'); }
    void mid;
    const sideWall = [[-6, 30, 0], [-6, 6, 2.5], [-6, 6, 4.0], [-6, 30, 1.5]]; g.fill(sideWall, '#E9E1CF'); trenc(g, sideWall, 41, 110); g.line([[-6, 30, 1.5], [-6, 6, 4.0]], { w: 0.6, boil: false });
    // El Drac: the salamander on the middle wall, its body in green, yellow and blue tile
    const d = g.p(-12, 19, 3.2), s = (u, v) => [d[0] + u, d[1] + v];
    const body = K.curve([s(-7, 2), s(-4, -1.5), s(0, -2.6), s(4, -2), s(7.5, 0.5), s(8.5, 2.5), s(5, 1.8), s(1, 1.5), s(-3, 2.6), s(-6, 4)], 3, true);
    g.fill2(body, '#6FA87A', true);
    const R = RNG(808); for (let i = 0; i < 40; i++) { const t = R(), p = [lerp(s(-6, 1)[0], s(7, 0)[0], t), lerp(s(-6, 1)[1], s(7, 0)[1], t) + (R() - 0.5) * 2.6]; g.fill2([[p[0] - 0.5, p[1] - 0.3], [p[0] + 0.5, p[1] - 0.4], [p[0] + 0.4, p[1] + 0.4], [p[0] - 0.4, p[1] + 0.3]], R.pick(['#E6C24F', '#4F8FBF', '#7DBF9A', '#E07A5A', '#3F6FA8']), true); }
    g.line2(body, { w: 0.6, c: '#2F5A3A', close: true, boil: false });
    g.disc2(s(7.6, 0.6), 0.5, '#2A2622'); for (const [u, v] of [[-3, 2.4], [3, 1.6]]) g.line2([s(u, v), s(u - 1, v + 2.4)], { w: 0.7, c: '#4F8A5A', boil: false });
    g.segs2([s(8.6, 2)[0], s(8.6, 2)[1], s(9.6, 3.2)[0], s(9.6, 3.2)[1]], '#BFE0E8', 0.6);
  }, { name: 'dragon stair' });

  /* ---- the boundary wall and the two lodges at the gate ---- */
  T.obj([-37, 34.5, -21, 36.5], (g) => { BC.prism(g, [[-27, 34.5], [-21, 34.5], [-21, 36.5], [-27, 36.5]], 0, 3.6, RUB, { w: 0.7 }); const f = g.p(-24, 36.55, 2.0); g.disc2(f, 1.3, '#F4EFE3'); K.text(g, 'L', 36.6, -24, 1.4, 0.8, 'PARK', '#3F6FA8', { center: true }); g.glow('lamp', -22, 37.1, 3.4, { r: 1.0 }); }, { name: 'wall' });
  T.obj([-5, 34.5, 10, 36.5], (g) => { BC.prism(g, [[-5, 34.5], [10, 34.5], [10, 36.5], [-5, 36.5]], 0, 3.6, RUB, { w: 0.7 }); const f = g.p(4, 36.55, 2.0); g.disc2(f, 1.4, '#F4EFE3'); K.text(g, 'L', 36.6, 4, 1.4, 0.8, 'GÜELL', '#3F6FA8', { center: true }); for (let x = -4; x < 10; x += 1.4) { const p = g.p(x, 36.5, 3.6); g.fill2(arcPts(p[0], p[1], 2.0, Math.PI, TAU, 5), '#F4EFE3', true); } for (const x of [-2, 8.5]) g.glow('lamp', x, 37.1, 3.4, { r: 1.0 }); }, { name: 'wall' });   // at night: street lamps on the park wall along Carrer d'Olot
  const lodge = (x0, y0, x1, y1, tower, seed) => T.obj([x0, y0, x1, y1], function (g) {
    g.boilP = 0.2;
    K.box(g, x0, y0, x1, y1, 0, 7, RUB, { w: 0.85 });
    const rb = []; const R = RNG(seed); for (let i = 0; i < 40; i++) { const onL = R() < 0.55, p = onL ? g.p(lerp(x0, x1, R()), y1 + 0.02, R() * 6.5) : g.p(x1 + 0.02, lerp(y0, y1, R()), R() * 6.5); rb.push(p[0] - 0.7, p[1], p[0] + 0.7, p[1] - 0.2); } g.segs2(rb, '#8C7458', 0.4);
    K.win(g, 'L', y1, x0 + 1.5, x0 + 3, 3, 5.4, { style: 'dark', arch: true, lit: 0 }); K.win(g, 'R', x1, y0 + 2, y0 + 3.4, 3, 5.4, { style: 'dark', arch: true, lit: 0 }); g.fill(K.on('L', y1 + 0.02, x1 - 3.4, x1 - 1.6, 0, 4.4), '#6B4A30');
    // the roof: a steep curved cap of brown and cream chequered tile with icing at the eaves
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = (x1 - x0) / 2 + 0.8;
    const d = K.dome(g, cx, cy, r, 7, tower ? 7 : 9.5, '#8A6A4A', { w: 0.8, shadow: '#6E5236' });
    const ch = []; for (let i = 0; i < 26; i++) { const t = R(), a = Math.PI * (0.05 + 0.9 * R()), q = [d.c[0] + d.a * Math.cos(a) * (1 - t * 0.6), d.c[1] - d.b * Math.sin(a) * t]; ch.push(q); } for (const q of ch) g.fill2([[q[0] - 0.8, q[1] - 0.5], [q[0] + 0.8, q[1] - 0.5], [q[0] + 0.8, q[1] + 0.5], [q[0] - 0.8, q[1] + 0.5]], '#F4EFE3', true);
    const ice = []; for (let i = 0; i <= 24; i++) { const a = Math.PI * i / 24, b = [d.c[0] - d.a * 1.04 * Math.cos(a), d.c[1] + Math.sin(a) * 2.0 + (i % 2 ? 1.6 : 0)]; ice.push(b); } g.line2(ice, { w: 2.2, c: CREAM, boil: false, ext: 0 }); const ice2 = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12; ice2.push([d.c[0] - d.a * 0.55 * Math.cos(a), d.c[1] - d.b * 0.62 + Math.sin(a) * 1.2]); } g.line2(ice2, { w: 1.4, c: CREAM, boil: false, ext: 0 });
    if (tower) {   // the tower with the chequered spire and the four-armed cross
      const tx = x1 - 1.6, ty = y0 + 1.6; K.cyl(g, tx, ty, 1.5, 7, 13, RUB, { w: 0.6, n: 10 });
      const b = g.p(tx, ty, 13), t = g.p(tx, ty, 19); g.fill2([[b[0] - 6.4, b[1]], [b[0] + 6.4, b[1]], [t[0], t[1]]], '#F4EFE3'); for (let k = 0; k < 5; k++) for (let j = 0; j < 4 - k * 0.6; j++) { const yy = lerp(b[1], t[1], (k + 0.5) / 6), ww = 6.4 * (1 - (k + 0.5) / 6); g.fill2([[b[0] - ww + j * 3.2, yy - 1], [b[0] - ww + j * 3.2 + 1.6, yy - 1], [b[0] - ww + j * 3.2 + 1.6, yy + 1], [b[0] - ww + j * 3.2, yy + 1]], '#3F6FA8', true); }
      g.line2([[b[0] - 6.4, b[1]], t, [b[0] + 6.4, b[1]]], { w: 0.6, boil: false });
      g.segs2([t[0], t[1], t[0], t[1] - 5.4, t[0] - 1.6, t[1] - 3.4, t[0] + 1.6, t[1] - 3.4, t[0] - 1.2, t[1] - 4.6, t[0] + 1.2, t[1] - 2.2], '#F4EFE3', 0.9);
    } else { const t = g.p(cx, cy, 14.5); g.fill2(arcPts(t[0], t[1] + 1.5, 3.2, Math.PI, TAU, 9), '#C9392E', true); for (const [dx, dy] of [[-1.6, 0.4], [0.8, -0.2], [2.0, 0.8], [-0.4, -1.0]]) g.disc2([t[0] + dx, t[1] + dy], 0.45, '#F6F3EA'); g.segs2([t[0], t[1] + 1.5, t[0], t[1] + 4], '#F4EFE3', 1.2); }
  }, { name: 'lodge' });
  lodge(-30, 26, -21, 34, true, 51);
  lodge(-4, 26, 5, 34, false, 52);

  /* ---- the Laundry Portico: leaning columns carrying a path along the right ---- */
  T.obj([20, -30, 27, 8], function (g) {
    g.boilP = 0.2;
    for (let y = -29; y < 8; y += 2.4) {
      const b = g.p(26.2, y, 0), t = g.p(24.4, y, 6.2); g.fill2([[b[0] - 1.1, b[1]], [b[0] + 1.1, b[1]], [t[0] + 1.3, t[1]], [t[0] - 1.3, t[1]]], '#B39872', true);
      const st = []; for (let k = 0; k < 4; k++) { const q = [lerp(b[0], t[0], (k + 0.5) / 4), lerp(b[1], t[1], (k + 0.5) / 4)]; st.push(q[0] - 1.0, q[1], q[0] + 1.0, q[1] - 0.3); } g.segs2(st, '#7A6248', 0.4);
      g.line2([[b[0] + 1.1, b[1]], [t[0] + 1.3, t[1]]], { w: 0.45, boil: false });
    }
    const deck = [[20, -30, 6.2], [26, -30, 6.2], [26, 8, 6.2], [20, 8, 6.2]]; g.fill(deck, '#D9C7A2'); g.fill([[26, -30, 6.2], [26, 8, 6.2], [26, 8, 7.2], [26, -30, 7.2]], '#B39872'); g.outline(deck, { w: 0.6, boil: false });
    for (let y = -29; y < 8; y += 3) { const p = g.p(25.8, y, 7.2); g.fill2([[p[0] - 1.2, p[1]], [p[0] + 1.2, p[1]], [p[0], p[1] - 2.6]], '#7FA65A', true); }
  }, { name: 'laundry portico', under: 6.2 });
  /* ---- Gaudí's house: pink, with a little spire ---- */
  T.obj([22, -36, 32, -31], function (g) {
    K.box(g, 22, -36, 32, -31, 0, 9, { t: '#F2D9CF', l: '#EDC9BE', r: '#D9AFA2' }, { w: 0.8 });
    for (const x of [23.5, 26.5, 29.5]) K.win(g, 'L', -31, x, x + 1.2, 4.5, 7.2, { style: 'glass', lit: 0.3 });
    K.hip(g, 21.6, -36.4, 32.4, -30.6, 9, 2.2, '#C9734F', { ridge: 4 });
    const s = g.p(29, -33, 11); g.fill2([[s[0] - 2, s[1]], [s[0] + 2, s[1]], [s[0], s[1] - 14]], '#7FA65A', true); g.line2([[s[0] - 2, s[1]], [s[0], s[1] - 14], [s[0] + 2, s[1]]], { w: 0.5, boil: false }); g.segs2([s[0], s[1] - 14, s[0], s[1] - 17, s[0] - 1.2, s[1] - 15.8, s[0] + 1.2, s[1] - 15.8], '#3A3530', 0.45);
  }, { name: 'gaudi house' });
  // trees: pines and palms round the edges, carobs on the slope
  for (const [x, y, k] of [[12, -32, 'pine'], [16, -22, 'pine'], [31, -16, 'palm'], [31, -3, 'pine'], [14, -8, 'olive'], [30, 14, 'palm'], [12, 18, 'pine'], [20, 28, 'olive'], [-33, 8, 'pine'], [-34, 18, 'palm'], [8, -36, 'pine']]) {
    if (k === 'palm') T.obj([x, y], (g) => K.palm(g, x, y, { h: 12, r: 4.4 }), { name: 'palm' });
    else T.obj([x, y], (g) => K.tree(g, x, y, { r: k === 'pine' ? 4.2 : 3.2, h: k === 'pine' ? 6.5 : 3.6, col: k === 'pine' ? '#6E9A50' : '#9DB27A' }), { name: k });
  }
  BC.block(T, { corners: { pp: 'motos', pn: 'bins', np: 'bicing' }, noTrees: ['y-', 'x-'] });

  /* ---- people ---- */
  // on the terrace: along the bench, some sitting on it, others photographing the view
  const BL = HALL[3] - 1.3;
  for (let i = 0; i < 10; i++) { const x = -30 + i * 3.3, y = BL - 1.2 - (i % 2) * 0.8, s = 3300 + i; if (i % 3 === 0) T.cast([x, y], (g) => BC.person(g, x, y, TER + 0.9, BC.who(s, { dir: 2, pose: 'sit' })), { on: true }); else T.cast([x, y - 0.6], (g) => BC.person(g, x, y - 0.6, TER, BC.who(s, { dir: i % 2 ? 1 : 0, pose: i % 4 === 1 ? 'hold' : 'stand', phone: i % 4 === 1 })), { on: true }); }
  for (let i = 0; i < 5; i++) { const y = -28 + i * 6, x = HALL[2] - 2.8; T.cast([x, y], (g) => BC.person(g, x, y, TER, BC.who(3320 + i, { dir: 3, pose: i % 2 ? 'hold' : 'stand', phone: i % 2 === 1 })), { on: true }); }
  BC.walker(T, BC.who(3330), [[-28, -24], [-2, -24], [-2, -8], [-28, -8]], 1.1, { phase: 0.1, z: TER });
  BC.walker(T, BC.who(3331, { sunhat: true }), [[-6, -28], [-26, -14], [-6, -14]], 1.0, { phase: 0.5, z: TER });
  BC.walker(T, BC.who(3332), [[-20, -20], [-10, -28], [-4, -18]], 0.9, { phase: 0.3, z: TER });
  // a guitarist at the head of the stair, under the colonnade, with listeners
  T.cast([-11.5, 4.5], (g) => { const r = BC.person(g, -11.5, 4.5, 2.5, BC.who(3340, { dir: 1, pose: 'stand', hands: [[1.8, -10.5], [-1.2, -12.5]] })); const hp = r.hip; g.fill2(K.curve([[hp[0] - 4, hp[1] + 1], [hp[0] - 1, hp[1] - 1.2], [hp[0] + 1.6, hp[1] + 0.4], [hp[0] + 0.6, hp[1] + 3], [hp[0] - 2, hp[1] + 3.2]], 3, true), '#B5763E', true); g.segs2([hp[0] - 1.2, hp[1] + 0.5, hp[0] + 5, hp[1] - 4], '#5A3E2E', 0.6); }, {});
  // the stair: tourists climbing and coming down, a pair photographing El Drac
  BC.walker(T, BC.who(3350), [[-16, 31], [-16, 7]], 0.9, { phase: 0.0, z: stairZ });
  BC.walker(T, BC.who(3351, { cap: '#C9584B' }), [[-8, 7], [-8, 31]], 0.9, { phase: 0.4, z: stairZ });
  BC.walker(T, BC.who(3352), [[-15, 7], [-15, 31]], 1.0, { phase: 0.7, z: stairZ });
  T.cast([-8.6, 22], (g) => { BC.person(g, -8.6, 22, stairZ(-8.6, 22), BC.who(3353, { dir: 2, pose: 'hold', phone: true, hands: [[1.8, -17.5], [1.2, -17]] })); }, {});
  T.cast([-15.4, 17], (g) => { BC.person(g, -15.4, 17, stairZ(-15.4, 17), BC.who(3354, { dir: 3, pose: 'wave', ph: 0.2 })); }, {});
  // the queue at the gate, and souvenir sellers with their cloths
  for (let i = 0; i < 7; i++) { const x = 6 + i * 1.6, y = 39.5; T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(3360 + i, { dir: 2, pose: 'stand' })), {}); }
  for (const [x, y, s] of [[-30, 39.6, 3370], [-22, 39.8, 3371]]) T.cast([x, y], (g) => { const q = [[x - 2.4, y - 0.8, 0.02], [x + 2.4, y - 0.8, 0.02], [x + 2.4, y + 1.2, 0.02], [x - 2.4, y + 1.2, 0.02]]; g.fill(q, '#F3F1EA'); const R = RNG(s); for (let i = 0; i < 8; i++) { const p = g.p(x - 2 + (i % 4) * 1.3, y - 0.4 + Math.floor(i / 4) * 1.0, 0.1); g.fill2([[p[0] - 0.7, p[1]], [p[0] + 0.7, p[1]], [p[0] + 0.7, p[1] - 1.2], [p[0] - 0.7, p[1] - 1.2]], R.pick(['#C9584B', '#4F8FBF', '#E6C24F', '#7DBF9A']), true); } BC.person(g, x + 2.8, y + 0.4, 0, BC.who(s + 5, { dir: 1, pose: 'stand', skin: SKIN[5] })); }, {});
  // people on the portico's path
  BC.walker(T, BC.who(3380), [[23, -28], [23, 6]], 1.0, { phase: 0.2, z: 6.2 });
  // a flock of monk parakeets wheeling over the park
  for (let i = 0; i < 6; i++) T.actor({ sample: 5, period: 14, layer: 'top', grow: false,
    at(t) { const a = t * 0.45 + i * 0.35, r = 14 + (i % 3) * 2.5, x = -12 + Math.cos(a) * r, y = -10 + Math.sin(a) * r * 0.8, f = Math.floor(t * 8 + i * 3) % 4; return { x, y, z: 20 + Math.sin(a * 2 + i) * 2.5, key: f, f }; },
    draw(g, st) { const c = g.p(0, 0, 0), w = [3.0, 1.6, -0.6, 1.6][st.f]; g.fill2([[c[0] - 1.6, c[1]], [c[0] + 1.8, c[1] - 0.2], [c[0] + 0.6, c[1] + 0.8]], '#6FB04A', true); g.fill2([[c[0] - 0.4, c[1] - 0.2], [c[0] + 0.4, c[1] - 0.2], [c[0] - 1.6, c[1] - w]], '#86C45A', true); g.fill2([[c[0] - 0.4, c[1]], [c[0] + 0.6, c[1]], [c[0] + 1.8, c[1] - w * 0.8]], '#5E9A40', true); g.disc2([c[0] + 1.9, c[1] - 0.3], 0.5, '#9AD06A'); } });
});
