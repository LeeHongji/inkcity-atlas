// Offline search for boat-lane phases: no two hulls (boxes with a margin) ever overlap, at the junctions, the canal
// mouths and the stops. Reads the lanes from src/38_canals.js; prints phases to paste into VN.PH.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '../src/38_canals.js'), 'utf8');
const VN = { WL: -2 }; const clamp = (v, a, b) => Math.max(a, Math.min(b, v)); const lerp = (a, b, t) => a + (b - a) * t;
new Function('VN', 'clamp', 'lerp', src)(VN, clamp, lerp);
VN.BOAT = { gondola: { L: 6.0, W: 0.78 }, vaporetto: { L: 8.4, W: 2.0 }, topo: { L: 4.6, W: 1.45 }, rifiuti: { L: 5.0, W: 1.6 }, ambulanza: { L: 4.0, W: 1.3 }, taxi: { L: 3.9, W: 1.25 }, sandolo: { L: 3.6, W: 0.8 } };
const LN = VN.LANES, M = 1.6, extraL = { gondola: 1.2, vaporetto: 0.6 };
const boxes = (t) => { const out = []; LN.forEach((ln, li) => ln.boats.forEach((kd, k) => { const s = VN.boatAt(ln, k, t); if (s.alpha <= 0.02) return; const B = VN.BOAT[kd], hl = B.L + (extraL[kd] || 0.4), hw = B.W + 0.4; out.push({ li, x: s.x, y: s.y, hx: ln.ax === 'x' ? hl : hw, hy: ln.ax === 'x' ? hw : hl }); })); if (VN.traghetto) for (const b of VN.traghetto(t)) out.push(b); return out; };
function bad(ph, detail) {
  LN.forEach((ln, i) => { ln.ph = ph[i]; });
  let worst = 0;
  for (let t = 0; t < VN.P; t += 0.1) {
    const v = boxes(t);
    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) {
      const a = v[i], b = v[j]; if (a.li === b.li) continue; if (LN[a.li] && LN[b.li] && LN[a.li].ax === LN[b.li].ax && LN[a.li].c === LN[b.li].c) continue;
      const ox = a.hx + b.hx + M - Math.abs(a.x - b.x), oy = a.hy + b.hy + M - Math.abs(a.y - b.y);
      if (ox > 0 && oy > 0) { worst += Math.min(ox, oy); if (detail) console.log('t', t.toFixed(1), LN[a.li] ? LN[a.li].id : a.li, LN[b.li] ? LN[b.li].id : b.li, a.x.toFixed(1), a.y.toFixed(1)); }
    }
  }
  return worst;
}
// coordinate descent: each lane in turn tries every phase (0.5 s steps) against the others; random restarts
const T = []; for (let t = 0; t < VN.P; t += 0.1) T.push(t);
function laneCost(li, ph) {
  const ln = LN[li], keep = ln.ph; ln.ph = ph; let c = 0;
  for (const t of T) {
    const v = boxes(t), mine = v.filter((b) => b.li === li);
    for (const a of mine) for (const b of v) { if (b.li === li) continue; if (LN[b.li] && LN[b.li].ax === ln.ax && LN[b.li].c === ln.c) continue; const ox = a.hx + b.hx + M - Math.abs(a.x - b.x), oy = a.hy + b.hy + M - Math.abs(a.y - b.y); if (ox > 0 && oy > 0) c += Math.min(ox, oy); }
  }
  ln.ph = keep; return c;
}
let seed = +(process.argv[2] || 7); const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
let best = null, bs = 1e9;
for (let restart = 0; restart < 40 && bs > 0; restart++) {
  const ph = LN.map(() => +(rnd() * VN.P).toFixed(1)); LN.forEach((ln, i) => { ln.ph = ph[i]; });
  for (let round = 0; round < 10; round++) {
    let changed = false;
    for (let li = 0; li < LN.length; li++) {
      let bp = LN[li].ph, bc = laneCost(li, bp);
      if (bc === 0) continue;
      for (let p = 0; p < VN.P; p += 0.5) { const c = laneCost(li, p); if (c < bc) { bc = c; bp = p; } }
      if (bp !== LN[li].ph) { LN[li].ph = bp; changed = true; }
    }
    const tot = bad(LN.map((l) => l.ph)); console.log('restart', restart, 'round', round, tot.toFixed(3));
    if (tot < bs) { bs = tot; best = LN.map((l) => l.ph); }
    if (tot === 0 || !changed) break;
  }
}
console.log('best', bs, JSON.stringify(best));
if (bs > 0) bad(best, true);
