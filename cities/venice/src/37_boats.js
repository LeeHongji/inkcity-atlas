'use strict';
/* Venice's boats: all traffic floats. Every boat is drawn in pieces along its length (u from -L at the stern to +L at
   the bow), one actor per piece anchored at the piece's end nearest the viewer, so a boat half under a bridge is right
   at both faces of the arch (VN.boatActors). A piece draws only what lies between its u0 and u1.
   Kinds: gondola (black, the gondolier standing on the stern rowing with one oar in the forcola, riders on the red
   seat), vaporetto (the ACTV water bus: dark hull ringed with fenders, white cabin, wheelhouse, people on the
   fore-deck), topo (a delivery barge with crates and a boatman at the tiller), rifiuti (the rubbish boat with its skip
   and crane), ambulanza (white and orange, blue light flashing), taxi (varnished mahogany, cream cabin), sandolo (a
   small boat rowed standing up, Venetian style). */
VN.BOAT = {
  gondola: { L: 6.0, W: 0.78 }, vaporetto: { L: 8.4, W: 2.0 }, topo: { L: 4.6, W: 1.45 }, rifiuti: { L: 5.0, W: 1.6 },
  ambulanza: { L: 4.0, W: 1.3 }, taxi: { L: 3.9, W: 1.25 }, sandolo: { L: 3.6, W: 0.8 },
};

