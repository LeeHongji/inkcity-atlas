'use strict';
/* (100,100) Chaotianmen: the tip of the peninsula, where the Jialing meets the Yangtze.
   What it is: the Raffles City "sails" (a row of glass towers curving like masts, the Crystal lying across their tops
   as a horizontal glass tube) on a mall podium; in front of them the old Chaotianmen square, and at the very tip the
   viewing square raised on a stone podium (z 8) over the confluence, its walls dropping 13 u to the water, wide steps
   down to the cruise-ship pontoon. Both riverside roads end in tunnels under the square.
   Levels: the tile at z 0; the tip square a stone podium (z 8) reached by a flight from the old square; the steps down
   its river face to a pontoon at the water (z -5).
   Who: a tour group following a guide's flag, people at the tip's rail looking at the two colours of water, a porter
   carrying a suitcase down to the ship, crew on the pontoon, kids flying a kite, tai chi in the old square.
   Moving: walkers on the square, the porter's trip, passengers boarding, the cruise ship's flag.
   Depth: the Raffles towers stand 30 u in from the street behind them, so its cars never pass behind them. */
SF.tile('chaotianmen', 100, 100, { rim: 38 }, function (T) {
  const H = 37, P0 = 26, P1 = 60, PZ = 8, WL = CQS.WL, GL = { t: '#D6E2E6', l: '#B9CDD6', r: '#9DB3BF' };

  T.ground(function (g) {
    K.slab(g, H, { top: '#E0D6C2' });
    g.fill(K.rect(-4, -16, 26, 26), '#DAD2C2'); CQ.paving(g, -4, -16, 26, 26, 0, { dens: 0.5 });
    // a compass rose of dark stone in the old square
    const c = g.p(8, 10, 0); g.fill2(arcPts(c[0], c[1], 14, 0, TAU, 20).map((p) => [p[0], c[1] + (p[1] - c[1]) * 0.55]), '#C7BCA8', true); g.line2(arcPts(c[0], c[1], 14, 0, TAU, 20).map((p) => [p[0], c[1] + (p[1] - c[1]) * 0.55]), { w: 0.4, c: '#9C9077', close: true, boil: false });
  }, { rim: true });

  /* ---- the Raffles sails on their mall podium ---- */
  T.obj([-26, -16, -6, 30], (g) => {
    K.box(g, -26, -16, -6, 30, 0, 6, { t: '#C9D3C9', l: '#DCD8CC', r: '#C4C0B4' }, { w: 0.8 });
    g.fill(K.on('R', -5.97, -14, 28, 0.3, 4.4), '#56606A'); g.mark({ nc: '#F7D08A', spill: true }); for (let y = -12; y < 28; y += 3) g.fine([[-5.95, y, 0.3], [-5.95, y, 4.4]], { w: 0.3, c: '#9A958A' });
    CQH.sign(g, 'R', -5.9, -2, 10, 4.5, 5.8, '#2F4A6B', '朝天门');
    g.grass2(g.P(K.rect(-25, -15, -7, 29, 6)), { dens: 0.4 });
  }, { name: 'mall' });
  const sail = (g, cx, cy, h, lean) => {
    // a glass tower that curves out at the top like a sail: three stacked boxes, each shifted a little towards the tip
    const n = 4, hw = 3.0;
    for (let i = 0; i < n; i++) {
      const z0 = 6 + (h - 6) * i / n, z1 = 6 + (h - 6) * (i + 1) / n, d = lean * i * i / 3;
      K.box(g, cx - hw + d, cy - hw + d, cx + hw + d, cy + hw + d, z0, z1, GL, { w: 0.75, nb: i > 0 });
      const ln = []; for (let z = z0 + 1.1; z < z1; z += 1.1) { for (const [a, b] of [[g.p(cx - hw + d, cy + hw + d, z), g.p(cx + hw + d, cy + hw + d, z)], [g.p(cx + hw + d, cy + hw + d, z), g.p(cx + hw + d, cy - hw + d, z)]]) ln.push(a[0], a[1], b[0], b[1]); } g.segs2(ln, '#7F96A2', 0.3);
      g.cmds[g.cmds.length - 1].nc = '#86B9DA';                                  // at night its floors are lines of white light
      g.fill(K.on('L', cy + hw + d + 0.03, cx - 0.5 + d, cx + 0.5 + d, z0, z1), '#E9F0F2'); g.mark({ nc: '#A6D2EE' }); g.fill(K.on('R', cx + hw + d + 0.03, cy - 0.5 + d, cy + 0.5 + d, z0, z1), '#C9D8DE'); g.mark({ nc: '#7FB0D2' });
    }
  };
  T.obj([-22, -8, -10, 30], (g) => {
    g.boilP = 0.2;
    for (const cy of [-4, 5.5, 15, 24.5]) sail(g, -16, cy, 30, 1.6);
    // the Crystal: a horizontal glass conservatory along the four tops
    const x0 = -20, x1 = -11, y0 = -9, y1 = 30, z0 = 30.5, z1 = 34;
    const iC = g.cmds.length; K.box(g, x0, y0, x1, y1, z0, z1, { t: '#E4EEF0', l: '#C6DCE3', r: '#AFC6D0' }, { w: 0.85 });
    CQ.nmark(g, iC, '#C6DCE3', { nc: '#F0D29C' }); CQ.nmark(g, iC, '#AFC6D0', { nc: '#C29C68' }); CQ.nmark(g, iC, '#E4EEF0', { nc: '#8A9EB4' });   // the Crystal glows at night
    for (const y of [-4, 8, 20]) g.glow('lantern', x1 + 0.3, y, (z0 + z1) / 2, { r: 3.4, col: '#FFEBC4' });
    for (const cy of [-4, 5.5, 15, 24.5]) for (const z of [12, 22]) g.glow('lantern', -16 + 3 + 0.3, cy, z, { r: 2.2, col: '#BFE6FF' });
    const r = []; for (let y = y0 + 1.5; y < y1; y += 1.5) { const a = g.p(x1, y, z0), b = g.p(x1, y, z1); r.push(a[0], a[1], b[0], b[1]); } for (let x = x0 + 1.5; x < x1; x += 1.5) { const a = g.p(x, y1, z0), b = g.p(x, y1, z1); r.push(a[0], a[1], b[0], b[1]); } g.segs2(r, '#7F98A4', 0.3);
  }, { name: 'raffles' });
  T.obj([-24, -32, -10, -20], (g) => { CQ.block(g, { x0: -24, y0: -32, x1: -10, y1: -20, h: 9, col: '#D9D3C4', seed: 3, shop: ['重庆', '#2F4A6B'] }); }, { name: 'shop block' });

  /* ---- the tip square on its podium, the steps down to the pontoon ---- */
  T.obj([P0, P0, P1, P1], (g) => {
    g.boilP = 0.2;
    // the river faces drop to the water; the far faces are hidden (the road tunnels go in there)
    K.box(g, P0, P0, P1, P1, WL, PZ, { t: '#D9D2C2', l: '#C9C0AC', r: '#B3AA96' }, { w: 0.95 });
    const c = []; for (let z = WL + 1.6; z < PZ; z += 1.6) { const a = g.p(P0, P1, z), b = g.p(P1, P1, z), d = g.p(P1, P0, z); c.push(a[0], a[1], b[0], b[1], b[0], b[1], d[0], d[1]); } g.segs2(c, '#9E9583', 0.3);
    CQ.paving(g, P0, P0, P1, P1, PZ, { dens: 0.5 });
    // the name carved into the river wall, red infill
    CQH.text(g, 'R', P1 + 0.02, (P0 + P1) / 2 + 4, -1.6, 5.2, '朝天门', '#9E2A22', { center: true, w: 1.3 });
    CQ.rail(g, 'L', P1 - 0.4, P0, P1, PZ, { h: 1.4 }); CQ.rail(g, 'R', P1 - 0.4, P0, P1, PZ, { h: 1.4 });
    // at night: lamps along the tip's railing, their light on the meeting of the waters below
    CQ.railLamps(g, [P0 + 1, P1 - 0.4, PZ + 1.5], [P1 - 0.4, P1 - 0.4, PZ + 1.5], 6, { kind: 'lantern', col: '#FFC97A', base: WL, ends: false });
    CQ.railLamps(g, [P1 - 0.4, P0 + 1, PZ + 1.5], [P1 - 0.4, P1 - 0.4, PZ + 1.5], 6, { kind: 'lantern', col: '#FFC97A', base: WL });
    for (const [x, y] of [[P0 + 8, P0 + 8], [P1 - 8, P0 + 8], [P0 + 8, P1 - 8]]) g.glow('lamp', x, y, PZ + 1.6, { r: 0.8, base: PZ });
    // the flagpole on the square
    const b = g.p(42, 42, PZ), t = g.p(42, 42, PZ + 16); g.segs2([b[0], b[1], t[0], t[1]], '#8C8576', 0.6);
  }, { under: PZ, name: 'tip square' });
  T.actor({ sample: 5, period: 10, at(t) { const f = Math.floor(t * 4) % 6; return { x: 42, y: 42, z: PZ + 16, key: f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), pts = []; for (let i = 0; i <= 6; i++) { const u = i / 6, w = Math.sin(u * 3 + st.f) * 1.2 * u; pts.push([o[0] + u * 9, o[1] + w]); } const bot = pts.map((p) => [p[0], p[1] + 5.4]).reverse(); g.fill2(pts.concat(bot), '#D23B2F', true); g.disc2([o[0] + 1.6, o[1] + 1.3], 0.7, '#F2D27A'); } });
  // the flight up from the old square onto the tip square (climbs towards +x along the square's far side)
  T.obj([14, 28, 26, 36], (g) => {
    const n = 14; for (let i = n - 1; i >= 0; i--) { const xa = 14 + 12 * i / n, xb = 14 + 12 * (i + 1) / n, z = PZ * (i + 1) / n; g.fill(K.rect(xa, 28, xb, 36, z), i % 2 ? '#DAD3C3' : '#D2CAB8'); g.fill([[xa, 36, z - PZ / n], [xb, 36, z], [xb, 36, 0], [xa, 36, 0]], CQC.wall); }
    g.line([[14, 36, 0], [26, 36, PZ]], { w: 0.6, boil: false }); CQ.rail(g, 'L', 35.8, 14, 26, 0, { h: 1.2 });
  }, { name: 'up flight' });
  // the steps down the Yangtze face to the pontoon, and the pontoon with the moored cruise ship
  T.obj([34, P1, 58, 70], (g) => {
    const n = 20; for (let i = 0; i < n; i++) { const ya = P1 + 10 * i / n, yb = P1 + 10 * (i + 1) / n, z = PZ - (PZ - WL - 0.6) * (i + 1) / n; g.fill(K.rect(34, ya, 58, yb, z + (PZ - WL - 0.6) / n), i % 2 ? '#DAD3C3' : '#CFC7B5'); g.fill(K.on('L', yb, 34, 58, z, z + (PZ - WL - 0.6) / n), '#B8AF9B'); }
    g.fill([[58, P1, PZ], [58, P1, WL], [58, 70, WL], [58, 70, WL + 0.6]], CQC.wallD); g.line([[58, P1, PZ], [58, 70, WL + 0.6]], { w: 0.6, boil: false });
    CQH.sign(g, 'L', 70.05, 40, 52, WL + 0.7, WL + 2.4, '#2F5F8F', '码头');
  }, { name: 'river steps' });
  T.obj([30, 70, 62, 78], (g) => {
    K.box(g, 30, 70, 62, 78, WL - 0.4, WL + 0.8, { t: '#C9C3B5', l: '#6A6E70', r: '#5A5E60' }, { w: 0.7 });
    CQ.rail(g, 'L', 77.6, 30, 62, WL + 0.8, { h: 1.2 });
    K.box(g, 52, 71, 60, 77, WL + 0.8, WL + 4.4, { t: '#E9E6DE', l: '#F3F1EA', r: '#D9D6CC' }, { w: 0.6 });
    CQH.sign(g, 'L', 77.05, 52.5, 59.5, WL + 2.4, WL + 3.8, '#C8392E', '长江');
    CQ.railLamps(g, [31, 77.6, WL + 2.2], [51, 77.6, WL + 2.2], 5, { kind: 'lantern', col: '#FFC97A', base: WL });   // the pontoon's lamps (night)
  }, { name: 'pontoon' });
  T.obj([18, 79, 66, 86], (g) => g.at(42, 82.5, WL, (g2) => CQ.boat(g2, 0, { kind: 'cruise', L: 22, W: 3.4 })), { name: 'moored cruise' });

  /* ---- life ---- */
  // people along the tip rail looking out at the meeting of the waters
  const rail = [[58.4, 30, 0], [58.4, 36, 0], [58.6, 44, 0], [58.4, 52, 0], [52, 58.6, 1], [44, 58.5, 1], [36, 58.6, 1], [30, 58.4, 1]];
  rail.forEach(([x, y, d], i) => T.cast([x, y], (g) => CQ.person(g, x, y, PZ, CQ.who(700 + i, { dir: d, pose: i % 3 === 1 ? 'hold' : 'stand', phone: i % 3 === 1 })), { on: true, name: 'rail' }));
  // a tour group following a yellow flag across the old square
  for (let i = 0; i < 8; i++) CQ.walk(T, CQ.who(720 + i, { cap: '#E6C24F' }), [[-6, 22], [22, 22], [22, -10], [-6, -10]], 1.1, { phase: 0.15 - (i + 1) * 0.026 });
  CQ.walk(T, CQ.who(719), [[-6, 22], [22, 22], [22, -10], [-6, -10]], 1.1, { phase: 0.15, draw: (g, w) => { const r = CQ.person(g, 0, 0, 0, Object.assign(w, { pose: 'wave', ph: 0.3 })); const h = r.hands[1]; g.segs2([h[0], h[1], h[0], h[1] - 9], '#5A564E', 0.35); g.fill2([[h[0], h[1] - 9], [h[0] + 4, h[1] - 8], [h[0], h[1] - 6.6]], '#E6C24F', true); } });
  // two hotpot tables spilled out onto the old square, red steam rising
  for (const [x, y, sd] of [[16.5, -1, 790], [21.5, -9.5, 794]]) {
    T.cast([x, y], (g) => { const seat = (dx, dy, d, s) => { CQ.stool(g, x + dx, y + dy, s % 3 ? '#C9463E' : '#4F7FB8'); CQ.person(g, x + dx, y + dy, 1.3, CQ.who(s, { dir: d, pose: 'sit', reach: [3.2, 2.4], bowl: s % 2 === 0 })); };
      seat(-3.2, 0, 0, sd); seat(0, -3.2, 1, sd + 1); CQ.hotpot(g, x, y); seat(3.2, 0, 2, sd + 2); seat(0, 3.2, 3, sd + 3);
      if (sd === 790) { const b = g.p(x, y, 2.4), t = g.p(x, y, 9.5); g.segs2([b[0], b[1], t[0], t[1]], '#5A564E', 0.5); g.fill2(arcPts(t[0], t[1] + 2.2, 11, Math.PI, TAU, 12).map((p) => [p[0], p[1] - (p[1] - t[1] - 2.2) * 0.45]), '#C8392E', true); } }, { name: 'hotpot' });
    T.actor({ sample: 5, period: 10, at(t) { const ph = Math.floor(t * 5 + sd) % 8; return { x, y, z: 2.6, key: ph, ph }; }, draw(g, st) { CQ.steam2(g, st.ph, 1.25, 'rgba(226,150,128,0.62)'); } });
  }
  // tai chi in the square
  for (let i = 0; i < 6; i++) { const x = 0 + (i % 3) * 3.6, y = 2 + Math.floor(i / 3) * 3.8; T.cast([x, y], (g) => CQ.person(g, x, y, 0, CQ.elder(740 + i, { dir: 1, pose: 'wave', ph: 0.25, top: i % 2 ? '#F3F1EA' : '#C8392E', bot: '#F3F1EA' })), { name: 'taichi' }); }
  // passengers boarding along the pontoon, a porter with a suitcase down the steps
  CQ.walk(T, CQ.bangWho(750), [[46, 59], [46, 70.6], [46, 74], [46, 70.6]], 0.8, { z: (x, y) => y < P1 ? PZ : y < 70 ? PZ - (PZ - WL - 0.6) * (y - P1) / 10 : WL + 0.8, porter: { load: ['#3F5F8F', '#C9584B'] }, phase: 0.1 });
  for (let i = 0; i < 3; i++) CQ.walk(T, CQ.who(751 + i), [[36 + i * 5, 72], [36 + i * 5, 77], [36 + i * 5, 72]], 0.9, { z: WL + 0.8, phase: i * 0.3 });
  T.cast([60.5, 74], (g) => CQ.person(g, 60.5, 74, WL + 0.8, CQ.who(756, { dir: 1, top: '#F3F1EA', bot: '#2F3A4F', cap: '#2F3A4F' })), { name: 'crew' });
  CQ.walk(T, CQ.who(757), [[30, 30], [30, 54], [54, 54], [54, 30]], 1.2, { z: PZ, phase: 0.4 });
  T.cast([40, 38], (g) => CQ.noodleStall(g, 40, 38, PZ, 770, { col: '#E08A3C' }), { on: true, name: 'tip noodles' });
  CQ.steamActor(T, 40.6, 37.6, PZ + 3.8, 0.9);
  T.cast([50, 38], (g) => { CQ.pigeons(g, 50, 38, 10, 7, PZ); CQ.person(g, 48, 36, PZ, CQ.who(771, { dir: 0, pose: 'cheer', ph: 0.2, k: 0.74 })); CQ.person(g, 46, 40.5, PZ, CQ.elder(772, { dir: 0, pose: 'hold' })); }, { on: true, name: 'pigeons' });
  T.cast([43, 44], (g) => { for (let i = 0; i < 5; i++) CQ.person(g, 40 + i * 1.6, 44 + (i % 2) * 0.8, PZ, CQ.who(773 + i, { dir: 1, pose: i === 2 ? 'wave' : 'stand', ph: 0.3, bag: i % 2 ? '#C8392E' : undefined })); CQ.person(g, 44, 50.5, PZ, CQ.who(778, { dir: 3, pose: 'hold', phone: true })); }, { on: true, name: 'group photo' });
  T.cast([37, 53], (g) => CQ.porter(g, 37, 53, PZ, CQ.bangWho(779, { dir: 0, pose: 'stand' }), { load: ['#E08A3C', '#8FBF73'] }), { on: true, name: 'fruit porter' });
  T.obj([33, 55], (g) => CQ.bloom(g, 33, 55, { z: PZ, r: 3.6 }), { on: true, name: 'blossom' });
  T.obj([55, 33], (g) => CQ.fig(g, 55, 33, { z: PZ, r: 4.6, h: 3.6 }), { on: true, name: 'fig' });
  T.actor({ layer: 'top', sample: 5, period: 12, at(t) { const f = Math.floor(t * 4) % 8; return { x: 52, y: 52, z: PZ + 16 + Math.sin(t * 0.7) * 1.4, key: f, f }; }, draw(g, st) { const c = g.p(0, 0, 0), s = Math.sin(st.f * TAU / 8); g.fill2([[c[0], c[1] - 4], [c[0] + 3, c[1]], [c[0], c[1] + 4.5], [c[0] - 3, c[1]]], '#E6C24F', true); g.fill2([[c[0], c[1] - 4], [c[0] - 3, c[1]], [c[0], c[1]]], '#C8392E', true); g.fine2([[c[0], c[1] + 4.5], [c[0] + 1 + s, c[1] + 9], [c[0] - 1, c[1] + 14]], { w: 0.4, c: '#C8392E' }); } });
  CQ.walk(T, CQ.who(758, { umbrella: '#3F6FA8' }), [[54, 34], [34, 34], [34, 50]], 1.0, { z: PZ, phase: 0.6 });
  for (const [x, y] of [[-5, 32], [30, -30], [6, -24], [24, 2], [12, -12]]) T.obj([x, y], (g) => CQ.fig(g, x, y, { r: 4.6, h: 4 }), { name: 'fig' });
  for (const [x, y, f, s] of [[2, -12, 'L', 760], [20, 8, 'R', 762]]) { T.obj([x, y], (g) => K.bench(g, x, y, { face: f, L: 2.4, col: '#8A6446' }), { name: 'bench' }); T.cast([x + (f === 'R' ? 1 : 0), y + (f === 'L' ? 1 : 0)], (g) => { CQ.person(g, x + (f === 'R' ? 1.0 : 0), y + (f === 'L' ? 1.0 : 0), 1.3, CQ.elder(s, { dir: f === 'R' ? 0 : 1, pose: 'sit', reach: [3, 2.4] })); }, { on: true, name: 'sitter' }); }
  // a man walking his dog round the square
  CQ.walk(T, CQ.elder(764), [[-2, -14], [24, -14], [24, 18], [-2, 18]], 0.9, { phase: 0.6, draw: (g, w, st) => { CQ.person(g, 0, 0, 0, w); const dv = [[1, 0], [0, 1], [-1, 0], [0, -1]][st.dir], d = g.p(dv[0] * 2.4, dv[1] * 2.4, 0), h = g.p(dv[0] * 0.6, dv[1] * 0.6, 3.2); g.fine2([h, [d[0], d[1] - 2]], { w: 0.25, c: '#5A564E' }); g.fill2([[d[0] - 1.8, d[1] - 1.2], [d[0] + 1.8, d[1] - 1.2], [d[0] + 1.6, d[1] - 2.8], [d[0] - 1.6, d[1] - 2.8]], '#E9E2CF', true); g.disc2([d[0] + (dv[0] - dv[1]) * 1.6, d[1] - 3.2], 1.0, '#E9E2CF'); g.segs2([d[0] - 1.3, d[1] - 1.2, d[0] - 1.3, d[1], d[0] + 1.3, d[1] - 1.2, d[0] + 1.3, d[1]], '#8C8576', 0.4); } });
  for (const y of [-12, 16]) T.obj([31, y], (g) => K.lamp(g, 31, y, { h: 9, col: '#4A4E52' }), { name: 'lamp' });
});
