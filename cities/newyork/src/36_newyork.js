'use strict';
/* New York's own kit (NK): lettering in a small stroke font, Manhattan buildings (brick walk-ups with zig-zag fire
   escapes and cornices, brownstones with high stoops, cast-iron fronts, wooden water tanks on steel legs, setback
   towers), street furniture (cobra-head lamps, hydrants, subway entrances with green globes, hot-dog carts, litter
   baskets, mailboxes, Citi Bike docks, the orange-and-white Con Ed steam stack and its steam), the people of New York
   (every skin and style, tourists in I-heart-NY tees, suits, NYPD, delivery riders with their insulated boxes) and
   its vehicles (yellow cabs, black cars, MTA buses, box trucks, a fire engine, delivery bikes, horse carriages).
   Everything in tile-local u unless the name ends in 2 (wide px). */
const NK = {};

/* ---------------- palette ---------------- */
const NYC = {
  cab: '#F2C12E', cabD: '#D9A41F', brick: '#B9654C', brickD: '#9A4F3B', brick2: '#C47A5A', brick3: '#A85A48',
  brown: '#8E5F48', brownD: '#6F4635', lime: '#E7DFCA', limeD: '#CFC5AC', iron: '#2F2C2A', ironL: '#5A554F',
  asph: '#D3CFC6', asphD: '#C4BFB4', walk: '#E9E5DC', walkD: '#D8D3C7', kerb: '#BDB7AA',
  bus: '#D58E78', bike: '#A9CC93', subway: '#3E8E5A', mta: '#2F6DB5', glass: '#C3D7E3', glassD: '#93AFC2',
  tank: '#9C7A55', tankD: '#7A5C3E', con1: '#E8742C', con2: '#F6F2E8', steam: '#F7F5EF',
};

/* ---------------- lettering: a small stroke font (cap height 6, width 4) ---------------- */
const NK_FONT = (function () {
  const O = [1, 0, 0, 1, 0, 5, 1, 6, 3, 6, 4, 5, 4, 1, 3, 0, 1, 0];
  const P = [0, 0, 0, 6, 3, 6, 4, 5, 4, 4, 3, 3, 0, 3];
  return {
    A: [[0, 0, 2, 6, 4, 0], [0.8, 2.4, 3.2, 2.4]], B: [[0, 0, 0, 6, 3, 6, 4, 5, 4, 4, 3, 3.2, 0, 3.2], [3, 3.2, 4, 2.2, 4, 1, 3, 0, 0, 0]],
    C: [[4, 5.2, 3, 6, 1, 6, 0, 5, 0, 1, 1, 0, 3, 0, 4, 0.8]], D: [[0, 0, 0, 6, 2.5, 6, 4, 4.5, 4, 1.5, 2.5, 0, 0, 0]],
    E: [[4, 6, 0, 6, 0, 0, 4, 0], [0, 3.1, 3, 3.1]], F: [[4, 6, 0, 6, 0, 0], [0, 3.1, 3, 3.1]],
    G: [[4, 5.2, 3, 6, 1, 6, 0, 5, 0, 1, 1, 0, 3, 0, 4, 1, 4, 2.8, 2.4, 2.8]], H: [[0, 0, 0, 6], [4, 0, 4, 6], [0, 3.1, 4, 3.1]],
    I: [[2, 0, 2, 6], [1, 6, 3, 6], [1, 0, 3, 0]], J: [[4, 6, 4, 1, 3, 0, 1, 0, 0, 1]], K: [[0, 0, 0, 6], [4, 6, 0, 2.4], [1.4, 3.6, 4, 0]],
    L: [[0, 6, 0, 0, 4, 0]], M: [[0, 0, 0, 6, 2, 3, 4, 6, 4, 0]], N: [[0, 0, 0, 6, 4, 0, 4, 6]], O: [O], P: [P],
    Q: [O, [2.6, 1.4, 4.2, -0.4]], R: [P, [2, 3, 4, 0]], S: [[4, 5.2, 3, 6, 1, 6, 0, 5, 0, 4, 1, 3.1, 3, 3, 4, 2, 4, 1, 3, 0, 1, 0, 0, 0.8]],
    T: [[0, 6, 4, 6], [2, 6, 2, 0]], U: [[0, 6, 0, 1, 1, 0, 3, 0, 4, 1, 4, 6]], V: [[0, 6, 2, 0, 4, 6]], W: [[0, 6, 1, 0, 2, 4, 3, 0, 4, 6]],
    X: [[0, 0, 4, 6], [0, 6, 4, 0]], Y: [[0, 6, 2, 3, 4, 6], [2, 3, 2, 0]], Z: [[0, 6, 4, 6, 0, 0, 4, 0]],
    0: [O], 1: [[1, 4.8, 2, 6, 2, 0], [1, 0, 3, 0]], 2: [[0, 5, 1, 6, 3, 6, 4, 5, 4, 4, 0, 0, 4, 0]],
    3: [[0, 5.2, 1, 6, 3, 6, 4, 5, 4, 4, 3, 3.1, 1.5, 3.1], [3, 3.1, 4, 2, 4, 1, 3, 0, 1, 0, 0, 0.8]], 4: [[3, 0, 3, 6, 0, 2, 4, 2]],
    5: [[4, 6, 0.4, 6, 0, 3.4, 3, 3.6, 4, 2.5, 4, 1, 3, 0, 0.5, 0, 0, 0.6]], 6: [[3.6, 6, 1.6, 6, 0, 4, 0, 1, 1, 0, 3, 0, 4, 1, 4, 2.4, 3, 3.4, 1, 3.4, 0, 2.4]],
    7: [[0, 6, 4, 6, 1.5, 0]], 8: [[1, 3.2, 0, 4.2, 0, 5, 1, 6, 3, 6, 4, 5, 4, 4.2, 3, 3.2, 1, 3.2, 0, 2.2, 0, 1, 1, 0, 3, 0, 4, 1, 4, 2.2, 3, 3.2]],
    9: [[4, 3.6, 3, 2.6, 1, 2.6, 0, 3.6, 0, 5, 1, 6, 3, 6, 4, 5, 4, 1, 3, 0, 1, 0]],
    '-': [[0.6, 3, 3.4, 3]], '.': [[1.8, 0, 2.2, 0, 2.2, 0.4, 1.8, 0.4, 1.8, 0]], "'": [[2, 6, 2, 4.6]], '&': [[4, 0, 0.6, 4.2, 0.6, 5.2, 1.4, 6, 2.4, 5.2, 2.4, 4.4, 0, 2, 0, 0.8, 1, 0, 2.4, 0, 4, 2]],
    '/': [[0, 0, 4, 6]], '!': [[2, 6, 2, 1.6], [2, 0.4, 2, 0]],
  };
})();
/* text along any plane: P(a, z) -> world point; the string starts at a0 (or is centred on it with o.center) and runs to
   increasing a; h = cap height in u. Strokes are batched (cheap) in wide px. */
NK.textP = function (g, P, a0, z0, h, str, col, o) {
  o = o || {}; const u = h / 6, adv = (o.track || 5.5) * u, s = String(str).toUpperCase(), segs = [];
  let a = o.center ? a0 - (s.length * adv - 1.5 * u) / 2 : a0;
  const it = o.italic || 0;
  for (const ch of s) {
    const gl = NK_FONT[ch];
    if (gl) for (const pl of gl) for (let i = 0; i + 3 < pl.length; i += 2) {
      const p0 = g.p.apply(g, P(a + (pl[i] + pl[i + 1] * it) * u, z0 + pl[i + 1] * u)), p1 = g.p.apply(g, P(a + (pl[i + 2] + pl[i + 3] * it) * u, z0 + pl[i + 3] * u));
      segs.push(p0[0], p0[1], p1[0], p1[1]);
    }
    a += adv;
  }
  g.segs2(segs, col, o.w || clamp(h * 0.5, 0.22, 1.6));
};
/* text on a building face: face 'L' (plane y = p, reads along +x) or 'R' (plane x = p, reads along -y) */
NK.text = function (g, face, p, a, z0, h, str, col, o) {
  const P = face === 'L' ? (s, z) => [s, p + 0.06, z] : (s, z) => [p + 0.06, -s, z];
  NK.textP(g, P, face === 'L' ? a : -a, z0, h, str, col, o);
};
/* a sign board on a face with a word on it */
NK.sign = function (g, face, p, a0, a1, z0, z1, col, word, o) {
  o = o || {}; const q = K.on(face, p + 0.05, a0, a1, z0, z1);
  g.fill(q, col); g.outline(q, { w: o.w || 0.45, c: o.c || shade(col, 0.5), boil: false });
  if (word) {
    const h = Math.min((z1 - z0) * 0.6, Math.abs(a1 - a0) / (word.length * 5.5 / 6 + 0.3));
    NK.text(g, face, p + 0.02, (a0 + a1) / 2, (z0 + z1) / 2 - h / 2, h, word, o.ink || (hex2rgb(col).reduce((x, y) => x + y) > 430 ? '#2C271C' : '#FBF8EE'), { center: true });
  }
};

