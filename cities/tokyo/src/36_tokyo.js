'use strict';
/* Tokyo's own kit: Japanese roofs (tiled hip-and-gable with upturned eaves), torii, paper lanterns, utility poles and
   their wires, vending machines, signs with lettering, noren, sakura, the people of Tokyo (salarymen, kimono, a Shintō
   wedding, school kids), vehicles (taxi, kei truck, Yamanote and shinkansen cars, yakatabune, rickshaw, turret truck)
   and sumō wrestlers. Everything in tile-local u unless the name ends in 2 (wide px). */
const TK = {};

/* ---------------- lettering ---------------- */
/* Real Japanese on every sign: the stroke table JP (src/37_kana.js, 10 x 10 grid, y down, strokes in writing order),
   like Beijing's HZ. Never pseudo-characters: a reader of Japanese or Chinese sees them as miswritten words.
   TK.WORDS: real shop words by length, for a sign that does not name its own word. */
TK.WORDS = {
  1: ['本', '酒', '薬', '湯', '茶', '米', '肉', '花', '魚', '店', '祭', 'ゆ'],
  2: ['電気', '中古', '寿司', '焼鳥', '喫茶', '甘味', '食堂', '牛丼', '大吉', 'そば', 'パン', '東京'],
  3: ['カメラ', 'ゲーム', 'テレビ', 'アニメ', '居酒屋', '和菓子', 'セール', 'タバコ', 'ホビー', 'ホテル', 'ビール', 'おでん', 'うどん', 'だんご'],
  4: ['ラーメン', 'パソコン', 'カラオケ', 'コーヒー', 'タクシー', 'たいやき'],
};
TK.wordFor = function (n, seed) { const L = TK.WORDS[clamp(n | 0, 1, 4)]; return L[Math.floor(h2(seed * 7 + 3, 977) * L.length) % L.length]; };
/* a word in wide px: centred on c, cell size s (wide px); o.vert: a column read top to bottom (ー turns upright) */
TK.word2 = function (g, c, s, str, col, o) {
  o = o || {}; const chars = [...str], n = chars.length, adv = (o.adv || 1.08) * s, u = s / 10, segs = [];
  const len = (n - 1) * adv + s; let x = o.vert ? c[0] - s / 2 : c[0] - len / 2, y = o.vert ? c[1] - len / 2 : c[1] - s / 2;
  for (const ch0 of chars) {
    const ch = o.vert && ch0 === 'ー' ? 'ー|' : ch0, gl = typeof JP !== 'undefined' ? JP[ch] : null;
    if (!gl) { (window.__jpMissing = window.__jpMissing || []).push(ch); }
    else for (const st of gl) for (let i = 0; i + 3 < st.length; i += 2) segs.push(x + st[i] * u, y + st[i + 1] * u, x + st[i + 2] * u, y + st[i + 3] * u);
    if (o.vert) y += adv; else x += adv;
  }
  g.segs2(segs, col, o.w || clamp(s * 0.12, 0.2, 1.4));
};
/* a word on a plane P(a, z) -> tile point (wide-px glyphs laid on the plane's own axes, so it is sheared with the face):
   centred on (a, z), cell h (u); o.vert: a column */
TK.wordP = function (g, P, a, z, h, str, col, o) {
  o = o || {}; const chars = [...str], n = chars.length, adv = (o.adv || 1.08) * h, u = h / 10, segs = [];
  const len = (n - 1) * adv + h; let a0 = o.vert ? a - h / 2 : a - len / 2, z0 = o.vert ? z + len / 2 : z + h / 2;
  for (const ch0 of chars) {
    const ch = o.vert && ch0 === 'ー' ? 'ー|' : ch0, gl = typeof JP !== 'undefined' ? JP[ch] : null;
    if (!gl) { (window.__jpMissing = window.__jpMissing || []).push(ch); }
    else for (const st of gl) for (let i = 0; i + 3 < st.length; i += 2) {
      const p0 = g.p.apply(g, P(a0 + st[i] * u, z0 - st[i + 1] * u)), p1 = g.p.apply(g, P(a0 + st[i + 2] * u, z0 - st[i + 3] * u));
      segs.push(p0[0], p0[1], p1[0], p1[1]);
    }
    if (o.vert) z0 -= adv; else a0 += adv;
  }
  g.segs2(segs, col, o.w || clamp(h * 0.2, 0.2, 1.4));
};
/* on a building face, in K.on's coordinates (face 'L': the plane y = p, reading along +x; 'R': the plane x = p, reading
   along -y) */
TK.word = function (g, face, p, a, z, h, str, col, o) {
  const P = face === 'L' ? (s, zz) => [s, p + 0.1, zz] : (s, zz) => [p + 0.1, -s, zz];
  TK.wordP(g, P, face === 'L' ? a : -a, z, h, str, col, o);
};
/* one character in wide px, picked by seed from the one-character shop words (lanterns, noren, small plates) */
TK.glyph2 = function (g, c, s, col, seed, w) { TK.word2(g, c, s * 0.92, TK.wordFor(1, seed), col, { w: w || Math.max(0.28, s * 0.11) }); };
/* a sign board on a face, with a real word read down a column (a tall board) or along a row: o.word, or a shop word of
   about o.n characters picked by o.seed */
TK.sign = function (g, face, p, a0, a1, z0, z1, col, o) {
  o = o || {}; const q = K.on(face, p + (face === 'L' ? 0.08 : 0.08), a0, a1, z0, z1);
  g.fill(q, col); g.mark({ nc: true }); g.outline(q, { w: o.w || 0.45, c: o.c || shade(col, 0.5), boil: false });   // lit from behind at night
  { const c = g.p.apply(g, K.pt(face, p + 0.1, (a0 + a1) / 2, (z0 + z1) / 2)); g.glow2('neon', c, c, { r: 0.3 * Math.max(Math.abs(a1 - a0) * 2.92, (z1 - z0) * 3.46), col }); }
  const W = Math.abs(a1 - a0), H = z1 - z0, vert = o.vert != null ? o.vert : H > W;
  const n0 = o.n || Math.max(1, Math.floor((vert ? H / W : W / H) * 0.9)), word = o.word || TK.wordFor(Math.min(4, n0), (o.seed || 1) * 17), n = [...word].length;
  const h = vert ? Math.min(W * 0.72, H * 0.86 / (n * 1.08 - 0.08)) : Math.min(H * 0.72, W * 0.88 / (n * 1.08 - 0.08));
  const ink = o.ink || (shade(col, 0.05) === col ? '#2A2622' : (hex2rgb(col).reduce((x, y) => x + y) > 420 ? '#3A3128' : '#F6F3EA'));
  TK.word(g, face, p, (a0 + a1) / 2, (z0 + z1) / 2, h, word, ink, { vert });
};

/* ---------------- roofs ---------------- */
/* a Japanese tiled roof over the wall box [x0,y0,x1,y1] at eave height z, rising h. The eaves overhang (over), sag a
   little between corners that turn up (lift), and the tiles run down the slope in channels. gable (0..0.6): the
   hip-and-gable (irimoya) of temples and shrines, with a gable board on the visible end; 0 = plain hip roof. */
TK.roof = function (g, x0, y0, x1, y1, z, h, o) {
  o = o || {}; const ov = o.over == null ? 2 : o.over, lift = o.lift == null ? 0.9 : o.lift, col = o.col || '#7D848C', gf = o.gable || 0;
  const alongX = o.ridge ? o.ridge === 'x' : (x1 - x0) >= (y1 - y0);
  // (u along the ridge, v across it) -> world
  const W = alongX ? (u, v, zz) => [u, v, zz] : (u, v, zz) => [v, u, zz];
  const U0 = (alongX ? x0 : y0) - ov, U1 = (alongX ? x1 : y1) + ov, V0 = (alongX ? y0 : x0) - ov, V1 = (alongX ? y1 : x1) + ov;
  const vm = (V0 + V1) / 2, half = (V1 - V0) / 2, dI = Math.min(half, (U1 - U0) / 2 - 0.01), zt = z + h;
  const ua = U0 + dI, ub = U1 - dI, w = half * gf, zg = zt - h * gf;
  const eave = (ua_, va, ub_, vb, n) => { const pts = []; for (let i = 0; i <= n; i++) { const t = i / n; pts.push(W(lerp(ua_, ub_, t), lerp(va, vb, t), z + lift * Math.pow(Math.abs(2 * t - 1), 2.4))); } return pts; };
  const A = W(ua, vm, zt), B = W(ub, vm, zt);
  const gaP = W(ua, vm + w, zg), gaN = W(ua, vm - w, zg), gbP = W(ub, vm + w, zg), gbN = W(ub, vm - w, zg);
  const N = 10;
  const front = eave(U0, V1, U1, V1, N).concat([gbP, B, A, gaP]);          // the plane on the +v side
  const back = eave(U1, V0, U0, V0, N).concat([gaN, A, B, gbN]);           // -v side
  const endB = eave(U1, V1, U1, V0, 6).concat([gbN, gbP]);                 // +u end
  const endA = eave(U0, V0, U0, V1, 6).concat([gaP, gaN]);                 // -u end
  // tones: the +y-facing plane is lit, +x shaded, the back ones darker
  const tone = (nx, ny) => ny > 0.5 ? shade(col, -0.1) : nx > 0.5 ? shade(col, 0.1) : ny < -0.5 ? shade(col, 0.18) : shade(col, -0.02);
  const nrm = (dv, du) => alongX ? [du, dv] : [dv, du];
  const ink = o.c || shade(col, 0.55), lo = { w: o.w || 0.95, c: ink }, li = { w: (o.w || 0.95) * 0.7, c: ink };
  g.fill(back, tone.apply(null, nrm(-1, 0))); g.fill(endA, tone.apply(null, nrm(0, -1)));
  const nF = nrm(1, 0), nE = nrm(0, 1);
  // the two visible planes: whichever faces +y is lit
  g.fill(front, tone(nF[0], nF[1])); g.fill(endB, tone(nE[0], nE[1]));
  // tile channels down the visible slopes
  if (o.tiles !== false) {
    const segs = [], sp = o.sp || 0.95;
    for (let u = U0 + sp * 0.6; u < U1 - sp * 0.4; u += sp) {
      let s = 1; if (u < ua) s = (u - U0) / (ua - U0) * (gf ? 1 - gf : 1); else if (u > ub) s = (U1 - u) / (U1 - ub) * (gf ? 1 - gf : 1);
      if (gf && (u < ua || u > ub)) s = Math.min(s, 1 - gf);
      const t = (u - U0) / (U1 - U0), ze = z + lift * Math.pow(Math.abs(2 * t - 1), 2.4);
      const a = g.p.apply(g, W(u, V1, ze)), b = g.p.apply(g, W(u, V1 - s * 0.97 * (V1 - vm), lerp(ze, zt, s * 0.97)));
      segs.push(a[0], a[1], b[0], b[1]);
    }
    for (let v = V0 + sp * 0.6; v < V1 - sp * 0.4; v += sp) {
      const t = (v - V0) / (V1 - V0), ze = z + lift * Math.pow(Math.abs(2 * t - 1), 2.4);
      let s = Math.min(1, (v - V0) / half, (V1 - v) / half); if (gf) s = Math.min(s, 1 - gf + 0.02);
      const a = g.p.apply(g, W(U1, v, ze)), b = g.p.apply(g, W(U1 - s * 0.97 * (U1 - ub), v, lerp(ze, zg + (gf ? 0 : 0), s * 0.97 * (gf ? 1 : 1))));
      segs.push(a[0], a[1], b[0], b[1]);
    }
    g.segs2(segs, o.tc || shade(col, 0.3), 0.32);
  }
  // the gable board on the visible end
  if (gf > 0) {
    const tri = [gbN, gbP, B];
    g.fill(tri, o.end || '#F1EFE8');
    g.outline(tri, li);
    if (o.end !== '#F1EFE8') { const sl = []; for (let i = 1; i < 6; i++) { const t = i / 6, p0 = g.p.apply(g, W(ub, vm - w + 2 * w * t, zg)), p1 = g.p.apply(g, W(ub, vm - w + 2 * w * t, lerp(zg, zt, 1 - Math.abs(2 * t - 1)))); sl.push(p0[0], p0[1], p1[0], p1[1]); } g.segs2(sl, shade(o.end || '#6E5A44', 0.35), 0.3); }
  }
  // lines: front eaves, hips, ridge
  g.line(eave(U0, V1, U1, V1, N), lo); g.line(eave(U1, V1, U1, V0, 6), lo);
  g.line([W(U0, V1, z + lift), gaP], li); g.line([W(U1, V1, z + lift), gbP], lo); g.line([W(U1, V0, z + lift), gbN], li);
  g.line([W(U0, V0, z + lift), gaN], { w: 0.5, c: ink });
  if (gf) { g.line([gaP, A], li); g.line([gbP, B], li); }
  // the ridge: a thick dark band with turned-up ends
  const rc = o.rc || shade(col, 0.45), rA = g.p.apply(g, A), rB = g.p.apply(g, B);
  g.line2([rA, rB], { w: 1.7, c: rc, boil: false, ext: 0 });
  g.line2([rA, [rA[0] - 0.4, rA[1] - 1.6]], { w: 1.3, c: rc, boil: false, ext: 0 }); g.line2([rB, [rB[0] + 0.4, rB[1] - 1.6]], { w: 1.3, c: rc, boil: false, ext: 0 });
  return { A, B, zt };
};

