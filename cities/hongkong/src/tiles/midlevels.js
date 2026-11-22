'use strict';
/* (100,-100) The Mid-Levels and SoHo, climbing the hill behind Central (its near edge on the tram street).
   What it is: the hillside cut into four terraces (z 0, 4.5, 9, 13.5) held by granite retaining walls, each with its
   street along x; tong lau and restaurants on the lower ones, slim residential towers at the top. Up through them
   all runs the Central-Mid-Levels escalator: a covered moving walkway on stilts, its glazed roof on slim posts,
   climbing in ramps over each terrace's street with a landing at each; in the evening it runs uphill.
   On Hollywood Road (terrace 2) Man Mo Temple: green-tiled roofs with a ridge of figures, red walls, the doors open
   on great coils of incense hanging from the ceiling and smoke drifting out; antique shops beside it. On terrace 1
   SoHo's restaurants with tables out on the street.
   Who: commuters riding the escalator up (standing, a few walking up it), diners at the café tables, someone lighting
   incense at the temple door, a waiter, walkers on each terrace street. */
SF.tile('midlevels', 100, -100, { rim: 8 }, function (T) {
  const H = 37, TZ = [0, 4.5, 9, 13.5], TY = [37, 16, -2, -18];        // terrace k spans y from TY[k+1] to TY[k] (the last to -H)
  const zOf = (y) => y > TY[1] ? 0 : y > TY[2] ? TZ[1] : y > TY[3] ? TZ[2] : TZ[3];
  const EX = -8;                                                       // the escalator's line
  // the walkway deck height: 4 u above the terrace below it, ramping over each wall
  const ez = (y) => { let z = 4.2 + zOf(y); for (const [yw, dz] of [[TY[1], 4.5], [TY[2], 4.5], [TY[3], 4.5]]) { const u = clamp((yw + 3 - y) / 8, 0, 1); if (y < yw + 3 && y > yw - 5) z = 4.2 + zOf(yw + 3.1) + dz * smooth(u); } return z; };
  T.ground(function (g) {
    HK.ground(g, -H, -H, H, H, HK.C.pave, { cut: 'x' });
    HK.paving(g, -H, 18, H, H, { step: 2.4 });
    g.fill(K.rect(-H, 22, H, 30), HK.C.asph); g.line([[-H, 22, 0], [H, 22, 0]], { w: 0.5, c: '#9E9A90', boil: false }); g.line([[-H, 30, 0], [H, 30, 0]], { w: 0.5, c: '#9E9A90', boil: false });
  }, { rim: true });
  /* ---- the terraces: retaining walls of granite and their streets ---- */
  for (let k = 1; k < 4; k++) {
    const y0 = k < 3 ? TY[k + 1] : -H, y1 = TY[k], z = TZ[k];
    T.obj([-H, y0, H, y1], (g) => {
      g.boilP = 0.2;
      K.box(g, -H, y0, H, y1, 0, z, { t: '#E6E1D5', l: '#CFC9BC', r: '#BFB9AC' }, { w: 0.8 });
      const s = []; for (let zz = 0.9; zz < z; zz += 0.9) { const a = g.p(-H, y1 + 0.02, zz), b = g.p(H, y1 + 0.02, zz); s.push(a[0], a[1], b[0], b[1]); } for (let x = -H + 1.2; x < H; x += 2.4) { const a = g.p(x, y1 + 0.02, 0), b = g.p(x, y1 + 0.02, z); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#B3AC9E', 0.25);
      // ferns and a fig rooted in the wall
      for (let x = -H + 5; x < H; x += 13) { const c = g.p(x, y1 + 0.05, z * 0.6); g.fill2(arcPts(c[0], c[1], 2.2, 0, TAU, 8), '#7FA463', true); }
      // the terrace street along x, its pavement
      g.fill(K.rect(-H, y1 - 6, H, y1 - 1.6, z + 0.01), HK.C.asph);
      HK.rail(g, [-H, y1 - 0.3, z], [EX - 3, y1 - 0.3, z], { h: 1.4 }); HK.rail(g, [EX + 3, y1 - 0.3, z], [H, y1 - 0.3, z], { h: 1.4 });
      HK.railLights(g, -H, EX - 3, y1 - 0.3, { base: z, z: 1.4, step: 9 }); HK.railLights(g, EX + 3, H, y1 - 0.3, { base: z, z: 1.4, step: 9 });   // lamps on the parapet at night
    }, { name: 'terrace' });
  }
  /* ---- buildings: tong lau and restaurants on terraces 0-1, Man Mo on 2, towers at the top ---- */
  const onT = (y) => zOf(y);
  // terrace 0 (the tram street's side): tong lau facing the street at y 30, verandahs over the pavement
  for (const [x0, x1, col] of [[-36, -21, '#E2D3B8'], [-1, 14, '#CFE0D2'], [15, 34, '#E8D9C0']]) T.obj([x0, 17, x1, 21.2], (g) => HK.tonglau(g, x0, 17, x1, 19.0, { floors: 2, col, d: 2.2 }), { name: 'tong lau' });
  // terrace 1: SoHo restaurants facing their street, tables out front
  for (const [x0, x1, col, en] of [[-36, -22, '#D3DDE8', 'TAPAS'], [2, 16, '#F2D7B8', 'BISTRO'], [18, 34, '#E9C9C0', 'NOODLES']]) T.obj([x0, 1, x1, 8], (g) => { const z = TZ[1]; K.box(g, x0, 1, x1, 8, z, z + 11, { t: shade(col, -0.1), l: col, r: shade(col, 0.1) }, { w: 0.8 }); g.fill(K.on('L', 8.02, x0 + 0.6, x1 - 0.6, z + 0.2, z + 3.6), '#F2DDA8'); for (const zz of [z + 5, z + 8]) for (let x = x0 + 1; x < x1 - 1.5; x += 3) K.win(g, 'L', 8.01, x, x + 1.6, zz, zz + 2, { style: 'glass' }); const i0 = g.cmds.length; K.sign(g, 'L', 8.04, x0 + 2, x1 - 2, z + 3.7, z + 4.7, '#2C2622', en, { ink: '#F7D046', w: 0.3 }); HK.nite(g, i0, { nc: true }); HK.signGlow(g, 'L', 8.04, x0 + 2, x1 - 2, z + 3.7, z + 4.7, '#F7D046', 0.25); }, { on: true, name: 'restaurant' });
  for (const [x, y] of [[-32, 10.6], [-26, 10.8], [6, 10.6], [11, 10.8], [22, 10.6], [28, 10.8]]) T.cast([x, y], (g) => {
    const z = TZ[1]; K.cyl(g, x, y, 1.1, z + 2.0, z + 2.15, { t: '#F3EFE3', l: '#E9E2CF', r: '#D9D0BA' }, { n: 12, w: 0.35 }); K.cyl(g, x, y, 0.15, z, z + 2.0, { t: '#5A564E', l: '#4A4540', r: '#3A3530' }, { n: 6, w: 0.25 });
    const q = g.p(x, y, z + 2.2); g.fill2([[q[0] - 0.3, q[1]], [q[0] + 0.3, q[1]], [q[0] + 0.25, q[1] - 1.6], [q[0] - 0.25, q[1] - 1.6]], '#8E2F3A', true);
    HK.leds2(g, [q[0] + 0.9, q[1] - 0.4, q[0] + 0.91, q[1] - 0.4], '#FFD27A', 0.6); g.glow2('lantern', [q[0] + 0.9, q[1] - 0.4], q, { r: 0.9, col: '#FFC870' });   // a candle on the table at night
    HK.person(g, x - 1.6, y - 0.4, z, HK.who(Math.round(9800 + x), { dir: 0, pose: 'sit', reach: [3, -9], cup: '#C8372D' })); HK.person(g, x + 1.6, y + 0.6, z, HK.who(Math.round(9850 + x), { dir: 2, pose: 'sit', reach: [-3, -9] }));
  }, { on: true, name: 'diners' });
  // terrace 2: Man Mo Temple, antique shops
  T.obj([12, -16, 34, -6], (g) => {
    g.boilP = 0.3;
    const z = TZ[2], RD = { t: '#B8432E', l: '#C8503A', r: '#A64230' };
    K.box(g, 12.4, -15.6, 33.6, -6.6, z, z + 5.4, RD, { w: 0.8 });
    // the open doors with the coils of incense hanging inside, smoky dark
    g.fill(K.on('L', -6.58, 18, 28, z, z + 4.4), '#4A3428'); g.mark({ nc: '#6E4632' });
    const c = []; for (let i = 0; i < 6; i++) c.push(g.p(19 + i * 1.7, -6.5, z + 3.8 - (i % 2) * 0.6));
    for (const q of c) { for (let r = 0; r < 4; r++) g.ring2([q[0], q[1] + r * 0.9], 2.0 - r * 0.42, { w: 0.35, c: r % 2 ? '#C9A26B' : '#E9C98A' }); g.disc2([q[0], q[1] + 3.6], 0.4, '#FF6A3D'); g.mark({ nc: true }); g.glow2('lantern', [q[0], q[1] + 3.6], [q[0], q[1] + 3.6], { r: 0.6, col: '#FF7A40' }); }   // the coils' embers glow at night
    g.glow('lantern', 23, -6.4, z + 2.2, { r: 4.2, col: '#FF9A5A' });
    g.fill(K.on('L', -6.56, 17.4, 28.6, z + 4.4, z + 5.4), '#E6C24F');
    HK.board(g, 'L', -6.5, 19.4, 26.6, z + 4.45, z + 5.35, '#2C2622', '文武廟', { ink: '#E6C24F', vert: false });
    // the green-tiled roofs with their ridge of figures
    K.gable(g, 11.8, -16.2, 34.2, -6.0, z + 5.4, 2.6, 'x', { a: '#4E8A62', b: '#3E7A5A', e: '#C8503A' }, { w: 0.6 });
    const rg = []; for (let x = 14; x < 33; x += 1.6) { const q = g.p(x, -11.1, z + 8.0); rg.push(q); } for (const q of rg) g.fill2([[q[0] - 0.5, q[1]], [q[0] + 0.5, q[1]], [q[0] + 0.3, q[1] - 1.6], [q[0] - 0.3, q[1] - 1.6]], '#D98A3C', true);
  }, { on: true, name: 'man mo temple' });
  // smoke from the incense, drifting out of the door
  T.actor({ sample: 0.5, period: 3, grow: false, layer: 'top',
    at(t) { const f = Math.floor(t * 4) % 8; return { x: 23, y: -6.0, z: TZ[2] + 4.6, key: 'k' + f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0); for (let k = 0; k < 4; k++) { const u = ((st.f / 8) + k / 4) % 1; g.disc2([o[0] + Math.sin(u * 5 + k) * 2.4 + u * 3, o[1] - u * 12], 1.2 + u * 2.2, 'rgba(232,226,214,' + (0.5 - u * 0.42).toFixed(2) + ')'); } } });
  T.cast([22, -4.6], (g) => HK.person(g, 22, -4.6, TZ[2], HK.elder(9871, { dir: 3, pose: 'hold', reach: [1, -12] })), { on: true, name: 'incense' });
  T.obj([-36, -16, -16, -8], (g) => { const z = TZ[2]; K.box(g, -36, -16, -16, -8, z, z + 7, { t: '#DCD3BE', l: '#E8DFC9', r: '#D0C6AE' }, { w: 0.8 }); g.fill(K.on('L', -7.98, -35, -17, z + 0.2, z + 3.6), '#F2DDA8'); const s = []; for (let x = -34; x < -17; x += 1.6) { const q = g.p(x, -7.95, z + 1.2); s.push(q[0], q[1], q[0], q[1] - 3); } g.segs2(s, '#7A5A3C', 1.2); const i0 = g.cmds.length; K.sign(g, 'L', -7.96, -34, -18, z + 3.7, z + 4.8, '#5A3A24', 'ANTIQUES', { ink: '#E6C24F', w: 0.3 }); HK.nite(g, i0, { nc: true }); }, { on: true, name: 'antiques' });
  // terrace 3: slim residential towers
  for (const [x0, x1, y0, y1, h, col] of [[-36, -22, -36, -24, 26, '#E3DED3'], [-4, 10, -36, -24, 30, '#D3DDE8'], [14, 34, -35, -23, 22, '#F0E3BC']]) T.obj([x0, y0, x1, y1], (g) => HK.resi(g, x0, y0, x1, y1, TZ[3], TZ[3] + h, { col, lit: 0.35 }), { on: true, name: 'tower' });

  /* ---- the escalator: a deck on stilts and a glazed roof, in pieces up the hill ---- */
  const Ys = [37, 27, 17, 9, 1, -7, -15, -23, -33];
  for (let i = 0; i + 1 < Ys.length; i++) {
    const ya = Ys[i + 1], yb = Ys[i];
    T.obj([EX - 1.8, ya, EX + 1.8, yb], (g) => {
      const s = [];
      for (let y = ya; y <= yb + 0.01; y += 3.3) for (const dx of [-1.4, 1.4]) { const a = g.p(EX + dx, y, ez(y)), b = g.p(EX + dx, y, zOf(y)); s.push(a[0], a[1], b[0], b[1]); }
      g.segs2(s, '#8E8A80', 0.5);
      const N = 6, deck = []; for (let k = 0; k <= N; k++) { const y = lerp(yb, ya, k / N); deck.push(y); }
      const side = []; for (const y of deck) side.push([EX + 1.6, y, ez(y)]); for (const y of deck.slice().reverse()) side.push([EX + 1.6, y, ez(y) - 0.9]);
      g.fill(side, '#B9C0C4'); g.outline(side, { w: 0.5, boil: false });
      const top = []; for (const y of deck) top.push([EX - 1.6, y, ez(y)]); for (const y of deck.slice().reverse()) top.push([EX + 1.6, y, ez(y)]);
      g.fill(top, '#5E666C');
      const bl = []; for (const y of deck) { const a = g.p(EX - 0.6, y, ez(y) + 0.02), b = g.p(EX + 0.6, y, ez(y) + 0.02); bl.push(a[0], a[1], b[0], b[1]); } g.segs2(bl, '#7E878C', 0.3);
    }, { on: true, under: 0, name: 'escalator' });
    T.obj([EX - 1.8, ya, EX + 1.8, yb], (g) => {
      const N = 6, ys = []; for (let k = 0; k <= N; k++) ys.push(lerp(yb, ya, k / N));
      const p = []; for (const y of ys) { const a = g.p(EX + 1.7, y, ez(y) + 0.2), b = g.p(EX + 1.7, y, ez(y) + 4.6); p.push(a[0], a[1], b[0], b[1]); } g.segs2(p, '#9AA3A8', 0.35);
      const roof = []; for (const y of ys) roof.push([EX - 1.9, y, ez(y) + 4.8]); for (const y of ys.slice().reverse()) roof.push([EX + 1.9, y, ez(y) + 4.6]);
      g.fill(roof, 'rgba(206,222,228,0.55)'); g.line(ys.map((y) => [EX + 1.9, y, ez(y) + 4.6]), { w: 0.55, boil: false }); g.line(ys.map((y) => [EX - 1.9, y, ez(y) + 4.8]), { w: 0.4, c: '#8E979C', boil: false });
      if (i === 0) { const q = K.on('L', 37.02, EX - 1.8, EX + 1.8, ez(36.9) + 4.8, ez(36.9) + 6.0), i0 = g.cmds.length; g.fill(q, '#2F4F6E'); K.text(g, 'L', 37.05, EX, ez(36.9) + 5.05, 0.7, 'ESCALATOR', '#F3F1EA', { center: true }); HK.nite(g, i0, { nc: true }); }
      // at night a line of lamps under the glazed roof, all the way up the hill
      for (let k = 0; k < 2; k++) { const y = lerp(yb, ya, 0.25 + k * 0.5); g.glow('lamp', EX, y, ez(y) + 4.3, { r: 1.0, base: ez(y) }); }
    }, { on: true, under: 30, name: 'escalator roof' });
  }
  // the riders: a steady file standing on the moving walkway, going up; two walking up it
  const NR = 16, L = 37 + 33, V = 0.9;
  for (let i = 0; i < NR; i++) {
    const look = HK.who(9900 + i, i % 4 === 1 ? { phone: true } : i % 5 === 2 ? { bag: '#3B3F47' } : {}), walk = i % 7 === 3;
    T.actor({ sample: 0.3, period: L / V,
      at(t) { const d = HT.mod(t * V * (walk ? 1.8 : 1) + i * L / NR, L), y = 36.5 - d; const a = Math.min(1, d / 2, (L - d) / 2); if (a <= 0.03) return null; const ph = walk ? Math.floor(t * 4) % 8 : 0; return { x: EX + (i % 2 ? 0.55 : -0.55), y, z: ez(y), key: walk ? 'w' + ph : 's', ph: ph / 8, alpha: a < 1 ? a : null }; },
      draw(g, st) { HK.person(g, 0, 0, 0, Object.assign({}, look, { dir: 3, pose: walk ? 'walk' : (look.phone ? 'hold' : 'stand'), ph: st.ph || 0 })); } });
  }
  // walkers along each terrace street, a minibus at the foot
  HK.walker(T, HK.who(9931), [[-36, 26], [36, 26]], 1.0, { phase: 0.2 });
  HK.walker(T, HK.who(9932, { scarf: '#C8372D' }), [[36, 12.6], [-36, 12.6]], 0.9, { phase: 0.4, z: TZ[1] });
  HK.walker(T, HK.elder(9933, { cage: true }), [[-36, -4.4], [8, -4.4]], 0.6, { phase: 0.6, z: TZ[2] });
  HK.walker(T, HK.who(9934, { phone: true }), [[36, -20.6], [-36, -20.6]], 1.0, { phase: 0.1, z: TZ[3] });
  T.obj([20, 25.2, 30, 30], (g) => g.at(25, 27.6, 0, (g2) => HK.minibus(g2, Math.PI)), { name: 'minibus' });
  void onT;
});
