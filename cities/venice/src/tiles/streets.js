'use strict';
/* The streets of Venice are water. One map-wide tile (order -99, built first) holds the lagoon round the city, the
   canals between the places (green water 2 u below the paving, the far banks' stone walls with their white Istrian
   cap and the dark weed band at the waterline), every bridge, the floating vaporetto stops, and the boats.
   What moves: the whole traffic of the city on a timetable (VN.LANES, phases from tools/search_boats.mjs): vaporetti
   calling at their stops on the Grand Canal and in the Bacino, gondolas with their gondoliers rowing standing up,
   delivery barges loaded with crates, the rubbish boat with its crane, water taxis, the ambulance boat with its light
   flashing, Carnival rowers in costume. Boats keep right and never meet; at a junction they cross in turn.
   The near strip of every canal (~5 u under the near bank's paving) is hidden: lanes keep clear of it. */
SF.tile('streets', 0, 0, { order: -99, rim: 0, castAt: 60 }, function (T) {
  const WL = VN.WL, E = 137, TILES = [];
  for (const cx of [-100, 0, 100]) for (const cy of [-100, 0, 100]) TILES.push([cx, cy]);
  // the lagoon's ragged painted edge
  const R = RNG(31), edge = [];
  const side = (ax, a0, a1, c, s) => { for (let a = a0; s > 0 ? a < a1 : a > a1; a += s * 9) { const o = 158 + R() * 9 + 4 * Math.sin(a * 0.05); edge.push(ax === 'x' ? [a, c * o, WL] : [c * o, a, WL]); } };
  side('x', -170, 170, -1, 1); side('y', -170, 170, 1, 1); side('x', 170, -170, 1, -1); side('y', 170, -170, -1, -1);
  T.ground(function (g) {
    g.boilP = 0.1;
    g.fill(edge, VN.lagoon);
    g.water(K.rect(-162, -162, 165, 165, WL), { dens: 0.32 });
    // the canals: greener water between the places, fading into the lagoon at their mouths
    const ch = [];
    for (const c of [-50, 50]) { ch.push(K.rect(-E, c - 13, E, c + 13, WL)); ch.push(K.rect(c - 13, -E, c + 13, E, WL)); }
    for (const q of ch) g.fill(q, VN.water);
    for (const c of [-50, 50]) for (const [a, b] of [[E, E + 9], [-E - 9, -E]]) { g.fill(K.rect(a, c - 13, b, c + 13, WL), mix(VN.water, VN.lagoon, 0.5)); g.fill(K.rect(c - 13, a, c + 13, b, WL), mix(VN.water, VN.lagoon, 0.5)); }
    for (const q of ch) g.water(q, { dens: 0.9 });
    // the far banks: the walls of every place's two near sides (+x 'R', +y 'L'), with their reflections on the water
    for (const [cx, cy] of TILES) {
      for (const f of ['L', 'R']) {
        const p = f === 'L' ? cy + 37 : cx + 37, a0 = f === 'L' ? cx - 37 : cy - 37, a1 = f === 'L' ? cx + 37 : cy + 37;
        const refl = f === 'L' ? K.rect(a0, p, a1, p + 2.2, WL) : K.rect(p, a0, p + 2.2, a1, WL);
        g.fill(refl, f === 'L' ? '#7EA393' : '#789D8E');
        const wall = K.on(f, p, a0, a1, WL, 0);
        g.fill(wall, f === 'L' ? '#C9A88E' : '#B59479');
        const cs = []; for (let z = WL + 0.9; z < -0.5; z += 0.45) { const A = g.p.apply(g, K.pt(f, p, a0, z)), B = g.p.apply(g, K.pt(f, p, a1, z)); cs.push(A[0], A[1], B[0], B[1]); }
        for (let a = a0 + 0.8, k = 0; a < a1; a += 1.6, k++) for (let z = -0.45, j = 0; z > WL + 0.9; z -= 0.45, j++) { const A = g.p.apply(g, K.pt(f, p, a + (j % 2) * 0.8, z)), B = g.p.apply(g, K.pt(f, p, a + (j % 2) * 0.8, z - 0.45)); cs.push(A[0], A[1], B[0], B[1]); }
        g.segs2(cs, f === 'L' ? '#B08F75' : '#9C7D64', 0.24);
        g.fill(K.on(f, p, a0, a1, -0.45, 0), f === 'L' ? VN.istria : VN.istriaD);
        g.fill(K.on(f, p, a0, a1, WL, WL + 0.75), f === 'L' ? '#5F7A5A' : '#536D4F');
        g.line([K.pt(f, p, a0, WL), K.pt(f, p, a1, WL)], { w: 0.55, c: '#3E5A4C', boil: false, ext: 0 });
        g.line([K.pt(f, p, a0, -0.45), K.pt(f, p, a1, -0.45)], { w: 0.3, c: '#9E968A', boil: false, ext: 0 });
      }
    }
    // the lagoon's misty outer edge: thin veils of cream laid over the water where it fades into the paper
    const fogs = [[-168, 110, 46], [-80, 172, 52], [40, 176, 50], [130, 172, 46], [176, 120, 50], [178, 10, 44], [176, -90, 46], [110, -172, 42], [-172, -30, 44], [-140, -168, 40]];
    fogs.forEach(([x, y, w], i) => { for (let k = 0; k < 2; k++) { const c = g.p(x + k * 6, y - k * 6, WL), Rr = RNG(70 + i * 3 + k), pts = []; for (let j = 0; j < 9; j++) { const a = TAU * j / 9; pts.push([c[0] + Math.cos(a) * w * (0.75 + Rr() * 0.4), c[1] + Math.sin(a) * w * 0.14 * (0.8 + Rr() * 0.5)]); } K.blob2(g, pts, 'rgba(246,244,238,0.32)', { seed: 80 + i * 2 + k, rag: 1.4 }); } });
    // the open lagoon round the city, as a mask the lights reflect in at night (a clear fill: nothing shows by day;
    // the lagoon's own fill runs on under the places, so it cannot be the mask itself). Last, so nothing before it moves.
    for (const r of [[-152, -152, 152, -137], [-152, 137, 152, 152], [-152, -137, -137, 137], [137, -137, 152, 137]]) g.fill(K.rect(r[0], r[1], r[2], r[3], WL), VN.WMASK);
  }, { rim: true });

  /* ---------------- the boats ---------------- */
  const SH = SCENE.shots.find((s) => s.name === 'rialto'), OFF = SH ? VN.RIALTO_T - SH.a / 30 : 0;   // a vaporetto berths at Rialto as the shot opens
  VN.T0 = OFF;
  VN.LANES.forEach((ln, li) => ln.boats.forEach((kind, k) => {
    const seed = 900 + li * 10 + k, R2 = RNG(seed);
    const who = VN.who(seed, { colombina: null }), gown = R2() < 0.5;
    const riders = [gown ? VN.carnival(seed + 1, 'gown') : VN.who(seed + 1), R2() < 0.6 ? VN.carnival(seed + 2, R2() < 0.5 ? 'bauta' : 'cape') : VN.who(seed + 2)];
    const draw = { seed, who, riders, line: ln.id === 'gc1' ? 1 : ln.id === 'gc3' ? 2 : ln.id === 'bc0' ? 'N' : 5.1 };
    if (kind === 'ambulanza') draw.fast = 1;
    VN.boatActors(T, kind, (t) => { const s = VN.boatAt(ln, k, t + OFF); return s.alpha > 0.02 ? s : null; }, {
      period: VN.P, draw,
      key: (s) => (kind === 'gondola' || kind === 'sandolo' ? Math.floor(((s.u * 0.33 + seed) % 6 + 6) % 6) : kind === 'ambulanza' ? Math.floor(s.u * 0.5) % 2 : ''),
      drawOf: (s) => (kind === 'gondola' || kind === 'sandolo' ? { ph: Math.floor(((s.u * 0.33 + seed) % 6 + 6) % 6) / 6 } : kind === 'ambulanza' ? { flash: Math.floor(s.u * 0.5) % 2 } : {}),
    });
  }));
});
