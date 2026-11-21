'use strict';
/* Venice: the city's kit (loaded before the tiles).
   Map orientation: +x runs south (lower right), +y runs west (lower left), so the view looks north-east across the city
   from over the Giudecca: San Marco's basilica faces us (west), the Doge's Palace shows its piazzetta and Molo fronts,
   the Bacino di San Marco is the lagoon along the lower-right edge.
   Every street of the grid is a canal 26 u wide (bank to bank), its water VN.WL below the paving. Places end at their
   banks: a fondamenta (open paving with mooring poles) or houses rising straight from the water.
   Season: Carnival week in February. Low winter sun (kept as the usual upper-left light), a little mist on the
   lagoon, coats, scarves and woolly hats, and everywhere masks and costumes. */
const VN = {
  WL: -2.0,               // water level (u, below the paving at z 0)
  SH: 4.4,                // storey height
  paveC: '#D4CFC4', paveD: '#C3BDB0', paveJ: '#BCB5A8', paveL: '#E2DED5',
  istria: '#F3F0E8', istriaD: '#DCD7CB',
  water: '#8DB2A2', waterD: '#759D8E', waterL: '#B7D1C4', lagoon: '#A6C2BA', lagoonL: '#C3D8D1',
  brick: '#B9674B', brickD: '#985039', roof: '#C66B4D', roofD: '#A4553B',
  shutter: '#5C7D5E', shutterB: '#7A5A3C', flood: '#A3BDB6', floodD: '#8DAAA3', floodL: '#C4D6D0',
  PLASTER: ['#E3B36C', '#DD917F', '#CB7552', '#EBC9A7', '#DCA27A', '#C95E4C', '#EDDDB9', '#E6A98E', '#D7B386', '#C98B5E'],
  COATS: ['#2F3A55', '#7A2E35', '#3E5A44', '#3B3F47', '#B48A5E', '#B53A35', '#D2A23A', '#3F7F80', '#5A4A6A', '#8C8F94', '#A35A3C', '#2B2E33'],
  SCARF: ['#C9463E', '#E6C24F', '#5F8FC9', '#E9E2CC', '#8E79C0', '#D98AA4', '#4F8A6A', '#E07A3F'],
  GOWN: ['#B5303A', '#2F4F8F', '#C9A13A', '#6B2F6E', '#1F6B5E', '#E9E2CC', '#D98AA4', '#2E2A26', '#C95E2C'],
  SHOPS: ['MASCHERE', 'BACARO', 'OSTERIA', 'TABACCHI', 'FARMACIA', 'PASTICCERIA', 'VETRI', 'GELATERIA', 'ALIMENTARI',
    'CAFFÈ', 'TRATTORIA', 'PANIFICIO', 'LIBRERIA', 'CICCHETTI', 'VINI', 'MERLETTI', 'CARTOLERIA', 'PIZZERIA',
    'ENOTECA', 'FORNO', 'BIGOLI', 'SPRITZ', 'GONDOLE', 'PESCHERIA', 'FRUTTA', 'FIORI', 'GIOIELLI', 'COSTUMI'],
};