/* ---------------- building parts ---------------- */
/* windows in a grid on a face: n per floor across [a0,a1], floors from z0 every fh, nf floors */
NK.windows = function (g, face, p, a0, a1, z0, fh, nf, n, o) {
  o = o || {}; const cw = (a1 - a0) / n, ww = cw * (o.fill || 0.52), wh = fh * (o.hfill || 0.56);
  for (let f = 0; f < nf; f++) for (let i = 0; i < n; i++) {
    if (o.skip && o.skip(f, i)) continue;
    const m = a0 + cw * (i + 0.5), zb = z0 + f * fh + fh * (o.sill || 0.2);
    K.win(g, face, p + 0.02, m - ww / 2, m + ww / 2, zb, zb + wh, { style: o.style || 'glass', w: 0.4, arch: o.arch });
    if (o.lintel) g.fill(K.on(face, p + 0.04, m - ww / 2 - 0.25, m + ww / 2 + 0.25, zb + wh, zb + wh + 0.35), o.lintel);
    if (o.sillCol) g.fill(K.on(face, p + 0.04, m - ww / 2 - 0.15, m + ww / 2 + 0.15, zb - 0.22, zb), o.sillCol);
  }
};
/* a projecting cornice band round the top of a box (the visible faces), with brackets */
NK.cornice = function (g, x0, y0, x1, y1, z, col, o) {
  o = o || {}; const d = o.d == null ? 0.7 : o.d, h = o.h || 1.1;
  K.box(g, x0 - d, y0 - d, x1 + d, y1 + d, z, z + h, col, { w: 0.6, boil: false });
  const br = [];
  for (const [f, pl, A0, A1] of [['L', y1 + d, x0, x1], ['R', x1 + d, y0, y1]]) for (let a = A0 + 0.8; a < A1 - 0.4; a += 1.6) {
    const p0 = g.p.apply(g, K.pt(f, pl + 0.02, a, z + 0.1)), p1 = g.p.apply(g, K.pt(f, pl + 0.02, a, z + h * 0.7)); br.push(p0[0], p0[1], p1[0], p1[1]);
  }
  g.segs2(br, shade(typeof col === 'object' ? col.l : col, 0.35), 0.4);
};
/* a zig-zag fire escape on a face: a balcony at each floor, a stair between them, a drop ladder at the bottom */
NK.fireEscape = function (g, face, p, a0, a1, z0, fh, nf, o) {
  o = o || {}; const d = o.d || 1.5, col = o.col || NYC.iron, P = (a, w, z) => face === 'L' ? [a, p + w, z] : [p + w, a, z];
  const segs = [], S = (A, B) => { const q0 = g.p.apply(g, A), q1 = g.p.apply(g, B); segs.push(q0[0], q0[1], q1[0], q1[1]); };
  for (let f = 0; f < nf; f++) {
    const z = z0 + f * fh;
    // the slatted platform and its railing
    g.fill([P(a0, 0, z), P(a1, 0, z), P(a1, d, z), P(a0, d, z)], 'rgba(47,44,42,0.55)');
    S(P(a0, d, z), P(a1, d, z)); S(P(a0, d, z + 1.2), P(a1, d, z + 1.2)); S(P(a1, 0, z + 1.2), P(a1, d, z + 1.2)); S(P(a0, 0, z + 1.2), P(a0, d, z + 1.2));
    for (let a = a0; a <= a1 + 0.01; a += (a1 - a0) / 5) S(P(a, d, z), P(a, d, z + 1.2));
    // the stair down to the platform below, alternating direction
    if (f > 0) { const s0 = f % 2 ? a0 + 0.4 : a1 - 0.4, s1 = f % 2 ? a1 - 1.6 : a0 + 1.6; S(P(s0, d * 0.5, z), P(s1, d * 0.5, z - fh)); S(P(s0, d * 0.95, z), P(s1, d * 0.95, z - fh)); }
  }
  // the drop ladder hanging under the lowest platform
  const la = o.ladder == null ? a1 - 1 : o.ladder; S(P(la, d * 0.6, z0), P(la, d * 0.6, z0 - fh * 0.55)); S(P(la + 0.6, d * 0.6, z0), P(la + 0.6, d * 0.6, z0 - fh * 0.55));
  g.segs2(segs, col, 0.42);
};
/* a wooden water tank on a steel stand: staves, hoops, a conical roof with a finial, a ladder */
NK.tank = function (g, x, y, z, o) {
  o = o || {}; const r = o.r || 2.1, h = o.h || 4.2, leg = o.leg || 2.2, col = o.col || NYC.tank;
  const legs = [];
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const a = g.p(x + dx * r * 0.62, y + dy * r * 0.62, z), b = g.p(x + dx * r * 0.62, y + dy * r * 0.62, z + leg); legs.push(a[0], a[1], b[0], b[1]); }
  const xa = g.p(x - r * 0.62, y + r * 0.62, z + 0.2), xb = g.p(x + r * 0.62, y + r * 0.62, z + leg - 0.1), xc = g.p(x + r * 0.62, y + r * 0.62, z + 0.2), xd = g.p(x - r * 0.62, y + r * 0.62, z + leg - 0.1);
  legs.push(xa[0], xa[1], xb[0], xb[1], xc[0], xc[1], xd[0], xd[1]);
  g.segs2(legs, '#4A4440', 0.55);
  K.box(g, x - r * 0.8, y - r * 0.8, x + r * 0.8, y + r * 0.8, z + leg - 0.35, z + leg, '#6E6660', { w: 0.4, boil: false });
  K.cyl(g, x, y, r, z + leg, z + leg + h, { t: shade(col, -0.15), l: col, r: shade(col, 0.16) }, { w: 0.7, n: 12, nt: true, c: '#4A3726' });
  const st = [];
  for (let i = 1; i < 9; i++) { const a = A_L + (A_R + TAU - A_L) * i / 9 - TAU * 0; const aa = Math.PI * 0.75 - Math.PI * i / 9; const p0 = g.p(x + Math.cos(aa) * r, y + Math.sin(aa) * r, z + leg + 0.1), p1 = g.p(x + Math.cos(aa) * r, y + Math.sin(aa) * r, z + leg + h - 0.1); st.push(p0[0], p0[1], p1[0], p1[1]); void a; }
  g.segs2(st, shade(col, 0.3), 0.28);
  for (const t of [0.22, 0.55, 0.85]) g.fine(K.arc(x, y, z + leg + h * t, r + 0.04, A_L, A_R, 12), { w: 0.38, c: '#3E3A36' });
  K.cone(g, x, y, r + 0.25, z + leg + h, r * 0.75, shade(col, -0.05), { c: '#4A3726' });
  const f = g.p(x, y, z + leg + h + r * 0.75); g.disc2([f[0], f[1] - 0.6], 0.45, '#4A4440');
  // a ladder up the side we see
  const L0 = g.p(x + r * 0.7, y + r * 0.72, z + leg), L1 = g.p(x + r * 0.7, y + r * 0.72, z + leg + h + 0.4);
  g.segs2([L0[0] - 0.4, L0[1], L1[0] - 0.4, L1[1], L0[0] + 0.4, L0[1], L1[0] + 0.4, L1[1]], '#3E3A36', 0.3);
};
/* rooftop clutter: bulkhead, vents, a chimney */
NK.roofStuff = function (g, x0, y0, x1, y1, z, seed) {
  const R = RNG(seed || 1);
  const bx = lerp(x0 + 1, x1 - 4, R()), by = lerp(y0 + 1, y1 - 4, R());
  K.box(g, bx, by, bx + 3, by + 2.6, z, z + 2.2, { t: '#D9D3C6', l: '#E3DED2', r: '#C9C3B6' }, { w: 0.5, boil: false });
  const v = g.p(lerp(x0 + 1, x1 - 1, R()), lerp(y0 + 1, y1 - 1, R()), z);
  g.fill2([[v[0] - 0.8, v[1]], [v[0] + 0.8, v[1]], [v[0] + 0.8, v[1] - 2.4], [v[0] - 0.8, v[1] - 2.4]], '#B9B4AA'); g.fill2([[v[0] - 1.1, v[1] - 2.4], [v[0] + 1.1, v[1] - 2.4], [v[0], v[1] - 3.3]], '#8E8A84');
};
/* a flat-roofed block with parapet edge: the common Manhattan box */
NK.block = function (g, x0, y0, x1, y1, h, col, o) {
  o = o || {}; K.box(g, x0, y0, x1, y1, o.z0 || 0, h, col, { w: o.w || 0.9 });
  if (o.parapet !== false) K.box(g, x0, y0, x1, y1, h, h + 0.5, typeof col === 'object' ? { t: col.t, l: shade(col.l, 0.08), r: shade(col.r, 0.08) } : shade(col, 0.08), { w: 0.5, boil: false, nb: true });
};
/* a storefront on a face: glass, a door, an awning, a sign board with a word */
NK.shop = function (g, face, p, a0, a1, o) {
  o = o || {}; const h = o.h || 4.2, col = o.col || '#3F6B57';
  g.fill(K.on(face, p + 0.02, a0, a1, 0, h), o.frame || '#2F2C2A');
  K.win(g, face, p + 0.04, a0 + 0.35, a1 - 0.35, 0.6, h - 1.4, { style: 'glass', w: 0.35, col: o.glass || '#D8E3E6' });
  const dm = o.door == null ? a0 + (a1 - a0) * 0.75 : o.door;
  g.fill(K.on(face, p + 0.06, dm - 0.7, dm + 0.7, 0, h - 1.5), '#4A3A2E');
  if (o.goods) { const R = RNG(Math.round((a0 + p) * 13)), pts = []; for (let k = 0; k < Math.floor((a1 - a0) * 1.4); k++) { const c = g.p.apply(g, K.pt(face, p + 0.08, a0 + 0.6 + R() * (a1 - a0 - 1.2), 0.9 + R() * 1.4)); g.disc2(c, 0.55, R.pick(o.goods)); pts.push(c); } }
  if (o.sign !== false) NK.sign(g, face, p + 0.04, a0, a1, h - 1.25, h - 0.15, o.signCol || col, o.word || '', { ink: o.ink });
  if (o.awning) NK.awning(g, face, p, a0 + 0.2, a1 - 0.2, h - 1.35, o.awOut || 1.6, o.awning, { stripe: o.stripe });
};
/* an awning sloping out from a face */
NK.awning = function (g, face, p, a0, a1, z, out, col, o) {
  o = o || {}; const drop = o.drop || 1.0, P = (a, d, zz) => face === 'L' ? [a, p + d, zz] : [p + d, a, zz];
  const q = [P(a0, 0, z), P(a1, 0, z), P(a1, out, z - drop), P(a0, out, z - drop)];
  g.fill(q, col);
  if (o.stripe) { const n = Math.max(2, Math.round(Math.abs(a1 - a0) / 1.3)); for (let i = 0; i < n; i += 2) { const s0 = lerp(a0, a1, i / n), s1 = lerp(a0, a1, (i + 1) / n); g.fill([P(s0, 0, z), P(s1, 0, z), P(s1, out, z - drop), P(s0, out, z - drop)], o.stripe); } }
  const v = [P(a0, out, z - drop), P(a1, out, z - drop), P(a1, out, z - drop - 0.55), P(a0, out, z - drop - 0.55)];
  g.fill(v, shade(col, 0.12)); g.outline(q, { w: 0.5, c: shade(col, 0.5), boil: false }); g.line([v[3], v[2]], { w: 0.45, c: shade(col, 0.5), boil: false });
};

