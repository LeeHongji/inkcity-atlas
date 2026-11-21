'use strict';
/* Hong Kong's timetables: pure functions of time, no drawing (tools/check.js loads this file in node and searches for
   collisions). World coordinates, u and seconds.
   Compass: north = +y (towards the viewer: Kowloon), south = -y (the Island and the Peak), west = +x, east = -x.
   - Roads, left-hand traffic, period 48 s. The tram street y = -50 (Des Voeux Road) runs the whole width of the Island:
     cars westbound (+x) at y -59.5, eastbound (-x) at y -40.5; the ding-ding trams on the two centre tracks
     (westbound -51.9, eastbound -48.1), each stopping at its island for 4.5 s. The tunnel road x = -50 runs north-south
     through the Cross-Harbour Tunnel (portals at y 18 on the Island, y 82 in Kowloon): northbound x -43.5, southbound
     x -56.5. Vehicles cross the tram street without lights: phases searched so no two boxes ever overlap.
   - Water, cycle 40 s. Two Star Ferries shuttle Central <-> Tsim Sha Tsui on parallel lanes (A x -5.6, B x 6.4), both
     double-ended (they never turn). The cycle is phased so ferry A comes alongside at Central 3 s into the `ferry`
     shot while ferry B casts off from Tsim Sha Tsui at the same moment. Two lanes of other boats run along the harbour
     (westbound y 45.2, eastbound y 51.6), phased to pass between the ferries. */
const HT = {};
HT.END = 166;
HT.HAR = { I: 24, K: 76, WL: -2.2 };          // the Island's seawall, Kowloon's seawall, the water level
const modH = (a, n) => ((a % n) + n) % n, clampH = (v, a, b) => (v < a ? a : v > b ? b : v);
HT.mod = modH;
HT.shotT = function (name, dflt) { if (typeof SCENE !== 'undefined') { const s = SCENE.shots.find((q) => q.name === name); if (s) return s.a / 30; } return dflt; };

/* ---------------- roads ---------------- */
HT.P = 48; HT.V = 12; HT.SPAN = HT.P * HT.V;
HT.HL = { taxi: 5.0, car: 5.3, mini: 4.6, bus: 7.0, van: 5.4, tram: 6.4 };
HT.HW = { taxi: 2.45, car: 2.55, mini: 2.3, bus: 2.55, van: 2.45, tram: 1.75 };
HT.TUN = { I: 18, K: 82 };                 // tunnel portals (the vehicle vanishes between them)
/* lanes: ax 'x' runs along x at y = c, ax 'y' along y at x = c; d the heading sign. s is the front's coordinate along
   the heading (s = d * x or d * y) */
HT.LANES = {
  W: { ax: 'x', c: -59.5, d: 1 }, E: { ax: 'x', c: -40.5, d: -1 },
  N: { ax: 'y', c: -43.5, d: 1 }, S: { ax: 'y', c: -56.5, d: -1 },
  TW: { ax: 'x', c: -51.9, d: 1 }, TE: { ax: 'x', c: -48.1, d: -1 },
};
/* the cars: lane, kind, phase s0 (searched by tools/check.js) */
HT.CARS = [
  { l: 'W', kind: 'bus', s0: 508.8 }, { l: 'W', kind: 'taxi', s0: 115.6 }, { l: 'W', kind: 'mini', s0: 327.6 },
  { l: 'E', kind: 'taxi', s0: 68.2 }, { l: 'E', kind: 'bus', s0: 249.7 }, { l: 'E', kind: 'van', s0: 457.4 },
  { l: 'N', kind: 'taxi', s0: 262.1 }, { l: 'N', kind: 'mini', s0: 439.9 }, { l: 'N', kind: 'car', s0: 70.3 },
  { l: 'S', kind: 'bus', s0: 338.9 }, { l: 'S', kind: 'taxi', s0: 559 }, { l: 'S', kind: 'car', s0: 181 },
];
/* a car's front s at time t (null when it is off the map) */
HT.carS = (c, t) => { const s = modH(c.s0 + HT.V * t, HT.SPAN) - HT.END - 8; return s > HT.END + 14 ? null : s; };
/* the trams: a stop on each track; dwell 4.5 s, braking and pulling away over 1.7 s */
HT.TRAM = { V: 8.5, tb: 1.7, D: 4.5, n: 3, stop: { TW: -18, TE: -22 }, off: { TW: 1.1, TE: 4.3 } };
{ const T = HT.TRAM; T.span = T.V * (HT.P - (T.D + T.tb)); }
/* tram k's front s on lane ln ('TW' | 'TE') at time t; also whether it stands at its stop and for how long */
HT.tram = function (ln, k, t) {
  const T = HT.TRAM, s0 = -HT.END - 8, tau = modH(t + T.off[ln] + k * HT.P / T.n, HT.P);
  const sc = T.stop[ln] + HT.HL.tram;                       // the front when the tram's centre is at its stop
  const d1 = sc - s0 - T.V * T.tb / 2, t1 = d1 / T.V, t2 = t1 + T.tb, t3 = t2 + T.D, t4 = t3 + T.tb;
  let s, at = -1;
  if (tau < t1) s = s0 + T.V * tau;
  else if (tau < t2) { const u = t2 - tau; s = sc - T.V * u * u / (2 * T.tb); }
  else if (tau < t3) { s = sc; at = tau - t2; }
  else if (tau < t4) { const u = tau - t3; s = sc + T.V * u * u / (2 * T.tb); }
  else s = sc + T.V * T.tb / 2 + T.V * (tau - t4);
  if (s > HT.END + 14) return null;
  return { s, at };
};
/* a lane position -> world point and heading */
HT.place = function (ln, s, hl) {
  const L = HT.LANES[ln], along = L.d * (s - hl);
  return { x: L.ax === 'x' ? along : L.c, y: L.ax === 'x' ? L.c : along, ang: L.ax === 'x' ? (L.d > 0 ? 0 : Math.PI) : (L.d > 0 ? Math.PI / 2 : -Math.PI / 2) };
};
/* the alpha of a vehicle centred at (x, y): fades at the map's ends and into the tunnel */
HT.alpha = function (x, y, ln) {
  let a = Math.min(1, (HT.END - 3 - Math.abs(x)) / 10, (HT.END - 3 - Math.abs(y)) / 10);
  if (ln === 'N' || ln === 'S') { const d = y < 50 ? HT.TUN.I + 3 - y : y - HT.TUN.K + 3; a = Math.min(a, d / 7); }
  return a;
};

