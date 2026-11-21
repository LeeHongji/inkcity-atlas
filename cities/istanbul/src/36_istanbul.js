'use strict';
/* Istanbul's own kit: lead domes on drums, half-domes, pencil minarets with their balconies, mosques built from those
   parts, Ottoman wooden houses with bay windows (cumba), Levantine apartment blocks, shopfronts with Turkish signs,
   ferry piers (iskele), the erguvan (Judas tree) in bloom, tulip beds, the people of Istanbul (headscarves, simit
   sellers with trays on their heads, tea carriers, porters with towering loads), street cats, gulls, pigeons, the
   Turkish flag, and the vehicles: yellow taxi, dolmuş, city bus, the T1 tram, the red nostalgic tram, the ferry (vapur)
   built in parts so it slides under bridges, the Golden Horn ferry, the fishing kayık and the gilded fish-sandwich boat.
   Everything in tile-local u unless the name ends in 2 (wide px). */
const IS = {};
IS.WL = -2.6;                      // the water level of the Horn, the Bosphorus and the bay (a shallow trench)
IS.C = {
  lime: '#E7E0D0', limeL: '#F0EBDF', limeD: '#CDC3AE', stoneW: '#DCD3C0',
  lead: '#A3ACB3', leadD: '#838E97', leadL: '#BCC4C9', leadInk: '#4F5960',
  gold: '#D9AE4A', terra: '#C9744F', terraD: '#A85C3E',
  water: '#8CC2C0', waterD: '#73A9AA', waterL: '#B2D9D3', waterDeep: '#6D9FA3',
  quay: '#CEC6B4', quayD: '#ADA592', quayTop: '#DED7C6',
  asph: '#D6D1C5', pave: '#E9E3D5', paveD: '#DDD5C3',
  erg: '#C978B4', ergD: '#A95E97', ergL: '#DDA0CB',
  tulip: ['#D9443A', '#EBC03F', '#8A4FA0', '#E77FA0', '#F0EBDF', '#E0703C'],
  red: '#C8372D', redD: '#9E2A22', cream: '#F1E7CF',
  taxi: '#EDC23B', simit: '#B8773C', tea: '#B4452A', navy: '#2B3550',
};
IS.WALLS = ['#E9C97E', '#D98F6B', '#B9D0A4', '#E6B5A8', '#C9D9E2', '#EDE1BE', '#D7A35E', '#A9C3C9', '#E4CFA0', '#C88E7E'];

/* ---------------- small helpers ---------------- */
/* a gold finial (alem) at wide-px point p: a rod, two balls, a crescent opening upwards */
IS.alem2 = function (g, p, s) {
  s = s || 1;
  g.line2([p, [p[0], p[1] - 4.2 * s]], { w: 0.55, c: '#8C6A26', boil: false, ext: 0 });
  g.disc2([p[0], p[1] - 1.3 * s], 0.65 * s, IS.C.gold); g.disc2([p[0], p[1] - 2.6 * s], 0.5 * s, IS.C.gold);
  const c = [p[0], p[1] - 4.6 * s], r = 1.15 * s, out = [], inn = [];
  for (let i = 0; i <= 8; i++) { const a = Math.PI * 0.1 + Math.PI * 0.8 * i / 8; out.push([c[0] - Math.cos(a) * r, c[1] + Math.sin(a) * r - r * 0.9]); inn.push([c[0] - Math.cos(a) * r * 0.72, c[1] + Math.sin(a) * r * 0.62 - r * 0.75]); }
  g.fill2(out.concat(inn.reverse()), IS.C.gold, true);
};
/* points of a spherical cap patch: centre, radius r, height h above z0, longitudes th0..th1, latitude 0..lat1 */
IS.capPts = function (cx, cy, z0, r, h, th0, th1, lat1) {
  const P = [];
  for (let i = 0; i <= 10; i++) for (let j = 0; j <= 6; j++) {
    const th = lerp(th0, th1, i / 10), la = (lat1 == null ? Math.PI / 2 : lat1) * j / 6;
    P.push({ p: [cx + r * Math.cos(la) * Math.cos(th), cy + r * Math.cos(la) * Math.sin(th), z0 + h * Math.sin(la)], n: [Math.cos(la) * Math.cos(th), Math.cos(la) * Math.sin(th), Math.sin(la)] });
  }
  return P;
};
/* convex hull of wide-px points (monotone chain) */
IS.hull2 = function (pts) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
};
/* a half-dome: a quarter of an ellipsoid of radius r, height h, springing at z0 from the arch centred at (cx, cy) and
   bulging towards dir (radians). Lit where it faces +y and up, shaded where it faces +x. */
IS.semi = function (g, cx, cy, r, z0, h, dir, col, o) {
  o = o || {}; col = col || IS.C.lead;
  const P = IS.capPts(cx, cy, z0, r, h, dir - Math.PI / 2, dir + Math.PI / 2);
  const all = IS.hull2(P.map((q) => g.p.apply(g, q.p)));
  g.fill2(all, col);
  const sh = P.filter((q) => q.n[0] - q.n[1] * 0.4 > 0.35 && q.n[2] < 0.85).map((q) => g.p.apply(g, q.p));
  if (sh.length > 3) g.fill2(IS.hull2(sh), shade(col, 0.12));
  const hl = P.filter((q) => q.n[1] - q.n[0] > 0.4 && q.n[2] > 0.3 && q.n[2] < 0.8).map((q) => g.p.apply(g, q.p));
  if (hl.length > 3) g.fill2(IS.hull2(hl), shade(col, -0.18));
  // lead seams down the visible face
  const seams = [];
  for (let i = 1; i < 6; i++) {
    const th = dir - Math.PI / 2 + Math.PI * i / 6, nx = Math.cos(th), ny = Math.sin(th);
    if (nx + ny < -0.2) continue;
    for (let j = 0; j < 5; j++) { const a = Math.PI / 2 * j / 5, b = Math.PI / 2 * (j + 1) / 5, p0 = g.p(cx + r * Math.cos(a) * nx, cy + r * Math.cos(a) * ny, z0 + h * Math.sin(a)), p1 = g.p(cx + r * Math.cos(b) * nx, cy + r * Math.cos(b) * ny, z0 + h * Math.sin(b)); seams.push(p0[0], p0[1], p1[0], p1[1]); }
  }
  g.segs2(seams, shade(col, 0.2), 0.3);
  g.outline2(all, { w: o.w || 0.75, c: IS.C.leadInk, boil: false });
};
/* a lead dome on an arcaded drum. o: drum (height, 0 = none), h (dome height, default 0.95 r), win (windows in the
   drum's front), col, drumCol, alem (true) */
IS.dome = function (g, cx, cy, r, z0, o) {
  o = o || {}; const dh = o.drum == null ? r * 0.38 : o.drum, h = o.h || r * 0.95, col = o.col || IS.C.lead, dc = o.drumCol || IS.C.lime;
  if (dh > 0) {
    K.cyl(g, cx, cy, r * 1.04, z0, z0 + dh, dc, { w: o.w || 0.75, n: 16, nt: true, c: o.c });
    const n = o.win == null ? 7 : o.win;
    for (let i = 0; i < n; i++) {
      const a = A_L + (A_R - A_L) * (i + 0.5) / n, da = 0.13 * (7 / Math.max(5, n)), zz0 = z0 + dh * 0.22, zz1 = z0 + dh * 0.78, rr = r * 1.045, q = [];
      q.push([cx + rr * Math.cos(a - da), cy + rr * Math.sin(a - da), zz0], [cx + rr * Math.cos(a + da), cy + rr * Math.sin(a + da), zz0]);
      for (let k = 0; k <= 4; k++) { const t = Math.PI * k / 4, aa = a + da * Math.cos(t); q.push([cx + rr * Math.cos(aa), cy + rr * Math.sin(aa), zz1 + dh * 0.12 * Math.sin(t)]); }
      g.fill(q, '#4E5866');
    }
    // small buttresses between the windows
    const bs = []; for (let i = 0; i <= n; i++) { const a = A_L + (A_R - A_L) * i / n, p0 = g.p(cx + r * 1.06 * Math.cos(a), cy + r * 1.06 * Math.sin(a), z0), p1 = g.p(cx + r * 1.06 * Math.cos(a), cy + r * 1.06 * Math.sin(a), z0 + dh); bs.push(p0[0], p0[1], p1[0], p1[1]); }
    g.segs2(bs, shade(dc, 0.25), 0.4);
  }
  const zb = z0 + dh;
  K.dome(g, cx, cy, r, zb, h, col, { shadow: shade(col, 0.12), band: true, ribs: o.ribs == null ? 12 : o.ribs, ribCol: shade(col, 0.2), ribW: 0.35, c: IS.C.leadInk, w: o.w || 0.85 });
  // a pale highlight on the upper left
  const d = K.domePts(g, cx, cy, zb, r, h), hl = [];
  for (let i = 0; i <= 8; i++) { const t = Math.PI * (0.62 + 0.22 * i / 8); hl.push([d.c[0] + d.a * 0.78 * Math.cos(t), d.c[1] - d.b * 0.78 * Math.sin(t)]); }
  g.line2(hl, { w: Math.max(0.6, r * 0.18), c: shade(col, -0.35), boil: false, ext: 0, taper: 1 });
  if (o.alem !== false) IS.alem2(g, g.p(cx, cy, zb + h), Math.min(1.3, 0.45 + r * 0.09));
  return zb + h;
};
/* a pencil minaret: square base, polygonal shaft, balconies (şerefe) with railings, a tall lead cone, the alem.
   o: r (shaft radius), base (height of the square base), bal: [z...] balcony heights, col */
IS.minaret = function (g, x, y, h, o) {
  o = o || {}; const r = o.r || 0.85, col = o.col || IS.C.limeL, base = o.base == null ? h * 0.12 : o.base, cone = o.cone || h * 0.17, top = h - cone;
  const bal = o.bal || [top - h * 0.12];
  K.box(g, x - r * 1.35, y - r * 1.35, x + r * 1.35, y + r * 1.35, o.z0 || 0, (o.z0 || 0) + base, { t: IS.C.lime, l: col, r: shade(col, 0.1) }, { w: 0.6 });
  let z = (o.z0 || 0) + base;
  for (let i = 0; i <= bal.length; i++) {
    const zb = i < bal.length ? (o.z0 || 0) + bal[i] : (o.z0 || 0) + top, rr = r * (1 - 0.06 * i);
    K.cyl(g, x, y, rr, z, zb, { t: col, l: col, r: shade(col, 0.12) }, { n: 10, w: 0.55, nt: true });
    if (i < bal.length) {
      // the balcony: a corbelled ring (dark underside), a parapet with a fretted railing
      K.cyl(g, x, y, rr * 1.75, zb - 0.55, zb, { t: col, l: shade(col, 0.22), r: shade(col, 0.3) }, { n: 12, w: 0.45, nt: true });
      K.cyl(g, x, y, rr * 1.75, zb, zb + 0.75, { t: col, l: col, r: shade(col, 0.1) }, { n: 12, w: 0.45 });
      const rl = []; for (let k = 0; k < 7; k++) { const a = A_L + (A_R - A_L) * (k + 0.5) / 7, p0 = g.p(x + rr * 1.76 * Math.cos(a), y + rr * 1.76 * Math.sin(a), zb + 0.12), p1 = g.p(x + rr * 1.76 * Math.cos(a), y + rr * 1.76 * Math.sin(a), zb + 0.62); rl.push(p0[0], p0[1], p1[0], p1[1]); }
      g.segs2(rl, shade(col, 0.35), 0.3);
      z = zb + 0.75;
    }
  }
  // the cone: a lead pencil
  const ap = g.p(x, y, (o.z0 || 0) + h), bpts = g.P(K.arc(x, y, (o.z0 || 0) + top, r * 1.05, A_R, A_L, 10));
  g.fill2(bpts.concat([ap]), o.coneCol || IS.C.lead); g.fill2(bpts.slice(0, 5).concat([ap]), shade(o.coneCol || IS.C.lead, 0.14));
  g.line2([bpts[0], ap], { w: 0.6, c: IS.C.leadInk, boil: false }); g.line2([bpts[10], ap], { w: 0.6, c: IS.C.leadInk, boil: false });
  IS.alem2(g, ap, 0.75);
};
/* a row of arches on a face: piers, round arches, a dark interior (a portico or arcade) */
IS.arcade = function (g, face, p, a0, a1, z0, z1, n, o) {
  o = o || {}; const col = o.col || IS.C.lime, dark = o.dark || '#6E6658', w = (a1 - a0) / n;
  for (let i = 0; i < n; i++) {
    const b0 = a0 + w * i + w * 0.14, b1 = a0 + w * (i + 1) - w * 0.14, r = (b1 - b0) / 2, m = (b0 + b1) / 2, zc = z1 - r - (z1 - z0) * 0.08, q = [K.pt(face, p, b0, z0), K.pt(face, p, b1, z0)];
    for (let k = 0; k <= 8; k++) { const t = Math.PI * k / 8; q.push(K.pt(face, p, m + r * Math.cos(t), zc + r * Math.sin(t) * (o.pointed ? 1.25 : 1))); }
    g.fill(q, dark);
    if (o.inner) o.inner(g, b0, b1, z0, zc);
    g.line(q.slice(2), { w: 0.45, c: shade(col, 0.5), boil: false, ext: 0 });
  }
};
/* a mosque from its parts. o: cx, cy (centre of the prayer hall), s (half-size of the hall), H (wall height),
   R (central dome radius), semis: list of directions with half-domes ('x+','x-','y+','y-'), mins: [[x, y, h, nbal]],
   corner (small corner domes), towers (weight towers at the central square's corners), col (stone), win rows */
