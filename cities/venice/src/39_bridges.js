'use strict';
/* The two famous bridges, both objects of the streets tile.
   The Rialto (1588, Antonio da Ponte): one segmental stone arch over the Grand Canal, all white Istrian stone. On top,
   three stairways side by side: the two outer ones along the balustrades, the central one between two rows of little
   shops under terracotta roofs that step up with the stairs, and at the crown a high portico with a pediment where the
   rows meet. Drawn 15 u wide; the ramps reach 11 u into the places on both banks (the Fondaco side and the market).
   Depth: the far ramp, the vault, the span ({ under: 0 }: the vaporetti pass under it), the near ramp, then on the span
   the far shop rows, the portico halves and the near shop rows ({ on: true }, so a walker on the central stair is in
   front of the far row and behind the near one), and the near balustrade in three pieces.
   The Bridge of Sighs (1600): a closed white limestone bridge high over the rio di Palazzo between the Doge's Palace
   and the prisons, a curved soffit, two small barred windows, volutes and a crowning arms on its face. */
VN.rialto = function (T, role) {
  // at night the whole bridge is floodlit, white stone gone warm gold (the water under the arch and the roofs stay dark)
  const LIT = VN.litStone(1), litNc = (c) => (c === VN.waterD ? undefined : LIT(c));
  role = role || 'both'; const OB = (own, fpp, fn, opt) => { if (role === 'both' || role === own) T.obj(fpp, (g) => { const i0 = g.cmds.length; fn(g); g.mark({ nc: litNc }, i0); }, opt); };
  const ax = 'x', c = 50, b = 0, M = VN.map(ax, c, b), W = 7.5, Y = VN.CW, RY = 24, WL = VN.WL, HS = 5.4, HC = 7.8;
  const ST = VN.istria, STD = VN.istriaD, STR = '#E2DCCF';
  const deck = (v) => { const a = Math.abs(v); if (a >= RY) return 0; if (a >= Y) return HS * (RY - a) / (RY - Y); return HC - (HC - HS) * (a / Y) * (a / Y); };
  const RAD = (Y * Y + 7.5 * 7.5) / 15, ZC = WL + 7.5 - RAD, arch = (v) => ZC + Math.sqrt(Math.max(0, RAD * RAD - v * v));
  const RISE = 0.42, step = (v) => Math.max(Math.abs(v) >= RY ? 0 : RISE, Math.round(deck(v) / RISE) * RISE);
  const vr = (a, e, n) => { const r = []; for (let i = 0; i <= n; i++) r.push(lerp(a, e, i / n)); return r; };
  const L = (pts) => pts.map((p) => { const q = M(p[0], p[1], p[2]); return [q[0] - T.cx, q[1] - T.cy, q[2]]; });
  const fp = (u0, v0, u1, v1) => { const A = M(u0, v0, 0), B = M(u1, v1, 0); return [Math.min(A[0], B[0]) - T.cx, Math.min(A[1], B[1]) - T.cy, Math.max(A[0], B[0]) - T.cx, Math.max(A[1], B[1]) - T.cy]; };
  const treads = []; { let va = -RY - 0.6, z = 0; for (let v = -RY; v <= RY + 0.001; v += 0.05) { const s = Math.abs(v) >= RY ? 0 : step(v); if (Math.abs(s - z) > 1e-6) { treads.push([va, v, z]); va = v; z = s; } } treads.push([va, RY + 0.6, 0]); }
  const stairs = (g, u0, u1, va, vb) => {
    let prev = null;
    for (const [a, e, z] of treads) {
      if (e <= va + 1e-6 || a >= vb - 1e-6) { prev = z; continue; }
      const A = Math.max(a, va), B = Math.min(e, vb);
      if (prev != null && z < prev && a >= va - 1e-6) g.fill(L([[u0, A, z], [u1, A, z], [u1, A, prev], [u0, A, prev]]), STD);
      g.fill(L([[u0, A, z], [u1, A, z], [u1, B, z], [u0, B, z]]), z > 0 ? '#ECE7DC' : VN.paveC);
      if (z > 0) g.fine(L([[u0, B, z], [u1, B, z]]), { w: 0.26, c: '#BDB6A8' });
      prev = z;
    }
  };
  const balustrade = (g, u, va, vb, near) => {
    const vs = vr(va, vb, 16), H = 1.4;
    if (near) g.fill(L(vs.map((v) => [u, v, deck(v)]).concat(vs.slice().reverse().map((v) => [u, v, deck(v) + 0.35]))), STD);
    const bl = []; for (let i = 0; i <= Math.round((vb - va) / 0.55); i++) { const v = lerp(va, vb, i / Math.round((vb - va) / 0.55)), p = g.p.apply(g, L([[u, v, deck(v) + 0.3]])[0]), q = g.p.apply(g, L([[u, v, deck(v) + H - 0.2]])[0]); bl.push(p[0], p[1], q[0], q[1]); }
    g.segs2(bl, near ? '#C9C2B4' : '#D3CCBF', 0.5);
    g.fill(L(vs.map((v) => [u - 0.3, v, deck(v) + H - 0.2]).concat(vs.slice().reverse().map((v) => [u + 0.05, v, deck(v) + H]))), ST);
    g.line(L(vs.map((v) => [u + 0.05, v, deck(v) + H])), { w: near ? 0.7 : 0.5, boil: false });
  };
  const side = (g, va, vb) => {   // the outer face below the deck on a ramp
    const vs = vr(va, vb, 10);
    g.fill(L(vs.map((v) => [W, v, 0]).concat(vs.slice().reverse().map((v) => [W, v, deck(v)]))), STR);
    const cs = []; for (let z = 0.8; z < HS; z += 0.8) { const vv = vs.filter((v) => deck(v) > z + 0.3); if (vv.length > 1) { const p = g.p.apply(g, L([[W, vv[0], z]])[0]), q = g.p.apply(g, L([[W, vv[vv.length - 1], z]])[0]); cs.push(p[0], p[1], q[0], q[1]); } }
    g.segs2(cs, '#C9C2B4', 0.28);
    g.line(L(vs.map((v) => [W, v, deck(v)])), { w: 0.7, boil: false });
  };
  const ramp = (va, vb, nm) => OB(va < 0 ? 'far' : 'near', fp(-W, va, W, vb), function (g) {
    g.boilP = 0.25;
    balustrade(g, -W + 0.3, va, vb, false);
    stairs(g, -W + 0.6, -5.4, va, vb); stairs(g, -2.0, 2.0, va, vb); stairs(g, 5.4, W - 0.6, va, vb);
    // the shop rows' plinths along the ramp (the rows themselves start on the span)
    for (const u0 of [-5.4, 2.0]) stairs(g, u0, u0 + 3.4, va, vb);
    side(g, va, vb);
  }, { name: nm });
  ramp(-RY - 0.6, -Y, 'rialto far');
  // the vault: the arch's underside seen through the opening
  OB('far', fp(-W, -Y, W, Y), function (g) {
    const vs = vr(-Y, Y, 24), N = g.P(L(vs.map((v) => [W, v, arch(v)]))), Fp = g.P(L(vs.map((v) => [-W, v, arch(v)])));
    const sgn = VN.area(Fp) > 0 ? 1 : -1;
    for (let i = 0; i < Fp.length; i++) { const a = Fp[i], e = Fp[(i + 1) % Fp.length], piece = VN.clip(N, a, e, -sgn); if (piece.length >= 3) g.fill2(piece, i === Fp.length - 1 ? VN.waterD : '#9C9284', true); }
    const rib = []; for (let u = -W + 1.5; u < W; u += 1.5) { const pts = g.P(L(vs.map((v) => [u, v, arch(v)]))).filter((p) => pointInPoly(p[0], p[1], N.flat())); for (let i = 0; i < pts.length - 1; i++) rib.push(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]); }
    g.segs2(rib, '#857B6E', 0.3);
    const inside = Fp.filter((p) => pointInPoly(p[0], p[1], N.flat())); if (inside.length > 1) g.line2(inside, { w: 0.45, c: '#4A3A30', boil: false });
  }, { name: 'rialto vault' });
  // the span: far balustrade, the three stairways, the face with its arch
  OB('far', fp(-W, -Y, W, Y), function (g) {
    g.boilP = 0.25;
    balustrade(g, -W + 0.3, -Y, Y, false);
    stairs(g, -W + 0.6, -5.4, -Y, Y); stairs(g, -2.0, 2.0, -Y, Y); stairs(g, 5.4, W - 0.6, -Y, Y);
    const hv = [vr(-Y, 0, 14), vr(0, Y, 14)];
    for (const half of hv) g.fill(L(half.map((v) => [W, v, deck(v)]).concat(half.slice().reverse().map((v) => [W, v, arch(v)]))), STR);
    // voussoirs round the arch, a dentil cornice under the walkway, the relief panels in the spandrels
    const ring = vr(-Y, Y, 30), inner = ring.map((v) => [W + 0.04, v, arch(v)]), outer = ring.map((v) => [W + 0.04, v, Math.min(deck(v) - 0.7, arch(v) + 1.1)]);
    g.fill(L(inner.concat(outer.slice().reverse())), ST);
    const vj = []; for (let i = 1; i < ring.length - 1; i++) { const p = g.p.apply(g, L([inner[i]])[0]), q = g.p.apply(g, L([outer[i]])[0]); vj.push(p[0], p[1], q[0], q[1]); } g.segs2(vj, STD, 0.32);
    g.line(L(inner), { w: 0.85, boil: false }); g.line(L(outer), { w: 0.4, c: '#A39A8A', boil: false });
    const all = hv[0].concat(hv[1].slice(1));
    g.fill(L(all.map((v) => [W + 0.06, v, deck(v) - 0.6]).concat(all.slice().reverse().map((v) => [W + 0.06, v, deck(v)]))), STD);
    const dn = []; for (let v = -Y; v < Y; v += 0.6) { const p = g.p.apply(g, L([[W + 0.07, v, deck(v) - 0.55]])[0]); dn.push(p[0], p[1], p[0], p[1] + 0.7); } g.segs2(dn, '#B5AD9E', 0.3);
    for (const s of [-1, 1]) { const v = s * 8.6, z = (arch(v) + deck(v) - 0.7) / 2; const p = g.p.apply(g, L([[W + 0.06, v, z]])[0]); g.fill2(arcPts(p[0], p[1], 2.0, 0, TAU, 10).map((q) => [q[0], p[1] + (q[1] - p[1]) * 1.15]), '#E9E3D6', true); g.ring2(p, 2.0, { w: 0.3, c: '#A39A8A' }); g.fill2([[p[0] - 0.5, p[1] + 1.2], [p[0] + 0.6, p[1] + 1.2], [p[0] + 0.3, p[1] - 1.3], [p[0] - 0.2, p[1] - 1.3]], '#C9C2B4', true); }
    g.line(L(all.map((v) => [W, v, deck(v)])), { w: 0.75, boil: false });
    const ks = L([[W + 0.07, -0.7, arch(0) - 0.1], [W + 0.07, 0.7, arch(0) - 0.1], [W + 0.07, 0.9, arch(0) + 1.3], [W + 0.07, -0.9, arch(0) + 1.3]]); g.fill(ks, '#FFFFFF'); g.outline(ks, { w: 0.4, boil: false });
    // at night: floodlit (on screen the Pescheria's roof stands in front of the market half of the face and of the water
    // under it: the lights are on the other half and lay no reflection)
    for (const v of [-10.5, -5, 0]) { const q = L([[W + 0.6, v, deck(v) - 0.9]])[0], o = { r: v ? 2.0 : 2.8, col: '#FFD9A0', base: WL }; VN.glowDry(g, 'lantern', q[0], q[1], q[2], o); }
  }, { name: 'rialto span', under: 0 });
  ramp(Y, RY + 0.6, 'rialto near');
  // the shop rows: little units stepping up, an arched opening each on both long faces, terracotta roofs
  const shops = (u0, u1, va, vb, nm) => OB('far', fp(u0, va, u1, vb), function (g) {
    g.boilP = 0.2;
    const n = Math.round(Math.abs(vb - va) / 2.4), dv = (vb - va) / n, rc = '#BD492F';
    const order = []; for (let i = 0; i < n; i++) order.push(i);
    for (const i of order) {
      const v0 = va + dv * i, v1 = v0 + dv, vm = (v0 + v1) / 2, zf = deck(Math.abs(vm) < Math.abs(v0) ? v0 : vm) - 0.1, zt = zf + 4.4, A = M(u0, Math.min(v0, v1), 0), B = M(u1, Math.max(v0, v1), 0);
      K.box(g, A[0] - T.cx, A[1] - T.cy, B[0] - T.cx, B[1] - T.cy, zf, zt, { t: '#E9E3D6', l: '#F1ECE1', r: '#DED7C9' }, { w: 0.55, nohid: true });
      // an arched opening on the face we see (the stair side of the far row, the walkway side of the near row)
      const fu = u1, om = vm;
      const op = L([[fu + 0.02, om - 0.8, zf + 0.2], [fu + 0.02, om + 0.8, zf + 0.2], [fu + 0.02, om + 0.8, zf + 2.6], [fu + 0.02, om, zf + 3.4], [fu + 0.02, om - 0.8, zf + 2.6]]);
      g.fill(op, '#4A3A30');
      const gd = g.P(L([[fu + 0.03, om - 0.5, zf + 0.6], [fu + 0.03, om + 0.5, zf + 1.6]])); g.segs2([gd[0][0], gd[0][1], gd[1][0], gd[1][1]], ['#E6C24F', '#C9463E', '#5F8FC9', '#E9E2CC'][(i + Math.round(u0)) % 4], 1.4);
      g.outline(op, { w: 0.35, boil: false, c: '#2E2620' });
      K.gable(g, A[0] - T.cx - 0.35, A[1] - T.cy, B[0] - T.cx + 0.35, B[1] - T.cy, zt, 1.4, 'y', { a: rc, b: shade(rc, 0.12), e: '#E9E3D6' }, { c: shade(rc, 0.45) });
    }
  }, { name: nm, on: true });
  // the portico at the crown: two halves either side of the central stair
  const portico = (u0, u1, nm) => OB('far', fp(u0, -2.6, u1, 2.6), function (g) {
    g.boilP = 0.2;
    const zf = HC - 0.1, zt = zf + 6.4, A = M(u0, -2.6, 0), B = M(u1, 2.6, 0), x0 = A[0] - T.cx, y0 = A[1] - T.cy, x1 = B[0] - T.cx, y1 = B[1] - T.cy;
    K.box(g, x0, y0, x1, y1, zf, zt, { t: '#E9E3D6', l: '#F3EFE6', r: '#DFD9CC' }, { w: 0.7 });
    // the big arch over the central stair on the face looking down the bridge (+y), pilasters
    const mid = u0 < 0 ? x1 : x0, half = u0 < 0 ? [x1 - 1.9, x1] : [x0, x0 + 1.9];
    g.fill(K.on('L', y1 + 0.02, half[0], half[1], zf, zf + 4.4), '#5A4A3E');
    if (u0 < 0) g.fill(K.on('L', y1 + 0.02, x0 + 1.2, x0 + 2.2, zf + 0.6, zf + 3.4), '#5A4A3E');
    else g.fill(K.on('L', y1 + 0.02, x1 - 2.2, x1 - 1.2, zf + 0.6, zf + 3.4), '#5A4A3E');
    for (const a of [x0 + 0.3, x1 - 0.3]) g.fill(K.on('L', y1 + 0.03, a - 0.3, a + 0.3, zf, zt - 0.6), '#E2DCCF');
    if (u1 > 0) { g.fill(K.on('R', x1 + 0.02, y0 + 1.6, y1 - 1.6, zf + 0.4, zf + 4.2), '#5A4A3E'); g.outline(K.on('R', x1 + 0.02, y0 + 1.6, y1 - 1.6, zf + 0.4, zf + 4.2), { w: 0.4, boil: false }); }
    void mid;
    // the pediment roof, gable ends facing along u
    K.gable(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, zt, 2.6, 'x', { a: '#BD492F', b: shade('#BD492F', 0.12), e: '#EDE8DD' }, { c: '#7A2A1E' });
  }, { name: nm, on: true });
  shops(-5.4, -2.0, -Y + 0.8, -2.6, 'rialto shops fa'); shops(-5.4, -2.0, 2.6, Y - 0.8, 'rialto shops fb');
  portico(-5.4, -0.05, 'rialto portico far'); portico(0.05, 5.4, 'rialto portico near');
  shops(2.0, 5.4, -Y + 0.8, -2.6, 'rialto shops na'); shops(2.0, 5.4, 2.6, Y - 0.8, 'rialto shops nb');
  // the near balustrade in pieces
  for (const [va, vb] of [[-RY, -Y], [-Y, Y], [Y, RY]]) OB(va > 0 ? 'near' : 'far', fp(W - 0.4, va, W, vb), (g) => balustrade(g, W - 0.1, va, vb, true), { on: true, name: 'rialto balustrade' });
  VN.rialtoDeck = { deck, step, M, W, RY };
};

