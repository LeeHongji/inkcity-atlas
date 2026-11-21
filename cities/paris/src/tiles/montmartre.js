'use strict';
/* (100,-100) Montmartre: the butte rises from the right corner of the map to a plateau 15 u up (a hill object with
   the whole tile as its footprint; its far slopes fall back to street level at the tile's far edges, out of sight).
   On the plateau Sacré-Cœur in white travertine (turned to look at us down its stairs): the portico of three arches
   with the two bronze riders, the great Romano-Byzantine dome on its drum with the lantern, the four small domes, the
   campanile behind. The stairs come straight down the lawns of the Square Louise-Michel to the foot of the hill, with
   people sitting on them and a busker at the top; beside them the funicular's cabin climbs and descends its track.
   Place du Tertre on the right shoulder: trees, red umbrellas, painters at their easels, a café terrace, little
   village houses in faded pastels; the pink house with green shutters; the Clos Montmartre vineyard on the far slope. */
SF.tile('montmartre', 100, -100, { rim: 54 }, function (T) {
  const H = 37, PX = -12, PY = -12, HT = 20;
  const hAt = (x, y) => { const d = Math.hypot(x - PX, y - PY), s = clamp((d - 7) / 37, 0, 1); return HT * (1 - s * s * (3 - 2 * s)) * smooth((x + H) / 9) * smooth((y + H) / 9); };
  const LAWN = PC.lawn;
  T.ground(function (g) { K.slab(g, H, { top: LAWN, cut: 'x' }); });

  /* ---------------- the hill ---------------- */
  // The hill is ground, not a standing object: nothing in the map lies behind its crest (its far slopes fall back to
  // street level at the tile's far edges), and as a whole-tile object it would become a sprite whenever a car passed
  // behind its footprint and drag every place drawn after it into the sprite layer with it.
  T.ground(function (g) {
    g.boilP = 0.15;
    const S = 3, cells = [];
    for (let x = -H; x < H - 0.01; x += S) for (let y = -H; y < H - 0.01; y += S) { const x1 = Math.min(H, x + S), y1 = Math.min(H, y + S); cells.push([x, y, x1, y1]); }
    cells.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
    for (const [x0, y0, x1, y1] of cells) {
      const z00 = hAt(x0, y0), z10 = hAt(x1, y0), z11 = hAt(x1, y1), z01 = hAt(x0, y1);
      const nx = -((z10 + z11) - (z00 + z01)) / (2 * (x1 - x0)), ny = -((z01 + z11) - (z00 + z10)) / (2 * (y1 - y0)), nl = Math.hypot(nx, ny, 1);
      const lit = clamp(0.5 + (-0.55 * nx + 0.75 * ny) / nl * 1.4, 0, 1), col = mix('#9DB470', '#C9D99E', lit);
      const q = [[x0, y0, z00], [x1, y0, z10], [x1, y1, z11], [x0, y1, z01]];
      g.fill(q, col);
      if (((x0 * 7 + y0 * 3) | 0) % 2 === 0) g.grass(q, { dens: 0.5 });
    }
    // the outline of the hill against the street: its contour along the near edges
    const e1 = [], e2 = []; for (let i = 0; i <= 24; i++) { const t = -H + 2 * H * i / 24; e1.push([H, t, hAt(H, t)]); e2.push([t, H, hAt(t, H)]); }
    g.line(e1, { w: 0.8, boil: false }); g.line(e2, { w: 0.8, boil: false });
  });
  // paved things lying on the hill (same footprint, declared after): the parvis, the stairs, the square, the paths
  const surf = (pts, n) => { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; for (let k = 0; k < n; k++) { const x = lerp(a[0], b[0], k / n), y = lerp(a[1], b[1], k / n); out.push([x, y, hAt(x, y) + 0.05]); } } return out; };
  const ST = { x0: -15, x1: -9, y0: -4, y1: 34 };
  T.ground(function (g) {
    g.boilP = 0.2;
    // the plateau's paving round the basilica and the terrace in front
    const pl = surf([[-30, -32], [-2, -32], [-2, -2], [-30, -2]], 6); g.fill(pl, '#E6DFCF'); g.scuff(pl.map((p) => p), { dir: -0.6, len: 2, c: '#F3EEE3', dens: 0.5, w: 0.45, spread: 0.6 });
    // a winding path down the right flank to the Place du Tertre and the street
    const path = []; for (let i = 0; i <= 20; i++) { const t = i / 20, x = lerp(-2, 34, t), y = -6 + Math.sin(t * Math.PI * 1.5) * 6 + t * 10; path.push([x, y]); }
    const pw = path.map(([x, y]) => [x, y - 1.6]).concat(path.slice().reverse().map(([x, y]) => [x, y + 1.6]));
    g.fill(pw.map(([x, y]) => [x, y, hAt(x, y) + 0.04]), '#DCD2BD');
    // Place du Tertre
    const tq = surf([[4, -26], [20, -26], [20, -12], [4, -12]], 6); g.fill(tq, PC.cobble); g.scuff(tq, { dir: -0.6, len: 1, c: '#C4B89E', dens: 1.2, w: 0.45, spread: 1.4 });
    // the vineyard: rows of vines on the far right slope
    for (let r = 0; r < 6; r++) { const y = -35 + r * 1.6, row = []; for (let x = 22; x <= 35; x += 1) row.push([x, y, hAt(x, y) + 0.3]); g.line(row, { w: 1.4, c: '#6E8A3E', boil: false }); g.line(row.map((p) => [p[0], p[1] + 0.3, p[2] + 0.2]), { w: 0.6, c: '#C9A44A', boil: false }); }
    // the stairs: landings and flights, every riser facing us
    const zs = (y) => hAt((ST.x0 + ST.x1) / 2, y);
    let yPrev = ST.y0, zPrev = zs(ST.y0);
    g.fill([[ST.x0 - 0.6, ST.y0, zPrev], [ST.x1 + 0.6, ST.y0, zPrev], [ST.x1 + 0.6, ST.y1, 0], [ST.x0 - 0.6, ST.y1, 0]].map((p) => p), '#D6CDBA');
    for (let y = ST.y0 + 0.6; y <= ST.y1; y += 0.6) {
      const z = zs(y), zq = Math.round(z / 0.42) * 0.42;
      if (zq < zPrev - 0.01) {
        g.fill([[ST.x0, y, zPrev], [ST.x1, y, zPrev], [ST.x1, y, zq], [ST.x0, y, zq]], '#CBC1AC');
        g.fill([[ST.x0, yPrev, zPrev], [ST.x1, yPrev, zPrev], [ST.x1, y, zPrev], [ST.x0, y, zPrev]], '#EDE6D6');
        g.fine([[ST.x0, y, zPrev], [ST.x1, y, zPrev]], { w: 0.3, c: '#A99A7B' });
        yPrev = y; zPrev = zq;
      }
    }
    g.fill([[ST.x0, yPrev, zPrev], [ST.x1, yPrev, zPrev], [ST.x1, ST.y1, 0], [ST.x0, ST.y1, 0]], '#EDE6D6');
    // the stone kerbs of the stairs
    for (const x of [ST.x0, ST.x1]) { const k = []; for (let y = ST.y0; y <= ST.y1; y += 1) k.push([x, y, zs(y) + 0.5]); g.line(k, { w: 0.6, boil: false }); }
    // the funicular's track
    for (const x of [-5.6, -4.4]) { const tr = []; for (let y = -3; y <= 34; y += 1) tr.push([x, y, hAt(x, y) + 0.3]); g.line(tr, { w: 0.4, c: '#4A4540', boil: false }); }
    const sl = []; for (let y = -3; y <= 34; y += 1.2) { const a = g.p(-6, y, hAt(-6, y) + 0.25), b = g.p(-4, y, hAt(-4, y) + 0.25); sl.push(a[0], a[1], b[0], b[1]); } g.segs2(sl, '#7E766A', 0.4);
  }, { name: 'butte paving' });

  /* ---------------- Sacré-Cœur ---------------- */
  const WH = { t: '#F7F4EC', l: '#F4EFE4', r: '#DFD8C8' }, Z0 = HT;
  T.obj([-27, -30, -5, -5], function (g) {
    g.boilP = 0.3;
    // the campanile behind
    K.box(g, -19, -30, -13, -24, Z0, Z0 + 25, WH, { w: 0.85 });
    for (const [f, p, a0] of [['L', -24, -19], ['R', -13, -30]]) { const ar = []; const m = a0 + 3; for (let k = 0; k <= 6; k++) { const t = Math.PI * k / 6; ar.push(K.pt(f, p + 0.03, m + Math.cos(t) * 1.3, Z0 + 19 + Math.sin(t) * 1.3)); } ar.unshift(K.pt(f, p + 0.03, m + 1.3, Z0 + 12)); ar.push(K.pt(f, p + 0.03, m - 1.3, Z0 + 16)); g.fill(ar, '#8C8578'); }
    K.dome(g, -16, -27, 2.6, Z0 + 25, 3.2, '#F4EFE4', { w: 0.7, shadow: '#DCD4C3', band: true }); g.disc2(g.p(-16, -27, Z0 + 29), 0.5, '#C9C2B2');
    // the body: nave and transepts in white stone
    K.box(g, -25, -24, -7, -7, Z0, Z0 + 11, WH, { w: 0.9 });
    for (const [f, p, a0, a1] of [['L', -7, -25, -7], ['R', -7, -24, -7]]) for (let a = a0 + 2; a < a1 - 1; a += 3.2) { const ar = [K.pt(f, p + 0.03, a - 0.6, Z0 + 4), K.pt(f, p + 0.03, a + 0.6, Z0 + 4)]; for (let k = 0; k <= 6; k++) { const t = Math.PI * k / 6; ar.push(K.pt(f, p + 0.03, a + Math.cos(t) * 0.6, Z0 + 7 + Math.sin(t) * 0.6)); } g.fill(ar, '#7E8A96'); }
    K.box(g, -25.4, -24.4, -6.6, -6.6, Z0 + 11, Z0 + 11.6, WH, { w: 0.6, nohid: true });
    // the drum and the great dome
    K.cyl(g, -16, -16, 6.0, Z0 + 11.6, Z0 + 13, WH, { w: 0.7, n: 18 });
    K.cyl(g, -16, -16, 5.2, Z0 + 13, Z0 + 18.5, WH, { w: 0.85, n: 18 });
    const cols = []; for (let k = 0; k < 9; k++) { const a = -Math.PI * 0.2 + Math.PI * 1.05 * k / 8, p = g.p(-16 + Math.cos(a) * 5.25, -16 + Math.sin(a) * 5.25, Z0 + 13.4), q = g.p(-16 + Math.cos(a) * 5.25, -16 + Math.sin(a) * 5.25, Z0 + 18.1); cols.push(p[0], p[1], q[0], q[1]); } g.segs2(cols, '#C9C2B2', 0.9);
    for (let k = 0; k < 8; k++) { const a = -Math.PI * 0.15 + Math.PI * 1.0 * (k + 0.5) / 8, p = g.p(-16 + Math.cos(a) * 5.22, -16 + Math.sin(a) * 5.22, Z0 + 14); g.fill2([[p[0] - 0.7, p[1]], [p[0] + 0.7, p[1]], [p[0] + 0.7, p[1] - 8], [p[0] - 0.7, p[1] - 8]], '#7E8A96', true); }
    K.dome(g, -16, -16, 5.4, Z0 + 18.5, 8.6, '#F7F4EC', { w: 0.9, shadow: '#DED6C5', band: true, ribs: 12, ribCol: '#D4CCBA', ribW: 0.4 });
    K.cyl(g, -16, -16, 1.2, Z0 + 27, Z0 + 29.4, WH, { w: 0.55, n: 10 });
    K.dome(g, -16, -16, 1.3, Z0 + 29.4, 1.4, '#F4EFE4', { w: 0.5 }); const fin = g.p(-16, -16, Z0 + 30.8); g.line2([fin, [fin[0], fin[1] - 5]], { w: 0.45, c: '#B8B0A0', boil: false }); g.segs2([fin[0] - 1.2, fin[1] - 3.4, fin[0] + 1.2, fin[1] - 3.4], '#B8B0A0', 0.45);
    // the small domes at the corners we see
    for (const [x, y] of [[-23, -9], [-9, -9], [-9, -22]]) { K.cyl(g, x, y, 2.0, Z0 + 11.6, Z0 + 14.4, WH, { w: 0.6, n: 12 }); K.dome(g, x, y, 2.1, Z0 + 14.4, 3.2, '#F7F4EC', { w: 0.7, shadow: '#DED6C5', band: true }); const t = g.p(x, y, Z0 + 17.6); g.line2([t, [t[0], t[1] - 2.4]], { w: 0.4, c: '#B8B0A0', boil: false }); }
  }, { name: 'sacre coeur' });
  // the portico on the parvis, with the two bronze riders on top
  T.obj([-25, -7, -7, -4.5], function (g) {
    const y1 = -4.5, Z = Z0 + 7.4;
    K.box(g, -25, -7, -7, y1, Z0, Z, WH, { w: 0.85 });
    for (const m of [-20.5, -16, -11.5]) { const ar = [K.pt('L', y1 + 0.03, m - 1.5, Z0), K.pt('L', y1 + 0.03, m + 1.5, Z0)]; for (let k = 0; k <= 8; k++) { const t = Math.PI * k / 8; ar.push(K.pt('L', y1 + 0.03, m + Math.cos(t) * 1.5, Z0 + 4.4 + Math.sin(t) * 1.5)); } g.fill(ar, '#6E6A60'); g.line(ar.slice(2), { w: 0.5, boil: false }); }
    K.box(g, -25.3, -7.3, -6.7, y1 + 0.3, Z, Z + 0.6, WH, { w: 0.55, nohid: true });
    const gb = [K.pt('L', y1 + 0.04, -21, Z + 0.6), K.pt('L', y1 + 0.04, -11, Z + 0.6), K.pt('L', y1 + 0.04, -16, Z + 3.0)]; g.fill(gb, '#F4EFE4'); g.outline(gb, { w: 0.5, boil: false });
    for (const x of [-23.5, -8.5]) { const c = g.p(x, -5.6, Z + 0.6); g.fill2([[c[0] - 2.4, c[1] - 0.6], [c[0] + 2.2, c[1] - 1.0], [c[0] + 2.8, c[1] - 3.4], [c[0] + 1.4, c[1] - 3.0], [c[0] - 1.8, c[1] - 2.8]], '#4E5A52', true); g.fill2([[c[0] - 0.4, c[1] - 3.0], [c[0] + 0.6, c[1] - 3.0], [c[0] + 0.4, c[1] - 6.4], [c[0] - 0.4, c[1] - 6.4]], '#4E5A52', true); g.disc2([c[0], c[1] - 7.0], 0.6, '#4E5A52'); }
  }, { on: true, name: 'portico' });

  /* ---------------- the Place du Tertre, the village ---------------- */
  // little houses round the square (on its far sides), each standing on the slope at its lowest corner
  const HOUSES = [[2, -37, 9, -28, '#EFD9B8', 2], [9, -37, 16, -28, '#E9C9B8', 3], [16, -37, 22, -28, '#F1E6CF', 2], [-1, -26, 3, -14, '#E7D3A8', 2], [22, -22, 29, -14, '#D9E3D1', 2]];
  HOUSES.forEach(([x0, y0, x1, y1, col, n], i) => T.obj([x0, y0, x1, y1], function (g) {
    const zb = Math.min(hAt(x0, y0), hAt(x1, y0), hAt(x1, y1), hAt(x0, y1)), zt = Math.max(hAt(x1, y1), hAt(x0, y1), hAt(x1, y0)) + n * 3.6 + 1.0;
    K.box(g, x0, y0, x1, y1, zb, zt, { t: shade(col, -0.15), l: col, r: shade(col, 0.12) }, { w: 0.8 });
    for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) { const nb = Math.max(1, Math.round((a1 - a0) / 2.6)); for (let k = 0; k < nb; k++) { const m = a0 + (a1 - a0) * (k + 0.5) / nb; for (let s = 0; s < n; s++) { const z0 = zt - (s + 1) * 3.4 - 0.4; PA.win(g, f, p, m - 0.45, m + 0.45, z0, z0 + 1.9, { pane: '#5E6B76', sc: shade(col, -0.2) }); for (const d of [-1, 1]) g.fill(K.on(f, p + 0.03, m + d * 0.5, m + d * 0.95, z0, z0 + 1.9), ['#4F7A5E', '#5E7E9A', '#8A5A3A', '#4F7A5E', '#7A5BA0'][i]); } } }
    K.gable(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, zt, 2.6, (x1 - x0) > (y1 - y0) ? 'x' : 'y', { a: '#B8664E', b: '#9F5540', e: col }, { c: '#6E3A2A' });
  }, { on: true, name: 'village house' }));
  // the pink house with green shutters, lower on the slope
  T.obj([20, 4, 27, 10], function (g) {
    const zb = Math.min(hAt(20, 4), hAt(27, 10), hAt(20, 10), hAt(27, 4)), zt = zb + 8.2, col = '#EBB7B4';
    K.box(g, 20, 4, 27, 10, zb, zt, { t: '#E8C7C2', l: col, r: shade(col, 0.1) }, { w: 0.8 });
    for (const [f, p, a0, a1] of [['L', 10, 20, 27], ['R', 27, 4, 10]]) for (let a = a0 + 1.6; a < a1 - 1; a += 2.4) for (const z0 of [zb + 1.6, zb + 5.0]) { PA.win(g, f, p, a - 0.4, a + 0.4, z0, z0 + 1.8, { pane: '#5E6B76', sc: '#F3E3DF' }); for (const d of [-1, 1]) g.fill(K.on(f, p + 0.03, a + d * 0.45, a + d * 0.9, z0, z0 + 1.8), '#4F8A5E'); }
    K.hip(g, 19.7, 3.7, 27.3, 10.3, zt, 2.4, '#B8664E', { ridge: 1, c: '#6E3A2A' });
  }, { on: true, name: 'maison rose' });
  // trees on the square and round the basilica, on the lawns of the slope
  for (const [x, y] of [[7, -23], [12, -24], [17, -23], [7, -15], [17, -15], [-32, -4], [-33, 6], [2, 6], [8, 14], [-25, 14], [-30, 22], [4, 24], [14, 26], [26, 20], [30, 30], [-24, 30]]) T.obj([x, y], (g) => PA.plane(g, x, y, { z: hAt(x, y), r: 3.2, h: 5.6, turn: 0.5 + h1(x * 5 + y) * 0.4 }), { on: true, name: 'tree' });
  // red umbrellas over café tables on the square, painters at their easels, their customers
  for (const [x, y] of [[9.5, -19.5], [14.5, -19.5]]) T.cast([x, y], function (g) {
    const z = hAt(x, y), b = g.p(x, y, z), t = g.p(x, y, z + 5.6); g.segs2([b[0], b[1], t[0], t[1]], '#6E5A44', 0.45);
    for (const [dx, dy, s] of [[-1.4, 0, 0], [1.4, 0.6, 1]]) PA.person(g, x + dx, y + dy, z + 1.3, PA.who(1300 + Math.round(x * 3 + y) + s, { dir: s ? 1 : 0, pose: 'sit' }));
    g.fill2(arcPts(t[0], t[1] + 1.0, 8.0, Math.PI, TAU, 10).concat([[t[0] + 8, t[1] + 2.6], [t[0] - 8, t[1] + 2.6]]), '#C9463E', true); g.line2(arcPts(t[0], t[1] + 1.0, 8.0, Math.PI, TAU, 10), { w: 0.4, c: '#7A2A22', boil: false });
  }, { on: true });
  [[5.5, -17, 'R'], [19, -24.5, 'L'], [11.5, -13.4, 'L'], [19.5, -15, 'R']].forEach(([x, y, f], i) => T.cast([x, y], (g) => { const z = hAt(x, y); g.at(0, 0, z, (g2) => PA.painter(g2, x, y, PA.who(1320 + i, { beret: i % 2 ? '#2A2622' : undefined, top: i % 2 ? '#E7E2D6' : '#5A6B5A' }), f, 1320 + i)); }, { on: true }));
  T.cast([3.6, -21], (g) => { const z = hAt(3.6, -21); PA.person(g, 3.6, -21, z, PA.who(1330, { dir: 0, pose: 'hold' })); PA.person(g, 4.4, -19.4, z, PA.who(1331, { dir: 0 })); }, { on: true });

  /* ---------------- the stairs' people, the funicular ---------------- */
  T.cast([ST.x1, 6], function (g) {
    const sp = [[-13.6, 2, 1, 's'], [-10.6, 3.2, 1, 's'], [-12.4, 7.8, 1, 's'], [-14.2, 12.2, 1, 's'], [-9.8, 14.6, 1, 's'], [-12.0, 20.4, 3, 'w'], [-10.2, 26.4, 1, 's'], [-13.8, 28.6, 1, 's']];
    sp.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
    sp.forEach(([x, y, d, k], i) => { const z = Math.round(hAt(-12, y) / 0.42) * 0.42; PA.person(g, x, y, z, PA.who(1340 + i, { dir: d, pose: k === 's' ? 'sit' : 'stand' })); });
  }, { on: true, name: 'stairs people' });
  // the busker with his guitar on the parvis, his audience
  T.cast([-12, -2.6], function (g) {
    const z = hAt(-12, -2.6), r = PA.person(g, -12, -2.6, z, PA.who(1350, { dir: 1, pose: 'stand', hands: [[1.6, -10.6], [-2.4, -12.4]], top: '#2F3A4F' }));
    const hp = r.hip; g.fill2(K.curve([[hp[0] - 3.4, hp[1] - 1.8], [hp[0] + 0.6, hp[1] - 5.4], [hp[0] + 2.2, hp[1] - 3.6], [hp[0] - 1.6, hp[1] + 0.2]], 3, true), '#B8743A', true); g.line2([[hp[0] + 1.6, hp[1] - 4.4], [hp[0] + 6.4, hp[1] - 8.2]], { w: 0.55, c: '#3A2A1E', boil: false });
    for (const [x, y, s] of [[-16, -0.6, 1351], [-8.4, -0.4, 1352], [-14, 0.4, 1353]]) PA.person(g, x, y, hAt(x, y), PA.who(s, { dir: 2, pose: s % 2 ? 'hold' : 'stand' }));
  }, { on: true });
  // the funicular: one cabin climbs as the other... here one cabin, up and down the track, stepped floor
  T.obj([-7.5, -6, -2.5, -1], function (g) { const z = hAt(-5, -3.5); K.box(g, -7.5, -6, -2.5, -1, z, z + 4.4, { t: '#5E6B76', l: '#E9E2CC', r: '#D2C4A2' }, { w: 0.7 }); K.win(g, 'L', -1, -7, -3, z + 1.2, z + 3.4, { style: 'glass' }); }, { on: true, name: 'upper station' });
  T.obj([-7.5, 30, -2.5, 35], function (g) { const z = 0; K.box(g, -7.5, 30, -2.5, 35, z, z + 4.2, { t: '#5E6B76', l: '#E9E2CC', r: '#D2C4A2' }, { w: 0.7 }); K.win(g, 'L', 35, -7, -3, 1.0, 3.2, { style: 'glass' }); PA.sign(g, 'L', 35, -7, -3, 3.4, 4.0, '#2F5D4B', { seed: 13, word: 'FUNICULAIRE' }); }, { on: true, name: 'lower station' });
  T.actor({ sample: 0.3, period: 36, grow: false,
    at(t) { const u = ((t / 36) % 1 + 1) % 1, s = u < 0.38 ? smooth(u / 0.38) : u < 0.5 ? 1 : u < 0.88 ? 1 - smooth((u - 0.5) / 0.38) : 0, y = lerp(28.5, 0.5, s); return { x: -5, y: y + 1.6, z: hAt(-5, y), key: Math.round(s * 12), y0: y }; },
    draw(g, st) {
      const y = st.y0, zf = (yy) => hAt(-5, yy) - hAt(-5, y), P = (x, yy, z) => g.p(x + 5, yy - y - 1.6, z);
      const fl = [P(-6.2, y - 1.6, zf(y - 1.6) + 0.5), P(-3.8, y - 1.6, zf(y - 1.6) + 0.5), P(-3.8, y + 1.6, zf(y + 1.6) + 0.5), P(-6.2, y + 1.6, zf(y + 1.6) + 0.5)];
      const zt = Math.max(zf(y - 1.6), zf(y + 1.6)) + 3.8;
      const side = [P(-3.8, y - 1.6, zf(y - 1.6) + 0.5), P(-3.8, y + 1.6, zf(y + 1.6) + 0.5), P(-3.8, y + 1.6, zt), P(-3.8, y - 1.6, zt)], front = [P(-6.2, y + 1.6, zf(y + 1.6) + 0.5), P(-3.8, y + 1.6, zf(y + 1.6) + 0.5), P(-3.8, y + 1.6, zt), P(-6.2, y + 1.6, zt)];
      g.fill2(front, '#E6C24F', true); g.fill2(side, '#D4AE3E', true);
      g.fill2([P(-6.0, y + 1.62, zt - 2.6), P(-4.0, y + 1.62, zt - 2.6), P(-4.0, y + 1.62, zt - 0.5), P(-6.0, y + 1.62, zt - 0.5)], '#CFE0E4', true);
      g.fill2([P(-3.78, y - 1.3, zt - 2.6), P(-3.78, y + 1.3, zt - 2.6), P(-3.78, y + 1.3, zt - 0.5), P(-3.78, y - 1.3, zt - 0.5)], '#BCD0D6', true);
      g.fill2([P(-6.2, y - 1.6, zt), P(-3.8, y - 1.6, zt), P(-3.8, y + 1.6, zt), P(-6.2, y + 1.6, zt)], '#F3F1EA', true);
      g.outline2(front, { w: 0.45, boil: false }); g.outline2(side, { w: 0.45, boil: false });
      void fl;
    } });
  // picnics and sunbathers on the sloping lawns of the square
  [[-24, 12, 1370], [-28, 24, 1373], [2, 18, 1376], [10, 30, 1379]].forEach(([x, y, s]) => T.cast([x, y], function (g) {
    const z = hAt(x, y), q = [[x - 1.6, y - 1.2], [x + 1.6, y - 1.2], [x + 1.6, y + 1.2], [x - 1.6, y + 1.2]].map(([a, b]) => [a, b, hAt(a, b) + 0.05]);
    g.fill(q, ['#E9806A', '#5F8FC9', '#E6C24F', '#F3F1EA'][s % 4]); g.outline(q, { w: 0.35, c: '#6E5A44', boil: false });
    PA.person(g, x - 1.8, y - 0.4, hAt(x - 1.8, y - 0.4), PA.who(s, { dir: 0, pose: 'sit' })); PA.person(g, x + 0.4, y + 1.6, hAt(x + 0.4, y + 1.6), PA.who(s + 1, { dir: 3, pose: 'sit' }));
    if (s % 2) PA.person(g, x + 1.0, y - 0.2, z + 0.05, PA.who(s + 2, { dir: 0, lie: -2.5 }));
  }, { on: true }));
  // walkers: up and down the winding path, round the square, along the foot of the hill
  const pz = (x, y) => hAt(x, y);
  PA.walker(T, PA.who(1360), [[-2, -6], [6, -6.5], [14, -4], [22, 0], [30, 3]], 1.2, { z: pz, phase: 0.1 });
  PA.walker(T, PA.who(1361), [[30, 3.4], [22, 0.6], [14, -3.4], [6, -6], [-2, -5.4]], 1.1, { z: pz, phase: 0.5 });
  PA.walker(T, PA.who(1362), [[5, -25], [19, -25], [19, -13], [5, -13]], 1.0, { z: pz, phase: 0.3 });
  PA.walker(T, PA.who(1363), [[-36, 35], [-17, 35], [-1, 35], [34, 35]], 1.4, { z: pz, phase: 0.2 });
  PA.walker(T, PA.who(1364), [[-11, 33], [-11.6, 20], [-12.4, 6], [-12.4, 6]], 0.9, { z: (x, y) => Math.round(hAt(-12, y) / 0.42) * 0.42, phase: 0.6 });
  PA.streetSide(T, {});
});
