'use strict';
/* Shared pieces of the canal town (loaded before the tiles).
   The canal runs along +x through the whole town at y -7..7 (every tile is centred on y = 0, so tile-local y is world y).
   Its water lies 1.6 u below the paving; the far quay wall (the face at y = -7, looking lower-left) is the only quay wall
   the camera sees. The near bank's paving is drawn after the water, so its edge hides the strip of water under it.
   A bridge is four standing objects plus a near parapet in three pieces, so that boats pass under it and people cross
   over it: see CAN.bridge. */
const CAN = {
  WL: -1.6,                 // water level
  Y: 7,                     // half width of the canal
  LIP: 3.0,                 // depth of the cut edge of the map
  X0: -146, X1: 146,        // the town's extent along the canal
  PAVE: '#E6E1D5', PAVED: '#D3CCBD', ISTRIA: '#F3F0E8', ISTRIAD: '#DCD7CB',
  WATER: '#9DC7CB', WATERD: '#7FAEB4', WATERL: '#C6E1DF',
  BRICK: '#BF6E52', BRICKD: '#9E5440', ROOF: '#C9694B', SHUT: '#5E8A68',
};

/* ---------- small geometry ---------- */
/* keep the part of a convex wide-px polygon on the left of the directed line a->b (or the right, side = -1) */
CAN.clip = function (poly, a, b, side) {
  const out = [], s = side || 1, f = (p) => s * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]));
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q);
    if (fp >= 0) out.push(p);
    if ((fp >= 0) !== (fq >= 0)) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
  }
  return out;
};
/* polygon area sign in wide px (screen y down): > 0 clockwise on screen */
CAN.area = function (P) { let a = 0; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };

/* ---------- paving ---------- */
/* grey trachyte slabs: faint joints, a few Istrian stone strips, dry scuffs */
CAN.pave = function (g, x0, y0, x1, y1, o) {
  o = o || {};
  const P = K.rect(x0, y0, x1, y1, 0);
  g.fill(P, o.col || CAN.PAVE);
  const s = [], st = o.step || 3.2;
  for (let x = Math.ceil(x0 / st) * st; x < x1; x += st) { const a = g.p(x, y0, 0), b = g.p(x, y1, 0); s.push(a[0], a[1], b[0], b[1]); }
  for (let y = Math.ceil(y0 / st) * st; y < y1; y += st) { const a = g.p(x0, y, 0), b = g.p(x1, y, 0); s.push(a[0], a[1], b[0], b[1]); }
  g.segs2(s, o.joint || '#DAD4C6', 0.3);
  g.scuff(P, { dir: -0.9, len: 1.4, c: '#F2EEE5', dens: 0.25, w: 0.55, spread: 1.2 });
};

/* ---------- windows, doors ---------- */
/* a window on a face ('L': plane y = p, a along x; 'R': plane x = p, a along y), with a pale stone surround and, if
   o.sh is a colour, a pair of open shutters. o.arch: 'round' | 'gothic'. o.glass: pale glass instead of a dark pane */
CAN.win = function (g, face, p, a0, a1, z0, z1, o) {
  o = o || {}; const m = (a0 + a1) / 2, w = a1 - a0;
  const shape = (e, zt) => {
    if (!o.arch) return K.on(face, p, a0 - e, a1 + e, z0 - e, zt + e);
    const hw = w / 2 + e, zs = zt - w * (o.arch === 'gothic' ? 0.8 : 0.5), pts = [K.pt(face, p, a0 - e, z0 - e), K.pt(face, p, a1 + e, z0 - e)], n = 10;
    for (let i = 0; i <= n; i++) {
      const t = 1 - 2 * i / n, a = m + t * hw;
      const z = o.arch === 'gothic' ? zs + (zt + e - zs) * Math.pow(1 - Math.abs(t), 0.55) : zs + (zt + e - zs) * Math.sqrt(Math.max(0, 1 - t * t));
      pts.push(K.pt(face, p, a, z));
    }
    return pts;
  };
    if (o.frame !== false) g.fill(shape(0.32, z1), o.frameCol || CAN.ISTRIA);
  const hole = shape(0, z1);
  g.fill(hole, o.glass ? C.glass : (o.pane || '#4E5862'));
  if (o.glass) { const P = g.P(hole), a = P[0], b = P[2], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; g.segs2([mx - 0.4, my + 1.4, mx + 1.0, my - 1.4], C.white, 0.55); }
  else { const P = g.P(hole); let cx = 0, cy = 0; for (const q of P) { cx += q[0]; cy += q[1]; } cx /= P.length; cy /= P.length; g.segs2([cx - 0.9, cy + 1.6, cx + 0.5, cy - 0.6], '#7E8C96', 0.5); }
  g.outline(hole, { w: 0.45, boil: false, ext: 0.2, c: '#3A3530' });
  if (o.sh) {
    const sw = w * 0.52, c = o.sh, cd = shade(c, 0.25);
    for (const [b0, b1] of [[a0 - 0.32 - sw, a0 - 0.32], [a1 + 0.32, a1 + 0.32 + sw]]) {
      const q = K.on(face, p, b0, b1, z0 - 0.1, z1 - (o.arch ? w * 0.35 : 0) + 0.1);
      g.fill(q, c);
      const Q = g.P(q), sl = []; for (let k = 1; k < 5; k++) { const t = k / 5; sl.push(lerp(Q[0][0], Q[3][0], t), lerp(Q[0][1], Q[3][1], t), lerp(Q[1][0], Q[2][0], t), lerp(Q[1][1], Q[2][1], t)); }
      g.segs2(sl, cd, 0.3); g.outline2(Q, { w: 0.35, c: cd, boil: false, ext: 0 });
    }
  }
  if (o.sill !== false) g.fill(K.on(face, p, a0 - 0.45, a1 + 0.45, z0 - 0.42, z0 - 0.12).map((q) => q), CAN.ISTRIA);
};
CAN.door = function (g, face, p, a0, a1, z1, o) {
  o = o || {};
  const fr = K.on(face, p, a0 - 0.35, a1 + 0.35, 0, z1 + 0.35); g.fill(fr, CAN.ISTRIA);
  const d = o.arch ? null : K.on(face, p, a0, a1, 0, z1);
  if (d) { g.fill(d, o.col || '#5A3E2E'); g.outline(d, { w: 0.5, boil: false, c: '#2E2620' }); }
  else K.win(g, face, p, a0, a1, 0, z1, { style: 'dark', arch: true, col: o.col || '#5A3E2E', lc: '#2E2620', w: 0.5 });
  const k = g.p.apply(g, K.pt(face, p, a1 - (a1 - a0) * 0.22, z1 * 0.45)); g.disc2(k, 0.35, C.gold);
};

