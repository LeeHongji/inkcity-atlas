'use strict';
/* The canals: the street grid of this city. Places stand on the 100 u grid (half 37); every gap between them is a
   canal 26 u wide from bank to bank, its water VN.WL below the paving; round the whole city lies the lagoon.
     the Grand Canal   along x at y = +50 (Cannaregio / Rialto / San Marco on its far bank, the squero, the market and
                       the Salute on its near bank), opening into the Bacino at the lower right;
     rio di Palazzo    along x at y = -50 (its last stretch between the Doge's Palace and the prisons, under the Bridge
                       of Sighs and the Ponte della Paglia);
     two rii           along y at x = -50 and x = +50;
     the lagoon        beyond every outer bank (the Bacino di San Marco along the lower right edge).
   A canal is described by its axis ('x': it runs along x at y = c; 'y': along y at x = c). Across a canal, v is the
   offset from its centre line (bank at v = +-13); along it, u.
   Bridges cross where two places' lanes meet; boats run lanes on a timetable (VN.LANES, checked offline by
   tools/search_boats.mjs so no two hulls ever meet, crossings and stops included). */
VN.CW = 13;   // half width of a canal, bank to bank
VN.map = function (ax, c, b) { return ax === 'x' ? (u, v, z) => [b + u, c + v, z] : (u, v, z) => [c + v, b + u, z]; };

/* ---------- a humpbacked bridge ----------
   Brick body with Istrian stone on the arch ring, the string course and the parapet caps; steps all the way up and
   down onto the banks (the ramps reach RY into each place, so the places keep a calle free there).
   Built as standing objects back to front so boats pass under it and people cross over it: the far ramp, the vault
   (the arch's inside seen through the opening), the span ({ under: 0 }), the near ramp, then the near parapet in three
   pieces ({ on: true }) so a walker on the steps is behind it. The face we see is at u = +W ('R' for a canal along x,
   'L' for one along y). o: { W, RY, HS, HC, AR, body, rail: 'brick' | 'iron' }.
   Returns { z(v), M, W, RY } for walkers. */
