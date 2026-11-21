'use strict';
/* London's own kit: the people of London (with umbrellas after the rain, bankers, guards in bearskins, Beefeaters,
   bobbies, drinkers with pints), its vehicles (the red double-decker, the black cab, the white van, Santander bikes),
   its street furniture (K6 phone box, pillar box, the Tube roundel and a station stair, Victorian lamps, plane trees,
   puddles), its buildings (brick terraces with chimney pots, the corner pub with hanging baskets), the Union flag,
   and the river's boats (Thames Clipper, sightseeing cruiser, police launch, the three-masted tall ship).
   Everything in tile-local u unless the name ends in 2 (wide px). */
const LK = {};
LK.C = {
  stone: '#ECE6D6', stoneM: '#DDD5C1', stoneD: '#C9C0A8',            // Portland stone
  gothic: '#DCC79C', gothicD: '#C2AB7C', gothicL: '#E8D9B4',          // Westminster's Anston limestone
  brick: '#B9654C', brickD: '#9C523D', stock: '#C8B387', stockD: '#AD9871',   // red brick, London stock brick
  slate: '#7A8290', slateD: '#626A78', lead: '#8E9AA3', leadD: '#76828C',
  red: '#C8372D', redD: '#A42C24', cab: '#2B2B2F', green: '#3F6B4E', navy: '#26314F',
  pave: '#E1DED5', paveW: '#D5D3CC', asph: '#CFCCC4', asphW: '#C3C1BA',
  water: '#A3BDBD', waterD: '#86A3A5', waterL: '#C7D8D5', mud: '#A8957A', mudD: '#8E7C62', shingle: '#BDB09A',
  grass: '#A8CB7E', grassD: '#86AE5E', puddle: '#C9DCE6', gold: '#D9A93E',
};

/* ---------------- ground ---------------- */
/* a flush rectangle of ground (no sides inside the map); cut: sides at the map's outer edge show a 1.1 deep section */
LK.ground = function (g, x0, y0, x1, y1, col, o) {
  o = o || {}; const cut = o.cut || '', D = 1.1;
  if (cut.indexOf('y') >= 0) { g.fill([[x0, y1, -D], [x1, y1, -D], [x1, y1, 0], [x0, y1, 0]], C.slab); g.line([[x0, y1, 0], [x0, y1, -D], [x1, y1, -D], [x1, y1, 0]], { w: 0.9 }); }
  if (cut.indexOf('x') >= 0) { g.fill([[x1, y1, -D], [x1, y0, -D], [x1, y0, 0], [x1, y1, 0]], C.slabD); g.line([[x1, y1, 0], [x1, y1, -D], [x1, y0, -D], [x1, y0, 0]], { w: 0.9 }); }
  g.fill(K.rect(x0, y0, x1, y1, 0), col);
  if (o.line !== false) g.outline(K.rect(x0, y0, x1, y1, 0), { w: 0.9, boil: false });
};
/* paving slabs: faint joints and pale dry scuffs */
LK.paving = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const st = o.step || 3.0, s = [];
  g.fill(K.rect(x0, y0, x1, y1, 0), o.col || LK.C.pave);
  for (let x = Math.ceil(x0 / st) * st; x < x1; x += st) { const a = g.p(x, y0, 0), b = g.p(x, y1, 0); s.push(a[0], a[1], b[0], b[1]); }
  for (let y = Math.ceil(y0 / st) * st; y < y1; y += st) { const a = g.p(x0, y, 0), b = g.p(x1, y, 0); s.push(a[0], a[1], b[0], b[1]); }
  g.segs2(s, o.joint || '#D2CEC2', 0.28);
  g.scuff(K.rect(x0, y0, x1, y1, 0), { dir: -0.9, len: 1.6, c: '#F1EEE6', dens: 0.25, w: 0.5, spread: 1.0 });
};
/* a puddle after the rain: a blobby pool holding the pale sky, a dark rim on its far edge and a bright streak */
LK.puddle = function (g, x, y, rx, ry, seed) {
  const R = RNG(seed || Math.round(x * 13 + y * 7)), pts = [];
  for (let i = 0; i < 10; i++) { const a = TAU * i / 10, r = 0.75 + R() * 0.35; pts.push([x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r, 0.02]); }
  const c = K.curve(pts, 3, true);
  g.fill(c, LK.C.puddle);
  const P = g.P(c); let cx = 0, cy = 0; for (const p of P) { cx += p[0]; cy += p[1]; } cx /= P.length; cy /= P.length;
  g.fill2(P.filter((p) => p[1] < cy).concat([[cx + rx * 2, cy], [cx - rx * 2, cy]]).length > 3 ? sortAround(P.filter((p) => p[1] < cy + 0.3)) : P, '#B3C9D6', true);
  g.segs2([cx - rx * 1.6, cy + 0.4, cx + rx * 0.6, cy - 0.3, cx + rx * 1.0, cy + 0.6, cx + rx * 1.9, cy + 0.2], '#F4F8FA', 0.55);
  g.outline2(P, { w: 0.3, c: '#9DB0BC', boil: false, wob: 0.3 });
};
/* the wet sheen on a road: long pale streaks along dir */
LK.sheen = function (g, poly, dir, seed) {
  g.scuff(poly, { dir, len: 11, c: '#DAD8D2', dens: 0.3, w: 0.8, spread: 0.03 });
  g.scuff(poly, { dir, len: 6, c: '#E6E5E1', dens: 0.12, w: 0.6, spread: 0.03 });
};

/* ---------------- lettering (the engine's stroke font, real words only) ---------------- */
/* a horizontal line of text centred on the wide-px point c (signs drawn flat to the screen: roundels, hanging boards) */
LK.label2 = function (g, c, str, h, col, o) {
  const w = unprj(c[0], c[1]), lx = w[0] - (g.ox || 0), ly = w[1] - (g.oy || 0), oz = g.oz || 0;
  K.textP(g, (a, z) => [lx + a / 2, ly - a / 2, z - oz], 0, -h / 2, h, str, col, Object.assign({ center: true }, o || {}));
};
/* text painted flat on the ground, reading along +x (or +y with o.alongY), glyph tops towards the far side */
LK.groundText = function (g, x, y, h, str, col, o) {
  o = o || {}; const P = o.alongY ? (a, z) => [x - z * 0.9, y - a, 0.02] : (a, z) => [x + a, y - z * 0.9, 0.02];
  K.textP(g, P, 0, 0, h, str, col, { center: true, w: o.w || 0.5 });
};

