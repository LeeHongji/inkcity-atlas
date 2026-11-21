'use strict';
/* (100,-100) Akihabara. A row of tall narrow buildings faces a street closed to cars (a pedestrian Sunday): every
   facade hung with vertical signboards in bright colours, banners on each floor, billboards on the roofs. On the near
   side, kept low so the street stays in view: a crane-game arcade open to the street (the claw moves), a wall of
   capsule-toy machines, a takoyaki stand. A maid hands out flyers, cosplayers in bright wigs pose, shoppers carry bags. */
SF.tile('akiba', 100, -100, { rim: 36 }, function (T) {
  const H = 37, ST = [1.5, 11];
  T.ground(function (g) {
    K.slab(g, H, { top: '#E3DFD4' });
    g.fill(K.rect(-H, ST[0], H, ST[1]), '#D9D4C7');
    for (let x = -34; x < H; x += 4) g.line([[x, (ST[0] + ST[1]) / 2, 0], [x + 1.8, (ST[0] + ST[1]) / 2, 0]], { w: 0.8, c: '#F7F5EE', boil: false });
    g.scuff(K.rect(-H, ST[0], H, ST[1]), { dir: Math.atan2(AY, AX), len: 7, c: '#C9C3B4', dens: 0.6, w: 0.5, spread: 0.05 });
    for (let x = -36; x < H; x += 2.2) g.fine([[x, ST[1], 0], [x, ST[1] + 3, 0]], { w: 0.25, c: '#C9C3B4' });
  }, { rim: true });

  /* ---------------- the tall row ---------------- */
  const COL = ['#E9E6DE', '#DCE3E6', '#F1EDE3', '#E3DED2', '#E9E2CF', '#D9DCDC'];
  const SIGNC = ['#C9463E', '#E6C24F', '#5F8FC9', '#E08A3C', '#8E79C0', '#6FAE6A', '#D98AA4', '#2E3A55', '#3FB0C9'];
  const ROW = [[-36, -26, 24, 0], [-25, -14, 19, 1], [-13, -3, 27, 2], [-2, 9, 21, 3], [10, 20, 25, 4], [21, 36, 18, 5]];
  ROW.forEach(([x0, x1, h, i]) => T.obj([x0, -34, x1, 0.5], function (g) {
    g.boilP = 0.3;
    const y1 = 0, R = RNG(i * 41 + 3), body = COL[i];
    K.box(g, x0, -34, x1, y1, 0, h, { t: shade(body, -0.08), l: body, r: shade(body, 0.1) }, { w: 0.95 });
    // the shop floor: open, lit, packed with goods
    g.fill(K.on('L', y1 + 0.03, x0 + 0.4, x1 - 0.4, 0, 3.8), '#F3E3B8');
    for (let k = 0; k < (x1 - x0) * 1.3; k++) { const p = g.p(x0 + 0.8 + R() * (x1 - x0 - 1.6), y1 + 0.05, 0.4 + R() * 3); g.fill2([[p[0] - 0.6, p[1] + 0.5], [p[0] + 0.6, p[1] + 0.5], [p[0] + 0.6, p[1] - 0.7], [p[0] - 0.6, p[1] - 0.7]], R.pick(SIGNC), true); }
    // floors of windows, and a horizontal banner on some
    for (let z = 5; z < h - 2; z += 3.4) {
      if (R() < 0.45) TK.sign(g, 'L', y1, x0 + 0.6, x1 - 0.6, z, z + 2.2, R.pick(SIGNC), { seed: i * 20 + z, n: Math.max(2, Math.round((x1 - x0) / 2.4)) });
      else K.win(g, 'L', y1, x0 + 1, x1 - 1, z + 0.3, z + 2.4, { style: R() < 0.5 ? 'glass' : 'navy' });
    }
    // a tall vertical sign standing out from the facade
    const vx = x0 + (i % 2 ? 1.2 : x1 - x0 - 1.2), vc = SIGNC[(i * 3) % SIGNC.length], vz0 = 5, vz1 = h - 1.5;
    const pts = [[vx - 0.15, y1 + 0.1, vz0], [vx - 0.15, y1 + 2.4, vz0], [vx - 0.15, y1 + 2.4, vz1], [vx - 0.15, y1 + 0.1, vz1]];
    g.fill(pts, shade(vc, 0.12));
    const fr = [[vx - 0.15, y1 + 2.4, vz0], [vx + 0.55, y1 + 2.4, vz0], [vx + 0.55, y1 + 2.4, vz1], [vx - 0.15, y1 + 2.4, vz1]]; g.fill(fr, shade(vc, 0.3));
    g.outline(pts, { w: 0.55, c: shade(vc, 0.5), boil: false });
    const n = Math.floor((vz1 - vz0) / 2.4); for (let k = 0; k < n; k++) TK.glyph2(g, g.p(vx - 0.2, y1 + 1.25, vz1 - 1.2 - k * 2.4), 4.6, '#F6F3EA', 300 + i * 10 + k);
    // a roof billboard
    if (i % 2 === 0) { const bb = K.on('L', y1 - 4, x0 + 1, x1 - 1, h + 0.6, h + 5.4); g.fill(bb, R.pick(['#E6C24F', '#C9463E', '#3FB0C9'])); g.outline(bb, { w: 0.6, boil: false }); const posts = []; for (const a of [x0 + 2, x1 - 2]) { const p0 = g.p(a, y1 - 4, h), p1 = g.p(a, y1 - 4, h + 0.6); posts.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(posts, '#5A564E', 0.5); TK.sign(g, 'L', y1 - 4, x0 + 1.4, x1 - 1.4, h + 1.4, h + 4.6, '#F6F3EA', { seed: 400 + i, n: Math.round((x1 - x0) / 2.8) }); }
    if (x1 === 36) { for (let z = 5; z < h - 2; z += 3.4) K.win(g, 'R', x1, -32, -4, z + 0.3, z + 2.4, { style: 'navy' }); TK.sign(g, 'R', x1, -30, -18, h - 6, h - 1.5, '#E08A3C', { seed: 77, n: 4 }); }
    TK.awning(g, 'L', y1, x0 + 0.2, x1 - 0.2, 4.4, 1.4, SIGNC[(i * 5 + 2) % SIGNC.length], { drop: 0.6 });
  }, { name: 'akiba building' }));

  /* ---------------- the near side: low things ---------------- */
  // the crane-game arcade: glass front, rows of machines; the claw of the front one is an actor
  T.obj([-30, 14, -12, 26], function (g) {
    K.box(g, -30, 14, -12, 26, 0, 6.5, { t: '#E9E6DE', l: '#F3EFE3', r: '#DCD4C0' }, { w: 0.85 });
    g.fill(K.on('R', -11.97, 15, 25, 0, 5.2), '#F3E3B8');
    for (let k = 0; k < 4; k++) { const a = 15.6 + k * 2.4; g.fill(K.on('R', -11.95, a, a + 1.9, 0.2, 4.6), ['#F2B6C2', '#A9D1E6', '#F3E3A0', '#C9E3A8'][k]); g.fill(K.on('R', -11.94, a + 0.2, a + 1.7, 2.0, 4.3), '#F6F9FA'); const R = RNG(k + 50); for (let j = 0; j < 5; j++) { const p = g.p(-11.93, a + 0.4 + R() * 1.1, 2.3 + R() * 0.7); g.disc2(p, 0.8, R.pick(['#E9806A', '#F3E3A0', '#8FB7D9', '#F2C6D0', '#B9A27D'])); } }
    TK.sign(g, 'L', 26, -29, -13, 5.0, 6.4, '#C9463E', { seed: 90, n: 6 });
    TK.sign(g, 'R', -12, 15, 25, 5.3, 6.4, '#E6C24F', { seed: 91, n: 5, ink: '#3A3128' });
  }, { name: 'arcade' });
  // the capsule-toy wall: rows of little machines, each a clear dome full of colours
  T.obj([-8, 13.5, 8, 16], function (g) {
    K.box(g, -8, 13.5, 8, 15.5, 0, 5.4, { t: '#E9E6DE', l: '#F3F1EA', r: '#E2DFD5' }, { w: 0.8 });
    const R = RNG(12);
    for (let r = 0; r < 2; r++) for (let k = 0; k < 8; k++) {
      const a = -7.4 + k * 1.9, z = 0.5 + r * 2.5, c = R.pick(['#C9463E', '#5F8FC9', '#E6C24F', '#6FAE6A', '#D98AA4', '#E08A3C']);
      g.fill(K.on('L', 15.52, a, a + 1.7, z, z + 2.2), c);
      const d = g.p(a + 0.85, 15.6, z + 1.5); g.disc2(d, 1.7, '#F6F9FA'); for (let j = 0; j < 4; j++) g.disc2([d[0] + (R() - 0.5) * 1.8, d[1] + (R() - 0.5) * 1.4], 0.55, R.pick(['#E9806A', '#F3E3A0', '#8FB7D9', '#C9E3A8'])); g.ring2(d, 1.7, { w: 0.35, c: '#8C8576' });
      g.disc2(g.p(a + 0.85, 15.6, z + 0.35), 0.4, '#3A3530');
    }
  }, { name: 'gacha' });
  // the takoyaki stand
  T.obj([14, 15, 22, 19], function (g) {
    K.box(g, 14, 15, 22, 19, 0, 3.0, { t: '#C9A26B', l: '#D9B57E', r: '#B58F58' }, { w: 0.7 });
    for (let k = 0; k < 3; k++) for (let j = 0; j < 4; j++) { const p = g.p(15 + j * 1.8, 16 + k * 1.0, 3.05); g.disc2(p, 0.7, '#C98A4A'); }
    TK.awning(g, 'L', 19, 13.8, 22.2, 6.4, 1.8, '#C9463E', { stripe: '#F3F1EA' });
    const posts = []; for (const x of [14.2, 21.8]) { const a = g.p(x, 19, 3), b = g.p(x, 19, 6.4); posts.push(a[0], a[1], b[0], b[1]); } g.segs2(posts, '#5A4A3C', 0.5);
    TK.lantern2(g, g.p(18, 20.6, 4.6), 1.6, '#C9463E', { glyph: 5 });
  }, { name: 'takoyaki' });
  for (const [x, y] of [[30, 20], [-33, 31], [31, 33]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.8, h: 5 }), { on: true });

  /* ---------------- the living layer ---------------- */
  // the claw of the front crane game, gliding and dropping
  T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const u = (t / 4) % 1, f = Math.floor(u * 12); return { x: -11.9, y: 17.5, z: 4.4, key: f, f }; },
    draw(g, st) { const f = st.f, dx = f < 4 ? f / 4 : 1, drop = f >= 4 && f < 8 ? (f - 4) / 4 : f >= 8 ? (12 - f) / 4 : 0; const top = g.p(0, dx * 1.2, 0), c = [top[0], top[1] + drop * 6]; g.line2([top, c], { w: 0.3, c: '#5A564E', boil: false }); g.line2([[c[0] - 1.2, c[1] + 1.4], [c[0], c[1]], [c[0] + 1.2, c[1] + 1.4]], { w: 0.5, c: '#8C8576', boil: false }); } });
  // a maid handing out flyers, cosplayers posing for a photographer, a queue for takoyaki
  T.cast([4, 9.6], (g) => { const r = TK.person(g, 4, 9.6, 0, TK.who(5001, { dir: 1, dress: '#2E2A26', top: '#2E2A26', hairStyle: 'pony', hair: '#E79AAE', pose: 'wave', ph: 0.2 })); g.fill2([[r.hip[0] - 2.4, r.hip[1] - 4.8], [r.hip[0] + 2.2, r.hip[1] - 4.8], [r.hip[0] + 2.6, r.hip[1] + 2.6], [r.hip[0] - 2.8, r.hip[1] + 2.6]], '#F6F3EA', true); const h = r.hands[0]; g.fill2([[h[0] - 1, h[1] - 0.6], [h[0] + 1, h[1] - 0.6], [h[0] + 1, h[1] + 0.8], [h[0] - 1, h[1] + 0.8]], '#F2C6D0', true); }, { on: true });
  T.cast([24, 8], (g) => { TK.person(g, 24, 7.4, 0, TK.who(5002, { dir: 1, hair: '#5F8FC9', hairStyle: 'long', top: '#F3F1EA', dress: '#3F5F8F', pose: 'wave', ph: 0.3 })); TK.person(g, 25.8, 8.6, 0, TK.who(5003, { dir: 1, hair: '#E6C24F', hairStyle: 'pony', top: '#C9463E', dress: '#2E2A26', pose: 'cheer', ph: 0.25 })); TK.person(g, 27.6, 4.8, 0, TK.who(5004, { dir: 2, pose: 'hold', phone: true, cap: '#3B3F47' })); }, { on: true });
  T.cast([18, 22.5], (g) => { for (let k = 2; k >= 0; k--) TK.person(g, 15.6 + k * 1.9, 21.4 + (k % 2) * 0.6, 0, TK.who(5010 + k, { dir: 2, pose: k === 1 ? 'hold' : 'stand', phone: k === 1 })); }, { on: true });
  // shoppers up and down the street, some with bags
  for (let i = 0; i < 12; i++) {
    const y = ST[0] + 1 + (i % 6) * 1.5, look = i % 4 === 1 ? TK.who(5100 + i, { hair: ['#E79AAE', '#7FB7D9', '#E6C24F'][i % 3], hairStyle: 'long' }) : i % 4 === 3 ? TK.salary(5100 + i) : TK.who(5100 + i, { cap: i % 3 ? undefined : '#3B3F47', glasses: i % 2 === 0 });
    const a = -35 + (i * 7) % 12, b = 35 - (i * 5) % 9;
    K.walker(T, look, i % 2 ? [[a, y], [b, y]] : [[b, y], [a, y]], 1.5 + (i % 3) * 0.35, { phase: (i * 0.173) % 1 });
  }
});