IS.mosque = function (g, o) {
  const cx = o.cx, cy = o.cy, s = o.s, H = o.H, R = o.R, col = o.col || { t: IS.C.lime, l: IS.C.limeL, r: IS.C.limeD };
  const sx = o.sx || s, sy = o.sy || s;
  g.boilP = 0.3;
  K.box(g, cx - sx, cy - sy, cx + sx, cy + sy, 0, H, col, { w: 0.9 });
  // two rows of arched windows on the visible walls, a cornice
  const rows = o.rows || [[H * 0.18, H * 0.42], [H * 0.56, H * 0.8]];
  for (const [f, p, a0, a1] of [['L', cy + sy, cx - sx, cx + sx], ['R', cx + sx, cy - sy, cy + sy]]) {
    const n = Math.max(3, Math.round((a1 - a0) / 2.6));
    for (let i = 0; i < n; i++) { const b0 = a0 + (a1 - a0) * (i + 0.28) / n, b1 = a0 + (a1 - a0) * (i + 0.72) / n; for (const [z0, z1] of rows) K.win(g, f, p + 0.02, b0, b1, z0, z1, { style: 'navy', arch: true, col: '#4E5866', w: 0.3, skips: false }); }
    g.fill(K.on(f, p + 0.03, a0, a1, H - 0.55, H), shade(typeof col === 'object' ? col.l : col, 0.08));
  }
  const zs = H + 0.4, zc = H + (o.drumZ || R * 0.75);
  const semi = (d) => { const a = { 'x+': 0, 'y+': Math.PI / 2, 'x-': Math.PI, 'y-': -Math.PI / 2 }[d], c = [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; IS.semi(g, c[0], c[1], R * 0.98, zs, R * 0.82, a, o.lead); };
  const cdome = (sxx, syy) => { const c = [cx + sxx * R * 1.5, cy + syy * R * 1.5]; IS.dome(g, c[0], c[1], R * 0.42, zs, { drum: R * 0.18, win: 4, ribs: 0, alem: true, w: 0.6 }); };
  const semis = o.semis || [];
  // back to front: back corner, back half-domes, side corners, the central block, front half-domes, front corner
  if (o.corner) cdome(-1, -1);
  for (const d of ['x-', 'y-']) if (semis.indexOf(d) >= 0) semi(d);
  if (o.corner) { cdome(1, -1); cdome(-1, 1); }
  // the central square: tympanum walls where there are no half-domes, weight towers at its corners
  const tw = (sxx, syy) => { const x = cx + sxx * R * 0.98, y = cy + syy * R * 0.98; K.cyl(g, x, y, R * 0.2, zs - 0.4, zc + R * 0.15, col, { n: 8, w: 0.55 }); IS.dome(g, x, y, R * 0.21, zc + R * 0.15, { drum: 0, h: R * 0.28, ribs: 0, w: 0.45 }); };
  if (o.towers) { tw(-1, -1); tw(1, -1); tw(-1, 1); }
  K.box(g, cx - R * 0.92, cy - R * 0.92, cx + R * 0.92, cy + R * 0.92, zs - 0.4, zc, col, { w: 0.75 });
  for (const [f, p, a0, a1] of [['L', cy + R * 0.92, cx - R * 0.7, cx + R * 0.7], ['R', cx + R * 0.92, cy - R * 0.7, cy + R * 0.7]]) {
    const n = 5; for (let i = 0; i < n; i++) { const b0 = a0 + (a1 - a0) * (i + 0.25) / n, b1 = a0 + (a1 - a0) * (i + 0.75) / n; K.win(g, f, p + 0.02, b0, b1, zs + (zc - zs) * 0.3, zc - (zc - zs) * 0.18, { style: 'navy', arch: true, col: '#4E5866', w: 0.3, skips: false }); }
  }
  const top = IS.dome(g, cx, cy, R, zc, { drum: R * 0.3, win: 9, h: R * (o.domeH || 0.9) });
  for (const d of ['x+', 'y+']) if (semis.indexOf(d) >= 0) semi(d);
  if (o.towers) tw(1, 1);
  if (o.corner) cdome(1, 1);
  return top;
};
/* a portico: a row of small domes on an arcade along a face of the hall, with its own roof line.
   along 'x' at y = yy (the arcade faces +y), from x0 to x1, depth d */
IS.portico = function (g, x0, x1, yy, d, H, o) {
  o = o || {}; const n = o.n || Math.max(2, Math.round((x1 - x0) / (d * 1.1)));
  K.box(g, x0, yy - d, x1, yy, 0, H, { t: IS.C.lime, l: IS.C.limeL, r: IS.C.limeD }, { w: 0.75, nt: true });
  g.fill(K.rect(x0, yy - d, x1, yy, H), IS.C.lime);
  IS.arcade(g, 'L', yy + 0.02, x0, x1, 0, H - 0.6, n, { dark: '#5E584E' });
  const w = (x1 - x0) / n;
  for (let i = 0; i < n; i++) IS.dome(g, x0 + w * (i + 0.5), yy - d / 2, Math.min(w, d) * 0.42, H, { drum: 0.4, win: 0, h: Math.min(w, d) * 0.38, ribs: 0, alem: false, w: 0.5 });
};

/* ---------------- houses and shops ---------------- */
/* a timber Ottoman house: a stone ground floor, upper floors in painted boards projecting over the street with a
   bay window (cumba) on the 'L' face, white-framed sash windows, a hipped terracotta roof with wide eaves */
IS.konak = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const fl = o.floors || 3, fh = o.fh || 4.4, col = o.col || IS.WALLS[0], H = fl * fh;
  const tone = { t: shade(col, -0.1), l: col, r: shade(col, 0.12) };
  K.box(g, x0, y0, x1, y1, 0, fh, { t: IS.C.stoneW, l: '#DCD2BE', r: '#C9BEA8' }, { w: 0.8 });
  K.box(g, x0, y0, x1 + 0.5, y1 + 0.6, fh, H, tone, { w: 0.85 });
  // boards
  const bd = []; for (let z = fh + 0.7; z < H - 0.2; z += 0.7) { const a = g.p(x0, y1 + 0.62, z), b = g.p(x1 + 0.5, y1 + 0.62, z); bd.push(a[0], a[1], b[0], b[1]); const c = g.p(x1 + 0.52, y1 + 0.6, z), d = g.p(x1 + 0.52, y0, z); bd.push(c[0], c[1], d[0], d[1]); }
  g.segs2(bd, shade(col, 0.16), 0.25);
  // the cumba: a bay on the L face over the upper floors
  const W = x1 - x0, b0 = x0 + W * 0.3, b1 = x0 + W * 0.7;
  if (o.cumba !== false && W > 5) {
    K.box(g, b0, y1 + 0.6, b1, y1 + 1.8, fh + 0.6, H - 0.3, tone, { w: 0.7 });
    for (let f = 1; f < fl; f++) K.win(g, 'L', y1 + 1.82, b0 + 0.4, b1 - 0.4, f * fh + 1.4, f * fh + 3.6, { style: 'glass', lc: '#F6F3EA', w: 0.45 });
  }
  for (let f = 1; f < fl; f++) {
    for (const a of (o.cumba !== false && W > 5) ? [x0 + 0.6, b1 + 0.5] : [x0 + 0.7, x0 + W / 2 + 0.3]) if (a + 1.6 < x1) K.win(g, 'L', y1 + 0.63, a, a + 1.5, f * fh + 1.2, f * fh + 3.4, { style: 'glass', lc: '#F6F3EA', w: 0.45 });
    for (let a = y0 + 0.8; a + 1.5 < y1; a += 3) K.win(g, 'R', x1 + 0.52, a, a + 1.4, f * fh + 1.2, f * fh + 3.4, { style: 'glass', lc: '#F6F3EA', w: 0.45 });
  }
  // the ground floor: a door, a shop or a small window
  K.win(g, 'L', y1 + 0.02, x0 + W * 0.15, x0 + W * 0.15 + 2.0, 0, 3.4, { style: 'dark', col: o.door || '#6B4A33', w: 0.45 });
  if (o.shop) IS.shop(g, 'L', y1, x0 + W * 0.15 + 2.6, x1 - 0.5, Object.assign({ z1: fh - 0.6 }, o.shop));
  K.hip(g, x0 - 0.6, y0 - 0.6, x1 + 1.1, y1 + 1.4, H, o.roofH || 2.3, o.roof || IS.C.terra, { ridge: Math.max(0, Math.abs((x1 - x0) - (y1 - y0)) * 0.6), c: '#7A3E26', w: 0.8 });
};
/* a Levantine apartment block (Pera): stone, a rusticated ground floor of shops, balconies with iron rails,
   pilasters and a heavy cornice, a flat roof with chimneys */
IS.apt = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const fl = o.floors || 5, fh = o.fh || 4.2, col = o.col || '#E7DCC6', H = fl * fh + 0.6;
  const tone = { t: shade(col, -0.1), l: col, r: shade(col, 0.12) };
  K.box(g, x0, y0, x1, y1, 0, H, tone, { w: 0.9 });
  const faces = o.faces || ['L', 'R'];
  for (const f of faces) {
    const p = f === 'L' ? y1 : x1, a0 = f === 'L' ? x0 : y0, a1 = f === 'L' ? x1 : y1, n = Math.max(2, Math.round((a1 - a0) / 3.2));
    g.fill(K.on(f, p + 0.02, a0, a1, 0, fh), shade(col, 0.06));
    for (let fl_ = 1; fl_ < fl; fl_++) {
      for (let i = 0; i < n; i++) { const b0 = a0 + (a1 - a0) * (i + 0.22) / n, b1 = a0 + (a1 - a0) * (i + 0.78) / n; K.win(g, f, p + 0.02, b0, b1, fl_ * fh + 0.9, fl_ * fh + 3.3, { style: 'glass', arch: fl_ === fl - 1, lc: shade(col, 0.55), w: 0.4 }); }
      if (fl_ === 2 || (o.balc && fl_ % 2 === 0)) {   // a balcony slab and its iron rail across the middle bays
        const m0 = a0 + (a1 - a0) * 0.2, m1 = a0 + (a1 - a0) * 0.8, z = fl_ * fh + 0.5, P = (a, d, zz) => f === 'L' ? [a, p + d, zz] : [p + d, a, zz];
        g.fill([P(m0, 0, z), P(m1, 0, z), P(m1, 1.0, z), P(m0, 1.0, z)], shade(col, -0.05)); g.fill([P(m0, 1.0, z - 0.3), P(m1, 1.0, z - 0.3), P(m1, 1.0, z), P(m0, 1.0, z)], shade(col, 0.15));
        const rl = []; for (let a = m0; a <= m1 + 0.01; a += 0.5) { const q0 = g.p.apply(g, P(a, 1.0, z)), q1 = g.p.apply(g, P(a, 1.0, z + 1.2)); rl.push(q0[0], q0[1], q1[0], q1[1]); } g.segs2(rl, '#3A3530', 0.3);
        g.line([P(m0, 1.0, z + 1.2), P(m1, 1.0, z + 1.2)], { w: 0.4, c: '#3A3530', boil: false, ext: 0 });
      }
    }
    g.fill(K.on(f, p + 0.04, a0, a1, H - 1.0, H - 0.4), shade(col, -0.08)); g.line([K.pt(f, p + 0.05, a0, H - 1.0), K.pt(f, p + 0.05, a1, H - 1.0)], { w: 0.4, c: shade(col, 0.45), boil: false });
    if (o.shops) { const ns = Math.max(1, Math.round((a1 - a0) / 6)); for (let i = 0; i < ns; i++) { const s = o.shops[(i + (f === 'R' ? 1 : 0)) % o.shops.length]; IS.shop(g, f, p, a0 + (a1 - a0) * i / ns + 0.4, a0 + (a1 - a0) * (i + 1) / ns - 0.4, Object.assign({ z1: fh - 0.5 }, s)); } }
  }
  K.box(g, x0 + 1, y0 + 1, x0 + 2.2, y0 + 2.2, H, H + 2.2, '#C9B9A0', { w: 0.5 });
};
/* a shopfront on a face: a dark glazed front, a sign board with a word, an optional awning and goods outside.
   o: word, sign (board colour), aw (awning colour), stripe, goods (fn(g, P) with P(a, d, z) on the face), z1 */