/* a torii: two pillars, the tie beam (nuki) and the top beam (kasagi) with upturned ends. axis: the beams run along x or y */
TK.torii = function (g, x, y, o) {
  o = o || {}; const w = o.w || 6, h = o.h || 8, ax = o.axis || 'x', col = o.col || '#D4553A', top = o.top || '#2E2A26', r = o.r || 0.45;
  const P = (u, zz, v) => ax === 'x' ? [x + u, y + (v || 0), zz] : [x + (v || 0), y + u, zz];
  const pl = (u) => { const c = P(u, 0); K.cyl(g, c[0], c[1], r, 0, h, col, { w: 0.7, n: 8, nt: true }); };
  pl(-w / 2); pl(w / 2);
  const beam = (u0, u1, zb, zh, d, c, curve) => {   // a beam seen on its front face and top
    const n = 10, F = [], T = [];
    for (let i = 0; i <= n; i++) { const u = lerp(u0, u1, i / n), up = curve * Math.pow(Math.abs(2 * i / n - 1), 2.2); F.push(P(u, zb + up, d)); T.push(P(u, zb + zh + up, d)); }
    const back = T.map((p) => ax === 'x' ? [p[0], p[1] - 2 * d, p[2]] : [p[0] - 2 * d, p[1], p[2]]);
    g.fill(T.concat(back.slice().reverse()), shade(c, -0.15));
    g.fill(F.concat(T.slice().reverse()), c);
    g.outline(F.concat(T.slice().reverse()), { w: 0.7, boil: false });
  };
  beam(-w / 2 - 1.1, w / 2 + 1.1, h * 0.74, 0.55, 0.35, col, 0);
  const gk = P(0, h * 0.74 + 0.55, 0.3), gk2 = P(0, h, 0.3); const a = g.p.apply(g, gk), b = g.p.apply(g, gk2);
  g.fill2([[a[0] - 0.9, a[1]], [a[0] + 0.9, a[1]], [b[0] + 0.9, b[1]], [b[0] - 0.9, b[1]]], col);
  beam(-w / 2 - 2.2, w / 2 + 2.2, h, 0.6, 0.55, col, 0.8);
  beam(-w / 2 - 2.5, w / 2 + 2.5, h + 0.6, 0.55, 0.6, top, 1.0);
};

/* a paper lantern (chōchin) hanging at wide-px point c: ribs, black caps; big: a glyph on it */
TK.lantern2 = function (g, c, r, col, o) {
  o = o || {}; const rx = r * 0.78, pts = [];
  for (let i = 0; i < 16; i++) { const t = TAU * i / 16; pts.push([c[0] + Math.cos(t) * rx, c[1] + Math.sin(t) * r]); }
  g.fill2(pts, col, true); g.mark({ nc: true, light: true });                           // at night a light burns inside
  g.fill2(pts.filter((p) => p[0] > c[0] + rx * 0.2).concat([[c[0] + rx * 0.2, c[1] + r * 0.9], [c[0] + rx * 0.2, c[1] - r * 0.9]]).sort((a, b) => Math.atan2(a[1] - c[1], a[0] - c[0] - rx * 0.4) - Math.atan2(b[1] - c[1], b[0] - c[0] - rx * 0.4)), shade(col, 0.14), true); g.mark({ nc: true });
  if (r > 1.6) { const segs = []; for (let k = -2; k <= 2; k++) { const yy = c[1] + k * r * 0.33, xx = rx * Math.sqrt(Math.max(0, 1 - Math.pow(k * 0.33, 2))); segs.push(c[0] - xx, yy, c[0] + xx, yy); } g.segs2(segs, shade(col, 0.3), 0.25); }
  const cap = (yy) => g.fill2([[c[0] - rx * 0.62, yy - r * 0.13], [c[0] + rx * 0.62, yy - r * 0.13], [c[0] + rx * 0.62, yy + r * 0.13], [c[0] - rx * 0.62, yy + r * 0.13]], '#2A2622', true);
  cap(c[1] - r); cap(c[1] + r);
  if (o.glyph) TK.glyph2(g, [c[0], c[1] + r * 0.05], r * 0.95, o.gc || '#2A2622', o.glyph, Math.max(0.35, r * 0.13));
  if (r > 1.2) g.line2(pts, { w: 0.4, c: shade(col, 0.45), close: true, boil: false, wob: 0.3 });
  g.glow2('lantern', c, c, { r: r * 1.1, col });
};
/* a string of small lanterns between two wide-px points, sagging */
TK.lanternString2 = function (g, a, b, n, cols, sag) {
  const pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t) + (sag || 2) * 4 * t * (1 - t)]); }
  g.fine2(pts, { w: 0.25, c: '#4A4540' });
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, p = [lerp(a[0], b[0], t), lerp(a[1], b[1], t) + (sag || 2) * 4 * t * (1 - t) + 1.5]; TK.lantern2(g, p, 1.15, cols[i % cols.length]); }
};

/* noren: a split curtain hanging in a doorway on a face */
TK.noren = function (g, face, p, a0, a1, z0, z1, col, o) {
  o = o || {}; const n = o.n || 3, gap = (a1 - a0) * 0.04, d = 0.12;
  for (let i = 0; i < n; i++) {
    const b0 = a0 + (a1 - a0) * i / n + gap / 2, b1 = a0 + (a1 - a0) * (i + 1) / n - gap / 2;
    const q = K.on(face, p + d, b0, b1, z0, z1); g.fill(q, col); g.outline(q, { w: 0.35, c: shade(col, 0.45), boil: false, ext: 0 });
  }
  if (o.glyph) TK.glyph2(g, g.p.apply(g, K.pt(face, p + d, (a0 + a1) / 2, (z0 + z1) / 2)), Math.min(Math.abs(a1 - a0), z1 - z0) * 2.0, '#F6F3EA', o.glyph);
};
/* an awning sloping out from a face */
TK.awning = function (g, face, p, a0, a1, z, out, col, o) {
  o = o || {}; const drop = o.drop || 1.2, P = (a, d, zz) => face === 'L' ? [a, p + d, zz] : [p + d, a, zz];
  const q = [P(a0, 0, z), P(a1, 0, z), P(a1, out, z - drop), P(a0, out, z - drop)];
  g.fill(q, col);
  if (o.stripe) { const n = Math.max(2, Math.round(Math.abs(a1 - a0) / 1.4)); for (let i = 0; i < n; i += 2) { const s0 = lerp(a0, a1, i / n), s1 = lerp(a0, a1, (i + 1) / n); g.fill([P(s0, 0, z), P(s1, 0, z), P(s1, out, z - drop), P(s0, out, z - drop)], o.stripe); } }
  const v = [P(a0, out, z - drop), P(a1, out, z - drop), P(a1, out, z - drop - 0.6), P(a0, out, z - drop - 0.6)];
  g.fill(v, shade(col, 0.12)); g.outline(q, { w: 0.5, c: shade(col, 0.5), boil: false }); g.line([v[3], v[2]], { w: 0.45, c: shade(col, 0.5), boil: false });
};