/* ---------- a Venetian house ----------
   A stuccoed box of n storeys on a stone footing, its windows in rhythm on the two faces we see, a white stone
   cornice, a low terracotta roof (hip, or gable along x or y), funnel chimneys, sometimes a balcony or a roof terrace.
   d: { x0, y0, x1, y1, n, col, roof: 'hip'|'x'|'y', roofCol, sh (shutter colour), arch ('round'|'gothic' upper floors),
        doorL: [a0, a1] / doorR: [a0, a1], shopL: [a0, a1, col] (a shopfront), balcony: 'L'|'R', chim: [[x, y], ...],
        altana: true, skipL: [[a0, a1], ...], skipR, winL / winR: number of window bays, sh2: (some closed) } */
CAN.SH = 5.0;
CAN.house = function (g, d) {
  const bp = g.boilP; g.boilP = 0.3;              // fewer of a house's contours boil: there are many houses
  const { x0, y0, x1, y1, n } = d, H = n * CAN.SH + 0.6, col = d.col, tone = { t: shade(col, -0.2), l: col, r: shade(col, 0.12) };
  K.box(g, x0, y0, x1, y1, 0, H, tone, { w: 0.95 });
  // footing of Istrian stone and a damp band
  g.fill(K.on('L', y1, x0, x1, 0, 0.7), CAN.ISTRIAD); g.fill(K.on('R', x1, y0, y1, 0, 0.7), shade(CAN.ISTRIAD, 0.08));
  g.line([[x0, y1, 0.7], [x1, y1, 0.7], [x1, y0, 0.7]], { w: 0.4, boil: false, c: '#9E968A' });
  // storey bands
  for (let k = 1; k < n; k++) { const z = k * CAN.SH + 0.2; g.fine([[x0, y1, z], [x1, y1, z], [x1, y0, z]], { w: 0.35, c: shade(col, 0.32) }); }
  // a little weathering: patches of bare brick
  const R = RNG(Math.round(x0 * 13 + y0 * 7 + n));
  for (let i = 0; i < 2; i++) {
    const onL = R() < 0.6, a = onL ? lerp(x0 + 1, x1 - 3, R()) : lerp(y0 + 1, y1 - 3, R()), z = 1 + R() * (H - 4), pts = K.on(onL ? 'L' : 'R', onL ? y1 : x1, a, a + 1.6 + R() * 1.4, z, z + 0.9 + R() * 0.8);
    g.fill(pts, shade(CAN.BRICK, onL ? -0.1 : 0.05));
    const P = g.P(pts), s = []; for (let k = 1; k < 3; k++) { const t = k / 3; s.push(lerp(P[0][0], P[3][0], t), lerp(P[0][1], P[3][1], t), lerp(P[1][0], P[2][0], t), lerp(P[1][1], P[2][1], t)); } g.segs2(s, CAN.BRICKD, 0.3);
  }
  // windows: ground floor smaller (or a door / shopfront), upper floors in rhythm
  const bays = (a0, a1, nb) => { const out = []; const w = (a1 - a0) / nb; for (let i = 0; i < nb; i++) out.push(a0 + w * (i + 0.5)); return out; };
  const skip = (list, m) => list && list.some((s) => m > s[0] - 1 && m < s[1] + 1);
  for (const face of ['L', 'R']) {
    const p = face === 'L' ? y1 : x1, a0 = face === 'L' ? x0 : y0, a1 = face === 'L' ? x1 : y1;
    const nb = d['win' + face] || Math.max(1, Math.round((a1 - a0) / 3.6));
    const door = d['door' + face], shop = d['shop' + face], sk = d['skip' + face];
    for (let k = 0; k < n; k++) {
      const zf = k * CAN.SH + 0.2;
      for (const m of bays(a0 + 0.6, a1 - 0.6, nb)) {
        if (skip(sk, m)) continue;
        if (k === 0) {
          if (door && m > door[0] - 1.2 && m < door[1] + 1.2) continue;
          if (shop && m > shop[0] - 0.8 && m < shop[1] + 0.8) continue;
          CAN.win(g, face, p, m - 0.55, m + 0.55, zf + 1.4, zf + 2.9, { sh: false, pane: '#59636B' });
          const gr = []; const A = g.p.apply(g, K.pt(face, p, m - 0.55, zf + 2.2)), B = g.p.apply(g, K.pt(face, p, m + 0.55, zf + 2.2)); gr.push(A[0], A[1], B[0], B[1]); g.segs2(gr, '#2E2A26', 0.3);
        } else {
          const closed = d.sh2 && h2(Math.round(m * 7), k + n) < 0.3;
          if (closed) { const q = K.on(face, p, m - 0.7, m + 0.7, zf + 1.0, zf + 3.5); g.fill(K.on(face, p, m - 1.0, m + 1.0, zf + 0.7, zf + 3.8), CAN.ISTRIA); g.fill(q, d.sh || CAN.SHUT); const Q = g.P(q), sl = []; for (let j = 1; j < 6; j++) { const t = j / 6; sl.push(lerp(Q[0][0], Q[3][0], t), lerp(Q[0][1], Q[3][1], t), lerp(Q[1][0], Q[2][0], t), lerp(Q[1][1], Q[2][1], t)); } g.segs2(sl, shade(d.sh || CAN.SHUT, 0.3), 0.3); const ml = g.P([K.pt(face, p, m, zf + 1.0), K.pt(face, p, m, zf + 3.5)]); g.segs2([ml[0][0], ml[0][1], ml[1][0], ml[1][1]], shade(d.sh || CAN.SHUT, 0.35), 0.35); g.outline2(Q, { w: 0.4, boil: false, c: '#3A3530', ext: 0 }); }
          else CAN.win(g, face, p, m - 0.62, m + 0.62, zf + 1.0, zf + 3.5, { sh: d.sh || null, arch: d.arch && k === 1 ? d.arch : (d.arch2 ? d.arch : null) });
        }
      }
    }
    if (door) CAN.door(g, face, p, door[0], door[1], 3.6, { col: door[2], arch: door[3] });
    if (shop) {
      const [s0, s1, sc] = shop, q = K.on(face, p, s0, s1, 0.2, 3.6);
      g.fill(K.on(face, p, s0 - 0.4, s1 + 0.4, 0, 4.0), sc);
      g.fill(q, C.glass);
      const Pq = g.P(q), mull = []; for (let j = 1; j < 4; j++) { const t = j / 4; mull.push(lerp(Pq[0][0], Pq[1][0], t), lerp(Pq[0][1], Pq[1][1], t), lerp(Pq[3][0], Pq[2][0], t), lerp(Pq[3][1], Pq[2][1], t)); }
      g.segs2(mull, sc, 0.7); g.outline2(Pq, { w: 0.55, boil: false, c: '#2E2A26' });
      const gl = g.P([K.pt(face, p, s0 + 0.6, 1.0), K.pt(face, p, s0 + 1.4, 2.6)]); g.segs2([gl[0][0], gl[0][1], gl[1][0], gl[1][1]], C.white, 0.6);
    }
  }
  // a stone balcony with balusters on the first floor
  if (d.balcony) {
    const face = d.balcony, p = face === 'L' ? y1 : x1, a0 = face === 'L' ? x0 : y0, a1 = face === 'L' ? x1 : y1, m = (a0 + a1) / 2, z = CAN.SH + 0.2;
    const B = face === 'L' ? [m - 2.4, y1, m + 2.4, y1 + 1.2] : [x1, m - 2.4, x1 + 1.2, m + 2.4];
    K.box(g, B[0], B[1], B[2], B[3], z - 0.4, z, CAN.ISTRIA, { w: 0.6, nohid: true });
    const bal = []; const along = (t, zz) => face === 'L' ? g.p(lerp(B[0], B[2], t), B[3], zz) : g.p(B[2], lerp(B[1], B[3], t), zz);
    for (let i = 0; i <= 12; i++) { const a = along(i / 12, z), b = along(i / 12, z + 1.3); bal.push(a[0], a[1], b[0], b[1]); }
    for (let i = 0; i <= 5; i++) { const a = face === 'L' ? g.p(B[2], lerp(B[1], B[3], i / 5), z) : g.p(lerp(B[0], B[2], i / 5), B[3], z), b = [a[0], a[1] - 1.3 * VZ]; bal.push(a[0], a[1], b[0], b[1]); }
    g.segs2(bal, CAN.ISTRIAD, 0.55);
    const rail = [[B[0], B[3], z + 1.3], [B[2], B[3], z + 1.3], [B[2], B[1], z + 1.3]];
    g.line(rail, { w: 0.6, boil: false });
    if (d.flowers) { const fl = face === 'L' ? [B[0] + 0.3, B[3] - 0.5, B[2] - 0.3, B[3] - 0.1] : [B[2] - 0.5, B[1] + 0.3, B[2] - 0.1, B[3] - 0.3]; K.blooms(g, fl[0], fl[1], fl[2], fl[3], z + 1.0, d.flowers, { sp: 0.9, r: 1.0 }); }
  }
  // cornice, then the roof
  K.box(g, x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35, H, H + 0.6, { t: CAN.ISTRIA, l: CAN.ISTRIA, r: CAN.ISTRIAD }, { w: 0.65, nb: false });
  const rc = d.roofCol || CAN.ROOF, rz = H + 0.6;
  if (d.roof === 'x' || d.roof === 'y') K.gable(g, x0 - 0.6, y0 - 0.6, x1 + 0.6, y1 + 0.6, rz, d.rh || 2.8, d.roof, { a: rc, b: shade(rc, 0.1), e: shade(col, -0.08) }, { c: shade(rc, 0.45) });
  else K.hip(g, x0 - 0.6, y0 - 0.6, x1 + 0.6, y1 + 0.6, rz, d.rh || 2.6, rc, { ridge: Math.max(0, Math.abs((x1 - x0) - (y1 - y0)) * 0.9), c: shade(rc, 0.45) });
  // tile courses on the lit roof slope
  const tl = [], rr = RNG(Math.round(x1 * 31 + y1 * 3));
  for (let i = 0; i < 9; i++) { const u = rr(), v = 0.2 + rr() * 0.6; const a = g.p(lerp(x0, x1, u), lerp(y1 + 0.5, (y0 + y1) / 2, v), rz + (d.rh || 2.6) * v * 0.9); tl.push(a[0], a[1], a[0] + 3, a[1] - 1.6); }
  g.segs2(tl, shade(rc, 0.22), 0.4);
  for (const [cx, cy] of d.chim || []) CAN.chimney(g, cx, cy, rz + (d.rh || 2.6) * 0.45);
  if (d.altana) CAN.altana(g, d.altana[0], d.altana[1], rz + (d.rh || 2.6) * 0.6);
  g.boilP = bp;
  return H;
};
/* a Venetian chimney: a slim stack crowned by a wide funnel */
CAN.chimney = function (g, x, y, z) {
  K.box(g, x - 0.5, y - 0.5, x + 0.5, y + 0.5, z - 0.6, z + 2.6, { t: '#C98463', l: '#C98463', r: '#A9674C' }, { w: 0.55, nohid: true });
  const b = g.p(x, y, z + 2.6), t = g.p(x, y, z + 4.2), rb = 1.6, rt = 4.0;
  const f = [[b[0] - rb, b[1]], [b[0] + rb, b[1]], [t[0] + rt, t[1]], [t[0] - rt, t[1]]];
  g.fill2(f, '#D58C6A'); g.fill2([[b[0] + 0.2, b[1]], [b[0] + rb, b[1]], [t[0] + rt, t[1]], [t[0] + 0.6, t[1]]], '#B5714F');
  g.fill2(arcPts(t[0], t[1], rt, 0, TAU, 12).map((q) => [q[0], t[1] + (q[1] - t[1]) * 0.45]), '#8E5A42');
  g.outline2(f, { w: 0.5, boil: false, c: '#5E3424' }); g.ring2([t[0], t[1]], 0.01, { w: 0.01 });
  g.line2(arcPts(t[0], t[1], rt, 0, TAU, 12).map((q) => [q[0], t[1] + (q[1] - t[1]) * 0.45]), { w: 0.45, boil: false, c: '#5E3424', close: true });
};
/* an altana: a wooden roof terrace on posts */
CAN.altana = function (g, x, y, z) {
  const W = 2.6, D = 2.2, h = 1.8;
  const posts = []; for (const [px, py] of [[x - W, y - D], [x + W, y - D], [x + W, y + D], [x - W, y + D]]) { const a = g.p(px, py, z - 0.5), b = g.p(px, py, z + h); posts.push(a[0], a[1], b[0], b[1]); }
  g.segs2(posts, '#7A5A3C', 0.6);
  const deck = K.rect(x - W - 0.3, y - D - 0.3, x + W + 0.3, y + D + 0.3, z + h); g.fill(deck, '#B8875A');
  const sl = []; for (let i = 0; i < 7; i++) { const u = x - W + i * (2 * W / 6), a = g.p(u, y - D, z + h), b = g.p(u, y + D, z + h); sl.push(a[0], a[1], b[0], b[1]); } g.segs2(sl, '#8E6640', 0.3);
  g.outline(deck, { w: 0.55, boil: false, c: '#5E4228' });
  const rp = [], top = [[x - W - 0.3, y + D + 0.3, z + h + 1.4], [x + W + 0.3, y + D + 0.3, z + h + 1.4], [x + W + 0.3, y - D - 0.3, z + h + 1.4]];
  for (let i = 0; i <= 8; i++) { const a = g.p(lerp(x - W - 0.3, x + W + 0.3, i / 8), y + D + 0.3, z + h), b = g.p(lerp(x - W - 0.3, x + W + 0.3, i / 8), y + D + 0.3, z + h + 1.4); rp.push(a[0], a[1], b[0], b[1]); }
  for (let i = 0; i <= 6; i++) { const a = g.p(x + W + 0.3, lerp(y - D - 0.3, y + D + 0.3, i / 6), z + h), b = g.p(x + W + 0.3, lerp(y - D - 0.3, y + D + 0.3, i / 6), z + h + 1.4); rp.push(a[0], a[1], b[0], b[1]); }
  g.segs2(rp, '#6E4E30', 0.4); g.line(top, { w: 0.5, boil: false, c: '#5E4228' });
};

