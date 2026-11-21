// Searches lane phases for src/37_traffic.js so no two vehicles ever overlap (AABB + margin) while visible,
// sampled every 1/30 s over the common period. usage: node tools/search_traffic.mjs [seed] [--check]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const RJT = require('../src/37_traffic.js');
const M = 1.2, DT = 1 / 15, N = Math.round(RJT.P / DT), NL = RJT.lanes.length;
let seed = parseInt(process.argv[2] || '7', 10);
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
function conflicts(a, b, ph) {
  const A = RJT.lanes[a], B = RJT.lanes[b]; if (A.ax === B.ax) return 0;
  let n = 0;
  for (let i = 0; i < N; i++) {
    const t = i * DT;
    for (let ka = 0; ka < A.kinds.length; ka++) {
      const p = RJT.pos(a, ka, t, ph); if (RJT.alpha(a, p.s) <= 0.05) continue;
      const px = A.ax === 'x' ? p.hl : p.hw, py = A.ax === 'x' ? p.hw : p.hl;
      for (let kb = 0; kb < B.kinds.length; kb++) {
        const q = RJT.pos(b, kb, t, ph); if (RJT.alpha(b, q.s) <= 0.05) continue;
        const qx = B.ax === 'x' ? q.hl : q.hw, qy = B.ax === 'x' ? q.hw : q.hl;
        if (Math.abs(p.x - q.x) < px + qx + M && Math.abs(p.y - q.y) < py + qy + M) n++;
      }
    }
  }
  return n;
}
const total = (ph) => { let t = 0; for (let a = 0; a < NL; a++) for (let b = a + 1; b < NL; b++) t += conflicts(a, b, ph); return t; };
if (process.argv.includes('--check')) { const t = total(RJT.PHASE); console.log('conflict samples with current PHASE:', t); process.exit(t ? 1 : 0); }
// greedy coordinate search with random restarts (incremental: only the pairs that involve the lane being moved)
const laneCost = (li, ph) => { let t = 0; for (let b = 0; b < NL; b++) if (b !== li) t += conflicts(li, b, ph); return t; };
let best = null, bestT = 1e9;
for (let rs = 0; rs < 20 && bestT > 0; rs++) {
  const ph = []; for (let i = 0; i < NL; i++) ph.push(rnd());
  let cur = total(ph);
  for (let it = 0; it < 25 && cur > 0; it++) {
    for (let li = 0; li < NL; li++) {
      const c0 = laneCost(li, ph); if (c0 === 0) continue;
      let bv = ph[li], bc = c0;
      for (let k = 0; k < 60; k++) { const v = k / 60 + rnd() / 60; ph[li] = v; const c = laneCost(li, ph); if (c < bc) { bc = c; bv = v; } if (c === 0) break; }
      ph[li] = bv; cur += bc - c0; if (cur === 0) break;
    }
  }
  if (cur < bestT) { bestT = cur; best = ph.slice(); }
  console.log('restart', rs, 'conflicts', cur);
}
console.log('best', bestT, JSON.stringify(best.map((v) => +v.toFixed(3))));
