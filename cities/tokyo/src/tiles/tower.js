'use strict';
/* (-100,-100) Tokyo Tower in Shiba Park, the far corner of the map, and the tallest thing in the city. A 333 m steel
   lattice on four legs that splay out to a broad square base and curve in as they rise; painted, as the aviation law
   asks, in seven equal bands of international orange and white, orange at the foot and at the tip. The two-storey Main
   Deck sits at 150 m, the small Top Deck at 250 m, the antenna mast above (heights to scale: 333 m = 100 u). FootTown,
   four storeys, stands between the legs. In front: Zōjō-ji's great vermilion Sangedatsumon (1622) with its dark tiled
   roofs, the rows of little jizō in red knitted caps with their pinwheels, cherries, Momijidani's maples, lamps, a
   taiyaki stand. Visitors photograph the tower, a school trip follows its teacher's flag, families picnic under the
   blossom, children run, pigeons peck and flutter up. */
SF.tile('tower', -100, -100, { rim: 0 }, function (T) {
  const H = 37, TX = -6, TY = -6, TOP = 100, BAND = TOP / 7;
  const D0 = 39.5, DM = 42.9, D1 = 46.2, U0 = 73.2, U1 = 76.8, MAST = 90;        // decks (Main 133-154 m, Top 244-256 m)
  // paint: international orange and white, each with a lit side, a shaded side and its own ink
  const OR = { l: '#F0855E', r: '#D86F50', ink: '#8E3E2A', fine: '#E27A56', back: '#F3B69E', backF: '#EBA58C' };
  const WH = { l: '#F8F6F0', r: '#E2DDD3', ink: '#8A8378', fine: '#EDE9E1', back: '#F1EEE7', backF: '#E3DFD6' };
  const paint = (z) => Math.floor(Math.min(z, TOP - 0.01) / BAND) % 2 ? WH : OR;
  const LAWN = '#C9DBA5', PAVE = '#E9E4D7', PATH = '#EDE6D3';

  T.ground(function (g) {
    K.slab(g, H, { top: LAWN });
    g.grass(K.rect(-H, -H, H, H), { dens: 0.55 });
    // the tower's plaza: granite flags in a grid round the legs
    const P0 = [TX - 18, TY - 18, TX + 18, TY + 18];
    g.fill(K.rect(P0[0], P0[1], P0[2], P0[3]), PAVE);
    const gr = []; for (let a = P0[0] + 3; a < P0[2]; a += 3) { const p = g.p(a, P0[1], 0), q = g.p(a, P0[3], 0); gr.push(p[0], p[1], q[0], q[1]); }
    for (let b = P0[1] + 3; b < P0[3]; b += 3) { const p = g.p(P0[0], b, 0), q = g.p(P0[2], b, 0); gr.push(p[0], p[1], q[0], q[1]); }
    g.segs2(gr, '#D6CFBE', 0.3);
    g.outline(K.rect(P0[0], P0[1], P0[2], P0[3]), { w: 0.5, c: '#A9A08C', boil: false });
    // the approach from the street, through the gate to the plaza; a side path past the jizō
    g.fill(K.rect(P0[2], 11, H, 19.5), PATH); g.fill(K.rect(-H, 13.5, P0[0] + 6, 16.5), PATH);
    g.fill(K.rect(-10, P0[3], -6, H), PATH); g.fill(K.rect(P0[2], -21.5, 30, -16.5), PATH);
    g.scuff(K.rect(P0[2], 11, H, 19.5), { dir: Math.atan2(AY, AX), len: 3, c: '#DAD0B8', dens: 0.6, w: 0.45 });
    for (const [x0, y0, x1, y1] of [[P0[2], 11, H, 19.5], [-H, 13.5, P0[0] + 6, 16.5], [-10, P0[3], -6, H]]) g.outline(K.rect(x0, y0, x1, y1), { w: 0.4, c: '#B9AE94', boil: false });
    // the jizō garden's gravel bed
    g.fill(K.rect(-35, 19, -12, 35.6), '#E6E0D0'); g.scuff(K.rect(-35, 19, -12, 35.6), { dir: Math.atan2(AY, -AX), len: 1.4, c: '#CFC7B3', dens: 1.2, w: 0.4 });
    g.outline(K.rect(-35, 19, -12, 35.6), { w: 0.45, c: '#A9A08C', boil: false });
  }, { rim: true });

  // a parked bicycle (K.bike always carries a rider): wheels, frame, saddle and bars, heading ang
  const parked = (g, x, y, ang, col) => g.at(x, y, 0, (g2) => {
    const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, z) => g2.p(u * ca, u * sa, z);
    for (const u of [-2.3, 2.3]) { const ty = [], h = pt(u, 1.45), sp = []; for (let i = 0; i < 20; i++) { const t = TAU * i / 20; ty.push(pt(u + Math.cos(t) * 1.45, 1.45 + Math.sin(t) * 1.45)); } for (let i = 0; i < 4; i++) { const t = TAU * i / 4 + 0.4, e = pt(u + Math.cos(t) * 1.15, 1.45 + Math.sin(t) * 1.15); sp.push(h[0], h[1], e[0], e[1]); } g2.line2(ty, { c: '#3A3632', w: 0.7, close: true, boil: false, wob: 0.2 }); g2.segs2(sp, '#9A9384', 0.2); }
    const A = pt(-2.3, 1.45), B = pt(2.3, 1.45), seat = pt(-0.8, 3.7), bar = pt(1.7, 4.0), bb = pt(0, 1.5), s0 = pt(-1.15, 3.8), s1 = pt(-0.45, 3.75), hb = (v) => g2.p(1.7 * ca - sa * v, 1.7 * sa + ca * v, 4.05);
    g2.segs2([A[0], A[1], seat[0], seat[1], seat[0], seat[1], bb[0], bb[1], bb[0], bb[1], bar[0], bar[1], bar[0], bar[1], B[0], B[1], A[0], A[1], bb[0], bb[1], seat[0], seat[1], bar[0], bar[1]], col, 0.6);
    g2.line2([s0, s1], { c: '#3A3632', w: 0.85, boil: false, ext: 0 }); g2.line2([hb(-0.75), hb(0.75)], { c: '#3A3632', w: 0.5, boil: false, ext: 0 });
    const bk = pt(2.6, 3.4); g2.fill2([[bk[0] - 0.8, bk[1] - 0.6], [bk[0] + 0.8, bk[1] - 0.6], [bk[0] + 0.7, bk[1] + 0.6], [bk[0] - 0.7, bk[1] + 0.6]], '#8C8576', true);   // the basket
  });
  /* ---------------- the tower ---------------- */
  // half the width of the tower at height z (centre of the leg to the axis): the legs curve in from 13 u at the foot
  const wAt = (z) => z <= D0 + 0.5 ? 4.7 + 9.6 * Math.pow(Math.max(0, 1 - z / (D0 + 0.5)), 2.05)
    : z <= U0 ? lerp(4.2, 1.85, (z - D1) / (U0 - D1)) : z <= MAST ? lerp(1.15, 0.7, (z - U1) / (MAST - U1)) : 0.3;
  const C3 = (s, z) => { const w = wAt(z); return [TX + s[0] * w, TY + s[1] * w, z]; };
  const LEGS = { back: [-1, -1], left: [-1, 1], right: [1, -1], front: [1, 1] };
  // faces as pairs of corners; back faces are seen from inside, through the lattice
  const F_BACK = [[LEGS.back, LEGS.right], [LEGS.back, LEGS.left]], F_FRONT = [[LEGS.left, LEGS.front], [LEGS.right, LEGS.front]];
  /* a leg: a ribbon along the corner, lit on its left half, shaded on its right; one stretch per band of paint */
  const leg = (g, s, z0, z1, hw, back) => {
    const cuts = [z0]; for (let b = Math.ceil(z0 / BAND) * BAND; b < z1 - 0.01; b += BAND) if (b > z0 + 0.01) cuts.push(b); cuts.push(z1);
    for (let k = 0; k + 1 < cuts.length; k++) {
      const a = cuts[k], b = cuts[k + 1], pc = paint((a + b) / 2), n = Math.max(2, Math.ceil((b - a) / 1.2)), P = [], hs = [];
      for (let i = 0; i <= n; i++) { const z = lerp(a, b, i / n), q = C3(s, z); P.push(g.p(q[0], q[1], q[2])); hs.push(hw(z)); }
      const L = [], R = [];
      for (let i = 0; i <= n; i++) { const p = P[Math.max(0, i - 1)], q = P[Math.min(n, i + 1)]; let dx = q[0] - p[0], dy = q[1] - p[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l; L.push([P[i][0] + dy * hs[i], P[i][1] - dx * hs[i]]); R.push([P[i][0] - dy * hs[i], P[i][1] + dx * hs[i]]); }
      g.fill2(L.concat(P.slice().reverse()), back ? pc.back : pc.l, true); g.fill2(P.concat(R.slice().reverse()), back ? pc.backF : pc.r, true);
      // the leg is itself a lattice: a zigzag of thin members down its two faces
      const zz = []; for (let i = 0; i < n; i++) { const m = i % 2; zz.push(L[i][0], L[i][1], P[i + 1][0] + (m ? 0 : 0), P[i + 1][1], R[i][0], R[i][1], P[i + 1][0], P[i + 1][1]); }
      if (!back && hs[0] > 2.2) g.segs2(zz, pc.ink, 0.16);
      g.line2(L, { w: back ? 0.35 : 0.55, c: pc.ink, boil: false }); g.line2(R, { w: back ? 0.35 : 0.55, c: pc.ink, boil: false });
      g.line2(P, { w: 0.2, c: pc.ink, boil: false });
      if (k > 0) g.line2([L[0], R[0]], { w: 0.3, c: pc.ink, boil: false });
    }
  };
  /* a straight member between two world points as a flat ribbon `w` wide px, in one colour (thin braces) */
  const bar = (g, a, b, w, col) => { const p = g.p(a[0], a[1], a[2]), q = g.p(b[0], b[1], b[2]); let dx = q[0] - p[0], dy = q[1] - p[1]; const l = Math.hypot(dx, dy) || 1; dx = dx / l * w / 2; dy = dy / l * w / 2; g.fill2([[p[0] + dy, p[1] - dx], [q[0] + dy, q[1] - dx], [q[0] - dy, q[1] + dx], [p[0] - dy, p[1] + dx]], col, true); };
  /* a face between two corners: horizontal girders at the levels (solid members, lit or shaded with the face), and
     X-bracing between them as thin members (two Xs and a post in a wide panel); a face seen from behind is paler */
  const face = (g, sa, sb, levels, back, inset, gt, bw) => {
    const at = (s0, s1, t, z) => { const a = C3(s0, z), b = C3(s1, z); return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), z]; };
    const lit = !back && sa[1] === 1 && sb[1] === 1;                                  // the face looking lower-left takes the light
    const fine = [], fineW = [];
    for (let k = 0; k + 1 < levels.length; k++) {
      const z0 = levels[k] + gt, z1 = levels[k + 1], pc = paint((z0 + z1) / 2), col = back ? pc.backF : lit ? pc.l : pc.r;
      const W = 2 * wAt((z0 + z1) / 2), e0 = inset / (2 * wAt(z0)), e1 = inset / (2 * wAt(z1)), split = W / (z1 - z0) > 1.5;
      const A0 = at(sa, sb, e0, z0), B0 = at(sa, sb, 1 - e0, z0), A1 = at(sa, sb, e1, z1), B1 = at(sa, sb, 1 - e1, z1), w = back ? bw * 0.7 : bw;
      const fl = pc === WH ? fineW : fine;
      const X = (a, b, c, d) => { bar(g, a, b, w, col); bar(g, c, d, w, col); const p = g.p(a[0], a[1], a[2]), q = g.p(b[0], b[1], b[2]), r = g.p(c[0], c[1], c[2]), t = g.p(d[0], d[1], d[2]); fl.push(p[0], p[1], q[0], q[1], r[0], r[1], t[0], t[1]); };
      if (split) { const M0 = at(sa, sb, 0.5, z0), M1 = at(sa, sb, 0.5, z1); X(A0, M1, M0, A1); X(M0, B1, B0, M1); bar(g, M0, M1, w * 1.2, col); }
      else X(A0, B1, B0, A1);
      // a finer secondary web in the big low panels: struts from the girder's quarter points to the crossing
      if (!back && W > 9) { const cA = at(sa, sb, 0.25, (z0 + z1) / 2), cB = at(sa, sb, 0.75, (z0 + z1) / 2), q = [at(sa, sb, 0.25, z0), at(sa, sb, 0.25, z1), at(sa, sb, 0.75, z0), at(sa, sb, 0.75, z1)]; for (const [u, v] of [[q[0], cA], [cA, q[1]], [q[2], cB], [cB, q[3]]]) { const p = g.p(u[0], u[1], u[2]), r = g.p(v[0], v[1], v[2]); fl.push(p[0], p[1], r[0], r[1]); } }
    }
    if (!back) { g.segs2(fine, OR.ink, 0.16); g.segs2(fineW, WH.ink, 0.2); }
    // the girders
    for (const z of levels) {
      if (z <= 0.01) continue;
      const pc = paint(z + gt / 2), e = inset / (2 * wAt(z)), q = [at(sa, sb, e, z), at(sa, sb, 1 - e, z), at(sa, sb, 1 - e, z + gt), at(sa, sb, e, z + gt)];
      g.fill(q, back ? pc.backF : lit ? pc.l : pc.r); g.outline(q, { w: back ? 0.2 : 0.32, c: back ? pc.backF : pc.ink, boil: false, ext: 0 });
    }
  };
  // girder levels: wide panels low down, closer as the tower narrows
  const LOW = [12.6, 18.4, 23.6, 28.2, 32.2, 35.8, D0 - 0.2], HIGH = [D1, 49.6, 53, 56.3, 59.5, 62.6, 65.6, 68.5, 71, U0], TIP = [U1, 79.5, 82.2, 84.8, 87.4, MAST];
  const hwLow = (z) => lerp(5.6, 2.6, Math.pow(z / D0, 0.75)), hwHigh = (z) => lerp(2.4, 1.4, (z - D1) / (U0 - D1)), hwTip = () => 0.8;

  T.obj([TX - 7.5, TY - 7.5, TX + 7.5, TY + 7.5], function (g) {   // the footprint is FootTown's: people walk round the legs
    const i0 = g.cmds.length;
    g.boilP = 0.2;
    // the footings of the four legs
    for (const s of Object.values(LEGS)) { const c = C3(s, 0); K.box(g, c[0] - 1.6, c[1] - 1.6, c[0] + 1.6, c[1] + 1.6, 0, 0.7, { t: '#E4E0D6', l: '#D9D4C8', r: '#C6C0B3' }, { w: 0.55 }); }
    // the lower tower, back to front: the two far faces, the far leg, then FootTown and the lift core inside, the two
    // side legs, the near faces and the near leg
    for (const [a, b] of F_BACK) face(g, a, b, LOW, true, 1.2, 0.85, 1.3);
    leg(g, LEGS.back, 0.7, D0, hwLow, true);
    footTown(g);
    K.box(g, TX - 1.3, TY - 1.3, TX + 1.3, TY + 1.3, 10.8, D0, { t: '#F1EEE6', l: '#F4F2EB', r: '#DAD6CC' }, { w: 0.5 });   // the lift shaft
    { const sg = []; for (let z = 12.6; z < D0 - 1; z += 2.2) { const a = g.p(TX - 1.3, TY + 1.3, z), b = g.p(TX + 1.3, TY + 1.3, z), c = g.p(TX + 1.3, TY - 1.3, z); sg.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); } g.segs2(sg, '#B9B3A6', 0.25); }
    leg(g, LEGS.left, 0.7, D0, hwLow); leg(g, LEGS.right, 0.7, D0, hwLow);
    for (const [a, b] of F_FRONT) face(g, a, b, LOW, false, 1.2, 0.85, 1.3);
    leg(g, LEGS.front, 0.7, D0, hwLow);
    mainDeck(g);
    // the upper tower to the Top Deck
    for (const [a, b] of F_BACK) face(g, a, b, HIGH, true, 0.6, 0.55, 1.0);
    leg(g, LEGS.back, D1, U0, hwHigh, true);
    K.box(g, TX - 0.7, TY - 0.7, TX + 0.7, TY + 0.7, D1, U0, { t: '#F1EEE6', l: '#F4F2EB', r: '#DAD6CC' }, { w: 0.4 });
    leg(g, LEGS.left, D1, U0, hwHigh); leg(g, LEGS.right, D1, U0, hwHigh);
    for (const [a, b] of F_FRONT) face(g, a, b, HIGH, false, 0.6, 0.55, 1.0);
    leg(g, LEGS.front, D1, U0, hwHigh);
    topDeck(g);
    // the antenna section and the mast
    for (const [a, b] of F_BACK) face(g, a, b, TIP, true, 0.25, 0.35, 0.6);
    for (const s of [LEGS.back, LEGS.left, LEGS.right]) leg(g, s, U1, MAST, hwTip, s === LEGS.back);
    for (const [a, b] of F_FRONT) face(g, a, b, TIP, false, 0.25, 0.35, 0.6);
    leg(g, LEGS.front, U1, MAST, hwTip);
    { const b = g.p(TX, TY, MAST), t = g.p(TX, TY, TOP);
      for (let z = MAST, k = 0; z < TOP - 0.01; z += 1.7, k++) { const a = g.p(TX, TY, z), c = g.p(TX, TY, Math.min(TOP, z + 1.7)), w = lerp(1.1, 0.55, (z - MAST) / (TOP - MAST)); g.fill2([[a[0] - w, a[1]], [a[0] + w, a[1]], [c[0] + w * 0.9, c[1]], [c[0] - w * 0.9, c[1]]], k % 2 ? WH.l : OR.l, true); }
      g.line2([[b[0] - 1.1, b[1]], [t[0] - 0.5, t[1]]], { w: 0.4, c: OR.ink, boil: false }); g.line2([[b[0] + 1.1, b[1]], [t[0] + 0.5, t[1]]], { w: 0.4, c: OR.ink, boil: false });
      g.disc2([t[0], t[1] - 0.6], 0.75, '#E0503E'); g.mark({ nc: '#FF5A48', light: true }); }
    // at night the Landmark Light floods it warm orange from below, the white bands turned amber
    const LITN = { [OR.l]: '#FF8A4E', [OR.r]: '#E8703C', [OR.back]: '#F5A070', [OR.backF]: '#E99064', [OR.fine]: '#FF9D62', [OR.ink]: '#B4502A', [WH.l]: '#FFD9A6', [WH.r]: '#F2BE84', [WH.back]: '#F6CF9C', [WH.backF]: '#E8B988', [WH.fine]: '#F3C68E', [WH.ink]: '#B98A55' };
    g.mark({ nc: (c) => LITN[c] }, i0);
    for (const k in LITN) void k;
    for (const [z, r] of [[4, 9], [14, 8], [24, 6.5], [33, 5.5], [D0 + 3, 7], [52, 4.4], [62, 3.6], [U0 + 2, 3.2], [82, 2.2], [92, 1.6]]) g.glow('lantern', TX, TY, z, { r: r * 1.4, col: '#FF9A4E' });
    g.glow('lantern', TX, TY, TOP + 0.4, { r: 1.2, col: '#FF5A48' });
  }, { name: 'tokyo tower', tall: true });

  /* FootTown: four storeys of glass bands in a white frame between the legs, the entrance and its name on the front */
  function footTown(g) {
    const x0 = TX - 7, y0 = TY - 7, x1 = TX + 7, y1 = TY + 7, zt = 10.8;
    K.box(g, x0, y0, x1, y1, 0, zt, { t: '#E4E0D7', l: '#F4F1EA', r: '#E1DDD3' }, { w: 0.8 });
    for (let f = 0; f < 4; f++) {
      const z = 0.45 + f * 2.6, top = z + (f ? 1.65 : 1.9);
      for (const [fc, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
        const n = 6; for (let i = 0; i < n; i++) { const a = lerp(a0 + 0.5, a1 - 0.5, i / n) + 0.1, b = lerp(a0 + 0.5, a1 - 0.5, (i + 1) / n) - 0.1; if ((f === 0 || f === 1) && fc === 'L' && (i === 2 || i === 3)) continue; if (f === 1 && fc === 'R' && i >= 2 && i <= 3) continue; K.win(g, fc, p, a, b, z, top, { style: 'glass', w: 0.35 }); }
        g.fill(K.on(fc, p + 0.02, a0, a1, top + 0.25, top + 0.5), '#D8D3C8');
      }
    }
    // the entrance: glass doors under a canopy, the name over them
    K.win(g, 'L', y1, TX - 1.2, TX + 1.2, 0, 2.6, { style: 'glass', col: '#E9D3A6', lit: true });
    g.fill([[TX - 2.2, y1, 2.9], [TX + 2.2, y1, 2.9], [TX + 2.2, y1 + 1.6, 2.7], [TX - 2.2, y1 + 1.6, 2.7]], OR.l); g.outline([[TX - 2.2, y1, 2.9], [TX + 2.2, y1, 2.9], [TX + 2.2, y1 + 1.6, 2.7], [TX - 2.2, y1 + 1.6, 2.7]], { w: 0.4, c: OR.ink, boil: false });
    K.sign(g, 'L', y1, TX - 4.3, TX + 4.3, 3.1, 4.6, '#E85A30', 'TOKYO TOWER', { ink: '#FBF8EE' });
    K.sign(g, 'R', x1, TY - 2.3, TY + 2.3, 3.2, 4.4, '#F3F1EA', 'FOOTTOWN', { ink: '#3F5F8F' });
    // the roof: a parapet, plant, a little rooftop pavilion
    g.line([[x0 + 0.4, y1 - 0.4, zt + 0.6], [x1 - 0.4, y1 - 0.4, zt + 0.6], [x1 - 0.4, y0 + 0.4, zt + 0.6]], { w: 0.3, c: '#8C8576', boil: false });
    K.box(g, TX + 2, TY - 6, TX + 5.5, TY - 3, zt, zt + 1.4, { t: '#D9D5CB', l: '#E6E2D9', r: '#CFCAC0' }, { w: 0.45 });
    K.box(g, TX - 6, TY + 2.5, TX - 3.5, TY + 5.5, zt, zt + 1.1, { t: '#C9CCC8', l: '#D6D8D3', r: '#BFC2BD' }, { w: 0.45 });
  }
  /* the Main Deck: two storeys of tilted glass in white frames, the lower a little wider, an orange band at the floor */
  function mainDeck(g) {
    const tier = (w, z0, z1) => {
      const x0 = TX - w, y0 = TY - w, x1 = TX + w, y1 = TY + w;
      K.box(g, x0, y0, x1, y1, z0, z1, { t: '#E6E2D9', l: '#F7F5EF', r: '#E0DCD2' }, { w: 0.75 });
      g.fill(K.on('L', y1 + 0.02, x0, x1, z0, z0 + 0.45), OR.l); g.fill(K.on('R', x1 + 0.02, y0, y1, z0, z0 + 0.45), OR.r);
      for (const [fc, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
        const q = K.on(fc, p + 0.03, a0 + 0.35, a1 - 0.35, z0 + 0.8, z1 - 0.55); g.fill(q, '#9FBBCC'); g.mark({ win: 0.9 });
        const ms = []; for (let a = a0 + 0.35 + 0.9; a < a1 - 0.6; a += 0.9) { const p0 = g.p.apply(g, K.pt(fc, p + 0.04, a, z0 + 0.8)), p1 = g.p.apply(g, K.pt(fc, p + 0.04, a, z1 - 0.55)); ms.push(p0[0], p0[1], p1[0], p1[1]); }
        g.segs2(ms, '#F3F1EA', 0.35);
        { const a = g.p.apply(g, K.pt(fc, p + 0.04, lerp(a0, a1, 0.3), z1 - 0.9)), b = g.p.apply(g, K.pt(fc, p + 0.04, lerp(a0, a1, 0.38), z0 + 1.2)); g.segs2([a[0], a[1], b[0], b[1]], '#F3F7F9', 0.6); }
        g.outline(q, { w: 0.4, c: '#5F6E7A', boil: false });
      }
    };
    tier(6.6, D0, DM); tier(6.1, DM, D1);
    K.box(g, TX - 6.4, TY - 6.4, TX + 6.4, TY + 6.4, D1, D1 + 0.35, { t: '#D9D5CB', l: OR.l, r: OR.r }, { w: 0.5 });
  }
  /* the Top Deck: a smaller glass box near the top */
  function topDeck(g) {
    const w = 2.7, x0 = TX - w, y0 = TY - w, x1 = TX + w, y1 = TY + w;
    K.box(g, x0, y0, x1, y1, U0, U1, { t: '#E6E2D9', l: '#F7F5EF', r: '#E0DCD2' }, { w: 0.6 });
    for (const [fc, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) { const q = K.on(fc, p + 0.03, a0 + 0.3, a1 - 0.3, U0 + 0.9, U1 - 0.6); g.fill(q, '#9FBBCC'); g.mark({ win: 0.9 }); g.outline(q, { w: 0.35, c: '#5F6E7A', boil: false }); }
    g.fill(K.on('L', y1 + 0.02, x0, x1, U0, U0 + 0.4), OR.l); g.fill(K.on('R', x1 + 0.02, y0, y1, U0, U0 + 0.4), OR.r);
  }

  /* ---------------- Zōjō-ji: the Sangedatsumon ---------------- */
  // two storeys, five bays by three, three doorways (the gate of the three liberations); vermilion posts and beams, white
  // plaster, the upper storey ringed by a balcony, both roofs hip-and-gable in dark tile
  const GX0 = 21, GX1 = 29, GY0 = 5, GY1 = 25;
  T.obj([GX0 - 0.6, GY0 - 0.6, GX1 + 0.6, GY1 + 0.6], function (g) {   // the footprint is the stone floor
    g.boilP = 0.3;
    const VERM = { t: '#D9715A', l: '#D2473A', r: '#B23A30' }, POST = '#C2412F', PLASTER = '#F3EEE2', ROOF = '#4A505E';
    K.box(g, GX0 - 0.6, GY0 - 0.6, GX1 + 0.6, GY1 + 0.6, 0, 0.8, { t: '#E4DFD4', l: '#DAD6CA', r: '#C7C2B6' }, { w: 0.7 });   // the stone floor
    K.box(g, GX0, GY0, GX1, GY1, 0.8, 8.2, VERM, { w: 0.85 });
    // front (R face): six posts, three open doorways in the middle bays, plaster in the end bays
    const bay = (GY1 - GY0) / 5;
    for (let i = 0; i < 5; i++) {
      const a0 = GY0 + i * bay + 0.35, a1 = GY0 + (i + 1) * bay - 0.35;
      if (i >= 1 && i <= 3) { g.fill(K.on('R', GX1 + 0.02, a0, a1, 0.8, 6.6), '#3A2E26'); g.fill(K.on('R', GX1 + 0.03, a0 + 0.4, a1 - 0.4, 0.8, 6.3), '#5A4636'); }
      else { g.fill(K.on('R', GX1 + 0.02, a0, a1, 1.6, 6.6), PLASTER); const sl = []; for (let a = a0 + 0.5; a < a1 - 0.2; a += 0.55) { const p = g.p(GX1 + 0.04, a, 2.6), q = g.p(GX1 + 0.04, a, 5.6); sl.push(p[0], p[1], q[0], q[1]); } g.segs2(sl, '#B23A30', 0.35); g.outline(K.on('R', GX1 + 0.04, a0 + 0.3, a1 - 0.3, 2.6, 5.6), { w: 0.35, c: '#8A2E26', boil: false }); }
    }
    for (let i = 0; i <= 5; i++) { const a = GY0 + i * bay; g.fill(K.on('R', GX1 + 0.05, a - 0.35, a + 0.35, 0.8, 8.2), POST); }
    g.fill(K.on('R', GX1 + 0.06, GY0, GY1, 6.6, 7.2), '#E3B04A');                                      // a gilt-edged tie beam
    // the side (L face): three bays of plaster between the posts
    for (let i = 0; i < 3; i++) { const b = (GX1 - GX0) / 3, a0 = GX0 + i * b + 0.35, a1 = GX0 + (i + 1) * b - 0.35; g.fill(K.on('L', GY1 + 0.02, a0, a1, 1.6, 6.6), PLASTER); const sl = []; for (let a = a0 + 0.45; a < a1 - 0.2; a += 0.5) { const p = g.p(a, GY1 + 0.04, 2.4), q = g.p(a, GY1 + 0.04, 5.8); sl.push(p[0], p[1], q[0], q[1]); } g.segs2(sl, '#B23A30', 0.35); g.outline(K.on('L', GY1 + 0.04, a0 + 0.25, a1 - 0.25, 2.4, 5.8), { w: 0.35, c: '#8A2E26', boil: false }); }
    for (let i = 0; i <= 3; i++) { const a = GX0 + i * (GX1 - GX0) / 3; g.fill(K.on('L', GY1 + 0.05, a - 0.35, a + 0.35, 0.8, 8.2), '#D2473A'); }
    // bracket sets under the lower eaves
    { const br = []; for (let a = GY0 + 0.6; a < GY1; a += 1.1) { const p = g.p(GX1 + 0.06, a, 7.4), q = g.p(GX1 + 0.06, a, 8.1); br.push(p[0], p[1], q[0], q[1]); } g.segs2(br, '#7A2A22', 0.45); }
    TK.roof(g, GX0, GY0, GX1, GY1, 8.2, 2.6, { over: 2.0, lift: 0.9, col: ROOF, ridge: 'y', sp: 0.75 });
    // the upper storey and its balcony
    const ux0 = GX0 + 1.0, ux1 = GX1 - 1.0, uy0 = GY0 + 1.2, uy1 = GY1 - 1.2;
    K.box(g, ux0, uy0, ux1, uy1, 9.4, 15.0, VERM, { w: 0.8 });
    const ub = (uy1 - uy0) / 5;
    for (let i = 0; i < 5; i++) { const a0 = uy0 + i * ub + 0.3, a1 = uy0 + (i + 1) * ub - 0.3; g.fill(K.on('R', ux1 + 0.02, a0, a1, 10.3, 14.0), i === 2 ? '#3A2E26' : PLASTER); if (i !== 2) K.win(g, 'R', ux1 + 0.03, a0 + 0.5, a1 - 0.5, 11.0, 13.4, { style: 'dark', arch: true, col: '#5A4636', w: 0.3 }); }
    for (let i = 0; i <= 5; i++) { const a = uy0 + i * ub; g.fill(K.on('R', ux1 + 0.05, a - 0.25, a + 0.25, 9.4, 15.0), POST); }
    for (let i = 0; i < 3; i++) { const b = (ux1 - ux0) / 3, a0 = ux0 + i * b + 0.3, a1 = ux0 + (i + 1) * b - 0.3; g.fill(K.on('L', uy1 + 0.02, a0, a1, 10.3, 14.0), PLASTER); }
    // the balcony rail all round (the two sides we see)
    { const r = [], z1 = 10.6, z0 = 9.5, e = 0.9; const run = (A, B) => { const a = g.p(A[0], A[1], z1), b = g.p(B[0], B[1], z1); r.push(a[0], a[1], b[0], b[1]); const n = Math.round(Math.hypot(B[0] - A[0], B[1] - A[1]) / 0.8); for (let i = 0; i <= n; i++) { const t = i / n, p = g.p(lerp(A[0], B[0], t), lerp(A[1], B[1], t), z0), q = g.p(lerp(A[0], B[0], t), lerp(A[1], B[1], t), z1); r.push(p[0], p[1], q[0], q[1]); } };
      g.fill([[ux0 - e, uy1 + e, z0], [ux1 + e, uy1 + e, z0], [ux1 + e, uy0 - e, z0], [ux1, uy0 - e, z0], [ux1, uy1, z0], [ux0 - e, uy1, z0]], '#8A5A3A');
      run([ux0 - e, uy1 + e], [ux1 + e, uy1 + e]); run([ux1 + e, uy1 + e], [ux1 + e, uy0 - e]); g.segs2(r, '#B23A30', 0.45); }
    { const br = []; for (let a = uy0 + 0.5; a < uy1; a += 0.9) { const p = g.p(ux1 + 0.06, a, 14.3), q = g.p(ux1 + 0.06, a, 15.0); br.push(p[0], p[1], q[0], q[1]); } g.segs2(br, '#7A2A22', 0.4); }
    TK.roof(g, ux0, uy0, ux1, uy1, 15.0, 5.6, { gable: 0.42, over: 2.6, lift: 1.4, col: ROOF, end: '#6E5A44', ridge: 'y', sp: 0.75 });
  }, { name: 'sangedatsumon', under: 7 });
  // stone lanterns before the gate
  for (const [x, y] of [[33, 8.6], [33, 21.6], [9.5, 9.5], [9.5, 21]]) T.obj([x, y], (g) => tooro(g, x, y), { on: true });
  function tooro(g, x, y) {
    const S = { t: '#D9D5CA', l: '#CFCAC0', r: '#B9B3A8' };
    K.box(g, x - 0.9, y - 0.9, x + 0.9, y + 0.9, 0, 0.5, S, { w: 0.45 }); K.cyl(g, x, y, 0.35, 0.5, 2.6, S, { w: 0.4, n: 8 });
    K.box(g, x - 0.8, y - 0.8, x + 0.8, y + 0.8, 2.6, 3.0, S, { w: 0.4 }); K.box(g, x - 0.6, y - 0.6, x + 0.6, y + 0.6, 3.0, 4.2, S, { w: 0.4 });
    g.fill(K.on('L', y + 0.62, x - 0.35, x + 0.35, 3.2, 4.0), '#5A5046'); g.mark({ nc: '#FFD89A', light: true });
    K.hip(g, x - 1.1, y - 1.1, x + 1.1, y + 1.1, 4.2, 1.2, '#C9C4B9', { w: 0.45 });
    const t = g.p(x, y, 5.4); g.disc2(t, 0.45, '#C9C4B9');
    g.glow('lantern', x, y, 3.6, { r: 1.4, col: '#FFC27A' });
  }

  /* ---------------- the bell tower ---------------- */
  // Zōjō-ji's great bell (1673), one of the three great bells of Edo, in a vermilion belfry; a monk swings the log
  const BX = 24, BY = -19;
  // in two parts, so the monk on the platform stands in front of the bell and behind the front post and the roof
  T.obj([BX - 4.6, BY - 4.6, BX + 4.6, BY + 4.6], function (g) {
    g.boilP = 0.3;
    K.box(g, BX - 4.4, BY - 4.4, BX + 4.4, BY + 4.4, 0, 1.4, { t: '#D9D4C8', l: '#CFC9BC', r: '#B9B2A4' }, { w: 0.7 });          // the stone base
    { const sl = []; for (let z = 0.45; z < 1.4; z += 0.45) for (const [a, b] of [[[BX - 4.4, BY + 4.4], [BX + 4.4, BY + 4.4]], [[BX + 4.4, BY + 4.4], [BX + 4.4, BY - 4.4]]]) { const p = g.p(a[0], a[1] + 0.02, z), q = g.p(b[0] + 0.02, b[1], z); sl.push(p[0], p[1], q[0], q[1]); } g.segs2(sl, '#9C9585', 0.25); }
    // the bell hangs between four splayed posts
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1]]) { const a = g.p(BX + sx * 3.4, BY + sy * 3.4, 1.4), b = g.p(BX + sx * 3.0, BY + sy * 3.0, 9.2); g.fill2([[a[0] - 0.7, a[1]], [a[0] + 0.7, a[1]], [b[0] + 0.55, b[1]], [b[0] - 0.55, b[1]]], '#C2412F'); g.line2([[a[0] - 0.7, a[1]], [b[0] - 0.55, b[1]]], { w: 0.35, c: '#6E241C', boil: false }); g.line2([[a[0] + 0.7, a[1]], [b[0] + 0.55, b[1]]], { w: 0.35, c: '#6E241C', boil: false }); }
    { const top = g.p(BX, BY, 8.6); g.line2([top, g.p(BX, BY, 7.9)], { w: 0.6, c: '#3A3530', boil: false }); }
    K.cyl(g, BX, BY, 1.9, 3.6, 7.9, { t: '#5E6A5E', l: '#6E7C6A', r: '#55614F' }, { w: 0.7, n: 14 });                               // the bronze bell
    K.dome(g, BX, BY, 1.9, 7.9, 0.9, '#6E7C6A', { w: 0.6 });
    { const bands = []; for (const z of [4.4, 6.0, 7.0]) { const p = K.arc(BX, BY, z, 1.92, Math.PI * 3 / 4, -Math.PI / 4, 10).map((q) => g.p(q[0], q[1], q[2])); for (let i = 0; i + 1 < p.length; i++) bands.push(p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]); } g.segs2(bands, '#3F4A3E', 0.3); }
    { const st = []; for (let k = 0; k < 4; k++) for (let j = 0; j < 3; j++) { const a = Math.PI * 3 / 4 - 0.25 - k * 0.42, c = g.p(BX + Math.cos(a) * 1.95, BY + Math.sin(a) * 1.95, 6.3 + j * 0.42); st.push(c[0] - 0.2, c[1], c[0] + 0.2, c[1]); } g.segs2(st, '#3F4A3E', 0.4); }   // the nipples on the bell's shoulder
  }, { name: 'bell tower' });
  // the front post, the beam and the roof
  T.obj([BX + 3.0, BY + 3.0], function (g) {
    g.boilP = 0.3;
    { const a = g.p(BX + 3.0, BY + 3.0, 1.4), b = g.p(BX + 3.0, BY + 3.0, 9.2); g.fill2([[a[0] - 0.7, a[1]], [a[0] + 0.7, a[1]], [b[0] + 0.55, b[1]], [b[0] - 0.55, b[1]]], '#D2473A'); g.line2([[a[0] - 0.7, a[1]], [b[0] - 0.55, b[1]]], { w: 0.4, c: '#6E241C', boil: false }); g.line2([[a[0] + 0.7, a[1]], [b[0] + 0.55, b[1]]], { w: 0.4, c: '#6E241C', boil: false }); }
    K.box(g, BX - 3.4, BY - 3.4, BX + 3.4, BY + 3.4, 8.8, 9.6, { t: '#B23A30', l: '#D2473A', r: '#B23A30' }, { w: 0.5, nb: true });
    TK.roof(g, BX - 3.4, BY - 3.4, BX + 3.4, BY + 3.4, 9.6, 4.4, { gable: 0.4, over: 1.9, lift: 1.2, col: '#4A505E', end: '#6E5A44', ridge: 'x', sp: 0.7 });
  }, { name: 'bell tower roof', on: true });
  // the monk at the bell: he draws the log back on its ropes, swings it in, the bell booms (rings spread), he bows
  T.actor({ sample: 0.25, period: 16, r: 18,
    at(t) { const u = ((t % 16) + 16) % 16, sw = u < 2.5 ? -Math.min(1, u / 1.6) : u < 2.9 ? lerp(-1, 0.15, (u - 2.5) / 0.4) : u < 3.4 ? 0.15 : 0;
      const ring = u >= 2.9 && u < 6.5 ? Math.min(3, Math.floor((u - 2.9) / 1.2)) : -1, bow = u > 8 && u < 10;
      return { x: BX + 3.6, y: BY + 0.2, z: 1.4, key: Math.round(sw * 4) + '.' + ring + (bow ? 'b' : ''), sw: Math.round(sw * 4) / 4, ring, bow }; },
    draw(g, st) {
      // the log hangs from two ropes at the beam, struck end towards the bell
      const L = 3.4, sw = st.sw, a = g.p(-1.9 + sw * 1.4, 0, 3.9), b = g.p(-1.9 + L + sw * 1.4, 0, 3.9), ra = g.p(-1.4, 0, 7.6), rb = g.p(0.9, 0, 7.6);
      g.segs2([ra[0], ra[1], a[0] + 1.2, a[1], rb[0], rb[1], b[0] - 1.6, b[1]], '#8A7A5A', 0.3);
      g.fill2([[a[0], a[1] - 1.0], [b[0], b[1] - 1.0], [b[0], b[1] + 1.0], [a[0], a[1] + 1.0]], '#A88A5E', true); g.outline2([[a[0], a[1] - 1.0], [b[0], b[1] - 1.0], [b[0], b[1] + 1.0], [a[0], a[1] + 1.0]], { w: 0.35, c: '#5A4630', boil: false });
      const pull = sw < -0.2;
      TK.person(g, 0.6, 0.4, 0, Object.assign({}, MONK, { dir: 2, lean: st.bow ? 2.6 : pull ? -0.6 : 0.8, hands: st.bow ? [[0.4, -9.2], [1.6, -9.4]] : [[-0.6 + sw * 2.2, -12.4], [1.0 + sw * 2.2, -12.6]] }));
      if (st.ring >= 0) { const c = g.p(-3.6, -0.2, 4.4); for (let k = 0; k <= st.ring; k++) { const r = 5 + (st.ring - k) * 3.4 + 2; g.line2(arcPts(c[0], c[1], r, -0.8, 0.8, 8), { w: 0.4, c: '#8C8576', boil: false }); g.line2(arcPts(c[0], c[1], r, Math.PI - 0.8, Math.PI + 0.8, 8), { w: 0.4, c: '#8C8576', boil: false }); } }
    } });
  const MONK = TK.who(5600, { top: '#2E2A26', bot: '#2E2A26', dress: '#2E2A26', sleeve: '#2E2A26', hairStyle: 'buzz', hair: '#3A3530', cap: undefined, glasses: false, obi: '#C99A3A' });
  TK.group(T, [{ who: TK.who(5601, { dir: 3 }), x: 29.4, y: -11.6 }, { who: TK.who(5602, { dir: 2 }), x: 31.0, y: -13.4 }, { who: TK.who(5603, { k: 0.75, dir: 3, cap: '#E6C24F' }), x: 28.0, y: -10.8 }], { seed: 31 });

  /* ---------------- the jizō garden ---------------- */
  // Sentai Kosodate Jizō: rows of small stone jizō in red knitted caps and red bibs, each with a pinwheel
  const ROWS = [21.2, 23.8, 26.4, 29.0, 31.6], JX = []; for (let k = 0; k < 10; k++) JX.push(-32.8 + k * 2.08);
  const jizo = (g, x, y) => {
    const p = g.p(x, y, 0), s = (u, v) => [p[0] + u, p[1] + v];
    g.fill2([s(-1.5, 0.3), s(1.5, 0.3), s(1.5, -1.0), s(-1.5, -1.0)], '#B9B3A6', true); g.fill2([s(-1.5, -1.0), s(1.5, -1.0), s(1.2, -1.5), s(-1.2, -1.5)], '#CFCABF', true);
    const body = K.curve([s(-1.35, -1.1), s(-1.45, -3.0), s(-1.05, -4.6), s(1.05, -4.6), s(1.45, -3.0), s(1.35, -1.1)], 2, false);
    g.fill2(body, '#C9C5BB', true); g.fill2([s(0.3, -1.1), s(1.35, -1.1), s(1.45, -3.0), s(1.05, -4.6), s(0.5, -4.6)], '#B5B0A5', true);
    g.line2(body.concat([body[0]]), { w: 0.28, c: '#6E685D', boil: false });
    g.fill2([s(-1.25, -4.5), s(1.25, -4.5), s(0.9, -3.1), s(0, -2.6), s(-0.9, -3.1)], '#D23F33', true);                       // the bib
    g.disc2(s(0, -5.6), 1.25, '#D4CFC4'); g.ring2(s(0, -5.6), 1.25, { c: '#6E685D', w: 0.26 });
    g.segs2([p[0] - 0.55, p[1] - 5.5, p[0] - 0.2, p[1] - 5.5, p[0] + 0.2, p[1] - 5.5, p[0] + 0.55, p[1] - 5.5], '#5A5046', 0.25);   // eyes closed
    g.fill2(K.curve([s(-1.4, -5.75), s(-1.2, -6.8), s(0, -7.45), s(1.2, -6.8), s(1.4, -5.75)], 2, false).concat([s(0, -6.0)]), '#D23F33', true);   // the knitted cap
    g.disc2(s(0, -7.55), 0.42, '#E8665A');
  };
  ROWS.forEach((y, r) => T.obj([-34, y - 0.6, -12, y + 0.6], function (g) {
    g.fill(K.rect(-34, y - 0.9, -12.5, y + 0.9, 0.02), '#D9D2C0');
    for (const x of JX) jizo(g, x, y);
  }, { name: 'jizo ' + r }));
  // a low hedge behind them, a stone with the garden's name, an offering stand
  T.obj([-35, 18.4, -12, 19.6], (g) => K.hedge(g, -35, 18.4, -12, 19.6, 1.6, { col: '#7FA563' }));
  T.obj([-13.4, 34.4], (g) => { K.box(g, -14.6, 33.4, -12.2, 35.4, 0, 3.0, { t: '#C9C4B9', l: '#D6D1C6', r: '#BDB7AB' }, { w: 0.5 }); g.fill(K.on('L', 35.42, -14.1, -12.7, 0.6, 2.5), '#C3BDB0'); }, { on: true });
  // pinwheels, every wheel turning: one actor per wheel, at its own foot (a whole row in one actor was put in front of or
  // behind the people at the garden's edge all at once)
  const WHEEL = ['#E9806A', '#F3E3A0', '#8FB7D9', '#C9E3A8', '#E7A9C9'];
  ROWS.forEach((y, r) => JX.forEach((x, i) => T.actor({ sample: 1, period: 4, grow: false,
    at(t) { const f = Math.floor(t * 8 + r) % 4; return { x: x + 0.8, y: y + 0.8, key: f, f }; },
    draw(g, st) {
      const b = g.p(0, 0, 0), c = [b[0], b[1] - 8.6 - (i % 2) * 0.6];
      g.line2([b, c], { w: 0.3, c: '#6B6458', boil: false });
      for (let k = 0; k < 4; k++) { const a = (st.f / 4) * Math.PI / 2 + k * Math.PI / 2 + i; g.fill2([c, [c[0] + Math.cos(a) * 1.9, c[1] + Math.sin(a) * 1.9], [c[0] + Math.cos(a + 0.75) * 1.25, c[1] + Math.sin(a + 0.75) * 1.25]], WHEEL[(k + i + r) % 5], true); }
      g.disc2(c, 0.3, '#3A3530');
    } })));

  /* ---------------- the park ---------------- */
  // Momijidani's maples behind the tower (they turn in autumn), cherries round the lawns
  for (const [x, y, r] of [[-31, -31, 4.6], [-33, -14, 4.2], [-15, -33, 4.4], [6, -32, 4.6], [16, -33, 4.4], [33, -31, 4.0], [-32, 2, 4.0], [-24, -34, 4.0], [33, -3, 3.8]]) T.obj([x, y], (g) => K.tree(g, x, y, TK.leaves({ r, h: 5.5, col: C.leafD }, 'maple', Math.round(x * 3 + y))), { on: true });
  for (const [x, y, r] of [[-29, 9, 5.0], [-20, 34, 4.2], [14, 33, 4.6], [33, 31, 4.2], [31, 0, 4.4], [17, -2, 4.0], [-33, 30.5, 3.8], [-34, -25, 4.2]]) T.obj([x, y], (g) => TK.sakura(g, x, y, { r }), { on: true });
  // lamps along the paths, benches
  for (const [x, y] of [[15, 10.2], [15, 20.3], [-15, 12.6], [-15, 17.4], [-11, 26], [10, -14]]) T.obj([x, y], (g) => K.lamp(g, x, y, { h: 7.5 }), { on: true });
  for (const [x, y, f] of [[3, 21, 'L'], [-24, 12.2, 'R'], [18, 24.5, 'L']]) T.obj([x, y], (g) => K.bench(g, x, y, { face: f, L: 1.8 }), { on: true });
  // the taiyaki and souvenir stand, its flag
  T.obj([2, 27, 9, 33], function (g) {   // the awning reaches y 32.9
    g.boilP = 0.3;
    K.box(g, 2.4, 27.4, 8.6, 31.4, 0, 5.6, { t: '#DCD4C0', l: '#F3EFE3', r: '#DCD4C0' }, { w: 0.8 });
    K.win(g, 'L', 31.4, 3.0, 8.0, 1.9, 3.9, { style: 'glass', col: '#E9C48A', lit: true });
    g.fill(K.on('L', 31.45, 3.0, 8.0, 1.9, 2.25), '#C9A26B');
    for (let i = 0; i < 5; i++) { const c = g.p(3.5 + i * 0.95, 31.6, 2.35); g.fill2([[c[0] - 0.9, c[1]], [c[0] + 0.6, c[1] - 0.35], [c[0] + 0.9, c[1] + 0.1], [c[0] - 0.7, c[1] + 0.4]], '#C98A3A', true); }
    TK.awning(g, 'L', 31.4, 2.6, 8.4, 4.4, 1.5, '#C9463E', { stripe: '#F3F1EA', drop: 0.9 });
    TK.sign(g, 'L', 31.4, 3.2, 7.8, 4.6, 5.5, '#F6EBC8', { word: 'たいやき', ink: '#8A2E26' });
    K.win(g, 'R', 8.6, 28.2, 30.6, 1.9, 3.9, { style: 'glass', col: '#E9D3A6', lit: true });
    g.fill(K.on('R', 8.65, 27.6, 31.2, 0.4, 1.4), '#E6C24F');                                         // a shelf of souvenirs
    { const R = RNG(77); for (let i = 0; i < 7; i++) { const c = g.p(8.7, 27.9 + i * 0.48, 1.4); g.fill2([[c[0] - 0.4, c[1]], [c[0] + 0.4, c[1] - 0.2], [c[0] + 0.4, c[1] - 1.2], [c[0] - 0.4, c[1] - 1.0]], R.pick(['#E3502F', '#F3F1EA', '#5F8FC9', '#E9806A']), true); } }
  }, { name: 'taiyaki' });
  T.obj([1.4, 32.4], function (g) {   // the nobori: a tall cloth banner on a pole
    const b = g.p(1.4, 32.4, 0), t = g.p(1.4, 32.4, 8.4); g.line2([b, t], { w: 0.45, c: '#6B5A48', boil: false });
    const q = [[t[0] + 0.3, t[1] + 0.6], [t[0] + 3.2, t[1] + 0.6], [t[0] + 3.2, t[1] + 15], [t[0] + 0.3, t[1] + 15]];
    g.fill2(q, '#F6F0DA', true); g.mark({ nc: (c) => mix(nightColour(c), c, 0.4) }); g.fill2([q[0], q[1], [q[1][0], q[1][1] + 1.2], [q[0][0], q[0][1] + 1.2]], '#C9463E', true);
    TK.word2(g, [t[0] + 1.75, t[1] + 8.6], 2.2, 'たいやき', '#8A2E26', { vert: true });
    g.outline2(q, { w: 0.35, c: '#8C8576', boil: false });
  }, { on: true });

  // by FootTown's door: vending machines, a bin, bicycles; the tower's guide board on the plaza
  T.obj([TX - 5.9, TY + 7.9], (g) => TK.vend(g, TX - 5.9, TY + 7.9, { col: '#F1EFE8', top: '#3F7FC0' }), { on: true });
  T.obj([TX + 7.9, TY + 4.8], (g) => { TK.vend(g, TX + 7.9, TY + 3.6, { face: 'R', col: '#C9463E' }); TK.vend(g, TX + 7.9, TY + 5.9, { face: 'R', col: '#F1EFE8', top: '#E6C24F' }); }, { on: true });
  // the bin beside them (it stood among the bicycles)
  T.obj([TX + 8.1, TY + 1.7], (g) => K.cyl(g, TX + 8.1, TY + 1.7, 0.55, 0, 1.6, { t: '#5A6B7A', l: '#6C7A89', r: '#56636F' }, { w: 0.4, n: 8 }), { on: true });
  // the bicycles stand clear of the path round the back of FootTown
  for (let i = 0; i < 4; i++) { const x = 4.6 + i * 1.5, y = -8.4; T.obj([x, y], (g) => parked(g, x, y, Math.PI / 2 + 0.25, ['#3F5F8F', '#E6C24F', '#C9584B', '#5A6B5A'][i]), { on: true }); }
  T.obj([10.5, 6.5], (g) => { const a = g.p(10.5, 6.5, 0), b = g.p(10.5, 6.5, 2.4); g.segs2([a[0] - 1.6, a[1], b[0] - 1.6, b[1], a[0] + 1.6, a[1], b[0] + 1.6, b[1]], '#5A564E', 0.45); K.box(g, 9.9, 5.2, 10.5, 7.8, 2.4, 5.6, { t: '#3F5F8F', l: '#F3F1EA', r: '#3F5F8F' }, { w: 0.5 }); K.text(g, 'R', 10.5, 6.5, 4.4, 0.55, 'TOKYO', '#E85A30', { center: true }); K.text(g, 'R', 10.5, 6.5, 3.4, 0.55, 'TOWER', '#E85A30', { center: true }); }, { on: true });
  // flower beds round the plaza, a low hedge along the street edges with gaps for the paths
  T.ground((g) => { for (const [x0, y0, x1, y1] of [[13, 1, 19, 3.6], [13, -9, 19, -6.4], [-22, -10, -19.6, -4]]) { g.fill(K.rect(x0, y0, x1, y1), '#9DBE7A'); g.outline(K.rect(x0, y0, x1, y1), { w: 0.4, c: '#6E8A50', boil: false }); } });
  for (const [x0, y0, x1, y1] of [[13, 1, 19, 3.6], [13, -9, 19, -6.4], [-22, -10, -19.6, -4]]) T.obj([x0, y0, x1, y1], (g) => K.blooms(g, x0, y0, x1, y1, 0, ['#F2C6D0', '#F3F1EA', '#E9C543', '#E9806A']), { cast: true });
  for (const [x0, y0, x1, y1] of [[36, -35, 36.8, 10], [36, 20.5, 36.8, 36], [-35, 36, -10.5, 36.8], [-5.5, 36, 36, 36.8]]) T.obj([x0, y0, x1, y1], (g) => K.hedge(g, x0, y0, x1, y1, 1.3, { col: '#86AE68' }));

  /* ---------------- the living layer ---------------- */
  // visitors on the plaza photographing each other with the tower behind them, and craning up at it
  TK.photo(T, { who: TK.who(5540, { dir: 2 }), x: 15.6, y: 4.6 }, [{ who: TK.who(5541, { dir: 0 }), x: 10.4, y: 1.2 }, { who: TK.who(5542, { dir: 0, cap: '#C9584B' }), x: 10.7, y: 3.0 }, { who: TK.kimono(5543, { dir: 0 }), x: 11.0, y: 4.6 }], { seed: 1 });
  TK.photo(T, { who: TK.who(5544, { dir: 3 }), x: -14, y: 9.6 }, [{ who: TK.who(5545, { dir: 1 }), x: -14.6, y: 5.2 }, { who: TK.who(5546, { dir: 1 }), x: -12.6, y: 5.0 }], { seed: 4 });
  TK.idle(T, TK.who(5547, { dir: 3 }), 14.2, -11.4, { acts: ['photo', 'photo', 'look', 'point'], lookTo: 3, seed: Math.round(12.6 * 131 - 9.5 * 977 + 7) });
  TK.idle(T, TK.who(5548, { dir: 2 }), 13.4, -3.0, { acts: ['photo', 'scroll', 'look', 'stretch'] });
  // a school trip in yellow caps comes in through the gate behind a teacher with a little flag, round the plaza and out
  // (in and out through the middle bay of the gate, clear of its posts; past the flower beds, the lamps, the bikes, the
  // tower's legs, the seated class and the photographers)
  const route = [[37, 15.8], [12.2, 15.8], [12.2, -15.4], [-17.2, -15.4], [-17.2, 11.2], [11.0, 11.2], [11.0, 14.2], [37, 14.2]];
  { const W = TK.who(5501, { top: '#5A6B5A', bot: '#3B3F47' }), seg = [], L = [0];   // the teacher, holding up a little yellow flag
    for (let i = 0; i < route.length; i++) { const a = route[i], c = route[(i + 1) % route.length]; seg.push([a, c]); L.push(L[i] + Math.hypot(c[0] - a[0], c[1] - a[1])); }
    const tot = L[L.length - 1];
    T.actor({ sample: 0.25, period: tot / 1.4,
      at(t) { let d = ((t * 1.4) % tot + tot) % tot, i = 0; while (i < seg.length - 1 && d > L[i + 1]) i++; const [a, c] = seg[i], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = c[0] - a[0], dy = c[1] - a[1], dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), f = Math.floor((d / 2.4) % 1 * 8); return { x: a[0] + dx * u, y: a[1] + dy * u, key: dir + '.' + f, dir, f }; },
      draw(g, st) { const r = TK.person(g, 0, 0, 0, Object.assign({}, W, { dir: st.dir, pose: 'walk', ph: st.f / 8, hands: [[-1.6, -9.8], [1.6, -18.4]] })), h = r.hands[1], t = [h[0], h[1] - 7]; g.line2([[h[0], h[1] + 1], t], { w: 0.35, c: '#5A4A3C', boil: false }); g.fill2([t, [t[0] + 3.2, t[1] + 0.6], [t[0] + 2.8, t[1] + 2.4], [t[0], t[1] + 2.2]], '#E6C24F', true); g.outline2([t, [t[0] + 3.2, t[1] + 0.6], [t[0] + 2.8, t[1] + 2.4], [t[0], t[1] + 2.2]], { w: 0.25, c: '#8A6A2A', boil: false }); } }); }
  for (let k = 1; k <= 7; k++) K.walker(T, TK.pupil(5501 + k, { k: 0.72, cap: '#E6C24F', randoseru: k % 2 ? '#C9463E' : '#2E2A26', top: '#F3F1EA', bot: '#3F4D63' }), route, 1.4, { phase: -k * 0.011 });
  // another class sitting on the plaza while their teacher points up at the decks
  TK.group(T, [
    { who: TK.who(5560, { dir: 1, top: '#3F5F8F', bot: '#3B3F47' }), x: -2.4, y: 4.0, idle: 'point' },
    { who: TK.pupil(5561, { k: 0.72, dir: 3, cap: '#E6C24F', top: '#F3F1EA', bot: '#3F4D63', sit: true }), x: -4.0, y: 7.0 },
    { who: TK.pupil(5562, { k: 0.72, dir: 3, cap: '#E6C24F', top: '#F3F1EA', bot: '#3F4D63', sit: true }), x: -1.8, y: 7.2 },
    { who: TK.pupil(5563, { k: 0.72, dir: 3, cap: '#E6C24F', top: '#F3F1EA', bot: '#3F4D63', sit: true }), x: 0.4, y: 7.4 },
    { who: TK.pupil(5564, { k: 0.72, dir: 3, cap: '#E6C24F', top: '#F3F1EA', bot: '#3F4D63', sit: true }), x: -3.0, y: 9.0 },
  ], { seed: 21, laughs: 0.35 });
  // under the cherries: a hanami picnic on a blue tarp (spring); maple-viewers with cameras (autumn); a family in the
  // shade (summer); a snowman (winter)
  // the tarp's footprint is a box (over 6 u wide, so not a small prop): the picnickers sitting on it are drawn after it
  T.cast([-31.4, 5.4, -25.2, 10.4], (g) => { TK.tarp(g, [[-31, 5.6, 0.04], [-25.4, 5.6, 0.04], [-25.4, 10.2, 0.04], [-31, 10.2, 0.04]]); const c = g.p(-28.2, 8, 0.05); g.fill2([[c[0] - 2, c[1] - 0.6], [c[0] + 2, c[1] - 0.6], [c[0] + 2, c[1] + 0.8], [c[0] - 2, c[1] + 0.8]], '#F3F1EA', true); for (const [dx, col] of [[-1.2, '#E9806A'], [0, '#F3E3A0'], [1.2, '#8FBF73']]) g.disc2([c[0] + dx, c[1]], 0.55, col); }, { season: 'spring' });
  TK.group(T, [
    { who: TK.who(5522, { dir: 1, sit: true }), x: -30, y: 6.6 },
    { who: TK.kimono(5523, { dir: 0, sit: true }), x: -30.2, y: 9.2 },
    { who: TK.who(5524, { dir: 2, sit: true }), x: -26.4, y: 7.6 },
    { who: TK.who(5525, { dir: 3, sit: true }), x: -28, y: 10.0 },
  ], { seed: 8, season: 'spring', laughs: 0.6 });
  TK.idle(T, TK.who(5526, { dir: 1, sit: true, food: '#F3F1EA' }), -26.6, 9.8, { acts: ['eat', 'drink', 'laugh', 'look'], season: 'spring' });
  TK.photo(T, { who: TK.who(5527, { dir: 2 }), x: -24.6, y: 4.0 }, [{ who: TK.who(5528, { dir: 0 }), x: -29.4, y: 3.2 }, { who: TK.who(5529, { dir: 0 }), x: -29.0, y: 5.4 }], { seed: 6, season: 'autumn' });
  TK.idle(T, TK.who(5530, { dir: 2 }), -27.6, -8.4, { acts: ['photo', 'point', 'look', 'photo'], season: 'autumn', lookTo: 3 });
  TK.group(T, [{ who: TK.who(5531, { dir: 1, sit: true, uchiwa: '#8FB7D9' }), x: -29.4, y: 6.8 }, { who: TK.who(5532, { dir: 0, sit: true }), x: -30.4, y: 9.8 }, { who: TK.who(5533, { k: 0.75, dir: 2 }), x: -26.2, y: 8.2 }], { seed: 9, season: 'summer' });
  T.obj([-25, 5], (g) => TK.snowman(g, -25, 5, 1.1), { on: true, season: 'winter' });
  // children chasing round the lawn in front of the tower
  TK.chase(T, [TK.who(5550, { k: 0.72 }), TK.who(5551, { k: 0.7, cap: '#E6C24F' }), TK.who(5552, { k: 0.74 })], [[-31, -8], [-24, -5.5], [-23.5, -13], [-30, -17]], 3.0, { gap: 0.14 });
  TK.toss(T, TK.who(5553, { k: 0.8 }), TK.who(5554, { k: 0.78 }), 22, 29, 30, 33.5, { seed: 0.5 });
  // at the jizō: a mother praying, a grandmother bowing, a visitor reading the stone
  TK.idle(T, TK.who(5570, { dir: 3 }), -17.6, 34.4, { acts: ['pray', 'pray', 'bow', 'rest'], seed: Math.round(-20.8 * 131 + 34.4 * 977 + 7) });
  TK.idle(T, TK.kimono(5571, { dir: 3 }), -27.8, 34.6, { acts: ['bow', 'pray', 'look'] });
  // at the stand: the vendor, a couple eating taiyaki
  TK.idle(T, TK.who(5580, { dir: 2, top: '#F3F1EA', cap: '#F3F1EA' }), 8.6, 33.6, { acts: ['talk', 'rest', 'look', 'talk'], seed: Math.round(5.6 * 131 + 30.2 * 977 + 7) });
  TK.idle(T, TK.who(5581, { dir: 3, food: '#C98A3A' }), 4.0, 34.2, { acts: ['eat', 'eat', 'laugh', 'talk'] });
  TK.idle(T, TK.who(5582, { dir: 2, food: '#C98A3A' }), 7.0, 35.0, { acts: ['eat', 'talk', 'laugh', 'look'], lookTo: 3 });
  // on the benches
  TK.idle(T, TK.who(5583, { dir: 1, sit: true }), 2.6, 21.9, { acts: ['scroll', 'rest', 'look', 'drink'], seed: Math.round(2.4 * 131 + 21.2 * 977 + 7) });
  TK.idle(T, TK.salary(5584, { dir: 0, sit: true, food: '#F3F1EA' }), -23.2, 12.2, { acts: ['eat', 'scroll', 'rest', 'drink'], seed: Math.round(-23.6 * 131 + 12.4 * 977 + 7) });
  // pigeons on the plaza, a dog walk, people coming and going
  TK.pigeons(T, 1.6, 14.6, 6, { seed: 3 });
  TK.pigeons(T, -12, -19.4, 5, { seed: 7 });
  TK.dogWalk(T, TK.who(5590), [[-8, 36], [-8, 16.4], [-30, 16.4], [-30, 15], [-8, 15]], 1.5, '#E8D2A6', { phase: 0.3 });
  for (let i = 0; i < 4; i++) K.walker(T, i % 2 ? TK.who(5591 + i) : TK.salary(5591 + i), i < 2 ? [[37, [12, 18.8][i]], [13.5, [12, 18.8][i]]] : [[[-6.8, -9.2][i - 2], 36], [[-6.8, -9.2][i - 2], 13]], 1.7, { phase: i * 0.31 });
});
