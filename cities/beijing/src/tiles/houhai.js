'use strict';
/* (-100,-100) Shichahai: Houhai lake, the bars, the Drum Tower.
   What it is: the lake fills the middle of the place, ringed by stone banks and weeping willows turning yellow. On
   the far shore a row of bars with roof terraces and strings of red lanterns face the water across a promenade. A
   little humped stone bridge (Yinding Qiao) crosses the lake's east arm. Behind it, the Drum Tower: a grey-brick
   podium pierced by arches carrying a red two-storey hall under a grey roof edged in green. Along the near shore a
   lane where the hutong pedicabs ride, and two courtyard houses.
   Who: drinkers at tables on the promenade, a guitarist singing at a bar door, an old man fishing from the near bank,
   couples on the bridge, pedicab drivers waiting by the Drum Tower with their red canopies, a tanghulu seller.
   What moves: paddle boats and a canopied tourist boat on the lake, ducks, pedicabs carrying tourists along the
   lane to the Drum Tower, walkers on the promenade and over the bridge, pigeons. */
SF.tile('houhai', -100, -100, { rim: 0 }, function (T) {
  const H = 37, PAVE = '#E2DDD1', WZ = -1.6;
  const LAKE = [[-37, -24], [5, -24], [8.6, -20], [8.2, -9], [14, -7], [14, 1.6], [6.4, 3.2], [1.6, 10.6], [-9, 14.6], [-37, 14.6]];
  T.ground(function (g) {
    K.slab(g, H, { top: PAVE });
    g.scuff(K.rect(-H, -H, H, H), { dir: -0.5, len: 3, c: '#EDE9E0', dens: 0.35, w: 0.45 });
    const W = LAKE.map((p) => [p[0], p[1], WZ]);
    g.fill(W, BC.lake); g.water(W, { dens: 0.9 });
    // bank faces where the land is beyond the water (they face us), land drawn over the water's edge where it is in front
    for (let i = 0; i < LAKE.length; i++) {
      const a = LAKE[i], b = LAKE[(i + 1) % LAKE.length], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); if (L < 0.1) continue;
      const nx = dy / L, ny = -dx / L;   // the outward normal (the land side) for an anticlockwise-in-screen ring
      if (Math.abs(a[0]) >= H - 0.01 && Math.abs(b[0]) >= H - 0.01) continue;
      if (nx + ny < 0) { g.fill([[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], WZ], [a[0], a[1], WZ]], nx < ny ? '#BDB6A6' : '#CFC8B8'); g.line([[a[0], a[1], 0], [b[0], b[1], 0]], { w: 0.6, c: '#8C8576', boil: false }); }
      else { g.fill([[a[0], a[1], 0], [b[0], b[1], 0], [b[0] + nx * 2, b[1] + ny * 2, 0], [a[0] + nx * 2, a[1] + ny * 2, 0]], PAVE); g.line([[a[0], a[1], 0], [b[0], b[1], 0]], { w: 0.6, c: '#8C8576', boil: false }); }
    }
    // the promenade along the far shore, the lake lane along the near shore, the lane to the Drum Tower
    g.fill(K.rect(-H, -27.4, 6, -24.6), '#D9D2C2'); g.fill(K.rect(-H, 15.8, 22, 20.6), BC.hutong); g.fill(K.rect(21, -16, 27, 20.6), BC.hutong);
    g.fill(K.rect(13, -16, 37, -6), '#DCD6C8');
  }, { rim: true });
  BJ.sidewalk(T, ['s', 'e'], { sp: 14, skip: { s: [[-6, 2], [18, 30]], e: [[-20, -2]] }, bikes: [['e', 8, 5]] });

  /* ---------------- the bars on the far shore ---------------- */
  const BARS = [[-36, -26, 'BAR', '#C9382E'], [-26, -16, 'LIVE MUSIC', '#3F5F8F'], [-15, -5, 'CAFE', '#5E8A6A'], [-4, 6, 'BAR', '#8E3A2C']];
  BARS.forEach(([x0, x1, word, col], i) => T.obj([x0, -36, x1, -28], function (g) {
    const y0 = -36, y1 = -28;
    BJ.shop(g, x0, y0, x1, y1, { front: 'L', col, lat: i % 2 ? '#8E3A2C' : '#5E6E8E', seed: 800 + i, goods: ['#E9B53C', '#F3E3B8', '#C9584B', '#5E8A6A'] });
    K.sign(g, 'L', y1 + 0.12, x0 + 1.4, x1 - 1.4, 5.9, 7.7, '#2A2420', word, { ink: '#F2C94C', c: '#C9A23A' });
    // a string of red lanterns along the eave
    const a = g.p(x0 + 0.4, y1 + 1.5, 5.0), b = g.p(x1 - 0.4, y1 + 1.5, 5.0);
    const pts = []; for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t) + 2.0 * 4 * t * (1 - t)]); } g.fine2(pts, { w: 0.25, c: '#4A4540' });
    for (let k = 1; k < 8; k += 2) TB_lantern2(g, [pts[k][0], pts[k][1] + 1.6], 1.0);
  }, { name: 'bar' }));
  // drinkers at tables on the promenade, the guitarist
  [[-31, -26.2, 800], [-20.6, -26.2, 804], [-9.8, -26.2, 808]].forEach(([x, y, s]) => T.cast([x, y], (g) => {
    BJ.person(g, x - 1.6, y, 1.2, BJ.who(s, { dir: 0, pose: 'sit' })); K.box(g, x - 2.1, y - 0.5, x - 1.1, y + 0.5, 0, 1.2, '#3A3530', { w: 0.3, boil: false });
    K.cyl(g, x, y, 0.9, 0, 2.2, { t: '#F3F1EA', l: '#E9E6DE', r: '#C9C6BD' }, { w: 0.4, n: 8 });
    const tp = g.p(x, y, 2.2); g.fill2([[tp[0] - 0.4, tp[1]], [tp[0] + 0.4, tp[1]], [tp[0] + 0.4, tp[1] - 1.6], [tp[0] - 0.4, tp[1] - 1.6]], '#E9B53C', true);
    K.box(g, x + 1.1, y - 0.5, x + 2.1, y + 0.5, 0, 1.2, '#3A3530', { w: 0.3, boil: false }); BJ.person(g, x + 1.6, y, 1.2, BJ.who(s + 1, { dir: 2, pose: 'sit' }));
  }, { on: false }));
  T.cast([1.6, -26.6], (g) => { const r = BJ.person(g, 1.6, -26.6, 0, BJ.who(812, { dir: 1, pose: 'hold', reach: [1.2, -7.4], hairStyle: 'long' })); const hd = r.hands[0]; g.fill2(K.curve([[hd[0] - 3.4, hd[1] - 1.6], [hd[0] + 0.4, hd[1] - 4.8], [hd[0] + 1.8, hd[1] - 3.2], [hd[0] - 1.8, hd[1] + 0.2]], 3, true), '#B8743A', true); g.segs2([hd[0] + 1, hd[1] - 4, hd[0] + 6, hd[1] - 8], '#5A4030', 0.5); }, { on: false });
  // willows along the far shore and round the lake
  [[-32, -24.6], [-21, -24.6], [-10, -24.6], [2, -23.6], [-30, 15.4], [-17, 15.4], [-3, 13.4], [4.6, 8.6]].forEach(([x, y], i) => T.obj([x, y], (g) => BJ.willow(g, x, y, { r: 3.6, h: 5.6, lean: i % 2 ? -1.6 : 1.6, seed: 40 + i }), { name: 'willow' }));

  /* ---------------- the Yinding bridge over the east arm ---------------- */
  const bz = (y) => { const t = clamp((y + 9.5) / 13, 0, 1); return 2.4 * Math.sin(Math.PI * t); };
  T.obj([9.4, -9.6, 13.2, 3.6], function (g) {
    const n = 12, L = [], R = [];
    for (let k = 0; k <= n; k++) { const y = -9.5 + 13 * k / n; L.push([9.6, y, bz(y)]); R.push([13, y, bz(y)]); }
    // the arch face seen from the east side (+x), then the deck, then the parapets
    const face = R.concat([[13, 3.5, WZ], [13, -9.5, WZ]]); g.fill(face, '#D3CDBF');
    const arch = []; for (let k = 0; k <= 10; k++) { const t = Math.PI * k / 10; arch.push([13.02, -3 + Math.cos(t) * 3.2, WZ + Math.sin(t) * 2.6]); } g.fill(arch, '#5E7A8A'); g.line(arch, { w: 0.5, boil: false });
    g.outline(face, { w: 0.7, boil: false });
    const deck = L.concat(R.slice().reverse()); g.fill(deck, '#EAE5D9'); g.outline(deck, { w: 0.6, boil: false });
    for (const xx of [9.7, 12.9]) { const segs = [], dots = []; for (let k = 0; k <= n; k++) { const y = -9.5 + 13 * k / n, a = g.p(xx, y, bz(y)), b = g.p(xx, y, bz(y) + 1.0); segs.push(a[0], a[1], b[0], b[1]); dots.push(b); } for (let k = 0; k < n; k++) segs.push(dots[k][0], dots[k][1] + 0.6, dots[k + 1][0], dots[k + 1][1] + 0.6); g.segs2(segs, '#A9A394', 0.45); for (const d of dots) g.disc2([d[0], d[1] - 0.3], 0.36, '#F7F5EF'); }
  }, { name: 'bridge' });
  K.walker(T, BJ.who(820), [[11.3, -11], [11.3, 5]], 0.8, { phase: 0.2, z: (x, y) => bz(y) });
  K.walker(T, BJ.who(821, { dress: '#C9584B' }), [[10.6, 5], [10.6, -11]], 0.7, { phase: 0.6, z: (x, y) => bz(y) });

  /* ---------------- the Drum Tower ---------------- */
  T.obj([15, -35, 33, -19], function (g) {
    g.boilP = 0.25;
    K.box(g, 15, -35, 33, -19, 0, 9, { t: '#A9A69E', l: '#B4B1A9', r: '#9E9B93' }, { w: 1 });
    const segs = []; for (const [f, p, a0, a1] of [['L', -19, 15, 33], ['R', 33, -35, -19]]) for (let z = 0.6; z < 9; z += 0.6) { const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z)); segs.push(a[0], a[1], b[0], b[1]); } g.segs2(segs, '#97948C', 0.2);
    for (const x of [19, 24, 29]) { const pts = [K.pt('L', -18.97, x - 1.6, 0)]; for (let k = 0; k <= 10; k++) { const t = Math.PI * k / 10; pts.push(K.pt('L', -18.97, x - 1.6 * Math.cos(t), 3.6 + 1.6 * Math.sin(t))); } pts.push(K.pt('L', -18.97, x + 1.6, 0)); g.fill(pts, '#3A3530'); g.line(pts, { w: 0.5, boil: false }); }
    BJ.rail(g, 15.3, -34.7, 32.7, -19.3, 9, { h: 0.8, back: true });
    BJ.hallBody(g, 17, -33, 31, -21, 9, 14.6, { bx: 5, by: 4 });
    BJ.roof(g, 17, -33, 31, -21, 14.6, 3.2, { type: 'hip', col: '#7E8A86', top: 0.42, over: 1.8, lift: 0.6, c: '#3E5A4E' });
    BJ.hallBody(g, 18, -32, 30, -22, 15.6, 19.0, { bx: 5, by: 4, doors: false });
    BJ.roof(g, 18, -32, 30, -22, 19.0, 5.6, { type: 'xie', col: '#7E8A86', over: 1.8, lift: 0.8, c: '#3E5A4E', rc: '#3E6E4E', gcol: '#A8382E' });
  }, { name: 'drum tower' });
  // the pedicab rank and the tanghulu seller in front of the tower
  T.cast([18, -12], (g) => { for (const [x, y] of [[16.4, -12.6], [16.4, -8.6]]) g.at(x, y, 0, (g2) => BJ.pedicab(g2, 0, { riders: [], seed: 830 + x })); }, { on: false });
  T.cast([31, -11], (g) => {
    const r = BJ.person(g, 31, -11, 0, BJ.who(833, { old: true, dir: 1, pose: 'hold', reach: [0.4, -6], cap: '#5A5A55' }));
    const hd = r.hands[0], top = [hd[0] + 0.3, hd[1] - 12]; g.segs2([hd[0], hd[1] + 6, top[0], top[1]], '#B9A27D', 0.6);
    g.fill2(arcPts(top[0], top[1] + 2.4, 2.6, 0, TAU, 12).map((q) => [q[0], top[1] + 2.4 + (q[1] - top[1] - 2.4) * 1.1]), '#E9D9A8', true);
    for (let k = 0; k < 14; k++) { const a = k / 14 * TAU, p = [top[0] + Math.cos(a) * 3.1, top[1] + 2.4 + Math.sin(a) * 3.2]; g.segs2([top[0], top[1] + 2.4, p[0], p[1]], '#C9A26B', 0.25); for (let j = 1; j <= 3; j++) g.disc2([lerp(top[0], p[0], 0.45 + j * 0.18), lerp(top[1] + 2.4, p[1], 0.45 + j * 0.18)], 0.55, '#D2342A'); }
    BJ.person(g, 29.2, -9.4, 0, BJ.kid(834, { dir: 0, tanghulu: true }));
  }, { on: false });

  /* ---------------- the near shore: courtyard houses, the fisherman ---------------- */
  BJ.court(T, { x0: -35, y0: 21.4, x1: -10, y1: 35, gate: 'S', ga: -14, east: 'wing', nd: 6.4, sd: 5.4 });
  BJ.court(T, { x0: -7, y0: 21.4, x1: 19.6, y1: 35, gate: 'E', ga: 24, east: 'wall', nd: 6.4, sd: 5.4 });
  T.obj([27.6, -4, 34.4, 33], function (g) {
    BJ.wing(g, 27.6, -4, 34.4, 14, { front: 'R', h: 5.6, rh: 3.0 });
    BJ.wing(g, 27.6, 15, 34.4, 33, { front: 'R', h: 5.6, rh: 3.0 });
    BJ.sign(g, 'R', 34.4, 1, 8, 4.0, 5.4, '#9E2E24', '饺子', { ink: '#F2C94C' });
    BJ.sign(g, 'R', 34.4, 20, 27, 4.0, 5.4, '#3F2A20', '茶', { ink: '#E9C55A' });
  }, { name: 'shops' });
  T.cast([-22, 16.4], (g) => { const r = BJ.person(g, -22, 16.4, 0, BJ.who(840, { old: true, dir: 3, pose: 'sit', cap: '#5A5A55' })); K.box(g, -22.5, 15.9, -21.5, 16.9, 0, 1.0, '#5E8A6A', { w: 0.3, boil: false }); void r; const h = g.p(-22, 16.4, 4.4), tip = g.p(-26, 8, 9); g.segs2([h[0], h[1], tip[0], tip[1]], '#5A4A3C', 0.35); const fl = g.p(-26, 8, WZ); g.fine2([tip, fl], { w: 0.15, c: '#8C8576' }); g.disc2(fl, 0.4, '#E0503E'); }, { on: false });

  /* ---------------- the lake's life ---------------- */
  // paddle boats on loops, a canopied tourist boat, ducks
  [[-20, -7, 10, 4, 0.18, '#F3F1EA', 850], [-4, -4, 4.5, 3, -0.3, '#5F8FC9', 852], [-8, -17, 6, 2.6, 0.24, '#E6C24F', 854]].forEach(([cx, cy, rx, ry, w, col, s], i) => T.actor({ sample: 0.3, period: TAU / Math.abs(w), grow: false,
    at(t) { const a = t * w + i * 2.1, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry, ang = Math.atan2(Math.cos(a) * ry * Math.sign(w), -Math.sin(a) * rx * Math.sign(w)), q = Math.round(ang / (TAU / 24)); return { x, y, z: WZ, key: 'b' + (((q % 24) + 24) % 24), ang: q * TAU / 24 }; },
    draw(g, st) {
      K.boat(g, st.ang, { kind: 'motor', L: 2.6, W: 1.4, hull: col, stripe: '#C9382E' });
      const ca = Math.cos(st.ang), sa = Math.sin(st.ang), d = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2);
      for (const v of [-0.55, 0.55]) BJ.person(g, -0.3 * ca - v * sa, -0.3 * sa + v * ca, 0.7, BJ.who(s + (v > 0 ? 1 : 0), { dir: d, pose: 'sit', noLegs: true, k: 0.9 }));
      const roof = K.rbox(g, -0.3 * ca, -0.3 * sa, 1.6, 1.3, st.ang, 4.6, 4.9, { t: shade(col, -0.1), l: col, r: shade(col, 0.15) }, { w: 0.45 }); void roof;
    } }));
  T.actor({ sample: 0.3, period: TAU / 0.09, grow: false,
    at(t) { const a = t * 0.09 + 1, x = -18 + Math.cos(a) * 12, y = 7.5 + Math.sin(a) * 3.6, ang = Math.atan2(Math.cos(a) * 3.6, -Math.sin(a) * 12), q = Math.round(ang / (TAU / 32)); return { x, y, z: WZ, key: 'g' + (((q % 32) + 32) % 32), ang: q * TAU / 32 }; },
    draw(g, st) {
      const ca = Math.cos(st.ang), sa = Math.sin(st.ang);
      K.boat(g, st.ang, { kind: 'row', L: 5.6, W: 1.9, hull: '#8A5A3A' });
      const d = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2);
      for (const u of [-1.8, 0, 1.8]) BJ.person(g, u * ca, u * sa, 0.9, BJ.tourist(860 + Math.round(u), '#E85A3A', { dir: d, pose: 'sit', noLegs: true, k: 0.9 }));
      const posts = []; for (const u of [-3.4, 3.4]) for (const v of [-1.5, 1.5]) { const a = g.p(u * ca - v * sa, u * sa + v * ca, 1.2), b = g.p(u * ca - v * sa, u * sa + v * ca, 5.6); posts.push(a[0], a[1], b[0], b[1]); } g.segs2(posts, '#A8382E', 0.7);
      K.rbox(g, 0, 0, 4.0, 2.0, st.ang, 5.6, 6.2, { t: '#C9A26B', l: '#A8382E', r: '#8E2E26' }, { w: 0.55 });
    } });
  T.actor({ sample: 0.3, period: TAU / 0.3, grow: false,
    at(t) { const a = -t * 0.3, x = -28 + Math.cos(a) * 4, y = -17 + Math.sin(a) * 2.4, q = Math.round(Math.atan2(-Math.cos(a), Math.sin(a)) / (TAU / 8)); return { x, y, z: WZ, key: 'd' + ((q % 8) + 8) % 8, q }; },
    draw(g, st) { const fl = (((st.q % 8) + 8) % 8) < 4 ? 1 : -1; for (let k = 0; k < 3; k++) { const o = g.p(0, 0, 0), c = [o[0] - fl * k * 4.2, o[1] + k * 1.6]; g.fill2([[c[0] - 1.4, c[1]], [c[0] + 1.2, c[1] - 0.2], [c[0] + 1.4, c[1] - 1.2], [c[0] - 1.2, c[1] - 1.0]], k ? '#B59A6E' : '#5E7A4E', true); g.disc2([c[0] + fl * 1.3, c[1] - 1.6], 0.65, k ? '#8E6E4A' : '#2E6E4E'); g.fill2([[c[0] + fl * 1.9, c[1] - 1.7], [c[0] + fl * 2.6, c[1] - 1.5], [c[0] + fl * 1.9, c[1] - 1.3]], '#E9B53C', true); } } });

  /* ---------------- walkers and pedicabs ---------------- */
  K.walker(T, BJ.who(870), [[-35, -25.6], [4, -25.6]], 1.0, { phase: 0.1 });
  K.walker(T, BJ.who(871), [[4, -26.8], [-35, -26.8]], 1.1, { phase: 0.5 });
  K.walker(T, BJ.who(872, { old: true }), [[-35, 16.8], [20, 16.8]], 0.9, { phase: 0.3 });
  // pedicab tours: in from the map's west edge along the lake lane, up the lane to the Drum Tower (fading out there)
  const ROUTE = [[-40, 19.2], [23.0, 19.2], [23.0, -14]], segL = [63, 33.2], TOT = 96.2, PV = 3.0;
  for (let k = 0; k < 2; k++) T.actor({ sample: 0.3, period: (TOT + 30) / PV,
    at(t) { const d = ((t * PV + k * (TOT + 30) / 2) % (TOT + 30) + (TOT + 30)) % (TOT + 30); if (d > TOT) return null; const a = Math.min(1, d / 6, (TOT - d) / 6); if (a <= 0.03) return null; const first = d < segL[0], x = first ? ROUTE[0][0] + d : 23.0, y = first ? 19.2 : 19.2 - (d - segL[0]), ang = first ? 0 : -Math.PI / 2; return { x, y, key: first ? 'e' : 'n', ang, alpha: a < 1 ? a : null }; },
    draw(g, st) { BJ.pedicab(g, st.ang, { riders: [BJ.tourist(880 + k * 2, '#F2C230'), BJ.tourist(881 + k * 2, '#F2C230')], seed: 885 + k }); } });
});