VN.hump = function (T, ax, c, b, o, role) {
  o = o || {}; role = role || 'both';
  const O = (part, fpp, fn, opt) => { const own = (part === 'near' || part === 'pc') ? 'near' : 'far'; if (role === 'both' || role === own) T.obj(fpp, fn, opt); };
  const W = o.W || 2.4, RY = o.RY || 22, HS = o.HS || 4.4, HC = o.HC || 6.1, AR = o.AR || 7.3, Y = VN.CW, WL = VN.WL;
  const M = VN.map(ax, c, b), PW = 0.55, PH = 1.3, RISE = 0.4;
  const body = o.body || VN.brick, lit = ax === 'y', bodyF = lit ? shade(body, -0.02) : shade(body, 0.1), stone = VN.istria, stoneD = VN.istriaD;
  const deck = (v) => { const a = Math.abs(v); if (a >= RY) return 0; if (a >= Y) return HS * (RY - a) / (RY - Y); return HC - (HC - HS) * (a / Y) * (a / Y); };
  const step = (v) => Math.round(deck(v) / RISE) * RISE;
  const arch = (v) => WL + AR * Math.sqrt(Math.max(0, 1 - (v / Y) * (v / Y)));
  const treads = []; { let va = -RY - 0.6, z = 0; for (let v = -RY; v <= RY + 0.001; v += 0.05) { const s = Math.abs(v) >= RY ? 0 : Math.max(RISE, step(v)); if (Math.abs(s - z) > 1e-6) { treads.push([va, v, z]); va = v; z = s; } } treads.push([va, RY + 0.6, 0]); }
  const vr = (a, bb, n) => { const r = []; for (let i = 0; i <= n; i++) r.push(lerp(a, bb, i / n)); return r; };
  const fp = (u0, v0, u1, v1) => { const A = M(u0, v0, 0), B = M(u1, v1, 0); return [Math.min(A[0], B[0]) - T.cx, Math.min(A[1], B[1]) - T.cy, Math.max(A[0], B[0]) - T.cx, Math.max(A[1], B[1]) - T.cy]; };
  const L = (pts) => pts.map((p) => { const q = M(p[0], p[1], p[2]); return [q[0] - T.cx, q[1] - T.cy, q[2]]; });
  const farWall = (g, va, vb) => {
    const vs = vr(va, vb, 14), ui = -W + PW;
    g.fill(L(vs.map((v) => [ui, v, step(v) - 0.3]).concat(vs.slice().reverse().map((v) => [ui, v, deck(v) + PH]))), shade(body, 0.04));
    g.fill(L(vs.map((v) => [-W, v, deck(v) + PH]).concat(vs.slice().reverse().map((v) => [ui, v, deck(v) + PH]))), stone);
    g.line(L(vs.map((v) => [ui, v, deck(v) + PH])), { w: 0.55, c: '#5E4A3C', boil: false });
  };
  const steps = (g, va, vb) => {
    let prev = null;
    for (const [a, bb, z] of treads) {
      if (bb <= va + 1e-6 || a >= vb - 1e-6) { prev = z; continue; }
      const A = Math.max(a, va), B = Math.min(bb, vb);
      if (prev != null && z < prev && a >= va - 1e-6) { g.fill(L([[-W + PW, A, z], [W - PW, A, z], [W - PW, A, prev], [-W + PW, A, prev]]), stoneD); g.line(L([[-W + PW, A, prev], [W - PW, A, prev]]), { w: 0.35, boil: false, c: '#8E877A' }); }
      g.fill(L([[-W + PW, A, z], [W - PW, A, z], [W - PW, B, z], [-W + PW, B, z]]), z > 0 ? '#E7E2D6' : VN.paveC);
      if (z > 0) g.fine(L([[-W + PW, B, z], [W - PW, B, z]]), { w: 0.28, c: '#B9B2A4' });
      prev = z;
    }
  };
  const sideWall = (g, va, vb) => {
    const vs = vr(va, vb, 12);
    g.fill(L(vs.map((v) => [W, v, 0]).concat(vs.slice().reverse().map((v) => [W, v, deck(v)]))), bodyF);
    const br = []; for (let z = 0.7; z < HS; z += 0.7) for (let v = va + (z * 1.7) % 1.4; v < vb - 0.8; v += 1.4) { if (deck(v + 0.8) < z + 0.3) continue; const a = g.p.apply(g, L([[W, v, z]])[0]), e = g.p.apply(g, L([[W, v + 0.8, z]])[0]); br.push(a[0], a[1], e[0], e[1]); }
    g.segs2(br, shade(body, 0.26), 0.28);
    g.fill(L(vs.map((v) => [W + 0.05, v, deck(v) - 0.4]).concat(vs.slice().reverse().map((v) => [W + 0.05, v, deck(v)]))), stoneD);
    g.line(L(vs.map((v) => [W, v, deck(v)])), { w: 0.7, boil: false });
  };
  const nearWall = (g, va, vb, endA, endB) => {
    const vs = vr(va, vb, 14), ui = W - PW;
    g.fill(L(vs.map((v) => [W + 0.05, v, deck(v) - 0.05]).concat(vs.slice().reverse().map((v) => [W + 0.05, v, deck(v) + PH]))), bodyF);
    if (o.rail === 'iron') { const rl = []; for (let i = 0; i < vs.length; i++) { const a = g.p.apply(g, L([[W + 0.06, vs[i], deck(vs[i]) + 0.35]])[0]), e = g.p.apply(g, L([[W + 0.06, vs[i], deck(vs[i]) + PH - 0.15]])[0]); rl.push(a[0], a[1], e[0], e[1]); } g.segs2(rl, '#3A3F3C', 0.3); }
    else { const br = []; for (let i = 0; i < vs.length - 1; i += 2) { const v = vs[i], a = g.p.apply(g, L([[W + 0.06, v, deck(v) + PH * 0.5]])[0]), e = g.p.apply(g, L([[W + 0.06, v + 0.7, deck(v + 0.7) + PH * 0.5]])[0]); br.push(a[0], a[1], e[0], e[1]); } g.segs2(br, shade(body, 0.28), 0.28); }
    g.fill(L(vs.map((v) => [ui, v, deck(v) + PH]).concat(vs.slice().reverse().map((v) => [W + 0.1, v, deck(v) + PH + 0.05]))), stone);
    for (const [e, on] of [[va, endA], [vb, endB]]) if (on) { const q = L([[ui, e, 0], [W + 0.05, e, 0], [W + 0.05, e, PH], [ui, e, PH]]); g.fill(q, stone); g.outline(q, { w: 0.5 }); const lp = L([[W - PW / 2, e, PH + 1.0]])[0]; VN.glowDry(g, 'lamp', lp[0], lp[1], lp[2], { r: 1.4 }); }   // at night a lantern on each end post (no reflection: the bridge stands over the water beside it)
    g.line(L(vs.map((v) => [W + 0.1, v, deck(v) + PH + 0.05])), { w: 0.85, boil: false });
    g.line(L(vs.map((v) => [ui, v, deck(v) + PH])), { w: 0.5 });
    g.line(L(vs.map((v) => [W + 0.05, v, deck(v) - 0.05])), { w: 0.55, c: '#6E5040' });
  };
  const nm = o.name || 'ponte';
  O('far', fp(-W, -RY - 0.6, W, -Y), (g) => { g.boilP = 0.25; farWall(g, -RY, -Y); steps(g, -RY - 0.6, -Y); sideWall(g, -RY, -Y); }, { name: nm + ' far' });
  O('vault', fp(-W, -Y, W, Y), function (g) {
    const vs = vr(-Y, Y, 24);
    const N = g.P(L(vs.map((v) => [W, v, arch(v)]))), Fp = g.P(L(vs.map((v) => [-W, v, arch(v)])));
    const sgn = VN.area(Fp) > 0 ? 1 : -1;
    for (let i = 0; i < Fp.length; i++) { const a = Fp[i], e = Fp[(i + 1) % Fp.length], piece = VN.clip(N, a, e, -sgn); if (piece.length >= 3) g.fill2(piece, i === Fp.length - 1 ? VN.waterD : '#7E5E4E', true); }
    const inside = Fp.filter((p) => pointInPoly(p[0], p[1], N.flat()));
    if (inside.length > 1) g.line2(inside, { w: 0.45, c: '#4A3A30', boil: false });
  }, { name: nm + ' vault' });
  O('span', fp(-W, -Y, W, Y), function (g) {
    g.boilP = 0.25;
    farWall(g, -Y, Y); steps(g, -Y, Y);
    const h1v = vr(-Y, 0, 12), h2v = vr(0, Y, 12);
    for (const half of [h1v, h2v]) g.fill(L(half.map((v) => [W, v, deck(v)]).concat(half.slice().reverse().map((v) => [W, v, arch(v)]))), bodyF);
    const br = []; for (let z = WL + 0.7; z < HC; z += 0.7) for (let v = -Y + (z * 1.3) % 1.4; v < Y - 0.8; v += 1.4) { if (z < arch(v) + 1.0 && z < arch(v + 0.8) + 1.0) continue; if (deck(v) < z + 0.5) continue; const a = g.p.apply(g, L([[W, v, z]])[0]), e = g.p.apply(g, L([[W, v + 0.8, z]])[0]); br.push(a[0], a[1], e[0], e[1]); }
    g.segs2(br, shade(body, 0.26), 0.28);
    const ring = vr(-Y, Y, 28), inner = ring.map((v) => [W + 0.04, v, arch(v)]), outer = ring.map((v) => [W + 0.04, v, Math.min(deck(v) - 0.5, arch(v) + 0.9)]);
    g.fill(L(inner.concat(outer.slice().reverse())), stone);
    const vj = []; for (let i = 1; i < ring.length - 1; i += 2) { const a = g.p.apply(g, L([inner[i]])[0]), e = g.p.apply(g, L([outer[i]])[0]); vj.push(a[0], a[1], e[0], e[1]); } g.segs2(vj, stoneD, 0.35);
    g.line(L(inner), { w: 0.8, boil: false }); g.line(L(outer), { w: 0.45, c: '#8E877A', boil: false });
    const all = h1v.concat(h2v.slice(1));
    g.fill(L(all.map((v) => [W + 0.05, v, deck(v) - 0.4]).concat(all.slice().reverse().map((v) => [W + 0.05, v, deck(v)]))), stoneD);
    g.line(L(all.map((v) => [W, v, deck(v)])), { w: 0.7, boil: false });
    const ks = L([[W + 0.06, -0.6, arch(0) - 0.1], [W + 0.06, 0.6, arch(0) - 0.1], [W + 0.06, 0.8, arch(0) + 0.9], [W + 0.06, -0.8, arch(0) + 0.9]]); g.fill(ks, '#FFFFFF'); g.outline(ks, { w: 0.4, boil: false });
  }, { name: nm + ' span', under: 0 });
  O('near', fp(-W, Y, W, RY + 0.6), (g) => { g.boilP = 0.25; farWall(g, Y, RY); steps(g, Y, RY + 0.6); sideWall(g, Y, RY); const e = L([[-W, RY, 0], [-W + PW, RY, 0], [-W + PW, RY, PH], [-W, RY, PH]]); g.fill(e, stone); g.outline(e, { w: 0.5 }); }, { name: nm + ' near' });
  O('pa', fp(W - PW, -RY, W, -Y), (g) => nearWall(g, -RY, -Y, true, false), { on: true, name: nm + ' parapet a' });
  O('pb', fp(W - PW, -Y, W, Y), (g) => nearWall(g, -Y, Y, false, false), { on: true, name: nm + ' parapet b' });
  O('pc', fp(W - PW, Y, W, RY), (g) => nearWall(g, Y, RY, false, true), { on: true, name: nm + ' parapet c' });
  return { z: (v) => (Math.abs(v) >= RY ? 0 : Math.max(RISE, step(v))), deck, M, W, RY };
};

