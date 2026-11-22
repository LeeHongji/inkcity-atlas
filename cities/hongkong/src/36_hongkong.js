'use strict';
/* Hong Kong's own kit (HK is created in 36_zh.js with the stroke table): the colours of a clear December evening, the
   people (light jackets, scarves, the red-white-blue bag, domestic helpers on their Sunday cardboard), the vehicles
   (ding-ding trams, red taxis, green and red minibuses, double-deckers), the buildings (glass towers, pastel
   residential slabs bristling with air-conditioners, tong lau shophouses with verandahs, bamboo scaffolding), the
   signs (boards and projecting neon blades lettered in real traditional characters), street furniture, and the boats
   (Star Ferry, the red-sailed junk, a lighter, a jetfoil, a police launch, sampans). Everything in tile-local u unless
   the name ends in 2 (wide px). */
HK.C = {
  pave: '#E6E1D5', paveD: '#D8D2C4', tile: '#E9DFC9', asph: '#D2CDC1', line: '#F6F4EE', yel: '#E3B93B',
  water: '#9BBABA', waterD: '#81A3A6', waterL: '#C9DAD6', glint: '#F3D9A2', wall: '#CFCAC0', wallD: '#B6B1A6',
  grass: '#A9C98A', grassD: '#86AA66', hill: '#9DBF7E', hillD: '#7FA463', rock: '#BDB5A3',
  glass: '#B9CDD6', glassD: '#93AEBD', lit: '#F4D58A', litD: '#E9B95E', steel: '#C7CCD0', conc: '#E3DED3',
  red: '#C8372D', redD: '#A42C24', green: '#2F6B4A', greenL: '#4E8A62', cream: '#EFE6C8', gold: '#D9A93E',
  neon: ['#FF4F7B', '#FF6A3D', '#46D3E6', '#F7D046', '#B07CFF', '#5BE08A'],
};
HK.PASTEL = ['#E9C9C0', '#CFE0D2', '#F0E3BC', '#D3DDE8', '#E8D3E2', '#F2D7B8', '#D9E7C5', '#E4E0D6', '#C9DCDF'];

/* ---------------- night (see SCENE.night): nothing in this section draws by day ----------------
   A command drawn in HK.NONE is invisible by day; at night it takes the colour HK.nite gives it. Night-only marks are
   fills inside a face that is already painted, segments, or discs in an actor, so the day's pixels, line boil and
   bounding boxes stay exactly as they were. */
HK.NONE = 'rgba(0,0,0,0)';
HK.WARM = '#FFE3A6';                                   // a lit interior seen through glass
/* the night look of every command drawn since i0 (fills, strokes, segments alike): o.nc a colour, true (its day colour)
   or fn(day colour) (undefined: graded as usual); o.light: a fill in an actor's drawing shines; o.spill: a lit shop
   floor that lays light on the pavement in front */
HK.nite = function (g, i0, o) {
  for (let k = i0; k < g.cmds.length; k++) {
    const d = g.cmds[k], c = typeof d.c === 'string' ? d.c : d.col, v = o.nc, n = v === true ? c : typeof v === 'function' ? v(c) : v;
    if (n) d.nc = n;
    if (o.light && (d.k === K_FILL || d.k === K_DISC)) d.light = true;
    if (o.spill && d.k === K_FILL) d.spill = true;
  }
};
/* a lit colour from a day colour: lerp from its moonlit grade towards the day colour (k 1: the day colour itself) */
HK.lift = (k) => (c) => (typeof c === 'string' && c[0] === '#' ? mix(nightColour(c), c, k) : undefined);
/* lines of bulbs or LED that exist only at night (a Christmas display, a string of lights): wide-px segments */
HK.leds2 = function (g, segs, col, w) { if (!segs.length) return; const i0 = g.cmds.length; g.segs2(segs, HK.NONE, w || 0.45); HK.nite(g, i0, { nc: col }); };
/* bulbs along a wide-px polyline, one every `step` px (dots: zero-length segments with round caps) */
HK.bulbs2 = function (g, pts, step, col, w) {
  const s = [];
  for (let i = 0; i + 1 < pts.length; i++) { const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step)); for (let k = 0; k < n; k++) { const x = lerp(a[0], b[0], k / n), y = lerp(a[1], b[1], k / n); s.push(x, y, x + 0.01, y); } }
  const e = pts[pts.length - 1]; s.push(e[0], e[1], e[0] + 0.01, e[1]);
  HK.leds2(g, s, col, w || 0.7);
};
/* fairy lights wound through the crown of the tree just drawn (K.tree / K.palm leave its crown in g.glows): n bulbs */
HK.fairy = function (g, n, cols, seed) {
  const e = g.glows && g.glows[g.glows.length - 1]; if (!e) return;
  const R = RNG(seed || Math.round(e.x * 7 + e.y * 3)), by = {};
  for (let i = 0; i < n; i++) { const a = R() * TAU, d = Math.sqrt(R()) * e.r * 0.82, x = e.x + Math.cos(a) * d, y = e.y + Math.sin(a) * d * 0.85, c = cols[i % cols.length]; (by[c] || (by[c] = [])).push(x, y, x + 0.01, y); }
  for (const c in by) HK.leds2(g, by[c], c, 1.1);
  g.glow2('lantern', [e.x, e.y], [e.x, e.y], { r: Math.min(2.2, e.r * 0.3), col: cols[0] });
};
/* lights set in a promenade railing along x (from a to b at y), one every `step` u: they light the walk and, on the
   Island's seawall, lay their columns on the harbour */
HK.railLights = function (g, a, b, y, o) {
  o = o || {}; const st = o.step || 7, n = Math.max(1, Math.round((b - a) / st));
  for (let i = 0; i < n; i++) g.glow('lamp', a + (i + 0.5) * (b - a) / n, y, (o.base || 0) + (o.z || 1.75), { r: o.r || 0.75, base: o.base || 0 });
};
/* December: a Christmas tree drawn in lights on a building face (K.on's coordinates: face, plane p, the tree centred on
   a = ac, from z0 to its star at z1, half as wide as hw at its foot). Bulbs along its tiers, garlands, baubles, a star. */
HK.xmasTree = function (g, face, p, ac, z0, z1, hw, o) {
  o = o || {}; const P = (a, z) => g.p.apply(g, K.pt(face, p + 0.08, face === 'L' ? a : a, z)), zb = z0 + 1.4, H = z1 - zb;
  const side = (s) => [[ac, z1], [ac + s * hw * 0.42, z1 - H * 0.34], [ac + s * hw * 0.24, z1 - H * 0.34], [ac + s * hw * 0.72, z1 - H * 0.68], [ac + s * hw * 0.5, z1 - H * 0.68], [ac + s * hw, zb], [ac, zb]];
  // the tree itself: a net of green lights over the façade, then its outline in bulbs
  g.fill2(side(-1).slice(0, 6).concat(side(1).slice(0, 6).reverse()).map(([a, z]) => P(a, z)), HK.NONE); g.mark({ nc: '#2F7550' });
  for (const s of [-1, 1]) { const pts = side(s).map(([a, z]) => P(a, z)), L = []; for (let i = 0; i + 1 < pts.length; i++) L.push(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]); HK.leds2(g, L, '#FFC24A', 0.6); HK.bulbs2(g, pts, 2.4, o.col || '#FFE7A8', 1.5); }
  // garlands drooping across each tier
  for (const [t0, t1, w0, w1] of [[0.18, 0.3, 0.2, 0.36], [0.5, 0.62, 0.36, 0.6], [0.8, 0.94, 0.55, 0.9]]) {
    const pts = []; for (let k = 0; k <= 8; k++) { const u = k / 8, w = lerp(w0, w1, u); pts.push(P(ac - hw * w + 2 * hw * w * u, z1 - H * lerp(t0, t1, u) - Math.sin(Math.PI * u) * H * 0.05)); }
    HK.bulbs2(g, pts, 2.0, '#FF6A5A', 1.1);
  }
  // baubles and the trunk
  const R = RNG(Math.round(ac * 13 + z1 * 7)), bb = {}; for (let i = 0; i < 14; i++) { const v = 0.15 + R() * 0.8, w = hw * v * 0.85, a = ac + (R() * 2 - 1) * w, q = P(a, z1 - H * v), c = ['#8FD8FF', '#FFF3C4', '#FF9AD0'][i % 3]; (bb[c] || (bb[c] = [])).push(q[0], q[1], q[0] + 0.01, q[1]); }
  for (const c in bb) HK.leds2(g, bb[c], c, 1.6);
  HK.bulbs2(g, [P(ac - hw * 0.12, zb), P(ac - hw * 0.12, z0), P(ac + hw * 0.12, z0), P(ac + hw * 0.12, zb)], 2.0, '#E9A04A', 1.0);
  // the star on top
  const c = P(ac, z1 + 0.7), r = 2.2, st = []; for (let i = 0; i < 5; i++) { const a0 = -Math.PI / 2 + TAU * i / 5, a1 = -Math.PI / 2 + TAU * (i + 2) / 5; st.push(c[0] + Math.cos(a0) * r, c[1] + Math.sin(a0) * r, c[0] + Math.cos(a1) * r, c[1] + Math.sin(a1) * r); }
  HK.leds2(g, st, '#FFF3C4', 0.8);
  g.glow2('lantern', c, c, { r: 2.8, col: '#FFF0C0' });
  for (const [a, z] of [[ac - hw * 0.55, zb + H * 0.2], [ac + hw * 0.55, zb + H * 0.2], [ac, zb + H * 0.55]]) { const m = P(a, z); g.glow2('neon', m, m, { r: hw * 0.75, col: o.col || '#FFD27A' }); }
};
/* December: snowflakes of white LED on a face (K.on's coordinates): [a, z, radius in u] each */
HK.snowflakes = function (g, face, p, list) {
  const s = [];
  for (const [a, z, r] of list) {
    const c = g.p.apply(g, K.pt(face, p + 0.08, a, z)), R = r * 3.2;
    for (let i = 0; i < 6; i++) {
      const t = Math.PI / 2 + TAU * i / 6, ex = c[0] + Math.cos(t) * R, ey = c[1] - Math.sin(t) * R;
      s.push(c[0], c[1], ex, ey);
      for (const f of [0.45, 0.72]) { const mx = c[0] + Math.cos(t) * R * f, my = c[1] - Math.sin(t) * R * f, bl = R * (0.95 - f) * 0.7; for (const d of [-0.6, 0.6]) s.push(mx, my, mx + Math.cos(t + d) * bl, my - Math.sin(t + d) * bl); }
    }
    g.glow2('neon', c, c, { r: R * 0.45, col: '#CFE6FF' });
  }
  HK.leds2(g, s, '#F2F8FF', 0.45);
};
/* a light in an actor's drawing (a lamp on a boat, a ferry's deck lights): a disc invisible by day, shining at night */
HK.light2 = function (g, pt, r, col) { g.disc2(pt, r, HK.NONE); g.mark({ nc: col, light: true }); };
/* a lit sign's halo, on a face (K.on's coordinates): small glows just beyond the ends of its long side (and one off its
   outer edge if it is long), never on its middle, so the light washes round the sign and its characters stay readable */
HK.signGlow = function (g, face, p, a0, a1, z0, z1, col, k) {
  const W = Math.abs(a1 - a0), H = z1 - z0, vert = H * 3.46 > W * 2.92, sa = Math.sign(a1 - a0) || 1;
  const r = clamp((vert ? W * 2.92 : H * 3.46) * (k || 0.3) * 1.4, 0.9, 3.2), pts = [];
  if (vert) { if (H > 5) pts.push([(a0 + a1) / 2, z0 - 0.25], [(a0 + a1) / 2, z1 + 0.25]); if (H > 7 || H <= 5) pts.push([a1 + sa * 0.3, (z0 + z1) / 2]); }   // a small sign: one glow, off its edge
  else { if (W > 5) pts.push([a0 - sa * 0.25, (z0 + z1) / 2], [a1 + sa * 0.25, (z0 + z1) / 2]); if (W > 8 || W <= 5) pts.push([(a0 + a1) / 2, z0 - 0.3]); }
  for (const [a, z] of pts) { const c = g.p.apply(g, K.pt(face, p + 0.12, a, z)); g.glow2('neon', c, c, { r, col }); }
};

