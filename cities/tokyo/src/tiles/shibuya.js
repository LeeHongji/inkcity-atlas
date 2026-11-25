'use strict';
/* (0,0) Shibuya: the scramble crossing. Two roads cross in the middle of the tile; zebras on the four arms and two
   diagonals. The cycle (21 s): road A (along x) gets green, then road B, then every car light is red and the crowds
   waiting on the four corners (checking phones, looking round) all cross at once, diagonals included, while the cars
   queue at the stop lines. The cycle is shifted so the film's Shibuya shot opens on the green man. Cars and people are
   pure functions of t.
   Round it, tall and loud: on the far corner QFRONT, a glass tower whose cut corner is one giant video screen facing the
   crossing, people at the café glass on its first floor; beside it two towers hung with billboards. On the right
   SHIBUYA 109: the slim silver cylinder at the point of its building, a fashion banner down its front and the red 109
   running down its crown. On the left Hachikō square: the bronze Akita on his granite stone with a queue to photograph
   him, friends meeting, the old green Tōkyū car, the kōban, and the station's Hachikō exit under its 渋谷 sign. On the
   near corner the subway stairs, a café, a busker with his audience and a sweeper. */
SF.tile('shibuya', 0, 0, { rim: 30 }, function (T) {
  const H = 37, RW = 7, PAVE = '#E6E2D8', ASPH = '#D2CDC0', LINE = '#F8F6F0', LIT1 = '#E9D3A6', LIT2 = '#E9C48A';
  const CYC = 21, PED0 = 10.4, sh = SCENE.shots.find((s) => s.name === 'shibuya');
  const OFF = sh ? (((PED0 - 0.3 - sh.a / 30) % CYC) + CYC) % CYC : 0;
  const cyc = (t) => { const u = t + OFF; const n = Math.floor(u / CYC); return { n, tc: u - n * CYC }; };

  /* ---------------- drawing helpers (inside the tile: the tile files share one global scope) ---------------- */
  // a vertical plane through ground points P (its screen-left end) and Q: f(u 0..1 along it, z, out) -> world point,
  // `out` u in front of it (towards the viewer)
  const PL = (P, Q, d) => {
    const L = Math.hypot(Q[0] - P[0], Q[1] - P[1]), nx = -(Q[1] - P[1]) / L, ny = (Q[0] - P[0]) / L, d0 = d || 0;
    const f = (u, z, dd) => { const o = d0 + (dd || 0); return [P[0] + (Q[0] - P[0]) * u + nx * o, P[1] + (Q[1] - P[1]) * u + ny * o, z]; };
    f.len = L; return f;
  };
  // a building face in K.on's terms: 'L' the plane y = p (x from a0 to a1), 'R' the plane x = p (y from a0 to a1)
  const FC = (face, p, a0, a1) => (face === 'L' ? PL([a0, p], [a1, p]) : PL([p, a1], [p, a0]));
  const quad = (f, u0, u1, z0, z1, dd) => [f(u0, z0, dd), f(u1, z0, dd), f(u1, z1, dd), f(u0, z1, dd)];
  const inkOn = (col) => (hex2rgb(col).reduce((a, b) => a + b) > 430 ? '#2C271C' : '#FBF8EE');
  // a sign board on plane f (u0..u1, z0..z1), lit from behind at night, with a real word: o.jp (the kana table) or o.en
  // (the engine's Latin font); o.vert sets it in a column
  const board = (g, f, u0, u1, z0, z1, col, o) => {
    o = o || {}; const dd = o.dd == null ? 0.08 : o.dd, q = quad(f, u0, u1, z0, z1, dd);
    g.fill(q, col); g.mark({ nc: true });
    if (o.line !== false) g.outline(q, { w: o.w || 0.42, c: o.c || shade(col, 0.5), boil: false });
    const W = Math.abs(u1 - u0) * f.len, Hh = z1 - z0, am = (u0 + u1) / 2 * f.len, zm = (z0 + z1) / 2;
    if (o.glow !== false) { const c = g.p.apply(g, f((u0 + u1) / 2, zm, dd)); g.glow2('neon', c, c, { r: Math.min(6, 0.15 * Math.max(W * 2.92, Hh * 3.46)), col }); }
    const ink = o.ink || inkOn(col), P2 = (a, z) => f(a / f.len, z, dd + 0.03), k = o.k || 1;
    if (o.jp) {
      const n = [...o.jp].length, vert = o.vert != null ? o.vert : Hh > W;
      const h = (vert ? Math.min(W * 0.72, Hh * 0.86 / (n * 1.08 - 0.08)) : Math.min(Hh * 0.72, W * 0.88 / (n * 1.08 - 0.08))) * k;
      TK.wordP(g, P2, am, zm, h, o.jp, ink, { vert });
    }
    if (o.en) {
      const s = String(o.en), vert = o.vert != null ? o.vert : Hh > W * 1.6;
      if (vert) { const n = s.length, h = Math.min(W * 1.1, Hh * 0.88 / (n * 1.3 - 0.3)) * k; for (let i = 0; i < n; i++) K.textP(g, P2, am, zm + ((n - 1) / 2 - i) * h * 1.3 - h / 2, h, s[i], ink, { center: true, w: o.tw }); }
      else { const h = Math.min(Hh * 0.62, W * 0.86 / K.textW(s, 1)) * k; K.textP(g, P2, am, zm - h / 2, h, s, ink, { center: true, w: o.tw }); }
    }
    return q;
  };
  // floors of windows on plane f: panes in bays (lit at night, some of them), frames and sills as fine lines
  const panes = (g, f, u0, u1, z0, z1, o) => {
    o = o || {}; const fh = o.fh || 3.4, n = o.n || Math.max(1, Math.round(Math.abs(u1 - u0) * f.len / (o.bay || 2.4))), gp = (o.gap == null ? 0.4 : o.gap) / f.len;
    const col = o.col || C.glass, fr = [], gl = [], sl = [];
    for (let z = z0; z + fh * 0.5 <= z1 + 0.01; z += fh) {
      const za = z + (o.sill == null ? 0.8 : o.sill), zb = Math.min(z1, z + fh - (o.head == null ? 0.7 : o.head));
      for (let i = 0; i < n; i++) {
        const ua = lerp(u0, u1, i / n) + gp / 2, ub = lerp(u0, u1, (i + 1) / n) - gp / 2, q = g.P(quad(f, ua, ub, za, zb, 0.02));
        g.fill2(q, col, true); g.mark({ win: o.lit == null ? 0.7 : o.lit });
        for (let k = 0; k < 4; k++) fr.push(q[k][0], q[k][1], q[(k + 1) % 4][0], q[(k + 1) % 4][1]);
        if (o.glint !== false && (i + Math.round(z)) % 2 === 0) { const mx = (q[0][0] + q[2][0]) / 2, my = (q[0][1] + q[2][1]) / 2, d = Math.min(1.6, Math.abs(q[2][1] - q[0][1]) * 0.25); gl.push(mx - d * 0.2, my + d * 0.7, mx + d * 0.5, my - d * 0.7); }
      }
      if (o.sills !== false) { const a = g.p.apply(g, f(u0, za - 0.15, 0.08)), b = g.p.apply(g, f(u1, za - 0.15, 0.08)); sl.push(a[0], a[1], b[0], b[1]); }
    }
    g.segs2(fr, o.lc || '#4A545F', 0.3); if (gl.length) g.segs2(gl, '#FFFFFF', 0.45); if (sl.length) g.segs2(sl, o.sc || '#8C8576', 0.35);
  };
  // a shop floor behind glass on plane f: lit all night, mullions, a door
  const shop = (g, f, u0, u1, z0, z1, o) => {
    o = o || {}; const q = quad(f, u0, u1, z0, z1, 0.03); g.fill(q, o.col || LIT1);
    const n = Math.max(1, Math.round(Math.abs(u1 - u0) * f.len / (o.bay || 2.6))), s = [];
    for (let i = 1; i < n; i++) { const a = g.p.apply(g, f(lerp(u0, u1, i / n), z0, 0.05)), b = g.p.apply(g, f(lerp(u0, u1, i / n), z1, 0.05)); s.push(a[0], a[1], b[0], b[1]); }
    const t0 = g.p.apply(g, f(u0, z1 - 0.8, 0.05)), t1 = g.p.apply(g, f(u1, z1 - 0.8, 0.05)); s.push(t0[0], t0[1], t1[0], t1[1]);
    if (o.goods) { const R = RNG(o.goods), gs = []; for (let k = 0; k < n * 4; k++) { const p = g.p.apply(g, f(lerp(u0, u1, 0.04 + R() * 0.92), z0 + 0.4 + R() * (z1 - z0 - 1.8), 0.04)); gs.push(p[0] - 0.5, p[1], p[0] + 0.5, p[1]); } g.segs2(gs, '#B98A5A', 0.9); }
    g.segs2(s, o.mc || '#4A545F', 0.38); g.outline(q, { w: 0.5, c: '#4A545F', boil: false });
  };
  // a blade sign standing out from an L face (the plane y = yw) at x: we see its +x side and its front edge
  const bladeL = (g, x, yw, d, z0, z1, col, o) => {
    const i0 = g.cmds.length; K.box(g, x - 0.3, yw, x + 0.3, yw + d, z0, z1, { t: shade(col, 0.1), l: shade(col, 0.32), r: shade(col, 0.22) }, { w: 0.45, boil: false, nohid: true }); g.mark({ nc: true }, i0);
    board(g, PL([x + 0.3, yw + d], [x + 0.3, yw]), 0.1, 0.9, z0 + 0.3, z1 - 0.3, col, Object.assign({ dd: 0.02, line: false }, o));
  };
  // the same from an R face (the plane x = xw) at y: we see its +y side
  const bladeR = (g, y, xw, d, z0, z1, col, o) => {
    const i0 = g.cmds.length; K.box(g, xw, y - 0.3, xw + d, y + 0.3, z0, z1, { t: shade(col, 0.1), l: shade(col, 0.22), r: shade(col, 0.32) }, { w: 0.45, boil: false, nohid: true }); g.mark({ nc: true }, i0);
    board(g, PL([xw, y + 0.3], [xw + d, y + 0.3]), 0.1, 0.9, z0 + 0.3, z1 - 0.3, col, Object.assign({ dd: 0.02, line: false }, o));
  };
  // the roof: AC units and a water tank, back to front, a railing round the front edges
  const roofKit = (g, x0, y0, x1, y1, z, seed, o) => {
    o = o || {}; const R = RNG(seed), it = [];
    for (let i = 0; i < (o.ac == null ? 2 : o.ac); i++) it.push({ k: 'ac', x: lerp(x0 + 1.0, x1 - 2.6, R()), y: lerp(y0 + 1.0, y1 - 2.3, R()) });
    if (o.tank) it.push({ k: 'tank', x: o.tank[0], y: o.tank[1] });
    if (o.hut) it.push({ k: 'hut', x: o.hut[0], y: o.hut[1] });
    it.sort((a, b) => (a.x + a.y) - (b.x + b.y));
    for (const q of it) {
      if (q.k === 'ac') { K.box(g, q.x, q.y, q.x + 1.6, q.y + 1.2, z, z + 1.1, { t: '#E6E4DD', l: '#D6D3C9', r: '#BFBCB3' }, { w: 0.4, boil: false }); const c = g.p(q.x + 0.8, q.y + 1.22, z + 0.55); g.ring2(c, 0.95, { w: 0.3, c: '#8C8576' }); }
      else if (q.k === 'tank') { const L = []; for (const [dx, dy] of [[-0.9, 0.9], [0.9, 0.9], [0.9, -0.9]]) { const a = g.p(q.x + dx, q.y + dy, z), b = g.p(q.x + dx, q.y + dy, z + 1.4); L.push(a[0], a[1], b[0], b[1]); } g.segs2(L, '#6E747A', 0.45); K.cyl(g, q.x, q.y, 1.35, z + 1.4, z + 4.0, { t: '#D9DCDA', l: '#ECEDEA', r: '#C9CCCC' }, { w: 0.5, n: 10 }); }
      else K.box(g, q.x, q.y, q.x + 3.2, q.y + 2.6, z, z + 2.6, { t: '#E3E0D6', l: '#ECE9E1', r: '#D3CFC4' }, { w: 0.55, boil: false });
    }
    const e = 0.4, rz = z + 1.0, A = [x0 + e, y1 - e], B = [x1 - e, y1 - e], Cc = [x1 - e, y0 + e], rail = [];
    for (let x = A[0]; x <= B[0] + 0.01; x += 1.25) { const a = g.p(x, A[1], z), b = g.p(x, A[1], rz); rail.push(a[0], a[1], b[0], b[1]); }
    for (let y = B[1]; y >= Cc[1] - 0.01; y -= 1.25) { const a = g.p(B[0], y, z), b = g.p(B[0], y, rz); rail.push(a[0], a[1], b[0], b[1]); }
    g.segs2(rail, '#6E747A', 0.28); g.fine([[A[0], A[1], rz], [B[0], B[1], rz], [Cc[0], Cc[1], rz]], { w: 0.35, c: '#6E747A' });
    if (o.ant) { const a = g.p(o.ant[0], o.ant[1], z), b = g.p(o.ant[0], o.ant[1], z + 5.5), c = g.p(o.ant[0], o.ant[1], z + 4.2); g.segs2([a[0], a[1], b[0], b[1], c[0] - 1.6, c[1], c[0] + 1.6, c[1], b[0] - 1.1, b[1] + 0.6, b[0] + 1.1, b[1] + 0.6], '#5A564E', 0.4); }
  };
  // a picture on plane f (u0..u1, z0..z1), lit at night: 'girl' (an anime heroine, head and shoulders), 'model' (a
  // fashion ad, full length), 'drink', 'idol' (a singer on a stage); o.en a word along its foot. The figure shrinks to
  // fit a narrow frame (k) and stands on the frame's foot.
  const pic = (g, f, u0, u1, z0, z1, kind, o) => {
    o = o || {}; const dd = o.dd == null ? 0.07 : o.dd, A = Math.abs(u1 - u0) * f.len / (z1 - z0), i0 = g.cmds.length;
    const cu = o.cu == null ? 0.5 : o.cu, top = o.en ? 0.16 : 0, k = Math.min(1, A / ({ girl: 0.82, model: 0.42, idol: 0.5, drink: 0.4 }[kind] || 0.8));
    const X = (u, v) => f(lerp(u0, u1, u), lerp(z0, z1, v), dd), U = (d) => d * k / A, Vv = (v) => top + (v - top) * k;
    const poly = (pts, col) => g.fill(pts.map((p) => X(p[0], p[1])), col);
    const fpoly = (pts, col) => poly(pts.map((p) => [p[0], Vv(p[1])]), col);
    const rect = (a, b, c, d, col) => { const p = []; for (let i = 0; i <= 6; i++) p.push([lerp(a, c, i / 6), b]); for (let i = 6; i >= 0; i--) p.push([lerp(a, c, i / 6), d]); poly(p, col); };
    const ell = (cu_, cv, r, rv, col, fig) => { const p = []; for (let i = 0; i < 14; i++) { const t = TAU * i / 14; p.push([cu_ + Math.cos(t) * (fig === false ? r / A : U(r)), fig === false ? cv + Math.sin(t) * (rv == null ? r : rv) : Vv(cv + Math.sin(t) * (rv == null ? r : rv))]); } poly(p, col); };
    if (kind === 'girl') {
      const hair = o.hair || '#4F6FC0', eye = o.eye || '#7A4FB0';
      rect(0, 0, 1, 1, o.bg || '#F2B6C2');
      for (let i = 0; i < 6; i++) { const su = h1(i * 7 + 3), sv = top + 0.05 + h1(i * 5 + 1) * (0.9 - top); if (Math.abs(su - cu) > U(0.42) || sv > Vv(0.95)) ell(su, sv, 0.035, 0.035, '#FFF6D8', false); }
      fpoly([[cu - U(0.36), 0.56], [cu + U(0.36), 0.56], [cu + U(0.34), top + 0.04], [cu - U(0.34), top + 0.04]], hair);
      ell(cu, 0.6, 0.35, 0.32, hair);
      fpoly([[cu - U(0.34), top], [cu + U(0.34), top], [cu + U(0.2), 0.26], [cu - U(0.2), 0.26]], o.top || '#F6F3EA');
      fpoly([[cu - U(0.12), 0.26], [cu + U(0.12), 0.26], [cu, top + 0.06]], o.tie || '#C9463E');
      ell(cu, 0.48, 0.22, 0.24, '#F8E3D2');
      fpoly([[cu - U(0.26), 0.58], [cu - U(0.19), 0.54], [cu - U(0.13), 0.61], [cu - U(0.05), 0.54], [cu + U(0.03), 0.61], [cu + U(0.11), 0.54], [cu + U(0.18), 0.61], [cu + U(0.26), 0.55], [cu + U(0.27), 0.76], [cu - U(0.27), 0.76]], hair);
      for (const s of [-1, 1]) { ell(cu + s * U(0.095), 0.45, 0.055, 0.075, eye); ell(cu + s * U(0.083), 0.475, 0.022, 0.026, '#FFFFFF'); ell(cu + s * U(0.15), 0.37, 0.04, 0.016, '#F2A0AE'); }
      fpoly([[cu - U(0.035), 0.33], [cu + U(0.035), 0.33], [cu, 0.3]], '#C9584B');
    } else if (kind === 'model') {
      rect(0, 0, 1, 1, o.bg || '#F3E3A0'); rect(0, 0.62, 1, 1, shade(o.bg || '#F3E3A0', -0.3));
      const c = o.coat || '#C9463E', sk = '#F3D9C4';
      fpoly([[cu - U(0.07), top], [cu - U(0.03), top], [cu - U(0.025), 0.42], [cu - U(0.065), 0.42]], '#2E2A26');
      fpoly([[cu + U(0.015), top], [cu + U(0.055), top], [cu + U(0.06), 0.42], [cu + U(0.02), 0.42]], '#2E2A26');
      fpoly([[cu - U(0.16), 0.36], [cu + U(0.15), 0.36], [cu + U(0.09), 0.76], [cu - U(0.1), 0.76]], c);
      fpoly([[cu - U(0.1), 0.76], [cu - U(0.2), 0.5], [cu - U(0.17), 0.48], [cu - U(0.07), 0.68]], c);
      fpoly([[cu - U(0.02), 0.76], [cu + U(0.02), 0.76], [cu, 0.6]], shade(c, 0.25));
      ell(cu, 0.84, 0.065, 0.07, sk);
      fpoly([[cu - U(0.085), 0.78], [cu - U(0.08), 0.9], [cu, 0.94], [cu + U(0.08), 0.9], [cu + U(0.085), 0.78], [cu + U(0.05), 0.86], [cu - U(0.04), 0.87]], o.hair || '#2E2A26');
      fpoly([[cu + U(0.08), 0.5], [cu + U(0.2), 0.42], [cu + U(0.19), 0.36], [cu + U(0.06), 0.44]], o.bag || '#E6C24F');
    } else if (kind === 'drink') {
      rect(0, 0, 1, 1, o.bg || '#7FC6E0'); rect(0, 0, 1, 0.45, shade(o.bg || '#7FC6E0', -0.3));
      for (let i = 0; i < 9; i++) ell(0.08 + h1(i * 11 + 2) * 0.84, top + 0.1 + h1(i * 3 + 9) * (0.85 - top), 0.02 + h1(i) * 0.03, null, '#F6FBFC', false);
      const c = o.can || '#C9463E';
      fpoly([[cu - U(0.13), top + 0.08], [cu + U(0.13), top + 0.08], [cu + U(0.13), 0.84], [cu - U(0.13), 0.84]], c);
      fpoly([[cu - U(0.13), 0.52], [cu + U(0.13), 0.52], [cu + U(0.13), 0.64], [cu - U(0.13), 0.64]], '#F6F3EA');
      fpoly([[cu + U(0.04), top + 0.08], [cu + U(0.09), top + 0.08], [cu + U(0.09), 0.84], [cu + U(0.04), 0.84]], shade(c, -0.25));
      ell(cu, 0.85, 0.13, 0.035, '#C9CCCC');
    } else if (kind === 'idol') {
      rect(0, 0, 1, 1, o.bg || '#5B4A9A');
      for (const [a, b] of [[0.1, 0.3], [0.62, 0.84]]) poly([[a + 0.05, 1], [b - 0.05, 1], [b + 0.08, top], [a - 0.08, top]], '#8E7CC8');
      for (let i = 0; i < 7; i++) ell(0.06 + h1(i * 13 + 5) * 0.88, top + 0.05 + h1(i * 7 + 2) * 0.2, 0.03, 0.03, ['#F7E07A', '#F2A0C0', '#9FE0F0'][i % 3], false);
      const sk = '#F6DDCB', d = o.dress || '#F2A0C0', hr = o.hair || '#3A2A26', arm = o.arm || 0;
      fpoly([[cu - U(0.12), top + 0.06], [cu + U(0.12), top + 0.06], [cu + U(0.06), 0.52], [cu - U(0.06), 0.52]], d);
      ell(cu, 0.62, 0.075, 0.085, sk);
      ell(cu, 0.67, 0.085, 0.06, hr); ell(cu - U(0.1), 0.6, 0.04, 0.09, hr); ell(cu + U(0.1), 0.6, 0.04, 0.09, hr);
      fpoly([[cu + U(0.05), 0.5], [cu + U(0.07), 0.5], [cu + U(0.17), 0.56 + arm * 0.2], [cu + U(0.15), 0.58 + arm * 0.2]], sk);
      ell(cu + U(0.17), 0.58 + arm * 0.2, 0.025, 0.03, '#3A3530');
      fpoly([[cu - U(0.05), 0.5], [cu - U(0.07), 0.5], [cu - U(0.16), 0.38 - arm * 0.1], [cu - U(0.14), 0.36 - arm * 0.1]], sk);
    }
    if (o.en) { rect(0, 0, 1, top, o.band || '#2E2A26'); const P2 = (a, z) => f(a / f.len, z, dd + 0.03), W = Math.abs(u1 - u0) * f.len, h = Math.min((z1 - z0) * top * 0.62, W * 0.8 / K.textW(o.en, 1)); K.textP(g, P2, (u0 + u1) / 2 * f.len, z0 + (z1 - z0) * top / 2 - h / 2, h, o.en, o.ink || '#FBF8EE', { center: true }); }
    g.mark({ nc: true }, i0);
    if (o.frame !== false) g.outline(quad(f, u0, u1, z0, z1, dd), { w: 0.55, c: '#3A3128', boil: false });
    if (o.glow !== false) { const c = g.p.apply(g, f((u0 + u1) / 2, (z0 + z1) / 2, dd)); g.glow2('neon', c, c, { r: Math.min(7, 0.08 * Math.max(Math.abs(u1 - u0) * f.len * 2.92, (z1 - z0) * 3.46)), col: o.bg || '#F2B6C2' }); }
  };
  const edges = (g, pts, z0, z1, w) => { for (const p of pts) g.line([[p[0], p[1], z0], [p[0], p[1], z1]], { w: w || 0.8 }); };

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    K.slab(g, H, { top: PAVE });
    g.fill(K.rect(-H, -RW, H, RW), ASPH); g.fill(K.rect(-RW, -H, RW, H), ASPH);
    // rounded kerbs at the four corners of the crossing
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) { const pts = [[sx * RW, sy * RW, 0]]; for (let i = 0; i <= 8; i++) { const a = Math.PI / 2 * i / 8; pts.push([sx * (RW + 2.5 - 2.5 * Math.sin(a)), sy * (RW + 2.5 - 2.5 * Math.cos(a)), 0]); } g.fill(pts, ASPH); }
    for (const sx of [-1, 1]) {
      g.line([[sx * RW, -H, 0], [sx * RW, -RW - 2.5, 0]], { w: 0.6, c: '#A9A296', boil: false }); g.line([[sx * RW, RW + 2.5, 0], [sx * RW, H, 0]], { w: 0.6, c: '#A9A296', boil: false });
      g.line([[-H, sx * RW, 0], [-RW - 2.5, sx * RW, 0]], { w: 0.6, c: '#A9A296', boil: false }); g.line([[RW + 2.5, sx * RW, 0], [H, sx * RW, 0]], { w: 0.6, c: '#A9A296', boil: false });
    }
    g.scuff(K.rect(-H, -RW, H, RW), { dir: Math.atan2(AY, AX), len: 8, c: '#E2DDD0', dens: 0.5, w: 0.5, spread: 0.05 });
    g.scuff(K.rect(-RW, -H, RW, H), { dir: Math.atan2(AY, -AX), len: 8, c: '#E2DDD0', dens: 0.5, w: 0.5, spread: 0.05 });
    // zebras on the four arms
    for (const s of [-1, 1]) for (let k = -RW + 0.9; k < RW - 0.5; k += 2.1) {
      g.fill(K.rect(Math.min(s * 8, s * 12.5), k - 0.62, Math.max(s * 8, s * 12.5), k + 0.62), LINE);
      g.fill(K.rect(k - 0.62, Math.min(s * 8, s * 12.5), k + 0.62, Math.max(s * 8, s * 12.5)), LINE);
    }
    // and the two diagonals: bars across each diagonal band
    for (const d of [1, -1]) for (let t = -8.2; t <= 8.2; t += 2.05) {
      const cx = t / Math.SQRT2, cy = d * t / Math.SQRT2, ux = 1 / Math.SQRT2, uy = d / Math.SQRT2, vx = -uy, vy = ux, a = 0.6, b = 2.2;
      g.fill([[cx - ux * a - vx * b, cy - uy * a - vy * b, 0], [cx + ux * a - vx * b, cy + uy * a - vy * b, 0], [cx + ux * a + vx * b, cy + uy * a + vy * b, 0], [cx - ux * a + vx * b, cy - uy * a + vy * b, 0]], LINE);
    }
    // stop lines and lane marks
    for (const s of [-1, 1]) {
      g.line([[s * 14.6, s < 0 ? -RW + 0.4 : 0.2, 0], [s * 14.6, s < 0 ? -0.2 : RW - 0.4, 0]], { c: LINE, w: 1.1, boil: false });
      g.line([[s < 0 ? 0.2 : -RW + 0.4, s * 14.6, 0], [s < 0 ? RW - 0.4 : -0.2, s * 14.6, 0]], { c: LINE, w: 1.1, boil: false });
      for (let u = 17; u < H - 2; u += 7) { g.line([[s * u, 0, 0], [s * (u + 3.4), 0, 0]], { c: LINE, w: 0.9, boil: false }); g.line([[0, s * u, 0], [0, s * (u + 3.4), 0]], { c: LINE, w: 0.9, boil: false }); }
    }
    // paving joints on the four blocks
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) g.scuff(K.rect(sx > 0 ? RW : -H, sy > 0 ? RW : -H, sx > 0 ? H : -RW, sy > 0 ? H : -RW), { dir: -0.5, len: 4, c: '#F4F1EA', dens: 0.6, w: 0.5 });
    // yellow tactile strips where each crosswalk meets the kerb
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      g.fill(K.rect(Math.min(sx * 8.4, sx * 12.2), sy > 0 ? 7.25 : -7.95, Math.max(sx * 8.4, sx * 12.2), sy > 0 ? 7.95 : -7.25), '#E6C24F');
      g.fill(K.rect(sx > 0 ? 7.25 : -7.95, Math.min(sy * 8.4, sy * 12.2), sx > 0 ? 7.95 : -7.25, Math.max(sy * 8.4, sy * 12.2)), '#E6C24F');
    }
    // Hachikō square: warm stone paving in a grid; round planters' kerbs; the 109 forecourt and the near corner in big slabs
    g.fill(K.rect(-28, 9.5, -9.5, 37), '#E9DFCB');
    { const s = []; for (let x = -27; x < -9.5; x += 2.2) { const a = g.p(x, 9.5, 0), b = g.p(x, 37, 0); s.push(a[0], a[1], b[0], b[1]); } for (let y = 10.6; y < 37; y += 2.2) { const a = g.p(-28, y, 0), b = g.p(-9.5, y, 0); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#DCCFB4', 0.3); }
    g.fill(K.rect(14.5, -20, 37, -9.5), '#E9E4D8');
    { const s = []; for (let x = 16; x < 37; x += 3) { const a = g.p(x, -20, 0), b = g.p(x, -9.5, 0); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#DAD3C4', 0.3); }
    g.fill(K.rect(9.5, 9.5, 37, 37), '#E8E3D6');
    { const s = []; for (let x = 11; x < 37; x += 3.2) { const a = g.p(x, 9.5, 0), b = g.p(x, 37, 0); s.push(a[0], a[1], b[0], b[1]); } for (let y = 11; y < 37; y += 3.2) { const a = g.p(9.5, y, 0), b = g.p(37, y, 0); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#D9D2C2', 0.3); }
    // guard rails along the far kerbs (low white rails on posts). Each run stops 1.5 u short of the crossing, clear of the
    // crowd's widest paths. (Left in the ground: the pavement walkers keep 1.6 u behind them, too far for a rail to reach
    // their feet on screen, and as standing things they only gave the crowd near them sprite slots)
    for (const [a0, a1] of [[-36.5, -15.5], [15.5, 36.5]]) {
      const n = Math.round((a1 - a0) / 2.2), s = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n), p = g.p(a, -7.5, 0), q = g.p(a, -7.5, 1.6), r = g.p(-7.5, a, 0), t = g.p(-7.5, a, 1.6); s.push(p[0], p[1], q[0], q[1], r[0], r[1], t[0], t[1]); }
      g.segs2(s, '#8C8576', 0.35); g.fine([[a0, -7.5, 1.6], [a1, -7.5, 1.6]], { w: 0.45, c: '#B9B6AD' }); g.fine([[-7.5, a0, 1.6], [-7.5, a1, 1.6]], { w: 0.45, c: '#B9B6AD' });
    }
  }, { rim: true });

  /* ---------------- the far corner: QFRONT and two towers hung with billboards ---------------- */
  // the back tower along road B: a karaoke and a bookshop below, a giant anime billboard down its face to the crossing
  T.obj([-37, -37, -10, -29], function (g) {
    const Z = 33;
    K.box(g, -37, -37, -10, -29, 0, Z, { t: '#E0E3E1', l: '#EEF0EC', r: '#D9DDDC' }, { w: 1 });
    const fR = FC('R', -10, -37, -29), fL = FC('L', -29, -37, -10);
    shop(g, fR, 0.04, 0.96, 0.3, 4.3, { goods: 11 });
    pic(g, fR, 0.06, 0.94, 7.5, 30.5, 'idol', { bg: '#3F3A8A', dress: '#F7A6C6', hair: '#5A7FD0', en: 'LIVE', band: '#C9463E' });
    bladeR(g, -36.2, -10, 2.4, 4.8, 7.6, '#E6C24F', { jp: '本' });
    panes(g, fL, 0.02, 0.33, 24.2, Z - 0.4, { fh: 3.0, bay: 2.2 });
    board(g, fL, 0.36, 0.98, 30, 32.6, '#E6C24F', { en: 'SHIBUYA' });
    roofKit(g, -37, -37, -10, -29, Z, 7, { ac: 3, tank: [-33, -34], ant: [-14, -34] });
  }, { name: 'billboard tower' });
  // the slim tower on the left, along road A: a ramen counter, karaoke floors, a soda billboard
  T.obj([-37, -28, -29, -10], function (g) {
    const Z = 24;
    K.box(g, -37, -28, -29, -10, 0, Z, { t: '#E9E4D8', l: '#F3EFE5', r: '#DDD7CA' }, { w: 1 });
    const fL = FC('L', -10, -37, -29);
    shop(g, fL, 0.06, 0.94, 0.3, 4.0, { col: LIT2 });
    TK.noren(g, 'L', -10, -35.6, -31.6, 2.4, 4.0, '#2F3A5A', { n: 3 });
    board(g, fL, 0.05, 0.62, 4.4, 6.0, '#F3F1EA', { jp: 'ラーメン', ink: '#C9463E' });
    panes(g, fL, 0.04, 0.7, 6.4, 13.2, { fh: 3.4, bay: 2.1 });
    bladeL(g, -30.0, -10, 2.4, 6.6, 15.8, '#C9463E', { jp: 'カラオケ' });
    pic(g, fL, 0.05, 0.95, 14.2, 23.4, 'drink', { bg: '#7FC6E0', can: '#C9463E', en: 'SODA' });
    roofKit(g, -37, -28, -29, -10, Z, 9, { ac: 1, tank: [-34, -20] });
  }, { name: 'ramen tower' });
  // QFRONT: a glass tower with a cut corner towards the crossing; the corner face is the giant screen (an actor), the
  // café behind the first-floor glass looks down on the crossing
  const qP = [[-28, -10], [-20, -10], [-10, -20], [-10, -28]];
  const qL = PL(qP[0], qP[1]), qC = PL(qP[1], qP[2]), qR = PL(qP[2], qP[3]), QZ = 30;
  T.obj([-28, -28, -10, -10], function (g) {
    const cols = [['#D3E4E8', qL], ['#C4D8DE', qC], ['#AFC6CF', qR]];
    for (const [c, f] of cols) g.fill(quad(f, 0, 1, 0, QZ), c);
    g.line([[-28, -10, 0], [-28, -28, 0], [-10, -28, 0]], { w: 0.5, co: true });
    // floors: the shop on the street, the café above it, the curtain wall
    for (const [, f] of cols) { shop(g, f, 0.02, 0.98, 0.3, 4.2, { bay: 2.2 }); g.fill(quad(f, 0, 1, 4.5, 8.5, 0.02), LIT2); }
    { const R = RNG(77), hd = []; for (let k = 0; k < 14; k++) { const fi = k % 3, f = cols[fi][1], p = g.p.apply(g, f(0.06 + R() * 0.88, 6.3, 0.03)); hd.push(p); } for (const p of hd) { g.disc2([p[0], p[1] - 1.2], 0.85, '#5A4A3C'); g.fill2([[p[0] - 1.1, p[1] + 1.6], [p[0] + 1.1, p[1] + 1.6], [p[0] + 0.9, p[1] - 0.4], [p[0] - 0.9, p[1] - 0.4]], R.pick(['#3F5F8F', '#F3F1EA', '#C9584B', '#3B3F47', '#E6C24F'])); } }
    { const s = []; for (const [, f] of cols) { for (const z of [4.5, 8.5]) { const a = g.p.apply(g, f(0, z, 0.03)), b = g.p.apply(g, f(1, z, 0.03)); s.push(a[0], a[1], b[0], b[1]); } for (let i = 1; i < 4; i++) { const a = g.p.apply(g, f(i / 4, 4.5, 0.03)), b = g.p.apply(g, f(i / 4, 8.5, 0.03)); s.push(a[0], a[1], b[0], b[1]); } } g.segs2(s, '#5A6470', 0.4); }
    panes(g, qL, 0, 1, 9, QZ - 0.5, { fh: 2.6, bay: 2.0, gap: 0.12, sill: 0.08, head: 0.08, col: '#C6DDE5', lc: '#8EA7B6', sills: false, lit: 0.75 });
    panes(g, qR, 0, 1, 9, QZ - 0.5, { fh: 2.6, bay: 2.0, gap: 0.12, sill: 0.08, head: 0.08, col: '#AFC8D3', lc: '#8EA7B6', sills: false, lit: 0.75 });
    panes(g, qC, 0, 0.07, 9, QZ - 0.5, { fh: 2.6, n: 1, gap: 0.08, sill: 0.08, head: 0.08, col: '#BCD3DB', lc: '#8EA7B6', sills: false, glint: false });
    panes(g, qC, 0.93, 1, 9, QZ - 0.5, { fh: 2.6, n: 1, gap: 0.08, sill: 0.08, head: 0.08, col: '#BCD3DB', lc: '#8EA7B6', sills: false, glint: false });
    // the screen's frame (the picture itself is an actor) and the name above it
    const fr = quad(qC, 0.07, 0.93, 9.0, 26.9, 0.04); g.fill(fr, '#24282E'); g.outline(fr, { w: 0.9, boil: false });
    board(g, qC, 0.2, 0.8, 27.5, 29.4, '#24282E', { en: 'QFRONT', ink: '#F6F3EA', glow: false });
    // silhouette and edges
    const top = [[-28, -28, QZ], [-10, -28, QZ], [-10, -20, QZ], [-20, -10, QZ], [-28, -10, QZ]]; g.fill(top, '#E6E9E6'); g.outline(top, { w: 0.9 });
    edges(g, [qP[0], qP[3]], 0, QZ, 1); edges(g, [qP[1], qP[2]], 0, QZ, 0.75);
    g.line([[-28, -10, 0], [-20, -10, 0], [-10, -20, 0], [-10, -28, 0]], { w: 1 });
    roofKit(g, -27, -27, -11, -11, QZ, 13, { ac: 3, hut: [-24, -25] });
  }, { name: 'qfront' });

  /* ---------------- the right corner: SHIBUYA 109 ---------------- */
  // a low block tucked behind it on road B
  T.obj([9.5, -37, 16, -27], function (g) {
    K.box(g, 9.5, -37, 16, -27, 0, 14, { t: '#E9E4D8', l: '#F1EDE3', r: '#DCD6C9' }, { w: 0.9 });
    const fL = FC('L', -27, 9.5, 16);
    shop(g, fL, 0.05, 0.95, 0.3, 4.0, { col: LIT2, goods: 5 }); panes(g, fL, 0.05, 0.95, 4.6, 13.6, { fh: 3.1, bay: 2.1 });
    roofKit(g, 9.5, -37, 16, -27, 14, 21, { ac: 1 });
  }, { name: 'dogenzaka block' });
  T.obj([14, -36.5, 36.5, -14], function (g) {
    const cx = 20, cy = -20, r = 5.2, ZB = 17, ZC = 40, CR0 = ZC - 10;
    // the building: silver panels, a giant ad on its face, shop windows along the street
    K.box(g, 20, -36.5, 36.5, -20, 0, ZB, { t: '#E2E4E2', l: '#EEEFEC', r: '#CBD0D0' }, { w: 1 });
    const fL = FC('L', -20, 20, 36.5), fR = FC('R', 36.5, -36.5, -20);
    shop(g, fL, 0.34, 0.98, 0.3, 4.2, { goods: 31 }); shop(g, fR, 0.03, 0.97, 0.3, 4.2, { goods: 32 });
    { const s = []; for (let z = 5.2; z < ZB; z += 2.3) for (const f of [fL, fR]) { const a = g.p.apply(g, f(f === fL ? 0.31 : 0, z, 0.02)), b = g.p.apply(g, f(1, z, 0.02)); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#B5BBBC', 0.3); }
    pic(g, fL, 0.4, 0.95, 5.0, 16.2, 'girl', { bg: '#FBD3DE', hair: '#E8A33A', eye: '#3F7FC0', top: '#2E2A26', tie: '#F2A0C0', en: 'NEW', band: '#D8322E' });
    panes(g, fR, 0.05, 0.62, 5.4, ZB - 0.6, { fh: 2.9, bay: 2.0 });
    bladeR(g, -24, 36.5, 2.2, 5.5, 15.8, '#2E2A26', { en: 'SHIBUYA', ink: '#F6F3EA' });
    roofKit(g, 26, -36, 36, -21, ZB, 23, { ac: 3 });
    // the cylinder: its lower part stands in the corner of the building, the rest rises clear of the roof
    const arc = (rr, z, a0, a1, n) => { const p = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, z]); } return p; };
    const CL = '#E8EBEA', CM = '#D3D8D8', CR = '#B8BEBF', AL = Math.PI * 0.75, AR = -Math.PI * 0.25;
    const drum = (a0, z0, z1, rr, cols) => {
      for (const [b0, b1, c] of [[AL, Math.PI * 0.5, cols[0]], [Math.PI * 0.5, Math.PI * 0.25, cols[1]], [Math.PI * 0.25, a0, cols[2]]]) if (b0 > a0) g.fill(arc(rr, z0, b0, Math.max(b1, a0), 6).concat(arc(rr, z1, Math.max(b1, a0), b0, 6)), c);
    };
    const ribs = (a0, z0, z1) => {
      const s = []; for (let z = z0 + 2.3; z < z1 - 0.3; z += 2.3) { const p = g.P(arc(r + 0.03, z, AL, a0, 12)); for (let i = 0; i + 1 < p.length; i++) s.push(p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]); }
      for (let a = AL - 0.12; a > a0 + 0.05; a -= Math.PI / 12) { const p = g.p(cx + Math.cos(a) * (r + 0.03), cy + Math.sin(a) * (r + 0.03), z0), q = g.p(cx + Math.cos(a) * (r + 0.03), cy + Math.sin(a) * (r + 0.03), z1); s.push(p[0], p[1], q[0], q[1]); }
      g.segs2(s, '#9AA2A4', 0.28);
    };
    drum(0, 0, ZB, r, [CL, CM, CR]); ribs(0, 4.4, ZB);
    g.fill(arc(r + 0.04, 0.3, AL - 0.03, 0.12, 10).concat(arc(r + 0.04, 4.2, 0.12, AL - 0.03, 10)), LIT1);
    { const s = []; for (let a = AL - 0.03; a > 0.12; a -= Math.PI / 10) { const p = g.p(cx + Math.cos(a) * (r + 0.06), cy + Math.sin(a) * (r + 0.06), 0.3), q = g.p(cx + Math.cos(a) * (r + 0.06), cy + Math.sin(a) * (r + 0.06), 4.2); s.push(p[0], p[1], q[0], q[1]); } g.segs2(s, '#4A545F', 0.38); }
    drum(AR, ZB, CR0, r, [CL, CM, CR]); ribs(AR, ZB, CR0);
    // the crown: a white drum between red rims, the red 109 running down it
    drum(AR, CR0, ZC, r + 0.05, ['#FBFAF6', '#EDEDE8', '#D9DAD6']);
    g.mark({ nc: (c) => mix(nightColour(c), c, 0.75) }, g.cmds.length - 3);
    for (const z of [CR0, ZC - 0.6]) g.fill(arc(r + 0.08, z, AL, AR, 16).concat(arc(r + 0.08, z + 0.6, AR, AL, 16)), '#D8322E');
    g.mark({ nc: true }, g.cmds.length - 2);
    { const a = Math.PI * 0.25, rr = r + 0.12, P = (s, z) => [cx + Math.cos(a) * rr + s * Math.SQRT1_2, cy + Math.sin(a) * rr - s * Math.SQRT1_2, z];
      for (const [ch, z] of [['1', ZC - 3.4], ['0', ZC - 6.2], ['9', ZC - 9.0]]) K.textP(g, P, 0, z, 2.4, ch, '#D8322E', { center: true, w: 1.6 });
      const c = g.p(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, ZC - 5); g.glow2('neon', c, c, { r: 11, col: '#FF7A6E' }); }
    // a flat cap with its rim; a fashion banner hung down the drum's front
    const cap = arc(r + 0.35, ZC, 0, TAU, 28); g.fill(cap, '#DCDFDE');
    g.fill(arc(r + 0.35, ZC, AL, AR, 14).concat(arc(r + 0.35, ZC + 0.5, AR, AL, 14)), '#C9CCCC');
    g.fill(arc(r + 0.35, ZC + 0.5, 0, TAU, 28), '#E6E8E6'); g.line(arc(r + 0.35, ZC + 0.5, 0, TAU, 28), { w: 0.8 });
    const ban = (() => { const a0 = Math.PI * 0.58, a1 = Math.PI * 0.2, rr = r + 0.12; const f = (u, z, dd) => { const a = lerp(a0, a1, u), q = rr + (dd || 0); return [cx + Math.cos(a) * q, cy + Math.sin(a) * q, z]; }; f.len = (a0 - a1) * rr; return f; })();
    pic(g, ban, 0, 1, 7.0, CR0 - 1.4, 'model', { bg: '#F7DCA8', coat: '#D8322E', en: 'SALE', band: '#2E2A26' });
    // outlines: the left silhouette, the base, the join with the building, the right silhouette above the roof
    const pa = (a, z) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r, z];
    g.line([pa(AL, 0), pa(AL, ZC + 0.5)], { w: 1 }); g.line([pa(AR, ZB), pa(AR, ZC + 0.5)], { w: 1 });
    g.line(arc(r, 0, AL, 0, 12), { w: 0.9 }); g.line([pa(0, 0), pa(0, ZB)], { w: 0.75 }); g.line(arc(r, ZB, 0, AR, 4), { w: 0.6 });
  }, { name: '109' });

  /* ---------------- the left corner: Hachikō square ---------------- */
  // the station: the Hachikō exit under the 渋谷 sign, a long screen above, the JR mark
  T.obj([-37, 9.5, -28, 37], function (g) {
    const Z = 16;
    K.box(g, -37, 9.5, -28, 37, 0, Z, { t: '#E3E0D6', l: '#EFEBE1', r: '#DCD7CB' }, { w: 1 });
    const fR = FC('R', -28, 9.5, 37), fL = FC('L', 37, -37, -28), u = (y) => (37 - y) / 27.5;
    // the exit: a wide opening, the lit concourse and its ticket gates
    const ex = quad(fR, u(31), u(16.5), 0, 5.4, 0.02); g.fill(ex, '#3A3F47'); g.fill(quad(fR, u(30.6), u(16.9), 0.3, 4.9, 0.03), LIT1);
    { const s = []; for (let y = 29.5; y > 17.5; y -= 1.6) { const a = g.p.apply(g, fR(u(y), 0.3, 0.05)), b = g.p.apply(g, fR(u(y), 2.0, 0.05)); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#5A6470', 1.6); }
    g.outline(ex, { w: 0.7, boil: false });
    TK.awning(g, 'R', -28, 15.8, 31.8, 6.1, 2.6, '#E3E0D6', { drop: 0.5 });
    board(g, fR, u(29.5), u(18.5), 6.7, 11.0, '#FBFAF6', { line: true });
    { const P2 = (a, z) => fR(a / fR.len, z, 0.12); TK.wordP(g, P2, u(24) * fR.len, 9.4, 2.2, '渋谷', '#2E2A26'); K.textP(g, P2, u(24) * fR.len, 7.1, 0.85, 'SHIBUYA', '#2E2A26', { center: true }); }
    board(g, fR, u(17.8), u(16.2), 7.8, 9.8, '#3F9A5A', { en: 'JR', ink: '#FBFAF6' });
    pic(g, fR, u(34), u(14), 11.3, 15.2, 'idol', { bg: '#5B4A9A', cu: 0.32, dress: '#F2A0C0' });
    panes(g, fR, u(36.5), u(34.6), 6.6, 15, { fh: 2.8, n: 1 }); panes(g, fR, u(13.6), u(10.2), 6.6, 15, { fh: 2.8, n: 1 });
    panes(g, fL, 0.06, 0.94, 6.6, 15.2, { fh: 2.8, bay: 2.2 }); shop(g, fL, 0.08, 0.92, 0.3, 4.2, { col: LIT2, goods: 41 });
    roofKit(g, -37, 9.5, -28, 37, Z, 29, { ac: 3 });
  }, { name: 'station' });
  // the kōban: a small police box with the red lamp over its door and its name
  T.obj([-26.5, 10.5, -21, 15.5], function (g) {
    K.box(g, -26.5, 10.5, -21, 15.5, 0, 6.2, { t: '#D9D6CC', l: '#F3F1EA', r: '#E2DFD5' }, { w: 0.85 });
    K.box(g, -27, 10, -20.5, 16, 6.2, 7.0, { t: '#6E747A', l: '#8C9298', r: '#7A8086' }, { w: 0.7 });
    K.box(g, -25.6, 11.4, -22.2, 14.6, 7.0, 8.2, { t: '#7A8086', l: '#9AA0A5', r: '#868C91' }, { w: 0.55 });
    const fR = FC('R', -21, 10.5, 15.5), fL = FC('L', 15.5, -26.5, -21);
    g.fill(quad(fR, 0.25, 0.75, 0, 4.0, 0.03), LIT1); g.outline(quad(fR, 0.25, 0.75, 0, 4.0, 0.03), { w: 0.5, boil: false });
    g.fill(quad(fL, 0.15, 0.85, 1.8, 4.0, 0.03), C.glass); g.mark({ win: 1 });
    board(g, fL, 0.12, 0.88, 4.6, 5.8, '#F3F1EA', { en: 'KOBAN', ink: '#2F3A5A', glow: false });
    { const l = g.p.apply(g, fR(0.5, 5.1, 0.25)); g.disc2(l, 0.95, '#D4402E'); g.mark({ nc: true, light: true }); g.ring2(l, 0.95, { w: 0.4, c: '#7A2A22' }); g.glow2('neon', l, l, { r: 4, col: '#FF5A48' }); }
    { const e = g.p.apply(g, fL(0.5, 6.6, 0.1)); g.disc2(e, 0.55, '#E6C24F'); }
  }, { name: 'koban' });
  // Hachikō: the bronze Akita sitting up on his granite stone, ears pricked, tail curled over his back
  T.obj([-17.9, 17.6, -15.1, 20.4], function (g) {
    K.box(g, -17.9, 17.6, -15.1, 20.4, 0, 3.0, { t: '#C9C6BD', l: '#BDB9AF', r: '#A7A399' }, { w: 0.7 });
    g.fill(quad(FC('L', 20.4, -17.9, -15.1), 0.25, 0.75, 1.2, 2.1, 0.03), '#8A7550');
    const p = g.p(-16.5, 19, 3.0), k = 1.2, B = '#6E5A44', L = '#8A7458', D = '#4E3E30', s = (u, v) => [p[0] + u * k, p[1] + v * k];
    const body = K.curve([s(-3.0, 0), s(1.6, 0), s(2.3, -2.4), s(1.6, -5.0), s(-0.4, -4.8), s(-2.6, -3.0)], 2, true);
    g.fill2(body, B, true); g.fill2([s(-0.2, -4.6), s(1.4, -4.9), s(2.0, -2.6), s(1.2, -1.0), s(0.2, -2.2)], L, true);
    g.fill2([s(-2.9, -2.4), s(-4.2, -3.4), s(-4.0, -4.9), s(-2.8, -5.3), s(-2.1, -4.3), s(-3.0, -3.8), s(-2.3, -3.2)], D, true);
    const head = K.curve([s(0.5, -4.8), s(2.6, -5.3), s(3.7, -7.1), s(3.2, -8.9), s(1.5, -9.3), s(0.3, -7.9)], 2, true);
    g.fill2(head, B, true); g.fill2([s(1.4, -9.0), s(2.9, -8.8), s(3.4, -7.4), s(2.6, -7.0), s(1.8, -7.8)], L, true);
    g.fill2([s(1.1, -8.9), s(1.5, -10.9), s(2.2, -9.1)], D, true); g.fill2([s(2.5, -8.8), s(3.2, -10.6), s(3.4, -8.5)], D, true);
    g.fill2([s(3.4, -7.4), s(4.7, -6.9), s(4.5, -6.2), s(3.4, -6.4)], D, true);
    g.fill2([s(1.0, 0), s(1.8, 0), s(1.9, -3.0), s(1.2, -3.0)], D, true); g.fill2([s(-0.6, 0), s(0.2, 0), s(0.1, -1.6)], D, true);
    g.line2(body, { w: 0.5, c: '#2E2620', boil: false, close: true }); g.line2(head, { w: 0.5, c: '#2E2620', boil: false, close: true });
    g.disc2(s(2.75, -7.6), 0.28, '#1E1A16'); g.disc2(s(4.6, -6.6), 0.3, '#1E1A16');
  }, { name: 'hachiko' });
  T.obj([-27, 28.4, -17, 31.6], (g) => { g.at(-22, 30, 0, (g2) => TK.trainCar(g2, 0, { kind: 'frog', cab: 1, hl: 4.8 })); }, { name: 'green car' });
  // trees: a cherry by the station, zelkovas round the square, a bench under one
  T.obj([-12, 35.4], (g) => TK.sakura(g, -12, 35.4, { r: 3.8, h: 4.2 }), { on: true });
  T.obj([-25.6, 34.6], (g) => K.tree(g, -25.6, 34.6, TK.leaves({ r: 3.4, h: 4.6, col: C.leafL }, 'zelkova', 1)), { on: true });
  T.obj([-17.5, 34.6], (g) => K.bench(g, -17.5, 34.6, { face: 'R', L: 2.2 }), { on: true });   // (its ends inside the square, not over the kerb)
  T.obj([-20.8, 24.2, -16.4, 25.6], (g) => { const R = RNG(5); K.box(g, -20.8, 24.2, -16.4, 25.6, 0, 1.3, { t: '#8DB868', l: '#B9B6AD', r: '#A3A097' }, { w: 0.55 }); for (let i = 0; i < 9; i++) { const c = g.p(-20.5 + i * 0.47, 24.5 + R() * 0.9, 1.45); g.disc2(c, 0.55, R.pick(['#E7A9A0', '#F3E3A0', '#F6F3EA', '#E08A3C'])); } }, { name: 'planter' });

  /* ---------------- the near corner: the subway stairs, a café, a busker ---------------- */
  T.obj([27, 27, 36.5, 36.5], function (g) {
    const Z = 5.4;
    K.box(g, 27, 27, 36.5, 36.5, 0, Z, { t: '#E3DED2', l: '#F3EFE5', r: '#DDD6C8' }, { w: 0.9 });
    const fL = FC('L', 36.5, 27, 36.5), fR = FC('R', 36.5, 27, 36.5);
    shop(g, fL, 0.04, 0.96, 0.3, 3.6, { col: LIT2, goods: 51 }); shop(g, fR, 0.04, 0.96, 0.3, 3.6, { goods: 52 });
    TK.awning(g, 'L', 36.5, 27.3, 36.2, 4.2, 1.6, '#2F6A4F', { drop: 0.7 }); TK.awning(g, 'R', 36.5, 27.3, 36.2, 4.2, 1.6, '#E6C24F', { stripe: '#F3F1EA', drop: 0.7 });
    board(g, fL, 0.12, 0.88, 4.3, 5.3, '#2F6A4F', { jp: 'コーヒー', ink: '#F6F3EA' }); board(g, fR, 0.3, 0.7, 4.3, 5.3, '#F3F1EA', { jp: '花', ink: '#C9463E' });
    // flower buckets outside the florist
    { const R = RNG(53); for (let i = 0; i < 6; i++) { const c = g.p(36.9, 34.6 - i * 0.9, 0.9); g.fill2([[c[0] - 0.7, c[1] + 0.9], [c[0] + 0.7, c[1] + 0.9], [c[0] + 0.8, c[1] - 0.3], [c[0] - 0.8, c[1] - 0.3]], '#5A6470', true); for (let j = 0; j < 3; j++) g.disc2([c[0] + (R() - 0.5) * 1.4, c[1] - 1.0 - R() * 0.8], 0.6, R.pick(['#E7A9A0', '#F3E3A0', '#C9463E', '#F6F3EA', '#D98AA4'])); } }
    // a roof terrace: parasols over two tables
    for (const [x, y, c] of [[30, 31, '#C9463E'], [33.6, 33.4, '#F3F1EA']]) { K.box(g, x - 0.6, y - 0.6, x + 0.6, y + 0.6, Z, Z + 1.3, '#C9A26B', { w: 0.35, boil: false }); const t = g.p(x, y, Z + 3.4), um = []; for (let i = 0; i <= 10; i++) { const a = Math.PI + Math.PI * i / 10; um.push([t[0] + Math.cos(a) * 5, t[1] + 1.4 + Math.sin(a) * 2.2]); } g.line2([g.p(x, y, Z), t], { w: 0.35, c: '#5A4A3C', boil: false }); g.fill2(um, c); g.outline2(um, { w: 0.4, c: shade(c, 0.5), boil: false }); }
    roofKit(g, 27, 27, 36.5, 36.5, Z, 55, { ac: 1 });
  }, { name: 'cafe' });
  // the subway stairs under a glass canopy, the metro sign on a post (the footprint takes in the canopy's eaves and the post)
  T.obj([14.2, 26.7, 22.4, 34.9], function (g) {
    const x0 = 14.5, y0 = 27, x1 = 21.5, y1 = 34;
    K.box(g, x0, y0, x1, y1, 0, 1.2, { t: '#4A545F', l: '#B9B6AD', r: '#A3A097' }, { w: 0.7 });
    { const s = []; for (let i = 0; i < 6; i++) { const y = y0 + 0.8 + i * 0.95, z = 1.2 - 0.05; const a = g.p(x0 + 0.6, y, z), b = g.p(x1 - 0.6, y, z); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#7E848C', 0.5); }
    for (const [x, y] of [[x0 + 0.3, y1 - 0.3], [x1 - 0.3, y1 - 0.3], [x1 - 0.3, y0 + 0.3]]) g.line([[x, y, 1.2], [x, y, 5.2]], { w: 0.55, boil: false });
    const cn = [[x0 - 0.3, y0 - 0.3, 5.2], [x1 + 0.3, y0 - 0.3, 5.2], [x1 + 0.3, y1 + 0.3, 5.0], [x0 - 0.3, y1 + 0.3, 5.0]]; g.fill(cn, 'rgba(201,224,234,0.82)'); g.outline(cn, { w: 0.7, boil: false });
    { const s = []; for (let x = x0 + 1.2; x < x1; x += 1.4) { const a = g.p(x, y0 - 0.3, 5.22), b = g.p(x, y1 + 0.3, 5.02); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#8EA7B6', 0.3); }
    const pf = g.p(x1 + 0.6, y1 + 0.6, 0), pt = g.p(x1 + 0.6, y1 + 0.6, 6.4); g.line2([pf, pt], { w: 0.6, c: '#5A564E', boil: false });
    board(g, FC('L', y1 + 0.6, x1 - 0.6, x1 + 1.8), 0, 1, 6.4, 8.4, '#3F7FC0', { en: 'M', ink: '#F6F3EA' });
  }, { name: 'subway' });
  for (const [x, y, i] of [[33.5, 14.5, 0], [12, 36, 1]]) T.obj([x, y], (g) => K.tree(g, x, y, TK.leaves({ r: 3.4, h: 4.6 }, 'zelkova', i)), { on: true });
  T.obj([10.6, 22.4, 12.2, 28.4], (g) => { TK.vend(g, 11.4, 23.6, { face: 'R', col: '#F1EFE8', top: '#C9463E' }); TK.vend(g, 11.4, 25.8, { face: 'R', col: '#3F7FC0', top: '#F1EFE8' }); for (const [y, c] of [[27.3, '#3F7FC0'], [28.1, '#E6C24F']]) { K.box(g, 11.0, y - 0.35, 11.8, y + 0.35, 0, 1.6, { t: shade(c, -0.2), l: c, r: shade(c, 0.15) }, { w: 0.35, boil: false }); g.disc2(g.p(11.82, y, 1.25), 0.35, '#2E2A26'); } }, { name: 'vending' });
  T.obj([32, -14], (g) => K.tree(g, 32, -14, TK.leaves({ r: 3.2, h: 4.6 }, 'zelkova', 1)), { on: true });
  T.obj([30.6, 19.0], (g) => K.bench(g, 30.6, 19.0, { face: 'L', L: 2.2 }), { on: true });
  T.ground(function (g) { for (const [x, y] of [[16.2, 8.2], [18.4, 8.2], [8.2, 16.2], [8.2, 18.4], [16.2, -8.2], [18.4, -8.2], [-8.2, 16.2], [-8.2, 18.4]]) { const a = g.p(x, y, 0), b = g.p(x, y, 1.4); g.line2([a, b], { w: 1.2, c: '#8C8576', boil: false, ext: 0 }); g.disc2(b, 0.62, '#B9B6AD'); } });
  T.obj([35.2, -10.6], (g) => K.lamp(g, 35.2, -10.6, { h: 9.5, n: 3 }), { on: true });
  T.obj([-24, -8.0], (g) => K.lamp(g, -24, -8.0, { h: 9.5, n: 3 }), { on: true });

  /* ---------------- the living layer ---------------- */
  // QFRONT's screen: the beckoning cat, a singer, a soda ad and the name of the place, a new picture every 3.5 s
  const SO = qC(0.5, 9.0);
  T.actor({ sample: 1, period: 14, grow: false,
    at(t) { const c = Math.floor(t / 3.5) % 4, f = Math.floor(t * 3) % 6; return { x: SO[0], y: SO[1], key: c + '.' + f, c, f }; },
    draw(g, st) {
      const F = (u, z, dd) => { const p = qC(u, z, dd); return [p[0] - SO[0], p[1] - SO[1], p[2]]; }; F.len = qC.len;
      const i0 = g.cmds.length, u0 = 0.09, u1 = 0.91, z0 = 9.3, z1 = 26.6;
      if (st.c === 0) {                                                                 // the beckoning cat
        const X = (u, v) => F(lerp(u0, u1, u), lerp(z0, z1, v), 0.06), poly = (pts, col) => g.fill(pts.map((p) => X(p[0], p[1])), col);
        const bg = ['#F2B6C2', '#F7D9DF'];
        poly([[0, 0], [1, 0], [1, 1], [0, 1]], bg[0]); for (let i = 0; i < 5; i++) poly([[i * 0.2, 0], [i * 0.2 + 0.1, 0], [i * 0.2 + 0.1, 1], [i * 0.2, 1]], bg[1]);
        const sm = (pts) => K.curve(pts, 3, true);
        poly(sm([[0.25, 0.05], [0.75, 0.05], [0.78, 0.3], [0.7, 0.45], [0.3, 0.45], [0.22, 0.3]]), '#FBFAF6');
        poly(sm([[0.2, 0.42], [0.8, 0.42], [0.82, 0.68], [0.66, 0.84], [0.34, 0.84], [0.18, 0.68]]), '#FBFAF6');
        poly([[0.22, 0.76], [0.28, 0.95], [0.4, 0.82]], '#FBFAF6'); poly([[0.78, 0.76], [0.72, 0.95], [0.6, 0.82]], '#FBFAF6');
        poly([[0.25, 0.78], [0.29, 0.9], [0.36, 0.81]], '#F2A3B0'); poly([[0.75, 0.78], [0.71, 0.9], [0.64, 0.81]], '#F2A3B0');
        for (const a of [0.38, 0.62]) poly([[a - 0.03, 0.6], [a + 0.03, 0.6], [a + 0.03, 0.67], [a - 0.03, 0.67]], '#2A2622');
        poly([[0.47, 0.55], [0.53, 0.55], [0.5, 0.52]], '#E07A6A');
        poly([[0.2, 0.4], [0.8, 0.4], [0.8, 0.45], [0.2, 0.45]], '#D4553A'); poly([[0.46, 0.33], [0.54, 0.33], [0.54, 0.41], [0.46, 0.41]], '#E6C24F');
        const lift = [0, 0.05, 0.1, 0.14, 0.1, 0.05][st.f];
        poly([[0.7, 0.36 + lift], [0.84, 0.4 + lift], [0.86, 0.54 + lift], [0.76, 0.56 + lift], [0.7, 0.46 + lift]], '#FBFAF6');
        g.outline(sm([[0.2, 0.42], [0.8, 0.42], [0.82, 0.68], [0.66, 0.84], [0.34, 0.84], [0.18, 0.68]]).map((p) => X(p[0], p[1])), { w: 0.4, c: '#8C8576', boil: false });
      } else if (st.c === 1) pic(g, F, u0, u1, z0, z1, 'idol', { bg: '#4A3A8A', dress: '#F7A6C6', arm: st.f % 2, glow: false });
      else if (st.c === 2) pic(g, F, u0, u1, z0, z1, 'drink', { bg: '#79C9E4', can: st.f < 3 ? '#C9463E' : '#E6C24F', en: 'SODA', glow: false });
      else {                                                                            // the place's name, a burst of colour behind it
        const X = (u, v) => F(lerp(u0, u1, u), lerp(z0, z1, v), 0.06), poly = (pts, col) => g.fill(pts.map((p) => X(p[0], p[1])), col);
        const cols = ['#E6C24F', '#E0503E', '#3FA9D9', '#7FC07A', '#D98AE4', '#F2A0C0'];
        poly([[0, 0], [1, 0], [1, 1], [0, 1]], '#2B2F45');
        for (let i = 0; i < 12; i++) { const a = TAU * (i + st.f * 0.3) / 12, b = a + 0.22; poly([[0.5, 0.55], [0.5 + Math.cos(a) * 0.9, 0.55 + Math.sin(a) * 1.4], [0.5 + Math.cos(b) * 0.9, 0.55 + Math.sin(b) * 1.4]].map(([u, v]) => [clamp(u, 0, 1), clamp(v, 0, 1)]), cols[(i + st.f) % 6]); }
        poly([[0.06, 0.4], [0.94, 0.4], [0.94, 0.7], [0.06, 0.7]], '#2B2F45');
        const P2 = (a, z) => F(a / F.len, z, 0.1), W = (u1 - u0) * F.len, h = W * 0.78 / K.textW('SHIBUYA', 1);
        K.textP(g, P2, 0.5 * F.len, lerp(z0, z1, 0.55) - h / 2, h, 'SHIBUYA', '#FBF8EE', { center: true, w: 1.3 });
      }
      g.mark({ nc: true }, i0); for (let k = i0; k < g.cmds.length; k++) if (g.cmds[k].k === K_FILL) { g.cmds[k].light = true; break; }
    } });

  // signals on the four corners: car heads and the walking man
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const { tc } = cyc(t); const ph = tc < 3.8 ? 'A' : tc < 4.8 ? 'Ay' : tc < 8.8 ? 'B' : tc < 9.8 ? 'By' : tc < PED0 ? 'R' : tc < CYC - 2.2 ? 'P' : (Math.floor(tc * 3) % 2 ? 'Pb' : 'R'); return { x: sx * 8.1, y: sy * 8.1, key: ph, ph }; },
    draw(g, st) {
      const b = g.p(0, 0, 0), t = g.p(0, 0, 9.5);
      g.fill2([[b[0] - 0.4, b[1]], [b[0] + 0.4, b[1]], [t[0] + 0.3, t[1]], [t[0] - 0.3, t[1]]], '#6B6458');
      // car head: three lamps in a row on a dark box
      const h = [t[0] - 4.6, t[1] + 0.8];
      g.fill2([[h[0] - 0.4, h[1] - 1.3], [h[0] + 4.6, h[1] - 1.3], [h[0] + 4.6, h[1] + 1.1], [h[0] - 0.4, h[1] + 1.1]], '#3A3530', true);
      const carGreen = (sx === sy) ? st.ph === 'A' : st.ph === 'B', carY = (sx === sy) ? st.ph === 'Ay' : st.ph === 'By';
      [['#5FC07A', carGreen], ['#E9C543', carY], ['#E0503E', !carGreen && !carY]].forEach(([c, on], i) => { g.disc2([h[0] + 0.7 + i * 1.5, h[1] - 0.1], 0.62, on ? c : '#5A544A'); if (on) g.mark({ nc: true, light: true }); });
      // the pedestrian head: a red standing man above a green walking man
      const p = [t[0] + 0.6, t[1] + 3.2];
      g.fill2([[p[0], p[1] - 3.4], [p[0] + 2.2, p[1] - 3.4], [p[0] + 2.2, p[1] + 1.4], [p[0], p[1] + 1.4]], '#3A3530', true);
      const pg = st.ph === 'P', pr = !pg && st.ph !== 'Pb';
      g.fill2([[p[0] + 0.8, p[1] - 3.0], [p[0] + 1.4, p[1] - 3.0], [p[0] + 1.4, p[1] - 1.4], [p[0] + 0.8, p[1] - 1.4]], pr ? '#E0503E' : '#5A544A', true); if (pr) g.mark({ nc: true, light: true });
      g.fill2([[p[0] + 0.6, p[1] - 0.6], [p[0] + 1.6, p[1] - 0.6], [p[0] + 1.4, p[1] + 1.0], [p[0] + 0.8, p[1] + 1.0]], pg ? '#5FC07A' : '#5A544A', true); if (pg) g.mark({ nc: true, light: true });
    } });

  /* ---- the cars: road A (along x) and road B (along y), two per lane, queueing at the stop lines ---- */
  // left-hand traffic: heading +x keeps to the -y side, heading +y to the +x side
  const LANES = [{ ax: 'x', c: -3.5, d: 1, g0: 0 }, { ax: 'x', c: 3.5, d: -1, g0: 0 }, { ax: 'y', c: 3.5, d: 1, g0: 5.0 }, { ax: 'y', c: -3.5, d: -1, g0: 5.0 }];
  const KINDS = [['taxi', 'bus'], ['car', 'taxi'], ['taxi', 'car'], ['bus', 'taxi']];
  const V = 14, ACC = 8, TAU_A = V / ACC, DACC = V * TAU_A / 2, Q = [-20.3, -32.6];
  LANES.forEach((L, li) => [0, 1].forEach((k) => {
    const kind = KINDS[li][k], col = ['#F1EFE8', '#C9CCCC', '#2F343B', '#8FA3B5'][(li + k * 2) % 4], hl = kind === 'bus' ? 6.8 : 5.3;
    // its half-length and half-width on the ground as drawn (u), along x and y: people beside it are ordered by these
    const half = kind === 'bus' ? [6.8, 2.7] : kind === 'taxi' ? [5.0, 2.45] : [5.3, 2.55], ext = L.ax === 'x' ? half : [half[1], half[0]];
    const qk = k === 0 ? -15.2 - hl : Q[1] - (hl - 5.3), td = L.g0 + k * 0.8, te = td + 8 + k * 2.2, D = qk + 37, Ta = 2 * D / 10;
    const sAt = (tc) => {                                       // position along the lane in this cycle
      if (tc >= td) { const u = tc - td; const s = u < TAU_A ? qk + ACC * u * u / 2 : qk + DACC + V * (u - TAU_A); if (s < 40) return s; }
      if (tc >= te) { const u = Math.min(1, (tc - te) / Ta); return -37 + D * (1 - (1 - u) * (1 - u)); }
      if (tc < td) { const u = tc + CYC - te; if (u >= 0) return -37 + D * (1 - Math.pow(1 - Math.min(1, u / Ta), 2)); }
      return null;
    };
    T.actor({ sample: 0.2, period: CYC, cast: true,
      at(t) {
        const { tc } = cyc(t), s = sAt(tc); if (s == null || s > 39) return null;
        const a = clamp(Math.min((39 - s) / 6, (s + 37 + 2) / 4), 0, 1); if (a <= 0.02) return null;
        const ang = L.ax === 'x' ? (L.d > 0 ? 0 : Math.PI) : (L.d > 0 ? Math.PI / 2 : -Math.PI / 2), p = L.d * s;
        return { x: L.ax === 'x' ? p : L.c, y: L.ax === 'x' ? L.c : p, key: 'v', ang, alpha: a < 1 ? a : null, ext };
      },
      draw(g, st) { if (kind === 'bus') K.bus(g, st.ang, { band: '#6FAE6A' }); else if (kind === 'taxi') TK.taxi(g, st.ang); else K.car(g, st.ang, { col }); } });
  }));

  /* ---- the crowd: 72 people shuttle between the four corners, one crossing per cycle ---- */
  const NW = 72, CORN = [[1, 1], [1, -1], [-1, -1], [-1, 1]], SLOTS = [];
  for (let ci = 0; ci < 4; ci++) { const [sx, sy] = CORN[ci], R = RNG(ci * 97 + 5), list = []; for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) { if (list.length >= 18) break; const u = 0.55 + i * 1.42 + (j % 2) * 0.6 + (R() - 0.5) * 0.3, v = 0.55 + j * 1.18 + (R() - 0.5) * 0.3; if (u > 5.6) continue; list.push({ x: sx * (8.6 + u), y: sy * (8.6 + v), front: Math.min(u, v) + 0.35 * Math.max(u, v), ci }); } while (list.length < 18) list.push({ x: sx * (8.6 + 2.8), y: sy * (8.6 + 4.6 + list.length * 0.01), front: 4, ci }); SLOTS.push(list); }
  // each cycle a seeded shuffle of the 72 slots: about a quarter stay on their corner, the rest scatter (diagonals too)
  const PERM = new Map();
  const perm = (n) => { let p = PERM.get(n); if (p) return p; const R = RNG(n * 7919 + 13); p = []; for (let i = 0; i < NW; i++) p.push(i); for (let i = NW - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)), t = p[i]; p[i] = p[j]; p[j] = t; } p.inv = []; for (let i = 0; i < NW; i++) p.inv[p[i]] = i; if (PERM.size > 64) PERM.clear(); PERM.set(n, p); return p; };
  const slotOf = (n, w) => { const s = perm(n)[w]; return SLOTS[s % 4][Math.floor(s / 4)]; };
  const dirOf = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3);
  // the signal poles stand where the crossings set off: a straight path that would pass through one bends round it
  // (a waypoint 1.2 u out from the pole, on the side the path was passing)
  const POLES = [[-8.1, -8.1], [8.1, -8.1], [-8.1, 8.1], [8.1, 8.1]];
  const pathOf = (A, B, side) => {
    const dx = B.x - A.x, dy = B.y - A.y, L2 = dx * dx + dy * dy, W = [];
    if (side && L2 > 1e-6) { const l = Math.sqrt(L2); W.push({ s: 0.5, x: (A.x + B.x) / 2 + dy / l * 0.6, y: (A.y + B.y) / 2 - dx / l * 0.6 }); }   // keep right
    if (L2 > 1e-6) for (const [px, py] of POLES) {
      const s = ((px - A.x) * dx + (py - A.y) * dy) / L2; if (s <= 0 || s >= 1) continue;
      let nx = A.x + dx * s - px, ny = A.y + dy * s - py; const d = Math.hypot(nx, ny); if (d >= 1.0) continue;
      if (d < 1e-3) { nx = -dy; ny = dx; } const k = 1.2 / Math.hypot(nx, ny); W.push({ s, x: px + nx * k, y: py + ny * k });
    }
    const P = [A].concat(W.sort((a, b) => a.s - b.s), [B]); let len = 0;
    for (let i = 0; i + 1 < P.length; i++) len += Math.hypot(P[i + 1].x - P[i].x, P[i + 1].y - P[i].y);
    P.len = len; return P;
  };
  const along = (P, u) => { for (let i = 0; i + 1 < P.length; i++) { const a = P[i], b = P[i + 1], l = Math.hypot(b.x - a.x, b.y - a.y); if (u <= l || i + 2 === P.length) { const f = l > 0 ? Math.min(1, u / l) : 1; return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), dx: b.x - a.x, dy: b.y - a.y }; } u -= l; } return { x: P[0].x, y: P[0].y, dx: 1, dy: 0 }; };
  const SPD = [], JIT = [];
  for (let w = 0; w < NW; w++) { SPD.push(4.5 + h1(w * 13 + 1) * 1.1); JIT.push(h1(w * 7 + 3) * 0.55); }
  // when each walker sets off in cycle n: on the green man (front rows first), but never so soon that it reaches its next
  // slot before the one standing there has stepped off it (two people on one spot). Worked out for the whole cycle at
  // once in a fixed order, so every frame gets the same answer
  const LEAVE = new Map();
  const leaveTimes = (n) => {
    let L = LEAVE.get(n); if (L) return L;
    L = new Array(NW).fill(null); L.swap = new Uint8Array(NW); const busy = new Uint8Array(NW), p0 = perm(n), p1 = perm(n + 1);
    // two who trade places set off together and pass each other side by side (each keeps right)
    for (let w = 0; w < NW; w++) { const w2 = p0.inv[p1[w]]; if (w2 !== w && p0.inv[p1[w2]] === w) { L[w] = PED0 + 0.15 + 0.12 * Math.max(slotOf(n, w).front, slotOf(n, w2).front) + Math.max(JIT[w], JIT[w2]); L.swap[w] = 1; } }
    const get = (w) => {
      if (L[w] != null) return L[w];
      const A = slotOf(n, w), B = slotOf(n + 1, w), base = PED0 + 0.15 + 0.12 * A.front + JIT[w], w2 = perm(n).inv[perm(n + 1)[w]];
      if (w2 === w || busy[w]) return base;                       // staying put, or a ring of people waiting on each other
      busy[w] = 1; const v = Math.max(base, get(w2) + 0.6 - pathOf(A, B).len / SPD[w]); busy[w] = 0;
      return (L[w] = v);
    };
    for (let w = 0; w < NW; w++) get(w);
    if (LEAVE.size > 64) LEAVE.clear(); LEAVE.set(n, L); return L;
  };
  const LOOKS = [];
  for (let i = 0; i < 24; i++) LOOKS.push(i % 6 === 1 ? TK.salary(600 + i) : i === 9 || i === 20 ? TK.kimono(600 + i) : TK.who(600 + i, i % 5 === 3 ? { phone: true } : {}));
  // while they wait for the green man: thumbs on phones, a call, a look round, nothing much
  const WAIT = ['scroll', 'look', 'rest', 'phone', 'scroll', 'look', 'rest'];
  const waitAt = (S, d, w, n, tc, phone) => {
    const a = phone ? (Math.floor(tc / 4 + w) % 3 ? 'scroll' : 'phone') : WAIT[(w * 5 + n * 3 + Math.floor((tc + w) / 4.5)) % WAIT.length], A = TK.ACTS[a], i = Math.floor(tc * A.rate) % A.n;
    return { x: S.x, y: S.y, key: 's' + d + a + i, dir: d, act: a, i };
  };
  for (let w = 0; w < NW; w++) {
    const look = LOOKS[w % 24], spd = SPD[w];
    T.actor({ sample: 0.5, period: 2 * CYC,
      at(t) {
        const { n, tc } = cyc(t), A = slotOf(n, w), B = slotOf(n + 1, w), LT = leaveTimes(n), P = pathOf(A, B, LT.swap[w]);
        const t0 = LT[w], t1 = t0 + P.len / spd;
        if (tc < t0) { const d = A.ci === B.ci ? dirOf(-A.x, -A.y) : dirOf(B.x - A.x, B.y - A.y); return waitAt(A, d, w, n, tc, look.phone); }
        if (tc >= t1) { const C = slotOf(n + 2, w), d = C.ci === B.ci ? dirOf(-B.x, -B.y) : dirOf(C.x - B.x, C.y - B.y); return waitAt(B, d, w, n + 1, tc, look.phone); }
        const u = (tc - t0) * spd, q = along(P, u), d = dirOf(q.dx, q.dy), ph = Math.floor((u / 2.4) % 1 * 8);
        return { x: q.x, y: q.y, key: 'w' + d + '.' + ph, dir: d, pose: 'walk', ph: ph / 8 };
      },
      draw(g, st) {
        if (st.act) TK.doing(g, Object.assign({}, look, { dir: st.dir, phone: false }), st.act, st.i);
        else TK.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: 'walk', ph: st.ph || 0, phone: false }));
      } });
  }

  /* ---- Hachikō square ---- */
  // the officer outside the kōban keeps an eye on the crossing, points the way, answers a question
  TK.idle(T, TK.who(901, { dir: 0, top: '#2F3A4F', bot: '#2F3A4F', cap: '#2F3A4F', hairStyle: 'short', glasses: false, dress: undefined, bare: false, shorts: false }), -19.8, 13.4, { acts: ['look', 'rest', 'point', 'look', 'talk', 'rest'], seed: 901 });
  // a photo with Hachikō: one stands beside him, a friend takes the picture; the queue for the next turn chats and waits
  TK.photo(T, { who: TK.who(902, { dir: 3 }), x: -12.4, y: 24.2 }, [{ who: TK.who(903, { dir: 0 }), x: -19.2, y: 20.4 }, { who: TK.kimono(904, { dir: 1 }), x: -14.4, y: 17.9 }], { seed: 3 });
  TK.group(T, [{ who: TK.who(905, { dir: 3 }), x: -11.8, y: 27.2 }, { who: TK.who(906, { dir: 1 }), x: -11.6, y: 29.2 }, { who: TK.who(907, { dir: 2 }), x: -10.2, y: 28.4 }], { seed: 5 });
  TK.idle(T, TK.who(908, { dir: 3 }), -11.2, 31.4, { acts: ['scroll', 'look', 'scroll', 'photo'], seed: 908 });
  // friends meeting at the dog: two waiting, the third arriving waves
  TK.group(T, [{ who: TK.who(911, { dir: 0 }), x: -24.2, y: 18.6 }, { who: TK.who(912, { dir: 1 }), x: -22.8, y: 17.0 }], { seed: 11, laughs: 0.6 });
  TK.idle(T, TK.who(913, { dir: 3 }), -21.8, 21.8, { acts: ['wave', 'wave', 'laugh', 'talk'], seed: 913 });
  TK.idle(T, TK.who(914, { dir: 0, sit: true }), -16.5, 34.6, { z: 1.4, acts: ['scroll', 'drink', 'look', 'rest'], seed: 914 });
  TK.pigeons(T, -15.6, 26.4, 5, { seed: 7 });
  // by 109: a pair meeting; on the near corner tourists film the scramble
  TK.group(T, [{ who: TK.who(921, { dir: 0 }), x: 33.6, y: -18.0 }, { who: TK.who(922, { dir: 2 }), x: 35.4, y: -16.8 }], { seed: 21 });
  TK.group(T, [{ who: TK.who(925, { dir: 1, sit: true }), x: 29.8, y: 20.4, z: 1.4 }, { who: TK.who(926, { dir: 1, sit: true }), x: 31.4, y: 20.4, z: 1.4, idle: 'drink' }], { seed: 25 });
  TK.group(T, [{ who: TK.who(927, { dir: 0 }), x: 22.4, y: 25.6 }, { who: TK.pupil(928, { dir: 2, k: 0.74, cap: '#E6C24F' }), x: 24.0, y: 25.0 }], { seed: 27, laughs: 0.6 });
  TK.idle(T, TK.who(923, { dir: 3 }), 15.8, 15.4, { acts: ['photo', 'photo', 'point', 'photo', 'look'], seed: 923 });
  TK.idle(T, TK.who(924, { dir: 2, cap: '#E6C24F' }), 15.0, 17.2, { acts: ['photo', 'look', 'photo', 'laugh'], seed: 924, lookTo: 3 });

  // a busker on the 109 forecourt: he strums and sings, his audience claps along at the end of each song and he bows.
  // He stands clear of the 109's drum and of the tree; he and each of his audience are actors of their own on one clock
  {
    const BX = 24.4, BY = -15.8, bus = TK.who(931, { dir: 1, top: '#5A6B5A', hairStyle: 'short', cap: '#3B3F47' });
    const AUD = [[22.0, -13.2], [23.4, -12.1], [25.2, -11.8], [26.8, -12.8]].map(([x, y], i) => ({ x, y, w: TK.who(932 + i, { dir: 3 }) }));
    const SONG = 12, PER = 17;
    const at0 = (t) => { const u = ((t % PER) + PER) % PER, song = u < SONG; return { song, bow: !song && u > SONG + 2.5, i: song ? Math.floor(u * 4) % 4 : Math.floor(u * 6) % 2, v: song ? Math.floor(u / 2.5) % 3 : 0 }; };
    T.actor({ sample: 0.25, period: PER,
      at(t) { const S = at0(t); return { x: BX, y: BY, key: S.song ? 's' + (S.i % 2) : S.bow ? 'b' : 'a', song: S.song, bow: S.bow, i: S.i }; },
      draw(g, st) {
        // his guitar case open on the ground in front of him
        const c = g.p(0, 1.6, 0);
        g.fill2([[c[0] - 2.6, c[1] - 0.3], [c[0] + 1.4, c[1] - 1.9], [c[0] + 2.8, c[1] - 0.6], [c[0] - 1.2, c[1] + 1.0]], '#2E2A26');
        g.fill2([[c[0] - 2.1, c[1] - 0.3], [c[0] + 1.3, c[1] - 1.6], [c[0] + 2.3, c[1] - 0.6], [c[0] - 1.0, c[1] + 0.7]], '#B5443A');
        g.disc2([c[0] - 0.2, c[1] - 0.6], 0.35, '#E6C24F'); g.disc2([c[0] + 0.7, c[1] - 0.9], 0.3, '#C9CCCC');
        const strum = st.song ? (st.i % 2 ? 0.7 : -0.5) : 0;
        const r = TK.person(g, 0, 0, 0, Object.assign({}, bus, st.bow ? { lean: 2.6, hands: [[0.6, -9.2], [1.8, -9.4]] } : { hands: [[1.5, -10.4 + strum], [4.3, -13.0]] }));
        if (!st.bow) {
          const hp = r.hip, sg = bus.dir === 0 || bus.dir === 3 ? 1 : -1, bc = [hp[0] + sg * 1.3, hp[1] - 1.0], nk = [hp[0] + sg * 5.6, hp[1] - 4.4];
          g.line2([bc, nk], { w: 0.7, c: '#5A3A24', boil: false });
          const body = []; for (let k = 0; k < 12; k++) { const a = TAU * k / 12; body.push([bc[0] + sg * (Math.cos(a) * 2.0 * Math.cos(0.5) - Math.sin(a) * 1.4 * Math.sin(0.5)), bc[1] + Math.cos(a) * 2.0 * Math.sin(0.5) + Math.sin(a) * 1.4 * Math.cos(0.5)]); }
          g.fill2(body, '#C98A4A', true); g.line2(body, { w: 0.4, c: '#5A3A24', close: true, boil: false }); g.disc2(bc, 0.45, '#3A2A1E');
        }
      } });
    AUD.forEach((m, k) => T.actor({ sample: 0.25, period: PER,
      at(t) {
        const S = at0(t); let a = 'rest', i = 0;
        if (!S.song) { a = 'clap'; i = S.i; }
        else if (k === 1) a = 'photo';
        else if (k === 3 && S.v === 1) { a = 'clap'; i = S.i % 2; }
        else if (k === 0 && S.v === 2) { a = 'look'; i = 1; }
        return { x: m.x, y: m.y, key: a + i, a, i };
      },
      draw(g, st) { TK.doing(g, Object.assign({}, m.w, { lookTo: 3 }), st.a, st.i); } }));
  }
  // a sweeper in an orange vest works slowly along the near pavement and back, broom swinging
  {
    const sw = TK.who(951, { top: '#E08A3C', bot: '#3F4D63', cap: '#3F5F8F', glasses: false, dress: undefined }), xa = 16.5, xb = 30.5, y = 12.4, v = 0.5, L = xb - xa, per = 2 * L / v + 4;
    T.actor({ sample: 0.25, period: per,
      at(t) {
        const u = ((t % per) + per) % per, half = L / v + 2, back = u >= half, s = back ? u - half : u, d = clamp((s - 1) * v, 0, L);
        return { x: back ? xb - d : xa + d, y, key: (back ? 2 : 0) + '.' + (Math.floor(u * 1.6) % 2), dir: back ? 2 : 0, i: Math.floor(u * 1.6) % 2 };
      },
      draw(g, st) {
        const r = TK.doing(g, Object.assign({}, sw, { dir: st.dir }), 'sweep', st.i), sg = st.dir === 0 ? 1 : -1, F = g.p(0, 0, 0);
        const lo = r.hands[0][1] > r.hands[1][1] ? r.hands[0] : r.hands[1], hi = lo === r.hands[0] ? r.hands[1] : r.hands[0];
        const end = [F[0] + sg * (st.i ? 5.2 : 3.6), F[1] - 0.2];
        g.line2([[hi[0] - (lo[0] - hi[0]) * 0.3, hi[1] - (lo[1] - hi[1]) * 0.3], end], { w: 0.5, c: '#8A6A4A', boil: false });
        g.fill2([[end[0] - 1.4, end[1] + 0.3], [end[0] + 1.4, end[1] + 0.3], [end[0] + 1.0, end[1] - 0.9], [end[0] - 1.0, end[1] - 0.9]], '#C9A26B', true);
      } });
  }
  // people along the pavements of the four blocks, to the crossing corners and back
  // (clear of the lamp, the blade sign over the far pavement and the bollards)
  for (const [i, pts, sp] of [[0, [[-36, -9.1], [-15.5, -9.1]], 1.4], [1, [[-9.2, -34.8], [-9.2, -15.5]], 1.3], [2, [[16, -10.6], [34.4, -10.6]], 1.5], [3, [[-36, 8.5], [-28, 8.5], [-16, 8.6]], 1.25], [4, [[9.2, 36], [9.2, 16]], 1.35], [5, [[36, 9.2], [16, 9.2]], 1.45]]) {
    const look = i % 3 === 1 ? TK.salary(970 + i) : TK.who(970 + i, i === 4 ? { phone: false, cap: '#C9584B' } : {});
    K.walker(T, look, pts, sp, { phase: (i * 0.37) % 1 });
  }
});