/* ---------- a floating vaporetto stop (imbarcadero) moored off a far bank ----------
   A grey pontoon, a yellow-and-white cabin with its name board, a roof over the waiting area, people waiting.
   ax 'x': the bank runs along x at y = b0 and the pontoon reaches out to b0 + 3.6 in y; ax 'y': the bank runs along
   y at x = b0. a: its centre along the bank (tile-local). */
VN.pontoon = function (T, ax, a, b0, name, wait) {
  const A0 = a - 6, A1 = a + 6, B1 = b0 + 3.6, z = VN.WL + 0.9, X = ax === 'x';
  const R = (u0, v0, u1, v1) => X ? [u0, v0, u1, v1] : [v0, u0, v1, u1], face = X ? 'L' : 'R';
  const box = (g, u0, v0, u1, v1, z0, z1, col, o) => { const r = R(u0, v0, u1, v1); K.box(g, r[0], r[1], r[2], r[3], z0, z1, col, o); };
  T.obj(R(A0, b0, A1, B1), function (g) {
    g.boilP = 0.2;
    box(g, A0, b0 + 0.2, A1, B1, VN.WL - 0.1, z, { t: '#8E9690', l: '#6E7670', r: '#5E6660' }, { w: 0.7 });
    const r = R(A0 + 0.2, b0 + 0.4, A1 - 0.2, B1 - 0.2); g.fill(K.rect(r[0], r[1], r[2], r[3], z + 0.02), '#A9AEA6');
    box(g, A0 + 1.2, b0 + 0.5, A1 - 4.4, b0 + 2.0, z, z + 4.6, { t: '#E9E4D8', l: '#F3F0E6', r: '#DAD5C8' }, { w: 0.6 });
    g.fill(K.on(face, b0 + 2.01, A0 + 1.2, A1 - 4.4, z, z + 1.3), '#E6C24F');
    for (let u = A0 + 2; u < A1 - 5; u += 2.2) K.win(g, face, b0 + 2.0, u, u + 1.4, z + 1.8, z + 3.8, { style: 'glass' });
    if (wait) wait(g, A0, A1, b0, B1, z);
    box(g, A0 + 0.6, b0 + 0.2, A1 - 0.6, B1 - 0.3, z + 4.6, z + 5.1, { t: '#C9C4B8', l: '#E6C24F', r: '#C9A43A' }, { w: 0.55 });
    { const i0 = g.cmds.length; K.sign(g, face, B1 - 0.29, A0 + 1.4, A1 - 1.4, z + 4.62, z + 5.08, '#E6C24F', name, { ink: '#2A2622' }); g.mark({ nc: true }, i0); }
    // at night: lamps under the roof (at the Rialto and the Ca' d'Oro they keep no reflection: on screen the bridge, the
    // houses across the canal stand over the water in front)
    // (the Rialto stop's downstream lamp would shine through the bridge's shops in front of it: it has none)
    for (const u of [A0 + 2.2, A1 - 2.2]) { const q = X ? [u, B1 - 0.7] : [B1 - 0.7, u]; if (name === 'RIALTO' && u > a) continue; if (name === 'RIALTO' || name === "CA' D'ORO") VN.glowDry(g, 'lamp', q[0], q[1], z + 4.2, { r: 1.3 }); else g.glow('lamp', q[0], q[1], z + 4.2, { r: 1.3, base: z }); }
    const ps = []; for (let u = A0 + 0.8; u < A1; u += 2.6) { const q = X ? [u, B1 - 0.4] : [B1 - 0.4, u], p0 = g.p(q[0], q[1], z), p1 = g.p(q[0], q[1], z + 4.6); ps.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(ps, '#5E6660', 0.4);
  }, { name: 'imbarcadero' });
};

/* ---------- the timetable ----------
   Every lane is periodic with VN.P seconds; boats in one lane share its speed (so they never close on each other);
   phases are chosen offline so that boats on crossing lanes never overlap (tools/search_boats.mjs).
   lane: { ax, c, v (offset across), dir (+1: towards +u), a0, a1 (u range, faded at the ends), boats: [kind, ...],
           ph (s), stops: [u, ...] (vaporetti: dwell VN.DWELL s at each) } */
VN.P = 80;
VN.DWELL = 4.5;
VN.LANES = [
  // the Grand Canal (y = 50): vaporetto line 1 northbound stopping at the far-bank stops; a working lane; southbound
  { id: 'gc1', ax: 'x', c: 50, v: -6.8, dir: -1, a0: -160, a1: 162, boats: ['vaporetto', 'vaporetto'], stops: [86, -16, -116], ph: 13.5 },
  { id: 'gc2', ax: 'x', c: 50, v: -1.6, dir: -1, a0: -160, a1: 162, boats: ['gondola', 'topo'], ph: 30.5 },
  { id: 'gc3', ax: 'x', c: 50, v: 3.4, dir: 1, a0: -160, a1: 162, boats: ['vaporetto', 'rifiuti'], ph: 34 },
  // rio di Palazzo (y = -50)
  { id: 'rp1', ax: 'x', c: -50, v: -4.6, dir: -1, a0: -160, a1: 162, boats: ['gondola', 'gondola', 'topo'], ph: 18.5 },
  { id: 'rp2', ax: 'x', c: -50, v: 2.6, dir: 1, a0: -160, a1: 162, boats: ['gondola', 'taxi'], ph: 12 },
  // the rii along y (x = -50 and x = +50); a boat going +y keeps to the far side
  { id: 'ra1', ax: 'y', c: -50, v: -4.6, dir: 1, a0: -160, a1: 160, boats: ['gondola', 'topo'], ph: 0 },
  { id: 'ra2', ax: 'y', c: -50, v: 2.6, dir: -1, a0: -160, a1: 160, boats: ['gondola', 'rifiuti'], ph: 26.3 },
  { id: 'rb1', ax: 'y', c: 50, v: -4.6, dir: 1, a0: -160, a1: 160, boats: ['gondola', 'taxi'], ph: 60.2 },
  { id: 'rb2', ax: 'y', c: 50, v: 2.6, dir: -1, a0: -160, a1: 160, boats: ['gondola', 'topo'], ph: 21.5 },
  // the Bacino along the lower right edge (x = 152): the vaporetto calls at San Zaccaria and the Giardinetti
  { id: 'bc0', ax: 'y', c: 152, v: -9.2, dir: 1, a0: -158, a1: 160, boats: ['vaporetto'], stops: [-112, 26], ph: 0 },
  { id: 'bc1', ax: 'y', c: 152, v: -3, dir: 1, a0: -158, a1: 160, boats: ['taxi', 'sandolo', 'gondola'], ph: 29 },
  { id: 'bc2', ax: 'y', c: 152, v: 4, dir: -1, a0: -158, a1: 160, boats: ['taxi', 'ambulanza', 'topo'], ph: 36 },
  // the lagoon along the lower left edge (y = 152)
  { id: 'lg1', ax: 'x', c: 152, v: -6, dir: -1, a0: -158, a1: 160, boats: ['taxi', 'sandolo'], ph: 77 },
  { id: 'lg2', ax: 'x', c: 152, v: 2, dir: 1, a0: -158, a1: 160, boats: ['vaporetto', 'topo'], ph: 19.4 },
];
/* distance travelled along a lane after tau seconds into its period (0..P): constant speed, or with stops */
VN.laneS = function (ln, tau) {
  const span = ln.a1 - ln.a0 + 24;
  if (!ln.stops) return span * tau / VN.P;
  // positions of the stops along the lane (s from its start), the moving time shared by segment length
  if (!ln._seg) {
    const ss = ln.stops.map((u) => (ln.dir > 0 ? u - ln.a0 + 12 : ln.a1 + 12 - u)).sort((a, b) => a - b), pts = [0].concat(ss, [span]);
    const move = VN.P - VN.DWELL * ss.length, segs = []; let t = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const len = pts[i + 1] - pts[i], k = (i === 0 || i === pts.length - 2) ? 1.25 : 1.5, dur = 0;
      segs.push({ s0: pts[i], s1: pts[i + 1], w: len * k, first: i === 0, last: i === pts.length - 2, dur });
    }
    const tw = segs.reduce((a, s) => a + s.w, 0);
    for (const s of segs) { s.dur = move * s.w / tw; s.t0 = t; t += s.dur; if (!s.last) t += VN.DWELL; }
    ln._seg = segs;
  }
  for (const s of ln._seg) {
    if (tau < s.t0) return s.s0;                               // dwelling at the stop before this segment
    if (tau <= s.t0 + s.dur) { const x = (tau - s.t0) / s.dur, e = s.first ? 1 - (1 - x) * (1 - x) : s.last ? x * x : x * x * (3 - 2 * x); return s.s0 + (s.s1 - s.s0) * e; }
  }
  return span;
};
/* the state of boat k of a lane at time t: world x, y, heading, fade, moving */
VN.boatAt = function (ln, k, t) {
  const n = ln.boats.length, span = ln.a1 - ln.a0 + 24;
  const tau = ((((t + ln.ph + k * VN.P / n) % VN.P) + VN.P) % VN.P);
  const s = VN.laneS(ln, tau), u = ln.dir > 0 ? ln.a0 - 12 + s : ln.a1 + 12 - s;
  const fade = clamp(Math.min(u - ln.a0, ln.a1 - u) / 10, 0, 1);
  const M = VN.map(ln.ax, ln.c, 0), p = M(u, ln.v, 0);
  const ang = ln.ax === 'x' ? (ln.dir > 0 ? 0 : Math.PI) : (ln.dir > 0 ? Math.PI / 2 : -Math.PI / 2);
  return { x: p[0], y: p[1], ang, alpha: fade, u, span };
};
/* the time into its period at which a lane's first boat comes to rest at stop u */
VN.stopTau = function (ln, u) {
  VN.laneS(ln, 0); const s0 = ln.dir > 0 ? u - ln.a0 + 12 : ln.a1 + 12 - u;
  for (const s of ln._seg) if (Math.abs(s.s1 - s0) < 1e-6) return s.t0 + s.dur;
  return 0;
};
{ const ln = VN.LANES.find((l) => l.id === 'gc1'); VN.RIALTO_T = VN.stopTau(ln, -16) - 1.2 - ln.ph; }