/* ---------------- ground ---------------- */
/* a flush rectangle of ground; cut: sides at the map's outer edge show their 1.1 deep section */
HK.ground = function (g, x0, y0, x1, y1, col, o) {
  o = o || {}; const cut = o.cut || '', D = 1.1;
  if (cut.indexOf('y') >= 0) { g.fill([[x0, y1, -D], [x1, y1, -D], [x1, y1, 0], [x0, y1, 0]], C.slab); g.line([[x0, y1, 0], [x0, y1, -D], [x1, y1, -D], [x1, y1, 0]], { w: 0.9, boil: false }); }
  if (cut.indexOf('x') >= 0) { g.fill([[x1, y1, -D], [x1, y0, -D], [x1, y0, 0], [x1, y1, 0]], C.slabD); g.line([[x1, y1, 0], [x1, y1, -D], [x1, y0, -D], [x1, y0, 0]], { w: 0.9, boil: false }); }
  g.fill(K.rect(x0, y0, x1, y1, 0), col || HK.C.pave);
  if (o.line !== false) g.outline(K.rect(x0, y0, x1, y1, 0), { w: 0.9, boil: false });
};
/* square paving tiles: faint joints, pale scuffs */
HK.paving = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const st = o.step || 2.4, s = [];
  if (o.col) g.fill(K.rect(x0, y0, x1, y1, 0), o.col);
  for (let x = Math.ceil(x0 / st) * st; x < x1; x += st) { const a = g.p(x, y0, 0), b = g.p(x, y1, 0); s.push(a[0], a[1], b[0], b[1]); }
  for (let y = Math.ceil(y0 / st) * st; y < y1; y += st) { const a = g.p(x0, y, 0), b = g.p(x1, y, 0); s.push(a[0], a[1], b[0], b[1]); }
  g.segs2(s, o.joint || '#D6D0C2', 0.26);
  g.scuff(K.rect(x0, y0, x1, y1, 0), { dir: -0.9, len: 1.6, c: '#F3F0E8', dens: 0.2, w: 0.5, spread: 1.0 });
};
/* the harbour seawall seen from the water side (a face looking +y at y = p, from x0 to x1), granite courses */
HK.seawall = function (g, x0, x1, p, wl) {
  g.fill(K.on('L', p, x0, x1, wl, 0), HK.C.wall);
  g.fill(K.on('L', p + 0.01, x0, x1, wl, wl + 0.5), '#7E8E76');
  const s = []; for (let z = wl + 0.95; z < -0.1; z += 0.75) { const a = g.p(x0, p + 0.02, z), b = g.p(x1, p + 0.02, z); s.push(a[0], a[1], b[0], b[1]); }
  for (let z = wl + 0.5, r = 0; z < -0.2; z += 0.75, r++) for (let x = x0 + (r % 2) * 1.4; x < x1; x += 2.8) { const a = g.p(x, p + 0.02, z), b = g.p(x, p + 0.02, Math.min(z + 0.75, -0.1)); s.push(a[0], a[1], b[0], b[1]); }
  g.segs2(s, HK.C.wallD, 0.28);
  g.line([[x0, p, 0], [x1, p, 0]], { w: 0.85, boil: false }); g.line([[x0, p, wl], [x1, p, wl]], { w: 0.5, c: '#4E5E4A', boil: false });
};