/* ---------------- people ---------------- */
const LK_TOPS = ['#3B3F47', '#C9B48A', '#26314F', '#6C7A89', '#8E2F2F', '#E7E2D6', '#5A6B5A', '#2F343B', '#B9A27D', '#7FA3C4', '#C9584B', '#E6C24F', '#3F5F8F', '#D98AA4', '#F0EDE4', '#8FBF73', '#6E5A44', '#A9B4BC'];
const LK_BOTS = ['#2F343B', '#3F4D63', '#2B3A55', '#6B7B8C', '#3B3F47', '#B9A27D', '#4A5A78', '#5A4A3C', '#8E8A84'];
const LK_UMB = ['#2A2622', '#26314F', '#C8372D', '#3F6B4E', '#E6C24F', '#F3F1EA', '#6E4F8C', '#2F343B'];
/* a Londoner: raincoats and dark layers after the rain, a few umbrellas still up */
LK.who = function (seed, o) {
  const R = RNG(seed * 4111 + 7), w = K.who(seed);
  w.top = R.pick(LK_TOPS); w.bot = R.pick(LK_BOTS); w.bare = R() < 0.12; w.shorts = R() < 0.04;
  w.shoe = R.pick(['#2F2A26', '#2F2A26', '#5A3E2E', '#F3F1EA', '#3B3F47']);
  if (R() < 0.15) w.dress = R.pick(['#26314F', '#2F343B', '#B9A27D', '#8E2F2F', '#6E5A44', '#7FA3C4']);
  if (R() < 0.08) w.umb = R.pick(LK_UMB);
  if (R() < 0.06) w.cap = R.pick(['#3B3F47', '#26314F', '#8E2F2F']);
  return Object.assign(w, o || {});
};
/* a City banker: dark suit, white shirt, a tie, a briefcase */
LK.banker = function (seed, o) {
  const R = RNG(seed * 313 + 9), suit = R.pick(['#2F343B', '#2B3A55', '#3B3F47', '#4A4F57']);
  return Object.assign(LK.who(seed), { top: suit, bot: suit, jacket: R() < 0.7 ? '#F3F1EA' : '#CFE0EA', tie: R.pick(['#C8372D', '#3F5F8F', '#7A5BA0', '#B9A27D', '#E6C24F']), shoe: '#2A2420', dress: undefined, cap: undefined, bare: false, shorts: false, bag: '#4A3426', umb: R() < 0.12 ? '#2A2622' : undefined }, o || {});
};
/* a tourist: backpack, a map or a phone */
LK.tourist = function (seed, o) {
  const R = RNG(seed * 97 + 5);
  return Object.assign(K.who(seed), { pack: R.pick(['#C9584B', '#3F5F8F', '#E6C24F', '#5FA58F', '#2F343B']), phone: R() < 0.5, cap: R() < 0.25 ? R.pick(['#C9584B', '#F3F1EA', '#3F5F8F']) : undefined }, o || {});
};
/* a guardsman of the Foot Guards: scarlet tunic, dark blue trousers with a red stripe, bearskin, rifle */
LK.guard = function (seed, o) {
  const R = RNG(seed * 53 + 1);
  return Object.assign({ skin: R.pick([SKIN[0], SKIN[1], SKIN[2], SKIN[3], SKIN[5]]), hair: '#2B2420', top: '#C8372D', bot: '#1F2433', shoe: '#1A1816', hairStyle: 'buzz', build: 0.45, k: 1.0, bearskin: true, belt: '#F6F3EA', rifle: true }, o || {});
};
/* a bandsman: like a guard, an instrument instead of the rifle */
LK.bandsman = function (seed, inst, o) { return Object.assign(LK.guard(seed), { rifle: false, inst }, o || {}); };
/* a Yeoman Warder (Beefeater): dark blue undress tunic with red trim, Tudor bonnet, often a beard */
LK.beefeater = function (seed, o) {
  const R = RNG(seed * 71 + 3);
  return Object.assign({ skin: R.pick([SKIN[0], SKIN[1], SKIN[2]]), hair: R.pick(['#8E8A84', '#5A3A24', '#D9D4C8']), top: '#232E58', bot: '#232E58', shoe: '#1A1816', hairStyle: 'short', beard: R() < 0.8, build: 0.75, bonnet: true, trim: '#C8372D' }, o || {});
};
/* a Metropolitan Police officer: dark navy, the custodian helmet */
LK.bobby = function (seed, o) {
  const R = RNG(seed * 29 + 5);
  return Object.assign({ skin: R.pick(SKIN), hair: '#2B2420', top: '#1F2433', bot: '#1F2433', shoe: '#1A1816', hairStyle: 'short', build: 0.5, helmet: true, vest: R() < 0.5 }, o || {});
};
/* K.person plus London extras drawn on the returned points */
LK.person = function (g, x, y, z, w) {
  const dir = w.dir | 0, back = dir >= 2, sg = (dir === 0 || dir === 3) ? 1 : -1, k = w.k || 1;
  let o = w;
  if (w.umb && !w.hands && w.pose !== 'sit' && w.pose !== 'hold') o = Object.assign({}, w, { hands: [[sg * 2.6, -13.6], [-sg * 0.7, -9.6]] });
  if (w.pack && !back) { const F = g.p(x, y, z || 0), P = (u, v) => [F[0] - sg * u * k, F[1] + v * k]; const pk = [P(2.4, -15.4), P(4.4, -15.0), P(4.6, -10.2), P(2.4, -10.0)]; g.fill2(pk, w.pack, true); g.outline2(pk, { w: 0.35, c: '#3A3128', boil: false }); }
  const r = K.person(g, x, y, z, o);
  const H = r.head, hr = r.headR, c = r.crown;
  if (w.pack && back) { const sp = r.shoulders, mx = (sp[0][0] + sp[1][0]) / 2, y0 = sp[0][1] + 0.3 * k; const pk = [[mx - 2.3 * k, y0], [mx + 2.2 * k, y0], [mx + 2.0 * k, y0 + 5.2 * k], [mx - 2.1 * k, y0 + 5.2 * k]]; g.fill2(pk, w.pack, true); g.fill2([[mx - 2.3 * k, y0], [mx + 2.2 * k, y0], [mx + 2.2 * k, y0 + 1.5 * k], [mx - 2.3 * k, y0 + 1.5 * k]], shade(w.pack, 0.2), true); g.outline2(pk, { w: 0.35, c: '#3A3128', boil: false }); }
  if (w.belt) { const sp = r.shoulders, hp = r.hip, mx = (sp[0][0] + sp[1][0]) / 2, yb = lerp(sp[0][1], hp[1], 0.78), hw = 2.2 * k; g.fill2([[mx - hw, yb - 0.45 * k], [mx + hw, yb - 0.45 * k], [mx + hw, yb + 0.45 * k], [mx - hw, yb + 0.45 * k]], w.belt, true); if (!back) { const bt = []; for (let i = 0; i < 4; i++) { const yy = lerp(sp[0][1], yb, (i + 0.6) / 4.2); bt.push([mx + sg * 0.5 * k, yy]); } for (const b of bt) g.disc2(b, 0.26 * k, '#E6C24F'); } }
  if (w.trim) { const sp = r.shoulders, hp = r.hip, mx = (sp[0][0] + sp[1][0]) / 2; g.fill2([[mx - 2.4 * k, hp[1] - 0.2 * k], [mx + 2.4 * k, hp[1] - 0.2 * k], [mx + 2.4 * k, hp[1] + 0.5 * k], [mx - 2.4 * k, hp[1] + 0.5 * k]], w.trim, true); if (!back) { const cy = lerp(sp[0][1], hp[1], 0.4); g.fill2([[mx - 0.9 * k, cy - 0.9 * k], [mx + 0.9 * k, cy - 0.9 * k], [mx + 0.9 * k, cy + 0.9 * k], [mx - 0.9 * k, cy + 0.9 * k]], w.trim, true); } }
  if (w.vest) { const sp = r.shoulders, hp = r.hip, mx = (sp[0][0] + sp[1][0]) / 2, y0 = sp[0][1] + 0.4 * k, y1 = lerp(sp[0][1], hp[1], 0.95); g.fill2([[mx - 2.2 * k, y0], [mx + 2.2 * k, y0], [mx + 2.1 * k, y1], [mx - 2.1 * k, y1]], '#D9E35A', true); g.fill2([[mx - 2.2 * k, lerp(y0, y1, 0.55)], [mx + 2.2 * k, lerp(y0, y1, 0.55)], [mx + 2.2 * k, lerp(y0, y1, 0.68)], [mx - 2.2 * k, lerp(y0, y1, 0.68)]], '#D9DDE0', true); }
  if (w.bearskin) {     // tall black fur, low over the eyes
    const pts = K.curve([[c[0] - 1.18 * hr, c[1] + 0.95 * hr], [c[0] - 1.32 * hr, c[1] - 0.6 * hr], [c[0] - 1.05 * hr, c[1] - 2.0 * hr], [c[0] - 0.1 * hr, c[1] - 2.55 * hr], [c[0] + 0.95 * hr, c[1] - 2.1 * hr], [c[0] + 1.3 * hr, c[1] - 0.6 * hr], [c[0] + 1.16 * hr, c[1] + 0.95 * hr]], 2, false);
    g.fill2(pts, '#1E1B19', true);
    g.fill2(pts.filter((p) => p[0] > c[0] + 0.2 * hr).concat([[c[0] + 0.2 * hr, c[1] + 0.9 * hr]]), '#2E2A26', true);
    g.line2(pts, { w: 0.4, c: '#0E0C0B', boil: false, wob: 0.6 });
    if (!back) g.line2([[c[0] - 0.9 * hr * sg, c[1] + 0.9 * hr], [c[0] + 0.5 * sg * hr, c[1] + 2.2 * hr]], { w: 0.28, c: '#D9A93E', boil: false, ext: 0 });
  }
  if (w.bonnet) {       // Tudor bonnet: a wide flat black hat with a soft crown
    const brim = arcPts(c[0], c[1] + 0.25 * hr, 1.55 * hr, 0, TAU, 14).map((p) => [p[0], c[1] + 0.25 * hr + (p[1] - c[1] - 0.25 * hr) * 0.32]);
    const top = arcPts(c[0] + 0.1 * sg * hr, c[1] - 0.2 * hr, 1.05 * hr, Math.PI, TAU, 8).concat([[c[0] + 1.15 * hr, c[1] + 0.2 * hr], [c[0] - 0.95 * hr, c[1] + 0.2 * hr]]);
    g.fill2(top, '#1E1B19', true); g.fill2(brim, '#2A2622', true);
    g.disc2([c[0] + 0.7 * sg * hr, c[1] - 0.1 * hr], 0.3 * hr, '#C8372D');
  }
  if (w.helmet) {       // custodian helmet: a tall dome, a knob on top, a silver star at the front
    const pts = K.curve([[c[0] - 1.12 * hr, c[1] + 0.85 * hr], [c[0] - 1.18 * hr, c[1] - 0.4 * hr], [c[0] - 0.75 * hr, c[1] - 1.75 * hr], [c[0] + 0.05 * hr, c[1] - 2.1 * hr], [c[0] + 0.8 * hr, c[1] - 1.75 * hr], [c[0] + 1.2 * hr, c[1] - 0.4 * hr], [c[0] + 1.14 * hr, c[1] + 0.85 * hr]], 2, false);
    g.fill2(pts, '#1F2433', true); g.line2(pts, { w: 0.35, c: '#0E0C0B', boil: false, wob: 0.3 });
    g.disc2([c[0] + 0.05 * hr, c[1] - 2.25 * hr], 0.3 * hr, '#D9DDE0');
    if (!back) g.disc2([c[0] + 0.35 * sg * hr, c[1] - 0.45 * hr], 0.38 * hr, '#E4E7EA');
  }
  const hn = r.hands[0], hf = r.hands[1];
  if (w.dog) {          // a small dog on a lead, trotting at the walker's side
    const F = g.p(x, y, z || 0), d = [F[0] + sg * 4.2 * k, F[1] + 0.6 * k], up = w.pose === 'walk' ? Math.abs(Math.sin((w.ph || 0) * TAU)) * 0.4 : 0;
    const b = [[d[0] - sg * 1.7, d[1] - 2.0 - up], [d[0] + sg * 1.2, d[1] - 2.3 - up], [d[0] + sg * 1.5, d[1] - 1.2 - up], [d[0] - sg * 1.6, d[1] - 1.0 - up]];
    const lg = []; for (const u of [-1.3, -0.8, 0.8, 1.2]) lg.push(d[0] + sg * u, d[1] - 1.1 - up, d[0] + sg * u + (w.pose === 'walk' ? Math.sin((w.ph || 0) * TAU + u) * 0.4 : 0), d[1]);
    g.segs2(lg, shade(w.dog, 0.4), 0.45); g.fill2(b, w.dog, true);
    const hd = [d[0] + sg * 1.8, d[1] - 2.8 - up]; g.disc2(hd, 0.8, w.dog); g.fill2([[hd[0] + sg * 0.5, hd[1] - 0.2], [hd[0] + sg * 1.5, hd[1] + 0.2], [hd[0] + sg * 0.5, hd[1] + 0.5]], shade(w.dog, 0.2), true);
    g.fill2([[hd[0] - sg * 0.2, hd[1] - 0.5], [hd[0] - sg * 0.6, hd[1] + 0.6], [hd[0] + sg * 0.1, hd[1] + 0.2]], shade(w.dog, 0.35), true);
    g.line2([[d[0] - sg * 1.7, d[1] - 2.0 - up], [d[0] - sg * 2.6, d[1] - 3.0 - up]], { w: 0.45, c: w.dog, boil: false, ext: 0 });
    g.fine2([r.hands[0], [hd[0] - sg * 0.3, hd[1] + 0.6]], { w: 0.25, c: '#3A3128' });
  }
  if (w.umb) {          // an umbrella still up: the shaft from the near hand, a ribbed canopy over the head
    const top = [hn[0] + sg * 0.3 * k, c[1] - 4.6 * k], R = 6.6 * k, h = 2.8 * k, cy = top[1] + 0.8 * k;
    g.line2([hn, top], { w: 0.4, c: '#3A3128', boil: false, ext: 0 });
    const rim = []; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; rim.push([top[0] - Math.cos(t) * R, cy + h * 0.55 + Math.sin(t) * 0.9 * k]); }
    const can = [top].concat(rim);
    g.fill2(can, w.umb, true);
    g.fill2([top, rim[4], rim[5], rim[6], rim[7], rim[8]], shade(w.umb, 0.15), true);
    const rb = []; for (const i of [2, 4, 6]) rb.push(top[0], top[1], rim[i][0], rim[i][1]); g.segs2(rb, shade(w.umb, 0.35), 0.3);
    g.line2(can, { w: 0.4, c: shade(w.umb, 0.55), close: true, boil: false, wob: 0.25 });
    g.line2([[hn[0], hn[1]], [hn[0] - sg * 0.6 * k, hn[1] + 0.6 * k]], { w: 0.45, c: '#3A3128', boil: false, ext: 0 });
  }
  if (w.bag) g.fill2([[hn[0] - 1.1 * k, hn[1] + 0.2 * k], [hn[0] + 1.1 * k, hn[1] + 0.2 * k], [hn[0] + 1.1 * k, hn[1] + 1.9 * k], [hn[0] - 1.1 * k, hn[1] + 1.9 * k]], w.bag, true);
  if (w.phone) g.fill2([[hn[0] - 0.42, hn[1] - 1.1], [hn[0] + 0.42, hn[1] - 1.1], [hn[0] + 0.42, hn[1] + 0.3], [hn[0] - 0.42, hn[1] + 0.3]], '#2A2622', true);
  if (w.pint) { const p = [hn[0], hn[1] - 0.3 * k]; g.fill2([[p[0] - 0.55 * k, p[1] + 0.4 * k], [p[0] + 0.55 * k, p[1] + 0.4 * k], [p[0] + 0.68 * k, p[1] - 1.7 * k], [p[0] - 0.68 * k, p[1] - 1.7 * k]], w.pint, true); g.fill2([[p[0] - 0.7 * k, p[1] - 1.6 * k], [p[0] + 0.7 * k, p[1] - 1.6 * k], [p[0] + 0.66 * k, p[1] - 2.1 * k], [p[0] - 0.66 * k, p[1] - 2.1 * k]], '#FBF8EE', true); }
  if (w.rifle) { const s = r.shoulders[1], a = [s[0] + sg * 0.4 * k, s[1] + 3.0 * k], b = [s[0] + sg * 1.6 * k, s[1] - 8.0 * k]; g.line2([a, b], { w: 0.75 * k, c: '#3A2A1E', boil: false, ext: 0 }); g.line2([b, [b[0] + sg * 0.25 * k, b[1] - 2.2 * k]], { w: 0.3, c: '#D9DDE0', boil: false, ext: 0 }); }
  if (w.inst === 'drum') { const p = [r.hip[0] + sg * 1.6 * k, r.hip[1] - 1.0 * k]; g.fill2(arcPts(p[0], p[1], 2.6 * k, 0, TAU, 12).map((q) => [q[0], p[1] + (q[1] - p[1]) * 0.75]), '#F3F1EA', true); g.fill2([[p[0] - 2.6 * k, p[1] - 0.9 * k], [p[0] + 2.6 * k, p[1] - 0.9 * k], [p[0] + 2.6 * k, p[1] - 0.2 * k], [p[0] - 2.6 * k, p[1] - 0.2 * k]], '#C8372D', true); g.ring2(p, 2.6 * k, { w: 0.35, c: '#3A3128' }); }
  else if (w.inst === 'brass') { const p = [hn[0] + sg * 0.4 * k, hn[1] - 2.2 * k]; g.fill2(arcPts(p[0], p[1], 1.5 * k, 0, TAU, 10), '#E0B54A', true); g.line2([hn, [H[0] + sg * 1.4 * k, H[1] + 0.6 * k]], { w: 0.45, c: '#C9993A', boil: false, ext: 0 }); g.ring2(p, 1.5 * k, { w: 0.3, c: '#8A6A2A' }); }
  void hf;
  return r;
};
/* a crowd member seen as a bust (behind railings, on steps) */
LK.bust2 = function (g, p, w, k) {
  k = k || 1; const s = (u, v) => [p[0] + u * k, p[1] + v * k];
  g.fill2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], w.top, true);
  g.fill2([s(-0.55, -4.6), s(0.55, -4.6), s(0.5, -5.8), s(-0.5, -5.8)], shade(w.skin, 0.12), true);
  g.disc2(s(0, -7.6), 1.95 * k, w.skin); g.fill2(K.curve([s(-2.05, -7.2), s(-1.9, -8.9), s(0, -9.75), s(1.9, -8.9), s(2.05, -7.3), s(1.2, -8.2), s(-1.0, -8.25)], 2, true), w.hair, true);
  g.disc2(s(-0.6, -7.4), 0.22 * k, '#2A2420'); g.disc2(s(0.65, -7.4), 0.2 * k, '#2A2420');
  g.outline2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], { w: 0.35, c: '#3A3128', boil: false });
};
/* a walker on a closed route (K.walker with LK.person) */
LK.walker = function (T, who, pts, speed, o) {
  o = o || {}; const seg = [], L = [0];
  if (pts.length > 2 && !o.loop) pts = pts.concat(pts.slice(1, -1).reverse());     // out and back: never cut across a closing diagonal
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
    draw(g, st) { LK.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
};
/* a person standing still in the cast */
LK.stand = function (T, x, y, who, o) { o = o || {}; return T.cast([x, y], (g) => LK.person(g, x, y, o.z || 0, who), { on: true }); };

/* ---------------- vehicles ---------------- */
/* the red double-decker: two decks of windows, a black skirt, a destination blind with the route number */
LK.bus = function (g, ang, o) {
  o = o || {}; const L = 7.0, Wd = 2.5, Z = 8.4, red = o.col || LK.C.red;
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, red, { line: false, nt: true }); K.shadow(g, sh, 0.5);
  const wu = [-L * 0.55, L * 0.6];
  K.wheels(g, sh, wu, 1.05, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.7, Z, { t: shade(red, -0.08), l: red, r: shade(red, 0.12) }, { w: 0.9 });
  for (const f of ['pu', 'nu', 'pv', 'nv']) if (B.vis[f]) {
    g.fill(B.quad(f, -1, 1, 0.7, 1.35), '#2E2A28');
    g.line([B.quad(f, -1, 1, 5.05, 5.05)[0], B.quad(f, -1, 1, 5.05, 5.05)[1]], { w: 0.45, c: '#7A2018', boil: false, ext: 0 });
  }
  for (const f of ['pv', 'nv']) if (B.vis[f]) {
    const n = 5; for (let i = 0; i < n; i++) { const a0 = -0.9 + 1.8 * i / n + 0.03, a1 = -0.9 + 1.8 * (i + 1) / n - 0.03; K.rwin(g, B, f, a0, a1, 2.7, 4.6, { col: '#D5E3EA' }); K.rwin(g, B, f, a0, a1, 5.6, 7.7, { col: '#D5E3EA', glint: i % 2 === 0 }); }
  }
  if (B.vis.pu) {
    K.rwin(g, B, 'pu', -0.85, 0.85, 2.3, 4.7, { col: '#C9DCE6' });
    g.fill(B.quad('pu', -0.8, 0.8, 5.15, 5.8), '#1E1C1A');
    K.textP(g, (a, z) => B.pt(L + 0.04, -a, z), 0, 5.22, 0.42, o.route || '11', '#F2C14E', { center: true, w: 0.42 });
    K.rwin(g, B, 'pu', -0.85, 0.85, 5.95, 7.7, { col: '#D5E3EA' });
  }
  if (B.vis.nu) { K.rwin(g, B, 'nu', -0.6, 0.6, 5.9, 7.6, { col: '#D5E3EA' }); g.fill(B.quad('nu', -0.7, 0.7, 2.6, 3.6), '#1E1C1A'); }
  K.wheels(g, sh, wu, 1.05, 'near', { arch: '#2A2622' });
  K.lights(g, B, 1.55);
};
/* the black cab: tall rounded body, the yellow TAXI sign on the roof */
LK.cab = function (g, ang, o) {
  o = o || {}; const col = o.col || LK.C.cab, L = 4.8, Wd = 2.35;
  const tone = { t: '#4A4A50', l: col, r: '#1E1E22' };
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  const wu = [-L * 0.6, L * 0.62];
  K.wheels(g, sh, wu, 0.95, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.75, 2.75, tone, { w: 0.8 });
  for (const f of ['pv', 'nv']) if (B.vis[f]) { const s = B.quad(f, -0.05, -0.05, 0.9, 2.7); g.line([s[0], s[3]], { w: 0.3, c: '#55555C', boil: false, ext: 0 }); }
  if (B.vis.pu) g.fill(B.quad('pu', -0.55, 0.55, 1.2, 2.1), '#B9BCC0');
  K.wheels(g, sh, wu, 0.95, 'near', { arch: '#111' });
  K.lights(g, B, 1.55);
  const ca = Math.cos(ang), sa = Math.sin(ang), off = -L * 0.08;
  const cab = K.rbox(g, off * ca, off * sa, L * 0.6, Wd - 0.2, ang, 2.75, 5.1, tone, { nb: true, w: 0.75 });
  for (const f of ['pv', 'nv']) { K.rwin(g, cab, f, -0.85, -0.12, 3.05, 4.7, { col: '#AFC3CE' }); K.rwin(g, cab, f, 0.0, 0.82, 3.05, 4.7, { col: '#AFC3CE' }); }
  K.rwin(g, cab, 'pu', -0.82, 0.82, 3.0, 4.75, { col: '#AFC3CE' }); K.rwin(g, cab, 'nu', -0.7, 0.7, 3.1, 4.7, { col: '#AFC3CE' });
  const p = cab.pt(L * 0.5, 0, 5.1); K.rbox(g, p[0], p[1], 0.35, 0.8, ang, 5.1, 5.75, { t: '#F6D36A', l: '#F2C14E', r: '#D9A93E' }, { w: 0.4 });
};
/* a white van */
LK.van = function (g, ang, o) { K.bus(g, ang, { L: 5.4, W: 2.45, h: 5.0, n: 2, col: (o && o.col) || '#F1EFE8', band: (o && o.band) || '#E9E6DE' }); };
/* a cyclist on a red hire bike */
LK.bike = function (g, ang, who) { K.bike(g, ang, { col: '#D23C2E', who }); };
/* a road vehicle by kind */
LK.vehicle = function (g, ang, kind, col, route) {
  if (kind === 'bus') LK.bus(g, ang, { route });
  else if (kind === 'cab') LK.cab(g, ang);
  else if (kind === 'van') LK.van(g, ang);
  else K.car(g, ang, { col: col || '#8FA3B5' });
};
LK.HL = { bus: 7.0, cab: 4.8, van: 5.4, car: 5.3 };

