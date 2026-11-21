'use strict';
/* (-100,100) The Sumida in cherry-blossom week. The river runs along x below stone embankments; a red arch bridge
   crosses it on three shallow vermilion arches, high enough for the pleasure boats (yakatabune, a house on a hull,
   shōji windows, a row of red lanterns) to pass under. Sakura line the far bank with strings of paper lanterns between
   them, and under them people sit on blue tarps: bento, beer, a salaryman singing with his tie round his head. The near
   bank is a low lawn with more picnics so the water stays in view. Petals drift down. */
SF.tile('sumida', -100, 100, { rim: 12 }, function (T) {
  const H = 37, RY0 = -10, RY1 = 4, WZ = -1.6, BX0 = 13, BX1 = 21, DZ = 4.2;
  T.ground(function (g) {
    K.slab(g, H, { top: '#C9DBA5' });
    g.grass(K.rect(-H, -H, H, RY0 - 4), { dens: 0.7 }); g.grass(K.rect(-H, RY1 + 4.5, H, H), { dens: 0.7 });
    // the far bank's wall face, then the water, then the near bank laid over the water's near edge
    g.fill([[-H, RY0, 0], [H, RY0, 0], [H, RY0, WZ], [-H, RY0, WZ]], '#BDB7A8');
    const st = []; for (let x = -H + 1.5; x < H; x += 2.6) { const a = g.p(x, RY0, -0.1), b = g.p(x, RY0, WZ + 0.1); st.push(a[0], a[1], b[0], b[1]); } g.segs2(st, '#9E988A', 0.35);
    const w = K.rect(-H, RY0, H, RY1 + 1.2, WZ); g.fill(w, C.water); g.water(K.rect(-H, RY0 + 0.6, H, RY1, WZ), { dens: 1.0 });
    for (let k = 0; k < 40; k++) { const p = g.p(-H + 2 + (k * 37 % 72), RY0 + 1 + (k * 13 % 12), WZ); g.fill2([[p[0] - 0.5, p[1]], [p[0], p[1] - 0.35], [p[0] + 0.5, p[1]], [p[0], p[1] + 0.35]], '#F6C9D3', true); }
    g.fill(K.rect(-H, RY1, H, RY1 + 4.5), '#E6E1D5'); g.line([[-H, RY1, 0], [H, RY1, 0]], { w: 0.8, boil: false });
    g.line([[-H, RY0, 0], [H, RY0, 0]], { w: 0.8, boil: false }); g.line([[-H, RY0, WZ], [H, RY0, WZ]], { w: 0.5, c: '#5F7F9C', boil: false });
    // the far promenade
    g.fill(K.rect(-H, RY0 - 4, H, RY0), '#E6E1D5'); g.scuff(K.rect(-H, RY0 - 4, H, RY0), { dir: Math.atan2(AY, AX), len: 5, c: '#D3CDBE', dens: 0.6, w: 0.5, spread: 0.05 });
    g.scuff(K.rect(-H, RY1, H, RY1 + 4.5), { dir: Math.atan2(AY, AX), len: 5, c: '#D3CDBE', dens: 0.6, w: 0.5, spread: 0.05 });
    // pink petals in the grass
    for (const q of [K.rect(-H, -H, H, RY0 - 4), K.rect(-H, RY1 + 4.5, H, 24)]) g.scuff(q, { dir: 0, len: 0.8, c: '#F2C6D0', dens: 0.9, w: 0.7, spread: 3 });
  }, { rim: true });

  /* ---------------- the red bridge ---------------- */
  const RED = { t: '#D86A55', l: '#C9463E', r: '#AE3A32' }, DECK = { t: '#CFC9BC', l: '#E3DED2', r: '#C9C3B4' };
  // approach ramps on both banks (objects: people walk up them)
  T.obj([BX0, RY0 - 11, BX1, RY0], function (g) {
    const q = [[BX0, RY0 - 11, 0], [BX1, RY0 - 11, 0], [BX1, RY0, DZ], [BX0, RY0, DZ]]; g.fill(q, DECK.t);
    g.fill([[BX1, RY0 - 11, 0], [BX1, RY0, DZ], [BX1, RY0, 0]], DECK.r); g.outline(q, { w: 0.7, boil: false });
  }, { name: 'ramp far' });
  T.obj([BX0 - 0.5, RY0, BX1 + 0.5, RY1], function (g) {
    g.boilP = 0.4;
    K.box(g, BX0, RY0, BX1, RY1, DZ - 0.7, DZ, DECK, { w: 0.8 });
    // three shallow vermilion arches under the deck on the side we see, piers between them
    const n = 3, sp = (RY1 - RY0) / n;
    for (let i = 0; i < n; i++) {
      const a0 = RY0 + i * sp, a1 = a0 + sp, pts = [], top = [];
      for (let k = 0; k <= 10; k++) { const t = k / 10, y = lerp(a0, a1, t), z = DZ - 0.7 - 2.6 * (1 - Math.sin(Math.PI * t)); pts.push([BX1 + 0.05, y, z]); top.push([BX1 + 0.05, y, DZ - 0.7]); }
      g.fill(pts.concat(top.slice().reverse()), RED.r);
      g.line(pts, { w: 0.9, c: '#7A2A22', boil: false });
      const ribs = []; for (let k = 1; k < 10; k++) { const p0 = g.p.apply(g, pts[k]), p1 = g.p.apply(g, top[k]); ribs.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(ribs, '#8A2F26', 0.35);
    }
    for (let i = 1; i < n; i++) { const y = RY0 + i * sp; K.box(g, BX0 + 0.4, y - 0.5, BX1 - 0.4, y + 0.5, WZ, DZ - 3.0, { t: '#C9C3B4', l: '#BDB7A8', r: '#A9A296' }, { w: 0.6 }); }
    // railings: red posts and a top rail on both edges
    for (const x of [BX0 + 0.25, BX1 - 0.25]) { const po = []; for (let y = RY0 + 0.4; y < RY1; y += 1.4) { const a = g.p(x, y, DZ), b = g.p(x, y, DZ + 1.4); po.push(a[0], a[1], b[0], b[1]); } g.segs2(po, '#C9463E', 0.5); g.line([[x, RY0, DZ + 1.4], [x, RY1, DZ + 1.4]], { w: 0.7, c: '#9A3A30', boil: false }); }
    for (const y of [RY0 + 0.2, RY1 - 0.2]) for (const x of [BX0 + 0.25, BX1 - 0.25]) { const b = g.p(x, y, DZ), t = g.p(x, y, DZ + 5.4); g.line2([b, t], { w: 0.65, c: '#3A3530', boil: false }); TK.lantern2(g, [t[0], t[1] + 1.2], 1.3, '#F6F1E4'); }
  }, { name: 'bridge span', under: DZ - 0.8 });
  T.obj([BX0, RY1, BX1, RY1 + 11], function (g) {
    const q = [[BX0, RY1, DZ], [BX1, RY1, DZ], [BX1, RY1 + 11, 0], [BX0, RY1 + 11, 0]]; g.fill(q, DECK.t);
    g.fill([[BX1, RY1, DZ], [BX1, RY1 + 11, 0], [BX1, RY1, 0]], DECK.r); g.fill([[BX0, RY1 + 11, 0], [BX1, RY1 + 11, 0], [BX1, RY1 + 11, 0.05], [BX0, RY1 + 11, 0.05]], DECK.l);
    g.outline(q, { w: 0.7, boil: false });
    for (const x of [BX0 + 0.25, BX1 - 0.25]) g.line([[x, RY1, DZ + 1.4], [x, RY1 + 11, 1.4]], { w: 0.7, c: '#9A3A30', boil: false });
  }, { name: 'ramp near' });

  /* ---------------- sakura, lanterns, tarps ---------------- */
  const FAR = [[-33, -29], [-25, -28.5], [-17, -29.2], [-9, -28.6], [-1, -29.4], [6, -28.8], [27, -29], [34, -28.4]];
  FAR.forEach(([x, y], i) => T.obj([x, y], (g) => TK.sakura(g, x, y, { r: 5.2 + (i % 3) * 0.5, seed: 70 + i }), { on: true }));
  for (const [x, y] of [[-33, 27], [33, 22], [28, 30]]) T.obj([x, y], (g) => TK.sakura(g, x, y, { r: 4.8, seed: 90 + x }), { on: true });
  // strings of paper lanterns hung between the far trees along the promenade
  T.obj([-34, -26.2, 35, -25.4], function (g) {
    for (let i = 0; i + 1 < FAR.length; i++) { if (FAR[i + 1][0] - FAR[i][0] > 12) continue; const a = g.p(FAR[i][0] + 1, -25.8, 7.4), b = g.p(FAR[i + 1][0] - 1, -25.8, 7.4); TK.lanternString2(g, a, b, 4, ['#F6F1E4', '#F2C6D0', '#F6F1E4', '#E07A6A'], 3); }
  }, { name: 'lanterns', bias: 1 });

  const picnic = (cx, cy, w, d, seed, n) => T.cast([cx, cy], function (g) {
    TK.tarp(g, [[cx - w, cy - d, 0.04], [cx + w, cy - d, 0.04], [cx + w, cy + d, 0.04], [cx - w, cy + d, 0.04]]);
    const R = RNG(seed);
    // bento boxes, cans, a bottle in the middle
    for (let k = 0; k < 4; k++) { const p = g.p(cx - w * 0.4 + R() * w * 0.8, cy - d * 0.3 + R() * d * 0.6, 0.1); g.fill2([[p[0] - 1.1, p[1]], [p[0], p[1] - 0.6], [p[0] + 1.1, p[1]], [p[0], p[1] + 0.6]], R.pick(['#C9463E', '#2E2A26', '#E6C24F']), true); }
    for (let k = 0; k < 3; k++) { const p = g.p(cx - w * 0.3 + R() * w * 0.6, cy + R() * d * 0.5 - d * 0.25, 0.1); g.fill2([[p[0] - 0.35, p[1]], [p[0] + 0.35, p[1]], [p[0] + 0.35, p[1] - 1.2], [p[0] - 0.35, p[1] - 1.2]], R.pick(['#D9DCDC', '#E6C24F', '#C9463E']), true); }
    // people round it, the far side facing us
    const seats = []; for (let k = 0; k < n; k++) { const side = k % 4; const t = (Math.floor(k / 4) + 0.5) / Math.ceil(n / 4); seats.push(side === 0 ? [cx - w + t * 2 * w, cy - d - 0.4, 1] : side === 1 ? [cx + w + 0.4, cy - d + t * 2 * d, 2] : side === 2 ? [cx + w - t * 2 * w, cy + d + 0.4, 3] : [cx - w - 0.4, cy + d - t * 2 * d, 0]); }
    seats.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
    seats.forEach(([x, y, dir], k) => { const w2 = (k % 3 === 0 ? TK.salary : k % 3 === 1 ? TK.who : TK.kimono)(seed * 10 + k, { dir, pose: 'sit' }); TK.person(g, x, y, 0, w2); });
  }, { on: true });
  picnic(-29, -20.5, 3.4, 2.4, 21, 6); picnic(-13, -21, 3.0, 2.2, 22, 5); picnic(2, -20.5, 3.6, 2.4, 23, 6); picnic(30, -21, 3.0, 2.2, 24, 5);
  picnic(-26, 14, 3.2, 2.4, 25, 5); picnic(-4, 15, 3.6, 2.6, 26, 6); picnic(29, 13, 3.0, 2.2, 27, 4);
  // the singer: standing, tie round his head, one arm up
  T.cast([-6.5, -17.5], (g) => { const r = TK.person(g, -6.5, -17.5, 0, TK.salary(2801, { dir: 1, pose: 'cheer', ph: 0.25 })); const c = r.crown; g.fill2([[c[0] - 2.0, c[1] + 1.4], [c[0] + 2.0, c[1] + 1.4], [c[0] + 2.0, c[1] + 2.2], [c[0] - 2.0, c[1] + 2.2]], '#C9584B', true); g.fill2([[c[0] + 1.8, c[1] + 1.6], [c[0] + 3.4, c[1] + 0.6], [c[0] + 3.0, c[1] + 2.4]], '#C9584B', true); }, { on: true });

  /* ---------------- moving things ---------------- */
  // two yakatabune, one each way; z on the water
  [[1, -5.6, 0, 0], [-1, 0.2, 0.55, 1]].forEach(([dir, y, ph, k]) => T.actor({ sample: 0.3, period: 30, grow: false,
    at(t) { const u = ((t / 30) + ph) % 1, x = dir > 0 ? -40 + u * 80 : 40 - u * 80, a = Math.min(1, Math.min(u, 1 - u) * 12); return { x: x + 3.1, y, z: WZ, key: k, alpha: a < 1 ? a : null }; },
    draw(g, st) { g.at(-3.1, 0, 0, (g2) => TK.yakata(g2, dir > 0 ? 0 : Math.PI, {})); } }));   // anchored at the end nearest us
  // walkers on both promenades and over the bridge
  for (let i = 0; i < 6; i++) { const y = i < 3 ? RY0 - 2.6 + i * 0.7 : RY1 + 1.4 + (i - 3) * 0.8, look = i % 2 ? TK.kimono(2810 + i) : TK.who(2810 + i, i === 2 ? { phone: true } : {}); K.walker(T, look, [[-34, y], [34, y]], 1.6 + (i % 3) * 0.4, { phase: (i * 0.31) % 1 }); }
  K.walker(T, TK.who(2830), [[17, RY0 - 11], [17, RY1 + 11]], 1.8, { z: (x, y) => y < RY0 ? DZ * clamp((y - (RY0 - 11)) / 11, 0, 1) : y > RY1 ? DZ * clamp(1 - (y - RY1) / 11, 0, 1) : DZ });
  K.walker(T, TK.kimono(2831), [[18.6, RY1 + 11], [18.6, RY0 - 11]], 1.5, { phase: 0.4, z: (x, y) => y < RY0 ? DZ * clamp((y - (RY0 - 11)) / 11, 0, 1) : y > RY1 ? DZ * clamp(1 - (y - RY1) / 11, 0, 1) : DZ });
  // petals drifting down: small groups that fall slowly and sway
  for (let i = 0; i < 5; i++) T.actor({ layer: 'top', sample: 5, period: 10, grow: false,
    at(t) { const u = ((t * 0.12 + i * 0.21) % 1), f = Math.floor(t * 6 + i) % 6; return { x: -30 + i * 14 + u * 6, y: -22 + (i % 2) * 34 + u * 4, z: 11 - u * 10, key: f, f, alpha: Math.min(1, Math.min(u, 1 - u) * 8) }; },
    draw(g, st) { const o = g.p(0, 0, 0), R = RNG(st.f * 7 + 3); for (let k = 0; k < 6; k++) { const x = o[0] + (R() - 0.5) * 14, y = o[1] + (R() - 0.5) * 10, a = R() * Math.PI; g.fill2([[x - Math.cos(a) * 0.7, y - Math.sin(a) * 0.4], [x, y - 0.3], [x + Math.cos(a) * 0.7, y + Math.sin(a) * 0.4], [x, y + 0.3]], '#F2B6C2', true); } } });
});