IS.shop = function (g, face, p, a0, a1, o) {
  o = o || {}; const z1 = o.z1 || 3.8, P = (a, d, z) => face === 'L' ? [a, p + d, z] : [p + d, a, z];
  g.fill(K.on(face, p + 0.03, a0, a1, 0, z1 - 1.1), o.glass || '#5C6670');
  const segs = []; for (let a = a0 + 1.4; a < a1 - 0.3; a += 1.4) { const q0 = g.p.apply(g, P(a, 0.05, 0)), q1 = g.p.apply(g, P(a, 0.05, z1 - 1.1)); segs.push(q0[0], q0[1], q1[0], q1[1]); }
  g.segs2(segs, '#3A3530', 0.3);
  if (o.lit) g.fill(K.on(face, p + 0.04, a0 + 0.3, a1 - 0.3, 0.9, z1 - 1.5), o.lit);
  if (o.word) K.sign(g, face, p + 0.02, a0, a1, z1 - 1.1, z1, o.sign || '#2E5E8A', o.word, { w: 0.35 });
  if (o.aw) {
    const out = o.out || 1.6, z = z1 - 1.15, drop = 0.9, q = [P(a0, 0, z), P(a1, 0, z), P(a1, out, z - drop), P(a0, out, z - drop)];
    g.fill(q, o.aw);
    if (o.stripe) { const n = Math.max(2, Math.round((a1 - a0) / 1.1)); for (let i = 0; i < n; i += 2) { const s0 = lerp(a0, a1, i / n), s1 = lerp(a0, a1, (i + 1) / n); g.fill([P(s0, 0, z), P(s1, 0, z), P(s1, out, z - drop), P(s0, out, z - drop)], o.stripe); } }
    const v = [P(a0, out, z - drop), P(a1, out, z - drop), P(a1, out, z - drop - 0.5), P(a0, out, z - drop - 0.5)];
    g.fill(v, shade(o.aw, 0.12)); g.outline(q, { w: 0.45, c: shade(o.aw, 0.5), boil: false }); g.line([v[3], v[2]], { w: 0.4, c: shade(o.aw, 0.5), boil: false });
  }
  if (o.goods) o.goods(g, P, a0, a1);
};
/* goods: a pile of round things (fruit, simit, spice cones) on a tray box at a point on a face */
IS.pile2 = function (g, c, w, h, cols, seed) {
  const R = RNG(seed || 1), d = [];
  g.fill2([[c[0] - w, c[1]], [c[0] + w, c[1]], [c[0] + w * 0.8, c[1] - h * 0.4], [c[0] - w * 0.8, c[1] - h * 0.4]], '#B48A5A', true);
  for (let i = 0; i < Math.round(w * 2.4); i++) { const x = c[0] + (R() - 0.5) * w * 1.6, y = c[1] - h * 0.4 - R() * h * 0.6 * (1 - Math.abs(x - c[0]) / w); g.disc2([x, y], 0.55 + R() * 0.25, R.pick(cols)); }
  void d;
};
/* a spice cone heap (wide px base centre c, radius w, height h) */
IS.cone2 = function (g, c, w, h, col) { g.fill2([[c[0] - w, c[1]], [c[0] + w, c[1]], [c[0], c[1] - h]], col, true); g.fill2([[c[0] + w * 0.1, c[1]], [c[0] + w, c[1]], [c[0], c[1] - h]], shade(col, 0.15), true); };

/* ---------------- piers ---------------- */
/* a ferry pier (iskele): a timber deck on piles over the water with a pavilion of white walls, green shutters and a
   hipped lead roof; the name on a board facing the water side. fp = [x0, y0, x1, y1] (the deck), building box b,
   name, side ('x' the berth faces -x, 'y' the berth faces -y) */
IS.iskele = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const WL = IS.WL, b = o.b || [x0 + 1, y0 + 1, x1 - 1, y1 - 1], H = o.H || 6.5;
  // piles under the visible edges
  const piles = [];
  for (let x = x0 + 0.6; x < x1; x += 2.4) piles.push([x, y1 - 0.3]);
  for (let y = y0 + 0.6; y < y1; y += 2.4) piles.push([x1 - 0.3, y]);
  for (const [x, y] of piles) { const a = g.p(x, y, WL), c = g.p(x, y, -0.5); g.fill2([[a[0] - 0.7, a[1]], [a[0] + 0.7, a[1]], [c[0] + 0.7, c[1]], [c[0] - 0.7, c[1]]], '#6B5E4E'); }
  // the deck
  K.box(g, x0, y0, x1, y1, -0.5, 0, { t: '#C9B08A', l: '#A68B66', r: '#8E7656' }, { w: 0.7 });
  const pl = []; for (let x = x0 + 1; x < x1; x += 1) { const a = g.p(x, y0, 0.01), c = g.p(x, y1, 0.01); pl.push(a[0], a[1], c[0], c[1]); } g.segs2(pl, '#B39872', 0.25);
  // the pavilion
  const wall = { t: '#E9E3D3', l: '#F4F0E6', r: '#DDD6C5' };
  K.box(g, b[0], b[1], b[2], b[3], 0, H, wall, { w: 0.8 });
  for (const [f, p, a0, a1] of [['L', b[3], b[0], b[2]], ['R', b[2], b[1], b[3]]]) {
    const n = Math.max(2, Math.round((a1 - a0) / 3));
    for (let i = 0; i < n; i++) { const c0 = a0 + (a1 - a0) * (i + 0.25) / n, c1 = a0 + (a1 - a0) * (i + 0.75) / n; K.win(g, f, p + 0.02, c0, c1, 1.2, H - 1.4, { style: 'glass', arch: true, w: 0.4 }); }
  }
  K.hip(g, b[0] - 0.9, b[1] - 0.9, b[2] + 0.9, b[3] + 0.9, H, o.roofH || 3, o.roof || '#8E9AA2', { ridge: 2, c: IS.C.leadInk, w: 0.75 });
  if (o.clock) { const c = g.p(o.clock[0], o.clock[1], H + 4.4); K.box(g, o.clock[0] - 1.1, o.clock[1] - 1.1, o.clock[0] + 1.1, o.clock[1] + 1.1, H, H + 5.2, wall, { w: 0.6 }); K.hip(g, o.clock[0] - 1.4, o.clock[1] - 1.4, o.clock[0] + 1.4, o.clock[1] + 1.4, H + 5.2, 2.2, '#8E9AA2', { c: IS.C.leadInk, w: 0.6 }); g.disc2([c[0] - 1.6, c[1] + 2.0], 1.25, '#FBF8EE'); g.ring2([c[0] - 1.6, c[1] + 2.0], 1.25, { w: 0.35, c: '#3A3530' }); g.segs2([c[0] - 1.6, c[1] + 2.0, c[0] - 1.6, c[1] + 1.1, c[0] - 1.6, c[1] + 2.0, c[0] - 1.0, c[1] + 2.2], '#3A3530', 0.3); }
  if (o.name) { const f = o.nameFace || 'L', p = f === 'L' ? b[3] : b[2], a0 = f === 'L' ? b[0] : b[1], a1 = f === 'L' ? b[2] : b[3]; K.sign(g, f, p + 0.03, a0 + (a1 - a0) * 0.12, a1 - (a1 - a0) * 0.12, H - 1.25, H - 0.15, '#1F4E79', o.name, { w: 0.35 }); }
  // bollards on the berth edge
  for (const q of (o.bollards || [])) { const c = g.p(q[0], q[1], 0); g.fill2([[c[0] - 0.8, c[1]], [c[0] + 0.8, c[1]], [c[0] + 0.7, c[1] - 2.2], [c[0] - 0.7, c[1] - 2.2]], '#3A3530'); }
};

/* ---------------- plants ---------------- */
/* an erguvan (Judas tree) in full April bloom: a dark crooked trunk, a lumpy crown of magenta-pink blossom */
IS.erguvan = function (g, x, y, o) {
  o = o || {}; const r = (o.r || 4.2) * 3.2, h = o.h == null ? 4 : o.h, f = g.p(x, y, o.z || 0), top = [f[0] + 0.5, f[1] - h * VZ], R = RNG(Math.round(x * 41 + y * 13 + 7));
  const col = o.col || IS.C.erg, dk = shade(col, 0.15);
  g.fill2([[f[0] - 1.0, f[1]], [f[0] + 1.0, f[1]], [top[0] + 0.6, top[1]], [top[0] - 0.6, top[1]]], '#5A4038');
  g.line2([[top[0], top[1] + 1], [top[0] - r * 0.4, top[1] - r * 0.4]], { w: 0.8, c: '#5A4038', boil: false }); g.line2([[top[0], top[1] + 1.5], [top[0] + r * 0.45, top[1] - r * 0.3]], { w: 0.7, c: '#5A4038', boil: false });
  const cy = top[1] - r * 0.55, lobes = [[-r * 0.42, r * 0.06, r * 0.55], [r * 0.4, 0, r * 0.56], [0, -r * 0.3, r * 0.6], [r * 0.02, r * 0.18, r * 0.5]];
  lobes.map(([dx, dy, rr]) => { const pts = [], a0 = R() * TAU; for (let k = 0; k < 9; k++) { const a = a0 + TAU * k / 9, q = rr * (0.85 + R() * 0.28); pts.push([top[0] + dx + Math.cos(a) * q, cy + dy + Math.sin(a) * q * 0.82]); } return pts; })
    .map((b) => ({ b, cy: b.reduce((s, p) => s + p[1], 0) / b.length })).sort((p, q) => p.cy - q.cy).forEach(({ b }) => {
      const cxx = b.reduce((s, p) => s + p[0], 0) / b.length, cyy = b.reduce((s, p) => s + p[1], 0) / b.length;
      g.fill2(b, col);
      const sh = b.filter((p) => (p[0] - cxx) * 0.5 + (p[1] - cyy) > 0); if (sh.length > 2) g.fill2(sortAround(sh.concat([[cxx, cyy + 1]])), dk);
      g.outline2(b, { c: '#7E3F6C', w: 0.6, ext: 0.2 });
    });
  const fl = []; for (let i = 0; i < 22; i++) { const a = R() * TAU, d = R() * r * 0.8, px = top[0] + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.72; fl.push(px - 0.35, py, px + 0.35, py); }
  g.segs2(fl, '#F2D3E8', 0.7);
  const lf = []; for (let i = 0; i < 6; i++) { const a = R() * TAU, d = R() * r * 0.75, px = top[0] + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.7; lf.push(px, py, px + 0.9, py - 0.4); }
  g.segs2(lf, '#7FA65A', 0.5);
};
/* a plane tree in new leaf */
IS.plane = function (g, x, y, o) { o = o || {}; K.tree(g, x, y, Object.assign({ r: 5, h: 5.5, col: '#9CC46E', ink: '#4F7036' }, o)); };
/* a bed of tulips: rows of cups on stems (wide px marks); cast, so they pop in alive */
IS.tulips = function (g, x0, y0, x1, y1, cols, o) {
  o = o || {}; const R = RNG(Math.round(x0 * 31 + y0 * 77 + x1 * 3)), sp = o.sp || 1.05;
  const stems = [], items = [];
  for (let x = x0 + sp / 2; x < x1; x += sp) for (let y = y0 + sp / 2; y < y1; y += sp) {
    const p = g.p(x + (R() - 0.5) * 0.4, y + (R() - 0.5) * 0.4, o.z || 0), col = cols[Math.floor(((x - x0) / sp + (o.band ? 0 : (y - y0) / sp * 0.5)) / (o.band || 2)) % cols.length];
    items.push([p, col, 2.2 + R() * 0.8]);
  }
  items.sort((a, b) => a[0][1] - b[0][1]);
  for (const [p] of items) stems.push(p[0], p[1], p[0], p[1] - 2.2);
  g.segs2(stems, '#5E8A3E', 0.45);
  const lv = []; for (const [p] of items) lv.push(p[0], p[1] - 0.2, p[0] - 0.9, p[1] - 1.4);
  g.segs2(lv, '#76A24E', 0.6);
  for (const [p, col, hh] of items) { const c = [p[0], p[1] - hh]; g.fill2([[c[0] - 0.75, c[1] - 1.2], [c[0] - 0.25, c[1] - 0.6], [c[0], c[1] - 1.3], [c[0] + 0.25, c[1] - 0.6], [c[0] + 0.75, c[1] - 1.2], [c[0] + 0.6, c[1] + 0.1], [c[0] - 0.6, c[1] + 0.1]], col, true); }
};

