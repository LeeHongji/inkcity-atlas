'use strict';
/* Three satellites off the grid, each on an unlined paint blob:
   top        Tibidabo, the city's mountain: the Sagrat Cor temple (a stone crypt church under a tall tower with the
              bronze Christ, arms open) and the old funfair beside it — the Ferris wheel turning and the little red
              aeroplane (the Avió) flying round its pylon;
   upper right Torre Glòries, the bullet-shaped tower with its skin of coloured glass louvres, by the new park;
   left       Camp Nou with a match on: blaugrana stands full of fans, the pitch, the players chasing the ball. */
(function () {
  const blob = (g, pts, col, seed) => K.blob2(g, g.P(pts.map((p) => [p[0], p[1], 0])), col, { seed, rag: 0.8 });

  /* ---------------- Tibidabo ---------------- */
  SF.tile('tibidabo', -210, -140, { rim: 96, castAt: 160, order: -3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-30, -10], [-22, -30], [2, -32], [26, -22], [30, 2], [22, 26], [-4, 30], [-26, 20]], '#B9CC8A', 11);
      g.grass([[-24, -18, 0], [20, -22, 0], [24, 18, 0], [-20, 22, 0]], { dens: 0.5 });
    });
    // the mountain's summit as a low hill, the temple on it
    T.obj([-22, -22, 6, 6], function (g) {
      const c = g.p(-8, -8, 0), apex = g.p(-8, -8, 9), R = 26 * 2.0;
      const hill = [[c[0] - R, c[1] + 6], [c[0] - R * 0.5, apex[1] + 6], [apex[0], apex[1]], [c[0] + R * 0.5, apex[1] + 6], [c[0] + R, c[1] + 6]];
      g.fill2(K.curve(hill, 3, false), '#9DB27A'); g.line2(K.curve(hill, 3, false), { w: 0.8, c: '#5E7A3E' });
      const t = []; for (let i = 0; i < 12; i++) { const x = c[0] - R * 0.8 + i * R * 0.14, y = c[1] + 2 - Math.sin(Math.PI * i / 11) * 22; t.push(x, y, x + 1, y - 2.2); } g.segs2(t, '#5E7A3E', 0.6);
    }, { name: 'summit' });
    T.obj([-14, -14, -2, -2], function (g) {
      g.boilP = 0.2;
      const z0 = 9, ST = { t: '#E9DFC9', l: '#E2D6BC', r: '#CABB9C' };
      K.box(g, -14, -14, -2, -2, z0, z0 + 6, ST, { w: 0.85 });
      for (let x = -13; x < -2; x += 2.4) K.win(g, 'L', -2, x, x + 1.2, z0 + 1.2, z0 + 4.6, { style: 'navy', arch: true });
      K.box(g, -12, -12, -4, -4, z0 + 6, z0 + 14, ST, { w: 0.85, nohid: true });
      for (const [f, p, a0] of [['L', -4, -11], ['R', -4, -11]]) for (let a = a0; a < -5; a += 2) K.win(g, f, p, a, a + 1, z0 + 8, z0 + 12.5, { style: 'navy', arch: true });
      for (const [x, y] of [[-12, -4], [-4, -4], [-4, -12]]) { const b = g.p(x, y, z0 + 14); g.fill2([[b[0] - 1.6, b[1]], [b[0] + 1.6, b[1]], [b[0], b[1] - 9]], '#E2D6BC', true); g.line2([[b[0] - 1.6, b[1]], [b[0], b[1] - 9], [b[0] + 1.6, b[1]]], { w: 0.5, boil: false }); }
      K.cyl(g, -8, -8, 2.0, z0 + 14, z0 + 22, ST, { w: 0.7, n: 10 });
      const s = g.p(-8, -8, z0 + 22), BR = '#7A6A4A';
      g.fill2([[s[0] - 1.2, s[1]], [s[0] + 1.2, s[1]], [s[0] + 0.9, s[1] - 13], [s[0] - 0.9, s[1] - 13]], BR, true); g.disc2([s[0], s[1] - 14.2], 1.2, BR);
      g.line2([[s[0] - 0.8, s[1] - 11.4], [s[0] - 5.6, s[1] - 13.6]], { w: 1.0, c: BR, boil: false, ext: 0 }); g.line2([[s[0] + 0.8, s[1] - 11.4], [s[0] + 5.6, s[1] - 13.6]], { w: 1.0, c: BR, boil: false, ext: 0 });
    }, { name: 'sagrat cor', on: true });
    // the Ferris wheel: its frame (static) and the rim with gondolas (an actor turning)
    const WX = 12, WY = 2, WZ = 9.5, WR = 7.4;
    T.obj([WX - 2, WY - 1, WX + 2, WY + 1], (g) => { const b0 = g.p(WX, WY - 3, 0), b1 = g.p(WX, WY + 3, 0), h = g.p(WX, WY, WZ); g.segs2([b0[0], b0[1], h[0], h[1], b1[0], b1[1], h[0], h[1]], '#5A5F68', 0.9); }, { name: 'wheel stand' });
    T.actor({ sample: 5, period: 24, grow: false, bias: 0.5,
      at(t) { const q = Math.floor(t * 2) % 24; return { x: WX, y: WY + 0.5, key: q, q }; },
      draw(g, st) {
        const h = [WX, WY + 0.5], P = (a, r) => g.p(0 + 0, -0.5 + Math.cos(a) * r, WZ + Math.sin(a) * r), rim = []; const a0 = st.q / 24 * TAU / 8;
        for (let i = 0; i <= 32; i++) rim.push(P(TAU * i / 32, WR)); g.line2(rim, { w: 0.7, c: '#C9392E', boil: false });
        const sp = []; const c = P(0, 0); for (let i = 0; i < 8; i++) { const e = P(a0 + TAU * i / 8, WR); sp.push(c[0], c[1], e[0], e[1]); } g.segs2(sp, '#8A8A84', 0.3);
        for (let i = 0; i < 8; i++) { const e = P(a0 + TAU * i / 8, WR); g.fill2([[e[0] - 1.3, e[1] + 0.4], [e[0] + 1.3, e[1] + 0.4], [e[0] + 1.1, e[1] + 3.0], [e[0] - 1.1, e[1] + 3.0]], ['#E6C24F', '#4F8FBF', '#7DBF9A', '#E07A5A'][i % 4], true); g.segs2([e[0], e[1], e[0], e[1] + 0.5], '#3A3530', 0.3); }
        g.disc2(c, 0.8, '#3A3530'); void h;
      } });
    // the Avió: a red aeroplane on an arm flying round its pylon
    const AX0 = 4, AY0 = 14;
    T.obj([AX0 - 1, AY0 - 1, AX0 + 1, AY0 + 1], (g) => { const b = g.p(AX0, AY0, 0), t = g.p(AX0, AY0, 13); g.fill2([[b[0] - 1.2, b[1]], [b[0] + 1.2, b[1]], [t[0] + 0.4, t[1]], [t[0] - 0.4, t[1]]], '#8A8A84', true); g.segs2([b[0] - 4, b[1] + 1, t[0], t[1], b[0] + 4, b[1] + 1, t[0], t[1]], '#6E6E68', 0.4); }, { name: 'avio pylon' });
    T.actor({ sample: 0.5, period: 16, grow: false, layer: 'top',
      at(t) { const q = Math.floor(t * 3) % 48, a = q / 48 * TAU; return { x: AX0 + Math.cos(a) * 8, y: AY0 + Math.sin(a) * 8, z: 11, key: q, a }; },
      draw(g, st) {
        const ang = st.a + Math.PI / 2, ca = Math.cos(ang), sa = Math.sin(ang), back = g.p(-Math.cos(st.a) * 8, -Math.sin(st.a) * 8, 2);
        g.segs2([back[0], back[1], 0 + g.p(0, 0, 0.6)[0], g.p(0, 0, 0.6)[1]], '#5A5A54', 0.3);
        const B = K.rbox(g, 0, 0, 2.6, 0.7, ang, -0.4, 0.8, { t: '#E04A3A', l: '#C9392E', r: '#A8302A' }, { w: 0.5 });
        K.rbox(g, -0.2 * ca, -0.2 * sa, 0.6, 3.0, ang, 0.4, 0.6, { t: '#E04A3A', l: '#C9392E', r: '#A8302A' }, { w: 0.4 }); void B;
      } });
    for (const [x, y, s] of [[2, -2, 8800], [6, -6, 8801], [-2, 4, 8802]]) T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(s, { dir: 2, pose: s === 8801 ? 'hold' : 'stand', phone: s === 8801 })), {});
  });

  /* ---------------- Torre Glòries ---------------- */
  SF.tile('glories', -15, -232, { rim: 90, castAt: 160, order: -3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-26, -8], [-18, -26], [4, -28], [24, -18], [28, 4], [18, 24], [-6, 26], [-24, 16]], '#C9D6A0', 13);
      const pond = K.curve([[-14, 8, 0], [0, 6, 0], [10, 12, 0], [2, 18, 0], [-12, 16, 0]], 4, true); g.fill(pond, C.water); g.water(pond, { dens: 0.6 }); g.outline(pond, { w: 0.5, c: '#5F7F9C', boil: false });
    });
    T.obj([-6, -12, 6, 0], function (g) {
      g.boilP = 0.2;
      const cx = 0, cy = -6, r = 5.6, H = 28, N = 16, L = [], Rr = [];
      for (let i = 0; i <= N; i++) { const t = i / N, z = H + 8 * t, rr = r * Math.sqrt(1 - t * t), p = g.p(cx, cy, z); L.push([p[0] - rr * SX, p[1]]); Rr.push([p[0] + rr * SX, p[1]]); }
      for (let k = 0; k < 7; k++) { const z0 = H * k / 7, z1 = H * (k + 1) / 7, c = mix('#C9483A', '#3F78B8', k / 6); K.cyl(g, cx, cy, r, z0, z1, { t: c, l: c, r: shade(c, 0.18) }, { w: k === 0 ? 0.8 : 0.3, n: 18, nt: true }); }
      g.fill2(L.concat(Rr.slice().reverse()), '#4F86C6'); g.fill2(Rr.map((p, i) => [lerp(L[i][0], p[0], 0.55), p[1]]).concat(Rr.slice().reverse()), '#3A6AA6');
      g.line2(L, { w: 0.8 }); g.line2(Rr, { w: 0.8 });
      const R = RNG(4040), pix = [];
      for (let z = 1; z < H + 6; z += 1.4) for (let k = 0; k < 9; k++) { const a = Math.PI * (0.78 - k * 0.12), rr = z < H ? r : r * Math.sqrt(Math.max(0, 1 - Math.pow((z - H) / 8, 2))); if (rr < 0.5) continue; const p = g.p(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, z); const f = z / (H + 6); pix.push([p, R() < 0.5 ? mix('#C9392E', '#E6C24F', f) : mix('#2F5A8C', '#7FB7D9', f)]); }
      for (const [p, c] of pix) g.fill2([[p[0] - 1.0, p[1] - 0.6], [p[0] + 1.0, p[1] - 0.6], [p[0] + 1.0, p[1] + 0.6], [p[0] - 1.0, p[1] + 0.6]], c, true);
      const lat = []; for (let k = 0; k < 9; k++) { const a = Math.PI * (0.78 - k * 0.12), b = g.p(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0), t = g.p(cx + Math.cos(a) * r, cy + Math.sin(a) * r, H); lat.push(b[0], b[1], t[0], t[1]); } g.segs2(lat, '#E9EEF1', 0.3);
    }, { name: 'torre glories' });
    for (const [x, y] of [[14, -4], [-16, -2], [18, 10]]) T.obj([x, y], (g) => BC.plane(g, x, y, { r: 3.6, h: 5.4 }), { name: 'tree' });
    BC.walker(T, BC.who(8810), [[-18, 4], [16, 4], [16, -14]], 1.1, { phase: 0.2 });
    BC.walker(T, BC.who(8811, { sunhat: true }), [[16, 20], [-14, 22]], 1.0, { phase: 0.6 });
  });

  /* ---------------- Camp Nou ---------------- */
  SF.tile('campnou', -232, 70, { rim: 100, castAt: 162, order: -3, half: 32 }, function (T) {
    const CX = 0, CY = 0, A0 = 13, B0 = 8.5, A1 = 25, B1 = 18.5, ZT = 9;
    const el = (a, b, th) => [CX + Math.cos(th) * a, CY + Math.sin(th) * b];
    T.ground(function (g) {
      blob(g, [[-32, -12], [-24, -30], [4, -32], [28, -22], [34, 2], [26, 26], [-4, 32], [-28, 22]], '#D9D3C2', 17);
      // the pitch: stripes and lines
      const P = []; for (let i = 0; i < 40; i++) { const th = TAU * i / 40; const p = el(A0 - 0.6, B0 - 0.6, th); P.push([p[0], p[1], 0.2]); }
      g.fill(P, '#7FB25A');
      for (let k = -4; k <= 4; k += 2) g.fill([[k * 2.2 - 1.1, -6.8, 0.21], [k * 2.2 + 1.1, -6.8, 0.21], [k * 2.2 + 1.1, 6.8, 0.21], [k * 2.2 - 1.1, 6.8, 0.21]], '#8CC066');
      g.outline([[-10.5, -6.8, 0.22], [10.5, -6.8, 0.22], [10.5, 6.8, 0.22], [-10.5, 6.8, 0.22]], { w: 0.45, c: '#F6F3EA', boil: false });
      g.line([[0, -6.8, 0.22], [0, 6.8, 0.22]], { w: 0.4, c: '#F6F3EA', boil: false });
      const cc = []; for (let i = 0; i <= 16; i++) { const th = TAU * i / 16; cc.push([Math.cos(th) * 2.2, Math.sin(th) * 2.2, 0.22]); } g.line(cc, { w: 0.4, c: '#F6F3EA', boil: false });
      for (const s of [-1, 1]) g.outline([[s * 10.5, -3, 0.22], [s * 7.6, -3, 0.22], [s * 7.6, 3, 0.22], [s * 10.5, 3, 0.22]], { w: 0.4, c: '#F6F3EA', boil: false });
    });
    // the far stands: tiers rising away from the pitch, packed with fans in blaugrana
    T.obj([-26, -19, 26, 2], function (g) {
      g.boilP = 0.15;
      const N = 5, R = RNG(5150);
      for (let k = 0; k < N; k++) {
        const t0 = k / N, t1 = (k + 1) / N, a0 = lerp(A0, A1, t0), b0 = lerp(B0, B1, t0), a1 = lerp(A0, A1, t1), b1 = lerp(B0, B1, t1), z0 = 1 + ZT * t0, z1 = 1 + ZT * t1;
        const ths = []; for (let i = 0; i <= 24; i++) ths.push(Math.PI * 0.68 + Math.PI * 1.14 * i / 24);
        const band = ths.map((th) => { const p = el(a0, b0, th); return [p[0], p[1], z0]; }).concat(ths.slice().reverse().map((th) => { const p = el(a1, b1, th); return [p[0], p[1], z1]; }));
        g.fill(band, k % 2 ? '#2F4A8C' : '#A33A4A');
        // fans: a bust per seat along the band
        for (let i = 0; i < 26; i++) { const th = Math.PI * 0.7 + Math.PI * 1.1 * (i + 0.5) / 26, p = el(lerp(a0, a1, 0.5), lerp(b0, b1, 0.5), th); if (R() < 0.12) continue; const w = BC.who(5200 + k * 40 + i); w.top = R() < 0.6 ? (R() < 0.5 ? '#2F4A8C' : '#A33A4A') : w.top; BC.bust2(g, g.p(p[0], p[1], lerp(z0, z1, 0.5)), w, 0.55); }
      }
      const rim = []; for (let i = 0; i <= 24; i++) { const th = Math.PI * 0.68 + Math.PI * 1.14 * i / 24, p = el(A1, B1, th); rim.push([p[0], p[1], 1 + ZT]); } g.line(rim, { w: 0.8, boil: false });
      // the lettering on the far stand
      K.textP(g, (a, z) => { const th = Math.PI * 1.25 + a / 20, p = el(lerp(A0, A1, 0.25), lerp(B0, B1, 0.25), th); return [p[0], p[1], 1 + ZT * 0.25 + z * 0.4]; }, -6, 0.2, 3, 'MÉS QUE UN CLUB', '#F3E3A0', { w: 0.6, center: false });
    }, { name: 'far stands' });
    // the players: two teams chasing the ball across the pitch, the ball, the referee
    const BALL = (t) => { const u = t * 0.5; return [Math.sin(u) * 7 + Math.sin(u * 2.3) * 2, Math.sin(u * 1.7) * 4]; };
    for (let i = 0; i < 10; i++) {
      const home = [((i % 5) - 2) * 3.6 + (i < 5 ? -2 : 2), ((i % 3) - 1) * 3.6], look = BC.who(5300 + i, { top: i < 5 ? '#A33A4A' : '#F3F1EA', bot: i < 5 ? '#2F4A8C' : '#F3F1EA', shorts: true, bare: true });
      T.actor({ sample: 0.3, period: 40, at(t) { const b = BALL(t + i * 0.1), x = lerp(home[0], b[0], 0.45), y = lerp(home[1], b[1], 0.45), d = BC.dirOf(b[0] - x, b[1] - y), ph = Math.floor((t * 2.6 + i) % 1 * 8); return { x, y, z: 0.2, key: d + '.' + ph, dir: d, ph: ph / 8 }; }, draw(g, st) { BC.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: 'walk', ph: st.ph, k: 0.8 })); } });
    }
    T.actor({ sample: 0.2, period: 40, grow: false, at(t) { const b = BALL(t); return { x: b[0], y: b[1], z: 0.6, key: 'b' }; }, draw(g) { const c = g.p(0, 0, 0); g.disc2(c, 0.8, '#F6F3EA'); g.ring2(c, 0.8, { w: 0.3, c: '#3A3530' }); } });
    // the near stands: the outer wall with its band of blaugrana, split into pieces so players sort behind them
    const segs = 4;
    for (let s = 0; s < segs; s++) {
      const th0 = -Math.PI * 0.32 + Math.PI * 1.0 * s / segs, th1 = -Math.PI * 0.32 + Math.PI * 1.0 * (s + 1) / segs;
      const pts = []; for (let i = 0; i <= 6; i++) pts.push(el(A1, B1, lerp(th0, th1, i / 6)));
      const inner = []; for (let i = 0; i <= 6; i++) inner.push(el(A0 + 1, B0 + 1, lerp(th0, th1, i / 6)));
      const bb = BC.bbox(pts.concat(inner));
      T.obj(bb, function (g) {
        g.boilP = 0.2;
        const top = pts.map((p) => [p[0], p[1], 1 + ZT]).concat(inner.slice().reverse().map((p) => [p[0], p[1], 1.6]));
        g.fill(top, '#C9C4B8');
        g.fill(pts.map((p) => [p[0], p[1], 0]).concat(pts.slice().reverse().map((p) => [p[0], p[1], 1 + ZT])), '#E2DCCD');
        g.fill(pts.map((p) => [p[0], p[1], 5]).concat(pts.slice().reverse().map((p) => [p[0], p[1], 6.6])), s % 2 ? '#2F4A8C' : '#A33A4A');
        const vb = []; for (let i = 0; i <= 6; i++) { const a = g.p(pts[i][0], pts[i][1], 0), b = g.p(pts[i][0], pts[i][1], 1 + ZT); vb.push(a[0], a[1], b[0], b[1]); } g.segs2(vb, '#A9A396', 0.35);
        g.line(pts.map((p) => [p[0], p[1], 1 + ZT]), { w: 0.85, boil: false }); g.line(pts.map((p) => [p[0], p[1], 0]), { w: 0.75, boil: false });
      }, { name: 'near stand', under: 20 });
    }
    for (const [x, y, s] of [[22, 20, 5400], [25, 18, 5401], [18, 24, 5402]]) T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(s, { dir: 1, pose: 'stand', top: s % 2 ? '#2F4A8C' : '#A33A4A' })), {});
  });
})();