/* ---------------- people ---------------- */
const HK_JACKET = ['#2F343B', '#3B3F47', '#26314F', '#B9A27D', '#6C7A89', '#8E2F2F', '#5A6B5A', '#E7E2D6', '#3F5F8F', '#C9584B', '#E6C24F', '#7A6A55', '#D98AA4', '#F0EDE4'];
const HK_BOTS = ['#2F343B', '#3F4D63', '#2B3A55', '#6B7B8C', '#3B3F47', '#B9A27D', '#4A5A78', '#5A4A3C', '#E7E2D6'];
/* a Hong Kong citizen in December: long sleeves, many in light jackets, some scarves */
HK.who = function (seed, o) {
  const R = RNG(seed * 7121 + 5), w = K.who(seed), tourist = R() < 0.1;
  if (!tourist) {
    w.skin = R.pick(['#EFCDB0', '#EFCDB0', SKIN[0], SKIN[0], SKIN[1], SKIN[1], '#E3B894']);
    const hr = R(); w.hair = hr < 0.72 ? R.pick(['#1F1A18', '#2B2420', '#2B2420', '#3D2B1F']) : hr < 0.88 ? R.pick(['#5A3A24', '#7B4E2C']) : R.pick(['#8E8A84', '#B9B4AC']);
    w.hairStyle = R.pick(['short', 'short', 'bob', 'long', 'buzz', 'pony', 'bun', 'short', 'bob']); w.beard = false;
  }
  w.top = R.pick(HK_JACKET); w.bot = R.pick(HK_BOTS); w.bare = false; w.shorts = false; w.build = R() * 0.7;
  if (R() < 0.45) w.jacket = R.pick(['#F3F1EA', '#E9DCC0', '#CFE0EA', '#3B3F47', '#E6C24F']);
  if (R() < 0.16) w.scarf = R.pick(['#C9584B', '#E6C24F', '#3F5F8F', '#E7E2D6', '#8E2F2F']);
  if (R() < 0.12 && !w.jacket) w.dress = R.pick(['#3B3F47', '#B9A27D', '#26314F', '#8E2F2F']);
  w.glasses = R() < 0.22; w.cap = R() < 0.07 ? R.pick(['#3B3F47', '#F0EDE4', '#26314F', '#C9584B']) : undefined;
  return Object.assign(w, o || {});
};
/* a domestic helper on her Sunday off: Southeast Asian, bright tops, jeans */
HK.helper = function (seed, o) {
  const R = RNG(seed * 913 + 17);
  return Object.assign(HK.who(seed), { skin: R.pick([SKIN[2], SKIN[3], SKIN[3], SKIN[4]]), hair: R.pick(['#1F1A18', '#2B2420', '#3D2B1F']), hairStyle: R.pick(['long', 'pony', 'bun', 'long', 'bob']),
    top: R.pick(['#E06A8A', '#F0A23A', '#5FA58F', '#7FB7D9', '#F3F1EA', '#E6C24F', '#B07CC9', '#C9584B']), bot: R.pick(['#3F4D63', '#2B3A55', '#4A5A78']), jacket: undefined, dress: undefined, cap: undefined, glasses: R() < 0.1, scarf: undefined }, o || {});
};
/* an older resident: grey hair, cardigan, slower */
HK.elder = function (seed, o) { const R = RNG(seed * 55 + 3); return Object.assign(HK.who(seed), { hair: R.pick(['#B9B4AC', '#8E8A84', '#D9D4C8']), top: R.pick(['#7A6A55', '#5A6B5A', '#8E2F2F', '#B9A27D', '#3B3F47']), jacket: '#F3F1EA', build: 0.4 + R() * 0.3, dress: undefined, hairStyle: R.pick(['short', 'bun', 'short', 'bob']) }, o || {}); };
/* K.person plus Hong Kong extras drawn on the returned points */
HK.person = function (g, x, y, z, w) {
  const dir = w.dir | 0, back = dir >= 2, sg = (dir === 0 || dir === 3) ? 1 : -1, k = w.k || 1;
  let o = w;
  if (w.cross) o = Object.assign({}, w, { pose: 'sit', noLegs: true });
  const r = K.person(g, x, y, w.cross ? z - 1.05 : z, o);   // 'sit' puts the feet at the anchor and the hips 1.27 u above it
  const hn = r.hands[0], sp = r.shoulders, mx = (sp[0][0] + sp[1][0]) / 2;
  if (w.cross) {         // sitting cross-legged on the ground: folded legs as a low lens in the trouser colour
    const hp = r.hip, c = [hp[0], hp[1] + 0.9 * k];
    const lens = [[c[0] - 4.2 * k, c[1] + 0.2 * k], [c[0] - 2.4 * k, c[1] - 1.3 * k], [c[0] + 2.4 * k, c[1] - 1.3 * k], [c[0] + 4.2 * k, c[1] + 0.2 * k], [c[0] + 2.2 * k, c[1] + 1.4 * k], [c[0] - 2.2 * k, c[1] + 1.4 * k]];
    g.fill2(lens, w.dress || w.bot, true); g.outline2(lens, { w: 0.3, c: '#3A3128', boil: false });
    for (const s of [-1, 1]) g.fill2(arcPts(c[0] + s * 3.6 * k, c[1] + 0.5 * k, 0.7 * k, 0, TAU, 6), w.shoe || '#3A3530', true);
  }
  if (w.scarf) { const y0 = sp[0][1] - 0.2 * k; g.fill2([[mx - 1.9 * k, y0 - 0.6 * k], [mx + 1.9 * k, y0 - 0.6 * k], [mx + 1.7 * k, y0 + 0.8 * k], [mx - 1.7 * k, y0 + 0.8 * k]], w.scarf, true); if (!back) g.fill2([[mx + sg * 0.6 * k, y0], [mx + sg * 1.5 * k, y0], [mx + sg * 1.3 * k, y0 + 3.4 * k], [mx + sg * 0.5 * k, y0 + 3.2 * k]], shade(w.scarf, 0.12), true); }
  if (w.rwb) {           // the red-white-blue nylon bag
    const b = [hn[0] - 2.2 * k, hn[1] + 0.3 * k], q = [[b[0], b[1]], [b[0] + 4.4 * k, b[1]], [b[0] + 4.6 * k, b[1] + 3.4 * k], [b[0] - 0.2 * k, b[1] + 3.4 * k]];
    g.fill2(q, '#F3F1EA', true);
    for (let i = 0; i < 4; i++) { const u = i / 4; g.fill2([[b[0] + 4.4 * k * u, b[1]], [b[0] + 4.4 * k * (u + 0.1), b[1]], [b[0] + 4.5 * k * (u + 0.1), b[1] + 3.4 * k], [b[0] + 4.5 * k * u, b[1] + 3.4 * k]], i % 2 ? '#2F4F9A' : '#C8372D', true); }
    g.fill2([[b[0], b[1] + 1.4 * k], [b[0] + 4.5 * k, b[1] + 1.4 * k], [b[0] + 4.5 * k, b[1] + 1.8 * k], [b[0], b[1] + 1.8 * k]], '#2F4F9A', true);
    g.outline2(q, { w: 0.3, c: '#3A3128', boil: false });
  }
  if (w.bag) g.fill2([[hn[0] - 1.2 * k, hn[1] + 0.2 * k], [hn[0] + 1.2 * k, hn[1] + 0.2 * k], [hn[0] + 1.3 * k, hn[1] + 2.4 * k], [hn[0] - 1.3 * k, hn[1] + 2.4 * k]], w.bag, true);
  if (w.phone) { g.fill2([[hn[0] - 0.42, hn[1] - 1.1], [hn[0] + 0.42, hn[1] - 1.1], [hn[0] + 0.42, hn[1] + 0.3], [hn[0] - 0.42, hn[1] + 0.3]], '#2A2622', true); g.mark({ nc: '#CFE6FF', light: true }); }   // a lit screen at night
  if (w.cup) { const p = [hn[0], hn[1] - 0.3 * k]; g.fill2([[p[0] - 0.55 * k, p[1] + 0.3 * k], [p[0] + 0.55 * k, p[1] + 0.3 * k], [p[0] + 0.66 * k, p[1] - 1.3 * k], [p[0] - 0.66 * k, p[1] - 1.3 * k]], w.cup, true); }
  if (w.cage) {          // a bird cage (the old men's morning walk, still out at dusk): a domed bamboo cage on a hook
    const p = [hn[0] + sg * 0.4 * k, hn[1] + 0.8 * k], cw = 2.0 * k, ch = 3.0 * k;
    g.fine2([[hn[0], hn[1]], p], { w: 0.25, c: '#5A4632' });
    const dome = arcPts(p[0], p[1] + 1.2 * k, cw, Math.PI, TAU, 8), bars = [];
    for (let i = 0; i <= 6; i++) { const xx = p[0] - cw + 2 * cw * i / 6; bars.push(xx, p[1] + 1.2 * k - Math.sqrt(Math.max(0, cw * cw - (xx - p[0]) ** 2)) * 0.9, xx, p[1] + ch); }
    g.fill2(dome.concat([[p[0] + cw, p[1] + ch], [p[0] - cw, p[1] + ch]]), 'rgba(243,236,214,0.55)', true);
    g.segs2(bars, '#9C7B4E', 0.22); g.fill2([[p[0] - cw * 1.05, p[1] + ch - 0.4 * k], [p[0] + cw * 1.05, p[1] + ch - 0.4 * k], [p[0] + cw * 1.05, p[1] + ch], [p[0] - cw * 1.05, p[1] + ch]], '#8A6A44', true);
    g.disc2([p[0] + 0.3 * k, p[1] + 2.0 * k], 0.45 * k, '#E6C24F');
  }
  if (w.helmet) { const c = r.crown, hr = r.headR; g.fill2(arcPts(c[0], c[1] + 0.55 * hr, 1.2 * hr, Math.PI, TAU, 8).concat([[c[0] + 1.35 * hr, c[1] + 0.6 * hr], [c[0] - 1.35 * hr, c[1] + 0.6 * hr]]), w.helmet, true); }
  if (w.apron) { const hp = r.hip; g.fill2([[mx - 2.0 * k, sp[0][1] + 1.6 * k], [mx + 2.0 * k, sp[0][1] + 1.6 * k], [hp[0] + 2.2 * k, hp[1] + 3.8 * k], [hp[0] - 2.2 * k, hp[1] + 3.8 * k]], w.apron, true); }
  return r;
};
/* a bust (people seen over a rail, on a ferry deck) */
HK.bust2 = function (g, p, w, k) {
  k = k || 1; const s = (u, v) => [p[0] + u * k, p[1] + v * k];
  g.fill2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], w.top, true);
  g.fill2([s(-0.55, -4.6), s(0.55, -4.6), s(0.5, -5.8), s(-0.5, -5.8)], shade(w.skin, 0.12), true);
  g.disc2(s(0, -7.6), 1.95 * k, w.skin); g.fill2(K.curve([s(-2.05, -7.2), s(-1.9, -8.9), s(0, -9.75), s(1.9, -8.9), s(2.05, -7.3), s(1.2, -8.2), s(-1.0, -8.25)], 2, true), w.hair, true);
  g.disc2(s(-0.6, -7.4), 0.22 * k, '#2A2420'); g.disc2(s(0.65, -7.4), 0.2 * k, '#2A2420');
  g.outline2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], { w: 0.35, c: '#3A3128', boil: false });
};
/* a walker on a route: out and back along the points (o.loop: a closed loop) */
HK.walker = function (T, who, pts, speed, o) {
  o = o || {}; const seg = [], L = [0];
  if (pts.length > 2 && !o.loop) pts = pts.concat(pts.slice(1, -1).reverse());
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
    draw(g, st) { HK.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
};
HK.stand = function (T, x, y, who, o) { o = o || {}; return T.cast([x, y], (g) => HK.person(g, x, y, o.z || 0, who), { on: true, name: o.name }); };

/* ---------------- signs: boards and neon blades with real characters ---------------- */
/* a board on a face (K.on's coordinates) with Chinese characters, as big as fit: a column if the board is tall.
   o.en: a Latin line under the characters; o.neon: glow colour (the strokes are then drawn bright on a dark board). */
HK.board = function (g, face, p, a0, a1, z0, z1, col, str, o) {
  o = o || {}; const q = K.on(face, p + 0.05, a0, a1, z0, z1), i0 = g.cmds.length;
  // at night: a lit sign (o.dark: not lit); a neon board keeps its tubes bright on the dark board
  const night = () => { if (o.dark) return; if (o.neon) { HK.nite(g, i1, { nc: true }); HK.signGlow(g, face, p, a0, a1, z0, z1, o.neon, 0.34); } else { HK.nite(g, i0, { nc: true }); HK.signGlow(g, face, p, a0, a1, z0, z1, col, 0.26); } };
  g.fill(q, col); if (o.line !== false) g.outline(q, { w: o.w || 0.4, c: o.c || shade(col, 0.5), boil: false });
  if (o.rim) g.outline(K.on(face, p + 0.06, a0 + 0.25 * Math.sign(a1 - a0), a1 - 0.25 * Math.sign(a1 - a0), z0 + 0.25, z1 - 0.25), { w: 0.3, c: o.rim, boil: false });
  const i1 = g.cmds.length;
  if (!str) { night(); return; }
  const W = Math.abs(a1 - a0), H = z1 - z0, n = Array.from(str).length, vert = o.vert != null ? o.vert : H > W * 1.25;
  const ink = o.ink || (hex2rgb(col).reduce((x, y) => x + y) > 430 ? '#2C271C' : '#FBF8EE');
  const enH = o.en ? Math.min(H * 0.18, W * 0.9 / K.textW(o.en, 1)) : 0, Hc = H - (o.en ? enH * 1.8 : 0);
  let h;
  if (vert) h = Math.min(W * 0.78, Hc * 0.86 / (n + (n - 1) * 0.14));
  else h = Math.min(Hc * 0.74, W * 0.88 / (n + (n - 1) * 0.14));
  const am = (a0 + a1) / 2, ztop = vert ? z0 + (o.en ? enH * 1.8 : 0) + Hc / 2 + HK.zhW(str, h) / 2 : z0 + (o.en ? enH * 1.8 : 0) + Hc / 2 + h / 2;
  HK.zhOn(g, face, p + 0.02, vert ? am : am, ztop, h, str, o.neon ? '#FFF6E8' : ink, { center: !vert, vert, glow: o.neon ? o.neon : null, w: o.sw });
  if (o.en) K.text(g, face, p + 0.03, am, z0 + enH * 0.6, enH, o.en, o.neon ? o.neon : ink, { center: true });
  night();
};
/* a projecting sign: a board standing out from a façade at (x, y), out along +y (axis 'y', from a face looking +y) or
   +x (axis 'x'), from z0 to z1, with its characters on the side we see. o.neon: glow colour; o.frame: the bracket. */
HK.blade = function (g, x, y, axis, out, z0, z1, col, str, o) {
  o = o || {}; const th = 0.35, i0 = g.cmds.length;
  const b = axis === 'y' ? [x - th / 2, y, x + th / 2, y + out] : [x, y - th / 2, x + out, y + th / 2];
  const tone = { t: shade(col, -0.1), l: col, r: shade(col, 0.08) };
  K.box(g, b[0], b[1], b[2], b[3], z0, z1, tone, { w: 0.4, boil: false });
  // the bracket: two arms back to the wall
  const arm = []; for (const z of [z0 + 0.3, z1 - 0.3]) { const a = g.p(x, y, z), e = axis === 'y' ? g.p(x, y + out * 0.25, z) : g.p(x + out * 0.25, y, z); arm.push(a[0], a[1], e[0], e[1]); } g.segs2(arm, '#4A4540', 0.35);
  const face = axis === 'y' ? 'R' : 'L', p = axis === 'y' ? b[2] : b[3], a0 = axis === 'y' ? y + 0.15 : x + 0.15, a1 = axis === 'y' ? y + out - 0.15 : x + out - 0.15;
  // at night: a neon blade's tubes burn on its dark board; a plain blade is a lit box
  if (!o.neon) HK.nite(g, i0, { nc: (c) => (c === '#4A4540' ? undefined : c) });
  HK.signGlow(g, face, p, a0, a1, z0, z1, o.neon || col, o.neon ? 0.4 : 0.3);
  if (!str && !o.en) return;
  if (o.inner) g.fill(K.on(face, p + 0.03, a0 + 0.1, a1 - 0.1, z0 + 0.2, z1 - 0.2), o.inner);
  const W = Math.abs(a1 - a0), H = z1 - z0, n = Array.from(str || '').length, ink = o.ink || '#FBF8EE';
  if (str) {
    const h = Math.min(W * 0.8, (H - 0.4) * 0.9 / (n + (n - 1) * 0.14)), ztop = (z0 + z1) / 2 + HK.zhW(str, h) / 2;
    const i1 = g.cmds.length;
    HK.zhOn(g, face, p + 0.02, (a0 + a1) / 2, ztop, h, str, o.neon ? '#FFF7EC' : ink, { vert: true, glow: o.neon || null, w: o.sw });
    HK.nite(g, i1, { nc: true });
  }
};
/* a neon tube outline (a frame round a board, a stripe): wide-px points, glowing */
HK.neonLine2 = function (g, pts, col, w) { g.line2(pts, { w: (w || 0.5) * 2.4, c: col.length === 7 ? col + '55' : col, boil: false, ext: 0, wob: 0.1 }); g.line2(pts, { w: w || 0.5, c: '#FFF6EC', boil: false, ext: 0, wob: 0.1 }); };
/* the pawnshop sign: a bat holding a coin, hung out from the corner (the character 押 on the coin) */
HK.pawn = function (g, x, y, z, o) {
  o = o || {}; const c = g.p(x, y, z), r = 3.2, i0 = g.cmds.length;
  g.fine2([g.p(x, y - (o.out || 3), z + 2.4), [c[0], c[1] - r - 1.6]], { w: 0.35, c: '#4A4540' });
  // the bat's wings (the coin hangs below)
  const wing = (s) => [[c[0], c[1] - r - 0.6], [c[0] + s * 2.6, c[1] - r - 2.4], [c[0] + s * 5.0, c[1] - r - 1.4], [c[0] + s * 4.2, c[1] - r - 0.2], [c[0] + s * 3.0, c[1] - r + 0.4], [c[0] + s * 1.4, c[1] - r]];
  g.fill2(wing(-1), '#A42C24', true); g.fill2(wing(1), '#A42C24', true);
  g.fill2(arcPts(c[0], c[1], r, 0, TAU, 20), '#C8372D', true); g.ring2(c, r, { w: 0.45, c: '#6E1E18' });
  g.ring2(c, r * 0.82, { w: 0.25, c: '#E6C24F' });
  // the character itself, flat to the screen: map grid (0..20) to wide px around the centre
  const s = r * 1.15 / 20, segs = [];
  for (const st of HK.ZH['押']) for (let i = 0; i + 3 < st.length; i += 2) segs.push(c[0] - r * 0.575 + st[i] * s, c[1] - r * 0.575 + st[i + 1] * s, c[0] - r * 0.575 + st[i + 2] * s, c[1] - r * 0.575 + st[i + 3] * s);
  g.segs2(segs, '#F6E7B0', 0.32);
  HK.nite(g, i0 + 1, { nc: (k) => (k === '#6E1E18' ? undefined : k) }); g.glow2('neon', c, c, { r: r * 1.5, col: '#FF6A3D' });   // lit at night
};

/* ---------------- buildings ---------------- */
/* a glass office tower: curtain wall with floor bands and mullions, some floors lit (evening). o.col glass,
   o.fl floor height, o.ml mullion pitch, o.lit fraction of lit floors, o.seed */
HK.tower = function (g, x0, y0, x1, y1, z0, z1, o) {
  o = o || {}; g.boilP = 0.25;
  const col = o.col || HK.C.glass, tone = o.tone || { t: shade(col, -0.18), l: col, r: shade(col, 0.14) };
  K.box(g, x0, y0, x1, y1, z0, z1, tone, { w: o.w || 0.85 });
  const fl = o.fl || 2.4, ml = o.ml || 2.2, R = RNG(o.seed || Math.round(x0 * 7 + y0 * 13 + z1));
  const faces = [['L', y1, x0, x1], ['R', x1, y0, y1]];
  for (const [f, p, a0, a1] of faces) {
    // lit floors: warm bands across the face
    const dayLit = new Set();
    for (let z = z0 + fl; z < z1 - fl * 0.6; z += fl) if (R() < (o.lit == null ? 0.22 : o.lit)) {
      const sa = a0 + (a1 - a0) * R() * 0.5, ea = sa + (a1 - a0) * (0.25 + R() * 0.5);
      g.fill(K.on(f, p + 0.02, sa, Math.min(ea, a1 - 0.2), z + 0.25, z + fl - 0.35), f === 'L' ? HK.C.lit : HK.C.litD); g.mark({ nc: true });
      dayLit.add(Math.round(z * 10));
    }
    // at night the other floors light up too, window bay by window bay (invisible by day)
    if (o.nwin !== 0) for (let z = z0 + fl; z < z1 - fl * 0.6; z += fl) {
      if (dayLit.has(Math.round(z * 10))) continue;
      const n = Math.max(1, Math.round((a1 - a0 - 0.4) / ml)), w = (a1 - a0 - 0.4) / n;
      const sh = o.nwin == null ? 0.6 : typeof o.nwin === 'object' ? o.nwin[f] : o.nwin;
      for (let i = 0; i < n; i++) { g.fill(K.on(f, p + 0.025, a0 + 0.2 + i * w + 0.18, a0 + 0.2 + (i + 1) * w - 0.18, z + 0.3, z + fl - 0.4), HK.NONE); g.mark({ win: sh }); }
    }
    const s = [];
    for (let z = z0 + fl; z < z1 - 0.3; z += fl) { const a = g.p.apply(g, K.pt(f, p + 0.03, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.03, a1, z)); s.push(a[0], a[1], b[0], b[1]); }
    for (let a = a0 + ml; a < a1 - 0.3; a += ml) { const q0 = g.p.apply(g, K.pt(f, p + 0.03, a, z0)), q1 = g.p.apply(g, K.pt(f, p + 0.03, a, z1)); s.push(q0[0], q0[1], q1[0], q1[1]); }
    g.segs2(s, o.grid || shade(col, 0.3), 0.3);
  }
};
/* a residential slab: pastel walls, strip windows per floor, air-conditioners under some windows, laundry poles.
   o.col, o.fl, o.n windows per bay row, o.seed. Cheap: one band per floor and segments. */
HK.resi = function (g, x0, y0, x1, y1, z0, z1, o) {
  o = o || {}; g.boilP = 0.25;
  const col = o.col || '#E9C9C0', fl = o.fl || 2.0, R = RNG(o.seed || Math.round(x0 * 11 + y1 * 5 + z1));
  K.box(g, x0, y0, x1, y1, z0, z1, { t: shade(col, -0.1), l: col, r: shade(col, 0.1) }, { w: o.w || 0.8 });
  for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
    const segs = [], ac = [], lau = [], wp = o.wp || 1.7;
    for (let z = z0 + (o.base || fl); z < z1 - fl * 0.5; z += fl) {
      for (let a = a0 + 0.5; a + wp * 0.6 < a1 - 0.3; a += wp) {
        const lit = R() < (o.lit == null ? 0.18 : o.lit);
        g.fill(K.on(f, p + 0.02, a, a + wp * 0.62, z + 0.45, z + fl - 0.5), lit ? (f === 'L' ? HK.C.lit : HK.C.litD) : (f === 'L' ? '#9FB3BF' : '#8BA0AD')); g.mark({ win: lit ? 0.96 : (o.nwin || 0.62) });
        if (R() < 0.3) { const q = g.p.apply(g, K.pt(f, p + 0.25, a + wp * 0.3, z + 0.25)); ac.push(q); }
        if (R() < 0.08) { const q0 = g.p.apply(g, K.pt(f, p + 0.05, a + wp * 0.1, z + fl - 0.55)); lau.push(q0); }
      }
      const s0 = g.p.apply(g, K.pt(f, p + 0.03, a0, z + 0.2)), s1 = g.p.apply(g, K.pt(f, p + 0.03, a1, z + 0.2)); segs.push(s0[0], s0[1], s1[0], s1[1]);
    }
    g.segs2(segs, shade(col, 0.22), 0.28);
    for (const q of ac) { g.fill2([[q[0] - 1.1, q[1] - 1.2], [q[0] + 1.1, q[1] - 1.2], [q[0] + 1.1, q[1] + 0.2], [q[0] - 1.1, q[1] + 0.2]], '#F3F1EA', true); g.outline2([[q[0] - 1.1, q[1] - 1.2], [q[0] + 1.1, q[1] - 1.2], [q[0] + 1.1, q[1] + 0.2], [q[0] - 1.1, q[1] + 0.2]], { w: 0.22, c: '#8C8576', boil: false }); }
    for (const q of lau) { const d = f === 'L' ? [1.5, 0.8] : [-1.5, 0.8]; g.fine2([q, [q[0] + d[0] * 2.4, q[1] + d[1] * 2.4]], { w: 0.22, c: '#6E675C' }); const cs = ['#E06A8A', '#5F8FC9', '#F3F1EA', '#E6C24F']; for (let i = 0; i < 3; i++) { const m = [q[0] + d[0] * (0.6 + i * 0.6), q[1] + d[1] * (0.6 + i * 0.6)]; g.fill2([[m[0] - 0.4, m[1]], [m[0] + 0.4, m[1]], [m[0] + 0.4, m[1] + 1.6], [m[0] - 0.4, m[1] + 1.6]], cs[(i + Math.round(q[0])) & 3], true); } }
  }
  // the roof: a parapet line, water tanks, a little stair house
  if (o.roof !== false) {
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    K.box(g, cx - 1.6, cy - 1.2, cx + 0.8, cy + 1.2, z1, z1 + 2.0, { t: '#E9E6DE', l: '#DCD8CE', r: '#C9C4B8' }, { w: 0.45, boil: false });
    K.cyl(g, cx + 2.2, cy - 0.6, 0.9, z1, z1 + 1.6, { t: '#CFD6D9', l: '#B9C3C7', r: '#A5AFB4' }, { n: 10, w: 0.4 });
  }
};
/* a tong lau: a pre-war shophouse block with a verandah over the pavement on the face looking +y ('L') or +x ('R'):
   the upper floors stand on a row of square columns, balconies with railings, shutters, a shop under the arcade.
   [x0,y0,x1,y1] is the building behind the verandah; the verandah adds d in front. o.floors, o.col, o.shop(g, f, p, a0, a1) */
