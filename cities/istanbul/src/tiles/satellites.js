'use strict';
/* The satellites, off the grid on unlined paint blobs:
   upper right (beyond the Bosphorus's north end) Ortaköy: the white neo-baroque mosque on the water's edge with the
     Bosphorus Bridge striding over it, cars crossing high on the deck, a kumpir stand on the square;
   upper left (beyond the Golden Horn's inner end) Balat: a steep lane of coloured houses with laundry strung across it
     and the red-brick Phanar school on the hill above, kids playing, a cat on a step;
   lower right (out in the Sea of Marmara) Büyükada: a pine-green island with a white wooden mansion and its tower,
     cyclists on the shore road, a ferry going to and fro. */
(function () {
  const blob = (g, pts, col, seed) => K.blob2(g, g.P(pts.map((p) => [p[0], p[1], p[2] || 0])), col, { seed, rag: 0.8 });

  /* ---------------- Ortaköy and the Bosphorus Bridge ---------------- */
  SF.tile('ortakoy', 45, -212, { rim: 90, castAt: 160, order: -3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-32, -16], [-20, -32], [6, -34], [30, -22], [34, 4], [26, 28], [0, 32], [-26, 22]], '#9FCBC7', 5);
      blob(g, [[-32, -18], [-18, -30], [-2, -30], [2, -10], [0, 14], [-8, 30], [-26, 22], [-34, 2]], '#E7DFCC', 6);
      g.water(K.rect(4, -24, 28, 24, 0), { dens: 0.8, c: '#5E9396' });
      g.fill([[6, -26, 0], [26, -20, 0], [31, 2, 0], [23, 24, 0], [6, 28, 0]], 'rgba(159,203,199,0)');   // a clear mask over the open water: where lights reflect at night
    });
    // the bridge: two towers, the deck at z 12 crossing along x, the main cables and their hangers
    T.obj([-26, -20, 32, -14], function (g) {
      g.boilP = 0.2;
      const DZ = 12, tower = (x) => { for (const y of [-19.4, -14.6]) K.box(g, x - 0.7, y - 0.6, x + 0.7, y + 0.6, 0, 32, { t: '#C9CCCC', l: '#D9DCDC', r: '#B9BDBD' }, { w: 0.6 }); for (const z of [DZ + 1, 22, 31]) K.box(g, x - 0.6, -19.4, x + 0.6, -14.6, z, z + 1, { t: '#C9CCCC', l: '#D9DCDC', r: '#B9BDBD' }, { w: 0.5 }); };
      tower(-14);
      K.box(g, -30, -19, 34, -15, DZ - 1.0, DZ, { t: '#B9BDBD', l: '#C9CCCC', r: '#A9ADAD' }, { w: 0.7 });
      tower(18);
      for (const y of [-19.4, -14.6]) { const pts = []; for (let i = 0; i <= 24; i++) { const x = lerp(-30, 34, i / 24); let z; if (x < -14) z = lerp(DZ, 32, (x + 30) / 16); else if (x > 18) z = lerp(32, DZ, (x - 18) / 16); else { const u = (x + 14) / 32; z = DZ + 1.6 + (32 - DZ - 1.6) * Math.pow(2 * u - 1, 2); } pts.push([x, y, z]); } g.line(pts, { w: 0.7, c: '#6E7478', boil: false }); const hs = []; for (let i = 1; i < 24; i++) { const p = pts[i]; if (p[0] > -14 && p[0] < 18) { const a = g.p(p[0], y, p[2]), b = g.p(p[0], y, DZ); hs.push(a[0], a[1], b[0], b[1]); } } g.segs2(hs, '#8E9498', 0.25); }
    }, { name: 'bosphorus bridge', under: 11 });
    for (let i = 0; i < 3; i++) T.actor({ grow: false, sample: 0.3, period: 12, at(t) { const u = ((t / 12 + i / 3) % 1), x = -28 + u * 60, a = Math.min(1, (x + 28) / 4, (32 - x) / 4); return { x, y: i % 2 ? -16 : -18, z: 12, key: i % 2, alpha: a < 1 ? Math.max(0.05, a) : null }; }, draw(g, st) { K.car(g, st.key ? 0 : Math.PI, { col: ['#EDC23B', '#F1EFE8', '#C9584B'][i], L: 4, W: 1.8 }); } });
    // the Ortaköy mosque on the water's edge: a single dome on a tall square hall with huge arched windows, two
    // slender minarets at the front corners
    T.obj([-12, -6, 2, 8], function (g) {
      const W = { t: '#F1EEE6', l: '#F8F6F1', r: '#E3DFD5' }, i0 = g.cmds.length;
      K.box(g, -11, -5, 1, 7, 0, 9, W, { w: 0.85 });
      for (const [f, p, a0, a1] of [['L', 7, -11, 1], ['R', 1, -5, 7]]) { IS.arcade(g, f, p + 0.02, a0 + 0.6, a1 - 0.6, 1.4, 8.0, 2, { dark: '#9FB8C9' }); for (const a of [a0 + 0.4, a1 - 0.4]) g.line([K.pt(f, p + 0.03, a, 0), K.pt(f, p + 0.03, a, 9)], { w: 0.5, c: '#C9C3B6', boil: false }); }
      K.box(g, -11.4, -5.4, 1.4, 7.4, 9, 9.8, W, { w: 0.7 });
      IS.dome(g, -5, 1, 4.6, 9.8, { drum: 1.8, win: 7, h: 4.0 });
      // at night: floodlit white on the water's edge under the bridge, its tall windows lit; its light lies on the water
      IS.litCols(g, i0, { '#9FB8C9': '#FFE2A8' }, { win: 1 }); IS.warmWins(g, i0, 0.8, 9); IS.flood(g, i0, 0.92, IS.N.white);
      g.glow('lantern', -5, 1, 17, { r: 2.6, col: '#FFF1D6' }); g.glow('lantern', 1.6, 7.6, 1.0, { r: 2.4, col: '#FFE6BE' });
    }, { name: 'ortaköy mosque' });
    for (const [x, y] of [[1.6, -5.6], [-11.6, 7.6]]) T.obj([x, y], (g) => IS.minaret(g, x, y, 21, { r: 0.6, bal: [15], base: 3 }), { name: 'minaret' });
    T.obj([-24, 10], (g) => IS.stallLit(g, -24, 10, 'R', 1.4, () => K.stall(g, -24, 10, { face: 'R', L: 2.4, D: 1.4, a: '#E6C24F', b: '#C8372D' })), { name: 'kumpir' });
    T.cast([-22, 14], (g) => { IS.person(g, -21, 14, 0, IS.who(2201, { dir: 2, pose: 'hold' })); IS.person(g, -19.4, 15.2, 0, IS.who(2202, { dir: 2, scarf: '#C9584B' })); }, { name: 'people' });
    T.cast([-2, 12], (g) => { IS.person(g, -2, 12, 0, IS.who(2203, { dir: 0, pose: 'hold', phone: true })); IS.cat2(g, g.p(-3.4, 13.4, 0), { c: 0, pose: 'sit' }); }, { name: 'people' });
    IS.gulls(T, 3, () => ({ x: 12, y: 0 }), { r: 8, z: 16, period: 20 });
  });

  /* ---------------- Balat ---------------- */
  SF.tile('balat', -212, -45, { rim: 96, castAt: 160, order: -3, half: 30 }, function (T) {
    T.ground(function (g) { blob(g, [[-32, -10], [-20, -32], [10, -34], [32, -18], [34, 10], [20, 30], [-8, 32], [-30, 20]], '#E6DCC8', 8); });
    // the Phanar school on the hill: a red-brick fortress-like block with a dome
    T.obj([-26, -30, -4, -16], function (g) {
      const B = { t: '#B5624B', l: '#C46E54', r: '#A35842' };
      K.box(g, -26, -30, -4, -16, 0, 12, B, { w: 0.9 });
      for (let x = -24; x < -5; x += 3) { K.win(g, 'L', -15.98, x, x + 1.2, 3, 5.6, { style: 'dark', arch: true, col: '#4E3A34', w: 0.3, lit: 0.2 }); K.win(g, 'L', -15.98, x, x + 1.2, 7.4, 10, { style: 'dark', arch: true, col: '#4E3A34', w: 0.3, lit: 0.2 }); }   // a school: few windows lit at night
      const bat = []; for (let x = -25.5; x < -4; x += 1.4) bat.push([x, -16, 12]); for (const p of bat) K.box(g, p[0], -16.6, p[0] + 0.7, -16, 12, 12.9, B, { w: 0.35, boil: false });
      K.cyl(g, -15, -23, 4.2, 12, 16, B, { n: 14, w: 0.7, nt: true }); IS.dome(g, -15, -23, 4.4, 16, { drum: 0, h: 3.6, ribs: 10, col: '#8E8A84' });
    }, { name: 'phanar school' });
    // the lane of coloured houses climbing towards it (each house a step higher)
    const cols = ['#E9C46A', '#D9443A', '#5F8FC9', '#8FBF73', '#E77FA0', '#E8703A', '#B9A7D6'];
    for (let i = 0; i < 6; i++) { const x0 = -22 + i * 7.2, z0 = 0; T.obj([x0, -6, x0 + 6.6, 4], (g) => IS.konak(g, x0, -6, x0 + 6.6, 4, { floors: 3, fh: 3.8, col: cols[i], cumba: true }), { name: 'house' }); void z0; }
    for (let i = 0; i < 5; i++) { const x0 = -18 + i * 7.6; T.obj([x0, 14, x0 + 6.4, 22], (g) => IS.konak(g, x0, 14, x0 + 6.4, 22, { floors: 2, fh: 3.8, col: cols[(i + 3) % cols.length] }), { name: 'house' }); }
    // laundry strung across the lane
    T.obj([-10, 9], (g) => { for (const [x, h] of [[-12, 9], [6, 10.5]]) { const a = g.p(x, 4.6, h), b = g.p(x + 3, 13.6, h - 1), pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t) + 4 * t * (1 - t) * 3]); } g.fine2(pts, { w: 0.25, c: '#5A564E' }); for (let i = 1; i < 8; i += 1) { const p = pts[i]; g.fill2([[p[0] - 1.0, p[1]], [p[0] + 1.0, p[1]], [p[0] + 0.9, p[1] + 2.4], [p[0] - 0.9, p[1] + 2.4]], ['#F3F1EA', '#5F8FC9', '#E77FA0', '#E9C46A', '#F3F1EA', '#C9584B', '#8FBF73'][i % 7], true); } } }, { name: 'laundry' });
    T.cast([-4, 9], (g) => { IS.person(g, -4, 9, 0, IS.who(2211, { dir: 0, k: 0.75, pose: 'cheer', ph: 0.2 })); IS.person(g, -1.6, 10.4, 0, IS.who(2212, { dir: 2, k: 0.74, pose: 'wave', ph: 0.6 })); const p = g.p(-2.8, 9.4, 0); g.disc2([p[0], p[1] - 0.8], 0.9, '#F3F1EA'); }, { name: 'kids' });
    T.cast([12, 6], (g) => { IS.person(g, 12, 6.2, 0, IS.who(2213, { dir: 1, pose: 'hold', phone: true })); IS.person(g, 13.6, 7, 0, IS.who(2214, { dir: 1, scarf: '#8E79C0' })); }, { name: 'photographers' });
    IS.cat(T, 4, 4.8, 0, { c: 0, pose: 'loaf' });
    IS.walker(T, IS.who(2215, { tray: true, top: '#F3F1EA', scarf: undefined }), [[-24, 9], [24, 9]], 1.0, { phase: 0.4 });
  });

  /* ---------------- Büyükada ---------------- */
  SF.tile('adalar', 212, 18, { rim: 100, castAt: 165, order: 3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-34, -10], [-22, -32], [8, -34], [34, -20], [34, 12], [20, 32], [-8, 34], [-32, 18]], '#9FCBC7', 11);
      blob(g, [[-20, -14], [-6, -24], [14, -20], [22, -4], [16, 14], [0, 18], [-16, 12], [-22, 0]], '#C9DCA6', 12);
      g.water(K.rect(-30, 16, 30, 30, 0), { dens: 0.7, c: '#5E9396' });
      const road = []; for (let i = 0; i <= 16; i++) { const a = -0.2 + Math.PI * 1.1 * i / 16; road.push([2 + Math.cos(a) * 16, -2 + Math.sin(a) * 13, 0.02]); } g.line(road, { w: 2.2, c: '#E9DFC6', boil: false });
      g.fill([[-24, 20, 0], [0, 21, 0], [18, 16, 0], [24, 18, 0], [16, 29, 0], [-6, 31, 0]], 'rgba(159,203,199,0)');   // a clear mask over the open water: where lights reflect at night
    });
    // the wooden mansion with its tower, gingerbread eaves
    T.obj([-6, -12, 8, 0], function (g) {
      const W = { t: '#EDE8DE', l: '#F7F4EE', r: '#E2DDD2' };
      K.box(g, -6, -12, 8, 0, 0, 8, W, { w: 0.8 });
      for (let x = -5; x < 7.5; x += 2.6) { K.win(g, 'L', 0.02, x, x + 1.4, 1.2, 3.4, { style: 'glass', w: 0.4 }); K.win(g, 'L', 0.02, x, x + 1.4, 4.6, 6.8, { style: 'glass', w: 0.4 }); }
      g.line([[-6, 0.05, 4.1], [8, 0.05, 4.1]], { w: 0.4, c: '#7FA58E', boil: false });
      K.hip(g, -6.8, -12.8, 8.8, 0.8, 8, 2.6, '#C9744F', { ridge: 6, c: '#7A3E26', w: 0.75 });
      K.box(g, 4.5, -4, 8.5, 0, 8, 12.5, W, { w: 0.65 }); K.win(g, 'L', 0.02, 5.6, 7.4, 9.2, 11.4, { style: 'glass', arch: true, w: 0.4 }); K.hip(g, 4.0, -4.5, 9.0, 0.5, 12.5, 2.4, '#C9744F', { c: '#7A3E26', w: 0.6 });
    }, { name: 'mansion' });
    for (const [x, y] of [[-14, -14], [-10, 6], [14, -14], [16, 4], [-18, -2], [2, -20]]) T.obj([x, y], (g) => { K.tree(g, x, y, { r: 3.4, h: 6, col: '#5E8A4A', ink: '#3F5F33' }); }, { name: 'pine' });
    T.obj([-24, 18, -16, 24], (g) => { K.box(g, -24, 18, -16, 24, IS.WL, 0.2, { t: '#B79A74', l: '#9C8262', r: '#86704F' }, { w: 0.55 }); g.glow('lamp', -16.6, 23.4, 1.6, { r: 1.0, base: 0.2 }); }, { name: 'pier' });   // at night a lamp at the pier's end
    // cyclists on the shore road, a ferry to and fro
    for (let i = 0; i < 3; i++) T.actor({ sample: 0.3, period: 30, at(t) { const u = ((t / 30 + i / 3) % 1), a = -0.2 + Math.PI * 1.1 * u, q = Math.round((a + Math.PI / 2) / (TAU / 24)); return { x: 2 + Math.cos(a) * 16, y: -2 + Math.sin(a) * 13, key: ((q % 24) + 24) % 24, ang: q * TAU / 24 }; }, draw(g, st) { K.bike(g, st.ang, { col: ['#C9584B', '#3F5F8F', '#E6C24F'][i], seed: 2230 + i, who: IS.who(2230 + i) }); } });
    T.actor({ grow: false, sample: 0.3, period: 40, at(t) { const u = ((t / 40) % 1), f = u < 0.5 ? u * 2 : 2 - u * 2, x = lerp(-20, 26, f), d = u < 0.5 ? 1 : -1, n = LOOK.night; return { x, y: 26, z: IS.WL, key: d + (n ? 'n' : ''), d, n }; }, draw(g, st) { const i0 = g.cmds.length; K.boat(g, st.d > 0 ? 0 : Math.PI, { kind: 'ferry', L: 7, W: 2.2, hull: '#F3F1EA', stripe: '#2E2A26', stackCol: { t: '#2E2A26', l: '#E8B830', r: '#C9982A' } }); IS.litCols(g, i0, { [C.navy]: IS.N.saloon }); if (st.n) IS.ferryNight2(g, st.d > 0 ? 0 : Math.PI, 7, 2.2); } });   // its saloon lit at night
    T.cast([-20, 21], (g) => { IS.person(g, -20, 21, 0.2, IS.who(2241, { dir: 1, pose: 'wave', ph: 0.3 })); IS.person(g, -18.6, 21.6, 0.2, IS.who(2242, { dir: 1 })); }, { name: 'people' });

    /* ---- the city's animated night lights. Made here, after every other actor (this is the last place built): an
       actor's number seeds its pen, so one made earlier would redraw every later one. Each belongs to the place it
       lights. Night only: by day at() returns nothing. ---- */
    IS.nightActors();
  });
})();
/* the animated night lights, made last (see the end of Büyükada above):
   - the Galata Tower's gallery: sphere lights on the balcony's posts, a brighter light running round them (its lighting
     design: "a sparkle and circulatory effect"); and the light in its cone's window, which now and then spells in Morse
     its love for the Maiden's Tower (SENİ SEVİYORUM);
   - the Bosphorus Bridge's LEDs along its cables and its deck, changing colour slowly (as they do on an ordinary night). */
