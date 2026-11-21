'use strict';
/* (0,0) Central, on the Island's harbour front (land ends at the seawall, y 24; the harbour beyond).
   What it is, back (south, the tram street) to front (the harbour):
   - The Bank of China Tower: a square plan cut by its diagonals into four triangular shafts of glass that stop at
     four heights, each ending in a sloped glass facet, the whole braced by white diagonals into great X's; two masts.
   - The HSBC building: steel masts in pairs on the façade, the floors hung from coat-hanger trusses at four levels,
     a stepped top, an open plaza underneath with two escalator tubes, and the two bronze lions at the front.
   - Jardine House: aluminium with its grid of round porthole windows.
   - Statue Square: granite paving, two long pools with fountains, and on this December Sunday the domestic helpers
     out in their hundreds on flattened cardboard: sharing food, playing cards, doing each other's hair, napping,
     on video calls home. The old Supreme Court (Legislative Council) on the east side: granite, a colonnade, a dome,
     Justice blindfolded on the pediment. The Mandarin Oriental on the west.
   - The harbour front: City Hall, the Star Ferry's Central pier (cream hall, green roof, a clock tower, 天星小輪 and
     中環) with two finger piers out into the water, the Observation Wheel turning, a promenade with a railing.
   The clever moment (shot `ferry`): MORNING STAR comes alongside finger 1 as NIGHT STAR casts off at Tsim Sha Tsui;
   the gangway drops, eight commuters come off and walk the finger into the hall, eight who queued file on. */