/* ---------- small geometry ---------- */
/* keep the part of a convex polygon (any dims, first two coords used) on the left of a->b (side -1: the right) */
VN.clip = function (poly, a, b, side) {
  const out = [], s = side || 1, f = (p) => s * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]));
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q);
    if (fp >= 0) out.push(p);
    if ((fp >= 0) !== (fq >= 0)) { const t = fp / (fp - fq); out.push(p.map((v, j) => v + (q[j] - v) * t)); }
  }
  return out;
};
/* clip a world polygon to the box x0..x1, y0..y1 */
VN.clipBox = function (P, x0, y0, x1, y1) {
  let o = P;
  o = VN.clip(o, [x0, 1], [x0, 0], 1); if (o.length < 3) return o;
  o = VN.clip(o, [x1, 0], [x1, 1], 1); if (o.length < 3) return o;
  o = VN.clip(o, [0, y0], [1, y0], 1); if (o.length < 3) return o;
  o = VN.clip(o, [1, y1], [0, y1], 1);
  return o;
};
VN.area = function (P) { let a = 0; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
/* a ground ellipse (world) of radii rx, ry round (x, y) at height z */
VN.ell = function (x, y, z, rx, ry, n) { const o = []; n = n || 18; for (let i = 0; i < n; i++) { const a = TAU * i / n; o.push([x + Math.cos(a) * rx, y + Math.sin(a) * ry, z]); } return o; };
/* stripes (hatching) across a wide-px quad Q (4 points: a0 b0 b1 a1 along two edges), n lines */
VN.hatch = function (g, Q, n, col, w) { const s = []; for (let k = 1; k < n; k++) { const t = k / n; s.push(lerp(Q[0][0], Q[3][0], t), lerp(Q[0][1], Q[3][1], t), lerp(Q[1][0], Q[2][0], t), lerp(Q[1][1], Q[2][1], t)); } g.segs2(s, col, w || 0.3); };

/* ---------- ground ---------- */
/* trachyte masegni: grey slabs laid in courses along `ax`, faint joints, a few paler stones, dry scuffs */
VN.pave = function (g, x0, y0, x1, y1, o) {
  o = o || {};
  const P = K.rect(x0, y0, x1, y1, o.z || 0), z = o.z || 0, st = o.step || 2.4, ax = o.ax || 'x';
  g.fill(P, o.col || VN.paveC);
  const s = [];
  if (ax === 'x') {
    for (let y = Math.ceil(y0 / st) * st; y < y1; y += st) { const a = g.p(x0, y, z), b = g.p(x1, y, z); s.push(a[0], a[1], b[0], b[1]); }
    for (let y = Math.ceil(y0 / st) * st - st, r = 0; y < y1; y += st, r++) for (let x = x0 + ((r * 1.7) % 3.4); x < x1; x += 3.4) { const yy0 = Math.max(y0, y), yy1 = Math.min(y1, y + st); if (yy1 <= yy0) continue; const a = g.p(x, yy0, z), b = g.p(x, yy1, z); s.push(a[0], a[1], b[0], b[1]); }
  } else {
    for (let x = Math.ceil(x0 / st) * st; x < x1; x += st) { const a = g.p(x, y0, z), b = g.p(x, y1, z); s.push(a[0], a[1], b[0], b[1]); }
    for (let x = Math.ceil(x0 / st) * st - st, r = 0; x < x1; x += st, r++) for (let y = y0 + ((r * 1.7) % 3.4); y < y1; y += 3.4) { const xx0 = Math.max(x0, x), xx1 = Math.min(x1, x + st); if (xx1 <= xx0) continue; const a = g.p(xx0, y, z), b = g.p(xx1, y, z); s.push(a[0], a[1], b[0], b[1]); }
  }
  g.segs2(s, o.joint || VN.paveJ, 0.26);
  if (o.scuff !== false) g.scuff(P, { dir: -0.9, len: 1.6, c: VN.paveL, dens: 0.22, w: 0.55, spread: 1.2 });
};
/* the Istrian stone edge of a bank (a white kerb along the water) */
VN.edge = function (g, ax, c, a0, a1, side) {
  const w = 0.7, q = ax === 'x' ? K.rect(a0, Math.min(c, c + side * w), a1, Math.max(c, c + side * w)) : K.rect(Math.min(c, c + side * w), a0, Math.max(c, c + side * w), a1);
  g.fill(q, VN.istria);
};

/* ---------- windows and doors ---------- */
/* a window with an Istrian stone surround. o.arch: 'round' | 'ogee' | 'gothic'; o.sh: shutter colour (open);
   o.closed: shutters closed; o.glass: pale glass; o.sill: false */
VN.archPts = function (face, p, a0, a1, z0, z1, kind, e) {
  e = e || 0; const m = (a0 + a1) / 2, hw = (a1 - a0) / 2 + e, pts = [K.pt(face, p, a0 - e, z0 - e), K.pt(face, p, a1 + e, z0 - e)];
  if (!kind) return [pts[0], pts[1], K.pt(face, p, a1 + e, z1 + e), K.pt(face, p, a0 - e, z1 + e)];
  const n = 12, zt = z1 + e;
  if (kind === 'round') { const zs = zt - hw; for (let i = 0; i <= n; i++) { const t = Math.PI * i / n; pts.push(K.pt(face, p, m + Math.cos(t) * hw, zs + Math.sin(t) * hw)); } }
  else if (kind === 'gothic') { const zs = zt - hw * 1.5; for (let i = 0; i <= n; i++) { const t = 1 - 2 * i / n; pts.push(K.pt(face, p, m + t * hw, zs + (zt - zs) * Math.pow(1 - Math.abs(t), 0.6))); } }
  else {   // ogee: a reverse curve rising to a point (the Venetian gothic window)
    const zs = zt - hw * 1.9;
    for (let i = 0; i <= n; i++) { const t = 1 - 2 * i / n, a = Math.abs(t); const v = a > 0.5 ? Math.sqrt(Math.max(0, 1 - Math.pow((a - 0.5) / 0.5, 2))) * 0.55 : 0.55 + 0.45 * Math.pow(1 - a / 0.5, 1.6); pts.push(K.pt(face, p, m + t * hw, zs + (zt - zs) * v)); }
  }
  return pts;
};
VN.win = function (g, face, p, a0, a1, z0, z1, o) {
  o = o || {}; const w = a1 - a0, m = (a0 + a1) / 2;
  if (o.frame !== false) g.fill(VN.archPts(face, p, a0, a1, z0, z1, o.arch, 0.3), o.frameCol || VN.istria);
  const hole = VN.archPts(face, p, a0, a1, z0, z1, o.arch, 0);
  if (o.closed) {
    g.fill(hole, o.sh || VN.shutter);
    const Q = g.P(K.on(face, p, a0, a1, z0, z1 - (o.arch ? w * 0.4 : 0)));
    VN.hatch(g, Q.slice(0, 2).concat([Q[2], Q[3]]).map((q) => q), 6, shade(o.sh || VN.shutter, 0.28), 0.3);
    const ml = g.P([K.pt(face, p, m, z0), K.pt(face, p, m, z1 - (o.arch ? w * 0.3 : 0))]); g.segs2([ml[0][0], ml[0][1], ml[1][0], ml[1][1]], shade(o.sh || VN.shutter, 0.4), 0.35);
  } else {
    g.fill(hole, o.glass ? C.glass : (o.pane || '#4F5963'));
    const P = g.P(hole); let cx = 0, cy = 0; for (const q of P) { cx += q[0]; cy += q[1]; } cx /= P.length; cy /= P.length;
    if (o.glass) g.segs2([cx - 0.5, cy + 1.2, cx + 0.8, cy - 1.2], C.white, 0.5);
    else g.segs2([cx - 0.7, cy + 1.3, cx + 0.4, cy - 0.5], '#7E8C96', 0.45);
    if (w > 1.6 && !o.glass) { const ml = g.P([K.pt(face, p, m, z0), K.pt(face, p, m, z1 - (o.arch ? w * 0.45 : 0))]); g.segs2([ml[0][0], ml[0][1], ml[1][0], ml[1][1]], VN.istriaD, 0.3); }
  }
  g.outline(hole, { w: 0.42, boil: false, ext: 0.15, c: '#3A3530' });
  if (o.sh && !o.closed) {
    const sw = Math.min(w * 0.5, 0.9), c = o.sh, cd = shade(c, 0.25);
    for (const [b0, b1] of [[a0 - 0.3 - sw, a0 - 0.3], [a1 + 0.3, a1 + 0.3 + sw]]) {
      const q = K.on(face, p, b0, b1, z0 - 0.05, z1 - (o.arch ? w * 0.4 : 0) + 0.05);
      g.fill(q, c); const Q = g.P(q); VN.hatch(g, Q, 5, cd, 0.28);
    }
  }
  if (o.sill !== false) g.fill(K.on(face, p, a0 - 0.4, a1 + 0.4, z0 - 0.4, z0 - 0.1), VN.istria);
  if (o.flowers) { const q = g.P([K.pt(face, p, a0 - 0.2, z0 - 0.1), K.pt(face, p, a1 + 0.2, z0 - 0.1)]); const cs = o.flowers; for (let i = 0; i < 4; i++) { const t = (i + 0.5) / 4; g.disc2([lerp(q[0][0], q[1][0], t), lerp(q[0][1], q[1][1], t) - 0.9], 0.75, cs[i % cs.length]); } g.fill2([[q[0][0], q[0][1] - 0.4], [q[1][0], q[1][1] - 0.4], [q[1][0], q[1][1] + 0.3], [q[0][0], q[0][1] + 0.3]], '#6E8A3E', true); }
};
VN.door = function (g, face, p, a0, a1, z1, o) {
  o = o || {}; const z0 = o.z0 || 0;
  g.fill(VN.archPts(face, p, a0, a1, z0, z1, o.arch, 0.35), VN.istria);
  const d = VN.archPts(face, p, a0, a1, z0, z1, o.arch, 0);
  g.fill(d, o.col || '#5A3E2E'); g.outline(d, { w: 0.45, boil: false, c: '#2E2620' });
  const k = g.p.apply(g, K.pt(face, p, a1 - (a1 - a0) * 0.25, z0 + (z1 - z0) * 0.45)); g.disc2(k, 0.3, C.gold || '#C9A44A');
};
/* a "nizioleto": the white painted street name on a wall, black letters (real words) */
VN.niz = function (g, face, p, a0, z0, word) {
  const h = 0.62, w = K.textW(word, h) + 0.8;
  g.fill(K.on(face, p + (face === 'L' ? 0.03 : 0.03), a0, a0 + w, z0, z0 + h + 0.7), '#F6F4EE');
  g.outline(K.on(face, p + 0.03, a0, a0 + w, z0, z0 + h + 0.7), { w: 0.3, boil: false, c: '#2E2A26', ext: 0 });
  K.text(g, face, p + 0.05, a0 + 0.4, z0 + 0.35, h, word, '#2E2A26', { w: 0.24 });
};

/* ---------- roofs, chimneys, altane ---------- */
/* a Venetian chimney: a slim stack crowned by a funnel ("a campana"), or a tall square one with a little roof */
VN.chimney = function (g, x, y, z, kind) {
  const stack = { t: '#C98463', l: '#D08E6C', r: '#A9674C' };
  if (kind === 'square') {
    K.box(g, x - 0.55, y - 0.55, x + 0.55, y + 0.55, z - 0.6, z + 3.4, stack, { w: 0.5, nohid: true });
    K.hip(g, x - 0.9, y - 0.9, x + 0.9, y + 0.9, z + 3.4, 0.8, VN.roof, { c: shade(VN.roof, 0.45) });
    return;
  }
  K.box(g, x - 0.45, y - 0.45, x + 0.45, y + 0.45, z - 0.6, z + 2.4, stack, { w: 0.5, nohid: true });
  const b = g.p(x, y, z + 2.4), t = g.p(x, y, z + 4.0), rb = 1.3, rt = 3.4;
  const f = [[b[0] - rb, b[1]], [b[0] + rb, b[1]], [t[0] + rt, t[1]], [t[0] - rt, t[1]]];
  g.fill2(f, '#D58C6A'); g.fill2([[b[0] + 0.2, b[1]], [b[0] + rb, b[1]], [t[0] + rt, t[1]], [t[0] + 0.6, t[1]]], '#B5714F');
  const lip = arcPts(t[0], t[1], rt, 0, TAU, 12).map((q) => [q[0], t[1] + (q[1] - t[1]) * 0.42]);
  g.fill2(lip, '#8E5A42');
  g.outline2(f, { w: 0.45, boil: false, c: '#5E3424' });
  g.line2(lip, { w: 0.42, boil: false, c: '#5E3424', close: true });
};
/* an altana: a wooden roof terrace on posts over the roof, a railing, sometimes washing on a line */
VN.altana = function (g, x, y, z, o) {
  o = o || {}; const W = o.W || 2.4, D = o.D || 2.0, h = o.h || 1.6, wood = '#9C7450';
  const posts = []; for (const [px, py] of [[x - W, y - D], [x + W, y - D], [x + W, y + D], [x - W, y + D]]) { const a = g.p(px, py, z - 0.8), b = g.p(px, py, z + h); posts.push(a[0], a[1], b[0], b[1]); }
  g.segs2(posts, '#6E4E30', 0.55);
  const deck = K.rect(x - W - 0.3, y - D - 0.3, x + W + 0.3, y + D + 0.3, z + h); g.fill(deck, '#B8875A');
  const sl = []; for (let i = 0; i < 7; i++) { const u = x - W + i * (2 * W / 6), a = g.p(u, y - D - 0.3, z + h), b = g.p(u, y + D + 0.3, z + h); sl.push(a[0], a[1], b[0], b[1]); } g.segs2(sl, '#8E6640', 0.28);
  g.outline(deck, { w: 0.5, boil: false, c: '#5E4228' });
  if (o.who) o.who(g, z + h);
  const rp = [], H2 = 1.3;
  for (let i = 0; i <= 8; i++) { const a = g.p(lerp(x - W - 0.3, x + W + 0.3, i / 8), y + D + 0.3, z + h), b = g.p(lerp(x - W - 0.3, x + W + 0.3, i / 8), y + D + 0.3, z + h + H2); rp.push(a[0], a[1], b[0], b[1]); }
  for (let i = 0; i <= 6; i++) { const a = g.p(x + W + 0.3, lerp(y - D - 0.3, y + D + 0.3, i / 6), z + h), b = g.p(x + W + 0.3, lerp(y - D - 0.3, y + D + 0.3, i / 6), z + h + H2); rp.push(a[0], a[1], b[0], b[1]); }
  g.segs2(rp, wood, 0.35);
  g.line([[x - W - 0.3, y + D + 0.3, z + h + H2], [x + W + 0.3, y + D + 0.3, z + h + H2], [x + W + 0.3, y - D - 0.3, z + h + H2]], { w: 0.45, boil: false, c: '#5E4228' });
  if (o.wash) VN.washLine(g, [x - W, y - D + 0.4, z + h + 2.6], [x + W, y - D + 0.4, z + h + 2.6], o.wash, 0.5);
};
/* a washing line between two world points with things hanging on it (cols: their colours) */
VN.washLine = function (g, a, b, cols, sag) {
  sag = sag == null ? 0.9 : sag; const pts = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t) - sag * 4 * t * (1 - t)]); }
  g.fine(pts, { w: 0.22, c: '#6E6A60' });
  const n = cols.length;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.7) / (n + 0.4), q = g.p(lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t) - sag * 4 * t * (1 - t)), c = cols[i], R = h2(i * 7 + Math.round(a[0]), Math.round(a[1] * 3));
    if (R < 0.4) g.fill2([[q[0] - 1.6, q[1]], [q[0] + 1.6, q[1]], [q[0] + 1.4, q[1] + 3.6], [q[0] - 1.4, q[1] + 3.6]], c, true);          // a sheet
    else if (R < 0.75) g.fill2([[q[0] - 1.1, q[1]], [q[0] + 1.1, q[1]], [q[0] + 1.6, q[1] + 0.7], [q[0] + 0.9, q[1] + 1.1], [q[0] + 0.9, q[1] + 2.7], [q[0] - 0.9, q[1] + 2.7], [q[0] - 0.9, q[1] + 1.1], [q[0] - 1.6, q[1] + 0.7]], c, true);  // a shirt
    else g.fill2([[q[0] - 0.9, q[1]], [q[0] + 0.9, q[1]], [q[0] + 0.8, q[1] + 2.8], [q[0] + 0.2, q[1] + 2.8], [q[0], q[1] + 1.0], [q[0] - 0.2, q[1] + 2.8], [q[0] - 0.8, q[1] + 2.8]], c, true);   // trousers
    g.segs2([q[0] - 0.4, q[1] - 0.3, q[0] - 0.4, q[1] + 0.3, q[0] + 0.4, q[1] - 0.3, q[0] + 0.4, q[1] + 0.3], '#5E5A50', 0.25);
  }
};

