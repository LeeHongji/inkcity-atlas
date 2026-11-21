'use strict';
/* (-1,1) Golden Gate Park.
   A flat lawn, flush with the streets, criss-crossed by sandy paths. Along the back, the white glasshouse Conservatory:
   a domed centre pavilion with barrel-vaulted glass wings and small domed end pavilions, tall cypresses behind it.
   Back right: a three-tier pagoda, a red arched bridge over a little stream, pink blossom. Left: a brick Dutch windmill
   with a gallery, and rows of tulips. Middle: a fenced bison paddock inside a loop of path, with a fountain plaza and
   star-shaped beds behind it. Right: a roller rink painted with red and gold rings, a boombox on a crate. Front: a pond
   with an islet, lily pads, a boathouse and little boats. The mill's sails, the tulips, the bison and every person
   belong to the living layer and arrive together at f132. */
SF.tile('ggpark', -100, 100, { rim: 63 }, function (T) {
  const H = 37;
  const LAWN = '#B6D18F', LAWND = '#A3C27C', PATH = '#EADDB9', PATHD = '#CDBB8E', SOIL = '#9C7A55';
  const DX = Math.atan2(AY, AX), DY = Math.atan2(AY, -AX);
  const WHITE = { t: '#F6F4EE', l: '#F7F5F0', r: '#E3E0D8' }, GLASS = '#DCEAF0', GLASSD = '#B9D0DC';

  /* ---------- small local helpers ---------- */
  const circ = (cx, cy, r, n, z) => { const p = []; for (let i = 0; i < n; i++) { const a = TAU * i / n; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z || 0]); } return p; };
  /* a sandy path along a smooth curve through control points */
  const path = (g, ctrl, w) => {
    const c = K.curve(ctrl, 6), L = [], R = [];
    for (let i = 0; i < c.length; i++) { const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * w / 2, ny = dx / l * w / 2; L.push([clamp(c[i][0] + nx, -H, H), clamp(c[i][1] + ny, -H, H), 0.02]); R.push([clamp(c[i][0] - nx, -H, H), clamp(c[i][1] - ny, -H, H), 0.02]); }
    const poly = L.concat(R.slice().reverse());
    g.fill(poly, PATH);
    g.scuff(poly, { dir: DX, len: 2.6, c: '#F6EED6', dens: 1.2, w: 0.7, spread: 1.2 });
    g.line(L, { w: 0.5, c: PATHD, boil: false, cons: false }); g.line(R, { w: 0.5, c: PATHD, boil: false, cons: false });
    return c;
  };
  /* an octagonal tapered tower; facets face the light differently */
  const octo = (g, cx, cy, r0, r1, z0, z1, col, o) => {
    o = o || {}; const V = (r, z, k) => { const a = Math.PI / 8 + k * Math.PI / 4; return [cx + r * Math.cos(a), cy + r * Math.sin(a), z]; }, faces = [];
    for (let k = 0; k < 8; k++) { const m = Math.PI / 8 + (k + 0.5) * Math.PI / 4, nx = Math.cos(m), ny = Math.sin(m); if (nx + ny <= 0.02) continue; faces.push({ k, q: [V(r0, z0, k), V(r0, z0, k + 1), V(r1, z1, k + 1), V(r1, z1, k)], t: clamp(0.5 + 0.5 * (nx - ny), 0, 1), d: nx + ny }); }
    faces.sort((a, b) => a.d - b.d);
    for (const f of faces) g.fill(f.q, mix(shade(col, -0.06), shade(col, 0.16), f.t));
    for (const f of faces) { g.line([f.q[0], f.q[1]], { w: 0.85, c: o.c }); g.line([f.q[0], f.q[3]], { w: 0.7, c: o.c }); g.line([f.q[1], f.q[2]], { w: 0.7, c: o.c }); }
    const top = []; for (let k = 0; k < 8; k++) top.push(V(r1, z1, k));
    if (!o.nt) { g.fill(top, shade(col, -0.14)); g.outline(top, { w: 0.75, c: o.c }); }
    return { faces, V };
  };
  /* a barrel-vaulted glass roof whose axis runs along x */
  const vault = (g, x0, x1, yc, zw, r) => {
    const N = 10, P = (x, ph) => [x, yc + r * Math.cos(ph), zw + r * Math.sin(ph) * 0.92];
    for (let i = N - 1; i >= 0; i--) { const a = Math.PI * (i + 1) / N, b = Math.PI * i / N, m = (a + b) / 2; g.fill([P(x0, a), P(x1, a), P(x1, b), P(x0, b)], mix('#EEF5F7', GLASSD, clamp(0.25 + 0.6 * Math.cos(m) * 0.5 + 0.25 * (1 - Math.sin(m)), 0, 1))); }
    const end = []; for (let i = 0; i <= N; i++) end.push(P(x1, Math.PI * i / N));
    g.fill(end, '#E1ECF1');
    for (let x = x0 + 1.15; x < x1 - 0.3; x += 1.15) { const arc = []; for (let i = 0; i <= N; i++) arc.push(P(x, Math.PI * i / N)); g.fine(arc.slice(0, 7), { w: 0.45, c: '#7E8F98' }); }
    for (let i = 1; i < N; i++) if (i % 2) g.fine([P(x0, Math.PI * i / N), P(x1, Math.PI * i / N)], { w: 0.4, c: '#8FA0A8' });
    for (let i = 1; i < N; i += 2) g.fine([P(x1, Math.PI * i / N), [x1, yc, zw]], { w: 0.35, c: '#8FA0A8' });
    g.line(end, { w: 0.8 }); g.line([P(x0, 0), P(x1, 0)], { w: 0.75 });
    const crest = []; for (let i = 0; i <= 20; i++) crest.push(P(lerp(x0, x1, i / 20), Math.PI * 0.62)); g.line(crest, { w: 0.6, c: '#5E6E78', boil: false });
  };

  /* ---------- the lawn, the paths and everything flat ---------- */
  T.ground(function (g) {
    K.slab(g, H, { top: LAWN });
    g.grass(K.rect(-H, -H, H, H), { dens: 0.55 });
  }, { rim: true });
  T.ground(function (g) {
    for (const [pts, col, seed] of [[[[-34, -10], [-18, -4], [-14, 12], [-26, 16], [-35, 6]], LAWND, 3], [[[4, 0], [16, 4], [12, 14], [2, 12]], LAWND, 5], [[[22, -36], [36, -34], [34, -24], [24, -28]], '#C2D99D', 7]])
      K.blob2(g, g.P(pts), col, { seed, rag: 0.9 });
    // the loop round the paddock and the paths that leave it
    const LOOP = [[-21, -7], [-8, -8], [5.5, -7], [7, 4], [5.5, 17.5], [-8, 19], [-21.5, 17], [-23, 5]];
    path(g, LOOP.concat([LOOP[0], LOOP[1]]), 3.2);
    path(g, [[-21, -7], [-22.5, -11], [-21, -18], [-18, -22], [-17.6, -24.4]], 2.8);
    path(g, [[5.5, -7], [6, -16], [5, -24], [4.5, -28.5]], 2.6);
    path(g, [[6.2, 9], [11, 6], [14.6, 5.4]], 2.6);
    path(g, [[-22.8, 6], [-25.4, 8.6]], 2.6);
    path(g, [[-8, 19], [-9, 27], [-12, 33], [-14, 37]], 3.0);
    path(g, [[7, -3], [11, -6], [12.5, -9]], 2.6);
    path(g, [[-30, -5], [-27, -8], [-22.5, -11]], 2.4);
    // fountain plaza
    const fp = circ(-23, -14, 5.2, 28, 0.03); g.fill(fp, PATH); g.scuff(fp, { dir: DX, len: 2.4, c: '#F6EED6', dens: 1.3, w: 0.7, spread: 1.2 }); g.outline(fp, { w: 0.55, c: PATHD, boil: false });
    // star beds: a coloured ring, a filled disc, a white star
    const starBed = (cx, cy, r, ring, fill, star) => {
      const o = circ(cx, cy, r, 28, 0.05), i = circ(cx, cy, r * 0.74, 28, 0.06), s = [];
      for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.27 : r * 0.62; s.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 0.07]); }
      g.fill(o, ring); g.fill(i, fill); g.fill(s, star); g.outline(o, { w: 0.6, c: shade(ring, 0.45) }); g.outline(s, { w: 0.5, c: '#8E877A', boil: false });
      g.scuff(i, { c: shade(fill, 0.2), len: 1, dens: 2.5, w: 0.7, spread: 3 });
    };
    starBed(-31, -20, 3.6, '#C9463E', '#F0C64A', '#FAF8F2'); starBed(-12.5, -16.4, 3.3, '#B9478A', '#E07FB0', '#FAF8F2');
    // diamond beds: little lozenges of colour in a border
    const diaBed = (x0, y0, x1, y1, cols) => {
      const b = K.rect(x0, y0, x1, y1, 0.05); g.fill(b, '#7EA35B'); g.outline(b, { w: 0.55, c: '#4E6E3A' });
      const n = Math.round((x1 - x0) / 1.4), h = (y1 - y0) / 2;
      for (let k = 0; k < n; k++) { const cx = x0 + (k + 0.5) * (x1 - x0) / n, cy = (y0 + y1) / 2, w = (x1 - x0) / n / 2 * 0.92; g.fill([[cx - w, cy, 0.06], [cx, cy - h * 0.8, 0.06], [cx + w, cy, 0.06], [cx, cy + h * 0.8, 0.06]], cols[k % cols.length]); }
    };
    diaBed(-27.5, -26.6, -20.5, -24.4, ['#C9463E', '#5E8FC9', '#E9C543', '#B9478A']); diaBed(-3.8, -21.2, 3.2, -19, ['#E9C543', '#C9463E', '#B9478A', '#E08A3C']);
    // the paddock's trampled grass
    const pd = K.rect(-16.6, -2.6, 1.4, 13.6, 0.03); g.fill(pd, '#9DBC72'); g.grass(pd, { dens: 1.3 }); g.scuff(pd, { c: '#B9A276', len: 1.6, dens: 0.6, w: 0.8, spread: 2 });
    // the tulip field's soil, furrowed
    const tb = K.rect(-36.2, 17.6, -21.6, 35.6, 0.03); g.fill(tb, SOIL);
    for (let y = 18.6; y < 35.5; y += 1.8) g.fine([[-36, y + 0.7, 0.04], [-21.8, y + 0.7, 0.04]], { w: 0.6, c: '#7C5E3E' });
    g.outline(tb, { w: 0.6, c: '#6E523A' });
    // the rink: a pale floor, a red outer ring, a gold inner ring, a centre spot
    const RC = [20.5, -14.5];
    const fl = circ(RC[0], RC[1], 9.4, 40, 0.04); g.fill(fl, '#EEEAE1'); g.scuff(fl, { dir: DX, len: 3.5, c: '#F8F6F0', dens: 1, w: 0.8, spread: 0.1 }); g.outline(fl, { w: 0.8 });
    const ring = (r, w, col) => { const a = circ(RC[0], RC[1], r + w / 2, 40, 0.05), b = circ(RC[0], RC[1], r - w / 2, 40, 0.05); g.fill(a.concat([a[0]], [b[0]], b.slice().reverse()), col); };
    ring(8.2, 0.8, '#D44A3C'); ring(3.6, 0.7, '#E2B23A'); g.fill(circ(RC[0], RC[1], 0.6, 12, 0.06), '#D44A3C');
    // the pond: a sandy rim, water, lily pads, reeds; the stream at the back with its little pool
    const PO = [[8, 15], [14, 12.6], [24, 13.2], [31, 16], [33.6, 23], [32, 31], [25, 34.6], [15, 34.2], [9, 30], [6.6, 22.4]];
    const rim = K.curve(PO.map((p) => [lerp(20, p[0], 1.1), lerp(23.5, p[1], 1.1), 0.02]), 5, true), wat = K.curve(PO.map((p) => [p[0], p[1], 0.03]), 5, true);
    g.fill(rim, '#E5D8B4'); g.fill(wat, C.water);
    g.fill(K.curve(PO.slice(0, 5).map((p) => [lerp(20, p[0], 0.97), lerp(23.5, p[1], 0.97), 0.035]), 5).concat([[20, 15, 0.035]]), '#9DC0DC');
    g.water(wat, { dens: 1.6 }); g.line(wat, { w: 0.6, c: '#6F8FAE', close: true, boil: false }); g.outline(rim, { w: 0.5, c: PATHD, boil: false });
    for (const [x, y, s] of [[12, 19, 1], [27.6, 18.4, 0.8], [29, 28, 1.1], [13.4, 29.6, 0.9], [24.6, 31.4, 0.7]]) { const p = g.p(x, y, 0.05), e = arcPts(p[0], p[1], 2.6 * s, 0.5, TAU - 0.1, 9).concat([p]); g.fill2(e.map((q) => [q[0], p[1] + (q[1] - p[1]) * 0.55]), '#7FAE5C'); if (s > 0.9) g.disc2([p[0] + 1, p[1] - 0.6], 0.9, '#F2B6CF'); }
    const reeds = []; for (const [x, y] of [[8.6, 27], [9.3, 28.4], [31.6, 21], [32.3, 22.5], [26, 34]]) { const p = g.p(x, y, 0); for (let k = 0; k < 4; k++) reeds.push(p[0] + k * 0.8 - 1.2, p[1], p[0] + k * 1.1 - 1.6, p[1] - 5 - k % 2 * 2); } g.segs2(reeds, '#5E7E3A', 0.6, true);
    const ST = K.curve([[10.4, -37, 0.03], [11.6, -33], [11.2, -29], [12.6, -25.5]], 6), SW = [], SE = [];
    for (let i = 0; i < ST.length; i++) { SW.push([ST[i][0] - 1.15, ST[i][1], 0.03]); SE.push([ST[i][0] + 1.15, ST[i][1], 0.03]); }
    g.fill(SW.concat(SE.slice().reverse()), C.water); g.fill(circ(12.6, -24.2, 2.5, 18, 0.03), C.water); g.water(circ(12.6, -24.2, 2.5, 18, 0.04), { dens: 2 });
    g.line(SW, { w: 0.5, c: '#6F8FAE', boil: false }); g.line(SE, { w: 0.5, c: '#6F8FAE', boil: false });
    for (const [x, y, r] of [[10.2, -22.6, 1], [14.8, -23, 0.8], [11, -26.6, 0.7], [15, -25.6, 0.9], [9.4, -25, 0.6]]) { const p = g.p(x, y, 0.3); g.disc2(p, 2.2 * r, '#B9B6AE'); g.fill2(arcPts(p[0], p[1], 2.2 * r, -0.3, 1.8, 6), '#9E9B93'); g.ring2(p, 2.2 * r, { c: '#6E6B64', w: 0.45 }); }
    // the boathouse's little landing stage
    const pier = K.rect(16.4, 8.4, 19.4, 14.6, 0.5); g.fill(pier, '#C9A26B'); const pl = []; for (let y = 8.9; y < 14.6; y += 0.9) { const a = g.p(16.4, y, 0.5), b = g.p(19.4, y, 0.5); pl.push(a[0], a[1], b[0], b[1]); } g.segs2(pl, '#9C7A4C', 0.45); g.outline(pier, { w: 0.6, c: '#6E5434' });
    g.fill([[16.4, 14.6, 0], [19.4, 14.6, 0], [19.4, 14.6, 0.5], [16.4, 14.6, 0.5]], '#A9844F');
  });

  /* ---------- the Conservatory ---------- */
  T.obj([-34, -36.4, -1.6, -24.4], function (g) {
    const pav = (x0, x1, y0, y1, h, dr) => {
      K.box(g, x0, y0, x1, y1, 0, h, WHITE, { w: 0.9 });
      const m = (x0 + x1) / 2, my = (y0 + y1) / 2;
      K.win(g, 'L', y1, m - 1.1, m + 1.1, 1.2, h - 1.4, { style: 'glass', arch: true, col: GLASS, w: 0.55 });
      K.win(g, 'R', x1, my - 1.1, my + 1.1, 1.2, h - 1.4, { style: 'glass', arch: true, col: GLASS, w: 0.55 });
      K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, h, h + 0.6, WHITE, { w: 0.7 });
      K.dome(g, m, my, dr, h + 0.6, dr * 0.95, '#EEF4F6', { shadow: '#D2E1E8', w: 0.75, ribs: 8, ribCol: '#9AAAB2', ribW: 0.45 });
      const t = g.p(m, my, h + 0.6 + dr * 0.95); g.line2([t, [t[0], t[1] - 3]], { w: 0.6 }); g.disc2([t[0], t[1] - 3.2], 0.7, '#E3E0D8');
    };
    const wing = (x0, x1) => {
      const y0 = -34.2, y1 = -28.4, h = 4.4, yc = (y0 + y1) / 2;
      K.box(g, x0, y0, x1, y1, 0, h, { t: WHITE.t, l: GLASS, r: '#C9DCE4' }, { w: 0.85 });
      g.fill(K.on('L', y1, x0, x1, 0, 0.9), '#F2F0EA'); g.fill(K.on('R', x1, y0, y1, 0, 0.9), '#E3E0D8');
      const mu = []; for (let x = x0 + 1.15; x < x1 - 0.2; x += 1.15) { const a = g.p(x, y1, 0.9), b = g.p(x, y1, h); mu.push(a[0], a[1], b[0], b[1]); } for (let y = y0 + 1.15; y < y1 - 0.2; y += 1.15) { const a = g.p(x1, y, 0.9), b = g.p(x1, y, h); mu.push(a[0], a[1], b[0], b[1]); }
      g.segs2(mu, '#FBFBF8', 0.9); g.segs2(mu, '#8FA0A8', 0.35);
      g.line([[x0, y1, 0.9], [x1, y1, 0.9], [x1, y0, 0.9]], { w: 0.55 }); g.line([[x0, y1, h], [x1, y1, h], [x1, y0, h]], { w: 0.75 });
      vault(g, x0, x1, yc, h, (y1 - y0) / 2 + 0.2);
    };
    pav(-33.6, -28.8, -35.2, -27.4, 6.2, 2.0);
    wing(-28.8, -21.6);
    // the centre pavilion: taller, stepped forward, an arched doorway under a pediment, a glass dome on a drum
    const x0 = -21.6, x1 = -13.8, y0 = -36.2, y1 = -24.6, h = 8.6, m = (x0 + x1) / 2, my = (y0 + y1) / 2;
    K.box(g, x0, y0, x1, y1, 0, h, WHITE, { w: 0.95 });
    K.win(g, 'L', y1, m - 1.5, m + 1.5, 0, 5.4, { style: 'dark', arch: true, col: '#4A5560', lc: C.ink, w: 0.7 });
    for (const a of [x0 + 1.4, x1 - 1.4]) K.win(g, 'L', y1, a - 0.75, a + 0.75, 1.4, 6.4, { style: 'glass', arch: true, col: GLASS, w: 0.5 });
    for (const a of [y0 + 2.2, my, y1 - 2.2]) K.win(g, 'R', x1, a - 0.9, a + 0.9, 1.4, 6.6, { style: 'glass', arch: true, col: GLASS, w: 0.5 });
    for (const a of [x0 + 0.5, x1 - 0.5]) g.line([[a, y1, 0], [a, y1, h]], { w: 0.5, boil: false });
    K.box(g, x0 - 0.4, y0 - 0.4, x1 + 0.4, y1 + 0.4, h, h + 0.8, WHITE, { w: 0.8 });
    K.gable(g, x0 + 0.6, y1 - 3, x1 - 0.6, y1 + 0.4, h + 0.8, 2.6, 'y', { a: '#ECE9E2', b: '#DCD8CF', e: '#F6F4EE' }, {});
    K.cyl(g, m, my - 1, 4.2, h + 0.8, h + 3.2, { t: '#F1EFE8', l: '#F7F5F0', r: '#DFDCD3' }, { nt: true, w: 0.85, n: 14 });
    for (let i = 0; i < 7; i++) { const a = A_L + (A_R - A_L) * (i + 0.5) / 7; const q = [[m + 4.2 * Math.cos(a - 0.15), my - 1 + 4.2 * Math.sin(a - 0.15), h + 1.3], [m + 4.2 * Math.cos(a + 0.15), my - 1 + 4.2 * Math.sin(a + 0.15), h + 1.3], [m + 4.2 * Math.cos(a + 0.15), my - 1 + 4.2 * Math.sin(a + 0.15), h + 2.8], [m + 4.2 * Math.cos(a - 0.15), my - 1 + 4.2 * Math.sin(a - 0.15), h + 2.8]]; g.fill(q, GLASSD); g.outline(q, { w: 0.4, boil: false }); }
    K.dome(g, m, my - 1, 4.4, h + 3.2, 5.0, '#EEF4F6', { shadow: '#CFDFE6', band: true, ribs: 12, ribCol: '#8FA0A8', ribW: 0.55, w: 0.85 });
    K.cyl(g, m, my - 1, 1.1, h + 8.1, h + 9.6, WHITE, { w: 0.65, n: 8 });
    K.dome(g, m, my - 1, 1.2, h + 9.6, 1.0, '#F6F4EE', { w: 0.6 });
    wing(-13.8, -6.6);
    pav(-6.6, -1.8, -35.2, -27.4, 6.2, 2.0);
  }, { name: 'conservatory' });
  // its red flag flies above the lantern
  T.actor({ layer: 'top', grow: false, sample: 5, at(t) { const f = Math.floor(((t * 0.9) % 1) * 8); return { x: -17.7, y: -31.4, z: 19.4, key: 'f' + f, ph: f / 8 }; },
    draw(g, st) { const o = g.p(0, 0, 0), t = [o[0], o[1] - 7]; g.line2([o, t], { w: 0.6, boil: false }); const pts = []; for (let i = 0; i <= 4; i++) pts.push([t[0] + i * 1.4, t[1] + 0.2 + Math.sin(st.ph * TAU - i) * 0.5 * i / 4]); for (let i = 4; i >= 0; i--) pts.push([t[0] + i * 1.4, t[1] + 3.4 + Math.sin(st.ph * TAU - i) * 0.6 * i / 4]); g.fill2(pts, '#D44A3C'); g.outline2(pts, { w: 0.5, c: '#7E2A20', boil: false }); } });

  /* ---------- trees ---------- */
  for (const [x, y, h] of [[-27, -37, 15], [-11.6, -36.9, 13], [-36.2, -30, 14], [-36.3, -21, 12], [-2.6, -37, 11], [35.6, -30.6, 12], [-36.4, 1, 11]]) T.obj([x, y], (g) => K.cypress(g, x, y, { h, r: 2.4 }));
  for (const [x, y, r] of [[-31.5, -34.8, 4.6], [-6.4, -24.6, 3.6], [-30, -11.8, 4.2], [-0.6, -11, 3.6], [34.6, -4.6, 4.0], [33.5, 9, 4.4], [-33, 13.8, 3.4], [2, 25, 4], [-2.6, 31.8, 3.6], [35, -20.6, 3.4]]) T.obj([x, y], (g) => K.tree(g, x, y, { r, h: 5.2 }));
  for (const [x, y, r] of [[17.2, -33.6, 4.2], [21, -28.4, 3.2], [7.8, -35.4, 2.8]]) T.obj([x, y], (g) => K.tree(g, x, y, { r, h: 4.6, col: '#F2B6CF', ink: '#B9708B' }));
  for (const [x, y] of [[-27.6, -27], [-9, -27]]) T.obj([x, y], (g) => K.bush(g, x, y, { r: 1.4, col: '#7FA65A' }));

  /* ---------- the pagoda: three dark tiers on red posts ---------- */
  T.obj([1, -34, 7.4, -27.6], function (g) {
    const cx = 4.2, cy = -30.8;
    K.box(g, cx - 3.4, cy - 3.4, cx + 3.4, cy + 3.4, 0, 0.9, { t: '#D9D5CB', l: '#E3DFD5', r: '#CDC8BC' }, { w: 0.8 });
    let z = 0.9;
    [[2.5, 3.0], [2.0, 2.6], [1.55, 2.4]].forEach(([s, hgt], i) => {
      K.box(g, cx - s, cy - s, cx + s, cy + s, z, z + hgt, { t: '#C9463E', l: '#D0503F', r: '#B03F31' }, { w: 0.75 });
      g.fill(K.on('L', cy + s, cx - s * 0.5, cx + s * 0.5, z + 0.2, z + hgt - 0.6), '#3A2A24'); g.fill(K.on('R', cx + s, cy - s * 0.5, cy + s * 0.5, z + 0.2, z + hgt - 0.6), '#2E211C');
      for (const a of [cx - s + 0.25, cx + s - 0.25]) g.line([[a, cy + s, z], [a, cy + s, z + hgt]], { w: 0.5, c: '#7E2A20', boil: false });
      z += hgt;
      const o = s + 2.0, rz = 1.8 - i * 0.15;
      K.hip(g, cx - o, cy - o, cx + o, cy + o, z, rz, '#3E4A66', { c: '#1F2638' });
      const tips = [[cx + o, cy + o], [cx - o, cy + o], [cx + o, cy - o]];
      for (const [tx, ty] of tips) { const a = g.p(tx, ty, z), b = g.p(tx + Math.sign(tx - cx) * 0.6, ty + Math.sign(ty - cy) * 0.6, z + 0.9); g.line2([a, b], { w: 0.8, c: '#1F2638', boil: false, ext: 0 }); }
      g.line([[cx - o, cy + o, z - 0.05], [cx + o, cy + o, z - 0.05], [cx + o, cy - o, z - 0.05]], { w: 0.6, c: '#C9A23A', boil: false });
      z += rz * 0.55;
    });
    const a = g.p(cx, cy, z), b = g.p(cx, cy, z + 4.6); g.line2([a, b], { w: 0.8, c: '#8A7435' });
    for (let k = 1; k <= 4; k++) { const p = g.p(cx, cy, z + k * 0.9); g.disc2(p, 1.3 - k * 0.15, C.gold); g.ring2(p, 1.3 - k * 0.15, { c: '#8A7435', w: 0.35 }); }
  }, { name: 'pagoda' });

  /* ---------- the red arched bridge over the stream ---------- */
  T.obj([7.4, -32.4, 15.8, -29.8], function (g) {
    const X0 = 7.4, X1 = 15.8, YB = -32.4, YF = -29.8, N = 16, zt = (u) => 0.4 + 2.6 * Math.sin(Math.PI * u);
    const back = [], front = [], under = [];
    for (let i = 0; i <= N; i++) { const u = i / N, x = lerp(X0, X1, u); back.push([x, YB, zt(u)]); front.push([x, YF, zt(u)]); under.push([x, YF, zt(u) - 0.8]); }
    const rail = (y) => { const top = [], posts = []; for (let i = 0; i <= N; i += 2) { const u = i / N, x = lerp(X0, X1, u), a = g.p(x, y, zt(u)), b = g.p(x, y, zt(u) + 1.7); posts.push(a[0], a[1], b[0], b[1]); top.push([x, y, zt(u) + 1.7]); } g.segs2(posts, '#9E3328', 0.75, true); g.line(top, { w: 0.85, c: '#7E2A20', boil: false }); };
    rail(YB);
    g.fill(back.concat(front.slice().reverse()), '#C9463E');
    const pl = []; for (let i = 1; i < N; i++) { const a = g.p(back[i][0], YB, back[i][2]), b = g.p(front[i][0], YF, front[i][2]); pl.push(a[0], a[1], b[0], b[1]); } g.segs2(pl, '#A53A2E', 0.4);
    g.fill(front.concat(under.slice().reverse()), '#B03F31');
    g.line(under, { w: 0.85, c: '#7E2A20' }); g.line(front, { w: 0.7, c: '#7E2A20' });
    rail(YF);
  }, { name: 'redbridge' });

  /* ---------- the fountain ---------- */
  T.obj([-23, -14], function (g) {
    K.cyl(g, -23, -14, 2.8, 0, 1.0, { t: '#E9E5DC', l: '#EFECE4', r: '#D8D3C8' }, { w: 0.8, top: C.water });
    g.water(circ(-23, -14, 2.4, 16, 1.0), { dens: 2 });
    K.cyl(g, -23, -14, 0.55, 1.0, 2.6, { t: '#E9E5DC', l: '#EFECE4', r: '#D8D3C8' }, { w: 0.65, n: 8 });
    K.cyl(g, -23, -14, 1.4, 2.6, 3.0, { t: '#E9E5DC', l: '#EFECE4', r: '#D8D3C8' }, { w: 0.65, top: C.water });
  });
  T.actor({ grow: false, sample: 5, at(t) { const f = Math.floor(((t * 1.6) % 1) * 6); return { x: -23, y: -14, z: 3.0, key: 'j' + f, ph: f / 6 }; },
    draw(g, st) { const o = g.p(0, 0, 0), h = 4.6 + Math.sin(st.ph * TAU) * 0.8, t = [o[0], o[1] - h * VZ]; g.fill2([[o[0] - 0.7, o[1]], [o[0] + 0.7, o[1]], [t[0] + 0.4, t[1]], [t[0] - 0.4, t[1]]], '#F8F9F6'); for (const s of [-1, 1]) { const pts = []; for (let i = 0; i <= 6; i++) { const u = i / 6; pts.push([t[0] + s * u * 5.5, t[1] + u * u * 13 - u * 2]); } g.line2(pts, { w: 0.7, c: '#F8F9F6', boil: false, ext: 0 }); } g.disc2(t, 1.1, '#FFFFFF'); g.ring2([o[0], o[1] + 0.4], 2.4 + 0.6 * Math.sin(st.ph * TAU), { c: '#FFFFFF', w: 0.55 }); } });

  /* ---------- the windmill: a brick octagon, a wooden gallery, a red cap; sails arrive with the cast ---------- */
  const MX = -29.2, MY = 7.6, HUBZ = 16.4, AXL = [0.24, 0.97];
  T.obj([MX - 5.6, MY - 5.6, MX + 5.6, MY + 5.6], function (g) {
    const lo = octo(g, MX, MY, 4.6, 3.9, 0, 7.2, '#B8714F', { c: '#5E3424' });
    const br = []; for (const f of lo.faces) for (let z = 0.9; z < 7; z += 0.9) { const a = f.q[0], b = f.q[1], u0 = 0.15 + 0.3 * ((z * 7) % 1), p = g.p(lerp(a[0], b[0], u0), lerp(a[1], b[1], u0), z), q = g.p(lerp(a[0], b[0], u0 + 0.28), lerp(a[1], b[1], u0 + 0.28), z); br.push(p[0], p[1], q[0], q[1]); } g.segs2(br, '#96583C', 0.45);
    const df = lo.faces.find((f) => f.k === 1) || lo.faces[0], dq = df.q, dpt = (u, z) => [lerp(dq[0][0], dq[1][0], u), lerp(dq[0][1], dq[1][1], u), z];
    const door = [dpt(0.32, 0), dpt(0.68, 0), dpt(0.68, 2.8), dpt(0.5, 3.4), dpt(0.32, 2.8)]; g.fill(door, '#4A3428'); g.outline(door, { w: 0.6 });
    // gallery: an octagonal deck on brackets, with a railing
    const deck = []; for (let k = 0; k < 8; k++) { const a = Math.PI / 8 + k * Math.PI / 4; deck.push([MX + 5.8 * Math.cos(a), MY + 5.8 * Math.sin(a), 7.4]); }
    g.fill(deck, '#B08A5C'); g.outline(deck, { w: 0.7, c: '#5E4228' });
    const fr = deck.filter((p) => p[0] - MX + p[1] - MY > -1.5); g.fill(fr.map((p) => [p[0], p[1], 7.4]).concat(fr.slice().reverse().map((p) => [p[0], p[1], 6.9])), '#8E6A44');
    const up = octo(g, MX, MY, 3.8, 2.9, 7.4, 15.4, '#C27B57', { c: '#5E3424' });
    for (const f of up.faces) { if (f.d < 0.5) continue; const q = f.q, w = (u, z) => [lerp(q[0][0], q[1][0], u), lerp(q[0][1], q[1][1], u), z], win = [w(0.35, 10), w(0.65, 10), w(0.65, 12), w(0.35, 12)]; g.fill(win, '#3F4D63'); g.outline(win, { w: 0.5, boil: false }); }
    const posts = [], rtop = []; for (let k = 0; k <= 8; k++) { const a = Math.PI / 8 + (k % 8) * Math.PI / 4, p = [MX + 5.6 * Math.cos(a), MY + 5.6 * Math.sin(a)]; if (p[0] - MX + p[1] - MY < -2) { rtop.push(null); continue; } const b = g.p(p[0], p[1], 7.4), c = g.p(p[0], p[1], 9.2); posts.push(b[0], b[1], c[0], c[1]); rtop.push([p[0], p[1], 9.2]); }
    g.segs2(posts, '#5E4228', 0.6); const seg = []; for (const p of rtop) { if (p) seg.push(p); else if (seg.length) { if (seg.length > 1) g.line(seg.slice(), { w: 0.6, c: '#5E4228', boil: false }); seg.length = 0; } } if (seg.length > 1) g.line(seg, { w: 0.6, c: '#5E4228', boil: false });
    K.dome(g, MX, MY, 3.4, 15.4, 3.4, '#CC4A3A', { shadow: '#A93A2D', w: 0.9, c: '#6E2A1E' });
    const hub = g.p(MX + AXL[0] * 3.3, MY + AXL[1] * 3.3, HUBZ), base = g.p(MX + AXL[0] * 1.6, MY + AXL[1] * 1.6, HUBZ - 0.3);
    g.line2([base, hub], { w: 1.4, c: '#4A3428', boil: false, ext: 0 }); g.disc2(hub, 1.2, '#4A3428');
  }, { name: 'windmill' });
  // the sails turn about 23 degrees a second in their slightly skewed vertical plane
  T.actor({ grow: false, sample: 5, at(t) { const q = Math.round(((0.4 * t) % (Math.PI / 2)) / (Math.PI / 2) * 60) % 60; return { x: MX + AXL[0] * 3.5, y: MY + AXL[1] * 3.5, z: HUBZ, key: 's' + q, psi: q / 60 * Math.PI / 2 }; },
    draw(g, st) {
      const u = [AXL[1], -AXL[0]], P = (r, s, psi) => { const c = Math.cos(psi), sn = Math.sin(psi), dx = c * u[0], dy = c * u[1], ex = -sn * u[0], ey = -sn * u[1]; return g.p(r * dx + s * ex, r * dy + s * ey, r * sn + s * c); };
      const blades = [0, 1, 2, 3].map((k) => st.psi + k * Math.PI / 2);
      for (const psi of blades) {
        const frame = [P(2.2, 0.3, psi), P(13, 0.3, psi), P(13, 2.9, psi), P(2.2, 2.9, psi)];
        g.fill2(frame, '#F3EFE6');
        const lat = []; for (let r = 3.3; r < 13; r += 1.1) { const a = P(r, 0.3, psi), b = P(r, 2.9, psi); lat.push(a[0], a[1], b[0], b[1]); } for (const s of [1.17, 2.04]) { const a = P(2.2, s, psi), b = P(13, s, psi); lat.push(a[0], a[1], b[0], b[1]); }
        g.segs2(lat, '#7A6A55', 0.4); g.outline2(frame, { w: 0.6, c: '#4A3428', boil: false });
        g.line2([P(0, 0, psi), P(13.6, 0, psi)], { w: 0.9, c: '#4A3428', boil: false, ext: 0 });
      }
      g.disc2(P(0, 0, 0), 1.1, '#4A3428');
    } });

  /* ---------- the paddock fence (front sides stand in front of the bison) and the boathouse ---------- */
  const PX0 = -17, PX1 = 1.8, PY0 = -3, PY1 = 14;
  const fence = (g, ax, ay, bx, by) => { const n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / 2.2)), posts = [], r1 = [], r2 = []; for (let i = 0; i <= n; i++) { const x = lerp(ax, bx, i / n), y = lerp(ay, by, i / n), a = g.p(x, y, 0), b = g.p(x, y, 2.4); posts.push(a[0], a[1], b[0], b[1]); r1.push([x, y, 2.1]); r2.push([x, y, 1.1]); } g.segs2(posts, '#6E5434', 1.0, true); g.line(r1, { w: 0.7, c: '#6E5434', boil: false }); g.line(r2, { w: 0.6, c: '#6E5434', boil: false }); };
  T.obj([PX0, PY0 - 0.2, PX1, PY0 + 0.2], (g) => fence(g, PX0, PY0, PX1, PY0));
  T.obj([PX0 - 0.2, PY0, PX0 + 0.2, PY1], (g) => fence(g, PX0, PY0, PX0, PY1));
  T.obj([PX0, PY1 - 0.2, PX1, PY1 + 0.2], (g) => { fence(g, PX0, PY1, PX1, PY1); K.box(g, -3.4, PY1 - 2.2, -0.6, PY1 - 1.0, 0, 1.3, { t: '#D9B56A', l: '#B08A5C', r: '#9A7650' }, { w: 0.6 }); });
  T.obj([PX1 - 0.2, PY0, PX1 + 0.2, PY1], (g) => fence(g, PX1, PY0, PX1, PY1));
  T.obj([14.4, 2.8, 20.6, 8.4], function (g) {
    K.box(g, 14.6, 3, 20.4, 8.2, 0, 4.4, { t: '#F1EEE6', l: '#F3F0E8', r: '#DEDAD0' }, { w: 0.85 });
    K.win(g, 'L', 8.2, 15.6, 17.4, 0, 3.2, { style: 'dark', col: '#5A4636', lc: C.ink, w: 0.6 }); K.win(g, 'L', 8.2, 18.2, 19.6, 1.6, 3.2, { style: 'glass' }); K.win(g, 'R', 20.4, 4.4, 6.6, 1.6, 3.2, { style: 'glass' });
    K.hip(g, 13.8, 2.2, 21.2, 9, 4.4, 2.6, '#D2AC72', { ridge: 2.4, c: '#6E5434' });
  }, { name: 'boathouse' });
  T.obj([17.6, 26.4], function (g) {
    const isl = K.curve([[15.4, 24.2], [19, 22.4], [21.6, 23.8], [21, 27.6], [17.4, 28.2]].map((p) => [p[0], p[1], 0.2]), 4, true);
    g.fill(isl.map((p) => [p[0] * 1.06 - 18.5 * 0.06, p[1] * 1.06 - 25.3 * 0.06, 0.05]), '#E5D8B4'); g.fill(isl, '#9DC07A'); g.grass(isl, { dens: 1.4 }); g.outline(isl, { w: 0.6, c: '#5E7E3A' });
    K.tree(g, 18.4, 25.6, { r: 2.8, h: 3.4 });
  }, { name: 'islet' });
  for (const [x, y, f] of [[-6, -9.6, 'L'], [9.6, 0.2, 'R'], [-24, 21.2, 'R'], [27.6, -2.6, 'L']]) T.obj([x, y], (g) => K.bench(g, x, y, { face: f, L: 2.2 }));
  for (const [x, y] of [[-19.4, -8.6], [7.6, -9], [-5.4, 20.6], [11.4, 10.6]]) T.obj([x, y], (g) => K.lamp(g, x, y, { h: 7.5 }));
  // the boombox crate by the rink
  T.obj([22, -25.6], (g) => K.box(g, 21, -26.6, 23, -24.6, 0, 1.6, { t: '#C9A26B', l: '#B08A5C', r: '#9A7650' }, { w: 0.6 }));

  /* ---------- the cast ---------- */
  // tulips in rows beside the mill
  T.cast([-36.2, 17.6, -21.6, 35.6], function (g) {
    const rows = ['#D9443A', '#F6F3EC', '#E883A8', '#E9C543', '#D9443A', '#E8873C', '#F6F3EC', '#B9478A', '#D9443A'], R = RNG('tulips');
    rows.forEach((col, i) => { const y = 18.6 + i * 1.85 + 0.6; for (let x = -35.6; x < -22; x += 0.95) { const p = g.p(x + (R() - 0.5) * 0.3, y, 0), t = [p[0], p[1] - 3.6]; g.segs2([p[0], p[1], t[0], t[1], p[0], p[1] - 0.6, p[0] + 1.3, p[1] - 2.0], '#5E8A3E', 0.55); g.fill2([[t[0] - 1.2, t[1] - 1.6], [t[0] - 0.4, t[1] - 0.9], [t[0], t[1] - 2.0], [t[0] + 0.4, t[1] - 0.9], [t[0] + 1.2, t[1] - 1.6], [t[0] + 1.0, t[1] + 0.3], [t[0] - 1.0, t[1] + 0.3]], col); g.fill2([[t[0] + 0.1, t[1] - 1.4], [t[0] + 1.2, t[1] - 1.6], [t[0] + 1.0, t[1] + 0.3], [t[0] + 0.1, t[1] + 0.3]], shade(col, 0.16)); } });
  }, { on: true });
  // bison in the paddock: heavy humped shoulders, head low, shuffling a little
  const bison = (g, st) => {
    const o = g.p(0, 0, 0), s = st.fl * 1.55, X = (d) => o[0] + d * s, Y = (d) => o[1] + d * 1.55, bob = st.f % 2 ? 0.5 : 0;
    const legs = []; for (const dx of [-5.6, -3.4, 2.6, 4.8]) legs.push(X(dx), Y(-3.8), X(dx + 0.2 * s), Y(0)); g.segs2(legs, '#2E2018', 2.2);
    const body = K.curve([[X(-7.4), Y(-3.9)], [X(-7.8), Y(-8.2)], [X(-3), Y(-9.8)], [X(2.4), Y(-12.8)], [X(6.2), Y(-11)], [X(7.2), Y(-6)], [X(2), Y(-3.4)], [X(-4), Y(-3.6)]], 3, true);
    g.fill2(body, '#5B3F2D');
    g.fill2(K.curve([[X(0.6), Y(-12.4)], [X(2.6), Y(-13.1)], [X(6.4), Y(-11)], [X(7.4), Y(-6.4)], [X(5), Y(-4.2)], [X(1.6), Y(-5.6)], [X(0), Y(-9)]], 3, true), '#7B5538');
    g.line2(body, { w: 0.55, c: '#2E2018', close: true, boil: false, wob: 0.4 });
    const hc = [X(8.4), Y(-5.6 + bob)], hd = []; for (let i = 0; i < 10; i++) { const a = TAU * i / 10; hd.push([hc[0] + Math.cos(a) * 3.8, hc[1] + Math.sin(a) * 3.2]); }
    g.fill2(hd, '#3E2B20'); g.line2(hd, { w: 0.5, c: '#1E1510', close: true, boil: false });
    g.fill2([[X(7.6), Y(-4 + bob)], [X(9.4), Y(-4 + bob)], [X(8.6), Y(-1.8 + bob)]], '#3E2B20');
    g.line2([[X(8), Y(-7.4 + bob)], [X(7.6), Y(-8.9 + bob)], [X(8.4), Y(-9.3 + bob)]], { w: 0.6, c: '#EDE6D6', boil: false, ext: 0, taper: 0 });
    g.disc2([X(9.4), Y(-6 + bob)], 0.35, '#100A08');
    g.line2([[X(-7.6), Y(-7.6)], [X(-8.8), Y(-5.4)]], { w: 0.5, c: '#2E2018', boil: false });
  };
  [[-11.6, 2.6, 0, 1], [-3.6, 1.2, 13, -1], [-8.2, 9.2, 27, 1]].forEach(([bx, by, ph, s0]) => T.actor({ sample: 0.8, period: 40,
    at(t) { const a = (t + ph) / 40 * TAU, x = bx + Math.cos(a) * 1.4, y = by + Math.sin(a) * 0.9, s = (-Math.sin(a) - Math.cos(a) * 0.4) * s0 > 0 ? 1 : -1, f = Math.floor(t * 0.7 + ph) % 2; return { x, y, key: (s > 0 ? 'r' : 'l') + f, fl: s, f }; },          // fl: facing (st.s would be a scale)
    draw: bison }));
  // the rink: two figures near the middle, skaters circling them, and a boombox pulsing to the beat
  const RC = [20.5, -14.5];
  [[-1.2, 0.6, 301, 'cheer'], [1.0, -0.8, 302, 'wave']].forEach(([dx, dy, seed, pose]) => { const w = K.who(seed); T.actor({ sample: 5, at(t) { const f = Math.floor(((t * 1.2 + seed) % 1) * 6); return { x: RC[0] + dx, y: RC[1] + dy, key: 'd' + f, ph: f / 6 }; }, draw(g, st) { K.person(g, 0, 0, 0, Object.assign({}, w, { dir: seed % 2 ? 0 : 1, pose, ph: st.ph })); } }); });
  for (let k = 0; k < 5; k++) { const w = K.who(311 + k), r = 6.2 + (k % 2) * 0.8; T.actor({ sample: 0.3, period: TAU / 0.42,
    at(t) { const a = 0.42 * t + k * TAU / 5, x = RC[0] + Math.cos(a) * r, y = RC[1] + Math.sin(a) * r, vx = -Math.sin(a), vy = Math.cos(a), dir = vx + vy > 0 ? (vx - vy > 0 ? 0 : 1) : (vx - vy > 0 ? 3 : 2), f = Math.floor(((t * 1.1 + k * 0.3) % 1) * 8); return { x, y, key: dir + '.' + f, dir, ph: f / 8 }; },
    draw(g, st) { K.person(g, 0, 0, 0, Object.assign({}, w, { dir: st.dir, pose: 'walk', ph: st.ph, shoe: '#D44A3C' })); } }); }
  T.actor({ grow: false, sample: 5, at(t) { const f = Math.floor(((t * 2.4) % 1) * 6); return { x: 22, y: -25.6, z: 1.6, key: 'bb' + f, f }; },
    draw(g, st) {
      const o = g.p(0, 0, 0), b = [[o[0] - 3, o[1] - 3.6], [o[0] + 3, o[1] - 3.6], [o[0] + 3, o[1]], [o[0] - 3, o[1]]];
      g.fill2(b, '#2F2C2A'); g.outline2(b, { w: 0.5, boil: false }); g.disc2([o[0] - 1.5, o[1] - 1.8], 1.1, '#77736E'); g.disc2([o[0] + 1.5, o[1] - 1.8], 1.1, '#77736E'); g.line2([[o[0] - 2.2, o[1] - 3.6], [o[0] - 1.4, o[1] - 5], [o[0] + 1.4, o[1] - 5], [o[0] + 2.2, o[1] - 3.6]], { w: 0.55, boil: false });
      const k = st.f / 6; for (let i = 0; i < 2; i++) { const r = 4.4 + (k + i * 0.5) % 1 * 4.2, al = 1 - ((k + i * 0.5) % 1); if (al < 0.15) continue; for (const s of [-1, 1]) g.line2(arcPts(o[0], o[1] - 1.8, r, s > 0 ? -0.7 : Math.PI - 0.7, s > 0 ? 0.7 : Math.PI + 0.7, 6), { w: 0.7 * al + 0.2, c: '#2F2C2A', boil: false, ext: 0 }); }
    } });
  // boats drifting round the islet, ducks
  [[0, '#F3F1EA', 321], [Math.PI, '#E9C543', 322]].forEach(([ph, hull, seed]) => T.actor({ sample: 0.5, period: TAU / 0.09,
    at(t) { const a = 0.09 * t + ph, x = 19.6 + Math.cos(a) * 9, y = 24.4 + Math.sin(a) * 6.2, q = Math.round(Math.atan2(Math.cos(a) * 6.2, -Math.sin(a) * 9) / (TAU / 24)); const f = Math.floor((t * 0.7 + ph) % 1 * 6); return { x, y, key: 'b' + q + '.' + f, ang: q * TAU / 24, f }; },
    draw(g, st) { K.boat(g, st.ang, { kind: 'row', L: 2.6, W: 1.6, hull, ph: st.f / 6, rower: K.who(seed) }); } }));
  for (let k = 0; k < 3; k++) T.actor({ sample: 0.6, period: 30, at(t) { const a = t / 30 * TAU + k * 0.5, x = 12 + Math.cos(a) * 3 + k * 1.2, y = 19 + Math.sin(a) * 2; return { x, y, z: 0.1, key: 'duck' + (Math.cos(a) > 0 ? 'l' : 'r'), fl: Math.cos(a) > 0 ? -1 : 1 }; },
    draw(g, st) { const o = g.p(0, 0, 0), s = st.fl; g.fill2(arcPts(o[0], o[1] - 0.6, 1.6, 0, Math.PI, 6).map((p) => [p[0], o[1] - 0.6 - (p[1] - o[1] + 0.6) * 0.6]), '#FAF8F2'); g.disc2([o[0] + 1.3 * s, o[1] - 2.2], 0.8, '#FAF8F2'); g.disc2([o[0] + 2.1 * s, o[1] - 2.1], 0.35, '#E8A23A'); } });
  // a cyclist going round the loop, walkers on the paths
  const LOOPC = K.curve([[-21, -7], [-8, -8], [5.5, -7], [7, 4], [5.5, 17.5], [-8, 19], [-21.5, 17], [-23, 5]], 8, true);
  const LS = [0]; for (let i = 1; i <= LOOPC.length; i++) { const a = LOOPC[i - 1], b = LOOPC[i % LOOPC.length]; LS.push(LS[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const onLoop = (d) => { const L = LS[LS.length - 1]; d = ((d % L) + L) % L; let i = 0; while (LS[i + 1] < d) i++; const a = LOOPC[i], b = LOOPC[(i + 1) % LOOPC.length], u = (d - LS[i]) / (LS[i + 1] - LS[i]); return { x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), ang: Math.atan2(b[1] - a[1], b[0] - a[0]) }; };
  T.actor({ sample: 0.3, period: LS[LS.length - 1] / 5, at(t) { const p = onLoop(5 * t + 10), q = Math.round(p.ang / (TAU / 16)); return { x: p.x, y: p.y, key: 'cy' + q, ang: q * TAU / 16 }; }, draw(g, st) { K.bike(g, st.ang, { col: '#5F8FC9', seed: 331 }); } });
  [[0.62, 1.3, 332, 1], [0.15, 1.2, 333, -1]].forEach(([off, v, seed, dirn]) => { const w = K.who(seed); T.actor({ sample: 0.35, period: LS[LS.length - 1] / v, at(t) { const p = onLoop(dirn * v * t + off * LS[LS.length - 1]), vx = Math.cos(p.ang) * dirn, vy = Math.sin(p.ang) * dirn, dir = vx + vy > 0 ? (vx - vy > 0 ? 0 : 1) : (vx - vy > 0 ? 3 : 2), f = Math.floor(((t * 0.75 + seed) % 1) * 8); return { x: p.x + 1, y: p.y + 0.6, key: dir + '.' + f, dir, ph: f / 8 }; }, draw(g, st) { K.person(g, 0, 0, 0, Object.assign({}, w, { dir: st.dir, pose: 'walk', ph: st.ph })); } }); });
  // people who stay put: at the paddock fence, a drum circle by the fountain, by the pond, at the conservatory
  const P = (x, y, o, z) => T.cast([x, y], (g) => K.person(g, x, y, z || 0, o), z ? { on: true } : null);
  P(-6, 15.6, K.who(341, { dir: 2, k: 0.8 })); P(-3.8, 15.8, K.who(342, { dir: 2, pose: 'wave', ph: 0.2 })); P(-9, 16, K.who(343, { dir: 3 }));
  T.cast([-16.6, -12], function (g) { for (const [x, y, d, sd] of [[-17.4, -11.2, 1, 351], [-15.4, -12.8, 0, 352], [-18.6, -13.6, 0, 353]]) { K.person(g, x, y, 0, K.who(sd, { dir: d, pose: 'hold' })); const p = g.p(x + 0.6, y + 0.6, 2.6); g.fill2([[p[0] - 1.6, p[1] - 2], [p[0] + 1.6, p[1] - 2], [p[0] + 1.1, p[1] + 2], [p[0] - 1.1, p[1] + 2]], '#B5624B'); g.fill2(arcPts(p[0], p[1] - 2, 1.6, Math.PI, TAU, 6).map((q) => [q[0], p[1] - 2 - (p[1] - 2 - q[1]) * 0.4]), '#EFE6D2'); g.outline2([[p[0] - 1.6, p[1] - 2], [p[0] + 1.6, p[1] - 2], [p[0] + 1.1, p[1] + 2], [p[0] - 1.1, p[1] + 2]], { w: 0.5, boil: false }); } });
  P(-6.2, -9, K.who(361, { dir: 0, pose: 'sit', k: 0.92 }), 1.3); P(10.2, 1.6, K.who(362, { dir: 0, pose: 'sit', k: 0.92 }), 1.3);
  P(8.6, 13.2, K.who(363, { dir: 1, pose: 'hold' })); P(-17, -23.2, K.who(364, { dir: 2 })); P(-15.4, -22.6, K.who(365, { dir: 3, hairStyle: 'long' }));
  P(5.2, -26.4, K.who(366, { dir: 1, pose: 'hold', top: '#5FA58F' })); P(13.6, -30.4, K.who(367, { dir: 0 }), 2.9);
  P(-26.6, 14.6, K.who(368, { dir: 1, pose: 'wave' })); P(27.6, -1.6, K.who(369, { dir: 1, pose: 'sit', k: 0.9 }), 1.3);
});
