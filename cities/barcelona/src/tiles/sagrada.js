'use strict';
/* (0,-100) The Sagrada Família on its own Eixample block. The plan is a Latin cross: the nave runs along x from the
   apse (-x, north-west) to the Glory façade (+x, south-east, facing the viewer's right, still being built); the
   transept runs along y with the Passion façade at +y (south-west, facing us on the left) and the Nativity façade at
   -y (behind). Heights after the OSM data card (refs/sagrada-fam-lia.md) at 0.378 u per m, the plan at 0.65 u per m:
   the Jesus tower over the crossing (64 u, a white four-armed cross on top, 70), the four evangelists round it (51),
   Mary's tower over the apse with its star (52), four spindle bell towers on each transept façade (37-42) with
   coloured mosaic finials; the nave walls 17 u with a steep roof and pinnacles. Passion: pale stone, the inclined
   bone columns of the portico, the pediment. Glory: a concrete frame, the stumps of its towers in scaffolding.
   Who: the tourist queue at the Passion door, a guide, a school group in caps, people photographing from the
   pavement, workers in hi-vis vests at the site. What moves: two tower cranes slew, trolley and hoist stone blocks from
   the yard onto the Glory towers (a 36 s cycle each, phase-shifted), the hooks swinging their loads up. */
SF.tile('sagrada', 0, -100, { rim: 12 }, function (T) {
  const NL = { warm: '#FFE2B8', white: '#FFF6EA' };     // at night: the façades' warm floodlight, the new towers' whiter light
  const PAS = { t: '#E6DECF', l: '#DCD3C2', r: '#C6BCA8' }, NAT = { t: '#D6C6A6', l: '#C9B794', r: '#B09E7C' }, NEW = { t: '#F1EEE7', l: '#EDE9E0', r: '#D7D2C7' };
  /* a spindle bell tower: a round shaft tapering like a parabola, slits spiralling up, a mosaic mitre on top */
  const spindle = (g, x, y, z0, h, r0, col, seed) => {
    const R = RNG(seed), base = g.p(x, y, z0), N = 18, L = [], Rr = [];
    for (let i = 0; i <= N; i++) { const t = i / N, z = z0 + h * t, r = r0 * Math.sqrt(1 - t * 0.93), p = g.p(x, y, z); L.push([p[0] - r * SX, p[1]]); Rr.push([p[0] + r * SX, p[1]]); }
    g.fill2(L.concat(Rr.slice().reverse()), col.l);
    g.fill2(Rr.map((p, i) => [lerp(L[i][0], p[0], 0.5), p[1]]).concat(Rr.slice().reverse()), col.r);
    const sl = []; for (let i = 1; i < N - 3; i++) { const t = i / N, p = g.p(x, y, z0 + h * t), r = r0 * Math.sqrt(1 - t * 0.93) * SX, ph = (i * 0.9 + seed) % 2 - 1; sl.push(p[0] + ph * r * 0.7 - 0.35, p[1] - 1.2, p[0] + ph * r * 0.7 + 0.35, p[1] + 0.2); }
    g.segs2(sl, '#4A4540', 0.9);
    g.line2(L, { w: 0.7 }); g.line2(Rr, { w: 0.7 });
    // the finial: a mitre of coloured mosaic with white balls
    const top = g.p(x, y, z0 + h), m = R.pick(['#D8AE48', '#C9392E', '#E9E2D2', '#6FA36B']);
    const im = g.cmds.length;
    g.fill2([[top[0] - 1.8, top[1] + 0.5], [top[0] + 1.8, top[1] + 0.5], [top[0] + 1.1, top[1] - 5.5], [top[0], top[1] - 7.5], [top[0] - 1.1, top[1] - 5.5]], m, true);
    g.fill2([[top[0], top[1] + 0.5], [top[0] + 1.8, top[1] + 0.5], [top[0] + 1.1, top[1] - 5.5], [top[0], top[1] - 7.5]], shade(m, 0.14), true);
    for (const [dx, dy] of [[-1.5, -1], [1.5, -1], [-0.9, -4.5], [0.9, -4.5], [0, -8.2]]) g.disc2([top[0] + dx, top[1] + dy], 0.55, '#F6F3EA');
    g.mark({ nc: true }, im); g.glow2('lantern', [top[0], top[1] - 3.5], top, { r: 1.0, col: '#FFE6BE' });   // at night the mosaic finial is lit
    g.line2([[top[0] - 1.8, top[1] + 0.5], [top[0], top[1] - 7.5], [top[0] + 1.8, top[1] + 0.5]], { w: 0.45, c: shade(m, 0.5), boil: false });
  };
  /* a tall stepped tower (Jesus, Mary, the evangelists): square in plan, tapering in rings, ribbed */
  const steeple = (g, x, y, z0, h, r0, col, cap) => {
    const N = 10, L = [], Rr = [];
    for (let i = 0; i <= N; i++) { const t = i / N, r = r0 * (1 - 0.72 * Math.pow(t, 1.4)), p = g.p(x, y, z0 + h * t); L.push([p[0] - r * SX * 1.05, p[1]]); Rr.push([p[0] + r * SX * 1.05, p[1]]); }
    g.fill2(L.concat(Rr.slice().reverse()), col.l); g.fill2(Rr.map((p, i) => [lerp(L[i][0], p[0], 0.45), p[1]]).concat(Rr.slice().reverse()), col.r);
    const rb = []; for (let i = 1; i < N; i++) rb.push(L[i][0], L[i][1], Rr[i][0], Rr[i][1]); g.segs2(rb, shade(col.r, 0.2), 0.4);
    const ml = []; for (let i = 0; i < N; i++) { const c = [(L[i][0] + Rr[i][0]) / 2, L[i][1]]; ml.push(c[0] - (Rr[i][0] - L[i][0]) * 0.18, c[1] - 1.5, c[0] - (Rr[i][0] - L[i][0]) * 0.18, c[1] - 4.5); } g.segs2(ml, '#7F8C96', 0.7);
    g.line2(L, { w: 0.8 }); g.line2(Rr, { w: 0.8 });
    if (cap) cap(g, g.p(x, y, z0 + h));
  };

  T.ground(function (g) {
    BC.ground(g, '#E6DFCF');
    g.scuff(K.rect(-37, -37, 37, 37), { dir: -0.6, len: 3, c: '#F1ECE0', dens: 0.4, w: 0.45, spread: 0.6 });
    // the works yard on the Glory side: packed earth, stacks of cut stone, a site fence
    g.fill(K.rect(30, -27, 37, 27), '#D9C9A8'); g.scuff(K.rect(30, -27, 37, 27), { dir: -0.6, len: 2, c: '#C9B48E', dens: 0.6, w: 0.5, spread: 0.6 });
    // planted beds along the Passion side
    for (const x of [-26, 18]) { g.fill(K.rect(x, 28, x + 9, 32), '#B7CC8E'); g.grass(K.rect(x, 28, x + 9, 32), { dens: 0.8 }); g.outline(K.rect(x, 28, x + 9, 32), { w: 0.4, c: '#7F9A5E', boil: false }); }
  }, { rim: true });

  /* ---- the Nativity transept (behind): its four bell towers and its gable ---- */
  T.obj([-8, -26, 8, -9], function (g) {
    g.boilP = 0.2;
    K.box(g, -7, -22, 7, -9, 0, 17, NAT, { w: 0.9 });
    for (const [x, h] of [[-9.6, 37], [-5.1, 40.5], [5.1, 40.5], [9.6, 37]]) { K.cyl(g, x, -21.5, 2.2, 0, 14, NAT, { w: 0.7, n: 10 }); spindle(g, x, -21.5, 14, h - 14, 2.1, NAT, Math.round(x * 7 + 50)); }
    BC.flood(g, 0, 0.72, NL.warm);                                    // at night the Nativity towers floodlit warm
  }, { name: 'nativity' });
  /* ---- the apse and Mary's tower with its star ---- */
  T.obj([-31, -12, -21, 12], function (g) {
    g.boilP = 0.2;
    const ap = []; for (let i = 0; i <= 12; i++) { const a = Math.PI / 2 + Math.PI * i / 12; ap.push([-22 + Math.cos(a) * 9, Math.sin(a) * 9]); }
    BC.prism(g, ap, 0, 15, NAT, { w: 0.85 });
    for (let i = 1; i < 12; i += 2) { const a = Math.PI / 2 + Math.PI * i / 12, c = g.p(-22 + Math.cos(a) * 9, Math.sin(a) * 9, 15); g.fill2([[c[0] - 1.2, c[1]], [c[0] + 1.2, c[1]], [c[0], c[1] - 9]], '#C9B794', true); g.line2([[c[0] - 1.2, c[1]], [c[0], c[1] - 9], [c[0] + 1.2, c[1]]], { w: 0.4, boil: false }); }
    const iM = g.cmds.length;
    steeple(g, -15.6, 1, 15, 31, 3.6, NEW, (gg, c) => { const is = gg.cmds.length; for (let k = 0; k < 6; k++) { const a = TAU * k / 6 - Math.PI / 2; gg.fill2([[c[0], c[1] - 3], [c[0] + Math.cos(a) * 3.8, c[1] - 3 + Math.sin(a) * 3.8], [c[0] + Math.cos(a + 0.5) * 1.2, c[1] - 3 + Math.sin(a + 0.5) * 1.2]], '#EEF2F4', true); } gg.disc2([c[0], c[1] - 3], 1.3, '#D8E6EE'); gg.ring2([c[0], c[1] - 3], 3.9, { w: 0.3, c: '#9AB0BE' });
      // the twelve-pointed star of glass, lit from within every night since December 2021
      gg.mark({ nc: (cc) => (cc === '#D8E6EE' ? '#FFFFFF' : '#F4FAFF') }, is); BC.litLines(gg, is, '#DCEBFF'); gg.glow2('lantern', [c[0], c[1] - 3], [c[0], c[1] - 3], { r: 3.2, col: '#F2F8FF' }); });
    BC.flood(g, 0, 0.72, NL.warm, { to: iM }); BC.flood(g, iM, 0.9, NL.white);         // the apse warm, Mary's tower white
    for (const z of [22, 32, 40]) g.glow('lantern', -15.6, 1, z, { r: z < 30 ? 2.6 : 1.8, col: '#FFF4E2' });
  }, { name: 'apse' });
  /* ---- the nave, west of the crossing ---- */
  T.obj([-22, -10, -7, 10], function (g) {
    g.boilP = 0.2;
    K.box(g, -22, -13, -7, 13, 0, 11, NAT, { w: 0.85 });
    K.box(g, -22, -9, -7, 9, 11, 17, NAT, { w: 0.85, nohid: true });
    K.gable(g, -22, -9, -7, 9, 17, 6, 'x', { a: '#C9B794', b: '#B09E7C', e: '#C9B794' }, { c: '#6E5E44' });
    for (let x = -20; x < -8; x += 3) { K.win(g, 'L', 13, x, x + 1.4, 3, 9, { style: 'navy', arch: true, lit: 0 }); K.win(g, 'L', 9, x, x + 1.4, 12, 16, { style: 'navy', arch: true, lit: 0 }); }
    BC.flood(g, 0, 0.6, NL.warm);
  }, { name: 'nave west' });
  /* ---- the crossing: the Jesus tower and the four evangelists ---- */
  T.obj([-7, -9, 7, 9], function (g) {
    g.boilP = 0.18;
    K.box(g, -7, -9, 7, 9, 0, 22, PAS, { w: 0.9 });
    for (const [f, p, a0, a1] of [['L', 9, -7, 7], ['R', 7, -9, 9]]) { for (let a = a0 + 1.2; a < a1 - 0.8; a += 2.4) K.win(g, f, p, a, a + 1.0, 12, 20, { style: 'navy', arch: true, lit: 0 }); const rb = []; for (let a = a0 + 2.4; a < a1; a += 2.4) { const q0 = g.p.apply(g, K.pt(f, p + 0.03, a, 0)), q1 = g.p.apply(g, K.pt(f, p + 0.03, a, 22)); rb.push(q0[0], q0[1], q1[0], q1[1]); } g.segs2(rb, '#CFC9BC', 0.4); }
    K.box(g, -6, -6, 6, 6, 22, 28, NEW, { w: 0.8, nohid: true });
    const evs = [[-4.6, -4.6, '#F6F3EA'], [4.6, -4.6, '#D8AE48'], [-4.6, 4.6, '#C9584B'], [4.6, 4.6, '#6FA36B']];
    // the evangelists' crowns (their symbols) are lit every night: they keep their colours and shine
    const cap = (col) => (gg, c) => { const ic = gg.cmds.length; gg.disc2([c[0], c[1] - 1.6], 1.6, col); gg.ring2([c[0], c[1] - 1.6], 1.6, { w: 0.35, c: shade(col, 0.5) }); gg.disc2([c[0] - 0.6, c[1] - 2.2], 0.5, '#FBFAF4'); gg.mark({ nc: (cc) => mix(cc, '#FFFFFF', 0.15) }, ic); gg.glow2('lantern', [c[0], c[1] - 1.6], [c[0], c[1] - 1.6], { r: 1.6, col: '#FFF2DA' }); };
    for (const [x, y, col] of evs.slice(0, 2)) steeple(g, x, y, 28, 23, 2.0, NEW, cap(col));
    const iT = g.cmds.length;
    steeple(g, 0, 0, 28, 36, 3.4, NEW, (gg, c) => {
      // the four-armed cross of white glass on top (lit from within every night since 10 June 2026)
      const ix = gg.cmds.length; gg.glow2('lantern', [c[0], c[1] - 7], [c[0], c[1] - 7], { r: 3.8, col: '#F6FBFF' }); gg.glow2('lantern', [c[0], c[1] - 10], [c[0], c[1] - 10], { r: 1.6, col: '#FFFFFF' });
      const w = 1.0; gg.fill2([[c[0] - w, c[1]], [c[0] + w, c[1]], [c[0] + w, c[1] - 14], [c[0] - w, c[1] - 14]], '#F8F8F2', true);
      gg.fill2([[c[0] - 4.2, c[1] - 9], [c[0] + 4.2, c[1] - 9], [c[0] + 4.2, c[1] - 11], [c[0] - 4.2, c[1] - 11]], '#F8F8F2', true);
      gg.fill2([[c[0] + 0.2, c[1]], [c[0] + w, c[1]], [c[0] + w, c[1] - 14], [c[0] + 0.2, c[1] - 14]], '#D8E2E8', true);
      gg.outline2([[c[0] - w, c[1]], [c[0] - w, c[1] - 9], [c[0] - 4.2, c[1] - 9], [c[0] - 4.2, c[1] - 11], [c[0] - w, c[1] - 11], [c[0] - w, c[1] - 14], [c[0] + w, c[1] - 14], [c[0] + w, c[1] - 11], [c[0] + 4.2, c[1] - 11], [c[0] + 4.2, c[1] - 9], [c[0] + w, c[1] - 9], [c[0] + w, c[1]]], { w: 0.45, c: '#8A9AA6', boil: false });
      gg.mark({ nc: (cc) => (cc === '#D8E2E8' ? '#E6F3FF' : '#FFFFFF') }, ix); BC.litLines(gg, ix, '#CFE4F6');
    });
    for (const [x, y, col] of evs.slice(2)) steeple(g, x, y, 28, 23, 2.0, NEW, cap(col));
    // at night: the crossing floodlit warm, the Jesus tower and the evangelists in a whiter light, lit up their height
    BC.flood(g, 0, 0.7, NL.warm, { to: iT }); BC.flood(g, iT, 0.92, NL.white);
    for (const [z, r] of [[32, 3.6], [42, 3.0], [52, 2.4], [60, 1.8]]) g.glow('lantern', 0, 0, z, { r, col: '#FFF4E2' });
  }, { name: 'crossing' });
  /* ---- the nave east of the crossing, up to the Glory façade's frame ---- */
  T.obj([7, -13, 30, 13], function (g) {
    g.boilP = 0.2;
    K.box(g, 7, -13, 26, 13, 0, 11, PAS, { w: 0.85 });
    K.box(g, 7, -9, 26, 9, 11, 17, PAS, { w: 0.85, nohid: true });
    K.gable(g, 7, -9, 26, 9, 17, 6, 'x', { a: '#DCD3C2', b: '#C6BCA8', e: '#DCD3C2' }, { c: '#6E6450' });
    for (let x = 9; x < 25; x += 3) { K.win(g, 'L', 13, x, x + 1.4, 3, 9, { style: 'navy', arch: true, lit: 0 }); K.win(g, 'L', 9, x, x + 1.4, 12, 16, { style: 'navy', arch: true, lit: 0 }); }
    for (let x = 8.5; x < 26; x += 3) { const c = g.p(x, 13, 11); g.fill2([[c[0] - 0.9, c[1]], [c[0] + 0.9, c[1]], [c[0], c[1] - 6]], '#DCD3C2', true); g.line2([[c[0] - 0.9, c[1]], [c[0], c[1] - 6], [c[0] + 0.9, c[1]]], { w: 0.4, boil: false }); }
    // the Glory façade, still being built: a stone porch of tall dark doorways under a scaffold, the stumps of its
    // four bell towers rising out of it in the same stone as the Passion, wrapped in scaffolding
    const GL = { t: '#E2DACA', l: '#D8CFBD', r: '#C2B8A4' };
    K.box(g, 26, -15, 30, 15, 0, 14, GL, { w: 0.9 });
    for (let k = 0; k < 7; k++) { const y = -13 + k * 3.8, ar = [K.pt('R', 30.03, y, 0.5), K.pt('R', 30.03, y + 2.2, 0.5)]; for (let q = 0; q <= 6; q++) { const t = Math.PI * q / 6; ar.push(K.pt('R', 30.03, y + 1.1 + Math.cos(t) * 1.1, 9 + Math.sin(t) * 1.6)); } g.fill(ar, '#5E5A52'); }
    const sc0 = []; for (let z = 2; z <= 14; z += 2.4) { const a = g.p(30.6, -15, z), b = g.p(30.6, 15, z); sc0.push(a[0], a[1], b[0], b[1]); } for (let y = -15; y <= 15; y += 3) { const a = g.p(30.6, y, 0), b = g.p(30.6, y, 14); sc0.push(a[0], a[1], b[0], b[1]); } g.segs2(sc0, '#C9A24A', 0.35);
    for (const y of [-11, -4, 4, 11]) {
      const zt = y % 2 ? 26 : 23;
      // a stump: the lower part of a spindle tower, cut flat where the masons have got to
      const N = 6, Lp = [], Rp = [], H2 = 34; for (let i2 = 0; i2 <= N; i2++) { const t = (zt - 14) / H2 * i2 / N, r = 1.9 * Math.sqrt(1 - t * 0.93), p = g.p(28, y, 14 + H2 * t); Lp.push([p[0] - r * SX, p[1]]); Rp.push([p[0] + r * SX, p[1]]); }
      g.fill2(Lp.concat(Rp.slice().reverse()), PAS.l); g.fill2(Rp.map((p, i2) => [lerp(Lp[i2][0], p[0], 0.5), p[1]]).concat(Rp.slice().reverse()), PAS.r);
      const tp = Lp[N], tq = Rp[N], cc = [(tp[0] + tq[0]) / 2, tp[1]], rx = (tq[0] - tp[0]) / 2; g.fill2(arcPts(cc[0], cc[1], rx, 0, TAU, 12).map((q) => [q[0], cc[1] + (q[1] - cc[1]) * 0.5]), PAS.t, true);
      g.line2(Lp, { w: 0.65 }); g.line2(Rp, { w: 0.65 }); g.line2(arcPts(cc[0], cc[1], rx, 0, Math.PI, 8).map((q) => [q[0], cc[1] + (q[1] - cc[1]) * 0.5]), { w: 0.5, boil: false });
      const sl = []; for (let i2 = 1; i2 < N; i2++) { const p = [(Lp[i2][0] + Rp[i2][0]) / 2, Lp[i2][1]], w2 = (Rp[i2][0] - Lp[i2][0]) / 2, ph = (i2 * 0.9) % 2 - 1; sl.push(p[0] + ph * w2 * 0.6 - 0.35, p[1] - 1.2, p[0] + ph * w2 * 0.6 + 0.35, p[1] + 0.2); } g.segs2(sl, '#4A4540', 0.9);
      const sc = []; for (let z = 14; z <= zt; z += 2) { const a = g.p(30.2, y - 2.4, z), b = g.p(30.2, y + 2.4, z), c = g.p(25.8, y + 2.4, z); sc.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); } for (const yy of [y - 2.4, y + 2.4]) { const a = g.p(30.2, yy, 14), b = g.p(30.2, yy, zt); sc.push(a[0], a[1], b[0], b[1]); } g.segs2(sc, '#C9A24A', 0.4);
    }
    BC.flood(g, 0, 0.55, NL.warm);                                    // the nave lit; the Glory site in a softer light
  }, { name: 'nave east' });
  /* ---- the Passion transept (near left): the portico of inclined bone columns, the pediment, four bell towers ---- */
  T.obj([-11, 9, 11, 26], function (g) {
    g.boilP = 0.2;
    K.box(g, -7, 9, 7, 21, 0, 17, PAS, { w: 0.9 });
    // towers first (they stand just behind the portico)
    for (const [x, h] of [[-9.1, 37], [-4.6, 42], [4.2, 42], [8.7, 37]]) { K.cyl(g, x, 22.5, 2.1, 0, 13, PAS, { w: 0.7, n: 10 }); spindle(g, x, 22.5, 13, h - 13, 2.0, PAS, Math.round(x * 5 + 90)); }
    // the pediment: a big angular gable over the portico with the crucified figure
    const pd = [g.p(-7, 24.5, 13), g.p(7, 24.5, 13), g.p(0, 24.5, 24)]; g.fill2(pd, '#E6DECF', true); g.outline2(pd, { w: 0.7, boil: false });
    const cr = g.p(0, 24.6, 17.5); g.segs2([cr[0], cr[1] + 3, cr[0], cr[1] - 4, cr[0] - 2.4, cr[1] - 2, cr[0] + 2.4, cr[1] - 2], '#7A6E5C', 0.8);
    // the portico: a sloping canopy on six inclined bone-like columns
    const can = [[-7.5, 21, 13], [7.5, 21, 13], [7.5, 25, 12], [-7.5, 25, 12]]; g.fill(can, '#E2DACA'); g.outline(can, { w: 0.6, boil: false });
    for (let i = 0; i < 6; i++) { const x = -6 + i * 2.4, a = g.p(x, 25.4, 0), b = g.p(x + (i - 2.5) * 0.3, 24.6, 12); g.line2(K.curve([a, [lerp(a[0], b[0], 0.4) + 0.8, lerp(a[1], b[1], 0.4)], [lerp(a[0], b[0], 0.75) - 0.6, lerp(a[1], b[1], 0.75)], b], 3, false), { w: 1.6, c: '#EAE3D5', boil: false, ext: 0 }); g.line2([[a[0] + 0.8, a[1]], [b[0] + 0.8, b[1]]], { w: 0.3, c: '#9A8E78', boil: false }); }
    // the doors: bronze, covered in letters
    g.fill(K.on('L', 21.02, -4, 4, 0, 7), '#8A6A3A');
    const iD = g.cmds.length;
    for (let z = 1; z < 7; z += 1) K.text(g, 'L', 21.04, 0, z, 0.55, 'JESUS DE NATZARET', '#D8AE48', { center: true, w: 0.22 });
    // at night the Passion façade is floodlit from the square: warm on the stone, the towers lit up their height
    BC.flood(g, 0, 0.85, NL.warm); BC.litLines(g, iD, '#FFD979');
    for (const [x, y, z, r] of [[0, 25, 7, 4.2], [0, 24.6, 17, 3.0], [-4.6, 24.6, 30, 1.8], [4.2, 24.6, 30, 1.8], [-9.1, 24.6, 24, 1.6], [8.7, 24.6, 24, 1.6]]) g.glow('lantern', x, y, z, { r, col: '#FFE6BE' });
  }, { name: 'passion' });

  /* ---- the works yard: stacks of stone, a site hut, the fence ---- */
  T.obj([31, -24, 36, -18], (g) => { for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) K.box(g, 31.5 + i * 1.5, -23.5 + j * 2.6, 32.8 + i * 1.5, -21.3 + j * 2.6, 0, 1.2 + (i + j) % 2 * 1.2, { t: '#EFE9DC', l: '#E2DACA', r: '#CFC6B4' }, { w: 0.45, nohid: true, boil: false }); }, { name: 'stone' });
  T.obj([31, 18, 36, 24], (g) => { K.box(g, 31.5, 18.5, 35.5, 23.5, 0, 4.2, { t: '#E9E6DE', l: '#F1EFE8', r: '#D9D5CA' }, { w: 0.6 }); g.fill(K.on('R', 35.52, 19.5, 22, 1.5, 3.2), C.glass); g.mark({ nc: '#FFE4A4', win: 1 }); K.text(g, 'R', 35.55, 21, 3.5, 0.5, 'OBRA', '#C9392E', { center: true }); g.glow('lamp', 35.8, 21, 4.0, { r: 0.9 }); }, { name: 'site hut' });   // the night watchman's light
  T.obj([36.4, -27, 36.8, 27], (g) => { const segs = []; for (let y = -26.5; y < 27; y += 1.6) { const a = g.p(36.6, y, 0), b = g.p(36.6, y, 2.6); segs.push(a[0], a[1], b[0], b[1]); } g.segs2(segs, '#8A8A84', 0.3); g.line([[36.6, -27, 2.6], [36.6, 27, 2.6]], { w: 0.4, c: '#6E6E68', boil: false }); g.fill([[36.6, -10, 0.4], [36.6, 10, 0.4], [36.6, 10, 2.4], [36.6, -10, 2.4]], 'rgba(233,226,204,0.85)'); K.text(g, 'R', 36.65, 0, 0.9, 1.0, 'SAGRADA FAMÍLIA', '#3E6E52', { center: true }); }, { name: 'fence' });

  /* ---- Gaudí's little schoolhouse on the corner, its roof a wave of brick; gardens and benches round the church ---- */
  T.obj([-35, 13, -23, 23], function (g) {
    const B = { t: '#D9A27E', l: '#C98E6A', r: '#B47A58' };
    const wv = (u) => 4.8 + Math.sin(u * 0.9) * 0.9;
    K.box(g, -35, 13, -23, 23, 0, 3.8, B, { w: 0.75 });
    const fr = []; for (let i = 0; i <= 12; i++) { const x = lerp(-35, -23, i / 12); fr.push([x, 23, wv(x)]); }
    g.fill([[-35, 23, 3.8], [-23, 23, 3.8]].concat(fr.slice().reverse()), '#C98E6A');
    const rf = []; for (let i = 0; i <= 12; i++) { const x = lerp(-35, -23, i / 12); rf.push([x, 13, wv(x) - 0.6]); } g.fill(fr.concat(rf.slice().reverse()), '#B9805C');
    const br = []; for (let i = 0; i <= 12; i++) { const a = g.p.apply(g, fr[i]), c = g.p.apply(g, rf[i]); br.push(a[0], a[1], c[0], c[1]); } g.segs2(br, '#8E5A3E', 0.3);
    g.line(fr, { w: 0.7, boil: false }); g.line(rf, { w: 0.5, boil: false });
    for (let x = -34; x < -24; x += 2.4) K.win(g, 'L', 23, x, x + 1.2, 1, 3.2, { style: 'glass', lit: 0.2 });
  }, { name: 'escoles' });
  for (const [x, y] of [[-30, -30], [-22, -32], [-33, -16], [26, -32], [-33, 4], [31, 30], [14, -32]]) T.obj([x, y], (g) => BC.plane(g, x, y, { r: 3.6, h: 5.8 }), { name: 'tree' });
  for (const [x, y] of [[-16, -28], [16, 28]]) T.cast([x, y], (g) => { K.bench(g, x, y, { face: 'L', L: 2.4 }); BC.person(g, x, y + 1.1, 1.3, BC.who(Math.round(x * 13 + 3300), { dir: 1, pose: 'sit' })); }, {});
  BC.block(T, { skip: { 'y+': [[-14, 14]] }, corners: { nn: 'bins', np: 'kiosk', pp: 'motos', pn: 'bicing' } });

  /* ---- the tower cranes ---- */
  /* mast at (mx, my) up to H; the jib (length J, counter-jib 8) slews; the trolley runs out to d; the hook hangs to zh.
     A cycle: hook down at the yard, lift, slew and run out to the tower stump, lower, release, raise, swing back. */
  const crane = (mx, my, H, J, A0, A1, D0, D1, Z1, per, off, col) => {
    T.obj([mx - 1.2, my - 1.2, mx + 1.2, my + 1.2], function (g) {
      const b = g.p(mx, my, 0), t = g.p(mx, my, H), w = 1.1 * SX * 0.7;
      g.fill2([[b[0] - w, b[1]], [b[0] + w, b[1]], [b[0] + w, b[1] + 1.6], [b[0] - w, b[1] + 1.6]], '#8A8A84', true);
      const lat = []; const n = Math.round(H / 2.2);
      for (let i = 0; i < n; i++) { const y0 = lerp(b[1], t[1], i / n), y1 = lerp(b[1], t[1], (i + 1) / n); lat.push(b[0] - w, y0, b[0] + w, y1, b[0] + w, y0, b[0] - w, y1); }
      g.segs2(lat, col, 0.3); g.line2([[b[0] - w, b[1]], [t[0] - w, t[1]]], { w: 0.55, c: shade(col, 0.4), boil: false }); g.line2([[b[0] + w, b[1]], [t[0] + w, t[1]]], { w: 0.55, c: shade(col, 0.4), boil: false });
    }, { name: 'crane mast' });
    const phase = (t) => { const u = ((t / per + off) % 1 + 1) % 1; return u; };
    const state = (t) => {
      const u = phase(t), seg = [0.12, 0.3, 0.42, 0.5, 0.58, 0.76, 0.88, 1.0];
      // 0: hook lowered at the yard; 1: lift; 2: slew out; 3: lower onto the tower; 4: release, lift; 5: slew back; 6: lower
      let a = A0, d = D0, z = 2, load = true;
      if (u < seg[0]) { z = lerp(2, 2.5, u / seg[0]); load = u > seg[0] * 0.5; }
      else if (u < seg[1]) { z = lerp(2.5, H - 6, smooth((u - seg[0]) / (seg[1] - seg[0]))); }
      else if (u < seg[2]) { const f = smooth((u - seg[1]) / (seg[2] - seg[1])); a = lerp(A0, A1, f); d = lerp(D0, D1, f); z = H - 6; }
      else if (u < seg[3]) { a = A1; d = D1; z = lerp(H - 6, Z1, smooth((u - seg[2]) / (seg[3] - seg[2]))); }
      else if (u < seg[4]) { a = A1; d = D1; z = lerp(Z1, H - 6, smooth((u - seg[3]) / (seg[4] - seg[3]))); load = false; }
      else if (u < seg[5]) { const f = smooth((u - seg[4]) / (seg[5] - seg[4])); a = lerp(A1, A0, f); d = lerp(D1, D0, f); z = H - 6; load = false; }
      else { z = lerp(H - 6, 2, smooth((u - seg[5]) / (seg[6] - seg[5]))); load = false; if (u > seg[6]) z = 2; }
      return { a, d, z, load };
    };
    // the slewing part: jib, counter-jib, cab (keyed by its angle only)
    T.actor({ sample: 0.6, period: per, grow: false, bias: 0.5,
      at(t) { const s = state(t), qa = Math.round(s.a / (TAU / 144)); return { x: mx, y: my, key: qa, a: qa * TAU / 144 }; },
      draw(g, st) {
        const ca = Math.cos(st.a), sa = Math.sin(st.a), P = (u, z) => g.p(u * ca, u * sa, z), H2 = H;
        const tip = P(J, H2 + 1.6), tail = P(-8, H2 + 1.6), apex = g.p(0, 0, H2 + 6);
        const jl = []; for (let i = 0; i < Math.round(J / 1.6); i++) { const a = P(i * 1.6, H2 + 0.6), b = P((i + 1) * 1.6, H2 + 1.6), c = P((i + 1) * 1.6, H2 + 0.6); jl.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); }
        g.segs2(jl, col, 0.3);
        g.line2([P(0, H2 + 0.6), P(J, H2 + 0.6)], { w: 0.5, c: shade(col, 0.4), boil: false, ext: 0 }); g.line2([P(0, H2 + 1.6), tip], { w: 0.5, c: shade(col, 0.4), boil: false, ext: 0 });
        g.line2([P(-8, H2 + 0.9), P(0, H2 + 0.9)], { w: 0.9, c: shade(col, 0.3), boil: false, ext: 0 });
        const cw = P(-7, H2 + 0.4); g.fill2([[cw[0] - 2.2, cw[1] - 2.6], [cw[0] + 2.2, cw[1] - 2.6], [cw[0] + 2.2, cw[1] + 1.2], [cw[0] - 2.2, cw[1] + 1.2]], '#9A9A94', true);
        g.segs2([apex[0], apex[1], tip[0], tip[1], apex[0], apex[1], tail[0], tail[1]], '#5A5A54', 0.25);
        g.line2([g.p(0, 0, H2), apex], { w: 0.7, c: shade(col, 0.3), boil: false });
        const cab = P(1.2, H2 - 0.6); g.fill2([[cab[0] - 1.6, cab[1] - 2.6], [cab[0] + 1.6, cab[1] - 2.6], [cab[0] + 1.6, cab[1] + 0.6], [cab[0] - 1.6, cab[1] + 0.6]], col, true); g.fill2([[cab[0] - 0.9, cab[1] - 2.0], [cab[0] + 0.9, cab[1] - 2.0], [cab[0] + 0.9, cab[1] - 0.6], [cab[0] - 0.9, cab[1] - 0.6]], '#CFE0EA', true);
      } });
    // the trolley, the hoist rope, the hook and its stone: anchored under the trolley, keyed by the hook's height
    T.actor({ sample: 0.6, period: per, grow: false, bias: 0.6,
      at(t) { const s = state(t), qa = Math.round(s.a / (TAU / 144)) * TAU / 144, qz = Math.round(s.z * 2) / 2; return { x: mx + Math.cos(qa) * s.d, y: my + Math.sin(qa) * s.d, key: qz + (s.load ? 'L' : ''), z0: qz, load: s.load }; },
      draw(g, st) {
        const tr = g.p(0, 0, H + 0.6), hk = g.p(0, 0, st.z0);
        g.fill2([[tr[0] - 1, tr[1] - 0.4], [tr[0] + 1, tr[1] - 0.4], [tr[0] + 1, tr[1] + 0.6], [tr[0] - 1, tr[1] + 0.6]], '#3A3530', true);
        g.segs2([tr[0] - 0.3, tr[1] + 0.6, hk[0] - 0.3, hk[1] - 6, tr[0] + 0.3, tr[1] + 0.6, hk[0] + 0.3, hk[1] - 6], '#3A3530', 0.22);
        const h = [hk[0], hk[1] - 6]; g.fill2([[h[0] - 0.7, h[1]], [h[0] + 0.7, h[1]], [h[0] + 0.5, h[1] + 1.3], [h[0] - 0.5, h[1] + 1.3]], '#E6C24F', true);
        if (st.load) { const lb = [h[0], h[1] + 4.6]; g.segs2([h[0], h[1] + 1.3, lb[0] - 2.4, lb[1] - 1.6, h[0], h[1] + 1.3, lb[0] + 2.4, lb[1] - 1.6], '#3A3530', 0.2); g.fill2([[lb[0] - 2.8, lb[1] - 1.6], [lb[0] + 2.8, lb[1] - 1.6], [lb[0] + 2.8, lb[1] + 1.6], [lb[0] - 2.8, lb[1] + 1.6]], '#E2DACA', true); g.fill2([[lb[0], lb[1] - 1.6], [lb[0] + 2.8, lb[1] - 1.6], [lb[0] + 2.8, lb[1] + 1.6], [lb[0], lb[1] + 1.6]], '#CFC6B4', true); g.outline2([[lb[0] - 2.8, lb[1] - 1.6], [lb[0] + 2.8, lb[1] - 1.6], [lb[0] + 2.8, lb[1] + 1.6], [lb[0] - 2.8, lb[1] + 1.6]], { w: 0.35, boil: false }); }
      } });
  };
  // crane mast tops at H; the jib reaches from the yard to the Glory tower stumps
  crane(33.5, -15.5, 50, 22, Math.PI * 1.5, Math.PI * 0.782, 5.5, 7.1, 34.5, 36, 0, '#E0A43A');
  crane(33.5, 9.5, 44, 20, Math.PI * 0.5, Math.PI * 0.915, 4.5, 5.7, 33.5, 36, 0.5, '#C9392E');
  T.obj([31.5, 12.5, 35.5, 16], (g) => { for (let i = 0; i < 2; i++) K.box(g, 31.8 + i * 1.8, 12.8, 33.3 + i * 1.8, 15.6, 0, 1.2 + i * 0.9, { t: '#EFE9DC', l: '#E2DACA', r: '#CFC6B4' }, { w: 0.45, nohid: true, boil: false }); }, { name: 'stone2' });

  /* ---- people ---- */
  // the queue for the Passion door along the planted bed
  for (let i = 0; i < 12; i++) { const x = -5 - i * 1.6, y = 31.2 + (i % 2) * 0.5; if (x < -25) break; T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(3100 + i, { dir: i % 5 === 2 ? 1 : 0, pose: i % 3 === 1 ? 'hold' : 'stand', phone: i % 3 === 1 })), {}); }
  T.cast([-1.5, 30.5], (g) => { const r = BC.person(g, -1.5, 30.5, 0, BC.who(3120, { dir: 2, pose: 'stand', top: '#3F5F8F', hands: [[2.4, -18], [1.0, -10]] })); const h = r.hands[0]; g.segs2([h[0], h[1], h[0] + 0.4, h[1] - 7], '#3A3530', 0.4); g.fill2([[h[0] + 0.4, h[1] - 7], [h[0] + 3.6, h[1] - 6.4], [h[0] + 0.4, h[1] - 5.2]], '#C9392E', true); }, {});
  // a school group in yellow caps following their teacher round the block
  const kids = []; for (let i = 0; i < 7; i++) kids.push(BC.who(3130 + i, { k: 0.74, cap: '#E6C24F', shorts: i % 2 === 0 }));
  const route = [[-32, 34.5], [26, 34.5], [34.5, 26], [34.5, 30], [-32, 30]];
  BC.walker(T, BC.who(3140, { top: '#5F8F6A' }), route, 1.1, { phase: 0.0 });
  kids.forEach((w, i) => BC.walker(T, w, route, 1.1, { phase: -0.012 * (i + 1) }));
  // photographers on the pavement, heads tipped back at the towers
  for (const [x, y, s] of [[22, 40.2, 3150], [26, 40.8, 3151], [-30, 40.4, 3152]]) T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(s, { dir: 2, pose: 'hold', phone: true, hands: [[1.8, -18.5], [1.2, -18]] })), {});
  // workers in hi-vis at the site
  for (const [x, y, s, d] of [[32.5, -6, 3160, 0], [33.2, 2, 3161, 2], [32, -19, 3162, 1]]) T.cast([x, y], (g) => { const r = BC.person(g, x, y, 0, BC.who(s, { dir: d, pose: 'stand', top: '#E8E04A', bot: '#3F4D63', bare: false, shorts: false })); if (r.crown) g.fill2(arcPts(r.crown[0], r.crown[1] + 1.5, 2.3, Math.PI, TAU, 8).concat([[r.crown[0] + 2.6, r.crown[1] + 2.2], [r.crown[0] - 2.6, r.crown[1] + 2.2]]), '#F3F1EA', true); }, {});
});
