'use strict';
/* Istanbul's timetables: pure functions of time, no drawing (tools/check.js loads this file in node and searches for
   collisions). World coordinates, u and seconds.
   - Roads (right-hand traffic), common period 30 s: the avenue x = -50 runs the whole map over the Galata Bridge
     (ramps up to the deck at z 6); the street y = 50 west of it carries turning cars (eastbound turns right into the
     southbound avenue, northbound avenue cars turn left into the westbound lane). The T1 tram runs the avenue's two
     centre tracks.
   - Water, cycle 90 s: ferries are routes of steps (steam along a path, reverse, pivot, wait at a pier). Route A
     Eminönü–Kadıköy, route B Karaköy–Üsküdar, D1/D2 the Golden Horn ferries (through the bridge's opening span).
   Shot phases: route A comes alongside at Eminönü as the `eminonu` shot opens; D1 passes under the bridge and the
   southbound tram crosses it during the `kopru` shot. */
const IT = {};
IT.END = 160;
IT.WL = -2.6;
IT.HORN = { N: -72, S: -28 }; IT.BOS = { W: 28, E: 72 }; IT.BAY = { N: -37, S: 37 };
IT.BR = { x0: -63, x1: -37, y0: -72, y1: -28, z: 6, rN: -94, rS: -6, open: [-60, -40] };
const modI = (a, n) => ((a % n) + n) % n, clampI = (v, a, b) => (v < a ? a : v > b ? b : v);
IT.mod = modI;
/* the avenue's height: ramps up to the bridge deck */
IT.zAve = function (y) {
  const B = IT.BR, sm = (u) => { u = clampI(u, 0, 1); return u * u * (3 - 2 * u); };
  if (y <= B.rN || y >= B.rS) return 0;
  if (y < B.y0) return B.z * sm((y - B.rN) / (B.y0 - B.rN));
  if (y > B.y1) return B.z * sm((B.rS - y) / (B.rS - B.y1));
  return B.z;
};
IT.onAve = (x) => x > -63 && x < -37;
IT.shotT = function (name, dflt) { if (typeof SCENE !== 'undefined') { const s = SCENE.shots.find((q) => q.name === name); if (s) return s.a / 30; } return dflt; };

/* ---------------- polylines with rounded corners, sampled by arc length ---------------- */
IT.poly = function (pts, r) {
  r = r == null ? 6 : r;
  const P = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1];
    const d1 = [b[0] - a[0], b[1] - a[1]], d2 = [c[0] - b[0], c[1] - b[1]], l1 = Math.hypot(d1[0], d1[1]), l2 = Math.hypot(d2[0], d2[1]);
    const u1 = [d1[0] / l1, d1[1] / l1], u2 = [d2[0] / l2, d2[1] / l2], cosA = u1[0] * u2[0] + u1[1] * u2[1];
    if (cosA > 0.9999) { P.push(b); continue; }
    const th = Math.acos(clampI(cosA, -1, 1)), t = Math.min(r * Math.tan(th / 2), l1 * 0.48, l2 * 0.48);
    const p0 = [b[0] - u1[0] * t, b[1] - u1[1] * t], p1 = [b[0] + u2[0] * t, b[1] + u2[1] * t];
    for (let k = 0; k <= 8; k++) { const s = k / 8, q = [(1 - s) * (1 - s) * p0[0] + 2 * s * (1 - s) * b[0] + s * s * p1[0], (1 - s) * (1 - s) * p0[1] + 2 * s * (1 - s) * b[1] + s * s * p1[1]]; P.push(q); }
  }
  P.push(pts[pts.length - 1]);
  const S = [0]; for (let i = 1; i < P.length; i++) S.push(S[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const L = S[S.length - 1];
  return {
    L, at(s) {
      s = clampI(s, 0, L); let lo = 0, hi = S.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m] <= s) lo = m; else hi = m; }
      const a = P[lo], b = P[hi], f = (s - S[lo]) / ((S[hi] - S[lo]) || 1);
      return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) };
    },
  };
};

