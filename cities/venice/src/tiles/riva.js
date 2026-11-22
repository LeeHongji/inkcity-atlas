'use strict';
/* (100, -100) The Riva degli Schiavoni, the prisons, the Bridge of Sighs, and the Arsenale's gate.
   - The Prigioni Nuove on the rio di Palazzo: a massive building of rusticated Istrian stone with a Doric portico on
     the Riva; the Bridge of Sighs (drawn by this place, its far bank) leaps from it to the Doge's Palace.
   - The Ponte della Paglia at the rio's mouth, crowded with people photographing the Bridge of Sighs.
   - The Hotel Danieli: a pink gothic palazzo with ogee windows and balconies, flags over its door.
   - The Riva itself: a broad stone promenade on the Bacino, souvenir stalls (masks, glass, scarves), lamps, an
     accordion player, Carnival costumes posing for photos, people waiting at the San Zaccaria vaporetto stop.
   - Behind: the white front of San Zaccaria in its campo; at the far corner the Arsenale's land gate (a triumphal
     arch with the winged lion) between brick towers with their crenellations, two stone lions guarding it.
   What moves: strollers on the Riva, the crowd on the bridge (some turning to snap), the accordion's bellows, flags. */
SF.tile('riva', 100, -100, { rim: 14 }, function (T) {
  const P = VN.PLASTER;
  T.ground(function (g) {
    g.boilP = 0.15;
    K.slab(g, 37, { top: VN.paveC });
    VN.pave(g, -37, -37, 37, 37, { col: '#D2CCC0', step: 2.6 });
    // the Riva's broad Istrian paving in long white courses
    g.fill(K.rect(25, -37, 37, 37), '#E2DED4');
    const rc = []; for (let x = 26.5; x < 37; x += 2.2) { const a = g.p(x, -37, 0), b = g.p(x, 37, 0); rc.push(a[0], a[1], b[0], b[1]); } g.segs2(rc, '#CFC9BC', 0.35);
    g.fill(K.rect(36.3, -37, 37, 37), VN.istria); g.fill(K.rect(-37, 36.3, 25, 37), VN.istria);
  }, { rim: true });
  VN.finish(T);   // the Bridge of Sighs and the Ponte della Paglia's far half belong to this bank
  const H = (d, nm) => T.obj([d.x0, d.y0, d.x1, d.y1], (g) => VN.house(g, d), { name: nm || 'house' });

  /* ---------- the prisons ---------- */
  T.obj([-4, 24, 24, 37], function (g) {
    g.boilP = 0.2;
    const S = { t: '#DCD6CA', l: '#EAE5DA', r: '#D7D0C2' }, Z = 14, W = VN.WL;
    K.box(g, -4, 24, 24, 37, W, Z, S, { w: 0.95 });
    // rustication: courses and joints on the two faces we see
    for (const [f, p, a0, a1] of [['L', 37, -4, 24], ['R', 24, 24, 37]]) {
      const cs = []; for (let z = W + 0.8; z < Z; z += 0.9) { const A = g.p.apply(g, K.pt(f, p + 0.01, a0, z)), B = g.p.apply(g, K.pt(f, p + 0.01, a1, z)); cs.push(A[0], A[1], B[0], B[1]); }
      for (let a = a0 + 0.8; a < a1; a += 1.8) for (let z = W + 0.8, k = 0; z < 5; z += 0.9, k++) { const A = g.p.apply(g, K.pt(f, p + 0.01, a + (k % 2) * 0.9, z)), B = g.p.apply(g, K.pt(f, p + 0.01, a + (k % 2) * 0.9, z + 0.9)); cs.push(A[0], A[1], B[0], B[1]); }
      g.segs2(cs, '#C3BCAE', 0.3);
      for (let a = a0 + 1.4; a < a1 - 1; a += 2.8) VN.win(g, f, p + 0.02, a, a + 1.2, 6.2, 8.6, { sh: null, pane: '#3A3530', frameCol: '#F3F0E8', lit: 0.15 });
      for (let a = a0 + 1.4; a < a1 - 1; a += 2.8) { VN.win(g, f, p + 0.02, a, a + 1.2, 10.2, 12.4, { sh: null, pane: '#3A3530', frameCol: '#F3F0E8', lit: false }); const q = g.P(K.on(f, p + 0.04, a, a + 1.2, 10.2, 12.4)); const br = []; for (let i = 1; i < 4; i++) br.push(lerp(q[0][0], q[1][0], i / 4), lerp(q[0][1], q[1][1], i / 4), lerp(q[3][0], q[2][0], i / 4), lerp(q[3][1], q[2][1], i / 4)); g.segs2(br, '#C9C2B4', 0.35); }
    }
    g.fill(K.on('L', 37.01, -4, 24, W, W + 0.6), '#6F8A62');
    // the portico on the Riva: Doric columns under the first floor
    g.fill(K.on('R', 24.02, 25, 36, 0, 5), '#5E564C'); g.mark({ nc: '#9A6A44' });                       // the portico lit at night
    for (const a of [27.4, 33.6]) VN.glowDry(g, 'lamp', 24.6, a, 4.2, { r: 1.3 });   // (no reflection: the Paglia is in front)
    const cl = []; for (let a = 25.2; a < 36.5; a += 2.2) { const A = g.p(24.3, a, 0), B = g.p(24.3, a, 5); cl.push(A[0], A[1], B[0], B[1]); } g.segs2(cl, '#E9E4D9', 1.4);
    K.box(g, -4.3, 23.7, 24.3, 37.3, Z, Z + 0.7, { t: '#E9E4D9', l: '#F3F0E8', r: '#DCD6CA' }, { w: 0.6 });
    K.hip(g, -3.6, 24.4, 23.6, 36.6, Z + 0.7, 2.4, VN.roof, { ridge: 15, c: '#7A3A28' });
  }, { name: 'prigioni' });

  /* ---------- the Danieli ---------- */
  T.obj([-4, 2, 22, 20], function (g) {
    const H2 = VN.house(g, { x0: -4, y0: 2, x1: 22, y1: 20, n: 4, col: '#E1A08E', arch2: 'ogee', shut: false, roof: 'hip', chim: [[2, 6], [10, 6], [16, 12]], winR: 7, winL: 7, doorR: [9.6, 12.4, '#4A3A30', 'round'], seed: 3 });
    for (const zf of [4.6, 9.0, 13.4]) { const z = zf + 0.2; K.box(g, 22, 8.6, 23.0, 13.4, z - 0.3, z, VN.istria, { w: 0.45, nohid: true }); const bl = []; for (let i = 0; i <= 8; i++) { const a = g.p(23.0, lerp(8.6, 13.4, i / 8), z), b = g.p(23.0, lerp(8.6, 13.4, i / 8), z + 1.1); bl.push(a[0], a[1], b[0], b[1]); } g.segs2(bl, VN.istriaD, 0.45); g.line([[23.0, 8.6, z + 1.1], [23.0, 13.4, z + 1.1]], { w: 0.45, boil: false }); }
    { const i0 = g.cmds.length; K.sign(g, 'R', 22.04, 6, 16, 3.6, 4.4, '#7A2E35', 'HOTEL DANIELI', { ink: '#E9D9A0' }); g.mark({ nc: '#A33A40' }, i0); }
    // at night: a grand hotel, most of its windows lit, lanterns either side of the door
    for (const a of [7.4, 14.6]) g.glow('lamp', 22.7, a, 4.0, { r: 1.4 });
    void H2;
  }, { name: 'danieli' });
  // flags over the hotel door (an actor: they flutter)
  T.actor({ sample: 5, period: 2,
    at(t) { const f = Math.floor(t * 4) % 4; return { x: 23.4, y: 12.8, z: 7.6, key: f, f }; },
    draw(g, st) {
      [['#2F4F8F', '#E6C24F'], ['#3E8E4E', '#C9463E'], ['#B5303A', '#E6C24F']].forEach((c, i) => {
        const b = g.p(0, -i * 2.2 - 0.4, 0), t = [b[0] + 4.6, b[1] - 3.4]; g.line2([b, t], { w: 0.45, c: '#3A3530', boil: false, ext: 0 });
        const w = Math.sin(st.f * 1.57 + i) * 0.8; g.fill2([[t[0], t[1]], [t[0] + 3.8, t[1] + 0.6 + w], [t[0] + 3.4, t[1] + 3.2 + w], [t[0] - 0.2, t[1] + 2.6]], c[0], true); g.fill2([[t[0] + 1.2, t[1] + 1.2], [t[0] + 2.4, t[1] + 1.4 + w * 0.5], [t[0] + 2.2, t[1] + 2.4 + w * 0.5], [t[0] + 1.0, t[1] + 2.2]], c[1], true);
      });
    } });

  /* ---------- San Zaccaria, the Arsenale gate ---------- */
  T.obj([-31, 5, -14, 20], function (g) {
    g.boilP = 0.22;
    const W = { t: '#E9E3D6', l: '#F3EFE6', r: '#E2DCCF' };
    K.box(g, -31, 5, -14, 20, 0, 13, W, { w: 0.9 });
    // the tiered white front with its semicircular crest
    const F = -13.98, m = 12.5, crest = []; for (let i = 0; i <= 16; i++) { const t = Math.PI * i / 16; crest.push([F, m - Math.cos(t) * 7.4, 13 + Math.sin(t) * 4.2]); }
    g.fill(crest, '#F3EFE6'); g.line(crest, { w: 0.65, boil: false });
    const sm = []; for (const s of [-1, 1]) { const pts = []; for (let i = 0; i <= 8; i++) { const t = Math.PI / 2 * i / 8; pts.push([F, m + s * (7.4 + Math.cos(t) * 0.0) + s * -Math.sin(t) * 0, 13]); } sm.push(pts); } void sm;
    for (const z of [3.6, 7.6, 11.0]) g.fill(K.on('R', F + 0.01, 5.5, 19.5, z, z + 0.35), '#E2DCCF');
    for (const a of [7, 10.4, 14, 17.4]) for (const zf of [4.4, 8.4]) VN.win(g, 'R', F, a - 0.6, a + 0.6, zf, zf + 2.4, { arch: 'round', sh: null, pane: '#55606A' });
    VN.door(g, 'R', F, 11.2, 13.8, 3.2, { arch: 'round', col: '#4A3A30' });
    const cr = g.p(F, m, 15.8); g.ring2(cr, 1.4, { w: 0.4, c: '#8E877A' }); const st = g.p(F, m, 17.4); g.fill2([[st[0] - 0.5, st[1]], [st[0] + 0.5, st[1]], [st[0] + 0.4, st[1] - 2.6], [st[0] - 0.4, st[1] - 2.6]], '#F6F2EA', true);
    g.mark({ nc: (c) => (c === '#F3EFE6' || c === '#E2DCCF' || c === '#F6F2EA' ? VN.litStone(0.7)(c) : undefined) }, 0);   // floodlit at night
    g.glow('lamp', F + 0.6, m, 4.4, { r: 1.4 }); g.glow('lantern', F + 1, m, 12, { r: 2.4, col: '#FFD9A0' });
    K.hip(g, -30.6, 5.4, -14.4, 19.6, 13, 2.6, VN.roof, { ridge: 1, c: '#7A3A28' });
  }, { name: 'san zaccaria' });
  T.obj([-37, -37, -10, -18], function (g) {
    g.boilP = 0.22;
    const B = { t: '#B9715A', l: '#C47A5E', r: '#A9634B' };
    // the brick wall with its crenellations, the two towers at the canal entrance behind
    K.box(g, -37, -26, -10, -24, 0, 7.5, B, { w: 0.8 });
    const mer = []; for (let a = -36.5; a < -10; a += 1.6) { const A = g.p(a, -24, 7.5); mer.push([A, a]); } for (const [A] of mer) g.fill2([[A[0] - 1.0, A[1]], [A[0] + 1.0, A[1] - 1.1], [A[0] + 1.0, A[1] - 3.4], [A[0] - 1.0, A[1] - 2.3]], '#C47A5E', true);
    for (const [x, y] of [[-35, -36], [-27, -36]]) { K.box(g, x, y, x + 5, y + 5, 0, 15, B, { w: 0.8 }); const tm = []; for (let a = x + 0.5; a < x + 5; a += 1.2) { const A = g.p(a, y + 5, 15); tm.push(A); } for (const A of tm) g.fill2([[A[0] - 0.9, A[1]], [A[0] + 0.9, A[1] - 1], [A[0] + 0.9, A[1] - 3.2], [A[0] - 0.9, A[1] - 2.2]], '#C47A5E', true); g.fill(K.on('L', y + 5.01, x + 1.4, x + 3.6, 10, 12.6), '#4A3E34'); }
    // the Porta Magna: a white triumphal arch with the winged lion on top
    const S = { t: '#E9E3D6', l: '#F3EFE6', r: '#E2DCCF' };
    K.box(g, -24, -24.5, -15, -22.6, 0, 10, S, { w: 0.8 });
    g.fill(VN.archPts('L', -22.58, -21.6, -17.4, 0, 6.6, 'round', 0), '#3E3832');
    for (const a of [-23.4, -16]) { const A = g.p(a, -22.55, 0), Bp = g.p(a, -22.55, 7.6); g.line2([A, Bp], { w: 1.2, c: '#C9C2B4', boil: false, ext: 0 }); }
    const pd = [[-24.4, -22.55, 10], [-14.6, -22.55, 10], [-19.5, -22.55, 12.4]]; g.fill(pd, '#F3EFE6'); g.outline(pd, { w: 0.55, boil: false });
    const ln = g.p(-19.5, -22.5, 8.4); g.fill2([[ln[0] - 2.4, ln[1] + 0.8], [ln[0] + 2.2, ln[1] + 0.6], [ln[0] + 1.6, ln[1] - 1.4], [ln[0] - 1.0, ln[1] - 1.6]], '#C9B37A', true); g.fill2([[ln[0] - 0.6, ln[1] - 1.2], [ln[0] - 2.8, ln[1] - 3.8], [ln[0] + 0.4, ln[1] - 1.6]], '#C9B37A', true);
    // at night the gate is floodlit (the towers stay dark against the sky)
    g.mark({ nc: (c) => (c === '#F3EFE6' || c === '#E9E3D6' || c === '#E2DCCF' || c === '#C9C2B4' ? VN.litStone(0.8)(c) : c === '#C9B37A' ? '#E9C470' : undefined) }, 0);
    g.glow('lantern', -19.5, -21.8, 3.4, { r: 2.6, col: '#FFD39A' }); g.glow('lantern', -19.5, -21.8, 9.6, { r: 2.0, col: '#FFD39A' });
  }, { name: 'arsenale' });
  for (const x of [-25.6, -13.4]) T.obj([x - 1, -20.6, x + 1, -18.6], function (g) {
    K.box(g, x - 1, -20.6, x + 1, -18.6, 0, 1.4, { t: '#E2DCCF', l: '#ECE7DC', r: '#D6CFC1' }, { w: 0.5 });
    const c = g.p(x, -19.6, 1.4); g.fill2([[c[0] - 2.6, c[1]], [c[0] + 2.0, c[1] - 0.6], [c[0] + 2.4, c[1] - 3.2], [c[0] + 1.0, c[1] - 4.2], [c[0] - 1.8, c[1] - 2.8]], '#E9E3D6', true); g.disc2([c[0] + 1.6, c[1] - 3.8], 1.3, '#E2DCCF'); g.line2([[c[0] - 2.6, c[1]], [c[0] - 1.8, c[1] - 2.8], [c[0] + 1.0, c[1] - 4.2]], { w: 0.4, boil: false, c: '#8E877A' });
  }, { name: 'arsenale lion' });
  H({ x0: -8, y0: -37, x1: 6, y1: -26, n: 3, col: P[1], chim: [[-3, -32], [2, -30]], shopL: [-6.5, 4, '#3E5A44', 'TRATTORIA'] });
  H({ x0: 6, y0: -37, x1: 22, y1: -26, n: 4, col: P[0], chim: [[12, -33], [18, -31, 'square']], altana: [14, -32, { wash: ['#F3F1EA', '#C9463E'] }] });
  H({ x0: -37, y0: 6, x1: -33, y1: 37, n: 3, dry: true, col: P[3], chim: [[-35, 14], [-35, 28]] });

  /* ---------- the Riva: stalls, lamps, people ---------- */
  for (const [y, col, word] of [[-30, '#F3F1EA', 'MASCHERE'], [-6, '#F3F1EA', 'VETRI'], [6, '#F3F1EA', 'SOUVENIR']]) T.obj([26, y - 2.6, 29, y + 2.6], function (g) {
    K.box(g, 26.2, y - 2.4, 28.8, y + 2.4, 0, 4.6, { t: '#E9E4D8', l: '#F6F4EE', r: '#DDD8CC' }, { w: 0.6 });
    g.fill(K.on('R', 28.82, y - 2.0, y + 2.0, 1.0, 4.0), '#5E6E7A'); g.mark({ nc: '#FFE3A8', spill: true });   // the stall lit at night, its masks shining
    for (let i = 0; i < 6; i++) { const c = g.p(28.85, y - 1.6 + (i % 3) * 1.6, 1.8 + Math.floor(i / 3) * 1.4); g.fill2(arcPts(c[0], c[1], 1.0, 0, TAU, 8).map((q) => [q[0], c[1] + (q[1] - c[1]) * 1.2]), ['#F4F1EA', '#D9B24A', '#C9463E', '#5F8FC9', '#8FBF73', '#D98AA4'][i], true); g.mark({ nc: true }); }
    g.glow('lamp', 29.4, y, 4.3, { r: 1.2 });
    K.box(g, 25.8, y - 2.8, 29.4, y + 2.8, 4.6, 5.0, { t: '#2F4F8F', l: '#3F5F9F', r: '#2F4F8F' }, { w: 0.5 });
    K.sign(g, 'R', 29.42, y - 2.4, y + 2.4, 4.62, 4.98, '#2F4F8F', word, { ink: '#F6F1E4' });
    VN.person(g, 26.8, y + 3.2, 0, VN.who(1700 + Math.round(y), { dir: 0, pose: 'hold', colombina: null }));
    void col;
  }, { name: 'stall' });
  for (const y of [-22, 0, 14, 24]) T.obj([35.5, y], (g) => VN.lamp(g, 35.5, y, { h: 7, dry: y === -22 }), { name: 'lamp' });   // (dry: the S. Zaccaria stop is in front of that one's reflection)
  for (const y of [-26, 20]) T.obj([38.4, y], (g) => VN.palina(g, 38.4, y, { c1: '#2F4F8F', h: 6 }), { name: 'palina' });
  // the accordion player and his listeners
  T.actor({ sample: 5, period: 2,
    at(t) { const f = Math.floor(t * 3) % 4; return { x: 32, y: -14, key: f, f }; },
    draw(g, st) {
      const r = VN.person(g, 0, 0, 0, VN.who(1710, { dir: 0, pose: 'hold', fedora: '#3B3F47', colombina: null })), h = r.hands[0], w = 1.6 + [0, 0.6, 1.0, 0.6][st.f];
      g.fill2([[h[0] - w, h[1] - 2.4], [h[0] + w, h[1] - 2.4], [h[0] + w, h[1] + 0.8], [h[0] - w, h[1] + 0.8]], '#B5303A', true); VN.hatch(g, [[h[0] - w, h[1] - 2.4], [h[0] + w, h[1] - 2.4], [h[0] + w, h[1] + 0.8], [h[0] - w, h[1] + 0.8]], 5, '#7A2028', 0.3);
      const p = g.p(1.6, 1.8, 0); g.fill2([[p[0] - 1.6, p[1]], [p[0] + 1.6, p[1]], [p[0] + 1.2, p[1] - 0.8], [p[0] - 1.2, p[1] - 0.8]], '#7A5A3C', true);
    } });
  T.cast([31, -9], (g) => { VN.person(g, 30.4, -10.4, 0, VN.who(1711, { dir: 2 })); VN.person(g, 29.4, -8.6, 0, VN.who(1712, { dir: 2, k: 0.74 })); VN.person(g, 31.6, -8.2, 0, VN.carnival(1713, 'gown', { dir: 2 })); }, { name: 'listeners' });
  // Carnival costumes posing with the lagoon behind them, a photographer
  T.cast([33.5, 26], (g) => { VN.person(g, 34.4, 25.4, 0, VN.carnival(1720, 'gown', { dir: 2, pose: 'wave', ph: 0.25 })); VN.person(g, 34.8, 27.6, 0, VN.carnival(1721, 'cape', { dir: 2 })); const r = VN.person(g, 29.6, 27.2, 0, VN.who(1722, { dir: 0, pose: 'hold' })); const h = r.hands[0]; g.fill2([[h[0] - 1.1, h[1] - 1.5], [h[0] + 1.1, h[1] - 1.5], [h[0] + 1.1, h[1] + 0.2], [h[0] - 1.1, h[1] + 0.2]], '#2A2622', true); }, { name: 'posing' });
  // the crowd on the Ponte della Paglia (on its near half, at the deck height), looking at the Bridge of Sighs
  const PG = VN.BR['ponte della paglia'];
  if (PG) for (const [u, v, d, s] of [[-1.6, 8.6, 3, 0], [-1.2, 10.6, 3, 1], [0.6, 7.2, 2, 2], [-0.4, 12.2, 3, 3]]) {
    const w = s === 2 ? VN.carnival(1730 + s, 'volto') : VN.who(1730 + s), p = PG.M(u, v, 0), z = PG.deck(v) + 0.05;
    T.actor({ sample: 5, period: 4, at(t) { const f = Math.floor((t + s) / 2) % 2; return { x: p[0] - T.cx, y: p[1] - T.cy, z, key: f, f }; },
      draw(g, st) { const r = VN.person(g, 0, 0, 0, Object.assign({}, w, { dir: d, pose: st.f ? 'hold' : 'stand' })); if (st.f) { const h = r.hands[0]; g.fill2([[h[0] - 0.7, h[1] - 1.6], [h[0] + 0.5, h[1] - 1.6], [h[0] + 0.5, h[1] + 0.1], [h[0] - 0.7, h[1] + 0.1]], '#2A2622', true); g.mark({ nc: '#D6E8FF', light: true }); } } });   // a phone's screen shines at night
  }
  const Wk = (seed, pts, v, ph, o) => VN.walker(T, seed > 0 ? VN.who(seed, o) : VN.carnival(-seed, (o && o.kind) || 'gown', o), pts, v, { phase: ph });
  Wk(1740, [[31, -36], [31, 24]], 1.4, 0); Wk(1741, [[33.5, 22], [33.5, -36]], 1.3, 0.3); Wk(-1742, [[30, -34], [30, 22]], 1.0, 0.6, { kind: 'medico' });
  Wk(1743, [[34.5, -34], [34.5, 20]], 1.5, 0.8); Wk(1744, [[24, -20], [-10, -20], [-10, 0], [24, 0]], 1.2, 0.1); Wk(1745, [[-36, -2], [20, -2], [20, -12]], 1.3, 0.5);
  Wk(1746, [[-12, 24], [-12, 2], [-32, 2]], 1.1, 0.4);
});