HK.tonglau = function (g, x0, y0, x1, y1, o) {
  o = o || {}; g.boilP = 0.3;
  const face = o.face || 'L', n = o.floors || 4, fh = 3.6, Z = 4.6 + (n - 1) * fh, d = o.d == null ? 2.6 : o.d, col = o.col || '#E9DCC4';
  const tone = { t: shade(col, -0.1), l: col, r: shade(col, 0.1) };
  K.box(g, x0, y0, x1, y1, 0, Z, tone, { w: 0.85 });
  const p = face === 'L' ? y1 : x1, a0 = face === 'L' ? x0 : y0, a1 = face === 'L' ? x1 : y1;
  // the shop at the back of the arcade: dark interior, a lit counter
  g.fill(K.on(face, p + 0.02, a0 + 0.4, a1 - 0.4, 0, 3.8), '#5A4E42'); g.mark({ nc: '#7A5E44' });
  g.fill(K.on(face, p + 0.03, a0 + 0.8, a1 - 0.8, 0.2, 3.2), o.shopCol || '#E9C98A'); g.mark({ nc: '#FFDE9C', spill: true });   // a lit shop at night
  if (o.shop) o.shop(g, face, p, a0, a1);
  // the verandah: floor slabs, columns at the kerb edge, balcony railings
  const P = (a, z, dd) => face === 'L' ? [a, p + dd, z] : [p + dd, a, z];
  const nb = Math.max(2, Math.round((a1 - a0) / 4.2)), bw = (a1 - a0) / nb;
  for (let f = 0; f < n; f++) {
    const zf = 4.6 + f * fh;
    // the wall behind the balcony: tall windows / shutters
    for (let i = 0; i < nb; i++) { const aa = a0 + i * bw + bw * 0.22, ab = a0 + (i + 1) * bw - bw * 0.22; g.fill(K.on(face, p + 0.02, aa, ab, zf + 0.4, zf + fh - 0.5), (i + f) % 3 === 0 ? HK.C.lit : '#7E8E8C'); g.mark({ win: (i + f) % 3 === 0 ? 0.95 : 0.6 }); g.outline(K.on(face, p + 0.03, aa, ab, zf + 0.4, zf + fh - 0.5), { w: 0.3, c: '#4A4540', boil: false }); }
    // the slab of this floor, out to the columns
    const slab = [P(a0, zf, 0), P(a1, zf, 0), P(a1, zf, d), P(a0, zf, d)];
    g.fill([P(a0, zf - 0.45, d), P(a1, zf - 0.45, d), P(a1, zf, d), P(a0, zf, d)], shade(col, 0.06)); g.fill(slab, shade(col, -0.05));
    g.line([P(a0, zf - 0.45, d), P(a1, zf - 0.45, d)], { w: 0.45, boil: false });
    // the balcony railing (a low wall with a rail) on each upper floor
    const rl = []; for (let a = a0 + 0.3; a < a1; a += 0.7) { const q0 = g.p.apply(g, P(a, zf, d - 0.05)), q1 = g.p.apply(g, P(a, zf + 1.3, d - 0.05)); rl.push(q0[0], q0[1], q1[0], q1[1]); }
    g.segs2(rl, '#6E675C', 0.25); g.line([P(a0, zf + 1.3, d - 0.05), P(a1, zf + 1.3, d - 0.05)], { w: 0.4, c: '#4A4540', boil: false });
    // potted plants and laundry on some balconies
    const R = RNG(Math.round(a0 * 3 + f * 17 + p));
    if (R() < 0.6) { const q = g.p.apply(g, P(a0 + (a1 - a0) * R(), zf + 0.1, d - 0.4)); g.fill2(arcPts(q[0], q[1] - 1.6, 1.4, 0, TAU, 8), '#7FA463', true); g.fill2([[q[0] - 0.8, q[1] - 1.0], [q[0] + 0.8, q[1] - 1.0], [q[0] + 0.6, q[1]], [q[0] - 0.6, q[1]]], '#B9654C', true); }
    if (R() < 0.5) { const s = a0 + (a1 - a0) * (0.2 + R() * 0.5), q0 = g.p.apply(g, P(s, zf + fh - 0.6, d * 0.6)), q1 = g.p.apply(g, P(s + 3, zf + fh - 0.6, d * 0.6)); g.fine2([q0, q1], { w: 0.22, c: '#6E675C' }); const cs = ['#F3F1EA', '#5F8FC9', '#E06A8A', '#E6C24F', '#8FBF73']; for (let i = 0; i < 4; i++) { const m = [lerp(q0[0], q1[0], (i + 0.5) / 4), lerp(q0[1], q1[1], (i + 0.5) / 4)]; g.fill2([[m[0] - 0.7, m[1]], [m[0] + 0.7, m[1]], [m[0] + 0.7, m[1] + 2.2], [m[0] - 0.7, m[1] + 2.2]], cs[(i + f + Math.round(s)) % 5], true); } }
  }
  // the roof slab and parapet
  g.fill([P(a0, Z, 0), P(a1, Z, 0), P(a1, Z, d), P(a0, Z, d)], shade(col, -0.08));
  g.fill([P(a0, Z, d), P(a1, Z, d), P(a1, Z + 0.9, d), P(a0, Z + 0.9, d)], shade(col, 0.04)); g.outline([P(a0, Z, d), P(a1, Z, d), P(a1, Z + 0.9, d), P(a0, Z + 0.9, d)], { w: 0.6, boil: false });
  // the columns on the kerb edge
  const cs = []; for (let i = 0; i <= nb; i++) { const a = a0 + i * bw + (i === 0 ? 0.35 : i === nb ? -0.35 : 0); cs.push(a); }
  for (const a of cs) { const b = face === 'L' ? [a - 0.35, p + d - 0.7, a + 0.35, p + d] : [p + d - 0.7, a - 0.35, p + d, a + 0.35]; K.box(g, b[0], b[1], b[2], b[3], 0, Z, tone, { w: 0.45, boil: false }); }
  // at night a lamp under the verandah in each bay lights the arcade and the pavement
  for (let i = 0; i < nb; i++) { const q = P(a0 + (i + 0.5) * bw, 4.15, d * 0.55); g.glow('lamp', q[0], q[1], q[2], { r: 1.0 }); }
  return { Z, d };
};
/* bamboo scaffolding on a face: poles lashed in a grid a little off the wall, green netting over part of it */
HK.scaffold = function (g, face, p, a0, a1, z0, z1, o) {
  o = o || {}; const off = o.off || 0.9, P = (a, z) => face === 'L' ? [a, p + off, z] : [p + off, a, z], s = [], R = RNG(Math.round(a0 * 7 + p * 3 + z1));
  if (o.net) { const q = [P(o.net[0], z0 + 0.4), P(o.net[1], z0 + 0.4), P(o.net[1], o.net[2]), P(o.net[0], o.net[2])]; g.fill(q, 'rgba(84,140,96,0.42)'); }
  for (let a = a0; a <= a1 + 0.01; a += 1.5) { const q0 = g.p.apply(g, P(a + (R() - 0.5) * 0.15, z0)), q1 = g.p.apply(g, P(a + (R() - 0.5) * 0.15, z1 + 0.6)); s.push(q0[0], q0[1], q1[0], q1[1]); }
  for (let z = z0 + 1.2; z <= z1 + 0.3; z += 1.6) { const q0 = g.p.apply(g, P(a0 - 0.3, z)), q1 = g.p.apply(g, P(a1 + 0.3, z + (R() - 0.5) * 0.1)); s.push(q0[0], q0[1], q1[0], q1[1]); }
  for (let a = a0; a < a1 - 2; a += 4.5) { const q0 = g.p.apply(g, P(a, z0)), q1 = g.p.apply(g, P(a + 3, Math.min(z1, z0 + 6))); s.push(q0[0], q0[1], q1[0], q1[1]); }
  g.segs2(s, '#C9A66B', 0.32);
  // the knots: little black ties
  const kt = []; for (let a = a0; a <= a1; a += 3) for (let z = z0 + 1.2; z <= z1; z += 3.2) { const q = g.p.apply(g, P(a, z)); kt.push(q[0] - 0.3, q[1], q[0] + 0.3, q[1]); }
  g.segs2(kt, '#2A2622', 0.35);
};
/* an air-conditioner box hung on a face (cheap, wide px) */
HK.ac2 = function (g, q) { const r = [[q[0] - 1.1, q[1] - 1.2], [q[0] + 1.1, q[1] - 1.2], [q[0] + 1.1, q[1] + 0.2], [q[0] - 1.1, q[1] + 0.2]]; g.fill2(r, '#F3F1EA', true); g.outline2(r, { w: 0.22, c: '#8C8576', boil: false }); };