/* ---------------- people ---------------- */
const IS_TOPS = ['#C9584B', '#3F5F8F', '#E6C24F', '#F0EDE4', '#3B3F47', '#8E79C0', '#5FA58F', '#B9A27D', '#7FB7D9', '#E7A9A0', '#6C7A89', '#A4C66B', '#DD8E4A', '#2F343B', '#C9A0C9', '#F3F1EA'];
const IS_SCARF = ['#C9584B', '#3F5F8F', '#E8D9B8', '#8E79C0', '#5FA58F', '#D98AA4', '#2F343B', '#B9A27D', '#E6C24F', '#7FB7D9'];
/* an Istanbul citizen: varied, many dark-haired, some women in headscarves, some men with moustaches, light jackets */
IS.who = function (seed, o) {
  const R = RNG(seed * 4813 + 17), w = K.who(seed);
  w.skin = R.pick([SKIN[0], SKIN[1], SKIN[1], SKIN[2], SKIN[2], SKIN[3], '#E9C4A2']);
  const hr = R(); w.hair = hr < 0.62 ? R.pick(['#2B2420', '#3D2B1F', '#1F1A18']) : hr < 0.86 ? R.pick(['#5A3A24', '#7B4E2C']) : R.pick(['#8E8A84', '#B9B3A8', '#A8743D']);
  w.top = R.pick(IS_TOPS); w.bot = R.pick(['#3F4D63', '#2F343B', '#4A5A78', '#6B7B8C', '#5A4A3C', '#B9A27D', '#3B3F47', '#7A6A55']);
  if (R() < 0.3) w.jacket = R.pick(['#F3F1EA', '#E7E2D6', '#C9584B', '#7FB7D9']);
  w.bare = R() < 0.18; w.shorts = false;
  if (R() < 0.22) { w.scarf = R.pick(IS_SCARF); w.hairStyle = 'bun'; w.beard = false; if (R() < 0.6) w.dress = R.pick(['#3B3F47', '#5A6B7A', '#8E79C0', '#B9A27D', '#3F5F8F', '#6E5A44']); w.bare = false; }
  else if (R() < 0.3 && (w.hairStyle === 'short' || w.hairStyle === 'buzz')) w.beard = true;
  if (R() < 0.05) w.cap = R.pick(['#3B3F47', '#6E5A44']);
  return Object.assign(w, o || {});
};
/* K.person plus the Istanbul extras drawn on its returned points: a headscarf, a simit tray carried on the head, a tea
   tray hung from the hand, a porter's towering load, a fishing cap */
IS.person = function (g, x, y, z, w) {
  const k = w.k || 1, dir = w.dir | 0, back = dir >= 2, sg = (dir === 0 || dir === 3) ? 1 : -1, F = g.p(x, y, z || 0);
  if (w.load && !back) IS.load2(g, [F[0] - sg * 3.0 * k, F[1] - 12.5 * k], w.load, k, sg);
  const r = K.person(g, x, y, z, w);
  const H = r.head, R2 = r.headR / 1.92, s = (u, v) => [H[0] + sg * u * R2, H[1] + v * R2];
  if (w.scarf) {
    const pts = back ? [s(-2.6, 2.6), s(-2.7, -0.9), s(-1.5, -2.95), s(0.4, -3.15), s(2.1, -2.3), s(2.7, -0.5), s(2.5, 2.4), s(0, 3.0)]
      : [s(-2.55, 2.8), s(-2.65, -1.0), s(-1.45, -2.95), s(0.4, -3.15), s(2.05, -2.35), s(2.6, -0.8), s(2.4, 0.6), s(1.85, -0.6), s(0.6, -1.25), s(-0.6, -1.1), s(-1.1, 0.4), s(-0.4, 2.2), s(1.4, 2.0), s(0.4, 3.1), s(-1.6, 3.2)];
    g.fill2(K.curve(pts, 2, true), w.scarf, true); g.line2(K.curve(pts, 2, true), { w: 0.3, c: shade(w.scarf, 0.5), close: true, boil: false, wob: 0.3 });
  }
  if (w.tray) {   // a round wooden tray of simit balanced on a cloth pad on the head
    const c = [r.crown[0], r.crown[1] - 0.4 * k], rx = 4.6 * k, ry = 1.5 * k;
    g.fill2(arcPts(c[0], c[1], 1, 0, TAU, 14).map((q) => [c[0] + (q[0] - c[0]) * rx, c[1] + (q[1] - c[1]) * ry]), '#C9A26B', true);
    const sm = []; for (let i = 0; i < 9; i++) { const a = TAU * i / 9, rr = i < 6 ? 0.62 : 0.25, px = c[0] + Math.cos(a) * rx * rr, py = c[1] - 0.7 * k + Math.sin(a) * ry * rr - (i >= 6 ? 0.9 * k : 0); sm.push([px, py]); }
    sm.sort((a, b) => a[1] - b[1]);
    for (const q of sm) { g.fill2(arcPts(q[0], q[1], 1, 0, TAU, 10).map((p) => [q[0] + (p[0] - q[0]) * 1.35 * k, q[1] + (p[1] - q[1]) * 0.75 * k]), IS.C.simit, true); g.fill2(arcPts(q[0], q[1], 1, 0, TAU, 8).map((p) => [q[0] + (p[0] - q[0]) * 0.5 * k, q[1] + (p[1] - q[1]) * 0.28 * k]), '#8A5428', true); }
    g.line2(arcPts(c[0], c[1], 1, 0, Math.PI, 10).map((q) => [c[0] + (q[0] - c[0]) * rx, c[1] + (q[1] - c[1]) * ry]), { w: 0.35, c: '#6B4F35', boil: false });
  }
  if (w.teatray) {   // a swinging brass tray of tulip glasses hung from three arms, held in the near hand
    const h0 = r.hands[0], c = [h0[0], h0[1] + 3.2 * k];
    g.segs2([h0[0], h0[1], c[0] - 2.2 * k, c[1], h0[0], h0[1], c[0] + 2.2 * k, c[1], h0[0], h0[1], c[0], c[1] + 0.4 * k], '#B48A3A', 0.3);
    g.fill2(arcPts(c[0], c[1], 1, 0, TAU, 12).map((q) => [c[0] + (q[0] - c[0]) * 2.6 * k, c[1] + (q[1] - c[1]) * 0.8 * k]), '#D9AE4A', true);
    for (const dx of [-1.3, 0, 1.3]) IS.glass2(g, [c[0] + dx * k, c[1] - 0.1 * k], 0.85 * k);
  }
  if (w.load && back) IS.load2(g, [r.shoulders[0][0] * 0.5 + r.shoulders[1][0] * 0.5, r.shoulders[0][1] + 3 * k], w.load, k, sg);
  if (w.fcap) { const c = r.crown; g.fill2([[c[0] - 2.1 * k, c[1] + 1.3 * k], [c[0] + 2.1 * k, c[1] + 1.3 * k], [c[0] + 1.5 * k, c[1] - 0.4 * k], [c[0] - 1.6 * k, c[1] - 0.3 * k]], w.fcap, true); g.fill2([[c[0] + sg * 1.2 * k, c[1] + 1.0 * k], [c[0] + sg * 3.4 * k, c[1] + 1.5 * k], [c[0] + sg * 1.4 * k, c[1] + 1.7 * k]], shade(w.fcap, 0.2), true); }
  if (w.phone) { const hd = r.hands[0]; g.fill2([[hd[0] - 0.45, hd[1] - 1.1], [hd[0] + 0.45, hd[1] - 1.1], [hd[0] + 0.45, hd[1] + 0.3], [hd[0] - 0.45, hd[1] + 0.3]], '#2A2622', true); }
  if (w.cup) IS.glass2(g, [r.hands[0][0], r.hands[0][1] + 0.4], 0.9 * k);
  return r;
};
/* a tulip-shaped tea glass with dark red tea on a little saucer, wide px base point p */
IS.glass2 = function (g, p, s) {
  s = s || 1;
  g.fill2([[p[0] - 1.0 * s, p[1]], [p[0] + 1.0 * s, p[1]], [p[0] + 0.8 * s, p[1] - 0.3 * s], [p[0] - 0.8 * s, p[1] - 0.3 * s]], '#E9E2D2', true);
  g.fill2([[p[0] - 0.45 * s, p[1] - 0.3 * s], [p[0] + 0.45 * s, p[1] - 0.3 * s], [p[0] + 0.25 * s, p[1] - 1.1 * s], [p[0] + 0.5 * s, p[1] - 2.0 * s], [p[0] - 0.5 * s, p[1] - 2.0 * s], [p[0] - 0.25 * s, p[1] - 1.1 * s]], IS.C.tea, true);
  g.fill2([[p[0] - 0.5 * s, p[1] - 2.0 * s], [p[0] + 0.5 * s, p[1] - 2.0 * s], [p[0] + 0.55 * s, p[1] - 2.4 * s], [p[0] - 0.55 * s, p[1] - 2.4 * s]], '#F2E8DA', true);
};
/* a porter's (hamal) load on the back: a pad and a towering stack of bundles, boxes or a rolled carpet. wide px */
IS.load2 = function (g, c, kind, k, sg) {
  const R = RNG(hstr(String(kind)) + 3), cols = kind === 'carpet' ? ['#A8372E', '#7A2E3A', '#C9844A', '#3F4F7A'] : ['#C9A26B', '#B58F58', '#D9C49A', '#E9DFC6', '#A88458'];
  let y = c[1] + 2.0 * k; const pts = [];
  const n = kind === 'carpet' ? 4 : 5;
  for (let i = 0; i < n; i++) { const w = (3.2 + R() * 1.4) * k, hh = (2.4 + R() * 1.0) * k, x = c[0] + (R() - 0.5) * 0.8 * k; pts.push([x, y, w, hh, R.pick(cols)]); y -= hh * 0.92; }
  for (const [x, yy, w, hh, col] of pts) {
    const q = [[x - w / 2, yy], [x + w / 2, yy], [x + w / 2 + 0.3 * sg, yy - hh], [x - w / 2 + 0.3 * sg, yy - hh]];
    g.fill2(q, col, true); g.fill2([[x + w * 0.2, yy], [x + w / 2, yy], [x + w / 2 + 0.3 * sg, yy - hh], [x + w * 0.2 + 0.3 * sg, yy - hh]], shade(col, 0.12), true);
    g.outline2(q, { w: 0.35, c: '#5A4630', boil: false });
    if (kind === 'carpet') g.segs2([x - w / 2 + 0.5, yy - hh / 2, x + w / 2 - 0.5, yy - hh / 2], '#E9C46A', 0.35);
    else g.segs2([x, yy, x + 0.3 * sg, yy - hh], '#6B4F35', 0.3);
  }
};
/* a passenger seen as a bust (on ferry decks): shoulders, neck, head with hair or a scarf */
IS.bust2 = function (g, p, w, k) {
  k = k || 1; const s = (u, v) => [p[0] + u * k, p[1] + v * k];
  g.fill2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], w.top, true);
  g.fill2([s(-0.55, -4.6), s(0.55, -4.6), s(0.5, -5.8), s(-0.5, -5.8)], shade(w.skin, 0.12), true);
  g.disc2(s(0, -7.6), 1.95 * k, w.skin);
  if (w.scarf) g.fill2(K.curve([s(-2.2, -5.4), s(-2.3, -8.0), s(-1.2, -9.7), s(0.6, -9.9), s(2.1, -8.6), s(2.3, -6.6), s(1.6, -5.2), s(1.4, -7.6), s(0, -8.3), s(-1.3, -7.6), s(-1.4, -5.2)], 2, true), w.scarf, true);
  else g.fill2(K.curve([s(-2.05, -7.2), s(-1.9, -8.9), s(0, -9.75), s(1.9, -8.9), s(2.05, -7.3), s(1.2, -8.2), s(-1.0, -8.25)], 2, true), w.hair, true);
  g.disc2(s(-0.6, -7.4), 0.22 * k, '#2A2420'); g.disc2(s(0.65, -7.4), 0.2 * k, '#2A2420');
  g.outline2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], { w: 0.35, c: '#3A3128', boil: false });
};

