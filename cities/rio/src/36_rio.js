'use strict';
/* Rio's own kit: granite mountains (RJ.rock), Portuguese-stone pavements and Burle Marx's wave (RJ.mosaic, RJ.waves),
   beach things (umbrellas, chairs, kiosks, lifeguard posts, palms), houses (favela brick and lajes, colonial fronts,
   apartment blocks), the people of Rio in Carnival (beachwear, costumes, polka dots, feathers, baianas, drummers),
   their vehicles (yellow taxi, bus, Kombi, mototaxi, bonde, VLT, ferry, helicopter) and the crowd busts of the stands.
   Everything in tile-local u unless the name ends in 2 (wide px). */
const RJ = {};
const RP = {
  pave: '#ECE7DA', paveL: '#F4F0E6', stone: '#2F2B27', asph: '#D6D0C2', kerb: '#BDB5A3',
  sand: '#EED9A6', sandD: '#DEC387', sandW: '#D9C597', sea: '#7FC0C9', seaD: '#5FA4B4', bay: '#86BBC0', foam: '#F7F8F3',
  granite: '#B9B3A6', graniteD: '#8F887C', graniteL: '#D2CDC1', forest: '#5E8F4E', forestD: '#44703C', forestL: '#79A85E',
  green: '#3A9A5B', yellow: '#F2C230', blue: '#2F6DB5', pink: '#E86A9A', teal: '#2A9C9C', orange: '#EE8A2E', red: '#D9463B',
};

/* ---------------- granite mountains ---------------- */
/* A rock built from stacked horizontal cross-sections (rings: [z, rx, ry, dx, dy], bottom to top, centred on x, y).
   The silhouette follows each ring's outermost points, the shaded right flank runs from each ring's terminator to its
   right edge, then come weathering streaks running down the bare granite and patches of forest where the slope
   holds soil. Returns { at(th, z) -> surface point on the visible front, top } so things can be placed on it. */
/* the surface point of ring i at angle th (tile-local u), as RJ.rock draws it; f in [0,1] blends towards ring i+1 */
RJ.rockW = function (x, y, rings, o) {
  o = o || {}; const seed = o.seed || 1, rough = o.rough == null ? 0.06 : o.rough;
  const rad = (i, th) => 1 + rough * vnoise(th * 2.2 + 11, seed) + rough * 0.6 * vnoise(th * 5.1 + i * 0.4, seed + 5);
  const W = (i, th) => { const r = rings[i], k = rad(i, th); return [x + r[3] + Math.cos(th) * r[1] * k, y + r[4] + Math.sin(th) * r[2] * k, r[0]]; };
  return (i, th, f) => { const a = W(i, th); if (!f || i + 1 >= rings.length) return a; const b = W(i + 1, th); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f)]; };
};
RJ.rock = function (g, x, y, rings, o) {
  o = o || {}; const N = 40, seed = o.seed || 1;
  const col = o.col || RP.granite, dk = o.dark || shade(col, 0.2), lt = o.light || shade(col, -0.25);
  const W = RJ.rockW(x, y, rings, o);
  const S = (i, th) => g.p.apply(g, W(i, th));
  const n = rings.length, L = [], R = [], TL = [], TR = [];
  for (let i = 0; i < n; i++) {
    let lo = null, hi = null;
    for (let k = 0; k < N; k++) { const p = S(i, TAU * k / N); if (!lo || p[0] < lo[0]) lo = p.concat([TAU * k / N]); if (!hi || p[0] > hi[0]) hi = p.concat([TAU * k / N]); }
    L.push(lo); R.push(hi);
  }
  // the top ring's back arc (from its right extreme over the far side to its left extreme)
  const top = n - 1, aR = R[top][2], aL = L[top][2], back = [];
  let a1 = aL; while (a1 < aR) a1 += TAU;
  for (let k = 0; k <= 16; k++) back.push(S(top, lerp(aR, a1, k / 16) % TAU));
  // the bottom ring's front arc (left extreme down round the front to the right extreme)
  const front = []; let b0 = L[0][2], b1 = R[0][2]; while (b1 > b0) b1 -= TAU;
  for (let k = 0; k <= 20; k++) front.push(S(0, lerp(b0, b1, k / 20)));
  const sil = [];
  for (let i = 0; i < n; i++) sil.push([L[i][0], L[i][1]]);
  for (const p of back.slice().reverse()) sil.push(p);
  for (let i = n - 1; i >= 0; i--) sil.push([R[i][0], R[i][1]]);
  for (const p of front.slice().reverse()) sil.push(p);
  const TH = 0.42, sh = [];
  for (let i = 0; i < n; i++) sh.push(S(i, TH));
  for (let i = n - 1; i >= 0; i--) sh.push([R[i][0], R[i][1]]);
  const li = []; for (let i = 0; i < n; i++) li.push(S(i, 2.05)); for (let i = n - 1; i >= 0; i--) li.push(S(i, 1.55));
  const R0 = RNG(seed * 31 + 7);
  const streaks = (th0, th1, ia, ib, cnt) => {
    const st = [];
    for (let s = 0; s < cnt; s++) {
      const th = lerp(th0, th1, R0()), i0 = Math.floor(lerp(ia + 1, ib, R0())), len = 1 + Math.floor(R0() * 3);
      for (let i = i0; i > Math.max(ia, i0 - len); i--) { const a = S(i, th), b = S(i - 1, th + (R0() - 0.5) * 0.06); st.push(a[0], a[1], b[0], b[1]); }
    }
    g.segs2(st, shade(col, 0.32), 0.45);
  };
  if (o.forest) {
    // a forested mountain: the whole body in canopy green, the steep faces left as bare granite with rain streaks
    const fc = o.forest === true ? RP.forest : o.forest;
    g.fill2(sil, fc); g.fill2(sh, shade(fc, 0.18)); g.fill2(li, shade(fc, -0.16));
    for (const [th0, th1, ia, ib] of (o.bare || [])) {
      const poly = []; for (let i = ia; i <= ib; i++) poly.push(S(i, th0)); for (let i = ib; i >= ia; i--) poly.push(S(i, th1 + (i % 2 ? 0.05 : -0.04)));
      g.fill2(poly, th1 <= TH + 0.2 ? dk : col);
      const lit = []; for (let i = ia; i <= ib; i++) lit.push(S(i, Math.max(th0, Math.min(th1, TH)))); for (let i = ib; i >= ia; i--) lit.push(S(i, th1));
      if (th1 > TH) g.fill2(lit, col);
      streaks(th0, th1, ia, ib, Math.round((th1 - th0) * (ib - ia) * 4));
      g.line2(poly.slice(0, ib - ia + 1), { w: 0.45, c: shade(fc, 0.4), boil: false, wob: 0.5 });
    }
    // the canopy: little crowns and C-marks all over the green
    const RV = RNG(seed * 13 + 1), cm = [], cl = [];
    for (let k = 0; k < (o.canopy || 160); k++) {
      const th = lerp(-0.72, 2.3, RV()), fi = RV() * (n - 1.2), i = Math.floor(fi);
      if ((o.bare || []).some(([a, b, ia, ib]) => th > a - 0.05 && th < b + 0.05 && fi > ia - 0.3 && fi < ib)) continue;
      const p = g.p.apply(g, W(i, th, fi - i)), r = 1.8 + RV() * 2.2;
      cl.push([p, r, th < TH ? shade(fc, 0.24) : th > 1.6 ? shade(fc, -0.2) : shade(fc, RV() < 0.5 ? 0.12 : -0.12)]);
      cm.push(p[0] - r * 0.8, p[1] - r * 0.1, p[0] - r * 0.2, p[1] - r * 0.75, p[0] - r * 0.2, p[1] - r * 0.75, p[0] + r * 0.6, p[1] - r * 0.4);
    }
    cl.sort((a, b) => a[0][1] - b[0][1]);
    for (const [p, r, c] of cl) { g.fill2(arcPts(p[0], p[1], r, Math.PI, TAU, 7).concat([[p[0] + r, p[1] + r * 0.35], [p[0] - r, p[1] + r * 0.35]]), c); g.fill2(arcPts(p[0] - r * 0.25, p[1] - r * 0.25, r * 0.5, Math.PI, TAU, 5), shade(c, -0.16)); }
    g.segs2(cm, RP.forestD, 0.4);
  } else {
    g.fill2(sil, col);
    g.fill2(sh, dk);
    g.fill2(li, lt);
    streaks(-0.6, 2.3, Math.floor((n - 1) * 0.35), n - 1, o.streaks == null ? 26 : o.streaks);
  }
  // forest: clusters of leafy clumps scattered over the visible face in the given height band (not in rows)
  if (o.veg) {
    const [z0, z1, dens] = o.veg, RV = RNG(seed * 17 + 3), fc = o.vegCol || RP.forest;
    const Sf = (fi, th) => { const i = clamp(Math.floor(fi), 0, n - 1); return g.p.apply(g, W(i, th, fi - i)); };
    const zi = (z) => { for (let i = 0; i < n - 1; i++) if (z <= rings[i + 1][0]) return i + (z - rings[i][0]) / (rings[i + 1][0] - rings[i][0]); return n - 1; };
    const i0 = zi(z0), i1 = zi(z1), nc = Math.round((dens || 1) * (6 + rings[0][1] * 0.9));
    for (let c = 0; c < nc; c++) {
      const fi = lerp(i0, i1, Math.pow(RV(), 0.8)), th = lerp(o.vegTh ? o.vegTh[0] : -0.7, o.vegTh ? o.vegTh[1] : 2.3, RV()), m = 3 + Math.floor(RV() * 4);
      for (let k = 0; k < m; k++) {
        const th2 = th + (RV() - 0.5) * 0.5, f2 = clamp(fi + (RV() - 0.5) * 0.9, i0, i1), p = Sf(f2, th2), r = 2.0 + RV() * 2.6;
        const col = th2 < TH ? shade(fc, 0.14) : th2 > 1.7 ? shade(fc, -0.16) : (RV() < 0.3 ? shade(fc, -0.08) : fc);
        const pts = []; for (let q = 0; q < 10; q++) { const a = TAU * q / 10, rr = r * (0.7 + 0.5 * vnoise(q * 0.9 + c * 3.1 + k, seed + 9) * 0.5 + 0.25 * RV()); pts.push([p[0] + Math.cos(a) * rr, p[1] - r * 0.3 + Math.sin(a) * rr * 0.72]); }
        g.fill2(pts, col);
        if (RV() < 0.35) g.line2(pts.slice(5).concat([pts[0]]), { w: 0.35, c: RP.forestD, boil: false, wob: 0.4 });
      }
    }
    const marks = []; for (let k = 0; k < 30 * (dens || 1); k++) { const p = Sf(lerp(i0, i1, RV()), lerp(-0.6, 2.2, RV())); marks.push(p[0], p[1], p[0] + 1.2, p[1] - 0.9); }
    g.segs2(marks, RP.forestD, 0.45);
  }
  if (o.extra) o.extra(g, S);
  const ink = o.ink || '#4A4339';
  g.line2(L.map((p) => [p[0], p[1]]), { w: 1, c: ink, boil: false });
  g.line2(R.map((p) => [p[0], p[1]]), { w: 1, c: ink, boil: false });
  g.line2(back, { w: 0.9, c: ink, boil: false });
  g.line2(front, { w: 0.7, c: ink, boil: false });
  return { S, W, top: rings[top][0] };
};

