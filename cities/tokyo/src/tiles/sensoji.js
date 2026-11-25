'use strict';
/* (0,100) Sensō-ji, Asakusa, laid out as it really stands: the approach runs north (here -y, from the near left to the
   far right) from the street through the Kaminarimon (the Thunder Gate: vermilion posts, a dark roof, the giant red
   lantern reading 雷門 in the passage, the wind god Fūjin on the right and the thunder god Raijin on the left behind
   grilles), along Nakamise (two rows of little shops under one long roof each, red-and-white awnings, the far row's
   fronts towards us, the near row showing its back lane), through the two-storey Hōzōmon (its big red lantern, two
   bronze ones, the Niō guardians), past the incense burner (jōkōro) and its smoke to the Main Hall (Hondō) on its stone
   podium under a huge steep roof. The five-storey pagoda stands west of the courtyard (to the left as you walk in),
   Asakusa Shrine east of the hall behind its stone torii, the bell of Bentenyama on its little rise east of Nakamise,
   the chōzuya (water pavilion) and the omikuji stand in the courtyard, Denbō-in's pond garden west of Nakamise.
   Life: worshippers waft the incense smoke over themselves and pray, people shake out an omikuji, read it and tie it up,
   friends in rented kimono photograph each other at the gate, rickshaws run past it, a dango shop hands skewers over
   its counter, a monk strikes the bell, visitors bow and pray at the hall, pigeons, a school trip with its flag. */
