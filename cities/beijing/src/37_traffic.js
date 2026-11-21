'use strict';
/* Beijing's traffic and the flag ceremony clock, as pure functions of t (shared by the streets tile, the gate, the
   square, and tools/traffic.mjs, which searched the phases below offline for a collision-free timetable).
   Right-hand traffic. Each street (26 u) has a car lane each way at 4 u from the centre line and a bike lane each way
   at 10 u (the outer lanes, by the kerb): heading +x the right is +y, so along x the +x lanes are on the +y side;
   along y the +y lanes are on the -x side.
   The flag ceremony (cycle 120 s): the honour guard marches out of the Tiananmen gate's central doorway (global
   y 30), across Chang'an Avenue (the street at y = 50) to the flagpole in the square (y 86), raises the flag, stands
   by it, lowers it at the end of the day and marches back. Every lane of Chang'an Avenue is held at red while the
   guard crosses: those vehicles follow a car-following model (each keeps a gap behind the one ahead and stops at the
   stop line while the light is red), all other lanes are simple periodic loops. */
const BJF = (function () {
  const CYC = 120, sh = (typeof SCENE !== 'undefined') ? SCENE.shots.find((s) => s.name === 'tiananmen') : null;
  const OFF = sh ? 4.2 - sh.a / 30 : 0;                       // the crossing shot opens with the head of the column on the road
  const F = {
    CYC, OFF,
    VW: 5.5, Y0: 30, YH: 81.0, POLE: 86,                     // march speed, the doorway, the head row's halt, the pole (global y)
    OUT: 2.0, BACK: 104.0,                                    // the head row steps out / the column turns back
    RAISE: [13.0, 19.5], LOWER: [94.5, 101.5],                // the flag goes up / comes down
    HOLD: [[1.0, 11.6], [103.2, 114.0]],                      // Chang'an Avenue red for vehicles
    ROWS: 9, RS: 2.0,                                         // the bearer's row and eight rows of three
  };
  F.cyc = (t) => (((t + OFF) % CYC) + CYC) % CYC;
  F.n = (t) => Math.floor((t + OFF) / CYC);
  /* the flag's height on its rope, 0 (down) .. 1 (top) */
  F.flagH = (tc) => tc < F.RAISE[0] ? 0 : tc < F.RAISE[1] ? (tc - F.RAISE[0]) / (F.RAISE[1] - F.RAISE[0]) : tc < F.LOWER[0] ? 1 : tc < F.LOWER[1] ? 1 - (tc - F.LOWER[0]) / (F.LOWER[1] - F.LOWER[0]) : 0;
  return F;
})();