/* ---------------- street furniture ---------------- */
HK.lamp = function (g, x, y, o) {
  o = o || {}; const h = o.h || 10, z = o.z || 0, b = g.p(x, y, z), t = g.p(x, y, z + h), dx = o.arm == null ? -2.4 : o.arm;
  g.line2([b, t], { w: 0.6, c: '#6E7378', boil: false, ext: 0 });
  const e = [t[0] + dx, t[1] + 0.6]; g.line2([t, [t[0] + dx * 0.5, t[1] - 0.6], e], { w: 0.5, c: '#6E7378', boil: false, ext: 0 });
  g.disc2([e[0], e[1] + 0.6], 2.2, 'rgba(255,214,140,0.28)'); g.mark({ nc: true }); g.fill2([[e[0] - 1, e[1]], [e[0] + 1, e[1]], [e[0] + 0.6, e[1] + 0.8], [e[0] - 0.6, e[1] + 0.8]], '#FBE7B0', true); g.mark({ nc: true });
  g.glow2('lamp', [e[0], e[1] + 0.5], b, { r: 1.5 });
};
/* pedestrian railings along a kerb (from a to b, world points), the grey-green steel of every Hong Kong pavement */
HK.rail = function (g, a, b, o) {
  o = o || {}; const h = o.h || 1.9, z0 = a[2] || 0, L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 2.4)), s = [];
  for (let i = 0; i <= n; i++) { const x = lerp(a[0], b[0], i / n), y = lerp(a[1], b[1], i / n), q0 = g.p(x, y, z0), q1 = g.p(x, y, z0 + h); s.push(q0[0], q0[1], q1[0], q1[1]); }
  for (const z of [h, h * 0.45]) { const q0 = g.p(a[0], a[1], z0 + z), q1 = g.p(b[0], b[1], z0 + z); s.push(q0[0], q0[1], q1[0], q1[1]); }
  g.segs2(s, o.c || '#8A9C93', 0.36);
};
/* a tram pole: a green lattice-free steel pole with the span wire's insulator at the top */
HK.tramPole = function (g, x, y, h) { const b = g.p(x, y, 0), t = g.p(x, y, h); g.line2([b, t], { w: 0.75, c: '#2F5B44', boil: false, ext: 0 }); g.disc2(t, 0.45, '#2F5B44'); };
/* a market stall: a steel kiosk with goods on a sloping counter and a canvas sheet on poles above.
   face: which way the counter looks ('L' +y, 'R' +x); goods: list of colours; o.sheet colour */
HK.stall = function (g, x, y, o) {
  o = o || {}; const face = o.face || 'L', L = o.L || 2.6, D = o.D || 1.5, sheet = o.sheet || '#3F7F5A';
  const b = face === 'L' ? [x - L, y - D, x + L, y + D] : [x - D, y - L, x + D, y + L];
  K.box(g, b[0], b[1], b[2], b[3], 0, 2.2, { t: '#7E8C86', l: '#6E7B76', r: '#5E6A66' }, { w: 0.5, boil: false });
  // goods heaped on the counter top: little discs in rows
  const goods = o.goods || ['#E8813A', '#8FBF4E', '#E6C24F', '#C9463E'], R = RNG(Math.round(x * 13 + y * 7));
  for (let i = 0; i < 18; i++) { const u = (i % 6) / 5, v = Math.floor(i / 6) / 2, gx = lerp(b[0] + 0.4, b[2] - 0.4, face === 'L' ? u : v), gy = lerp(b[1] + 0.4, b[3] - 0.4, face === 'L' ? v : u); const q = g.p(gx, gy, 2.35); g.disc2(q, 0.75 + R() * 0.25, goods[(i + (i / 6 | 0)) % goods.length]); g.mark({ nc: HK.lift(0.6) }); }
  // price cards
  if (o.cards !== false) for (let i = 0; i < 3; i++) { const u = (i + 0.5) / 3, q = face === 'L' ? g.p(lerp(b[0], b[2], u), b[3] + 0.05, 2.0) : g.p(b[2] + 0.05, lerp(b[3], b[1], u), 2.0); g.fill2([[q[0] - 0.9, q[1] - 1.1], [q[0] + 0.9, q[1] - 1.1], [q[0] + 0.9, q[1] + 0.1], [q[0] - 0.9, q[1] + 0.1]], '#FBF6E4', true); g.segs2([q[0] - 0.5, q[1] - 0.5, q[0] + 0.5, q[1] - 0.5], '#C8372D', 0.25); }
  // poles and the canvas sheet, sloping down to the front, a bare bulb under it
  const zt = o.zt || 6.4, ps = [];
  for (const [px, py] of [[b[0], b[1]], [b[2], b[1]], [b[0], b[3]], [b[2], b[3]]]) { const q0 = g.p(px, py, 2.2), q1 = g.p(px, py, zt - ((face === 'L' ? py === b[3] : px === b[2]) ? 0.8 : 0)); ps.push(q0[0], q0[1], q1[0], q1[1]); }
  g.segs2(ps, '#5A564E', 0.3);
  const ov = 0.5, sh = face === 'L' ? [[b[0] - ov, b[1] - ov, zt], [b[2] + ov, b[1] - ov, zt], [b[2] + ov, b[3] + ov + 0.6, zt - 1.0], [b[0] - ov, b[3] + ov + 0.6, zt - 1.0]] : [[b[0] - ov, b[1] - ov, zt], [b[2] + ov + 0.6, b[1] - ov, zt - 1.0], [b[2] + ov + 0.6, b[3] + ov, zt - 1.0], [b[0] - ov, b[3] + ov, zt]];
  g.fill(sh, sheet); g.outline(sh, { w: 0.45, c: shade(sheet, 0.45), boil: false });
  const bl = g.p((b[0] + b[2]) / 2, (b[1] + b[3]) / 2, zt - 1.4), i1 = g.cmds.length; g.disc2(bl, 1.6, 'rgba(255,214,140,0.3)'); g.disc2(bl, 0.45, '#FFF0C8');
  // (a pool of light under one stall in three: a lane of stalls lit every one would read as daylight)
  HK.nite(g, i1, { nc: true }); g.glow2(Math.round(x * 0.37 + y * 0.53) % 3 === 0 ? 'lamp' : 'lantern', bl, g.p((b[0] + b[2]) / 2, (b[1] + b[3]) / 2, 0), { r: 1.0, col: '#FFD58A' });
};

/* ---------------- vehicles ---------------- */
/* a car body with its own cabin colour (the taxi's silver roof) */
HK.car = function (g, ang, o) {
  o = o || {}; const col = o.col || '#7FA7CF', L = o.L || 5.3, Wd = o.W || 2.55, cabCol = o.cab || col;
  const tone = { t: shade(col, -0.2), l: col, r: shade(col, 0.15) }, ct = { t: shade(cabCol, -0.15), l: cabCol, r: shade(cabCol, 0.15) };
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  const wu = [-L * 0.6, L * 0.6];
  K.wheels(g, sh, wu, 0.95, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.8, 2.8, tone, {});
  for (const f of ['pu', 'nu']) if (B.vis[f]) g.fill(B.quad(f, -1, 1, 0.8, 1.25), shade(col, 0.3));
  for (const f of ['pv', 'nv']) if (B.vis[f]) { const seam = B.quad(f, -0.08, -0.08, 0.95, 2.75); g.line([seam[0], seam[3]], { w: 0.3, c: shade(col, 0.32), boil: false, ext: 0 }); }
  K.wheels(g, sh, wu, 0.95, 'near', { arch: shade(col, 0.55) });
  K.lights(g, B, 1.7);
  const ca = Math.cos(ang), sa = Math.sin(ang), off = -L * 0.08;
  const cab = K.rbox(g, off * ca, off * sa, L * 0.52, Wd - 0.35, ang, 2.8, 4.7, ct, { nb: true, w: 0.8 });
  for (const f of ['pv', 'nv']) { K.rwin(g, cab, f, -0.82, -0.06, 3.0, 4.4); K.rwin(g, cab, f, 0.06, 0.82, 3.0, 4.4); }
  K.rwin(g, cab, 'pu', -0.8, 0.8, 3.0, 4.4); K.rwin(g, cab, 'nu', -0.8, 0.8, 3.0, 4.4);
  if (o.roof) o.roof(g, cab);
};
/* the red taxi (urban): red body, silver cabin, the TAXI box on the roof; o.green: a New Territories taxi */
HK.taxi = function (g, ang, o) {
  o = o || {};
  HK.car(g, ang, { col: o.green ? '#3E8A4E' : '#C8372D', cab: '#D9DBDC', L: 5.0, W: 2.45, roof: (gg, cab) => {
    const i0 = gg.cmds.length, B = K.rbox(gg, cab.cx, cab.cy, 0.55, 1.15, ang, 4.7, 5.5, { t: '#F6F3EA', l: '#F3EFE3', r: '#DAD5C8' }, { w: 0.35, nb: true });
    const rd = B.ca - B.sa >= 0 ? 1 : -1; for (const f of ['pv', 'nv']) if (B.vis[f]) K.textP(gg, (a, z) => B.pt(rd * a, (f === 'pv' ? 1 : -1) * 1.16, z), 0, 4.82, 0.46, 'TAXI', '#C8372D', { center: true, w: 0.3 });
    HK.nite(gg, i0, { nc: true, light: true });          // the roof sign is lit at night
  } });
};
/* the public light bus: a cream minibus with a green (or red) roof stripe */
HK.minibus = function (g, ang, o) {
  o = o || {}; const L = 4.6, Wd = 2.3, Z = 5.2, roof = o.red ? '#C8372D' : '#3E8A4E', cream = '#F1EBD8';
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, cream, { line: false, nt: true }); K.shadow(g, sh);
  const wu = [-L * 0.62, L * 0.6];
  K.wheels(g, sh, wu, 0.9, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.75, Z, { t: roof, l: cream, r: shade(cream, 0.12) }, { w: 0.8 });
  for (const f of ['pu', 'nu', 'pv', 'nv']) if (B.vis[f]) { g.fill(B.quad(f, -1, 1, Z - 0.9, Z), f === 'pv' || f === 'nu' ? roof : shade(roof, 0.12)); g.fill(B.quad(f, -1, 1, 0.75, 1.3), '#5E5A52'); }
  const iw = g.cmds.length;
  for (const f of ['pv', 'nv']) for (let i = 0; i < 4; i++) K.rwin(g, B, f, -0.88 + 1.76 * i / 4 + 0.04, -0.88 + 1.76 * (i + 1) / 4 - 0.04, 2.5, Z - 1.15, { col: '#C9DCE6', glint: i === 1 });
  K.rwin(g, B, 'pu', -0.82, 0.82, 2.4, Z - 1.1, { col: '#C9DCE6' }); K.rwin(g, B, 'nu', -0.8, 0.8, 2.6, Z - 1.1, { col: '#C9DCE6' });
  HK.nite(g, iw, { nc: (c) => (c === '#C9DCE6' ? '#FFEBC4' : undefined) });   // lit inside at night
  K.wheels(g, sh, wu, 0.9, 'near', { arch: '#3F3A34' });
  K.lights(g, B, 1.4);
};
/* a double-decker: o.livery 'kmb' (cream with a red band) | 'ctb' (yellow with an orange-red sweep); o.route */
HK.bus = function (g, ang, o) {
  o = o || {}; const L = 7.0, Wd = 2.55, Z = 9.0, kmb = o.livery !== 'ctb';
  const body = kmb ? '#F2EEE2' : '#F2C230', band = kmb ? '#C8372D' : '#E2572B';
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, body, { line: false, nt: true }); K.shadow(g, sh, 0.5);
  const wu = [-L * 0.55, L * 0.6];
  K.wheels(g, sh, wu, 1.05, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.7, Z, { t: shade(body, -0.06), l: body, r: shade(body, 0.1) }, { w: 0.9 });
  for (const f of ['pu', 'nu', 'pv', 'nv']) if (B.vis[f]) {
    g.fill(B.quad(f, -1, 1, 0.7, 1.4), '#3A3632');
    g.fill(B.quad(f, -1, 1, 4.9, 5.5), band);
  }
  for (const f of ['pv', 'nv']) if (B.vis[f]) {
    const n = 5, iw = g.cmds.length; for (let i = 0; i < n; i++) { const a0 = -0.9 + 1.8 * i / n + 0.03, a1 = -0.9 + 1.8 * (i + 1) / n - 0.03; K.rwin(g, B, f, a0, a1, 2.8, 4.6, { col: '#2E3A44', glint: false }); K.rwin(g, B, f, a0, a1, 6.0, 8.2, { col: '#2E3A44', glint: i % 2 === 0 }); }
    HK.nite(g, iw, { nc: (c) => (c === '#2E3A44' ? '#FFEFCC' : undefined) });   // both decks lit at night
    g.fill(B.quad(f, -0.5, 0.95, 1.6, 2.4), band);
  }
  const iu = g.cmds.length;
  if (B.vis.pu) {
    K.rwin(g, B, 'pu', -0.88, 0.88, 2.3, 4.7, { col: '#C9DCE6' });
    g.fill(B.quad('pu', -0.82, 0.82, 5.6, 6.3), '#1E1C1A');
    K.textP(g, (a, z) => B.pt(L + 0.04, -a, z), 0, 5.72, 0.46, o.route || '6', '#F2C14E', { center: true, w: 0.42 });
    K.rwin(g, B, 'pu', -0.88, 0.88, 6.4, 8.3, { col: '#C9DCE6' });
  }
  if (B.vis.nu) K.rwin(g, B, 'nu', -0.7, 0.7, 6.2, 8.2, { col: '#C9DCE6' });
  HK.nite(g, iu, { nc: (c) => (c === '#C9DCE6' ? '#FFEFCC' : c === '#F2C14E' ? c : undefined) });
  K.wheels(g, sh, wu, 1.05, 'near', { arch: '#2A2622' });
  K.lights(g, B, 1.55);
};
/* the ding-ding: a narrow, tall double-deck tram. o.col the lower body, o.top the upper; o.word a Latin advert;
   o.zh characters painted on the side (香港電車); the trolley pole trails up to the wire at z 12 */
