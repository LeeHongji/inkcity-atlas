'use strict';
/* London's timetables: pure functions of time, no drawing (tools/check.js loads this file in node to search for
   collisions). World coordinates, u and seconds.
   - The 100 s Tower Bridge cycle: two lifts, the tall ship inbound (west) through lift 1, turning in the Pool of London
     in front of the Tower, outbound (east) through lift 2.
   - Road lanes, left-hand traffic: free-flow lanes are periodic (25 s); the two Tower Bridge lanes queue at their stop
     lines while the bridge is up and discharge one car after another when it comes down.
   - River lanes: westbound boats keep to the north (y 33.6), eastbound to y 40.8, all at one speed per lane. */
const LT = {};
LT.CYC = 100;
LT.END = 166;
LT.V = 332 / 25;                       // road speed: one lap of a free lane in 25 s
LT.RIV = { N: 30, S: 70, WL: -4.5, RW: 32.9, RE: 36.6, SHIP: 50 };
LT.TB = { x0: 40, x1: 60, n0: 39.2, n1: 46, s0: 54, s1: 60.8, walk: 18.5, lane: 4.2 };   // Tower Bridge: towers [n0,n1], [s0,s1]
LT.WB = { x0: -63, x1: -37, arches: [[30.8, 39.4], [40.4, 47.0], [48, 54.6], [55.6, 62.2], [63.2, 69.8]] };

const clampT = (t) => Math.max(0, Math.min(1, t)), lerpT = (a, b, t) => a + (b - a) * t, smoothT = (t) => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
const modT = (a, n) => ((a % n) + n) % n;

/* the cycle clock: offset so that the film's Tower Bridge shot opens as lift 1 begins */
LT.off = function () {
  if (LT._off != null) return LT._off;
  let off = 0;
  if (typeof SCENE !== 'undefined') { const sh = SCENE.shots.find((s) => s.name === 'tbridge'); if (sh) off = modT(LT.LIFT[0].t0 - 0.6 - sh.a / 30, LT.CYC); }
  return (LT._off = off);
};
LT.tc = (t) => modT(t + LT.off(), LT.CYC);

/* ---------------- the tall ship ---------------- */
const SV = 8.5, SA = 8.5 * 8.5 / 70, BOW = 9.5, STERN = 7, PX = -5;          // speed, acceleration, bow / stern from the centre, pivot x
const S_T1 = 18;                                                    // lift 1 barrier time
const S = {};
S.tB1 = S_T1 + 3.6;                       // bow at the bridge's east edge (x 63)
S.tD = S.tB1 + (72.5 - 30) / SV;          // centre at x 30: starts to slow
S.tStop = S.tD + SV / SA;                 // stopped at x PX
S.tP0 = S.tStop + 1.0; S.tP1 = S.tStop + 13.0;  // pivot, bow swinging through south
S.tGo = S.tStop + 14.0;
S.uB2 = Math.sqrt(2 * (27.5 - PX) / SA);  // time after tGo when the bow reaches x 37 (still accelerating)
S.tB2 = S.tGo + S.uB2;
S.tE2 = S.tGo + SV / SA + (70 - 30) / SV; // stern clears x 63
S.tE1 = S.tB1 + (72.5 - 30) / SV;         // inbound: stern clears x 37
LT.S = S;
/* ship state at cycle time tc: centre x, y, bow heading ang, alpha (fades at the map's east end) */
LT.ship = function (tc) {
  const y = LT.RIV.SHIP; let x, ang = Math.PI;
  if (tc < S.tD) x = 72.5 - SV * (tc - S.tB1);
  else if (tc < S.tStop) { const u = tc - S.tD; x = 30 - SV * u + SA * u * u / 2; }
  else if (tc < S.tGo) { x = PX; ang = Math.PI - Math.PI * smoothT((tc - S.tP0) / (S.tP1 - S.tP0)); }
  else {
    ang = 0; const u = tc - S.tGo, ua = SV / SA;
    x = u < ua ? PX + SA * u * u / 2 : 30 + SV * (u - ua);
  }
  if (x > 200) return null;
  const a = Math.min(1, (192 - x) / 22);
  if (a <= 0.02) return null;
  return { x, y, ang, alpha: a < 1 ? a : null };
};

