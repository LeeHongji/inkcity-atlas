'use strict';
/* (-100,-100) Estrela: the basilica and its garden, where tram 28 turns for Prazeres.
   The Basílica da Estrela in white limestone: a front between two bell towers with little cupolas, a portico of four
   columns under a balustrade of saints, and behind them the great grey dome on its drum with a lantern. Before it the
   Jardim da Estrela: lawns cut by curving gravel paths, a pond with an island and ducks, an iron bandstand where the
   Sunday band plays, jacarandas and palms, a kiosk with tables, benches.
   Who: the band in the bandstand and people listening on folding chairs; children feeding the ducks; a nanny with a
   pram; a picnic on the lawn; an old man with his newspaper on a bench; a dog walker; two joggers.
   At night: the basilica floodlit white and warm, its dome pale over the garden; the bandstand lit for the band; the
   kiosk's lamp over its tables; jacarandas glowing violet, motes over the lawns, the lights in the pond. */
SF.tile('estrela', -100, -100, { rim: 0 }, function (T) {
  const H = 37, W = { t: '#E9E4D8', l: '#F6F3EB', r: '#E2DCCE' };
  const pond = K.curve([[6, 0], [16, -4], [26, -1], [28, 8], [20, 14], [9, 12], [4, 6]], 6, true);
  const paths = [
    [[-10, -6], [0, -10], [12, -12], [24, -14], [36, -12]], [[-10, -6], [-6, 6], [-1, 18], [-4, 28], [-12, 36]],
    [[-6, 6], [2, 18], [14, 22], [26, 22], [36, 26]], [[30, -12], [33, 4], [32, 14], [27, 22]],
  ];
  T.ground(function (g) {
    K.slab(g, H, { top: '#E6DCC4' });
    g.boilP = 0.1;
    // the lawns, then the paths over them, the pond with its rim
    const lawn = K.rect(-8, -8, H, H); g.fill(lawn, LC.grass); g.grass(lawn, { dens: 0.6 });
    for (const pa of paths) { const c = K.curve(pa, 6), L = c.map((p, i) => { const q = c[Math.min(c.length - 1, i + 1)], r = c[Math.max(0, i - 1)], dx = q[0] - r[0], dy = q[1] - r[1], l = Math.hypot(dx, dy) || 1; return [p[0] - dy / l * 1.6, p[1] + dx / l * 1.6]; }), R = c.map((p, i) => { const q = c[Math.min(c.length - 1, i + 1)], r = c[Math.max(0, i - 1)], dx = q[0] - r[0], dy = q[1] - r[1], l = Math.hypot(dx, dy) || 1; return [p[0] + dy / l * 1.6, p[1] - dx / l * 1.6]; }); g.fill(L.concat(R.reverse()).map((p) => [p[0], p[1], 0.02]), '#E9DFC6'); }
    g.fill(pond.map((p) => [p[0] * 1.06 + 0.3, p[1] * 1.06 - 0.2, 0.03]), '#9C9480');
    g.fill(pond.map((p) => [p[0], p[1], 0.04]), LC.water); g.water(pond.map((p) => [p[0], p[1], 0.05]), { dens: 1.2 });
    const isl = K.curve([[16, 4], [19, 3], [20, 6], [17, 7]], 4, true); g.fill(isl.map((p) => [p[0], p[1], 0.06]), LC.grass);
    g.outline(pond.map((p) => [p[0], p[1], 0.05]), { w: 0.5, c: '#5E8F98', boil: false });
    // the forecourt of the basilica
    LX.pave(g, -H, -12, -8, H, { edge: '' });
  }, { rim: true });

  /* ---------------- the basilica ---------------- */
  T.obj([-33, -36, -11, -16], function (g) {
    g.boilP = 0.3;
    K.box(g, -33, -36, -11, -16, 0, 14, W, { w: 0.95 });
    for (let y = -34; y < -18; y += 4) K.win(g, 'R', -11, y - 0.6, y + 0.6, 6, 10, { style: 'navy', arch: true });
    LX.roof(g, -33, -36, -11, -16, 14, 2.2, { col: '#B9B4AA', c: '#5E5A52' });
    // the drum and the dome, the lantern
    K.cyl(g, -22, -27, 5.6, 14, 19.5, W, { n: 18, w: 0.85 });
    const cw = []; for (let k = 0; k < 9; k++) { const a = -Math.PI * 0.2 + Math.PI * 1.05 * k / 8, p = g.p(-22 + Math.cos(a) * 5.62, -27 + Math.sin(a) * 5.62, 15.2); cw.push(p); } for (const p of cw) g.fill2([[p[0] - 0.7, p[1]], [p[0] + 0.7, p[1]], [p[0] + 0.7, p[1] - 9], [p[0] - 0.7, p[1] - 9]], '#7E8A96', true);
    K.dome(g, -22, -27, 5.9, 19.5, 7.5, '#BFC5C1', { w: 0.9, shadow: '#A3AAA6', band: true, ribs: 10, ribCol: '#9EA5A1', ribW: 0.45 });
    K.cyl(g, -22, -27, 1.3, 27, 29.6, W, { n: 10, w: 0.55 }); K.dome(g, -22, -27, 1.4, 29.6, 1.5, '#BFC5C1', { w: 0.5 });
    const fin = g.p(-22, -27, 31.1); g.line2([fin, [fin[0], fin[1] - 4]], { w: 0.45, c: '#6E665A', boil: false }); g.segs2([fin[0] - 1, fin[1] - 2.8, fin[0] + 1, fin[1] - 2.8], '#6E665A', 0.4);
    // night: floodlit, the dome on its drum pale against the sky
    LX.flood(g, 0, 0.8, LX.FLOOD.warm, (c) => (['#B9B4AA', shade('#B9B4AA', 0.16), shade('#B9B4AA', -0.04), shade('#B9B4AA', -0.1), shade('#B9B4AA', 0.1)].indexOf(c) >= 0 ? nightColour(c) : c === '#BFC5C1' || c === '#A3AAA6' ? mix(nightColour(c), '#E8E2D6', 0.35) : undefined));
    g.glow('lantern', -10.4, -27, 9, { r: 2.2, col: '#FFDDA6' }); g.glow('lantern', -16, -21.6, 22, { r: 2.8, col: '#FFE6C0' });
  }, { name: 'basilica' });
  T.obj([-35, -17, -9, -10], function (g) {       // the front: two towers, the portico with its saints
    g.boilP = 0.35;
    const tower = (x0, x1) => {
      K.box(g, x0, -17, x1, -10, 0, 20, W, { w: 1 });
      for (const [f, p, a0, a1] of [['L', -10, x0, x1], ['R', x1, -17, -10]]) { const m = (a0 + a1) / 2; K.win(g, f, p, m - 0.9, m + 0.9, 15, 18.5, { style: 'dark', arch: true }); K.win(g, f, p, m - 0.6, m + 0.6, 8, 10.6, { style: 'navy', arch: true }); }
      K.box(g, x0 - 0.3, -17.3, x1 + 0.3, -9.7, 20, 20.8, W, { w: 0.6 });
      K.cyl(g, (x0 + x1) / 2, -13.5, 2.4, 20.8, 22.4, W, { n: 12, w: 0.55 }); K.dome(g, (x0 + x1) / 2, -13.5, 2.6, 22.4, 3.0, '#BFC5C1', { w: 0.6, band: true });
      const t = g.p((x0 + x1) / 2, -13.5, 25.4); g.line2([t, [t[0], t[1] - 3]], { w: 0.4, c: '#6E665A', boil: false });
    };
    tower(-35, -28); tower(-16, -9);
    K.box(g, -28, -16, -16, -12, 0, 12, W, { w: 0.9 });
    for (const m of [-24, -20]) LX.door(g, 'L', -12, m - 1.2, m + 1.2, 1.2, 4.8, '#5E4A36');
    K.box(g, -28.4, -12, -15.6, -9, 0, 1.2, W, { w: 0.6 });
    for (const x of [-27, -23.7, -20.3, -17]) K.cyl(g, x, -9.8, 0.55, 1.2, 10.4, W, { n: 8, w: 0.55 });
    K.box(g, -28.4, -12, -15.6, -9.2, 10.4, 11.6, W, { w: 0.7 });
    for (let k = 0; k < 6; k++) { const x = lerp(-27.6, -16.4, k / 5), b = g.p(x, -9.6, 11.6); g.fill2([[b[0] - 0.8, b[1]], [b[0] + 0.8, b[1]], [b[0] + 0.5, b[1] - 4.2], [b[0] - 0.5, b[1] - 4.2]], '#E2DCCE', true); g.disc2([b[0], b[1] - 4.9], 0.75, '#E2DCCE'); }
    K.text(g, 'L', -9.18, -22, 10.6, 0.5, 'CORDI JESU', '#8C8576', { center: true });
    // night: floodlit from the forecourt
    LX.flood(g, 0, 0.9, LX.FLOOD.warm, (c) => (c === '#BFC5C1' ? mix(nightColour(c), '#E8E2D6', 0.35) : undefined));
    for (const [x, z, r] of [[-31.5, 4, 2.4], [-12.5, 4, 2.4], [-22, 3, 2.6], [-22, 9.5, 2.2], [-31.5, 16, 2.0], [-12.5, 16, 2.0]]) g.glow('lantern', x, -8.4, z, { r, col: '#FFDDA6' });
  }, { name: 'basilica front' });

  /* ---------------- the garden ---------------- */
  // the bandstand: an iron octagon on a stone base, slim posts, a pointed green roof; the band inside
  T.obj([-16, 14, -4, 26], function (g) {
    const c = [-10, 20], R = 5.2, n = 8, P = (k, r, z) => [c[0] + Math.cos(TAU * k / n + 0.39) * r, c[1] + Math.sin(TAU * k / n + 0.39) * r, z];
    K.cyl(g, c[0], c[1], R + 0.4, 0, 1.6, K.STONE, { n, w: 0.7 });
    const far = [], near = []; for (let k = 0; k < n; k++) { const p = P(k, R, 1.6); (p[0] + p[1] < c[0] + c[1] ? far : near).push(k); }
    const post = (k) => { const a = g.p.apply(g, P(k, R, 1.6)), b = g.p.apply(g, P(k, R, 7.4)); g.line2([a, b], { w: 0.5, c: '#2F4A3A', boil: false }); };
    far.forEach(post);
    // the band: a conductor, a trumpet, a tuba, a drum
    const who = [[-1.6, -1.2, 0, 1001], [1.4, -1.8, 1, 1002], [-0.6, 1.8, 1, 1003], [2.0, 1.2, 1, 1004]];
    for (const [dx, dy, d, s] of who) { const r = LX.person(g, c[0] + dx, c[1] + dy, 1.6, LX.who(s, { dir: d, pose: 'hold', top: '#2F3A4F', bot: '#2F3A4F', cap: '#2F3A4F' })); const h = r.hands[0]; if (s === 1003) g.ring2([h[0], h[1] - 1.4], 1.6, { w: 0.8, c: '#C9A44A' }); else if (s === 1002) g.line2([h, [h[0] + 3, h[1] - 1]], { w: 0.6, c: '#C9A44A', boil: false }); else if (s === 1004) { g.disc2([h[0], h[1] + 0.6], 1.4, '#F3F1EA'); g.ring2([h[0], h[1] + 0.6], 1.4, { w: 0.4, c: '#C9463E' }); } }
    near.forEach(post);
    const rl = []; for (let k = 0; k <= n; k++) rl.push(P(k % n, R, 2.6)); g.fine(rl.filter((p) => true), { w: 0.4, c: '#2F4A3A' });
    const eave = []; for (let k = 0; k < n; k++) eave.push(P(k, R + 0.5, 7.4)); const apex = [c[0], c[1], 10.6];
    for (let k = 0; k < n; k++) { const a = eave[k], b = eave[(k + 1) % n]; const facing = (a[0] + b[0]) / 2 + (a[1] + b[1]) / 2 > c[0] + c[1]; g.fill([a, b, apex], facing ? '#5E8A6A' : '#4F7A5E'); }
    g.outline(eave, { w: 0.7, c: '#22302A' }); for (const k of near) g.line([eave[k], apex], { w: 0.5, c: '#22302A', boil: false });
    const t = g.p.apply(g, apex); g.line2([t, [t[0], t[1] - 2.4]], { w: 0.45, c: '#22302A', boil: false });
    g.glow('lamp', c[0], c[1], 7.0, { r: 1.8, base: 1.6 });                                    // night: a lamp under the roof for the band
  }, { name: 'bandstand' });
  // listeners on folding chairs before the bandstand
  for (let i = 0; i < 6; i++) { const x = -18 + (i % 3) * 2.6, y = 30 + Math.floor(i / 3) * 2.8; T.cast([x, y], (g) => { K.box(g, x - 0.6, y - 0.6, x + 0.6, y + 0.6, 0.9, 1.3, { t: '#3F6A4E', l: '#4F7A5E', r: '#3A604A' }, { w: 0.3, boil: false }); LX.person(g, x, y, 1.3, LX.who(1010 + i, { dir: 3, pose: 'sit' })); }); }
  // trees: jacarandas, palms, a big shady tree by the pond
  [[-4, -4, 'j'], [30, -22, 'j'], [36, 30, 'j'], [10, 30, 'j'], [24, -28, 'p'], [-2, 32, 'p'], [28, 33, 't']].forEach(([x, y, k], i) => T.obj([x, y], (g) => (k === 'j' ? LX.jacaranda(g, x, y, { r: 4.6, h: 5.2, fallen: true, seed: 400 + i }) : k === 'p' ? K.palm(g, x, y, { h: 13 }) : K.tree(g, x, y, { r: 5.6, h: 5.6, col: '#6E9A4E' })), { name: 'tree' }));
  // the kiosk and its tables
  T.obj([2, -28, 8, -22], (g) => { const c = [5, -25]; K.cyl(g, c[0], c[1], 2.2, 0, 4.0, { t: '#4F7A5E', l: '#5E8A6A', r: '#46705A' }, { n: 8, w: 0.6 }); K.cyl(g, c[0], c[1], 2.6, 4.0, 4.5, { t: '#3F6A4E', l: '#4F7A5E', r: '#3A604A' }, { n: 8, w: 0.5 }); K.dome(g, c[0], c[1], 2.4, 4.5, 2.0, '#4F7A5E', { w: 0.6 }); g.glow('lamp', c[0] + 1.6, c[1] + 1.6, 3.6, { r: 1.3, base: 0 }); }, { name: 'kiosk' });   // (its lamp over the tables at night)
  [[10, -22], [4, -16]].forEach(([x, y], i) => T.cast([x, y], function (g) {
    const tt = g.p(x, y, 2.4), tb = g.p(x, y, 0); g.segs2([tb[0], tb[1], tt[0], tt[1]], '#3A3530', 0.45); g.fill2(arcPts(tt[0], tt[1], 2.4, 0, TAU, 12).map((q) => [q[0], tt[1] + (q[1] - tt[1]) * 0.5]), '#F3F1EA', true);
    for (const [dx, d, k] of [[-1.8, 0, 0], [1.8, 1, 1]]) LX.person(g, x + dx, y, 1.3, LX.who(1020 + i * 2 + k, { dir: d, pose: 'sit' }));
  }));
  // children feeding the ducks; the ducks on the pond
  T.cast([5, 13], (g) => { LX.person(g, 4.6, 13.4, 0, LX.who(1030, { dir: 3, k: 0.7, pose: 'hold', reach: [3, -5] })); LX.person(g, 2.6, 14.8, 0, LX.who(1031, { dir: 3, pose: 'hold' })); });
  T.actor({ sample: 0.4, period: 30, at(t) { const u = ((t / 30) % 1 + 1) % 1, k = Math.floor(u * pond.length), p = pond[k], c = [16, 5]; return { x: lerp(p[0], c[0], 0.3), y: lerp(p[1], c[1], 0.3), z: 0.05, key: 'd' + (Math.floor(u * 8)), f: Math.floor(u * 8) }; },
    draw(g, st) { for (let i = 0; i < 4; i++) { const q = g.p(-i * 1.4, -i * 0.3, 0), w = i ? '#8C7A5A' : '#3E7A5E'; g.fill2([[q[0] - 1.1, q[1]], [q[0] + 1.1, q[1]], [q[0] + 0.8, q[1] - 0.9], [q[0] - 0.9, q[1] - 0.7]], i ? '#B9A27D' : '#F3F1EA', true); g.disc2([q[0] + 0.8, q[1] - 1.3], 0.5, w); g.segs2([q[0] + 1.2, q[1] - 1.3, q[0] + 1.9, q[1] - 1.2], '#E8A93A', 0.35); } } });
  // a picnic on the lawn, the reader on his bench, the nanny with the pram, the dog walker, joggers
  T.cast([22, 26], (g) => { const q = [[19.6, 24.6], [24.4, 24.6], [24.4, 27.4], [19.6, 27.4]].map(([a, b]) => [a, b, 0.05]); g.fill(q, '#E2483D'); g.fill([[19.6, 24.6, 0.06], [22, 24.6, 0.06], [22, 26, 0.06], [19.6, 26, 0.06]], '#F7F5EF'); LX.person(g, 19.4, 25.4, 0, LX.who(1040, { dir: 0, pose: 'sit' })); LX.person(g, 23, 28.4, 0, LX.who(1041, { dir: 3, pose: 'sit' })); LX.person(g, 22.6, 25.6, 0.05, LX.who(1042, { dir: 0, lie: -2.6 })); });
  T.obj([-24, 4], (g) => K.bench(g, -24, 4, { face: 'R', L: 2.2, col: '#4F7A5E' }), { name: 'bench' });
  T.cast([-22.6, 4], (g) => { const r = LX.person(g, -22.6, 4, 1.3, LX.who(1043, { dir: 0, pose: 'hold', hair: '#D9D5CB', glasses: true, cap: '#3B3F47' })); const h = r.hands[0]; g.fill2([[h[0] - 2.4, h[1] - 2.6], [h[0] + 2.0, h[1] - 3.2], [h[0] + 2.2, h[1] + 0.4], [h[0] - 2.2, h[1] + 0.8]], '#ECE8DC', true); });
  const pram = (A) => { const d = A.draw; A.draw = function (g, st) { d(g, st); const o = g.p(0, 0, 0), sx = st.dir === 0 || st.dir === 3 ? 1 : -1; g.fill2([[o[0] + sx * 3, o[1] - 6], [o[0] + sx * 7, o[1] - 6], [o[0] + sx * 6.6, o[1] - 2.6], [o[0] + sx * 3.4, o[1] - 2.6]], '#2F3A4F', true); g.ring2([o[0] + sx * 3.6, o[1] - 1.2], 1.0, { w: 0.5, c: '#2E2A26' }); g.ring2([o[0] + sx * 6.4, o[1] - 1.2], 1.0, { w: 0.5, c: '#2E2A26' }); }; };
  pram(LX.walker(T, LX.who(1044), K.curve(paths[2], 3).map((p) => [p[0], p[1]]).concat(K.curve(paths[2], 3).reverse().map((p) => [p[0] + 0.01, p[1] + 0.01])), 0.8, { phase: 0.3 }));
  LX.walker(T, LX.who(1045), K.curve(paths[0], 3).concat(K.curve(paths[0], 3).reverse().map((p) => [p[0], p[1] + 0.02])), 1.0, { phase: 0.6 });
  LX.walker(T, LX.who(1046, { shorts: true, top: '#E2483D' }), K.curve(paths[1], 3).concat(K.curve(paths[1], 3).reverse().map((p) => [p[0] + 0.02, p[1]])), 2.6, { phase: 0.1 });
  LX.walker(T, LX.who(1047, { shorts: true, top: '#3F8FD2' }), K.curve(paths[3], 3).concat(K.curve(paths[3], 3).reverse().map((p) => [p[0] + 0.02, p[1]])), 2.4, { phase: 0.5 });
  LX.walker(T, LX.who(1048), [[-34, -6], [-22, -6], [-22, 12], [-34, 12]], 1.0, { phase: 0.25 });
  // children playing football on the lawn, a painter at his easel by the pond, two people lying in the sun
  for (let i = 0; i < 4; i++) T.actor({ sample: 0.3, period: 6,
    at(t) { const u = ((t / 6 + i * 0.25) % 1 + 1) % 1, a = TAU * u + i, x = 16 + Math.cos(a) * (3 + i % 2), y = -30 + Math.sin(a * 0.7) * 2.6; const ph = Math.floor(((t * 2.2) % 1) * 8); return { x, y, key: (i % 2 ? 1 : 3) + '.' + ph, ph: ph / 8 }; },
    draw(g, st) { LX.person(g, 0, 0, 0, LX.who(1060 + i, { k: 0.72, shorts: true, dir: i % 2 ? 1 : 3, pose: 'walk', ph: st.ph })); } });
  T.cast([13, -29], (g) => { const c = g.p(13, -29, 0); g.disc2([c[0], c[1] - 1], 1.0, '#F7F5EF'); g.ring2([c[0], c[1] - 1], 1.0, { w: 0.3, c: '#2E2A26' }); });
  T.cast([22, 18], (g) => {
    const e = g.p(23.6, 18.4, 0); g.segs2([e[0] - 1.6, e[1], e[0], e[1] - 7, e[0] + 1.6, e[1], e[0], e[1] - 7, e[0], e[1] - 7, e[0] + 0.4, e[1] + 0.4], '#6E5A44', 0.45); g.fill2([[e[0] - 2.4, e[1] - 6.8], [e[0] + 2.4, e[1] - 6.8], [e[0] + 2.4, e[1] - 3.2], [e[0] - 2.4, e[1] - 3.2]], '#F3F1EA', true); g.fill2([[e[0] - 1.8, e[1] - 6], [e[0] + 1.8, e[1] - 6], [e[0] + 1.8, e[1] - 4.6], [e[0] - 1.8, e[1] - 4.6]], '#8DBFC3', true); g.fill2([[e[0] - 1.8, e[1] - 4.6], [e[0] + 1.8, e[1] - 4.6], [e[0] + 1.8, e[1] - 4.0], [e[0] - 1.8, e[1] - 4.0]], '#9C86D6', true);
    LX.person(g, 21.6, 18, 0, LX.who(1066, { dir: 0, pose: 'hold', reach: [3, -9], hat: '#E9D8A6', beard: true }));
  });
  T.cast([4, 27], (g) => { LX.person(g, 4, 27, 0.05, LX.who(1067, { dir: 1, lie: -2.6, shorts: true })); LX.person(g, 7.6, 28.2, 0.05, LX.who(1068, { dir: 1, lie: -2.4, dress: '#F2C230' })); });
});