/* ---------- the bridge ----------
   A humped Venetian bridge across the canal at x = bx: a brick body faced with white Istrian stone at the arch ring, the
   string course and the parapet caps, and steps all the way up. Five standing objects, back to front:
   the far ramp, the vault (the inside of the arch seen through the opening: drawn under any boat beneath it), the
   span ({ under: 0 }: a boat inside its footprint below the paving passes under it; a person on it walks over it), the
   near ramp; and the near parapet in three pieces (one per part) so a walker on the steps is drawn behind it.
   o: { W half deck width, ramp: |y| where the steps reach the paving, hs: deck height at the canal edge, hc: crown,
        rise: arch rise above the water, body: brick colour, stone, rail: 'wall' | 'balustrade' }
   Returns { z(y): height of the treads at y, x0, x1, ramp } for walkers. */
CAN.bridge = function (T, bx, o) {
  o = o || {};
  const W = o.W || 3, RY = o.ramp || 16, HS = o.hs || 5.0, HC = o.hc || 6.4, AR = o.rise || 7.2, Y = CAN.Y, WL = CAN.WL;
  const x0 = bx - W, x1 = bx + W, PW = 0.6, PH = 1.35, RISE = 0.42;
  const body = o.body || CAN.BRICK, bodyR = shade(body, 0.1), stone = o.stone || CAN.ISTRIA, stoneD = CAN.ISTRIAD;
  const deck = (y) => { const a = Math.abs(y); if (a >= RY) return 0; if (a >= Y) return HS * (RY - a) / (RY - Y); return HC - (HC - HS) * (a / Y) * (a / Y); };
  const step = (y) => Math.round(deck(y) / RISE) * RISE;
  const arch = (y) => WL + AR * Math.sqrt(Math.max(0, 1 - (y / Y) * (y / Y)));
  // treads: [ya, yb, z] from far to near
  const treads = []; { let ya = -RY - 0.6, z = 0; for (let y = -RY; y <= RY + 0.001; y += 0.05) { const s = Math.abs(y) >= RY ? 0 : Math.max(RISE, step(y)); if (Math.abs(s - z) > 1e-6) { treads.push([ya, y, z]); ya = y; z = s; } } treads.push([ya, RY + 0.6, 0]); }
  const yr = (a, b, n) => { const o2 = []; for (let i = 0; i <= n; i++) o2.push(lerp(a, b, i / n)); return o2; };
  // the far parapet's inner face and cap over a y range
  const farWall = (g, ya, yb) => {
    const ys = yr(ya, yb, 14), xi = x0 + PW;
    const face = ys.map((y) => [xi, y, step(y) - 0.3]).concat(ys.slice().reverse().map((y) => [xi, y, deck(y) + PH]));
    g.fill(face, shade(body, 0.04));
    const cap = ys.map((y) => [x0, y, deck(y) + PH]).concat(ys.slice().reverse().map((y) => [xi, y, deck(y) + PH]));
    g.fill(cap, stone); g.line(ys.map((y) => [xi, y, deck(y) + PH]), { w: 0.6, c: '#5E4A3C', boil: false });
    const br = []; for (let i = 0; i < ys.length - 1; i += 2) { const y = ys[i], a = g.p(xi, y, deck(y) + PH * 0.45), b = g.p(xi, y + 0.6, deck(y + 0.6) + PH * 0.45); br.push(a[0], a[1], b[0], b[1]); } g.segs2(br, shade(body, 0.2), 0.3);
  };
  // treads (and the risers that face us on the near half) between ya and yb
  const steps = (g, ya, yb) => {
    let prev = null;
    for (const [a, b, z] of treads) {
      if (b <= ya + 1e-6 || a >= yb - 1e-6) { prev = z; continue; }
      const A = Math.max(a, ya), B = Math.min(b, yb);
      if (prev != null && z < prev && a >= ya - 1e-6) { const r = [[x0 + PW, A, z], [x1 - PW, A, z], [x1 - PW, A, prev], [x0 + PW, A, prev]]; g.fill(r, stoneD); g.line([[x0 + PW, A, prev], [x1 - PW, A, prev]], { w: 0.4, boil: false, c: '#8E877A' }); }
      g.fill([[x0 + PW, A, z], [x1 - PW, A, z], [x1 - PW, B, z], [x0 + PW, B, z]], z > 0 ? '#E9E4D8' : CAN.PAVE);
      if (z > 0) g.fine([[x0 + PW, B, z], [x1 - PW, B, z]], { w: 0.3, c: '#B9B2A4' });
      prev = z;
    }
  };
  // the outer side (x = x1) below the deck between ya and yb, down to the paving
  const sideWall = (g, ya, yb) => {
    const ys = yr(ya, yb, 12), f = ys.map((y) => [x1, y, 0]).concat(ys.slice().reverse().map((y) => [x1, y, deck(y)]));
    g.fill(f, bodyR);
    const br = []; for (let z = 0.7; z < HS; z += 0.7) for (let y = ya + (z * 1.7) % 1.4; y < yb - 0.8; y += 1.4) { if (deck(y + 0.8) < z + 0.3) continue; const a = g.p(x1, y, z), b = g.p(x1, y + 0.8, z); br.push(a[0], a[1], b[0], b[1]); }
    g.segs2(br, shade(body, 0.26), 0.3);
    const band = ys.map((y) => [x1 + 0.05, y, deck(y) - 0.45]).concat(ys.slice().reverse().map((y) => [x1 + 0.05, y, deck(y)]));
    g.fill(band, stoneD);
    g.line(ys.map((y) => [x1, y, deck(y)]), { w: 0.75, boil: false });
  };
  // the near parapet's outer face and cap between ya and yb
  const nearWall = (g, ya, yb, endL) => {
    const ys = yr(ya, yb, 14), xi = x1 - PW;
    const face = ys.map((y) => [x1 + 0.05, y, deck(y) - 0.05]).concat(ys.slice().reverse().map((y) => [x1 + 0.05, y, deck(y) + PH]));
    g.fill(face, bodyR);
    const br = []; for (let i = 0; i < ys.length - 1; i += 2) { const y = ys[i], a = g.p(x1, y, deck(y) + PH * 0.5), b = g.p(x1, y + 0.7, deck(y + 0.7) + PH * 0.5); br.push(a[0], a[1], b[0], b[1]); } g.segs2(br, shade(body, 0.28), 0.3);
    const cap = ys.map((y) => [xi, y, deck(y) + PH]).concat(ys.slice().reverse().map((y) => [x1 + 0.1, y, deck(y) + PH + 0.05]));
    g.fill(cap, stone);
    if (endL) { const e = [[xi, yb, 0], [x1 + 0.05, yb, 0], [x1 + 0.05, yb, PH], [xi, yb, PH]]; g.fill(e, stone); g.outline(e, { w: 0.6 }); }
    g.line(ys.map((y) => [x1 + 0.1, y, deck(y) + PH + 0.05]), { w: 0.9, boil: false });
    g.line(ys.map((y) => [xi, y, deck(y) + PH]), { w: 0.55 });
    g.line(ys.map((y) => [x1 + 0.05, y, deck(y) - 0.05]), { w: 0.6, c: '#6E5040' });
  };
  // 1 far ramp
  T.obj([x0, -RY - 0.6, x1, -Y], function (g) {
    farWall(g, -RY, -Y); steps(g, -RY - 0.6, -Y); sideWall(g, -RY, -Y);
    g.line([[x0, -RY, PH], [x0 + PW, -RY, PH]], { w: 0.5, boil: false });
  }, { name: 'bridge-far' });
  // 2 the vault seen through the arch: what of the opening is not see-through
  T.obj([x0, -Y, x1, Y], function (g) {
    const ys = yr(-Y, Y, 24);
    const N = g.P(ys.map((y) => [x1, y, arch(y)])), F = g.P(ys.map((y) => [x0, y, arch(y)]));
    const Np = N, Fp = F;                       // each closes along its water line
    const sgn = CAN.area(Fp) > 0 ? 1 : -1;
    for (let i = 0; i < Fp.length; i++) {
      const a = Fp[i], b = Fp[(i + 1) % Fp.length], piece = CAN.clip(Np, a, b, -sgn);
      if (piece.length >= 3) g.fill2(piece, i === Fp.length - 1 ? '#6E9599' : '#8A6C5C', true);
    }
    // the far arch's edge where it shows inside the opening
    const inside = F.filter((p) => pointInPoly(p[0], p[1], Np.flat()));
    if (inside.length > 1) g.line2(inside, { w: 0.5, c: '#4A3A30', boil: false });
  }, { name: 'bridge-vault' });
  // 3 the span: far wall and steps over the hump, then the face with its arch
  T.obj([x0, -Y, x1, Y], function (g) {
    farWall(g, -Y, Y); steps(g, -Y, Y);
    const ys = yr(-Y, 0, 12), ys2 = yr(0, Y, 12);
    for (const half of [ys, ys2]) {
      const f = half.map((y) => [x1, y, deck(y)]).concat(half.slice().reverse().map((y) => [x1, y, arch(y)]));
      g.fill(f, bodyR);
    }
    const br = []; for (let z = WL + 0.7; z < HC; z += 0.7) for (let y = -Y + (z * 1.3) % 1.4; y < Y - 0.8; y += 1.4) { if (z < arch(y) + 1.1 && z < arch(y + 0.8) + 1.1) continue; if (deck(y) < z + 0.5) continue; const a = g.p(x1, y, z), b = g.p(x1, y + 0.8, z); br.push(a[0], a[1], b[0], b[1]); }
    g.segs2(br, shade(body, 0.26), 0.3);
    // the white stone ring of voussoirs round the arch
    const ring = yr(-Y, Y, 28), inner = ring.map((y) => [x1 + 0.04, y, arch(y)]), outer = ring.map((y) => [x1 + 0.04, y * 1.0, Math.min(deck(y) - 0.5, arch(y) + 0.95)]);
    g.fill(inner.concat(outer.slice().reverse()), stone);
    const vj = []; for (let i = 1; i < ring.length - 1; i += 2) { const a = g.p.apply(g, inner[i]), b = g.p.apply(g, outer[i]); vj.push(a[0], a[1], b[0], b[1]); } g.segs2(vj, stoneD, 0.4);
    g.line(inner, { w: 0.85, boil: false }); g.line(outer, { w: 0.5, c: '#8E877A', boil: false });
    const band = ys.concat(ys2.slice(1)).map((y) => [x1 + 0.05, y, deck(y) - 0.45]).concat(ys.concat(ys2.slice(1)).reverse().map((y) => [x1 + 0.05, y, deck(y)]));
    g.fill(band, stoneD); g.line(ys.concat(ys2.slice(1)).map((y) => [x1, y, deck(y)]), { w: 0.75, boil: false });
    // a keystone and the water line under the arch
    const kc = [x1 + 0.06, 0, arch(0)]; g.fill([[x1 + 0.06, -0.6, arch(0) - 0.1], [x1 + 0.06, 0.6, arch(0) - 0.1], [x1 + 0.06, 0.8, arch(0) + 1.0], [x1 + 0.06, -0.8, arch(0) + 1.0]], '#FFFFFF'); g.outline([[x1 + 0.06, -0.6, arch(0) - 0.1], [x1 + 0.06, 0.6, arch(0) - 0.1], [x1 + 0.06, 0.8, arch(0) + 1.0], [x1 + 0.06, -0.8, arch(0) + 1.0]], { w: 0.45, boil: false });
    void kc;
  }, { name: 'bridge-span', under: 0 });
  // 4 near ramp: steps with their risers, the outer side
  T.obj([x0, Y, x1, RY + 0.6], function (g) {
    farWall(g, Y, RY); steps(g, Y, RY + 0.6); sideWall(g, Y, RY);
    const e = [[x0, RY, 0], [x0 + PW, RY, 0], [x0 + PW, RY, PH], [x0, RY, PH]]; g.fill(e, stone); g.outline(e, { w: 0.55 });
  }, { name: 'bridge-near' });
  // 5 the near parapet in three pieces
  T.obj([x1 - PW, -RY, x1, -Y], (g) => nearWall(g, -RY, -Y), { on: true, name: 'parapet-far' });
  T.obj([x1 - PW, -Y, x1, Y], (g) => nearWall(g, -Y, Y), { on: true, name: 'parapet-span' });
  T.obj([x1 - PW, Y, x1, RY], (g) => nearWall(g, Y, RY, true), { on: true, name: 'parapet-near' });
  return { z: (y) => (Math.abs(y) >= RY ? 0 : Math.max(RISE, step(y))), deck, x0, x1, ramp: RY, crown: HC };
};

