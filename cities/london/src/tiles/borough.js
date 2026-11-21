'use strict';
/* (100,100) The Shard and Borough Market, beside Tower Bridge's south end. What it is: the Shard, a glass spire of
   leaning shards narrowing to a splintered open tip; London Bridge station's glass sheds by the river, its brick
   viaduct striding south over the market with trains rumbling in and out; Borough Market below: stalls of cheese,
   bread, fruit, flowers, a huge pan of paella steaming, under the green-and-cream portico of the Floral Hall; and on
   the corner the Market Porter, the pub whose drinkers spill out across the pavement with their pints.
   Who is there: shoppers and tasters at the stalls, traders, the crowd outside the pub (the close-up), a busker,
   office workers eating lunch on the steps.
   What moves: trains on the viaduct, steam off the paella, walkers, a delivery cyclist. */
SF.tile('borough', 100, 100, { rim: 42, order: 2.2 }, function (T) {
  const H = 37, RS = -(100 - LT.RIV.S - 1.2), BR = { t: '#A9583F', l: '#B9654C', r: '#9C523D' }, VX0 = -27, VX1 = -21, VZ = 6.6;
  T.ground(function (g) {
    LK.ground(g, -H, RS, H, H, '#E1DDD2', { cut: 'xy' });
    LK.paving(g, -H, RS, H, H, { step: 3.0, col: '#E1DDD2', joint: '#CFCABE' });
    LK.paving(g, -14, 0, 18, 24, { step: 1.8, col: '#DCD4C4', joint: '#C9C1AE' });
    for (const [x, y, rx, ry] of [[-30, 10, 2.0, 0.9], [8, 30, 1.8, 0.8], [32, -10, 1.4, 0.6], [-20, 30, 1.6, 0.7], [30, 33, 1.2, 0.5]]) LK.puddle(g, x, y, rx, ry, Math.round(x * 7 + y * 3 + 17));
  }, { rim: true });

  /* ---------------- the Shard ---------------- */
  T.obj([17, -27, 31, -13], function (g) {
    g.boilP = 0.2;
    const cx = 24, cy = -20, Z = 74, B = 6.4;
    // eight leaning shards: each a tall tapering plane; drawn back to front
    const sh = [[-B, -B, -B * 0.1, 0.4], [B, -B, 0.1, 0.6], [-B, B, -0.15, 0.2], [B, B, 0.15, 0]].map(([x, y, lean, k]) => ({ x, y, lean, k }));
    const pt = (x, y, z) => g.p(cx + x, cy + y, z);
    const top = (s) => [s.x * 0.06 + s.lean, s.y * 0.06, Z - s.k * 6];
    // the two faces we see (south and east), split into shard planes, with floor lines and a sky reflection
    const faces = [
      { a: [-B, B], b: [B, B], col: '#B8CFDC', d: '#9FB9C9' },
      { a: [B, B], b: [B, -B], col: '#93AEC0', d: '#7E9AAE' },
    ];
    for (const f of faces) {
      const tA = [f.a[0] * 0.05, f.a[1] * 0.05, Z - 4], tB = [f.b[0] * 0.05, f.b[1] * 0.05, Z - 9];
      const poly = [pt(f.a[0], f.a[1], 0), pt(f.b[0], f.b[1], 0), pt(tB[0], tB[1], tB[2]), pt(tA[0], tA[1], tA[2])];
      g.fill2(poly, f.col);
      const ln = []; for (let z = 3; z < Z - 10; z += 2.2) { const u = z / Z, a = pt(lerp(f.a[0], tA[0], u), lerp(f.a[1], tA[1], u), z), b = pt(lerp(f.b[0], tB[0], u), lerp(f.b[1], tB[1], u), z); ln.push(a[0], a[1], b[0], b[1]); } g.segs2(ln, f.d, 0.3);
      const m0 = pt((f.a[0] + f.b[0]) * 0.5, (f.a[1] + f.b[1]) * 0.5, 0), m1 = pt((tA[0] + tB[0]) * 0.5, (tA[1] + tB[1]) * 0.5, (tA[2] + tB[2]) / 2);
      g.line2([m0, m1], { w: 0.5, c: '#6E8A9C', boil: false });
      g.fill2([pt(f.a[0] * 0.6, f.a[1] * 0.6 + 0.01, 10), pt(f.a[0] * 0.3 + f.b[0] * 0.15, f.a[1] * 0.3 + f.b[1] * 0.15, 34), pt(f.a[0] * 0.28 + f.b[0] * 0.24, f.a[1] * 0.28 + f.b[1] * 0.24, 36), pt(f.a[0] * 0.5 + f.b[0] * 0.1, f.a[1] * 0.5 + f.b[1] * 0.1, 10)], 'rgba(240,247,250,0.55)');
      g.line2(poly, { w: 0.8, c: '#4E6070', close: true, boil: false });
    }
    // the splintered open tip
    const tp = pt(0, 0, Z - 5); for (const [dx, dz] of [[-1.6, 9], [0.6, 11], [1.8, 8.4], [-0.4, 10]]) g.line2([[tp[0] + dx * 1.2, tp[1]], [tp[0] + dx * 2.0, tp[1] - dz * 3.46 * 0.42]], { w: 0.8, c: '#8EA7B6', boil: false, ext: 0 });
    g.fill(K.on('L', cy + B + 0.02, cx - B, cx + B, 0, 3.2), '#4E5E6C');
    void sh; void top;
  }, { name: 'shard' });

  /* ---------------- London Bridge station and the viaduct ---------------- */
  T.obj([-36, RS, -6, -14], function (g) {
    g.boilP = 0.25;
    K.box(g, -36, RS + 0.5, -6, -14, 0, VZ - 1, BR, { w: 0.85 });
    K.text(g, 'L', -13.96, -21, VZ - 3.1, 1.3, 'LONDON BRIDGE', '#F3EFE4', { center: true, w: 0.6 });
    for (let x = -34.5; x < -7; x += 3.2) { if (x > -30 && x < -12) continue; const a = [K.pt('L', -13.98, x, 0)]; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; a.push(K.pt('L', -13.98, x + 1.2 - Math.cos(t) * 1.2, 2.6 + Math.sin(t) * 1.2)); } a.push(K.pt('L', -13.98, x + 2.4, 0)); g.fill(a, '#5A4A40'); }
    // the glass platform canopies
    for (let i = 0; i < 3; i++) { const y0 = RS + 1 + i * 4.6, y1 = y0 + 4.2; const a = [], b = []; for (let k = 0; k <= 8; k++) { const t = Math.PI * k / 8; a.push([-36, y0 + (y1 - y0) * (1 - Math.cos(t)) / 2, VZ + Math.sin(t) * 2.2]); } g.fill(a.concat(a.slice().reverse().map((p) => [-6, p[1], p[2]])), i % 2 ? '#CFE0E8' : '#C3D6E0'); g.line(a.map((p) => [-6, p[1], p[2]]), { w: 0.55, c: '#5A6670', boil: false }); const rb = []; for (let x = -36; x <= -6; x += 2.5) for (let k = 0; k < 8; k++) { const p = g.p(x, a[k][1], a[k][2]), q = g.p(x, a[k + 1][1], a[k + 1][2]); rb.push(p[0], p[1], q[0], q[1]); } g.segs2(rb, '#7E8C96', 0.3); }
  }, { name: 'station', under: VZ + 2.4 });
  const viaduct = (y0, y1) => T.obj([VX0, y0, VX1, y1], (g) => {
    g.boilP = 0.25;
    K.box(g, VX0, y0, VX1, y1, 0, VZ - 1.0, BR, { w: 0.85 });
    for (let y = y0 + 0.8; y < y1 - 3; y += 5.2) { const a = [K.pt('R', VX1 + 0.02, y, 0)]; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; a.push(K.pt('R', VX1 + 0.02, y + 1.8 - Math.cos(t) * 1.8, 2.6 + Math.sin(t) * 1.8)); } a.push(K.pt('R', VX1 + 0.02, y + 3.6, 0)); g.fill(a, '#3E322C'); const sh = []; for (let k = 0; k < 4; k++) { const p = g.p(VX1 + 0.04, y + 0.6 + k * 0.8, 0.4), q = g.p(VX1 + 0.04, y + 0.6 + k * 0.8, 2.6); sh.push(p[0], p[1], q[0], q[1]); } g.segs2(sh, '#E9CF92', 0.6); }
    K.box(g, VX0 - 0.3, y0, VX1 + 0.3, y1, VZ - 1.0, VZ, { t: '#B9B3A6', l: '#D7D2C6', r: '#C3BDB0' }, { w: 0.6, nohid: true });
    const sl = []; for (let y = y0 + 0.4; y < y1; y += 1.2) { const a = g.p(VX0 + 0.6, y, VZ + 0.05), b = g.p(VX1 - 0.6, y, VZ + 0.05); sl.push(a[0], a[1], b[0], b[1]); } g.segs2(sl, '#7E766A', 0.4);
    for (const x of [VX0 + 1.6, VX1 - 1.6]) g.fine([[x, y0, VZ + 0.12], [x, y1, VZ + 0.12]], { w: 0.4, c: '#4A4540' });
  }, { name: 'viaduct', under: VZ - 1.0 });
  viaduct(-14, 4); viaduct(4, 20); viaduct(20, H);
  // trains in and out of the station: three cars, along the viaduct, stopping under the canopies
  for (let i = 0; i < 3; i++) T.actor({ grow: false, sample: 0.3, period: 36,
    at(t) { const c = (t % 36) / 36; let y; if (c < 0.3) y = lerp(48, -20, smooth(c / 0.3)); else if (c < 0.55) y = -20; else if (c < 0.85) y = lerp(-20, 48, smooth((c - 0.55) / 0.3)); else return null; y += i * 9.6; if (y > H + 4) return null; const a = clamp((H + 4 - y) / 6, 0, 1); if (a <= 0.02) return null; return { x: (VX0 + VX1) / 2, y, z: VZ, key: i, alpha: a < 1 ? a : null }; },
    draw(g) { g.at(0, 0, 0, (g2) => { const B = K.rbox(g2, 0, 0, 4.4, 1.5, Math.PI / 2, 0.9, 4.3, { t: '#C9CDD0', l: '#E4E6E8', r: '#C3C7CA' }, { w: 0.7 }); for (const f of ['pv', 'nv']) if (B.vis[f]) { g2.fill(B.quad(f, -1, 1, 1.6, 2.0), '#2E8FC9'); for (const [a, b] of [[-0.9, -0.55], [-0.4, -0.05], [0.1, 0.45], [0.6, 0.9]]) K.rwin(g2, B, f, a, b, 2.3, 3.6); g2.fill(B.quad(f, -1, 1, 0.9, 1.3), '#E6C24F'); } }); } });

  /* ---------------- Borough Market ---------------- */
  // the Floral Hall portico: green and cream ironwork, a glass pediment
  T.obj([-16, -6, 18, -2], (g) => {
    g.boilP = 0.3;
    const GRN = '#3F6B4E', CRE = '#EDE3C8';
    const cl = []; for (let x = -15.4; x <= 17.6; x += 3.0) { const a = g.p(x, -2.2, 0), b = g.p(x, -2.2, 7.6); cl.push(a[0], a[1], b[0], b[1]); } g.segs2(cl, GRN, 0.9);
    K.box(g, -16, -6, 18, -2, 7.6, 8.6, { t: '#C9BDA0', l: CRE, r: '#D9CCAA' }, { w: 0.6, nohid: true });
    const pd = [[-4, -2, 8.6], [6, -2, 8.6], [1, -2, 11.8]]; g.fill(pd, 'rgba(207,224,232,0.9)'); g.outline(pd, { w: 0.6, c: GRN });
    const fan = []; for (let i = 1; i < 6; i++) { const p = g.p(lerp(-4, 6, i / 6), -2, 8.6), q = g.p(1, -2, 8.8); fan.push(p[0], p[1], q[0], q[1]); } g.segs2(fan, GRN, 0.35);
    K.sign(g, 'L', -2.0, -15, 17, 7.7, 8.6, '#2E4A3A', 'BOROUGH MARKET', { ink: '#E0B54A' });
  }, { name: 'floral hall' });
  const stalls = [[-12, 4, '#C8372D', '#F3F1EA', 'cheese'], [-4, 4, '#3F6B4E', '#F3F1EA', 'bread'], [4, 4, '#E6C24F', '#3F6B4E', 'fruit'], [12, 4, '#3F5F8F', '#F3F1EA', 'fish'], [-12, 15, '#8E2F3A', '#EDE3C8', 'flowers'], [12, 15, '#5FA58F', '#F3F1EA', 'veg']];
  const goods = { cheese: ['#F2D27A', '#E6B84F', '#F6E7B0'], bread: ['#C9944E', '#B07A3A', '#E0B676'], fruit: ['#E0503E', '#F0A23A', '#8FBF73', '#E6C24F'], fish: ['#C9D6E0', '#E9EEF1', '#E7A9A0'], flowers: ['#D98AA4', '#E0503E', '#F3F1EA', '#E6C24F', '#B24A9E'], veg: ['#6FAE6A', '#E0503E', '#8FBF73', '#E6C24F'] };
  for (const [x, y, a, b, kind] of stalls) T.obj([x - 2.6, y - 1.8, x + 2.6, y + 1.8], (g) => K.stall(g, x, y, { face: 'L', L: 2.6, D: 1.6, a, b, goods(g2, D, L) { const R = RNG(Math.round(x * 13 + y)); for (let i = 0; i < 16; i++) { const p = g2.p(-D + R() * 2 * D, -L + R() * 2 * L, 2.8); g2.disc2(p, 0.8, R.pick(goods[kind])); } } }), { name: 'stall' });
  // the paella pan, steaming
  T.obj([-2, 13, 6, 17], (g) => { K.cyl(g, 2, 15, 0.6, 0, 2.4, '#3A3530', { w: 0.4, n: 6 }); const c = g.p(2, 15, 2.4), rim = arcPts(c[0], c[1], 9, 0, TAU, 20).map((p) => [p[0], c[1] + (p[1] - c[1]) * 0.42]); g.fill2(rim, '#2E2A26', true); g.fill2(rim.map((p) => [c[0] + (p[0] - c[0]) * 0.88, c[1] + (p[1] - c[1]) * 0.88]), '#E6B23C', true); const R = RNG(5); for (let i = 0; i < 30; i++) { const a = R() * TAU, d = R() * 7; g.disc2([c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d * 0.4], 0.6, R.pick(['#E0503E', '#8FBF73', '#F3F1EA', '#C9584B'])); } }, { name: 'paella' });
  T.actor({ layer: 'top', sample: 5, period: 10, at(t) { const f = Math.floor(t * 4) % 6; return { x: 2, y: 15, z: 3, key: f, f }; }, draw(g, st) { const o = g.p(0, 0, 0); for (let k = 0; k < 3; k++) { const ph = (st.f + k * 2) / 6, pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push([o[0] - 3 + k * 3 + Math.sin(u * 5 + ph * TAU) * 1.4, o[1] - u * 12 - ph * 3]); } g.line2(pts, { w: 0.7, c: '#F6F4EE', boil: false, wob: 0.3 }); } } });

  /* ---------------- the Market Porter pub on the near corner ---------------- */
  T.obj([28, 20, 37, 28], (g) => LK.pub(g, 28, 20, 37, 28, { st: 3, paint: '#5A2E2A', col: LK.C.stock, signCol: '#2E3A33', name: 'THE MARKET PORTER', short: 'PORTER' }), { name: 'market porter' });
  for (const [x, y] of [[-34, -6], [-34, 8], [-34, 22], [-10, 32], [14, 33]]) T.obj([x, y], (g) => LK.plane(g, x, y, { r: 4.4 }), { name: 'tree' });
  T.obj([-32, 30.5], (g) => LK.phonebox(g, -32, 30.5), { name: 'phone box' });
  T.ground(function (g) { LK.tube(g, -33, 6, { axis: 'y' }); });
  T.obj([-29.6, 5.6], (g) => LK.roundel(g, -29.6, 5.6, { name: 'LONDON BRIDGE' }), { name: 'roundel' });

  /* ---------------- the living layer ---------------- */
  // the drinkers outside the Market Porter, filling the pavement (the close-up)
  T.cast([31, 31.5], (g) => {
    const P = [[28.4, 29.2, 0], [29.8, 30.2, 2], [31.4, 29.0, 1], [33.0, 29.6, 2], [34.6, 29.2, 1], [29.0, 31.8, 3], [30.6, 32.8, 0], [32.4, 31.6, 3], [34.0, 32.4, 0], [35.6, 31.2, 2], [28.2, 34.4, 3], [30.0, 35.2, 1], [32.2, 34.6, 2], [34.4, 35.0, 3], [36.0, 33.8, 1]];
    P.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])).forEach(([x, y, d], i) => LK.person(g, x, y, 0, (i % 3 === 0 ? LK.banker : LK.who)(8300 + i, { dir: d, pose: i % 5 === 4 ? 'cheer' : 'hold', ph: 0.2, pint: i % 4 === 1 ? '#F3EFE4' : i % 4 === 2 ? '#B9443A' : '#E9B53C', bag: undefined, umb: undefined, phone: false })));
  }, { on: true });
  // shoppers and traders at the stalls
  for (const [x, y, d, s] of [[-12, 6.6, 3, 8400], [-10.4, 7.4, 3, 8401], [-4.6, 6.8, 3, 8402], [-2.6, 7.2, 2, 8403], [4, 6.8, 3, 8404], [6, 7.6, 3, 8405], [12, 6.6, 3, 8406], [13.6, 7.6, 2, 8407], [-12, 17.6, 3, 8408], [12.6, 17.4, 3, 8409], [0.4, 18.4, 3, 8410], [3.6, 18.0, 3, 8411], [-0.4, 11.6, 1, 8412]]) LK.stand(T, x, y, LK.who(s, { dir: d, pose: s % 3 === 0 ? 'hold' : 'stand' }));
  for (const [x, y] of [[-15.6, 4], [-7.6, 6.2], [8.4, 6.2], [15.6, 4]]) LK.stand(T, x, y, LK.who(Math.round(8500 + x), { dir: 1, top: '#F3F1EA', cap: '#3B3F47' }));
  // lunch on the station steps, a busker
  T.cast([-4, -10], (g) => { for (const [x, y, s] of [[-8, -9.6, 8600], [-5.6, -10.0, 8601], [-2.8, -9.4, 8602]]) LK.person(g, x, y, 0.6, LK.banker(s, { dir: 1, pose: 'sit' })); K.box(g, -10, -12, 1, -10.6, 0, 0.6, '#D6D0C2', { w: 0.4 }); }, { on: true });
  // walkers and a delivery cyclist
  LK.walker(T, LK.who(8700, { umb: '#26314F' }), [[-36, 28], [26, 28]], 1.4, { phase: 0.2 });
  LK.walker(T, LK.tourist(8701), [[18, 34], [-36, 34]], 1.5, { phase: 0.6 });
  LK.walker(T, LK.banker(8702), [[-14, -12], [-14, 26]], 2.0, { phase: 0.4 });
  LK.walker(T, LK.who(8703), [[-36, -8], [18, -8]], 1.3, { phase: 0.7 });
  LK.walker(T, LK.who(8704, { dog: '#C9A26B' }), [[34.5, RS + 3], [34.5, 18]], 1.2, { phase: 0.3 });
  T.actor({ sample: 0.3, period: 24, at(t) { const u = (t / 24) % 1, y = lerp(-12, 34, u < 0.5 ? u * 2 : 2 - u * 2), d = u < 0.5 ? 1 : -1; return { x: 19.4, y, key: d, d }; }, draw(g, st) { K.bike(g, st.d > 0 ? Math.PI / 2 : -Math.PI / 2, { col: '#2A2622', who: LK.who(8710, { top: '#5FC07A', pack: '#5FC07A' }) }); } });
});