/* ---------------- cats, gulls, pigeons ---------------- */
IS.CATS = [{ b: '#E39A55', s: '#B86B2E' }, { b: '#F3F0E8', s: '#2E2A26', patch: true }, { b: '#8E8E8A', s: '#5E5E5A' }, { b: '#2E2A26', s: '#1A1816' }, { b: '#F3EBDD', s: '#E39A55', patch: true }, { b: '#C9B79A', s: '#7E6A52' }];
/* a street cat at wide px foot point p. pose 'sit' | 'loaf' | 'walk' (ph 0..1) | 'stretch'; fl = +1 faces right, -1 left */
IS.cat2 = function (g, p, o) {
  o = o || {}; const c = IS.CATS[(o.c || 0) % IS.CATS.length], k = o.k || 1, fl = o.fl || 1, ink = '#3A3128';
  const P = (u, v) => [p[0] + fl * u * k, p[1] + v * k], PP = (a) => a.map((q) => P(q[0], q[1]));
  const sh = (pts, col) => { const q = K.curve(PP(pts), 2, true); g.fill2(q, col, true); return q; };
  const pose = o.pose || 'sit';
  let head, body;
  if (pose === 'sit') {
    g.line2(PP([[-1.6, -0.3], [-3.0, -0.2], [-3.4, -1.4]]), { w: 0.75, c: c.s, boil: false, wob: 0.2 });
    body = sh([[-1.9, 0], [-2.1, -2.4], [-1.0, -4.4], [0.6, -4.6], [1.3, -3.2], [1.2, 0]], c.b); head = [0.4, -5.6];
  } else if (pose === 'loaf') {
    body = sh([[-2.8, 0], [-2.9, -1.8], [-1.4, -2.7], [1.6, -2.6], [2.6, -1.4], [2.5, 0]], c.b); head = [2.2, -2.8];
    g.line2(PP([[-2.7, -0.4], [-1.0, 0.2], [0.8, 0.1]]), { w: 0.7, c: c.s, boil: false, wob: 0.2 });
  } else if (pose === 'stretch') {
    body = sh([[-3.2, -1.6], [-2.9, -3.0], [-1.0, -2.6], [1.8, -1.6], [2.8, -1.0], [2.6, -0.2], [-2.6, -0.6]], c.b); head = [2.6, -1.9];
    g.line2(PP([[-3.0, -2.6], [-4.4, -3.8], [-4.6, -5.0]]), { w: 0.75, c: c.s, boil: false, wob: 0.2 });
    g.segs2(PP([[2.4, -0.4], [3.6, -0.1], [1.2, -0.6], [2.4, -0.1]]).flat(), c.b, 0.7);
  } else {   // walk: four legs on a cycle, tail up
    const ph = (o.ph || 0) * TAU, lg = (u, a) => { const q = P(u, -1.5), e = P(u + Math.sin(ph + a) * 0.7, 0); g.line2([q, e], { w: 0.6, c: shade(c.b, 0.2), boil: false, ext: 0 }); };
    lg(-1.6, 0); lg(1.5, Math.PI);
    body = sh([[-2.6, -1.4], [-2.4, -2.9], [0, -3.1], [2.2, -2.8], [2.4, -1.4], [0, -1.2]], c.b); head = [2.7, -3.5];
    lg(-1.3, Math.PI); lg(1.8, 0);
    g.line2(PP([[-2.4, -2.4], [-3.4, -3.6], [-3.2, -5.0], [-2.6, -5.4]]), { w: 0.75, c: c.s, boil: false, wob: 0.2 });
  }
  if (c.patch) g.fill2(PP([[-1.4, -2.2], [-0.4, -3.4], [0.6, -2.6], [-0.4, -1.4]]), c.s, true);
  else { const st = []; for (let i = 0; i < 3; i++) { const a = P(-1.2 + i * 0.9, -3.4 + (pose === 'loaf' ? 1.6 : 0) + (pose === 'walk' ? 0.6 : 0)), b = P(-0.9 + i * 0.9, -2.4 + (pose === 'loaf' ? 1.2 : 0)); st.push(a[0], a[1], b[0], b[1]); } g.segs2(st, c.s, 0.4); }
  g.line2(body, { w: 0.4, c: ink, close: true, boil: false, wob: 0.25 });
  const hc = P(head[0], head[1]);
  const hp = [P(head[0] - 1.25, head[1] + 0.2), P(head[0] - 1.1, head[1] - 0.9), P(head[0] - 1.0, head[1] - 2.0), P(head[0] - 0.3, head[1] - 1.1), P(head[0] + 0.4, head[1] - 1.2), P(head[0] + 1.1, head[1] - 2.0), P(head[0] + 1.15, head[1] - 0.8), P(head[0] + 1.25, head[1] + 0.3), P(head[0], head[1] + 1.0)];
  g.fill2(hp, c.patch ? c.s : c.b, true); g.outline2(hp, { w: 0.35, c: ink, boil: false });
  g.disc2(P(head[0] + 0.45, head[1] - 0.1), 0.2 * k, '#2A2420'); if (!o.side) g.disc2(P(head[0] - 0.45, head[1] - 0.1), 0.2 * k, '#2A2420');
  void hc;
};
/* a static cat as a cast object at tile-local (x, y, z) */
IS.cat = function (T, x, y, z, o) { T.cast([x, y], (g) => IS.cat2(g, g.p(x, y, z || 0), o), { on: true }); };
/* a cat strolling a closed route (tile-local points), stopping now and then to sit */
IS.catWalk = function (T, pts, o) {
  o = o || {}; const seg = [], L = [0];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const tot = L[L.length - 1], sp = o.speed || 1.1, walkT = tot / sp, sitT = o.sit || 6, per = walkT + sitT;
  return T.actor({ sample: 0.3, period: per,
    at(t) {
      let u = (((t + (o.phase || 0) * per) % per) + per) % per, sit = u > walkT; const d = sit ? tot * ((o.stop || 0.5)) : u * sp;
      let i = 0; while (i < seg.length - 1 && d > L[i + 1]) i++;
      const [a, b] = seg[i], f = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1], fl = (dx - dy) >= 0 ? 1 : -1;
      if (sit && d < tot) { /* sit where the stop falls */ }
      const ph = Math.floor((d / 1.2) % 1 * 6);
      return { x: a[0] + dx * f, y: a[1] + dy * f, z: o.z || 0, key: (sit ? 's' : 'w' + ph) + fl, fl, pose: sit ? 'sit' : 'walk', ph: ph / 6 };
    },
    draw(g, st) { IS.cat2(g, g.p(0, 0, 0), { c: o.c || 0, pose: st.pose, ph: st.ph, fl: st.fl }); } });
};
/* a gull: flapping wings, wide px origin */
IS.gull2 = function (g, o, f) { const w = [3.4, 2.6, 1.3, 2.6][f], d = [1.5, 0.4, -0.7, 0.4][f]; g.fill2([[o[0] - 0.9, o[1]], [o[0] + 0.9, o[1] - 0.2], [o[0] + 0.6, o[1] + 0.6], [o[0] - 0.6, o[1] + 0.6]], '#F6F4EE', true); g.line2([[o[0] - w, o[1] - d], [o[0] - 0.7, o[1] - 0.2], [o[0], o[1] + 0.3], [o[0] + 0.7, o[1] - 0.2], [o[0] + w, o[1] - d]], { w: 0.5, c: '#3A3530', boil: false, wob: 0.2 }); };
/* gulls circling a point that may move (fn(t) -> {x, y} tile-local, or null) */
IS.gulls = function (T, n, centre, o) {
  o = o || {};
  for (let i = 0; i < n; i++) T.actor(Object.assign(o.cast === undefined ? {} : { cast: o.cast }, { layer: 'top', sample: 0.4, period: o.period || 30, grow: false,
    at(t) { const c = centre(t); if (!c) return null; const a = t * (0.55 + i * 0.08) + i * 2.1, f = Math.floor(t * 6 + i * 1.3) % 4, r = (o.r || 6) + (i % 3) * 1.6; return { x: c.x + Math.cos(a) * r + (o.dx || 0), y: c.y + Math.sin(a) * r * 0.7 + (o.dy || 0), z: (o.z || 12) + (i % 3) * 2.2 + Math.sin(a * 1.7) * 1.2, key: f, f, alpha: c.alpha }; },
    draw(g, st) { IS.gull2(g, g.p(0, 0, 0), st.f); } }));
};
/* a pigeon pecking (wide px) */
IS.pigeon2 = function (g, p, fl, up) { const s = (u, v) => [p[0] + fl * u, p[1] + v]; g.fill2([s(-1.4, -0.6), s(-0.6, -1.6), s(0.8, -1.5), s(1.4, up ? -2.4 : -0.9), s(0.8, -0.2), s(-0.8, -0.2)], '#8C929C', true); g.disc2(s(up ? 1.4 : 1.6, up ? -2.6 : -0.7), 0.55, '#6E7480'); g.fill2([s(-1.4, -0.6), s(-2.2, -0.9), s(-1.6, -0.3)], '#5E646E', true); g.segs2([...s(-0.2, -0.2), ...s(-0.2, 0.4), ...s(0.3, -0.2), ...s(0.3, 0.4)], '#C9584B', 0.3); };

/* ---------------- the Turkish flag ---------------- */
/* a flag actor flying from a pole top at tile-local (x, y, z): red, a white crescent and star, along +x (wind from the
   north-west in the picture's terms: the cloth streams to the lower right) */
IS.flag = function (T, x, y, z, o) {
  o = o || {}; const L = o.L || 3.6, Hh = o.H || 2.4;
  return T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 6 + (o.ph || 0) * 6) % 8; return { x, y, z, key: f, f }; },
    draw(g, st) {
      const ph = st.f / 8, P = (u, v) => { const q = g.p(u * L * (o.dir === 'y' ? 0 : 1), u * L * (o.dir === 'y' ? 1 : 0), -v * Hh - u * 0.25); return [q[0], q[1] + Math.sin(TAU * (u * 0.9 - ph)) * 0.75 * u]; };
      const out = []; for (let i = 0; i <= 8; i++) out.push(P(i / 8, 0)); for (let i = 8; i >= 0; i--) out.push(P(i / 8, 1));
      g.fill2(out, IS.C.red);
      const c = P(0.36, 0.5), c2 = P(0.42, 0.5), r = Hh * VZ * 0.26, star = P(0.56, 0.5);
      g.fill2(arcPts(c[0], c[1], r, 0, TAU, 14), '#F6F3EA', true); g.fill2(arcPts(c2[0] + 0.3, c2[1], r * 0.8, 0, TAU, 14), IS.C.red, true);
      const sp = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + Math.PI * i / 5, rr = i % 2 ? r * 0.25 : r * 0.6; sp.push([star[0] + Math.cos(a) * rr, star[1] + Math.sin(a) * rr]); } g.fill2(sp, '#F6F3EA', true);
      g.line2(out.slice(0, 9), { w: 0.3, c: '#7A2A22', boil: false, wob: 0.2 });
    } });
};
IS.pole = function (g, x, y, z0, h) { const a = g.p(x, y, z0), b = g.p(x, y, z0 + h); g.line2([a, b], { w: 0.55, c: '#4A4540', boil: false, ext: 0 }); g.disc2(b, 0.45, IS.C.gold); };

