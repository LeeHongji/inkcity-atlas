'use strict';
/* The four satellites, off the grid, each on an unlined paint blob:
   west (upper left)   Windsor Castle on its hill above the Thames: the Round Tower on its mound with the Royal
                       Standard, the curtain walls, St George's Chapel, swans on the river;
   north (upper right) Wembley Stadium: the bowl full of people, the great white arch over it, a match on;
   east (lower right)  Greenwich, where the river goes on: the Royal Observatory on its hill with the red time ball
                       rising and dropping, tourists straddling the meridian line, the Old Royal Naval College's twin
                       domes, the Cutty Sark on her glass-skirted dock, a red-sailed barge going by;
   south-west (lower left) Stonehenge: the sarsen ring and its trilithons on the grass, visitors on the path, sheep. */
(function () {
  const blob = (g, pts, col, seed) => K.blob2(g, g.P(pts.map((p) => [p[0], p[1], 0])), col, { seed, rag: 0.8 });
  // at night: floodlit stone, the grass and the lead roofs left in the moonlight
  const GRASSY = new Set(['#8FB868', '#9EC373', '#A6C97C', '#8E9AA3', '#7C878F']);
  const FLS = (g, from, k, tint) => LK.flood(g, from, k, tint || LK.FLOOD.warm, (c) => (GRASSY.has(c) ? nightColour(c) : undefined));

  /* ---------------- Windsor ---------------- */
  SF.tile('windsor', -212, -12, { rim: 96, castAt: 160, order: -3, half: 30 }, function (T) {
    const ST = { t: '#CFC8B4', l: '#DCD5C1', r: '#BDB5A0' };
    T.ground(function (g) {
      blob(g, [[-30, -10], [-22, -28], [2, -30], [24, -22], [30, 0], [26, 22], [0, 30], [-24, 22]], '#B5CF8E', 5);
      const r = K.curve([[-30, 14, 0], [-10, 18, 0], [10, 16, 0], [30, 20, 0], [28, 26, 0], [8, 23, 0], [-12, 25, 0], [-28, 21, 0]], 5, true);
      g.fill(r, LK.C.water); g.water(r, { dens: 0.9, c: '#6F9093' }); g.outline(r, { w: 0.55, c: '#5E7E7E', boil: false });
      g.grass(K.rect(-26, -26, 26, 10), { dens: 0.6 });
    });
    // the mound with the Round Tower, the walls and their towers, the chapel
    T.obj([-12, -20, 4, -4], (g) => {
      const c = [-4, -12], m = []; for (let i = 0; i <= 20; i++) { const a = Math.PI * 0.75 - Math.PI * i / 20; m.push([c[0] + Math.cos(a) * 7.6, c[1] + Math.sin(a) * 7.6, 0]); }
      const mt = m.map((p) => [c[0] + (p[0] - c[0]) * 0.6, c[1] + (p[1] - c[1]) * 0.6, 4]); g.fill(m.concat(mt.slice().reverse()), '#8FB868'); g.fill(K.arc(c[0], c[1], 4, 4.56, 0, TAU, 24), '#9EC373');
      g.grass(m.concat(mt.slice().reverse()), { dens: 1.2 });
      const i0 = g.cmds.length; LK.roundTower(g, c[0], c[1], 4.0, 4 + 9.5, ST.l);
      LK.pole(g, c[0], c[1], 13.5 + 0.8, 6);
      FLS(g, i0, 1);                                                                                 // floodlit at night
      for (const [z, r] of [[7, 2.8], [11.5, 2.4]]) g.glow('lantern', c[0] + 3.0, c[1] + 3.0, z, { r, col: '#FFE0AE' });
    }, { name: 'round tower' });
    LK.flag(T, -4, -12, 20.3, { L: 3.6, H: 2.0, kind: 'standard' });
    const wall = (x0, y0, x1, y1, h) => T.obj([x0, y0, x1, y1], (g) => { LK.keep(g, x0, y0, x1, y1, h, ST.l, { w: 0.7 }); FLS(g, 0, 0.6); }, { name: 'wall' });
    wall(-20, -24, 18, -22); wall(16, -22, 18, 8); wall(-20, 6, 16, 8); wall(-20, -22, -18, 6);
    for (const [x, y] of [[-19, -23], [17, -23], [17, 7], [-19, 7]]) T.obj([x - 2, y - 2, x + 2, y + 2], (g) => { LK.roundTower(g, x, y, 2.2, 7.2, ST.l); FLS(g, 0, 0.7); g.glow('lantern', x + 1.8, y + 1.8, 2.5, { r: 2.0, col: '#FFE0AE' }); }, { name: 'tower' });
    T.obj([2, -6, 14, 2], (g) => { K.box(g, 2, -5, 14, 1, 0, 6.4, ST, { w: 0.8 }); for (let x = 3; x < 13.5; x += 1.8) K.win(g, 'L', 1.02, x, x + 0.9, 1.2, 5.2, { style: 'dark', arch: 'gothic', col: '#5A5E68', w: 0.3 }); K.gable(g, 1.8, -5.2, 14.2, 1.2, 6.4, 2.4, 'x', { a: '#8E9AA3', b: '#7C878F', e: ST.l }, { w: 0.6 }); for (let x = 2; x <= 14; x += 2.4) { const b = g.p(x, 1, 6.4), t = g.p(x, 1, 8.6); g.fill2([[b[0] - 0.5, b[1]], [b[0] + 0.5, b[1]], [t[0], t[1]]], ST.l); } FLS(g, 0, 0.8); for (const x of [4, 8, 12]) g.glow('lantern', x, 1.6, 3, { r: 2.2, col: '#FFE0AE' }); }, { name: "st george's" });
    for (let i = 0; i < 4; i++) T.actor({ sample: 0.4, period: 50, at(t) { const u = ((t / 50) + i * 0.08) % 1, x = lerp(26, -26, u); return { x, y: 21 + Math.sin(u * 7) * 0.8, key: i ? 'c' : 's' }; }, draw(g, st) { const o = g.p(0, 0, 0), s = st.key === 's' ? 1 : 0.6, col = st.key === 's' ? '#FBFAF6' : '#B9B4A8'; g.fill2([[o[0] + 2.4 * s, o[1] - 0.2], [o[0] - 1.6 * s, o[1] - 0.6 * s], [o[0] - 1.8 * s, o[1] + 0.4], [o[0] + 2.0 * s, o[1] + 0.6]], col, true); if (st.key === 's') { g.line2([[o[0] - 1.2, o[1] - 0.6], [o[0] - 1.6, o[1] - 3.6], [o[0] - 2.4, o[1] - 4.0]], { w: 0.8, c: col, boil: false, ext: 0 }); g.fill2([[o[0] - 2.4, o[1] - 4.3], [o[0] - 3.4, o[1] - 3.8], [o[0] - 2.4, o[1] - 3.7]], '#E08A3C', true); } } });
    T.cast([6, 10], (g) => { LK.person(g, 5, 10, 0, LK.tourist(9500, { dir: 3, pose: 'hold', phone: true })); LK.person(g, 7, 11, 0, LK.tourist(9501, { dir: 3 })); LK.person(g, -2, 11.4, 0, LK.guard(9502, { dir: 1 })); }, { on: true });
  });

  /* ---------------- Wembley ---------------- */
  SF.tile('wembley', -2, -214, { rim: 90, castAt: 160, order: -3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-28, -8], [-20, -26], [6, -28], [26, -16], [28, 8], [16, 26], [-8, 28], [-26, 16]], '#E3DFD4', 9);
      g.fill(K.rect(-6, 14, 6, 28), '#D6D1C6');
    });
    T.obj([-17, -14, 17, 14], (g) => {
      g.boilP = 0.25;
      const ell = (rx, ry, z) => { const p = []; for (let i = 0; i < 40; i++) { const a = TAU * i / 40; p.push([Math.cos(a) * rx, Math.sin(a) * ry, z]); } return p; };
      const outer = ell(16, 13, 0), outerT = ell(16, 13, 8.5);
      g.fill(outer.filter((p, i) => i < 21).concat(outerT.filter((p, i) => i < 21).reverse()), '#E9E6DE');
      const ribs = []; for (let i = 0; i < 21; i += 2) { const a = g.p.apply(g, outer[i]), b = g.p.apply(g, outerT[i]); ribs.push(a[0], a[1], b[0], b[1]); } g.segs2(ribs, '#B9B4A8', 0.35);
      g.fill(outerT, '#D9D4C8');
      const inner = ell(10.5, 7.5, 1.2); g.fill(ell(14.6, 11.6, 8.3), '#C8372D');
      // tiers of seats with the crowd as dots of colour
      const R = RNG(3), dots = []; for (let k = 0; k < 5; k++) { const rx = 14.2 - k * 0.8, ry = 11.2 - k * 0.8, z = 8.0 - k * 1.3; for (let i = 0; i < 60; i++) { const a = TAU * i / 60 + R() * 0.05; const p = g.p(Math.cos(a) * rx, Math.sin(a) * ry, z); dots.push(p); } }
      for (const p of dots) g.disc2(p, 0.85, R.pick(['#C8372D', '#F3F1EA', '#3F5F8F', '#E6C24F', '#2A2622', '#C8372D']));
      g.fill(inner, '#7FB35C'); const st = []; for (let i = -4; i <= 4; i++) { const a = g.p(i * 2.2, -7.2, 1.21), b = g.p(i * 2.2, 7.2, 1.21); st.push(a[0], a[1], b[0], b[1]); } g.segs2(st, '#8FC36C', 1.2); g.line([[0, -7.4, 1.22], [0, 7.4, 1.22]], { w: 0.35, c: '#F3F1EA', boil: false });
      g.line2(g.P(outerT), { w: 0.8, close: true, boil: false });
      // at night: a match under the floodlights: the pitch bright, the crowd lit, the white bowl washed in light
      g.mark({ nc: (c) => (c === '#7FB35C' ? '#6CA854' : c === '#E9E6DE' || c === '#D9D4C8' ? LK.floodCol(c, 0.6, LK.FLOOD.white) : mix(nightColour(c), c, 0.6)) }, 0);
      for (let i = 0; i < 6; i++) { const a = TAU * i / 6 + 0.3; g.glow('lantern', Math.cos(a) * 13.6, Math.sin(a) * 10.8, 9.4, { r: 2.2, col: '#F4F8FF' }); }
      g.glow('lantern', 0, 0, 3, { r: 7, col: '#DFFFD6' });
    }, { name: 'stadium' });
    // the arch: a white lattice hoop leaning over the bowl
    T.obj([-17, -1, 17, 1], (g) => { const pts = []; for (let i = 0; i <= 24; i++) { const t = i / 24, x = lerp(-17, 17, t), z = 26 * Math.sin(Math.PI * t), y = -6 * Math.sin(Math.PI * t); pts.push([x, y, z]); } g.line(pts, { w: 2.2, c: '#F6F4EE', boil: false }); g.line(pts, { w: 0.5, c: '#8C8576', boil: false }); const lat = []; for (let i = 0; i < 24; i++) { const a = g.p.apply(g, pts[i]), b = g.p.apply(g, pts[i + 1]); lat.push(a[0], a[1] - 1, b[0], b[1] + 1); } g.segs2(lat, '#C9C5BA', 0.3);
      // at night the arch is lit white: a band of light along it (clear by day), soft lights along its length
      for (let i = 0; i < 24; i++) { const a = g.p.apply(g, pts[i]), b = g.p.apply(g, pts[i + 1]), dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1, nx = -dy / n * 0.8, ny = dx / n * 0.8;
        g.fill2([[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]], 'rgba(255,255,255,0)', true); g.mark({ nc: '#F6F8FF' }); }
      for (let i = 2; i < 24; i += 3) LK.glowDry(g, 'neon', pts[i][0], pts[i][1], pts[i][2], { r: 1.6, col: '#EEF4FF' }); }, { name: 'arch', bias: 4 });
    // the players on the pitch: tiny figures, the ball moving
    T.actor({ sample: 5, period: 10, at(t) { const f = Math.floor(t * 2) % 8; return { x: 0, y: 0, z: 1.2, key: f, f }; }, draw(g, st) { const R = RNG(st.f + 1); for (let i = 0; i < 12; i++) { const p = g.p(-8 + R() * 16, -5 + R() * 10, 0); g.disc2([p[0], p[1] - 1.4], 0.7, i < 6 ? '#C8372D' : '#F3F1EA'); g.segs2([p[0], p[1] - 0.8, p[0], p[1]], '#2A2622', 0.4); } const b = g.p(-6 + st.f * 1.6, Math.sin(st.f) * 3, 0); g.disc2([b[0], b[1] - 0.6], 0.45, '#FFFFFF'); } });
    T.cast([0, 22], (g) => { for (let i = 0; i < 6; i++) LK.person(g, -4 + i * 1.6, 20 + (i % 2) * 1.2, 0, LK.who(9600 + i, { dir: 3, top: i % 2 ? '#C8372D' : '#F3F1EA' })); }, { on: true });
  });

  /* ---------------- Greenwich ---------------- */
  SF.tile('greenwich', 214, 20, { rim: 104, castAt: 168, order: 3, half: 32 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-30, -12], [-22, -30], [6, -32], [28, -20], [32, 6], [24, 28], [-4, 32], [-28, 22]], '#B5CF8E', 13);
      const r = K.curve([[-32, 22, 0], [-14, 26, 0], [6, 25, 0], [30, 28, 0], [26, 34, 0], [4, 33, 0], [-14, 34, 0], [-30, 30, 0]], 5, true);
      g.fill(r, LK.C.water); g.water(r, { dens: 0.9, c: '#6F9093' }); g.outline(r, { w: 0.55, c: '#5E7E7E', boil: false });
      g.fill(K.rect(-20, 12, 14, 22), '#E3DED2');
    });
    // Greenwich Park's hill with the Royal Observatory on top, the meridian line down its terrace
    T.obj([-6, -30, 26, -6], (g) => {
      const base = [[-6, -6, 0], [26, -6, 0], [26, -30, 0], [-6, -30, 0]], top = [[2, -12, 6], [20, -12, 6], [20, -26, 6], [2, -26, 6]];
      g.fill([base[0], base[1], top[1], top[0]], '#9EC373'); g.fill([base[1], base[2], top[2], top[1]], '#8FB868'); g.fill(top, '#A6C97C');
      g.grass([base[0], base[1], top[1], top[0]], { dens: 1.0 });
      const path = [[4, -6, 0.05], [8, -12, 6.05]]; g.line(path, { w: 1.6, c: '#E3D2AE', boil: false });
      K.box(g, 6, -24, 16, -16, 6, 11, { t: '#A9583F', l: '#B9654C', r: '#9C523D' }, { w: 0.75 });
      for (let x = 7; x < 15.5; x += 2.2) K.win(g, 'L', -15.98, x, x + 1.0, 7.4, 9.8, { style: 'glass', arch: true });
      K.dome(g, 18.5, -20, 2.6, 6, 3.0, '#8E9AA3'); K.cyl(g, 18.5, -20, 2.6, 6, 6.01, '#B9654C', { w: 0.4 });
      const m0 = g.p(8, -16, 11), m1 = g.p(8, -16, 18); g.line2([m0, m1], { w: 0.5, c: '#3A3530', boil: false, ext: 0 });
      g.line([[11, -12, 6.06], [11, -26, 6.06]], { w: 0.9, c: '#F6F4EE', boil: false });
      FLS(g, 0, 0.55); for (const x of [8, 13]) g.glow('lantern', x, -15.4, 8.2, { r: 2.0, col: '#FFDCA8' });   // floodlit at night
    }, { name: 'observatory' });
    // the red time ball: up the mast, then dropping at the hour
    T.actor({ sample: 5, period: 20, at(t) { const c = (t % 20) / 20, h = c < 0.6 ? 6.4 * smooth(c / 0.5) : c < 0.85 ? 6.4 : 6.4 * (1 - smooth((c - 0.85) / 0.05)); return { x: 8, y: -16, z: 11 + h, key: Math.round(h * 2) }; }, draw(g) { const o = g.p(0, 0, 0); g.disc2(o, 1.2, '#D2392B'); g.ring2(o, 1.2, { w: 0.4, c: '#7A1E16' }); g.segs2([o[0] - 1.2, o[1], o[0] + 1.2, o[1]], '#9A2A1E', 0.3); } });
    T.cast([11, -19], (g) => { for (const [y, d, s] of [[-24, 1, 9700], [-21, 1, 9701], [-18, 0, 9702]]) LK.person(g, 11, y, 6, LK.tourist(s, { dir: d, pose: s % 2 ? 'hold' : 'wave', phone: s % 2 === 1, ph: 0.25 })); }, { on: true });
    // the Old Royal Naval College: twin domed towers
    for (const x of [-16, -4]) T.obj([x - 3, 2, x + 3, 9], (g) => { K.box(g, x - 3, 2, x + 3, 9, 0, 7, LK.C.stone ? { t: '#DCD5C3', l: '#ECE6D6', r: '#D2CAB6' } : '#ECE6D6', { w: 0.7 }); K.cyl(g, x, 5.5, 1.8, 7, 12, { t: '#DCD5C3', l: '#ECE6D6', r: '#D2CAB6' }, { w: 0.6, n: 10 }); K.dome(g, x, 5.5, 1.9, 12, 2.4, '#8E9AA3'); const t = g.p(x, 5.5, 14.4); g.line2([t, [t[0], t[1] - 2.4]], { w: 0.4, c: '#3A3530', boil: false, ext: 0 }); LK.flood(g, 0, 0.9, LK.FLOOD.warm); g.glow('lantern', x + 1.9, 7.4, 9.5, { r: 2.2, col: '#FFE2B4' }); g.glow('lantern', x, 9.6, 3.5, { r: 2.2, col: '#FFE2B4' }); }, { name: 'naval college' });
    // the Cutty Sark on her dock, the glass skirt round her hull
    T.obj([-20, 13, 10, 21], (g) => g.at(-5, 17, 0, (g2) => {
      const L = 12, ca = 1, P = (u, v, z) => g2.p(u, v, z);
      g2.fill2([P(-L, -2.2, 0.5), P(L, -2.2, 0.5), P(L, 2.2, 0.5), P(-L, 2.2, 0.5)], 'rgba(207,224,232,0.9)');
      g2.outline2([P(-L, -2.2, 0.5), P(L, -2.2, 0.5), P(L, 2.2, 0.5), P(-L, 2.2, 0.5)], { w: 0.4, c: '#7E8C96', boil: false });
      K.boat(g2, 0, { kind: 'row', L: 10, W: 1.8, hull: '#2A2622', deck: '#B58F5E', stripe: '#D9A93E' });
      for (const [u, h] of [[-5, 13], [0, 16], [5, 14]]) { const b = P(u, 0, 1.4), t = P(u, 0, h); g2.line2([b, t], { w: 0.6, c: '#4A3A2C', boil: false, ext: 0 }); for (let k = 0; k < 4; k++) { const z = h - 1.5 - k * 2.6, w = 2.6 - k * 0.3, a = P(u, -w, z), c = P(u, w, z); g2.line2([a, c], { w: 0.45, c: '#4A3A2C', boil: false, ext: 0 }); } }
      g2.fine2([P(-10, 0, 1.6), P(-5, 0, 13), P(0, 0, 16), P(5, 0, 14), P(12.5, 0, 2.4)], { w: 0.25, c: '#6B5E4E' });
      g2.line2([P(10, 0, 1.6), P(13, 0, 2.6)], { w: 0.5, c: '#4A3A2C', boil: false, ext: 0 });
      g2.mark({ nc: (c) => (c === 'rgba(207,224,232,0.9)' ? '#C8D8EA' : c === '#2A2622' ? '#463C36' : c === '#D9A93E' ? '#F0C25A' : undefined) }, 0);   // floodlit at night: the glass skirt glowing
      for (const u of [-6, 0, 6]) g2.glow('lantern', u, 2.4, 3.5, { r: 2.2, col: '#FFE2B4' });
      for (const [u, h] of [[-5, 13], [0, 16], [5, 14]]) g2.glow('lantern', u, 0, h - 3, { r: 1.4, col: '#FFE8C4' });
    }), { name: 'cutty sark' });
    // a red-sailed Thames barge going down the river
    T.actor({ grow: false, sample: 0.4, period: 40, at(t) { const u = (t / 40) % 1, x = lerp(-28, 28, u), a = Math.min(1, Math.min(u, 1 - u) * 10); return { x, y: 29, z: -0.2, key: 0, alpha: a < 1 ? a : null }; },
      draw(g) { K.boat(g, 0, { kind: 'row', L: 4.6, W: 1.3, hull: '#2A2622', deck: '#9A7A56' }); const m = g.p(0.6, 0, 1.4), t = g.p(0.6, 0, 12); g.line2([m, t], { w: 0.6, c: '#4A3A2C', boil: false, ext: 0 }); g.fill2([[m[0] - 0.4, m[1] - 3], [t[0] - 0.4, t[1] + 1], [t[0] - 8, t[1] + 5], [m[0] - 8, m[1] - 2]], '#A9502E', true); g.fill2([[t[0] + 0.2, t[1] + 2], [m[0] + 6, m[1] - 2], [m[0] + 0.4, m[1] - 2.4]], '#B9643E', true); g.line2([[m[0] - 0.4, m[1] - 3], [t[0] - 0.4, t[1] + 1], [t[0] - 8, t[1] + 5], [m[0] - 8, m[1] - 2]], { w: 0.4, c: '#6E3420', close: true, boil: false }); } });
    LK.walker(T, LK.tourist(9710), [[-18, 11], [12, 11]], 1.3, { phase: 0.3 });
    LK.walker(T, LK.who(9711, { umb: '#26314F' }), [[12, 12.4], [-18, 12.4]], 1.2, { phase: 0.7 });
  });

  /* ---------------- Stonehenge ---------------- */
  SF.tile('stonehenge', 12, 214, { rim: 108, castAt: 170, order: 3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-28, -10], [-16, -26], [10, -26], [26, -12], [26, 12], [12, 26], [-12, 26], [-26, 12]], '#B9CF8E', 17);
      g.grass(K.rect(-22, -20, 22, 20), { dens: 0.8 });
      const ring = []; for (let i = 0; i <= 32; i++) { const a = TAU * i / 32; ring.push([Math.cos(a) * 16, Math.sin(a) * 16, 0]); } g.line(ring, { w: 0.5, c: '#8FA86A', boil: false });
      const p = K.curve([[18, 22, 0], [12, 14, 0], [16, 4, 0], [22, -4, 0]], 4, false); g.line(p, { w: 1.6, c: '#E3D2AE', boil: false });
    });
    const S = { t: '#B9B6AA', l: '#C9C5B8', r: '#A9A598' };
    const stone = (x, y, a, h, w) => T.obj([x - 1.4, y - 1.4, x + 1.4, y + 1.4], (g) => { K.rbox(g, x, y, w || 0.9, 0.6, a, 0, h, S, { w: 0.6 }); }, { name: 'stone' });
    // the outer sarsen circle with lintels, the inner horseshoe of trilithons
    const N = 16, R = 10.5;
    for (let i = 0; i < N; i++) { if (i === 5 || i === 6) continue; const a = TAU * i / N; T.obj([Math.cos(a) * R - 1.4, Math.sin(a) * R - 1.4, Math.cos(a) * R + 1.4, Math.sin(a) * R + 1.4], (g) => { const x = Math.cos(a) * R, y = Math.sin(a) * R; K.rbox(g, x, y, 0.55, 0.9, a, 0, 5.2, S, { w: 0.6 }); if (i % 3 !== 2) { const b = a + TAU / N / 2, xm = Math.cos(b) * R, ym = Math.sin(b) * R; K.rbox(g, (x + xm) / 2, (y + ym) / 2, 1.6, 0.5, b + Math.PI / 2, 5.2, 5.9, S, { w: 0.5 }); } }, { name: 'sarsen' }); }
    for (const [x, y, a] of [[-4, -3, 0.4], [3, -4, -0.3], [5, 2, 1.2], [-4.6, 3.4, 1.9]]) T.obj([x - 2, y - 2, x + 2, y + 2], (g) => { const ca = Math.cos(a), sa = Math.sin(a); K.rbox(g, x - sa * 1.1, y + ca * 1.1, 0.6, 0.8, a, 0, 7, S, { w: 0.6 }); K.rbox(g, x + sa * 1.1, y - ca * 1.1, 0.6, 0.8, a, 0, 7, S, { w: 0.6 }); K.rbox(g, x, y, 0.7, 2.0, a, 7, 7.9, S, { w: 0.55 }); }, { name: 'trilithon' });
    stone(-14, 8, 0.3, 3.4, 0.7); stone(15, 18, 0.2, 2.8);
    T.cast([18, 10], (g) => { for (const [x, y, d, s] of [[17, 9, 2, 9800], [18.6, 10.4, 2, 9801], [16.4, 11.6, 3, 9802]]) LK.person(g, x, y, 0, LK.tourist(s, { dir: d, pose: s % 2 ? 'hold' : 'stand', phone: s % 2 === 1, umb: s === 9802 ? '#26314F' : undefined })); }, { on: true });
    for (let i = 0; i < 5; i++) T.actor({ sample: 5, period: 10, at(t) { const f = Math.floor(t * 0.7 + i) % 2; return { x: -16 + i * 3.2, y: -14 + (i % 2) * 3, key: f, f }; }, draw(g, st) { const o = g.p(0, 0, 0), d = st.f ? 0.6 : 0; g.fill2(arcPts(o[0], o[1] - 2.4, 2.6, 0, TAU, 12).map((p) => [p[0], o[1] - 2.4 + (p[1] - o[1] + 2.4) * 0.65]), '#F3F1EA', true); g.disc2([o[0] + 2.4, o[1] - 2.6 + d], 0.9, '#3A3530'); g.segs2([o[0] - 1.4, o[1] - 1.4, o[0] - 1.4, o[1], o[0] + 1.2, o[1] - 1.4, o[0] + 1.2, o[1]], '#3A3530', 0.5); g.line2(arcPts(o[0], o[1] - 2.4, 2.6, 0, TAU, 12).map((p) => [p[0], o[1] - 2.4 + (p[1] - o[1] + 2.4) * 0.65]), { w: 0.35, c: '#8E897E', close: true, boil: false, wob: 0.6 }); } });

    /* the Greenwich Meridian laser: from dusk to 11 pm a green beam shines north from the Royal Observatory along the
       prime meridian. Night only; made here, the last actor of all (an actor's number seeds its pen), and placed in
       Greenwich; drawn on top. A thin line fading with distance and a few soft lights along it. */
    T.actor({ tile: SF.tileBy.greenwich, layer: 'top', grow: false, sample: 5, period: 10,
      at() { return LOOK.night ? { x: 11, y: -24, z: 11.4, key: 'laser' } : null; },
      draw(g) {
        const L = 84, P = (s) => g.p(0, -s, s * 0.07);
        for (let k = 0; k < 7; k++) {
          const a = P(L * k / 7), b = P(L * (k + 1) / 7), dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy), w = 0.32, nx = -dy / n * w, ny = dx / n * w;
          g.fill2([[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]], 'rgba(120,255,140,0)', true);
          g.mark({ nc: 'rgba(150,255,160,' + (0.9 - k * 0.12).toFixed(2) + ')' });
        }
        for (let k = 0; k < 6; k++) { g.disc2(P(2 + k * k * 1.6), 0.5, 'rgba(120,255,140,0)'); g.mark({ nc: true, light: true }); }
      } });
  });
})();
