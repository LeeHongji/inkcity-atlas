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
  // Each pole is its own object, and so is each span of wires between two poles: a thin box along the kerb line under the
  // span that never decides where anyone is drawn (noHide: a pole that drew its wires spread its screen box over the
  // whole run, and counted as in front of people in the places round it). A pole's box is a thin strip along the kerb
  // line that runs on 6.4 u past the pole: a car (half-length up to 6 u) that has passed the pole is still beside it
  // until its tail is clear, so the pole stays in front of the car till then (as a point, it went behind the car once the
  // car's middle was 2 u past it). Anyone whose drawing overlaps the pole and stands beyond the kerb line is nearer than
  // the pole, and the box is never in front of them; anyone overlapping it short of the line is behind it.
  const hangAt = (ch, s, h) => { const x = ch.alongY ? ch.c : s, y = ch.alongY ? s : ch.c; return ch.alongY ? [[x - 1.6, y, h - 0.8], [x + 1.6, y, h - 0.8], [x - 1.1, y, h - 2.3], [x + 1.1, y, h - 2.3]] : [[x, y - 1.6, h - 0.8], [x, y + 1.6, h - 0.8], [x, y - 1.1, h - 2.3], [x, y + 1.1, h - 2.3]]; };
  const along = (ch, s0, s1) => ch.alongY ? [ch.c - 0.3, s0, ch.c + 0.3, s1] : [s0, ch.c - 0.3, s1, ch.c + 0.3];
  for (const ch of chains) {
    const hs = STOPS.map((s, i) => 13.5 + ((i * 7) % 3) * 0.4);
    STOPS.forEach((s, i) => {
      const x = ch.alongY ? ch.c : s, y = ch.alongY ? s : ch.c, h = hs[i];
      T.obj(along(ch, s - 0.3, s + 6.4), (g) => TK.upole(g, x, y, { h, across: ch.alongY ? 'x' : 'y', band: i % 3 === 1, can: i % 2 === 0 }), { name: 'pole' });
      if (i + 1 < STOPS.length) T.obj(along(ch, s, STOPS[i + 1]), (g) => TK.wires(g, hangAt(ch, s, h), hangAt(ch, STOPS[i + 1], hs[i + 1]), (STOPS[i + 1] - s) > 40 ? 2.6 : 1.5), { name: 'wires', noHide: true });
    });
  }

  /* ---- the timetable ---- */
  const END = S.end, SPAN = 2 * END, V = 13, P = SPAN / V;
  const LANES = [[true, 42, 1], [true, 58, -1], [true, -58, 1], [true, -42, -1], [false, 58, 1], [false, 42, -1], [false, -42, 1], [false, -58, -1]];
  const KIND = [['taxi', 'car'], ['kei', 'taxiY'], ['car', 'van'], ['taxi', 'car'], ['van', 'taxi'], ['car', 'kei'], ['taxiG', 'car'], ['car', 'taxi']];
  const PHASE = [20.6402, 11.1821, 0.3856, 19.6398, 1.9216, 15.5861, 7.1265, 0.2975];      // searched offline, see header
  const CARS = ['#F1EFE8', '#C9CCCC', '#2F343B', '#F1EFE8', '#5F8FC9', '#C9584B', '#E7E2D6', '#7FB7A0'];   // mostly white, silver and black, as in Tokyo, with a few bright ones
  const draw = (g, ang, kind, col) => {
    if (kind === 'taxi') TK.taxi(g, ang);
    else if (kind === 'taxiY') TK.taxi(g, ang, { col: '#E6C24F', lamp: '#F3F1EA' });
    else if (kind === 'taxiG') TK.taxi(g, ang, { col: '#6FA36B', lamp: '#F3F1EA' });
    else if (kind === 'imo') TK.kei(g, ang, { cargo: (gg, B) => TK.imo(gg, B, ang) });   // autumn: the yakiimo truck
    else if (kind === 'kei') TK.kei(g, ang, { cargo: (gg, B) => { const p = B.pt(-1, 0, 2.0); K.rbox(gg, p[0], p[1], 1.6, 1.4, ang, 2.0, 3.2, '#C9A26B', { w: 0.5 }); } });
    else if (kind === 'van') K.bus(g, ang, { L: 6.0, W: 2.5, h: 4.8, n: 3, band: col === '#F1EFE8' ? '#3F7F4F' : '#5E8FC9' });
    else K.car(g, ang, { col });
  };
  // each kind's half-length and half-width on the ground (u), as drawn: people beside a car are ordered by these
  const HALF = { taxi: [5.0, 2.45], taxiY: [5.0, 2.45], taxiG: [5.0, 2.45], kei: [4.4, 2.1], imo: [4.4, 2.1], van: [6.0, 2.5], car: [5.3, 2.55] };
  LANES.forEach((L, li) => {
    for (let k = 0; k < 2; k++) {
      const kind = (TK.autumn() || TK.winter()) && li === 1 && k === 0 ? 'imo' : KIND[li][k], col = CARS[(li * 3 + k * 5) % CARS.length];
      const hl = HALF[kind], ext = L[0] ? [hl[1], hl[0]] : [hl[0], hl[1]];
      T.actor({
        cast: false, sample: 0.18, period: P,
        at(t) {
          // Japan drives on the left: the searched timetable runs backwards in time (t -> -t), so every lane's cars
          // drive the other way along the same lane. The same configurations occur, so it stays collision-free.
          const s = ((((PHASE[li] * V + k * SPAN / 2 - L[2] * V * t) % SPAN) + SPAN) % SPAN) - END, edge = Math.min(1, (END - 2 - Math.abs(s)) / 10);
          if (edge <= 0.02) return null;
          const ang = L[0] ? (L[2] < 0 ? Math.PI / 2 : -Math.PI / 2) : (L[2] < 0 ? 0 : Math.PI);
          return { x: L[0] ? L[1] : s, y: L[0] ? s : L[1], key: 'l' + li, ang, alpha: edge < 1 ? edge : null, ext };
        },
        draw(g, st) { draw(g, st.ang, kind, col); },
      });
    }
  });
});
