'use strict';
/* (0,-100) Tokyo Station, Marunouchi side. A long red-brick building, three storeys banded in white stone, arched
   windows below, a central pavilion with a white porch, and at each end an octagonal pavilion carrying a dark slate dome
   with a little lantern on top. Two glass towers rise behind it (the Yaesu side). In front: the station square, a
   taxi rank of tall dark cabs, travellers with rolling suitcases, a round red post box, and the ginkgo avenue running
   towards us. The Yamanote passes just behind. */
SF.tile('station', 0, -100, { rim: 18 }, function (T) {
  const H = 37, BRICK = { t: '#C98A6A', l: '#B8664E', r: '#9F5540' }, Y0 = -26, Y1 = -13, Z = 11.5;
  T.ground(function (g) {
    K.slab(g, H, { top: '#E6E2D8' });
    g.scuff(K.rect(-H, -H, H, H), { dir: Math.atan2(AY, AX), len: 4, c: '#F2EFE7', dens: 0.6, w: 0.5, spread: 0.1 });
    // the square: grass panels either side of a broad walk, the taxi lane
    for (const [x0, x1] of [[-34, -12], [12, 34]]) { K.lawn(g, x0, -3, x1, 9, { col: '#B9CF94', dens: 0.6 }); }
    g.fill(K.rect(-H, -12.4, H, -6.6), '#D2CDC0'); g.line([[-H, -6.6, 0], [H, -6.6, 0]], { w: 0.6, c: '#A9A296', boil: false });
    for (let x = -30; x < 34; x += 6) g.line([[x, -9.5, 0], [x + 3, -9.5, 0]], { w: 0.8, c: '#F7F5EE', boil: false });
    // the ginkgo avenue: a wide pale walk
    g.fill(K.rect(-7, 9, 7, H), '#ECE6D6'); g.scuff(K.rect(-7, 9, 7, H), { dir: Math.atan2(AY, -AX), len: 5, c: '#DCD3BE', dens: 0.6, w: 0.5, spread: 0.06 });
  }, { rim: true });

  /* ---------------- the towers behind ---------------- */
  for (const [x0, x1, h] of [[-33, -21, 31], [21, 33, 33]]) T.obj([x0, -36, x1, -28], function (g) {
    K.box(g, x0, -36, x1, -28, 0, h, { t: '#DCE3E6', l: '#C3D6E0', r: '#A8BECB' }, { w: 0.95 });
    const gr = []; for (let z = 4; z < h; z += 3) for (const [f, p, a0, a1] of [['L', -28, x0, x1], ['R', x1, -36, -28]]) { const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z)); gr.push(a[0], a[1], b[0], b[1]); }
    g.segs2(gr, '#8EA7B6', 0.35);
  }, { name: 'tower' });

  /* ---------------- the station building ---------------- */
  // the front of a brick block: white stone bands, arched windows on the ground floor, square ones above
  const front = (g, x0, x1, z1, o) => {
    K.box(g, x0, Y0, x1, Y1, 0, z1, BRICK, { w: 0.95 });
    for (const z of [0.6, 4.3, 8.1]) g.fill(K.on('L', Y1 + 0.03, x0, x1, z, z + 0.5), '#F1EDE3');
    g.fill(K.on('L', Y1 + 0.03, x0, x1, z1 - 0.7, z1), '#F1EDE3');
    const bays = Math.max(1, Math.round((x1 - x0) / 2.6));
    for (let i = 0; i < bays; i++) {
      const a = x0 + (x1 - x0) * (i + 0.5) / bays;
      K.win(g, 'L', Y1, a - 0.6, a + 0.6, 1.4, 3.7, { style: o && o.door && i === Math.floor(bays / 2) ? 'dark' : 'glass', arch: true });
      K.win(g, 'L', Y1, a - 0.55, a + 0.55, 5.1, 7.4, { style: 'glass' });
      if (z1 > 10) K.win(g, 'L', Y1, a - 0.5, a + 0.5, 8.9, z1 - 1.2, { style: 'glass' });
    }
    const sg = []; for (let z = 1.2; z < z1 - 0.8; z += 0.8) { const p0 = g.p.apply(g, K.pt('L', Y1 + 0.02, x0 + 0.1, z)), p1 = g.p.apply(g, K.pt('L', Y1 + 0.02, x0 + 0.5, z)); sg.push(p0[0], p0[1], p1[0], p1[1]); }
    g.segs2(sg, '#8E4A38', 0.3);
  };
  // a slate roof strip along the top of the long wings
  const slate = (g, x0, x1, z) => { g.fill([[x0, Y0 + 1, z], [x1, Y0 + 1, z], [x1, Y0 + 4.5, z + 2.4], [x0, Y0 + 4.5, z + 2.4]], '#5E646C'); g.fill([[x0, Y1 - 1, z], [x1, Y1 - 1, z], [x1, Y1 - 4.5, z + 2.4], [x0, Y1 - 4.5, z + 2.4]], '#6E747C'); g.line([[x0, Y1 - 1, z], [x1, Y1 - 1, z]], { w: 0.6, boil: false }); };
  // the dome pavilion at an end: an octagon with a dark slate dome and a lantern
  const dome = (g, cx) => {
    K.box(g, cx - 5.5, Y0 - 0.5, cx + 5.5, Y1 + 0.5, 0, Z + 1, BRICK, { w: 0.95 });
    for (const z of [0.6, 4.3, 8.1]) g.fill(K.on('L', Y1 + 0.53, cx - 5.5, cx + 5.5, z, z + 0.5), '#F1EDE3');
    K.win(g, 'L', Y1 + 0.5, cx - 1.6, cx + 1.6, 0.6, 4.2, { style: 'dark', arch: true });
    for (const s of [-1, 1]) { K.win(g, 'L', Y1 + 0.5, cx + s * 3.6 - 0.6, cx + s * 3.6 + 0.6, 5.1, 7.4, { style: 'glass' }); K.win(g, 'L', Y1 + 0.5, cx + s * 3.6 - 0.5, cx + s * 3.6 + 0.5, 8.9, 11.2, { style: 'glass' }); }
    K.cyl(g, cx, (Y0 + Y1) / 2, 4.8, Z + 1, Z + 3.4, { t: '#F1EDE3', l: '#F1EDE3', r: '#DAD4C6' }, { w: 0.8, n: 8 });
    K.dome(g, cx, (Y0 + Y1) / 2, 5.0, Z + 3.4, 6.4, '#5E646C', { shadow: '#4A5058', ribs: 8, ribCol: '#C9B98C', ribW: 0.55 });
    K.cyl(g, cx, (Y0 + Y1) / 2, 0.9, Z + 9.6, Z + 11.2, { t: '#5E646C', l: '#6E747C', r: '#4A5058' }, { w: 0.5, n: 8 });
    const t = g.p(cx, (Y0 + Y1) / 2, Z + 12.4); g.disc2(t, 0.9, '#C9B98C'); g.ring2(t, 0.9, { w: 0.4 });
  };
  T.obj([-35, Y0 - 0.5, -24, Y1 + 0.5], (g) => { g.boilP = 0.35; dome(g, -29.5); }, { name: 'north dome' });
  T.obj([-24, Y0, -4, Y1], (g) => { g.boilP = 0.3; front(g, -24, -4, Z); slate(g, -24, -4, Z); }, { name: 'north wing' });
  T.obj([-4, Y0 - 0.5, 4, Y1 + 3], function (g) {
    g.boilP = 0.35;
    front(g, -4, 4, Z + 1.5, { door: true });
    TK.roof(g, -4, Y0, 4, Y1, Z + 1.5, 4.2, { col: '#5E646C', over: 0.5, lift: 0, ridge: 'y', tiles: false });
    // the white porch over the central entrance
    K.box(g, -2.6, Y1, 2.6, Y1 + 2.8, 0, 4.4, { t: '#F1EDE3', l: '#F3F1EA', r: '#E2DDD0' }, { w: 0.8 });
    K.win(g, 'L', Y1 + 2.8, -1.6, 1.6, 0, 3.4, { style: 'dark', arch: true });
  }, { name: 'centre' });
  T.obj([4, Y0, 24, Y1], (g) => { g.boilP = 0.3; front(g, 4, 24, Z); slate(g, 4, 24, Z); }, { name: 'south wing' });
  T.obj([24, Y0 - 0.5, 35, Y1 + 0.5], (g) => { g.boilP = 0.35; dome(g, 29.5); }, { name: 'south dome' });
  // the round red post box, lamps, ginkgo trees down the avenue
  T.obj([9.5, -5.5], (g) => { K.cyl(g, 9.5, -5.5, 0.85, 0, 3.6, { t: '#C9463E', l: '#D4553A', r: '#B9432C' }, { w: 0.55, n: 10 }); K.dome(g, 9.5, -5.5, 0.95, 3.6, 0.7, '#B9432C', { w: 0.5 }); }, { on: true });
  for (const x of [-11, 11]) T.obj([x, -5.2], (g) => K.lamp(g, x, -5.2, { h: 8, n: 3 }), { on: true });
  const GINKGO = '#D9C24F';
  for (const y of [13, 21, 29]) for (const x of [-9.5, 9.5]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.2, h: 4.4, col: y < 20 ? C.leafL : '#B9CF6A', ink: '#5E7A30' }), { on: true });
  void GINKGO;

  /* ---------------- the living layer ---------------- */
  // the taxi rank: a row of tall dark cabs, the front one loading a suitcase
  for (let i = 0; i < 4; i++) { const x = -26 + i * 11.5; T.cast([x, -9.5], (g) => g.at(x, -9.5, 0, (g2) => TK.taxi(g2, Math.PI)), { on: true }); }
  T.cast([-27, -5.6], (g) => { TK.person(g, -27.4, -5.8, 0, TK.who(4001, { dir: 2, pose: 'hold' })); const p = g.p(-25.8, -5.4, 0); g.fill2([[p[0] - 1.2, p[1]], [p[0] + 1.2, p[1]], [p[0] + 1.2, p[1] - 3.2], [p[0] - 1.2, p[1] - 3.2]], '#5F8FC9', true); g.outline2([[p[0] - 1.2, p[1]], [p[0] + 1.2, p[1]], [p[0] + 1.2, p[1] - 3.2], [p[0] - 1.2, p[1] - 3.2]], { w: 0.35, boil: false }); }, { on: true });
  // tourists photographing the facade
  T.cast([15, 0.4], (g) => { TK.person(g, 15, 0.4, 0, TK.who(4002, { dir: 3, pose: 'hold', phone: true })); TK.person(g, 16.4, -1.2, 0, TK.who(4003, { dir: 0, pose: 'wave', ph: 0.2, cap: '#C9584B' })); }, { on: true });
  // travellers with rolling suitcases walking to and from the entrance, a salaryman running
  const roll = (who, pts, speed, ph, col) => {
    const seg = [], L = [0]; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    const tot = L[L.length - 1];
    T.actor({ sample: 0.25, period: tot / speed,
      at(t) { let d = ((t * speed + ph * tot) % tot + tot) % tot, i = 0; while (i < seg.length - 1 && d > L[i + 1]) i++; const [a, b] = seg[i], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1], dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), f = Math.floor((d / 2.4) % 1 * 8); return { x: a[0] + dx * u, y: a[1] + dy * u, key: dir + '.' + f, dir, f }; },
      draw(g, st) { const r = TK.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.f / 8 })); const h = r.hands[0], back = st.dir === 0 ? -1 : st.dir === 1 ? 1 : 0; if (back === 0) return; const c = [h[0] + back * 3.2 * -1, h[1] + 3.5]; g.line2([h, [c[0], c[1] - 3]], { w: 0.4, c: '#3A3530', boil: false }); g.fill2([[c[0] - 1.3, c[1]], [c[0] + 1.3, c[1]], [c[0] + 1.3, c[1] - 3.4], [c[0] - 1.3, c[1] - 3.4]], col, true); g.outline2([[c[0] - 1.3, c[1]], [c[0] + 1.3, c[1]], [c[0] + 1.3, c[1] - 3.4], [c[0] - 1.3, c[1] - 3.4]], { w: 0.35, boil: false }); } });
  };
  roll(TK.who(4010), [[0, -9], [0, 34]], 1.8, 0, '#E6C24F');
  roll(TK.salary(4011), [[2.2, 34], [2.2, -9]], 2.0, 0.3, '#3B3F47');
  roll(TK.who(4012, { cap: '#3F5F8F' }), [[-2.4, -9], [-2.4, 34]], 1.6, 0.6, '#C9584B');
  roll(TK.kimono(4013), [[4.4, 34], [4.4, -9]], 1.5, 0.85, '#E7A9A0');
  K.walker(T, TK.salary(4020), [[-30, -4.8], [30, -4.8]], 4.6, { phase: 0.1 });
  for (let i = 0; i < 4; i++) K.walker(T, TK.who(4030 + i), [[-33 + i * 4, -6.0 + i * 0.75], [33 - i * 3, -6.0 + i * 0.75]], 1.6 + i * 0.2, { phase: i * 0.23 });
});
