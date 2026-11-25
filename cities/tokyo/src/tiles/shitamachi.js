'use strict';
/* (100,0) Shitamachi, the low city, as it still is in Yanaka or Kyōjima. Two lanes meet in a T. Lane A runs along x past
   a row of two-storey wooden shop-houses that face us: the corner liquor shop with its crates and vending machines, a
   grandmother's house with a bamboo fence and shelves of potted plants and bonsai, a little block of flats over the
   butcher (queues for croquettes), a second-hand bookshop with its carts out, a kissaten, and the sentō: a temple roof
   with a curved karahafu porch, the ゆ noren in the doorway and its tall chimney breathing steam. Lane B runs along y
   past a second row facing it: the bicycle shop, the pharmacy, the rice shop, a shokudō with a red lantern and the
   florist on the corner. Between the lanes: a tobacco-and-sweets shop with its row of vending machines, a coin car
   park, a grove and a small Inari shrine with red torii and foxes; and the playground, full of children (swings,
   slide, see-saw, a panda on a spring, the sandpit, the climbing frame). Utility poles and their wires over it all. */
SF.tile('shitamachi', 100, 0, { rim: 46 }, function (T) {
  const H = 37, LA = [-11, -3], LB = [-22, -15], FY = -11, BX = -22, GF = 7.8, EZ = 15.2;
  const WIN = '#E9D3A6', SHOP = '#E9C48A', INK = '#3A3128';
  const SEA = TK.summer() ? 'su' : TK.autumn() ? 'au' : TK.winter() ? 'wi' : 'sp';

  /* ---------------- helpers (tile-local) ---------------- */
  // a frame on a facade: u runs along the front left to right on screen, v out of the wall, z up.
  // face 'L': the plane y = P (u = x); face 'R': the plane x = P (u = -y)
  const FR = (face, P) => {
    const L = face === 'L', ab = (u0, u1) => L ? [u0, u1] : [-u1, -u0];
    const f = {
      face, P, L, ab,
      w: (u, v, z) => L ? [u, P + v, z] : [P + v, -u, z],
      p: (g, u, v, z) => g.p.apply(g, f.w(u, v, z)),
      on: (u0, u1, z0, z1, v) => { const a = ab(u0, u1); return K.on(face, P + (v || 0), a[0], a[1], z0, z1); },
      box: (g, u0, u1, v0, v1, z0, z1, col, o) => { if (L) K.box(g, u0, P + v0, u1, P + v1, z0, z1, col, o); else K.box(g, P + v0, -u1, P + v1, -u0, z0, z1, col, o); },
      win: (g, u0, u1, z0, z1, o, v) => { const a = ab(u0, u1); K.win(g, face, P + (v || 0), a[0], a[1], z0, z1, o); },
      sign: (g, u0, u1, z0, z1, col, o, v) => { const a = ab(u0, u1); TK.sign(g, face, P + (v || 0), a[0], a[1], z0, z1, col, o); },
      awn: (g, u0, u1, z, out, col, o) => { const a = ab(u0, u1); TK.awning(g, face, P, a[0], a[1], z, out, col, o); },
      fp: (u0, u1, v0, v1) => L ? [u0, P + v0, u1, P + v1] : [P + v0, -u1, P + v1, -u0],
      end: (u0, u1) => L ? u1 : u0,                                    // the end of a frontage whose side wall we see
    };
    return f;
  };
  const segs = (g, pairs, col, w) => { const s = []; for (const [a, b] of pairs) { const p = g.p.apply(g, a), q = g.p.apply(g, b); s.push(p[0], p[1], q[0], q[1]); } g.segs2(s, col, w); };
  const blob = (g, c, r, col, ink, seed, sq) => { const R = RNG(seed), pts = []; for (let i = 0; i < 8; i++) { const a = TAU * i / 8 + R() * 0.5, q = r * (0.85 + R() * 0.3); pts.push([c[0] + Math.cos(a) * q, c[1] + Math.sin(a) * q * (sq || 0.85)]); } g.fill2(pts, col); g.outline2(pts, { c: ink, w: 0.4, ext: 0.1 }); return pts; };
  // glass doors that slide, in thin wooden frames
  const glassDoor = (g, F, u0, u1, z0, z1, o) => {
    o = o || {}; const n = o.n || 4, q = F.on(u0, u1, z0, z1, 0.04), fr = o.fr || '#6B4E36', P = [];
    g.fill(q, o.col || '#D3E2E8'); g.mark({ win: o.lit == null ? 0.7 : o.lit });
    for (let k = 1; k < n; k++) { const u = lerp(u0, u1, k / n); P.push([F.w(u, 0.06, z0), F.w(u, 0.06, z1)]); }
    for (const z of o.bars || [z0 + (z1 - z0) * 0.42, z0 + (z1 - z0) * 0.72]) P.push([F.w(u0, 0.06, z), F.w(u1, 0.06, z)]);
    segs(g, P, fr, 0.34); g.outline(q, { w: 0.5, c: fr, boil: false });
    const a = F.p(g, lerp(u0, u1, 0.3), 0.08, z0 + (z1 - z0) * 0.55), b = F.p(g, lerp(u0, u1, 0.36), 0.08, z0 + (z1 - z0) * 0.85); g.line2([a, b], { w: 0.5, c: '#FBFAF6', boil: false, ext: 0 });
  };
  // a wooden lattice (kōshi) over a window
  const koshi = (g, F, u0, u1, z0, z1) => {
    const q = F.on(u0, u1, z0, z1, 0.05), P = []; g.fill(q, '#EADFC4'); g.mark({ win: 0.6 });
    for (let u = u0 + 0.3; u < u1 - 0.1; u += 0.36) P.push([F.w(u, 0.12, z0), F.w(u, 0.12, z1)]);
    segs(g, P, '#7A5A40', 0.4); g.outline(q, { w: 0.55, c: '#5A4030', boil: false });
  };
  // the little tiled pent roof (hisashi) over a ground floor
  const hisashi = (g, F, u0, u1, z, out, col) => {
    const q = [F.w(u0 - 0.2, 0, z + 0.8), F.w(u1 + 0.2, 0, z + 0.8), F.w(u1 + 0.2, out, z), F.w(u0 - 0.2, out, z)], P = [];
    g.fill(q, col);
    for (let u = u0 + 0.15; u < u1 + 0.1; u += 0.5) P.push([F.w(u, 0.08, z + 0.76), F.w(u, out - 0.05, z + 0.04)]);
    segs(g, P, shade(col, 0.3), 0.28);
    const e = [F.w(u0 - 0.2, out, z), F.w(u1 + 0.2, out, z), F.w(u1 + 0.2, out, z - 0.35), F.w(u0 - 0.2, out, z - 0.35)]; g.fill(e, shade(col, 0.22));
    g.line([F.w(u0 - 0.2, out, z), F.w(u1 + 0.2, out, z)], { w: 0.65, c: shade(col, 0.55), boil: false });
  };
  // a gable roof whose ridge runs along the front: tile channels, the end tiles, the ridge and its end blocks
  const kawara = (g, F, u0, u1, D, z, h, col, o) => {
    o = o || {}; const ov = o.ov == null ? 1.0 : o.ov, oe = 0.45, vm = -D / 2, a0 = u0 - oe, a1 = u1 + oe, ink = shade(col, 0.55);
    const back = [F.w(a0, -D - ov, z), F.w(a1, -D - ov, z), F.w(a1, vm, z + h), F.w(a0, vm, z + h)];
    const front = [F.w(a0, ov, z), F.w(a1, ov, z), F.w(a1, vm, z + h), F.w(a0, vm, z + h)];
    g.fill(back, shade(col, 0.2));
    const ue = F.end(u0, u1), ae = F.L ? a1 : a0;
    const tri = [F.w(ue, 0, z), F.w(ue, -D, z), F.w(ue, vm, z + h - 0.3)]; g.fill(tri, o.end || '#EFE6D2'); g.outline(tri, { w: 0.45, boil: false });
    g.fill(front, F.L ? shade(col, -0.08) : shade(col, 0.06));
    const P = []; for (let u = a0 + 0.3; u < a1 - 0.1; u += 0.48) P.push([F.w(u, ov - 0.05, z + 0.02), F.w(u, vm + 0.1, z + h - 0.05)]);
    segs(g, P, shade(col, 0.26), 0.26);
    const ends = []; for (let u = a0 + 0.24; u < a1; u += 0.48) { const c = F.p(g, u, ov, z - 0.12); ends.push(c[0] - 0.5, c[1], c[0] + 0.5, c[1]); }
    g.segs2(ends, shade(col, 0.4), 0.9);
    g.line([F.w(a0, ov, z), F.w(a1, ov, z)], { w: 0.75, c: ink, boil: false });
    g.line([F.w(ae, ov, z), F.w(ae, vm, z + h)], { w: 0.7, c: ink, boil: false }); g.line([F.w(ae, vm, z + h), F.w(ae, -D - ov, z)], { w: 0.6, c: ink, boil: false });
    const r0 = F.p(g, a0, vm, z + h), r1 = F.p(g, a1, vm, z + h); g.line2([r0, r1], { w: 1.5, c: shade(col, 0.45), boil: false, ext: 0 });
    for (const r of [r0, r1]) g.fill2([[r[0] - 0.9, r[1] + 0.4], [r[0] + 0.9, r[1] + 0.4], [r[0] + 0.7, r[1] - 1.5], [r[0] - 0.7, r[1] - 1.5]], shade(col, 0.4), true);
    return { ridge: (u) => F.w(u, vm, z + h) };
  };
  // a TV aerial on a roof (world point at its foot)
  const aerial = (g, x, y, z, h) => {
    const b = g.p(x, y, z), t = g.p(x, y, z + h), m = g.p(x, y, z + h - 0.7); g.line2([b, t], { w: 0.4, c: '#6B665C', boil: false, ext: 0 });
    const a0 = [m[0] - 3.2, m[1] + 1.4], a1 = [m[0] + 3.2, m[1] - 1.4], S = [a0[0], a0[1], a1[0], a1[1]];
    for (let k = 0; k <= 5; k++) { const c = [lerp(a0[0], a1[0], k / 5), lerp(a0[1], a1[1], k / 5)], l = 1.6 - k * 0.15; S.push(c[0] - l * 0.5, c[1] - l, c[0] + l * 0.5, c[1] + l); }
    g.segs2(S, '#6B665C', 0.3);
  };
  // an air conditioner's outdoor unit on the ground or a balcony
  const acUnit = (g, F, u, v, z) => {
    F.box(g, u - 1.0, u + 1.0, v, v + 0.9, z, z + 1.5, { t: '#E9E6DE', l: '#F3F1EA', r: '#DCD8CE' }, { w: 0.4, boil: false });
    const c = F.p(g, u - 0.25, v + 0.92, z + 0.75); g.ring2(c, 1.55, { w: 0.28, c: '#8C8576' }); g.disc2(c, 0.35, '#8C8576');
  };
  // a balcony along a front: slab, balusters, a rail
  const balcony = (g, F, u0, u1, z, out, o) => {
    o = o || {}; const rail = o.rail || '#7C7566', P = [];
    if (o.part !== 'rail') F.box(g, u0, u1, 0, out, z - 0.35, z, o.floor || '#CFC9BC', { w: 0.4, boil: false });
    if (o.part === 'slab') return;
    for (let u = u0 + 0.25; u < u1; u += 0.45) P.push([F.w(u, out, z), F.w(u, out, z + 2.1)]);
    const ue = F.end(u0, u1); for (let v = 0.3; v < out; v += 0.45) P.push([F.w(ue, v, z), F.w(ue, v, z + 2.1)]);
    segs(g, P, rail, 0.26);
    g.line([F.w(u0, out, z + 2.1), F.w(u1, out, z + 2.1)], { w: 0.5, c: shade(rail, 0.3), boil: false }); g.line([F.w(ue, 0, z + 2.1), F.w(ue, out, z + 2.1)], { w: 0.4, c: shade(rail, 0.3), boil: false });
  };
  // washing on a pole: shirts, towels, trousers
  const laundry = (g, F, u0, u1, v, z, seed) => {
    const R = RNG(seed); g.line([F.w(u0, v, z), F.w(u1, v, z)], { w: 0.32, c: '#8C8576', boil: false });
    let u = u0 + 0.3;
    while (u < u1 - 0.8) {
      const k = R.int(0, 3), wd = [1.3, 0.9, 1.5, 0.7][k], ht = [1.5, 2.0, 1.0, 1.2][k];
      if (u + wd > u1 - 0.2) break;
      const c = R.pick(['#F6F3EA', '#F6F3EA', '#8FB7D9', '#E7A9A0', '#E6C24F', '#A4C66B', '#5F8FC9', '#D98AA4', '#C9584B', '#F3E3A0']);
      const q = k === 0 ? [F.w(u - 0.3, v, z), F.w(u + wd + 0.3, v, z), F.w(u + wd + 0.3, v, z - 0.6), F.w(u + wd, v, z - 0.5), F.w(u + wd, v, z - ht), F.w(u, v, z - ht), F.w(u, v, z - 0.5), F.w(u - 0.3, v, z - 0.6)]
        : k === 1 ? [F.w(u, v, z), F.w(u + wd, v, z), F.w(u + wd, v, z - ht), F.w(u + wd * 0.58, v, z - ht), F.w(u + wd * 0.5, v, z - 0.7), F.w(u + wd * 0.42, v, z - ht), F.w(u, v, z - ht)]
          : [F.w(u, v, z), F.w(u + wd, v, z), F.w(u + wd, v, z - ht), F.w(u, v, z - ht)];
      g.fill(q, c); g.outline(q, { w: 0.22, c: shade(c, 0.45), boil: false });
      u += wd + 0.35 + R() * 0.4;
    }
  };
  // a futon over a rail at height z (the top of the rail)
  const futon = (g, F, u0, u1, v, z, col) => {
    const q = [F.w(u0, v + 0.05, z + 0.15), F.w(u1, v + 0.05, z + 0.15), F.w(u1, v + 0.14, z - 2.1), F.w(u0, v + 0.14, z - 2.1)];
    g.fill(q, col); g.fill([F.w(u0, v + 0.06, z + 0.15), F.w(u1, v + 0.06, z + 0.15), F.w(u1, v + 0.08, z - 0.3), F.w(u0, v + 0.08, z - 0.3)], shade(col, -0.18));
    const P = []; for (let k = 1; k < 4; k++) { const u = lerp(u0, u1, k / 4); P.push([F.w(u, v + 0.1, z - 0.4), F.w(u, v + 0.15, z - 2.0)]); } segs(g, P, shade(col, 0.2), 0.25);
    g.outline(q, { w: 0.35, c: shade(col, 0.5), boil: false });
  };
  // a plant in a pot (wide px, the pot's rim at c); kind picks the plant
  const plant = (g, c, R, kind) => {
    const G1 = SEA === 'wi' ? '#5E7E52' : SEA === 'au' ? '#7A9656' : '#7FAE5E', IN = '#4B6B36';
    if (kind === 1) { const S = []; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.3, l = 2.0 + R() * 1.0; S.push(c[0], c[1], c[0] + Math.cos(a) * l * 0.8, c[1] + Math.sin(a) * l); } g.segs2(S, '#6E9A60', 0.6); return; }   // aloe
    if (kind === 2) {                                                     // a little pine, bonsai-shaped
      const t = [c[0] + (R() - 0.5) * 1.2, c[1] - 2.6]; g.line2([c, [c[0] + 0.8, c[1] - 1.2], t], { w: 0.6, c: '#5E463E', boil: false });
      for (const [dx, dy, r] of [[-1.4, -2.4, 1.2], [1.2, -3.2, 1.1], [0, -4.0, 1.0]]) { const p = [c[0] + dx, c[1] + dy]; g.fill2([[p[0] - r * 1.4, p[1]], [p[0], p[1] - r * 0.7], [p[0] + r * 1.4, p[1]], [p[0], p[1] + r * 0.35]], '#4F7A44', true); g.line2([[p[0] - r * 1.4, p[1]], [p[0] + r * 1.4, p[1]]], { w: 0.3, c: '#2F4A2C', boil: false }); }
      if (K.snowy()) g.line2([[c[0] - 2, c[1] - 4.2], [c[0] + 1.6, c[1] - 4.6]], { w: 0.7, c: K.SNOW, boil: false });
      return;
    }
    const r = kind === 3 ? 1.9 : 1.3 + R() * 0.5, b = [c[0], c[1] - r * 0.55];
    blob(g, b, r, kind === 3 ? '#6E9A50' : G1, IN, R.int(1, 9999));
    const fl = SEA === 'sp' ? ['#E58BB0', '#F2C6D0', '#9C7AC9', '#F3E36A', '#F6F3EA'] : SEA === 'su' ? ['#E05A4A', '#F2B04A', '#F6F3EA'] : SEA === 'au' ? ['#E8C445', '#F6F3EA', '#C9584B', '#B07AC9'] : ['#C9302A'];
    const n = SEA === 'wi' ? 5 : kind === 3 ? 2 : 4;
    for (let i = 0; i < n; i++) g.disc2([b[0] + (R() - 0.5) * r * 1.3, b[1] + (R() - 0.6) * r], SEA === 'wi' ? 0.32 : 0.5, R.pick(fl));
  };
  // a pot at a world point: terracotta, glazed blue, a styrofoam box, a tall jar
  const pot = (g, x, y, z, kind, seed) => {
    const R = RNG(seed), p = g.p(x, y, z || 0);
    if (kind === 4) {                                                     // a styrofoam fish box turned planter
      K.box(g, x - 0.9, y - 0.55, x + 0.9, y + 0.55, z || 0, (z || 0) + 0.9, { t: '#8C6A4A', l: '#F6F3EA', r: '#E3DED2' }, { w: 0.3, boil: false });
      for (let i = 0; i < 4; i++) { const q = g.p(x - 0.6 + i * 0.4, y, (z || 0) + 1.0); blob(g, [q[0], q[1] - 0.6], 0.9, i % 2 ? '#7FAE5E' : '#93BF6A', '#4B6B36', seed + i); }
      return;
    }
    const pc = ['#B5624B', '#3F6FA8', '#C9784B', '#8A6A50', '#6E8A9A'][(kind + R.int(0, 4)) % 5], w0 = 1.35, w1 = 1.0, h = kind === 3 ? 2.8 : 1.9;
    const body = [[p[0] - w1, p[1]], [p[0] + w1, p[1]], [p[0] + w0, p[1] - h], [p[0] - w0, p[1] - h]];
    g.fill2(body, pc, true); g.fill2([[p[0] + 0.2, p[1]], [p[0] + w1, p[1]], [p[0] + w0, p[1] - h], [p[0] + 0.3, p[1] - h]], shade(pc, 0.14), true);
    g.fill2([[p[0] - w0 - 0.2, p[1] - h], [p[0] + w0 + 0.2, p[1] - h], [p[0] + w0 + 0.2, p[1] - h - 0.55], [p[0] - w0 - 0.2, p[1] - h - 0.55]], shade(pc, -0.12), true);
    g.outline2(body, { w: 0.3, c: shade(pc, 0.5), boil: false });
    plant(g, [p[0], p[1] - h - 0.4], R, kind === 3 ? 3 : R.pick([0, 0, 0, 1, 2]));
  };
  const potRow = (g, F, u0, u1, v, n, seed, z) => { for (let i = 0; i < n; i++) { const R = RNG(seed + i); pot(g, ...F.w(lerp(u0, u1, n > 1 ? i / (n - 1) : 0.5) + (R() - 0.5) * 0.3, v + (R() - 0.5) * 0.3, z || 0).slice(0, 2), z || 0, R.int(0, 4), seed * 7 + i); } };
  // bonsai on a plank shelf (tana)
  const tana = (g, F, u0, u1, v, n, seed) => {
    F.box(g, u0, u1, v - 0.5, v + 0.5, 2.0, 2.35, '#B58F58', { w: 0.35, boil: false });
    for (const u of [u0 + 0.4, u1 - 0.4]) F.box(g, u - 0.3, u + 0.3, v - 0.4, v + 0.4, 0, 2.0, '#9FA39E', { w: 0.3, boil: false });
    for (let i = 0; i < n; i++) {
      const R = RNG(seed + i), c = F.p(g, lerp(u0 + 0.8, u1 - 0.8, i / Math.max(1, n - 1)), v, 2.4), tc = R.pick(['#3F6FA8', '#8A6A50', '#B5624B', '#5E6E8A']);
      g.fill2([[c[0] - 1.8, c[1]], [c[0] + 1.8, c[1]], [c[0] + 1.5, c[1] - 0.9], [c[0] - 1.5, c[1] - 0.9]], tc, true);
      plant(g, [c[0], c[1] - 0.8], R, R() < 0.6 ? 2 : 0);
    }
  };
  // a bicycle standing on its stand, nobody on it (heading ang)
  const cycle = (g, x, y, ang, col, o) => {
    o = o || {}; const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, z) => g.p(x + u * ca, y + u * sa, z);
    const wheel = (u) => { const t = []; for (let i = 0; i < 16; i++) { const a = TAU * i / 16; t.push(pt(u + Math.cos(a) * 1.4, 1.4 + Math.sin(a) * 1.4)); } g.line2(t, { c: '#3A3632', w: 0.7, close: true, boil: false, wob: 0.15 }); };
    wheel(-2.2); wheel(2.2);
    const A = pt(-2.2, 1.4), B = pt(2.2, 1.4), S = pt(-0.8, 3.6), Hb = pt(1.8, 3.9), bb = pt(0, 1.5);
    g.segs2([A[0], A[1], S[0], S[1], S[0], S[1], bb[0], bb[1], bb[0], bb[1], Hb[0], Hb[1], Hb[0], Hb[1], B[0], B[1], A[0], A[1], bb[0], bb[1]], col, 0.55);
    const s0 = pt(-1.1, 3.75), s1 = pt(-0.4, 3.7); g.line2([s0, s1], { c: '#3A3632', w: 0.9, boil: false, ext: 0 });
    const h0 = g.p(x + 1.8 * ca - sa * 0.8, y + 1.8 * sa + ca * 0.8, 4.0), h1 = g.p(x + 1.8 * ca + sa * 0.8, y + 1.8 * sa - ca * 0.8, 4.0); g.line2([h0, h1], { c: '#3A3632', w: 0.5, boil: false, ext: 0 });
    if (o.basket) { const c = pt(2.6, 3.6); g.fill2([[c[0] - 1.2, c[1] + 0.8], [c[0] + 1.2, c[1] + 0.8], [c[0] + 1.4, c[1] - 1.0], [c[0] - 1.4, c[1] - 1.0]], o.basket, true); g.outline2([[c[0] - 1.2, c[1] + 0.8], [c[0] + 1.2, c[1] + 0.8], [c[0] + 1.4, c[1] - 1.0], [c[0] - 1.4, c[1] - 1.0]], { w: 0.3, c: '#5A564E', boil: false }); }
    if (o.child) { const c = pt(-2.4, 3.6); g.fill2([[c[0] - 1.3, c[1] + 0.6], [c[0] + 1.3, c[1] + 0.6], [c[0] + 1.3, c[1] - 1.8], [c[0] - 1.3, c[1] - 1.8]], o.child, true); }
  };
  // a drinks vending machine against nothing (face 'L' or 'R', standing at x, y)
  const vend = (g, x, y, face, col, top) => TK.vend(g, x, y, { face, col, top });

  /* ---------------- the ground ---------------- */
  T.ground(function (g) {
    K.slab(g, H, { top: '#E9E4D7' });
    const lane = (q, dir) => { g.fill(q, '#D9D3C4'); g.scuff(q, { dir, len: 6, c: '#CBC4B3', dens: 0.5, w: 0.5, spread: 0.06 }); };
    lane(K.rect(-H, LA[0], H, LA[1]), Math.atan2(AY, AX)); lane(K.rect(LB[0], LA[1], LB[1], H), Math.atan2(AY, -AX));
    const wl = []; wl.push([[-H, LA[0] + 0.55, 0], [H, LA[0] + 0.55, 0]], [[-H, LA[1] - 0.55, 0], [LB[0] - 0.2, LA[1] - 0.55, 0]], [[LB[1] + 0.2, LA[1] - 0.55, 0], [H, LA[1] - 0.55, 0]], [[LB[0] + 0.55, LA[1] - 0.3, 0], [LB[0] + 0.55, H, 0]], [[LB[1] - 0.55, LA[1] - 0.3, 0], [LB[1] - 0.55, H, 0]]);
    for (const [a, b] of wl) g.line([a, b], { w: 0.45, c: '#F6F3EC', boil: false });
    // drain covers along the kerbs, a manhole in each lane
    const dr = []; for (let x = -32; x < 34; x += 9) dr.push([x, LA[0] + 0.25], [x + 3, LA[1] - 0.25]); for (let y = 2; y < 34; y += 9) dr.push([LB[0] + 0.25, y]);
    for (const [x, y] of dr) { const q = K.rect(x - 0.7, y - 0.25, x + 0.7, y + 0.25); g.fill(q, '#B9B3A6'); g.outline(q, { w: 0.3, c: '#8C8576', boil: false }); }
    for (const [x, y] of [[-24, -7.5], [-18.5, 18]]) { const c = g.p(x, y, 0); const pts = []; for (let i = 0; i < 14; i++) { const a = TAU * i / 14; pts.push([c[0] + Math.cos(a) * 3.2, c[1] + Math.sin(a) * 1.75]); } g.fill2(pts, '#C3BCAD'); g.line2(pts, { w: 0.35, c: '#8C8576', close: true, boil: false }); }
    // the playground: sand inside its fence, the sandpit
    g.fill(K.rect(7, -2.5, 36.6, 36.6), '#ECDDB6'); g.scuff(K.rect(7, -2.5, 36.6, 36.6), { dir: -0.4, len: 2, c: '#D9C79A', dens: 0.7, w: 0.5, spread: 1.2 });
    g.fill(K.rect(19.5, 13, 29.5, 21), '#F2E6C2'); g.scuff(K.rect(19.5, 13, 29.5, 21), { dir: 0.3, len: 1.4, c: '#DCCB9E', dens: 1.2, w: 0.4, spread: 1.6 });
    // the coin car park: asphalt, white bays
    g.fill(K.rect(-14.6, -3.2, -5.8, 11.4), '#CDC8BD'); for (const x of [-14.1, -6.3]) g.line([[x, -2.6, 0], [x, 10.8, 0]], { w: 0.6, c: '#F7F5EE', boil: false });
    g.line([[-14.1, 10.8, 0], [-6.3, 10.8, 0]], { w: 0.6, c: '#F7F5EE', boil: false });
    // the grove's moss and the shrine's gravel, a stone path from the torii to the hall
    K.lawn(g, -14.6, 12.6, 4.6, 19.6, { col: '#B9CF94', dens: 0.35, edge: false });
    g.fill(K.rect(-14.6, 19.6, 4.6, 36.6), '#E4DDCB'); g.scuff(K.rect(-14.6, 19.6, 4.6, 36.6), { dir: 0.2, len: 0.8, c: '#CEC6B2', dens: 1.6, w: 0.45, spread: 2 });
    for (let y = 28.5; y < 36.4; y += 1.3) { const q = K.rect(-6.6, y, -3.4, y + 1.05); g.fill(q, '#D3CDBF'); g.outline(q, { w: 0.3, c: '#A9A296', boil: false }); }
    // the narrow alley between the kissaten and the sentō
    g.fill(K.rect(8.6, -36.6, 11.4, FY), '#D9D3C4');
  }, { rim: true });

  /* ---------------- lane A's row: shop-houses facing us ---------------- */
  const FA = FR('L', FY);
  // the ground floor and the upper floor of a row house, its upstairs window (a shop's sign board sits between them)
  const twoStorey = (g, F, u0, u1, D, low, wall) => {
    F.box(g, u0, u1, -D, 0, 0, GF, { t: '#D9CDB5', l: low, r: shade(low, 0.12) }, { w: 0.9 });
    F.box(g, u0, u1, -D, 0, GF, EZ, { t: '#E9E2CF', l: wall, r: shade(wall, 0.1) }, { w: 0.9 });
  };
  // the corner liquor shop: crates, isshōbin on the shelves, a cedar ball under the eaves, pots on the pent roof
  T.obj(FA.fp(-36.5, -28, -12, 0), function (g) {
    const u0 = -36.5, u1 = -28;
    twoStorey(g, FA, u0, u1, 12, '#EFE6D2', '#DCC9A8');
    g.fill(FA.on(u0 + 0.6, u1 - 0.6, 0, 6.2, 0.03), SHOP);                                         // the open shop, lit
    const sh = []; for (const z of [1.7, 3.4, 5.1]) sh.push([FA.w(u0 + 0.6, 0.05, z), FA.w(u1 - 0.6, 0.05, z)]); segs(g, sh, '#8A6A50', 0.4);
    const R = RNG(31); for (const z of [1.8, 3.5, 5.2]) for (let u = u0 + 0.9; u < u1 - 0.8; u += 0.55) { const c = FA.p(g, u, 0.06, z); const col = R.pick(['#3F6B3A', '#6B3A2A', '#2F4A2C', '#C9A26B', '#F3F1EA']); g.fill2([[c[0] - 0.35, c[1]], [c[0] + 0.35, c[1]], [c[0] + 0.35, c[1] - 1.9], [c[0] + 0.15, c[1] - 2.6], [c[0] - 0.15, c[1] - 2.6], [c[0] - 0.35, c[1] - 1.9]], col, true); g.mark({ nc: true }); }
    g.outline(FA.on(u0 + 0.6, u1 - 0.6, 0, 6.2, 0.03), { w: 0.5, boil: false });
    hisashi(g, FA, u0, u1, GF - 0.4, 1.5, '#5E6672');
    for (let i = 0; i < 4; i++) { const c = FA.p(g, u0 + 1.2 + i * 2.0, 1.0, GF - 0.1); g.fill2([[c[0] - 0.8, c[1]], [c[0] + 0.8, c[1]], [c[0] + 1.0, c[1] - 1.4], [c[0] - 1.0, c[1] - 1.4]], '#B5624B', true); plant(g, [c[0], c[1] - 1.7], RNG(330 + i), i % 2 ? 1 : 0); }
    FA.sign(g, u0 + 0.8, u1 - 0.8, GF + 0.7, GF + 2.7, '#C9463E', { word: '酒', ink: '#FBF8EE' });
    FA.win(g, u0 + 1, u1 - 1, GF + 3.2, EZ - 0.9, { style: 'glass' });
    { const P = []; for (let u = u0 + 1.4; u < u1 - 1; u += 0.5) P.push([FA.w(u, 0.5, GF + 3.1), FA.w(u, 0.5, GF + 4.4)]); P.push([FA.w(u0 + 1, 0.5, GF + 4.4), FA.w(u1 - 1, 0.5, GF + 4.4)]); segs(g, P, '#6B665C', 0.28); }
    laundry(g, FA, u0 + 0.8, u1 - 0.8, 1.0, EZ - 0.3, 3101);
    kawara(g, FA, u0, u1, 12, EZ, 4.4, '#5E6672');
    aerial(g, -33, -17, EZ + 4.0, 5);
    // the sugidama, a ball of cedar sprigs, hung under the eaves (green when new, brown later in the year)
    const c = FA.p(g, u1 - 1.4, 1.3, GF - 1.4); g.line2([FA.p(g, u1 - 1.4, 1.3, GF - 0.4), c], { w: 0.3, c: '#5A564E', boil: false });
    blob(g, [c[0], c[1] + 1.4], 1.7, SEA === 'sp' || SEA === 'su' ? '#5E8A4A' : '#9A7A4A', '#3F4A2C', 77, 1);
  }, { name: 'sake shop' });
  // its vending machines and crates along the lane
  T.obj([-36.4, -10.9, -29.6, -9.2], function (g) {
    for (const [i, x] of [-35.2, -32.9, -30.6].entries()) vend(g, x, -10.05, 'L', ['#F1EFE8', '#C9463E', '#3F6FA8'][i], ['#3F6FA8', '#F3F1EA', '#E6C24F'][i]);
  }, { name: 'vending' });
  T.obj([-29.2, -10.6, -28.0, -9.2], function (g) {
    for (let k = 0; k < 4; k++) { const z = k * 1.0, col = k % 2 ? '#E6C24F' : '#C9463E'; K.box(g, -29.2, -10.6, -28.0, -9.4, z, z + 0.95, { t: shade(col, -0.1), l: col, r: shade(col, 0.15) }, { w: 0.3, boil: false }); }
    const tops = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) tops.push(g.p(-29.0 + i * 0.4, -10.4 + j * 0.4, 4.0)); for (const c of tops) g.disc2(c, 0.3, '#5E3A2A');
  }, { name: 'crates' });

  // the grandmother's house: lattice window, sliding door, a balcony with the futon out, bonsai and pots behind a fence
  T.obj(FA.fp(-27.5, -19.5, -12, 0), function (g) {
    const u0 = -27.5, u1 = -19.5;
    twoStorey(g, FA, u0, u1, 12, '#9A7656', '#F1EAD8');
    const wb = []; for (let z = 0.8; z < GF; z += 0.75) wb.push([FA.w(u0, 0.02, z), FA.w(u1, 0.02, z)]); segs(g, wb, '#7A5A40', 0.28);   // board siding
    koshi(g, FA, u0 + 0.6, u0 + 3.6, 1.4, 5.8);
    glassDoor(g, FA, u0 + 4.2, u1 - 0.6, 0, 6.4, { n: 2 });
    { const c = FA.p(g, u0 + 3.9, 0.1, 6.8); g.fill2([[c[0] - 0.7, c[1] - 0.6], [c[0] + 0.7, c[1] - 0.6], [c[0] + 0.7, c[1] + 0.3], [c[0] - 0.7, c[1] + 0.3]], '#F6F3EA', true); g.line2([[c[0] - 0.4, c[1] - 0.2], [c[0] + 0.4, c[1] - 0.2]], { w: 0.25, c: INK, boil: false }); }   // the name plate
    glassDoor(g, FA, u0 + 1.0, u1 - 1.0, GF + 0.8, EZ - 0.7, { n: 4, bars: [GF + 2.8] });
    if (TK.summer()) { const q = FA.on(u0 + 1.0, u1 - 1.0, GF + 1.0, EZ - 0.7, 0.12), P = []; g.fill(q, '#CDB98C'); for (let z = GF + 1.2; z < EZ - 0.7; z += 0.3) P.push([FA.w(u0 + 1.0, 0.13, z), FA.w(u1 - 1.0, 0.13, z)]); segs(g, P, '#A8946A', 0.22); }   // a bamboo blind
    balcony(g, FA, u0 + 0.4, u1 - 0.4, GF + 0.8, 1.3, { rail: '#6B4E36', part: 'slab' });   // the rail and the futon: below
    laundry(g, FA, u0 + 5.0, u1 - 0.6, 0.8, EZ - 0.4, 2101);
    kawara(g, FA, u0, u1, 12, EZ, 4.4, '#7E5A44', { end: '#F1EAD8' });
    aerial(g, -23, -18, EZ + 4.0, 4.6);
    // a wooden laundry deck on the roof (monohoshi-dai), with towels out
    { const x0 = -25.6, x1 = -21.4, y0 = -19.6, y1 = -16.8, z = EZ + 4.6, P = []; for (const [x, y] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) P.push([[x, y, EZ + 2.0], [x, y, z]]); segs(g, P, '#8A6A50', 0.4); K.box(g, x0, y0, x1, y1, z - 0.3, z, '#B58F58', { w: 0.35, boil: false }); const rl = []; for (let x = x0; x <= x1; x += 0.6) rl.push([[x, y1, z], [x, y1, z + 1.6]]); rl.push([[x0, y1, z + 1.6], [x1, y1, z + 1.6]]); segs(g, rl, '#8A6A50', 0.3); laundry(g, FR('L', y1 - 1.4), x0 + 0.3, x1 - 0.3, 0, z + 3.2, 2111); const pl = []; for (const x of [x0 + 0.2, x1 - 0.2]) pl.push([[x, y1 - 1.4, z], [x, y1 - 1.4, z + 3.4]]); segs(g, pl, '#8A6A50', 0.3); }
    if (TK.winter()) TK.shime2(g, FA.p(g, u0 + 5.8, 0.1, 6.9), 0.8);
  }, { name: 'house' });
  // its balcony's front rail with the futon over it, in front of the woman beating the futon (she stands on the balcony)
  T.obj(FA.fp(-27.1, -19.9, 1.15, 1.35), function (g) { balcony(g, FA, -27.1, -19.9, GF + 0.8, 1.3, { rail: '#6B4E36', part: 'rail' }); futon(g, FA, -26.7, -22.9, 1.3, GF + 3.0, SEA === 'wi' ? '#B5443A' : '#E7A9A0'); }, { name: 'balcony rail' });
  // its strip of garden: the bonsai shelf and pots (the bamboo fence is drawn with the people)
  T.obj([-27.3, -10.9, -19.7, -9.9], function (g) {
    tana(g, FA, -27.1, -24.0, 0.45, 3, 1211);
    for (const [u, k] of [[-21.6, 0], [-19.9, 3]]) pot(g, u, FY + 0.8, 0, k, 1201 + k);
    if (TK.summer()) for (const u of [-21.6, -19.9]) TK.asagao2(g, FA.p(g, u, 0.8, 2.4), Math.round(u * 10));
  }, { name: 'garden' });

  // the block of flats over the butcher: two floors of balconies with washing, a water tank on the roof
  const FZ = GF + 2.8 + 2 * 4.6;
  T.obj(FA.fp(-19, -7, -13, 0), function (g) {
    const u0 = -19, u1 = -7, D = 13;
    FA.box(g, u0, u1, -D, 0, 0, FZ, { t: '#E2DED3', l: '#EFE9DC', r: '#D9D2C2' }, { w: 0.95 });
    const tl = []; for (let z = 2; z < FZ; z += 1.4) tl.push([[u1 + 0.03, FY - D + 0.2, z], [u1 + 0.03, FY - 0.2, z]]); segs(g, tl, '#C9C1AE', 0.25);   // the tiles of the side wall
    // the butcher's shop: lit inside, a short white and red awning, the sign
    g.fill(FA.on(u0 + 0.6, u1 - 0.6, 0, 6.2, 0.03), SHOP); g.outline(FA.on(u0 + 0.6, u1 - 0.6, 0, 6.2, 0.03), { w: 0.5, boil: false });
    { const P = []; for (const z of [3.4, 4.6]) P.push([FA.w(u0 + 0.8, 0.05, z), FA.w(u1 - 0.8, 0.05, z)]); segs(g, P, '#B9A27D', 0.35); const R = RNG(44); for (let u = u0 + 1.2; u < u1 - 1; u += 0.9) { const c = FA.p(g, u, 0.06, 5.4); g.fill2([[c[0] - 0.6, c[1]], [c[0] + 0.6, c[1]], [c[0] + 0.5, c[1] - 1.1], [c[0] - 0.5, c[1] - 1.1]], R.pick(['#C9584B', '#E7A9A0', '#B5443A', '#F3E3C0']), true); g.mark({ nc: true }); } }
    FA.awn(g, u0 + 0.3, u1 - 0.3, GF - 0.1, 0.9, '#F3F1EA', { stripe: '#C9463E', drop: 0.35 });
    FA.sign(g, u0 + 1.0, u1 - 1.0, GF + 0.5, GF + 2.4, '#C9463E', { word: '肉', ink: '#FBF8EE' });
    // the flats
    for (let f = 0; f < 2; f++) {
      const z = GF + 2.8 + f * 4.6;
      for (const [a, b] of [[u0 + 0.6, u0 + 5.6], [u0 + 6.4, u1 - 0.6]]) { FA.win(g, a + 0.4, a + 2.2, z + 0.5, z + 3.4, { style: 'glass' }); glassDoor(g, FA, a + 2.6, b - 0.4, z, z + 3.8, { n: 2, bars: [], lit: 0.6, fr: '#8C8576' }); }
      balcony(g, FA, u0 + 0.3, u1 - 0.3, z, 1.2, { rail: '#8C8576', floor: '#D9D2C2' });
      laundry(g, FA, u0 + 0.8, u0 + 5.4, 0.7, z + 3.8, 4100 + f * 7); if (f) laundry(g, FA, u0 + 6.6, u1 - 0.8, 0.7, z + 3.8, 4200 + f * 11);
      acUnit(g, FA, u1 - 1.6, 0.0, z);
    }
    FA.box(g, u0, u1, -D, 0, FZ, FZ + 0.8, { t: '#E9E6DE', l: '#F3EFE6', r: '#DCD6C8' }, { w: 0.6 });
    const tx = -13, ty = -19.5; const lg = []; for (const [dx, dy] of [[-1.4, -1.4], [1.4, -1.4], [1.4, 1.4], [-1.4, 1.4]]) { const a = g.p(tx + dx, ty + dy, FZ + 0.8), b = g.p(tx + dx, ty + dy, FZ + 2.8); lg.push(a[0], a[1], b[0], b[1]); } g.segs2(lg, '#6B665C', 0.5);
    K.cyl(g, tx, ty, 2.0, FZ + 2.8, FZ + 5.6, { t: '#E9E6DE', l: '#DCE3E6', r: '#B9C3C9' }, { w: 0.6, n: 12 });
    aerial(g, -9, -22, FZ + 0.8, 4.4);
  }, { name: 'flats', tall: true });
  // the butcher's counter: a glass case of croquettes and cuts, in front of the shop
  T.obj(FA.fp(-18.2, -7.8, 0.05, 1.3), function (g) {
    FA.box(g, -18.2, -7.8, 0.05, 1.3, 0, 3.2, { t: '#E9E6DE', l: '#F3F1EA', r: '#DCD8CE' }, { w: 0.55, boil: false });
    const q = FA.on(-17.8, -8.2, 1.4, 3.0, 1.32); g.fill(q, '#E6EEF0'); g.mark({ nc: '#F6E8C8' });
    const R = RNG(52); for (let u = -17.4; u < -8.6; u += 0.75) { const c = FA.p(g, u, 1.0, 1.9); g.disc2(c, 0.55, R.pick(['#C98A4A', '#D9A05A', '#C9584B', '#E7A9A0'])); }
    g.outline(q, { w: 0.4, c: '#8C8576', boil: false });
    K.box(g, -17.0, -10.9, -15.4, -10.0, 3.2, 3.6, '#C9A26B', { w: 0.3, boil: false });          // a tray of croquettes on top
    for (let i = 0; i < 4; i++) g.disc2(g.p(-16.7 + i * 0.4, -10.45, 3.75), 0.45, '#C98A4A');
  }, { name: 'butcher counter' });

  // the second-hand bookshop, its carts out on the lane
  T.obj(FA.fp(-6.5, 0.5, -12, 0), function (g) {
    const u0 = -6.5, u1 = 0.5;
    twoStorey(g, FA, u0, u1, 12, '#8A6A50', '#E8DEC8');
    g.fill(FA.on(u0 + 0.5, u1 - 0.5, 0, 6.2, 0.03), SHOP);
    const R = RNG(61), bk = []; for (const z0 of [0.3, 1.9, 3.5]) for (let u = u0 + 0.7; u < u1 - 0.6; u += 0.28) { const a = FA.p(g, u, 0.05, z0), b = FA.p(g, u, 0.05, z0 + 1.1 + R() * 0.35); bk.push([a, b, R.pick(['#C9584B', '#3F5F8F', '#E6C24F', '#5A6B5A', '#F3E3C0', '#8A6A50', '#6B4A6A'])]); }
    for (const c of ['#C9584B', '#3F5F8F', '#E6C24F', '#5A6B5A', '#F3E3C0', '#8A6A50', '#6B4A6A']) { const s = []; for (const [a, b, cc] of bk) if (cc === c) s.push(a[0], a[1], b[0], b[1]); g.segs2(s, c, 0.75); }
    g.outline(FA.on(u0 + 0.5, u1 - 0.5, 0, 6.2, 0.03), { w: 0.5, boil: false });
    hisashi(g, FA, u0, u1, GF - 0.4, 1.3, '#4E5560');
    FA.sign(g, u0 + 1.4, u1 - 1.4, GF + 0.7, GF + 2.7, '#F3EEE0', { word: '本', ink: '#2A2622' });
    FA.win(g, u0 + 1, u1 - 1, GF + 3.2, EZ - 0.9, { style: 'glass' });
    { const P = []; for (let u = u0 + 1.4; u < u1 - 1; u += 0.9) P.push([FA.w(u, 0.1, GF + 3.2), FA.w(u, 0.1, EZ - 0.9)]); segs(g, P, '#6B4E36', 0.3); }
    kawara(g, FA, u0, u1, 12, EZ, 4.2, '#4E5560');
    aerial(g, -3, -17, EZ + 3.8, 4.4);
  }, { name: 'bookshop' });
  for (const u of [-5.6, -2.6]) T.obj([u - 1.2, -10.5, u + 1.2, -9.3], function (g) {   // a cart of 100-yen books
    K.box(g, u - 1.2, -10.5, u + 1.2, -9.3, 1.4, 2.8, '#B58F58', { w: 0.45, boil: false });
    const lg = []; for (const [x, y] of [[u - 1.1, -9.4], [u + 1.1, -9.4]]) { const a = g.p(x, y, 0), b = g.p(x, y, 1.4); lg.push(a[0], a[1], b[0], b[1]); } g.segs2(lg, '#6B4E36', 0.45);
    const R = RNG(u * 10 + 3), s = []; for (let x = u - 1.0; x < u + 1.0; x += 0.24) { const a = g.p(x, -9.9, 2.8), b = g.p(x, -9.9, 3.5 + R() * 0.3); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#C9A26B', 0.7);
    const t = []; for (let x = u - 1.0; x < u + 1.0; x += 0.72) { const a = g.p(x, -9.9, 3.6), b = g.p(x + 0.3, -9.9, 3.6); t.push(a[0], a[1], b[0], b[1]); } g.segs2(t, '#C9584B', 0.6);
  }, { name: 'book cart' });

  // the kissaten: a striped awning, a window of plastic food, the coffee sign; flowers upstairs
  T.obj(FA.fp(1, 8.5, -12, 0), function (g) {
    const u0 = 1, u1 = 8.5;
    twoStorey(g, FA, u0, u1, 12, '#B9876A', '#F3EEE2');
    const bricks = []; for (let z = 0.6; z < GF; z += 0.55) bricks.push([FA.w(u0, 0.02, z), FA.w(u1, 0.02, z)]); segs(g, bricks, '#8E5E46', 0.22);
    glassDoor(g, FA, u0 + 0.6, u0 + 2.8, 0, 6.0, { n: 1, bars: [3.0], col: WIN });
    { const q = FA.on(u0 + 3.4, u1 - 0.6, 1.4, 4.8, 0.03); g.fill(q, WIN); g.outline(q, { w: 0.5, boil: false }); const R = RNG(71); for (let u = u0 + 3.9; u < u1 - 0.8; u += 1.05) { const c = FA.p(g, u, 0.06, 2.2); g.fill2([[c[0] - 0.8, c[1]], [c[0] + 0.8, c[1]], [c[0] + 0.6, c[1] - 0.5], [c[0] - 0.6, c[1] - 0.5]], '#F6F3EA', true); g.disc2([c[0], c[1] - 0.8], 0.6, R.pick(['#E6C24F', '#C9584B', '#8A5A3A', '#F3E3C0', '#E08A3C'])); } }
    FA.awn(g, u0 + 0.2, u1 - 0.2, GF - 0.4, 1.8, '#8A3B2E', { stripe: '#F3EEE0', drop: 0.6 });
    FA.sign(g, u0 + 1.0, u1 - 1.0, GF + 0.6, GF + 2.6, '#5A3A2A', { word: '喫茶', ink: '#F6E7C8' });
    FA.win(g, u0 + 1, u1 - 1, GF + 3.6, EZ - 1, { style: 'glass' });
    FA.box(g, u0 + 1.0, u1 - 1.0, 0, 0.8, GF + 3.0, GF + 3.6, '#8A6A50', { w: 0.35, boil: false });
    for (let i = 0; i < 5; i++) { const c = FA.p(g, lerp(u0 + 1.5, u1 - 1.5, i / 4), 0.4, GF + 3.7); blob(g, [c[0], c[1] - 0.8], 1.0, SEA === 'wi' ? '#5E7E52' : '#7FAE5E', '#4B6B36', 700 + i); g.disc2([c[0] + 0.3, c[1] - 1.1], 0.4, SEA === 'au' ? '#E8C445' : SEA === 'wi' ? '#C9302A' : '#E05A6A'); }
    kawara(g, FA, u0, u1, 12, EZ, 4.2, '#9A5444', { end: '#F3EEE2' });
    aerial(g, 5, -17, EZ + 3.8, 4.4);
    { const c = FA.w(u1 - 0.1, 1.0, 10); K.box(g, c[0] - 0.2, c[1] - 0.6, c[0] + 0.2, c[1] + 0.6, 6.4, 13.4, '#F3EEE0', { w: 0.4, boil: false }); g.mark({ nc: true }); TK.word(g, 'R', c[0] + 0.2, c[1], 9.9, 1.0, 'コーヒー', '#5A3A2A', { vert: true }); }
  }, { name: 'kissaten' });
  T.obj([5.6, -10.6, 7.4, -9.6], function (g) {                       // the A-board menu
    const a = g.p(6.5, -10.1, 0), t = g.p(6.5, -10.1, 3.2); g.fill2([[a[0] - 1.6, a[1]], [a[0] + 1.6, a[1]], [t[0] + 1.2, t[1]], [t[0] - 1.2, t[1]]], '#3A3530', true);
    g.fill2([[a[0] - 1.1, a[1] - 0.8], [a[0] + 1.1, a[1] - 0.8], [t[0] + 0.8, t[1] + 0.8], [t[0] - 0.8, t[1] + 0.8]], '#4A5248', true);
    const s = []; for (let i = 0; i < 4; i++) { const y = lerp(a[1] - 1.6, t[1] + 1.6, i / 3); s.push(a[0] - 0.8, y, a[0] + 0.6 - (i % 2) * 0.4, y); } g.segs2(s, '#F6F3EA', 0.3);
  }, { name: 'menu board' });
  T.obj([0.4, -10.7, 2.1, -9.0], (g) => { pot(g, 1.6, -10.2, 0, 3, 5501); pot(g, 0.9, -9.5, 0, 0, 5502); }, { name: 'pots' });
  // the alley between the kissaten and the sentō: pots up the wall, a bicycle, washing on a line across
  T.obj([8.7, -21, 11.3, -11.2], function (g) {
    for (let i = 0; i < 5; i++) pot(g, 9.4, -12.2 - i * 1.6, 0, i % 5, 880 + i);
    cycle(g, 10.4, -19, Math.PI / 2, '#5F8FC9', { basket: '#9FA39E' });
    const a = g.p(8.6, -15, 11.5), b = g.p(11.4, -15, 11.5); g.fine2([a, b], { w: 0.3, c: '#5A564E' });
    for (let i = 0; i < 3; i++) { const c = [lerp(a[0], b[0], 0.2 + i * 0.3), lerp(a[1], b[1], 0.2 + i * 0.3)]; g.fill2([[c[0] - 0.9, c[1]], [c[0] + 0.9, c[1]], [c[0] + 0.9, c[1] + 3.4], [c[0] - 0.9, c[1] + 3.4]], ['#F6F3EA', '#8FB7D9', '#E6C24F'][i], true); }
  }, { name: 'alley' });

  /* ---------------- the sentō ---------------- */
  // Tokyo's temple-style bathhouse (miyazukuri): a great hip-and-gable roof turning its gable to the lane over a
  // skirt of tiles, the bath's name on the gable, a curved karahafu porch at the door, a timber frame on white plaster
  const SX0 = 11.6, SX1 = 33.2, SY0 = -35.5, SZ = 15, KH = [15.4, 29.4];
  const sentoRoof = (g) => {
    const ov = 2.0, lift = 1.6, z0 = SZ, h = 12.8, col = '#4C5770', ink = '#2A3040';
    const X0 = SX0 - ov, X1 = SX1 + ov, Y0 = SY0 - ov, Y1 = FY + ov, xm = (SX0 + SX1) / 2, half = (X1 - X0) / 2, zt = z0 + h;
    const gf = 0.6, w = half * gf, zg = zt - h * gf, yg = Y1 - half * (1 - gf), Yr = Y0 + half;
    const eave = (xa, ya, xb, yb, n) => { const p = []; for (let i = 0; i <= n; i++) { const t = i / n; p.push([lerp(xa, xb, t), lerp(ya, yb, t), z0 + lift * Math.pow(Math.abs(2 * t - 1), 2.4)]); } return p; };
    const right = eave(X1, Y0, X1, Y1, 12).concat([[xm + w, yg, zg], [xm, yg, zt], [xm, Yr, zt]]);
    const skirt = eave(X0, Y1, X1, Y1, 12).concat([[xm + w, yg, zg], [xm - w, yg, zg]]);
    const left = eave(X0, Y1, X0, Y0, 12).concat([[xm, Yr, zt], [xm, yg, zt], [xm - w, yg, zg]]);
    g.fill(left, shade(col, 0.18)); g.fill(right, shade(col, 0.08)); g.fill(skirt, shade(col, -0.1));
    // tile channels down the side slope and the skirt
    const P = [], hx = (y) => y > yg ? lerp(xm + w, X1, (y - yg) / (Y1 - yg)) : y < Yr ? lerp(xm, X1, (Yr - y) / (Yr - Y0)) : xm, zx = (x) => z0 + (X1 - x) / (X1 - xm) * h;
    for (let y = Y0 + 0.5; y < Y1 - 0.2; y += 0.75) { const t = (y - Y0) / (Y1 - Y0), ze = z0 + lift * Math.pow(Math.abs(2 * t - 1), 2.4), x1 = hx(y); P.push([[X1, y, ze + 0.04], [x1 + 0.1, y, zx(x1) - 0.05]]); }
    for (let x = X0 + 0.5; x < X1 - 0.2; x += 0.75) { const t = (x - X0) / (X1 - X0), ze = z0 + lift * Math.pow(Math.abs(2 * t - 1), 2.4), ya = Math.abs(x - xm) <= w ? yg : lerp(yg, Y1, (Math.abs(x - xm) - w) / (half - w)), za = Math.abs(x - xm) <= w ? zg : z0 + (half - Math.abs(x - xm)) / half * h; P.push([[x, Y1, ze + 0.04], [x, ya + 0.1, za - 0.05]]); }
    segs(g, P, shade(col, 0.32), 0.3);
    // the gable: plaster with a lattice of slats, carved bargeboards, the gold ornament at its peak, the bath's name
    const tri = [[xm - w, yg, zg], [xm + w, yg, zg], [xm, yg, zt]]; g.fill(tri, '#F1E9D6');
    const sl = []; for (let k = 1; k < 14; k++) { const x = lerp(xm - w, xm + w, k / 14); sl.push([[x, yg + 0.05, zg], [x, yg + 0.05, zg + (1 - Math.abs(x - xm) / w) * (zt - zg) - 0.2]]); } segs(g, sl, '#B9A27D', 0.28);
    for (const s of [-1, 1]) { const b = [[xm + s * w * 1.05, yg + 0.15, zg - 0.3], [xm, yg + 0.15, zt + 0.15], [xm, yg + 0.15, zt - 0.85], [xm + s * w * 1.05, yg + 0.15, zg - 1.15]]; g.fill(b, '#F6F1E4'); g.outline(b, { w: 0.5, c: ink, boil: false }); }
    { const c = g.p(xm, yg + 0.2, zt - 1.2); g.fill2([[c[0] - 2.0, c[1] - 0.6], [c[0] + 2.0, c[1] - 0.6], [c[0] + 1.2, c[1] + 2.6], [c[0], c[1] + 3.4], [c[0] - 1.2, c[1] + 2.6]], '#D9B547', true); g.line2([[c[0] - 2.0, c[1] - 0.6], [c[0] + 2.0, c[1] - 0.6], [c[0], c[1] + 3.4], [c[0] - 2.0, c[1] - 0.6]], { w: 0.35, c: '#7A5A20', boil: false }); }
    { const zc = zg + 2.4, q = K.on('L', yg + 0.25, xm - 1.9, xm + 1.9, zc - 1.7, zc + 1.7); g.fill(q, '#2F3F63'); g.mark({ nc: true }); g.outline(q, { w: 0.6, c: '#C9A23A', boil: false }); TK.word(g, 'L', yg + 0.26, xm, zc, 2.5, '湯', '#F6F3EA'); const c = g.p(xm, yg + 0.3, zc); g.glow2('neon', c, g.p(xm, FY + 2, 0), { r: 6, col: '#BFD0FF' }); }
    // the eaves, the hips, the ridge with its end tiles
    g.line(eave(X0, Y1, X1, Y1, 12), { w: 1.0, c: ink }); g.line(eave(X1, Y1, X1, Y0, 12), { w: 1.0, c: ink });
    g.line([[X1, Y1, z0 + lift], [xm + w, yg, zg]], { w: 0.8, c: ink }); g.line([[X0, Y1, z0 + lift], [xm - w, yg, zg]], { w: 0.8, c: ink }); g.line([[X1, Y0, z0 + lift], [xm, Yr, zt]], { w: 0.7, c: ink });
    const rA = g.p(xm, Yr, zt), rB = g.p(xm, yg, zt); g.line2([rA, rB], { w: 1.9, c: '#2F3646', boil: false, ext: 0 });
    g.fill2([[rA[0] - 1.0, rA[1] + 0.5], [rA[0] + 1.0, rA[1] + 0.5], [rA[0] + 0.6, rA[1] - 2.0], [rA[0] - 0.6, rA[1] - 2.0]], '#2F3646', true);
    g.fill2([[rB[0] - 1.6, rB[1] + 0.8], [rB[0] + 1.6, rB[1] + 0.8], [rB[0] + 1.0, rB[1] - 2.6], [rB[0] - 1.0, rB[1] - 2.6]], '#2F3646', true);
  };
  T.obj([SX0, SY0, SX1, FY], function (g) {
    g.boilP = 0.4;
    const FS = FR('L', FY), WALL = { t: '#E9E2CF', l: '#F5F0E5', r: '#E2DAC8' };
    K.box(g, SX0, SY0, SX1, FY, 0, SZ, WALL, { w: 1.0 });
    // the timber frame on the plaster: posts, a tie beam, a dark wooden wainscot
    g.fill(FS.on(SX0, SX1, 0, 2.8, 0.02), '#6B4E36'); g.fill(K.on('R', SX1 + 0.02, SY0, FY, 0, 2.8), '#5E4430');
    const pf = []; for (const u of [SX0 + 0.4, KH[0] - 0.3, KH[1] + 0.3, SX1 - 0.4]) pf.push([FS.w(u, 0.04, 0), FS.w(u, 0.04, SZ)]); for (let y = SY0 + 0.5; y < FY; y += 4.4) pf.push([[SX1 + 0.04, y, 0], [SX1 + 0.04, y, SZ]]);
    segs(g, pf, '#8A6A50', 0.95);
    for (const [z0, z1] of [[12.2, 13.0], [6.2, 6.7]]) { g.fill(FS.on(SX0, SX1, z0, z1, 0.04), '#8A6A50'); g.fill(K.on('R', SX1 + 0.04, SY0, FY, z0, z1), '#745740'); }
    // the high windows of the bath hall (the steam goes out there), lit warm at night
    for (let y = SY0 + 1.4; y < FY - 3; y += 4.4) { K.win(g, 'R', SX1, y, y + 2.8, 7.6, 11.4, { style: 'glass', col: '#DCE8EC' }); const P = []; for (let k = 1; k < 4; k++) P.push([[SX1 + 0.06, y + k * 0.7, 7.6], [SX1 + 0.06, y + k * 0.7, 11.4]]); segs(g, P, '#6B4E36', 0.3); }
    // either side of the porch: frosted glass in wooden lattice, a row of small windows above
    for (const [a, b] of [[SX0 + 1.2, KH[0] - 1.2], [KH[1] + 1.2, SX1 - 1.2]]) { koshi(g, FS, a, b, 3.2, 6.0); FS.win(g, a + 0.2, b - 0.2, 7.4, 11.6, { style: 'glass', col: '#DCE8EC' }); }
    sentoRoof(g);
  }, { name: 'sento', tall: true });
  // the karahafu porch: two posts, the curved gable, the ゆ noren in the door, a lamp
  T.obj([KH[0], FY, KH[1], FY + 3.4], function (g) {
    const FS = FR('L', FY), x0 = KH[0], x1 = KH[1], yf = FY + 3.4, zb = 9.8, hc = 3.9;
    g.fill(FS.on(x0 + 1.4, x1 - 1.4, 0, 8.0, 0.03), '#4A3A30');
    glassDoor(g, FS, x0 + 1.8, x1 - 1.8, 0, 7.6, { n: 4, col: WIN, fr: '#5A4030', bars: [3.6] });
    { const n = 3, a0 = x0 + 1.8, a1 = x1 - 1.8; for (let i = 0; i < n; i++) { const b0 = lerp(a0, a1, i / n) + 0.06, b1 = lerp(a0, a1, (i + 1) / n) - 0.06, q = FS.on(b0, b1, 3.8, 7.6, 0.16); g.fill(q, '#2F3F63'); g.outline(q, { w: 0.3, c: '#1F2A44', boil: false, ext: 0 }); } TK.word(g, 'L', FY + 0.17, (a0 + a1) / 2, 5.8, 2.6, 'ゆ', '#F6F3EA'); }
    K.box(g, x0 + 0.6, FY, x1 - 0.6, yf - 0.4, 0, 0.5, '#D9D3C4', { w: 0.5, boil: false });
    for (const x of [x0 + 0.7, x1 - 0.7]) K.box(g, x - 0.38, yf - 1.1, x + 0.38, yf - 0.35, 0, zb, { t: '#9A7656', l: '#8A6A50', r: '#6B4E36' }, { w: 0.55 });
    K.box(g, x0 + 0.3, yf - 1.1, x1 - 0.3, yf - 0.35, zb - 1.2, zb, { t: '#9A7656', l: '#8A6A50', r: '#6B4E36' }, { w: 0.5, boil: false });
    // the curved gable: concave at the ends, bowed up in the middle, running back to the wall
    const N = 18, prof = (t) => zb + hc * (1 - Math.cos(TAU * t)) / 2 + 0.55 * Math.pow(Math.max(0, 1 - t / 0.1), 2) + 0.55 * Math.pow(Math.max(0, (t - 0.9) / 0.1), 2);
    const fr = [], bk = []; for (let i = 0; i <= N; i++) { const t = i / N, x = lerp(x0 - 0.4, x1 + 0.4, t); fr.push([x, yf, prof(t)]); bk.push([x, FY + 0.2, prof(t) + 0.3]); }
    g.fill(fr.concat(bk.slice().reverse()), '#4C5770');
    const ch = []; for (let i = 1; i < N; i++) ch.push([[fr[i][0], yf - 0.1, fr[i][2] + 0.05], [bk[i][0], FY + 0.4, bk[i][2]]]); segs(g, ch, '#2F3646', 0.3);
    const inf = fr.map((p) => [p[0], yf - 0.5, p[2] - 0.3]).concat([[x1 - 0.3, yf - 0.5, zb - 0.1], [x0 + 0.3, yf - 0.5, zb - 0.1]]); g.fill(inf, '#EFE6D0');
    { const P = []; for (let k = 1; k < 8; k++) { const x = lerp(x0 + 1.2, x1 - 1.2, k / 8), t = (x - x0 + 0.4) / (x1 - x0 + 0.8); P.push([[x, yf - 0.45, zb], [x, yf - 0.45, prof(t) - 0.5]]); } segs(g, P, '#B9A27D', 0.3); }
    const bb = fr.map((p) => [p[0], yf + 0.05, p[2]]).concat(fr.slice().reverse().map((p) => [p[0], yf + 0.05, p[2] - 0.8])); g.fill(bb, '#F6F1E4'); g.outline(bb, { w: 0.6, boil: false });
    { const c = g.p((x0 + x1) / 2, yf + 0.1, zb + hc - 0.7); g.fill2([[c[0] - 1.6, c[1] - 0.6], [c[0] + 1.6, c[1] - 0.6], [c[0] + 1.0, c[1] + 2.4], [c[0], c[1] + 3.0], [c[0] - 1.0, c[1] + 2.4]], '#D9B547', true); g.line2([[c[0] - 1.6, c[1] - 0.6], [c[0] + 1.6, c[1] - 0.6]], { w: 0.35, c: '#7A5A20', boil: false }); }
    g.line(fr.map((p) => [p[0], yf, p[2] + 0.12]), { w: 1.0, boil: false });
    for (const x of [x0 + 1.4, x1 - 1.4]) { const c = g.p(x, yf - 0.5, 8.2); g.line2([g.p(x, yf - 0.5, zb - 1.2), [c[0], c[1] - 1.6]], { w: 0.3, c: '#3A3530', boil: false }); TK.lantern2(g, c, 1.5, '#F3EEE2'); TK.word2(g, [c[0], c[1] + 0.1], 1.4, 'ゆ', '#C9463E'); }
    if (TK.winter()) TK.shime2(g, g.p((x0 + x1) / 2, FY + 0.2, 8.4), 1.1);
  }, { name: 'karahafu' });
  // a vertical ゆ sign standing out from the corner
  T.obj([SX1 - 0.2, FY + 0.2, SX1 + 0.2, FY + 1.6], (g) => { K.box(g, SX1 - 0.2, FY + 0.2, SX1 + 0.2, FY + 1.6, 7.0, 13.6, '#C9463E', { w: 0.45, boil: false }); g.mark({ nc: true }); TK.word(g, 'R', SX1 + 0.2, FY + 0.9, 10.3, 2.4, 'ゆ', '#FBF8EE'); }, { name: 'sign' });
  // the boiler shed with its firewood, and the chimney
  T.obj([33.4, -36.6, 36.2, -33.2], function (g) {
    K.box(g, 33.4, -36.6, 36.2, -33.2, 0, 6.5, { t: '#9FA39E', l: '#B9B6AD', r: '#A3A097' }, { w: 0.8 });
    const rib = []; for (let y = -36.2; y < -33.2; y += 0.6) rib.push([[36.24, y, 0.2], [36.24, y, 6.4]]); segs(g, rib, '#8C8E89', 0.25);
    const R = RNG(9), logs = []; for (let k = 0; k < 12; k++) { const y = -36.1 + (k % 4) * 0.75, z = 0.5 + Math.floor(k / 4) * 0.75 + (k % 2) * 0.1; logs.push(g.p(36.5, y, z)); } for (const c of logs) { g.disc2(c, 0.9, R.pick(['#C9A26B', '#B58F58', '#D9B57E'])); g.ring2(c, 0.9, { w: 0.25, c: '#7A5A3C' }); }
  }, { name: 'boiler' });
  T.obj([33.1, -32.3, 36.9, -28.5], function (g) {
    const cx = 35, cy = -30.4, TOP = 42;
    const pts = (z, r, a0, a1) => K.arc(cx, cy, z, r, a0, a1, 10);
    const r0 = 1.9, r1 = 1.25, L = pts(0, r0, A_L, A_R), U = pts(TOP, r1, A_R, A_L);
    g.fill(L.concat(U), '#E6E1D5'); g.fill(pts(0, r0, 0.25, A_R).concat(pts(TOP, r1, A_R, 0.25)), '#C9C3B6');
    g.line([L[0], U[U.length - 1]], { w: 0.75 }); g.line([L[L.length - 1], U[0]], { w: 0.75 });
    for (const z of [10, 20, 28, 37]) { const r = lerp(r0, r1, z / TOP); g.line(pts(z, r, A_L, A_R), { w: 0.4, c: '#8C8576', boil: false }); }
    TK.wordP(g, (a, z) => [cx + 1.0 + a * 0.71, cy + 1.0 - a * 0.71, z], 0, 32.5, 2.2, '湯', '#2F3F63', { vert: true });
    const lad = []; for (let z = 3; z < TOP - 1; z += 0.9) lad.push([[cx + 1.0, cy - 1.0, z], [cx + 1.25, cy - 0.75, z]]); segs(g, lad, '#5A564E', 0.3);
    K.cyl(g, cx, cy, 1.5, TOP, TOP + 1.2, { t: '#3A3530', l: '#5A564E', r: '#4A4540' }, { w: 0.6, n: 10 });
  }, { name: 'chimney', tall: true });
  // the bathers' bicycles in front of the sentō
  // (side by side along the wall, either side of the porch: a bike is 7 u long and lane A only 8 u wide)
  T.obj([8.6, -11.0, 16.1, -8.6], (g) => { cycle(g, 12.2, -10.3, 0.0, '#C9463E', { basket: '#9FA39E' }); cycle(g, 12.5, -9.45, 0.03, '#F3F1EA'); }, { name: 'bikes' });
  T.obj([29.4, -11.0, 36.9, -8.6], (g) => { cycle(g, 33.0, -10.3, 0.0, '#3F6FA8', { basket: '#9FA39E', child: '#E6C24F' }); cycle(g, 33.25, -9.45, 0.03, '#2F343B'); }, { name: 'bikes' });
  // (on the porch's step, inside the posts: out on the lane they stood in the walkers' way)
  for (const x of [17.4, 27.4]) T.obj([x, FY + 2.3], (g) => g.at(0, 0, 0.5, (g2) => TK.kadomatsu(g2, x, FY + 2.3)), { on: true, season: 'winter' });   // until the 7th

  /* ---------------- lane B's row: shops facing lane B ---------------- */
  const FB = FR('R', BX), BD = 14.4;
  // a two-storey shop-house on lane B; o: sign word and colours, the ground floor's goods
  const shopB = (y0, y1, o) => T.obj([BX - BD, y0, BX, y1], function (g) {
    const u0 = -y1, u1 = -y0, R = RNG(o.seed);
    FB.box(g, u0, u1, -BD, 0, 0, GF, { t: '#D9CDB5', l: o.low || '#EFE6D2', r: shade(o.low || '#EFE6D2', 0.1) }, { w: 0.9 });
    FB.box(g, u0, u1, -BD, 0, GF, EZ, { t: '#E9E2CF', l: o.wall || '#F1EAD8', r: shade(o.wall || '#F1EAD8', 0.1) }, { w: 0.9 });
    if (o.siding) { const P = []; for (let z = GF + 0.6; z < EZ; z += 0.6) P.push([FB.w(u0, 0.02, z), FB.w(u1, 0.02, z)]); segs(g, P, shade(o.wall, 0.2), 0.22); }
    o.front(g, u0, u1, R);
    if (o.awn) FB.awn(g, u0 + 0.2, u1 - 0.2, GF - 0.3, 1.6, o.awn[0], { stripe: o.awn[1], drop: 0.6 });
    else hisashi(g, FB, u0, u1, GF - 0.3, 1.3, o.roof);
    FB.sign(g, u0 + 0.9, u1 - 0.9, GF + 0.5, GF + 2.4, o.sign[0], { word: o.word, ink: o.sign[1] });
    if (o.balc) { balcony(g, FB, u0 + 0.5, u1 - 0.5, GF + 3.0, 1.1, {}); glassDoor(g, FB, u0 + 1.0, u1 - 1.0, GF + 3.1, EZ - 0.6, { n: 3, bars: [GF + 4.7], fr: '#8C8576' }); if (o.balc === 'wash') laundry(g, FB, u0 + 0.8, u1 - 0.8, 0.7, EZ - 0.5, o.seed * 3); else if (o.balc === 'futon') futon(g, FB, u0 + 1.0, u0 + 4.2, 1.1, GF + 5.1, '#8FB7D9'); }
    else { FB.win(g, u0 + 1.0, u1 - 1.0, GF + 3.0, EZ - 0.9, { style: 'glass' }); }
    if (o.ac) acUnit(g, FB, u1 - 1.4, 0, GF + 2.5);
    kawara(g, FB, u0, u1, BD, EZ, 4.0, o.roof, { end: o.wall || '#F1EAD8' });
    aerial(g, BX - 9, (y0 + y1) / 2, EZ + 3.6, 4.4);
    if (o.extra) o.extra(g, u0, u1, R);
    if (o.vsign) { const y = y1 - 0.5; K.box(g, BX, y - 0.2, BX + 1.3, y + 0.2, GF + 0.6, GF + 6.6, o.vsign[1], { w: 0.4, boil: false }); g.mark({ nc: true }); TK.word(g, 'L', y + 0.2, BX + 0.65, GF + 3.6, 1.0, o.vsign[0], o.vsign[2], { vert: true }); }
    if (o.pots) for (const [u, k] of o.pots) pot(g, BX + 0.8, -u, 0, k, o.seed * 31 + Math.round(u * 7));
    if (TK.winter()) TK.shime2(g, FB.p(g, (u0 + u1) / 2, 0.1, 6.5), 0.75);
  }, { name: o.name });
  // the pharmacy: a glass front with shelves of bright packets, a green cross
  shopB(6.6, 14, { seed: 21, name: 'pharmacy', word: '薬', sign: ['#2F7F5A', '#FBF8EE'], roof: '#5E6672', wall: '#E7EEF0', low: '#E9E6DE', balc: 'wash', ac: true,
    front(g, u0, u1, R) { const q = FB.on(u0 + 0.5, u1 - 0.5, 0, 6.2, 0.03); g.fill(q, SHOP); for (const z of [1.2, 2.6, 4.0]) for (let u = u0 + 0.8; u < u1 - 0.6; u += 0.5) { const c = FB.p(g, u, 0.06, z); g.fill2([[c[0] - 0.4, c[1]], [c[0] + 0.4, c[1]], [c[0] + 0.4, c[1] - 1.3], [c[0] - 0.4, c[1] - 1.3]], R.pick(['#E05A4A', '#5F8FC9', '#F3E36A', '#8FBF73', '#F6F3EA', '#D98AA4']), true); g.mark({ nc: true }); } glassDoor(g, FB, u0 + 0.5, u1 - 0.5, 0, 6.2, { n: 3, col: 'rgba(0,0,0,0)', fr: '#9FA39E', bars: [], lit: 0 }); g.outline(q, { w: 0.5, boil: false }); },
    extra(g, u0) { const c = FB.p(g, u0 + 0.6, 1.3, 9.6); g.fill2([[c[0] - 0.6, c[1] - 1.8], [c[0] + 0.6, c[1] - 1.8], [c[0] + 0.6, c[1] - 0.6], [c[0] + 1.8, c[1] - 0.6], [c[0] + 1.8, c[1] + 0.6], [c[0] + 0.6, c[1] + 0.6], [c[0] + 0.6, c[1] + 1.8], [c[0] - 0.6, c[1] + 1.8], [c[0] - 0.6, c[1] + 0.6], [c[0] - 1.8, c[1] + 0.6], [c[0] - 1.8, c[1] - 0.6], [c[0] - 0.6, c[1] - 0.6]], '#3FAF6A', true); g.mark({ nc: true }); } });
  // the rice shop: sacks of rice on the step, a scale, a wooden sign
  shopB(14.5, 22, { seed: 22, name: 'rice shop', word: '米', sign: ['#2F3F63', '#FBF8EE'], roof: '#7E5A44', wall: '#E9DCC0', low: '#8A6A50', balc: 'futon', siding: true,
    front(g, u0, u1) { const q = FB.on(u0 + 0.5, u1 - 0.5, 0, 6.0, 0.03); g.fill(q, SHOP); g.outline(q, { w: 0.5, boil: false }); for (let i = 0; i < 4; i++) { const c = FB.p(g, u0 + 1.2 + i * 1.5, 0.9, 0); const sk = [[c[0] - 1.5, c[1]], [c[0] + 1.5, c[1]], [c[0] + 1.3, c[1] - 3.4], [c[0] - 1.3, c[1] - 3.4]]; g.fill2(sk, i % 2 ? '#F3EEE0' : '#E9DCC0', true); g.outline2(sk, { w: 0.35, c: '#8C7A5A', boil: false }); TK.word2(g, [c[0], c[1] - 1.8], 1.4, '米', '#C9463E'); } } });
  // the shokudō: noren in the door, a red lantern, a window of plastic dishes
  shopB(22.5, 29.5, { seed: 23, name: 'shokudo', word: '食堂', sign: ['#F3EEE0', '#2A2622'], roof: '#5E6E8A', wall: '#F1EAD8', low: '#9A7656', balc: 'wash', vsign: ['うどん', '#E6C24F', '#3A3128'],
    front(g, u0, u1, R) { glassDoor(g, FB, u0 + 0.6, u0 + 3.4, 0, 6.0, { n: 2, col: WIN }); const nr = [u0 + 0.6, u0 + 3.4]; for (let i = 0; i < 3; i++) { const b0 = lerp(nr[0], nr[1], i / 3) + 0.05, b1 = lerp(nr[0], nr[1], (i + 1) / 3) - 0.05, q = FB.on(b0, b1, 3.6, 6.0, 0.18); g.fill(q, '#2F3F63'); g.outline(q, { w: 0.3, c: '#1F2A44', boil: false, ext: 0 }); } TK.word(g, 'R', BX + 0.19, -(u0 + 2.0), 4.8, 1.0, '食堂', '#F6F3EA');
      const q = FB.on(u0 + 4.0, u1 - 0.6, 1.4, 4.6, 0.03); g.fill(q, WIN); g.outline(q, { w: 0.5, boil: false }); for (let u = u0 + 4.5; u < u1 - 0.8; u += 1.0) { const c = FB.p(g, u, 0.06, 2.2); g.fill2([[c[0] - 0.8, c[1]], [c[0] + 0.8, c[1]], [c[0] + 0.6, c[1] - 0.5], [c[0] - 0.6, c[1] - 0.5]], '#F6F3EA', true); g.disc2([c[0], c[1] - 0.8], 0.6, R.pick(['#E6C24F', '#C9584B', '#8A5A3A', '#E08A3C', '#7FAE5E'])); } },
    extra(g, u0) { const a = FB.p(g, u0 + 3.8, 1.6, GF - 0.2), c = [a[0], a[1] + 3.2]; g.line2([a, [c[0], c[1] - 2.2]], { w: 0.3, c: '#3A3530', boil: false }); TK.lantern2(g, c, 2.0, '#D0483A'); TK.word2(g, [c[0], c[1] + 0.1], 1.6, '酒', '#2A2622', { vert: true }); } });
  // the florist on the corner: buckets of flowers out on the lane and round the corner
  shopB(30, 35.4, { seed: 24, name: 'florist', word: '花', sign: ['#F3EEE0', '#C9463E'], roof: '#6E8A7E', wall: '#F3EEE2', low: '#EFE6D2', awn: ['#5E8A4A', '#F3EEE0'],
    front(g, u0, u1) { const q = FB.on(u0 + 0.4, u1 - 0.4, 0, 6.0, 0.03); g.fill(q, SHOP); g.outline(q, { w: 0.5, boil: false }); },
    extra(g, u0, u1) { FB.win(g, u0 + 1, u1 - 1, GF + 3.0, EZ - 0.9, { style: 'glass' }); const FL = FR('L', 35.4); FL.win(g, BX - 12, BX - 8, GF + 3.0, EZ - 0.9, { style: 'glass' }); FL.win(g, BX - 6.2, BX - 1.8, GF + 3.0, EZ - 0.9, { style: 'glass' });
      const q = FL.on(BX - 13.6, BX - 0.6, 0, 6.0, 0.03); g.fill(q, SHOP); const sh = []; for (const z of [1.6, 3.4]) sh.push([FL.w(BX - 13.6, 0.05, z), FL.w(BX - 0.6, 0.05, z)]); segs(g, sh, '#8A6A50', 0.4); g.outline(q, { w: 0.5, boil: false }); FL.awn(g, BX - 14.0, BX - 0.3, GF - 0.3, 1.6, '#5E8A4A', { stripe: '#F3EEE0', drop: 0.6 }); FL.sign(g, BX - 10.5, BX - 3.5, GF + 0.6, GF + 2.5, '#F3EEE0', { word: '花', ink: '#C9463E' });
      const R2 = RNG(250), cols = SEA === 'sp' ? ['#F2C6D0', '#E58BB0', '#F3E36A', '#F6F3EA', '#B07AC9'] : SEA === 'su' ? ['#F3E36A', '#E05A4A', '#5E6FC9'] : SEA === 'au' ? ['#E8C445', '#C9584B', '#B07AC9'] : ['#C9302A', '#F6F3EA', '#E58BB0'];
      for (let x = BX - 13.0; x < BX - 1.0; x += 1.3) for (const z of [1.6, 3.4]) { const c = FL.p(g, x, 0.4, z); g.fill2([[c[0] - 0.7, c[1]], [c[0] + 0.7, c[1]], [c[0] + 0.9, c[1] - 1.1], [c[0] - 0.9, c[1] - 1.1]], '#F6F3EA', true); for (let i = 0; i < 3; i++) g.disc2([c[0] + (R2() - 0.5) * 1.6, c[1] - 1.6 - R2() * 0.8], 0.55, R2.pick(cols)); } } });
  T.obj([-35.8, 35.6, -22.6, 36.9], function (g) {                     // the florist's tiers of buckets round the corner
    const R = RNG(260), cols = SEA === 'sp' ? ['#F2C6D0', '#E58BB0', '#F3E36A', '#F6F3EA', '#B07AC9', '#E05A4A'] : SEA === 'su' ? ['#F3E36A', '#E05A4A', '#5E6FC9', '#F6F3EA'] : SEA === 'au' ? ['#E8C445', '#C9584B', '#F6F3EA', '#B07AC9', '#E08A3C'] : ['#C9302A', '#F6F3EA', '#E58BB0', '#5E8A4A'];
    for (const [z, y0] of [[1.2, 35.7], [0, 36.3]]) { if (z) K.box(g, -35.6, 35.6, -22.8, 36.2, 0, z, '#9FA39E', { w: 0.3, boil: false }); for (let x = -35.0; x < -23.2; x += 1.2) { const c = g.p(x + (z ? 0 : 0.6), y0 + 0.25, z); g.fill2([[c[0] - 0.9, c[1]], [c[0] + 0.9, c[1]], [c[0] + 1.1, c[1] - 1.6], [c[0] - 1.1, c[1] - 1.6]], '#6E8A9A', true); const st = []; for (let i = 0; i < 5; i++) st.push(c[0] + (i - 2) * 0.35, c[1] - 1.6, c[0] + (i - 2) * 0.6, c[1] - 3.4 - R() * 0.8); g.segs2(st, '#5E8A4A', 0.3); for (let i = 0; i < 4; i++) g.disc2([c[0] + (R() - 0.5) * 2.4, c[1] - 3.6 - R() * 1.0], 0.65, R.pick(cols)); } }
  }, { name: 'buckets' });
  T.obj([BX + 0.1, 29.8, BX + 2.0, 36.4], function (g) {              // the florist's buckets, in tiers
    const R = RNG(240), cols = SEA === 'sp' ? ['#F2C6D0', '#E58BB0', '#F3E36A', '#F6F3EA', '#B07AC9', '#E05A4A'] : SEA === 'su' ? ['#F3E36A', '#E05A4A', '#5E6FC9', '#F6F3EA'] : SEA === 'au' ? ['#E8C445', '#C9584B', '#F6F3EA', '#B07AC9', '#E08A3C'] : ['#C9302A', '#F6F3EA', '#E58BB0', '#5E8A4A'];
    for (let k = 0; k < 2; k++) for (let y = 30.4 + k * 0.4; y < 36.2; y += 1.15) {
      const x = BX + 0.6 + k * 0.8, z = k ? 0 : 1.0, c = g.p(x, y, z); if (!k) K.box(g, x - 0.4, y - 0.5, x + 0.4, y + 0.5, 0, 1.0, '#9FA39E', { w: 0.25, boil: false });
      g.fill2([[c[0] - 0.9, c[1]], [c[0] + 0.9, c[1]], [c[0] + 1.1, c[1] - 1.6], [c[0] - 1.1, c[1] - 1.6]], '#6E8A9A', true);
      const st = []; for (let i = 0; i < 5; i++) st.push(c[0] + (i - 2) * 0.35, c[1] - 1.6, c[0] + (i - 2) * 0.6, c[1] - 3.6 - R() * 0.8); g.segs2(st, '#5E8A4A', 0.3);
      for (let i = 0; i < 4; i++) g.disc2([c[0] + (R() - 0.5) * 2.4, c[1] - 3.8 - R() * 1.0], 0.65, R.pick(cols));
    }
  }, { name: 'buckets' });
  // the bicycle shop on the corner: one storey, set back, bikes out front, a tyre hung on the wall
  T.obj([BX - BD, 0, BX, 6.2], function (g) {
    const u0 = -6.2, u1 = 0;
    FB.box(g, u0, u1, -BD, 0, 0, 6.6, { t: '#D9D3C6', l: '#DCE3E6', r: '#C3CDD2' }, { w: 0.9 });
    const q = FB.on(u0 + 0.4, u1 - 0.4, 0, 5.0, 0.03); g.fill(q, SHOP); g.outline(q, { w: 0.5, boil: false });
    for (let k = 0; k < 2; k++) { const y = 1.5 + k * 2.6, c = g.p(BX - 1.2, y, 0); cycle(g, BX - 1.4, y, Math.PI / 2, ['#5F8FC9', '#E6C24F'][k]); void c; }
    const sh = []; for (let z = 5.0; z < 6.4; z += 0.28) sh.push([FB.w(u0 + 0.4, 0.05, z), FB.w(u1 - 0.4, 0.05, z)]); segs(g, sh, '#8C8E89', 0.3);   // the shutter, rolled up
    K.box(g, BX - BD, 0, BX, 6.2, 6.6, 7.2, { t: '#E9E6DE', l: '#E3E0D6', r: '#CFCCC1' }, { w: 0.6 });
    const sq = FB.on(u0 + 0.3, u1 - 0.3, 7.2, 9.0, -0.1); g.fill(sq, '#3F6FA8'); g.mark({ nc: true }); g.outline(sq, { w: 0.5, boil: false });
    K.textP(g, (a, z) => [BX - 0.04, -a, z], (u0 + u1) / 2, 7.55, 1.1, 'CYCLE', '#FBF8EE', { center: true });
    { const c = g.p(BX - 8, 6.25, 3.6); g.ring2(c, 2.6, { w: 1.1, c: '#2E2A26' }); }
  }, { name: 'bicycle shop' });
  // the kerb along lane B's row (x -22 .. -19.6): bikes parked along it in two lines (x -21.25 and -20.4), single file,
  // with the pots between them; each object's fp is the ground its wheels or pots cover. Walkers keep east of x -19.5
  T.obj([-22.0, -2.8, -19.6, -0.4], (g) => {                            // at the corner: a pump and two of the bicycle shop's pots
    pot(g, -21.05, -2.2, 0, 4, 6202); pot(g, -21.35, -0.9, 0, 2, 6200);
    const p = g.p(-19.95, -2.1, 0), t = g.p(-19.95, -2.1, 2.6); g.line2([p, t], { w: 0.6, c: '#C9463E', boil: false }); g.line2([[t[0] - 1, t[1]], [t[0] + 1, t[1]]], { w: 0.5, c: '#3A3530', boil: false });
  }, { name: 'pots' });
  T.obj([-21.86, 5.94, -20.94, 6.86], (g) => pot(g, -21.4, 6.4, 0, 3, 6201), { name: 'pots' });
  T.obj([-22.05, 7.2, -19.6, 15.0], (g) => { cycle(g, -21.25, 11.4, Math.PI / 2, '#C9463E', { basket: null }); cycle(g, -20.4, 10.8, Math.PI / 2, '#F3F1EA', { basket: '#9FA39E' }); }, { name: 'bikes for sale' });
  T.obj([-21.86, 15.04, -20.94, 15.96], (g) => pot(g, -21.4, 15.5, 0, 0, 21 * 31 + Math.round(-13.6 * 7)), { name: 'pots' });
  T.obj([-22.05, 14.8, -19.6, 23.2], (g) => { cycle(g, -21.25, 19.6, Math.PI / 2, '#F3F1EA', { basket: '#9FA39E' }); cycle(g, -20.4, 18.4, Math.PI / 2, '#5FA58F', { basket: '#9FA39E', child: '#E05A4A' }); }, { name: 'bikes' });
  T.obj([-21.86, 23.44, -20.94, 27.66], (g) => { for (const [y, k, sd] of [[23.9, 1, 21 * 31 + Math.round(-7.0 * 7)], [25.0, 3, 22 * 31 + Math.round(-21.5 * 7)], [26.1, 0, 22 * 31 + Math.round(-15.2 * 7)], [27.2, 1, 23 * 31 + Math.round(-23.0 * 7)]]) pot(g, -21.4, y, 0, k, sd); }, { name: 'pots' });
  T.obj([-21.2, 22.4, -19.6, 29.6], (g) => cycle(g, -20.4, 26.0, Math.PI / 2, '#2F343B'), { name: 'bike' });


  /* ---------------- between the lanes ---------------- */
  // the tobacco-and-sweets shop facing the playground: its window, the red sign, a row of vending machines
  const FT = FR('R', 4.6);
  T.obj([-5.4, 2, 4.6, 10.4], function (g) {
    const u0 = -10.4, u1 = -2;
    FT.box(g, u0, u1, -10, 0, 0, 6.4, { t: '#D9CDB5', l: '#EFE6D2', r: '#D9CEB8' }, { w: 0.9 });
    g.fill(FT.on(u1 - 4.0, u1 - 0.5, 1.6, 4.8, 0.03), SHOP);   // the window (its frame: below)
    const R = RNG(81); for (let i = 0; i < 6; i++) { const c = FT.p(g, u1 - 3.6 + (i % 3) * 1.1, 0.06, 2.0 + Math.floor(i / 3) * 1.3); g.fill2([[c[0] - 0.4, c[1]], [c[0] + 0.4, c[1]], [c[0] + 0.4, c[1] - 0.9], [c[0] - 0.4, c[1] - 0.9]], R.pick(['#E05A4A', '#5F8FC9', '#F3E36A', '#F6F3EA', '#8FBF73']), true); }
    glassDoor(g, FT, u0 + 0.5, u1 - 4.6, 0, 5.6, { n: 2, col: WIN });
    for (let i = 0; i < 4; i++) { const c = FT.p(g, u0 + 1.2 + i * 1.3, 0.1, 1.2); g.disc2([c[0], c[1] - 1.0], 1.0, 'rgba(220,235,240,0.9)'); g.disc2([c[0], c[1] - 0.8], 0.55, R.pick(['#E58BB0', '#F3E36A', '#E08A3C', '#8FBF73'])); }   // sweets jars
    FT.sign(g, u1 - 4.0, u1 - 0.5, 5.0, 6.2, '#C9463E', { word: 'タバコ', ink: '#FBF8EE' });
    kawara(g, FT, u0, u1, 10, 6.4, 3.0, '#8A5A44', { end: '#EFE6D2' });
    { const c = FT.w(-6.2, -5, 9.4); K.box(g, c[0] - 0.15, c[1] - 3.4, c[0] + 0.15, c[1] + 3.4, 8.2, 10.4, '#F3EEE0', { w: 0.45, boil: false }); g.mark({ nc: true }); TK.word(g, 'R', c[0] + 0.15, c[1], 9.3, 1.4, 'だんご', '#C9463E'); }
    if (TK.summer()) TK.kooriFlag2(g, g.p(5.2, 9.2, 6.2), 3.6, 4.4);
    aerial(g, -1, 6, 7.4, 3.4);
  }, { name: 'tabako' });
  // its window's frame, on the wall's face: in front of the grandmother sitting inside at the window, leaning on the sill
  T.obj([4.55, 2.2, 4.75, 6.3], (g) => g.outline(FT.on(-6.0, -2.5, 1.6, 4.8, 0.03), { w: 0.5, boil: false }), { name: 'tabako window' });
  T.obj([4.7, -2.4, 6.5, 1.9], function (g) {                           // its row of vending machines on the corner, facing the playground
    for (const [i, y] of [-1.4, 0.8].entries()) vend(g, 5.5, y, 'R', ['#F1EFE8', '#3F6FA8'][i], ['#C9463E', '#F3F1EA'][i]);
  }, { name: 'vending' });
  T.obj([4.6, 5.2, 6.6, 10.2], function (g) { const c = g.p(5.4, 9.0, 0); g.fill2([[c[0] - 1.2, c[1]], [c[0] + 1.2, c[1]], [c[0] + 1.0, c[1] - 2.4], [c[0] - 1.0, c[1] - 2.4]], '#3F6FA8', true); g.disc2([c[0], c[1] - 2.0], 0.4, '#F6F3EA'); K.bench(g, 5.0, 6.6, { L: 1.2, col: '#C9463E' }); }, { name: 'bench' });   // a recycling bin, a red bench
  // pots along the tobacco shop's side, and round the shrine's fence
  T.obj([-4.8, 10.5, 4.2, 11.4], (g) => { for (let i = 0; i < 6; i++) pot(g, -4.2 + i * 1.6, 10.9, 0, i % 5, 6100 + i); }, { name: 'pots' });
  T.obj([-14.2, 20.8, -12.4, 27.6], (g) => { for (let i = 0; i < 4; i++) pot(g, -13.3, 21.4 + i * 1.9, 0, (i + 1) % 4, 6300 + i); }, { name: 'pots' });
  // the coin car park: a white kei truck and a car, the yellow sign
  T.obj([-13.4, -1.8, -9.2, 9.2], (g) => g.at(-11.3, 3.8, 0, (g2) => TK.kei(g2, Math.PI / 2, { col: '#F1EFE8', cargo: (gg, B) => { for (let k = 0; k < 2; k++) { const p = B.pt(-1.0 + k * 1.6, 0, 2.0); K.rbox(gg, p[0], p[1], 0.7, 0.9, Math.atan2(B.sa, B.ca), 2.0, 2.9, '#B9A27D', { w: 0.35 }); } } })), { name: 'kei truck' });
  T.obj([-7.8, 9.8, -7.0, 10.6], (g) => { const p = g.p(-7.4, 10.2, 0), t = g.p(-7.4, 10.2, 5.4); g.line2([p, t], { w: 0.6, c: '#8C8576', boil: false }); g.disc2([t[0], t[1] - 1.6], 2.2, '#3F6FA8'); g.ring2([t[0], t[1] - 1.6], 2.2, { w: 0.4, c: '#F3F1EA' }); K.textP(g, (a, z) => [-7.4 + a * 0.7, 10.3 - a * 0.7, z], 0, 5.6, 1.6, 'P', '#FBF8EE', { center: true }); }, { name: 'parking sign' });
  T.obj([-13.4, -1.6], (g) => { K.cyl(g, -13.4, -1.6, 0.8, 0, 3.6, { t: '#C9463E', l: '#D4553A', r: '#B9432C' }, { w: 0.55, n: 8 }); K.cyl(g, -13.4, -1.6, 0.95, 3.6, 4.1, { t: '#B9432C', l: '#C9463E', r: '#A8382F' }, { w: 0.5, n: 8 }); const s = g.p(-13.4 + 0.57, -1.6 + 0.57, 2.8); g.line2([[s[0] - 0.9, s[1]], [s[0] + 0.9, s[1]]], { w: 0.5, c: '#3A3530', boil: false }); }, { name: 'post box' });
  T.obj([-14.6, 30.0], (g) => { const p = g.p(-14.6, 30.0, 0), t = g.p(-14.6, 30.0, 4.6); g.line2([p, t], { w: 0.5, c: '#8C8576', boil: false }); g.fill2([[t[0] - 1.1, t[1]], [t[0] + 1.1, t[1]], [t[0] + 1.1, t[1] + 4.4], [t[0] - 1.1, t[1] + 4.4]], '#C9463E', true); g.mark({ nc: true }); g.outline2([[t[0] - 1.1, t[1]], [t[0] + 1.1, t[1]], [t[0] + 1.1, t[1] + 4.4], [t[0] - 1.1, t[1] + 4.4]], { w: 0.35, c: '#7A2A20', boil: false }); }, { name: 'extinguisher' });
  // the block wall along the grove, where the cat walks
  T.obj([-14.6, 11.6, -5.6, 12.6], (g) => { K.box(g, -14.6, 11.6, -5.6, 12.6, 0, 2.2, { t: '#D7D2C6', l: '#C9C3B6', r: '#B9B3A6' }, { w: 0.6 }); const P = []; for (let x = -14.6; x < -5.6; x += 1.6) P.push([[x, 12.62, 0], [x, 12.62, 2.2]]); P.push([[-14.6, 12.62, 1.1], [-5.6, 12.62, 1.1]]); segs(g, P, '#A9A296', 0.25); }, { name: 'wall' });
  // the grove
  T.obj([-1.0, 17.4], (g) => K.tree(g, -1.0, 17.4, TK.leaves({ r: 3.2, h: 5.2, col: '#6E9A50', ink: '#3C5A30' }, 'zelkova', 1)), { on: true });
  T.obj([3.4, 13.4], (g) => TK.sakura(g, 3.4, 13.4, { r: 3.4 }), { on: true });
  T.obj([-12.8, 17.0], (g) => TK.garden(g, -12.8, 17.0, { r: 2.4, h: 3.8 }), { on: true });   // a persimmon by the wall
  for (const [x, y] of [[-8.6, 18.4], [-4.6, 13.8], [1.6, 18.8]]) T.obj([x, y], (g) => K.bush(g, x, y, { r: 1.5, col: '#6E9A50' }), { on: true });

  // the Inari shrine: a small hall under a copper roof, foxes, red banners, rows of red torii
  T.obj([-10.4, 20.8, 0.4, 28.2], function (g) {
    K.box(g, -10.4, 20.8, 0.4, 28.2, 0, 1.2, { t: '#D7D2C6', l: '#C9C3B6', r: '#B9B3A6' }, { w: 0.6 });
    const sb = []; for (let x = -9.6; x < 0.4; x += 1.4) sb.push([[x, 28.22, 0], [x, 28.22, 1.2]]); segs(g, sb, '#A9A296', 0.25);
    K.box(g, -9.4, 21.4, -0.6, 26.4, 1.2, 6.8, { t: '#C9A26B', l: '#F1E9D6', r: '#E0D4BC' }, { w: 0.75 });
    const P = []; for (const x of [-9.3, -6.4, -3.6, -0.7]) P.push([[x, 26.45, 1.2], [x, 26.45, 6.8]]); P.push([[-9.4, 26.45, 6.2], [-0.6, 26.45, 6.2]], [[-9.4, 26.45, 1.6], [-0.6, 26.45, 1.6]]); segs(g, P, '#D4553A', 1.0);
    { const P2 = []; for (const y of [21.5, 24.0, 26.3]) P2.push([[-0.55, y, 1.2], [-0.55, y, 6.8]]); P2.push([[-0.55, 21.4, 6.2], [-0.55, 26.4, 6.2]], [[-0.55, 21.4, 1.6], [-0.55, 26.4, 1.6]]); segs(g, P2, '#D4553A', 1.0); const w2 = K.on('R', -0.58, 22.2, 23.4, 3.0, 5.0); g.fill(w2, '#3A2A24'); const l2 = []; for (let y = 22.4; y < 23.4; y += 0.3) l2.push([[-0.55, y, 3.0], [-0.55, y, 5.0]]); segs(g, l2, '#C9463E', 0.3); }
    for (const [a, b] of [[-6.2, -3.8]]) { const q = K.on('L', 26.46, a, b, 1.7, 5.9); g.fill(q, '#3A2A24'); const lat = []; for (let x = a + 0.25; x < b; x += 0.3) lat.push([[x, 26.5, 1.7], [x, 26.5, 5.9]]); for (let z = 2.2; z < 5.9; z += 0.6) lat.push([[a, 26.5, z], [b, 26.5, z]]); segs(g, lat, '#C9463E', 0.32); }
    K.box(g, -6.6, 26.4, -3.4, 27.6, 1.2, 1.7, '#9A7656', { w: 0.4, boil: false });              // the step
    K.box(g, -6.2, 27.2, -3.8, 28.0, 1.7, 3.0, '#8A6A50', { w: 0.4, boil: false });              // the offering box
    { const q = K.on('L', 28.02, -6.2, -3.8, 2.4, 2.9); const P2 = []; for (let x = -6.0; x < -3.8; x += 0.3) P2.push([[x, 28.03, 2.0], [x, 28.03, 2.9]]); segs(g, P2, '#3A2A24', 0.3); void q; }
    kawara(g, FR('L', 26.4), -9.4, -0.6, 5.0, 6.8, 3.4, '#5F9A86', { ov: 2.2, end: '#F1E9D6' });
    const bell = g.p(-5, 27.6, 6.6); g.line2([[bell[0], bell[1] - 1], [bell[0], bell[1] + 5.6]], { w: 0.5, c: '#D4553A', boil: false }); g.disc2([bell[0], bell[1] + 0.5], 0.9, '#C9A23A'); g.ring2([bell[0], bell[1] + 0.5], 0.9, { w: 0.3, c: '#7A5A20' });
    { const a = g.p(-9.0, 28.0, 6.2), b = g.p(-1.0, 28.0, 6.2), P3 = []; for (let i = 0; i <= 10; i++) { const t = i / 10; P3.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t) + Math.sin(Math.PI * t) * 1.6]); } g.line2(P3, { w: 1.1, c: '#D9C68A', boil: false }); for (const t of [0.3, 0.5, 0.7]) { const c = [lerp(a[0], b[0], t), lerp(a[1], b[1], t) + Math.sin(Math.PI * t) * 1.6]; g.fill2([[c[0] - 0.4, c[1]], [c[0] + 0.4, c[1]], [c[0] + 0.1, c[1] + 1.0], [c[0] + 0.5, c[1] + 1.0], [c[0], c[1] + 2.4], [c[0] - 0.4, c[1] + 1.6]], '#FBFAF6', true); } }
  }, { name: 'shrine' });
  T.obj([-8.4, 34.6, -1.6, 35.6], (g) => TK.torii(g, -5, 35.1, { w: 6.0, h: 8.2, axis: 'x', r: 0.34 }), { name: 'torii' });
  for (const [x, s] of [[-9.6, 1], [-0.4, -1]]) T.obj([x - 0.8, 28.0, x + 0.8, 29.6], function (g) {   // the foxes, with red bibs
    K.box(g, x - 0.8, 28.0, x + 0.8, 29.6, 0, 1.6, { t: '#E0DCD2', l: '#D3CEC2', r: '#BDB8AC' }, { w: 0.45, boil: false });
    const c = g.p(x, 28.8, 1.6), P = (u, v) => [c[0] + s * u, c[1] + v];
    const body = K.curve([P(-1.4, 0), P(-1.2, -3.0), P(-0.2, -4.6), P(0.8, -4.0), P(1.2, -1.6), P(1.4, 0)], 2, true); g.fill2(body, '#F1EFE8', true); g.line2(body, { w: 0.35, c: INK, close: true, boil: false });
    const hd = [P(-0.6, -4.2), P(0.2, -6.0), P(0.6, -7.2), P(0.9, -6.0), P(1.6, -5.4), P(0.9, -4.4)]; g.fill2(hd, '#F1EFE8', true); g.line2(hd, { w: 0.35, c: INK, close: true, boil: false });
    g.fill2([P(-0.9, -4.3), P(1.1, -4.3), P(0.1, -2.8)], '#D4553A', true);
    g.line2([P(-1.4, -0.4), P(-2.6, -2.4), P(-2.2, -4.4)], { w: 0.9, c: '#F1EFE8', boil: false }); g.disc2(P(1.0, -5.6), 0.2, INK);
  }, { name: 'fox' });
  for (const x of [-11.0, 1.0]) T.obj([x - 0.6, 30.6, x + 0.6, 31.8], (g) => { K.box(g, x - 0.5, 30.7, x + 0.5, 31.7, 0, 2.4, '#D7D2C6', { w: 0.4, boil: false }); K.box(g, x - 0.9, 30.3, x + 0.9, 32.1, 2.4, 3.6, '#E0DCD2', { w: 0.45, boil: false }); g.lit({ nc: '#FFD98A', light: true }, () => g.fill(K.on('L', 32.12, x - 0.5, x + 0.5, 2.6, 3.4), '#F3E3B0')); K.cone(g, x, 31.2, 1.6, 3.6, 1.5, '#D3CEC2'); }, { name: 'lantern' });
  T.obj([-13.4, 22, -12.2, 34], function (g) {                         // red banners down the side of the path
    for (let y = 22.6; y < 34; y += 2.9) { const b = g.p(-12.8, y, 0), t = g.p(-12.8, y, 6.6); g.line2([b, t], { w: 0.45, c: '#6B4E36', boil: false }); const q = [[-12.8, y + 0.15, 6.2], [-12.8, y + 1.6, 6.2], [-12.8, y + 1.6, 1.8], [-12.8, y + 0.15, 1.8]]; g.fill(q, '#D4553A'); g.mark({ nc: (c) => mix(nightColour(c), c, 0.35) }); g.fill([[-12.8, y + 0.15, 6.2], [-12.8, y + 1.6, 6.2], [-12.8, y + 1.6, 5.6], [-12.8, y + 0.15, 5.6]], '#F3EEE2'); g.outline(q, { w: 0.35, c: '#8A2A20', boil: false }); }
  }, { name: 'nobori' });
  T.obj([-14.4, 19.8, 4.4, 20.6], (g) => { const P = []; for (let x = -14.2; x < 4.4; x += 1.2) P.push([[x, 20.2, 0], [x, 20.2, 1.8]]); P.push([[-14.4, 20.2, 1.6], [4.4, 20.2, 1.6]], [[-14.4, 20.2, 0.6], [4.4, 20.2, 0.6]]); segs(g, P, '#C9463E', 0.45); }, { name: 'fence' });

  /* ---------------- the playground ---------------- */
  // its pipe fence, with gaps for the gates
  T.obj([8, -2.6, 36.6, -2.0], (g) => { const P = []; for (const [a, b] of [[8, 11], [16, 36.6]]) { for (let x = a; x <= b; x += 1.5) P.push([[x, -2.3, 0], [x, -2.3, 1.6]]); P.push([[a, -2.3, 1.6], [b, -2.3, 1.6]], [[a, -2.3, 0.8], [b, -2.3, 0.8]]); } segs(g, P, '#5E9A6E', 0.45); }, { name: 'fence' });
  T.obj([7.6, -2.6, 8.4, 36.6], (g) => { const P = []; for (const [a, b] of [[-2.3, 27], [32, 36.6]]) { for (let y = a; y <= b; y += 1.5) P.push([[8, y, 0], [8, y, 1.6]]); P.push([[8, a, 1.6], [8, b, 1.6]], [[8, a, 0.8], [8, b, 0.8]]); } segs(g, P, '#5E9A6E', 0.45); }, { name: 'fence' });
  // the slide: a ladder up the front of the tower, a platform, the chute down to the sand
  T.obj([9.6, 3.6, 20.4, 7.0], function (g) {
    K.box(g, 9.8, 3.6, 12.6, 6.4, 0, 5.2, { t: '#E6C24F', l: '#E05A4A', r: '#C9463E' }, { w: 0.6 });
    const rl = []; for (const [x, y] of [[9.8, 3.6], [12.6, 3.6], [9.8, 6.4]]) rl.push([[x, y, 5.2], [x, y, 7.4]]); rl.push([[9.8, 3.6, 7.4], [12.6, 3.6, 7.4]], [[9.8, 3.6, 7.4], [9.8, 6.4, 7.4]]); segs(g, rl, '#3F6FA8', 0.6);
    const ch = [[12.6, 4.1, 5.2], [12.6, 5.9, 5.2], [20.2, 5.9, 0.4], [20.2, 4.1, 0.4]]; g.fill(ch, '#5FA8D9'); g.outline(ch, { w: 0.6, boil: false });
    const ld = []; for (const x of [10.4, 12.0]) ld.push([[x, 6.9, 0], [x, 6.9, 5.4]]); for (let z = 0.9; z < 5.4; z += 1.0) ld.push([[10.4, 6.9, z], [12.0, 6.9, z]]); segs(g, ld, '#3F6FA8', 0.55);
  }, { name: 'slide' });
  // the chute's near side, in front of the child sliding down it
  T.obj([12.6, 5.85, 20.4, 5.95], (g) => { g.fill([[12.6, 5.9, 5.2], [20.2, 5.9, 0.4], [20.2, 5.9, 1.1], [12.6, 5.9, 5.9]], '#3F8FC9'); g.line([[12.6, 5.9, 5.9], [20.2, 5.9, 1.1]], { w: 0.5, boil: false }); }, { name: 'slide' });
  // the swing frame (the swings are actors)
  for (const x of [23, 35]) T.obj([x - 0.4, 4.2, x + 0.4, 7.8], (g) => { const P = []; for (const y of [4.2, 7.8]) P.push([[x, y, 0], [x, 6, 10.6]]); segs(g, P, '#C9463E', 0.9); }, { name: 'swings' });
  T.obj([23, 5.8, 35, 6.2], (g) => g.line([[23, 6, 10.6], [35, 6, 10.6]], { w: 1.0, c: '#C9463E', boil: false }), { name: 'swings' });
  // the panda's spring
  T.obj([12, 13.2], (g) => { const p = g.p(12, 13.2, 0); g.fill2([[p[0] - 1.6, p[1] + 0.6], [p[0] + 1.6, p[1] + 0.6], [p[0] + 1.6, p[1] - 0.2], [p[0] - 1.6, p[1] - 0.2]], '#8C8576', true); const S = []; for (let i = 0; i < 6; i++) S.push(p[0] - 1.0, p[1] - i * 0.55, p[0] + 1.0, p[1] - i * 0.55 - 0.3); g.segs2(S, '#5A564E', 0.45); }, { name: 'spring', on: true });
  // the sandpit's wooden edge
  T.ground((g) => { for (const q of [K.rect(19.5, 13, 29.5, 13.6), K.rect(19.5, 13, 20.1, 21)]) { g.fill(q, '#C9A26B'); g.outline(q, { w: 0.4, c: '#8A6A50', boil: false }); } });
  T.obj([19.5, 20.4, 29.5, 21], (g) => K.box(g, 19.5, 20.4, 29.5, 21, 0, 0.6, '#C9A26B', { w: 0.4, boil: false }), { name: 'sand edge' });
  T.obj([28.9, 13, 29.5, 20.4], (g) => K.box(g, 28.9, 13, 29.5, 20.4, 0, 0.6, '#C9A26B', { w: 0.4, boil: false }), { name: 'sand edge' });
  for (let y = 4; y < 22; y += 2.6) T.obj([35.8, y], (g) => K.bush(g, 35.8, y, { r: 1.2, col: '#7FA65A' }), { on: true });
  for (let x = 13; x < 34; x += 2.6) T.obj([x, 35.8], (g) => K.bush(g, x, 35.8, { r: 1.2, col: '#7FA65A' }), { on: true });
  // the climbing frame: a lattice of coloured pipes
  // (three objects: the body, then its near face along y = 27 and its near face along x = 16, so the bars on those faces
  // come in front of the child sitting on top)
  const lattice = (g, part) => {
    const cols = ['#E05A4A', '#E6C24F', '#5FA8D9', '#8FBF73'], by = cols.map(() => []), pick = (i, j) => part === 'y' ? j === 3 : part === 'x' ? i === 3 && j < 3 : i < 3 && j < 3;
    for (let i = 0; i <= 3; i++) for (let j = 0; j <= 3; j++) { const x = 10 + i * 2, y = 21 + j * 2; if (pick(i, j)) by[(i + j) % 4].push([[x, y, 0], [x, y, 6]]); }
    for (const z of [2, 4, 6]) for (let k = 0; k <= 3; k++) { if (part === 'y' ? k === 3 : part === 'x' ? false : k < 3) by[k % 4].push([[10, 21 + k * 2, z], [16, 21 + k * 2, z]]); if (part === 'x' ? k === 3 : part === 'y' ? false : k < 3) by[(k + 2) % 4].push([[10 + k * 2, 21, z], [10 + k * 2, 27, z]]); }
    by.forEach((P, i) => { if (P.length) segs(g, P, cols[i], 0.55); });
  };
  T.obj([10, 21, 15.9, 26.9], (g) => lattice(g, ''), { name: 'climbing frame' });
  T.obj([15.9, 21, 16.1, 27.1], (g) => lattice(g, 'x'), { name: 'climbing frame' });   // (6.1 deep: a box, not a small prop)
  T.obj([10, 26.9, 16.1, 27.1], (g) => lattice(g, 'y'), { name: 'climbing frame' });
  // benches along the top fence, a clock on a pole, the drinking fountain, the playground's trees
  for (const y of [17.5, 23.5]) T.obj([8.6, y - 2.8, 10.4, y + 2.8], (g) => K.bench(g, 8.8, y, { L: 2.6, col: '#B58F58' }), { name: 'bench' });
  T.obj([27.7, -1.8, 33.3, -0.2], (g) => K.bench(g, 30.5, -1.8, { face: 'L', L: 2.6, col: '#B58F58' }), { name: 'bench' });
  T.obj([35.6, 14], (g) => { const p = g.p(35.6, 14, 0), t = g.p(35.6, 14, 10); g.line2([p, t], { w: 0.7, c: '#8C8576', boil: false }); g.disc2([t[0], t[1] - 1.8], 2.1, '#F6F3EA'); g.ring2([t[0], t[1] - 1.8], 2.1, { w: 0.5, c: '#3A3530' }); g.segs2([t[0], t[1] - 1.8, t[0], t[1] - 3.2, t[0], t[1] - 1.8, t[0] + 1.0, t[1] - 1.4], '#3A3530', 0.35); }, { name: 'clock' });
  T.obj([9.4, 15.4], (g) => { const p = g.p(9.4, 15.4, 0); g.fill2([[p[0] - 0.8, p[1]], [p[0] + 0.8, p[1]], [p[0] + 0.8, p[1] - 3.2], [p[0] - 0.8, p[1] - 3.2]], '#C9C6BD', true); g.fill2([[p[0] - 1.6, p[1] - 3.2], [p[0] + 1.6, p[1] - 3.2], [p[0] + 1.2, p[1] - 4.0], [p[0] - 1.2, p[1] - 4.0]], '#9FA39E', true); }, { name: 'fountain' });
  T.obj([10.2, 33.8], (g) => TK.sakura(g, 10.2, 33.8, { r: 3.6 }), { on: true });
  T.obj([35.6, 25.5], (g) => K.tree(g, 35.6, 25.5, TK.leaves({ r: 3.4, h: 6, col: '#7FAE5E', ink: '#4B6B36' }, 'ginkgo')), { on: true });
  T.cast([18, 31], (g) => TK.snowman(g, 18, 31, 0.8), { on: true, season: 'winter' });
  for (const [x, y] of [[8.6, 30.0], [35.0, 11.8]]) T.obj([x, y], (g) => K.lamp(g, x, y, { h: 9.5 }), { name: 'lamp' });

  // utility poles along the lanes, their wires running to the next
  // (each span of wires is an object of its own, { noHide }: its box is the whole span, much bigger than what it covers)
  const PA = [-30, -12, 6, 24], armA = (x) => [[x, -4.2, 12.7], [x, -1.0, 12.7], [x, -3.7, 11.2], [x, -1.5, 11.2]];   // = TK.upole's arms
  PA.forEach((x, i) => {
    T.obj([x, -2.6], (g) => TK.upole(g, x, -2.6, { h: 13.5, across: 'y', band: i === 1 }), { name: 'pole' });
    const x1 = i + 1 < PA.length ? PA[i + 1] : 36.8;
    T.obj([x, -4.2, x1, -1.0], (g) => { if (i + 1 < PA.length) TK.wires(g, armA(x), [[x1, -4.2, 12.7], [x1, -1.0, 12.7], [x1, -3.7, 11.2], [x1, -1.5, 11.2]], 1.4); else TK.wires(g, armA(x), [[36.8, -4.2, 12.4], [36.8, -1.0, 12.4], [36.8, -3.7, 11], [36.8, -1.5, 11]], 0.8); }, { name: 'wires', noHide: true });
  });
  const PB = [8, 26], armB = (y) => [[-16, y, 12.7], [-12.8, y, 12.7], [-15.5, y, 11.2], [-13.3, y, 11.2]];
  PB.forEach((y, i) => {
    T.obj([-14.4, y], (g) => TK.upole(g, -14.4, y, { h: 13.5, across: 'x', band: i === 0 }), { name: 'pole' });
    const to = i + 1 < PB.length ? PB[i + 1] : 36.8;
    T.obj([-16, y, -12.8, to], (g) => TK.wires(g, armB(y), [[-16, to, 12.7], [-12.8, to, 12.7], [-15.5, to, 11.2], [-13.3, to, 11.2]], 1.2), { name: 'wires', noHide: true });
    if (i === 0) T.obj([-16, -4.2, -10.4, y], (g) => TK.wires(g, armB(y).slice(0, 2), [[-13.6, -4.2, 12.7], [-10.4, -1.0, 12.7]], 0.8), { name: 'wires', noHide: true });
  });

  /* ---------------- the living layer ---------------- */
  // the bamboo fence of the grandmother's garden, a neighbour chatting over it while the grandfather waters the bonsai.
  // The fence is an object on its line (y -9.6); the grandfather (in the garden, behind it) and the neighbour (on the
  // lane, in front of it) are an actor each, on one clock
  {
    const gp = TK.who(1601, { hair: '#8E8A84', top: '#B9A27D', bot: '#6B7B8C', glasses: true, hairStyle: 'buzz', build: 0.3 }), nb = TK.who(1602, { hair: '#4A3A34', top: '#D98AA4', bot: '#6C7A89', hairStyle: 'bun', dress: undefined });
    const P = 16, clock = (t) => { const u = ((t % P) + P) % P; let a, i; if (u < 6 || u >= 12.5) { a = 'water'; i = Math.floor(u * 3) % 2; } else if (u < 10.5) { a = 'chat'; i = Math.floor(u * 2.6) % 4; } else { a = 'laugh'; i = Math.floor(u * 5) % 2; } return { key: a + i, a, i }; };
    T.obj([-27.6, -9.7, -23.2, -9.5], (g) => { const Y = -9.6, P2 = []; for (let x = -27.4; x <= -23.4; x += 1.0) P2.push([[x, Y, 0], [x, Y, 3.0]]); for (const z of [0.9, 1.9, 2.8]) P2.push([[-27.6, Y, z], [-23.2, Y, z]]); segs(g, P2, '#C9B07A', 0.55); const t = []; for (let x = -27.4; x <= -23.4; x += 1.0) for (const z of [1.9, 2.8]) { const c = g.p(x, Y + 0.05, z); t.push(c[0] - 0.3, c[1] - 0.2, c[0] + 0.3, c[1] + 0.2); } g.segs2(t, '#2A2622', 0.3); }, { name: 'fence', cast: true, bias: 0.85 });   // (a small prop: by centre + bias it is in front of the grandfather, x + y -34.3, and behind the neighbour, -34.0)
    const can = (g, h, s) => { g.fill2([[h[0] - 0.2 * s, h[1] + 0.2], [h[0] + 1.6 * s, h[1] + 0.2], [h[0] + 1.6 * s, h[1] + 1.8], [h[0] - 0.2 * s, h[1] + 1.8]], '#5E9A6E', true); g.line2([[h[0] + 1.6 * s, h[1] + 0.8], [h[0] + 3.4 * s, h[1] - 0.6]], { w: 0.45, c: '#5E9A6E', boil: false }); return [h[0] + 3.4 * s, h[1] - 0.6]; };
    T.actor({ sample: 0.25, period: P, r: 14,                   // the grandfather, just past the end of the bonsai shelf
      at(t) { return Object.assign({ x: -23.6, y: -10.7 }, clock(t)); },
      draw(g, st) {
        if (st.a === 'water') { const r = TK.person(g, 0, 0, 0, Object.assign({}, gp, { dir: 2, hands: [[2.6, -10.6], [3.4, -11.2]] })); const sp = can(g, r.hands[0], -1); const W = []; for (let k = 0; k <= 5; k++) { const u = k / 5; W.push([sp[0] - u * 3.4, sp[1] + u * u * 6 - u * 0.6]); } g.line2(W, { w: 0.4, c: '#7FB7D9', boil: false }); for (let k = 0; k < 3; k++) { const u = (st.i * 0.5 + k / 3) % 1; g.disc2([sp[0] - 3.4 - u * 0.4, sp[1] + 5.4 + u * 2.0], 0.3, '#A9CDE6'); } }
        else { const r = TK.doing(g, Object.assign({}, gp, { dir: 1 }), st.a === 'laugh' ? 'laugh' : 'listen', st.a === 'laugh' ? st.i : 1, 0, 0, 0); can(g, r.hands[0], 1); }
      } });
    T.actor({ sample: 0.25, period: P, r: 12,                   // the neighbour, on the lane side of the fence
      at(t) { return Object.assign({ x: -26.0, y: -8.0 }, clock(t)); },
      draw(g, st) { TK.doing(g, Object.assign({}, nb, { dir: 0 }), st.a === 'chat' ? 'talk' : st.a === 'laugh' ? 'laugh' : 'listen', st.a === 'water' ? 0 : st.i, 0, 0, st.a === 'laugh' && st.i ? 0.3 : 0); } });
  }
  // the futon beater on the grandmother's balcony, behind its rail and the futon
  T.actor({ sample: 0.25, period: 9, at(t) { const u = ((t % 9) + 9) % 9, f = u < 6 ? Math.floor(u * 4) % 3 : 3; return { x: -24.9, y: FY + 0.45, z: GF - 0.8, key: f, f }; },   // (drawn without legs: low enough that her hips are behind the futon over the rail)
    draw(g, st) { const who = TK.who(1620, { dir: 1, top: '#E7A9A0', hairStyle: 'bun', noLegs: true, hair: '#3A2A24' }); if (st.f === 3) { TK.doing(g, who, 'look', 1, 0, 0, 0); return; } const r = TK.person(g, 0, 0, 0, Object.assign(who, { hands: [[3.4, -16.8 + st.f * 2.0], [2.6, -15.6 + st.f * 1.6]] })); const h = r.hands[0], e = [h[0] + 3.2 - st.f * 0.6, h[1] - 2.2 + st.f * 2.4]; g.line2([h, e], { w: 0.5, c: '#B58F58', boil: false }); g.ring2(e, 1.0, { w: 0.4, c: '#B58F58' }); } });
  // the kissaten's owner sweeping her step, now and then looking up and down the lane
  T.actor({ sample: 0.25, period: 11, at(t) { const u = ((t % 11) + 11) % 11; if (u < 7) { const i = Math.floor(u * 1.6) % 2; return { x: 3.6, y: -9.4, key: 's' + i, a: 'sweep', i }; } return { x: 3.6, y: -9.4, key: 'l' + (u < 9 ? 0 : 1), a: 'look', i: u < 9 ? 0 : 1 }; },
    draw(g, st) { const who = TK.who(1621, { dir: 2, top: '#F3EEE0', bot: '#5A3A2A', hairStyle: 'bun', hair: '#B9B3A6', glasses: true, build: 0.2 }), r = TK.doing(g, Object.assign({}, who, { lookTo: 3 }), st.a, st.i, 0, 0, 0); const hs = r.hands.slice().sort((a, b) => a[1] - b[1]), d = [hs[1][0] - hs[0][0], hs[1][1] - hs[0][1]], f = g.p(0, 0, 0), k = (f[1] + 0.4 - hs[0][1]) / (d[1] || 1), e = [hs[0][0] + d[0] * k, f[1] + 0.4]; if (st.a !== 'sweep') { const b0 = [hs[0][0] + 0.6, hs[0][1] - 1], b1 = [b0[0] + 0.3, f[1]]; g.line2([b0, b1], { w: 0.5, c: '#8A6A40', boil: false }); g.fill2([[b1[0] - 1.0, b1[1]], [b1[0] + 1.0, b1[1]], [b1[0] + 0.4, b1[1] - 1.6], [b1[0] - 0.4, b1[1] - 1.6]], '#D9B547', true); return; } g.line2([hs[0], e], { w: 0.5, c: '#8A6A40', boil: false }); const s = Math.sign(d[0]) || 1; g.fill2([[e[0] - 1.6 * s, e[1] + 0.2], [e[0] + 1.2 * s, e[1] + 0.2], [e[0] + 0.3 * s, e[1] - 1.6], [e[0] - 0.4 * s, e[1] - 1.6]], '#D9B547', true); if (st.i) for (let k2 = 0; k2 < 3; k2++) g.disc2([e[0] + s * (2 + k2 * 0.9), e[1] - 0.3 - k2 * 0.4], 0.35, '#D9CDB5'); } });
  // the mechanic at the bicycle shop: kneeling on the kerb in front of his shop, turning the pedal of a bike on its stand,
  // the wheel spinning; he and the bike are an actor each, on one clock
  const mech = (t) => { const u = ((t % 12) + 12) % 12, f = Math.floor(t * 6) % 4; return { key: (u < 9 ? 'w' : 'l') + f, f, look: u >= 9 }; };
  T.actor({ sample: 0.2, period: 12, r: 14, at(t) { return Object.assign({ x: -21.8, y: 3.0 }, mech(t)); },
    draw(g, st) { const who = TK.who(1622, { top: '#3F5F8F', bot: '#3F4D63', cap: '#3B3F47', hairStyle: 'short' }); TK.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.look ? 1 : 0, pose: 'kneel', hands: st.look ? [[2.4, -8.6], [3.0, -9.0]] : [[3.4 + (st.f % 2) * 0.6, -7.6 + (st.f % 2) * 0.8], [4.6, -8.4]] }));
      const c = g.p(0.3, -2.2, 0); g.fill2([[c[0] - 1.6, c[1]], [c[0] + 1.6, c[1]], [c[0] + 1.6, c[1] - 1.4], [c[0] - 1.6, c[1] - 1.4]], '#C9463E', true); } });   // his tool box
  T.actor({ sample: 0.2, period: 12, r: 14, at(t) { const s = mech(t); return { x: -20.4, y: 3.0, key: s.f, f: s.f, ext: [0.8, 3.7] }; },
    draw(g, st) { cycle(g, 0, 0, Math.PI / 2, '#E6C24F'); const h = g.p(0, 2.2, 1.4), sp = []; for (let k = 0; k < 3; k++) { const a = st.f * 0.5 + k * TAU / 3; sp.push(h[0], h[1], h[0] + Math.cos(a) * 3.0, h[1] + Math.sin(a) * 2.2); } g.segs2(sp, '#9A9384', 0.35); } });
  // the butcher hands a hot croquette over the counter; the schoolgirl eats it there and then; a lady waits her turn
  const BP = 15, bt = (t) => ((t % BP) + BP) % BP;
  T.actor({ sample: 0.25, period: BP, at(t) { const u = bt(t); const s = u < 3 ? ['talk', Math.floor(u * 2.6) % 4] : u < 5 ? ['give', 0] : u < 11 ? ['wrap', Math.floor(u * 2) % 2] : ['wave', Math.floor(u * 4) % 4]; return { x: -13.2, y: FY - 0.9, key: s[0] + s[1], a: s[0], i: s[1] }; },
    draw(g, st) { const who = TK.who(1630, { dir: 1, top: '#F6F3EA', bot: '#F6F3EA', cap: '#F6F3EA', hairStyle: 'buzz' }); if (st.a === 'give') { const r = TK.person(g, 0, 0, 0, Object.assign({}, who, { reach: [4.6, -13.4] })); g.disc2([r.hands[0][0] + 0.4, r.hands[0][1] - 0.4], 0.8, '#C98A4A'); } else if (st.a === 'wrap') TK.person(g, 0, 0, 0, Object.assign({}, who, { hands: [[2.4 + st.i * 0.5, -11.6], [3.4 - st.i * 0.4, -11.4]] })); else TK.doing(g, who, st.a, st.i, 0, 0, 0); } });
  T.actor({ sample: 0.25, period: BP, at(t) { const u = bt(t); const s = u < 3 ? ['point', 0] : u < 4.2 ? ['look', 0] : u < 5.2 ? ['take', 0] : u < 12 ? ['eat', Math.floor(u * 1.4) % 2] : ['laugh', Math.floor(u * 5) % 2]; return { x: -15.4, y: FY + 2.6, key: s[0] + s[1], a: s[0], i: s[1] }; },
    draw(g, st) { const who = TK.pupil(1631, { dir: st.a === 'eat' || st.a === 'laugh' ? 1 : 3, top: '#3F4D63', bot: '#3F4D63', hairStyle: 'pony', randoseru: undefined, food: '#C98A4A' }); if (st.a === 'take') { const r = TK.person(g, 0, 0, 0, Object.assign({}, who, { reach: [3.2, -14.4] })); g.disc2([r.hands[0][0], r.hands[0][1] - 0.4], 0.8, '#C98A4A'); } else TK.doing(g, who, st.a, st.i, 0, 0, 0); } });
  TK.idle(T, TK.who(1632, { dir: 3, top: '#6C7A89', hair: '#8E8A84', hairStyle: 'bun', dress: '#B9A27D' }), -10.6, FY + 2.5, { acts: ['look', 'rest', 'talk', 'look', 'scroll'], seed: 1632 });
  // the bookseller reading on his stool between the carts; a student browsing
  T.actor({ sample: 0.25, period: 14, at(t) { const u = ((t % 14) + 14) % 14, s = u < 9 ? ['read', Math.floor(u / 3) % 2] : u < 11 ? ['look', 1] : ['read', 0]; return { x: -1.0, y: FY + 1.3, key: s[0] + s[1], a: s[0], i: s[1] }; },
    draw(g, st) { const who = TK.who(1633, { dir: 1, sit: true, hair: '#8E8A84', top: '#5A6B5A', bot: '#6B7B8C', glasses: true, hairStyle: 'bald' }); const st0 = g.p(0, 0, 0); g.fill2([[st0[0] - 1.6, st0[1]], [st0[0] + 1.6, st0[1]], [st0[0] + 1.6, st0[1] - 4.2], [st0[0] - 1.6, st0[1] - 4.2]], '#8A6A50', true); if (st.a === 'look') { TK.doing(g, who, 'look', 1, 0, 0, 1.2); return; } const r = TK.person(g, 0, 0, 1.2, Object.assign({}, who, { pose: 'sit', hands: [[2.0, -10.8], [3.2, -11.2]] })); const h = r.hands[0]; g.fill2([[h[0] - 0.4, h[1] - 0.2], [h[0] + 2.4, h[1] - 0.9], [h[0] + 2.4, h[1] - 3.0], [h[0] - 0.4, h[1] - 2.3]], st.i ? '#F3EEE0' : '#E9DCC0', true); g.line2([[h[0] + 1.0, h[1] - 0.6], [h[0] + 1.0, h[1] - 2.7]], { w: 0.25, c: '#8C7A5A', boil: false }); } });
  TK.idle(T, TK.who(1634, { dir: 3, top: '#8FB7D9', bot: '#3F4D63', hairStyle: 'short', glasses: true }), -5.0, FY + 2.6, { acts: ['look', 'point', 'look', 'phone', 'rest'], seed: 1634, lookTo: 3 });
  // the tobacco shop's grandmother at her window, a boy at the vending machine
  TK.idle(T, TK.who(1635, { dir: 0, noLegs: true, hair: '#B9B3A6', top: '#9A6A8A', hairStyle: 'bun', glasses: true }), 4.3, 4.2, { acts: ['rest', 'look', 'talk', 'rest', 'wave'], z: -1.3, seed: 1635, lookTo: 1 });
  TK.idle(T, TK.pupil(1636, { dir: 2, k: 0.74, cap: '#E6C24F', top: '#F3F1EA', bot: '#3F4D63' }), 7.4, -0.4, { acts: ['point', 'look', 'drink', 'drink', 'rest'], seed: 1636 });
  // someone at the shrine: two bows, two claps, a prayer, a last bow
  T.actor({ sample: 0.25, period: 16, at(t) { const u = ((t % 16) + 16) % 16, S = [['bow', 1.2], ['rest', 0.4], ['bow', 1.2], ['clap', 1.4], ['pray', 3.2], ['bow', 1.4], ['look', 3.0], ['rest', 4.2]]; let s = 0, k = 0; while (k < S.length - 1 && u >= s + S[k][1]) { s += S[k][1]; k++; } const A = TK.ACTS[S[k][0]], i = Math.floor((u - s) * A.rate) % A.n; return { x: -5, y: 28.6, key: S[k][0] + i, a: S[k][0], i }; },
    draw(g, st) { TK.doing(g, TK.who(1637, { dir: 3, top: '#2F3A4F', bot: '#2F3A4F', hairStyle: 'short', lookTo: 1 }), st.a, st.i, 0, 0, 0); } });
  TK.pigeons(T, -2.4, 32.4, 4, { seed: 7, r: 1.8 });
  // the cat on the wall
  T.actor({ sample: 0.4, period: 18,
    at(t) { const u = ((t / 18) % 1 + 1) % 1, walk = u < 0.35 || (u > 0.5 && u < 0.85), s = u < 0.35 ? u / 0.35 : u < 0.5 ? 1 : u < 0.85 ? 1 - (u - 0.5) / 0.35 : 0, dir = u < 0.5 ? 1 : -1, f = walk ? Math.floor(t * 6) % 4 : 4; return { x: -14 + s * 7.8, y: 12.1, z: 2.2, key: dir + '.' + f, dir, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), s = st.dir, P = (u, v) => [o[0] + s * u, o[1] + v], sit = st.f === 4;
      if (sit) { g.fill2(K.curve([P(-1.6, 0), P(-1.4, -2.4), P(0.6, -3.0), P(1.4, -1.2), P(1.2, 0)], 2, true), '#E08A3C', true); g.disc2(P(1.0, -3.4), 1.1, '#E08A3C'); g.fill2([P(0.4, -4.2), P(0.7, -5.0), P(1.1, -4.2)], '#E08A3C', true); g.fill2([P(1.3, -4.2), P(1.7, -4.9), P(1.9, -3.9)], '#E08A3C', true); g.line2([P(-1.6, -0.2), P(-2.8, -0.4), P(-3.2, -1.4)], { w: 0.55, c: '#E08A3C', boil: false }); g.disc2(P(1.4, -3.5), 0.16, INK); return; }
      g.fill2([P(-2.4, -1.4), P(1.2, -1.6), P(1.6, -0.4), P(-2.2, -0.2)], '#E08A3C', true); g.disc2(P(2.0, -2.0), 1.1, '#E08A3C'); g.fill2([P(1.4, -2.9), P(1.7, -3.7), P(2.1, -2.9)], '#E08A3C', true); g.fill2([P(2.3, -2.9), P(2.7, -3.6), P(2.9, -2.6)], '#E08A3C', true); const lg = [-1.8, -0.9, 0.4, 1.1].map((u, i) => { const sw = ((st.f + i) % 2) * 0.5; return P(u + sw, -0.3).concat(P(u + sw - 0.2, 0.9)); }).flat(); g.segs2(lg, '#B9622A', 0.5); g.line2([P(-2.4, -1.2), P(-3.6, -3.0), P(-3.2, -3.8)], { w: 0.55, c: '#E08A3C', boil: false }); g.disc2(P(2.4, -2.1), 0.18, INK); } });
  // steam from the sentō chimney (high above everything round it: drawn last, or the people in the tile behind came out
  // over it)
  T.actor({ sample: 5, period: 10, grow: false, layer: 'top',
    at(t) { const f = Math.floor(t * 3) % 8; return { x: 35, y: -30.4, z: 45.2, key: f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0); for (let k = 0; k < 4; k++) { const u = ((st.f / 8) + k / 4) % 1, y = o[1] - 1.5 - u * 16, x = o[0] + u * 13 + Math.sin(u * 4 + k) * 1.5, r = 1.8 + u * 3.4; const pts = []; for (let i = 0; i < 10; i++) { const a = TAU * i / 10, q = 1 + 0.12 * Math.sin(i * 2.3 + k); pts.push([x + Math.cos(a) * r * 1.5 * q, y + Math.sin(a) * r * 0.8 * q]); } g.fill2(pts, mix('#FBFAF7', '#D6D1C6', 0.75 - u * 0.5), true); g.line2(pts.slice(5).concat([pts[0]]), { w: 0.35, c: '#9A9488', boil: false, wob: 0.6 }); } } });

  // along the lanes: children walking home, a salaryman, a bather with his basin, a grandmother with her trolley, a dog walk.
  // Lane A (y -11 .. -3): everyone going +x keeps to the far half (y -7.4 .. -5.9, in front of the shop counters and the
  // sentō porch), everyone going -x to the near half (y -5.6 .. -3.75, behind the poles). Lane B (x -22 .. -15): the kerb
  // by the shops (x < -19.6) is for parked bikes and pots; going down (+y) at x -19.1 .. -18.3, up at -17.9 .. -17.25, and
  // the mother's bicycle both ways at -16.05. No line is used both ways, so nobody meets anybody head-on
  const RA = (y0, y1) => [[35, y0], [-18.7, y0], [-18.7, 35.5], [-17.9, 35.5], [-17.9, y1], [35, y1]];
  for (let i = 0; i < 3; i++) K.walker(T, TK.pupil(1640 + i, { k: 0.74, cap: '#E6C24F', randoseru: i % 2 ? '#C9463E' : '#2E2A26', top: '#F3F1EA', bot: '#3F4D63' }), RA(-5.6 + i * 0.45, -7.4 + i * 0.4), 1.8, { phase: 0.06 + i * 0.025 });
  K.walker(T, TK.salary(1645), [[35, -3.95], [-35, -3.95], [-35, -7.2], [35, -7.2]], 2.4, { phase: 0.4 });
  K.walker(T, TK.who(1646, { top: '#EDE3CF', bot: '#3F4D63', hair: '#8E8A84', hairStyle: 'buzz', dress: '#5E6E8A', hands: [[-1.4, -9.8], [2.6, -12.6]] }), [[22, -4.35], [-19.1, -4.35], [-19.1, 30], [-17.55, 30], [-17.55, -6.25], [22, -6.25]], 1.3, { phase: 0.2 });
  T.actor({ sample: 0.25, period: 60, r: 14,
    at(t) { const L = 2 * 60, d = (((t * 1.2) % L) + L) % L, out = d < 60, s = out ? d : L - d, x = 33 - s, ph = Math.floor((s / 2.4) % 1 * 8); return { x, y: out ? -5.0 : -5.9, key: (out ? 2 : 0) + '.' + ph, dir: out ? 2 : 0, ph: ph / 8 }; },
    draw(g, st) { const who = TK.who(1647, { hair: '#B9B3A6', top: '#5A6B7A', dress: '#6C7A89', hairStyle: 'bun' }), r = TK.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph, hands: [[-1.6, -9.8], [3.6, -9.6]] })); const h = r.hands[1] || r.hands[0], s = st.dir === 0 ? 1 : -1, c = [h[0] + s * 2.2, h[1] + 1.4]; g.fill2([[c[0] - 1.4, c[1] - 3.4], [c[0] + 1.4, c[1] - 3.4], [c[0] + 1.4, c[1] + 1.6], [c[0] - 1.4, c[1] + 1.6]], '#8A3B4E', true); g.line2([h, [c[0], c[1] - 3.4]], { w: 0.4, c: '#3A3530', boil: false }); g.disc2([c[0] - s * 0.8, c[1] + 2.4], 0.7, '#3A3530'); } });
  TK.dogWalk(T, TK.who(1648, { top: '#C9B48F', bot: '#3F4D63' }), [[-18.3, -1], [-18.3, 35], [-17.25, 35], [-17.25, -1]], 1.4, '#C98A4A', { phase: 0.3 });
  // on wheels: the postman's red scooter, a mother with a child seat and leeks in the basket, a high-school boy
  const rideA = (seed, who, col, period, y0, y1, extra) => T.actor({ sample: 0.3, period,
    at(t) { const u = (((t / period) % 1) + 1) % 1, dir = u < 0.5 ? 1 : -1, s = u < 0.5 ? u * 2 : (1 - u) * 2, x = -35 + s * 70, a = Math.min(1, Math.min(s, 1 - s) * 16); return { x, y: dir > 0 ? y0 : y1, key: dir, dir, alpha: a < 1 ? a : null, ext: [4.0, 0.8] }; },
    draw(g, st) { const ang = st.dir > 0 ? 0 : Math.PI; K.bike(g, ang, { col, who }); if (extra) extra(g, ang); } });
  rideA(1650, TK.who(1650, { top: '#3F5F8F', bot: '#3F5F8F', cap: '#3F5F8F' }), '#C9463E', 22, -6.55, -3.75, (g, ang) => { const c = g.p(-2.6 * Math.cos(ang), 0, 2.6); g.fill2([[c[0] - 1.8, c[1] - 1.2], [c[0] + 1.8, c[1] - 1.2], [c[0] + 1.8, c[1] + 1.0], [c[0] - 1.8, c[1] + 1.0]], '#C9463E', true); });
  rideA(1651, TK.who(1651, { top: '#2F343B', bot: '#2F343B', hairStyle: 'short' }), '#3F6FA8', 17, -6.95, -4.0);
  T.actor({ sample: 0.3, period: 26,
    at(t) { const u = (((t / 26) % 1) + 1) % 1, dir = u < 0.5 ? 1 : -1, s = u < 0.5 ? u * 2 : (1 - u) * 2, y = -1 + s * 36.5, a = Math.min(1, (1 - s) * 16); return { x: -16.05, y, key: dir, dir, alpha: a < 1 ? a : null, ext: [0.8, 4.0] }; },
    draw(g, st) { const ang = st.dir > 0 ? Math.PI / 2 : -Math.PI / 2, ca = Math.cos(ang), sa = Math.sin(ang); K.bike(g, ang, { col: '#F1EFE8', who: TK.who(1652, { top: '#E7A9A0', bot: '#3F4D63', hairStyle: 'bob' }) });
      const c = g.p(-2.7 * ca, -2.7 * sa, 3.4); g.fill2([[c[0] - 1.5, c[1] + 0.4], [c[0] + 1.5, c[1] + 0.4], [c[0] + 1.5, c[1] - 1.8], [c[0] - 1.5, c[1] - 1.8]], '#5F8FC9', true); TK.bust2(g, [c[0], c[1] - 0.6], TK.who(1653, { top: '#E6C24F' }), 0.55);
      const b = g.p(2.8 * ca, 2.8 * sa, 3.4); g.fill2([[b[0] - 1.3, b[1] + 0.6], [b[0] + 1.3, b[1] + 0.6], [b[0] + 1.5, b[1] - 1.2], [b[0] - 1.5, b[1] - 1.2]], '#9FA39E', true); g.segs2([b[0] - 0.4, b[1] - 1.0, b[0] - 1.6, b[1] - 4.4, b[0] + 0.3, b[1] - 1.0, b[0] + 0.6, b[1] - 4.6], '#7FAE5E', 0.7); g.segs2([b[0] - 0.4, b[1] - 1.0, b[0] - 0.8, b[1] - 2.2, b[0] + 0.3, b[1] - 1.0, b[0] + 0.4, b[1] - 2.2], '#F6F3EA', 0.75); } });

  // the playground: two on the swings, one up the ladder and down the slide, the see-saw, the panda, the sandpit, the
  // climbing frame, three chasing round the sandpit, mothers on the bench
  [[26, 1.0, 1660, 0], [32, 0.62, 1661, 1.7]].forEach(([x, amp, seed, ph]) => {
    const who = TK.pupil(seed, { k: 0.72, cap: seed % 2 ? '#E6C24F' : undefined, top: seed % 2 ? '#E7A9A0' : '#7FB7D9' });
    T.actor({ sample: 0.2, period: 10, grow: false,
      at(t) { const f = Math.round(Math.sin(t * 2.2 + ph) * 4) + 4; return { x, y: 6, z: 0, key: f, a: (f - 4) / 4 * amp * 0.6 }; },
      draw(g, st) { const L = 8.4, sy = Math.sin(st.a) * L, sz = 10.6 - Math.cos(st.a) * L, ch = []; for (const dx of [-0.9, 0.9]) { const a = g.p(dx, 0, 10.6), b = g.p(dx, sy, sz); ch.push(a[0], a[1], b[0], b[1]); } g.segs2(ch, '#5A564E', 0.32); g.fill([[-1.1, sy - 0.5, sz], [1.1, sy - 0.5, sz], [1.1, sy + 0.5, sz], [-1.1, sy + 0.5, sz]], '#6E5A44'); K.person(g, 0, sy, sz - 1.0, Object.assign({}, who, { dir: 1, pose: 'sit', k: 0.72, hands: [[0.9, -12.4], [1.6, -12.2]] })); } });
  });
  T.actor({ sample: 0.2, period: 9.6, r: 18,
    at(t) { const u = ((t % 9.6) + 9.6) % 9.6; let x, y, z, a, f;
      if (u < 2.4) { const s = u / 2.4; x = 11.2; y = 7.3; z = s * 5.2; a = 'climb'; f = Math.floor(u * 4) % 2; }
      else if (u < 3.2) { x = 11.2 + (u - 2.4) / 0.8 * 1.2; y = 5.0; z = 5.2; a = 'stand'; f = 0; }
      else if (u < 4.8) { const s = (u - 3.2) / 1.6; x = 12.6 + s * s * 7.4; y = 5.0; z = 5.2 - s * s * 4.8; a = 'slide'; f = s > 0.7 ? 1 : 0; }
      else { const s = (u - 4.8) / 4.8, pts = [[20.6, 5.0], [20.6, 8.6], [11.2, 8.6], [11.2, 7.3]], L = [3.6, 9.4, 1.3], tot = 14.3; let d = s * tot, i = 0; while (i < 2 && d > L[i]) { d -= L[i]; i++; } const A = pts[i], B = pts[i + 1], v = Math.min(1, d / L[i]); x = lerp(A[0], B[0], v); y = lerp(A[1], B[1], v); z = 0; a = 'run' + (B[0] > A[0] ? 0 : B[0] < A[0] ? 2 : B[1] > A[1] ? 1 : 3); f = Math.floor(u * 5) % 4; }
      return { x, y, z, key: a + f, a, f }; },
    draw(g, st) { const w = TK.pupil(1662, { k: 0.7, top: '#E6C24F', bot: '#3F4D63', cap: '#E05A4A' }); if (st.a === 'climb') TK.person(g, 0, 0, 0, Object.assign({}, w, { dir: 2, pose: 'walk', ph: st.f * 0.5, hands: [[-1.0, -19.6 + st.f], [1.2, -18.4 - st.f]] })); else if (st.a === 'stand') TK.person(g, 0, 0, 0, Object.assign({}, w, { dir: 0 })); else if (st.a === 'slide') TK.person(g, 0, 0, 0, Object.assign({}, w, { dir: 0, pose: st.f ? 'cheer' : 'sit', ph: 0.25 })); else TK.person(g, 0, 0, 0, Object.assign({}, w, { dir: +st.a[3], pose: 'walk', ph: st.f / 4 })); } });
  // the see-saw: its pivot and plank, and each child, an actor of their own on one clock. The pivot and plank are anchored
  // at the far end of the plank, just behind the first child, so both children (who sit on it) come after it
  const tiltAt = (t) => Math.round(Math.sin(t * TAU / 4) * 3);
  T.actor({ sample: 0.2, period: 4, r: 16,
    at(t) { const k = tiltAt(t); return { x: 22.5, y: 32.5, key: k, k }; },
    draw(g, st) { const tilt = st.k / 3 * 1.3, o = 4.0; K.box(g, o - 0.5, -0.7, o + 0.5, 0.7, 0, 1.3, '#E6C24F', { w: 0.45, boil: false }); const pl = [[o - 4.6, -0.5, 1.3 - tilt], [o + 4.6, -0.5, 1.3 + tilt], [o + 4.6, 0.5, 1.3 + tilt], [o - 4.6, 0.5, 1.3 - tilt]]; g.fill(pl, '#5FA8D9'); g.outline(pl, { w: 0.5, boil: false }); } });
  T.actor({ sample: 0.2, period: 4, r: 12,
    at(t) { const k = tiltAt(t); return { x: 22.7, y: 32.5, z: 1.3 - k / 3 * 1.3 * 0.86 - 0.9, key: k, k }; },
    draw(g) { K.person(g, 0, 0, 0, Object.assign({}, TK.pupil(1663, { k: 0.7, top: '#8FBF73' }), { dir: 0, pose: 'sit', k: 0.7, hands: [[1.6, -12.0], [2.2, -12.2]] })); } });
  T.actor({ sample: 0.2, period: 4, r: 12,
    at(t) { const k = tiltAt(t); return { x: 30.3, y: 32.5, z: 1.3 + k / 3 * 1.3 * 0.86 - 0.9, key: k, k }; },
    draw(g, st) { K.person(g, 0, 0, 0, Object.assign({}, TK.pupil(1664, { k: 0.7, top: '#D98AA4', hairStyle: 'pony' }), { dir: 2, pose: st.k > 2 ? 'cheer' : 'sit', ph: 0.25, k: 0.7, hands: st.k > 2 ? undefined : [[1.6, -12.0], [2.2, -12.2]] })); } });
  T.actor({ sample: 0.2, period: 2, r: 12,
    at(t) { const f = Math.floor(t * 5) % 6; return { x: 12, y: 13.2, key: f, f }; },
    draw(g, st) { const k = Math.sin(st.f / 6 * TAU) * 0.9, p = g.p(0, 0, 2.0), Q = (u, v) => [p[0] + u + k * (-v) * 0.12, p[1] + v];
      const body = K.curve([Q(-3, -1.0), Q(3, -1.0), Q(3.2, -4.4), Q(-3.2, -4.4)], 3, true); g.fill2(body, '#F6F3EA', true); g.fill2([Q(-3, -2.4), Q(-1.5, -2.4), Q(-1.5, -1.0), Q(-3, -1.0)], '#2A2622', true); g.line2(body, { w: 0.5, close: true, boil: false });
      const hd = Q(3.0, -5.6); g.disc2(hd, 2.0, '#F6F3EA'); g.ring2(hd, 2.0, { w: 0.4, c: INK }); g.disc2([hd[0] - 1.3, hd[1] - 1.8], 0.8, '#2A2622'); g.disc2([hd[0] + 1.3, hd[1] - 1.8], 0.8, '#2A2622'); g.disc2([hd[0] - 0.6, hd[1] - 0.2], 0.5, '#2A2622'); g.disc2([hd[0] + 0.6, hd[1] - 0.2], 0.5, '#2A2622');
      K.person(g, -0.3 + k * 0.4, 0, 2.6, Object.assign({}, TK.pupil(1665, { k: 0.62, top: '#E05A4A', hairStyle: 'bob' }), { dir: 0, pose: 'sit', k: 0.62, hands: [[2.8, -10.4], [3.4, -10.6]] })); } });
  TK.idle(T, TK.who(1666, { dir: 2, top: '#F3E3A0', bot: '#3F4D63', hairStyle: 'long' }), 15.4, 14.6, { acts: ['clap', 'talk', 'photo', 'laugh', 'look'], seed: 1666 });
  // two children digging in the sandpit, an actor each on one clock; their sand castle and the bucket lie in the sand
  T.cast([23.4, 16.4, 25.4, 18.0], (g) => { const c = g.p(24.4, 17.2, 0); g.fill2(K.curve([[c[0] - 3, c[1]], [c[0] - 1.6, c[1] - 2.4], [c[0] + 1.6, c[1] - 2.4], [c[0] + 3, c[1]]], 3, false).concat([[c[0], c[1] + 0.8]]), '#D8C79C', true); g.fill2([[c[0] - 0.7, c[1] - 2.2], [c[0] + 0.7, c[1] - 2.2], [c[0] + 0.5, c[1] - 3.8], [c[0] - 0.5, c[1] - 3.8]], '#D8C79C', true); }, { name: 'sand castle' });
  T.cast([25.4, 19.6, 26.2, 20.4], (g) => { const bk = g.p(25.8, 20.0, 0); g.fill2([[bk[0] - 1.2, bk[1]], [bk[0] + 1.2, bk[1]], [bk[0] + 1.5, bk[1] - 2.2], [bk[0] - 1.5, bk[1] - 2.2]], '#E05A4A', true); }, { name: 'bucket' });
  const digAt = (t) => { const u = ((t % 12) + 12) % 12; return u < 8 ? ['dig', Math.floor(u * 2.4) % 2] : u < 10 ? ['show', Math.floor(u * 5) % 2] : ['dig', 0]; };
  T.actor({ sample: 0.25, period: 12, r: 12,
    at(t) { const s = digAt(t); return { x: 22.0, y: 16.4, key: s[0] + s[1], a: s[0], i: s[1] }; },
    draw(g, st) { K.person(g, 0, 0, 0, Object.assign({}, TK.pupil(1667, { k: 0.66, top: '#7FB7D9', cap: '#E6C24F' }), { dir: 0, pose: 'kneel', k: 0.66, hands: st.a === 'dig' ? [[3.4 + st.i * 0.6, -5.0 + st.i], [4.2, -6.0]] : [[1.0, -17.0], [2.6, -17.4]] })); } });
  T.actor({ sample: 0.25, period: 12, r: 12,
    at(t) { const s = digAt(t); return { x: 27.0, y: 18.1, key: s[0] + s[1], a: s[0], i: s[1] }; },
    draw(g, st) { K.person(g, 0, 0, 0, Object.assign({}, TK.pupil(1668, { k: 0.66, top: '#E7A9A0', hairStyle: 'pony' }), { dir: 2, pose: 'kneel', k: 0.66, hands: st.a === 'dig' ? [[3.6 - st.i * 0.6, -4.6], [4.4, -5.4 + st.i * 0.6]] : st.i ? [[0.4, -10.6], [1.6, -11.0]] : [[2.2, -9.0], [3.0, -9.4]] })); } });
  TK.idle(T, Object.assign(TK.pupil(1669, { k: 0.7, top: '#8FBF73', bot: '#3F4D63', hairStyle: 'short' }), { sit: true, dir: 1 }), 14.6, 25.6, { acts: ['wave', 'look', 'cheer', 'laugh', 'rest'], z: 5.4, seed: 1669 });
  T.actor({ sample: 0.2, period: 7, r: 14,
    at(t) { const u = ((t % 7) + 7) % 7, z = u < 3 ? u / 3 * 3.8 : u < 4 ? 3.8 : 3.8 * (1 - (u - 4) / 3); return { x: 16.4, y: 24.0, z, key: Math.round(z * 2) + '.' + (Math.floor(u * 3) % 2), f: Math.floor(u * 3) % 2, top: u >= 3 && u < 4 }; },   // (on the outside of its x = 16 face: on the front face the tricycle ran over her feet)
    draw(g, st) { const w = TK.pupil(1670, { k: 0.7, top: '#C9584B', bot: '#3F4D63', hairStyle: 'bob' }); TK.person(g, 0, 0, 0, Object.assign({}, w, st.top ? { dir: 1, pose: 'wave', ph: 0.25 } : { dir: 2, pose: 'walk', ph: st.f * 0.5, hands: [[-1.0, -18.4 + st.f], [1.0, -17.6 - st.f]] })); } });
  // a small child going round and round on a tricycle, a parent's eye on them from the bench
  T.actor({ sample: 0.2, period: 10, r: 12,
    at(t) { const P = [[10.6, 28.6], [14.2, 28.6], [14.2, 32.2], [10.6, 32.2]], L = 14.4, d = ((t * 1.44) % L + L) % L, i = Math.floor(d / 3.6), u = (d - i * 3.6) / 3.6, a = P[i], b = P[(i + 1) % 4], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), f = Math.floor(t * 4) % 2; return { x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), key: i + '.' + f, ang, f, ext: [1.6, 1.6] }; },
    draw(g, st) { const ca = Math.cos(st.ang), sa = Math.sin(st.ang), P = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z), wh = (c, r) => { const pts = []; for (let i = 0; i < 12; i++) { const a = TAU * i / 12; pts.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r * 0.9]); } g.line2(pts, { w: 0.55, c: '#3A3530', close: true, boil: false }); };
      const back = [P(-1.0, -0.8, 0.6), P(-1.0, 0.8, 0.6)], fr = P(1.2, 0, 0.9); for (const c of back) wh(c, 2.0); g.line2([P(-1.0, 0, 1.2), P(1.2, 0, 2.6)], { w: 0.7, c: '#E05A4A', boil: false }); wh(fr, 3.0); g.segs2([back[0][0], back[0][1], back[1][0], back[1][1]], '#E05A4A', 0.6);
      const dir = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2); K.person(g, -0.5 * ca, -0.5 * sa, 1.4, Object.assign({}, TK.pupil(1680, { k: 0.56, top: '#F3E36A', hairStyle: 'bob' }), { dir, pose: 'sit', k: 0.56, hands: [[3.0, -10.2], [3.6, -10.4]] })); } });
  TK.chase(T, [TK.pupil(1671, { top: '#5FA8D9', cap: '#E6C24F' }), TK.pupil(1672, { top: '#E6C24F' }), TK.pupil(1673, { top: '#D98AA4', hairStyle: 'pony' })], [[18, 11.6], [31.4, 11.6], [31.4, 23.2], [18, 23.2]], 3.2, { gap: 0.1 });
  TK.group(T, [{ who: Object.assign(TK.who(1674, { top: '#F3EEE0', bot: '#5A6B7A', hairStyle: 'long' }), { sit: true, dir: 0 }), x: 9.8, y: 16.6, z: 0.4 }, { who: Object.assign(TK.who(1675, { top: '#7FB7D9', bot: '#3F4D63', hairStyle: 'bob' }), { sit: true, dir: 0 }), x: 9.8, y: 18.8, z: 0.4 }, { who: TK.who(1676, { dir: 2, top: '#C9B48F', bot: '#3F4D63', hairStyle: 'pony' }), x: 12.6, y: 19.6 }], { seed: 1674 });
  TK.idle(T, Object.assign(TK.who(1677, { hair: '#B9B3A6', top: '#6B7B8C', bot: '#3F4D63', hairStyle: 'bald', glasses: true }), { sit: true, dir: 1 }), 31.6, -0.8, { acts: ['rest', 'look', 'scroll', 'laugh', 'rest'], z: 0.4, seed: 1677 });
  TK.toss(T, TK.pupil(1678, { k: 0.8, top: '#E05A4A', cap: '#E6C24F' }), TK.pupil(1679, { k: 0.8, top: '#5FA8D9' }), 16.3, 32.0, 23.5, 27.6, { seed: 1.3, ball: '#F3F1EA' });
});
