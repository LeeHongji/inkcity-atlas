'use strict';
/* (0,100) Lagoa Rodrigo de Freitas, with the imperial palm avenue of the Jardim Botânico along its far side.
   Built: the lagoon below the ground in its banks, a red cycle path and a walking path running round it, lawns, two
   kiosks with tables at the water, a little jetty for the pedal boats; along the far-left edge the Aleia Barbosa
   Rodrigues — two rows of tall, smooth-trunked imperial palms over a gravel walk, the Musas fountain in the middle.
   Who: couples pedalling swan boats in slow loops, a rowing eight pulling across with its cox, a stand-up paddler,
   cyclists on orange share bikes and joggers round the ring, capybaras grazing on the bank, egrets, a family
   picnic, people at the kiosks, strollers under the palms. */
SF.tile('lagoa', 0, 100, { rim: 46 }, function (T) {
  // an irregular natural shoreline: points round the lagoon with small coves and a bulging headland
  const LK = K.curve([[-14, -27], [-5, -30], [5, -27], [10, -31], [16, -30], [21, -24], [26, -22], [27, -14], [31, -7], [26, -1], [28, 6], [24, 12], [21, 19], [14, 20], [10, 26], [4, 23], [-3, 24], [-9, 19], [-8, 13], [-15, 10], [-13, 2], [-18, -6], [-14, -13], [-17, -20]], 3, true);
  const NRM = LK.map((p, i) => { const a = LK[(i - 1 + LK.length) % LK.length], b = LK[(i + 1) % LK.length], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dy / l, -dx / l]; });
  const sgn = (() => { let A = 0; for (let i = 0; i < LK.length; i++) { const a = LK[i], b = LK[(i + 1) % LK.length]; A += a[0] * b[1] - b[0] * a[1]; } return A > 0 ? 1 : -1; })();
  const ring = (k) => LK.map(([x, y], i) => [x + NRM[i][0] * k * sgn, y + NRM[i][1] * k * sgn]);
  T.ground(function (g) {
    K.slab(g, 37, { top: '#B5CF8E' });
    g.grass(K.rect(-37, -37, 37, 37), { dens: 0.6 });
    // the gravel walk under the palms
    g.fill(K.rect(-33.2, -37, -30.8, 37), '#E6DCC4'); g.scuff(K.rect(-33.2, -37, -30.8, 37), { dir: Math.atan2(AY, -AX), len: 2, c: '#D2C4A4', dens: 0.6, w: 0.45 });
    // the ring paths: walking path outside, red cycle path inside
    const p1 = ring(5.2), p2 = ring(3.4), p3 = ring(2.2), p4 = ring(0.6);
    g.fill(p1.map((p) => [p[0], p[1], 0]), '#E9E1CF'); g.fill(p2.map((p) => [p[0], p[1], 0]), '#C9584B'); g.fill(p3.map((p) => [p[0], p[1], 0]), '#E9E1CF'); g.fill(p4.map((p) => [p[0], p[1], 0]), '#C9BBA0');
    const dl = []; for (let i = 0; i < p2.length; i += 2) { const a = g.p((p2[i][0] + p3[i][0]) / 2, (p2[i][1] + p3[i][1]) / 2, 0), b = g.p((p2[(i + 1) % p2.length][0] + p3[(i + 1) % p3.length][0]) / 2, (p2[(i + 1) % p2.length][1] + p3[(i + 1) % p3.length][1]) / 2, 0); dl.push(a[0], a[1], b[0], b[1]); } g.segs2(dl, '#F6F3EA', 0.4);
    // the water
    const w = LK.map(([x, y]) => [x, y, -0.6]);
    g.fill(w, '#7FB2BF'); g.water(w, { dens: 0.55 });
    // reeds in the coves: short green stems standing in the shallows
    const reeds = []; for (const i0 of [8, 22, 34, 44, 55]) for (let i = i0; i < i0 + 4; i++) { const p = LK[i % LK.length], n = NRM[i % LK.length]; for (let k = 0; k < 5; k++) { const d = -0.6 - h1(i * 13 + k) * 1.8, x = p[0] + n[0] * d * sgn + (h1(k * 7 + i) - 0.5) * 1.2, y = p[1] + n[1] * d * sgn + (h1(k * 3 + i * 5) - 0.5) * 1.2, a = g.p(x, y, -0.6), b = g.p(x + 0.1, y, 1.6 + h1(i + k) * 1.2); reeds.push(a[0], a[1], b[0], b[1]); } }
    g.segs2(reeds, '#5E8F4E', 0.5);
    g.line(LK.map(([x, y]) => [x, y, 0]).concat([[LK[0][0], LK[0][1], 0]]), { w: 0.6, c: '#5E8F8A', boil: false });
  }, { rim: true });

  /* ---------------- the palm avenue ---------------- */
  for (let y = -34; y <= 34; y += 6.8) for (const x of [-35.2, -28.8]) T.obj([x, y], (g) => RJ.imperial(g, x, y, { h: 19 + h1(Math.round(y * 3 + x)) * 2 }), { name: 'palmeira imperial' });
  T.obj([-34, -2, -30, 2], function (g) {
    K.cyl(g, -32, 0, 2.0, 0, 0.8, { t: '#8CC6D2', l: '#D9D3C6', r: '#BDB6A6' }, { w: 0.6, n: 14 });
    K.cyl(g, -32, 0, 0.5, 0.8, 3.6, '#C9C2B2', { w: 0.5, n: 8 });
    const t = g.p(-32, 0, 3.6); g.fill2([[t[0] - 1, t[1]], [t[0] + 1, t[1]], [t[0] + 0.7, t[1] - 5], [t[0] - 0.7, t[1] - 5]], '#B9B2A2', true); g.disc2([t[0], t[1] - 5.8], 0.9, '#B9B2A2');
    // at night the muse on her fountain is lit from the basin
    RJ.nightEach(g, 0, (c, d) => (d.k === K_FILL && c === '#8CC6D2' ? '#5FC0DA' : (d.k === K_FILL || d.k === K_DISC) && (c === '#B9B2A2' || c === '#C9C2B2') ? RJ.floodCol(c, 0.9, '#F2D29A') : undefined));
    for (const [x, y] of [[-33.6, 1.6], [-30.4, 1.6], [-30.4, -1.4]]) g.glow2('lantern', g.p(x, y, 1.0), g.p(x, y, 0), { r: 1.3, col: '#FFDDA0' });
  }, { name: 'chafariz das musas' });
  RJ.walker(T, RJ.who(5801), [[-32, -36], [-32, 36]], 0.9, { phase: 0.1 });
  RJ.walker(T, RJ.who(5802, { set: { sunhat: true } }), [[-31.6, 36], [-31.6, -36]], 0.8, { phase: 0.5 });

  /* ---------------- kiosks, the jetty, trees ---------------- */
  for (const [x, y, word, col] of [[27, 30, 'CAFÉ', '#2A8C7A'], [-20, -30, 'ÁGUA DE COCO', '#3A9A5B']]) {
    T.obj([x - 3, y - 3.4, x + 3, y + 3.4], (g) => RJ.kiosk(g, x, y, word, col), { name: 'quiosque' });
    T.cast([x - 4.6, y + 4.4], (g) => { for (const [dx, dy, s] of [[0, 0, 5810], [3.4, 1.6, 5812]]) { const f = g.p(x - 4.6 + dx, y + 4.4 + dy, 0); RJ.table2(g, f, '#F6F3EA', col); RJ.person(g, x - 5.8 + dx, y + 5 + dy, 1.3, Object.assign(RJ.who(s + x), { dir: 0, pose: 'sit', cup: '#F3F1EA' })); RJ.person(g, x - 3.4 + dx, y + 3.8 + dy, 1.3, Object.assign(RJ.who(s + 1 + x), { dir: 1, pose: 'sit' })); } }, {});
  }
  T.obj([26, 8, 36, 11], (g) => { K.box(g, 25, 8.4, 36, 10.6, -0.6, 0.3, { t: '#C9A26B', l: '#B58F58', r: '#9E7A48' }, { w: 0.6 }); const pl = []; for (let x = 25.5; x < 36; x += 1.1) { const a = g.p(x, 8.4, 0.31), b = g.p(x, 10.6, 0.31); pl.push(a[0], a[1], b[0], b[1]); } g.segs2(pl, '#8A6A4A', 0.25); }, { name: 'píer' });

  // trees along the shore path with people in their shade, a third kiosk on the far shore
  const out = ring(8.6);
  for (let i = 1; i < out.length; i += 3) { const [x, y] = out[i]; if (x < -26 || Math.abs(x) > 35.5 || Math.abs(y) > 35.5 || (Math.abs(x - 27) < 5 && Math.abs(y - 30) < 5) || (Math.abs(x + 20) < 5 && Math.abs(y + 30) < 5) || (x > 24 && y > 6 && y < 13)) continue; T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.6 + h1(i * 7) * 1.6, h: 4.6, col: ['#6E9C52', '#5E8F4E', '#7FAE5E'][i % 3] }), { name: 'árvore' }); if (i % 3 === 1) { const n = NRM[i]; const px = x + n[0] * 1.6 * sgn, py = y + n[1] * 1.6 * sgn; T.cast([px, py], (g) => RJ.person(g, px, py, 0, Object.assign(RJ.who(5900 + i), { dir: i % 2 ? 1 : 0, pose: i % 2 ? 'sit' : 'hold', cup: '#F3F1EA' })), {}); } }
  { const [x, y] = ring(9)[24]; if (Math.abs(x) < 34 && Math.abs(y) < 34) { T.obj([x - 3, y - 3.4, x + 3, y + 3.4], (g) => RJ.kiosk(g, x, y, 'SUCOS', '#E86A9A'), { name: 'quiosque' }); T.cast([x + 4.2, y + 1], (g) => { RJ.person(g, x + 4.2, y + 1, 0, Object.assign(RJ.who(5950), { dir: 2, pose: 'hold', cup: '#E86A9A' })); RJ.person(g, x + 4.6, y + 3.2, 0, Object.assign(RJ.who(5951), { dir: 2, pose: 'stand' })); }, {}); } }
  // a grove in the open grass of the near corner and the right side, families and a dog walker under it
  const LKF = []; for (const [a, b] of LK) LKF.push(a, b);
  const farFromShore = (x, y) => !pointInPoly(x, y, LKF) && LK.every(([a, b]) => Math.hypot(a - x, b - y) > 9.5);
  const R5 = RNG(5960); let ng = 0;
  for (let k = 0; k < 400 && ng < 24; k++) { const x = lerp(-24, 35, R5()), y = lerp(-35, 35, R5()); if (!farFromShore(x, y) || (Math.abs(x - 27) < 6 && Math.abs(y - 30) < 6) || (Math.abs(x + 20) < 6 && Math.abs(y + 30) < 6) || (Math.abs(x + 24) < 5 && Math.abs(y - 26) < 5)) continue; ng++; const tr = 3.4 + R5() * 2; T.obj([x, y], (g) => K.tree(g, x, y, { r: tr, h: 4.4, col: ['#6E9C52', '#5E8F4E', '#7FAE5E', '#4F8A45'][gi % 4] }), { name: 'árvore' });
    const gi = ng; if (gi % 2 === 0) { const px = x + 2.6, py = y + 2.2, c = ['#F2C230', '#2F6DB5', '#E86A9A', '#3A9A5B'][gi % 4]; T.cast([px, py], (g) => { g.fill([[px - 2, py - 1.4, 0.02], [px + 2, py - 1.4, 0.02], [px + 2, py + 1.4, 0.02], [px - 2, py + 1.4, 0.02]], c); RJ.person(g, px - 0.8, py + 0.3, 0, Object.assign(RJ.who(5970 + gi * 7), { dir: 0, pose: 'sit' })); RJ.person(g, px + 0.9, py - 0.2, 0, Object.assign(RJ.who(5971 + gi * 7), { dir: 1, pose: gi % 4 ? 'sit' : 'hold', cup: '#F3F1EA' })); }, {}); } }
  RJ.walker(T, RJ.who(5990), [[34, -34], [34, 34], [-20, 34], [34, 34]], 0.9, { phase: 0.2, extra: (g, st, r) => { const h = r.hands[0], d = st.dir === 0 || st.dir === 3 ? 1 : -1, c = [h[0] + d * 6, h[1] + 7]; g.fine2([h, c], { w: 0.25, c: '#5A564E' }); g.fill2([[c[0] - 2, c[1] - 1.6], [c[0] + 2, c[1] - 1.8], [c[0] + 2, c[1] - 0.4], [c[0] - 2, c[1]]], '#B07A44', true); g.disc2([c[0] + d * 2.4, c[1] - 2.4], 1.0, '#B07A44'); } });
  // a little wooded island in the middle with egrets on its shore
  T.obj([-7, 2, 1, 8], function (g) {
    const isl = K.curve([[-7, 5, 0], [-4, 2, 0], [0.5, 3.5, 0], [1, 7, 0], [-3, 8, 0]], 3, true);
    g.fill(isl.map((p) => [p[0], p[1], -0.6]), '#C9BBA0'); g.fill(isl, '#9DB27A'); g.outline(isl, { w: 0.5, c: '#5E7A3E', boil: false });
    K.tree(g, -3.5, 4.6, { r: 3.4, h: 4, col: '#5E8F4E' }); K.tree(g, -1, 6, { r: 2.6, h: 3.4, col: '#6E9C52' });
  }, { name: 'ilha' });
  /* ---------------- on the water ---------------- */
  // swan pedal boats: a white hull, a swan's neck and head at the bow, two pedalling under a little canopy
  for (let i = 0; i < 4; i++) {
    const cx = 7 + [-6, 8, 2, 12][i], cy = -2 + [-10, -4, 10, 8][i], rx = [6, 5, 7, 4][i], ry = [4, 5, 3.6, 3.4][i], per = 34 + i * 5, w1 = RJ.who(5820 + i * 2), w2 = RJ.who(5821 + i * 2);
    T.actor({ sample: 0.3, period: per, grow: false,
      at(t) { const a = (t / per + i * 0.27) * TAU * (i % 2 ? -1 : 1), q = Math.round((((Math.atan2(Math.cos(a) * ry * (i % 2 ? -1 : 1), -Math.sin(a) * rx * (i % 2 ? -1 : 1)) + TAU) % TAU) / (TAU / 16))) % 16; return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, z: -0.6, key: q, ang: q * TAU / 16 }; },
      draw(g, st) {
        const ca = Math.cos(st.ang), sa = Math.sin(st.ang), P = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z);
        const hull = [P(-1.8, -1.1, 0.8), P(1.4, -1.1, 0.8), P(2.0, 0, 0.9), P(1.4, 1.1, 0.8), P(-1.8, 1.1, 0.8)];
        g.fill2(arcPts(P(0, 0, 0)[0], P(0, 0, 0)[1], 7.6, 0, TAU, 12).map((q) => [q[0], P(0, 0, 0)[1] + (q[1] - P(0, 0, 0)[1]) * 0.4]), 'rgba(220,236,240,0.7)');
        g.fill2(hull, '#F6F4EE', true); g.line2(hull.concat([hull[0]]), { w: 0.4, c: '#8C8576', boil: false });
        const d = RJ.dirOf(ca, sa);
        RJ.person(g, -0.4 * ca - 0.5 * -sa, -0.4 * sa - 0.5 * ca, 0.9, Object.assign({}, w1, { dir: d, pose: 'sit', noLegs: true, k: 0.82 }));
        RJ.person(g, -0.4 * ca + 0.5 * -sa, -0.4 * sa + 0.5 * ca, 0.9, Object.assign({}, w2, { dir: d, pose: 'sit', noLegs: true, k: 0.82 }));
        const n0 = P(1.6, 0, 0.9), n1 = P(2.0, 0, 4.6), hd = P(2.6, 0, 4.4);
        g.line2([n0, [lerp(n0[0], n1[0], 0.5) + 1.2 * ca, lerp(n0[1], n1[1], 0.5)], n1], { w: 1.6, c: '#F6F4EE', boil: false, ext: 0 }); g.disc2(n1, 1.1, '#F6F4EE'); g.fill2([n1, hd, [n1[0], n1[1] + 0.8]], '#E6A43A', true);
        const cc = ['#E86A9A', '#F2C230', '#2F6DB5', '#3A9A5B'][i], po = []; for (const [u, v] of [[-1.5, -1.0], [0.3, -1.0], [0.3, 1.0], [-1.5, 1.0]]) { const a = P(u, v, 0.9), b = P(u, v, 4.0); po.push(a[0], a[1], b[0], b[1]); } g.segs2(po, '#8C8576', 0.35); const rf = [P(-1.8, -1.3, 4.0), P(0.6, -1.3, 4.0), P(0.6, 1.3, 4.0), P(-1.8, 1.3, 4.0)]; g.fill2(rf, cc, true); g.fill2([rf[0], rf[1], P(0.6, -1.3, 3.6), P(-1.8, -1.3, 3.6)], shade(cc, 0.15), true); g.line2(rf.concat([rf[0]]), { w: 0.35, c: shade(cc, 0.5), boil: false });
      } });
  }
  // the rowing eight: a long thin shell, eight rowers facing the stern, the cox at the back, oars sweeping
  T.actor({ sample: 0.3, period: 30, grow: false,
    at(t) { const u = (t / 30) % 1, f = u < 0.5 ? u * 2 : 2 - u * 2, x = lerp(-8, 22, smooth(f)), y = lerp(-20, 14, smooth(f)), ph = Math.floor((t * 1.6) % 1 * 4), dir = u < 0.5 ? 1 : -1; return { x: x + dir * 3, y: y + dir * 3, z: -0.6, key: dir + '.' + ph, dir, ph }; },
    draw(g, st) {
      const ang = Math.atan2(34, 30) + (st.dir < 0 ? Math.PI : 0), ca = Math.cos(ang), sa = Math.sin(ang), off = -3 * st.dir, P = (u, v, z) => g.p(u * ca - v * sa + off * Math.cos(Math.atan2(34, 30)), u * sa + v * ca + off * Math.sin(Math.atan2(34, 30)), z);
      g.fill2([P(-8, 0, 0.2), P(-6, -0.55, 0.2), P(6, -0.55, 0.2), P(8.4, 0, 0.2), P(6, 0.55, 0.2), P(-6, 0.55, 0.2)], '#F6F4EE', true);
      const sw = [-0.9, -0.3, 0.6, 0.2][st.ph], oars = [];
      for (let k = 0; k < 8; k++) { const u = -5.4 + k * 1.45, side = k % 2 ? 1 : -1, a = P(u, side * 0.5, 0.6), b = P(u + sw * 1.6, side * 4.2, 0); oars.push(a[0], a[1], b[0], b[1]); }
      g.segs2(oars, '#C9A26B', 0.45);
      const d = RJ.dirOf(-ca, -sa);
      for (let k = 7; k >= 0; k--) { const u = -5.4 + k * 1.45; const pt = [u * ca + off * Math.cos(Math.atan2(34, 30)), u * sa + off * Math.sin(Math.atan2(34, 30))]; RJ.person(g, pt[0], pt[1], 0.2, Object.assign(RJ.who(5840 + k, { carnaval: false }), { dir: d, pose: 'sit', noLegs: true, k: 0.75, top: '#2F6DB5', hands: [[3 + sw * 2, -8], [3.4 + sw * 2, -8.4]] })); }
      const cx = [-7 * ca + off * Math.cos(Math.atan2(34, 30)), -7 * sa + off * Math.sin(Math.atan2(34, 30))]; RJ.person(g, cx[0], cx[1], 0.2, Object.assign(RJ.who(5850, { carnaval: false }), { dir: RJ.dirOf(ca, sa), pose: 'sit', noLegs: true, k: 0.7, cap: '#F2C230' }));
    } });
  // a stand-up paddler
  T.actor({ sample: 0.3, period: 40, grow: false,
    at(t) { const a = (t / 40) * TAU, q = Math.floor(((a + Math.PI / 2) % TAU) / TAU * 8) % 8; return { x: 18 + Math.cos(a) * 7, y: 4 + Math.sin(a) * 9, z: -0.6, key: q + '.' + (Math.floor(t * 1.2) % 2), q, p: Math.floor(t * 1.2) % 2 }; },
    draw(g, st) { const ang = st.q / 8 * TAU; K.rbox(g, 0, 0, 2.2, 0.5, ang, 0, 0.2, { t: '#F2C230', l: '#E0B020', r: '#C99A18' }, { w: 0.4 }); const r = RJ.person(g, 0, 0, 0.2, Object.assign(RJ.who(5860), { dir: RJ.dirOf(Math.cos(ang), Math.sin(ang)), pose: 'stand', hands: st.p ? [[2.4, -14], [2.8, -9]] : [[-1, -14], [-0.4, -9]], top: '#E86A9A' })); const h = r.hands[0]; g.line2([[h[0], h[1] - 2], [h[0] + 0.6, h[1] + 9]], { w: 0.45, c: '#3A3530', boil: false }); } });

  /* ---------------- the banks: cyclists, joggers, capybaras, egrets, a picnic ---------------- */
  const cyc = ring(2.8);
  const ROUTE = []; for (let i = 0; i < cyc.length; i += 2) ROUTE.push(cyc[i]);
  for (let k = 0; k < 3; k++) {
    const look = RJ.who(5870 + k), L = [0]; for (let i = 0; i < ROUTE.length; i++) { const a = ROUTE[i], b = ROUTE[(i + 1) % ROUTE.length]; L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    const TOT = L[L.length - 1], sp = 4.2 + k * 0.5;
    T.actor({ sample: 0.25, period: TOT / sp,
      at(t) { let d = ((t * sp + k * TOT / 3) % TOT + TOT) % TOT, i = 0; while (i < ROUTE.length - 1 && d > L[i + 1]) i++; const a = ROUTE[i], b = ROUTE[(i + 1) % ROUTE.length], u = (d - L[i]) / (L[i + 1] - L[i]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]), q = Math.round(((ang + TAU) % TAU) / (TAU / 16)) % 16; return { x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), key: q, ang: q * TAU / 16 }; },
      draw(g, st) { K.bike(g, st.ang, { col: '#EE8A2E', who: look, seed: 5870 + k }); } });
  }
  const jog = ring(4.4), JR = []; for (let i = 0; i < jog.length; i += 2) JR.push(jog[i]);
  RJ.walker(T, RJ.who(5880, { set: { top: '#F2C230', shorts: true } }), JR, 2.6, { phase: 0.2 });
  RJ.walker(T, RJ.who(5881), JR.slice().reverse(), 1.1, { phase: 0.6 });
  RJ.walker(T, RJ.who(5882, { set: { dress: '#5FC0B0', fem: true } }), JR, 1.0, { phase: 0.4 });
  // capybaras grazing on the bank
  for (const [x, y, s, d] of [[-20, 12, 1, 1], [-22.4, 14.6, 0.8, 1], [-18.2, 15.6, 0.6, -1]]) T.cast([x, y], (g) => {
    const c = g.p(x, y, 0), k = s * 1.25, R2 = [c[0], c[1] - 3.2 * k];
    g.fill2(arcPts(R2[0], R2[1], 3.4 * k, 0, TAU, 12).map((q) => [q[0], R2[1] + (q[1] - R2[1]) * 0.62]), '#9A6E44', true);
    g.fill2([[R2[0] + d * 2.4 * k, R2[1] - 1.6 * k], [R2[0] + d * 4.8 * k, R2[1] - 0.6 * k], [R2[0] + d * 4.8 * k, R2[1] + 1.0 * k], [R2[0] + d * 2.4 * k, R2[1] + 1.2 * k]], '#8A603A', true);
    g.disc2([R2[0] + d * 3.4 * k, R2[1] - 1.0 * k], 0.25 * k, '#2A2622'); g.disc2([R2[0] + d * 2.6 * k, R2[1] - 1.9 * k], 0.45 * k, '#7A5230');
    g.segs2([R2[0] - 2 * k, R2[1] + 1.6 * k, R2[0] - 2 * k, c[1], R2[0] + 1.6 * k, R2[1] + 1.6 * k, R2[0] + 1.6 * k, c[1]], '#6E4E30', 0.8 * k);
    g.line2(arcPts(R2[0], R2[1], 3.4 * k, Math.PI * 1.1, Math.PI * 1.9, 6).map((q) => [q[0], R2[1] + (q[1] - R2[1]) * 0.62]), { w: 0.35, c: '#5A3E26', boil: false });
  }, {});
  for (const [x, y] of [[29, -10], [-15, -16]]) T.cast([x, y], (g) => { const c = g.p(x, y, 0); g.segs2([c[0], c[1], c[0] + 0.4, c[1] - 3, c[0] + 0.8, c[1], c[0] + 0.4, c[1] - 3], '#E6A43A', 0.3); g.fill2([[c[0] - 1.4, c[1] - 3], [c[0] + 1.6, c[1] - 3.6], [c[0] + 1.2, c[1] - 5], [c[0] - 1, c[1] - 4.6]], '#F6F4EE', true); g.line2([[c[0] + 1.2, c[1] - 4.6], [c[0] + 1.8, c[1] - 7.4], [c[0] + 3, c[1] - 7.6]], { w: 0.5, c: '#F6F4EE', boil: false }); g.segs2([c[0] + 3, c[1] - 7.6, c[0] + 4.8, c[1] - 7.2], '#E6A43A', 0.4); }, {});
  T.cast([-24, 26], (g) => { g.fill([[-27, 24.4, 0.02], [-22, 24.4, 0.02], [-22, 28, 0.02], [-27, 28, 0.02]], '#E86A9A'); g.fill([[-27, 25.6, 0.03], [-22, 25.6, 0.03], [-22, 26.4, 0.03], [-27, 26.4, 0.03]], '#F6F3EA'); RJ.person(g, -26, 26.6, 0, Object.assign(RJ.who(5890), { dir: 0, pose: 'sit' })); RJ.person(g, -23.4, 25.4, 0, Object.assign(RJ.who(5891), { dir: 1, pose: 'sit' })); RJ.person(g, -24.6, 27.8, 0, Object.assign(RJ.who(5892, { set: { k: 0.72 } }), { dir: 0, pose: 'kneel' })); }, {});
});
