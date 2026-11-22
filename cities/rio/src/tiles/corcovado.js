'use strict';
/* (-100,-100) Corcovado and the Christ, with Parque Lage at its foot. The top vertex of the map: the Christ looks out
   over the whole city towards the viewer, arms level across the screen.
   Built: Corcovado as a granite object — the "hunchback", a steep peak whose flanks are Tijuca forest and whose
   shaded right face is a bare cliff; the summit platform with its rail; on it the pedestal and the statue (Art Deco,
   reinforced concrete clad in pale soapstone: a straight robe with vertical folds, arms held out level with the
   sleeves hanging, the head bowed a little). The red rack train climbs the lit face on its track. Below, Parque
   Lage: the Italianate palazzo round a courtyard pool (two-storey wings at the back and left, a low arcade at the
   front and right so the pool shows), a lawn with a pond, imperial palms, forest round the edges.
   Who: tourists on the summit copying the Christ's pose for photos, a helicopter circling, people riding the train,
   café tables round the pool, a fashion shoot on the palazzo steps, picnickers on the lawn, hikers starting up the
   trail, marmosets in a tree. */
SF.tile('corcovado', -100, -100, { rim: 4 }, function (T) {
  const PK = [-12, -12];
  const CR = [[0, 22, 20, 0, 0], [6, 20, 18, 0.8, -0.6], [12, 17.5, 15.6, 1.8, -1.4], [18, 15, 13.2, 2.8, -2.2], [24, 12.4, 10.8, 3.6, -2.9], [30, 9.8, 8.6, 4.3, -3.4], [35, 7.4, 6.6, 4.8, -3.8], [39.5, 5.4, 4.8, 5.0, -4.0], [43, 3.8, 3.4, 5.1, -4.1], [45.4, 3.0, 2.7, 5.1, -4.1], [46.4, 2.9, 2.6, 5.1, -4.1]];
  const TOP = 46.4, SX = PK[0] + 5.1, SY = PK[1] - 4.1;          // the summit platform's centre
  const CW = RJ.rockW(PK[0], PK[1], CR, { seed: 31, rough: 0.1 });
  // the rack railway: a track climbing the lit face (ring index, angle) from the base to just below the summit
  const TRK = []; for (let k = 0; k <= 30; k++) { const u = k / 30, fi = u * 7.6, th = lerp(1.9, 0.95, u) + 0.12 * Math.sin(u * 9); const i = Math.floor(fi); TRK.push(CW(Math.min(i, CR.length - 2), th, fi - i)); }
  for (const p of TRK) { p[2] += 0.15; }

  /* ---------------- ground: forest floor, the lawn, paths ---------------- */
  T.ground(function (g) {
    K.slab(g, 37, { top: '#8FAF72' });
    g.grass(K.rect(-37, -37, 37, 37), { dens: 0.4 });
    const lawn = [[2, 4, 0], [36, 2, 0], [36, 36, 0], [4, 36, 0]]; g.fill(lawn, '#B5CF8E'); g.grass(lawn, { dens: 0.7 });
    // gravel paths to the palazzo and round the pond
    for (const seg of [[[36, 21], [31, 21]], [[18, 36], [18, 33]], [[5, 21], [2, 21], [-4, 14]]]) { const pts = K.curve(seg.map((p) => [p[0], p[1], 0]), 4); for (let i = 0; i < pts.length - 1; i++) g.line([pts[i], pts[i + 1]], { w: 2.2, c: '#E3D8BE', boil: false, ext: 0 }); }
    const pond = K.curve([[-30, 18, 0], [-22, 14, 0], [-14, 18, 0], [-15, 27, 0], [-24, 31, 0], [-31, 26, 0]], 5, true);
    g.fill(pond.map((p) => [p[0], p[1], -0.4]), '#7FB6A8'); g.water(pond.map((p) => [p[0], p[1], -0.4]), { dens: 0.6 }); g.outline(pond, { w: 0.6, c: '#4F7F6E', boil: false });
  }, { rim: true });

  /* ---------------- the mountain, the train track, the summit ---------------- */
  T.obj([PK[0] - 22, PK[1] - 20, PK[0] + 22, PK[1] + 20], function (g) {
    g.boilP = 0.15;
    RJ.rock(g, PK[0], PK[1], CR, { seed: 31, rough: 0.1, col: '#B3AD9F', forest: '#4F8A45', bare: [[-0.76, 0.32, 2, 10], [0.32, 0.95, 6, 10]], canopy: 260,
      extra: (gg) => {
        // the track: two rails and the rack between, sleepers across
        gg.fine(TRK, { w: 0.55, c: '#5A4A3C' }); gg.fine(TRK.map((p) => [p[0] + 0.5, p[1] + 0.5, p[2]]), { w: 0.4, c: '#7A6A55' });
      } });
    // the platform: a stone terrace on the summit with a rail round it, steps down to the train station
    const pl = []; for (let i = 0; i < 20; i++) { const a = TAU * i / 20; pl.push([SX + Math.cos(a) * 4.6, SY + Math.sin(a) * 4.0, TOP]); }
    g.fill(pl, '#E9E4D6');
    const fr = []; for (let i = 0; i <= 10; i++) { const a = -Math.PI / 4 + Math.PI * i / 10; fr.push([SX + Math.cos(a) * 4.6, SY + Math.sin(a) * 4.0, TOP]); }
    g.fill(fr.concat(fr.slice().reverse().map((p) => [p[0], p[1], TOP - 2.6])), '#CFC8B8'); g.scratch(fr.concat(fr.slice().reverse().map((p) => [p[0], p[1], TOP - 2.4])), { c: '#B3AB98' }); g.line(fr, { w: 0.6, boil: false });
    g.fine(fr.map((p) => [p[0], p[1], p[2] + 1.0]), { w: 0.35, c: '#5A564E' });
    // at night: lamps along the platform's rail
    for (let i = 1; i < 10; i += 2) { const p = fr[i]; g.glow('lamp', p[0], p[1], p[2] + 1.1, { r: 0.8, base: TOP }); }
  }, { name: 'corcovado' });
  // the pedestal and the statue
  T.obj([SX - 1.4, SY - 1.4, SX + 1.4, SY + 1.4], function (g) {
    K.box(g, SX - 1.3, SY - 1.3, SX + 1.3, SY + 1.3, TOP, TOP + 3.4, { t: '#E9E6DC', l: '#E4E1D4', r: '#C9C5B7' }, { w: 0.7 });
    K.box(g, SX - 1.55, SY - 1.55, SX + 1.55, SY + 1.55, TOP + 3.4, TOP + 3.8, { t: '#EFECE3', l: '#E9E6DC', r: '#CFCBBE' }, { w: 0.5 });
    const b = g.p(SX, SY, TOP + 3.8), H = 13 * VZ, L = '#E9E7DC', D = '#C8C6B8', ink = '#5A564A';
    const P = (u, v) => [b[0] + u, b[1] - v];
    // the robe: a long column, a little wider at the hem, the right half in shade, folds running down it
    const robe = [P(-4.0, 0), P(4.0, 0), P(3.4, H * 0.45), P(3.9, H * 0.76), P(-3.9, H * 0.76), P(-3.4, H * 0.45)];
    g.fill2(robe, L, true); g.fill2([P(0.7, 0), P(4.0, 0), P(3.4, H * 0.45), P(3.9, H * 0.76), P(0.5, H * 0.76)], D, true);
    g.segs2([P(-2.0, 0.5)[0], P(-2.0, 0.5)[1], P(-1.4, H * 0.72)[0], P(-1.4, H * 0.72)[1], P(-0.6, 0.5)[0], P(-0.6, 0.5)[1], P(-0.3, H * 0.6)[0], P(-0.3, H * 0.6)[1], P(1.6, 0.5)[0], P(1.6, 0.5)[1], P(1.3, H * 0.7)[0], P(1.3, H * 0.7)[1], P(2.9, 0.5)[0], P(2.9, 0.5)[1], P(2.6, H * 0.4)[0], P(2.6, H * 0.4)[1]], '#A9A797', 0.4);
    // the arms held out level and thick with cloth, tapering to the hands; the sleeves hang in deep folds below
    const ay = H * 0.74, span = 21;
    for (const sd of [-1, 1]) { const sl = [P(sd * 3.6, ay - 1.8), P(sd * 14, ay - 1.6), P(sd * 12.4, ay - 6.4), P(sd * 7, ay - 8.8), P(sd * 3.8, ay - 9.2)]; g.fill2(sl, sd < 0 ? L : D, true); g.line2(sl.slice(1), { w: 0.45, c: ink, boil: false }); g.segs2([P(sd * 9, ay - 2)[0], P(sd * 9, ay - 2)[1], P(sd * 8.4, ay - 7.4)[0], P(sd * 8.4, ay - 7.4)[1]], '#A9A797', 0.35); }
    const arm = [P(-span, ay - 0.7), P(-4.2, ay - 2.2), P(4.2, ay - 2.2), P(span, ay - 0.7), P(span, ay + 1.5), P(4.2, ay + 2.0), P(-4.2, ay + 2.0), P(-span, ay + 1.5)];
    g.fill2(arm, L, true); g.fill2([P(0.5, ay - 2.2), P(4.2, ay - 2.2), P(span, ay - 0.7), P(span, ay + 1.5), P(4.2, ay + 2.0), P(0.5, ay + 2.0)], D, true);
    for (const sd of [-1, 1]) g.fill2([P(sd * span, ay - 0.7), P(sd * (span + 1.6), ay - 0.4), P(sd * (span + 1.5), ay + 1.2), P(sd * span, ay + 1.5)], sd < 0 ? shade(L, 0.05) : D, true);
    // the neck and the head bowed a little
    g.fill2([P(-0.9, ay + 1.6), P(0.9, ay + 1.6), P(0.8, ay + 2.8), P(-0.8, ay + 2.8)], D, true);
    const hc = P(0.4, ay + 5.0); g.disc2(hc, 2.5, L); g.fill2(arcPts(hc[0] + 0.5, hc[1], 2.5, -Math.PI / 2, Math.PI / 2, 6), D, true);
    g.line2(arcPts(hc[0], hc[1], 2.55, 0, TAU, 14), { w: 0.5, c: ink, boil: false });
    g.line2(robe.concat([robe[0]]), { w: 0.65, c: ink, boil: false }); g.line2(arm.concat([arm[0]]), { w: 0.65, c: ink, boil: false });
    // at night the statue is floodlit in cold white LED light from the platform (since 2011): it stands out bright over the dark
    // forest, seen from the whole city; the shaded side a cool blue-grey, the folds still drawn
    const XN = { '#E9E7DC': '#F3F6FF', '#C8C6B8': '#AEB9D8', '#A9A797': '#8E98B8', '#E9E6DC': '#E6EAF6', '#E4E1D4': '#DDE2F0', '#C9C5B7': '#A3AECB', '#EFECE3': '#EEF1FA', '#CFCBBE': '#AFB9D2', [shade(L, 0.05)]: '#E8ECFA' };
    RJ.nightEach(g, 0, (c) => XN[c]);
    for (const [z, r] of [[TOP + 2, 3.2], [TOP + 8, 3.6], [TOP + 13, 3.4], [TOP + 15.5, 2.8]]) g.glow('lantern', SX, SY, z, { r, col: '#DCE8FF', base: TOP });
    for (const sd of [-1, 1]) g.glow2('lantern', [b[0] + sd * 15, b[1] - ay], g.p(SX, SY, TOP), { r: 2.2, col: '#DCE8FF' });
  }, { name: 'cristo', on: true });
  // tourists on the platform copying the pose, a photographer lying on the ground for the shot
  for (const [dx, dy, s, pose] of [[-2.6, 2.8, 6200, 'arms'], [1.4, 3.3, 6201, 'arms'], [3.2, 1.0, 6202, 'phone'], [-3.4, 0.6, 6203, 'arms']])
    T.cast([SX + dx, SY + dy], (g) => RJ.person(g, SX + dx, SY + dy, TOP, Object.assign(RJ.who(s), pose === 'arms' ? { dir: 1, pose: 'stand', hands: [[-8.5, -15.4], [8.5, -15.4]], k: 0.8 } : { dir: 2, pose: 'hold', phone: true, k: 0.8 })), { on: true });
  T.cast([SX + 0.5, SY + 3.6], (g) => RJ.person(g, SX + 0.5, SY + 3.6, TOP + 0.2, Object.assign(RJ.who(6205), { lie: -2.4, pose: 'stand', dir: 0, k: 0.8 })), { on: true });

  /* ---------------- the train climbing and coming down ---------------- */
  const TL = TRK.length - 1, TP = 40;
  for (const car of [0, 1]) {
    const looks = [RJ.who(6210 + car * 3), RJ.who(6211 + car * 3)];
    T.actor({ sample: 0.4, period: TP, grow: false,
      at(t) {
        const u = ((t / TP) % 1 + 1) % 1, f = u < 0.1 ? 0 : u < 0.5 ? smooth((u - 0.1) / 0.4) : u < 0.6 ? 1 : 1 - smooth((u - 0.6) / 0.4);
        const s = clamp(f * TL - car * 1.1, 0, TL - 0.001), i = Math.floor(s), a = TRK[i], b = TRK[i + 1], fr = s - i;
        const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), q = Math.round(ang / (TAU / 24));
        return { x: lerp(a[0], b[0], fr), y: lerp(a[1], b[1], fr), z: lerp(a[2], b[2], fr), key: q, ang: q * TAU / 24 };
      },
      draw(g, st) {
        const B = K.rbox(g, 0, 0, 1.6, 0.9, st.ang, 0.3, 2.3, { t: '#E9E2CC', l: '#C9392E', r: '#A8302A' }, { w: 0.6 });
        for (const f of ['pv', 'nv']) g.lit({ nc: '#FFE3A6' }, () => { K.rwin(g, B, f, -0.85, -0.1, 1.2, 2.0); K.rwin(g, B, f, 0.1, 0.85, 1.2, 2.0); });   // (night: lit inside)
        const p = g.p.apply(g, B.pt(0, 0.95, 1.7)); g.disc2([p[0] - 1.2, p[1]], 0.75, looks[0].skin); g.disc2([p[0] + 1.4, p[1] - 0.6], 0.75, looks[1].skin);
        K.rbox(g, 0, 0, 1.75, 1.0, st.ang, 2.3, 2.6, '#F3F1EA', { w: 0.5 });
      } });
  }
  /* ---------------- the helicopter circling the Christ ---------------- */
  T.actor({ sample: 0.3, period: 30, layer: 'top', grow: false,
    at(t) { const q = Math.floor(((t / 30) % 1) * 36), a = q / 36 * TAU, r = Math.floor(t * 6) % 2; return { x: SX + Math.cos(a) * 17, y: SY + Math.sin(a) * 14, z: TOP + 13 + Math.sin(a * 2) * 1.5, key: q + '.' + r, a, r }; },
    draw(g, st) { RJ.heli(g, st.a + Math.PI / 2, st.r); } });

  /* ---------------- Parque Lage: the palazzo round its courtyard pool ---------------- */
  const PAL = '#EAD9B8', PALt = { t: '#E3D0AC', l: '#EAD9B8', r: '#D5C29E' };
  T.obj([6, 9, 30, 14], function (g) {     // the back wing: two storeys, arched windows, a balustrade
    K.box(g, 6, 9, 30, 14, 0, 8.2, PALt, { w: 0.9 });
    for (let x = 7.5; x < 29; x += 2.6) { K.win(g, 'L', 14, x, x + 1.2, 1.4, 3.8, { style: 'dark', arch: true }); K.win(g, 'L', 14, x, x + 1.2, 5.0, 7.0, { style: 'navy' }); }
    K.box(g, 5.6, 8.6, 30.4, 14.4, 8.2, 8.9, '#F1E6CF', { w: 0.6 });
    RJ.flood(g, 0, 0.55, '#F2C890');                                        // (night: the palazzo floodlit warm)
  }, { name: 'palazzo' });
  T.obj([6, 14, 11, 32], function (g) {    // the left wing
    K.box(g, 6, 14, 11, 32, 0, 8.2, PALt, { w: 0.9 });
    for (let y = 15.5; y < 31; y += 2.6) { K.win(g, 'R', 11, y, y + 1.2, 1.4, 3.8, { style: 'dark', arch: true }); K.win(g, 'R', 11, y, y + 1.2, 5.0, 7.0, { style: 'navy' }); }
    K.box(g, 5.6, 14, 11.4, 32.4, 8.2, 8.9, '#F1E6CF', { w: 0.6 });
    RJ.flood(g, 0, 0.55, '#F2C890');
  }, { name: 'palazzo' });
  // the courtyard: the pool with its stone rim, tables round it (ground-level things drawn as one low object)
  T.obj([11, 14, 25.5, 27.5], function (g) {
    g.fill(K.rect(11, 14, 25.5, 27.5), '#E9E1CF');
    const pool = K.rect(14, 17, 23, 24.5); g.fill(pool.map((p) => [p[0], p[1], -0.3]), '#6FB8C8'); g.mark({ nc: '#3FA6C4' }); g.water(pool.map((p) => [p[0], p[1], -0.3]), { dens: 0.5 }); g.outline(pool, { w: 0.6, c: '#8C8576', boil: false });
    // at night the courtyard is lit for dinner at the café: the pool glows from below, lanterns at its corners
    RJ.nightEach(g, 0, (c, d) => (d.k === K_FILL && c === '#E9E1CF' ? RJ.litCol(c, 0.4) : undefined));
    g.glow('lantern', 18.5, 20.75, 0.1, { r: 3.6, col: '#6FE0F0', base: -0.3 });
    for (const [x, y] of [[13.4, 16.4], [23.6, 16.4], [13.4, 25.1], [23.6, 25.1]]) g.glow('lamp', x, y, 2.4, { r: 1.0 });
  }, { name: 'courtyard' });
  const TABLES = [[12.6, 15.6], [12.6, 25.6], [24, 15.6], [16, 26], [21, 26]];
  TABLES.forEach(([x, y], i) => T.cast([x, y], (g) => {
    const f = g.p(x, y, 0); RJ.table2(g, f, i % 2 ? '#F3F1EA' : '#3A9A5B', '#F3F1EA');
    RJ.person(g, x - 1.2, y + 0.5, 1.3, Object.assign(RJ.who(6220 + i * 2), { dir: 0, pose: 'sit', cup: '#F3F1EA' }));
    RJ.person(g, x + 1.2, y - 0.5, 1.3, Object.assign(RJ.who(6221 + i * 2), { dir: 1, pose: 'sit' }));
  }, { on: true }));
  T.obj([25.5, 14, 30, 32], function (g) {     // the low arcade on the right, the front arcade
    K.box(g, 25.5, 14, 30, 32, 0, 3.6, PALt, { w: 0.8 });
    for (let y = 15; y < 31; y += 2.4) K.win(g, 'R', 30, y, y + 1.4, 0, 2.8, { style: 'dark', arch: true });
    K.box(g, 25.1, 13.6, 30.4, 32.4, 3.6, 4.1, '#F1E6CF', { w: 0.5 });
    RJ.flood(g, 0, 0.55, '#F2C890'); for (const y of [17, 23, 29]) RJ.wallLamp(g, 'R', 30, y, 3.0, 1.0);
  }, { name: 'arcade' });
  T.obj([11, 27.5, 25.5, 32], function (g) {
    K.box(g, 11, 27.5, 25.5, 32, 0, 3.6, PALt, { w: 0.8 });
    for (let x = 12; x < 25; x += 2.4) K.win(g, 'L', 32, x, x + 1.4, 0, 2.8, { style: 'dark', arch: true });
    K.box(g, 10.6, 27.1, 25.9, 32.4, 3.6, 4.1, '#F1E6CF', { w: 0.5 });
    K.text(g, 'L', 32.42, 18.2, 3.66, 0.4, 'PARQUE LAGE', '#7A6A55', { center: true, w: 0.34 });
    RJ.flood(g, 0, 0.55, '#F2C890'); for (const x of [13, 23.5]) RJ.wallLamp(g, 'L', 32, x, 3.0, 1.0);
  }, { name: 'arcade' });
  // the fashion shoot at the front steps, picnickers on the lawn
  T.cast([18, 34], (g) => { RJ.person(g, 17, 33.4, 0, Object.assign(RJ.who(6240), { dir: 1, pose: 'wave', dress: '#E86A9A', fem: true, hairStyle: 'long', ph: 0.2 })); RJ.person(g, 20.6, 35.6, 0, Object.assign(RJ.who(6241, { carnaval: false }), { dir: 2, pose: 'hold', phone: true, top: '#2A2622' })); }, {});
  for (const [x, y, s, c] of [[32, 6, 6250, '#E86A9A'], [30, 34.5, 6252, '#F2C230']]) T.cast([x, y], (g) => {
    g.fill([[x - 2, y - 1.6, 0.02], [x + 2, y - 1.6, 0.02], [x + 2, y + 1.6, 0.02], [x - 2, y + 1.6, 0.02]], c);
    RJ.person(g, x - 0.8, y + 0.4, 0, Object.assign(RJ.who(s), { dir: 0, pose: 'sit' })); RJ.person(g, x + 1.0, y - 0.2, 0, Object.assign(RJ.who(s + 1), { dir: 1, pose: 'sit' }));
  }, {});
  // imperial palms by the entrance path, forest trees round the edges, marmosets
  for (const y of [18.6, 23.4]) for (const x of [33, 36]) T.obj([x, y], (g) => RJ.imperial(g, x, y, { h: 17 }), { name: 'palm' });
  const TREES = [[-34, 30], [-26, 35], [-10, 34], [-4, 26], [0, 35], [-35, 5], [-33, 12], [34, -3], [26, -8], [35, -30], [20, -33], [-2, 8], [30, 3]];
  TREES.forEach(([x, y], i) => T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.6 + h1(i) * 1.6, h: 4.6, col: ['#5E8F4E', '#6E9C52', '#4F8A45'][i % 3] }), { name: 'tree' }));
  T.cast([-4.2, 26.2], function (g) {
    for (const [dx, dy, s] of [[-1.6, -16, 1], [1.4, -13, 0.8]]) {
      const c = g.p(-4, 26, 0), p = [c[0] + dx * 3, c[1] + dy];
      g.fill2(arcPts(p[0], p[1], 1.4 * s, 0, TAU, 8).map((q) => [q[0], p[1] + (q[1] - p[1]) * 0.8]), '#7E7A72', true);
      g.disc2([p[0] + 1.3 * s, p[1] - 1.1 * s], 0.9 * s, '#6E6A62'); g.disc2([p[0] + 1.7 * s, p[1] - 1.4 * s], 0.42 * s, '#F3F1EA');
      g.line2([[p[0] - 1.2 * s, p[1] + 0.4], [p[0] - 2.6 * s, p[1] + 2.2], [p[0] - 2.2 * s, p[1] + 4.4]], { w: 0.5 * s, c: '#5A564E', boil: false });
    }
  }, { on: true });
  // hikers starting up the trail, visitors crossing the lawn, ducks on the pond
  RJ.walker(T, RJ.who(6260, { carnaval: false, set: { cap: '#3A9A5B' } }), [[34, 21], [5, 21], [-3, 15], [5, 21]], 1.0, { phase: 0.1 });
  RJ.walker(T, RJ.who(6261), [[18, 35.5], [33, 35.5], [33, 26], [33, 35.5]], 1.1, { phase: 0.5 });
  RJ.walker(T, RJ.who(6262, { carnaval: false }), [[-6, 13], [2, 21], [34, 21.6], [2, 21]], 0.9, { phase: 0.8 });
  for (let i = 0; i < 3; i++) T.actor({ sample: 0.5, period: 30, grow: false,
    at(t) { const a = (t / 30 + i * 0.12) * TAU; return { x: -22 + Math.cos(a) * 4.5, y: 22 + Math.sin(a) * 3.5, z: -0.4, key: Math.round(((a + Math.PI / 2) % TAU) / (TAU / 8)) % 8 }; },
    draw(g, st) { const c = g.p(0, 0, 0), d = st.key < 4 ? 1 : -1; g.fill2(arcPts(c[0], c[1] - 0.6, 1.3, 0, TAU, 8).map((q) => [q[0], c[1] - 0.6 + (q[1] - c[1] + 0.6) * 0.55]), '#F3F1EA', true); g.disc2([c[0] + d * 1.1, c[1] - 1.6], 0.55, '#F3F1EA'); g.disc2([c[0] + d * 1.6, c[1] - 1.5], 0.25, '#E6A43A'); } });
});