HK.tram = function (g, ang, o) {
  o = o || {}; const L = HT.HL.tram, Wd = HT.HW.tram, Z = 9.4, col = o.col || HK.C.green, top = o.top || HK.C.cream;
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh, 0.35);
  const wu = [-L * 0.55, L * 0.55];
  K.wheels(g, sh, wu, 0.6, 'far', { zc: 0.6 });
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.5, 4.6, { t: shade(col, -0.1), l: col, r: shade(col, 0.14) }, { w: 0.85 });
  const U = K.rbox(g, 0, 0, L, Wd, ang, 4.6, Z, { t: '#E9E3D2', l: top, r: shade(top, 0.12) }, { w: 0.85, nb: true });
  for (const f of ['pv', 'nv']) if (B.vis[f]) {
    const iw = g.cmds.length; for (let i = 0; i < 5; i++) { const a0 = -0.86 + 1.72 * i / 5 + 0.04, a1 = -0.86 + 1.72 * (i + 1) / 5 - 0.04; K.rwin(g, B, f, a0, a1, 2.5, 4.2, { col: '#33404A', glint: false }); K.rwin(g, U, f, a0, a1, 6.6, 8.6, { col: '#33404A', glint: i === 2 }); }
    HK.nite(g, iw, { nc: (c) => (c === '#33404A' ? HK.WARM : undefined) });   // both decks lit at night
    g.fill(U.quad(f, -1, 1, 4.6, 5.0), shade(col, 0.1));
    // the advert on the cream band under the upper windows: characters or a Latin word, reading left to right
    const vv = (f === 'pv' ? 1 : -1) * (Wd + 0.04), rd = B.ca - B.sa >= 0 ? 1 : -1;
    if (o.zh) HK.zh(g, (a, z) => U.pt(rd * a, vv, z), 0, 6.45, 1.3, o.zh, o.ink || col, { center: true, w: 0.5 });
    else if (o.word) K.textP(g, (a, z) => U.pt(rd * a, vv, z), 0, 5.2, 1.05, o.word, o.ink || col, { center: true, w: 0.55 });
  }
  for (const [f, sg] of [['pu', 1], ['nu', -1]]) if (B.vis[f]) {
    const iw = g.cmds.length;
    K.rwin(g, B, f, -0.8, 0.8, 2.2, 4.3, { col: '#C9DCE6' }); K.rwin(g, U, f, -0.8, 0.8, 6.4, 8.6, { col: '#C9DCE6' });
    g.fill(U.quad(f, -0.75, 0.75, 5.1, 5.9), '#1E1C1A');
    if (o.route) K.textP(g, (a, z) => B.pt(sg * (L + 0.04), -sg * a, z), 0, 5.22, 0.5, o.route, '#F2C14E', { center: true, w: 0.36 });
    HK.nite(g, iw, { nc: (c) => (c === '#C9DCE6' ? HK.WARM : c === '#F2C14E' ? c : undefined) });
  }
  // the rounded roof and the trolley pole (trailing behind)
  K.rbox(g, 0, 0, L * 0.96, Wd * 0.8, ang, Z, Z + 0.35, { t: '#D9D3C2', l: shade(top, 0.05), r: shade(top, 0.16) }, { w: 0.5, nb: true });
  const a = g.p.apply(g, B.pt(-L * 0.1, 0, Z + 0.35)), e = g.p.apply(g, B.pt(-L * 0.62, 0, 12.0));
  g.line2([a, e], { w: 0.45, c: '#3A3530', boil: false, ext: 0 }); g.disc2(e, 0.35, '#3A3530');
  K.wheels(g, sh, wu, 0.6, 'near', { zc: 0.6, arch: '#2A2622' });
  K.lights(g, B, 1.2);
};
HK.van = function (g, ang, o) { K.bus(g, ang, { L: 5.4, W: 2.45, h: 4.9, n: 2, col: (o && o.col) || '#F1EFE8', band: (o && o.band) || '#E9E6DE' }); };
HK.vehicle = function (g, ang, kind, o) {
  o = o || {};
  if (kind === 'bus') HK.bus(g, ang, o);
  else if (kind === 'taxi') HK.taxi(g, ang, o);
  else if (kind === 'mini') HK.minibus(g, ang, o);
  else if (kind === 'van') HK.van(g, ang, o);
  else HK.car(g, ang, { col: o.col || '#8FA3B5' });
};

/* ---------------- boats built in parts ----------------
   A boat is a list of primitives along its length u (bow at +u) and across it v, heights z above the water; drawn in
   parts (u ranges), each part an actor anchored at its own centre, so a long hull sorts piece by piece by a pier.
   { box: [ua, ub], vc, hw, z: [z0, z1], col, w }   a box
   { bow: [ua, ub], hw, z, col, top }                 a wedge narrowing to a point at ub (o.back: narrowing to ua)
   { band: [ua, ub], hw, z, col }                     a strip painted on the visible side of a box of half width hw
   { at: u, fn(g, P, vis) }                           anything else, drawn in the part that contains u */
HK.boatPart = function (g, prims, ang, u0, u1, cu) {
  const ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => [(u - cu) * ca - v * sa, (u - cu) * sa + v * ca, z];
  const side = (-sa + ca) > 0 ? 1 : -1, vis = { side, bow: ca + sa > 0 };
  for (const p of prims) {
    const i0 = g.cmds.length;
    if (p.box) {
      const a = Math.max(p.box[0], u0), b = Math.min(p.box[1], u1); if (b - a < 0.01) continue;
      const m = (a + b) / 2, c = P(m, p.vc || 0, 0);
      K.rbox(g, c[0], c[1], (b - a) / 2, p.hw, ang, p.z[0], p.z[1], p.col, { w: p.w == null ? 0.55 : p.w, nb: true });
    } else if (p.band) {
      const a = Math.max(p.band[0], u0), b = Math.min(p.band[1], u1); if (b - a < 0.01) continue;
      const v = side * (p.hw + 0.03); g.fill([P(a, v, p.z[0]), P(b, v, p.z[0]), P(b, v, p.z[1]), P(a, v, p.z[1])], p.col);
    } else if (p.bow) {
      const a = Math.max(p.bow[0], u0), b = Math.min(p.bow[1], u1); if (b - a < 0.01) continue;
      const wd = (u) => p.hw * clamp(p.back ? (u - p.bow[0]) / (p.bow[1] - p.bow[0]) : (p.bow[1] - u) / (p.bow[1] - p.bow[0]), 0, 1), col = K.tones(p.col);
      const q = [P(a, side * wd(a), p.z[0]), P(b, side * wd(b), p.z[0]), P(b, side * wd(b), p.z[1]), P(a, side * wd(a), p.z[1])];
      const facing = p.back ? !vis.bow : vis.bow;
      g.fill(q, mix(col.l, col.r, facing ? 0.2 : 0.7)); g.outline(q, { w: 0.5, boil: false });
      const top = [P(a, -wd(a), p.z[1]), P(b, -wd(b), p.z[1]), P(b, wd(b), p.z[1]), P(a, wd(a), p.z[1])]; g.fill(top, p.top || col.t); g.outline(top, { w: 0.45, boil: false });
    } else if (p.at != null) {
      if (p.at < u0 || p.at >= u1) continue;
      p.fn(g, P, vis);
    }
    if (p.nc) HK.nite(g, i0, { nc: p.nc });
  }
};
HK.boatActors = function (T, prims, parts, state, o) {
  o = o || {}; const nq = o.nq || 64;
  parts.forEach(([u0, u1]) => {
    const cu = (u0 + u1) / 2;
    T.actor({ grow: false, sample: o.sample || 0.25, period: o.period || 40, bias: o.bias || 0, cast: o.cast,
      at(t) {
        const s = state(t); if (!s) return null;
        const q = Math.round(s.ang / (TAU / nq)), a = q * TAU / nq;
        return { x: s.x + cu * Math.cos(a), y: s.y + cu * Math.sin(a), z: s.z == null ? HT.HAR.WL : s.z, key: (((q % nq) + nq) % nq) + (s.k != null ? '.' + s.k : ''), ang: a, alpha: s.alpha, k: s.k };
      },
      draw(g, st) { HK.boatPart(g, typeof prims === 'function' ? prims(st) : prims, st.ang, u0, u1, cu); } });
  });
};
/* the Star Ferry: double-ended, a dark green hull under a white band, two decks open at the sides behind white
   rails, green roof canopy, a small funnel amidships with the white star; passengers as busts at the rails.
   k: which ferry (seeds the passengers). Named on the band. */
