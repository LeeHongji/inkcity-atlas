// Searches lane phases for src/37_traffic.js so no two vehicles on crossing streets ever overlap (AABB + margin),
// sampled every 1/30 s over the common period. usage: node tools/search_traffic.mjs [seed] [--check]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const BCT = require('../src/37_traffic.js');
const M = 1.4, DT = 1 / 30, N = Math.round(BCT.P / DT), NL = BCT.lanes.length;
let seed = parseInt(process.argv[2] || '7', 10);
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const vis = (p) => p.x > -168 && p.x < 140 && p.y > -168 && p.y < 168;
function conflicts(a, b, ph) {
  const A = BCT.lanes[a], B = BCT.lanes[b]; if (A.ax === B.ax) return 0;
  let n = 0;
  for (let i = 0; i < N; i++) {
    const t = i * DT;
    for (let ka = 0; ka < A.kinds.length; ka++) {
      const p = BCT.pos(a, ka, t, ph); if (!vis(p)) continue;
      const px = A.ax === 'x' ? p.hl : p.hw, py = A.ax === 'x' ? p.hw : p.hl;
      for (let kb = 0; kb < B.kinds.length; kb++) {
        const q = BCT.pos(b, kb, t, ph); if (!vis(q)) continue;
        const qx = B.ax === 'x' ? q.hl : q.hw, qy = B.ax === 'x' ? q.hw : q.hl;
        if (Math.abs(p.x - q.x) < px + qx + M && Math.abs(p.y - q.y) < py + qy + M) n++;
      }
    }
  }
  return n;
}
if (process.argv.includes('--check')) {
  let tot = 0; for (let a = 0; a < NL; a++) for (let b = a + 1; b < NL; b++) tot += conflicts(a, b, BCT.PHASE);
  console.log('conflict samples with current PHASE:', tot); process.exit(tot ? 1 : 0);
}
for (let restart = 0; restart < 400; restart++) {
  const ph = new Array(NL).fill(0), order = [...Array(NL).keys()].sort(() => rnd() - 0.5); let total = 0;
  const placed = [];
  for (const li of order) {
    let best = null, bestC = 1e9;
    for (let tr = 0; tr < 60; tr++) {
      ph[li] = Math.round(rnd() * 1000) / 1000; let c = 0;
      for (const pj of placed) { c += conflicts(li, pj, ph); if (c >= bestC) break; }
      if (c < bestC) { bestC = c; best = ph[li]; if (c === 0) break; }
    }
    ph[li] = best; placed.push(li); total += bestC;
    if (total > 0) break;
  }
  if (total === 0) { console.log('found after', restart + 1, 'restarts:'); console.log('[' + ph.map((v) => v.toFixed(3)).join(', ') + ']'); process.exit(0); }
}
console.log('no solution'); process.exit(1);
