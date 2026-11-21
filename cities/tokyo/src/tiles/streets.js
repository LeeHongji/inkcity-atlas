'use strict';
/* Tokyo's street grid: four through-streets between the places, running out under the Yamanote viaduct at ±152.
   Left-hand traffic. White dashed centre lines, zebra bars on every arm of the four crossings, utility poles on the far
   kerb of each street with their wires sagging from pole to pole (and across the crossings).
   Traffic is a timetable: each vehicle is periodic; the lane phases were searched offline so that no two vehicles ever
   overlap (axis-aligned boxes with a 1.6 u margin over the whole cycle). Vehicles fade out beyond the viaduct. */
const TST = { in: 37, out: 63, end: 166 };

SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const S = TST, ASPH = '#D8D3C6', LINE = '#F7F5EE';
  T.ground(function (g) {
    const strips = [[[-S.out, -S.end], [-S.in, S.end]], [[S.in, -S.end], [S.out, S.end]], [[-S.end, -S.out], [S.end, -S.in]], [[-S.end, S.in], [S.end, S.out]]];
    for (const [a, b] of strips) g.fill(K.rect(a[0], a[1], b[0], b[1]), ASPH);
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const [cx, cy, dx, dy] of [[S.out * sx, S.in * sy, sx, -sy], [S.in * sx, S.out * sy, -sx, sy], [S.out * sx, S.out * sy, sx, sy]]) {
      const r = 6, pts = [[cx, cy, 0]];
      for (let i = 0; i <= 8; i++) { const a = (Math.PI / 2) * i / 8; pts.push([cx + dx * r * (1 - Math.sin(a)), cy + dy * r * (1 - Math.cos(a)), 0]); }
      g.fill(pts, ASPH);
    }
    for (let i = 0; i < strips.length; i++) {
      const [a, b] = strips[i], alongY = i < 2, d = alongY ? Math.atan2(AY, -AX) : Math.atan2(AY, AX), p = g.P(K.rect(a[0], a[1], b[0], b[1]));
      g.scuff2(p, { dir: d, len: 9, c: '#E5E0D3', dens: 0.45, w: 0.55, spread: 0.05 });
      g.scuff2(p, { dir: d, len: 7, c: '#C9C3B4', dens: 0.12, w: 0.45, spread: 0.04 });
    }
    // white dashed centre lines, broken at the crossings and the zebras
    for (const c of [-50, 50]) for (const alongY of [true, false]) for (let s = -S.end + 3; s < S.end - 5; s += 9) {
      if (Math.abs(Math.abs(s) - 50) < 21) continue;
      const a = alongY ? [c, s, 0] : [s, c, 0], b = alongY ? [c, s + 4.2, 0] : [s + 4.2, c, 0];
      g.line([a, b], { c: LINE, w: 1.0, boil: false, ext: 0.2 });
    }
    // zebra bars on the four arms of each crossing, and the stop lines behind them
    for (const cx of [-50, 50]) for (const cy of [-50, 50]) {
      for (const sgn of [-1, 1]) {
        const segs = [];
        for (let k = -11; k <= 11; k += 2.2) {        // arm along y: bars run along y, repeated across x
          const y0 = cy + sgn * 14.5, y1 = cy + sgn * 19.5;
          g.fill(K.rect(cx + k - 0.7, Math.min(y0, y1), cx + k + 0.7, Math.max(y0, y1)), LINE);
          const x0 = cx + sgn * 14.5, x1 = cx + sgn * 19.5;
          g.fill(K.rect(Math.min(x0, x1), cy + k - 0.7, Math.max(x0, x1), cy + k + 0.7), LINE);
        }
        g.line([[cx - 12.5, cy + sgn * 21, 0], [cx + 12.5, cy + sgn * 21, 0]], { c: LINE, w: 0.9, boil: false });
        g.line([[cx + sgn * 21, cy - 12.5, 0], [cx + sgn * 21, cy + 12.5, 0]], { c: LINE, w: 0.9, boil: false });
        void segs;
      }
    }
    // the stubs beyond the viaduct end in a dry brush stroke
    for (const sgn of [-1, 1]) for (const c of [-50, 50]) {
      for (const alongY of [true, false]) {
        const e = sgn * S.end, R = RNG(Math.round(c * 7 + sgn * 3 + (alongY ? 1 : 2))), pts = [];
        for (let k = 0; k <= 8; k++) { const t = -13 + 26 * k / 8, j = (R() - 0.5) * 3; pts.push(alongY ? [c + t, e + sgn * (1 + j), 0] : [e + sgn * (1 + j), c + t, 0]); }
        g.fill(pts.concat(alongY ? [[c + 13, e - sgn * 0.5, 0], [c - 13, e - sgn * 0.5, 0]] : [[e - sgn * 0.5, c + 13, 0], [e - sgn * 0.5, c - 13, 0]]), ASPH);
      }
    }
  });

  /* ---- utility poles on the far kerb of each street, wires from pole to pole ---- */
  const chains = [
    { alongY: true, c: 61.6 }, { alongY: true, c: -38.4 }, { alongY: false, c: 61.6 }, { alongY: false, c: -38.4 },
  ];
  const STOPS = [-128, -104, -80, -27, -2, 23, 74, 98, 122];
  // each pole carries the wires to the next one, so no long object stands "in front" of a whole tile in the depth sort
  const hangAt = (ch, s, h) => { const x = ch.alongY ? ch.c : s, y = ch.alongY ? s : ch.c; return ch.alongY ? [[x - 1.6, y, h - 0.8], [x + 1.6, y, h - 0.8], [x - 1.1, y, h - 2.3], [x + 1.1, y, h - 2.3]] : [[x, y - 1.6, h - 0.8], [x, y + 1.6, h - 0.8], [x, y - 1.1, h - 2.3], [x, y + 1.1, h - 2.3]]; };
  for (const ch of chains) {
    const hs = STOPS.map((s, i) => 13.5 + ((i * 7) % 3) * 0.4);
    STOPS.forEach((s, i) => {
      const x = ch.alongY ? ch.c : s, y = ch.alongY ? s : ch.c, h = hs[i];
      T.obj([x, y], (g) => {
        TK.upole(g, x, y, { h, across: ch.alongY ? 'x' : 'y', band: i % 3 === 1, can: i % 2 === 0 });
        if (i + 1 < STOPS.length) TK.wires(g, hangAt(ch, s, h), hangAt(ch, STOPS[i + 1], hs[i + 1]), (STOPS[i + 1] - s) > 40 ? 2.6 : 1.5);
      }, { name: 'pole' });
    });
  }

  /* ---- the timetable ---- */
  const END = S.end, SPAN = 2 * END, V = 13, P = SPAN / V;
  const LANES = [[true, 42, 1], [true, 58, -1], [true, -58, 1], [true, -42, -1], [false, 58, 1], [false, 42, -1], [false, -42, 1], [false, -58, -1]];
  const KIND = [['taxi', 'car'], ['kei', 'taxiY'], ['car', 'van'], ['taxi', 'car'], ['van', 'taxi'], ['car', 'kei'], ['taxiG', 'car'], ['car', 'taxi']];
  const PHASE = [20.6402, 11.1821, 0.3856, 19.6398, 1.9216, 15.5861, 7.1265, 0.2975];      // searched offline, see header
  const CARS = ['#F1EFE8', '#C9CCCC', '#2F343B', '#F1EFE8', '#8FA3B5', '#B9A27D', '#E7E2D6', '#6C7A89'];
  const draw = (g, ang, kind, col) => {
    if (kind === 'taxi') TK.taxi(g, ang);
    else if (kind === 'taxiY') TK.taxi(g, ang, { col: '#E6C24F', lamp: '#F3F1EA' });
    else if (kind === 'taxiG') TK.taxi(g, ang, { col: '#6FA36B', lamp: '#F3F1EA' });
    else if (kind === 'kei') TK.kei(g, ang, { cargo: (gg, B) => { const p = B.pt(-1, 0, 2.0); K.rbox(gg, p[0], p[1], 1.6, 1.4, ang, 2.0, 3.2, '#C9A26B', { w: 0.5 }); } });
    else if (kind === 'van') K.bus(g, ang, { L: 6.0, W: 2.5, h: 4.8, n: 3, band: col === '#F1EFE8' ? '#3F7F4F' : '#5E8FC9' });
    else K.car(g, ang, { col });
  };
  LANES.forEach((L, li) => {
    for (let k = 0; k < 2; k++) {
      const kind = KIND[li][k], col = CARS[(li * 3 + k * 5) % CARS.length];
      T.actor({
        cast: false, sample: 0.18, period: P,
        at(t) {
          // Japan drives on the left: the searched timetable runs backwards in time (t -> -t), so every lane's cars
          // drive the other way along the same lane. The same configurations occur, so it stays collision-free.
          const s = ((((PHASE[li] * V + k * SPAN / 2 - L[2] * V * t) % SPAN) + SPAN) % SPAN) - END, edge = Math.min(1, (END - 2 - Math.abs(s)) / 10);
          if (edge <= 0.02) return null;
          const ang = L[0] ? (L[2] < 0 ? Math.PI / 2 : -Math.PI / 2) : (L[2] < 0 ? 0 : Math.PI);
          return { x: L[0] ? L[1] : s, y: L[0] ? s : L[1], key: 'l' + li, ang, alpha: edge < 1 ? edge : null };
        },
        draw(g, st) { draw(g, st.ang, kind, col); },
      });
    }
  });
});