HK.STARFERRY = function (k, name) {
  const G = { t: '#3E7A5A', l: '#2E6B4E', r: '#245A41' }, Wt = { t: '#ECE8DC', l: '#F6F3EA', r: '#DCD7CA' }, Gr = { t: '#4E8A62', l: '#3E7A5A', r: '#2F6B4A' };
  const pax = []; for (let i = 0; i < 7; i++) for (const v of [-1.4, 1.4]) pax.push([-4.5 + i * 1.5, v, HK.who(7700 + k * 50 + i * 2 + (v > 0 ? 1 : 0))]);
  const busts = (z, sel) => (g, P, vis) => { const ps = pax.filter((q, i) => sel(i)).map((q) => ({ p: P(q[0], q[1], z), w: q[2], v: q[1] })).filter((q) => q.v * vis.side > 0); ps.sort((a, b) => (a.p[0] + a.p[1]) - (b.p[0] + b.p[1])); for (const q of ps) HK.bust2(g, g.p(q.p[0], q.p[1], q.p[2]), q.w, 0.6); };
  return [
    { box: [-6.2, 6.2], hw: 2.4, z: [0, 1.3], col: G }, { bow: [6.2, 7.5], hw: 2.4, z: [0, 1.3], col: G }, { bow: [-7.5, -6.2], hw: 2.4, z: [0, 1.3], col: G, back: true },
    { band: [-6.2, 6.2], hw: 2.4, z: [0.95, 1.3], col: '#F6F3EA' },
    { box: [-6.6, 6.6], hw: 2.2, z: [1.3, 1.5], col: Wt },
    { at: -5.9, fn: (g, P, vis) => {   // the lower deck: a cabin core with posts and the rail, passengers
      const ic = g.cmds.length, core = K.rbox(g, P(0, 0, 0)[0], P(0, 0, 0)[1], 5.4, 1.2, Math.atan2(P(1, 0, 0)[1] - P(0, 0, 0)[1], P(1, 0, 0)[0] - P(0, 0, 0)[0]), 1.5, 3.6, Gr, { w: 0.45 });
      HK.nite(g, ic, { nc: (c) => ({ '#4E8A62': '#F6D894', '#3E7A5A': '#FFE3A6', '#2F6B4A': '#E9C27A' })[c] });   // the saloon lit at night
      void core; busts(1.5, (i) => i % 2 === 0)(g, P, vis);
      const s = []; for (let u = -6.4; u <= 6.41; u += 1.6) for (const v of [-2.15, 2.15]) { if (v * vis.side < 0) continue; const a = g.p.apply(g, P(u, v, 1.5)), b = g.p.apply(g, P(u, v, 3.7)); s.push(a[0], a[1], b[0], b[1]); }
      g.segs2(s, '#F6F3EA', 0.45);
      const v = vis.side * 2.15; g.fill([P(-6.4, v, 1.5), P(6.4, v, 1.5), P(6.4, v, 2.2), P(-6.4, v, 2.2)], '#F6F3EA'); g.outline([P(-6.4, v, 1.5), P(6.4, v, 1.5), P(6.4, v, 2.2), P(-6.4, v, 2.2)], { w: 0.35, boil: false });
      g.fill([P(-6.2, v, 3.3), P(6.2, v, 3.3), P(6.2, v, 3.58), P(-6.2, v, 3.58)], HK.NONE); g.mark({ nc: '#FFE3A6' });   // night: the lit ceiling of the lower deck
    } },
    { box: [-6.6, 6.6], hw: 2.25, z: [3.6, 3.9], col: Wt },
    { band: [-6.6, 6.6], hw: 2.25, z: [3.6, 3.9], col: '#2E6B4E' },
    { at: -5.8, fn: (g, P, vis) => {   // the upper deck: passengers at the rail, posts, the green canopy
      busts(3.9, (i) => i % 2 === 1)(g, P, vis);
      const s = []; for (let u = -6.2; u <= 6.21; u += 1.55) for (const v of [-2.1, 2.1]) { if (v * vis.side < 0) continue; const a = g.p.apply(g, P(u, v, 3.9)), b = g.p.apply(g, P(u, v, 5.9)); s.push(a[0], a[1], b[0], b[1]); }
      g.segs2(s, '#F6F3EA', 0.4);
      const v = vis.side * 2.1; g.fill([P(-6.2, v, 3.9), P(6.2, v, 3.9), P(6.2, v, 4.5), P(-6.2, v, 4.5)], '#F6F3EA');
      if (name) K.textP(g, (a, z) => P(vis.side > 0 ? a : -a, v * 1.01, z), 0, 4.0, 0.42, name, '#2E6B4E', { center: true, w: 0.3 });
      // at night: lamps under both decks' ceilings along the side we see
      g.fill([P(-6.0, v, 5.55), P(6.0, v, 5.55), P(6.0, v, 5.85), P(-6.0, v, 5.85)], HK.NONE); g.mark({ nc: '#FFE3A6' });
      for (const u of [-4.7, -1.6, 1.6, 4.7]) for (const z of [3.45, 5.7]) HK.light2(g, g.p.apply(g, P(u, vis.side * 1.9, z)), 0.7, '#FFF1CC');
    } },
    { box: [-6.8, 6.8], hw: 2.45, z: [5.9, 6.3], col: Gr },
    { at: 0.1, fn: (g, P, vis) => {   // the funnel with the white star, the wheelhouses at both ends
      const c = P(0, 0, 0); K.cyl(g, c[0], c[1], 0.75, 6.3, 8.2, { t: '#3E3A36', l: '#F6F3EA', r: '#DCD7CA' }, { n: 12, w: 0.45 });
      const q = g.p.apply(g, P(0, vis.side * 0.7, 7.3)), st = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + Math.PI * i / 5, r = i % 2 ? 0.28 : 0.68; st.push([q[0] + Math.cos(a) * r, q[1] + Math.sin(a) * r]); } g.fill2(st, '#2E6B4E', true);
      for (const u of [-5.2, 5.2]) { const w = P(u, 0, 0); K.rbox(g, w[0], w[1], 0.8, 1.3, Math.atan2(P(1, 0, 0)[1] - c[1], P(1, 0, 0)[0] - c[0]), 6.3, 7.4, Wt, { w: 0.4 }); }
      for (const u of [-5.2, 5.2]) HK.light2(g, g.p.apply(g, P(u, 0, 7.6)), 0.45, '#FFFBEE');   // the masthead lights
    } },
  ];
};
/* the red-sailed junk (Aqua Luna): a dark timber hull with a raised stern, two battened red sails in the boat's plane */
HK.JUNK = (function () {
  const H = { t: '#8A5A3A', l: '#5E3A26', r: '#4A2E1E' };
  const sail = (u, h, w) => (g, P) => {
    g.line([P(u, 0, 1.6), P(u, 0, h + 0.6)], { w: 0.6, c: '#3A2A1E', boil: false, ext: 0 });
    const q = [P(u - 0.4, 0, 2.6), P(u + w * 0.35, 0, 2.6), P(u + w * 0.42, 0, h), P(u - w * 0.65, 0, h + 0.4), P(u - w * 0.75, 0, 3.2)];
    g.fill(q, '#B8322A'); g.mark({ nc: '#D94A38' }); g.outline(q, { w: 0.4, c: '#6E1E18', boil: false });   // lit from the deck at night
    const bt = []; for (let i = 1; i < 6; i++) { const f = i / 6, a = g.p.apply(g, P(u - 0.4 - (w * 0.3) * f, 0, 2.6 + (h - 2.6) * f)), b = g.p.apply(g, P(u + w * 0.35 + w * 0.07 * f, 0, 2.6 + (h - 2.6) * f)); bt.push(a[0], a[1], b[0], b[1]); }
    g.segs2(bt, '#5E1A14', 0.3);
  };
  return [
    { box: [-5.6, 4.6], hw: 1.9, z: [0, 1.6], col: H }, { bow: [4.6, 7.0], hw: 1.9, z: [0.2, 1.9], col: H, top: '#9C6A44' },
    { band: [-5.6, 4.6], hw: 1.9, z: [1.2, 1.6], col: '#C9A44E' },
    { box: [-6.4, -3.6], hw: 1.7, z: [1.6, 2.8], col: { t: '#9C6A44', l: '#6E4630', r: '#5A3826' } },
    { at: -4.0, fn: sail(-4.0, 8.0, 4.2) }, { at: 0.8, fn: sail(0.8, 10.6, 5.8) }, { at: 4.2, fn: sail(4.2, 7.0, 3.4) },
    { at: 5.0, fn: (g, P, vis) => { for (let u = -5.2; u <= 5.6; u += 1.8) HK.light2(g, g.p.apply(g, P(u, vis.side * 1.7, 2.0)), 0.4, '#FFD98A'); } },   // night: lamps along the rail
  ];
})();
/* a harbour lighter: a low steel cargo boat with a derrick crane and containers */
HK.LIGHTER = [
  { box: [-6.5, 5.2], hw: 2.2, z: [0, 1.4], col: { t: '#7E8C86', l: '#4E5E66', r: '#3E4A52' } }, { bow: [5.2, 6.5], hw: 2.2, z: [0, 1.6], col: { t: '#7E8C86', l: '#4E5E66', r: '#3E4A52' } },
  { band: [-6.5, 5.2], hw: 2.2, z: [1.0, 1.4], col: '#C8372D' },
  { box: [-6.2, -3.8], hw: 1.8, z: [1.4, 4.0], col: { t: '#E9E6DE', l: '#F3F1EA', r: '#DCD8CE' } },
  { box: [-2.8, 1.2], hw: 1.6, z: [1.4, 3.6], col: { t: '#3F7FB8', l: '#3F7FB8', r: '#2F6A9E' } },
  { box: [1.4, 4.8], hw: 1.6, z: [1.4, 3.4], col: { t: '#D9733A', l: '#D9733A', r: '#B95E2E' } },
  { at: -3.6, fn: (g, P) => { g.line([P(-3.6, 0, 1.4), P(-3.6, 0, 8.0)], { w: 0.6, c: '#C9A23A', boil: false, ext: 0 }); g.line([P(-3.6, 0, 7.6), P(3.4, 0, 5.2)], { w: 0.45, c: '#C9A23A', boil: false, ext: 0 }); g.fine([P(3.4, 0, 5.2), P(3.4, 0, 3.6)], { w: 0.25, c: '#3A3530' }); HK.light2(g, g.p.apply(g, P(-3.6, 0, 7.9)), 0.45, '#FFFBEE'); HK.light2(g, g.p.apply(g, P(-5.0, 0, 3.6)), 0.5, '#FFE3A6'); } },
];
/* the jetfoil to Macau: a white hull on struts, a red stripe, a long window band */
HK.JET = [
  { box: [-5.6, 4.4], hw: 2.1, z: [1.0, 2.6], col: { t: '#ECE9E1', l: '#F6F4EE', r: '#DCD8CE' } }, { bow: [4.4, 6.4], hw: 2.1, z: [1.0, 2.6], col: { t: '#ECE9E1', l: '#F6F4EE', r: '#DCD8CE' } },
  { band: [-5.6, 4.4], hw: 2.1, z: [1.3, 1.6], col: '#C8372D' }, { band: [-5.0, 3.8], hw: 2.1, z: [1.85, 2.4], col: '#2E3A4A', nc: '#FFE7B4' },
  { box: [-3.0, 2.2], hw: 1.5, z: [2.6, 3.6], col: { t: '#ECE9E1', l: '#F6F4EE', r: '#DCD8CE' } },
  { at: -5.4, fn: (g, P) => { const s = []; for (const u of [-4, 3.6]) { const a = g.p.apply(g, P(u, 0, 1.0)), b = g.p.apply(g, P(u, 0, 0.0)); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#5A564E', 0.6); const w = []; for (let i = 0; i < 5; i++) { const a = g.p.apply(g, P(-6 - i * 1.6, 1.4 + i * 0.3, 0)), b = g.p.apply(g, P(-7.3 - i * 1.6, 1.6 + i * 0.3, 0)), c = g.p.apply(g, P(-6 - i * 1.6, -1.4 - i * 0.3, 0)), d = g.p.apply(g, P(-7.3 - i * 1.6, -1.6 - i * 0.3, 0)); w.push(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]); } g.segs2(w, '#F4F8F8', 0.65); } },
];
/* the marine police launch: dark blue hull, white cabin, a blue light */
HK.POLICE = [
  { box: [-4.2, 2.8], hw: 1.5, z: [0, 1.3], col: { t: '#3F5F8F', l: '#26314F', r: '#1F2840' } }, { bow: [2.8, 4.2], hw: 1.5, z: [0, 1.3], col: { t: '#3F5F8F', l: '#26314F', r: '#1F2840' } },
  { band: [-4.2, 2.8], hw: 1.5, z: [0.85, 1.05], col: '#F6F3EA' },
  { box: [-2.6, 1.2], hw: 1.2, z: [1.3, 3.0], col: { t: '#ECE9E1', l: '#F6F4EE', r: '#DCD8CE' } }, { band: [-2.4, 1.0], hw: 1.2, z: [2.0, 2.6], col: '#2E3A4A', nc: '#FFE7B4' },
  { at: -0.6, fn: (g, P) => { const t = g.p.apply(g, P(-0.6, 0, 3.0)); g.disc2([t[0], t[1] - 0.8], 0.55, '#5E8FE0'); g.mark({ nc: '#7FB4FF', light: true }); } },
];
/* a sampan: a small open timber boat with a curved canopy of woven matting, a rower standing at the stern */
HK.sampan = function (g, ang, o) {
  o = o || {}; const L = o.L || 3.6, ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => [u * ca - v * sa, u * sa + v * ca, z];
  K.boat(g, ang, { kind: 'row', L, W: 1.2, hull: o.hull || '#8A6A44', stripe: '#5E4630', deck: '#B9976A' });
  const c = []; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; c.push(P(-0.4 + 0, -Math.cos(t) * 1.1, 1.1 + Math.sin(t) * 1.3)); }
  const c2 = c.map((p, i) => { const q = P(1.6, -Math.cos(Math.PI * i / 8) * 1.1, 1.1 + Math.sin(Math.PI * i / 8) * 1.3); return q; });
  g.fill(c.concat(c2.slice().reverse()), '#B9A27D'); g.outline(c.concat(c2.slice().reverse()), { w: 0.4, c: '#6E5A44', boil: false });
  HK.light2(g, g.p.apply(g, P(1.6, 0, 1.9)), 0.4, '#FFD98A');          // night: a lamp hung in the canopy
  if (o.who) { const q = P(-L * 0.75, 0, 1.0); HK.person(g, q[0], q[1], q[2], Object.assign({}, o.who, { dir: o.dir || 0, pose: 'hold', reach: [3, -9] })); }
};

/* ---------------- generic solids ---------------- */
/* an upright prism over a convex footprint (world [x, y] points, any order round), from z0 to z1. Faces turned to us
   are filled lit or shaded by which way they look; returns the visible faces as { a, b } edges for decoration. */
HK.prism = function (g, pts, z0, z1, col, o) {
  o = o || {}; const c = K.tones(col), n = pts.length, cx = pts.reduce((s, p) => s + p[0], 0) / n, cy = pts.reduce((s, p) => s + p[1], 0) / n;
  const vis = [];
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], ex = b[0] - a[0], ey = b[1] - a[1];
    let nx = ey, ny = -ex; if (nx * ((a[0] + b[0]) / 2 - cx) + ny * ((a[1] + b[1]) / 2 - cy) < 0) { nx = -nx; ny = -ny; }
    const L = Math.hypot(nx, ny); nx /= L; ny /= L;
    if (nx + ny <= 0.02) continue;
    const q = [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]];
    g.fill(q, mix(c.l, c.r, clamp(0.5 + 0.5 * (nx - ny), 0, 1))); if (o.line !== false) g.outline(q, { w: o.w || 0.8, boil: o.boil });
    vis.push({ a, b, nx, ny });
  }
  if (!o.nt) { const top = pts.map((p) => [p[0], p[1], z1]); g.fill(top, o.top || c.t); if (o.line !== false) g.outline(top, { w: o.w || 0.8, boil: o.boil }); }
  return vis;
};