/* ---------------- street things ---------------- */
/* a red simit cart: a glass case on two wheels with the rings stacked inside and SİMİT on the side. faces ang */
IS.simitCart = function (g, x, y, o) {
  o = o || {}; const f = o.face || 'L';
  const draw = (g2) => {
    K.box(g2, -1.3, -1.9, 1.3, 1.9, 1.2, 2.4, { t: '#B9322A', l: '#C8372D', r: '#9E2A22' }, { w: 0.6, boil: false });
    K.box(g2, -1.1, -1.7, 1.1, 1.7, 2.4, 4.6, { t: '#F3EDE0', l: 'rgba(225,236,236,0.9)', r: 'rgba(205,220,222,0.9)' }, { w: 0.5, boil: false });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const p = g2.p(0.9, -1.2 + j * 1.2, 2.9 + i * 0.6); g2.fill2(arcPts(p[0], p[1], 1, 0, TAU, 10).map((q) => [p[0] + (q[0] - p[0]) * 1.2, p[1] + (q[1] - p[1]) * 0.55]), IS.C.simit, true); }
    K.box(g2, -1.3, -1.9, 1.3, 1.9, 4.6, 5.0, { t: '#C8372D', l: '#B9322A', r: '#9E2A22' }, { w: 0.5, boil: false });
    K.text(g2, 'R', 1.32, -1.6, 1.45, 0.75, 'SİMİT', '#F6F3EA', { w: 0.3 });
    const wh = g2.p(1.32, 0, 0.75); g2.ring2(wh, 2.0, { w: 0.6, c: '#2E2A26' }); g2.disc2(wh, 0.4, '#2E2A26');
  };
  g.at(x, y, o.z || 0, draw, f === 'L');
};
/* a low café table with two or three stools and tea glasses; sitters are drawn by the caller */
IS.teaTable2 = function (g, x, y, z) {
  const c = g.p(x, y, (z || 0) + 1.6);
  K.cyl(g, x, y, 0.15, z || 0, (z || 0) + 1.5, '#5A4A3C', { n: 6, w: 0.4, nt: true });
  g.fill2(arcPts(c[0], c[1], 1, 0, TAU, 14).map((q) => [c[0] + (q[0] - c[0]) * 3.3, c[1] + (q[1] - c[1]) * 1.6]), '#E9E2D2', true);
  g.line2(arcPts(c[0], c[1], 1, 0, TAU, 14).map((q) => [c[0] + (q[0] - c[0]) * 3.3, c[1] + (q[1] - c[1]) * 1.6]), { w: 0.35, c: '#6B6458', close: true, boil: false });
  IS.glass2(g, [c[0] - 1.1, c[1] + 0.3], 0.7); IS.glass2(g, [c[0] + 1.0, c[1] - 0.1], 0.7);
};
/* a stool (wide px top centre) */
IS.stool2 = function (g, p, col) { g.fill2([[p[0] - 1.6, p[1]], [p[0] + 1.6, p[1]], [p[0] + 1.6, p[1] + 0.7], [p[0] - 1.6, p[1] + 0.7]], col || '#C9A26B', true); g.segs2([p[0] - 1.3, p[1] + 0.7, p[0] - 1.4, p[1] + 4.0, p[0] + 1.3, p[1] + 0.7, p[0] + 1.4, p[1] + 4.0], '#6B4F35', 0.45); };
/* an Istanbul street lamp: a dark green post with a lantern */
IS.lamp = function (g, x, y, o) { o = o || {}; const f = g.p(x, y, o.z || 0), t = g.p(x, y, (o.z || 0) + (o.h || 8.5)); g.fill2([[f[0] - 0.8, f[1]], [f[0] + 0.8, f[1]], [f[0] + 0.5, f[1] - 2.5], [f[0] - 0.5, f[1] - 2.5]], '#2F4A3E'); g.line2([[f[0], f[1] - 2.4], t], { w: 0.7, c: '#2F4A3E', boil: false, ext: 0 }); g.fill2([[t[0] - 1.1, t[1]], [t[0] + 1.1, t[1]], [t[0] + 1.4, t[1] - 3], [t[0] - 1.4, t[1] - 3]], '#F2E3A6'); g.fill2([[t[0] - 1.7, t[1] - 3], [t[0] + 1.7, t[1] - 3], [t[0], t[1] - 4.4]], '#2F4A3E'); g.outline2([[t[0] - 1.1, t[1]], [t[0] + 1.1, t[1]], [t[0] + 1.4, t[1] - 3], [t[0] - 1.4, t[1] - 3]], { w: 0.4, c: '#2F4A3E', boil: false }); };

/* ---------------- vehicles ---------------- */
/* a yellow Istanbul taxi with the TAKSİ light on the roof */
IS.taxi = function (g, ang) {
  K.car(g, ang, { col: IS.C.taxi, roof: (gg, cab) => { const B = K.rbox(gg, cab.cx, cab.cy, 0.55, 1.1, ang + Math.PI / 2, 4.8, 5.5, '#F3F1EA', { w: 0.4, nb: true }); for (const f of ['pu', 'nu', 'pv', 'nv']) if (B.vis[f]) { const q = B.quad(f, -0.85, 0.85, 4.9, 5.4); gg.fill(q, '#2E2A26'); } } });
};
/* a yellow dolmuş minibus with a black-and-white checked band */
IS.dolmus = function (g, ang) {
  const col = '#F0C93C', L = 6.0, Wd = 2.55, ca = Math.cos(ang), sa = Math.sin(ang);
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  K.wheels(g, sh, [-L * 0.62, L * 0.62], 1.0, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.9, 5.4, { t: '#F3EFE3', l: col, r: shade(col, 0.14) }, { w: 0.85 });
  for (const f of ['pv', 'nv']) if (B.vis[f]) { for (let i = 0; i < 12; i++) g.fill(B.quad(f, -1 + i / 6, -1 + (i + 0.5) / 6, 2.4, 2.8), '#2E2A26'); for (let i = 0; i < 4; i++) K.rwin(g, B, f, -0.9 + i * 0.46, -0.9 + i * 0.46 + 0.38, 3.2, 4.8); }
  K.rwin(g, B, 'pu', -0.85, 0.85, 3.1, 4.9); K.rwin(g, B, 'nu', -0.85, 0.85, 3.2, 4.8);
  K.wheels(g, sh, [-L * 0.62, L * 0.62], 1.0, 'near', { arch: '#3F3A34' });
  K.lights(g, B, 1.6); void ca; void sa;
};
/* a red-and-white city bus */
IS.bus = function (g, ang) { K.bus(g, ang, { col: '#F3F1EA', band: '#C8372D', L: 7.4 }); };
/* one section of the T1 tram (Alstom Citadis): white with a dark blue band and a red skirt, big windows; cab +1/-1
   puts a rounded driver's end at +u / -u; panto: a pantograph on this section */
IS.t1Car = function (g, ang, o) {
  o = o || {}; const hl = o.hl || 4.4, hw = 2.2, z0 = 0.5, z1 = 5.6, cab = o.cab || 0;
  K.rbox(g, 0, 0, hl * 0.9, hw * 0.75, ang, 0.1, z0 + 0.1, { t: '#4A4540', l: '#4A4540', r: '#3A3530' }, { w: 0.4, line: false });
  const B = K.rbox(g, 0, 0, hl, hw, ang, z0, z1, { t: '#E4E2DC', l: '#F6F5F0', r: '#DDDAD2' }, { w: 0.75, nb: true });
  for (const f of ['pv', 'nv']) if (B.vis[f]) {
    g.fill(B.quad(f, -1, 1, z0, z0 + 0.55), '#C8372D');
    g.fill(B.quad(f, -1, 1, z0 + 1.7, z0 + 1.95), IS.C.navy);
    for (const [a, b] of [[-0.92, -0.56], [-0.44, -0.08], [0.04, 0.4], [0.52, 0.9]]) K.rwin(g, B, f, a, b, z0 + 2.15, z1 - 0.55, { col: '#C9D9E2' });
    for (const d of [-0.5, 0.46]) g.fill(B.quad(f, d - 0.04, d + 0.04, z0 + 0.6, z1 - 0.5), '#9AA3A8');
  }
  for (const f of ['pu', 'nu']) if (B.vis[f]) {
    const isCab = (f === 'pu' && cab > 0) || (f === 'nu' && cab < 0);
    if (isCab) { g.fill(B.quad(f, -0.85, 0.85, z0 + 2.0, z1 - 0.3), '#2E3238'); g.fill(B.quad(f, -1, 1, z0, z0 + 0.55), '#C8372D'); for (const s of [-0.65, 0.65]) g.fill(B.quad(f, s - 0.14, s + 0.14, z0 + 1.0, z0 + 1.35), f === 'pu' ? '#F6E7A8' : '#D0483A'); K.textP(g, (a, z) => { const q = B.quad(f, a, a, z, z)[0]; return q; }, -0.55, z1 - 0.95, 0.5, 'T1', '#F6E7A8', { w: 0.3 }); }
    else g.fill(B.quad(f, -0.4, 0.4, z0 + 0.3, z1 - 0.4), '#5A564E');
  }
  if (o.panto) { const ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z); const a = P(-0.9, 0, z1), b = P(0.9, 0, z1), c = P(0, 0, z1 + 1.6), l = P(-0.2, -1.0, z1 + 1.65), r = P(-0.2, 1.0, z1 + 1.65); g.segs2([a[0], a[1], c[0], c[1], b[0], b[1], c[0], c[1], l[0], l[1], r[0], r[1]], '#3A3530', 0.4); }
};
/* the red nostalgic tram (İstiklal, Kadıköy): red body, cream window band, open platforms at both ends with a rail,
   a trolley pole, riders in the windows and a kid or two hanging on the back step. ph: the kids' wave */