/* ---------------- pavements ---------------- */
/* Portuguese stone: a sparse lattice of black motifs (small diamonds and crosses) on pale limestone (wide px marks) */
RJ.mosaic = function (g, x0, y0, x1, y1, o) {
  // plain pale stone: only a few faint, sparse joint lines (the patterned calçada is kept for the famous places)
  o = o || {}; const sp = (o.sp || 3) * 3.2, seg = [];
  for (let x = x0 + sp / 2; x < x1; x += sp) for (let y = y0 + sp / 2; y < y1; y += sp) {
    if (o.skip && o.skip(x, y)) continue;
    const h = h2(Math.round(x * 7), Math.round(y * 7)); if (h > 0.35) continue;
    const a = g.p(x, y, 0), b = h < 0.17 ? g.p(x + sp * 0.4, y, 0) : g.p(x, y + sp * 0.4, 0); seg.push(a[0], a[1], b[0], b[1]);
  }
  g.segs2(seg, o.joint || '#DCD5C6', 0.35);
};
/* Ipanema's calçada: black waves running out towards the sea (bands along x, wavy along y) */
RJ.wavesX = function (g, x0, x1, y0, y1, o) {
  o = o || {}; const lam = o.lam || 7, amp = o.amp || 1.0, bw = o.bw || 1.1, gap = o.gap || 2.6;
  g.fill(K.rect(x0, y0, x1, y1), '#F3F0E7');
  for (let c = y0 + 0.6; c < y1 - 0.3; c += gap) {
    const A = [], B = [];
    for (let x = x0; x <= x1 + 0.01; x += lam / 10) { const sn = Math.sin((x / lam) * TAU); A.push([x, clamp(c + sn * amp, y0, y1), 0]); B.push([x, clamp(c + bw + sn * amp, y0, y1), 0]); }
    g.fill(A.concat(B.reverse()), o.col || '#2E2A26');
  }
};
/* Burle Marx's wave: black bands with sinuous edges running along y over a white strip from x0 to x1 */
RJ.waves = function (g, x0, x1, y0, y1, o) {
  o = o || {}; const lam = o.lam || 6.4, amp = o.amp || 1.15, bw = o.bw || 1.05, gap = o.gap || 2.55, col = o.col || '#2E2A26';
  g.fill(K.rect(x0, y0, x1, y1), o.white || '#F3F0E7');
  for (let c = x0 + gap * 0.6; c < x1 - 0.3; c += gap) {
    const A = [], B = [];
    for (let y = y0; y <= y1 + 0.01; y += lam / 10) {
      const s = Math.sin((y / lam) * TAU), u = clamp(c + s * amp, x0, x1), v = clamp(c + bw + s * amp, x0, x1);
      A.push([u, y, 0]); B.push([v, y, 0]);
    }
    g.fill(A.concat(B.reverse()), col);
  }
};

/* ---------------- beach things ---------------- */
/* a beach umbrella (barraca): a pole and a canopy of alternating panels at h */
RJ.umbrella2 = function (g, f, a, b, o) {
  o = o || {}; const h = (o.h || 5.4) * VZ, r = (o.r || 2.9) * 3.3, t = [f[0], f[1] - h], n = 8, ry = r * 0.42, dome = r * 0.22;
  g.segs2([f[0], f[1], t[0], t[1] - dome * 0.6], '#7A6A55', 0.45);
  const rim = (k) => { const an = TAU * k / n; return [t[0] + Math.cos(an) * r, t[1] + Math.sin(an) * ry]; };
  const apex = [t[0], t[1] - dome];
  // the panels: the far ones first (upper half of the rim), each a wedge from the apex to the rim, alternating colours
  const order = []; for (let k = 0; k < n; k++) order.push(k); order.sort((p, q) => Math.sin(TAU * (p + 0.5) / n) - Math.sin(TAU * (q + 0.5) / n));
  for (const k of order) { const p0 = rim(k), p1 = rim(k + 1), mid = TAU * (k + 0.5) / n, lit = Math.cos(mid) < 0.2; g.fill2([apex, p0, [ (p0[0] + p1[0]) / 2 + Math.cos(mid) * r * 0.06, (p0[1] + p1[1]) / 2 + Math.sin(mid) * ry * 0.06], p1], k % 2 ? (lit ? b : shade(b, 0.1)) : (lit ? a : shade(a, 0.12)), true); }
  // the valance hanging from the near rim
  const vl = []; for (let k = 0; k <= 8; k++) { const an = lerp(0, Math.PI, k / 8); vl.push([t[0] + Math.cos(an) * r, t[1] + Math.sin(an) * ry]); }
  g.fill2(vl.concat(vl.slice().reverse().map((p) => [p[0], p[1] + 1.1])), shade(a, 0.18), true);
  const ol = []; for (let k = 0; k <= 16; k++) ol.push(rim(k / 2));
  g.line2(ol, { w: 0.4, c: shade(a, 0.5), boil: false });
  g.disc2(apex, 0.5, shade(a, 0.4));
};
/* a low folding beach chair facing lower-right (face 'R') or lower-left; returns the seat height */
RJ.chair2 = function (g, f, col, face) {
  const s = face === 'L' ? -1 : 1, q = (u, v) => [f[0] + s * u, f[1] + v];
  g.segs2([q(-1.8, 0)[0], q(-1.8, 0)[1], q(-1.4, -4.2)[0], q(-1.4, -4.2)[1], q(1.6, 0)[0], q(1.6, 0)[1], q(1.3, -4.0)[0], q(1.3, -4.0)[1], q(-1.4, -4.2)[0], q(-1.4, -4.2)[1], q(-2.2, -8.6)[0], q(-2.2, -8.6)[1]], '#8A8580', 0.4);
  g.fill2([q(-2.0, -4.6), q(1.6, -4.4), q(1.7, -3.7), q(-1.9, -3.9)], col, true);
  g.fill2([q(-2.4, -4.4), q(-1.7, -4.4), q(-2.2, -8.8), q(-2.9, -8.8)], shade(col, 0.12), true);
  return 1.2;
};
/* coconut palm on the sand or a pavement */
RJ.coco = function (g, x, y, o) { K.palm(g, x, y, Object.assign({ h: 13, r: 4.4 }, o || {})); };
/* imperial palm: a tall smooth grey column, a green crownshaft, a tight head of arching fronds */
RJ.imperial = function (g, x, y, o) {
  o = o || {}; const f = g.p(x, y, o.z || 0), h = (o.h || 20) * VZ, top = [f[0], f[1] - h], R = RNG(Math.round(x * 17 + y * 29 + 3));
  g.fill2([[f[0] - 1.3, f[1]], [f[0] + 1.3, f[1]], [f[0] + 1.05, f[1] - h * 0.3], [top[0] + 0.8, top[1] + 9], [top[0] - 0.8, top[1] + 9], [f[0] - 1.05, f[1] - h * 0.3]], '#CFCBC0');
  g.fill2([[f[0] + 0.2, f[1]], [f[0] + 1.3, f[1]], [f[0] + 1.05, f[1] - h * 0.3], [top[0] + 0.8, top[1] + 9], [top[0] + 0.15, top[1] + 9]], '#B7B2A6');
  g.line2([[f[0] - 1.3, f[1]], [top[0] - 0.8, top[1] + 9]], { w: 0.5, c: '#6E695E', boil: false }); g.line2([[f[0] + 1.3, f[1]], [top[0] + 0.8, top[1] + 9]], { w: 0.5, c: '#6E695E', boil: false });
  g.fill2([[top[0] - 0.85, top[1] + 9], [top[0] + 0.85, top[1] + 9], [top[0] + 0.7, top[1] + 1], [top[0] - 0.7, top[1] + 1]], '#7FA45A');
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI * 0.98 + Math.PI * 0.96 * i / 8 + (R() - 0.5) * 0.15, L = 13 + R() * 4, ex = top[0] + Math.cos(a) * L, ey = top[1] + Math.sin(a) * L * 0.5 + L * 0.55 * Math.abs(Math.cos(a)) + 2;
    const mx = top[0] + Math.cos(a) * L * 0.5, my = top[1] + Math.sin(a) * L * 0.5 - 2.2;
    g.fill2([[top[0], top[1] + 1], [mx - 0.6, my - 0.8], [ex, ey], [mx + 0.6, my + 1.6]], i % 2 ? '#6E9C4C' : '#86B35E');
    g.line2([[top[0], top[1] + 1], [mx, my], [ex, ey]], { w: 0.45, c: '#46682F', boil: false });
  }
};
/* a lifeguard post (posto): a white cabin on stilts with its number, a flag; drawn at ground point (x, y) */
RJ.posto = function (g, x, y, num, o) {
  o = o || {}; const z = 5;
  const legs = []; for (const [dx, dy] of [[-1.5, -1.5], [1.5, -1.5], [1.5, 1.5], [-1.5, 1.5]]) { const a = g.p(x + dx, y + dy, 0), b = g.p(x + dx, y + dy, z); legs.push(a[0], a[1], b[0], b[1]); }
  g.segs2(legs, '#6E6A60', 0.6);
  K.box(g, x - 2, y - 2, x + 2, y + 2, z, z + 3.4, { t: '#E9E6DC', l: '#F5F3EC', r: '#DDD8CC' }, { w: 0.6 });
  g.fill(K.on('R', x + 2.02, y - 1.4, y + 1.4, z + 1.4, z + 2.8), '#5F8FA8');
  g.fill(K.on('L', y + 2.02, x - 1.6, x + 1.6, z + 0.25, z + 1.15), '#D9463B');
  K.text(g, 'L', y + 2.06, x, z + 0.33, 0.62, 'POSTO ' + num, '#F6F3EA', { center: true, w: 0.42 });
  K.box(g, x - 2.5, y - 2.5, x + 2.5, y + 2.5, z + 3.4, z + 3.9, '#D9463B', { w: 0.5 });
};
/* a kiosk on the calçadão: a glass box with a curved roof and a sign, tables round it */
RJ.kiosk = function (g, x, y, word, col) {
  col = col || '#2A8C7A';
  K.box(g, x - 2.2, y - 2.6, x + 2.2, y + 2.6, 0, 4.2, { t: '#E9E6DC', l: '#CFE0E6', r: '#B4C9D2' }, { w: 0.7 });
  for (const [f, p, a0, a1] of [['L', y + 2.6, x - 2.2, x + 2.2], ['R', x + 2.2, y - 2.6, y + 2.6]]) for (let a = a0 + 1.1; a < a1; a += 1.1) g.line([K.pt(f, p + 0.03, a, 0.2), K.pt(f, p + 0.03, a, 4.1)], { w: 0.3, c: '#7E97A3', boil: false });
  g.fill(K.on('R', x + 2.23, y - 1.6, y + 1.6, 1.0, 2.2), '#EFE6CF');
  K.box(g, x - 2.8, y - 3.2, x + 2.8, y + 3.2, 4.2, 4.9, col, { w: 0.6 });
  K.text(g, 'R', x + 2.84, y, 4.3, 0.5, word, '#F6F3EA', { center: true, w: 0.4 });
};
/* a café table with an umbrella (wide px at ground point f) */
RJ.table2 = function (g, f, a, b) {
  g.fill2(arcPts(f[0], f[1] - 4.2, 2.6, 0, TAU, 10).map((q) => [q[0], f[1] - 4.2 + (q[1] - f[1] + 4.2) * 0.45]), '#F1EFE8', true);
  g.segs2([f[0], f[1], f[0], f[1] - 4.2], '#6E6A60', 0.45);
  if (a) RJ.umbrella2(g, f, a, b, { h: 6.4, r: 3.3 });
};

