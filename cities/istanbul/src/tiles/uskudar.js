'use strict';
/* (100,-100) Üsküdar, on the Asian shore. What it is: the ferry town facing Europe across the Bosphorus. The ÜSKÜDAR
   pier reaches out into the strait from the square; beside the square the Mihrimah Sultan (İskele) mosque — a dome on
   a square hall with three half-domes, two minarets, and its famous double portico: an inner row of small domes and
   in front of it a wide sloping lead roof on slender columns over a terrace where people sit; the square-roofed
   fountain of Ahmed III in the middle of the square, all carved marble under a broad eave with little domes on top.
   Behind, timber Ottoman houses up the hill, erguvan trees in bloom, a tea garden.
   Who is there: commuters waiting at the pier, a simit seller, people on the mosque terrace, tea drinkers, a fisherman
   cleaning his catch watched by cats, kids feeding pigeons. What moves: walkers, pigeons, the ferry (water.js). */
SF.tile('uskudar', 100, -100, { rim: 22 }, function (T) {
  const H = 37, W0 = -28;
  T.ground(function (g) {
    IS.ground(g, W0, -H, H, H, '#E6DECC', { cut: 'x' });
    IS.paving(g, W0, -H, H, H, { len: 2.4 });
    g.fill(K.rect(W0, -8, 6, 20), '#E9E3D3');                 // the square
    const sl = []; for (let x = W0 + 3; x < 6; x += 3) { const a = g.p(x, -8, 0.01), b = g.p(x, 20, 0.01); sl.push(a[0], a[1], b[0], b[1]); } g.segs2(sl, '#DAD1BE', 0.35);
    g.fill(K.rect(W0, -H, W0 + 1, H), IS.C.quayTop);
  }, { rim: true });

  /* ---- the pier ---- */
  T.obj([-39, -12, W0, 2], (g) => IS.iskele(g, -39, -12, W0, 2, { b: [-36.4, -4.6, -30, 1.4], H: 6, name: 'ÜSKÜDAR', nameFace: 'L', roof: '#8E9AA2', bollards: [[-38.6, -11], [-38.6, -1]] }), { name: 'üsküdar pier' });
  T.obj([-35, -9], (g) => IS.lamp(g, -35, -9, { dry: true }), { on: true });
  /* ---- the Mihrimah Sultan mosque (north of the square) with its double portico facing the square ---- */
  T.obj([-21, -35, -3, -19.4], (g) => IS.mosque(g, { cx: -12, cy: -27, s: 7.4, sx: 9, sy: 7.6, H: 7.6, R: 4.6, semis: ['x-', 'x+', 'y-'], towers: true, domeH: 0.92 }), { name: 'mihrimah' });
  T.obj([-21, -19.4, -3, -16.2], (g) => IS.portico(g, -21, -3, -16.2, 3.2, 5.2, { n: 5 }), { name: 'portico' });
  T.obj([-24, -16.2, 0, -11.4], function (g) {   // the outer portico: a terrace, slender columns, a wide sloping lead roof
    const i0 = g.cmds.length;
    K.box(g, -24, -16.2, 0, -11.4, 0, 0.6, { t: '#E3DCCC', l: '#D3CAB6', r: '#BFB6A2' }, { w: 0.6 });
    const roof = [[-24.6, -16.2, 5.9], [0.6, -16.2, 5.9], [0.6, -11.0, 4.3], [-24.6, -11.0, 4.3]];
    const cs = []; for (let x = -23.4; x <= -0.5; x += 2.6) { const a = g.p(x, -11.7, 0.6), b = g.p(x, -11.7, 4.4); cs.push(a[0], a[1], b[0], b[1]); } g.segs2(cs, '#C9C1AE', 0.9); g.segs2(cs, '#8C8576', 0.3);
    g.fill(roof, '#A3ACB3'); g.outline(roof, { w: 0.75, c: IS.C.leadInk, boil: false });
    const sm = []; for (let x = -23.6; x < 0; x += 1.2) { const a = g.p(x, -16.15, 5.88), b = g.p(x, -11.05, 4.32); sm.push(a[0], a[1], b[0], b[1]); } g.segs2(sm, '#8E979E', 0.28);
    g.fill([[-24.6, -11.0, 4.3], [0.6, -11.0, 4.3], [0.6, -11.0, 3.8], [-24.6, -11.0, 3.8]], '#8E979E');
    // at night: floodlit with the mosque, lamps hanging under the sloping roof light the terrace where people sit
    IS.flood(g, i0, 0.8);
    for (let x = -22.1; x < 0; x += 5.2) g.glow('lamp', x, -12.6, 3.6, { r: 1.0, base: 0.6 });
  }, { name: 'outer portico' });
  for (const [x, y] of [[-21.6, -17.6], [-2.4, -17.6]]) T.obj([x, y], (g) => IS.minaret(g, x, y, 25, { r: 0.72, bal: [15.5] }), { name: 'minaret' });
  // people sitting on the portico terrace, facing the square
  for (const [x, s] of [[-20, 1], [-15, 2], [-9, 3], [-4, 4]]) T.cast([x, -13.6], (g) => IS.person(g, x, -13.6, 0.6, IS.who(1800 + s, { dir: 1, pose: 'sit', cup: s % 2 === 0 })), { on: true });
  /* ---- the fountain of Ahmed III in the square ---- */
  T.obj([-12.5, 1.5, -5.5, 8.5], function (g) {
    const M = { t: '#ECE6D8', l: '#F3EFE6', r: '#DFD8C9' }, x0 = -12, y0 = 2, x1 = -6, y1 = 8, i0 = g.cmds.length;
    K.box(g, x0, y0, x1, y1, 0, 5.4, M, { w: 0.8 });
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) { IS.arcade(g, f, p + 0.02, a0 + 0.5, a1 - 0.5, 0.6, 4.4, 2, { dark: '#9FB8BE', pointed: true }); g.fill(K.on(f, p + 0.03, a0, a1, 4.6, 5.0), '#7FA8B6'); const tl = []; for (let a = a0 + 0.4; a < a1; a += 0.8) { const q = g.p.apply(g, K.pt(f, p + 0.04, a, 4.8)); tl.push(q); } for (const q of tl) g.disc2(q, 0.22, IS.C.gold); }
    K.hip(g, x0 - 1.8, y0 - 1.8, x1 + 1.8, y1 + 1.8, 5.4, 1.4, '#9DA7AE', { c: IS.C.leadInk, w: 0.7 });
    for (const [x, y] of [[x0 + 0.6, y0 + 0.6], [x1 - 0.6, y0 + 0.6], [x0 + 0.6, y1 - 0.6], [x1 - 0.6, y1 - 0.6], [(x0 + x1) / 2, (y0 + y1) / 2]]) IS.dome(g, x, y, (x === (x0 + x1) / 2) ? 1.3 : 0.75, 6.4, { drum: 0.2, win: 0, h: 0.8, ribs: 0, alem: x === (x0 + x1) / 2, w: 0.4 });
    // at night: floodlit, its gilt lettering shining
    IS.flood(g, i0, 0.84); IS.glowDry(g, 'lantern', x1 + 1.2, y1 + 1.2, 0.5, { r: 2.4, col: IS.N.flood });
  }, { name: 'fountain' });
  /* ---- houses up the hill, trees ---- */
  [[10, -34, 20, -24, 0, 3], [23, -34, 35, -25, 1, 2], [10, -20, 19, -10, 2, 2], [22, -20, 34, -9, 3, 3], [10, -5, 20, 6, 4, 2], [23, -4, 35, 8, 5, 3], [10, 13, 20, 24, 6, 2], [24, 14, 35, 25, 7, 3], [8, 28, 20, 35, 8, 2], [23, 29, 35, 35, 9, 2]].forEach(([a, b, c, d, k, f]) => T.obj([a, b, c, d], (g) => IS.konak(g, a, b, c, d, { floors: f, col: IS.WALLS[k % IS.WALLS.length], shop: k === 4 ? { word: 'ÇAY BAHÇESİ', sign: '#2E6E5A', aw: '#2E6E5A' } : k === 2 ? { word: 'ECZANE', sign: '#B8322A' } : k === 6 ? { word: 'SİMİT', sign: '#B8322A', aw: '#E9C46A' } : null }), { name: 'house' }));
  for (const [x, y] of [[-26, -30], [3, -32], [3, -20], [-26, 24], [3, 33], [-14, 34]]) T.obj([x, y], (g) => IS.erguvan(g, x, y, { r: 4 }), { name: 'erguvan' });
  for (const [x, y] of [[-24, -6], [4, 14]]) T.obj([x, y], (g) => IS.plane(g, x, y, { r: 4.4, h: 5.6 }), { name: 'plane' });
  // the tea garden under the trees north of the square
  for (const [x, y, s] of [[-22, 25, 1], [-16, 28, 2], [-10, 24, 3], [-4, 29, 4]]) T.cast([x, y], (g) => { IS.stool2(g, g.p(x - 1.5, y - 0.3, 1.3)); IS.person(g, x - 1.5, y - 0.3, 1.3, IS.who(1820 + s * 2, { dir: 0, pose: 'sit' })); IS.teaTable2(g, x, y, 0); IS.stool2(g, g.p(x + 1.3, y + 0.9, 1.3)); IS.person(g, x + 1.3, y + 0.9, 1.3, IS.who(1821 + s * 2, { dir: 1, pose: 'sit', cup: true })); }, { name: 'tea table' });

  /* ---- the living layer ---- */
  for (let i = 0; i < 7; i++) T.cast([-33 + (i % 4) * 1.2, -9 + Math.floor(i / 4) * 1.6], (g) => IS.person(g, -33 + (i % 4) * 1.2, -9 + Math.floor(i / 4) * 1.6, 0, IS.who(1840 + i, { dir: 2, pose: i % 3 === 1 ? 'hold' : 'stand', phone: i % 3 === 1 })), { on: true });
  T.cast([-24, 14], (g) => { IS.person(g, -24, 14, 0, IS.who(1850, { dir: 2, pose: 'kneel', fcap: '#3B3F47', hands: [[-4, -3], [-3, -2]] })); const p = g.p(-25.6, 14.4, 0); g.fill2([[p[0] - 2.2, p[1]], [p[0] + 2.2, p[1]], [p[0] + 1.8, p[1] - 1.2], [p[0] - 1.8, p[1] - 1.2]], '#3F7FB8', true); IS.fish2(g, [p[0] - 0.8, p[1] - 4.5]); }, { on: true });
  IS.cat(T, -26.4, 16.2, 0, { c: 0, pose: 'sit' }); IS.cat(T, -22.4, 16.4, 0, { c: 1, pose: 'sit', fl: -1 }); IS.cat(T, -5, 9.6, 0, { c: 3, pose: 'loaf' });
  for (let i = 0; i < 12; i++) { const R = RNG(i * 41 + 3), x0 = -24 + R() * 14, y0 = -4 + R() * 5; T.actor({ sample: 0.5, period: 15,
    at(t) { const u = ((t + 5) % 15 + 15) % 15, up = u > 11 && u < 13.6, f = up ? Math.floor(t * 8 + i) % 4 : (Math.floor(t * 2 + i * 1.7) % 3 === 0 ? 'u' : 'p'), h = up ? Math.sin(Math.PI * (u - 11) / 2.6) * 6 : 0; return { x: x0 + (up ? (u - 11) * 1.4 : 0), y: y0, z: h, key: up ? 'f' + f : f, f, up, fl: i % 2 ? 1 : -1 }; },
    draw(g, st) { const p = g.p(0, 0, 0); if (st.up) IS.gull2(g, p, st.f); else IS.pigeon2(g, p, st.fl, st.f === 'u'); } }); }
  T.cast([-15, -3], (g) => { IS.person(g, -15, -3, 0, IS.who(1851, { dir: 1, k: 0.75, pose: 'wave', ph: 0.3 })); IS.person(g, -13.4, -3.6, 0, IS.who(1852, { dir: 1, pose: 'hold', scarf: '#5FA58F', dress: '#3B3F47' })); }, { on: true });
  IS.walker(T, IS.who(1861, { tray: true, top: '#F3F1EA', scarf: undefined, dress: undefined }), [[-26, -6], [4, -6], [4, 19], [-26, 19]], 1.0, { phase: 0.2 });
  IS.walker(T, IS.who(1862), [[6, -36], [6, 36]], 1.2, { phase: 0.4 }); IS.walker(T, IS.who(1863, { scarf: '#C9584B' }), [[7.6, 36], [7.6, -36]], 1.1, { phase: 0.7 });
  IS.walker(T, IS.who(1864), [[21, -36], [21, 36]], 1.2, { phase: 0.1 });
  IS.catWalk(T, [[-26, 21], [-26, 33], [-10, 33]], { c: 2, speed: 0.9, sit: 6 });
});