VN.sighs = function (T) {
  const M = VN.map('x', -50, 110), W = 2.2, Y = VN.CW, Z0 = 4.2, Z1 = 9.4;
  const L = (pts) => pts.map((p) => { const q = M(p[0], p[1], p[2]); return [q[0] - T.cx, q[1] - T.cy, q[2]]; });
  const soffit = (v) => Z0 + 0.9 * (1 - (v / Y) * (v / Y));
  T.obj([110 - W - T.cx, -63 - T.cy, 110 + W - T.cx, -37 - T.cy], function (g) {
    g.boilP = 0.3; const i0 = g.cmds.length;
    const vs = []; for (let i = 0; i <= 20; i++) vs.push(lerp(-Y, Y, i / 20));
    // underside, the face, the top
    g.fill(L(vs.map((v) => [-W, v, soffit(v)]).concat(vs.slice().reverse().map((v) => [W, v, soffit(v)]))), '#BDB5A6');
    g.fill(L(vs.map((v) => [W, v, soffit(v)]).concat([[W, Y, Z1], [W, -Y, Z1]])), '#E9E4D9');
    g.fill(L([[-W, -Y, Z1], [W, -Y, Z1], [W, Y, Z1], [-W, Y, Z1]]), '#DDD7CA');
    // rusticated base band, cornice, the two barred windows, volutes and the arms at the top
    g.fill(L(vs.map((v) => [W + 0.02, v, soffit(v)]).concat(vs.slice().reverse().map((v) => [W + 0.02, v, soffit(v) + 0.7]))), '#D6CFC1');
    g.fill(L([[W + 0.03, -Y, Z1 - 0.8], [W + 0.03, Y, Z1 - 0.8], [W + 0.03, Y, Z1], [W + 0.03, -Y, Z1]]), '#D6CFC1');
    for (const v0 of [-7.2, 3.8]) {
      const q = L([[W + 0.04, v0, 6.0], [W + 0.04, v0 + 3.4, 6.0], [W + 0.04, v0 + 3.4, 7.9], [W + 0.04, v0, 7.9]]);
      g.fill(L([[W + 0.035, v0 - 0.4, 5.6], [W + 0.035, v0 + 3.8, 5.6], [W + 0.035, v0 + 3.8, 8.3], [W + 0.035, v0 - 0.4, 8.3]]), '#F3F0E8');
      g.fill(q, '#3A3530');
      const P = g.P(q), bars = []; for (let i = 1; i < 6; i++) { const t = i / 6; bars.push(lerp(P[0][0], P[1][0], t), lerp(P[0][1], P[1][1], t), lerp(P[3][0], P[2][0], t), lerp(P[3][1], P[2][1], t)); } for (let i = 1; i < 3; i++) { const t = i / 3; bars.push(lerp(P[0][0], P[3][0], t), lerp(P[0][1], P[3][1], t), lerp(P[1][0], P[2][0], t), lerp(P[1][1], P[2][1], t)); }
      g.segs2(bars, '#C9C2B4', 0.35);
    }
    const top = g.p.apply(g, L([[W + 0.05, 0, Z1]])[0]); g.fill2([[top[0] - 3.4, top[1] + 1.2], [top[0] + 3.4, top[1] - 2.0], [top[0] + 3.0, top[1] - 6.2], [top[0] - 3.0, top[1] - 3.0]], '#EDE8DD', true);
    g.disc2([top[0], top[1] - 2.4], 1.4, '#D6CFC1'); g.ring2([top[0], top[1] - 2.4], 1.4, { w: 0.3, c: '#8E877A' });
    for (const s of [-1, 1]) { const p = g.p.apply(g, L([[W + 0.05, s * 9.5, Z1 - 1.2]])[0]); g.ring2(p, 0.9, { w: 0.4, c: '#A39A8A' }); }
    g.line(L(vs.map((v) => [W, v, soffit(v)])), { w: 0.8, boil: false });
    g.line(L([[W, -Y, Z1], [W, Y, Z1], [-W, Y, Z1]]), { w: 0.8, boil: false });
    g.line(L([[W, Y, soffit(Y)], [W, Y, Z1]]), { w: 0.6, boil: false }); g.line(L([[W, -Y, soffit(-Y)], [W, -Y, Z1]]), { w: 0.6, boil: false });
    // at night it is floodlit from below, its barred windows dark; the light falls on the rio under it
    g.mark({ nc: VN.litStone(0.85) }, i0);
    { const q = L([[W + 0.5, -6, soffit(-6) + 0.4]])[0]; VN.glowDry(g, 'lantern', q[0], q[1], q[2], { r: 2.4, col: '#FFD9A0' }); }   // (one light, on the prisons' half: the palace hides the other; no reflection: the Paglia is in front)
  }, { name: 'bridge of sighs', under: Z0 });
};

