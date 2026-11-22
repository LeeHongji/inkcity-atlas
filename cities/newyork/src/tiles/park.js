'use strict';
/* (100,100) Central Park, the near corner of the map, in fresh late-spring leaf.
   A low grey stone wall runs round the park inside the sidewalk, open at the gates; inside, the park drive makes a loop
   (horse carriages on its inner side, cyclists on the outer), with plane and elm trees between the drive and the wall.
   Within the loop: the Lake (sunk below its banks), pinched at a waist that Bow Bridge crosses: a low cast-iron arch,
   cream, with a lacy railing and planters at the ends; rowboats glide under it. On the lake's east side Bethesda
   Terrace: a sandstone terrace with the arched arcade in its face and a broad stair down to the paved plaza, where the
   Angel of the Waters stands on the fountain's upper basin and water falls in a ring into the pool. Sheep Meadow fills
   the near-left: sunbathers on towels, a picnic, a frisbee game. The near-right is a grove with benches, a man blowing
   giant soap bubbles for kids, a hot-dog cart by the drive, a dog walker.
   What moves: carriages, cyclists, joggers and walkers, rowboats, ducks, the fountain, the frisbee, the bubbles. */
SF.tile('park', 100, 100, { rim: 46 }, function (T) {
  const DR = 26.5, DW = 3.0, RC = 6;                              // the drive: centre line half-size, half width, corner radius
  const STONE = { t: '#C9C3B4', l: '#BDB6A6', r: '#A69F90' };
  /* a point at distance d round a rounded square (half r, corner rc), with its heading */
  const loopAt = (d, r, rc) => {
    const side = 2 * (r - rc), q = Math.PI / 2 * rc, per = 4 * (side + q);
    d = ((d % per) + per) % per;
    const cs = [[r - rc, r - rc, 0], [-(r - rc), r - rc, Math.PI / 2], [-(r - rc), -(r - rc), Math.PI], [r - rc, -(r - rc), Math.PI * 1.5]];
    for (let i = 0; i < 4; i++) {
      const [cx, cy, a0] = cs[i], sx = cx + Math.cos(a0) * rc, sy = cy + Math.sin(a0) * rc, tx = -Math.sin(a0), ty = Math.cos(a0);
      if (d < side) { const u = d - side; return { x: sx + tx * u, y: sy + ty * u, ang: Math.atan2(ty, tx) }; }
      d -= side;
      if (d < q) { const a = a0 + d / rc; return { x: cx + Math.cos(a) * rc, y: cy + Math.sin(a) * rc, ang: a + Math.PI / 2 }; }
      d -= q;
    }
    return { x: r, y: 0, ang: Math.PI / 2 };
  };
  const loopPer = (r, rc) => 4 * (2 * (r - rc) + Math.PI / 2 * rc);
  const ring = (r, rc, n) => { const per = loopPer(r, rc), p = []; for (let i = 0; i < n; i++) { const s = loopAt(per * i / n, r, rc); p.push([s.x, s.y, 0]); } return p; };
  // a ribbon of half-width hw along a polyline (world), as a polygon
  const ribbon = (pts, hw) => {
    const L = [], R = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      L.push([pts[i][0] - dy / l * hw, pts[i][1] + dx / l * hw, 0]); R.push([pts[i][0] + dy / l * hw, pts[i][1] - dx / l * hw, 0]);
    }
    return L.concat(R.reverse());
  };
  /* a park rowboat: a low hull with a green gunwale, the rower facing the stern pulling two oars */
  const rowboat = (g, ang, who, ph, hull) => {
    const L = 2.6, Wd = 1.15, ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, v, z) => [u * ca - v * sa, u * sa + v * ca, z];
    const gun = [pt(-L, -Wd, 0.6), pt(L * 0.45, -Wd, 0.6), pt(L * 1.1, 0, 0.75), pt(L * 0.45, Wd, 0.6), pt(-L, Wd, 0.6)];
    const wl = [pt(-L * 0.9, -Wd * 0.8, 0), pt(L * 0.4, -Wd * 0.8, 0), pt(L * 0.95, 0, 0), pt(L * 0.4, Wd * 0.8, 0), pt(-L * 0.9, Wd * 0.8, 0)];
    g.fill(wl.map((p) => [p[0] * 1.18, p[1] * 1.18, 0]), '#CFE2EC');
    const sides = []; for (let i = 0; i < 5; i++) { const j = (i + 1) % 5; sides.push({ q: [wl[i], wl[j], gun[j], gun[i]], d: wl[i][0] + wl[j][0] + wl[i][1] + wl[j][1] }); }
    sides.sort((a, b) => a.d - b.d);
    g.fill(gun, '#8E7A5C');
    for (const sd of sides.slice(2)) { g.fill(sd.q, hull); g.fill([sd.q[3], sd.q[2], [sd.q[2][0], sd.q[2][1], 0.42], [sd.q[3][0], sd.q[3][1], 0.42]], '#3E7A5A'); g.outline(sd.q, { w: 0.5, boil: false }); }
    const kk = 0.8, F = g.p(0, 0, 0.15), rel = (q) => [(q[0] - F[0]) / kk, (q[1] - F[1]) / kk];
    const bc = Math.cos(ang + Math.PI), bs = Math.sin(ang + Math.PI), d = (bc + bs > 0) ? (bc - bs > 0 ? 0 : 1) : (bc - bs > 0 ? 3 : 2);
    const sw = Math.sin(ph * TAU) * 0.5;
    const oar = (s2) => ({ grip: g.p.apply(g, pt(0.15 + sw * 0.3, s2 * Wd * 0.4, 1.6)), blade: g.p.apply(g, pt(-0.6 - sw, s2 * Wd * 2.6, 0.05)) });
    const oars = [oar(1), oar(-1)].sort((a, b) => a.grip[1] - b.grip[1]);
    const drawOar = (q) => { g.line2([q.grip, q.blade], { w: 0.55, c: '#7A5A3C', boil: false, ext: 0 }); g.disc2(q.blade, 0.9, '#C9A26B'); };
    drawOar(oars[0]);
    K.person(g, 0, 0, 0.15, Object.assign({ pose: 'sit', k: kk }, who, { dir: d, noLegs: true, lean: 0, hands: [rel(oars[0].grip), rel(oars[1].grip)] }));
    drawOar(oars[1]);
  };
  /* a hansom-style carriage: black body, red seat, folding hood, big spoked wheels; a white horse with a red plume */
  const carriage = (g, ang, ph, driver, riders) => {
    const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z), towards = ca + sa > 0.05;
    const side = (v) => (-sa * v + ca * v);   // > 0: this side faces us
    const horse = () => {
      const st = Math.sin(ph * TAU) * 0.5, HC = '#ECE6D6', HD = '#D6CDB8';
      const prof = (pts, v, col) => g.fill2(pts.map(([u, z]) => pt(u, v, z)), col, true);
      const BODY = [[2.6, 3.4], [2.4, 4.6], [3.2, 5.3], [6.6, 5.2], [7.6, 4.6], [7.4, 3.4], [6.6, 3.0], [3.4, 3.0]];
      const NECK = [[6.6, 4.6], [7.6, 6.4], [8.0, 7.5], [9.6, 6.9], [9.5, 6.4], [8.6, 6.5], [7.9, 5.0]];
      const legs = (v) => { const s = []; for (const [u, d] of [[3.3, st], [3.9, -st], [6.6, -st], [7.1, st]]) { const a = pt(u, v, 3.2), b = pt(u + d, v, 0); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#B9AE96', 1.1); };
      const far = side(1) > 0 ? -0.55 : 0.55;
      legs(far); prof(BODY, far, HD); prof(NECK, far, HD);
      legs(-far); prof(BODY, -far, HC); prof(NECK, -far, HC);
      prof([[2.6, 4.6], [1.9, 3.7], [2.1, 2.5], [2.6, 3.7]], -far, '#CFC4AA');
      prof([[8.0, 7.5], [8.1, 8.2], [8.5, 7.5]], -far, HD); prof([[7.6, 7.4], [7.5, 8.6], [8.1, 7.6]], -far, '#C9463E');
      g.line2([[2.6, 3.4], [2.4, 4.6], [3.2, 5.3], [6.6, 5.2], [7.9, 7.5], [9.6, 6.9], [9.5, 6.4], [7.9, 5.0], [7.4, 3.4], [6.6, 3.0], [3.4, 3.0]].map(([u, z]) => pt(u, -far, z)), { w: 0.45, c: '#7A6E58', boil: false });
      g.disc2(pt(9.0, -far * 1.1, 7.0), 0.28, '#2A2622');
      const h1 = pt(2.4, 0.95, 3.6), h2 = pt(-0.2, 0.95, 2.4), h3 = pt(2.4, -0.95, 3.6), h4 = pt(-0.2, -0.95, 2.4); g.segs2([h1[0], h1[1], h2[0], h2[1], h3[0], h3[1], h4[0], h4[1]], '#2A2622', 0.55);
    };
    const B0 = K.rbox(g, 0, 0, 2.2, 1.5, ang, 0, 0.01, '#000', { line: false, nt: true }); K.shadow(g, B0);
    if (!towards) horse();
    K.wheels(g, B0, [-1.2], 1.15, 'far', { zc: 1.15 }); K.wheels(g, B0, [1.4], 0.8, 'far', { zc: 0.8 });
    K.rbox(g, 0, 0, 2.0, 1.35, ang, 1.2, 2.5, { t: '#3A3632', l: '#2F2C2A', r: '#252220' }, { w: 0.6 });
    K.rbox(g, -0.9 * ca, -0.9 * sa, 0.9, 1.25, ang, 2.5, 3.0, '#A8322B', { w: 0.45 });
    const dir = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2);
    const hood = () => { const pts = []; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; pts.push(pt(-2.0 - Math.sin(t) * 0.5, Math.cos(t) * 1.35, 3.0 + Math.sin(t) * 2.4)); } g.fill2(pts, '#2F2C2A'); g.line2(pts, { w: 0.5, boil: false }); };
    if (!towards) hood();
    riders.forEach((w, i) => NK.person(g, -0.9 * ca - (i - 0.5) * 1.2 * -sa, -0.9 * sa - (i - 0.5) * 1.2 * ca, 3.0, Object.assign({}, w, { pose: 'sit', dir, k: 0.88 })));
    NK.person(g, 1.3 * ca, 1.3 * sa, 2.9, Object.assign({}, driver, { pose: 'sit', dir, k: 0.88, hat: '#2F2C2A', reach: [dir === 0 || dir === 3 ? 4 : -4, -3] }));
    if (towards) hood();
    K.wheels(g, B0, [-1.2], 1.15, 'near', { zc: 1.15 }); K.wheels(g, B0, [1.4], 0.8, 'near', { zc: 0.8 });
    if (towards) horse();
  };
  const LAKE = K.curve([[-22.5, -17], [-19, -21.4], [-13, -20.8], [-9, -16.2], [-4.5, -19.5], [1.5, -19], [4.6, -14], [3.2, -7.5], [-2.6, -5.6], [-9, -8.4], [-14, -3.6], [-20.5, -4.6], [-23, -10.5]], 6, true);
  const WZ = -0.7;
  const PATHS = [
    [[-4, 31], [-6, 24], [-6, 14], [-9, 4], [-12, -1.5]],
    [[31, 2], [24, 2], [17, 4], [10, 2], [8, -3]],
    [[14, 31], [14, 24], [10, 16], [4, 8], [-1, 2], [-4, -2]],
    [[-9, -2.5], [-9, -6.4]], [[-9, -17.6], [-9, -21.5]],
  ];
  const PLAZA = [11, -10, 6.6];

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    g.boilP = 0.2;
    NK.lot(g, { inner: '#ADCB85' });
    g.grass(K.rect(-31, -31, 31, 31), { dens: 0.7 });
    // Sheep Meadow: a lighter, mown lawn
    const mw = K.curve([[-22, 3], [-4, 2.5], [2, 9], [0, 22.5], [-21.5, 22.5]], 4, true);
    g.fill(mw, '#BFD99A'); g.grass(mw, { dens: 0.45 });
    // the drive
    const outer = ring(DR + DW, RC + DW, 64), inner = ring(DR - DW, Math.max(1, RC - DW), 64);
    g.fill(outer, '#CBC4B4'); g.fill(inner, '#ADCB85'); g.grass(inner.slice(0), { dens: 0 });
    g.line(outer.concat([outer[0]]), { w: 0.55, c: '#A39C8C', boil: false }); g.line(inner.concat([inner[0]]), { w: 0.55, c: '#A39C8C', boil: false });
    const cl = ring(DR, RC, 96), dash = []; for (let i = 0; i < cl.length; i += 2) { const a = g.p.apply(g, cl[i]), b = g.p.apply(g, cl[(i + 1) % cl.length]); dash.push(a[0], a[1], b[0], b[1]); } g.segs2(dash, '#F6F2E6', 0.6);
    // the re-grassed inside and the meadow again (the drive fill covered them)
    g.fill(inner, '#ADCB85'); g.grass(inner, { dens: 0.7 }); g.fill(mw, '#BFD99A'); g.grass(mw, { dens: 0.45 }); g.outline(mw, { w: 0.35, c: '#93AE70', boil: false });
    // foot paths, from the gates through the drive to the middle
    for (const p of PATHS) { const q = ribbon(K.curve(p.map((v) => [v[0], v[1]]), 4, false), 1.25); g.fill(q, '#E3D6B6'); g.scuff(q, { dir: -0.4, len: 2.5, c: '#D2C29E', dens: 0.6, w: 0.4 }); }
    // the fountain plaza
    const pz = K.arc(PLAZA[0], PLAZA[1], 0, PLAZA[2], 0, TAU, 32);
    g.fill(pz, '#E5D3B0'); g.scuff(pz, { dir: 0.3, len: 2.4, c: '#D3BE96', dens: 0.7, w: 0.4 }); g.outline(pz, { w: 0.5, c: '#B39F7C', boil: false });
    const tiles = []; for (let r = 2.2; r < PLAZA[2]; r += 1.8) { const c = K.arc(PLAZA[0], PLAZA[1], 0, r, 0, TAU, 28); for (let i = 0; i < c.length - 1; i += 2) { const a = g.p.apply(g, c[i]), b = g.p.apply(g, c[i + 1]); tiles.push(a[0], a[1], b[0], b[1]); } } g.segs2(tiles, '#D3BE96', 0.3);
    // the Lake: a muddy bank, the water sunk below it, ripples, the shore line
    g.fill(LAKE, '#8E8A6E');
    const wt = LAKE.map((p) => [p[0], p[1], WZ]);
    g.fill(wt, '#9CC3D9'); g.water(LAKE.map((p) => [p[0] * 0.92 - 0.6, p[1] * 0.92 - 0.8, WZ]), { dens: 0.9 });
    g.line(LAKE.concat([LAKE[0]]).map((p) => [p[0], p[1], 0]), { w: 0.6, c: '#5F7F6C', boil: false });
    // towels on the meadow and the picnic rug
    for (const [x, y, a, col] of [[-17, 9, 0.3, '#E7A9A0'], [-12, 15, -0.2, '#7FB7D9'], [-19, 18, 0.1, '#E6C24F'], [-7, 9, 0.5, '#F3F1EA'], [-14, 5, -0.4, '#8FBF73']]) {
      const ca = Math.cos(a), sa = Math.sin(a), q = [[-2.6, -1.2], [2.6, -1.2], [2.6, 1.2], [-2.6, 1.2]].map(([u, v]) => [x + u * ca - v * sa, y + u * sa + v * ca, 0.02]);
      g.fill(q, col); g.outline(q, { w: 0.3, c: shade(col, 0.4), boil: false });
    }
    const rug = K.rect(-4.5, 15, 0.5, 19.5, 0.02); g.fill(rug, '#C9463E'); const ch = []; for (let k = 0; k <= 5; k++) { const a = g.p(-4.5 + k, 15, 0.03), b = g.p(-4.5 + k, 19.5, 0.03), c = g.p(-4.5, 15 + k * 0.9, 0.03), d = g.p(0.5, 15 + k * 0.9, 0.03); ch.push(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]); } g.segs2(ch, '#F3F1EA', 0.45);
  }, { rim: true });

  /* ---------------- the wall and the trees round the edge ---------------- */
  const wallSeg = (x0, y0, x1, y1) => T.obj([x0, y0, x1, y1], (g) => { K.box(g, x0, y0, x1, y1, 0, 1.2, STONE, { w: 0.6 }); const s = []; for (const [f, pl, A0, A1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) for (let a = A0 + 1.1; a < A1; a += 1.7) { const p0 = g.p.apply(g, K.pt(f, pl + 0.02, a, 0.1)), p1 = g.p.apply(g, K.pt(f, pl + 0.02, a, 1.1)); s.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(s, '#8E887A', 0.3); }, { name: 'wall' });
  for (const [a0, a1] of [[-30.5, -14], [-14, -5.5], [-2.5, 12], [12, 30.5]]) { wallSeg(a0, -31, a1, -30.2); wallSeg(-31, a0, -30.2, a1); }
  for (const [a0, a1] of [[-30.5, -16], [-16, -5.6], [-2.4, 12.6], [15.6, 30.5]]) wallSeg(a0, 30.2, a1, 31);
  for (const [a0, a1] of [[-30.5, -16], [-16, 0.6], [3.4, 16], [16, 30.5]]) wallSeg(30.2, a0, 31, a1);
  const TC = ['#8DB868', '#7FAE62', '#9CC46F', '#6E9E55', '#86B25E'];
  const edgeTrees = [];
  for (let a = -24; a <= 24; a += 8) for (const [x, y] of [[a, -29.4], [-29.4, a], [a + 3, 29.4], [29.4, a + 3]]) {
    if ((Math.abs(x - 14) < 3 && y > 28) || (Math.abs(x + 4) < 3 && y > 28) || (Math.abs(y - 2) < 3 && x > 28)) continue;
    edgeTrees.push([x, y]);
  }
  edgeTrees.forEach(([x, y], i) => T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.6 + (i % 3) * 0.5, h: 5.4, col: TC[i % TC.length] }), { name: 'tree' }));
  // groves inside the loop
  for (const [x, y, r] of [[-17, -0.5, 3.4], [-21, -18.5, 3.0], [6, -20, 3.2], [-1, -21.5, 2.8], [19, -6, 3.6], [20, 6, 4.0], [15, 12, 3.4], [21, 15, 3.6], [7, 20, 3.2], [-21, 1, 3.0], [3, 2.5, 2.8], [-2, 13, 2.6]]) {
    T.obj([x, y], (g) => K.tree(g, x, y, { r, h: 4.8, col: TC[Math.round(x * 3 + y) & 3] }), { name: 'grove' });
  }

  /* ---------------- Bethesda Terrace and the fountain ---------------- */
  T.obj([3, -24, 19, -19.5], function (g) {
    const SAND = { t: '#E3CFA8', l: '#D9BE92', r: '#C6A87B' }, Z = 2.6;
    K.box(g, 3, -24, 19, -19.5, 0, Z, SAND, { w: 0.85 });
    // the arcade: three round arches in the face, dark inside, the middle one behind the stair
    for (const [a0, a1] of [[4.2, 7.4], [15, 18.2]]) { g.lit({ nc: '#FBC76E' }, () => K.win(g, 'L', -19.48, a0, a1, 0, Z - 0.35, { style: 'dark', arch: true, w: 0.5 })); g.glow('lantern', (a0 + a1) / 2, -19.2, 1.2, { r: 2.0, col: '#FFC27A' }); }   // the arcade lit at night
    g.lit({ nc: '#FBC76E' }, () => K.win(g, 'R', 19.02, -23.4, -20.2, 0, Z - 0.35, { style: 'dark', arch: true, w: 0.5 })); g.glow('lantern', 19.3, -21.8, 1.2, { r: 2.0, col: '#FFC27A' });
    // the balustrade along the edge, broken by the stair
    const bal = (a0, a1) => { K.box(g, a0, -19.9, a1, -19.5, Z, Z + 1.1, { t: '#EBDAB6', l: '#E3CFA8', r: '#CDB48A' }, { w: 0.45, boil: false }); const s = []; for (let a = a0 + 0.35; a < a1; a += 0.55) { const p0 = g.p(a, -19.45, Z + 0.15), p1 = g.p(a, -19.45, Z + 0.85); s.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(s, '#B39F7C', 0.35); };
    bal(3, 8); bal(14, 19);
    const sb = []; for (let a = -23.6; a < -19.9; a += 0.55) { const p0 = g.p(19.05, a, Z + 0.15), p1 = g.p(19.05, a, Z + 0.85); sb.push(p0[0], p0[1], p1[0], p1[1]); } K.box(g, 18.6, -24, 19, -19.9, Z, Z + 1.1, { t: '#EBDAB6', l: '#E3CFA8', r: '#CDB48A' }, { w: 0.45, boil: false }); g.segs2(sb, '#B39F7C', 0.35);
    // urns of flowers on the balustrade ends
    for (const x of [7.6, 14.4]) { const c = g.p(x, -19.7, Z + 1.1); g.fill2([[c[0] - 1.2, c[1]], [c[0] + 1.2, c[1]], [c[0] + 1.6, c[1] - 1.6], [c[0] - 1.6, c[1] - 1.6]], '#CDB48A', true); for (let k = 0; k < 5; k++) g.disc2([c[0] - 1.4 + k * 0.7, c[1] - 2.1 - (k % 2) * 0.5], 0.7, k % 2 ? '#D98AA4' : '#E07A6A'); }
  }, { name: 'terrace' });
  T.obj([8, -19.5, 14, -16], function (g) {
    const n = 7, Z = 2.6;
    for (let i = 0; i < n; i++) { const y0 = -19.5 + 3.5 * i / n, y1 = -19.5 + 3.5 * (i + 1) / n, z = Z * (1 - i / n); g.fill(K.rect(8, y0, 14, y1, z), '#E3CFA8'); g.fill([[8, y1, z], [14, y1, z], [14, y1, z - Z / n], [8, y1, z - Z / n]], '#D2B88E'); }
    g.fill([[14, -19.5, Z], [14, -16, 0], [14, -19.5, 0]], '#C6A87B'); g.line([[14, -19.5, Z], [14, -16, 0]], { w: 0.5, boil: false }); g.line([[8, -19.5, Z], [8, -16, 0]], { w: 0.5, boil: false });
  }, { name: 'stair' });
  T.obj([PLAZA[0] - 4.6, PLAZA[1] - 4.6, PLAZA[0] + 4.6, PLAZA[1] + 4.6], function (g) {
    const [x, y] = PLAZA;
    K.cyl(g, x, y, 4.4, 0, 0.9, { t: '#B7D3E1', l: '#D9C6A0', r: '#C2AC84' }, { w: 0.75, n: 24, top: '#A9CBDD' });
    g.water(K.arc(x, y, 0.9, 3.6, 0, TAU, 16), { dens: 0.6 });
    K.cyl(g, x, y, 0.7, 0.9, 2.7, { t: '#D9C6A0', l: '#D9C6A0', r: '#BFA67C' }, { w: 0.55, n: 10 });
    K.cyl(g, x, y, 2.0, 2.4, 2.9, { t: '#A9CBDD', l: '#D9C6A0', r: '#BFA67C' }, { w: 0.6, n: 16, top: '#A9CBDD' });
    K.cyl(g, x, y, 0.45, 2.9, 3.6, { t: '#5E7E6A', l: '#6F8F7A', r: '#557060' }, { w: 0.45, n: 8 });
    // the Angel of the Waters: a bronze angel with wings spread wide, one arm held out over the water with a lily
    const c = g.p(x, y, 3.6), s = (u, v) => [c[0] + u, c[1] + v], BR = '#6F8F7A', BD = '#4F6A5A', INK = '#33443A';
    const wingL = [s(-0.6, -11.0), s(-3.4, -14.6), s(-6.6, -15.8), s(-5.8, -13.6), s(-6.4, -12.6), s(-4.6, -11.6), s(-5.0, -10.4), s(-2.0, -9.4)];
    const wingR = [s(0.6, -11.0), s(3.0, -15.4), s(5.6, -17.2), s(5.2, -14.6), s(6.0, -13.6), s(4.2, -12.4), s(4.6, -11.0), s(1.8, -9.4)];
    g.fill2(wingL, BD, true); g.fill2(wingR, BR, true);
    const robe = [s(-2.2, 0), s(2.2, 0), s(1.6, -3.0), s(1.3, -7.0), s(1.4, -10.6), s(-1.2, -10.6), s(-1.3, -7.0), s(-1.7, -3.0)];
    g.fill2(robe, BR, true); g.fill2([s(0.2, 0), s(2.2, 0), s(1.6, -3), s(1.3, -7), s(1.4, -10.6), s(0.4, -10.6)], BD, true);
    g.disc2(s(0, -11.7), 1.2, BR); g.fill2([s(-1.1, -12.2), s(1.0, -12.6), s(0.6, -13.2), s(-0.8, -13.0)], BD, true);
    g.fill2([s(1.0, -9.8), s(4.6, -11.4), s(4.8, -10.8), s(1.2, -8.8)], BR, true); g.disc2(s(5.1, -11.5), 0.65, '#E9E1CC');
    g.fill2([s(-1.0, -9.6), s(-2.0, -7.2), s(-1.4, -7.0), s(-0.6, -8.6)], BR, true);
    for (const pl of [wingL, wingR, robe]) g.line2(pl.concat([pl[0]]), { w: 0.4, c: INK, boil: false, wob: 0.2 });
    // at night the fountain is lit: the water from below, the angel from her basin
    NK.nmark(g, 0, { nc: (cc) => ({ '#B7D3E1': '#9CD2F0', '#A9CBDD': '#8CC8EC' })[cc] });
    NK.nmark(g, 0, { nc: (cc) => ({ [BR]: '#A9CDB2', [BD]: '#7FA48C', '#E9E1CC': '#FFF4DA' })[cc] });
    g.glow('lantern', x, y, 1.2, { r: 3.4, col: '#D6ECFF' }); g.glow('lantern', x, y, 6.5, { r: 3.0, col: '#FFF0D0' });
  }, { name: 'fountain' });
  // the falling water: a ring of drops from the upper basin into the pool, rings spreading
  T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 8) % 6; return { x: PLAZA[0] + 0.05, y: PLAZA[1] + 0.05, z: 0, key: f, f }; },
    draw(g, st) {
      const segs = [], drops = [];
      for (let i = 0; i < 18; i++) {
        const a = TAU * i / 18, top = g.p(Math.cos(a) * 2.05, Math.sin(a) * 2.05, 2.75), bot = g.p(Math.cos(a) * 2.5, Math.sin(a) * 2.5, 0.95);
        if (Math.sin(a) + Math.cos(a) < -0.6) continue;
        segs.push(top[0], top[1], lerp(top[0], bot[0], 0.5) + Math.cos(a) * 0.4, lerp(top[1], bot[1], 0.55), lerp(top[0], bot[0], 0.5) + Math.cos(a) * 0.4, lerp(top[1], bot[1], 0.55), bot[0], bot[1]);
        const k = ((i * 7 + st.f) % 6) / 6; drops.push([lerp(top[0], bot[0], k), lerp(top[1], bot[1], k)]);
      }
      g.segs2(segs, 'rgba(236,246,250,0.85)', 0.75); g.cmds[g.cmds.length - 1].nc = 'rgba(236,246,255,0.9)';   // lit at night
      for (const d of drops) { g.disc2(d, 0.45, '#F6FAFC'); g.mark({ nc: true }); }
      const rr = 2.8 + (st.f / 6) * 1.2; g.line(K.arc(0, 0, 0.92, rr, 0, Math.PI, 14), { w: 0.4, c: 'rgba(246,250,252,0.9)', boil: false, wob: 0.3 });
    } });

  /* ---------------- Bow Bridge ---------------- */
  const BX = -9, BY0 = -17.6, BY1 = -6.4, deckZ = (y) => (y < BY0 || y > BY1) ? 0 : 0.3 + 1.5 * Math.sin(Math.PI * (y - BY0) / (BY1 - BY0));
  T.obj([BX - 1.6, BY0, BX + 1.6, BY1], function (g) {
    const n = 16, top = [], bot = [], CR = '#EFE8D6', SH = '#D6CDB6';
    for (let i = 0; i <= n; i++) { const y = lerp(BY0, BY1, i / n); top.push([BX + 1.4, y, deckZ(y)]); bot.push([BX + 1.4, y, i === 0 || i === n ? 0 : deckZ(y) - 0.55 - 0.9 * Math.sin(Math.PI * i / n)]); }
    // the far railing, the deck, then the near side: the arched fascia with its lace railing
    const far = top.map((p) => [BX - 1.4, p[1], p[2] + 1.2]), farB = top.map((p) => [BX - 1.4, p[1], p[2]]);
    g.fine(far, { w: 0.4, c: '#8C8576' });
    const deck = top.map((p) => [BX - 1.4, p[1], p[2]]).concat(top.slice().reverse());
    g.fill(deck, '#D9CCAE'); void farB;
    const pl = []; for (let i = 0; i <= n; i += 2) { const a = g.p.apply(g, [BX - 1.4, top[i][1], top[i][2]]), b = g.p.apply(g, far[i]); pl.push(a[0], a[1], b[0], b[1]); } g.segs2(pl, '#8C8576', 0.3);
    g.fill(top.concat(bot.slice().reverse()), CR);
    g.fill(bot.map((p) => [p[0] - 0.02, p[1], p[2]]).concat(bot.map((p) => [p[0] - 0.02, p[1], p[2] + 0.35]).reverse()), SH);
    const rail = top.map((p) => [p[0], p[1], p[2] + 1.2]);
    g.fill(top.concat(rail.slice().reverse()), 'rgba(239,232,214,0.35)');
    const lace = []; for (let i = 0; i < n; i++) { const a = g.p.apply(g, top[i]), b = g.p.apply(g, rail[i + 1]), c = g.p.apply(g, rail[i]), d = g.p.apply(g, top[i + 1]); lace.push(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]); } g.segs2(lace, '#B9AE92', 0.3);
    g.line(rail, { w: 0.55, c: '#8C8576', boil: false }); g.line(top, { w: 0.6, boil: false }); g.line(bot, { w: 0.55, c: '#8C8576', boil: false });
    for (const y of [BY0 + 0.3, BY1 - 0.3]) for (const x of [BX - 1.5, BX + 1.5]) { const c = g.p(x, y, 0); g.fill2([[c[0] - 1.2, c[1]], [c[0] + 1.2, c[1]], [c[0] + 1.5, c[1] - 2.2], [c[0] - 1.5, c[1] - 2.2]], '#E3DAC2', true); g.disc2([c[0], c[1] - 2.9], 1.3, '#E07A6A'); g.disc2([c[0] - 0.7, c[1] - 3.2], 0.6, '#D98AA4'); }
  }, { name: 'bow bridge', under: 0.3 });

  /* ---------------- the living layer: the meadow, the grove ---------------- */
  // sunbathers on their towels, a reader, the picnic
  for (const [x, y, s, lie] of [[-17, 9, 1, -2.6], [-12, 15, 2, 0.4], [-7, 9, 3, -2.2], [-14, 5, 4, 0.6]]) T.cast([x, y], (g) => NK.person(g, x, y, 0.05, NK.who(1300 + s, { lie, bare: true, shorts: s % 2 === 0, glasses: true })), { name: 'sunbather' });
  T.cast([-19, 18], (g) => { NK.person(g, -19.6, 17.6, 0.05, NK.who(1310, { pose: 'sit', dir: 1, bare: true })); const h = g.p(-18.6, 18.8, 0.05); g.fill2([[h[0] - 1.6, h[1] - 0.6], [h[0] + 1.4, h[1] - 1.4], [h[0] + 1.6, h[1] - 0.2], [h[0] - 1.4, h[1] + 0.6]], '#F3F1EA', true); }, { name: 'reader' });
  T.cast([-2, 17], (g) => {
    NK.person(g, -3.6, 16.2, 0.05, NK.who(1320, { pose: 'sit', dir: 0 }));
    const b = g.p(-2, 17.6, 0.05); g.fill2([[b[0] - 1.5, b[1]], [b[0] + 1.5, b[1]], [b[0] + 1.3, b[1] - 1.6], [b[0] - 1.3, b[1] - 1.6]], '#B98A5A', true); g.line2(arcPts(b[0], b[1] - 1.6, 1.2, Math.PI, TAU, 6), { w: 0.4, c: '#6E4F35', boil: false });
    NK.person(g, -0.6, 16.6, 0.05, NK.who(1321, { pose: 'sit', dir: 1, dress: '#E6C24F' })); NK.person(g, -2.4, 18.8, 0.05, NK.who(1322, { pose: 'sit', dir: 3, k: 0.75 }));
  }, { name: 'picnic' });
  // frisbee: two players and the disc flying between them
  T.cast([-20, 12], (g) => NK.person(g, -20, 12, 0, NK.who(1330, { dir: 0, pose: 'wave', ph: 0.3, shorts: true })), { name: 'thrower' });
  T.cast([-9, 20.5], (g) => NK.person(g, -9, 20.5, 0, NK.who(1331, { dir: 2, pose: 'cheer', ph: 0.2, cap: '#2F3A4F' })), { name: 'catcher' });
  T.actor({ sample: 0.2, period: 4,
    at(t) { const u = (t / 2) % 2, f = u < 1 ? u : 2 - u, x = lerp(-19.4, -9.6, f), y = lerp(12.3, 20.2, f); return { x, y, z: 5.5 + Math.sin(f * Math.PI) * 3, key: 0 }; },
    draw(g) { const c = g.p(0, 0, 0); g.fill2(arcPts(c[0], c[1], 1.1, 0, TAU, 10).map((p) => [p[0], c[1] + (p[1] - c[1]) * 0.45]), '#E8742C', true); } });
  // benches in the grove with sitters
  for (const [x, y, face, s] of [[16.5, 2.6, 'L', 1], [9, 6.4, 'R', 2], [23, 10, 'L', 3]]) T.cast([x, y], (g) => { K.bench(g, x, y, { face, L: 2.2, col: '#6E7A4E' }); NK.person(g, face === 'L' ? x : x + 1.0, face === 'L' ? y + 1.0 : y, 1.3, (s === 2 ? NK.suit : NK.who)(1340 + s, { dir: face === 'L' ? 1 : 0, pose: 'sit', coffee: s === 1 })); }, { name: 'bench' });
  // the bubble man and the kids
  T.cast([12, 22], (g) => { const r = NK.person(g, 12, 22, 0, NK.who(1350, { dir: 1, pose: 'hold', hat: '#5A4A3C', beard: true })); const h = r.hands[0]; g.fine2([[h[0], h[1]], [h[0] - 3, h[1] - 6], [h[0] + 1.4, h[1] - 6.6]], { w: 0.35, c: '#7A5A3C' }); NK.person(g, 9.5, 24.5, 0, NK.who(1351, { dir: 3, pose: 'cheer', ph: 0.4, k: 0.72 })); NK.person(g, 13.6, 25.2, 0, NK.who(1352, { dir: 2, pose: 'wave', ph: 0.1, k: 0.7, dress: '#D98AA4' })); }, { name: 'bubbles man' });
  T.actor({ sample: 5, period: 10, layer: '',
    at(t) { const f = Math.floor(t * 4) % 16; return { x: 12.5, y: 23, z: 0, key: f, f }; },
    draw(g, st) {
      for (let k = 0; k < 3; k++) {
        const u = ((st.f / 16) + k / 3) % 1, c = g.p(-1.5 - u * 6, -1 - u * 4, 7 + u * 6), r = 2.2 + u * 1.6 + Math.sin(u * 9 + k) * 0.4;
        const pts = []; for (let i = 0; i < 14; i++) { const a = TAU * i / 14, w = 1 + 0.12 * Math.sin(a * 3 + u * 10 + k); pts.push([c[0] + Math.cos(a) * r * 1.3 * w, c[1] + Math.sin(a) * r * w]); }
        g.fill2(pts, 'rgba(232,240,246,' + (0.45 * (1 - u * 0.6)).toFixed(2) + ')', true);
        g.line2(pts.slice(2, 10), { w: 0.35, c: 'rgba(160,140,190,' + (0.8 * (1 - u)).toFixed(2) + ')', boil: false, wob: 0.2 });
        g.disc2([c[0] - r * 0.5, c[1] - r * 0.4], 0.4, 'rgba(255,255,255,0.8)');
      }
    } });
  // the hot-dog cart by the drive, a customer; people on the terrace looking at the fountain
  T.cast([18, -14], (g) => { NK.cart(g, 18, -14, { along: 'y' }); NK.person(g, 18.6, -10.8, 0, NK.tourist(1360, { dir: 3, pose: 'hold' })); NK.person(g, 20.8, -13.4, 0, NK.who(1361, { dir: 2, cap: '#2F3A4F' })); }, { name: 'cart' });
  T.cast([5.5, -20.6], (g) => { NK.person(g, 5.2, -20.4, 2.6, NK.who(1370, { dir: 1, pose: 'hold', phone: true })); NK.person(g, 6.6, -20.6, 2.6, NK.who(1371, { dir: 1 })); }, { name: 'on terrace', on: true });
  T.cast([16.5, -20.6], (g) => NK.person(g, 16.5, -20.4, 2.6, NK.tourist(1372, { dir: 1, pose: 'wave', ph: 0.2 })), { name: 'on terrace', on: true });
  // round the fountain: a couple on the rim, a violinist
  T.cast([6.2, -9], (g) => { NK.person(g, 6.6, -8.6, 0.9, NK.who(1380, { dir: 1, pose: 'sit' })); NK.person(g, 6.4, -7.2, 0.9, NK.who(1381, { dir: 1, pose: 'sit', dress: '#7FB7D9' })); }, { name: 'rim' });
  T.cast([14.8, -4.8], (g) => { const r = NK.person(g, 14.8, -4.8, 0, NK.who(1382, { dir: 1, pose: 'hold', top: '#2F2C2A', bot: '#2F2C2A' })); const h = r.hands[1] || r.hands[0]; g.fill2([[h[0] - 0.8, h[1] - 1.8], [h[0] + 1.6, h[1] - 3.0], [h[0] + 2.2, h[1] - 2.2], [h[0] - 0.2, h[1] - 1.0]], '#9A5A2E', true); g.fine2([[h[0] - 1.6, h[1] - 3.6], [h[0] + 3.4, h[1] - 1.0]], { w: 0.3, c: '#3A3128' }); }, { name: 'violinist' });

  /* ---------------- what moves ---------------- */
  // horse carriages on the inner side of the drive, two of them half a loop apart
  const cr = DR - 1.25, crc = RC - 1.25, cper = loopPer(cr, crc);
  for (let k = 0; k < 2; k++) {
    const driver = NK.who(1400 + k, { top: '#2F2C2A', bot: '#2F2C2A' }), riders = [NK.tourist(1410 + k), NK.who(1420 + k, { dress: '#E7A9A0' })];
    T.actor({ sample: 0.3, period: cper / 3.2,
      at(t) { const d = t * 3.2 + k * cper / 2, p = loopAt(d, cr, crc), q = Math.round(p.ang / (TAU / 32)), ph = Math.floor((d / 1.6) % 1 * 4); return { x: p.x, y: p.y, key: (((q % 32) + 32) % 32) + '.' + ph, ang: q * TAU / 32, ph: ph / 4 }; },
      draw(g, st) { carriage(g, st.ang, st.ph, driver, riders); } });
  }
  // cyclists on the outer side, evenly spaced, all at one speed
  const br = DR + 1.7, brc = RC + 1.7, bper = loopPer(br, brc);
  for (let k = 0; k < 3; k++) {
    const who = NK.who(1430 + k, { cap: k === 1 ? '#C9463E' : undefined, top: ['#E6C24F', '#5F8FC9', '#C9584B'][k] }), col = ['#2F2C2A', '#C9463E', '#5F8FC9'][k];
    T.actor({ sample: 0.2, period: bper / 9,
      at(t) { const p = loopAt(t * 9 + k * bper / 3, br, brc), q = Math.round(p.ang / (TAU / 32)); return { x: p.x, y: p.y, key: ((q % 32) + 32) % 32, ang: q * TAU / 32 }; },
      draw(g, st) { K.bike(g, st.ang, { col, who }); } });
  }
  // joggers and walkers on the paths and across Bow Bridge
  NK.walker(T, NK.who(1440, { shorts: true, top: '#C9463E', cap: '#F3F1EA' }), [[-4, 30], [-6, 24], [-6, 14], [-9, 4], [-9, -2.5], [-9, -21], [-9, -2.5], [-9, 4], [-6, 14], [-6, 24]], 6.5, { z: (x, y) => deckZ(y), phase: 0.1 });
  NK.walker(T, NK.who(1441, { dress: '#8FB7D9' }), [[-9, -21.5], [-9, -2.5], [-12, -1.5], [-9, -2.5]], 3.4, { z: (x, y) => (Math.abs(x - BX) < 0.1 ? deckZ(y) : 0), phase: 0.5 });
  NK.walker(T, NK.who(1442, { shorts: true, top: '#5FA58F' }), [[30, 2], [24, 2], [17, 4], [10, 2], [8, -3], [10, 2], [17, 4], [24, 2]], 6.2, { phase: 0.3 });
  NK.walker(T, NK.tourist(1443), [[14, 30], [14, 24], [10, 16], [4, 8], [-1, 2], [-4, -2], [-1, 2], [4, 8], [10, 16], [14, 24]], 3.6, { phase: 0.7 });
  NK.walker(T, NK.who(1444, { coffee: true }), [[6, -2], [15, -3], [17, -12], [14.5, -15.5], [8, -16], [4.8, -10], [6, -2]], 3.2, { phase: 0.2 });
  // rowboats: three on a long loop through the bridge's waist, one in the west lobe
  const ROW = (seed) => NK.who(seed, { bare: true });
  for (let k = 0; k < 4; k++) {
    const who = ROW(1450 + k), hull = ['#F3F1EA', '#E9E1CC', '#DCE6EA', '#F3F1EA'][k], small = k === 3;
    const cx = small ? -18.8 : -9, cy = small ? -18.2 : -12.5, rx = small ? 2.2 : 10.8, ry = small ? 1.6 : 2.5, sp = small ? 0.08 : 0.045;
    T.actor({ sample: 0.3, period: 1 / sp, grow: false,
      at(t) { const a = TAU * (t * sp + k / 3), x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry, h = Math.atan2(Math.cos(a) * ry, -Math.sin(a) * rx), q = Math.round(h / (TAU / 24)), ph = Math.floor((t * 0.9) % 1 * 4); return { x, y, z: WZ, key: (((q % 24) + 24) % 24) + '.' + ph, ang: q * TAU / 24, ph: ph / 4 }; },
      draw(g, st) { rowboat(g, st.ang, who, st.ph, hull); } });
  }
  // ducks in a line along the east shore
  T.actor({ sample: 0.3, period: 30, grow: false,
    at(t) { const u = (t / 30) % 1, a = TAU * u; return { x: -1 + Math.cos(a) * 2.6, y: -14 + Math.sin(a) * 2.2, z: WZ, key: Math.floor(u * 8), fl: Math.cos(a + Math.PI / 2) - Math.sin(a + Math.PI / 2) > 0 ? 1 : -1, a }; },
    draw(g, st) { for (let i = 0; i < 4; i++) { const c = g.p(-i * 0.9 * Math.cos(st.a + Math.PI / 2), -i * 0.9 * Math.sin(st.a + Math.PI / 2), 0), fl = st.fl, s = i === 0 ? 1 : 0.7; g.fill2([[c[0] - 1.2 * s, c[1]], [c[0] + 1.0 * s, c[1]], [c[0] + 1.3 * s * fl, c[1] - 0.8 * s], [c[0] - 1.0 * s, c[1] - 0.9 * s]], i === 0 ? '#7A6A4E' : '#9A8A6A', true); g.disc2([c[0] + 1.1 * s * fl, c[1] - 1.3 * s], 0.5 * s, i === 0 ? '#3E7A4A' : '#8A7A5A'); g.disc2([c[0] + 1.6 * s * fl, c[1] - 1.2 * s], 0.22, '#E8B33C'); } } });

  NK.corners(T);
});