SF.tile('central', 0, 0, { rim: 18 }, function (T) {
  const H = 37, I = HT.HAR.I;
  const GLASS = '#93ADC0', WHITE = '#F6F4EE';
  const CARDS = [[-8, -17, 3.4, 2.0], [7, -16.6, 3.0, 2.2], [-6, -2.6, 3.6, 2.4], [8, -1.6, 3.2, 2.2], [0, 4.4, 3.4, 1.8], [-2, -16.4, 1.8, 1.6]];
  T.ground(function (g) {
    HK.ground(g, -H, -H, H, I, HK.C.pave);
    HK.paving(g, -H, -H, H, I, { step: 2.4 });
    // Statue Square: big granite slabs; the two long pools
    g.fill(K.rect(-14, -20, 20, 7), '#EAE4D5'); HK.paving(g, -14, -20, 20, 7, { step: 3.4, joint: '#D9D0BC' });
    for (const [x0, x1] of [[-11, -1], [5, 15]]) { g.fill(K.rect(x0, -13, x1, -8), '#B8CCD0'); g.fill(K.rect(x0 + 0.4, -12.6, x1 - 0.4, -8.4), '#9DBDC3'); g.water(K.rect(x0 + 0.4, -12.6, x1 - 0.4, -8.4), { dens: 0.9, c: '#E9F3F3' }); g.outline(K.rect(x0, -13, x1, -8), { w: 0.5, c: '#8E9AA0', boil: false }); }
    // the harbour promenade: a timber strip along the seawall
    g.fill(K.rect(-H, 19, H, I), '#D9C7A6'); const pl = []; for (let x = -H; x < H; x += 1.2) { const a = g.p(x, 19, 0), b = g.p(x, I, 0); pl.push(a[0], a[1], b[0], b[1]); } g.segs2(pl, '#C4AF8A', 0.25);
    // cardboard for the helpers' Sunday: flattened boxes
    for (const [x, y, w, d] of CARDS) { const q = K.rect(x - w, y - d, x + w, y + d, 0.03); g.fill(q, '#C9A26B'); g.outline(q, { w: 0.35, c: '#8A6A44', boil: false }); g.line([[x - w, y, 0.04], [x + w, y, 0.04]], { w: 0.25, c: '#A88654', boil: false }); }
  }, { rim: true });

  /* ---- the Bank of China Tower ---- */
  T.obj([-35, -36, -21, -22], function (g) {
    g.boilP = 0.2;
    const A = [-34, -35], B = [-22, -35], Cn = [-22, -23], D = [-34, -23], O = [-28, -29];
    const brace = (vis, z0, z1) => { const s = []; for (const f of vis) { const a = f.a, b = f.b, n = Math.max(1, Math.round((z1 - z0) / (Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.9))), h = (z1 - z0) / n; for (let k = 0; k < n; k++) { const za = z0 + k * h, zb = za + h; for (const [p, q] of [[[a[0], a[1], za], [b[0], b[1], zb]], [[b[0], b[1], za], [a[0], a[1], zb]], [[a[0], a[1], zb], [b[0], b[1], zb]]]) { const P = g.p.apply(g, p), Q = g.p.apply(g, q); s.push(P[0], P[1], Q[0], Q[1]); } } const v0 = g.p(a[0], a[1], z0), v1 = g.p(a[0], a[1], z1), w0 = g.p(b[0], b[1], z0), w1 = g.p(b[0], b[1], z1); s.push(v0[0], v0[1], v1[0], v1[1], w0[0], w0[1], w1[0], w1[1]); } g.segs2(s, WHITE, 0.55); };
    const lit = (vis, z0, z1, seed) => { const R = RNG(seed); for (const f of vis) for (let z = z0 + 1.6; z < z1 - 1; z += 2.2) if (R() < 0.3) { const u0 = R() * 0.5, u1 = u0 + 0.2 + R() * 0.3; g.fill([[lerp(f.a[0], f.b[0], u0), lerp(f.a[1], f.b[1], u0), z], [lerp(f.a[0], f.b[0], u1), lerp(f.a[1], f.b[1], u1), z], [lerp(f.a[0], f.b[0], u1), lerp(f.a[1], f.b[1], u1), z + 1.2], [lerp(f.a[0], f.b[0], u0), lerp(f.a[1], f.b[1], u0), z + 1.2]], f.nx > f.ny ? HK.C.litD : HK.C.lit); } };
    // the podium of grey granite
    K.box(g, -35, -36, -21, -22, 0, 3.2, { t: '#CFC9BC', l: '#D9D4C8', r: '#BFB9AC' }, { w: 0.8 });
    let v = HK.prism(g, [A, B, Cn, D], 3.2, 20, GLASS, { nt: true }); lit(v, 3.2, 20, 11); brace(v, 3.2, 20);
    // shaft tops step back: the near quadrant ends at 20 in a sloped facet; the rest goes on
    g.fill([[D[0], D[1], 20], [Cn[0], Cn[1], 20], [O[0], O[1], 30]], '#C9DCE6'); g.outline([[D[0], D[1], 20], [Cn[0], Cn[1], 20], [O[0], O[1], 30]], { w: 0.6 });
    v = HK.prism(g, [A, O, D], 20, 32, GLASS, { nt: true }); lit(v, 20, 32, 12); brace(v, 20, 32);
    v = HK.prism(g, [A, B, Cn], 20, 32, GLASS, { nt: true }); lit(v, 20, 32, 13); brace(v, 20, 32);
    g.fill([[B[0], B[1], 32], [Cn[0], Cn[1], 32], [O[0], O[1], 42]], '#BCD2DE'); g.outline([[B[0], B[1], 32], [Cn[0], Cn[1], 32], [O[0], O[1], 42]], { w: 0.6 });
    g.fill([[A[0], A[1], 32], [O[0], O[1], 32], [D[0], D[1], 32]], '#BCD2DE');
    v = HK.prism(g, [A, B, O], 32, 44, GLASS, { nt: true }); lit(v, 32, 44, 14); brace(v, 32, 44);
    g.fill([[A[0], A[1], 32], [D[0], D[1], 32], [O[0], O[1], 44]], '#C9DCE6'); g.outline([[A[0], A[1], 32], [D[0], D[1], 32], [O[0], O[1], 44]], { w: 0.6 });
    // the top shaft ends in its own slope up to the far corner; two masts
    g.fill([[O[0], O[1], 44], [B[0], B[1], 44], [A[0], A[1], 52]], '#C9DCE6'); g.outline([[O[0], O[1], 44], [B[0], B[1], 44], [A[0], A[1], 52]], { w: 0.65 });
    for (const [x, y, h] of [[-31.6, -33.2, 62], [-29.4, -34.0, 59]]) g.line([[x, y, 48], [x, y, h]], { w: 0.55, c: '#5A6066', boil: false, ext: 0 });
    K.sign(g, 'L', -22, -33.6, -23.6, 1.0, 2.4, '#2E3A4A', 'BANK OF CHINA', { ink: '#F3D9A2', w: 0.3 });
  }, { name: 'bank of china tower' });

  /* ---- the HSBC building: masts, coat-hanger trusses, an open plaza under it ---- */
  T.obj([-17, -36, 5, -22], function (g) {
    g.boilP = 0.2;
    const STEEL = { t: '#B9BEC2', l: '#A9B0B5', r: '#949CA2' }, GL = { t: '#9AA4AA', l: '#7E8A93', r: '#6E7A83' };
    const y0 = -35, y1 = -23, Z0 = 5.4;
    // the plaza underneath: dark soffit band at the back, the escalator tubes rising into the banking hall
    g.fill(K.on('L', y0 + 0.3, -16, 4, 0, Z0), '#5E666C');
    for (const x of [-9, -2]) { const q = [[x - 0.9, y1 - 1.5, 0], [x + 0.9, y1 - 1.5, 0], [x + 0.9, y1 - 7, Z0], [x - 0.9, y1 - 7, Z0]]; g.fill(q, '#C9D3D8'); g.outline(q, { w: 0.4, boil: false }); }
    const slabs = [[-16, -9, 30], [-9, -2, 40], [-2, 4, 35]];
    for (const [a, b, h] of slabs) {
      K.box(g, a, y0, b, y1, Z0, h, GL, { w: 0.8 });
      // floors, lit floors
      const s = [], R = RNG(a * 7 + 3);
      for (let z = Z0 + 2; z < h; z += 2) { if (R() < 0.3) g.fill(K.on('L', y1 + 0.02, a + 0.4, b - 0.4, z + 0.3, z + 1.5), HK.C.lit); const p0 = g.p(a, y1 + 0.03, z), p1 = g.p(b, y1 + 0.03, z); s.push(p0[0], p0[1], p1[0], p1[1]); }
      if (b === 4) for (let z = Z0 + 2; z < h; z += 2) { const p0 = g.p(4.03, y0, z), p1 = g.p(4.03, y1, z); s.push(p0[0], p0[1], p1[0], p1[1]); }
      g.segs2(s, '#5E6A72', 0.28);
    }
    // the masts: pairs of steel tubes from the ground to the top on the front, and the trusses hung between them
    const masts = [-15.4, -9, -2, 3.4];
    for (const x of masts) for (const dx of [-0.45, 0.45]) { const top = x < -9 ? 30 : x < 0 ? 40 : 35; K.box(g, x + dx - 0.3, y1 + 0.1, x + dx + 0.3, y1 + 0.7, 0, top + 1, STEEL, { w: 0.4, boil: false }); }
    for (const zt of [12, 20, 28, 36]) for (let i = 0; i < masts.length - 1; i++) {
      const xa = masts[i] + 0.8, xb = masts[i + 1] - 0.8, top = Math.min(xa < -9 ? 30 : xa < 0 ? 40 : 35, xb < -9 ? 30 : xb < 0 ? 40 : 35); if (zt > top - 1) continue;
      const m = (xa + xb) / 2, yy = y1 + 0.75;
      g.fill([[xa, yy, zt - 0.6], [xb, yy, zt - 0.6], [xb, yy, zt + 0.6], [xa, yy, zt + 0.6]], '#B9BEC2');
      g.line([[xa, yy, zt + 0.6], [m, yy, zt - 2.6], [xb, yy, zt + 0.6]], { w: 0.6, c: '#8E979E', boil: false, ext: 0 });
      g.outline([[xa, yy, zt - 0.6], [xb, yy, zt - 0.6], [xb, yy, zt + 0.6], [xa, yy, zt + 0.6]], { w: 0.4, boil: false });
    }
    // the R side: masts too
    for (const y of [-34, -24]) K.box(g, 4.1, y - 0.3, 4.7, y + 0.3, 0, 36, STEEL, { w: 0.4, boil: false });
    K.text(g, 'L', y1 + 0.8, -6.5, Z0 + 0.6, 0.9, 'HSBC', '#C8372D', { center: true });
  }, { name: 'hsbc' });
  // the two bronze lions at the plaza's front, on granite plinths
  for (const [x, f] of [[-11, 1], [-0.4, -1]]) T.obj([x, -20.6], (g) => {
    K.box(g, x - 1.1, -21.6, x + 1.1, -19.6, 0, 1.4, { t: '#D9D4C8', l: '#CFC9BC', r: '#B9B3A6' }, { w: 0.5 });
    const c = g.p(x, -20.6, 1.4), s = f;
    g.fill2([[c[0] - 2.4 * s, c[1]], [c[0] + 1.6 * s, c[1]], [c[0] + 2.0 * s, c[1] - 2.6], [c[0] + 0.6 * s, c[1] - 4.6], [c[0] - 1.0 * s, c[1] - 4.0], [c[0] - 2.2 * s, c[1] - 1.6]], '#6E5A3A', true);
    g.disc2([c[0] + 1.0 * s, c[1] - 4.0], 1.5, '#7E6A44'); g.disc2([c[0] + 1.6 * s, c[1] - 3.8], 0.25, '#2A2420');
    g.outline2([[c[0] - 2.4 * s, c[1]], [c[0] + 1.6 * s, c[1]], [c[0] + 2.0 * s, c[1] - 2.6], [c[0] + 0.6 * s, c[1] - 4.6], [c[0] - 1.0 * s, c[1] - 4.0], [c[0] - 2.2 * s, c[1] - 1.6]], { w: 0.35, c: '#3A2A1E', boil: false });
  }, { name: 'lion' });

  /* ---- Jardine House: round windows ---- */
  T.obj([9, -36, 25, -22], (g) => {
    g.boilP = 0.2;
    K.box(g, 10, -35, 24, -23, 0, 31, { t: '#E3E5E6', l: '#D9DCDD', r: '#C3C7C9' }, { w: 0.85 });
    const dots = [], lit = [];
    for (const [f, p, a0, a1] of [['L', -23, 10, 24], ['R', 24, -35, -23]]) for (let z = 3; z < 30.4; z += 1.75) for (let a = a0 + 0.9; a < a1 - 0.5; a += 1.35) { const q = g.p.apply(g, K.pt(f, p + 0.03, a, z)); ((Math.round(z * 3 + a * 7) % 11) === 0 ? lit : dots).push(q[0], q[1], q[0] + 0.01, q[1]); }
    g.segs2(dots, '#4E5E6A', 0.95); g.segs2(lit, HK.C.litD, 1.0);
    K.box(g, 15, -31, 20, -27, 31, 33, { t: '#E9E6DE', l: '#DCD8CE', r: '#C9C4B8' }, { w: 0.5, boil: false });
  }, { name: 'jardine house' });

  /* ---- the old Supreme Court (LegCo): granite, colonnade, dome, Justice ---- */
  T.obj([-35, -16, -17, 3], (g) => {
    g.boilP = 0.3;
    const G0 = { t: '#DDD8CC', l: '#E6E1D5', r: '#CFC9BC' };
    K.box(g, -34, -15, -18, 2, 0, 9.4, G0, { w: 0.85 });
    // the colonnade round the ground floor: a dark loggia behind Ionic columns
    for (const [f, p, a0, a1] of [['L', 2, -34, -18], ['R', -18, -15, 2]]) {
      g.fill(K.on(f, p + 0.02, a0 + 0.5, a1 - 0.5, 0.6, 4.4), '#8E8A80');
      for (let a = a0 + 0.8; a <= a1 - 0.6; a += 1.6) K.win(g, f, p + 0.03, a, a + 0.5, 0.6, 4.4, { style: 'dark', col: '#E9E4D8', w: 0.3 });
      for (let a = a0 + 1.3; a < a1 - 1; a += 2.4) K.win(g, f, p + 0.02, a, a + 1.0, 5.6, 8.2, { style: 'navy', w: 0.3 });
    }
    g.fill(K.on('L', 2.03, -34, -18, 4.4, 5.0), '#D2CCBF'); g.fill(K.on('R', -17.97, -15, 2, 4.4, 5.0), '#C2BCAF');
    // the pediment over the centre of the square front, Justice standing on it
    const pm = [[-29.6, 2.1, 9.4], [-22.4, 2.1, 9.4], [-26, 2.1, 12.2]]; g.fill(pm, '#E9E4D8'); g.outline(pm, { w: 0.6 });
    const st = g.p(-26, 2.1, 12.2); g.fill2([[st[0] - 0.6, st[1]], [st[0] + 0.6, st[1]], [st[0] + 0.4, st[1] - 4.2], [st[0] - 0.4, st[1] - 4.2]], '#E9E4D8', true); g.disc2([st[0], st[1] - 4.8], 0.6, '#E9E4D8'); g.segs2([st[0] - 1.6, st[1] - 3.6, st[0] + 1.6, st[1] - 3.8, st[0] - 1.6, st[1] - 3.6, st[0] - 1.6, st[1] - 2.4, st[0] + 1.6, st[1] - 3.8, st[0] + 1.6, st[1] - 2.6], '#BFB9AC', 0.3);
    // the dome on a drum
    K.cyl(g, -26, -6.5, 3.2, 9.4, 11.6, { t: '#DDD8CC', l: '#E6E1D5', r: '#CFC9BC' }, { n: 16, w: 0.6 });
    K.dome(g, -26, -6.5, 3.2, 11.6, 3.6, '#B9C3BE', { w: 0.6 });
    K.cyl(g, -26, -6.5, 0.6, 15.2, 16.4, { t: '#DDD8CC', l: '#E6E1D5', r: '#CFC9BC' }, { n: 8, w: 0.4 });
  }, { name: 'legislative council' });

  /* ---- the Mandarin Oriental ---- */
  T.obj([23, -20, 36, 0], (g) => {
    HK.tower(g, 24, -19, 35, -1, 0, 23, { col: '#D9D3C4', tone: { t: '#CFC8B6', l: '#E3DDCE', r: '#C9C2B1' }, fl: 2.0, ml: 1.6, lit: 0.4, grid: '#8E877A', seed: 21 });
    K.box(g, 24, -19, 35, -1, 23, 24, { t: '#CFC8B6', l: '#E3DDCE', r: '#C9C2B1' }, { w: 0.6 });
    K.sign(g, 'L', -1, 25.5, 33.5, 1.6, 2.6, '#2C2622', 'MANDARIN ORIENTAL', { ink: '#E6C24F', w: 0.3 });
  }, { name: 'mandarin oriental' });

  /* ---- City Hall: a long low modernist block on the harbour front ---- */
  T.obj([-35, 9, -15, 22], (g) => {
    K.box(g, -34, 10, -16, 21, 0, 6.2, { t: '#E9E6DE', l: '#F1EFE8', r: '#DCD8CE' }, { w: 0.8 });
    for (const [f, p, a0, a1] of [['L', 21, -34, -16], ['R', -16, 10, 21]]) { g.fill(K.on(f, p + 0.02, a0 + 0.5, a1 - 0.5, 2.4, 5.4), '#93AEBD'); const s = []; for (let a = a0 + 1.6; a < a1; a += 1.6) { const q0 = g.p.apply(g, K.pt(f, p + 0.03, a, 2.4)), q1 = g.p.apply(g, K.pt(f, p + 0.03, a, 5.4)); s.push(q0[0], q0[1], q1[0], q1[1]); } g.segs2(s, '#F1EFE8', 0.45); }
    K.sign(g, 'L', 21, -31, -23, 0.7, 1.7, '#2C2622', 'CITY HALL', { ink: '#F3F1EA', w: 0.3 });
  }, { name: 'city hall' });

  /* ---- the Star Ferry pier: the hall with its clock tower, two fingers out into the harbour ---- */
  T.obj([-8, 13, 19, I], (g) => {
    g.boilP = 0.3;
    const CR = { t: '#EFE6CF', l: '#F3ECD8', r: '#DDD3BA' };
    K.box(g, -8, 14, 18, I, 0, 7.2, CR, { w: 0.85 });
    // doors to the fingers, arched windows
    for (const xc of [0, 12]) { const q = [[xc - 2.2, I + 0.02, 0], [xc + 2.2, I + 0.02, 0]]; for (let k = 0; k <= 8; k++) { const t = Math.PI * k / 8; q.push([xc + 2.2 * Math.cos(t), I + 0.02, 3.4 + 1.2 * Math.sin(t)]); } g.fill(q, '#5A4E42'); g.outline(q, { w: 0.5, boil: false }); }
    for (const x of [-6, -3.2, 3.2, 6, 8.8, 15.2]) K.win(g, 'L', I + 0.01, x, x + 1.4, 1.4, 4.2, { style: 'navy', arch: true, w: 0.3 });
    K.hip(g, -8.6, 13.4, 18.6, I + 0.6, 7.2, 3.2, '#4E8A62', { w: 0.7 });
    HK.board(g, 'L', I + 0.6, -6.6, 5.0, 5.0, 6.8, '#2E6B4E', '天星小輪', { rim: '#F3ECD8', en: 'STAR FERRY' });
    HK.board(g, 'L', I + 0.6, 7.4, 13.4, 4.3, 7.0, '#F3ECD8', '中環', { c: '#2E6B4E', en: 'CENTRAL' });
    // the clock tower
    K.box(g, 14.6, 15.2, 17.8, 18.4, 7.2, 16.6, CR, { w: 0.75 });
    for (const [f, p, a] of [['L', 18.4, 16.2], ['R', 17.8, 16.8]]) { const c = g.p.apply(g, K.pt(f, p + 0.03, a, 14.4)); g.disc2(c, 2.6, '#FBF8EE'); g.ring2(c, 2.6, { w: 0.4, c: '#3A3530' }); g.segs2([c[0], c[1], c[0] + 0.3, c[1] - 1.9, c[0], c[1], c[0] + 1.3, c[1] + 0.5], '#2A2622', 0.35); }
    K.hip(g, 14.3, 14.9, 18.1, 18.7, 16.6, 2.4, '#4E8A62', { w: 0.6 });
  }, { name: 'star ferry pier' });
  // the fingers: decks on piles (people walk on them: under 0), the near rails as their own objects
  for (const [x0, x1] of [[-3, 3], [9, 15]]) {
    T.obj([x0, I, x1, 41], (g) => {
      const Z = HT.HAR.WL;
      const s = []; for (let y = I + 3; y < 41; y += 4) for (const x of [x0 + 0.4, x1 - 0.4]) { const a = g.p(x, y, 0), b = g.p(x, y, Z); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#6E675C', 0.6);
      K.box(g, x0, I, x1, 41, -0.5, 0, { t: '#D9D0BA', l: '#B9B0A0', r: '#A69D8C' }, { w: 0.6 });
      HK.paving(g, x0, I, x1, 41, { step: 1.5, joint: '#C9BFA8' });
      // the far rail with a gap at the gangway, the shelter at the end, bollards
      HK.rail(g, [x0 + 0.15, I + 0.5], [x0 + 0.15, HT.FERRY.yC - 1.6], { h: 1.6 }); HK.rail(g, [x0 + 0.15, HT.FERRY.yC + 1.6], [x0 + 0.15, 40.8], { h: 1.6 });
      HK.rail(g, [x0 + 0.2, 40.85], [x1 - 0.2, 40.85], { h: 1.6 });
      for (const y of [30, 39]) HK.lamp(g, x1 - 0.5, y, { h: 6.4, arm: -1.2 });
    }, { name: 'ferry finger', under: 0 });
    T.obj([x1 - 0.3, I + 0.3, x1, 40.8], (g) => HK.rail(g, [x1 - 0.15, I + 0.5], [x1 - 0.15, 40.6], { h: 1.6 }), { name: 'finger rail' });
  }
  HK.ferryCrowd(T, { f: 'A', at: 'C', fx: -3, gy: HT.FERRY.yC, dy: I, seed: 61 });
  HK.ferryCrowd(T, { f: 'B', at: 'C', fx: 9, gy: HT.FERRY.yC, dy: I, seed: 62 });

  /* ---- the Observation Wheel: an A-frame, a white rim with spokes, 18 gondolas, turning slowly ---- */
  const WX = 28.5, WY = 13.5, WR = 10.2, WZ = 12.4;
  T.obj([WX - 6, WY - 2.4, WX + 6, WY + 2.4], (g) => {
    K.box(g, WX - 4, WY - 2, WX + 4, WY + 2, 0, 1.4, { t: '#D9D4C8', l: '#E6E1D5', r: '#CFC9BC' }, { w: 0.6 });
    const s = []; for (const dy of [-1.6, 1.6]) for (const dx of [-5, 5]) { const a = g.p(WX + dx, WY + dy, 0), b = g.p(WX, WY + dy, WZ); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#E9E6DE', 1.0); g.segs2(s, '#8E8A80', 0.3);
    K.sign(g, 'L', WY + 2, WX - 3.6, WX + 3.6, 0.3, 1.1, '#2F4F6E', 'OBSERVATION WHEEL', { w: 0.25 });
  }, { name: 'wheel base' });
  T.actor({ sample: 1, period: 120, grow: false, bias: 2.5,
    at(t) { const ph = Math.floor(((t / 120) % 1) * 18 * 8) % 8; return { x: WX, y: WY + 2.4, z: 0, key: 'w' + ph, ph }; },
    draw(g, st) {
      const P = (a, r) => [Math.cos(a) * r, -2.4, WZ + Math.sin(a) * r], th0 = (st.ph / 8) * (TAU / 18), rim = [], spk = [];
      for (let i = 0; i <= 48; i++) rim.push(P(TAU * i / 48, WR));
      g.line(rim, { w: 1.3, c: '#5A564E', boil: false, ext: 0 }); g.line(rim, { w: 0.8, c: '#F3F1EA', boil: false, ext: 0 });
      for (let i = 0; i < 18; i++) { const a = th0 + TAU * i / 18, p = g.p.apply(g, P(a, WR)), c = g.p.apply(g, P(a, 0)); spk.push(c[0], c[1], p[0], p[1]); }
      g.segs2(spk, '#8E8A80', 0.3);
      const hub = g.p.apply(g, P(0, 0)); g.disc2(hub, 1.2, '#E9E6DE'); g.ring2(hub, 1.2, { w: 0.3, c: '#5A564E' });
      for (let i = 0; i < 18; i++) { const a = th0 + TAU * i / 18, p = g.p.apply(g, P(a, WR)); const q = [[p[0] - 1.3, p[1] + 0.4], [p[0] + 1.3, p[1] + 0.4], [p[0] + 1.1, p[1] + 2.9], [p[0] - 1.1, p[1] + 2.9]]; g.fill2(q, '#F3F1EA', true); g.fill2([[p[0] - 1.0, p[1] + 0.9], [p[0] + 1.0, p[1] + 0.9], [p[0] + 0.9, p[1] + 2.0], [p[0] - 0.9, p[1] + 2.0]], i % 5 === 0 ? HK.C.lit : '#7E9AAD', true); g.outline2(q, { w: 0.25, c: '#5A564E', boil: false }); }
    } });

  /* ---- trees, lamps, the seawall railing ---- */
  for (const [x, y] of [[-15.6, -19], [-15.6, 5], [19.4, -19], [19.4, 5], [-36, 7]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.6, h: 4.6, col: '#6FA06A' }), { name: 'tree' });
  for (const [x, y] of [[-12, 17], [6, 9.6], [-24, 8], [21, 18]]) T.obj([x, y], (g) => HK.lamp(g, x, y, { h: 8, arm: 1.8 }), { name: 'lamp' });
  for (const [a, b] of [[-36.6, -3.6], [3.6, 8.4], [15.6, 36.6]]) T.obj([a, I - 0.5, b, I - 0.1], (g) => HK.rail(g, [a, I - 0.3], [b, I - 0.3], { h: 1.7 }), { name: 'seawall rail' });
  // fountains in the pools (jets rising and falling)
  for (const [x0, x1] of [[-11, -1], [5, 15]]) for (let k = 0; k < 4; k++) { const x = x0 + 1.4 + k * (x1 - x0 - 2.8) / 3; T.actor({ sample: 0.5, period: 2, grow: false,
    at(t) { const f = Math.floor(t * 6 + k * 2) % 6; return { x, y: -10.5, z: 0, key: 'j' + f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), h = 4.4 + [0, 0.5, 0.8, 0.5, 0, -0.3][st.f]; g.line2([o, [o[0], o[1] - h * 3.46]], { w: 0.7, c: 'rgba(240,248,250,0.9)', boil: false, ext: 0 }); for (const s of [-1, 1]) g.line2([[o[0], o[1] - h * 3.46], [o[0] + s * 1.6, o[1] - h * 3.0], [o[0] + s * 2.2, o[1] - 1]], { w: 0.4, c: 'rgba(240,248,250,0.8)', boil: false, ext: 0 }); } }); }

  /* ---- the helpers' Sunday: groups on cardboard ---- */
  const group = (cx, cy, seats, seed, extra) => T.cast([cx, cy], (g) => {
    const ord = seats.map((s, i) => ({ s, i })).sort((a, b) => (a.s[0] + a.s[1]) - (b.s[0] + b.s[1]));
    const draws = ord.map(({ s, i }) => () => { const [dx, dy, dir, pose] = s; HK.person(g, cx + dx, cy + dy, 0.4, HK.helper(seed + i, Object.assign({ dir, cross: true }, pose || {}))); });
    // what is on the cardboard: food boxes, a thermos, playing cards
    const mid = () => { const q = g.p(cx, cy, 0.05); g.fill2([[q[0] - 2.2, q[1] - 0.6], [q[0] - 0.4, q[1] - 0.6], [q[0] - 0.4, q[1] + 0.6], [q[0] - 2.2, q[1] + 0.6]], '#F3F1EA', true); g.disc2([q[0] + 1.0, q[1]], 0.9, '#E8813A'); g.fill2([[q[0] + 2.2, q[1] - 2.6], [q[0] + 2.9, q[1] - 2.6], [q[0] + 2.9, q[1]], [q[0] + 2.2, q[1]]], '#C8372D', true); if (extra) extra(g, q); };
    let done = false; draws.forEach((d, k) => { if (!done && ord[k].s[0] + ord[k].s[1] >= 0) { mid(); done = true; } d(); }); if (!done) mid();
  }, { name: 'helpers' });
  const cards = (g, q) => { for (let i = 0; i < 4; i++) g.fill2([[q[0] - 1 + i * 0.7, q[1] + 1.2], [q[0] - 0.5 + i * 0.7, q[1] + 1.2], [q[0] - 0.5 + i * 0.7, q[1] + 1.9], [q[0] - 1 + i * 0.7, q[1] + 1.9]], i % 2 ? '#F6F3EA' : '#E9E2D2', true); };
  group(-8, -17, [[-2.6, -1.4, 0], [2.6, -1.0, 2], [-1.6, 1.4, 3, { pose: 'hold', phone: true }], [1.6, 1.6, 3]], 5100, cards);
  group(7, -16.6, [[-2.2, -1.6, 0], [2.2, -0.8, 2, { phone: true, pose: 'hold' }], [0, 1.8, 3]], 5110);
  group(-6, -2.6, [[-2.8, -1.4, 0], [2.6, -1.6, 2], [-1.4, 1.8, 3], [1.6, 1.8, 3, { pose: 'hold', reach: [-3, -12] }]], 5120, cards);
  group(8, -1.6, [[-2.4, -1.2, 0, { pose: 'hold', phone: true }], [2.4, -1.0, 2], [0.2, 1.8, 3]], 5130);
  group(0, 4.4, [[-2.6, -0.8, 0], [2.6, -0.6, 2], [0, -1.6, 1, { pose: 'hold', reach: [3, -8] }]], 5140);
  // one doing another's hair, a napper, a pair dancing to a phone, one on a video call
  T.cast([-2, -16.4], (g) => { HK.person(g, -2.6, -16.6, 0.4, HK.helper(5150, { dir: 0, cross: true })); HK.person(g, -1.2, -16.2, 0, HK.helper(5151, { dir: 0, pose: 'hold', reach: [-3, -15] })); }, { name: 'hairdo' });
  T.cast([12.6, 2.6], (g) => HK.person(g, 12.6, 2.6, 0.05, HK.helper(5152, { lie: -0.3 })), { name: 'napper' });
  T.actor({ sample: 0.3, period: 2,
    at(t) { const f = Math.floor(t * 4) % 4; return { x: 3.2, y: -6.4, key: 'd' + f, f }; },
    draw(g, st) { HK.person(g, -1.0, 0, 0, HK.helper(5153, { dir: 0, pose: st.f % 2 ? 'cheer' : 'wave', ph: st.f * 0.25 })); HK.person(g, 1.2, 0.4, 0, HK.helper(5154, { dir: 1, pose: st.f % 2 ? 'wave' : 'cheer', ph: st.f * 0.25 + 0.5 })); } });
  HK.stand(T, -14.6, -6, HK.helper(5155, { dir: 1, pose: 'hold', phone: true }), { name: 'video call' });

  /* ---- walkers: bankers crossing, tourists at LegCo, a jogger and a couple on the promenade ---- */
  HK.walker(T, HK.who(5201, { top: '#2F343B', jacket: '#F3F1EA', bag: '#3A3530' }), [[-15, -21], [22, -21]], 1.2, { phase: 0.1 });
  HK.walker(T, HK.who(5202, { top: '#26314F', jacket: '#CFE0EA' }), [[21, 8], [21, -21], [-15, -21]], 1.1, { phase: 0.5 });
  HK.walker(T, HK.who(5203, { phone: true }), [[-16, 8.4], [21, 8.4]], 1.0, { phase: 0.3 });
  HK.walker(T, HK.who(5204, { top: '#C8372D', shorts: true, bare: true, jacket: undefined, scarf: undefined, cap: '#3B3F47' }), [[-36, 21], [36, 21]], 2.4, { phase: 0.2 });
  HK.walker(T, HK.who(5205, { scarf: '#E6C24F' }), [[-36, 17.6], [-10, 17.6], [-10, 9]], 0.9, { phase: 0.7 });
  HK.stand(T, -17, 5.6, HK.who(5206, { dir: 3, pose: 'hold', phone: true, cap: '#F0EDE4' }), { name: 'tourist' });
  HK.stand(T, -15.6, 6.4, HK.who(5207, { dir: 3, pose: 'wave', ph: 0.2 }), { name: 'tourist' });
  T.cast([-6, 22.6], (g) => { HK.person(g, -6.6, 22.6, 0, HK.who(5208, { dir: 1, scarf: '#C8372D' })); HK.person(g, -5.2, 22.7, 0, HK.who(5209, { dir: 1, hairStyle: 'long' })); }, { name: 'couple' });
  HK.stand(T, 20.6, 22.4, HK.who(5210, { dir: 1, pose: 'hold', phone: true }), { name: 'photographer' });
});