/* ---------------- street furniture ---------------- */
/* the K6 phone box: red, a domed roof, the TELEPHONE band, small glazed panes */
LK.phonebox = function (g, x, y, o) {
  o = o || {}; const h = 1.55, Z = 8.4, red = '#C42F25';
  K.box(g, x - h, y - h, x + h, y + h, 0, Z, { t: '#B02A22', l: red, r: '#A3271F' }, { w: 0.7, boil: false });
  for (const [f, p, a0] of [['L', y + h, x - h], ['R', x + h, y - h]]) {
    const pane = []; for (let i = 1; i < 3; i++) { const a = g.p.apply(g, K.pt(f, p + 0.02, a0 + 0.55 + i * 0.67, 1.3)), b = g.p.apply(g, K.pt(f, p + 0.02, a0 + 0.55 + i * 0.67, 6.7)); pane.push(a[0], a[1], b[0], b[1]); }
    g.fill(K.on(f, p + 0.01, a0 + 0.55, a0 + 2.55, 1.3, 6.7), '#D7E3E8');
    for (let j = 1; j < 8; j++) { const zz = 1.3 + j * 0.675, a = g.p.apply(g, K.pt(f, p + 0.02, a0 + 0.55, zz)), b = g.p.apply(g, K.pt(f, p + 0.02, a0 + 2.55, zz)); pane.push(a[0], a[1], b[0], b[1]); }
    g.segs2(pane, red, 0.45);
    g.fill(K.on(f, p + 0.02, a0 + 0.4, a0 + 2.7, 7.0, 7.7), '#F3F1EA');
    K.text(g, f, p + 0.02, a0 + 1.55, 7.2, 0.3, 'TELEPHONE', '#2C271C', { center: true, w: 0.26, track: 4.6 });
  }
  const top = g.p(x, y, Z), d = K.domePts(g, x, y, Z, h * 1.05, 0.9); g.fill2(d.top, '#B02A22'); g.line2(d.top, { w: 0.5, c: '#6E1A14', boil: false });
  g.disc2([top[0], top[1] - 3.0], 0.55, '#D9A93E');
};
/* a pillar box: a red cylinder with a black base, a domed cap and the dark slot */
LK.pillar = function (g, x, y) {
  K.cyl(g, x, y, 1.0, 0, 0.6, { t: '#2A2622', l: '#2A2622', r: '#1E1B19' }, { w: 0.45, n: 10 });
  K.cyl(g, x, y, 0.9, 0.6, 4.4, { t: '#B52B22', l: '#C8372D', r: '#A42C24' }, { w: 0.55, n: 10, nt: true });
  const d = K.domePts(g, x, y, 4.4, 1.05, 0.8); g.fill2(d.top, '#B52B22'); g.line2(d.top, { w: 0.45, c: '#6E1A14', boil: false });
  const s = g.p(x - 0.35, y + 0.8, 3.6); g.fill2([[s[0] - 1.1, s[1] - 0.25], [s[0] + 1.1, s[1] - 0.8], [s[0] + 1.1, s[1] - 0.25], [s[0] - 1.1, s[1] + 0.3]], '#1E1B19', true);
};
/* the Tube roundel on a post: a red ring and a blue bar */
LK.roundel = function (g, x, y, o) {
  /* o.name: the station's name on the blue bar */
  o = o || {}; const h = o.h || 9, b = g.p(x, y, 0), t = g.p(x, y, h);
  g.line2([b, [t[0], t[1] + 3.2]], { w: 0.8, c: '#3A3530', boil: false, ext: 0 });
  const c = [t[0], t[1]], R = 3.0;
  g.fill2(arcPts(c[0], c[1], R, 0, TAU, 20), '#D2392B', true); g.fill2(arcPts(c[0], c[1], R * 0.62, 0, TAU, 18), '#F6F3EA', true);
  g.fill2([[c[0] - R * 1.3, c[1] - 0.85], [c[0] + R * 1.3, c[1] - 0.85], [c[0] + R * 1.3, c[1] + 0.85], [c[0] - R * 1.3, c[1] + 0.85]], '#1F3F9A', true);
  { const nm = o.name || 'UNDERGROUND'; LK.label2(g, c, nm, Math.min(0.3, R * 2.3 / (K.textW(nm, 1) * 2.92)), '#F6F3EA', { w: 0.3 }); }
  g.ring2(c, R, { w: 0.35, c: '#7A1E16' });
};
/* a Tube station entrance: a stair down into the pavement with railings, the roundel on its post.
   axis: the stair runs down along +y ('y') or +x ('x'); (x, y) is the top step */
