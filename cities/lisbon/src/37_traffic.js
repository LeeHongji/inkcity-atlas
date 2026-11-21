'use strict';
/* Lisbon's traffic as pure functions of time (world coordinates), shared by the streets tile, the Alfama tile and the
   offline checker (tools/traffic_check.mjs).

   Tram 28 runs one line: the Alfama lane (one track, from the east edge to its mouth on the street x = 50) - north on
   x = 50 - west along y = 50 (Rua da Conceição) - north on x = -50 - west along y = -50 to the west edge (Prazeres).
   Right-hand running on two tracks (±2.6 from a street's centre) except in the lane. Westbound and eastbound cars come
   once each per period P. The eastbound waits at the passing place on x = 47.4 until the westbound has come out of the
   single track beside it, then turns into the lane. Phased so the meeting happens in the Alfama shot.

   Cars, taxis, tuk-tuks and a bus run lanes ±7.3 from each street's centre (never a tram track). They stop at the line
   while a tram's body crosses their lane (red windows found by sampling the trams), then go on; the lane phases were
   searched offline so that no two vehicles ever overlap. */
const LXT = (function () {
  const P = 60, hyp = Math.hypot, cl = (v, a, b) => Math.max(a, Math.min(b, v)), sm = (t) => { t = cl(t, 0, 1); return t * t * (3 - 2 * t); };
  /* ---------- paths: dense polylines with cumulative length ---------- */
  const path = (pts) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + hyp(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, L, len: L[L.length - 1] }; };
  const at = (pa, s) => {
    s = cl(s, 0, pa.len); let lo = 0, hi = pa.L.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pa.L[m] <= s) lo = m; else hi = m; }
    const a = pa.pts[lo], b = pa.pts[hi], u = (s - pa.L[lo]) / ((pa.L[hi] - pa.L[lo]) || 1);
    return { x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  };
  const line = (out, a, b) => { const n = Math.max(1, Math.ceil(hyp(b[0] - a[0], b[1] - a[1]) / 0.5)); for (let i = out.length ? 1 : 0; i <= n; i++) out.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]); };
  const arc = (out, c, r, a0, a1) => { const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) * r / 0.5)); for (let i = 1; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]); } };
  const cr = (pts, n) => { const out = []; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]; for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); } } out.push(pts[pts.length - 1]); return out; };

  /* the Alfama lane's centre line (world), from beyond the east edge to its mouth at x = 63 */
  const LANE_K = [[149, 102.5], [137, 104], [126, 107.5], [114, 112], [102, 113.5], [90, 112], [80, 109], [70, 108], [63, 108]];
  const LANE = cr(LANE_K, 14);
  /* westbound: lane, right turn onto x = 52.6, north, left onto y = 47.4, west, right onto x = -47.4, north, left onto y = -52.6, west */
  const G = 2.5, RT = 10, RW = 13 - G, RE = 13 + G;                // track offset, turn radius, the two curves at the lane mouth
  const wb = LANE.slice();
  arc(wb, [63, 108 - RW], RW, Math.PI / 2, Math.PI);                 // (63,108) heading west -> x = 50+G heading north
  line(wb, [50 + G, 108 - RW], [50 + G, 50 - G + RT]);
  arc(wb, [50 + G - RT, 50 - G + RT], RT, 0, -Math.PI / 2);          // -> y = 50-G heading west
  line(wb, [50 + G - RT, 50 - G], [-50 + G + RT, 50 - G]);
  arc(wb, [-50 + G + RT, 50 - G - RT], RT, Math.PI / 2, Math.PI);    // -> x = -50+G heading north
  line(wb, [-50 + G, 50 - G - RT], [-50 + G, -50 - G + RT]);
  arc(wb, [-50 + G - RT, -50 - G + RT], RT, 0, -Math.PI / 2);        // -> y = -50-G heading west
  line(wb, [-50 + G - RT, -50 - G], [-158, -50 - G]);
  /* eastbound: the mirror journey on the other tracks, into the lane */
  const eb = [];
  line(eb, [-158, -50 + G], [-50 - G - RT, -50 + G]);
  arc(eb, [-50 - G - RT, -50 + G + RT], RT, -Math.PI / 2, 0);        // -> x = -50-G heading south
  line(eb, [-50 - G, -50 + G + RT], [-50 - G, 50 + G - RT]);
  arc(eb, [-50 - G + RT, 50 + G - RT], RT, Math.PI, Math.PI / 2);    // -> y = 50+G heading east
  line(eb, [-50 - G + RT, 50 + G], [50 - G - RT, 50 + G]);
  arc(eb, [50 - G - RT, 50 + G + RT], RT, -Math.PI / 2, 0);          // -> x = 50-G heading south
  line(eb, [50 - G, 50 + G + RT], [50 - G, 108 - RE]);
  arc(eb, [63, 108 - RE], RE, Math.PI, Math.PI / 2);                 // -> (63,108) heading east
  for (let i = LANE.length - 2; i >= 0; i--) eb.push(LANE[i]);
  const WB = path(wb), EB = path(eb), LP = path(LANE);
  const S_LANE = LP.len;                                             // the single track: s in [0, S_LANE] on WB, [EB.len - S_LANE, EB.len] on EB

  /* ---------- tram motion: a speed profile slow on bends and at stops, integrated into t(s) ---------- */
  const curv = (pa) => { const k = new Float32Array(pa.pts.length); for (let i = 2; i < pa.pts.length - 2; i++) { const a = Math.atan2(pa.pts[i][1] - pa.pts[i - 2][1], pa.pts[i][0] - pa.pts[i - 2][0]), b = Math.atan2(pa.pts[i + 2][1] - pa.pts[i][1], pa.pts[i + 2][0] - pa.pts[i][0]); let d = Math.abs(b - a); if (d > Math.PI) d = 2 * Math.PI - d; k[i] = d / Math.max(0.01, pa.L[i + 2] - pa.L[i - 2]); } return k; };
  const VS = 6.4, VC = 3.6, VL = 4.6;
  /* stops: [s, dwell]; hold: [s, until] = wait at s until local time `until` */
  const profile = (pa, stops, slowLane) => {
    const k = curv(pa), n = pa.pts.length, v = new Float32Array(n);
    for (let i = 0; i < n; i++) { let m = 1e9; for (let j = Math.max(0, i - 40); j < Math.min(n, i + 40); j++) if (k[j] > 0.04) m = Math.min(m, Math.abs(pa.L[j] - pa.L[i])); v[i] = VC + (VS - VC) * sm(m / 10); if (slowLane && slowLane(pa.L[i])) v[i] = Math.min(v[i], VL); }
    for (const [ss] of stops) for (let i = 0; i < n; i++) { const d = Math.abs(pa.L[i] - ss); if (d < 9) v[i] = Math.min(v[i], 0.6 + (VS - 0.6) * Math.sqrt(d / 9)); }
    const T = new Float64Array(n); for (let i = 1; i < n; i++) T[i] = T[i - 1] + (pa.L[i] - pa.L[i - 1]) * 2 / (v[i] + v[i - 1]);
    return { T, stops };
  };
  // local time -> s, honouring dwells (stop i adds its dwell once the tram reaches it)
  const sOf = (pa, pr, tau) => {
    let shift = 0;
    for (const [ss, dw] of pr.stops) {
      const i = idx(pa, ss), tStop = pr.T[i] + shift;
      if (tau < tStop) break;
      if (tau < tStop + dw) return ss;
      shift += dw;
    }
    const tt = tau - shift; let lo = 0, hi = pr.T.length - 1;
    if (tt >= pr.T[hi]) return pa.len;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pr.T[m] <= tt) lo = m; else hi = m; }
    return pa.L[lo] + (pa.L[hi] - pa.L[lo]) * (tt - pr.T[lo]) / ((pr.T[hi] - pr.T[lo]) || 1);
  };
  const idx = (pa, s) => { let lo = 0, hi = pa.L.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pa.L[m] <= s) lo = m; else hi = m; } return lo; };
  const tOf = (pa, pr, s) => { let shift = 0; for (const [ss, dw] of pr.stops) if (ss < s) shift += dw; return pr.T[idx(pa, s)] + shift; };

  const inLaneW = (s) => s < S_LANE + 2, inLaneE = (s) => s > EB.len - S_LANE - 2;
  const S_STOP_W = idx(WB, 0) >= 0 ? WB.L[WB.pts.findIndex((p) => p[1] === 50 - G && p[0] <= 4)] : 0;          // Rua da Conceição, westbound
  const S_STOP_E = EB.L[EB.pts.findIndex((p) => p[0] === -50 - G && p[1] >= 4)];                                 // below Chiado, eastbound
  const S_WAIT = EB.L[EB.pts.findIndex((p) => p[0] === 50 - G && p[1] >= 108 - RE)] - 12.0;                          // the passing place (front at the turnout)
  const prW0 = profile(WB, [[S_STOP_W, 7]], inLaneW);
  const STOPS_E = [[S_STOP_E, 2.5], [S_WAIT, 0]];
  const prE0 = profile(EB, STOPS_E, inLaneE);
  // westbound leaves the single track (its rear past the turnout) at:
  const W_CLEAR = tOf(WB, prW0, S_LANE + 15.5);
  const W_MOUTH = tOf(WB, prW0, S_LANE);
  // the eastbound arrives at the passing place ARR seconds before the westbound reaches the mouth, then holds until it has cleared
  const ARR_LEAD = 3.3, tArrE = tOf(EB, prE0, S_WAIT);
  const shot = (typeof SCENE !== 'undefined' && SCENE.shots) ? SCENE.shots.find((s) => s.name === 'alfama') : { a: 600 };
  // phases: at the Alfama cut the westbound is 1.8 s from the mouth and the eastbound has just stopped
  const PHW = (((shot.a / 30 + 1.8 - W_MOUTH) % P) + P) % P;
  const PHE = (((PHW + W_MOUTH - ARR_LEAD - tArrE) % P) + P) % P;
  const HOLD = W_CLEAR + 0.8 - W_MOUTH + ARR_LEAD;                    // the eastbound's wait at the passing place
  const prW = prW0, prE = { T: prE0.T, stops: STOPS_E.map(([a, d]) => [a, a === S_WAIT ? HOLD : d]) };
  const DW = tOf(WB, prW, WB.len) + 0.01, DE = tOf(EB, prE, EB.len) + 0.01;
  const FADE = 9, NT = 3;
  /* tram j (0, 1) of a direction at time t: {x, y, ang, alpha, s, dir} or null */
  const tram = (dir, j, t) => {
    const pa = dir === 'W' ? WB : EB, pr = dir === 'W' ? prW : prE, ph = dir === 'W' ? PHW : PHE, D = dir === 'W' ? DW : DE;
    const tau = ((t - ph - j * P) % (NT * P) + NT * P) % (NT * P);
    if (tau >= D) return null;
    const s = sOf(pa, pr, tau), p = at(pa, s), e = Math.min(s, pa.len - s) / FADE;
    // heading from a chord over the body length, so the car sits across a bend the way a rigid body does
    const a = at(pa, s - 1.6), b = at(pa, s + 1.6);
    return { x: p.x, y: p.y, ang: Math.atan2(b.y - a.y, b.x - a.x), alpha: e < 1 ? Math.max(0.02, e) : null, s, dir, wait: dir === 'E' && Math.abs(s - S_WAIT) < 0.01 };
  };
  const trams = (t) => { const out = []; for (const d of ['W', 'E']) for (let j = 0; j < NT; j++) { const st = tram(d, j, t); if (st) out.push(st); } return out; };
  const TRAM_HL = 6.95, TRAM_HW = 2.2;

  /* ---------- cars ---------- */
  const V = 12, VLEN = 720, CAR_HW = 2.35;
  // [axis of travel ('x' | 'y'), street centre, direction, lane offset]
  const LANES = [['x', -50, 1, 7.7], ['x', -50, -1, -7.7], ['x', 50, 1, 7.7], ['x', 50, -1, -7.7], ['y', -50, 1, -7.7], ['y', -50, -1, 7.7], ['y', 50, 1, -7.7], ['y', 50, -1, 7.7]];
  const KINDS = [['taxi', 'tuk'], ['car', 'tuk'], ['tuk', 'van'], ['taxiO', 'car'], ['car', 'tuk'], ['tuk', 'bus'], ['tuk', 'taxi'], ['taxi', 'car']];
  const HL = { car: 5.4, taxi: 5.2, taxiO: 5.2, tuk: 3.4, van: 5.0, bus: 7.0 };
  let PH = [10.045, 22.238, 54.999, 7.523, 50.606, 39.033, 40.955, 17.379];          // lane phases (s); set from the offline search below
  const range = (L) => (L[0] === 'x' ? [-152, 152] : [-152, 131]);
  const placeOf = (L, s) => { const r = range(L), a = L[2] > 0 ? r[0] + s : r[1] - s; return L[0] === 'x' ? { x: a, y: L[1] + L[3] } : { x: L[1] + L[3], y: a }; };
  const angOf = (L) => (L[0] === 'x' ? (L[2] > 0 ? 0 : Math.PI) : (L[2] > 0 ? Math.PI / 2 : -Math.PI / 2));
  /* red windows: for each lane, clusters of (s-range, time windows) where a tram's body crosses the lane's strip */
  const obbPts = (x, y, ang, hl, hw) => { const c = Math.cos(ang), s = Math.sin(ang); return [[x + c * hl - s * hw, y + s * hl + c * hw], [x + c * hl + s * hw, y + s * hl - c * hw], [x - c * hl + s * hw, y - s * hl - c * hw], [x - c * hl - s * hw, y - s * hl + c * hw]]; };
  const RED = LANES.map((L) => {
    const r = range(L), across = L[1] + L[3], hw = 2.9, hits = [];
    for (let t = 0; t < NT * P; t += 0.1) for (const st of trams(t)) {
      const pts = obbPts(st.x, st.y, st.ang, TRAM_HL, TRAM_HW);
      const ac = pts.map((p) => (L[0] === 'x' ? p[1] : p[0])), al = pts.map((p) => (L[0] === 'x' ? p[0] : p[1]));
      if (Math.max(...ac) < across - hw || Math.min(...ac) > across + hw) continue;
      const a0 = Math.min(...al), a1 = Math.max(...al), s0 = L[2] > 0 ? a0 - r[0] : r[1] - a1, s1 = L[2] > 0 ? a1 - r[0] : r[1] - a0;
      hits.push([t % P, s0, s1]);
    }
    // cluster by place along the lane, then by time
    const cls = [];
    for (const h of hits) { let c = cls.find((q) => h[1] < q.s1 + 6 && h[2] > q.s0 - 6); if (!c) { c = { s0: h[1], s1: h[2], ts: [] }; cls.push(c); } c.s0 = Math.min(c.s0, h[1]); c.s1 = Math.max(c.s1, h[2]); c.ts.push(h[0]); }
    for (const c of cls) { c.ts.sort((a, b) => a - b); const w = []; for (const t of c.ts) { const last = w[w.length - 1]; if (last && t - last[1] < 0.35) last[1] = t; else w.push([t, t]); } c.win = w.map(([a, b]) => [a - 1.0, b + 1.0]); }
    return cls;
  });
  /* a car's keyframes over one entry: cruise, braking to the stop line of each red window it would run into, waiting, going on */
  const schedule = (li, t0, hl) => {
    const kf = [[t0, 0, V]], cls = RED[li].slice().sort((a, b) => a.s0 - b.s0);
    let tc = t0, sc = 0;                       // time and place of the last keyframe
    for (const c of cls) {
      const line = c.s0 - hl - 2.0;            // where the car's centre stops: its front at the stop line
      if (line < sc + 10) continue;
      const tArr = tc + (line - sc) / V, tOut = tArr + (c.s1 + hl + 2.0 - line) / V;
      let go = null;
      for (let rep = -1; rep <= 2; rep++) for (const [a, b] of c.win) { const A = a + rep * P, B = b + rep * P; if (tArr < B && tOut > A) go = Math.max(go || 0, B); }
      if (go == null) continue;
      // brake over 8 u, wait, pull away over 8 u
      const tb = tArr - 8 / V; kf.push([tb, line - 8, V]); kf.push([tb + 16 / V, line, 0]);
      const tg = Math.max(go, tb + 16 / V); kf.push([tg, line, 0]); kf.push([tg + 16 / V, line + 8, V]);
      tc = tg + 16 / V; sc = line + 8;
    }
    kf.push([tc + (VLEN - sc) / V, VLEN, V]);
    return kf;
  };
  const herm = (k0, k1, t) => { const h = k1[0] - k0[0], u = (t - k0[0]) / h, u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * k0[1] + (u3 - 2 * u2 + u) * h * k0[2] + (-2 * u3 + 3 * u2) * k1[1] + (u3 - u2) * h * k1[2]; };
  const NV = 2;
  let SCHED = null;
  const build = () => { SCHED = LANES.map((L, li) => [0, 1].map((k) => schedule(li, PH[li] + k * P / NV, HL[KINDS[li][k]]))); };
  /* vehicle k of lane li at time t: {x, y, ang, alpha, kind} or null */
  const car = (li, k, t) => {
    if (!SCHED) build();
    const L = LANES[li], kf = SCHED[li][k], t0 = kf[0][0];
    const tau = ((t - t0) % P + P) % P + t0;
    let s = null;
    for (let rep = 0; rep < 2 && s == null; rep++) { const tt = tau + rep * P; if (tt > kf[kf.length - 1][0]) continue; for (let i = 0; i < kf.length - 1; i++) if (tt >= kf[i][0] && tt <= kf[i + 1][0]) { s = herm(kf[i], kf[i + 1], tt); break; } }
    if (s == null) return null;
    const r = range(L), vis = r[1] - r[0];
    if (s < 0 || s > vis) return null;
    const e = Math.min(s, vis - s) / 10, p = placeOf(L, s);
    return { x: p.x, y: p.y, ang: angOf(L), alpha: e < 1 ? Math.max(0.02, e) : null, kind: KINDS[li][k] };
  };
  return { G, P, WB, EB, LANE, LP, S_LANE, at, tram, trams, car, LANES, KINDS, HL, NV, TRAM_HL, TRAM_HW, CAR_HW, RED, obbPts,
    NT, setPhases(p) { PH = p.slice(); SCHED = null; }, get phases() { return PH; }, PHW, PHE, HOLD, S_WAIT, DW, DE, W_MOUTH };
})();