/* ---------------- street things ---------------- */
/* a concrete utility pole with a cross-arm and a transformer can; returns the world points the wires hang from */
TK.upole = function (g, x, y, o) {
  o = o || {}; const h = o.h || 14, f = g.p(x, y, 0), t = g.p(x, y, h);
  g.fill2([[f[0] - 0.75, f[1]], [f[0] + 0.75, f[1]], [t[0] + 0.5, t[1]], [t[0] - 0.5, t[1]]], '#B9B6AD');
  g.fill2([[f[0] + 0.1, f[1]], [f[0] + 0.75, f[1]], [t[0] + 0.5, t[1]], [t[0] + 0.05, t[1]]], '#A3A097');
  g.line2([[f[0] - 0.75, f[1]], [t[0] - 0.5, t[1]]], { w: 0.5, c: '#5A564E', boil: false }); g.line2([[f[0] + 0.75, f[1]], [t[0] + 0.5, t[1]]], { w: 0.5, c: '#5A564E', boil: false });
  const arm = (zz, L) => { const a = o.across === 'y' ? g.p(x, y - L, zz) : g.p(x - L, y, zz), b = o.across === 'y' ? g.p(x, y + L, zz) : g.p(x + L, y, zz); g.line2([a, b], { w: 0.55, c: '#5A564E', boil: false, ext: 0 }); };
  arm(h - 0.8, 1.8); arm(h - 2.3, 1.3);
  if (o.can !== false) { const c = g.p(x, y, h - 4.8); g.fill2([[c[0] + 0.6, c[1]], [c[0] + 2.6, c[1]], [c[0] + 2.6, c[1] - 5.2], [c[0] + 0.6, c[1] - 5.2]], '#9FA39E'); g.outline2([[c[0] + 0.6, c[1]], [c[0] + 2.6, c[1]], [c[0] + 2.6, c[1] - 5.2], [c[0] + 0.6, c[1] - 5.2]], { w: 0.4, c: '#5A564E', boil: false }); }
  if (o.band) { const a = g.p(x, y, 4.5), b = g.p(x, y, 6.2); g.fill2([[a[0] - 0.7, a[1]], [a[0] + 0.7, a[1]], [b[0] + 0.65, b[1]], [b[0] - 0.65, b[1]]], '#E6C24F'); }
  if (o.light !== false) g.glow('lamp', x, y, h - 3.4, { r: 1.3 });   // the street light every pole carries (only at night: nothing is drawn by day)
  const L1 = 1.6, L2 = 1.1;
  return o.across === 'y' ? [[x, y - L1, h - 0.8], [x, y + L1, h - 0.8], [x, y - L2, h - 2.3], [x, y + L2, h - 2.3]] : [[x - L1, y, h - 0.8], [x + L1, y, h - 0.8], [x - L2, y, h - 2.3], [x + L2, y, h - 2.3]];
};
/* sagging wires between the hang points of two poles */
TK.wires = function (g, A, B, sag) {
  for (let i = 0; i < Math.min(A.length, B.length); i++) {
    const a = A[i], b = B[i], pts = [];
    for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t) - (sag || 1.6) * (1 + i * 0.15) * 4 * t * (1 - t)]); }
    g.fine(pts, { w: 0.3, c: '#4A4540' });
  }
};
/* a vending machine against a face: lit window of bottles, buttons, the slot */
TK.vend = function (g, x, y, o) {
  o = o || {}; const col = o.col || '#F1EFE8', face = o.face || 'L', w = 1.1, d = 0.8, h = 4.2;
  const fp = face === 'L' ? [x - w, y - d, x + w, y + d] : [x - d, y - w, x + d, y + w];
  K.box(g, fp[0], fp[1], fp[2], fp[3], 0, h, col, { w: 0.6, boil: false });
  const p = face === 'L' ? fp[3] : fp[2], a0 = face === 'L' ? fp[0] : fp[1];
  const win = K.on(face, p + 0.03, a0 + 0.25, a0 + 2 * w - 0.25, 2.2, 3.85); g.fill(win, '#E9F1F4'); g.mark({ nc: '#F2FAFF' });
  const R = RNG(Math.round(x * 13 + y * 7)), dots = [];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 5; i++) { const c = g.p.apply(g, K.pt(face, p + 0.05, a0 + 0.5 + i * 0.3, 2.45 + r * 0.5)); g.fill2([[c[0] - 0.28, c[1]], [c[0] + 0.28, c[1]], [c[0] + 0.28, c[1] - 1.1], [c[0] - 0.28, c[1] - 1.1]], R.pick(['#C9584B', '#5F8FC9', '#E6C24F', '#8FBF73', '#E08A3C', '#F3F1EA', '#3A3530']), true); g.mark({ nc: true }); }
  g.outline(win, { w: 0.35, c: '#5A564E', boil: false });
  { const c = g.p.apply(g, K.pt(face, p + 0.05, a0 + w, 3)); g.glow2('neon', c, g.p(x, y, 0), { r: 2.4, col: '#DDF0FF' }); }
  const slot = K.on(face, p + 0.03, a0 + 0.5, a0 + 2 * w - 0.6, 0.5, 1.1); g.fill(slot, '#3A3530');
  const bt = g.p.apply(g, K.pt(face, p + 0.04, a0 + 2 * w - 0.45, 1.8)); g.disc2(bt, 0.4, '#C9584B');
  if (o.top) { const tq = K.on(face, p + 0.02, a0, a0 + 2 * w, h - 0.35, h); g.fill(tq, o.top); }
};
/* a sakura in bloom: a dark trunk with a fork, a wide cloud of blossom, white flecks */
TK.sakura = function (g, x, y, o) {
  o = o || {}; if (TK.autumn()) { TK.sakuraFall(g, x, y, o); return; }
  if (TK.summer()) { TK.sakuraLeaf(g, x, y, o); return; }
  if (TK.winter()) { K.bare(g, x, y, { r: o.r || 5.2, h: o.h == null ? 4.6 : o.h, z: o.z, seed: o.seed, spread: 1.5, trunk: '#5E463E', bark: '#5E463E' }); return; }
  { const r = (o.r || 5.2) * 3.3, f = g.p(x, y, o.z || 0), Q = RNG((o.seed || Math.round(x * 37 + y * 11 + 5)) + 5003), pl = [[], []];   // petals fallen round its foot
    for (let i = 0; i < 24; i++) { const a = Q() * TAU, d = r * (0.2 + Q() * 0.8), px = f[0] + Math.cos(a) * d, py = f[1] + Math.sin(a) * d * 0.45, b = Q() * Math.PI, c = Math.cos(b) * 0.6, sn = Math.sin(b) * 0.35; pl[i % 2].push(px - c, py - sn, px, py - 0.25, px + c, py + sn, px - c, py - sn, px + c, py + sn, px, py + 0.25); }
    pl.forEach((a, i) => g.tris2(a, i ? '#F8DDE4' : '#F2C6D0')); }
  const r = (o.r || 5.2) * 3.3, h = o.h == null ? 4.6 : o.h, f = g.p(x, y, o.z || 0), top = [f[0], f[1] - h * VZ], R = RNG(o.seed || Math.round(x * 37 + y * 11 + 5));
  const col = o.col || '#F2C6D0', dk = shade(col, 0.16), ink = '#B97F92';
  g.fill2([[f[0] - 1.1, f[1]], [f[0] + 1.1, f[1]], [top[0] + 0.7, top[1]], [top[0] - 0.7, top[1]]], '#5E463E');
  g.line2([[top[0], top[1] + 1], [top[0] - r * 0.45, top[1] - r * 0.35]], { w: 0.9, c: '#5E463E', boil: false }); g.line2([[top[0], top[1] + 1], [top[0] + r * 0.4, top[1] - r * 0.45]], { w: 0.8, c: '#5E463E', boil: false });
  const cy = top[1] - r * 0.55, lobes = [[-r * 0.45, r * 0.05, r * 0.62], [r * 0.42, -r * 0.02, r * 0.6], [0, -r * 0.32, r * 0.66], [r * 0.05, r * 0.2, r * 0.55]];
  const blobs = lobes.map(([dx, dy, rr], i) => { const pts = []; const a0 = R() * TAU; for (let k = 0; k < 9; k++) { const a = a0 + TAU * k / 9, q = rr * (0.88 + R() * 0.22); pts.push([top[0] + dx + Math.cos(a) * q, cy + dy + Math.sin(a) * q * 0.82]); } return pts; });
  // clumps painted back to front, each with its shade and its own edge, so the front ones overlap the back ones
  blobs.map((b) => ({ b, cy: b.reduce((s, p) => s + p[1], 0) / b.length })).sort((p, q) => p.cy - q.cy).forEach(({ b }) => {
    const cxx = b.reduce((s, p) => s + p[0], 0) / b.length, cyy = b.reduce((s, p) => s + p[1], 0) / b.length;
    g.fill2(b, col); g.mark({ nc: (c) => mix(nightColour(c), c, 0.5) });               // at night the blossom is lit (yozakura)
    const sh = b.filter((p) => (p[0] - cxx) * 0.5 + (p[1] - cyy) > 0); if (sh.length > 2) { g.fill2(sortAround(sh.concat([[cxx, cyy + 1]])), dk); g.mark({ nc: (c) => mix(nightColour(c), c, 0.4) }); }
    g.outline2(b, { c: ink, w: 0.6, ext: 0.2 });
  });
  const fl = []; for (let i = 0; i < 26; i++) { const a = R() * TAU, d = R() * r * 0.85, px = top[0] + Math.cos(a) * d * 1.05, py = cy + Math.sin(a) * d * 0.75 - r * 0.05; fl.push(px - 0.35, py, px + 0.35, py); }
  g.segs2(fl, '#FBF4F4', 0.75);
  const pk = []; for (let i = 0; i < 14; i++) { const a = R() * TAU, d = R() * r * 0.8, px = top[0] + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.72; pk.push(px, py, px + 0.9, py - 0.5); }
  g.segs2(pk, ink, 0.45);
  g.glow2('tree', [top[0], cy], f, { r, col: '#FFB3D3' });
  g.emit('petal', [top[0], cy], f, { r: r * 0.9, cols: ['#F2B6C2', '#FBE4E9', '#EBA2B4'], n: 5 });   // hanafubuki: petals on the wind
};
/* a blue tarp spread on the ground (world points), with fold lines */
TK.tarp = function (g, pts, o) {
  o = o || {}; const col = o.col || '#4F8BD0';
  g.fill(pts, col);
  const c = pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length], [0, 0]);
  g.fine([[lerp(pts[0][0], pts[1][0], 0.5), lerp(pts[0][1], pts[1][1], 0.5), 0.06], [lerp(pts[2][0], pts[3][0], 0.5), lerp(pts[2][1], pts[3][1], 0.5), 0.06]], { w: 0.35, c: shade(col, -0.25) });
  g.fine([[lerp(pts[1][0], pts[2][0], 0.5), lerp(pts[1][1], pts[2][1], 0.5), 0.06], [lerp(pts[3][0], pts[0][0], 0.5), lerp(pts[3][1], pts[0][1], 0.5), 0.06]], { w: 0.35, c: shade(col, -0.25) });
  g.outline(pts, { w: 0.5, c: shade(col, 0.45), boil: false });
  return c;
};

/* ---------------- seasons ----------------
   Tokyo's own season is cherry-blossom week. Autumn is the last week of November: the ginkgo at their gold, the cherries'
   leaves turned rust and half fallen, Shiba Park's maples turning (they peak in early December), 8 to 16 degrees, so
   coats and scarves. Everything below draws exactly as before in spring. */
TK.autumn = () => LOOK.season === 'autumn';
TK.summer = () => LOOK.season === 'summer';
TK.winter = () => LOOK.season === 'winter';
/* Summer is the last Saturday of July, the day of the Sumida River fireworks: full leaf, 30 degrees, yukata, tarps laid
   along the river since noon, Fuji without its snow. Winter is the first week of January (the 5th to the 7th): the
   deciduous trees bare, the lawns brown, coats and mufflers, kadomatsu at the doors until the 7th, the year's first
   shrine visits, black-headed gulls on the river; the schools are on holiday in both. */
const TK_LEAVES = {
  summer: {
    ginkgo: [{ col: '#7DA455', ink: '#4B6B36' }],
    zelkova: [{ col: '#6E9A50', ink: '#4B6B36' }, { col: '#7AA65A', ink: '#4B6B36' }],
  },
  autumn: {   // fall: the leaves it lets go (SCENE.air.autumn), litter: the leaves round its foot
    ginkgo: [{ col: '#E8C445', ink: '#94741F', glow: '#FFD873', fall: ['#E8C445', '#F0D468', '#D9A93A'], litter: ['#E8C445', '#F0D468'] }],
    zelkova: [{ col: '#C98A4C', ink: '#77502E', glow: '#FFC07A', fall: ['#C98A4C', '#D6A052', '#B9783E'], litter: ['#C98A4C', '#B9783E'] }, { col: '#D6A052', ink: '#7E5A2E', glow: '#FFCB7A', fall: ['#D6A052', '#C98A4C'], litter: ['#D6A052', '#C98A4C'] }],
    maple: [{ col: '#D2563D', ink: '#7E3426', glow: '#FFAA78', fall: ['#D2563D', '#DE7F3A'], litter: ['#D2563D', '#B9452F'] }, { col: '#DE7F3A', ink: '#84452A', glow: '#FFBF78', fall: ['#DE7F3A', '#D9A043'], litter: ['#DE7F3A', '#C9703A'] }, { col: '#D9A043', ink: '#86602A', glow: '#FFD27A', fall: ['#D9A043', '#E8C445'], litter: ['#D9A043', '#C98A4C'] }, { col: '#86A052', ink: '#4B6B36' }],
  },
  winter: { ginkgo: [{ bare: true }], zelkova: [{ bare: true }], maple: [{ bare: true }] },
};
/* a tree's colours: in spring o comes back untouched; in the other seasons its kind (ginkgo, zelkova, maple) decides.
   A kind the season does not list (an evergreen, or a maple in summer leaf) is as in spring */
