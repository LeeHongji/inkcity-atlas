'use strict';
/* (0, 0) Rialto, the San Marco bank: the foot of the Rialto Bridge, the Fondaco dei Tedeschi, the Riva del Ferro.
   - The Fondaco dei Tedeschi: the Germans' great square warehouse on the Grand Canal, four storeys of round-headed
     windows over a water portico, a white crest of merlons, and on its roof a terrace where tourists look over the
     canal at the bridge.
   - The Riva del Ferro: the fondamenta along the canal with restaurant tables under heaters, the gondola station
     (gondoliers in striped jerseys waiting, chatting), moored gondolas, the Rialto vaporetto stop.
   - Campo San Bartolomeo behind: Goldoni's statue where people meet, a man roasting chestnuts, shops; the calli to
     the bridges over the rii. People stream from the Rialto stairs through the campo.
   What moves: people up and down the bridge's three stairways and across the campo, a vaporetto berthing at Rialto as
   the shot opens (the canal timetable is shifted for it), chestnut smoke, gondoliers. */
SF.tile('rialto', 0, 0, { rim: 18 }, function (T) {
  VN.finish(T);   // first: the Rialto's deck profile is needed by the walkers below
  const P = VN.PLASTER;
  T.ground(function (g) {
    g.boilP = 0.15;
    K.slab(g, 37, { top: VN.paveC });
    VN.pave(g, -37, -37, 37, 37, { col: '#D3CEC3', step: 2.4 });
    g.fill(K.rect(-37, 36.3, 8, 37), VN.istria); g.fill(K.rect(36.3, -37, 37, 37), VN.istria);
  }, { rim: true });
  const H = (d, nm) => T.obj([d.x0, d.y0, d.x1, d.y1], (g) => VN.house(g, d), { name: nm || 'house' });
  // the far side (the calle to the ponte formosa between) and the far-left side (the calle to ponte cannaregio)
  H({ x0: -37, y0: -37, x1: -23, y1: -27, n: 4, col: P[0], chim: [[-33, -33], [-27, -31]], shopL: [-35, -29, '#3E5A44', 'LIBRERIA'], altana: [-30, -32, { wash: ['#F3F1EA', '#C9463E', '#F3F1EA'] }] });
  H({ x0: -23, y0: -37, x1: -4, y1: -27, n: 3, col: P[4], chim: [[-17, -33], [-9, -33, 'square']], shopL: [-21, -15, '#7A2E35', 'OSTERIA'], shopL2: null });
  H({ x0: 4, y0: -37, x1: 18, y1: -27, n: 4, col: P[1], chim: [[10, -33]], shopL: [6, 12, '#2F3A55', 'VETRI'] });
  H({ x0: 18, y0: -37, x1: 37, y1: -28, n: 3, col: P[6], chim: [[24, -33], [32, -32]], shopL: [20, 26, '#5A4A6A', 'GIOIELLI'], balcony: ['L', 30, ['#C9463E', '#E6C24F']] });
  H({ x0: -37, y0: -24, x1: -27, y1: -5, n: 3, col: P[3], chim: [[-32, -18]], shopR: [-20, -12, '#7A5A3C', 'CARTOLERIA'] });
  H({ x0: -37, y0: 5, x1: -27, y1: 15, n: 4, col: P[2], chim: [[-32, 9]], shopR: [7, 13, '#3E5A44', 'CAFFÈ'] });
  // the Mercerie block (shops on both faces)
  H({ x0: 14, y0: -22, x1: 26, y1: -6, n: 3, col: P[7], chim: [[18, -18], [22, -10, 'square']], shopL: [15.5, 24.5, '#2F3A55', 'COSTUMI'], shopR: [-20, -10, '#7A2E35', 'MERLETTI'], altana: [20, -15, {}] });
  // the houses of the Riva del Ferro, restaurants on the canal
  // (dry: on screen the Rialto stands over the water in front of these two, so their lamps lay no reflection on it)
  H({ x0: -37, y0: 17, x1: -24, y1: 29, n: 4, col: P[5], chim: [[-33, 21], [-28, 25]], shopL: [-35.5, -26, '#3E5A44', 'TRATTORIA'], dry: true });
  H({ x0: -24, y0: 18, x1: -10, y1: 29, n: 3, col: P[8], chim: [[-19, 22]], shopL: [-22.5, -12, '#7A2E35', 'PIZZERIA'], flowers: ['#C9463E', '#E6C24F'], dry: true });

  /* ---------- the Fondaco dei Tedeschi ---------- */
  T.obj([10, 17, 31, 37], function (g) {
    g.boilP = 0.2;
    const x0 = 10, y0 = 17, x1 = 31, y1 = 37, Z = 15, W = VN.WL, col = '#D69477';
    K.box(g, x0, y0, x1, y1, W, Z, { t: '#C9BBA6', l: col, r: shade(col, 0.1) }, { w: 1 });
    g.fill(K.on('L', y1 + 0.01, x0, x1, W, W + 0.6), '#6F8A62');
    // the water portico on the canal, the round-headed windows in rhythm
    for (let i = 0; i < 4; i++) { const a = 13 + i * 3.8; g.fill(VN.archPts('L', y1 + 0.02, a, a + 2.4, W + 0.6, 3.8, 'round', 0.35), VN.istria); g.fill(VN.archPts('L', y1 + 0.03, a, a + 2.4, W + 0.6, 3.8, 'round', 0), '#4A4E52'); g.mark({ nc: '#D99A58' }); g.glow('lamp', a + 1.2, y1 + 0.6, 3.2, { r: 1.3, base: W }); }   // at night the water portico is lit, its lamps shine in the Grand Canal
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
      for (const zf of [5, 8.4, 11.8]) for (let a = a0 + 1.2; a < a1 - 1; a += 2.2) { if (f === 'L' && zf < 6 && a > 11 && a < 29) continue; VN.win(g, f, p + 0.02, a, a + 1.0, zf, zf + 2.4, { arch: 'round', sh: null, pane: '#55606A', lit: 0.85 }); }
      g.fill(K.on(f, p + 0.02, a0, a1, 4.4, 4.7), VN.istria);
      if (f === 'R') for (let a = a0 + 1.2; a < a1 - 1; a += 2.2) VN.win(g, f, p + 0.02, a, a + 1.0, 1.2, 3.4, { arch: 'round', sh: null, pane: '#55606A', lit: 1 });
      const mer = []; for (let a = a0 + 0.5; a < a1; a += 1.2) { const c = g.p.apply(g, K.pt(f, p, a, Z)); mer.push(c[0] - 0.8, c[1], c[0] + 0.8, c[1], c[0], c[1] - 2.4); } g.tris2(mer, '#F3EFE6');
    }
    // the roof terrace: decking, a glass pavilion
    g.fill(K.rect(x0 + 0.5, y0 + 0.5, x1 - 0.5, y1 - 0.5, Z), '#B8875A');
    const dk = []; for (let x = x0 + 1.5; x < x1 - 0.5; x += 1.4) { const a = g.p(x, y0 + 0.5, Z), b = g.p(x, y1 - 0.5, Z); dk.push(a[0], a[1], b[0], b[1]); } g.segs2(dk, '#9C7450', 0.25);
    { const i0 = g.cmds.length; K.box(g, x0 + 3, y0 + 3, x0 + 10, y0 + 9, Z, Z + 3.4, { t: '#DCE3E6', l: '#C3D6E0', r: '#A8BECB' }, { w: 0.6 }); g.mark({ nc: (c) => (c === '#DCE3E6' ? undefined : c === '#C3D6E0' ? '#E6C68E' : '#C9A26E') }, i0); g.glow('lantern', x0 + 6.5, y0 + 9, Z + 1.8, { r: 1.8, col: '#FFE2B0' }); }   // the glass pavilion lit at night
    // a glass balustrade along the canal side
    g.fill(K.on('L', y1 - 0.6, x0 + 0.6, x1 - 0.6, Z, Z + 1.3), 'rgba(207,224,234,0.55)'); g.line([[x0 + 0.6, y1 - 0.6, Z + 1.3], [x1 - 0.6, y1 - 0.6, Z + 1.3], [x1 - 0.6, y0 + 0.6, Z + 1.3]], { w: 0.4, c: '#5E6E7A', boil: false });
  }, { name: 'fondaco dei tedeschi' });
  // tourists on the Fondaco's roof terrace, looking at the bridge
  T.cast([20, 30], function (g) {
    const Z = 15; [[13, 34.5, 1], [15.5, 35, 1], [19, 34.8, 2], [23, 35, 1], [27, 34.6, 1], [29.4, 32, 0], [29.6, 26, 0]].forEach(([x, y, d], i) => VN.person(g, x, y, Z, VN.who(1300 + i, { dir: d, pose: i % 3 ? 'stand' : 'hold' })));
  }, { name: 'roof terrace', on: true });

  /* ---------- the Riva del Ferro: tables, heaters, the gondola station ---------- */
  for (const x of [-34, -29, -24.5]) T.cast([x, 32.6], function (g) {
    VN.table(g, x, 32.6, 0, { cups: ['#E8712F', '#F3F1EA'] }); VN.glowDry(g, 'lantern', x, 32.6, 2.9, { r: 0.7, col: '#FFC870' });
    VN.person(g, x - 1.4, 31.8, 1.3, VN.who(1310 + Math.round(-x), { dir: 0, pose: 'sit' })); VN.person(g, x + 1.5, 33.4, 1.3, VN.who(1320 + Math.round(-x), { dir: 2, pose: 'sit' }));
  }, { name: 'riva tables' });
  for (const x of [-31.5, -26.8]) T.obj([x, 31], (g) => { const b = g.p(x, 31, 0), t = g.p(x, 31, 6.6); g.line2([b, t], { w: 0.6, c: '#5E5A52', boil: false, ext: 0 }); g.fill2([[t[0] - 2.4, t[1] + 1.2], [t[0] + 2.4, t[1] + 1.2], [t[0], t[1] - 0.8]], '#8C8F94', true); g.disc2([t[0], t[1] + 2.4], 0.9, '#E8712F'); g.mark({ nc: '#FF8A3C' }); g.glow2('lantern', [t[0], t[1] + 2.4], [t[0], -1e6], { r: 1.4, col: '#FF9A4A', pool: false }); }, { name: 'heater' });   // the patio heaters glow at night (no reflection: the Rialto is in front)
  // gondoliers waiting at their station: one sits on the bollard, two talk, one calls out
  T.cast([-14, 34], function (g) {
    const gd = (x, y, d, pose, s) => { const w = VN.who(1330 + s, { scarf: null, beanie: null, colombina: null, fedora: null }); const r = VN.person(g, x, y, pose === 'sit' ? 0.9 : 0, Object.assign({}, w, { dir: d, pose, top: '#F3F1EA', bot: '#2F2C2E', ph: 0.25 })); VN.gondolierKit(g, r, 1, { stripe: s % 2 ? '#7A2E35' : '#2F3F63' }); };
    K.cyl(g, -15.6, 35.4, 0.5, 0, 0.9, { t: '#E2DCCF', l: '#ECE7DC', r: '#D6CFC1' }, { w: 0.4, n: 8 });
    gd(-15.6, 35.4, 1, 'sit', 0); gd(-13.2, 34.0, 2, 'stand', 1); gd(-11.8, 35.2, 3, 'stand', 2); gd(-9.6, 34.4, 1, 'wave', 3);
  }, { name: 'gondoliers' });
  for (const [x, ph] of [[-30, 0.1], [-36.5, 0.5]]) {
    T.obj([x - 6.6, 37.8, x + 6.6, 39.4], (g) => { g.at(x, 38.6, VN.WL, (g2) => VN.drawBoat(g2, 'gondola', Math.PI, -99, 99, { empty: true, moored: true })); void ph; }, { name: 'moored gondola' });
  }
  for (const x of [-34, -23.4]) T.obj([x, 37.6], (g) => VN.palina(g, x, 37.6, { c1: '#C9463E', cap: '#C9A44A' }), { name: 'palina' });

  /* ---------- Campo San Bartolomeo: Goldoni, chestnuts ---------- */
  T.obj([-6, 0], function (g) {
    K.box(g, -7.2, -1.2, -4.8, 1.2, 0, 3.0, { t: '#E2DCCF', l: '#ECE7DC', r: '#D6CFC1' }, { w: 0.6 });
    const c = g.p(-6, 0, 3.0); g.fill2([[c[0] - 1.4, c[1]], [c[0] + 1.4, c[1]], [c[0] + 1.6, c[1] - 4.6], [c[0] + 0.8, c[1] - 6.4], [c[0] - 0.8, c[1] - 6.4], [c[0] - 1.6, c[1] - 4.4]], '#4A5248', true);
    g.disc2([c[0], c[1] - 7.6], 1.2, '#4A5248'); g.fill2([[c[0] - 1.6, c[1] - 8.4], [c[0] + 1.6, c[1] - 8.4], [c[0], c[1] - 9.6]], '#3E463C', true);
    g.line2([[c[0] + 1.2, c[1] - 5.4], [c[0] + 3.0, c[1] - 3.6]], { w: 0.6, c: '#4A5248', boil: false, ext: 0 });
  }, { name: 'goldoni' });
  // the chestnut roaster: a brazier, a little smoke, a queue of two
  T.obj([-14, -10], function (g) {
    K.box(g, -15, -11, -13, -9, 0, 2.6, { t: '#3A3632', l: '#4A4642', r: '#2E2A26' }, { w: 0.5 });
    const t = g.p(-14, -10, 2.6); g.fill2(arcPts(t[0], t[1], 3.2, 0, TAU, 10).map((q) => [q[0], t[1] + (q[1] - t[1]) * 0.5]), '#5A4A3E', true); g.mark({ nc: '#8A3A1E' }); for (let i = 0; i < 6; i++) { g.disc2([t[0] - 1.6 + i * 0.6, t[1] - 0.2 + (i % 2) * 0.3], 0.35, '#8A5A3A'); g.mark({ nc: '#F08A3A' }); }
    g.glow2('lantern', [t[0], t[1] - 0.6], g.p(-14, -10, 0), { r: 1.6, col: '#FF9040' });               // the embers glow at night
    VN.person(g, -15.8, -9, 0, VN.who(1340, { dir: 0, pose: 'hold', beanie: '#3B3F47', top: '#5A4A3C' }));
  }, { name: 'caldarroste' });
  T.cast([-11, -8], (g) => { VN.person(g, -11.4, -8.4, 0, VN.who(1341, { dir: 2, pose: 'hold' })); VN.person(g, -10.0, -6.6, 0, VN.who(1342, { dir: 2 })); }, { name: 'chestnut queue' });
  T.actor({ sample: 5, period: 3, grow: false, layer: 'top',
    at(t) { const f = Math.floor(t * 3) % 6; return { x: -14, y: -10, z: 3, key: f, f }; },
    draw(g, st) { const p = g.p(0, 0, 0); for (let k = 0; k < 3; k++) { const u = ((st.f / 6) + k / 3) % 1, c = [p[0] + Math.sin(u * 6 + k) * 1.5, p[1] - 2 - u * 14]; g.disc2(c, 1.2 + u * 2.2, 'rgba(236,233,226,' + (0.7 - u * 0.6).toFixed(2) + ')'); } } });
  for (const [x, y] of [[-18, 8], [6, -14]]) T.obj([x, y], (g) => VN.lamp(g, x, y, {}), { name: 'lamp' });

  /* ---------- people: the Rialto stream, the campo ---------- */
  const R = VN.rialtoDeck, step = (v) => R.step(v);
  // up and down the bridge's stairways (world: x = u, y = 50 + v), on into the campo or along the Riva
  const bridgeWalk = (seed, u, dir, ph, v0, o) => {
    const w = seed > 0 ? VN.who(seed) : VN.carnival(-seed, (o && o.kind) || 'gown'), L = 2 * R.RY + 14, sp = 1.3, per = L / sp;
    T.actor({ sample: 0.25, period: per,
      at(t) {
        const d = ((t * sp + ph * L) % L + L) % L;
        let x, y, z = 0, dr;
        if (d < 2 * R.RY) { const v = dir > 0 ? -R.RY + d : R.RY - d; x = u; y = 50 + v; z = step(v); dr = dir > 0 ? 1 : 3; }
        else { const e = d - 2 * R.RY; x = u + (dir > 0 ? -1 : 1) * 0; y = dir > 0 ? 50 + R.RY + e : 50 - R.RY - e; dr = dir > 0 ? 1 : 3; }
        if (y > 50 + R.RY + 12 || y < 50 - R.RY - 12) return null;
        const a = clamp(Math.min(y - (50 - R.RY - 12), (50 + R.RY + 12) - y) / 2, 0, 1);
        const phs = Math.floor((d / 2.4) % 1 * 8) / 8;
        return { x, y, z, dir: dr, ph: phs, key: dr + '.' + phs, alpha: a < 1 ? a : null };
      },
      draw(g, st) { VN.person(g, 0, 0, 0, Object.assign({}, w, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
  };
  bridgeWalk(1350, -0.9, -1, 0); bridgeWalk(1351, -0.9, -1, 0.33); bridgeWalk(-1352, -0.9, -1, 0.66, 0, { kind: 'gown' });
  bridgeWalk(1353, 0.9, 1, 0.15); bridgeWalk(1354, 0.9, 1, 0.5); bridgeWalk(1355, 0.9, 1, 0.82);
  bridgeWalk(1356, -6.4, 1, 0.1); bridgeWalk(-1357, -6.4, 1, 0.6, 0, { kind: 'cape' });
  bridgeWalk(1358, 6.4, -1, 0.3); bridgeWalk(1359, 6.4, -1, 0.75);
  // the campo
  const Wk = (seed, pts, v, ph, o) => VN.walker(T, seed > 0 ? VN.who(seed, o) : VN.carnival(-seed, (o && o.kind) || 'gown', o), pts, v, { phase: ph });
  Wk(1360, [[0, 24], [0, -20], [10, -20], [10, 24]], 1.4, 0); Wk(1361, [[-2, 24], [-20, 4], [-20, -22], [-2, -22]], 1.3, 0.4);
  Wk(-1362, [[4, 22], [4, -2], [-24, -2], [-24, 12]], 1.0, 0.2, { kind: 'medico' }); Wk(1363, [[30, -24], [30, 20], [8, 6], [8, -20]], 1.5, 0.5);
  Wk(1364, [[-36, 33], [-6, 33]], 1.3, 0.3); Wk(1365, [[-5, 34.6], [-36, 34.6]], 1.2, 0.7); Wk(1366, [[34, -26], [34, 8]], 1.4, 0.1); Wk(-1367, [[10, 8], [-16, 8], [-16, -18], [10, -18]], 0.9, 0.6, { kind: 'jester' });
  T.cast([-4, 3], (g) => { VN.person(g, -3.6, 2.6, 0, VN.who(1370, { dir: 1, pose: 'hold' })); VN.person(g, -2.4, 4.0, 0, VN.who(1371, { dir: 2, pose: 'wave', ph: 0.2 })); }, { name: 'meeting at goldoni' });
});
