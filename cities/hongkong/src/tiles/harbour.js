'use strict';
/* Victoria Harbour: the spine of the map, drawn inside the streets tile (one map-wide tile only). A straight reach
   across the whole map between the Island's granite seawall (y 24, the face we see) and Kowloon's (y 76), its water
   2.2 u below the promenades. Grey-green water holding the evening: the low December sun lays gold on it, and under
   the Island the lit towers drop warm streaks into the dark band along the wall.
   What moves: the two Star Ferries shuttling Central <-> Tsim Sha Tsui on their timetable (src/37_timetable.js), the
   red-sailed junk and the Macau jetfoil westbound, a lighter with its derrick and the marine police eastbound, gulls,
   and the ferries' wakes. Boats keep their hulls north of y 71, where Kowloon's edge starts to hide the water. */
const HARBOUR = function (T) {
  const E = HT.END, I = HT.HAR.I, Kw = HT.HAR.K, WL = HT.HAR.WL;
  T.ground(function (g) {
    g.fill(K.rect(-E, I, E, Kw, WL), HK.C.water);
    // the dark band in the Island's shadow, the warm streaks of its lights
    g.fill(K.rect(-E, I, E, I + 4.4, WL), '#86A6A8');
    { const R = RNG(31), s = [], w = []; for (let i = 0; i < 260; i++) { const x = -E + R() * 2 * E, y = I + 0.6 + R() * 7, L = 0.8 + R() * 2.2, a = g.p(x, y, WL), b = g.p(x + L, y, WL); (R() < 0.6 ? s : w).push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#E9C27A', 0.55); g.segs2(w, '#F6E7B8', 0.4); }
    // the sky's washed bands and the sun's gold on the open water
    for (let x = -E; x < E; x += 22) { const R = RNG(Math.round(x + 900)), y = I + 10 + R() * 30; g.fill([[x, y, WL], [x + 14 + R() * 6, y, WL], [x + 16, y + 1.3, WL], [x + 2, y + 1.3, WL]], '#B9CFCB'); }
    g.water(K.rect(-E, I + 4, E, Kw - 3, WL), { dens: 0.7, c: '#6F9396' });
    { const R = RNG(57), s = []; for (let i = 0; i < 150; i++) { const x = 30 + R() * 136, y = I + 8 + R() * 40, L = 1 + R() * 3.6, a = g.p(x, y, WL), b = g.p(x + L, y + L * 0.1, WL); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, HK.C.glint, 0.7); }
    // the Island's seawall (the face we see) and its coping; Kowloon's edge is the near bank's top line
    HK.seawall(g, -E, E, I, WL);
    g.line([[-E, Kw, 0], [E, Kw, 0]], { w: 0.85, boil: false });
    // the cut section at the near (west) end: walls and the water in section
    const D = WL - 1.1;
    g.fill([[E, I, WL], [E, Kw, WL], [E, Kw, D], [E, I, D]], '#7F9C9E');
    g.fill([[E, I - 0.01, 0], [E, I - 0.01, D], [E, I + 0.01, D], [E, I + 0.01, 0]], C.slabD);
    g.fill([[E, Kw, 0], [E, Kw + 1.2, 0], [E, Kw + 1.2, D], [E, Kw, D]], C.slabD);
    g.line([[E, I, 0], [E, I, D], [E, Kw + 1.2, D], [E, Kw + 1.2, 0]], { w: 0.85, boil: false }); g.line([[E, I, WL], [E, Kw, WL], [E, Kw, 0]], { w: 0.6, boil: false });
    g.line([[-E, I, 0], [-E, Kw, 0]], { w: 0.7, boil: false });
  });

  /* ---- the Star Ferries ---- */
  const F = HT.FERRY;
  ['A', 'B'].forEach((f, k) => {
    const prims = HK.STARFERRY(k, k ? 'NIGHT STAR' : 'MORNING STAR');
    HK.boatActors(T, prims, [[-7.6, 7.6]], (t) => { const s = HT.ferry(f, t); return { x: s.x, y: s.y, ang: s.ang }; }, { period: HT.WC, sample: 0.2 });
    // the wake behind a moving ferry, and the churn at the end that pushes off the pier
    T.actor({ grow: false, sample: 0.2, period: HT.WC,
      at(t) {
        const s = HT.ferry(f, t); if (!s.moving) return null;
        const yEnd = s.y - s.moving * (F.hl + 0.6), room = s.moving > 0 ? yEnd - I - 1.5 : Kw - 5.5 - yEnd, L = Math.round(clamp(room, 0, 7));
        if (L < 1) return null; const ph = Math.floor(t * 4) % 3;
        return { x: s.x, y: yEnd, z: WL, key: (s.moving > 0 ? 'u' : 'd') + ph + '.' + L, m: s.moving, ph, L };
      }, bias: -16,
      draw(g, st) { const s = [], m = st.m, L = st.L; for (let i = 0; i < 5 && i * 1.6 < L; i++) { const y = -m * (i * 1.6 + st.ph * 0.5), w = 2.2 + i * 0.45, a = g.p(-w, y, 0), b = g.p(-w - 0.7, y - m * 0.9, 0), c = g.p(w, y, 0), d = g.p(w + 0.7, y - m * 0.9, 0); s.push(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]); } g.fill([[-2.3, 0, 0], [2.3, 0, 0], [2.9, -m * L, 0], [-2.9, -m * L, 0]], 'rgba(236,244,242,0.5)'); g.segs2(s, '#F6FAF8', 0.6); } });
  });
  /* ---- the harbour lanes ---- */
  for (const b of HT.BOATS) {
    const prims = b.kind === 'junk' ? HK.JUNK : b.kind === 'jet' ? HK.JET : b.kind === 'lighter' ? HK.LIGHTER : HK.POLICE;
    HK.boatActors(T, prims, [[-b.hl - 1, b.hl + 1]], (t) => HT.boat(b, t), { period: HT.WC, sample: 0.25 });
  }
  /* ---- gulls over the water ---- */
  for (let i = 0; i < 5; i++) T.actor({ layer: 'top', sample: 5, period: 10, grow: false,
    at(t) { const a = t * (0.32 + i * 0.05) + i * 1.9, f = Math.floor(t * 5 + i) % 4; return { x: -130 + i * 62 + Math.cos(a) * 9, y: 50 + Math.sin(a) * 7, z: 13 + (i % 3) * 3, key: f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), w = [3.2, 2.4, 1.2, 2.4][st.f], d = [1.4, 0.4, -0.6, 0.4][st.f]; g.line2([[o[0] - w, o[1] - d], [o[0] - 0.6, o[1] - 0.2], [o[0], o[1] + 0.4], [o[0] + 0.6, o[1] - 0.2], [o[0] + w, o[1] - d]], { w: 0.5, c: '#3A3530', boil: false, wob: 0.2 }); } });
};