TK.leaves = function (o, kind, i) {
  const S = TK_LEAVES[LOOK.season], l = S && S[kind];
  if (!l) return o;
  const n = l.length; return Object.assign({}, o, l[(((i | 0) % n) + n) % n]);
};
/* a cherry in full summer leaf: the spring tree's shape in green, no blossom */
TK.sakuraLeaf = function (g, x, y, o) {
  const r = (o.r || 5.2) * 3.3, h = o.h == null ? 4.6 : o.h, f = g.p(x, y, o.z || 0), top = [f[0], f[1] - h * VZ], R = RNG((o.seed || Math.round(x * 37 + y * 11 + 5)) + 7001);
  const col = '#7FAE5E', dk = shade(col, 0.16), ink = '#4B6B36';
  g.fill2([[f[0] - 1.1, f[1]], [f[0] + 1.1, f[1]], [top[0] + 0.7, top[1]], [top[0] - 0.7, top[1]]], '#5E463E');
  g.line2([[top[0], top[1] + 1], [top[0] - r * 0.45, top[1] - r * 0.35]], { w: 0.9, c: '#5E463E', boil: false }); g.line2([[top[0], top[1] + 1], [top[0] + r * 0.4, top[1] - r * 0.45]], { w: 0.8, c: '#5E463E', boil: false });
  const cy = top[1] - r * 0.55, lobes = [[-r * 0.45, r * 0.05, r * 0.62], [r * 0.42, -r * 0.02, r * 0.6], [0, -r * 0.32, r * 0.66], [r * 0.05, r * 0.2, r * 0.55]];
  lobes.map(([dx, dy, rr]) => { const pts = [], a0 = R() * TAU; for (let k = 0; k < 9; k++) { const a = a0 + TAU * k / 9, q = rr * (0.88 + R() * 0.22); pts.push([top[0] + dx + Math.cos(a) * q, cy + dy + Math.sin(a) * q * 0.82]); } return pts; })
    .map((b) => ({ b, cy: b.reduce((s2, p) => s2 + p[1], 0) / b.length })).sort((p, q) => p.cy - q.cy).forEach(({ b }) => {
      const cxx = b.reduce((s2, p) => s2 + p[0], 0) / b.length, cyy = b.reduce((s2, p) => s2 + p[1], 0) / b.length;
      g.fill2(b, col);
      const sh = b.filter((p) => (p[0] - cxx) * 0.5 + (p[1] - cyy) > 0); if (sh.length > 2) g.fill2(sortAround(sh.concat([[cxx, cyy + 1]])), dk);
      g.outline2(b, { c: ink, w: 0.6, ext: 0.2 });
    });
  const lf = []; for (let i = 0; i < 6; i++) { const a = R() * TAU, d = r * (0.2 + R() * 0.5), px = top[0] + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.75, l = r * 0.14; lf.push(px, py, px + l, py - l * 0.6); } g.segs2(lf, ink, 0.5);
  g.glow2('tree', [top[0], cy], f, { r });
};
/* the garden tree in the old lane: a persimmon (leaves in summer, fruit in autumn, bare with a fruit or two left for the
   birds in winter: kimamori); in spring a plain tree, as it was first drawn */
TK.garden = function (g, x, y, o) {
  if (TK.autumn()) { TK.kaki(g, x, y, o); return; }
  if (TK.winter()) { K.tree(g, x, y, Object.assign({}, o, { bare: true, fruit: ['#E8742A', 2] })); return; }
  K.tree(g, x, y, TK.summer() ? Object.assign({}, o, { col: '#5E8A4A', ink: '#3C5A30' }) : o);
};
/* a cherry in late November: the same trunk and fork, the crown thinned to clumps of rust and orange leaves with the
   branch tips showing through, a few leaves fallen round its foot */
TK.sakuraFall = function (g, x, y, o) {
  const r = (o.r || 5.2) * 3.3, h = o.h == null ? 4.6 : o.h, f = g.p(x, y, o.z || 0), top = [f[0], f[1] - h * VZ], R = RNG((o.seed || Math.round(x * 37 + y * 11 + 5)) + 9001);
  const BR = '#5E463E', ink = '#7A3F2A', cols = ['#C8663A', '#DB8B45', '#B9502F', '#D9A54C', '#A8603A'];
  const lf = [[], [], []]; for (let i = 0; i < 18; i++) { const a = R() * TAU, d = r * (0.25 + R() * 0.65), px = f[0] + Math.cos(a) * d, py = f[1] + Math.sin(a) * d * 0.45, b = R() * Math.PI, c = Math.cos(b) * 0.75, sn = Math.sin(b) * 0.4; lf[i % 3].push(px - c, py - sn, px, py - 0.3, px + c, py + sn, px - c, py - sn, px + c, py + sn, px, py + 0.3); }
  lf.forEach((a, i) => g.tris2(a, cols[i]));
  g.fill2([[f[0] - 1.1, f[1]], [f[0] + 1.1, f[1]], [top[0] + 0.7, top[1]], [top[0] - 0.7, top[1]]], BR);
  // five boughs fan up from the fork and fork again: half the leaves are down, so they show
  const tips = [], o0 = [top[0], top[1] + 1];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i - 2) * 0.47 + (R() - 0.5) * 0.2, l = r * (0.66 + R() * 0.22), k = 0.82;
    const m = [o0[0] + Math.cos(a) * l * 0.5, o0[1] + Math.sin(a) * l * 0.5 * k], e = [o0[0] + Math.cos(a) * l, o0[1] + Math.sin(a) * l * k];
    g.line2([o0, m, e], { w: 0.85, c: BR, boil: false });
    const a2 = a + (i < 2 ? -0.55 : i > 2 ? 0.55 : (R() < 0.5 ? -0.55 : 0.55)), e2 = [m[0] + Math.cos(a2) * l * 0.42, m[1] + Math.sin(a2) * l * 0.42 * k];
    g.line2([m, e2], { w: 0.65, c: BR, boil: false });
    tips.push(e, e2);
  }
  // what is left of the leaves: small clumps at the bough ends and one in the middle, with gaps between them
  const cl = tips.map((e) => ({ x: e[0], y: e[1] + 1.2, rr: r * (0.17 + R() * 0.09), col: cols[Math.floor(R() * cols.length)] }));
  cl.push({ x: top[0] + (R() - 0.5) * 3, y: top[1] - r * 0.42, rr: r * 0.24, col: cols[Math.floor(R() * cols.length)] });
  cl.sort((p, q) => p.y - q.y).forEach(({ x: cx, y: cy, rr, col }) => {
    const b = [], a0 = R() * TAU; for (let k = 0; k < 8; k++) { const a = a0 + TAU * k / 8, q = rr * (0.8 + R() * 0.35); b.push([cx + Math.cos(a) * q, cy + Math.sin(a) * q * 0.82]); }
    g.fill2(b, col);
    const sh = b.filter((p) => (p[0] - cx) * 0.5 + (p[1] - cy) > 0); if (sh.length > 2) g.fill2(sortAround(sh.concat([[cx, cy + 0.6]])), shade(col, 0.16));
    g.outline2(b, { c: ink, w: 0.55, ext: 0.2 });
  });
  const tw = []; for (const e of tips) { tw.push(e[0], e[1], e[0] + (R() - 0.5) * 3, e[1] - 2.4 - R() * 1.8, e[0], e[1], e[0] + (R() - 0.5) * 4.4, e[1] - 1.3 - R()); } g.segs2(tw, BR, 0.45);
  const fl = []; for (const c of cl) for (let i = 0; i < 2; i++) { const px = c.x + (R() - 0.5) * c.rr, py = c.y + (R() - 0.5) * c.rr * 0.7; fl.push(px - 0.4, py, px + 0.4, py - 0.2); } g.segs2(fl, '#F2C27A', 0.7);
  g.glow2('tree', [top[0], top[1] - r * 0.45], f, { r: r * 0.5, col: '#E8A060' });   // no light-up here: a smaller, dimmer glow than the yozakura's
  g.emit('leaf', [top[0], top[1] - r * 0.45], f, { r: r * 0.8, cols: ['#C8663A', '#DB8B45', '#D9A54C'], n: 3 });
};
/* a persimmon in an old lane's garden, late in the year: a thin crown of the last rust leaves, the orange fruit left on */
TK.kaki = function (g, x, y, o) {
  const r0 = (o.r || 5) * 0.86; K.tree(g, x, y, Object.assign({}, o, { r: r0, col: '#B9773E', ink: '#6E4426', glow: '#FFB46A', fall: ['#B9773E', '#C98A4C'], litter: ['#B9773E', '#A8603A'] }));
  const r = r0 * 3.3, h = o.h == null ? 5.5 : o.h, f = g.p(x, y, 0), cy = f[1] - h * VZ - r * 0.62, R = RNG(Math.round(x * 13 + y * 7) + 4);
  for (let i = 0; i < 12; i++) { const a = R() * TAU, d = R() * r * 0.8, p = [f[0] + Math.cos(a) * d, cy + Math.sin(a) * d * 0.85]; g.disc2(p, 1.05, '#E8742A'); g.mark({ nc: (c) => mix(nightColour(c), c, 0.3) }); g.ring2(p, 1.05, { c: '#8A3F1A', w: 0.35 }); g.disc2([p[0] - 0.3, p[1] - 0.35], 0.3, '#F6B07A'); }
};
/* fallen leaves on the ground: little leaf shapes in a rect (tile-local u), one batch per colour */
TK.litter = function (g, x0, y0, x1, y1, n, cols, seed) {
  const R = RNG(seed), by = cols.map(() => []);
  for (let i = 0; i < n; i++) {
    const p = g.p(x0 + (x1 - x0) * R(), y0 + (y1 - y0) * R(), 0.02), a = R() * Math.PI, l = 0.55 + R() * 0.35, c = Math.cos(a) * l, sn = Math.sin(a) * l * 0.55;
    by[i % cols.length].push(p[0] - c, p[1] - sn, p[0], p[1] - 0.32, p[0] + c, p[1] + sn, p[0] - c, p[1] - sn, p[0] + c, p[1] + sn, p[0], p[1] + 0.32);
  }
  by.forEach((a, i) => g.tris2(a, cols[i]));
};
/* the Sumida fireworks (summer, after dark only: they start at seven): shells burst in turn over the river, each a ring of
   sparks with short trails that opens, droops and fades. spots: [x, y, z (tile-local u), colour, period s, phase] */
TK.fireworks = function (T, spots, o) {
  o = o || {};
  spots.forEach(([x, y, z, col, P, ph], i) => T.actor({ layer: 'top', sample: 5, period: 10, grow: false, season: 'summer',
    at(t) {
      if (!LOOK.night) return null;
      const u = (((t / P + ph) % 1) + 1) % 1; if (u > 0.5) return null;
      const f = Math.min(13, Math.floor(u / 0.5 * 14)), a = 1 - smooth((u - 0.32) / 0.18);
      return { x, y, z, key: f, f, alpha: a < 1 ? a : null };
    },
    draw(g, st) {
      const c = g.p(0, 0, 0), k = st.f / 13, rr = 6 + 44 * Math.sqrt(k), droop = 12 * k * k, n = 36, R = RNG(i * 31 + 7), i0 = g.cmds.length, hot = mix(col, '#FFF6D8', 0.55);
      for (let j = 0; j < n; j++) {
        const a = TAU * j / n + (R() - 0.5) * 0.1;
        for (let q = 0; q < 4; q++) { const m = 1 - q * 0.13; g.disc2([c[0] + Math.cos(a) * rr * m, c[1] + Math.sin(a) * rr * 0.9 * m + droop * m * m], (q ? 0.62 : 1.15) * (1 - 0.4 * k), q ? hot : col); }
      }
      if (k > 0.25) for (let j = 0; j < 14; j++) { const a = TAU * j / 14 + 0.2, m = 0.45; g.disc2([c[0] + Math.cos(a) * rr * m, c[1] + Math.sin(a) * rr * 0.9 * m + droop * m * m], 0.8 * (1 - 0.4 * k), hot); }   // an inner ring
      g.mark({ nc: true }, i0);
      if (k < 0.5) { g.disc2(c, 1.6 * (1 - 2 * k), '#FFF6D8'); g.mark({ nc: true, light: true }); }
      // its light broken on the river below (o.water: the height of the water)
      const wy = c[1] + (z - (o.water || 0)) * VZ, j0 = g.cmds.length;
      for (let q = 0; q < 7; q++) { const ww = rr * (0.55 - q * 0.06) * (0.7 + 0.3 * Math.sin(q * 2.3 + st.f)), yy = wy + 1 + q * 2.2; g.fill2([[c[0] - ww, yy], [c[0] + ww, yy], [c[0] + ww * 0.9, yy + 0.7], [c[0] - ww * 0.9, yy + 0.7]], q % 2 ? hot : col, true); }
      g.mark({ nc: true }, j0);
    } }));
};
/* a black-headed gull (yurikamome) in winter plumage, around a wide-px point: white, pale grey back, a dark spot behind
   the eye, red bill and legs. fly: wings up (f 0) or down (f 1) */
