// Offline timetable search and check for London's roads and river (node tools/check.js [search]).
// Loads src/37_timetable.js; vehicles are axis-aligned boxes (all headings are along x or y); a pair overlaps when the
// boxes, grown by a margin, intersect. Prints the worst overlaps; with "search", random-searches the free lanes' phases.
const LT = require('../src/37_timetable.js');
const R = LT.ROAD;
const HW = { bus: 2.5, cab: 2.35, van: 2.45, car: 2.55 };
const M = 0.9;
function vehicles(Rd) {
  const out = [];
  Rd.free.forEach((ln, li) => ln.cars.forEach((c, k) => out.push({ ln, kind: c.kind, hl: LT.HL[c.kind], hw: HW[c.kind], s: (t) => LT.freeS(c.s0, t), id: 'F' + li + '.' + k })));
  Rd.bridge.forEach((ln, li) => { const Q = LT.qlaneOf(li); ln.entries.forEach((e, k) => out.push({ ln, kind: e.kind, hl: LT.HL[e.kind], hw: HW[e.kind], s: (t) => { const f = Q.front(k, LT.mod(t, LT.CYC)); return f ? f.s : null; }, id: 'B' + li + '.' + k })); });
  return out;
}
function box(v, t) {
  const s = v.s(t); if (s == null || Math.abs(s) > LT.END + 8) return null;
  const ln = v.ln, cAlong = ln.d * (s - v.hl);
  return ln.ax === 'y' ? [ln.c - v.hw, cAlong - v.hl, ln.c + v.hw, cAlong + v.hl] : [cAlong - v.hl, ln.c - v.hw, cAlong + v.hl, ln.c + v.hw];
}
function check(Rd, verbose) {
  const V = vehicles(Rd); let bad = 0, worst = [];
  for (let t = 0; t < LT.CYC; t += 0.05) {
    const B = V.map((v) => box(v, t));
    for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) {
      const a = B[i], b = B[j]; if (!a || !b) continue;
      const ox = Math.min(a[2], b[2]) - Math.max(a[0], b[0]) + M, oy = Math.min(a[3], b[3]) - Math.max(a[1], b[1]) + M;
      if (ox > 0 && oy > 0) { bad++; if (verbose && worst.length < 12) worst.push([t.toFixed(2), V[i].id, V[j].id, ox.toFixed(1), oy.toFixed(1)]); }
    }
  }
  if (verbose) console.log('overlap samples:', bad, worst);
  return bad;
}
if (process.argv[2] === 'search') {
  let seed = 12345; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  let best = 1e9, bestP = null;
  for (let it = 0; it < 4000; it++) {
    for (const ln of R.free) { const n = ln.cars.length, base = rnd() * 2 * LT.END; ln.cars.forEach((c, k) => { c.s0 = +(base + k * 2 * LT.END / n + (rnd() - 0.5) * 40).toFixed(2); }); }
    const b = check(R, false);
    if (b < best) { best = b; bestP = R.free.map((ln) => ln.cars.map((c) => c.s0)); console.log(it, b, JSON.stringify(bestP)); if (b === 0) break; }
  }
} else check(R, true);
// coordinate descent: node tools/check.js descend
if (process.argv[2] === 'descend') {
  const params = [];
  R.free.forEach((ln) => ln.cars.forEach((c) => { const c0 = c.s0; params.push({ get: () => c.s0, set: (v) => { c.s0 = v; }, lo: c0 - 45, hi: c0 + 45, step: 1.5 }); }));
  R.bridge.forEach((ln, li) => ln.entries.forEach((e) => params.push({ get: () => e.te, set: (v) => { e.te = v; }, lo: e.te - 3, hi: e.te + 3, step: 0.5, bridge: li })));
  const reset = () => { for (const k of Object.keys(require.cache)) {} };
  const score = () => { LT._clearQ(); return check(R, false); };
  let cur = score(); console.log('start', cur);
  for (let pass = 0; pass < 6 && cur > 0; pass++) {
    for (const p of params) {
      const keep = p.get(); let best = cur, bv = keep;
      for (let v = p.lo; v <= p.hi; v += p.step) { p.set(+v.toFixed(2)); const s = score(); if (s < best) { best = s; bv = +v.toFixed(2); } }
      p.set(bv); cur = best;
    }
    console.log('pass', pass, cur);
  }
  console.log(JSON.stringify(R.free.map((ln) => ln.cars.map((c) => c.s0))));
  console.log(JSON.stringify(R.bridge.map((ln) => ln.entries.map((e) => e.te))));
}
