'use strict';
/* (0,-1) Lombard Street.
   A steep wedge of hill: level along the back, where the cable car waits at the crest, then falling straight towards
   the street in front of City Hall. A broad red road snakes down through four hairpins between beds of hydrangeas.
   A long flight of steps climbs the left side past bay-fronted Victorians that step up the hill a storey at a time;
   three more houses stand along the right-hand edge above a tall earth wall.
   Houses on a slope: each one's floor is set by the ground at its downhill (front-left) face; the side that faces
   across the slope meets the ground along a sloping line, the way a San Francisco row house does. */
SF.tile('lombard', 0, -100, { rim: 9 }, function (T) {
  const H = 37, ZT = 21, ZB = 0.8, YC = -29.5, YF = 32;
  const hAt = (y) => (y <= YC ? ZT : y >= YF ? ZB : ZT + (ZB - ZT) * (y - YC) / (YF - YC));
  const XS0 = -26.6, XS1 = -22.4, XB0 = -21.8, XB1 = 21.6, SH = 4.4;
  const PAVE = '#E7E2D6', CREST = '#E3DDCF', BED = '#A6C788', ROAD = '#C55A4A', ROADD = '#9E4134', EARTH = '#D9C5A4', TRIM = '#F7F5EF';
  const DX = Math.atan2(AY, AX), DY = Math.atan2(AY, -AX);
  /* lay a ground polygon on the hill, splitting its edges so it bends over the crest and the foot */
  const drape = (pts, n, dz) => { const o = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; for (let k = 0; k < n; k++) { const x = lerp(a[0], b[0], k / n), y = lerp(a[1], b[1], k / n); o.push([x, y, hAt(y) + (dz || 0)]); } } return o; };
  const on = (x, y, dz) => [x, y, hAt(y) + (dz || 0)];

  /* ---------- the road: a squared sine gives long traverses and tight round hairpins ---------- */
  const AMP = 13.6, PW = 0.4, RW = 3.5;
  const resample = (pts, step) => {
    const out = [pts[0].slice()]; let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      let a = pts[i - 1], d = Math.hypot(pts[i][0] - a[0], pts[i][1] - a[1]);
      while (acc + d >= step) { const t = (step - acc) / d, q = [a[0] + (pts[i][0] - a[0]) * t, a[1] + (pts[i][1] - a[1]) * t]; out.push(q); a = q; d = Math.hypot(pts[i][0] - a[0], pts[i][1] - a[1]); acc = 0; }
      acc += d;
    }
    out.push(pts[pts.length - 1].slice()); return out;
  };
  const raw = [];
  for (let i = 0; i <= 3000; i++) { const th = lerp(-0.06, 4 * Math.PI + 0.37, i / 3000), s = Math.sin(th); raw.push([AMP * Math.sign(s) * Math.pow(Math.abs(s), PW), -30.6 + 66 * th / (4 * Math.PI)]); }
  const CL = resample(raw, 0.6);                                     // centreline, 0.6 u apart
  const ANG = CL.map((p, i) => { const a = CL[Math.max(0, i - 1)], b = CL[Math.min(CL.length - 1, i + 1)]; return Math.atan2(b[1] - a[1], b[0] - a[0]); });
  const side = (w) => CL.map((p, i) => [clamp(p[0] - Math.sin(ANG[i]) * w, -H, H), clamp(p[1] + Math.cos(ANG[i]) * w, -H, H)]);
  const EL = side(RW), ER = side(-RW);
  const TIPS = [0, 1, 2, 3].map((k) => [(k % 2 ? -1 : 1) * (AMP - 5.1 - 1.5), -30.6 + 66 * (0.125 + 0.25 * k)]);
  const roadDist = (x, y) => { let m = 1e9; for (const p of CL) { const d = (p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y); if (d < m) m = d; } return Math.sqrt(m); };

  /* ---------- the hill ---------- */
  T.ground(function (g) { K.slab(g, H, { top: PAVE }); }, { rim: true });
  T.obj([-H, -H, H, H], function (g) {
    // the whole top: crest, slope, foot
    g.fill(drape([[-H, -H], [H, -H], [H, H], [-H, H]], 12, 0), PAVE);
    g.fill(drape([[-H, -H], [H, -H], [H, YC], [-H, YC]], 6, 0.01), CREST);
    g.scuff(drape([[-H, -H], [H, -H], [H, YC], [-H, YC]], 6, 0.02), { dir: DX, len: 6, c: '#EEE9DE', dens: 1.2, w: 0.8, spread: 0.06 });
    g.scuff(drape([[XB1, YF], [H, YF], [H, H], [-H, H], [-H, YF]], 4, 0.02), { dir: DX, len: 5, c: '#F2EEE5', dens: 1.4, w: 0.8, spread: 0.06 });
    g.line(drape([[-H, YC], [H, YC]], 6, 0.02).slice(0, 7), { w: 0.55, c: '#A39C8E', boil: false });
    // cable-car rails along the crest
    for (const y of [-35.5, -33.1]) g.line([[XS0, y, ZT + 0.02], [H, y, ZT + 0.02]], { w: 0.55, c: '#5F584C', boil: false, wob: 0.4 });
    // beds between the steps and the right-hand houses
    const bed = drape([[XB0, YC + 0.4], [XB1, YC + 0.4], [XB1, YF - 0.4], [XB0, YF - 0.4]], 8, 0.02);
    g.fill(bed, BED); g.grass(bed, { dens: 0.55 }); g.outline(bed, { w: 0.6, c: '#6F8F50', boil: false });
    // the road, its edges, sparse direction dashes and the pale tips inside each hairpin
    const road = EL.map((p) => [p[0], p[1], hAt(p[1]) + 0.05]).concat(ER.slice().reverse().map((p) => [p[0], p[1], hAt(p[1]) + 0.05]));
    g.fill(road, ROAD);
    g.scuff(road, { dir: DX, len: 3.6, c: '#B44C3E', dens: 0.9, w: 0.7, spread: 1.4 });
    g.scuff(road, { dir: DX, len: 2.4, c: '#D47364', dens: 0.6, w: 0.7, spread: 1.4 });
    for (const E of [EL, ER]) { const pts = E.map((p) => [p[0], p[1], hAt(p[1]) + 0.06]); for (let i = 0; i < pts.length - 1; i += 40) g.line(pts.slice(i, Math.min(pts.length, i + 41)), { w: 0.6, c: ROADD, boil: false, wob: 0.5 }); }
    for (let i = 22; i < CL.length - 8; i += 25) { const a = CL[i], b = CL[i + 3]; g.line([[a[0], a[1], hAt(a[1]) + 0.07], [b[0], b[1], hAt(b[1]) + 0.07]], { w: 0.9, c: '#F2E2D8', boil: false, ext: 0, taper: 0.6 }); }
    for (const [tx, ty] of TIPS) { const s = Math.sign(tx), pts = []; for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + Math.PI * i / 10; pts.push([tx + s * Math.cos(a) * 1.6, ty + Math.sin(a) * 1.9]); } pts.push([tx - s * 2.2, ty + 1.2], [tx - s * 2.2, ty - 1.2]); const q = pts.map((p) => [p[0], p[1], hAt(p[1]) + 0.08]); g.fill(q, '#F3E9D8'); g.outline(q, { w: 0.55, c: '#B9A88C', boil: false }); }
    // the steps: a long stone flight, a tread every metre, the riser shadow under each one
    const st = drape([[XS0, YC], [XS1, YC], [XS1, YF + 2], [XS0, YF + 2]], 8, 0.04);
    g.fill(st, '#ECE8DF');
    const tr = [], rs = [];
    for (let y = YC + 0.8; y < YF + 1.6; y += 1.05) { const a = g.p(XS0, y, hAt(y) + 0.05), b = g.p(XS1, y, hAt(y) + 0.05); tr.push(a[0], a[1], b[0], b[1]); const c = g.p(XS0, y + 0.3, hAt(y + 0.3) + 0.05), d = g.p(XS1, y + 0.3, hAt(y + 0.3) + 0.05); rs.push(c[0], c[1], d[0], d[1]); }
    g.segs2(rs, '#D6D0C3', 0.9); g.segs2(tr, '#8E877A', 0.45, true);
    g.line(drape([[XS0, YC], [XS0, YF + 2]], 6, 0.05).slice(0, 7), { w: 0.75 });
    g.line(drape([[XS1, YC], [XS1, YF + 2]], 6, 0.05).slice(0, 7), { w: 0.75 });
    // the tall earth wall facing lower-right, and the thin lip along the front
    const wall = [[H, -H, 0]]; for (let i = 0; i <= 14; i++) { const y = lerp(-H, H, i / 14); wall.push([H, y, hAt(y)]); } wall.push([H, H, 0]);
    g.fill(wall, EARTH);
    g.scratch(wall, { dir: Math.atan2(-AY, AX), dens: 0.8, c: '#C4AF8C' });
    g.scuff(wall, { dir: Math.atan2(-AY, AX), len: 6, c: '#E6D6BA', dens: 0.7, w: 0.7, spread: 0.08 });
    g.line(wall.slice(1, wall.length - 1), { w: 0.95 });
    g.line([[H, -H, 0], [H, -H, ZT]], { w: 0.9 }); g.line([[H, -H, 0], [H, H, 0]], { w: 0.9 });
    g.fill([[-H, H, 0], [H, H, 0], [H, H, ZB], [-H, H, ZB]], C.slab);
    g.line([[-H, H, ZB], [H, H, ZB]], { w: 0.8 });
  }, { name: 'hill' });

  /* ---------- hydrangeas, grouped in small cells so cars sort correctly between them ---------- */
  const FLW = [['#E68FB5', '#C26C96', '#F6C2D7'], ['#F2B4CC', '#D18BA9', '#FBD9E6'], ['#B9A0DB', '#8E76BF', '#D8CAEE'], ['#9F8AD2', '#7562AE', '#C4B6EA'],
    ['#9BB7E4', '#6F8EC4', '#C6D7F2'], ['#F5F1EA', '#C9C0BA', '#FFFFFF'], ['#D66D9F', '#A9497A', '#EE9EC2']];
  const palAt = (x, y) => {
    const n = vnoise2(x / 9, y / 9, 41), u = (y - YC) / (YF - YC);
    if (n > 0.78) return FLW[5];
    if (u < 0.3) return FLW[n < 0.4 ? 0 : n < 0.62 ? 1 : 6];
    if (u < 0.68) return FLW[n < 0.36 ? 2 : n < 0.58 ? 4 : n < 0.7 ? 3 : 1];
    return FLW[n < 0.45 ? 0 : n < 0.6 ? 6 : 1];
  };
  const shrub = (g, x, y, R) => {
    const p = g.p(x, y, hAt(y)), r = R * 4.4, pal = palAt(x, y), rn = RNG(Math.round(x * 97 + y * 31 + 7));
    g.disc2([p[0] + r * 0.1, p[1] - r * 0.5], r * 1.18, '#7FA75C');
    g.disc2([p[0] + r * 0.45, p[1] - r * 0.32], r * 0.8, '#68904B');
    const heads = [[-0.5, -0.85], [0.52, -0.78], [0.02, -1.42]].slice(0, 2 + (rn() < 0.6 ? 1 : 0));
    heads.sort((a, b) => a[1] - b[1]);
    for (const [hx, hy] of heads) {
      const c = [p[0] + hx * r + (rn() - 0.5) * 0.8, p[1] + hy * r], rh = r * (0.62 + rn() * 0.12);
      g.disc2(c, rh, pal[0]);
      g.fill2(arcPts(c[0], c[1], rh, -0.2, 1.75, 6), pal[1]);
      g.disc2([c[0] - rh * 0.3, c[1] - rh * 0.32], rh * 0.42, pal[2]);
      g.ring2(c, rh, { c: pal[1], w: 0.4 });
      const f = []; for (let k = 0; k < 3; k++) { const a = rn() * TAU, d = rn() * rh * 0.6; f.push(c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d, c[0] + Math.cos(a) * d + 0.5, c[1] + Math.sin(a) * d + 0.3); }
      g.segs2(f, pal[1], 0.4);
    }
  };
  const BUSH = [], rb = RNG('lombard-beds');
  for (let y = YC + 1.6; y < YF - 0.8; y += 2.3) for (let x = XB0 + 1.2 + ((Math.round(y) & 1) ? 1.1 : 0); x < XB1 - 0.8; x += 2.5) {
    const px = x + (rb() - 0.5) * 1.2, py = y + (rb() - 0.5) * 1.0;
    if (roadDist(px, py) < RW + 1.15) continue;
    if (TIPS.some((t) => Math.hypot(t[0] - px, t[1] - py) < 2.6)) continue;
    BUSH.push([px, py, 0.88 + rb() * 0.3]);
  }
  const CELL = 5;
  for (let cy = YC; cy < YF; cy += CELL) for (let cx = XB0; cx < XB1; cx += CELL) {
    const inside = BUSH.filter((b) => b[0] >= cx && b[0] < cx + CELL && b[1] >= cy && b[1] < cy + CELL).sort((a, b) => a[0] + a[1] - b[0] - b[1]);
    if (!inside.length) continue;
    T.obj([cx, cy, cx + CELL, cy + CELL], (g) => { for (const b of inside) shrub(g, b[0], b[1], b[2]); }, { on: true, name: 'beds' });
  }
  // the right-hand handrail of the steps stands in front of anyone climbing them
  T.obj([XS1 - 0.4, YC, XS1 - 0.1, YF + 2], function (g) {
    const posts = [], x = XS1 - 0.25, top = [];
    for (let y = YC + 1; y <= YF + 1.6; y += 3.4) { const a = g.p(x, y, hAt(y)), b = g.p(x, y, hAt(y) + 2.6); posts.push(a[0], a[1], b[0], b[1]); top.push([x, y, hAt(y) + 2.6]); }
    g.segs2(posts, '#4A453C', 0.6, true); g.line(top, { w: 0.55, c: '#4A453C', boil: false, wob: 0.3 });
  }, { on: true });
  T.obj([XS0 + 0.1, YC, XS0 + 0.4, YF + 2], function (g) {
    const x = XS0 + 0.25, top = []; for (let y = YC + 1; y <= YF + 1.6; y += 3.4) top.push([x, y, hAt(y) + 2.6]);
    g.line(top, { w: 0.5, c: '#4A453C', boil: false, wob: 0.3 });
  }, { on: true });

  /* ---------- houses ---------- */
  const glassWin = (g, face, p, a0, a1, z0, z1) => {
    g.fill(K.on(face, p, a0 - 0.32, a1 + 0.32, z0 - 0.3, z1 + 0.32), TRIM);
    K.win(g, face, p, a0, a1, z0, z1, { style: 'glass', w: 0.5 });
    g.line([K.pt(face, p, a0 - 0.5, z1 + 0.55), K.pt(face, p, a1 + 0.5, z1 + 0.55)], { w: 0.55, boil: false });
  };
  /* d: { x0, y0, x1, y1, n storeys, base (foundation or garage storey), col, front: 'R' (faces the steps) | 'L' (faces downhill),
          roof: 'gable' | 'flat' | 'deck', roofCol, bay, garage, turret, chimney: [x, y] } */
  const house = (g, d) => {
    const { x0, y0, x1, y1, col } = d, zl = hAt(y1), z0 = zl + d.base, top = z0 + d.n * SH;
    const tone = { t: shade(col, -0.22), l: col, r: shade(col, 0.13) };
    const rb = []; for (let i = 0; i <= 8; i++) { const y = lerp(y1, y0, i / 8); rb.push([x1, y, hAt(y)]); }
    const Rf = rb.concat([[x1, y0, top], [x1, y1, top]]), Lf = [[x0, y1, zl], [x1, y1, zl], [x1, y1, top], [x0, y1, top]];
    // hidden back edges for the construction drawing
    g.line([[x0, y1, top], [x0, y0, top], [x1, y0, top]], { w: 0.5, co: true }); g.line([[x0, y0, hAt(y0)], [x0, y0, top]], { w: 0.5, co: true });
    g.fill(Lf, tone.l); g.fill(Rf, tone.r);
    // foundation / garage storey: concrete, following the ground
    const fb = rb.map((p) => [p[0], p[1], Math.max(p[2], z0)]).reverse();
    g.fill([[x0, y1, zl], [x1, y1, zl], [x1, y1, z0], [x0, y1, z0]], '#DAD5CA');
    g.fill(rb.concat(fb), '#CDC8BC');
    g.line([[x0, y1, z0], [x1, y1, z0], [x1, y0, Math.max(z0, hAt(y0))]], { w: 0.55, boil: false });
    if (d.garage) {
      const a0 = d.front === 'L' ? x0 + 1.4 : x0 + 1.6, a1 = a0 + 4.8, gz = Math.min(z0 - 0.4, zl + 2.8);
      g.fill(K.on('L', y1, a0, a1, zl, gz), '#EDE8DD'); g.outline(K.on('L', y1, a0, a1, zl, gz), { w: 0.6 });
      const sl = []; for (let z = zl + 0.55; z < gz - 0.1; z += 0.55) { const a = g.p(a0 + 0.1, y1, z), b = g.p(a1 - 0.1, y1, z); sl.push(a[0], a[1], b[0], b[1]); } g.segs2(sl, '#B8B1A3', 0.45);
    }
    // storeys: a trim band at each floor, windows with white surrounds where they clear the ground
    for (let k = 0; k <= d.n; k++) { const z = z0 + k * SH; if (k > 0 && k < d.n) { g.fine([[x0, y1, z], [x1, y1, z]], { w: 0.45, c: shade(col, 0.4) }); const p = rb.filter((q) => q[2] < z).map((q) => [x1, q[1], z]); if (p.length > 1) g.fine(p, { w: 0.45, c: shade(col, 0.4) }); } }
    const wL = x1 - x0, nL = Math.max(1, Math.floor((wL - 1.4) / 3.3)), wR = y1 - y0, nR = Math.max(1, Math.floor((wR - 1.4) / 3.3));
    const skipL = d.front === 'L' && (d.bay || d.door) ? [x1 - 3.4 - 1.2, x1 - 1.2, (x0 + x1) / 2 - 3.4, (x0 + x1) / 2 + 1.8] : null;
    const skipR = d.front === 'R' && (d.bay || d.door) ? [y1 - 3.6, y1 - 0.8, (y0 + y1) / 2 - 3.6, (y0 + y1) / 2 + 1.6] : null;
    for (let k = 0; k < d.n; k++) {
      const zf = z0 + k * SH;
      for (let i = 0; i < nL; i++) { const m = x0 + (i + 0.5) * wL / nL; if (skipL && ((m > skipL[0] && m < skipL[1] && k === 0) || (d.bay && m > skipL[2] && m < skipL[3] && k < 2))) continue; glassWin(g, 'L', y1, m - 0.65, m + 0.65, zf + 1.1, zf + 3.4); }
      for (let i = 0; i < nR; i++) { const m = y0 + (i + 0.5) * wR / nR; if (hAt(m + 0.65) + 0.9 > zf + 1.1) continue; if (skipR && ((m > skipR[0] && m < skipR[1] && k === 0) || (d.bay && m > skipR[2] && m < skipR[3] && k < 2))) continue; glassWin(g, 'R', x1, m - 0.65, m + 0.65, zf + 1.1, zf + 3.4); }
    }
    // the front door and its stoop
    if (d.front === 'R') {
      const ya = y1 - 3.3, yb = y1 - 1.5, gz = hAt(yb + 1);
      K.box(g, x1, ya - 0.3, x1 + 1.7, yb + 0.3, Math.min(gz, z0) - 0.1, z0, { t: '#EDE9E0', l: '#E4DFD4', r: '#D2CCC0' }, { w: 0.6, nohid: true });
      const tr = []; for (let s = 1; s < 4; s++) { const z = lerp(gz, z0, s / 4), a = g.p(x1 + 1.7 * (1 - s / 4), ya - 0.3, z), b = g.p(x1 + 1.7 * (1 - s / 4), yb + 0.3, z); tr.push(a[0], a[1], b[0], b[1]); } g.segs2(tr, '#A39C8E', 0.45);
      g.fill(K.on('R', x1, ya, yb, z0, z0 + 3.3), shade(d.door || '#6D4E3A', 0)); g.outline(K.on('R', x1, ya, yb, z0, z0 + 3.3), { w: 0.6 });
      g.fill(K.on('R', x1, ya + 0.3, yb - 0.3, z0 + 2.2, z0 + 3.0), C.glass);
    } else {
      const xa = x1 - 3.3, xb = x1 - 1.5, gz = hAt(y1 + 1.7);
      K.box(g, xa - 0.3, y1, xb + 0.3, y1 + 1.7, Math.min(gz, z0) - 0.1, z0, { t: '#EDE9E0', l: '#E4DFD4', r: '#D2CCC0' }, { w: 0.6, nohid: true });
      const tr = []; for (let s = 1; s < 4; s++) { const z = lerp(gz, z0, s / 4), a = g.p(xa - 0.3, y1 + 1.7 * (1 - s / 4), z), b = g.p(xb + 0.3, y1 + 1.7 * (1 - s / 4), z); tr.push(a[0], a[1], b[0], b[1]); } g.segs2(tr, '#A39C8E', 0.45);
      g.fill(K.on('L', y1, xa, xb, z0, z0 + 3.3), d.door || '#6D4E3A'); g.outline(K.on('L', y1, xa, xb, z0, z0 + 3.3), { w: 0.6 });
      g.fill(K.on('L', y1, xa + 0.3, xb - 0.3, z0 + 2.2, z0 + 3.0), C.glass);
    }
    // a two-storey bay window
    if (d.bay) {
      const bt = { t: shade(col, -0.25), l: shade(col, -0.04), r: shade(col, 0.1) }, za = z0 + 0.2, zb = z0 + Math.min(2, d.n) * SH - 0.4;
      if (d.front === 'R') {
        const m = (y0 + y1) / 2 - 1, ya = m - 2.6, yb = m + 2.6, xo = x1 + 1.5;
        K.box(g, x1, ya, xo, yb, za, zb, bt, { w: 0.75, nohid: true });
        for (let k = 0; k < Math.min(2, d.n); k++) { const zf = z0 + k * SH; glassWin(g, 'R', xo, ya + 0.8, yb - 0.8, zf + 1.1, zf + 3.3); glassWin(g, 'L', yb, x1 + 0.4, xo - 0.4, zf + 1.1, zf + 3.3); }
        K.box(g, x1, ya - 0.3, xo + 0.3, yb + 0.3, zb, zb + 0.6, { t: TRIM, l: TRIM, r: '#E3E0D8' }, { w: 0.6, nohid: true });
      } else {
        const m = (x0 + x1) / 2 - 1, xa = m - 2.6, xb = m + 2.6, yo = y1 + 1.5;
        K.box(g, xa, y1, xb, yo, za, zb, bt, { w: 0.75, nohid: true });
        for (let k = 0; k < Math.min(2, d.n); k++) { const zf = z0 + k * SH; glassWin(g, 'L', yo, xa + 0.8, xb - 0.8, zf + 1.1, zf + 3.3); glassWin(g, 'R', xb, y1 + 0.4, yo - 0.4, zf + 1.1, zf + 3.3); }
        K.box(g, xa - 0.3, y1, xb + 0.3, yo + 0.3, zb, zb + 0.6, { t: TRIM, l: TRIM, r: '#E3E0D8' }, { w: 0.6, nohid: true });
      }
    }
    // outline of the body
    g.line([[x0, y1, zl], [x1, y1, zl]], { w: 0.95 }); g.line(rb, { w: 0.85 });
    g.line([[x1, y1, zl], [x1, y1, top]], { w: 0.85 }); g.line([[x0, y1, zl], [x0, y1, top]], { w: 0.95 }); g.line([[x1, y0, hAt(y0)], [x1, y0, top]], { w: 0.95 });
    // cornice with a row of little brackets under it
    K.box(g, x0 - 0.4, y0 - 0.4, x1 + 0.4, y1 + 0.4, top, top + 0.8, { t: TRIM, l: TRIM, r: '#E4E1D9' }, { w: 0.75, nb: false });
    const br = []; for (let x = x0 + 0.6; x < x1; x += 1.1) { const a = g.p(x, y1, top), b = g.p(x, y1, top - 0.5); br.push(a[0], a[1], b[0], b[1]); } for (let y = y0 + 0.6; y < y1; y += 1.1) { const a = g.p(x1, y, top), b = g.p(x1, y, top - 0.5); br.push(a[0], a[1], b[0], b[1]); } g.segs2(br, '#8E877A', 0.4);
    const rt = top + 0.8, rc = d.roofCol || '#C9C5BC';
    if (d.roof === 'gable') {
      if (d.front === 'R') {
        K.gable(g, x0 - 0.5, y0 - 0.6, x1 + 0.7, y1 + 0.6, rt, 4.6, 'x', { a: rc, b: shade(rc, 0.12), e: shade(col, -0.12) }, {});
        const c = g.p(x1 + 0.7, (y0 + y1) / 2, rt + 1.7); g.disc2(c, 2.6, TRIM); g.disc2(c, 1.7, C.glass); g.ring2(c, 1.7, { w: 0.5 }); g.ring2(c, 2.6, { w: 0.45 });
      } else {
        K.gable(g, x0 - 0.6, y0 - 0.5, x1 + 0.6, y1 + 0.7, rt, 4.6, 'y', { a: rc, b: shade(rc, 0.12), e: shade(col, -0.12) }, {});
        const c = g.p((x0 + x1) / 2, y1 + 0.7, rt + 1.7); g.disc2(c, 2.6, TRIM); g.disc2(c, 1.7, C.glass); g.ring2(c, 1.7, { w: 0.5 }); g.ring2(c, 2.6, { w: 0.45 });
      }
    } else {
      // a flat roof behind a low parapet
      const inset = K.rect(x0 + 0.3, y0 + 0.3, x1 - 0.3, y1 - 0.3, rt);
      g.fill(inset, rc); g.outline(inset, { w: 0.5, boil: false });
      g.scuff(inset, { dir: DX, len: 3, c: shade(rc, -0.2), dens: 0.8, w: 0.6 });
    }
    if (d.chimney) { const [cx, cy] = d.chimney, cz = d.roof === 'gable' ? rt + 2.6 : rt; K.box(g, cx - 0.9, cy - 0.9, cx + 0.9, cy + 0.9, cz - 1, cz + 3.4, { t: '#8A4436', l: '#B5624B', r: '#9A5140' }, { w: 0.7 }); K.box(g, cx - 1.1, cy - 1.1, cx + 1.1, cy + 1.1, cz + 3.4, cz + 3.9, { t: '#E9E5DC', l: '#E9E5DC', r: '#D2CCC0' }, { w: 0.6, nohid: true }); }
    if (d.skylight) { const [sx, sy] = d.skylight; K.box(g, sx - 1.4, sy - 1.6, sx + 1.4, sy + 1.6, rt, rt + 1.0, { t: '#BFD6E6', l: '#E6E3DA', r: '#D2CEC4' }, { w: 0.6 }); const p = g.p(sx, sy, rt + 1.0); g.segs2([p[0] - 1.6, p[1] + 0.8, p[0] + 0.4, p[1] - 0.9], C.white, 0.6); }
    if (d.turret) {
      // an octagonal corner turret that climbs past the cornice to a pointed slate roof
      const cx = x1 - 1.2, cy = y1 - 1.4, r = 2.9, tz = top + 3.8, tc = { t: shade(col, -0.2), l: shade(col, -0.05), r: shade(col, 0.12) };
      K.cyl(g, cx, cy, r, z0, tz, tc, { nt: true, w: 0.9, n: 8 });
      for (let k = 0; k < d.n + 1; k++) { const zf = z0 + k * SH; if (zf + 3.4 > tz) break; for (const a of [A_L + 0.45, (A_L + A_R) / 2, A_R - 0.45]) { const q = [[cx + r * Math.cos(a - 0.24), cy + r * Math.sin(a - 0.24), zf + 1.1], [cx + r * Math.cos(a + 0.24), cy + r * Math.sin(a + 0.24), zf + 1.1], [cx + r * Math.cos(a + 0.24), cy + r * Math.sin(a + 0.24), zf + 3.3], [cx + r * Math.cos(a - 0.24), cy + r * Math.sin(a - 0.24), zf + 3.3]]; g.fill(q, C.glass); g.outline(q, { w: 0.45, boil: false }); } }
      K.cyl(g, cx, cy, r + 0.4, tz, tz + 0.7, { t: TRIM, l: TRIM, r: '#E4E1D9' }, { w: 0.7, n: 8 });
      K.cone(g, cx, cy, r + 0.5, tz + 0.7, 6.2, '#8C97A3');
      const f = g.p(cx, cy, tz + 6.9), f2 = g.p(cx, cy, tz + 8.4); g.line2([f, f2], { w: 0.7 }); g.disc2(f2, 0.7, C.gold);
    }
  };
  const HOUSES = [
    { x0: -36.6, y0: -36.2, x1: -27.4, y1: -16.8, n: 3, base: 1, col: '#C4584A', front: 'R', roof: 'flat', roofCol: '#D3CFC6', turret: true, chimney: [-33, -31], door: '#3F4D63' },
    { x0: -36.5, y0: -14.6, x1: -27.4, y1: -2.6, n: 3, base: 1, col: '#E2DED5', front: 'R', roof: 'gable', roofCol: '#BDB8AE', bay: true, door: '#7A3E36', chimney: [-33, -11] },
    { x0: -36.5, y0: -0.6, x1: -27.4, y1: 13.8, n: 3, base: 1, col: '#EAD58A', front: 'R', roof: 'gable', roofCol: '#C7C2B7', bay: true, door: '#4F7A5A', chimney: [-33.5, 3] },
    { x0: -36.6, y0: 16.4, x1: -27.2, y1: 35.6, n: 2, base: 3.4, col: '#B9A6D8', front: 'R', roof: 'gable', roofCol: '#C9C5BC', bay: true, garage: true, door: '#5A4A7A', chimney: [-33.5, 20] },
    { x0: 22.4, y0: -28.4, x1: 36.4, y1: -11, n: 2, base: 1, col: '#B8DCC4', front: 'L', roof: 'flat', roofCol: '#D6D3CB', bay: true, door: '#4E6E8E', skylight: [28, -21], chimney: [33.5, -25] },
    { x0: 22.6, y0: -8, x1: 36.2, y1: 11.2, n: 2, base: 1, col: '#EBAABD', front: 'L', roof: 'gable', roofCol: '#C9C5BC', bay: true, door: '#8A4A5E', chimney: [27, -3] },
    { x0: 22.8, y0: 15.2, x1: 36.2, y1: 34.6, n: 2, base: 3.4, col: '#AACDE8', front: 'L', roof: 'deck', roofCol: '#D9CBB0', garage: true, door: '#C9463E' },
  ];
  HOUSES.forEach((d, i) => T.obj([d.x0 - 0.5, d.y0 - 0.5, d.x1 + (d.front === 'R' ? 1.8 : 0.5), d.y1 + (d.front === 'L' ? 1.8 : 0.5)], (g) => house(g, d), { on: true, name: 'house' + i }));
  // the roof deck on the low blue house: boards, a parasol, planters
  const SKY = HOUSES[6], DZ = hAt(SKY.y1) + SKY.base + SKY.n * SH + 0.8;
  T.obj([24.5, 18, 34, 32], function (g) {
    const deck = K.rect(24, 17.4, 34.6, 32.6, DZ + 0.02); g.fill(deck, '#D6B98C');
    const sl = []; for (let x = 24.8; x < 34.4; x += 1.2) { const a = g.p(x, 17.6, DZ + 0.03), b = g.p(x, 32.4, DZ + 0.03); sl.push(a[0], a[1], b[0], b[1]); } g.segs2(sl, '#B39367', 0.45);
    g.outline(deck, { w: 0.55, c: '#8E7550', boil: false });
    for (const [x, y] of [[25.4, 31.2], [33.2, 18.8]]) { K.box(g, x - 0.9, y - 0.9, x + 0.9, y + 0.9, DZ, DZ + 1.3, { t: '#9A5A40', l: '#C27A55', r: '#A9654A' }, { w: 0.55 }); K.bush(g, x, y, { z: DZ + 1.2, r: 1.5, col: '#86B062' }); }
  }, { on: true, name: 'deck' });
  // a striped parasol over the deck: back panels, pole, front panels
  T.cast([29.4, 25.2], function (g) {
    const pc = [29.4, 25.2], ring = [], n = 10; for (let i = 0; i < n; i++) { const a = TAU * i / n; ring.push(g.p(pc[0] + Math.cos(a) * 3.6, pc[1] + Math.sin(a) * 3.6, DZ + 5.8)); }
    const apex = g.p(pc[0], pc[1], DZ + 8.2), foot = g.p(pc[0], pc[1], DZ);
    const tri = (i) => [apex, ring[i], ring[(i + 1) % n]], front = (i) => ring[i][1] + ring[(i + 1) % n][1] > 2 * g.p(pc[0], pc[1], DZ + 5.8)[1];
    for (let i = 0; i < n; i++) if (!front(i)) g.fill2(tri(i), i % 2 ? '#D9A72E' : '#E5DFD0');
    g.line2([foot, apex], { w: 0.7, boil: false });
    for (let i = 0; i < n; i++) if (front(i)) g.fill2(tri(i), i % 2 ? '#F0C64A' : '#F7F4EC');
    g.outline2(ring, { w: 0.6, c: '#8A6A2A' }); for (let i = 0; i < n; i++) if (front(i)) g.line2([apex, ring[i]], { w: 0.4, c: '#B08A3A', boil: false });
  }, { on: true });
  // a garden tree in the gap between the pink and blue houses, and one by the turret
  T.obj([26, 13.4], (g) => K.tree(g, 26, 13.4, { z: hAt(13.4), r: 3.6, h: 5 }), { on: true });
  T.obj([-24.4, -34.8], (g) => K.cypress(g, -24.4, -34.8, { z: ZT, h: 11, r: 2.2 }), { on: true });
  T.obj([-21.6, -35.9], (g) => K.cypress(g, -21.6, -35.9, { z: ZT, h: 9, r: 2.0 }), { on: true });
  T.obj([20.4, -30.6], (g) => { K.lamp(g, 20.4, -30.6, { z: ZT, h: 9 }); }, { on: true });
  // a little stop sign at the crest
  T.obj([18.6, -31.2], function (g) { const a = g.p(18.6, -31.2, ZT), b = g.p(18.6, -31.2, ZT + 6); g.line2([a, b], { w: 0.6, boil: false }); const s = [[b[0] - 1.8, b[1] - 3.4], [b[0] + 1.8, b[1] - 3.8], [b[0] + 1.8, b[1] + 0.2], [b[0] - 1.8, b[1] + 0.6]]; g.fill2(s, '#E9C543'); g.outline2(s, { w: 0.55 }); g.segs2([b[0] - 1, b[1] - 1.6, b[0] + 1, b[1] - 1.9], '#3A3530', 0.6); }, { on: true });

  /* ---------- the front kerb: lamp, bin, mailbox, hydrant, a bench, a planter with a pinwheel ---------- */
  T.obj([-21.2, 34.6], (g) => K.lamp(g, -21.2, 34.6, { z: ZB, h: 9.5 }), { on: true });
  T.obj([-6.4, 36], (g) => { K.cyl(g, -6.4, 36, 0.9, ZB, ZB + 2.6, { t: '#5C6C5A', l: '#6E806B', r: '#566654' }, { w: 0.65, n: 8 }); }, { on: true });
  T.obj([-3.8, 36], (g) => { K.box(g, -4.6, 35.3, -3, 36.7, ZB + 0.6, ZB + 3.0, { t: '#4F78B8', l: '#3F6FA8', r: '#355E92' }, { w: 0.65 }); K.dome(g, -3.8, 36, 0.9, ZB + 3.0, 0.7, '#4F78B8', { w: 0.6 }); const a = g.p(-4.4, 36.7, ZB), b = g.p(-3.2, 36.7, ZB); g.segs2([a[0], a[1], a[0], a[1] - 2.2, b[0], b[1], b[0], b[1] - 2.2], '#2F3740', 0.6); }, { on: true });
  T.obj([-1.2, 36.2], (g) => { K.cyl(g, -1.2, 36.2, 0.65, ZB, ZB + 1.9, { t: '#B23A2E', l: '#D0483A', r: '#B23A2E' }, { w: 0.6, n: 8 }); K.dome(g, -1.2, 36.2, 0.7, ZB + 1.9, 0.6, '#D0483A', { w: 0.55 }); const c = g.p(-1.2, 36.9, ZB + 1.2); g.disc2(c, 0.9, '#D0483A'); g.ring2(c, 0.9, { w: 0.4 }); }, { on: true });
  T.obj([15.2, 35.6], (g) => K.bench(g, 15.2, 35.6, { face: 'L', L: 2.6, z: ZB }), { on: true });
  T.obj([19.6, 35.6], (g) => { K.box(g, 18.4, 34.8, 20.8, 36.4, ZB, ZB + 1.4, { t: '#7A5A3C', l: '#A9825A', r: '#8E6A48' }, { w: 0.6 }); K.blooms(g, 18.6, 35, 20.6, 36.2, ZB + 1.4, ['#E68FB5', '#F5F1EA', '#E6C24F']); }, { on: true });
  T.cast([19.6, 35.6], (g) => { }, { on: true });

  /* ---------- the cast ---------- */
  const zOf = (y) => hAt(y);
  // cars come down the road: they slow and swing their heading through each hairpin
  const S = [0]; for (let i = 1; i < CL.length; i++) S.push(S[i - 1] + Math.hypot(CL[i][0] - CL[i - 1][0], CL[i][1] - CL[i - 1][1]));
  const KAP = CL.map((p, i) => { const a = ANG[Math.max(0, i - 3)], b = ANG[Math.min(CL.length - 1, i + 3)]; let d = b - a; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return Math.abs(d) / 3.6; });
  const TM = [0]; for (let i = 1; i < CL.length; i++) { const v = lerp(5.4, 1.7, smooth(KAP[i] / 0.16)); TM.push(TM[i - 1] + (S[i] - S[i - 1]) / v); }
  const TRIP = TM[TM.length - 1], CYC = TRIP + 9;
  const roadAt = (tau) => {
    let lo = 0, hi = TM.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (TM[m] <= tau) lo = m; else hi = m; }
    const u = (tau - TM[lo]) / Math.max(1e-6, TM[hi] - TM[lo]), a = CL[lo], b = CL[hi];
    let da = ANG[hi] - ANG[lo]; while (da > Math.PI) da -= TAU; while (da < -Math.PI) da += TAU;
    return { x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), ang: ANG[lo] + da * u };
  };
  [['#E7C65A', 'taxi', 0], ['#7FA7CF', 'car', CYC / 3], ['#C9619A', 'car', CYC * 2 / 3]].forEach(([col, kind, off]) => T.actor({
    sample: 0.3, period: CYC,
    at(t) {
      const tau = ((t + off) % CYC + CYC) % CYC; if (tau > TRIP) return null;
      const p = roadAt(tau), q = Math.round(p.ang / (TAU / 48)), e = Math.min(1, tau / 1.1, (TRIP - tau) / 1.1);
      return { x: p.x, y: p.y, z: zOf(p.y) + 0.05, key: 'c' + q, ang: q * (TAU / 48), alpha: e < 1 ? e : null };
    },
    draw(g, st) { K.car(g, st.ang, { col, roof: kind === 'taxi' ? (g2, cab) => K.rbox(g2, cab.cx, cab.cy, 0.5, 1.0, Math.atan2(cab.sa, cab.ca), 4.8, 5.4, '#F3F1EA', { w: 0.45, nb: true }) : null }); },
  }));
  // the cable car waits at the crest, then creeps along to the other end and back
  T.actor({ grow: false, sample: 0.5, period: 32,
    at(t) { const u = ((t / 32) % 1 + 1) % 1, k = u < 0.35 ? 0 : u < 0.5 ? smooth((u - 0.35) / 0.15) : u < 0.85 ? 1 : 1 - smooth((u - 0.85) / 0.15); return { x: lerp(-12, 6, k), y: -35, z: ZT, key: 'cc' }; },
    draw(g) { K.cablecar(g, 0, { riders(g2, B) { const p1 = B.pt(B.hl - 1.4, 0.5, 3.1), p2 = B.pt(-B.hl + 1.4, 0.4, 3.1), p3 = B.pt(B.hl - 1.4, -0.9, 3.1); K.person(g2, p3[0], p3[1], p3[2], K.who(211, { dir: 0, k: 0.78 })); K.person(g2, p1[0], p1[1], p1[2], K.who(212, { dir: 1, k: 0.78, pose: 'wave', ph: 0.25 })); K.person(g2, p2[0], p2[1], p2[2], K.who(213, { dir: 1, k: 0.78 })); } }); } });
  // people climbing and coming down the steps
  [[-25.4, -1, 1.45, 0, 221], [-23.6, 1, 1.6, 0.35, 222], [-25.4, -1, 1.5, 0.7, 223]].forEach(([x, dir, v, ph0, seed]) => {
    const w = K.who(seed), L = YF + 1.5 - (YC + 1), per = L / v;
    T.actor({ sample: 0.4, period: per, at(t) {
      const u = (((t / per) + ph0) % 1 + 1) % 1, y = dir < 0 ? lerp(YF + 1.5, YC + 1, u) : lerp(YC + 1, YF + 1.5, u), e = Math.min(1, u * per / 0.8, (1 - u) * per / 0.8), f = Math.floor(((t * 1.6 + seed) % 1) * 8);
      return { x, y, z: zOf(y) + 0.1, key: (dir < 0 ? 'u' : 'd') + f, ph: f / 8, alpha: e < 1 ? e : null };
    }, draw(g, st) { K.person(g, 0, 0, 0, Object.assign({}, w, { dir: dir < 0 ? 3 : 1, pose: 'walk', ph: st.ph })); } });
  });
  // a neighbour on the butter house's stoop, tourists at the foot of the hill, one photographing the road
  const P = (x, y, o, z) => T.cast([x, y], (g) => K.person(g, x, y, z == null ? hAt(y) : z, o), { on: true });
  P(-25.2, 10.8, K.who(231, { dir: 0, pose: 'sit', k: 0.92 }), hAt(13.8) + 1.0);
  P(-18.8, 35.4, K.who(232, { dir: 2 })); P(-16.6, 34.4, K.who(233, { dir: 3, hairStyle: 'pony' })); P(-14.2, 35.8, K.who(234, { dir: 2, cap: '#C9463E' }));
  P(-10.6, 35.2, K.who(235, { dir: 3, pose: 'hold', top: '#F0EDE4' }));
  P(14.4, 35.2, K.who(236, { dir: 1, pose: 'sit', k: 0.9 }), ZB + 1.2); P(16.2, 35.4, K.who(237, { dir: 1, pose: 'sit', k: 0.9, hairStyle: 'long' }), ZB + 1.2);
  P(-4, -32, K.who(238, { dir: 3, pose: 'hold' }), ZT);
  // a sunbather on the roof deck
  T.cast([31.6, 22], function (g) { const p = g.p(31.6, 22, DZ + 0.1); const pts = [[p[0] - 7, p[1] + 1.6], [p[0] + 5, p[1] - 1.8], [p[0] + 6, p[1] + 0.4], [p[0] - 6, p[1] + 3.6]]; g.fill2(pts, '#7FB7D9'); g.outline2(pts, { w: 0.5, c: '#4A7AA0' }); K.person(g, 31.2, 22.6, DZ + 0.4, K.who(239, { dir: 0, pose: 'sit', k: 0.9, shorts: true })); }, { on: true });
  // the rainbow flag hanging out from the butter house
  const FY = 6.5, FZ = hAt(13.8) + 1 + 2 * SH + 1.4;
  T.actor({ layer: 'top', grow: false, sample: 5, at(t) { const f = Math.floor(((t * 0.7) % 1) * 10); return { x: -27.3, y: FY, z: FZ, key: 'fl' + f, ph: f / 10 }; },
    draw(g, st) {
      const o = g.p(0, 0, 0), e = g.p(2.4, 0, 2.0); g.line2([o, e], { w: 0.7, boil: false });
      const cols = ['#D9534A', '#E8934A', '#E9C543', '#6FAE6A', '#4F7FC9', '#8E66B8'], n = 6, W = 9, top = [], bot = [];
      for (let i = 0; i <= n; i++) { const u = i / n, wv = Math.sin(st.ph * TAU - u * 3.4) * 0.9 * u; top.push([lerp(o[0], e[0], u * 0.92), lerp(o[1], e[1], u * 0.92) + wv * 0.4]); bot.push([top[i][0] + wv * 0.6, top[i][1] + W]); }
      for (let k = 0; k < 6; k++) { const a = [], b = []; for (let i = 0; i <= n; i++) { a.push([lerp(top[i][0], bot[i][0], k / 6), lerp(top[i][1], bot[i][1], k / 6)]); b.push([lerp(top[i][0], bot[i][0], (k + 1) / 6), lerp(top[i][1], bot[i][1], (k + 1) / 6)]); } g.fill2(a.concat(b.reverse()), cols[k]); }
      g.outline2(top.concat(bot.slice().reverse()), { w: 0.6, boil: false });
    } });
  // the pinwheel in the planter turns
  T.actor({ grow: false, sample: 5, at(t) { const f = Math.floor(((t * 1.2) % 1) * 8); return { x: 19.9, y: 35.4, z: ZB + 1.4, key: 'pw' + f, a: f / 8 * Math.PI / 2 }; },
    draw(g, st) { const o = g.p(0, 0, 0), c = [o[0], o[1] - 7]; g.line2([o, c], { w: 0.55, boil: false }); const cols = ['#D9534A', '#E9C543', '#4F7FC9', '#6FAE6A']; for (let i = 0; i < 4; i++) { const a = st.a + i * Math.PI / 2, p1 = [c[0] + Math.cos(a) * 3, c[1] + Math.sin(a) * 3], p2 = [c[0] + Math.cos(a + 0.9) * 1.6, c[1] + Math.sin(a + 0.9) * 1.6]; g.fill2([c, p1, p2], cols[i]); g.outline2([c, p1, p2], { w: 0.4, boil: false }); } g.disc2(c, 0.6, '#3A3530'); } });
});
