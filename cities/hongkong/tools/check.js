// Offline timetable check and search for Hong Kong's roads and harbour (node tools/check.js [search|water]).
// Loads src/37_timetable.js. Vehicles are axis-aligned boxes (all headings run along x or y); a pair overlaps when the
// boxes, grown by a margin, intersect while both are visible. "search" random-searches the car phases and tram
// offsets; "water" checks (and with "water search" searches) the harbour boats against the two Star Ferries.
const HT = require('../src/37_timetable.js');
const M = 0.9;
function roadBoxes(t) {
  const out = [];
  HT.CARS.forEach((c, i) => {
    const s = HT.carS(c, t); if (s == null) return;
    const hl = HT.HL[c.kind], hw = HT.HW[c.kind], p = HT.place(c.l, s, hl);
    if (HT.alpha(p.x, p.y, c.l) <= 0.02) return;
    const L = HT.LANES[c.l];
    out.push({ id: c.l + i, lane: c.l, b: L.ax === 'x' ? [p.x - hl, p.y - hw, p.x + hl, p.y + hw] : [p.x - hw, p.y - hl, p.x + hw, p.y + hl] });
  });
  for (const ln of ['TW', 'TE']) for (let k = 0; k < HT.TRAM.n; k++) {
    const q = HT.tram(ln, k, t); if (!q) continue;
    const hl = HT.HL.tram, hw = HT.HW.tram, p = HT.place(ln, q.s, hl);
    if (Math.abs(p.x) > HT.END) continue;
    out.push({ id: ln + k, lane: ln, b: [p.x - hl, p.y - hw, p.x + hl, p.y + hw] });
  }
  return out;
}
function checkRoads(verbose) {
  let bad = 0; const worst = [];
  for (let t = 0; t < HT.P; t += 0.05) {
    const B = roadBoxes(t);
    for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
      if (B[i].lane[0] === 'T' && B[j].lane[0] === 'T' && B[i].lane !== B[j].lane) continue;
      const a = B[i].b, b = B[j].b;
      const ox = Math.min(a[2], b[2]) - Math.max(a[0], b[0]) + M, oy = Math.min(a[3], b[3]) - Math.max(a[1], b[1]) + M;
      if (ox > 0 && oy > 0) { bad++; if (verbose && worst.length < 14) worst.push([t.toFixed(2), B[i].id, B[j].id, ox.toFixed(1), oy.toFixed(1)]); }
    }
  }
  if (verbose) console.log('road overlap samples:', bad, worst);
  return bad;
}
function waterBoxes(t) {
  const out = [], F = HT.FERRY;
  for (const f of ['A', 'B']) { const s = HT.ferry(f, t); out.push({ id: 'F' + f, b: [s.x - F.hw, s.y - F.hl, s.x + F.hw, s.y + F.hl] }); }
  HT.BOATS.forEach((bt, i) => { const s = HT.boat(bt, t); if (!s) return; out.push({ id: bt.kind + i, b: [s.x - bt.hl, s.y - bt.hw, s.x + bt.hl, s.y + bt.hw] }); });
  return out;
}
function checkWater(verbose) {
  let bad = 0; const worst = [];
  for (let t = 0; t < HT.WC; t += 0.05) {         // the boats' 40 s lap and the ferries' 40 s cycle
    const B = waterBoxes(t);
    for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
      const a = B[i].b, b = B[j].b;
      const ox = Math.min(a[2], b[2]) - Math.max(a[0], b[0]) + 1.4, oy = Math.min(a[3], b[3]) - Math.max(a[1], b[1]) + 1.4;
      if (ox > 0 && oy > 0) { bad++; if (verbose && worst.length < 14) worst.push([t.toFixed(2), B[i].id, B[j].id]); }
    }
  }
  if (verbose) console.log('water overlap samples:', bad, worst);
  return bad;
}
let seed = 98765; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const mode = process.argv[2];
if (mode === 'search') {
  let best = 1e9;
  const lanes = ['W', 'E', 'N', 'S'];
  for (let it = 0; it < 6000; it++) {
    for (const l of lanes) { const cs = HT.CARS.filter((c) => c.l === l), base = rnd() * HT.SPAN; cs.forEach((c, k) => { c.s0 = +((base + k * HT.SPAN / cs.length + (rnd() - 0.5) * 60 + HT.SPAN) % HT.SPAN).toFixed(1); }); }
    HT.TRAM.off.TW = +(rnd() * 16).toFixed(1); HT.TRAM.off.TE = +(rnd() * 16).toFixed(1);
    const b = checkRoads(false);
    if (b < best) { best = b; console.log(it, b, JSON.stringify(HT.CARS.map((c) => c.s0)), JSON.stringify(HT.TRAM.off)); if (b === 0) break; }
  }
} else if (mode === 'water') {
  if (process.argv[3] === 'search') {
    let best = 1e9;
    for (let it = 0; it < 4000; it++) {
      for (const l of ['W', 'E']) { const bs = HT.BOATS.filter((b) => b.ln === l), base = rnd() * HT.RIV.SPAN; bs.forEach((b, k) => { b.s0 = +((base + k * HT.RIV.SPAN / bs.length + (rnd() - 0.5) * 120 + HT.RIV.SPAN) % HT.RIV.SPAN).toFixed(1); }); }
      const b = checkWater(false);
      if (b < best) { best = b; console.log(it, b, JSON.stringify(HT.BOATS.map((q) => q.s0))); if (b === 0) break; }
    }
  } else checkWater(true);
} else { checkRoads(true); checkWater(true); }
