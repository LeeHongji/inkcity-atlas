'use strict';
/* (-100,100) Grand Central and the Chrysler Building.
   Grand Central Terminal is a Beaux-Arts limestone hall on a granite base. Its 42nd Street front (turned here to face
   us, on the side towards 5th Avenue) is a central pavilion of three tall arched windows, each framed by paired
   columns, under a deep cornice and an attic carrying the great clock and the sculpture group (Mercury with Hercules
   and Minerva, an eagle above). Lower end bays with small windows; behind the front, the concourse block under a low
   copper-green roof. A paved plaza in front (Pershing Square): cafe tables under green umbrellas, a TAXI line, the
   pretzel cart, a subway entrance with green globes, a sax player with listeners, commuters streaming out of the doors.
   At the far corner the Chrysler Building: a white-brick tower in three setbacks with dark window stripes, steel
   eagles at the shaft's corners and the stainless-steel crown of seven stacked sunburst arches pierced by triangular
   windows, then the needle spire. Behind the terminal an office slab (the Graybar), shops on 5th; on the north side
   two brick walk-ups with fire escapes, a deli and a pizza place.
   What moves: commuters in and out of the doors, people on the sidewalks, the flag over the clock, the corner people. */
SF.tile('grand', -100, 100, { rim: 24 }, function (T) {
  const LIME = { t: '#EDE6D3', l: '#E8DFC8', r: '#D6CBB0' }, GRAN = { t: '#D9D3C6', l: '#CFC8B8', r: '#BBB3A2' };
  const X1 = 18, Y0 = -10, Y1 = 21;                                // the terminal's front plane and its extent along y
  T.ground(function (g) {
    NK.lot(g, { inner: '#E3DED3' });
    // Pershing Square plaza in front of the terminal: warm granite pavers
    const pl = K.rect(X1, Y0 - 2, 31, Y1 + 4);
    g.fill(pl, '#E2D6BE'); g.scuff(pl, { dir: Math.atan2(AY, -AX), len: 3, c: '#CFC0A2', dens: 0.7, w: 0.45, spread: 0.05 });
    const jt = []; for (let y = Y0 - 1; y < Y1 + 4; y += 2.6) { const a = g.p(X1, y, 0), b = g.p(31, y, 0); jt.push(a[0], a[1], b[0], b[1]); } g.segs2(jt, '#D3C4A6', 0.3);
    // a strip of planting along the north side
    g.fill(K.rect(-12, 24, 16, 28), '#9FBF7E'); g.grass(K.rect(-12, 24, 16, 28), { dens: 0.6 }); g.outline(K.rect(-12, 24, 16, 28), { w: 0.4, c: '#7F9A5E', boil: false });
  }, { rim: true });

  /* ---------------- the Chrysler Building ---------------- */
  T.obj([-31, -31, -14, -14], function (g) {
    g.boilP = 0.3;
    const W = { t: '#ECEAE3', l: '#F1EFE8', r: '#D9D6CE' }, cx = -22.5, cy = -22.5;
    const stripes = (x0, y0, x1, y1, z0, z1, step) => {
      const s = [];
      for (const [f, pl, A0, A1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) for (let a = A0 + step / 2; a < A1 - 0.2; a += step) { const p0 = g.p.apply(g, K.pt(f, pl + 0.02, a, z0 + 0.6)), p1 = g.p.apply(g, K.pt(f, pl + 0.02, a, z1 - 0.4)); s.push(p0[0], p0[1], p1[0], p1[1]); }
      g.segs2(s, '#5E6672', 0.55);
      const b = []; for (const [f, pl, A0, A1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) for (let z = z0 + 2.2; z < z1 - 0.5; z += 3.1) { const p0 = g.p.apply(g, K.pt(f, pl + 0.03, A0, z)), p1 = g.p.apply(g, K.pt(f, pl + 0.03, A1, z)); b.push(p0[0], p0[1], p1[0], p1[1]); }
      g.segs2(b, '#B9B6AE', 0.3);
    };
    K.box(g, -31, -31, -14, -14, 0, 4, GRAN, { w: 0.9 });
    g.fill(K.on('L', -13.98, -28, -17, 0, 3.4), '#3A3F47'); g.fill(K.on('R', -13.98, -28, -17, 0, 3.4), '#3A3F47');
    K.box(g, -31, -31, -14, -14, 4, 12, W, { w: 0.9 }); stripes(-31, -31, -14, -14, 4, 12, 1.4);
    K.box(g, -29.5, -29.5, -15.5, -15.5, 12, 24, W, { w: 0.9 }); stripes(-29.5, -29.5, -15.5, -15.5, 12, 24, 1.4);
    K.box(g, -27, -27, -18, -18, 24, 40, W, { w: 0.9 }); stripes(-27, -27, -18, -18, 24, 40, 1.3);
    // the crown: six tiers of sunburst arches, each smaller and set back, drawn top first so every lower (nearer)
    // tier covers the foot of the one above and leaves its crescent showing, triangular windows round each crescent
    const STEEL = '#DCE1E5', WIN = '#46505C', NT = 6, H0 = 40.2, TH = 1.5;
    for (let k = NT - 1; k >= 0; k--) {
      const w = 4.5 - k * 0.62, z = H0 + k * TH, zt = z + 0.5, R = w * 1.05;
      K.box(g, cx - w, cy - w, cx + w, cy + w, z, zt, { t: STEEL, l: STEEL, r: '#C3CBD1' }, { w: 0.5, boil: false, faces: 'lr' });
      for (const face of ['L', 'R']) {
        const p = face === 'L' ? cy + w : cx + w, c = face === 'L' ? cx : cy, pts = [];
        for (let i = 0; i <= 14; i++) { const t = Math.PI * i / 14; pts.push(K.pt(face, p, c - w * Math.cos(t), zt + R * Math.sin(t))); }
        g.fill(pts, face === 'L' ? STEEL : '#C6CED4');
        const tri = [];
        for (let i = 1; i < 10; i++) {
          const t = Math.PI * i / 10, ro = 0.93, ri = 0.93 - Math.min(0.75, 0.9 / w);
          const A = K.pt(face, p + 0.02, c - w * ro * Math.cos(t - 0.07), zt + R * ro * Math.sin(t - 0.07)), B = K.pt(face, p + 0.02, c - w * ro * Math.cos(t + 0.07), zt + R * ro * Math.sin(t + 0.07)), Cc = K.pt(face, p + 0.02, c - w * ri * Math.cos(t), zt + R * ri * Math.sin(t));
          g.fill([A, B, Cc], WIN);
        }
        g.line(pts, { w: 0.55, c: '#6E7A86', boil: false, ext: 0 });
      }
    }
    // the steel eagles leaning out from the shaft's corners at the top setback
    for (const [ex, ey, dx, dy] of [[-18, -18, 1, 1], [-27, -18, -1, 1], [-18, -27, 1, -1]]) { const b = g.p(ex, ey, 39.2), t = g.p(ex + dx * 1.6, ey + dy * 1.6, 39.6); g.fill2([[b[0], b[1] - 1.2], [t[0], t[1] - 0.6], [t[0] + (t[0] - b[0]) * 0.2, t[1] + 0.8], [b[0], b[1] + 0.6]], '#B9C0C6', true); g.line2([[b[0], b[1] - 1.2], [t[0], t[1] - 0.6]], { w: 0.35, c: '#5E6672', boil: false }); }
    const sp0 = g.p(cx, cy, 46.8), sp1 = g.p(cx, cy, 58.5);
    g.fill2([[sp0[0] - 1.6, sp0[1]], [sp0[0] + 1.6, sp0[1]], [sp1[0], sp1[1]]], '#DCE1E5'); g.fill2([[sp0[0], sp0[1]], [sp0[0] + 1.6, sp0[1]], [sp1[0], sp1[1]]], '#B7C0C7');
    g.line2([[sp0[0] - 1.6, sp0[1]], sp1, [sp0[0] + 1.6, sp0[1]]], { w: 0.5, c: '#6E7A86', boil: false });
  }, { name: 'chrysler' });

  /* ---------------- behind the terminal: the office slab, shops on 5th ---------------- */
  T.obj([-10, -31, 10, -15], (g) => {
    K.box(g, -10, -31, 10, -15, 0, 24, { t: '#D9D3C6', l: '#E3D9C6', r: '#CDBFA6' }, { w: 0.9 });
    NK.windows(g, 'L', -15, -9.5, 9.5, 4, 3.3, 6, 8, { style: 'navy', fill: 0.5, hfill: 0.6 });
    NK.windows(g, 'R', 10, -30.5, -15.5, 4, 3.3, 6, 6, { style: 'navy', fill: 0.5, hfill: 0.6 });
    NK.shop(g, 'L', -15, -9, 9, { h: 3.8, col: '#5A4A3C', word: 'BANK', sign: true });
    NK.roofStuff(g, -10, -31, 10, -15, 24, 7);
  }, { name: 'office' });
  T.obj([13, -31, 31, -15], (g) => {
    const h = NK.walkup(g, 13, -31, 31, -15, 3, { face: 'R', col: NYC.brick2, shop: { col: '#2F6B52', word: 'DELI', awning: '#2F6B52', goods: ['#E6C24F', '#C9463E', '#8FBF73'] }, tx: 0.3, ty: 0.3 });
    void h;
  }, { name: 'deli' });

  /* ---------------- Grand Central Terminal ---------------- */
  // the concourse block behind the front, under its low copper roof
  T.obj([-12, Y0, X1, Y1], function (g) {
    g.boilP = 0.3;
    K.box(g, -12, Y0, X1 - 0.5, Y1, 0, 12.5, LIME, { w: 0.9 });
    K.box(g, -12.4, Y0 - 0.4, X1 - 0.1, Y1 + 0.4, 11.5, 12.5, { t: '#E9E1CC', l: '#DCD2BA', r: '#C9BEA3' }, { w: 0.6, boil: false });
    K.hip(g, -11, Y0 + 0.6, X1 - 2.5, Y1 - 0.6, 12.5, 4.6, '#9DB3A3', { ridge: 12, c: '#5E7A6A' });
    // the north side (towards us on the left): three big arched windows over a granite base, end bays
    g.fill(K.on('L', Y1 + 0.02, -12, X1 - 0.5, 0, 2), GRAN.l);
    for (let i = 0; i < 3; i++) { const a0 = -6 + i * 6.4; K.win(g, 'L', Y1 + 0.03, a0, a0 + 4.4, 3, 10.4, { style: 'glass', arch: true, w: 0.5 }); const m = []; for (let k = 1; k < 4; k++) { const p0 = g.p(a0 + k * 1.1, Y1 + 0.05, 3), p1 = g.p(a0 + k * 1.1, Y1 + 0.05, 9.4); m.push(p0[0], p0[1], p1[0], p1[1]); } for (let z = 4.6; z < 9.5; z += 1.6) { const p0 = g.p(a0, Y1 + 0.05, z), p1 = g.p(a0 + 4.4, Y1 + 0.05, z); m.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(m, '#8C9AA4', 0.3); }
  }, { name: 'concourse' });
  // the 42nd Street front, turned to face us (plane x = X1)
  T.obj([X1 - 0.6, Y0, X1 + 1.2, Y1], function (g) {
    g.boilP = 0.3;
    const P = (a, z, d) => [X1 + (d || 0), a, z];
    K.box(g, X1 - 0.6, Y0, X1, Y1, 0, 12.5, LIME, { w: 0.9 });
    g.fill(K.on('R', X1 + 0.01, Y0, Y1, 0, 2.2), GRAN.r);
    // end bays: three floors of small windows
    for (const [b0, b1] of [[Y0, Y0 + 6.5], [Y1 - 6.5, Y1]]) { NK.windows(g, 'R', X1, b0 + 0.6, b1 - 0.6, 2.4, 3.1, 3, 2, { style: 'navy', fill: 0.45, hfill: 0.55 }); g.fill(K.on('R', X1 + 0.05, (b0 + b1) / 2 - 1, (b0 + b1) / 2 + 1, 0, 2.2), '#4A3A2E'); }
    // the central pavilion: three great arched windows between paired columns
    const c0 = Y0 + 7, c1 = Y1 - 7, bw = (c1 - c0) / 3;
    for (let i = 0; i < 3; i++) {
      const a0 = c0 + i * bw + 0.95, a1 = c0 + (i + 1) * bw - 0.95;
      K.win(g, 'R', X1 + 0.02, a0, a1, 3.0, 11.0, { style: 'glass', arch: true, w: 0.55, col: '#C8DAE4' });
      const m = []; for (let k = 1; k < 4; k++) { const a = a0 + (a1 - a0) * k / 4, p0 = g.p.apply(g, P(a, 3, 0.04)), p1 = g.p.apply(g, P(a, 10.2, 0.04)); m.push(p0[0], p0[1], p1[0], p1[1]); } for (let z = 4.4; z < 10; z += 1.5) { const p0 = g.p.apply(g, P(a0, z, 0.04)), p1 = g.p.apply(g, P(a1, z, 0.04)); m.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(m, '#8C9AA4', 0.32);
      g.fill([P(a0, 0, 0.04), P(a1, 0, 0.04), P(a1, 2.6, 0.04), P(a0, 2.6, 0.04)], '#4A3A2E');      // the doors under each arch
    }
    for (let i = 0; i <= 3; i++) for (const d of [-0.45, 0.45]) { const a = c0 + i * bw + d; K.box(g, X1, a - 0.28, X1 + 0.6, a + 0.28, 2.2, 11.2, { t: '#F1EBD9', l: '#EEE6D2', r: '#DDD2B8' }, { w: 0.4, boil: false }); }
    // cornice, attic, the clock and the sculpture group, the eagle
    K.box(g, X1 - 0.6, Y0 - 0.3, X1 + 0.9, Y1 + 0.3, 11.2, 12.2, { t: '#F1EBD9', l: '#E3D9BF', r: '#D3C7AA' }, { w: 0.7, boil: false });
    K.box(g, X1 - 0.6, c0 - 0.5, X1 + 0.2, c1 + 0.5, 12.2, 14.4, LIME, { w: 0.7 });
    const mid = (c0 + c1) / 2, cc = g.p.apply(g, P(mid, 15.4, 0.6));
    const fig = (pts, col) => { const q = pts.map(([a, z]) => g.p.apply(g, P(mid + a, z, 0.7))); g.fill2(q, col || '#E6DCC2'); g.outline2(q, { w: 0.4, c: '#8C7E62', boil: false }); };
    // the sculpture group as one carved mass: Hercules and Minerva leaning out, Mercury standing between, the eagle on top
    fig([[-6.4, 14.4], [6.4, 14.4], [6.0, 15.4], [4.4, 16.6], [2.4, 17.2], [1.8, 19.2], [1.0, 20.2], [-1.0, 20.2], [-1.8, 19.2], [-2.4, 17.2], [-4.4, 16.6], [-6.0, 15.4]]);
    const grp = [[-4.6, 14.6, -2.6, 16.2], [4.6, 14.6, 2.6, 16.2], [-1.2, 17.4, -1.4, 19.4], [1.2, 17.4, 1.4, 19.4], [-0.9, 16.8, -3.6, 18.2], [0.9, 16.8, 3.6, 18.2]].map((q) => { const a2 = g.p.apply(g, P(mid + q[0], q[1], 0.72)), b2 = g.p.apply(g, P(mid + q[2], q[3], 0.72)); return [a2[0], a2[1], b2[0], b2[1]]; }).flat();
    g.segs2(grp, '#A8987A', 0.45);
    fig([[-3.6, 18.2], [-1.0, 19.6], [-0.8, 18.6], [-3.4, 17.6]], '#D9CDB0'); fig([[3.6, 18.2], [1.0, 19.6], [0.8, 18.6], [3.4, 17.6]], '#D9CDB0');   // Mercury's spread arms
    fig([[-1.6, 20.2], [1.6, 20.2], [2.6, 21.2], [0.4, 20.9], [0, 21.6], [-0.4, 20.9], [-2.6, 21.2]], '#B9AE92');                              // the eagle
    g.disc2(cc, 5.6, '#E9E1C8'); g.disc2(cc, 4.4, '#F6F1E2'); g.ring2(cc, 4.4, { w: 0.6, c: '#B08A3A' }); g.ring2(cc, 5.6, { w: 0.5, c: '#8C7E62' });
    const hd = []; for (let k = 0; k < 12; k++) { const a = TAU * k / 12; hd.push(cc[0] + Math.cos(a) * 3.6, cc[1] + Math.sin(a) * 3.6, cc[0] + Math.cos(a) * 4.1, cc[1] + Math.sin(a) * 4.1); } g.segs2(hd, '#8C7E62', 0.3);
    g.segs2([cc[0], cc[1], cc[0] + 0.6, cc[1] - 2.8, cc[0], cc[1], cc[0] + 2.0, cc[1] + 0.6], '#2A2622', 0.45);
    NK.text(g, 'R', X1 + 0.62, mid, 12.45, 0.9, 'GRAND CENTRAL TERMINAL', '#6E5A44', { center: true, w: 0.3 });
  }, { name: 'gct front' });

  /* ---------------- the north side: two walk-ups, a pizza place ---------------- */
  T.obj([-31, 4, -15, 17], (g) => { NK.walkup(g, -31, 4, -15, 17, 4, { face: 'R', col: NYC.brick, shop: { col: '#3F5F8F', word: 'NAILS', awning: '#3F5F8F' }, tx: 0.3, ty: 0.4 }); }, { name: 'walkup a' });
  T.obj([-31, 18, -15, 31], (g) => { NK.walkup(g, -31, 18, -15, 31, 3, { face: 'L', col: NYC.brick3, fh: 3.7, shop: { col: '#C9463E', word: 'PIZZA', awning: '#C9463E', stripe: '#F6F2E8', goods: ['#E6C24F', '#C9584B'] }, tx: 0.6, ty: 0.4, feAt: -20 }); }, { name: 'walkup b' });
  T.obj([-31, -12, -15, 2], (g) => { const h = NK.brownstone(g, -31, -12, -15, 2, { face: 'R', door: -5, nf: 3, col: '#9A6A50' }); g.fill(K.rect(-30.6, -11.6, -15.4, 1.6, h + 0.72), '#D8D0C0'); NK.tank(g, -26, -7, h + 0.7, { r: 1.5, h: 3, leg: 1.6 }); }, { name: 'brownstone' });

  /* ---------------- street furniture, trees ---------------- */
  for (const [x, y] of [[-24, 34.5], [-8, 34.5], [6, 34.5], [20, 34.5], [34.5, -24], [34.5, -6], [34.5, 26]]) T.obj([x, y], (g) => NK.tree(g, x, y, { r: 3.4 }), { name: 'tree' });
  for (const [x, y] of [[-4, 26], [9, 26]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.2, h: 4.6, col: '#93BE6E' }), { name: 'tree' });
  T.obj([28, 30], (g) => NK.subway(g, 28, 30, 'x-', { w: 1.7, L: 5.4 }), { name: 'subway' });
  T.obj([34.6, 6], (g) => NK.hydrant(g, 34.6, 6), {});
  T.obj([34.4, -14], (g) => NK.mailbox(g, 34.4, -14), {});
  T.obj([34.4, 12], (g) => NK.basket(g, 34.4, 12), {});
  T.obj([-2, 34.3], (g) => NK.newsbox(g, -2, 34.3, '#2F6DB5'), {});
  T.obj([-12, 34.3], (g) => NK.citibikes(g, -14, 34.3, 'x', 5), { name: 'citibike' });
  // a flagpole on the plaza, its flag waving
  T.obj([30.5, -12], (g) => { const b = g.p(30.5, -12, 0), t = g.p(30.5, -12, 14); K.cyl(g, 30.5, -12, 0.7, 0, 1.2, '#CFC8B8', { w: 0.5, n: 8 }); g.line2([b, t], { w: 0.6, c: '#5E5A52', boil: false }); g.disc2(t, 0.55, C.gold); }, { name: 'flagpole' });
  NK.flagActor(T, 30.5, -12, 13.6, { w: 4.6, h: 3, dir: 'y' });

  /* ---------------- the living layer ---------------- */
  // cafe tables under green umbrellas on the plaza: people sitting at them
  for (const [x, y, s] of [[23, -8, 1], [27.5, -3, 2], [23.5, 17, 3]]) T.cast([x, y], (g) => {
    const umb = g.p(x, y, 8.4), pole = g.p(x, y, 0);
    NK.person(g, x - 1.4, y, 1.3, NK.who(1100 + s, { dir: 0, pose: 'sit', coffee: true }));
    K.cyl(g, x, y, 1.1, 1.8, 2.1, '#5A6E5A', { w: 0.4, n: 10 }); g.segs2([pole[0], pole[1], umb[0], umb[1]], '#4A4744', 0.5);
    NK.person(g, x + 1.4, y + 0.4, 1.3, NK.who(1110 + s, { dir: 2, pose: 'sit' }));
    const r = []; for (let i = 0; i < 8; i++) { const a = TAU * i / 8; r.push(g.p(x + Math.cos(a) * 3.2, y + Math.sin(a) * 3.2, 7.5)); }
    for (let i = 0; i < 8; i++) g.fill2([umb, r[i], r[(i + 1) % 8]], i % 2 ? '#3E7A5A' : '#4E8F6A');
    g.outline2(r, { w: 0.4, c: '#2F4A3A', boil: false });
  }, { name: 'cafe' });
  // the TAXI line by the kerb, a starter in a cap
  T.cast([29, 6], (g) => { const s = g.p(30.5, 2.2, 0), t = g.p(30.5, 2.2, 6.4); g.segs2([s[0], s[1], t[0], t[1]], '#5E5A52', 0.55); const q = K.on('R', 30.6, 0.2, 4.2, 6.4, 8.2); g.fill(q, NYC.cab); g.outline(q, { w: 0.4, c: '#8C6A1A', boil: false }); NK.text(g, 'R', 30.65, 2.2, 6.75, 1.1, 'TAXI', '#2A2622', { center: true, w: 0.45 }); }, { on: true, name: 'taxi sign' });
  for (let k = 0; k < 5; k++) { const x = 29.2, y = 4 + k * 1.7; T.cast([x, y], (g) => NK.person(g, x, y, 0, (k === 2 ? NK.suit : k === 4 ? NK.tourist : NK.who)(1120 + k, { dir: 3, pose: k % 2 ? 'hold' : 'stand', phone: k === 1 })), { name: 'queue' }); }
  T.cast([31.5, 3.6], (g) => NK.person(g, 31.5, 3.6, 0, NK.who(1130, { dir: 1, top: '#E6C24F', cap: '#2F3A4F', bot: '#2F3A4F' })), { name: 'starter' });
  // the pretzel cart and a customer
  T.cast([25, 25], (g) => { NK.cart(g, 25, 25, { along: 'x', umb: ['#C9463E', '#F6F2E8'] }); NK.person(g, 25, 27.6, 0, NK.who(1140, { dir: 3, pose: 'hold' })); NK.person(g, 22, 25.4, 0, NK.who(1141, { dir: 0, cap: '#C9463E', top: '#F3F1EA' })); }, { name: 'cart' });
  // a sax player on the plaza and two listeners
  T.cast([24, 2], (g) => {
    const r = NK.person(g, 24, 2, 0, NK.who(1150, { dir: 1, pose: 'hold', hat: '#2F2C2A', top: '#3B3F47' }));
    const hd = r.hands[0]; g.fill2([[hd[0] - 0.6, hd[1] - 3.6], [hd[0] + 0.4, hd[1] - 3.6], [hd[0] + 0.6, hd[1] + 1.2], [hd[0] + 2.2, hd[1] + 1.8], [hd[0] + 2.0, hd[1] + 2.8], [hd[0] - 0.2, hd[1] + 2.0]], '#D9AE45', true);
    const c = g.p(26, 4.5, 0); g.fill2([[c[0] - 2.4, c[1] - 0.4], [c[0] + 2.4, c[1] - 0.4], [c[0] + 2.0, c[1] + 0.8], [c[0] - 2.0, c[1] + 0.8]], '#2A2622', true);
  }, { name: 'sax' });
  T.cast([27, 9.5], (g) => { NK.person(g, 27, 9.5, 0, NK.tourist(1151, { dir: 2 })); NK.person(g, 28.4, 10.6, 0, NK.who(1152, { dir: 2, k: 0.75 })); }, { name: 'listeners' });
  T.cast([21.5, -4], (g) => NK.person(g, 21.5, -4, 0, NK.cop(1160, { dir: 0 })), { name: 'cop' });
  // a man on a bench on the north strip reading the paper
  T.cast([3, 29.5], (g) => { K.bench(g, 3, 29.5, { face: 'L', L: 2.2 }); NK.person(g, 3, 30.8, 1.3, NK.suit(1170, { dir: 1, pose: 'hold' })); }, { name: 'bench' });

  // commuters streaming out of the doors and back in, walking the sidewalks
  const doors = [Y0 + 9, (Y0 + Y1) / 2, Y1 - 9];
  const routes = [
    [[X1 + 0.8, doors[0]], [30, doors[0] - 2], [33.5, -12], [33.5, -28], [33.5, -12], [30, doors[0] - 2]],
    [[X1 + 0.8, doors[1]], [26.5, 13], [33.5, 18], [33.5, 30], [20, 33.8], [33.5, 30], [33.5, 18], [26.5, 13]],
    [[X1 + 0.8, doors[2]], [22, 22], [14, 33.6], [-10, 33.6], [14, 33.6], [22, 22]],
    [[33.6, -28], [33.6, 26], [26, 33.6], [-28, 33.6], [26, 33.6], [33.6, 26]],
    [[-28, 33.7], [20, 33.7]],
    [[33.4, 24], [33.4, -26]],
    [[X1 + 0.8, doors[1] - 2], [24, -2], [30, -14], [24, -2]],
  ];
  routes.forEach((r, i) => NK.walker(T, i % 3 === 0 ? NK.suit(1200 + i) : i === 4 ? NK.tourist(1200 + i) : NK.who(1200 + i, { coffee: i === 1, tote: i === 5 ? '#E9E1CC' : null }), r, 4.6 + (i % 3) * 0.5, { phase: i * 0.19 }));
  // a dog walker on the north sidewalk
  T.actor({ sample: 0.25, period: 20,
    at(t) { const u = ((t * 3.4) % 80) / 80, x = u < 0.5 ? lerp(-26, 14, u * 2) : lerp(14, -26, (u - 0.5) * 2), d = u < 0.5 ? 0 : 2, ph = Math.floor(((t * 3.4) / 2.4) % 1 * 8); return { x, y: 35.2, key: d + '.' + ph, dir: d, ph: ph / 8 }; },
    draw(g, st) { const r = NK.person(g, 0, 0, 0, NK.who(1250, { dir: st.dir, pose: 'walk', ph: st.ph })); const fl = st.dir === 0 ? 1 : -1, p = g.p(fl * 2.6, fl * -0.6, 0); NK.dog2(g, p, fl, '#3A3530', st.ph); g.fine2([r.hands[0], [p[0] + fl * 2.6, p[1] - 3.2]], { w: 0.25, c: '#3A3128' }); } });

  NK.corners(T);
});