/* ---------- which place builds which bridge ----------
   A bridge is drawn by the two places it joins: the far one (the bank behind it) builds its far ramp, the vault, the
   span and the parapet over them; the near one builds the near ramp and its parapet. So each part sorts with the
   houses beside it, and the near place (drawn after the far one) is in front of the whole span. */
VN.BRIDGES = [
  { kind: 'hump', ax: 'x', c: -50, b: -100, o: { name: 'ponte zanipolo' } },
  { kind: 'hump', ax: 'x', c: -50, b: 0, o: { name: 'ponte formosa', rail: 'iron' } },
  { kind: 'hump', ax: 'y', c: -50, b: -100, o: { name: 'ponte mendicanti', rail: 'iron' } },
  { kind: 'hump', ax: 'y', c: -50, b: 0, o: { name: 'ponte cannaregio' } },
  { kind: 'hump', ax: 'y', c: -50, b: 100, o: { name: 'ponte squero', rail: 'iron' } },
  { kind: 'hump', ax: 'y', c: 50, b: -100, o: { name: 'ponte riva' } },
  { kind: 'hump', ax: 'y', c: 50, b: -25, o: { name: 'ponte leoncini' } },
  { kind: 'hump', ax: 'y', c: 50, b: 100, o: { name: 'ponte salute', rail: 'iron' } },
  { kind: 'hump', ax: 'x', c: -50, b: 132, o: { name: 'ponte della paglia', W: 3.0, HS: 3.4, HC: 4.6, AR: 6.2, body: '#E9E3D6' } },
  { kind: 'rialto', ax: 'x', c: 50, b: 0 },
  { kind: 'sighs', ax: 'x', c: -50, b: 110 },
];
VN.BR = {};
VN.bridgeParts = function (T) {
  for (const B of VN.BRIDGES) {
    const along = Math.round(B.b / 100) * 100, far = B.ax === 'x' ? [along, B.c - 50] : [B.c - 50, along], near = B.ax === 'x' ? [along, B.c + 50] : [B.c + 50, along];
    const role = T.cx === far[0] && T.cy === far[1] ? 'far' : T.cx === near[0] && T.cy === near[1] ? 'near' : null;
    if (!role) continue;
    if (B.kind === 'hump') { const r = VN.hump(T, B.ax, B.c, B.b, B.o, role); VN.BR[B.o.name] = r; }
    else if (B.kind === 'rialto') VN.rialto(T, role);
    else if (B.kind === 'sighs' && role === 'far') VN.sighs(T);
  }
};
/* the floating stops, built by the place whose bank they are moored to (world coordinates) */
VN.STOPS = [['x', -116, 37, "CA' D'ORO"], ['x', -16, 37, 'RIALTO'], ['x', 86, 37, 'VALLARESSO'], ['y', -112, 137, 'S. ZACCARIA'], ['y', 26, 137, 'GIARDINETTI']];
VN.stopsFor = function (T) {
  VN.STOPS.forEach(([ax, a, b0, name], i) => {
    const cx = ax === 'x' ? Math.round(a / 100) * 100 : b0 - 37, cy = ax === 'x' ? b0 - 37 : Math.round(a / 100) * 100;
    if (T.cx !== cx || T.cy !== cy) return;
    const al = ax === 'x' ? a - T.cx : a - T.cy, bl = ax === 'x' ? b0 - T.cy : b0 - T.cx;
    VN.pontoon(T, ax, al, bl, name, VN.waiting(i + 1, ax, 2 + (i % 3)));
  });
};
VN.waiting = (seed, ax, n) => (g, A0, A1, b0, B1, z) => {
  const ps = []; for (let i = 0; i < n; i++) ps.push([A1 - 3.4 + (i % 2) * 1.5 + (i > 1 ? 0.6 : 0), b0 + 2.4 + (i % 3) * 0.45]);
  ps.sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]));
  ps.forEach(([u, v], i) => { const w = i % 3 === 2 ? VN.carnival(seed * 7 + i, i % 2 ? 'volto' : 'cape') : VN.who(seed * 7 + i); VN.person(g, ax === 'x' ? u : v, ax === 'x' ? v : u, z, Object.assign({}, w, { dir: ax === 'x' ? 1 : 0, pose: i % 2 ? 'hold' : 'stand' })); });
};
VN.finish = function (T) { VN.bridgeParts(T); VN.stopsFor(T); };