IS.nostTram = function (g, ang, o) {
  o = o || {}; const hl = 4.6, hw = 1.35, z0 = 0.7, z1 = 5.6, ca = Math.cos(ang), sa = Math.sin(ang), red = o.col || '#B8322A';
  const P = (u, v, z) => [u * ca - v * sa, u * sa + v * ca, z];
  const sh = K.rbox(g, 0, 0, hl + 1.4, hw, ang, 0, 0.01, red, { line: false, nt: true }); K.shadow(g, sh);
  K.wheels(g, sh, [-2.4, 2.4], 0.7, 'far');
  // the platforms
  for (const s of [-1, 1]) K.rbox(g, s * (hl + 0.75) * ca, s * (hl + 0.75) * sa, 0.75, hw * 0.95, ang, z0, z0 + 0.4, { t: '#7A5A3C', l: '#5A4030', r: '#4A3428' }, { w: 0.45 });
  const B = K.rbox(g, 0, 0, hl, hw, ang, z0, z1, { t: '#E9DFC6', l: red, r: shade(red, 0.15) }, { w: 0.8, nb: true });
  for (const f of ['pv', 'nv']) if (B.vis[f]) {
    g.fill(B.quad(f, -1, 1, z0 + 2.2, z1 - 0.5), IS.C.cream);
    for (let i = 0; i < 5; i++) { const a = -0.9 + i * 0.37; K.rwin(g, B, f, a, a + 0.28, z0 + 2.45, z1 - 0.8, { col: '#DCE6E8', glint: false }); }
    g.fill(B.quad(f, -1, 1, z0 + 1.3, z0 + 1.55), '#E3C46A');
    K.textP(g, (a, z) => B.quad(f, a, a, z, z)[0], -0.5, z0 + 0.45, 0.62, o.word || 'TÜNEL-TAKSİM', '#F1E7CF', { w: 0.3 });
    // riders' heads in the windows
    for (let i = 0; i < 5; i += 2) { const q = B.quad(f, -0.76 + i * 0.37, -0.76 + i * 0.37, z0 + 3.0, z0 + 3.0)[0], p = g.p(q[0], q[1], q[2]); g.disc2(p, 1.35, ['#E8BE9A', '#D9A57B', '#F2D3B8'][i % 3]); g.fill2(arcPts(p[0], p[1] - 0.4, 1.4, Math.PI, TAU, 6), ['#2B2420', '#5A3A24', '#8E8A84'][i % 3], true); }
  }
  for (const f of ['pu', 'nu']) if (B.vis[f]) { g.fill(B.quad(f, -0.7, 0.7, z0 + 2.4, z1 - 0.8), '#DCE6E8'); g.fill(B.quad(f, -0.25, 0.25, z0 + 1.0, z0 + 1.6), '#F6E7A8'); }
  // the roof: a clerestory, the trolley pole
  K.rbox(g, 0, 0, hl * 0.8, hw * 0.55, ang, z1, z1 + 0.6, { t: shade(IS.C.cream, 0.08), l: IS.C.cream, r: shade(IS.C.cream, 0.12) }, { w: 0.5 });
  { const a = g.p.apply(g, P(-hl * 0.4, 0, z1 + 0.6)), b = g.p.apply(g, P(-hl * 1.4, 0, z1 + 5.4)); g.line2([a, b], { w: 0.5, c: '#3A3530', boil: false, ext: 0 }); g.disc2(b, 0.5, '#3A3530'); }
  // platform rails and the kids on the back step
  for (const s of [-1, 1]) { const rl = [P(s * (hl + 1.45), -hw, z0 + 2.4), P(s * (hl + 1.45), hw, z0 + 2.4)]; g.line(rl, { w: 0.45, c: '#3A3530', boil: false, ext: 0 }); }
  K.wheels(g, sh, [-2.4, 2.4], 0.7, 'near', { arch: '#3F3A34' });
  if (o.kids) {
    const back = -(o.dirSign || 1), dir = (ca * back + sa * back > 0) ? ((ca - sa) * back > 0 ? 0 : 1) : ((ca - sa) * back > 0 ? 3 : 2);
    o.kids.forEach((w, i) => { const v = (i - 0.5) * 1.3, p = P(back * (hl + 1.25), v, z0 + 0.4); const F = g.p(p[0], p[1], p[2]); IS.person(g, p[0], p[1], p[2], Object.assign({}, w, { dir, pose: 'wave', ph: ((o.ph || 0) + i * 0.5) % 1, k: 0.74, reach: undefined })); void F; });
  }
};

/* ---------------- boats in parts ----------------
   A boat is a list of primitives laid out along its length u (bow at +u) and across it v, heights z above the water.
   Each part [u0, u1] is drawn by its own actor anchored at its own centre, so a long hull slides under a bridge or past
   a pier piece by piece. Primitives: { box: [ua, ub], hw, vc, z: [z0, z1], col } · { bow: [ua, ub], hw, z, col, top }
   · { stern: [ua, ub], hw, z, col, top } (a rounded counter) · { band: [ua, ub], hw, z, col } (painted on the visible
   side) · { at: u, fn(g, P, vis) } (anything else, drawn in the part that contains u). */
IS.boatPart = function (g, prims, ang, u0, u1, cu) {
  const ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => [(u - cu) * ca - v * sa, (u - cu) * sa + v * ca, z];
  const side = (-sa + ca) > 0 ? 1 : -1, vis = { side, bow: ca + sa > 0 };
  const taper = (p, wd) => {
    const a = Math.max(p[0], u0), b = Math.min(p[1], u1); if (b - a < 0.01) return;
    const col = K.tones(p.col), z0 = p.z[0], z1 = p.z[1], n = 4;
    const pts = (s, z) => { const r = []; for (let i = 0; i <= n; i++) { const u = lerp(a, b, i / n); r.push(P(u, s * wd(u), z)); } return r; };
    const sideQ = pts(side, z0).concat(pts(side, z1).reverse()); g.fill(sideQ, mix(col.l, col.r, vis.bow === (p.bow != null) ? 0.2 : 0.7)); g.outline(sideQ, { w: 0.5, boil: false });
    const top = pts(-1, z1).concat(pts(1, z1).reverse()); g.fill(top, p.top || col.t); g.outline(top, { w: 0.45, boil: false });
  };
  for (const p of prims) {
    if (p.box) {
      const a = Math.max(p.box[0], u0), b = Math.min(p.box[1], u1); if (b - a < 0.01) continue;
      const c = P((a + b) / 2, p.vc || 0, 0);
      K.rbox(g, c[0], c[1], (b - a) / 2, p.hw, ang, p.z[0], p.z[1], p.col, { w: p.w == null ? 0.55 : p.w, nb: true, nt: p.nt });
    } else if (p.band) {
      const a = Math.max(p.band[0], u0), b = Math.min(p.band[1], u1); if (b - a < 0.01) continue;
      const v = side * (p.hw + 0.03); g.fill([P(a, v, p.z[0]), P(b, v, p.z[0]), P(b, v, p.z[1]), P(a, v, p.z[1])], p.col);
    } else if (p.bow) { const q = p.bow; taper(Object.assign({}, p, { 0: q[0], 1: q[1] }), (u) => p.hw * Math.sqrt(clamp((q[1] - u) / (q[1] - q[0]), 0, 1))); }
    else if (p.stern) { const q = p.stern; taper(Object.assign({}, p, { 0: q[0], 1: q[1] }), (u) => p.hw * Math.sqrt(clamp(1 - Math.pow((q[1] - u) / (q[1] - q[0]), 2) * 0.55, 0.3, 1)) * clamp(0.55 + 0.45 * (u - q[0]) / (q[1] - q[0]), 0, 1)); }
    else if (p.at != null) { if (p.at < u0 || p.at >= u1) continue; p.fn(g, P, vis); }
  }
};
/* make a boat's part actors. state(t) -> {x, y, ang (bow heading), alpha, k (key suffix)} | null for the boat's centre */
IS.boatActors = function (T, prims, parts, state, o) {
  o = o || {}; const nq = o.nq || 64;
  return parts.map(([u0, u1]) => {
    const cu = (u0 + u1) / 2;
    return T.actor(Object.assign(o.cast === undefined ? {} : { cast: o.cast }, { grow: false, sample: o.sample || 0.25, period: o.period || 90, bias: o.bias || 0,
      at(t) {
        const s = state(t); if (!s) return null;
        const q = Math.round(s.ang / (TAU / nq)), a = q * TAU / nq;
        return { x: s.x + cu * Math.cos(a), y: s.y + cu * Math.sin(a), z: IS.WL, key: (((q % nq) + nq) % nq) + (s.k ? '.' + s.k : ''), ang: a, alpha: s.alpha, k: s.k };
      },
      draw(g, st) { IS.boatPart(g, typeof prims === 'function' ? prims(st) : prims, st.ang, u0, u1, cu); } }));
  });
};
/* the vapur: a black hull band, white hull, two decks of windows, an open stern deck full of commuters, a yellow funnel
   with a black top, life rings on the rails, ŞEHİR HATLARI on the side, the flag at the stern */
IS.FERRY = function (seed, o) {
  o = o || {}; const L = o.L || 9.5, hw = o.hw || 2.6, white = { t: '#E6E3DA', l: '#F7F5EF', r: '#DEDAD0' }, black = { t: '#2E2A26', l: '#34302C', r: '#24211E' };
  const pax = []; for (let i = 0; i < 4; i++) for (const v of [-1.3, 0, 1.3]) pax.push([-L + 1.1 + i * 1.05, v, IS.who(seed * 37 + i * 3 + Math.round(v + 2))]);
  const top = [];   // upper deck passengers at the open front
  for (let i = 0; i < 3; i++) for (const v of [-1.2, 1.2]) top.push([L * 0.25 + i * 0.95, v, IS.who(seed * 41 + i * 2 + (v > 0 ? 1 : 0))]);
  const wake = { at: -L + 0.01, fn(g, P) { if (!o.wake) return; const s = []; for (let i = 0; i < 5; i++) { for (const sg of [-1, 1]) { const a = g.p.apply(g, P(-L - 0.5 - i * 1.8, sg * (hw + 0.2 + i * 0.4), 0)), b = g.p.apply(g, P(-L - 1.8 - i * 1.8, sg * (hw + 0.45 + i * 0.4), 0)); s.push(a[0], a[1], b[0], b[1]); } } g.segs2(s, '#F4F8F6', 0.65); g.fill([P(-L, -hw * 0.8, 0), P(-L - 6, -hw * 1.2, 0), P(-L - 8, 0, 0), P(-L - 6, hw * 1.2, 0), P(-L, hw * 0.8, 0)].map((q) => q), 'rgba(236,244,240,0.55)'); } };
  return [wake,
    { stern: [-L, -L + 2.2], hw, z: [0, 1.0], col: black }, { box: [-L + 2.2, L - 2.6], hw, z: [0, 1.0], col: black }, { bow: [L - 2.6, L], hw, z: [0, 1.0], col: black },
    { stern: [-L, -L + 2.2], hw, z: [1.0, 2.5], col: white }, { box: [-L + 2.2, L - 2.6], hw, z: [1.0, 2.5], col: white, nt: true }, { bow: [L - 2.6, L], hw, z: [1.0, 2.7], col: white, top: '#C9B08A' },
    { band: [-L + 0.6, L - 1.5], hw, z: [1.9, 2.05], col: '#C8372D' },
    { at: -L + 2.3, fn(g, P, vis) { const s = vis.side * (hw + 0.05), p = (a, z) => P(a, s, z); K.textP(g, vis.side > 0 ? p : (a, z) => P(-a, s, z), vis.side > 0 ? -L + 3.0 : L - 9.6, 1.25, 0.62, 'ŞEHİR HATLARI', '#2E2A26', { w: 0.3 }); } },
    { box: [-L + 4.4, L - 3.0], hw: hw - 0.15, z: [2.5, 4.6], col: white },
    { band: [-L + 4.6, L - 3.2], hw: hw - 0.15, z: [3.2, 4.1], col: '#3D4A5C' },
    { box: [-L + 0.4, -L + 4.4], hw: hw - 0.1, z: [2.5, 2.55], col: { t: '#C9B08A', l: '#B39872', r: '#A08560' } },
  ].concat(pax.map(([u, v, w]) => ({ at: u, fn(g, P) { const p = P(u, v, 2.55); IS.bust2(g, g.p(p[0], p[1], p[2]), w, 0.6); } })))
    .concat([
      { at: -L + 0.45, fn(g, P) { for (const s of [-1, 1]) g.fine([P(-L + 0.4, s * (hw - 0.1), 3.6), P(-L + 4.4, s * (hw - 0.1), 3.6)], { w: 0.35, c: '#5A564E' }); g.fine([P(-L + 0.4, -(hw - 0.1), 3.6), P(-L + 0.4, hw - 0.1, 3.6)], { w: 0.35, c: '#5A564E' }); } },
      { at: -L + 4.5, fn(g, P, vis) { const s = vis.side * (hw - 0.1); for (const a of [-L + 5.6, -L + 9.6, L - 5.4]) { const p = g.p.apply(g, P(a, s + vis.side * 0.05, 3.9)); g.disc2(p, 0.95, '#E8703A'); g.disc2(p, 0.45, '#F7F5EF'); } } },
      { box: [-L + 5.6, L * 0.2], hw: hw - 0.4, z: [4.6, 6.2], col: white },
      { band: [-L + 5.8, L * 0.18], hw: hw - 0.4, z: [5.0, 5.8], col: '#3D4A5C' },
      { box: [L * 0.2, L * 0.2 + 3.2], hw: hw - 0.4, z: [4.6, 4.65], col: { t: '#C9B08A', l: '#B39872', r: '#A08560' } },
    ]).concat(top.map(([u, v, w]) => ({ at: u, fn(g, P) { const p = P(u, v, 4.65); IS.bust2(g, g.p(p[0], p[1], p[2]), w, 0.6); } })))
    .concat([
      { at: L * 0.2 + 3.15, fn(g, P) { for (const s of [-1, 1]) g.fine([P(L * 0.2, s * (hw - 0.4), 5.6), P(L * 0.2 + 3.2, s * (hw - 0.4), 5.6)], { w: 0.35, c: '#5A564E' }); g.fine([P(L * 0.2 + 3.2, -(hw - 0.4), 5.6), P(L * 0.2 + 3.2, hw - 0.4, 5.6)], { w: 0.35, c: '#5A564E' }); } },
      { box: [L * 0.2 - 2.2, L * 0.2], hw: hw - 0.7, z: [6.2, 7.2], col: white }, { band: [L * 0.2 - 2.1, L * 0.2 - 0.1], hw: hw - 0.7, z: [6.5, 7.0], col: '#2E3238' },
      { at: -1.8, fn(g, P) { const c = P(-1.8, 0, 6.2); K.cyl(g, c[0], c[1], 0.85, 6.2, 9.0, { t: '#2E2A26', l: '#E8B830', r: '#C9982A' }, { w: 0.6, n: 10 }); K.cyl(g, c[0], c[1], 0.87, 8.2, 9.0, { t: '#2E2A26', l: '#34302C', r: '#24211E' }, { w: 0.55, n: 10 }); if (o.smoke) { const p = g.p(c[0], c[1], 9.3); for (let i = 0; i < 3; i++) g.disc2([p[0] - 2 - i * 2.4, p[1] - 1.4 - i * 1.2], 1.3 + i * 0.6, 'rgba(120,116,108,' + (0.45 - i * 0.12) + ')'); } } },
      { at: L - 0.6, fn(g, P) { const a = g.p.apply(g, P(L - 0.6, 0, 2.7)), b = g.p.apply(g, P(L - 0.6, 0, 7.5)); g.line2([a, b], { w: 0.45, c: '#4A4540', boil: false, ext: 0 }); } },
    ]);
};
/* the Golden Horn ferry: smaller and lower (it passes under the Galata Bridge), same livery */
IS.HALIC = function (seed) {
  const L = 6.8, hw = 2.1, white = { t: '#E6E3DA', l: '#F7F5EF', r: '#DEDAD0' }, black = { t: '#2E2A26', l: '#34302C', r: '#24211E' };
  const pax = []; for (let i = 0; i < 3; i++) for (const v of [-1, 1]) pax.push([-L + 1.0 + i * 1.0, v, IS.who(seed * 29 + i * 2 + (v > 0 ? 1 : 0))]);
  return [
    { stern: [-L, -L + 1.8], hw, z: [0, 0.9], col: black }, { box: [-L + 1.8, L - 2.2], hw, z: [0, 0.9], col: black }, { bow: [L - 2.2, L], hw, z: [0, 0.9], col: black },
    { stern: [-L, -L + 1.8], hw, z: [0.9, 2.1], col: white }, { box: [-L + 1.8, L - 2.2], hw, z: [0.9, 2.1], col: white, nt: true }, { bow: [L - 2.2, L], hw, z: [0.9, 2.3], col: white, top: '#C9B08A' },
    { band: [-L + 0.5, L - 1.2], hw, z: [1.6, 1.72], col: '#C8372D' },
    { box: [-L + 0.3, -L + 3.4], hw: hw - 0.1, z: [2.1, 2.15], col: { t: '#C9B08A', l: '#B39872', r: '#A08560' } },
  ].concat(pax.map(([u, v, w]) => ({ at: u, fn(g, P) { const p = P(u, v, 2.15); IS.bust2(g, g.p(p[0], p[1], p[2]), w, 0.55); } })))
    .concat([
      { box: [-L + 3.4, L - 2.4], hw: hw - 0.15, z: [2.1, 4.2], col: white }, { band: [-L + 3.6, L - 2.6], hw: hw - 0.15, z: [2.7, 3.7], col: '#3D4A5C' },
      { box: [0.2, 2.4], hw: hw - 0.6, z: [4.2, 5.0], col: white },
      { at: -1.2, fn(g, P) { const c = P(-1.2, 0, 4.2); K.cyl(g, c[0], c[1], 0.6, 4.2, 6.2, { t: '#2E2A26', l: '#E8B830', r: '#C9982A' }, { w: 0.5, n: 8 }); K.cyl(g, c[0], c[1], 0.62, 5.6, 6.2, { t: '#2E2A26', l: '#34302C', r: '#24211E' }, { w: 0.45, n: 8 }); } },
    ]);
};
/* a fishing kayık: a small wooden boat with a sheer, painted band, an outboard, one fisherman (static drawing) */
IS.kayik = function (g, ang, o) {
  o = o || {}; K.boat(g, ang, { kind: 'row', L: o.L || 3.6, W: 1.35, hull: o.hull || '#F1EBDD', stripe: o.stripe || '#3F7FA8', deck: '#B9976A', rower: o.rower, ph: o.ph });
};

