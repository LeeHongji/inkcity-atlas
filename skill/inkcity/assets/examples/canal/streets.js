'use strict';
/* The canal and the lanes. One canal runs along x through the whole town, 14 u wide, its water 1.6 u below the paving.
   Built like a place (rim 0: it is the first thing the pen draws), under every place (order -99).
   What it is made of: green-teal water with long arcs and a darker band where the far quay wall reflects; the far quay
   wall of brick on an Istrian stone footing, a dark band of weed at the waterline, a white stone cap; a white stone
   cap along the near quay too. Between the places, 8 u lanes (calli) of grey trachyte slabs, the same paving as the
   squares. The map's cut edge (front and right end) shows the slab and, at the right end, the water in section.
   What moves: the boats. Each runs along the canal in one of two lanes (y -2.4 going +x, y +2.6 going -x) at one speed
   per lane, so boats never meet; they come in and leave at the ends of the town. A gondola is two actors (bow half and
   stern half) so it slides correctly under a bridge. People walk the lanes. */
SF.tile('streets', 0, 0, { order: -99, rim: 0, half: 46 }, function (T) {
  const { WL, Y, LIP, X0, X1 } = CAN, B = 46, GAPS = [[-54, -46], [46, 54]];
  T.ground(function (g) {
    // the lanes between the places, far bank and near bank are drawn separately: the near one after the water
    for (const [a, b] of GAPS) CAN.pave(g, a, -B, b, -Y - 0.8, { step: 2.6 });
    // the far quay wall: footing, brick courses, weed at the waterline, white cap
    const wall = K.on('L', -Y, X0, X1, WL, 0);
    g.fill(wall, '#C98A6E');
    const br = []; for (let z = WL + 0.45; z < -0.5; z += 0.42) for (let x = X0 + ((z * 7) % 1.6); x < X1 - 1; x += 1.6) { const a = g.p(x, -Y, z), c = g.p(x + 0.9, -Y, z); br.push(a[0], a[1], c[0], c[1]); }
    g.segs2(br, '#A9684E', 0.28);
    g.fill(K.on('L', -Y, X0, X1, WL, WL + 0.45), '#6F8A62');
    g.fill(K.on('L', -Y, X0, X1, -0.5, 0), CAN.ISTRIA);
    g.line([[X0, -Y, 0], [X1, -Y, 0]], { w: 0.9, boil: false }); g.line([[X0, -Y, -0.5], [X1, -Y, -0.5]], { w: 0.45, boil: false, c: '#9E968A' });
    g.fill(K.rect(X0, -Y - 0.8, X1, -Y, 0), CAN.ISTRIA); g.line([[X0, -Y - 0.8, 0], [X1, -Y - 0.8, 0]], { w: 0.4, boil: false, c: '#B9B2A4' });
    // the water, its reflection band, arcs and crests
    const wat = K.rect(X0, -Y, X1, Y, WL);
    g.fill(wat, CAN.WATER);
    g.fill(K.rect(X0, -Y, X1, -Y + 1.6, WL), '#86B4B6');
    g.water(wat, { dens: 0.55 });
    g.line([[X0, -Y, WL], [X1, -Y, WL]], { w: 0.75, c: '#4E6E66', boil: false });
    // the near bank of the lanes, and the white stone cap of the near quay (these hide the water under the near edge)
    for (const [a, b] of GAPS) CAN.pave(g, a, Y + 0.8, b, B, { step: 2.6 });
    g.fill(K.rect(X0, Y, X1, Y + 0.8, 0), CAN.ISTRIA); g.line([[X0, Y, 0], [X1, Y, 0]], { w: 0.9, boil: false }); g.line([[X0, Y + 0.8, 0], [X1, Y + 0.8, 0]], { w: 0.4, boil: false, c: '#B9B2A4' });
    // the cut edge of the map: front face, right end with the canal in section
    g.fill(K.on('L', B, X0, X1, -LIP, 0), C.slab);
    for (const [a, b] of [[-B, -Y], [Y, B]]) g.fill(K.on('R', X1, a, b, -LIP, 0), C.slabD);
    g.fill(K.on('R', X1, -Y, Y, -LIP, WL), CAN.WATERD);
    g.scratch(K.on('L', B, X0, X1, -LIP, 0), { dir: Math.atan2(-AY, AX) + Math.PI, dens: 0.35, c: '#C4AF8C' });
    g.line([[X0, B, 0], [X1, B, 0], [X1, Y, 0]], { w: 1, boil: false }); g.line([[X1, -Y, 0], [X1, -B, 0]], { w: 1, boil: false });
    g.line([[X0, B, -LIP], [X1, B, -LIP], [X1, -B, -LIP]], { w: 0.9, boil: false }); g.line([[X0, B, 0], [X0, B, -LIP]], { w: 0.8, boil: false });
    g.line([[X1, B, 0], [X1, B, -LIP]], { w: 0.7, boil: false }); g.line([[X1, -B, 0], [X1, -B, -LIP]], { w: 0.8, boil: false });
    g.line([[X1, -Y, 0], [X1, -Y, WL], [X1, Y, WL], [X1, Y, 0]], { w: 0.75, boil: false });
    g.line([[X0, -B, 0], [X1, -B, 0]], { w: 0.9, boil: false }); g.line([[X0, -B, 0], [X0, -Y - 0.8, 0]], { w: 0.9, boil: false }); g.line([[X0, Y, 0], [X0, B, 0]], { w: 0.9, boil: false });
  }, { rim: true });

  /* ---------- boats ---------- */
  const SPAN = X1 - X0 + 24, fade = (x) => clamp(Math.min(x - X0 + 4, X1 - 4 - x) / 7, 0, 1);
  // position along the canal of a boat in lane dirn (+1: going +x) at time t, with its phase s0 (u)
  const along = (t, v, s0, dirn) => { const s = (((s0 + v * t) % SPAN) + SPAN) % SPAN - 12; return dirn > 0 ? X0 + s : X1 - s; };
  const LANE = { 1: -2.4, '-1': 2.6 }, V = { 1: 3.0, '-1': 2.9 };
  /* a gondola: two actors, the bow half and the stern half; who rows and who rides is fixed per gondola */
  const gondola = (s0, dirn, seeds) => {
    const ang = dirn > 0 ? 0 : Math.PI, L2 = 3.2, rider = [K.who(seeds[0], { k: 0.82 }), K.who(seeds[1], { k: 0.82 })], rower = K.who(seeds[2]);
    for (const half of ['bow', 'stern']) T.actor({
      grow: false, sample: 0.25, period: SPAN / V[dirn],
      at(t) {
        const x = along(t, V[dirn], s0, dirn), a = fade(x); if (a <= 0.02) return null;
        const f = Math.floor(((t * 0.55 + s0 * 0.37) % 1) * 6), off = (half === 'bow' ? 1 : -1) * L2 * dirn;
        return { x: x + off, y: LANE[dirn], z: WL, key: half + dirn + (half === 'stern' ? '.' + f : ''), f, alpha: a < 1 ? a : null };
      },
      draw(g, st) {
        CAN.gondola(g, ang, half, st.f / 6, { who: rower, riders(g2, pt) {
          const d = dirn > 0 ? 0 : 2;
          for (const [u, v, w, i] of [[1.1, -0.45, rider[0], 0], [1.1, 0.5, rider[1], 1]].sort((p, q) => (dirn > 0 ? 1 : -1) * (q[1] - p[1]))) {
            const q = pt(u, v, 1.0);
            K.person(g2, q[0], q[1], q[2], Object.assign({}, w, { dir: d, pose: i ? 'wave' : 'sit', ph: 0.2, noLegs: true }));
          }
        } });
      },
    });
  };
  /* a transport boat: a flat working hull with crates, a boatman standing at the outboard */
  const cargo = (s0, dirn, seed) => {
    const ang = dirn > 0 ? 0 : Math.PI, man = K.who(seed, { top: '#3F5F8F', cap: '#3B3F47' });
    T.actor({ grow: false, sample: 0.25, period: SPAN / V[dirn],
      at(t) { const x = along(t, V[dirn], s0, dirn), a = fade(x); if (a <= 0.02) return null; return { x, y: LANE[dirn], z: WL, key: 'cargo' + dirn, alpha: a < 1 ? a : null }; },
      draw(g) {
        const ca = Math.cos(ang), sa = Math.sin(ang), L = 4.4;
        K.boat(g, ang, { kind: 'cargo', L, W: 1.5, hull: '#5E8DA0', stripe: '#EDE6D6', deck: '#B58F5E' });
        const at = (u, v) => [u * ca - v * sa, u * sa + v * ca];
        const crate = (u, v, h, col) => { const c = at(u, v); K.rbox(g, c[0], c[1], 0.85, 0.75, ang, 1.3, 1.3 + h, { t: shade(col, -0.2), l: col, r: shade(col, 0.12) }, { w: 0.5 }); };
        const items = [[2.2, 0.55, 1.0, '#C9A26B'], [2.2, -0.65, 1.0, '#C9A26B'], [0.4, 0.55, 1.0, '#B58F5E'], [0.4, -0.65, 1.0, '#C9A26B'], [1.3, 0, 2.0, '#D9B57E']];
        items.sort((p, q) => { const a = at(p[0], p[1]), b = at(q[0], q[1]); return (a[0] + a[1]) - (b[0] + b[1]); });
        for (const [u, v, h, col] of items) { crate(u, v, h, col); const c = at(u, v), top = g.p(c[0], c[1], 1.3 + h); const fr = ['#E0623F', '#8FBF73', '#E6C24F'][Math.round(Math.abs(u * 3 + v * 7)) % 3]; g.disc2([top[0] - 0.9, top[1] + 0.2], 0.9, fr); g.disc2([top[0] + 0.8, top[1] - 0.2], 0.9, fr); g.disc2([top[0], top[1] + 0.6], 0.9, shade(fr, 0.1)); }
        const m = at(-L * 0.62, 0); const ob = at(-L * 0.98, 0);
        K.rbox(g, ob[0], ob[1], 0.45, 0.35, ang, 0.6, 2.4, { t: '#3A3632', l: '#4A4642', r: '#2E2A26' }, { w: 0.45 });
        const F = g.p(m[0], m[1], 1.3), tl = g.p(ob[0], ob[1], 2.2), d = (ca + sa > 0) ? 0 : 2;
        K.person(g, m[0], m[1], 1.3, Object.assign({}, man, { dir: d, pose: 'hold', reach: [(tl[0] - F[0]) * 0.6, -9.2] }));
      } });
  };
  /* a little rowing boat: someone pulling two oars */
  const rowboat = (s0, dirn, seed) => {
    const ang = dirn > 0 ? 0 : Math.PI, who = K.who(seed, { k: 0.95 });
    T.actor({ grow: false, sample: 0.25, period: SPAN / V[dirn],
      at(t) { const x = along(t, V[dirn], s0, dirn), a = fade(x); if (a <= 0.02) return null; const f = Math.floor(((t * 0.7) % 1) * 6); return { x, y: LANE[dirn], z: WL, key: 'row' + dirn + '.' + f, f, alpha: a < 1 ? a : null }; },
      draw(g, st) { K.boat(g, ang, { kind: 'row', L: 3.0, W: 1.3, hull: '#E6C24F', stripe: '#C9584B', ph: st.f / 6, rower: who }); } });
  };
  // phases (u along the lane at t = 0) chosen so that boats cross the shots: see 35_scene.js
  gondola(BOAT.g1, 1, [401, 402, 403]);
  gondola(BOAT.g2, 1, [404, 405, 406]);
  cargo(BOAT.c1, -1, 407);
  rowboat(BOAT.r1, -1, 408);

  /* ---------- people in the lanes ---------- */
  CAN.walker(T, 411, [[-50.5, -44], [-50.5, -10]], 1.6);
  CAN.walker(T, 412, [[50.5, 44], [50.5, 11], [49.5, 11], [49.5, 44]], 1.5, { t0: 6 });
  CAN.walker(T, 413, [[-49.5, 12], [-49.5, 43]], 1.4, { t0: 3 });
});