/* ---------------- roads ---------------- */
IT.PR = 30; IT.V = 12; IT.SPAN = IT.PR * IT.V;
const E = IT.END;
IT.ROUTES = {
  sb: IT.poly([[-58, -E - 4], [-58, E + 4]]),
  nb: IT.poly([[-42, E + 4], [-42, -E - 4]]),
  eR: IT.poly([[-E - 4, 56], [-58, 56], [-58, E + 4]], 5),        // eastbound on y = 50, right turn into the avenue
  nL: IT.poly([[-42, E + 4], [-42, 44], [-E - 4, 44]], 8),        // northbound avenue, left turn into the westbound lane
  tS: IT.poly([[-52.6, -E - 30], [-52.6, E + 30]]),                    // the T1 tram, southbound track
  tN: IT.poly([[-47.4, E + 30], [-47.4, -E - 30]]),
};
IT.HL = { taxi: 5.3, car: 5.3, dolmus: 6.0, bus: 7.4, tram: 4.4 };
IT.HW = { taxi: 2.55, car: 2.55, dolmus: 2.55, bus: 2.7, tram: 2.2 };
/* each vehicle: route, kind, phase (u along the span at t = 0) */
IT.CARS = [
  { r: 'sb', kind: 'taxi', s0: 330.4 }, { r: 'sb', kind: 'bus', s0: 180.8 }, { r: 'sb', kind: 'dolmus', s0: 83.7 },
  { r: 'nb', kind: 'taxi', s0: 115.1 }, { r: 'nb', kind: 'car', s0: 69.3 }, { r: 'nb', kind: 'taxi', s0: 349.3 },
  { r: 'eR', kind: 'dolmus', s0: 200.1 }, { r: 'eR', kind: 'taxi', s0: 138.2 },
  { r: 'nL', kind: 'taxi', s0: 157.5 }, { r: 'nL', kind: 'car', s0: 44.9 },
];
IT.TRAMS = [{ r: 'tS', s0: 0, n: 3 }, { r: 'tN', s0: 180, n: 3 }];
IT.TRAM_GAP = 9.0;
/* the southbound tram's head reaches the bridge's middle 2.5 s into the kopru shot */
IT.tramOff = function () {
  if (IT._toff != null) return IT._toff;
  const t0 = IT.shotT('kopru', 1100 / 30) + 2.5, sMid = (-50) - (-E - 30) + IT.TRAM_GAP;   // the middle section at y = -50
  return (IT._toff = modI(sMid - IT.V * t0, IT.SPAN));
};
/* position along the route: s(t) for a vehicle (route length L, the span is longer: the rest of the period it is off the map) */
IT.sOf = function (s0, t) { return modI(s0 + IT.V * t, IT.SPAN); };
IT.vehicle = function (c, t) {
  const R = IT.ROUTES[c.r], s = IT.sOf(c.s0, t); if (s > R.L) return null;
  const p = R.at(s); return { x: p.x, y: p.y, ang: p.ang, s, L: R.L };
};
IT.tramSec = function (tr, i, t) {
  const R = IT.ROUTES[tr.r], s = IT.sOf(IT.tramOff() + tr.s0, t) - i * IT.TRAM_GAP;
  if (s < 0 || s > R.L) return null; const p = R.at(s); return { x: p.x, y: p.y, ang: p.ang, s, L: R.L };
};

/* ---------------- water: ferry routes ---------------- */
IT.WC = 90;
/* a route is a list of steps:
   { dwell: T, label }                                   wait at the current pose
   { path: [[x, y], ...], v, rev, ease: 'both'|'start'|'end'|'none', r }   steam along a path (rev: stern first)
   { pivot: true, a1, T }                                turn on the spot to heading a1
   { fill: true, label }                                 a dwell that takes whatever time is left in the cycle
   start: { x, y, ang } */