/* a walker on a closed route (like K.walker, but drawn with IS.person so scarves, trays and loads show).
   o: phase, z (number or fn), speed, who overrides */
IS.walker = function (T, who, pts, speed, o) {
  o = o || {}; const seg = [], L = [0];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const total = L[L.length - 1], per = total / speed;
  return T.actor(Object.assign(o.cast === undefined ? {} : { cast: o.cast }, { sample: o.sample || 0.25, period: per,
    at(t) {
      let d = (((t * speed + (o.phase || 0) * total) % total) + total) % total, i = 0;
      while (i < seg.length - 1 && d > L[i + 1]) i++;
      const [a, b] = seg[i], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1];
      const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor((d / 2.4) % 1 * 8);
      const x = a[0] + dx * u, y = a[1] + dy * u, z = typeof o.z === 'function' ? o.z(x, y) : (o.z || 0);
      return { x, y, z, key: dir + '.' + ph, dir, ph: ph / 8 };
    },
    draw(g, st) { IS.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); } }));
};
/* the ground of a place that is partly water: a flush paved rectangle with its rim, and a stone coping along the sides
   that meet the water (sides: string of 'n','s','e','w' = -y, +y, +x, -x); cut: map-edge sides ('x', 'y') */
IS.ground = function (g, x0, y0, x1, y1, col, o) {
  o = o || {}; const q = K.rect(x0, y0, x1, y1);
  if (o.cut) { const D = 1.1; if (o.cut.indexOf('y') >= 0) { g.fill([[x0, y1, -D], [x1, y1, -D], [x1, y1, 0], [x0, y1, 0]], C.slab); g.line([[x0, y1, 0], [x0, y1, -D], [x1, y1, -D], [x1, y1, 0]], { w: 0.9 }); } if (o.cut.indexOf('x') >= 0) { g.fill([[x1, y1, -D], [x1, y0, -D], [x1, y0, 0], [x1, y1, 0]], C.slabD); g.line([[x1, y1, 0], [x1, y1, -D], [x1, y0, -D], [x1, y0, 0]], { w: 0.9 }); } }
  g.fill(q, col || IS.C.pave);
  const sides = o.water || '';
  const cope = (a, b) => { const d = 0.9, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), nx = -dy / l * d, ny = dx / l * d; g.fill([[a[0], a[1], 0], [b[0], b[1], 0], [b[0] - nx, b[1] - ny, 0], [a[0] - nx, a[1] - ny, 0]], IS.C.quayTop); g.line([[a[0] - nx, a[1] - ny, 0], [b[0] - nx, b[1] - ny, 0]], { w: 0.35, c: IS.C.quayD, boil: false }); };
  if (sides.indexOf('n') >= 0) cope([x1, y0], [x0, y0]); if (sides.indexOf('s') >= 0) cope([x0, y1], [x1, y1]);
  if (sides.indexOf('e') >= 0) cope([x1, y1], [x1, y0]); if (sides.indexOf('w') >= 0) cope([x0, y0], [x0, y1]);
  g.outline(q, { w: 0.9, boil: false });
};
/* paving joints: a light directional scuff */
IS.paving = function (g, x0, y0, x1, y1, o) { o = o || {}; g.scuff(K.rect(x0, y0, x1, y1), { dir: o.dir == null ? Math.atan2(AY, AX) : o.dir, len: o.len || 3, c: o.c || '#F5F1E6', dens: o.dens || 0.55, w: 0.5, spread: 0.06 }); };
/* a mosque courtyard (avlu): arcades on its far sides (their inner faces face us) with a row of small domes, a marble
   floor, the octagonal ablution fountain (şadırvan) under its roof, and the near sides as plain walls with windows.
   Two objects (far part with the floor, near part), so people inside sort between them. o: d (depth of the arcades),
   H, z0 (a terrace height), near: which near sides to wall ('s', 'e', 'se') */
IS.avlu = function (T, x0, y0, x1, y1, o) {
  o = o || {}; const d = o.d || 3, H = o.H || 4.6, z0 = o.z0 || 0, near = o.near == null ? 'se' : o.near;
  const S = { t: IS.C.lime, l: IS.C.limeL, r: IS.C.limeD };
  const domes = (g, ax, ay, bx, by) => { const n = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / (d * 1.05))); for (let i = 0; i < n; i++) { const f = (i + 0.5) / n; IS.dome(g, lerp(ax, bx, f), lerp(ay, by, f), d * 0.42, z0 + H, { drum: 0.25, win: 0, h: d * 0.36, ribs: 0, alem: false, w: 0.45 }); } };
  T.obj([x0, y0, x1, y1], function (g) {
    g.boilP = 0.25;
    g.fill(K.rect(x0, y0, x1, y1, z0 + 0.02), '#ECE6D8');
    const gr = []; for (let x = x0 + 2; x < x1; x += 2) { const a = g.p(x, y0, z0 + 0.03), b = g.p(x, y1, z0 + 0.03); gr.push(a[0], a[1], b[0], b[1]); } for (let y = y0 + 2; y < y1; y += 2) { const a = g.p(x0, y, z0 + 0.03), b = g.p(x1, y, z0 + 0.03); gr.push(a[0], a[1], b[0], b[1]); }
    g.segs2(gr, '#DDD5C3', 0.3);
    K.box(g, x0, y0, x1, y0 + d, z0, z0 + H, S, { w: 0.75 }); IS.arcade(g, 'L', y0 + d + 0.02, x0 + d, x1, z0, z0 + H - 0.8, Math.max(3, Math.round((x1 - x0 - d) / 3)), { dark: '#6E6658' });
    K.box(g, x0, y0, x0 + d, y1, z0, z0 + H, S, { w: 0.75 }); IS.arcade(g, 'R', x0 + d + 0.02, y0 + d, y1, z0, z0 + H - 0.8, Math.max(3, Math.round((y1 - y0 - d) / 3)), { dark: '#6E6658' });
    domes(g, x0 + d / 2, y0 + d / 2, x1 - d / 2, y0 + d / 2); domes(g, x0 + d / 2, y0 + d * 1.5, x0 + d / 2, y1 - d / 2);
    // the şadırvan: an octagonal basin, slim columns, a wide eaved roof
    const cx = (x0 + x1) / 2 + d / 2, cy = (y0 + y1) / 2 + d / 2;
    K.cyl(g, cx, cy, 2.2, z0, z0 + 1.0, S, { n: 8, w: 0.6 });
    const cs = []; for (let i = 0; i < 8; i++) { const a = TAU * i / 8 + 0.2; if (Math.cos(a) + Math.sin(a) < -0.3) continue; const p0 = g.p(cx + Math.cos(a) * 2.4, cy + Math.sin(a) * 2.4, z0 + 1), p1 = g.p(cx + Math.cos(a) * 2.4, cy + Math.sin(a) * 2.4, z0 + 3.8); cs.push(p0[0], p0[1], p1[0], p1[1]); }
    g.segs2(cs, '#8C8576', 0.5);
    K.cone(g, cx, cy, 3.6, z0 + 3.8, 1.6, IS.C.lead); IS.alem2(g, g.p(cx, cy, z0 + 5.4), 0.6);
  }, { name: 'courtyard', on: !!o.z0 });
  if (near.indexOf('s') >= 0) T.obj([x0, y1 - d, x1, y1], (g) => { K.box(g, x0 + d, y1 - d, x1, y1, z0, z0 + H, S, { w: 0.75 }); const n = Math.round((x1 - x0) / 3); for (let i = 1; i < n; i++) K.win(g, 'L', y1 + 0.02, x0 + i * (x1 - x0) / n - 0.5, x0 + i * (x1 - x0) / n + 0.5, z0 + 1.2, z0 + 3.0, { style: 'navy', arch: true, col: '#4E5866', w: 0.3, skips: false }); domes(g, x0 + d * 1.5, y1 - d / 2, x1 - d / 2, y1 - d / 2); }, { on: true, name: 'courtyard wall' });
};
