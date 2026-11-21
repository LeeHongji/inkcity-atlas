'use strict';
/* The Eixample traffic plan: one-way streets that alternate direction, right-hand traffic, as a timetable.
   Streets along y stand at x = -150, -50, 50; streets along x at y = -150, -50, 50, 150 (they end at the seafront
   promenade, x = 137). Each street has three lanes across its 14 u roadway, measured to the right of the heading:
   the cycle lane on the left (r = -5.6: Bicing riders, scooters), the general lane (r = -1.6: cars, taxis, vans) and
   the bus-and-taxi lane on the right (r = +3.5). Every vehicle loops its lane with the common period P, so the whole
   street picture repeats every P seconds; the lane phases were searched offline (tools/search_traffic.mjs) so that
   no two vehicles ever overlap where streets cross. No engine globals are used, so the search can load this file. */
const BCT = (function () {
  const P = 30;
  const XS = [{ c: -150, d: 1 }, { c: -50, d: -1 }, { c: 50, d: 1 }];                       // along y
  const YS = [{ c: -150, d: 1 }, { c: -50, d: -1 }, { c: 50, d: 1 }, { c: 150, d: -1 }];  // along x
  const SPAN = { y: [-178, 178], x: [-178, 144] };
  const SIZE = { car: [4.3, 2.1], taxi: [4.5, 2.2], van: [4.6, 2.2], bus: [6.6, 2.45], tour: [6.8, 2.45], moto: [2.7, 0.75], bike: [3.8, 0.7] };
  const OFF = { bike: -5.6, car: -1.6, bus: 3.5 };
  const MIX = {
    car: [['taxi', 'car', 'van'], ['car', 'taxi', 'car'], ['van', 'car', 'taxi'], ['taxi', 'taxi', 'car'], ['car', 'van', 'taxi'], ['car', 'taxi', 'car'], ['taxi', 'car', 'van']],
    bus: [['bus', 'taxi'], ['tour', 'moto'], ['bus', 'moto'], ['taxi', 'bus'], ['tour', 'taxi'], ['bus', 'moto'], ['moto', 'bus']],
    bike: [['bike'], ['moto'], ['bike'], ['bike'], ['moto'], ['bike'], ['bike']],
  };
  const lanes = [];
  const streets = XS.map((s) => Object.assign({ ax: 'y' }, s)).concat(YS.map((s) => Object.assign({ ax: 'x' }, s)));
  streets.forEach((S, si) => {
    // the right of the heading: +x heading -> +y, +y -> -x, -x -> -y, -y -> +x
    const right = S.ax === 'x' ? S.d : -S.d;
    for (const ln of ['car', 'bus', 'bike']) {
      const kinds = MIX[ln][si], span = SPAN[S.ax], L = span[1] - span[0];
      lanes.push({ si, ax: S.ax, d: S.d, ln, c: S.c + right * OFF[ln], kinds, a0: span[0], a1: span[1], L, V: L / P });
    }
  });
  /* the phases, one per lane, in [0, 1): from tools/search_traffic.mjs */
  const PHASE = [0.681, 0.654, 0.077, 0.838, 0.170, 0.843, 0.677, 0.995, 0.362, 0.895, 0.913, 0.885, 0.664, 0.356, 0.327, 0.336, 0.670, 0.648, 0.094, 0.769, 0.812];
  /* vehicle k of lane li at time t: { x, y, ang, s (position along the street), kind, hl, hw } */
  function pos(li, k, t, phase) {
    const Ln = lanes[li], n = Ln.kinds.length, ph = phase ? phase[li] : PHASE[li];
    const u = ((((ph + k / n) * Ln.L + Ln.V * t) % Ln.L) + Ln.L) % Ln.L;
    const s = Ln.d > 0 ? Ln.a0 + u : Ln.a1 - u;
    const kind = Ln.kinds[k], sz = SIZE[kind];
    const ang = Ln.ax === 'x' ? (Ln.d > 0 ? 0 : Math.PI) : (Ln.d > 0 ? Math.PI / 2 : -Math.PI / 2);
    return { x: Ln.ax === 'x' ? s : Ln.c, y: Ln.ax === 'x' ? Ln.c : s, s, ang, kind, hl: sz[0], hw: sz[1] };
  }
  return { P, lanes, pos, PHASE, SIZE, streets };
})();
if (typeof module !== 'undefined') module.exports = BCT;