/* ---------------- houses ---------------- */
/* a favela house on a slope: brick or painted, small dark windows, a door, a flat laje with a blue water tank,
   rebar for the next floor, sometimes laundry. (x0..x1, y0..y1) footprint, from z0 to z1. */
RJ.house = function (g, x0, y0, x1, y1, z0, z1, seed, o) {
  o = o || {}; const R = RNG(seed * 131 + 17), brick = o.brick == null ? R() < 0.42 : o.brick;
  const PAINT = ['#E9A23B', '#E86A9A', '#4F9BD1', '#7DBF6A', '#F2D24B', '#E5734A', '#9B7FC9', '#F3EFE4', '#5FC0B0', '#F0B9A0', '#D9463B'];
  const col = o.col || (brick ? '#C46A47' : R.pick(PAINT));
  K.box(g, x0, y0, x1, y1, z0, z1, col, { w: 0.6, c: shade(col, 0.55) });
  if (brick) {   // mortar courses on the two visible faces
    const seg = [];
    for (let z = z0 + 0.55; z < z1 - 0.1; z += 0.55) for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) { const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z)); seg.push(a[0], a[1], b[0], b[1]); }
    g.segs2(seg, '#A9573A', 0.22);
  }
  const fl = 3.0, nf = Math.max(1, Math.round((z1 - z0 - 0.4) / fl));
  for (let k = 0; k < nf; k++) {
    const zb = z0 + 0.4 + k * fl;
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
      const w = a1 - a0; if (w < 2) continue;
      const n = Math.max(1, Math.floor(w / 2.6));
      for (let i = 0; i < n; i++) {
        const c = a0 + w * (i + 0.5) / n;
        if (k === 0 && i === 0 && f === (o.doorFace || 'L')) { const d = K.on(f, p + 0.03, c - 0.55, c + 0.55, zb - 0.4, zb + 2.2); g.fill(d, R.pick(['#3F5F8F', '#2F6B4F', '#8A4A2E', '#5A5A5E'])); continue; }
        const q = K.on(f, p + 0.03, c - 0.5, c + 0.5, zb + 0.9, zb + 1.9); g.fill(q, R() < 0.3 ? '#E9E2D0' : '#3A3530');
        if (R() < 0.35) g.fill(K.on(f, p + 0.05, c - 0.62, c + 0.62, zb + 0.75, zb + 0.9), shade(col, 0.3));
      }
    }
  }
  // the laje: a parapet lip, a blue water tank, rebar sticking up for the next floor
  g.fill(K.rect(x0, y0, x1, y1, z1), shade(col, -0.3));
  g.fill(K.rect(x0 + 0.2, y0 + 0.2, x1 - 0.2, y1 - 0.2, z1 + 0.01), '#CFC9BC');
  if (o.tank !== false && R() < 0.85) { const tx = lerp(x0 + 1, x1 - 1, R()), ty = lerp(y0 + 1, y0 + 2, R()); K.cyl(g, tx, ty, 0.85, z1, z1 + 1.15, { t: '#5E9AD6', l: '#3E7FC1', r: '#2F6AA6' }, { w: 0.45, n: 10 }); }
  if (R() < 0.5) { const reb = []; for (const [px, py] of [[x0 + 0.3, y1 - 0.3], [x1 - 0.3, y1 - 0.3], [x1 - 0.3, y0 + 0.3]]) { const a = g.p(px, py, z1), b = g.p(px, py, z1 + 1.6); reb.push(a[0], a[1], b[0], b[1]); } g.segs2(reb, '#6B4E3A', 0.35); }
  if (o.laundry || R() < 0.25) { const a = g.p(x0 + 0.6, y1 - 0.8, z1 + 1.5), b = g.p(x1 - 0.6, y1 - 0.8, z1 + 1.5); g.fine2([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.6], b], { w: 0.2, c: '#5A564E' }); for (let i = 1; i < 4; i++) { const t = i / 4, c = [lerp(a[0], b[0], t), lerp(a[1], b[1], t) + 0.5]; g.fill2([[c[0] - 0.9, c[1]], [c[0] + 0.9, c[1]], [c[0] + 0.8, c[1] + 2.2], [c[0] - 0.8, c[1] + 2.2]], R.pick(['#F3F1EA', '#E86A9A', '#4F9BD1', '#F2D24B', '#7DBF6A']), true); } }
};
/* a colonial two-storey front (Lapa, Santa Teresa): tall doors below, French windows with iron balconies above,
   a cornice and a tiled roof edge. On face f ('L' plane y = p, 'R' plane x = p) from a0 to a1, z0..z1 */