/* ---------- people ---------- */
/* a walker on a closed route of points [x, y] (axis-aligned segments read best); zf(x, y) gives the ground height */
CAN.walker = function (T, seed, pts, speed, o) {
  o = o || {};
  const w = K.who(seed, o.who), seg = [], L = [0];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const tot = L[L.length - 1], per = tot / speed, zf = o.z || (() => 0);
  T.actor({ sample: 0.25, period: per,
    at(t) {
      let d = (((t + (o.t0 || 0)) * speed) % tot + tot) % tot, i = 0;
      while (d > L[i + 1]) i++;
      const [a, b] = seg[i], u = (d - L[i]) / (L[i + 1] - L[i] || 1), dx = b[0] - a[0], dy = b[1] - a[1];
      const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor((d / 2.4) % 1 * 8);
      const x = a[0] + dx * u, y = a[1] + dy * u;
      return { x, y, z: zf(x, y), key: dir + '.' + ph, dir, ph: ph / 8 };
    },
    draw(g, st) { const r = K.person(g, 0, 0, 0, Object.assign({}, w, { dir: st.dir, pose: 'walk', ph: st.ph })); if (o.extra) o.extra(g, r, st); } });
};

/* ---------- boats ---------- */
/* a gondola around the origin, bow towards ang (0 = +x), drawn as one half ('bow' or 'stern') so that each half sorts
   on its own anchor when it slides under a bridge. The anchor of each half is at u = +-L/2 (the caller offsets it).
   A long black hull rising at both ends, a steel ferro at the bow, a red cushioned seat with two passengers, the
   gondolier standing on the stern, rowing with one long oar on the right in its forcola. ph: stroke phase 0..1 */
