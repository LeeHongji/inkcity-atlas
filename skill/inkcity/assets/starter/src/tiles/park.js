'use strict';
/* The park: a lawn on the slab, a loop path, a pond with a jetty and a rowing boat, a bandstand, trees, a picnic,
   a cyclist going round. Organic outlines (pond, path) are closed Catmull-Rom curves through a few world points. */
SF.tile('park', 50, 0, { rim: 26 }, function (T) {
  const H = 37, PC = [-17, -15];                                    // the pond's centre, in the far corner
  const pond = K.curve([[-29, -18], [-23, -26], [-12, -27], [-5, -20], [-6, -10], [-14, -5], [-25, -7]].map((p) => [p[0], p[1], 0]), 6, true);
  // the loop path: an ellipse round the lawn in front, and a spur to the street crossing (tile edge x = -37, y 2..8)
  const RC = [10, 10], ring = (r) => K.arc(0, 0, 0, 1, 0, TAU, 48).map((p) => [RC[0] + p[0] * r * 1.15, RC[1] + p[1] * r, 0]);
  const onRing = (a) => [RC[0] + Math.cos(a) * 17 * 1.15, RC[1] + Math.sin(a) * 17];

  T.ground(function (g) {
    K.slab(g, H, { top: C.grass, cut: 'xy' });         // flush with the street; +y and +x are the map's cut edge
    g.grass(K.rect(-H, -H, H, H), { dens: 0.9 });
    const outer = ring(19), inner = ring(15);
    g.fill(outer, C.sand); g.fill(inner, C.grass);
    g.line(outer, { w: 0.55, c: '#C9B98C', close: true, boil: false }); g.line(inner, { w: 0.55, c: '#C9B98C', close: true, boil: false });
    g.fill(K.rect(-H, 2, -10, 8), C.sand); g.line([[-H, 2, 0], [-10.6, 2, 0]], { w: 0.5, c: '#C9B98C', boil: false }); g.line([[-H, 8, 0], [-10.8, 8, 0]], { w: 0.5, c: '#C9B98C', boil: false });
    // the pond: a darker edge, water, a few ripples
    g.fill(pond.map((p) => [PC[0] + (p[0] - PC[0]) * 1.08, PC[1] + (p[1] - PC[1]) * 1.08, 0]), C.waterD);
    g.fill(pond, C.water); g.water(pond, { dens: 0.8 });
    g.outline(pond, { w: 0.7, c: '#5F7F9C', boil: false });
  }, { rim: true });

  // a jetty into the pond (on the ground, but it stands up a little: an object)
  T.obj([-10, -16, -3, -13], (g) => {
    K.box(g, -10, -16, -3, -13, 0.2, 0.7, { t: '#D9B57E', l: '#C9A26B', r: '#B58F58' }, { w: 0.6 });
    const st = []; for (let x = -9; x < -3; x += 1.2) { const a = g.p(x, -16, 0.7), b = g.p(x, -13, 0.7); st.push(a[0], a[1], b[0], b[1]); }
    g.segs2(st, '#A07C4C', 0.35);
  }, { on: true });

  /* ---- the bandstand: an octagonal platform, eight posts, a pointed roof ---- */
  const BS = [22, -18];
  T.obj([BS[0] - 6, BS[1] - 6, BS[0] + 6, BS[1] + 6], function (g) {
    // someone inside a structure is drawn inside its object, between the far parts and the near parts
    K.cyl(g, BS[0], BS[1], 6, 0, 1.4, { t: '#F1EDE3', l: '#F4F1E9', r: '#DDD7CB' }, { w: 0.85, n: 8 });
    const posts = (near) => { const s = []; for (let i = 0; i < 8; i++) { const a = TAU * i / 8 + Math.PI / 8, c = Math.cos(a), d = Math.sin(a); if ((c + d > 0) !== near) continue; const x = BS[0] + c * 5.2, y = BS[1] + d * 5.2, p0 = g.p(x, y, 1.4), p1 = g.p(x, y, 8.6); s.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(s, '#F4F1E9', 1.4); g.segs2(s, '#6B6050', 0.45); };
    posts(false);
    K.person(g, BS[0] - 0.5, BS[1] + 0.5, 1.4, K.who(35, { dir: 1, pose: 'wave', ph: 0.2 }));      // a singer
    posts(true);
    K.cone(g, BS[0], BS[1], 6.6, 8.6, 5.2, '#5FA58F', { w: 0.9 });
    const t = g.p(BS[0], BS[1], 13.8); g.disc2(t, 1.0, C.gold); g.ring2(t, 1.0, { w: 0.4 });
  }, { name: 'bandstand' });

  /* ---- trees round the edge, a cypress pair, benches on the path, a lamp ---- */
  for (const [x, y, r] of [[-30, -30, 4.6], [-29, 22, 5.0], [-14, 30, 4.4], [8, 30, 4.8], [29, 26, 4.2], [30, 6, 4.4], [4, -30, 4.0]]) T.obj([x, y], (g) => K.tree(g, x, y, { r, h: 5.5, col: x > 20 ? C.leafD : C.leaf }), { on: true });
  for (const [x, y] of [[-31, -6], [-31, -12]]) T.obj([x, y], (g) => K.cypress(g, x, y, {}), { on: true });
  T.obj([22, 9], (g) => K.bench(g, 22, 9, { face: 'L', L: 2.8 }), { on: true });
  T.obj([-6, 20], (g) => K.lamp(g, -6, 20, {}), { on: true });

  /* ---- the cast: a picnic on a blanket, a reader on the bench, someone at the end of the jetty ---- */
  T.cast([12, 18], (g) => {
    const b = [[8, 15, 0.05], [16, 14, 0.05], [17, 20, 0.05], [9, 21, 0.05]];
    g.fill(b, '#E07A6A'); g.outline(b, { w: 0.6, c: '#A84A3E', boil: false });
    for (let i = 1; i < 4; i++) g.line([[8 + i * 2, 15 - i * 0.25, 0.06], [9 + i * 2, 21 - i * 0.25, 0.06]], { w: 0.4, c: '#F3E7DA', boil: false });
    K.person(g, 10.5, 16.5, 0, K.who(31, { dir: 0, pose: 'sit' }));
    K.person(g, 14.6, 18.6, 0, K.who(32, { dir: 3, pose: 'sit' }));
    const p = g.p(13, 16.8, 0.6); g.disc2(p, 1.1, '#F3F1EA'); g.ring2(p, 1.1, { w: 0.4 });          // a plate
  }, { on: true });
  T.cast([23, 10], (g) => {                     // a reader: sitting, both hands brought to a book in front of the chest
    K.person(g, 23, 10.2, 1.3, K.who(33, { dir: 1, pose: 'sit', glasses: true, hands: [[-2.0, -8.4], [-3.1, -8.7]] }));
    const F = g.p(23, 10.2, 1.3), b = [[F[0] - 4.0, F[1] - 10.4], [F[0] - 1.6, F[1] - 9.6], [F[0] - 1.7, F[1] - 7.7], [F[0] - 4.1, F[1] - 8.5]];
    g.fill2(b, '#F6F1E4'); g.outline2(b, { w: 0.4, boil: false }); g.line2([[F[0] - 2.85, F[1] - 10.0], [F[0] - 2.9, F[1] - 8.1]], { w: 0.3, boil: false });
  }, { on: true });
  T.cast([-8.5, -14.5], (g) => K.person(g, -8.5, -14.5, 0.7, K.who(34, { dir: 2, pose: 'wave', ph: 0.3 })), { on: true });

  /* ---- the living things ---- */
  // a rowing boat circling the pond; the heading is rounded to 24 steps so there are only 24 drawings
  T.actor({ sample: 0.5, period: 40, grow: false,
    at(t) {
      const a = TAU * t / 40, x = PC[0] + Math.cos(a) * 4, y = PC[1] + Math.sin(a) * 3;
      const h = Math.round(Math.atan2(Math.cos(a) * 3, -Math.sin(a) * 4) / TAU * 24);
      const f = Math.floor((t * 0.7) % 1 * 6);             // the stroke: six drawings per pull
      return { x, y, z: 0.05, key: h + '.' + f, ang: h * TAU / 24, f };
    },
    draw(g, st) { K.boat(g, st.ang, { kind: 'row', L: 3.2, W: 1.4, hull: '#E6C24F', ph: st.f / 6, rower: K.who(36) }); } });
  // two ducks following each other
  for (let i = 0; i < 2; i++) T.actor({ sample: 0.5, period: 30, grow: false,
    at(t) { const a = -TAU * t / 30 + i * 0.5, x = PC[0] + Math.cos(a) * 7, y = PC[1] + Math.sin(a) * 5.5; return { x, y, key: Math.cos(a + Math.PI / 4) > 0 ? 'l' : 'r', flip: Math.cos(a + Math.PI / 4) > 0 }; },
    draw(g, st) {
      const o0 = g.p(0, 0, 0), s = st.flip ? -1 : 1, k = 1.6, o = [o0[0], o0[1]];
      const D = (x, y) => [o[0] + x * k * s, o[1] + y * k];
      const body = K.curve([D(-2.2, -0.9), D(-0.4, -1.4), D(1.4, -1.2), D(2.0, 0.1), D(0.2, 0.9), D(-1.8, 0.6)], 3, true);
      g.fill2(body, '#F3F1EA', true); g.fill2([D(-1.2, -0.9), D(0.8, -1.2), D(0.4, -0.3), D(-1.0, -0.2)], '#D9D2C2', true);
      g.line2(body, { w: 0.4, close: true, boil: false });
      g.disc2(D(1.6, -2.0), 0.95 * k, '#4F8A5C'); g.ring2(D(1.6, -2.0), 0.95 * k, { w: 0.35 });
      g.fill2([D(2.4, -2.2), D(3.4, -1.9), D(2.4, -1.6)], '#E6A23C', true); g.disc2(D(1.9, -2.3), 0.18 * k, '#1F1A16');
    } });
  // a cyclist going round the loop path, heading rounded to 16 steps
  T.actor({ sample: 0.3, period: 50,
    at(t) {
      const a = TAU * t / 50, p = onRing(a), dx = -Math.sin(a) * 1.15, dy = Math.cos(a), q = Math.round(Math.atan2(dy, dx) / (TAU / 16));
      return { x: p[0], y: p[1], key: q, ang: q * TAU / 16 };
    },
    draw(g, st) { K.bike(g, st.ang, { col: '#5F8FC9', seed: 37 }); } });
});
