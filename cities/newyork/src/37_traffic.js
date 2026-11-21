'use strict';
/* Manhattan traffic: one signal plan and a car-following timetable, both pure functions of t.
   Four one-way avenues run north-south (along y; north is +y, the lower left of the screen) and four one-way cross
   streets run east-west (along x; west is +x). Every junction has a 30 s cycle: avenue green, amber, all-red, cross
   green, amber, all-red. Along each avenue the offsets step by block length / wave speed, so the lights turn green
   block by block in the direction of travel: a platoon released at the first light meets green after green (the
   "green wave"), while cross-street cars stop and go. 5th Avenue (x = -50, southbound) is timed so its wave starts as
   the film's 'wave' shot lands.
   Cars follow the Intelligent Driver Model behind their leader and in front of red stop lines (an amber is run only
   when the car cannot stop comfortably). The model is simulated once at load for five 60 s periods with periodic
   arrivals; the cars that arrive in the fourth period are recorded (position every 1/30 s) and replayed forever, so
   a car's position is a pure function of t. tools/traffic_check.mjs checks offline that no two vehicles (or a vehicle
   and a pedestrian on a crosswalk) ever overlap. No engine globals are used here, so the check can load this file. */
const NYT = (function () {
  const CYC = 30, AG = 13, AA = 2.5, AR = 1.5, CG = 9, CA = 2.5, CR = 1.5;
  const PER = 2 * CYC, SPAN = 270, VIS = 184, BLOCK = 100, VW = 30;
  const AV = [{ x: -150, d: 1, name: '3rd' }, { x: -50, d: -1, name: '5th' }, { x: 50, d: 1, name: '6th' }, { x: 150, d: -1, name: '7th' }];
  const ST = [{ y: -150, d: 1 }, { y: -50, d: -1 }, { y: 50, d: 1 }, { y: 150, d: -1 }];
  const sh = (typeof SCENE !== 'undefined' && SCENE.shots) ? SCENE.shots.find((s) => s.name === 'wave') : null;
  const T_WAVE = sh ? sh.a / 30 + 1.2 : 1.2;        // 5th Avenue's first light turns green 1.2 s into the shot
  const AOFF = [7.0, T_WAVE - BLOCK / VW, 19.0, 26.5];
  const mod = (a, m) => ((a % m) + m) % m;
  /* junction (i avenue, j street): its offset (the start of the avenue green) */
  const offs = [];
  for (let i = 0; i < 4; i++) { offs.push([]); for (let j = 0; j < 4; j++) { const Y = ST[j].y, k = AV[i].d > 0 ? (Y + 150) / BLOCK : (150 - Y) / BLOCK; offs[i].push(mod(AOFF[i] + k * BLOCK / VW, CYC)); } }
  // 5th Avenue: its first light (59th) lets the pack in early, so it waits in full view at 42nd for the wave
  offs[1][3] = mod(T_WAVE - 9, CYC);
  /* light for an approach: which 'ave' or 'crs'; returns 'G' | 'A' | 'R' */
  function light(i, j, which, t) {
    const u = mod(t - offs[i][j], CYC);
    if (which === 'ave') return u < AG ? 'G' : u < AG + AA ? 'A' : 'R';
    const c = u - AG - AA - AR; return c >= 0 && c < CG ? 'G' : c >= CG && c < CG + CA ? 'A' : 'R';
  }
  /* pedestrian signals: crossing the avenue walks with the cross green, crossing the cross street with the avenue green.
     'W' walk, 'F' flashing hand (finish crossing), 'D' don't walk */
  function walk(i, j, crossing, t) {
    const u = mod(t - offs[i][j], CYC);
    if (crossing === 'crs') return u < AG - 5 ? 'W' : u < AG + AA ? 'F' : 'D';
    const c = u - AG - AA - AR; return c >= 0 && c < CG - 4 ? 'W' : c >= 0 && c < CG + CA ? 'F' : 'D';
  }
  /* the phase time (seconds into the avenue green) */
  const phaseT = (i, j, t) => mod(t - offs[i][j], CYC);

  /* ---------------- vehicles ---------------- */
  const TYPES = {
    cab: { L: 10.0, v0: 32, a: 13, b: 14 }, cabv: { L: 9.8, v0: 31, a: 12, b: 14 }, car: { L: 10.8, v0: 29, a: 10, b: 14 },
    black: { L: 10.8, v0: 30, a: 10, b: 14 }, bus: { L: 13.6, v0: 22, a: 5.5, b: 10 }, truck: { L: 12.8, v0: 24, a: 6, b: 10 },
    fire: { L: 14.8, v0: 30, a: 8, b: 12 }, bike: { L: 4.8, v0: 13, a: 5, b: 8 },
  };
  /* lanes: axis ('y' avenue / 'x' street), c (the lane's centre across the street, world), d, the junction list, arrivals */
  const LANES = [];
  const addLane = (L) => { L.id = LANES.length; LANES.push(L); return L; };
  // an avenue's cross-section, for southbound (d = -1); northbound mirrors it: bike lane on the left of travel,
  // a planted buffer beside it, two travel lanes, the red bus lane at the right-hand kerb
  const AVL = { bike: -11.0, buf: -7.0, t1: -1.6, t2: 4.4, bus: 10.2 };
  const pick = (seed, list) => list[Math.floor((((Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1) + 1) % 1 * list.length)];
  AV.forEach((A, i) => {
    const m = -A.d;                                                  // mirror for northbound
    const first = offs[i][A.d > 0 ? 0 : 3];                         // the first light met (the start of its green)
    const lanes = [['t1', 'trav'], ['t2', 'trav'], ['bus', 'bus'], ['bike', 'bike']];
    for (const [k, kind] of lanes) {
      const arr = [];
      if (kind === 'trav') {
        // most arrive during the first light's red and pile up behind it; a few come through on the green
        const n = i === 1 ? 5 : 3;
        for (let q = 0; q < 2; q++) for (let s = 0; s < n; s++) {
          const t = i === 1 ? q * CYC + first - 8 + s * 1.6 + (k === 't2' ? 0.8 : 0) : q * CYC + first + AG + 1.0 + s * 3.6 + (k === 't2' ? 0.9 : 0);
          const ty = i === 1 ? (s % 5 === 3 ? 'black' : s % 4 === 1 ? 'cabv' : 'cab') : pick(i * 31 + s * 7 + q * 3 + (k === 't2' ? 11 : 0), ['cab', 'cab', 'cab', 'cabv', 'car', 'black', 'cab', 'truck']);
          arr.push({ t: mod(t, PER), type: ty });
        }
        if (i === 2 && k === 't1') arr.push({ t: mod(first + 40, PER), type: 'fire' });
      } else if (kind === 'bus') arr.push({ t: mod(first + AG + 3 + i * 4, PER), type: 'bus' });
      else for (let s = 0; s < 4; s++) arr.push({ t: mod(first + s * 15 + 2 + i * 1.3, PER), type: 'bike' });
      addLane({ axis: 'y', c: A.x + m * AVL[k], d: A.d, ai: i, kind, arr: arr.sort((p, q) => p.t - q.t) });
    }
  });
  ST.forEach((S, j) => {
    // a Manhattan cross street: one travel lane between two lanes of parked cars
    for (const [c, dt] of [[0, 0]]) {
      const arr = [];
      for (let q = 0; q < 2; q++) for (let s = 0; s < 3; s++) arr.push({ t: mod(q * CYC + j * 5.3 + s * 7.5 + dt + (q ? 3.1 : 0), PER), type: pick(j * 17 + s * 5 + q * 2 + (c > 0 ? 9 : 0), ['cab', 'car', 'cab', 'truck', 'black', 'cabv', 'cab', 'car']) });
      addLane({ axis: 'x', c: S.y + c, d: S.d, sj: j, kind: 'crs', arr: arr.sort((p, q) => p.t - q.t) });
    }
  });
  // stop lines along each lane: s of the front at the line, which junction, which approach
  for (const L of LANES) {
    L.stops = [];
    if (L.axis === 'y') for (let j = 0; j < 4; j++) { const Y = ST[j].y; L.stops.push({ s: L.d * Y - 21 + SPAN, i: L.ai, j, which: 'ave' }); }
    else for (let i = 0; i < 4; i++) { const X = AV[i].x; L.stops.push({ s: L.d * X - 21 + SPAN, i, j: L.sj, which: 'crs' }); }
    L.stops.sort((p, q) => p.s - q.s);
  }

  /* ---------------- the simulation ---------------- */
  const DT = 1 / 30, NPER = 5, REC = 3, T0 = 0.75, S0 = 2.6;
  const tracks = [];   // { lane, type, ph (arrival phase in the period, s), D (duration s), s: Float32Array at 30 Hz }
  (function simulate() {
    const live = LANES.map(() => []), queue = LANES.map(() => []), qi = LANES.map(() => 0), END = 2 * SPAN;
    for (const L of LANES) for (let p = 0; p < NPER; p++) L.arr.forEach((a, k) => queue[L.id].push({ t: p * PER + a.t, type: a.type, period: p, slot: k }));
    for (const q of queue) q.sort((a, b) => a.t - b.t);
    const nSteps = Math.round((REC + 1) * PER / DT + 90 / DT), LT = new Array(32);
    let uid = 0;
    for (let n = 0; n <= nSteps; n++) {
      const t = n * DT;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { LT[(j * 4 + i) * 2] = light(i, j, 'ave', t); LT[(j * 4 + i) * 2 + 1] = light(i, j, 'crs', t); }
      for (const L of LANES) {
        const cars = live[L.id], q = queue[L.id], stops = L.stops;
        if (qi[L.id] < q.length && q[qi[L.id]].t <= t) {
          const a = q[qi[L.id]], ty = TYPES[a.type], last = cars[cars.length - 1];
          if (a.period > REC) qi[L.id] = q.length;
          else if (!last || last.s - last.L > ty.L + S0 + 1.5) {
            const jit = (((Math.sin((L.id * 37 + a.slot + 1) * 91.7) * 9871.3) % 1) + 1) % 1;
            const v0 = (L.kind === 'crs' ? Math.min(ty.v0, 22) : ty.v0) * (0.94 + 0.1 * jit);
            cars.push({ uid: uid++, type: a.type, L: ty.L, a: ty.a, b: ty.b, sab: 2 * Math.sqrt(ty.a * ty.b), v0, s: 0, v: last ? Math.min(v0 * 0.8, last.v + 2) : v0 * 0.8, t0: t, slot: a.slot, next: 0, amb: -1, rec: (a.period === REC) ? [] : null });
            qi[L.id]++;
          }
        }
        if (!cars.length) continue;
        for (let c = 0; c < cars.length; c++) {
          const car = cars[c], lead = c > 0 ? cars[c - 1] : null;
          let gap = 1e9, vl = car.v;
          if (lead) { gap = lead.s - lead.L - car.s; vl = lead.v; }
          if (car.next < stops.length) {
            const st = stops[car.next], lt = LT[(st.j * 4 + st.i) * 2 + (st.which === 'ave' ? 0 : 1)], dist = st.s - car.s;
            if (lt === 'G') car.amb = -1;
            else {
              let stop = true;
              if (lt === 'A') { if (car.amb === -1) car.amb = dist < car.v * car.v / 18 + car.v * 0.15 ? 1 : 0; stop = car.amb === 0; }
              else if (car.amb === 1) stop = false;
              if (stop && dist < gap) { gap = dist; vl = 0; }
            }
          }
          const ss = S0 + Math.max(0, car.v * T0 + car.v * (car.v - vl) / car.sab), r = car.v / car.v0;
          car.acc = Math.max(-60, car.a * (1 - r * r * r * r - (gap < 1e8 ? (ss / Math.max(gap, 0.05)) * (ss / Math.max(gap, 0.05)) : 0)));
        }
        for (const car of cars) {
          car.v = Math.max(0, car.v + car.acc * DT); car.s += car.v * DT;
          if (car.rec) car.rec.push(car.s);
          while (car.next < stops.length && car.s - 0.05 > stops[car.next].s) { car.next++; car.amb = -1; }
        }
        while (cars.length && cars[0].s - cars[0].L > END) {
          const c = cars.shift();
          if (c.rec) tracks.push({ lane: L, type: c.type, slot: c.slot, ph: c.t0 - REC * PER, D: c.rec.length / 30, s: Float32Array.from(c.rec), uid: c.uid });
        }
      }
    }
  })();

  /* world position of a lane point: s of the front -> centre of the vehicle */
  function place(L, s, len) {
    const w = (s - len / 2 - SPAN) * L.d;
    return L.axis === 'y' ? { x: L.c, y: w, ang: L.d > 0 ? Math.PI / 2 : -Math.PI / 2 } : { x: w, y: L.c, ang: L.d > 0 ? 0 : Math.PI };
  }
  /* the state of track k's m-th copy at time t (null when absent); copies cover overlapping periods */
  function copies(tr) { return Math.max(1, Math.ceil(tr.D / PER + 0.001)); }
  function at(tr, m, t) {
    const M = copies(tr), n = Math.floor((t - tr.ph) / PER), n2 = n - mod(n - m, M), tau = t - tr.ph - n2 * PER;
    if (tau < 0 || tau >= tr.D - 1 / 30) return null;
    const f = tau * 30, i = Math.floor(f), s = tr.s[i] + (tr.s[Math.min(i + 1, tr.s.length - 1)] - tr.s[i]) * (f - i);
    const len = TYPES[tr.type].L, p = place(tr.lane, s, len), along = (s - len / 2 - SPAN);
    if (Math.abs(along) > VIS) return null;
    p.alpha = Math.min(1, (VIS - Math.abs(along)) / 10); p.len = len; p.type = tr.type;
    return p;
  }
  /* ---------------- pedestrians at the corners ----------------
     Each junction has a few people who wait on its four corners and cross with the walk signal: across the cross street
     (along y) in the avenue's green, across the avenue (along x) in the cross green. Which corner a person stands on after
     each half of cycle n is a seeded bit, so where they are is a pure function of t. Slot k fixes where on a corner they
     stand, so two waiting people never share a spot. */
  const hb = (a, b, c) => { const v = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return v - Math.floor(v); };
  const pedN = (i, j) => ((i === 1 || i === 2) && (j === 1 || j === 2)) ? 9 : 4;
  const dirOf = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3);
  function ped(i, j, k, t) {
    const X = AV[i].x, Y = ST[j].y, id = i * 4 + j, du = 13.9 + (k % 3) * 1.65, dv = 13.9 + Math.floor(k / 3) * 1.65;
    const tt = t - offs[i][j], n = Math.floor(tt / CYC), u = tt - n * CYC;
    const bx = (m) => hb(id, k, m * 2 + 1) < 0.5 ? -1 : 1, by = (m) => hb(id, k, m * 2) < 0.5 ? -1 : 1;
    const sx0 = bx(n - 1), sy0 = by(n - 1), sy1 = by(n), sx1 = bx(n);
    const sp = 4.4 + hb(id, k, 7) * 1.3, tA = 0.3 + 0.12 * Math.floor(k / 3) + hb(id, k, 5) * 0.9, tC = AG + AA + AR + 0.3 + 0.12 * (k % 3) + hb(id, k, 6) * 0.9;
    const dA = 2 * dv / sp, dC = 2 * du / sp;
    const P = (sx, sy) => [X + sx * du, Y + sy * dv];
    const face = (sx, sy, nx, ny) => nx !== sx ? dirOf(-sx, 0) : ny !== sy ? dirOf(0, -sy) : dirOf(-sx * (k % 2), -sy * (1 - k % 2));
    let x, y, dir, walkd = -1;
    if (u < tA) { [x, y] = P(sx0, sy0); dir = face(sx0, sy0, sx0, sy1); }
    else if (u < tA + dA && sy1 !== sy0) { const f = (u - tA) / dA; x = X + sx0 * du; y = Y + sy0 * dv * (1 - 2 * f); dir = dirOf(0, -sy0); walkd = (u - tA) * sp; }
    else if (u < tC) { [x, y] = P(sx0, sy1); dir = face(sx0, sy1, sx1, sy1); }
    else if (u < tC + dC && sx1 !== sx0) { const f = (u - tC) / dC; x = X + sx0 * du * (1 - 2 * f); y = Y + sy1 * dv; dir = dirOf(-sx0, 0); walkd = (u - tC) * sp; }
    else { [x, y] = P(sx1, sy1); dir = face(sx1, sy1, bx(n + 1) === sx1 ? sx1 : sx1, by(n + 1)); }
    return { x, y, dir, walk: walkd >= 0, ph: walkd >= 0 ? Math.floor((walkd / 2.4) % 1 * 8) : 0 };
  }
  function peds(t) { const out = []; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < pedN(i, j); k++) out.push(ped(i, j, k, t)); return out; }
  return { ped, peds, pedN, AVL, CYC, AG, AA, AR, CG, CA, CR, PER, SPAN, VIS, AV, ST, offs, light, walk, phaseT, LANES, tracks, at, copies, TYPES, T_WAVE };
})();
if (typeof module !== 'undefined') module.exports = NYT;
