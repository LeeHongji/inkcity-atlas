// Offline search for street-traffic phases: no two vehicles' boxes (with a margin) ever overlap at the crossings.
// Lanes and kinds must match src/tiles/streets.js.
const END = 166, SPAN = 2 * END, V = 11, P = SPAN / V;
const LANES = [[false, -46.5, 1], [false, -53.5, -1], [false, 53.5, 1], [false, 46.5, -1], [true, 46.5, 1], [true, 53.5, -1]];
const KINDS = [['taxi', 'car', 'velib'], ['bus', 'car', 'scooter'], ['car', 'scooter', 'taxi'], ['car', 'van', 'velib'], ['bus', 'car', 'scooter'], ['taxi', 'car', 'car']];
const HL = { car: 4.7, taxi: 5.0, bus: 7.0, van: 5.2, scooter: 2.8, velib: 2.6 }, HW = { car: 2.4, taxi: 2.5, bus: 2.8, van: 2.5, scooter: 1.0, velib: 0.9 };
const pos = (li, k, ph, t) => { const L = LANES[li], n = KINDS[li].length; const s = ((((ph * V + k * SPAN / n + L[2] * V * t) % SPAN) + SPAN) % SPAN) - END; return L[0] ? { x: L[1], y: s, hx: HW[KINDS[li][k]], hy: HL[KINDS[li][k]] } : { x: s, y: L[1], hx: HL[KINDS[li][k]], hy: HW[KINDS[li][k]] }; };
const M = 1.4;
function bad(ph) {
  let worst = 0;
  for (let t = 0; t < P; t += 0.05) {
    const v = [];
    for (let li = 0; li < LANES.length; li++) for (let k = 0; k < KINDS[li].length; k++) v.push(pos(li, k, ph[li], t));
    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) {
      const a = v[i], b = v[j], ox = a.hx + b.hx + M - Math.abs(a.x - b.x), oy = a.hy + b.hy + M - Math.abs(a.y - b.y);
      if (ox > 0 && oy > 0) worst += Math.min(ox, oy);
    }
  }
  return worst;
}
let best = null, bs = 1e9, seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
for (let it = 0; it < 4000 && bs > 0; it++) {
  const ph = LANES.map(() => +(rnd() * P).toFixed(4));
  const s = bad(ph); if (s < bs) { bs = s; best = ph; console.log(it, s.toFixed(3), JSON.stringify(ph)); }
}
console.log('best', bs, JSON.stringify(best));