IS.nightActors = function () {
  const G = SF.tileBy.galata, O = SF.tileBy.ortakoy;
  if (G && !G.skip) {
    const TW = { x: -16, y: 3, r: 5.4 }, ZG = 34.55, N = 13, P = 6.5, Q = 16;
    G.actor({ layer: 'top', grow: false, sample: P / Q, period: P,
      at(t) { if (!LOOK.night) return null; const f = Math.floor((((t / P) % 1) + 1) % 1 * Q); return { x: TW.x, y: TW.y, z: ZG, key: 'g' + f, f }; },
      draw(g, st) {
        for (let k = 0; k < N; k++) {
          const a = A_L + (A_R - A_L) * (k + 0.5) / N, p = g.p(Math.cos(a) * (TW.r + 0.85), Math.sin(a) * (TW.r + 0.85), 0);
          const w = 0.5 + 0.5 * Math.cos(TAU * (k / N - st.f / Q) * 0.999), b = Math.pow(w, 3);
          g.disc2([p[0], p[1] - 0.35], 0.32 + 0.3 * b, b > 0.5 ? '#FFFBEA' : '#FFD58A'); g.mark({ nc: true, light: b > 0.25 });
        }
      } });
    // Morse: dot 1 unit, dash 3, a gap of 1 inside a letter, 3 between letters, 7 between words; then it rests
    const MORSE = { S: '...', E: '.', N: '-.', I: '..', V: '...-', Y: '-.--', O: '---', R: '.-.', U: '..-', M: '--' }, U = 0.24, on = [];
    let u = 0; for (const word of ['SENI', 'SEVIYORUM']) { for (const ch of word) { for (const sym of MORSE[ch]) { const d = sym === '.' ? 1 : 3; on.push([u, u + d]); u += d + 1; } u += 2; } u += 4; }
    const LEN = u * U, PER = LEN + 14, ca = Math.cos(0.37), sa = Math.sin(0.37), zr = 41.2, rr = (TW.r + 0.35) * (1 - (zr - 37.8) / 9.7);
    G.actor({ layer: 'top', grow: false, sample: U, period: PER,
      at(t) { if (!LOOK.night) return null; const v = ((t % PER) + PER) % PER / U; if (!on.some(([a, b]) => v >= a && v < b)) return null; return { x: TW.x + ca * rr, y: TW.y + sa * rr, z: zr, key: 'm' }; },
      draw(g) { const c = g.p(0, 0, 0); g.fill2([[c[0] - 1.0, c[1] + 1.3], [c[0] + 1.0, c[1] + 1.3], [c[0] + 1.0, c[1] - 0.6], [c[0], c[1] - 1.6], [c[0] - 1.0, c[1] - 0.6]], '#FFF4D6', true); g.mark({ nc: true, light: true }); } });
  }
  if (O && !O.skip) {
    const DZ = 12, cz = (x) => { if (x < -14) return lerp(DZ, 32, (x + 30) / 16); if (x > 18) return lerp(32, DZ, (x - 18) / 16); const v = (x + 14) / 32; return DZ + 1.6 + (32 - DZ - 1.6) * Math.pow(2 * v - 1, 2); };
    const COLS = ['#6FA8FF', '#A98CFF', '#F07AD2', '#5FE0D4', '#7FB8FF', '#C9A0FF'], NK = 36, PER = 54, BX = 2, BY = -17;
    O.actor({ layer: 'top', grow: false, sample: PER / NK, period: PER,
      at(t) { if (!LOOK.night) return null; const f = Math.floor((((t / PER) % 1) + 1) % 1 * NK); return { x: BX, y: BY, z: 0, key: 'b' + f, f }; },
      draw(g, st) {
        const ph = st.f / NK * COLS.length, i = Math.floor(ph), col = mix(COLS[i % COLS.length], COLS[(i + 1) % COLS.length], ph - i), P = (x, y, z) => g.p(x - BX, y - BY, z);
        // the deck's edge, its light broken on the water under it (over the open water only)
        for (let x = -28; x <= 32; x += 3) { const p = P(x, -15, DZ - 0.5); g.disc2(p, 0.42, col); g.mark({ nc: true, light: (x / 3) % 2 === 0 }); if (x >= 8 && x <= 26) { const w = P(x + 1.5, -13.5, 0), rgb = parseCol(col).slice(0, 3).join(','); for (let k = 0; k < 3; k++) { g.fill2([[w[0] - 1.6 + k * 0.4, w[1] + 1 + k * 1.8], [w[0] + 1.6 - k * 0.4, w[1] + 1 + k * 1.8], [w[0] + 1.6 - k * 0.4, w[1] + 1.6 + k * 1.8], [w[0] - 1.6 + k * 0.4, w[1] + 1.6 + k * 1.8]], 'rgba(' + rgb + ',' + (0.6 - k * 0.15).toFixed(2) + ')'); g.mark({ nc: true }); } } }
        // the main cables and their hangers lit, a light at every few metres along them
        for (const y of [-19.4, -14.6]) {
          const pts = [], hs = []; for (let x = -30; x <= 34.01; x += 2) { pts.push(P(x, y, cz(x))); if (x > -14 && x < 18) { const a = P(x, y, cz(x)), b = P(x, y, DZ); hs.push(a[0], a[1], b[0], b[1]); } }
          g.segs2(hs, col, 0.18); g.line2(pts, { w: y > -15 ? 0.55 : 0.4, c: col, boil: false, ext: 0 });
          for (let x = -29; x <= 33; x += 2.5) { const p = P(x, y, cz(x)); g.disc2(p, 0.5, col); g.mark({ nc: true, light: y > -15 || Math.round(x / 2.5) % 2 === 0 }); }
        }
        g.line2([P(-30, -15, DZ - 0.5), P(34, -15, DZ - 0.5)], { w: 0.5, c: col, boil: false, ext: 0 });
        for (const d of g.cmds) if (d.k === K_RIB || d.k === K_STROKE || d.k === K_SEGS) d.nc = d.col;
        // the towers' tops
        for (const x of [-14, 18]) for (const y of [-19.4, -14.6]) { const p = P(x, y, 32.4); g.disc2(p, 0.5, '#FFF1E0'); g.mark({ nc: true, light: true }); }
      } });
  }
};