LK.tube = function (g, x, y, o) {
  o = o || {}; const ax = o.axis || 'y', W = 2.3, Ln = 6.5, dep = 3.6;
  const P = (a, b, z) => ax === 'y' ? [x + a, y + b, z] : [x + b, y + a, z];
  g.fill([P(-W, 0, 0), P(W, 0, 0), P(W, Ln, 0), P(-W, Ln, 0)], '#4A4540');
  const st = []; for (let i = 0; i < 9; i++) { const b = Ln * i / 9, z = -dep * i / 9, a = g.p.apply(g, P(-W, b, z)), c = g.p.apply(g, P(W, b, z)); st.push(a[0], a[1], c[0], c[1]); }
  g.fill([P(-W + 0.1, 0.1, -0.1), P(W - 0.1, 0.1, -0.1), P(W - 0.1, Ln - 0.1, -dep), P(-W + 0.1, Ln - 0.1, -dep)], '#8C867C');
  g.segs2(st, '#5A544C', 0.4);
  g.fill([P(-W + 0.2, Ln - 0.2, -dep), P(W - 0.2, Ln - 0.2, -dep), P(W - 0.2, Ln - 0.2, -dep + 2.8), P(-W + 0.2, Ln - 0.2, -dep + 2.8)], '#2A2622');
  const rl = []; for (const a of [-W, W]) { for (let i = 0; i <= 6; i++) { const p0 = g.p.apply(g, P(a, Ln * i / 6, 0)), p1 = g.p.apply(g, P(a, Ln * i / 6, 2.6)); rl.push(p0[0], p0[1], p1[0], p1[1]); } }
  { const p0 = g.p.apply(g, P(-W, Ln, 0)), p1 = g.p.apply(g, P(W, Ln, 0)), q0 = g.p.apply(g, P(-W, Ln, 2.6)), q1 = g.p.apply(g, P(W, Ln, 2.6)); rl.push(p0[0], p0[1], q0[0], q0[1], p1[0], p1[1], q1[0], q1[1]); }
  g.segs2(rl, '#2E2A26', 0.4);
  for (const a of [-W, W]) g.line([P(a, 0, 2.6), P(a, Ln, 2.6)], { w: 0.55, c: '#2E2A26', boil: false });
  g.line([P(-W, Ln, 2.6), P(W, Ln, 2.6)], { w: 0.55, c: '#2E2A26', boil: false });
};
/* a Victorian lamp: a dark post with a fluted base and a four-paned lantern */
LK.lamp = function (g, x, y, o) {
  o = o || {}; const h = o.h || 9.2, z0 = o.z || 0, col = o.col || '#2E3A33', f = g.p(x, y, z0), t = g.p(x, y, z0 + h);
  g.fill2([[f[0] - 1.0, f[1]], [f[0] + 1.0, f[1]], [f[0] + 0.7, f[1] - 2.6], [f[0] - 0.7, f[1] - 2.6]], col);
  g.fill2([[f[0] - 0.42, f[1] - 2.4], [f[0] + 0.42, f[1] - 2.4], [t[0] + 0.32, t[1]], [t[0] - 0.32, t[1]]], col);
  g.line2([[t[0] - 1.6, t[1] + 1.4], [t[0] + 1.6, t[1] + 1.4]], { w: 0.5, c: col, boil: false, ext: 0 });
  const L = [[t[0] - 1.3, t[1] - 0.1], [t[0] + 1.3, t[1] - 0.1], [t[0] + 1.7, t[1] - 3.6], [t[0] - 1.7, t[1] - 3.6]];
  g.fill2(L, '#F4E7B8'); g.fill2([[t[0] + 0.1, t[1] - 0.1], [t[0] + 1.3, t[1] - 0.1], [t[0] + 1.7, t[1] - 3.6], [t[0] + 0.15, t[1] - 3.6]], '#E9D58F');
  g.line2(L, { w: 0.45, c: col, close: true, boil: false });
  g.fill2([[t[0] - 2.0, t[1] - 3.5], [t[0] + 2.0, t[1] - 3.5], [t[0], t[1] - 5.2]], col); g.disc2([t[0], t[1] - 5.4], 0.45, col);
};
/* a London plane: a tall mottled trunk, a broad light crown */
LK.plane = function (g, x, y, o) {
  o = o || {}; K.tree(g, x, y, Object.assign({ r: 5.6, h: 6.4, col: '#93BC6A', ink: '#4E6E38' }, o));
  const f = g.p(x, y, o.z || 0), R = RNG(Math.round(x * 17 + y * 3)), seg = [];
  for (let i = 0; i < 5; i++) { const yy = f[1] - 2 - R() * (o.h || 6.4) * 2.6; seg.push(f[0] - 0.9 + R() * 0.8, yy, f[0] - 0.2 + R() * 0.9, yy - 0.8); }
  g.segs2(seg, '#D9CDA6', 0.9);
};
/* a bench with a back, facing 'R' (lower right) or 'L' */
LK.bench = function (g, x, y, o) { K.bench(g, x, y, Object.assign({ col: '#5E7B5A' }, o || {})); };
/* hanging basket: a ball of flowers on a bracket (wide px point p) */
LK.basket2 = function (g, p, s) {
  s = s || 1; g.line2([[p[0], p[1] - 3.2 * s], [p[0], p[1] - 1.2 * s]], { w: 0.3, c: '#2E2A26', boil: false, ext: 0 });
  const R = RNG(Math.round(p[0] * 7 + p[1] * 3));
  g.disc2(p, 1.9 * s, '#6E9A50'); for (let i = 0; i < 7; i++) { const a = R() * TAU, d = R() * 1.6 * s; g.disc2([p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d * 0.8], 0.55 * s, R.pick(['#E0503E', '#F3F1EA', '#D98AA4', '#E6C24F', '#B24A9E'])); }
};

