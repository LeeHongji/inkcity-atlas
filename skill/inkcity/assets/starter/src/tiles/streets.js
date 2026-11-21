'use strict';
/* The street between the two places, and its traffic. Traffic is a timetable, not a simulation: each car is a
   periodic function of time, so any frame can be drawn on its own (the film must be seekable). */
SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const X = 13, Y = 37, LIP = 1.1;
  T.ground(function (g) {
    g.fill(K.rect(-X, -Y, X, Y), C.street);
    g.fill([[-X, Y, -LIP], [X, Y, -LIP], [X, Y, 0], [-X, Y, 0]], C.slab);          // the cut edge, like the slabs beside it
    g.line([[-X, Y, 0], [-X, Y, -LIP], [X, Y, -LIP], [X, Y, 0]], { w: 0.9 }); g.line([[-X, Y, 0], [X, Y, 0]], { w: 0.9 });
    g.line([[-X, -Y, 0], [X, -Y, 0]], { w: 0.9 });
    const p = g.P(K.rect(-X, -Y, X, Y));
    g.scuff2(p, { dir: Math.atan2(AY, -AX), len: 8, c: '#E7E2D6', dens: 0.5, w: 0.55, spread: 0.05 });
    for (let y = -Y + 3; y < Y - 4; y += 9) g.line([[0, y, 0], [0, y + 4.2, 0]], { c: C.dash, w: 1.1, boil: false, ext: 0.3 });
    // a zebra crossing joining the plaza path to the park gate
    for (let i = 0; i < 6; i++) { const x = -10 + i * 3.6; g.fill(K.rect(x, 2, x + 1.8, 8), C.streetMark); }
  });
  const V = 9, L = 2 * Y + 16, P = L / V;                     // speed u/s, lane length, period s
  [[-5.5, 1, '#8FB7D9', 0], [5.5, -1, '#E7C65A', 0.45]].forEach(([x, dirn, col, ph]) => T.actor({
    cast: false, sample: 0.2, period: P,
    at(t) {
      const s = ((((ph + t / P) % 1) + 1) % 1) * L - L / 2, y = dirn * s, edge = Math.min(1, (L / 2 - Math.abs(s)) / 6);
      if (edge <= 0.02) return null;
      return { x, y, key: 'c' + dirn, alpha: edge < 1 ? edge : null, ang: dirn > 0 ? Math.PI / 2 : -Math.PI / 2 };
    },
    draw(g, st) { K.car(g, st.ang, { col }); },
  }));
});
