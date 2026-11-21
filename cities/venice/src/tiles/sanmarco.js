'use strict';
/* (100, 0) Piazza San Marco, the piazzetta and the Molo. The clever moment: ACQUA ALTA.
   What is there (x runs south, y west; the basilica faces us):
   - the Basilica at the east end: five portals with gold mosaic lunettes, the loggia with the four bronze horses, a
     crest of ogee arches with gilded pinnacles, five domes with their lanterns behind; creamy marble with pink veins;
   - the Torre dell'Orologio beside it: the arch into the Mercerie, the blue-and-gold clock face, the winged lion on a
     starry blue field, the two bronze Moors striking the bell on the terrace;
   - the Procuratie Vecchie along the north side: a ground arcade and two arcaded storeys, Caffè Quadri's tables out on
     the stone and its little orchestra playing on a stage;
   - the Campanile, freestanding at the corner of the piazzetta: a brick shaft with pilaster strips, the white belfry,
     the attic with lions, the green spire with the golden angel;
   - the Doge's Palace on the piazzetta and the Molo: a ground arcade of stout pointed arches, the loggia of slender
     ones with quatrefoils, the great wall of pink and white lozenges with tall pointed windows, the crenellation;
   - the two granite columns on the Molo (the winged lion, San Todaro with his crocodile), the Giardini Reali, moored
     gondolas under their blue covers off the Molo; the piazzetta dei Leoncini with its two red lions (children ride
     them) and the bridge over the rio behind the basilica.
   Carnival week: costumed figures pose in front of the basilica for photographers, the orchestra plays, pigeons.
   ACQUA ALTA (a 60 s tide cycle, timed so the San Marco shot opens on the siren): the siren wails; people head for the
   passerelle (raised walkways on trestles) and fill them in single file; the lagoon climbs the Molo's wall; water
   wells up out of the drain grates and spreads in pools that join until the whole square is a sheet of water with
   the arcades in it; waders go on in boots, the costumes keep posing knee-deep, the café keeps serving; the pigeons
   take refuge on the cornice. Then the tide falls, the pools shrink back into the drains, the boards empty and
   people come back out of the arcades. */
/* Piazza San Marco's shared numbers: the drains, the passerelle, the tide */
const SM = {
  DRAINS: [[-22, -12], [-12, -4], [-22, 8], [-9, 16], [-20, 27], [-6, 31], [6, -8], [16, -12], [9, 6], [20, 4], [3, 24], [30, 14], [-12, -16]],
  PT: 60,                        // the tide cycle (s)
};

