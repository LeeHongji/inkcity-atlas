'use strict';
/* (100,-100) The City. What it is: the Square Mile, where Wren's St Paul's Cathedral (Portland stone, the two baroque
   west towers, the long nave, the great lead dome on its colonnaded drum, the lantern with its golden ball and cross)
   now stands among glass towers: the Gherkin (a bulging bullet wrapped in a spiral of dark glass), the Walkie-Talkie
   (wider at the top than at the bottom, a garden under its glass crown) and the Cheesegrater (a steep wedge with its
   bracing showing). Near the front, Leadenhall Market: a glass-roofed Victorian arcade in maroon and cream ironwork.
   Who is there: bankers in dark suits striding with briefcases and coffees, an after-work crowd drinking outside the
   market's pub, a cab rank, a pigeon-feeder on the cathedral steps, tourists photographing the dome.
   What moves: hurrying walkers, a window cleaner's cradle sliding down the Walkie-Talkie, a flag on the cathedral. */
SF.tile('city', 100, -100, { rim: 24 }, function (T) {
  const H = 37, PS = { t: '#DCD5C3', l: '#ECE6D6', r: '#D2CAB6' }, GL = '#8FAABB', GLD = '#6E8A9C';
  T.ground(function (g) {
    LK.ground(g, -H, -H, H, H, '#E0DCD2', { cut: 'x' });
    LK.paving(g, -H, -H, H, H, { step: 3.0, col: '#E0DCD2', joint: '#CFCABE' });
    g.fill(K.rect(-36, 0, 6, 30), '#E6E1D5'); K.lawn(g, -34, 22, -20, 30, { col: '#A8CB7E', dens: 0.6 });
    for (const [x, y, rx, ry] of [[10, -4, 2.0, 0.9], [22, 30, 1.6, 0.7], [-10, 32, 1.4, 0.7], [30, -10, 1.8, 0.7]]) LK.puddle(g, x, y, rx, ry, Math.round(x * 13 + y * 3 + 7));
  }, { rim: true });

  /* ---------------- St Paul's Cathedral ---------------- */
  T.obj([-35, 4, 4, 22], function (g) {
    g.boilP = 0.25;
    const y0 = 8.5, y1 = 17.5, ym = 13, xc = -12;
    // nave and choir with aisles, the transepts, the apse
    K.box(g, -30, y0, 1, y1, 0, 6.2, PS, { w: 0.85 });
    K.box(g, -30, y0 + 1.6, 1, y1 - 1.6, 6.2, 10.6, PS, { w: 0.8, nohid: true });
    for (let x = -28.6; x < 0; x += 2.6) { if (Math.abs(x - xc) < 4) continue; K.win(g, 'L', y1 + 0.02, x, x + 1.0, 1.4, 4.2, { style: 'navy', arch: true }); K.win(g, 'L', y1 - 1.58, x + 0.1, x + 0.9, 7.2, 9.6, { style: 'navy', arch: true }); }
    K.gable(g, -30.2, y0 + 1.4, 1.2, y1 - 1.4, 10.6, 2.0, 'x', { a: '#8E9AA3', b: '#7C878F', e: PS.l }, { w: 0.6 });
    K.box(g, xc - 3.5, 5, xc + 3.5, 21, 0, 10.6, PS, { w: 0.8 });
    K.win(g, 'L', 21.02, xc - 1.0, xc + 1.0, 2.4, 6.8, { style: 'navy', arch: true });
    const pd = [[xc - 3.7, 21.05, 10.6], [xc + 3.7, 21.05, 10.6], [xc, 21.05, 12.6]]; g.fill(pd, '#ECE6D6'); g.outline(pd, { w: 0.6 });
    const cl = []; for (let x = xc - 3.0; x <= xc + 3.1; x += 1.5) { const a = g.p(x, 21.4, 0.4), b = g.p(x, 21.4, 6.4); cl.push(a[0], a[1], b[0], b[1]); } g.segs2(cl, '#F3EFE4', 1.2);
    K.cyl(g, 1, ym, 4.4, 0, 9.6, PS, { w: 0.7, n: 12 }); K.dome(g, 1, ym, 4.4, 9.6, 2.4, '#8E9AA3');
    // the dome: a colonnaded drum, the upper drum, the lead dome with ribs, the lantern, the golden ball and cross
    K.cyl(g, xc, ym, 6.2, 10.6, 15.0, PS, { w: 0.8, n: 20 });
    const col = []; for (let i = 0; i < 16; i++) { const a = -Math.PI * 0.26 + Math.PI * 1.02 * i / 15, p = g.p(xc + Math.cos(a) * 6.25, ym + Math.sin(a) * 6.25, 11.0), q = g.p(xc + Math.cos(a) * 6.25, ym + Math.sin(a) * 6.25, 14.4); col.push(p[0], p[1], q[0], q[1]); } g.segs2(col, '#B9B19C', 0.7);
    K.cyl(g, xc, ym, 6.6, 15.0, 15.7, '#E6E0D0', { w: 0.6, n: 20 });
    K.cyl(g, xc, ym, 5.1, 15.7, 17.6, PS, { w: 0.7, n: 18 });
    K.dome(g, xc, ym, 5.1, 17.6, 6.6, '#909DA6', { shadow: '#76828C', ribs: 16, ribCol: '#6E7A84', ribW: 0.45 });
    K.cyl(g, xc, ym, 1.2, 24.2, 27.4, PS, { w: 0.55, n: 8 }); K.cone(g, xc, ym, 1.4, 27.4, 1.4, '#909DA6');
    const b = g.p(xc, ym, 29.0); g.disc2(b, 0.9, '#E0B54A'); g.line2([[b[0], b[1] - 0.8], [b[0], b[1] - 3.6]], { w: 0.5, c: '#D9A93E', boil: false, ext: 0 }); g.line2([[b[0] - 1.0, b[1] - 2.6], [b[0] + 1.0, b[1] - 2.6]], { w: 0.5, c: '#D9A93E', boil: false, ext: 0 });
    // the west towers and the two-tier portico on the west front
    for (const yy of [y0 + 0.2, y1 - 0.2]) { const ya = yy - 1.8, yb = yy + 1.8; K.box(g, -34, ya, -30, yb, 0, 11.0, PS, { w: 0.75 }); K.cyl(g, -32, yy, 1.7, 11.0, 15.4, PS, { w: 0.6, n: 10 }); const sc = []; for (const a of [-0.5, 0.4, 1.3, 2.2]) { const p = g.p(-32 + Math.cos(a) * 1.7, yy + Math.sin(a) * 1.7, 11.4), q = g.p(-32 + Math.cos(a) * 1.7, yy + Math.sin(a) * 1.7, 15.0); sc.push(p[0], p[1], q[0], q[1]); } g.segs2(sc, '#B9B19C', 0.6); K.dome(g, -32, yy, 1.8, 15.4, 2.2, '#909DA6'); K.cone(g, -32, yy, 0.6, 17.4, 2.0, '#909DA6'); const q = g.p(-32, yy, 19.6); g.disc2(q, 0.4, '#E0B54A'); }
    K.box(g, -34.5, y0 + 2, -30, y1 - 2, 0, 12.4, PS, { w: 0.7, nohid: true });
    const wp = [[-30, y1 - 2, 12.4], [-30, y0 + 2, 12.4], [-30, ym, 14.2]]; g.fill(wp, '#ECE6D6'); g.outline(wp, { w: 0.6 });
    // at night: floodlit, the great dome glowing pale over the City, the golden ball and cross shining
    LK.flood(g, 0, 0.9, LK.FLOOD.warm, (c) => (c === '#E0B54A' ? '#FAD06A' : undefined));
    for (const [x, y, z, r] of [[xc + 4.6, ym + 4.6, 12.5, 3.2], [xc + 3.4, ym + 3.4, 20.5, 3.0], [xc + 1.0, ym + 1.0, 25.8, 1.8], [-29.4, ym, 6.5, 2.6], [-29.4, ym, 11, 2.0], [xc, 21.6, 4, 2.4], [-31, y1 + 1.6, 9, 1.8], [-6, y1 + 0.6, 3.5, 2.0]]) g.glow('lantern', x, y, z, { r, col: '#FFE2B0' });
    g.glow('lantern', xc, ym, 29.0, { r: 1.4, col: '#FFD27A' });
  }, { name: "st paul's" });
  // the cathedral steps on the west, a flag
  T.obj([-37, 6, -34.5, 20], (g) => { for (let i = 0; i < 4; i++) K.box(g, -37 + i * 0.6, 6 + i * 0.3, -34.5, 20 - i * 0.3, i * 0.3, (i + 1) * 0.3, { t: '#E6E1D6', l: '#DCD6C9', r: '#C9C2B2' }, { w: 0.4, boil: false, nohid: true }); }, { name: 'steps' });

  /* ---------------- the towers ---------------- */
  // the Gherkin: a bulging round tower wrapped in spirals of dark glass
  T.obj([-28, -33, -16, -21], function (g) {
    g.boilP = 0.2;
    // a bullet: widest a third of the way up, curving in to a rounded glass cap; six dark spirals wind round it
    const cx = -22, cy = -27, Z = 40, rad = (z) => { const t = z / Z; return Math.max(0.05, 4.3 * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.33) / 0.67, 2))) * (t < 0.33 ? 0.86 + 0.14 * t / 0.33 : 1)); };
    const K2 = AX * Math.SQRT2, L = [], R = [];
    for (let z = 0; z <= Z; z += 0.8) { const p = g.p(cx, cy, z), r = rad(z) * K2; L.push([p[0] - r, p[1]]); R.push([p[0] + r, p[1]]); }
    const sil = L.concat(R.slice().reverse()); g.fill2(sil, '#A7BFCC');
    g.fill2(R.map((p, i) => [lerp(L[i][0], p[0], 0.58), p[1]]).concat(R.slice().reverse()), '#86A2B4');
    // spirals: bands of dark glass on the visible half (angle -45 .. 135 degrees from +x)
    for (let k = 0; k < 6; k++) { const band = []; const back = []; for (let z = 0; z <= Z - 2; z += 0.8) { const a = z * 0.13 + k * TAU / 6, u = Math.cos(a - Math.PI * 0.25); if (u < -0.05) { if (band.length > 2) { g.fill2(band.concat(back.reverse()), '#3E5566'); } band.length = 0; back.length = 0; continue; } const r = rad(z), p = g.p(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z), q = g.p(cx + Math.cos(a + 0.28) * r, cy + Math.sin(a + 0.28) * r, z); band.push(p); back.push(q); } if (band.length > 2) g.fill2(band.concat(back.reverse()), '#3E5566'); }
    const gr = []; for (let z = 2; z < Z - 1; z += 2.4) { const i = Math.round(z / 0.8); gr.push(L[i][0], L[i][1], R[i][0], R[i][1]); } g.segs2(gr, '#C3D3DC', 0.3);
    g.line2(sil, { w: 0.85, c: '#3E4E5A', close: true, boil: false });
    // at night: its offices lit through the glass, the dome at the top (a bar) glowing warm
    const GN = { '#A7BFCC': '#536F8C', '#86A2B4': '#425C78', '#3E5566': '#2C3E52' };
    g.mark({ nc: (c) => GN[c] }, 0);
    { const R = RNG(31); for (let z = 1.2; z < Z - 5; z += 2.0) for (let k = 0; k < 5; k++) { if (R() > 0.6) continue; const a0 = -Math.PI * 0.25 + Math.PI * (k + 0.1) / 5, a1 = -Math.PI * 0.25 + Math.PI * (k + 0.9) / 5, za = z + 0.35, zb = z + 1.4, q = [];
      for (let i = 0; i <= 3; i++) { const a = lerp(a0, a1, i / 3); q.push([cx + Math.cos(a) * rad(za) * 0.995, cy + Math.sin(a) * rad(za) * 0.995, za]); }
      for (let i = 3; i >= 0; i--) { const a = lerp(a0, a1, i / 3); q.push([cx + Math.cos(a) * rad(zb) * 0.995, cy + Math.sin(a) * rad(zb) * 0.995, zb]); }
      g.fill(q, 'rgba(255,255,255,0)'); g.mark({ nc: R() < 0.7 ? '#F2E6C4' : '#DCE8F4' }); } }
    for (const [z, r] of [[10, 2.4], [24, 2.2]]) g.glow('lantern', cx + 2.4, cy + 2.4, z, { r, col: '#E6EEFF' });
    g.glow('lantern', cx, cy, Z - 2.4, { r: 2.4, col: '#FFD9A0' });
  }, { name: 'gherkin' });
  // the Walkie-Talkie: wider at the top, the sky garden under its crown
  T.obj([-6, -36, 9, -24], function (g) {
    g.boilP = 0.2;
    const Z = 34, x0 = -3, x1 = 6, y0 = -34, y1 = -26, bul = (z) => 2.6 * Math.pow(z / Z, 1.6);
    const L = (z) => y1 + bul(z), Rr = (z) => x1 + bul(z) * 0.6;
    const fl = [], fr = []; for (let z = 0; z <= Z; z += 2) { fl.push([x0, L(z), z]); fr.push([x1 + bul(z) * 0.0, L(z), z]); }
    const face = [[x0, y1, 0], [x1, y1, 0]].concat(fl.map((p) => [x1, p[1], p[2]]).slice(1)).concat(fl.slice().reverse().map((p) => [x0, p[1], p[2]]));
    g.fill(face, '#A9C0CE');
    const side = []; for (let z = 0; z <= Z; z += 2) side.push([Rr(z), y0, z]); const sf = [[x1, y0, 0], [x1, L(0), 0]].concat(fl.map((p) => [Rr(p[2]), p[1], p[2]]).slice(1), side.slice().reverse());
    g.fill(sf, '#7F9BAE');
    const ln = []; for (let z = 2; z < Z; z += 1.6) { const a = g.p(x0, L(z), z), b = g.p(Rr(z), L(z), z), c = g.p(Rr(z), y0, z); ln.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); } g.segs2(ln, '#C9D8E0', 0.3);
    const vl = []; for (let x = x0 + 1.5; x < x1; x += 1.5) { const a = g.p(x, L(0), 0), b = g.p(x, L(Z - 2), Z - 2); vl.push(a[0], a[1], b[0], b[1]); } g.segs2(vl, '#8EA7B6', 0.3);
    const top = [[x0, y0, Z], [Rr(Z), y0, Z], [Rr(Z), L(Z), Z], [x0, L(Z), Z]]; g.fill(top, '#8FB078'); g.fill([[x0, L(Z), Z], [Rr(Z), L(Z), Z], [Rr(Z), L(Z) - 1.6, Z + 2.6], [x0, L(Z) - 1.6, Z + 2.6]], '#CFE0E8');
    g.outline(face, { w: 0.85, boil: false }); g.line([[Rr(0), y0, 0], ...side.slice(1)], { w: 0.7, boil: false });
    g.line([[x0, L(Z) - 1.6, Z + 2.6], [Rr(Z), L(Z) - 1.6, Z + 2.6], [Rr(Z), L(Z), Z]], { w: 0.6, boil: false });
    // at night: the offices lit behind the glass, the Sky Garden under its crown lit warm and green
    const WT = { '#A9C0CE': '#506E8C', '#7F9BAE': '#3E5A78', '#8FB078': '#8FBE76', '#CFE0E8': '#FFE2A8' };
    g.mark({ nc: (c) => WT[c] }, 0);
    LK.floorBands(g, (z) => [x0 + 0.3, L(z) + 0.02, z], (z) => [x1 - 0.3, L(z) + 0.02, z], 1.0, Z - 1.5, { step: 1.6, n: 4, seed: 41 });
    LK.floorBands(g, (z) => [Rr(z) + 0.02, L(z) - 0.3, z], (z) => [Rr(z) + 0.02, y0 + 0.3, z], 1.0, Z - 1.5, { step: 1.6, n: 4, seed: 42, share: 0.5 });
    for (const [z, r] of [[10, 2.4], [22, 2.2]]) g.glow('lantern', 1.5, L(z) + 0.6, z, { r, col: '#E6EEFF' });
    g.glow('lantern', 1.5, L(Z) - 0.8, Z + 1.2, { r: 3.4, col: '#FFDCA0' }); g.glow('lantern', Rr(Z) - 1, -30, Z + 0.8, { r: 2.4, col: '#FFDCA0' });
  }, { name: 'walkie-talkie' });
  // the Cheesegrater: a steep wedge, its bracing showing on the sloping face
  T.obj([12, -36, 26, -22], function (g) {
    g.boilP = 0.2;
    const x0 = 13, x1 = 25, y0 = -35, Z = 38, yb = -22.5, yt = -33.5;
    const L = [[x0, yb, 0], [x1, yb, 0], [x1, yt, Z], [x0, yt, Z]];
    g.fill(L, '#B3C6D2'); g.fill([[x1, y0, 0], [x1, yb, 0], [x1, yt, Z], [x1, y0, Z]], '#8EA7B6');
    const br = []; for (let i = 0; i < 6; i++) { const t0 = i / 6, t1 = (i + 1) / 6, za = Z * t0, zb = Z * t1, ya = lerp(yb, yt, t0), ybb = lerp(yb, yt, t1); const a = g.p(x0, ya, za), b = g.p(x1, ybb, zb), c = g.p(x1, ya, za), d = g.p(x0, ybb, zb); br.push(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]); } g.segs2(br, '#E6E3DA', 0.7);
    const hz = []; for (let z = 3; z < Z; z += 3) { const a = g.p(x0, lerp(yb, yt, z / Z), z), b = g.p(x1, lerp(yb, yt, z / Z), z); hz.push(a[0], a[1], b[0], b[1]); } g.segs2(hz, '#9AB0BE', 0.3);
    g.fill([[x1 + 0.01, yb + 0.1, 0], [x1 + 0.01, yb - 2.0, 0], [x1 + 0.01, yb - 2.0, 6], [x1 + 0.01, yb + 0.1, 6]], '#E6A23C');
    g.outline(L, { w: 0.85, boil: false }); g.line([[x1, y0, 0], [x1, y0, Z], [x1, yt, Z]], { w: 0.75, boil: false }); g.line([[x0, yt, Z], [x0, y0, Z], [x1, y0, Z]], { w: 0.6, boil: false });
    // at night: the offices lit behind the glass, the orange of its lift core shining
    const CG = { '#B3C6D2': '#56738F', '#8EA7B6': '#3E5A76', '#E6A23C': '#FFB24A' };
    g.mark({ nc: (c) => CG[c] }, 0);
    LK.floorBands(g, (z) => [x0 + 0.3, lerp(yb, yt, z / Z) + 0.02, z], (z) => [x1 - 0.3, lerp(yb, yt, z / Z) + 0.02, z], 0.8, Z - 1.5, { step: 1.5, n: 4, seed: 43 });
    LK.floorBands(g, (z) => [x1 + 0.02, lerp(yb, yt, z / Z) - 0.3, z], (z) => [x1 + 0.02, y0 + 0.3, z], 0.8, Z - 1.5, { step: 1.5, n: 3, seed: 44, share: 0.5 });
    for (const [z, r] of [[8, 2.4], [22, 2.2]]) g.glow('lantern', 19, lerp(yb, yt, z / Z) + 0.6, z, { r, col: '#E6EEFF' });
    g.glow('neon', x1 + 0.4, yb - 1, 3, { r: 2.4, col: '#FFB24A' });
  }, { name: 'cheesegrater' });
  // a plain City block or two to fill the skyline's feet
  T.obj([-14, -22, -4, -12], (g) => { K.box(g, -14, -22, -4, -12, 0, 14, { t: '#C9D1D6', l: '#DCE3E6', r: '#B9C4CA' }, { w: 0.8 }); for (let z = 1.5; z < 13; z += 2.2) { K.win(g, 'L', -11.98, -13.4, -4.6, z, z + 1.2, { style: 'glass' }); K.win(g, 'R', -3.98, -21.4, -12.6, z, z + 1.2, { style: 'glass' }); } }, { name: 'office' });
  T.obj([22, -18, 34, -6], (g) => { K.box(g, 22, -18, 34, -6, 0, 11, { t: '#D6CFBF', l: '#E3DCCB', r: '#CFC6B2' }, { w: 0.8 }); for (let x = 23; x < 33; x += 2.2) for (let s = 0; s < 3; s++) K.win(g, 'L', -5.98, x, x + 1.1, s * 3.4 + 1.2, s * 3.4 + 3.0, { style: 'navy' }); for (let y = -17; y < -7; y += 2.2) for (let s = 0; s < 3; s++) K.win(g, 'R', 34.02, y, y + 1.1, s * 3.4 + 1.2, s * 3.4 + 3.0, { style: 'navy' }); K.box(g, 21.8, -18.2, 34.2, -5.8, 11, 11.6, '#E6E0D0', { w: 0.5, nohid: true }); }, { name: 'bank' });

  /* ---------------- Leadenhall Market ---------------- */
  T.obj([10, 4, 34, 15], function (g) {
    g.boilP = 0.3;
    const x0 = 10, x1 = 34, y0 = 5, y1 = 14, MAR = '#8E2F3A', CRE = '#EDE3C8', h = 7.6;
    // shopfronts along the two sides of the arcade, the glass barrel roof on cream and maroon ironwork
    K.box(g, x0, y0, x1, y0 + 2.6, 0, h, { t: '#C9BDA0', l: CRE, r: '#D9CCAA' }, { w: 0.7 });
    const SHOP = ['THE LAMB', 'CHEESE', 'FLOWERS', 'BOOKS', 'COFFEE', 'SHIRTS', 'WINE', 'BREAD']; let si = 0; for (let x = x0 + 0.8; x < x1 - 1; x += 3.0) { g.fill(K.on('L', y0 + 2.62, x, x + 2.4, 0, 3.6), MAR); g.fill(K.on('L', y0 + 2.64, x + 0.3, x + 2.1, 0.4, 3.0), '#E9CF92'); g.mark({ win: 1, nc: '#FFD08A' }); const i1 = g.cmds.length; K.sign(g, 'L', y0 + 2.64, x, x + 2.4, 3.8, 4.6, '#3F6B4E', SHOP[si++ % SHOP.length], { ink: '#F3E3B0', line: false }); g.mark({ nc: '#4A8A62' }, i1); }
    const arch = (x) => { const pts = []; for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10; pts.push([x, (y0 + y1) / 2 - Math.cos(t) * (y1 - y0) / 2, h + Math.sin(t) * 2.6]); } return pts; };
    const roof = []; for (let i = 0; i <= 10; i++) roof.push(arch(x0)[i]); for (let i = 10; i >= 0; i--) roof.push(arch(x1)[i]);
    g.fill(arch(x0).concat(arch(x1).slice().reverse()), '#CFDFE6'); g.mark({ nc: '#E8D6A8' });   // the glass roof lit from inside at night
    const rb = []; for (let x = x0; x <= x1; x += 2.0) { const pts = arch(x); for (let i = 0; i < pts.length - 1; i++) { const a = g.p.apply(g, pts[i]), b = g.p.apply(g, pts[i + 1]); rb.push(a[0], a[1], b[0], b[1]); } } g.segs2(rb, MAR, 0.45);
    for (const i of [0, 3, 5, 7, 10]) g.fine([arch(x0)[i], arch(x1)[i]], { w: 0.35, c: MAR });
    K.box(g, x0, y1 - 2.6, x1, y1, 0, h, { t: '#C9BDA0', l: CRE, r: '#D9CCAA' }, { w: 0.75, faces: 'lr' });
    for (let x = x0 + 0.8; x < x1 - 1; x += 3.0) { g.fill(K.on('L', y1 + 0.02, x, x + 2.4, 0.4, 3.0), '#E9CF92'); g.mark({ win: 1, nc: '#FFCB78', spill: true }); g.fill(K.on('L', y1 + 0.02, x, x + 2.4, 3.2, 4.0), MAR); K.win(g, 'L', y1 + 0.02, x + 0.5, x + 1.9, 4.8, 6.8, { style: 'navy', arch: true }); }
    // the arcade's entrance arch on the east end, maroon with a gilded dragon
    const ea = [K.pt('R', x1 + 0.02, y0 + 2.6, 0)]; for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10; ea.push(K.pt('R', x1 + 0.02, (y0 + y1) / 2 - Math.cos(t) * 1.9, 5.2 + Math.sin(t) * 1.9)); } ea.push(K.pt('R', x1 + 0.02, y1 - 2.6, 0));
    g.fill(K.on('R', x1 + 0.01, y0 + 2.6, y1 - 2.6, 0, h + 2.6), MAR); g.fill(ea, '#4A3A30'); g.mark({ nc: '#C08C56', spill: true }); g.outline(K.on('R', x1 + 0.01, y0 + 2.6, y1 - 2.6, 0, h + 2.6), { w: 0.6, boil: false });
    const dr = g.p(x1 + 0.03, (y0 + y1) / 2, h + 1.6); g.disc2(dr, 1.0, '#D9A93E'); K.text(g, 'R', x1 + 0.04, (y0 + y1) / 2, h + 0.1, 0.55, 'LEADENHALL MARKET', '#E0B54A', { center: true, w: 0.4 });
    // at night: lanterns hang down the arcade, the entrance glows
    for (let x = x0 + 2; x < x1 - 1; x += 4) g.glow('lamp', x, (y0 + y1) / 2, h - 0.8, { r: 1.5 });
    g.glow('lantern', x1 + 0.6, (y0 + y1) / 2, h + 1.6, { r: 1.8, col: '#FFD27A' });
  }, { name: 'leadenhall' });
  // a cab rank on the east side of the cathedral: three black cabs waiting
  for (const [x, i] of [[12, 0], [22, 1]]) T.obj([x - 5, 18, x + 5, 23], (g) => g.at(x, 20.5, 0, (g2) => LK.cab(g2, 0)), { name: 'cab rank' });
  for (const [x, y] of [[-36, -6], [-20, -6], [36, 26], [-28, 34], [8, 34]]) T.obj([x, y], (g) => LK.plane(g, x, y, { r: 4.2 }), { name: 'tree' });
  T.obj([6, 2], (g) => LK.pillar(g, 6, 2), { name: 'pillar box' });
  T.ground(function (g) { LK.tube(g, 34, 20, { axis: 'y' }); });
  T.obj([32, 18.6], (g) => LK.roundel(g, 32, 18.6, { name: 'BANK' }), { name: 'roundel' });

  /* ---------------- the living layer ---------------- */
  // the after-work crowd drinking outside the market's pub
  T.cast([22, 16.4], (g) => { const P = [[12, 15.6, 1], [14.2, 16.6, 2], [16.4, 15.4, 1], [18.6, 16.8, 3], [21, 15.6, 2], [23.4, 16.6, 1], [25.6, 15.4, 3], [28, 16.6, 2], [30.2, 15.6, 1]]; P.forEach(([x, y, d], i) => LK.person(g, x, y, 0, LK.banker(6100 + i, { dir: d, pose: 'hold', pint: i % 3 === 1 ? '#F3EFE4' : '#E9B53C', bag: undefined, umb: undefined }))); }, { on: true });
  // tourists photographing the dome, a pigeon-feeder on the steps
  T.cast([-16, 27], (g) => { for (const [x, y, d, s] of [[-18, 27, 3, 6110], [-15.6, 27.6, 2, 6111], [-13, 26.6, 3, 6112]]) LK.person(g, x, y, 0, LK.tourist(s, { dir: d, pose: 'hold', phone: true })); }, { on: true });
  T.cast([-35.6, 22], (g) => { LK.person(g, -35.6, 22.4, 0, LK.who(6113, { dir: 0, pose: 'sit', top: '#6E5A44', hairStyle: 'bun', hair: '#8E8A84' })); const R = RNG(9); for (let i = 0; i < 6; i++) { const p = g.p(-33 + R() * 3, 22 + R() * 3, 0); g.fill2([[p[0] - 1, p[1] - 0.8], [p[0] + 0.8, p[1] - 1.2], [p[0] + 1.2, p[1] - 0.4], [p[0], p[1]], [p[0] - 1.1, p[1] - 0.2]], '#8E939E', true); } }, { on: true });
  // bankers hurrying in every direction, briefcases and coffees
  const routes = [[[-36, 0], [8, 0]], [[10.5, -2], [10.5, -36]], [[36, -20], [-3, -20]], [[-36, 32], [36, 32]], [[36, 2], [-6, 2]], [[-8, -10], [20, -10]], [[35.5, -36], [35.5, 2]], [[-34, -2], [-34, -36]]];
  routes.forEach((r, i) => LK.walker(T, LK.banker(6200 + i), r, 2.1 + (i % 3) * 0.3, { phase: (i * 0.29) % 1 }));
  LK.walker(T, LK.who(6210, { umb: '#2A2622' }), [[-30, 34], [6, 34]], 1.4, { phase: 0.4 });
  // the window cleaner's cradle on the Walkie-Talkie
  T.actor({ sample: 1, period: 40, grow: false, at(t) { const u = (t / 40) % 1, z = 30 - 26 * (u < 0.5 ? u * 2 : 2 - u * 2); return { x: 4, y: -26 + 2.6 * Math.pow(z / 34, 1.6) + 0.5, z, key: 0 }; },
    draw(g) { const p = g.p(0, 0, 0); g.fill2([[p[0] - 3, p[1]], [p[0] + 3, p[1] - 1.6], [p[0] + 3, p[1] - 0.4], [p[0] - 3, p[1] + 1.2]], '#E6C24F', true); g.line2([[p[0] - 2.4, p[1] - 0.2], [p[0] - 2.4, p[1] - 40]], { w: 0.25, c: '#5A544C', boil: false, ext: 0 }); g.line2([[p[0] + 2.4, p[1] - 1.4], [p[0] + 2.4, p[1] - 41]], { w: 0.25, c: '#5A544C', boil: false, ext: 0 }); LK.bust2(g, [p[0], p[1] - 0.6], LK.who(6220, { top: '#E6C24F' }), 0.7); } });
});
