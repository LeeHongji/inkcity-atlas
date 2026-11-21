'use strict';
/* The market lanes x = +50 (drawn inside the streets tile).
   Graham Street, on the Island (y -166..-63 uphill of the trams, and -37..24 down to the harbour): Hong Kong's oldest
   street market. Steel kiosks along both kerbs, goods heaped on sloping counters (oranges, greens, chillies, eggs,
   dried mushrooms, fish on ice), canvas sheets on poles, bare bulbs; stall-holders in aprons, shoppers with the
   red-white-blue bag, a 街市 board, a man pushing a trolley of boxes.
   Temple Street, in Kowloon (y 76..166): the night market starting at dusk. The 廟街 gate, stalls under red-and-white
   striped canopies with strings of bulbs, a dai pai dong cooking over a roaring wok with diners at folding tables on
   the street, a fortune teller under his lamp with a client, a Cantonese opera singer and an erhu player with a few
   listeners, strollers. Its close-up (shot `temple`, z 9) frames y 90..150. */
const MARKETS = function (T) {
  const PAVE = '#E3DCCB', I = HT.HAR.I, Kw = HT.HAR.K, E = HT.END;
  T.ground(function (g) {
    for (const [y0, y1] of [[-E, -63], [-37, I], [Kw, E]]) { g.fill(K.rect(37, y0, 63, y1), PAVE); HK.paving(g, 37, y0, 63, y1, { step: 2.6, joint: '#D3CAB6' }); }
    const kerb = { w: 0.55, c: '#9E9A90', boil: false };
    for (const x of [37, 63]) { g.line([[x, -E, 0], [x, -63, 0]], kerb); g.line([[x, -37, 0], [x, I, 0]], kerb); g.line([[x, Kw, 0], [x, E, 0]], kerb); }
    // a drain channel down the middle, wet patches by the fish stalls
    for (const [y0, y1] of [[-E, -63], [-37, I], [Kw, E]]) g.line([[50, y0, 0], [50, y1, 0]], { w: 0.4, c: '#BDB4A0', boil: false });
    for (const [x, y] of [[44, -120], [56, -96], [43, -18], [57, 120], [44, 100]]) { const c = K.curve([[x - 2, y, 0.01], [x, y - 1.4, 0.01], [x + 2.4, y, 0.01], [x, y + 1.6, 0.01]], 3, true); g.fill(c, '#D2D7D2'); }
  });

  /* ---------------- Graham Street ---------------- */
  const FRUIT = [['#E8813A', '#F2A33A', '#E6C24F'], ['#8FBF4E', '#5E9A3E', '#B9D46A'], ['#C9463E', '#E8813A', '#8E2F2F'], ['#F3EBD8', '#E9DCC0', '#D9C9A6'], ['#7A5A3C', '#A07850', '#5E4630'], ['#B9D7DE', '#8FB3C2', '#E7EEF0'], ['#D98AA4', '#E06A8A', '#F3D0D8']];
  const SHEETS = ['#3F7F5A', '#2F5B8A', '#C8372D', '#E6B83E', '#3F7F5A', '#5A6B7A'];
  const gstalls = [];
  for (const [y0, y1] of [[-160, -68], [-32, 18]]) for (let y = y0; y <= y1; y += 8.6) { gstalls.push([40.6, y, 'R']); gstalls.push([59.4, y + 4.3, 'R']); }
  gstalls.forEach(([x, y, f], i) => T.obj([x - 1.5, y - 2.6, x + 1.5, y + 2.6], (g) => {
    HK.stall(g, x, y, { face: f, L: 2.6, D: 1.5, goods: FRUIT[(i * 3) % FRUIT.length], sheet: SHEETS[i % SHEETS.length], zt: 6.6 });
    if (i % 7 === 2) HK.board(g, 'R', x + 1.55, y - 1.6, y + 1.6, 6.8, 8.8, '#C8372D', '街市', { w: 0.3 });
  }, { name: 'stall' }));
  // stall-holders in aprons in front of the counters (lane side), customers, a few walkers up and down
  gstalls.forEach(([x, y], i) => { if (i % 2) return; HK.stand(T, x + 2.8, y + (i % 4 ? 1.4 : -1.2), HK.who(4100 + i, { dir: 2, pose: i % 3 ? 'hold' : 'stand', apron: i % 3 ? '#3F5F8F' : '#C8372D' }), { name: 'stall-holder' }); });
  [[47, -142, 1], [46, -110, 0], [48.5, -80, 3], [46, -12, 2], [47, 10, 0]].forEach(([x, y, d], i) => HK.stand(T, x, y, HK.who(4200 + i, { dir: d, pose: 'hold', rwb: i % 2 === 0 }), { name: 'shopper' }));
  HK.walker(T, HK.elder(4251, { rwb: true }), [[51, -160], [51, -68]], 0.8, { phase: 0.2 });
  HK.walker(T, HK.who(4252, { bag: '#C8372D' }), [[53.5, -70], [53.5, -158]], 1.1, { phase: 0.6 });
  HK.walker(T, HK.helper(4253, { rwb: true }), [[49, -150], [49, -70]], 1.0, { phase: 0.45 });
  HK.walker(T, HK.who(4254, { phone: true }), [[52, -34], [52, 18]], 1.1, { phase: 0.1 });
  HK.walker(T, HK.elder(4255, { cage: true }), [[48, 16], [48, -30]], 0.7, { phase: 0.5 });
  // a man pushing a trolley stacked with boxes up the lane
  T.actor({ sample: 0.25, period: 92 / 1.3,
    at(t) { const L = 92, d = ((t * 1.3) % (2 * L) + 2 * L) % (2 * L), up = d < L, y = up ? -68 - d : -160 + (d - L), ph = Math.floor((d / 2.4) % 1 * 8); return { x: 55.6, y, key: (up ? 'u' : 'd') + ph, up, ph: ph / 8 }; },
    draw(g, st) { const dir = st.up ? 3 : 1, dy = st.up ? -2.4 : 2.4; const tb = (yy) => { K.box(g, -0.9, yy - 1.0, 0.9, yy + 1.0, 0.5, 1.0, { t: '#8E8A84', l: '#7A766E', r: '#66625C' }, { w: 0.35, boil: false }); for (let k = 0; k < 3; k++) K.box(g, -0.8, yy - 0.9, 0.8, yy + 0.9, 1.0 + k * 1.2, 2.1 + k * 1.2, { t: '#D9B98A', l: '#C9A26B', r: '#B58F58' }, { w: 0.35, boil: false }); };
      if (st.up) { tb(dy); HK.person(g, 0, 0, 0, HK.who(4260, { dir, pose: 'walk', ph: st.ph, reach: [4, -8] })); } else { HK.person(g, 0, 0, 0, HK.who(4260, { dir, pose: 'walk', ph: st.ph, reach: [-4, -8] })); tb(dy); } } });

  /* ---------------- Temple Street ---------------- */
  // the gate at the harbour end: two red pillars, a green-tiled roof, the 廟街 board
  T.obj([37.6, 86, 62.4, 87.6], (g) => {
    for (const x of [38.4, 61.6]) K.box(g, x - 0.7, 86, x + 0.7, 87.4, 0, 9.4, { t: '#B8322A', l: '#C8372D', r: '#A42C24' }, { w: 0.6 });
    K.box(g, 37.6, 86.1, 62.4, 87.3, 9.4, 10.4, { t: '#A42C24', l: '#B8322A', r: '#8E2620' }, { w: 0.6 });
    K.gable(g, 36.6, 85.6, 63.4, 87.8, 10.4, 1.6, 'x', { a: '#4E8A62', b: '#3E7A5A', e: '#B8322A' }, { w: 0.55 });
    HK.board(g, 'L', 87.3, 45.6, 54.4, 9.5, 10.35, '#2C2622', '廟街', { neon: '#F7D046', rim: '#D9A93E' });
    HK.board(g, 'L', 87.32, 46.4, 53.6, 7.8, 9.3, '#F3E7C6', null); K.text(g, 'L', 87.4, 50, 8.2, 0.8, 'TEMPLE STREET', '#8E2620', { center: true });
  }, { name: 'temple street gate' });
  // stalls under striped canopies on both kerbs, strings of bulbs between
  const TRINK = [['#C8372D', '#E6C24F', '#46A6C9', '#F3F1EA'], ['#3F5F8F', '#7FB7D9', '#2F343B', '#B9A27D'], ['#5FA58F', '#8FBF73', '#E7E2D6', '#D98AA4'], ['#E6C24F', '#D9733A', '#7A5A3C', '#F3D0A0']];
  const tstall = (x, y, i) => T.obj([x - 1.6, y - 2.8, x + 1.6, y + 2.8], (g) => {
    g.boilP = 0.3;
    K.box(g, x - 1.5, y - 2.6, x + 1.5, y + 2.6, 0, 2.0, { t: '#E9E2CF', l: '#8E6E4E', r: '#7A5C40' }, { w: 0.5, boil: false });
    const R = RNG(i * 31 + 7), gd = TRINK[i % TRINK.length]; for (let k = 0; k < 16; k++) { const q = g.p(x - 1.2 + (k % 4) * 0.8, y - 2.2 + Math.floor(k / 4) * 1.4, 2.05); g.fill2([[q[0] - 0.8, q[1] - 0.4], [q[0] + 0.8, q[1] - 0.4], [q[0] + 0.8, q[1] + 0.3], [q[0] - 0.8, q[1] + 0.3]], gd[(k + (R() * 4 | 0)) % gd.length], true); }
    // goods hung on the back frame: bags, T-shirts
    const ps = []; for (const yy of [y - 2.6, y + 2.6]) { const a = g.p(x - 1.5, yy, 0), b = g.p(x - 1.5, yy, 6.4); ps.push(a[0], a[1], b[0], b[1]); } g.segs2(ps, '#5A564E', 0.3);
    for (let k = 0; k < 4; k++) { const q = g.p(x - 1.45, y - 2.0 + k * 1.3, 5.6); g.fill2([[q[0] - 0.9, q[1]], [q[0] + 0.9, q[1]], [q[0] + 0.8, q[1] + 2.4], [q[0] - 0.8, q[1] + 2.4]], gd[(k + 1) % gd.length], true); }
    // the striped canopy, sloping to the lane
    const z1 = 6.8, z2 = 5.8, x0 = x - 1.9, x1 = x + 2.6, ys = y - 3.0, ye = y + 3.0, n = 6;
    for (let k = 0; k < n; k++) { const a = lerp(ys, ye, k / n), b = lerp(ys, ye, (k + 1) / n); g.fill([[x0, a, z1], [x0, b, z1], [x1, b, z2], [x1, a, z2]], k % 2 ? '#F6F1E6' : '#C8372D'); }
    g.outline([[x0, ys, z1], [x0, ye, z1], [x1, ye, z2], [x1, ys, z2]], { w: 0.45, c: '#7A1E18', boil: false });
    const bl = g.p(x + 1.4, y, z2 - 0.5); g.disc2(bl, 1.8, 'rgba(255,214,140,0.32)'); g.disc2(bl, 0.45, '#FFF0C8');
  }, { name: 'stall' });
  const tpos = [];
  for (let y = 92; y <= 160; y += 7.4) { if (y > 112 && y < 128) continue; tpos.push([40.2, y]); }
  for (let y = 95; y <= 160; y += 7.4) { if (y > 132 && y < 146) continue; tpos.push([59.8, y]); }
  tpos.forEach(([x, y], i) => tstall(x, y, i));
  // strings of bulbs zig-zagging across the lane (short pieces: each string is its own small object)
  for (let y = 94; y < 160; y += 14) T.obj([50, y + 3], (g) => { const a = g.p(41.6, y, 7.6), b = g.p(58.4, y + 6, 7.6); const pts = []; for (let k = 0; k <= 12; k++) { const u = k / 12; pts.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) + Math.sin(Math.PI * u) * 3]); } g.line2(pts, { w: 0.25, c: '#3A3530', boil: false, ext: 0 }); for (let k = 1; k < 12; k += 1) { g.disc2(pts[k], 0.9, 'rgba(255,214,140,0.35)'); g.disc2(pts[k], 0.32, k % 3 ? '#FFF0C8' : '#FF6A3D'); } }, { name: 'bulbs' });
  // stall-holders and browsers
  tpos.forEach(([x, y], i) => { if (i % 3 === 1) return; const right = x > 50; HK.stand(T, x + (right ? -3.4 : 3.4), y + 1.2, HK.who(4300 + i, { dir: right ? 0 : 2, pose: i % 2 ? 'hold' : 'stand', phone: i % 4 === 0 }), { name: 'browser' }); });

  // the dai pai dong: a cook at a roaring wok (flames are an actor), folding tables with diners on stools
  T.obj([38.4, 113.2, 43.2, 120.8], (g) => {
    K.box(g, 38.6, 113.4, 42.4, 120.6, 0, 2.6, { t: '#C9CDD0', l: '#B9C0C4', r: '#9AA3A8' }, { w: 0.55 });
    K.cyl(g, 41.0, 115.4, 1.0, 2.6, 3.2, { t: '#3A3530', l: '#4A4540', r: '#2E2A26' }, { n: 10, w: 0.4 });
    K.cyl(g, 40.6, 118.6, 0.9, 2.6, 3.9, { t: '#E9E6DE', l: '#D9D4C8', r: '#BFB9AC' }, { n: 10, w: 0.4 });
    for (let k = 0; k < 4; k++) { const q = g.p(39.4 + (k % 2) * 1.6, 114 + k * 1.6, 2.65); g.fill2(arcPts(q[0], q[1], 0.7, 0, TAU, 8).map((p) => [p[0], q[1] + (p[1] - q[1]) * 0.5]), ['#E9E2CF', '#C8372D', '#8FBF4E', '#E6C24F'][k], true); }
    // the canvas awning and the bulb
    const aw = [[37.8, 112.8, 7.2], [37.8, 121.2, 7.2], [44.0, 121.2, 6.4], [44.0, 112.8, 6.4]]; g.fill(aw, '#E6B83E'); g.outline(aw, { w: 0.45, c: '#8A6A1E', boil: false });
    const ps = []; for (const [x, y] of [[44, 112.8], [44, 121.2]]) { const a = g.p(x, y, 0), b = g.p(x, y, 6.4); ps.push(a[0], a[1], b[0], b[1]); } g.segs2(ps, '#5A564E', 0.32);
    HK.board(g, 'R', 44.02, 113.4, 120.6, 6.45, 7.15, '#C8372D', null);
    K.text(g, 'R', 44.05, -117, 6.55, 0.5, 'DAI PAI DONG', '#FBF6E4', { center: true });
    const bl = g.p(42, 117, 5.6); g.disc2(bl, 2.2, 'rgba(255,214,140,0.32)'); g.disc2(bl, 0.5, '#FFF0C8');
  }, { name: 'dai pai dong' });
  T.cast([43.2, 116], (g) => HK.person(g, 43.2, 116, 0, HK.who(4401, { dir: 2, pose: 'hold', reach: [-5, -8], apron: '#F3F1EA', top: '#F3F1EA', jacket: undefined, cap: undefined })), { on: true, name: 'cook' });
  T.actor({ sample: 0.2, period: 1.2, layer: '', grow: false,
    at(t) { const f = Math.floor(t * 10) % 6; return { x: 41.2, y: 115.6, z: 3.2, key: 'f' + f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), f = st.f, h = [3.2, 4.4, 2.6, 3.8, 4.8, 3.0][f]; g.fill2([[o[0] - 1.2, o[1]], [o[0] - 0.4, o[1] - h * 0.6], [o[0] + 0.1, o[1] - h], [o[0] + 0.6, o[1] - h * 0.5], [o[0] + 1.3, o[1]]], 'rgba(255,140,60,0.85)', true); g.fill2([[o[0] - 0.6, o[1]], [o[0], o[1] - h * 0.55], [o[0] + 0.6, o[1]]], '#FFE08A', true); for (let k = 0; k < 3; k++) g.disc2([o[0] - 0.6 + k * 0.8 + (f % 2) * 0.3, o[1] - h - 1.6 - k * 1.4], 1.0 + k * 0.4, 'rgba(240,236,228,' + (0.5 - k * 0.12) + ')'); } });
  const table = (x, y, seats) => T.cast([x, y], (g) => {
    const order = seats.slice().sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
    const drawSeat = (s) => { const [dx, dy, dir, seed] = s; const sx = x + dx, sy = y + dy; K.box(g, sx - 0.45, sy - 0.45, sx + 0.45, sy + 0.45, 0, 1.3, { t: '#C8372D', l: '#B8322A', r: '#A42C24' }, { w: 0.3, boil: false }); HK.person(g, sx, sy, 0, HK.who(seed, { dir, pose: 'sit', reach: dir < 2 ? [3, -9] : [-3, -9] })); };
    for (const s of order) if (s[0] + s[1] < 0) drawSeat(s);
    K.cyl(g, x, y, 0.2, 0, 2.3, { t: '#8E8A84', l: '#7A766E', r: '#66625C' }, { n: 6, w: 0.3 });
    K.cyl(g, x, y, 1.9, 2.3, 2.45, { t: '#F3EFE3', l: '#E9E2CF', r: '#D9D0BA' }, { n: 16, w: 0.4 });
    for (const [bx, by, c] of [[-0.6, -0.4, '#E9E2CF'], [0.6, 0.2, '#C8372D'], [-0.2, 0.8, '#E9E2CF'], [0.4, -0.9, '#3A3530']]) { const q = g.p(x + bx, y + by, 2.5); g.fill2(arcPts(q[0], q[1], 0.9, 0, TAU, 10).map((p) => [p[0], q[1] + (p[1] - q[1]) * 0.5]), c, true); g.disc2([q[0], q[1] - 0.3], 0.5, '#E8813A'); }
    { const q = g.p(x + 0.5, y - 0.4, 2.5); g.fill2([[q[0] - 0.3, q[1]], [q[0] + 0.3, q[1]], [q[0] + 0.3, q[1] - 2.4], [q[0] - 0.3, q[1] - 2.4]], '#5E8F4A', true); }
    for (const s of order) if (s[0] + s[1] >= 0) drawSeat(s);
  }, { name: 'diners' });
  table(47.6, 117.4, [[-1.8, -1.6, 0, 4411], [2.0, -0.6, 2, 4412], [1.4, 1.9, 3, 4413], [-1.9, 1.4, 1, 4414]]);
  table(47.4, 125.0, [[-1.9, -1.2, 0, 4415], [2.0, 0.2, 2, 4416], [-0.2, 2.2, 3, 4417]]);
  // steam from the bowls
  for (const [x, y] of [[47.6, 117.4], [47.4, 125.0]]) T.actor({ sample: 0.3, period: 2.4, grow: false, layer: 'top',
    at(t) { const f = Math.floor(t * 5) % 6; return { x, y, z: 3.0, key: 's' + f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0); for (let k = 0; k < 3; k++) { const u = (st.f + k * 2) / 6; g.disc2([o[0] + Math.sin(u * 6 + k) * 1.2, o[1] - 2 - u * 7], 0.9 + u * 1.2, 'rgba(246,244,238,' + (0.55 - u * 0.4).toFixed(2) + ')'); } } });

  // the fortune teller: a little table under a lamp, a client on a stool
  T.cast([57.6, 138.6], (g) => {
    K.box(g, 56.4, 137.2, 58.8, 140.0, 0, 2.2, { t: '#C8372D', l: '#B8322A', r: '#A42C24' }, { w: 0.45 });
    K.sign(g, 'L', 140.0, 56.6, 58.6, 0.6, 1.8, '#F3E7C6', 'FORTUNE', { w: 0.3, ink: '#8E2620' });
    const lp = g.p(57.6, 138.6, 2.2); g.line2([lp, [lp[0], lp[1] - 7]], { w: 0.35, c: '#3A3530', boil: false, ext: 0 }); g.disc2([lp[0], lp[1] - 7.4], 2.6, 'rgba(255,214,140,0.35)'); g.fill2([[lp[0] - 1.2, lp[1] - 7.4], [lp[0] + 1.2, lp[1] - 7.4], [lp[0] + 0.7, lp[1] - 8.4], [lp[0] - 0.7, lp[1] - 8.4]], '#C8372D', true);
    K.box(g, 59.4, 137.9, 60.3, 138.8, 0, 1.3, { t: '#5A564E', l: '#4A4540', r: '#3A3530' }, { w: 0.3, boil: false });
    HK.person(g, 59.85, 138.3, 0, HK.elder(4421, { dir: 2, pose: 'sit', reach: [-4, -9], glasses: true, top: '#3B3F47' }));
  }, { name: 'fortune teller' });
  T.cast([55.0, 139.0], (g) => { K.box(g, 54.5, 138.6, 55.4, 139.5, 0, 1.3, { t: '#5A564E', l: '#4A4540', r: '#3A3530' }, { w: 0.3, boil: false }); HK.person(g, 55.0, 139.0, 0, HK.who(4422, { dir: 0, pose: 'sit', reach: [4, -9], scarf: '#E06A8A' })); }, { name: 'client' });
  // the Cantonese opera singer and the erhu player; listeners on stools and standing
  T.cast([43.6, 104.4], (g) => { K.box(g, 42.4, 104.0, 43.3, 104.9, 0, 1.3, { t: '#5A564E', l: '#4A4540', r: '#3A3530' }, { w: 0.3, boil: false }); const r = HK.person(g, 42.85, 104.45, 0, HK.elder(4431, { dir: 0, pose: 'sit', hands: [[5, -8], [2, -10]] })); const h = r.hands; g.line2([[h[0][0] - 1, h[0][1] + 3], [h[0][0] + 1.4, h[0][1] - 8]], { w: 0.45, c: '#5E3A26', boil: false, ext: 0 }); g.fine2([[h[1][0] - 3, h[1][1]], [h[1][0] + 4, h[1][1] - 1]], { w: 0.28, c: '#8E6E4E' }); }, { name: 'erhu player' });
  T.actor({ sample: 0.3, period: 4,
    at(t) { const f = Math.floor(t * 2) % 4; return { x: 45.2, y: 102.6, key: 'o' + f, f }; },
    draw(g, st) { const r = HK.person(g, 0, 0, 0, HK.who(4432, { dir: 0, pose: st.f % 2 ? 'wave' : 'hold', ph: st.f * 0.25, dress: '#C8372D', top: '#C8372D', hairStyle: 'bun', jacket: undefined, scarf: undefined })); const c = r.crown; g.fill2([[c[0] - 1.6, c[1] + 0.6], [c[0] + 1.6, c[1] + 0.6], [c[0] + 1.0, c[1] - 1.6], [c[0] - 1.0, c[1] - 1.6]], '#E6C24F', true); g.disc2([c[0], c[1] - 1.9], 0.6, '#C8372D');
      if (st.f !== 3) { const hd = r.head; g.segs2([hd[0] + 3, hd[1] - 1, hd[0] + 4.6, hd[1] - 2.4, hd[0] + 3.4, hd[1] + 0.6, hd[0] + 5.2, hd[1] + 0.4], '#3A3530', 0.3); } } });
  for (const [x, y, d, s] of [[49.6, 101.8, 2, 4433], [50.8, 104.6, 2, 4434], [48.6, 106.6, 3, 4435]]) T.cast([x, y], (g) => { K.box(g, x - 0.45, y - 0.45, x + 0.45, y + 0.45, 0, 1.3, { t: '#5A564E', l: '#4A4540', r: '#3A3530' }, { w: 0.3, boil: false }); HK.person(g, x, y, 0, HK.elder(s, { dir: d, pose: 'sit' })); }, { name: 'listener' });
  // strollers up and down the lane
  HK.walker(T, HK.who(4441, { phone: true }), [[49.4, 90], [49.4, 162]], 1.0, { phase: 0.15 });
  HK.walker(T, HK.who(4442), [[52.2, 160], [52.2, 92]], 0.9, { phase: 0.4 });
  HK.walker(T, HK.who(4443, { bag: '#E6C24F' }), [[51.2, 96], [51.2, 156]], 1.1, { phase: 0.7 });
  HK.walker(T, HK.who(4444), [[53.4, 150], [53.4, 98]], 0.85, { phase: 0.9 });
  HK.walker(T, HK.who(4445, { scarf: '#C8372D' }), [[46.4, 128], [46.4, 158]], 0.8, { phase: 0.3 });
};