/* ---------------- water ---------------- */
HT.WC = 40;
HT.FERRY = { hl: 7.5, hw: 2.4, yC: 33.4, yT: 63.2, x: { A: -5.6, B: 6.4 }, dwell: 9, cross: 11 };
/* ferry tau (0..40): 0..9 at Central, 9..20 to Tsim Sha Tsui, 20..29 at Tsim Sha Tsui, 29..40 back. B runs 9 s ahead
   of A (29 s), so B casts off from Tsim Sha Tsui as A comes alongside at Central. A arrives 3 s into the ferry shot. */
HT.ferryOff = function () {
  if (HT._foff != null) return HT._foff;
  return (HT._foff = modH(-(HT.shotT('ferry', 1300 / 30) + 3), HT.WC));
};
HT.ferryTau = (f, t) => modH(t + HT.ferryOff() + (f === 'B' ? 29 : 0), HT.WC);
HT.ferry = function (f, t) {
  const F = HT.FERRY, tau = HT.ferryTau(f, t), x = F.x[f];
  const ease = (u) => (1 - Math.cos(Math.PI * clampH(u, 0, 1))) / 2;
  let y, moving = 0;
  if (tau < 9) y = F.yC;
  else if (tau < 20) { y = F.yC + (F.yT - F.yC) * ease((tau - 9) / 11); moving = 1; }
  else if (tau < 29) y = F.yT;
  else { y = F.yT + (F.yC - F.yT) * ease((tau - 29) / 11); moving = -1; }
  return { x, y, ang: Math.PI / 2, tau, moving, at: tau < 9 ? 'C' : (tau >= 20 && tau < 29) ? 'T' : null };
};
/* harbour lanes: boats at constant speed along x; s0 phase. ln 'W' heading +x at y 45.5, 'E' heading -x at y 51.6 */
HT.RIV = { V: 9, SPAN: 360, W: 45.2, E: 51.6 };
HT.BOATS = [
  { ln: 'W', kind: 'junk', hl: 7, hw: 1.9, s0: 197.2 }, { ln: 'W', kind: 'jet', hl: 6.2, hw: 2.1, s0: 312.8 },
  { ln: 'E', kind: 'lighter', hl: 6.5, hw: 2.2, s0: 34.7 }, { ln: 'E', kind: 'police', hl: 4.2, hw: 1.5, s0: 280.6 },
];
HT.boat = function (b, t) {
  const R = HT.RIV, s = modH(b.s0 + R.V * t, R.SPAN) - R.SPAN / 2, x = b.ln === 'W' ? s : -s;
  const a = clampH(Math.min(x + 178, 178 - x) / 14, 0, 1);
  if (a <= 0.02) return null;
  return { x, y: b.ln === 'W' ? R.W : R.E, ang: b.ln === 'W' ? 0 : Math.PI, alpha: a < 1 ? a : null };
};

/* ---------------- the Peak Tram: a funicular, two cars on one cable, passing in the middle ---------------- */
HT.PEAK = { C: 30, T: 11, D: 4 };          // cycle 30 s: climb 11 s, wait 4 s at the top, descend 11 s, wait 4 s
/* phased so the cars pass on the loop (tau 5.5) 3 s into the `peaktram` shot */
HT.peakOff = function () { if (HT._poff != null) return HT._poff; return (HT._poff = modH(5.5 - (HT.shotT('peaktram', 10) + 3), HT.PEAK.C)); };
/* fraction along the line (0 bottom .. 1 top) of car k (0 or 1) at time t; the cars are on the same cable */
HT.peakU = function (k, t) {
  const P = HT.PEAK, tau = modH(t + HT.peakOff() + (k ? P.C / 2 : 0), P.C), e = (u) => (1 - Math.cos(Math.PI * clampH(u, 0, 1))) / 2;
  if (tau < P.T) return e(tau / P.T);
  if (tau < P.T + P.D) return 1;
  if (tau < 2 * P.T + P.D) return 1 - e((tau - P.T - P.D) / P.T);
  return 0;
};

if (typeof module !== 'undefined') module.exports = HT;