IT.mkRoute = function (start, steps) {
  const S = []; let pose = { x: start.x, y: start.y, ang: start.ang }, t = 0;
  for (const st of steps) {
    const p0 = Object.assign({}, pose);
    if (st.dwell != null || st.fill) { S.push({ t0: t, T: st.dwell || 0, fill: !!st.fill, label: st.label, f: () => p0 }); t += st.dwell || 0; }
    else if (st.pivot) {
      let a0 = p0.ang, a1 = st.a1; while (a1 - a0 > Math.PI) a1 -= 2 * Math.PI; while (a1 - a0 < -Math.PI) a1 += 2 * Math.PI;
      const T = st.T || Math.abs(a1 - a0) * 3.2;
      S.push({ t0: t, T, label: st.label, f: (u) => ({ x: p0.x, y: p0.y, ang: a0 + (a1 - a0) * (1 - Math.cos(Math.PI * clampI(u / T, 0, 1))) / 2 }) });
      t += T; pose = { x: p0.x, y: p0.y, ang: a1 };
    } else {
      const pl = IT.poly([[p0.x, p0.y]].concat(st.path), st.r), L = pl.L, v = st.v || 6, e = st.ease || 'both';
      const T = e === 'both' ? L / v * Math.PI / 2 : e === 'none' ? L / v : L / v * Math.PI / 2;
      const sOf = (u) => { const f = clampI(u / T, 0, 1); return e === 'both' ? L * (1 - Math.cos(Math.PI * f)) / 2 : e === 'start' ? L * (1 - Math.cos(Math.PI * f / 2)) : e === 'end' ? L * Math.sin(Math.PI * f / 2) : L * f; };
      const rev = !!st.rev;
      S.push({ t0: t, T, label: st.label, f: (u) => { const q = pl.at(sOf(u)); return { x: q.x, y: q.y, ang: q.ang + (rev ? Math.PI : 0) }; } });
      const end = pl.at(L); t += T; pose = { x: end.x, y: end.y, ang: end.ang + (rev ? Math.PI : 0) };
    }
  }
  const fill = S.find((s) => s.fill); if (fill) { const rest = IT.WC - t; if (rest < 0) throw new Error('route too long by ' + (-rest).toFixed(1) + ' s'); fill.T = rest; let tt = 0; for (const s of S) { s.t0 = tt; tt += s.T; } t = IT.WC; }
  return { S, D: t,
    state(tau) { for (const s of S) if (tau < s.t0 + s.T) { const q = s.f(tau - s.t0); return { x: q.x, y: q.y, ang: q.ang, label: s.label, u: tau - s.t0 }; } const s = S[S.length - 1], q = s.f(s.T); return { x: q.x, y: q.y, ang: q.ang }; },
    mark(label) { const s = S.find((q) => q.label === label); return s ? s.t0 : 0; },
  };
};
const HP = Math.PI / 2, PI = Math.PI;
/* docks (ferry centres): Eminönü pier north face, Kadıköy pier north face, Karaköy quay, Üsküdar pier west face */
IT.DOCK = { EM: { x: 8, y: -40.4, ang: PI }, KD: { x: 96, y: 21.6, ang: 0 }, KA: { x: 6, y: -68.4, ang: PI }, US: { x: 58.4, y: -104, ang: -HP } };
IT.FL = 9.5; IT.FW = 2.6;               // ferry half length / half width
IT.ROUTE = {
  A: IT.mkRoute(IT.DOCK.EM, [
    { dwell: 9.5, label: 'em' },
    { path: [[36, -47]], v: 3.2, rev: true, ease: 'both', label: 'emOut' },
    { pivot: true, a1: HP, T: 5 },
    { path: [[38, -10], [62, 21.6], [IT.DOCK.KD.x, IT.DOCK.KD.y]], v: 9.5, ease: 'both', r: 14 },
    { fill: true, label: 'kd' },
    { path: [[78, 15]], v: 3.0, rev: true, ease: 'both' },
    { pivot: true, a1: -HP, T: 5 },
    { path: [[56, -6], [54, -30], [34, -40.4], [IT.DOCK.EM.x, IT.DOCK.EM.y]], v: 9.5, ease: 'both', r: 12, label: 'emIn' },
  ]),
  B: IT.mkRoute(IT.DOCK.KA, [
    { dwell: 10, label: 'ka' },
    { path: [[44, -68.4], [50, -61]], v: 3.4, rev: true, ease: 'both', r: 6 },
    { pivot: true, a1: -HP, T: 5 },
    { path: [[50, -72], [IT.DOCK.US.x, -84], [IT.DOCK.US.x, IT.DOCK.US.y]], v: 7, ease: 'both', r: 6 },
    { dwell: 10, label: 'us' },
    { path: [[IT.DOCK.US.x, -92], [52, -84]], v: 3.0, rev: true, ease: 'both', r: 4 },
    { pivot: true, a1: HP + 0.35, T: 6 },
    { path: [[44, -72], [36, -67], [IT.DOCK.KA.x, IT.DOCK.KA.y]], v: 7, ease: 'both', r: 10 },
    { fill: true },
  ]),
  D1: IT.mkRoute({ x: -E - 12, y: -48, ang: 0 }, [
    { path: [[24, -48], [33, -60], [33, -E - 14]], v: 6, ease: 'none', r: 10, label: 'run' },
    { fill: true, label: 'away' },
  ]),
  D2: IT.mkRoute({ x: 40, y: -E - 14, ang: HP }, [
    { path: [[40, -78], [24, -57], [-E - 12, -57]], v: 6, ease: 'none', r: 10, label: 'run' },
    { fill: true, label: 'away' },
  ]),
};
/* route offsets (seconds added to t). A: alongside at Eminönü 1.2 s after the eminonu shot opens; D1: under the
   bridge (x = -50) 3.5 s into the kopru shot; B and D2: searched (tools/check.js) */
IT.OFF = { B: 0, D2: 4.5 };
IT.off = function (r) {
  if (IT._off && IT._off[r] != null) return IT._off[r];
  IT._off = IT._off || {};
  let o = IT.OFF[r] || 0;
  if (r === 'A') o = modI(IT.ROUTE.A.mark('em') - 0.0 - (IT.shotT('eminonu', 1300 / 30) + 1.2), IT.WC);
  if (r === 'D1') { const R = IT.ROUTE.D1, tUnder = (-50 - (-E - 12)) / 6; o = modI(tUnder - (IT.shotT('kopru', 1100 / 30) + 3.5), IT.WC); void R; }
  return (IT._off[r] = o);
};
IT.tau = (r, t) => modI(t + IT.off(r), IT.WC);
IT.ferry = function (r, t) {
  const s = IT.ROUTE[r].state(IT.tau(r, t));
  if (r === 'D1' || r === 'D2') { const fx = Math.min(s.x + 137 - 2, 137 - 2 - s.x, s.y + 137 - 2), a = clampI(fx / 10, 0, 1); if (a <= 0.02) return null; s.alpha = a < 1 ? a : null; }
  return s;
};
/* time since route A came alongside at Eminönü (0..WC) */
IT.emTau = (t) => modI(IT.tau('A', t) - IT.ROUTE.A.mark('em'), IT.WC);
IT.EMDWELL = 9.5;

if (typeof module !== 'undefined') module.exports = IT;
