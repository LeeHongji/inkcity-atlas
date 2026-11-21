'use strict';
/* Rio's traffic plan: two-way streets, right-hand traffic, as a timetable. Streets along y stand at x = -150, -50, 50
   and 150 (Avenida Atlântica, by the beach); streets along x at y = -150 (the bay road), -50, 50, 150. Streets along y
   start at the bay road (y = -150) and run out past the near edge; streets along x start past the far edge and end at
   Avenida Atlântica (x = 150). Each street has one lane per direction, 3.5 u to the right of the centre line. Every
   vehicle loops its lane with the common period P; the lane phases were searched offline (tools/search_traffic.mjs)
   so that no two vehicles ever overlap where streets cross. No engine globals, so the search can load this file. */
const RJT = (function () {
  const P = 36;
  const XS = [-150, -50, 50, 150], YS = [-150, -50, 50, 150];
  const SPAN = { y: [-150, 178], x: [-178, 150] };
  const SIZE = { car: [4.3, 2.1], taxi: [4.4, 2.15], kombi: [3.9, 1.95], bus: [6.6, 2.45], moto: [2.6, 0.8], bike: [2.0, 0.7] };
  const MIX = [
    ['taxi', 'car', 'moto'], ['bus', 'taxi'], ['car', 'kombi', 'taxi'], ['taxi', 'moto', 'car'],
    ['taxi', 'bus', 'car'], ['car', 'taxi', 'moto'], ['kombi', 'taxi'], ['taxi', 'car', 'bike'],
    ['bus', 'car', 'taxi'], ['taxi', 'kombi'], ['car', 'taxi', 'moto'], ['moto', 'taxi', 'car'],
    ['taxi', 'car'], ['bus', 'moto', 'taxi'], ['car', 'taxi', 'kombi'], ['taxi', 'bike', 'car'],
  ];
  const lanes = [];
  const streets = XS.map((c) => ({ ax: 'y', c })).concat(YS.map((c) => ({ ax: 'x', c })));
  streets.forEach((S) => {
    for (const d of [1, -1]) {
      const right = S.ax === 'x' ? d : -d, span = SPAN[S.ax], L = span[1] - span[0];
      lanes.push({ ax: S.ax, d, c: S.c + right * 3.5, sc: S.c, kinds: MIX[lanes.length % MIX.length], a0: span[0], a1: span[1], L, V: L / P });
    }
  });
  /* the phases, one per lane, in [0, 1): from tools/search_traffic.mjs */
  const PHASE = [0.714, 0.657, 0.03, 0.265, 0.403, 0.263, 0.124, 0.686, 0.501, 0.268, 0.52, 0.957, 0.716, 0.243, 0.429, 0.011];
  function pos(li, k, t, phase) {
    const Ln = lanes[li], n = Ln.kinds.length, ph = phase ? phase[li] : PHASE[li];
    const u = ((((ph + k / n) * Ln.L + Ln.V * t) % Ln.L) + Ln.L) % Ln.L;
    const s = Ln.d > 0 ? Ln.a0 + u : Ln.a1 - u;
    const kind = Ln.kinds[k], sz = SIZE[kind];
    const ang = Ln.ax === 'x' ? (Ln.d > 0 ? 0 : Math.PI) : (Ln.d > 0 ? Math.PI / 2 : -Math.PI / 2);
    return { x: Ln.ax === 'x' ? s : Ln.c, y: Ln.ax === 'x' ? Ln.c : s, s, ang, kind, hl: sz[0], hw: sz[1] };
  }
  /* fade at the ends: in/out over 9 u at the junction end, past the map edge at the open end */
  function alpha(li, s) {
    const Ln = lanes[li];
    if (Ln.ax === 'y') return Math.max(0, Math.min(1, (s + 150) / 9, (170 - s) / 8));
    return Math.max(0, Math.min(1, (s + 170) / 8, (150 - s) / 9));
  }
  return { P, lanes, pos, alpha, PHASE, SIZE };
})();
if (typeof module !== 'undefined') module.exports = RJT;
