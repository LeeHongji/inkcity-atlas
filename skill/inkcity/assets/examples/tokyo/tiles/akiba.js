'use strict';
/* (100,-100) Akihabara, Electric Town, on a Sunday: Chūō-dōri is closed to cars (the pedestrian paradise) and people
   walk down the middle of it. Along its far side a wall of tall narrow buildings stands shoulder to shoulder, every face
   hung with blade signs and boards in strong red, yellow, blue and green: 電気, ゲーム, パソコン, カメラ, テレビ, アニメ,
   中古, メイド, セール, カラオケ, and AUDIO, GAME, PC, TV, COMICS; giant anime posters on the side walls that rise
   above their neighbours. The red game centre is open to the street, crane games inside and two on the pavement. On
   the west edge the Sōbu line crosses the street on a steel girder (AKIHABARA on its side) and stops at the platform
   over the Electric Town exit. On the near side: the station plaza with a tiny idol stage, a rack of capsule-toy
   machines, a kebab van, a gyūdon shop and a drugstore.
   Life: a maid hands out flyers outside her café, cosplayers pose in the middle of the road for a ring of
   photographers, the idol sings and her fans clap and cheer in time, gamers steer the claw and cheer when it wins,
   children turn the capsule machines, shoppers carry their bags, the yellow-banded train comes and goes. */