SF.tile('sanmarco', 100, 0, { rim: 36 }, function (T) {
  const MARBLE = { t: '#EADFCF', l: '#F2E8DA', r: '#DDD0BE' }, GOLD = '#D9AE4A', MOS = '#C9A13A';
  const ST = VN.istria, STD = VN.istriaD;

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    g.boilP = 0.15;
    K.slab(g, 37, { top: '#D8D3C8' });
    // the piazza's pattern: grey trachyte fields framed by white Istrian bands running across from the Procuratie
    g.fill(K.rect(-29, -20, 37, 37), '#CFC9BD');
    const bands = [];
    for (let y = -16; y < 37; y += 7.2) { const a = g.p(-29, y, 0), b = g.p(-2, y, 0); bands.push(a[0], a[1], b[0], b[1]); }
    for (let x = -26; x < -2; x += 6.6) { const a = g.p(x, -20, 0), b = g.p(x, 37, 0); bands.push(a[0], a[1], b[0], b[1]); }
    g.segs2(bands, '#F0ECE2', 0.9);
    const diag = []; for (let y = -16; y < 30; y += 7.2) for (let x = -26; x < -6; x += 6.6) { const a = g.p(x, y, 0), b = g.p(x + 6.6, y + 7.2, 0), c = g.p(x + 6.6, y, 0), d = g.p(x, y + 7.2, 0); diag.push(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]); }
    g.segs2(diag, '#E2DDD2', 0.45);
    // the piazzetta and the Molo: courses of masegni
    VN.pave(g, -2, -18, 37, 37, { col: '#CFC9BD', step: 2.6, ax: 'y', scuff: false });
    g.scuff(K.rect(-29, -20, 37, 37), { dir: -0.9, len: 2, c: '#E6E2D9', dens: 0.25, w: 0.55, spread: 1.2 });
    // the piazzetta dei Leoncini behind the basilica
    VN.pave(g, -37, -37, -27, -20, { col: '#D4CEC2', scuff: false });
    // the Molo's white edge, the Giardini Reali's lawn
    g.fill(K.rect(36.2, -37, 37, 37), ST); g.fill(K.rect(-37, 36.2, 37, 37), ST);
    g.fill(K.rect(12, 23, 25, 36), '#A7C084'); g.grass(K.rect(12.5, 23.5, 24.5, 35.5), { dens: 0.6 });
    // drain grates (gatoli), where the acqua alta wells up
    for (const [x, y] of SM.DRAINS) { const c = g.p(x, y, 0); g.fill2([[c[0] - 1.6, c[1]], [c[0], c[1] - 0.9], [c[0] + 1.6, c[1]], [c[0], c[1] + 0.9]], '#8E887C', true); g.segs2([c[0] - 0.8, c[1] - 0.45, c[0] + 0.8, c[1] + 0.45, c[0] - 0.8, c[1] + 0.45, c[0] + 0.8, c[1] - 0.45], '#5E5A52', 0.25); }
  }, { rim: true });

  /* ---------------- the Basilica ---------------- */
  const BX0 = -27, BX1 = -4, BY0 = -37, BY1 = -20;
  T.obj([BX0, BY0, BX1, BY1], function (g) {
    g.boilP = 0.25;
    // the body behind the facade, then the domes, then the facade itself (it hides the domes' lower parts)
    K.box(g, BX0 + 1, BY0, BX1 - 1, BY1 - 3, 0, 12, { t: '#E2D5C2', l: '#E9DDCB', r: '#D6C8B4' }, { w: 0.8 });
    const dome = (x, y, r, z0, hd) => {
      K.cyl(g, x, y, r * 0.86, z0, z0 + 2.2, { t: '#D9CBB6', l: '#E9DDCB', r: '#CDBFAA' }, { w: 0.6, n: 14 });
      const sub = []; for (let i = 0; i < 8; i++) { const a = Math.PI * 0.05 + i * 0.13, p0 = g.p(x + Math.cos(a) * r * 0.87, y + Math.sin(a) * r * 0.87, z0 + 0.5), p1 = g.p(x + Math.cos(a) * r * 0.87, y + Math.sin(a) * r * 0.87, z0 + 1.6); sub.push(p0[0], p0[1], p1[0], p1[1]); }
      g.segs2(sub, '#6E6A60', 0.5);
      K.dome(g, x, y, r, z0 + 2.2, hd, '#B3BBBD', { w: 0.7, shadow: '#97A1A5' });
      const top = z0 + 2.2 + hd;
      K.cyl(g, x, y, 0.75, top - 0.2, top + 1.4, { t: '#C9BCA6', l: '#E2D5C2', r: '#C9BCA6' }, { w: 0.45, n: 8 });
      K.dome(g, x, y, 0.95, top + 1.4, 1.5, '#B3BBBD', { w: 0.45 });
      const t = g.p(x, y, top + 2.9); g.line2([t, [t[0], t[1] - 3.2]], { w: 0.5, c: GOLD, boil: false, ext: 0 }); g.segs2([t[0] - 1, t[1] - 2.3, t[0] + 1, t[1] - 2.3], GOLD, 0.45);
    };
    dome(-15.5, -33.5, 4.2, 12, 4.2);     // the apse
    dome(-22.5, -28.5, 3.6, 12, 3.8); dome(-8.5, -28.5, 3.6, 12, 3.8);
    dome(-15.5, -28.5, 4.6, 12.5, 4.8);   // the central dome
    dome(-15.5, -23.4, 4.0, 12.2, 4.2);   // over the entrance
    // the facade: lower storey with five portals
    const F = BY1, fz = 6.4;
    K.box(g, BX0, BY1 - 3, BX1, BY1, 0, fz, MARBLE, { w: 0.85 });
    const por = [[-26, -22.4], [-21.6, -18.2], [-17.6, -13.4], [-12.8, -9.4], [-8.6, -5]];
    por.forEach(([a0, a1], i) => {
      const main = i === 2, zt = main ? 6.0 : 5.2, m = (a0 + a1) / 2;
      g.fill(VN.archPts('L', F + 0.02, a0, a1, 0, zt, 'round', 0), '#E2D3BC');
      g.fill(VN.archPts('L', F + 0.03, a0 + 0.5, a1 - 0.5, 0, zt - 0.5, 'round', 0), MOS);                       // the gold mosaic lunette
      const lp = g.P(VN.archPts('L', F + 0.04, a0 + 0.5, a1 - 0.5, 0, zt - 0.5, 'round', 0)); g.disc2([(lp[0][0] + lp[1][0]) / 2 + (lp[lp.length - 1][0] - lp[0][0]) * 0, lp[0][1] - (zt - 2.6) * 3.46 + 0.6], 0.9, '#2F4F8F');
      g.fill(K.on('L', F + 0.05, a0 + 0.7, a1 - 0.7, 0, main ? 3.2 : 2.8), '#5A3E2E');                             // the bronze doors
      const cols = []; for (const a of [a0 + 0.25, a1 - 0.25]) { const p0 = g.p(a, F + 0.06, 0), p1 = g.p(a, F + 0.06, zt - (a1 - a0) / 2); cols.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(cols, '#C98A7A', 0.9);
      g.outline(VN.archPts('L', F + 0.03, a0, a1, 0, zt, 'round', 0), { w: 0.55, boil: false, c: '#6E5A44' });
      void m;
    });
    // the terrace with the four bronze horses over the central portal, a balustrade
    g.fill(K.rect(BX0, BY1 - 3, BX1, BY1 + 0.3, fz), '#E2D5C2');
    const bal = []; for (let a = BX0 + 0.3; a < BX1; a += 0.5) { const p0 = g.p(a, BY1 + 0.25, fz), p1 = g.p(a, BY1 + 0.25, fz + 0.8); bal.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(bal, '#C9BBA6', 0.35);
    g.line([[BX0, BY1 + 0.25, fz + 0.8], [BX1, BY1 + 0.25, fz + 0.8]], { w: 0.5, boil: false });
    for (let i = 0; i < 4; i++) { const p = g.p(-17.4 + i * 1.25, BY1 - 0.4, fz); g.fill2([[p[0] - 1.4, p[1] - 1.0], [p[0] + 0.8, p[1] - 1.6], [p[0] + 1.6, p[1] - 3.4], [p[0] + 1.0, p[1] - 3.8], [p[0] + 0.2, p[1] - 2.4], [p[0] - 1.2, p[1] - 2.4]], '#7A6A3E', true); g.segs2([p[0] - 1.1, p[1] - 1.0, p[0] - 1.2, p[1] + 0.2, p[0] + 0.6, p[1] - 1.4, p[0] + 0.8, p[1] + 0.1], '#5E5030', 0.45); }
    // the upper storey: five arches (the central one glazed), ogee crests with gilded pinnacles and statues
    const up = [[-26, -22.4], [-21.6, -18.2], [-17.8, -13.2], [-12.8, -9.4], [-8.6, -5]];
    K.box(g, BX0 + 0.4, BY1 - 3, BX1 - 0.4, BY1 - 1.0, fz, 11.4, MARBLE, { w: 0.7, nb: true });
    up.forEach(([a0, a1], i) => {
      const main = i === 2, P = BY1 - 0.98, zt = main ? 11 : 10.4;
      if (main) { g.fill(VN.archPts('L', P, a0 + 0.3, a1 - 0.3, fz + 0.9, zt - 0.4, 'round', 0), '#B9CBD6'); const gl = g.P(VN.archPts('L', P + 0.01, a0 + 0.3, a1 - 0.3, fz + 0.9, zt - 0.4, 'round', 0)); g.segs2([gl[0][0] + 2, gl[0][1] - 1, gl[0][0] + 6, gl[0][1] - 6], '#FFFFFF', 0.6); }
      else g.fill(VN.archPts('L', P, a0 + 0.3, a1 - 0.3, fz + 0.9, zt - 0.4, 'round', 0), MOS);
      // the ogee crest over each arch
      const m = (a0 + a1) / 2, hw = (a1 - a0) / 2 + 0.2, crest = [];
      for (let k = 0; k <= 16; k++) { const t = 1 - 2 * k / 16, aa = Math.abs(t); crest.push([m + t * hw, P, zt + (aa > 0.45 ? 1.4 * Math.sqrt(Math.max(0, 1 - Math.pow((aa - 0.45) / 0.55, 2))) : 1.4 + 1.8 * Math.pow(1 - aa / 0.45, 1.5))]); }
      g.fill(crest.concat([[m - hw, P, zt - 0.2], [m + hw, P, zt - 0.2]].reverse()), '#F2E8DA');
      g.line(crest, { w: 0.5, boil: false, c: '#6E5A44' });
      const tip = g.p(m, P, zt + 3.3); g.fill2([[tip[0] - 0.5, tip[1] + 0.6], [tip[0] + 0.5, tip[1] + 0.6], [tip[0], tip[1] - 1.8]], GOLD, true);
      g.outline(VN.archPts('L', P, a0 + 0.3, a1 - 0.3, fz + 0.9, zt - 0.4, 'round', 0), { w: 0.45, boil: false, c: '#6E5A44' });
      // pinnacle tabernacles between the arches
      if (i < 4) { const pa = (a1 + up[i + 1][0]) / 2, b = g.p(pa, P + 0.2, fz + 0.8), t = g.p(pa, P + 0.2, 12.4); g.fill2([[b[0] - 0.8, b[1]], [b[0] + 0.8, b[1]], [t[0] + 0.5, t[1] + 2], [t[0], t[1]], [t[0] - 0.5, t[1] + 2]], '#EFE5D6', true); g.line2([[b[0] - 0.8, b[1]], [t[0], t[1]], [b[0] + 0.8, b[1]]], { w: 0.35, boil: false, c: '#6E5A44' }); g.disc2([t[0], t[1] - 0.4], 0.45, GOLD); }
    });
    // the winged lion on blue over the main arch, the saint on top
    const lc = g.p(-15.5, BY1 - 0.97, 11.6); g.fill2(arcPts(lc[0], lc[1], 2.0, 0, TAU, 10).map((q) => [q[0], lc[1] + (q[1] - lc[1]) * 0.8]), '#2F4F8F', true); g.fill2([[lc[0] - 1.3, lc[1] + 0.6], [lc[0] + 1.2, lc[1] + 0.3], [lc[0] + 0.6, lc[1] - 1.2], [lc[0] - 0.4, lc[1] - 0.6]], GOLD, true);
    const sc = g.p(-15.5, BY1 - 0.97, 14.3); g.fill2([[sc[0] - 0.6, sc[1]], [sc[0] + 0.6, sc[1]], [sc[0] + 0.4, sc[1] - 2.6], [sc[0] - 0.4, sc[1] - 2.6]], '#F6F1E4', true); g.disc2([sc[0], sc[1] - 3.0], 0.55, GOLD);
    g.line([[BX0, BY1, 0], [BX1, BY1, 0]], { w: 0.9 });
  }, { name: 'basilica' });
  // the Porta della Carta between the basilica and the palace
  T.obj([-4, -37, -2.5, -20], (g) => {
    K.box(g, -4, -37, -2.5, -20, 0, 13.5, MARBLE, { w: 0.7 });
    g.fill(VN.archPts('L', -19.98, -3.75, -2.75, 0, 7.6, 'gothic', 0), '#5A4A3E');
    for (let z = 8.5; z < 13; z += 1.4) { const p = g.p(-3.25, -19.97, z); g.fill2([[p[0] - 0.8, p[1]], [p[0] + 0.8, p[1]], [p[0], p[1] - 1.2]], '#E8D9C2', true); }
    const t = g.p(-3.25, -20, 13.5); g.fill2([[t[0] - 0.8, t[1]], [t[0] + 0.8, t[1]], [t[0], t[1] - 3.2]], '#EFE5D6', true); g.disc2([t[0], t[1] - 3.4], 0.5, GOLD);
  }, { name: 'porta della carta' });

  /* ---------------- Torre dell'Orologio and the Procuratie Vecchie ---------------- */
  T.obj([-37, -20, -29, -14], function (g) {
    g.boilP = 0.3;
    K.box(g, -37, -20, -29, -14, 0, 17.5, { t: '#E9E3D6', l: '#F3EFE6', r: '#E2DCCF' }, { w: 0.9 });
    g.fill(VN.archPts('R', -28.98, -18.6, -15.4, 0, 6.4, 'round', 0), '#4A3E34'); g.outline(VN.archPts('R', -28.98, -18.6, -15.4, 0, 6.4, 'round', 0), { w: 0.5, boil: false });
    // the clock: blue enamel and gold
    const c = g.p(-28.95, -17, 9.8); g.fill2(arcPts(c[0], c[1], 7.4, 0, TAU, 20).map((q) => [q[0], c[1] + (q[1] - c[1]) * 1.25 + (q[0] - c[0]) * 0.5]), '#E9E3D6', true);
    g.fill2(arcPts(c[0], c[1], 6.2, 0, TAU, 20).map((q) => [q[0], c[1] + (q[1] - c[1]) * 1.25 + (q[0] - c[0]) * 0.5]), GOLD, true);
    g.fill2(arcPts(c[0], c[1], 4.8, 0, TAU, 20).map((q) => [q[0], c[1] + (q[1] - c[1]) * 1.25 + (q[0] - c[0]) * 0.5]), '#2F4F8F', true);
    const st = []; for (let i = 0; i < 12; i++) { const a = TAU * i / 12, p = [c[0] + Math.cos(a) * 3.4, c[1] + Math.sin(a) * 3.4 * 1.25 + Math.cos(a) * 3.4 * 0.5]; st.push(p[0] - 0.3, p[1], p[0] + 0.3, p[1]); } g.segs2(st, GOLD, 0.5);
    g.disc2(c, 1.6, GOLD); g.line2([c, [c[0] + 3.0, c[1] - 1.4]], { w: 0.5, c: '#E9D9A0', boil: false, ext: 0 });
    // the Madonna's niche, the winged lion on a starry blue field
    g.fill(K.on('R', -28.97, -18.4, -15.6, 12.6, 14.4), '#E2DCCF');
    g.fill(VN.archPts('R', -28.96, -17.6, -16.4, 12.7, 14.3, 'round', 0), GOLD);
    g.fill(K.on('R', -28.97, -19, -15, 14.8, 17), '#2F4F8F');
    const stars = []; for (let i = 0; i < 10; i++) { const p = g.p(-28.95, lerp(-18.8, -15.2, h1(i * 3.3)), lerp(15, 16.8, h1(i * 7.1))); stars.push(p[0] - 0.25, p[1], p[0] + 0.25, p[1]); } g.segs2(stars, GOLD, 0.4);
    const lion = g.p(-28.95, -17, 15.9); g.fill2([[lion[0] - 2.8, lion[1] + 1.4], [lion[0] + 2.4, lion[1] + 1.0], [lion[0] + 2.0, lion[1] - 1.2], [lion[0] - 0.4, lion[1] - 2.6], [lion[0] - 2.2, lion[1] - 0.6]], GOLD, true);
    // the terrace with the bell (the Moors are an actor)
    K.box(g, -36.5, -19.5, -29.5, -14.5, 17.5, 18.1, { t: '#C9C2B4', l: '#E2DCCF', r: '#CFC8BA' }, { w: 0.55 });
    const bl = g.p(-33, -17, 20.8); g.fill2(arcPts(bl[0], bl[1] + 1.4, 3.0, Math.PI, TAU, 10).concat([[bl[0] + 3.2, bl[1] + 3.4], [bl[0] - 3.2, bl[1] + 3.4]]), '#7A6A3E', true); g.disc2([bl[0], bl[1] - 1.4], 0.6, '#5E5030');
    const posts = []; for (const [x, y] of [[-36, -19], [-30, -19], [-30, -15], [-36, -15]]) { const p0 = g.p(x, y, 18.1), p1 = g.p(x, y, 21.6); posts.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(posts, '#5E5A52', 0.4);
  }, { name: 'torre dell orologio' });
  // the Procuratie Vecchie in two pieces (people walk in front of it and beside it)
  const procur = (y0, y1, nm) => T.obj([-37, y0, -29, y1], function (g) {
    g.boilP = 0.22;
    const H = 12.6;
    K.box(g, -37, y0, -29, y1, 0, H, { t: '#E9E3D6', l: '#EFEAE0', r: '#E3DDD0' }, { w: 0.85, nohid: true });
    const ar = []; for (let a = y0 + 0.2; a < y1 - 1.6; a += 2.2) ar.push(a);
    for (const a of ar) {
      g.fill(VN.archPts('R', -28.99, a + 0.35, a + 1.85, 0, 4.4, 'round', 0), '#6E5E50');
      const sp = g.P(VN.archPts('R', -28.985, a + 0.35, a + 1.85, 2.6, 4.2, 'round', 0)); g.fill2(sp, '#E9C98A', true);
      for (const zf of [5.4, 9.2]) for (const s of [0, 1]) g.fill(VN.archPts('R', -28.99, a + 0.25 + s * 1.0, a + 1.0 + s * 1.0, zf, zf + 2.8, 'round', 0), '#59636B');
    }
    for (const z of [5.0, 8.8, H - 0.5]) g.fill(K.on('R', -28.97, y0, y1, z, z + 0.35), '#DCD5C7');
    // the crest of little merlons
    const mer = []; for (let a = y0 + 0.4; a < y1; a += 1.1) { const p = g.p(-29, a, H); mer.push(p[0] - 0.6, p[1], p[0] + 0.6, p[1], p[0], p[1] - 2.2); } g.tris2(mer, '#F3EFE6');
    g.fill(K.rect(-37, y0, -29, y1, H), '#C9BFAE');
    g.line([[-29, y0, H], [-29, y1, H]], { w: 0.8 });
    if (y1 >= 36) { g.fill(K.on('L', 37, -37, -29, 0, 4.4), '#E9E3D6'); g.fill(VN.archPts('L', 37.01, -35, -31, 0, 4.2, 'round', 0), '#6E5E50'); }
  }, { name: nm });
  procur(-14, 11, 'procuratie a'); procur(11, 37, 'procuratie b');
  // Caffè Quadri's sign under the arcade
  T.obj([-29.4, 4, -29, 12], (g) => K.sign(g, 'R', -28.96, 4.6, 11.4, 4.45, 5.0, '#2E4A3A', 'GRAN CAFFÈ QUADRI', { ink: '#E9D9A0' }), { name: 'quadri sign' });

  /* ---------------- the Campanile and the Loggetta ---------------- */
  T.obj([-1, -14, 4.5, -8.5], function (g) {
    g.boilP = 0.3;
    const x0 = -1, y0 = -14, x1 = 4.5, y1 = -8.5, H = 28;
    K.box(g, x0 - 0.4, y0 - 0.4, x1 + 0.4, y1 + 0.4, 0, 1.2, { t: '#E2DCCF', l: '#ECE7DC', r: '#D9D2C4' }, { w: 0.7 });
    K.box(g, x0, y0, x1, y1, 1.2, H, { t: '#B5674C', l: '#C47454', r: '#A65E44' }, { w: 0.95 });
    const pil = []; for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) for (let i = 1; i < 5; i++) { const a = lerp(a0, a1, i / 5), q0 = g.p.apply(g, K.pt(f, p + 0.02, a, 1.4)), q1 = g.p.apply(g, K.pt(f, p + 0.02, a, H - 1.4)); pil.push(q0[0], q0[1], q1[0], q1[1]); }
    g.segs2(pil, '#9E5440', 0.55);
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) { const top = []; for (let i = 0; i < 5; i++) { const aa = lerp(a0, a1, i / 5), bb = lerp(a0, a1, (i + 1) / 5); top.push(VN.archPts(f, p + 0.02, aa + 0.1, bb - 0.1, H - 1.8, H - 0.6, 'round', 0)); } for (const q of top) g.outline(q, { w: 0.35, boil: false, c: '#8A4A36' }); }
    // the belfry: white, four arches a side
    K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, H, H + 0.6, ST, { w: 0.6 });
    K.box(g, x0, y0, x1, y1, H + 0.6, H + 5, { t: '#E9E3D6', l: '#F3EFE6', r: '#E2DCCF' }, { w: 0.75 });
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) for (let i = 0; i < 4; i++) { const aa = lerp(a0, a1, i / 4) + 0.3, bb = lerp(a0, a1, (i + 1) / 4) - 0.3; g.fill(VN.archPts(f, p + 0.02, aa, bb, H + 1.0, H + 4.4, 'round', 0), '#4A3E34'); }
    const bell = g.p((x0 + x1) / 2, (y0 + y1) / 2, H + 3.2); g.disc2(bell, 1.2, '#7A6A3E');
    K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, H + 5, H + 5.6, ST, { w: 0.6 });
    // the attic with the lion and the figure of Venice in relief
    K.box(g, x0 + 0.1, y0 + 0.1, x1 - 0.1, y1 - 0.1, H + 5.6, H + 9.4, { t: '#E9E3D6', l: '#EFEAE0', r: '#DED7C9' }, { w: 0.7 });
    for (const [f, p, m] of [['L', y1 - 0.08, (x0 + x1) / 2], ['R', x1 - 0.08, (y0 + y1) / 2]]) { const q = g.p.apply(g, K.pt(f, p, m, H + 7.4)); g.fill2([[q[0] - 2.4, q[1] + 1.4], [q[0] + 2.2, q[1] + 1.0], [q[0] + 1.6, q[1] - 1.4], [q[0] - 1.0, q[1] - 1.6]], '#C9BBA6', true); }
    // the green spire and the golden angel
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, zb = H + 9.4, zt = zb + 11;
    const base = [[x0 + 0.1, y1 - 0.1, zb], [x1 - 0.1, y1 - 0.1, zb], [x1 - 0.1, y0 + 0.1, zb]], apex = [cx, cy, zt];
    g.fill([base[0], base[1], apex], '#6F9A86'); g.fill([base[1], base[2], apex], '#5A8270');
    g.line([base[0], apex, base[2]], { w: 0.75 }); g.line([base[1], apex], { w: 0.55 }); g.line([base[0], base[1], base[2]], { w: 0.6 });
    const an = g.p(cx, cy, zt); g.fill2([[an[0] - 0.6, an[1]], [an[0] + 0.6, an[1]], [an[0] + 0.4, an[1] - 3.0], [an[0] - 0.4, an[1] - 3.0]], GOLD, true); g.fill2([[an[0], an[1] - 2.4], [an[0] + 2.6, an[1] - 3.8], [an[0] + 0.4, an[1] - 1.6]], GOLD, true); g.disc2([an[0], an[1] - 3.5], 0.6, GOLD);
  }, { name: 'campanile', tall: true });
  T.obj([-0.6, -8.5, 4.1, -6.6], function (g) {          // the Loggetta at the campanile's foot
    K.box(g, -0.6, -8.5, 4.1, -6.6, 0, 4.6, { t: '#E9DDCB', l: '#E8C9B6', r: '#D9B8A4' }, { w: 0.7 });
    for (let i = 0; i < 3; i++) { const a = -0.3 + i * 1.5; g.fill(VN.archPts('L', -6.58, a + 0.25, a + 1.2, 0.4, 3.4, 'round', 0), '#5A4A3E'); }
    g.fill(K.rect(-0.8, -8.7, 4.3, -6.4, 4.6), '#F2E8DA'); g.line([[-0.8, -6.4, 4.6], [4.3, -6.4, 4.6], [4.3, -8.7, 4.6]], { w: 0.55, boil: false });
  }, { name: 'loggetta' });

  /* ---------------- the Doge's Palace ---------------- */
  const PX0 = -2.5, PX1 = 26, PY0 = -37, PY1 = -18, PH = 15.5;
  const palace = (x0, x1, nm) => T.obj([x0, PY0, x1, PY1], function (g) {
    g.boilP = 0.2;
    const pink = '#E9B9A6', white = '#F4EDE2';
    K.box(g, x0, PY0, x1, PY1, 0, PH, { t: '#E4D6C6', l: '#F0E4D6', r: '#E2D2C0' }, { w: 0.95, nohid: true });
    const faces = [['L', PY1, x0, x1]]; if (x1 >= PX1) faces.push(['R', PX1, PY0, PY1]);
    for (const [f, p, a0, a1] of faces) {
      // the ground arcade: stout pointed arches
      for (let a = (f === 'L' ? PX0 : PY0) + 0.4; a < a1 - 1.6; a += 2.5) { if (a < a0 - 0.1) continue; g.fill(VN.archPts(f, p + 0.02, a + 0.35, a + 2.1, 0, 4.2, 'gothic', 0), '#5E4E42'); }
      g.fill(K.on(f, p + 0.03, a0, a1, 4.4, 4.9), '#E9DED0');
      // the loggia: slender pointed arches, quatrefoils above
      const qf = [];
      for (let a = (f === 'L' ? PX0 : PY0) + 0.3; a < a1 - 0.8; a += 1.25) { if (a < a0 - 0.1) continue; g.fill(VN.archPts(f, p + 0.02, a + 0.2, a + 1.05, 4.9, 7.4, 'ogee', 0), '#5E4E42'); const q = g.p.apply(g, K.pt(f, p + 0.03, a + 1.25, 8.0)); qf.push(q); }
      for (const q of qf) { g.ring2(q, 0.75, { w: 0.35, c: '#8A7A6A' }); g.disc2(q, 0.4, '#6E5E52'); }
      g.fill(K.on(f, p + 0.03, a0, a1, 8.6, 9.0), '#E9DED0');
      // the great wall: pink and white lozenges
      g.fill(K.on(f, p + 0.02, a0, a1, 9.0, PH - 0.6), pink);
      const dz = []; for (let a = a0; a < a1; a += 1.0) for (let z = 9.3; z < PH - 0.9; z += 0.9) { const c = g.p.apply(g, K.pt(f, p + 0.03, a + ((Math.round(z / 0.9)) % 2) * 0.5, z)); dz.push(c[0] - 1.1, c[1], c[0], c[1] - 1.2, c[0] + 1.1, c[1], c[0] - 1.1, c[1], c[0] + 1.1, c[1], c[0], c[1] + 1.2); }
      g.tris2(dz, white);
      // the tall pointed windows (and the great balcony window in the middle of the Molo front)
      const wn = f === 'L' ? [1.0, 5.5, 10.5, 15.5, 21] : [-34, -30.2, -24.8, -21];
      for (const a of wn) if (a > a0 + 0.5 && a < a1 - 1.5) { g.fill(VN.archPts(f, p + 0.035, a - 0.3, a + 1.9, 10.3, 13.6, 'gothic', 0.3), white); g.fill(VN.archPts(f, p + 0.04, a, a + 1.6, 10.3, 13.6, 'gothic', 0), '#4F5963'); }
      for (const a of (f === 'L' ? [3.2, 13] : [-32.2])) if (a > a0 && a < a1) g.ring2(g.p.apply(g, K.pt(f, p + 0.04, a + 0.8, 14.1)), 0.7, { w: 0.4, c: '#8A6A5A' });
      if (f === 'R') { g.fill(VN.archPts('R', PX1 + 0.05, -28.6, -25.8, 10, 14.6, 'gothic', 0.6), white); g.fill(VN.archPts('R', PX1 + 0.06, -28.4, -26, 10.4, 14.2, 'gothic', 0), '#4F5963'); K.box(g, PX1, -29.2, PX1 + 1.0, -25.2, 9.4, 9.8, ST, { w: 0.45, nohid: true }); const s = g.p(PX1 + 0.1, -27.2, 15.0); g.fill2([[s[0] - 0.7, s[1]], [s[0] + 0.7, s[1]], [s[0] + 0.5, s[1] - 2.6], [s[0] - 0.5, s[1] - 2.6]], white, true); }
      // the crenellation
      const mer = []; for (let a = a0 + 0.3; a < a1; a += 1.0) { const c = g.p.apply(g, K.pt(f, p, a, PH)); mer.push(c[0] - 0.7, c[1], c[0] + 0.7, c[1], c[0], c[1] - 2.0); } g.tris2(mer, white);
    }
    K.hip(g, x0 + 0.5, PY0 + 0.5, x1 - 0.5, PY1 - 0.5, PH, 2.4, '#9AA0A3', { ridge: Math.max(0, (x1 - x0) - (PY1 - PY0)) * 0.8, c: '#5E6468' });
  }, { name: nm });
  palace(PX0, 12, 'palazzo ducale a'); palace(12, PX1, 'palazzo ducale b');

  /* ---------------- the Molo: the two columns, the garden, the gondolas ---------------- */
  const column = (x, y, top) => T.obj([x - 1.4, y - 1.4, x + 1.4, y + 1.4], function (g) {
    for (let i = 0; i < 3; i++) K.box(g, x - 1.4 + i * 0.3, y - 1.4 + i * 0.3, x + 1.4 - i * 0.3, y + 1.4 - i * 0.3, i * 0.45, i * 0.45 + 0.45, { t: '#E2DCCF', l: '#ECE7DC', r: '#D6CFC1' }, { w: 0.5 });
    K.cyl(g, x, y, 0.75, 1.35, 13.2, { t: '#B9A9A0', l: '#C9B7AE', r: '#A8988F' }, { w: 0.7, n: 10 });
    K.box(g, x - 1.0, y - 1.0, x + 1.0, y + 1.0, 13.2, 14.2, { t: '#E2DCCF', l: '#ECE7DC', r: '#D6CFC1' }, { w: 0.55 });
    const c = g.p(x, y, 14.2);
    if (top === 'lion') { g.fill2([[c[0] - 3.2, c[1]], [c[0] + 2.8, c[1]], [c[0] + 3.2, c[1] - 2.8], [c[0] + 1.8, c[1] - 3.8], [c[0] - 2.4, c[1] - 2.6]], '#4A5248', true); g.fill2([[c[0] - 1.0, c[1] - 2.6], [c[0] - 4.6, c[1] - 7.4], [c[0] + 0.6, c[1] - 3.4]], '#5A6258', true); g.fill2([[c[0] + 0.4, c[1] - 2.8], [c[0] + 1.4, c[1] - 7.8], [c[0] + 1.8, c[1] - 3.2]], '#4A5248', true); }
    else { g.fill2([[c[0] - 2.8, c[1]], [c[0] + 2.8, c[1]], [c[0] + 2.2, c[1] - 0.9], [c[0] - 2.2, c[1] - 0.9]], '#C9C2B4', true); g.fill2([[c[0] - 0.7, c[1] - 0.6], [c[0] + 0.7, c[1] - 0.6], [c[0] + 0.5, c[1] - 4.8], [c[0] - 0.5, c[1] - 4.8]], '#F3EFE6', true); g.disc2([c[0], c[1] - 5.4], 0.7, '#F3EFE6'); g.line2([[c[0] + 0.8, c[1] - 1], [c[0] + 1.4, c[1] - 6.4]], { w: 0.35, c: '#8E877A', boil: false, ext: 0 }); }
  }, { name: 'column', tall: true });
  column(31, -11.5, 'lion'); column(31, -1.5, 'saint');
  // the Giardini Reali: hedges, a pergola, trees
  T.obj([12, 23, 12.6, 36], (g) => K.hedge(g, 12, 23, 12.6, 36, 1.2, {}), { name: 'garden hedge' });
  T.obj([12, 22.4, 25, 23], (g) => K.hedge(g, 12, 22.4, 25, 23, 1.2, {}), { name: 'garden hedge' });
  for (const [x, y, r] of [[15, 26, 3.6], [21.5, 26.5, 3.2], [16, 33, 3.4], [22.5, 32.5, 3.8]]) T.obj([x, y], (g) => K.tree(g, x, y, { r, h: 5.2, col: '#8FA86A' }), { name: 'garden tree' });
  // street lamps on the Molo
  for (const y of [-26, 8, 18]) T.obj([34.5, y], (g) => VN.lamp(g, 34.5, y, { h: 7 }), { name: 'lamp' });
  // gondolas moored off the Molo under their blue covers, each tied to a palina
  for (const [y, ph] of [[-22, 0.2], [-8, 0.7], [6.5, 0.4]]) {
    T.obj([38.8, y - 6.6, 40.4, y + 6.6], (g) => { g.at(39.6, y, VN.WL, (g2) => { VN.drawBoat(g2, 'gondola', Math.PI / 2, -99, 99, { empty: true, moored: true }); const F = VN.frame(Math.PI / 2); g2.fill([F.pt(-3.8, -0.6, 1.0), F.pt(3.4, -0.6, 1.0), F.pt(3.4, 0.6, 1.2), F.pt(-3.8, 0.6, 1.2)], '#3F5F8F'); }); void ph; }, { name: 'moored gondola' });
    T.obj([38.6, y + 7.4], (g) => VN.palina(g, 38.6, y + 7.4, { c1: '#2F4F8F', h: 6 }), { name: 'palina' });
  }
  SM.acqua(T);
  VN.finish(T);
});
