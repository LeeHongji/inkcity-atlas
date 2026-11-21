'use strict';
/* The water: the Golden Horn across the top of the map (y -72..-28), the Bosphorus down its whole length (x 28..72) and
   the Üsküdar–Kadıköy bay opening off it on the Asian side (x > 72, y -37..37). A shallow trench, 2.6 u below the quays.
   What it is made of: grey limestone quay walls with a dark weed line at the water, iron mooring rings, steps down to
   the water; turquoise-green water, darker at the foot of the far walls, long shallow arcs, white crests where the
   current runs. Only the far banks show their walls (the Horn's north bank faces +y, the Bosphorus's west bank +x, the
   bay's north bank +y); the near banks belong to the tiles and the promenades. The map's near edges cut the water in
   section (the Bosphorus's south end, the bay's east end).
   What moves: the ferries (src/37_timetable.js): route A Eminönü–Kadıköy and route B Karaköy–Üsküdar (the big vapur),
   the Golden Horn ferries D1 (in, under the bridge and up the Bosphorus) and D2 (back), gulls trailing each; fishing
   kayıks pottering in the bay and the inner Horn; a rowing boat. */
/* drawn inside the streets tile (one map-wide tile only) */
const ISWATER = function (T) {
  const WL = IT.WL, H = IT.HORN, B = IT.BOS, Y = IT.BAY, M = 137, Q = IS.C.quay, QD = IS.C.quayD;
  T.ground(function (g) {
    // the water: one outline for the Horn, the Bosphorus and the bay
    const W = [[-M, H.N], [B.W, H.N], [B.W, -M], [B.E, -M], [B.E, Y.N], [M, Y.N], [M, Y.S], [B.E, Y.S], [B.E, M], [B.W, M], [B.W, H.S], [-M, H.S]].map((p) => [p[0], p[1], WL]);
    g.fill(W, IS.C.water);
    // darker water at the foot of the far walls (their reflection), lighter channels mid-stream
    g.fill(K.rect(-M, H.N, B.W, H.N + 3.6, WL), IS.C.waterD); g.fill(K.rect(B.W, -M, B.W + 3.6, H.N, WL), IS.C.waterD); g.fill(K.rect(B.W, H.S, B.W + 3.6, M, WL), IS.C.waterD); g.fill(K.rect(B.E, Y.N, M, Y.N + 3.6, WL), IS.C.waterD);
    const R = RNG(4411);
    for (let i = 0; i < 26; i++) {
      const zone = i % 3, x = zone === 0 ? -M + R() * (B.W + M - 20) : zone === 1 ? B.W + 8 + R() * 22 : B.E + 6 + R() * 50, y = zone === 0 ? H.N + 8 + R() * 26 : zone === 1 ? -M + 10 + R() * 250 : Y.N + 10 + R() * 50, l = 6 + R() * 10;
      if (zone === 1 && y > H.N && y < H.S) continue;
      g.fill(zone === 1 ? [[x, y, WL], [x + 1.4, y, WL], [x + 1.4, y + l, WL], [x, y + l, WL]] : [[x, y, WL], [x + l, y, WL], [x + l, y + 1.4, WL], [x, y + 1.4, WL]], IS.C.waterL);
    }
    g.water(K.rect(-M, H.N + 3, B.W, H.S - 2, WL), { dens: 0.75, c: '#5E9396' });
    g.water(K.rect(B.W + 3, -M, B.E - 2, H.N, WL), { dens: 0.75, c: '#5E9396' });
    g.water(K.rect(B.W + 3, H.S, B.E - 2, M, WL), { dens: 0.75, c: '#5E9396' });
    g.water(K.rect(B.W + 3, H.N, M, Y.S - 3, WL), { dens: 0.6, c: '#5E9396' });
    // the far quay walls: limestone courses, a dark weed line at the water, the coping at the top
    const wall = (face, p, a0, a1) => {
      g.fill(K.on(face, p, a0, a1, WL, 0), Q);
      g.fill(K.on(face, p + (face === 'L' ? 0.01 : 0.01), a0, a1, WL, WL + 0.55), '#5F6E58');
      const s = []; for (let z = WL + 1.2; z < -0.3; z += 0.9) { const a = g.p.apply(g, K.pt(face, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(face, p + 0.02, a1, z)); s.push(a[0], a[1], b[0], b[1]); }
      for (let a = a0 + 1.4, r = 0; a < a1; a += 2.8, r++) for (let z = WL + 0.55; z < -0.3; z += 0.9) { const aa = a + ((Math.round((z - WL) / 0.9)) % 2) * 1.4; if (aa > a1) continue; const q0 = g.p.apply(g, K.pt(face, p + 0.02, aa, z)), q1 = g.p.apply(g, K.pt(face, p + 0.02, aa, Math.min(z + 0.9, -0.3))); s.push(q0[0], q0[1], q1[0], q1[1]); }
      g.segs2(s, QD, 0.3);
      g.fill(K.on(face, p + 0.02, a0, a1, -0.5, 0), IS.C.quayTop);
      g.line([K.pt(face, p, a0, 0), K.pt(face, p, a1, 0)], { w: 0.85, boil: false }); g.line([K.pt(face, p, a0, WL), K.pt(face, p, a1, WL)], { w: 0.5, c: '#3F4E3A', boil: false });
      const rr = []; for (let a = a0 + 5; a < a1 - 2; a += 11) rr.push(g.p.apply(g, K.pt(face, p + 0.04, a, -1.3))); for (const q of rr) g.ring2(q, 0.5, { w: 0.3, c: '#4A4540' });
    };
    wall('L', H.N, -M, -63); wall('L', H.N, -37, B.W);
    wall('R', B.W, -M, H.N); wall('R', B.W, H.S, M);
    wall('L', Y.N, B.E, M);
    // steps down to the water in a few places
    for (const [face, p, a] of [['L', H.N, -118], ['L', H.N, -20], ['R', B.W, 88], ['L', Y.N, 120]]) {
      const P = (aa, z) => K.pt(face, p + 0.03, aa, z);
      g.fill([P(a, 0), P(a + 2.2, 0), P(a + 2.2 + 3.2, WL), P(a + 3.2, WL)], '#BDB5A3');
      const st = []; for (let i = 1; i < 6; i++) { const t = i / 6, q0 = g.p.apply(g, P(a + 3.2 * t, WL * t)), q1 = g.p.apply(g, P(a + 2.2 + 3.2 * t, WL * t)); st.push(q0[0], q0[1], q1[0], q1[1]); }
      g.segs2(st, QD, 0.35);
    }
    // the cut sections at the map's near edges: the Bosphorus's south end and the bay's east end
    const D = WL - 1.1;
    g.fill([[B.W, M, WL], [B.E, M, WL], [B.E, M, D], [B.W, M, D]], '#76A6A6');
    g.line([[B.W, M, 0], [B.W, M, D], [B.E, M, D], [B.E, M, 0]], { w: 0.85, boil: false }); g.line([[B.W, M, WL], [B.E, M, WL]], { w: 0.5, c: '#4E7A7A', boil: false });
    g.fill([[M, Y.S, WL], [M, Y.N, WL], [M, Y.N, D], [M, Y.S, D]], '#6A9696');
    g.line([[M, Y.S, 0], [M, Y.S, D], [M, Y.N, D], [M, Y.N, 0]], { w: 0.85, boil: false }); g.line([[M, Y.S, WL], [M, Y.N, WL]], { w: 0.5, c: '#4E7A7A', boil: false });
    // the far (hidden) map edges of the water: a plain ink line
    g.line([[-M, H.N, WL], [-M, H.S, WL]], { w: 0.7, boil: false }); g.line([[B.W, -M, WL], [B.E, -M, WL]], { w: 0.7, boil: false });
  });

  /* ---------------- the ferries ---------------- */
  const parts = [[-9.6, -3.2], [-3.2, 3.2], [3.2, 9.7]];
  const fstate = (r) => (t) => { const s = IT.ferry(r, t); if (!s) return null; const moving = s.label !== 'em' && s.label !== 'kd' && s.label !== 'ka' && s.label !== 'us' && s.label !== 'away'; return { x: s.x, y: s.y, ang: s.ang, alpha: s.alpha, k: moving ? 'm' : 's' }; };
  const FA = { m: IS.FERRY(11, { wake: true, smoke: true }), s: IS.FERRY(11, {}) }, FB = { m: IS.FERRY(23, { wake: true, smoke: true }), s: IS.FERRY(23, {}) };
  IS.boatActors(T, (st) => FA[st.k || 's'], parts, fstate('A'), { period: IT.WC, sample: 0.3 });
  IS.boatActors(T, (st) => FB[st.k || 's'], parts, fstate('B'), { period: IT.WC, sample: 0.3 });
  const HA = IS.HALIC(5), HB = IS.HALIC(9), hparts = [[-6.9, -2.2], [-2.2, 2.2], [2.2, 7.0]];
  IS.boatActors(T, HA, hparts, fstate('D1'), { period: IT.WC, sample: 0.3 });
  IS.boatActors(T, HB, hparts, fstate('D2'), { period: IT.WC, sample: 0.3 });
  // the Turkish flag at each ferry's stern: a small actor riding with it
  for (const r of ['A', 'B']) T.actor({ grow: false, sample: 0.3, period: IT.WC,
    at(t) { const s = IT.ferry(r, t); if (!s) return null; const ca = Math.cos(s.ang), sa = Math.sin(s.ang), f = Math.floor(t * 6) % 4; return { x: s.x - 9.0 * ca, y: s.y - 9.0 * sa, z: WL + 3.6, key: f, f }; },
    draw(g, st) { const b = g.p(0, 0, 0), t = g.p(0, 0, 3.6); g.line2([b, t], { w: 0.4, c: '#4A4540', boil: false, ext: 0 }); const w = [0, 0.5, 0.9, 0.5][st.f]; const q = [t, [t[0] - 4.2, t[1] + 0.4 + w], [t[0] - 4.0, t[1] + 2.9 + w], [t[0], t[1] + 2.6]]; g.fill2(q, IS.C.red); g.disc2([t[0] - 1.6, t[1] + 1.5 + w * 0.5], 0.75, '#F6F3EA'); g.disc2([t[0] - 1.35, t[1] + 1.5 + w * 0.5], 0.62, IS.C.red); } });
  // gulls trail the big ferries
  for (const r of ['A', 'B', 'D1']) IS.gulls(T, 3, (t) => { const s = IT.ferry(r, t); if (!s) return null; const ca = Math.cos(s.ang), sa = Math.sin(s.ang); return { x: s.x - 11 * ca, y: s.y - 11 * sa, alpha: s.alpha }; }, { r: 4.5, z: 9, period: IT.WC, cast: false });

  /* ---------------- small boats ---------------- */
  // fishing kayıks: slow loops in the inner Horn and the bay; a rowing boat near the Maiden's Tower
  const loop = (cx, cy, rx, ry, per, ph) => (t) => { const a = TAU * (t / per + ph); return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, ang: a + Math.PI / 2 }; };
  const kay = [[-110, -66, 12, 1.5, 70, 0.1, '#F1EBDD', '#3F7FA8'], [-88, -65.5, 6, 1.2, 55, 0.6, '#E9D3A6', '#C8372D'], [126, 6, 6, 14, 80, 0.3, '#F1EBDD', '#2E7A5E'], [118, 26, 8, 2.5, 60, 0.8, '#DCE8EE', '#C8372D']];
  kay.forEach(([cx, cy, rx, ry, per, ph, hull, stripe], i) => {
    const f = loop(cx, cy, rx, ry, per, ph), who = IS.who(700 + i, { fcap: '#3F5F8F', bot: '#3B3F47' });
    T.actor({ grow: false, sample: 0.5, period: per, cast: false,
      at(t) { const s = f(t), q = Math.round(s.ang / (TAU / 32)); return { x: s.x, y: s.y, z: WL, key: ((q % 32) + 32) % 32, ang: q * TAU / 32 }; },
      draw(g, st) { IS.kayik(g, st.ang, { hull, stripe, rower: who, ph: 0.3 }); } });
  });
};
