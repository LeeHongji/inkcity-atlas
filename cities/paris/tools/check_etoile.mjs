// Numeric check of the Étoile wave: every pair of vehicles keeps its oriented boxes apart over two waves.
// The path function is the same as in src/tiles/etoile.js (ET.path).
const VE = 17, D2R = Math.PI / 180, W = 8, OM = 30, V = 10, R0 = 21.2, A = 3.0, KW = 3, LANE = 2.8, RIN = 26.5;
const MS = [3, 6, 2, 5, 7, 4, 2, 6, 3, 7, 5, 4];
const KIND = ['car', 'taxi', 'car', 'scooter', 'car', 'car', 'scooter', 'car', 'taxi', 'car', 'scooter', 'car'];
const HL = { car: 4.5, taxi: 4.8, van: 5.0, scooter: 2.8 }, HW = { car: 2.4, taxi: 2.5, van: 2.5, scooter: 1.0 };
const edgeR = (phi) => 36.5 / Math.max(Math.abs(Math.cos(phi)), Math.abs(Math.sin(phi)));
function pos(j, m, tau) {
  const phi = 30 * j * D2R, ux = Math.cos(phi), uy = Math.sin(phi), nx = -uy, ny = ux;
  if (tau < 0) { const r = RIN - V * tau; if (r > edgeR(phi)) return null; return [ux * r - nx * LANE, uy * r - ny * LANE]; }
  const de = 30 * m - 9, te = de / OM;
  if (tau <= te) {
    const dphi = OM * tau, th = (30 * j - 4.5 - dphi) * D2R, rw = R0 + A * Math.sin(KW * dphi * D2R + j * Math.PI);
    const b = Math.min(1, dphi / 12, (de - dphi) / 12), sb = b * b * (3 - 2 * b), r = 26.6 + (rw - 26.6) * sb;
    return [Math.cos(th) * r, Math.sin(th) * r];
  }
  const pa = (30 * j - 30 * m) * D2R, ax = Math.cos(pa), ay = Math.sin(pa), mx = -ay, my = ax, r = RIN + VE * (tau - te);
  if (r > edgeR(pa)) return null; return [ax * r + mx * LANE, ay * r + my * LANE];
}
function state(j, wave, t) { const tau = t - wave * W, m = MS[(j + 5 * wave) % 12]; const p = pos(j, m, tau); if (!p) return null; const q = pos(j, m, tau + 0.05) || pos(j, m, tau - 0.05); const ang = q === p ? 0 : Math.atan2((q[1] - p[1]) * (pos(j, m, tau + 0.05) ? 1 : -1), (q[0] - p[0]) * (pos(j, m, tau + 0.05) ? 1 : -1)); return { x: p[0], y: p[1], a: ang, hl: HL[KIND[j]], hw: HW[KIND[j]] }; }
function sep(a, b) {   // SAT on two oriented rectangles; returns the largest separating gap (negative = overlap)
  const axes = [a.a, a.a + Math.PI / 2, b.a, b.a + Math.PI / 2]; let best = -1e9;
  for (const th of axes) { const c = Math.cos(th), s = Math.sin(th), proj = (r) => { const pc = r.x * c + r.y * s, e = Math.abs(r.hl * (Math.cos(r.a) * c + Math.sin(r.a) * s)) + Math.abs(r.hw * (-Math.sin(r.a) * c + Math.cos(r.a) * s)); return [pc - e, pc + e]; }; const A2 = proj(a), B2 = proj(b); best = Math.max(best, Math.max(A2[0] - B2[1], B2[0] - A2[1])); }
  return best;
}
let worst = 1e9, at = null;
for (let t = 0; t < 3 * W; t += 0.02) {
  const S = [];
  for (let w = -2; w <= 3; w++) for (let j = 0; j < 12; j++) { const s = state(j, w, t); if (s) S.push(Object.assign(s, { id: w + ':' + j })); }
  for (let i = 0; i < S.length; i++) for (let k = i + 1; k < S.length; k++) { const g = sep(S[i], S[k]); if (g < worst) { worst = g; at = [t.toFixed(2), S[i].id, S[k].id]; } }
}
console.log('smallest gap between any two vehicles:', worst.toFixed(2), 'u at', at);
