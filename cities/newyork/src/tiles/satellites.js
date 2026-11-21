'use strict';
/* Three satellites off the grid, each on an unlined paint blob:
   upper right (south) Liberty Island in the harbour: the Statue of Liberty, copper-green, on her granite pedestal and
                the eleven-pointed star of Fort Wood; visitors on the island's walk; the orange Staten Island ferry and a
                Circle Line boat crossing the water.
   upper left (east)   the Brooklyn Bridge over a reach of the East River: two granite towers, each pierced by a pair of
                pointed arches, four main cables and the web of stays and suspenders, cars on the roadways, walkers and
                cyclists on the raised promenade between them, a ferry passing under; DUMBO's brick warehouses and a
                pebble beach on the Brooklyn side, an esplanade on the Manhattan side.
   lower left (north)  Yankee Stadium: the grandstands behind home plate with the white frieze on their roof, outfield
                bleachers, a game on: the pitch, the swing, a hit to centre field, fans jumping up. */
(function () {
  const blob = (g, pts, col, seed, rag) => K.blob2(g, g.P(pts.map((p) => [p[0], p[1], 0])), col, { seed, rag: rag == null ? 0.8 : rag });

  /* ======================= Liberty Island ======================= */
  SF.tile('liberty', 0, -226, { rim: 70, castAt: 130, order: -3, half: 30 }, function (T) {
    const IX = 2, IY = -2;
    T.ground(function (g) {
      blob(g, [[-34, -6], [-26, -28], [-2, -34], [24, -28], [34, -6], [30, 20], [8, 32], [-18, 30], [-32, 16]], C.water, 21, 1.2);
      g.water(K.curve([[-28, -6], [-20, -24], [0, -28], [20, -22], [28, -4], [24, 16], [6, 26], [-16, 24], [-26, 12]], 3, true), { dens: 0.9 });
      // the island: a lawn, a paved walk round the fort, a tree or two
      blob(g, [[IX - 13, IY - 2], [IX - 8, IY - 12], [IX + 4, IY - 13], [IX + 13, IY - 5], [IX + 12, IY + 8], [IX + 2, IY + 13], [IX - 10, IY + 9]], '#B5CF8E', 22, 0.6);
      const walk = K.curve([[IX - 10, IY], [IX - 6, IY - 9], [IX + 4, IY - 10], [IX + 10, IY - 3], [IX + 9, IY + 6], [IX + 1, IY + 10], [IX - 8, IY + 7]], 4, true);
      g.fill(walk, '#E6DFCF');
      g.fill(K.curve([[IX - 7.6, IY], [IX - 4.5, IY - 6.8], [IX + 3.2, IY - 7.6], [IX + 7.6, IY - 2.2], [IX + 6.8, IY + 4.5], [IX + 0.8, IY + 7.6], [IX - 6, IY + 5.2]], 4, true), '#C2D69F');
      g.line(walk.concat([walk[0]]), { w: 0.4, c: '#A39C8C', boil: false });
      g.outline(K.curve([[IX - 13.2, IY - 2], [IX - 8, IY - 12.4], [IX + 4, IY - 13.4], [IX + 13.4, IY - 5], [IX + 12.4, IY + 8.2], [IX + 2, IY + 13.4], [IX - 10.2, IY + 9.2]], 4, true), { w: 0.5, c: '#5F7F9C', boil: false });
    });
    // the star fort, the pedestal, the statue
    T.obj([IX - 7, IY - 7, IX + 7, IY + 7], function (g) {
      g.boilP = 0.3;
      const GR = '#CFC8B8', star = [];
      for (let i = 0; i < 22; i++) { const a = -Math.PI / 2 + TAU * i / 22, r = i % 2 ? 4.4 : 6.8; star.push([IX + Math.cos(a) * r, IY + Math.sin(a) * r]); }
      const Z = 2.2, sides = [];
      for (let i = 0; i < 22; i++) { const a = star[i], b = star[(i + 1) % 22], nx = b[1] - a[1], ny = -(b[0] - a[0]); if (nx + ny <= 0) continue; sides.push({ q: [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], Z], [a[0], a[1], Z]], d: a[0] + a[1] + b[0] + b[1], t: clamp(0.5 + 0.5 * (nx - ny) / Math.hypot(nx, ny), 0, 1) }); }
      sides.sort((p, q) => p.d - q.d);
      for (const sd of sides) { g.fill(sd.q, mix('#C9C1AE', '#A9A190', sd.t)); g.line([sd.q[0], sd.q[1]], { w: 0.6, boil: false }); g.line([sd.q[1], sd.q[2]], { w: 0.5, boil: false }); }
      const top = star.map((p) => [p[0], p[1], Z]); g.fill(top, '#DCD6C6'); g.outline(top, { w: 0.6, boil: false });
      // the pedestal: a granite base, the shaft with its recessed panels and loggia, the balcony
      K.box(g, IX - 3.2, IY - 3.2, IX + 3.2, IY + 3.2, Z, 4.4, { t: '#D9D3C6', l: GR, r: '#B7AF9E' }, { w: 0.8 });
      K.box(g, IX - 2.5, IY - 2.5, IX + 2.5, IY + 2.5, 4.4, 12.2, { t: '#D9D3C6', l: '#D2CBBA', r: '#B9B1A0' }, { w: 0.85 });
      for (const [f, pl] of [['L', IY + 2.5], ['R', IX + 2.5]]) { const c = f === 'L' ? IX : IY; g.fill(K.on(f, pl + 0.03, c - 1.2, c + 1.2, 5.6, 9.6), '#BDB5A3'); K.win(g, f, pl + 0.05, c - 0.9, c + 0.9, 10.0, 11.6, { style: 'dark', arch: true, w: 0.4 }); }
      K.box(g, IX - 2.9, IY - 2.9, IX + 2.9, IY + 2.9, 12.2, 12.9, { t: '#DCD6C6', l: '#D2CBBA', r: '#B9B1A0' }, { w: 0.6, boil: false });
      K.box(g, IX - 2.0, IY - 2.0, IX + 2.0, IY + 2.0, 12.9, 13.8, { t: '#7FB8A4', l: '#D2CBBA', r: '#B9B1A0' }, { w: 0.55, boil: false });
      // Liberty: robe to her feet, the tablet in her left arm, the torch held high in her right, the rayed crown
      const c = g.p(IX, IY, 13.8), s = (u, v) => [c[0] + u * 1.35, c[1] + v], CU = '#86C0AA', CD = '#5E9C88', INK = '#2F5A4C';
      const robe = [s(-6.2, 0), s(6.6, 0), s(5.2, -12), s(4.8, -24), s(3.6, -36), s(2.2, -42), s(-2.4, -42), s(-3.6, -36), s(-4.6, -24), s(-5.4, -12)];
      g.fill2(robe, CU); g.fill2([s(0.8, 0), s(6.6, 0), s(5.2, -12), s(4.8, -24), s(3.6, -36), s(2.2, -42), s(0.6, -42), s(1.2, -30), s(0.4, -16)], CD);
      g.segs2([s(-3.8, -2), s(-2.6, -20), s(-1.4, -1), s(-0.8, -22), s(2.6, -1), s(2.0, -24), s(4.6, -3), s(3.6, -18), s(-2.8, -28), s(1.6, -36)].flat(), INK, 0.4);
      // the tablet held against her left side (to our right)
      g.fill2([s(3.6, -26), s(7.6, -27.6), s(8.4, -36.4), s(4.4, -35.0)], CU); g.outline2([s(3.6, -26), s(7.6, -27.6), s(8.4, -36.4), s(4.4, -35.0)], { w: 0.4, c: INK, boil: false });
      // the raised right arm and the torch
      g.fill2([s(-2.4, -39), s(-3.8, -44), s(-6.0, -58), s(-4.4, -58.6), s(-1.6, -45), s(-0.6, -40)], CU); g.line2([s(-2.4, -39), s(-3.8, -44), s(-6.0, -58)], { w: 0.4, c: INK, boil: false });
      g.fill2([s(-6.8, -58), s(-3.6, -59.2), s(-4.0, -61.4), s(-6.4, -60.8)], CD);
      g.fill2([s(-6.4, -61), s(-4.2, -61.8), s(-4.4, -65.4), s(-5.4, -67.4), s(-6.0, -64.6)], '#E8B33C'); g.fill2([s(-5.8, -62), s(-4.8, -62.4), s(-5.2, -65)], '#F6E3A0');
      // the head and the crown of seven rays
      g.fill2([s(-1.4, -42), s(1.6, -42), s(1.4, -44.6), s(-1.2, -44.6)], CU); g.disc2(s(0.2, -46.6), 2.6, CU); g.fill2(arcPts(c[0] + 0.9, c[1] - 46.6, 2.2, -1.2, 1.4, 6), CD);
      for (let k = 0; k < 7; k++) { const a = -Math.PI * 0.95 + Math.PI * 0.9 * k / 6, r0 = 2.8, r1 = 5.6; g.fill2([[c[0] + 0.2 + Math.cos(a - 0.12) * r0, c[1] - 47.4 + Math.sin(a - 0.12) * r0], [c[0] + 0.2 + Math.cos(a) * r1, c[1] - 47.4 + Math.sin(a) * r1], [c[0] + 0.2 + Math.cos(a + 0.12) * r0, c[1] - 47.4 + Math.sin(a + 0.12) * r0]], CU, true); }
      g.line2(robe.concat([robe[0]]), { w: 0.6, c: INK, boil: false, wob: 0.3 });
      g.disc2(s(-0.5, -46.4), 0.3, INK); g.disc2(s(1.1, -46.4), 0.3, INK);
    }, { name: 'statue' });
    // a flagpole on the walk, visitors strolling round the island, a group taking a photo
    T.obj([IX + 9.4, IY + 3], (g) => { const b = g.p(IX + 9.4, IY + 3, 0), t = g.p(IX + 9.4, IY + 3, 11); g.line2([b, t], { w: 0.55, c: '#5E5A52', boil: false }); g.disc2(t, 0.5, C.gold); }, { name: 'flagpole' });
    NK.flagActor(T, IX + 9.4, IY + 3, 10.6, { w: 4, h: 2.6, dir: 'x' });
    const ring = [[IX - 9.2, IY], [IX - 5.6, IY - 8.2], [IX + 4, IY - 9], [IX + 9.4, IY - 3], [IX + 8.4, IY + 5.6], [IX + 1, IY + 9.2], [IX - 7.4, IY + 6.4]];
    for (let k = 0; k < 4; k++) NK.walker(T, k % 2 ? NK.tourist(2100 + k) : NK.who(2100 + k), ring, 2.4, { phase: k / 4 });
    T.cast([IX + 5, IY + 9], (g) => { NK.person(g, IX + 5.6, IY + 9.4, 0, NK.tourist(2110, { dir: 3, pose: 'hold', phone: true })); NK.person(g, IX + 3.6, IY + 8.4, 0, NK.who(2111, { dir: 1, pose: 'wave', ph: 0.2 })); NK.person(g, IX + 2.4, IY + 9.2, 0, NK.tourist(2112, { dir: 1, k: 0.75 })); }, { name: 'photo' });
    // the Staten Island ferry: a long orange double-ender, three decks, a pilot house at each end
    T.actor({ sample: 0.3, period: 28, grow: false,
      at(t) { const u = (t / 28) % 1, x = lerp(-34, 34, u), a = Math.min(1, (x + 30) / 8, (24 - x) / 6); if (a <= 0.02) return null; return { x, y: 15, z: 0, key: 0, alpha: a < 1 ? a : null }; },
      draw(g) {
        const OR = '#E8742C', ORT = { t: '#F08A44', l: OR, r: '#C95E1E' };
        g.fill(K.rect(-9.5, -3.2, 9.5, 3.2, 0), '#DCEAF3');
        const hull = K.rbox(g, 0, 0, 8.6, 2.6, 0, 0, 1.6, ORT, { w: 0.8 });
        const d2 = K.rbox(g, 0, 0, 7.6, 2.3, 0, 1.6, 3.4, ORT, { w: 0.7, nb: true });
        for (const f of ['pv']) for (let i = 0; i < 10; i++) K.rwin(g, d2, f, -0.92 + i * 0.185, -0.92 + i * 0.185 + 0.13, 2.2, 3.0, { glint: false, col: '#3F4D5C' });
        const d3 = K.rbox(g, 0, 0, 5.2, 1.9, 0, 3.4, 4.9, { t: '#F6F2E8', l: '#F3F1EA', r: '#DAD6CC' }, { w: 0.6, nb: true });
        for (let i = 0; i < 7; i++) K.rwin(g, d3, 'pv', -0.9 + i * 0.26, -0.9 + i * 0.26 + 0.18, 3.8, 4.5, { glint: false, col: '#3F4D5C' });
        for (const u of [-4.2, 4.2]) K.rbox(g, u, 0, 0.9, 1.2, 0, 4.9, 6.1, { t: '#F6F2E8', l: '#F3F1EA', r: '#DAD6CC' }, { w: 0.5 });
        const m = g.p(0, 0, 4.9), mt = g.p(0, 0, 9); g.line2([m, mt], { w: 0.5, boil: false });
        NK.text(g, 'L', 2.32, -5.6, 2.2, 0.8, 'STATEN ISLAND', '#F6F2E8', { w: 0.35 });
        void hull;
        const wk = []; for (let k = 0; k < 6; k++) { const p = g.p(-9.5 - k * 2.2, (k % 2 ? 1 : -1) * (1.6 + k * 0.5), 0); wk.push(p[0], p[1], p[0] - 3, p[1] - 0.4); } g.segs2(wk, '#F6F7F3', 0.8);
      } });
    // a Circle Line boat heading up the harbour
    T.actor({ sample: 0.3, period: 28, grow: false,
      at(t) { const u = ((t + 14) / 28) % 1, y = lerp(30, -30, u), a = Math.min(1, (y + 28) / 6, (28 - y) / 6); if (a <= 0.02) return null; return { x: -18, y, z: 0, key: 0, alpha: a < 1 ? a : null }; },
      draw(g) { K.boat(g, -Math.PI / 2, { kind: 'steamer', L: 4.2, W: 1.7, hull: '#F3F1EA', stripe: '#2F5E9A', stackCol: { t: '#2F4A7A', l: '#2F5E9A', r: '#244E84' } }); } });
  });

  /* ======================= the Brooklyn Bridge ======================= */
  SF.tile('bridge', -226, 0, { rim: 76, castAt: 136, order: -3, half: 30 }, function (T) {
    const RX = 12.5, DZ = 6, PZ = 9.6, TX = 11, TOP = 23, GR = { t: '#E3DACB', l: '#D9CDB6', r: '#BFB29A' };
    T.ground(function (g) {
      blob(g, [[-34, -10], [-26, -30], [0, -33], [26, -28], [34, -6], [30, 22], [6, 32], [-20, 30], [-33, 14]], '#E1DCD0', 31, 1.0);
      // the river reach, with ripples; the Brooklyn shore's pebble beach; grass on the Manhattan side
      const riv = [[-RX, -31], [RX, -30], [RX + 0.5, 31], [-RX + 0.5, 31.5]];
      blob(g, riv.map((p) => [p[0], p[1]]), C.water, 32, 0.9);
      g.water(K.rect(-RX + 1, -26, RX - 1, 27), { dens: 1.0 });
      for (const s of [-1, 1]) g.line([[s * RX, -29, 0], [s * RX, 30, 0]], { w: 0.6, c: '#5F7F9C', boil: false });
      blob(g, [[-RX - 0.2, 6], [-RX - 4, 7], [-RX - 4.5, 20], [-RX - 0.2, 22]], '#D9CCB0', 33, 0.6);
      g.scuff(K.rect(-RX - 4, 8, -RX, 20), { dir: 0.2, len: 0.8, c: '#B9A88A', dens: 1.2, w: 0.8, spread: 2 });
      g.fill(K.rect(RX + 4, 6, 28, 22), '#B5CF8E'); g.grass(K.rect(RX + 4, 6, 28, 22), { dens: 0.6 });
      g.fill(K.rect(RX, -26, RX + 4, 26), '#E9E5DC'); g.line([[RX + 4, -26, 0], [RX + 4, 26, 0]], { w: 0.4, c: '#A39C8C', boil: false });
    });
    // DUMBO: brick warehouses on the Brooklyn side, the far one with a water tank
    T.obj([-31, -30, -19, -19], (g) => { NK.walkup(g, -31, -30, -19, -19, 3, { face: 'R', col: '#A85A48', fh: 3.6, shop: { col: '#2F4A3A', word: 'BOOKS', awning: '#2F4A3A' }, tx: 0.4, ty: 0.4 }); }, { name: 'dumbo far' });
    T.obj([-31, 11, -19, 27], (g) => {
      const h = NK.walkup(g, -31, 11, -19, 27, 3, { face: 'R', col: '#B9654C', fh: 3.8, fire: false, tank: false, shop: { col: '#6E5A44', word: 'CAFE', awning: '#C9584B', stripe: '#F6F2E8' } });
      // the clock tower on its roof
      K.box(g, -27.5, 13, -22.5, 18, h + 0.5, h + 7, { t: '#C9BFA9', l: '#B9654C', r: '#9A4F3B' }, { w: 0.7 });
      for (const [f, pl, c] of [['L', 18, -25], ['R', -22.5, 15.5]]) { const p = g.p.apply(g, K.pt(f, pl + 0.05, c, h + 4.4)); g.disc2(p, 4.2, '#F6F1E2'); g.ring2(p, 4.2, { w: 0.5, c: '#3A3128' }); g.segs2([p[0], p[1], p[0], p[1] - 2.8, p[0], p[1], p[0] + 1.8, p[1] + 0.6], '#3A3128', 0.4); }
      K.hip(g, -27.8, 12.7, -22.2, 18.3, h + 7, 2.6, '#6E7A86', {});
    }, { name: 'dumbo clock' });
    // the approach viaducts: granite piers with arches, under the deck
    for (const [x0, x1] of [[-30, -RX - 1.5], [RX + 1.5, 30]]) T.obj([x0, -4.4, x1, 4.4], (g) => {
      K.box(g, x0, -4.2, x1, 4.2, 0, DZ - 0.6, GR, { w: 0.85 });
      const n = Math.round((x1 - x0) / 6);
      for (let i = 0; i < n; i++) { const a0 = x0 + (x1 - x0) * i / n + 1.1, a1 = x0 + (x1 - x0) * (i + 1) / n - 1.1; K.win(g, 'L', 4.22, a0, a1, 0, DZ - 1.8, { style: 'dark', arch: true, w: 0.5, col: '#5A524A' }); }
      if (x0 > 0) K.win(g, 'R', x1 + 0.02, -2.8, 2.8, 0, DZ - 1.8, { style: 'dark', arch: true, w: 0.5, col: '#5A524A' });
    }, { name: 'approach' });
    // the two cable planes' curve: tower top -> mid-span -> anchorages
    const cableZ = (x) => { const ax = Math.abs(x); return ax <= TX ? PZ + 1.6 + (TOP - 1 - PZ - 1.6) * Math.pow(ax / TX, 2) : TOP - 1 - (TOP - 1 - DZ - 1) * Math.min(1, Math.pow((ax - TX) / (28 - TX), 0.8)); };
    const deck = (y0, y1, z, inner, name) => T.obj([-30, y0, 30, y1], function (g) {
      g.boilP = 0.2;
      // the stiffening truss on the edge we see, the deck, the parapets
      if (!inner) {
        const yy = y1;
        g.fill([[-30, yy, z - 1.4], [30, yy, z - 1.4], [30, yy, z], [-30, yy, z]], y1 > 0 ? '#C9C1AE' : '#B7AF9E');
        const tr = []; for (let x = -29; x < 29; x += 1.5) { const a = g.p(x, yy + 0.02, z - 1.4), b = g.p(x + 0.75, yy + 0.02, z), c = g.p(x + 1.5, yy + 0.02, z - 1.4); tr.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); } g.segs2(tr, '#8C8576', 0.35);
        g.line([[-30, yy, z - 1.4], [30, yy, z - 1.4]], { w: 0.6, boil: false });
      }
      g.fill(K.rect(-30, y0, 30, y1, z), inner ? '#C9B48E' : '#BDB7A8');
      if (inner) { const pl = []; for (let x = -29.5; x < 30; x += 0.9) { const a = g.p(x, y0, z + 0.02), b = g.p(x, y1, z + 0.02); pl.push(a[0], a[1], b[0], b[1]); } g.segs2(pl, '#A8936C', 0.3); const posts = []; for (let x = -30; x <= 30; x += 3) for (const yy of [y0, y1]) { const a = g.p(x, yy, z - 3.6), b = g.p(x, yy, z); posts.push(a[0], a[1], b[0], b[1]); } g.segs2(posts, '#6E665C', 0.45); }
      for (const yy of (inner ? [y0, y1] : [y1])) g.fine([[-30, yy, z + 1.1], [30, yy, z + 1.1]], { w: 0.4, c: '#6E665C' });
      // the main cable on this plane, its suspenders and the diagonal stays fanning from the tower tops
      const cy = inner ? (y0 + y1) / 2 : (y1 > 0 ? y1 : y0), cz = inner ? z : z, pts = [];
      if (!inner || true) {
        const cyc = inner ? (y0 + y1) / 2 : cy;
        for (let x = -28; x <= 28; x += 1) pts.push([x, cyc, cableZ(x)]);
        const sus = []; for (let x = -27; x < 28; x += 1.2) { if (Math.abs(Math.abs(x) - TX) < 1.6) continue; const a = g.p(x, cyc, cableZ(x)), b = g.p(x, cyc, cz + (inner ? 0.2 : 1.1)); sus.push(a[0], a[1], b[0], b[1]); } g.segs2(sus, '#7E776A', 0.28);
        const st = []; for (const sx of [-1, 1]) for (let k = 1; k <= 7; k++) for (const dir of [-1, 1]) { const x = sx * TX + dir * k * 2.4; if (Math.abs(x) > 28) continue; const a = g.p(sx * TX, cyc, TOP - 1.5), b = g.p(x, cyc, cz + 1.0); st.push(a[0], a[1], b[0], b[1]); } g.segs2(st, '#7E776A', 0.3);
        g.line(pts, { w: 1.0, c: '#5E574C', boil: false, ext: 0 });
      }
    }, { name: name, under: inner ? PZ - 1 : DZ - 1 });
    deck(-4.4, -1.4, DZ, false, 'roadway far');
    deck(-1.2, 1.2, PZ, true, 'promenade');
    deck(1.4, 4.4, DZ, false, 'roadway near');
    // the towers: granite, a pair of tall pointed arches (open) for the roadways, a cornice, standing in the river
    for (const sx of [-1, 1]) {
      const x0 = sx * TX - 1.6, x1 = sx * TX + 1.6, y0 = -5.0, y1 = 5.0;
      T.obj([x0, y0, x1, y1], function (g) {
        g.boilP = 0.3;
        K.box(g, x0 - 0.4, y0 - 0.4, x1 + 0.4, y1 + 0.4, 0, 2.2, GR, { w: 0.8 });
        // the R face (towards Manhattan / us) with the two arches open; the L face (the tower's side) solid
        const ar = (a0, a1) => { const pts = []; const m = (a0 + a1) / 2, r = (a1 - a0) / 2; for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12, tz = 15 + 3.4 * Math.sin(t) * (1 - 0.35 * Math.abs(Math.cos(t))); pts.push([m + r * Math.cos(t), tz]); } return pts; };
        g.fill(K.on('L', y1, x0, x1, 2.2, TOP), GR.l);
        const face = (A, B) => g.fill([[x1, A[0], A[1]], [x1, B[0], B[1]], [x1, B[0], TOP], [x1, A[0], TOP]], GR.r);
        g.fill(K.on('R', x1, y0, -3.7, 2.2, TOP), GR.r); g.fill(K.on('R', x1, -0.7, 0.7, 2.2, TOP), GR.r); g.fill(K.on('R', x1, 3.7, y1, 2.2, TOP), GR.r);
        for (const [a0, a1] of [[-3.7, -0.7], [0.7, 3.7]]) { const pa = ar(a0, a1); for (let i = 0; i < pa.length - 1; i++) face(pa[i + 1], pa[i]); const ins = pa.map(([a, z]) => [x1 - 0.05, a, z]); g.line(ins, { w: 0.6, c: '#6E665C', boil: false }); const jamb = []; for (const a of [a0, a1]) { const p0 = g.p(x1, a, 2.2), p1 = g.p(x1, a, 15); jamb.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(jamb, '#6E665C', 0.55); g.fill([[x1 - 0.02, a0, 2.2], [x1 - 0.02, a0 + 0.5, 2.2], [x1 - 0.02, a0 + 0.5, 15], [x1 - 0.02, a0, 15]], '#A69A82'); }
        // coursing, the cornice and the cap
        const cs = []; for (let z = 3.4; z < TOP - 1; z += 1.6) for (const [f, pl, A0, A1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) { const p0 = g.p.apply(g, K.pt(f, pl + 0.03, A0, z)), p1 = g.p.apply(g, K.pt(f, pl + 0.03, A1, z)); if (f === 'R' && z > 2.2 && z < 18.5) { for (const [b0, b1] of [[y0, -3.7], [-0.7, 0.7], [3.7, y1]]) { const q0 = g.p(x1 + 0.03, b0, z), q1 = g.p(x1 + 0.03, b1, z); cs.push(q0[0], q0[1], q1[0], q1[1]); } continue; } cs.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(cs, '#B3A68C', 0.3);
        g.line([[x0, y1, 2.2], [x0, y1, TOP]], { w: 0.85, boil: false }); g.line([[x1, y1, 2.2], [x1, y1, TOP]], { w: 0.7, boil: false }); g.line([[x1, y0, 2.2], [x1, y0, TOP]], { w: 0.85, boil: false });
        K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, TOP, TOP + 0.8, GR, { w: 0.7, boil: false });
        K.box(g, x0 + 0.2, y0 + 0.2, x1 - 0.2, y1 - 0.2, TOP + 0.8, TOP + 1.6, GR, { w: 0.6, boil: false });
      }, { name: 'tower', under: 18.4 });
    }
    // cars both ways on the roadways
    for (let k = 0; k < 4; k++) {
      const dir = k % 2 ? 1 : -1, y = dir > 0 ? 2.9 : -2.9, col = ['#F2C12E', '#2F3238', '#C9CCCC', '#F2C12E'][k];
      T.actor({ sample: 0.2, period: 8, grow: false, cast: true,
        at(t) { const u = ((t * 8 + k * 31) % 64) / 64, x = dir > 0 ? lerp(-32, 32, u) : lerp(32, -32, u), a = Math.min(1, (30 - Math.abs(x)) / 4, Math.max(0, (Math.abs(Math.abs(x) - TX) - 6.9) / 2)); if (a <= 0.02) return null; return { x, y, z: DZ, key: 0, alpha: a < 1 ? a : null }; },
        draw(g) { if (col === '#F2C12E') NK.cab(g, dir > 0 ? 0 : Math.PI); else K.car(g, dir > 0 ? 0 : Math.PI, { col }); } });
    }
    // walkers and cyclists on the promenade: the main span between the towers and the two approaches
    const pw = [[-9, 9, 2.4, 0.0], [-9, 9, 2.8, 0.5], [14, 28, 2.6, 0.2], [-28, -14, 2.2, 0.7], [14, 28, 2.0, 0.6], [-9, 9, 2.1, 0.8]];
    pw.forEach(([a, b, sp, ph], k) => {
      const yy = k % 2 ? 0.55 : -0.55, who = k === 2 ? NK.tourist(2200 + k) : NK.who(2200 + k);
      T.actor({ sample: 0.25, period: 2 * (b - a) / sp,
        at(t) { const L = b - a, d = ((t * sp + ph * 2 * L) % (2 * L)), fw = d < L, x = fw ? a + d : b - (d - L), dir = fw ? 0 : 2, p = Math.floor((d / 2.4) % 1 * 8); return { x, y: yy, z: PZ, key: dir + '.' + p, dir, ph: p / 8 }; },
        draw(g, st) { NK.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
    });
    for (let k = 0; k < 2; k++) T.actor({ sample: 0.2, period: 6, grow: false,
      at(t) { const u = ((t * 7 + k * 15) % 34) / 34, x = k ? lerp(28, -5, u) : lerp(-28, 5, u), a = Math.min(1, (29 - Math.abs(x)) / 3); if (Math.abs(x) > 8.8 && Math.abs(x) < 13.6) return null; return { x, y: k ? 0.3 : -0.3, z: PZ, key: 0, alpha: a < 1 ? a : null }; },
      draw(g) { K.bike(g, k ? Math.PI : 0, { col: k ? '#2F6DB5' : '#C9463E', seed: 2240 + k }); } });
    // a NYC Ferry passing under the bridge
    T.actor({ sample: 0.3, period: 22, grow: false,
      at(t) { const u = (t / 22) % 1, y = lerp(32, -32, u), a = Math.min(1, (30 - Math.abs(y)) / 5); if (a <= 0.02) return null; return { x: -2.5, y, z: 0, key: 0, alpha: a < 1 ? a : null }; },
      draw(g) { K.boat(g, -Math.PI / 2, { kind: 'ferry', L: 4.6, W: 1.9, hull: '#F3F1EA', stripe: '#2F5E9A', stackCol: { t: '#2F4A7A', l: '#2F5E9A', r: '#244E84' } }); } });
    // the pebble beach: people sitting looking at the view; photographers on the Manhattan side
    T.cast([-14.5, 12], (g) => { NK.person(g, -14.6, 11, 0, NK.who(2250, { dir: 0, pose: 'sit' })); NK.person(g, -15, 13.2, 0, NK.who(2251, { dir: 0, pose: 'sit', dress: '#D98AA4' })); }, { name: 'beach' });
    T.cast([-14.2, 18], (g) => NK.person(g, -14.2, 18, 0, NK.tourist(2252, { dir: 0, pose: 'hold', phone: true })), { name: 'beach' });
    T.cast([14.2, 10], (g) => { NK.person(g, 14.2, 10, 0, NK.tourist(2253, { dir: 2, pose: 'hold', phone: true })); NK.person(g, 15, 12, 0, NK.who(2254, { dir: 2 })); }, { name: 'esplanade' });
    for (const [x, y] of [[21, 10], [26, 17], [19, 21]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.2, h: 4.4 }), { name: 'tree' });
  });

  /* ======================= Yankee Stadium ======================= */
  SF.tile('yankee', -4, 234, { rim: 84, castAt: 144, order: 3, half: 30 }, function (T) {
    const HX = -15, HY = -15, FR = 25.5, BASE = 8;
    const at = (r, th) => [HX + r * Math.cos(th), HY + r * Math.sin(th)];
    const PIN = { top: '#F3F1EA', bot: '#F3F1EA', cap: '#2F3A55', bare: false, shorts: false, dress: undefined, glasses: false };
    const GREY = { top: '#B9B6AE', bot: '#B9B6AE', cap: '#2F3A55', bare: false, shorts: false, dress: undefined, glasses: false };
    T.ground(function (g) {
      g.boilP = 0.2;
      blob(g, [[-33, -12], [-28, -32], [-6, -34], [20, -30], [33, -8], [30, 18], [12, 32], [-14, 31], [-32, 14]], '#E4DDCB', 41, 0.8);
      // the outfield grass inside the fence, mown in stripes; the infield dirt and its grass square; the mound, the plate
      const fence = [[HX, HY]]; for (let i = 0; i <= 24; i++) fence.push(at(FR, (Math.PI / 2) * i / 24));
      g.fill(fence.map((p) => [p[0], p[1], 0]), '#93C267');
      for (let k = 1; k < 8; k++) { const r0 = FR * k / 8, arc = []; for (let i = 0; i <= 16; i++) arc.push([...at(r0, (Math.PI / 2) * i / 16), 0]); g.line(arc, { w: 2.4, c: k % 2 ? '#A2CC78' : '#88B85C', boil: false, ext: 0 }); }
      const dirt = [[HX, HY]]; for (let i = 0; i <= 16; i++) dirt.push(at(13.2, (Math.PI / 2) * i / 16));
      g.fill(dirt.map((p) => [p[0], p[1], 0]), '#D9B98A');
      g.fill(K.rect(HX + 1.6, HY + 1.6, HX + BASE - 1.2, HY + BASE - 1.2), '#93C267');
      g.fill(K.arc(HX + 4.6, HY + 4.6, 0, 1.4, 0, TAU, 12), '#D9B98A');
      g.fill(K.arc(HX, HY, 0, 2.2, 0, TAU, 14), '#D9B98A');
      for (const [x, y] of [[HX + BASE, HY], [HX + BASE, HY + BASE], [HX, HY + BASE]]) g.fill(K.rect(x - 0.45, y - 0.45, x + 0.45, y + 0.45, 0.02), '#FBF8EE');
      g.fill([[HX - 0.4, HY], [HX, HY - 0.4], [HX + 0.4, HY], [HX + 0.4, HY + 0.4], [HX, HY + 0.4]].map((p) => [p[0], p[1], 0.02]), '#FBF8EE');
      g.line([[HX, HY, 0.02], [HX + FR, HY, 0.02]], { w: 0.6, c: '#FBF8EE', boil: false }); g.line([[HX, HY, 0.02], [HX, HY + FR, 0.02]], { w: 0.6, c: '#FBF8EE', boil: false });
      // foul territory and the warning track
      const track = []; for (let i = 0; i <= 24; i++) track.push([...at(FR, (Math.PI / 2) * i / 24), 0]); g.line(track, { w: 2.2, c: '#D9B98A', boil: false, ext: 0 });
      g.fill(K.rect(-25, -25, HX + FR + 1, HY - 1.5), '#93C267'); g.fill(K.rect(-25, -25, HX - 1.5, HY + FR + 1), '#93C267');
      g.fill(K.arc(HX, HY, 0, 2.2, 0, TAU, 14), '#D9B98A');
    });
    // the grandstands along both foul lines: four lower rows, three upper rows, the roof and the white frieze
    const SEAT_COLS = ['#2F4A7A', '#3F5F8F'];
    const bust2 = (g, p, w) => {
      g.fill2([[p[0] - 2.6, p[1]], [p[0] + 2.6, p[1]], [p[0] + 2.2, p[1] - 4.2], [p[0] - 2.2, p[1] - 4.2]], w.top, true);
      g.fill2([[p[0] - 0.55, p[1] - 4.1], [p[0] + 0.55, p[1] - 4.1], [p[0] + 0.55, p[1] - 5.3], [p[0] - 0.55, p[1] - 5.3]], w.skin, true);
      g.disc2([p[0], p[1] - 7.2], 1.9, w.skin);
      g.fill2(arcPts(p[0], p[1] - 7.4, 2.0, Math.PI * 1.05, Math.PI * 1.95, 6), w.cap || w.hair, true);
    };
    const crowd = []; for (let i = 0; i < 40; i++) { const R = RNG(2300 + i); crowd.push({ top: R() < 0.45 ? '#F3F1EA' : R() < 0.5 ? '#2F3A55' : R.pick(CLOTH), skin: R.pick(SKIN), hair: R.pick(HAIR), cap: R() < 0.5 ? '#2F3A55' : null }); }
    const stand = (axis) => {
      // axis 'y': the stand runs along y at x from -29 (back) to -19 (front); 'x': along x at y from -29 to -19
      const A0 = -29, A1 = 15, P = axis === 'y' ? (d, a, z) => [d, a, z] : (d, a, z) => [a, d, z];
      const fp = axis === 'y' ? [-30, -30, -18.5, A1] : [-18.5, -30, A1, -18.5];
      T.obj(fp, function (g) {
        g.boilP = 0.15;
        const rows = [[-27.4, 9.8], [-25.4, 8.6], [-23.6, 7.4], [-22.4, 3.6], [-21.2, 2.6], [-20.0, 1.6], [-18.8, 0.6]];
        // the back wall and the upper deck's facia
        const wall = [P(-29.6, A0, 0), P(-29.6, A1, 0), P(-29.6, A1, 13), P(-29.6, A0, 13)]; void wall;
        let si = axis === 'y' ? 0 : 17; const lo = axis === 'x' ? -18.5 : A0;
        for (let r = 0; r < rows.length; r++) {
          const [d, z] = rows[r], d2 = r + 1 < rows.length ? rows[r + 1][0] : -18.5, z2 = r + 1 < rows.length ? rows[r + 1][1] : 0;
          // the tread and the riser of this row
          g.fill([P(d - 1, lo, z), P(d - 1, A1, z), P(d2, A1, z), P(d2, lo, z)], r < 3 ? '#4A5A78' : '#5A6E8C');
          g.fill([P(d2, lo, z), P(d2, A1, z), P(d2, A1, z2), P(d2, lo, z2)], r === 2 ? '#3A4256' : '#46536C');
          if (r === 2) { const fz = [P(d2, lo, z - 0.2), P(d2, A1, z - 0.2), P(d2, A1, z - 1.6), P(d2, lo, z - 1.6)]; g.fill(fz, '#E9E6DE'); }
          // the fans in this row
          for (let a = lo + 1.0; a < A1 - 0.6; a += 1.9) {
            si++; if (h1(si * 7.3 + r) < 0.12) continue;
            bust2(g, g.p.apply(g, P(d - 0.4, a + (h1(si) - 0.5) * 0.4, z)), crowd[si % crowd.length]);
          }
        }
        // the roof over the upper deck and the white frieze along its front edge
        const rz = 13.6;
        g.fill([P(-29.8, A0, rz), P(-29.8, A1, rz), P(-24.6, A1, rz), P(-24.6, A0, rz)], '#8E949C');
        const fr = [P(-24.6, A0, rz), P(-24.6, A1, rz), P(-24.6, A1, rz - 1.6), P(-24.6, A0, rz - 1.6)];
        g.fill(fr, '#F6F3EA');
        const sc = []; for (let a = A0 + 0.8; a < A1 - 0.4; a += 1.2) { const pts = []; for (let i = 0; i <= 6; i++) { const t = Math.PI * i / 6; pts.push(g.p.apply(g, P(-24.58, a + 0.5 * Math.cos(t) - 0.0, rz - 1.4 + 0.9 * Math.sin(t)))); } sc.push(pts); }
        for (const pts of sc) g.fine2(pts, { w: 0.35, c: '#9AA0A8' });
        g.line([fr[2], fr[3]], { w: 0.6, c: '#6E7A86', boil: false }); g.line([fr[0], fr[1]], { w: 0.6, c: '#6E7A86', boil: false });
        const posts = []; for (let a = A0 + 2; a < A1; a += 6) { const p0 = g.p.apply(g, P(-24.8, a, 9.8)), p1 = g.p.apply(g, P(-24.8, a, rz - 1.6)); posts.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(posts, '#6E7A86', 0.5);
        // the field-level wall in front of the first row
        g.fill([P(-18.5, lo, 0), P(-18.5, A1, 0), P(-18.5, A1, 1.0), P(-18.5, lo, 1.0)], '#2F4A7A');
        g.line([P(-18.5, lo, 1.0), P(-18.5, A1, 1.0)], { w: 0.55, boil: false });
      }, { name: 'stand ' + axis });
    };
    stand('x'); stand('y');
    // the outfield bleachers and the outer wall, in pieces round the arc
    const NB = 6;
    for (let i = 0; i < NB; i++) {
      const t0 = (Math.PI / 2) * i / NB + 0.01, t1 = (Math.PI / 2) * (i + 1) / NB - 0.01, pa = at(FR + 6, t0), pb = at(FR + 6, t1), pc = at(FR, t0), pd = at(FR, t1);
      const fp = [Math.min(pa[0], pb[0], pc[0], pd[0]), Math.min(pa[1], pb[1], pc[1], pd[1]), Math.max(pa[0], pb[0], pc[0], pd[0]), Math.max(pa[1], pb[1], pc[1], pd[1])];
      T.obj(fp, function (g) {
        const arc = (r, z, A, B) => { const p = []; for (let k = 0; k <= 4; k++) p.push([...at(r, lerp(A, B, k / 4)), z]); return p; };
        // the padded wall, then three rows of bleachers stepping up away from the field, then the outer face
        g.fill(arc(FR, 0, t0, t1).concat(arc(FR, 1.2, t1, t0)), '#2F4A7A');
        let si = i * 40 + 7;
        for (let r = 0; r < 3; r++) {
          const r0 = FR + 0.4 + r * 1.8, r1 = r0 + 1.8, z = 1.2 + r * 0.9;
          g.fill(arc(r0, z, t0, t1).concat(arc(r1, z, t1, t0)), '#5A6E8C');
          for (let k = 0; k <= 4; k++) { const th = lerp(t0, t1, (k + 0.5) / 5); si++; if (h1(si * 3.1) < 0.15) continue; bust2(g, g.p(...at(r0 + 0.8, th), z), crowd[si % crowd.length]); }
        }
        const outer = arc(FR + 6, 0, t0, t1).concat(arc(FR + 6, 3.9, t1, t0));
        g.fill(outer, '#D3C6A6'); g.fill(arc(FR + 6, 3.1, t0, t1).concat(arc(FR + 6, 3.9, t1, t0)), '#E6DCC2'); g.line(arc(FR + 6, 3.9, t0, t1), { w: 0.6, boil: false }); g.line(arc(FR + 6, 0, t0, t1), { w: 0.7, boil: false });
        const ar = []; for (let k = 0; k < 4; k++) { const th = lerp(t0, t1, (k + 0.5) / 4); const p0 = g.p(...at(FR + 6.02, th), 0), p1 = g.p(...at(FR + 6.02, th), 2.4); ar.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(ar, '#8E8068', 1.4);
        if (i === 2 || i === 3) { const th = (t0 + t1) / 2; NK.textP(g, (a, z) => { const p = at(FR + 6.05, th - a / (FR + 6)); return [p[0], p[1], z]; }, 0, 2.3, 1.1, i === 2 ? 'STADIUM' : 'YANKEE', '#B8902A', { center: true, w: 0.5 }); }
      }, { name: 'bleachers' });
    }
    // the video board at the end of the first-base stand
    T.obj([16, -29, 24, -24], (g) => { K.box(g, 17, -27.6, 23, -26.2, 0, 6, '#5A5650', { w: 0.6 }); const q = K.on('L', -26.15, 16, 24, 6, 12); g.fill(q, '#2A2F38'); g.outline(q, { w: 0.6, boil: false }); g.fill(K.on('L', -26.1, 16.6, 23.4, 6.6, 11.4), '#3F6FA8'); NK.text(g, 'L', -26.05, 20, 8.2, 1.4, 'NY', '#F6F3EA', { center: true, w: 0.6 }); }, { name: 'board' });

    /* ---------------- the game ---------------- */
    const CYC = 4.0;
    const fielders = [[at(12, 0.12), 0.3], [at(11.5, 0.55), -0.4], [at(11.5, 1.02), 0.2], [at(12, 1.45), -0.2], [at(20, 0.32), 0.1], [at(20.5, Math.PI / 4), -0.1], [at(20, 1.25), 0.2]];
    fielders.forEach(([p, sw], k) => T.cast([p[0], p[1]], (g) => NK.person(g, p[0], p[1], 0, NK.who(2400 + k, Object.assign({}, PIN, { dir: 2, pose: 'crouch', sway: sw }))), { name: 'fielder' }));
    T.cast([HX - 1.2, HY - 1.0], (g) => { NK.person(g, HX - 2.4, HY - 2.2, 0, NK.who(2410, { top: '#2F2C2A', bot: '#6E6A62', cap: '#2F2C2A', dir: 0, pose: 'crouch', bare: false })); NK.person(g, HX - 1.1, HY - 1.0, 0, NK.who(2411, Object.assign({}, PIN, { dir: 0, pose: 'crouch', glove: '#7A5A3C' }))); }, { name: 'catcher' });
    // the pitcher: set, wind-up, throw
    T.actor({ sample: 5, period: 10,
      at(t) { const u = (t % CYC) / CYC, k = u < 0.35 ? 0 : u < 0.5 ? 1 : u < 0.62 ? 2 : 0; return { x: HX + 4.6, y: HY + 4.6, z: 0.3, key: k, k }; },
      draw(g, st) { NK.person(g, 0, 0, 0, NK.who(2420, Object.assign({}, PIN, { dir: 2, pose: st.k === 0 ? 'hold' : st.k === 1 ? 'cheer' : 'wave', ph: st.k === 2 ? 0.7 : 0.1, glove: '#7A5A3C' }))); } });
    // the batter in grey with a red helmet: waiting, then the swing; every other pitch is hit
    T.actor({ sample: 5, period: 10,
      at(t) { const u = (t % CYC) / CYC, n = Math.floor(t / CYC), k = u < 0.6 ? 0 : u < 0.75 ? 1 : 2, hit = n % 2 === 0; return { x: HX + 1.4, y: HY - 1.2, key: k + (hit ? 'h' : 'm'), k }; },
      draw(g, st) {
        const r = NK.person(g, 0, 0, 0, NK.who(2430, Object.assign({}, GREY, { dir: 1, pose: 'hold', cap: '#C9463E', reach: st.k === 0 ? [-2.6, -15.5] : [3.4, -11.5] })));
        const h = r.hands[0], tip = st.k === 0 ? [h[0] - 3.4, h[1] - 6.2] : st.k === 1 ? [h[0] + 7.4, h[1] - 0.6] : [h[0] + 3.0, h[1] - 6.8];
        g.line2([h, tip], { w: 1.0, c: '#C9A26B', boil: false, ext: 0 });
      } });
    T.actor({ sample: 0.1, period: 2 * CYC, grow: false,
      at(t) {
        const u = (t % CYC) / CYC, n = Math.floor(t / CYC), hit = n % 2 === 0, A = [HX + 4.3, HY + 4.3], B = [HX + 0.4, HY + 0.4];
        if (u < 0.5) return null;
        if (u < 0.66) { const f = (u - 0.5) / 0.16; return { x: lerp(A[0], B[0], f), y: lerp(A[1], B[1], f), z: lerp(5.2, 3.0, f), key: 0 }; }
        if (!hit) return null;
        const f = Math.min(1, (u - 0.66) / 0.34), C2 = at(23, Math.PI / 4 + 0.15); return { x: lerp(B[0], C2[0], f), y: lerp(B[1], C2[1], f), z: 3 + Math.sin(f * Math.PI) * 14, key: 0 };
      },
      draw(g) { const c = g.p(0, 0, 0); g.disc2(c, 0.7, '#FBF8EE'); g.ring2(c, 0.7, { w: 0.3, c: '#8C8576' }); } });
    // the centre fielder running back for it, fans jumping up in the bleachers
    T.actor({ sample: 0.3, period: 2 * CYC,
      at(t) { const u = (t % CYC) / CYC, n = Math.floor(t / CYC), f = n % 2 === 0 && u > 0.66 ? Math.min(1, (u - 0.66) / 0.3) : 0, p0 = at(20.5, Math.PI / 4 + 0.05), p1 = at(22.6, Math.PI / 4 + 0.15), ph = Math.floor((t * 6) % 8); return { x: lerp(p0[0], p1[0], f), y: lerp(p0[1], p1[1], f), key: f > 0 && f < 1 ? 'r' + ph : 's', run: f > 0 && f < 1, ph: ph / 8 }; },
      draw(g, st) { NK.person(g, 0, 0, 0, NK.who(2440, Object.assign({}, PIN, { dir: 0, pose: st.run ? 'walk' : 'crouch', ph: st.ph, glove: '#7A5A3C' }))); } });
    for (let k = 0; k < 5; k++) {
      const th = 0.25 + k * 0.27, p = at(FR + 4.2, th), who = NK.who(2450 + k, { top: k % 2 ? '#F3F1EA' : '#2F3A55', cap: '#2F3A55' });
      T.actor({ sample: 5, period: 10,
        at(t) { const u = (t % (2 * CYC)) / (2 * CYC), up = u > 0.33 && u < 0.5; return { x: p[0], y: p[1], z: 2.1, key: up ? 'c' + (Math.floor(t * 6) % 2) : 's', up, ph: Math.floor(t * 6) % 2 ? 0.2 : 0.6 }; },
        draw(g, st) { NK.person(g, 0, 0, 0, Object.assign({}, who, { dir: 2, pose: st.up ? 'cheer' : 'stand', ph: st.ph })); } });
    }
  });
})();