TK.gull2 = function (g, c, dir, fly, f) {
  const s = dir * 1.6, P = (u, v) => [c[0] + s * u, c[1] + v * 1.6];
  if (fly) {
    const up = f ? 1.6 : -1.8;
    g.fill2([P(-0.6, -0.2), P(-3.6, up - 0.6), P(-2.4, up + 0.2), P(0.4, 0.2)], '#C9CED4', true); g.fill2([P(0.2, -0.2), P(3.4, up - 0.8), P(2.4, up), P(-0.4, 0.2)], '#DCE0E4', true);
    g.fill2([P(-3.6, up - 0.6), P(-3.0, up - 0.5), P(-3.2, up - 0.1)], '#2A2622', true);
  }
  g.fill2(K.curve([P(-1.8, 0), P(-0.6, -0.8), P(1.0, -0.7), P(1.8, -0.2), P(1.0, 0.5), P(-1.2, 0.4)], 2, true), '#F8F7F2', true);
  if (!fly) g.fill2([P(-1.6, -0.1), P(-0.2, -0.7), P(1.0, -0.5), P(-0.4, 0.1)], '#C9CED4', true);
  g.disc2(P(1.6, -0.9), 0.95, '#F8F7F2'); g.disc2(P(1.45, -1.05), 0.26, '#3A3530');
  g.fill2([P(2.1, -0.95), P(2.9, -0.8), P(2.1, -0.7)], '#C9463E', true);
  g.line2(K.curve([P(-1.8, 0), P(-0.6, -0.8), P(1.0, -0.7), P(1.8, -0.2), P(1.0, 0.5), P(-1.2, 0.4)], 2, true), { w: 0.3, c: '#8C8576', boil: false });
};
/* a snowman (yukidaruma: two balls, in Japan), with coal eyes, twig arms and a red bucket for a hat; s scales it */
TK.snowman = function (g, x, y, s) {
  s = s || 1; const b = g.p(x, y, 1.5 * s), hd = g.p(x, y, 3.9 * s), R1 = 1.7 * 3.3 * s, R2 = 1.15 * 3.3 * s;
  for (const [c, r] of [[b, R1], [hd, R2]]) { g.disc2(c, r, '#F6F7F9'); g.fill2(arcPts(c[0], c[1], r, -0.6, 1.9, 8).concat([[c[0] + r * 0.1, c[1] + r * 0.2]]), '#DCE2EA', true); g.ring2(c, r, { c: '#8C96A4', w: 0.45 }); }
  g.disc2([hd[0] - R2 * 0.35, hd[1] - R2 * 0.05], 0.45 * s, '#2A2622'); g.disc2([hd[0] + R2 * 0.3, hd[1] - R2 * 0.05], 0.45 * s, '#2A2622');
  g.fill2([[hd[0] - 1.6 * s, hd[1] - R2 * 0.7], [hd[0] + 1.6 * s, hd[1] - R2 * 0.7], [hd[0] + 2.0 * s, hd[1] - R2 * 1.5], [hd[0] - 1.9 * s, hd[1] - R2 * 1.5]], '#C9463E', true);   // the bucket
  g.segs2([b[0] - R1 * 0.85, b[1] - R1 * 0.4, b[0] - R1 * 1.6, b[1] - R1 * 0.9, b[0] + R1 * 0.85, b[1] - R1 * 0.4, b[0] + R1 * 1.55, b[1] - R1 * 1.0], '#6B4C34', 0.45);
};
/* New Year at a door: a shimekazari (a straw rope with white paper zigzags and a bitter orange) over it, wide-px centre */
TK.shime2 = function (g, c, s) {
  s = s || 1; const P = (u, v) => [c[0] + u * s, c[1] + v * s];
  g.line2(K.curve([P(-2.6, 0), P(0, 1.1), P(2.6, 0)], 4, false), { w: 1.1 * s, c: '#D9C68A', boil: false });
  g.fill2([P(-0.5, 0.7), P(0.5, 0.7), P(0.4, 3.6), P(-0.4, 3.6)], '#D9C68A', true);
  for (const u of [-1.4, 1.4]) g.fill2([P(u - 0.4, 0.6), P(u + 0.4, 0.6), P(u - 0.1, 1.5), P(u + 0.4, 1.5), P(u, 2.6), P(u - 0.4, 1.9)], '#FBFAF6', true);
  g.disc2(P(0, 0.6), 0.75 * s, '#E8742A'); g.disc2(P(0.5, -0.1), 0.35 * s, '#5E8A4A');
};
/* a kadomatsu: three green bamboo stems cut on the slant, pine sprigs, a straw-bound base (tile-local x, y) */
TK.kadomatsu = function (g, x, y) {
  K.cyl(g, x, y, 0.75, 0, 1.2, { t: '#C9A26B', l: '#B58F58', r: '#A07C4C' }, { w: 0.45, n: 10 });
  const segs = []; for (let z = 0.4; z < 1.2; z += 0.35) { const a = g.p(x - 0.75, y, z), b = g.p(x + 0.75, y, z); segs.push(a[0], a[1], b[0], b[1]); } g.segs2(segs, '#7A5A3C', 0.35);
  for (const [dx, h] of [[-0.3, 3.6], [0.3, 3.0], [0, 4.2]]) {
    const b = g.p(x + dx, y + 0.1, 1.2), t = g.p(x + dx, y + 0.1, h);
    g.fill2([[b[0] - 0.55, b[1]], [b[0] + 0.55, b[1]], [t[0] + 0.55, t[1] + 0.8], [t[0] - 0.55, t[1]]], '#6FA35A', true);
    g.fill2([[t[0] - 0.5, t[1] + 0.1], [t[0] + 0.5, t[1] + 0.85], [t[0] + 0.3, t[1] + 1.0], [t[0] - 0.3, t[1] + 0.4]], '#E9E2B8', true);
    g.line2([[b[0] - 0.55, b[1]], [t[0] - 0.55, t[1]]], { w: 0.3, c: '#3C5A30', boil: false });
  }
  for (const [dx, dz] of [[-0.6, 1.6], [0.6, 1.5], [0, 1.9]]) { const p = g.p(x + dx, y + 0.3, dz); g.disc2(p, 0.9, '#3F6B3A'); }
};
/* the shaved-ice flag: white cloth, the character 氷 ("ice") in red, blue waves along the foot (wide px, top-left at p) */
TK.kooriFlag2 = function (g, p, w, h) {
  const q = [[p[0], p[1]], [p[0] + w, p[1]], [p[0] + w, p[1] + h], [p[0], p[1] + h]];
  g.fill2(q, '#FBFAF6', true); g.mark({ nc: (c) => mix(nightColour(c), c, 0.45) });
  const wy = p[1] + h * 0.78, wv = [[p[0], p[1] + h]]; for (let i = 0; i <= 8; i++) wv.push([p[0] + w * i / 8, wy + Math.sin(i * 1.7) * h * 0.04]); wv.push([p[0] + w, p[1] + h]);
  g.fill2(wv, '#3F7FC0', true);
  const s = Math.min(w, h * 0.7) * 0.82, o = [p[0] + (w - s) / 2, p[1] + h * 0.06], P = (u, v) => [o[0] + u * s, o[1] + v * s], st = { w: Math.max(0.45, s * 0.11), c: '#C9463E', boil: false, ext: 0 };
  g.line2([P(0.16, 0.16), P(0.25, 0.28)], st);                                  // the dot
  g.line2([P(0.52, 0.06), P(0.52, 0.86), P(0.42, 0.79)], st);                   // the stem, hooked at its foot
  g.line2([P(0.12, 0.42), P(0.40, 0.42), P(0.12, 0.82)], st);                   // left: across, then down and away
  g.line2([P(0.84, 0.28), P(0.58, 0.50)], st); g.line2([P(0.58, 0.50), P(0.92, 0.86)], st);   // right: up, then the long sweep
  g.outline2(q, { w: 0.35, boil: false });
};
/* a morning glory climbing a little bamboo frame from a pot on the step (summer in the old lanes); wide-px pot top */
TK.asagao2 = function (g, p, seed) {
  const R = RNG(seed), top = [p[0], p[1] - 5.2];
  g.segs2([p[0] - 0.8, p[1], top[0] - 0.8, top[1], p[0] + 0.8, p[1], top[0] + 0.8, top[1], top[0] - 0.8, top[1] + 1.6, top[0] + 0.8, top[1] + 1.6], '#B59A6A', 0.3);
  for (let i = 0; i < 6; i++) { const q = [p[0] + (R() - 0.5) * 2.2, p[1] - 0.6 - R() * 4.6]; g.disc2(q, 0.65, i % 2 ? '#6E9A50' : '#7FAE5E'); }
  for (let i = 0; i < 3; i++) { const q = [p[0] + (R() - 0.5) * 2.0, p[1] - 1.4 - R() * 3.8]; g.disc2(q, 0.55, R.pick(['#5E6FC9', '#7A5BB0', '#C95A8A'])); g.disc2(q, 0.18, '#F6F3EA'); }
};
/* the yakiimo truck's load: a black stone oven with a chimney, a red lantern, a little fire glowing in its door */
TK.imo = function (g, B, ang) {
  const p = B.pt(-0.9, 0, 2.0); K.rbox(g, p[0], p[1], 1.7, 1.35, ang, 2.0, 3.7, { t: '#4A4540', l: '#3A3530', r: '#2E2A26' }, { w: 0.55 });
  const q = B.pt(-2.2, 0.5, 3.7); K.cyl(g, q[0], q[1], 0.3, 3.7, 6.4, { t: '#6E6A64', l: '#5A564E', r: '#4A4640' }, { w: 0.4, n: 8 });
  const v = Math.cos(ang) - Math.sin(ang) > 0 ? 1 : -1;                     // the long side we can see
  const d0 = g.p.apply(g, B.pt(-1.7, v * 1.37, 2.4)), d1 = g.p.apply(g, B.pt(-0.3, v * 1.37, 2.4)), d2 = g.p.apply(g, B.pt(-0.3, v * 1.37, 3.2)), d3 = g.p.apply(g, B.pt(-1.7, v * 1.37, 3.2));
  g.fill2([d0, d1, d2, d3], '#D9662E', true); g.mark({ nc: '#FFB25A', light: true }); g.outline2([d0, d1, d2, d3], { w: 0.35, c: '#2A2622', boil: false });   // the fire door
  const s0 = g.p.apply(g, B.pt(-2.2, 0.5, 6.6)), st = []; for (let k = 0; k < 7; k++) st.push([s0[0] + Math.sin(k * 1.3) * 0.9 + k * 0.5, s0[1] - k * 1.3]); g.line2(st, { w: 0.5, c: '#C9C3B6', boil: false });
  const l = g.p.apply(g, B.pt(1.3, v * 1.2, 5.6)); g.line2([g.p.apply(g, B.pt(1.3, v * 1.2, 2.0)), l], { w: 0.4, c: '#3A3530', boil: false }); TK.lantern2(g, [l[0], l[1] + 1.6], 1.35, '#D0483A');
};