/* ---------------- the Star Ferry crowd at a finger pier ----------------
   Ferry f lies alongside the finger whose ferry-side edge is at x = fx (world), its gangway at y = gy; the pier hall's
   door is at y = dy. During the dwell the gangway drops, n passengers come off and walk the finger to the hall, then
   the n who queued along the finger's far rail during the wait file on. (ox, oy): the tile's centre (actors are
   tile-local). at: 'C' (Central, the dwell starts at tau 0) or 'T' (Tsim Sha Tsui, tau 20). */
HK.ferryCrowd = function (T, o) {
  const n = o.n || 8, start = o.at === 'C' ? 0 : 20, sd = Math.sign(o.dy - o.gy), ox = o.ox || 0, oy = o.oy || 0;
  const uOf = (t) => HT.mod(HT.ferryTau(o.f, t) - start, HT.WC);
  const walkX = o.fx + 1.5, qX = o.fx + 4.3;
  const path = (pts) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { L: L[L.length - 1], at(d) { d = clamp(d, 0, L[L.length - 1]); let i = 0; while (i < pts.length - 2 && d > L[i + 1]) i++; const a = pts[i], b = pts[i + 1], f = (d - L[i]) / ((L[i + 1] - L[i]) || 1); return { x: lerp(a[0], b[0], f), y: lerp(a[1], b[1], f), dx: b[0] - a[0], dy: b[1] - a[1] }; } }; };
  const dirOf = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3);
  const walkSt = (q, d, a) => { const ph = Math.floor((d / 2.4) % 1 * 8), dir = dirOf(q.dx, q.dy); return { x: q.x - ox, y: q.y - oy, key: 'w' + dir + '.' + ph, dir, pose: 'walk', ph: ph / 8, alpha: a < 1 ? Math.max(0.03, a) : null }; };
  // the gangway: a plank with rails from the finger's edge to the ferry's side door
  T.actor({ sample: 0.2, period: HT.WC, grow: false,
    at(t) { const u = uOf(t); if (u < 0.4 || u > 8.7) return null; return { x: o.fx - ox, y: o.gy - oy, key: 'g' }; }, bias: 2,
    draw(g) { const q = [[-0.5, -1.0, 0], [0.05, -1.0, 0], [0.05, 1.0, 0], [-0.5, 1.0, 0]]; g.fill(q, '#B9A27D'); g.outline(q, { w: 0.4, boil: false }); g.fine([[-0.5, 1.0, 1.1], [0.05, 1.0, 1.1]], { w: 0.3, c: '#5A564E' }); } });
  for (let i = 0; i < n; i++) {
    const R = RNG((o.seed || 1) * 97 + i * 13), look = HK.who((o.seed || 1) * 31 + i, i % 4 === 1 ? { phone: true } : i % 5 === 3 ? { rwb: true } : {});
    const P = path([[o.fx + 0.3, o.gy + (R() - 0.5) * 1.2], [walkX + (i % 2) * 0.6, o.gy + sd * 1.0], [walkX + (i % 2) * 0.6, o.dy - sd * 0.4]]);
    const t0 = 0.9 + i * 0.42, sp = 2.2 + R() * 0.3;
    T.actor({ sample: 0.3, period: HT.WC,
      at(t) { const u = uOf(t) - t0; if (u < 0) return null; const d = u * sp; if (d > P.L) return null; return walkSt(P.at(d), d, Math.min(1, (P.L - d) / 1.6, d / 0.6)); },
      draw(g, st) { HK.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
  }
  for (let j = 0; j < n; j++) {
    const look = HK.who((o.seed || 1) * 31 + 50 + j, j % 3 === 0 ? { phone: true } : j % 7 === 4 ? { bag: '#3F5F8F' } : {});
    const spot = [qX - (j % 2) * 1.1, o.gy + sd * (2.6 + Math.floor(j / 2) * 1.5)];
    const IN = path([[qX - 0.6, o.dy - sd * 0.3], spot]), OUT = path([spot, [walkX + 0.4, o.gy + sd * 0.6], [o.fx + 0.2, o.gy]]);
    const go = 4.3 + j * 0.42, arr = 13 + j * 2.7, wdir = sd < 0 ? 1 : 3;
    T.actor({ sample: 0.3, period: HT.WC,
      at(t) {
        const u = uOf(t), standing = { x: spot[0] - ox, y: spot[1] - oy, key: 's' + wdir + (look.phone ? 'p' : ''), dir: wdir, pose: look.phone ? 'hold' : 'stand' };
        if (u < go) return standing;
        if (u < 11) { const d = (u - go) * 1.7; if (d > OUT.L) return null; return walkSt(OUT.at(d), d, Math.min(1, (OUT.L - d) / 1.0)); }
        if (u < arr) return null;
        const d = (u - arr) * 1.2; if (d < IN.L) return walkSt(IN.at(d), d, Math.min(1, d / 1.0));
        return standing;
      },
      draw(g, st) { HK.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.pose, ph: st.ph || 0 })); } });
  }
};

/* a projecting sign as its own small object, footprinted at its outer end (so walkers under it sort behind it) */
HK.bladeObj = function (T, x, y, axis, out, z0, z1, col, str, o) {
  return T.obj(axis === 'y' ? [x, y + out] : [x + out, y], (g) => {
    HK.blade(g, x, y, axis, out, z0, z1, col, str, o);
    if (o && o.en) { const face = axis === 'y' ? 'R' : 'L', p = axis === 'y' ? x + 0.18 : y + 0.18, a0 = axis === 'y' ? y + 0.3 : x + 0.3, a1 = axis === 'y' ? y + out - 0.3 : x + out - 0.3; const h = Math.min((z1 - z0) * 0.55, Math.abs(a1 - a0) * 0.9 / K.textW(o.en, 1)); K.text(g, face, p, (a0 + a1) / 2, (z0 + z1) / 2 - h / 2, h, o.en, o.neon || '#FBF8EE', { center: true, w: clamp(h * 0.45, 0.3, 0.9) }); if (o.neon) K.text(g, face, p + 0.01, (a0 + a1) / 2, (z0 + z1) / 2 - h / 2, h, o.en, '#FFF6EC', { center: true, w: clamp(h * 0.2, 0.18, 0.5) }); }
  }, { name: 'sign' });
};
/* a slim shop-house tower on a busy street: residential above (HK.resi), a lit shopfront and its signboard below on
   the face that looks onto the street (o.face 'L' or 'R'). o.shop: the board's characters; o.boardCol */
HK.shopTower = function (g, x0, y0, x1, y1, h, o) {
  o = o || {}; const face = o.face || 'L';
  HK.resi(g, x0, y0, x1, y1, 0, h, Object.assign({ base: 5.4, seed: Math.round(x0 * 13 + y0 * 7) }, o));
  const p = face === 'L' ? y1 : x1, a0 = face === 'L' ? x0 : y0, a1 = face === 'L' ? x1 : y1;
  g.fill(K.on(face, p + 0.03, a0 + 0.4, a1 - 0.4, 0, 3.8), '#F2DDA8'); g.outline(K.on(face, p + 0.04, a0 + 0.4, a1 - 0.4, 0, 3.8), { w: 0.4, c: '#5A4E42', boil: false });
  const R = RNG(Math.round(x0 * 3 + y1 * 11)), s = []; for (let k = 0; k < 10; k++) { const a = lerp(a0 + 0.8, a1 - 0.8, R()), q0 = g.p.apply(g, K.pt(face, p + 0.05, a, 0.3)), q1 = g.p.apply(g, K.pt(face, p + 0.05, a, 0.3 + 1.4 + R() * 1.6)); s.push(q0[0], q0[1], q1[0], q1[1]); } g.segs2(s, o.goodsCol || '#C9584B', 1.1); HK.nite(g, g.cmds.length - 1, { nc: HK.lift(0.7) });
  if (o.shop) HK.board(g, face, p + 0.05, a0 + 0.3, a1 - 0.3, 3.9, 5.3, o.boardCol || '#C8372D', o.shop, { en: o.en, neon: o.neon });
  else if (o.en) { const i0 = g.cmds.length; K.sign(g, face, p + 0.05, a0 + 0.3, a1 - 0.3, 3.9, 5.3, o.boardCol || '#2C2622', o.en, { ink: o.ink || '#F7D046' }); HK.nite(g, i0, { nc: true }); HK.signGlow(g, face, p, a0, a1, 3.9, 5.3, o.ink || '#F7D046', 0.22); }
};
