'use strict';
/* (0,-100) Where Chinatown meets Little Italy.
   Mulberry Street runs along x through the far half, closed to cars for dinner: on its far side a row of walk-ups
   with restaurants below (red brick, cream stucco, green-trimmed; awnings, RISTORANTE / CAFFE / PIZZA boards, fire
   escapes, a water tank) on the Little Italy end, and on the Chinatown end narrow buildings hung with red and yellow
   signboards, a bakery, a herb shop. Arches of red, white and green bulbs span the Italian end of the street, strings
   of red paper lanterns the Chinese end. Red-checked tables in the street with diners; a waiter carries plates.
   The near half is Columbus Park, low so the street stays in view: stone tables where old men play xiangqi and cards
   with a crowd of kibitzers, a tai chi class moving slowly in a row, birdcages hung on a branch, kids shooting hoops on
   the half court. Along the right-hand kerb, a two-storey Chinatown row with fruit stands out on the sidewalk under
   striped awnings: oranges, dragon fruit, bok choy; a fishmonger on ice.
   What moves: the waiter, strollers, the tai chi class, the basketball, a hand-truck of boxes, lantern tassels. */
SF.tile('chinatown', 0, -100, { rim: 16 }, function (T) {
  const LANE0 = -9, LANE1 = 1.5;
  /* pseudo-hanzi: a few strokes inside a small square, picked by seed (wide px) */
  const glyph2 = (g, c, s, col, seed) => {
    const R = RNG(seed * 131 + 7), segs = [], h = s / 2, n = 3 + R.int(0, 2);
    for (let i = 0; i < n; i++) {
      const t = R.int(0, 5), a = (R() - 0.5) * 0.8 * s;
      if (t <= 1) segs.push(c[0] - h * 0.85, c[1] + a * 0.9, c[0] + h * 0.85, c[1] + a * 0.9);
      else if (t <= 3) segs.push(c[0] + a * 0.9, c[1] - h * 0.9, c[0] + a * 0.9, c[1] + h * 0.9);
      else if (t === 4) segs.push(c[0] + a * 0.5, c[1] - h * 0.3, c[0] + a * 0.5 - h * 0.6, c[1] + h * 0.8);
      else segs.push(c[0], c[1], c[0] + h * 0.7, c[1] + h * 0.75);
    }
    g.segs2(segs, col, Math.max(0.3, s * 0.13));
  };
  /* a Chinese signboard on a face: vertical (a column of glyphs) or horizontal */
  const hsign = (g, face, p, a0, a1, z0, z1, col, ink, seed) => {
    const q = K.on(face, p + 0.06, a0, a1, z0, z1); g.fill(q, col); g.outline(q, { w: 0.4, c: shade(col, 0.5), boil: false });
    const vert = (z1 - z0) > Math.abs(a1 - a0), n = Math.max(1, Math.floor(vert ? (z1 - z0) / Math.abs(a1 - a0) : Math.abs(a1 - a0) / (z1 - z0)));
    const cell = vert ? (z1 - z0) / n : (a1 - a0) / n, s = Math.min(Math.abs(cell), vert ? Math.abs(a1 - a0) : z1 - z0) * 0.62 * 3.3;
    for (let i = 0; i < n; i++) { const c = vert ? g.p.apply(g, K.pt(face, p + 0.1, (a0 + a1) / 2, z1 - cell * (i + 0.5))) : g.p.apply(g, K.pt(face, p + 0.1, a0 + cell * (i + 0.5), (z0 + z1) / 2)); glyph2(g, c, s, ink, seed * 7 + i); }
  };
  /* a paper lantern hanging at wide-px point c */
  const lantern2 = (g, c, r, col) => {
    const pts = []; for (let i = 0; i < 14; i++) { const t = TAU * i / 14; pts.push([c[0] + Math.cos(t) * r * 0.8, c[1] + Math.sin(t) * r]); }
    g.fill2(pts, col, true); g.fill2(pts.filter((p) => p[0] > c[0]), shade(col, 0.15), true);
    g.fill2([[c[0] - r * 0.5, c[1] - r * 1.1], [c[0] + r * 0.5, c[1] - r * 1.1], [c[0] + r * 0.5, c[1] - r * 0.85], [c[0] - r * 0.5, c[1] - r * 0.85]], '#2A2622', true);
    g.fill2([[c[0] - r * 0.5, c[1] + r * 0.85], [c[0] + r * 0.5, c[1] + r * 0.85], [c[0] + r * 0.5, c[1] + r * 1.1], [c[0] - r * 0.5, c[1] + r * 1.1]], '#2A2622', true);
    g.segs2([c[0], c[1] + r * 1.1, c[0], c[1] + r * 1.8], '#E6C24F', 0.35);
  };

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    NK.lot(g, { inner: '#E3DED3' });
    // Mulberry Street: old asphalt with a painted centre line gone faint, kerbs on both sides
    g.fill(K.rect(-31, LANE0, 31, LANE1), '#D4CFC4');
    g.scuff(K.rect(-31, LANE0, 31, LANE1), { dir: Math.atan2(AY, AX), len: 6, c: '#DFDBD1', dens: 0.6, w: 0.5, spread: 0.05 });
    g.line([[-31, LANE0, 0], [31, LANE0, 0]], { w: 0.5, c: '#A9A296', boil: false }); g.line([[-31, LANE1, 0], [31, LANE1, 0]], { w: 0.5, c: '#A9A296', boil: false });
    // Columbus Park: a rubber half court, paving round the stone tables, a lawn edge with trees
    g.fill(K.rect(-30, 13, -14, 30), '#C98E6E'); g.outline(K.rect(-30, 13, -14, 30), { w: 0.5, c: '#F3EDE2', boil: false });
    const arc = []; for (let i = 0; i <= 10; i++) { const a = Math.PI * i / 10; arc.push([-22 + Math.cos(a) * 5, 13 + Math.sin(a) * 5, 0]); } g.fine(arc, { w: 0.45, c: '#F3EDE2' });
    g.fine([[-26, 13, 0], [-26, 19, 0], [-18, 19, 0], [-18, 13, 0]], { w: 0.45, c: '#F3EDE2' });
    g.fill(K.rect(-12, 4.5, 16, 30), '#E8E3D7'); g.scuff(K.rect(-12, 4.5, 16, 30), { dir: -0.5, len: 3, c: '#D6D0C2', dens: 0.6, w: 0.45 });
    for (const r of [K.rect(-31, 4, -12, 12), K.rect(-13, 4, -12, 30)]) { g.fill(r, C.grass); g.grass(r, { dens: 0.7 }); }
  }, { rim: true });

  /* ---------------- the far row: Little Italy, then Chinatown ---------------- */
  T.obj([-31, -31, -21, -10], (g) => {
    NK.walkup(g, -31, -31, -21, -10, 4, { col: NYC.brick, face: 'L', shop: { word: 'RISTORANTE', col: '#2F6B4A', awning: '#2F6B4A', stripe: '#F3F1EA' }, tx: 0.4, ty: 0.3 });
  }, { name: 'ristorante' });
  T.obj([-21, -31, -11, -10], (g) => {
    NK.walkup(g, -21, -31, -11, -10, 4, { col: '#E3D6BC', face: 'L', lintel: '#B9A27D', corn: '#9A8A6E', shop: { word: 'CAFFE', col: '#C9463E', awning: '#C9463E', stripe: '#F3F1EA' }, tank: false });
  }, { name: 'caffe' });
  T.obj([-11, -31, -1, -10], (g) => {
    NK.walkup(g, -11, -31, -1, -10, 5, { col: NYC.brick3, face: 'L', shop: { word: 'PIZZA', col: '#2F6B4A', awning: '#E9E1CC', stripe: '#C9463E' }, tx: 0.5, ty: 0.25 });
  }, { name: 'pizza' });
  // Chinatown: narrow buildings, signboards everywhere
  const cbld = (x0, x1, nf, col, signs, seed) => T.obj([x0, -31, x1, -10], (g) => {
    const H = NK.walkup(g, x0, -31, x1, -10, nf, { col, face: 'L', shop: { word: '', col: '#C9463E', sign: false, goods: ['#E08A3C', '#C9463E', '#E6C24F', '#8FBF73'] }, tank: seed % 2 === 0, fire: seed !== 3 });
    signs(g, H);
  }, { name: 'chinatown building' });
  cbld(1, 9, 4, '#D9CDB8', (g) => { hsign(g, 'L', -10, 1.4, 8.6, 3.0, 4.4, '#C9363E', '#F2D25A', 11); hsign(g, 'L', -10, 7.4, 8.8, 5.2, 15.5, '#E6C24F', '#C9363E', 12); }, 1);
  cbld(9, 17, 5, '#B96A55', (g) => { hsign(g, 'L', -10, 9.4, 16.6, 3.0, 4.4, '#2F6B4A', '#F6F2E8', 21); hsign(g, 'L', -10, 9.4, 10.8, 6.0, 17, '#C9363E', '#F6F2E8', 22); NK.text(g, 'L', -10, 13, 1.0, 0.9, 'BAKERY', '#F6F2E8', { center: true }); }, 2);
  cbld(17, 24, 3, '#E9E1CC', (g) => { hsign(g, 'L', -10, 17.4, 23.6, 3.0, 4.4, '#E6C24F', '#C9363E', 31); hsign(g, 'R', 24, -20, -12, 9.5, 11.5, '#C9363E', '#F2D25A', 32); }, 3);
  cbld(24, 31, 4, '#8E9E8A', (g) => { hsign(g, 'L', -10, 24.4, 30.6, 3.0, 4.4, '#C9363E', '#F6F2E8', 41); hsign(g, 'R', 31, -28, -26, 6, 17, '#E6C24F', '#2A2622', 42); hsign(g, 'R', 31, -18, -16, 6, 14, '#C9363E', '#F6F2E8', 43); }, 4);

  /* ---------------- the lights over Mulberry Street ---------------- */
  // each arch (or lantern string) is split in two at the street's middle, so walkers sort between the halves
  const MID = -3.8;
  const arch = (x, half) => T.obj(half ? [x - 0.3, MID, x + 0.3, LANE1 + 0.3] : [x - 0.3, LANE0 - 0.3, x + 0.3, MID], (g) => {
    const y0 = half ? MID : LANE0, y1 = half ? LANE1 : MID, Z = 9.2, span = LANE1 - LANE0;
    const zAt = (y) => Z - 1.8 * Math.pow((2 * (y - LANE0) / span - 1), 2);
    const post = half ? LANE1 : LANE0, b = g.p(x, post, 0), t = g.p(x, post, Z - 1.8);
    g.line2([b, t], { w: 0.9, c: '#4A4640', boil: false });
    const pts = []; for (let k = 0; k <= 8; k++) { const y = lerp(y0, y1, k / 8); pts.push(g.p(x, y, zAt(y))); }
    g.line2(pts, { w: 0.9, c: '#4A4640', boil: false });
    const pts2 = []; for (let k = 0; k <= 8; k++) { const y = lerp(y0, y1, k / 8); pts2.push(g.p(x, y, zAt(y) - 0.9)); } g.fine2(pts2, { w: 0.3, c: '#5A5650' });
    for (let k = 0; k <= 8; k++) { const y = lerp(y0, y1, k / 8); for (const dz of [0.45, -0.45]) { const p = g.p(x, y, zAt(y) + dz - 0.45); g.disc2(p, 0.85, ['#D23A33', '#F6F2E8', '#3E9A55'][(k + (dz > 0 ? 0 : 1)) % 3]); } }
    if (!half) { const c = g.p(x, LANE0 + 0.5, Z + 0.6); g.disc2(c, 1.6, '#F6F2E8'); g.ring2(c, 1.6, { w: 0.4, c: '#C9463E' }); g.disc2(c, 0.7, '#3E9A55'); }
  }, { name: 'arch' });
  for (const x of [-29, -23, -17, -11, -5]) { arch(x, false); arch(x, true); }
  const lanterns = (x, half) => T.obj(half ? [x - 0.3, MID, x + 0.3, LANE1 + 0.3] : [x - 0.3, LANE0 - 0.3, x + 0.3, MID], (g) => {
    const y0 = half ? MID : LANE0, y1 = half ? LANE1 : MID, span = LANE1 - LANE0, zAt = (y) => 9.6 - 1.4 * (1 - Math.pow(2 * (y - LANE0) / span - 1, 2));
    const pts = []; for (let k = 0; k <= 8; k++) { const y = lerp(y0, y1, k / 8); pts.push(g.p(x, y, zAt(y))); } g.fine2(pts, { w: 0.3, c: '#4A4540' });
    if (half) { const b = g.p(x, LANE1, 0), t = g.p(x, LANE1, 9.6); g.line2([b, t], { w: 0.6, c: '#5A5650', boil: false }); }
    for (let k = 1; k < 4; k++) { const y = lerp(y0, y1, (k - 0.5) / 3); const p = g.p(x, y, zAt(y) - 1.4); lantern2(g, p, 1.5, k % 2 ? '#D23A33' : '#E8522E'); }
  }, { name: 'lanterns' });
  for (const x of [5, 13, 21, 28]) { lanterns(x, false); lanterns(x, true); }

  /* ---------------- dinner in the street ---------------- */
  // red-checked tables along the restaurant side, two diners each, a chair on the far side
  const tables = [[-28.5, 'a'], [-24, 'b'], [-17.5, 'c'], [-13, 'd'], [-6.5, 'e']];
  const chair = (g, x, y, back) => { K.box(g, x - 0.55, y - 0.55, x + 0.55, y + 0.55, 0, 1.35, { t: '#2F6B4A', l: '#3A7A56', r: '#2A5A40' }, { w: 0.35, boil: false }); if (back) K.box(g, x - 0.55, y - 0.65, x + 0.55, y - 0.45, 1.35, 3.0, '#2F6B4A', { w: 0.35, boil: false }); };
  tables.forEach(([x, k], i) => T.cast([x, -6.2], (g) => {
    const y = -6.2, wh = (dx, dy) => g.p(x + dx, y + dy, 2.05);
    chair(g, x - 0.1, y - 1.5, true);
    NK.person(g, x - 0.1, y - 1.5, 1.35, NK.who(1500 + i * 3, { dir: 1, pose: 'sit' }));
    K.box(g, x - 0.9, y - 0.8, x + 0.9, y + 0.8, 0, 1.95, { t: '#F3F1EA', l: '#EDE6D8', r: '#DCD5C6' }, { w: 0.4, boil: false });
    const ch = []; for (let a = 0; a < 4; a++) for (let b = 0; b < 3; b++) if ((a + b) % 2 === 0) { const p = g.p(x - 0.9 + a * 0.45 + 0.22, y - 0.8 + b * 0.53 + 0.27, 1.96); ch.push(p[0] - 0.55, p[1], p[0] + 0.55, p[1]); } g.segs2(ch, '#D23A33', 0.85);
    const cl = []; for (let a = 0; a < 4; a++) if (a % 2 === 0) { const p = g.p(x - 0.9 + a * 0.45 + 0.22, y + 0.8, 1.5); cl.push(p[0] - 0.5, p[1] - 0.3, p[0] + 0.5, p[1] + 0.3); } g.segs2(cl, '#D23A33', 0.9);
    for (const [dx, dy] of [[-0.35, -0.25], [0.35, 0.3]]) { const p = wh(dx, dy); g.disc2(p, 0.75, '#F6F2E8'); g.disc2(p, 0.42, i % 2 ? '#D2643A' : '#E9C46A'); }
    const wg = wh(0.15, -0.5); g.segs2([wg[0], wg[1], wg[0], wg[1] - 1.6], '#7A2A3A', 0.6);
    chair(g, x + 0.2, y + 1.5, false);
    NK.person(g, x + 0.2, y + 1.5, 0.55, NK.who(1501 + i * 3, { dir: 3, pose: 'sit' }));
    K.box(g, x - 0.35, y + 1.95, x + 0.75, y + 2.15, 1.35, 3.1, { t: '#2F6B4A', l: '#3A7A56', r: '#2A5A40' }, { w: 0.35, boil: false });
  }, { on: true }));
  // the waiter going between the kitchen door and the tables with plates
  T.actor({ sample: 0.25, period: 14,
    at(t) { const u = (t / 14) % 1, x = -29 + 26 * (u < 0.5 ? u * 2 : 2 - u * 2), ph = Math.floor((x / 2.4) % 1 * 8 + 8) % 8; return { x, y: -3.4, key: (u < 0.5 ? 0 : 2) + '.' + ph, dir: u < 0.5 ? 0 : 2, ph: ph / 8 }; },
    draw(g, st) { const r = NK.person(g, 0, 0, 0, NK.who(1530, { dir: st.dir, pose: 'walk', ph: st.ph, top: '#F6F2E8', bot: '#2B2A2A', tie: '#2B2A2A', bare: false, hairStyle: 'short', jacket: undefined })); const h = r.hands[0]; g.disc2([h[0], h[1] - 0.8], 1.3, '#F6F2E8'); g.disc2([h[0], h[1] - 0.9], 0.7, '#D2643A'); } });
  // a man pushing a hand-truck of produce boxes down the Chinatown end
  T.actor({ sample: 0.25, period: 12,
    at(t) { const u = (t / 12) % 1, x = 30 - 30 * u, ph = Math.floor(((30 - x) / 2.4) % 1 * 8); return { x, y: -1.2, key: ph, ph: ph / 8, alpha: u > 0.9 ? (1 - u) * 10 : null }; },
    draw(g, st) {
      const b = g.p(-2.2, 0, 0); g.ring2([b[0] + 0.4, b[1] - 1.4], 1.4, { w: 0.6, c: '#3A3632' });
      K.box(g, -3.2, -0.9, -1.3, 0.9, 0.2, 2.0, '#C9A26B', { w: 0.45, boil: false }); K.box(g, -3.2, -0.9, -1.3, 0.9, 2.0, 3.8, '#B98F58', { w: 0.45, boil: false });
      NK.who && NK.person(g, 0, 0, 0, NK.who(1531, { dir: 2, pose: 'walk', ph: st.ph, reach: [-6, -9], top: '#3B3F47', cap: '#2F2C2A' }));
    } });
  NK.walker(T, NK.tourist(1532), [[-30, -1.0], [30, -1.0]], 3.6, { phase: 0.15 });
  NK.walker(T, NK.who(1533, { tote: '#E9E1CC' }), [[29, -2.6], [-29, -2.6]], 3.9, { phase: 0.55 });
  NK.walker(T, NK.who(1534, { phone: true }), [[-30, 0.2], [30, 0.2]], 4.2, { phase: 0.8 });
  NK.walker(T, NK.who(1535, { hairStyle: 'bun', top: '#C9463E' }), [[28, -5.6], [2, -5.6]], 3.4, { phase: 0.3 });

  /* ---------------- Columbus Park ---------------- */
  // the half court: a pole and backboard at the far end; three kids, the ball bouncing between them
  T.obj([-23, 12.2, -21, 13.2], (g) => {
    const b = g.p(-22, 12.6, 0), t = g.p(-22, 12.6, 11.5); g.line2([b, t], { w: 0.9, c: '#4A4744', boil: false });
    g.fill(K.on('L', 13.0, -24.6, -19.4, 10, 13.6), '#F6F2E8'); g.outline(K.on('L', 13.0, -24.6, -19.4, 10, 13.6), { w: 0.5, boil: false });
    g.outline(K.on('L', 13.05, -23, -21, 10.4, 11.8), { w: 0.4, c: '#C9463E', boil: false });
    const rim = g.P(K.arc(-22, 14.0, 10.5, 0.9, 0, TAU, 10)); g.outline2(rim, { w: 0.5, c: '#D2643A', boil: false });
  }, { name: 'hoop' });
  T.actor({ sample: 0.25, period: 6, grow: true,
    at(t) { const u = (t / 3) % 1, n = Math.floor(t / 3) % 3, A = [[-25, 22], [-19, 24], [-22, 17.5]][n], B = [[-19, 24], [-22, 17.5], [-25, 22]][n];
      return { x: lerp(A[0], B[0], u), y: lerp(A[1], B[1], u), z: 0, key: Math.floor(u * 12) + '.' + n, h: u < 0.5 ? Math.abs(Math.sin(u * 2 * Math.PI)) * 2.5 : 4 * u * (1 - u) * 6 + 1.0 }; },
    draw(g, st) { const p = g.p(0, 0, st.h + 0.6); g.disc2([p[0], g.p(0, 0, 0)[1]], 0.9, 'rgba(96,84,66,0.2)'); g.disc2(p, 0.85, '#D2643A'); g.ring2(p, 0.85, { w: 0.3, c: '#7A3A20' }); } });
  for (const [x, y, d, s, pose] of [[-25.6, 22.6, 0, 1540, 'wave'], [-18.4, 24.6, 2, 1541, 'cheer'], [-22, 18.2, 1, 1542, 'stand']]) T.cast([x, y], (g) => NK.person(g, x, y, 0, NK.who(s, { dir: d, pose, ph: 0.3, k: 0.8, shorts: true, bare: true })), { on: true });
  // the stone tables: xiangqi, cards, the kibitzers leaning in
  const stoneTable = (x, y, game, seeds) => T.cast([x, y], (g) => {
    NK.person(g, x - 1.9, y, 0.95, NK.who(seeds[0], { dir: 0, pose: 'sit', hair: '#8E8A84', glasses: true }));
    K.cyl(g, x - 1.9, y, 0.55, 0, 0.95, '#B9B3A8', { w: 0.4, n: 8 });
    K.cyl(g, x, y, 0.5, 0, 1.6, '#B9B3A8', { w: 0.4, n: 8 }); K.cyl(g, x, y, 1.35, 1.6, 2.0, { t: '#D6D0C3', l: '#C9C3B6', r: '#B9B3A6' }, { w: 0.45, n: 14 });
    const c = g.p(x, y, 2.02);
    if (game === 'chess') { g.fill2([[c[0] - 3, c[1]], [c[0], c[1] - 1.7], [c[0] + 3, c[1]], [c[0], c[1] + 1.7]], '#E9D9A6', true); for (let k = 0; k < 7; k++) { const R = RNG(x * 7 + k); g.disc2([c[0] + (R() - 0.5) * 3.6, c[1] + (R() - 0.5) * 1.8], 0.35, k % 2 ? '#C9363E' : '#2A2622'); } }
    else for (let k = 0; k < 4; k++) g.fill2([[c[0] - 1.6 + k * 0.9, c[1] - 0.3], [c[0] - 1.0 + k * 0.9, c[1] - 0.5], [c[0] - 0.8 + k * 0.9, c[1] + 0.2], [c[0] - 1.4 + k * 0.9, c[1] + 0.4]], '#F6F2E8', true);
    K.cyl(g, x + 1.9, y, 0.55, 0, 0.95, '#B9B3A8', { w: 0.4, n: 8 });
    NK.person(g, x + 1.9, y, 0.95, NK.who(seeds[1], { dir: 2, pose: 'sit', hair: '#2B2420' }));
    NK.person(g, x + 0.6, y + 2.2, 0, NK.who(seeds[2], { dir: 3, pose: 'hold', hair: '#8E8A84', top: '#6C7A89' }));
  }, { on: true });
  stoneTable(-8, 8.5, 'chess', [1550, 1551, 1552]);
  stoneTable(-1, 9, 'cards', [1553, 1554, 1555]);
  stoneTable(-6, 15, 'chess', [1556, 1557, 1558]);
  // trees round the paving; birdcages hung on the branch of one
  for (const [x, y] of [[-12.5, 5.5], [-12.5, 18], [-30, 9], [-20, 8.5], [12, 5.2]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.6, h: 5.8, col: '#86B464' }), { name: 'tree' });
  T.cast([-12.6, 30], (g) => {
    K.tree(g, -12.6, 30, { r: 4.0, h: 6.4, col: '#7FAE62' });
    for (const [dx, col] of [[-5.5, '#C9A26B'], [4.8, '#B98F58']]) { const top = g.p(-12.6, 30, 8.2), c = [top[0] + dx, top[1] + 6]; g.segs2([c[0], top[1] + 1, c[0], c[1] - 2.6], '#4A4540', 0.3); const cage = []; for (let k = 0; k <= 8; k++) { const a = Math.PI * k / 8; cage.push([c[0] + Math.cos(a) * 1.5, c[1] - 1.2 - Math.sin(a) * 1.4]); } g.fill2(cage.concat([[c[0] - 1.5, c[1] + 0.8], [c[0] + 1.5, c[1] + 0.8]]), 'rgba(233,225,204,0.5)', true); const bars = []; for (let k = -2; k <= 2; k++) bars.push(c[0] + k * 0.6, c[1] - 1.2 - Math.sqrt(Math.max(0, 1 - (k * 0.4) * (k * 0.4))) * 1.4, c[0] + k * 0.6, c[1] + 0.8); g.segs2(bars, col, 0.25); g.disc2([c[0], c[1] - 0.2], 0.45, dx < 0 ? '#E6C24F' : '#6FA3C9'); }
    NK.person(g, -10.2, 28.6, 0, NK.who(1560, { dir: 2, pose: 'hold', hair: '#8E8A84', top: '#3B3F47', cap: '#3B3F47' }));
  }, { on: true });
  // the tai chi class: two rows moving together through the form
  for (let k = 0; k < 6; k++) {
    const x = -2 + (k % 3) * 4.4, y = 21 + Math.floor(k / 3) * 4.6, look = NK.who(1570 + k, { top: k === 0 ? '#C9463E' : ['#F3F1EA', '#E9E1CC', '#8FA3B5', '#F3F1EA', '#B9A27D'][k % 5], bot: '#3B3F47', hair: k % 2 ? '#8E8A84' : '#2B2420', bare: false, shorts: false, dress: undefined, tote: null, coffee: false });
    T.actor({ sample: 5, period: 12,
      at(t) { const ph = Math.floor(((t / 8 + (k === 0 ? 0.05 : 0)) % 1) * 8); return { x, y, key: ph, ph }; },
      draw(g, st) { const a = st.ph / 8 * TAU, d = st.ph < 4 ? 1 : 0; NK.person(g, 0, 0, 0, Object.assign({}, look, { dir: k === 0 ? 1 : d === 1 ? 2 : 3, pose: 'stand', hands: [[3 + Math.cos(a) * 2.5, -13 + Math.sin(a) * 2.5], [-1.5 + Math.cos(a + 1.4) * 2, -12 + Math.sin(a + 1.4) * 2]] })); } });
  }

  /* ---------------- the Chinatown row on the right kerb, its fruit stands ---------------- */
  T.obj([19, 4, 31, 16.5], (g) => {
    const H = NK.walkup(g, 19, 4, 31, 16.5, 2, { col: '#D9CDB8', face: 'R', shop: { word: '', sign: false, col: '#C9363E', goods: ['#E08A3C', '#C9463E'] }, tank: false, fire: false });
    hsign(g, 'R', 31, 4.6, 16, 3.2, 4.4, '#C9363E', '#F2D25A', 51); hsign(g, 'L', 16.5, 19.6, 21, 6, 12, '#E6C24F', '#C9463E', 52); void H;
    NK.awning(g, 'R', 31, 5, 16, 3.0, 2.6, '#E6C24F', { stripe: '#C9363E', drop: 0.8 });
  }, { name: 'fruit shop' });
  T.obj([19, 16.5, 31, 29], (g) => {
    NK.walkup(g, 19, 16.5, 31, 29, 2, { col: '#B9654C', face: 'R', shop: { word: '', sign: false, col: '#2F6B4A', goods: ['#C9C3B6', '#8FA3B5'] }, tank: true, tx: 0.5, ty: 0.5, fire: true });
    hsign(g, 'R', 31, 17, 28.5, 3.2, 4.4, '#2F6B4A', '#F6F2E8', 61); hsign(g, 'L', 29, 20, 21.4, 5.5, 12, '#C9363E', '#F6F2E8', 62);
    NK.awning(g, 'R', 31, 17.5, 28.5, 3.0, 2.6, '#3E8E5A', { stripe: '#F3F1EA', drop: 0.8 });
  }, { name: 'fish shop' });
  // the stands out on the sidewalk: crates heaped with fruit and greens, ice with fish
  const stand = (y0, y1, goods, ice) => T.obj([31.3, y0, 34.2, y1], (g) => {
    K.box(g, 31.4, y0, 34.0, y1, 0, 1.6, { t: '#B98F58', l: '#C9A26B', r: '#A8814E' }, { w: 0.5, boil: false });
    const top = g.P(K.rect(31.5, y0 + 0.1, 33.9, y1 - 0.1, 1.62)); g.fill2(top, ice ? '#EEF3F5' : '#8E6E44', true);
    const R = RNG(Math.round(y0 * 13)), d = [];
    for (let k = 0; k < (y1 - y0) * 5; k++) { const p = g.p(31.8 + R() * 1.9, y0 + 0.3 + R() * (y1 - y0 - 0.6), 1.7 + R() * 0.3); const col = R.pick(goods); if (ice) g.fill2([[p[0] - 1, p[1]], [p[0] + 0.9, p[1] - 0.3], [p[0] + 1.3, p[1] + 0.1], [p[0] + 0.9, p[1] + 0.4]], col, true); else g.disc2(p, 0.55, col); void d; }
  }, { name: 'stand' });
  stand(5, 8.5, ['#E8892E', '#F0A040', '#E8892E']); stand(9, 12.5, ['#D9468C', '#E85A9A', '#8FBF73']); stand(13, 16, ['#6FAE4A', '#8FC46A', '#4E8A3A']);
  stand(18, 21.5, ['#9AA8B4', '#B9C3CC', '#C9A69A'], true); stand(22, 25.5, ['#C9463E', '#9AA8B4', '#B9C3CC'], true);
  // shoppers and the fishmonger
  T.cast([35, 10], (g) => { NK.person(g, 35, 8, 0, NK.who(1580, { dir: 2, pose: 'hold', hair: '#8E8A84', tote: '#C9463E' })); NK.person(g, 35.3, 11.5, 0, NK.who(1581, { dir: 2, pose: 'hold' })); }, { on: true });
  T.cast([35, 22], (g) => { NK.person(g, 35.2, 23.5, 0, NK.who(1582, { dir: 2, pose: 'hold', top: '#F6F2E8', cap: '#F6F2E8' })); NK.person(g, 35.4, 20, 0, NK.who(1583, { dir: 2, pose: 'stand' })); }, { on: true });
  NK.walker(T, NK.who(1584, { tote: '#E9E1CC', hair: '#2B2420' }), [[35.6, 2], [35.6, 28]], 3.2, { phase: 0.4 });

  /* ---------------- sidewalk furniture ---------------- */
  for (const [x, y] of [[-34.5, -24], [-34.5, -6], [-34.5, 18], [-20, 34.5], [-4, 34.5], [10, 34.5]]) T.obj([x, y], (g) => NK.tree(g, x, y), { name: 'tree' });
  T.obj([34.5, -6], (g) => NK.hydrant(g, 34.5, -6), { name: 'hydrant' });
  T.obj([22, 35], (g) => NK.subway(g, 24, 34.4, 'x+', { w: 1.6, L: 5 }), { name: 'subway' });
  T.obj([34.6, -20], (g) => { NK.newsbox(g, 34.6, -21, '#E6C24F'); NK.newsbox(g, 34.6, -19.4, '#2F6DB5'); }, { name: 'news' });
  T.obj([-28, 35], (g) => NK.basket(g, -28, 35), { name: 'basket' });
  NK.corners(T);
});