/* ---------- a Venetian house ----------
   A stuccoed box of n storeys (from z0: 0 on land, VN.WL when it rises from a canal) with an Istrian footing, its
   windows in rhythm on the two faces we see (round-headed or ogee on the upper floors, green shutters), a white dentil
   cornice, a low terracotta roof (hip or gable), funnel chimneys, sometimes an altana, a balcony with flowers, a shop.
   d: { x0, y0, x1, y1, n, col, z0, roof: 'hip'|'x'|'y'|'flat', rh, sh, arch, archN (storeys with arches),
        doorL / doorR: [a0, a1, col, arch], shopL / shopR: [a0, a1, col, word], winL / winR (bays), skipL / skipR,
        balcony: ['L'|'R', a, flowers], chim: [[x, y, kind], ...], altana: [x, y, o], closedP: share of shutters closed,
        water: true (the face on the water gets a water gate and a green weed band) } */
VN.house = function (g, d) {
  const bp = g.boilP; g.boilP = 0.22;
  const { x0, y0, x1, y1, n } = d, z0 = d.z0 || 0, SH = d.sh2 || VN.SH, H = n * SH + 0.6, col = d.col, tone = { t: shade(col, -0.2), l: col, r: shade(col, 0.12) };
  K.box(g, x0, y0, x1, y1, z0, H, tone, { w: 0.9 });
  // footing: Istrian stone at the waterline, a damp band on land; weed where the water meets it
  if (z0 < 0) {
    g.fill(K.on('L', y1, x0, x1, z0, 0.6), shade(VN.istriaD, 0.03)); g.fill(K.on('R', x1, y0, y1, z0, 0.6), shade(VN.istriaD, 0.1));
    g.fill(K.on('L', y1, x0, x1, z0, z0 + 0.55), '#6F8A62'); g.fill(K.on('R', x1, y0, y1, z0, z0 + 0.55), '#5F7A54');
  } else { g.fill(K.on('L', y1, x0, x1, 0, 0.6), VN.istriaD); g.fill(K.on('R', x1, y0, y1, 0, 0.6), shade(VN.istriaD, 0.08)); }
  g.line([[x0, y1, 0.6], [x1, y1, 0.6], [x1, y0, 0.6]], { w: 0.35, boil: false, c: '#9E968A' });
  // storey bands and patches of bare brick where the plaster has fallen
  const bands = []; for (let k = 1; k < n; k++) { const z = k * SH + 0.2; for (const [a, b] of [[[x0, y1, z], [x1, y1, z]], [[x1, y1, z], [x1, y0, z]]]) { const A = g.p.apply(g, a), B = g.p.apply(g, b); bands.push(A[0], A[1], B[0], B[1]); } }
  g.segs2(bands, shade(col, 0.25), 0.3);
  const R = RNG(Math.round(x0 * 13 + y0 * 7 + n * 3 + (d.seed || 0)));
  for (let i = 0; i < 2; i++) {
    const onL = R() < 0.6, a = onL ? lerp(x0 + 1, x1 - 3, R()) : lerp(y0 + 1, y1 - 3, R()), z = 1.2 + R() * (H - 4), pts = K.on(onL ? 'L' : 'R', onL ? y1 + 0.01 : x1 + 0.01, a, a + 1.4 + R() * 1.4, z, z + 0.8 + R() * 0.7);
    g.fill(pts, shade(VN.brick, onL ? -0.05 : 0.08)); VN.hatch(g, g.P(pts), 3, VN.brickD, 0.25);
  }
  const bays = (a0, a1, nb) => { const out = [], w = (a1 - a0) / nb; for (let i = 0; i < nb; i++) out.push(a0 + w * (i + 0.5)); return out; };
  const skip = (list, m) => list && list.some((s) => m > s[0] - 1 && m < s[1] + 1);
  for (const face of ['L', 'R']) {
    const p = face === 'L' ? y1 : x1, a0 = face === 'L' ? x0 : y0, a1 = face === 'L' ? x1 : y1;
    const nb = d['win' + face] || Math.max(1, Math.round((a1 - a0) / 3.3));
    const door = d['door' + face], shop = d['shop' + face], sk = d['skip' + face], wg = d['wg' + face];
    for (let k = 0; k < n; k++) {
      const zf = k * SH + 0.2;
      for (const m of bays(a0 + 0.5, a1 - 0.5, nb)) {
        if (skip(sk, m)) continue;
        if (k === 0) {
          if (door && m > door[0] - 1.1 && m < door[1] + 1.1) continue;
          if (shop && m > shop[0] - 0.7 && m < shop[1] + 0.7) continue;
          if (wg && m > wg[0] - 1 && m < wg[1] + 1) continue;
          VN.win(g, face, p, m - 0.5, m + 0.5, zf + 1.3, zf + 2.7, { pane: '#59636B', arch: 'round' });
          const A = g.p.apply(g, K.pt(face, p, m - 0.5, zf + 2.0)), B = g.p.apply(g, K.pt(face, p, m + 0.5, zf + 2.0)); g.segs2([A[0], A[1], B[0], B[1]], '#2E2A26', 0.3);
        } else {
          const closed = h2(Math.round(m * 7 + x0), k + n * 3) < (d.closedP == null ? 0.25 : d.closedP);
          const arch = (d.archN || []).indexOf(k) >= 0 ? (d.arch || 'round') : (d.arch2 || null);
          const fl = d.flowers && h2(Math.round(m * 3), k) < 0.35 ? d.flowers : null;
          VN.win(g, face, p, m - 0.6, m + 0.6, zf + 1.0, zf + 3.3, { sh: d.shut === false ? null : (d.shutCol || VN.shutter), closed: closed && d.shut !== false, arch, flowers: fl });
        }
      }
    }
    if (door) VN.door(g, face, p, door[0], door[1], 3.4, { col: door[2], arch: door[3] });
    if (wg) {   // a water gate: an arched opening down to the water with a mooring step
      VN.door(g, face, p, wg[0], wg[1], 2.6, { z0: z0, arch: 'round', col: '#3A3832' });
      g.fill(K.on(face, p + 0.02, wg[0], wg[1], z0, z0 + 0.6), '#5F7A6E');
    }
    if (shop) {
      const [s0, s1, sc, word] = shop, q = K.on(face, p + 0.02, s0, s1, 0.25, 3.2);
      g.fill(K.on(face, p + 0.01, s0 - 0.35, s1 + 0.35, 0, 3.6), sc);
      g.fill(q, '#E9DFC2');
      const Pq = g.P(q), mull = []; for (let j = 1; j < 3; j++) { const t = j / 3; mull.push(lerp(Pq[0][0], Pq[1][0], t), lerp(Pq[0][1], Pq[1][1], t), lerp(Pq[3][0], Pq[2][0], t), lerp(Pq[3][1], Pq[2][1], t)); }
      g.segs2(mull, sc, 0.6); g.outline2(Pq, { w: 0.45, boil: false, c: '#2E2A26' });
      if (d.goods) d.goods(g, face, p, s0, s1);
      if (word) K.sign(g, face, p + 0.04, s0 - 0.2, s1 + 0.2, 3.65, 4.55, shade(sc, 0.15), word, { ink: '#F6F1E4' });
    }
  }
  // a balcony with balusters (and flowers)
  if (d.balcony) {
    const [face, m, fl] = d.balcony, p = face === 'L' ? y1 : x1, z = SH + 0.2;
    const B = face === 'L' ? [m - 2.0, y1, m + 2.0, y1 + 1.0] : [x1, m - 2.0, x1 + 1.0, m + 2.0];
    K.box(g, B[0], B[1], B[2], B[3], z - 0.35, z, VN.istria, { w: 0.5, nohid: true });
    const bal = [], along = (t, zz) => face === 'L' ? g.p(lerp(B[0], B[2], t), B[3], zz) : g.p(B[2], lerp(B[1], B[3], t), zz);
    for (let i = 0; i <= 10; i++) { const a = along(i / 10, z), b = along(i / 10, z + 1.2); bal.push(a[0], a[1], b[0], b[1]); }
    g.segs2(bal, VN.istriaD, 0.5);
    g.line(face === 'L' ? [[B[0], B[3], z + 1.2], [B[2], B[3], z + 1.2], [B[2], B[1], z + 1.2]] : [[B[0], B[3], z + 1.2], [B[2], B[3], z + 1.2], [B[2], B[1], z + 1.2]], { w: 0.5, boil: false });
    if (fl) { const f2 = face === 'L' ? [B[0] + 0.3, B[3] - 0.4, B[2] - 0.3, B[3] - 0.1] : [B[2] - 0.4, B[1] + 0.3, B[2] - 0.1, B[3] - 0.3]; K.blooms(g, f2[0], f2[1], f2[2], f2[3], z + 0.9, fl, { sp: 0.9, r: 0.9 }); }
    void p;
  }
  // a dentil cornice, then the roof
  K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, H, H + 0.5, { t: VN.istria, l: VN.istria, r: VN.istriaD }, { w: 0.55, nohid: true });
  const dn = []; for (let a = x0; a < x1; a += 0.7) { const A = g.p(a, y1 + 0.31, H + 0.05), B = g.p(a, y1 + 0.31, H + 0.25); dn.push(A[0], A[1], B[0], B[1]); } for (let a = y0; a < y1; a += 0.7) { const A = g.p(x1 + 0.31, a, H + 0.05), B = g.p(x1 + 0.31, a, H + 0.25); dn.push(A[0], A[1], B[0], B[1]); }
  g.segs2(dn, '#B9B2A4', 0.28);
  const rc = d.roofCol || VN.roof, rz = H + 0.5, rh = d.rh || 2.4;
  if (d.roof === 'flat') { g.fill(K.rect(x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, rz), '#C9BFA9'); }
  else if (d.roof === 'x' || d.roof === 'y') K.gable(g, x0 - 0.5, y0 - 0.5, x1 + 0.5, y1 + 0.5, rz, rh, d.roof, { a: rc, b: shade(rc, 0.1), e: shade(col, -0.08) }, { c: shade(rc, 0.45) });
  else K.hip(g, x0 - 0.5, y0 - 0.5, x1 + 0.5, y1 + 0.5, rz, rh, rc, { ridge: Math.max(0, Math.abs((x1 - x0) - (y1 - y0)) * 0.9), c: shade(rc, 0.45) });
  if (d.roof !== 'flat') {   // coppi courses on the lit slope
    const tl = [], rr = RNG(Math.round(x1 * 31 + y1 * 3));
    for (let i = 0; i < 8; i++) { const u = rr(), v = 0.2 + rr() * 0.6; const a = g.p(lerp(x0, x1, u), lerp(y1 + 0.4, (y0 + y1) / 2, v), rz + rh * v * 0.9); tl.push(a[0], a[1], a[0] + 2.6, a[1] - 1.4); }
    g.segs2(tl, shade(rc, 0.22), 0.38);
  }
  for (const c of d.chim || []) VN.chimney(g, c[0], c[1], rz + (d.roof === 'flat' ? 0 : rh * 0.45), c[2]);
  if (d.altana) VN.altana(g, d.altana[0], d.altana[1], rz + (d.roof === 'flat' ? 0 : rh * 0.55), d.altana[2] || {});
  g.boilP = bp;
  return rz;
};