/* ---------------- the lifts ---------------- */
LT.LIFT = [
  { t0: S_T1, up: S_T1 + 1.0, top: S_T1 + 3.5, down: S.tE1 + 0.3, flat: S.tE1 + 2.8, green: S.tE1 + 3.3 },
];
{ const t0 = S.tB2 - 3.6; LT.LIFT.push({ t0, up: t0 + 1.0, top: t0 + 3.5, down: S.tE2 + 0.3, flat: S.tE2 + 2.8, green: S.tE2 + 3.3 }); }
/* how far the bascules are raised, 0 (down) .. 1 (up, 82 degrees) */
LT.leaf = function (tc) {
  for (const L of LT.LIFT) {
    if (tc >= L.up && tc < L.top) return smoothT((tc - L.up) / (L.top - L.up));
    if (tc >= L.top && tc < L.down) return 1;
    if (tc >= L.down && tc < L.flat) return 1 - smoothT((tc - L.down) / (L.flat - L.down));
  }
  return 0;
};
/* barriers down (traffic must stop) */
LT.barrier = function (tc) { for (const L of LT.LIFT) if (tc >= L.t0 && tc < L.green) return true; return false; };

/* ---------------- road lanes ---------------- */
/* lane: { ax: 'x'|'y', c: offset, d: +1|-1 }; a vehicle's front s along its heading, from -END to END */
const VB = LT.V, AB = 9, AA = 5.5;     // braking and pulling-away accelerations
LT.mod = modT;
LT.HL = { bus: 7.0, cab: 4.8, van: 5.4, car: 5.3 };
/* a free lane's vehicle: front s at cycle time tc, from its phase s0 (the lap is 25 s, four laps a cycle) */
LT.freeS = (s0, tc) => modT(s0 + VB * tc + LT.END, 2 * LT.END) - LT.END;
/* the road plan. Lanes (left-hand traffic): ax 'y' runs along y at x = c, ax 'x' along x at y = c; d the heading.
   free: periodic lanes, phases s0 searched by tools/check.js. bridge: the Tower Bridge lanes, entry times te. */
LT.ROAD = {
  free: [
    { ax: 'y', c: -42, d: 1, cars: [{ kind: 'bus', s0: -45 }, { kind: 'cab', s0: 65 }, { kind: 'car', s0: 175 }] },
    { ax: 'y', c: -58, d: -1, cars: [{ kind: 'cab', s0: 30 }, { kind: 'bus', s0: 140 }, { kind: 'van', s0: 250 }] },
    { ax: 'x', c: -58, d: 1, cars: [{ kind: 'bus', s0: 46.5 }, { kind: 'cab', s0: 107 }, { kind: 'car', s0: 320.5 }] },
    { ax: 'x', c: -42, d: -1, cars: [{ kind: 'cab', s0: 109.5 }, { kind: 'car', s0: 186.5 }, { kind: 'bus', s0: 305.5 }] },
  ],
  bridge: [
    { ax: 'y', c: 58, d: 1, stop: 26, entries: [{ te: 1, kind: 'bus' }, { te: 6, kind: 'cab' }, { te: 15, kind: 'car' }, { te: 26, kind: 'cab' }, { te: 34, kind: 'bus' }, { te: 49, kind: 'van' }, { te: 61, kind: 'cab' }, { te: 70, kind: 'bus' }, { te: 82, kind: 'car' }, { te: 91, kind: 'cab' }] },
    { ax: 'y', c: 42, d: -1, stop: -74, entries: [{ te: 5, kind: 'cab' }, { te: 13, kind: 'bus' }, { te: 22, kind: 'car' }, { te: 31, kind: 'cab' }, { te: 40, kind: 'van' }, { te: 57.5, kind: 'bus' }, { te: 63.5, kind: 'cab' }, { te: 76.5, kind: 'car' }, { te: 88.5, kind: 'bus' }, { te: 95, kind: 'cab' }] },
  ],
};
/* the Tower Bridge lanes narrow onto the bridge: lateral offset from the street's centre line at y */
LT.bOff = (y) => { const f = y < 30 ? clampT((y - 12) / 18) : y > 70 ? clampT((88 - y) / 18) : 1; return lerpT(8, LT.TB.lane, smoothT(f)); };
const QL = [];
LT._clearQ = () => { QL.length = 0; };
LT.qlaneOf = (li) => QL[li] || (QL[li] = LT.qlane(LT.ROAD.bridge[li].stop, LT.ROAD.bridge[li].entries.map((e) => ({ te: e.te, hl: LT.HL[e.kind] }))));
/* Tower Bridge lanes: a car enters at cycle time te with half-length hl; returns its front s at cycle time tc
   (or null when it is not on the lane). Queues: cars that would reach the stop line while the barrier is down stop
   behind each other and leave one by one when it lifts. Computed per lane for the whole cycle and cached. */