/* a box on the boat's frame between u = a..b (clipped to the piece), v = -hw..hw, z0..z1; ends drawn only where real */
VN.pieceBox = function (g, F, a, b, u0, u1, hw, z0, z1, col, o) {
  o = o || {}; const A = Math.max(a, u0), B = Math.min(b, u1); if (B - A < 0.02) return null;
  const c = K.tones(col), q = (u, v, z) => F.pt(u, v, z), lw = { w: o.w || 0.55, boil: false, c: o.c };
  const faces = [];
  if (F.nearV) faces.push({ f: [q(A, F.nearV * hw, z0), q(B, F.nearV * hw, z0), q(B, F.nearV * hw, z1), q(A, F.nearV * hw, z1)], col: F.nearV * F.lit > 0 ? c.l : c.r, side: true });
  const endU = F.frontU > 0 ? B : A, real = F.frontU > 0 ? B >= b - 1e-6 : A <= a + 1e-6;
  if (real) faces.push({ f: [q(endU, -hw, z0), q(endU, hw, z0), q(endU, hw, z1), q(endU, -hw, z1)], col: F.endLit ? c.l : c.r });
  for (const fc of faces) g.fill(fc.f, fc.col);
  const top = [q(A, -hw, z1), q(B, -hw, z1), q(B, hw, z1), q(A, hw, z1)];
  g.fill(top, c.t);
  // outlines: the visible long edges, the real ends
  g.line([q(A, F.nearV * hw, z1), q(B, F.nearV * hw, z1)], lw); g.line([q(A, F.nearV * hw, z0), q(B, F.nearV * hw, z0)], lw);
  g.line([q(A, -F.nearV * hw, z1), q(B, -F.nearV * hw, z1)], lw);
  if (real) { g.line([q(endU, -hw, z1), q(endU, hw, z1)], lw); g.line([q(endU, F.nearV * hw, z0), q(endU, F.nearV * hw, z1)], lw); g.line([q(endU, -hw, z1), q(endU, -hw, z0)], Object.assign({}, lw, { w: (o.w || 0.55) * 0.8 })); }
  const backReal = F.frontU > 0 ? A <= a + 1e-6 : B >= b - 1e-6, bu = F.frontU > 0 ? A : B;
  if (backReal) g.line([q(bu, F.nearV * hw, z0), q(bu, F.nearV * hw, z1)], lw);
  return { A, B, faces, q };
};
/* the frame of a boat heading ang: pt(u, v, z) in drawing coords (boat centre at the origin) and which sides show */
VN.frame = function (ang) {
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const nvx = -sa, nvy = ca;                         // +v normal
  return { ca, sa, pt: (u, v, z) => [u * ca - v * sa, u * sa + v * ca, z], nearV: nvx + nvy > 0 ? 1 : -1, lit: nvy - nvx > 0 ? 1 : -1, frontU: ca + sa > 0 ? 1 : -1, endLit: (ca + sa > 0 ? sa - ca : ca - sa) > 0 };
};
/* a hull between u0..u1: wid(u), sheer(u) (gunwale height above the water), colours */
VN.hull = function (g, F, u0, u1, L, wid, sheer, o) {
  const n = Math.max(2, Math.ceil((u1 - u0) / 0.5)), us = []; for (let i = 0; i <= n; i++) us.push(lerp(u0, u1, i / n));
  const side = (s) => us.map((u) => F.pt(u, s * wid(u), sheer(u))).concat(us.slice().reverse().map((u) => F.pt(u, s * wid(u) * 0.86, 0)));
  // foam along the hull on the water, a wake behind the stern
  g.fill(us.map((u) => F.pt(u, wid(u) * 1.25 + 0.15, 0)).concat(us.slice().reverse().map((u) => F.pt(u, -wid(u) * 1.25 - 0.15, 0))), o.foam || '#DCEBE5');
  if (u0 <= -L + 0.01 && o.wake) { const w0 = wid(-L * 0.9) + 0.2; for (const s of [-1, 1]) g.line([F.pt(-L * 0.9, s * w0, 0), F.pt(-L - o.wake * 0.5, s * (w0 + o.wake * 0.18), 0), F.pt(-L - o.wake, s * (w0 + o.wake * 0.32), 0)], { w: 0.5, c: '#E4EFEA', boil: false, ext: 0, taper: 1 }); g.fill([F.pt(-L, w0 * 0.7, 0), F.pt(-L - o.wake * 0.45, 0, 0), F.pt(-L, -w0 * 0.7, 0)], '#CFE2DA'); }
  g.fill(side(-F.nearV), shade(o.col, 0.25));                       // the far side's inside
  if (o.floor !== false) g.fill(us.map((u) => F.pt(u, wid(u) * 0.84, o.floorZ || 0.5)).concat(us.slice().reverse().map((u) => F.pt(u, -wid(u) * 0.84, o.floorZ || 0.5))), o.floor || '#6B4A34');
  return { us, near: () => {
    g.fill(side(F.nearV), F.nearV * F.lit > 0 ? o.col : shade(o.col, 0.1));
    if (o.stripe) g.fill(us.map((u) => F.pt(u, F.nearV * wid(u) * 1.002, sheer(u) - (o.stripeW || 0.35))).concat(us.slice().reverse().map((u) => F.pt(u, F.nearV * wid(u) * 1.002, sheer(u)))), o.stripe);
    g.line(us.map((u) => F.pt(u, F.nearV * wid(u), sheer(u))), { w: 0.55, c: o.gun || '#2A2622', boil: false, ext: 0 });
    g.line(us.map((u) => F.pt(u, F.nearV * wid(u) * 0.86, 0)), { w: 0.6, c: '#1F1C1D', boil: false, ext: 0 });
    g.line(us.map((u) => F.pt(u, -F.nearV * wid(u), sheer(u))), { w: 0.4, c: '#2A2622', boil: false, ext: 0 });
  } };
};
/* someone standing (or sitting) on board at (u, v) with deck height z, facing the way the boat goes (or back) */
VN.aboard = function (g, F, u, v, z, w, o) {
  o = o || {}; const p = F.pt(u, v, z), fa = o.back ? -1 : 1;
  const bx = F.ca * fa, by = F.sa * fa, d = (bx + by > 0) ? (bx - by > 0 ? 0 : 1) : (bx - by > 0 ? 3 : 2);
  return VN.person(g, p[0], p[1], p[2], Object.assign({}, w, { dir: d }, o.pose ? { pose: o.pose } : {}, o.x || {}));
};