/* ---------- street furniture ---------- */
/* a striped mooring pole (palina), its cap painted in the house colours */
VN.palina = function (g, x, y, o) {
  o = o || {}; const z0 = VN.WL - 0.2, h = o.h || 6.2, c1 = o.c1 || '#2F4F8F', c2 = o.c2 || '#F3F0E8', b = g.p(x, y, z0), t = g.p(x, y, z0 + h), r = o.r || 0.42 * SX;
  g.fill2([[b[0] - r, b[1]], [b[0] + r, b[1]], [t[0] + r, t[1]], [t[0] - r, t[1]]], c2, true);
  const st = []; const n = Math.round(h / 0.9);
  for (let i = 0; i < n; i++) { const z = z0 + 0.4 + i * 0.9, a = g.p(x, y, z), c = g.p(x, y, z + 0.5); st.push(a[0] - r, a[1] + 0.5, c[0] + r, c[1] - 0.5, a[0] - r, a[1] + 0.5, a[0] + r, a[1] - 0.2, c[0] + r, c[1] - 0.5, c[0] - r, c[1] + 0.2); }
  g.tris2(st, c1);
  g.fill2([[b[0] - r, b[1]], [b[0] + r, b[1]], [b[0] + r, b[1] - 1.6], [b[0] - r, b[1] - 1.6]], '#4E5E52', true);
  g.fill2(arcPts(t[0], t[1], r * 1.2, Math.PI, TAU, 6).concat([[t[0] + r * 1.2, t[1] + 0.3], [t[0] - r * 1.2, t[1] + 0.3]]), o.cap || c1, true);
  g.line2([[b[0] - r, b[1]], [t[0] - r, t[1]]], { w: 0.3, boil: false, c: '#3A3530', ext: 0 }); g.line2([[b[0] + r, b[1]], [t[0] + r, t[1]]], { w: 0.3, boil: false, c: '#3A3530', ext: 0 });
};
/* a cast-iron lamp post with a lantern */
VN.lamp = function (g, x, y, o) {
  o = o || {}; const z = o.z || 0, h = o.h || 6.6, b = g.p(x, y, z), t = g.p(x, y, z + h);
  g.fill2([[b[0] - 0.9, b[1]], [b[0] + 0.9, b[1]], [b[0] + 0.5, b[1] - 2.4], [b[0] - 0.5, b[1] - 2.4]], '#2E3532', true);
  g.line2([[b[0], b[1] - 2], [t[0], t[1]]], { w: 0.55, c: '#2E3532', boil: false, ext: 0 });
  g.fill2([[t[0] - 1.3, t[1]], [t[0] + 1.3, t[1]], [t[0] + 1.6, t[1] - 3.2], [t[0] - 1.6, t[1] - 3.2]], '#F2E3A6', true);
  g.fill2([[t[0] - 1.9, t[1] - 3.2], [t[0] + 1.9, t[1] - 3.2], [t[0], t[1] - 4.8]], '#2E3532', true);
  g.outline2([[t[0] - 1.3, t[1]], [t[0] + 1.3, t[1]], [t[0] + 1.6, t[1] - 3.2], [t[0] - 1.6, t[1] - 3.2]], { w: 0.35, c: '#2E3532', boil: false, ext: 0 });
};
/* a vera da pozzo: the carved stone well-head of a campo, an iron lid, a step round it */
VN.well = function (g, x, y, o) {
  o = o || {};
  K.cyl(g, x, y, 2.6, 0, 0.35, { t: VN.istriaD, l: VN.istria, r: VN.istriaD }, { w: 0.55, n: 14 });
  K.cyl(g, x, y, 1.8, 0.35, 2.6, { t: '#E9E4D8', l: '#EFEBE1', r: '#D3CCBD' }, { w: 0.8, n: 14 });
  const rel = []; for (let i = 0; i < 6; i++) { const a = Math.PI * 0.15 + i * 0.22, c = g.p(x + Math.cos(a) * 1.82, y + Math.sin(a) * 1.82, 1.5); rel.push(c[0] - 0.6, c[1] + 0.5, c[0], c[1] - 1.2, c[0], c[1] - 1.2, c[0] + 0.6, c[1] + 0.5); }
  g.segs2(rel, '#B9B2A4', 0.35);
  K.cyl(g, x, y, 2.0, 2.6, 2.9, { t: '#E9E4D8', l: '#EFEBE1', r: '#D3CCBD' }, { w: 0.5, n: 14 });
  const c = g.p(x, y, 2.9); g.fill2(arcPts(c[0], c[1], 5.6, 0, TAU, 14).map((q) => [q[0], c[1] + (q[1] - c[1]) * 0.5]), '#4A4E4C', true);
};
/* a café table with two chairs, drawn as one small thing (the sitters belong in the caller's drawing) */
VN.table = function (g, x, y, z, o) {
  o = o || {}; const t = g.p(x, y, (z || 0) + 2.2), b = g.p(x, y, z || 0);
  g.line2([[b[0], b[1]], [t[0], t[1]]], { w: 0.45, c: '#3A3530', boil: false, ext: 0 });
  g.fill2(arcPts(t[0], t[1], 2.4, 0, TAU, 12).map((q) => [q[0], t[1] + (q[1] - t[1]) * 0.5]), o.top || '#F6F4EE', true);
  g.line2(arcPts(t[0], t[1], 2.4, 0, TAU, 12).map((q) => [q[0], t[1] + (q[1] - t[1]) * 0.5]), { w: 0.35, c: '#5E5A50', boil: false, close: true });
  if (o.cups) { g.disc2([t[0] - 0.7, t[1] - 0.3], 0.45, o.cups[0]); g.disc2([t[0] + 0.8, t[1] + 0.1], 0.45, o.cups[1] || o.cups[0]); }
};

