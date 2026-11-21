'use strict';
/* (0,-100) The Santo António arraial in a Mouraria square, the night of the 12th of June, started early.
   Built: tiled Mouraria houses closing the far sides (north and west), lower ones on the near corner, every window
   hung with garlands and paper balloons; a wooden stage with a little band (accordion, guitar, singer, drum) under a
   striped canopy; long trestle tables and benches; two sardine braziers; stalls selling beer, bifanas and basil pots;
   an altar to the saint with flowers and candles; a tall mast with flags; garlands criss-crossing the square.
   Who: a marcha of dancers in matching costume, in pairs carrying flowered arches round the square; couples dancing
   on the open floor, turning; people at the tables eating sardines on bread; the grillers fanning the coals; queues at
   the stalls; children with paper balloons; the old ladies watching from balconies.
   What moves: the marcha on its loop, the turning couples, the smoke, the singer. The close-up shot is the grill. */
SF.tile('arraial', 0, -100, { rim: 18 }, function (T) {
  const H = 37;
  T.ground(function (g) {
    K.slab(g, H, { top: LC.calc });
    g.boilP = 0.1;
    LX.waves(g, -20, -20, H, H, { axis: 'x', amp: 1.6, wl: 7, band: 1.2, gap: 5.2 });
    // the dance floor: a ring of black calçada
    const ring = K.arc(18, 22, 0.03, 10, 0, TAU, 40); g.outline(ring, { w: 1.2, c: LC.basalt, boil: false });
  }, { rim: true });

  /* ---------------- the houses round the square ---------------- */
  const HS = [[-36, -36, -24, -24, 3, 'b', 1100], [-24, -36, -12, -25, 3, null, 1101], [-12, -36, 0, -24, 3, 'y', 1102], [0, -36, 12, -25, 2, 'g', 1103], [12, -36, 24, -24, 3, null, 1104], [24, -36, 36, -25, 2, 'b', 1105],
    [-36, -22, -24, -10, 3, null, 1106], [-36, -8, -25, 4, 2, 'g', 1107], [-36, 6, -24, 18, 2, null, 1108], [-36, 20, -26, 34, 1, 'y', 1109]];
  HS.forEach(([x0, y0, x1, y1, n, az, sd]) => T.obj([x0, y0, x1, y1], (g) => {
    LX.house(g, { x0, y0, x1, y1, n, az, seed: sd, wash: sd % 3 === 0, bal: 1, door: x0 < -30 ? 'R' : 'L', shop: sd === 1102 ? 'TASCA' : sd === 1107 ? 'CHURRASQUEIRA' : null, sc: '#7A2E2A' });
  }, { name: 'house' }));

  /* ---------------- the stage, the band ---------------- */
  T.obj([4, -22, 22, -13], function (g) {
    const z = 1.6;
    K.box(g, 4, -22, 22, -13, 0, z, { t: '#B9824A', l: '#A87440', r: '#94653A' }, { w: 0.7 });
    const pl = []; for (let x = 5; x < 22; x += 1.2) { const a = g.p(x, -13, 0.2), b = g.p(x, -13, z - 0.1); pl.push(a[0], a[1], b[0], b[1]); } g.segs2(pl, '#7A5A3C', 0.3);
    // the band: singer at the front, accordion, guitar, drum
    LX.person(g, 9, -19.5, z, LX.who(1110, { dir: 1, pose: 'hold', accordion: true, squeeze: 0.4 }));
    const gt = LX.person(g, 17, -19.5, z, LX.who(1111, { dir: 1, pose: 'stand', hands: [[1.6, -10.4], [-2.4, -12.2]] })); const h = gt.hip; g.fill2(K.curve([[h[0] - 3.4, h[1] - 1.8], [h[0] + 0.6, h[1] - 5.4], [h[0] + 2.2, h[1] - 3.6], [h[0] - 1.6, h[1] + 0.2]], 3, true), '#B8743A', true);
    const dr = g.p(20, -20.5, z); g.fill2(arcPts(dr[0], dr[1] - 2.2, 1.8, 0, TAU, 12), '#F3F1EA', true); g.ring2([dr[0], dr[1] - 2.2], 1.8, { w: 0.5, c: '#C9463E' }); LX.person(g, 20.8, -21.6, z, LX.who(1112, { dir: 1, pose: 'hold' }));
    LX.person(g, 13, -16, z, LX.who(1113, { dir: 1, pose: 'cheer', ph: 0.3, dress: '#C9463E', hairStyle: 'bun' }));
    // the canopy on four posts, red and white stripes, a garland along its edge
    const posts = []; for (const [x, y] of [[4.3, -21.7], [21.7, -21.7], [21.7, -13.3], [4.3, -13.3]]) { const a = g.p(x, y, z), b = g.p(x, y, z + 9); posts.push(a[0], a[1], b[0], b[1]); } g.segs2(posts, '#5A4A3C', 0.55);
    for (let i = 0; i < 9; i++) { const x0 = lerp(3.8, 22.2, i / 9), x1 = lerp(3.8, 22.2, (i + 1) / 9); g.fill([[x0, -22.2, z + 9.6], [x1, -22.2, z + 9.6], [x1, -12.6, z + 8.6], [x0, -12.6, z + 8.6]], i % 2 ? '#F7F5EF' : '#C9463E'); }
    g.outline([[3.8, -22.2, z + 9.6], [22.2, -22.2, z + 9.6], [22.2, -12.6, z + 8.6], [3.8, -12.6, z + 8.6]], { w: 0.6, boil: false });
    LX.garland2(g, g.p(3.8, -12.6, z + 8.5), g.p(22.2, -12.6, z + 8.5), 31, { sag: 2, n: 14 });
    K.sign(g, 'L', -12.6, 8, 18, z + 7.2, z + 8.4, '#2F4F80', 'ARRAIAL DA MOURARIA', { ink: '#F2C230' });
  }, { name: 'stage' });

  /* ---------------- the tables, the grills, the stalls ---------------- */
  const table = (x0, x1, y, seed) => T.cast([x1, y + 1.4], function (g) {
    // a trestle table along x with a bench each side; people on the far bench face us, on the near bench their backs
    for (let k = 0; k < 4; k++) { const x = lerp(x0 + 1.4, x1 - 1.4, k / 3); LX.person(g, x, y - 1.6, 1.3, LX.who(seed + k, { dir: 1, pose: 'sit', beer: k % 2 === 0, sardine: k % 2 === 1 })); }
    K.box(g, x0, y - 2.2, x1, y - 1.2, 0, 1.3, { t: '#9C7A52', l: '#B58A5A', r: '#9A7248' }, { w: 0.4, boil: false });
    K.box(g, x0, y - 0.9, x1, y + 0.9, 2.4, 2.7, { t: '#F3F1EA', l: '#E9E4D8', r: '#D9D3C6' }, { w: 0.5, boil: false });
    const R = RNG(seed); for (let k = 0; k < 6; k++) { const p = g.p(lerp(x0 + 0.8, x1 - 0.8, R()), y + (R() - 0.5) * 1.2, 2.7); if (k % 2) g.fill2([[p[0] - 0.4, p[1]], [p[0] + 0.4, p[1]], [p[0] + 0.35, p[1] - 1.4], [p[0] - 0.35, p[1] - 1.4]], '#F2C25A', true); else g.fill2([[p[0] - 1.4, p[1] - 0.3], [p[0] + 1.4, p[1] - 0.3], [p[0] + 1.2, p[1] + 0.3], [p[0] - 1.2, p[1] + 0.3]], '#E9E4D8', true); }
    K.box(g, x0, y + 1.2, x1, y + 2.2, 0, 1.3, { t: '#9C7A52', l: '#B58A5A', r: '#9A7248' }, { w: 0.4, boil: false });
    for (let k = 0; k < 4; k++) { const x = lerp(x0 + 1.4, x1 - 1.4, k / 3) + 0.4; LX.person(g, x, y + 1.7, 1.3, LX.who(seed + 4 + k, { dir: 3, pose: 'sit' })); }
  });
  table(-20, -6, 0, 1120); table(-20, -6, 9, 1130); table(-20, -6, 18, 1140);
  // two braziers by the tables, their grillers, the smoke
  [[3, 4, 1150], [3, 14, 1153]].forEach(([x, y, sd]) => {
    T.cast([x, y], function (g) {
      LX.person(g, x + 0.4, y - 2.6, 0, LX.who(sd, { dir: 1, pose: 'hold', reach: [0.4, -5.6], top: '#F7F5EF', bot: '#3F4D63', cap: '#F7F5EF' }));
      LX.grill(g, x, y, { axis: 'y', L: 2.2 });
      LX.person(g, x + 2.8, y + 1.2, 0, LX.who(sd + 1, { dir: 2, pose: 'hold', sardine: true }));
    }, { name: 'grill' });
    T.actor({ layer: 'top', sample: 5, period: 3, at(t) { const f = Math.floor(((t / 3 + y * 0.07) % 1) * 12); return { x, y, z: 3.4, key: 's' + f, f }; }, draw(g, st) { LX.smoke2(g, st.f / 12, 1.2); } });
  });
  const stall = (x, y, word, a, seed, goods) => T.cast([x, y], function (g) {
    LX.person(g, x - 2.6, y - 1.2, 0, LX.who(seed, { dir: 0, pose: 'hold', top: '#F7F5EF' }));
    K.stall(g, x, y, { face: 'R', L: 2.6, D: 1.4, a, b: '#F7F5EF', goods });
    K.sign(g, 'R', x + 1.45, y - 2.4, y + 2.4, 1.0, 2.2, '#F3F1EA', word, { ink: '#2F3A4F' });
    for (let k = 0; k < 3; k++) LX.person(g, x + 3.6 + k * 0.4, y - 1.6 + k * 1.9, 0, LX.who(seed + 1 + k, { dir: 2, pose: k === 1 ? 'hold' : 'stand', beer: word === 'CERVEJA' && k === 1 }));
  });
  stall(30, -18, 'CERVEJA', '#E2483D', 1160, (g2, D, L) => { for (let k = 0; k < 5; k++) { const p = g2.p(0, -L + 0.6 + k * 1.1, 2.7); g2.fill2([[p[0] - 0.4, p[1]], [p[0] + 0.4, p[1]], [p[0] + 0.35, p[1] - 1.4], [p[0] - 0.35, p[1] - 1.4]], '#F2C25A', true); } });
  stall(30, -6, 'BIFANAS', '#3F8FD2', 1165, null);
  stall(30, 6, 'MANJERICOS', '#5DB26A', 1170, (g2, D, L) => { const R = RNG(5); for (let k = 0; k < 6; k++) LX.manjerico2(g2, g2.p(lerp(-D, D, (k % 2) * 0.6 + 0.2), -L + 0.8 + Math.floor(k / 2) * 1.8, 2.7), 0.8, R.pick(LC.festa)); });
  // the altar to the saint: a little table under an arch of paper flowers, candles, the figure
  T.obj([-24, 22, -21, 27], function (g) {
    K.box(g, -23.6, 22.6, -21.4, 26.4, 0, 2.2, { t: '#F7F5EF', l: '#F3EFE6', r: '#DDD7CA' }, { w: 0.5 });
    const b = g.p(-22.5, 24.5, 2.2); g.fill2([[b[0] - 1.0, b[1]], [b[0] + 1.0, b[1]], [b[0] + 0.7, b[1] - 4.6], [b[0] - 0.7, b[1] - 4.6]], '#6E5A44', true); g.disc2([b[0], b[1] - 5.3], 0.75, '#E9D2B4'); g.ring2([b[0], b[1] - 5.6], 1.2, { w: 0.3, c: '#C9A44A' });
    const ar = []; for (let k = 0; k <= 14; k++) { const a = Math.PI + Math.PI * k / 14; ar.push([b[0] + Math.cos(a) * 4.4, b[1] - 3 + Math.sin(a) * 5.2]); } const R = RNG(3); for (const p of ar) g.disc2(p, 0.9, R.pick(LC.festa));
    for (const dx of [-2, -1.2, 1.2, 2]) { const c = [b[0] + dx, b[1] - 0.2]; g.fill2([[c[0] - 0.25, c[1]], [c[0] + 0.25, c[1]], [c[0] + 0.25, c[1] - 1.4], [c[0] - 0.25, c[1] - 1.4]], '#F7F5EF', true); g.disc2([c[0], c[1] - 1.7], 0.3, '#F2C230'); }
  }, { name: 'altar' });
  T.cast([-19, 28], (g) => { LX.person(g, -19, 28, 0, LX.who(1175, { dir: 2, pose: 'hold', hair: '#D9D5CB', dress: '#2F343B', hairStyle: 'bun' })); });
  // the mast with its flags
  T.obj([26, 32], (g) => { const b = g.p(26, 32, 0), t = g.p(26, 32, 14); g.fill2([[b[0] - 0.6, b[1]], [b[0] + 0.6, b[1]], [t[0] + 0.3, t[1]], [t[0] - 0.3, t[1]]], '#F7F5EF'); const s = []; for (let z = 1; z < 14; z += 1.6) { const a = g.p(26, 32, z), c = g.p(26, 32, z + 0.9); s.push(a[0] - 0.6, a[1], c[0] + 0.6, c[1]); } g.segs2(s, '#3F8FD2', 0.6); for (const [k, c] of [[0, '#E2483D'], [1, '#5DB26A']]) { const p = g.p(26, 32, 13.4 - k * 1.8); g.fill2([[p[0], p[1]], [p[0] + 4.4, p[1] + 0.8], [p[0], p[1] + 1.8]], c, true); } }, { name: 'mast' });

  /* ---------------- the marcha: pairs of dancers carrying arches round the square ---------------- */
  const LOOPM = [[0, 30], [34, 30], [34, 14], [12, 12], [0, 22]];
  const segs = []; let tot = 0; for (let i = 0; i < LOOPM.length; i++) { const a = LOOPM[i], b = LOOPM[(i + 1) % LOOPM.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push({ a, b, l, s0: tot }); tot += l; }
  const along = (d) => { d = ((d % tot) + tot) % tot; const s = segs.find((q) => d >= q.s0 && d < q.s0 + q.l) || segs[0], u = (d - s.s0) / s.l; return { x: lerp(s.a[0], s.b[0], u), y: lerp(s.a[1], s.b[1], u), ang: Math.atan2(s.b[1] - s.a[1], s.b[0] - s.a[0]) }; };
  const dirOf = (ang) => { const c = Math.cos(ang), s = Math.sin(ang); return Math.abs(c) > Math.abs(s) ? (c > 0 ? 0 : 2) : (s > 0 ? 1 : 3); };
  const COST = [{ top: '#C9463E', bot: '#2F343B', dress: '#C9463E' }, { top: '#F7F5EF', bot: '#2F343B', cap: '#2F343B' }];
  for (let i = 0; i < 5; i++) {
    const w0 = LX.who(1180 + i * 2, COST[0]), w1 = LX.who(1181 + i * 2, COST[1]), SP = 0.9;
    T.actor({ sample: 0.25, period: tot / SP,
      at(t) {
        const d = t * SP + i * 6.2, p = along(d), nx = -Math.sin(p.ang), ny = Math.cos(p.ang), ph = Math.floor(((d / 2.4) % 1) * 8), dir = dirOf(p.ang);
        // anchored at the front-most of the two dancers (they walk side by side, 2.4 u apart)
        const a = [p.x - nx * 1.2, p.y - ny * 1.2], b = [p.x + nx * 1.2, p.y + ny * 1.2], front = a[0] + a[1] > b[0] + b[1] ? a : b;
        return { x: front[0], y: front[1], key: dir + '.' + ph, dir, ph: ph / 8, ox: (a[0] + b[0]) / 2 - front[0], oy: (a[1] + b[1]) / 2 - front[1], nx, ny };
      },
      draw(g, st) {
        const A = [st.ox - st.nx * 1.2, st.oy - st.ny * 1.2], B = [st.ox + st.nx * 1.2, st.oy + st.ny * 1.2];
        const far = A[0] + A[1] < B[0] + B[1] ? [A, w0] : [B, w1], near = far[0] === A ? [B, w1] : [A, w0];
        const r0 = LX.person(g, far[0][0], far[0][1], 0, Object.assign({}, far[1], { dir: st.dir, pose: 'walk', ph: st.ph }));
        const r1 = LX.person(g, near[0][0], near[0][1], 0, Object.assign({}, near[1], { dir: st.dir, pose: 'walk', ph: (st.ph + 0.5) % 1 }));
        // the arch: from one dancer's shoulder up over both heads to the other's, covered in paper flowers
        const p0 = r0.shoulders[0], p1 = r1.shoulders[0], top = Math.min(p0[1], p1[1]) - 9, pts = [];
        for (let k = 0; k <= 12; k++) { const t = k / 12; pts.push([lerp(p0[0], p1[0], t), lerp(p0[1], p1[1], t) - Math.sin(Math.PI * t) * (Math.min(p0[1], p1[1]) - top)]); }
        g.line2(pts, { w: 0.7, c: '#6E5A44', boil: false, ext: 0 });
        for (let k = 1; k < 12; k += 1) g.disc2(pts[k], 0.85, LC.festa[(k + i) % LC.festa.length]);
      } });
  }
  // couples dancing on the floor, turning
  [[14, 20], [21, 24], [16, 27], [24, 18]].forEach(([cx, cy], i) => {
    const w0 = LX.who(1200 + i * 2), w1 = LX.who(1201 + i * 2, { dress: LC.festa[i % 4] });
    T.actor({ sample: 0.25, period: 4,
      at(t) { const q = Math.floor((((t / 4 + i * 0.3) % 1) + 1) % 1 * 16); return { x: cx + 1.2, y: cy + 1.2, key: 'c' + q, q }; },
      draw(g, st) {
        const a = st.q / 16 * TAU, A = [-1.2 + Math.cos(a) * 0.9, -1.2 + Math.sin(a) * 0.9], B = [-1.2 - Math.cos(a) * 0.9, -1.2 - Math.sin(a) * 0.9];
        const dA = dirOf(a + Math.PI), dB = dirOf(a), list = [[A, w0, dA], [B, w1, dB]].sort((p, q) => (p[0][0] + p[0][1]) - (q[0][0] + q[0][1]));
        for (const [p, w, d] of list) LX.person(g, p[0], p[1], 0, Object.assign({}, w, { dir: d, pose: 'hold', reach: [d === 0 || d === 3 ? 2.2 : -2.2, -9] }));
      } });
  });
  // children with paper balloons on sticks
  for (const [x, y, s] of [[8, 30, 1210], [-2, 34, 1211]]) T.cast([x, y], (g) => { const r = LX.person(g, x, y, 0, LX.who(s, { dir: 1, k: 0.7, pose: 'hold', reach: [1.6, -7] })); const h = r.hands[0]; g.line2([h, [h[0] + 1.2, h[1] - 6]], { w: 0.35, c: '#6E5A44', boil: false }); g.disc2([h[0] + 1.2, h[1] - 7.6], 1.7, LC.festa[s % 7]); g.fill2([[h[0] + 0.4, h[1] - 6.1], [h[0] + 2.0, h[1] - 6.1], [h[0] + 1.8, h[1] - 5.6], [h[0] + 0.6, h[1] - 5.6]], '#3A3530', true); });
  LX.walker(T, LX.who(1212), [[-22, 36], [36, 36]], 1.0, { phase: 0.3 });
  LX.walker(T, LX.who(1213), [[-22, -21], [2, -21], [2, -23.5]], 0.8, { phase: 0.6 });

  /* ---------------- garlands over the square ---------------- */
  const G = [[[-24, -14, 10.5], [26, 32, 13]], [[-12, -24, 11], [26, 32, 13]], [[6, -24.5, 9.6], [26, 32, 13]], [[-24, 4, 8.5], [31, 0, 8.2]], [[-24, 16, 8.5], [26, 32, 11]], [[-24, -6, 10.5], [31, -12, 8.2]]];
  G.forEach(([a, b], i) => LX.still(T, Math.max(a[0], b[0]), Math.max(a[1], b[1]), 0, (g) => {
    const o = [Math.max(a[0], b[0]), Math.max(a[1], b[1])]; LX.garland2(g, g.p(a[0] - o[0], a[1] - o[1], a[2]), g.p(b[0] - o[0], b[1] - o[1], b[2]), 40 + i, { sag: 7, balloons: i % 2 === 0 });
  }, { layer: 'top' }));
});
