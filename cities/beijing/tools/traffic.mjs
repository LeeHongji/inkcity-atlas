// Collision check / phase search for src/37_traffic.js. usage: node tools/traffic.mjs [search [iters]]
import fs from 'fs'; import vm from 'vm';
const ctx = { Math, console }; vm.createContext(ctx);
for (const f of ['src/35_scene.js', 'src/37_traffic.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
const T = vm.runInContext('BJT', ctx), F = vm.runInContext('BJF', ctx);
const M = 0.9;   // margin
let salt = 0;
function guardBox(t) {   // the marching column on the road (global), or null
  const tc = F.cyc(t); const tail = (F.ROWS - 1) * F.RS;
  let yh = null;
  if (tc >= F.OUT && tc < F.OUT + (F.YH - F.Y0) / F.VW + 1) yh = Math.min(F.YH, F.Y0 + F.VW * (tc - F.OUT));
  if (yh != null) { const y0 = Math.max(F.Y0, yh - tail), y1 = yh; if (y1 > 36 && y0 < 64) return [-2.6, Math.max(36, y0), 2.6, Math.min(64, y1)]; }
  if (tc >= F.BACK) { const yb = F.YH - F.VW * (tc - F.BACK); const y0 = Math.max(F.Y0, yb - tail), y1 = Math.max(F.Y0, yb); if (y1 > 36 && y0 < 64) return [-2.6, Math.max(36, y0), 2.6, Math.min(64, y1)]; }
  return null;
}
function evaluate(detail) {
  salt += 1e-7; let bad = 0, depth = 0; const hits = [];
  for (let t = salt; t < F.CYC; t += 0.05) {
    const bx = [];
    for (let i = 0; i < T.vehicles.length; i++) {
      const v = T.vehicles[i], s = v.at(t); if (!s) continue;
      const [hl, hw] = T.SIZE[s.kind], along = Math.abs(Math.cos(s.ang)) > 0.5;
      bx.push([along ? s.x - hl - M : s.x - hw - M, along ? s.y - hw - M : s.y - hl - M, along ? s.x + hl + M : s.x + hw + M, along ? s.y + hw + M : s.y + hl + M, i]);
    }
    const g = guardBox(t); if (g) bx.push([g[0] - M, g[1], g[2] + M, g[3], -1]);
    let any = false;
    for (let a = 0; a < bx.length; a++) for (let b = a + 1; b < bx.length; b++) {
      const A = bx[a], B = bx[b];
      if (A[0] < B[2] && B[0] < A[2] && A[1] < B[3] && B[1] < A[3]) { any = true; depth += Math.min(A[2] - B[0], B[2] - A[0], A[3] - B[1], B[3] - A[1]); if (detail && hits.length < 30) hits.push([t.toFixed(2), A[4], B[4]]); }
    }
    if (any) bad++;
  }
  return detail ? { bad, hits, depth } : (bad === 0 ? 0 : bad + depth);
}
const mode = process.argv[2];
if (mode === 'search') {
  const iters = +(process.argv[3] || 3000), R = Math.random;
  const range = (li) => { if (li >= 20) return 3; if (li >= 16) return 5; const ln = T.lanes[li], heldL = ln[0] === 'x' && ln[1] === 50; return heldL ? (ln[4] === "bike" ? 40 : 20) : (ln[4] === "bike" ? 40 : 20); };
  const set = (ph) => { for (let i = 0; i < ph.length; i++) T.PH[i] = ph[i]; };
  let cur = T.PH.slice(), curS = evaluate(), best = cur.slice(), bestS = curS, culprits = [];
  const blame = (ph) => { set(ph); const r = evaluate(true); culprits = []; for (const h of r.hits) for (const v of [h[1], h[2]]) if (v >= 0) culprits.push(T.vehicles[v].li); };
  blame(cur);
  console.log('start', curS);
  for (let it = 0; it < iters && bestS > 0; it++) {
    const cand = cur.slice(), n = 1 + Math.floor(R() * 2);
    for (let k = 0; k < n; k++) {
      const li = culprits.length && R() < 0.6 ? culprits[Math.floor(R() * culprits.length)] : Math.floor(R() * cand.length);
      cand[li] = R() < 0.4 ? +(R() * range(li)).toFixed(3) : +((((cand[li] + (R() - 0.5) * 2) % range(li)) + range(li)) % range(li)).toFixed(3);
    }
    set(cand); const s = evaluate(), temp = 3.0 * (1 - it / iters);
    if (s <= curS || R() < Math.exp(-(s - curS) / Math.max(1e-3, temp))) { cur = cand; curS = s; if (it % 20 === 0) blame(cur); }
    if (s < bestS) { best = cand.slice(); bestS = s; console.log(it, s.toFixed(2), JSON.stringify(best)); blame(best); }
  }
  set(best);
  console.log('best', bestS, JSON.stringify(best));
} else {
  const r = evaluate(true); console.log('colliding samples:', r.bad); for (const h of r.hits) console.log(h.join(' '));
}
