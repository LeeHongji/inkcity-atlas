'use strict';
/* (-100,0) Meiji Jingū and the edge of Yoyogi Park. A gravel approach runs in from the right under the great wooden
   torii, past a wall of sake barrels given to the shrine, through a forest, to the gate of the inner courtyard. In the
   courtyard: the shrine hall under its green copper roof, the husband-and-wife camphor trees tied with a straw rope, a
   rack of wooden wishes, and a Shintō wedding walking slowly out across the gravel: priests in white with black caps,
   a shrine maiden in red, the bride in white under a big red parasol, the groom in black, the families behind.
   In front, on Yoyogi's lawn, rockabilly dancers in leather twist round their radio; picnics, a jogger. */
SF.tile('meiji', -100, 0, { rim: 6 }, function (T) {
  const H = 37, GRAV = '#ECE5D2', COPPER = '#6FA38E';
  T.ground(function (g) {
    K.slab(g, H, { top: '#B5CF8E' });
    g.grass(K.rect(-H, -10, H, H), { dens: 0.8 });
    g.fill(K.rect(-H, -H, -2, -6), GRAV); g.scuff(K.rect(-H, -H, -2, -6), { dir: -0.4, len: 2.2, c: '#DAD0B8', dens: 0.8, w: 0.5, spread: 1.2 });
    g.fill(K.rect(-2, -19.5, H, -12.5), GRAV); g.scuff(K.rect(-2, -19.5, H, -12.5), { dir: Math.atan2(AY, AX), len: 3, c: '#DAD0B8', dens: 0.8, w: 0.5, spread: 0.1 });
    g.fill(K.rect(-2, -H, H, -19.5), '#8FAF6A'); g.grass(K.rect(-2, -H, H, -19.5), { dens: 0.5, c: '#5E7A45' });
    // Yoyogi's footpath loop
    const loop = []; for (let i = 0; i <= 40; i++) { const a = TAU * i / 40; loop.push([6 + Math.cos(a) * 24, 14 + Math.sin(a) * 15, 0]); }
    const loop2 = []; for (let i = 0; i <= 40; i++) { const a = TAU * i / 40; loop2.push([6 + Math.cos(a) * 21.6, 14 + Math.sin(a) * 12.8, 0]); }
    g.fill(loop, '#E9DDBA'); g.fill(loop2, '#B5CF8E'); g.grass(loop2, { dens: 0.6 });
    g.line(loop, { w: 0.5, c: '#C9B98C', close: true, boil: false }); g.line(loop2, { w: 0.5, c: '#C9B98C', close: true, boil: false });
  }, { rim: true });

  /* ---------------- the courtyard ---------------- */
  // the cloister along the two far edges: a low corridor with a green roof
  T.obj([-37, -37, -34, -6], (g) => { K.box(g, -36.6, -36.6, -34.2, -6.5, 0, 3.8, { t: '#E9E2CF', l: '#F1EDE3', r: '#DCD4C0' }, { w: 0.7 }); TK.roof(g, -36.6, -36.6, -34.2, -6.5, 3.8, 1.8, { over: 0.8, lift: 0.3, col: COPPER, ridge: 'y', tiles: false }); }, { name: 'cloister' });
  T.obj([-34, -37, -2, -34], (g) => { K.box(g, -34.2, -36.6, -2.5, -34.2, 0, 3.8, { t: '#E9E2CF', l: '#F1EDE3', r: '#DCD4C0' }, { w: 0.7 }); TK.roof(g, -34.2, -36.6, -2.5, -34.2, 3.8, 1.8, { over: 0.8, lift: 0.3, col: COPPER, ridge: 'x', tiles: false }); }, { name: 'cloister' });
  // the hall: plain cypress and white plaster under a big green copper roof
  T.obj([-35, -35, -11, -19.5], function (g) {
    g.boilP = 0.35;
    K.box(g, -35, -35, -11, -20, 0, 1.6, { t: '#E4DFD4', l: '#DAD6CA', r: '#C7C2B6' }, { w: 0.8 });
    for (let i = 0; i < 4; i++) K.box(g, -27 + 0, -20, -19, -20 + 0.8 * (i + 1), 0, 1.6 - 0.4 * i, { t: '#E4DFD4', l: '#DAD6CA', r: '#C7C2B6' }, { w: 0.5, boil: false });
    K.box(g, -33, -33, -13, -21.5, 1.6, 9.5, { t: '#E9E2CF', l: '#C9A880', r: '#B08E66' }, { w: 0.9 });
    for (let a = -32.5; a < -13; a += 2.6) g.fill(K.on('L', -21.46, a, a + 0.55, 1.6, 9.5), '#8A6A4A');
    for (let a = -32.5; a < -21.5; a += 2.6) g.fill(K.on('R', -12.96, a, a + 0.55, 1.6, 9.5), '#7A5A3E');
    g.fill(K.on('L', -21.45, -27, -19, 1.6, 7.6), '#F3EFE3');
    for (let a = -26.6; a < -19; a += 1.1) g.line([K.pt('L', -21.43, a, 1.8), K.pt('L', -21.43, a, 7.5)], { w: 0.3, c: '#8A7A5A', boil: false });
    TK.roof(g, -33, -33, -13, -21.5, 9.5, 9.5, { gable: 0.42, over: 3.8, lift: 1.6, col: COPPER, end: '#C9A880', ridge: 'x', tc: '#4F8070' });
    const sh = g.p(-23, -21.3, 8.6); g.fill2([[sh[0] - 7, sh[1]], [sh[0] + 7, sh[1]], [sh[0] + 6, sh[1] + 1.4], [sh[0] - 6, sh[1] + 1.4]], '#E9D9A0', true);   // the straw rope over the door
  }, { name: 'shrine hall' });
  // the husband-and-wife camphors, a straw rope between them
  T.obj([-12, -30], (g) => K.tree(g, -12, -30, { r: 6.2, h: 6, col: '#5E8A4A' }), { on: true });
  T.obj([-6.5, -25], (g) => K.tree(g, -6.5, -25, { r: 5.6, h: 6, col: '#6E9A50' }), { on: true });
  T.obj([-9.5, -27.5, -6, -24], (g) => { const a = g.p(-11.4, -29.4, 3.6), b = g.p(-7.0, -25.4, 3.4); const pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t) + 2.2 * 4 * t * (1 - t)]); } g.line2(pts, { w: 1.1, c: '#D9C68A', boil: false }); for (let k = 1; k < 5; k++) { const p = pts[k * 2]; g.fill2([[p[0] - 0.5, p[1]], [p[0] + 0.5, p[1]], [p[0] + 0.3, p[1] + 2.6], [p[0] - 0.3, p[1] + 2.6]], '#F6F3EA', true); } }, { name: 'rope', bias: 2 });
  // the rack of wishes (ema)
  T.obj([-15, -11.5, -7, -9.5], function (g) {
    K.box(g, -15, -11.2, -7, -10.6, 0, 3.6, { t: '#C9A26B', l: '#B58F58', r: '#A07C4C' }, { w: 0.6 });
    TK.roof(g, -15, -11.2, -7, -10.6, 3.6, 0.9, { over: 0.5, lift: 0.1, col: '#6E5A44', tiles: false, ridge: 'x' });
    const R = RNG(9); for (let r = 0; r < 3; r++) for (let k = 0; k < 11; k++) { const p = g.p(-14.6 + k * 0.72 + (R() - 0.5) * 0.15, -10.5, 1.0 + r * 0.9); g.fill2([[p[0] - 0.9, p[1]], [p[0] + 0.9, p[1]], [p[0] + 0.9, p[1] - 1.5], [p[0], p[1] - 2.0], [p[0] - 0.9, p[1] - 1.5]], R() < 0.15 ? '#F3E3C0' : '#E9D3A6', true); }
  }, { name: 'ema' });
  // the courtyard gate on the approach
  T.obj([-3, -21, 1, -11], function (g) {
    for (const y of [-20.2, -11.8]) K.box(g, -2.6, y - 0.5, 0.6, y + 0.5, 0, 6, { t: '#C9A880', l: '#B08E66', r: '#9A7A56' }, { w: 0.7 });
    TK.roof(g, -2.6, -20.6, 0.6, -11.4, 6, 3.2, { gable: 0.45, over: 1.6, lift: 0.9, col: COPPER, end: '#C9A880', ridge: 'y', tc: '#4F8070' });
  }, { name: 'gate', under: 5.6 });

  /* ---------------- the approach: forest, barrels, the great torii ---------------- */
  const TREES = [[3, -34, 5.2], [10, -31, 5.8], [17, -35, 5.0], [24, -31, 5.6], [31, -34, 5.4], [35, -27, 4.8], [6, -25, 4.6], [21, -25.5, 4.4], [29, -24, 4.4], [-1, -29, 4.8], [14, -27, 4.2]];
  TREES.forEach(([x, y, r], i) => T.obj([x, y], (g) => K.tree(g, x, y, { r, h: 6, col: i % 3 ? '#5E8A4A' : '#6E9A50', ink: '#3C5A30' }), { on: true }));
  T.obj([5, -22.5, 17, -20], function (g) {                             // the sake barrels, three rows high
    K.box(g, 5, -22.5, 17, -20.4, 0, 6.2, { t: '#C9A26B', l: '#B58F58', r: '#A07C4C' }, { w: 0.7 });
    const R = RNG(4);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) {
      const c = g.p(6 + k * 2 + (r % 2) * 0.4, -20.3, 1.05 + r * 2.0), col = R.pick(['#F6F3EA', '#F6F3EA', '#C9463E', '#2E2A26', '#E6C24F']);
      g.fill2(arcPts(c[0], c[1], 3.3, 0, TAU, 12).map((p) => [p[0], c[1] + (p[1] - c[1]) * 1.05]), col, true);
      g.line2(arcPts(c[0], c[1], 3.3, 0, TAU, 12), { w: 0.4, c: '#5A4636', close: true, boil: false });
      TK.glyph2(g, [c[0], c[1]], 3.2, col === '#2E2A26' || col === '#C9463E' ? '#F6F3EA' : '#2E2A26', 200 + r * 7 + k);
    }
  }, { name: 'sake barrels' });
  T.obj([25.5, -20.6, 27.5, -11.4], (g) => TK.torii(g, 26.5, -16, { w: 7.2, h: 12, axis: 'y', col: '#8A7A66', top: '#6E604E', r: 0.62 }), { name: 'great torii' });

  /* ---------------- Yoyogi ---------------- */
  for (const [x, y, r] of [[-33, 30, 4.6], [-34, 12, 4.4], [-22, 33, 4.0], [32, 33, 4.2], [35, 4, 4.0]]) T.obj([x, y], (g) => K.tree(g, x, y, { r, h: 5.2 }), { on: true });
  T.obj([-30, 21], (g) => TK.sakura(g, -30, 21, { r: 4.6 }), { on: true });
  T.cast([17, 18], (g) => { TK.tarp(g, [[13.5, 16, 0.04], [20.5, 16, 0.04], [20.5, 20.5, 0.04], [13.5, 20.5, 0.04]], { col: '#E7A9A0' }); TK.person(g, 15, 15.6, 0, TK.who(3001, { dir: 1, pose: 'sit' })); TK.person(g, 18.5, 15.6, 0, TK.who(3002, { dir: 1, pose: 'sit', dress: '#F3E3A0' })); TK.person(g, 20.9, 18.4, 0, TK.who(3003, { dir: 2, pose: 'sit' })); }, { on: true });
  T.cast([-3.5, 24], (g) => { TK.person(g, -3.5, 24, 0, TK.who(3004, { dir: 1, pose: 'kneel', hands: [[2.4, -2.2], [3.2, -1.8]] })); const p = g.p(-1.8, 23.6, 0); g.fill2(K.curve([[p[0] - 1.6, p[1]], [p[0] - 1.2, p[1] - 1.4], [p[0] + 1.2, p[1] - 1.6], [p[0] + 1.8, p[1] - 0.4], [p[0] + 0.8, p[1] + 0.3]], 2, true), '#F3E3C0', true); g.disc2([p[0] + 1.6, p[1] - 1.9], 0.9, '#F3E3C0'); }, { on: true });

  /* ---------------- the living layer ---------------- */
  // the wedding: walks out from the hall towards us, slowly, then comes round again
  const WED = [
    TK.who(3101, { top: '#F6F3EA', dress: '#BFD3DD', eboshi: true, hairStyle: 'short' }), TK.who(3102, { top: '#F6F3EA', dress: '#F6F3EA', eboshi: true, hairStyle: 'short' }),
    TK.who(3103, { top: '#F6F3EA', dress: '#C9463E', hairStyle: 'long', hair: '#1F1A18' }),
    TK.who(3104, { top: '#F6F3EA', dress: '#F6F3EA', sleeve: '#F6F3EA', hood: true, hair: '#1F1A18', parasol: true }), TK.who(3105, { top: '#2E2A26', dress: '#6C7A89', sleeve: '#2E2A26', hairStyle: 'short', hair: '#1F1A18' }),
    TK.who(3106, { top: '#2E2A26', dress: '#2E2A26', sleeve: '#2E2A26', hairStyle: 'bun' }), TK.salary(3107, { top: '#2E2A26', bot: '#2E2A26' }), TK.who(3108, { top: '#2E2A26', dress: '#2E2A26', sleeve: '#2E2A26', hairStyle: 'bun', hair: '#8E8A84' }), TK.salary(3109, { top: '#2E2A26', bot: '#2E2A26', hair: '#8E8A84' }),
  ];
  const WX = [-23.6, -23.6, -23.6, -22.6, -25.2, -22.8, -25.0, -22.8, -25.0], msh = SCENE.shots.find((q) => q.name === 'meiji'), WOFF = msh ? (((10 - (msh.a / 30 + 1.6) * 0.9) % 30) + 30) % 30 : 0, GAPS = [0, 2.2, 4.4, 7.0, 7.4, 10.4, 10.6, 12.8, 13.0];
  WED.forEach((w, i) => T.actor({ sample: 0.5, period: 30,
    at(t) {
      const L = 30, d = (t * 0.9 + WOFF) % L - GAPS[i], y = -24 + d; if (y < -21.5 || y > -7.5) return null;
      const a = Math.min(1, (y + 21.5) / 2, (-7.5 - y) / 2), ph = Math.floor((d / 2.0) % 1 * 8 + 8) % 8;
      return { x: WX[i], y, key: ph, ph: ph / 8, alpha: a < 1 ? a : null };
    },
    draw(g, st) {
      const r = TK.person(g, 0, 0, 0, Object.assign({}, w, { dir: 1, pose: 'walk', ph: st.ph }));
      if (w.parasol) {                                           // the big red parasol over the bride (her attendant's)
        const c = [r.crown[0] + 1.2, r.crown[1] - 3.2], um = [];
        for (let k = 0; k <= 14; k++) { const a = Math.PI + Math.PI * k / 14; um.push([c[0] + Math.cos(a) * 9.5, c[1] + 2.8 + Math.sin(a) * 3.4]); }
        g.line2([c, [c[0] - 1.6, c[1] + 11]], { w: 0.5, c: '#4A3A2C', boil: false });
        g.fill2(um, '#C9463E'); const rib = []; for (let k = 2; k < 14; k += 3) rib.push(c[0], c[1], um[k][0], um[k][1]); g.segs2(rib, '#8A2F26', 0.35);
        g.line2(um, { w: 0.55, c: '#7A2A22', boil: false });
      }
    } }));
  // rockabilly dancers twisting round a radio
  const ROCK = [0, 1, 2, 3].map((i) => TK.who(3200 + i, { top: '#2A2622', jacket: i % 2 ? '#F3F1EA' : undefined, bot: '#3F4D63', shoe: '#2A2622', hairStyle: 'short', hair: '#1F1A18', bare: false, beard: false, glasses: i === 2 }));
  [[-17, 9.6, 0], [-12.6, 10.4, 1], [-15.4, 14.0, 0], [-11.2, 13.6, 3]].forEach(([x, y, dir], i) => T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 3.2 + i * 1.5) % 6; return { x, y, key: f, f }; },
    draw(g, st) {
      const pose = [['walk', 0.0], ['crouch', 0], ['walk', 0.5], ['cheer', 0.25], ['crouch', 0], ['walk', 0.25]][st.f];
      const r = TK.person(g, 0, 0, 0, Object.assign({}, ROCK[i], { dir: [dir, dir, dir, dir, (dir + 1) % 4, dir][st.f], pose: pose[0], ph: pose[1], sway: st.f === 1 ? 0.9 : st.f === 4 ? -0.9 : 0 }));
      const c = r.crown; g.fill2(K.curve([[c[0] - 1.6, c[1] + 0.8], [c[0] - 0.6, c[1] - 1.6], [c[0] + 2.6, c[1] - 2.4], [c[0] + 2.8, c[1] - 0.8], [c[0] + 1.4, c[1] + 0.6]], 2, true), '#1F1A18', true);   // the pompadour
    } }));
  T.cast([-14.2, 12], (g) => { const p = g.p(-14.2, 12, 0); g.fill2([[p[0] - 2.4, p[1]], [p[0] + 2.4, p[1]], [p[0] + 2.4, p[1] - 2.4], [p[0] - 2.4, p[1] - 2.4]], '#3A3530', true); g.disc2([p[0] - 1.2, p[1] - 1.2], 0.8, '#8C8576'); g.disc2([p[0] + 1.2, p[1] - 1.2], 0.8, '#8C8576'); g.line2([[p[0] - 1.6, p[1] - 2.4], [p[0], p[1] - 3.6], [p[0] + 1.6, p[1] - 2.4]], { w: 0.4, c: '#3A3530', boil: false }); TK.person(g, -9.5, 7.6, 0, TK.who(3210, { dir: 2, pose: 'hold', phone: true })); TK.person(g, -8.2, 9.2, 0, TK.kimono(3211, { dir: 2 })); }, { on: true });
  // a jogger and a dog walker on the loop, visitors on the approach
  const ring = []; for (let i = 0; i < 16; i++) { const a = TAU * i / 16; ring.push([6 + Math.cos(a) * 22.8, 14 + Math.sin(a) * 13.9]); }
  K.walker(T, TK.who(3220, { top: '#E08A3C', shorts: true, bot: '#2F343B', cap: '#3B3F47' }), ring, 4.2, {});
  K.walker(T, TK.who(3221, { top: '#7FB7D9' }), ring.slice().reverse(), 1.4, { phase: 0.3 });
  for (let i = 0; i < 4; i++) K.walker(T, i % 2 ? TK.kimono(3230 + i) : TK.who(3230 + i), [[35, -17.6 + i * 1.3], [2, -17.6 + i * 1.3]], 1.7, { phase: i * 0.27 });
});
