'use strict';
/* The café square, in the middle of the town.
   What it is: a campo on the far bank opening onto the canal. Along its back, the café: a cream three-storey house
   with green shutters whose ground floor is a dark green wooden shopfront under a green-and-cream striped awning; its
   tables spill out across the square in two rows, the back row under tall cream umbrellas. Round it: a tall narrow
   pink house, a yellow house in the corner, and on the right a red Gothic palazzo with a stone balcony and pointed
   windows. The town's grandest bridge, all white Istrian stone, climbs from the square over the canal to a little
   campiello on the near bank with a cast-iron drinking fountain, a gelato cart under a striped awning, and low houses
   with flowers on their balconies.
   Who is there: couples at the tables over coffee (the close-up: two friends at the front table, cups raised); a man
   reading the paper; a woman with her little dog under the table; the waiter with his tray going between the door and
   the tables; an accordion player at the foot of the bridge with a child dancing; two people on the crown of the bridge
   taking a photo of themselves; the gelato seller and a girl with a cone; a dog drinking at the fountain.
   What moves: the waiter, the accordion's bellows, the dancing child, the awning's fringe barely, walkers and people
   crossing the bridge, the boats below. */
SF.tile('cafe', 0, 0, { rim: 30, half: 46 }, function (T) {
  const H = 46, Y = CAN.Y;
  /* ---------- ground ---------- */
  T.ground(function (g) {
    CAN.pave(g, -H, -H, H, -Y - 0.8);
    CAN.pave(g, -H, Y + 0.8, H, H);
    g.outline(K.rect(-H, -H, H, H), { w: 0.9, co: true });
  }, { rim: true });
  T.ground(function (g) {
    // the café's patch of the square, in paler stone with a white border
    const p = K.rect(-33, -25, -3, -9.6, 0.01); g.fill(p, '#EDE9DF'); g.outline(p, { w: 0.5, c: '#CFC8B8', boil: false });
    const s = []; for (let x = -30; x < -3; x += 3) { const a = g.p(x, -25, 0.02), b = g.p(x, -9.6, 0.02); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#E2DDD1', 0.3);
  });

  /* ---------- the café ---------- */
  const CX0 = -32, CX1 = -6, CY0 = -44, CY1 = -26;
  T.obj([CX0 - 0.6, CY0 - 0.6, CX1 + 0.6, CY1 + 3.8], function (g) {
    CAN.house(g, { x0: CX0, y0: CY0, x1: CX1, y1: CY1, n: 3, col: '#F1E4C6', sh: '#3E6B57', shopL: [CX0 + 2.4, CX1 - 2.4, '#3E6B57'], winL: 7, chim: [[CX0 + 4, CY0 + 5], [CX1 - 5, CY0 + 8]], doorR: [CY1 - 6, CY1 - 4.2, '#3E6B57'] });
    // the striped awning: from the wall above the shopfront out over the first tables, and its scalloped fringe
    const z0 = 4.9, z1 = 3.7, yo = CY1 + 3.6, n = 12;
    for (let i = 0; i < n; i++) {
      const a = CX0 + 1.6 + (CX1 - CX0 - 3.2) * i / n, b = CX0 + 1.6 + (CX1 - CX0 - 3.2) * (i + 1) / n;
      g.fill([[a, CY1, z0], [b, CY1, z0], [b, yo, z1], [a, yo, z1]], i % 2 ? '#F3EEDF' : '#4F8A6A');
      g.fill([[a, yo, z1], [b, yo, z1], [b, yo, z1 - 0.6], [(a + b) / 2, yo, z1 - 0.95], [a, yo, z1 - 0.6]], i % 2 ? '#E6E0CE' : '#3E6B57');
    }
    const ax0 = CX0 + 1.6, ax1 = CX1 - 1.6;
    g.fill([[ax1, CY1, z0], [ax1, yo, z1], [ax1, yo, z1 - 0.6]], '#3E6B57');
    g.outline([[ax0, CY1, z0], [ax1, CY1, z0], [ax1, yo, z1], [ax0, yo, z1]], { w: 0.8, c: '#2E4E3E' });
    g.line([[ax0, yo, z1 - 0.6], [ax1, yo, z1 - 0.6]], { w: 0.45, c: '#2E4E3E', boil: false });
    // a hanging sign with a cup
    const sg = g.p(CX1 + 0.1, CY1 - 1.8, 7.6); g.line2([g.p(CX1, CY1 - 1.8, 8.6), [sg[0] + 4.4, sg[1] - 2.4]], { w: 0.5, boil: false });
    const bd = [[sg[0] + 1.4, sg[1] - 1.8], [sg[0] + 7.4, sg[1] - 5.2], [sg[0] + 7.4, sg[1] + 0.8], [sg[0] + 1.4, sg[1] + 4.2]]; g.fill2(bd, '#3E6B57'); g.outline2(bd, { w: 0.5, boil: false });
    const cc = [sg[0] + 4.4, sg[1] - 0.2]; g.fill2([[cc[0] - 1.6, cc[1] - 1.2], [cc[0] + 1.4, cc[1] - 2.8], [cc[0] + 1.2, cc[1] + 0.2], [cc[0] - 1.2, cc[1] + 1.4]], '#F3EEDF', true); g.ring2([cc[0] + 1.9, cc[1] - 0.8], 0.8, { w: 0.4, c: '#F3EEDF' });
  }, { name: 'cafe' });

  /* ---------- houses ---------- */
  const house = (d, name) => T.obj([d.x0 - 0.6, d.y0 - 0.6, d.x1 + (d.balcony === 'R' ? 1.4 : 0.6), d.y1 + (d.balcony === 'L' ? 1.4 : 0.6)], (g) => CAN.house(g, d), { name });
  house({ x0: -46, y0: -44, x1: -36, y1: -22, n: 3, roof: 'x', roofCol: '#B8604A', col: '#E8C46A', sh: '#5E8A68', doorR: [-29, -27.2, '#5A3E2E'], winR: 5, chim: [[-42, -40]], sh2: true }, 'h-left');
  house({ x0: -2, y0: -44, x1: 9, y1: -30, n: 4, col: '#E8A7A0', sh: '#4F7A63', doorL: [1, 2.8, '#3F4D63'], chim: [[2, -40]], altana: [4, -37] }, 'h-pink');
  house({ x0: 21, y0: -44, x1: 45, y1: -22, n: 3, roofCol: '#A9563F', col: '#C8584A', sh: '#3E6B57', arch: 'gothic', arch2: true, doorL: [25, 27.4, '#4A3428', true], balcony: 'L', flowers: ['#F3E7DA', '#E6C24F', '#E68FB5'], chim: [[25, -40], [40, -38]] }, 'palazzo');
  house({ x0: -44, y0: 26, x1: -30, y1: 45, n: 2, roof: 'y', col: '#F2E7CF', sh: '#5E8A68', doorL: [-38, -36.2, '#7A3E36'], chim: [[-40, 30]] }, 'n1');
  house({ x0: -24, y0: 28, x1: -2, y1: 45, n: 2, roof: 'x', roofCol: '#C27A5C', col: '#EBA788', sh: '#4F7A63', doorL: [-8, -6.2, '#3F4D63'], balcony: 'L', flowers: ['#E0623F', '#F6C2D7', '#F3E7DA'], chim: [[-20, 32], [-6, 34]] }, 'n2');
  house({ x0: 28, y0: 26, x1: 44, y1: 45, n: 2, col: '#EBCB7A', sh: '#5E8A68', doorL: [32, 33.8, '#5A3E2E'], chim: [[40, 30]], sh2: true }, 'n3');

  /* ---------- the white bridge ---------- */
  const BX = 14, BR = CAN.bridge(T, BX, { body: '#E9E4D8', stone: '#FBF9F4' });

  /* ---------- café tables: the furniture is scenery; chairs come with whoever sits on them ---------- */
  const TABLES = [[-28, -19.4, 1], [-20.6, -19.4, 1], [-13.2, -19.4, 1], [-27, -13.4, 0], [-19.4, -13.2, 0], [-11.6, -13.4, 0]];
  for (const [tx, ty, um] of TABLES) T.obj([tx, ty], function (g) {
    const f = g.p(tx, ty, 0), t = g.p(tx, ty, 2.5);
    g.fill2([[f[0] - 1.6, f[1]], [f[0] + 1.6, f[1]], [f[0] + 0.5, f[1] - 0.9], [f[0] - 0.5, f[1] - 0.9]], '#3A3632');
    g.line2([f, t], { w: 0.75, c: '#3A3632', boil: false, ext: 0 });
    const top = K.arc(tx, ty, 2.5, 1.35, 0, TAU, 18); g.fill(top, '#F6F3EC'); g.outline(top, { w: 0.6, boil: false });
    if (um) {
      const pt = g.p(tx, ty, 8.6); g.line2([t, pt], { w: 0.55, c: '#7A6A55', boil: false, ext: 0 });
      const rim = [], n = 8; for (let i = 0; i < n; i++) { const a = TAU * i / n + 0.2; rim.push(g.p(tx + Math.cos(a) * 3.4, ty + Math.sin(a) * 3.4, 7.4)); }
      const ap = g.p(tx, ty, 9.0);
      for (let i = 0; i < n; i++) { const a = rim[i], b = rim[(i + 1) % n]; g.fill2([ap, a, b], (a[0] + b[0]) / 2 < ap[0] ? '#F5F0E2' : '#E3DCC8'); }
      for (let i = 0; i < n; i++) { const a = rim[i], b = rim[(i + 1) % n], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.9]; g.fill2([a, b, m], '#4F8A6A', true); }
      g.outline2(rim, { w: 0.6, c: '#8A7A5A' }); for (const r of rim) if (r[1] > ap[1]) g.line2([ap, r], { w: 0.3, c: '#B9AE94', boil: false });
    }
  }, { name: 'table' });
  // cups on the tables are in the cast drawings of the people at them
  const cup = (g, x, y) => { const c = g.p(x, y, 2.55); g.fill2([[c[0] - 0.8, c[1] - 1.2], [c[0] + 0.8, c[1] - 1.2], [c[0] + 0.6, c[1]], [c[0] - 0.6, c[1]]], '#FFFFFF', true); g.disc2([c[0], c[1] - 1.2], 0.8, '#7A4E2C', true); g.ring2([c[0] + 1.1, c[1] - 0.6], 0.45, { w: 0.3, c: '#B9B2A4' }); };
  // a sitter on a bentwood café chair: the chair is part of their own drawing; its hoop back is thin, so it can stand
  // in front of someone who sits with their back to us
  const sitter = (x, y, o, extra) => T.cast([x, y], function (g) {
    const back = o.dir >= 2, cz = 1.3, W = '#5A3E2E';
    const bx = o.dir === 0 ? -0.75 : o.dir === 2 ? 0.75 : 0, by = o.dir === 1 ? -0.75 : o.dir === 3 ? 0.75 : 0;
    const hoop = () => { const a = o.dir === 0 || o.dir === 2 ? [x + bx, y - 0.6] : [x - 0.6, y + by], b = o.dir === 0 || o.dir === 2 ? [x + bx, y + 0.6] : [x + 0.6, y + by];
      const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8, px = lerp(a[0], b[0], t), py = lerp(a[1], b[1], t); pts.push([px, py, cz + 0.2 + 1.7 * Math.sin(Math.PI * t) * 0.6 + 1.0]); }
      const s0 = g.p(a[0], a[1], cz), s1 = g.p(b[0], b[1], cz); g.line2([s0, g.p.apply(g, pts[0])], { w: 0.5, c: W, boil: false, ext: 0 }); g.line2([s1, g.p.apply(g, pts[8])], { w: 0.5, c: W, boil: false, ext: 0 });
      g.line(pts, { w: 0.55, c: W, boil: false, ext: 0 }); };
    const seat = K.arc(x, y, cz, 0.75, 0, TAU, 12); g.fill(seat, '#8E6A48');
    const legs = []; for (const a of [0.8, 2.4, 3.9, 5.5]) { const p = g.p(x + Math.cos(a) * 0.6, y + Math.sin(a) * 0.6, cz), q = g.p(x + Math.cos(a) * 0.7, y + Math.sin(a) * 0.7, 0); legs.push(p[0], p[1], q[0], q[1]); }
    g.segs2(legs, W, 0.45); g.outline(seat, { w: 0.4, c: W, boil: false });
    if (!back) hoop();
    const r = K.person(g, x, y, cz, Object.assign({ pose: 'sit' }, o));
    if (back) hoop();
    if (extra) extra(g, r);
  }, { on: true });
  const cupIn = (g, h) => { g.fill2([[h[0] - 0.75, h[1] - 1.5], [h[0] + 0.75, h[1] - 1.5], [h[0] + 0.55, h[1] + 0.1], [h[0] - 0.55, h[1] + 0.1]], '#FFFFFF', true); g.disc2([h[0], h[1] - 1.5], 0.75, '#7A4E2C', true); g.line2([[h[0] + 0.75, h[1] - 1.1], [h[0] + 1.3, h[1] - 0.8], [h[0] + 0.7, h[1] - 0.3]], { w: 0.3, c: '#B9B2A4', boil: false, ext: 0 }); };
  // back row
  sitter(-29.6, -20.6, K.who(201, { dir: 0, top: '#5F8FC9' }), (g) => cup(g, -28.4, -19.8));
  sitter(-26.6, -18.0, K.who(202, { dir: 2, hairStyle: 'long', top: '#E7A9A0' }), (g) => cup(g, -27.5, -19.0));
  sitter(-22.2, -18.4, K.who(203, { dir: 0, glasses: true, beard: true, hairStyle: 'short', hair: HAIR[7], top: '#B9A27D', reach: [3.0, -9.8] }), (g, r) => {    // the newspaper reader
    const h = r.hands; const pp = [[h[0][0] - 1, h[0][1] - 4.2], [h[0][0] + 4.6, h[0][1] - 5.6], [h[0][0] + 4.8, h[0][1] + 0.6], [h[0][0] - 0.8, h[0][1] + 1.8]];
    g.fill2(pp, '#F2EFE6', true); g.outline2(pp, { w: 0.35, boil: false }); g.segs2([pp[0][0] + 0.8, pp[0][1] + 1.4, pp[1][0] - 0.8, pp[1][1] + 1.2, pp[0][0] + 0.8, pp[0][1] + 2.6, pp[1][0] - 0.8, pp[1][1] + 2.4], '#9E968A', 0.35);
  });
  sitter(-13.8, -20.8, K.who(204, { dir: 1, hairStyle: 'bob', top: '#D98AA4' }), (g) => { cup(g, -13.4, -19.6); const d = g.p(-15.4, -19.6, 0); g.fill2([[d[0] - 1.4, d[1]], [d[0] + 1.6, d[1]], [d[0] + 1.6, d[1] - 1.6], [d[0] - 1.2, d[1] - 1.8]], '#F3F1EA', true); g.disc2([d[0] - 1.6, d[1] - 2.4], 1.1, '#F3F1EA', true); g.disc2([d[0] - 2.4, d[1] - 2.3], 0.3, '#2A2622', true); g.disc2([d[0] - 1.4, d[1] - 3.2], 0.5, '#C9B9A0', true); });
  sitter(-12.0, -18.2, K.who(205, { dir: 2, top: '#3F5F8F' }));
  // front row: the close-up table, two friends with their cups raised
  sitter(-21.3, -14.0, K.who(206, { dir: 0, hairStyle: 'curly', hair: HAIR[0], skin: SKIN[5], top: '#E6C24F', blush: true, hands: [[4.0, -12.6], [2.6, -7.8]] }), (g, r) => cupIn(g, r.hands[0]));
  sitter(-19.0, -15.4, K.who(207, { dir: 1, hairStyle: 'pony', hair: HAIR[4], skin: SKIN[1], top: '#8FBF73', blush: true, hands: [[3.8, -12.8], [2.4, -7.8]] }), (g, r) => { cupIn(g, r.hands[0]); cup(g, -18.6, -12.8); });
  sitter(-28.6, -11.8, K.who(208, { dir: 1, top: '#C9584B' }), (g) => cup(g, -27.2, -12.8));
  sitter(-25.4, -14.8, K.who(209, { dir: 2, hairStyle: 'bun', top: '#F0EDE4' }));
  sitter(-10.0, -12.0, K.who(210, { dir: 1, cap: '#3B3F47' }), (g) => cup(g, -11.0, -13.0));

  /* ---------- the waiter: out of the door, round the tables, back ---------- */
  {
    const w = { skin: SKIN[2], hair: HAIR[0], hairStyle: 'short', top: '#F6F3EC', bot: '#2B2A2C', shoe: '#2E2A26', jacket: null, tie: '#2B2A2C', k: 1 };
    const pts = [[-16, -24.6], [-16, -16.4], [-23.4, -16.4], [-23.4, -9.6], [-8, -9.6], [-8, -16.4], [-16, -16.4]], L = [0];
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    const tot = L[L.length - 1], sp = 1.9;
    T.actor({ sample: 0.25, period: tot / sp,
      at(t) {
        let d = ((t * sp) % tot + tot) % tot, i = 0; while (d > L[i + 1]) i++;
        const a = pts[i], b = pts[(i + 1) % pts.length], u = (d - L[i]) / (L[i + 1] - L[i]), dx = b[0] - a[0], dy = b[1] - a[1];
        const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor((d / 2.4) % 1 * 8);
        return { x: a[0] + dx * u, y: a[1] + dy * u, key: 'w' + dir + '.' + ph, dir, ph: ph / 8 };
      },
      draw(g, st) {
        const r = K.person(g, 0, 0, 0, Object.assign({}, w, { dir: st.dir, pose: 'walk', ph: st.ph, hands: [[4.4, -15.6], [-2.6, -9.4]] }));
        const h = r.hands[0], tr = arcPts(h[0], h[1] - 0.6, 3.4, 0, TAU, 14).map((q) => [q[0], h[1] - 0.6 + (q[1] - h[1] + 0.6) * 0.38]);
        g.fill2(tr, '#C9CCD0', true); g.outline2(tr, { w: 0.35, boil: false });
        for (const dx of [-1.4, 1.2]) { g.fill2([[h[0] + dx - 0.7, h[1] - 2.2], [h[0] + dx + 0.7, h[1] - 2.2], [h[0] + dx + 0.5, h[1] - 0.8], [h[0] + dx - 0.5, h[1] - 0.8]], '#FFFFFF', true); }
        const ap = [[-2.2, -9.6], [2.0, -9.6], [2.4, -3.6], [-2.4, -3.6]].map((q) => [q[0], q[1]]); g.fill2(ap.map((q) => [q[0], q[1]]), '#F6F3EC', true);
      } });
  }

  /* ---------- the accordion player and a dancing child ---------- */
  T.actor({ sample: 5, at(t) { const f = Math.floor((t * 2.2) % 1 * 6); return { x: 6.6, y: -13.6, z: 0, key: 'acc' + f, f }; },
    draw(g, st) {
      const k = Math.sin(st.f / 6 * TAU), r = K.person(g, 0, 0, 0, Object.assign(K.who(221, { hair: HAIR[7], beard: true, top: '#6C7A89', cap: '#3B3F47' }), { dir: 1, pose: 'hold', hands: [[-3.2 - k * 1.2, -10.4], [2.4 + k * 1.2, -10.6]] }));
      const a = r.hands[1], b = r.hands[0], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], w = Math.abs(a[0] - b[0]) / 2 + 0.6;
      g.fill2([[m[0] - w, m[1] - 2.6], [m[0] + w, m[1] - 2.6], [m[0] + w, m[1] + 2.6], [m[0] - w, m[1] + 2.6]], '#B23A2E', true);
      const pl = []; for (let i = 1; i < 5; i++) { const x = m[0] - w + 2 * w * i / 5; pl.push(x, m[1] - 2.6, x, m[1] + 2.6); } g.segs2(pl, '#7E2A20', 0.4);
      g.fill2([[m[0] - w - 1.2, m[1] - 3], [m[0] - w, m[1] - 3], [m[0] - w, m[1] + 3], [m[0] - w - 1.2, m[1] + 3]], '#F3F1EA', true);
      g.outline2([[m[0] - w - 1.2, m[1] - 3], [m[0] + w + 0.4, m[1] - 3], [m[0] + w + 0.4, m[1] + 3], [m[0] - w - 1.2, m[1] + 3]], { w: 0.4, boil: false });
      // notes
      for (let i = 0; i < 2; i++) { const u = ((st.f / 6) + i * 0.5) % 1, p = [m[0] - 6 - u * 6, m[1] - 10 - u * 9]; g.disc2(p, 0.8, '#3A3530', true); g.line2([[p[0] + 0.7, p[1]], [p[0] + 0.7, p[1] - 3]], { w: 0.4, boil: false, c: '#3A3530' }); }
    } });
  T.cast([5.4, -10.6], (g) => { const c = K.rect(4.2, -11.2, 6.6, -10, 0.05); g.fill(c, '#5A3E2E'); g.fill(K.rect(4.4, -11, 6.4, -10.2, 0.08), '#B23A2E'); for (const [dx, dy] of [[0.4, 0.2], [1.2, 0.5], [0.8, -0.1]]) g.disc2(g.p(4.4 + dx, -10.8 + dy, 0.1), 0.45, C.gold, true); }, { on: true });
  T.actor({ sample: 5, at(t) { const f = Math.floor((t * 2.2) % 1 * 8); return { x: 3.6, y: -10.4, z: 0, key: 'kid' + f, f }; },
    draw(g, st) { K.person(g, 0, 0, 0, Object.assign(K.who(222, { k: 0.7, dress: '#E6C24F', hairStyle: 'pony' }), { dir: st.f < 4 ? 0 : 1, pose: 'cheer', ph: st.f / 8 })); } });

  /* ---------- the near bank: fountain, gelato cart, people ---------- */
  T.obj([22, 20], function (g) {
    K.cyl(g, 22, 20, 0.55, 0, 3.6, { t: '#3E4A46', l: '#4E5A56', r: '#36423E' }, { w: 0.6, n: 8 });
    K.dome(g, 22, 20, 0.7, 3.6, 0.7, '#4E5A56', { w: 0.5 });
    const sp = g.p(22.6, 20.6, 2.6), sp2 = g.p(23.6, 21.4, 0.4); g.line2([sp, [sp[0] - 1.2, sp[1] + 0.4]], { w: 0.6, c: '#36423E', boil: false });
    g.line2([[sp[0] - 1.2, sp[1] + 0.6], [sp2[0] - 2.4, sp2[1]]], { w: 0.45, c: '#E6F2F6', boil: false, ext: 0 });
    const gr = K.rect(21, 20.6, 24, 22.6, 0.05); g.fill(gr, '#7E8A86'); g.outline(gr, { w: 0.4, boil: false });
  }, { on: true, name: 'fountain' });
  T.cast([24.4, 22.2], (g) => { const o = g.p(24.4, 22.2, 0); g.fill2([[o[0] - 3, o[1] - 0.2], [o[0] + 1, o[1] - 0.2], [o[0] + 1.6, o[1] - 3.2], [o[0] - 2.8, o[1] - 3.6]], '#B8875A', true); g.disc2([o[0] - 3.2, o[1] - 2.6], 1.4, '#B8875A', true); g.fill2([[o[0] - 4.2, o[1] - 3.2], [o[0] - 3.6, o[1] - 4.8], [o[0] - 3.0, o[1] - 3.4]], '#8E6640', true); g.line2([[o[0] + 1.2, o[1] - 3.2], [o[0] + 3.0, o[1] - 5.4]], { w: 0.6, c: '#B8875A', boil: false }); }, { on: true });
  T.obj([-10.5, 15.5], (g) => K.stall(g, -10.5, 15.5, { face: 'L', L: 2.4, D: 1.4, a: '#E68FB5', b: '#FBF6EC', goods(g2, D, L) { const cols = ['#F6C2D7', '#F3E7B0', '#B9E0C9', '#8E5A3C', '#F3F1EA']; for (let i = 0; i < 5; i++) { const p = g2.p(-D * 0.3 + (i % 2) * D * 0.6, -L * 0.8 + i * L * 0.4, 2.8); g2.disc2(p, 1.0, cols[i]); g2.ring2(p, 1.0, { w: 0.3, c: shade(cols[i], 0.4) }); } } }), { on: true, name: 'gelato' });
  const P = (x, y, o, z) => T.cast([x, y], (g) => K.person(g, x, y, z || 0, o), { on: true });
  P(-10.5, 19.4, K.who(231, { dir: 1, pose: 'hold', top: '#F3F1EA', cap: '#E68FB5' }));
  T.cast([-6.8, 19.2], (g) => { const r = K.person(g, -6.8, 19.2, 0, K.who(232, { dir: 2, k: 0.74, dress: '#7FB7D9', reach: [-1.4, -9.6] })); const h = r.hands[0]; g.fill2([[h[0] - 0.8, h[1] - 0.4], [h[0] + 0.8, h[1] - 0.4], [h[0], h[1] + 2.2]], '#D9A050', true); g.disc2([h[0], h[1] - 1.0], 1.0, '#F6C2D7', true); }, { on: true });
  // two on the crown of the bridge, photographing themselves with the canal behind
  T.cast([BX - 0.4, 0.2], (g) => {
    const z = BR.z(0);
    K.person(g, BX - 0.6, -0.8, z, K.who(233, { dir: 1, hairStyle: 'long', hair: HAIR[5], top: '#E07A6A' }));
    const r = K.person(g, BX + 0.3, 0.6, z, K.who(234, { dir: 1, reach: [-3.4, -17.4], top: '#5F8FC9' }));
    const h = r.hands[0]; g.fill2([[h[0] - 0.9, h[1] - 1.6], [h[0] + 0.9, h[1] - 1.6], [h[0] + 0.9, h[1] + 0.6], [h[0] - 0.9, h[1] + 0.6]], '#2E2A26', true);
  }, { on: true });
  // an old couple on a bench on the near quay, watching the boats
  T.obj([-30, 10.6], (g) => K.bench(g, -30, 10.6, { face: 'L', L: 3, col: '#5E8A68' }), { on: true });
  P(-31.2, 9.6, K.who(235, { dir: 3, pose: 'sit', hair: HAIR[7], hairStyle: 'bob', top: '#8E79C0' }), 1.3);
  P(-28.8, 9.6, K.who(236, { dir: 3, pose: 'sit', hair: HAIR[7], hairStyle: 'bald', top: '#6C7A89', cap: '#5A4A3C' }), 1.3);
  for (const [x, y] of [[-34, -9.4], [24, -9.4], [-18, 9.6], [36, 9.6]]) T.obj([x, y], (g) => K.lamp(g, x, y, { h: 8, col: '#3A3632' }), { on: true });
  T.obj([35, 18], (g) => K.tree(g, 35, 18, { r: 3.8, h: 4.4, col: '#86B562' }), { on: true });
  for (const [x, y, c] of [[-35.4, -21.2, '#B5624B'], [-33.6, -21.2, '#B5624B'], [19.2, -21.2, '#9A7A5A']]) T.obj([x, y], (g) => { K.cyl(g, x, y, 0.75, 0, 1.2, { t: shade(c, -0.1), l: c, r: shade(c, 0.12) }, { w: 0.5, n: 8 }); K.bush(g, x, y, { z: 1.1, r: 1.1, col: '#6FA058' }); K.blooms(g, x - 0.6, y - 0.6, x + 0.6, y + 0.6, 1.6, ['#E0623F', '#F6C2D7'], { sp: 0.6, r: 0.7 }); }, { on: true });

  /* ---------- walkers ---------- */
  const onBridge = (x, y) => (Math.abs(x - BX) < 3.2 && Math.abs(y) < BR.ramp ? BR.z(y) : 0);
  CAN.walker(T, 241, [[BX + 1.8, -21], [BX + 1.8, 24.5], [27, 24.5], [BX + 1.8, 24.5]], 1.8, { z: onBridge, t0: 5 });
  CAN.walker(T, 242, [[BX - 1.8, 20], [BX - 1.8, -20], [-2, -20], [BX - 1.8, -20]], 1.6, { z: onBridge, t0: 16 });
  CAN.walker(T, 243, [[-44, 13.6], [9, 13.6], [9, 18], [19, 18], [19, 13.6], [44, 13.6], [19, 13.6], [19, 18], [9, 18], [9, 13.6]], 1.5, { t0: 20, who: { hairStyle: 'long', top: '#8E79C0' } });
  CAN.walker(T, 244, [[44, -16.6], [26, -16.6]], 1.3, { t0: 2 });
  CAN.walker(T, 245, [[-44, -8.9], [-36, -8.9], [-36, -18], [-44, -18]], 1.2, { t0: 9 });
});