/* ---------------- buildings ---------------- */
/* a sash window: white frame, glazing bars, pale glass */
LK.sash = function (g, face, p, a0, a1, z0, z1, o) {
  o = o || {};
  g.fill(K.on(face, p + 0.01, a0 - 0.18, a1 + 0.18, z0 - 0.25, z1 + 0.15), o.frame || '#F3F1EA');
  const q = K.on(face, p + 0.02, a0, a1, z0, z1); g.fill(q, o.glass || '#B9CCD6');
  const Q = g.P(q), m = []; const mz = g.P([K.pt(face, p + 0.03, a0, (z0 + z1) / 2), K.pt(face, p + 0.03, a1, (z0 + z1) / 2)]), ma = g.P([K.pt(face, p + 0.03, (a0 + a1) / 2, z0), K.pt(face, p + 0.03, (a0 + a1) / 2, z1)]);
  m.push(mz[0][0], mz[0][1], mz[1][0], mz[1][1], ma[0][0], ma[0][1], ma[1][0], ma[1][1]); g.segs2(m, '#F3F1EA', 0.35);
  const cx = (Q[0][0] + Q[2][0]) / 2, cy = (Q[0][1] + Q[2][1]) / 2; g.segs2([cx - 0.5, cy + 0.9, cx + 0.4, cy - 0.7], '#FFFFFF', 0.45);
  g.outline2(Q, { w: 0.3, c: '#5A544C', boil: false, ext: 0.1 });
};
/* chimney stack with a row of terracotta pots */
LK.chimney = function (g, x, y, z, o) {
  o = o || {}; const n = o.n || 4, along = o.along || 'y', L = n * 0.62 + 0.3, Wd = 0.75, h = o.h || 2.2, col = o.col || LK.C.stock;
  const fp = along === 'y' ? [x - Wd, y - L / 2, x + Wd, y + L / 2] : [x - L / 2, y - Wd, x + L / 2, y + Wd];
  K.box(g, fp[0], fp[1], fp[2], fp[3], z - 1, z + h, { t: shade(col, -0.15), l: col, r: shade(col, 0.15) }, { w: 0.5, boil: false, nohid: true });
  K.box(g, fp[0] - 0.12, fp[1] - 0.12, fp[2] + 0.12, fp[3] + 0.12, z + h, z + h + 0.3, shade(col, -0.1), { w: 0.4, boil: false, nohid: true });
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, px = along === 'y' ? x : lerp(fp[0] + 0.2, fp[2] - 0.2, t), py = along === 'y' ? lerp(fp[1] + 0.2, fp[3] - 0.2, t) : y; K.cyl(g, px, py, 0.26, z + h + 0.3, z + h + 1.15, { t: '#7A3E2A', l: '#C9784E', r: '#A65E3C' }, { w: 0.3, n: 6 }); }
};
/* a terrace of houses facing 'L' (the street at y = y1) or 'R' (the street at x = x1): n houses side by side, each
   with its own door colour, sash windows, a parapet and a slate roof behind, chimney stacks on the party walls */
LK.terrace = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const face = o.face || 'L', n = o.n || 4, st = o.st || 3, H = st * 4.2 + 0.8, col = o.col || LK.C.stock;
  const bp = g.boilP; g.boilP = 0.25;
  const along0 = face === 'L' ? x0 : y0, along1 = face === 'L' ? x1 : y1, p = face === 'L' ? y1 : x1, w = (along1 - along0) / n;
  K.box(g, x0, y0, x1, y1, 0, H, { t: shade(col, -0.2), l: face === 'L' ? col : shade(col, 0.05), r: shade(col, 0.14) }, { w: 0.9 });
  const doors = o.doors || ['#26314F', '#C8372D', '#3F6B4E', '#E6C24F', '#2A2622', '#7A5BA0', '#5FA58F'];
  for (let i = 0; i < n; i++) {
    const a0 = along0 + i * w, a1 = a0 + w, R = RNG(Math.round(a0 * 13 + p * 7 + i));
    // stucco ground floor on some terraces
    if (o.stucco) g.fill(K.on(face, p + 0.01, a0, a1, 0, 4.4), '#EDE8DC');
    const dc = doors[(i + (o.seed || 0)) % doors.length], da = o.mirror && i % 2 ? a1 - 1.9 : a0 + 0.6;
    g.fill(K.on(face, p + 0.02, da - 0.2, da + 1.5, 0, 3.8), '#F3F1EA'); g.fill(K.on(face, p + 0.03, da, da + 1.3, 0, 3.3), dc);
    const fan = K.on(face, p + 0.03, da, da + 1.3, 3.35, 3.65); g.fill(fan, '#E9E2C6');
    const kn = g.p.apply(g, K.pt(face, p + 0.04, da + 0.95, 1.7)); g.disc2(kn, 0.22, '#D9A93E');
    const wa = o.mirror && i % 2 ? a0 + 0.5 : a0 + 2.6;
    if (w > 4.2) LK.sash(g, face, p, wa, wa + 1.5, 1.1, 3.4);
    for (let s = 1; s < st; s++) { const z = s * 4.2 + 0.9; LK.sash(g, face, p, a0 + 0.7, a0 + 2.0, z, z + (s === 1 ? 2.6 : 2.1)); if (w > 4.2) LK.sash(g, face, p, a0 + 2.6, a0 + 3.9, z, z + (s === 1 ? 2.6 : 2.1)); }
    if (o.boxes && R() < 0.5) { const z = 4.2 + 0.6; K.blooms(g, ...(face === 'L' ? [a0 + 0.7, p, a0 + 2.0, p + 0.5] : [p, a0 + 0.7, p + 0.5, a0 + 2.0]), z, ['#E0503E', '#F3F1EA', '#D98AA4'], { sp: 0.6, r: 0.55 }); }
    if (i > 0) { const a = g.p.apply(g, K.pt(face, p + 0.02, a0, 0)), b = g.p.apply(g, K.pt(face, p + 0.02, a0, H)); g.segs2([a[0], a[1], b[0], b[1]], shade(col, 0.25), 0.3); }
  }
  // storey band and the parapet cornice
  g.fine(face === 'L' ? [[x0, y1, 4.4], [x1, y1, 4.4]] : [[x1, y0, 4.4], [x1, y1, 4.4]], { w: 0.35, c: shade(col, 0.3) });
  K.box(g, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15, H - 0.5, H, '#EDE8DC', { w: 0.5, boil: false, nohid: true });
  // slate roof: a low double pitch behind the parapet, chimneys on the party walls
  const rz = H, rh = 2.2;
  if (face === 'L') K.gable(g, x0 + 0.3, y0 + 0.3, x1 - 0.3, y1 - 0.3, rz - 0.4, rh, 'x', { a: LK.C.slate, b: LK.C.slateD, e: col }, { w: 0.6, c: '#4A515C' });
  else K.gable(g, x0 + 0.3, y0 + 0.3, x1 - 0.3, y1 - 0.3, rz - 0.4, rh, 'y', { a: LK.C.slate, b: LK.C.slateD, e: col }, { w: 0.6, c: '#4A515C' });
  for (let i = 0; i <= n; i++) { if (o.chimneys === false) break; const a = along0 + i * w + (i === 0 ? 0.9 : i === n ? -0.9 : 0); const cx = face === 'L' ? a : (x0 + x1) / 2, cy = face === 'L' ? (y0 + y1) / 2 : a; LK.chimney(g, cx, cy, rz + rh * 0.8, { along: face === 'L' ? 'y' : 'x', n: 4, col: shade(col, 0.05) }); }
  g.boilP = bp;
  return H;
};
/* a corner pub: dark painted frontage with a gilt fascia, big windows, hanging baskets, a sign board; brick above */
LK.pub = function (g, x0, y0, x1, y1, o) {
  o = o || {}; const st = o.st || 3, H = st * 4.4, col = o.col || LK.C.brick, paint = o.paint || '#2E4A3A';
  const bp = g.boilP; g.boilP = 0.3;
  K.box(g, x0, y0, x1, y1, 0, H, { t: shade(col, -0.2), l: col, r: shade(col, 0.13) }, { w: 0.9 });
  for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
    g.fill(K.on(f, p + 0.02, a0, a1, 0, 4.6), paint);
    g.fill(K.on(f, p + 0.03, a0 + 0.2, a1 - 0.2, 3.6, 4.5), shade(paint, 0.25));
    { const nm = o.name || 'THE GEORGE', h = Math.min(0.62, Math.abs(a1 - a0 - 0.8) / K.textW(nm, 1)); K.text(g, f, p + 0.05, (a0 + a1) / 2, 4.05 - h / 2, h, nm, '#E0B54A', { center: true, w: 0.42 }); }
    const nb = Math.max(1, Math.round((a1 - a0) / 4));
    for (let i = 0; i < nb; i++) { const b0 = a0 + (a1 - a0) * i / nb + 0.6, b1 = a0 + (a1 - a0) * (i + 1) / nb - 0.6; const wq = K.on(f, p + 0.04, b0, b1, 0.9, 3.3); g.fill(wq, '#E9CF92'); const Q = g.P(wq); g.segs2([lerp(Q[0][0], Q[1][0], 0.5), lerp(Q[0][1], Q[1][1], 0.5), lerp(Q[3][0], Q[2][0], 0.5), lerp(Q[3][1], Q[2][1], 0.5)], paint, 0.5); g.outline2(Q, { w: 0.35, c: '#1E1B19', boil: false }); }
    for (let s = 1; s < st; s++) { const z = s * 4.4 + 1.0; const nw = Math.max(1, Math.round((a1 - a0) / 3.4)); for (let i = 0; i < nw; i++) { const m = a0 + (a1 - a0) * (i + 0.5) / nw; LK.sash(g, f, p, m - 0.6, m + 0.6, z, z + 2.4); } }
    // hanging baskets on brackets along the fascia
    for (let i = 0; i < nb + 1; i++) { const a = a0 + (a1 - a0) * i / nb + (i === 0 ? 0.6 : i === nb ? -0.6 : 0); const q = g.p.apply(g, K.pt(f, p + 0.9, a, 5.0)); LK.basket2(g, [q[0], q[1] + 2.2], 1.0); }
  }
  K.box(g, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, H, H + 0.6, '#EDE8DC', { w: 0.55, boil: false, nohid: true });
  K.hip(g, x0 + 0.2, y0 + 0.2, x1 - 0.2, y1 - 0.2, H + 0.6, 2.2, LK.C.slate, { ridge: Math.abs((x1 - x0) - (y1 - y0)) * 0.8, c: '#4A515C', w: 0.6 });
  LK.chimney(g, x0 + 1.4, y0 + 1.4, H + 1.6, { n: 3 });
  // the hanging sign on a bracket at the corner
  const c = g.p(x1 + 1.2, y1 + 1.2, 7.4), sg = [[c[0] - 1.7, c[1] - 2.6], [c[0] + 1.7, c[1] - 2.6], [c[0] + 1.7, c[1] + 1.4], [c[0] - 1.7, c[1] + 1.4]];
  const br = g.p(x1, y1, 9.2); g.line2([br, [c[0], c[1] - 3.0]], { w: 0.5, c: '#2E2A26', boil: false, ext: 0 });
  g.fill2(sg, o.signCol || '#8E2F2F', true); g.fill2([[c[0] - 1.2, c[1] - 1.9], [c[0] + 1.2, c[1] - 0.6], [c[0] + 1.2, c[1] + 0.7], [c[0] - 1.2, c[1] + 0.7]], o.signArt || '#E0B54A', true);
  LK.label2(g, [c[0], c[1] - 2.2], (o.short || 'PUB'), 0.34, '#F6F1E2', { w: 0.28 });
  g.outline2(sg, { w: 0.4, c: '#2E2A26', boil: false });
  g.boilP = bp;
  return H;
};
/* a Gothic face: vertical buttress strips and slim lancet windows, a pinnacle at the top of each strip (Westminster) */
LK.gothicFace = function (g, face, p, a0, a1, z0, z1, o) {
  o = o || {}; const bay = o.bay || 2.2, col = o.col || LK.C.gothic, dk = shade(col, 0.22), win = o.win || '#5E6670';
  const n = Math.max(1, Math.round((a1 - a0) / bay)), step = (a1 - a0) / n, segs = [], wins = [];
  for (let i = 0; i <= n; i++) { const a = a0 + i * step, b = g.p.apply(g, K.pt(face, p + 0.05, a, z0)), t = g.p.apply(g, K.pt(face, p + 0.05, a, z1)); segs.push(b[0], b[1], t[0], t[1]); }
  g.segs2(segs, dk, 0.45);
  for (let i = 0; i < n; i++) { const m = a0 + (i + 0.5) * step; for (let z = z0 + 1.2; z + 2.4 < z1; z += o.st || 4.2) { const q = K.on(face, p + 0.04, m - step * 0.18, m + step * 0.18, z, z + 2.4); wins.push(q); } }
  for (const q of wins) g.fill(q, win);
  const caps = []; for (let i = 0; i <= n; i++) { const a = a0 + i * step, t = g.p.apply(g, K.pt(face, p + 0.05, a, z1)); caps.push(t[0] - 0.5, t[1], t[0], t[1] - 3.2, t[0], t[1] - 3.2, t[0] + 0.5, t[1]); }
  g.segs2(caps, dk, 0.5);
};

