// Offline check and phase search for Lisbon's traffic. usage: node tools/traffic_check.mjs [search]
import fs from 'fs'; import vm from 'vm';
const dir = new URL('..', import.meta.url).pathname;
const ctx = { Math, console }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(dir + 'src/35_scene.js', 'utf8').replace('const SCENE', 'var SCENE'), ctx);
vm.runInContext(fs.readFileSync(dir + 'src/37_traffic.js', 'utf8').replace('const LXT', 'var LXT'), ctx);
const T = ctx.LXT;
console.log('WB len', T.WB.len.toFixed(1), 'EB len', T.EB.len.toFixed(1), 'lane', T.S_LANE.toFixed(1), 'trip W', T.DW.toFixed(1), 'E', T.DE.toFixed(1), 'hold', T.HOLD.toFixed(1), 'PHW', T.PHW.toFixed(2), 'PHE', T.PHE.toFixed(2));
console.log('red clusters per lane', T.RED.map((c) => c.map((q) => q.s0.toFixed(0) + '-' + q.s1.toFixed(0) + ':' + q.win.length).join(' ')).join(' | '));
const sat = (A, B) => { for (const P of [A, B]) for (let i = 0; i < 4; i++) { const a = P[i], b = P[(i + 1) % 4], nx = -(b[1] - a[1]), ny = b[0] - a[0]; let a0 = 1e9, a1 = -1e9, b0 = 1e9, b1 = -1e9; for (const p of A) { const d = p[0] * nx + p[1] * ny; a0 = Math.min(a0, d); a1 = Math.max(a1, d); } for (const p of B) { const d = p[0] * nx + p[1] * ny; b0 = Math.min(b0, d); b1 = Math.max(b1, d); } if (a1 < b0 || b1 < a0) return false; } return true; };
const W = { car: 2.55, taxi: 2.3, taxiO: 2.3, tuk: 1.45, van: 2.3, bus: 2.7 };
function conflicts(stopAt) {
  let n = 0, first = null;
  for (let t = 0; t < T.P * T.NT; t += 0.05) {
    const v = [];
    for (let li = 0; li < 8; li++) for (let k = 0; k < T.NV; k++) { const c = T.car(li, k, t); if (c && (c.alpha == null || c.alpha > 0.3)) v.push({ id: 'c' + li + '.' + k, p: T.obbPts(c.x, c.y, c.ang, T.HL[c.kind] + 0.5, W[c.kind] + 0.25) }); }
    if (t < T.P) for (const st of T.trams(t)) v.push({ id: 't' + st.dir + st.s.toFixed(0), p: T.obbPts(st.x, st.y, st.ang, T.TRAM_HL, T.TRAM_HW) });
    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) {
      if (v[i].id[0] === 't' && v[j].id[0] === 't') continue;
      if (sat(v[i].p, v[j].p)) { n++; if (!first) first = [t.toFixed(2), v[i].id, v[j].id]; if (stopAt && n >= stopAt) return { n, first }; }
    }
  }
  return { n, first };
}
// trams against each other (single track!)
let tt = 0; for (let t = 0; t < T.P * T.NT; t += 0.05) { const s = T.trams(t); for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length; j++) if (sat(T.obbPts(s[i].x, s[i].y, s[i].ang, T.TRAM_HL, T.TRAM_HW), T.obbPts(s[j].x, s[j].y, s[j].ang, T.TRAM_HL, T.TRAM_HW))) { if (!tt) console.log('tram clash at', t.toFixed(2), s[i].dir, s[i].s.toFixed(1), s[j].dir, s[j].s.toFixed(1)); tt++; } }
console.log('tram-tram clashes', tt);
if (process.argv[2] === 'search') {
  let best = null, bestN = 1e9, R = 12345; const rnd = () => (R = (R * 16807) % 2147483647) / 2147483647;
  for (let it = 0; it < 4000 && bestN > 0; it++) {
    const ph = best && rnd() < 0.7 ? best.map((p) => rnd() < 0.3 ? rnd() * T.P : p) : Array.from({ length: 8 }, () => rnd() * T.P);
    T.setPhases(ph.map((p) => +p.toFixed(3))); const r = conflicts(bestN);
    if (r.n < bestN) { bestN = r.n; best = T.phases.slice(); console.log(it, bestN, JSON.stringify(best), r.first); }
  }
  console.log('BEST', bestN, JSON.stringify(best));
} else { const r = conflicts(); console.log('vehicle conflicts', r.n, r.first); }
