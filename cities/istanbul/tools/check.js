// Offline checks for Istanbul's timetables (node tools/check.js [search]).
// Loads src/35_scene.js and src/37_timetable.js into one context. Roads: every pair of vehicles (cars and tram
// sections) is tested over the 30 s period as chains of discs along their length; any overlap is a collision.
// Water: ferry hulls (rectangles) over the 90 s cycle must not overlap each other, must stay in the water, and their
// corners must keep out of the strip at the foot of a near bank that the bank's edge hides (5.7 u).
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', 'src');
const ctx = { console, Math, module: { exports: {} } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, '35_scene.js'), 'utf8') + '\nthis.SCENE = SCENE;', ctx);
vm.runInContext(fs.readFileSync(path.join(root, '37_timetable.js'), 'utf8') + '\nthis.IT = IT;', ctx);
const IT = ctx.IT;

function discs(st, hl, hw) { const out = [], ca = Math.cos(st.ang), sa = Math.sin(st.ang), n = Math.max(2, Math.ceil(hl / hw)); for (let i = 0; i <= n; i++) { const u = -hl + hw + (2 * hl - 2 * hw) * i / n; out.push([st.x + u * ca, st.y + u * sa]); } return out; }
function roadCheck(verbose) {
  const V = [];
  IT.CARS.forEach((c, i) => V.push({ id: c.r + i, kind: c.kind, st: (t) => IT.vehicle(c, t), hl: IT.HL[c.kind], hw: IT.HW[c.kind] }));
  IT.TRAMS.forEach((tr, i) => { for (let k = 0; k < tr.n; k++) V.push({ id: tr.r + '.' + k, tram: tr.r, st: (t) => IT.tramSec(tr, k, t), hl: IT.HL.tram, hw: IT.HW.tram }); });
  let bad = 0; const worst = [];
  for (let t = 0; t < IT.PR; t += 0.05) {
    const S = V.map((v) => { const s = v.st(t); return s && Math.abs(s.x) < IT.END + 8 && Math.abs(s.y) < IT.END + 8 ? discs(s, v.hl, v.hw) : null; });
    for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) {
      if (!S[i] || !S[j] || (V[i].tram && V[i].tram === V[j].tram)) continue;
      const r = V[i].hw + V[j].hw + 0.6; let hit = false;
      for (const a of S[i]) { for (const b of S[j]) if (Math.hypot(a[0] - b[0], a[1] - b[1]) < r) { hit = true; break; } if (hit) break; }
      if (hit) { bad++; if (verbose && worst.length < 10) worst.push([t.toFixed(2), V[i].id, V[j].id]); }
    }
  }
  if (verbose) console.log('road overlap samples:', bad, JSON.stringify(worst));
  return bad;
}
const WL = IT.WL;
function inWater(x, y) {
  if (y >= -72 && y <= -28 && x <= 72) return true;
  if (x >= 28 && x <= 72) return true;
  if (x >= 72 && y >= -37 && y <= 37) return true;
  return false;
}
function hidden(x, y) {
  if (x < 28 && y > -28 - 5.7 && y <= -28) return true;                       // Horn, south (near) bank
  if (x > 72 - 5.7 && x <= 72 && (y < -37 || y > 37)) return true;            // Bosphorus, east (near) bank
  if (x > 72 && y > 37 - 5.7 && y <= 37) return true;                         // the bay's south bank
  return false;
}
function corners(s, hl, hw) { const ca = Math.cos(s.ang), sa = Math.sin(s.ang), o = []; for (const u of [-hl, 0, hl]) for (const v of [-hw, hw]) o.push([s.x + u * ca - v * sa, s.y + u * sa + v * ca]); return o; }
function waterCheck(verbose) {
  const F = [['A', 9.5, 2.6], ['B', 9.5, 2.6], ['D1', 6.8, 2.1], ['D2', 6.8, 2.1]];
  let bad = 0, shore = 0; const worst = [], sw = [];
  for (let t = 0; t < IT.WC; t += 0.1) {
    const S = F.map(([r, hl, hw]) => { const s = IT.ferry(r, t); return s ? { s, hl, hw, r } : null; });
    for (const q of S) if (q) for (const [x, y] of corners(q.s, q.hl, q.hw)) if (!inWater(x, y) || hidden(x, y)) { if (Math.abs(x) > 158 || Math.abs(y) > 158) continue; shore++; if (verbose && sw.length < 8) sw.push([t.toFixed(1), q.r, x.toFixed(1), y.toFixed(1)]); }
    for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) {
      const a = S[i], b = S[j]; if (!a || !b) continue;
      const da = discs(a.s, a.hl, a.hw), db = discs(b.s, b.hl, b.hw), r = a.hw + b.hw + 1.0; let hit = false;
      for (const p of da) { for (const q of db) if (Math.hypot(p[0] - q[0], p[1] - q[1]) < r) { hit = true; break; } if (hit) break; }
      if (hit) { bad++; if (verbose && worst.length < 10) worst.push([t.toFixed(1), a.r, b.r]); }
    }
  }
  if (verbose) { console.log('ferry overlap samples:', bad, JSON.stringify(worst)); console.log('ferry shore samples:', shore, JSON.stringify(sw)); }
  return bad + shore;
}
if (process.argv[2] === 'search') {
  let seed = 777; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  let best = roadCheck(false), bestP = IT.CARS.map((c) => c.s0).concat([IT.TRAMS[1].s0]);
  console.log('start', best);
  for (let it = 0; it < 3000 && best > 0; it++) {
    const keep = IT.CARS.map((c) => c.s0).concat([IT.TRAMS[1].s0]);
    IT.CARS.forEach((c) => { if (rnd() < 0.4) c.s0 = +(rnd() * IT.SPAN).toFixed(1); });
    if (rnd() < 0.3) IT.TRAMS[1].s0 = +(rnd() * IT.SPAN).toFixed(1);
    const b = roadCheck(false);
    if (b <= best) { if (b < best) console.log(it, b); best = b; bestP = IT.CARS.map((c) => c.s0).concat([IT.TRAMS[1].s0]); }
    else { IT.CARS.forEach((c, i) => { c.s0 = keep[i]; }); IT.TRAMS[1].s0 = keep[keep.length - 1]; }
  }
  console.log('best', best, JSON.stringify(bestP));
} else if (process.argv[2] === 'water') {
  let best = 1e9, bp = null;
  for (let b = 0; b < 90; b += 1.5) for (let d = 0; d < 90; d += 1.5) { IT._off = null; IT.OFF.B = b; IT.OFF.D2 = d; const s = waterCheck(false); if (s < best) { best = s; bp = [b, d]; } }
  console.log('best', best, bp);
} else { roadCheck(true); waterCheck(true); }
if (process.argv[2] === 'at') { const t = +process.argv[3]; for (const r of ['A', 'B', 'D1', 'D2']) { const s = IT.ferry(r, t); console.log(r, s && [s.x.toFixed(1), s.y.toFixed(1), s.ang.toFixed(2), s.label]); } }