/* ---------- the kinds ---------- */
VN.drawBoat = function (g, kind, ang, u0, u1, o) {
  o = o || {}; const F = VN.frame(ang), D = VN.BOAT[kind], L = D.L, W = D.W;
  if (kind === 'gondola') return VN.gondola(g, F, u0, u1, o);
  if (kind === 'vaporetto') {
    const wid = (u) => W * Math.pow(Math.max(0, 1 - Math.pow(Math.max(0, u - L * 0.55) / (L * 0.47), 2)), 0.5) * (u < -L * 0.85 ? 0.92 : 1);
    const sh = () => 1.3;
    const H = VN.hull(g, F, Math.max(u0, -L), Math.min(u1, L), L, wid, sh, { col: '#3D444C', floor: '#C9C4B8', floorZ: 1.3, wake: 3.2, stripe: '#F2EFE7', stripeW: 0.3, gun: '#1F2226' });
    // passengers on the open fore-deck and the stern deck
    for (const [u, v, s] of [[6.2, 0.7, 1], [6.8, -0.6, 2], [5.6, -0.9, 3], [-7.0, 0.6, 4]]) if (u >= u0 && u < u1) VN.aboard(g, F, u, v, 1.3, VN.who((o.seed || 0) * 13 + s), { pose: 'stand', back: false });
    // the cabin: white with big windows, a pale roof, the wheelhouse forward on top
    const cb = VN.pieceBox(g, F, -L * 0.72, L * 0.55, u0, u1, W * 0.86, 1.3, 4.1, { t: '#DCDAD3', l: '#F4F2EC', r: '#D9D6CE' }, { w: 0.55 });
    if (cb) {
      const A = cb.A, B = cb.B, nv = F.nearV * W * 0.861, win = [];
      for (let u = -L * 0.68; u < L * 0.5; u += 1.55) { const a = Math.max(u, A), b = Math.min(u + 1.2, B); if (b - a < 0.15) continue; win.push([F.pt(a, nv, 2.3), F.pt(b, nv, 2.3), F.pt(b, nv, 3.7), F.pt(a, nv, 3.7)]); }
      for (const q of win) { g.fill(q, '#5E6E7A'); g.mark({ nc: '#FFEBC2' }); }   // at night the cabin is lit
      // heads inside behind the glass
      for (let u = -L * 0.6, i = 0; u < L * 0.45; u += 1.55, i++) if (u >= A && u + 0.5 < B && h1(i * 7 + (o.seed || 0)) < 0.7) { const p = g.p.apply(g, F.pt(u + 0.6, nv * 0.6, 2.75)); g.disc2(p, 0.95, SKIN[i % 5]); g.fill2([[p[0] - 1, p[1] - 0.3], [p[0] + 1, p[1] - 0.3], [p[0] + 0.9, p[1] - 1.2], [p[0] - 0.9, p[1] - 1.2]], HAIR[i % 6], true); }
      g.fill([F.pt(A, nv, 1.6), F.pt(B, nv, 1.6), F.pt(B, nv, 1.95), F.pt(A, nv, 1.95)], '#E6C24F');
      if (o.night) VN.boatGlints(g, F, win.map((q) => [q[0][0] * F.ca + q[0][1] * F.sa, q[1][0] * F.ca + q[1][1] * F.sa]), F.nearV * W * 1.02, 2.3, 3.7, '255,226,160', o.seed || 0);
    }
    VN.pieceBox(g, F, L * 0.05, L * 0.45, u0, u1, W * 0.55, 4.1, 5.3, { t: '#DCDAD3', l: '#F4F2EC', r: '#D9D6CE' }, { w: 0.5 });
    if (0.05 * L <= u1 && 0.45 * L >= u0) { const a = Math.max(L * 0.12, u0), b = Math.min(L * 0.4, u1); if (b > a) { g.fill([F.pt(a, F.nearV * W * 0.551, 4.4), F.pt(b, F.nearV * W * 0.551, 4.4), F.pt(b, F.nearV * W * 0.551, 5.0), F.pt(a, F.nearV * W * 0.551, 5.0)], '#4E5E6A'); g.mark({ nc: '#E9CF96' }); } }
    // the line number board on the wheelhouse
    if (L * 0.3 >= u0 && L * 0.3 < u1 && o.line) { const a0 = L * 0.22, a1 = L * 0.38; g.fill([F.pt(a0, F.nearV * W * 0.56, 5.4), F.pt(a1, F.nearV * W * 0.56, 5.4), F.pt(a1, F.nearV * W * 0.56, 6.4), F.pt(a0, F.nearV * W * 0.56, 6.4)], '#E6C24F'); g.mark({ nc: true, light: true }); const rt = F.ca - F.sa > 0; K.textP(g, (a, z) => F.pt(rt ? a0 + 0.35 + a : a1 - 0.35 - a, F.nearV * W * 0.57, z), 0, 5.6, 0.7, String(o.line), '#2A2622'); }
    // at night: the white masthead light over the wheelhouse, the side light (green to starboard, red to port)
    if (o.night && L * 0.3 >= u0 && L * 0.3 < u1) { VN.navLight(g, F.pt(L * 0.3, 0, 6.9), 0.5, '#FFF4D6'); VN.navLight(g, F.pt(L * 0.18, F.nearV * W * 0.6, 4.7), 0.38, F.nearV > 0 ? '#7CF0A0' : '#FF6A5A'); }
    // black fenders all round
    const fd = []; for (let u = Math.max(-L, u0); u < Math.min(L, u1); u += 0.7) { const a = g.p.apply(g, F.pt(u, F.nearV * wid(u), 0.9)); fd.push(a[0], a[1], a[0] + 0.01, a[1] + 1.2); }
    g.segs2(fd, '#1F2226', 1.2);
    H.near();
    return;
  }
  // working boats: a flat-decked hull with a square stern and a raked bow
  const spec = {
    topo: { col: '#4E7E92', stripe: '#EDE6D6', deck: '#B58F5E', sheer: 1.25 },
    rifiuti: { col: '#5E7F5E', stripe: '#E6C24F', deck: '#7E8478', sheer: 1.3 },
    ambulanza: { col: '#F3F1EA', stripe: '#D9542F', deck: '#E9E4D8', sheer: 1.35 },
    taxi: { col: '#9C5A34', stripe: '#E9DFC2', deck: '#B9784A', sheer: 1.15 },
    sandolo: { col: '#2E2A26', stripe: '#C9A44A', deck: '#7A5A3C', sheer: 0.8 },
  }[kind];
  const wid = (u) => W * (u > L * 0.35 ? Math.pow(Math.max(0, 1 - Math.pow((u - L * 0.35) / (L * 0.68), 2)), 0.55) : 1) * (u < -L * 0.9 ? 0.94 : 1);
  const sheer = (u) => spec.sheer + (u > L * 0.4 ? 0.35 * (u - L * 0.4) / (L * 0.6) : 0);
  const H = VN.hull(g, F, Math.max(u0, -L), Math.min(u1, L), L, wid, sheer, { col: spec.col, floor: spec.deck, floorZ: spec.sheer - 0.2, wake: o.fast ? 6 : 2.4, stripe: spec.stripe, stripeW: 0.3 });
  const has = (u) => u >= u0 && u < u1, items = [], add = (u, v, fn) => { if (has(u)) items.push([u, v, fn]); };
  if (kind === 'topo') {
    const cr = [[2.4, 0.55, 1.0, '#C9A26B'], [2.4, -0.6, 1.0, '#B58F5E'], [1.1, 0.55, 1.0, '#C9A26B'], [1.1, -0.6, 1.0, '#D9B57E'], [-0.2, 0, 1.6, '#C9A26B'], [-1.4, 0.55, 1.0, '#8FBF73'], [-1.4, -0.6, 1.0, '#C9A26B']];
    for (const [u, v, h, col] of cr) add(u, v, () => {
      const c = F.pt(u, v, 0); K.rbox(g, c[0], c[1], 0.55, 0.5, ang, spec.sheer - 0.1, spec.sheer - 0.1 + h, { t: shade(col, -0.2), l: col, r: shade(col, 0.12) }, { w: 0.45 });
      const top = g.p(c[0], c[1], spec.sheer - 0.1 + h), fr = ['#E0623F', '#8FBF73', '#E6C24F', '#C9463E'][Math.round(Math.abs(u * 3 + v * 7)) % 4];
      g.disc2([top[0] - 0.8, top[1] + 0.1], 0.8, fr); g.disc2([top[0] + 0.7, top[1] - 0.2], 0.8, fr); g.disc2([top[0], top[1] + 0.5], 0.8, shade(fr, 0.12));
    });
    add(-3.4, 0, () => VN.aboard(g, F, -3.4, 0, spec.sheer - 0.2, o.who || VN.who(o.seed || 5, { top: '#3F5F8F', beanie: '#3B3F47', colombina: null }), { pose: 'hold', x: { reach: [2.2, -9] } }));
  } else if (kind === 'rifiuti') {
    add(0, 0, () => {
      const sk = VN.pieceBox(g, F, -2.4, 2.2, u0, u1, W * 0.8, spec.sheer - 0.2, spec.sheer + 1.8, { t: '#6E7468', l: '#8C9486', r: '#737B6E' }, { w: 0.55 });
      if (sk) { const top = [F.pt(sk.A, -W * 0.7, spec.sheer + 1.8), F.pt(sk.B, -W * 0.7, spec.sheer + 1.8), F.pt(sk.B, W * 0.7, spec.sheer + 1.8), F.pt(sk.A, W * 0.7, spec.sheer + 1.8)]; g.fill(top, '#4A4E46'); for (let i = 0; i < 6; i++) { const u = lerp(-2, 1.8, h1(i * 3.1)), v = lerp(-0.9, 0.9, h1(i * 5.7)); if (u < sk.A || u > sk.B) continue; const p = g.p.apply(g, F.pt(u, v, spec.sheer + 2.1)); g.disc2(p, 1.1, ['#3B3F47', '#E9E2CC', '#5F8FC9'][i % 3]); } }
    });
    add(3.3, 0, () => { const b = F.pt(3.2, 0, spec.sheer), p0 = g.p.apply(g, b), p1 = g.p(b[0], b[1], spec.sheer + 5.2), p2 = g.p.apply(g, F.pt(0.6, 0, spec.sheer + 4.2)); g.line2([p0, p1], { w: 1.0, c: '#E6C24F', boil: false, ext: 0 }); g.line2([p1, p2], { w: 0.8, c: '#E6C24F', boil: false, ext: 0 }); g.fine2([p2, [p2[0], p2[1] + 4]], { w: 0.25, c: '#3A3530' }); g.fill2([[p2[0] - 1, p2[1] + 4], [p2[0] + 1, p2[1] + 4], [p2[0], p2[1] + 5.4]], '#3A3530', true); });
    add(-3.8, 0.2, () => VN.aboard(g, F, -3.8, 0.2, spec.sheer - 0.2, VN.who((o.seed || 7) + 1, { top: '#E07A3F', bot: '#3B3F47', beanie: '#3B3F47', colombina: null, scarf: null }), { pose: 'stand' }));
  } else if (kind === 'ambulanza' || kind === 'taxi') {
    const amb = kind === 'ambulanza';
    add(0, 0, () => {
      const cb = VN.pieceBox(g, F, -1.8, 1.4, u0, u1, W * 0.82, spec.sheer - 0.1, spec.sheer + 1.7, amb ? { t: '#E9E4D8', l: '#F6F4EE', r: '#DDD8CC' } : { t: '#E9DFC2', l: '#F1E9D2', r: '#D9CFB4' }, { w: 0.5 });
      if (cb) {
        const nv = F.nearV * W * 0.821;
        g.fill([F.pt(cb.A, nv, spec.sheer + 0.6), F.pt(cb.B, nv, spec.sheer + 0.6), F.pt(cb.B, nv, spec.sheer + 1.4), F.pt(cb.A, nv, spec.sheer + 1.4)], '#4E5E6A'); g.mark({ nc: amb ? '#E6F0FF' : '#FFDFA6' });
        if (o.night) VN.boatGlints(g, F, [[cb.A + 0.2, cb.B - 0.2]], F.nearV * W * 1.05, 0.9, 1.5, amb ? '220,232,255' : '255,214,150', (o.seed || 0) + 3);
        if (amb) g.fill([F.pt(cb.A, nv, spec.sheer + 0.1), F.pt(cb.B, nv, spec.sheer + 0.1), F.pt(cb.B, nv, spec.sheer + 0.45), F.pt(cb.A, nv, spec.sheer + 0.45)], '#D9542F');
      }
      if (has(0)) {
        const p = g.p.apply(g, F.pt(0, 0, spec.sheer + 1.7));
        if (amb) { const on = o.flash ? '#5F8FFF' : '#3F5F9F'; g.fill2([[p[0] - 0.8, p[1]], [p[0] + 0.8, p[1]], [p[0] + 0.6, p[1] - 1.2], [p[0] - 0.6, p[1] - 1.2]], on, true); if (o.flash) { g.mark({ nc: '#8FB4FF', light: true }); g.glow2('neon', [p[0], p[1] - 0.6], [p[0], -1e6], { r: 1.6, col: '#7FA6FF' }); } if (o.flash) g.segs2([p[0] - 2.4, p[1] - 0.9, p[0] - 1.2, p[1] - 0.7, p[0] + 1.2, p[1] - 0.7, p[0] + 2.4, p[1] - 0.9, p[0], p[1] - 1.6, p[0], p[1] - 2.8], '#9DB8FF', 0.4); }
        else { g.fill2([[p[0] - 1.6, p[1]], [p[0] + 1.6, p[1]], [p[0] + 1.6, p[1] - 1.2], [p[0] - 1.6, p[1] - 1.2]], '#E6C24F', true); g.mark({ nc: '#FFD45A', light: true }); g.segs2([p[0] - 1.1, p[1] - 0.6, p[0] + 1.1, p[1] - 0.6], '#2A2622', 0.4); }
      }
    });
    add(-2.8, 0, () => VN.aboard(g, F, -2.8, 0, spec.sheer - 0.2, o.who || VN.who((o.seed || 3) + 2, amb ? { top: '#D9542F', beanie: null, colombina: null, scarf: null } : { top: '#F3F1EA', bot: '#2F3A55', fedora: null, beanie: null, colombina: null }), { pose: 'stand' }));
    if (!amb && o.riders) add(2.4, 0.3, () => VN.aboard(g, F, 2.4, 0.3, spec.sheer - 0.3, o.riders[0], { pose: 'stand' }));
  } else if (kind === 'sandolo') {
    const ph = o.ph || 0, sw = Math.sin(ph * TAU);
    add(-2.2, 0, () => {
      const b = F.pt(-2.2, 0, spec.sheer - 0.3), lk = g.p.apply(g, F.pt(-1.5, F.nearV * W * 1.05, spec.sheer + 0.6)), bl = g.p.apply(g, F.pt(-3.4 - sw, F.nearV * W * 2.6, 0)), P = g.p.apply(g, b);
      const dx = lk[0] - bl[0], dy = lk[1] - bl[1], top = [lk[0] + dx * 0.7, lk[1] + dy * 0.7], rel = (q) => [(q[0] - P[0]), (q[1] - P[1])];
      VN.aboard(g, F, -2.2, 0, spec.sheer - 0.3, o.who || VN.carnival(o.seed || 11, 'cape'), { x: { pose: 'hold', hands: [rel(top), rel([top[0] - dx * 0.2, top[1] - dy * 0.2])], lean: 0.1 + sw * 0.08 } });
      g.line2([bl, top], { w: 0.6, c: '#8A6440', boil: false, ext: 0 });
    });
    if (o.riders) add(1.4, 0, () => VN.aboard(g, F, 1.4, 0, spec.sheer - 0.4, o.riders[0], { pose: 'sit', x: { noLegs: true } }));
  }
  items.sort((p, q) => { const A = F.pt(p[0], p[1], 0), B = F.pt(q[0], q[1], 0); return (A[0] + A[1]) - (B[0] + B[1]); });
  for (const it of items) it[2]();
  H.near();
  // at night: a sandolo carries a lantern on its bow (the old feral); the motor boats their masthead light
  if (o.night) {
    if (kind === 'sandolo') { if (has(L * 0.8)) VN.feral(g, F, L * 0.8, sheer(L * 0.8)); }
    else { const cab = kind === 'taxi' || kind === 'ambulanza', u = cab ? -1.3 : -L * 0.8; if (has(u)) VN.navLight(g, F.pt(u, 0, spec.sheer + (cab ? 2.2 : 2.0)), 0.42, '#FFF4D6'); }
  }
};
/* ---------- boats at night (drawn only in their night poses) ---------- */
/* a small bright light (a masthead or side light) at a point of the boat's frame */
VN.navLight = function (g, pt, r, col) { const c = g.p(pt[0], pt[1], pt[2]); g.disc2(c, r, col); g.mark({ nc: true, light: true }); };
/* the gondola's lantern on its iron stalk at the bow (u along the boat, z its gunwale there) */
VN.feral = function (g, F, u, z) {
  const b = g.p.apply(g, F.pt(u, 0, z)), t = g.p.apply(g, F.pt(u, 0, z + 1.6));
  g.line2([b, t], { w: 0.35, c: '#2A2622', boil: false, ext: 0 });
  const q = [[t[0] - 0.75, t[1] - 0.2], [t[0] + 0.75, t[1] - 0.2], [t[0] + 0.6, t[1] - 2.0], [t[0] - 0.6, t[1] - 2.0]];
  g.fill2(q, '#FFD27A', true); g.mark({ nc: true, light: true });
  g.fill2([[t[0] - 0.95, t[1] - 2.0], [t[0] + 0.95, t[1] - 2.0], [t[0], t[1] - 2.9]], '#2A2622', true);
  g.line2(q, { w: 0.25, c: '#2A2622', boil: false, close: true });
};
/* broken streaks of a lit window row reflected in the water beside the hull: spans [[u0, u1], ...], on the near side
   v, mirrored from z0..z1 above the water */
