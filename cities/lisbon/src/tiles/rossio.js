'use strict';
/* (0,0) Rossio and the Carmo: the valley square and the hill beside it.
   Rossio (Praça D. Pedro IV): the black-and-white wave pavement (mar largo) over the whole square, the column of Pedro IV
   in the middle with the king on top, a baroque bronze fountain at each end throwing water into a stone basin, the
   Teatro Nacional D. Maria II closing the north side (a neoclassical front: six columns, a pediment, the attic), flower
   sellers' stalls along the east side. West of it the ground climbs: the Largo do Carmo stands on a retaining wall 14 u
   high, its jacarandas over the café tables, the roofless Gothic nave of the Carmo convent (its arches standing open
   to the sky since 1755). The Elevador de Santa Justa rises from the valley: a neo-Gothic iron tower with two wooden
   cabins going up and down inside it, a walkway across to the Largo at the top and a viewing deck above.
   Who: a queue for the lift; people on the deck and walkway; tourists photographing the waves; a flower seller and
   her customers; children at the fountains; a pigeon flock; people at café tables under the jacarandas up on the
   Largo; walkers crossing the square in all directions. */
SF.tile('rossio', 0, 0, { rim: 22 }, function (T) {
  const H = 37, ZC = 14, IRON = '#4A4540', IRONT = { t: '#5E5850', l: '#5A544C', r: '#46413B' };
  T.ground(function (g) {
    K.slab(g, H, { top: LC.calc });
    g.boilP = 0.1;
    LX.waves(g, -12, -26, H, H, { axis: 'y', amp: 2.4, wl: 10, band: 2.0, gap: 4.6 });
    // the plain pavement under the theatre's steps
    LX.pave(g, -12, -H, H, -26, { edge: 's' });
  }, { rim: true });

  /* ---------------- the Carmo: terrace, ruins, jacarandas, café ---------------- */
  T.obj([-H, -H, -14, 12], function (g) {
    LX.terrace(g, -H, -H, -14, 12, 0, ZC, { top: '#EDE6D6' });
    // houses built into the wall: windows and doors in the retaining faces, a stair up the corner
    for (const [f, p, a0, a1] of [['L', 12, -H, -14], ['R', -14, -H, 12]]) {
      const nb = Math.round((a1 - a0) / 4.2);
      for (let b = 0; b < nb; b++) { const m = lerp(a0, a1, (b + 0.5) / nb); if (b % 3 === 1) LX.door(g, f, p, m - 0.8, m + 0.8, 0, 3.4, '#4F6A5E'); else LX.win(g, f, p, m - 0.6, m + 0.6, 1.4, 3.6, { glass: '#6A7F8C' }); LX.win(g, f, p, m - 0.55, m + 0.55, 6.4, 8.8, { bal: b % 2 === 0, glass: '#5E7380' }); }
      LX.azulejo(g, f, p, f === 'L' ? -30 : -30, f === 'L' ? -20 : -20, 10.2, 12.6, 'y', 3);
    }
    for (const [f, p, a0, a1] of [['L', 12, -H, -14], ['R', -14, -H, 12]]) LX.parapet(g, f, p, a0, a1, ZC, { h: 1.0 });
  }, { name: 'carmo terrace' });
  // the convent's ruined nave: two rows of pointed arches on piers, the end wall with its empty rose, no roof
  T.obj([-35, -35, -19, -22], function (g) {
    const Z = ZC, ST = { t: '#DCD3BF', l: '#E9E2D2', r: '#CFC5B0' };
    K.box(g, -35, -35, -19, -33.6, Z, Z + 13, ST, { w: 0.8 });          // the north wall
    K.box(g, -35, -35, -33.6, -22, Z, Z + 13, ST, { w: 0.8 });          // the west end
    for (const y of [-31, -26.5]) for (let x = -33; x <= -21; x += 4) {
      K.box(g, x - 0.5, y - 0.5, x + 0.5, y + 0.5, Z, Z + 9.5, ST, { w: 0.55, boil: false });
      if (x + 4 <= -21) { const pts = []; for (let k = 0; k <= 8; k++) { const t = k / 8, a = Math.PI * t; pts.push([x + 0.5 + 3 * (1 - Math.cos(a)) / 2, y, Z + 9.5 + Math.sin(a) * 2.6 * (1 - Math.abs(2 * t - 1) * 0.15)]); } g.line(pts, { w: 1.6, c: '#D3C9B3', boil: false }); g.line(pts, { w: 0.5, c: '#8C8270', boil: false }); }
    }
    K.box(g, -20.4, -35, -19, -22, Z, Z + 15, ST, { w: 0.85 });         // the east end wall, standing tall, its rose window open to the sky
    const r = g.p(-19, -28.5, Z + 10.5); g.disc2(r, 4.6, '#F0EEE4'); g.ring2(r, 4.6, { w: 0.6, c: '#8C8270' });
    K.win(g, 'R', -19, -31, -26, Z, Z + 5.6, { style: 'dark', arch: true });
  }, { on: true, name: 'carmo ruins' });
  [[-28, -14], [-20.5, -16], [-31, -3]].forEach(([x, y], i) => T.obj([x, y], (g) => LX.jacaranda(g, x, y, { z: ZC, r: 4.6, h: 5.4, fallen: true, seed: 300 + i }), { on: true, name: 'jacaranda' }));
  [[-24, -6], [-29, 4], [-21, 3]].forEach(([x, y], i) => T.cast([x, y], function (g) {
    const tt = g.p(x, y, ZC + 2.4), tb = g.p(x, y, ZC); g.segs2([tb[0], tb[1], tt[0], tt[1]], '#5A4A3C', 0.45); g.fill2(arcPts(tt[0], tt[1], 2.6, 0, TAU, 12).map((p) => [p[0], tt[1] + (p[1] - tt[1]) * 0.5]), '#F3F1EA', true);
    for (const [dx, dy, d, k] of [[-1.8, 0, 0, 0], [1.8, 0.3, 1, 1]]) { K.box(g, x + dx - 0.6, y + dy - 0.6, x + dx + 0.6, y + dy + 0.6, ZC + 0.9, ZC + 1.3, { t: '#3F5F4F', l: '#4F6F5F', r: '#3A5848' }, { w: 0.3, boil: false }); LX.person(g, x + dx, y + dy, ZC + 1.3, LX.who(600 + i * 2 + k, { dir: d, pose: 'sit', beer: k === 0 })); }
  }, { on: true }));
  LX.walker(T, LX.who(610), [[-33, -18], [-16.5, -18], [-16.5, 9], [-33, 9]], 0.9, { z: ZC, phase: 0.2 });
  LX.walker(T, LX.who(611), [[-16.5, 9], [-33, 9], [-33, -18], [-16.5, -18]], 0.8, { z: ZC, phase: 0.6 });

  /* ---------------- the Elevador de Santa Justa ---------------- */
  const LX0 = -9.5, LX1 = -4.5, LY0 = 15, LY1 = 20, TOP = ZC + 0.6, DECK = ZC + 7;
  const lattice = (g, face, p, a0, a1, z0, z1) => {
    const segs = [], P = (a, z) => g.p.apply(g, LX.out(face, p, a, z, 0));
    for (let z = z0; z < z1 - 0.1; z += 2.2) { const a = P(a0, z), b = P(a1, z), c = P(a0, Math.min(z1, z + 2.2)), d = P(a1, Math.min(z1, z + 2.2)); segs.push(a[0], a[1], d[0], d[1], b[0], b[1], c[0], c[1], a[0], a[1], b[0], b[1]); }
    g.segs2(segs, IRON, 0.32);
    for (const k of [0, 0.25, 0.5, 0.75, 1]) { const a = lerp(a0, a1, k), p0 = P(a, z0), p1 = P(a, z1); g.line2([p0, p1], { w: k % 1 === 0 ? 0.75 : 0.35, c: '#2E2A26', boil: false }); }
  };
  // the far faces first (seen through the open lattice), then the cabins (actors), then the near faces
  T.obj([LX0, LY0, LX1, LY0 + 0.3], function (g) {
    g.fill(K.rect(LX0, LY0, LX1, LY1, 0.02), '#8C8578');
    for (const [f, p, a0, a1] of [['L', LY0, LX0, LX1], ['R', LX0, LY0, LY1]]) { g.fill(K.on(f, p, a0, a1, 0, TOP), 'rgba(70,64,56,0.18)'); lattice(g, f, p, a0, a1, 0, TOP); }
  }, { name: 'lift back' });
  T.obj([LX0 - 0.6, LY0 - 0.6, LX1 + 0.6, LY1 + 0.6], function (g) {     // (a footprint over 6 u, so it sorts as a box, not as a small prop)
    for (const [f, p, a0, a1] of [['L', LY1, LX0, LX1], ['R', LX1, LY0, LY1]]) lattice(g, f, p, a0, a1, 0, TOP);
    // the door at the foot, the cornice at the top floor, the upper storey with its pointed windows, the deck and its rail
    g.fill(K.on('L', LY1 + 0.04, -8, -6, 0, 3.6), '#3A3530');
    K.box(g, LX0 - 0.3, LY0 - 0.3, LX1 + 0.3, LY1 + 0.3, TOP, TOP + 0.8, IRONT, { w: 0.6 });
    K.box(g, LX0 + 0.4, LY0 + 0.4, LX1 - 0.4, LY1 - 0.4, TOP + 0.8, DECK - 0.8, IRONT, { w: 0.7 });
    for (const [f, p, a0, a1] of [['L', LY1 - 0.4, LX0 + 0.4, LX1 - 0.4], ['R', LX1 - 0.4, LY0 + 0.4, LY1 - 0.4]]) for (let k = 0; k < 2; k++) { const m = lerp(a0, a1, (k + 0.5) / 2); K.win(g, f, p, m - 0.6, m + 0.6, TOP + 1.6, DECK - 1.6, { style: 'glass', arch: true }); }
    K.box(g, LX0 - 0.2, LY0 - 0.2, LX1 + 0.2, LY1 + 0.2, DECK - 0.8, DECK, IRONT, { w: 0.6 });
    const rail = []; for (const [a, b] of [[[LX0 - 0.2, LY1 + 0.2], [LX1 + 0.2, LY1 + 0.2]], [[LX1 + 0.2, LY0 - 0.2], [LX1 + 0.2, LY1 + 0.2]]]) for (let k = 0; k <= 6; k++) { const x = lerp(a[0], b[0], k / 6), y = lerp(a[1], b[1], k / 6), p0 = g.p(x, y, DECK), p1 = g.p(x, y, DECK + 1.1); rail.push(p0[0], p0[1], p1[0], p1[1]); }
    g.segs2(rail, IRON, 0.35); g.line([[LX0 - 0.2, LY1 + 0.2, DECK + 1.1], [LX1 + 0.2, LY1 + 0.2, DECK + 1.1], [LX1 + 0.2, LY0 - 0.2, DECK + 1.1]], { w: 0.5, c: IRON, boil: false });
    // the little lantern on top
    K.box(g, -7.6, 16.9, -6.4, 18.1, DECK, DECK + 2.4, IRONT, { w: 0.5 }); K.cone(g, -7, 17.5, 0.9, DECK + 2.4, 1.6, '#46413B', { w: 0.45 });
  }, { under: 99, name: 'lift' });
  // the walkway across to the Largo: a lattice bridge at the terrace's height
  T.obj([-14, 16.3, LX0, 18.7], function (g) {
    K.box(g, -14, 16.3, LX0, 18.7, ZC - 1.4, ZC, IRONT, { w: 0.6 });
    lattice(g, 'L', 18.7, -14, LX0, ZC - 1.4, ZC);
    g.line([[-14, 18.7, ZC + 1.1], [LX0, 18.7, ZC + 1.1]], { w: 0.45, c: IRON, boil: false });
  }, { under: ZC - 1.4, name: 'walkway' });
  // the cabins: one climbs while the other comes down, a pause at each end
  for (let i = 0; i < 2; i++) T.actor({ sample: 0.3, period: 36, grow: false,
    at(t) { const u = (((t / 36) + i * 0.5) % 1 + 1) % 1, s = u < 0.35 ? smooth(u / 0.35) : u < 0.5 ? 1 : u < 0.85 ? 1 - smooth((u - 0.5) / 0.35) : 0; const z = 0.3 + s * (TOP - 4.6); return { x: i ? -5.8 : -8.2, y: LY1 - 0.4, z, key: 'c' + i }; },
    draw(g) {
      const x0 = -0.95, x1 = 0.95, y0 = -3.0, y1 = 0;
      K.box(g, x0, y0, x1, y1, 0, 3.4, { t: '#9C7A52', l: '#B58A5A', r: '#9A7248' }, { w: 0.45, boil: false });
      for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) { g.fill(K.on(f, p + 0.03, a0 + 0.25, a1 - 0.25, 1.6, 3.0), '#DDE6E8'); const m = (a0 + a1) / 2, h = g.p.apply(g, LX.out(f, p, m, 2.4, 0.04)); g.disc2(h, 0.75, SKIN[i + 1]); g.fill2(arcPts(h[0], h[1] - 0.2, 0.8, Math.PI, TAU, 6), HAIR[i * 3], true); }
    } });
  // the queue at the foot of the lift, people on the deck and the walkway
  [[-3.2, 22.5, 1], [-2.0, 24.4, 2], [-1.2, 26.4, 3], [0.2, 28.0, 4], [-3.8, 25.6, 5]].forEach(([x, y, i]) => T.cast([x, y], (g) => LX.person(g, x, y, 0, LX.who(620 + i, { dir: 2, pose: i % 2 ? 'stand' : 'hold', phone: i === 3 }))));
  T.cast([-6.5, 19.4], (g) => { LX.person(g, -7.8, 19.6, DECK, LX.who(626, { dir: 1, pose: 'hold', phone: true })); LX.person(g, -5.6, 19.4, DECK, LX.who(627, { dir: 1, pose: 'stand' })); }, { on: true });
  T.cast([-12, 17.5], (g) => { LX.person(g, -12.6, 17.2, ZC, LX.who(628, { dir: 0 })); LX.person(g, -11.2, 17.8, ZC, LX.who(629, { dir: 2, pose: 'hold', phone: true })); }, { on: true });

  /* ---------------- the Teatro Nacional D. Maria II ---------------- */
  T.obj([-2, -H, 30, -28], function (g) {
    const W = { t: '#E9E3D6', l: '#F4F0E6', r: '#DCD5C6' }, y1 = -28;
    g.boilP = 0.3;
    K.box(g, -2, -H, 30, y1, 0, 12, W, { w: 0.95 });
    for (let b = 0; b < 10; b++) { const m = lerp(-1, 29, (b + 0.5) / 10); if (m > 8 && m < 20) continue; K.win(g, 'L', y1, m - 0.55, m + 0.55, 2, 4.6, { style: 'navy', arch: true }); K.win(g, 'L', y1, m - 0.5, m + 0.5, 6.6, 9.2, { style: 'navy' }); }
    for (let b = 0; b < 3; b++) { const m = lerp(-H, y1, (b + 0.5) / 3); K.win(g, 'R', 30, m - 0.55, m + 0.55, 2, 4.6, { style: 'navy', arch: true }); K.win(g, 'R', 30, m - 0.5, m + 0.5, 6.6, 9.2, { style: 'navy' }); }
    LX.roof(g, -2, -H, 30, y1, 12, 2.4, { col: '#B9B4AA', c: '#5E5A52' });
    // the portico: steps, six columns, the pediment with its sculpture, the attic
    K.box(g, 7.5, y1, 20.5, y1 + 3.4, 0, 1.2, W, { w: 0.6 });
    K.box(g, 8, y1, 20, y1 + 2.8, 1.2, 1.8, W, { w: 0.5 });
    g.fill(K.on('L', y1 + 0.04, 8.5, 19.5, 1.8, 9.5), '#BDB4A2');
    for (let k = 0; k < 6; k++) { const x = lerp(8.8, 19.2, k / 5); K.cyl(g, x, y1 + 2.2, 0.5, 1.8, 9.6, W, { n: 8, w: 0.55 }); }
    K.box(g, 8, y1, 20, y1 + 2.8, 9.6, 10.8, W, { w: 0.6 });
    const pd = [K.pt('L', y1 + 2.8, 8, 10.8), K.pt('L', y1 + 2.8, 20, 10.8), K.pt('L', y1 + 2.8, 14, 14.4)]; g.fill(pd, '#F4F0E6'); g.outline(pd, { w: 0.7 });
    const pc = g.p(14, y1 + 2.9, 11.8); g.fill2([[pc[0] - 6, pc[1] + 1.4], [pc[0] + 6, pc[1] + 1.4], [pc[0] + 1.4, pc[1] - 2.6], [pc[0] - 1.4, pc[1] - 2.6]], '#D9D1BF', true);
    K.text(g, 'L', y1 + 2.82, 14, 9.85, 0.55, 'TEATRO NACIONAL D. MARIA II', '#6E665A', { center: true });
    const st = g.p(14, y1 + 1.4, 14.4); g.fill2([[st[0] - 0.9, st[1]], [st[0] + 0.9, st[1]], [st[0] + 0.6, st[1] - 4.4], [st[0] - 0.6, st[1] - 4.4]], '#D9D1BF', true); g.disc2([st[0], st[1] - 5.1], 0.8, '#D9D1BF');
  }, { name: 'teatro' });

  /* ---------------- the column and the fountains ---------------- */
  T.obj([12.6, -0.4, 17.4, 4.4], function (g) {
    K.box(g, 12.6, -0.4, 17.4, 4.4, 0, 1.0, K.STONE, { w: 0.6 }); K.box(g, 13.4, 0.4, 16.6, 3.6, 1.0, 5.0, K.STONE, { w: 0.7 });
    for (const [f, p, a] of [['L', 3.6, 15], ['R', 16.6, 2]]) { const c = g.p.apply(g, LX.out(f, p, a, 3.0, 0.05)); g.disc2(c, 1.1, '#6E7A5E'); }
    K.cyl(g, 15, 2, 0.95, 5.0, 23, { t: '#ECE8DE', l: '#F4F0E6', r: '#DCD5C6' }, { n: 12, w: 0.7 });
    const fl = []; for (let k = 0; k < 5; k++) { const a = -0.4 + k * 0.5, p0 = g.p(15 + Math.cos(a) * 0.95, 2 + Math.sin(a) * 0.95, 6), p1 = g.p(15 + Math.cos(a) * 0.95, 2 + Math.sin(a) * 0.95, 22.4); fl.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(fl, '#CFC8B8', 0.3);
    K.cyl(g, 15, 2, 1.4, 23, 24, K.STONE, { n: 12, w: 0.6 });
    const b = g.p(15, 2, 24); g.fill2([[b[0] - 1.0, b[1]], [b[0] + 1.0, b[1]], [b[0] + 0.8, b[1] - 5.8], [b[0] - 0.8, b[1] - 5.8]], '#4E6A5E', true); g.disc2([b[0], b[1] - 6.6], 0.85, '#4E6A5E');
    g.line2([[b[0] + 0.6, b[1] - 4.8], [b[0] + 2.4, b[1] - 7.4]], { w: 0.5, c: '#3C5449', boil: false }); g.fill2([[b[0] - 1.6, b[1] - 4.2], [b[0] - 0.4, b[1] - 5.4], [b[0] - 0.6, b[1] - 1.0], [b[0] - 1.8, b[1] - 0.4]], '#3C5449', true);
  }, { name: 'pedro iv' });
  for (const fy of [-15, 20]) {
    T.obj([10, fy - 5, 20, fy + 5], function (g) {
      const bas = K.arc(15, fy, 0, 5, 0, TAU, 28);
      g.fill(bas.map((p) => [p[0], p[1], 1.2]), '#E9E4D8');
      K.cyl(g, 15, fy, 5, 0, 1.2, K.STONE, { n: 28, w: 0.7, nt: true });
      g.fill(K.arc(15, fy, 1.15, 4.4, 0, TAU, 28), LC.water); g.water(K.arc(15, fy, 1.16, 4.2, 0, TAU, 20), { dens: 1.5 });
      K.cyl(g, 15, fy, 0.8, 1.2, 4.6, '#5E7A6A', { n: 8, w: 0.55 });
      K.cyl(g, 15, fy, 2.0, 4.6, 5.2, '#5E7A6A', { n: 14, w: 0.55 });
      K.cyl(g, 15, fy, 0.5, 5.2, 7.4, '#5E7A6A', { n: 8, w: 0.5 });
      const t = g.p(15, fy, 7.4); g.fill2([[t[0] - 1.6, t[1]], [t[0] + 1.6, t[1]], [t[0] + 0.8, t[1] - 2.8], [t[0] - 0.8, t[1] - 2.8]], '#4E6A5E', true);
    }, { name: 'fountain' });
    T.actor({ sample: 5, period: 2, grow: false, at(t) { const f = Math.floor((t / 2 % 1) * 6); return { x: 15, y: fy + 5, z: 0, key: 'j' + f, f }; },
      draw(g, st) {
        const c = g.p(0, -5, 8.6), lo = g.p(0, -5, 5.4); g.fill2(arcPts(c[0], c[1] + 0.3, 1.0 + (st.f % 2) * 0.3, 0, TAU, 8), 'rgba(214,236,240,0.9)', true);
        for (let k = 0; k < 8; k++) { const a = TAU * k / 8 + st.f * 0.13, e = g.p(Math.cos(a) * 3.6, -5 + Math.sin(a) * 3.6, 1.3), m = [lerp(lo[0], e[0], 0.5), lerp(lo[1], e[1], 0.5) - 3.2]; g.line2([lo, m, e], { w: 0.5, c: '#CFE6EC', boil: false, ext: 0 }); }
      } });
  }

  /* ---------------- life on the square ---------------- */
  // the flower sellers along the east side
  [[30, -8, '#E2483D'], [30, 4, '#F2C230']].forEach(([x, y, c], i) => T.cast([x, y], function (g) {
    K.stall(g, x, y, { face: 'R', L: 2.6, D: 1.5, a: c, b: '#F7F5EF', goods: (g2, D, L) => { const R = RNG(40 + i); for (let k = 0; k < 18; k++) { const p = g2.p(lerp(-D, D, R()), lerp(-L, L, R()), 2.9); g2.disc2(p, 0.7, R.pick(LC.festa)); } } });
    LX.person(g, x + 1, y + 3.6, 0, LX.who(640 + i, { dir: 0, pose: 'hold', hair: '#8E8A84' }));
    LX.person(g, x + 4.4, y - 1, 0, LX.who(642 + i, { dir: 2, pose: 'hold' }));
  }));
  // children at the fountains, tourists photographing the waves, a couple on the column's steps
  T.cast([9.6, 20], (g) => { LX.person(g, 9.6, 20, 0, LX.who(650, { dir: 0, k: 0.72, pose: 'hold', reach: [3, -3] })); LX.person(g, 11.2, 25.6, 0, LX.who(651, { dir: 3, k: 0.75, pose: 'cheer', ph: 0.4 })); });
  T.cast([20.5, -15], (g) => { LX.person(g, 20.5, -15, 1.2, LX.who(652, { dir: 1, pose: 'sit' })); LX.person(g, 19.6, -10.8, 1.2, LX.who(653, { dir: 1, pose: 'sit', dress: '#7FB7D9' })); });
  T.cast([18.4, 5.4], (g) => { LX.person(g, 18.4, 5.4, 1.0, LX.who(654, { dir: 1, pose: 'sit' })); LX.person(g, 16.4, 5.6, 1.0, LX.who(655, { dir: 1, pose: 'sit', phone: true, pose2: 0 })); });
  [[1, 7, 3], [21, 30, 2], [8, -9, 2]].forEach(([x, y, d], i) => T.cast([x, y], (g) => LX.person(g, x, y, 0, LX.who(660 + i, { dir: d, pose: 'hold', reach: [0.6, -12.5], phone: true }))));
  // the plain corner by the lift: a newspaper kiosk, benches and their sitters
  T.obj([-29, 24], (g) => { K.box(g, -30.4, 22.6, -27.6, 25.4, 0, 4.0, { t: '#3F6A4E', l: '#4F7A5E', r: '#3A604A' }, { w: 0.6 }); K.hip(g, -31, 22, -27, 26, 4.0, 1.4, '#3F6A4E', { c: '#22302A' }); K.sign(g, 'L', 25.4, -30.2, -27.8, 2.6, 3.6, '#F2E3C0', 'JORNAIS', { ink: '#2F3A4F' }); }, { name: 'kiosk' });
  for (const [x, y, i] of [[-20, 27, 0], [-31, 31, 1]]) { T.obj([x, y], (g) => K.bench(g, x, y, { face: 'L', L: 2.2, col: '#4F7A5E' }), { name: 'bench' }); T.cast([x, y + 1], (g) => LX.person(g, x, y + 1.2, 1.3, LX.who(680 + i, { dir: 1, pose: 'sit', hair: i ? '#D9D5CB' : undefined })), { name: 'sitter' }); }
  // the pigeons
  T.actor({ sample: 0.3, period: 8, at(t) { const f = Math.floor((t % 8) / 8 * 16); return { x: 6, y: 13, key: 'pg' + f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), R = RNG(9); for (let i = 0; i < 12; i++) { const ox = (R() - 0.5) * 20, oy = (R() - 0.5) * 8, fly = (st.f + i * 3) % 16 < 3, p = [o[0] + ox + (fly ? 2 : 0), o[1] + oy - (fly ? 6 + i % 3 : 0)]; if (fly) g.segs2([p[0] - 1.2, p[1] - 0.6, p[0], p[1], p[0], p[1], p[0] + 1.2, p[1] - 0.6], '#6E6A64', 0.45); else { g.fill2([[p[0] - 0.9, p[1]], [p[0] + 0.9, p[1]], [p[0] + 0.6, p[1] - 0.9], [p[0] - 0.6, p[1] - 0.8]], '#8E8A84', true); g.disc2([p[0] + 0.7, p[1] - 1.1], 0.4, '#6E6A64'); } } } });
  // walkers crossing
  LX.walker(T, LX.who(670), [[-10, 34], [34, -10]], 1.2, { phase: 0.1 });
  LX.walker(T, LX.who(671), [[34, 30], [-8, -10]], 1.1, { phase: 0.5 });
  LX.walker(T, LX.who(672, { dress: '#E77FB3' }), [[24, -24], [24, 34]], 1.0, { phase: 0.3 });
  LX.walker(T, LX.who(673), [[5, 34], [5, -24]], 1.15, { phase: 0.7 });
  LX.walker(T, LX.who(674), [[-10, 12], [34, 12]], 1.05, { phase: 0.4 });
  LX.walker(T, LX.who(675, { hat: '#E9D8A6' }), [[34, -6], [-10, -6]], 0.95, { phase: 0.85 });
});