/* a brick walk-up (tenement): storefront below, nf floors of windows, a fire escape on the street face, a cornice,
   a water tank on the roof. face: the street side ('L' or 'R'). */
NK.walkup = function (g, x0, y0, x1, y1, nf, o) {
  o = o || {}; const fh = o.fh || 3.6, col = o.col || NYC.brick, H = 4.6 + nf * fh, face = o.face || 'L';
  const tones = { t: '#D9D2C4', l: col, r: shade(col, 0.14) };
  K.box(g, x0, y0, x1, y1, 0, H, tones, { w: 0.9 });
  // brick coursing hints
  const bc = [];
  for (const [f, pl, A0, A1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) for (let z = 5.2; z < H - 0.6; z += 1.3) { const s = (A1 - A0) * (0.15 + 0.25 * h2(Math.round(z * 3), Math.round(A0 * 7))); const a = A0 + (A1 - A0 - s) * h1(Math.round(z * 11 + A0)); const p0 = g.p.apply(g, K.pt(f, pl + 0.02, a, z)), p1 = g.p.apply(g, K.pt(f, pl + 0.02, a + s, z)); bc.push(p0[0], p0[1], p1[0], p1[1]); }
  g.segs2(bc, shade(col, 0.22), 0.3);
  const lin = o.lintel || NYC.lime;
  for (const [f, pl, A0, A1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
    const n = Math.max(2, Math.round((A1 - A0) / 2.6));
    NK.windows(g, f, pl, A0 + 0.3, A1 - 0.3, 4.6, fh, nf, n, { style: 'glass', lintel: lin, sillCol: lin });
    if (f === face && o.shop !== false) NK.shop(g, f, pl, A0 + 0.4, A1 - 0.4, Object.assign({ h: 4.3 }, o.shop || {}));
    else if (o.shop !== false) g.fill(K.on(f, pl + 0.02, A0, A1, 0, 4.4), shade(col, 0.2));
  }
  NK.cornice(g, x0, y0, x1, y1, H - 0.2, { t: '#D9D2C4', l: o.corn || '#C9BFA9', r: shade(o.corn || '#C9BFA9', 0.12) }, { h: 1.0, d: 0.55 });
  if (o.fire !== false) { const [f, pl, A0, A1] = face === 'L' ? ['L', y1, x0, x1] : ['R', x1, y0, y1]; const w = Math.min(7, (A1 - A0) * 0.55), m = o.feAt == null ? (A0 + A1) / 2 : o.feAt; NK.fireEscape(g, f, pl, m - w / 2, m + w / 2, 4.6 + fh * 0.04, fh, nf); }
  if (o.tank !== false) NK.tank(g, lerp(x0, x1, o.tx == null ? 0.35 : o.tx), lerp(y0, y1, o.ty == null ? 0.35 : o.ty), H + 0.5, { r: 1.6, h: 3.2, leg: 1.8 });
  return H;
};
/* a brownstone rowhouse: raised basement, a high stoop to the parlour floor, tall windows, a bracketed cornice.
   The stoop comes out of face 'L' (towards +y) or 'R' (towards +x); a: where the door is along that face. */
NK.brownstone = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const col = o.col || NYC.brown, nf = o.nf || 3, fh = 3.6, base = 2.6, H = base + nf * fh + 0.4, face = o.face || 'L';
  K.box(g, x0, y0, x1, y1, 0, base, { t: '#CFC5AC', l: shade(col, 0.05), r: shade(col, 0.18) }, { w: 0.8 });
  K.box(g, x0, y0, x1, y1, base, H, { t: '#D8CDBA', l: col, r: shade(col, 0.15) }, { w: 0.9 });
  for (const [f, pl, A0, A1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
    const n = Math.max(2, Math.round((A1 - A0) / 2.4));
    NK.windows(g, f, pl, A0 + 0.3, A1 - 0.3, base, fh, nf, n, { style: 'glass', hfill: 0.62, lintel: shade(col, -0.25), sillCol: shade(col, -0.2) });
    NK.windows(g, f, pl, A0 + 0.3, A1 - 0.3, 0.3, base, 1, n, { style: 'dark', hfill: 0.5, fill: 0.4 });
  }
  NK.cornice(g, x0, y0, x1, y1, H - 0.3, { t: '#5A4A3C', l: '#6E5A48', r: '#5A4838' }, { h: 1.0, d: 0.6 });
  g.fill(K.rect(x0 + 0.2, y0 + 0.2, x1 - 0.2, y1 - 0.2, H + 0.7), '#CFC5B4');
  // the stoop: a flight of steps with iron railings down to the sidewalk
  const L = face === 'L', a = o.door == null ? (L ? x0 + 1.6 : y0 + 1.6) : o.door, out = o.out || 4.2, sw = 1.7;
  const S = (u, w, z) => L ? [a + w, y1 + u, z] : [x1 + u, a + w, z];
  g.fill(L ? K.on('L', y1 + 0.03, a - 1.0, a + 1.0, base, base + 3.2) : K.on('R', x1 + 0.03, a - 1.0, a + 1.0, base, base + 3.2), '#4A3428');
  g.fill(L ? K.on('L', y1 + 0.05, a - 1.2, a + 1.2, base + 3.2, base + 3.6) : K.on('R', x1 + 0.05, a - 1.2, a + 1.2, base + 3.2, base + 3.6), shade(col, -0.25));
  const n = 7;
  for (let i = n - 1; i >= 0; i--) {
    const u0 = out * i / n, u1 = out * (i + 1) / n, z = base * (1 - i / n);
    g.fill([S(u0, -sw / 2, z), S(u1, -sw / 2, z), S(u1, sw / 2, z), S(u0, sw / 2, z)], shade(col, -0.12));
    g.fill([S(u1, -sw / 2, z), S(u1, sw / 2, z), S(u1, sw / 2, z - base / n), S(u1, -sw / 2, z - base / n)], shade(col, 0.1));
  }
  g.fill([S(0, sw / 2, base), S(out, sw / 2, 0), S(0, sw / 2, 0)], shade(col, 0.22));
  g.line([S(0, sw / 2, base), S(out, sw / 2, 0)], { w: 0.5, boil: false });
  for (const w of [-sw / 2, sw / 2]) { g.fine([S(0, w, base + 1.4), S(out, w, 1.2), S(out + 0.2, w, 0)], { w: 0.45, c: NYC.iron }); }
  return H;
};
/* a cast-iron loft front (SoHo): tall windows between slim columns, painted, a heavy cornice */
NK.castIron = function (g, x0, y0, x1, y1, nf, o) {
  o = o || {}; const fh = 4.0, col = o.col || '#E6E0D0', H = 5 + nf * fh;
  K.box(g, x0, y0, x1, y1, 0, H, { t: '#D9D3C6', l: col, r: shade(col, 0.12) }, { w: 0.9 });
  for (const [f, pl, A0, A1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
    const n = Math.max(2, Math.round((A1 - A0) / 2.2)), cw = (A1 - A0) / n, cols = [];
    for (let i = 0; i <= n; i++) { const a = A0 + cw * i, p0 = g.p.apply(g, K.pt(f, pl + 0.04, a, 5)), p1 = g.p.apply(g, K.pt(f, pl + 0.04, a, H - 0.8)); cols.push(p0[0], p0[1], p1[0], p1[1]); }
    NK.windows(g, f, pl, A0, A1, 5, fh, nf, n, { style: 'glass', fill: 0.7, hfill: 0.72, arch: o.arch });
    g.segs2(cols, shade(col, 0.3), 0.5);
    for (let k = 1; k <= nf; k++) g.fine([K.pt(f, pl + 0.05, A0, 5 + k * fh - 0.1), K.pt(f, pl + 0.05, A1, 5 + k * fh - 0.1)], { w: 0.4, c: shade(col, 0.3) });
  }
  NK.cornice(g, x0, y0, x1, y1, H - 0.2, { t: '#D9D3C6', l: shade(col, 0.05), r: shade(col, 0.16) }, { h: 1.3, d: 0.8 });
  return H;
};

/* ---------------- street furniture ---------------- */
NK.hydrant = function (g, x, y) {
  const f = g.p(x, y, 0), col = '#C9463E';
  g.fill2([[f[0] - 0.9, f[1]], [f[0] + 0.9, f[1]], [f[0] + 0.8, f[1] - 2.6], [f[0] - 0.8, f[1] - 2.6]], col, true);
  g.fill2([[f[0] + 0.1, f[1]], [f[0] + 0.9, f[1]], [f[0] + 0.8, f[1] - 2.6], [f[0] + 0.15, f[1] - 2.6]], shade(col, 0.15), true);
  g.fill2(arcPts(f[0], f[1] - 2.6, 0.85, Math.PI, TAU, 6), '#B9B4AA', true);
  g.fill2([[f[0] - 1.6, f[1] - 1.9], [f[0] + 1.6, f[1] - 1.9], [f[0] + 1.6, f[1] - 1.3], [f[0] - 1.6, f[1] - 1.3]], '#B9B4AA', true);
  g.outline2([[f[0] - 0.9, f[1]], [f[0] - 0.8, f[1] - 2.6], [f[0] + 0.8, f[1] - 2.6], [f[0] + 0.9, f[1]]], { w: 0.35, c: '#5A2A24', boil: false });
};
/* the cobra-head street lamp: a tapered grey pole, a long curved arm over the street (dx, dy: unit direction) */
NK.lamp = function (g, x, y, dx, dy, o) {
  o = o || {}; const h = o.h || 11, L = o.L || 4.2, f = g.p(x, y, 0), t = g.p(x, y, h);
  g.fill2([[f[0] - 0.8, f[1]], [f[0] + 0.8, f[1]], [f[0] + 0.7, f[1] - 2.0], [f[0] - 0.7, f[1] - 2.0]], '#6E6A62');
  g.fill2([[f[0] - 0.45, f[1] - 2], [f[0] + 0.45, f[1] - 2], [t[0] + 0.3, t[1]], [t[0] - 0.3, t[1]]], '#7E7A72');
  const pts = []; for (let i = 0; i <= 8; i++) { const s = i / 8; pts.push(g.p(x + dx * L * s, y + dy * L * s, h + 1.4 * Math.sin(s * Math.PI * 0.5) - (s > 0.85 ? (s - 0.85) * 2 : 0))); }
  g.line2(pts, { w: 0.7, c: '#5E5A52', boil: false, ext: 0 });
  const e = pts[8]; g.fill2([[e[0] - 1.5, e[1] - 0.2], [e[0] + 1.3, e[1] - 0.4], [e[0] + 1.0, e[1] + 0.8], [e[0] - 1.2, e[1] + 0.9]], '#6E6A62', true);
  g.fill2([[e[0] - 1.0, e[1] + 0.8], [e[0] + 0.9, e[1] + 0.7], [e[0] + 0.5, e[1] + 1.2], [e[0] - 0.6, e[1] + 1.25]], '#F2E3A6', true);
};
/* a subway entrance: a stair going down between iron railings, a green globe lamp on a post at each side of the mouth.
   The stair descends towards dir ('x+','x-','y+','y-'); w: half width, L: length */
NK.subway = function (g, x, y, dir, o) {
  o = o || {}; const w = o.w || 2.0, L = o.L || 6.0;
  const ax = dir[0] === 'x', sg = dir[1] === '+' ? 1 : -1;
  const P = (u, v, z) => ax ? [x + sg * u, y + v, z] : [x + v, y + sg * u, z];
  // the hole and the steps going down into it
  g.fill([P(0, -w, 0), P(L, -w, 0), P(L, w, 0), P(0, w, 0)], '#3A3530');
  const st = []; for (let i = 1; i < 9; i++) { const u = L * i / 9, z = -i * 0.5; const a = g.p.apply(g, P(u, -w + 0.2, 0)), b = g.p.apply(g, P(u, w - 0.2, 0)); void z; st.push(a[0], a[1] + i * 0.35, b[0], b[1] + i * 0.35); }
  g.segs2(st, '#6E665C', 0.45);
  // railings (green iron) on the three sides
  const rl = [];
  const R = (A, B) => { const p0 = g.p.apply(g, A), p1 = g.p.apply(g, B); rl.push(p0[0], p0[1], p1[0], p1[1]); };
  for (const v of [-w, w]) { R(P(0, v, 2.6), P(L, v, 2.6)); for (let u = 0; u <= L + 0.01; u += L / 4) R(P(u, v, 0), P(u, v, 2.6)); }
  R(P(L, -w, 2.6), P(L, w, 2.6)); R(P(L, -w, 0), P(L, -w, 2.6)); R(P(L, w, 0), P(L, w, 2.6));
  g.segs2(rl, '#2F4A3A', 0.5);
  // globes at the open end
  for (const v of [-w, w]) {
    const b = g.p.apply(g, P(0.1, v, 0)), t = g.p.apply(g, P(0.1, v, 5.0));
    g.segs2([b[0], b[1], t[0], t[1]], '#2F4A3A', 0.7);
    g.disc2([t[0], t[1] - 1.1], 1.25, '#5FB07A'); g.disc2([t[0] - 0.35, t[1] - 1.45], 0.45, '#BDE6C8'); g.ring2([t[0], t[1] - 1.1], 1.25, { w: 0.4, c: '#2F4A3A' });
  }
  if (o.sign !== false) { const s0 = g.p.apply(g, P(L * 0.55, -w, 2.7)), s1 = g.p.apply(g, P(L * 0.55, w, 2.7)); g.fill2([[s0[0], s0[1]], [s1[0], s1[1]], [s1[0], s1[1] - 1.6], [s0[0], s0[1] - 1.6]], '#2F2C2A', true); }
};
/* the hot-dog / pretzel cart: steel box on two wheels, a striped umbrella, a vendor at the end (who), a menu board */
NK.cart = function (g, x, y, o) {
  o = o || {}; const along = o.along || 'x', umb = o.umb || ['#2F6DB5', '#F2C12E'];
  const draw = (g2) => {
    K.box(g2, -2.2, -1.1, 2.2, 1.1, 1.1, 3.2, { t: '#E9EAE6', l: '#C9CCCC', r: '#AEB2B4' }, { w: 0.6, boil: false });
    g2.fill(K.on('L', 1.12, -2.0, 0.4, 1.4, 2.9), '#F2C12E'); NK.text(g2, 'L', 1.14, -0.8, 1.75, 0.8, 'HOT', '#C9463E', { center: true }); g2.fill(K.on('L', 1.12, 0.6, 2.0, 1.4, 2.9), '#E9EAE6');
    const wh = g2.p(0.8, 1.15, 0.8); g2.ring2(wh, 2.2, { w: 0.55, c: '#3A3632' }); g2.disc2(wh, 0.5, '#3A3632');
    const pp = g2.p(0, 0, 3.2), pt = g2.p(0, 0, 7.6); g2.segs2([pp[0], pp[1], pt[0], pt[1]], '#5E5A52', 0.5);
    for (let i = 0; i < 8; i++) { const a0 = TAU * i / 8, a1 = TAU * (i + 1) / 8, A = g2.p(Math.cos(a0) * 3.6, Math.sin(a0) * 3.6, 6.8), B = g2.p(Math.cos(a1) * 3.6, Math.sin(a1) * 3.6, 6.8); g2.fill2([pt, A, B], umb[i % 2]); }
    const rim = []; for (let i = 0; i <= 16; i++) { const a = TAU * i / 16; rim.push(g2.p(Math.cos(a) * 3.6, Math.sin(a) * 3.6, 6.8)); }
    g2.line2(rim.slice(0, 9), { w: 0.5, c: '#2C3E5E', boil: false });
    // a little steam from the water bath
    const s = g2.p(-1.4, 0, 3.3); g2.fill2([[s[0] - 0.5, s[1]], [s[0] + 0.3, s[1] - 1.6], [s[0] + 1.1, s[1] - 2.2], [s[0] + 0.2, s[1] - 1.0]], 'rgba(247,245,239,0.85)', true);
  };
  g.at(x, y, 0, draw, along === 'y');
};
NK.basket = function (g, x, y) { K.cyl(g, x, y, 0.85, 0, 2.6, { t: '#3E5A44', l: '#4F7A5A', r: '#3E6448' }, { w: 0.45, n: 8 }); const s = []; for (let i = 0; i < 4; i++) { const a = g.p(x - 0.6 + i * 0.4, y + 0.6, 0.2), b = g.p(x - 0.6 + i * 0.4, y + 0.6, 2.4); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#2F4A3A', 0.25); };
NK.mailbox = function (g, x, y) { K.box(g, x - 0.8, y - 0.7, x + 0.8, y + 0.7, 0.5, 3.0, { t: '#3F6FA8', l: '#2F5E9A', r: '#244E84' }, { w: 0.45, boil: false }); const t = g.p(x, y + 0.7, 2.6); g.fill2([[t[0] - 1.6, t[1]], [t[0] + 1.2, t[1] - 0.4], [t[0] + 1.2, t[1] + 0.3], [t[0] - 1.6, t[1] + 0.7]], '#E9EAE6', true); };
NK.newsbox = function (g, x, y, col) { K.box(g, x - 0.7, y - 0.6, x + 0.7, y + 0.6, 0, 2.6, col || '#C9463E', { w: 0.4, boil: false }); };
/* a Citi Bike dock: a row of blue bikes in their docks along a line (along 'x' or 'y'), n bikes */
NK.citibikes = function (g, x, y, along, n) {
  for (let i = 0; i < n; i++) {
    const bx = along === 'x' ? x + i * 1.4 : x, by = along === 'y' ? y + i * 1.4 : y;
    const ang = along === 'x' ? Math.PI / 2 : 0, ca = Math.cos(ang), sa = Math.sin(ang), P = (u, z) => g.p(bx + u * ca, by + u * sa, z);
    const w0 = P(-1.6, 1.0), w1 = P(1.6, 1.0); g.ring2(w0, 2.6, { w: 0.5, c: '#3A3632' }); g.ring2(w1, 2.6, { w: 0.5, c: '#3A3632' });
    const s = P(-0.4, 2.6), hb = P(1.3, 2.9), bb = P(0, 1.0); g.segs2([w0[0], w0[1], s[0], s[1], s[0], s[1], bb[0], bb[1], bb[0], bb[1], hb[0], hb[1], hb[0], hb[1], w1[0], w1[1], w0[0], w0[1], bb[0], bb[1]], '#2F6DB5', 0.9);
    const bk = P(1.6, 2.6); g.fill2([[bk[0] - 1, bk[1]], [bk[0] + 1, bk[1]], [bk[0] + 0.8, bk[1] - 1], [bk[0] - 0.8, bk[1] - 1]], '#2F6DB5', true);
    const d = P(1.9, 0); g.fill2([[d[0] - 0.4, d[1]], [d[0] + 0.4, d[1]], [d[0] + 0.4, d[1] - 3.4], [d[0] - 0.4, d[1] - 3.4]], '#7E8A94', true);
  }
};
/* a street tree in a pit with a little iron guard: London planes and honey locusts in full leaf */
NK.tree = function (g, x, y, o) {
  o = o || {}; const p = g.P(K.rect(x - 1.3, y - 1.3, x + 1.3, y + 1.3, 0)); g.fill2(p, '#9C8C70'); g.outline2(p, { w: 0.3, c: '#6E6450', boil: false });
  K.tree(g, x, y, { r: o.r || 3.6, h: o.h || 5.2, col: o.col || (h1(Math.round(x * 7 + y * 13)) < 0.5 ? '#8DB868' : '#7FAE62'), seed: o.seed });
};
/* the Con Ed steam stack: a striped orange-and-white tube on a little cone base, set in a work zone */
NK.stack = function (g, x, y) {
  K.cone(g, x, y, 1.5, 0, 1.2, '#E8742C');
  const n = 6, H = 8.6;
  for (let i = 0; i < n; i++) K.cyl(g, x, y, 0.95, 1.0 + i * (H - 1) / n, 1.0 + (i + 1) * (H - 1) / n, i % 2 ? { t: '#F6F2E8', l: '#F6F2E8', r: '#DCD6C8' } : { t: '#E8742C', l: '#E8742C', r: '#C95E1E' }, { w: 0.5, n: 10, nt: i < n - 1 });
};
/* steam: a column of cream puffs rising from (0,0,z0) drifting with the wind; ph 0..1 (quantised by the caller) */
NK.steam2 = function (g, z0, ph, o) {
  o = o || {}; const n = o.n || 5, H = o.H || 16, drift = o.drift == null ? 6 : o.drift, w0 = o.w || 2.2, base = g.p(0, 0, z0);
  for (let i = n - 1; i >= 0; i--) {
    const t = ((i + ph) / n), r = (w0 + t * w0 * 2.4) * 2.4, cx = base[0] + drift * t * t * 3.2 + Math.sin(t * 7 + i) * 1.2, cy = base[1] - t * H * 3.46;
    const R = RNG(i * 13 + 5), pts = [];
    for (let k = 0; k < 9; k++) { const a = TAU * k / 9, rr = r * (0.75 + R() * 0.45); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.75]); }
    const a = t < 0.15 ? t / 0.15 : 1 - Math.pow((t - 0.15) / 0.85, 1.4);
    const col = 'rgba(247,245,239,' + (0.92 * clamp(a, 0, 1)).toFixed(2) + ')';
    K.blob2(g, pts, col, { seed: i + 3, rag: 0.8 });
    if (a > 0.35) g.line2(K.curve(pts, 2, true).slice(3, 12), { w: 0.35, c: 'rgba(170,164,150,' + (0.6 * a).toFixed(2) + ')', boil: false, wob: 0.5 });
  }
};
/* an actor of rising steam at tile-local (x, y) */
NK.steamActor = function (T, x, y, o) {
  o = o || {}; const per = o.per || 2.4, NPH = 12, z0 = o.z || 0;
  return T.actor({ sample: 5, period: 10, grow: false, cast: o.cast,
    at(t) { const ph = Math.floor(((t / per + (o.phase || 0)) % 1) * NPH); return { x, y, z: 0, key: ph, ph: ph / NPH }; },
    draw(g, st) { NK.steam2(g, z0, st.ph, o); } });
};
/* an American flag waving on a pole, as an actor (pole drawn by the caller): attach at tile-local (x,y,z), cloth w x h */
NK.flagActor = function (T, x, y, z, o) {
  o = o || {}; const w = o.w || 5, h = o.h || 3.2, NPH = 8, dir = o.dir || 'x';
  return T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const ph = Math.floor(((t * 0.9 + (o.phase || 0)) % 1) * NPH); return { x, y, z: 0, key: ph, ph: ph / NPH }; },
    draw(g, st) {
      const P = (u, v) => { const wav = Math.sin(u / w * 5 - st.ph * TAU) * 0.5 * (u / w); return dir === 'x' ? g.p(u, wav, z - v) : g.p(wav, u, z - v); };
      const n = 7, sw = h / n;
      for (let i = 0; i < n; i++) { const pts = []; for (let k = 0; k <= 6; k++) pts.push(P(w * k / 6, i * sw)); for (let k = 6; k >= 0; k--) pts.push(P(w * k / 6, (i + 1) * sw)); g.fill2(pts, i % 2 ? '#F6F2E8' : '#C9463E', true); }
      const cn = []; for (let k = 0; k <= 3; k++) cn.push(P(w * 0.42 * k / 3, 0)); for (let k = 3; k >= 0; k--) cn.push(P(w * 0.42 * k / 3, sw * 4)); g.fill2(cn, '#2F4A7A', true);
      const o2 = []; for (let k = 0; k <= 6; k++) o2.push(P(w * k / 6, 0)); for (let k = 6; k >= 0; k--) o2.push(P(w * k / 6, h)); g.outline2(o2, { w: 0.3, c: '#5A3A30', boil: false });
    } });
};

