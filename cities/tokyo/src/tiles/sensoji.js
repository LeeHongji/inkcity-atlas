'use strict';
/* (0,100) Sensō-ji, Asakusa. The approach runs along x from the near right to the far left: Kaminarimon (the Thunder
   Gate: vermilion posts, a dark tiled hip-and-gable roof, the giant red lantern hanging in the passage, wind and
   thunder gods behind grilles in the side bays) → Nakamise (a single row of little shops with awnings facing the path,
   low stalls with red parasols opposite, so nothing tall stands between us and the path) → Hōzōmon (two storeys, two
   roofs) → the incense burner with its smoke → the main hall on a stone podium under a huge roof. The five-storey
   pagoda stands at the far corner. Rickshaw pullers run along the near edge; visitors in rented kimono, a school trip. */
SF.tile('sensoji', 0, 100, { rim: 24 }, function (T) {
  const H = 37, VERM = { t: '#D9715A', l: '#C9463E', r: '#AE3A32' }, ROOF = '#6E747C', GRAVEL = '#EDE6D6', STONE = '#D7D2C6';
  T.ground(function (g) {
    K.slab(g, H, { top: GRAVEL });
    g.scuff(K.rect(-H, -H, H, H), { dir: -0.4, len: 2.5, c: '#DCD3BE', dens: 0.7, w: 0.5, spread: 1.2 });
    // the stone-paved approach and the rickshaw lane
    g.fill(K.rect(-19, -4.5, H, 4.5), STONE); g.scuff(K.rect(-19, -4.5, H, 4.5), { dir: Math.atan2(AY, AX), len: 3, c: '#C9C3B6', dens: 0.7, w: 0.5, spread: 0.05 });
    for (let x = -18; x < H; x += 3.2) g.fine([[x, -4.5, 0], [x, 4.5, 0]], { w: 0.3, c: '#BDB7AA' });
    g.fill(K.rect(-H, 27, H, 33.5), '#E2DBCB'); g.line([[-H, 27, 0], [H, 27, 0]], { w: 0.5, c: '#B9B1A0', boil: false });
    // moss and a little garden on the near side, a pond with carp-coloured dots
    K.lawn(g, -16, 10, 12, 24, { col: '#B9CF94', dens: 0.6 });
    const pond = K.curve([[-12, 13, 0], [-5, 12, 0], [-1, 15, 0], [-3, 20, 0], [-10, 21, 0], [-14, 17, 0]], 5, true);
    g.fill(pond.map((p) => [p[0] * 1.06 + 0.4, p[1] * 1.04 - 0.6, 0]), C.waterD); g.fill(pond, C.water); g.water(pond, { dens: 0.7 });
    for (const [x, y, c] of [[-8, 15.5, '#E08A3C'], [-6, 17.6, '#F3F1EA'], [-10, 18, '#E08A3C']]) { const p = g.p(x, y, 0.02); g.fill2([[p[0] - 1.4, p[1]], [p[0], p[1] - 0.5], [p[0] + 1.4, p[1]], [p[0], p[1] + 0.5]], c, true); }
    g.outline(pond, { w: 0.6, c: '#5F7F9C', boil: false });
  }, { rim: true });

  /* a temple body: vermilion posts on a podium, white plaster between, a dark band of lattice under the eaves */
  const body = (g, x0, y0, x1, y1, z0, z1, o) => {
    o = o || {};
    K.box(g, x0, y0, x1, y1, z0, z1, { t: '#E9E2CF', l: '#F1EDE3', r: '#DCD4C0' }, { w: 0.9 });
    const posts = [];
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
      const n = Math.max(2, Math.round((a1 - a0) / (o.bay || 3.2)));
      for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); g.fill(K.on(f, p + 0.05, a - 0.35, a + 0.35, z0, z1), VERM.l); }
      g.fill(K.on(f, p + 0.04, a0, a1, z1 - 1.0, z1), '#5A3A2C');
      g.fill(K.on(f, p + 0.04, a0, a1, z0, z0 + 0.5), VERM.r);
      if (o.doors) { const m = (a0 + a1) / 2; g.fill(K.on(f, p + 0.06, m - o.doors, m + o.doors, z0, z1 - 1.2), '#3A2E26'); }
      void posts;
    }
  };

  /* ---------------- the main hall ---------------- */
  T.obj([-37, -14, -18.5, 14], function (g) {
    g.boilP = 0.35;
    K.box(g, -36, -13, -19, 13, 0, 2.2, { t: '#E4DFD4', l: '#DAD6CA', r: '#C7C2B6' }, { w: 0.9 });            // the podium
    for (let i = 0; i < 5; i++) K.box(g, -19, -4 + 0, -19 + 0.9 * (i + 1), 4, 0, 2.2 - 0.44 * i, { t: '#E4DFD4', l: '#DAD6CA', r: '#C7C2B6' }, { w: 0.5, boil: false });
    body(g, -34.5, -11.5, -21, 11.5, 2.2, 10, { bay: 3.4, doors: 3.4 });
    TK.roof(g, -34.5, -11.5, -21, 11.5, 10, 11.5, { gable: 0.42, over: 3.4, lift: 1.9, col: ROOF, end: '#6E5A44', ridge: 'y' });
    TK.lantern2(g, g.p(-20.6, 0, 6.2), 3.6, '#C9463E', { glyph: 21 });
  }, { name: 'main hall' });
  // the incense burner (jōkōro): a bronze cauldron with its own little roof; the smoke is an actor
  T.obj([-13, 0, -10, 3], function (g) {
    g.at(2.5, 1.5, 0, (g) => {
    const B = { t: '#6E6458', l: '#7E7262', r: '#5E5448' };
    K.cyl(g, -14, 0, 1.6, 0, 1.0, { t: '#9A8E7E', l: '#8A7E6E', r: '#6E6458' }, { w: 0.6, n: 10 });
    K.cyl(g, -14, 0, 2.3, 1.0, 3.2, B, { w: 0.75, n: 12 });
    for (const [dx, dy] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) { const a = g.p(-14 + dx, dy, 3.2), b = g.p(-14 + dx, dy, 5.6); g.line2([a, b], { w: 0.6, c: '#4A4038', boil: false }); }
    TK.roof(g, -16, -2, -12, 2, 5.6, 1.6, { over: 0.6, lift: 0.4, col: '#7E7262', tiles: false });
    });
  }, { name: 'incense' });

  /* ---------------- the five-storey pagoda ---------------- */
  T.obj([-32, -32, -21, -21], function (g) {
    g.boilP = 0.3;
    const cx = -26.5, cy = -26.5;
    K.box(g, cx - 5.2, cy - 5.2, cx + 5.2, cy + 5.2, 0, 1.6, { t: '#E4DFD4', l: '#DAD6CA', r: '#C7C2B6' }, { w: 0.8 });
    let z = 1.6;
    for (let k = 0; k < 5; k++) {
      const s = 3.6 - k * 0.42, h = k === 0 ? 4.0 : 3.0;
      body(g, cx - s, cy - s, cx + s, cy + s, z, z + h, { bay: s * 0.95 });
      TK.roof(g, cx - s, cy - s, cx + s, cy + s, z + h, 1.7, { over: 2.2 - k * 0.15, lift: 0.9, col: ROOF, tiles: k < 3 });
      z += h + 1.0;
    }
    // the finial: nine bronze rings on a mast
    const b = g.p(cx, cy, z + 0.4), t = g.p(cx, cy, z + 7.5); g.line2([b, t], { w: 0.9, c: '#B08A4A', boil: false });
    for (let i = 0; i < 9; i++) { const p = g.p(cx, cy, z + 1.4 + i * 0.6); g.fill2(arcPts(p[0], p[1], 1.6 - i * 0.06, 0, TAU, 10).map((q) => [q[0], p[1] + (q[1] - p[1]) * 0.42]), '#C9A04F', true); }
    g.disc2(t, 0.9, '#C9A04F');
  }, { name: 'pagoda' });

  /* ---------------- Hōzōmon: the inner gate, two storeys ---------------- */
  T.obj([-4, -9.5, 2, 9.5], function (g) {
    g.boilP = 0.35;
    K.box(g, -4, -9.5, 2, 9.5, 0, 0.7, { t: '#E4DFD4', l: '#DAD6CA', r: '#C7C2B6' }, { w: 0.7 });
    body(g, -3.5, -9, 1.5, 9, 0.7, 6.4, { bay: 3 });
    g.fill(K.on('R', 1.55, -2.6, 2.6, 0.7, 5.6), '#3A2E26');
    TK.roof(g, -3.5, -9, 1.5, 9, 6.4, 1.5, { over: 2.0, lift: 0.7, col: ROOF, ridge: 'y', tiles: false });
    body(g, -3, -8, 1, 8, 7.9, 11.6, { bay: 2.7 });
    TK.roof(g, -3, -8, 1, 8, 11.6, 4.6, { gable: 0.45, over: 2.6, lift: 1.3, col: ROOF, end: '#6E5A44', ridge: 'y' });
    TK.lantern2(g, g.p(1.8, 0, 3.6), 3.2, '#2E2A26', { glyph: 33, gc: '#E6C24F' });
    for (const s of [-1, 1]) TK.lantern2(g, g.p(1.8, s * 5.5, 4.4), 2.0, '#C9A04F', { glyph: 40 + s });
  }, { name: 'hozomon', under: 6.4 });

  /* ---------------- Nakamise: one row of shops facing the path ---------------- */
  const SHOPS = ['#E7C65A', '#E08A3C', '#C9584B', '#8FBF73', '#D98AA4', '#7FB7D9', '#E6C24F', '#C9A26B'];
  for (let i = 0; i < 5; i++) {
    const x0 = 4.5 + i * 3.6, x1 = x0 + 3.4;
    T.obj([x0, -12.5, x1, -6.4], function (g) {
      K.box(g, x0, -12.5, x1, -6.6, 0, 5.2, { t: '#E9E2CF', l: '#F1EDE3', r: '#DCD4C0' }, { w: 0.7 });
      g.fill(K.on('L', -6.55, x0 + 0.3, x1 - 0.3, 0, 3.3), '#E9C48A');
      const R = RNG(i * 17 + 3), goods = [];
      for (let k = 0; k < 6; k++) { const p = g.p(x0 + 0.6 + R() * (x1 - x0 - 1.2), -6.3, 1.0 + R() * 0.6); g.disc2(p, 0.7, R.pick(SHOPS)); goods.push(p); }
      TK.awning(g, 'L', -6.6, x0 - 0.1, x1 + 0.1, 3.9, 1.6, i % 2 ? '#C9463E' : '#F3F1EA', { stripe: i % 2 ? '#F3F1EA' : '#C9463E', drop: 0.9 });
      TK.roof(g, x0 - 0.2, -12.5, x1 + 0.2, -6.6, 5.2, 2.0, { over: 0.5, lift: 0.2, col: ROOF, ridge: 'x', tiles: false });
      TK.sign(g, 'L', -6.6, x0 + 0.5, x1 - 0.5, 4.2, 5.0, '#F6F1E4', { seed: 50 + i, n: 3, ink: '#3A3128' });
    }, { name: 'shop' });
  }
  // low stalls with red parasols on the near side of the path
  for (const [x, y] of [[4, 7.5], [13, 7.0], [21, 7.6]]) {
    T.obj([x - 1.6, y - 1, x + 1.6, y + 1], function (g) {
      K.box(g, x - 1.5, y - 0.9, x + 1.5, y + 0.9, 0, 2.1, { t: '#C9A26B', l: '#B58F58', r: '#A07C4C' }, { w: 0.55 });
      for (let k = 0; k < 4; k++) { const p = g.p(x - 1 + k * 0.7, y, 2.25); g.disc2(p, 0.6, ['#F3E3A0', '#E7A9A0', '#C9E3A8', '#F3F1EA'][k]); }
      const top = g.p(x + 0.4, y + 0.4, 6.4), base = g.p(x + 0.4, y + 0.4, 2.1);
      g.line2([base, top], { w: 0.5, c: '#4A3A2C', boil: false });
      const um = []; for (let k = 0; k <= 12; k++) { const a = Math.PI + Math.PI * k / 12; um.push([top[0] + Math.cos(a) * 7.5, top[1] + 2.4 + Math.sin(a) * 2.2]); }
      g.fill2(um, '#C9463E'); g.line2(um, { w: 0.55, c: '#7A2A22', boil: false });
    }, { name: 'parasol stall' });
  }

  /* ---------------- Kaminarimon ---------------- */
  T.obj([23.5, -10, 31, 10], function (g) {
    g.boilP = 0.4;
    K.box(g, 23.5, -10, 31, 10, 0, 0.6, { t: '#E4DFD4', l: '#DAD6CA', r: '#C7C2B6' }, { w: 0.8 });
    body(g, 24.5, -9, 30, 9, 0.6, 8.0, { bay: 3 });
    // the passage, and the god bays behind grilles either side
    g.fill(K.on('R', 30.06, -3.1, 3.1, 0.6, 7.0), '#4A3A30');
    for (const [s, col] of [[-1, '#3F8270'], [1, '#C9463E']]) {
      const a0 = s < 0 ? -8.4 : 3.8, a1 = s < 0 ? -3.8 : 8.4;
      g.fill(K.on('R', 30.06, a0, a1, 0.6, 7.0), '#3A2E26');
      const c = g.p(30.1, (a0 + a1) / 2, 3.6), k = 1.0;
      g.fill2([[c[0] - 2.6 * k, c[1] + 6], [c[0] + 2.6 * k, c[1] + 6], [c[0] + 3.2 * k, c[1] - 3], [c[0] + 1.2, c[1] - 8.5], [c[0] - 1.2, c[1] - 8.5], [c[0] - 3.2 * k, c[1] - 3]], col, true);
      g.disc2([c[0], c[1] - 9.6], 2.0, col); g.disc2([c[0] - 0.7, c[1] - 9.9], 0.35, '#F6E7A8'); g.disc2([c[0] + 0.8, c[1] - 9.9], 0.35, '#F6E7A8');
      const gr = []; for (let a = a0 + 0.5; a < a1; a += 0.55) { const p0 = g.p(30.12, a, 0.6), p1 = g.p(30.12, a, 7.0); gr.push(p0[0], p0[1], p1[0], p1[1]); }
      g.segs2(gr, '#8A7A5A', 0.3);
    }
    TK.roof(g, 24.5, -9, 30, 9, 8.0, 5.2, { gable: 0.42, over: 2.8, lift: 1.4, col: ROOF, end: '#6E5A44', ridge: 'y' });
    // the giant lantern, nearly as tall as the passage
    const L = g.p(30.6, 0, 4.4); TK.lantern2(g, L, 7.4, '#C9463E', { glyph: 7 });
    g.fill2([[L[0] - 3.4, L[1] - 7.8], [L[0] + 3.4, L[1] - 7.8], [L[0] + 3.0, L[1] - 9.2], [L[0] - 3.0, L[1] - 9.2]], '#2A2622', true);
  }, { name: 'kaminarimon', under: 7.6 });

  /* ---------------- trees, lamps ---------------- */
  for (const [x, y, r] of [[-35, 22, 4.6], [-33, 33, 4.2], [-24, 33, 4.0], [33, 20, 3.6], [33, -24, 4.2], [16, -30, 3.8]]) T.obj([x, y], (g) => TK.sakura(g, x, y, { r }), { on: true });
  for (const [x, y] of [[-18, -18], [-11, -30], [2, -32]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 4.2, h: 5, col: C.leafD }), { on: true });
  for (const x of [5, 13.5, 21.5]) T.obj([x, -4.9], (g) => { const b = g.p(x, -4.9, 0), t = g.p(x, -4.9, 5.4); g.line2([b, t], { w: 0.7, c: '#3A3530', boil: false }); TK.lantern2(g, [t[0], t[1] + 1.4], 1.5, '#F6F1E4'); }, { on: true });

  /* ---------------- the living layer ---------------- */
  // visitors at the gate, a selfie under the lantern, people wafting incense smoke over themselves
  T.cast([33.5, 7.5], (g) => { TK.person(g, 34, 6.8, 0, TK.kimono(1101, { dir: 2, pose: 'hold', phone: true })); TK.person(g, 33.2, 8.4, 0, TK.kimono(1102, { dir: 2 })); }, { on: true });
  T.cast([-9.6, 4.6], (g) => { TK.person(g, -9.6, 4.4, 0, TK.who(1103, { dir: 2, pose: 'hold' })); TK.person(g, -11.4, 5.2, 0, TK.kimono(1104, { dir: 3, pose: 'wave', ph: 0.15 })); }, { on: true });
  T.cast([-8.6, -0.6], (g) => { TK.person(g, -8.6, -0.6, 0, TK.who(1105, { dir: 2, pose: 'hold', hair: '#8E8A84', glasses: true })); }, { on: true });
  T.cast([-17.6, 6.2], (g) => { TK.person(g, -17.6, 6.2, 0, TK.who(1106, { dir: 2, pose: 'hold' })); }, { on: true });
  // a school trip in yellow caps by the pond, their teacher's flag
  T.cast([-6, 23.5], (g) => { for (let k = 0; k < 5; k++) TK.person(g, -10 + k * 1.6, 23.2 + (k % 2) * 1.2, 0, TK.who(1110 + k, { dir: 1, k: 0.74, cap: '#E6C24F', randoseru: k % 2 ? '#C9463E' : '#2E2A26', top: '#F3F1EA', bot: '#3F4D63' })); const r = TK.person(g, -12.5, 22.4, 0, TK.who(1119, { dir: 0, pose: 'wave', ph: 0.1 })); const h = r.hands[1]; g.line2([h, [h[0], h[1] - 9]], { w: 0.5, c: '#3A3530', boil: false }); g.fill2([[h[0], h[1] - 9], [h[0] + 4, h[1] - 8.2], [h[0], h[1] - 7.0]], '#E6C24F', true); }, { on: true });

  // walkers along the approach, both ways
  const LOOK = (i) => i % 4 === 0 ? TK.kimono(1200 + i) : i % 4 === 2 ? TK.salary(1200 + i) : TK.who(1200 + i);
  for (let i = 0; i < 9; i++) {
    const y = -3.4 + (i % 4) * 2.2, x0 = -16 + (i * 3) % 8, x1 = 34 - (i * 5) % 7;
    K.walker(T, LOOK(i), [[x0, y], [x1, y], [x1, y + 0.6], [x0, y + 0.6]], 2.4 + (i % 3) * 0.5, { phase: (i * 0.137) % 1 });
  }
  // incense smoke: wisps rising and leaning with the breeze
  T.actor({ sample: 5, period: 10, grow: false, layer: '',
    at(t) { const f = Math.floor(t * 4) % 8; return { x: -11.5, y: 1.5, z: 5.8, key: 's' + f, f }; },
    draw(g, st) {
      const o = g.p(0, 0, 0);
      for (let k = 0; k < 4; k++) {
        const u = ((st.f / 8) + k / 4) % 1, y = o[1] - u * 26, x = o[0] + Math.sin(u * 5 + k) * 2.4 + u * 6, r = 1.6 + u * 3.6;
        const pts = []; for (let i = 0; i < 9; i++) { const a = TAU * i / 9; pts.push([x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 0.7]); }
        g.fill2(pts, mix('#F4F1EA', '#D9D4C8', 0.5 - u * 0.4), true);
        g.line2(pts.slice(0, 6), { w: 0.3, c: '#B9B3A6', boil: false, wob: 0.6 });
      }
    } });
  // rickshaws along the near lane, one each way
  for (const [dir, ph0, seeds] of [[1, 0, [1301, 1302, 1303]], [-1, 0.5, [1304, 1305, 1306]]]) {
    const puller = TK.who(seeds[0], { top: '#2E2A26', bot: '#2E2A26', bare: true, hairStyle: 'short', cap: undefined }), riders = [TK.kimono(seeds[1]), TK.kimono(seeds[2])];
    T.actor({ sample: 0.3, period: 24,
      at(t) { const u = ((t / 24 + ph0) % 1), x = dir > 0 ? -34 + u * 70 : 36 - u * 70, a = Math.min(1, Math.min(u, 1 - u) * 14), f = Math.floor((t * 2.6) % 1 * 8); return { x, y: dir > 0 ? 31.6 : 29.0, key: f, f, alpha: a < 1 ? a : null }; },
      draw(g, st) { TK.rickshaw(g, dir > 0 ? 0 : Math.PI, st.f / 8, puller, riders); } });
  }
});
