'use strict';
/* (-100,100) The Sumida in cherry-blossom week, at Sumida Park in Asakusa. The river runs along x between stone
   embankments, each with its riverside terrace (a paved promenade with a railing at the water); the red Azuma-bashi
   crosses it on three shallow vermilion arches, high enough for the yakatabune (a house on a hull, shōji windows, a row of
   red lanterns) to pass under. On the far bank a row of food stalls faces the water under strings of paper lanterns
   (焼鳥, たいやき, ビール, だんご, おでん, そば), and behind them the cherries, in full bloom, with picnics on blue tarps:
   bento, beer and songs. The near bank has more cherries and picnics, a lawn where children chase each other, a man
   fishing from the railing, joggers and dogs on the terraces. Petals drift down. In July the same banks are held from
   noon for the fireworks; in November joggers and a painter have them; in January black-headed gulls ride the river. */
SF.tile('sumida', -100, 100, { rim: 12 }, function (T) {
  const H = 37, RY0 = -10, RY1 = 4, WZ = -1.6, BX0 = 13, BX1 = 21, DZ = 4.2, PAVE = '#E6E1D5';
  const FEST = ['spring', 'summer'];

  /* ---------------- helpers ---------------- */
  // a person in one place going through a round of acts: seq [[act, secs, dir], ...]; act: a TK.ACTS name or
  // { n, rate, f(i) -> pose overrides, extra(g, r, i) }
  const busy = (who, x, y, seq, o) => {
    o = o || {}; const period = seq.reduce((s, q) => s + q[1], 0);
    return T.actor({ sample: 0.25, period, season: o.season, r: o.r || 12,
      at(t) { t = ((t + (o.off || 0)) % period + period) % period; let k = 0, s = 0; while (k < seq.length - 1 && t >= s + seq[k][1]) { s += seq[k][1]; k++; } const a = seq[k][0], A2 = typeof a === 'string' ? TK.ACTS[a] : a, i = Math.floor((t - s) * A2.rate) % A2.n; return { x, y, z: (o.z || 0) + (A2.z ? A2.z[i] : 0), key: k + '.' + i, k, i }; },
      draw(g, st) { const [a, , dir] = seq[st.k], w = Object.assign({}, who, dir == null ? {} : { dir }); let r; if (typeof a === 'string') r = TK.doing(g, w, a, st.i); else { r = TK.person(g, 0, 0, 0, Object.assign(w, a.f(st.i))); if (a.extra) a.extra(g, r, st.i); } if (o.after) o.after(g, r, st); } });
  };
  const HIGH = (r) => (r.hands[0][1] < r.hands[1][1] ? r.hands[0] : r.hands[1]);

  /* ---------------- ground: banks, terraces, the river ---------------- */
  T.ground(function (g) {
    K.slab(g, H, { top: '#C9DBA5' });
    g.grass(K.rect(-H, -H, H, RY0 - 4.5), { dens: 0.7 }); g.grass(K.rect(-H, RY1 + 4.5, H, H), { dens: 0.7 });
    // the far bank's stone wall, the water, the near bank laid over the water's near edge
    g.fill([[-H, RY0, 0], [H, RY0, 0], [H, RY0, WZ], [-H, RY0, WZ]], '#BDB7A8');
    const st = []; for (let x = -H + 1.3; x < H; x += 1.3) { const a = g.p(x, RY0, -0.05), b = g.p(x, RY0, WZ + 0.05); st.push(a[0], a[1], b[0], b[1]); } g.segs2(st, '#9E988A', 0.3);
    g.fine([[-H, RY0, WZ * 0.5], [H, RY0, WZ * 0.5]], { w: 0.3, c: '#9E988A' });
    const w = K.rect(-H, RY0, H, RY1 + 1.2, WZ); g.fill(w, C.water); g.water(K.rect(-H, RY0 + 0.6, H, RY1, WZ), { dens: 1.1 });
    if (!TK.summer() && !TK.winter()) for (let k = 0; k < 46; k++) { const p = g.p(-H + 2 + (k * 37 % 72), RY0 + 1 + (k * 13 % 12), WZ); g.fill2([[p[0] - 0.5, p[1]], [p[0], p[1] - 0.35], [p[0] + 0.5, p[1]], [p[0], p[1] + 0.35]], TK.autumn() ? ['#D98A45', '#C8663A', '#D9A54C'][k % 3] : '#F6C9D3', true); }   // petals (in autumn, leaves) on the water
    // the terraces: paving with a running joint, a kerb line along the water
    const pave = (y0, y1) => { g.fill(K.rect(-H, y0, H, y1), PAVE); const s = []; for (let x = -H + 2.4; x < H; x += 2.4) { const a = g.p(x, y0, 0), b = g.p(x, y1, 0); s.push(a[0], a[1], b[0], b[1]); } for (let y = y0 + 1.5; y < y1 - 0.1; y += 1.5) { const a = g.p(-H, y, 0), b = g.p(H, y, 0); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#D3CDBE', 0.3); };
    pave(RY0 - 4.5, RY0); pave(RY1, RY1 + 4.5);
    g.line([[-H, RY1, 0], [H, RY1, 0]], { w: 0.8, boil: false }); g.line([[-H, RY0, 0], [H, RY0, 0]], { w: 0.8, boil: false }); g.line([[-H, RY0, WZ], [H, RY0, WZ]], { w: 0.5, c: '#5F7F9C', boil: false });
    // the park paths behind the far stalls and across the near lawn
    g.fill(K.rect(-H, -26.0, H, -24.0), '#E2DCCD'); g.fill(K.rect(-H, 27.5, H, 29.5), '#E2DCCD');
    // pink petals in the grass (in autumn, the cherries' fallen leaves)
    if (!TK.summer() && !TK.winter()) for (const q of [K.rect(-H, -H, H, RY0 - 4.5), K.rect(-H, RY1 + 4.5, H, 26)]) g.scuff(q, { dir: 0, len: 0.8, c: TK.autumn() ? '#C98A4C' : '#F2C6D0', dens: 0.9, w: 0.7, spread: 3 });
  }, { rim: true });
  // the picnics' blue tarps, laid out with bento, cans and bottles (hanami in spring; in July, held since noon for the fireworks)
  const TARPS = [[-30, -19.4, 3.4, 2.4, 21], [-18.5, -18.6, 3.2, 2.4, 22], [-6.5, -19.6, 3.6, 2.4, 23], [4.6, -18.8, 2.8, 2.2, 24], [28, -20, 3.4, 2.6, 28], [-28, 16, 3.4, 2.6, 25], [-12, 17.5, 3.8, 2.8, 26], [4, 16.5, 3.2, 2.4, 27], [27, 18, 3.4, 2.4, 29], [-20, 33, 3.0, 2.2, 30]];
  T.ground(function (g) {
    for (const [cx, cy, w, d, seed] of TARPS) {
      TK.tarp(g, [[cx - w, cy - d, 0.04], [cx + w, cy - d, 0.04], [cx + w, cy + d, 0.04], [cx - w, cy + d, 0.04]]);
      const R = RNG(seed);
      for (let k = 0; k < 4; k++) { const x = cx - w * 0.45 + R() * w * 0.9, y = cy - d * 0.35 + R() * d * 0.7; K.box(g, x - 0.6, y - 0.45, x + 0.6, y + 0.45, 0.04, 0.4, R.pick([{ t: '#C9463E', l: '#2E2A26', r: '#2E2A26' }, { t: '#E6C24F', l: '#C9A24F', r: '#B08A3A' }, { t: '#F3F1EA', l: '#D9D6CE', r: '#C9C6BD' }]), { w: 0.3, boil: false, nohid: true }); }
      for (let k = 0; k < 4; k++) { const p = g.p(cx - w * 0.3 + R() * w * 0.6, cy + R() * d * 0.6 - d * 0.3, 0.05); g.fill2([[p[0] - 0.4, p[1]], [p[0] + 0.4, p[1]], [p[0] + 0.4, p[1] - 1.3], [p[0] - 0.4, p[1] - 1.3]], R.pick(['#D9DCDC', '#E6C24F', '#C9463E', '#5F8FC9']), true); }
      const b = g.p(cx + w * 0.2, cy - d * 0.1, 0.05); g.fill2([[b[0] - 0.5, b[1]], [b[0] + 0.5, b[1]], [b[0] + 0.45, b[1] - 2.4], [b[0] + 0.2, b[1] - 3.2], [b[0] - 0.2, b[1] - 3.2], [b[0] - 0.45, b[1] - 2.4]], '#5E7A4A', true);   // a big bottle
      K.box(g, cx + w - 1.6, cy - d + 0.2, cx + w - 0.2, cy - d + 1.2, 0.04, 1.0, { t: '#F3F1EA', l: '#5F8FC9', r: '#4F7AAE' }, { w: 0.35, boil: false, nohid: true });   // the cool box
    }
  }, { season: FEST });

  /* ---------------- the red bridge (Azuma-bashi) ---------------- */
  const RED = { t: '#D86A55', l: '#C9463E', r: '#AE3A32' }, DECK = { t: '#CFC9BC', l: '#E3DED2', r: '#C9C3B4' };
  T.obj([BX0, RY0 - 11, BX1, RY0], function (g) {
    const q = [[BX0, RY0 - 11, 0], [BX1, RY0 - 11, 0], [BX1, RY0, DZ], [BX0, RY0, DZ]]; g.fill(q, DECK.t);
    g.fill([[BX1, RY0 - 11, 0], [BX1, RY0, DZ], [BX1, RY0, 0]], DECK.r); g.outline(q, { w: 0.7, boil: false });
    for (const x of [BX0 + 0.25, BX1 - 0.25]) g.line([[x, RY0 - 11, 1.4], [x, RY0, DZ + 1.4]], { w: 0.7, c: '#9A3A30', boil: false });
    const po = []; for (const x of [BX0 + 0.25, BX1 - 0.25]) for (let y = RY0 - 10.6; y < RY0; y += 1.4) { const zz = DZ * (y - (RY0 - 11)) / 11, a = g.p(x, y, zz), b = g.p(x, y, zz + 1.4); po.push(a[0], a[1], b[0], b[1]); } g.segs2(po, '#C9463E', 0.45);
  }, { name: 'ramp far' });
  // The span. Its two piers are objects of their own (a boat in the far arch passes behind one, a boat in the near arch in
  // front of both). The near railing and its two lamps are one too, in front of the people who lean on it. The span's,
  // the railing's and the piers' fps reach half a boat's length (6.7) east of the bridge: a boat still half under the
  // bridge is behind its arches (the span and railing { under } it) and behind a pier on its near side.
  const BOAT_H = 6.7, NSP = 3, SP = (RY1 - RY0) / NSP;
  for (let i = 1; i < NSP; i++) { const y = RY0 + i * SP; T.obj([BX0 + 0.4, y - 0.5, BX1 - 0.4 + BOAT_H, y + 0.5], (g) => { g.boilP = 0.4; K.box(g, BX0 + 0.4, y - 0.5, BX1 - 0.4, y + 0.5, WZ, DZ - 3.0, { t: '#C9C3B4', l: '#BDB7A8', r: '#A9A296' }, { w: 0.6 }); }, { name: 'bridge pier' }); }
  T.obj([BX0 - 0.5, RY0, BX1 + 0.5 + BOAT_H, RY1], function (g) {
    g.boilP = 0.4;
    const n = NSP, sp = SP;
    K.box(g, BX0, RY0, BX1, RY1, DZ - 0.7, DZ, DECK, { w: 0.8 });
    g.fill(K.on('R', BX1 + 0.02, RY0, RY1, DZ - 0.7, DZ), RED.r);
    // three shallow vermilion arches under the deck on the side we see, piers between them
    for (let i = 0; i < n; i++) {
      const a0 = RY0 + i * sp, a1 = a0 + sp, pts = [], top = [], mid = [];
      for (let k = 0; k <= 10; k++) { const t = k / 10, y = lerp(a0, a1, t), z = DZ - 0.7 - 2.6 * (1 - Math.sin(Math.PI * t)); pts.push([BX1 + 0.05, y, z]); top.push([BX1 + 0.05, y, DZ - 0.7]); mid.push([BX1 + 0.06, y, z + 0.55]); }
      g.fill(pts.concat(top.slice().reverse()), RED.r);
      g.line(pts, { w: 0.9, c: '#7A2A22', boil: false }); g.fine(mid, { w: 0.35, c: '#D86A55' });
      const ribs = []; for (let k = 1; k < 10; k++) { const p0 = g.p.apply(g, pts[k]), p1 = g.p.apply(g, top[k]); ribs.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(ribs, '#8A2F26', 0.35);
    }
    // the far railing: red posts and a top rail, lamps on its two corners
    { const x = BX0 + 0.25, po = []; for (let y = RY0 + 0.4; y < RY1; y += 1.0) { const a = g.p(x, y, DZ), b = g.p(x, y, DZ + 1.4); po.push(a[0], a[1], b[0], b[1]); } g.segs2(po, '#C9463E', 0.5); g.line([[x, RY0, DZ + 1.4], [x, RY1, DZ + 1.4]], { w: 0.75, c: '#9A3A30', boil: false }); }
    for (const y of [RY0 + 0.2, RY1 - 0.2]) K.lamp(g, BX0 + 0.25, y, { z: DZ, h: 5.6, col: '#7A2A22' });
  }, { name: 'bridge span', under: DZ - 0.8, bias: 3 });   // (bias: after both piers, whose fps lie inside its own)
  T.obj([BX1 - 0.5, RY0, BX1 + BOAT_H, RY1], function (g) {
    g.boilP = 0.4;
    const x = BX1 - 0.25, po = []; for (let y = RY0 + 0.4; y < RY1; y += 1.0) { const a = g.p(x, y, DZ), b = g.p(x, y, DZ + 1.4); po.push(a[0], a[1], b[0], b[1]); } g.segs2(po, '#C9463E', 0.5); g.line([[x, RY0, DZ + 1.4], [x, RY1, DZ + 1.4]], { w: 0.75, c: '#9A3A30', boil: false });
    for (const y of [RY0 + 0.2, RY1 - 0.2]) K.lamp(g, x, y, { z: DZ, h: 5.6, col: '#7A2A22' });
  }, { name: 'bridge near rail', under: DZ - 0.8 });
  T.obj([BX0, RY1, BX1, RY1 + 11], function (g) {
    const q = [[BX0, RY1, DZ], [BX1, RY1, DZ], [BX1, RY1 + 11, 0], [BX0, RY1 + 11, 0]]; g.fill(q, DECK.t);
    g.fill([[BX1, RY1, DZ], [BX1, RY1 + 11, 0], [BX1, RY1, 0]], DECK.r); g.fill([[BX0, RY1 + 11, 0], [BX1, RY1 + 11, 0], [BX1, RY1 + 11, 0.05], [BX0, RY1 + 11, 0.05]], DECK.l);
    g.outline(q, { w: 0.7, boil: false });
    const po = []; for (const x of [BX0 + 0.25, BX1 - 0.25]) for (let y = RY1 + 0.4; y < RY1 + 11; y += 1.4) { const zz = DZ * (1 - (y - RY1) / 11), a = g.p(x, y, zz), b = g.p(x, y, zz + 1.4); po.push(a[0], a[1], b[0], b[1]); } g.segs2(po, '#C9463E', 0.45);
    for (const x of [BX0 + 0.25, BX1 - 0.25]) g.line([[x, RY1, DZ + 1.4], [x, RY1 + 11, 1.4]], { w: 0.7, c: '#9A3A30', boil: false });
  }, { name: 'ramp near' });

  /* ---------------- railings and lamps along the terraces ---------------- */
  for (const [y, name] of [[RY0 - 0.35, 'far railing'], [RY1 + 0.35, 'near railing']]) for (const [x0, x1] of [[-H, BX0 - 0.2], [BX1 + 0.2, H]]) T.obj([x0, y - 0.1, x1, y + 0.1], function (g) {
    const s = []; for (let x = x0 + 0.6; x < x1; x += 1.2) { const a = g.p(x, y, 0), b = g.p(x, y, 1.25); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#3F5A63', 0.45);
    g.line([[x0, y, 1.25], [x1, y, 1.25]], { w: 0.6, c: '#2F4A52', boil: false }); g.fine([[x0, y, 0.65], [x1, y, 0.65]], { w: 0.35, c: '#3F5A63' });
  }, { name });
  for (const x of [-30, -16, 1, 30]) T.obj([x, RY0 - 1.0], (g) => K.lamp(g, x, RY0 - 1.0, { h: 7.5 }), { name: 'lamp' });
  for (const x of [-26, -6, 29]) T.obj([x, RY1 + 1.0], (g) => K.lamp(g, x, RY1 + 1.0, { h: 7.5 }), { name: 'lamp' });
  // (fp: the bench's ground, lengthened to 6.1 so it sorts as a box: whoever passes behind it is behind it; the two on the
  // near terrace a step back, so the terrace's walkers pass behind them)
  for (const [x, y, face] of [[-21, RY1 + 4.2, 'L'], [8, RY1 + 4.2, 'L'], [26, RY0 - 3.8, 'L']]) T.obj([x - 3.05, y - 0.2, x + 3.05, y + 1.8], (g) => K.bench(g, x, y, { face, L: 1.8 }), { name: 'bench' });

  /* ---------------- food stalls on the far bank ---------------- */
  const STALLS = [['焼鳥', '#C9463E', '#F3F1EA', 'yakitori'], ['たいやき', '#3F7FC0', '#F3F1EA', 'taiyaki'], ['ビール', '#E6C24F', '#C9463E', 'beer'], ['だんご', '#C9463E', '#F3F1EA', 'dango'], ['おでん', '#3F7F5A', '#F3F1EA', 'oden'], ['そば', '#C9463E', '#E9C46A', 'soba']];
  const SX0 = -34.5, SW = 5.0, SG = 1.9, SY0 = -30.2, SY1 = -27.2;
  const goods = (g, kind, x0, x1, y, z) => {
    const n = 5; for (let k = 0; k < n; k++) {
      const p = g.p(x0 + 0.6 + k * (x1 - x0 - 1.2) / (n - 1), y, z);
      if (kind === 'yakitori') { g.line2([[p[0] - 1.4, p[1] + 0.2], [p[0] + 1.4, p[1] - 0.4]], { w: 0.25, c: '#8A6A4A', boil: false }); for (let j = 0; j < 3; j++) g.disc2([p[0] - 0.7 + j * 0.7, p[1] - 0.1 - j * 0.15], 0.5, '#A8603A'); }
      else if (kind === 'taiyaki') g.fill2([[p[0] - 1.3, p[1]], [p[0] - 0.2, p[1] - 0.7], [p[0] + 0.8, p[1] - 0.3], [p[0] + 1.4, p[1] - 0.8], [p[0] + 1.3, p[1] + 0.4], [p[0] + 0.8, p[1] + 0.1], [p[0] - 0.2, p[1] + 0.5]], '#C98A4C', true);
      else if (kind === 'beer') { g.fill2([[p[0] - 0.45, p[1]], [p[0] + 0.45, p[1]], [p[0] + 0.45, p[1] - 1.5], [p[0] - 0.45, p[1] - 1.5]], k % 2 ? '#E6C24F' : '#D9DCDC', true); g.disc2([p[0], p[1] - 1.6], 0.4, '#FBFAF6'); }
      else if (kind === 'dango') { g.line2([[p[0] - 1.3, p[1] + 0.3], [p[0] + 1.2, p[1] - 0.5]], { w: 0.25, c: '#8A6A4A', boil: false }); ['#F2C6D0', '#F6F3EA', '#8FBF73'].forEach((c, j) => g.disc2([p[0] - 0.75 + j * 0.75, p[1] - 0.05 - j * 0.25], 0.5, c)); }
      else if (kind === 'oden') { if (k === 2) { g.fill2([[p[0] - 3, p[1]], [p[0] + 3, p[1]], [p[0] + 2.6, p[1] - 1.6], [p[0] - 2.6, p[1] - 1.6]], '#8C8576', true); for (let j = 0; j < 5; j++) g.disc2([p[0] - 2 + j, p[1] - 1.8 - (j % 2) * 0.4], 0.5, ['#E9C46A', '#F3F1EA', '#C98A4C'][j % 3]); } }
      else { g.disc2(p, 0.9, '#F3F1EA'); g.ring2(p, 0.9, { w: 0.3, c: '#8C8576' }); }
    }
  };
  STALLS.forEach(([word, a, b, kind], i) => {
    const x0 = SX0 + i * (SW + SG), x1 = x0 + SW;
    T.obj([x0, SY0, x1, SY0 + 0.4], function (g) {                                                                   // the back board, behind the keeper
      K.box(g, x0, SY0, x1, SY0 + 0.4, 0, 6.2, { t: '#C9A26B', l: '#B58F58', r: '#A07C4C' }, { w: 0.6 });
      g.fill(K.on('L', SY0 + 0.42, x0 + 0.2, x1 - 0.2, 2.6, 6.0), '#E9C48A');
      const sh = []; for (const z of [3.6, 4.8]) { const p0 = g.p(x0 + 0.3, SY0 + 0.45, z), p1 = g.p(x1 - 0.3, SY0 + 0.45, z); sh.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(sh, '#8A6A4A', 0.4);
      const jar = []; for (let k = 0; k < 6; k++) { const p = g.p(x0 + 0.7 + k * 0.7, SY0 + 0.5, 3.7); jar.push(p); } for (const [k, p] of jar.entries()) g.fill2([[p[0] - 0.5, p[1]], [p[0] + 0.5, p[1]], [p[0] + 0.5, p[1] - 1.4], [p[0] - 0.5, p[1] - 1.4]], ['#C9463E', '#F3F1EA', '#E6C24F', '#5F8FC9', '#8FBF73', '#C98A4C'][(k + i) % 6], true);
    }, { name: 'stall back', season: FEST });
    T.obj([x0, SY1 - 1.3, x1, SY1 + 0.8], function (g) {
      K.box(g, x0, SY1 - 1.3, x1, SY1, 0, 2.2, { t: '#D9B57E', l: '#C9A26B', r: '#B58F58' }, { w: 0.7 });              // the counter
      g.fill(K.on('L', SY1 + 0.02, x0, x1, 1.6, 2.2), a);
      goods(g, kind, x0, x1, SY1 - 0.65, 2.25);
      if (kind === 'yakitori') { const c = g.p((x0 + x1) / 2 + 1.2, SY1 - 0.65, 2.6); g.line2([c, [c[0] + 1.2, c[1] - 6], [c[0] - 0.6, c[1] - 11]], { w: 0.5, c: '#D2CCC0', boil: false }); }
      const posts = []; for (const [px, py] of [[x0 + 0.2, SY1 - 0.2], [x1 - 0.2, SY1 - 0.2]]) { const p0 = g.p(px, py, 2.2), p1 = g.p(px, py, 7.6); posts.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(posts, '#5A4A3C', 0.6);
      // the striped canopy sloping out over the counter
      const n = 6; for (let k = 0; k < n; k++) { const u0 = x0 - 0.4 + (SW + 0.8) * k / n, u1 = x0 - 0.4 + (SW + 0.8) * (k + 1) / n; g.fill([[u0, SY0 - 0.2, 8.4], [u1, SY0 - 0.2, 8.4], [u1, SY1 + 0.8, 7.4], [u0, SY1 + 0.8, 7.4]], k % 2 ? b : a); }
      g.outline([[x0 - 0.4, SY0 - 0.2, 8.4], [x1 + 0.4, SY0 - 0.2, 8.4], [x1 + 0.4, SY1 + 0.8, 7.4], [x0 - 0.4, SY1 + 0.8, 7.4]], { w: 0.7, boil: false });
      g.fill(K.on('L', SY1 + 0.8, x0 - 0.4, x1 + 0.4, 6.9, 7.4), shade(a, 0.1)); g.line([[x0 - 0.4, SY1 + 0.8, 6.9], [x1 + 0.4, SY1 + 0.8, 6.9]], { w: 0.55, boil: false });
      // its name down a board standing on the counter's end, a lantern at the other corner
      TK.sign(g, 'L', SY1 + 0.05, x0 + 0.1, x0 + 1.45, 2.25, 6.6, [...word].length > 3 ? '#F6F1E4' : a === '#E6C24F' ? '#F6F1E4' : a, { word, vert: true });
      const l = g.p(x1 + 0.2, SY1 + 0.6, 5.6); TK.lantern2(g, [l[0], l[1] + 1.8], 1.5, '#D0483A');
    }, { name: 'stall', season: FEST });
  });
  // in July a shaved-ice flag flies by the last stall
  T.obj([SX0 + 6 * (SW + SG) - 0.6, SY1 - 0.4], (g) => { const x = SX0 + 6 * (SW + SG) - 0.6, p0 = g.p(x, SY1 - 0.4, 0), p1 = g.p(x, SY1 - 0.4, 9.5); g.line2([p0, p1], { w: 0.55, c: '#5A4A3C', boil: false }); TK.kooriFlag2(g, [p1[0] + 0.4, p1[1] + 0.4], 5.6, 6.6); }, { name: 'ice flag', season: 'summer' });
  // the lantern strings: poles along the front of the stalls, paper lanterns sagging between them
  const LP = []; for (let i = 0; i <= STALLS.length; i++) LP.push(SX0 + i * (SW + SG) - SG / 2);
  T.obj([LP[0] - 0.3, SY1 + 1.2, LP[LP.length - 1] + 0.3, SY1 + 1.6], function (g) {
    const tops = LP.map((x) => g.p(x, SY1 + 1.4, 9.8));
    for (const [k, x] of LP.entries()) { const b = g.p(x, SY1 + 1.4, 0); g.line2([b, tops[k]], { w: 0.55, c: '#6E5A44', boil: false }); }
    for (let k = 0; k + 1 < tops.length; k++) TK.lanternString2(g, tops[k], tops[k + 1], 4, ['#F6F1E4', '#F2C6D0', '#F6F1E4', '#E07A6A'], 3.6);
  }, { name: 'lanterns', season: FEST });
  T.obj([-34, 12.4, 9, 12.8], function (g) {   // and over the near bank, between the cherries
    const xs = [-34, -25.5, -17, -8.5, 0, 8.5], tops = xs.map((x) => g.p(x, 12.6, 8.6));
    for (const [k, x] of xs.entries()) { const b = g.p(x, 12.6, 0); g.line2([b, tops[k]], { w: 0.55, c: '#6E5A44', boil: false }); }
    for (let k = 0; k + 1 < tops.length; k++) TK.lanternString2(g, tops[k], tops[k + 1], 4, ['#F6F1E4', '#F2C6D0', '#E07A6A', '#F6F1E4'], 3.2);
  }, { name: 'lanterns', season: 'spring' });

  /* ---------------- the cherries ---------------- */
  const FAR = [[-33, -34], [-26, -34.6], [-19, -33.8], [-12, -34.6], [-5, -33.8], [2, -34.6], [9, -33.6], [17, -30], [24, -30.6], [31, -30]];
  FAR.forEach(([x, y], i) => T.obj([x, y], (g) => TK.sakura(g, x, y, { r: 5.0 + (i % 3) * 0.5, seed: 70 + i }), { on: true }));
  for (const [x, y, r] of [[-30, 11.2, 4.8], [-21.5, 10.8, 5.0], [-4.5, 11.2, 4.8], [4.0, 10.8, 4.4], [27, 11.5, 4.6], [34, 22, 4.4], [-34, 31, 4.4], [-8, 33.5, 4.2], [20, 33, 4.6], [13, -22.6, 3.8], [34, -22, 4.2]]) T.obj([x, y], (g) => TK.sakura(g, x, y, { r, seed: 90 + Math.round(x) }), { on: true });

  /* ---------------- the living layer ---------------- */
  // picnics: one talks, the others listen, drink and eat, and now and then they all laugh
  const SEAT = (cx, cy, w, d, n, seed) => { const m = []; for (let k = 0; k < n; k++) { const side = k % 4, t = (Math.floor(k / 4) + 0.5) / Math.ceil(n / 4), q = side === 0 ? [cx - w + t * 2 * w, cy - d - 0.3, 1] : side === 1 ? [cx + w + 0.3, cy - d + t * 2 * d, 2] : side === 2 ? [cx + w - t * 2 * w, cy + d + 0.3, 3] : [cx - w - 0.3, cy + d - t * 2 * d, 0]; const look = (k % 3 === 0 ? TK.salary : k % 3 === 1 ? TK.who : TK.kimono)(seed * 10 + k, { dir: q[2], sit: true, cup: ['#E6C24F', '#F3F1EA', '#D9DCDC'][k % 3], food: ['#F2C6D0', '#C98A4C', '#F6F3EA'][k % 3] }); m.push({ who: look, x: q[0], y: q[1], idle: k % 3 === 0 ? 'drink' : k % 3 === 1 ? 'eat' : 'listen' }); } return m; };
  TARPS.forEach(([cx, cy, w, d, seed], i) => TK.group(T, SEAT(cx, cy, w, d, [6, 5, 6, 4, 5, 5, 6, 4, 5, 4][i], seed), { seed: seed + 3, laughs: 0.55, season: FEST }));
  // the singer at the big picnic: standing, his tie round his head, an arm up for the chorus
  busy(TK.salary(2801, { dir: 1 }), -10.6, -21.6, [['cheer', 3.0], ['talk', 2.0], ['cheer', 2.4], ['laugh', 1.6], ['drink', 2.2]], { season: 'spring',
    after: (g, r) => { const c = r.crown; g.fill2([[c[0] - 2.0, c[1] + 1.4], [c[0] + 2.0, c[1] + 1.4], [c[0] + 2.0, c[1] + 2.2], [c[0] - 2.0, c[1] + 2.2]], '#C9584B', true); g.fill2([[c[0] + 1.8, c[1] + 1.6], [c[0] + 3.4, c[1] + 0.6], [c[0] + 3.0, c[1] + 2.4]], '#C9584B', true); } });
  // the stall keepers behind their counters and their customers: yakitori turned on the grill and handed over, eaten
  STALLS.forEach(([word, , , kind], i) => {
    const x0 = SX0 + i * (SW + SG), cx = x0 + SW / 2, off = i * 1.9;
    const keeper = TK.who(2900 + i, { dir: 1, top: i % 2 ? '#F3F1EA' : '#3F4D63', cap: undefined, muffler: undefined });
    const GRILL = { n: 2, rate: 2.2, f: (j) => ({ lean: 0.6, hands: [[2.4 + j * 0.5, -11.8], [3.2, -11.4 + j * 0.4]] }) }, GIVE = { n: 1, rate: 1, f: () => ({ hands: [[1.2, -10.4], [5.0, -13.6]] }) };
    busy(keeper, cx - 0.6, SY0 + 1.1, [[GRILL, 3.4], [GIVE, 1.4], ['talk', 2.2], ['rest', 1.2], ['look', 1.8]], { off, season: FEST });
    if (i === 2 || i === 4) return;
    const cust = (i % 2 ? TK.kimono : TK.who)(2910 + i, {}), TAKE = { n: 1, rate: 1, f: () => ({ hands: [[1.2, -10.4], [4.4, -13.4]] }) };
    busy(Object.assign({}, cust, { food: kind === 'taiyaki' ? '#C98A4C' : kind === 'dango' ? '#F2C6D0' : '#A8603A' }), cx + 0.4, SY1 + 2.2, [['look', 3.4, 3], [TAKE, 1.4, 3], ['eat', 3.0, 1], ['laugh', 1.2, 1], ['eat', 1.0, 1]], { off, season: FEST });
  });
  // a queue at the beer stall, chatting
  TK.group(T, [{ who: TK.salary(2920, { dir: 3 }), x: SX0 + 2 * (SW + SG) + 1.6, y: SY1 + 2.0 }, { who: TK.who(2921, { dir: 2 }), x: SX0 + 2 * (SW + SG) + 3.4, y: SY1 + 2.6 }, { who: TK.who(2922, { dir: 3 }), x: SX0 + 2 * (SW + SG) + 2.2, y: SY1 + 3.8 }], { seed: 5, season: FEST });
  // the man fishing for goby from the far railing: he casts, waits, reels in
  { const fisher = TK.who(2930, { dir: 1, top: '#6B6A4A', bot: '#3F4D63', cap: '#C9B48F', hair: '#8E8A84', higasa: undefined, uchiwa: undefined });
    T.actor({ sample: 0.25, period: 16, r: 18,
      at(t) { t = ((t % 16) + 16) % 16; const k = t < 1.2 ? 0 : t < 11 ? 1 : t < 13.6 ? 2 : 3, i = k === 2 ? Math.floor(t * 3) % 2 : k === 1 ? Math.floor(t * 0.8) % 2 : 0; return { x: -10.4, y: RY0 - 1.3, key: k + '.' + i, k, i }; },
      draw(g, st) {
        const hands = st.k === 0 ? [[1.0, -17.6], [1.6, -18.4]] : st.k === 2 ? [[2.2, -13.2 + st.i * 0.6], [3.0, -12.6]] : st.k === 3 ? [[1.2, -10.2], [2.4, -12.4]] : [[2.2, -12.6], [2.8, -12.8 - st.i * 0.3]];
        const r = TK.person(g, 0, 0, 0, Object.assign({}, fisher, { hands })), h = HIGH(r);
        const tip = st.k === 0 ? [h[0] - 3, h[1] - 13] : st.k === 3 ? [h[0] + 3, h[1] - 9] : [h[0] + 9, h[1] - 6 + (st.k === 1 && st.i ? 0.6 : 0)];
        g.line2([h, tip], { w: 0.45, c: '#3A3530', boil: false });
        if (st.k !== 0) { const f = st.k === 3 ? [tip[0], tip[1] + 6] : [tip[0] + 2, h[1] + 16]; g.fine2([tip, f], { w: 0.2, c: '#5A564E' }); if (st.k !== 3) { g.disc2(f, 0.55, '#E8742A'); g.line2(arcPts(f[0], f[1] + 0.4, 1.6 + st.i, 0, Math.PI, 6), { w: 0.25, c: '#FBFAF6', boil: false }); } }
      } });
    T.obj([-11.8, RY0 - 1.8], (g) => { K.box(g, -12.4, RY0 - 2.3, -11.2, RY0 - 1.5, 0, 0.9, { t: '#F3F1EA', l: '#5F8FC9', r: '#4F7AAE' }, { w: 0.35, nohid: true }); }, { name: 'bucket' }); }
  // someone photographing the blossom; friends taking a picture under it
  busy(TK.who(2940, { dir: 2 }), -14.6, 9.0, [['photo', 3.2], ['look', 1.6], ['point', 1.4], ['photo', 2.6], ['scroll', 2.4]], { off: 0.6 });
  TK.photo(T, { who: TK.who(2941, { dir: 2 }), x: 0.6, y: 25.0 }, [{ who: TK.kimono(2942, { dir: 0 }), x: -3.2, y: 24.4 }, { who: TK.kimono(2943, { dir: 0 }), x: -3.0, y: 26.2 }], { seed: 3, pause: 4 });
  // children chasing each other round the near lawn; a ball thrown between two friends
  TK.chase(T, [TK.pupil(2950, { k: 0.8, top: '#C9463E' }), TK.pupil(2951, { k: 0.78, top: '#5F8FC9' }), TK.pupil(2952, { k: 0.76, top: '#E6C24F' })], [[-30, 22.5], [-18, 22.5], [-18, 26.5], [-30, 26.5]], 3.4, { gap: 0.09 });
  TK.toss(T, TK.who(2953, {}), TK.who(2954, {}), 14.5, 22.5, 22.5, 25.5, { seed: 0.4 });
  // joggers and dog walkers on both terraces, all year; walkers over the bridge
  // (the terraces in lanes. A person is about 1 u across and a terrace has room for few lanes, so: on the far terrace the
  // walkers go round west of the fisher at RY0 - 14.0 / - 12.6 and the jogger east of him on the same lanes; on the near
  // terrace the walkers go round at RY1 + 1.5 / 3.5 with the dog walker inside them at 2.1 / 2.9, turning short of the
  // bridge's ramp (his dog trots 3.2 ahead of him), and the jogger runs east of the bridge at 1.5 / 3.6; the far
  // terrace's other dog walker goes round east of its bench. All behind the benches, clear of lamps, bucket and fisher.)
  K.walker(T, TK.who(2840, { top: '#3F5F8F', bot: '#2F343B', cap: '#3B3F47', shorts: true }), [[-8.6, RY0 - 4.0], [11.0, RY0 - 4.0], [11.0, RY0 - 2.6], [-8.6, RY0 - 2.6]], 4.0, { phase: 0.2 });
  K.walker(T, TK.who(2841, { top: '#C9584B', bot: '#2F343B', shorts: true }), [[36, RY1 + 1.5], [22.2, RY1 + 1.5], [22.2, RY1 + 3.6], [36, RY1 + 3.6]], 3.6, { phase: 0.6 });
  TK.dogWalk(T, TK.who(2842, { top: '#7FB7D9' }), [[-33.4, RY1 + 2.1], [9.2, RY1 + 2.1], [9.2, RY1 + 2.9], [-33.4, RY1 + 2.9]], 1.3, '#C98A4A', { phase: 0.1 });
  TK.dogWalk(T, TK.kimono(2843), [[34.0, RY0 - 1.5], [31.2, RY0 - 1.5], [31.2, RY0 - 2.9], [34.0, RY0 - 2.9]], 1.1, '#F3F1EA', { phase: 0.5 });   // east of the bench and the lamp
  for (let i = 0; i < 6; i++) { const far = i < 3, y0 = far ? RY0 - 4.0 : RY1 + 1.5, y1 = far ? RY0 - 2.6 : RY1 + 3.5, x1 = far ? -14.0 : 11.9, look = i % 2 ? TK.kimono(2810 + i) : TK.who(2810 + i, i === 2 ? { phone: true } : {}); K.walker(T, look, [[-36, y0], [x1, y0], [x1, y1], [-36, y1]], 1.7, { phase: (i * 0.31) % 1 }); }
  K.walker(T, TK.who(2830), [[17, RY0 - 11], [17, RY1 + 11]], 1.8, { z: (x, y) => y < RY0 ? DZ * clamp((y - (RY0 - 11)) / 11, 0, 1) : y > RY1 ? DZ * clamp(1 - (y - RY1) / 11, 0, 1) : DZ });
  K.walker(T, TK.kimono(2831), [[18.6, RY1 + 11], [18.6, RY0 - 11]], 1.5, { phase: 0.4, z: (x, y) => y < RY0 ? DZ * clamp((y - (RY0 - 11)) / 11, 0, 1) : y > RY1 ? DZ * clamp(1 - (y - RY1) / 11, 0, 1) : DZ });
  K.walker(T, TK.salary(2832), [[15.6, RY1 + 11], [15.6, RY0 - 11]], 1.7, { phase: 0.75, z: (x, y) => y < RY0 ? DZ * clamp((y - (RY0 - 11)) / 11, 0, 1) : y > RY1 ? DZ * clamp(1 - (y - RY1) / 11, 0, 1) : DZ });
  // stopping on the bridge to look at the boats
  busy(TK.kimono(2833, { dir: 0 }), 20.0, -3.0, [['look', 2.4, 0], ['point', 1.6, 0], ['photo', 2.8, 0], ['talk', 2.0, 3]], { z: DZ, off: 1 });
  busy(TK.who(2834, { dir: 0 }), 20.0, -1.6, [['look', 2.0, 0], ['laugh', 1.2, 0], ['phone', 2.6, 0], ['look', 3.0, 1]], { z: DZ, off: 3 });
  // petals drifting down: small groups that fall slowly and sway
  for (let i = 0; i < 5; i++) T.actor({ layer: 'top', sample: 5, period: 10, grow: false,
    at(t) { if (LOOK.season !== 'spring') return null; const u = ((t * 0.12 + i * 0.21) % 1), f = Math.floor(t * 6 + i) % 6; return { x: -30 + i * 14 + u * 6, y: -22 + (i % 2) * 34 + u * 4, z: 11 - u * 10, key: f, f, alpha: Math.min(1, Math.min(u, 1 - u) * 8) }; },
    draw(g, st) { const o = g.p(0, 0, 0), R = RNG(st.f * 7 + 3); for (let k = 0; k < 6; k++) { const x = o[0] + (R() - 0.5) * 14, y = o[1] + (R() - 0.5) * 10, a = R() * Math.PI; g.fill2([[x - Math.cos(a) * 0.7, y - Math.sin(a) * 0.4], [x, y - 0.3], [x + Math.cos(a) * 0.7, y + Math.sin(a) * 0.4], [x, y + 0.3]], '#F2B6C2', true); } } });

  /* ---------------- the boats ---------------- */
  // two yakatabune, one each way; z on the water
  // (each through the middle of an outer arch, clear of the piers; anchored at the middle of its hull, which runs from
  // 6.2 behind its origin to 7.13 ahead, with that half-size as ext)
  [[1, -7.9, 0, 0], [-1, 1.9, 0.55, 1]].forEach(([dir, y, ph, k]) => T.actor({ sample: 0.3, period: 30, grow: false,
    at(t) { const u = ((t / 30) + ph) % 1, x = dir > 0 ? -40 + u * 80 : 40 - u * 80, a = Math.min(1, Math.min(u, 1 - u) * 12); return { x: x + dir * 0.47, y, z: WZ, key: k, alpha: a < 1 ? a : null, ext: [BOAT_H, 2.0] }; },
    draw(g, st) { g.at(-dir * 0.47, 0, 0, (g2) => TK.yakata(g2, dir > 0 ? 0 : Math.PI, {})); } }));

  /* ---------------- the other seasons ---------------- */
  // November and January: an old couple on the near terrace bench, a Sunday painter at an easel facing the bridge
  TK.group(T, [{ who: TK.who(2844, { dir: 1, sit: true, hair: '#8E8A84', glasses: true }), x: -21.6, y: RY1 + 5.2, z: 1.3 }, { who: TK.who(2845, { dir: 1, sit: true, hair: '#8E8A84', hairStyle: 'bob' }), x: -20.2, y: RY1 + 5.2, z: 1.3 }], { seed: 13, season: ['autumn', 'winter'] });
  busy(TK.who(2846, { dir: 3, cap: '#6B6A4A' }), -22, 15.5, [[{ n: 2, rate: 1.2, f: (i) => ({ hands: [[1.6, -11.6], [3.4 + i * 0.4, -16.4 + i * 0.6]] }) }, 4.4], ['look', 2.0], [{ n: 1, rate: 1, f: () => ({ hands: [[1.2, -11.0], [2.8, -15.6]] }) }, 2.4]], { season: 'autumn',
    after: (g) => { const a = g.p(1.8, -1.3, 0), t = [a[0] + 0.4, a[1] - 9.4]; g.segs2([a[0] - 1.6, a[1] + 0.6, t[0], t[1], a[0] + 1.8, a[1] - 0.2, t[0], t[1], a[0] + 0.6, a[1] + 1.2, t[0], t[1] + 1], '#8A6A4A', 0.45); const q = [[t[0] - 2.2, t[1] + 1.4], [t[0] + 2.4, t[1] + 0.4], [t[0] + 2.4, t[1] + 4.2], [t[0] - 2.2, t[1] + 5.2]]; g.fill2(q, '#F6F3EA', true); g.outline2(q, { w: 0.35, boil: false }); g.fill2([[t[0] - 1.4, t[1] + 3.6], [t[0] + 1.6, t[1] + 2.9], [t[0] + 1.6, t[1] + 3.7], [t[0] - 1.4, t[1] + 4.4]], '#8FB7D9', true); g.fill2([[t[0] - 0.4, t[1] + 3.3], [t[0] + 0.6, t[1] + 2.6], [t[0] + 1.2, t[1] + 3.1]], '#C9463E', true); } });
  // the fireworks over the river after dark on the last Saturday of July, launched from barges near Asakusa
  TK.fireworks(T, [[-22, -3, 24, '#FFC85A', 3.4, 0.0], [-6, -3, 30, '#FF7A6A', 4.1, 0.35], [8, -3, 26, '#8FE09A', 3.7, 0.7], [22, -3, 28, '#BFE3FF', 4.4, 0.15], [-14, -3, 34, '#FF9AD0', 3.9, 0.55], [14, -3, 36, '#FFD98A', 4.6, 0.85]], { water: WZ });
  // winter: black-headed gulls riding the river, and two flying over it
  [[-28, -4.6], [-19, -2.6], [-6, -4.2], [4, -1.4], [11, -4.8], [27, -3.4], [31, -2.0]].forEach(([x, y], i) => T.actor({ season: 'winter', sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 1.6 + i * 1.7) % 4; return { x: x + Math.sin(t * 0.3 + i) * 0.8, y, z: WZ + [0, 0.12, 0.2, 0.12][f], key: f + '.' + (i % 2), f }; },
    draw(g, st) { TK.gull2(g, g.p(0, 0, 0), i % 2 ? 1 : -1, false, 0); } }));
  [0, 1].forEach((i) => T.actor({ season: 'winter', layer: 'top', sample: 5, period: 18, grow: false,
    at(t) { const u = ((t / 18 + i * 0.5) % 1), x = -36 + u * 72, f = Math.floor(t * 4 + i) % 2, a = Math.min(1, Math.min(u, 1 - u) * 10); return { x, y: -4 + i * 3, z: 9 + i * 2 + Math.sin(u * 9) * 0.8, key: f, f, alpha: a < 1 ? a : null }; },
    draw(g, st) { TK.gull2(g, g.p(0, 0, 0), 1, true, st.f); } }));
});
