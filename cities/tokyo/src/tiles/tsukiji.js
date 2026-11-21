'use strict';
/* (100,100) Tsukiji outer market, the place nearest the camera, so everything here stays low. At the back a row of
   two-storey shops under big signboards (knives, dried fish, tea); a busy lane where turret trucks (tāre: a drum engine,
   a flat bed, the driver standing at the wheel) loop round with styrofoam boxes; a block of fish stalls whose counters
   of crushed ice face the second lane (tuna slabs, octopus, crabs, scallops); in the open front: a standing sushi
   counter whose chef faces us, a tamagoyaki window with a queue, and two men cutting a whole tuna for a small crowd.
   Gulls wheel overhead. */
SF.tile('tsukiji', 100, 100, { rim: 54 }, function (T) {
  const H = 37, WET = '#DCD8CC', ICE = '#F4F7F6';
  T.ground(function (g) {
    K.slab(g, H, { top: '#E2DED3' });
    g.fill(K.rect(-H, -24, H, -14), WET); g.fill(K.rect(-H, -2.4, H, 7.6), WET); g.fill(K.rect(28, -24, H, 7.6), WET); g.fill(K.rect(-H, -24, -31.5, 7.6), WET);
    for (const q of [K.rect(-H, -24, H, -14), K.rect(-H, -2.4, H, 7.6)]) g.scuff(q, { dir: Math.atan2(AY, AX), len: 6, c: '#C9C5B8', dens: 0.5, w: 0.5, spread: 0.06 });
    // wet patches with a pale sheen
    for (const [x, y, r] of [[-12, 2, 3], [14, -18, 2.6], [6, 4, 2], [-26, -20, 2.4]]) { const pts = K.curve([[x - r, y, 0], [x, y - r * 0.6, 0], [x + r, y, 0], [x, y + r * 0.6, 0]], 4, true); g.fill(pts, '#CFCCC2'); g.scuff(pts, { dir: -0.6, len: 2, c: '#F4F2EC', dens: 1.2, w: 0.5 }); }
  }, { rim: true });

  /* ---------------- the back row: shops under signboards ---------------- */
  const SIGNS = ['#F3F1EA', '#2E3A55', '#C9463E', '#E6C24F', '#F3F1EA'];
  [[-35, -20], [-18, -5], [-3, 11], [13, 27], [29, 36]].forEach(([x0, x1], i) => {
    const h = [9.6, 10.6, 9.0, 11.2, 8.6][i];
    T.obj([x0, -36, x1, -25.5], function (g) {
      K.box(g, x0, -36, x1, -25.5, 0, h, { t: '#E4E0D6', l: ['#EFE9DA', '#E9E6DE', '#F1EDE3', '#E3DED2', '#EDE8DC'][i], r: '#D3CEC2' }, { w: 0.9 });
      g.fill(K.on('L', -25.45, x0 + 0.5, x1 - 0.5, 0, 3.8), '#4A433A');
      const R = RNG(i * 13 + 7), dots = [];
      for (let k = 0; k < Math.round((x1 - x0) * 1.2); k++) { const p = g.p(x0 + 0.8 + R() * (x1 - x0 - 1.6), -25.3, 0.6 + R() * 2.6); g.fill2([[p[0] - 0.6, p[1] + 0.5], [p[0] + 0.6, p[1] + 0.5], [p[0] + 0.6, p[1] - 0.7], [p[0] - 0.6, p[1] - 0.7]], R.pick(['#E7C65A', '#C9A26B', '#E08A3C', '#F3F1EA', '#8FBF73', '#C9584B']), true); dots.push(p); }
      TK.awning(g, 'L', -25.5, x0 + 0.2, x1 - 0.2, 4.4, 2.0, i % 2 ? '#3F5F8F' : '#F3F1EA', { stripe: i % 2 ? '#F3F1EA' : '#3F5F8F', drop: 0.8 });
      K.win(g, 'L', -25.5, x0 + 1, x1 - 1, 5.6, 7.2, { style: 'glass' });
      TK.sign(g, 'L', -25.5, x0 + 1.2, x1 - 1.2, h - 1.6, h + 0.4, SIGNS[i], { seed: 80 + i, n: Math.max(2, Math.round((x1 - x0) / 3.2)) });
      if (i === 1) { K.box(g, x0 + 4, -33, x0 + 8, -29, h, h + 2.6, '#C9CCCC', { w: 0.5 }); }
    }, { name: 'shop row' });
  });

  /* ---------------- the fish stalls ---------------- */
  const FISH = (g, x0, x1, seed) => {
    const R = RNG(seed);
    g.fill([[x0 + 0.3, -2.9, 2.3], [x1 - 0.3, -2.9, 2.3], [x1 - 0.3, -5.6, 2.6], [x0 + 0.3, -5.6, 2.6]], ICE);
    for (let k = 0; k < 7; k++) {
      const x = lerp(x0 + 0.9, x1 - 0.9, (k + R() * 0.4) / 7), y = -3.6 - R() * 1.6, p = g.p(x, y, 2.45), kind = R.int(0, 4);
      if (kind === 0) { g.fill2([[p[0] - 2.2, p[1]], [p[0] - 0.4, p[1] - 0.9], [p[0] + 1.6, p[1] - 0.4], [p[0] + 2.4, p[1] - 1.1], [p[0] + 2.4, p[1] + 0.9], [p[0] + 1.6, p[1] + 0.4], [p[0] - 0.4, p[1] + 0.8]], '#B9C3CC', true); g.disc2([p[0] - 1.5, p[1] - 0.1], 0.25, '#2A2622'); }
      else if (kind === 1) { g.fill2([[p[0] - 1.8, p[1] - 0.8], [p[0] + 1.8, p[1] - 0.8], [p[0] + 1.8, p[1] + 0.8], [p[0] - 1.8, p[1] + 0.8]], '#C9463E', true); g.segs2([p[0] - 1.2, p[1] - 0.8, p[0] - 0.6, p[1] + 0.8, p[0], p[1] - 0.8, p[0] + 0.6, p[1] + 0.8], '#F1C4BC', 0.3); }
      else if (kind === 2) { g.disc2(p, 1.1, '#E07A6A'); for (let j = 0; j < 4; j++) { const a = Math.PI * (0.15 + j * 0.23); g.line2([p, [p[0] + Math.cos(a) * 2.4, p[1] + Math.sin(a) * 1.4]], { w: 0.5, c: '#E07A6A', boil: false }); } }
      else if (kind === 3) { g.disc2(p, 1.0, '#E08A3C'); g.line2([[p[0] - 1.6, p[1] - 0.3], [p[0] + 1.6, p[1] - 0.3]], { w: 0.45, c: '#B9622A', boil: false }); }
      else { for (let j = 0; j < 3; j++) g.disc2([p[0] - 1 + j, p[1] + (j % 2) * 0.4], 0.55, '#F3E3C0'); }
    }
    const pr = []; for (let k = 0; k < 4; k++) { const c = g.p(lerp(x0 + 1, x1 - 1, k / 3), -2.85, 2.6); pr.push(c); }
    for (const c of pr) g.fill2([[c[0] - 0.9, c[1] - 1.1], [c[0] + 0.9, c[1] - 1.1], [c[0] + 0.9, c[1] - 0.1], [c[0] - 0.9, c[1] - 0.1]], '#F6F3EA', true);
  };
  for (let i = 0; i < 6; i++) {
    const x0 = -31 + i * 9.6, x1 = x0 + 9.2;
    T.obj([x0, -13, x1, -2.6], function (g) {
      K.box(g, x0, -13, x1, -6, 0, 4.8, { t: '#E3DED2', l: '#EFE9DA', r: '#D3CEC2' }, { w: 0.75 });
      g.fill(K.on('L', -5.97, x0 + 0.4, x1 - 0.4, 0, 4.2), '#C9C3B4');
      // the seller stands between the back wall and the ice (drawn inside the stall so the canopy stays above them)
      const sx = x0 + 4.6;
      TK.person(g, sx, -6.6, 0, TK.who(1400 + i, { dir: 1, top: '#F3F1EA', bot: '#3F4D63', cap: i % 2 ? '#3F5F8F' : undefined, noLegs: true, pose: i % 3 === 0 ? 'wave' : 'stand', ph: 0.3 }));
      K.box(g, x0, -6, x1, -2.9, 0, 2.3, { t: '#C9C6BD', l: '#9FA39E', r: '#8A8E89' }, { w: 0.7 });
      FISH(g, x0, x1, i * 31 + 5);
      // a corrugated canopy over the back of the stall, high enough to stand under, sloping towards the lane
      const pz = (y) => lerp(8.0, 7.0, (y + 13.2) / 8.4), posts = [];
      for (const x of [x0 + 0.3, x1 - 0.3]) { const a = g.p(x, -5.0, 2.3), b = g.p(x, -5.0, pz(-5.0)); posts.push(a[0], a[1], b[0], b[1]); }
      g.segs2(posts, '#5A564E', 0.5);
      const can = [[x0 - 0.2, -13.2, pz(-13.2)], [x1 + 0.2, -13.2, pz(-13.2)], [x1 + 0.2, -4.8, pz(-4.8)], [x0 - 0.2, -4.8, pz(-4.8)]], cc = i % 3 === 0 ? '#7FA7CF' : i % 3 === 1 ? '#C9CCCC' : '#9FCFB1';
      g.fill(can, cc); const rib = []; for (let x = x0 + 0.6; x < x1; x += 0.9) { const a = g.p(x, -13.2, pz(-13.2)), b = g.p(x, -4.8, pz(-4.8)); rib.push(a[0], a[1], b[0], b[1]); } g.segs2(rib, shade(cc, 0.22), 0.3);
      g.outline(can, { w: 0.7, boil: false });
      TK.sign(g, 'L', -4.8, x0 + 1.6, x1 - 1.6, pz(-4.8) + 0.1, pz(-4.8) + 1.15, '#F6F1E4', { seed: 120 + i, n: 4 });
    }, { name: 'fish stall' });
  }

  /* ---------------- the open front ---------------- */
  // the standing sushi counter: a little wooden booth with noren, the chef faces us across the counter
  T.obj([-29, 10.5, -16, 14.6], function (g) {
    K.box(g, -29, 10.5, -16, 13.0, 0, 6.6, { t: '#C9A26B', l: '#D9B57E', r: '#B58F58' }, { w: 0.85 });
    TK.roof(g, -29, 10.5, -16, 13.0, 6.6, 1.6, { over: 0.8, lift: 0.3, col: '#6E747C', ridge: 'x', tiles: false });
    TK.sign(g, 'L', 13.0, -27, -18, 5.0, 6.2, '#F6F1E4', { seed: 140, n: 4 });
  }, { name: 'sushi booth' });
  T.cast([-22.5, 14.2], function (g) {
    // the chef in white with a headband, behind a counter of pale wood with a glass case of neta
    TK.person(g, -22.5, 13.6, 0, TK.who(1450, { dir: 1, top: '#F6F3EA', bot: '#F6F3EA', hairStyle: 'buzz', noLegs: true, pose: 'hold' }));
    K.box(g, -28, 14.0, -17, 15.4, 0, 3.4, { t: '#E9D9B4', l: '#D9C29A', r: '#C9B088' }, { w: 0.7 });
    const cs = K.on('L', 15.42, -27, -18, 3.4, 4.6); g.fill(cs, 'rgba(207,224,234,0.9)'); g.outline(cs, { w: 0.4, boil: false });
    for (let k = 0; k < 7; k++) { const p = g.p(-26.4 + k * 1.3, 15.0, 3.75); g.fill2([[p[0] - 1, p[1]], [p[0] + 1, p[1]], [p[0] + 1, p[1] - 0.8], [p[0] - 1, p[1] - 0.8]], ['#E9806A', '#F3E3C0', '#C9463E', '#E08A3C', '#F3F1EA', '#E9806A', '#C9463E'][k], true); }
  }, { on: true });
  T.cast([-22.5, 17.8], (g) => { for (let k = 0; k < 4; k++) TK.person(g, -26.5 + k * 2.6, 17.6 + (k % 2) * 0.4, 0, (k % 2 ? TK.salary : TK.who)(1460 + k, { dir: k === 3 ? 3 : 2, pose: 'hold' })); }, { on: true });
  // the tamagoyaki window and its queue
  T.obj([-6, 10, 1.5, 15.5], function (g) {
    K.box(g, -6, 10, 1.5, 15.5, 0, 6.0, { t: '#E9E6DE', l: '#F3EFE3', r: '#E6D9B9' }, { w: 0.85 });
    g.fill(K.on('R', 1.52, 11, 14.5, 2.4, 4.6), '#E9C48A');
    TK.awning(g, 'R', 1.5, 10.3, 15.2, 5.2, 1.4, '#E6C24F', { stripe: '#F3F1EA', drop: 0.7 });
    TK.sign(g, 'L', 15.5, -5, 0.5, 4.2, 5.6, '#E6C24F', { seed: 150, n: 3, ink: '#3A3128' });
    const s = g.p(1.6, 12.8, 3.0); g.fill2([[s[0] - 1.6, s[1] - 0.5], [s[0] + 1.6, s[1] - 0.5], [s[0] + 1.6, s[1] + 0.9], [s[0] - 1.6, s[1] + 0.9]], '#F3D35A', true);
  }, { name: 'tamagoyaki' });
  T.cast([1.0, 12.8], (g) => TK.person(g, 0.6, 12.8, 0, TK.who(1470, { dir: 0, top: '#F3F1EA', noLegs: true, pose: 'hold' })), { on: true });
  T.cast([7, 13.4], (g) => { for (let k = 4; k >= 0; k--) TK.person(g, 3.4 + k * 1.9, 13.0 + (k % 2) * 0.5, 0, (k === 2 ? TK.kimono : TK.who)(1480 + k, { dir: 2, pose: k % 2 ? 'hold' : 'stand', phone: k % 2 === 1 })); }, { on: true });
  // the tuna: a long table, a whole fish on it, two men with the long knife; onlookers with phones
  T.obj([10, 9.5, 24, 13.5], function (g) {
    K.box(g, 10, 9.5, 24, 13.5, 0, 2.6, { t: '#C9C6BD', l: '#B9B6AD', r: '#A3A097' }, { w: 0.7 });
    const P = (x, y) => g.p(x, y, 2.75), A = P(11.5, 11.5), B = P(22.5, 11.5);
    const body = K.curve([[A[0], A[1]], [lerp(A[0], B[0], 0.25), A[1] - 3.2], [lerp(A[0], B[0], 0.6), A[1] - 3.4 + (B[1] - A[1]) * 0.6], [B[0] - 2.5, B[1] - 1.4], [B[0], B[1] - 0.3], [B[0] - 2.4, B[1] + 0.6], [lerp(A[0], B[0], 0.6), A[1] + 0.8 + (B[1] - A[1]) * 0.6], [lerp(A[0], B[0], 0.25), A[1] + 0.8]], 3, true);
    g.fill2(body, '#B9C3CC'); g.fill2(body.filter((p, i) => i < body.length / 2), '#3F4D63');
    g.fill2([[lerp(A[0], B[0], 0.42), lerp(A[1], B[1], 0.42) - 2.6], [lerp(A[0], B[0], 0.62), lerp(A[1], B[1], 0.62) - 2.8], [lerp(A[0], B[0], 0.6), lerp(A[1], B[1], 0.6) + 0.4], [lerp(A[0], B[0], 0.44), lerp(A[1], B[1], 0.44) + 0.4]], '#C9463E', true);
    g.fill2([[B[0], B[1] - 0.3], [B[0] + 2.6, B[1] - 2.4], [B[0] + 2.0, B[1] - 0.2], [B[0] + 2.6, B[1] + 1.8]], '#3F4D63', true);
    g.line2(body, { w: 0.6, close: true, boil: false }); g.disc2([A[0] + 2.0, A[1] - 0.9], 0.6, '#F6F3EA'); g.disc2([A[0] + 2.0, A[1] - 0.9], 0.3, '#2A2622');
  }, { name: 'tuna table' });
  T.cast([17, 15.2], function (g) {
    const k1 = TK.who(1490, { dir: 2, top: '#F3F1EA', bot: '#2F343B', shoe: '#2E2A26', cap: '#3B3F47' }), k2 = TK.who(1491, { dir: 2, top: '#F3F1EA', bot: '#2F343B', shoe: '#2E2A26', hairStyle: 'buzz' });
    const a = g.p(14.5, 15.0, 0), b = g.p(19.5, 15.4, 0), kn0 = g.p(13.8, 11.6, 3.4), kn1 = g.p(19.8, 11.6, 3.6);
    TK.person(g, 14.5, 15.0, 0, Object.assign(k1, { hands: [[kn0[0] - a[0], kn0[1] - a[1]], [kn0[0] - a[0] + 1.4, kn0[1] - a[1] + 0.6]] }));
    TK.person(g, 19.5, 15.4, 0, Object.assign(k2, { hands: [[kn1[0] - b[0], kn1[1] - b[1]], [kn1[0] - b[0] - 1.2, kn1[1] - b[1] + 0.5]] }));
    g.line2([kn0, kn1], { w: 0.7, c: '#D9DCDC', boil: false }); g.line2([kn0, [kn0[0] - 1.6, kn0[1] + 0.9]], { w: 0.9, c: '#4A3A2C', boil: false });
  }, { on: true });
  T.cast([18, 20.5], (g) => { for (let k = 0; k < 5; k++) TK.person(g, 11.5 + k * 2.6, 19.8 + (k % 2) * 1.1, 0, TK.who(1495 + k, { dir: 3, pose: k % 2 ? 'hold' : 'stand', phone: k % 2 === 1 })); }, { on: true });
  // stacks of styrofoam boxes and blue crates
  for (const [x, y, n, c] of [[-33.5, 11, 3, '#F6F3EA'], [-33, 15.5, 2, '#5F8FC9'], [27, 10.5, 3, '#F6F3EA'], [31, 14.5, 2, '#5F8FC9'], [24.5, -11, 2, '#F6F3EA']]) T.obj([x - 1.3, y - 1, x + 1.3, y + 1], (g) => { for (let k = 0; k < n; k++) K.box(g, x - 1.3, y - 1, x + 1.3, y + 1, k * 1.3, k * 1.3 + 1.25, c, { w: 0.5, boil: false }); }, { name: 'boxes' });

  /* ---------------- moving things ---------------- */
  // turret trucks round a loop: the back lane, the right side, the front lane, the left side
  const LOOP = (() => { const pts = []; const rr = 3.5, c = [[-34, -19], [32.5, -19], [32.5, 2.6], [-34, 2.6]]; return { c, rr }; })();
  const loopAt = (d) => yLoopAt(d, 1, 1);
  void loopAt;
  const PATH = [[-34, -19], [32.5, -19], [32.5, 2.6], [-34, 2.6]];
  const segL = PATH.map((p, i) => Math.hypot(PATH[(i + 1) % 4][0] - p[0], PATH[(i + 1) % 4][1] - p[1])), tot = segL.reduce((a, b) => a + b, 0);
  const along = (d) => { d = ((d % tot) + tot) % tot; for (let i = 0; i < 4; i++) { if (d < segL[i]) { const a = PATH[i], b = PATH[(i + 1) % 4], u = d / segL[i]; return { x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), ang: Math.atan2(b[1] - a[1], b[0] - a[0]) }; } d -= segL[i]; } return { x: PATH[0][0], y: PATH[0][1], ang: 0 }; };
  [0, 0.36, 0.68].forEach((ph, i) => {
    const who = TK.who(1500 + i, { top: ['#5F8FC9', '#F3F1EA', '#E08A3C'][i], cap: '#3B3F47', bot: '#2F343B' });
    const cargo = (g, B) => { for (let k = 0; k < 3; k++) { const p = B.pt(-1.6 + k * 1.1, 0, 1.15); K.rbox(g, p[0], p[1], 0.5, 1.2, Math.atan2(B.sa, B.ca), 1.15, 2.2 + (k % 2) * 0.9, '#F6F3EA', { w: 0.4 }); } };
    T.actor({ sample: 0.3, period: tot / 6,
      at(t) { const p = along(t * 6 + ph * tot), q = Math.round(p.ang / (TAU / 16)); return { x: p.x, y: p.y, key: q, ang: q * TAU / 16 }; },
      draw(g, st) { TK.turret(g, st.ang, who, cargo); } });
  });
  // shoppers along the lanes
  for (let i = 0; i < 8; i++) {
    const y = i % 2 ? -17.5 + (i % 3) : 5 + (i % 3) * 0.8, look = i % 3 === 0 ? TK.kimono(1510 + i) : TK.who(1510 + i, i % 4 === 1 ? { phone: true } : {});
    K.walker(T, look, [[-29 + i * 2, y], [26 - i, y], [26 - i, y + 0.8], [-29 + i * 2, y + 0.8]], 1.8 + (i % 3) * 0.4, { phase: (i * 0.29) % 1 });
  }
  // gulls wheeling above
  for (let i = 0; i < 3; i++) T.actor({ layer: 'top', sample: 5, period: 10, grow: false,
    at(t) { const a = t * 0.5 + i * 2.1, f = Math.floor(t * 5 + i) % 4; return { x: -4 + Math.cos(a) * (14 + i * 4), y: 0 + Math.sin(a) * (10 + i * 3), z: 22 + i * 3, key: f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), w = [3.4, 2.4, 1.0, 2.4][st.f], d = [-1.4, -0.6, 0.6, -0.6][st.f]; g.fill2([[o[0] - w, o[1] + d], [o[0] - 0.8, o[1] - 0.2], [o[0], o[1] + 0.5], [o[0] + 0.8, o[1] - 0.2], [o[0] + w, o[1] + d], [o[0] + 0.6, o[1] + 0.4], [o[0], o[1] + 1.0], [o[0] - 0.6, o[1] + 0.4]], '#FBFAF6', true); g.line2([[o[0] - w, o[1] + d], [o[0] - 0.8, o[1] - 0.2], [o[0], o[1] + 0.5], [o[0] + 0.8, o[1] - 0.2], [o[0] + w, o[1] + d]], { w: 0.45, c: '#6B6458', boil: false }); } });
});
