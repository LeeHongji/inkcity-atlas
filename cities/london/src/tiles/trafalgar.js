'use strict';
/* (0,-100) Trafalgar Square. What it is: a great paved square; at its south end Nelson's Column, a fluted granite
   column on a pedestal with bronze reliefs, Nelson on top, four black bronze lions on plinths at its foot; two
   fountains with sprays; the raised North Terrace with steps, and behind it the long National Gallery with its columned
   portico, pediment and dome; St Martin-in-the-Fields with its portico and white steeple on the east; Admiralty Arch
   on the south-west, its three arches opening towards the Mall; the fourth plinth with this year's sculpture, a giant
   ultramarine cockerel.
   Who is there: children climbing on the lions and people posing on them, a pavement artist chalking a picture, a
   busker with listeners, a "floating" street performer, a school party following its teacher, tourists everywhere.
   What moves: the fountain jets, pigeons wheeling and settling, walkers, flags on the Gallery. */
SF.tile('trafalgar', 0, -100, { rim: 14 }, function (T) {
  const H = 37, PS = { t: '#DCD5C3', l: '#ECE6D6', r: '#D2CAB6' }, GRAN = '#E4DFD4', TZ = 1.6;
  T.ground(function (g) {
    LK.ground(g, -H, -H, H, H, '#E1DDD2');
    LK.paving(g, -27, -22, 25, 24, { step: 3.4, col: GRAN, joint: '#D0CABD' });
    g.fill(K.rect(-H, 24, H, H), '#D9D5CB');
    for (const [x, y, rx, ry] of [[-6, 16, 2.4, 1.0], [16, 8, 1.8, 0.8], [-18, 2, 1.4, 0.7], [6, -16, 1.6, 0.7], [20, 28, 2.0, 0.9]]) LK.puddle(g, x, y, rx, ry, Math.round(x * 9 + y * 5 + 13));
    // the pavement artist's chalk picture (a Union flag and a landscape)
    { const P = (u, v) => g.p(14 + u, 15 + v, 0.02); const q = [P(0, 0), P(5, 0), P(5, 3.4), P(0, 3.4)]; g.fill2(q, '#F3F1EA', true); g.fill2([P(0.4, 0.3), P(2.4, 0.3), P(2.4, 3.1), P(0.4, 3.1)], '#8FB7D9', true); g.fill2([P(0.4, 2.0), P(1.2, 1.3), P(2.4, 2.2), P(2.4, 3.1), P(0.4, 3.1)], '#8FBF73', true); LK.unionFlag2(g, (u, v) => { const p = P(2.7 + u * 2.0, 0.4 + v * 2.6); return p; }); g.outline2(q, { w: 0.3, c: '#B9B2A4', boil: false }); }
  }, { rim: true });

  /* ---------------- the National Gallery and the North Terrace ---------------- */
  T.obj([-32, -36.5, 30, -29], function (g) {
    g.boilP = 0.25;
    const x0 = -32, x1 = 30, y0 = -36.5, y1 = -29, h = 10.5;
    K.box(g, x0, y0, x1, y1, 0, h, PS, { w: 0.9 });
    for (let x = x0 + 1.4; x < x1 - 1; x += 2.6) { if (Math.abs(x + 1) < 7) continue; K.win(g, 'L', y1 + 0.02, x, x + 1.1, 2.2, 5.0, { style: 'navy', arch: true }); K.win(g, 'L', y1 + 0.02, x + 0.1, x + 1.0, 6.4, 8.0, { style: 'navy' }); }
    K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, h, h + 0.7, '#E6E0D0', { w: 0.55, nohid: true, boil: false });
    // the portico: eight columns and a pediment
    K.box(g, -8, y1, 6, y1 + 3.2, TZ, h + 0.7, PS, { w: 0.7, nohid: true, faces: 't' });
    const cl = []; for (let x = -7.4; x <= 5.5; x += 1.85) { const a = g.p(x, y1 + 3.0, TZ), b = g.p(x, y1 + 3.0, h); cl.push(a[0], a[1], b[0], b[1]); } g.segs2(cl, '#F3EFE4', 1.6); g.segs2(cl, '#BDB5A0', 0.3);
    g.fill(K.on('L', y1 + 0.03, -8, 6, TZ, h), '#C9C1AC');
    const pd = [[-8.3, y1 + 3.2, h + 0.7], [6.3, y1 + 3.2, h + 0.7], [-1, y1 + 3.2, h + 3.2]]; g.fill(pd, '#ECE6D6'); g.outline(pd, { w: 0.7 });
    g.line([[-8, y1 + 3.2, h], [6, y1 + 3.2, h]], { w: 0.6, boil: false });
    // the dome and two little cupolas
    K.cyl(g, -1, y0 + 3.5, 2.6, h + 0.7, h + 3.0, PS, { w: 0.6, n: 12 }); K.dome(g, -1, y0 + 3.5, 2.6, h + 3.0, 3.2, '#8E9AA3', { shadow: '#76828C' });
    for (const x of [-22, 20]) { K.cyl(g, x, y0 + 3.5, 1.3, h + 0.7, h + 2.2, PS, { w: 0.5, n: 8 }); K.dome(g, x, y0 + 3.5, 1.3, h + 2.2, 1.5, '#8E9AA3'); }
    for (const x of [-20, 18]) LK.pole(g, x, y1 - 1, h + 0.7, 5);
    // at night: the portico floodlit, the front washed warm
    LK.flood(g, 0, 0.75, LK.FLOOD.warm, (c) => (c === '#8E9AA3' || c === '#76828C' ? mix(nightColour(c), '#C8945A', 0.2) : c === '#C9C1AC' ? '#C9A878' : undefined));
    for (const [x, z, r] of [[-1, 4, 3.2], [-1, 9, 2.6], [-5.5, 6, 2.2], [3.5, 6, 2.2]]) g.glow('lantern', x, y1 + 3.8, z, { r, col: '#FFDCA8' });
    for (const x of [-26, -16, 12, 22]) g.glow('lantern', x, y1 + 0.6, 3.5, { r: 2.0, col: '#FFDCA8' });
  }, { name: 'national gallery' });
  for (const x of [-20, 18]) LK.flag(T, x, -30, 16.2, { L: 2.6, H: 1.5, ph: x * 0.03 });
  // the North Terrace: a raised walk with a balustrade, steps down in the middle
  const terr = (x0, x1) => T.obj([x0, -29, x1, -22], (g) => {
    K.box(g, x0, -29, x1, -22, 0, TZ, { t: '#E6E1D6', l: '#D6D0C2', r: '#C9C2B2' }, { w: 0.7 });
    const b = []; for (let x = x0 + 0.3; x < x1; x += 0.7) { const a = g.p(x, -22, TZ), c = g.p(x, -22, TZ + 1.2); b.push(a[0], a[1], c[0], c[1]); } g.segs2(b, '#C9C1AC', 0.5); g.line([[x0, -22, TZ + 1.2], [x1, -22, TZ + 1.2]], { w: 0.6, boil: false });
  }, { name: 'terrace' });
  terr(-32, -6); terr(4, 30);
  T.obj([-6, -29, 4, -22], (g) => { for (let i = 0; i < 6; i++) { const y = -29 + i * 1.2, z = TZ * (1 - i / 6); g.fill(K.rect(-6, y, 4, y + 1.2, z), i % 2 ? '#E6E1D6' : '#DCD6C9'); g.fill(K.on('L', y + 1.2, -6, 4, z - TZ / 6, z), '#C9C2B2'); } g.line([[-6, -22, 0], [4, -22, 0]], { w: 0.6, boil: false }); }, { name: 'steps' });

  /* ---------------- St Martin-in-the-Fields ---------------- */
  T.obj([25, -36, 36, -16], function (g) {
    g.boilP = 0.3;
    K.box(g, 27, -34, 36, -18, 0, 9.5, PS, { w: 0.85 });
    for (let x = 28.4; x < 35; x += 2.4) { K.win(g, 'L', -17.98, x, x + 1.1, 1.4, 3.6, { style: 'navy', arch: true, lit: 0.9 }); K.win(g, 'L', -17.98, x, x + 1.1, 4.8, 8.0, { style: 'navy', arch: true, lit: 0.9 }); }   // (a concert by candlelight tonight)
    K.gable(g, 26.8, -34.2, 36.2, -17.8, 9.5, 3.0, 'x', { a: '#8E979E', b: '#7C858C', e: PS.l }, { w: 0.75 });
    K.box(g, 25, -32, 27, -20, 0, 10.4, PS, { w: 0.7, nohid: true });
    const cl = []; for (let y = -31.4; y <= -20.5; y += 1.8) { const a = g.p(25.1, y, 0.6), b = g.p(25.1, y, 9.6); cl.push(a[0], a[1], b[0], b[1]); } g.segs2(cl, '#F3EFE4', 1.5);
    const pd = [[25, -32, 10.4], [25, -20, 10.4], [25, -26, 12.6]]; g.fill(pd, '#ECE6D6'); g.outline(pd, { w: 0.6 });
    // the steeple rising from the roof above the portico: square stages, a clock, an obelisk spire
    K.box(g, 28, -27.6, 30.6, -24.4, 9.5, 15.5, PS, { w: 0.7, nohid: true });
    const d = g.p(29.3, -24.38, 13.2); g.disc2(d, 0.9, '#2E3A4A'); g.ring2(d, 0.9, { w: 0.3, c: '#D9A93E' });
    K.box(g, 28.3, -27.3, 30.3, -24.7, 15.5, 18.5, PS, { w: 0.6, nohid: true }); K.win(g, 'L', -24.68, 28.8, 29.8, 16.0, 18.0, { style: 'dark', arch: true, col: '#4A4E58', w: 0.3 });
    K.cyl(g, 29.3, -26, 1.0, 18.5, 20.5, PS, { w: 0.5, n: 8 });
    const sb = g.p(29.3, -26, 20.5), st = g.p(29.3, -26, 26.5); g.fill2([[sb[0] - 1.6, sb[1]], [sb[0] + 1.6, sb[1]], [st[0], st[1]]], '#F0EBDF'); g.fill2([[sb[0] + 0.2, sb[1]], [sb[0] + 1.6, sb[1]], [st[0], st[1]]], '#D6CFBF'); g.line2([[sb[0] - 1.6, sb[1]], [st[0], st[1]], [sb[0] + 1.6, sb[1]]], { w: 0.5, boil: false }); g.disc2([st[0], st[1] - 0.6], 0.45, '#D9A93E');
    // at night: the steeple and the portico floodlit
    LK.flood(g, 0, 0.9, LK.FLOOD.warm, (c) => (c === '#8E979E' || c === '#7C858C' ? mix(nightColour(c), '#C8945A', 0.18) : undefined));
    for (const [x, y, z, r] of [[24.4, -26, 4, 2.6], [24.4, -26, 9, 2.2], [29.3, -23.8, 12.5, 2.0], [29.3, -23.8, 17, 1.8], [29.3, -25.2, 22, 1.6]]) g.glow('lantern', x, y, z, { r, col: '#FFE2B4' });
  }, { name: 'st martin' });

  /* ---------------- Admiralty Arch ---------------- */
  T.obj([-37, 8, -29, 34], function (g) {
    g.boilP = 0.3;
    K.box(g, -37, 8, -29, 34, 0, 10, PS, { w: 0.85 });
    for (const [a, w, hh] of [[13, 2.4, 6.2], [21, 3.2, 7.4], [29, 2.4, 6.2]]) { const pts = [K.pt('R', -28.98, a - w, 0)]; for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10; pts.push(K.pt('R', -28.98, a - w * Math.cos(t), hh - w + w * Math.sin(t))); } pts.push(K.pt('R', -28.98, a + w, 0)); g.fill(pts, '#4A4640'); g.line(pts, { w: 0.6, boil: false }); }
    for (let y = 9.4; y < 33; y += 2.2) { if ([13, 21, 29].some((a) => Math.abs(y + 0.5 - a) < 3.6)) continue; K.win(g, 'R', -28.98, y, y + 1.0, 2.0, 4.4, { style: 'navy' }); }
    for (let y = 9.4; y < 33; y += 2.2) K.win(g, 'R', -28.98, y, y + 1.0, 7.0, 8.8, { style: 'navy' });
    K.box(g, -37.2, 7.8, -28.8, 34.2, 10, 10.7, '#E6E0D0', { w: 0.5, nohid: true, boil: false });
    for (const y of [11, 31]) { const s = g.p(-28.6, y, 10.7); g.fill2([[s[0] - 1.2, s[1]], [s[0] + 1.2, s[1]], [s[0] + 0.8, s[1] - 4.4], [s[0] - 0.8, s[1] - 4.4]], '#5E6B60', true); }
    // at night: floodlit, lamps in the three arches
    LK.flood(g, 0, 0.7, LK.FLOOD.warm);
    for (const a of [13, 21, 29]) g.glow('lamp', -28.4, a, a === 21 ? 5.4 : 4.4, { r: 1.4 });
  }, { name: 'admiralty arch' });

  /* ---------------- Nelson's Column, the lions, the fountains, the fourth plinth ---------------- */
  T.obj([-4, 0, 4, 8], function (g) {
    g.boilP = 0.3;
    const cx = 0, cy = 4, G = { t: '#D9D4C8', l: '#E2DDD0', r: '#C9C2B2' };
    K.box(g, cx - 3.6, cy - 3.6, cx + 3.6, cy + 3.6, 0, 0.8, G, { w: 0.6 });
    K.box(g, cx - 2.4, cy - 2.4, cx + 2.4, cy + 2.4, 0.8, 5.2, G, { w: 0.75 });
    for (const [f, p] of [['L', cy + 2.42], ['R', cx + 2.42]]) g.fill(K.on(f, p, -1.5 + (f === 'L' ? cx : cy), 1.5 + (f === 'L' ? cx : cy), 1.8, 4.2), '#5E6B60');
    K.box(g, cx - 1.7, cy - 1.7, cx + 1.7, cy + 1.7, 5.2, 7.0, G, { w: 0.6, nohid: true });
    K.cyl(g, cx, cy, 1.05, 7.0, 31, { t: '#E2DDD0', l: '#E6E1D5', r: '#C9C2B2' }, { w: 0.75, n: 12 });
    const fl = []; for (const a of [-0.2, 0.4, 1.0, 1.6, 2.2]) { const b = g.p(cx + Math.cos(a) * 1.05, cy + Math.sin(a) * 1.05, 7.4), t = g.p(cx + Math.cos(a) * 1.05, cy + Math.sin(a) * 1.05, 30.6); fl.push(b[0], b[1], t[0], t[1]); } g.segs2(fl, '#C9C2B2', 0.35);
    K.box(g, cx - 1.5, cy - 1.5, cx + 1.5, cy + 1.5, 31, 32.6, { t: '#5E6B60', l: '#6E7B70', r: '#4E5A50' }, { w: 0.6, nohid: true });
    LK.person(g, cx, cy, 32.6, { skin: '#6E7B70', hair: '#5E6B60', top: '#5E6B60', bot: '#5E6B60', shoe: '#4E5A50', hairStyle: 'bald', dir: 1, k: 1.0, ink: '#2E3630', cap: '#4E5A50' });
    // at night: the column floodlit white up its whole height
    LK.flood(g, 0, 1, LK.FLOOD.white);
    for (const [z, r] of [[3, 3.0], [10, 2.2], [18, 2.0], [26, 1.8]]) g.glow('lantern', cx + 1.3, cy + 1.3, z, { r, col: '#F2F0FF' });
  }, { name: "nelson's column" });
  const lion = (x, y, f) => T.obj([x - 2.4, y - 1.6, x + 2.4, y + 1.6], (g) => {
    K.box(g, x - 2.3, y - 1.4, x + 2.3, y + 1.4, 0, 2.2, { t: '#D9D4C8', l: '#E2DDD0', r: '#C9C2B2' }, { w: 0.6 }); LK.flood(g, 0, 0.5, LK.FLOOD.white);
    // a recumbent bronze lion: long low body, paws stretched forward, the head raised in a heavy mane
    const p = g.p(x, y, 2.2), s = (u, v) => [p[0] + f * u, p[1] + v], B = '#4A4E48', BD = '#363A35', BL = '#62675F';
    const body = K.curve([s(-6.8, 0), s(-7.0, -2.2), s(-5.4, -3.4), s(-1.0, -3.8), s(2.4, -3.6), s(3.4, -1.6), s(3.0, 0)], 3, true);
    g.fill2(body, B, true); g.fill2([s(-6.0, -2.8), s(-1.0, -3.7), s(2.0, -3.4), s(-1.2, -2.6)], BL, true);
    g.fill2([s(2.6, -0.2), s(7.4, -0.2), s(7.6, 0.4), s(2.4, 0.4)], BD, true); g.fill2([s(2.0, 0.2), s(6.8, 0.1), s(7.0, 0.7), s(1.8, 0.8)], B, true);
    const mane = K.curve([s(1.2, -1.0), s(1.0, -4.6), s(2.6, -7.0), s(5.0, -7.4), s(6.6, -5.8), s(6.4, -2.6), s(4.6, -0.8)], 3, true);
    g.fill2(mane, BD, true);
    const face = [s(4.4, -5.6), s(6.0, -6.0), s(7.4, -5.0), s(7.6, -3.6), s(6.4, -2.8), s(4.8, -3.4)]; g.fill2(face, B, true);
    g.disc2(s(6.4, -4.9), 0.32, '#C9C5BA'); g.fill2([s(7.2, -4.2), s(7.9, -3.9), s(7.6, -3.4)], BD, true);
    g.line2(body, { w: 0.4, c: '#1A1C1A', close: true, boil: false }); g.line2(mane, { w: 0.4, c: '#1A1C1A', close: true, boil: false });
    g.fill2([s(-7.0, -1.6), s(-8.6, -0.6), s(-8.8, 0.2), s(-7.6, 0)], BD, true);
  }, { name: 'lion' });
  lion(-6.8, 0.5, -1); lion(6.0, -1.4, 1); lion(-5.8, 9.4, -1); lion(6.6, 8.6, 1);
  const fountain = (x, y) => { T.obj([x - 5, y - 4, x + 5, y + 4], (g) => {
    const rim = []; for (let i = 0; i < 28; i++) { const a = TAU * i / 28; rim.push([x + Math.cos(a) * 5, y + Math.sin(a) * 3.6, 0]); }
    const top = rim.map((p) => [p[0], p[1], 1.1]); g.fill(rim.filter((p, i) => i < 15).concat(top.filter((p, i) => i < 15).reverse()), '#C9C2B2');
    g.fill(top, '#E2DDD0'); g.fill(top.map((p) => [x + (p[0] - x) * 0.86, y + (p[1] - y) * 0.86, 0.9]), '#A9C6CC'); g.mark({ nc: '#86CDE0' });   // lit from under the water at night
    g.water(top.map((p) => [x + (p[0] - x) * 0.7, y + (p[1] - y) * 0.7, 0.9]), { dens: 1.4, c: '#7FA0A6' }); g.outline(top, { w: 0.6, boil: false });
    K.cyl(g, x, y, 1.6, 0.9, 2.6, { t: '#D9D4C8', l: '#E2DDD0', r: '#C9C2B2' }, { w: 0.5, n: 10 }); K.cyl(g, x, y, 0.5, 2.6, 4.4, { t: '#D9D4C8', l: '#E2DDD0', r: '#C9C2B2' }, { w: 0.45, n: 8 });
    for (const [dx, dy] of [[-3, -1.4], [3, -1.4], [0, 2.6]]) { const p = g.p(x + dx, y + dy, 1.0); g.fill2([[p[0] - 1.4, p[1]], [p[0], p[1] - 1.6], [p[0] + 1.4, p[1]], [p[0], p[1] + 0.8]], '#5E6B60', true); }
    g.glow('neon', x, y, 2.4, { r: 4.0, col: '#9FE2F4' });
  }, { name: 'fountain' });
    T.actor({ sample: 5, period: 10, at(t) { const f = Math.floor(t * 8) % 4; return { x, y: y + 0.01, z: 0, key: f, f }; },
      draw(g, st) { const c = g.p(0, 0, 4.4), b = g.p(0, 0, 0.9); const h = 14 + st.f; const arcs = []; for (let i = 0; i < 8; i++) { const a = TAU * i / 8 + st.f * 0.2, dx = Math.cos(a) * 9, dy = Math.sin(a) * 3.6; const pts = []; for (let k = 0; k <= 8; k++) { const u = k / 8; pts.push([c[0] + dx * u, c[1] - h * 4 * u * (1 - u) * 0.55 + (b[1] - c[1] + dy) * u * u]); } g.line2(pts, { w: 0.5, c: '#E9F2F4', boil: false, wob: 0.2 }); arcs.push(pts[8]); }
        g.line2([[c[0], c[1]], [c[0], c[1] - h]], { w: 1.1, c: '#F3F8FA', boil: false, ext: 0 }); for (const p of arcs) g.disc2(p, 0.5, '#F3F8FA'); g.disc2([c[0], c[1] - h + 1.2], 0.55, 'rgba(243,248,250,0)'); g.mark({ nc: '#DDF6FF', light: true }); } });   // (the last disc: night only, the lit jet's crown)
  };
  fountain(-13, -9); fountain(12, -9);
  T.obj([-28, -12, -24, -8], (g) => {
    K.box(g, -28, -12, -24, -8, 0, 6.5, { t: '#D9D4C8', l: '#E2DDD0', r: '#C9C2B2' }, { w: 0.75 });
    const p = g.p(-26, -10, 6.5), s = (u, v) => [p[0] + u, p[1] + v], B = "#2F4FB4", BD = '#24408F';
    g.fill2([s(-5, 0), s(-6.4, -6), s(-3.4, -9.6), s(1.8, -8.4), s(3.6, -4.6), s(2.8, 0)], B, true);
    g.fill2([s(1.6, -8.2), s(2.6, -14.2), s(4.6, -15.2), s(5.8, -13.6), s(4.4, -10.4), s(3.6, -6.0)], B, true);
    g.fill2([s(-6.4, -6), s(-10.4, -14.6), s(-8.6, -15.4), s(-5.0, -11.4), s(-7.0, -16.6), s(-4.6, -16.2), s(-3.4, -9.6)], BD, true);
    g.fill2([s(4.6, -15.2), s(5.4, -17.2), s(6.0, -15.6), s(6.8, -17.0), s(6.8, -15.0)], '#2F4FB4', true); g.fill2([s(5.8, -13.8), s(7.8, -13.2), s(5.9, -12.6)], '#2F4FB4', true);
    g.line2([s(-5, 0), s(-6.4, -6), s(-10.4, -14.6), s(-8.6, -15.4), s(-5.0, -11.4), s(-3.4, -9.6), s(1.8, -8.4), s(2.6, -14.2), s(4.6, -15.2), s(5.8, -13.6), s(4.4, -10.4), s(3.6, -4.6), s(2.8, 0)], { w: 0.5, c: '#18285A', boil: false });
    g.line2([s(-1, 0), s(-1.2, 3.2)], { w: 0.6, c: '#18285A', boil: false, ext: 0 });
    LK.flood(g, 0, 0.6, LK.FLOOD.white, (c) => (c === '#2F4FB4' ? '#4466D8' : c === '#24408F' ? '#3654B8' : undefined)); g.glow('lantern', -24, -8, 3, { r: 2.4, col: '#E6ECFF' });
  }, { name: 'fourth plinth' });
  for (const [x, y] of [[-35, -18], [34, -6], [34, 8], [-20, 33], [10, 33]]) T.obj([x, y], (g) => LK.plane(g, x, y, { r: 4.4 }), { name: 'tree' });
  for (const [x, y] of [[-26, 22], [24, 22], [-26, -21], [24, -21]]) T.obj([x, y], (g) => LK.lamp(g, x, y, { h: 9.6 }), { name: 'lamp' });
  T.obj([30, 28], (g) => LK.phonebox(g, 30, 28), { name: 'phone box' });

  /* ---------------- the living layer ---------------- */
  // on the lions: children climbing, people posing, a photographer
  T.cast([-7.2, 1.6], (g) => { LK.person(g, -7.8, 0.6, 2.2, LK.who(5100, { dir: 1, pose: 'cheer', ph: 0.25, k: 0.75 })); LK.person(g, -6.0, 2.3, 0, LK.who(5101, { dir: 2, pose: 'hold', phone: true })); }, { on: true });
  T.cast([6.4, 0.3], (g) => { LK.person(g, 5.4, -1.2, 2.2, LK.who(5102, { dir: 0, pose: 'sit' })); LK.person(g, 7.2, -1.0, 2.2, LK.who(5103, { dir: 0, pose: 'wave', ph: 0.2, k: 0.8 })); }, { on: true });
  T.cast([7.2, 11.6], (g) => { LK.person(g, 7.6, 11.4, 0, LK.tourist(5104, { dir: 2, pose: 'hold', phone: true })); LK.person(g, 9.0, 12.4, 0, LK.tourist(5105, { dir: 2 })); }, { on: true });
  T.cast([-5.4, 10.4], (g) => LK.person(g, -5.6, 9.4, 2.2, LK.who(5106, { dir: 1, pose: 'cheer', ph: 0.4, k: 0.72 })), { on: true });
  // the pavement artist at work, onlookers
  T.cast([16.6, 18.6], (g) => { LK.person(g, 13.2, 16.8, 0, LK.who(5110, { dir: 0, pose: 'kneel', hands: [[3.4, -2.6], [2.0, -2.2]], cap: '#3B3F47' })); for (const [x, y, d, s] of [[20.4, 15.2, 2, 5111], [20.8, 17.6, 2, 5112], [16.6, 19.8, 3, 5113]]) LK.person(g, x, y, 0, LK.tourist(s, { dir: d })); }, { on: true });
  // the busker and his listeners
  T.cast([-18, 12], (g) => { const r = LK.person(g, -18.4, 11.0, 0, LK.who(5120, { dir: 1, pose: 'hold', top: '#2F343B', hairStyle: 'long' })); const h = r.hands[0]; g.fill2([[h[0] - 2.6, h[1] + 0.4], [h[0] + 1.4, h[1] - 1.6], [h[0] + 2.0, h[1] - 0.6], [h[0] - 1.8, h[1] + 1.6]], '#A0714B', true); g.disc2([h[0] - 1.6, h[1] + 0.8], 1.3, '#A0714B'); const cs = g.p(-17.2, 12.4, 0); g.fill2([[cs[0] - 1.8, cs[1]], [cs[0] + 1.8, cs[1] - 0.6], [cs[0] + 2.0, cs[1] + 0.4], [cs[0] - 1.6, cs[1] + 1.0]], '#2A2622', true); for (const [x, y, d, s] of [[-15.0, 14.0, 2, 5121], [-16.6, 15.6, 3, 5122], [-13.8, 12.2, 2, 5123]]) LK.person(g, x, y, 0, LK.who(s, { dir: d })); }, { on: true });
  // the "floating" performer: a robed figure sitting on air beside his staff
  T.cast([16, -16], (g) => { const b = g.p(16, -16, 0); g.fill2([[b[0] - 3.6, b[1]], [b[0] + 3.6, b[1]], [b[0] + 3.0, b[1] - 1.2], [b[0] - 3.0, b[1] - 1.2]], '#6E5A44', true); const st = g.p(17.4, -16, 0), stt = g.p(17.4, -16, 7.6); g.line2([st, stt], { w: 0.7, c: '#A0714B', boil: false, ext: 0 }); LK.person(g, 16, -16, 3.6, LK.who(5130, { dir: 1, pose: 'sit', dress: '#8E7A5A', top: '#8E7A5A', skin: '#6FA36B', hairStyle: 'bald', hands: [[3.0, -8.4], [2.2, -5.0]] })); }, { on: true });
  // a school party in uniform following its teacher
  for (let i = 0; i < 7; i++) LK.walker(T, LK.who(5140 + i, { k: 0.74, top: '#7A2E3A', bot: '#3B3F47', bare: false, shorts: false, dress: undefined, pack: i % 2 ? '#3F5F8F' : undefined }), [[-24, -19 + i * 0], [22, -19]], 1.2, { phase: 0.0 + i * 0.022 });
  LK.walker(T, LK.who(5150, { pose: 'walk', top: '#3F5F8F' }), [[-24, -19], [22, -19]], 1.2, { phase: 0.17 });
  // walkers crossing the square
  LK.walker(T, LK.who(5160, { umb: '#26314F' }), [[-25, 20], [24, 20]], 1.4, { phase: 0.3 });
  LK.walker(T, LK.tourist(5161), [[24, 6], [-25, 6]], 1.5, { phase: 0.6 });
  LK.walker(T, LK.who(5162), [[-10, 22], [-10, -20]], 1.3, { phase: 0.4 });
  LK.walker(T, LK.who(5163), [[18, -20], [18, 22]], 1.4, { phase: 0.8 });
  LK.walker(T, LK.tourist(5164), [[-20, -26], [24, -26]], 1.2, { phase: 0.2, z: TZ });
  // pigeons: a flock that wheels up and settles again
  for (let i = 0; i < 9; i++) T.actor({ sample: 0.5, period: 16,
    at(t) { const c = (t / 16 + i * 0.013) % 1, fly = c > 0.6, a = TAU * ((c - 0.6) / 0.4) + i * 0.7; const x = fly ? -2 + Math.cos(a) * (8 + i) : -4 + (i % 3) * 1.8 + 12, y = fly ? 14 + Math.sin(a) * 6 : 16 + Math.floor(i / 3) * 1.6, z = fly ? 6 + Math.sin(a * 2) * 2 + 8 * Math.sin(Math.PI * (c - 0.6) / 0.4) : 0, f = Math.floor(t * 6 + i) % 3; return { x, y, z, key: (fly ? 'f' : 'g') + f, fly, f }; },
    draw(g, st) { const o = g.p(0, 0, 0); if (st.fly) { const w = [3.0, 1.6, 0.8][st.f], d = [1.2, 0, -0.8][st.f]; g.line2([[o[0] - w, o[1] - d], [o[0], o[1]], [o[0] + w, o[1] - d]], { w: 0.6, c: '#6E7380', boil: false }); } else { const d = st.f === 1 ? 0.7 : 0; g.fill2([[o[0] - 1.0, o[1] - 0.8 + d * 0.3], [o[0] + 0.8, o[1] - 1.2 + d], [o[0] + 1.2, o[1] - 0.4 + d], [o[0], o[1]], [o[0] - 1.1, o[1] - 0.2]], '#8E939E', true); g.disc2([o[0] + 1.0, o[1] - 1.3 + d], 0.5, '#6E7380'); } } });
});