SF.tile('sensoji', 0, 100, { rim: 24 }, function (T) {
  const H = 37, A = 2;                                        // A: the approach's axis (x); it runs along y
  const VERM = { t: '#E07A62', l: '#CF4C3D', r: '#B23D32' }, NAVY = '#4A5469', WALL = { t: '#EFEADD', l: '#F6F2E8', r: '#E3DCCB' };
  const STONE = { t: '#E3DED2', l: '#D9D4C8', r: '#C3BEB1' }, PAVE = '#E2DCCD', GREEN = ['#5E9E7E', '#4E8A6C'], GOLD = '#D9B04F';
  const WOOD = { t: '#C9A26B', l: '#B58F58', r: '#A07C4C' }, BRONZE = { t: '#7E8A72', l: '#6E7A64', r: '#5A6452' };
  const LIT = { nc: (c) => mix(nightColour(c), c, 0.42) };   // the temple is floodlit after dark
  const PX = (q) => [q[0], q[1]];

  /* ---------------- drawing helpers ---------------- */
  // the light fascia board under the two visible eaves of a TK.roof on [x0, y0, x1, y1] at eave height z
  const trim = (g, x0, y0, x1, y1, z, ov, lift, th) => {
    th = th || 0.42; const X0 = x0 - ov, X1 = x1 + ov, Y0 = y0 - ov, Y1 = y1 + ov, N = 12;
    const side = (a0, b0, a1, b1) => {
      const top = [], bot = [];
      for (let i = 0; i <= N; i++) { const t = i / N, zz = z + lift * Math.pow(Math.abs(2 * t - 1), 2.4), x = lerp(a0, a1, t), y = lerp(b0, b1, t); top.push([x, y, zz]); bot.push([x, y, zz - th]); }
      g.fill(top.concat(bot.slice().reverse()), '#F1ECE0'); g.line(bot, { w: 0.4, c: '#3A3530', boil: false });
    };
    side(X0, Y1, X1, Y1); side(X1, Y1, X1, Y0);
  };
  // a temple roof with its fascia
  const roof = (g, x0, y0, x1, y1, z, h, o) => { const r = TK.roof(g, x0, y0, x1, y1, z, h, Object.assign({ col: NAVY, sp: 0.8, w: 0.9 }, o)); trim(g, x0, y0, x1, y1, z, o.over == null ? 2 : o.over, o.lift == null ? 0.9 : o.lift, o.th); return r; };
  // a storey of a temple building on its two visible faces: white plaster between vermilion posts, a tie beam and a
  // sill, green lattice windows in the bays (o.win) and a studded door in the middle bay (o.door)
  const storey = (g, x0, y0, x1, y1, z0, z1, o) => {
    o = o || {}; K.box(g, x0, y0, x1, y1, z0, z1, WALL, { w: o.w || 0.85 });
    const edges = [];
    for (const [f, p, a0, a1, k] of [['L', y1, x0, x1, 0], ['R', x1, y0, y1, 1]]) {
      const n = Math.max(1, Math.round((a1 - a0) / (o.bay || 3))), bw = (a1 - a0) / n, pw = Math.min(0.6, bw * 0.17), hz = z1 - z0;
      for (let i = 0; i < n; i++) {
        const b0 = a0 + i * bw + pw / 2, b1 = b0 + bw - pw, mid = i === Math.floor(n / 2) && n % 2 === 1;
        if (o.door && mid) {
          const q = K.on(f, p + 0.03, b0 + 0.12, b1 - 0.12, z0, z0 + hz * 0.82); g.fill(q, k ? '#9E372E' : '#B2433A');
          const s = []; for (let r = 1; r < 4; r++) for (let c = 1; c < 4; c++) { const pt = g.p.apply(g, K.pt(f, p + 0.05, lerp(b0, b1, c / 4), z0 + hz * 0.82 * r / 4)); s.push(pt[0] - 0.25, pt[1], pt[0] + 0.25, pt[1]); }
          g.segs2(s, GOLD, 0.45); g.outline(q, { w: 0.35, c: '#5A2A22', boil: false });
        } else if (o.win) {
          const q = K.on(f, p + 0.03, b0 + bw * 0.14, b1 - bw * 0.14, z0 + hz * 0.3, z1 - hz * 0.22); g.fill(q, GREEN[k]); g.mark({ win: 0.5 });
          const s = []; const nb = Math.max(3, Math.round((b1 - b0) / 0.45)); for (let j = 1; j < nb; j++) { const a = lerp(b0 + bw * 0.14, b1 - bw * 0.14, j / nb), p0 = g.p.apply(g, K.pt(f, p + 0.05, a, z0 + hz * 0.3)), p1 = g.p.apply(g, K.pt(f, p + 0.05, a, z1 - hz * 0.22)); s.push(p0[0], p0[1], p1[0], p1[1]); }
          g.segs2(s, '#2E5A48', 0.28); g.outline(q, { w: 0.3, c: '#2E4A3E', boil: false });
        }
      }
      for (let i = 0; i <= n; i++) { const a = a0 + i * bw; g.fill(K.on(f, p + 0.04, a - pw / 2, a + pw / 2, z0, z1), k ? VERM.r : VERM.l); const e0 = g.p.apply(g, K.pt(f, p + 0.05, a - pw / 2, z0)), e1 = g.p.apply(g, K.pt(f, p + 0.05, a - pw / 2, z1)); edges.push(e0[0], e0[1], e1[0], e1[1]); }
      g.fill(K.on(f, p + 0.05, a0, a1, z1 - Math.min(0.9, hz * 0.14), z1), k ? VERM.r : VERM.l);
      g.fill(K.on(f, p + 0.05, a0, a1, z0, z0 + 0.35), k ? '#8E3029' : VERM.r);
    }
    g.segs2(edges, '#7A2A22', 0.3);
  };
  // the bracket band under an eave: a dark green frieze with the pale ends of the brackets
  const brackets = (g, x0, y0, x1, y1, z0, z1) => {
    K.box(g, x0, y0, x1, y1, z0, z1, { t: '#3E5A4E', l: '#3F6152', r: '#344F44' }, { w: 0.55 });
    const s = []; for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) for (let a = a0 + 0.5; a < a1 - 0.2; a += 1.0) { const c = g.p.apply(g, K.pt(f, p + 0.04, a, (z0 + z1) / 2)); s.push(c[0] - 0.5, c[1], c[0] + 0.5, c[1]); }
    g.segs2(s, '#EDE4C8', 0.9);
  };
  // a guardian behind a grille in a gate bay (face 'L' at y = p, a0..a1 along x): Raijin with his ring of drums, Fūjin
  // with his wind bag, a Niō with a raised fist
  const guardian = (g, p, a0, a1, z0, z1, kind) => {
    g.fill(K.on('L', p, a0, a1, z0, z1), '#3A2C26');
    const F = g.p((a0 + a1) / 2, p - 0.3, z0 + 0.2), s = (z1 - z0) * VZ / 27, P = (u, v) => [F[0] + u * s, F[1] - v * s];
    const skin = kind === 'wind' ? '#6FA37E' : '#C9503E', ink = '#2A2220';
    if (kind === 'thunder') for (let k = 0; k < 7; k++) { const a = Math.PI * (0.05 + 0.9 * k / 6), c = P(Math.cos(a) * 8.2, 15 + Math.sin(a) * 9); g.disc2(c, 1.7 * s, '#C9963E'); g.ring2(c, 1.7 * s, { c: ink, w: 0.3 }); }
    if (kind === 'wind') { const bag = K.curve([P(-8.5, 15), P(-6.5, 23.5), P(0, 25.5), P(6.5, 23.5), P(8.5, 15), P(5, 20), P(0, 21.5), P(-5, 20)], 3, true); g.fill2(bag, '#EDE6D2', true); g.line2(bag, { w: 0.35, c: ink, close: true, boil: false }); }
    const robe = [P(-4.6, 6.5), P(4.6, 6.5), P(3.8, 12.5), P(-3.8, 12.5)], legs = [P(-4.2, 0), P(-1.2, 0), P(-1, 6.6), P(1, 6.6), P(1.2, 0), P(4.2, 0), P(3.6, 7), P(-3.6, 7)];
    g.fill2(legs, skin, true); g.fill2(robe, kind === 'nio' ? '#E9E2CF' : '#C9A24F', true);
    g.fill2([P(-3.9, 12.3), P(3.9, 12.3), P(4.7, 17.6), P(-4.7, 17.6)], skin, true);
    g.line2([P(4.3, 17), P(7.6, 19.8), P(7.0, 23.2)], { w: 1.9 * s, c: skin, boil: false }); g.line2([P(-4.3, 17), P(-7.4, 14.4), P(-7.8, 11.2)], { w: 1.9 * s, c: skin, boil: false });
    g.disc2(P(0, 20.1), 2.5 * s, skin); g.fill2([P(-2.6, 20.8), P(-1.8, 23.4), P(0, 22.4), P(1.8, 23.4), P(2.6, 20.8), P(0, 21.8)], ink, true);
    g.disc2(P(-0.9, 20.3), 0.45 * s, '#F6E7A8'); g.disc2(P(0.9, 20.3), 0.45 * s, '#F6E7A8');
    g.line2(robe.concat([robe[0]]), { w: 0.3, c: ink, boil: false });
    const gr = []; for (let a = a0 + 0.42; a < a1 - 0.2; a += 0.48) { const q0 = g.p(a, p + 0.05, z0), q1 = g.p(a, p + 0.05, z1); gr.push(q0[0], q0[1], q1[0], q1[1]); }
    for (const zz of [z0 + (z1 - z0) * 0.34, z0 + (z1 - z0) * 0.68]) { const q0 = g.p(a0, p + 0.05, zz), q1 = g.p(a1, p + 0.05, zz); gr.push(q0[0], q0[1], q1[0], q1[1]); }
    g.segs2(gr, '#9A7A44', 0.36);
  };
  const post = (g, x, y, z0, z1, r, col) => K.box(g, x - r, y - r, x + r, y + r, z0, z1, col || VERM, { w: 0.6, nohid: true });
  // a stone lantern (tōrō): base, shaft, the fire box that is lit after dark, its cap and a jewel
  const toro = (g, x, y, s) => {
    s = s || 1; const C3 = { t: '#D9D4C6', l: '#CFC9BB', r: '#B8B2A4' };
    K.box(g, x - 1.1 * s, y - 1.1 * s, x + 1.1 * s, y + 1.1 * s, 0, 0.6 * s, C3, { w: 0.5, nohid: true });
    K.cyl(g, x, y, 0.45 * s, 0.6 * s, 2.8 * s, C3, { w: 0.5, n: 8 });
    K.box(g, x - 0.85 * s, y - 0.85 * s, x + 0.85 * s, y + 0.85 * s, 2.8 * s, 3.1 * s, C3, { w: 0.45, nohid: true });
    K.box(g, x - 0.6 * s, y - 0.6 * s, x + 0.6 * s, y + 0.6 * s, 3.1 * s, 4.3 * s, C3, { w: 0.5, nohid: true });
    for (const [f, p] of [['L', y + 0.6 * s], ['R', x + 0.6 * s]]) { g.fill(K.on(f, p + 0.02, (f === 'L' ? x : y) - 0.3 * s, (f === 'L' ? x : y) + 0.3 * s, 3.3 * s, 4.0 * s), '#5A5248'); g.mark({ nc: '#FFD28A', light: true }); }
    g.glow('lantern', x, y, 3.7 * s, { r: 2.2 * s, col: '#FFD28A' });
    K.hip(g, x - 1.25 * s, y - 1.25 * s, x + 1.25 * s, y + 1.25 * s, 4.3 * s, 1.1 * s, '#C9C3B5', { w: 0.5 });
    g.disc2(g.p(x, y, 5.7 * s), 0.55 * s * 2.2, '#C9C3B5'); g.ring2(g.p(x, y, 5.7 * s), 0.55 * s * 2.2, { w: 0.4, c: '#5A564E' });
  };

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    K.slab(g, H, { top: '#E9E3D4' });
    g.scuff(K.rect(-H, -H, H, H), { dir: -0.4, len: 2.2, c: '#DCD4C2', dens: 0.5, w: 0.45, spread: 1.2 });
    const pave = (x0, y0, x1, y1, sp, c) => {
      g.fill(K.rect(x0, y0, x1, y1), c || PAVE); const s = [];
      for (let y = y0 + sp; y < y1 - 0.1; y += sp) { const a = g.p(x0, y, 0), b = g.p(x1, y, 0); s.push(a[0], a[1], b[0], b[1]); }
      let row = 0; for (let y = y0; y < y1 - 0.1; y += sp, row++) for (let x = x0 + (row % 2 ? sp * 0.75 : sp * 1.5); x < x1 - 0.1; x += sp * 1.5) { const a = g.p(x, y, 0), b = g.p(x, Math.min(y1, y + sp), 0); s.push(a[0], a[1], b[0], b[1]); }
      g.segs2(s, '#CBC3B2', 0.28);
    };
    pave(-H, 31.4, H, H, 2.2, '#E4DED0');                     // the street side in front of the Thunder Gate
    pave(A - 3.8, -24.2, A + 3.8, 31.4, 1.9);                 // the approach, gate to hall
    pave(-14, -24.2, 21, -3.0, 2.4);                          // the courtyard
    g.line([[A - 3.8, -3.0, 0], [A - 3.8, 31.4, 0]], { w: 0.45, c: '#B9B1A0', boil: false }); g.line([[A + 3.8, -3.0, 0], [A + 3.8, 31.4, 0]], { w: 0.45, c: '#B9B1A0', boil: false });
    // moss under the pagoda's trees, Denbō-in's pond garden, Bentenyama's little rise
    K.lawn(g, -H, -H, -15, -26, { col: '#B9CF94', dens: 0.6 }); K.lawn(g, -H, -24, -33, 1, { col: '#B9CF94', dens: 0.6 });
    K.lawn(g, -35, 4, -9.5, 28, { col: '#B9CF94', dens: 0.7 });
    K.lawn(g, 15, -2.5, 30, 13, { col: '#B9CF94', dens: 0.6 });
    const pond = K.curve([[-30, 9, 0], [-22, 7.5, 0], [-15, 9.5, 0], [-13, 15, 0], [-17, 21.5, 0], [-25, 22.5, 0], [-31.5, 18, 0]], 5, true);
    g.fill(pond.map((p) => [p[0] * 1.03 + 0.7, p[1] * 1.03 - 0.4, 0]), C.waterD); g.fill(pond, C.water); g.water(pond, { dens: 0.8 });
    g.outline(pond, { w: 0.6, c: '#5F7F9C', boil: false });
    for (const [x, y, c] of [[-24, 13, '#E08A3C'], [-21.5, 15.5, '#F3F1EA'], [-26, 17, '#E08A3C'], [-18, 12, '#C9463E'], [-23, 19, '#F3F1EA']]) { const p = g.p(x, y, 0.02); g.fill2([[p[0] - 1.5, p[1]], [p[0], p[1] - 0.55], [p[0] + 1.5, p[1]], [p[0] + 0.3, p[1] + 0.5]], c, true); g.disc2([p[0] - 1.4, p[1] - 0.1], 0.35, shade(c, 0.1)); }
    // stepping stones across the moss, gravel round the pagoda
    const st = []; for (let k = 0; k < 7; k++) st.push([-12 - k * 2.6, 27.5 - k * 0.4]); for (const [x, y] of st) { const p = g.p(x, y, 0.02); g.fill2(arcPts(p[0], p[1], 2.4, 0, TAU, 9).map((q) => [q[0], p[1] + (q[1] - p[1]) * 0.5]), '#D9D3C4', true); }
    g.fill(K.rect(-32.5, -18.5, -19.5, -5.5), '#E6E0D0'); g.scuff(K.rect(-32.5, -18.5, -19.5, -5.5), { dir: 0.4, len: 1.6, c: '#D3CBB7', dens: 0.9, w: 0.4, spread: 2 });
    g.fill(K.rect(-25, -5.5, -14, 2.5), '#E6E0D0');
  }, { rim: true });

  /* ---------------- the Main Hall ---------------- */
  T.obj([-14, -37, 20, -21.8], function (g) {
    g.boilP = 0.3;
    g.lit(LIT, () => {
      K.box(g, -13.5, -37, 17.5, -24.2, 0, 2.2, STONE, { w: 0.9 });                           // the stone podium
      const cs = []; for (let x = -13.5 + 2.4; x < 17.5; x += 2.4) { const a = g.p(x, -24.15, 0), b = g.p(x, -24.15, 2.2); cs.push(a[0], a[1], b[0], b[1]); } for (let y = -37 + 2.4; y < -24.2; y += 2.4) { const a = g.p(17.55, y, 0), b = g.p(17.55, y, 2.2); cs.push(a[0], a[1], b[0], b[1]); } g.segs2(cs, '#A9A395', 0.3);
      for (let i = 0; i < 3; i++) K.box(g, A - 4.5, -24.2, A + 4.5, -24.2 + 0.8 * (3 - i), 0, 0.73 * (i + 1), STONE, { w: 0.5, boil: false });   // the front steps
      g.fill(K.rect(-13.3, -36.8, 17.3, -24.4, 2.21), '#C9A27A');                              // the veranda boards
      storey(g, -12, -35.6, 16, -26.2, 2.2, 12.2, { bay: 3.5, win: true });
      // the open centre of the front: three bays into the dark hall, with gold lamps inside
      g.fill(K.on('L', -26.15, A - 5.2, A + 5.2, 2.2, 10.6), '#3A2622');
      for (const dx of [-3.2, 0, 3.2]) { const c = g.p(A + dx, -26.1, 6.8); g.disc2(c, 1.1, '#E9B84F'); g.mark({ nc: '#FFD27A', light: true }); }
      const fs = []; for (const dx of [-5.2, -1.7, 1.7, 5.2]) { const a = g.p(A + dx, -26.1, 2.2), b = g.p(A + dx, -26.1, 10.6); fs.push(a[0], a[1], b[0], b[1]); } g.segs2(fs, VERM.l, 1.4);
      // the outer row of posts along the front of the veranda
      for (let k = 0; k <= 8; k++) post(g, -12 + k * 3.5, -24.8, 2.2, 12.2, 0.32);
      brackets(g, -12.6, -36.2, 16.6, -24.4, 12.2, 13.2);
      // the plaque under the eave
      const pq = K.on('L', -24.3, A - 2.2, A + 2.2, 10.9, 12.0); g.fill(pq, '#2E2A26'); g.outline(pq, { w: 0.5, c: GOLD, boil: false });
    });
    TK.lantern2(g, g.p(A, -25.3, 7.6), 9.2, '#C9463E');           // the great red lantern of the hall
    g.lit(LIT, () => {
      roof(g, -12.6, -36.2, 16.6, -24.4, 13.2, 14, { gable: 0.42, over: 3.4, lift: 2.3, ridge: 'x', th: 0.55 });
      // the gegyo, a gilded ornament hanging under the ridge of the gable
      const gc = g.p(16.6 + 3.4, -30.3, 13.2 + 14 * 0.58 + 1.5); g.disc2(gc, 1.6, GOLD); g.ring2(gc, 1.6, { c: '#7A5A2A', w: 0.4 });
    });
  }, { name: 'main hall' });

  /* ---------------- the five-storey pagoda ---------------- */
  T.obj([-31.5, -17.5, -20.5, -6.5], function (g) {
    g.boilP = 0.25;
    const cx = -26, cy = -12, S = [3.5, 3.22, 2.96, 2.72, 2.5], BH = [5.4, 4.0, 3.8, 3.6, 3.4];
    let z = 1.4, top = 0;
    g.lit(LIT, () => {
      K.box(g, cx - 5.4, cy - 5.4, cx + 5.4, cy + 5.4, 0, 1.4, STONE, { w: 0.8 });
      for (let i = 0; i < 3; i++) K.box(g, cx - 1.8, cy + 5.4, cx + 1.8, cy + 5.4 + 0.7 * (3 - i), 0, 0.47 * (i + 1), STONE, { w: 0.45, boil: false });
      for (let k = 0; k < 5; k++) {
        const s = S[k], ov = 2.75 - k * 0.12, h = k === 4 ? 3.6 : 2.4;
        if (k) { // a little balcony rail round every upper storey
          const rl = []; for (const [f, p, a0, a1] of [['L', cy + s + 0.5, cx - s - 0.5, cx + s + 0.5], ['R', cx + s + 0.5, cy - s - 0.5, cy + s + 0.5]]) for (let a = a0; a <= a1 + 0.01; a += (a1 - a0) / 6) { const q0 = g.p.apply(g, K.pt(f, p, a, z)), q1 = g.p.apply(g, K.pt(f, p, a, z + 0.8)); rl.push(q0[0], q0[1], q1[0], q1[1]); }
          g.segs2(rl, VERM.r, 0.45);
        }
        storey(g, cx - s, cy - s, cx + s, cy + s, z, z + BH[k], { bay: s * 0.7, win: true, door: true, w: 0.75 });
        if (k) { g.line([[cx - s - 0.5, cy + s + 0.5, z + 0.8], [cx + s + 0.5, cy + s + 0.5, z + 0.8], [cx + s + 0.5, cy - s - 0.5, z + 0.8]], { w: 0.5, c: '#8E3029', boil: false }); }
        brackets(g, cx - s - 0.35, cy - s - 0.35, cx + s + 0.35, cy + s + 0.35, z + BH[k], z + BH[k] + 0.7);
        const ze = z + BH[k] + 0.7;
        roof(g, cx - s, cy - s, cx + s, cy + s, ze, h, { over: ov, lift: 1.25, tiles: k < 4 || true, sp: 0.75, w: 0.85 });
        const nxt = k < 4 ? S[k + 1] : 0; z = ze + h * (1 - nxt / (s + ov)) - 0.05; top = ze + h;
      }
    });
    // the sōrin: a gilded mast, the dew basin, nine rings, the water flame and the jewel
    const b = g.p(cx, cy, top - 0.3), t = g.p(cx, cy, top + 12.5);
    g.fill2([[b[0] - 1.7, b[1]], [b[0] + 1.7, b[1]], [b[0] + 1.4, b[1] - 3.2], [b[0] - 1.4, b[1] - 3.2]], '#5E6478', true);
    g.line2([[b[0], b[1] - 3], t], { w: 1.1, c: '#B08A3A', boil: false });
    for (let i = 0; i < 9; i++) { const p = g.p(cx, cy, top + 2.0 + i * 0.85), rr = 2.5 - i * 0.07; const ring = arcPts(p[0], p[1], rr, 0, TAU, 12).map((q) => [q[0], p[1] + (q[1] - p[1]) * 0.36]); g.fill2(ring, i % 2 ? '#E2BC5A' : GOLD, true); g.line2(ring, { w: 0.3, c: '#7A5A2A', close: true, boil: false }); }
    const fl = g.p(cx, cy, top + 10.6); g.fill2(K.curve([[fl[0] - 2.2, fl[1] + 1.4], [fl[0] - 1.6, fl[1] - 1.6], [fl[0], fl[1] - 3.2], [fl[0] + 1.6, fl[1] - 1.6], [fl[0] + 2.2, fl[1] + 1.4], [fl[0], fl[1] + 0.4]], 2, true), '#E2BC5A', true);
    g.disc2([t[0], t[1] - 0.6], 1.1, GOLD); g.ring2([t[0], t[1] - 0.6], 1.1, { c: '#7A5A2A', w: 0.35 });
    g.glow2('lantern', g.p(cx, cy, top + 5), g.p(cx, cy, 0), { r: 6, col: '#FFD27A' });
  }, { name: 'pagoda' });

  /* ---------------- Asakusa Shrine, east of the hall ---------------- */
  T.obj([21.5, -37, 35, -27.5], function (g) {
    g.lit(LIT, () => {
      K.box(g, 22, -36.5, 34.5, -28.5, 0, 1.0, STONE, { w: 0.7 });
      K.box(g, 23.5, -35.5, 33, -30.2, 1.0, 6.6, { t: '#5A4436', l: '#6E5040', r: '#5A4234' }, { w: 0.75 });
      const s = []; for (let x = 23.5; x <= 33.01; x += 1.9) { const a = g.p(x, -30.15, 1.0), b = g.p(x, -30.15, 6.6); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#2E2420', 0.9);
      g.fill(K.on('L', -30.15, 26.5, 30, 1.0, 5.4), '#E9DCB8'); g.mark({ win: 0.6 });
      const sh = []; for (let x = 26.9; x < 30; x += 0.7) { const a = g.p(x, -30.1, 1.0), b = g.p(x, -30.1, 5.4); sh.push(a[0], a[1], b[0], b[1]); } g.segs2(sh, '#8A6A4A', 0.3);
      g.fill(K.on('L', -30.15, 23.5, 33, 5.8, 6.6), '#C9963E');
      roof(g, 23.5, -35.5, 33, -30.2, 6.6, 5.2, { col: '#6FA38E', tc: '#4F8070', gable: 0.4, over: 1.8, lift: 0.7, ridge: 'x', end: '#C9963E' });
      roof(g, 26, -30.2, 30.5, -28.6, 5.4, 1.2, { col: '#6FA38E', tc: '#4F8070', over: 0.6, lift: 0.4, ridge: 'x', tiles: false, th: 0.3 });   // the porch roof over the steps
    });
  }, { name: 'asakusa shrine' });
  T.obj([25, -23.6, 31, -22.4], (g) => TK.torii(g, 28, -23, { w: 5.6, h: 8.2, axis: 'x', col: '#C9C3B5', top: '#9A9488', r: 0.5 }), { name: 'stone torii', under: 7 });
  for (const [x, s] of [[25.4, 1], [30.6, -1]]) T.obj([x, -24.8], (g) => {   // komainu, the guardian lion-dogs
    K.box(g, x - 0.8, -25.6, x + 0.8, -24, 0, 1.2, STONE, { w: 0.45, nohid: true });
    const f = g.p(x, -24.8, 1.2), P = (u, v) => [f[0] + s * u, f[1] - v];
    const b = K.curve([P(-1.6, 0), P(-1.8, 2.6), P(-0.6, 5.4), P(1.2, 5.6), P(1.9, 4.2), P(1.2, 2.4), P(1.6, 0)], 2, true); g.fill2(b, '#C9C3B5', true); g.line2(b, { w: 0.4, c: '#5A564E', close: true, boil: false });
    g.fill2(K.curve([P(-1.2, 4.4), P(-1.0, 6.4), P(0.6, 6.8), P(1.6, 5.8), P(1.0, 4.4)], 2, true), '#B9B3A5', true);
  }, { name: 'komainu' });

  /* ---------------- Hōzōmon: the inner gate, two storeys ---------------- */
  // Walkers go through its passage, so it stands in parts: the left bay (its storey, Niō and posts) and the right bay, the
  // lanterns hanging in the passage each on their own, and everything above the passage (the beams, the pent roof, the
  // upper storey, the great roof), which { under } puts in front of whoever is in the passage. Drawn in the same order
  // as when it was one drawing.
  { const Y0 = -3.0, Y1 = 2.0, X0 = -5.6, X1 = 9.6, P0 = -1.6, P1 = 5.6;
    T.obj([X0, Y0, P0 + 0.5, Y1], function (g) {
      g.boilP = 0.3;
      g.lit(LIT, () => {
        K.box(g, X0, Y0, P0, Y1, 0, 0.6, STONE, { w: 0.6 });
        post(g, P0, Y0 + 0.4, 0, 10.8, 0.45);                                       // the back post of the passage
        storey(g, X0, Y0 + 0.4, P0, Y1 - 0.4, 0.6, 10.8, { bay: 4 });
        guardian(g, Y1 - 0.35, X0 + 0.5, P0 - 0.5, 0.6, 10.0, 'nio');
        for (const x of [X0, P0]) post(g, x, Y1 - 0.4, 0, 10.8, 0.5);
      });
    }, { name: 'hozomon left' });
    T.obj([A, Y0 + 2.5], (g) => { g.boilP = 0.3; TK.lantern2(g, g.p(A, Y0 + 2.5, 8.6), 7.2, '#C9463E'); }, { name: 'hozomon lantern' });   // clear of the heads under it   // the big red lantern in the passage
    // the two bronze lanterns before the passage
    for (const x of [-0.6, 4.6]) T.obj([x, Y1 - 0.2], function (g) {
      const c = g.p(x, Y1 - 0.2, 8.0), top = g.p(x, Y1 - 0.2, 10.4);   // hung above head height g.line2([top, [c[0], c[1] - 4]], { w: 0.4, c: '#2E2A26', boil: false });
      g.fill2([[c[0] - 2.6, c[1] - 4], [c[0] + 2.6, c[1] - 4], [c[0] + 1.8, c[1] - 5.6], [c[0] - 1.8, c[1] - 5.6]], '#3A3E3A', true);
      g.fill2([[c[0] - 1.9, c[1] - 4], [c[0] + 1.9, c[1] - 4], [c[0] + 1.6, c[1] + 3], [c[0] - 1.6, c[1] + 3]], '#4A524C', true); g.mark({ nc: '#FFD27A', light: true });
      g.fill2([[c[0] - 1.0, c[1] - 3], [c[0] + 1.0, c[1] - 3], [c[0] + 0.9, c[1] + 2], [c[0] - 0.9, c[1] + 2]], '#6E7A64', true);
      g.fill2([[c[0] - 2.2, c[1] + 3], [c[0] + 2.2, c[1] + 3], [c[0] + 1.2, c[1] + 4.4], [c[0] - 1.2, c[1] + 4.4]], '#3A3E3A', true);
      g.glow2('lantern', c, g.p(x, Y1 - 0.2, 0), { r: 4, col: '#FFD27A' });
    }, { name: 'bronze lantern' });
    T.obj([P1 - 0.5, Y0, X1 + 0.5, Y1], function (g) {
      g.boilP = 0.3;
      g.lit(LIT, () => {
        K.box(g, P1, Y0, X1, Y1, 0, 0.6, STONE, { w: 0.6 });
        post(g, P1, Y0 + 0.4, 0, 10.8, 0.45);
        storey(g, P1, Y0 + 0.4, X1, Y1 - 0.4, 0.6, 10.8, { bay: 4 });
        guardian(g, Y1 - 0.35, P1 + 0.5, X1 - 0.5, 0.6, 10.0, 'nio');
        for (const x of [P1, X1]) post(g, x, Y1 - 0.4, 0, 10.8, 0.5);
        post(g, X1, Y0 + 0.4, 0, 10.8, 0.5);
      });
    }, { name: 'hozomon right' });
    T.obj([X0, Y0, X1, Y1], function (g) {
      g.boilP = 0.3;
      g.lit(LIT, () => {
        g.fill(K.on('L', Y0 + 0.4, P0 + 0.4, P1 - 0.4, 10.0, 10.8), VERM.l);
        K.box(g, X0 - 0.3, Y1 - 0.8, X1 + 0.3, Y1 - 0.1, 10.0, 10.8, VERM, { w: 0.6 });                     // the head beam
        roof(g, X0, Y0 + 0.4, X1, Y1 - 0.4, 11.0, 1.6, { over: 1.4, lift: 0.45, tiles: true, sp: 0.75 }); // the pent roof round the lower storey
        storey(g, X0 + 0.8, Y0 + 0.9, X1 - 0.8, Y1 - 0.9, 12.2, 16.6, { bay: 3.4, win: true, door: true });
        const rl = []; for (const [f, p, a0, a1] of [['L', Y1 - 0.4, X0 + 0.2, X1 - 0.2], ['R', X1 - 0.2, Y0 + 0.4, Y1 - 0.4]]) for (let a = a0; a <= a1 + 0.01; a += (a1 - a0) / (f === 'L' ? 14 : 4)) { const q0 = g.p.apply(g, K.pt(f, p, a, 12.2)), q1 = g.p.apply(g, K.pt(f, p, a, 13.1)); rl.push(q0[0], q0[1], q1[0], q1[1]); }
        g.segs2(rl, VERM.l, 0.5); g.line([[X0 + 0.2, Y1 - 0.4, 13.1], [X1 - 0.2, Y1 - 0.4, 13.1], [X1 - 0.2, Y0 + 0.4, 13.1]], { w: 0.6, c: '#8E3029', boil: false });
        brackets(g, X0 + 0.6, Y0 + 0.7, X1 - 0.6, Y1 - 0.7, 16.6, 17.4);
        roof(g, X0 + 0.6, Y0 + 0.7, X1 - 0.6, Y1 - 0.7, 17.4, 7.0, { gable: 0.42, over: 2.2, lift: 1.6, ridge: 'x', th: 0.5 });
      });
    }, { name: 'hozomon top', under: 6, bias: 8 }); }

  /* ---------------- the courtyard: incense burner, chōzuya, omikuji, lanterns ---------------- */
  T.obj([A - 3, -21.2, A + 3, -15.2], function (g) {   // the jōkōro: a bronze cauldron under its own little roof
    const x = A, y = -18.2;
    K.cyl(g, x, y, 2.4, 0, 0.8, STONE, { w: 0.6, n: 12 });
    K.cyl(g, x, y, 2.7, 0.8, 3.4, BRONZE, { w: 0.8, n: 14 });
    K.cyl(g, x, y, 3.0, 3.4, 3.8, { t: '#5A5E52', l: '#8A947C', r: '#6E7864' }, { w: 0.6, n: 14 });
    const s = [], R = RNG(5); for (let i = 0; i < 26; i++) { const a = R() * TAU, d = R() * 2.2, p = g.p(x + Math.cos(a) * d, y + Math.sin(a) * d, 3.8); s.push(p[0], p[1], p[0] + (R() - 0.5) * 0.6, p[1] - 2.2); } g.segs2(s, '#8A6A4A', 0.3);
    for (let i = 0; i < 9; i++) { const a = TAU * i / 9, p = g.p(x + Math.cos(a) * 1.4, y + Math.sin(a) * 1.4, 3.85); g.disc2([p[0], p[1] - 2.2], 0.35, '#E8742A'); g.mark({ nc: '#FF9A4A', light: true }); }
    for (const [dx, dy] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) K.box(g, x + dx - 0.2, y + dy - 0.2, x + dx + 0.2, y + dy + 0.2, 3.8, 6.6, BRONZE, { w: 0.45, nohid: true });
    roof(g, x - 2.2, y - 2.2, x + 2.2, y + 2.2, 6.6, 2.2, { over: 1.0, lift: 0.6, col: '#6E7A64', tc: '#4E5A48', tiles: false, th: 0.25 });
    g.disc2(g.p(x, y, 9.3), 1.0, GOLD);
  }, { name: 'incense burner' });
  T.obj([-23.5, -4.5, -16.5, 1.5], function (g) {   // the chōzuya: a stone basin under a roof, the water dragon in the middle
    const x0 = -23, x1 = -17, y0 = -4, y1 = 1;
    for (const [x, y] of [[x0, y0], [x1, y0], [x0, y1]]) post(g, x + (x === x0 ? 0.3 : -0.3), y + (y === y0 ? 0.3 : -0.3), 0, 7, 0.28, { t: '#A0714B', l: '#8A6A4A', r: '#7A5A3E' });
    K.box(g, x0 + 1, y0 + 1.2, x1 - 1, y1 - 1.2, 0, 1.8, STONE, { w: 0.7 });
    g.fill(K.rect(x0 + 1.3, y0 + 1.5, x1 - 1.3, y1 - 1.5, 1.75), C.water); g.water(K.rect(x0 + 1.3, y0 + 1.5, x1 - 1.3, y1 - 1.5, 1.75), { dens: 1.2 });
    const lad = []; for (let k = 0; k < 6; k++) { const a = g.p(x0 + 1.6 + k * 0.6, y1 - 1.15, 1.85), b = g.p(x0 + 1.6 + k * 0.6 + 0.8, y1 - 0.6, 1.9); lad.push(a[0], a[1], b[0], b[1]); } g.segs2(lad, '#C9A26B', 0.5);
    const d = g.p((x0 + x1) / 2, (y0 + y1) / 2, 1.8); g.fill2(K.curve([[d[0] - 1.6, d[1]], [d[0] - 1.8, d[1] - 4], [d[0] - 0.4, d[1] - 7.4], [d[0] + 1.6, d[1] - 8.4], [d[0] + 2.4, d[1] - 6.8], [d[0] + 0.8, d[1] - 6.0], [d[0] + 1.4, d[1] - 2.6], [d[0] + 1.6, d[1]]], 2, true), '#5E8A72', true);
    g.line2([[d[0] + 2.4, d[1] - 6.6], [d[0] + 3.4, d[1] - 4.2], [d[0] + 3.6, d[1] - 2.4]], { w: 0.4, c: '#BFE0F0', boil: false });
    post(g, x1 - 0.3, y1 - 0.3, 0, 7, 0.28, { t: '#A0714B', l: '#8A6A4A', r: '#7A5A3E' });
    roof(g, x0, y0, x1, y1, 7, 2.8, { gable: 0.4, over: 1.1, lift: 0.6, ridge: 'x', sp: 0.7, th: 0.3 });
  }, { name: 'chozuya' });
  T.obj([10, -23.8, 17, -21.4], function (g) {   // the omikuji stand: a cabinet of a hundred drawers, the shaker boxes on its counter
    const x0 = 10, x1 = 17, yb = -23.8, yf = -22.2;
    K.box(g, x0, yb, x1, yf, 0, 5.6, WOOD, { w: 0.7 });
    const dr = []; for (let r = 0; r < 8; r++) for (let c = 0; c < 12; c++) { const a = g.p(x0 + 0.3 + c * 0.53, yf + 0.03, 1.4 + r * 0.5), b = g.p(x0 + 0.3 + c * 0.53 + 0.4, yf + 0.03, 1.4 + r * 0.5); dr.push(a[0], a[1], b[0], b[1]); } g.segs2(dr, '#6E4A2E', 0.35);
    const kn = []; for (let r = 0; r < 8; r++) for (let c = 0; c < 12; c++) { const p = g.p(x0 + 0.5 + c * 0.53, yf + 0.04, 1.65 + r * 0.5); kn.push(p[0] - 0.15, p[1], p[0] + 0.15, p[1]); } g.segs2(kn, '#E9D3A6', 0.5);
    K.box(g, x0, yf, x1, yf + 0.8, 0, 1.3, WOOD, { w: 0.55 });
    for (const x of [x0 + 1.2, x0 + 3.5, x0 + 5.8]) K.box(g, x - 0.35, yf + 0.15, x + 0.35, yf + 0.55, 1.3, 2.9, { t: '#B9BEC2', l: '#C9CED2', r: '#A9AEB2' }, { w: 0.4, nohid: true });
    roof(g, x0 - 0.2, yb - 0.2, x1 + 0.2, yf + 0.2, 5.6, 1.4, { over: 0.7, lift: 0.3, ridge: 'x', tiles: false, th: 0.25 });
    TK.sign(g, 'L', yf, x0 + 0.6, x1 - 0.6, 5.6, 6.6, '#C9463E', { word: '大吉', ink: '#F6F3EA' });
  }, { name: 'omikuji' });
  T.obj([17.6, -19.4, 21.2, -16.6], function (g) {   // the racks where an unlucky fortune is tied and left behind
    const X0 = 17.9, X1 = 20.9, Y0 = -19.1, Y1 = -16.9;
    const s = []; for (const x of [X0, X1]) for (const y of [Y0, Y1]) { const a = g.p(x, y, 0), b = g.p(x, y, 4.6); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#6E5A44', 0.5);
    const R = RNG(17), sl = [];
    for (const z of [2.2, 3.2, 4.2]) { g.fine([[X0, Y1, z], [X1, Y1, z]], { w: 0.3, c: '#5A4A3C' }); g.fine([[X1, Y1, z], [X1, Y0, z]], { w: 0.3, c: '#5A4A3C' }); for (let k = 0; k < 11; k++) { const p = k < 7 ? g.p(X0 + 0.2 + k * 0.42 + R() * 0.1, Y1, z) : g.p(X1, Y1 - 0.3 - (k - 7) * 0.45, z); sl.push(p[0], p[1] - 0.2, p[0] + 0.1, p[1] + 1.4); } }
    g.segs2(sl, '#FBFAF6', 0.75);
  }, { name: 'fortune racks' });
  for (const [x, y, s] of [[A - 6.8, -22.6, 1.15], [A + 6.8, -21.0, 1.15], [-8.6, -4.2, 1.0], [12.6, -4.2, 1.0], [-8.6, 32.6, 1.1], [12.6, 32.6, 1.1]]) T.obj([x, y], (g) => toro(g, x, y, s), { name: 'toro' });
  // the offering box at the top of the hall's steps (fp a hair longer than the box, so it sorts as a box: at 6 u it was a
  // small prop, in front of the visitors standing before its left half)
  T.obj([A - 3.05, -25.6, A + 3.05, -24.8], (g) => { K.box(g, A - 3, -25.6, A + 3, -24.9, 2.2, 4.0, WOOD, { w: 0.6 }); const s = []; for (let x = A - 2.7; x < A + 3; x += 0.45) { const a = g.p(x, -25.6, 4.02), b = g.p(x, -24.9, 4.02); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#5A3A26', 0.4); const q = K.on('L', -24.85, A - 1.5, A + 1.5, 2.6, 3.6); g.fill(q, '#2E2A26'); g.outline(q, { w: 0.35, c: GOLD, boil: false }); }, { name: 'offering box' });

  /* ---------------- Nakamise ---------------- */
  const NY0 = 3.2, NY1 = 25.6, NN = 6, NW = (NY1 - NY0) / NN;
  const ROW = '#5D6576', garland = TK.autumn() ? ['#D2563D', '#DE7F3A', '#E8C445'] : TK.summer() ? ['#7FB35C', '#5E9E7E', '#9FCFB1'] : TK.winter() ? ['#C9463E', '#F3F1EA', '#E6C24F'] : ['#F2B6C2', '#FBE4E9', '#EBA2B4'];
  // the seasonal decoration hung along Nakamise's eaves: blossom branches in spring, maple leaves in autumn, New Year red and gold
  const deco = (g, f, p, a0, a1, z) => {
    const pts = []; for (let i = 0; i <= 24; i++) { const t = i / 24, sag = 0.35 * Math.abs(Math.sin(t * Math.PI * NN)); pts.push(g.p.apply(g, K.pt(f, p, lerp(a0, a1, t), z - sag))); }
    g.fine2(pts, { w: 0.3, c: '#6E5A44' });
    pts.forEach((q, i) => { if (i % 2) return; g.disc2([q[0], q[1] + 0.6], 0.7, garland[i % 3]); g.mark({ nc: (c) => mix(nightColour(c), c, 0.5) }); });
  };
  const GOODS = {
    dango: (R) => R.pick([['#F2C6D0', '#F6F3EA', '#8FBF73'], ['#C98A4C', '#C98A4C', '#C98A4C']]),
    sweet: (R) => [R.pick(['#F6F3EA', '#C98A4C', '#F2C6D0', '#9FCFB1'])],
    toy: (R) => [R.pick(['#C9463E', '#E6C24F', '#5F8FC9', '#F3F1EA', '#8FBF73'])],
  };
  const FAR = [['だんご', 'dango', '#F6F1E4'], ['甘味', 'sweet', '#C9463E'], ['和菓子', 'sweet', '#2E2A26'], ['浅草', 'toy', '#2E2A26'], ['茶', 'sweet', '#5E8A4A'], ['たいやき', 'sweet', '#F6F1E4']];
  // the west row in two parts, so its keepers (at x = -3, in the open shop fronts) stand between them: the back part (the
  // walls, the lit shop fronts with their shelves, noren and signs) behind them, the front part (the display tables, the
  // awnings and the roof, whose eave hangs in front of their heads) in front of them
  const WX0 = -6.8, WX1 = -1.8, WZT = 7.8;
  const WSHOP = FAR.map(([, kind], i) => { const R = RNG(i * 31 + 7), shelf = [], table = []; for (let k = 0; k < 15; k++) shelf.push(R.pick(['#C9463E', '#E6C24F', '#F3F1EA', '#8FBF73', '#5F8FC9', '#C98A4C', '#D98AA4'])); for (let k = 0; k < 5; k++) table.push(GOODS[kind](R)); return { shelf, table }; });
  T.obj([WX0, NY0, -3.4, NY1], function (g) {
    const x0 = WX0, x1 = WX1, zt = WZT;
    K.box(g, x0, NY0, x1, NY1, 0, zt, WALL, { w: 0.85 });
    g.fill(K.on('R', x1 + 0.01, NY0, NY1, 0, 4.4), '#7A5A44');
    for (let i = 0; i < NN; i++) {
      const a0 = NY0 + i * NW, a1 = a0 + NW, [word, , board] = FAR[i];
      g.fill(K.on('R', x1 + 0.02, a0 + 0.22, a1 - 0.22, 0, 3.9), '#E9C48A');                 // the open shop, lit
      let n = 0; for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) { const p = g.p(x1 + 0.03, a0 + 0.55 + k * (NW - 0.9) / 4, 1.6 + r * 0.8); g.fill2([[p[0] - 0.55, p[1]], [p[0] + 0.55, p[1] - 0.3], [p[0] + 0.55, p[1] - 1.7], [p[0] - 0.55, p[1] - 1.4]], WSHOP[i].shelf[n++], true); }
      if (i !== 0) { const nc = ['', '#F3F1EA', '#2F3F6A', '#7A3B3B', '#3F6B3A', '#2E2A26'][i], ch = ['', '甘', '和', '店', '茶', ''][i]; TK.noren(g, 'R', x1, a0 + 0.35, a1 - 0.35, 2.7, 3.9, nc, { n: 3 }); if (ch) TK.word(g, 'R', x1 + 0.12, (a0 + a1) / 2, 3.3, 0.85, ch, nc === '#F3F1EA' ? '#C9463E' : '#F6F3EA', {}); }
      TK.sign(g, 'R', x1, a0 + 0.25, a1 - 0.25, 4.85, 6.75, board, { word });
      const w = K.on('R', x1 + 0.02, a0 + 0.9, a1 - 0.9, 7.0, 7.6); g.fill(w, '#F6EFD8'); g.mark({ win: 0.7 });
    }
    const dv = []; for (let i = 0; i <= NN; i++) { const a = g.p(x1 + 0.03, NY0 + i * NW, 0), b = g.p(x1 + 0.03, NY0 + i * NW, zt); dv.push(a[0], a[1], b[0], b[1]); } g.segs2(dv, '#5A3A2C', 0.9);
    // the near end of the row, towards the gate: a vending machine against it
    g.fill(K.on('L', NY1 + 0.01, x0 + 0.4, x1 - 0.4, 0, 3.9), '#E9C48A');
    deco(g, 'R', x1 + 0.05, NY0, NY1, zt - 0.05);
  }, { name: 'nakamise west' });
  T.obj([WX1, NY0, -0.1, NY1], function (g) {
    const x0 = WX0, x1 = WX1, zt = WZT;
    for (let i = 0; i < NN; i++) {
      const a0 = NY0 + i * NW, a1 = a0 + NW, [, kind] = FAR[i];
      K.box(g, x1, a0 + 0.3, x1 + 1.0, a1 - 0.3, 0, 1.4, WOOD, { w: 0.45, boil: false });   // the display table
      for (let k = 0; k < 5; k++) {
        const p = g.p(x1 + 0.5, a0 + 0.65 + k * (NW - 1.3) / 4, 1.45), cols = WSHOP[i].table[k];
        if (cols.length === 3) { g.line2([[p[0] - 1.6, p[1] + 0.3], [p[0] + 1.4, p[1] - 0.6]], { w: 0.25, c: '#8A6A4A', boil: false }); cols.forEach((c, j) => g.disc2([p[0] - 0.9 + j * 0.85, p[1] - 0.05 - j * 0.25], 0.55, c)); }
        else if (kind === 'toy') { g.fill2([[p[0] - 0.45, p[1]], [p[0] + 0.45, p[1]], [p[0] + 0.35, p[1] - 1.6], [p[0] - 0.35, p[1] - 1.6]], cols[0], true); g.disc2([p[0], p[1] - 2.0], 0.5, '#F2D3B8'); }
        else { g.disc2(p, 0.85, cols[0]); g.ring2(p, 0.85, { w: 0.25, c: shade(cols[0], 0.45) }); }
      }
      TK.awning(g, 'R', x1, a0 + 0.03, a1 - 0.03, 4.4, 1.7, '#C9463E', { stripe: '#F3F1EA', drop: 0.7 });
    }
    roof(g, x0, NY0, x1, NY1, zt, 2.6, { col: ROW, over: 0.9, lift: 0.3, ridge: 'y', sp: 0.7, th: 0.3 });
  }, { name: 'nakamise west front' });
  T.obj([5.8, NY0, 10.8, NY1], function (g) {   // the east row turns its back to us (one storey, so the street shows over it): back doors, stock
    const x0 = 5.8, x1 = 10.8, zt = 4.8, R = RNG(77);
    K.box(g, x0, NY0, x1, NY1, 0, zt, WALL, { w: 0.85 });
    g.fill(K.on('R', x1 + 0.01, NY0, NY1, 0, 3.9), '#8A6E58');
    for (let i = 0; i < NN; i++) {
      const a0 = NY0 + i * NW, a1 = a0 + NW;
      if (i % 2 === 0) { const d = K.on('R', x1 + 0.02, a0 + 0.5, a0 + 1.6, 0, 3.2); g.fill(d, i === 2 ? '#E9C48A' : '#5A4436'); g.outline(d, { w: 0.35, c: '#3A2A22', boil: false }); K.win(g, 'R', x1, a0 + 2.1, a1 - 0.5, 1.6, 3.2, { style: 'glass' }); }
      else { const sh = K.on('R', x1 + 0.02, a0 + 0.4, a1 - 0.4, 0, 3.4); g.fill(sh, '#B9B6AD'); const s = []; for (let z = 0.4; z < 3.4; z += 0.4) { const a = g.p(x1 + 0.03, a0 + 0.4, z), b = g.p(x1 + 0.03, a1 - 0.4, z); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#8E8A80', 0.3); g.outline(sh, { w: 0.35, c: '#5A564E', boil: false }); }
    }
    g.fill(K.on('R', x1 + 0.03, NY0, NY1, 3.7, 4.1), '#6E5444');
    for (let k = 0; k < 7; k++) { const y = NY0 + 1 + R() * (NY1 - 2), x = x1 + 0.5 + R() * 0.6; K.box(g, x - 0.5, y - 0.6, x + 0.5, y + 0.6, 0, 0.7 + (k % 3) * 0.35, k % 2 ? { t: '#D9C9A8', l: '#C9B48F', r: '#B5A07C' } : { t: '#7FB7D9', l: '#6E9FC0', r: '#5F8BAA' }, { w: 0.4, nohid: true }); }
    g.fill(K.on('L', NY1 + 0.01, x0 + 0.5, x1 - 0.5, 0, 3.6), '#B9B6AD');
    roof(g, x0, NY0, x1, NY1, zt, 1.8, { col: ROW, over: 0.7, lift: 0.25, ridge: 'y', sp: 0.7, th: 0.3 });
    for (let i = 0; i < NN; i += 2) { const y = NY0 + (i + 0.5) * NW, c = g.p(x1 + 0.8, y, 6.0); K.box(g, x1 - 1.6, y - 0.7, x1 - 0.4, y + 0.7, 5.0, 6.0, { t: '#E9E6DE', l: '#F1EFE8', r: '#D9D6CE' }, { w: 0.4, nohid: true }); void c; }   // the air-conditioner units on the roof
  }, { name: 'nakamise east' });
  // things parked in the back lane, apart so people can pass behind them
  // a parked bicycle (no rider): two wheels, the frame, a basket
  const bike = (g, x, y, col) => {
    const P = (u, z) => g.p(x + u * 0.12, y + u, z), wh = (u) => { const pts = []; for (let i = 0; i < 18; i++) { const t = TAU * i / 18; pts.push(g.p(x + u * 0.12, y + u + Math.cos(t) * 1.4, 1.4 + Math.sin(t) * 1.4)); } g.line2(pts, { w: 0.7, c: '#3A3632', close: true, boil: false }); };
    wh(-2.2); wh(2.2); const a = P(-2.2, 1.4), b = P(2.2, 1.4), s = P(-0.7, 3.6), h = P(1.7, 3.9), m = P(0, 1.5);
    g.segs2([a[0], a[1], s[0], s[1], s[0], s[1], m[0], m[1], m[0], m[1], h[0], h[1], h[0], h[1], b[0], b[1], a[0], a[1], m[0], m[1], s[0], s[1], h[0], h[1]], col, 0.6);
    const bk = P(2.4, 3.6); g.fill2([[bk[0] - 1.3, bk[1] - 0.6], [bk[0] + 1.3, bk[1] - 0.6], [bk[0] + 1.0, bk[1] + 1.4], [bk[0] - 1.0, bk[1] + 1.4]], '#9A9384', true);
    g.line2([[s[0] - 0.8, s[1]], [s[0] + 0.6, s[1]]], { w: 0.9, c: '#3A3632', boil: false });
  };
  T.obj([11.5, 7.6, 13.0, 14.7], (g) => { bike(g, 11.9, 10.0, '#C9584B'); bike(g, 12.6, 12.2, '#3F5F8F'); }, { name: 'bikes' });
  T.obj([12.0, 18.0], (g) => TK.vend(g, 12.0, 18.0, { face: 'R', col: '#F1EFE8', top: '#C9463E' }), { name: 'vending' });   // clear of the stock crates

  /* ---------------- Kaminarimon ---------------- */
  // in parts like the Hōzōmon, as walkers go through it: the left bay (Raijin), the giant lantern, the right bay (Fūjin),
  // and the beams and roof over the passage
  { const Y0 = 26.8, Y1 = 31.4, X0 = -5.2, X1 = 9.2, P0 = -1.6, P1 = 5.6, ZB = 12.6;
    T.obj([X0, Y0, P0 + 0.5, Y1], function (g) {
      g.boilP = 0.35;
      g.lit(LIT, () => {
        K.box(g, X0, Y0, P0, Y1, 0, 0.6, STONE, { w: 0.6 });
        post(g, P0, Y0 + 0.4, 0, ZB, 0.45);
        storey(g, X0, Y0 + 0.4, P0, Y1 - 0.4, 0.6, ZB, { bay: 4 });
        guardian(g, Y1 - 0.35, X0 + 0.4, P0 - 0.4, 0.6, ZB - 0.8, 'thunder');   // Raijin, on the left as you face the gate
        for (const x of [X0, P0]) post(g, x, Y1 - 0.4, 0, ZB, 0.5);
      });
    }, { name: 'kaminarimon left' });
    // the giant lantern in the passage, 雷門 written down it; the head beam in front hides its top
    T.obj([A, Y0 + 3.0], function (g) {
      g.boilP = 0.35;
      const L = g.p(A, Y0 + 3.0, 9.8), r = 8.4;   // high enough for people to walk under it (its top behind the head beam)
      g.line2([g.p(A, Y0 + 3.0, ZB), [L[0], L[1] - r]], { w: 0.8, c: '#2A2622', boil: false });
      TK.lantern2(g, L, r, '#CF3F34');
      g.fill2([[L[0] - 5.4, L[1] + r - 1.0], [L[0] + 5.4, L[1] + r - 1.0], [L[0] + 4.4, L[1] + r + 1.9], [L[0] - 4.4, L[1] + r + 1.9]], '#2A2622', true);   // the carved base ring
      g.fill2([[L[0] - 4.4, L[1] - r - 1.3], [L[0] + 4.4, L[1] - r - 1.3], [L[0] + 5.4, L[1] - r + 1.0], [L[0] - 5.4, L[1] - r + 1.0]], '#2A2622', true);
      TK.word2(g, [L[0] - 0.2, L[1] + 0.8], 5.6, '雷門', '#241E1C', { vert: true, w: 1.0 });
    }, { name: 'kaminarimon lantern' });
    T.obj([P1 - 0.5, Y0, X1 + 0.5, Y1], function (g) {
      g.boilP = 0.35;
      g.lit(LIT, () => {
        K.box(g, P1, Y0, X1, Y1, 0, 0.6, STONE, { w: 0.6 });
        post(g, P1, Y0 + 0.4, 0, ZB, 0.45);
        storey(g, P1, Y0 + 0.4, X1, Y1 - 0.4, 0.6, ZB, { bay: 4 });
        guardian(g, Y1 - 0.35, P1 + 0.4, X1 - 0.4, 0.6, ZB - 0.8, 'wind');      // Fūjin, on the right
        for (const x of [P1, X1]) post(g, x, Y1 - 0.4, 0, ZB, 0.5);
        post(g, X1, Y0 + 0.4, 0, ZB, 0.5);
      });
    }, { name: 'kaminarimon right' });
    T.obj([X0, Y0, X1, Y1], function (g) {
      g.boilP = 0.35;
      g.lit(LIT, () => {
        g.fill(K.on('L', Y0 + 0.4, P0 + 0.4, P1 - 0.4, ZB - 0.8, ZB), VERM.l);
        K.box(g, X0 - 0.3, Y1 - 0.85, X1 + 0.3, Y1 - 0.05, ZB - 0.9, ZB, VERM, { w: 0.6 });
        brackets(g, X0 - 0.2, Y0 + 0.2, X1 + 0.2, Y1 - 0.2, ZB, ZB + 0.9);
        roof(g, X0 - 0.2, Y0 + 0.2, X1 + 0.2, Y1 - 0.2, ZB + 0.9, 6.2, { gable: 0.42, over: 2.0, lift: 1.1, ridge: 'x', th: 0.45 });
      });
    }, { name: 'kaminarimon top', under: 5.5, bias: 8 }); }


  /* ---------------- shops along the east street, facing it ---------------- */
  const EAST = [['そば', '#2E2A26', '#3F4D63'], ['天', '#F6F1E4', '#C9463E'], ['喫茶', '#5E8A4A', '#F3F1EA'], ['寿司', '#2E2A26', '#F3F1EA'], ['和菓子', '#C9463E', '#E9D9B0']];
  T.obj([30.5, 9.5, 36.9, 31.5], function (g) {   // (the fp reaches out to the lanterns hanging at the shop fronts)
    const x0 = 30.5, x1 = 36.5, n = EAST.length, w = (31.5 - 9.5) / n;
    for (let i = 0; i < n; i++) {
      const y0 = 9.5 + i * w, y1 = y0 + w, [word, board, noren] = EAST[i], zt = i % 2 ? 7.4 : 6.6;
      K.box(g, x0, y0, x1, y1, 0, zt, i % 2 ? { t: '#E9E2D2', l: '#EFE9DB', r: '#DCD3BF' } : WALL, { w: 0.8 });
      g.fill(K.on('R', x1 + 0.01, y0, y1, 0, 3.6), '#6E5444');
      const op = K.on('R', x1 + 0.02, y0 + 0.5, y1 - 0.5, 0, 3.2); g.fill(op, '#E9C48A');
      TK.noren(g, 'R', x1, y0 + 0.7, y1 - 0.7, 2.1, 3.2, noren, { n: 3 });
      TK.word(g, 'R', x1 + 0.05, (y0 + y1) / 2, 2.65, 0.75, word.length > 2 ? word.slice(0, 2) : word, shade(noren, 0.05) === noren ? '#F6F3EA' : (hex2rgb(noren).reduce((a, b) => a + b) > 420 ? '#3A3128' : '#F6F3EA'));
      TK.sign(g, 'R', x1, y0 + 0.5, y1 - 0.5, 4.1, 5.6, board, { word });
      K.win(g, 'R', x1, y0 + 1.0, y1 - 1.0, 5.9, zt - 0.4, { style: 'glass' });
      roof(g, x0, y0, x1, y1, zt, 1.8, { col: '#5D6576', over: 0.6, lift: 0.2, ridge: 'y', sp: 0.7, th: 0.25 });
      const l = g.p(x1 + 0.4, y0 + 0.5, 3.8); TK.lantern2(g, [l[0], l[1] + 1.6], 1.4, i % 2 ? '#C9463E' : '#F6F1E4');
    }
  }, { name: 'east shops' });
  for (const [x, y] of [[29.4, 12.2], [29.4, 25.8]]) T.obj([x, y], (g) => { K.box(g, x - 0.7, y - 0.7, x + 0.7, y + 0.7, 0, 1.4, { t: '#8A6A4A', l: '#A07C4C', r: '#8A6A4A' }, { w: 0.45, nohid: true }); K.bush(g, x, y, { r: 1.2, z: 1.4, col: '#6E9A50' }); }, { name: 'planter' });
  T.obj([28.4, 18.6 - 3.05, 30.4, 18.6 + 3.05], (g) => K.bench(g, 28.6, 18.6, { face: 'R', L: 1.8, col: '#C9A26B' }), { name: 'bench' });   // fp: the bench, lengthened to sort as a box


  /* a kimono rental shop by the gate: the kimono on stands behind the glass, a sign in English for visitors */
  T.obj([16, 23.4, 27, 29.8], function (g) {   // (the fp reaches out to the nobori flags in front of it)
    const x0 = 16, x1 = 27, y0 = 23.4, y1 = 29;
    K.box(g, x0, y0, x1, y1, 0, 7.0, { t: '#E9E2D2', l: '#F3EEE2', r: '#DCD3BF' }, { w: 0.85 });
    g.fill(K.on('L', y1 + 0.01, x0, x1, 0, 3.8), '#7A5A44');
    const gl = K.on('L', y1 + 0.02, x0 + 0.5, x1 - 3.2, 0.3, 3.6); g.fill(gl, '#E9C48A');
    const R = RNG(31); for (let k = 0; k < 6; k++) { const c = g.p(x0 + 1.3 + k * 1.15, y1 + 0.03, 0.4), col = R.pick(['#E79AAE', '#8FB7D9', '#F0E4C0', '#C9A0D9', '#E9C46A', '#9FCFB1', '#E07A6A']); g.fill2([[c[0] - 1.3, c[1]], [c[0] + 1.3, c[1]], [c[0] + 1.0, c[1] - 7.0], [c[0] + 1.6, c[1] - 8.4], [c[0] - 1.6, c[1] - 8.4], [c[0] - 1.0, c[1] - 7.0]], col, true); g.fill2([[c[0] - 1.1, c[1] - 4.4], [c[0] + 1.1, c[1] - 4.4], [c[0] + 1.1, c[1] - 5.4], [c[0] - 1.1, c[1] - 5.4]], R.pick(['#C9463E', '#E6C24F', '#3F5F8F']), true); }
    g.outline(gl, { w: 0.45, c: '#3A3128', boil: false });
    const d = K.on('L', y1 + 0.02, x1 - 2.8, x1 - 0.6, 0, 3.4); g.fill(d, '#3A2E26');
    TK.noren(g, 'L', y1, x1 - 2.8, x1 - 0.6, 2.2, 3.4, '#3F4D63', { n: 2 });
    K.sign(g, 'L', y1, x0 + 0.6, x1 - 0.6, 4.4, 5.8, '#F6F1E4', 'KIMONO RENTAL', { w: 0.45 });
    K.win(g, 'L', y1, x0 + 1.0, x0 + 4.2, 6.0, 6.8, { style: 'glass' }); K.win(g, 'L', y1, x0 + 6.0, x1 - 1.0, 6.0, 6.8, { style: 'glass' });
    K.win(g, 'R', x1, y0 + 1.0, y1 - 1.0, 4.4, 6.4, { style: 'glass' });
    roof(g, x0, y0, x1, y1, 7.0, 2.2, { col: '#5D6576', over: 0.7, lift: 0.25, ridge: 'x', sp: 0.7, th: 0.3 });
    for (const x of [x0 + 0.8, x1 - 1.4]) { const p = g.p(x, y1 + 0.6, 0); g.line2([p, [p[0], p[1] - 22]], { w: 0.45, c: '#5A4A3C', boil: false }); const f = [[p[0], p[1] - 21.6], [p[0] + 3.2, p[1] - 21.6], [p[0] + 3.2, p[1] - 6], [p[0], p[1] - 6]]; g.fill2(f, x < x1 - 2 ? '#C9463E' : '#3F7FC0', true); g.outline2(f, { w: 0.3, boil: false }); }   // nobori flags
  }, { name: 'kimono rental' });

  /* ---------------- Bentenyama's bell ---------------- */
  T.obj([21, 2.5, 27, 8.5], function (g) {
    const x0 = 21.5, y0 = 3, x1 = 26.5, y1 = 8;
    K.box(g, x0 - 0.5, y0 - 0.5, x1 + 0.5, y1 + 0.5, 0, 1.2, STONE, { w: 0.7 });
    const s = []; for (let x = x0; x < x1 + 0.4; x += 1.2) { const a = g.p(x, y1 + 0.52, 0), b = g.p(x, y1 + 0.52, 1.2); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#A9A395', 0.3);
    g.lit(LIT, () => {
      for (const [x, y] of [[x0, y0], [x1, y0], [x0, y1]]) post(g, x, y, 1.2, 9, 0.32);
      g.fill(K.on('L', y1, x0, x1, 8.2, 9), VERM.l); g.fill(K.on('R', x1, y0, y1, 8.2, 9), VERM.r);
    });
    // the bell
    const c = g.p(24, 5.5, 4.0), bell = [[c[0] - 3.2, c[1]], [c[0] + 3.2, c[1]], [c[0] + 2.7, c[1] - 2.5], [c[0] + 2.4, c[1] - 11], [c[0] + 1.6, c[1] - 12.4], [c[0] - 1.6, c[1] - 12.4], [c[0] - 2.4, c[1] - 11], [c[0] - 2.7, c[1] - 2.5]];
    g.fill2(bell, '#5E7A6A', true); g.fill2([bell[1], bell[2], bell[3], bell[4], [c[0] + 0.6, c[1] - 12.4], [c[0] + 0.6, c[1]]], '#4E6858', true); g.outline2(bell, { w: 0.55, c: '#2E3A32' });
    const bs = []; for (const v of [-4, -7.5, -10]) bs.push(c[0] - 2.6, c[1] + v, c[0] + 2.6, c[1] + v); g.segs2(bs, '#3E5246', 0.35);
    g.disc2([c[0] - 0.9, c[1] - 3.2], 0.8, '#7E9A88');
    g.lit(LIT, () => { post(g, x1, y1, 1.2, 9, 0.32); roof(g, x0, y0, x1, y1, 9, 3.6, { gable: 0.42, over: 1.4, lift: 0.7, ridge: 'x', sp: 0.7, th: 0.3 }); });
  }, { name: 'bell tower' });

  /* ---------------- trees ---------------- */
  for (const [x, y, r] of [[-34, 2, 4.4], [-33, 27, 4.2], [-12, 6.5, 3.6], [18.5, 11.5, 4.2], [-33.5, 32.8, 3.6], [33.5, 32.8, 3.4], [28.5, -10, 4.0]]) T.obj([x, y], (g) => TK.sakura(g, x, y, { r }), { on: true });
  for (const [x, y, r, kind, i] of [[-16.5, -33, 4.6, 'ginkgo', 0], [-33.5, -31, 4.4, 'ginkgo', 0], [-34, -20, 4.0, 'zelkova', 1], [33.5, -22, 3.8, 'ginkgo', 0], [-30, 31, 3.6, 'maple', 0], [-13, 31.5, 3.2, 'maple', 2], [30, 1, 3.6, 'zelkova', 0]]) T.obj([x, y], (g) => K.tree(g, x, y, TK.leaves({ r, h: 5.4, col: '#6E9A50', ink: '#4B6B36' }, kind, i)), { on: true });   // the old ginkgo by the hall survived the 1945 fire
  for (const [x, y] of [[-29, 4.5], [-12.5, 26.5]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.4, h: 4.2, col: '#4F7A4A', ink: '#2F4A2C' }), { on: true });   // garden pines

  /* ---------------- the living layer ---------------- */
  const route = (pts, open) => { const seg = [], L = [0], n = open ? pts.length - 1 : pts.length; for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); } return { seg, L, total: L[L.length - 1] }; };
  const at = (R, d) => { let i = 0; while (i < R.seg.length - 1 && d > R.L[i + 1]) i++; const [a, b] = R.seg[i], u = (d - R.L[i]) / ((R.L[i + 1] - R.L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1]; return { x: a[0] + dx * u, y: a[1] + dy * u, dir: Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3) }; };
  // someone walking a route who stops on the way: stops [[distance, [[act, secs], ...], facing], ...]; z(x, y): the
  // height of the ground under them (the hall's steps)
  const pilgrim = (who, pts, speed, stops, o) => {
    o = o || {}; const R = route(pts), ev = []; let t = 0, d = 0;
    for (const [sd, acts, face] of stops) { t += (sd - d) / speed; const secs = acts.reduce((s, q) => s + q[1], 0); ev.push({ t0: t, t1: t + secs, d: sd, acts, face }); t += secs; d = sd; }
    const period = t + (R.total - d) / speed;
    return T.actor({ sample: 0.25, period, season: o.season, r: 14,
      at(tt) {
        tt = ((tt + (o.phase || 0) * period) % period + period) % period;
        let dd = null, tp = 0, dp = 0;
        for (const e of ev) {
          if (tt < e.t0) { dd = dp + (tt - tp) * speed; break; }
          if (tt < e.t1) { const p = at(R, e.d); let s = e.t0, k = 0; while (k < e.acts.length - 1 && tt >= s + e.acts[k][1]) { s += e.acts[k][1]; k++; } const a = e.acts[k][0], A2 = typeof a === 'string' ? TK.ACTS[a] : a, i = Math.floor((tt - s) * A2.rate) % A2.n; return { x: p.x, y: p.y, z: o.z ? o.z(p.x, p.y) : 0, key: ev.indexOf(e) + '.' + k + '.' + i, a, i, dir: e.face }; }
          tp = e.t1; dp = e.d;
        }
        if (dd == null) dd = dp + (tt - tp) * speed;
        const p = at(R, dd % R.total), ph = Math.floor((dd / 2.4) % 1 * 8);
        return { x: p.x, y: p.y, z: o.z ? o.z(p.x, p.y) : 0, key: 'w' + p.dir + '.' + ph, dir: p.dir, ph: ph / 8 };
      },
      draw(g, st) { if (typeof st.a === 'string') TK.doing(g, Object.assign({}, who, { dir: st.dir }), st.a, st.i); else if (st.a) { const r = TK.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir }, st.a.f(st.i))); if (st.a.extra) st.a.extra(g, r, st.i); } else TK.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
  };
  // a person in one place going through a round of acts: seq [[act, secs, dir], ...]; an act is a TK.ACTS name or
  // { n, rate, f(i) -> pose overrides, extra(g, r, i) }
  const busy = (who, x, y, seq, o) => {
    o = o || {}; const period = seq.reduce((s, q) => s + q[1], 0);
    return T.actor({ sample: 0.25, period, season: o.season, r: o.r || 12,
      at(t) { t = ((t + (o.off || 0)) % period + period) % period; let k = 0, s = 0; while (k < seq.length - 1 && t >= s + seq[k][1]) { s += seq[k][1]; k++; } const a = seq[k][0], A2 = typeof a === 'string' ? TK.ACTS[a] : a, i = Math.floor((t - s) * A2.rate) % A2.n; return { x, y, z: (o.z || 0) + (A2.z ? A2.z[i] : 0), key: k + '.' + i, k, i }; },
      draw(g, st) { const [a, , dir] = seq[st.k], w = Object.assign({}, who, dir == null ? {} : { dir }); if (typeof a === 'string') TK.doing(g, w, a, st.i); else { const r = TK.person(g, 0, 0, 0, Object.assign(w, a.f(st.i))); if (a.extra) a.extra(g, r, st.i); } if (o.after) o.after(g); } });
  };
  const u0 = (k) => (k % 3) / 2;
  const WAFT = { n: 2, rate: 1.5, f: (i) => ({ lean: 0.5, hands: i ? [[0.8, -18.6], [1.7, -19.0]] : [[3.8, -13.4], [4.5, -12.6]] }) };
  const SLIP = (g, h) => g.fill2([[h[0] - 0.4, h[1] - 1.8], [h[0] + 0.5, h[1] - 1.8], [h[0] + 0.5, h[1] + 0.4], [h[0] - 0.4, h[1] + 0.4]], '#FBFAF6', true);
  const SHAKE = { n: 2, rate: 3, f: (i) => ({ hands: [[2.2, -13.2 - i * 1.2], [2.8, -13.6 - i * 1.2]] }), extra: (g, r) => { const h = r.hands[0]; g.fill2([[h[0] - 0.6, h[1] - 3.6], [h[0] + 0.7, h[1] - 3.6], [h[0] + 0.7, h[1] + 0.6], [h[0] - 0.6, h[1] + 0.6]], '#C9CED2', true); g.outline2([[h[0] - 0.6, h[1] - 3.6], [h[0] + 0.7, h[1] - 3.6], [h[0] + 0.7, h[1] + 0.6], [h[0] - 0.6, h[1] + 0.6]], { w: 0.3, c: '#5A564E', boil: false }); } };
  const READ = { n: 1, rate: 1, f: () => ({ hands: [[1.4, -14.6], [2.4, -14.8]] }), extra: (g, r) => SLIP(g, [(r.hands[0][0] + r.hands[1][0]) / 2, r.hands[0][1] - 0.4]) };
  const TIE = { n: 2, rate: 2, f: (i) => ({ hands: [[3.0, -17.4 + i * 0.4], [3.6, -17.0 - i * 0.4]] }), extra: (g, r) => SLIP(g, r.hands[1]) };

  // worshippers at the incense burner: wafting the smoke over themselves, then praying
  [[A - 3.3, -18.8, 0, 1, 0], [A + 3.7, -17.6, 2, 3, 5.1], [A + 2.4, -14.6, 3, 4, 1.4], [A - 1.4, -14.9, 3, 2, 3.3]].forEach(([x, y, dir, k, off]) =>
    busy((k % 2 ? TK.who : TK.kimono)(1100 + k, { dir }), x, y, [[WAFT, 4.4 + k * 0.6], ['pray', 3.2], ['look', 2.4 + k * 0.5]], { off }));
  // the smoke: wisps rising and leaning with the breeze
  T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 4) % 8; return { x: A + 0.01, y: -18.21, z: 8.6, key: 's' + f, f }; },
    draw(g, st) {   // thin threads of smoke that curl up, part and drift off with the breeze, with a few loose curls above
      const o = g.p(0, 0, 0), ph = st.f / 8;
      for (let k = 0; k < 5; k++) {
        const pts = []; const len = 22 + (k % 3) * 6;
        for (let i = 0; i <= 16; i++) { const u = i / 16, y = o[1] + 1 - u * len, x = o[0] + (k - 2) * 0.8 + Math.sin(u * 7.5 - ph * TAU + k * 1.7) * (0.4 + u * 2.6) + u * u * (6 + k); pts.push([x, y]); }
        g.line2(pts, { w: 0.9 - u0(k) * 0.3, c: k % 2 ? '#D2CCC0' : '#C3BCAE', boil: false });
      }
      for (let k = 0; k < 3; k++) { const u = ((ph + k / 3) % 1), c = [o[0] + 7 + u * 8 + Math.sin(u * 6 + k) * 2, o[1] - 24 - u * 14], r = 1.0 + u * 1.8; g.line2(arcPts(c[0], c[1], r, 0.3 + k, 0.3 + k + 4.4, 10).map((q) => [q[0], c[1] + (q[1] - c[1]) * 0.55]), { w: 0.6 - u * 0.3, c: '#CFC8BB', boil: false }); }
    } });
  // an omikuji drawn: shake the box, take the slip from its drawer, read it, tie it to the rack
  busy(TK.kimono(1121, { dir: 3 }), 15.2, -20.0, [[SHAKE, 2.8, 3], [{ n: 1, rate: 1, f: () => ({ hands: [[2.4, -19.2], [1.2, -10.2]] }) }, 1.4, 3], [READ, 3.4, 1], ['laugh', 1.2, 1], [TIE, 2.6, 0], ['look', 2.0, 1]], { off: 0 });
  busy(TK.who(1122, { dir: 3 }), 12.2, -19.8, [['look', 2.0, 1], [SHAKE, 2.6, 3], [READ, 3.6, 1], ['point', 1.5, 1], [TIE, 2.8, 0]], { off: 4.4 });
  // visitors at the hall: a coin into the box, two bows, a prayer, a bow
  [[A - 1.4, -24.5, 1131, 0], [A + 1.4, -24.5, 1132, 3.3], [A + 4.2, -24.5, 1133, 6.1]].forEach(([x, y, s, off]) =>
    busy((s % 2 ? TK.who : TK.kimono)(s, { dir: 3 }), x, y, [[{ n: 1, rate: 1, f: () => ({ hands: [[1.2, -9.8], [3.6, -14.8]] }) }, 1.0], ['bow', 1.4], ['rest', 0.4], ['bow', 1.4], ['pray', 3.6], ['bow', 1.4], ['look', 2.6]], { off, z: 2.2 }));
  // washing hands at the chōzuya
  busy(TK.who(1141, { dir: 3 }), -20.2, 2.2, [[{ n: 2, rate: 0.8, f: (i) => ({ lean: 0.8, hands: i ? [[2.0, -12.0], [3.0, -13.6]] : [[3.4, -12.2], [2.2, -11.4]] }) }, 4.2], ['look', 2.0]], { off: 1.2 });
  // the dango shop hands a skewer over its table; the customer eats it, then the next one is grilled
  { const vend = TK.who(1151, { dir: 0, top: '#F3F1EA', bot: '#2E2A26', cap: undefined, hairStyle: 'short', apron: true }), cust = TK.kimono(1152, { dir: 2 });
    const DANGO = (g, h) => { g.line2([[h[0], h[1] + 0.6], [h[0] + 0.3, h[1] - 3.6]], { w: 0.25, c: '#8A6A4A', boil: false }); ['#8FBF73', '#F6F3EA', '#F2C6D0'].forEach((c, j) => g.disc2([h[0] + 0.05 * j, h[1] - 0.9 - j * 0.95], 0.55, c)); };
    // two actors on one clock: the vendor in the open shop front (between the row's back and its table), the customer out
    // in the lane in front of the table (the row's own table, with its dango, is the one between them)
    const DY = NY0 + 0.5 * NW, PH = (t) => { t = ((t % 12) + 12) % 12; const k = t < 3.4 ? 0 : t < 4.8 ? 1 : t < 9.6 ? 2 : 3, i = k === 0 ? Math.floor(t * 2) % 2 : k === 2 ? Math.floor(t * 1.4) % 2 : 0; return { key: k + '.' + i, k, i }; };
    T.actor({ sample: 0.25, period: 12, r: 12,
      at(t) { return Object.assign({ x: -3.0, y: DY - 0.3 }, PH(t)); },
      draw(g, st) {
        const vh = st.k === 0 ? [[2.2, -11.6 + st.i * 0.4], [3.2, -11.0]] : st.k === 1 ? [[1.2, -10], [5.2, -13.8]] : null;
        const rv = TK.person(g, 0, 0, 0, Object.assign({}, vend, vh ? { hands: vh } : {}));
        if (st.k === 0) DANGO(g, rv.hands[1]); if (st.k === 1) DANGO(g, rv.hands[0][1] < rv.hands[1][1] ? rv.hands[0] : rv.hands[1]);
      } });
    T.actor({ sample: 0.25, period: 12, r: 12,
      at(t) { return Object.assign({ x: -0.05, y: DY }, PH(t)); },
      draw(g, st) {
        let rc;
        if (st.k === 1) rc = TK.person(g, 0, 0, 0, Object.assign({}, cust, { dir: 2, hands: [[1.2, -10], [4.2, -13.6]] }));
        else if (st.k === 2) rc = TK.doing(g, Object.assign({}, cust, { dir: 1 }), 'eat', st.i);
        else rc = TK.doing(g, Object.assign({}, cust, { dir: st.k === 3 ? 1 : 2 }), st.k === 3 ? 'talk' : 'look', 0);
        if (st.k === 2) { const h = rc.hands[0][1] < rc.hands[1][1] ? rc.hands[0] : rc.hands[1]; DANGO(g, [h[0] + 0.3, h[1] + (st.i ? 1.6 : 0)]); }
      } }); }
  // shopkeepers in the open shops along the west row (behind the row's front part: its tables, awnings and roof)
  [[1, 1161], [2, 1162], [4, 1163]].forEach(([n, s], i) => { const y = NY0 + (n + 0.5) * NW;
    busy(TK.who(s, { dir: 0, top: i % 2 ? '#3F5F8F' : '#F3F1EA' }), -3.0, y, [['rest', 2.2], ['talk', 3.0], ['look', 2.4], ['point', 1.6], ['wave', 1.4]], { off: i * 2.3 }); });
  // friends in rented kimono photographing each other in front of the Thunder Gate
  TK.photo(T, { who: TK.kimono(1171, { dir: 3 }), x: -3.0, y: 33.6 }, [{ who: TK.kimono(1172, { dir: 1 }), x: -5.2, y: 32.2 }, { who: TK.kimono(1173, { dir: 1 }), x: -3.4, y: 31.9 }, { who: TK.who(1174, { dir: 1 }), x: -7.0, y: 32.5 }], { seed: 1 });
  TK.photo(T, { who: TK.who(1175, { dir: 2, cap: '#E6C24F' }), x: 15.6, y: 32.6 }, [{ who: TK.kimono(1176, { dir: 0 }), x: 11.2, y: 31.8 }, { who: TK.kimono(1177, { dir: 0 }), x: 11.0, y: 33.4 }], { seed: 4, pause: 5 });
  // a monk strikes the bell now and then; the log swings back
  // (he stands at his feet, on the platform's edge; he used to stand 0.5 out past it, in the air; the log and its ropes
  // hang where they did)
  { const monk = TK.who(1181, { dir: 2, top: '#2E2A26', dress: '#2E2A26', sleeve: '#2E2A26', hairStyle: 'bald', hair: '#C9A07A', glasses: false, cap: undefined, muffler: undefined, higasa: undefined, uchiwa: undefined });
    const MX = 26.7, MY = 6.1, LX = 26.9 - MX, LY = 5.7 - MY;    // his feet; the log's old origin, from them
    T.actor({ sample: 0.1, period: 14, r: 16,
      at(t) { t = ((t % 14) + 14) % 14; const sw = t < 1.2 ? -t / 1.2 : t < 1.5 ? -1 + (t - 1.2) / 0.3 * 1.4 : t < 3 ? 0.4 * (1 - (t - 1.5) / 1.5) : 0, k = Math.round(sw * 5) / 5, ring = t > 1.45 && t < 5 ? Math.floor((t - 1.45) * 3) : -1; return { x: MX, y: MY, z: 1.2, key: k + '.' + ring, sw: k, ring }; },
      draw(g, st) {
        const b = g.p(LX - 0.9, LY - 0.2, 6.0), e = g.p(LX - 0.9 + 3.0 + st.sw * 1.4, LY - 0.2, 6.0 + Math.max(0, -st.sw) * 0.4);
        TK.person(g, 0, 0, 0, Object.assign({}, monk, { hands: [[1.6 - st.sw * 1.2, -15.4], [2.4 - st.sw * 1.2, -15.8]] }));
        g.line2([[b[0] - 2, b[1] - 11], b], { w: 0.3, c: '#C9B48F', boil: false }); g.line2([[e[0] - 0.4, e[1] - 11], e], { w: 0.3, c: '#C9B48F', boil: false });
        g.line2([[b[0] - 2.8, b[1]], e], { w: 1.4, c: '#B58F58', boil: false });
        if (st.ring >= 0) { const c = g.p(LX - 2.9, LY - 0.2, 7.4); for (let k = 0; k < 2; k++) { const rr = 4 + (st.ring + k * 4) * 1.6; g.line2(arcPts(c[0], c[1], rr, -2.4, -0.7, 8), { w: 0.35, c: '#8C8576', boil: false }); } }
      } }); }
  // a rickshaw puller waiting by the gate, chatting with a couple about a ride; the rickshaws running past
  TK.group(T, [{ who: TK.who(1191, { dir: 1, top: '#2E2A26', bot: '#2E2A26', bare: true, hairStyle: 'short', cap: undefined }), x: 21.4, y: 30.2 }, { who: TK.who(1192, { dir: 3 }), x: 21.0, y: 32.8 }, { who: TK.kimono(1193, { dir: 3 }), x: 22.8, y: 32.6 }], { seed: 3 });
  for (const [dir, ph0, seeds] of [[1, 0, [1301, 1302, 1303]], [1, 0.5, [1304, 1305, 1306]]]) {
    const puller = TK.who(seeds[0], { top: '#2E2A26', bot: '#2E2A26', bare: true, hairStyle: 'short', cap: undefined }), riders = [TK.kimono(seeds[1]), TK.kimono(seeds[2])];
    T.actor({ sample: 0.3, period: 24,
      // anchored at the middle of what it covers on the ground (from the back of its wheels, 2.9 behind the seat, to the
      // puller, 5.7 ahead), with that half-size as ext, so the people beside it are ordered by where they stand
      at(t) { const u = ((t / 24 + ph0) % 1), x = dir > 0 ? -38 + u * 76 : 38 - u * 76, a = Math.min(1, Math.min(u, 1 - u) * 14), f = Math.floor((t * 2.6) % 1 * 8); return { x: x + dir * 1.4, y: 35.9, key: f, f, alpha: a < 1 ? a : null, ext: [4.3, 1.7] }; },
      draw(g, st) { g.at(-dir * 1.4, 0, 0, (g2) => TK.rickshaw(g2, dir > 0 ? 0 : Math.PI, st.f / 8, puller, riders)); } });
  }
  // a school trip at the pond in yellow caps; the teacher waves the flag to gather them
  TK.group(T, [0, 1, 2, 3].map((k) => ({ who: TK.pupil(1110 + k, { dir: k < 2 ? 1 : 3, k: 0.74, cap: '#E6C24F', randoseru: k % 2 ? '#C9463E' : '#2E2A26', top: '#F3F1EA', bot: '#3F4D63' }), x: -22.0 + (k % 2) * 1.8, y: 24.6 + (k < 2 ? 0 : 2.0) })), { seed: 6, laughs: 0.6 });   // on the open grass south of the pond
  busy(TK.who(1119, { dir: 1 }), -18.0, 23.4, [[{ n: 2, rate: 2.4, f: (i) => ({ hands: [[-1.9, -9.6], [2.4 + i * 0.8, -19.4]] }), extra: (g, r) => { const h = r.hands[0][1] < r.hands[1][1] ? r.hands[0] : r.hands[1]; g.line2([h, [h[0], h[1] - 8]], { w: 0.45, c: '#3A3530', boil: false }); g.fill2([[h[0], h[1] - 8], [h[0] + 4, h[1] - 7.2], [h[0], h[1] - 6.0]], '#E6C24F', true); } }, 3.0], ['talk', 3.0], ['point', 2.0]], { off: 0.7 });
  // people on the garden's edge, by the pond
  TK.group(T, [{ who: TK.who(1201, { dir: 1, sit: true }), x: -27.0, y: 25.0 }, { who: TK.kimono(1202, { dir: 1, sit: true }), x: -25.2, y: 25.2 }], { seed: 8 });
  busy(TK.who(1203, { dir: 2 }), -12.6, 14.6, [['photo', 3.0], ['look', 2.0], ['point', 1.6], ['photo', 2.4], ['scroll', 2.6]], { off: 0.4 });   // photographing the carp
  TK.pigeons(T, A + 9, -14.6, 6, { seed: 2 }); TK.pigeons(T, A + 10.4, -10.8, 5, { seed: 5 });
  // someone photographing the pagoda, someone pointing it out to a friend
  busy(TK.who(1211, { dir: 2 }), -15.2, 4.4, [['photo', 3.2], ['look', 1.6], ['scroll', 2.8]], { off: 2 });
  TK.group(T, [{ who: TK.who(1212, { dir: 2 }), x: -12.4, y: 1.6 }, { who: TK.kimono(1213, { dir: 3 }), x: -10.6, y: 2.8 }], { seed: 9 });

  // walkers along the approach, both ways, through the gates; some go on to the hall's steps. Five lanes about a body's
  // width apart (a person is about 1 u across): the round walkers up at 0.75 and down at 4.6, the others up at 1.7 and down
  // at 3.6 (all at one speed, spaced round their loop, so nobody walks through the one ahead), the pilgrim both ways at
  // 2.65. The inner loop turns at y = 33.0 and the outer at 33.6 (so no turn crosses a lane), short of the rickshaws.
  const LOOK2 = (i) => i % 4 === 0 ? TK.kimono(1220 + i) : i % 4 === 2 ? TK.salary(1220 + i) : TK.who(1220 + i);
  const NEAR = 33.0, RNEAR = 33.6, FAR_Y = -4.6, LUP = 1.7, LDN = 3.6;
  const lanePts = [[LUP, NEAR], [LUP, FAR_Y], [LDN, FAR_Y], [LDN, NEAR]];
  const jit = (i) => ((i * 0.137) % 1 - 0.5) * 0.04;
  for (let i = 0; i < 8; i++) K.walker(T, LOOK2(i), lanePts, 2.0, { phase: (i / 8 + jit(i) + 1) % 1 });
  // and round the burner to the hall's steps: up the west side, along the steps' first step (behind the burner, leaving
  // the gap between them to the pilgrim), back down the east
  const STEP1 = (x, y) => (y < -21.8 && x > -2.5 && x < 6.5 ? 0.73 : 0);
  for (let i = 0; i < 4; i++) K.walker(T, LOOK2(i + 10), [[0.75, RNEAR], [0.75, -4.6], [-3.0, -8.0], [-3.0, -21.0], [-2.2, -22.2], [6.2, -22.2], [6.9, -21.0], [6.9, -8.0], [4.6, -4.6], [4.6, RNEAR]], 1.7, { phase: i * 0.25 + 0.1, z: STEP1 });
  // a man who walks straight to the burner, wafts, and on to the hall; back the way he came (his own lane, x = 2.65)
  { const pts = [[2.65, 33.3], [2.65, -5.6], [-2.2, -17.2], [-2.2, -20.4], [-1.4, -21.0], [-0.9, -21.75], [-0.9, -24.5], [-0.9, -21.75], [-2.2, -20.4], [-2.2, -17.2], [2.65, -5.6]];
    const R = route(pts), dAt = (k) => R.L[k];
    pilgrim(TK.salary(1240, { dir: 3 }), pts, 1.7, [[dAt(4) + 0.01, [[WAFT, 4.0], ['pray', 2.0]], 0], [dAt(6) + 0.01, [['bow', 1.4], ['pray', 3.0], ['bow', 1.4]], 3]], { phase: 0.3, z: (x, y) => y < -24.2 ? 2.2 : y < -21.8 ? clamp((-21.8 - y) / 2.4, 0, 1) * 2.2 : 0 }); }
  // walkers in the courtyard and the back lane
  K.walker(T, TK.who(1251), [[-12.4, -5.8], [-3.4, -5.8], [-3.4, -7.2], [-12.4, -7.2]], 1.5, { phase: 0.2 });   // west of the approach's walkers, clear of the stone lantern
  K.walker(T, TK.kimono(1252), [[18.6, -6.8], [18.6, -16.0], [16.6, -16.0], [16.6, -6.8]], 1.3, { phase: 0.6 });
  // round the kimono shop: in front of the rickshaw men and the photo, clear of the stone lantern and the planters
  K.walker(T, TK.who(1253, { phone: true }), [[14.3, 33.8], [14.3, 21.6], [27.8, 21.6], [27.8, 33.8]], 1.6, { phase: 0.3 });
  TK.dogWalk(T, TK.who(1254), [[13.6, 21.0], [13.6, -1.8], [27.8, -1.8], [27.8, 21.0]], 1.4, '#E8D9B8', { phase: 0.1 });
  // customers on the east street: one at the soba shop's noren, a couple on the bench
  busy(TK.salary(1255, { dir: 2 }), 37.0, 11.8, [['look', 2.2], ['point', 1.4], ['talk', 2.4], ['rest', 1.6]], { off: 1 });
  TK.group(T, [{ who: TK.kimono(1256, { dir: 0, sit: true }), x: 29.6, y: 17.8 }, { who: TK.who(1257, { dir: 0, sit: true }), x: 29.6, y: 19.4 }], { seed: 12 });
  // the first week of January: hatsumode, the approach full of people come for the year's first prayer
  // (on the same loop, at its speed, spaced between the others)
  for (let i = 0; i < 8; i++) K.walker(T, LOOK2(i + 20), lanePts, 2.0, { phase: ((i + 0.5) / 8 + jit(i + 3) + 1) % 1, season: 'winter' });
});