/* ---------------- people ---------------- */
const NK_TOPS = ['#F3F1EA', '#3B3F47', '#C9584B', '#5F8FC9', '#E6C24F', '#8FBF73', '#D98AA4', '#2F2C2A', '#7FB7D9', '#B9A27D', '#E08A3C', '#8E79C0', '#F3F1EA', '#3F5F8F'];
const NK_BOTS = ['#3C5C8A', '#2F3A4F', '#3F4D63', '#5A4A3C', '#2B2A2A', '#7A6A55', '#8A9AAA', '#B9A27D', '#4A5A78'];
/* a New Yorker: every skin, hair and style; late spring (t-shirts, light jackets, sunglasses, totes, coffee) */
NK.who = function (seed, o) {
  const R = RNG(seed * 6151 + 29), w = K.who(seed);
  w.top = R.pick(NK_TOPS); w.bot = R.pick(NK_BOTS); w.bare = R() < 0.55; w.shorts = R() < 0.1;
  if (R() < 0.18) w.dress = R.pick(['#E7E2D6', '#2F2C2A', '#C9584B', '#8FB7D9', '#D98AA4', '#E6C24F']);
  if (R() < 0.16) w.jacket = w.top, w.top = R.pick(['#2F2C2A', '#6C7A89', '#B9A27D', '#3F5F8F']);
  w.glasses = R() < 0.18; w.cap = R() < 0.1 ? R.pick(['#2F3A4F', '#2F2C2A', '#F3F1EA', '#C9463E']) : undefined;
  w.coffee = R() < 0.12; w.tote = R() < 0.14 ? R.pick(['#E9E1CC', '#2F2C2A', '#C9A26B']) : null;
  return Object.assign(w, o || {});
};
NK.tourist = function (seed, o) { return NK.who(seed, Object.assign({ top: '#F6F3EA', heart: true, cap: RNG(seed).int(0, 2) === 0 ? '#C9463E' : undefined, bare: true }, o || {})); };
NK.suit = function (seed, o) { const R = RNG(seed * 37 + 1), c = R.pick(['#2F3440', '#3B3F47', '#2B2A2A', '#4A5160']); return NK.who(seed, Object.assign({ top: '#F3F1EA', jacket: '#F3F1EA', bot: c, tie: R.pick(['#C9463E', '#3F5F8F', '#6E5A44']), bare: false, dress: undefined, shorts: false, cap: undefined, suit: c }, o || {})); };
NK.cop = function (seed, o) { return NK.who(seed, Object.assign({ top: '#2E3A55', bot: '#2E3A55', cap: '#2E3A55', bare: false, shorts: false, dress: undefined, glasses: false, coffee: false, tote: null }, o || {})); };
/* K.person plus New York extras drawn on the returned points: the I-heart-NY tee, a coffee cup, a tote, a suit jacket */
NK.person = function (g, x, y, z, w) {
  const o = w.suit ? Object.assign({}, w, { top: w.suit, jacket: '#F3F1EA' }) : w;
  const r = K.person(g, x, y, z, o);
  const k = w.k || 1, dir = w.dir | 0, back = dir >= 2;
  if (w.heart && !back && r.shoulders) { const sp = r.shoulders, c = [(sp[0][0] + sp[1][0]) / 2, lerp(sp[0][1], r.hip[1], 0.35)]; const s = 0.42 * k; g.fill2([[c[0], c[1] + 1.3 * s], [c[0] - 1.3 * s, c[1] - 0.1 * s], [c[0] - 0.8 * s, c[1] - 0.9 * s], [c[0], c[1] - 0.4 * s], [c[0] + 0.8 * s, c[1] - 0.9 * s], [c[0] + 1.3 * s, c[1] - 0.1 * s]], '#D23A33', true); }
  if (w.coffee && r.hands) { const hd = r.hands[0]; g.fill2([[hd[0] - 0.55, hd[1] - 1.4], [hd[0] + 0.55, hd[1] - 1.4], [hd[0] + 0.45, hd[1] + 0.2], [hd[0] - 0.45, hd[1] + 0.2]], '#F3F1EA', true); g.fill2([[hd[0] - 0.55, hd[1] - 0.9], [hd[0] + 0.55, hd[1] - 0.9], [hd[0] + 0.5, hd[1] - 0.4], [hd[0] - 0.5, hd[1] - 0.4]], '#2F6DB5', true); }
  if (w.tote && r.hands && r.shoulders && !back) { const sp = r.shoulders[0], hp = r.hip; g.fill2([[hp[0] - 2.2 * k, hp[1] - 1 * k], [hp[0] + 0.6 * k, hp[1] - 1 * k], [hp[0] + 0.4 * k, hp[1] + 2.6 * k], [hp[0] - 2.0 * k, hp[1] + 2.6 * k]], w.tote, true); g.fine2([[sp[0], sp[1]], [hp[0] - 0.8 * k, hp[1] - 1 * k]], { w: 0.25, c: shade(w.tote, 0.4) }); }
  if (w.phone && r.hands) { const hd = r.hands[0]; g.fill2([[hd[0] - 0.45, hd[1] - 1.1], [hd[0] + 0.45, hd[1] - 1.1], [hd[0] + 0.45, hd[1] + 0.3], [hd[0] - 0.45, hd[1] + 0.3]], '#2A2622', true); }
  if (w.hat && r.crown) { const c = r.crown; g.fill2([[c[0] - 3.2 * k, c[1] + 1.4 * k], [c[0] + 3.2 * k, c[1] + 1.4 * k], [c[0] + 2.6 * k, c[1] + 0.6 * k], [c[0] - 2.6 * k, c[1] + 0.6 * k]], w.hat, true); g.fill2([[c[0] - 1.7 * k, c[1] + 0.8 * k], [c[0] + 1.7 * k, c[1] + 0.8 * k], [c[0] + 1.4 * k, c[1] - 1.6 * k], [c[0] - 1.4 * k, c[1] - 1.6 * k]], w.hat, true); }
  return r;
};
/* a walker on a closed route drawn with NK.person */
NK.walker = function (T, who, pts, speed, o) {
  o = o || {}; const seg = [], L = [0];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const total = L[L.length - 1], per = total / speed;
  return T.actor({ sample: o.sample || 0.25, period: per, cast: o.cast,
    at(t) {
      let d = (((t * speed + (o.phase || 0) * total) % total) + total) % total, i = 0;
      while (i < seg.length - 1 && d > L[i + 1]) i++;
      const [a, b] = seg[i], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1];
      const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor((d / 2.4) % 1 * 8);
      return { x: a[0] + dx * u, y: a[1] + dy * u, z: typeof o.z === 'function' ? o.z(a[0] + dx * u, a[1] + dy * u) : (o.z || 0), key: dir + '.' + ph, dir, ph: ph / 8 };
    },
    draw(g, st) { NK.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
};
/* a dog on a lead beside its walker (drawn at the walker's feet offset), small and quick */
NK.dog2 = function (g, p, fl, col, ph) {
  const s = (u, v) => [p[0] + fl * u, p[1] + v], c = col || '#B98A5A', leg = Math.sin((ph || 0) * TAU) * 0.6;
  g.fill2([s(-2.2, -2.2), s(1.4, -2.4), s(1.8, -1.4), s(-2.2, -1.2)], c, true);
  g.fill2([s(1.0, -2.6), s(2.6, -3.6), s(3.4, -2.8), s(2.0, -1.8)], c, true);
  g.fill2([s(2.0, -3.6), s(2.4, -4.4), s(2.7, -3.5)], shade(c, 0.3), true);
  g.segs2([s(-1.8, -1.3)[0], s(-1.8, -1.3)[1], s(-1.8 - leg, 0)[0], s(-1.8 - leg, 0)[1], s(1.2, -1.4)[0], s(1.2, -1.4)[1], s(1.2 + leg, 0)[0], s(1.2 + leg, 0)[1], s(-2.2, -2.0)[0], s(-2.2, -2.0)[1], s(-3.2, -3.0)[0], s(-3.2, -3.0)[1]], shade(c, 0.35), 0.55);
  g.disc2(s(3.0, -3.0), 0.18, '#2A2622');
};

/* ---------------- vehicles (around the origin, heading ang) ---------------- */
/* the yellow cab: a sedan or a tall NV200-style van, roof light, a black checker line, the door logo */
NK.cab = function (g, ang, o) {
  o = o || {}; const col = NYC.cab;
  if (o.van) {
    const L = 4.9, Wd = 2.45, tone = { t: shade(col, -0.18), l: col, r: shade(col, 0.14) };
    const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
    K.wheels(g, sh, [-L * 0.62, L * 0.62], 0.95, 'far');
    const B = K.rbox(g, 0, 0, L, Wd, ang, 0.8, 3.2, tone, { w: 0.85 });
    for (const f of ['pu', 'nu']) if (B.vis[f]) g.fill(B.quad(f, -1, 1, 0.8, 1.25), '#3A3632');
    K.wheels(g, sh, [-L * 0.62, L * 0.62], 0.95, 'near', { arch: '#3A3632' });
    K.lights(g, B, 1.8);
    const ca = Math.cos(ang), sa = Math.sin(ang), cab = K.rbox(g, -0.6 * ca, -0.6 * sa, L * 0.78, Wd - 0.1, ang, 3.2, 5.6, tone, { nb: true, w: 0.8 });
    for (const f of ['pv', 'nv']) { K.rwin(g, cab, f, -0.9, -0.1, 3.4, 5.2); K.rwin(g, cab, f, 0.05, 0.85, 3.4, 5.2); if (B.vis[f]) { const q = B.quad(f, -0.2, 0.25, 1.9, 2.6); g.fill(q, '#2F2C2A'); } }
    K.rwin(g, cab, 'pu', -0.8, 0.8, 3.5, 5.2); K.rwin(g, cab, 'nu', -0.8, 0.8, 3.5, 5.2);
    K.rbox(g, 0, 0, 0.5, 1.0, ang + Math.PI / 2, 5.6, 6.3, '#F6F2E8', { w: 0.4, nb: true });
    return;
  }
  K.car(g, ang, { col, L: 5.0, W: 2.45, roof: (gg, cab) => { K.rbox(gg, cab.cx, cab.cy, 0.5, 1.05, ang + Math.PI / 2, 4.8, 5.5, '#F6F2E8', { w: 0.4, nb: true }); } });
  // the checker line along the sides (a dark band with pale squares)
  const ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => [u * ca - v * sa, u * sa + v * ca, z];
  for (const v of [2.46, -2.46]) {
    const vis = (-sa * Math.sign(v) + ca * Math.sign(v)) > 0.02; if (!vis) continue;
    g.fill([P(-4.6, v, 2.2), P(4.6, v, 2.2), P(4.6, v, 2.5), P(-4.6, v, 2.5)], '#2F2C2A');
    const sq = []; for (let u = -4.4; u < 4.4; u += 0.9) { const a = g.p.apply(g, P(u, v * 1.002, 2.35)), b = g.p.apply(g, P(u + 0.4, v * 1.002, 2.35)); sq.push(a[0], a[1], b[0], b[1]); } g.segs2(sq, '#F6F2E8', 0.35);
  }
};
NK.blackcar = function (g, ang) { K.car(g, ang, { col: '#2F3238', L: 5.4, W: 2.6 }); };
/* the MTA bus: white with a blue front band and a yellow stripe, its route sign */
NK.bus = function (g, ang, o) {
  o = o || {}; K.bus(g, ang, { col: '#F1F1EE', band: '#2F6DB5', L: 6.8, W: 2.6, h: 5.8, n: 6 });
  const ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => [u * ca - v * sa, u * sa + v * ca, z];
  for (const v of [2.62, -2.62]) { const vis = (-sa * Math.sign(v) + ca * Math.sign(v)) > 0.02; if (vis) g.fill([P(-6.8, v, 3.1), P(6.8, v, 3.1), P(6.8, v, 3.45), P(-6.8, v, 3.45)], '#E6C24F'); }
};
/* a box truck (deliveries): a cab and a tall white box */
NK.truck = function (g, ang, o) {
  o = o || {}; const col = o.col || '#F1EFE8', cabc = o.cab || '#E9EAE6', L = 6.4, Wd = 2.6, ca = Math.cos(ang), sa = Math.sin(ang);
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  K.wheels(g, sh, [-L * 0.65, L * 0.55], 1.1, 'far');
  const box = K.rbox(g, -1.6 * ca, -1.6 * sa, L - 1.6, Wd, ang, 1.2, 7.2, { t: shade(col, -0.1), l: col, r: shade(col, 0.12) }, { w: 0.85 });
  const cab = K.rbox(g, (L - 1.6) * ca, (L - 1.6) * sa, 1.6, Wd - 0.15, ang, 1.0, 5.2, { t: shade(cabc, -0.1), l: cabc, r: shade(cabc, 0.14) }, { w: 0.8 });
  K.rwin(g, cab, 'pu', -0.8, 0.8, 3.2, 4.8); K.rwin(g, cab, 'pv', -0.6, 0.6, 3.2, 4.8); K.rwin(g, cab, 'nv', -0.6, 0.6, 3.2, 4.8);
  if (o.stripe) for (const f of ['pv', 'nv']) if (box.vis[f]) g.fill(box.quad(f, -0.95, 0.95, 3.2, 4.2), o.stripe);
  K.wheels(g, sh, [-L * 0.65, L * 0.55], 1.1, 'near', { arch: '#3A3632' });
  K.lights(g, box, 1.6);
};
/* the FDNY engine: red with white band, ladders on top */
NK.fire = function (g, ang) {
  const col = '#C9362E', L = 7.4, Wd = 2.7, ca = Math.cos(ang), sa = Math.sin(ang);
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  K.wheels(g, sh, [-L * 0.6, L * 0.6], 1.2, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 1.2, 6.0, { t: '#E9E6DE', l: col, r: shade(col, 0.14) }, { w: 0.9 });
  for (const f of ['pv', 'nv']) if (B.vis[f]) { g.fill(B.quad(f, -1, 1, 3.0, 3.6), '#F3F1EA'); K.rwin(g, B, f, 0.62, 0.95, 4.0, 5.6); }
  K.rwin(g, B, 'pu', -0.8, 0.8, 4.0, 5.6);
  const lad = []; for (const v of [-1.2, 1.2]) { const a = g.p.apply(g, B.pt(-L * 0.9, v, 6.4)), b = g.p.apply(g, B.pt(L * 0.4, v, 6.4)); lad.push(a[0], a[1], b[0], b[1]); } for (let u = -L * 0.9; u < L * 0.4; u += 0.9) { const a = g.p.apply(g, B.pt(u, -1.2, 6.4)), b = g.p.apply(g, B.pt(u, 1.2, 6.4)); lad.push(a[0], a[1], b[0], b[1]); }
  g.segs2(lad, '#B9B4AA', 0.4);
  K.wheels(g, sh, [-L * 0.6, L * 0.6], 1.2, 'near', { arch: '#3A3632' });
  K.lights(g, B, 2.0);
  const lb = g.p.apply(g, B.pt(L * 0.75, 0, 6.2)); g.disc2([lb[0] - 1, lb[1]], 0.6, '#E0503E'); g.disc2([lb[0] + 1, lb[1]], 0.6, '#E0503E');
};
/* a delivery rider: a bike, the rider, the insulated food box on their back */
NK.deliBike = function (g, ang, o) {
  o = o || {}; const ca = Math.cos(ang), sa = Math.sin(ang), towards = ca + sa > 0.05;
  const box = () => { K.rbox(g, -1.7 * ca, -1.7 * sa, 1.05, 1.0, ang, 5.6, 7.8, o.box || '#2FA58F', { w: 0.45 }); };
  if (towards) box();
  K.bike(g, ang, { col: o.col || '#3A3632', who: o.who });
  if (!towards) box();
};
/* a Central Park horse carriage: the horse in front, a black open carriage with a red seat, driver up front */
NK.carriage = function (g, ang, ph, driver, riders) {
  const ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => [u * ca - v * sa, u * sa + v * ca, z], towards = ca + sa > 0.05;
  const horse = () => {
    const c = g.p.apply(g, P(4.6, 0, 0)), fl = ca - sa >= 0 ? 1 : -1, s = (u, v) => [c[0] + fl * u, c[1] + v], st = Math.sin(ph * TAU);
    const legs = []; for (const [u, d] of [[-2.6, st], [-1.8, -st], [2.2, -st], [3.0, st]]) legs.push(s(u, -6)[0], s(u, -6)[1], s(u + d, 0)[0], s(u + d, 0)[1]);
    g.segs2(legs, '#4A3426', 0.9);
    g.fill2([s(-3.4, -9.4), s(2.8, -9.8), s(3.6, -6.4), s(-3.2, -6.0)], '#E9E1CC', true);
    g.fill2([s(2.2, -9.6), s(4.6, -13.2), s(6.2, -12.6), s(4.6, -8.6)], '#E9E1CC', true);
    g.fill2([s(4.8, -13.2), s(6.8, -12.6), s(7.0, -11.6), s(5.6, -11.6)], '#DCD3BC', true);
    g.fill2([s(3.6, -13.6), s(4.4, -14.6), s(4.8, -13.2)], '#DCD3BC', true);
    g.line2([s(-3.4, -9.4), s(2.8, -9.8), s(4.6, -13.2), s(6.2, -12.6), s(7.0, -11.6), s(5.6, -11.4), s(4.6, -8.6), s(3.6, -6.4), s(-3.2, -6.0), s(-3.4, -9.4)], { w: 0.45, c: '#6E5A44', boil: false });
    g.fill2([s(-4.6, -9.2), s(-3.4, -9.4), s(-3.6, -6.6), s(-4.4, -6.8)], '#CFC3A6', true);
    g.fill2([s(3.4, -12.4), s(4.8, -13.6), s(4.2, -12.0)], '#C9463E', true);
  };
  if (towards) { /* the horse is nearer than the carriage only when we see its rump; it always leads */ }
  const sh = K.rbox(g, 0, 0, 3.0, 2.2, ang, 0, 0.01, '#000', { line: false, nt: true }); K.shadow(g, sh);
  if (!towards) horse();
  K.wheels(g, sh, [-1.8], 1.7, 'far');
  const B = K.rbox(g, -0.4 * ca, -0.4 * sa, 2.6, 1.9, ang, 1.4, 3.2, '#2F2C2A', { w: 0.7 });
  const seat = K.rbox(g, -1.3 * ca, -1.3 * sa, 1.2, 1.7, ang, 3.2, 4.4, '#B23A30', { w: 0.5 });
  void seat;
  if (riders) riders.forEach((w, i) => NK.person(g, -1.4 * ca + (i - 0.5) * 1.4 * -sa, -1.4 * sa + (i - 0.5) * 1.4 * ca, 3.4, Object.assign({}, w, { pose: 'sit', dir: (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2), k: 0.92 })));
  if (driver) NK.person(g, 1.6 * ca, 1.6 * sa, 3.6, Object.assign({}, driver, { pose: 'sit', dir: (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2), k: 0.92, hat: '#2F2C2A' }));
  const hood = []; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; hood.push(g.p.apply(g, P(-2.6 - Math.sin(t) * 0.6, Math.cos(t) * 1.9, 4.4 + Math.sin(t) * 2.0))); }
  g.fill2(hood.concat([g.p.apply(g, P(-2.2, -1.9, 4.4))]), '#3A3632'); g.line2(hood, { w: 0.5, boil: false });
  K.wheels(g, sh, [-1.8], 1.7, 'near', {});
  K.wheels(g, sh, [1.6], 1.1, 'near', {});
  if (towards) horse();
};

/* ---------------- a place's ground ---------------- */
/* the flush slab (z 0) with a 6 u concrete sidewalk ring and its joints; the inside (±31) left for the place */
NK.lot = function (g, o) {
  o = o || {}; const H = 37, W = o.walk == null ? 6 : o.walk, I = H - W;
  K.slab(g, H, { top: o.top || NYC.walk });
  if (o.inner) g.fill(K.rect(-I, -I, I, I), o.inner);
  const j = [];
  for (let a = -H + 2.6; a < H - 1; a += 3.2) for (const [p0, p1] of [[[a, -H], [a, -H + W]], [[a, H - W], [a, H]], [[-H, a], [-H + W, a]], [[H - W, a], [H, a]]]) { const q0 = g.p(p0[0], p0[1], 0), q1 = g.p(p1[0], p1[1], 0); j.push(q0[0], q0[1], q1[0], q1[1]); }
  g.segs2(j, NYC.walkD, 0.35);
  if (o.inner !== false) g.outline(K.rect(-I, -I, I, I), { w: 0.4, c: '#BDB7AA', boil: false });
  for (const q of [K.rect(-H, -H, H, -I), K.rect(-H, I, H, H), K.rect(-H, -I, -I, I), K.rect(I, -I, H, I)]) g.scuff(q, { dir: -0.5, len: 3, c: '#F4F1EA', dens: 0.5, w: 0.45 });
};
