'use strict';
/* (-100,100) Île de la Cité. The Seine splits round the island here: the main arm passes on its +x side (the seine
   tile's channel), the petit bras on its far side, under the left bank's Quai de Montebello (the strip along x -37..-26)
   with its row of tall Latin-quarter houses, the green bookshop on the corner, plane trees and the bouquinistes' boxes
   on the parapet. The island stands in the water on dressed-stone quai walls; its downstream tip (towards -y, Pont Neuf)
   is a little lawn with a weeping willow.
   Notre-Dame turned so its west front looks at us across the main arm (artistic licence: the real façade faces west,
   up the river): the twin square towers (69 m: drawn 26 u) with their tall louvred bays, the gallery of kings, the
   rose window, three deep portals; the nave and choir under a steep lead roof, flying buttresses down the flank we
   see, the rebuilt spire (96 m: 34 u) at the crossing with the green apostles at its foot. The parvis in front with the
   queue, a guide's umbrella, a flower market's stalls, the Petit Pont over the petit bras. */
SF.tile('cite', -100, 100, { rim: 34 }, function (T) {
  const H = 37, WZ = RIVER.WZ, SX = -26, ISL = [[-17, 31], [31, 31], [31, -6], [22, -18], [8, -27], [-4, -34], [-12, -31], [-17, -19]];
  const STN = { t: '#EDE4CF', l: '#E6DBC2', r: '#D1C3A4' }, LEAD = '#7E8890';
  T.ground(function (g) {
    // the water fills the tile (it opens into the main channel along x = H), ragged where it leaves the map at +y
    const R = RNG(17), edge = []; for (let i = 0; i <= 8; i++) edge.push([lerp(H, SX, i / 8), H + 2 + R() * 4, WZ]);
    const water = [[SX, -H, WZ], [H, -H, WZ]].concat(edge);
    g.fill(water, PC.water); g.water(K.rect(SX + 0.5, -H, H, H, WZ), { dens: 1.1 });
    g.scuff(K.rect(SX + 1, -H, H, H, WZ), { dir: Math.atan2(AY, -AX), len: 7, c: PC.waterL, dens: 0.3, w: 0.6, spread: 0.05 });
    // the far wall, under the boulevard (y = -H), looking towards us
    g.fill([[SX, -H, 0], [H, -H, 0], [H, -H, WZ], [SX, -H, WZ]], '#D3C6A8');
    const cs = []; for (let z = -0.7; z > WZ + 0.1; z -= 0.72) { const a = g.p(SX, -H, z), b = g.p(H, -H, z); cs.push(a[0], a[1], b[0], b[1]); } g.segs2(cs, '#B5A784', 0.28);
    g.line([[SX, -H, 0], [H, -H, 0]], { w: 0.7, boil: false });
    // the left-bank strip and its quai wall
    g.fill(K.rect(-H, -H, SX, H), PC.pave);
    g.scuff(K.rect(-H, -H, SX, H), { dir: Math.atan2(AY, -AX), len: 3, c: '#F2EEE4', dens: 0.5, w: 0.5, spread: 0.6 });
    g.fill([[SX, -H, 0], [SX, H, 0], [SX, H, WZ], [SX, -H, WZ]], '#D3C6A8');
    const c2 = []; for (let z = -0.7; z > WZ + 0.1; z -= 0.72) { const a = g.p(SX, -H, z), b = g.p(SX, H, z); c2.push(a[0], a[1], b[0], b[1]); } g.segs2(c2, '#B5A784', 0.28);
    g.line([[SX, -H, 0], [SX, H, 0]], { w: 0.8, boil: false });
    g.fill([[-H, H, 0], [SX, H, 0], [SX, H, -1.1], [-H, H, -1.1]], C.slab); g.line([[-H, H, 0], [-H, H, -1.1], [SX, H, -1.1], [SX, H, 0]], { w: 0.8 });
    // the island: its walls on the sides we see, then its top
    let cx = 0, cy = 0; for (const p of ISL) { cx += p[0] / ISL.length; cy += p[1] / ISL.length; }
    for (let i = 0; i < ISL.length; i++) {
      const a = ISL[i], b = ISL[(i + 1) % ISL.length], dx = b[0] - a[0], dy = b[1] - a[1]; let nx = dy, ny = -dx;
      const mx = (a[0] + b[0]) / 2 - cx, my = (a[1] + b[1]) / 2 - cy; if (nx * mx + ny * my < 0) { nx = -nx; ny = -ny; }
      const l = Math.hypot(nx, ny); nx /= l; ny /= l; if (nx + ny <= 0.02) continue;
      const q = [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], WZ], [a[0], a[1], WZ]];
      g.fill(q, mix('#DCD0B4', '#C2B494', clamp(0.5 + 0.5 * (nx - ny), 0, 1)));
      const cs3 = []; for (let z = -0.7; z > WZ + 0.1; z -= 0.72) { const p0 = g.p(a[0], a[1], z), p1 = g.p(b[0], b[1], z); cs3.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(cs3, '#AE9F7C', 0.28);
      g.line([[a[0], a[1], WZ], [b[0], b[1], WZ]], { w: 0.4, c: '#5F7F80', boil: false });
    }
    const top = ISL.map((p) => [p[0], p[1], 0]);
    g.fill(top, '#E7DFCD');
    g.scuff(K.rect(-17, -34, 31, 31), { dir: -0.7, len: 2.6, c: '#F3EEE3', dens: 0.4, w: 0.45, spread: 0.6 });
    // the tip's lawn
    const lawn = [[-14, -20, 0], [8, -22, 0], [-4, -31, 0], [-11, -28.5, 0]]; g.fill(lawn, PC.lawn); g.grass(lawn, { dens: 1 });
    g.outline(top, { w: 0.85 });
    // the parvis: a paler paving with the outlines of the old streets
    g.fill(K.rect(19, -4, 30, 26), '#EFE8D8');
    const pv = []; for (let y = -2; y < 26; y += 5) { const a = g.p(19, y, 0), b = g.p(30, y, 0); pv.push(a[0], a[1], b[0], b[1]); } g.segs2(pv, '#D8CDB5', 0.35);
  }, { rim: true });

  /* ---------------- the Latin-quarter row on the left bank ---------------- */
  const ROW = [[-36, -18], [-18, -6], [-6, 6], [6, 20], [20, 36]];
  ROW.forEach(([y0, y1], i) => T.obj([-H, y0, -30.5, y1], (g) => PA.haus(g, { x0: -H, y0, x1: -30.5, y1, et: 5, bay: 2.4, seed: 600 + i, faces: i === ROW.length - 1 ? 'LR' : 'R',
    shopsR: i === 2 ? [[y0 + 1, y1 - 1, '#2E5B48', 'shop']] : i === 0 ? [[y0 + 2, y0 + 8, '#7E2A24', 'cafe']] : [[y0 + 1, y0 + 5, ['#3F5F8F', '#2F4A3E', '#5A3E2E'][i % 3], 'shop'], [y1 - 4, y1 - 1, '#2F3A4F', 'door']],
    chim: [[-33.7, y0 + 0.8, 'x', 3]] }), { name: 'latin row' }));
  // Shakespeare and Company's yellow sign on the green front
  T.obj([-30.4, -1.5], (g) => { const q = K.on('R', -30.42, -4.5, 4.5, 3.8, 4.5); g.fill(q, '#E6C24F'); g.mark({ nc: '#FFD45A' }); g.outline(q, { w: 0.4, c: '#8A6A1E', boil: false }); const c = g.p(-30.38, 0, 4.15); PA.letters2(g, c, 22, 1.2, '#2E5B48', 'SHAKESPEARE AND COMPANY', 0.3, PA.dirOf('R')); g.glow2('lantern', c, c, { r: 2.4, col: '#FFD86A' }); }, { on: true, name: 'bookshop sign' });   // lit at night
  // trees and the parapet with the bouquinistes (we see the backs of the boxes and the propped-up lids)
  for (let y = -32; y < 35; y += 8.5) T.obj([-28.6, y], (g) => PA.plane(g, -28.6, y, { r: 3.3, h: 6.8, turn: 0.4 + h1(y + 77) * 0.5 }), { name: 'quai tree' });
  const BX = [-30, -24, -16, -10, 2, 8, 20, 26];
  for (let i = 0; i < BX.length; i += 2) {
    const y0 = BX[i] - 2.6, y1 = BX[i + 1] + 2.6;
    T.obj([SX - 0.75, y0, SX + 0.05, y1], (g) => { PA.parapet(g, 'y', SX - 0.35, y0, y1); for (const y of [BX[i], BX[i + 1]]) PA.bouquin(g, SX - 0.35, y, 'y', true, 7700 + y); }, { name: 'bouquinistes' });
  }
  [[-27.6, -27, 9900], [-27.8, -12.6, 9901], [-27.6, 4.5, 9902], [-27.7, 22.8, 9903]].forEach(([x, y, s]) => T.cast([x - 1.0, y], (g) => PA.person(g, x - 1.0, y, 0, PA.who(s, { dir: 0, pose: 'hold' })), { on: true }));
  PA.walker(T, PA.who(9905), [[-29.5, -34], [-29.5, 34]], 1.4, { phase: 0.3 });
  PA.walker(T, PA.who(9906), [[-29.0, 34], [-29.0, -34]], 1.2, { phase: 0.8 });

  /* ---------------- the Petit Pont over the petit bras ---------------- */
  const PB = { y0: 9, y1: 15 };
  // a flying buttress: a slim pier with a pinnacle at y + 2.2, its flyer arching over to the clerestory
  PA.flyer = PA.flyer || function (g, x, y, st) { K.box(g, x - 0.3, y + 3.1, x + 0.3, y + 3.7, 0, 7.4, st, { w: 0.45, boil: false, nohid: true }); const tp = g.p(x, y + 3.4, 7.4); g.fill2([[tp[0] - 1.0, tp[1]], [tp[0] + 1.0, tp[1]], [tp[0], tp[1] - 6]], '#D9CCAE', true); g.line2([[tp[0] - 1.0, tp[1]], [tp[0], tp[1] - 6], [tp[0] + 1.0, tp[1]]], { w: 0.35, c: '#8C7E62', boil: false }); for (const [z0, z1] of [[5.4, 8.2], [7.0, 10.4]]) { const a = g.p(x, y + 3.4, z0), m = g.p(x, y + 1.7, z1 - 0.2), b = g.p(x, y + 0.05, z1), c2 = K.curve([a, m, b], 4); g.line2(c2, { w: 1.2, c: '#D2C4A4', boil: false, ext: 0 }); g.line2(c2, { w: 0.35, c: '#7A6E58', boil: false, ext: 0 }); } };
  T.obj([SX, PB.y0, -17, PB.y1], function (g) {
    const x0 = SX, x1 = -17, dz = (x) => 0.7 * Math.sin(Math.PI * (x - x0) / (x1 - x0)), xs = []; for (let i = 0; i <= 10; i++) xs.push(lerp(x0, x1, i / 10));
    const ar = []; for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12; ar.push([lerp(x0 + 0.6, x1 - 0.6, i / 12), PB.y1, WZ + 0.2 + Math.sin(t) * 3.4]); }
    g.fill(ar, '#6B6455');
    g.fill(xs.map((x) => [x, PB.y0, dz(x)]).concat(xs.slice().reverse().map((x) => [x, PB.y1, dz(x)])), PC.pave);
    g.fill(xs.map((x) => [x, PB.y1, dz(x)]).concat(ar.slice().reverse()), '#E3D8BE');
    g.line(ar, { w: 0.65, boil: false });
    for (const y of [PB.y0 + 0.3, PB.y1 - 0.3]) { g.fill(xs.map((x) => [x, y, dz(x)]).concat(xs.slice().reverse().map((x) => [x, y, dz(x) + 1.1])), '#E3D8BE'); g.line(xs.map((x) => [x, y, dz(x) + 1.1]), { w: 0.55, boil: false }); }
  }, { name: 'petit pont', under: -0.6 });

  /* ---------------- Notre-Dame ---------------- */
  const NY0 = 6, NY1 = 16, NM = 11;    // the nave's sides, the axis
  // the choir and the apse with its flying buttresses (far part)
  T.obj([-12, 4, 2, 18], function (g) {
    g.boilP = 0.25; const i0 = g.cmds.length;
    K.box(g, -6, NY0, 2, NY1, 0, 10.5, STN, { w: 0.85 });
    // the apse: a half drum towards -x
    const ap = []; for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 + Math.PI * i / 10; ap.push([-6 + Math.cos(a) * 5, NM + Math.sin(a) * 5]); }
    g.fill(ap.map((p) => [p[0], p[1], 10.5]), STN.t);
    for (let i = 0; i < 10; i++) { const a = ap[i], b = ap[i + 1]; if (b[1] - a[1] <= 0 && (b[0] - a[0]) <= 0) continue; }
    // flying buttresses on the side we see: piers at y = 18, arches up to the clerestory
    for (let x = -4.5; x < 2; x += 2.6) PA.flyer(g, x, NY1, STN);
    for (let x = -5; x < 2; x += 2.6) PA.win(g, 'L', NY1, x - 0.4, x + 0.4, 6, 9.4, { pane: '#5A6E86', surround: false, lit: 0.15 });
    K.gable(g, -6, NY0 - 0.2, 2, NY1 + 0.2, 10.5, 5.5, 'x', { a: LEAD, b: shade(LEAD, 0.1), e: '#E6DBC2' }, { c: '#4A525A', noEnd: true });
    const apr = []; for (let i = 0; i <= 8; i++) { const a = Math.PI / 2 + Math.PI * i / 8; apr.push([-6 + Math.cos(a) * 5.2, NM + Math.sin(a) * 5.2, 10.5]); }
    g.fill(apr.concat([[-6, NM, 16]]), shade(LEAD, -0.05)); g.line(apr.slice(0, 5).concat([[-6, NM, 16]]), { w: 0.6, c: '#4A525A', boil: false });
    PA.flood(g, i0, 0.38);                                           // the flank in the light from the parvis
  }, { name: 'choir' });
  // the transept with the south rose, the nave, the spire
  T.obj([2, 2, 17.5, 20], function (g) {
    g.boilP = 0.25; const i0 = g.cmds.length;
    K.box(g, 2, NY0, 17.5, NY1, 0, 11, STN, { w: 0.9 });
    K.box(g, 3.5, 2.5, 8.5, 19.5, 0, 11, STN, { w: 0.9 });
    // flying buttresses along the nave
    for (let x = 10.2; x < 17.5; x += 2.6) PA.flyer(g, x, NY1, STN);
    for (let x = 9.6; x < 17.5; x += 2.6) PA.win(g, 'L', NY1, x - 0.45, x + 0.45, 6.4, 9.8, { pane: '#5A6E86', surround: false, lit: 0.15 });
    // the transept's rose window on its end we see
    const rc = g.p(6, 19.52, 7.0); g.disc2(rc, 6.6, '#C9D2DC'); g.ring2(rc, 6.6, { c: '#7A6E58', w: 0.5 }); const sp = []; for (let k = 0; k < 12; k++) { const a = TAU * k / 12; sp.push(rc[0], rc[1], rc[0] + Math.cos(a) * 6.4, rc[1] + Math.sin(a) * 6.4 * 0.9); } g.segs2(sp, '#7A6E58', 0.3); g.disc2(rc, 1.6, '#3F5F8F');
    PA.win(g, 'L', 19.5, 4.6, 7.4, 1.0, 3.8, { pane: '#3A3530', surround: false, lit: 0 });
    // roofs: the nave along x, the transept along y
    K.gable(g, 2, NY0 - 0.2, 17.5, NY1 + 0.2, 11, 6, 'x', { a: LEAD, b: shade(LEAD, 0.1), e: '#E6DBC2' }, { c: '#4A525A', noEnd: true });
    K.gable(g, 3.5, 2.3, 8.5, 19.7, 11, 6, 'y', { a: LEAD, b: shade(LEAD, 0.1), e: '#E6DBC2' }, { c: '#4A525A' });
    // the spire at the crossing: an octagonal lead needle on a lantern of gables, the apostles in green at its foot
    const sx = 6, sy = NM, zb = 16.5;
    K.cyl(g, sx, sy, 1.3, zb, zb + 4.5, { t: '#6E7880', l: '#8A949C', r: '#6E7880' }, { w: 0.55, n: 8 });
    for (let k = 0; k < 4; k++) { const p = g.p(sx, sy + 1.32, zb + 1 + k), q = g.p(sx + 0.8, sy + 1.1, zb + 1 + k); g.segs2([p[0], p[1], q[0], q[1]], '#4A525A', 0.3); }
    const b = g.p(sx, sy, zb + 4.5), t = g.p(sx, sy, 34);
    g.fill2([[b[0] - 3.6, b[1]], [b[0] + 3.6, b[1]], [t[0] + 0.25, t[1]], [t[0] - 0.25, t[1]]], '#86909A');
    g.fill2([[b[0] + 0.3, b[1]], [b[0] + 3.6, b[1]], [t[0] + 0.25, t[1]], [t[0] + 0.05, t[1]]], '#6E7880');
    const fl = []; for (let k = 1; k < 9; k++) { const tt = k / 9, y = lerp(b[1], t[1], tt), w = lerp(3.6, 0.25, tt); fl.push(b[0] - w, y, b[0] + w, y - 0.6); } g.segs2(fl, '#5A626C', 0.35);
    g.line2([[b[0] - 3.6, b[1]], [t[0], t[1]], [b[0] + 3.6, b[1]]], { w: 0.6, c: '#3E444B', boil: false });
    g.disc2([t[0], t[1] - 0.8], 0.5, PC.gold);
    for (let k = 0; k < 6; k++) { const a = Math.PI * 0.1 + Math.PI * 0.8 * k / 5, p = g.p(sx + Math.cos(a) * 2.6, sy + Math.sin(a) * 2.6, zb - 0.6); g.fill2([[p[0] - 0.5, p[1]], [p[0] + 0.5, p[1]], [p[0] + 0.35, p[1] - 2.4], [p[0] - 0.35, p[1] - 2.4]], '#7FA88E', true); }
    // at night the cathedral is floodlit: the nave and transept softly, the rebuilt spire lit up its height
    PA.flood(g, i0, 0.45);
    g.glow('lantern', sx, sy, 22, { r: 2.2, col: '#FFE2B0' }); g.glow('lantern', sx, sy, 28, { r: 1.4, col: '#FFE2B0' });
  }, { name: 'nave' });
  // the west front and the twin towers, looking at us across the main arm
  T.obj([17.5, 3.5, 24.5, 18.5], function (g) {
    g.boilP = 0.3;
    const x0 = 17.5, x1 = 24.5, F = x1, i0 = g.cmds.length;
    K.box(g, x0, 3.5, x1, 18.5, 0, 17.2, STN, { w: 1.0 });
    // three portals, the gallery of kings, the rose, the open gallery
    for (const [m, hw, h] of [[6.2, 1.5, 6.0], [11, 1.9, 7.0], [15.8, 1.5, 6.0]]) {
      const pts = [K.pt('R', F + 0.03, m - hw, 0), K.pt('R', F + 0.03, m + hw, 0)]; for (let i = 0; i <= 8; i++) { const t = i / 8, a = m + hw - 2 * hw * t, z = h - 2.0 + Math.sin(Math.PI * t) * 2.0 + (t > 0.5 ? (1 - t) : t) * 0; pts.push(K.pt('R', F + 0.03, a, z + (Math.abs(t - 0.5) < 0.06 ? 0.5 : 0))); }
      const ring = pts.slice(2).map((p) => [p[0] + 0.02, p[1], p[2] + 0.9]); g.fill(pts, '#4A4038');
      g.line(ring, { w: 0.4, c: '#A99A7B', boil: false }); g.line(pts.slice(2), { w: 0.55, boil: false });
      const tym = g.p(F + 0.05, m, h - 1.2); g.disc2(tym, 0.9, '#C9B996');
    }
    const iPort = g.cmds.length;
    g.fill(K.on('R', F + 0.04, 3.5, 18.5, 8.0, 9.4), '#E2D6BB');
    const kings = []; for (let a = 4.2; a < 18; a += 0.85) { const p = g.p(F + 0.06, a, 8.15); kings.push(p); } for (const p of kings) { g.fill2([[p[0] - 0.55, p[1]], [p[0] + 0.55, p[1]], [p[0] + 0.45, p[1] - 3.4], [p[0] - 0.45, p[1] - 3.4]], '#C2B494', true); g.disc2([p[0], p[1] - 3.8], 0.5, '#C2B494'); }
    const rc = g.p(F + 0.05, 11, 12.5); g.disc2(rc, 9.2, '#E2D6BB'); g.disc2(rc, 8.0, '#B9C6D2'); g.ring2(rc, 8.0, { c: '#7A6E58', w: 0.5 });
    const sp = []; for (let k = 0; k < 16; k++) { const a = TAU * k / 16; sp.push(rc[0] + Math.cos(a) * 1.8, rc[1] + Math.sin(a) * 1.8, rc[0] + Math.cos(a) * 7.8, rc[1] + Math.sin(a) * 7.8); } g.segs2(sp, '#7A6E58', 0.32); g.ring2(rc, 4.6, { c: '#7A6E58', w: 0.35 }); g.disc2(rc, 1.8, '#3F5F8F');
    for (const m of [6.2, 15.8]) PA.win(g, 'R', F, m - 0.9, m + 0.9, 10.4, 14.4, { pane: '#5A6E86', surround: false, lit: 0 });
    const gal = []; for (let a = 3.8; a < 18.4; a += 0.7) { const p = g.p(F + 0.05, a, 15.4), q = g.p(F + 0.05, a, 17.0); gal.push(p[0], p[1], q[0], q[1]); } g.segs2(gal, '#6E6252', 0.55);
    g.line([K.pt('R', F + 0.05, 3.5, 15.3), K.pt('R', F + 0.05, 18.5, 15.3)], { w: 0.45, c: '#A99A7B', boil: false });
    // the two towers
    for (const [y0, y1] of [[3.5, 9.0], [13.0, 18.5]]) {
      K.box(g, x0 + 0.4, y0, x1, y1, 17.2, 28, STN, { w: 0.95, nohid: true });
      for (const [f, p, a0, a1] of [['R', x1, y0, y1], ['L', y1, x0 + 0.4, x1]]) {
        const m = (a0 + a1) / 2, w2 = (a1 - a0) * 0.16;
        for (const s of [-1, 1]) { const q = [K.pt(f, p + 0.04, m + s * w2 * 1.5 - w2, 18.2), K.pt(f, p + 0.04, m + s * w2 * 1.5 + w2, 18.2), K.pt(f, p + 0.04, m + s * w2 * 1.5 + w2, 25.2), K.pt(f, p + 0.04, m + s * w2 * 1.5, 26.4), K.pt(f, p + 0.04, m + s * w2 * 1.5 - w2, 25.2)]; g.fill(q, '#4A4038'); const lv = []; for (let z = 18.8; z < 25.0; z += 0.7) { const a2 = g.p.apply(g, K.pt(f, p + 0.05, m + s * w2 * 1.5 - w2, z)), b2 = g.p.apply(g, K.pt(f, p + 0.05, m + s * w2 * 1.5 + w2, z)); lv.push(a2[0], a2[1], b2[0], b2[1]); } g.segs2(lv, '#8C7E62', 0.3); }
      }
      // the parapet of pinnacles on top
      const pn = []; for (let a = y0; a <= y1 + 0.01; a += 0.9) { const p = g.p(x1, a, 28), q = g.p(x1, a, 28.9); pn.push(p[0], p[1], q[0], q[1]); } for (let a = x0 + 0.4; a <= x1; a += 0.9) { const p = g.p(a, y1, 28), q = g.p(a, y1, 28.9); pn.push(p[0], p[1], q[0], q[1]); }
      g.segs2(pn, '#B5A684', 0.55);
      g.line([[x0 + 0.4, y1, 28.9], [x1, y1, 28.9], [x1, y0, 28.9]], { w: 0.5, boil: false });
    }
    // at night the west front and its towers are floodlit warm from the parvis, the doors open and lit
    PA.flood(g, i0, 0.8, '#FFE0B0');
    for (let k = i0; k < iPort; k++) if (g.cmds[k].c === '#4A4038') g.cmds[k].nc = '#B87A3E';
    for (const [y, z, r] of [[11, 4, 4.4], [11, 12.5, 4.4], [6.2, 23, 3], [15.8, 23, 3]]) g.glow('lantern', F, y, z, { r, col: '#FFDDA6' });
  }, { name: 'west front' });
  // the flag on the south tower... and the bells' sound marks: a few strokes beside the north tower now and then
  T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 2) % 8; return { x: 24.6, y: 18.6, z: 21, key: f, f }; },
    draw(g, st) { if (st.f > 2) return; const p = g.p(0, 0, 0); for (let k = 0; k < 3; k++) g.line2(arcPts(p[0] + 2 + k * 1.6, p[1] - 2, 2.4 + k * 1.6, -0.7, 0.7, 5), { w: 0.4, c: '#8C7E62', boil: false }); } });

  /* ---------------- the parvis, the market, the tip ---------------- */
  // the queue along the front, a guide with a raised umbrella and her group
  T.obj([25.6, 4.8, 26.4, 17], (g) => { const r = []; for (let y = 5; y <= 17; y += 1.5) { const a = g.p(26, y, 0), b = g.p(26, y, 1.5); r.push(a[0], a[1], b[0], b[1]); } g.segs2(r, '#6B6458', 0.4); g.line([[26, 5, 1.4], [26, 17, 1.4]], { w: 0.4, c: '#9C3A30', boil: false }); }, { name: 'barrier' });
  T.cast([27.4, 11], function (g) { const sp = []; for (let i = 0; i < 9; i++) sp.push([27.4 + (i % 2) * 0.5, 5.4 + i * 1.35]); sp.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])); sp.forEach(([x, y], i) => PA.person(g, x, y, 0, PA.who(9920 + i, { dir: 3, pose: i % 3 ? 'stand' : 'hold' }))); }, { name: 'queue' });
  T.cast([27, 22], function (g) {
    const r = PA.person(g, 25.8, 23.2, 0, PA.who(9935, { dir: 0, pose: 'cheer', ph: 0.25, top: '#C9463E' })); const h = r.hands[0]; g.line2([[h[0], h[1] + 1], [h[0], h[1] - 4]], { w: 0.4, c: '#3A3530', boil: false }); g.fill2(arcPts(h[0], h[1] - 4, 3.0, Math.PI, TAU, 8).concat([[h[0] + 3, h[1] - 4], [h[0] - 3, h[1] - 4]]), '#E6C24F', true);
    for (const [x, y, s] of [[28.0, 21.6, 9936], [28.6, 23.4, 9937], [27.6, 25.2, 9938], [29.2, 25.0, 9939], [26.6, 26.6, 9940]]) PA.person(g, x, y, 0, PA.who(s, { dir: 2, pose: s % 2 ? 'hold' : 'stand' }));
  }, { name: 'tour group' });
  // the flower market's stalls on the island's near side
  for (const [x, y, a, b] of [[-11.5, 26.4, '#2F5D4B', '#F3F1EA']]) T.obj([x, y], (g) => K.stall(g, x, y, { face: 'L', L: 2.6, D: 1.3, a, b, goods: (g2, D, L) => K.blooms(g2, -D, -L, D, L, 2.7, ['#C9463E', '#E6C24F', '#E9806A', '#D98AA4', '#F3F1EA'], { sp: 0.8, r: 0.9 }) }), { name: 'flower stall' });
  T.cast([-8, 29.5], (g) => { PA.person(g, -8.2, 29.5, 0, PA.who(9945, { dir: 2, pose: 'hold' })); PA.person(g, -6.4, 28.0, 0, PA.who(9946, { dir: 1, pose: 'hold', top: '#5F8F6A' })); }, { on: true });
  // the willow at the tip, lovers on the lawn, an angler on the point
  T.obj([-5, -27], function (g) {
    const f = g.p(-5, -27, 0), top = [f[0], f[1] - 6.4 * VZ];
    g.fill2([[f[0] - 1.0, f[1]], [f[0] + 1.0, f[1]], [top[0] + 0.7, top[1]], [top[0] - 0.7, top[1]]], '#7C6A4E');
    const R = RNG(51); for (let i = 0; i < 18; i++) { const a = -Math.PI * 0.95 + Math.PI * 0.9 * i / 17, ex = top[0] + Math.cos(a) * (12 + R() * 4), ey = top[1] + 6 + R() * 6; g.line2(K.curve([[top[0] + (R() - 0.5) * 4, top[1] - 4], [lerp(top[0], ex, 0.6), top[1] - 6 + R() * 2], [ex, ey], [ex + (R() - 0.5) * 2, ey + 9 + R() * 6]], 3, false), { w: 1.6, c: i % 3 ? '#B7C46A' : '#9FB25A', boil: false, ext: 0 }); }
    g.fill2(arcPts(top[0], top[1] - 6, 9, Math.PI * 1.05, Math.PI * 1.95, 8).concat([[top[0], top[1] - 1]]), '#C4CE7A');
  }, { name: 'willow' });
  T.cast([-9, -23], (g) => { PA.person(g, -9.4, -23.4, 0, PA.who(9950, { dir: 0, pose: 'sit' })); PA.person(g, -8.0, -22.6, 0, PA.who(9951, { dir: 0, pose: 'sit', dress: '#C9584B' })); }, { on: true });
  T.cast([2, -27], (g) => { const r = PA.person(g, 2.5, -27, 0, PA.who(9952, { dir: 0, pose: 'stand', hands: [[3.4, -12.5], [2.4, -11.2]] })); const h = r.hands[0]; g.line2([h, [h[0] + 18, h[1] - 6]], { w: 0.45, c: '#4A3A2C', boil: false, ext: 0 }); }, { on: true });
  for (const [x, y] of [[-12, 0], [-12, 22], [-14, -12], [14, -14], [28, -4.5], [14, 0.5]]) T.obj([x, y], (g) => PA.plane(g, x, y, { r: 3.2, h: 5.8, turn: 0.5 }), { name: 'island tree' });
  for (const [x, y] of [[-15, 3.6], [-15, 30]]) T.obj([x, y], (g) => PA.lamp(g, x, y, {}), { name: 'lamp' });
  // walkers: over the Petit Pont onto the parvis, round the island
  PA.walker(T, PA.who(9960), [[-29, 12], [-16, 12], [20, 12], [20, 1], [-14, 1], [-14, 12]], 1.4, { phase: 0.1, z: (x) => (x > SX && x < -17 ? 0.7 * Math.sin(Math.PI * (x - SX) / 9) : 0) });
  PA.walker(T, PA.who(9961), [[29, 29], [-14, 29], [-14, -16], [16, -16], [29, -4]], 1.3, { phase: 0.4 });
  PA.walker(T, PA.who(9962), [[-14, -16], [-14, 29], [29, 29], [29, -4], [16, -16]], 1.5, { phase: 0.7 });
  // a small motor launch in the petit bras
  T.actor({ sample: 0.3, period: 24, grow: false,
    at(t) { const u = ((t / 24) % 1 + 1) % 1, y = 40 - u * 82, a = Math.min(1, (40 - Math.abs(y)) / 6); if (a <= 0.02) return null; return { x: -21.5, y: y + 0, z: WZ, key: 0, alpha: a < 1 ? a : null }; },
    draw(g) { K.boat(g, -Math.PI / 2, { kind: 'motor', L: 2.6, W: 1.1, hull: '#F3F1EA', stripe: '#2F4A63' }); } });
  PA.streetSide(T, {});
});