/* ---------------- people ---------------- */
const TK_TOPS = ['#3B3F47', '#F0EDE4', '#6C7A89', '#B9A27D', '#3F5F8F', '#8E8A84', '#E7E2D6', '#5A6B5A', '#C9584B', '#D98AA4', '#7FB7D9', '#E6C24F', '#2F343B', '#A4C66B', '#E7A9A0', '#F3F1EA'];
const TK_BOTS = ['#2F343B', '#3F4D63', '#6B7B8C', '#B9A27D', '#3B3F47', '#4A5A78', '#E7E2D6', '#5A4A3C'];
/* a Tokyo citizen: mostly dark-haired, quieter clothes, some tourists */
TK.who = function (seed, o) {
  const R = RNG(seed * 7919 + 3), tourist = R() < 0.14;
  const w = K.who(seed);
  if (!tourist) {
    w.skin = R.pick([SKIN[0], SKIN[0], SKIN[0], SKIN[1], SKIN[1], '#EFCDB0']);
    const hr = R(); w.hair = hr < 0.7 ? R.pick(['#1F1A18', '#2B2420', '#2B2420']) : hr < 0.9 ? R.pick(['#5A3A24', '#7B4E2C', '#A8743D']) : '#8E8A84';
    w.top = R.pick(TK_TOPS); w.bot = R.pick(TK_BOTS); w.build = R() * 0.6; w.beard = false;
    w.hairStyle = R.pick(['short', 'short', 'bob', 'long', 'buzz', 'pony', 'bun', 'short']);
    w.glasses = R() < 0.2; w.cap = R() < 0.06 ? R.pick(['#3B3F47', '#F0EDE4', '#3F5F8F']) : undefined;
    if (R() < 0.18) w.dress = R.pick(['#E7E2D6', '#3B3F47', '#B9A27D', '#8FB7D9', '#D98AA4']);
  }
  Object.assign(w, o || {});
  return TK.autumn() || TK.winter() ? TK.wrap(w, seed, o || {}) : TK.summer() ? TK.cool(w, seed, o || {}) : w;
};
/* the last Saturday of July, about 31 degrees: short sleeves, shorts, a sun parasol or a hand fan, a straw-coloured cap */
TK.cool = function (w, seed, o) {
  const Q = RNG(seed * 4111 + 31);
  if (o.bare == null) w.bare = Q() < 0.8;
  if (o.top != null || o.dress != null) return w;
  if (o.shorts == null && !w.dress) w.shorts = Q() < 0.3;
  const r = Q();
  if (r < 0.12 && !w.cap) w.higasa = Q.pick(['#2A2622', '#F3F1EA', '#C9B48F', '#8FB7D9']);
  else if (r < 0.22) w.uchiwa = Q.pick(['#F3F1EA', '#8FB7D9', '#E7A9A0', '#E6C24F']);
  if (!w.cap && Q() < 0.12) w.cap = '#E3D3A0';
  return w;
};
/* late November: sleeves come down, coats and scarves come out. A given outfit (a uniform, a costume) is kept. */
const TK_COATS = ['#B08A5E', '#2F3A4F', '#45474D', '#6B6A4A', '#7A3B3B', '#C9B48F', '#2A2622', '#5A6B7A'];
const TK_KNITS = ['#C9584B', '#E6C24F', '#8E8A84', '#5A6B5A', '#D9C9A8', '#3F5F8F', '#9A6A8A'];
const TK_SCARVES = ['#B5443A', '#C99A3A', '#8E8A84', '#3F5F8F', '#E7E2D6', '#6B4A6A', '#2F343B'];
TK.wrap = function (w, seed, o) {
  const Q = RNG(seed * 4111 + 29), cold = TK.winter();                  // late November, or the first week of January (2 to 10 degrees)
  if (o.bare == null) w.bare = false;
  if (o.shorts == null) w.shorts = false;
  if (o.top != null || o.dress != null) return w;
  if (w.dress && Q() < (cold ? 0.75 : 0.6)) w.dress = undefined;
  const r = Q();
  if (r < (cold ? 0.85 : 0.55)) { w.jacket = w.dress ? undefined : w.top; w.top = Q.pick(TK_COATS); w.coat = !w.dress && Q() < (cold ? 0.75 : 0.65); }
  else if (r < (cold ? 0.97 : 0.85)) w.top = Q.pick(TK_KNITS);
  if (Q() < (cold ? 0.6 : 0.4)) w.muffler = Q.pick(TK_SCARVES);
  if (cold && !w.cap && !('higasa' in o)) { const U = RNG(seed * 4111 + 37); if (U() < 0.5) w.higasa = U.pick(['#DCE5EC', '#DCE5EC', '#2F3A4F', '#2A2622', '#8E2F35', '#3F5F8F']); }   // umbrellas in the snow (clear vinyl, mostly)
  return w;
};
/* a school child: the uniform of a school day (yellow cap, randoseru) in spring and autumn; in the summer and New Year
   holidays the same child in their own clothes, on an outing with a grown-up */
TK.pupil = function (seed, o) {
  if (!TK.summer() && !TK.winter()) return TK.who(seed, o);
  const h = Object.assign({}, o); delete h.randoseru; delete h.top; delete h.bot; delete h.cap;
  return TK.who(seed, h);
};
/* a salaryman or office worker in a dark suit */
TK.salary = function (seed, o) {
  const R = RNG(seed * 313 + 9), suit = R.pick(['#2F343B', '#3B3F47', '#2F3A4F', '#4A4F57']);
  const w = Object.assign(TK.who(seed), { top: suit, bot: suit, jacket: R() < 0.8 ? '#F3F1EA' : '#CFE0EA', tie: R.pick(['#C9584B', '#3F5F8F', '#7A5BA0', '#5A6B5A', '#B9A27D']), shoe: '#2F2A26', hairStyle: R.pick(['short', 'short', 'buzz', 'short']), dress: undefined, cap: undefined, bare: false, shorts: false });
  if (TK.summer()) Object.assign(w, { top: w.jacket, jacket: undefined, tie: undefined, bare: true, higasa: undefined, uchiwa: undefined });   // Cool Biz: no jacket, no tie
  return Object.assign(w, o || {});
};
/* someone in a rental kimono (dress to the ankle, obi drawn by TK.person) */
TK.kimono = function (seed, o) {
  const R = RNG(seed * 571 + 1);
  let c = R.pick(['#E79AAE', '#8FB7D9', '#F0E4C0', '#C9A0D9', '#E9C46A', '#9FCFB1', '#E07A6A', '#F3F1EA']);
  if (TK.autumn()) c = RNG(seed * 577 + 5).pick(['#9E3B3B', '#C98A3A', '#6B4A6A', '#3F4D63', '#7A8A5A', '#B5624B', '#E9D9B0', '#5A3A4A']);   // deeper colours in autumn
  if (TK.summer()) c = RNG(seed * 577 + 7).pick(['#2F3F6A', '#F3F1EA', '#3F5F8F', '#E7A9A0', '#8FB7D9', '#2E2A26', '#C9A0D9', '#F0E4C0']);   // a cotton yukata
  if (TK.winter()) c = RNG(seed * 577 + 9).pick(['#9E2B35', '#2F3F6A', '#6B4A6A', '#C98A3A', '#1F4A3A', '#E9D9B0', '#B5443A']);   // a silk kimono for the New Year
  const fur = TK.winter() && RNG(seed * 577 + 11)() < 0.5 ? '#F6F3EA' : undefined;   // a white shawl
  return Object.assign(TK.who(seed), { dress: c, top: c, sleeve: c, obi: R.pick(['#C9584B', '#E6C24F', '#3F5F8F', '#F3F1EA', '#7A5BA0']), hairStyle: R() < 0.8 ? 'bun' : 'short', bare: false, shorts: false, shoe: '#F3F1EA', cap: undefined, jacket: undefined, coat: false }, fur ? { muffler: fur } : {}, TK.summer() ? { higasa: undefined, uchiwa: RNG(seed * 577 + 13)() < 0.4 ? '#F3F1EA' : undefined } : {}, o || {});
};
/* K.person plus Tokyo extras drawn on the returned points: obi, a bride's white hood, a priest's eboshi, a randoseru */
TK.person = function (g, x, y, z, w) {
  const k = w.k || 1, dir = w.dir | 0, back = dir >= 2, sg = (dir === 0 || dir === 3) ? 1 : -1;
  const pack = w.randoseru && !back;
  if (pack) { const F = g.p(x, y, z || 0), P = (u, v) => [F[0] + sg * u * k, F[1] + v * k]; g.fill2([P(-3.7, -15.2), P(-1.6, -15.4), P(-1.5, -10.6), P(-3.6, -10.6)], w.randoseru, true); g.outline2([P(-3.7, -15.2), P(-1.6, -15.4), P(-1.5, -10.6), P(-3.6, -10.6)], { w: 0.35, c: '#3A3128', boil: false }); }
  const r = K.person(g, x, y, z, w);
  const H = r.head, R2 = r.headR / 1.92, hp = r.hip, s = (u, v) => [H[0] + sg * u * R2, H[1] + v * R2];
  if (w.obi) {
    const sp = r.shoulders, mx = (sp[0][0] + sp[1][0]) / 2, top = lerp(sp[0][1], hp[1], 0.62), bot = lerp(sp[0][1], hp[1], 0.95), hw = 2.0 * k;
    g.fill2([[mx - hw, top], [mx + hw, top], [mx + hw * 0.95, bot], [mx - hw * 0.95, bot]], w.obi, true);
    if (back) g.fill2([[mx - 1.6 * k, top - 0.5 * k], [mx + 1.6 * k, top - 0.5 * k], [mx + 1.2 * k, bot + 1.4 * k], [mx - 1.2 * k, bot + 1.4 * k]], shade(w.obi, -0.1), true);
  }
  if (w.hood) {   // wataboshi: a white hood over the hair, open at the face
    const pts = back ? [s(-2.5, 1.6), s(-2.6, -1.0), s(-1.4, -2.9), s(0.4, -3.1), s(2.0, -2.3), s(2.6, -0.6), s(2.4, 1.8), s(0, 2.2)]
      : [s(-2.45, 1.4), s(-2.55, -1.1), s(-1.4, -2.95), s(0.4, -3.15), s(2.0, -2.35), s(2.55, -0.8), s(2.35, 0.7), s(1.75, -0.55), s(0.6, -1.15), s(-0.6, -1.0), s(-1.0, 0.2), s(-1.4, 1.5)];
    g.fill2(K.curve(pts, 2, true), '#FBFAF6', true); g.line2(K.curve(pts, 2, true), { w: 0.35, c: '#8C8576', close: true, boil: false, wob: 0.3 });
  }
  if (w.eboshi) {   // a priest's tall black cap
    const c = r.crown, hh = 4.2 * k;
    g.fill2([[c[0] - 1.6 * k, c[1] + 0.9 * k], [c[0] + 1.6 * k, c[1] + 0.9 * k], [c[0] + 1.1 * k * sg + 0.6 * sg, c[1] - hh], [c[0] - 0.9 * k + 0.6 * sg, c[1] - hh + 0.6]], '#2A2622', true);
  }
  if (w.randoseru && back) { const sp = r.shoulders, mx = (sp[0][0] + sp[1][0]) / 2, y0 = sp[0][1] + 0.4 * k; g.fill2([[mx - 2.1 * k, y0], [mx + 2.0 * k, y0], [mx + 2.0 * k, y0 + 5.0 * k], [mx - 2.1 * k, y0 + 5.0 * k]], w.randoseru, true); g.fill2([[mx - 2.1 * k, y0], [mx + 2.0 * k, y0], [mx + 2.0 * k, y0 + 1.8 * k], [mx - 2.1 * k, y0 + 1.8 * k]], shade(w.randoseru, 0.2), true); g.outline2([[mx - 2.1 * k, y0], [mx + 2.0 * k, y0], [mx + 2.0 * k, y0 + 5.0 * k], [mx - 2.1 * k, y0 + 5.0 * k]], { w: 0.35, c: '#3A3128', boil: false }); }
  if (w.phone) { const hd = r.hands[0]; g.fill2([[hd[0] - 0.45, hd[1] - 1.1], [hd[0] + 0.45, hd[1] - 1.1], [hd[0] + 0.45, hd[1] + 0.3], [hd[0] - 0.45, hd[1] + 0.3]], '#2A2622', true); }
  if (w.uchiwa) { const hd = r.hands[0], c = [hd[0] + sg * 0.6 * k, hd[1] - 2.0 * k]; g.line2([hd, c], { w: 0.35, c: '#8A6A4A', boil: false }); g.disc2(c, 1.25 * k, w.uchiwa); g.ring2(c, 1.25 * k, { c: '#5A4636', w: 0.3 }); }   // a round paper fan
  if (w.higasa) {                                                                        // a sun parasol over the head
    const hd = r.hands[0], c = [r.crown[0] + sg * 0.4 * k, r.crown[1] - 2.6 * k], um = [];
    for (let i = 0; i <= 12; i++) { const a = Math.PI + Math.PI * i / 12; um.push([c[0] + Math.cos(a) * 4.6 * k, c[1] + 1.4 * k + Math.sin(a) * 1.9 * k]); }
    g.line2([c, [hd[0], hd[1]]], { w: 0.35, c: '#4A3A2C', boil: false }); g.fill2(um, w.higasa, true); g.line2(um, { w: 0.4, c: shade(w.higasa, 0.5), boil: false });
    if (K.snowy()) g.line2(um.slice(2, 11).map((p) => [p[0], p[1] - 0.15]), { w: 0.7, c: K.SNOW, boil: false });   // snow settling on it
  }
  return r;
};
/* a crowd member seen as a bust (spectators at the sumō ring) */
TK.bust2 = function (g, p, w, k) {
  k = k || 1; const s = (u, v) => [p[0] + u * k, p[1] + v * k];
  g.fill2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], w.top, true);
  g.fill2([s(-0.55, -4.6), s(0.55, -4.6), s(0.5, -5.8), s(-0.5, -5.8)], shade(w.skin, 0.12), true);
  g.disc2(s(0, -7.6), 1.95 * k, w.skin); g.fill2(K.curve([s(-2.05, -7.2), s(-1.9, -8.9), s(0, -9.75), s(1.9, -8.9), s(2.05, -7.3), s(1.2, -8.2), s(-1.0, -8.25)], 2, true), w.hair, true);
  g.disc2(s(-0.6, -7.4), 0.22 * k, '#2A2420'); g.disc2(s(0.65, -7.4), 0.2 * k, '#2A2420');
  g.outline2([s(-2.6, 0), s(-2.4, -3.6), s(-1.2, -4.8), s(1.2, -4.8), s(2.4, -3.6), s(2.6, 0)], { w: 0.35, c: '#3A3128', boil: false });
};

