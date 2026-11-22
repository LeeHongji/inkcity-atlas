'use strict';
/* (0,0) Shibuya: the scramble crossing. Two roads cross in the middle of the tile; zebras on the four arms and two
   diagonals. On the far corner a glass tower with a giant screen (a beckoning cat waves at the crowd); on the right a
   silver cylinder tower with a red sign band; on the left Hachikō square (the faithful dog on his plinth, the old green
   train car, the station front); on the near corner a kōban with an officer. ~70 people wait at the four corners.
   The cycle (21 s): road A (along x) gets green, then road B, then every car light is red and everyone crosses at once,
   diagonals included, while cars queue at the stop lines. The cycle is shifted so the film's Shibuya shot opens on
   the green man. Cars and people are pure functions of t. */
SF.tile('shibuya', 0, 0, { rim: 30 }, function (T) {
  const H = 37, RW = 7, PAVE = '#E6E2D8', ASPH = '#D2CDC0', LINE = '#F8F6F0';
  const CYC = 21, PED0 = 10.4, sh = SCENE.shots.find((s) => s.name === 'shibuya');
  const OFF = sh ? (((PED0 - 0.3 - sh.a / 30) % CYC) + CYC) % CYC : 0;
  const cyc = (t) => { const u = t + OFF; const n = Math.floor(u / CYC); return { n, tc: u - n * CYC }; };

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    K.slab(g, H, { top: PAVE });
    g.fill(K.rect(-H, -RW, H, RW), ASPH); g.fill(K.rect(-RW, -H, RW, H), ASPH);
    // rounded kerbs at the four corners of the crossing
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) { const pts = [[sx * RW, sy * RW, 0]]; for (let i = 0; i <= 8; i++) { const a = Math.PI / 2 * i / 8; pts.push([sx * (RW + 2.5 - 2.5 * Math.sin(a)), sy * (RW + 2.5 - 2.5 * Math.cos(a)), 0]); } g.fill(pts, ASPH); }
    for (const sx of [-1, 1]) {
      g.line([[sx * RW, -H, 0], [sx * RW, -RW - 2.5, 0]], { w: 0.6, c: '#A9A296', boil: false }); g.line([[sx * RW, RW + 2.5, 0], [sx * RW, H, 0]], { w: 0.6, c: '#A9A296', boil: false });
      g.line([[-H, sx * RW, 0], [-RW - 2.5, sx * RW, 0]], { w: 0.6, c: '#A9A296', boil: false }); g.line([[RW + 2.5, sx * RW, 0], [H, sx * RW, 0]], { w: 0.6, c: '#A9A296', boil: false });
    }
    g.scuff(K.rect(-H, -RW, H, RW), { dir: Math.atan2(AY, AX), len: 8, c: '#E2DDD0', dens: 0.5, w: 0.5, spread: 0.05 });
    g.scuff(K.rect(-RW, -H, RW, H), { dir: Math.atan2(AY, -AX), len: 8, c: '#E2DDD0', dens: 0.5, w: 0.5, spread: 0.05 });
    // zebras on the four arms
    for (const s of [-1, 1]) for (let k = -RW + 0.9; k < RW - 0.5; k += 2.1) {
      g.fill(K.rect(Math.min(s * 8, s * 12.5), k - 0.62, Math.max(s * 8, s * 12.5), k + 0.62), LINE);
      g.fill(K.rect(k - 0.62, Math.min(s * 8, s * 12.5), k + 0.62, Math.max(s * 8, s * 12.5)), LINE);
    }
    // and the two diagonals: bars across each diagonal band
    for (const d of [1, -1]) for (let t = -8.2; t <= 8.2; t += 2.05) {
      const cx = t / Math.SQRT2, cy = d * t / Math.SQRT2, ux = 1 / Math.SQRT2, uy = d / Math.SQRT2, vx = -uy, vy = ux, a = 0.6, b = 2.2;
      g.fill([[cx - ux * a - vx * b, cy - uy * a - vy * b, 0], [cx + ux * a - vx * b, cy + uy * a - vy * b, 0], [cx + ux * a + vx * b, cy + uy * a + vy * b, 0], [cx - ux * a + vx * b, cy - uy * a + vy * b, 0]], LINE);
    }
    // stop lines and lane marks
    for (const s of [-1, 1]) {
      g.line([[s * 14.6, s < 0 ? -RW + 0.4 : 0.2, 0], [s * 14.6, s < 0 ? -0.2 : RW - 0.4, 0]], { c: LINE, w: 1.1, boil: false });
      g.line([[s < 0 ? 0.2 : -RW + 0.4, s * 14.6, 0], [s < 0 ? RW - 0.4 : -0.2, s * 14.6, 0]], { c: LINE, w: 1.1, boil: false });
      for (let u = 17; u < H - 2; u += 7) { g.line([[s * u, 0, 0], [s * (u + 3.4), 0, 0]], { c: LINE, w: 0.9, boil: false }); g.line([[0, s * u, 0], [0, s * (u + 3.4), 0]], { c: LINE, w: 0.9, boil: false }); }
    }
    // paving joints on the four blocks
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) g.scuff(K.rect(sx > 0 ? RW : -H, sy > 0 ? RW : -H, sx > 0 ? H : -RW, sy > 0 ? H : -RW), { dir: -0.5, len: 4, c: '#F4F1EA', dens: 0.6, w: 0.5 });
    // Hachikō square: warm stone paving
    g.fill(K.rect(-26, 9.5, -9.5, 36), '#E9DFCB');
    g.scuff(K.rect(-26, 9.5, -9.5, 36), { dir: Math.atan2(AY, AX), len: 3, c: '#D9CBAE', dens: 0.6, w: 0.5, spread: 0.05 });
  }, { rim: true });

  /* ---------------- the far corner: the screen tower ---------------- */
  T.obj([-35, -35, -16, -16], function (g) {
    const x0 = -35, y0 = -35, x1 = -16, y1 = -16, Z = 33;
    K.box(g, x0, y0, x1, y1, 0, 5.2, { t: '#E9E6DE', l: '#5A6470', r: '#4A545F' }, { w: 0.9 });
    // lit shop floor behind glass
    for (const [f, p, a0, a1] of [['L', y1, x0 + 1, x1 - 1], ['R', x1, y0 + 1, y1 - 1]]) { g.fill(K.on(f, p + 0.03, a0, a1, 0.4, 4.4), '#E9D3A6'); for (let a = a0 + 2.6; a < a1; a += 2.6) g.line([K.pt(f, p + 0.05, a, 0.4), K.pt(f, p + 0.05, a, 4.4)], { w: 0.35, c: '#4A545F', boil: false }); }
    K.box(g, x0 + 0.4, y0 + 0.4, x1, y1, 5.2, Z, { t: '#DCE3E6', l: '#C3D6E0', r: '#A8BECB' }, { w: 1 });
    // curtain wall grid
    const gr = [];
    for (let z = 9; z < Z; z += 4) for (const [f, p, a0, a1] of [['L', y1, x0 + 0.4, x1], ['R', x1, y0 + 0.4, y1]]) { const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z)); gr.push(a[0], a[1], b[0], b[1]); }
    for (const [f, p, a0, a1] of [['L', y1, x0 + 0.4, x1], ['R', x1, y0 + 0.4, y1]]) for (let a = a0 + 2.4; a < a1; a += 2.4) { const q0 = g.p.apply(g, K.pt(f, p + 0.02, a, 5.2)), q1 = g.p.apply(g, K.pt(f, p + 0.02, a, Z)); gr.push(q0[0], q0[1], q1[0], q1[1]); }
    g.segs2(gr, '#8EA7B6', 0.35);
    // the giant screen on the face towards the crossing (its picture is an actor), a second one on the side
    const scr = K.on('R', x1 + 0.05, -33.5, -18.2, 12.5, 27.5); g.fill(scr, '#2E3238'); g.outline(scr, { w: 0.9, boil: false });
    const s2 = K.on('L', y1 + 0.05, -33.5, -23, 17, 25); g.fill(s2, '#2E3238');
    const s2i = K.on('L', y1 + 0.08, -33, -23.5, 17.5, 24.5); g.lit({ nc: true }, () => { g.fill(s2i, '#E7A9A0');
    for (let i = 0; i < 4; i++) g.fill(K.on('L', y1 + 0.1, -33 + i * 2.4, -33 + i * 2.4 + 1.2, 17.5, 24.5), ['#F3E3A0', '#A9D1E6', '#F3F1EA', '#C9E3A8'][i]); });
    { const q = g.p.apply(g, K.pt('L', y1 + 0.1, -28.2, 21)); g.glow2('neon', q, q, { r: 9, col: '#F7C6B8' }); }
    g.outline(s2, { w: 0.7, boil: false });
    // rooftop: a billboard frame and a water tank
    K.box(g, x0 + 2, y0 + 2, x0 + 8, y0 + 5, Z, Z + 2.2, '#C9CCCC', { w: 0.6 });
    K.cyl(g, x0 + 12, y0 + 6, 1.6, Z, Z + 2.6, { t: '#E9E6DE', l: '#D9D6CC', r: '#BDBAB1' }, { w: 0.6, n: 10 });
    const bb = K.on('L', y1 - 3, x0 + 3, x1 - 3, Z + 0.5, Z + 5.5); g.fill(bb, '#E6C24F'); g.mark({ nc: true }); g.outline(bb, { w: 0.6, boil: false });
    TK.sign(g, 'L', y1 - 3, x0 + 4, x1 - 4, Z + 1.2, Z + 4.8, '#E6C24F', { seed: 11, n: 5, ink: '#3A3128' });
    void bb;
  }, { name: 'screen tower' });
  // shops along road A behind the screen tower
  T.obj([-35, -14.5, -27, -9.5], (g) => { K.box(g, -35, -14.5, -27, -9.5, 0, 9, { t: '#E9E6DE', l: '#F1EFE8', r: '#D9D6CC' }, { w: 0.8 }); K.win(g, 'L', -9.5, -34, -28, 1, 4, { style: 'glass' }); K.win(g, 'L', -9.5, -34, -28, 5.5, 8, { style: 'navy' }); TK.sign(g, 'R', -27, -14, -10, 5.4, 8.6, '#5F8FC9', { seed: 3 }); });
  T.obj([-14.5, -35, -9.5, -27], (g) => { K.box(g, -14.5, -35, -9.5, -27, 0, 11, { t: '#E9E6DE', l: '#E3E0D6', r: '#CFCCC1' }, { w: 0.8 }); K.win(g, 'R', -9.5, -34, -28, 1, 4, { style: 'glass' }); TK.sign(g, 'R', -9.5, -33.5, -31.5, 4.5, 10.5, '#C9463E', { seed: 5 }); });

  /* ---------------- the right corner: the silver cylinder ---------------- */
  T.obj([12, -36, 17, -21], (g) => { K.box(g, 12, -36, 17, -21, 0, 10, { t: '#E9E6DE', l: '#F1EFE8', r: '#D9D6CC' }, { w: 0.8 }); K.win(g, 'R', 17, -35, -22, 1, 4, { style: 'glass' }); TK.awning(g, 'R', 17, -35, -22, 4.5, 1.8, '#3F5F8F', {}); TK.sign(g, 'R', 17, -34, -30, 5.5, 9.2, '#E6C24F', { seed: 8 }); });
  T.obj([15, -33, 31, -17], function (g) {
    const cx = 23, cy = -25, r = 8, Z = 29;
    K.cyl(g, cx, cy, r + 0.4, 0, 5, { t: '#E9E6DE', l: '#E7D3A6', r: '#CDB98C' }, { w: 0.9, n: 18 });
    K.cyl(g, cx, cy, r, 5, Z, { t: '#E9EAE6', l: '#D9DCDC', r: '#B9BDBD' }, { w: 1, n: 18 });
    // window bands round the drum
    for (let z = 8; z < Z - 2; z += 3.4) { const b = []; for (let i = 0; i <= 12; i++) { const a = lerp(Math.PI * 0.78, -Math.PI * 0.28, i / 12); b.push([cx + Math.cos(a) * (r + 0.05), cy + Math.sin(a) * (r + 0.05), z]); } g.fine(b, { w: 0.35, c: '#9AA0A3' }); }
    // a red sign band down the front, the name in a column of glyphs
    const a0 = Math.PI * 0.5, a1 = Math.PI * 0.62, band = [];
    for (let i = 0; i <= 4; i++) band.push([cx + Math.cos(lerp(a0, a1, i / 4)) * (r + 0.1), cy + Math.sin(lerp(a0, a1, i / 4)) * (r + 0.1), 9]);
    for (let i = 4; i >= 0; i--) band.push([cx + Math.cos(lerp(a0, a1, i / 4)) * (r + 0.1), cy + Math.sin(lerp(a0, a1, i / 4)) * (r + 0.1), Z - 1]);
    g.fill(band, '#C9463E'); g.outline(band, { w: 0.5, c: '#7A2A22', boil: false });
    const am = (a0 + a1) / 2; for (let k = 0; k < 6; k++) TK.glyph2(g, g.p(cx + Math.cos(am) * (r + 0.2), cy + Math.sin(am) * (r + 0.2), 11 + k * 2.9), 4.2, '#F6F3EA', 70 + k);
    K.cyl(g, cx, cy, r + 0.5, Z, Z + 1.2, { t: '#C9CCCC', l: '#E9EAE6', r: '#C9CCCC' }, { w: 0.8, n: 18 });
  }, { name: 'cylinder tower' });
  T.obj([27, -14.5, 36, -9.5], (g) => { K.box(g, 27, -14.5, 36, -9.5, 0, 8, { t: '#E9E6DE', l: '#F3EFE3', r: '#DCD4C0' }, { w: 0.8 }); K.win(g, 'L', -9.5, 28, 35, 1, 4.2, { style: 'glass' }); TK.awning(g, 'L', -9.5, 28, 35, 4.8, 1.6, '#C9584B', { stripe: '#F3F1EA' }); });

  /* ---------------- the left corner: Hachikō square ---------------- */
  T.obj([-36.5, 9.5, -28, 36.5], function (g) {                     // the station front
    K.box(g, -36.5, 9.5, -28, 36.5, 0, 13, { t: '#E3E0D6', l: '#E9E6DE', r: '#D7D3C8' }, { w: 1 });
    K.win(g, 'R', -28, 12, 33, 7.5, 11.5, { style: 'navy' });
    g.fill(K.on('R', -27.97, 14, 31, 0, 5.5), '#3A3F47');
    for (let a = 16; a < 31; a += 3) g.line([K.pt('R', -27.95, a, 0), K.pt('R', -27.95, a, 5.5)], { w: 0.4, c: '#8C8576', boil: false });
    TK.awning(g, 'R', -28, 13, 32, 6.4, 2.6, '#E3E0D6', {});
    TK.sign(g, 'R', -28, 19, 26, 12, 14.6, '#3F5F8F', { seed: 21, n: 3 });
  }, { name: 'station' });
  T.obj([-21.5, 14.5, -18.5, 17.5], function (g) {                     // Hachikō on his plinth
    K.box(g, -21.2, 14.8, -18.8, 17.2, 0, 2.6, { t: '#C9C6BD', l: '#B9B6AD', r: '#A3A097' }, { w: 0.7 });
    const p = g.p(-20, 16, 2.6), B = '#6E5A44', D = '#584636', s = (u, v) => [p[0] + u, p[1] + v];
    g.fill2([s(-3.2, 0), s(1.6, 0), s(2.2, -2.6), s(1.4, -5.2), s(-0.6, -4.6), s(-2.6, -2.6)], B, true);   // body sitting
    g.fill2([s(0.6, -4.8), s(2.6, -5.4), s(3.6, -7.2), s(3.0, -9.0), s(1.4, -9.4), s(0.4, -8.0)], B, true); // head
    g.fill2([s(1.2, -9.0), s(1.6, -10.8), s(2.2, -9.2)], D, true); g.fill2([s(2.6, -8.8), s(3.2, -10.4), s(3.4, -8.6)], D, true);
    g.fill2([s(3.4, -7.4), s(4.6, -6.9), s(4.4, -6.3), s(3.4, -6.5)], D, true);
    g.fill2([s(-3.0, -2.4), s(-4.0, -3.8), s(-3.2, -4.8), s(-2.4, -3.4)], D, true);                         // the curled tail
    g.fill2([s(1.0, 0), s(1.7, 0), s(1.8, -3.0), s(1.2, -3.0)], D, true);                                   // front leg
    g.line2([s(-3.2, 0), s(-2.6, -2.6), s(-0.6, -4.6), s(0.4, -8.0), s(1.4, -9.4), s(3.0, -9.0), s(3.6, -7.2), s(2.6, -5.4), s(2.2, -2.6), s(1.6, 0)], { w: 0.55, c: '#3A3128', boil: false });
    g.disc2(s(2.7, -7.6), 0.25, '#2A2420');
  }, { name: 'hachiko' });
  T.obj([-23, 25.4, -13, 28.6], (g) => { g.at(-18, 27, 0, (g2) => TK.trainCar(g2, 0, { kind: 'frog', cab: 1, hl: 4.8 })); }, { name: 'green car' });
  for (const [x, y] of [[-12, 33], [-25, 33.5], [-11, 21]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.6, h: 4.6, col: C.leafL }), { on: true });
  T.obj([-23.5, 19], (g) => K.bench(g, -23.5, 19, { face: 'R', L: 2.4 }), { on: true });

  /* ---------------- the near corner: the kōban, an exit canopy ---------------- */
  T.obj([18, 18, 23.5, 23.5], function (g) {
    K.box(g, 18, 18, 23.5, 23.5, 0, 5.5, { t: '#E9E6DE', l: '#F3F1EA', r: '#E2DFD5' }, { w: 0.85 });
    K.box(g, 17.6, 17.6, 23.9, 23.9, 5.5, 6.3, '#7E848C', { w: 0.7 });
    g.fill(K.on('L', 23.52, 19, 21.5, 0, 3.8), '#5A6470'); g.fill(K.on('R', 23.52, 19, 22.5, 1.6, 3.8), C.glass);
    const l = g.p(20.2, 23.6, 4.6); g.disc2(l, 1.0, '#D4553A'); g.ring2(l, 1.0, { w: 0.4, c: '#7A2A22' });
    TK.sign(g, 'L', 23.5, 18.5, 23, 6.6, 7.8, '#F3F1EA', { seed: 31, n: 3, ink: '#3F5F8F' });
  }, { name: 'koban' });
  T.obj([26, 26, 36, 36], function (g) {
    K.box(g, 33, 26, 36, 36, 0, 5.6, { t: '#E9E6DE', l: '#E3E0D6', r: '#CFCCC1' }, { w: 0.8 });
    for (const [x, y] of [[26.4, 26.4], [26.4, 35.6], [32.6, 26.4], [32.6, 35.6]]) { const a = g.p(x, y, 0), b = g.p(x, y, 5.6); g.line2([a, b], { w: 0.6, boil: false }); }
    const cn = [[25.5, 25.5, 5.6], [36, 25.5, 5.6], [36, 36.2, 5.6], [25.5, 36.2, 5.6]]; g.fill(cn, 'rgba(201,224,234,0.85)'); g.outline(cn, { w: 0.7, boil: false });
    for (let x = 27; x < 36; x += 2) g.line([[x, 25.5, 5.62], [x, 36.2, 5.62]], { w: 0.3, c: '#8EA7B6', boil: false });
  }, { name: 'exit canopy' });
  for (const [x, y] of [[33, 14], [14, 33]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.4, h: 4.4 }), { on: true });

  /* ---------------- the living layer ---------------- */
  // the officer outside the kōban, a couple photographing Hachikō, a guide flag
  T.cast([21, 25], (g) => TK.person(g, 21, 25.2, 0, TK.who(901, { dir: 1, top: '#2F3A4F', bot: '#2F3A4F', cap: '#2F3A4F', hairStyle: 'short', glasses: false })), { on: true });
  T.cast([-17.5, 18.5], (g) => { const r = TK.person(g, -17.2, 18.2, 0, TK.who(902, { dir: 2, pose: 'hold', phone: true })); void r; TK.person(g, -18.8, 19.6, 0, TK.who(903, { dir: 3, pose: 'wave', ph: 0.2 })); }, { on: true });
  T.cast([-23, 22.5], (g) => { TK.person(g, -23.5, 22.6, 0, TK.who(904, { dir: 1, pose: 'hold' })); TK.person(g, -22.0, 23.8, 0, TK.kimono(905, { dir: 1 })); }, { on: true });

  // the giant screen: a beckoning cat on a band of colour that changes every cycle
  T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 3) % 6, c = Math.floor(t / 3.5) % 3; return { x: -15.9, y: -18.2, z: 12.5, key: c + '.' + f, f, c }; },
    draw(g, st) {
      const i0 = g.cmds.length;
      const X = -15.9 - (-15.9), Y = 18.2, W = (a, z) => [X + 0.0, a + Y, z - 12.5];   // face R at x = -15.9, a = world y
      const q = (a0, a1, z0, z1, col) => g.fill([W(a0, z0), W(a1, z0), W(a1, z1), W(a0, z1)], col);
      const bg = [['#F2B6C2', '#F7D9DF'], ['#F3E3A0', '#FBF1C9'], ['#A9D1E6', '#D6EAF4']][st.c];
      q(-33.2, -18.5, 12.8, 27.2, bg[0]); for (let i = 0; i < 5; i++) q(-33.2 + i * 3, -33.2 + i * 3 + 1.4, 12.8, 27.2, bg[1]);
      // the cat: a white body, round head, ears, one paw beckoning
      const cx = -25.5, ez = (pts) => pts.map(([a, z]) => W(cx + a, z));
      g.fill(ez(K.curve([[-4, 13], [4, 13], [4.4, 17], [3, 19.5], [-3, 19.5], [-4.4, 17]], 3, true).map((p) => [p[0], p[1]])), '#FBFAF6');
      g.fill(ez(K.curve([[-4.6, 19], [4.6, 19], [4.8, 23], [2.6, 25.4], [-2.6, 25.4], [-4.8, 23]], 3, true).map((p) => [p[0], p[1]])), '#FBFAF6');
      g.fill(ez([[-4.2, 24.2], [-3.4, 26.8], [-1.6, 25.2]]), '#FBFAF6'); g.fill(ez([[4.2, 24.2], [3.4, 26.8], [1.6, 25.2]]), '#FBFAF6');
      g.fill(ez([[-3.7, 24.6], [-3.3, 26.0], [-2.3, 25.1]]), '#F2A3B0'); g.fill(ez([[3.7, 24.6], [3.3, 26.0], [2.3, 25.1]]), '#F2A3B0');
      for (const a of [-1.8, 1.8]) g.fill(ez([[a - 0.45, 22.4], [a + 0.45, 22.4], [a + 0.45, 23.4], [a - 0.45, 23.4]]), '#2A2622');
      g.fill(ez([[-0.5, 21.3], [0.5, 21.3], [0, 20.8]]), '#E07A6A');
      g.fill(ez([[-4.2, 18.6], [4.2, 18.6], [4.2, 19.6], [-4.2, 19.6]]), '#D4553A'); g.fill(ez([[-0.8, 17.4], [0.8, 17.4], [0.8, 18.8], [-0.8, 18.8]]), '#E6C24F');
      const lift = [0, 0.8, 1.6, 2.2, 1.6, 0.8][st.f];      // the paw comes up and down
      g.fill(ez([[3.0, 18.5 + lift], [5.0, 19.2 + lift], [5.3, 21.4 + lift], [3.8, 21.8 + lift], [3.0, 20.2 + lift]]), '#FBFAF6');
      g.fill(ez([[-5.2, 13.6], [-3.6, 13.6], [-3.6, 15.6], [-5.0, 15.6]]), '#FBFAF6');
      const o = ez(K.curve([[-4.6, 19], [4.6, 19], [4.8, 23], [2.6, 25.4], [-2.6, 25.4], [-4.8, 23]], 3, true).map((p) => [p[0], p[1]]));
      g.outline(o, { w: 0.4, c: '#8C8576', boil: false });
      g.mark({ nc: true }, i0); g.cmds[i0].light = true;                    // a screen shines at night
    } });

  // signals on the four corners: car heads and the walking man
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const { tc } = cyc(t); const ph = tc < 3.8 ? 'A' : tc < 4.8 ? 'Ay' : tc < 8.8 ? 'B' : tc < 9.8 ? 'By' : tc < PED0 ? 'R' : tc < CYC - 2.2 ? 'P' : (Math.floor(tc * 3) % 2 ? 'Pb' : 'R'); return { x: sx * 8.1, y: sy * 8.1, key: ph, ph }; },
    draw(g, st) {
      const b = g.p(0, 0, 0), t = g.p(0, 0, 9.5);
      g.fill2([[b[0] - 0.4, b[1]], [b[0] + 0.4, b[1]], [t[0] + 0.3, t[1]], [t[0] - 0.3, t[1]]], '#6B6458');
      // car head: three lamps in a row on a dark box
      const h = [t[0] - 4.6, t[1] + 0.8];
      g.fill2([[h[0] - 0.4, h[1] - 1.3], [h[0] + 4.6, h[1] - 1.3], [h[0] + 4.6, h[1] + 1.1], [h[0] - 0.4, h[1] + 1.1]], '#3A3530', true);
      const carGreen = (sx === sy) ? st.ph === 'A' : st.ph === 'B', carY = (sx === sy) ? st.ph === 'Ay' : st.ph === 'By';
      [['#5FC07A', carGreen], ['#E9C543', carY], ['#E0503E', !carGreen && !carY]].forEach(([c, on], i) => { g.disc2([h[0] + 0.7 + i * 1.5, h[1] - 0.1], 0.62, on ? c : '#5A544A'); if (on) g.mark({ nc: true, light: true }); });
      // the pedestrian head: a red standing man above a green walking man
      const p = [t[0] + 0.6, t[1] + 3.2];
      g.fill2([[p[0], p[1] - 3.4], [p[0] + 2.2, p[1] - 3.4], [p[0] + 2.2, p[1] + 1.4], [p[0], p[1] + 1.4]], '#3A3530', true);
      const pg = st.ph === 'P', pr = !pg && st.ph !== 'Pb';
      g.fill2([[p[0] + 0.8, p[1] - 3.0], [p[0] + 1.4, p[1] - 3.0], [p[0] + 1.4, p[1] - 1.4], [p[0] + 0.8, p[1] - 1.4]], pr ? '#E0503E' : '#5A544A', true); if (pr) g.mark({ nc: true, light: true });
      g.fill2([[p[0] + 0.6, p[1] - 0.6], [p[0] + 1.6, p[1] - 0.6], [p[0] + 1.4, p[1] + 1.0], [p[0] + 0.8, p[1] + 1.0]], pg ? '#5FC07A' : '#5A544A', true); if (pg) g.mark({ nc: true, light: true });
    } });

  /* ---- the cars: road A (along x) and road B (along y), two per lane, queueing at the stop lines ---- */
  // left-hand traffic: heading +x keeps to the -y side, heading +y to the +x side
  const LANES = [{ ax: 'x', c: -3.5, d: 1, g0: 0 }, { ax: 'x', c: 3.5, d: -1, g0: 0 }, { ax: 'y', c: 3.5, d: 1, g0: 5.0 }, { ax: 'y', c: -3.5, d: -1, g0: 5.0 }];
  const KINDS = [['taxi', 'bus'], ['car', 'taxi'], ['taxi', 'car'], ['bus', 'taxi']];
  const V = 14, ACC = 8, TAU_A = V / ACC, DACC = V * TAU_A / 2, Q = [-20.3, -32.6];
  LANES.forEach((L, li) => [0, 1].forEach((k) => {
    const kind = KINDS[li][k], col = ['#F1EFE8', '#C9CCCC', '#2F343B', '#8FA3B5'][(li + k * 2) % 4], hl = kind === 'bus' ? 6.8 : 5.3;
    const qk = k === 0 ? -15.2 - hl : Q[1] - (hl - 5.3), td = L.g0 + k * 0.8, te = td + 8 + k * 2.2, D = qk + 37, Ta = 2 * D / 10;
    const sAt = (tc) => {                                       // position along the lane in this cycle
      if (tc >= td) { const u = tc - td; const s = u < TAU_A ? qk + ACC * u * u / 2 : qk + DACC + V * (u - TAU_A); if (s < 40) return s; }
      if (tc >= te) { const u = Math.min(1, (tc - te) / Ta); return -37 + D * (1 - (1 - u) * (1 - u)); }
      if (tc < td) { const u = tc + CYC - te; if (u >= 0) return -37 + D * (1 - Math.pow(1 - Math.min(1, u / Ta), 2)); }
      return null;
    };
    T.actor({ sample: 0.2, period: CYC, cast: true,
      at(t) {
        const { tc } = cyc(t), s = sAt(tc); if (s == null || s > 39) return null;
        const a = clamp(Math.min((39 - s) / 6, (s + 37 + 2) / 4), 0, 1); if (a <= 0.02) return null;
        const ang = L.ax === 'x' ? (L.d > 0 ? 0 : Math.PI) : (L.d > 0 ? Math.PI / 2 : -Math.PI / 2), p = L.d * s;
        return { x: L.ax === 'x' ? p : L.c, y: L.ax === 'x' ? L.c : p, key: 'v', ang, alpha: a < 1 ? a : null };
      },
      draw(g, st) { if (kind === 'bus') K.bus(g, st.ang, { band: '#6FAE6A' }); else if (kind === 'taxi') TK.taxi(g, st.ang); else K.car(g, st.ang, { col }); } });
  }));

  /* ---- the crowd: 72 people shuttle between the four corners, one crossing per cycle ---- */
  const NW = 72, CORN = [[1, 1], [1, -1], [-1, -1], [-1, 1]], SLOTS = [];
  for (let ci = 0; ci < 4; ci++) { const [sx, sy] = CORN[ci], R = RNG(ci * 97 + 5), list = []; for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) { if (list.length >= 18) break; const u = 0.55 + i * 1.42 + (j % 2) * 0.6 + (R() - 0.5) * 0.3, v = 0.55 + j * 1.18 + (R() - 0.5) * 0.3; if (u > 5.6) continue; list.push({ x: sx * (8.6 + u), y: sy * (8.6 + v), front: Math.min(u, v) + 0.35 * Math.max(u, v), ci }); } while (list.length < 18) list.push({ x: sx * (8.6 + 2.8), y: sy * (8.6 + 4.6 + list.length * 0.01), front: 4, ci }); SLOTS.push(list); }
  // each cycle a seeded shuffle of the 72 slots: about a quarter stay on their corner, the rest scatter (diagonals too)
  const PERM = new Map();
  const perm = (n) => { let p = PERM.get(n); if (p) return p; const R = RNG(n * 7919 + 13); p = []; for (let i = 0; i < NW; i++) p.push(i); for (let i = NW - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)), t = p[i]; p[i] = p[j]; p[j] = t; } if (PERM.size > 64) PERM.clear(); PERM.set(n, p); return p; };
  const slotOf = (n, w) => { const s = perm(n)[w]; return SLOTS[s % 4][Math.floor(s / 4)]; };
  const dirOf = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3);
  const LOOKS = [];
  for (let i = 0; i < 24; i++) LOOKS.push(i % 6 === 1 ? TK.salary(600 + i) : i === 9 || i === 20 ? TK.kimono(600 + i) : TK.who(600 + i, i % 5 === 3 ? { phone: true } : {}));
  for (let w = 0; w < NW; w++) {
    const look = LOOKS[w % 24], spd = 4.5 + h1(w * 13 + 1) * 1.1, jit = h1(w * 7 + 3) * 0.55;
    T.actor({ sample: 0.5, period: 2 * CYC,
      at(t) {
        const { n, tc } = cyc(t), A = slotOf(n, w), B = slotOf(n + 1, w);
        const t0 = PED0 + 0.15 + 0.12 * A.front + jit, dist = Math.hypot(B.x - A.x, B.y - A.y), t1 = t0 + dist / spd;
        if (tc < t0) { const d = A.ci === B.ci ? dirOf(-A.x, -A.y) : dirOf(B.x - A.x, B.y - A.y); return { x: A.x, y: A.y, key: 's' + d, dir: d, pose: look.phone ? 'hold' : 'stand' }; }
        if (tc >= t1) { const C = slotOf(n + 2, w), d = C.ci === B.ci ? dirOf(-B.x, -B.y) : dirOf(C.x - B.x, C.y - B.y); return { x: B.x, y: B.y, key: 's' + d, dir: d, pose: look.phone ? 'hold' : 'stand' }; }
        const u = (tc - t0) * spd, f = u / dist, d = dirOf(B.x - A.x, B.y - A.y), ph = Math.floor((u / 2.4) % 1 * 8);
        return { x: lerp(A.x, B.x, f), y: lerp(A.y, B.y, f), key: 'w' + d + '.' + ph, dir: d, pose: 'walk', ph: ph / 8 };
      },
      draw(g, st) { TK.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.pose, ph: st.ph || 0, phone: look.phone && st.pose === 'hold' })); } });
  }
});
