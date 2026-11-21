// Search lane phases so that no two vehicles' boxes overlap at the crossings: node tools/traffic.js [seed]
const T = require('../src/38_traffic.js');
const M = 1.4, HW = 2.7;
function box(li, k, t, ph) {
  const s = T.at(li, k, t, ph[li]); if (!s || s.hidden) return null;
  const hl = T.half(T.KIND[li][k]), ax = T.LANES[li].ax;
  return ax === 'x' ? [s.x - hl, s.y - HW, s.x + hl, s.y + HW] : [s.x - HW, s.y - hl, s.x + HW, s.y + hl];
}
function hits(ph, stop) {
  let n = 0;
  for (let t = 0; t < T.P; t += 0.04) {
    const bs = [];
    for (let li = 0; li < 8; li++) for (let k = 0; k < 2; k++) { const b = box(li, k, t, ph); if (b) bs.push([li, b]); }
    for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
      if (bs[i][0] === bs[j][0] || T.LANES[bs[i][0]].ax === T.LANES[bs[j][0]].ax) continue;
      const a = bs[i][1], b = bs[j][1];
      if (a[0] < b[2] + M && a[2] > b[0] - M && a[1] < b[3] + M && a[3] > b[1] - M) { n++; if (stop) return n; }
    }
  }
  return n;
}
let seed = +(process.argv[2] || 7); const R = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
let best = null, bn = 1e9;
for (let it = 0; it < 4000 && bn > 0; it++) {
  const ph = T.LANES.map(() => Math.round(R() * T.SPAN * 100) / 100);
  const n = hits(ph, false); if (n < bn) { bn = n; best = ph; }
}
console.log('hits', bn, 'PHASE = ' + JSON.stringify(best));
// coordinate descent from the best random start
let ph = best.slice(), cur = hits(ph, false);
for (let round = 0; round < 6 && cur > 0; round++) for (let li = 0; li < 8 && cur > 0; li++) {
  let bv = ph[li], bh = cur;
  for (let v = 0; v < T.SPAN; v += 1.5) { ph[li] = v; const n = hits(ph, false); if (n < bh) { bh = n; bv = v; } }
  ph[li] = bv; cur = bh; console.log('round', round, 'lane', li, 'hits', cur);
}
console.log('final hits', cur, 'PHASE = ' + JSON.stringify(ph));
