'use strict';
/* (100,100) Ipanema and Arpoador, at the bottom of the map.
   Built: Praça General Osório with the Sunday Feira Hippie — rows of stalls under white canopies selling paintings
   leant on panels, leather sandals, hammocks and beads round the old fountain — almond trees round the square, low
   blocks along the near edge (the Garota de Ipanema bar on the corner, a juice bar, an ice-cream shop) and a lower
   beachfront row than Copacabana's. Beyond the avenue: the sand, Posto 9 with the rainbow flag, and at the end of the
   beach the Arpoador rock, a granite whaleback standing in the surf, with people sitting on its back.
   Who: browsers and sellers at the fair, a painter at an easel, people at the bar's pavement tables, frescobol pairs
   on the wet sand, a coconut seller with his cart, a sacolé seller with a cooler, sunbathers, kids in the shallows,
   surfers riding the waves round the rock. */
SF.tile('ipanema', 100, 100, { rim: 40 }, function (T) {
  T.ground(function (g) {
    K.slab(g, 37, { top: '#E8E2D4' });
    const sq = K.rect(-34, -34, 10, 10); g.fill(sq, '#EEEADF'); RJ.mosaic(g, -34, -34, 10, 10, { sp: 2.2, c: '#5A544A' });
    g.fill(K.rect(10, -37, 23.5, 37), '#D9D3C6'); g.fill(K.rect(-37, 13, 23.5, 24.5), '#D9D3C6');
    const tw = [[71, -12, '#2F6DB5'], [83, -16, '#E86A9A'], [70, 18, '#F2C230'], [81, 22, '#3A9A5B'], [76, 33, '#D9463B'], [82, -30, '#F3F1EA']];
    for (const [x, y, c] of tw) { g.fill([[x - 1.2, y - 2.6, 0.02], [x + 1.2, y - 2.6, 0.02], [x + 1.2, y + 2.6, 0.02], [x - 1.2, y + 2.6, 0.02]], c); g.fill([[x - 1.2, y - 0.4, 0.03], [x + 1.2, y - 0.4, 0.03], [x + 1.2, y + 0.4, 0.03], [x - 1.2, y + 0.4, 0.03]], '#F6F3EA'); }
  }, { rim: true });

  /* ---------------- the fair round the fountain ---------------- */
  T.obj([-14.5, -14.5, -9.5, -9.5], function (g) {
    K.cyl(g, -12, -12, 2.5, 0, 0.9, { t: '#8CC6D2', l: '#D9D3C6', r: '#BDB6A6' }, { w: 0.6, n: 16 });
    K.cyl(g, -12, -12, 0.6, 0.9, 3.4, '#C9C2B2', { w: 0.5, n: 8 });
    K.cyl(g, -12, -12, 1.2, 3.4, 3.8, '#C9C2B2', { w: 0.5, n: 12 });
  }, { name: 'chafariz' });
  T.actor({ sample: 5, period: 2, at(t) { return { x: -12, y: -12, z: 3.8, key: Math.floor(t * 4) % 3, f: Math.floor(t * 4) % 3 }; },
    draw(g, st) { const c = g.p(0, 0, 0); for (let k = 0; k < 6; k++) { const a = TAU * k / 6 + st.f * 0.3, e = [c[0] + Math.cos(a) * 6.5, c[1] + 10 + Math.sin(a) * 2]; g.line2([c, [lerp(c[0], e[0], 0.5), c[1] - 3], e], { w: 0.5, c: '#CFE8EE', boil: false }); } } });
  const GOODS = ['art', 'sandal', 'rede', 'beads', 'art', 'bags'];
  const STALLS = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const x = -29 + c * 10, y = -31 + r * 8.6; if (Math.abs(x + 12) < 7 && Math.abs(y + 12) < 6) continue; STALLS.push([x, y, (r * 4 + c) % GOODS.length]); }
  STALLS.forEach(([x, y, gi], i) => T.obj([x - 3.2, y - 1.6, x + 3.2, y + 1.6], function (g) {
    // a trestle table, the goods on it (or paintings on a panel behind), a white canopy on four poles
    K.box(g, x - 3, y - 1.2, x + 3, y + 1.2, 0, 2.4, { t: '#F3F1EA', l: '#D9D3C6', r: '#BDB6A6' }, { w: 0.5, boil: false });
    const R = RNG(4600 + i), kind = GOODS[gi];
    if (kind === 'art') { g.fill(K.on('L', y - 1.0, x - 2.8, x + 2.8, 2.4, 6.0), '#E9E2CC'); for (let k = 0; k < 4; k++) { const q = K.on('L', y - 0.95, x - 2.6 + k * 1.35, x - 1.5 + k * 1.35, 2.7 + (k % 2) * 0.5, 4.9 + (k % 2) * 0.5); g.fill(q, R.pick(['#2F6DB5', '#F2C230', '#3A9A5B', '#E86A9A', '#EE8A2E', '#5FC0B0'])); g.fill(K.on('L', y - 0.9, x - 2.3 + k * 1.35, x - 1.8 + k * 1.35, 3.3 + (k % 2) * 0.5, 4.1 + (k % 2) * 0.5), R.pick(['#F6F3EA', '#D9463B', '#2A2622'])); g.outline(q, { w: 0.3, c: '#7A6A55', boil: false }); } }
    else for (let k = 0; k < 8; k++) { const p = g.p(x - 2.4 + (k % 4) * 1.6, y - 0.6 + Math.floor(k / 4) * 1.0, 2.45); const col = kind === 'sandal' ? R.pick(['#8A5A3A', '#B07A44', '#5A3A24']) : kind === 'rede' ? R.pick(['#E86A9A', '#F2C230', '#2F6DB5', '#3A9A5B']) : R.pick(['#D9463B', '#F2C230', '#5FC0B0', '#9B7FC9', '#F6F3EA']); g.fill2([[p[0] - 1.1, p[1] - 0.5], [p[0] + 1.1, p[1] - 0.5], [p[0] + 1.1, p[1] + 0.5], [p[0] - 1.1, p[1] + 0.5]], col, true); }
    const posts = []; for (const [px, py] of [[x - 3.2, y - 1.6], [x + 3.2, y - 1.6], [x + 3.2, y + 1.6], [x - 3.2, y + 1.6]]) { const a = g.p(px, py, 0), b = g.p(px, py, 6.6); posts.push(a[0], a[1], b[0], b[1]); } g.segs2(posts, '#8C8576', 0.45);
    const roof = [[x - 3.6, y - 2.0, 6.8], [x + 3.6, y - 2.0, 6.8], [x + 3.6, y + 2.0, 6.2], [x - 3.6, y + 2.0, 6.2]]; g.fill(roof, '#F6F4EE'); g.outline(roof, { w: 0.5, c: '#9A9488', boil: false });
    if (kind === 'rede') { for (let k = 0; k < 3; k++) { const a = g.p(x - 3.2 + k * 2.6, y + 1.6, 6.0), b = g.p(x - 1.0 + k * 2.6, y + 1.6, 6.0); g.fill2([a, b, [b[0], b[1] + 6], [lerp(a[0], b[0], 0.5), a[1] + 8], [a[0], a[1] + 6]], ['#E86A9A', '#F2C230', '#2F6DB5'][k], true); } }
  }, { name: 'barraca' }));
  // sellers at the ends of their stalls, browsers walking the aisles, a painter at an easel
  STALLS.forEach(([x, y], i) => { if (i % 3 === 2) return; T.cast([x + 3.8, y + 0.6], (g) => RJ.person(g, x + 3.8, y + 0.6, 0, Object.assign(RJ.who(4620 + i), { dir: 1, pose: i % 4 === 0 ? 'hold' : 'stand', sunhat: i % 3 === 0 })), {}); });
  for (let k = 0; k < 12; k++) { const row = -27 + (k % 4) * 8.6, pts = k % 2 ? [[-33, row], [8, row]] : [[8, row + 0.8], [-33, row + 0.8]]; RJ.walker(T, RJ.who(4640 + k, { set: k === 3 ? { sunhat: true } : {} }), pts, 0.8 + h1(k) * 0.3, { phase: h1(k * 5 + 1) }); }
  T.cast([4, 5], (g) => { const f = g.p(4, 4, 0); g.segs2([f[0] - 1.6, f[1], f[0], f[1] - 9, f[0] + 1.6, f[1], f[0], f[1] - 9, f[0], f[1] - 9, f[0] + 0.4, f[1] + 0.4], '#8A6A4A', 0.5); g.fill2([[f[0] - 3, f[1] - 9.4], [f[0] + 3, f[1] - 8.6], [f[0] + 3, f[1] - 3.6], [f[0] - 3, f[1] - 4.4]], '#F6F3EA', true); g.fill2([[f[0] - 2.4, f[1] - 8.4], [f[0] + 2.4, f[1] - 7.8], [f[0] + 2.4, f[1] - 6.2], [f[0] - 2.4, f[1] - 6.8]], '#5FC0B0', true); g.fill2([[f[0] - 2.4, f[1] - 6.6], [f[0] + 2.4, f[1] - 6.0], [f[0] + 2.4, f[1] - 4.4], [f[0] - 2.4, f[1] - 5.0]], '#F2C230', true); RJ.person(g, 5.6, 6, 0, Object.assign(RJ.who(4650, { carnaval: false }), { dir: 2, pose: 'hold', hands: [[-2, -15], [-1, -11]], sunhat: true })); }, {});
  // browsers stopping at the stalls, a juice bar on the corner, mopeds, kids and a dog
  STALLS.forEach(([x, y], i) => { if (i % 2) return; T.cast([x - 1.2, y + 3.0], (g) => { RJ.person(g, x - 1.2, y + 3.0, 0, Object.assign(RJ.who(4660 + i), { dir: 3, pose: i % 4 ? 'hold' : 'stand', phone: i % 4 === 2 })); if (i % 4 === 0) RJ.person(g, x + 1.0, y + 3.4, 0, Object.assign(RJ.who(4680 + i, { set: { k: 0.74 } }), { dir: 3, pose: 'stand' })); }, {}); });
  RJ.suco(T, -3, 19.2, 4700, 'SUCOS');
  RJ.parked(T, 13, 14.6, 5, 'x', 4705);
  RJ.dog(T, [[-33, 11], [8, 11.5], [-10, 12]], 1.4, '#7A5230', 0.1);
  // almond trees round the square
  for (const [x, y] of [[-35.5, -20], [-35.5, 0], [-20, -35.5], [0, -35.5], [12, -2], [12, -24], [-24, 12], [-4, 12]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 4.0, h: 5, col: ['#6E9C52', '#5E8F4E', '#7FAE5E'][Math.abs(x + y) % 3] }), { name: 'amendoeira' });

  /* ---------------- the blocks ---------------- */
  const BL = [[24, -36.5, 36, -13, 12.4, '#E9DDC4', 4701], [24, -12, 36, 12, 11.2, '#F0B9A0', 4702], [24, 13, 36, 36.5, 13.0, '#D9E3EE', 4703]];
  for (const [x0, y0, x1, y1, h, c, s] of BL) T.obj([x0, y0, x1, y1], (g) => { g.boilP = 0.25; RJ.block(g, x0, y0, x1, y1, h, c, s, { pool: s === 4702 }); }, { name: 'prédio' });
  const NR = [[-36.5, 25.5, -18, 36.5, 7.6, '#F3EFE4', ['GAROTA DE IPANEMA'], '#2F6DB5'], [-17, 25.5, 2, 36.5, 8.4, '#F2D24B', ['SUCOS', 'SORVETES'], '#D9463B'], [3, 25.5, 22, 36.5, 9.2, '#CFE3D8', ['MODA PRAIA', 'FARMÁCIA'], '#3A9A5B']];
  NR.forEach(([x0, y0, x1, y1, h, c, words, sc], i) => T.obj([x0, y0, x1, y1], (g) => {
    g.boilP = 0.25; RJ.block(g, x0, y0, x1, y1, h, c, 4710 + i, { balc: i !== 0, gf: 3.8 });
    const n = words.length; for (let k = 0; k < n; k++) K.sign(g, 'L', y1 + 0.06, lerp(x0 + 0.8, x1 - 0.8, k / n), lerp(x0 + 0.8, x1 - 0.8, (k + 1) / n) - 0.5, 2.6, 3.6, sc, words[k]);
    if (i === 0) { const aw = [[x0 + 0.5, y1, 3.7], [x1 - 0.5, y1, 3.7], [x1 - 0.5, y1 + 2.2, 2.9], [x0 + 0.5, y1 + 2.2, 2.9]]; g.fill(aw, '#2F6DB5'); for (let k = 0; k < 9; k += 2) g.fill([[x0 + 0.5 + k * 1.9, y1, 3.7], [x0 + 2.4 + k * 1.9, y1, 3.7], [x0 + 2.4 + k * 1.9, y1 + 2.2, 2.9], [x0 + 0.5 + k * 1.9, y1 + 2.2, 2.9]], '#F6F3EA'); g.outline(aw, { w: 0.5, boil: false }); }
  }, { name: 'loja' }));
  // the Garota de Ipanema's pavement tables (outside, on the pavement beyond the tile's edge)
  for (const [x, s] of [[-33, 4730], [-27, 4732], [-21, 4734]]) T.cast([x, 39.5], (g) => { const f = g.p(x, 39.5, 0); RJ.table2(g, f); RJ.person(g, x - 1.2, 40.2, 1.3, Object.assign(RJ.who(s), { dir: 0, pose: 'sit', cup: '#F2C230' })); RJ.person(g, x + 1.2, 38.9, 1.3, Object.assign(RJ.who(s + 1), { dir: 1, pose: 'sit', cup: '#F2C230' })); }, {});

  // the avenue's building-side pavement: trees with people in their shade, a banca, mopeds
  for (const y of [-29, -9, 22]) RJ.shadeTree(T, 40.2, y, 4720 + Math.round(y), { r: 3.8 });
  RJ.banca(T, 40.2, 31, 4730); RJ.parked(T, 39.6, 0, 6, 'y', 4735);
  // more umbrellas and people on the sand
  for (const [x, y, a, b, k] of [[77, -33, '#D9463B', '#F6F3EA', 0], [84, -8, '#3A9A5B', '#F2C230', 1], [74, 24, '#2F6DB5', '#F6F3EA', 2]]) { T.obj([x, y], (g) => RJ.umbrella2(g, g.p(x, y, 0), a, b, { h: 5.6, r: 3.1 }), { name: 'barraca' }); T.cast([x + 1.4, y + 1.6], (g) => { RJ.chair2(g, g.p(x + 1.4, y + 1.6, 0), b, 'R'); RJ.person(g, x + 1.4, y + 1.6, 1.2, Object.assign(RJ.who(4790 + k * 3, { beach: true }), { dir: 0, pose: 'sit' })); RJ.person(g, x - 1.2, y + 2.8, 0.15, Object.assign(RJ.who(4791 + k * 3, { beach: true }), { lie: -2.5, pose: 'stand', dir: 0 })); }, {}); }
  /* ---------------- the beach: Posto 9, umbrellas, frescobol, sellers ---------------- */
  for (const y of [-30, -14, 4, 22, 34]) T.obj([66.4, y], (g) => RJ.coco(g, 66.4, y, { h: 13 + h1(y + 3) * 3, lean: (h1(y * 3) - 0.5) * 0.8 }), { name: 'coqueiro' });
  T.obj([68, 0, 72, 4], (g) => RJ.posto(g, 70, 2, 9), { name: 'posto 9' });
  T.actor({ sample: 5, period: 3, at(t) { const ph = Math.floor(((t * 1.3) % 1) * 8); return { x: 72.6, y: 6.6, key: ph, ph }; },
    draw(g, st) { const b = g.p(0, 0, 0), hh = 12 * VZ; g.segs2([b[0], b[1], b[0], b[1] - hh - 0.6], '#5A564E', 0.5); const top = [b[0], b[1] - hh], W = 16, H = 10.2, cols = ['#D9302B', '#EE8A2E', '#F2C230', '#3A9A5B', '#2F6DB5', '#7A4FB0'], wave = (u) => Math.sin(u * 2.8 - st.ph / 8 * TAU) * 1.0 * u;
      for (let i = 0; i < 6; i++) { const v0 = H * i / 6, v1 = H * (i + 1) / 6, row = []; for (let k = 0; k <= 6; k++) { const u = k / 6; row.push([top[0] + W * u, top[1] + v0 + wave(u)]); } for (let k = 6; k >= 0; k--) { const u = k / 6; row.push([top[0] + W * u, top[1] + v1 + wave(u)]); } g.fill2(row, cols[i], true); } } });
  const UMB = [[72, -26, '#2F6DB5', '#F6F3EA'], [80, -20, '#F2C230', '#3A9A5B'], [73, 13, '#E86A9A', '#F6F3EA'], [81, 29, '#D9463B', '#F2C230'], [72, 30, '#5FC0B0', '#F6F3EA']];
  UMB.forEach(([x, y, a, b], i) => {
    T.obj([x, y], (g) => RJ.umbrella2(g, g.p(x, y, 0), a, b, { h: 5.6, r: 3.1 }), { name: 'barraca' });
    T.cast([x + 1.4, y + 1.6], (g) => { RJ.chair2(g, g.p(x + 1.4, y + 1.6, 0), a, 'R'); RJ.person(g, x + 1.4, y + 1.6, 1.2, Object.assign(RJ.who(4740 + i, { beach: true }), { dir: 0, pose: 'sit' })); }, {});
  });
  for (const [x, y, s] of [[71, -12, 4750], [83, -16, 4751], [70, 18, 4752], [81, 22, 4753], [76, 33, 4754], [82, -30, 4755]]) T.cast([x, y], (g) => RJ.person(g, x, y, 0.15, Object.assign(RJ.who(s, { beach: true }), { lie: -2.5, pose: 'stand', dir: 0 })), {});
  // frescobol: two pairs knocking a ball back and forth with wooden paddles on the wet sand
  for (const [y0, s] of [[-4, 4760], [14, 4762]]) {
    const A = [83, y0], B = [83, y0 + 6];
    for (const [p, k, d] of [[A, 0, 1], [B, 1, 3]]) { const look = RJ.who(s + k, { beach: true }); T.actor({ sample: 5, period: 1.6,
      at(t) { const u = ((t / 0.8) % 2 + 2) % 2, hit = k === 0 ? u < 0.25 : u >= 1 && u < 1.25; return { x: p[0], y: p[1], key: hit ? 'h' : 's', hit }; },
      draw(g, st) { const r = RJ.person(g, 0, 0, 0, Object.assign({}, look, { dir: d, pose: 'stand', hands: st.hit ? [[3.4, -15], [-1.5, -10]] : [[2.6, -11.5], [-1.5, -10]] })); const h = r.hands[0]; g.fill2(arcPts(h[0] + (d === 1 ? -0.6 : 0.6), h[1] - 1.6, 1.5, 0, TAU, 8).map((q) => [q[0], h[1] - 1.6 + (q[1] - h[1] + 1.6) * 1.3]), '#B07A44', true); } }); }
    T.actor({ sample: 0.2, period: 1.6, layer: 'top', grow: false,
      at(t) { const u = ((t / 0.8) % 2 + 2) % 2, f = u % 1, a = u < 1 ? A : B, b = u < 1 ? B : A; return { x: lerp(a[0], b[0], f), y: lerp(a[1] + 0.8, b[1] - 0.8, f), z: 4.6 + Math.sin(Math.PI * f) * 1.6, key: 'b' }; },
      draw(g) { g.disc2(g.p(0, 0, 0), 0.7, '#F2C230'); } });
  }
  // the coconut cart, the sacolé seller, kids in the shallows
  T.cast([77, -6], (g) => { const c = g.p(77, -6, 0); g.fill2([[c[0] - 5, c[1] - 3], [c[0] + 5, c[1] - 1], [c[0] + 5, c[1] - 5], [c[0] - 5, c[1] - 7]], '#B07A44', true); for (let k = 0; k < 9; k++) g.disc2([c[0] - 4 + k, c[1] - 7 - (k % 3) * 1.2 + k * 0.2], 1.2, k % 2 ? '#7FB04A' : '#6E9C3E'); g.disc2([c[0] - 3.5, c[1] - 0.5], 1.3, '#3A3530'); g.disc2([c[0] + 3.5, c[1] + 1.4], 1.3, '#3A3530'); RJ.person(g, 79, -8.4, 0, Object.assign(RJ.who(4770, { carnaval: false }), { dir: 1, pose: 'hold', cap: '#F6F3EA' })); }, {});
  RJ.walker(T, RJ.who(4771, { carnaval: false, set: { top: '#F6F3EA', cap: '#2F6DB5' } }), [[70, 34], [86, 10], [70, -14], [86, -34], [70, -14], [86, 10]], 0.8,
    { phase: 0.3, extra: (g, st, r) => { const h = r.hands[0]; g.fill2([[h[0] - 2.6, h[1] - 1], [h[0] + 2.6, h[1] - 1], [h[0] + 2.4, h[1] + 3], [h[0] - 2.4, h[1] + 3]], '#F6F4EE', true); g.fill2([[h[0] - 2.6, h[1] - 1], [h[0] + 2.6, h[1] - 1], [h[0] + 2.6, h[1]], [h[0] - 2.6, h[1]]], '#2F6DB5', true); } });
  for (let i = 0; i < 4; i++) T.actor({ sample: 0.5, period: 12, grow: false,
    at(t) { const x = 88 + (i % 2) * 2 + Math.sin(t * 0.5 + i) * 1.2, y = -26 + i * 15, f = Math.floor(t * 2 + i) % 2; return { x, y, z: RS.WZ, key: f, f }; },
    draw(g, st) { const c = g.p(0, 0, 0); g.fill2(arcPts(c[0], c[1], 2.8, 0, TAU, 10).map((q) => [q[0], c[1] + (q[1] - c[1]) * 0.4]), '#BEE0E2', true); RJ.person(g, 0, 0, -3.4, Object.assign(RJ.who(4780 + i, { beach: true }), { dir: 0, pose: st.f ? 'cheer' : 'stand', k: 0.8, noLegs: true })); g.fill2(arcPts(c[0], c[1] - 0.2, 3.0, 0, Math.PI, 8).map((q) => [q[0], c[1] - 0.2 + (q[1] - c[1] + 0.2) * 0.4]), '#7FC0C9', true); } });

  /* ---------------- Arpoador: the rock, the people on it, the surfers ---------------- */
  const AR = [[RS.WZ, 11, 8, 0, 0], [2.4, 10.4, 7.4, 0.3, 0.2], [5, 8.6, 6.0, 0.8, 0.3], [7, 6.4, 4.6, 1.2, 0.4], [8.4, 3.8, 2.8, 1.4, 0.4], [9.0, 1.6, 1.2, 1.4, 0.4]];
  const ARP = [91, -52];
  T.obj([ARP[0] - 11, ARP[1] - 8, ARP[0] + 11, ARP[1] + 8], function (g) {
    g.boilP = 0.2;
    RJ.rock(g, ARP[0], ARP[1], AR, { seed: 41, col: '#B8AF9E', veg: [2, 5.5, 0.6], streaks: 16 });
    const sp = []; for (let i = 0; i < 12; i++) { const a = -0.7 + i * 0.25, p = g.p(ARP[0] + Math.cos(a) * 11.6, ARP[1] + Math.sin(a) * 8.6, RS.WZ); sp.push([p[0], p[1]]); } g.line2(sp, { w: 0.9, c: '#F6F8F3', boil: false });
  }, { name: 'arpoador' });
  const AW = RJ.rockW(ARP[0], ARP[1], AR, { seed: 41 });
  for (const [i, th, s] of [[3, 1.3, 4790], [3, 0.9, 4791], [2, 1.7, 4792], [4, 1.2, 4793], [2, 0.5, 4794]]) { const p = AW(i, th, 0.2); T.cast([p[0], p[1]], (g) => RJ.person(g, p[0], p[1], p[2] + 0.1, Object.assign(RJ.who(s), { dir: 0, pose: 'sit', k: 0.9 })), { on: true }); }
  for (let i = 0; i < 3; i++) T.actor({ sample: 0.3, period: 8, grow: false,
    at(t) { const u = ((t / 8 + i * 0.33) % 1), x = lerp(106, 93, u), y = -64 + i * 9 + u * 7, a = Math.min(1, u * 6, (1 - u) * 6); return { x, y, z: RS.WZ, key: 's', alpha: a < 1 ? a : null }; },
    draw(g) { K.rbox(g, 0, 0, 1.6, 0.42, Math.PI * 0.9, 0, 0.2, { t: '#F6F3EA', l: '#2F6DB5', r: '#255A98' }, { w: 0.4 }); g.fill(K.rect(-2.4, -1.4, 1.6, 1.4).map((p) => [p[0], p[1], 0]), 'rgba(246,248,243,0.6)'); RJ.person(g, 0, 0, 0.2, Object.assign(RJ.who(4800 + i, { beach: true }), { dir: 1, pose: 'crouch', sway: -0.5 })); } });
});