RJ.colonial = function (g, f, p, a0, a1, z0, z1, col, seed, o) {
  o = o || {}; const R = RNG(seed * 71 + 5), w = a1 - a0, n = Math.max(1, Math.round(w / 2.8)), h = z1 - z0;
  for (let i = 0; i < n; i++) {
    const c = a0 + w * (i + 0.5) / n;
    const d = K.on(f, p + 0.03, c - 0.7, c + 0.7, z0, z0 + h * 0.42); g.fill(d, i % 2 ? '#3F6B5A' : shade(col, 0.5));
    g.fill(K.on(f, p + 0.04, c - 0.7, c + 0.7, z0 + h * 0.42, z0 + h * 0.47), shade(col, -0.25));
    const wq = K.on(f, p + 0.03, c - 0.6, c + 0.6, z0 + h * 0.56, z0 + h * 0.86); g.fill(wq, R() < 0.5 ? '#3F6B5A' : '#E9E2D0');
    g.outline(wq, { w: 0.25, c: '#F3EFE4', boil: false });
    const b0 = K.pt(f, p + 0.6, c - 0.85, z0 + h * 0.62), b1 = K.pt(f, p + 0.6, c + 0.85, z0 + h * 0.62), b2 = K.pt(f, p + 0.6, c + 0.85, z0 + h * 0.54), b3 = K.pt(f, p + 0.6, c - 0.85, z0 + h * 0.54);
    g.fine([b3, b0, b1, b2], { w: 0.3, c: '#2F2B27' });
    const bal = []; for (let k = 0; k <= 4; k++) { const q0 = g.p.apply(g, K.pt(f, p + 0.6, c - 0.85 + 1.7 * k / 4, z0 + h * 0.54)), q1 = g.p.apply(g, K.pt(f, p + 0.6, c - 0.85 + 1.7 * k / 4, z0 + h * 0.62)); bal.push(q0[0], q0[1], q1[0], q1[1]); }
    g.segs2(bal, '#2F2B27', 0.22);
  }
  g.fill(K.on(f, p + 0.08, a0, a1, z1 - h * 0.08, z1), shade(col, -0.3));
  g.line([K.pt(f, p + 0.1, a0, z1 - h * 0.08), K.pt(f, p + 0.1, a1, z1 - h * 0.08)], { w: 0.4, c: shade(col, 0.45), boil: false });
  void o;
};
/* an apartment block with balcony slabs on its two visible faces (Copacabana, Ipanema) */
RJ.block = function (g, x0, y0, x1, y1, z1, col, seed, o) {
  o = o || {}; const R = RNG(seed * 53 + 9), gf = o.gf || 4, fl = o.fl || 2.6;
  K.box(g, x0, y0, x1, y1, 0, z1, col, { w: 0.85 });
  // the ground floor: shopfronts / lobby glass
  for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
    g.fill(K.on(f, p + 0.03, a0 + 0.4, a1 - 0.4, 0.3, gf - 0.5), '#9FB9C4');
    for (let a = a0 + 2.2; a < a1 - 0.5; a += 2.2) g.line([K.pt(f, p + 0.05, a, 0.3), K.pt(f, p + 0.05, a, gf - 0.5)], { w: 0.3, c: '#5E7480', boil: false });
    if (o.shops && f === o.shops.face) { const words = o.shops.words; const n = words.length; for (let i = 0; i < n; i++) { const b0 = lerp(a0 + 0.6, a1 - 0.6, i / n), b1 = lerp(a0 + 0.6, a1 - 0.6, (i + 1) / n) - 0.4; K.sign(g, f, p + 0.06, b0, b1, gf - 1.4, gf - 0.3, o.shops.cols[i % o.shops.cols.length], words[i]); } }
  }
  // floors: windows and balcony slabs with railings
  const seg = [], rail = [];
  for (let z = gf; z < z1 - 1; z += fl) {
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
      const n = Math.max(1, Math.floor((a1 - a0) / 3.2));
      for (let i = 0; i < n; i++) {
        const c = a0 + (a1 - a0) * (i + 0.5) / n;
        g.fill(K.on(f, p + 0.03, c - 1.05, c + 1.05, z + 0.5, z + 2.0), R() < 0.2 ? '#E9E2D0' : '#5E7480');
        if (o.balc !== false) {
          const out = 0.9, bq = f === 'L' ? [[c - 1.4, p, z + 0.2], [c + 1.4, p, z + 0.2], [c + 1.4, p + out, z + 0.2], [c - 1.4, p + out, z + 0.2]] : [[p, c - 1.4, z + 0.2], [p, c + 1.4, z + 0.2], [p + out, c + 1.4, z + 0.2], [p + out, c - 1.4, z + 0.2]];
          g.fill(bq, shade(col, -0.2));
          const r0 = g.p.apply(g, f === 'L' ? [c - 1.4, p + out, z + 0.2] : [p + out, c - 1.4, z + 0.2]), r1 = g.p.apply(g, f === 'L' ? [c + 1.4, p + out, z + 0.2] : [p + out, c + 1.4, z + 0.2]);
          const r2 = g.p.apply(g, f === 'L' ? [c - 1.4, p + out, z + 1.2] : [p + out, c - 1.4, z + 1.2]), r3 = g.p.apply(g, f === 'L' ? [c + 1.4, p + out, z + 1.2] : [p + out, c + 1.4, z + 1.2]);
          rail.push(r2[0], r2[1], r3[0], r3[1], r0[0], r0[1], r1[0], r1[1]);
          g.fill2([r0, r1, r3, r2], 'rgba(220,232,236,0.55)');
        }
      }
      const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z)); seg.push(a[0], a[1], b[0], b[1]);
    }
  }
  g.segs2(seg, shade(col, 0.25), 0.3); g.segs2(rail, '#4A4540', 0.3);
  // roof: a parapet, a water tank house, sometimes a little pool
  K.box(g, x0 + 1, y0 + 1, x0 + 4, y0 + 3.5, z1, z1 + 2.2, shade(col, 0.05), { w: 0.5 });
  if (o.pool) { const q = K.rect(x1 - 6, y1 - 5, x1 - 1.5, y1 - 1.5, z1 + 0.02); g.fill(q, '#7FC8D6'); g.outline(q, { w: 0.4, c: '#4F8FA0', boil: false }); }
};

