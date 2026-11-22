'use strict';
/* (100,0) St Katharine Docks, just east of Tower Bridge. What it is: an old dock basin held above the tidal river by
   a lock, ringed by stone quays, full of moored yachts and one red-sailed Thames barge; converted brick warehouses
   along the far side with loading doors and wall cranes; Ivory House, a white warehouse with arched windows and a
   clock turret, on the east quay; the Dickens Inn on the west quay, a three-storey timber-framed pub with wooden
   balconies overflowing with hanging baskets; the lock to the river with its gates and a little lifting footbridge.
   Who is there: drinkers standing outside the Dickens Inn with pints and on its balconies, diners under parasols, a
   yachtsman scrubbing his deck, a couple with a dog, an angler at the lock, joggers on the riverside walk.
   What moves: swans and their cygnets crossing the basin, walkers, burgee flags fluttering at the masts. */
SF.tile('katharine', 100, 0, { rim: 26 }, function (T) {
  const H = 37, RN = LT.RIV.N - 1.2, DW = -1.8, BX0 = -16, BX1 = 21, BY0 = -25, BY1 = 6, LX0 = 6, LX1 = 12;
  const QUAY = '#E4DFD3', WALL = '#C9C2B2', WAT = '#9DB9BC';
  T.ground(function (g) {
    LK.ground(g, -H, -H, H, RN, QUAY, { cut: 'x' });
    LK.paving(g, -H, -H, H, RN, { step: 3.2, col: QUAY });
    LK.paving(g, -H, 20, H, RN, { step: 2.4, col: '#E8E3D8' });
    // the basin and the lock: walls down to the dock water, the water, the near edges' copings
    const sunk = (x0, y0, x1, y1) => {
      g.fill(K.on('L', y0, x0, x1, DW, 0), WALL); g.fill(K.on('R', x0, y0, y1, DW, 0), shade(WALL, 0.08));
      const s = []; for (let z = DW + 0.6; z < 0; z += 0.6) { const a = g.p(x0, y0, z), b = g.p(x1, y0, z), c = g.p(x0, y1, z); s.push(a[0], a[1], b[0], b[1], a[0], a[1], c[0], c[1]); } g.segs2(s, '#AFA796', 0.25);
      g.fill(K.rect(x0, y0, x1, y1, DW), WAT); g.fill(K.rect(x0, y0, x1, y0 + 2.2, DW), '#8EABAE');
      g.water(K.rect(x0 + 1, y0 + 2, x1 - 1, y1 - 3, DW), { dens: 0.6, c: '#6F9093' });
      g.line([[x0, y1, 0], [x0, y0, 0], [x1, y0, 0]], { w: 0.8, boil: false }); g.line([[x0, y0, DW], [x1, y0, DW]], { w: 0.4, c: '#5E7E7E', boil: false }); g.line([[x0, y1, 0], [x1, y1, 0], [x1, y0, 0]], { w: 0.6, c: '#8E877A', boil: false });
    };
    sunk(BX0, BY0, BX1, BY1); sunk(LX0, BY1 - 0.01, LX1, RN);
    // the lock gates (dark timber) at both ends of the lock
    for (const y of [BY1 + 3, RN - 2.4]) { g.fill([[LX0, y, DW], [LX1, y, DW], [LX1, y, 0.1], [LX0, y, 0.1]], '#5A4232'); g.fill(K.rect(LX0, y - 0.5, LX1, y + 0.1, 0.1), '#7E5E44'); g.line([[LX0, y, 0.1], [LX1, y, 0.1]], { w: 0.5, boil: false }); }
    // pontoons floating in the basin
    for (const [x0, y0, x1, y1] of [[-12, -18, 14, -16.6], [-12, -8, 14, -6.6], [16, -22, 17.4, 2]]) { g.fill(K.rect(x0, y0, x1, y1, DW + 0.35), '#B48C62'); const s = []; for (let x = x0 + 0.8; x < x1; x += 0.8) { const a = g.p(x, y0, DW + 0.36), b = g.p(x, y1, DW + 0.36); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#8E6A48', 0.3); g.outline(K.rect(x0, y0, x1, y1, DW + 0.35), { w: 0.4, c: '#6E5236', boil: false }); }
    for (const [x, y, rx, ry] of [[-28, 14, 2.0, 0.9], [26, 12, 1.4, 0.7], [-6, 25, 1.6, 0.7], [30, -14, 1.2, 0.6]]) LK.puddle(g, x, y, rx, ry, Math.round(x * 5 + y * 13 + 70));
  }, { rim: true });

  /* ---------------- the far warehouses ---------------- */
  const wh = (x0, x1, st, col) => T.obj([x0, -36, x1, -28.5], (g) => {
    const H2 = st * 4.4; K.box(g, x0, -36, x1, -28.5, 0, H2, { t: shade(col, -0.2), l: col, r: shade(col, 0.13) }, { w: 0.85 });
    for (let x = x0 + 1.2; x < x1 - 1; x += 2.6) for (let s = 0; s < st; s++) K.win(g, 'L', -28.48, x, x + 1.1, s * 4.4 + 1.2, s * 4.4 + 3.4, { style: 'glass', arch: s === 0 });
    const m = (x0 + x1) / 2; for (let s = 1; s < st; s++) g.fill(K.on('L', -28.46, m - 0.9, m + 0.9, s * 4.4 + 0.6, s * 4.4 + 3.6), '#5A3E2E');
    const jt = g.p(m, -28.4, H2 - 0.6), jb = g.p(m + 2.2, -28.4 + 0.01, H2 - 0.6); g.line2([jt, [jt[0] + 3.2, jt[1] + 1.7]], { w: 0.7, c: '#2E2A26', boil: false, ext: 0 }); g.line2([[jt[0] + 3.2, jt[1] + 1.7], [jt[0] + 3.2, jt[1] + 9]], { w: 0.3, c: '#2E2A26', boil: false, ext: 0 }); void jb;
    K.box(g, x0 - 0.2, -36.2, x1 + 0.2, -28.3, H2, H2 + 0.6, shade(col, -0.1), { w: 0.5, boil: false, nohid: true });
  }, { name: 'warehouse' });
  wh(-36, -21, 4, LK.C.stock); wh(-21, -6, 5, LK.C.brick); wh(-6, 10, 4, '#C9A47E');
  // Ivory House: a white warehouse with arched ground-floor windows and a clock turret
  T.obj([23, -24, 35, -3], (g) => {
    const W = { t: '#E9E6DE', l: '#F3F1EA', r: '#DCD8CE' }; K.box(g, 23, -24, 35, -3, 0, 15, W, { w: 0.9 });
    for (let y = -22.5; y < -4; y += 2.5) for (let s = 0; s < 3; s++) K.win(g, 'R', 35.02, y, y + 1.1, s * 4.6 + 1.4, s * 4.6 + 3.6, { style: 'navy', arch: s === 0 });
    for (let x = 24.3; x < 34; x += 2.5) for (let s = 0; s < 3; s++) K.win(g, 'L', -2.98, x, x + 1.1, s * 4.6 + 1.4, s * 4.6 + 3.6, { style: 'navy', arch: s === 0 });
    K.box(g, 22.8, -24.2, 35.2, -2.8, 15, 15.6, '#E2DED3', { w: 0.5, nohid: true }); K.text(g, 'L', -2.96, 29, 13.2, 1.0, 'IVORY HOUSE', '#7A6A4A', { center: true, w: 0.5 });
    K.box(g, 27, -15.5, 31, -11.5, 15.6, 20.5, W, { w: 0.7, nohid: true });
    for (const [f, p, a] of [['L', -11.48, 29], ['R', 31.02, -13.5]]) { const dial = []; for (let i = 0; i < 16; i++) { const t = TAU * i / 16; dial.push(K.pt(f, p, a + Math.cos(t) * 1.3, 18 + Math.sin(t) * 1.3)); } g.fill(dial, '#F6F1E2'); g.outline(dial, { w: 0.45, c: '#3A3128', boil: false }); const c = g.p.apply(g, K.pt(f, p, a, 18)), h1 = g.p.apply(g, K.pt(f, p, a + 0.5, 18.6)), h2 = g.p.apply(g, K.pt(f, p, a, 19.0)); g.segs2([c[0], c[1], h1[0], h1[1], c[0], c[1], h2[0], h2[1]], '#2A2622', 0.4); }
    K.hip(g, 26.8, -15.7, 31.2, -11.3, 20.5, 2.4, LK.C.lead, { c: '#5A646C', w: 0.6 }); LK.pole(g, 29, -13.5, 22.9, 3.2);
  }, { name: 'ivory house' });
  LK.flag(T, 29, -13.5, 26.1, { L: 2.6, H: 1.4, ph: 0.4 });

  /* ---------------- the Dickens Inn ---------------- */
  T.obj([-35, -12, -25, 2], function (g) {
    g.boilP = 0.35;
    const x0 = -35, y0 = -12, x1 = -25, y1 = 2, TIM = '#5A3A26', PL = '#F1E8D2', BR = '#B9654C';
    K.box(g, x0, y0, x1, y1, 0, 4.4, { t: '#A9583F', l: BR, r: shade(BR, 0.12) }, { w: 0.85 });
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) { for (let a = a0 + 0.8; a < a1 - 1; a += 2.6) { const i1 = g.cmds.length; K.win(g, f, p + 0.02, a, a + 1.4, 0.9, 3.0, { style: 'glass' }); g.mark({ win: 1, nc: '#FFCB78', spill: true }, i1); } K.text(g, f, p + 0.03, (a0 + a1) / 2, 3.35, 0.7, 'DICKENS INN', '#E0B54A', { center: true, w: 0.45 }); }
    // timber-framed upper floors: plaster panels between dark posts and braces
    K.box(g, x0 - 0.4, y0 - 0.4, x1 + 0.4, y1 + 0.4, 4.4, 12.4, { t: '#E2D6BC', l: PL, r: '#DED2B8' }, { w: 0.85, nohid: true });
    for (const [f, p, a0, a1] of [['L', y1 + 0.42, x0 - 0.4, x1 + 0.4], ['R', x1 + 0.42, y0 - 0.4, y1 + 0.4]]) {
      const s = []; for (let a = a0; a <= a1 + 0.01; a += 1.6) { const b = g.p.apply(g, K.pt(f, p, a, 4.4)), t = g.p.apply(g, K.pt(f, p, a, 12.4)); s.push(b[0], b[1], t[0], t[1]); }
      for (const z of [4.4, 8.4, 12.4]) { const b = g.p.apply(g, K.pt(f, p, a0, z)), t = g.p.apply(g, K.pt(f, p, a1, z)); s.push(b[0], b[1], t[0], t[1]); }
      for (let a = a0; a < a1 - 1; a += 3.2) { const b = g.p.apply(g, K.pt(f, p, a, 4.4)), t = g.p.apply(g, K.pt(f, p, a + 1.6, 8.4)); s.push(b[0], b[1], t[0], t[1]); }
      g.segs2(s, TIM, 0.75);
      for (let a = a0 + 0.8; a < a1 - 0.5; a += 3.2) { K.win(g, f, p + 0.03, a, a + 1.0, 5.4, 7.4, { style: 'glass', w: 0.35, lit: 0.9 }); K.win(g, f, p + 0.03, a, a + 1.0, 9.4, 11.4, { style: 'glass', w: 0.35, lit: 0.8 }); }
    }
    // wooden balconies on both visible sides with baskets of flowers
    for (const z of [4.4, 8.4]) {
      K.box(g, x0, y1 + 0.4, x1 + 0.4, y1 + 2.0, z - 0.3, z, '#7E5638', { w: 0.45, boil: false, nohid: true });
      const rl = []; for (let x = x0; x <= x1 + 0.4; x += 0.7) { const a = g.p(x, y1 + 2.0, z), b = g.p(x, y1 + 2.0, z + 1.3); rl.push(a[0], a[1], b[0], b[1]); } g.segs2(rl, TIM, 0.4); g.line([[x0, y1 + 2.0, z + 1.3], [x1 + 0.4, y1 + 2.0, z + 1.3]], { w: 0.5, c: TIM, boil: false });
      K.blooms(g, x0 + 0.3, y1 + 1.4, x1, y1 + 2.0, z + 0.9, ['#E0503E', '#F3F1EA', '#D98AA4', '#E6C24F', '#B24A9E'], { sp: 0.7, r: 0.7 });
      for (let x = x0 + 1; x < x1; x += 2.6) LK.basket2(g, g.p(x, y1 + 1.9, z - 1.6), 0.9);
      for (let x = x0 + 2.3; x < x1; x += 5.2) g.glow('lamp', x, y1 + 1.8, z - 0.5, { r: 0.8 });       // lanterns under the balconies at night
    }
    // a steep tiled roof, the pub sign
    K.gable(g, x0 - 0.7, y0 - 0.7, x1 + 0.7, y1 + 0.7, 12.4, 4.2, 'y', { a: '#8E4A38', b: '#7A3E2E', e: PL }, { w: 0.8, c: '#5A2E22' });
    const c = g.p(x1 + 1.6, y1 + 2.6, 6.4); g.line2([g.p(x1 + 0.4, y1 + 0.4, 8.0), [c[0], c[1] - 3]], { w: 0.5, c: '#2E2A26', boil: false, ext: 0 }); g.fill2([[c[0] - 1.8, c[1] - 2.6], [c[0] + 1.8, c[1] - 2.6], [c[0] + 1.8, c[1] + 1.6], [c[0] - 1.8, c[1] + 1.6]], '#2E3A33', true); g.mark({ nc: '#3E5A48' }); g.fill2([[c[0] - 1.2, c[1] - 1.8], [c[0] + 1.2, c[1] - 1.8], [c[0] + 1.2, c[1] + 0.9], [c[0] - 1.2, c[1] + 0.9]], '#E0B54A', true); g.mark({ nc: true });
    g.glow2('lantern', [c[0], c[1] - 3.0], g.p(x1 + 1.6, y1 + 2.6, 0), { r: 1.8, col: '#FFD27A' });
    for (const [f, p, a] of [['L', y1 + 0.6, x0 + 1.5], ['L', y1 + 0.6, x1 - 1.5], ['R', x1 + 0.6, y0 + 1.5]]) g.glow('lamp', ...K.pt(f, p, a, 3.8), { r: 1.3, base: 0 });
  }, { name: 'dickens inn' });

  /* ---------------- moored boats ---------------- */
  const yacht = (x, y, ang, hull, cover, seed) => T.obj([x - 2.5, y - 2.5, x + 2.5, y + 2.5], (g) => g.at(x, y, DW, (g2) => {
    K.boat(g2, ang, { kind: 'row', L: 3.6, W: 1.2, hull, deck: '#C9A26B' });
    const ca = Math.cos(ang), sa = Math.sin(ang), m = g2.p(0.4 * ca, 0.4 * sa, 1.3), t = g2.p(0.4 * ca, 0.4 * sa, 11.5), bow = g2.p(4.0 * ca, 4.0 * sa, 1.5), bo = g2.p(-3.0 * ca, -3.0 * sa, 2.9);
    g2.line2([m, t], { w: 0.5, c: '#5A544C', boil: false, ext: 0 }); g2.fine2([t, bow], { w: 0.25, c: '#6B6458' }); g2.fine2([t, g2.p(-3.6 * ca, -3.6 * sa, 1.5)], { w: 0.22, c: '#6B6458' });
    const bm = [[m[0], m[1] - 5.2], [bo[0], bo[1]]]; g2.line2(bm, { w: 0.9, c: cover, boil: false, ext: 0 });
    const R = RNG(seed), b = [t[0], t[1] + 0.4]; g2.fill2([[b[0], b[1]], [b[0] + 2.2, b[1] + 0.5], [b[0], b[1] + 1.0]], R.pick(['#C8372D', '#26314F', '#E6C24F']), true);
    const al = [t[0], t[1] + 0.6]; g2.disc2(al, 0.4, 'rgba(255,255,255,0)'); g2.mark({ nc: '#FFF6DE' }); g2.glow2('lantern', al, g2.p(0, 0, 0), { r: 0.9, col: '#FFF6DE' });   // the anchor light at night
  }), { name: 'yacht' });
  [[-9, -20.5, 0.03, '#F3F1EA', '#3F5F8F'], [-3, -20.8, -0.02, '#F3F1EA', '#2F343B'], [3.5, -20.4, 0.05, '#E9E2CF', '#3F6B4E'], [9.5, -20.6, 0, '#F3F1EA', '#3F5F8F'],
    [-8, -11.0, 0, '#F3F1EA', '#2B3A55'], [-1.5, -11.2, 0.04, '#26314F', '#E9E6DE'], [10, -11.0, -0.03, '#F3F1EA', '#3F5F8F'], [-6, -3.6, 0, '#F3F1EA', '#3F6B4E'], [6, -3.4, 0.02, '#E9E2CF', '#2F343B']]
    .forEach(([x, y, a, h, c], i) => yacht(x, y, a, h, c, 800 + i));
  // the Thames sailing barge moored by the east pontoon: a black hull, a tall mast, its red-brown sail brailed up
  T.obj([12.5, -18, 15.5, -4], (g) => g.at(14, -11, DW, (g2) => {
    K.boat(g2, Math.PI / 2, { kind: 'row', L: 6.2, W: 1.5, hull: '#2A2622', deck: '#9A7A56' });
    const m = g2.p(0, 1.2, 1.4), t = g2.p(0, 1.2, 15.5); g2.line2([m, t], { w: 0.8, c: '#4A3A2C', boil: false, ext: 0 });
    const sp = [[m[0], m[1] - 7], [t[0] + 2.6, t[1] + 6]]; g2.line2(sp, { w: 0.5, c: '#4A3A2C', boil: false, ext: 0 });
    g2.fill2([[m[0] - 0.9, m[1] - 4], [m[0] + 0.9, m[1] - 4], [t[0] + 0.9, t[1] + 2.5], [t[0] - 0.6, t[1] + 2.5]], '#A9502E', true);
    g2.line2([[m[0] - 0.9, m[1] - 4], [t[0] - 0.6, t[1] + 2.5]], { w: 0.4, c: '#6E3420', boil: false });
    const lb = g2.p(1.6, 1.0, 0.8); g2.fill2([[lb[0] - 1.6, lb[1] - 0.8], [lb[0] + 1.6, lb[1] + 0.2], [lb[0] + 1.4, lb[1] + 1.4], [lb[0] - 1.4, lb[1] + 0.6]], '#3A2A1E', true);
    const al = [t[0], t[1] + 1.0]; g2.disc2(al, 0.4, 'rgba(255,255,255,0)'); g2.mark({ nc: '#FFF6DE' }); g2.glow2('lantern', al, g2.p(0, 0, 0), { r: 0.9, col: '#FFF6DE' });
  }), { name: 'barge' });
  // the lifting footbridge over the lock (down)
  T.obj([LX0 - 0.6, 20.4, LX1 + 0.6, 25.6], (g) => { K.box(g, LX0 - 0.6, 20.4, LX1 + 0.6, 25.6, -0.4, 0.1, { t: '#B9C9D6', l: '#7FA6C6', r: '#5F86A8' }, { w: 0.55 }); for (const y of [20.5, 25.5]) { const rl = []; for (let x = LX0 - 0.6; x <= LX1 + 0.6; x += 0.6) { const a = g.p(x, y, 0.1), b = g.p(x, y, 1.2); rl.push(a[0], a[1], b[0], b[1]); } g.segs2(rl, '#2F4A63', 0.3); g.line([[LX0 - 0.6, y, 1.2], [LX1 + 0.6, y, 1.2]], { w: 0.45, c: '#2F4A63', boil: false }); } }, { name: 'footbridge' });
  // the river parapet with a gap at the lock, parasols and tables, trees, lamps
  for (const [x0, x1] of [[-H, -16], [-16, LX0], [LX1, 25], [25, H]]) T.obj([x0, RN - 0.7, x1, RN], (g) => K.box(g, x0, RN - 0.7, x1, RN, 0, 1.3, { t: '#D9D4C8', l: '#CFC9BB', r: '#BDB6A6' }, { w: 0.55, boil: false }), { name: 'parapet' });
  for (const [x, y] of [[-20.5, -10], [-20.5, -3], [-20.5, 4]]) T.obj([x - 2.4, y - 2.4, x + 2.4, y + 2.4], (g) => {
    K.cyl(g, x, y, 0.9, 0, 1.9, { t: '#E9E6DE', l: '#D9D4C8', r: '#BDB6A6' }, { w: 0.4, n: 8 });
    const t = g.p(x, y, 5.6), b = g.p(x, y, 1.9); g.line2([b, t], { w: 0.45, c: '#5A544C', boil: false, ext: 0 });
    const cn = arcPts(t[0], t[1] + 1.4, 9.0, 0, TAU, 12).map((q) => [q[0], t[1] + 1.4 + (q[1] - t[1] - 1.4) * 0.42]); g.fill2(cn.concat(), '#F3F1EA', true); g.fill2(cn.slice(0, 7).concat([[t[0], t[1] - 0.8]]), '#2E4A3A', true); g.line2(cn, { w: 0.4, c: '#5A544C', close: true, boil: false });
    g.glow('lamp', x, y, 4.6, { r: 1.0 });                                                          // a lamp under the parasol at night
  }, { name: 'parasol' });
  for (const [x, y] of [[-30, 12], [-14, 13], [24, 9], [33, 15], [33, -30]]) T.obj([x, y], (g) => LK.plane(g, x, y, { r: 4.6 }), { name: 'tree' });
  for (const x of [-24, 2, 30]) T.obj([x, 27.2], (g) => LK.lamp(g, x, 27.2), { name: 'lamp' });

  /* ---------------- the living layer ---------------- */
  // drinkers standing outside the Dickens Inn with pints, more on the balconies
  T.cast([-23.8, 4], (g) => {
    const D = [[-24.6, 3.0, 1], [-23.0, 4.0, 2], [-25.4, 5.6, 0], [-23.6, 6.4, 3], [-22.0, 2.0, 1], [-26.6, 7.2, 0], [-24.4, 8.4, 3]];
    D.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])).forEach(([x, y, d], i) => LK.person(g, x, y, 0, (i % 3 === 1 ? LK.banker : LK.who)(3100 + i, { dir: d, pose: 'hold', pint: i % 4 === 2 ? '#B9443A' : '#E9B53C' })));
  }, { on: true });
  T.cast([-21.6, -6.6], (g) => { for (const [x, y, d, s] of [[-22.2, -8.6, 2, 3110], [-19.0, -10.6, 1, 3111], [-22.2, -1.6, 2, 3112], [-19.0, -3.6, 1, 3113], [-19.0, 3.4, 1, 3114]]) LK.person(g, x, y, 0, LK.who(s, { dir: d, pose: 'sit' })); }, { on: true });
  for (const [x, z, s] of [[-31, 4.4, 3120], [-28, 4.4, 3121], [-30, 8.4, 3122]]) T.cast([x, 3.2], (g) => LK.person(g, x, 3.2, z, LK.who(s, { dir: 1, pose: 'hold', pint: '#E9B53C', noLegs: true })), { on: true });
  // a yachtsman scrubbing his deck, an angler at the lock, a couple with a dog
  T.cast([3.5, -20.4], (g) => LK.person(g, 3.0, -20.6, DW + 1.3, LK.who(3130, { dir: 0, pose: 'crouch', top: '#26314F', cap: '#F3F1EA' })), { on: true });
  T.cast([13.2, 21], (g) => { const r = LK.person(g, 13.4, 21, 0, LK.who(3131, { dir: 2, pose: 'hold', top: '#3F6B4E', cap: '#3B3F47' })); const h = r.hands[0]; g.line2([h, [h[0] - 9, h[1] - 7]], { w: 0.35, c: '#4A3A2C', boil: false, ext: 0 }); g.fine2([[h[0] - 9, h[1] - 7], [h[0] - 11, h[1] + 6]], { w: 0.2, c: '#6B6458' }); }, { on: true });
  // swans and cygnets crossing the basin
  for (let i = 0; i < 4; i++) T.actor({ sample: 0.3, period: 60,
    at(t) { const u = ((t / 60 + 0.1) % 1), x = lerp(-12, 18, u) - i * 1.7, y = -14 + Math.sin(u * TAU) * 1.5 + (i % 2) * 0.4; return { x, y, z: DW, key: i ? 'c' : 's' }; },
    draw(g, st) { const o = g.p(0, 0, 0), s = st.key === 's' ? 1 : 0.6, col = st.key === 's' ? '#FBFAF6' : '#B9B4A8'; g.fill2([[o[0] - 2.4 * s, o[1] - 0.2], [o[0] + 1.6 * s, o[1] - 0.6 * s], [o[0] + 1.8 * s, o[1] + 0.4], [o[0] - 2.0 * s, o[1] + 0.6]], col, true); g.fill2([[o[0] - 2.6 * s, o[1] - 1.4 * s], [o[0] - 1.0 * s, o[1] - 1.2 * s], [o[0] - 1.2 * s, o[1] - 0.2]], col, true); if (st.key === 's') { g.line2([[o[0] + 1.2, o[1] - 0.6], [o[0] + 1.6, o[1] - 3.6], [o[0] + 2.4, o[1] - 4.0]], { w: 0.8, c: col, boil: false, ext: 0 }); g.fill2([[o[0] + 2.4, o[1] - 4.3], [o[0] + 3.4, o[1] - 3.8], [o[0] + 2.4, o[1] - 3.7]], '#E08A3C', true); } g.line2([[o[0] - 2.4 * s, o[1] - 0.2], [o[0] + 1.8 * s, o[1] + 0.4]], { w: 0.3, c: '#8E897E', boil: false }); } });
  // walkers on the quays and the riverside
  LK.walker(T, LK.who(3140, { dog: '#C9A26B' }), [[-15, 10], [3.5, 10]], 1.2, { phase: 0.3 });
  LK.walker(T, LK.who(3141, { shorts: true, bare: true, top: '#E6C24F' }), [[-36, 24], [36, 24]], 3.0, { phase: 0.1 });
  LK.walker(T, LK.tourist(3142), [[36, 21.5], [-36, 21.5]], 1.4, { phase: 0.6 });
  LK.walker(T, LK.who(3143, { umb: '#3F6B4E' }), [[22, -1], [22, -26], [36, -26]], 1.3, { phase: 0.4 });
  LK.walker(T, LK.banker(3144), [[-15, -27], [20, -27]], 1.6, { phase: 0.8 });
  LK.walker(T, LK.who(3145), [[-18, 9], [-18, -26]], 1.3, { phase: 0.5 });
});