VN.boatGlints = function (g, F, spans, v, z0, z1, rgb, seed) {
  for (let i = 0; i < spans.length; i++) {
    const [a, b] = spans[i], n = 4;
    for (let k = 0; k < n; k++) {
      const z = -lerp(z0, z1, (k + 0.5) / n), j = (h1(seed * 7 + i * 5 + k) - 0.5) * 0.5, sh = 0.18 + 0.12 * (k % 2), A = Math.min(a, b) + j + 0.1 * k, B = Math.max(a, b) + j - 0.1 * k;
      if (B - A < 0.1) continue;
      g.fill([F.pt(A, v, z), F.pt(B, v, z), F.pt(B, v, z - sh), F.pt(A, v, z - sh)], 'rgba(' + rgb + ',' + (0.62 - k * 0.12).toFixed(2) + ')'); g.mark({ nc: true });
    }
  }
};

/* a gondola: the long black asymmetric hull rising at both ends, the steel ferro at the bow, a red seat with riders,
   the gondolier standing on the stern deck rowing on the right side with one long oar in the forcola */
VN.gondola = function (g, F, u0, u1, o) {
  const L = VN.BOAT.gondola.L, Wd = VN.BOAT.gondola.W;
  const wid = (u) => Wd * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u) / L, 2.2)), 0.55);
  const sheer = (u) => 0.9 + 1.5 * Math.pow(Math.abs(u) / L, 4);
  const a = Math.max(u0, -L), b = Math.min(u1, L); if (b <= a) return;
  const H = VN.hull(g, F, a, b, L, wid, sheer, { col: '#2B282A', floor: '#6B4A34', floorZ: 0.5, gun: '#C9A44A', wake: o.moored ? 0 : 1.6 });
  // the passengers' seat and riders (two cushions), facing forward
  if (a < 1.8 && b > 0.4) {
    VN.pieceBox(g, F, 0.4, 1.8, u0, u1, Wd * 0.7, 0.5, 1.1, { t: '#B9443A', l: '#C9584B', r: '#A63C33' }, { w: 0.4 });
    if (o.riders && 1.1 >= a && 1.1 < b) {
      const rs = [[1.1, -0.42, o.riders[0]], [1.1, 0.42, o.riders[1]]].filter((r) => r[2]);
      rs.sort((p, q) => { const A = F.pt(p[0], p[1], 0), B = F.pt(q[0], q[1], 0); return (A[0] + A[1]) - (B[0] + B[1]); });
      for (const [u, v, w] of rs) VN.aboard(g, F, u, v, 0.95, w, { pose: w.pose || 'sit', x: { noLegs: true, ph: 0.2 } });
    }
  }
  if (o.rider && a < -1.0 && b > -2.4) VN.aboard(g, F, -1.6, 0, 0.6, o.rider, { pose: 'sit', back: false, x: { noLegs: true } });
  H.near();
  if (o.night && !o.moored && L * 0.82 >= a && L * 0.82 < b) VN.feral(g, F, L * 0.82, sheer(L * 0.82));   // at night: the feral on the bow
  if (b >= L * 0.96) {   // the ferro
    const b0 = g.p.apply(g, F.pt(L * 0.97, 0, sheer(L * 0.97))), b1 = g.p.apply(g, F.pt(L * 1.05, 0, 3.4));
    g.line2([b0, b1], { w: 0.85, c: '#C9CCD0', boil: false, ext: 0 });
    const tooth = []; for (let i = 0; i < 6; i++) { const t = 0.2 + i * 0.13, p = [lerp(b0[0], b1[0], t), lerp(b0[1], b1[1], t)]; tooth.push(p[0], p[1], p[0] + (F.ca - F.sa > 0 ? 1.7 : -1.7), p[1] + 0.2); }
    g.segs2(tooth, '#AEB2B8', 0.42); g.disc2(b1, 0.65, '#D6D9DC');
  }
  if (a <= -L * 0.96) {   // the stern curls up
    const s0 = g.p.apply(g, F.pt(-L * 0.98, 0, sheer(-L * 0.98))), s1 = g.p.apply(g, F.pt(-L * 1.04, 0, 2.5));
    g.line2([s0, s1], { w: 1.0, c: '#2B282A', boil: false, ext: 0 });
  }
  // the gondolier on the stern, rowing
  const fu = -L * 0.72;
  if (!o.empty && fu >= a && fu < b) {
    const kk = 0.9, P = F.pt(fu, 0.12, 1.05), FP = g.p.apply(g, P), rel = (q) => [(q[0] - FP[0]) / kk, (q[1] - FP[1]) / kk];
    const sw = Math.sin((o.ph || 0) * TAU), lock = F.pt(fu + 1.2, Wd * 1.05, 1.5), blade = F.pt(fu - 1.4 - sw * 0.9, Wd * 2.3, 0.0);
    const lk = g.p.apply(g, lock), bl = g.p.apply(g, blade), dx = lk[0] - bl[0], dy = lk[1] - bl[1], top = [lk[0] + dx * 0.55, lk[1] + dy * 0.55];
    const oar = () => { g.line2([bl, top], { w: 0.65, c: '#8A6440', boil: false, ext: 0 }); g.fill2([[bl[0] - 1.1, bl[1] - 0.5], [bl[0] + 1.1, bl[1] + 0.5], [bl[0] + 0.8, bl[1] + 1.3], [bl[0] - 1.3, bl[1] + 0.6]], '#A07A50'); g.disc2(lk, 0.55, '#5A3E2E'); };
    const oarFar = F.nearV < 0;
    if (o.moored) { const r = VN.aboard(g, F, fu, 0.12, 1.05, Object.assign({}, o.who, { k: kk, top: '#F3F1EA', bot: '#2F2C2E' }), { pose: 'stand', back: true }); VN.gondolierKit(g, r, kk, o.who); return; }
    if (oarFar) oar();
    const bx = F.ca, by = F.sa, d = (bx + by > 0) ? (bx - by > 0 ? 0 : 1) : (bx - by > 0 ? 3 : 2);
    const r = VN.person(g, P[0], P[1], P[2], Object.assign({ hairStyle: 'short' }, o.who || {}, { dir: d, k: kk, top: '#F3F1EA', bot: '#2F2C2E', bare: false, scarf: null, beanie: null, fedora: null, colombina: null, lean: 0.12 + sw * 0.08, hands: [rel([top[0] - dx * 0.05, top[1] - dy * 0.05]), rel([top[0] - dx * 0.25, top[1] - dy * 0.25])] }));
    VN.gondolierKit(g, r, kk, o.who);
    if (!oarFar) oar();
  }
};
/* the gondolier's striped jersey and straw boater with its ribbon */
VN.gondolierKit = function (g, r, k, who) {
  const s = r.shoulders, hp = r.hip, sc = (who && who.stripe) || '#2F3F63';
  if (s && hp) { const st = []; for (let i = 1; i < 4; i++) { const t = i / 4, yy = lerp(Math.min(s[0][1], s[1][1]), hp[1], t); st.push(Math.min(s[0][0], s[1][0]) - 0.6, yy, Math.max(s[0][0], s[1][0]) + 0.6, yy); } g.segs2(st, sc, 0.55); }
  const c = r.crown, br = arcPts(c[0], c[1] + 0.9, 3.0 * k, 0, TAU, 14).map((q) => [q[0], c[1] + 0.9 + (q[1] - c[1] - 0.9) * 0.32]);
  g.fill2(br, '#E9D9A0', true); g.fill2([[c[0] - 1.7, c[1] + 0.9], [c[0] + 1.7, c[1] + 0.9], [c[0] + 1.6, c[1] - 0.8], [c[0] - 1.6, c[1] - 0.8]], '#E9D9A0', true);
  g.fill2([[c[0] - 1.7, c[1] + 0.9], [c[0] + 1.7, c[1] + 0.9], [c[0] + 1.7, c[1] + 0.1], [c[0] - 1.7, c[1] + 0.1]], (who && who.ribbon) || '#C0392B', true);
  g.line2(br, { w: 0.32, boil: false, c: '#8A7A4A', close: true });
};