/* ---------------- people ---------------- */
const RJ_TOPS = ['#F3F1EA', '#F2C230', '#2F6DB5', '#3A9A5B', '#E86A9A', '#D9463B', '#EE8A2E', '#5FC0B0', '#9B7FC9', '#2A2622', '#7FB7D9', '#F0B9A0', '#E9E2CC', '#4FA7D8'];
const RJ_BOTS = ['#3F4D63', '#2F343B', '#E9E2CC', '#5A86B5', '#2A2622', '#C9584B', '#3A9A5B', '#8FA3B5', '#F3F1EA'];
const RJ_SKIN = ['#F2D3B8', '#E8BE9A', '#D9A57B', '#C08A5E', '#A06B45', '#8A5A3A', '#7A4E33', '#5F3D2A'];
/* a carioca from a seed. o.beach: beachwear (bikini or trunks, bare feet or havaianas). Some wear a bit of Carnival. */
RJ.who = function (seed, o) {
  o = o || {}; const R = RNG(seed * 6113 + 29), w = K.who(seed);
  w.skin = R.pick(RJ_SKIN); w.hair = R() < 0.8 ? R.pick(['#2B2420', '#3D2B1F', '#2B2420', '#5A3A24', '#1F1A16']) : R.pick(HAIR);
  w.hairStyle = R.pick(['short', 'buzz', 'curly', 'curly', 'long', 'pony', 'bun', 'bob', 'short']);
  w.top = R.pick(RJ_TOPS); w.bot = R.pick(RJ_BOTS); w.bare = R() < 0.85; w.cap = undefined; w.shorts = R() < 0.45;
  w.shoe = R.pick(['#F3F1EA', '#2A2622', '#F2C230', '#2F6DB5', '#3A9A5B', '#E86A9A']);
  w.glasses = R() < 0.12; w.dress = undefined;
  const fem = R() < 0.5; w.fem = fem;
  if (fem && R() < 0.3) w.dress = R.pick(['#F2C230', '#E86A9A', '#F3F1EA', '#5FC0B0', '#D9463B', '#2F6DB5', '#EE8A2E']);
  if (fem && (w.hairStyle === 'buzz' || w.hairStyle === 'short') && R() < 0.7) w.hairStyle = R.pick(['long', 'curly', 'bun']);
  if (!fem && (w.hairStyle === 'long' || w.hairStyle === 'bob')) w.hairStyle = 'short';
  if (!fem && R() < 0.2) w.beard = true; else w.beard = false;
  if (R() < 0.12) w.cap = R.pick(['#F3F1EA', '#2F6DB5', '#3A9A5B', '#2A2622', '#F2C230']);
  // a touch of Carnival: glitter, a flower crown, a sailor hat, fairy wings, a tutu, devil horns
  const c = R();
  if (o.carnaval !== false) {
    if (c < 0.12) w.flor = R.pick(['#E86A9A', '#F2C230', '#D9463B', '#9B7FC9']);
    else if (c < 0.2) w.marin = true;
    else if (c < 0.26) w.chifre = true;
    else if (c < 0.31 && fem) { w.asas = R.pick(['#BFE3EE', '#F3D3E6', '#F3EFC4']); }
    if (R() < 0.3) w.glitter = R.pick(['#F2C230', '#E86A9A', '#7FD3E0', '#C9B6F2']);
  }
  if (o.beach) RJ.beachwear(w, R);
  return Object.assign(w, o.set || {});
};
RJ.beachwear = function (w, R) {
  w.dress = undefined; w.top = w.skin; w.bare = true; w.shorts = true; w.cap = R() < 0.15 ? R.pick(['#F3F1EA', '#2F6DB5']) : undefined;
  w.shoe = R() < 0.5 ? w.skin : R.pick(['#F2C230', '#2F6DB5', '#3A9A5B', '#F3F1EA']);
  if (w.fem) { w.bikini = R.pick(['#E86A9A', '#F2C230', '#2F6DB5', '#D9463B', '#3A9A5B', '#2A2622', '#EE8A2E', '#5FC0B0']); w.bot = w.skin; }
  else { w.bot = R.pick(['#2F6DB5', '#D9463B', '#2A2622', '#3A9A5B', '#F2C230', '#E86A9A', '#1F3F6F']); w.sunga = true; }
  w.glitter = undefined; w.marin = false; w.asas = undefined; w.chifre = false;
};
/* the head and shoulders positions of a standing figure before it is drawn (for things behind it: wings, feathers) */
RJ.frame = function (g, x, y, z, w) {
  const k = w.k || 1, F = g.p(x, y, z || 0), pose = w.pose || 'stand', hipV = pose === 'sit' ? -4.4 : pose === 'crouch' ? -7.3 : pose === 'kneel' ? -5.6 : -10;
  return { F, k, head: [F[0], F[1] + (hipV - 8.85) * k], sh: [F[0], F[1] + (hipV - 4.6) * k], hip: [F[0], F[1] + hipV * k], back: (w.dir | 0) >= 2 };
};
/* feathers in a fan (wide px): centre c, radius r, from angle a0 to a1 (screen radians, up = -PI/2) */
RJ.fan2 = function (g, c, r, a0, a1, n, cols, o) {
  o = o || {};
  for (let i = 0; i < n; i++) {
    const a = lerp(a0, a1, n === 1 ? 0.5 : i / (n - 1)), col = cols[i % cols.length], e = [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r], m = [c[0] + Math.cos(a) * r * 0.55, c[1] + Math.sin(a) * r * 0.55];
    const nx = -Math.sin(a), ny = Math.cos(a), wd = r * (o.wd || 0.13);
    g.fill2([c, [m[0] + nx * wd, m[1] + ny * wd], e, [m[0] - nx * wd, m[1] - ny * wd]], col, true);
    if (r > 6) g.segs2([c[0], c[1], e[0], e[1]], shade(col, 0.35), 0.22);
  }
};
RJ.person = function (g, x, y, z, w) {
  const fr = RJ.frame(g, x, y, z, w), k = fr.k;
  // behind the body (when facing us): fairy wings, a feather backpiece
  const behind = () => {
    if (w.asas) { const s = fr.sh; for (const sd of [-1, 1]) { const pts = [[s[0], s[1] + 1], [s[0] + sd * 6 * k, s[1] - 4 * k], [s[0] + sd * 7.4 * k, s[1] + 1 * k], [s[0] + sd * 5 * k, s[1] + 4.5 * k]]; g.fill2(pts, w.asas, true); g.line2(pts, { w: 0.3, c: shade(w.asas, 0.4), close: true, boil: false }); } }
    if (w.plume) RJ.fan2(g, [fr.head[0], fr.head[1] - 1 * k], w.plumeR || 9 * k, -Math.PI * 0.95, -Math.PI * 0.05, w.plumeN || 9, w.plume);
    if (w.costeiro) RJ.fan2(g, [fr.sh[0], fr.sh[1] + 2 * k], w.costeiroR || 13 * k, -Math.PI * 0.98, -Math.PI * 0.02, 13, w.costeiro, { wd: 0.12 });
  };
  if (!fr.back) behind();
  const r = K.person(g, x, y, z, w);
  if (fr.back) behind();
  const hp = r.hip, sp = r.shoulders, cr = r.crown, back = fr.back, sg = ((w.dir | 0) === 0 || (w.dir | 0) === 3) ? 1 : -1;
  if (w.bikini && hp && sp && !back) {
    const my = lerp(sp[0][1], hp[1], 0.32), mx = (sp[0][0] + sp[1][0]) / 2;
    g.fill2([[mx - 2.2 * k, my - 0.6 * k], [mx - 0.2 * k, my - 0.8 * k], [mx - 0.4 * k, my + 0.8 * k], [mx - 2.0 * k, my + 0.7 * k]], w.bikini, true);
    g.fill2([[mx + 0.2 * k, my - 0.8 * k], [mx + 1.9 * k, my - 0.6 * k], [mx + 1.8 * k, my + 0.7 * k], [mx + 0.3 * k, my + 0.8 * k]], shade(w.bikini, 0.1), true);
  }
  if (w.bikini && hp && w.pose !== 'sit') g.fill2([[hp[0] - 2.3 * k, hp[1] - 0.9 * k], [hp[0] + 2.1 * k, hp[1] - 0.9 * k], [hp[0] + 0.5 * k, hp[1] + 1.3 * k], [hp[0] - 0.6 * k, hp[1] + 1.3 * k]], w.bikini, true);
  if (w.dots && sp && hp) { const mx = (sp[0][0] + sp[1][0]) / 2; for (const [u, v] of [[-1.3, 0.25], [0.9, 0.38], [-0.2, 0.62], [1.5, 0.78], [-1.6, 0.85]]) g.disc2([mx + sg * u * k, lerp(sp[0][1], hp[1], v)], 0.5 * k, w.dotCol || '#2A2622'); }
  if (w.sash && sp && hp) { const a = sp[0], b = [hp[0] + sg * 2 * k, hp[1]]; g.line2([a, b], { w: 1.0 * k, c: w.sash, boil: false, ext: 0 }); }
  if (cr) {
    if (w.marin) { g.fill2([[cr[0] - 2.3 * k, cr[1] + 1.6 * k], [cr[0] + 2.3 * k, cr[1] + 1.6 * k], [cr[0] + 1.9 * k, cr[1] - 0.2 * k], [cr[0] - 1.9 * k, cr[1] - 0.2 * k]], '#F6F4EE', true); g.fill2([[cr[0] - 2.4 * k, cr[1] + 1.2 * k], [cr[0] + 2.4 * k, cr[1] + 1.2 * k], [cr[0] + 2.4 * k, cr[1] + 1.8 * k], [cr[0] - 2.4 * k, cr[1] + 1.8 * k]], '#2F4F8F', true); }
    if (w.flor) for (let i = 0; i < 5; i++) g.disc2([cr[0] - 2.0 * k + i * 1.0 * k, cr[1] + 1.2 * k - Math.sin(i / 4 * Math.PI) * 0.5 * k], 0.62 * k, i % 2 ? w.flor : '#F6F3EA');
    if (w.chifre) for (const sd of [-1, 1]) g.fill2([[cr[0] + sd * 1.0 * k, cr[1] + 0.9 * k], [cr[0] + sd * 1.8 * k, cr[1] + 0.7 * k], [cr[0] + sd * 1.7 * k, cr[1] - 1.4 * k]], '#D9302B', true);
    if (w.turban) { g.fill2(arcPts(cr[0], cr[1] + 1.4 * k, 2.4 * k, Math.PI, TAU, 9).concat([[cr[0] + 2.4 * k, cr[1] + 2.0 * k], [cr[0] - 2.4 * k, cr[1] + 2.0 * k]]), w.turban, true); g.disc2([cr[0] + 1.1 * k, cr[1] - 0.2 * k], 0.7 * k, shade(w.turban, 0.15)); }
    if (w.tophat) { g.fill2([[cr[0] - 1.6 * k, cr[1] + 0.9 * k], [cr[0] + 1.6 * k, cr[1] + 0.9 * k], [cr[0] + 1.4 * k, cr[1] - 3.2 * k], [cr[0] - 1.4 * k, cr[1] - 3.2 * k]], w.tophat, true); g.fill2([[cr[0] - 2.6 * k, cr[1] + 0.6 * k], [cr[0] + 2.6 * k, cr[1] + 0.6 * k], [cr[0] + 2.6 * k, cr[1] + 1.2 * k], [cr[0] - 2.6 * k, cr[1] + 1.2 * k]], w.tophat, true); }
    if (w.sunhat) { g.fill2(arcPts(cr[0], cr[1] + 1.8 * k, 3.6 * k, 0, TAU, 12).map((q) => [q[0], cr[1] + 1.8 * k + (q[1] - cr[1] - 1.8 * k) * 0.3]), '#E9D29A', true); g.fill2(arcPts(cr[0], cr[1] + 1.6 * k, 1.9 * k, Math.PI, TAU, 7), '#E2C47F', true); }
    if (w.crown) { g.fill2([[cr[0] - 2.0 * k, cr[1] + 1.2 * k], [cr[0] + 2.0 * k, cr[1] + 1.2 * k], [cr[0] + 2.2 * k, cr[1] - 1.6 * k], [cr[0] + 1.1 * k, cr[1] - 0.4 * k], [cr[0], cr[1] - 2.2 * k], [cr[0] - 1.1 * k, cr[1] - 0.4 * k], [cr[0] - 2.2 * k, cr[1] - 1.6 * k]], w.crown, true); }
    if (w.glitter && !back) { const h = r.head; g.disc2([h[0] - 0.9 * k, h[1] + 0.5 * k], 0.28 * k, w.glitter); g.disc2([h[0] + 1.0 * k, h[1] + 0.4 * k], 0.24 * k, w.glitter); g.disc2([h[0] + 0.1 * k, h[1] - 1.0 * k], 0.22 * k, w.glitter); }
  }
  // things in the hands
  const hd = r.hands;
  if (w.cup && hd) g.fill2([[hd[0][0] - 0.5, hd[0][1] - 1.3], [hd[0][0] + 0.5, hd[0][1] - 1.3], [hd[0][0] + 0.4, hd[0][1] + 0.2], [hd[0][0] - 0.4, hd[0][1] + 0.2]], w.cup, true);
  if (w.phone && hd) g.fill2([[hd[0][0] - 0.5, hd[0][1] - 1.3], [hd[0][0] + 0.5, hd[0][1] - 1.3], [hd[0][0] + 0.5, hd[0][1] + 0.2], [hd[0][0] - 0.5, hd[0][1] + 0.2]], '#2A2622', true);
  if (w.drum && hp && hd) RJ.drum2(g, w.drum, hp, hd, k, sg, w.ph || 0);
  if (w.leque && hd) RJ.fan2(g, hd[1], 3.2 * k, -Math.PI * 0.9, -Math.PI * 0.3, 5, [w.leque]);
  return r;
};
/* drums of the bateria, at the hips / in the hands */
RJ.drum2 = function (g, kind, hp, hd, k, sg, ph) {
  if (kind === 'surdo') {
    const c = [hp[0] + sg * 1.2 * k, hp[1] - 0.6 * k], rx = 2.8 * k, ry = 1.05 * k, H = 3.6 * k;
    g.fill2([[c[0] - rx, c[1]], [c[0] + rx, c[1]], [c[0] + rx, c[1] + H], [c[0] - rx, c[1] + H]], '#C9CDD0', true);
    g.fill2([[c[0] + rx * 0.3, c[1]], [c[0] + rx, c[1]], [c[0] + rx, c[1] + H], [c[0] + rx * 0.3, c[1] + H]], '#A9AEB2', true);
    g.fill2(arcPts(c[0], c[1] + H, rx, 0, Math.PI, 8).map((q) => [q[0], c[1] + H + (q[1] - c[1] - H) * (ry / rx)]), '#A9AEB2', true);
    g.fill2(arcPts(c[0], c[1], rx, 0, TAU, 14).map((q) => [q[0], c[1] + (q[1] - c[1]) * (ry / rx)]), '#F3F0E6', true);
    g.segs2([c[0] - rx, c[1] + H * 0.3, c[0] + rx, c[1] + H * 0.75, c[0] - rx, c[1] + H * 0.75, c[0] + rx, c[1] + H * 0.3], '#7E8488', 0.25);
    const m = hd[0]; g.disc2([m[0], m[1] - 0.9 * k], 0.6 * k, '#E9E2CC');
  } else if (kind === 'caixa') {
    const c = [hp[0] + sg * 1.4 * k, hp[1] - 1.6 * k], rx = 1.9 * k, ry = 0.7 * k, H = 1.4 * k;
    g.fill2([[c[0] - rx, c[1]], [c[0] + rx, c[1]], [c[0] + rx, c[1] + H], [c[0] - rx, c[1] + H]], '#D9463B', true);
    g.fill2(arcPts(c[0], c[1], rx, 0, TAU, 12).map((q) => [q[0], c[1] + (q[1] - c[1]) * (ry / rx)]), '#F3F0E6', true);
    for (const h of hd) g.segs2([h[0], h[1], h[0] + sg * 1.4 * k, h[1] - (ph > 0.5 ? 1.6 : 0.6) * k], '#E9D9B0', 0.3);
  } else if (kind === 'tamborim') {
    const h = hd[1]; g.disc2(h, 1.15 * k, '#F3F0E6'); g.ring2(h, 1.15 * k, { w: 0.3, c: '#5A564E' });
    const s = hd[0]; g.segs2([s[0], s[1], s[0] + sg * 1.2 * k, s[1] - 1.8 * k], '#2A2622', 0.3);
  }
};
/* a crowd bust in a stand (wide px point p = the seat), seen from the front or from behind */
RJ.bust2 = function (g, p, w, k, back) {
  k = k || 1; const s = (u, v) => [p[0] + u * k, p[1] + v * k];
  g.fill2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], w.top, true);
  g.fill2([s(-0.55, -4.6), s(0.55, -4.6), s(0.5, -5.8), s(-0.5, -5.8)], shade(w.skin, 0.12), true);
  g.disc2(s(0, -7.6), 1.95 * k, w.skin);
  if (back) g.disc2(s(0, -7.9), 1.9 * k, w.hair);
  else {
    g.fill2(K.curve([s(-2.05, -7.2), s(-1.9, -8.9), s(0, -9.75), s(1.9, -8.9), s(2.05, -7.3), s(1.2, -8.2), s(-1.0, -8.25)], 2, true), w.hair, true);
    g.disc2(s(-0.6, -7.4), 0.22 * k, '#2A2420'); g.disc2(s(0.65, -7.4), 0.2 * k, '#2A2420');
  }
  g.outline2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], { w: 0.35, c: '#3A3128', boil: false });
};
/* a walker on a closed route, drawn with RJ.person (o.extra(g, st) draws something carried) */
RJ.walker = function (T, who, pts, speed, o) {
  o = o || {}; const seg = [], L = [0];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const total = L[L.length - 1], per = total / speed;
  return T.actor({ sample: o.sample || 0.25, period: per, cast: o.cast, bias: o.bias,
    at(t) {
      let d = (((t * speed + (o.phase || 0) * total) % total) + total) % total, i = 0;
      while (i < seg.length - 1 && d > L[i + 1]) i++;
      const [a, b] = seg[i], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1];
      const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor((d / 2.4) % 1 * 8);
      const x = a[0] + dx * u, y = a[1] + dy * u, z = typeof o.z === 'function' ? o.z(x, y) : (o.z || 0);
      return { x, y, z, key: dir + '.' + ph, dir, ph: ph / 8 };
    },
    draw(g, st) { const r = RJ.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); if (o.extra) o.extra(g, st, r); } });
};
RJ.dirOf = (ca, sa) => (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2);

