'use strict';
/* The street grid: four through-streets (a big X on screen), the rail loop round Civic Center, and the traffic.
   Traffic is a timetable, not a simulation: every vehicle is periodic, and the phases below were searched offline
   so that no two vehicles ever overlap at a crossing (oriented-box test with a 1.5 u margin, over the full cycle). */
const ST = { in: 37, out: 63, end: 152, laneIn: 42, laneOut: 58, dash: 50, rail: 50, rc: 12 };

SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const S = ST;
  T.ground(function (g) {
    const strips = [
      [[-S.out, -S.end], [-S.in, S.end]], [[S.in, -S.end], [S.out, S.end]],
      [[-S.end, -S.out], [S.end, -S.in]], [[-S.end, S.in], [S.end, S.out]],
    ];
    for (const [a, b] of strips) g.fill(K.rect(a[0], a[1], b[0], b[1]), C.street);
    // the plots meet the crossings with rounded corners (hidden once a neighbourhood's slab is drawn over them)
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const [cx, cy, dx, dy] of [[S.out * sx, S.in * sy, sx, -sy], [S.in * sx, S.out * sy, -sx, sy], [S.out * sx, S.out * sy, sx, sy]]) {
      const r = 8, pts = [[cx, cy, 0]];
      for (let i = 0; i <= 8; i++) { const a = (Math.PI / 2) * i / 8; pts.push([cx + dx * r * (1 - Math.sin(a)), cy + dy * r * (1 - Math.cos(a)), 0]); }
      g.fill(pts, C.street);
    }
    // faint dry streaks along each street, a few pale skips
    for (let i = 0; i < strips.length; i++) {
      const [a, b] = strips[i], alongY = i < 2, d = alongY ? Math.atan2(AY, -AX) : Math.atan2(AY, AX);
      const p = g.P(K.rect(a[0], a[1], b[0], b[1]));
      g.scuff2(p, { dir: d, len: 9, c: '#E7E2D6', dens: 0.5, w: 0.55, spread: 0.05 });
      g.scuff2(p, { dir: d, len: 7, c: '#CFC8B9', dens: 0.14, w: 0.45, spread: 0.04 });
      g.scuff2(p, { dir: -0.9, len: 1.8, c: '#F4F1E8', dens: 0.12, w: 0.75, spread: 1.2 });
    }
    // yellow dashed centre lines, broken at the crossings
    for (const sgn of [-1, 1]) for (const alongY of [true, false]) {
      const c = sgn * S.dash;
      for (let s = -S.end + 5; s < S.end - 6; s += 10.5) {
        if (s > -66 && s < 61.5) continue;                      // inside the ring the rails take the centre
        const a = alongY ? [c, s, 0] : [s, c, 0], b = alongY ? [c, s + 4.6, 0] : [s + 4.6, c, 0];
        g.line([a, b], { c: C.dash, w: 1.15, boil: false, ext: 0.3 });
      }
    }
    // the rail loop: two dark rails, generous corners
    for (const off of [-1.15, 1.15]) {
      const r = S.rail + off, rc = S.rc + off, pts = [];
      const corner = (cx, cy, a0) => { for (let i = 0; i <= 10; i++) { const a = a0 + (Math.PI / 2) * i / 10; pts.push([cx + Math.cos(a) * rc, cy + Math.sin(a) * rc, 0]); } };
      corner(r - rc, r - rc, 0); corner(-(r - rc), r - rc, Math.PI / 2); corner(-(r - rc), -(r - rc), Math.PI); corner(r - rc, -(r - rc), Math.PI * 1.5);
      g.line(pts, { c: '#5F584C', w: 0.62, close: true, boil: false, wob: 0.5 });
    }
  });

  /* ----- the timetable ----- */
  const END = 160, SPAN = 2 * END, V = 13, P = SPAN / V;                 // a through car repeats every P seconds
  const R0 = S.rail, RC = S.rc, side = 2 * (R0 - RC), quarter = Math.PI / 2 * RC, PER = 4 * (side + quarter), VR = PER / (2 * P);
  // lanes: [along y?, fixed coordinate, direction]. The ring runs counter-clockwise; inner lanes run against it.
  const LANES = [[true, S.laneIn, -1], [true, -S.laneIn, 1], [true, S.laneOut, 1], [true, -S.laneOut, -1],
                 [false, S.laneIn, 1], [false, -S.laneIn, -1], [false, S.laneOut, -1], [false, -S.laneOut, 1]];
  const PHASE = [12.3077, 14.1088, 19.8124, 10.8068, 14.409, 12.3077, 15.9099, 12.9081];      // searched offline, see header
  const PASTEL = ['#8FB7D9', '#A9C9A4', '#E7C65A', '#D9838F', '#F1EFE8', '#C9B7E0', '#E3A06A', '#7FB3A6'];
  const taxiRoof = (g, cab) => K.rbox(g, cab.cx, cab.cy, 1.1, 0.6, Math.atan2(cab.sa, cab.ca), 4.8, 5.5, '#F3F1EA', { w: 0.5, nb: true });
  const copRoof = (g, cab) => K.rbox(g, cab.cx, cab.cy, 0.6, 1.3, Math.atan2(cab.sa, cab.ca), 4.8, 5.5, '#5E8FC9', { w: 0.5, nb: true });
  const drawVehicle = (g, ang, kind, col) => {
    if (kind === 'cable') K.cablecar(g, ang, { riders });
    else if (kind === 'bus') K.bus(g, ang, { band: col });
    else if (kind === 'taxi') K.car(g, ang, { col: '#E7C65A', roof: taxiRoof });
    else if (kind === 'cop') K.car(g, ang, { col: '#F1EFE8', roof: copRoof });
    else K.car(g, ang, { col });
  };
  const riders = (g, B) => {
    const p1 = B.pt(B.hl - 1.4, 0.4, 3.1), p2 = B.pt(-B.hl + 1.4, -0.3, 3.1);
    K.person(g, p1[0], p1[1], p1[2], K.who(71, { dir: 1, k: 0.8 })); K.person(g, p2[0], p2[1], p2[2], K.who(72, { dir: 0, k: 0.8 }));
  };
  LANES.forEach((L, li) => {
    for (let k = 0; k < 2; k++) {
      const kind = ((li === 1 || li === 6) && k === 0) ? 'taxi' : (li === 3 && k === 1) ? 'cop' : 'car', col = PASTEL[(li * 3 + k * 5 + 1) % PASTEL.length];
      T.actor({
        cast: false, sample: 0.18, period: P,
        at(t) {
          const s = ((((PHASE[li] * V + k * SPAN / 2 + L[2] * V * t) % SPAN) + SPAN) % SPAN) - END, edge = Math.min(1, (END - Math.abs(s)) / 8);
          if (edge <= 0.02) return null;
          const ang = L[0] ? (L[2] > 0 ? Math.PI / 2 : -Math.PI / 2) : (L[2] > 0 ? 0 : Math.PI);
          return { x: L[0] ? L[1] : s, y: L[0] ? s : L[1], key: 'l' + li, ang, alpha: edge < 1 ? edge : null };
        },
        draw(g, st) { drawVehicle(g, st.ang, kind, col); },
      });
    }
  });
  const loopAt = (d) => {
    d = ((d % PER) + PER) % PER;
    const cs = [[R0 - RC, R0 - RC, 0], [-(R0 - RC), R0 - RC, Math.PI / 2], [-(R0 - RC), -(R0 - RC), Math.PI], [R0 - RC, -(R0 - RC), Math.PI * 1.5]];
    for (let i = 0; i < 4; i++) {
      const [cx, cy, a0] = cs[i], sx = cx + Math.cos(a0) * RC, sy = cy + Math.sin(a0) * RC, tx = -Math.sin(a0), ty = Math.cos(a0);
      if (d < side) { const u = d - side; return { x: sx + tx * u, y: sy + ty * u, ang: Math.atan2(ty, tx) }; }
      d -= side;
      if (d < quarter) { const a = a0 + d / RC; return { x: cx + Math.cos(a) * RC, y: cy + Math.sin(a) * RC, ang: a + Math.PI / 2 }; }
      d -= quarter;
    }
    return { x: R0, y: 0, ang: Math.PI / 2 };
  };
  const RING = [['cable'], ['bus', '#E08A4A'], ['cable'], ['bus', '#5E8FC9']];
  RING.forEach((r, k) => T.actor({
    cast: false, sample: 0.2, period: 2 * P,
    at(t) { const p = loopAt(k * PER / 4 + VR * t), q = Math.round(p.ang / (TAU / 64)); p.key = 'r' + q; p.ang = q * (TAU / 64); return p; },
    draw(g, st) { drawVehicle(g, st.ang, r[0], r[1]); },
  }));
  SF.loopAt = loopAt;
  // two cyclists keep to the kerb round Civic Center; they never cross a traffic lane
  const kerbAt = (d) => { const r = 38.5, rc = 3, sd = 2 * (r - rc), q = Math.PI / 2 * rc, per = 4 * (sd + q); d = ((d % per) + per) % per;
    const cs = [[r - rc, r - rc, 0], [-(r - rc), r - rc, Math.PI / 2], [-(r - rc), -(r - rc), Math.PI], [r - rc, -(r - rc), Math.PI * 1.5]];
    for (let i = 0; i < 4; i++) { const [cx, cy, a0] = cs[i], sx = cx + Math.cos(a0) * rc, sy = cy + Math.sin(a0) * rc, tx = -Math.sin(a0), ty = Math.cos(a0);
      if (d < sd) { const u = d - sd; return { x: sx + tx * u, y: sy + ty * u, ang: Math.atan2(ty, tx) }; } d -= sd;
      if (d < q) { const a = a0 + d / rc; return { x: cx + Math.cos(a) * rc, y: cy + Math.sin(a) * rc, ang: a + Math.PI / 2 }; } d -= q; }
    return { x: r, y: 0, ang: Math.PI / 2 }; };
  [[40, '#C9584B', 81], [190, '#5F8FC9', 82]].forEach(([d0, col, seed]) => T.actor({ cast: false, sample: 0.25, period: 302 / 6 + 1,
    at(t) { const p = kerbAt(d0 + 6 * t), q = Math.round(p.ang / (TAU / 16)); p.key = 'b' + q; p.ang = q * (TAU / 16); return p; },
    draw(g, st) { K.bike(g, st.ang, { col, seed }); } }));
});
