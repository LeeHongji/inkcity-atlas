'use strict';
/* (0,100) The South Bank, across the river from Westminster. What it is: the London Eye, a giant observation wheel on
   the river's edge just downstream of Westminster Bridge: a white rim and spoke cables round a hub, held from the
   land side by a leaning A-frame, thirty-two glass capsules on the outside of the rim, full of people; its boarding
   pier; Jubilee Gardens with the queue; a carousel; the Southbank Centre's concrete hall with the skaters' undercroft
   beneath it, graffiti on its walls; book stalls under the riverside plane trees strung with lights.
   Who is there: the queue for the Eye, skaters and BMX riders, a bubble-blower with children chasing giant soap
   bubbles, a gold-painted living statue, book browsers, couples on benches, joggers, a few umbrellas.
   What moves: the Eye turning slowly, the carousel going round with its horses rising and falling, skaters looping,
   bubbles drifting up, walkers. */
SF.tile('southbank', 0, 100, { rim: 36, order: 2.1 }, function (T) {
  const H = 37, RS = -(100 - LT.RIV.S - 1.2), EX = -12, EY = -32.6, EZ = 22.5, ER = 19.6;
  T.ground(function (g) {
    LK.ground(g, -H, RS, H, H, '#E2DED3', { cut: 'y' });
    LK.paving(g, -H, RS, H, RS + 6.5, { step: 2.4, col: '#E6E1D5' });
    K.lawn(g, -35, -20, -4, 6, { col: '#A8CB7E', dens: 0.8 });
    g.fill(K.rect(10, -2, 36, 18), '#D6D1C6');
    for (const [x, y, rx, ry] of [[-28, 14, 2.0, 0.9], [6, 26, 1.6, 0.7], [-2, RS + 3, 1.4, 0.6], [26, 26, 2.2, 0.9], [-14, 30, 1.6, 0.7]]) LK.puddle(g, x, y, rx, ry, Math.round(x * 3 + y * 11 + 31));
  }, { rim: true });

  /* ---------------- the London Eye ---------------- */
  // the A-frame and backstays (in front of the wheel: they lean back over the land)
  T.obj([EX - 6, EY + 1, EX + 6, -16], (g) => {
    const hub = g.p(EX, EY + 0.6, EZ);
    for (const dx of [-4.5, 4.5]) { const f = g.p(EX + dx, -17.5, 0); g.line2([f, hub], { w: 3.2, c: '#5E584C', boil: false, ext: 0 }); g.line2([f, hub], { w: 2.4, c: '#F3F1EA', boil: false, ext: 0 }); K.box(g, EX + dx - 1, -18.5, EX + dx + 1, -16.5, 0, 1.2, '#CFC9BB', { w: 0.5, nohid: true }); }
    const a = g.p(EX - 3.0, -21.0, 7.4), b = g.p(EX + 3.0, -21.0, 7.4); g.line2([a, b], { w: 1.0, c: '#E9E6DE', boil: false, ext: 0 });
    for (const dx of [-7, 7]) { const f = g.p(EX + dx, -16.8, 0); g.fine2([f, hub], { w: 0.3, c: '#8C8576' }); }
    g.disc2(hub, 2.0, '#D9D4C8'); g.ring2(hub, 2.0, { w: 0.6, c: '#5A544C' }); g.disc2(hub, 0.8, '#8C8576');
  }, { name: 'eye frame' });
  // the boarding pier at the foot of the wheel
  T.obj([EX - 9, EY - 2, EX + 9, RS], (g) => { K.box(g, EX - 9, EY - 1.6, EX + 9, RS, -0.2, 0.9, { t: '#D6D1C6', l: '#C9C2B2', r: '#B3AC9C' }, { w: 0.6 }); const r = []; for (let x = EX - 9; x <= EX + 9; x += 0.9) { const a = g.p(x, EY - 1.6, 0.9), b = g.p(x, EY - 1.6, 2.1); r.push(a[0], a[1], b[0], b[1]); } g.segs2(r, '#6B6458', 0.3); }, { name: 'eye pier' });
  // the wheel: rim, cables and capsules, turning (the pattern repeats every capsule, so eight poses do it)
  const NC = 32, SUB = 8, PER = 240;
  T.actor({ grow: false, sample: 5, period: 30,
    at(t) { const step = Math.floor((t / PER) * NC * SUB) % SUB; return { x: EX, y: EY, z: EZ, key: step, step }; },
    draw(g, st) {
      const th0 = (st.step / SUB) * TAU / NC, P = (r, a, dy) => g.p(Math.cos(a) * r, dy || 0, Math.sin(a) * r);
      const ring = (r, dy) => { const p = []; for (let i = 0; i <= 64; i++) p.push(P(r, TAU * i / 64, dy)); return p; };
      // spoke cables, then the rim truss
      const sp = []; for (let i = 0; i < NC; i++) { const a = th0 + TAU * i / NC, h = P(1.4, a), e = P(ER - 0.6, a); sp.push(h[0], h[1], e[0], e[1]); } g.segs2(sp, '#9E988C', 0.35);
      g.line2(ring(ER - 0.7, -0.5), { w: 1.2, c: '#D9D5CB', boil: false, close: true }); g.line2(ring(ER - 0.7, -0.5), { w: 0.35, c: '#7E786C', boil: false, close: true });
      g.line2(ring(ER, 0.5), { w: 2.4, c: '#F6F4EE', boil: false, close: true }); g.line2(ring(ER + 0.25, 0.5), { w: 0.45, c: '#5E584C', boil: false, close: true }); g.line2(ring(ER - 0.25, 0.5), { w: 0.35, c: '#7E786C', boil: false, close: true });
      const tr = []; for (let i = 0; i < 64; i++) { const a = th0 + TAU * i / 64, p = P(ER - 0.6, a, -0.5), q = P(ER, a + TAU / 128, 0.5); tr.push(p[0], p[1], q[0], q[1]); } g.segs2(tr, '#9E988C', 0.3);
      // the capsules: glass pods on the outside of the rim, their long axis across the wheel; far half first
      const caps = []; for (let i = 0; i < NC; i++) { const a = th0 + TAU * i / NC; caps.push({ a, z: Math.sin(a) }); }
      caps.sort((p, q) => q.z - p.z);
      for (const c of caps) {
        const r = ER + 1.0, cx = Math.cos(c.a) * r, cz = Math.sin(c.a) * r, P3 = (u, v, w) => g.p(cx + u, v, cz + w);
        const pod = []; for (let k = 0; k < 14; k++) { const t = TAU * k / 14; pod.push(P3(0, Math.cos(t) * 2.1, Math.sin(t) * 1.15 - 0.1)); }
        const pp = pod.map((q) => [q[0], q[1]]); g.fill2(pp, '#E3EEF3', true); g.fill2(pp.slice(7).concat([pp[0]]), '#C3D6E0', true);
        const m = P3(0, 0, -0.3); g.disc2([m[0] - 1.6, m[1] + 0.6], 0.55, '#C9584B'); g.disc2([m[0] + 0.2, m[1] - 0.2], 0.55, '#3F5F8F'); g.disc2([m[0] + 1.8, m[1] - 0.9], 0.55, '#E6C24F');
        g.line2(pp, { w: 0.5, c: '#4E5E6C', close: true, boil: false, wob: 0.2 });
        const sh = P3(0, 0, -0.95); g.segs2([pp[3][0], pp[3][1], pp[10][0], pp[10][1]], '#9DB0BC', 0.3); void sh;
      }
    } });

  /* ---------------- the carousel ---------------- */
  const CX = 3, CY = -16;
  T.obj([CX - 4.8, CY - 4.8, CX + 4.8, CY + 4.8], (g) => {
    const rim = []; for (let i = 0; i < 24; i++) { const a = TAU * i / 24; rim.push([CX + Math.cos(a) * 4.6, CY + Math.sin(a) * 4.6, 0.8]); }
    g.fill(rim.map((p) => [p[0], p[1], 0]).filter((p, i) => i < 13).concat(rim.filter((p, i) => i < 13).reverse()), '#B9443A');
    g.fill(rim, '#E9D8B0'); g.outline(rim, { w: 0.6, boil: false });
  }, { name: 'carousel base' });
  T.actor({ grow: false, sample: 5, period: 12, at(t) { const step = Math.floor((t / 12) * 8 * 4) % 4, bob = Math.floor(t * 2) % 4; return { x: CX, y: CY + 0.01, z: 0, key: step + '.' + bob, step, bob }; },
    draw(g, st) {
      const top = g.p(0, 0, 9.4), th = (st.step / 4) * TAU / 8;
      const horses = []; for (let i = 0; i < 8; i++) { const a = th + TAU * i / 8; horses.push({ a, d: Math.cos(a) + Math.sin(a) }); }
      horses.sort((p, q) => p.d - q.d);
      const pole = (a, z0, z1) => { const b = g.p(Math.cos(a) * 3.4, Math.sin(a) * 3.4, z0), t = g.p(Math.cos(a) * 3.4, Math.sin(a) * 3.4, z1); g.line2([b, t], { w: 0.45, c: '#D9A93E', boil: false, ext: 0 }); };
      const horse = (h, i) => { const up = Math.sin(h.a * 2 + st.bob * Math.PI / 2) * 0.5, p = g.p(Math.cos(h.a) * 3.4, Math.sin(h.a) * 3.4, 2.2 + up), f = -Math.sin(h.a) + Math.cos(h.a) > 0 ? 1 : -1, s = (u, v) => [p[0] + f * u, p[1] + v];
        pole(h.a, 0.8, 7.0); const col = ['#F6F3EA', '#E6C24F', '#C9584B', '#8FB7D9'][i % 4];
        g.fill2([s(-2.4, -1.0), s(1.6, -1.4), s(2.0, 0), s(-2.2, 0.4)], col, true); g.fill2([s(1.4, -1.2), s(2.6, -3.6), s(3.6, -3.0), s(2.4, -0.6)], col, true);
        g.segs2([s(-1.8, 0.2)[0], s(-1.8, 0.2)[1], s(-2.4, 2.2)[0], s(-2.4, 2.2)[1], s(1.4, 0)[0], s(1.4, 0)[1], s(2.2, 2.0)[0], s(2.2, 2.0)[1]], shade(col, 0.4), 0.5);
        g.line2([s(-2.4, -1.0), s(1.6, -1.4), s(2.6, -3.6), s(3.6, -3.0), s(2.0, 0), s(-2.2, 0.4)], { w: 0.3, c: '#5A4A3C', close: true, boil: false });
        if (i % 3 === 0) LK.person(g, Math.cos(h.a) * 3.4, Math.sin(h.a) * 3.4, 2.4 + up, LK.who(7900 + i, { dir: f > 0 ? 0 : 1, pose: 'sit', k: 0.72 }));
      };
      horses.filter((h) => h.d < 0).forEach((h, i) => horse(h, i));
      const cp = g.p(0, 0, 0.8); g.line2([cp, top], { w: 1.4, c: '#D9A93E', boil: false, ext: 0 });
      horses.filter((h) => h.d >= 0).forEach((h, i) => horse(h, i + 4));
      const can = []; for (let i = 0; i <= 16; i++) { const a = Math.PI * 0.75 - Math.PI * i / 16; can.push(g.p(Math.cos(a) * 5.2, Math.sin(a) * 5.2, 7.2)); }
      const cn = [top].concat(can); for (let i = 0; i < 16; i++) g.fill2([top, can[i], can[i + 1]], (i + st.step) % 2 ? '#F3F1EA' : '#C8372D');
      const val = []; for (let i = 0; i < 16; i++) { const a = can[i], b = can[i + 1]; val.push(a, [lerp(a[0], b[0], 0.5), lerp(a[1], b[1], 0.5) + 1.2]); } val.push(can[16]); g.line2(val, { w: 0.45, c: '#7A2A22', boil: false });
      g.line2(cn.slice(1), { w: 0.5, c: '#7A2A22', boil: false }); g.disc2([top[0], top[1] - 1], 0.8, '#D9A93E');
    } });

  /* ---------------- the Southbank Centre and its undercroft ---------------- */
  T.obj([12, -2, 36, 18], function (g) {
    g.boilP = 0.25;
    const C2 = { t: '#C9C4B8', l: '#D6D1C6', r: '#BDB7AA' }, x0 = 12, y0 = -2, x1 = 36, y1 = 18, U = 6.6, Z = 15;
    // the undercroft: the back wall covered in graffiti, pillars along the open sides
    g.fill(K.on('L', y0 + 6, x0, x1, 0, U), '#BDB7AA');
    const R = RNG(17); for (let i = 0; i < 26; i++) { const x = x0 + 1 + R() * (x1 - x0 - 3), z = 0.4 + R() * (U - 1.4), w = 1.2 + R() * 2.4, h = 0.6 + R() * 1.4; g.fill(K.on('L', y0 + 6.02, x, x + w, z, z + h), R.pick(['#E0503E', '#3F8FD9', '#E6C24F', '#5FC07A', '#D98AA4', '#2A2622', '#F3F1EA', '#8E79C0'])); }
    const tg = []; for (let i = 0; i < 18; i++) { const x = x0 + 1 + R() * (x1 - x0 - 2), z = 0.6 + R() * (U - 1.2), a = g.p(x, y0 + 6.04, z), b = g.p(x + 0.8 + R(), y0 + 6.04, z + (R() - 0.5) * 1.2); tg.push(a[0], a[1], b[0], b[1]); } g.segs2(tg, '#2A2622', 0.45);
    g.fill(K.on('R', x0 + 0.02, y0 + 6, y1, 0, U), '#AFA99C');
    // the hall above, raw concrete with board marks
    K.box(g, x0, y0, x1, y1, U, Z, C2, { w: 0.9 });
    const bm = []; for (let z = U + 1; z < Z; z += 1.0) { const a = g.p(x0, y1 + 0.02, z), b = g.p(x1, y1 + 0.02, z), c = g.p(x1 + 0.02, y0, z); bm.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); } g.segs2(bm, '#C3BDB0', 0.28);
    g.fill(K.on('L', y1 + 0.03, x0 + 2, x1 - 2, U + 4, U + 6), '#3E4A55'); g.fill(K.on('R', x1 + 0.03, y0 + 2, y1 - 2, U + 4, U + 6), '#36424C'); K.text(g, 'L', y1 + 0.04, (x0 + x1) / 2, U + 1.2, 1.4, 'SOUTHBANK CENTRE', '#2C271C', { center: true, w: 0.7 });
    K.box(g, x0 + 4, y0 + 2, x0 + 14, y0 + 10, Z, Z + 4, C2, { w: 0.7, nohid: true });
    const pl = []; for (let x = x0 + 0.6; x <= x1; x += 4) { const a = g.p(x, y1 - 0.3, 0), b = g.p(x, y1 - 0.3, U); pl.push(a[0], a[1], b[0], b[1]); } for (let y = y0 + 6; y <= y1; y += 4) { const a = g.p(x1 - 0.3, y, 0), b = g.p(x1 - 0.3, y, U); pl.push(a[0], a[1], b[0], b[1]); } g.segs2(pl, '#C9C4B8', 1.6); g.segs2(pl, '#8E897E', 0.3);
    g.line([[x0, y1, U], [x1, y1, U], [x1, y0, U]], { w: 0.8, boil: false });
  }, { name: 'southbank centre', under: 6.6 });
  // book stalls under the river trees, benches, lights strung between the trees
  for (let x = -2; x < 14; x += 5.2) T.obj([x - 2, RS + 3.2, x + 2, RS + 4.8], (g) => { K.box(g, x - 2, RS + 3.2, x + 2, RS + 4.8, 0, 2.0, { t: '#8E6A48', l: '#A07C4C', r: '#7E5E3E' }, { w: 0.5 }); const R = RNG(Math.round(x * 7)); for (let i = 0; i < 9; i++) { const p = g.p(x - 1.8 + i * 0.42, RS + 3.4 + R() * 1.2, 2.0); g.fill2([[p[0] - 0.5, p[1]], [p[0] + 0.5, p[1] - 0.3], [p[0] + 0.5, p[1] - 1.6], [p[0] - 0.5, p[1] - 1.3]], R.pick(['#C9584B', '#3F5F8F', '#E6C24F', '#5FA58F', '#F3F1EA', '#8E79C0', '#2A2622']), true); } }, { name: 'book stall' });
  const TREES = [[-30, RS + 6.6], [-20, RS + 6.6], [0, RS + 6.6], [10, RS + 6.6], [20, RS + 6.6], [32, RS + 6.6]];
  for (const [x, y] of TREES) T.obj([x, y], (g) => LK.plane(g, x, y, { r: 4.2, h: 5.8 }), { name: 'river tree' });
  for (let i = 0; i + 1 < TREES.length; i++) T.obj([TREES[i][0] + 1, RS + 6.4, TREES[i + 1][0] - 1, RS + 6.8], (g) => { const a = g.p(TREES[i][0], TREES[i][1], 7.0), b = g.p(TREES[i + 1][0], TREES[i + 1][1], 7.0), pts = []; for (let k = 0; k <= 10; k++) { const u = k / 10; pts.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) + 6 * u * (1 - u)]); } g.fine2(pts, { w: 0.25, c: '#5A544C' }); for (let k = 1; k < 10; k++) g.disc2(pts[k], 0.55, '#AFCBF0'); }, { name: 'lights', bias: 1 });
  for (const [x, y] of [[-30, 28], [-6, 34], [33, 30]]) T.obj([x, y], (g) => LK.plane(g, x, y, { r: 4.6 }), { name: 'tree' });
  T.obj([-3, 30], (g) => LK.pillar(g, -3, 30), { name: 'pillar box' });

  // the Southbank food market behind the gardens: stalls with striped awnings, long tables of people eating
  for (const [x, a, b] of [[-31, '#C8372D', '#F3F1EA'], [-24, '#3F6B4E', '#E6C24F'], [-17, '#3F5F8F', '#F3F1EA'], [-10, '#E08A3C', '#F3F1EA']]) T.obj([x - 2.2, 11, x + 2.2, 15], (g) => K.stall(g, x, 13, { face: 'L', L: 2.2, D: 1.6, a, b, goods(g2, D, L) { const R = RNG(Math.round(x * 5)); for (let i = 0; i < 10; i++) { const p = g2.p(-D + R() * 2 * D, -L + R() * 2 * L, 2.8); g2.disc2(p, 0.7, R.pick(['#E0503E', '#E6C24F', '#8FBF73', '#F3F1EA', '#C9944E'])); } } }), { name: 'food stall' });
  for (const [x, y] of [[-28, 21], [-17, 21], [-28, 27.5], [-17, 27.5]]) T.cast([x, y], (g) => {
    K.box(g, x - 4, y - 0.7, x + 4, y + 0.7, 1.6, 1.9, '#A07C4C', { w: 0.45, boil: false });
    for (const dx of [-3.4, 3.4]) { const a = g.p(x + dx, y, 0), b = g.p(x + dx, y, 1.6); g.line2([a, b], { w: 0.5, c: '#6E5236', boil: false, ext: 0 }); }
    const R = RNG(Math.round(x * 3 + y)); for (let i = 0; i < 4; i++) { const px = x - 3 + i * 2, c = g.p(px, y, 1.95); g.disc2(c, 0.6, R.pick(['#F3F1EA', '#E6B23C', '#E0503E'])); }
    for (let i = 0; i < 3; i++) LK.person(g, x - 2.6 + i * 2.6, y - 1.6, 1.2, LK.who(Math.round(8800 + x * 3 + y * 7 + i), { dir: 1, pose: 'sit' }));
    for (let i = 0; i < 3; i++) if ((i + Math.round(x)) % 2) LK.person(g, x - 2.0 + i * 2.6, y + 1.6, 1.2, LK.who(Math.round(8850 + x * 3 + y * 7 + i), { dir: 2, pose: 'sit' }));
  }, { on: true });
  /* ---------------- the living layer ---------------- */
  // the queue for the Eye, zigzagging between barriers in Jubilee Gardens
  T.cast([-14, -22], (g) => { const P = []; for (let i = 0; i < 14; i++) { const row = Math.floor(i / 7), x = row % 2 ? -4 - (i % 7) * 2.6 : -21 + (i % 7) * 2.6; P.push([x, -24 + row * 2.6, row % 2 ? 2 : 0]); } P.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])).forEach(([x, y, d], i) => LK.person(g, x, y, 0, (i % 3 ? LK.tourist : LK.who)(8000 + i, { dir: d === 0 ? 0 : 2, pose: i % 4 === 1 ? 'hold' : 'stand', phone: i % 4 === 1, umb: i === 9 ? '#E6C24F' : undefined }))); }, { on: true });
  // the bubble-blower and the children chasing his bubbles
  T.cast([-24, -4], (g) => { const r = LK.person(g, -24, -4, 0, LK.who(8020, { dir: 0, pose: 'hold', hairStyle: 'curly', top: '#8E79C0' })); const h = r.hands[0]; g.line2([h, [h[0] + 3, h[1] - 7]], { w: 0.4, c: '#7A5A3C', boil: false, ext: 0 }); g.ring2([h[0] + 3, h[1] - 8], 1.4, { w: 0.3, c: '#7A5A3C' }); LK.person(g, -20, -1.6, 0, LK.who(8021, { dir: 3, pose: 'cheer', ph: 0.3, k: 0.7 })); LK.person(g, -18.4, -4.4, 0, LK.who(8022, { dir: 2, pose: 'wave', ph: 0.6, k: 0.66 })); }, { on: true });
  for (let i = 0; i < 5; i++) T.actor({ layer: 'top', sample: 5, period: 10, at(t) { const u = ((t * 0.09 + i * 0.2) % 1), f = Math.floor(t * 3 + i) % 3; return { x: -21 + u * 9 + Math.sin(u * 9 + i) * 1.5, y: -6 + u * 3, z: 6 + u * 12, key: i % 2 + '.' + f, f, big: i % 2, alpha: Math.min(1, (1 - u) * 5) }; },
    draw(g, st) { const o = g.p(0, 0, 0), r = st.big ? 3.4 : 2.2, sq = [1, 0.9, 1.1][st.f]; const pts = arcPts(o[0], o[1], r, 0, TAU, 18).map((p) => [o[0] + (p[0] - o[0]) * sq, o[1] + (p[1] - o[1]) / sq]); g.fill2(pts, 'rgba(225,240,250,0.35)', true); g.line2(pts, { w: 0.35, c: '#9FC3E0', close: true, boil: false, wob: 0.2 }); g.line2(pts.slice(2, 7), { w: 0.4, c: '#E7A9C0', boil: false }); g.segs2([o[0] - r * 0.4, o[1] - r * 0.5, o[0] - r * 0.1, o[1] - r * 0.7], '#FFFFFF', 0.5); } });
  // the gold living statue on his box, an audience
  T.cast([2, 4], (g) => { K.box(g, 1, 3, 3, 5, 0, 1.6, '#6E5A44', { w: 0.45 }); LK.person(g, 2, 4, 1.6, { skin: '#D9A93E', hair: '#C9993A', top: '#D9A93E', bot: '#C9993A', shoe: '#C9993A', hairStyle: 'short', dir: 1, pose: 'wave', ph: 0.25, cap: '#C9993A', ink: '#6A4A1A' }); LK.person(g, 5.4, 6.6, 0, LK.tourist(8030, { dir: 2, pose: 'hold', phone: true })); LK.person(g, 6.6, 5.0, 0, LK.who(8031, { dir: 2, k: 0.72 })); }, { on: true });
  // book browsers, couples on benches by the river
  T.cast([4, RS + 6.4], (g) => { for (const [x, d, s] of [[-1, 2, 8040], [3.6, 3, 8041], [8.4, 2, 8042]]) LK.person(g, x, RS + 6.2, 0, LK.who(s, { dir: d, pose: 'hold' })); }, { on: true });
  T.cast([-26, RS + 4], (g) => { K.bench(g, -26, RS + 3.2, { face: 'L', L: 2.4, col: '#5E7B5A' }); LK.person(g, -27, RS + 4.6, 1.3, LK.who(8050, { dir: 3, pose: 'sit' })); LK.person(g, -25, RS + 4.6, 1.3, LK.who(8051, { dir: 3, pose: 'sit' })); }, { on: true });
  // skaters in the undercroft: looping rides, a board under each
  for (let i = 0; i < 4; i++) T.actor({ sample: 0.3, period: 8 + i,
    at(t) { const P = 8 + i, u = ((t / P) + i * 0.27) % 1, a = u * TAU, x = 24 + Math.cos(a) * (7 - i), y = 13 + Math.sin(a) * 2.6, dx = -Math.sin(a), dy = Math.cos(a) * 0.4, dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), jump = (u > 0.4 && u < 0.5) ? Math.sin((u - 0.4) / 0.1 * Math.PI) * 1.4 : 0; return { x, y, z: jump, key: dir + '.' + Math.round(jump * 2), dir, jump }; },
    draw(g, st) { const b = g.p(0, 0, 0); g.fill2([[b[0] - 2.4, b[1] + 0.2], [b[0] + 2.4, b[1] - 0.4], [b[0] + 2.6, b[1] + 0.3], [b[0] - 2.2, b[1] + 0.9]], '#3A3530', true); LK.person(g, 0, 0, 0.3, LK.who(8060 + i * 3, { dir: st.dir, pose: 'crouch', sway: 0.3, cap: i % 2 ? '#C8372D' : undefined, shorts: i % 2 === 0 })); } });
  // walkers along the river and through the gardens
  LK.walker(T, LK.who(8070, { shorts: true, bare: true, top: '#E0503E' }), [[-36, RS + 2.2], [36, RS + 2.2]], 3.0, { phase: 0.5 });
  LK.walker(T, LK.tourist(8071), [[36, RS + 4.0], [-36, RS + 4.0]], 1.5, { phase: 0.1 });
  LK.walker(T, LK.who(8072, { umb: '#C8372D' }), [[-36, RS + 5.4], [36, RS + 5.4]], 1.3, { phase: 0.7 });
  LK.walker(T, LK.who(8073, { dog: '#2A2622' }), [[-2, 34], [-2, 8], [9, 8], [9, 34]], 1.2, { phase: 0.3 });
  LK.walker(T, LK.tourist(8074), [[-34, 10], [-34, 34], [8, 34]], 1.4, { phase: 0.5 });
  LK.walker(T, LK.who(8075), [[11, 20], [36, 20]], 1.5, { phase: 0.2 });
});