/* ---------------- vehicles ---------------- */
RJ.car = function (g, ang, o) {
  o = o || {}; const col = o.col || '#C9584B', L = o.L || 4.3, Wd = o.W || 2.1, ca = Math.cos(ang), sa = Math.sin(ang);
  const tone = { t: shade(col, -0.2), l: col, r: shade(col, 0.15) };
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  const wu = [-L * 0.62, L * 0.6];
  K.wheels(g, sh, wu, 0.8, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.6, 2.2, tone, { w: 0.8 });
  for (const f of ['pu', 'nu']) if (B.vis[f]) g.fill(B.quad(f, -1, 1, 0.6, 0.95), shade(col, 0.32));
  if (o.side) o.side(g, B);
  for (const f of ['pv', 'nv']) if (B.vis[f]) { const s = B.quad(f, 0.0, 0.0, 0.75, 2.15); g.line([s[0], s[3]], { w: 0.28, c: shade(col, 0.35), boil: false, ext: 0 }); }
  K.wheels(g, sh, wu, 0.8, 'near', { arch: shade(col, 0.6) });
  K.lights(g, B, 1.25);
  const off = -L * 0.14, cab = K.rbox(g, off * ca, off * sa, L * 0.52, Wd - 0.25, ang, 2.2, 3.6, o.cabTone || tone, { nb: true, w: 0.7 });
  K.rwin(g, cab, 'pv', -0.84, -0.06, 2.35, 3.45); K.rwin(g, cab, 'pv', 0.06, 0.84, 2.35, 3.45);
  K.rwin(g, cab, 'nv', -0.84, -0.06, 2.35, 3.45); K.rwin(g, cab, 'nv', 0.06, 0.84, 2.35, 3.45);
  K.rwin(g, cab, 'pu', -0.8, 0.8, 2.35, 3.45); K.rwin(g, cab, 'nu', -0.8, 0.8, 2.35, 3.45);
  if (o.roof) o.roof(g, cab);
};
/* Rio's taxi: yellow with a blue stripe along the sides and a roof sign */
RJ.taxi = function (g, ang) {
  RJ.car(g, ang, { col: '#F2C230', L: 4.4, W: 2.15,
    side: (gg, B) => { for (const f of ['pv', 'nv']) if (B.vis[f]) gg.fill(B.quad(f, -1, 1, 1.25, 1.65), f === 'pv' ? '#2F6DB5' : '#255A98'); },
    roof: (gg, cab) => { K.rbox(gg, cab.cx, cab.cy, 0.42, 0.95, ang + Math.PI / 2, 3.6, 4.15, { t: '#F6F3EA', l: '#E9E2CC', r: '#CFC8B6' }, { w: 0.4 }); } });
};
RJ.BUSCOLS = [['#F3F1EA', '#2F6DB5'], ['#F2C230', '#2A8C5A'], ['#EE8A2E', '#F3F1EA'], ['#3A9A5B', '#F2C230']];
RJ.bus = function (g, ang, i) { const c = RJ.BUSCOLS[(i || 0) % RJ.BUSCOLS.length]; K.bus(g, ang, { col: c[0], band: c[1], L: 6.6, W: 2.45, h: 5.6, n: 5 }); };
/* the VW Kombi: two-tone box with the V on its nose */
RJ.kombi = function (g, ang, col) {
  col = col || '#3F78B5'; const L = 3.9, Wd = 1.95;
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  const wu = [-L * 0.62, L * 0.62]; K.wheels(g, sh, wu, 0.75, 'far');
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.55, 2.4, { t: shade(col, -0.2), l: col, r: shade(col, 0.15) }, { w: 0.8 });
  const U = K.rbox(g, 0, 0, L, Wd, ang, 2.4, 4.3, { t: '#F3F1EA', l: '#F3F1EA', r: '#DDD8CC' }, { w: 0.8, nb: true });
  for (const f of ['pv', 'nv']) for (let i = 0; i < 4; i++) K.rwin(g, U, f, -0.9 + i * 0.46, -0.9 + i * 0.46 + 0.38, 2.75, 3.95);
  for (const f of ['pu', 'nu']) { if (!B.vis[f]) continue; K.rwin(g, U, f, -0.85, -0.05, 2.75, 3.95); K.rwin(g, U, f, 0.05, 0.85, 2.75, 3.95); const q = B.quad(f, -0.9, 0.9, 2.4, 2.4); const m = B.quad(f, 0, 0, 1.2, 1.2); g.line([q[0], m[0], q[1]], { w: 0.5, c: '#F3F1EA', boil: false, ext: 0 }); }
  K.wheels(g, sh, wu, 0.75, 'near', { arch: shade(col, 0.55) }); K.lights(g, B, 1.3);
};
/* a motorbike (mototaxi: the rider in an orange vest, sometimes a passenger behind) */
RJ.moto = function (g, ang, who, o) {
  o = o || {}; const col = o.col || '#C9392E', ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z);
  const wheel = (u) => { const pts = []; for (let i = 0; i < 14; i++) { const t = TAU * i / 14; pts.push(pt(u + Math.cos(t) * 0.85, 0, 0.85 + Math.sin(t) * 0.85)); } g.fill2(pts, '#3A3632', true); g.disc2(pt(u, 0, 0.85), 0.32, '#B9B4A8'); };
  wheel(-1.8); wheel(1.9);
  const body = [pt(-2.4, 0, 1.6), pt(-0.9, 0, 1.2), pt(0.6, 0, 1.1), pt(1.6, 0, 1.6), pt(1.8, 0, 3.4), pt(1.3, 0, 3.2), pt(0.6, 0, 2.6), pt(-0.6, 0, 2.6), pt(-2.0, 0, 2.5)];
  g.fill2(body, col, true); g.line2(body, { w: 0.45, c: shade(col, 0.55), close: true, boil: false, wob: 0.2 });
  const bar = pt(1.7, 0, 3.9); g.line2([pt(1.7, -0.8, 3.9), pt(1.7, 0.8, 3.9)], { w: 0.5, c: '#3A3530', boil: false, ext: 0 });
  const d = RJ.dirOf(ca, sa), kk = 0.88;
  const seat = (u, wh, reach) => { const F = pt(u, 0, 2.5), rel = (q) => [(q[0] - F[0]) / kk, (q[1] - F[1]) / kk]; const r = RJ.person(g, u * ca, u * sa, 2.5, Object.assign({}, wh, { dir: d, pose: 'sit', k: kk, reach: reach ? rel(bar) : undefined, pedal: [rel(pt(u + 1.3, 0.5, 1.1)), rel(pt(u + 1.1, -0.5, 1.1))] })); if (r.crown) { const c = r.crown; g.fill2(arcPts(c[0], c[1] + 1.4, 2.4, Math.PI, TAU, 8).concat([[c[0] + 2.4, c[1] + 2.4], [c[0] - 2.4, c[1] + 2.4]]), wh.helmet || '#2A2622', true); } return r; };
  const back = d >= 2;
  const rider = () => { const r = seat(-0.4, Object.assign({}, who, o.vest ? { top: o.vest } : {}), true); return r; };
  if (o.pass && !back) seat(-1.7, o.pass, false);
  rider();
  if (o.pass && back) seat(-1.7, o.pass, false);
};
/* the Santa Teresa bonde: an open yellow car with crossbenches, posts, a roof, the trolley pole; riders inside and
   kids hanging off the running board on the side facing us */