CAN.gondola = function (g, ang, half, ph, o) {
  o = o || {};
  const L = 6.4, Wd = 1.15, ca = Math.cos(ang), sa = Math.sin(ang), sh = half === 'bow' ? -L / 2 : L / 2;    // shift: draw in half-local u
  const pt = (u, v, z) => [(u + sh) * ca - v * sa, (u + sh) * sa + v * ca, z];
  const wid = (u) => Wd * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u) / L, 2.2)), 0.55);
  const sheer = (u) => 0.95 + 1.5 * Math.pow(Math.abs(u) / L, 4);
  const u0 = half === 'bow' ? 0 : -L, u1 = half === 'bow' ? L : 0, us = [];
  for (let i = 0; i <= 14; i++) us.push(lerp(u0, u1, i / 14));
  const nv = [-sa, ca], near = nv[0] + nv[1] > 0 ? 1 : -1;          // which side (v sign) faces the camera
  const side = (s) => us.map((u) => pt(u, s * wid(u), sheer(u))).concat(us.slice().reverse().map((u) => pt(u, s * wid(u) * 0.8, 0)));
  // foam on the water along the hull
  g.fill(us.map((u) => pt(u, wid(u) * 1.25, 0)).concat(us.slice().reverse().map((u) => pt(u, -wid(u) * 1.25, 0))), '#D5EAE8');
  // inside of the far side, the floor, the near side
  g.fill(side(-near), '#3B3436');
  g.fill(us.map((u) => pt(u, wid(u) * 0.85, 0.55)).concat(us.slice().reverse().map((u) => pt(u, -wid(u) * 0.85, 0.55))), '#6B4A34');
  if (half === 'bow') {
    // the passengers' seat: a red cushion with a gilded back
    const s0 = 0.5, s1 = 1.7;
    K.rbox(g, (s0 + s1) / 2 * ca + sh * ca, (s0 + s1) / 2 * sa + sh * sa, (s1 - s0) / 2, Wd * 0.7, ang, 0.55, 1.15, { t: '#B9443A', l: '#C9584B', r: '#A63C33' }, { w: 0.45 });
    if (o.riders) o.riders(g, pt);
  }
  g.fill(side(near), '#2B282A');
  const gun = us.map((u) => pt(u, near * wid(u), sheer(u)));
  g.line(gun, { w: 0.6, c: '#C9A44A', boil: false, ext: 0 });
  g.line(us.map((u) => pt(u, near * wid(u) * 0.8, 0)), { w: 0.7, c: '#1F1C1D', boil: false, ext: 0 });
  g.line(us.map((u) => pt(u, -near * wid(u), sheer(u))), { w: 0.45, c: '#1F1C1D', boil: false, ext: 0 });
  if (half === 'bow') {
    // the ferro: a steel comb rising from the bow
    const b0 = g.p.apply(g, pt(L * 0.97, 0, sheer(L * 0.97))), b1 = g.p.apply(g, pt(L * 1.05, 0, 3.6));
    g.line2([b0, b1], { w: 0.9, c: '#C9CCD0', boil: false, ext: 0 });
    const tooth = []; for (let i = 0; i < 6; i++) { const t = 0.2 + i * 0.13, p = [lerp(b0[0], b1[0], t), lerp(b0[1], b1[1], t)], dx = ca * 2.92 - sa * -2.92; tooth.push(p[0], p[1], p[0] + (ca - sa > 0 ? 1.8 : -1.8), p[1] + 0.2); void dx; }
    g.segs2(tooth, '#AEB2B8', 0.45);
    g.disc2(b1, 0.7, '#D6D9DC');
  } else {
    // the stern curls up; the gondolier stands on its deck and rows on the right side
    const s0 = g.p.apply(g, pt(-L * 0.98, 0, sheer(-L * 0.98))), s1 = g.p.apply(g, pt(-L * 1.04, 0, 2.6));
    g.line2([s0, s1], { w: 1.1, c: '#2B282A', boil: false, ext: 0 });
    const kk = 0.88, fu = -L * 0.72, F = g.p.apply(g, pt(fu, 0.15, 1.1)), rel = (q) => [(q[0] - F[0]) / kk, (q[1] - F[1]) / kk];
    const sw = Math.sin(ph * TAU), lock = pt(fu + 1.2, Wd * 1.05, 1.6), blade = pt(fu - 1.4 - sw * 0.9, Wd * 2.3, 0.0);
    const lk = g.p.apply(g, lock), bl = g.p.apply(g, blade);
    // the grip: the oar runs from the blade through the forcola and on up to the hands
    const dx = lk[0] - bl[0], dy = lk[1] - bl[1], top = [lk[0] + dx * 0.55, lk[1] + dy * 0.55];
    const d = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2);
    const oarFar = near < 0;                          // the forcola is on the right (+v) side
    const oar = () => { g.line2([bl, top], { w: 0.7, c: '#8A6440', boil: false, ext: 0 }); g.fill2([[bl[0] - 1.2, bl[1] - 0.5], [bl[0] + 1.2, bl[1] + 0.5], [bl[0] + 0.9, bl[1] + 1.4], [bl[0] - 1.4, bl[1] + 0.6]], '#A07A50'); g.disc2(lk, 0.6, '#5A3E2E'); };
    if (o.empty) return;
    if (oarFar) oar();
    const r = K.person(g, pt(fu, 0.15, 1.1)[0], pt(fu, 0.15, 1.1)[1], 1.1, Object.assign({ hairStyle: 'short' }, o.who || {}, { dir: d, k: kk, top: '#F3F1EA', bot: '#2F2C2E', bare: false, lean: 0.12 + sw * 0.08, hands: [rel([top[0] - dx * 0.05, top[1] - dy * 0.05]), rel([top[0] - dx * 0.25, top[1] - dy * 0.25])] }));
    // the striped shirt and the straw boater with a red ribbon
    const s = r.shoulders, hp = r.hip;
    if (s && hp) { const st = []; for (let i = 1; i < 4; i++) { const t = i / 4, yy = lerp(Math.min(s[0][1], s[1][1]), hp[1], t); st.push(Math.min(s[0][0], s[1][0]) - 0.6, yy, Math.max(s[0][0], s[1][0]) + 0.6, yy); } g.segs2(st, '#2F3F63', 0.55); }
    const c = r.crown, br = arcPts(c[0], c[1] + 0.9, 3.1, 0, TAU, 14).map((q) => [q[0], c[1] + 0.9 + (q[1] - c[1] - 0.9) * 0.32]);
    g.fill2(br, '#E9D9A0', true); g.fill2([[c[0] - 1.8, c[1] + 0.9], [c[0] + 1.8, c[1] + 0.9], [c[0] + 1.7, c[1] - 0.8], [c[0] - 1.7, c[1] - 0.8]], '#E9D9A0', true);
    g.fill2([[c[0] - 1.8, c[1] + 0.9], [c[0] + 1.8, c[1] + 0.9], [c[0] + 1.8, c[1] + 0.1], [c[0] - 1.8, c[1] + 0.1]], '#C0392B', true);
    g.outline2(br, { w: 0.35, boil: false, c: '#8A7A4A' });
    if (!oarFar) oar();
  }
};