/* one actor per piece of a moving boat. path(t) -> { x, y, ang, alpha, f } in tile-local u (or null); n pieces;
   draw opts o (kind, ...). Each piece is anchored at its end nearest the viewer. */
VN.boatActors = function (T, kind, path, o) {
  o = o || {}; const L = VN.BOAT[kind].L, N = o.n || (L > 6 ? 6 : 2), per = o.period || 60;
  const keyOf = o.key || (() => '');
  for (let i = 0; i < N; i++) {
    const u0 = i === 0 ? -L - 4 : -L + 2 * L * i / N, u1 = i === N - 1 ? L + 2 : -L + 2 * L * (i + 1) / N;
    T.actor({ sample: o.sample || 0.2, period: per, grow: false, cast: o.cast, bias: o.bias || 0,
      at(t) {
        const s = path(t); if (!s) return null;
        const ca = Math.cos(s.ang), sa = Math.sin(s.ang), ue = ca + sa > 0 ? Math.min(u1, L) : Math.max(u0, -L);
        const n = LOOK.night;                                                 // a night pose of its own (its lights), the day's untouched
        return { x: s.x + ue * ca, y: s.y + ue * sa, z: VN.WL, key: Math.round(s.ang * 100) + '.' + keyOf(s) + (n ? 'n' : ''), ue, ang: s.ang, s2: s, n, alpha: s.alpha != null && s.alpha < 1 ? s.alpha : null };
      },
      draw(g, st) {
        const ca = Math.cos(st.ang), sa = Math.sin(st.ang);
        g.at(-st.ue * ca, -st.ue * sa, 0, (g2) => VN.drawBoat(g2, kind, st.ang, u0, u1, Object.assign({}, o.draw || {}, o.drawOf ? o.drawOf(st.s2) : {}, st.n ? { night: true } : {})));
      } });
  }
};