RJ.bonde = function (g, ang, o) {
  o = o || {}; const L = 5.6, Wd = 1.9, Y = '#F0C23B', ca = Math.cos(ang), sa = Math.sin(ang), ph = o.ph || 0;
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, Y, { line: false, nt: true }); K.shadow(g, sh, 0.2);
  K.wheels(g, sh, [-L * 0.55, L * 0.55], 0.7, 'far', { zc: 0.7 });
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.7, 2.2, { t: '#8A5A3A', l: Y, r: shade(Y, 0.15) }, { w: 0.8 });
  for (const f of ['pv', 'nv', 'pu', 'nu']) if (B.vis[f]) g.fill(B.quad(f, -1, 1, 0.7, 1.15), '#2F5A3A');
  K.wheels(g, sh, [-L * 0.55, L * 0.55], 0.7, 'near', { zc: 0.7, arch: '#2A2622' });
  // the riders on their crossbenches (far ones first), then the near side's open frame
  const rows = 5, R = RNG(o.seed || 3);
  const looks = []; for (let i = 0; i < rows * 2; i++) looks.push(RJ.who(4100 + i + (o.seed || 0) * 10));
  const d = RJ.dirOf(-sa, ca);   // riders look out of the side facing us
  const order = []; for (let i = 0; i < rows; i++) for (const v of [-0.9, 0.6]) order.push([i, v]);
  order.sort((p, q) => { const a = B.pt(-L + 1 + p[0] * (2 * L - 2) / (rows - 1), p[1], 0), b = B.pt(-L + 1 + q[0] * (2 * L - 2) / (rows - 1), q[1], 0); return (a[0] + a[1]) - (b[0] + b[1]); });
  for (const [i, v] of order) {
    const u = -L + 1 + i * (2 * L - 2) / (rows - 1), p = B.pt(u, v, 2.2), bench = B.pt(u - 0.3, v, 2.2);
    const b0 = g.p(bench[0] - sa * 0.9, bench[1] + ca * 0.9, 3.4), b1 = g.p(bench[0] + sa * 0.9, bench[1] - ca * 0.9, 3.4);
    g.segs2([b0[0], b0[1], b1[0], b1[1]], '#8A5A3A', 1.0);
    if (R() < 0.85) RJ.person(g, p[0], p[1], 3.4, Object.assign({}, looks[(i * 2 + (v > 0 ? 1 : 0)) % looks.length], { dir: d, pose: 'sit', k: 0.9 }));
  }
  const posts = []; for (let i = 0; i <= rows; i++) { const u = -L + 0.2 + i * (2 * L - 0.4) / rows; for (const v of [-Wd, Wd]) { const a = g.p.apply(g, B.pt(u, v, 1.6)), b = g.p.apply(g, B.pt(u, v, 5.4)); posts.push(a[0], a[1], b[0], b[1]); } }
  g.segs2(posts, '#C9A02A', 0.6);
  // the running board and kids hanging off it
  for (const v of [-Wd - 0.5, Wd + 0.5]) { const a = B.pt(-L + 0.3, v, 1.0), b = B.pt(L - 0.3, v, 1.0); g.line([a, b], { w: 0.6, c: '#5A4632', boil: false }); }
  const side = (-sa + ca) > 0 ? 1 : -1, kids = o.kids == null ? 3 : o.kids;
  for (let i = 0; i < kids; i++) {
    const u = -L * 0.6 + i * L * 0.55, p = B.pt(u, side * (Wd + 0.7), 1.0), sw = Math.sin(ph * TAU + i * 1.7) * 0.7;
    RJ.person(g, p[0], p[1], 1.0, Object.assign({}, RJ.who(4200 + i * 3 + (o.seed || 0)), { dir: d, pose: 'stand', k: 0.78, hands: [[-1.2 + sw, -19], [-2.4, -13]], lean: -0.8 }));
  }
  // roof and the trolley pole
  const roof = K.rbox(g, 0, 0, L + 0.4, Wd + 0.35, ang, 5.4, 6.0, { t: '#F3EFE2', l: Y, r: shade(Y, 0.15) }, { w: 0.8 });
  const a = g.p.apply(g, roof.pt(-L * 0.3, 0, 6.0)), b = g.p.apply(g, roof.pt(L * 0.55, 0, 9.2));
  g.line2([a, b], { w: 0.5, c: '#3A3530', boil: false, ext: 0 }); g.disc2(b, 0.5, '#3A3530');
  for (const f of ['pu', 'nu']) if (roof.vis[f]) { const q = roof.quad(f, -0.6, 0.6, 5.45, 5.95); g.fill(q, '#F3EFE2'); }
};
/* the VLT: a long white low-floor tram in modules with a teal band and rounded noses */
RJ.vlt = function (g, ang) {
  const L = 7.5, Wd = 1.35, ca = Math.cos(ang), sa = Math.sin(ang);
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, '#F3F1EA', { line: false, nt: true }); K.shadow(g, sh, 0.3);
  const B = K.rbox(g, 0, 0, L, Wd, ang, 0.3, 4.4, { t: '#E9E6DC', l: '#F6F4EE', r: '#DCD8CC' }, { w: 0.8 });
  for (const f of ['pv', 'nv']) if (B.vis[f]) { g.fill(B.quad(f, -1, 1, 0.3, 1.0), '#2A9C9C'); for (let i = 0; i < 6; i++) K.rwin(g, B, f, -0.95 + i * 0.32, -0.95 + i * 0.32 + 0.26, 1.6, 3.7); for (const m of [-0.33, 0.33]) { const q = B.quad(f, m, m, 0.3, 4.4); g.line([q[0], q[3]], { w: 0.4, c: '#8C8576', boil: false, ext: 0 }); } }
  for (const f of ['pu', 'nu']) if (B.vis[f]) { K.rwin(g, B, f, -0.8, 0.8, 1.8, 3.9); g.fill(B.quad(f, -1, 1, 0.3, 1.0), '#2A9C9C'); }
  void ca; void sa;
};
/* the Niterói ferry (barca): a white catamaran with an upper deck */
RJ.ferry = function (g, ang) {
  K.boat(g, ang, { kind: 'ferry', L: 9, W: 2.8, hull: '#F3F1EA', stripe: '#2F6DB5' });
};
/* a helicopter (tour): body, tail boom, skids, a blurred rotor disc keyed by phase */
RJ.heli = function (g, ang, ph) {
  const ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z);
  g.segs2([P(-1.5, -0.9, 0)[0], P(-1.5, -0.9, 0)[1], P(1.6, -0.9, 0)[0], P(1.6, -0.9, 0)[1], P(-1.5, 0.9, 0)[0], P(-1.5, 0.9, 0)[1], P(1.6, 0.9, 0)[0], P(1.6, 0.9, 0)[1]], '#3A3530', 0.45);
  const tail = [P(-1.2, -0.2, 1.8), P(-6.2, -0.1, 2.4), P(-6.4, 0, 3.4), P(-6.0, 0.1, 2.6), P(-1.2, 0.2, 2.4)];
  g.fill2(tail, '#D9463B', true);
  const body = []; for (let i = 0; i < 16; i++) { const t = TAU * i / 16; body.push(P(Math.cos(t) * 2.0, Math.sin(t) * 1.0, 1.9 + Math.sin(t + 0.4) * 0.0 + (Math.sin(t) > 0 ? 0 : 0))); }
  const hull = [P(-1.6, 0, 0.6), P(1.4, 0, 0.6), P(2.3, 0, 1.6), P(1.6, 0, 2.9), P(-1.2, 0, 3.0), P(-1.8, 0, 2.0)];
  g.fill2(hull, '#F3F1EA', true); g.fill2([P(0.6, 0, 1.4), P(1.9, 0, 1.7), P(1.5, 0, 2.7), P(0.4, 0, 2.7)], '#6E9AB0', true);
  g.line2(hull, { w: 0.45, c: '#3A3530', close: true, boil: false });
  void body;
  const c = P(0, 0, 3.3), r = 6.5 * 3.3; g.fill2(arcPts(c[0], c[1], r, 0, TAU, 20).map((q) => [q[0], c[1] + (q[1] - c[1]) * 0.25]), 'rgba(80,72,60,0.12)');
  const a = ph * Math.PI; g.segs2([c[0] - Math.cos(a) * r, c[1] - Math.sin(a) * r * 0.25, c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r * 0.25], '#3A3530', 0.5);
};