SF.tile('akiba', 100, -100, { rim: 36 }, function (T) {
  const H = 37, LIT1 = '#E9D3A6', LIT2 = '#E9C48A';
  const Y0 = -32, Y1 = -6.5, ST = [-3, 9];          // the far row's back and front; Chūō-dōri's kerbs
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
    K.slab(g, H, { top: '#E3DFD4' });
    // Chūō-dōri: asphalt, a yellow centre line, white lane lines, a zebra; nothing drives on it today
    g.fill(K.rect(-H, ST[0], H, ST[1]), '#D2CDC0');
    g.scuff(K.rect(-H, ST[0], H, ST[1]), { dir: Math.atan2(AY, AX), len: 7, c: '#C9C3B4', dens: 0.6, w: 0.5, spread: 0.05 });
    for (const y of ST) g.line([[-H, y, 0], [H, y, 0]], { w: 0.6, c: '#A9A296', boil: false });
    g.line([[-H, 3, 0], [-7, 3, 0]], { w: 0.8, c: '#E6C24F', boil: false }); g.line([[-0.5, 3, 0], [H, 3, 0]], { w: 0.8, c: '#E6C24F', boil: false });
    { const s = []; for (const y of [0, 6]) for (let x = -35; x < H - 2; x += 6) { if (x > -9 && x < 0) continue; const a = g.p(x, y, 0), b = g.p(x + 3, y, 0); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#F3F1EA', 0.9); }
    for (let y = ST[0] + 0.7; y < ST[1] - 0.4; y += 1.6) g.fill(K.rect(-6.6, y - 0.5, -1.2, y + 0.5), '#F6F3EA');
    // the pavements and the station plaza: slabs with their joints, a tactile strip along the kerbs
    g.fill(K.rect(-29, Y1, H, ST[0]), '#E9E4D8'); g.fill(K.rect(-29, ST[1], H, H), '#E8E2D4');
    { const s = []; for (let x = -28; x < H; x += 2.2) { const a = g.p(x, Y1, 0), b = g.p(x, ST[0], 0), c = g.p(x, ST[1], 0), d = g.p(x, 12.5, 0); s.push(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]); }
      for (let x = -28; x < H; x += 3) { const a = g.p(x, 12.5, 0), b = g.p(x, H, 0); s.push(a[0], a[1], b[0], b[1]); } for (let y = 15.5; y < H; y += 3) { const a = g.p(-29, y, 0), b = g.p(H, y, 0); s.push(a[0], a[1], b[0], b[1]); }
      g.segs2(s, '#D8D0BE', 0.3); }
    g.fill(K.rect(-29, ST[0] - 0.85, H, ST[0] - 0.3), '#E6C24F'); g.fill(K.rect(-29, ST[1] + 0.3, H, ST[1] + 0.85), '#E6C24F');
    g.line([[-29, 12.5, 0], [H, 12.5, 0]], { w: 0.4, c: '#C9C0AC', boil: false });
  }, { rim: true });

  /* ---------------- the Sōbu line: viaduct, girder over the street, the platform over the Electric Town exit ---------------- */
  const VX0 = -37, VX1 = -29, DZ = 8.4, DT = 9.4, TX = -34.2;        // viaduct sides, deck underside and top, the track
  T.obj([VX0, -H, VX1, H], function (g) {
    const CON = { t: '#D9D6CC', l: '#E6E3D9', r: '#CFCBBF' }, STEEL = { t: '#7E9AA6', l: '#6F8C99', r: '#5E7A87' };
    // west of the street: a wall with arches (stalls under the tracks), a pier each side of the span
    K.box(g, VX0, -H, VX1, -4.6, 0, DZ, CON, { w: 0.9, faces: 'lr' });
    { const f = FC('R', VX1, -H, -4.6); for (let y = -35; y < -6; y += 6.4) { const u0 = (-4.6 - (y + 5)) / 32.4, u1 = (-4.6 - y) / 32.4, pts = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * i / 8; pts.push(f(lerp(u0, u1, 0.5 + 0.5 * Math.cos(a)), 4.6 + Math.sin(a) * 2.2, 0.02)); } pts.push(f(u0, 0, 0.02)); pts.unshift(f(u1, 0, 0.02)); g.fill(pts, '#3A3F47'); g.fill(quad(f, u0 + 0.02, u1 - 0.02, 0.2, 3.6, 0.03), LIT1); } }
    K.box(g, VX0 + 0.6, -4.6, VX1 - 0.4, -3.4, 0, DZ, CON, { w: 0.8 });
    // the plate girder: two deep steel beams with stiffeners, and the station's name on its side
    K.box(g, VX0 + 0.3, -3.4, VX1, 9.6, 6.2, DZ, STEEL, { w: 0.9 });
    { const f = FC('R', VX1, -3.4, 9.6), s = []; for (let i = 1; i < 12; i++) { const a = g.p.apply(g, f(i / 12, 6.2, 0.03)), b = g.p.apply(g, f(i / 12, DZ, 0.03)); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#4E6874', 0.35);
      const P2 = (a, z) => f(a / f.len, z, 0.08), h = 1.15; K.textP(g, P2, f.len / 2, 6.7, h, 'AKIHABARA', '#F6F3EA', { center: true, w: 0.8 }); }
    K.box(g, VX0 + 0.6, 9.6, VX1 - 0.4, 11, 0, DZ, CON, { w: 0.8 });
    // the station under the platform: the Electric Town exit, glass and ticket gates, its name above
    K.box(g, VX0, 11, VX1, H, 0, DZ, CON, { w: 0.95, faces: 'lr' });
    const fS = FC('R', VX1, 11, H), uy = (y) => (H - y) / (H - 11);
    shop(g, fS, uy(33.5), uy(15), 0.2, 4.8, { bay: 2.0 });
    { const s = []; for (let y = 31.8; y > 16.5; y -= 1.7) { const a = g.p.apply(g, fS(uy(y), 0.2, 0.06)), b = g.p.apply(g, fS(uy(y), 1.9, 0.06)); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#4A545F', 1.5); }
    TK.awning(g, 'R', VX1, 14.6, 34, 5.6, 2.2, '#DCD8CC', { drop: 0.4 });
    board(g, fS, uy(31), uy(17.5), 6.0, 7.9, '#2F3A5A', { en: 'ELECTRIC TOWN', ink: '#F6F3EA' });
    board(g, fS, uy(16.8), uy(14.6), 6.0, 7.9, '#3F9A5A', { en: 'JR', ink: '#FBFAF6' });
    panes(g, fS, uy(36.6), uy(34.4), 1.0, 7.6, { fh: 3.3, n: 1 });
    // the deck over everything; on it the ballast and rails, a low wall on the far side, the platform, catenary masts
    K.box(g, VX0, -H, VX1, H, DZ, DT, { t: '#BDB8AC', l: '#D9D6CC', r: '#C4C0B4' }, { w: 0.9 });
    g.fill(K.rect(TX - 1.9, -H, TX + 1.9, H, DT + 0.02), '#A69F92');
    { const s = []; for (const dx of [-0.75, 0.75]) { const a = g.p(TX + dx, -H, DT + 0.1), b = g.p(TX + dx, H, DT + 0.1); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#5A564E', 0.45);
      const sl = []; for (let y = -H + 0.6; y < H; y += 1.2) { const a = g.p(TX - 1.3, y, DT + 0.05), b = g.p(TX + 1.3, y, DT + 0.05); sl.push(a[0], a[1], b[0], b[1]); } g.segs2(sl, '#8A8274', 0.3); }
    K.box(g, VX0, -H, VX0 + 0.5, H, DT, DT + 1.1, CON, { w: 0.6, nb: true });
    K.box(g, -32.0, 12.4, VX1, H, DT, DT + 1.0, { t: '#E3E0D6', l: '#ECE9E1', r: '#D3CFC4' }, { w: 0.7 });
    g.fill(K.rect(-31.9, 12.5, -31.3, H, DT + 1.02), '#E6C24F');
    const ms = []; for (let y = -34; y < H; y += 11.5) { const a = g.p(VX0 + 0.3, y, DT + 1.1), b = g.p(VX0 + 0.3, y, DT + 8.4), c = g.p(TX + 0.4, y, DT + 7.6); ms.push(a[0], a[1], b[0], b[1], b[0], b[1] + 0.6, c[0], c[1]); } g.segs2(ms, '#5A564E', 0.55);
    g.fine([[TX, -H, DT + 6.6], [TX, H, DT + 6.6]], { w: 0.3, c: '#4A4540' });
  }, { name: 'sobu viaduct', under: DT });
  // the platform canopy and the station's name board, in front of the trains
  T.obj([-32.4, 12.8, VX1, H], function (g) {
    const Z = DT + 6.2, s = [];
    for (let y = 15; y < H; y += 5.5) { const a = g.p(-30.2, y, DT + 1), b = g.p(-30.2, y, Z); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#6E747A', 0.6);
    K.box(g, -33.2, 12.8, VX1 + 0.2, H, Z, Z + 0.6, { t: '#DDE2E3', l: '#ECEFEF', r: '#C9D0D2' }, { w: 0.8 });
    const f = FC('R', -30.2, 21.6, 28.8); g.fill(quad(f, 0, 1, DT + 3.0, DT + 5.0, 0.04), '#FBFAF6'); g.mark({ nc: true });
    g.fill(quad(f, 0, 1, DT + 3.0, DT + 3.4, 0.05), '#E6C24F'); g.outline(quad(f, 0, 1, DT + 3.0, DT + 5.0, 0.04), { w: 0.5, boil: false });
    const P2 = (a, z) => f(a / f.len, z, 0.09); K.textP(g, P2, f.len / 2, DT + 3.7, 0.85, 'AKIHABARA', '#2E2A26', { center: true, w: 0.55 });
    { const c = g.p.apply(g, f(0.5, DT + 4, 0.05)); g.glow2('neon', c, c, { r: 8, col: '#F6F3EA' }); }
    const hg = []; for (const u of [0.15, 0.85]) { const a = g.p.apply(g, f(u, DT + 5, 0.04)), b = g.p.apply(g, f(u, Z, 0.04)); hg.push(a[0], a[1], b[0], b[1]); } g.segs2(hg, '#5A564E', 0.35);
  }, { name: 'platform canopy' });

  /* ---------------- the far side: the tall row ---------------- */
  // each building: a body, a shop floor open to the street under an awning, then its own signs (draw)
  const ROW = [
    { x0: -28.5, x1: -20, h: 30, body: '#EEF0EF', awn: '#2F3A5A', seed: 1, draw(g, fL) {
      board(g, fL, 0.04, 0.7, 5.0, 7.0, '#2F3A5A', { en: 'AUDIO', ink: '#F6F3EA' });
      panes(g, fL, 0.05, 0.6, 7.6, 14.4, { fh: 3.4, bay: 2.2 });
      board(g, fL, 0.05, 0.6, 15.0, 19.2, '#3F9A5A', { jp: '中古', ink: '#F6F3EA' });
      panes(g, fL, 0.05, 0.6, 20.0, 29.4, { fh: 3.1, bay: 2.2 });
      bladeL(g, -21.1, Y1, 2.6, 8.6, 22.5, '#D8322E', { jp: '電気', ink: '#FBF8EE' });
      board(g, fL, 0.08, 0.92, 24.2, 27.6, '#E6C24F', { en: 'PARTS' });
    } },
    { x0: -20, x1: -11, h: 36, body: '#D8322E', open: true, seed: 2, draw(g, fL, fR) {
      board(g, fL, 0.04, 0.96, 5.2, 7.6, '#E6C24F', { en: 'GAME', ink: '#C9261E' });
      board(g, fL, 0.08, 0.36, 9.0, 31.0, '#FBF8EE', { en: 'GAME', ink: '#D8322E', vert: true });
      panes(g, fL, 0.42, 0.78, 9.2, 31, { fh: 3.6, n: 2 });
      pic(g, fR, 0.01, 0.3, 28.4, 35.6, 'girl', { bg: '#FBE38A', hair: '#E85A8A', eye: '#3A5FC0', top: '#3A5FC0', tie: '#E6C24F' });
      bladeL(g, -12.0, Y1, 2.8, 9.0, 27.0, '#E6C24F', { jp: 'ゲーム', ink: '#C9261E' });
    } },
    { x0: -11, x1: -3.5, h: 28, body: '#F4F2EC', awn: '#3F9A5A', seed: 3, draw(g, fL) {
      board(g, fL, 0.05, 0.95, 5.0, 6.8, '#3F9A5A', { jp: '中古', ink: '#F6F3EA' });
      panes(g, fL, 0.05, 0.7, 7.4, 17.6, { fh: 3.4, bay: 2.1 });
      bladeL(g, -4.6, Y1, 2.6, 7.4, 18.4, '#E6C24F', { jp: 'パソコン', ink: '#2E2A26' });
      board(g, fL, 0.06, 0.94, 18.6, 26.4, '#2F3A5A', { en: 'PC', ink: '#F6F3EA', k: 0.9 });
    } },
    { x0: -3.5, x1: 6, h: 42, body: '#ECEFF1', awn: '#E58AB0', seed: 4, draw(g, fL, fR) {
      board(g, fL, 0.04, 0.96, 5.0, 8.4, '#E58AB0', { jp: 'アニメ', ink: '#FBF8EE' });
      board(g, fL, 0.04, 0.96, 9.0, 12.4, '#3F9A5A', { jp: 'ホビー', ink: '#FBF8EE' });
      pic(g, fL, 0.04, 0.8, 13.2, 24.6, 'idol', { bg: '#4A3A8A', dress: '#7FD0E8', hair: '#E8C04A', en: 'LIVE', band: '#D8322E' });
      panes(g, fL, 0.04, 0.8, 25.6, 41.4, { fh: 3.2, bay: 2.2 });
      pic(g, fR, 0.04, 0.96, 26.8, 41.2, 'girl', { bg: '#BFE3F2', hair: '#E85A8A', eye: '#7A3FB0', top: '#F6F3EA', tie: '#3A5FC0', en: 'ANIME', band: '#2F3A5A' });
      bladeL(g, 5.0, Y1, 2.6, 13.4, 39.5, '#D8322E', { en: 'AKIHABARA', ink: '#FBF8EE', vert: true });
    } },
    { x0: 6, x1: 13, h: 26, body: '#DCE5EC', awn: '#3F7FC0', seed: 5, draw(g, fL) {
      board(g, fL, 0.05, 0.95, 5.0, 6.8, '#E6C24F', { jp: 'カメラ', ink: '#C9261E' });
      board(g, fL, 0.05, 0.95, 7.6, 11.4, '#3F7FC0', { jp: 'テレビ', ink: '#FBF8EE' });
      panes(g, fL, 0.05, 0.6, 12.2, 18.8, { fh: 3.3, bay: 2.0 });
      bladeL(g, 12.0, Y1, 2.4, 11.8, 23.0, '#2E2A26', { en: 'CAMERA', ink: '#FBF8EE', vert: true });
      board(g, fL, 0.05, 0.95, 19.6, 25.2, '#D8322E', { en: 'TV', ink: '#FBF8EE', k: 0.85 });
    } },
    { x0: 13, x1: 21, h: 34, body: '#F8E3E8', awn: '#E58AB0', seed: 6, draw(g, fL, fR) {
      board(g, fL, 0.04, 0.96, 5.0, 7.0, '#E58AB0', { en: 'MAID CAFE', ink: '#FBF8EE' });
      panes(g, fL, 0.05, 0.62, 7.8, 19.2, { fh: 3.2, bay: 2.0, col: '#F7D9E2' });
      bladeL(g, 20.0, Y1, 2.6, 7.6, 21.0, '#FBF8EE', { jp: 'メイド', ink: '#D2457A', c: '#D2457A' });
      board(g, fL, 0.05, 0.95, 21.6, 25.6, '#8A5A3A', { jp: '喫茶', ink: '#FBF0D8' });
      panes(g, fL, 0.05, 0.95, 26.2, 33.4, { fh: 3.2, bay: 2.0 });
      pic(g, fR, 0.04, 0.96, 28.4, 33.6, 'drink', { bg: '#7FD0A8', can: '#3F7FC0', en: 'SODA', band: '#2E2A26' });
    } },
    { x0: 21, x1: 28.5, h: 28, body: '#FBF1C9', awn: '#D8322E', seed: 7, draw(g, fL) {
      board(g, fL, 0.04, 0.96, 5.0, 9.6, '#D8322E', { jp: 'セール', ink: '#FBE38A' });
      panes(g, fL, 0.05, 0.64, 10.4, 17.4, { fh: 3.4, bay: 2.0 });
      board(g, fL, 0.04, 0.66, 18.2, 22.6, '#2E2A26', { en: 'DUTY FREE', ink: '#FBE38A' });
      panes(g, fL, 0.05, 0.64, 23.2, 27.6, { fh: 3.4, bay: 2.0 });
      bladeL(g, 27.5, Y1, 2.6, 10.4, 25.4, '#8E79C0', { jp: 'カラオケ', ink: '#FBF8EE' });
    } },
    { x0: 28.5, x1: 37, h: 38, body: '#E8EEF2', awn: '#2F3A5A', seed: 8, draw(g, fL, fR) {
      board(g, fL, 0.04, 0.96, 5.0, 7.0, '#2F3A5A', { en: 'COMICS', ink: '#FBE38A' });
      board(g, fL, 0.05, 0.55, 8.0, 12.6, '#FBF8EE', { jp: '本', ink: '#2F3A5A' });
      panes(g, fL, 0.05, 0.7, 13.6, 37.2, { fh: 3.2, bay: 2.0 });
      bladeL(g, 35.8, Y1, 2.6, 8.0, 26.0, '#3F9A5A', { en: 'CARD', ink: '#FBF8EE', vert: true });
      shop(g, fR, 0.02, 0.98, 0.3, 4.4, { goods: 88 });
      pic(g, fR, 0.03, 0.97, 5.6, 23.6, 'girl', { bg: '#F7C7D3', hair: '#3A4FA0', eye: '#C9463E', top: '#F6F3EA', tie: '#C9463E', en: 'ANIME', band: '#D8322E' });
      board(g, fR, 0.04, 0.96, 24.6, 28.4, '#E6C24F', { en: 'AKIHABARA', ink: '#2E2A26' });
      panes(g, fR, 0.04, 0.96, 29.2, 37.4, { fh: 2.8, bay: 2.4 });
      board(g, fL, 0.05, 0.95, 38.6, 42.4, '#D8322E', { en: 'LIVE', ink: '#FBF8EE' });
      const posts = []; for (const x of [30, 35.5]) { const a = g.p(x, Y1 - 0.08, 38), b = g.p(x, Y1 - 0.08, 38.6); posts.push(a[0], a[1], b[0], b[1]); } g.segs2(posts, '#5A564E', 0.5);
    } },
  ];
  // a crane game: a coloured cabinet, a glass case heaped with plush prizes, a lit name box; its claw is an actor's
  const crane = (g, x, y, col) => {
    const x0 = x - 1.15, x1 = x + 1.15, y0 = y - 1.05, y1 = y + 1.05, R = RNG(Math.round(x * 7 + y * 13) + 99);
    K.box(g, x0, y0, x1, y1, 0, 2.1, { t: shade(col, -0.1), l: col, r: shade(col, 0.15) }, { w: 0.5, boil: false });
    g.fill(K.on('L', y1 + 0.02, x0 + 0.3, x1 - 0.3, 0.9, 1.7), '#2E2A26'); g.disc2(g.p(x0 + 0.7, y1 + 0.04, 1.85), 0.45, '#E6C24F');
    for (let i = 0; i < 10; i++) { const c = g.p(x0 + 0.35 + R() * 1.6, y0 + 0.3 + R() * 1.5, 2.25 + R() * 0.45); g.disc2(c, 0.95, R.pick(['#F2B6C2', '#F3E3A0', '#A9D1E6', '#C9E3A8', '#F6F3EA', '#E9A06A'])); }
    const gc = 'rgba(214,236,246,0.42)'; g.fill(K.on('L', y1, x0, x1, 2.1, 4.9), gc); g.fill(K.on('R', x1, y0, y1, 2.1, 4.9), gc); g.mark({ nc: 'rgba(255,240,220,0.5)' }, g.cmds.length - 2);
    g.fine([[x0, y1, 2.1], [x0, y1, 4.9], [x1, y1, 4.9], [x1, y0, 4.9]], { w: 0.4, c: '#6E747A' }); g.fine([[x1, y1, 2.1], [x1, y1, 4.9]], { w: 0.35, c: '#8C9298' });
    const i0 = g.cmds.length; K.box(g, x0, y0, x1, y1, 4.9, 5.8, { t: shade(col, -0.25), l: shade(col, -0.3), r: shade(col, -0.15) }, { w: 0.45, boil: false }); g.mark({ nc: true }, i0);
  };
  const CRANES = [[-18.4, -5.3, '#E58AB0'], [-15.4, -5.3, '#3FB0C9'], [-18.6, -8.6, '#E6C24F'], [-15.9, -8.6, '#7FC07A'], [-13.2, -8.6, '#E58AB0']];
  ROW.forEach((b, i) => T.obj([b.x0, Y0, b.x1, b.open ? Y1 : Y1 + 1.5], function (g) {   // (the footprint takes in the awning)
    g.boilP = 0.3;
    const c = b.body;
    K.box(g, b.x0, Y0, b.x1, Y1, 0, b.h, { t: mix(c, '#E2E0D9', 0.8), l: c, r: shade(c, 0.12) }, { w: 0.95 });
    const fL = FC('L', Y1, b.x0, b.x1), fR = FC('R', b.x1, Y0, Y1);
    if (b.open) {                       // the game centre: open to the street, crane games inside under bright light
      g.fill(quad(fL, 0.02, 0.98, 0, 4.6, 0.02), '#F7E6EC'); g.mark({ nc: '#FFE9F0' });
      for (const [x, y, col] of CRANES.slice(2)) crane(g, x, y, col);
      g.fill(quad(fL, 0.02, 0.98, 4.6, 4.9, 0.03), shade(c, 0.2));
    } else {
      shop(g, fL, 0.03, 0.97, 0.3, 4.2, { goods: b.seed * 13, col: i % 2 ? LIT1 : LIT2 });
      TK.awning(g, 'L', Y1, b.x0 + 0.3, b.x1 - 0.3, 4.6, 1.5, b.awn, { drop: 0.6, stripe: i === 6 ? '#FBE38A' : undefined });
    }
    b.draw(g, fL, fR);
    roofKit(g, b.x0, Y0, b.x1, Y1, b.h, 300 + i, { ac: 2, tank: i % 3 === 1 ? [b.x0 + 2.4, Y0 + 3] : null, ant: i === 3 ? [b.x0 + 2, Y0 + 6] : null });
  }, { name: 'akiba row ' + i }));
  // two crane games out on the pavement in front of the game centre
  T.obj([-19.6, -6.4, -14.2, -4.2], (g) => { for (const [x, y, col] of CRANES.slice(0, 2)) crane(g, x, y, col); }, { name: 'cranes' });
  // standing signboards out on the pavement, and recycling bins by the station's vending machines
  for (const [x, col, o] of [[-25.2, '#2F3A5A', { en: 'OPEN', ink: '#FBE38A' }], [-7.6, '#FBF8EE', { jp: '中古', ink: '#3F9A5A' }], [8.0, '#E6C24F', { en: 'SALE', ink: '#D8322E' }], [18.6, '#F7A6C6', { jp: 'メイド', ink: '#FBF8EE' }], [31.6, '#FBF8EE', { en: 'CARD', ink: '#2F3A5A' }]]) T.obj([x - 0.8, -5.4, x + 0.8, -5.2], (g) => {
    const legs = []; for (const dx of [-0.6, 0.6]) { const a = g.p(x + dx, -5.3, 0), b = g.p(x + dx, -5.3, 1.0); legs.push(a[0], a[1], b[0], b[1]); } g.segs2(legs, '#5A564E', 0.4);
    board(g, PL([x - 0.75, -5.3], [x + 0.75, -5.3]), 0, 1, 0.9, 3.0, col, Object.assign({ w: 0.35, glow: false }, o));
  }, { name: 'standing sign', on: true });
  // nobori banners on the pavement edge outside the sale and the karaoke (at the kerb, clear of the people on the pavement)
  for (const [x, w, col] of [[24.2, 'セール', '#D8322E'], [26.4, 'カラオケ', '#8E79C0'], [9.6, 'カメラ', '#E6C24F']]) T.obj([x, -3.45, x + 1.7, -3.35], (g) => {
    const a = g.p(x, -3.4, 0), b2 = g.p(x, -3.4, 7.6); g.line2([a, b2], { w: 0.5, c: '#6E747A', boil: false });
    board(g, PL([x + 0.05, -3.4], [x + 1.7, -3.4]), 0, 1, 2.4, 7.2, col, { jp: w, ink: col === '#E6C24F' ? '#C9261E' : '#FBF8EE', w: 0.35 });
  }, { on: true });

  /* ---------------- the near side ---------------- */
  // the idol stage on the station plaza: a skirted platform, a backdrop with LIVE in lights, speakers, a lighting bar.
  // Two objects: the platform and backdrop behind the idol, the speakers and the lighting rig at the front edge in front
  // of her
  T.obj([-25.5, 19.6, -19.7, 27.4], function (g) {
    K.box(g, -25.2, 20, -18.4, 27, 0, 1.1, { t: '#7A6A8A', l: '#D2457A', r: '#B23A68' }, { w: 0.75 });
    { const s = []; for (let x = -24.8; x < -18.4; x += 0.7) { const a = g.p(x, 27.02, 0.05), b = g.p(x, 27.02, 1.05); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#9A2F58', 0.3); }
    const fB = FC('R', -25.0, 20.3, 26.7); g.fill(quad(fB, 0, 1, 1.1, 6.6, 0.02), '#2E2A4A'); g.outline(quad(fB, 0, 1, 1.1, 6.6, 0.02), { w: 0.6, boil: false });
    board(g, fB, 0.12, 0.88, 4.2, 6.0, '#F7E07A', { en: 'LIVE', ink: '#D2457A' });
    { const R = RNG(41); for (let i = 0; i < 10; i++) { const c = g.p.apply(g, fB(0.08 + R() * 0.84, 1.6 + R() * 2.4, 0.05)); g.disc2(c, 0.45, R.pick(['#F7E07A', '#F2A0C0', '#9FE0F0'])); g.mark({ nc: true }); } }
  }, { name: 'idol stage' });
  T.obj([-19.7, 19.6, -18.0, 27.4], function (g) {
    for (const y of [20.4, 26.0]) K.box(g, -19.6, y, -18.5, y + 1.0, 1.1, 3.4, { t: '#3A3530', l: '#2E2A26', r: '#24211E' }, { w: 0.45, boil: false });
    const posts = []; for (const y of [20.2, 26.8]) { const a = g.p(-18.6, y, 1.1), b = g.p(-18.6, y, 7.6); posts.push(a[0], a[1], b[0], b[1]); } g.segs2(posts, '#5A564E', 0.5);
    g.line([[-18.6, 20.2, 7.6], [-18.6, 26.8, 7.6]], { w: 0.6, c: '#5A564E', boil: false });
    for (let k = 0; k < 4; k++) { const c = g.p(-18.6, 21.2 + k * 1.6, 7.2); g.disc2(c, 0.55, ['#F2A0C0', '#9FE0F0', '#F7E07A', '#F2A0C0'][k]); g.mark({ nc: true, light: true }); g.glow2('neon', c, c, { r: 3, col: ['#FF8FC0', '#8FE8FF', '#FFE68A', '#FF8FC0'][k] }); }
  }, { name: 'idol stage rig' });
  // capsule-toy machines in two tiers along the near pavement
  T.obj([-4.2, 12.6, 9.6, 14.4], function (g) {
    const R = RNG(12), cols = ['#D8322E', '#3F7FC0', '#E6C24F', '#3F9A5A', '#E58AB0', '#E08A3C', '#8E79C0'];
    K.box(g, -4.2, 12.6, 9.6, 14.4, 0, 0.5, { t: '#BDB9AF', l: '#CFCBC1', r: '#B5B1A7' }, { w: 0.5 });
    for (let r = 0; r < 2; r++) for (let k = 0; k < 7; k++) {
      const x = -4.0 + k * 1.95, z = 0.5 + r * 2.6, c = cols[(k + r * 3) % cols.length];
      K.box(g, x, 12.8, x + 1.8, 14.3, z, z + 2.5, { t: shade(c, -0.1), l: shade(c, -0.25), r: c }, { w: 0.4, boil: false });
      const d = g.p(x + 0.9, 14.32, z + 1.7); g.disc2(d, 1.6, '#EEF6F8'); for (let j = 0; j < 4; j++) g.disc2([d[0] + (R() - 0.5) * 1.8, d[1] + (R() - 0.5) * 1.3], 0.55, R.pick(['#E9806A', '#F3E3A0', '#8FB7D9', '#C9E3A8', '#F2B6C2'])); g.ring2(d, 1.6, { w: 0.3, c: '#8C8576' });
      g.disc2(g.p(x + 0.9, 14.32, z + 0.45), 0.42, '#3A3530'); g.disc2(g.p(x + 1.4, 14.32, z + 0.6), 0.25, '#F6F3EA');
    }
    const i0 = g.cmds.length; for (let r = 0; r < 2; r++) for (let k = 0; k < 7; k++) g.fill(K.on('L', 14.32, -4.0 + k * 1.95, -4.0 + k * 1.95 + 1.8, 0.5 + r * 2.6 + 2.1, 0.5 + r * 2.6 + 2.45), '#FBF8EE'); g.mark({ nc: true }, i0);
  }, { name: 'gacha' });
  // the kebab van with its hatch open to the plaza
  T.obj([0.4, 19.6, 8.2, 24.6], function (g) {   // (the footprint takes in the hatch's awning)
    g.at(4.3, 21.5, 0, (g2) => K.bus(g2, 0, { col: '#F3F1EA', band: '#E08A3C', L: 3.8, W: 1.85, h: 5.0, n: 2 }));
    const f = FC('L', 23.4, 2.0, 6.6); g.fill(quad(f, 0, 1, 2.6, 4.3, 0.06), LIT2); g.outline(quad(f, 0, 1, 2.6, 4.3, 0.06), { w: 0.5, boil: false });
    TK.awning(g, 'L', 23.36, 1.8, 6.8, 4.9, 1.2, '#D8322E', { stripe: '#FBF8EE', drop: 0.3 });
    board(g, FC('L', 23.4, 2.6, 6.0), 0, 1, 5.3, 6.3, '#2E2A26', { en: 'KEBAB', ink: '#FBE38A' });
  }, { name: 'kebab van' });
  // two low shops on the near corner: a gyūdon counter and a drugstore, their signs on the roof edge
  T.obj([14, 27.5, 37, 37], function (g) {
    for (const [x0, x1, body, sg, word, ink, awn] of [[14, 25, '#F3EFE5', '#E08A3C', '牛丼', '#FBF8EE', '#E08A3C'], [25, 37, '#EEF2F4', '#E6C24F', '薬', '#2F3A5A', '#3F7FC0']]) {
      K.box(g, x0, 27.5, x1, 37, 0, 5.4, { t: shade(body, -0.06), l: body, r: shade(body, 0.12) }, { w: 0.9 });
      const fL = FC('L', 37, x0, x1); shop(g, fL, 0.04, 0.96, 0.3, 3.6, { col: LIT1, goods: x0 });
      TK.awning(g, 'L', 37, x0 + 0.3, x1 - 0.3, 4.0, 1.3, awn, { drop: 0.5 });
      board(g, fL, 0.08, 0.92, 4.4, 5.3, sg, { jp: word, ink });
      roofKit(g, x0, 27.5, x1, 37, 5.4, x0 * 3, { ac: 1 });
    }
    const fR = FC('R', 37, 27.5, 37); shop(g, fR, 0.06, 0.94, 0.3, 3.6, { col: LIT1, goods: 99 }); board(g, fR, 0.1, 0.9, 4.0, 5.3, '#E6C24F', { jp: '薬', ink: '#2F3A5A' });
  }, { name: 'near shops' });
  // the barriers that close the street, a tree each end of the plaza, bicycles, vending machines (one sells canned oden)
  for (const x of [-27.4, 35.2]) T.obj([x - 0.4, -3.4, x + 0.4, 8.4], (g) => {
    for (const y of [-1.6, 2.4, 6.6]) { const s = []; for (const dy of [-1.6, 1.6]) { const a = g.p(x, y + dy, 0), b = g.p(x, y + dy, 2.2); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#6E747A', 0.45);
      const q = [[x, y - 1.8, 1.2], [x, y + 1.8, 1.2], [x, y + 1.8, 2.1], [x, y - 1.8, 2.1]]; g.fill(q, '#E6C24F'); for (let k = 0; k < 4; k++) g.fill([[x, y - 1.8 + k * 0.9, 1.2], [x, y - 1.35 + k * 0.9, 1.2], [x, y - 1.8 + k * 0.9 + 0.9, 2.1], [x, y - 1.8 + k * 0.9 + 0.45, 2.1]], '#2E2A26'); g.outline(q, { w: 0.4, boil: false }); }
    const p = g.p(x, 4.4, 2.2), c = [p[0], p[1] - 3.0]; g.line2([p, c], { w: 0.4, c: '#6E747A', boil: false }); g.disc2(c, 1.6, '#D8322E'); g.fill2([[c[0] - 1.0, c[1] - 0.3], [c[0] + 1.0, c[1] - 0.3], [c[0] + 1.0, c[1] + 0.3], [c[0] - 1.0, c[1] + 0.3]], '#FBF8EE', true); g.ring2(c, 1.6, { w: 0.35, c: '#7A2A22' });
  }, { name: 'barrier' });
  for (const [x, y, i] of [[-9.0, 11.8, 0], [31.0, 11.8, 1]]) T.obj([x, y], (g) => K.tree(g, x, y, TK.leaves({ r: 3.3, h: 4.8 }, 'zelkova', i)), { on: true });
  T.obj([13.4, 11.9, 21.8, 15.3], (g) => {
    for (let k = 0; k < 5; k++) {
      const x = 14 + k * 1.6, c = ['#3F7FC0', '#D8322E', '#F3F1EA', '#3F9A5A', '#2E2A26'][k], P = (v, z) => g.p(x, v, z), ring = (v0) => { const p = []; for (let i = 0; i < 16; i++) { const a = TAU * i / 16; p.push(P(v0 + Math.cos(a) * 0.95, 0.95 + Math.sin(a) * 0.95)); } return p; };
      for (const v0 of [12.9, 14.3]) g.line2(ring(v0), { w: 0.5, c: '#3A3632', close: true, boil: false });
      const A = P(12.9, 0.95), B = P(14.3, 0.95), S = P(13.25, 2.2), Hh = P(14.15, 2.45), M = P(13.6, 1.0);
      g.segs2([A[0], A[1], S[0], S[1], S[0], S[1], M[0], M[1], M[0], M[1], B[0], B[1], M[0], M[1], Hh[0], Hh[1], Hh[0], Hh[1], B[0], B[1], A[0], A[1], M[0], M[1]], c, 0.5);
      g.line2([[S[0] - 0.5, S[1]], [S[0] + 0.4, S[1] - 0.1]], { w: 0.75, c: '#2E2A26', boil: false }); g.line2([[Hh[0] - 0.7, Hh[1] + 0.2], [Hh[0] + 0.7, Hh[1] - 0.2]], { w: 0.5, c: '#2E2A26', boil: false });
    }
  }, { name: 'bicycles' });
  T.obj([-27.6, 13.2, -26, 19.2], (g) => { TK.vend(g, -26.8, 14.4, { face: 'R', col: '#D8322E', top: '#F1EFE8' }); TK.vend(g, -26.8, 16.6, { face: 'R', col: '#F1EFE8', top: '#3F7FC0' }); for (const [y, c] of [[18.1, '#3F7FC0'], [18.9, '#E6C24F']]) { K.box(g, -27.3, y - 0.35, -26.5, y + 0.35, 0, 1.6, { t: shade(c, -0.2), l: c, r: shade(c, 0.15) }, { w: 0.35, boil: false }); g.disc2(g.p(-26.48, y, 1.25), 0.35, '#2E2A26'); } board(g, FC('R', -26.0, 13.3, 15.5), 0.1, 0.9, 4.25, 4.85, '#E6C24F', { jp: 'おでん', ink: '#C9261E', glow: false }); }, { name: 'vending' });
  T.obj([-7.2, 14.4], (g) => K.lamp(g, -7.2, 14.4, { h: 9.5, n: 3 }), { on: true });
  // parts stalls on the plaza, as the radio-parts trade began here: tables of boxes and bits under striped awnings
  for (const [x, y, a, word, seed] of [[19.5, 20.6, '#3F7FC0', 'JUNK', 3], [27.0, 20.6, '#3F9A5A', 'PARTS', 4]]) T.obj([x - 3.3, y - 2.4, x + 3.3, y + 2.95], (g) => {   // (with the awning)
    K.stall(g, x, y, { face: 'L', L: 2.6, D: 1.6, a, b: '#F3F1EA', n: 6, goods: (g2, D, L) => { const R = RNG(seed * 31); for (let i = 0; i < 16; i++) { const c = g2.p(-D + 0.4 + R() * (2 * D - 0.8), -L + 0.4 + R() * (2 * L - 0.8), 2.75); g2.fill2([[c[0] - 0.7, c[1] + 0.3], [c[0] + 0.7, c[1] + 0.3], [c[0] + 0.7, c[1] - 0.6], [c[0] - 0.7, c[1] - 0.6]], R.pick(['#5A6470', '#3A3530', '#C9A26B', '#3F9A5A', '#D8322E', '#E6C24F', '#9AA0A5'])); } } });
    board(g, FC('L', y - 2.3, x - 2.2, x + 2.2), 0, 1, 7.5, 9.0, '#FBF8EE', { en: word, ink: shade(a, 0.3), glow: false });
  }, { name: 'parts stall' });
  T.obj([32.4, 23.6], (g) => K.bench(g, 32.4, 23.6, { face: 'L', L: 2.0 }), { on: true });
  T.obj([-15.8, 34.0], (g) => K.bench(g, -15.8, 34.0, { face: 'R', L: 2.0 }), { on: true });
  for (const [x, y, i] of [[-20.5, 33.0, 0], [35.0, 17.0, 1]]) T.obj([x, y], (g) => K.tree(g, x, y, TK.leaves({ r: 3.0, h: 4.4 }, 'zelkova', i)), { on: true });
  T.obj([22.6, -3.4], (g) => K.lamp(g, 22.6, -3.4, { h: 9.5, n: 3 }), { on: true });

  /* ---------------- the living layer ---------------- */
  // the Sōbu line: a four-car train runs in along the viaduct, waits at the platform, and runs on
  {
    const P = 36, CAR = 9.4, STOP = 25.6;
    const sAt = (t) => { const u = ((t % P) + P) % P; if (u < 6) { const k = u / 6; return STOP - 100 * (1 - k) * (1 - k); } if (u < 14) return STOP; if (u < 21) { const k = (u - 14) / 7; return STOP + 110 * k * k; } return null; };
    for (let c = 0; c < 4; c++) T.actor({ sample: 0.25, period: P, grow: false,
      at(t) { const s = sAt(t); if (s == null) return null; const y = s - c * CAR, a = clamp((41 - Math.abs(y)) / 7, 0, 1); if (a < 0.03) return null; return { x: TX, y, z: DT, key: 'c', alpha: a < 1 ? a : null, ext: [1.55, 4.6] }; },
      draw(g) { TK.trainCar(g, Math.PI / 2, { kind: 'sobu', cab: c === 0 ? 1 : c === 3 ? -1 : 0, panto: c === 1 ? 1.6 : 0 }); } });
  }
  // a camera for the photographers: a dark body with a lens, held up at the hands (wide px)
  const cam2 = (g, r) => { const a = r.hands[0], b = r.hands[1], c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 0.3]; g.fill2([[c[0] - 1.0, c[1] - 0.7], [c[0] + 1.0, c[1] - 0.7], [c[0] + 1.0, c[1] + 0.6], [c[0] - 1.0, c[1] + 0.6]], '#2A2622', true); g.disc2([c[0], c[1]], 0.45, '#5A6470'); return c; };
  // a paper shopping bag hanging from a hand (wide px)
  const bag2 = (g, h, col) => { g.line2([[h[0] - 0.5, h[1] + 0.1], [h[0], h[1] - 0.5], [h[0] + 0.5, h[1] + 0.1]], { w: 0.3, c: '#3A3128', boil: false }); g.fill2([[h[0] - 1.1, h[1] + 0.2], [h[0] + 1.1, h[1] + 0.2], [h[0] + 1.0, h[1] + 2.9], [h[0] - 1.0, h[1] + 2.9]], col, true); g.line2([[h[0] - 1.1, h[1] + 0.2], [h[0] + 1.1, h[1] + 0.2], [h[0] + 1.0, h[1] + 2.9], [h[0] - 1.0, h[1] + 2.9]], { w: 0.3, c: '#3A3128', close: true, boil: false }); };

  // a maid outside her café hands out flyers: she waves, holds one out to a passer-by, points the way up, bows
  {
    const maid = TK.who(5001, { dir: 1, dress: '#2E2A3A', top: '#2E2A3A', hairStyle: 'pony', hair: '#E79AAE', shoe: '#2E2A26', glasses: false, cap: undefined });
    const SEQ = [['wave', 2.4], ['offer', 2.6], ['rest', 1.2], ['point', 1.8], ['bow', 1.2], ['offer', 2.2], ['wave', 1.6]], P = SEQ.reduce((s, q) => s + q[1], 0);
    T.actor({ sample: 0.25, period: P,
      at(t) { let u = ((t % P) + P) % P, k = 0; while (k < SEQ.length - 1 && u >= SEQ[k][1]) { u -= SEQ[k][1]; k++; } const a = SEQ[k][0], i = a === 'wave' ? Math.floor(u * 4) % 4 : 0; return { x: 16.4, y: -4.2, key: a + i, a, i }; },
      draw(g, st) {
        const w = Object.assign({}, maid), r = st.a === 'offer' ? TK.person(g, 0, 0, 0, Object.assign(w, { hands: [[1.0, -11.2], [4.6, -13.4]] })) : TK.doing(g, w, st.a, st.i);
        const hp = r.hip, sp = r.shoulders, mx = (sp[0][0] + sp[1][0]) / 2, ln = st.a === 'bow' ? 1.6 : 0;
        g.fill2([[mx - 1.5 + ln, sp[0][1] + 2.4], [mx + 1.5 + ln, sp[0][1] + 2.4], [hp[0] + 2.1, hp[1] + 3.2], [hp[0] - 1.9, hp[1] + 3.2]], '#FBFAF6', true);
        g.fill2([[r.crown[0] - 1.5, r.crown[1] + 0.7], [r.crown[0] + 1.5, r.crown[1] + 0.7], [r.crown[0] + 1.3, r.crown[1] - 0.1], [r.crown[0] - 1.3, r.crown[1] - 0.1]], '#FBFAF6', true);
        const lo = r.hands[0][1] > r.hands[1][1] ? r.hands[0] : r.hands[1], hi = lo === r.hands[0] ? r.hands[1] : r.hands[0];
        g.fill2([[lo[0] - 0.9, lo[1] - 0.6], [lo[0] + 0.9, lo[1] - 0.6], [lo[0] + 0.9, lo[1] + 0.8], [lo[0] - 0.9, lo[1] + 0.8]], '#F2C6D0', true);
        if (st.a === 'offer') g.fill2([[hi[0] - 0.2, hi[1] - 1.2], [hi[0] + 1.5, hi[1] - 1.4], [hi[0] + 1.6, hi[1] + 0.3], [hi[0] - 0.1, hi[1] + 0.4]], '#FBE38A', true);
      } });
  }
  // cosplayers posing in the middle of the road for a ring of photographers: one crouches, one checks his shots, flashes.
  // Each of them is an actor of their own on one clock; the shoppers' paths go round the ring
  {
    const COS = [{ x: 4.6, y: 2.2, w: TK.who(5002, { dir: 1, hair: '#7FB7D9', hairStyle: 'long', top: '#F3F1EA', dress: '#3F5F8F', shoe: '#2E2A26', glasses: false, cap: undefined }) },
      { x: 6.8, y: 1.8, w: TK.who(5003, { dir: 1, hair: '#E6C24F', hairStyle: 'pony', top: '#D8322E', dress: '#2E2A26', shoe: '#F3F1EA', glasses: false, cap: undefined }) }];
    const CAM = [[2.0, 5.4, 0, 'photo'], [4.6, 6.2, 3, 'crouch'], [7.4, 6.0, 3, 'photo'], [9.6, 4.4, 2, 'photo'], [1.6, 2.6, 0, 'scroll']].map(([x, y, d, a], i) => ({ x, y, a, w: TK.who(5010 + i, { dir: d, top: ['#3B3F47', '#6B6A4A', '#2F3A4F', '#8E8A84', '#3B3F47'][i], cap: i === 2 ? '#3B3F47' : undefined }) }));
    const POSES = [['peace', 'wave'], ['point', 'peace'], ['cheer', 'cheer'], ['wave', 'point'], ['rest', 'rest']], STEP = 2.2, P = POSES.length * STEP;
    const clock = (t) => { const u = ((t % P) + P) % P; return { k: Math.floor(u / STEP), f: Math.floor(u * 4) % 4, fl: (u % STEP) < 0.35 ? Math.floor(u / STEP) % 3 : -1 }; };
    COS.forEach((m, c) => T.actor({ sample: 0.25, period: P,
      at(t) { const S = clock(t), a = POSES[S.k][c], A = TK.ACTS[a], i = S.f % A.n; return { x: m.x, y: m.y, z: A.z ? A.z[i] : 0, key: a + i, a, i }; },
      draw(g, st) { TK.doing(g, m.w, st.a, st.i); } }));
    CAM.forEach((m, j) => T.actor({ sample: 0.25, period: P,
      at(t) { const S = clock(t), fl = m.a !== 'scroll' && S.fl >= 0 && j === S.fl + 1; return { x: m.x, y: m.y, key: fl ? 'f' : 'n', fl }; },
      draw(g, st) {
        if (m.a === 'scroll') { TK.doing(g, m.w, 'scroll', 0); return; }
        const r = TK.person(g, 0, 0, 0, Object.assign({}, m.w, { pose: m.a === 'crouch' ? 'crouch' : 'stand', hands: m.a === 'crouch' ? [[1.4, -11.2], [2.6, -11.4]] : [[1.0, -16.4], [2.6, -16.6]] }));
        const c = cam2(g, r);
        if (st.fl) { g.disc2([c[0] + 0.4, c[1] - 0.9], 1.1, '#FFFFFF'); g.mark({ nc: true, light: true }); }
      } }));
  }
  // the idol sings on the plaza stage; her fans clap on the beat through the verse, wave their penlights and jump in the
  // chorus, and clap her off with a bow. She and each fan are actors of their own on one clock
  {
    const idol = TK.who(5020, { dir: 0, dress: '#F7A6C6', top: '#FBFAF6', hairStyle: 'pony', hair: '#3A2A26', shoe: '#FBFAF6', glasses: false, cap: undefined });
    const FANS = [[-15.4, 21.0], [-14.6, 23.2], [-15.2, 25.6], [-12.6, 21.8], [-12.2, 24.4], [-13.0, 26.8]].map(([x, y], i) => ({ x, y, pl: ['#F2A0C0', '#9FE0F0', '#F7E07A', '#F2A0C0', '#B7F08A', '#9FE0F0'][i], w: TK.who(5030 + i, { dir: 2, top: ['#F7A6C6', '#3B3F47', '#F3F1EA', '#2F3A4F', '#F7A6C6', '#6C7A89'][i] }) }));
    const P = 16;
    const clock = (t) => { const u = ((t % P) + P) % P; return { part: u < 8 ? 'v' : u < 14 ? 'c' : 'b', beat: Math.floor(u * 2) % 2, f: Math.floor(u * 4) % 4, alt: Math.floor(u / 2) % 2 }; };
    // the singer on the stage, a microphone in her hand
    T.actor({ sample: 0.25, period: P,
      at(t) { const S = clock(t), ia = S.part === 'v' ? (S.alt ? 'point' : 'wave') : S.part === 'c' ? 'jump' : 'bow', iA = TK.ACTS[ia], ii = ia === 'wave' ? S.beat * 2 : ia === 'jump' ? S.f : 0;
        return { x: -21.6, y: 23.5, z: 1.1 + (iA.z ? iA.z[ii] : 0), key: ia + ii, a: ia, i: ii }; },
      draw(g, st) {
        const r = TK.doing(g, idol, st.a, st.i);
        const lo = r.hands[0][1] > r.hands[1][1] ? r.hands[0] : r.hands[1]; g.line2([[lo[0], lo[1]], [lo[0] + 0.6, lo[1] - 1.8]], { w: 0.5, c: '#2E2A26', boil: false }); g.disc2([lo[0] + 0.7, lo[1] - 2.0], 0.45, '#5A564E');
      } });
    for (const m of FANS) T.actor({ sample: 0.25, period: P,
      at(t) { const S = clock(t), a = S.part === 'v' ? 'clap' : S.part === 'c' ? (m.x < -14 ? 'jump' : 'cheer') : 'clap', A = TK.ACTS[a], i = a === 'clap' ? S.beat : S.f;
        return { x: m.x, y: m.y, z: A.z ? A.z[i] : 0, key: a + i + S.part + (S.part === 'c' ? S.f % 2 : ''), a, i, part: S.part, f: S.f }; },
      draw(g, st) {
        const fr = TK.doing(g, m.w, st.a, st.i);
        if (st.part !== 'b') { const h = fr.hands[0][1] < fr.hands[1][1] ? fr.hands[0] : fr.hands[1], dx = st.part === 'c' ? (st.f % 2 ? 0.9 : -0.9) : 0.3; g.fill2([[h[0] - 0.25, h[1]], [h[0] + 0.25, h[1]], [h[0] + dx + 0.25, h[1] - 2.6], [h[0] + dx - 0.25, h[1] - 2.6]], m.pl, true); g.mark({ nc: true, light: true }); }
      } });
  }
  // gamers at the pavement crane games: one steers the claw and drops it, his friend watches and cheers when it wins;
  // the girl at the next machine has her own go. The claws (inside their cases) and each person are actors of their own
  // on one clock
  {
    const A0 = { x: -18.4, y: -3.2 }, A1 = { x: -15.2, y: -3.3 }, FR = { x: -16.8, y: -2.0 }, CX = -16.9, CY = -5.0;
    const pA = TK.who(5040, { dir: 3, top: '#3F5F8F' }), pB = TK.who(5041, { dir: 3, hairStyle: 'long', top: '#F7A6C6' }), pF = TK.who(5042, { dir: 2, top: '#E6C24F', cap: '#3B3F47' });
    const P = 9;
    const claw = (u) => (u < 4 ? { s: u / 4, d: 0 } : u < 5.4 ? { s: 1, d: (u - 4) / 1.4 } : u < 6.8 ? { s: 1, d: 1 - (u - 5.4) / 1.4 } : { s: 1 - (u - 6.8) / 2.2, d: 0 });
    const clock = (t) => {
      const u = ((t % (2 * P)) + 2 * P) % (2 * P), win = u >= P, v = u % P, w2 = (v + 4.5) % P;
      return { qa: claw(v), qb: claw(w2), react: v >= 6.8 ? (win ? 'cheer' : 'laugh') : v >= 4 ? 'look' : 'steer', f: Math.floor(u * 4) % 4, bSteer: w2 < 4, prize: win && v > 5.4 };
    };
    const steer = (i) => ({ hands: i % 2 ? [[1.1, -11.6], [2.4, -11.1]] : [[1.4, -11.1], [2.7, -11.7]] });
    // the claws inside their cases (anchored inside the pair of cabinets, so drawn over them and under the players)
    T.actor({ sample: 0.25, period: 2 * P,
      at(t) { const S = clock(t), k = (q) => Math.round(q.s * 6) + '' + Math.round(q.d * 4); return { x: CX, y: CY, key: k(S.qa) + k(S.qb) + (S.prize ? 'p' : ''), qa: S.qa, qb: S.qb, prize: S.prize }; },
      draw(g, st) {
        for (const [mx, q, prize] of [[-18.4, st.qa, st.prize], [-15.4, st.qb, false]]) {
          const x = mx - 0.8 + q.s * 1.6, z = 4.75 - q.d * 1.9, top = g.p(x - CX, -5.3 - CY, 4.75), b = g.p(x - CX, -5.3 - CY, z);
          g.line2([[top[0] - 1.2, top[1] - 0.3], [top[0] + 1.2, top[1] + 0.3]], { w: 0.4, c: '#8C9298', boil: false });
          g.line2([top, b], { w: 0.3, c: '#5A564E', boil: false });
          g.line2([[b[0] - 0.9, b[1] + 1.1], [b[0] - 0.5, b[1] + 0.2], [b[0], b[1]], [b[0] + 0.5, b[1] + 0.2], [b[0] + 0.9, b[1] + 1.1]], { w: 0.45, c: '#B9BEC2', boil: false });
          if (prize) g.disc2([b[0], b[1] + 1.3], 0.95, '#F2B6C2');
        }
      } });
    // the players, back to us, hands on the buttons; the friend behind them
    T.actor({ sample: 0.25, period: 2 * P,
      at(t) { const S = clock(t); return { x: A0.x, y: A0.y, key: S.react + (S.react === 'steer' || S.react === 'cheer' ? S.f : S.react === 'laugh' ? S.f % 2 : ''), react: S.react, f: S.f }; },
      draw(g, st) { TK.person(g, 0, 0, 0, Object.assign({}, pA, st.react === 'steer' ? steer(st.f) : st.react === 'cheer' ? { pose: 'cheer', ph: st.f / 4 } : st.react === 'laugh' ? TK.ACTS.laugh.f(st.f % 2) : {})); } });
    T.actor({ sample: 0.25, period: 2 * P,
      at(t) { const S = clock(t); return { x: A1.x, y: A1.y, key: S.bSteer ? 'b' + (S.f % 2) : 'n', steer: S.bSteer, f: S.f }; },
      draw(g, st) { TK.person(g, 0, 0, 0, Object.assign({}, pB, st.steer ? steer(st.f) : {})); } });
    T.actor({ sample: 0.25, period: 2 * P,
      at(t) { const S = clock(t), fa = S.react === 'cheer' ? 'jump' : S.react === 'steer' ? 'point' : S.react === 'laugh' ? 'laugh' : 'look', FA = TK.ACTS[fa], fi = S.f % FA.n; return { x: FR.x, y: FR.y, z: FA.z ? FA.z[fi] : 0, key: fa + fi, a: fa, i: fi }; },
      draw(g, st) { TK.doing(g, pF, st.a, st.i); } });
  }
  // children at the capsule machines: one turns the handle, the capsule drops, both jump; a parent looks on. They stand
  // at the rack's right end, where the kebab van does not hide their feet; each is an actor of their own on one clock
  {
    const kA = TK.who(5050, { dir: 3, k: 0.78, top: '#E6C24F', cap: '#D8322E' }), kB = TK.who(5051, { dir: 3, k: 0.76, hairStyle: 'pony', top: '#7FD0E8' }), pa = TK.who(5052, { dir: 2 });
    const P = 10;
    const clock = (t) => { const u = ((t % P) + P) % P; return { ph: u < 4 ? 'turn' : u < 5.4 ? 'look' : u < 7.4 ? 'jump' : 'show', f: Math.floor(u * 4) % 4 }; };
    const turn = (i) => ({ hands: i % 2 ? [[1.0, -9.4], [1.8, -9.9]] : [[1.3, -9.9], [2.0, -9.3]] });
    T.actor({ sample: 0.25, period: P,
      at(t) { const S = clock(t); return { x: 6.0, y: 15.5, z: S.ph === 'jump' ? [0, 0.7, 1.1, 0.7][S.f] : 0, key: S.ph + (S.ph === 'turn' || S.ph === 'jump' ? S.f : ''), ph: S.ph, f: S.f }; },
      draw(g, st) {
        const rA = TK.person(g, 0, 0, 0, Object.assign({}, kA, st.ph === 'turn' ? turn(st.f) : st.ph === 'jump' ? { pose: 'cheer', ph: st.f / 4 } : st.ph === 'show' ? { hands: [[-1.9, -9.6], [2.4, -13.8]] } : {}));
        if (st.ph === 'show' || st.ph === 'jump') { const h = rA.hands[0][1] < rA.hands[1][1] ? rA.hands[0] : rA.hands[1]; g.disc2([h[0], h[1] - 0.6], 0.85, '#E9806A'); g.fill2([[h[0] - 0.85, h[1] - 0.6], [h[0] + 0.85, h[1] - 0.6], [h[0] + 0.6, h[1] + 0.1], [h[0] - 0.6, h[1] + 0.1]], '#F6F3EA', true); }
      } });
    T.actor({ sample: 0.25, period: P,
      at(t) { const S = clock(t), a = S.ph === 'jump' ? 'jump' : S.ph === 'turn' ? 'point' : 'look', A = TK.ACTS[a], i = S.f % A.n; return { x: 8.0, y: 15.8, z: A.z ? A.z[i] : 0, key: a + i, a, i }; },
      draw(g, st) { TK.doing(g, kB, st.a, st.i); } });
    T.actor({ sample: 0.25, period: P,
      at(t) { const S = clock(t), a = S.ph === 'jump' ? 'laugh' : 'scroll', i = S.f % 2 % TK.ACTS[a].n; return { x: 10.2, y: 16.8, key: a + i, a, i }; },
      draw(g, st) { TK.doing(g, pa, st.a, st.i); } });
  }
  // shoppers in the pedestrian paradise and along the pavements, many with bags; people coming out of the station
  const shopper = (look, pts, speed, phase, bags) => {
    const seg = [], L = [0];
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    const total = L[L.length - 1], per = total / speed;
    return T.actor({ sample: 0.25, period: per,
      at(t) {
        let d = (((t * speed + phase * total) % total) + total) % total, i = 0; while (i < seg.length - 1 && d > L[i + 1]) i++;
        const [a, b] = seg[i], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1], dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor((d / 2.4) % 1 * 8);
        return { x: a[0] + dx * u, y: a[1] + dy * u, key: dir + '.' + ph, dir, ph: ph / 8 };
      },
      draw(g, st) { const r = TK.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: 'walk', ph: st.ph })); if (bags) { bag2(g, r.hands[0], bags[0]); if (bags[1]) bag2(g, r.hands[1], bags[1]); } } });
  };
  const BAGS = [['#F3F1EA'], ['#D8322E'], ['#E6C24F', '#3F7FC0'], ['#3F9A5A'], ['#F7A6C6'], ['#2E2A26', '#E6C24F'], null, null];
  // (one walks round the back of the cosplay ring; on the far pavement they keep out from under the awnings and clear of
  // the crane games and the maid; on the near pavement clear of the trees)
  const AROUND = [[12, 5.4], [10.4, -1.9], [0.2, -1.9], [-1.4, 5.5]];
  const ROUTES = [[[-25.5, 0.6], [33.5, 0.6]], [[33, 5.2]].concat(AROUND, [[-25, 5.6]], AROUND.slice().reverse()), [[-24, 7.6], [20, 7.2]], [[30, -0.4], [-12, -0.4]], [[-13, -4.3], [15, -4.3]], [[34.6, -4.3], [17.8, -4.3]], [[-28, 10.0], [36, 10.0]], [[34, 11.0], [-26, 11.0]], [[12, -1.4], [33, -1.6]], [[-20, 8.5], [10, 8.6]]];
  ROUTES.forEach((pts, i) => {
    const look = i % 4 === 3 ? TK.salary(5100 + i) : TK.who(5100 + i, i % 3 === 0 ? { hair: ['#E79AAE', '#7FB7D9', '#2B2420'][i % 3], hairStyle: 'long' } : { glasses: i % 2 === 0 });
    shopper(look, pts, 1.35 + (i % 3) * 0.25, (i * 0.173) % 1, BAGS[i % BAGS.length]);
  });
  // (out from under the station's awning, round the vending machines and the bench)
  for (const [i, pts] of [[0, [[-26.2, 30.5], [-18, 30.6], [-2, 32.6], [-18, 30.6]]], [1, [[-25.4, 12.4], [-22, 15.0], [-8, 15.6], [-22, 15.0]]]]) shopper(TK.who(5120 + i, i ? { cap: '#3F5F8F' } : {}), pts, 1.3, i * 0.4, i ? ['#E6C24F'] : null);
  // at the kebab van: one eats, one waits his turn
  TK.idle(T, TK.who(5130, { dir: 3, food: '#C98A4A' }), 3.4, 25.2, { acts: ['eat', 'eat', 'look', 'talk'], seed: 5130 });
  TK.idle(T, TK.who(5131, { dir: 3 }), 5.6, 25.8, { acts: ['scroll', 'look', 'scroll'], seed: 5131 });
  // at the parts stalls: a stallholder at the front corner of her stall (out from under its awning, which would hide
  // her) and a browser turning a part in his hand; on the benches, lunch from the van
  TK.idle(T, TK.who(5132, { dir: 1, cap: '#3B3F47' }), 15.2, 23.2, { acts: ['talk', 'point', 'look', 'rest'], seed: 5132 });
  TK.idle(T, TK.salary(5133, { dir: 3 }), 26.6, 24.4, { acts: ['look', 'point', 'look', 'scroll'], seed: 5133, lookTo: 3 });
  TK.group(T, [{ who: TK.who(5134, { dir: 1, sit: true, food: '#C98A4A' }), x: 31.8, y: 24.6, z: 1.4, idle: 'eat' }, { who: TK.who(5135, { dir: 1, sit: true }), x: 33.4, y: 24.6, z: 1.4 }], { seed: 13 });
  TK.idle(T, TK.who(5136, { dir: 0, sit: true }), -14.8, 34.0, { z: 1.4, acts: ['scroll', 'drink', 'look', 'scroll'], seed: 5136 });
});