const BJT = (function () {
  const END = 137, SPAN = 2 * END, VC = 13.7, VB = 6.85;    // car loop 20 s, bike loop 40 s
  const T = { END, SPAN, VC, VB, lanes: [], vehicles: [] };
  // [axis ('x' = the street runs along x), street centre c, offset of the lane from the centre, direction ±1, kind]
  // lane offset sign: along x, +x traffic at +4 / +10; along y, +y traffic at -4 / -10.
  const L = [];
  for (const c of [-50, 50]) {
    L.push(['x', c, 4, 1, 'car'], ['x', c, -4, -1, 'car'], ['x', c, 10, 1, 'bike'], ['x', c, -10, -1, 'bike']);
    L.push(['y', c, -4, 1, 'car'], ['y', c, 4, -1, 'car'], ['y', c, -10, 1, 'bike'], ['y', c, 10, -1, 'bike']);
  }
  T.lanes = L;
  const SIZE = { car: [5.3, 2.55], taxi: [5.0, 2.45], bus: [6.8, 2.6], van: [6.0, 2.5], bike: [3.8, 0.7], ebike: [3.9, 0.9], tri: [3.3, 1.4] };
  T.SIZE = SIZE;
  const CARK = ['taxi', 'car', 'bus', 'taxi', 'car', 'van', 'taxi', 'car'], BIKEK = ['bike', 'ebike', 'tri', 'bike', 'ebike', 'bike'];
  // phases (searched offline by tools/traffic.mjs): one per lane, in seconds
  T.PH = [3.873,0.17,2.518,28.961,0.798,4.555,16.166,7.644,8.043,12.987,21.718,3.842,14.948,4.969,1.578,28.828,2.993,0.799,4.825,2.031,1.416,2.903,0.049,0.713];
  const held = (ln) => ln[0] === 'x' && ln[1] === 50;          // Chang'an Avenue
  // smooth minimum: the position cannot pass c; it eases in over L0 u (decelerating like a braking car)
  const smin = (f, c, L0) => f <= c - L0 ? f : c - L0 * Math.exp(-(f - c + L0) / L0);
  /* one held lane: slots entering every `gap` seconds; the car-following model, cached per t */
  function heldLane(li) {
    const ln = L[li], bike = ln[4] === 'bike', V = bike ? VB : VC, every = bike ? 40 : 20, nS = BJF.CYC / every, life = SPAN / V;
    const kinds = []; for (let j = 0; j < nS; j++) kinds.push(bike ? BIKEK[(j * 5 + li) % BIKEK.length] : CARK[(j * 3 + li) % CARK.length]);
    const stop = -9, gapU = bike ? 1.6 : 2.2, A = bike ? 4 : 8, ta = V / A;
    // extra slots that reach the stop line just after it turns red (one bike, two cars per hold), numbered from nS
    const EXTRA = []; BJF.HOLD.forEach(([h0], k) => { const nq = 1; for (let q = 0; q < nq; q++) { const kind = bike ? 'bike' : (li % 2 ? 'taxi' : 'car'), hl = SIZE[kind][0]; EXTRA.push({ e0: h0 + 1.2 + q * 2.6 - (stop - hl + END) / V, kind }); kinds.push(kind); } });
    let cacheT = NaN, cache = null;
    // the cap from the red lights: before red, nothing; while red, the stop line; after green, the queue pulls away
    const capAt = (tc, front0, hl) => {      // tc: cycle time of the absolute moment; front0: free front position at each hold start
      let cap = Infinity;
      for (let m = -1; m <= 1; m++) for (const [h0, h1] of BJF.HOLD) {
        const H0 = h0 + m * BJF.CYC, H1 = h1 + m * BJF.CYC; if (tc < H0) continue;
        const f0 = front0(H0);                                // where its front would be at the moment the light turns red
        if (f0 > stop - V * 1.0) continue;                    // already within a second of the line: it goes through
        const u = tc - H1 - T.PH[20 + li - 8], run = u <= 0 ? 0 : u < ta ? 0.5 * A * u * u : 0.5 * A * ta * ta + V * (u - ta);
        cap = Math.min(cap, stop - hl + run);
      }
      return cap;
    };
    function all(t) {
      if (t === cacheT) return cache;
      const n = BJF.n(t), tc = BJF.cyc(t), out = [];
      // the slots of this cycle and of the previous one (still on the road), oldest first
      const list = [];
      for (const m of [-1, 0]) for (let j = 0; j < nS + EXTRA.length; j++) { const e = (j < nS ? T.PH[li] + j * every : EXTRA[j - nS].e0 + T.PH[16 + li - 8]) + m * BJF.CYC; if (tc >= e && tc < e + life + 30) list.push({ j, e, m }); }
      list.sort((a, b) => a.e - b.e);
      let lead = null;
      for (const s of list) {
        const kind = kinds[s.j], hl = SIZE[kind][0];
        const free = (tt) => -END + V * (tt - s.e);
        let p = free(tc);
        const cap = capAt(tc, (H) => free(H) + hl, hl);
        p = smin(p, cap, bike ? 2.5 : 4);
        if (lead != null) p = smin(p, lead.p - lead.hl - hl - gapU, bike ? 2 : 3);
        if (p > END + hl) { lead = null; continue; }
        out.push({ j: s.j, p, kind, hl }); lead = { p, hl };
      }
      cacheT = t; cache = out; return out;
    }
    return { all, nS, kinds, nE: EXTRA.length };
  }
  // build the vehicle list: every vehicle is { li, at(t) -> {x, y, ang, kind, alpha} | null }
  L.forEach((ln, li) => {
    const [ax, c, off, d, type] = ln, ang = ax === 'x' ? (d > 0 ? 0 : Math.PI) : (d > 0 ? Math.PI / 2 : -Math.PI / 2);
    const place = (p, kind) => {   // p: position along the heading from -END to END
      const fade = Math.min(1, (END - Math.abs(p)) / 12); if (fade <= 0.03) return null;
      const s = d * p; return { x: ax === 'x' ? s : c + off, y: ax === 'x' ? c + off : s, ang, kind, alpha: fade < 1 ? fade : null };
    };
    if (held(ln)) {
      const H = heldLane(li), nA = 2;   // actors, each serving every nA-th regular slot, and one per extra slot
      for (let a = 0; a < nA; a++) T.vehicles.push({ li, held: true, at(t) { const v = H.all(t).find((q) => q.j < H.nS && q.j % nA === a); return v ? place(v.p, v.kind) : null; } });
      for (let x = 0; x < H.nE; x++) T.vehicles.push({ li, held: true, at(t) { const v = H.all(t).find((q) => q.j === H.nS + x); return v ? place(v.p, v.kind) : null; } });
    } else {
      const V = type === 'bike' ? VB : VC;
      for (let k = 0; k < 2; k++) {
        const kind = type === 'bike' ? BIKEK[(li * 2 + k * 3) % BIKEK.length] : CARK[(li * 3 + k * 5) % CARK.length];
        T.vehicles.push({ li, at(t) { const p = ((((T.PH[li] * V + k * SPAN / 2 + V * t) % SPAN) + SPAN) % SPAN) - END; return place(p, kind); } });
      }
    }
  });
  return T;
})();
