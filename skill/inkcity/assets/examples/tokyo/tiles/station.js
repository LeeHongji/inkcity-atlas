'use strict';
/* (0,-100) Tokyo Station, Marunouchi side: Tatsuno Kingo's red-brick building of 1914, restored in 2012 to its first
   form. Three storeys of red brick banded in white stone, white window frames, the long wings; at the north and south
   ends the octagonal halls under their slate domes, eyebrow dormers in the slate, a lantern and a finial on top; in the
   middle the central pavilion under its own tall roof, with the carriage porch of the imperial entrance. It spans the
   block. In front: the station square (granite, lawn panels, lamps, benches), the north and south traffic plazas with
   the taxi rank and a yellow sightseeing bus, the red post box, the kōban, and the Gyōkō-dōri ginkgo avenue running
   away towards the palace (it turns gold in late November). Travellers roll their cases in, friends meet and bow,
   people photograph the façade, a sweeper works the square, a salaryman runs for his train. */
SF.tile('station', 0, -100, { rim: 18 }, function (T) {
  const H = 37;
  // the building: back line, wings' front line, storey heights
  const YB = -35.5, YF = -21.5, Z1 = 5.4, Z2 = 10.0, ZE = 14.4, ZC = 15.1;
  const BR = { t: '#C98272', l: '#BC6A5C', r: '#A65A4E' }, BRICKLINE = '#9A5044';
  const ST = { t: '#ECE6D8', l: '#F5F1E7', r: '#E2DBCC' }, STONE = '#F5F1E7', STONE_R = '#E2DBCC';
  const SLATE = '#626872', SLATE_D = '#4A505C', BRONZE = '#C2A274', PANE = '#3E4A5C';
  const PAVE = '#E7E3D8', GRANITE = '#EFEBE1', LAWN = '#B9CF94';

  /* ---------------- the ground ---------------- */
  T.ground(function (g) {
    K.slab(g, H, { top: PAVE });
    // the building's apron and the square: granite flags in a grid
    g.fill(K.rect(-H, -21.5, H, -14), GRANITE);
    g.fill(K.rect(-14, -14, 14, 12), GRANITE);
    const gr = []; for (let a = -14; a <= 14; a += 2.8) { const p = g.p(a, -14, 0), q = g.p(a, 12, 0); gr.push(p[0], p[1], q[0], q[1]); }
    for (let b = -14; b <= 12; b += 2.6) { const p = g.p(-14, b, 0), q = g.p(14, b, 0); gr.push(p[0], p[1], q[0], q[1]); }
    for (let a = -H; a <= H; a += 3.2) { const p = g.p(a, -21.5, 0), q = g.p(a, -14, 0); gr.push(p[0], p[1], q[0], q[1]); }
    g.segs2(gr, '#D9D3C4', 0.28);
    g.fill(K.rect(-5, -14, 5, H), '#F5F1E8');                                                        // the central walk, pale, on to the avenue
    { const w = []; for (let b = -14; b <= H; b += 2.6) { const p = g.p(-5, b, 0), q = g.p(5, b, 0); w.push(p[0], p[1], q[0], q[1]); } for (const a of [-2.5, 0, 2.5]) { const p = g.p(a, -14, 0), q = g.p(a, H, 0); w.push(p[0], p[1], q[0], q[1]); } g.segs2(w, '#E2DCCD', 0.28); }
    // lawn panels either side of the walk, with granite kerbs
    for (const [x0, x1] of [[-13, -6.2], [6.2, 13]]) { g.fill(K.rect(x0 - 0.5, -10.5, x1 + 0.5, 9.5), '#E0DACB'); K.lawn(g, x0, -10, x1, 9, { col: LAWN, dens: 0.8, edge: false }); g.outline(K.rect(x0, -10, x1, 9), { w: 0.55, c: '#8FA070', boil: false }); }
    // the traffic plazas: a lane round a planted island at each end
    for (const s of [-1, 1]) {
      const xa = s < 0 ? -H : 14, xb = s < 0 ? -14 : H;
      g.fill(K.rect(xa, -14, xb, 11), '#D5D0C5');
      g.fill(K.rect(s < 0 ? -30.5 : 20.5, -8, s < 0 ? -20.5 : 30.5, 5), '#E3DED2');
      K.lawn(g, s < 0 ? -29.8 : 21.2, -7.3, s < 0 ? -21.2 : 29.8, 4.3, { col: LAWN, dens: 0.7, edge: false });
      g.outline(K.rect(s < 0 ? -30.5 : 20.5, -8, s < 0 ? -20.5 : 30.5, 5), { w: 0.55, c: '#A9A08C', boil: false });
      const dl = []; for (let y = -12; y < 9; y += 3) for (const x of s < 0 ? [-17.2] : [17.2]) { const p = g.p(x, y, 0), q = g.p(x, y + 1.5, 0); dl.push(p[0], p[1], q[0], q[1]); }
      g.segs2(dl, '#F7F5EE', 0.7);
      g.outline(K.rect(xa, -14, xb, 11), { w: 0.5, c: '#A9A296', boil: false });
    }
    // Gyōkō-dōri: the pale walk down the middle, a strip of lawn under each row of ginkgo
    g.scuff(K.rect(-5, 12, 5, H), { dir: Math.atan2(AY, -AX), len: 5, c: '#DCD3BE', dens: 0.4, w: 0.45, spread: 0.06 });
    for (const s of [-1, 1]) { const x0 = s < 0 ? -9.6 : 5.6, x1 = s < 0 ? -5.6 : 9.6; K.lawn(g, x0, 12.5, x1, H, { col: LAWN, dens: 0.7, edge: false }); g.outline(K.rect(x0, 12.5, x1, H), { w: 0.5, c: '#A9A08C', boil: false }); }
    // the front corners: lawns with paths
    K.lawn(g, -34, 15, -13, 34, { col: LAWN, dens: 0.6, edge: false }); g.outline(K.rect(-34, 15, -13, 34), { w: 0.5, c: '#A9A08C', boil: false });
    g.fill(K.rect(-34, 23.2, -13, 25.8), PAVE);
  }, { rim: true });
  // autumn: the avenue carpeted gold under its ginkgo, drifts of leaves along the kerbs
  T.ground(function (g) {
    TK.litter(g, -5, 12, 5, H, 300, ['#E8C445', '#F0D468', '#D9A93A'], 41);
    for (const x of [-7.6, 7.6]) TK.litter(g, x - 2.2, 13, x + 2.2, H - 1, 140, ['#E8C445', '#D9A93A', '#F0D468'], 42 + x);
    TK.litter(g, -14, 6, 14, 12, 60, ['#E8C445', '#F0D468'], 47);
  }, { season: 'autumn' });

  // a parked bicycle (K.bike always carries a rider): wheels, frame, saddle and bars, heading ang
  const parked = (g, x, y, ang, col) => g.at(x, y, 0, (g2) => {
    const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, z) => g2.p(u * ca, u * sa, z);
    for (const u of [-2.3, 2.3]) { const ty = [], h = pt(u, 1.45), sp = []; for (let i = 0; i < 20; i++) { const t = TAU * i / 20; ty.push(pt(u + Math.cos(t) * 1.45, 1.45 + Math.sin(t) * 1.45)); } for (let i = 0; i < 4; i++) { const t = TAU * i / 4 + 0.4, e = pt(u + Math.cos(t) * 1.15, 1.45 + Math.sin(t) * 1.15); sp.push(h[0], h[1], e[0], e[1]); } g2.line2(ty, { c: '#3A3632', w: 0.7, close: true, boil: false, wob: 0.2 }); g2.segs2(sp, '#9A9384', 0.2); }
    const A = pt(-2.3, 1.45), B = pt(2.3, 1.45), seat = pt(-0.8, 3.7), bar = pt(1.7, 4.0), bb = pt(0, 1.5), s0 = pt(-1.15, 3.8), s1 = pt(-0.45, 3.75), hb = (v) => g2.p(1.7 * ca - sa * v, 1.7 * sa + ca * v, 4.05);
    g2.segs2([A[0], A[1], seat[0], seat[1], seat[0], seat[1], bb[0], bb[1], bb[0], bb[1], bar[0], bar[1], bar[0], bar[1], B[0], B[1], A[0], A[1], bb[0], bb[1], seat[0], seat[1], bar[0], bar[1]], col, 0.6);
    g2.line2([s0, s1], { c: '#3A3632', w: 0.85, boil: false, ext: 0 }); g2.line2([hb(-0.75), hb(0.75)], { c: '#3A3632', w: 0.5, boil: false, ext: 0 });
    const bk = pt(2.6, 3.4); g2.fill2([[bk[0] - 0.8, bk[1] - 0.6], [bk[0] + 0.8, bk[1] - 0.6], [bk[0] + 0.7, bk[1] + 0.6], [bk[0] - 0.7, bk[1] + 0.6]], '#8C8576', true);   // the basket
  });
  /* ---------------- drawing helpers ---------------- */
  // a window on any wall plane P(a, z) -> world point: a white stone surround, a navy pane with glazing bars; arched or
  // square; o.key: a keystone; o.lit: the share lit at night (true: the scene's)
  const winP = (g, P, a0, a1, z0, z1, o) => {
    o = o || {}; const f = o.frame == null ? 0.32 : o.frame;
    const shape = (b0, b1, c0, c1) => { if (!o.arch) return [P(b0, c0), P(b1, c0), P(b1, c1), P(b0, c1)]; const r = (b1 - b0) / 2, m = (b0 + b1) / 2, zc = c1 - r, pts = [P(b0, c0), P(b1, c0)]; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; pts.push(P(m + r * Math.cos(t), zc + r * Math.sin(t))); } return pts; };
    if (f > 0) g.fill(shape(a0 - f, a1 + f, z0 - f * 1.4, z1 + f), o.fc || STONE);
    const pane = shape(a0, a1, z0, z1), i0 = g.cmds.length; g.fill(pane, o.col || PANE); g.mark({ win: o.lit == null ? true : o.lit }, i0);
    const m = (a0 + a1) / 2, zt = o.arch ? z1 - (a1 - a0) / 2 : z1, bars = [P(m, z0), P(m, o.arch ? z1 : z1), P(a0, lerp(z0, zt, 0.62)), P(a1, lerp(z0, zt, 0.62))].map((q) => g.p(q[0], q[1], q[2]));
    g.segs2([bars[0][0], bars[0][1], bars[1][0], bars[1][1], bars[2][0], bars[2][1], bars[3][0], bars[3][1]], '#E9E5DA', 0.3);
    g.outline(pane, { w: 0.3, c: '#2F3740', boil: false, ext: 0 });
    if (o.key && o.arch) { const k = [P(m - 0.22, z1 - 0.1), P(m + 0.22, z1 - 0.1), P(m + 0.3, z1 + f + 0.25), P(m - 0.3, z1 + f + 0.25)]; g.fill(k, STONE); }
    if (o.sill !== false) g.fill([P(a0 - f - 0.15, z0 - f * 1.4 - 0.25), P(a1 + f + 0.15, z0 - f * 1.4 - 0.25), P(a1 + f + 0.15, z0 - f * 1.4), P(a0 - f - 0.15, z0 - f * 1.4)], STONE);
  };
  // the planes of the two kinds of wall we see: L (y = p, a along x) and R (x = p, a along y)
  const PL = (p) => (a, z) => [a, p + 0.03, z], PR = (p) => (a, z) => [p + 0.03, a, z];
  // a wall's brick courses, white stone bands at the plinth, sills and floors, and quoins at its two ends
  const brickWall = (g, P, a0, a1, z0, z1, tone, o) => {
    o = o || {};
    const c = []; for (let z = z0 + 1.0; z < z1 - 0.3; z += 0.55) { const p = g.p.apply(g, P(a0 + 0.1, z)), q = g.p.apply(g, P(a1 - 0.1, z)); c.push(p[0], p[1], q[0], q[1]); }
    g.segs2(c, tone === 'r' ? '#8E4A40' : BRICKLINE, 0.16);
    const band = (za, zb) => g.fill([P(a0, za), P(a1, za), P(a1, zb), P(a0, zb)], tone === 'r' ? STONE_R : STONE);
    band(z0, z0 + 0.9); for (const z of (o.bands || [Z1 - 0.15, Z2 - 0.15])) band(z, z + 0.45);
    band(z1 - 0.75, z1);
    if (o.quoins !== false) for (const a of [a0, a1]) for (let z = z0 + 0.9, k = 0; z < z1 - 0.9; z += 0.7, k++) { const w = k % 2 ? 0.55 : 0.9, s = a === a0 ? 1 : -1; g.fill([P(a, z), P(a + s * w, z), P(a + s * w, z + 0.45), P(a, z + 0.45)], tone === 'r' ? STONE_R : STONE); }
  };
  // a cornice: a white projecting band at the eaves with a line of dentils
  const cornice = (g, P, a0, a1, z) => { g.fill([P(a0 - 0.2, z), P(a1 + 0.2, z), P(a1 + 0.2, z + 0.5), P(a0 - 0.2, z + 0.5)], STONE); const d = []; for (let a = a0 + 0.3; a < a1; a += 0.5) { const p = g.p.apply(g, P(a, z - 0.05)), q = g.p.apply(g, P(a, z - 0.3)); d.push(p[0], p[1], q[0], q[1]); } g.segs2(d, '#BDB4A2', 0.3); g.line([P(a0 - 0.2, z), P(a1 + 0.2, z)], { w: 0.3, c: '#8C8576', boil: false }); };
  // a dormer on a roof slope facing +y: a little box with a pediment and a window, at (x, y) on the slope at height z
  const dormer = (g, x, y, z, w, h) => {
    K.box(g, x - w / 2, y - 1.2, x + w / 2, y, z, z + h, { t: '#E7E1D4', l: STONE, r: STONE_R }, { w: 0.4 });
    g.fill([[x - w / 2 - 0.2, y + 0.02, z + h], [x + w / 2 + 0.2, y + 0.02, z + h], [x, y + 0.02, z + h + 0.9]], STONE); g.outline([[x - w / 2 - 0.2, y + 0.02, z + h], [x + w / 2 + 0.2, y + 0.02, z + h], [x, y + 0.02, z + h + 0.9]], { w: 0.35, c: '#8C8576', boil: false });
    g.fill([[x - w / 2 - 0.2, y, z + h], [x, y, z + h + 0.9], [x, y - 1.3, z + h + 0.9], [x - w / 2 - 0.2, y - 1.3, z + h]], SLATE);
    const q = [[x - w * 0.28, y + 0.04, z + 0.3], [x + w * 0.28, y + 0.04, z + 0.3], [x + w * 0.28, y + 0.04, z + h - 0.25], [x - w * 0.28, y + 0.04, z + h - 0.25]]; g.fill(q, PANE); g.mark({ win: true }); g.outline(q, { w: 0.25, c: '#2F3740', boil: false });
  };
  // the bays of a three-storey front: arched windows on the ground floor, tall ones on the first, smaller above
  const bays = (g, P, a0, a1, n, o) => {
    o = o || {};
    for (let i = 0; i < n; i++) {
      const m = lerp(a0, a1, (i + 0.5) / n), hw = Math.min(0.62, (a1 - a0) / n * 0.24), door = o.door && o.door(i);
      if (door) winP(g, P, m - hw * 1.7, m + hw * 1.7, 0.9, Z1 + 0.2, { arch: true, key: true, col: '#5A4636', lit: 1 });
      else winP(g, P, m - hw, m + hw, 1.5, Z1 - 0.7, { arch: true, key: true });
      winP(g, P, m - hw, m + hw, Z1 + 0.85, Z2 - 0.7, { arch: !!o.archUp });
      winP(g, P, m - hw * 0.9, m + hw * 0.9, Z2 + 0.8, ZE - 1.35, {});
    }
  };
  // a regular octagon of circumradius R round (cx, cy): its corners, and its faces we can see
  const octo = (cx, cy, R) => { const v = []; for (let k = 0; k < 8; k++) { const a = Math.PI / 8 + k * Math.PI / 4; v.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); } return v; };
  const OCT_VIS = [7, 0, 1];                                                    // the faces looking +x, +x+y, +y
  const octTone = (k, c) => { const ph = (k + 1) * Math.PI / 4, nx = Math.cos(ph), ny = Math.sin(ph); return mix(c.l, c.r, clamp(0.5 + 0.5 * (nx - ny), 0, 1)); };
  const octPlane = (v, k) => { const A = v[k], B = v[(k + 1) % 8], L = Math.hypot(B[0] - A[0], B[1] - A[1]), ux = (B[0] - A[0]) / L, uy = (B[1] - A[1]) / L; const ph = (k + 1) * Math.PI / 4, ox = Math.cos(ph) * 0.03, oy = Math.sin(ph) * 0.03; return { L, P: (a, z) => [A[0] + ux * a + ox, A[1] + uy * a + oy, z] }; };
  const octPrism = (g, v, z0, z1, col, w) => {
    for (const k of OCT_VIS) { const A = v[k], B = v[(k + 1) % 8]; g.fill([[A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1]], octTone(k, col)); }
    g.fill(v.map((p) => [p[0], p[1], z1]), col.t);
    const ln = { w: w || 0.8, boil: false };
    g.line([7, 0, 1, 2].map((k) => [v[k][0], v[k][1], z0]), ln); for (const k of [7, 0, 1, 2]) g.line([[v[k][0], v[k][1], z0], [v[k][0], v[k][1], z1]], Object.assign({}, ln, { w: ln.w * (k === 0 || k === 1 ? 0.7 : 1) }));
    g.line(v.concat([v[0]]).map((p) => [p[0], p[1], z1]), Object.assign({}, ln, { w: ln.w * 0.8 }));
  };
  /* an octagonal dome of circumradius R and height h on (cx, cy, z0): eight slate facets in horizontal courses, bronze
     ribs on the hips, eyebrow dormers on the faces we see */
  const octDome = (g, cx, cy, R, z0, h, o) => {
    o = o || {}; const n = 9, ring = (t) => { const r = R * Math.pow(Math.cos(t * Math.PI / 2), 0.78), z = z0 + h * Math.sin(t * Math.PI / 2); return octo(cx, cy, Math.max(r, 0.01)).map((p) => [p[0], p[1], z]); };
    const rings = []; for (let i = 0; i <= n; i++) rings.push(ring(i / n));
    const order = [0, 1, 2, 3, 4, 5, 6, 7].sort((a, b) => { const d = (k) => Math.cos((k + 1) * Math.PI / 4) + Math.sin((k + 1) * Math.PI / 4); return d(a) - d(b); });
    for (const k of order) {
      const vis = OCT_VIS.indexOf(k) >= 0, col = vis ? octTone(k, { l: '#6A707C', r: SLATE_D }) : shade(SLATE_D, 0.08), k2 = (k + 1) % 8;
      const strip = []; for (let i = 0; i <= n; i++) strip.push(rings[i][k]); for (let i = n; i >= 0; i--) strip.push(rings[i][k2]);
      g.fill(strip, col);
      if (vis) { const c = []; for (let i = 1; i < n; i++) { const p = g.p.apply(g, rings[i][k]), q = g.p.apply(g, rings[i][k2]); c.push(p[0], p[1], q[0], q[1]); } g.segs2(c, '#3B4458', 0.22); }
    }
    for (const k of [7, 0, 1, 2]) g.line(rings.map((r) => r[k]), { w: k === 0 || k === 1 ? 0.55 : 0.75, c: k === 0 || k === 1 ? BRONZE : '#2C3140', boil: false });
    // eyebrow dormers: a little arched window with a curved hood on each face we see, two tiers
    for (const k of OCT_VIS) for (const [t, s] of [[0.24, 1], [0.55, 0.62]]) {
      const A = rings[Math.round(t * n)][k], B = rings[Math.round(t * n)][(k + 1) % 8], m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, A[2]], ph = (k + 1) * Math.PI / 4, ux = -Math.sin(ph), uy = Math.cos(ph);
      const P = (a, z) => [m[0] + ux * a + Math.cos(ph) * 0.25, m[1] + uy * a + Math.sin(ph) * 0.25, m[2] + z], w = 0.75 * s, hh = 1.4 * s;
      const hood = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * i / 8; hood.push(P(Math.cos(a) * (w + 0.35), hh * 0.55 + Math.sin(a) * (w + 0.45))); }
      g.fill([P(w + 0.35, 0)].concat(hood, [P(-w - 0.35, 0)]), shade(SLATE_D, -0.12));
      winP(g, P, -w, w, 0.1, hh, { arch: true, frame: 0.2, fc: STONE, sill: false });
      g.line(hood, { w: 0.35, c: '#2C3140', boil: false });
    }
    return rings[n][0];
  };

  /* ---------------- the building ---------------- */
  // the wings, each with a slate hip roof carrying dormers
  const wing = (x0, x1) => T.obj([x0, YB, x1, YF], function (g) {
    g.boilP = 0.3;
    K.box(g, x0, YB, x1, YF, 0, ZE, BR, { w: 0.9 });
    brickWall(g, PL(YF), x0, x1, 0, ZE, 'l', { quoins: false });
    bays(g, PL(YF), x0, x1, Math.round((x1 - x0) / 2.4), { archUp: true });
    cornice(g, PL(YF), x0, x1, ZE);
    K.hip(g, x0 - 0.3, YB - 0.3, x1 + 0.3, YF + 0.3, ZC, 4.6, SLATE, { ridge: x1 - x0 - 2, w: 0.85 });
    { const t = []; for (let a = x0 + 0.6; a < x1; a += 0.7) { const p = g.p(a, YF + 0.3, ZC), q = g.p(a, (YF + YB) / 2 + 2, ZC + 4.0); t.push(p[0], p[1], q[0], q[1]); } g.segs2(t, '#4C5564', 0.18); }
    g.fill([[x0 - 0.3, YF + 0.3, ZE + 0.5], [x1 + 0.3, YF + 0.3, ZE + 0.5], [x1 + 0.3, YF + 0.3, ZC], [x0 - 0.3, YF + 0.3, ZC]], STONE);
    const nd = Math.round((x1 - x0) / 4.2); for (let i = 0; i < nd; i++) dormer(g, lerp(x0 + 1.4, x1 - 1.4, (i + 0.5) / nd), YF - 1.2, ZC + 0.9, 1.4, 1.6);
  }, { name: 'wing' });
  wing(-18.6, -7.5); wing(7.5, 18.6);

  // the central pavilion: a little deeper and taller, banded and quoined, under a steep hipped roof with iron cresting;
  // the carriage porch of the imperial entrance in white stone before it
  const CX0 = -7.5, CX1 = 7.5, CY0 = -36.5, CY1 = -19.0, CE = 16.2;
  T.obj([CX0, CY0, CX1, CY1], function (g) {
    g.boilP = 0.3;
    K.box(g, CX0, CY0, CX1, CY1, 0, CE, BR, { w: 0.95 });
    brickWall(g, PL(CY1), CX0, CX1, 0, CE, 'l'); brickWall(g, PR(CX1), CY0, CY1, 0, CE, 'r');
    bays(g, PL(CY1), CX0, CX1, 5, { door: (i) => i === 2 });
    bays(g, PR(CX1), CY1 - 2.6, CY1, 1, {});
    // pilasters of white stone up the front between the bays
    for (const a of [CX0 + 3, CX1 - 3]) g.fill([[a - 0.3, CY1 + 0.05, 0.9], [a + 0.3, CY1 + 0.05, 0.9], [a + 0.3, CY1 + 0.05, CE - 0.7], [a - 0.3, CY1 + 0.05, CE - 0.7]], STONE);
    cornice(g, PL(CY1), CX0, CX1, CE); cornice(g, PR(CX1), CY0, CY1, CE);
    // the steep roof, its flat top ringed by cresting
    const zr = CE + 0.5, hr = 7.8, top = 2.2;
    const R0 = [[CX0 - 0.3, CY0 - 0.3], [CX1 + 0.3, CY0 - 0.3], [CX1 + 0.3, CY1 + 0.3], [CX0 - 0.3, CY1 + 0.3]], cx = 0, cy = (CY0 + CY1) / 2;
    const R1 = R0.map(([x, y]) => [cx + (x - cx) * top / 7.8, cy + (y - cy) * (top + 4) / 9.0]);
    g.fill([[R0[0][0], R0[0][1], zr], [R0[3][0], R0[3][1], zr], [R1[3][0], R1[3][1], zr + hr], [R1[0][0], R1[0][1], zr + hr]], shade(SLATE, -0.04));
    g.fill([[R0[3][0], R0[3][1], zr], [R0[2][0], R0[2][1], zr], [R1[2][0], R1[2][1], zr + hr], [R1[3][0], R1[3][1], zr + hr]], shade(SLATE, -0.1));
    g.fill([[R0[2][0], R0[2][1], zr], [R0[1][0], R0[1][1], zr], [R1[1][0], R1[1][1], zr + hr], [R1[2][0], R1[2][1], zr + hr]], shade(SLATE, 0.1));
    g.fill(R1.map(([x, y]) => [x, y, zr + hr]), '#6E7888');
    { const t = []; for (let a = 0.04; a < 1; a += 0.06) { const p = g.p(lerp(R0[3][0], R0[2][0], a), R0[3][1], zr), q = g.p(lerp(R1[3][0], R1[2][0], a), R1[3][1], zr + hr); t.push(p[0], p[1], q[0], q[1]); } g.segs2(t, '#4C5564', 0.18); }
    const ln = { w: 0.85, boil: false };
    g.line([[R0[3][0], R0[3][1], zr], [R0[2][0], R0[2][1], zr], [R0[1][0], R0[1][1], zr]], ln); g.line([[R0[3][0], R0[3][1], zr], [R1[3][0], R1[3][1], zr + hr]], ln); g.line([[R0[1][0], R0[1][1], zr], [R1[1][0], R1[1][1], zr + hr]], ln); g.line([[R0[2][0], R0[2][1], zr], [R1[2][0], R1[2][1], zr + hr]], { w: 0.6, c: BRONZE, boil: false });
    g.line(R1.concat([R1[0]]).map(([x, y]) => [x, y, zr + hr]), { w: 0.6, boil: false });
    { const c = []; const run = (A, B) => { const n = Math.round(Math.hypot(B[0] - A[0], B[1] - A[1]) / 0.45); for (let i = 0; i <= n; i++) { const t = i / n, p = g.p(lerp(A[0], B[0], t), lerp(A[1], B[1], t), zr + hr), q = g.p(lerp(A[0], B[0], t), lerp(A[1], B[1], t), zr + hr + (i % 2 ? 0.7 : 1.1)); c.push(p[0], p[1], q[0], q[1]); } const p = g.p(A[0], A[1], zr + hr + 0.7), q = g.p(B[0], B[1], zr + hr + 0.7); c.push(p[0], p[1], q[0], q[1]); }; run(R1[3], R1[2]); run(R1[2], R1[1]); g.segs2(c, '#2C3140', 0.3); }
    // a pediment over the middle with a round window
    { const P = PL(CY1 + 0.35), a = -3.2, b = 3.2, z = CE + 0.5; g.fill([P(a, z - 0.1), P(b, z - 0.1), P(b, z + 0.6), P(a, z + 0.6)], BR.l); g.fill([P(a, z), P(b, z), P(0, z + 2.4)], BR.l); g.outline([P(a, z), P(b, z), P(0, z + 2.4)], { w: 0.5, c: '#5A3A30', boil: false }); g.line([P(a - 0.2, z), P(0, z + 2.6), P(b + 0.2, z)], { w: 1.4, c: STONE, boil: false }); const c = g.p.apply(g, P(0, z + 1.0)); g.disc2(c, 2.4, STONE); g.disc2(c, 1.7, PANE); g.mark({ win: 1 }); g.ring2(c, 1.7, { c: '#2F3740', w: 0.3 }); g.segs2([c[0] - 1.7, c[1], c[0] + 1.7, c[1], c[0], c[1] - 1.7, c[0], c[1] + 1.7], '#E9E5DA', 0.3); }
    dormer(g, -3.6, CY1 - 1.5, zr + 1.2, 1.3, 1.6); dormer(g, 3.6, CY1 - 1.5, zr + 1.2, 1.3, 1.6);
  }, { name: 'centre' });
  // the carriage porch: three arches in front, one each side, a balustrade on top. An object of its own that people
  // pass through (under: below 7 u it covers whoever is inside it): the sweeper and the running salaryman go through
  // its side arches, a traveller turns in at its right-hand arch
  const px0 = -4.6, px1 = 4.6, py1 = -14.6;
  T.obj([px0, CY1, px1, py1], function (g) {
    g.boilP = 0.3;
    K.box(g, px0, CY1, px1, py1, 0, 6.4, ST, { w: 0.8 });
    for (const [a0, a1] of [[-4.0, -1.8], [-1.1, 1.1], [1.8, 4.0]]) { const r = (a1 - a0) / 2, m = (a0 + a1) / 2, pts = [[a0, py1 + 0.03, 0], [a1, py1 + 0.03, 0]]; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; pts.push([m + r * Math.cos(t), py1 + 0.03, 3.4 + r * Math.sin(t) * 0.9]); } g.fill(pts, '#4A3E36'); g.outline(pts, { w: 0.35, c: '#5A5046', boil: false }); }
    { const r = 1.1, m = (CY1 + py1) / 2, pts = [[px1 + 0.03, m - r, 0], [px1 + 0.03, m + r, 0]]; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; pts.push([px1 + 0.03, m + r * Math.cos(t), 3.4 + r * Math.sin(t) * 0.9]); } g.fill(pts, '#4A3E36'); g.outline(pts, { w: 0.35, c: '#5A5046', boil: false }); }
    g.fill(K.on('L', py1 + 0.04, px0, px1, 4.5, 4.8), '#E2DBCC'); TK.sign(g, 'L', py1, -2.4, 2.4, 4.95, 6.15, '#2F3740', { word: '東京駅', ink: '#E3C27A' });
    { const c = []; for (let a = px0 + 0.3; a < px1; a += 0.45) { const p = g.p(a, py1, 6.4), q = g.p(a, py1, 7.3); c.push(p[0], p[1], q[0], q[1]); } for (let b = py1 - 0.3; b > CY1; b -= 0.45) { const p = g.p(px1, b, 6.4), q = g.p(px1, b, 7.3); c.push(p[0], p[1], q[0], q[1]); } g.segs2(c, '#BDB4A2', 0.35); g.line([[px0, py1, 7.4], [px1, py1, 7.4], [px1, CY1, 7.4]], { w: 0.6, c: '#8C8576', boil: false }); }
  }, { name: 'centre porch', under: 7 });

  // the dome halls: three storeys on an octagon, entrance arch on the front, the dome, lantern and finial
  const DR = 7.6, DE = 16.4;
  const domeHall = (s) => {
    const cx = s * 26, cy = -27.5, v = octo(cx, cy, DR), x0 = s < 0 ? cx - DR : cx - 6.6, x1 = s < 0 ? cx + 6.6 : cx + DR;
    T.obj([s < 0 ? -33.6 : 18.6, cy - DR * 0.93, s < 0 ? -18.6 : 33.6, cy + DR * 0.93], function (g) {
      g.boilP = 0.3;
      octPrism(g, v, 0, DE, BR, 0.95);
      for (const k of OCT_VIS) {
        const { L, P } = octPlane(v, k), tone = k === 7 ? 'r' : 'l';
        brickWall(g, P, 0, L, 0, DE, tone);
        const m = L / 2;
        if (k === 1) winP(g, P, m - 1.4, m + 1.4, 0.9, Z1 + 0.6, { arch: true, key: true, col: '#5A4636', lit: 1 });      // the entrance
        else winP(g, P, m - 0.75, m + 0.75, 1.5, Z1 - 0.5, { arch: true, key: true });
        winP(g, P, m - 0.7, m + 0.7, Z1 + 0.9, Z2 - 0.6, { arch: true, key: true });
        winP(g, P, m - 0.6, m + 0.6, Z2 + 0.85, ZE - 1.35, {}); winP(g, P, m - 0.45, m + 0.45, ZE + 0.1, DE - 0.9, { arch: true, frame: 0.25 });
        cornice(g, P, 0, L, DE);
      }
      // the attic ring and its little round windows, then the dome
      octPrism(g, octo(cx, cy, DR - 0.4), DE + 0.5, DE + 1.9, ST, 0.6);
      for (const k of OCT_VIS) { const { L, P } = octPlane(octo(cx, cy, DR - 0.4), k), c = g.p.apply(g, P(L / 2, DE + 1.2)); g.disc2(c, 1.15, PANE); g.mark({ win: true }); g.ring2(c, 1.15, { c: '#8C8576', w: 0.35 }); }
      const top = octDome(g, cx, cy, DR - 0.6, DE + 1.9, 10.4);
      // the lantern: an open octagon of arches, a small slate cap, a bronze ball and finial
      const lv = octo(cx, cy, 1.5), zl = DE + 1.9 + 10.4 - 0.3;
      octPrism(g, lv, zl, zl + 2.2, ST, 0.5);
      for (const k of OCT_VIS) { const { L, P } = octPlane(lv, k); winP(g, P, L / 2 - 0.35, L / 2 + 0.35, zl + 0.3, zl + 1.8, { arch: true, frame: 0, sill: false, col: '#2F3740' }); }
      K.dome(g, cx, cy, 1.7, zl + 2.2, 1.6, SLATE_D, { w: 0.5 });
      const b = g.p(cx, cy, zl + 3.9), t = g.p(cx, cy, zl + 6.2);
      g.disc2(b, 0.75, BRONZE); g.ring2(b, 0.75, { c: '#6E5A3A', w: 0.3 });
      g.fill2([[b[0] - 0.35, b[1] - 0.5], [b[0] + 0.35, b[1] - 0.5], [t[0], t[1]]], BRONZE); g.line2([[b[0], b[1] - 0.5], t], { w: 0.35, c: '#6E5A3A', boil: false });
      void top;
    }, { name: s < 0 ? 'north dome' : 'south dome', tall: true });
  };
  domeHall(-1); domeHall(1);

  // the end blocks beyond the domes, lower, under hipped roofs
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -H + 0.4 : 33.6, x1 = s < 0 ? -33.6 : H - 0.4, y0 = -33, y1 = -22.5;
    T.obj([x0, y0, x1, y1], function (g) {
      g.boilP = 0.3;
      K.box(g, x0, y0, x1, y1, 0, ZE - 0.6, BR, { w: 0.85 });
      brickWall(g, PL(y1), x0, x1, 0, ZE - 0.6, 'l', { quoins: false });
      bays(g, PL(y1), x0, x1, 1, {});
      if (s > 0) { brickWall(g, PR(x1), y0, y1, 0, ZE - 0.6, 'r'); bays(g, PR(x1), y0, y1, 4, {}); }
      cornice(g, PL(y1), x0, x1, ZE - 0.6); if (s > 0) cornice(g, PR(x1), y0, y1, ZE - 0.6);
      K.hip(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, ZE - 0.1, 3.6, SLATE, { ridge: 3, w: 0.8 });
    }, { name: 'end' });
  }
  // the building lit up at night: the brick warm under the floodlights, the stone pale gold
  // (marked on every fill in the building's objects through the colours they use)
  const LITB = { [BR.l]: '#C9705A', [BR.r]: '#A85A48', [BR.t]: '#B8705E', [STONE]: '#F2DDB4', [STONE_R]: '#D9C29A' };
  for (const ob of T.objs) { if (!/wing|centre|dome|end/.test(ob.name)) continue; const fn = ob.fn; ob.fn = (g) => { const i0 = g.cmds.length; fn(g); g.mark({ nc: (c) => LITB[c] }, i0); }; }

  /* ---------------- the square ---------------- */
  // lamps along the central walk and the apron, benches by the lawns, planters, the post box, bollards
  for (const y of [-12, -3, 6]) for (const x of [-5.6, 5.6]) T.obj([x, y], (g) => K.lamp(g, x, y, { h: 7.4, n: 1 }), { on: true });
  // flower beds along the lawns' ends, a low clipped hedge along their outer sides
  for (const [x0, x1] of [[-13, -6.2], [6.2, 13]]) for (const [y0, y1] of [[-10, -8.4], [7.4, 9]]) T.obj([x0, y0, x1, y1], (g) => { g.fill(K.rect(x0, y0, x1, y1, 0.02), '#8A6A4A'); K.blooms(g, x0, y0, x1, y1, 0, ['#F3F1EA', '#E9806A', '#F2C6D0', '#E9C543', '#C95A8A'], { sp: 1.1, r: 1.2 }); });
  for (const [x, y0, y1] of [[-13.6, -10, -6.4], [-13.6, -2.6, 1.6], [-13.6, 5.4, 9], [12.9, -10, 9]]) T.obj([x, y0, x + 0.7, y1], (g) => K.hedge(g, x, y0, x + 0.7, y1, 1.4, { col: '#7FA563' }));
  for (const y of [18, 30]) for (const x of [-10.2, 10.2]) T.obj([x, y], (g) => K.lamp(g, x, y, { h: 7.4, n: 1 }), { on: true });
  // a coffee van at the corner of the square, its awning out; bicycles by the kōban; the square's map board
  T.obj([11.5, 25.5, 17.5, 30.6], function (g) {
    K.box(g, 12.2, 26.0, 16.4, 29.0, 0.5, 1.0, { t: '#5A564E', l: '#6E6A64', r: '#5A564E' }, { w: 0.5 });
    for (const x of [13.0, 15.6]) { const c = g.p(x, 29.05, 0.75); g.disc2(c, 1.9, '#3A3632'); g.disc2(c, 0.8, '#B9B4A8'); }
    K.box(g, 12.0, 25.8, 16.6, 29.2, 1.0, 5.2, { t: '#E9E5DA', l: '#F6F3EC', r: '#DCD6C8' }, { w: 0.7 });
    K.win(g, 'L', 29.2, 12.6, 15.9, 2.4, 4.2, { style: 'glass', col: '#E9C48A', lit: true });
    TK.awning(g, 'L', 29.2, 12.3, 16.3, 4.8, 1.4, '#3F7F5A', { stripe: '#F3F1EA', drop: 0.7 });
    TK.sign(g, 'R', 16.6, 26.2, 28.8, 2.4, 4.0, '#3F7F5A', { word: 'コーヒー', ink: '#F6F3EA' });
  }, { name: 'coffee van' });
  for (let i = 0; i < 4; i++) { const x = 31 + i * 1.4, y = 22.6; T.obj([x, y], (g) => parked(g, x, y, Math.PI / 2 - 0.2, ['#C9584B', '#5A6B5A', '#3F5F8F', '#E6C24F'][i]), { on: true }); }
  T.obj([-9.2, -12.6], (g) => { const a = g.p(-9.2, -12.6, 0), b = g.p(-9.2, -12.6, 2.6); g.segs2([a[0] - 1.2, a[1], b[0] - 1.2, b[1], a[0] + 1.2, a[1], b[0] + 1.2, b[1]], '#5A564E', 0.45); K.box(g, -9.6, -13.4, -8.8, -11.8, 2.6, 5.4, { t: '#2F3F6A', l: '#F3F1EA', r: '#2F3F6A' }, { w: 0.5 }); K.text(g, 'L', -11.8, -9.2, 4.4, 0.5, 'TOKYO', '#2F3F6A', { center: true }); K.text(g, 'L', -11.8, -9.2, 3.4, 0.45, 'STATION', '#2F3F6A', { center: true }); }, { on: true });
  for (const x of [-24, 24]) T.obj([x, -16.5], (g) => K.lamp(g, x, -16.5, { h: 7.6, n: 3 }), { on: true });
  for (const [x, y] of [[-13.4, -4.5], [-13.4, 3.5], [6.0, -6.6], [6.0, 1.5]]) T.obj([x, y], (g) => K.bench(g, x, y, { face: 'R', L: 1.7 }), { on: true });
  for (const [x, y] of [[-6.4, 10.8], [6.4, 10.8], [-12.4, 10.8], [12.4, 10.8]]) T.obj([x, y], (g) => { K.cyl(g, x, y, 1.2, 0, 1.3, { t: '#8A7A5A', l: '#D9D3C4', r: '#C6BFAE' }, { w: 0.5, n: 10 }); K.bush(g, x, y, { r: 1.0, col: '#7FA563', z: 1.2 }); }, { on: true });
  T.obj([-15.6, -13.0], (g) => { K.cyl(g, -15.6, -13.0, 0.85, 0, 3.6, { t: '#C9463E', l: '#D4553A', r: '#B9432C' }, { w: 0.55, n: 10 }); K.dome(g, -15.6, -13.0, 0.95, 3.6, 0.7, '#B9432C', { w: 0.5 }); const p = g.p(-15.6, -12.15, 2.7); g.fill2([[p[0] - 0.9, p[1]], [p[0] + 0.9, p[1]], [p[0] + 0.9, p[1] - 0.35], [p[0] - 0.9, p[1] - 0.35]], '#2A2622', true); }, { on: true });
  for (const s of [-1, 1]) { const bl = []; for (let x = -13; x <= 13; x += 2.6) if (Math.abs(x) > 5.5 && Math.sign(x) === s) bl.push(x); T.obj([s < 0 ? -13.3 : 7.5, -14.3, s < 0 ? -7.5 : 13.3, -13.7], (g) => { for (const x of bl) K.cyl(g, x, -14, 0.3, 0, 1.1, { t: '#8C8576', l: '#A9A296', r: '#8C8576' }, { w: 0.35, n: 8 }); }); }
  // the ginkgo of Gyōkō-dōri, and of the traffic islands
  for (const y of [15.5, 21.5, 27.5, 33.5]) for (const x of [-7.6, 7.6]) T.obj([x, y], (g) => K.tree(g, x, y, TK.leaves({ r: 3.0, h: 4.8, col: y < 22 ? C.leafL : '#A9C766', ink: '#5E7A30' }, 'ginkgo')), { on: true });
  for (const s of [-1, 1]) for (const [x, y] of [[s * 27.5, -4.5], [s * 23.5, 1.5]]) T.obj([x, y], (g) => K.tree(g, x, y, TK.leaves({ r: 2.8, h: 4.4, col: C.leafL, ink: '#5E7A30' }, 'ginkgo')), { on: true });
  // the front-left garden: trees, benches; the kōban on the front right with its red lamp
  for (const [x, y] of [[-30, 18.5], [-17, 31], [-31, 31]]) T.obj([x, y], (g) => K.tree(g, x, y, TK.leaves({ r: 3.6, h: 5, col: C.leaf }, 'zelkova', Math.round(x + y))), { on: true });
  for (const [x, y] of [[-24, 22], [-19, 22]]) T.obj([x, y], (g) => K.bench(g, x, y, { face: 'L', L: 1.6 }), { on: true });
  for (const [x, y] of [[35.4, 18.2], [35, 31.5], [35, 13.5], [20.5, 35.2]]) T.obj([x, y], (g) => K.tree(g, x, y, TK.leaves({ r: 3.4, h: 5, col: C.leaf }, 'zelkova', x === 35.4 ? 93 : Math.round(x * 2 + y))), { on: true });
  for (const [x, y] of [[24.5, 31.5], [31.5, 31.5]]) T.obj([x, y], (g) => K.bench(g, x, y, { face: 'L', L: 1.6 }), { on: true });
  T.obj([22, 15, 30, 21], function (g) {
    g.boilP = 0.3;
    K.box(g, 22.5, 15.5, 29.5, 20.5, 0, 6.2, { t: '#D9D5CB', l: '#F1EEE6', r: '#DCD8CE' }, { w: 0.8 });
    g.fill(K.on('L', 20.52, 22.5, 29.5, 0, 1.0), '#B9B3A6');
    K.win(g, 'L', 20.5, 23.3, 25.6, 1.2, 4.4, { style: 'glass', col: '#E9D3A6', lit: true });
    K.win(g, 'L', 20.5, 26.4, 28.8, 2.0, 4.4, { style: 'glass' });
    K.sign(g, 'L', 20.5, 23.0, 29.0, 4.8, 5.9, '#2F3F6A', 'KOBAN', { ink: '#FBF8EE' });
    K.box(g, 22.2, 15.2, 29.8, 20.8, 6.2, 6.7, { t: '#C9C4B9', l: '#E3DFD6', r: '#CFCAC0' }, { w: 0.6 });
    const c = g.p(24.4, 20.8, 5.3); g.disc2(c, 0.75, '#D23F33'); g.mark({ nc: '#FF5A48', light: true }); g.ring2(c, 0.75, { c: '#6E241C', w: 0.3 }); g.glow2('lantern', c, g.p(24.4, 20.8, 0), { r: 2.4, col: '#FF5A48' });
  }, { name: 'koban' });
  // the yellow sightseeing bus waiting in the south plaza
  T.obj([24, -12.9, 34, -8.1], (g) => g.at(29, -10.5, 0, (g2) => K.bus(g2, Math.PI, { col: '#F3E3A0', band: '#E6B53A', n: 4, L: 5.0, W: 2.4, h: 5.4 })), { name: 'bus' });
  // the taxi rank: tall dark cabs queued along the north plaza's lane, nose to the station
  for (const y of [-6.5, 4.5]) T.obj([-19.65, y - 5, -14.75, y + 5], (g) => g.at(-17.2, y, 0, (g2) => TK.taxi(g2, -Math.PI / 2)), { name: 'taxi' });
  T.obj([-20, -18.6, -14.4, -16.6], (g) => { K.box(g, -20, -18.6, -14.4, -16.6, 4.2, 4.6, { t: '#DCE3E6', l: '#C3D6E0', r: '#A8BECB' }, { w: 0.5 }); for (const x of [-19.6, -14.8]) { const a = g.p(x, -16.8, 0), b = g.p(x, -16.8, 4.2); g.line2([a, b], { w: 0.5, c: '#5A564E', boil: false }); } K.sign(g, 'L', -16.6, -19.4, -15, 4.6, 5.4, '#2F3F6A', 'TAXI', { ink: '#FBF8EE' }); }, { on: true });
  // winter: kadomatsu either side of the porch and the dome doors
  for (const [x, y] of [[-5.6, -13.8], [5.6, -13.8], [-30.2, -19.0], [-23.4, -18.4], [23.4, -18.4], [30.2, -19.0]]) T.obj([x, y], (g) => TK.kadomatsu(g, x, y), { on: true, season: 'winter' });

  /* ---------------- the living layer ---------------- */
  // travellers rolling their cases to and from the dome doors and the square
  const roll = (who, pts, speed, ph, col) => {
    const seg = [], L = [0]; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    const tot = L[L.length - 1];
    T.actor({ sample: 0.25, period: tot / speed,
      at(t) { let d = ((t * speed + ph * tot) % tot + tot) % tot, i = 0; while (i < seg.length - 1 && d > L[i + 1]) i++; const [a, b] = seg[i], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1], dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), f = Math.floor((d / 2.4) % 1 * 8); return { x: a[0] + dx * u, y: a[1] + dy * u, key: dir + '.' + f, dir, f }; },
      draw(g, st) {
        const trail = st.dir === 0 || st.dir === 3 ? -1 : 1, behind = st.dir >= 2;
        const F = g.p(0, 0, 0), bag = () => { const h = [F[0] + trail * 2.6, F[1] - 1.0], c = [h[0] + trail * 1.4, h[1] + 0.6]; g.fill2([[c[0] - 1.25, c[1]], [c[0] + 1.25, c[1]], [c[0] + 1.25, c[1] - 3.6], [c[0] - 1.25, c[1] - 3.6]], col, true); g.fill2([[c[0] + 0.5, c[1]], [c[0] + 1.25, c[1]], [c[0] + 1.25, c[1] - 3.6], [c[0] + 0.5, c[1] - 3.6]], shade(col, 0.15), true); g.outline2([[c[0] - 1.25, c[1]], [c[0] + 1.25, c[1]], [c[0] + 1.25, c[1] - 3.6], [c[0] - 1.25, c[1] - 3.6]], { w: 0.32, boil: false }); g.disc2([c[0] - 0.8, c[1] + 0.2], 0.35, '#2A2622'); g.disc2([c[0] + 0.8, c[1] + 0.2], 0.35, '#2A2622'); return c; };
        let c; if (behind) c = bag();
        const r = TK.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.f / 8 }));
        if (!behind) c = bag();
        const h = r.hands[0]; g.line2([[h[0], h[1]], [c[0], c[1] - 3.6], [c[0], c[1] - 5.2]], { w: 0.35, c: '#3A3530', boil: false });
      } });
  };
  // (each on a lane of its own: the central walk carries nine lanes a metre apart, the apron its rows; no route runs
  // through a taxi, the bus, a bench, a lawn, the bollards or a standing group)
  roll(TK.who(4010), [[-26, -19.2], [-26, -13.0], [-21.4, -13.0], [-26, -13.0]], 1.7, 0, '#E6C24F');                  // north door to the taxi rank
  roll(TK.salary(4011), [[2.9, 36], [2.9, -17.3], [26, -17.3], [26, -19.2], [26, -17.3], [2.9, -17.3]], 2.0, 0.3, '#3B3F47');   // in at the porch's right arch, out at its side arch
  roll(TK.who(4012, { cap: '#3F5F8F' }), [[-2.4, -13.6], [-2.4, 36]], 1.6, 0.6, '#C9584B');
  roll(TK.kimono(4013), [[0.6, 36], [0.6, -13.6]], 1.5, 0.85, '#E7A9A0');
  roll(TK.who(4014), [[16.2, -14.6], [16.2, 11]], 1.6, 0.2, '#5F8FC9');
  roll(TK.who(4015, { k: 0.95 }), [[-14.2, -14.6], [-24.4, -14.6]], 1.4, 0.5, '#8FBF73');
  // a salaryman running for his train; office workers crossing the square; a cyclist on the avenue
  K.walker(T, TK.salary(4020, { lean: 1.2 }), [[-33, -15.6], [-6, -15.6], [-4.6, -16.2], [4.6, -16.2], [6, -15.6], [33, -15.6], [6, -15.6], [4.6, -16.2], [-4.6, -16.2], [-6, -15.6]], 5.0, { phase: 0.1 });
  for (let i = 0; i < 3; i++) K.walker(T, i === 1 ? TK.who(4031) : TK.salary(4030 + i), [[[-4.4, -1.4, 1.7][i], 36], [[-4.4, -1.4, 1.7][i], -13.5]], 1.7 + i * 0.15, { phase: i * 0.31 });
  K.walker(T, TK.who(4034), [[14.6, 12.4], [14.6, -13.8], [35.2, -13.8], [35.2, 12.4]], 1.5, { phase: 0.4 });   // round the bus, not through it
  // two businessmen meeting: they bow, talk, bow again, laugh
  { const A = TK.salary(4040), B = TK.salary(4041, { tie: '#3F5F8F' }), seq = [['bow', 2.2], ['talk', 3.0], ['laugh', 1.2], ['talk', 2.6], ['bow', 2.0], ['look', 2.4]], per = seq.reduce((s, q) => s + q[1], 0);
    const step = (t) => { t = ((t % per) + per) % per; let k = 0, s = 0; while (k < seq.length - 1 && t >= s + seq[k][1]) { s += seq[k][1]; k++; } const a = seq[k][0], A2 = TK.ACTS[a], i = Math.floor((t - s) * A2.rate) % A2.n, who = Math.floor((t - s) / 1.3) % 2; return { a, i, who }; };
    [[A, -8.4], [Object.assign({}, B, { dir: 2 }), -6.4]].forEach(([man, x], j) => T.actor({ sample: 0.25, period: per,
      at(t) { const S = step(t), a = S.a === 'talk' ? (S.who ? ['talk', 'listen'] : ['listen', 'talk'])[j] : S.a; return { x, y: -11.0, key: a + (a === S.a ? S.i : 0), a, i: a === S.a ? S.i : 0 }; },
      draw(g, st) { TK.doing(g, man, st.a, st.i, 0, 0, 0); } })); }
  // friends meeting by the lawn: one has just arrived and waves, the others laugh
  TK.group(T, [{ who: TK.who(4050, { dir: 0 }), x: -11.0, y: 9.6 }, { who: TK.who(4051, { dir: 3 }), x: -9.4, y: 11.4 }, { who: TK.kimono(4052, { dir: 2 }), x: -7.8, y: 9.6 }], { seed: 12, laughs: 0.6 });
  TK.idle(T, TK.who(4053, { dir: 2 }), -5.8, 12.4, { acts: ['wave', 'wave', 'laugh', 'talk'], seed: Math.round(-6.6 * 131 + 11.4 * 977 + 7) });
  // photographs with the station behind, and of the façade itself
  TK.photo(T, { who: TK.who(4060, { dir: 3 }), x: -9.4, y: 4.4 }, [{ who: TK.who(4061, { dir: 1 }), x: -11.2, y: -1.2 }, { who: TK.who(4062, { dir: 1, cap: '#C9584B' }), x: -9.5, y: -1.6 }, { who: TK.kimono(4063, { dir: 1 }), x: -7.8, y: -1.2 }], { seed: 2 });
  TK.photo(T, { who: TK.who(4064, { dir: 3 }), x: 21.0, y: 9.0 }, [{ who: TK.who(4065, { dir: 1 }), x: 21.4, y: 5.6 }, { who: TK.who(4066, { dir: 1 }), x: 23.0, y: 5.6 }], { seed: 5 });
  TK.idle(T, TK.who(4067, { dir: 3 }), -16.4, 12.6, { acts: ['photo', 'photo', 'look', 'point'], lookTo: 3, seed: Math.round(-16.4 * 131 + 13.6 * 977 + 7) });
  TK.idle(T, TK.who(4068, { dir: 3, cap: '#E6C24F' }), 10.2, -12.6, { acts: ['photo', 'scroll', 'photo', 'look'] });
  // at the coffee van: the barista, two customers
  TK.idle(T, TK.who(4130, { dir: 1, top: '#3F7F5A', cap: '#3F7F5A' }), 14.2, 31.2, { acts: ['talk', 'rest', 'look'], seed: Math.round(14.0 * 131 + 28.4 * 977 + 7) });
  TK.idle(T, TK.salary(4131, { dir: 3, cup: '#F3F1EA' }), 13.0, 32.4, { acts: ['drink', 'scroll', 'drink', 'look'] });
  TK.idle(T, TK.who(4132, { dir: 3, cup: '#C98A4A' }), 15.4, 32.8, { acts: ['drink', 'talk', 'laugh', 'drink'] });
  // on the benches
  TK.idle(T, TK.salary(4070, { dir: 0, sit: true, food: '#F3F1EA' }), -12.6, -4.5, { acts: ['eat', 'eat', 'scroll', 'drink'] });
  TK.idle(T, TK.who(4071, { dir: 0, sit: true }), 6.8, 1.5, { acts: ['scroll', 'rest', 'look', 'drink'] });
  TK.idle(T, TK.who(4072, { dir: 1, sit: true }), -24, 22.8, { acts: ['talk', 'laugh', 'look', 'eat'], seed: 3 });
  TK.idle(T, TK.who(4073, { dir: 1, sit: true }), -19, 22.8, { acts: ['scroll', 'rest', 'drink'] });
  TK.group(T, [{ who: TK.who(4074, { dir: 0, sit: true }), x: 23.8, y: 32.3 }, { who: TK.who(4075, { dir: 2, sit: true }), x: 25.4, y: 32.3 }], { seed: 17 });
  TK.idle(T, TK.salary(4076, { dir: 1, sit: true }), 31.5, 32.3, { acts: ['scroll', 'phone', 'rest', 'drink'] });
  // the kōban: a policeman at the door, a visitor asking the way
  const POLICE = TK.who(4080, { top: '#2F3F6A', bot: '#2F3F6A', cap: '#2F3F6A', shoe: '#2A2622', jacket: undefined, coat: false, muffler: undefined, higasa: undefined, dress: undefined });
  TK.group(T, [{ who: POLICE, x: 26.6, y: 22.6, idle: 'point' }, { who: TK.who(4081, { dir: 3 }), x: 26.8, y: 25.4 }], { seed: 14 });
  // the sweeper working slowly across the apron with a long broom
  { const W = TK.who(4090, { top: '#5A6B5A', bot: '#3B3F47', cap: '#E6C24F' }), x0 = -13.4, x1 = -5.6, per = 40;
    T.actor({ sample: 0.25, period: per,
      at(t) { t = ((t % per) + per) % per; const u = t / per, back = u > 0.5, x = back ? lerp(x1, x0, (u - 0.5) * 2) : lerp(x0, x1, u * 2), i = Math.floor(t * 1.6) % 2; return { x, y: -17.6, key: (back ? 'b' : 'f') + i, back, i }; },
      draw(g, st) { const r = TK.doing(g, Object.assign({}, W, { dir: st.back ? 2 : 0 }), 'sweep', st.i, 0, 0, 0), h = r.hands[1], e = [h[0] + (st.back ? -1 : 1) * (st.i ? 2.2 : 0.8), h[1] + 6.2]; g.line2([r.hands[0], e], { w: 0.4, c: '#8A6A4A', boil: false }); g.fill2([[e[0] - 1.4, e[1] + 0.3], [e[0] + 1.4, e[1] + 0.3], [e[0] + 0.8, e[1] - 1.0], [e[0] - 0.8, e[1] - 1.0]], '#C9A26B', true); } }); }
  // the taxi driver loading a traveller's case into the boot of the front cab
  { const D = TK.who(4100, { top: '#F3F1EA', bot: '#2F3F6A', cap: '#2F3F6A' }), P = TK.who(4101, { dir: 1 }), per = 12;
    const step = (t) => { t = ((t % per) + per) % per; return { k: t < 3 ? 0 : t < 4.2 ? 1 : t < 7 ? 2 : 3, i: Math.floor(t * 2.6) % 4 }; };
    T.actor({ sample: 0.25, period: per,
      at(t) { const S = step(t); return { x: -20.2, y: -1.0, key: S.k + '.' + (S.k === 3 ? S.i : 0), k: S.k, i: S.i }; },
      draw(g, st) {
        const c = st.k === 0 ? g.p(0.6, 1.4, 0) : st.k === 1 ? g.p(0.9, 0.2, 1.8) : null;
        TK.doing(g, Object.assign({}, D, { dir: 3 }), st.k === 1 ? 'bow' : st.k === 3 ? 'talk' : 'rest', st.k === 3 ? st.i : 0, 0, 0, 0);
        if (c) { g.fill2([[c[0] - 1.3, c[1]], [c[0] + 1.3, c[1]], [c[0] + 1.3, c[1] - 3.6], [c[0] - 1.3, c[1] - 3.6]], '#7FA7CF', true); g.outline2([[c[0] - 1.3, c[1]], [c[0] + 1.3, c[1]], [c[0] + 1.3, c[1] - 3.6], [c[0] - 1.3, c[1] - 3.6]], { w: 0.32, boil: false }); }
      } });
    T.actor({ sample: 0.25, period: per,
      at(t) { const S = step(t); return { x: -21.4, y: 1.4, key: S.k, k: S.k }; },
      draw(g, st) { TK.doing(g, P, st.k === 2 ? 'bow' : st.k === 3 ? 'listen' : 'look', 0, 0, 0, 0); } }); }
  // a dog walk down the avenue's lawn, pigeons on the square
  TK.dogWalk(T, TK.who(4110), [[-11.4, 36], [-11.4, 14], [-33, 14], [-33, 35.5]], 1.4, '#3A3530', { phase: 0.2 });
  TK.pigeons(T, 10.4, -3.2, 7, { seed: 11, r: 2.0 });
  TK.pigeons(T, 11.0, -19.9, 4, { seed: 12, r: 1.2 });
  // the avenue: people strolling under the ginkgo, a couple, someone photographing the gold (autumn)
  for (let i = 0; i < 3; i++) K.walker(T, i === 0 ? TK.kimono(4120) : TK.who(4120 + i), [[[3.9, -0.4, -3.4][i], -13], [[3.9, -0.4, -3.4][i], 36]], 1.3 + i * 0.12, { phase: 0.15 + i * 0.27 });
  TK.idle(T, TK.who(4125, { dir: 1 }), -6.4, 24.4, { acts: ['photo', 'look', 'photo'], season: 'autumn', seed: Math.round(-3.2 * 131 + 24 * 977 + 7) });
  TK.photo(T, { who: TK.who(4126, { dir: 0 }), x: -6.4, y: 30.2 }, [{ who: TK.who(4127, { dir: 2 }), x: 6.4, y: 29.6 }], { seed: 9, season: 'autumn' });
});
