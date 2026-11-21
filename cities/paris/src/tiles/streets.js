'use strict';
/* Paris's street grid. Two boulevards run along x at y = -50 and y = +50, crossing the Seine on bridges at x -63..-37
   (the bridges belong to the seine tile); one runs along y at x = +50 (x = -50 is the river). Wide pale pavements,
   asphalt roadways with a dashed centre line, zebra bars at the two crossings. Right-hand traffic: small cars, black
   taxis, scooters, Vélib' bikes, the green-and-white bus, a delivery van. The traffic is a timetable: every vehicle is
   periodic and the lane phases were searched offline (tools/search_traffic.mjs) so that no two boxes ever overlap.
   Street trees and furniture on the pavements are planted by the place in front of them (PA.streetSide), so that they
   sort with that place's buildings, not before every place. */
const PST = { end: 150, rw: 7, pw: 13, deck: (x) => (x > RIVER.X0 && x < RIVER.X1 ? 1.0 * Math.sin(Math.PI * (x - RIVER.X0) / (RIVER.X1 - RIVER.X0)) : 0) };

/* the street trees and furniture a place owns: plane trees on the far pavement behind it, lamps on the near kerb.
   T: the place's tile; o.furn: [[world x, world y, kind, arg], ...] small things on pavements next to it */
PA.streetSide = function (T, o) {
  o = o || {}; const cx = T.cx, cy = T.cy, H = 37;
  const skip = o.skip || [];
  const plant = (wx, wy, i) => { if (skip.some((s) => Math.abs(s[0] - wx) < s[2] && Math.abs(s[1] - wy) < s[2])) return; const x = wx - cx, y = wy - cy; T.obj([x, y], (g) => PA.plane(g, x, y, { r: 4.0 + h1(i * 7 + wx) * 0.8, h: 6.4, turn: 0.35 + h1(i * 3 + wy) * 0.6 }), { name: 'street tree' }); };
  // the street behind along x (rows 0 and 100) and the one behind along y (column 100)
  if (cy === 0 || cy === 100) for (let a = cx - H + 4, i = 0; a <= cx + H - 3; a += 11, i++) { plant(a, cy - 60.6, i); const lx = a + 5.5 - cx; if (lx < H - 2) T.obj([lx, -42.4], (g) => PA.lamp(g, lx, -42.4, {}), { name: 'lamp' }); }
  if (cx === 100) for (let a = cy - H + 4, i = 0; a <= cy + H - 3; a += 11, i++) { plant(cx - 60.6, a, i + 40); const ly = a + 5.5 - cy; if (ly < H - 2) T.obj([-42.4, ly], (g) => PA.lamp(g, -42.4, ly, {}), { name: 'lamp' }); }
  for (const [wx, wy, kind, arg] of o.furn || []) {
    const x = wx - cx, y = wy - cy;
    if (kind === 'morris') T.obj([x, y], (g) => PA.morris(g, x, y), { name: 'morris' });
    else if (kind === 'wallace') T.obj([x, y], (g) => PA.wallace(g, x, y), { name: 'wallace' });
    else if (kind === 'kiosk') T.obj([x - 1.8, y - 1.8, x + 1.8, y + 1.8], (g) => PA.kiosk(g, x, y), { name: 'kiosk' });
    else if (kind === 'metro') T.obj(arg === 'x' ? [x - 3.8, y - 1.8, x + 3.8, y + 1.8] : [x - 1.8, y - 3.8, x + 1.8, y + 3.8], (g) => PA.metro(g, x, y, { ax: arg }), { name: 'metro' });
    else if (kind === 'velib') T.obj(arg === 'x' ? [x - 5, y - 1, x + 5, y + 1] : [x - 1, y - 5, x + 1, y + 5], (g) => PA.velibDock(g, x, y, 6, arg), { name: 'velib dock' });
  }
};

SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const E = PST.end, RW = PST.rw, PW = PST.pw, ASPH = PC.asph, PAVE = PC.pave, LINE = '#F7F5EE';
  // the straight runs: [axis, c, a0, a1]; along x the river splits the run in two
  const RUNS = [['x', -50, -E, RIVER.X0], ['x', -50, RIVER.X1, E], ['x', 50, -E, RIVER.X0], ['x', 50, RIVER.X1, E], ['y', 50, -E, E]];
  const R4 = (ax, c, a0, a1, w) => ax === 'x' ? K.rect(a0, c - w, a1, c + w) : K.rect(c - w, a0, c + w, a1);
  T.ground(function (g) {
    // pavements, then roadways, then the crossings
    for (const [ax, c, a0, a1] of RUNS) g.fill(R4(ax, c, a0, a1, PW), PAVE);
    for (const [ax, c, a0, a1] of RUNS) g.fill(R4(ax, c, a0, a1, RW), ASPH);
    for (const c of [-50, 50]) g.fill(K.rect(50 - RW - 2, c - RW - 2, 50 + RW + 2, c + RW + 2), ASPH);
    // pavement texture: big pale slabs in joints, dry scuffs; asphalt scuffs along the traffic
    for (const [ax, c, a0, a1] of RUNS) {
      const d = ax === 'y' ? Math.atan2(AY, -AX) : Math.atan2(AY, AX);
      for (const s of [-1, 1]) { const q = ax === 'x' ? K.rect(a0, c + s * RW, a1, c + s * PW) : K.rect(c + s * RW, a0, c + s * PW, a1); g.scuff(q, { dir: d, len: 3, c: '#F2EEE4', dens: 0.5, w: 0.5, spread: 0.6 }); }
      g.scuff(R4(ax, c, a0, a1, RW), { dir: d, len: 9, c: '#DDD8CC', dens: 0.45, w: 0.55, spread: 0.05 });
      g.scuff(R4(ax, c, a0, a1, RW), { dir: d, len: 7, c: '#BDB7AA', dens: 0.1, w: 0.45, spread: 0.04 });
      // kerb lines
      for (const s of [-1, 1]) g.line(ax === 'x' ? [[a0, c + s * RW, 0], [a1, c + s * RW, 0]] : [[c + s * RW, a0, 0], [c + s * RW, a1, 0]], { w: 0.5, c: '#A9A296', boil: false, ext: 0 });
    }
    // dashed centre lines, broken at the crossings
    const dash = [];
    for (const [ax, c, a0, a1] of RUNS) for (let s = a0 + 3; s < a1 - 5; s += 8) {
      if (Math.abs(s - 50) < 16 || Math.abs(s + 50) < 16 && ax === 'y') continue;
      if (ax === 'x' && Math.abs(s - 50) < 16) continue;
      const a = ax === 'x' ? g.p(s, c, 0) : g.p(c, s, 0), b = ax === 'x' ? g.p(s + 3.6, c, 0) : g.p(c, s + 3.6, 0);
      dash.push(a[0], a[1], b[0], b[1]);
    }
    g.segs2(dash, LINE, 0.9);
    // zebra bars on the four arms of each crossing
    for (const cy of [-50, 50]) for (const sg of [-1, 1]) for (let k = -RW + 1; k < RW - 0.4; k += 1.9) {
      g.fill(K.rect(Math.min(50 + sg * 10, 50 + sg * 14), cy + k - 0.6, Math.max(50 + sg * 10, 50 + sg * 14), cy + k + 0.6), LINE);
      g.fill(K.rect(50 + k - 0.6, Math.min(cy + sg * 10, cy + sg * 14), 50 + k + 0.6, Math.max(cy + sg * 10, cy + sg * 14)), LINE);
    }
    // zebras where the left-bank boulevards meet the quai and where the right-bank ones leave the bridges
    for (const cy of [-50, 50]) for (const x0 of [RIVER.X0 - 8, RIVER.X1 + 4]) for (let k = -RW + 1; k < RW - 0.4; k += 1.9) g.fill(K.rect(x0, cy + k - 0.6, x0 + 4, cy + k + 0.6), LINE);
    // the near ends of the map: a cut section like every place's outer edge
    const D = 1.1;
    for (const c of [-50, 50]) { g.fill([[E, c - PW, 0], [E, c + PW, 0], [E, c + PW, -D], [E, c - PW, -D]], C.slabD); g.line([[E, c - PW, 0], [E, c - PW, -D], [E, c + PW, -D], [E, c + PW, 0]], { w: 0.8 }); g.line([[E, c - PW, 0], [E, c + PW, 0]], { w: 0.8 }); }
    g.fill([[50 - PW, E, 0], [50 + PW, E, 0], [50 + PW, E, -D], [50 - PW, E, -D]], C.slab); g.line([[50 - PW, E, 0], [50 - PW, E, -D], [50 + PW, E, -D], [50 + PW, E, 0]], { w: 0.8 }); g.line([[50 - PW, E, 0], [50 + PW, E, 0]], { w: 0.8 });
    for (const c of [-50, 50]) g.line([[-E, c - PW, 0], [-E, c + PW, 0]], { w: 0.7 });
    g.line([[50 - PW, -E, 0], [50 + PW, -E, 0]], { w: 0.7 });
    // the outer pavement edges of the runs
    for (const [ax, c, a0, a1] of RUNS) for (const s of [-1, 1]) g.line(ax === 'x' ? [[a0, c + s * PW, 0], [a1, c + s * PW, 0]] : [[c + s * PW, a0, 0], [c + s * PW, a1, 0]], { w: 0.55, c: '#8C8576', boil: false, ext: 0 });
  });

  /* ---- the timetable (phases from tools/search_traffic.mjs) ---- */
  const V = 11, SPAN = 2 * 166, P = SPAN / V;
  const LANES = [[false, -46.5, 1], [false, -53.5, -1], [false, 53.5, 1], [false, 46.5, -1], [true, 46.5, 1], [true, 53.5, -1]];
  const KINDS = [['taxi', 'car', 'velib'], ['bus', 'car', 'scooter'], ['car', 'scooter', 'taxi'], ['car', 'van', 'velib'], ['bus', 'car', 'scooter'], ['taxi', 'car', 'car']];
  const PHASE = [10.0376, 16.0465, 18.533, 7.0393, 27.3597, 13.8183];
  const CARS = ['#C9584B', '#E9E2CC', '#3F5F8F', '#8FA3B5', '#2F343B', '#E6C24F', '#7A8C6E', '#F1EFE8'];
  const draw = (g, ang, kind, col, seed) => {
    if (kind === 'taxi') PA.taxi(g, ang);
    else if (kind === 'bus') PA.bus(g, ang);
    else if (kind === 'van') PA.van(g, ang);
    else if (kind === 'scooter') PA.scooter(g, ang, PA.who(seed, { bare: false }), col);
    else if (kind === 'velib') PA.velib(g, ang, { who: PA.who(seed), seed });
    else PA.car(g, ang, { col });
  };
  LANES.forEach((L, li) => {
    const n = KINDS[li].length;
    for (let k = 0; k < n; k++) {
      const kind = KINDS[li][k], col = CARS[(li * 3 + k * 5) % CARS.length], seed = 7000 + li * 10 + k;
      T.actor({
        cast: false, sample: 0.18, period: P,
        at(t) {
          const s = ((((PHASE[li] * V + k * SPAN / n + L[2] * V * t) % SPAN) + SPAN) % SPAN) - 166, edge = Math.min(1, (PST.end - 3 - Math.abs(s)) / 10);
          if (edge <= 0.02) return null;
          const ang = L[0] ? (L[2] > 0 ? Math.PI / 2 : -Math.PI / 2) : (L[2] > 0 ? 0 : Math.PI);
          const x = L[0] ? L[1] : s, y = L[0] ? s : L[1];
          return { x, y, z: L[0] ? 0 : PST.deck(x), key: 'l' + li, ang, alpha: edge < 1 ? edge : null };
        },
        draw(g, st) { draw(g, st.ang, kind, col, seed); },
      });
    }
  });

  /* ---- people on the pavements ---- */
  const walks = [
    [[[-140, -39.6], [-70, -39.6]], 1.5], [[[-70, -57.6], [-140, -57.6]], 1.4], [[[-30, -39.6], [30, -39.6]], 1.6], [[[140, -57.6], [70, -57.6]], 1.5],
    [[[-30, 59.5], [30, 59.5]], 1.4], [[[-140, 41.8], [-70, 41.8]], 1.5], [[[70, 59.5], [140, 59.5]], 1.6], [[[60.2, -140], [60.2, -70]], 1.5],
    [[[42.4, 70], [42.4, 140]], 1.4], [[[60.2, 20], [60.2, -20]], 1.5],
  ];
  walks.forEach(([pts, v], i) => { PA.walker(T, PA.who(7100 + i), pts, v, { phase: (i * 0.37) % 1, cast: false }); if (i % 3 === 0) PA.walker(T, PA.who(7150 + i), pts, v * 0.92, { phase: (i * 0.37 + 0.5) % 1, cast: false }); });

  /* ---- the Seine, its quais, bridges and boats (src/tiles/seine.js) ---- */
  PA.seine(T);
});
