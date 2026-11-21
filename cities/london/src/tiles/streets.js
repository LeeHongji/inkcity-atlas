'use strict';
/* London's streets: two north-south streets (x = -50 over Westminster Bridge, x = +50 over Tower Bridge) and one
   east-west street (y = -50) between the far row and the river row; the river takes the band y 30..70.
   Wet asphalt after the rain (pale streaks, puddles at the kerbs), white dashed centre lines, double yellow lines along
   the kerbs, red bus lanes on the near side, a yellow box junction at Tower Hill, a zebra with Belisha beacons.
   Left-hand traffic: a timetable (src/37_timetable.js). The free lanes loop every 25 s; the Tower Bridge lanes queue at
   their stop lines while the bridge is up. Phases were searched offline (tools/check.js) so no two vehicles overlap.
   Vehicles fade out at the cut ends of the streets. */
SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const E = LT.END, A = LK.C.asph, LINE = '#F4F2EC', YEL = '#E3B93B', BUS = '#C9776A';
  const RN = LT.RIV.N, RS = LT.RIV.S;
  // street bands as rectangles [x0, y0, x1, y1]; the river band is left out of the north-south streets
  const bands = [[-63, -E, -37, RN], [-63, RS, -37, E], [37, -E, 63, RN], [37, RS, 63, E], [-E, -63, E, -37]];
  T.ground(function (g) {
    for (const b of bands) g.fill(K.rect(b[0], b[1], b[2], b[3]), A);
    // rounded kerb corners at the two crossings
    for (const cx of [-50, 50]) for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const kx = cx + sx * 13, ky = -50 + sy * 13, r = 5, pts = [[kx, ky, 0]];
      for (let i = 0; i <= 8; i++) { const a = (Math.PI / 2) * i / 8; pts.push([kx + sx * r * (1 - Math.sin(a)), ky + sy * r * (1 - Math.cos(a)), 0]); }
      g.fill(pts, A);
    }
    // the cut ends at the map's near edges (y = E on the north-south streets, x = E on the east-west one)
    for (const cx of [-50, 50]) { g.fill([[cx - 13, E, -1.1], [cx + 13, E, -1.1], [cx + 13, E, 0], [cx - 13, E, 0]], C.slab); g.line([[cx - 13, E, 0], [cx - 13, E, -1.1], [cx + 13, E, -1.1], [cx + 13, E, 0]], { w: 0.85, boil: false }); }
    g.fill([[E, -63, -1.1], [E, -37, -1.1], [E, -37, 0], [E, -63, 0]], C.slabD); g.line([[E, -63, 0], [E, -63, -1.1], [E, -37, -1.1], [E, -37, 0]], { w: 0.85, boil: false });
    // wet sheen along the roads
    for (const b of bands) { const alongY = b[3] - b[1] > b[2] - b[0]; LK.sheen(g, K.rect(b[0], b[1], b[2], b[3]), alongY ? Math.atan2(AY, -AX) : Math.atan2(AY, AX)); }
    // red bus lanes on the near-side kerb of some stretches
    const busLanes = [[-41.2, -E + 4, -37, -70], [37, RS + 6, 41.2, E - 3], [58.8, -E + 4, 63, -70], [-63, RS + 6, -58.8, E - 3], [-E + 4, -63, -70, -58.8], [70, -41.2, E - 4, -37]];
    for (const b of busLanes) { g.fill(K.rect(b[0], b[1], b[2], b[3]), BUS); const alongY = b[3] - b[1] > b[2] - b[0], cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2; LK.groundText(g, cx + (alongY ? -0.8 : 0), cy + (alongY ? 0 : 0.8), 1.4, 'BUS LANE', '#F4F2EC', { alongY, w: 0.55 }); }
    for (const zx of [-100, 0]) for (const [y, sgn] of [[-61.4, 1], [-38.6, -1]]) LK.groundText(g, zx + 6.4 * sgn, y, 0.9, 'LOOK RIGHT', '#F4F2EC', { w: 0.45 });
    // kerb lines
    const kerb = { w: 0.55, c: '#9E9A90', boil: false };
    for (const x of [-63, -37, 37, 63]) { g.line([[x, -E, 0], [x, -63 - (x === -63 || x === 37 ? 0 : 0), 0]], kerb); g.line([[x, -37, 0], [x, RN, 0]], kerb); g.line([[x, RS, 0], [x, E, 0]], kerb); }
    for (const y of [-63, -37]) { g.line([[-E, y, 0], [-63, y, 0]], kerb); g.line([[-37, y, 0], [37, y, 0]], kerb); g.line([[63, y, 0], [E, y, 0]], kerb); }
    // white dashed centre lines, broken at the crossings and bridges
    const dash = (a, b) => g.line([a, b], { c: LINE, w: 0.95, boil: false, ext: 0.2 });
    for (const cx of [-50, 50]) for (let s = -E + 3; s < E - 5; s += 9) { if (Math.abs(s + 50) < 16 || (s > RN - 6 && s < RS + 2)) continue; dash([cx, s, 0], [cx, s + 4.2, 0]); }
    for (let s = -E + 3; s < E - 5; s += 9) { if (Math.abs(Math.abs(s) - 50) < 16) continue; dash([s, -50, 0], [s + 4.2, -50, 0]); }
    // double yellow lines along the kerbs
    const yl = (pts) => g.line(pts, { c: YEL, w: 0.45, boil: false, ext: 0 });
    for (const cx of [-50, 50]) for (const sx of [-1, 1]) for (const off of [0.9, 1.5]) { const x = cx + sx * (13 - off); yl([[x, -E + 2, 0], [x, -66, 0]]); yl([[x, -34, 0], [x, RN - 1, 0]]); yl([[x, RS + 1, 0], [x, E - 2, 0]]); }
    for (const sy of [-1, 1]) for (const off of [0.9, 1.5]) { const y = -50 + sy * (13 - off); yl([[-E + 2, y, 0], [-66, y, 0]]); yl([[-34, y, 0], [34, y, 0]]); yl([[66, y, 0], [E - 2, y, 0]]); }
    // the yellow box junction at Tower Hill (50, -50)
    { const x0 = 38.5, x1 = 61.5, y0 = -61.5, y1 = -38.5, segs = [];
      g.outline(K.rect(x0, y0, x1, y1), { c: YEL, w: 0.6, boil: false });
      for (let k = -20; k <= 20; k += 3.2) { for (const sgn of [1, -1]) { const pts = []; for (let t = -12; t <= 12; t += 0.5) { const x = 50 + t, y = -50 + sgn * (t - k); if (x >= x0 && x <= x1 && y >= y0 && y <= y1) pts.push([x, y, 0]); } if (pts.length > 1) { const a = g.p.apply(g, pts[0]), b = g.p.apply(g, pts[pts.length - 1]); segs.push(a[0], a[1], b[0], b[1]); } } }
      g.segs2(segs, YEL, 0.45); }
    // stop lines before the crossings
    for (const cx of [-50, 50]) { g.line([[cx, -64.5, 0], [cx + 13, -64.5, 0]], { c: LINE, w: 1.0, boil: false }); g.line([[cx - 13, -35.5, 0], [cx, -35.5, 0]], { c: LINE, w: 1.0, boil: false }); g.line([[cx - 14.5, -63, 0], [cx - 14.5, -50, 0]], { c: LINE, w: 1.0, boil: false }); g.line([[cx + 14.5, -50, 0], [cx + 14.5, -37, 0]], { c: LINE, w: 1.0, boil: false }); }
    // Tower Bridge stop lines (the barriers are actors)
    g.line([[50, 27, 0], [63, 27, 0]], { c: LINE, w: 1.1, boil: false }); g.line([[37, 73, 0], [50, 73, 0]], { c: LINE, w: 1.1, boil: false });
    // a zebra crossing on the east-west street between the palace and Westminster (x = -100), another by the Tower (x = 0)
    for (const zx of [-100, 0]) { for (let k = -12; k < 12; k += 2.2) g.fill(K.rect(zx - 2.4, -50 + k, zx + 2.4, -50 + k + 1.2), LINE); const zig = []; for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) { const x0 = zx + sx * (4 + k * 2.4), a = g.p(x0, -62, 0), b = g.p(x0 + sx * 1.2, -61, 0); zig.push(a[0], a[1], b[0], b[1]); } g.segs2(zig, LINE, 0.4); }
    // puddles at the kerbs
    const pud = [[-61, -120, 3.5, 1.6], [-39, -88, 2.4, 1.4], [61, -100, 3.0, 1.5], [39, 110, 3.2, 1.6], [-61, 130, 2.6, 1.4], [-100, -61, 1.6, 3.0], [20, -39, 1.6, 2.6], [120, -61, 1.4, 2.8], [-60.5, 100, 2.0, 1.3], [-39, -145, 2.4, 1.2], [110, -38.5, 1.4, 2.2]];
    pud.forEach(([x, y, rx, ry], i) => LK.puddle(g, x, y, rx, ry, 300 + i));
  });
  // the map edge line along the far ends
  T.ground(function (g) { for (const cx of [-50, 50]) g.line([[cx - 13, -E, 0], [cx + 13, -E, 0]], { w: 0.85, boil: false }); g.line([[-E, -63, 0], [-E, -37, 0]], { w: 0.85, boil: false }); });

  /* ---- Belisha beacons by the zebras, lamps on the kerbs ---- */
  for (const zx of [-100, 0]) for (const [dx, y] of [[-3.4, -64.2], [3.4, -35.8]]) T.obj([zx + dx, y], (g) => {
    const x = zx + dx, b = g.p(x, y, 0), t = g.p(x, y, 8.2), seg = [];
    for (let i = 0; i < 8; i++) { const a = [lerp(b[0], t[0], i / 8), lerp(b[1], t[1], i / 8)], c = [lerp(b[0], t[0], (i + 1) / 8), lerp(b[1], t[1], (i + 1) / 8)]; g.line2([a, c], { w: 0.9, c: i % 2 ? '#F3F1EA' : '#2A2622', boil: false, ext: 0 }); }
    g.disc2([t[0], t[1] - 1.4], 1.5, '#F0A23A'); g.ring2([t[0], t[1] - 1.4], 1.5, { w: 0.4, c: '#8A5A1E' }); void seg;
  }, { name: 'beacon' });
  const lamps = [[-64.5, -140], [-64.5, -100], [-35.5, -120], [-35.5, -80], [35.5, -140], [35.5, -100], [64.5, -120], [64.5, -80], [-120, -64.5], [-80, -64.5], [-20, -64.5], [20, -35.5], [80, -64.5], [120, -35.5], [-35.5, 90], [-35.5, 130], [64.5, 100], [64.5, 140], [35.5, 120], [-64.5, 115]];
  for (const [x, y] of lamps) T.obj([x, y], (g) => LK.lamp(g, x, y), { name: 'lamp' });

  /* ---- the timetable ---- */
  const CARS = ['#8FA3B5', '#F1EFE8', '#2F343B', '#B9A27D', '#6C7A89', '#C9584B', '#E7E2D6'];
  const angOf = (ln) => ln.ax === 'y' ? (ln.d > 0 ? Math.PI / 2 : -Math.PI / 2) : (ln.d > 0 ? 0 : Math.PI);
  const place = (ln, s, hl) => {
    const along = ln.d * (s - hl), edge = Math.min(1, (E - 3 - Math.abs(along)) / 10);
    if (edge <= 0.02) return null;
    return { x: ln.ax === 'y' ? ln.c : along, y: ln.ax === 'y' ? along : ln.c, key: 'v', alpha: edge < 1 ? edge : null };
  };
  LT.ROAD.free.forEach((ln, li) => ln.cars.forEach((c, k) => {
    const hl = LT.HL[c.kind], ang = angOf(ln), col = CARS[(li * 3 + k * 2) % CARS.length];
    T.actor({ cast: false, sample: 0.18, period: 25,
      at(t) { return place(ln, LT.freeS(c.s0, LT.tc(t)), hl); },
      draw(g) { LK.vehicle(g, ang, c.kind, col, ln.ax === 'y' ? '12' : '11'); } });
  }));
  // the Tower Bridge lanes narrow onto the bridge (LT.bOff): x follows y, the heading follows the slope
  LT.ROAD.bridge.forEach((ln, li) => ln.entries.forEach((e, k) => {
    const col = CARS[(li * 5 + k) % CARS.length], sg = ln.c > 50 ? 1 : -1, NQ = 64;
    T.actor({ cast: false, sample: 0.18, period: LT.CYC,
      at(t) {
        const f = LT.qlaneOf(li).front(k, LT.tc(t)); if (!f) return null;
        const st = place(ln, f.s, f.hl); if (!st) return null;
        const y = st.y, slope = sg * (LT.bOff(y + 0.4) - LT.bOff(y - 0.4)) / 0.8, ang = Math.atan2(ln.d, slope * ln.d), q = Math.round(ang / (TAU / NQ));
        st.x = 50 + sg * LT.bOff(y); st.key = 'q' + q; st.ang = q * TAU / NQ;
        return st;
      },
      draw(g, st) { LK.vehicle(g, st.ang, e.kind, col, '42'); } });
  }));

  THAMES(T);
});
