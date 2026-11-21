'use strict';
/* (100,-100) Greenwich Village: Washington Square Park.
   The marble arch stands at the park's north edge (nearest us), its face turned to the camera: two piers with
   Washington in marble on each, a round-headed opening, spandrels with wreaths, a heavy attic with a cornice. Through
   it and beyond, the round fountain on the park's axis: a low granite basin, a central jet and a ring of small ones,
   people sitting on the rim, kids splashing in the water on a warm day. Paved paths cross the park on the diagonals
   between lawns with sunbathers and big London planes. The south-west corner (far right) is the chess plaza: stone
   tables, players and kibitzers. A man plays a grand piano he wheels in every day, a crowd round him; acrobats spin
   for a ring of watchers. NYU's violet flags hang from the red sandstone library and townhouses along the far side;
   along the right-hand kerb, a row of brownstones with high stoops, a neighbour sitting out on hers.
   What moves: the fountain's jets and the kids in them, the acrobat, the violet flags, walkers, a dog walker, students. */
SF.tile('village', 100, -100, { rim: 28 }, function (T) {
  const FX = -8, FY = -4, FR = 7.2, MARBLE = { t: '#F1EEE6', l: '#F6F3EC', r: '#E2DDD1' };

  /* ---------------- ground: lawns, paths, the fountain plaza ---------------- */
  T.ground(function (g) {
    NK.lot(g, { inner: '#E8E3D7' });
    // four lawns cut by the diagonal paths and the plaza round the fountain
    const lawns = [
      [[-31, -20], [-17, -20], [-13, -12], [-31, -6]], [[-31, 3], [-14, 4], [-19, 12], [-31, 16]],
      [[-31, 20], [-19, 15], [-17, 21], [-31, 26]], [[6, -6], [18, -6], [18, 1], [6, 1]],
      [[5, 3], [18, 3], [18, 12], [4, 15]],
    ];
    for (const L of lawns) { const pts = K.curve(L.map((p) => [p[0], p[1], 0]), 3, true); g.fill(pts, C.grass); g.grass(pts, { dens: 0.9 }); g.outline(pts, { w: 0.45, c: '#7F9A5E', boil: false }); }
    // the fountain plaza: a ring of granite setts
    const ring = []; for (let i = 0; i < 32; i++) { const a = TAU * i / 32; ring.push([FX + Math.cos(a) * (FR + 5), FY + Math.sin(a) * (FR + 5), 0]); }
    g.fill(ring, '#DED7C8'); g.scuff(ring, { dir: 0.4, len: 1.2, c: '#C9C1AF', dens: 1.0, w: 0.45, spread: 1.0 });
    // the brownstone side: a strip of front gardens behind iron railings
    g.fill(K.rect(19, 2, 21, 27.5), '#9C8C70');
    // the chess plaza's paving in the south-west corner
    g.fill(K.rect(5, -20, 31, -8), '#DED7C8'); g.scuff(K.rect(5, -20, 31, -8), { dir: 0.4, len: 1.4, c: '#C9C1AF', dens: 0.8, w: 0.45, spread: 1.0 });
  }, { rim: true });

  /* ---------------- the far side: NYU's library and townhouses, violet flags ---------------- */
  T.obj([-31, -31, -12, -21], (g) => {
    K.box(g, -31, -31, -12, -21, 0, 21, { t: '#D9CDBE', l: '#B7695A', r: '#9C5648' }, { w: 0.95 });
    NK.windows(g, 'L', -21, -30.5, -12.5, 2, 3.0, 6, 6, { style: 'navy', hfill: 0.75 });
    NK.windows(g, 'R', -12, -30.5, -21.5, 2, 3.0, 6, 3, { style: 'navy', hfill: 0.75 });
    for (let a = -30; a < -12.5; a += 3) g.fine([[a, -20.97, 0.5], [a, -20.97, 20.5]], { w: 0.35, c: '#8E4A3E' });
    K.box(g, -31.4, -31.4, -11.6, -20.6, 21, 21.8, '#C9BDAE', { w: 0.6, boil: false });
    NK.text(g, 'L', -21, -21.5, 0.8, 1.1, 'LIBRARY', '#F3EDE2', { center: true, w: 0.35 });
  }, { name: 'library' });
  T.obj([-11, -31, -1, -21], (g) => { NK.walkup(g, -11, -31, -1, -21, 3, { col: '#C9B79B', face: 'L', lintel: '#F3EFE6', shop: false, fire: false, tank: true, tx: 0.5, ty: 0.4 }); }, { name: 'townhouse' });
  T.obj([-1, -31, 9, -21], (g) => { NK.walkup(g, -1, -31, 9, -21, 4, { col: NYC.brick2, face: 'L', lintel: '#F3EFE6', shop: { word: 'NYU', col: '#57068C', awning: '#57068C' }, fire: true, tank: false }); }, { name: 'townhouse' });
  T.obj([9, -31, 19, -21], (g) => { NK.walkup(g, 9, -31, 19, -21, 3, { col: '#B7695A', face: 'L', lintel: '#F3EFE6', shop: false, fire: false, tank: false }); }, { name: 'townhouse' });
  // violet flags on poles from the facades
  const vflag = (x, z) => {
    T.obj([x, -20.6], (g) => { const a = g.p(x, -21, z), b = g.p(x, -18.4, z + 1.0); g.line2([a, b], { w: 0.5, c: '#5A5650', boil: false, ext: 0 }); }, { name: 'flagpole' });
    T.actor({ sample: 5, period: 10, grow: false,
      at(t) { const ph = Math.floor(((t * 0.8 + x * 0.07) % 1 + 1) % 1 * 8); return { x, y: -18.4, z: 0, key: ph, ph: ph / 8 }; },
      draw(g, st) {
        // a violet banner hanging from the pole tip, swaying a little in the plane of the facade's normal
        const P = (a, h) => g.p(Math.sin(h * 1.1 - st.ph * TAU) * 0.25 * h / 4, -a, z + 0.9 - h);
        const pts = []; for (let k = 0; k <= 5; k++) pts.push(P(0.2, 4.2 * k / 5)); for (let k = 5; k >= 0; k--) pts.push(P(2.2, 4.2 * k / 5));
        g.fill2(pts, '#6A2A9A', true); g.outline2(pts, { w: 0.3, c: '#3A1458', boil: false });
        const s1 = P(0.6, 1.0), s2 = P(1.8, 1.0); g.segs2([s1[0], s1[1], s2[0], s2[1]], '#F3EDE2', 0.6);
        const c = P(1.2, 2.4); g.fill2([[c[0] - 0.5, c[1] + 0.9], [c[0] + 0.5, c[1] + 0.9], [c[0] + 0.25, c[1] - 0.6], [c[0] - 0.25, c[1] - 0.6]], '#F3EDE2', true);
      } });
  };
  vflag(-26, 16); vflag(-17, 16); vflag(4, 13);

  /* ---------------- brownstones on the right-hand kerb, stoops to the sidewalk ---------------- */
  const BS = [[3, 15, '#8E5F48'], [15, 27.5, '#7E5240']];
  BS.forEach(([y0, y1, col], i) => T.obj([21, y0, 31, y1], (g) => {
    const H = NK.brownstone(g, 21, y0, 31, y1, { face: 'R', door: y0 + 2.2, col, nf: 3 });
    g.fill(K.rect(21.6, y0 + 0.6, 30.4, y1 - 0.6, H + 0.72), '#CFC6B4'); g.outline(K.rect(21.6, y0 + 0.6, 30.4, y1 - 0.6, H + 0.72), { w: 0.35, c: '#8C8576', boil: false });
    if (i === 0) NK.tank(g, 24, y0 + 6, H + 0.72, { r: 1.4, h: 2.8, leg: 1.6 }); else NK.roofStuff(g, 22, y0 + 1, 30, y1 - 1, H + 0.72, 7);
    // window boxes with geraniums
    for (let k = 0; k < 3; k++) { const a = y0 + 2 + k * 3.8; const q = K.on('R', 31.05, a, a + 1.8, 7.2, 7.8); g.fill(q, '#6E4A36'); for (let m = 0; m < 4; m++) g.disc2(g.p(31.1, a + 0.3 + m * 0.45, 8.0), 0.45, m % 2 ? '#D23A33' : '#5E8A3E'); }
  }, { name: 'brownstone' }));
  T.obj([23, 27.5, 31, 30.5], (g) => { K.box(g, 23, 27.5, 31, 30.5, 0, 4.6, { t: '#D9D2C4', l: '#F1EFE8', r: '#E2DFD5' }, { w: 0.7 }); NK.shop(g, 'R', 31, 27.8, 30.2, { word: 'CAFE', col: '#3F5F8F', h: 4.4 }); NK.shop(g, 'L', 30.5, 23.4, 30.6, { word: 'CAFE', col: '#3F5F8F', h: 4.4, awning: '#3F5F8F', stripe: '#F3F1EA', awOut: 1.4 }); }, { name: 'cafe' });
  // the iron railing of the front gardens, and the park's own low fence
  T.obj([19, 2, 21, 27], (g) => { const r = []; for (let y = 2; y <= 27; y += 1.2) { const a = g.p(20.8, y, 0), b = g.p(20.8, y, 1.4); r.push(a[0], a[1], b[0], b[1]); } g.segs2(r, '#2F2C2A', 0.3); g.fine([[20.8, 2, 1.4], [20.8, 27, 1.4]], { w: 0.4, c: '#2F2C2A' }); }, { name: 'railing' });
  T.cast([34.2, 6], (g) => { NK.person(g, 33.6, 6.5, 1.1, NK.who(1601, { dir: 1, pose: 'sit', hair: '#8E8A84', coffee: true, dress: '#8FB7D9' })); }, { on: true });

  /* ---------------- the fountain ---------------- */
  T.obj([FX - FR - 0.6, FY - FR - 0.6, FX + FR + 0.6, FY + FR + 0.6], function (g) {
    const ring = (r, z, a0, a1, n) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([FX + Math.cos(a) * r, FY + Math.sin(a) * r, z]); } return p; };
    // the inside of the far wall, the water, then the rim and the near wall
    g.fill(ring(FR - 0.6, 0.9, Math.PI * 0.75, Math.PI * 1.75, 16).concat(ring(FR - 0.6, 0.2, Math.PI * 1.75, Math.PI * 0.75, 16)), '#B9B3A8');
    const w = ring(FR - 0.6, 0.2, 0, TAU, 32); g.fill(w, '#A9CCE0'); g.water(w, { dens: 1.2 });
    const rimTop = ring(FR + 0.6, 1.0, 0, TAU, 40).concat(ring(FR - 0.6, 1.0, TAU, 0, 40)); g.fill(rimTop, '#E6E0D3');
    g.fill(ring(FR + 0.6, 0, A_L, A_R, 20).concat(ring(FR + 0.6, 1.0, A_R, A_L, 20)), '#D3CCBE');
    g.line(ring(FR + 0.6, 1.0, 0, TAU, 40), { w: 0.6, boil: false }); g.line(ring(FR - 0.6, 1.0, 0, TAU, 40), { w: 0.45, c: '#8C8576', boil: false });
    g.line(ring(FR + 0.6, 0, A_L, A_R, 20), { w: 0.7, boil: false });
    // the ring of small jets' nozzles round the middle
    for (let i = 0; i < 12; i++) { const a = TAU * i / 12, p = g.p(FX + Math.cos(a) * 3, FY + Math.sin(a) * 3, 0.25); g.disc2(p, 0.35, '#8C8576'); }
  }, { name: 'fountain' });
  // the jets: a tall plume in the middle, a ring of arcs, rings spreading on the water
  T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const ph = Math.floor((t * 1.5) % 1 * 6); return { x: FX, y: FY, z: 0, key: ph, ph }; },
    draw(g, st) {
      const P = (x, y, z) => g.p(x, y, z), ph = st.ph / 6;
      for (let i = 0; i < 12; i++) {
        const a = TAU * i / 12, sx = Math.cos(a) * 3, sy = Math.sin(a) * 3, pts = [];
        for (let k = 0; k <= 8; k++) { const u = k / 8; pts.push(P(sx * (1 - u * 0.75), sy * (1 - u * 0.75), 0.3 + 4.2 * u * (1 - u) * 1.6)); }
        g.line2(pts, { w: 0.55, c: 'rgba(240,248,252,0.9)', boil: false, ext: 0, wob: 0.2 });
      }
      const base = P(0, 0, 0.3), top = P(0, 0, 9.5 + Math.sin(ph * TAU) * 0.6);
      g.fill2([[base[0] - 1.2, base[1]], [base[0] + 1.2, base[1]], [top[0] + 0.5, top[1] + 2], [top[0], top[1]], [top[0] - 0.5, top[1] + 2]], 'rgba(236,246,250,0.92)', true);
      g.fill2(arcPts(top[0], top[1] + 3, 2.8, Math.PI * 1.05, Math.PI * 1.95, 8).concat([[top[0] + 2.4, top[1] + 9], [top[0] - 2.4, top[1] + 9]]), 'rgba(236,246,250,0.75)', true);
      for (let k = 0; k < 2; k++) { const r = 2.2 + ((ph + k * 0.5) % 1) * 3.2, pts = []; for (let i = 0; i <= 20; i++) { const a = TAU * i / 20; pts.push(P(Math.cos(a) * r, Math.sin(a) * r, 0.22)); } g.fine2(pts, { w: 0.35, c: 'rgba(255,255,255,0.8)' }); }
    } });
  // people sitting on the rim, facing out over the plaza
  const rim = (a, s, o) => { const x = FX + Math.cos(a) * FR, y = FY + Math.sin(a) * FR; return T.cast([x, y], (g) => NK.person(g, x, y, 1.0, NK.who(s, Object.assign({ dir: Math.sin(a) > 0.3 ? 1 : Math.cos(a) > 0 ? 0 : 1, pose: 'sit' }, o || {}))), { on: true }); };
  rim(Math.PI * 1.15, 1610, { phone: true }); rim(Math.PI * 1.35, 1611, { coffee: true }); rim(Math.PI * 1.62, 1612); rim(Math.PI * 1.85, 1613, { tote: '#E9E1CC' }); rim(Math.PI * 0.08, 1614); rim(Math.PI * 0.3, 1615, { pose: 'hold', phone: true }); rim(Math.PI * 0.62, 1616); rim(Math.PI * 0.85, 1617, { coffee: true });
  // kids splashing in the water
  for (let k = 0; k < 3; k++) T.actor({ sample: 0.5, period: 8,
    at(t) { const u = (t / 8 + k * 0.33) % 1, a = TAU * u * (k % 2 ? -1 : 1) + k, r = 4.6, ph = Math.floor((t * 3 + k) % 1 * 4); return { x: FX + Math.cos(a) * r, y: FY + Math.sin(a) * r, z: 0.2, key: ph + '.' + (Math.sin(a) > 0 ? 1 : 3), ph, d: Math.sin(a) > 0 ? 1 : 3 }; },
    draw(g, st) { NK.person(g, 0, 0, 0.2, NK.who(1620 + k, { dir: st.d, pose: st.ph % 2 ? 'cheer' : 'wave', ph: st.ph / 4, k: 0.72, shorts: true, bare: true, tote: null, coffee: false })); const p = g.p(0, 0, 0.25); g.fine2(arcPts(p[0], p[1], 2.4, 0, TAU, 12), { w: 0.3, c: 'rgba(255,255,255,0.85)' }); } });

  /* ---------------- the arch ---------------- */
  const AX0 = -16, AX1 = 0, AY0 = 24.5, AY1 = 27.5, O0 = -10.6, O1 = -5.4, SPR = 8.2, ATT = 13, TOP = 16.6;
  T.obj([AX0, AY0, AX1, AY1], function (g) {
    g.boilP = 0.3;
    const rad = (O1 - O0) / 2, mid = (O0 + O1) / 2;
    // the piers
    K.box(g, AX0, AY0, O0, AY1, 0, ATT, MARBLE, { w: 0.9 });
    K.box(g, O1, AY0, AX1, AY1, 0, ATT, MARBLE, { w: 0.9 });
    // the inner face of the left pier (seen through the opening) and the soffit edge
    g.fill([[O0, AY0, 0], [O0, AY1, 0], [O0, AY1, SPR], [O0, AY0, SPR]], '#C9C1B1');
    // the span over the opening, its front face cut by the round head
    const front = [[O0, AY1, SPR]]; for (let k = 0; k <= 12; k++) { const a = Math.PI - Math.PI * k / 12; front.push([mid + Math.cos(a) * rad, AY1, SPR + Math.sin(a) * rad]); }
    front.push([O1, AY1, ATT], [O0, AY1, ATT]);
    g.fill(front, MARBLE.l);
    const soff = []; for (let k = 0; k <= 12; k++) { const a = Math.PI - Math.PI * k / 12; soff.push([mid + Math.cos(a) * rad, AY1, SPR + Math.sin(a) * rad]); }
    const soffB = soff.map((p) => [p[0], AY0, p[2]]);
    g.fill(soff.slice(0, 7).concat(soffB.slice(0, 7).reverse()), '#CFC8BA');
    g.line(soff, { w: 0.8, boil: false }); g.line([[O0, AY1, 0], [O0, AY1, SPR]], { w: 0.8 }); g.line([[O1, AY1, 0], [O1, AY1, SPR]], { w: 0.8 });
    g.fill(K.rect(O0, AY0, O1, AY1, ATT), MARBLE.t);
    // the keystone, the spandrel wreaths, Washington in marble on each pier
    g.fill([[mid - 0.7, AY1 + 0.02, SPR + rad - 0.2], [mid + 0.7, AY1 + 0.02, SPR + rad - 0.2], [mid + 0.9, AY1 + 0.02, SPR + rad + 1.4], [mid - 0.9, AY1 + 0.02, SPR + rad + 1.4]], '#E6E0D3');
    for (const x of [O0 - 1.4, O1 + 1.4]) { const c = g.p(x, AY1 + 0.03, SPR + rad + 0.6); g.ring2(c, 2.2, { w: 0.5, c: '#B9B2A2' }); g.ring2(c, 1.4, { w: 0.35, c: '#C9C2B2' }); }
    for (const x of [(AX0 + O0) / 2, (O1 + AX1) / 2]) {
      K.box(g, x - 1.3, AY1, x + 1.3, AY1 + 1.0, 0, 2.6, { t: '#E9E5DC', l: '#EFEBE3', r: '#D9D4C8' }, { w: 0.5, boil: false });
      NK.person(g, x, AY1 + 0.55, 2.6, { dir: 1, pose: 'stand', skin: '#EDE9E0', hair: '#E2DDD1', top: '#EDE9E0', bot: '#E2DDD1', shoe: '#D9D3C6', jacket: '#F3F0E8', hairStyle: 'pony', k: 0.92, ink: '#8C8576' });
    }
    // the attic and its cornice, the inscription band
    K.box(g, AX0 - 0.3, AY0 - 0.3, AX1 + 0.3, AY1 + 0.3, ATT, ATT + 0.8, MARBLE, { w: 0.7 });
    K.box(g, AX0, AY0, AX1, AY1, ATT + 0.8, TOP - 0.8, MARBLE, { w: 0.85 });
    const ins = []; for (let a = AX0 + 2; a < AX1 - 2; a += 0.55) { const p = g.p(a, AY1 + 0.02, ATT + 2.0); ins.push(p[0], p[1], p[0] + 0.35, p[1] + 0.2); } g.segs2(ins, '#A9A296', 0.35);
    K.box(g, AX0 - 0.45, AY0 - 0.45, AX1 + 0.45, AY1 + 0.45, TOP - 0.8, TOP, MARBLE, { w: 0.8 });
  }, { name: 'arch', under: ATT });

  /* ---------------- the chess plaza (south-west, far right) ---------------- */
  const chess = (x, y, s) => T.cast([x, y], (g) => {
    K.cyl(g, x - 2.0, y, 0.55, 0, 1.0, '#9A958B', { w: 0.4, n: 8 });
    NK.person(g, x - 2.0, y, 1.0, NK.who(s, { dir: 0, pose: 'sit', glasses: s % 2 === 0, hair: s % 3 ? '#8E8A84' : '#2B2420' }));
    K.box(g, x - 1.1, y - 1.1, x + 1.1, y + 1.1, 0, 2.1, { t: '#D6D0C3', l: '#C9C3B6', r: '#B9B3A6' }, { w: 0.45, boil: false });
    const q = []; for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) if ((a + b) % 2) { const p = g.p(x - 1.0 + a * 0.5 + 0.25, y - 1.0 + b * 0.5 + 0.25, 2.12); q.push(p[0] - 0.55, p[1], p[0] + 0.55, p[1]); } g.segs2(q, '#3A3530', 0.75);
    for (let k = 0; k < 6; k++) { const R = RNG(s * 3 + k), p = g.p(x - 0.8 + R() * 1.6, y - 0.8 + R() * 1.6, 2.15); g.disc2([p[0], p[1] - 0.6], 0.38, k % 2 ? '#F6F2E8' : '#2A2622'); }
    const ck = g.p(x + 0.6, y + 1.3, 2.12); g.fill2([[ck[0] - 0.9, ck[1]], [ck[0] + 0.9, ck[1]], [ck[0] + 0.9, ck[1] - 1.0], [ck[0] - 0.9, ck[1] - 1.0]], '#C9463E', true);
    K.cyl(g, x + 2.0, y, 0.55, 0, 1.0, '#9A958B', { w: 0.4, n: 8 });
    NK.person(g, x + 2.0, y, 1.0, NK.who(s + 1, { dir: 2, pose: 'sit' }));
  }, { on: true });
  chess(10, -16.5, 1630); chess(16.5, -16.5, 1632); chess(23, -16.5, 1634); chess(13, -11.5, 1636); chess(19.5, -11.5, 1638); chess(26, -11.5, 1730);
  T.cast([13.5, -14], (g) => { NK.person(g, 13.2, -14.2, 0, NK.who(1646, { dir: 3, pose: 'hold', coffee: true })); NK.person(g, 20, -14, 0, NK.suit(1647, { dir: 3 })); }, { on: true });
  T.cast([7, -14], (g) => NK.person(g, 7, -14, 0, NK.who(1648, { dir: 0, pose: 'stand', cap: '#2F2C2A', beard: true })), { on: true });

  /* ---------------- the piano man and the acrobats ---------------- */
  T.cast([-6, -15], (g) => {
    // a black grand piano on its legs, lid propped open, the player on the bench
    const P = (u, v, z) => [-6 + u, -15 + v, z];
    const body = []; for (let k = 0; k <= 10; k++) { const t = k / 10; body.push(P(-2.4 + 4.8 * t, -1.2 - Math.sin(t * Math.PI) * 0.4 + (t > 0.6 ? (t - 0.6) * 2.5 : 0), 2.6)); }
    body.push(P(2.4, 1.2, 2.6), P(-2.4, 1.2, 2.6));
    const legs = []; for (const [u, v] of [[-2.1, 1.0], [2.1, 1.0], [1.6, -0.8]]) { const a = g.p.apply(g, P(u, v, 0)), b = g.p.apply(g, P(u, v, 2.0)); legs.push(a[0], a[1], b[0], b[1]); } g.segs2(legs, '#2A2622', 0.9);
    g.fill(body.map((p) => [p[0], p[1], 2.0]).concat(body.slice().reverse()), '#2A2622'); g.fill(body, '#3A3632');
    g.fill([P(-2.3, -1.1, 2.6), P(2.0, -1.1, 2.6), P(1.4, -0.6, 6.2)], '#2F2C2A'); g.line([P(-2.3, -1.1, 2.6), P(1.4, -0.6, 6.2), P(2.0, -1.1, 2.6)], { w: 0.5, c: '#5A5650', boil: false });
    const kb = [P(-2.4, 1.2, 2.62), P(2.4, 1.2, 2.62), P(2.4, 1.7, 2.62), P(-2.4, 1.7, 2.62)]; g.fill(kb, '#F6F2E8');
    K.box(g, -7.5, -12.4, -4.5, -11.6, 0, 1.4, '#2A2622', { w: 0.4, boil: false });
    NK.person(g, -6, -12.0, 1.4, NK.who(1695, { dir: 3, pose: 'sit', hair: '#8E8A84', top: '#F3F1EA', reach: [1, -3] }));
  }, { on: true });
  for (const [x, y, d, s] of [[-11, -12.5, 0, 1641], [-10.5, -9.8, 3, 1642], [-1.2, -11, 2, 1643], [-2.6, -9.0, 3, 1644], [-0.8, -14.5, 2, 1645]]) T.cast([x, y], (g) => NK.person(g, x, y, 0, NK.who(s, { dir: d, pose: s % 2 ? 'hold' : 'stand', phone: s % 2 === 1 })), { on: true });
  // the acrobats on the plaza west of the fountain: a ring of watchers, one tumbling through his routine
  const AC = [-14.5, 10.5];
  for (let k = 0; k < 7; k++) { const a = Math.PI * (0.9 + k * 0.23), x = AC[0] + Math.cos(a) * 4.2, y = AC[1] + Math.sin(a) * 3.4; T.cast([x, y], (g) => NK.person(g, x, y, 0, (k % 3 ? NK.who : NK.tourist)(1650 + k, { dir: Math.cos(a) > 0 ? 2 : 0, pose: k === 3 ? 'cheer' : 'stand', ph: 0.4 })), { on: true }); }
  T.actor({ sample: 5, period: 10,
    at(t) { const st = Math.floor((t * 1.2) % 4); return { x: AC[0], y: AC[1], key: st, st }; },
    draw(g, st) {
      const w = NK.who(1660, { top: '#E6C24F', bot: '#2B2A2A', cap: '#C9463E', shorts: false, bare: true });
      if (st.st === 0) NK.person(g, 0, 0, 0, Object.assign({}, w, { dir: 0, pose: 'cheer', ph: 0 }));
      else if (st.st === 1) NK.person(g, 0, 0, 0, Object.assign({}, w, { dir: 1, pose: 'crouch', sway: 0.5 }));
      else if (st.st === 2) NK.person(g, 0, 0, 1.8, Object.assign({}, w, { dir: 0, pose: 'cheer', ph: 0.5 }));
      else NK.person(g, 0, 0, 0, Object.assign({}, w, { dir: 1, lie: -2.4 }));
    } });

  /* ---------------- trees, benches, sunbathers ---------------- */
  for (const [x, y, r] of [[-27, -16, 4.6], [-29, -1, 4.2], [-25, 12, 4.4], [-29, 23, 4.0], [7, -2.5, 4.0], [16.5, -3, 4.2], [14.5, 15.5, 4.4], [-21, -9.5, 3.6], [5, 18, 4.0]]) T.obj([x, y], (g) => K.tree(g, x, y, { r, h: 6.2, col: '#86B464' }), { name: 'plane tree' });
  T.cast([-24, -12.5], (g) => { const b = g.P(K.rect(-26.2, -14, -22, -11.2, 0.02)); g.fill2(b, '#E6C24F', true); NK.person(g, -24.6, -12.6, 0.1, NK.who(1670, { lie: 2.6, bare: true, shorts: true })); NK.person(g, -23.0, -12.4, 0.1, NK.who(1671, { dir: 1, pose: 'sit', reach: [3, -6] })); }, { on: true });
  T.cast([-23, 6], (g) => { const b = g.P(K.rect(-25, 5, -21, 7.6, 0.02)); g.fill2(b, '#D98AA4', true); NK.person(g, -23, 6.2, 0.1, NK.who(1672, { lie: -0.6, bare: true })); }, { on: true });
  T.cast([11, 6], (g) => { const b = g.P(K.rect(9.5, 4.6, 13.1, 7.2, 0.02)); g.fill2(b, '#8FB7D9', true); NK.person(g, 10.9, 5.8, 0.1, NK.who(1673, { dir: 0, pose: 'sit', reach: [4, -7] })); NK.person(g, 12.3, 6.6, 0.1, NK.who(1674, { dir: 2, pose: 'sit' })); }, { on: true });
  for (const [x, y, s] of [[-30, 6, 1680], [-30, -10, 1682]]) T.cast([x, y], (g) => { K.bench(g, x, y, { face: 'R', L: 2.4 }); NK.person(g, x + 1.0, y - 0.9, 1.3, NK.who(s, { dir: 0, pose: 'sit', coffee: s === 1680 })); NK.person(g, x + 1.0, y + 1.2, 1.3, NK.who(s + 1, { dir: 0, pose: 'sit', phone: true })); }, { on: true });
  // a guitar busker on the bench by the path
  T.cast([-2, 13], (g) => { K.bench(g, -3, 13, { face: 'R', L: 2.2 }); const r = NK.person(g, -2, 13, 1.3, NK.who(1690, { dir: 0, pose: 'sit', beard: true, cap: '#3B3F47', hands: [[3, -9], [-1, -8]] })); const a = [r.hip[0] - 3, r.hip[1] - 3.6], b = [r.hip[0] + 4, r.hip[1] - 5.2]; g.fill2([[a[0] - 1.6, a[1] + 1.2], [a[0] + 1.6, a[1] - 1.2], [a[0] + 2.6, a[1] + 0.6], [a[0] - 0.6, a[1] + 2.8]], '#C9A26B', true); g.line2([a, b], { w: 0.7, c: '#5A3A24', boil: false }); }, { on: true });

  /* ---------------- walkers ---------------- */
  NK.walker(T, NK.who(1700, { tote: '#57068C' }), [[-28, 29], [-16, 18], [FX - 9, FY + 7], [-28, 29]], 3.8, { phase: 0.1 });
  NK.walker(T, NK.who(1701, { phone: true }), [[-8, 29.5], [-8, 13], [FX, FY + 12.5], [-8, 13]], 3.4, { phase: 0.4 });
  NK.walker(T, NK.who(1702, { tote: '#E9E1CC' }), [[29, -7], [FX + 11, FY - 3], [29, -7]], 3.6, { phase: 0.2 });
  NK.walker(T, NK.who(1703), [[-29, -19], [FX - 10, FY - 8], [-29, -19]], 3.5, { phase: 0.7 });
  NK.walker(T, NK.who(1704, { coffee: true }), [[34.6, -28], [34.6, 28]], 4.0, { phase: 0.3 });
  NK.walker(T, NK.who(1705, { tote: '#C9A26B' }), [[28, 34.6], [-28, 34.6]], 3.7, { phase: 0.6 });
  // a dog walker with three dogs on the path
  T.actor({ sample: 0.25, period: 20,
    at(t) { const u = (t / 20) % 1, a = u < 0.5 ? u * 2 : 2 - u * 2, x = lerp(15, FX + 9, a), y = lerp(18, FY + 8, a), ph = Math.floor((t * 2.6) % 1 * 8); return { x, y, key: (u < 0.5 ? 'a' : 'b') + ph, ph: ph / 8, dir: u < 0.5 ? 2 : 0 }; },
    draw(g, st) { const r = NK.person(g, 0, 0, 0, NK.who(1710, { dir: st.dir, pose: 'walk', ph: st.ph, cap: '#3B3F47' })); const fl = st.dir === 0 ? 1 : -1, h = r.hands[0]; [['#B98A5A', 4, 0.5], ['#2A2622', 6, 2.2], ['#F3EFE6', 3.5, 3.4]].forEach(([c, dx, dy], k) => { const p = g.p(fl * dx * 0.6, fl * dx * 0.3 + dy * 0.5, 0); NK.dog2(g, p, fl, c, st.ph + k * 0.3); g.fine2([h, [p[0] + fl * 2.6, p[1] - 3.4]], { w: 0.22, c: '#3A3530' }); }); } });

  /* ---------------- sidewalk furniture ---------------- */
  for (const [x, y] of [[-34.5, -24], [-34.5, -6], [-34.5, 14], [-24, 34.5], [6, 34.5], [16, 34.5]]) T.obj([x, y], (g) => NK.tree(g, x, y), { name: 'tree' });
  T.obj([-34.6, 4], (g) => NK.hydrant(g, -34.6, 4), { name: 'hydrant' });
  T.obj([-12, 34.6], (g) => NK.cart(g, -12, 34.4, { along: 'x', umb: ['#C9463E', '#F6F2E8'] }), { name: 'cart' });
  T.cast([-8.8, 34.8], (g) => NK.person(g, -8.8, 34.8, 0, NK.who(1720, { dir: 2, pose: 'hold', cap: '#C9463E' })), { on: true });
  T.obj([34.5, -24], (g) => NK.mailbox(g, 34.5, -24), { name: 'mailbox' });
  NK.corners(T);
});