LT.qlane = function (stop, entries) {
  // entries: [{te, hl}] sorted by te. Build every trip for the cycles n-1 and n (trips last < 60 s).
  const trips = [];
  const reds = []; for (let n = -1; n <= 1; n++) for (const L of LT.LIFT) reds.push([L.t0 + n * LT.CYC, L.green + n * LT.CYC]);
  for (let n = -1; n <= 0; n++) {
    const q = {}; // queue counts per red
    let prevLeave = -1e9;
    entries.forEach((e, k) => {
      const te = e.te + n * LT.CYC, gap = 1.8;
      const free = (t) => -LT.END + VB * (t - te);
      const tFree = te + (stop + LT.END) / VB;                 // front reaches the stop line freely
      let trip = { te, hl: e.hl, stop: null };
      for (let ri = 0; ri < reds.length; ri++) {
        const [r0, r1] = reds[ri];
        if (tFree > r0 - 0.4 && tFree < r1 + 2.5 + (q[ri] || 0) * 1.1) {
          const idx = q[ri] || 0; q[ri] = idx + 1;
          let p = stop; for (let j = 0; j < idx; j++) p -= 2 * (q['hl' + ri + '.' + j] || 5.3) + gap;
          q['hl' + ri + '.' + idx] = e.hl;
          const tArr = te + (p + LT.END) / VB + VB / (2 * AB);
          const tDep = Math.max(r1 + idx * 1.1, tArr + 0.3);
          trip.stop = { p, tArr, tDep };
          break;
        }
      }
      trips.push(trip); void prevLeave; void free;
    });
  }
  const at = (tr, t) => {
    if (t < tr.te) return null;
    if (!tr.stop) { const s = -LT.END + VB * (t - tr.te); return s > LT.END + 12 ? null : s; }
    const { p, tArr, tDep } = tr.stop, Tb = VB / AB;
    if (t < tArr - Tb) return -LT.END + VB * (t - tr.te);
    if (t < tArr) { const u = tArr - t; return p - AB * u * u / 2; }
    if (t < tDep) return p;
    const u = t - tDep, Ta = VB / AA;
    const s = u < Ta ? p + AA * u * u / 2 : p + VB * Ta / 2 + VB * (u - Ta);
    return s > LT.END + 12 ? null : s;
  };
  return { trips, at, front(k, tc) {          // vehicle k's front at cycle time tc (the trip of this cycle or the last)
    const n = entries.length;
    for (const tr of [trips[n + k], trips[k]]) { const s = at(tr, tc); if (s != null) return { s, hl: tr.hl, moving: !tr.stop || tc < tr.stop.tArr - 0.05 || tc > tr.stop.tDep }; }
    return null;
  } };
};

/* ---------------- river lanes ---------------- */
LT.RV = 9;                                  // river bus speed
LT.RSPAN = 380;                             // x from -190 to 190
LT.boatX = (s0, dir, t) => { const s = modT(s0 + LT.RV * t, LT.RSPAN) - LT.RSPAN / 2; return dir > 0 ? s : -s; };

if (typeof module !== 'undefined') module.exports = LT;