/* ---------------- vehicles ---------------- */
/* a Tokyo taxi: tall and boxy, dark navy (or the old yellow / green), a lamp on the roof */
TK.taxi = function (g, ang, o) {
  o = o || {}; const col = o.col || '#2E3A55';
  K.car(g, ang, { col, L: 5.0, W: 2.45, roof: (gg, cab) => { const ca = Math.cos(ang), sa = Math.sin(ang); gg.lit({ nc: true, light: true }, () => K.rbox(gg, cab.cx, cab.cy, 0.5, 1.0, ang + Math.PI / 2, 4.8, 5.6, o.lamp || '#F1E3B0', { w: 0.45, nb: true })); } });
};
/* a kei truck: a tiny white cab and an open bed */
TK.kei = function (g, ang, o) {
  o = o || {}; const col = o.col || '#F1EFE8', L = 4.4, Wd = 2.1, ca = Math.cos(ang), sa = Math.sin(ang);
  const sh = K.rbox(g, 0, 0, L, Wd, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh);
  K.wheels(g, sh, [-L * 0.6, L * 0.62], 0.8, 'far');
  const bed = K.rbox(g, -L * 0.3 * ca, -L * 0.3 * sa, L * 0.7, Wd, ang, 0.8, 2.0, { t: '#B9B6AD', l: col, r: shade(col, 0.12) }, { w: 0.7 });
  if (o.cargo) o.cargo(g, bed);
  const cab = K.rbox(g, L * 0.7 * ca, L * 0.7 * sa, L * 0.3, Wd, ang, 0.8, 4.4, { t: shade(col, -0.15), l: col, r: shade(col, 0.12) }, { w: 0.75 });
  K.rwin(g, cab, 'pu', -0.85, 0.85, 2.6, 4.1); K.rwin(g, cab, 'pv', -0.7, 0.6, 2.6, 4.1); K.rwin(g, cab, 'nv', -0.7, 0.6, 2.6, 4.1);
  K.wheels(g, sh, [-L * 0.6, L * 0.62], 0.8, 'near', { arch: '#3F3A34' });
  K.lights(g, cab, 1.5);
};
/* a train window that is lit at night */
TK.rwinLit = function (g, B, f, a0, a1, z0, z1, o) { g.lit({ nc: '#FFE3A6' }, () => K.rwin(g, B, f, a0, a1, z0, z1, o)); };
/* one car of a train, centred on the origin, heading ang, standing at z 0 on its rails.
   kind 'yamanote' (stainless with a yellow-green band and green doors), 'shin' (white with blue lines), 'sobu' (yellow band).
   cab: +1 or -1 puts a driver's end at +u or -u (the shinkansen grows a long nose there). */