/* ---------------- flags ---------------- */
/* the Union flag on a waving cloth: P(u, v) maps u (0 hoist .. 1 fly) and v (0 top .. 1 bottom) to wide px */
LK.unionFlag2 = function (g, P) {
  const poly = (uv, col) => { const pts = []; for (let i = 0; i < uv.length; i++) { const a = uv[i], b = uv[(i + 1) % uv.length]; for (let k = 0; k < 4; k++) pts.push(P(lerp(a[0], b[0], k / 4), lerp(a[1], b[1], k / 4))); } g.fill2(pts, col, true); };
  poly([[0, 0], [1, 0], [1, 1], [0, 1]], '#1F3A7A');
  const d = 0.1, e = 0.05;
  poly([[0, 0], [d, 0], [1, 1 - d * 2], [1, 1], [1 - d, 1], [0, d * 2]], '#F6F3EA'); poly([[0, 1], [0, 1 - d * 2], [1 - d, 0], [1, 0], [1, d * 2], [d, 1]], '#F6F3EA');
  poly([[0, 0], [e, 0], [1, 1 - e * 2], [1, 1], [1 - e, 1], [0, e * 2]], '#C8372D'); poly([[0, 1], [0, 1 - e * 2], [1 - e, 0], [1, 0], [1, e * 2], [e, 1]], '#C8372D');
  poly([[0, 0.33], [1, 0.33], [1, 0.67], [0, 0.67]], '#F6F3EA'); poly([[0.42, 0], [0.58, 0], [0.58, 1], [0.42, 1]], '#F6F3EA');
  poly([[0, 0.4], [1, 0.4], [1, 0.6], [0, 0.6]], '#C8372D'); poly([[0.45, 0], [0.55, 0], [0.55, 1], [0.45, 1]], '#C8372D');
};
/* the Royal Standard: quartered gold, red, blue (three lions, a lion, a harp, shown as marks) */
LK.standard2 = function (g, P) {
  const poly = (uv, col) => { const pts = []; for (let i = 0; i < uv.length; i++) { const a = uv[i], b = uv[(i + 1) % uv.length]; for (let k = 0; k < 4; k++) pts.push(P(lerp(a[0], b[0], k / 4), lerp(a[1], b[1], k / 4))); } g.fill2(pts, col, true); };
  poly([[0, 0], [0.5, 0], [0.5, 0.5], [0, 0.5]], '#C8372D'); poly([[0.5, 0], [1, 0], [1, 0.5], [0.5, 0.5]], '#E6B83E');
  poly([[0, 0.5], [0.5, 0.5], [0.5, 1], [0, 1]], '#2F4F9A'); poly([[0.5, 0.5], [1, 0.5], [1, 1], [0.5, 1]], '#C8372D');
  for (const [u, v, c] of [[0.25, 0.25, '#E6B83E'], [0.75, 0.25, '#C8372D'], [0.25, 0.75, '#E6B83E'], [0.75, 0.75, '#E6B83E']]) { const p = P(u, v); g.disc2(p, 0.7, c); }
};
/* a flag actor on a pole top at (x, y, z): the cloth flies along +x (wind from the west) and ripples */
LK.flag = function (T, x, y, z, o) {
  o = o || {}; const L = o.L || 4.2, Hh = o.H || 2.3, kind = o.kind || 'union';
  return T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 6 + (o.ph || 0) * 6) % 8; return { x, y, z, key: f, f }; },
    draw(g, st) {
      const ph = st.f / 8;
      const P = (u, v) => { const wv = Math.sin(TAU * (u * 1.1 - ph)) * 0.55 * u; const q = g.p(u * L, wv, -v * Hh - u * 0.3); return [q[0], q[1] + Math.sin(TAU * (u * 0.9 - ph)) * 0.8 * u]; };
      if (kind === 'standard') LK.standard2(g, P); else LK.unionFlag2(g, P);
      const ed = []; for (let i = 0; i <= 8; i++) ed.push(P(i / 8, 0)); g.line2(ed, { w: 0.3, c: '#3A3128', boil: false, wob: 0.2 });
    } });
};
/* a flagpole (static) */
LK.pole = function (g, x, y, z0, h) { const a = g.p(x, y, z0), b = g.p(x, y, z0 + h); g.line2([a, b], { w: 0.6, c: '#4A4540', boil: false, ext: 0 }); g.disc2(b, 0.5, '#D9A93E'); };

