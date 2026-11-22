'use strict';
/* (0,100) La Rambla, running along x through the middle of the tile (towards the port at +x), and Plaça Reial.
   Built: the wide central promenade (y -6..6) of pale paving with Miró's mosaic set into it, plane trees along its
   far edge, two flower kiosks; a one-way lane and a pavement on each side. On the far side, facing the Rambla: La
   Boqueria (the iron arch of stained glass with MERCAT DE SANT JOSEP over the stalls of fruit and hanging hams), a
   house, the Liceu (columns, arched windows, its name on the attic), houses at the corners. On the near side: Plaça
   Reial's palms, Gaudí's lamp-posts and the fountain of the Three Graces, café tables, then low arcaded houses along
   the near edge (they keep low so the Rambla stays in view).
   Who: shoppers with bags at the Boqueria, a juice seller, a human statue in gold with onlookers, flower sellers,
   people at the café tables in the square, a guitarist, pigeons. What moves: the gegants — the King and the Queen,
   four metres tall — dance down the promenade and back, spinning, with their band (a gralla and a drum) and a crowd
   walking along; strollers both ways; a taxi and a delivery scooter in the side lanes. */
SF.tile('rambla', 0, 100, { rim: 52 }, function (T) {
  const PROM = 6, LANE = 10, PAV = 13;
  T.ground(function (g) {
    BC.ground(g, '#E3DCCB');
    g.fill(K.rect(-37, -LANE, 37, -PROM), BP.asph); g.fill(K.rect(-37, PROM, 37, LANE), BP.asph);
    g.fill(K.rect(-37, -PROM, 37, PROM), '#E9E0CC');
    // the promenade's paving: long wavy bands (the Rambla's undulating tiles)
    const wv = []; for (let y = -PROM + 0.8; y < PROM; y += 1.1) { let prev = null; for (let x = -37; x <= 37; x += 1.2) { const p = g.p(x, y + Math.sin(x * 0.5 + y) * 0.35, 0); if (prev) wv.push(prev[0], prev[1], p[0], p[1]); prev = p; } }
    g.segs2(wv, '#D8CDB5', 0.3);
    for (const s of [-1, 1]) g.line([[-37, s * PROM, 0], [37, s * PROM, 0]], { w: 0.5, c: BP.kerb, boil: false, ext: 0 });
    for (const s of [-1, 1]) g.line([[-37, s * LANE, 0], [37, s * LANE, 0]], { w: 0.5, c: BP.kerb, boil: false, ext: 0 });
    // Miró's mosaic at the Pla de l'Os: a big circle of red, yellow and blue shapes
    const mc = [16, 0], ring = []; for (let i = 0; i < 24; i++) { const a = TAU * i / 24; ring.push([mc[0] + Math.cos(a) * 3.4, mc[1] + Math.sin(a) * 3.4, 0.01]); }
    g.fill(ring, '#EFE6D2'); g.outline(ring, { w: 0.45, c: '#2A2622', boil: false });
    g.fill(K.curve([[14, -1.6, 0.02], [16.5, -2.6, 0.02], [18, -0.6, 0.02], [16, 0.6, 0.02]], 3, true), '#C9392E');
    g.fill(K.curve([[14.2, 0.8, 0.02], [15.6, 0.4, 0.02], [16.4, 2.2, 0.02], [14.6, 2.4, 0.02]], 3, true), '#3F6FA8');
    g.fill(K.curve([[17.4, 0.9, 0.02], [18.8, 0.6, 0.02], [18.6, 2.0, 0.02]], 3, true), '#E6C24F');
    g.line([[13.2, -1, 0.02], [19, 1.6, 0.02]], { w: 0.5, c: '#2A2622', boil: false });
    // Plaça Reial: warm paving
    g.fill(K.rect(-34, PAV, 34, 30), '#E7DABE'); g.scuff(K.rect(-34, PAV, 34, 30), { dir: -0.6, len: 2.8, c: '#F2E8D2', dens: 0.5, w: 0.45, spread: 0.6 });
    // the far pavement
    g.scuff(K.rect(-37, -PAV, 37, -LANE), { dir: Math.atan2(AY, AX), len: 3, c: '#EFEAE0', dens: 0.6, w: 0.45, spread: 0.5 });
  }, { rim: true });

  const HOUSE = (poly, z, seed, o) => T.obj(BC.bbox(poly), (g) => BC.house(g, Object.assign({ poly, z, seed, gf: 4.4, fl: 3.2 }, o || {})), { name: 'house' });
  /* ---- the far side, facing the Rambla ---- */
  HOUSE([[-37, -27], [-30, -34], [-30, -13], [-37, -13]], 17, 41, { col: '#E9D0A8', flags: 0.3 });
  T.obj([-30, -37, -8, -13], function (g) {
    g.boilP = 0.2;
    // La Boqueria: the market hall behind, its iron roof; the entrance arch on the Rambla
    K.box(g, -30, -37, -8, -15, 0, 9, { t: '#D9D3C6', l: '#E6DDCB', r: '#CFC4AE' }, { w: 0.85 });
    K.gable(g, -30, -35, -8, -17, 9, 3.6, 'x', { a: '#9AA7A8', b: '#7F8C8E', e: '#E6DDCB' }, { c: '#4E5A5C' });
    const y1 = -15, a0 = -24, a1 = -14, m = (a0 + a1) / 2, w = (a1 - a0) / 2;
    // the arch: an iron frame, stained glass panels in its tympanum, the name on top
    const arch = [K.pt('L', y1 + 0.05, a0, 0), K.pt('L', y1 + 0.05, a1, 0)]; for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12; arch.push(K.pt('L', y1 + 0.05, m + Math.cos(t) * w, 7.5 + Math.sin(t) * 4.5)); }
    g.fill(arch, '#3A3F44'); g.mark({ nc: '#6A4A2E' });                // at night the hall behind the arch is lit
    // inside: the stalls under the market roof, pyramids of fruit, hams hanging, a stallholder
    const R = RNG(9101);
    for (let k = 0; k < 3; k++) { const z = 0.6 + k * 1.2; for (let x = a0 + 0.8; x < a1 - 0.6; x += 0.7) { const p = g.p(x, y1 + 0.08, z + 1.2); g.disc2(p, 0.85, R.pick(['#E07A3C', '#C9392E', '#E6C24F', '#8FBF73', '#D85A7A', '#F2B04A', '#7A3F6E'])); } }
    for (let x = a0 + 1.5; x < a1 - 1; x += 1.4) { const p = g.p(x, y1 + 0.08, 7.6); g.segs2([p[0], p[1] - 3, p[0], p[1]], '#5A4A3C', 0.25); g.fill2([[p[0] - 0.7, p[1]], [p[0] + 0.7, p[1]], [p[0] + 0.3, p[1] + 3.6], [p[0] - 0.3, p[1] + 3.2]], '#A8553E', true); }
    g.fill(K.on('L', y1 + 0.08, a0 + 0.4, a1 - 0.4, 3.6, 4.1), '#F3F1EA');
    const iG = g.cmds.length, gl = []; for (let i = 0; i < 7; i++) { const t0 = Math.PI * i / 7, t1 = Math.PI * (i + 1) / 7, q = [K.pt('L', y1 + 0.1, m, 7.5), K.pt('L', y1 + 0.1, m + Math.cos(t0) * w * 0.94, 7.5 + Math.sin(t0) * 4.2), K.pt('L', y1 + 0.1, m + Math.cos(t1) * w * 0.94, 7.5 + Math.sin(t1) * 4.2)]; g.fill(q, ['#E6C24F', '#4F8FBF', '#C9392E', '#7DBF9A', '#E07A5A', '#9A7CC0', '#E6C24F'][i]); gl.push(q); }
    g.fill(K.on('L', y1 + 0.1, a0, a1, 7.0, 7.6), '#2E3230');
    g.line(arch.slice(2), { w: 0.9, c: '#2E3230', boil: false }); for (const x of [a0, a1]) g.line([K.pt('L', y1 + 0.06, x, 0), K.pt('L', y1 + 0.06, x, 7.5)], { w: 0.9, c: '#2E3230', boil: false });
    const sg = K.on('L', y1 + 0.12, a0 - 1.2, a1 + 1.2, 12.3, 14.2); g.fill(sg, '#2E3230'); K.text(g, 'L', y1 + 0.18, m, 12.75, 1.0, 'MERCAT DE SANT JOSEP', '#E6C24F', { center: true });
    K.text(g, 'L', y1 + 0.14, m, 10.2, 0.75, 'BOQUERIA', '#F3F1EA', { center: true });
    // at night: the stained-glass fan lit from behind, the lettering shining, the fruit under the hall's lights
    g.mark({ nc: true }, iG); BC.litLines(g, iG); BC.nightCol(g, 0, (c, fill) => (fill ? BC.floodCol(c, 0.65, '#FFD49A') : undefined), { to: iG });
    for (const [x, z, r, col] of [[m, 9.6, 3.6, '#FFE0A0'], [m, 13.2, 2.4, '#FFE58A'], [m, 2.5, 3.0, '#FFD08A']]) g.glow('lantern', x, y1 + 0.4, z, { r, col });
    // the side bays: shopfronts under the arcade
    for (const [b0, b1] of [[-29.5, -25], [-13, -8.5]]) { const ib = g.cmds.length; g.fill(K.on('L', y1 + 0.03, b0, b1, 0, 4.5), '#E9D3A6'); g.mark({ nc: '#FFD98A', win: 1, spill: true }); for (let i = 0; i < 4; i++) { const p = g.p(lerp(b0 + 0.6, b1 - 0.6, i / 3), y1 + 0.05, 1.4); g.disc2(p, 1.0, R.pick(['#E07A3C', '#8FBF73', '#C9392E', '#E6C24F'])); } K.sign(g, 'L', y1, b0, b1, 4.6, 5.8, '#3E6E52', b0 < -20 ? 'FRUITES' : 'SUCS', { line: false, ink: '#F3E3B0' }); g.mark({ nc: true }, ib); BC.litLines(g, ib); g.glow('lantern', (b0 + b1) / 2, y1 + 0.3, 5.2, { r: 1.4, col: '#FFD9A0' }); }
  }, { name: 'boqueria' });
  HOUSE([[-8, -37], [4, -37], [4, -13], [-8, -13]], 18, 42, { col: '#ECD3B0', flags: 0.3, tribune: [2, 3, 9] });
  T.obj([4, -37, 28, -13], function (g) {
    g.boilP = 0.2;
    const y1 = -13, ST = { t: '#F0E4CC', l: '#E9D7B4', r: '#D3BF98' };
    K.box(g, 4, -37, 28, y1, 0, 15, ST, { w: 0.9 });
    // the Liceu: three arched doors under a canopy, a row of tall arched windows between paired columns, the name
    for (const x of [11, 16, 21]) { const ar = [K.pt('L', y1 + 0.04, x - 1.4, 0), K.pt('L', y1 + 0.04, x + 1.4, 0)]; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; ar.push(K.pt('L', y1 + 0.04, x + Math.cos(t) * 1.4, 3.2 + Math.sin(t) * 1.4)); } g.fill(ar, '#4A3A2C'); g.mark({ nc: '#FFC874', win: 1, spill: true }); g.line(ar.slice(2), { w: 0.4, boil: false }); }
    g.fill([[8, y1, 5.2], [24, y1, 5.2], [24, y1 + 2.2, 4.8], [8, y1 + 2.2, 4.8]], '#C9A86A'); g.outline([[8, y1, 5.2], [24, y1, 5.2], [24, y1 + 2.2, 4.8], [8, y1 + 2.2, 4.8]], { w: 0.5, boil: false });
    for (let x = 6.5; x < 27; x += 3.4) { K.win(g, 'L', y1, x, x + 1.6, 6.4, 11.2, { style: 'navy', arch: true, lit: 1 }); }
    const col = []; for (let x = 5.6; x < 28; x += 3.4) for (const d of [0, 2.4]) { const a = g.p(x + d, y1 + 0.3, 6.0), b = g.p(x + d, y1 + 0.3, 12); col.push(a[0], a[1], b[0], b[1]); } g.segs2(col, '#F6EEDB', 0.9);
    g.fill(K.on('L', y1 + 0.04, 4, 28, 12.4, 14.4), '#E2CFA8');
    const iT = g.cmds.length;
    K.text(g, 'L', y1 + 0.08, 16, 12.8, 1.1, 'GRAN TEATRE DEL LICEU', '#7A5A2C', { center: true });
    K.box(g, 3.7, -37.3, 28.3, y1 + 0.3, 15, 15.6, ST, { w: 0.6, nohid: true });
    // at night: the front floodlit, the canopy over the doors glowing with its lamps, the name lit
    BC.litLines(g, iT, '#FFD27A'); BC.nightCol(g, 0, (c, fill) => (fill && c === '#C9A86A' ? '#FFD58A' : undefined)); BC.flood(g, 0, 0.7);
    for (const x of [9, 13.5, 18.5, 23]) g.glow('lamp', x, y1 + 1.6, 4.7, { r: 1.1 });
    g.glow('lantern', 16, y1 + 0.3, 13.3, { r: 2.4, col: '#FFDCA0' });
  }, { name: 'liceu' });
  HOUSE([[28, -36], [37, -27], [37, -13], [28, -13]], 16, 43, { col: '#EAD9B6', flags: 0.3 });

  /* ---- the near edge: low arcaded houses of Plaça Reial ---- */
  HOUSE([[-34, 30], [-10, 30], [-10, 37], [-27, 37]], 11, 44, { col: '#E8C48E', shut: '#3E6E52', flags: 0.2 });
  HOUSE([[-8, 30], [14, 30], [14, 37], [-8, 37]], 11.5, 45, { col: '#E8C48E', shut: '#3E6E52', flags: 0.2 });
  HOUSE([[16, 30], [34, 30], [27, 37], [16, 37]], 10.5, 46, { col: '#E8C48E', shut: '#3E6E52', flags: 0.2 });

  /* ---- the Rambla's trees and kiosks ---- */
  for (let x = -33; x <= 33; x += 6.6) { if (Math.abs(x - 16) < 4 || (x > -28 && x < -5)) continue; T.obj([x, -PROM + 0.8], (g) => BC.plane(g, x, -PROM + 0.8, { r: 3.9, h: 6.6 }), { name: 'rambla tree' }); }
  for (const x of [-26, 30]) T.obj([x, PROM - 0.8], (g) => BC.plane(g, x, PROM - 0.8, { r: 3.6, h: 6.6 }), { name: 'rambla tree' });
  for (const x of [-32, 6]) T.obj([x - 2.2, -3.8, x + 2.2, -1.2], function (g) {
    K.box(g, x - 2.2, -3.8, x + 2.2, -1.2, 0, 4.6, { t: '#3E6E52', l: '#4C7E60', r: '#3E6E52' }, { w: 0.6 });
    K.box(g, x - 2.6, -4.2, x + 2.6, -0.8, 4.6, 5.1, { t: '#2C5240', l: '#3E6E52', r: '#2C5240' }, { w: 0.5, nohid: true });
    const R = RNG(x * 13 + 5); for (let i = 0; i < 9; i++) { const p = g.p(x - 2 + (i % 5) * 1.0, -0.7, 0.6 + Math.floor(i / 5) * 1.3); g.fill2([[p[0] - 0.5, p[1]], [p[0] + 0.5, p[1]], [p[0] + 0.4, p[1] - 1.1], [p[0] - 0.4, p[1] - 1.1]], '#7A6A55', true); g.disc2([p[0], p[1] - 2.0], 1.2, R.pick(['#E07A5A', '#E6C24F', '#D85A7A', '#F3F1EA', '#9A7CC0', '#C9392E'])); }
    const iS = g.cmds.length;
    K.sign(g, 'L', -1.2, x - 2, x + 2, 3.4, 4.3, '#3E6E52', 'FLORS', { line: false, ink: '#F3E3B0' });
    // at night the kiosk stays open: lamps under its eaves light the flowers, its sign lit
    BC.nightCol(g, 0, (c, fill) => (fill && c !== '#3E6E52' && c !== '#4C7E60' && c !== '#2C5240' ? BC.mixA(c, '#FFE2B0', 0.12) : undefined), { to: iS });
    g.mark({ nc: true }, iS); BC.litLines(g, iS);
    for (const dx of [-1.6, 1.6]) g.glow('lamp', x + dx, -0.6, 4.5, { r: 0.9 });
  }, { name: 'flower kiosk' });

  /* ---- Plaça Reial: palms, Gaudí's lamps, the fountain, café tables ---- */
  for (const [x, y] of [[-28, 18], [-14, 25], [10, 18], [24, 25], [-2, 16]]) T.obj([x, y], (g) => K.palm(g, x, y, { h: 13, r: 4.6 }), { name: 'palm' });
  for (const [x, y] of [[-20, 21], [16, 21]]) T.obj([x, y], function (g) {
    const f = g.p(x, y, 0), t = g.p(x, y, 9.5);
    g.fill2([[f[0] - 1.6, f[1]], [f[0] + 1.6, f[1]], [f[0] + 1.0, f[1] - 4], [f[0] - 1.0, f[1] - 4]], '#8A6A4A', true);
    g.fill2([[f[0] - 0.5, f[1] - 4], [f[0] + 0.5, f[1] - 4], [t[0] + 0.4, t[1]], [t[0] - 0.4, t[1]]], '#2E3230', true);
    for (let k = 0; k < 6; k++) { const a = TAU * k / 6, e = [t[0] + Math.cos(a) * 4.2, t[1] + Math.sin(a) * 1.4 - 1.5]; g.line2(K.curve([[t[0], t[1] + 1], [lerp(t[0], e[0], 0.5), t[1] - 2.4], e], 2, false), { w: 0.4, c: '#2E3230', boil: false }); g.disc2([e[0], e[1] + 0.9], 0.9, '#F3E3A8'); g.mark({ nc: '#FFF0C2' }); g.glow2('lantern', [e[0], e[1] + 0.9], f, { r: 1.2, col: '#FFE2A8' }); }
    g.glow2('lamp', [t[0], t[1] - 1], f, { r: 2.2 });                  // at night Gaudí's lamp lights the square
    g.fill2(arcPts(t[0], t[1] - 2.6, 1.6, Math.PI, TAU, 6), '#C9392E', true); g.disc2([t[0], t[1] - 4.6], 0.5, '#D8AE48');
  }, { name: 'gaudi lamp' });
  T.obj([-5.5, 20, 0.5, 26], function (g) {
    const c = [-2.5, 23]; K.cyl(g, c[0], c[1], 3.0, 0, 0.9, { t: '#9DC3CC', l: '#D9CDB4', r: '#C2B494' }, { w: 0.6, n: 16, top: '#9DC3CC' });
    K.cyl(g, c[0], c[1], 0.5, 0.9, 3.4, '#C9BFA8', { w: 0.45, n: 8 }); const t = g.p(c[0], c[1], 3.4); for (const d of [-1, 0, 1]) { g.fill2([[t[0] + d * 1.3 - 0.45, t[1]], [t[0] + d * 1.3 + 0.45, t[1]], [t[0] + d * 1.3 + 0.35, t[1] - 5], [t[0] + d * 1.3 - 0.35, t[1] - 5]], '#6E7A6A', true); g.disc2([t[0] + d * 1.3, t[1] - 5.6], 0.55, '#6E7A6A'); }
    g.segs2([t[0] - 0.4, t[1] - 6.4, t[0] - 3, t[1] - 1, t[0] + 0.4, t[1] - 6.4, t[0] + 3, t[1] - 1], '#BFE0E8', 0.45);
  }, { name: 'fountain' });
  // café tables in the square (each sitter drawn with the table)
  const table = (g, x, y, seed) => { const tt = g.p(x, y, 2.3), tb = g.p(x, y, 0); g.segs2([tb[0], tb[1], tt[0], tt[1]], '#3A3530', 0.45); g.fill2(arcPts(tt[0], tt[1], 2.3, 0, TAU, 10).map((q) => [q[0], tt[1] + (q[1] - tt[1]) * 0.45]), '#ECE8DF', true); g.mark({ nc: '#C9A472' }); g.fill2([[tt[0] - 0.4, tt[1]], [tt[0] + 0.4, tt[1]], [tt[0] + 0.5, tt[1] - 1.6], [tt[0] - 0.5, tt[1] - 1.6]], seed % 2 ? '#E3B23C' : '#C9584B', true); g.mark({ nc: '#FFC65A' }); g.glow2('lantern', [tt[0], tt[1] - 1.0], tb, { r: 0.8, col: '#FFC874' }); };   // at night a candle in a glass on each table
  for (const [x, y, s] of [[-30, 27.5, 5101], [-24, 28, 5102], [20, 27.5, 5103], [28, 27, 5104], [-9, 27.5, 5105], [4, 28, 5106]]) T.cast([x, y], (g) => { table(g, x + 1.2, y, s); BC.person(g, x, y, 1.3, BC.who(s, { dir: 0, pose: 'sit' })); BC.person(g, x + 2.4, y - 0.4, 1.3, BC.who(s + 50, { dir: 3, pose: 'sit' })); }, {});
  // a red-and-white parasol over the corner terrace
  T.obj([-27, 27], (g) => { const t = g.p(-27, 27, 6.4), b = g.p(-27, 27, 0); g.segs2([b[0], b[1], t[0], t[1]], '#6E6A60', 0.45); g.fill2(arcPts(t[0], t[1] + 2.6, 8.6, Math.PI * 1.08, Math.PI * 1.92, 10).concat([[t[0], t[1] - 1.2]]), '#C9392E', true); }, { name: 'parasol', bias: 2 });

  /* ---- people on the Rambla ---- */
  // the human statue in gold on his box, onlookers
  T.cast([-20, 2.5], (g) => { K.box(g, -20.8, 1.7, -19.2, 3.3, 0, 1.4, '#6E6A60', { w: 0.45, nohid: true }); BC.person(g, -20, 2.5, 1.4, { skin: '#D8B04A', hair: '#C9A23A', top: '#D8AE48', bot: '#D8AE48', shoe: '#C9A23A', dir: 1, pose: 'wave', ph: 0.25, hairStyle: 'short', ink: '#6E5220' }); }, {});
  for (const [x, y, s, d] of [[-17.5, 4.2, 5110, 2], [-18.8, 4.8, 5111, 2], [-22.4, 4.4, 5112, 3]]) T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(s, { dir: d, pose: s === 5110 ? 'hold' : 'stand', phone: s === 5110 })), {});
  // the Boqueria entrance: shoppers, a juice seller at his stand
  T.cast([-12, -11.5], (g) => { K.box(g, -13.2, -12.4, -10.8, -11.2, 0, 2.6, { t: '#E9E2CC', l: '#F3EFE3', r: '#DCD4C0' }, { w: 0.5, nohid: true }); const R = RNG(5120); for (let i = 0; i < 6; i++) { const p = g.p(-13 + i * 0.4, -11.3, 2.6); g.fill2([[p[0] - 0.4, p[1]], [p[0] + 0.4, p[1]], [p[0] + 0.45, p[1] - 1.4], [p[0] - 0.45, p[1] - 1.4]], R.pick(['#E07A3C', '#D85A7A', '#8FBF73', '#E6C24F', '#9A7CC0']), true); } BC.person(g, -14.2, -12.2, 0, BC.who(5121, { dir: 0, pose: 'stand', top: '#F3F1EA' })); }, {});
  for (const [x, y, s, d] of [[-18, -11.4, 5122, 3], [-16.6, -11.6, 5123, 2], [-20.5, -11.2, 5124, 1], [-9, -11.2, 5125, 2], [-23.5, -12, 5126, 0]]) T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(s, { dir: d, pose: 'stand', bag: '#E9DFC6' })), {});
  // strollers along the promenade both ways, and on the pavements
  for (let i = 0; i < 8; i++) { const y = -4.5 + (i % 4) * 2.6, dir = i % 2 ? 1 : -1, pts = dir > 0 ? [[-36, y], [36, y]] : [[36, y], [-36, y]]; BC.walker(T, BC.who(5130 + i, i % 3 === 0 ? { sunhat: true } : {}), pts, 1.1 + h1(i) * 0.4, { phase: h1(i * 7 + 2) }); }
  BC.walker(T, BC.who(5140), [[-36, -11.6], [36, -11.6]], 1.3, { phase: 0.3 }); BC.walker(T, BC.who(5141, { bag: '#C9584B' }), [[36, 11.6], [-36, 11.6]], 1.2, { phase: 0.6 });

  /* ---- the gegants and their band, dancing down the promenade and back ---- */
  const GP = 48, G0 = -26, G1 = 26;
  const gpos = (t, lag) => { const u = (((t - lag) / GP) % 1 + 1) % 1, f = u < 0.5 ? smooth(u * 2) : smooth(2 - u * 2); return { x: lerp(G0, G1, f), back: u >= 0.5, u }; };
  const giant = (look, lag, dy) => T.actor({ sample: 0.4, period: GP, grow: false,
    at(t) {
      const p = gpos(t, lag), spin = Math.floor(t * 3 + lag * 5) % 24, sp = (p.u > 0.47 && p.u < 0.53) || (p.u > 0.97 || p.u < 0.03) || Math.floor(t / 4 + lag) % 3 === 0;
      const facing = sp ? Math.floor(spin / 6) % 4 : (p.back ? 1 : 0), bob = Math.floor(t * 4) % 2;
      return { x: p.x, y: dy, key: facing + '.' + bob, f: facing, bob };
    },
    draw(g, st) {
      const F = g.p(0, 0, 0), s = (u, v) => [F[0] + u * 1.22, F[1] - v * 1.22], back = st.f >= 2, sg = (st.f === 0 || st.f === 3) ? 1 : -1, b = st.bob * 0.6;
      // the carrier's legs under the hem
      for (const d of [-1.2, 1.2]) g.fill2([s(d - 0.5, 0), s(d + 0.5, 0), s(d + 0.45, 4.5), s(d - 0.45, 4.5)], '#F3F1EA', true);
      // the robe: a wide bell to the ground, a cape, the torso
      const robe = K.curve([s(-7.2, 3.6 + b), s(-6.2, 14), s(-3.8, 26), s(3.8, 26), s(6.2, 14), s(7.2, 3.6 + b), s(0, 2.6 + b)], 3, true);
      g.fill2(robe, look.robe, true); g.fill2(K.curve([s(1.6, 26), s(4.8, 18), s(7.2, 3.6 + b), s(2.8, 3.2 + b), s(3.2, 16)], 3, true), shade(look.robe, 0.14), true);
      g.line2(robe, { w: 0.6, c: '#3A3128', close: true, boil: false, wob: 0.2 });
      for (const v of [8, 12]) g.line2([s(-6.6, v + b * 0.5), s(6.6, v + b * 0.5)], { w: 0.8, c: look.trim, boil: false, ext: 0 });
      if (look.cape) g.fill2(K.curve([s(-4.6, 30), s(-6.6, 18), s(-7.6, 6 + b), s(-4, 8), s(-3, 24)], 3, true), look.cape, true);
      // arms hanging stiffly, hands
      for (const d of [-1, 1]) { g.line2([s(d * 4.0, 29), s(d * 5.6, 18)], { w: 2.2, c: look.robe, boil: false, ext: 0 }); g.disc2(s(d * 5.8, 17), 1.0, look.skin); }
      // the collar and the big head with a crown
      g.fill2([s(-3.6, 29), s(3.6, 29), s(2.2, 31.4), s(-2.2, 31.4)], look.trim, true);
      const H = s(0, 35.5), HR = 3.6 * 1.22; g.fill2(arcPts(H[0], H[1], HR, 0, TAU, 16).map((q) => [q[0], H[1] + (q[1] - H[1]) * 1.12]), look.skin, true);
      if (!back) { g.disc2([H[0] + sg * 0.73 - 1.2, H[1] - 0.49], 0.38, '#2A2420'); g.disc2([H[0] + sg * 0.73 + 1.2, H[1] - 0.49], 0.38, '#2A2420'); g.fill2([[H[0] + sg * 0.73 - 1.0, H[1] + 2.2], [H[0] + sg * 0.73 + 1.0, H[1] + 2.2], [H[0] + sg * 0.73, H[1] + 2.81]], '#B5483A', true); g.disc2([H[0] + sg * 0.73 - 2.0, H[1] + 1.1], 0.6, '#E7A9A0'); g.disc2([H[0] + sg * 0.73 + 2.0, H[1] + 1.1], 0.6, '#E7A9A0'); }
      if (look.beard && !back) g.fill2(K.curve([[H[0] - 3.42, H[1] + 0.73], [H[0] + 3.42, H[1] + 0.73], [H[0] + 1.95, H[1] + 5.61], [H[0] - 1.95, H[1] + 5.61]], 3, true), look.hair, true);
      g.fill2(K.curve([[H[0] - 4.51, H[1] + (look.beard ? -0.4 : 2.6)], [H[0] - 4.15, H[1] - 2.93], [H[0], H[1] - 4.88], [H[0] + 4.15, H[1] - 2.93], [H[0] + 4.51, H[1] + (look.beard ? -0.4 : 2.6)], [H[0] + 2.93, H[1] - 2.2], [H[0] - 2.93, H[1] - 2.2]], 3, true), look.hair, true);
      if (back) g.fill2(K.curve([[H[0] - 4.39, H[1] - 1.22], [H[0] + 4.39, H[1] - 1.22], [H[0] + 3.66, H[1] + 4.39], [H[0] - 3.66, H[1] + 4.39]], 3, true), look.hair, true);
      const cr = [[H[0] - 3.42, H[1] - 3.9], [H[0] - 3.42, H[1] - 6.83], [H[0] - 1.95, H[1] - 5.61], [H[0], H[1] - 7.81], [H[0] + 1.95, H[1] - 5.61], [H[0] + 3.42, H[1] - 6.83], [H[0] + 3.42, H[1] - 3.9]];
      g.fill2(cr, '#D8AE48', true); g.line2(cr.concat([cr[0]]), { w: 0.35, c: '#8A6A2C', boil: false });
      g.line2(arcPts(H[0], H[1], HR, 0, TAU, 16).map((q) => [q[0], H[1] + (q[1] - H[1]) * 1.12]), { w: 0.45, c: '#3A3128', close: true, boil: false });
    } });
  giant({ robe: '#C9392E', trim: '#D8AE48', skin: '#EAC29C', hair: '#4A2E1E', beard: true, cape: '#3F5F8F' }, 0, -1.2);
  giant({ robe: '#3F6FA8', trim: '#F3F1EA', skin: '#F0CDAE', hair: '#2B2420', beard: false }, 1.6, 1.8);
  // the band behind them: a gralla player and a drummer
  for (let i = 0; i < 3; i++) {
    const look = BC.who(5150 + i, { top: '#3F5F8F', bot: '#2F343B', bare: false });
    T.actor({ sample: 0.25, period: GP,
      at(t) { const p = gpos(t, 3.4 + i * 0.9), dx = p.back ? 1 : -1, ph = Math.floor((t * 1.8) % 1 * 8); return { x: p.x, y: -3.4 + i * 2.4, key: (p.back ? 1 : 0) + '.' + ph, dir: p.back ? 2 : 0, ph: ph / 8, dx }; },
      draw(g, st) { const r = BC.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: 'walk', ph: st.ph, hands: i < 2 ? [[3.4, -16.8], [4.6, -15.6]] : [[3.0, -11.4], [2.0, -10]] })); if (i < 2) { const sg = st.dir === 0 ? 1 : -1, m = [r.head[0] + sg * 1.6, r.head[1] + 1.4], e = [m[0] + sg * 5.2, m[1] + 3.0]; g.line2([m, e], { w: 0.8, c: '#6B4A2C', boil: false, ext: 0 }); } else { const d = [r.hip[0] + 3.2, r.hip[1] + 0.5]; g.fill2([[d[0] - 2.2, d[1]], [d[0] + 2.2, d[1]], [d[0] + 2.2, d[1] + 2.4], [d[0] - 2.2, d[1] + 2.4]], '#C9392E', true); g.fill2(arcPts(d[0], d[1], 2.2, 0, TAU, 12).map((q) => [q[0], d[1] + (q[1] - d[1]) * 0.45]), '#E9D9B4', true); } } });
  }
  // a crowd that walks along with the giants
  for (let i = 0; i < 6; i++) { const look = BC.who(5160 + i, i % 2 ? { k: 0.75 } : {}); const yy = (i % 2 ? 3.6 : -4.4) + (i % 3) * 0.3;
    T.actor({ sample: 0.25, period: GP, at(t) { const p = gpos(t, -1.5 + i * 0.8), ph = Math.floor((t * 1.6 + i) % 1 * 8); return { x: p.x + (i % 3 - 1) * 2.2, y: yy, key: (p.back ? 1 : 0) + '.' + ph, dir: p.back ? 2 : 0, ph: ph / 8 }; }, draw(g, st) { BC.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: 'walk', ph: st.ph })); } }); }
  // traffic in the side lanes: a taxi towards the port, a delivery scooter back
  T.actor({ sample: 0.2, period: 14, at(t) { const u = (t / 14) % 1, x = lerp(-38, 38, u), a = Math.min(1, (37 - Math.abs(x)) / 5); if (a <= 0.02) return null; return { x, y: 8, key: 't', alpha: a < 1 ? a : null }; }, draw(g) { BC.taxi(g, 0); } });
  T.actor({ sample: 0.2, period: 11, at(t) { const u = (t / 11 + 0.4) % 1, x = lerp(38, -38, u), a = Math.min(1, (37 - Math.abs(x)) / 5); if (a <= 0.02) return null; return { x, y: -8, key: 's', alpha: a < 1 ? a : null }; }, draw(g) { BC.scooter(g, Math.PI, BC.who(5170, { bare: false, top: '#E07A3C' }), '#F1EFE8'); } });
  // pigeons pecking on the promenade
  for (let i = 0; i < 5; i++) { const x = 24 + (i % 3) * 1.4, y = 2 + Math.floor(i / 3) * 1.2; T.actor({ sample: 5, period: 2, at(t) { const f = Math.floor(t * 2 + i) % 2; return { x, y, key: f, f }; }, draw(g, st) { const c = g.p(0, 0, 0); g.fill2([[c[0] - 1.2, c[1] - 0.6], [c[0] + 0.8, c[1] - 1.0], [c[0] + 1.2, c[1] - 0.2], [c[0] - 0.8, c[1]]], '#9AA0A8', true); g.disc2([c[0] + (st.f ? 1.4 : 1.2), c[1] - (st.f ? 0.4 : 1.2)], 0.5, '#7A808A'); } }); }

  BC.block(T, { skip: { 'y-': [[-40, 40]] }, corners: { nn: 'bins', np: 'motos', pp: 'bicing', pn: 'kiosk' }, noTrees: ['y+'] });
});
