'use strict';
/* (-100,-100) Buckingham Palace and St James's Park, and the Changing of the Guard.
   What it is: the palace's long east front of pale Portland stone (rusticated ground floor, the central portico of
   columns, the famous balcony with its crimson-and-gold hangings, a balustrade along the roof, the Royal Standard
   flying), the forecourt behind black-and-gold railings with sentry boxes, the Victoria Memorial on its round island of
   red geraniums with the gilded Winged Victory on top, the Mall running east under plane trees and Union flags, St
   James's Park with its lake, the pelicans on their rock, ducks and the striped deckchairs, Green Park to the north,
   Wellington Barracks to the south.
   The clever moment (its own shot): the New Guard marches out from the barracks behind its band (drums, brass,
   bearskins, scarlet tunics), up Spur Road and into the forecourt, where the Old Guard waits facing it; the band plays;
   the Old Guard marches out behind the band and the New Guard takes its place. A 60 s cycle with identical uniforms,
   so the forecourt at the end looks as it did at the start; phased so the march is on as the shot cuts in.
   Who else: the crowd pressed against the railings and packed on the Memorial steps, a bobby, tourists on shoulders. */
SF.tile('palace', -100, -100, { rim: 4 }, function (T) {
  const H = 37, PS = { t: '#DCD5C3', l: '#ECE6D6', r: '#D2CAB6' }, GRASS = '#A9CC7E', WAT = '#A9C6C9', MALL = '#D7A090';
  const CG = 60, sh = SCENE.shots.find((s) => s.name === 'palace'), OFFG = sh ? 10 - sh.a / 30 : 0;
  const tcg = (t) => ((t + OFFG) % (2 * CG) + 2 * CG) % (2 * CG);
  T.ground(function (g) {
    LK.ground(g, -H, -H, H, H, '#E3DED2');
    // Green Park (north), St James's Park (south-east) with its lake, the Memorial gardens
    K.lawn(g, -8, -36, 36, -12, { col: GRASS, dens: 0.7 });
    K.lawn(g, -1, 5, 36, 36, { col: GRASS, dens: 0.7 });
    const lake = K.curve([[4, 12, 0], [16, 9, 0], [30, 11, 0], [34, 20, 0], [26, 28, 0], [12, 26, 0], [5, 20, 0]], 5, true);
    g.fill(lake.map((p) => [p[0], p[1], 0]), '#7FA0A3'); g.fill(lake.map((p) => [p[0] * 0.98 + 0.4, p[1] * 0.98 + 0.5, -0.05]), WAT);
    g.water(lake.map((p) => [p[0] * 0.92 + 1.5, p[1] * 0.9 + 2, -0.05]), { dens: 0.9, c: '#6F9093' }); g.outline(lake, { w: 0.6, c: '#5E7E7E', boil: false });
    // the Mall: a red road east from the Memorial, its pavements; the forecourt's gravel; Spur Road
    g.fill(K.rect(-1, -9.5, H, -0.5), '#E3DED2'); g.fill(K.rect(-1, -8, H, -2), MALL);
    g.scuff(K.rect(-1, -8, H, -2), { dir: Math.atan2(AY, AX), len: 6, c: '#E4B4A6', dens: 0.5, w: 0.5, spread: 0.05 });
    g.fill(K.rect(-25, -18, -12, 12), '#E4DCC6'); g.scuff(K.rect(-25, -18, -12, 12), { dir: -0.6, len: 1.6, c: '#F0EADB', dens: 0.9, w: 0.5 });
    g.fill(K.rect(-9.5, -12, -4.5, 28), '#E3DED2');
    // the Memorial island: a ring of red geraniums round the white steps
    const ring = (r, z) => { const p = []; for (let i = 0; i < 28; i++) { const a = TAU * i / 28; p.push([6 + Math.cos(a) * r, -5 + Math.sin(a) * r, z]); } return p; };
    g.fill(ring(11, 0), '#E1DCD0'); g.fill(ring(9.4, 0.01), '#86AE5E'); g.fill(ring(7.6, 0.02), '#E1DCD0');
    { const R = RNG(4), d = []; for (let i = 0; i < 110; i++) { const a = R() * TAU, rr = 7.9 + R() * 1.3, p = g.p(6 + Math.cos(a) * rr, -5 + Math.sin(a) * rr, 0.05); d.push(p); } for (const p of d) g.disc2(p, 0.65, '#D2392B'); }
    for (const [x, y, rx, ry] of [[-6, 16, 1.6, 0.8], [20, -3, 2.2, 0.8], [-16, 8, 1.4, 0.7], [-4, -14, 1.2, 0.6]]) LK.puddle(g, x, y, rx, ry, Math.round(x * 3 + y * 17 + 40));
  }, { rim: true });

  /* ---------------- the palace ---------------- */
  const front = (y0, y1, mid) => T.obj([-36, y0, -25, y1], function (g) {
    g.boilP = 0.25;
    const x0 = -36, x1 = -25, h = 12.5;
    K.box(g, x0, y0, x1, y1, 0, h, PS, { w: 0.9 });
    g.fill(K.on('R', x1 + 0.02, y0, y1, 0, 3.6), '#E2DBC8');
    const rs = []; for (let z = 0.9; z < 3.6; z += 0.9) { const a = g.p(x1 + 0.03, y0, z), b = g.p(x1 + 0.03, y1, z); rs.push(a[0], a[1], b[0], b[1]); } g.segs2(rs, '#BDB5A0', 0.3);
    for (let y = y0 + 1.2; y < y1 - 0.8; y += 2.1) { if (mid && Math.abs(y + 3) < 4.5) continue; K.win(g, 'R', x1 + 0.03, y, y + 0.9, 1.0, 2.8, { style: 'navy' }); K.win(g, 'R', x1 + 0.03, y, y + 0.9, 4.6, 7.2, { style: 'navy' }); K.win(g, 'R', x1 + 0.03, y, y + 0.9, 8.6, 10.6, { style: 'navy' }); }
    K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, h, h + 0.6, '#E6E0D0', { w: 0.55, nohid: true, boil: false });
    const bl = []; for (let y = y0; y <= y1; y += 0.7) { const a = g.p(x1 + 0.3, y, h + 0.6), b = g.p(x1 + 0.3, y, h + 1.5); bl.push(a[0], a[1], b[0], b[1]); } g.segs2(bl, '#C9C1AC', 0.45); g.line([[x1 + 0.3, y0, h + 1.5], [x1 + 0.3, y1, h + 1.5]], { w: 0.5, boil: false });
    if (mid) {
      // the central portico: a pediment over columns, the balcony with its crimson hangings
      K.box(g, x1, -9, x1 + 1.6, 3, 0, 4.4, PS, { w: 0.7, nohid: true });
      g.fill(K.on('R', x1 + 0.02, -9, 3, 4.4, h), '#7E7A70'); const col = []; for (let y = -8.4; y <= 2.5; y += 1.55) { const a = g.p(x1 + 1.62, y, 4.4), b = g.p(x1 + 1.62, y, h); col.push(a[0], a[1], b[0], b[1]); } g.segs2(col, '#F3EFE4', 2.6); g.segs2(col.map((v, i) => i % 2 ? v : v + 1.0), '#BDB5A0', 0.4);
      K.box(g, x1, -9, x1 + 1.6, 3, h, h + 1.2, PS, { w: 0.7, nohid: true }); const ped = [[x1 + 1.62, -9, h + 1.2], [x1 + 1.62, 3, h + 1.2], [x1 + 1.62, -3, h + 3.6]]; g.fill(ped, '#E6E0D0'); g.outline(ped, { w: 0.6, boil: false });
      K.box(g, x1 + 1.6, -6, x1 + 3.0, 0, 4.2, 4.6, '#E6E0D0', { w: 0.5, nohid: true });
      g.fill(K.on('R', x1 + 0.04, -5.0, -1.0, 4.6, 7.6), '#4A4E58'); g.fill(K.on('R', x1 + 3.02, -6, 0, 4.6, 5.6), '#B3262A');
      const fr = []; for (let y = -5.8; y < 0; y += 0.6) { const a = g.p(x1 + 3.04, y, 4.6), b = g.p(x1 + 3.04, y + 0.3, 5.2); fr.push(a[0], a[1], b[0], b[1]); } g.segs2(fr, '#E0B54A', 0.45);
      const bal = []; for (let y = -6; y <= 0; y += 0.5) { const a = g.p(x1 + 3.0, y, 4.6), b = g.p(x1 + 3.0, y, 5.7); bal.push(a[0], a[1], b[0], b[1]); } g.segs2(bal, '#E6E0D0', 0.4);
      LK.pole(g, -30.5, -3, h + 1.5, 7);
    }
  }, { name: 'palace' });
  front(-27, -10); front(-10, 4, true); front(4, 20);
  LK.flag(T, -30.5, -3, 12.5 + 1.5 + 7, { L: 4.6, H: 2.6, kind: 'standard', ph: 0.1 });
  // the forecourt railings: black bars with gold tips, gates (gaps) at y -8 and y 2
  const rail = (y0, y1) => T.obj([-12.4, y0, -11.8, y1], (g) => {
    const b = []; for (let y = y0; y <= y1 + 0.01; y += 0.6) { const p = g.p(-12.1, y, 0), q = g.p(-12.1, y, 3.4); b.push(p[0], p[1], q[0], q[1]); } g.segs2(b, '#1E1C1A', 0.45);
    const tips = []; for (let y = y0; y <= y1 + 0.01; y += 0.6) { const q = g.p(-12.1, y, 3.4); tips.push(q); } for (const q of tips) g.disc2([q[0], q[1] - 0.2], 0.35, '#D9A93E');
    g.line([[-12.1, y0, 1.0], [-12.1, y1, 1.0]], { w: 0.4, c: '#1E1C1A', boil: false }); g.line([[-12.1, y0, 3.0], [-12.1, y1, 3.0]], { w: 0.45, c: '#1E1C1A', boil: false });
    for (const y of [y0, y1]) { const p = g.p(-12.1, y, 0), q = g.p(-12.1, y, 5.2); g.line2([p, q], { w: 1.2, c: '#1E1C1A', boil: false, ext: 0 }); g.disc2([q[0], q[1] - 0.6], 0.8, '#D9A93E'); }
  }, { name: 'railings' });
  rail(-18, -10.2); rail(-5.8, -0.2); rail(4.2, 12);
  // two sentry boxes in front of the palace with their guards
  for (const y of [-14, 8]) T.obj([-24.4, y - 0.9, -22.6, y + 0.9], (g) => { K.box(g, -24.4, y - 0.9, -22.6, y + 0.9, 0, 7.6, { t: '#C9C1AC', l: '#E6E0D0', r: '#C9C1AC' }, { w: 0.55 }); g.fill(K.on('R', -22.58, y - 0.6, y + 0.6, 0, 6.6), '#3A3530'); K.gable(g, -24.6, y - 1.1, -22.4, y + 1.1, 7.6, 1.2, 'y', '#C9C1AC', { w: 0.5 }); LK.person(g, -22.9, y, 0, LK.guard(60 + y, { dir: 0, rifle: true })); }, { name: 'sentry' });

  /* ---------------- the Victoria Memorial ---------------- */
  T.obj([0, -11, 12, 1], function (g) {
    g.boilP = 0.3;
    const cx = 6, cy = -5, W = { t: '#F3F1EA', l: '#F6F4EE', r: '#DCD8CE' };
    K.cyl(g, cx, cy, 6.6, 0, 0.9, W, { w: 0.6, n: 20 }); K.cyl(g, cx, cy, 5.6, 0.9, 1.8, W, { w: 0.6, n: 20 }); K.cyl(g, cx, cy, 4.6, 1.8, 2.7, W, { w: 0.6, n: 20 });
    K.box(g, cx - 2.4, cy - 2.4, cx + 2.4, cy + 2.4, 2.7, 9.5, W, { w: 0.8 });
    const st = g.p(cx + 1.6, cy + 2.45, 2.7); g.fill2([[st[0] - 2.2, st[1]], [st[0] + 2.2, st[1]], [st[0] + 1.6, st[1] - 7.2], [st[0], st[1] - 8.8], [st[0] - 1.6, st[1] - 7.2]], '#E9E6DE', true); g.outline2([[st[0] - 2.2, st[1]], [st[0] - 1.6, st[1] - 7.2], [st[0], st[1] - 8.8], [st[0] + 1.6, st[1] - 7.2], [st[0] + 2.2, st[1]]], { w: 0.45, boil: false });
    K.cyl(g, cx, cy, 1.4, 9.5, 12.2, W, { w: 0.6, n: 10 });
    // the gilded Winged Victory
    const v = g.p(cx, cy, 12.2), V = (u, w) => [v[0] + u, v[1] + w];
    g.fill2([V(-1.0, 0), V(1.0, 0), V(0.7, -4.4), V(0, -6.0), V(-0.7, -4.4)], '#E0B54A', true);
    g.fill2([V(-0.4, -4.8), V(-4.6, -9.4), V(-3.6, -6.0), V(-1.0, -3.6)], '#D9A93E', true); g.fill2([V(0.4, -4.8), V(4.6, -9.4), V(3.6, -6.0), V(1.0, -3.6)], '#C9993A', true);
    g.disc2(V(0, -6.6), 0.8, '#E0B54A'); g.line2([V(0.6, -5.0), V(1.6, -8.2)], { w: 0.4, c: '#C9993A', boil: false, ext: 0 });
    g.line2([V(-1.0, 0), V(-0.7, -4.4), V(0, -6.0), V(0.7, -4.4), V(1.0, 0)], { w: 0.35, c: '#8A6A2A', boil: false });
  }, { name: 'memorial' });

  /* ---------------- the barracks, the Mall's trees and flags, the park ---------------- */
  T.obj([-24, 28, 2, 36], (g) => {
    const W = { t: '#E2DCCB', l: '#EEE9DC', r: '#D6CFBC' }; K.box(g, -24, 28, 2, 36, 0, 8.2, W, { w: 0.85 });
    for (let x = -22.6; x < 1; x += 2.2) { K.win(g, 'L', 36.02, x, x + 1.0, 1.2, 3.2, { style: 'navy' }); K.win(g, 'L', 36.02, x, x + 1.0, 4.4, 6.6, { style: 'navy' }); }
    K.box(g, -13, 35.6, -7, 36.8, 0, 9.6, W, { w: 0.6, nohid: true }); const pd = [[-13, 36.8, 9.6], [-7, 36.8, 9.6], [-10, 36.8, 11.4]]; g.fill(pd, '#E6E0D0'); g.outline(pd, { w: 0.5, boil: false });
    K.box(g, -24.2, 27.8, 2.2, 36.2, 8.2, 8.8, '#E2DCCB', { w: 0.5, nohid: true });
  }, { name: 'barracks' });
  for (let x = 19; x < 36; x += 6.5) for (const y of [-10.6, 0.6]) T.obj([x, y], (g) => LK.plane(g, x, y, { r: 3.6, h: 5.4 }), { name: 'mall tree' });
  for (let x = 22.2; x < 36; x += 6.5) for (const y of [-9.2, -0.8]) { T.obj([x, y], (g) => LK.pole(g, x, y, 0, 8), { name: 'flagpole' }); LK.flag(T, x, y, 8, { L: 2.6, H: 1.5, ph: x * 0.05 + y * 0.02 }); }
  for (const [x, y, r] of [[-4, -30, 5], [10, -26, 5.6], [24, -32, 5], [30, -18, 4.6], [12, -16, 4.2], [-2, 34, 4.6], [32, 33, 5], [20, 33, 4.4], [36, 6, 4], [-34, 30, 4.6], [-34, -33, 4.6]]) T.obj([x, y], (g) => LK.plane(g, x, y, { r, col: x > 25 && y > 25 ? '#8FB868' : '#93BC6A' }), { name: 'tree' });
  // the pelicans' rock, the Blue Bridge over the lake
  T.obj([22, 15, 27, 19], (g) => { const c = g.p(24.5, 17, -0.1); g.fill2(arcPts(c[0], c[1], 9, Math.PI, TAU, 10).concat([[c[0] + 9, c[1] + 1.5], [c[0] - 9, c[1] + 1.5]]), '#9A938A', true); g.outline2(arcPts(c[0], c[1], 9, Math.PI, TAU, 10), { w: 0.5, boil: false }); for (const [dx, dy, f] of [[-4, -2, 1], [1, -3.4, -1], [4.5, -1.6, 1]]) { const p = [c[0] + dx, c[1] + dy]; g.fill2([[p[0] - 2.6 * f, p[1] - 1.4], [p[0] + 1.6 * f, p[1] - 2.6], [p[0] + 2.2 * f, p[1] - 0.6], [p[0] - 1.8 * f, p[1]]], '#F6F4EE', true); g.line2([[p[0] + 1.4 * f, p[1] - 2.4], [p[0] + 1.8 * f, p[1] - 5.6]], { w: 0.9, c: '#F6F4EE', boil: false, ext: 0 }); g.disc2([p[0] + 1.9 * f, p[1] - 5.9], 0.75, '#F6F4EE'); g.fill2([[p[0] + 2.2 * f, p[1] - 6.0], [p[0] + 5.6 * f, p[1] - 5.0], [p[0] + 2.4 * f, p[1] - 4.6]], '#E8A23A', true); g.outline2([[p[0] - 2.6 * f, p[1] - 1.4], [p[0] + 1.6 * f, p[1] - 2.6], [p[0] + 2.2 * f, p[1] - 0.6], [p[0] - 1.8 * f, p[1]]], { w: 0.3, c: '#8E897E', boil: false }); } }, { name: 'pelicans' });
  T.obj([12, 9, 14.5, 27], (g) => { K.box(g, 12, 9, 14.5, 27, 0.6, 1.1, { t: '#C9D6E0', l: '#8FB0CC', r: '#6E92B2' }, { w: 0.5 }); const r = []; for (const x of [12.1, 14.4]) { for (let y = 9; y <= 27; y += 0.9) { const a = g.p(x, y, 1.1), b = g.p(x, y, 2.2); r.push(a[0], a[1], b[0], b[1]); } } g.segs2(r, '#4E6E8C', 0.3); g.line([[14.4, 9, 2.2], [14.4, 27, 2.2]], { w: 0.4, c: '#4E6E8C', boil: false }); }, { name: 'blue bridge' });
  // deckchairs: green-and-white striped canvas on wooden frames, people lounging
  const chair = (g, x, y, who, f) => { const p = g.p(x, y, 0), s = f; const fr = [[p[0] - 1.6 * s, p[1]], [p[0] + 1.6 * s, p[1] - 0.6], [p[0] + 2.0 * s, p[1] - 5.2], [p[0] - 0.4 * s, p[1] - 4.6]]; g.fill2(fr, '#3F7F4F', true); for (let i = 1; i < 4; i++) { const t = i / 4; g.fill2([[lerp(fr[0][0], fr[1][0], t), lerp(fr[0][1], fr[1][1], t)], [lerp(fr[0][0], fr[1][0], t + 0.12), lerp(fr[0][1], fr[1][1], t + 0.12)], [lerp(fr[3][0], fr[2][0], t + 0.12), lerp(fr[3][1], fr[2][1], t + 0.12)], [lerp(fr[3][0], fr[2][0], t), lerp(fr[3][1], fr[2][1], t)]], '#F3F1EA', true); } g.line2([fr[0], fr[3]], { w: 0.4, c: '#7A5A3C', boil: false }); g.line2([fr[1], fr[2]], { w: 0.4, c: '#7A5A3C', boil: false }); if (who) LK.person(g, x + 0.4, y + 0.3, 1.0, Object.assign({}, who, { pose: 'sit', dir: f > 0 ? 1 : 0 })); };
  T.cast([18, -22], (g) => { chair(g, 16, -23, LK.who(4100), 1); chair(g, 19, -21.6, LK.who(4101, { umb: undefined }), 1); chair(g, 22.5, -23.4, null, 1); chair(g, 26, -19.6, LK.who(4102), -1); }, { on: true });
  T.cast([8, 31], (g) => { chair(g, 6, 30, LK.who(4103), 1); chair(g, 9.4, 31.4, LK.who(4104), 1); chair(g, 28, 30.4, LK.who(4105), -1); }, { on: true });

  /* ---------------- the crowd ---------------- */
  // pressed against the railings (seen from behind), packed on the Memorial steps, along the Mall
  T.cast([-10.4, -2], (g) => { const R = RNG(51); const spots = []; for (let y = -17.6; y < 11.6; y += 1.35) { if (y > -10.4 && y < -6) continue; if (y > -0.4 && y < 4.2) continue; spots.push([-10.6 + (R() - 0.5) * 0.6, y]); spots.push([-9.2 + (R() - 0.5) * 0.6, y + 0.6]); }
    spots.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])).forEach(([x, y], i) => LK.person(g, x, y, 0, (i % 5 === 0 ? LK.tourist : LK.who)(4200 + i, { dir: 2, pose: i % 6 === 2 ? 'hold' : i % 9 === 4 ? 'wave' : 'stand', phone: i % 6 === 2, ph: 0.25, k: i % 11 === 3 ? 0.75 : undefined }))); }, { on: true });
  for (let i = 0; i < 26; i++) { const a = TAU * i / 26 + 0.12, r = 5.2 + (i % 2) * 1.0, x = 6 + Math.cos(a) * r, y = -5 + Math.sin(a) * r; if (x - 6 > 3.5 && y + 5 > -1) continue; const z = 0.9 + (i % 2 ? 0 : 0.9); T.cast([x, y], (g) => LK.person(g, x, y, z, LK.tourist(4300 + i, { dir: Math.cos(a) < -0.3 ? 2 : 3, pose: i % 4 === 1 ? 'hold' : 'stand', phone: i % 4 === 1 })), { bias: Math.cos(a) + Math.sin(a) > 0 ? 3 : -3 }); }
  T.cast([12, -9.4], (g) => { for (let i = 0; i < 8; i++) LK.person(g, 8 + i * 3.1, -9.6 + (i % 2) * 0.4, 0, LK.who(4400 + i, { dir: 3, pose: i % 3 === 0 ? 'hold' : 'stand', phone: i % 3 === 0, umb: i === 5 ? '#26314F' : undefined })); }, { on: true });
  LK.stand(T, -7.6, 13.5, LK.bobby(52, { dir: 3 }));
  LK.stand(T, -1.8, -11.6, LK.bobby(53, { dir: 2 }));

  /* ---------------- the Changing of the Guard ---------------- */
  // routes: the band up Spur Road (x -3); the guards up Spur Road (x -6) and into the forecourt along y 2; the line
  // in the forecourt at y -8 (x -24.4 .. -12.4); the way out along y -8 and down Spur Road
  const V = 2.0, GAP = 1.5, NG = 9, NB = 6;
  const along = (pts, s) => { let d = s; for (let i = 0; i + 1 < pts.length; i++) { const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d <= L || i === pts.length - 2) { const u = clamp(d / L, 0, 1); return { x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u, dx: b[0] - a[0], dy: b[1] - a[1] }; } d -= L; } return null; };
  const len = (pts) => { let L = 0; for (let i = 0; i + 1 < pts.length; i++) L += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); return L; };
  const dirOf = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3);
  const R_BAND_IN = [[-7.5, 27.5], [-7.5, -8.5]], R_BAND_OUT = [[-7.5, -8.5], [-7.5, 27.5]];
  const R_IN = [[-6, 27.5], [-6, 2], [-24.4, 2]], R_OUT = [[-24.4, -8], [-6, -8], [-6, 27.5]];
  const T_BAND = 0, T_IN = 2.5, T_OUT = 30, T_BAND_OUT = 29, T_SHUF = 38.5;
  const marching = (route, t0, sLead, k) => { const s = sLead - k * GAP; if (s < 0) return null; const p = along(route, s); return p; };
  // a guard: group gi (0 or 1), place k (0 = officer at the head)
  for (let gi = 0; gi < 2; gi++) for (let k = 0; k < NG; k++) {
    const look = k === 0 ? LK.guard(70 + gi * 13, { rifle: false, sword: true, belt: '#D9A93E' }) : LK.guard(80 + k, {});
    T.actor({ sample: 0.3, period: 2 * CG,
      at(t) {
        const tt = tcg(t), n = Math.floor(tt / CG), tc = tt - n * CG, isNew = (n % 2) === gi;      // this cycle the group arrives (new) or leaves (old)
        let p = null, dir = 1, walk = false, s = 0;
        if (isNew) {
          const L = len(R_IN), sl = Math.min(L, V * (tc - T_IN));
          if (tc < T_IN) return null;
          if (tc < T_SHUF || true) {
            const sk = sl - k * GAP; if (sk < 0) return null;
            const q = along(R_IN, Math.min(sk, L - k * GAP)); p = q; dir = dirOf(q.dx, q.dy); walk = sl < L; s = sk;
            if (!walk) dir = 3;
            if (tc >= T_SHUF) { const u = Math.min(10, V * (tc - T_SHUF)); p = { x: q.x, y: 2 - u }; walk = u < 10; dir = walk ? 3 : 1; s = u; }
          }
        } else {
          if (tc < T_OUT) { p = { x: -24.4 + k * GAP, y: -8 }; dir = 1; }
          else { const L = len(R_OUT), sk = k * GAP + V * (tc - T_OUT); if (sk > L) return null; const q = along(R_OUT, sk); p = q; dir = dirOf(q.dx, q.dy); walk = true; s = sk; }
        }
        if (!p) return null;
        const ph = walk ? Math.floor((s / 2.4) % 1 * 8) : 0;
        return { x: p.x, y: p.y, key: (walk ? 'w' : 's') + dir + '.' + ph, dir, walk, ph: ph / 8 };
      },
      draw(g, st) { const r = LK.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.walk ? 'walk' : 'stand', ph: st.ph })); if (look.sword) { const h = r.hands[0]; g.line2([h, [h[0] + (st.dir === 0 || st.dir === 3 ? 1 : -1) * 0.8, h[1] - 6.5]], { w: 0.4, c: '#D9DDE0', boil: false, ext: 0 }); } } });
  }
  // the band: drums and brass, playing in step
  for (let k = 0; k < NB; k++) {
    const look = LK.bandsman(90 + k, k % 3 === 0 ? 'drum' : 'brass', {});
    T.actor({ sample: 0.3, period: CG,
      at(t) {
        const tc = tcg(t) % CG; let p, dir, walk, s;
        const Lin = len(R_BAND_IN), slIn = V * (tc - T_BAND);
        if (tc < T_BAND_OUT) { const sk = Math.min(slIn, Lin) - k * GAP; if (sk < 0) return null; p = along(R_BAND_IN, sk); walk = slIn < Lin; dir = walk ? 3 : 2; s = sk; }
        else { const sk = k * GAP + V * (tc - T_BAND_OUT); if (sk > len(R_BAND_OUT)) return null; p = along(R_BAND_OUT, sk); walk = true; dir = 1; s = sk; }
        const ph = walk ? Math.floor((s / 2.4) % 1 * 8) : Math.floor(tc * 4) % 2 * 2;
        return { x: p.x, y: p.y, key: (walk ? 'w' : 'p') + dir + '.' + ph, dir, walk, ph: ph / 8 };
      },
      draw(g, st) { LK.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.walk ? 'walk' : 'hold', ph: st.ph })); } });
  }

  // walkers in the parks
  LK.walker(T, LK.who(4500, { dog: '#3A3128' }), [[0, 30], [0, 6], [36, 6]], 1.3, { phase: 0.2 });
  LK.walker(T, LK.who(4501), [[36, -14], [-6, -14], [-6, -34]], 1.4, { phase: 0.5 });
  LK.walker(T, LK.tourist(4502), [[36, -4.8], [-1, -4.8]], 1.5, { phase: 0.3 });
  LK.walker(T, LK.who(4503, { umb: '#C8372D' }), [[2, -10.2], [36, -10.2]], 1.3, { phase: 0.7 });
  LK.walker(T, LK.who(4504), [[10, 34], [34, 34]], 1.2, { phase: 0.4 });
  // ducks on the lake
  for (let i = 0; i < 4; i++) T.actor({ sample: 0.4, period: 40, at(t) { const a = t / 40 * TAU + i * 1.6; return { x: 18 + Math.cos(a) * (7 + i), y: 19 + Math.sin(a) * 4, key: Math.cos(a + Math.PI / 2) > 0 ? 1 : -1, f: Math.cos(a + Math.PI / 2) > 0 ? 1 : -1 }; }, draw(g, st) { const o = g.p(0, 0, 0), f = st.f; g.fill2([[o[0] - 1.4 * f, o[1] - 0.6], [o[0] + 1.0 * f, o[1] - 0.8], [o[0] + 1.4 * f, o[1]], [o[0] - 1.2 * f, o[1] + 0.2]], '#8E7A5A', true); g.disc2([o[0] + 1.1 * f, o[1] - 1.4], 0.6, '#3F6B4E'); g.fill2([[o[0] + 1.5 * f, o[1] - 1.5], [o[0] + 2.3 * f, o[1] - 1.2], [o[0] + 1.5 * f, o[1] - 1.1]], '#E6C24F', true); } });
});