/* ---------------- boats ---------------- */
/* a Thames Clipper: a catamaran river bus, navy and white, a long low cabin with a dark window band; wake behind */
LK.clipper = function (g, ang, o) {
  o = o || {}; const L = o.L || 6.4, Wd = 1.9, ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v) => [u * ca - v * sa, u * sa + v * ca];
  const wk = [P(-L * 0.95, -Wd * 0.9), P(-L * 1.9, -Wd * 1.5), P(-L * 2.2, 0), P(-L * 1.9, Wd * 1.5), P(-L * 0.95, Wd * 0.9)].map((q) => [q[0], q[1], 0]);
  if (!o.noWake) { g.fill(wk, '#E3EEEE'); const segs = []; for (let i = 0; i < 4; i++) { const a = g.p.apply(g, P(-L - i * 1.8, Wd * (1 + i * 0.15)).concat([0])), b = g.p.apply(g, P(-L - i * 1.8 - 1.4, Wd * (1.1 + i * 0.15)).concat([0])); segs.push(a[0], a[1], b[0], b[1]); } g.segs2(segs, '#FBFDFD', 0.6); }
  for (const s of [-1, 1]) { const c = P(0, s * Wd * 0.62); K.rbox(g, c[0], c[1], L, Wd * 0.34, ang, 0, 0.9, { t: '#2B3A55', l: '#2B3A55', r: '#1F2B40' }, { w: 0.5 }); }
  K.rbox(g, 0, 0, L * 0.98, Wd, ang, 0.9, 1.3, { t: '#E9E6DE', l: '#F3F1EA', r: '#DCD8CE' }, { w: 0.55 });
  const cb = K.rbox(g, -L * 0.08 * ca, -L * 0.08 * sa, L * 0.78, Wd * 0.86, ang, 1.3, 2.9, { t: '#F3F1EA', l: '#F6F4EE', r: '#DCD8CE' }, { w: 0.6, nb: true });
  for (const f of ['pv', 'nv', 'pu', 'nu']) if (cb.vis[f]) { g.fill(cb.quad(f, -0.94, 0.94, 1.75, 2.6), '#2E3A4A'); g.fill(cb.quad(f, -0.94, 0.94, 1.35, 1.6), o.stripe || '#C8372D'); }
  const wh = cb.pt(L * 0.45, 0, 2.9); K.rbox(g, wh[0], wh[1], L * 0.18, Wd * 0.6, ang, 2.9, 3.5, { t: '#F3F1EA', l: '#E9E6DE', r: '#D2CEC4' }, { w: 0.5 });
};
/* a sightseeing cruiser: a white hull, an open upper deck with people on it */
LK.cruiser = function (g, ang, o) {
  o = o || {}; const L = 6.2, Wd = 2.0, ca = Math.cos(ang), sa = Math.sin(ang);
  K.boat(g, ang, { kind: 'row', L, W: Wd, hull: '#F3F1EA', stripe: '#2B3A55', deck: '#C9C0A8' });
  const B = K.rbox(g, -L * 0.1 * ca, -L * 0.1 * sa, L * 0.7, Wd * 0.85, ang, 1.4, 3.0, { t: '#E9E6DE', l: '#F3F1EA', r: '#DCD8CE' }, { w: 0.55, nb: true });
  for (const f of ['pv', 'nv']) if (B.vis[f]) for (let i = 0; i < 6; i++) g.fill(B.quad(f, -0.9 + 1.8 * i / 6 + 0.04, -0.9 + 1.8 * (i + 1) / 6 - 0.04, 1.8, 2.6), '#3F4D63');
  // the upper deck: people seen as busts along the rail
  const seats = []; for (let i = 0; i < 5; i++) for (const v of [-0.9, 0.9]) seats.push(B.pt(-L * 0.55 + i * L * 0.27, v, 3.0));
  seats.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
  seats.forEach((p, i) => LK.bust2(g, g.p(p[0], p[1], p[2]), LK.who(9300 + i * 7 + (o.seed || 0)), 0.62));
  const rl = []; for (const f of ['pv', 'nv']) { const q = B.quad(f, -1, 1, 3.9, 3.9); rl.push(q[0], q[1]); }
  for (const [a, b] of rl.length ? [rl.slice(0, 2), rl.slice(2, 4)] : []) if (a && b) g.fine([a, b], { w: 0.35, c: '#5A544C' });
};
/* the river police launch: a white hull with a blue-and-yellow band, a dark cabin, a blue light */
LK.police = function (g, ang) {
  const L = 4.0, Wd = 1.5, ca = Math.cos(ang), sa = Math.sin(ang);
  K.boat(g, ang, { kind: 'row', L, W: Wd, hull: '#F3F1EA', stripe: '#2F4F9A', deck: '#D9D5CA' });
  const B = K.rbox(g, -L * 0.15 * ca, -L * 0.15 * sa, L * 0.45, Wd * 0.75, ang, 1.4, 3.1, { t: '#F3F1EA', l: '#2F3A4F', r: '#232C3D' }, { w: 0.5 });
  const t = g.p.apply(g, B.pt(0, 0, 3.1)); g.disc2([t[0], t[1] - 0.8], 0.6, '#5E8FE0');
};

/* ---------------- boats built in parts ----------------
   A boat is a list of primitives laid out along its length u (bow at +u) and across it v, heights z above the water.
   It is drawn in parts (u ranges), each part a separate actor anchored at its own centre, so that a long boat passing
   under a bridge sorts piece by piece. LK.boatPart draws the primitives that fall in [u0, u1] around the origin of the
   part's anchor (u = cu on the centre line). Primitives:
   { box: [ua, ub], vc, hw, z: [z0, z1], col, w }  a box (clipped to the part)
   { bow: [ua, ub], hw, z: [z0, z1], col }           a wedge narrowing to a point at ub
   { band: [ua, ub], hw, z: [z0, z1], col }           a strip painted on the visible side of a box of half width hw
   { at: u, fn(g, P, vis) }                           anything else, drawn in the part that contains u; P(u, v, z) -> local point */
LK.boatPart = function (g, prims, ang, u0, u1, cu) {
  const ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => [(u - cu) * ca - v * sa, (u - cu) * sa + v * ca, z];
  const side = (-sa + ca) > 0 ? 1 : -1;            // which side (v sign) faces the camera
  const vis = { side, bow: ca + sa > 0 };
  for (const p of prims) {
    if (p.box) {
      const a = Math.max(p.box[0], u0), b = Math.min(p.box[1], u1); if (b - a < 0.01) continue;
      const m = (a + b) / 2, c = P(m, p.vc || 0, 0);
      K.rbox(g, c[0], c[1], (b - a) / 2, p.hw, ang, p.z[0], p.z[1], p.col, { w: p.w == null ? 0.55 : p.w, nb: true });
    } else if (p.band) {
      const a = Math.max(p.band[0], u0), b = Math.min(p.band[1], u1); if (b - a < 0.01) continue;
      const v = side * (p.hw + 0.03); g.fill([P(a, v, p.z[0]), P(b, v, p.z[0]), P(b, v, p.z[1]), P(a, v, p.z[1])], p.col);
    } else if (p.bow) {
      const a = Math.max(p.bow[0], u0), b = Math.min(p.bow[1], u1); if (b - a < 0.01) continue;
      const wd = (u) => p.hw * clamp((p.bow[1] - u) / (p.bow[1] - p.bow[0]), 0, 1), col = K.tones(p.col);
      const z0 = p.z[0], z1 = p.z[1];
      for (const s of [-side, side]) {           // far side first, then the near side
        const q = [P(a, s * wd(a), z0), P(b, s * wd(b), z0), P(b, s * wd(b), z1), P(a, s * wd(a), z1)];
        if (s === side) { g.fill(q, mix(col.l, col.r, vis.bow ? 0.2 : 0.7)); g.outline(q, { w: 0.5, boil: false }); }
      }
      const top = [P(a, -wd(a), z1), P(b, -wd(b), z1), P(b, wd(b), z1), P(a, wd(a), z1)]; g.fill(top, p.top || col.t); g.outline(top, { w: 0.45, boil: false });
    } else if (p.at != null) {
      if (p.at < u0 || p.at >= u1) continue;
      p.fn(g, P, vis);
    }
  }
};
/* make a boat's part actors: state(t) -> {x, y, ang (bow heading), alpha} | null for the boat's centre;
   parts: [[u0, u1], ...]; quantised headings (nq steps) */