/* ---------------- street life helpers (for filling squares and pavements) ---------------- */
/* a juice bar counter: a small booth with a fruit-filled counter facing +y, the SUCOS sign, stools and drinkers */
RJ.suco = function (T, x, y, seed, word) {
  T.obj([x - 3, y - 2, x + 3, y + 1.4], function (g) {
    K.box(g, x - 3, y - 2, x + 3, y + 1.4, 0, 4.6, { t: '#E9E2CC', l: '#F2C230', r: '#D9A82A' }, { w: 0.7 });
    g.fill(K.on('L', y + 1.42, x - 2.6, x + 2.6, 1.6, 3.8), '#F6F3EA');
    const R = RNG(seed); for (let k = 0; k < 10; k++) { const p = g.p.apply(g, K.pt('L', y + 1.45, x - 2.3 + (k % 5) * 1.15, 2.2 + Math.floor(k / 5) * 0.9)); g.disc2(p, 0.9, R.pick(['#9CCB4A', '#F2C230', '#E04A3A', '#EE8A2E', '#7A3A6A'])); }
    K.box(g, x - 3.4, y - 2.4, x + 3.4, y + 1.8, 4.6, 5.3, '#3A9A5B', { w: 0.6 });
    K.text(g, 'L', y + 1.84, x, 4.72, 0.5, word || 'SUCOS', '#F6F3EA', { center: true, w: 0.42 });
  }, { name: 'sucos' });
  T.cast([x, y + 3.2], (g) => { for (const [dx, s, d] of [[-2, 0, 2], [0.2, 1, 3], [2.2, 2, 2]]) { const f = g.p(x + dx, y + 3.2, 0); g.segs2([f[0], f[1], f[0], f[1] - 4.4], '#5A4632', 0.5); g.fill2(arcPts(f[0], f[1] - 4.4, 1.2, 0, TAU, 8).map((q) => [q[0], f[1] - 4.4 + (q[1] - f[1] + 4.4) * 0.45]), '#D9463B', true); RJ.person(g, x + dx, y + 3.2, 1.3, Object.assign(RJ.who(seed + s), { dir: d, pose: 'sit', cup: s === 1 ? '#E86A9A' : undefined })); } }, {});
};
/* a row of parked mopeds and bikes along a pavement, angled into the kerb */
RJ.parked = function (T, x, y, n, ax, seed) {
  T.obj(ax === 'y' ? [x - 1.5, y, x + 1.5, y + n * 2.2] : [x, y - 1.5, x + n * 2.2, y + 1.5], function (g) {
    for (let k = 0; k < n; k++) {
      const px = ax === 'y' ? x : x + k * 2.2 + 1, py = ax === 'y' ? y + k * 2.2 + 1 : y, ang = ax === 'y' ? 0.35 : Math.PI / 2 + 0.35, R = RNG(seed + k);
      if (R() < 0.6) g.at(px, py, 0, (g2) => { const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, z) => g2.p(u * ca, u * sa, z), col = R.pick(['#C9392E', '#2A2622', '#2F6DB5', '#F3F1EA']);
        for (const u of [-1.6, 1.7]) { const w = []; for (let i = 0; i < 12; i++) { const t = TAU * i / 12; w.push(g2.p((u + Math.cos(t) * 0.8) * ca, (u + Math.cos(t) * 0.8) * sa, 0.8 + Math.sin(t) * 0.8)); } g2.fill2(w, '#3A3632', true); }
        const body = [pt(-2.2, 1.6), pt(-0.8, 1.2), pt(0.6, 1.1), pt(1.6, 1.6), pt(1.8, 3.3), pt(1.2, 3.1), pt(0.5, 2.5), pt(-0.6, 2.5), pt(-2, 2.4)]; g2.fill2(body, col, true); g2.line2(body, { w: 0.4, c: shade(col, 0.55), close: true, boil: false }); });
      else g.at(px, py, 0, (g2) => { const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, z) => g2.p(u * ca, u * sa, z); for (const u of [-1.4, 1.4]) g2.ring2(pt(u, 1), 2.6, { w: 0.45, c: '#3A3530' }); g2.line2([pt(-1.4, 1), pt(0, 2.6), pt(1.4, 1), pt(0.2, 1), pt(-1.4, 1)], { w: 0.5, c: '#EE8A2E', boil: false }); });
    }
  }, { name: 'motos' });
};
/* a newsstand (banca): a green box hung with magazines, the vendor at its side */
RJ.banca = function (T, x, y, seed) {
  T.obj([x - 2, y - 2, x + 2, y + 2], function (g) {
    K.box(g, x - 2, y - 2, x + 2, y + 2, 0, 4.0, { t: '#2F7A4F', l: '#3A9A5B', r: '#2F7A4F' }, { w: 0.7 });
    for (const [f, p, a0] of [['L', y + 2, x - 1.7], ['R', x + 2, y - 1.7]]) for (let i = 0; i < 4; i++) g.fill(K.on(f, p + 0.04, a0 + i * 0.85, a0 + i * 0.85 + 0.7, 1.4, 2.8), ['#E86A9A', '#F2C230', '#5FC0B0', '#D9463B'][(i + seed) % 4]);
    K.box(g, x - 2.4, y - 2.4, x + 2.4, y + 2.4, 4.0, 4.5, '#2F7A4F', { w: 0.5 });
    K.text(g, 'L', y + 2.42, x, 4.05, 0.4, 'BANCA', '#F6F3EA', { center: true, w: 0.34 });
  }, { name: 'banca' });
  T.cast([x + 2.8, y + 1.2], (g) => RJ.person(g, x + 2.8, y + 1.2, 0, Object.assign(RJ.who(seed, { carnaval: false }), { dir: 1, pose: 'hold', hair: '#C9C6BD' })), {});
};
/* a shade tree with people under it (sitting on its round bench, or standing chatting) */
RJ.shadeTree = function (T, x, y, seed, o) {
  o = o || {};
  T.obj([x, y], (g) => K.tree(g, x, y, { r: o.r || 4.6, h: 5.4, col: o.col || ['#5E8F4E', '#6E9C52', '#4F8A45'][seed % 3] }), { name: 'árvore' });
  if (o.empty) return;
  T.cast([x + 1.6, y + 1.8], (g) => { const R = RNG(seed); for (const [dx, dy, d] of [[1.6, 1.8, 1], [-1.4, 2.2, 0], [2.4, -0.6, 1]]) { if (R() < 0.3) continue; RJ.person(g, x + dx, y + dy, 0, Object.assign(RJ.who(seed + dx * 10), { dir: d, pose: R() < 0.5 ? 'hold' : 'stand', cup: R() < 0.3 ? '#F2C230' : undefined, phone: R() < 0.2 })); } }, {});
};
/* a busker with a little crowd: a guitarist (violão) on a stool, an open case, listeners round him */
RJ.busker = function (T, x, y, seed) {
  T.cast([x, y], (g) => {
    const r = RJ.person(g, x, y, 1.3, Object.assign(RJ.who(seed, { carnaval: false }), { dir: 0, pose: 'sit', hands: [[2.4, -10.4], [-1.0, -9.6]] }));
    const h = r.hands[0]; g.fill2([[h[0] - 3, h[1] + 0.8], [h[0] + 0.6, h[1] - 0.6], [h[0] + 0.8, h[1] + 1.4], [h[0] - 2.8, h[1] + 2.4]], '#B07A44', true); g.disc2([h[0] - 2.6, h[1] + 1.6], 1.6, '#B07A44'); g.disc2([h[0] - 2.6, h[1] + 1.6], 0.5, '#3A3530');
    const c = g.p(x + 1.8, y + 1.6, 0); g.fill2([[c[0] - 2.6, c[1] - 0.6], [c[0] + 2.6, c[1] - 0.6], [c[0] + 2.2, c[1] + 0.8], [c[0] - 2.2, c[1] + 0.8]], '#3A3530', true); g.fill2([[c[0] - 2, c[1] - 0.3], [c[0] + 2, c[1] - 0.3], [c[0] + 1.8, c[1] + 0.5], [c[0] - 1.8, c[1] + 0.5]], '#9B3A3A', true);
  }, {});
  for (const [dx, dy, d, k] of [[4.6, 2.4, 2, 1], [5.2, -1, 2, 2], [2.4, 4.8, 3, 3], [6.4, 1.2, 2, 4]]) T.cast([x + dx, y + dy], (g) => RJ.person(g, x + dx, y + dy, 0, Object.assign(RJ.who(seed + k), { dir: d, pose: k % 2 ? 'hold' : 'stand', cup: k === 1 ? '#F2C230' : undefined })), {});
};
/* a dog trotting about on a little loop */
RJ.dog = function (T, pts, speed, col, phase) {
  const L = [0]; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const tot = L[L.length - 1];
  T.actor({ sample: 0.3, period: tot / speed,
    at(t) { let d = ((t * speed + (phase || 0) * tot) % tot + tot) % tot, i = 0; while (i < pts.length - 1 && d > L[i + 1]) i++; const a = pts[i], b = pts[(i + 1) % pts.length], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1), sx = (b[0] - a[0]) - (b[1] - a[1]) > 0 ? 1 : 0, q = Math.floor((d / 1.2) % 2); return { x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), key: sx + '.' + q, sx, q }; },
    draw(g, st) { const c = g.p(0, 0, 0), d = st.sx ? 1 : -1; g.fill2([[c[0] - 2.2 * d, c[1] - 2.2], [c[0] + 1.6 * d, c[1] - 2.4], [c[0] + 1.6 * d, c[1] - 1.2], [c[0] - 2.2 * d, c[1] - 1.0]], col, true); g.fill2([[c[0] + 1.4 * d, c[1] - 3.6], [c[0] + 2.8 * d, c[1] - 3.2], [c[0] + 2.6 * d, c[1] - 2.0], [c[0] + 1.4 * d, c[1] - 2.2]], col, true); const s = st.q ? 0.4 : -0.4; g.segs2([c[0] - 1.8 * d, c[1] - 1, c[0] - (1.8 + s) * d, c[1], c[0] + 1.2 * d, c[1] - 1, c[0] + (1.2 - s) * d, c[1], c[0] - 2.2 * d, c[1] - 2, c[0] - 3 * d, c[1] - 3.2], shade(col, 0.3), 0.5); } });
};
