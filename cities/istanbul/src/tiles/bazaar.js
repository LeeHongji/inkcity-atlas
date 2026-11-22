'use strict';
/* (-100,100) The Grand Bazaar (Kapalıçarşı), in cutaway. What it is: a walled town of covered streets. Thick stone walls
   and a roofscape of lead domes and barrel vaults; inside, vaulted streets lined with tiny shops under painted arches.
   Here the main street (running east–west through the middle) has its vault cut away so you can look down into it:
   the far half of the painted vault still curves up from the far wall, the arch ribs cross overhead, and below them the
   shops: carpets and kilims hung and piled, mosaic glass lamps glowing in clusters, ceramics, copper, jewellers' bright
   windows, spice and Turkish-delight counters, a tea boy. Shoppers browse, sellers sit on stools in their doorways, and
   porters (hamal) bent under towering loads push through. The Nuruosmaniye gate on the east end with KAPALIÇARŞI over
   it; outside, the Column of Constantine at Çemberlitaş by the tram avenue, with its iron hoops.
   What moves: shoppers and porters along the open street, a tea boy, pigeons and a cat outside. */
SF.tile('bazaar', -100, 100, { rim: 26 }, function (T) {
  const H = 37, BZ = { x0: -34, x1: 20, y0: -33, y1: 26 }, ST = { y0: 3, y1: 11 }, WH = 6.4;   // the walls; the open street
  const S = { t: '#D8CCB2', l: '#E4D8BE', r: '#CBBD9F' };
  T.ground(function (g) {
    IS.ground(g, -H, -H, H, H, '#E5DCC9', { cut: 'y' });
    IS.paving(g, -H, -H, H, H, { len: 2.4 });
    // the open street's floor: worn stone with a runner of carpets
    g.fill(K.rect(BZ.x0, ST.y0, BZ.x1 + 4, ST.y1), '#D9CDB4');
    const R = RNG(9); for (let x = BZ.x0 + 3; x < BZ.x1 - 2; x += 7) { const c = R.pick(['#A8372E', '#7A2E3A', '#3F4F7A', '#B8742E']); g.fill(K.rect(x, ST.y0 + 2.6, x + 4.6, ST.y1 - 2.6, 0.02), c); g.outline(K.rect(x + 0.4, ST.y0 + 3.0, x + 4.2, ST.y1 - 3.0, 0.03), { w: 0.35, c: '#E9C46A', boil: false }); }
  }, { rim: true });

  /* ---- the roofed blocks either side of the open street (far block, then the near block) ---- */
  const roofBlock = (g, x0, y0, x1, y1, seed) => {
    K.box(g, x0, y0, x1, y1, 0, WH, S, { w: 0.85 });
    const R = RNG(seed);
    for (let x = x0 + 2.6; x < x1 - 1; x += 4.8) for (let y = y0 + 2.6; y < y1 - 1; y += 4.8) { if (R() < 0.82) IS.dome(g, x, y, 1.9, WH, { drum: 0.3, win: 0, h: 1.5, ribs: 0, alem: false, w: 0.45 }); else K.box(g, x - 1.5, y - 1.5, x + 1.5, y + 1.5, WH, WH + 1.6, '#CBBD9F', { w: 0.45 }); }
  };
  T.obj([BZ.x0, BZ.y0, BZ.x1, ST.y0], function (g) {
    g.boilP = 0.25;
    roofBlock(g, BZ.x0, BZ.y0, BZ.x1, ST.y0 - 1.2, 3);
    // the Bedesten: the old core, a bigger block with a grid of domes rising above the rest
    K.box(g, -20, -26, 0, -12, WH, WH + 2.4, S, { w: 0.75 }); for (let x = -17.5; x < -1; x += 5) for (let y = -23.5; y < -13; y += 5) IS.dome(g, x, y, 2.2, WH + 2.4, { drum: 0.4, win: 0, h: 1.8, ribs: 6, alem: false, w: 0.5 });
    // the far wall of the open street: shopfronts under painted arches, with goods
    const f = ST.y0 - 1.2, P = (a, d, z) => [a, f + d, z];
    g.fill(K.on('L', f + 0.01, BZ.x0, BZ.x1, 0, WH), '#E9DFC9');
    for (let x = BZ.x0 + 0.6, i = 0; x < BZ.x1 - 3; x += 4.6, i++) {
      const kind = ['carpet', 'lamp', 'jewel', 'ceramic', 'carpet', 'spice', 'lamp', 'copper', 'jewel', 'lamp', 'carpet', 'delight'][i % 12];
      // at night (the open street seen as in the evening): every shop lit inside, its goods in its light, its sign lit
      { const j0 = g.cmds.length; IS.arcade(g, 'L', f + 0.02, x, x + 4.2, 0, 4.6, 1, { dark: kind === 'jewel' ? '#5E4A2E' : '#5A4A3E' }); IS.litCols(g, j0, { '#5E4A2E': '#FFE7B0', '#5A4A3E': '#F6BA64' }, { win: 1, spill: true }); }
      { const j0 = g.cmds.length; IS.bazaarGoods(g, kind, P, x, x + 4.2, i); IS.lift(g, j0, 0.62); }
      { const j0 = g.cmds.length; K.sign(g, 'L', f + 0.03, x + 0.3, x + 3.9, 4.75, 5.6, ['#2E5E8A', '#7A2E3A', '#2E6E5A', '#3B3F47'][i % 4], ['HALI', 'LAMBA', 'KUYUMCU', 'ÇİNİ', 'KİLİM', 'BAHARAT', 'FENER', 'BAKIR', 'SARRAF', 'AYDINLATMA', 'ANTİKA', 'LOKUM'][i % 12], { w: 0.28 }); IS.litSign(g, j0, { r: 1.0 }); }
    }
    // the far half of the vault, painted, and the ribs springing across
    const vz = WH, vr = (ST.y1 - ST.y0 + 1.2) / 2, yc = (f + ST.y1) / 2;
    for (let x = BZ.x0; x < BZ.x1; x += 4.6) {
      const half = []; for (let k = 0; k <= 8; k++) { const a = Math.PI - (Math.PI / 2) * k / 8; half.push([x, yc + vr * Math.cos(a), vz + vr * 0.55 * Math.sin(a)]); }
      const nx = Math.min(BZ.x1, x + 4.6), q = half.concat(half.slice().reverse().map((p) => [nx, p[1], p[2]]));
      g.fill(q, '#F0E6CF'); g.mark({ nc: IS.floodCol('#F0E6CF', 0.62, '#FFD49A') });   // the painted vault in the shops' light
      const pat = []; for (let k = 1; k < 8; k += 2) { const a = half[k]; const b = [nx, a[1], a[2]]; const pa = g.p.apply(g, a), pb = g.p.apply(g, b); pat.push(pa[0], pa[1], pb[0], pb[1]); }
      g.segs2(pat, '#3F6E8A', 0.35);
      const d = []; for (let k = 2; k < 8; k += 3) { const a = g.p.apply(g, [(x + nx) / 2, half[k][1], half[k][2]]); d.push(a); } for (const p of d) g.disc2(p, 0.6, '#B8322A');
      g.line(half, { w: 0.6, c: '#8C7A5A', boil: false });
    }
  }, { name: 'bazaar far' });
  // the arch ribs over the open street (each rib its own thin object so walkers sort with them)
  for (let x = BZ.x0 + 4.6; x < BZ.x1; x += 9.2) T.obj([x - 0.3, ST.y0 - 1.2, x + 0.3, ST.y1 + 1.2], (g) => { const yc = (ST.y0 - 1.2 + ST.y1 + 1.2) / 2, vr = (ST.y1 - ST.y0 + 2.4) / 2, pts = []; for (let k = 0; k <= 12; k++) { const a = Math.PI * k / 12; pts.push([x, yc - vr * Math.cos(a), WH + vr * 0.55 * Math.sin(a)]); } g.line(pts, { w: 1.1, c: '#9E8A64', boil: false }); g.line(pts, { w: 0.4, c: '#E9DFC9', boil: false }); g.glow('lantern', x, yc, WH + vr * 0.55 - 1.4, { r: 1.2, col: '#FFD49A' }); }, { name: 'rib' });   // at night a lamp hangs from each rib
  T.obj([BZ.x0, ST.y1, BZ.x1, BZ.y1], function (g) {
    g.boilP = 0.25;
    // the near half is cut away like a drawing in section: walls cut low, the cut faces hatched, the shops' floors and
    // their goods visible from above, the roof only over the far part of the block
    const CZ = 1.8, y0 = ST.y1 + 1.2;
    roofBlock(g, BZ.x0, y0 + 8, BZ.x1, BZ.y1, 7);
    K.box(g, BZ.x0, y0, BZ.x1, y0 + 8, 0, CZ, { t: '#C2AE8A', l: '#E4D8BE', r: '#CBBD9F' }, { w: 0.8 });
    const hs = []; for (let x = BZ.x0 + 0.5; x < BZ.x1; x += 0.9) { const a = g.p(x, y0, CZ), b = g.p(x + 0.6, y0 + 0.6, CZ); hs.push(a[0], a[1], b[0], b[1]); } g.segs2(hs, '#8E7A5A', 0.3);
    for (let x = BZ.x0 + 0.5, i = 0; x < BZ.x1 - 3; x += 4.6, i++) {
      g.fill(K.rect(x + 0.3, y0 + 0.6, x + 4.3, y0 + 7.4, CZ + 0.02), ['#E9DFC9', '#E2D4B6'][i % 2]);
      const kind = i % 4, R = RNG(i * 17 + 3);
      const j0 = g.cmds.length;
      if (kind === 0) { for (let k = 0; k < 4; k++) { const y = y0 + 1.6 + k * 1.4, c = R.pick(['#A8372E', '#3F4F7A', '#B8742E', '#7A2E3A', '#2E6E5A']); K.box(g, x + 0.8, y - 0.55, x + 3.8, y + 0.55, CZ, CZ + 1.0, { t: shade(c, -0.1), l: c, r: shade(c, 0.12) }, { w: 0.4, boil: false }); g.line([[x + 3.8, y - 0.5, CZ + 0.5], [x + 3.8, y + 0.5, CZ + 0.5]], { w: 0.3, c: '#E9C46A', boil: false }); } }
      else if (kind === 1) { K.box(g, x + 0.8, y0 + 1.2, x + 3.8, y0 + 3.2, CZ, CZ + 1.4, { t: '#8A6A4A', l: '#7A5A3C', r: '#6A4A30' }, { w: 0.4, boil: false }); for (let k = 0; k < 5; k++) { const p = g.p(x + 1.2 + (k % 3) * 1.1, y0 + 1.6 + Math.floor(k / 3) * 1.0, CZ + 1.4); g.line2([p, [p[0], p[1] - 2.2]], { w: 0.25, c: '#B48A3A', boil: false }); const col = R.pick(['#E8573A', '#3F7FB8', '#E9C46A', '#5FA58F', '#C978B4']); g.disc2([p[0], p[1] - 3.0], 1.1, col); g.mark({ nc: IS.mosaic(col) }); if (k % 2 === 0) g.glow2('lantern', [p[0], p[1] - 3.0], [p[0], -1e6], { r: 0.8, col: IS.mosaic(col) }); } }   // mosaic lamps, lit at night
      else if (kind === 2) { const c = g.p(x + 2.3, y0 + 3.6, CZ); for (let k = 0; k < 3; k++) IS.cone2(g, [c[0] - 3.4 + k * 3.4, c[1] + k * 0.4], 1.6, 2.4, ['#B8322A', '#E3A72F', '#7A2E3A'][k]); }
      else { K.box(g, x + 0.8, y0 + 1.2, x + 3.8, y0 + 2.8, CZ, CZ + 1.6, { t: '#F2DFA0', l: '#E9D3A6', r: '#D9C08A' }, { w: 0.4, boil: false }); const d = []; for (let k = 0; k < 8; k++) d.push(g.p(x + 1.0 + R() * 2.6, y0 + 1.4 + R() * 1.2, CZ + 1.62)); for (const p of d) g.disc2(p, 0.4, R.pick(['#D9AE4A', '#C9CED2'])); IS.litCols(g, j0, { '#F2DFA0': true, '#D9AE4A': true, '#C9CED2': '#F4F6FA' }); g.glow('lantern', x + 2.3, y0 + 2.0, CZ + 2.2, { r: 0.9, col: '#FFE9B8' }); }   // a jeweller's counter, bright
      IS.lift(g, j0, 0.55);
    }
    for (let x = BZ.x0 + 3; x < BZ.x1 - 1; x += 4) K.win(g, 'L', BZ.y1 + 0.02, x, x + 1.2, 3.6, 5.4, { style: 'dark', arch: true, col: '#4E5866', w: 0.3 });
  }, { name: 'bazaar near' });
  // the open street's near side: shopfronts seen from behind are hidden; their goods stand at the near edge
  /* ---- the gate on the east end ---- */
  T.obj([BZ.x1, ST.y0 - 2.4, BZ.x1 + 3.6, ST.y1 + 2.4], function (g) {
    const G = { t: '#DCD0B6', l: '#E9DFC9', r: '#D3C6AA' }, i0 = g.cmds.length;
    K.box(g, BZ.x1, ST.y0 - 2.4, BZ.x1 + 3.6, ST.y0 - 0.6, 0, WH + 2.2, G, { w: 0.8 }); K.box(g, BZ.x1, ST.y1 + 0.6, BZ.x1 + 3.6, ST.y1 + 2.4, 0, WH + 2.2, G, { w: 0.8 });
    K.box(g, BZ.x1, ST.y0 - 2.4, BZ.x1 + 3.6, ST.y1 + 2.4, WH, WH + 2.2, G, { w: 0.8 });
    const yc = (ST.y0 + ST.y1) / 2, q = []; for (let k = 0; k <= 10; k++) { const a = Math.PI * k / 10; q.push([BZ.x1 + 3.62, yc + 4.0 * Math.cos(a), 3.8 + 2.0 * Math.sin(a)]); }
    g.line(q, { w: 0.6, boil: false });
    const j0 = g.cmds.length;
    K.sign(g, 'R', BZ.x1 + 3.64, ST.y0 + 0.2, ST.y1 - 0.2, WH + 0.4, WH + 1.8, '#1F3E5A', 'KAPALIÇARŞI', { w: 0.3, ink: '#E9C46A' });
    const tg = g.p(BZ.x1 + 3.66, yc, 6.0); g.disc2(tg, 1.0, '#1F3E5A'); g.segs2([tg[0] - 0.6, tg[1] + 0.4, tg[0], tg[1] - 0.6, tg[0], tg[1] - 0.6, tg[0] + 0.5, tg[1] + 0.3, tg[0] - 0.3, tg[1], tg[0] + 0.6, tg[1] - 0.1], '#E9C46A', 0.3);
    // at night the gate floodlit, its name and the tughra in gold lit
    IS.litSign(g, j0, { col: '#FFE2A0' }); IS.flood(g, i0, 0.76); g.glow('lamp', BZ.x1 + 4.2, yc, 3.0, { r: 1.2 });
  }, { name: 'gate' });

  /* ---- outside: the Column of Constantine, a carpet shop, a lamp shop, houses ---- */
  T.obj([27.5, -26.5, 32.5, -21.5], function (g) {
    const i0 = g.cmds.length;
    K.box(g, 27.5, -26.5, 32.5, -21.5, 0, 3.4, { t: '#CFC5B0', l: '#DAD0BA', r: '#BFB49C' }, { w: 0.7 });
    K.cyl(g, 30, -24, 1.9, 3.4, 27, { t: '#8E5E52', l: '#9E6A5C', r: '#7E5046' }, { n: 12, w: 0.8 });
    for (let z = 6; z < 26; z += 2.8) K.cyl(g, 30, -24, 1.98, z, z + 0.4, { t: '#5A5450', l: '#6A6460', r: '#4A4440' }, { n: 12, w: 0.4, nt: true });
    K.cyl(g, 30, -24, 2.2, 27, 28, { t: '#CFC5B0', l: '#DAD0BA', r: '#BFB49C' }, { n: 12, w: 0.6 });
    // at night floodlit from its base (the porphyry glows a warm red), a light at each corner of the plinth
    IS.flood(g, i0, 0.84, '#FFC98A'); for (const i of [0, 1]) IS.glowDry(g, 'lantern', i ? 33 : 30.6, i ? -24.3 : -21, 3.8, { r: 2.0, col: '#FFC98A' });
  }, { name: 'çemberlitaş' });
  T.obj([22, -36, 34, -30], (g) => IS.apt(g, 22, -36, 34, -30, { floors: 3, fh: 4.0, col: '#E3C9B5', shops: [{ word: 'HALI', sign: '#7A2E3A', aw: '#7A2E3A', goods: (g2, P, a0, a1) => { for (let a = a0 + 0.4; a < a1 - 1.6; a += 2.4) { const q = [P(a, 0.3, 0.2), P(a + 2.0, 0.3, 0.2), P(a + 2.0, 0.3, 3.0), P(a, 0.3, 3.0)]; g2.fill(q, ['#A8372E', '#3F4F7A', '#B8742E'][Math.round(a) % 3]); g2.outline(q, { w: 0.3, c: '#E9C46A', boil: false }); } } }] }), { name: 'carpet shop' });
  T.obj([24, 12, 34, 24], (g) => IS.konak(g, 24, 12, 34, 24, { floors: 3, col: IS.WALLS[8], shop: { word: 'LAMBA', sign: '#2E5E8A', goods: (g2, P, a0, a1) => { for (let a = a0 + 0.8; a < a1 - 0.4; a += 1.4) { const p = g2.p.apply(g2, P(a, 0.6, 3.0)); g2.line2([[p[0], p[1] - 3], p], { w: 0.25, c: '#3A3530', boil: false }); const col = ['#E8573A', '#3F7FB8', '#E9C46A', '#5FA58F', '#C978B4'][Math.round(a * 3) % 5]; g2.disc2([p[0], p[1] + 1.2], 1.2, col); g2.mark({ nc: IS.mosaic(col) }); g2.glow2('lantern', [p[0], p[1] + 1.2], [p[0], -1e6], { r: 1.3, col: IS.mosaic(col) }); } } } }), { name: 'lamp shop' });   // the mosaic lamps lit at night
  [[-36, 29, -27, 36, 2], [14, 29, 24, 36, 5]].forEach(([a, b, c, d, k]) => T.obj([a, b, c, d], (g) => IS.konak(g, a, b, c, d, { floors: 2, col: IS.WALLS[k], cumba: false, shop: { word: ['', '', 'ÇAYCI', '', '', 'KEBAP'][k], sign: '#2E6E5A', aw: '#E9E2D2', stripe: '#2E6E5A' } }), { name: 'house' }));
  for (const [x, a, b] of [[-20, '#B8322A', '#F3F1EA'], [-9, '#2E6E5A', '#F3F1EA'], [2, '#2E5E8A', '#E9C46A']]) T.obj([x, 32], (g) => { const j0 = g.cmds.length; K.stall(g, x, 32, { face: 'L', L: 3.4, D: 1.6, a, b, goods: (g2, D, L) => { for (let k = 0; k < 5; k++) { const p = g2.p(D - 0.4, -L + 0.8 + k * 1.4, 2.8); g2.disc2([p[0], p[1] - 0.6], 0.8, ['#E3A72F', '#B8322A', '#9AA84A', '#E8C66E', '#7A2E3A'][k]); } } }); IS.lift(g, j0, 0.5); g.glow('lamp', x, 32 + 2.6, 5.1, { r: 1.0 }); }, { name: 'stall' });   // at night a bulb under the awning's front
  for (const [x, s] of [[-17, 1], [-6, 2], [5, 3]]) T.cast([x, 34.6], (g) => IS.person(g, x, 34.6, 0, IS.who(1950 + s, { dir: 3, pose: 'hold' })), { name: 'shopper' });
  for (const [x, y] of [[26, -6], [26, 4]]) T.obj([x, y], (g) => IS.plane(g, x, y, { r: 3.6, h: 4.8 }), { name: 'plane' });

  /* ---- the living layer: in the open street ---- */
  const lanes = [[ST.y0 + 1.0, 1], [ST.y0 + 2.6, -1], [ST.y1 - 2.8, 1], [ST.y1 - 1.2, -1]];
  for (let i = 0; i < 12; i++) {
    const [y, d] = lanes[i % 4], porter = i % 5 === 2, w = IS.who(1900 + i, porter ? { load: i % 2 ? 'carpet' : 'boxes', top: '#8A7A64', bot: '#5A4A3C', cap: '#3B3F47', scarf: undefined, dress: undefined } : i === 7 ? { teatray: true, top: '#F3F1EA', k: 0.85 } : {});
    IS.walker(T, w, d > 0 ? [[BZ.x0 + 1, y], [BZ.x1 + 3, y]] : [[BZ.x1 + 3, y], [BZ.x0 + 1, y]], porter ? 0.75 : 1.1 + (i % 3) * 0.12, { phase: (i * 0.173) % 1 });
  }
  // sellers on stools in their doorways (far side), shoppers looking at a carpet held up
  for (const [x, s] of [[-30, 1], [-16, 2], [-2, 3], [12, 4]]) T.cast([x, ST.y0 - 0.4], (g) => { IS.stool2(g, g.p(x, ST.y0 - 0.4, 1.3), '#7A5A3C'); IS.person(g, x, ST.y0 - 0.4, 1.3, IS.who(1920 + s, { dir: 1, pose: 'sit', cup: s % 2 === 1, scarf: undefined, dress: undefined })); }, { name: 'seller' });
  T.cast([-22, 6], (g) => { const r = IS.person(g, -22.4, 5.4, 0, IS.who(1931, { dir: 1, pose: 'hold', scarf: undefined, dress: undefined, top: '#F3F1EA' })); const h = r.hands[0]; const q = [[h[0] - 4.2, h[1] - 1], [h[0] + 2.2, h[1] - 1], [h[0] + 2.4, h[1] + 9], [h[0] - 4.0, h[1] + 9]]; g.fill2(q, '#A8372E', true); g.outline2([[h[0] - 3.6, h[1]], [h[0] + 1.6, h[1]], [h[0] + 1.8, h[1] + 8], [h[0] - 3.4, h[1] + 8]], { w: 0.35, c: '#E9C46A', boil: false }); IS.person(g, -20.6, 8.4, 0, IS.who(1932, { dir: 2 })); IS.person(g, -19.2, 7.6, 0, IS.who(1933, { dir: 2, scarf: '#5FA58F' })); }, { name: 'carpet sale' });
  IS.cat(T, 4, ST.y1 - 0.4, 0, { c: 4, pose: 'loaf' });
  // outside: walkers, a porter on the street, pigeons by the column, a simit cart
  IS.walker(T, IS.who(1941, { load: 'boxes', top: '#8A7A64', cap: '#3B3F47', scarf: undefined, dress: undefined }), [[24, -28], [24, 36], [36, 36], [36, -28]], 0.8, { phase: 0.3 });
  IS.walker(T, IS.who(1942), [[-36, 27.2], [24, 27.2]], 1.2, { phase: 0.1 }); IS.walker(T, IS.who(1943, { scarf: '#8E79C0' }), [[22, 28], [-36, 28]], 1.1, { phase: 0.6 });
  T.obj([33, -14], (g) => IS.simitCart(g, 33, -14, { face: 'R' }), { name: 'simit cart' });
  IS.cat(T, 27, -20, 0, { c: 2, pose: 'sit', fl: -1 });
});
/* the goods of a bazaar shop drawn on its front (P(a, d, z) on the face; a0..a1 the shop's width) */
IS.bazaarGoods = function (g, kind, P, a0, a1, i) {
  const R = RNG(i * 31 + 7), m = (a0 + a1) / 2;
  if (kind === 'carpet') { for (let k = 0; k < 3; k++) { const a = a0 + 0.4 + k * 1.3, q = [P(a, 0.15, 0.3), P(a + 1.2, 0.15, 0.3), P(a + 1.2, 0.15, 4.0), P(a, 0.15, 4.0)]; g.fill(q, R.pick(['#A8372E', '#7A2E3A', '#3F4F7A', '#B8742E', '#2E6E5A'])); g.outline(q, { w: 0.25, c: '#E9C46A', boil: false }); } const pile = [P(a0 + 0.3, 1.2, 0), P(a1 - 0.3, 1.2, 0), P(a1 - 0.3, 1.2, 1.2), P(a0 + 0.3, 1.2, 1.2)]; g.fill(pile, '#8E3A2E'); g.line([P(a0 + 0.3, 1.21, 0.4), P(a1 - 0.3, 1.21, 0.4)], { w: 0.3, c: '#E9C46A', boil: false }); g.line([P(a0 + 0.3, 1.21, 0.8), P(a1 - 0.3, 1.21, 0.8)], { w: 0.3, c: '#3F4F7A', boil: false }); }
  else if (kind === 'lamp') { for (let k = 0; k < 7; k++) { const p = g.p.apply(g, P(a0 + 0.5 + (k % 4) * 1.0 + (k > 3 ? 0.5 : 0), 0.8, 4.4 - (k > 3 ? 1.3 : 0))); g.line2([[p[0], p[1] - 2.4], p], { w: 0.2, c: '#3A3530', boil: false }); const col = R.pick(['#E8573A', '#3F7FB8', '#E9C46A', '#5FA58F', '#C978B4', '#F2A44A']); g.disc2([p[0], p[1] + 1.0], 1.1, col); g.mark({ nc: IS.mosaic(col) }); if (k % 2 === 0) g.glow2('lantern', [p[0], p[1] + 1.0], [p[0], -1e6], { r: 0.9, col: IS.mosaic(col) }); g.fill2([[p[0] - 0.6, p[1] + 1.9], [p[0] + 0.6, p[1] + 1.9], [p[0], p[1] + 2.6]], '#B48A3A', true); } }   // the mosaic lamps lit at night
  else if (kind === 'jewel') { const q = [P(a0 + 0.5, 0.2, 0.6), P(a1 - 0.5, 0.2, 0.6), P(a1 - 0.5, 0.2, 3.6), P(a0 + 0.5, 0.2, 3.6)]; g.fill(q, '#F2DFA0'); g.mark({ nc: '#FFF0C0', win: 1 }); { const c = g.p.apply(g, P(m, 0.4, 2.1)); g.glow2('lantern', c, [c[0], -1e6], { r: 1.0, col: '#FFE9B8' }); } /* a jeweller's window, bright at night */ const d = []; for (let k = 0; k < 14; k++) d.push(g.p.apply(g, P(a0 + 0.8 + R() * (a1 - a0 - 1.6), 0.25, 1.0 + R() * 2.4))); for (const p of d) g.disc2(p, 0.35, R.pick(['#D9AE4A', '#C9CED2', '#D9AE4A'])); g.outline(q, { w: 0.3, c: '#8C6A26', boil: false }); }
  else if (kind === 'ceramic') { for (let k = 0; k < 6; k++) { const p = g.p.apply(g, P(a0 + 0.6 + (k % 3) * 1.4, 0.6, 0.6 + Math.floor(k / 3) * 1.6)); g.disc2([p[0], p[1] - 1.0], 1.0, '#F3F0E8'); g.ring2([p[0], p[1] - 1.0], 0.6, { w: 0.3, c: '#2E5E8A' }); g.disc2([p[0], p[1] - 1.0], 0.25, '#B8322A'); } }
  else if (kind === 'copper') { for (let k = 0; k < 5; k++) { const p = g.p.apply(g, P(a0 + 0.6 + k * 0.75, 0.8, 0.4)); g.fill2([[p[0] - 1, p[1]], [p[0] + 1, p[1]], [p[0] + 1.2, p[1] - 2], [p[0] + 0.4, p[1] - 3], [p[0] - 0.4, p[1] - 3], [p[0] - 1.2, p[1] - 2]], R.pick(['#C9763A', '#B8622E', '#D98A4A']), true); } }
  else if (kind === 'spice' || kind === 'delight') { const p = g.p.apply(g, P(m, 1.0, 0)); for (let k = 0; k < 3; k++) IS.cone2(g, [p[0] - 3 + k * 3, p[1]], 1.4, kind === 'spice' ? 2.4 : 1.4, kind === 'spice' ? ['#B8322A', '#E3A72F', '#7A2E3A'][k] : ['#F2B6C2', '#F6F1E2', '#C9E3A8'][k]); }
};
