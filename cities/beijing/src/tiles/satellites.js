'use strict';
/* Four satellites on paint blobs off the grid (north = -y, the upper right of the screen; west = -x, upper left):
   top left     the Great Wall at Badaling (north-west, in the mountains): the wall snaking over autumn hills between
                its watchtowers, hikers climbing it;
   upper left   the Summer Palace (north-west): Kunming Lake, Longevity Hill with the Tower of Buddhist Incense, the
                Seventeen-Arch Bridge to its island, a dragon boat;
   upper right  the Olympic Green (north, on the axis): the Bird's Nest's steel lattice round its red bowl and the
                blue Water Cube, kites over the plaza;
   lower right  the CBD (east): the CCTV tower (two leaning towers joined in a bent loop), China World and the
                vase-shaped Citic Tower. */
(function () {
  const blob = (g, pts, col, seed) => K.blob2(g, g.P(pts.map((p) => [p[0], p[1], p[2] || 0])), col, { seed, rag: 0.8 });

  /* ---------------- the Great Wall ---------------- */
  SF.tile('greatwall', -200, -150, { rim: 96, castAt: 165, order: -3, half: 34 }, function (T) {
    T.ground(function (g) { blob(g, [[-34, -4], [-22, -30], [8, -36], [32, -26], [34, -4], [18, 18], [-8, 22], [-30, 14]], '#C9C08A', 3); });
    // the hills: three overlapping ridges, wooded in autumn colours; the wall follows their crests
    const RIDGE = [[-30, 14, 2], [-22, 6, 9], [-12, 0, 14], [-4, -6, 11], [4, -10, 15], [12, -16, 20], [20, -20, 16], [28, -24, 12]];
    const zAt = (s) => { const i = Math.min(RIDGE.length - 2, Math.floor(s)), t = s - i; return lerp(RIDGE[i][2], RIDGE[i + 1][2], t); };
    const ptAt = (s) => { const i = Math.min(RIDGE.length - 2, Math.floor(s)), t = s - i; return [lerp(RIDGE[i][0], RIDGE[i + 1][0], t), lerp(RIDGE[i][1], RIDGE[i + 1][1], t)]; };
    T.obj([-34, -32, 34, 32], function (g) {
      g.boilP = 0.2;
      // mountains as stacked silhouettes (back to front)
      const R = RNG(5);
      for (const [cx, cy, w, h, col] of [[12, -22, 26, 22, '#A6A26A'], [-6, -8, 26, 16, '#B5AE72'], [-18, 8, 20, 10, '#BDB67A']]) {
        const base = g.p(cx, cy, 0), pts = [];
        for (let k = 0; k <= 14; k++) { const t = k / 14, x = base[0] + (t - 0.5) * w * 2 * 3.3, y = base[1] - Math.pow(Math.sin(Math.PI * t), 1.4) * h * VZ * (0.85 + R() * 0.25); pts.push([x, y]); }
        for (let k = 1; k < 12; k++) { const a = Math.PI * k / 12; pts.push([base[0] + Math.cos(a) * w * 3.3, base[1] + Math.sin(a) * 14]); }
        g.fill2(pts, col); g.line2(pts.slice(0, 15), { w: 0.8, c: shade(col, 0.45) });
        for (let k = 0; k < 16; k++) { const t = 0.08 + R() * 0.84, x = base[0] + (t - 0.5) * w * 2 * 3.3, ytop = base[1] - Math.pow(Math.sin(Math.PI * t), 1.4) * h * VZ * 0.8, y = lerp(ytop, base[1] + 8, 0.2 + R() * 0.6), r = 3 + R() * 3; g.fill2(arcPts(x, y, r, 0, TAU, 9).map((q) => [q[0], y + (q[1] - y) * 0.8]), R.pick(['#D45A38', '#E08A3C', '#C9A040', '#8E6A3A', '#5E7A4E']), true); }
      }
      // the wall along the crest: its body, the walkway, crenellations on the outer side, towers at the peaks
      const N = 70, body = [], top = [], cren = [];
      for (let k = 0; k <= N; k++) { const s = (RIDGE.length - 1) * k / N, p = ptAt(s), z = zAt(s); top.push(g.p(p[0], p[1], z + 2.2)); body.push(g.p(p[0], p[1], z - 1.0)); }
      g.fill2(top.concat(body.slice().reverse()), '#A9A194');
      g.line2(top, { w: 1.2, c: '#5E5648' }); g.line2(body, { w: 0.6, c: '#7A7262' });
      const wk = top.map((q) => [q[0], q[1] + 1.4]); g.fill2(top.concat(wk.slice().reverse()), '#C9C1B1');
      for (let k = 0; k < N; k += 1) { const q = top[k], r = top[k + 1]; cren.push(q[0], q[1], q[0], q[1] - 2.0, r[0], r[1] - 2.0); }
      for (let k = 0; k < N; k++) { const q = top[k]; if (k % 2 === 0) g.fill2([[q[0] - 0.8, q[1]], [q[0] + 0.8, q[1]], [q[0] + 0.8, q[1] - 2.0], [q[0] - 0.8, q[1] - 2.0]], '#9A9284', true); }
      for (const s of [1, 2.95, 5.0, 6.6]) {
        const p = ptAt(s), z = zAt(s);
        K.box(g, p[0] - 2.6, p[1] - 2.6, p[0] + 2.6, p[1] + 2.6, z - 1, z + 6.2, { t: '#B9B1A2', l: '#BFB7A8', r: '#A79F90' }, { w: 0.8 });
        for (const [f, pl] of [['L', p[1] + 2.6], ['R', p[0] + 2.6]]) { const a = f === 'L' ? p[0] : p[1]; K.win(g, f, pl, a - 0.6, a + 0.6, z + 2.6, z + 4.4, { style: 'dark', arch: true }); }
        for (let k = 0; k < 5; k++) { const a = -2.6 + k * 1.3; K.box(g, p[0] + a, p[1] + 2.0, p[0] + a + 0.65, p[1] + 2.6, z + 6.2, z + 7.0, { t: '#B9B1A2', l: '#BFB7A8', r: '#A79F90' }, { w: 0.35, boil: false, nohid: true }); }
      }
    }, { name: 'great wall' });
    // hikers on the wall
    for (let k = 0; k < 6; k++) T.actor({ layer: 'top', sample: 1, period: 60,
      at(t) { const S = RIDGE.length - 1, u = (((t / 60 + k / 6) % 1) + 1) % 1, s = (k % 2 ? u : 1 - u) * S, p = ptAt(s), z = zAt(s) + 2.2; const nx = ptAt(Math.min(S, s + 0.05)), dx = (nx[0] - p[0]) * (k % 2 ? 1 : -1), dy = (nx[1] - p[1]) * (k % 2 ? 1 : -1), dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor((u * 60) % 1 * 8); return { x: p[0], y: p[1], z, key: dir + '.' + ph, dir, ph: ph / 8 }; },
      draw(g, st) { BJ.person(g, 0, 0, 0, BJ.who(1200 + k, { dir: st.dir, pose: 'walk', ph: st.ph, k: 0.9 })); } });
  });

  /* ---------------- the Summer Palace ---------------- */
  SF.tile('summerpalace', -215, -10, { rim: 104, castAt: 172, order: -3, half: 34 }, function (T) {
    const LK = [[-30, -6], [-12, -20], [14, -16], [30, 0], [26, 24], [0, 30], [-26, 20]];
    T.ground(function (g) {
      blob(g, [[-34, -16], [-20, -32], [12, -34], [34, -18], [34, 14], [20, 34], [-12, 34], [-34, 16]], '#C2C78A', 7);
      const W = K.curve(LK.map((p) => [p[0], p[1], -0.8]), 4, true); g.fill(W, BC.lake); g.water(W, { dens: 0.8 }); g.outline(W, { w: 0.6, c: BC.waterD, boil: false });
    });
    // Longevity Hill with the Tower of Buddhist Incense at the back
    T.obj([-26, -32, 4, -14], function (g) {
      const b = g.p(-11, -24, 0), pts = []; for (let k = 0; k <= 16; k++) { const t = k / 16; pts.push([b[0] + (t - 0.5) * 92, b[1] - Math.pow(Math.sin(Math.PI * t), 1.1) * 52]); } for (let k = 1; k < 12; k++) { const a = Math.PI * k / 12; pts.push([b[0] + Math.cos(a) * 46, b[1] + Math.sin(a) * 14]); }
      g.fill2(pts, '#8EA06A'); g.line2(pts.slice(0, 17), { w: 0.8, c: '#4E6A3A' });
      const R = RNG(9); for (let k = 0; k < 18; k++) { const t = 0.1 + R() * 0.8, x = b[0] + (t - 0.5) * 92, yt = b[1] - Math.pow(Math.sin(Math.PI * t), 1.1) * 48, y = lerp(yt, b[1] + 10, 0.15 + R() * 0.6), r = 3 + R() * 3; g.fill2(arcPts(x, y, r, 0, TAU, 9).map((q) => [q[0], y + (q[1] - y) * 0.8]), R.pick(['#D45A38', '#E0A040', '#5E7A4E', '#4E6E4B', '#C9A040']), true); }
      const tz = 15, cx = -11, cy = -24;
      BJ.terrace(g, cx - 4.2, cy - 4.2, cx + 4.2, cy + 4.2, tz - 1, tz + 1, { col: { t: '#D9C9A8', l: '#C9B48A', r: '#B5A078' }, rail: false, steps: '' });
      BJ.roundBody(g, cx, cy, 3.0, tz + 1, tz + 5, { n: 8 });
      let z = BJ.roundRoof(g, cx, cy, 4.2, tz + 5, 3.0, { top: 0.42, col: BC.yellow, lift: 0 });
      BJ.roundBody(g, cx, cy, 2.6, z, z + 2.2, { n: 8, doors: false }); z = BJ.roundRoof(g, cx, cy, 3.6, z + 2.2, 2.6, { top: 0.42, col: '#4F8F6A' });
      BJ.roundBody(g, cx, cy, 2.2, z, z + 1.8, { n: 8, doors: false }); z = BJ.roundRoof(g, cx, cy, 3.2, z + 1.8, 4.2, { col: BC.yellow });
      const f = g.p(cx, cy, z); g.disc2([f[0], f[1] - 1.4], 1.0, BC.gold);
    }, { name: 'longevity hill' });
    // the Seventeen-Arch Bridge to the island (with its little temple)
    T.obj([4, 8, 27, 12], function (g) {
      const n = 17, x0 = 4, x1 = 24, y = 10, pts = [], under = [];
      for (let k = 0; k <= 30; k++) { const t = k / 30, x = lerp(x0, x1, t); pts.push([x, y + 2, 0.8 + Math.sin(Math.PI * t) * 1.6]); }
      g.fill(pts.concat(pts.slice().reverse().map((p) => [p[0], p[1], -0.8])), '#F2EFE7'); g.line(pts, { w: 0.7, boil: false });
      for (let k = 0; k < n; k++) { const t = (k + 0.5) / n, x = lerp(x0, x1, t), zt = 0.3 + Math.sin(Math.PI * t) * 1.5, r = (x1 - x0) / n * 0.36; const a = []; for (let j = 0; j <= 6; j++) { const th = Math.PI * j / 6; a.push([x - Math.cos(th) * r, y + 2.02, -0.8 + Math.sin(th) * (zt + 0.5)]); } g.fill(a, '#6E8EA8'); under.push(a); }
      const top = pts.map((p) => [p[0], p[1] - 4, p[2]]); g.fill(pts.concat(top.slice().reverse()), '#E6E1D5');
      K.box(g, 24, 7, 28, 12, 0, 3.6, { t: '#C9B7A0', l: BC.red, r: shade(BC.red, 0.12) }, { w: 0.6 }); BJ.roof(g, 24, 7, 28, 12, 3.6, 2.2, { type: 'xie', col: BC.yellow, over: 0.8 });
    }, { name: 'seventeen-arch bridge' });
    // the Marble Boat by the near shore, and a dragon boat on the lake
    T.obj([-24, 12, -14, 17], function (g) { g.at(-19, 14.6, -0.6, (g2) => { K.boat(g2, 0, { kind: 'row', L: 5, W: 2.2, hull: '#EDE9E0' }); K.rbox(g2, 0, 0, 3.6, 1.6, 0, 1.6, 4.6, { t: '#E3DED2', l: '#F2EFE7', r: '#DAD5C8' }, { w: 0.6 }); K.rbox(g2, 0, 0, 3.0, 1.4, 0, 4.6, 6.6, { t: '#C9B48A', l: '#E9E4D8', r: '#D6D0C4' }, { w: 0.5 }); }); }, { name: 'marble boat' });
    T.actor({ sample: 0.3, period: TAU / 0.08, grow: false,
      at(t) { const a = t * 0.08, x = 4 + Math.cos(a) * 12, y = 4 + Math.sin(a) * 5, ang = Math.atan2(Math.cos(a) * 5, -Math.sin(a) * 12), q = Math.round(ang / (TAU / 24)); return { x, y, z: -0.8, key: 'q' + (((q % 24) + 24) % 24), ang: q * TAU / 24 }; },
      draw(g, st) { K.boat(g, st.ang, { kind: 'row', L: 4.6, W: 1.5, hull: '#C9382E', stripe: '#E2B13A' }); const ca = Math.cos(st.ang), sa = Math.sin(st.ang); const h = g.p(4.4 * ca, 4.4 * sa, 1.2); g.fill2([[h[0] - 1, h[1]], [h[0] + 1, h[1]], [h[0] + 1.6, h[1] - 3.6], [h[0], h[1] - 4.4]], '#E2B13A', true); K.rbox(g, -0.5 * ca, -0.5 * sa, 2.4, 1.2, st.ang, 1.4, 3.6, { t: '#E2B13A', l: '#C9382E', r: '#A82E26' }, { w: 0.45 }); } });
  });

  /* ---------------- the Olympic Green ---------------- */
  SF.tile('olympic', -20, -215, { rim: 100, castAt: 168, order: -3, half: 34 }, function (T) {
    T.ground(function (g) { blob(g, [[-32, -14], [-20, -32], [14, -32], [32, -14], [32, 16], [16, 32], [-16, 32], [-32, 14]], '#DAD6CA', 11); g.fill(K.rect(-28, 18, 28, 26), '#E6E2D8'); });
    // the Bird's Nest: a saddle-shaped elliptical bowl, red inside, wrapped in a tangle of grey steel
    T.obj([-26, -24, 8, 8], function (g) {
      const cx = -9, cy = -8, ra = 16, rb = 14, n = 32, zb = (a) => 9.5 + 1.6 * Math.cos(2 * a);
      const ring = (k, zf) => { const p = []; for (let i = 0; i <= n; i++) { const a = TAU * i / n; p.push([cx + Math.cos(a) * ra * k, cy + Math.sin(a) * rb * k, zf(a)]); } return p; };
      const outerTop = ring(1, zb), outerBot = ring(1, () => 0), innerTop = ring(0.66, (a) => zb(a) - 0.6);
      g.fill(innerTop, '#C9382E');
      const bowl = ring(0.45, () => 1.2); g.fill(bowl, '#7FA05E');
      // the back half of the shell (seen inside), then the front half outside
      const front = [], back = [];
      for (let i = 0; i < n; i++) { const a = TAU * (i + 0.5) / n, q = [outerBot[i], outerBot[i + 1], outerTop[i + 1], outerTop[i]]; (Math.cos(a) + Math.sin(a) > 0 ? front : back).push({ q, a }); }
      for (const { q } of back) g.fill([q[3], q[2], [lerp(q[2][0], cx, 0.34), lerp(q[2][1], cy, 0.34), q[2][2] - 0.6], [lerp(q[3][0], cx, 0.34), lerp(q[3][1], cy, 0.34), q[3][2] - 0.6]], '#9A968E');
      for (const { q, a } of front.sort((p, r) => (Math.cos(p.a) + Math.sin(p.a)) - (Math.cos(r.a) + Math.sin(r.a)))) { const lit = clamp(0.5 + 0.5 * Math.cos(a - Math.PI * 0.75), 0, 1); g.fill(q, mix('#8E8A82', '#B9B5AC', lit)); }
      // the steel tangle: crossing diagonals over the front of the shell
      const sg = [];
      for (let i = 0; i < 40; i++) { const a0 = -Math.PI / 4 + (i / 40 - 0.5) * Math.PI * 1.1, a1 = a0 + 0.5 + (i % 3) * 0.12, p0 = g.p(cx + Math.cos(a0) * ra, cy + Math.sin(a0) * rb, 0), p1 = g.p(cx + Math.cos(a1) * ra, cy + Math.sin(a1) * rb, zb(a1)); if (Math.cos(a0) + Math.sin(a0) > -0.3) sg.push(p0[0], p0[1], p1[0], p1[1]); const p2 = g.p(cx + Math.cos(a1 - 1.1) * ra, cy + Math.sin(a1 - 1.1) * rb, 0); if (Math.cos(a1) + Math.sin(a1) > -0.3) sg.push(p1[0], p1[1], p2[0], p2[1]); }
      g.segs2(sg, '#5E5A52', 0.6);
      g.line(outerTop.filter((p, i) => { const a = TAU * i / n; return Math.cos(a) + Math.sin(a) > -0.6; }), { w: 0.9 });
      g.line(outerBot.filter((p, i) => { const a = TAU * i / n; return Math.cos(a) + Math.sin(a) > -0.6; }), { w: 0.9 });
    }, { name: 'birds nest' });
    // the Water Cube
    T.obj([10, -26, 30, -6], function (g) {
      K.box(g, 10, -26, 30, -6, 0, 7, { t: '#BFD9EC', l: '#9CC6E6', r: '#86B4D8' }, { w: 0.9 });
      const R = RNG(13); for (const [f, p, a0, a1] of [['L', -6, 10, 30], ['R', 30, -26, -6]]) for (let i = 0; i < 40; i++) { const c = g.p.apply(g, K.pt(f, p + 0.03, a0 + 0.6 + R() * (a1 - a0 - 1.2), 0.5 + R() * 6)); g.ring2(c, 0.6 + R() * 1.3, { w: 0.3, c: '#E9F3F9' }); }
    }, { name: 'water cube' });
    // kites and their flyers on the plaza
    [[-12, 22, '#D23A2E', 0], [8, 23, '#2E6FB0', 2]].forEach(([fx, fy, col, ph0], i) => {
      T.cast([fx, fy], (g) => BJ.person(g, fx, fy, 0, BJ.who(1220 + i, { dir: 3, pose: 'hold', reach: [0.6, -8.8] })), { on: false });
      T.actor({ layer: 'top', sample: 5, period: 12, grow: false, at(t) { const w = Math.floor(t * 4 + i * 3) % 12, bob = Math.sin(t * 0.9 + ph0) * 1.2; return { x: fx + 6, y: fy - 12, z: 26 + bob, key: 'k' + w, w, bob }; },
        draw(g, st) { const o = g.p(0, 0, 0), hand = g.p(-6, 12, 4.4 - (26 + st.bob)); const pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push([lerp(o[0], hand[0], t), lerp(o[1], hand[1], t) + Math.sin(Math.PI * t) * 5]); } g.fine2(pts, { w: 0.25, c: '#6E6658' }); BJ.kite2(g, [o[0], o[1] - 3], 3.2, col, st.w * TAU / 12); } });
    });
    K.walker(T, BJ.who(1225), [[-24, 21], [22, 21]], 1.2, { phase: 0.1 });
    K.walker(T, BJ.who(1226), [[22, 24.6], [-24, 24.6]], 1.0, { phase: 0.5 });
  });

  /* ---------------- the CBD ---------------- */
  SF.tile('cbd', 215, 20, { rim: 110, castAt: 175, order: 3, half: 34 }, function (T) {
    T.ground(function (g) { blob(g, [[-32, -16], [-16, -32], [18, -30], [32, -12], [30, 18], [14, 32], [-18, 30], [-32, 12]], '#D9D6CE', 17); g.fill(K.rect(-24, 14, 24, 22), '#CFCBC1'); for (const y of [17, 19]) g.line([[-24, y, 0], [24, y, 0]], { w: 0.5, c: y === 18 ? '#E2B93E' : '#F7F5EE', boil: false }); });
    // the CCTV tower: two leaning towers, joined by a bridge at the base and a cantilevered overhang at the top
    T.obj([-22, -22, 4, 2], function (g) {
      g.boilP = 0.25;
      const GL = { t: '#B9C3C9', l: '#C9D3D9', r: '#A9B5BD' }, lean = 6, Z = 30;
      const tower = (x0, y0, x1, y1, dx, dy) => {   // a box whose top is shifted by (dx, dy): drawn as its two visible faces and top
        const A = [x0, y1, 0], B = [x1, y1, 0], Cc = [x1, y0, 0], A1 = [x0 + dx, y1 + dy, Z], B1 = [x1 + dx, y1 + dy, Z], C1 = [x1 + dx, y0 + dy, Z], D1 = [x0 + dx, y0 + dy, Z];
        g.fill([A, B, B1, A1], GL.l); g.fill([B, Cc, C1, B1], GL.r); g.fill([A1, B1, C1, D1], GL.t);
        const sg = []; for (let k = 1; k < 8; k++) { const t = k / 8; for (const [P, Q] of [[A, B], [B, Cc]]) { const p0 = g.p(lerp(P[0], P[0] + dx, t), lerp(P[1], P[1] + dy, t), Z * t), p1 = g.p(lerp(Q[0], Q[0] + dx, t), lerp(Q[1], Q[1] + dy, t), Z * t); sg.push(p0[0], p0[1], p1[0], p1[1]); } }
        for (const [P, Q] of [[A, B], [B, Cc]]) for (let k = 0; k <= 4; k++) { const s = k / 4, p0 = g.p(lerp(P[0], Q[0], s), lerp(P[1], Q[1], s), 0), q0 = g.p(lerp(P[0], Q[0], 1 - s) + dx, lerp(P[1], Q[1], 1 - s) + dy, Z); sg.push(p0[0], p0[1], q0[0], q0[1]); }
        g.segs2(sg, '#7E8E98', 0.35);
        g.outline([A, B, B1, A1], { w: 0.9 }); g.outline([B, Cc, C1, B1], { w: 0.9 });
      };
      K.box(g, -22, -22, -8, -16, 0, 6, GL, { w: 0.8 });
      tower(-22, -22, -16, -8, 0, lean); tower(-6, -12, 0, 2, -lean * 0, -lean * 0.4);
      // the overhang at the top: an L-shaped bridge from one tower top to the other
      K.box(g, -22, -14, 0, -8, Z - 6, Z, GL, { w: 0.9 });
      const sg = []; for (let x = -21; x < 0; x += 2.2) { const a = g.p(x, -8, Z - 6), b = g.p(x + 1.1, -8, Z); sg.push(a[0], a[1], b[0], b[1]); } g.segs2(sg, '#7E8E98', 0.35);
    }, { name: 'cctv' });
    // China World tower and the Citic tower (the vase)
    T.obj([10, -26, 18, -18], (g) => { K.box(g, 10, -26, 18, -18, 0, 26, { t: '#C9D6DF', l: '#B9C9D6', r: '#9FB2C2' }, { w: 0.9 }); for (let z = 3; z < 26; z += 2.4) { g.fine([[10, -18.02, z], [18, -18.02, z]], { w: 0.3, c: '#8EA7B6' }); g.fine([[18.02, -26, z], [18.02, -18, z]], { w: 0.3, c: '#8EA7B6' }); } K.box(g, 11, -25, 17, -19, 26, 28, '#9FB2C2', { w: 0.6 }); }, { name: 'china world' });
    T.obj([20, -28, 30, -18], (g) => { const cx = 25, cy = -23; let z = 0; for (let k = 0; k < 4; k++) { const r = [4.0, 3.3, 3.2, 3.8][k], hh = [7, 9, 9, 7][k]; K.cyl(g, cx, cy, r, z, z + hh, { t: '#DCE6EC', l: '#C9D8E2', r: '#AFC2D0' }, { w: 0.6, n: 16, nt: k < 3 }); z += hh; } for (let zz = 2; zz < 31; zz += 2) { const pts = K.arc(cx, cy, zz, 3.2 + (zz < 7 || zz > 25 ? 0.6 : 0.05), A_L, A_R, 10); g.fine(pts, { w: 0.25, c: '#8EA7B6' }); } }, { name: 'citic tower' });
    // traffic on the road in front (East Third Ring)
    for (let k = 0; k < 3; k++) T.actor({ sample: 0.3, period: 48 / 14,
      at(t) { const s = ((t * 14 + k * 16) % 48 + 48) % 48 - 24, a = Math.min(1, (22 - Math.abs(s)) / 4); if (a <= 0.03) return null; return { x: k === 1 ? -s : s, y: k === 1 ? 16 : 20, key: 'c' + k, alpha: a < 1 ? a : null, ang: k === 1 ? Math.PI : 0 }; },
      draw(g, st) { if (k === 2) BJ.taxi(g, st.ang, { band: '#4F8F5A' }); else K.car(g, st.ang, { col: k ? '#2F343B' : '#F1EFE8' }); } });
    K.walker(T, BJ.who(1230), [[-22, 10], [-4, 10], [-4, 12], [-22, 12]], 1.2, { phase: 0.3 });
  });
})();
