'use strict';
/* (-100,100) Battersea, upstream on the south bank. What it is: Battersea Power Station, a cathedral of brick: a
   huge body with vertical brick fluting and tall slit windows, the boiler house rising in the middle, and its four
   white fluted chimneys at the corners (a glass lift rides up one of them); now full of shops, a street-food market in
   front. A row of London terraced houses with chimney pots and a corner pub on the west side; a corner of Battersea
   Park with its trees and a playground; the riverside walk.
   Who is there: shoppers and families at the food stalls, joggers and dog walkers on the river walk, children on the
   swings, drinkers outside the pub, a man reading on a bench under an umbrella.
   What moves: the glass lift up the chimney, an inflatable pink pig floating high over the chimneys on its tether
   (a nod to an old album sleeve and the day the pig got away), swings, walkers. */
SF.tile('battersea', -100, 100, { rim: 30, order: 2.0 }, function (T) {
  const H = 37, RS = -(100 - LT.RIV.S - 1.2), BR = '#B9654C', BRD = '#9C523D', BRK = { t: '#A9583F', l: BR, r: BRD }, CH = { t: '#F3F1EA', l: '#F6F4EE', r: '#DAD6CC' };
  T.ground(function (g) {
    LK.ground(g, -H, RS, H, H, '#E2DED3', { cut: 'y' });
    LK.paving(g, -H, RS, H, RS + 6, { step: 2.4, col: '#E6E1D5' });
    K.lawn(g, 8, 12, 36, 36, { col: '#A8CB7E', dens: 0.8 });
    g.fill(K.rect(18, 22, 30, 32, 0.01), '#E3D2AE'); g.scuff(K.rect(18, 22, 30, 32, 0.01), { dir: 0.3, len: 1.2, c: '#D2BE95', dens: 0.6, w: 0.5 });
    g.fill(K.rect(-26, 8, 6, 16), '#DCD5C5');
    for (const [x, y, rx, ry] of [[-10, 19, 2.0, 0.9], [-30, 30, 1.4, 0.7], [2, -20, 1.6, 0.7], [-20, -20, 1.2, 0.6]]) LK.puddle(g, x, y, rx, ry, Math.round(x * 3 + y * 7 + 99));
  }, { rim: true });

  /* ---------------- the power station ---------------- */
  const flute = (g, face, p, a0, a1, z0, z1, step) => { const s = []; for (let a = a0 + step; a < a1 - 0.2; a += step) { const b = g.p.apply(g, K.pt(face, p + 0.03, a, z0)), t = g.p.apply(g, K.pt(face, p + 0.03, a, z1)); s.push(b[0], b[1], t[0], t[1]); } g.segs2(s, BRD, 0.35); };
  T.obj([-26, -22, 7, 7], function (g) {
    g.boilP = 0.25;
    // the two long side halls and the taller boiler house between them
    for (const [y0, y1] of [[-21, -15], [1, 7]]) { K.box(g, -24, y0, 5, y1, 0, 12, BRK, { w: 0.85 }); flute(g, 'L', y1, -24, 5, 0.6, 11.6, 1.2); flute(g, 'R', 5, y0, y1, 0.6, 11.6, 1.2); }
    K.box(g, -22, -15, 3, 1, 0, 17, BRK, { w: 0.9 });
    flute(g, 'L', 1, -22, 3, 12.2, 16.6, 1.0); flute(g, 'R', 3, -15, 1, 0.6, 16.6, 1.0);
    // tall slit windows on the river (north... seen) and east faces
    for (const [f, p, a0, a1, zz] of [['R', 5, -20.4, -15.6, 11], ['R', 5, 1.6, 6.4, 11], ['R', 3, -14, 0, 15.6], ['L', 7, -22, 4, 11]]) for (let a = a0 + 0.6; a < a1 - 0.4; a += 1.6) K.win(g, f, p + 0.02, a, a + 0.5, 2.2, zz - 1.2, { style: 'dark', col: '#4E4A48', w: 0.25 });
    // the shops' glazed fronts along the base, the art-deco cornice bands
    g.fill(K.on('L', 7.03, -23, 4, 0, 2.6), '#CFE0EA'); g.outline(K.on('L', 7.03, -23, 4, 0, 2.6), { w: 0.4, c: '#5A544C', boil: false });
    for (const [x0, y0, x1, y1, h] of [[-24, -21, 5, -15, 12], [-24, 1, 5, 7, 12], [-22, -15, 3, 1, 17]]) K.box(g, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, h, h + 0.5, '#C9785E', { w: 0.45, nohid: true, boil: false });
  }, { name: 'power station' });
  // the four white chimneys: fluted columns on square brick bases, rings at the top
  const chimney = (x, y) => T.obj([x - 2.2, y - 2.2, x + 2.2, y + 2.2], (g) => {
    K.box(g, x - 2.0, y - 2.0, x + 2.0, y + 2.0, 12, 16, BRK, { w: 0.65, nohid: true });
    K.cyl(g, x, y, 1.75, 16, 34, CH, { w: 0.75, n: 12 });
    const fl = []; for (const a of [-0.3, 0.2, 0.7, 1.2, 1.7, 2.2]) { const b = g.p(x + Math.cos(a) * 1.75, y + Math.sin(a) * 1.75, 16.4), t = g.p(x + Math.cos(a) * 1.75, y + Math.sin(a) * 1.75, 33.4); fl.push(b[0], b[1], t[0], t[1]); } g.segs2(fl, '#C9C5BA', 0.4);
    K.cyl(g, x, y, 1.95, 33.4, 34.2, CH, { w: 0.55, n: 12 });
  }, { name: 'chimney' });
  chimney(-24, -21); chimney(5, -21); chimney(-24, 7); chimney(5, 7);
  // the glass lift up the north-east chimney
  T.actor({ sample: 0.5, period: 30, at(t) { const u = (t / 30) % 1, z = 16 + 18.2 * (u < 0.45 ? smooth(u / 0.45) : u < 0.55 ? 1 : 1 - smooth((u - 0.55) / 0.45)); return { x: 6.9, y: -19.6, z, key: 0 }; },
    draw(g) { const o = g.p(0, 0, 0); g.fill2([[o[0] - 1.8, o[1]], [o[0] + 1.8, o[1]], [o[0] + 1.8, o[1] - 6.4], [o[0] - 1.8, o[1] - 6.4]], 'rgba(207,224,232,0.92)', true); g.outline2([[o[0] - 1.8, o[1]], [o[0] + 1.8, o[1]], [o[0] + 1.8, o[1] - 6.4], [o[0] - 1.8, o[1] - 6.4]], { w: 0.45, c: '#3A3530', boil: false }); LK.bust2(g, [o[0] - 0.6, o[1] - 0.6], LK.who(7700), 0.55); LK.bust2(g, [o[0] + 0.8, o[1] - 0.4], LK.who(7701), 0.55); } });
  // the pig, floating over the chimneys on its long tether
  T.actor({ layer: 'top', grow: false, sample: 5, period: 12, at(t) { const f = Math.floor(t * 2) % 6; return { x: -8 + Math.sin(t * 0.5) * 1.2, y: -8, z: 42 + Math.sin(t * 0.8) * 0.8, key: f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), r = [0, 0.6, 1, 0.6, 0, -0.6][st.f] * 0.08, P = (u, v) => [o[0] + u * Math.cos(r) - v * Math.sin(r), o[1] + u * Math.sin(r) + v * Math.cos(r)];
      g.line2([P(0, 3.2), [o[0] + 4, o[1] + 120]], { w: 0.25, c: '#6B6458', boil: false, ext: 0 });
      const bd = K.curve([P(-8.4, 0), P(-7.0, -4.4), P(0, -5.6), P(6.4, -4.6), P(8.6, -1.4), P(7.6, 2.8), P(0, 4.0), P(-7.0, 3.0)], 3, true);
      g.fill2(bd, '#F2A9B6', true); g.fill2([P(-1, 3.6), P(7.4, 2.6), P(8.2, 0), P(4, 1.6)], '#E58C9C', true);
      g.fill2([P(8.2, -2.6), P(10.2, -2.4), P(10.2, 0.4), P(8.4, 0.6)], '#F2A9B6', true); g.disc2(P(9.6, -1.2), 0.3, '#B95B6E'); g.disc2(P(9.6, -0.2), 0.3, '#B95B6E'); g.disc2(P(6.2, -2.4), 0.35, '#2A2622');
      g.fill2([P(4.4, -4.8), P(5.2, -7.4), P(6.4, -4.6)], '#E58C9C', true);
      for (const u of [-5.6, -2.8, 2.8, 5.2]) g.fill2([P(u - 0.8, 3.0), P(u + 0.8, 3.0), P(u + 0.7, 5.6), P(u - 0.7, 5.6)], '#F2A9B6', true);
      g.line2([P(-8.4, 0), P(-10.4, -1.2), P(-11.0, -2.8), P(-9.8, -3.0)], { w: 0.5, c: '#E58C9C', boil: false, ext: 0 });
      g.line2(bd, { w: 0.5, c: '#B95B6E', close: true, boil: false }); } });

  /* ---------------- the terrace, the pub, the park ---------------- */
  T.obj([-37, 16, -28, 36], (g) => LK.terrace(g, -37, 16, -28, 36, { face: 'R', n: 4, st: 3, col: LK.C.stock, seed: 2, boxes: true }), { name: 'terrace' });
  T.obj([-37, 6, -28, 15], (g) => LK.pub(g, -37, 6, -28, 15, { st: 3, paint: '#2E3A5E', signCol: '#8E2F2F', name: 'THE PRINCE ALBERT', short: 'ALBERT' }), { name: 'pub' });
  T.obj([-26.5, 17, -25.5, 35], (g) => { const r = []; for (let y = 17; y <= 35; y += 0.8) { const a = g.p(-26, y, 0), b = g.p(-26, y, 1.6); r.push(a[0], a[1], b[0], b[1]); } g.segs2(r, '#2A2622', 0.35); g.line([[-26, 17, 1.6], [-26, 35, 1.6]], { w: 0.45, c: '#2A2622', boil: false }); }, { name: 'railings' });
  for (const [x, y, r] of [[12, 14, 5], [33, 14, 4.6], [10, 34, 4.4], [35, 24, 4.4]]) T.obj([x, y], (g) => LK.plane(g, x, y, { r }), { name: 'tree' });
  for (const [x, y] of [[-34, RS + 3], [-12, RS + 3], [12, RS + 3], [32, RS + 3]]) T.obj([x, y], (g) => LK.plane(g, x, y, { r: 4.0, h: 5.4 }), { name: 'river tree' });
  for (const x of [-22, 2, 24]) T.obj([x, RS + 5.4], (g) => LK.lamp(g, x, RS + 5.4), { name: 'lamp' });
  T.obj([-22, 30], (g) => LK.pillar(g, -22, 30), { name: 'pillar box' });
  T.obj([-16, 30.5], (g) => LK.phonebox(g, -16, 30.5), { name: 'phone box' });
  // the swings
  T.obj([20, 24, 28, 26], (g) => { const posts = []; for (const x of [20.4, 27.6]) for (const y of [24.2, 25.8]) { const a = g.p(x, y, 0), b = g.p(x, 25, 6); posts.push(a[0], a[1], b[0], b[1]); } g.segs2(posts, '#C8372D', 0.7); g.line([[20.4, 25, 6], [27.6, 25, 6]], { w: 0.8, c: '#C8372D', boil: false }); }, { name: 'swings' });
  for (const [x, ph, s] of [[22.4, 0, 7710], [25.6, 0.4, 7711]]) T.actor({ sample: 5, period: 10, at(t) { const f = Math.floor(((t * 0.45 + ph) % 1) * 8); return { x, y: 25, z: 0, key: f, f }; }, draw(g, st) { const a = Math.sin(st.f / 8 * TAU) * 0.6, sy = Math.sin(a) * 4.2, sz = 6 - Math.cos(a) * 4.2; for (const dx of [-0.6, 0.6]) g.line([[dx, 0, 6], [dx, sy, sz]], { w: 0.3, c: '#5A544C', boil: false, ext: 0 }); K.box(g, -0.8, sy - 0.4, 0.8, sy + 0.4, sz - 0.2, sz, '#3A3530', { w: 0.3, boil: false, nohid: true }); LK.person(g, 0, sy, sz, Object.assign(LK.who(s, { k: 0.72 }), { dir: 1, pose: 'sit' })); } });
  // the street-food stalls in front of the power station
  for (const [x, a, b] of [[-20, '#3F6B4E', '#F3F1EA'], [-12, '#C8372D', '#F3F1EA'], [-4, '#E6C24F', '#2A2622'], [4, '#3F5F8F', '#F3F1EA']]) T.obj([x - 2.4, 10, x + 2.4, 14], (g) => K.stall(g, x, 12, { face: 'L', L: 2.2, D: 1.6, a, b }), { name: 'stall' });

  /* ---------------- the living layer ---------------- */
  T.cast([-8, 17.4], (g) => { const P = [[-21, 15.6, 3], [-19, 16.4, 3], [-13, 15.8, 3], [-10.6, 16.8, 2], [-5, 15.6, 3], [-2.6, 16.6, 3], [3, 15.8, 3], [5.4, 16.8, 2], [-15, 18.6, 0], [0, 18.8, 1]]; P.forEach(([x, y, d], i) => LK.person(g, x, y, 0, (i % 4 === 3 ? LK.tourist : LK.who)(7720 + i, { dir: d, pose: i % 3 === 0 ? 'hold' : 'stand', k: i === 8 ? 0.74 : undefined }))); }, { on: true });
  T.cast([-26.4, 11], (g) => { for (const [x, y, d, s] of [[-26.6, 8.0, 0, 7740], [-25.4, 9.6, 1, 7741], [-26.2, 12.0, 0, 7742], [-24.8, 13.4, 1, 7743]]) LK.person(g, x, y, 0, LK.who(s, { dir: d, pose: 'hold', pint: s % 2 ? '#E9B53C' : '#B9443A' })); }, { on: true });
  T.cast([14, RS + 4], (g) => { K.bench(g, 14, RS + 3.2, { face: 'L', L: 2.2, col: '#5E7B5A' }); LK.person(g, 14.4, RS + 4.6, 1.3, LK.who(7750, { dir: 3, pose: 'sit', umb: '#3F6B4E' })); }, { on: true });
  T.cast([31, 30], (g) => { LK.person(g, 30, 29, 0, LK.who(7751, { dir: 1, pose: 'hold' })); LK.person(g, 31.6, 30.4, 0, LK.who(7752, { dir: 2, k: 0.7 })); }, { on: true });
  LK.walker(T, LK.who(7760, { shorts: true, bare: true, top: '#5FA58F' }), [[-36, RS + 4.8], [36, RS + 4.8]], 3.0, { phase: 0.2 });
  LK.walker(T, LK.who(7761, { dog: '#F3F1EA' }), [[36, RS + 2.6], [-36, RS + 2.6]], 1.2, { phase: 0.6 });
  LK.walker(T, LK.who(7762, { umb: '#E6C24F' }), [[-25, 20], [-25, 36], [6, 36]], 1.3, { phase: 0.4 });
  LK.walker(T, LK.tourist(7763), [[7.5, -22], [7.5, 10], [36, 10]], 1.4, { phase: 0.1 });
  LK.walker(T, LK.who(7764), [[16, 20], [34, 20]], 1.2, { phase: 0.7 });
});