TK.trainCar = function (g, ang, o) {
  o = o || {}; const kind = o.kind || 'yamanote', hl = o.hl || 4.6, hw = o.hw || 1.55, ca = Math.cos(ang), sa = Math.sin(ang);
  const body = kind === 'shin' ? '#F3F1EA' : kind === 'frog' ? '#7FB35C' : '#D3D6D4', band = kind === 'yamanote' ? '#8CC152' : kind === 'sobu' ? '#E9C543' : kind === 'frog' ? '#C6E0A6' : '#2F5FA8';
  const z0 = 0.9, z1 = kind === 'shin' ? 4.1 : 4.5, cab = o.cab || 0;
  // bogies and the shadow of the underframe
  const sh = K.rbox(g, 0, 0, hl * 0.95, hw * 0.8, ang, 0.3, z0, { t: '#4A4540', l: '#4A4540', r: '#3A3530' }, { w: 0.5, line: false });
  for (const u of [-hl * 0.62, hl * 0.62]) K.rbox(g, u * ca, u * sa, 1.1, hw * 0.75, ang, 0.1, 0.9, { t: '#3A3530', l: '#3F3A34', r: '#2E2A26' }, { w: 0.4, line: false });
  let L0 = -hl, L1 = hl;
  const nose = kind === 'shin' && cab ? 3.2 : 0;
  if (nose) { if (cab > 0) L1 = hl - nose; else L0 = -hl + nose; }
  const cx = (L0 + L1) / 2, hb = (L1 - L0) / 2;
  const B = K.rbox(g, cx * ca, cx * sa, hb, hw, ang, z0, z1, { t: shade(body, -0.1), l: body, r: shade(body, 0.1) }, { w: 0.8, nb: true });
  for (const f of ['pv', 'nv']) if (B.vis[f]) {
    if (kind === 'yamanote') {
      g.fill(B.quad(f, -1, 1, z0 + 1.15, z0 + 1.5), band);
      for (const d of [-0.62, -0.2, 0.22, 0.64]) { g.fill(B.quad(f, d - 0.09, d + 0.09, z0 + 0.15, z1 - 0.45), '#7FB047'); TK.rwinLit(g, B, f, d - 0.06, d + 0.06, z0 + 1.9, z1 - 0.8, { col: '#BFD3DD', glint: false }); }
      for (const [a, b] of [[-0.95, -0.72], [-0.52, -0.3], [-0.1, 0.12], [0.32, 0.54], [0.74, 0.95]]) TK.rwinLit(g, B, f, a, b, z0 + 1.85, z1 - 0.75);
    } else if (kind === 'shin') {
      g.fill(B.quad(f, -1, 1, z0 + 0.9, z0 + 1.15), band); g.fill(B.quad(f, -1, 1, z0 + 1.32, z0 + 1.42), band);
      const n = 7; for (let i = 0; i < n; i++) { const a = -0.92 + 1.84 * i / n; TK.rwinLit(g, B, f, a + 0.05, a + 1.84 / n - 0.05, z0 + 1.8, z0 + 2.45, { col: '#3F4D63', glint: false }); }
    } else if (kind === 'frog') {
      g.fill(B.quad(f, -1, 1, z0 + 1.7, z1), band);
      for (const [a, b] of [[-0.88, -0.6], [-0.5, -0.22], [-0.1, 0.18], [0.3, 0.58], [0.68, 0.88]]) TK.rwinLit(g, B, f, a, b, z0 + 1.95, z1 - 0.6, { col: '#DDE8EA' });
    } else {
      g.fill(B.quad(f, -1, 1, z0 + 1.15, z0 + 1.55), band);
      for (const [a, b] of [[-0.9, -0.55], [-0.4, -0.05], [0.1, 0.45], [0.6, 0.9]]) TK.rwinLit(g, B, f, a, b, z0 + 1.9, z1 - 0.8);
    }
  }
  // ends: a cab face, or the gangway between cars
  for (const f of ['pu', 'nu']) if (B.vis[f]) {
    const isCab = (f === 'pu' && cab > 0) || (f === 'nu' && cab < 0);
    if (isCab && !nose) { g.fill(B.quad(f, -0.9, 0.9, z0 + 1.6, z1 - 0.35), '#2E3238'); g.fill(B.quad(f, -1, 1, z0 + 1.15, z0 + 1.5), band); for (const s of [-0.65, 0.65]) g.fill(B.quad(f, s - 0.15, s + 0.15, z0 + 0.6, z0 + 0.95), f === 'pu' ? '#F6E7A8' : '#D0483A'); }
    else if (!isCab) g.fill(B.quad(f, -0.35, 0.35, z0 + 0.2, z1 - 0.3), '#5A564E');
  }
  if (nose) {   // the long nose: the section shrinks and drops towards the tip
    const s = cab > 0 ? 1 : -1, base = s > 0 ? L1 : L0, n = 6, sec = [];
    for (let i = 0; i <= n; i++) { const t = i / n, u = base + s * nose * t, w = hw * (1 - 0.72 * Math.pow(t, 1.6)), zt = lerp(z1, z0 + 0.75, Math.pow(t, 0.8)); sec.push({ u, w, zt }); }
    const W = (u, v, zz) => [u * ca - v * sa, u * sa + v * ca, zz];
    const nx = ca * s, ny = sa * s, side = (v) => (-sa * v + ca * v * 0) + 0;   // unused helper keeps the formula visible
    const visP = (-sa + ca) > 0, sv = visP ? 1 : -1;     // which side (+v / -v) faces the viewer
    const sidePts = sec.map((q) => W(q.u, sv * q.w, z0)).concat(sec.slice().reverse().map((q) => W(q.u, sv * q.w, q.zt)));
    const topPts = sec.map((q) => W(q.u, -q.w, q.zt)).concat(sec.slice().reverse().map((q) => W(q.u, q.w, q.zt)));
    g.fill(sidePts, shade(body, 0.06)); g.fill(topPts, shade(body, -0.12));
    g.fill(sec.slice(0, 4).map((q) => W(q.u, sv * q.w, z0 + 0.9)).concat(sec.slice(0, 4).reverse().map((q) => W(q.u, sv * q.w, z0 + 1.15))), band);
    const wsP = [W(sec[1].u, -sec[1].w * 0.7, sec[1].zt + 0.02), W(sec[1].u, sec[1].w * 0.7, sec[1].zt + 0.02), W(sec[2].u, sec[2].w * 0.6, sec[2].zt + 0.02), W(sec[2].u, -sec[2].w * 0.6, sec[2].zt + 0.02)];
    g.fill(wsP, '#2E3238');
    g.outline(sidePts, { w: 0.7, boil: false }); g.outline(topPts, { w: 0.6, boil: false });
    void nx; void ny; void side;
  }
  if (o.panto) {   // a pantograph: a folded diamond on the roof
    const P = (u, v, zz) => g.p(u * ca - v * sa, u * sa + v * ca, zz), u0 = o.panto;
    const a = P(u0 - 0.9, 0, z1), b = P(u0 + 0.9, 0, z1), c = P(u0, 0, z1 + 1.4), l = P(u0 - 0.2, -1.1, z1 + 1.45), r = P(u0 - 0.2, 1.1, z1 + 1.45);
    g.segs2([a[0], a[1], c[0], c[1], b[0], b[1], c[0], c[1], l[0], l[1], r[0], r[1]], '#3A3530', 0.4);
  }
};
/* a yakatabune: a long pleasure boat with a house on it, shōji windows and a row of red lanterns */
TK.yakata = function (g, ang, o) {
  o = o || {}; const L = o.L || 6.2, Wd = o.W || 2.0, ca = Math.cos(ang), sa = Math.sin(ang);
  K.boat(g, ang, { kind: 'row', L, W: Wd, hull: o.hull || '#8A5A3A', deck: '#C9A26B' });
  const B = K.rbox(g, -L * 0.1 * ca, -L * 0.1 * sa, L * 0.68, Wd * 0.82, ang, 1.4, 3.6, { t: '#E9E2CF', l: '#F3EFE3', r: '#DCD4C0' }, { w: 0.6, nb: true, nt: true });
  for (const f of ['pv', 'nv']) if (B.vis[f]) { const n = 6; for (let i = 0; i < n; i++) { const q = B.quad(f, -0.9 + 1.8 * i / n + 0.03, -0.9 + 1.8 * (i + 1) / n - 0.03, 1.9, 3.2); g.fill(q, '#FBF6E8'); g.mark({ nc: '#FFDE9C' }); g.outline(q, { w: 0.3, c: '#8A7A5A', boil: false, ext: 0 }); } }
  const R = K.rbox(g, -L * 0.1 * ca, -L * 0.1 * sa, L * 0.78, Wd * 1.0, ang, 3.6, 4.3, { t: '#6E4A36', l: '#7E5A44', r: '#5E3E2C' }, { w: 0.65 });
  const lp = []; for (const f of ['pv', 'nv']) if (R.vis[f]) for (let i = 0; i < 7; i++) { const q = R.quad(f, -0.9 + 1.8 * i / 6, -0.9 + 1.8 * i / 6, 3.3, 3.3)[0]; lp.push(g.p(q[0], q[1], q[2])); }
  for (const p of lp) TK.lantern2(g, p, 0.55, '#D4553A');
};
/* a rickshaw (jinrikisha) pulled by a runner, heading ang; ph = the runner's step; riders: whos */
TK.rickshaw = function (g, ang, ph, puller, riders) {
  const ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z);
  const visP = (-sa + ca) > 0, sv = visP ? 1 : -1;
  const wheel = (v) => { const pts = [], hub = P(-0.6, v, 2.3); for (let i = 0; i < 20; i++) { const t = TAU * i / 20; pts.push(P(-0.6 + Math.cos(t) * 2.3, v, 2.3 + Math.sin(t) * 2.3)); } g.line2(pts, { w: 0.75, c: '#2E2A26', close: true, boil: false, wob: 0.2 }); const sp = []; for (let i = 0; i < 6; i++) { const t = TAU * i / 6, e = P(-0.6 + Math.cos(t) * 2.2, v, 2.3 + Math.sin(t) * 2.2); sp.push(hub[0], hub[1], e[0], e[1]); } g.segs2(sp, '#6E5A44', 0.3); g.disc2(hub, 0.35, '#2E2A26'); };
  wheel(-sv * 1.7);
  const dir = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2);
  // the seat box and its folded black hood
  const seat = K.rbox(g, -0.7 * ca, -0.7 * sa, 1.4, 1.5, ang, 2.3, 3.7, { t: '#3A3530', l: '#4A3A30', r: '#3A2A22' }, { w: 0.6 });
  (riders || []).forEach((w, i) => { const v = (i - (riders.length - 1) / 2) * 1.1, p = [(-0.9) * ca - v * sa, (-0.9) * sa + v * ca]; K.person(g, p[0], p[1], 3.7, Object.assign({}, w, { dir, pose: 'sit', k: 0.88 })); });
  const hood = [P(-2.3, -1.6, 3.7), P(-2.3, 1.6, 3.7), P(-2.0, 1.5, 6.6), P(-2.0, -1.5, 6.6)]; g.fill2(hood, '#2E2A26'); g.outline2(hood, { w: 0.45, boil: false });
  // shafts forward to the runner's hands
  const s0 = P(0.6, -1.3, 3.0), s1 = P(4.6, -1.2, 3.3), s2 = P(0.6, 1.3, 3.0), s3 = P(4.6, 1.2, 3.3);
  g.segs2([s0[0], s0[1], s1[0], s1[1], s2[0], s2[1], s3[0], s3[1]], '#2E2A26', 0.55);
  wheel(sv * 1.7);
  const F = P(5.2, 0, 0), rel = (q) => [q[0] - F[0], q[1] - F[1]];
  K.person(g, 5.2 * ca, 5.2 * sa, 0, Object.assign({}, puller, { dir, pose: 'walk', ph, hands: [rel(s1), rel(s3)] }));
};
/* a turret truck (tāre) of the fish market: a drum engine with a wheel on top, a flat bed; the driver stands */
TK.turret = function (g, ang, who, cargo) {
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const sh = K.rbox(g, 0, 0, 3.4, 1.6, ang, 0, 0.01, '#888', { line: false, nt: true }); K.shadow(g, sh);
  K.wheels(g, sh, [-2.6, 2.6], 0.55, 'far');
  const bed = K.rbox(g, -0.7 * ca, -0.7 * sa, 2.7, 1.6, ang, 0.55, 1.15, { t: '#C9C6BD', l: '#9FA39E', r: '#8A8E89' }, { w: 0.55 });
  if (cargo) cargo(g, bed);
  K.wheels(g, sh, [-2.6, 2.6], 0.55, 'near', { arch: '#3F3A34' });
  K.cyl(g, 2.3 * ca, 2.3 * sa, 1.35, 0.4, 3.0, o_drum(), { w: 0.6, n: 10 });
  const top = g.p(2.3 * ca, 2.3 * sa, 3.6); g.line2(arcPts(top[0], top[1], 1.6, 0, TAU, 14).map((p) => [p[0], top[1] + (p[1] - top[1]) * 0.45]), { w: 0.55, c: '#2E2A26', close: true, boil: false });
  const dir = (ca + sa > 0) ? (ca - sa > 0 ? 0 : 1) : (ca - sa > 0 ? 3 : 2);
  const F = g.p(1.0 * ca, 1.0 * sa, 1.15);
  K.person(g, 1.0 * ca, 1.0 * sa, 1.15, Object.assign({}, who, { dir, pose: 'stand', reach: [top[0] - F[0], top[1] - F[1] + 0.5] }));
  function o_drum() { return { t: '#5FA58F', l: '#4F9A82', r: '#3F8270' }; }
};

/* ---------------- sumō ---------------- */
/* a rikishi: a big round body, a dark mawashi, thick legs in a low stance, a topknot. dir as K.person; push 0..1 leans
   in; arms reach forward to hold the other wrestler */
TK.rikishi = function (g, x, y, z, o) {
  o = o || {}; const F = g.p(x, y, z || 0), k = o.k || 1, dir = o.dir | 0, sg = (dir === 0 || dir === 3) ? 1 : -1, back = dir >= 2;
  const skin = o.skin || '#E8BE9A', mw = o.mawashi || '#2F3A4F', lean = 1.6 + (o.push || 0) * 1.6, ink = '#3A3128';
  const P = (u, v) => [F[0] + sg * (u + lean * clamp((-v - 7) / 9, 0, 1.6)) * k, F[1] + v * k];
  const PP = (a) => a.map((q) => P(q[0], q[1]));
  const sh = (pts, col, w) => { const s = PP(pts); g.fill2(s, col, true); if (w !== 0) g.line2(s, { w: w || 0.5, c: ink, close: true, boil: false, wob: 0.3 }); };
  const leg = (u0, u1, far) => sh(K.curve([[u0 - 1.5, -6.5], [u1 - 1.4, -2.6], [u1 - 1.3, 0], [u1 + 1.5, 0], [u1 + 1.3, -2.8], [u0 + 1.6, -6.4]], 2, true), far ? shade(skin, 0.12) : skin);
  leg(1.6, 3.4, true);
  if (!back) sh(K.curve([[3.5, -15.5], [6.6, -13.4], [7.4, -12.6], [6.7, -11.9], [3.6, -12.6]], 2, true), shade(skin, 0.12));    // far arm
  // the body: a big pear with the belly forward
  const body = K.curve([[-3.6, -7.0], [-4.4, -10.6], [-3.6, -14.8], [-1.6, -16.4], [1.6, -16.4], [3.6, -14.6], [4.9, -11.0], [4.5, -7.6], [2.0, -6.2], [-1.6, -6.2]], 3, true);
  sh(body, skin, 0.6);
  g.fill2(PP([[1.0, -16.0], [3.4, -14.4], [4.6, -11.0], [4.2, -8.2], [2.6, -7.4], [2.8, -11.2]]), shade(skin, 0.1), true);
  leg(-2.2, -3.6, false);
  // the mawashi round the waist with its hanging cords at the front
  sh([[-3.9, -8.9], [4.6, -8.9], [4.3, -6.9], [-3.6, -6.8]], mw, 0.5);
  if (!back) { const c = []; for (let i = 0; i < 5; i++) { const u = 1.0 + i * 0.6, a = P(u, -6.9), b = P(u + 0.1, -4.4); c.push(a[0], a[1], b[0], b[1]); } g.segs2(c, shade(mw, -0.2), 0.45); }
  else sh([[-0.8, -8.8], [0.8, -8.8], [0.5, -5.2], [-0.5, -5.2]], mw, 0.4);
  // the near arm reaching forward
  sh(K.curve([[-1.2, -15.6], [3.4, -14.6], [7.0, -12.8], [7.6, -11.6], [6.6, -11.2], [2.8, -12.6], [-1.6, -13.2]], 2, true), skin);
  // head: neck sunk in the shoulders, hair slicked into a topknot
  const hc = [2.3, -18.0], hd = PP(K.curve([[hc[0] - 1.8, hc[1]], [hc[0] - 1.5, hc[1] - 1.7], [hc[0] + 0.2, hc[1] - 2.2], [hc[0] + 1.8, hc[1] - 1.2], [hc[0] + 1.7, hc[1] + 1.0], [hc[0] + 0.4, hc[1] + 2.1], [hc[0] - 1.2, hc[1] + 1.5]], 2, true));
  g.fill2(hd, skin, true); g.line2(hd, { w: 0.5, c: ink, close: true, boil: false, wob: 0.3 });
  sh(K.curve([[hc[0] - 1.9, hc[1] + 0.2], [hc[0] - 1.6, hc[1] - 1.8], [hc[0] + 0.3, hc[1] - 2.35], [hc[0] + 1.6, hc[1] - 1.5], [hc[0] + 0.8, hc[1] - 1.0], [hc[0] - 0.6, hc[1] - 0.6], [hc[0] - 1.2, hc[1] + 0.6]], 2, true), '#1F1A18', 0);
  sh([[hc[0] - 0.4, hc[1] - 2.1], [hc[0] + 1.4, hc[1] - 2.9], [hc[0] + 1.7, hc[1] - 2.4], [hc[0] + 0.3, hc[1] - 1.7]], '#1F1A18', 0);   // the topknot
  if (!back) { g.disc2(P(hc[0] + 0.9, hc[1] - 0.2), 0.22 * k, '#2A2420'); g.fill2(PP([[hc[0] + 1.0, hc[1] + 1.0], [hc[0] + 1.5, hc[1] + 0.9], [hc[0] + 1.2, hc[1] + 1.2]]), '#9B5148', true); }
};
