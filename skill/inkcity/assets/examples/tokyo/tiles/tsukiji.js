'use strict';
/* (100,100) Tsukiji outer market. The wholesale market moved to Toyosu in 2018; the outer market stayed: hundreds of
   little shops and stalls in narrow wet lanes. At the back, a row of two-storey shops under big signs (tea, fish, a
   sushi restaurant, a gyūdon counter, sake, kitchen knives). In front of them two rows of open stalls under canopies,
   their keepers calling out behind counters of crushed ice and fish, dried goods, tea, sweets, oden, a ramen counter,
   grills of skewers. Turret trucks (tāre: a drum engine, a flat bed, the driver standing at the wheel) loop round the
   back lanes with styrofoam boxes. In the open front: the standing sushi counter and its queue, the tamagoyaki window
   and its queue, a skewer grill, a sweets stand, a loading bay, and two men cutting a whole tuna for a crowd with
   phones. Gulls wheel overhead. */
SF.tile('tsukiji', 100, 100, { rim: 54 }, function (T) {
  const H = 37, INK = '#3A3128', SHOP = '#E9C48A', WIN = '#E9D3A6', ICE = '#F1F6F6';
  const SEA = TK.summer() ? 'su' : TK.autumn() ? 'au' : TK.winter() ? 'wi' : 'sp';
  const B2 = -21, B3 = -7, R1F = -29, SD = 5.0;          // row 2 and row 3 stalls start at y = B (their back), SD deep
  const KP = 2.45, CT = [3.0, 5.0], CZ = 3.2;             // keeper's line, counter, counter height (from B)

  /* ---------------- helpers (tile-local) ---------------- */
  const segs = (g, pairs, col, w) => { const s = []; for (const [a, b] of pairs) { const p = g.p.apply(g, a), q = g.p.apply(g, b); s.push(p[0], p[1], q[0], q[1]); } g.segs2(s, col, w); };
  const blob = (g, c, r, col, ink, seed, sq) => { const R = RNG(seed), pts = []; for (let i = 0; i < 8; i++) { const a = TAU * i / 8 + R() * 0.5, q = r * (0.85 + R() * 0.3); pts.push([c[0] + Math.cos(a) * q, c[1] + Math.sin(a) * q * (sq || 0.85)]); } g.fill2(pts, col); if (ink) g.outline2(pts, { c: ink, w: 0.35, ext: 0.1 }); return pts; };
  const quad2 = (g, c, w, h, col, dy) => { const q = [[c[0] - w, c[1] + (dy || 0)], [c[0] + w, c[1] + (dy || 0)], [c[0] + w, c[1] - h], [c[0] - w, c[1] - h]]; g.fill2(q, col, true); return q; };
  // things lying on a counter top (wide px at c): fish, cuts, shellfish, trays
  const FOOD = {
    fish(g, c, R) { const L = 2.0 + R() * 0.8, s = R() < 0.5 ? 1 : -1, P = (u, v) => [c[0] + s * u, c[1] + v]; const b = [P(-L, 0), P(-L * 0.4, -0.8), P(L * 0.5, -0.5), P(L, -1.0), P(L, 0.7), P(L * 0.5, 0.3), P(-L * 0.4, 0.7)]; g.fill2(b, R.pick(['#B9C3CC', '#C9D3DA', '#9FB0BE', '#D9A0A0']), true); g.fill2([P(-L, 0), P(-L * 0.4, -0.8), P(L * 0.5, -0.5), P(L * 0.5, -0.1), P(-L * 0.4, -0.1)], '#6E8296', true); g.line2(b, { w: 0.28, c: '#4A5560', close: true, boil: false }); g.disc2(P(-L * 0.7, -0.15), 0.25, '#2A2622'); },
    tuna(g, c) { const q = quad2(g, c, 1.5, 1.0, '#B5323A', 0.4); g.segs2([c[0] - 1.2, c[1] - 0.6, c[0] + 1.2, c[1] - 0.2, c[0] - 1.2, c[1] + 0.0, c[0] + 1.2, c[1] + 0.3], '#E9A0A0', 0.25); g.outline2(q, { w: 0.28, c: '#6A1A20', boil: false }); },
    salmon(g, c) { const q = quad2(g, c, 1.4, 0.9, '#E8875A', 0.4); g.segs2([c[0] - 1.0, c[1] - 0.6, c[0] - 0.4, c[1] + 0.3, c[0] - 0.2, c[1] - 0.6, c[0] + 0.4, c[1] + 0.3, c[0] + 0.6, c[1] - 0.6, c[0] + 1.2, c[1] + 0.3], '#F6D2B8', 0.28); },
    squid(g, c) { g.fill2([[c[0] - 1.8, c[1]], [c[0] + 0.6, c[1] - 0.8], [c[0] + 0.9, c[1]], [c[0] + 0.6, c[1] + 0.8]], '#F2E4DE', true); g.segs2([c[0] + 0.9, c[1], c[0] + 2.2, c[1] - 0.4, c[0] + 0.9, c[1] + 0.2, c[0] + 2.3, c[1] + 0.3], '#E9C0C0', 0.35); },
    octopus(g, c) { g.disc2([c[0], c[1] - 0.3], 1.0, '#B5445A'); for (let j = 0; j < 4; j++) { const a = Math.PI * (0.05 + j * 0.3); g.line2([[c[0], c[1]], [c[0] + Math.cos(a) * 2.2, c[1] + Math.sin(a) * 1.1], [c[0] + Math.cos(a) * 2.0, c[1] + Math.sin(a) * 1.4 - 0.4]], { w: 0.5, c: '#B5445A', boil: false }); } },
    crab(g, c) { g.disc2(c, 1.0, '#D9503A'); g.segs2([c[0] - 0.9, c[1], c[0] - 2.0, c[1] - 0.6, c[0] + 0.9, c[1], c[0] + 2.0, c[1] - 0.6, c[0] - 0.8, c[1] + 0.4, c[0] - 1.8, c[1] + 0.9, c[0] + 0.8, c[1] + 0.4, c[0] + 1.8, c[1] + 0.9], '#C9402E', 0.4); },
    scallop(g, c) { for (let j = 0; j < 3; j++) { const p = [c[0] - 1.1 + j * 1.1, c[1] + (j % 2) * 0.4]; g.disc2(p, 0.6, '#E9D2B0'); g.disc2(p, 0.32, '#F6EBD8'); } },
    urchin(g, c) { quad2(g, c, 1.3, 0.8, '#C9A26B', 0.4); for (let j = 0; j < 4; j++) g.disc2([c[0] - 0.9 + j * 0.6, c[1] - 0.2], 0.35, '#F0A030'); },
    shrimp(g, c) { for (let j = 0; j < 3; j++) { const p = [c[0] - 1 + j, c[1]]; g.line2([[p[0] - 0.4, p[1] + 0.4], [p[0], p[1] - 0.4], [p[0] + 0.5, p[1] + 0.2]], { w: 0.6, c: '#E88A7A', boil: false }); } },
  };
  const tag = (g, c) => { g.fill2([[c[0] - 0.55, c[1] - 1.6], [c[0] + 0.55, c[1] - 1.6], [c[0] + 0.55, c[1] - 0.8], [c[0] - 0.55, c[1] - 0.8]], '#FBFAF6', true); g.line2([[c[0], c[1] - 0.8], [c[0], c[1]]], { w: 0.2, c: '#8C8576', boil: false }); g.disc2([c[0], c[1] - 1.2], 0.2, '#C9463E'); };
  // a turret truck's load of styrofoam boxes
  const foam = (g, B) => { for (let k = 0; k < 3; k++) { const p = B.pt(-1.6 + k * 1.1, 0, 1.15); K.rbox(g, p[0], p[1], 0.5, 1.2, Math.atan2(B.sa, B.ca), 1.15, 2.2 + (k % 2) * 0.9, '#F6F3EA', { w: 0.4 }); } };
  // a stack of styrofoam boxes (or blue crates) at a world spot
  const boxes = (g, x, y, n, col, hw, hd) => { hw = hw || 1.3; hd = hd || 0.9; for (let k = 0; k < n; k++) { K.box(g, x - hw, y - hd, x + hw, y + hd, k * 1.15, k * 1.15 + 1.1, col === 'foam' ? { t: '#F6F3EA', l: '#F3F1EA', r: '#DCD8CE' } : col, { w: 0.4, boil: false }); if (col === 'foam') g.fill(K.on('L', y + hd + 0.02, x - hw * 0.6, x + hw * 0.6, k * 1.15 + 0.35, k * 1.15 + 0.75), k % 2 ? '#5F8FC9' : '#C9463E'); } };

  /* ---------------- the ground: wet lanes, paved front ---------------- */
  T.ground(function (g) {
    K.slab(g, H, { top: '#E3DFD4' });
    const WET = '#D7D3C7';
    for (const q of [K.rect(-H, R1F, H, B2), K.rect(-H, B2 + SD, H, B3), K.rect(-H, B2, -30.2, B2 + SD), K.rect(29.8, B2, H, B2 + SD), K.rect(-H, B3 + SD, H, 12.6)]) { g.fill(q, WET); g.scuff(q, { dir: Math.atan2(AY, AX), len: 6, c: '#C6C1B3', dens: 0.5, w: 0.5, spread: 0.06 }); }
    // drains down the middle of the lanes, wet patches with a pale sheen
    for (const y of [-25, -11.5, 2.6]) g.line([[-H + 1, y, 0], [H - 1, y, 0]], { w: 0.5, c: '#B9B3A6', boil: false });
    for (const [x, y, r] of [[-12, -24, 2.6], [14, -11, 2.2], [6, 3, 2.4], [-26, -12, 2.0], [22, -26, 2.0], [-6, 16, 2.8], [18, 18, 2.2]]) { const pts = K.curve([[x - r, y, 0], [x, y - r * 0.6, 0], [x + r, y, 0], [x, y + r * 0.6, 0]], 4, true); g.fill(pts, '#CCC8BC'); g.scuff(pts, { dir: -0.6, len: 2, c: '#F4F2EC', dens: 1.2, w: 0.5 }); }
    // the front: paving slabs in a grid
    const P = []; for (let x = -H; x <= H; x += 3) P.push([[x, 12.6, 0], [x, H, 0]]); for (let y = 12.6; y <= H; y += 3) P.push([[-H, y, 0], [H, y, 0]]); segs(g, P, '#D6D1C4', 0.3);
  }, { rim: true });

  /* ---------------- the back row: two-storey shops under big signs ---------------- */
  const SHOP1 = [
    { x0: -36.5, x1: -25, word: '茶', sign: '#3F7A4A', ink: '#FBF8EE', awn: ['#3F7A4A', '#F3EEE0'], goods: 'tea', wall: '#EFE9DA', h: 13.2 },
    { x0: -24.5, x1: -13, word: '魚', sign: '#2F5F9F', ink: '#FBF8EE', awn: ['#F3F1EA', '#2F5F9F'], goods: 'foam', wall: '#E9E6DE', h: 14.2 },
    { x0: -12.5, x1: -1, word: '寿司', sign: '#C9463E', ink: '#FBF8EE', noren: '#2F3F63', goods: 'sushi', wall: '#F1EDE3', h: 13.6 },
    { x0: -0.5, x1: 11, word: '牛丼', sign: '#E8792E', ink: '#2A2622', awn: ['#E8792E', '#F3EEE0'], goods: 'eat', wall: '#EDE8DC', h: 13.0 },
    { x0: 11.5, x1: 23, word: '酒', sign: '#2F3F63', ink: '#F6E7C8', awn: ['#2F3F63', '#F3EEE0'], goods: 'sake', wall: '#E3DED2', h: 14.6 },
    { x0: 23.5, x1: 36.5, word: '築地', sign: '#F3EEE0', ink: '#C9463E', awn: ['#5FA58F', '#F3EEE0'], goods: 'knife', wall: '#EFE9DA', h: 13.6 },
  ];
  SHOP1.forEach((s, i) => T.obj([s.x0, -36.6, s.x1, R1F], function (g) {
    const { x0, x1, h } = s, y1 = R1F, R = RNG(i * 13 + 7);
    K.box(g, x0, -36.6, x1, y1, 0, h, { t: '#E4E0D6', l: s.wall, r: shade(s.wall, 0.1) }, { w: 0.95 });
    K.box(g, x0, -36.6, x1, y1, h, h + 0.7, { t: '#EDEAE2', l: shade(s.wall, -0.05), r: shade(s.wall, 0.06) }, { w: 0.6 });
    // the open ground floor, lit, full of goods
    const q = K.on('L', y1 + 0.03, x0 + 0.5, x1 - 0.5, 0, 6.2); g.fill(q, SHOP);
    if (s.goods === 'foam') { for (let x = x0 + 1.4; x < x1 - 1; x += 2.6) for (let k = 0; k < 3; k++) { const c = g.p(x, y1 + 0.05, 0.3 + k * 1.3); quad2(g, c, 3.4, 3.6, '#F6F3EA'); g.fill2([[c[0] - 1.6, c[1] - 1.4], [c[0] + 1.6, c[1] - 1.4], [c[0] + 1.6, c[1] - 2.2], [c[0] - 1.6, c[1] - 2.2]], R.pick(['#5F8FC9', '#C9463E']), true); } }
    else if (s.goods === 'tea') { for (const z of [1.2, 3.0, 4.8]) for (let x = x0 + 1.0; x < x1 - 0.8; x += 0.8) { const c = g.p(x, y1 + 0.05, z); quad2(g, c, 0.6, 1.5, R.pick(['#3F7A4A', '#2A2622', '#C9A23A', '#5E8A4A', '#B5443A'])); } }
    else if (s.goods === 'sake') { for (const z of [1.0, 3.0, 5.0]) for (let x = x0 + 0.9; x < x1 - 0.8; x += 0.55) { const c = g.p(x, y1 + 0.05, z - 0.8); g.fill2([[c[0] - 0.35, c[1]], [c[0] + 0.35, c[1]], [c[0] + 0.35, c[1] - 1.9], [c[0] + 0.15, c[1] - 2.6], [c[0] - 0.15, c[1] - 2.6], [c[0] - 0.35, c[1] - 1.9]], R.pick(['#3F6B3A', '#6B3A2A', '#2F4A2C', '#C9A26B', '#F3F1EA']), true); g.mark({ nc: true }); } }
    else if (s.goods === 'knife') { const c0 = K.on('L', y1 + 0.05, x0 + 1.2, x1 - 1.2, 1.4, 4.8); g.fill(c0, '#3A3530'); const P = []; for (let x = x0 + 1.6; x < x1 - 1.4; x += 0.7) for (const z of [2.0, 3.6]) P.push([[x, y1 + 0.08, z], [x + 0.45, y1 + 0.08, z + 1.0]]); segs(g, P, '#DCE3E6', 0.6); g.outline(c0, { w: 0.45, c: '#8C8576', boil: false }); }
    else { const P = []; for (const z of [2.2, 4.2]) P.push([[x0 + 0.6, y1 + 0.05, z], [x1 - 0.6, y1 + 0.05, z]]); segs(g, P, '#8A6A50', 0.4); for (let x = x0 + 1.2; x < x1 - 1; x += 1.3) { const c = g.p(x, y1 + 0.05, 4.3); g.disc2([c[0], c[1] - 0.7], 0.7, R.pick(['#F6F3EA', '#E9DCC0'])); } }
    g.outline(q, { w: 0.5, boil: false });
    if (s.noren) { const n = 4; for (let k = 0; k < n; k++) { const a0 = lerp(x0 + 2.0, x1 - 2.0, k / n) + 0.05, a1 = lerp(x0 + 2.0, x1 - 2.0, (k + 1) / n) - 0.05, nq = K.on('L', y1 + 0.16, a0, a1, 3.4, 6.2); g.fill(nq, s.noren); g.outline(nq, { w: 0.3, c: '#1F2A44', boil: false, ext: 0 }); } TK.word(g, 'L', y1 + 0.17, (x0 + x1) / 2, 4.9, 1.6, '寿司', '#F6F3EA'); }
    if (s.awn) TK.awning(g, 'L', y1, x0 + 0.2, x1 - 0.2, 7.0, 2.2, s.awn[0], { stripe: s.awn[1], drop: 0.8 });
    else { const P = []; for (let x = x0 + 1.0; x < x1; x += 2.2) { const c = g.p(x, y1 + 1.4, 6.9); P.push(c); } for (const c of P) { g.line2([[c[0], c[1] - 2.2], [c[0], c[1] - 0.8]], { w: 0.3, c: '#3A3530', boil: false }); TK.lantern2(g, [c[0], c[1] + 0.8], 1.3, '#D0483A'); } }
    // the big facade sign, small windows above, the parapet
    TK.sign(g, 'L', y1, x0 + 0.9, x1 - 0.9, 7.8, 11.4, s.sign, { word: s.word, ink: s.ink, w: 0.6 });
    for (let x = x0 + 1.2; x < x1 - 1.6; x += 2.6) K.win(g, 'L', y1, x, x + 1.8, 11.9, h - 0.4, { style: 'glass' });
    { const P = []; for (let z = 8.0; z < h; z += 0.7) P.push([[x1 + 0.03, -36.4, z], [x1 + 0.03, y1 - 0.2, z]]); segs(g, P, shade(s.wall, 0.16), 0.22); }
    if (i % 2 === 0) { const xb = x1 - 0.2, yb = y1 + 0.8; K.box(g, xb - 0.15, yb - 0.75, xb + 0.15, yb + 0.75, 6.8, 12.8, s.sign === '#F3EEE0' ? '#C9463E' : s.sign, { w: 0.45, boil: false }); g.mark({ nc: true }); TK.word(g, 'R', xb + 0.15, yb, 9.8, 1.0, ['築地', '寿司', '魚'][i / 2], '#FBF8EE', { vert: true }); }
    if (i === 3) { const P = []; for (const x of [x0 + 2, x1 - 2]) P.push([[x, -33, h + 0.7], [x, -33, h + 2.4]]); segs(g, P, '#5A564E', 0.5); TK.sign(g, 'L', -33, x0 + 1.2, x1 - 1.2, h + 2.4, h + 4.8, '#F3EEE0', { word: '東京', ink: '#C9463E', w: 0.55 }); }
    // rooftop: an AC unit or two, a water tank on one, a sign frame on another
    K.box(g, x0 + 1.5, -35, x0 + 3.5, -33.6, h + 0.7, h + 2.0, { t: '#E9E6DE', l: '#F3F1EA', r: '#DCD8CE' }, { w: 0.4, boil: false });
    if (i === 1 || i === 4) { K.cyl(g, (x0 + x1) / 2 + 2, -33.5, 1.6, h + 0.7, h + 3.4, { t: '#E9E6DE', l: '#DCE3E6', r: '#B9C3C9' }, { w: 0.55, n: 12 }); }
    if (TK.winter()) TK.shime2(g, g.p((x0 + x1) / 2, y1 + 0.1, 6.6), 0.9);
  }, { name: 'shop' }));

  // nobori banners out in front of the back row's shops
  for (const [x, col, word] of [[-26.2, '#C9463E', '魚'], [-14.2, '#2F6FB0', '築地'], [10.6, '#E6C24F', '牛丼'], [23.0, '#3F7A4A', '茶']]) T.obj([x - 0.3, R1F + 2.3, x + 0.3, R1F + 2.9], (g) => { const y = R1F + 2.6, b = g.p(x, y, 0), t = g.p(x, y, 9.2); g.line2([b, t], { w: 0.45, c: '#6B4E36', boil: false }); const q = [[x + 0.1, y, 8.8], [x + 1.6, y, 8.8], [x + 1.6, y, 3.0], [x + 0.1, y, 3.0]]; g.fill(q, col); g.mark({ nc: (c) => mix(nightColour(c), c, 0.4) }); g.outline(q, { w: 0.35, c: shade(col, 0.5), boil: false }); TK.word(g, 'L', y, x + 0.85, 5.9, 1.1, word, col === '#E6C24F' ? '#2A2622' : '#FBF8EE', { vert: true }); }, { name: 'nobori' });

  /* ---------------- the stalls ---------------- */
  // stall kinds: what is on the counter and on the shelf behind, the canopy and its sign
  const STALL = {
    fish: { top: 'ice', items: ['tuna', 'fish', 'salmon', 'squid', 'fish', 'octopus', 'shrimp', 'fish'], shelf: 'foam' },
    shell: { top: 'ice', items: ['crab', 'scallop', 'urchin', 'crab', 'scallop', 'urchin', 'shrimp'], shelf: 'foam' },
    dried: { top: 'bins', bins: ['#C9A26B', '#8A6A50', '#3F5A3A', '#2A2622', '#D9C9A8', '#B9C3CC'], shelf: 'bags' },
    tea: { top: 'cans', cans: ['#3F7A4A', '#2A2622', '#C9A23A', '#5E8A4A'], shelf: 'tea' },
    sweets: { top: 'trays', dots: ['#F6F3EA', '#F2C6D0', '#9FCF8A', '#C9A26B', '#E05A6A'], shelf: 'boxes' },
    grill: { top: 'grill', shelf: 'boxes' },
    oden: { top: 'oden', shelf: 'bags' },
    ramen: { top: 'bowls', shelf: 'pots' },
    sake: { top: 'bottles', shelf: 'bottles' },
    knife: { top: 'case', shelf: 'boxes' },
    coffee: { top: 'cups', shelf: 'boxes' },
    rice: { top: 'bins', bins: ['#F6F3EA', '#E9DCC0', '#D9C9A8', '#F3EEE0', '#C9A26B'], shelf: 'bags' },
    pickle: { top: 'tubs', tubs: ['#E8C445', '#9A4A6A', '#7FAE5E', '#C9584B', '#E9D9B0'], shelf: 'bags' },
  };
  const ROW2 = [['fish', '魚', '#2F6FB0', '#F3F1EA'], ['dried', '山', '#E9DCC0', '#C9463E'], ['tea', '茶', '#3F7A4A', null], ['fish', '魚', '#F3F1EA', '#2F6FB0'], ['knife', '築地', '#2F3F63', null], ['shell', '魚', '#3FA0A0', '#F3F1EA'], ['sweets', '和菓子', '#E58BB0', '#F3F1EA'], ['grill', '焼鳥', '#C9463E', null]];
  const ROW3 = [['ramen', 'ラーメン', '#C9463E', null], ['fish', '魚', '#2F6FB0', '#F3F1EA'], ['oden', 'おでん', '#E6C24F', null], ['fish', '魚', '#F3F1EA', '#C9463E'], ['rice', '米', '#7FAE5E', '#F3F1EA'], ['shell', '魚', '#3FA0A0', null], ['coffee', 'コーヒー', '#6B4A3A', null], ['fish', '魚', '#2F6FB0', '#F3F1EA'], ['grill', '肉', '#E8792E', null], ['sake', '酒', '#2F3F63', null]];
  const rowX = (row, x0, x1) => row.map((s, i) => { const w = (x1 - x0) / row.length; return { x0: x0 + i * w + 0.15, x1: x0 + (i + 1) * w - 0.15, kind: s[0], word: s[1], can: s[2], str: s[3], i }; });
  const R2 = rowX(ROW2, -30, 29.6), R3 = rowX(ROW3, -36.6, 36.6);
  // the shelf at the back of a stall, with its stock
  const stallBack = (g, s, B, R) => {
    const { x0, x1 } = s, k = STALL[s.kind];
    K.box(g, x0 + 0.2, B, x1 - 0.2, B + 1.5, 0, 5.0, { t: '#C9A26B', l: '#B58F58', r: '#9A7656' }, { w: 0.7 });
    const P = []; for (const z of [1.6, 3.3]) P.push([[x0 + 0.2, B + 1.52, z], [x1 - 0.2, B + 1.52, z]]); segs(g, P, '#7A5A3C', 0.35);
    for (const z of [0.2, 1.8, 3.5]) for (let x = x0 + 0.8; x < x1 - 0.6; x += 1.1) {
      const c = g.p(x, B + 1.55, z);
      if (k.shelf === 'foam') { quad2(g, c, 0.95, 1.3, '#F6F3EA'); g.fill2([[c[0] - 0.6, c[1] - 0.5], [c[0] + 0.6, c[1] - 0.5], [c[0] + 0.6, c[1] - 0.8], [c[0] - 0.6, c[1] - 0.8]], R.pick(['#5F8FC9', '#C9463E']), true); }
      else if (k.shelf === 'bottles') { g.fill2([[c[0] - 0.3, c[1]], [c[0] + 0.3, c[1]], [c[0] + 0.3, c[1] - 1.1], [c[0] + 0.12, c[1] - 1.5], [c[0] - 0.12, c[1] - 1.5], [c[0] - 0.3, c[1] - 1.1]], R.pick(['#3F6B3A', '#6B3A2A', '#2F4A2C', '#F3F1EA']), true); }
      else if (k.shelf === 'tea') quad2(g, c, 0.4, 1.2, R.pick(['#3F7A4A', '#5E8A4A', '#C9A23A', '#2A2622']));
      else if (k.shelf === 'pots') { g.fill2([[c[0] - 0.8, c[1]], [c[0] + 0.8, c[1]], [c[0] + 0.8, c[1] - 1.0], [c[0] - 0.8, c[1] - 1.0]], '#9FA39E', true); }
      else quad2(g, c, 0.8, 1.2, R.pick(['#E9DCC0', '#C9A26B', '#F3F1EA', '#E6C24F', '#C9584B', '#8FBF73']));
    }
  };
  // the counter in front of the keeper, its goods, the canopy on posts and the sign along its edge
  const stallFront = (g, s, B, R) => {
    const { x0, x1 } = s, k = STALL[s.kind], y0 = B + CT[0], y1 = B + CT[1], zc = CZ;
    const posts = []; for (const x of [x0 + 0.2, x1 - 0.2]) posts.push([[x, B + 0.2, 5.0], [x, B + 0.2, 10.4]], [[x, y1 - 0.15, 0], [x, y1 - 0.15, 10.0]]); segs(g, posts, '#5A564E', 0.5);
    K.box(g, x0 + 0.3, y0, x1 - 0.3, y1, 0, zc, k.top === 'ice' ? { t: '#C9C6BD', l: '#9FA39E', r: '#8A8E89' } : { t: '#D9B57E', l: '#C9A26B', r: '#B58F58' }, { w: 0.7 });
    const top = (u, v) => g.p(lerp(x0 + 0.6, x1 - 0.6, u), lerp(y0 + 0.3, y1 - 0.3, v), zc + 0.05);
    if (k.top === 'ice') {
      g.fill([[x0 + 0.5, y0 + 0.2, zc + 0.05], [x1 - 0.5, y0 + 0.2, zc + 0.05], [x1 - 0.5, y1 - 0.2, zc + 0.4], [x0 + 0.5, y1 - 0.2, zc + 0.4]], ICE); g.mark({ nc: '#E8EEF0' });
      g.scuff([[x0 + 0.5, y0 + 0.2, zc + 0.05], [x1 - 0.5, y0 + 0.2, zc + 0.05], [x1 - 0.5, y1 - 0.2, zc + 0.4], [x0 + 0.5, y1 - 0.2, zc + 0.4]], { dir: 0.3, len: 0.8, c: '#C9D6DC', dens: 2.2, w: 0.4, spread: 2 });
      const n = Math.round((x1 - x0) / 1.4); for (let j = 0; j < n; j++) { const c = top((j + 0.5) / n, j % 2 ? 0.35 : 0.7); FOOD[k.items[(j + s.i) % k.items.length]](g, [c[0], c[1] - 0.6], R); }
      for (let j = 0; j < 3; j++) tag(g, top((j + 0.3) / 3, 0.95));
    } else if (k.top === 'bins') { for (let j = 0; j < 4; j++) { const c = top((j + 0.5) / 4, 0.5); g.fill2(arcPts(c[0], c[1], 1.8, 0, Math.PI, 8).map((p) => [p[0], c[1] + (p[1] - c[1]) * 0.5]).concat([[c[0] - 1.8, c[1] - 0.8], [c[0] + 1.8, c[1] - 0.8]].reverse()), '#B58F58', true); blob(g, [c[0], c[1] - 0.9], 1.5, k.bins[(j + s.i) % k.bins.length], null, R.int(1, 999), 0.5); } for (let j = 0; j < 2; j++) tag(g, top(0.3 + j * 0.4, 0.95)); }
    else if (k.top === 'cans') { for (let j = 0; j < 6; j++) { const c = top((j + 0.5) / 6, 0.5); const col = k.cans[j % 4]; quad2(g, c, 0.7, 1.9, col); g.fill2([[c[0] - 0.7, c[1] - 1.9], [c[0] + 0.7, c[1] - 1.9], [c[0] + 0.6, c[1] - 2.3], [c[0] - 0.6, c[1] - 2.3]], '#C9A23A', true); } }
    else if (k.top === 'trays') { for (let j = 0; j < 3; j++) { const c = top((j + 0.5) / 3, 0.5); g.fill2([[c[0] - 2.0, c[1]], [c[0] + 2.0, c[1]], [c[0] + 2.4, c[1] - 1.2], [c[0] - 1.6, c[1] - 1.2]], '#2A2622', true); for (let q = 0; q < 4; q++) g.disc2([c[0] - 1.3 + q * 0.9, c[1] - 0.6], 0.55, k.dots[(q + j) % k.dots.length]); } }
    else if (k.top === 'grill') { const a = top(0.05, 0.3), b = top(0.95, 0.3); g.fill2([[a[0], a[1]], [b[0], b[1]], [b[0], b[1] - 1.4], [a[0], a[1] - 1.4]], '#3A3530', true); g.fill2([[a[0] + 0.6, a[1] - 0.6], [b[0] - 0.6, b[1] - 0.6], [b[0] - 0.6, b[1] - 1.3], [a[0] + 0.6, a[1] - 1.3]], '#E0603A', true); g.mark({ nc: '#FF9A50', light: true }); const S = []; for (let j = 0; j < 7; j++) { const u = (j + 0.5) / 7, c = [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - 1.6]; S.push(c[0] - 0.4, c[1] + 1.4, c[0] + 0.3, c[1] - 1.6); g.disc2(c, 0.5, j % 2 ? '#B5623A' : '#D9A05A'); g.disc2([c[0] + 0.15, c[1] - 0.9], 0.45, j % 2 ? '#8A4A2A' : '#C98A4A'); } g.segs2(S, '#D9C9A8', 0.25); }
    else if (k.top === 'oden') { const c = top(0.5, 0.5); g.fill2([[c[0] - 4.2, c[1]], [c[0] + 4.2, c[1]], [c[0] + 4.6, c[1] - 1.6], [c[0] - 3.8, c[1] - 1.6]], '#C9A26B', true); g.fill2([[c[0] - 3.8, c[1] - 0.3], [c[0] + 3.8, c[1] - 0.3], [c[0] + 4.1, c[1] - 1.4], [c[0] - 3.5, c[1] - 1.4]], '#B9853A', true); for (let j = 0; j < 7; j++) g.disc2([c[0] - 3.0 + j, c[1] - 0.9 + (j % 2) * 0.3], 0.42, ['#F6F3EA', '#E9D2A0', '#C98A4A', '#F3E3A0'][j % 4]); }
    else if (k.top === 'bowls') { for (let j = 0; j < 3; j++) { const c = top((j + 0.5) / 3, 0.6); g.fill2(arcPts(c[0], c[1] - 0.6, 1.2, 0, Math.PI, 8), '#C9463E', true); g.fill2([[c[0] - 1.2, c[1] - 0.6], [c[0] + 1.2, c[1] - 0.6], [c[0] + 1.0, c[1] - 0.9], [c[0] - 1.0, c[1] - 0.9]], '#E9C47A', true); } }
    else if (k.top === 'bottles') { for (let j = 0; j < 7; j++) { const c = top((j + 0.5) / 7, 0.5); g.fill2([[c[0] - 0.35, c[1]], [c[0] + 0.35, c[1]], [c[0] + 0.35, c[1] - 1.9], [c[0] + 0.15, c[1] - 2.6], [c[0] - 0.15, c[1] - 2.6], [c[0] - 0.35, c[1] - 1.9]], ['#3F6B3A', '#6B3A2A', '#2F4A2C', '#F3F1EA'][j % 4], true); } }
    else if (k.top === 'case') { const c0 = [[x0 + 0.6, y1 - 0.4, zc], [x1 - 0.6, y1 - 0.4, zc], [x1 - 0.6, y1 - 0.4, zc + 1.4], [x0 + 0.6, y1 - 0.4, zc + 1.4]]; g.fill(c0, '#3A3530'); const P = []; for (let x = x0 + 1.0; x < x1 - 0.8; x += 0.6) P.push([[x, y1 - 0.35, zc + 0.3], [x + 0.35, y1 - 0.35, zc + 1.2]]); segs(g, P, '#E3EAEE', 0.55); g.outline(c0, { w: 0.4, c: '#8C8576', boil: false }); }
    else if (k.top === 'cups') { const c = top(0.3, 0.5); quad2(g, c, 1.2, 2.6, '#3A3530'); g.disc2([c[0], c[1] - 2.8], 0.8, '#9FA39E'); for (let j = 0; j < 4; j++) { const d = top(0.55 + j * 0.12, 0.6); quad2(g, d, 0.4, 0.7, '#F6F3EA'); } }
    else if (k.top === 'tubs') { for (let j = 0; j < 4; j++) { const c = top((j + 0.5) / 4, 0.5); g.fill2([[c[0] - 1.4, c[1]], [c[0] + 1.4, c[1]], [c[0] + 1.6, c[1] - 1.4], [c[0] - 1.6, c[1] - 1.4]], '#5F8FC9', true); blob(g, [c[0], c[1] - 1.5], 1.3, k.tubs[(j + s.i) % k.tubs.length], null, R.int(1, 999), 0.45); } }
    // the canopy, sloping out over the counter, its valance with the sign
    const cz0 = 10.4 + (s.i % 3) * 0.2, cz1 = 10.0 + (s.i % 3) * 0.2, cy0 = B + 2.6, cy1 = y1 - 0.1;
    const can = [[x0 - 0.05, cy0, cz0], [x1 + 0.05, cy0, cz0], [x1 + 0.05, cy1, cz1], [x0 - 0.05, cy1, cz1]];
    g.fill(can, s.can);
    if (s.str) { const n = Math.max(3, Math.round((x1 - x0) / 1.2)); for (let j = 0; j < n; j += 2) { const a0 = lerp(x0, x1, j / n), a1 = lerp(x0, x1, (j + 1) / n); g.fill([[a0, cy0, cz0], [a1, cy0, cz0], [a1, cy1, cz1], [a0, cy1, cz1]], s.str); } }
    g.outline(can, { w: 0.55, c: shade(s.can, 0.5), boil: false });
    const light = s.can === '#F3F1EA' || s.can === '#E9DCC0' || s.can === '#E6C24F' || s.can === '#E58BB0';
    TK.sign(g, 'L', cy1, x0 + 0.3, x1 - 0.3, cz1 - 1.6, cz1, light ? '#FBFAF6' : s.can, { word: s.word, ink: light ? '#C9463E' : '#FBF8EE', w: 0.5 });
    if (s.i % 3 === 1 && (s.kind === 'dried' || s.kind === 'fish' || s.kind === 'pickle')) { const P = []; for (let x = x0 + 0.8; x < x1 - 0.5; x += 1.1) { const a = g.p(x, cy1 + 0.05, cz1 - 1.6), b = [a[0], a[1] + 4.2]; P.push(a[0], a[1], b[0], b[1]); for (let q = 0; q < 2; q++) g.fill2([[b[0] - 0.7, b[1] - 3.2 + q * 1.7], [b[0] + 0.7, b[1] - 3.2 + q * 1.7], [b[0] + 0.4, b[1] - 1.8 + q * 1.7], [b[0] - 0.4, b[1] - 1.8 + q * 1.7]], s.kind === 'dried' ? '#D9B57E' : s.kind === 'pickle' ? '#E8C445' : '#E9D2B0', true); } g.segs2(P, '#8C8576', 0.2); }
    // a bare bulb or two under the canopy
    for (const u of [0.3, 0.7]) { const c = g.p(lerp(x0, x1, u), cy1 - 0.6, cz1 - 2.0); g.disc2(c, 0.55, '#FFF1C8'); g.mark({ nc: '#FFE7A0', light: true }); g.glow2('lantern', c, g.p(lerp(x0, x1, u), cy1 - 0.6, 0), { r: 1.2, col: '#FFE2A0' }); }
    if (TK.winter() && s.i % 3 === 0) TK.shime2(g, g.p((x0 + x1) / 2, cy1 + 0.1, cz1 - 1.6), 0.7);
  };
  const VB = [[R2, B2, 1, '魚', '#2F6FB0'], [R2, B2, 4, '築地', '#C9463E'], [R2, B2, 6, '甘味', '#E6C24F'], [R3, B3, 2, 'おでん', '#C9463E'], [R3, B3, 4, '米', '#3F7A4A'], [R3, B3, 7, '寿司', '#2F3F63'], [R3, B3, 9, '酒', '#E6C24F']];
  for (const [row, B, j, word, col] of VB) { const x = row[j].x0 + 0.05, y = B + CT[1] + 0.4; T.obj([x - 0.3, y - 0.3, x + 0.3, y + 0.3], (g) => { const P = [[[x, y, 0], [x, y, 5.0]]]; segs(g, P, '#5A564E', 0.5); K.box(g, x - 0.75, y - 0.12, x + 0.75, y + 0.12, 5.0, 9.4, col, { w: 0.45, boil: false }); g.mark({ nc: true }); const light = col === '#E6C24F'; TK.word(g, 'L', y + 0.12, x, 7.2, 1.1, word, light ? '#2A2622' : '#FBF8EE', { vert: true }); }, { name: 'board' }); }
  for (const [x, y, n] of [[-12.6, B2 + CT[1] + 0.9, 2], [16.4, B2 + CT[1] + 0.9, 1], [-19.4, B3 + CT[1] + 0.9, 2], [24.2, B3 + CT[1] + 0.9, 1], [3.6, B3 + CT[1] + 0.9, 1]]) T.obj([x - 1.0, y - 0.6, x + 1.0, y + 0.6], (g) => boxes(g, x, y, n, 'foam', 1.0, 0.6), { name: 'boxes' });
  for (const [row, B] of [[R2, B2], [R3, B3]]) {
    const x0 = row[0].x0 - 0.15, x1 = row[row.length - 1].x1 + 0.15;
    T.obj([x0, B, x1, B + 1.5], (g) => { for (const s of row) stallBack(g, s, B, RNG(s.i * 17 + B)); }, { name: 'stall shelves' });
    T.obj([x0, B + CT[0], x1, B + CT[1]], (g) => { for (const s of row) stallFront(g, s, B, RNG(s.i * 31 + B)); }, { name: 'stall counters' });
  }

  /* ---------------- the open front: stands, the tuna, the loading bay ---------------- */
  // a little booth with a pent roof: a counter at the front, its word on a board above. Two objects: the back (the
  // booth's body, its lit opening and the noren in it, fp y0 .. y1 - 1.6) and the front (the counter with what lies on it,
  // the pent roof and the board, fp y1 - 1.6 .. y1 + 0.4); the keeper stands between them, close behind the counter (any
  // further back and the eave hides their face from this height)
  const boothBack = (g, x0, x1, y0, y1, o) => {
    K.box(g, x0, y0, x1, y1 - 1.6, 0, 7.6, { t: '#C9A26B', l: o.wall, r: shade(o.wall, 0.12) }, { w: 0.85 });
    const q = K.on('L', y1 - 1.57, x0 + 0.5, x1 - 0.5, 0.2, 6.4); g.fill(q, SHOP); g.outline(q, { w: 0.5, boil: false });
    // the noren hangs in the opening, behind the keeper (at the eave it hid his face from this height)
    if (o.noren) { const n = 3; for (let k = 0; k < n; k++) { const a0 = lerp(x0 + 0.8, x1 - 0.8, k / n) + 0.05, a1 = lerp(x0 + 0.8, x1 - 0.8, (k + 1) / n) - 0.05, nq = K.on('L', y1 - 1.55, a0, a1, 4.3, 6.4); g.fill(nq, o.noren); g.outline(nq, { w: 0.3, c: shade(o.noren, 0.45), boil: false, ext: 0 }); } if (o.nword) TK.word(g, 'L', y1 - 1.54, (x0 + x1) / 2, 5.35, 1.2, o.nword, '#F6F3EA'); }
  };
  const booth = (g, x0, x1, y0, y1, o, goods) => {
    K.box(g, x0 + 0.2, y1 - 1.6, x1 - 0.2, y1, 0, 3.4, { t: '#E9D9B4', l: o.counter || '#D9C29A', r: '#C9B088' }, { w: 0.7 });
    if (goods) goods(g);
    const rf = [[x0 - 0.5, y0 - 0.6, 8.8], [x1 + 0.5, y0 - 0.6, 8.8], [x1 + 0.5, y1 + 0.4, 7.4], [x0 - 0.5, y1 + 0.4, 7.4]]; g.fill(rf, o.roof);
    const P = []; for (let x = x0 - 0.2; x < x1 + 0.5; x += 0.55) P.push([[x, y0 - 0.5, 8.78], [x, y1 + 0.35, 7.42]]); segs(g, P, shade(o.roof, 0.28), 0.28);
    g.fill([[x1 + 0.5, y0 - 0.6, 8.8], [x1 + 0.5, y1 + 0.4, 7.4], [x1 + 0.5, y1 + 0.4, 7.0], [x1 + 0.5, y0 - 0.6, 8.4]], shade(o.roof, 0.2));
    g.outline(rf, { w: 0.7, c: shade(o.roof, 0.55), boil: false });
    TK.sign(g, 'L', y1 + 0.4, x0 + 0.6, x1 - 0.6, 7.4, 9.4, o.sign, { word: o.word, ink: o.ink, w: 0.55 });
    if (TK.winter()) TK.shime2(g, g.p((x0 + x1) / 2, y1 + 0.45, 5.0), 0.85);
  };
  // the standing sushi counter: the chef works behind the counter, neta in a glass case
  const SUSHI = { wall: '#D9B57E', roof: '#4E5560', sign: '#F3EEE0', word: '寿司', ink: '#C9463E', noren: '#2F3F63', nword: '築地' };
  T.obj([-33, 6, -21, 10.4], (g) => boothBack(g, -33, -21, 6, 12, SUSHI), { name: 'sushi booth' });
  T.obj([-33, 10.4, -21, 12.4], (g) => booth(g, -33, -21, 6, 12, SUSHI, (g) => {
    const cs = K.on('L', 12.02, -32.2, -21.8, 3.4, 4.8); g.fill([[-32.2, 11.0, 3.4], [-21.8, 11.0, 3.4], [-21.8, 12.0, 3.4], [-32.2, 12.0, 3.4]], '#E9D9B4'); g.fill(cs, 'rgba(214,232,238,0.85)'); g.outline(cs, { w: 0.4, boil: false });
    for (let k = 0; k < 9; k++) { const p = g.p(-31.6 + k * 1.15, 11.5, 3.6); g.fill2([[p[0] - 1, p[1]], [p[0] + 1, p[1]], [p[0] + 1, p[1] - 0.8], [p[0] - 1, p[1] - 0.8]], ['#E9806A', '#F3E3C0', '#C9463E', '#E08A3C', '#F3F1EA', '#E9806A', '#C9463E', '#F0A030', '#B9C3CC'][k], true); }
  }), { name: 'sushi counter' });
  // the tamagoyaki shop: a window at the front, yellow omelettes stacked in it
  const TAMA = { wall: '#F3EFE3', roof: '#C9463E', sign: '#E6C24F', word: '築地', ink: '#C9463E' };
  T.obj([-16, 6, -7, 10.4], (g) => boothBack(g, -16, -7, 6, 12, TAMA), { name: 'tamagoyaki' });
  T.obj([-16, 10.4, -7, 12.4], (g) => booth(g, -16, -7, 6, 12, TAMA, (g) => {
    for (let k = 0; k < 6; k++) { const p = g.p(-15.0 + k * 1.3, 11.3, 3.4); g.fill2([[p[0] - 1.1, p[1]], [p[0] + 1.1, p[1]], [p[0] + 1.1, p[1] - 1.1], [p[0] - 1.1, p[1] - 1.1]], '#F3D35A', true); g.segs2([p[0] - 1.1, p[1] - 0.4, p[0] + 1.1, p[1] - 0.4, p[0] - 1.1, p[1] - 0.8, p[0] + 1.1, p[1] - 0.8], '#D9A83A', 0.25); }
    K.textP(g, (a, z) => [a, 12.03, z], -11.5, 1.4, 1.0, 'TAMAGOYAKI', '#C9463E', { center: true });
  }), { name: 'tamagoyaki counter' });
  // the skewer grill stand and the sweets stand
  const GRILL = { wall: '#E9E6DE', roof: '#2F6FB0', sign: '#C9463E', word: '焼鳥', ink: '#FBF8EE' }, SWEET = { wall: '#F6EEF0', roof: '#E58BB0', sign: '#F3EEE0', word: '甘味', ink: '#C9463E' };
  T.obj([1, 6, 9, 10.4], (g) => boothBack(g, 1, 9, 6, 12, GRILL), { name: 'grill stand' });
  T.obj([1, 10.4, 9, 12.4], (g) => booth(g, 1, 9, 6, 12, GRILL, (g) => { const a = g.p(1.6, 11.2, 3.4), b = g.p(8.4, 11.2, 3.4); g.fill2([[a[0], a[1]], [b[0], b[1]], [b[0], b[1] - 1.2], [a[0], a[1] - 1.2]], '#3A3530', true); g.fill2([[a[0] + 0.6, a[1] - 0.5], [b[0] - 0.6, b[1] - 0.5], [b[0] - 0.6, b[1] - 1.1], [a[0] + 0.6, a[1] - 1.1]], '#E0603A', true); g.mark({ nc: '#FF9A50', light: true }); for (let j = 0; j < 6; j++) { const u = (j + 0.5) / 6, c = [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - 1.6]; g.line2([[c[0] - 0.4, c[1] + 1.2], [c[0] + 0.3, c[1] - 1.4]], { w: 0.25, c: '#D9C9A8', boil: false }); g.disc2(c, 0.5, j % 2 ? '#E9D2B0' : '#B5323A'); g.disc2([c[0] + 0.15, c[1] - 0.8], 0.45, j % 2 ? '#E9D2B0' : '#B5323A'); } }), { name: 'grill' });
  T.obj([13, 6, 20, 10.4], (g) => boothBack(g, 13, 20, 6, 12, SWEET), { name: 'sweets stand' });
  T.obj([13, 10.4, 20, 12.4], (g) => { booth(g, 13, 20, 6, 12, SWEET, (g) => { for (let k = 0; k < 4; k++) { const p = g.p(13.9 + k * 1.6, 11.3, 3.4); g.fill2([[p[0] - 1.4, p[1]], [p[0] + 1.4, p[1]], [p[0] + 1.6, p[1] - 0.6], [p[0] - 1.2, p[1] - 0.6]], '#2A2622', true); for (let q = 0; q < 3; q++) g.disc2([p[0] - 0.8 + q * 0.8, p[1] - 0.5], 0.5, SEA === 'sp' ? ['#F6F3EA', '#E05A6A', '#F2C6D0'][q] : ['#F6F3EA', '#9FCF8A', '#C9A26B'][q]); } }); if (TK.summer()) TK.kooriFlag2(g, g.p(20.3, 11.8, 9.6), 3.6, 4.6); }, { name: 'sweets counter' });
  // the loading bay: a turret truck parked with its load, stacks of boxes and blue crates
  T.obj([25.4, 6.8, 32.6, 10.4], (g) => { g.at(29, 8.6, 0, (g2) => TK.turret(g2, Math.PI, TK.who(1520, { top: '#F3F1EA', cap: '#3B3F47', bot: '#2F343B' }), foam)); }, { name: 'parked turret', on: true });
  for (const [x, y, n, c] of [[25, 14.5, 3, 'foam'], [27.8, 14.8, 2, 'foam'], [33.6, 13.6, 3, '#5F8FC9'], [-35, 14.6, 3, 'foam'], [-35, 18.2, 2, '#5F8FC9'], [35.2, 22, 2, 'foam']]) T.obj([x - 1.3, y - 0.9, x + 1.3, y + 0.9], (g) => boxes(g, x, y, n, c === 'foam' ? 'foam' : { t: shade(c, -0.15), l: c, r: shade(c, 0.15) }), { name: 'boxes' });
  // the tuna: a long table, a whole fish on it (the two men with the long knife are actors)
  T.obj([-7, 22, 7, 25.6], function (g) {
    K.box(g, -7, 22, 7, 25.6, 0, 3.0, { t: '#C9C6BD', l: '#B9B6AD', r: '#A3A097' }, { w: 0.75 });
    const A = g.p(-5.4, 23.8, 3.15), B = g.p(5.6, 23.8, 3.15);
    const body = K.curve([[A[0], A[1]], [lerp(A[0], B[0], 0.22), A[1] - 3.4], [lerp(A[0], B[0], 0.58), lerp(A[1], B[1], 0.58) - 3.6], [B[0] - 2.6, B[1] - 1.4], [B[0], B[1] - 0.3], [B[0] - 2.4, B[1] + 0.6], [lerp(A[0], B[0], 0.58), lerp(A[1], B[1], 0.58) + 0.9], [lerp(A[0], B[0], 0.22), A[1] + 0.9]], 3, true);
    g.fill2(body, '#B9C3CC'); g.fill2(body.filter((p, i) => i < body.length / 2), '#2F3F63');
    g.fill2([[lerp(A[0], B[0], 0.4), lerp(A[1], B[1], 0.4) - 2.8], [lerp(A[0], B[0], 0.62), lerp(A[1], B[1], 0.62) - 3.0], [lerp(A[0], B[0], 0.6), lerp(A[1], B[1], 0.6) + 0.5], [lerp(A[0], B[0], 0.42), lerp(A[1], B[1], 0.42) + 0.5]], '#C9323A', true);
    g.segs2([lerp(A[0], B[0], 0.45), lerp(A[1], B[1], 0.45) - 2.2, lerp(A[0], B[0], 0.57), lerp(A[1], B[1], 0.57) - 1.6, lerp(A[0], B[0], 0.45), lerp(A[1], B[1], 0.45) - 0.6, lerp(A[0], B[0], 0.57), lerp(A[1], B[1], 0.57) + 0.0], '#F2B0B0', 0.3);
    g.fill2([[B[0], B[1] - 0.3], [B[0] + 2.8, B[1] - 2.6], [B[0] + 2.1, B[1] - 0.2], [B[0] + 2.8, B[1] + 2.0]], '#2F3F63', true);
    const fins = []; for (let k = 0; k < 5; k++) { const u = 0.68 + k * 0.05, p = [lerp(A[0], B[0], u), lerp(A[1], B[1], u)]; fins.push(p[0], p[1] - 2.0, p[0] + 0.4, p[1] - 2.8); } g.segs2(fins, '#E6C24F', 0.6);
    g.line2(body, { w: 0.65, close: true, boil: false }); g.disc2([A[0] + 2.0, A[1] - 1.0], 0.65, '#F6F3EA'); g.disc2([A[0] + 2.0, A[1] - 1.0], 0.32, '#2A2622');
    for (let k = 0; k < 4; k++) { const c = g.p(-6 + k * 1.2, 25.0, 3.1); g.fill2([[c[0] - 0.9, c[1]], [c[0] + 0.9, c[1]], [c[0] + 0.9, c[1] - 0.6], [c[0] - 0.9, c[1] - 0.6]], '#B5323A', true); }   // the first cuts, laid out
    TK.sign(g, 'L', 25.6, -2.5, 2.5, 0.6, 2.4, '#FBFAF6', { word: '築地', ink: '#C9463E' });
  }, { name: 'tuna table' });
  // a standing table where people eat what they have bought
  T.obj([18.6, 23.4, 22.4, 26.6], (g) => { K.cyl(g, 20.5, 25, 0.3, 0, 3.6, '#8C8576', { w: 0.4, n: 6 }); K.cyl(g, 20.5, 25, 1.8, 3.6, 4.0, { t: '#E9D9B4', l: '#C9A26B', r: '#B58F58' }, { w: 0.5, n: 12 }); for (let k = 0; k < 3; k++) { const c = g.p(20.0 + k * 0.6, 24.7 + (k % 2) * 0.6, 4.05); g.disc2(c, 0.45, ['#F6F3EA', '#F3D35A', '#C9463E'][k]); } }, { name: 'standing table' });
  T.obj([-21.6, 25.6, -18.0, 28.8], (g) => { K.cyl(g, -19.8, 27.2, 0.3, 0, 3.6, '#8C8576', { w: 0.4, n: 6 }); K.cyl(g, -19.8, 27.2, 1.8, 3.6, 4.0, { t: '#E9D9B4', l: '#C9A26B', r: '#B58F58' }, { w: 0.5, n: 12 }); for (let k = 0; k < 3; k++) { const c = g.p(-20.3 + k * 0.6, 26.9 + (k % 2) * 0.6, 4.05); g.disc2(c, 0.45, ['#E9806A', '#F6F3EA', '#B5623A'][k]); } }, { name: 'standing table' });
  T.obj([-30.6, 22.8, -25.4, 25.4], (g) => { K.box(g, -30.4, 23.0, -25.6, 25.2, 1.4, 1.8, '#9FA39E', { w: 0.45, boil: false }); for (const [x, y] of [[-30.0, 25.2], [-26.0, 25.2]]) g.ring2(g.p(x, y, 0.7), 2.0, { w: 0.6, c: '#3A3530' }); boxes(g, -28.0, 24.1, 2, 'foam', 1.6, 0.9); const h = g.p(-25.2, 24.1, 1.8); g.line2([h, [h[0] + 2.4, h[1] - 3.6]], { w: 0.5, c: '#5A564E', boil: false }); }, { name: 'handcart' });
  // a rest area: benches under red parasols, where people sit and eat what they bought
  const PARA = [[14.6, 29.6], [22.6, 30.4], [30.2, 28.8]];
  for (const [x, y] of PARA) T.obj([x - 2.4, y - 0.5, x + 2.4, y + 0.5], (g) => { K.box(g, x - 2.4, y - 0.5, x + 2.4, y + 0.5, 1.2, 1.6, '#C9463E', { w: 0.45, boil: false }); const L = []; for (const dx of [-2.1, 2.1]) for (const dy of [-0.35, 0.35]) L.push([[x + dx, y + dy, 0], [x + dx, y + dy, 1.2]]); segs(g, L, '#6B4E36', 0.4); g.fill([[x - 2.4, y + 0.5, 1.6], [x + 2.4, y + 0.5, 1.6], [x + 2.4, y + 0.55, 0.9], [x - 2.4, y + 0.55, 0.9]], '#B9392F'); }, { name: 'bench' });
  for (const [x, y] of PARA) T.obj([x - 0.2, y - 1.6, x + 0.2, y - 1.2], (g) => { const b = g.p(x, y - 1.4, 0), t = g.p(x, y - 1.4, 8.4); g.line2([b, t], { w: 0.5, c: '#6B4E36', boil: false }); const c = g.p(x, y - 1.4, 7.2), um = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + Math.PI * i / 16; um.push([c[0] + Math.cos(a) * 12.5, c[1] + 1.0 + Math.sin(a) * 4.8]); } um.push([c[0] + 12.5, c[1] + 1.6], [c[0] - 12.5, c[1] + 1.6]); g.fill2(um, '#D4553A'); g.mark({ nc: (cc) => mix(nightColour(cc), cc, 0.3) }); const rb = []; for (let i = 1; i < 8; i++) { const a = Math.PI + Math.PI * i / 8; rb.push(c[0], c[1] - 4.0, c[0] + Math.cos(a) * 12.4, c[1] + 1.0 + Math.sin(a) * 4.7); } g.segs2(rb, '#A83A2E', 0.3); g.line2(um.slice(0, 17), { w: 0.6, c: '#7A2A20', boil: false }); g.line2([[c[0] - 12.5, c[1] + 1.6], [c[0] + 12.5, c[1] + 1.6]], { w: 0.5, c: '#7A2A20', boil: false }); }, { name: 'parasol' });
  // bicycles parked along the front, baskets on the handlebars
  const cycle = (g, x, y, ang, col, basket) => {
    const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, z) => g.p(x + u * ca, y + u * sa, z);
    for (const u of [-2.0, 2.0]) { const t = []; for (let i = 0; i < 16; i++) { const a = TAU * i / 16; t.push(pt(u + Math.cos(a) * 1.35, 1.35 + Math.sin(a) * 1.35)); } g.line2(t, { c: '#3A3632', w: 0.75, close: true, boil: false, wob: 0.1 }); g.disc2(pt(u, 1.35), 0.28, '#3A3632'); }
    const A = pt(-2.0, 1.35), B = pt(2.0, 1.35), S = pt(-0.7, 3.4), Hb = pt(1.7, 3.8), bb = pt(0, 1.4);
    g.segs2([A[0], A[1], S[0], S[1], S[0], S[1], bb[0], bb[1], bb[0], bb[1], Hb[0], Hb[1], Hb[0], Hb[1], B[0], B[1], A[0], A[1], bb[0], bb[1]], col, 0.7);
    const s0 = pt(-1.0, 3.55), s1 = pt(-0.35, 3.5); g.line2([s0, s1], { c: '#3A3632', w: 1.0, boil: false, ext: 0 });
    if (basket) { const c = pt(2.4, 3.5); const q = [[c[0] - 1.2, c[1] + 0.8], [c[0] + 1.2, c[1] + 0.8], [c[0] + 1.4, c[1] - 1.0], [c[0] - 1.4, c[1] - 1.0]]; g.fill2(q, basket, true); g.outline2(q, { w: 0.3, c: '#5A564E', boil: false }); }
  };
  // (a row of five on the open paving at the left of the front, clear of the tuna crowd, the queues and the riders'
  // lane; the fp is the ground the wheels cover)
  T.obj([-33.3, 26.1, -26.3, 32.3], (g) => { const R = RNG(77); for (let k = 0; k < 5; k++) cycle(g, -29.8, 26.8 + k * 1.2, 0.15, R.pick(['#F3F1EA', '#3F6FA8', '#C9463E', '#2F343B', '#5FA58F']), R() < 0.7 ? '#9FA39E' : null); }, { name: 'bikes' });
  for (const [x, y] of [[-25.6, 33.2], [7.8, 33.1], [35.6, 24.0], [-35.6, 4.0]]) T.obj([x, y], (g) => K.lamp(g, x, y, { h: 10, n: 1 }), { name: 'lamp' });
  // a ginkgo on the corner of the street (gold in autumn, bare in January)
  T.obj([-33.6, 32.4], (g) => K.tree(g, -33.6, 32.4, TK.leaves({ r: 3.4, h: 6, col: '#7FAE5E', ink: '#4B6B36' }, 'ginkgo')), { on: true });
  // a gate over the right end of the middle lane, the market's name on it
  T.obj([35.6, -15.8, 36.4, -7.4], function (g) {
    const P = []; for (const y of [-15.4, -7.8]) P.push([[36, y, 0], [36, y, 11.6]]); segs(g, P, '#5A564E', 0.9);
    K.box(g, 35.7, -16.2, 36.3, -7.0, 10.0, 12.6, '#C9463E', { w: 0.6 }); g.mark({ nc: true });
    TK.word(g, 'R', 36.3, -11.6, 11.3, 1.9, '築地', '#FBF8EE');
    for (const y of [-14.4, -8.8]) { const c = g.p(36.4, y, 8.6); g.line2([g.p(36.4, y, 10.0), [c[0], c[1] - 1.4]], { w: 0.3, c: '#3A3530', boil: false }); TK.lantern2(g, c, 1.3, '#D0483A'); }
  }, { name: 'gate' });
  for (const [x, y] of [[-34, 12.8], [-19.6, 12.4]]) T.obj([x, y], (g) => TK.kadomatsu(g, x, y), { on: true, season: 'winter' });   // (the right one clear of the sushi queue)

  /* ---------------- the stall keepers ---------------- */
  // One actor per row draws its keepers (they stand between the shelves and the counters, out of everyone's way).
  // Each keeper has a seeded run of beats: calling out, beckoning, cutting, wrapping, handing something over, a laugh.
  const BEAT = 1.5, NB = 16;
  const keeperWho = (seed) => TK.who(seed, { top: RNG(seed)() < 0.5 ? '#F3F1EA' : RNG(seed + 1).pick(['#2F3F63', '#3F5F8F', '#5A6B5A']), bot: '#2F343B', shoe: '#2E2A26', cap: RNG(seed + 2)() < 0.45 ? '#F3F1EA' : RNG(seed + 3)() < 0.4 ? '#3B3F47' : undefined, bare: false, shorts: false, dress: undefined });
  const KACTS = { fish: ['call', 'cut', 'cut', 'hand', 'talk', 'wave', 'cut', 'look'], shell: ['call', 'hand', 'talk', 'wave', 'cut', 'look'], grill: ['turn', 'turn', 'hand', 'call', 'turn', 'fan'], default: ['call', 'talk', 'wrap', 'hand', 'wave', 'look', 'point', 'wrap'] };
  const keeperAct = (seed, kind, b) => { const L = KACTS[kind] || KACTS.default, R = RNG(seed * 97 + b * 13); return b % 5 === 3 ? 'hand' : R.pick(L); };
  const FOODC = { rice: '#F6F3EA', fish: '#B5323A', shell: '#E9D2B0', grill: '#B5623A', dried: '#C9A26B', tea: '#3F7A4A', sweets: '#F2C6D0', oden: '#E9D2A0', ramen: '#C9463E', sake: '#3F6B3A', knife: '#DCE3E6', coffee: '#F6F3EA', pickle: '#E8C445' };
  const keeperDraw = (g, w, a, f, x, y, kind) => {
    if (a === 'call') return TK.person(g, x, y, 0, Object.assign({}, w, { hands: [[0.9, -17.4], [1.8, -17.6 - f % 2 * 0.3]] }));
    if (a === 'cut' || a === 'turn') { const r = TK.person(g, x, y, 0, Object.assign({}, w, { hands: [[2.6, -11.6 + (f % 2) * 1.6], [3.4, -11.0]] })); const h = r.hands[0][1] < r.hands[1][1] ? r.hands[0] : r.hands[1]; if (a === 'cut') g.line2([h, [h[0] + 0.6, h[1] + 2.0]], { w: 0.6, c: '#DCE3E6', boil: false }); else g.line2([h, [h[0] + 1.6, h[1] + 0.6]], { w: 0.3, c: '#8A6A40', boil: false }); return r; }
    if (a === 'fan') { const r = TK.person(g, x, y, 0, Object.assign({}, w, { hands: [[2.4 + (f % 2) * 0.8, -12.2], [-1.9, -9.6]] })); g.disc2(r.hands[0], 1.2, '#F3F1EA'); return r; }
    if (a === 'wrap') return TK.person(g, x, y, 0, Object.assign({}, w, { hands: [[2.4 + (f % 2) * 0.5, -11.0], [3.4 - (f % 2) * 0.4, -10.8]] }));
    if (a === 'hand') { const r = TK.person(g, x, y, 0, Object.assign({}, w, { reach: [4.4, -13.0] })); g.disc2([r.hands[0][0] + 0.5, r.hands[0][1] - 0.4], 0.8, FOODC[kind] || '#F6F3EA'); return r; }
    return TK.doing(g, w, a === 'wave' ? 'wave' : a === 'talk' ? 'talk' : a === 'point' ? 'point' : 'look', f, x, y, 0);
  };
  const keepers = (row, B, seed0) => {
    // one actor per keeper (a whole row in one actor made 64 big drawings), anchored at the right-hand end of its own
    // stall: a small prop behind the row but further right would otherwise count as in front of the anchor (the engine
    // compares x + y for small props) and send the keeper under the shelves
    row.forEach((s, j) => {
      const w = Object.assign({}, keeperWho(seed0 + s.i), { dir: 1 }), kx = lerp(s.x0, s.x1, 0.35 + (j % 3) * 0.12), ax = s.x1 - 0.3;
      T.actor({ sample: 0.25, period: BEAT * NB, r: 12,
        at(t) {
          const u = ((t % (BEAT * NB)) + BEAT * NB) % (BEAT * NB), b = Math.floor(u / BEAT), f = Math.floor(u * 3) % 4, a = keeperAct(seed0 + s.i, s.kind, (b + j * 3) % NB);
          const ff = a === 'hand' ? 0 : a === 'wave' || a === 'talk' ? f : f % 2;
          return { x: ax, y: B + KP, key: a + ff, a, f: ff };
        },
        draw(g, st) { keeperDraw(g, w, st.a, st.f, kx - ax, 0, s.kind); } });
    });
  };
  keepers(R2, B2, 1400); keepers(R3, B3, 1420);

  /* ---------------- customers at the stalls ---------------- */
  // A customer stands at a counter: points, waits, takes what the keeper hands over (the same beat as the keeper's), eats.
  const customer = (row, j, B, who, o) => {
    o = o || {}; const s = row[j], x = lerp(s.x0, s.x1, 0.35 + (j % 3) * 0.12) + (o.dx || 0), y = B + CT[1] + 1.0, seed0 = o.seed0;
    const food = FOODC[s.kind];
    T.actor({ sample: 0.25, period: BEAT * NB,
      at(t) { const u = ((t % (BEAT * NB)) + BEAT * NB) % (BEAT * NB), b = Math.floor(u / BEAT), f = Math.floor(u * 3) % 4, kb = (b + j * 3) % NB;
        const a = keeperAct(seed0 + s.i, s.kind, kb) === 'hand' ? 'take' : keeperAct(seed0 + s.i, s.kind, (kb + NB - 1) % NB) === 'hand' || keeperAct(seed0 + s.i, s.kind, (kb + NB - 2) % NB) === 'hand' ? 'eat' : (b % 4 === 0 ? 'point' : b % 4 === 2 ? 'photo' : 'look');
        return { x, y, key: a + (a === 'eat' ? f % 2 : a === 'look' ? (b % 2) : 0), a, i: a === 'eat' ? f % 2 : a === 'look' ? b % 2 : 0 }; },
      draw(g, st) { const w = Object.assign({}, who, { dir: st.a === 'eat' ? 0 : 3, food }); if (st.a === 'take') { const r = TK.person(g, 0, 0, 0, Object.assign({}, w, { reach: [3.0, -14.4] })); g.disc2([r.hands[0][0], r.hands[0][1] - 0.4], 0.8, food); } else if (st.a === 'photo' && !o.photo) TK.doing(g, w, 'look', 0, 0, 0, 0); else TK.doing(g, w, st.a, st.i, 0, 0, 0); } });
  };
  customer(R2, 0, B2, TK.who(1430, { hairStyle: 'bun' }), { seed0: 1400 });
  customer(R2, 3, B2, TK.who(1431, { top: '#E7A9A0' }), { seed0: 1400, photo: true });
  customer(R2, 7, B2, TK.salary(1432), { seed0: 1400 });
  customer(R3, 1, B3, TK.who(1433, { top: '#7FB7D9', cap: '#E3D3A0' }), { seed0: 1420, photo: true });
  customer(R3, 4, B3, TK.kimono(1434), { seed0: 1420 });
  customer(R3, 5, B3, TK.who(1435, { top: '#F3E3A0' }), { seed0: 1420, photo: true, dx: 1.6 });
  customer(R3, 8, B3, TK.who(1436, { top: '#3F5F8F', glasses: true }), { seed0: 1420 });
  // at the ramen counter, two eat standing, bowls to their mouths
  TK.idle(T, Object.assign(TK.who(1437, { top: '#2F343B', bot: '#3F4D63' }), { dir: 3, cup: '#C9463E' }), -34.2, B3 + CT[1] + 0.9, { acts: ['drink', 'drink', 'look', 'eat'], seed: 1437 });
  TK.idle(T, Object.assign(TK.who(1438, { top: '#C9584B' }), { dir: 3, cup: '#C9463E' }), -31.0, B3 + CT[1] + 0.9, { acts: ['drink', 'eat', 'drink', 'rest'], seed: 1438 });

  /* ---------------- the stands' people and their queues ---------------- */
  // the sushi chef: shaping nigiri, laying it down, calling out
  T.actor({ sample: 0.25, period: 8, at(t) { const u = ((t % 8) + 8) % 8, s = u < 4 ? ['shape', Math.floor(u * 3) % 2] : u < 5 ? ['give', 0] : u < 7 ? ['shape', Math.floor(u * 3) % 2] : ['call', 0]; return { x: -27, y: 10.2, key: s[0] + s[1], a: s[0], i: s[1] }; },
    draw(g, st) { const w = TK.who(1450, { dir: 1, top: '#F6F3EA', bot: '#F6F3EA', hairStyle: 'buzz', cap: '#F6F3EA', bare: false }); if (st.a === 'shape') { const r = TK.person(g, 0, 0, 0, Object.assign({}, w, { hands: [[2.6, -11.8 + st.i * 0.4], [3.2, -11.4 - st.i * 0.4]] })); g.disc2([(r.hands[0][0] + r.hands[1][0]) / 2, (r.hands[0][1] + r.hands[1][1]) / 2 - 0.3], 0.6, '#F6F3EA'); } else if (st.a === 'give') { const r = TK.person(g, 0, 0, 0, Object.assign({}, w, { reach: [4.0, -12.2] })); g.fill2([[r.hands[0][0] - 0.8, r.hands[0][1]], [r.hands[0][0] + 0.8, r.hands[0][1]], [r.hands[0][0] + 0.8, r.hands[0][1] - 0.6], [r.hands[0][0] - 0.8, r.hands[0][1] - 0.6]], '#E9806A', true); } else keeperDraw(g, w, 'call', 0, 0, 0, 'fish'); } });
  // two eating at the sushi counter
  TK.idle(T, Object.assign(TK.salary(1451), { dir: 3, food: '#E9806A' }), -30.4, 13.0, { acts: ['eat', 'eat', 'look', 'talk'], seed: 1451 });
  TK.idle(T, Object.assign(TK.who(1452, { top: '#D98AA4', hairStyle: 'long' }), { dir: 3, food: '#F3E3C0' }), -24.2, 13.0, { acts: ['eat', 'photo', 'eat', 'laugh'], seed: 1452 });
  // the tamagoyaki seller handing a stick through the window
  T.actor({ sample: 0.25, period: 6, at(t) { const u = ((t % 6) + 6) % 6, s = u < 2.4 ? ['cut', Math.floor(u * 3) % 2] : u < 3.6 ? ['hand', 0] : ['call', Math.floor(u * 2) % 2]; return { x: -11.5, y: 10.2, key: s[0] + s[1], a: s[0], i: s[1] }; },
    draw(g, st) { const w = TK.who(1453, { dir: 1, top: '#F3F1EA', bot: '#2F343B', cap: '#E6C24F', bare: false }); if (st.a === 'hand') { const r = TK.person(g, 0, 0, 0, Object.assign({}, w, { reach: [4.0, -12.6] })); const h = r.hands[0]; g.line2([h, [h[0] + 0.6, h[1] - 2.2]], { w: 0.25, c: '#D9C9A8', boil: false }); g.fill2([[h[0] - 0.2, h[1] - 1.4], [h[0] + 1.4, h[1] - 1.8], [h[0] + 1.4, h[1] - 3.0], [h[0] - 0.2, h[1] - 2.6]], '#F3D35A', true); } else keeperDraw(g, w, st.a, st.i, 0, 0, 'tamago'); } });
  // a queue that inches forward: every few seconds the one at the window is served and walks off eating, the rest
  // step up and a newcomer joins at the end
  const queue = (o) => {
    const P = o.period, n = o.n, slot = (k) => [o.x0 + o.dx * k, o.y0 + o.dy * k], whoQ = (k) => o.who(((k % 9) + 9) % 9);
    const dirQ = Math.abs(o.dx) > Math.abs(o.dy) ? (o.dx > 0 ? 2 : 0) : (o.dy > 0 ? 3 : 1);
    const clock = (t) => { const u = ((t % (P * 9)) + P * 9) % (P * 9), c = Math.floor(u / P), v = u - c * P, mv = v > P - 1.4 ? (v - (P - 1.4)) / 1.4 : 0, q = Math.round(mv * 5); return { c, q, mv: q / 5, f: Math.floor(v * 1.5) % 4 }; };
    // one actor per place in the line (k = 0 is the one at the window), each at the feet of whoever stands there now: they
    // step up from place k + 1 while the line moves, and the one at the window has gone (the actor below walks them off)
    for (let k = 0; k <= n; k++) T.actor({ sample: 0.2, period: P * 9, r: 14,
      at(t) { const s = clock(t); if (k === 0 && s.mv > 0) return null; const p = slot(k - s.mv); return { x: p[0], y: p[1], key: s.c + '.' + (s.q ? 'm' + s.q : 's' + s.f), c: s.c, mv: s.mv, f: s.f }; },
      draw(g, st) {
        const w = whoQ(st.c + k);
        if (k === 0) { TK.doing(g, Object.assign({}, w, { dir: o.head }), st.f % 2 ? 'point' : 'look', 0, 0, 0, 0); return; }
        if (st.mv > 0) TK.person(g, 0, 0, 0, Object.assign({}, w, { dir: dirQ, pose: 'walk', ph: st.mv })); else TK.doing(g, Object.assign({}, w, { dir: dirQ }), (k + st.f) % 5 === 0 ? 'phone' : (k + st.c) % 3 === 0 ? 'talk' : 'look', (k + st.f) % 2, 0, 0, 0);
      } });
    // the one just served walks away eating, and fades out down the street
    T.actor({ sample: 0.2, period: P * 9, r: 14,
      at(t) { const u = ((t % (P * 9)) + P * 9) % (P * 9), c = Math.floor(u / P), v = u - c * P; if (v < P - 1.4 && v > 4.6) return null; const w0 = v >= P - 1.4 ? v - (P - 1.4) : v + 1.4, d = w0 * 1.6, p = [o.x0 + o.ox * d, o.y0 + o.oy * d], ph = Math.floor((d / 2.4) % 1 * 8), a = 1 - smooth((w0 - 4.4) / 1.6); return { x: p[0], y: p[1], key: (v >= P - 1.4 ? c + 1 : c) + '.' + ph, c: v >= P - 1.4 ? c : c - 1, ph: ph / 8, alpha: a < 1 ? a : null }; },
      draw(g, st) { const w = whoQ(st.c); const r = TK.person(g, 0, 0, 0, Object.assign({}, w, { dir: o.leave, pose: 'walk', ph: st.ph, hands: [[-1.6, -9.8], [1.6, -16.4]] })); const h = r.hands[0][1] < r.hands[1][1] ? r.hands[0] : r.hands[1]; o.item(g, h); } });
  };
  const tourist = (k) => { const R = RNG(1460 + k); return R() < 0.25 ? TK.kimono(1460 + k) : R() < 0.45 ? TK.salary(1460 + k) : TK.who(1460 + k, R() < 0.3 ? { cap: '#E3D3A0' } : {}); };
  queue({ x0: -22.6, y0: 13.2, dx: 1.9, dy: 0.35, n: 6, period: 7, head: 3, leave: 1, ox: 0.3, oy: 1, who: (k) => tourist(k), item: (g, h) => g.fill2([[h[0] - 1.0, h[1]], [h[0] + 1.0, h[1]], [h[0] + 1.0, h[1] - 0.7], [h[0] - 1.0, h[1] - 0.7]], '#E9806A', true) });
  queue({ x0: -9.6, y0: 13.4, dx: 1.9, dy: 0.4, n: 5, period: 5, head: 3, leave: 1, ox: 0.15, oy: 1, who: (k) => tourist(k + 20), item: (g, h) => { g.line2([h, [h[0] + 0.5, h[1] - 2.2]], { w: 0.25, c: '#D9C9A8', boil: false }); g.fill2([[h[0] - 0.2, h[1] - 1.3], [h[0] + 1.3, h[1] - 1.7], [h[0] + 1.3, h[1] - 2.9], [h[0] - 0.2, h[1] - 2.5]], '#F3D35A', true); } });
  // the griller turning skewers and fanning the coals; smoke drifting off
  T.actor({ sample: 0.25, period: 6, at(t) { const u = ((t % 6) + 6) % 6, s = u < 3 ? ['turn', Math.floor(u * 3) % 2] : u < 4 ? ['hand', 0] : ['fan', Math.floor(u * 4) % 2]; return { x: 5, y: 10.2, key: s[0] + s[1], a: s[0], i: s[1] }; },
    draw(g, st) { keeperDraw(g, TK.who(1454, { dir: 1, top: '#2F343B', bot: '#2F343B', cap: '#F3F1EA', bare: false }), st.a, st.i, 0, 0, 0, 'grill'); } });
  const smokeA = (x, y, z, ph) => T.actor({ sample: 5, period: 10, grow: false, at(t) { const f = (Math.floor(t * 3 + ph) % 6 + 6) % 6; return { x, y, z, key: f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0); for (let k = 0; k < 3; k++) { const u = ((st.f / 6) + k / 3) % 1, y = o[1] - u * 14, x = o[0] + u * 7 + Math.sin(u * 5 + k) * 1.2, r = 1.2 + u * 2.6, pts = []; for (let i = 0; i < 8; i++) { const a = TAU * i / 8; pts.push([x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 0.7]); } g.fill2(pts, mix('#F2F0EA', '#D9D5CC', 0.5 - u * 0.4), true); } } });
  smokeA(5, 11.2, 4.6, 0); smokeA(R3[8].x0 + 3.6, B3 + 4.0, 4.6, 4);
  // the sweets seller
  TK.idle(T, TK.who(1455, { dir: 1, top: '#F2C6D0', bot: '#5A6B7A', hairStyle: 'bun', bare: false }), 16.5, 10.2, { acts: ['talk', 'wave', 'look', 'point', 'rest'], seed: 1455 });
  // the two men cutting the tuna with the long knife, sawing it back and forth; the crowd with their phones
  // one actor per man, on one clock, each at his own feet behind the table; the first one draws the long knife between them
  const sawAt = (t) => { const u = ((t % 8) + 8) % 8; return u < 6 ? Math.floor(u * 2.5) % 4 : 4; };
  [[-3.4, 20.8, 1490], [3.6, 21.1, 1491]].forEach(([mx, my, seed], m) => T.actor({ sample: 0.2, period: 8, r: 18,
    at(t) { const f = sawAt(t); return { x: mx, y: my, key: f, f }; },
    draw(g, st) {
      const saw = st.f === 4 ? 0 : [0, 0.9, 1.6, 0.9][st.f], k = keeperWho(seed);
      const kn0 = g.p(-4.6 + saw - mx, 20.8 + 2.6 - my, 4.0), kn1 = g.p(4.2 + saw - mx, 20.8 + 2.6 - my, 4.2), a = g.p(0, 0, 0);
      if (st.f === 4) { TK.doing(g, Object.assign({}, k, { dir: 1 }), m ? 'wave' : 'talk', 1, 0, 0, 0); return; }
      const kn = m ? kn1 : kn0, s = m ? -1.2 : 1.4;
      TK.person(g, 0, 0, 0, Object.assign({}, k, { dir: 1, hands: [[kn[0] - a[0], kn[1] - a[1]], [kn[0] - a[0] + s, kn[1] - a[1] + 0.5]] }));
      if (!m) { g.line2([kn0, kn1], { w: 0.75, c: '#DCE3E6', boil: false }); g.line2([kn0, [kn0[0] - 1.8, kn0[1] + 0.9]], { w: 1.0, c: '#4A3A2C', boil: false }); }
    } }));
  TK.photo(T, { who: TK.who(1496, { top: '#7FB7D9' }), x: -4.6, y: 28.8 }, [{ who: TK.who(1497, { top: '#E7A9A0', hairStyle: 'long' }), x: -6.4, y: 26.8 }, { who: TK.who(1498, { top: '#F3E3A0' }), x: -4.4, y: 26.8 }], { seed: 2, pause: 4 });
  for (const [x, y, s] of [[1.4, 27.4, 1499], [4.6, 27.0, 1500], [7.6, 26.4, 1501], [-8.8, 25.8, 1502]]) TK.idle(T, Object.assign(tourist(s - 1400), { dir: 3, lookTo: s % 2 ? 1 : 3 }), x, y, { acts: ['photo', 'photo', 'look', 'point', 'clap', 'laugh'], seed: s });
  TK.group(T, [{ who: Object.assign(TK.who(1509, { top: '#7FB7D9' }), { food: '#E9806A' }), x: -21.6, y: 28.4, idle: 'eat' }, { who: Object.assign(TK.kimono(1510), { dir: 3, food: '#F6F3EA' }), x: -19.2, y: 29.2, idle: 'eat' }], { seed: 1509, laughs: 0.5 });
  // at the standing table: people eating what they bought
  TK.group(T, [{ who: Object.assign(TK.who(1503, { top: '#C9584B' }), { food: '#F3D35A' }), x: 18.6, y: 26.6, idle: 'eat' }, { who: Object.assign(TK.who(1504, { top: '#5A6B5A' }), { dir: 2, food: '#B5623A' }), x: 22.4, y: 25.6, idle: 'eat' }, { who: TK.who(1505, { dir: 0, top: '#F3F1EA', hairStyle: 'pony' }), x: 18.2, y: 23.0 }], { seed: 1503, laughs: 0.6 });
  // on the benches: people eating skewers, sushi, tamagoyaki, and talking
  TK.group(T, [{ who: Object.assign(TK.who(1530, { top: '#7FB7D9' }), { sit: true, dir: 1, food: '#F3D35A' }), x: 13.4, y: 30.6, z: 0.4, idle: 'eat' }, { who: Object.assign(TK.who(1531, { top: '#E7A9A0', hairStyle: 'long' }), { sit: true, dir: 1, food: '#B5623A' }), x: 15.8, y: 30.6, z: 0.4 }], { seed: 1530, laughs: 0.6 });
  TK.idle(T, Object.assign(TK.kimono(1532), { sit: true, dir: 1, food: '#E9806A' }), 21.6, 31.4, { acts: ['eat', 'eat', 'look', 'drink', 'laugh'], z: 0.4, seed: 1532 });
  TK.photo(T, { who: TK.who(1533, { top: '#3F5F8F' }), x: 23.6, y: 33.0 }, [{ who: Object.assign(TK.who(1534, { top: '#F3E3A0' }), { sit: true }), x: 23.6, y: 31.4, z: 0.4 }], { seed: 5, pause: 5 });
  TK.group(T, [{ who: Object.assign(TK.salary(1535), { sit: true, dir: 1, cup: '#F6F3EA' }), x: 29.2, y: 29.8, z: 0.4, idle: 'drink' }, { who: Object.assign(TK.who(1536, { top: '#5A6B5A' }), { sit: true, dir: 1 }), x: 31.4, y: 29.8, z: 0.4 }], { seed: 1535 });
  // a worker at the loading bay carrying boxes from the stack to the truck and back
  T.actor({ sample: 0.25, period: 8, r: 14,
    at(t) { const u = ((t % 8) + 8) % 8, out = u < 4, s = out ? u / 4 : (u - 4) / 4, x = lerp(26.4, 31.4, out ? s : 1 - s), ph = Math.floor((x / 2.4) % 1 * 8); return { x, y: 12.6, key: (out ? 'o' : 'b') + ph, out, ph: ph / 8 }; },
    draw(g, st) { const w = keeperWho(1506), r = TK.person(g, 0, 0, 0, Object.assign({}, w, { dir: st.out ? 0 : 2, pose: 'walk', ph: st.ph, hands: st.out ? [[1.4, -15.0], [2.6, -15.2]] : undefined })); if (st.out) { const h = r.hands[0]; g.fill2([[h[0] - 2.0, h[1] + 0.4], [h[0] + 2.4, h[1] + 0.4], [h[0] + 2.4, h[1] - 2.4], [h[0] - 2.0, h[1] - 2.4]], '#F6F3EA', true); g.outline2([[h[0] - 2.0, h[1] + 0.4], [h[0] + 2.4, h[1] + 0.4], [h[0] + 2.4, h[1] - 2.4], [h[0] - 2.0, h[1] - 2.4]], { w: 0.3, c: '#8C8576', boil: false }); } } });
  // keepers of the back row at their doors: the sushi restaurant's man calling in customers, the tea shop's lady
  TK.idle(T, Object.assign(keeperWho(1507), { dir: 1 }), -6.6, R1F + 1.0, { acts: ['wave', 'talk', 'bow', 'look', 'wave'], seed: 1507 });
  TK.idle(T, TK.who(1508, { dir: 1, top: '#3F7A4A', bot: '#2F343B', hairStyle: 'bun', bare: false }), -30.8, R1F + 1.0, { acts: ['talk', 'point', 'rest', 'bow'], seed: 1508 });

  /* ---------------- moving things ---------------- */
  // turret trucks round the loop of the back lanes
  const PATH = [[-33.4, -24.5], [33.2, -24.5], [33.2, -11.6], [-33.4, -11.6]];      // (1.6 u wide each side: the back leg clears the nobori, fp y -26.7 .. -26.1)
  const segL = PATH.map((p, i) => Math.hypot(PATH[(i + 1) % 4][0] - p[0], PATH[(i + 1) % 4][1] - p[1])), tot = segL.reduce((a, b) => a + b, 0);
  const along = (d) => { d = ((d % tot) + tot) % tot; for (let i = 0; i < 4; i++) { if (d < segL[i]) { const a = PATH[i], b = PATH[(i + 1) % 4], u = d / segL[i]; return { x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), ang: Math.atan2(b[1] - a[1], b[0] - a[0]) }; } d -= segL[i]; } return { x: PATH[0][0], y: PATH[0][1], ang: 0 }; };
  [0, 0.36, 0.68].forEach((ph, i) => {
    const who = TK.who(1510 + i, { top: ['#5F8FC9', '#F3F1EA', '#E08A3C'][i], cap: '#3B3F47', bot: '#2F343B', bare: false });
    T.actor({ sample: 0.3, period: tot / 5.5,
      at(t) { const p = along(t * 5.5 + ph * tot), q = Math.round(p.ang / (TAU / 16)), a = q * TAU / 16, ca = Math.abs(Math.cos(a)), sa = Math.abs(Math.sin(a)); return { x: p.x, y: p.y, key: q, ang: a, ext: [3.4 * ca + 1.6 * sa, 3.4 * sa + 1.6 * ca] }; },
      draw(g, st) { TK.turret(g, st.ang, who, foam); } });
  });
  // shoppers in the lanes, some eating as they walk; a fishmonger with a box on his shoulder
  const eater = (seed, pts, speed, ph, item) => T.actor({ sample: 0.25, period: 0, r: 14, ...(() => { const seg = [], L = [0]; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); } const total = L[L.length - 1], w = tourist(seed);
    return { period: total / speed,
      at(t) { let d = (((t * speed + ph * total) % total) + total) % total, i = 0; while (i < seg.length - 1 && d > L[i + 1]) i++; const [a, b] = seg[i], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1], dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph8 = Math.floor((d / 2.4) % 1 * 8), bite = Math.floor(t / 1.6) % 3 === 0 ? 1 : 0; return { x: a[0] + dx * u, y: a[1] + dy * u, key: dir + '.' + ph8 + '.' + bite, dir, ph: ph8 / 8, bite }; },
      draw(g, st) { const r = TK.person(g, 0, 0, 0, Object.assign({}, w, { dir: st.dir, pose: 'walk', ph: st.ph, hands: [[-1.6, -9.8], st.bite ? [1.2, -17.6] : [2.6, -13.2]] })); const h = r.hands[0][1] < r.hands[1][1] ? r.hands[0] : r.hands[1]; item(g, h); } }; })() });
  const skewer = (g, h) => { g.line2([[h[0], h[1] + 0.6], [h[0] + 0.5, h[1] - 2.6]], { w: 0.25, c: '#D9C9A8', boil: false }); for (let k = 0; k < 3; k++) g.disc2([h[0] + 0.15 + k * 0.12, h[1] - 0.6 - k * 0.7], 0.42, k % 2 ? '#B5323A' : '#E9D2B0'); };
  const tama = (g, h) => { g.line2([[h[0], h[1] + 0.6], [h[0] + 0.5, h[1] - 2.2]], { w: 0.25, c: '#D9C9A8', boil: false }); g.fill2([[h[0] - 0.3, h[1] - 1.2], [h[0] + 1.2, h[1] - 1.6], [h[0] + 1.2, h[1] - 2.8], [h[0] - 0.3, h[1] - 2.4]], '#F3D35A', true); };
  eater(40, [[-32.4, 17.2], [34, 17.2], [34, 18.0], [-32.4, 18.0]], 1.5, 0.1, skewer);
  eater(41, [[30, 19.2], [-30, 19.2], [-30, 18.6], [30, 18.6]], 1.3, 0.55, tama);
  eater(42, [[-33, -13.6], [28, -13.6], [28, -14.0], [-33, -14.0]], 1.4, 0.3, skewer);
  // (each walks +x along one line and back along another: in the back lane between the turret trucks (y -24.5 +- 1.6)
  // and the stall shelves (y -21), in the middle lane in front of the trucks, in the front lane; no line is walked both ways)
  const LANES = [[-9.4, -8.8], [-22.3, -21.9], [-8.2, -7.6], [-22.45, -21.5]];
  for (let i = 0; i < 4; i++) { const [a, b] = LANES[i]; K.walker(T, tourist(60 + i), [[-30 + i * 2.6, a], [27 - i * 1.4, a], [27 - i * 1.4, b], [-30 + i * 2.6, b]], 1.6 + (i % 3) * 0.35, { phase: (i * 0.29) % 1 }); }
  for (let i = 0; i < 2; i++) K.walker(T, tourist(70 + i), [[-34 + i * 3, 1.0 + i * 0.6], [34 - i * 2, 1.0 + i * 0.6], [34 - i * 2, 2.2 + i * 0.6], [-34 + i * 3, 2.2 + i * 0.6]], 1.5 + i * 0.3, { phase: 0.2 + i * 0.31 });
  T.actor({ sample: 0.25, period: 46, r: 14,
    at(t) { const L = 2 * 46, d = (((t * 2.0) % L) + L) % L, out = d < 46, s = out ? d : L - d, x = -23 + s, ph = Math.floor((s / 2.4) % 1 * 8); return { x, y: out ? 16.75 : 16.2, key: (out ? 0 : 2) + '.' + ph, dir: out ? 0 : 2, ph: ph / 8 }; },
    draw(g, st) { const r = TK.person(g, 0, 0, 0, Object.assign({}, keeperWho(1515), { dir: st.dir, pose: 'walk', ph: st.ph, hands: [[0.4, -19.6], [-1.6, -9.8]] })); const h = r.hands[0][1] < r.hands[1][1] ? r.hands[0] : r.hands[1]; const s = st.dir === 0 ? 1 : -1; g.fill2([[h[0] - 2.2 * s, h[1] + 0.6], [h[0] + 1.8 * s, h[1] + 0.6], [h[0] + 1.8 * s, h[1] - 2.4], [h[0] - 2.2 * s, h[1] - 2.4]], '#F6F3EA', true); g.outline2([[h[0] - 2.2 * s, h[1] + 0.6], [h[0] + 1.8 * s, h[1] + 0.6], [h[0] + 1.8 * s, h[1] - 2.4], [h[0] - 2.2 * s, h[1] - 2.4]], { w: 0.3, c: '#8C8576', boil: false }); } });
  // the delivery scooter with a box on the back, along the front; a bicycle with a crate
  const rideF = (who, col, period, y0, y1, box) => T.actor({ sample: 0.3, period,
    at(t) { const u = (((t / period) % 1) + 1) % 1, dir = u < 0.5 ? 1 : -1, s = u < 0.5 ? u * 2 : (1 - u) * 2, x = -35 + s * 70, a = Math.min(1, Math.min(s, 1 - s) * 14); return { x, y: dir > 0 ? y0 : y1, key: dir, dir, alpha: a < 1 ? a : null, ext: [4.0, 0.8] }; },
    draw(g, st) { const ang = st.dir > 0 ? 0 : Math.PI; K.bike(g, ang, { col, who }); const c = g.p(-2.6 * Math.cos(ang), 0, 3.0); g.fill2([[c[0] - 2.2, c[1] - 2.6], [c[0] + 2.2, c[1] - 2.6], [c[0] + 2.2, c[1] + 0.6], [c[0] - 2.2, c[1] + 0.6]], box, true); g.outline2([[c[0] - 2.2, c[1] - 2.6], [c[0] + 2.2, c[1] - 2.6], [c[0] + 2.2, c[1] + 0.6], [c[0] - 2.2, c[1] + 0.6]], { w: 0.3, c: '#5A564E', boil: false }); } });
  // (the riders keep to the front edge, y 34.2 .. 36.5, clear of the lamps, the benches, the photo and the bike row; going
  // +x on the inner lines and -x on the outer ones, 0.8 u or more apart, so they never meet head-on or ride through each other)
  rideF(TK.who(1516, { top: '#F3F1EA', cap: '#3B3F47', bot: '#2F343B' }), '#C9463E', 24, 34.2, 36.5, '#F6F3EA');
  rideF(TK.who(1517, { top: '#3F5F8F', bot: '#2F343B' }), '#3F6FA8', 19, 35.0, 35.8, '#5F8FC9');
  // gulls wheeling above
  for (let i = 0; i < 2; i++) T.actor({ layer: 'top', sample: 5, period: 10, grow: false,
    at(t) { const a = t * 0.5 + i * 2.1, f = Math.floor(t * 5 + i) % 4; return { x: -4 + Math.cos(a) * (14 + i * 4), y: 0 + Math.sin(a) * (10 + i * 3), z: 24 + i * 3, key: f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), w = [3.4, 2.4, 1.0, 2.4][st.f], d = [-1.4, -0.6, 0.6, -0.6][st.f]; g.fill2([[o[0] - w, o[1] + d], [o[0] - 0.8, o[1] - 0.2], [o[0], o[1] + 0.5], [o[0] + 0.8, o[1] - 0.2], [o[0] + w, o[1] + d], [o[0] + 0.6, o[1] + 0.4], [o[0], o[1] + 1.0], [o[0] - 0.6, o[1] + 0.4]], '#FBFAF6', true); g.line2([[o[0] - w, o[1] + d], [o[0] - 0.8, o[1] - 0.2], [o[0], o[1] + 0.5], [o[0] + 0.8, o[1] - 0.2], [o[0] + w, o[1] + d]], { w: 0.45, c: '#6B6458', boil: false }); } });
});
