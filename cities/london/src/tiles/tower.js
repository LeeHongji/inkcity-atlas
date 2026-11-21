'use strict';
/* (0,0) The Tower of London. What it is: a concentric castle on the north bank beside Tower Bridge. The White Tower,
   the Norman keep of pale ragstone, stands in the middle: a tall box with pilaster strips and small round-headed
   windows, three square corner turrets with ogee lead cupolas and weather vanes and one round turret, a timber stair
   up to its door. Round it the inner curtain wall with its towers (Beauchamp, Bell, Wakefield, Salt, Martin, Devereux),
   the outer wall with round bastions at the corners, the dry moat as a ring of lawn, and on the river side Tower Wharf
   with its old cannons and St Thomas's Tower over Traitors' Gate. Inside: Tower Green, the Chapel Royal, the long
   Waterloo Block where the Crown Jewels are, guarded by a sentry in a bearskin.
   Who is there: a Yeoman Warder in his Tudor bonnet holding a tour group spellbound on the Green; the queue for the
   Crown Jewels; the ravens and the Ravenmaster; children on the cannons; mudlarks searching Tower Beach at low tide;
   visitors on Water Lane and the wharf, a few umbrellas still up.
   What moves: ravens hopping, walkers, the Union flag on the White Tower. */
SF.tile('tower', 0, 0, { rim: 22 }, function (T) {
  const H = 37, RN = LT.RIV.N - 1.2, STONE = '#D8D1C0', WHITE = '#E9E4D8', GRASS = '#A6C97C';
  T.ground(function (g) {
    LK.ground(g, -H, -H, H, RN, '#E2DED3');
    // the moat: a ring of lawn on the three land sides
    K.lawn(g, -34, -34, 34, 16, { col: GRASS, dens: 0.7 });
    g.fill(K.rect(-30, -30, 30, 13.5), '#D9D2C2');                // the outer ward's gravel inside the moat
    // Tower Wharf along the river: big paving slabs, the river parapet is an object
    LK.paving(g, -H, 19.5, H, RN, { step: 2.8, col: '#E4E0D6' });
    // inner ward: Tower Green, the parade ground, paths
    g.fill(K.rect(-19.5, -19.5, 19.5, 9.5), '#E3DCCB');
    K.lawn(g, -17, -12, -9, 6, { col: GRASS, dens: 0.8 });
    g.scuff(K.rect(-19.5, -19.5, 19.5, 9.5), { dir: -0.5, len: 2, c: '#EFE9DC', dens: 0.6, w: 0.5 });
    // Water Lane between the walls on the south, the west entrance causeway over the moat
    g.fill(K.rect(-25, 12.5, 25, 16.5), '#DCD5C5');
    g.fill(K.rect(-H, 9, -27, 15), '#DCD5C5'); g.outline(K.rect(-H, 9, -27, 15), { w: 0.4, c: '#A9A193', boil: false });
    for (const [x, y, rx, ry] of [[-31, 12, 1.2, 0.8], [20, 24, 2.2, 1.0], [-14, 23.5, 1.6, 0.9], [8, -4 + 20, 1.0, 0.6], [-5, 14.6, 1.4, 0.7]]) LK.puddle(g, x, y, rx, ry, Math.round(x * 7 + y));
    // the glass memorial on the Green
    { const c = g.p(-13, -9, 0.05); g.fill2(arcPts(c[0], c[1], 3.2, 0, TAU, 14).map((q) => [q[0], c[1] + (q[1] - c[1]) * 0.55]), '#CFE0E8', true); g.ring2(c, 0.01, { w: 0.01 }); }
  }, { rim: true });

  /* ---------------- the outer wall, its bastions, St Thomas's Tower ---------------- */
  const wall = (x0, y0, x1, y1, h) => T.obj([x0, y0, x1, y1], (g) => LK.keep(g, x0, y0, x1, y1, h, STONE, { w: 0.7 }), { name: 'wall' });
  wall(-27, -27, -25, -4); wall(-27, -4, -25, 17); wall(-25, -27, 0, -25); wall(0, -27, 25, -25); wall(25, -25, 27, -4); wall(25, -4, 27, 17);
  wall(-25, 17, -14, 19); wall(-14, 17, -6.5, 19); wall(3, 17, 14, 19); wall(14, 17, 25, 19);
  for (const [x, y] of [[-26, -26], [26, -26], [-26, 18], [26, 18]]) T.obj([x - 3, y - 3, x + 3, y + 3], (g) => LK.roundTower(g, x, y, 2.9, 4.4, STONE), { name: 'bastion' });
  // St Thomas's Tower over Traitors' Gate: a building on the wall with a dark water arch facing the wharf
  T.obj([-6.5, 15.5, 3, 20.5], (g) => {
    LK.keep(g, -6.5, 15.5, 3, 20.5, 6.2, STONE, { battle: false });
    const arch = [K.pt('L', 20.52, -4.6, 0)]; for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10; arch.push(K.pt('L', 20.52, -1.6 - 3 * Math.cos(t), 2.0 + 2.3 * Math.sin(t))); } arch.push(K.pt('L', 20.52, 1.4, 0));
    g.fill(arch, '#3A3C3A'); const pc = []; for (let x = -4.2; x < 1.2; x += 0.75) { const a = g.p(x, 20.55, 0.2), b = g.p(x, 20.55, 3.9); pc.push(a[0], a[1], b[0], b[1]); } g.segs2(pc, '#1E1C1A', 0.4); g.line(arch, { w: 0.7, boil: false });
    for (const x of [-5.4, 2.2]) K.win(g, 'L', 20.52, x - 0.4, x + 0.4, 3.8, 5.4, { style: 'dark', arch: true, col: '#4A4E58', w: 0.3 });
    K.hip(g, -6.7, 15.3, 3.2, 20.7, 6.2, 2.0, LK.C.slate, { ridge: 5, c: '#4A515C', w: 0.6 });
    for (const x of [-6.0, 2.5]) { K.cyl(g, x, 20.0, 0.9, 0, 8.2, { t: '#CFC8B6', l: STONE, r: shade(STONE, 0.15) }, { w: 0.55, n: 8 }); K.cone(g, x, 20.0, 1.05, 8.2, 1.6, LK.C.lead); }
  }, { name: 'st thomas' });

  /* ---------------- the inner wall and its towers ---------------- */
  const iw = (x0, y0, x1, y1) => T.obj([x0, y0, x1, y1], (g) => LK.keep(g, x0, y0, x1, y1, 4.6, STONE, { w: 0.7 }), { name: 'inner wall' });
  iw(-20.5, -20.5, -19, -8); iw(-20.5, -1, -19, 11); iw(-19, -20.5, 0, -19); iw(0, -20.5, 19, -19); iw(19, -19, 20.5, -6); iw(19, 0, 20.5, 11); iw(-19, 11, -12, 12.5); iw(-6, 11, 2, 12.5); iw(6, 11, 19, 12.5);
  T.obj([-22, -8, -17.5, -1], (g) => { LK.keep(g, -22, -8, -17.5, -1, 6.6, STONE); for (const y of [-6, -3]) K.win(g, 'R', -17.48, y - 0.5, y + 0.5, 2.6, 4.4, { style: 'dark', arch: true, col: '#4A4E58', w: 0.3 }); }, { name: 'beauchamp' });
  T.obj([17.5, -6, 22, 0], (g) => { LK.keep(g, 17.5, -6, 22, 0, 6.2, STONE); }, { name: 'constable' });
  for (const [x, y, r, h] of [[-19.8, -19.8, 2.3, 6.0], [19.8, -19.8, 2.3, 6.4], [-19.8, 11.8, 2.4, 6.0], [19.8, 11.8, 2.4, 6.2], [-9, 11.8, 2.8, 6.8]]) T.obj([x - r, y - r, x + r, y + r], (g) => LK.roundTower(g, x, y, r, h, STONE), { name: 'round tower' });
  // the Bloody Tower gateway into the inner ward
  T.obj([2, 10.5, 6, 13], (g) => { LK.keep(g, 2, 10.5, 6, 13, 7.0, STONE); const a = [K.pt('L', 13.02, 2.8, 0)]; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; a.push(K.pt('L', 13.02, 4 - 1.2 * Math.cos(t), 2.6 + 1.2 * Math.sin(t))); } a.push(K.pt('L', 13.02, 5.2, 0)); g.fill(a, '#4A4640'); }, { name: 'bloody tower' });

  /* ---------------- inside: the White Tower, the Waterloo Block, the chapel ---------------- */
  T.obj([-7.5, -11, 7.5, 3.6], function (g) {
    g.boilP = 0.3;
    const x0 = -6.5, y0 = -10, x1 = 6.5, y1 = 1, h = 11.5, tone = { t: '#D6D0C2', l: WHITE, r: '#CFC9BB' };
    K.box(g, x0, y0, x1, y1, 0, h, tone, { w: 0.95 });
    // pilaster strips and rows of small round-headed windows
    const pl = []; for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) { const n = 4; for (let i = 1; i < n; i++) { const a = lerp(a0, a1, i / n), b = g.p.apply(g, K.pt(f, p + 0.03, a, 0.3)), t = g.p.apply(g, K.pt(f, p + 0.03, a, h)); pl.push(b[0], b[1], t[0], t[1]); }
      for (let i = 0; i < n; i++) for (const [z0, z1] of [[2.6, 4.0], [5.6, 7.2], [8.6, 10.0]]) { const m = lerp(a0, a1, (i + 0.5) / n); K.win(g, f, p + 0.03, m - 0.38, m + 0.38, z0, z1, { style: 'dark', arch: true, col: '#4E5258', w: 0.3, line: false }); } }
    g.segs2(pl, '#B9B2A2', 0.5);
    LK.battle(g, x0, y0, x1, y1, h, WHITE, { mw: 0.7, st: 1.4 });
    // the timber forebuilding stair up the south face
    // the timber stair climbing the south face to the first-floor door, a little roofed porch at the top
    const W2 = 2.3; g.fill(K.on('L', 1.04, -6.2, -4.6, 3.6, 6.2), '#4E5258');
    g.fill([[-0.2, 1, 0], [-0.2, W2 + 1, 0], [-4.8, W2 + 1, 3.6], [-4.8, 1, 3.6]], '#A9855C');
    const tr = []; for (let i = 1; i < 10; i++) { const x = lerp(-0.2, -4.8, i / 10), z = 3.6 * i / 10, a = g.p(x, 1, z), b = g.p(x, W2 + 1, z); tr.push(a[0], a[1], b[0], b[1]); } g.segs2(tr, '#7E6044', 0.35);
    g.fill([[-0.2, W2 + 1, 0], [-4.8, W2 + 1, 3.6], [-4.8, W2 + 1, 2.8], [-1.2, W2 + 1, 0]], '#8E6E4C');
    g.line([[-0.2, W2 + 1, 1.4], [-4.8, W2 + 1, 5.0]], { w: 0.5, c: '#5A4232', boil: false }); const ps = []; for (let i = 0; i <= 4; i++) { const x = lerp(-0.2, -4.8, i / 4), z = 3.6 * i / 4, a = g.p(x, W2 + 1, z), b = g.p(x, W2 + 1, z + 1.4); ps.push(a[0], a[1], b[0], b[1]); } g.segs2(ps, '#5A4232', 0.4);
    K.box(g, -6.6, 1, -4.8, W2 + 1, 3.6, 3.8, '#A9855C', { w: 0.4, nohid: true }); K.gable(g, -6.8, 1, -4.6, W2 + 1.2, 6.4, 1.2, 'y', { a: '#7A5A3C', b: '#6A4A30', e: '#A9855C' }, { w: 0.45 });
    for (const x of [-6.5, -4.9]) { const a = g.p(x, W2 + 1.1, 3.8), b = g.p(x, W2 + 1.1, 6.4); g.line2([a, b], { w: 0.5, c: '#5A4232', boil: false, ext: 0 }); }
    // the four turrets: three square with ogee cupolas, one round (north-east)
    const sq = (x, y) => { K.box(g, x - 1.4, y - 1.4, x + 1.4, y + 1.4, h, h + 2.8, tone, { w: 0.7, nohid: true }); LK.cupola(g, x, y, h + 2.8, 1.45); };
    sq(x0 + 0.6, y0 + 0.6);
    K.cyl(g, x1 - 0.4, y0 + 0.4, 1.5, h, h + 3.0, tone, { w: 0.7, n: 10 }); LK.cupola(g, x1 - 0.4, y0 + 0.4, h + 3.0, 1.5);
    sq(x0 + 0.6, y1 - 0.6); sq(x1 - 0.6, y1 - 0.6);
    LK.pole(g, x1 - 0.4, y0 + 0.4, h + 3.0, 6.5);
  }, { name: 'white tower' });
  LK.flag(T, 6.1, -9.6, 11.5 + 3.0 + 6.5, { L: 3.6, H: 2.0, ph: 0.2 });
  T.obj([-2, -18.5, 17.5, -14.5], (g) => {
    K.box(g, -2, -18.5, 17.5, -14.5, 0, 6.2, { t: '#C9C2B0', l: '#DAD3C2', r: '#C3BBA8' }, { w: 0.8 });
    for (let x = -0.6; x < 17; x += 2.6) { if (x > 5.5 && x < 9.5) continue; K.win(g, 'L', -14.48, x, x + 1.0, 1.6, 3.4, { style: 'navy' }); K.win(g, 'L', -14.48, x, x + 1.0, 4.0, 5.4, { style: 'navy' }); }
    g.fill(K.on('L', -14.46, 6.6, 8.8, 0, 3.4), '#3A3833'); g.fill(K.on('L', -14.44, 6.2, 9.2, 3.6, 4.4), '#C8372D');
    K.gable(g, -2.3, -18.8, 17.8, -14.2, 6.2, 2.0, 'x', { a: LK.C.slate, b: LK.C.slateD, e: '#DAD3C2' }, { w: 0.65, c: '#4A515C' });
  }, { name: 'waterloo block' });
  T.obj([-18, -18, -13, -14.5], (g) => { K.box(g, -18, -18, -13, -14.5, 0, 4.4, { t: '#C2B8A2', l: '#D0C5AE', r: '#B9AE96' }, { w: 0.7 }); K.win(g, 'L', -14.48, -16.6, -15.6, 1.2, 3.4, { style: 'dark', arch: 'gothic', col: '#4E5258', w: 0.35 }); K.gable(g, -18.2, -18.2, -12.8, -14.3, 4.4, 2.2, 'x', { a: LK.C.slate, b: LK.C.slateD, e: '#D0C5AE' }, { w: 0.6 }); K.box(g, -18.6, -17.6, -16.4, -15.4, 0, 7.4, { t: '#C2B8A2', l: '#D0C5AE', r: '#B9AE96' }, { w: 0.6 }); LK.battle(g, -18.6, -17.6, -16.4, -15.4, 7.4, '#D0C5AE', { mw: 0.5, st: 1.0, mh: 0.6 }); }, { name: 'chapel' });
  // the sentry box and the guardsman at the Jewel House door
  T.obj([4.0, -14.2, 5.8, -12.6], (g) => { K.box(g, 4.0, -14.2, 5.8, -12.6, 0, 7.6, { t: '#2E3A33', l: '#3E4E44', r: '#2E3A33' }, { w: 0.55 }); g.fill(K.on('L', -12.58, 4.3, 5.5, 0, 6.6), '#2A2622'); K.gable(g, 3.8, -14.4, 6.0, -12.4, 7.6, 1.2, 'x', '#2E3A33', { w: 0.5 }); LK.person(g, 4.9, -12.9, 0, LK.guard(41, { dir: 1, rifle: false })); }, { name: 'sentry box' });

  /* ---------------- the wharf: river parapet, cannons, lamps ---------------- */
  for (let x = -H; x < H - 0.1; x += 18.5) { const x1 = Math.min(H, x + 18.5); T.obj([x, RN - 0.7, x1, RN], (g) => { K.box(g, x, RN - 0.7, x1, RN, 0, 1.3, { t: '#D9D4C8', l: '#CFC9BB', r: '#BDB6A6' }, { w: 0.55, boil: false }); }, { name: 'parapet' }); }
  for (const x of [-22, -16, 9, 15, 21]) T.obj([x - 0.9, 23.3, x + 0.9, 26.1], (g) => LK.cannon(g, x, 24.6), { name: 'cannon' });
  for (const x of [-30, -2, 27]) T.obj([x, 26.8], (g) => LK.lamp(g, x, 26.8, { h: 8.6 }), { name: 'lamp' });
  for (const [x, y] of [[-31, 21.5], [31, 21.5]]) T.obj([x, y], (g) => LK.plane(g, x, y, { r: 5.0 }), { name: 'plane' });
  for (const [x, y] of [[-34.5, -20], [-34.5, -6], [34.5, -14], [-20, -34.5], [6, -34.5], [22, -34.5]]) T.obj([x, y], (g) => LK.plane(g, x, y, { r: 4.4, h: 5.6 }), { name: 'tree' });
  T.obj([33.5, 24.5], (g) => LK.pillar(g, 33.5, 24.5), { name: 'pillar box' });

  /* ---------------- the living layer ---------------- */
  // the Yeoman Warder and his tour group on the Green
  T.cast([-11.5, -3], (g) => {
    const grp = [[-14.2, -5.6], [-13.0, -6.4], [-15.4, -4.0], [-12.6, -4.4], [-14.0, -2.8], [-15.6, -6.6], [-12.0, -6.8], [-16.2, -2.4]];
    grp.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])).forEach(([x, y], i) => LK.person(g, x, y, 0, LK.tourist(1100 + i, { dir: 0, pose: i % 3 === 1 ? 'hold' : 'stand', phone: i % 3 === 1 })));
    LK.person(g, -10.2, -3.0, 0, LK.beefeater(11, { dir: 1, pose: 'wave', ph: 0.25 }));
  }, { on: true });
  // the queue for the Crown Jewels along the Waterloo Block
  T.cast([13, -12.4], (g) => { for (let i = 0; i < 8; i++) { const x = 8.6 + i * 1.5, y = -12.9 + (i % 2) * 0.4; LK.person(g, x, y, 0, (i % 4 === 2 ? LK.tourist : LK.who)(1200 + i, { dir: 2, pose: i % 5 === 3 ? 'hold' : 'stand', phone: i % 5 === 3, k: i === 6 ? 0.75 : undefined })); } }, { on: true });
  // the Ravenmaster with a bucket, ravens on the Green
  T.cast([-8.6, 4.4], (g) => { const r = LK.person(g, -8.6, 4.4, 0, LK.beefeater(12, { dir: 2, pose: 'hold' })); const h = r.hands[0]; g.fill2([[h[0] - 1.0, h[1]], [h[0] + 1.0, h[1]], [h[0] + 0.8, h[1] + 1.8], [h[0] - 0.8, h[1] + 1.8]], '#8E979E', true); }, { on: true });
  [[-11.6, 3.2, 0], [-13.4, 1.0, 1], [-10.4, 0.6, 2], [-15.2, 4.0, 3]].forEach(([x, y, i]) => T.actor({ sample: 5, period: 10,
    at(t) { const c = (t * 0.9 + i * 0.37) % 4, hop = c > 3.2 ? Math.sin((c - 3.2) / 0.8 * Math.PI) : 0, peck = c > 1.2 && c < 1.8, dx = Math.floor((t * 0.9 + i * 0.37) / 4) % 2 ? 1 : -1; return { x: x + dx * 0.6 * Math.min(1, Math.max(0, c - 3.2) / 0.8), y, key: (hop > 0 ? 'h' + Math.round(hop * 3) : peck ? 'p' : 's') + dx, hop, peck, dx }; },
    draw(g, st) { LK.raven2(g, g.p(0, 0, 0), st.dx, st.hop * 2.2, st.peck); } }));
  // children on the cannons, a family watching the river
  T.cast([-16, 24.6], (g) => { LK.person(g, -16.4, 24.0, 1.1, LK.who(1301, { dir: 1, k: 0.72, pose: 'cheer', ph: 0.2 })); LK.person(g, -14.6, 25.8, 0, LK.who(1302, { dir: 2, umb: '#E6C24F' })); }, { on: true });
  T.cast([4, 27], (g) => { LK.person(g, 3.2, 27.2, 0, LK.who(1303, { dir: 2 })); LK.person(g, 4.6, 27.4, 0, LK.who(1304, { dir: 2, k: 0.75 })); LK.person(g, 5.8, 27.2, 0, LK.who(1305, { dir: 2, pose: 'hold', phone: true })); }, { on: true });
  // mudlarks on Tower Beach below the wharf, searching the foreshore
  T.cast([-12, 31.4], (g) => { LK.person(g, -13, 31.3, LT.RIV.WL, LK.who(1306, { dir: 1, pose: 'kneel', top: '#3F6B4E', bot: '#2F343B', hands: [[2.6, -3.0], [1.4, -2.6]] })); const r = LK.person(g, -9.5, 31.6, LT.RIV.WL, LK.who(1307, { dir: 0, pose: 'crouch', top: '#C9B48A' })); void r; const b = g.p(-11.2, 31.9, LT.RIV.WL); g.fill2([[b[0] - 1, b[1]], [b[0] + 1, b[1]], [b[0] + 0.8, b[1] - 1.8], [b[0] - 0.8, b[1] - 1.8]], '#E6C24F', true); }, { on: true });
  // walkers on the wharf and on Water Lane
  LK.walker(T, LK.who(1310, { umb: '#C8372D' }), [[-34, 22.4], [34, 22.4]], 1.4, { phase: 0.1 });
  LK.walker(T, LK.tourist(1311), [[34, 21.0], [-34, 21.0]], 1.6, { phase: 0.5 });
  LK.walker(T, LK.who(1312), [[-34, 27.2], [34, 27.2]], 1.3, { phase: 0.7 });
  LK.walker(T, LK.tourist(1313), [[-23, 14.4], [23, 14.4]], 1.5, { phase: 0.3 });
  LK.walker(T, LK.beefeater(13), [[22, 15.2], [-22, 15.2]], 1.2, { phase: 0.6 });
  LK.walker(T, LK.tourist(1314), [[-35, 12], [-28, 12], [-28, 14.6], [-35, 14.6]], 1.3, { phase: 0.2 });
  LK.walker(T, LK.who(1315), [[7, -6], [16, -6], [16, 7], [7, 7]], 1.2, { phase: 0.4 });
  LK.walker(T, LK.tourist(1316), [[-2, 6], [16, 6]], 1.5, { phase: 0.8 });
});