/* ---------- people ---------- */
/* a Venetian in winter: coats, scarves, woolly hats; o overrides */
VN.who = function (seed, o) {
  const R = RNG(seed * 7121 + 5), w = K.who(seed);
  w.top = R.pick(VN.COATS); w.bare = false; w.shorts = false;
  if (R() < 0.55) w.scarf = R.pick(VN.SCARF);
  const hr = R();
  if (hr < 0.22) w.beanie = R.pick(VN.SCARF.concat(['#3B3F47', '#7A2E35']));
  else if (hr < 0.3) w.fedora = R.pick(['#3B3F47', '#5A4A3C', '#2B2E33']);
  else if (hr < 0.36) w.colombina = R.pick(['#D9B24A', '#C9463E', '#E9E2CC', '#3F5F8F', '#2B2E33']);   // a tourist's half-mask
  if (w.dress && R() < 0.5) w.dress = null;
  if (R() < 0.2) w.dress = R.pick(['#3B3F47', '#7A2E35', '#2F3A55', '#5A4A6A']);
  return Object.assign(w, o || {});
};
/* a Carnival costume: kind 'gown' | 'bauta' | 'medico' | 'jester' | 'volto' | 'cape', from a seed */
VN.carnival = function (seed, kind, o) {
  const R = RNG(seed * 313 + 17), w = K.who(seed);
  const c = R.pick(VN.GOWN), c2 = R.pick(VN.GOWN.filter((q) => q !== c));
  Object.assign(w, { bare: false, shorts: false, glasses: false, cap: null, beard: false });
  if (kind === 'gown') Object.assign(w, { gown: c, gownT: c2, top: c, dress: c, plume: R.pick(['#E9E2CC', '#D9B24A', c2, '#2E2A26']), volto: R.pick(['#F6F2E8', '#D9B24A', '#F6F2E8']), hairStyle: 'bun' });
  else if (kind === 'bauta') Object.assign(w, { top: '#2B2A2C', bot: '#2B2A2C', cape: '#1F1E20', capeIn: '#8A2A2E', tricorn: '#1F1E20', bauta: true, shoe: '#2B2A2C' });
  else if (kind === 'medico') Object.assign(w, { top: '#2B2A2C', bot: '#2B2A2C', cape: '#1F1E20', capeIn: '#2B2A2C', hat: '#1F1E20', medico: true, shoe: '#2B2A2C' });
  else if (kind === 'jester') Object.assign(w, { top: c, bot: c2, jester: [c, c2], volto: '#F6F2E8', harlequin: true });
  else if (kind === 'cape') Object.assign(w, { top: c2, bot: '#2B2A2C', cape: c, capeIn: '#D9B24A', tricorn: '#2B2A2C', volto: '#F6F2E8' });
  else Object.assign(w, { top: c, dress: R() < 0.5 ? c : null, colombina: R.pick(['#D9B24A', '#E9E2CC', c2]), plume: R() < 0.5 ? c2 : null });
  return Object.assign(w, o || {});
};
/* K.person plus the city's extras: scarf, hats, masks, cloak, a gown with a wide skirt, a jester's hat, wading water */
VN.person = function (g, x, y, z, w) {
  const k = w.k || 1, dir = w.dir | 0, sg = (dir === 0 || dir === 3) ? 1 : -1, back = dir >= 2, sit = w.pose === 'sit';
  const F = g.p(x, y, z || 0);
  const base = Object.assign({}, w);
  if (w.gown && !sit) base.dress = w.gown;
  const r = K.person(g, x, y, z, base);
  const sp = r.shoulders, hp = r.hip, hd = r.head, cr = r.crown;
  const fpt = (u, v) => [hd[0] + sg * u * k, hd[1] + v * k];       // a point on the head, u towards the face
  // a gown's wide skirt over the legs (panniers), gold bands
  if (w.gown && !sit && hp) {
    const top = hp[1] - 1.2 * k, bot = F[1], cx = hp[0], ww = 3.9 * k, ph = w.pose === 'walk' ? Math.sin((w.ph || 0) * TAU) * 0.5 : 0;
    const sk = [[cx - 1.8 * k, top], [cx + 1.8 * k, top], [cx + ww + ph, bot - 0.6 * k], [cx + ww * 0.7, bot + 0.2 * k], [cx - ww * 0.7, bot + 0.2 * k], [cx - ww + ph, bot - 0.6 * k]];
    g.fill2(sk, w.gown, true);
    g.fill2([[cx + sg * 0.4 * k, top], [cx + sg * 1.8 * k, top], [cx + sg * ww + ph, bot - 0.6 * k], [cx + sg * ww * 0.3, bot]], shade(w.gown, 0.12), true);
    g.fill2([[cx - ww + 0.2 * k + ph, bot - 1.6 * k], [cx + ww - 0.2 * k + ph, bot - 1.6 * k], [cx + ww + ph, bot - 0.6 * k], [cx - ww + ph, bot - 0.6 * k]], w.gownT || '#D9B24A', true);
    g.line2(sk, { w: 0.4, c: '#3A3128', boil: false, close: true, wob: 0.3 });
  }
  // a cloak (tabarro) from the shoulders to below the knees, its lining showing at the opening
  if (w.cape && sp && hp) {
    const s0 = sp[0], s1 = sp[1], top = Math.min(s0[1], s1[1]) - 0.4 * k, cx = (s0[0] + s1[0]) / 2, bot = F[1] - (sit ? 0.5 : 2.4) * k, wd = 3.6 * k;
    const cl = [[cx - 2.3 * k, top], [cx + 2.3 * k, top], [cx + wd, bot], [cx - wd, bot]];
    g.fill2(cl, w.cape, true);
    if (!back) g.fill2([[cx + sg * 0.3 * k, top + 1.4 * k], [cx + sg * 1.1 * k, top + 1.2 * k], [cx + sg * 1.6 * k, bot], [cx + sg * 0.5 * k, bot]], w.capeIn || '#8A2A2E', true);
    g.fill2([[cx - 2.6 * k, top - 0.2 * k], [cx + 2.6 * k, top - 0.2 * k], [cx + 3.0 * k, top + 2.2 * k], [cx - 3.0 * k, top + 2.2 * k]], shade(w.cape, -0.1), true);   // the shoulder cape
    g.line2(cl, { w: 0.4, c: '#1A1818', boil: false, close: true, wob: 0.3 });
  }
  if (w.scarf && sp && !w.cape) {   // wound round the neck, one end hanging down the front on the near side
    const mx = (sp[0][0] + sp[1][0]) / 2, my = Math.min(sp[0][1], sp[1][1]);
    g.fill2([[mx - 1.5 * k, my - 1.3 * k], [mx + 1.5 * k, my - 1.3 * k], [mx + 1.7 * k, my + 0.3 * k], [mx - 1.7 * k, my + 0.3 * k]], w.scarf, true);
    if (!back) { const ex = mx - sg * 0.9 * k; g.fill2([[ex - 0.55 * k, my], [ex + 0.55 * k, my], [ex + 0.6 * k, my + 3.4 * k], [ex - 0.5 * k, my + 3.3 * k]], shade(w.scarf, 0.12), true); g.segs2([ex - 0.5 * k, my + 3.4 * k, ex - 0.5 * k, my + 3.9 * k, ex + 0.5 * k, my + 3.4 * k, ex + 0.5 * k, my + 3.9 * k], shade(w.scarf, 0.12), 0.3); }
  }
  if (w.harlequin && sp && hp && !back) {   // diamonds on the jester's suit
    const tr = []; const x0 = Math.min(sp[0][0], sp[1][0]), x1 = Math.max(sp[0][0], sp[1][0]), y0 = Math.min(sp[0][1], sp[1][1]) + 0.8 * k, y1 = hp[1];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const cx = lerp(x0, x1, (i + 0.5) / 2), cy = lerp(y0, y1, (j + 0.5) / 2); tr.push(cx, cy - 1.1 * k, cx + 0.7 * k, cy, cx, cy + 1.1 * k, cx, cy - 1.1 * k, cx, cy + 1.1 * k, cx - 0.7 * k, cy); }
    g.tris2(tr, w.jester[1]);
  }
  // masks on the face (only when the face shows)
  if (!back && hd) {
    const eye = (u, v) => fpt(0.22 + u, v);   // head centre is at HC; the face sits towards +u
    if (w.bauta || w.volto || w.medico) {
      const col = w.bauta ? '#F4F1EA' : w.medico ? '#EDE6D2' : w.volto;
      const m = w.bauta
        ? [fpt(-0.5, -1.6), fpt(0.7, -2.0), fpt(1.7, -1.3), fpt(2.05, 0.1), fpt(2.6, 1.3), fpt(2.3, 2.2), fpt(0.8, 2.2), fpt(-0.2, 1.6), fpt(-0.6, 0.2)]
        : [fpt(-0.4, -1.5), fpt(0.7, -1.9), fpt(1.65, -1.3), fpt(1.95, 0.0), fpt(1.75, 1.2), fpt(0.9, 2.0), fpt(0.1, 1.7), fpt(-0.45, 0.4)];
      g.fill2(m, col, true);
      g.fill2([m[m.length - 1], m[0], fpt(0.1, -1.0), fpt(0.0, 0.5)], shade(col, 0.1), true);
      for (const [u, v, s] of [[-0.1, -0.15, 1], [1.2, -0.17, 0.85]]) g.fill2(arcPts(eye(u, v)[0], eye(u, v)[1], 0.36 * k * s, 0, TAU, 8).map((q) => [q[0], q[1] + (q[1] - eye(u, v)[1]) * -0.35]), '#2A2420', true);
      if (w.medico) {   // the long beak and round lenses
        g.fill2([fpt(1.2, 0.2), fpt(1.7, -0.1), fpt(5.4, 2.4), fpt(1.4, 1.3)], col, true);
        g.line2([fpt(1.7, -0.1), fpt(5.4, 2.4), fpt(1.4, 1.3)], { w: 0.3, c: '#5E5A50', boil: false, ext: 0 });
        g.disc2(eye(-0.1, -0.15), 0.42 * k, '#4A4E4C'); g.disc2(eye(1.2, -0.17), 0.36 * k, '#4A4E4C');
      }
      g.line2(m, { w: 0.3, c: '#5E5A50', boil: false, close: true });
      if (w.volto && !w.bauta && !w.medico && w.volto !== '#F6F2E8') g.segs2([fpt(0.3, 0.8)[0], fpt(0.3, 0.8)[1], fpt(1.2, 0.9)[0], fpt(1.2, 0.9)[1]], '#B5303A', 0.35);
    } else if (w.colombina) {
      const c = w.colombina, m = [fpt(-0.55, -0.4), fpt(-0.1, -1.05), fpt(0.9, -0.85), fpt(1.85, -1.15), fpt(2.15, -0.45), fpt(1.8, 0.4), fpt(1.05, 0.35), fpt(0.6, 0.55), fpt(-0.1, 0.45)];
      g.fill2(m, c, true);
      for (const [u, v, s] of [[-0.1, -0.15, 1], [1.2, -0.17, 0.85]]) g.disc2(eye(u, v), 0.3 * k * s, '#2A2420');
      g.line2(m, { w: 0.28, c: shade(c, 0.45), boil: false, close: true });
      g.segs2([fpt(-0.4, -0.2)[0], fpt(-0.4, -0.2)[1], fpt(-1.6, -0.6)[0], fpt(-1.6, -0.6)[1]], '#3A3128', 0.22);
    }
  }
  // headwear
  if (cr) {
    const c = cr;
    if (w.tricorn) {
      g.fill2([[c[0] - 3.6 * k, c[1] + 1.3 * k], [c[0] + 3.6 * k, c[1] + 1.3 * k], [c[0] + 2.6 * k, c[1] - 1.0 * k], [c[0], c[1] - 1.9 * k], [c[0] - 2.6 * k, c[1] - 1.0 * k]], w.tricorn, true);
      g.line2([[c[0] - 3.6 * k, c[1] + 1.3 * k], [c[0], c[1] + 0.4 * k], [c[0] + 3.6 * k, c[1] + 1.3 * k]], { w: 0.45, c: '#C9A44A', boil: false, ext: 0 });
    } else if (w.hat) {   // the plague doctor's wide brim
      g.fill2(arcPts(c[0], c[1] + 0.9 * k, 3.8 * k, 0, TAU, 14).map((q) => [q[0], c[1] + 0.9 * k + (q[1] - c[1] - 0.9 * k) * 0.3]), w.hat, true);
      g.fill2([[c[0] - 1.9 * k, c[1] + 0.9 * k], [c[0] + 1.9 * k, c[1] + 0.9 * k], [c[0] + 1.7 * k, c[1] - 1.6 * k], [c[0] - 1.7 * k, c[1] - 1.6 * k]], w.hat, true);
    } else if (w.jester) {
      const pts = [[c[0] - 2.2 * k, c[1] + 1.2 * k], [c[0] + 2.2 * k, c[1] + 1.2 * k]];
      const tips = [[-3.8, -2.6], [0.2, -4.4], [3.9, -2.4]];
      tips.forEach(([u, v], i) => { g.fill2([[c[0] - 1.4 * k + i * 1.4 * k, c[1] + 0.8 * k], [c[0] + i * 1.4 * k - 0.1 * k, c[1] + 0.6 * k], [c[0] + u * k, c[1] + v * k]], w.jester[i % 2], true); g.disc2([c[0] + u * k, c[1] + v * k], 0.55 * k, '#D9B24A'); });
      g.fill2([pts[0], pts[1], [c[0] + 2.0 * k, c[1] - 0.2 * k], [c[0] - 2.0 * k, c[1] - 0.2 * k]], w.jester[0], true);
    } else if (w.beanie) {
      g.fill2(arcPts(c[0], c[1] + 1.4 * k, 2.15 * k, Math.PI, TAU, 10).concat([[c[0] + 2.15 * k, c[1] + 1.6 * k], [c[0] - 2.15 * k, c[1] + 1.6 * k]]), w.beanie, true);
      g.fill2([[c[0] - 2.2 * k, c[1] + 0.9 * k], [c[0] + 2.2 * k, c[1] + 0.9 * k], [c[0] + 2.2 * k, c[1] + 1.8 * k], [c[0] - 2.2 * k, c[1] + 1.8 * k]], shade(w.beanie, 0.15), true);
      g.disc2([c[0], c[1] - 0.9 * k], 0.7 * k, shade(w.beanie, -0.2));
    } else if (w.fedora) {
      g.fill2(arcPts(c[0], c[1] + 0.9 * k, 3.0 * k, 0, TAU, 12).map((q) => [q[0], c[1] + 0.9 * k + (q[1] - c[1] - 0.9 * k) * 0.3]), w.fedora, true);
      g.fill2([[c[0] - 1.8 * k, c[1] + 0.9 * k], [c[0] + 1.8 * k, c[1] + 0.9 * k], [c[0] + 1.5 * k, c[1] - 1.2 * k], [c[0] - 1.5 * k, c[1] - 1.2 * k]], w.fedora, true);
      g.fill2([[c[0] - 1.8 * k, c[1] + 0.9 * k], [c[0] + 1.8 * k, c[1] + 0.9 * k], [c[0] + 1.75 * k, c[1] + 0.3 * k], [c[0] - 1.75 * k, c[1] + 0.3 * k]], '#2A2420', true);
    }
    if (w.plume) {   // a feathered headdress
      const pc = w.plume;
      for (const [a, l, s] of [[-0.5, 6.2, 1], [0.05, 7.4, 0.9], [0.55, 5.6, 1.1]]) {
        const tip = [c[0] + Math.sin(a) * l * k, c[1] - Math.cos(a) * l * k + 0.8 * k], base = [c[0] + sg * 0.6 * k, c[1] + 0.8 * k];
        const nx = -(tip[1] - base[1]), ny = tip[0] - base[0], nl = Math.hypot(nx, ny) || 1, wd = 0.9 * k * s;
        g.fill2([base, [lerp(base[0], tip[0], 0.5) + nx / nl * wd, lerp(base[1], tip[1], 0.5) + ny / nl * wd], tip, [lerp(base[0], tip[0], 0.5) - nx / nl * wd * 0.6, lerp(base[1], tip[1], 0.5) - ny / nl * wd * 0.6]], pc, true);
      }
      g.disc2([c[0] + sg * 0.5 * k, c[1] + 1.0 * k], 0.7 * k, '#D9B24A');
    }
  }
  // wading: the water over the feet and shins, ripples round the legs
  if (w.wade > 0.05) {
    const hgt = w.wade * VZ, wl = F[1] - hgt, wc = w.wadeCol || VN.flood, rx = 3.0 * k, ry = hgt + 1.1;
    const patch = [[F[0] - rx, wl]].concat(arcPts(F[0], wl, 1, Math.PI, 0, 12).map((q, i) => { const t = Math.PI - Math.PI * i / 12; return [F[0] + Math.cos(t) * rx, wl + Math.sin(t) * ry]; }));
    g.fill2(patch, wc, true);
    const rp = arcPts(F[0], wl, rx * 1.1, 0, TAU, 14).map((q) => [q[0], wl + (q[1] - wl) * 0.4]);
    g.line2(rp, { w: 0.32, c: '#EEF5F1', boil: false, close: true });
  }
  return r;
};
/* a walker on a closed route (VN.person, so the extras show); o: phase, z (number or fn), extra(g, st), who overrides */
VN.walker = function (T, who, pts, speed, o) {
  o = o || {}; const seg = [], L = [0];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const total = L[L.length - 1], per = total / speed;
  return T.actor({ sample: o.sample || 0.25, period: per, cast: o.cast,
    at(t) {
      let d = (((t * speed + (o.phase || 0) * total) % total) + total) % total, i = 0;
      while (i < seg.length - 1 && d > L[i + 1]) i++;
      const [a, b] = seg[i], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1];
      const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor((d / 2.4) % 1 * 8);
      const x = a[0] + dx * u, y = a[1] + dy * u, z = typeof o.z === 'function' ? o.z(x, y) : (o.z || 0);
      return { x, y, z, key: dir + '.' + ph, dir, ph: ph / 8 };
    },
    draw(g, st) { VN.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); if (o.extra) o.extra(g, st); } });
};
/* a pigeon (wide px, feet at p): pose 'peck' | 'stand' | 'fly' (wing phase f 0..3), fl: +1 faces right */
VN.pigeon = function (g, p, pose, f, fl) {
  const s = fl || 1, B = '#8E939A', D = '#6E737A';
  if (pose === 'fly') {
    const up = [-2.6, -1.2, 0.6, -0.6][f | 0];
    g.fill2([[p[0] - 1.4 * s, p[1]], [p[0] + 1.6 * s, p[1] - 0.4], [p[0] + 0.4 * s, p[1] + 0.8]], B, true);
    g.fill2([[p[0] - 0.4 * s, p[1] - 0.2], [p[0] + 0.6 * s, p[1] - 0.2], [p[0] - 0.6 * s, p[1] + up * 1.6 - 0.5]], D, true);
    g.fill2([[p[0] - 0.2 * s, p[1]], [p[0] + 0.8 * s, p[1]], [p[0] + 1.4 * s, p[1] + up * 1.2]], '#A9AEB4', true);
    g.disc2([p[0] + 1.7 * s, p[1] - 0.6], 0.5, D);
    return;
  }
  const hy = pose === 'peck' ? 0.1 : -1.6;
  g.fill2([[p[0] - 1.6 * s, p[1] - 1.2], [p[0] - 0.4 * s, p[1] - 2.0], [p[0] + 1.0 * s, p[1] - 1.6], [p[0] + 1.2 * s, p[1] - 0.8], [p[0] - 0.2 * s, p[1] - 0.4]], B, true);
  g.fill2([[p[0] - 0.8 * s, p[1] - 1.5], [p[0] + 0.5 * s, p[1] - 1.7], [p[0] - 0.2 * s, p[1] - 1.0]], D, true);
  g.disc2([p[0] + 1.3 * s, p[1] + hy - 0.2], 0.55, '#6E737A');
  g.disc2([p[0] + 1.25 * s, p[1] + hy + 0.35], 0.32, '#6F9A86');
  g.segs2([p[0] - 0.1, p[1] - 0.5, p[0] - 0.1, p[1], p[0] + 0.4, p[1] - 0.5, p[0] + 0.4, p[1]], '#C9584B', 0.28);
};