LK.boatActors = function (T, prims, parts, state, o) {
  o = o || {}; const nq = o.nq || 64;
  parts.forEach(([u0, u1], pi) => {
    const cu = (u0 + u1) / 2;
    T.actor({ grow: false, sample: o.sample || 0.25, period: o.period || 40, bias: o.bias || 0,
      at(t) {
        const s = state(t); if (!s) return null;
        const q = Math.round(s.ang / (TAU / nq)), a = q * TAU / nq;
        return { x: s.x + cu * Math.cos(a), y: s.y + cu * Math.sin(a), z: s.z == null ? LT.RIV.WL : s.z, key: (((q % nq) + nq) % nq) + (s.k ? '.' + s.k : ''), ang: a, alpha: s.alpha, k: s.k };
      },
      draw(g, st) { LK.boatPart(g, typeof prims === 'function' ? prims(st) : prims, st.ang, u0, u1, cu); } });
  });
};
/* the boats as primitive lists */
LK.CLIPPER = (function () {
  const navy = { t: '#2B3A55', l: '#2B3A55', r: '#1F2B40' }, white = { t: '#ECE9E1', l: '#F6F4EE', r: '#DCD8CE' };
  return [
    { at: -6.4, fn(g, P) { const s = []; for (let i = 0; i < 5; i++) { const a = g.p.apply(g, P(-6.6 - i * 1.7, 1.7 + i * 0.3, 0)), b = g.p.apply(g, P(-7.9 - i * 1.7, 1.85 + i * 0.3, 0)), c = g.p.apply(g, P(-6.6 - i * 1.7, -1.7 - i * 0.3, 0)), d = g.p.apply(g, P(-7.9 - i * 1.7, -1.85 - i * 0.3, 0)); s.push(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]); } g.segs2(s, '#F4F8F8', 0.6); const m = []; for (let i = 0; i < 4; i++) { const a = g.p.apply(g, P(-7.0 - i * 2.2, (i % 2 ? 0.5 : -0.5), 0)), b = g.p.apply(g, P(-8.2 - i * 2.2, (i % 2 ? 0.5 : -0.5), 0)); m.push(a[0], a[1], b[0], b[1]); } g.segs2(m, '#E8F0F0', 0.5); } },
    { box: [-6.4, 5.0], vc: -1.05, hw: 0.52, z: [0, 0.9], col: navy }, { bow: [5.0, 6.6], hw: 0.52, z: [0, 0.9], col: navy },
    { box: [-6.4, 5.0], vc: 1.05, hw: 0.52, z: [0, 0.9], col: navy },
    { box: [-6.2, 5.4], hw: 1.6, z: [0.9, 1.3], col: white },
    { box: [-5.4, 3.9], hw: 1.38, z: [1.3, 2.9], col: white },
    { band: [-5.4, 3.9], hw: 1.38, z: [1.36, 1.62], col: '#C8372D' }, { band: [-5.1, 3.6], hw: 1.38, z: [1.8, 2.6], col: '#2E3A4A' },
    { box: [1.4, 3.5], hw: 0.95, z: [2.9, 3.5], col: white }, { band: [2.4, 3.4], hw: 0.95, z: [3.0, 3.35], col: '#2E3A4A' },
  ];
})();
LK.CRUISER = function (seed) {
  const white = { t: '#ECE9E1', l: '#F6F4EE', r: '#DCD8CE' };
  const pax = []; for (let i = 0; i < 6; i++) for (const v of [-0.85, 0.85]) pax.push([-4.2 + i * 1.45, v, LK.who(seed * 31 + i * 2 + (v > 0 ? 1 : 0))]);
  return [
    { box: [-6.0, 4.4], hw: 1.6, z: [0, 1.5], col: white }, { bow: [4.4, 6.8], hw: 1.6, z: [0, 1.5], col: white },
    { band: [-6.0, 4.4], hw: 1.6, z: [0.25, 0.6], col: '#2B3A55' },
    { box: [-4.9, 3.4], hw: 1.4, z: [1.5, 3.1], col: { t: '#D8D2C2', l: '#F3F1EA', r: '#DCD8CE' } },
    { band: [-4.7, 3.2], hw: 1.4, z: [1.85, 2.75], col: '#3F4D63' },
  ].concat(pax.map(([u, v, w]) => ({ at: u, fn(g, P) { const p = P(u, v * 0.82, 3.1); LK.bust2(g, g.p(p[0], p[1], p[2]), w, 0.55); } })))
    .concat([{ at: -4.9, fn(g, P) { for (const s of [-1, 1]) g.fine([P(-4.9, s * 1.4, 3.9), P(-0.1, s * 1.4, 3.9)], { w: 0.35, c: '#6B6458' }); } }, { at: 0, fn(g, P) { for (const s of [-1, 1]) g.fine([P(0, s * 1.4, 3.9), P(3.4, s * 1.4, 3.9)], { w: 0.35, c: '#6B6458' }); } }]);
};
LK.POLICE = (function () {
  const white = { t: '#ECE9E1', l: '#F6F4EE', r: '#DCD8CE' };
  return [
    { at: -4.0, fn(g, P) { const wk = [P(-3.8, -1.4, 0), P(-8, -2.0, 0), P(-9.5, 0, 0), P(-8, 2.0, 0), P(-3.8, 1.4, 0)]; g.fill(wk, '#E3EEEE'); } },
    { box: [-4.0, 2.6], hw: 1.3, z: [0, 1.2], col: white }, { bow: [2.6, 4.4], hw: 1.3, z: [0, 1.2], col: white },
    { band: [-4.0, 2.6], hw: 1.3, z: [0.35, 0.75], col: '#2F4F9A' }, { band: [-3.4, 2.0], hw: 1.3, z: [0.75, 0.95], col: '#E6C24F' },
    { box: [-2.6, 1.0], hw: 1.1, z: [1.2, 2.8], col: { t: '#E9E6DE', l: '#2F3A4F', r: '#232C3D' } },
    { at: -0.8, fn(g, P) { const t = g.p.apply(g, P(-0.8, 0, 2.8)); g.disc2([t[0], t[1] - 0.7], 0.55, '#5E8FE0'); } },
  ];
})();

/* ---------------- castles and stone ---------------- */
/* a stone wall or tower block with battlements: merlons stand along all four top edges (back ones first) */
LK.battle = function (g, x0, y0, x1, y1, z, col, o) {
  o = o || {}; const mw = o.mw || 0.8, mh = o.mh || 0.8, st = o.st || 1.6, dk = shade(col, 0.12), li = shade(col, -0.06), segs = [];
  const run = (face, p, a0, a1, front) => {
    for (let a = a0 + 0.2; a + mw <= a1 + 0.01; a += st) {
      const q = K.on(face, p, a, a + mw, z, z + mh); g.fill(q, front ? (face === 'L' ? li : dk) : shade(col, 0.05));
      const P = g.P(q); segs.push(P[0][0], P[0][1], P[3][0], P[3][1], P[3][0], P[3][1], P[2][0], P[2][1], P[2][0], P[2][1], P[1][0], P[1][1]);
    }
  };
  run('L', y0, x0, x1, false); run('R', x0, y0, y1, false); run('L', y1, x0, x1, true); run('R', x1, y0, y1, true);
  g.segs2(segs, o.c || shade(col, 0.45), 0.35);
};
LK.keep = function (g, x0, y0, x1, y1, h, col, o) {
  o = o || {}; const tone = { t: shade(col, -0.12), l: col, r: shade(col, 0.13) };
  K.box(g, x0, y0, x1, y1, 0, h, tone, { w: o.w || 0.85 });
  if (o.joints !== false) { const s = []; for (let z = 1.1; z < h - 0.3; z += 1.1) { const a = g.p(x0, y1 + 0.02, z), b = g.p(x1, y1 + 0.02, z), c = g.p(x1 + 0.02, y0, z); s.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); } g.segs2(s, shade(col, 0.16), 0.25); }
  if (o.battle !== false) LK.battle(g, x0, y0, x1, y1, h, col);
};
/* a round tower with battlements */
LK.roundTower = function (g, x, y, r, h, col, o) {
  o = o || {}; K.cyl(g, x, y, r, 0, h, { t: shade(col, -0.12), l: col, r: shade(col, 0.15) }, { w: 0.75, n: 14 });
  const segs = []; for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.25 + Math.PI * 1.0 * i / 8 + 0.15, p0 = g.p(x + Math.cos(a) * r, y + Math.sin(a) * r, h), p1 = g.p(x + Math.cos(a) * r, y + Math.sin(a) * r, h + 0.8); segs.push(p0[0], p0[1], p1[0], p1[1]); }
  g.segs2(segs, shade(col, 0.2), 1.6);
  if (o.cap) { K.cone(g, x, y, r + 0.2, h, o.cap, o.capCol || LK.C.lead); }
};
/* an ogee lead cupola (an onion with a point) on a turret top at (x, y, z), radius r */
LK.cupola = function (g, x, y, z, r, o) {
  o = o || {}; const c = g.p(x, y, z), R = r * 4.13 / 2 * 1.4, H = r * 3.6 * 3.46 / 2, col = o.col || LK.C.lead;
  const pts = []; for (let i = 0; i <= 16; i++) { const t = i / 16, w = R * Math.sin(Math.PI * Math.pow(t, 0.75)) * (1 - 0.25 * t); pts.push([c[0] - w, c[1] - H * t]); }
  const right = pts.map((p) => [2 * c[0] - p[0], p[1]]).reverse();
  const shape = pts.concat(right); g.fill2(shape, col); g.fill2(right.concat([[c[0], c[1] - H], [c[0], c[1]]]), shade(col, 0.15));
  g.line2(shape, { w: 0.55, c: shade(col, 0.5), close: true, boil: false });
  const t = [c[0], c[1] - H], v = [c[0], c[1] - H - 3.2]; g.line2([t, v], { w: 0.4, c: '#3A3530', boil: false, ext: 0 }); g.disc2([v[0], v[1] + 0.8], 0.45, '#D9A93E');
  g.line2([[v[0] - 1.1, v[1] + 1.4], [v[0] + 1.3, v[1] + 1.2]], { w: 0.35, c: '#D9A93E', boil: false, ext: 0 });
};
/* a cannon on its carriage, pointing along +y (towards the river) */
LK.cannon = function (g, x, y) {
  const a = g.p(x, y - 1.2, 1.2), b = g.p(x, y + 1.8, 1.5);
  K.box(g, x - 0.8, y - 1.2, x + 0.8, y + 0.8, 0, 0.9, '#5A4232', { w: 0.45, boil: false });
  g.line2([a, b], { w: 2.2, c: '#2A2622', boil: false, ext: 0 }); g.disc2(b, 0.7, '#1E1B19');
  for (const dx of [-0.9, 0.9]) g.ring2(g.p(x + dx, y - 0.3, 0.6), 1.2, { w: 0.5, c: '#3A2A1E' });
};
/* a raven, hopping (wide px around the anchor), facing f = +-1, hop height h */
LK.raven2 = function (g, p, f, h, peck) {
  const c = [p[0], p[1] - 1.6 - (h || 0)], s = (u, v) => [c[0] + f * u, c[1] + v];
  g.fill2([s(-2.2, 0.4), s(-0.4, -1.2), s(1.4, -1.0), s(2.0, 0.2), s(0.6, 0.9), s(-1.4, 0.9)], '#1E1C22', true);
  const hd = peck ? s(2.0, 0.6) : s(1.8, -1.2); g.disc2(hd, 0.75, '#1E1C22'); g.fill2([[hd[0] + f * 0.6, hd[1] - 0.2], [hd[0] + f * 1.7, hd[1] + 0.2], [hd[0] + f * 0.6, hd[1] + 0.4]], '#2A2622', true);
  g.fill2([s(-2.2, 0.4), s(-3.4, 0.9), s(-2.0, 1.0)], '#1E1C22', true);
  if (!h) g.segs2([c[0], c[1] + 0.9, c[0] - f * 0.2, p[1], c[0] + f * 0.4, c[1] + 0.9, c[0] + f * 0.6, p[1]], '#3A3530', 0.3);
};
