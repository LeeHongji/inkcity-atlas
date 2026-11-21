'use strict';
/* (0,100) Sultanahmet. What it is: the two great domes facing each other across Sultanahmet Park. On the left the Blue
   Mosque (Sultan Ahmed): a cascade of grey lead domes — the central dome on four half-domes, little domes at the
   corners, four weight turrets — on a pale stone hall, its arcaded courtyard behind, and its six minarets (four at the
   hall's corners with three balconies, two at the courtyard's far corners). On the right Hagia Sophia: a broad, flatter
   dome ringed by windows on a heavy rectangular body of pinkish-ochre plaster, a half-dome east and west, massive
   stepped buttresses down its sides, and four minarets of different builds (two slender white, two thicker brick-red).
   Between them the park: a round fountain whose jets rise and fall, beds of red, yellow and violet tulips, benches under
   plane trees, the octagonal domed German Fountain, and by the Blue Mosque the Egyptian obelisk on its marble base.
   Who is there: a tour group following a guide's flag, families on the benches, simit and roasted-corn carts, a tea
   seller, a man feeding pigeons, couples photographing the domes, kids by the fountain, cats on every bench.
   What moves: the fountain's jets, the tour group, walkers, pigeons, cats, the flag. */
SF.tile('sultanahmet', 0, 100, { rim: 36 }, function (T) {
  const H = 37, FX = 6, FY = 12;
  T.ground(function (g) {
    IS.ground(g, -H, -H, 28, H, '#E7DFCC', { water: 'e', cut: 'y' });
    IS.paving(g, -H, -H, 28, H, { len: 2.4 });
    // the park: lawns quartered by paths, the fountain plaza
    for (const [x0, y0, x1, y1] of [[-9, -6, 3, 8], [9, -6, 22, 8], [-9, 16, 3, 33], [9, 16, 22, 33]]) K.lawn(g, x0, y0, x1, y1, { col: '#B5D08C', dens: 0.7 });
    const ring = []; for (let i = 0; i < 28; i++) { const a = TAU * i / 28; ring.push([FX + Math.cos(a) * 6.8, FY + Math.sin(a) * 6.8, 0.01]); } g.fill(ring, '#DCD2BE'); g.outline(ring, { w: 0.45, c: '#B5A68A', boil: false });
    // the fountain's basin: water inside a marble rim
    const rim = [], wat = []; for (let i = 0; i < 28; i++) { const a = TAU * i / 28; rim.push([FX + Math.cos(a) * 4.4, FY + Math.sin(a) * 4.4, 0.02]); wat.push([FX + Math.cos(a) * 3.7, FY + Math.sin(a) * 3.7, 0.03]); }
    g.fill(rim, '#F0EBE0'); g.fill(wat, '#9CCFD0'); g.water(wat, { dens: 1.2, c: '#6FA9AE' }); g.outline(rim, { w: 0.7, boil: false }); g.outline(wat, { w: 0.45, c: '#6FA9AE', boil: false });
  }, { rim: true });

  /* ---- the Blue Mosque: courtyard behind, hall in front, six minarets ---- */
  IS.avlu(T, -34, -16, -12, 4.6, { d: 3, H: 5.2, near: '' });
  T.obj([-34, 4.6, -12, 26], (g) => IS.mosque(g, { cx: -23, cy: 15.3, s: 10.6, H: 8.6, R: 5.2, semis: ['x-', 'x+', 'y-', 'y+'], corner: true, towers: true, domeH: 0.96, col: { t: '#E3DFD6', l: '#EFECE5', r: '#D6D1C6' } }), { name: 'blue mosque' });
  for (const [x, y, h, nb] of [[-34.6, 4.0, 33, 3], [-11.4, 4.0, 33, 3], [-34.6, 26.6, 33, 3], [-11.4, 26.6, 33, 3], [-34.6, -16.6, 28, 2], [-11.4, -16.6, 28, 2]]) T.obj([x, y], (g) => IS.minaret(g, x, y, h, { r: 0.8, bal: nb === 3 ? [h * 0.5, h * 0.63, h * 0.75] : [h * 0.56, h * 0.71] }), { name: 'minaret' });

  /* ---- Hagia Sophia ---- */
  const HS = { t: '#D9A985', l: '#E5B993', r: '#C99A72' };
  T.obj([2, -35, 25, -11.5], (g) => {
    IS.mosque(g, { cx: 13.5, cy: -23.2, s: 11, H: 10.4, R: 6.8, semis: ['x-', 'x+'], towers: false, domeH: 0.68, drumZ: 4.6, col: HS, rows: [[2.0, 4.6], [5.8, 8.6]] });
  }, { name: 'hagia sophia' });
  // the stepped buttresses along the visible sides
  for (const y of [-31, -23.5, -15.6]) T.obj([24.5, y - 1.4, 27, y + 1.4], (g) => { K.box(g, 24.5, y - 1.3, 26.8, y + 1.3, 0, 8.4, HS, { w: 0.65 }); K.box(g, 24.5, y - 1.0, 25.8, y + 1.0, 8.4, 11.6, HS, { w: 0.55 }); }, { name: 'buttress' });
  for (const x of [4.6, 13.5, 22.2]) T.obj([x - 1.4, -12.4, x + 1.4, -10.2], (g) => { K.box(g, x - 1.3, -12.3, x + 1.3, -10.3, 0, 8.0, HS, { w: 0.65 }); K.box(g, x - 1.0, -12.3, x + 1.0, -11.2, 8.0, 11.4, HS, { w: 0.55 }); }, { name: 'buttress' });
  for (const [x, y, h, col, r] of [[1.2, -36, 28, '#C47E5E', 1.15], [26.2, -36, 26, '#EFECE5', 0.75], [1.2, -10.4, 27, '#EFECE5', 0.75], [26.2, -10.4, 25, '#C47E5E', 1.15]]) T.obj([x, y], (g) => IS.minaret(g, x, y, h, { r, col, bal: [h * 0.66] }), { name: 'minaret' });

  /* ---- the park ---- */
  for (const [x0, y0, x1, y1, k] of [[-8, 9.4, 2, 10.6, 0], [10, 9.4, 21, 10.6, 1], [-8, 13.4, 2, 14.6, 2], [10, 13.4, 21, 14.6, 3], [0.6, -5, 1.8, 7, 4], [10.2, -5, 11.4, 7, 5], [0.6, 17, 1.8, 32, 0], [10.2, 17, 11.4, 32, 1]]) {
    T.cast([(x0 + x1) / 2, (y0 + y1) / 2], (g) => { g.fill(K.rect(x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, 0.02), '#7A5A3C'); IS.tulips(g, x0, y0, x1, y1, [IS.C.tulip[k % 6], IS.C.tulip[(k + 1) % 6], IS.C.tulip[(k + 2) % 6]], { band: 2, sp: 0.9 }); }, { name: 'tulips' });
  }
  for (const [x, y] of [[-8, -8], [24, 10], [-8, 34], [24, 34], [-4, 22], [18, 22]]) T.obj([x, y], (g) => IS.plane(g, x, y, { r: 4.2, h: 5.6 }), { name: 'plane' });
  for (const [x, y] of [[5, 24], [16, 3]]) T.obj([x, y], (g) => IS.erguvan(g, x, y, { r: 3.6 }), { name: 'erguvan' });
  for (const [x, y, f] of [[-6.4, 3, 'L'], [16, 1, 'L'], [-6.4, 26, 'L'], [17, 27.4, 'L']]) T.obj([x, y], (g) => K.bench(g, x, y, { face: f, L: 2.4, col: '#7A5A3C' }), { name: 'bench' });
  for (const [x, y] of [[-1, 18], [13, 6], [24, -6]]) T.obj([x, y], (g) => IS.lamp(g, x, y), { name: 'lamp' });
  // the fountain's jets: a ring of arcs and a tall centre jet rising and falling
  T.actor({ sample: 5, period: 8, at(t) { const f = Math.floor(((t * 1.5) % 6 + 6) % 6); return { x: FX, y: FY, key: f, f }; },
    draw(g, st) { const h = [3.2, 4.2, 5.0, 5.4, 5.0, 4.2][st.f], c = g.p(0, 0, 0), top = g.p(0, 0, h), J = '#E3F1F1';
      for (let i = 0; i < 10; i++) { const a = TAU * i / 10, s0 = g.p(Math.cos(a) * 1.2, Math.sin(a) * 1.2, 0.4), e = g.p(Math.cos(a) * 3.2, Math.sin(a) * 3.2, 0.1), m = g.p(Math.cos(a) * 2.2, Math.sin(a) * 2.2, 1.6 + h * 0.15); g.line2([s0, m, e], { w: 0.55, c: J, boil: false, wob: 0.2 }); }
      g.line2([c, top], { w: 1.4, c: J, boil: false, ext: 0 }); for (const dx of [-1.6, 1.6]) g.line2([top, [top[0] + dx * 1.4, top[1] + 3], [top[0] + dx * 2.2, c[1] - 1]], { w: 0.5, c: J, boil: false, wob: 0.2 }); g.disc2([top[0], top[1] - 0.5], 0.9, '#F6FBFB'); } });
  // the German Fountain: an octagon of green porphyry columns under a bronze dome
  T.obj([20, -6, 26, 0], (g) => { const x = 23, y = -3; K.cyl(g, x, y, 2.8, 0, 0.8, { t: '#E9E3D3', l: '#DCD4C2', r: '#C9C0AC' }, { n: 8, w: 0.6 }); const cs = []; for (let i = 0; i < 8; i++) { const a = TAU * i / 8 + 0.2; if (Math.cos(a) + Math.sin(a) < -0.4) continue; const p0 = g.p(x + Math.cos(a) * 2.5, y + Math.sin(a) * 2.5, 0.8), p1 = g.p(x + Math.cos(a) * 2.5, y + Math.sin(a) * 2.5, 4.8); cs.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(cs, '#4F7F5E', 0.8); K.cyl(g, x, y, 2.9, 4.8, 5.6, { t: '#E9E3D3', l: '#DCD4C2', r: '#C9C0AC' }, { n: 8, w: 0.55 }); IS.dome(g, x, y, 2.6, 5.6, { drum: 0, h: 2.4, ribs: 8, col: '#7FA58E', w: 0.6 }); }, { name: 'german fountain' });
  // the Egyptian obelisk on its marble base
  T.obj([-30, 29, -26, 33], (g) => { K.box(g, -30, 29, -26, 33, 0, 1.0, { t: '#E9E3D3', l: '#DCD4C2', r: '#C9C0AC' }, { w: 0.6 }); K.box(g, -29.3, 29.7, -26.7, 32.3, 1.0, 4.2, { t: '#E3DCCB', l: '#EFE9DC', r: '#D9D0BC' }, { w: 0.6 }); const p = (x, y, z) => [x, y, z]; const b = 1.0; const pts = [p(-28 - b, 31 + b, 4.2), p(-28 + b, 31 + b, 4.2), p(-28 + 0.6, 31 + 0.6, 21), p(-28 - 0.6, 31 + 0.6, 21)]; g.fill(pts, '#C9A08A'); g.fill([p(-28 + b, 31 + b, 4.2), p(-28 + b, 31 - b, 4.2), p(-28 + 0.6, 31 - 0.6, 21), p(-28 + 0.6, 31 + 0.6, 21)], '#B48A74'); g.fill([p(-28 - 0.6, 31 + 0.6, 21), p(-28 + 0.6, 31 + 0.6, 21), p(-28 + 0.6, 31 - 0.6, 21), p(-28, 31, 22.6)], '#D9B49E'); g.outline(pts, { w: 0.7, boil: false }); const gl = []; for (let z = 6; z < 20; z += 1.4) { const a = g.p(-28 - 0.3, 31 + 0.82, z), c = g.p(-28 + 0.2, 31 + 0.82, z + 0.5); gl.push(a[0], a[1], c[0], c[1]); } g.segs2(gl, '#7E5A48', 0.3); }, { name: 'obelisk' });
  T.obj([18, 31], (g) => IS.simitCart(g, 18, 31, { face: 'L' }), { name: 'simit cart' });
  T.obj([-2, -9], (g) => { IS.simitCart(g, -2, -9, { face: 'R' }); }, { name: 'corn cart' });

  /* ---- the living layer ---- */
  // the tour group following the guide's flag round the park
  const route = [[-10, -3], [-10, 34], [24, 34], [24, 12], [14, 12], [14, -3]];
  { const guide = IS.who(2001, { top: '#E6C24F', bot: '#3B3F47', scarf: undefined, dress: undefined }), sp = 0.9;
    IS.walker(T, guide, route, sp, { phase: 0.0 });
    for (let i = 0; i < 8; i++) IS.walker(T, IS.who(2010 + i, i % 3 === 0 ? { cap: '#F3F1EA', phone: false } : {}), route.map((p, k) => [p[0] + ((i % 2) ? 0.9 : -0.6), p[1] + ((i % 3) - 1) * 0.6]), sp, { phase: -0.012 * (i + 1) - 0.004 });
    // the guide's flag on its stick, riding with the guide
    let L = 0; const seg = []; for (let k = 0; k < route.length; k++) { const a = route[k], b = route[(k + 1) % route.length]; seg.push([a, b, L]); L += Math.hypot(b[0] - a[0], b[1] - a[1]); }
    T.actor({ sample: 0.25, period: L / sp, layer: 'top', at(t) { let d = ((t * sp) % L + L) % L, i = 0; while (i < seg.length - 1 && d > seg[i + 1][2]) i++; const [a, b, l0] = seg[i], f = (d - l0) / Math.hypot(b[0] - a[0], b[1] - a[1]); const fl = Math.floor(t * 4) % 3; return { x: lerp(a[0], b[0], f), y: lerp(a[1], b[1], f), z: 0, key: fl, fl }; },
      draw(g, st) { const a = g.p(0.4, 0, 5.4), b = g.p(0.4, 0, 9.4); g.line2([a, b], { w: 0.4, c: '#5A4A3C', boil: false, ext: 0 }); const w = [0, 0.4, 0.8][st.fl]; g.fill2([b, [b[0] + 3.4, b[1] + w], [b[0] + 3.2, b[1] + 2.4 + w], [b[0], b[1] + 2.2]], '#E8573A', true); } }); }
  // people on the benches, by the fountain, photographing
  T.cast([-5.2, 3], (g) => { IS.person(g, -5, 2.2, 1.3, IS.who(2031, { dir: 0, pose: 'sit', cup: true })); IS.person(g, -5, 3.8, 1.3, IS.who(2032, { dir: 0, pose: 'sit', scarf: '#E8D9B8', dress: '#5A6B7A' })); IS.cat2(g, g.p(-5, 5.0, 1.3), { c: 1, pose: 'loaf' }); }, { on: true });
  T.cast([17.2, 1], (g) => { IS.person(g, 17.4, 0.2, 1.3, IS.who(2033, { dir: 0, pose: 'sit' })); IS.cat2(g, g.p(17.4, 2.0, 1.3), { c: 0, pose: 'sit' }); }, { on: true });
  T.cast([6, 18], (g) => { IS.person(g, 5.4, 18.4, 0, IS.who(2034, { dir: 3, pose: 'hold', phone: true })); IS.person(g, 7.0, 18.6, 0, IS.who(2035, { dir: 3, pose: 'wave', ph: 0.2 })); }, { name: 'photographers' });
  T.cast([1.4, 8.8], (g) => { IS.person(g, 1.4, 8.8, 0, IS.who(2036, { dir: 0, k: 0.75, pose: 'cheer', ph: 0.3 })); IS.person(g, 2.4, 6.6, 0, IS.who(2037, { dir: 0, k: 0.72 })); }, { name: 'kids' });
  T.cast([-20, 28.6], (g) => { IS.person(g, -20, 28.6, 0, IS.who(2038, { dir: 3, pose: 'hold', phone: true })); }, { name: 'tourist' });
  IS.walker(T, IS.who(2041, { teatray: true, top: '#F3F1EA', bot: '#6E5A44', scarf: undefined, dress: undefined }), [[-10, 36], [26, 36], [26, -9], [-10, -9]], 1.1, { phase: 0.4 });
  IS.walker(T, IS.who(2042, { tray: true, top: '#F3F1EA', scarf: undefined, dress: undefined }), [[26, 15], [-10, 15]], 1.0, { phase: 0.2 });
  IS.walker(T, IS.who(2043), [[-36, 30], [-10, 30]], 1.2, { phase: 0.7 });
  for (let i = 0; i < 14; i++) { const R = RNG(i * 29 + 1), x0 = -2 + R() * 18, y0 = 15.5 + R() * 2.5; T.actor({ sample: 0.5, period: 17,
    at(t) { const u = ((t + 7) % 17 + 17) % 17, up = u > 13 && u < 15.6, f = up ? Math.floor(t * 8 + i) % 4 : (Math.floor(t * 2 + i * 1.7) % 3 === 0 ? 'u' : 'p'), h = up ? Math.sin(Math.PI * (u - 13) / 2.6) * 6 : 0; return { x: x0 + (up ? (u - 13) * 1.5 : 0), y: y0, z: h, key: up ? 'f' + f : f, f, up, fl: i % 2 ? 1 : -1 }; },
    draw(g, st) { const p = g.p(0, 0, 0); if (st.up) IS.gull2(g, p, st.f); else IS.pigeon2(g, p, st.fl, st.f === 'u'); } }); }
  IS.catWalk(T, [[-10, 9], [-10, 0], [3.4, 0]], { c: 2, speed: 0.9, sit: 7 });
  IS.cat(T, 19.4, 34.2, 0, { c: 5, pose: 'stretch' });
});
