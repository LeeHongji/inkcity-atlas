'use strict';
/* Chongqing's traffic as pure functions of time, in world u (shared by the streets tile and tools/traffic.js).
   Right-hand traffic: heading +x keeps to the +y side of a street, heading +y keeps to the -x side.
   - y = -50 and y = +50 run from the far (west) edge across the map, over the Jialing riverside road and out over the
     Jialing on bridges to the map's cut edge (x 196).
   - The Jialing riverside road (x 137..153) and the Yangtze riverside road (y 137..153) run from the far edges to the
     Chaotianmen podium at the tip, where they go into tunnels under the square (the podium's far faces hide them).
   - x = -50 and x = +50 are pedestrian streets (no traffic).
   Every lane has the same loop length SPAN and speed V, so the whole timetable repeats every P seconds; each vehicle
   is visible only on its road's stretch. The only crossings are the two cross streets with the Jialing road; the
   phases were searched with tools/traffic.js so no two vehicles' boxes ever overlap there. */
const CQT = (function () {
  const SPAN = 400, V = 12, P = SPAN / V;
  // lane: axis ('x': runs along x at fixed y = c), d (+1/-1 direction), from..to (the visible stretch along the axis),
  // fadeA/fadeB: fade in at the start / out at the end (false: the end is a tunnel behind the podium)
  const LANES = [
    { ax: 'x', c: -46, d: 1, a: -142, b: 196, fa: true, fb: true },
    { ax: 'x', c: -54, d: -1, a: 196, b: -142, fa: true, fb: true },
    { ax: 'x', c: 54, d: 1, a: -142, b: 196, fa: true, fb: true },
    { ax: 'x', c: 46, d: -1, a: 196, b: -142, fa: true, fb: true },
    { ax: 'y', c: 141.5, d: 1, a: -142, b: 132, fa: true, fb: false },
    { ax: 'y', c: 148.5, d: -1, a: 132, b: -142, fa: false, fb: true },
    { ax: 'x', c: 148.5, d: 1, a: -142, b: 132, fa: true, fb: false },
    { ax: 'x', c: 141.5, d: -1, a: 132, b: -142, fa: false, fb: true },
  ];
  // what drives each lane (two vehicles per lane, half a loop apart)
  const KIND = [['taxi', 'bus'], ['car', 'taxi'], ['moto', 'taxi'], ['taxi', 'car'], ['bus', 'taxi'], ['taxi', 'moto'], ['taxi', 'car'], ['car', 'bus']];
  const PHASE = [0.02, 368.31, 115.69, 84.22, 291.75, 213.09, 131.72, 300.82];   // searched: tools/traffic.js 7 -> 0 hits
  const half = (kind) => kind === 'bus' ? 7.4 : kind === 'moto' ? 2.6 : 5.3;
  /* vehicle k of lane li at time t: {x, y, ang, alpha} or null */
  function at(li, k, t, ph) {
    const L = LANES[li], len = Math.abs(L.b - L.a), p = ph == null ? PHASE[li] : ph;
    const s = ((((p + k * SPAN / 2 + V * t) % SPAN) + SPAN) % SPAN);
    if (s > len) return null;
    let alpha = 1;
    if (L.fa) alpha = Math.min(alpha, s / 10); else if (s < 1) return { hidden: true };
    if (L.fb) alpha = Math.min(alpha, (len - s) / 10);
    if (alpha <= 0.02) return null;
    const u = L.a + L.d * s, ang = L.ax === 'x' ? (L.d > 0 ? 0 : Math.PI) : (L.d > 0 ? Math.PI / 2 : -Math.PI / 2);
    return { x: L.ax === 'x' ? u : L.c, y: L.ax === 'x' ? L.c : u, ang, alpha: alpha < 1 ? alpha : null };
  }
  return { SPAN, V, P, LANES, KIND, PHASE, at, half };
})();
if (typeof module !== 'undefined') module.exports = CQT;
