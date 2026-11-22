'use strict';
/* (-100,0) Santa Marta: a favela on its hillside, lived-in and full of colour.
   Built: the hill is one object with its own walls — a slope rising towards the far corner (h = 0.34 per u of x + y,
   capped at 24), cut by low retaining walls where it meets the streets. On it the houses stand in tight rows, each
   from the slope at its front corner up to a flat concrete laje: bare orange brick or painted pink, blue, yellow,
   green; small dark windows, a door, blue water tanks, rebar for the next floor, laundry lines. A straight corridor
   climbs the hill for the inclined funicular (plano inclinado) and its stairs. At the bottom: the little square with
   the funicular's lower station, the mototaxi rank, a boteco with plastic tables, a concrete football court, and the
   rainbow-painted houses of Praça Cantão; utility poles with tangled wires.
   Who: kids flying kites from the lajes (kites high over the roofs), a laje party round a grill, a woman hanging
   laundry, a grandmother on her step, mototaxi drivers in orange vests waiting, men at the boteco, kids playing
   football, people climbing the stairs, the funicular going up and down. */
SF.tile('santamarta', -100, 0, { rim: 18 }, function (T) {
  const hAt = (x, y) => clamp((16 - (x + y)) * 0.3, 0, 22);
  const TY = 1.0;                                          // the funicular corridor runs along x at y = 1
  /* ---------------- ground: the flat bottom ---------------- */
  T.ground(function (g) {
    K.slab(g, 37, { top: '#E3DDCE' });
    RJ.mosaic(g, -21, -21, 37, 37, { sp: 2.6, skip: (x, y) => x + y < 17 || (x > 12 && x < 30 && y > 9 && y < 19) });
  }, { rim: true });
  /* ---------------- the hill ---------------- */
  T.obj([-37, -37, 37, 37], function (g) {
    g.boilP = 0.15;
    const cap = 16 - 22 / 0.3;
    const top = [[-37, -37, 22], [cap + 37, -37, 22], [37, -37, hAt(37, -37)], [37, -21, 0], [-21, 37, 0], [-37, 37, hAt(-37, 37)], [-37, cap + 37, 22]];
    g.fill(top, '#C9B79B');
    g.scuff(top, { dir: -0.5, len: 2, c: '#B5A386', dens: 0.4, w: 0.5, spread: 1.2 });
    const wl = [[-37, 37, 0], [-21, 37, 0], [-37, 37, hAt(-37, 37)]], wr = [[37, -37, 0], [37, -21, 0], [37, -37, hAt(37, -37)]];
    g.fill(wl, '#BDB3A0'); g.fill(wr, '#A69C88'); g.outline(wl, { w: 0.7, boil: false }); g.outline(wr, { w: 0.7, boil: false });
    g.line([[37, -21, 0], [-21, 37, 0]], { w: 0.6, c: '#8C8576', boil: false });
    // green scrub where nothing is built, at the top
    const R = RNG(3301); for (let i = 0; i < 30; i++) { const x = lerp(-37, 10, R()), y = lerp(-37, -22, R()); if (x + y > -30) continue; const p = g.p(x, y, hAt(x, y)), r = 2 + R() * 2; g.fill2(arcPts(p[0], p[1], r, 0, TAU, 7).map((q) => [q[0], p[1] + (q[1] - p[1]) * 0.7]), R() < 0.5 ? '#6E9C52' : '#5E8F4E'); }
    // the funicular corridor: concrete stairs beside the rails
    const st = []; for (let x = 16; x > -37; x -= 1.1) { const a = g.p(x, TY + 1.6, hAt(x, TY + 1.6)), b = g.p(x, TY + 3.2, hAt(x, TY + 3.2)); st.push(a[0], a[1], b[0], b[1]); }
    g.fill([[16, TY - 1.2, hAt(16, TY - 1.2)], [-37, TY - 1.2, hAt(-37, TY - 1.2)], [-37, TY + 3.4, hAt(-37, TY + 3.4)], [16, TY + 3.4, 0]], '#D9D3C6');
    g.segs2(st, '#A9A296', 0.35);
    for (const dy of [-0.6, 0.6]) g.line([[17, TY + dy, 0.1], [-37, TY + dy, hAt(-37, TY + dy) + 0.1]], { w: 0.45, c: '#4A4540', boil: false });
    // steps in the alleys (becos): little risers on the slope
    st.length = 0;
    const run = (xa, ya, xb, yb, w, ax) => { const L = Math.hypot(xb - xa, yb - ya), n = Math.floor(L / 0.9); for (let k = 0; k < n; k++) { const x = lerp(xa, xb, k / n), y = lerp(ya, yb, k / n), a = ax === 'x' ? g.p(x - w, y, hAt(x - w, y) + 0.05) : g.p(x, y - w, hAt(x, y - w) + 0.05), b = ax === 'x' ? g.p(x + w, y, hAt(x + w, y) + 0.05) : g.p(x, y + w, hAt(x, y + w) + 0.05); st.push(a[0], a[1], b[0], b[1]); } };
    run(-10.6, 3, -10.6, -36, 1.8, 'x'); run(-36, 18.4, -2, 18.4, 1.8, 'y'); run(-22.2, 15, -22.2, 3, 1.8, 'x');
    g.segs2(st, '#9C9486', 0.35);
  }, { name: 'morro' });

  /* ---------------- the houses: a tight mass on a 5 u grid, sharing walls ---------------- */
  // alleys (becos) with steps thread through: the funicular corridor (row j = 7), a stair up column i = 5 below it,
  // a stair along row j = 10 and up column i = 2 above it
  const R = RNG(3310), lots = [];
  const alley = (i, j) => j === 6 || (i === 4 && j < 6) || (j === 9 && i < 5) || (i === 2 && j > 6 && j < 9);
  for (let i = 0; i < 13; i++) for (let j = 0; j < 13; j++) {
    const cx = -33.8 + i * 5.8, cy = -33.8 + j * 5.8;
    if (cx + cy > 11 || alley(i, j)) continue;
    if (cx + cy < -56 && R() < 0.55) continue;                    // the very top thins out into scrub
    lots.push([cx, cy, i, j]);
  }
  const CANTAO = new Set(['8,4', '5,7', '4,8', '9,3', '7,5']);           // the rainbow houses near the bottom
  lots.forEach(([cx, cy, i, j], n) => {
    const x0 = cx - 2.9, x1 = cx + 2.9, y0 = cy - 2.9, y1 = cy + 2.9;
    const r = R(), st = r < 0.25 ? 1 : r < 0.62 ? 2 : r < 0.88 ? 3 : 4;
    const z0 = Math.max(0, hAt(x1, y1) - 0.3), z1 = hAt(x0, y0) + st * 2.7;
    const key = i + ',' + j, rainbow = CANTAO.has(key), pux = !rainbow && R() < 0.4, half = R() < 0.5;
    T.obj([x0, y0, x1, y1], function (g) {
      g.boilP = 0.15;
      RJ.house(g, x0, y0, x1, y1, z0, z1, 3320 + n, rainbow ? { brick: false, col: '#F3EFE4', tank: false, unlit: true } : { tank: !pux });
      if (rainbow) {   // Praça Cantão: every storey band a colour of the rainbow
        const cols = ['#D9463B', '#EE8A2E', '#F2C230', '#3A9A5B', '#2F6DB5', '#9B7FC9'], iC = g.cmds.length;
        for (let k = 0; k < 6; k++) { const za = z0 + (z1 - z0) * k / 6, zb = z0 + (z1 - z0) * (k + 1) / 6; g.fill(K.on('L', y1 + 0.02, x0, x1, za, zb), cols[k]); g.fill(K.on('R', x1 + 0.02, y0, y1, za, zb), shade(cols[k], 0.12)); }
        g.fill(K.on('L', y1 + 0.04, cx - 0.5, cx + 0.5, z0, z0 + 2.4), '#3A3530'); g.mark({ win: 0.5 });
        RJ.lit(g, iC, 0.42); RJ.wallLamp(g, 'L', y1, cx + 1.4, z0 + 2.8, 1.1, z0);   // (night: the painted fronts under their lamps)
      }
      // a puxadinho: an unfinished brick room on the back half of the laje, rebar sticking out, the tank on top
      if (pux) {
        const ax1 = half ? x0 + 3.2 : x1, ay1 = half ? y1 : y0 + 3.2;
        RJ.house(g, x0, y0, ax1, ay1, z1, z1 + 2.6, 3800 + n, { brick: true, tank: true, laundry: false, bulb: false });
      }
    }, { name: 'casa', on: true });
    lots[n].push(pux ? z1 : z1, pux, half);
  });
  const lotAt = (i, j) => lots.find((l) => l[2] === i && l[3] === j);
  // life on the lajes: kids with kites, a churrasco, laundry, an old man in his chair, a woman watering plants
  const KITES = [];
  const LIFE = [[2, 3, 3401, 'kite'], [5, 1, 3402, 'kite'], [1, 7, 3403, 'kite'], [8, 2, 3407, 'kite'], [3, 5, 3408, 'kite'], [3, 2, 3404, 'party'], [7, 1, 3405, 'laundry'], [3, 10, 3406, 'sit'], [6, 3, 3409, 'party'], [9, 0, 3410, 'laundry'], [5, 7, 3411, 'sit'], [0, 10, 3412, 'plants'], [10, 0, 3413, 'sit'], [1, 4, 3414, 'laundry']];
  for (const [i, j, s, kind] of LIFE) {
    const L = lotAt(i, j); if (!L) continue;
    const [cx, cy, , , z1, pux, half] = L, px = pux ? (half ? cx + 1.4 : cx) : cx, py = pux ? (half ? cy : cy + 1.4) : cy;
    if (kind === 'kite') KITES.push([px, py, z1, s]);
    T.cast([px + 0.4, py + 0.4], (g) => {
      if (kind === 'party') { const gr = g.p(px - 1.0, py - 1.0, z1); g.fill2([[gr[0] - 1.8, gr[1] - 3], [gr[0] + 1.8, gr[1] - 3], [gr[0] + 1.6, gr[1] - 2.2], [gr[0] - 1.6, gr[1] - 2.2]], '#3A3530', true); g.mark({ nc: '#E0582E' }); g.glow2('lantern', [gr[0], gr[1] - 3.2], gr, { r: 1.6, col: '#FF7A3A' }); /* (night: the grill's embers) */ g.segs2([gr[0] - 1.2, gr[1], gr[0] - 1.2, gr[1] - 2.4, gr[0] + 1.2, gr[1], gr[0] + 1.2, gr[1] - 2.4], '#3A3530', 0.4); for (let k = 0; k < 3; k++) g.disc2([gr[0] - 1 + k, gr[1] - 5 - k * 1.5], 1.2 + k * 0.4, 'rgba(240,238,232,0.7)'); for (const [dx, dy, d, k] of [[0.8, 0.4, 1, 0], [-1.0, 1.4, 0, 1], [1.4, -1.0, 1, 2]]) RJ.person(g, px + dx, py + dy, z1, Object.assign(RJ.who(s + k * 7), { dir: d, pose: k === 1 ? 'cheer' : 'hold', cup: k === 1 ? undefined : '#F2C230', ph: 0.3, k: 0.9 })); }
      else if (kind === 'laundry') { const a = g.p(px - 2.2, py + 1.6, z1 + 2.2), b = g.p(px + 2.2, py + 1.6, z1 + 2.2); g.fine2([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 1], b], { w: 0.2, c: '#5A564E' }); for (let k = 1; k < 5; k++) { const t = k / 5, c = [lerp(a[0], b[0], t), lerp(a[1], b[1], t) + 0.9]; g.fill2([[c[0] - 1, c[1]], [c[0] + 1, c[1]], [c[0] + 0.9, c[1] + 2.6], [c[0] - 0.9, c[1] + 2.6]], ['#F3F1EA', '#E86A9A', '#2F6DB5', '#F2C230', '#3A9A5B'][(k + s) % 5], true); } RJ.person(g, px + 1.2, py + 0.4, z1, Object.assign(RJ.who(s, { carnaval: false }), { dir: 1, pose: 'wave', ph: 0.6, k: 0.9 })); }
      else if (kind === 'sit') { RJ.chair2(g, g.p(px + 0.5, py + 1.6, z1), '#D9463B', 'L'); RJ.person(g, px + 0.5, py + 1.6, z1 + 1.2, Object.assign(RJ.who(s, { carnaval: false }), { dir: 1, pose: 'sit', hair: '#C9C6BD', k: 0.9 })); }
      else if (kind === 'plants') { for (let k = 0; k < 4; k++) { const p = g.p(px - 1.6 + k * 1.1, py + 2.0, z1); g.fill2([[p[0] - 0.8, p[1]], [p[0] + 0.8, p[1]], [p[0] + 0.6, p[1] - 1.4], [p[0] - 0.6, p[1] - 1.4]], '#C46A47', true); g.disc2([p[0], p[1] - 2.4], 1.3, '#5E8F4E'); } RJ.person(g, px + 1.2, py, z1, Object.assign(RJ.who(s, { carnaval: false }), { dir: 1, pose: 'hold', dress: '#9B7FC9', fem: true, k: 0.9 })); }
      else RJ.person(g, px, py + 0.6, z1, Object.assign(RJ.who(s), { dir: 3, pose: 'wave', ph: 0.75, k: 0.8 }));
    }, { on: true });
  }
  // the kites: diamonds with tails, bobbing high over the roofs, a string down to each kid's raised hand
  KITES.forEach(([cx, cy, cz, s], i) => {
    const kx = cx - 5 - i * 2, ky = cy - 8 + i * 2, kz = cz + 13 + (i % 2) * 4, col = ['#D9463B', '#F2C230', '#2F6DB5', '#E86A9A'][i % 4];
    T.actor({ sample: 5, period: 6, layer: 'top', grow: false,
      at(t) { const q = Math.floor(((t / 3 + i * 0.37) % 1) * 6), b = Math.sin(q / 6 * TAU); return { x: kx, y: ky, z: kz + b * 1.2, key: q, q, b }; },
      draw(g, st) {
        const c = g.p(0, 0, 0), hand = g.p(cx - kx + 0.4, cy - ky + 0.6, cz - (kz + st.b * 1.2) + 6.6);
        g.fine2([[c[0], c[1] + 2.6], [lerp(c[0], hand[0], 0.5) + 3, lerp(c[1], hand[1], 0.5) + 5], hand], { w: 0.25, c: '#5A564E' });
        const sw = Math.sin(st.q / 6 * TAU) * 0.5, d = [[c[0], c[1] - 4.4], [c[0] + 3.3 + sw, c[1] - 0.6], [c[0], c[1] + 3.6], [c[0] - 3.3 + sw, c[1] - 0.6]];
        g.fill2(d, col, true); g.fill2([d[0], d[1], [c[0], c[1] - 0.4]], shade(col, -0.25), true); g.line2(d.concat([d[0]]), { w: 0.35, c: shade(col, 0.5), boil: false });
        const tl = []; for (let k = 0; k <= 5; k++) tl.push([c[0] + Math.sin(k * 1.2 + st.q) * 1.2, c[1] + 2.6 + k * 1.6]); g.fine2(tl, { w: 0.3, c: '#5A564E' });
        for (let k = 1; k < 5; k += 2) g.fill2([[tl[k][0] - 0.7, tl[k][1] - 0.3], [tl[k][0] + 0.7, tl[k][1] - 0.3], [tl[k][0], tl[k][1] + 0.5]], k % 4 === 1 ? '#F6F3EA' : col, true);
      } });
  });

  /* ---------------- the funicular: a cabin climbing the rails ---------------- */
  const FX0 = 14, FX1 = -33, FP = 36;
  T.actor({ sample: 0.3, period: FP, grow: false,
    at(t) { const u = ((t / FP) % 1 + 1) % 1, f = u < 0.15 ? 0 : u < 0.5 ? smooth((u - 0.15) / 0.35) : u < 0.65 ? 1 : 1 - smooth((u - 0.65) / 0.35), x = lerp(FX0, FX1, f); return { x: x + 1.6, y: TY + 1.2, z: hAt(x, TY), key: 'c' }; },
    draw(g) {
      const B = K.rbox(g, -1.6, -1.2, 1.6, 1.1, Math.PI, 0.3, 3.4, { t: '#E9E6DC', l: '#E9E6DC', r: '#C9C6BC' }, { w: 0.6 });
      for (const f of ['pv', 'nv']) if (B.vis[f]) { g.lit({ nc: '#FFE3A6' }, () => { K.rwin(g, B, f, -0.85, -0.05, 1.4, 2.9); K.rwin(g, B, f, 0.05, 0.85, 1.4, 2.9); }); g.fill(B.quad(f, -1, 1, 0.3, 0.9), '#D9463B'); }
      for (const f of ['pu', 'nu']) if (B.vis[f]) g.lit({ nc: '#FFE3A6' }, () => K.rwin(g, B, f, -0.7, 0.7, 1.4, 2.9));   // (night: the cabin lit)
    } });
  T.obj([12, -3, 19, 4], function (g) {
    K.box(g, 15, -3, 19, 4, 0, 4.4, '#F3EFE4', { w: 0.7 });
    K.box(g, 14.6, -3.4, 19.4, 4.4, 4.4, 5.0, '#3A9A5B', { w: 0.5 });
    K.text(g, 'L', 4.42, 17, 4.5, 0.42, 'PLANO INCLINADO', '#F6F3EA', { center: true, w: 0.34 });
    RJ.nightEach(g, 0, (c, d) => (d.k !== K_FILL ? (c === '#F6F3EA' ? '#FFF6DC' : undefined) : c === '#F3EFE4' ? RJ.litCol(c, 0.4) : RJ.litCol(c, 0.65)));   // (night: the station lit)
    RJ.wallLamp(g, 'L', 4, 16.2, 3.6, 1.2); RJ.wallLamp(g, 'R', 19, 0, 3.6, 1.0);
  }, { name: 'estação' });
  // people climbing the stairs beside the rails
  const zf = (x, y) => hAt(x, y);
  RJ.walker(T, RJ.who(3420, { carnaval: false }), [[16, TY + 2.4], [-30, TY + 2.4]], 0.8, { phase: 0.2, z: zf });
  RJ.walker(T, RJ.who(3421), [[-30, TY + 2.9], [16, TY + 2.9]], 0.9, { phase: 0.6, z: zf });

  /* ---------------- the bottom: court, mototaxis, boteco, poles ---------------- */
  T.ground(function (g) {
    const c = K.rect(13, 10, 29, 18.5); g.fill(c, '#9FB3A8'); g.outline(c, { w: 0.5, c: '#F6F3EA', boil: false });
    g.line([[21, 10, 0], [21, 18.5, 0]], { w: 0.45, c: '#F6F3EA', boil: false });
    const cc = []; for (let k = 0; k <= 12; k++) { const a = TAU * k / 12; cc.push([21 + Math.cos(a) * 1.8, 14.25 + Math.sin(a) * 1.8, 0]); } g.line(cc, { w: 0.4, c: '#F6F3EA', boil: false });
  });
  for (const x of [13.3, 28.7]) T.obj([x, 14.25], (g) => { const a = g.p(x, 12.6, 0), b = g.p(x, 15.9, 0), a2 = g.p(x, 12.6, 2.6), b2 = g.p(x, 15.9, 2.6); g.segs2([a[0], a[1], a2[0], a2[1], b[0], b[1], b2[0], b2[1], a2[0], a2[1], b2[0], b2[1]], '#F6F3EA', 0.7); }, { name: 'gol' });
  const BALL = (t) => { const u = (t / 6) % 1, a = u * TAU; return [21 + Math.cos(a) * 5 + Math.sin(a * 3) * 1.5, 14.25 + Math.sin(a * 2) * 2.6]; };
  for (let k = 0; k < 6; k++) { const look = RJ.who(3430 + k, { carnaval: false, set: { k: 0.78, top: k % 2 ? '#F2C230' : '#2F6DB5', shorts: true } });
    T.actor({ sample: 0.3, period: 6,
      at(t) { const b = BALL(t - 0.3 - k * 0.15), hx = 14.5 + (k % 3) * 6 + (k > 2 ? 1 : 0), hy = 11.5 + (k > 2 ? 5 : 0), x = lerp(hx, b[0], 0.45), y = lerp(hy, b[1], 0.45), b2 = BALL(t - 0.2 - k * 0.15), dx = b2[0] - x, dy = b2[1] - y, d = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor((t * 3 + k) % 1 * 8); return { x, y, key: d + '.' + ph, dir: d, ph: ph / 8 }; },
      draw(g, st) { RJ.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: 'walk', ph: st.ph })); } }); }
  T.actor({ sample: 0.2, period: 6, at(t) { const b = BALL(t), z = Math.abs(Math.sin(t * 4)) * 1.2; return { x: b[0], y: b[1], z, key: 'b' }; }, draw(g) { const c = g.p(0, 0, 0.5); g.disc2(c, 0.9, '#F6F3EA'); g.ring2(c, 0.9, { w: 0.3, c: '#3A3530' }); g.disc2([c[0] + 0.2, c[1] - 0.1], 0.35, '#2A2622'); } });
  // the mototaxi rank: three bikes, drivers in orange vests, a passenger arriving
  for (let k = 0; k < 3; k++) { const x = 31 + k * 0.4, y = -2 + k * 3.4; T.cast([x, y], (g) => g.at(x, y, 0, (g2) => RJ.moto(g2, Math.PI * 0.75, RJ.who(3440 + k, { carnaval: false }), { vest: '#EE8A2E', col: ['#C9392E', '#2A2622', '#2F6DB5'][k] })), {}); }
  T.obj([30.6, 7.5, 33.4, 9.5], (g) => { K.box(g, 30.6, 7.5, 33.4, 9.5, 0, 2.6, '#EE8A2E', { w: 0.5 }); K.text(g, 'L', 9.52, 32, 1.2, 0.5, 'MOTOTÁXI', '#F6F3EA', { center: true, w: 0.36 }); RJ.nightEach(g, 0, (c, d) => (d.k === K_FILL ? RJ.litCol(c, 0.8) : c === '#F6F3EA' ? '#FFF6DC' : undefined)); g.glow('neon', 32, 9.8, 1.5, { r: 5, col: '#FFB070' }); }, { name: 'ponto' });
  // the boteco: a little bar with a counter to the street, yellow plastic tables and chairs outside
  T.obj([2, 29, 11, 36], function (g) {
    K.box(g, 2, 29, 11, 36, 0, 4.4, '#F3E3B8', { w: 0.8 });
    g.fill(K.on('L', 36.02, 3, 10, 0.2, 3.2), '#3A3530'); g.mark({ win: 1, nc: '#FBC76E', spill: true }); g.fill(K.on('L', 36.05, 3, 10, 1.2, 1.6), '#B07A44');   // (night: the bar open, lit inside)
    RJ.litSign(g, 'L', 36.04, 3.4, 9.6, 3.4, 4.3, '#D9463B', 'BAR DO ZÉ');
    for (const a of [2.6, 10.4]) RJ.wallLamp(g, 'L', 36, a, 3.9, 1.1);
    K.box(g, 1.6, 28.6, 11.4, 36.4, 4.4, 4.9, '#E2D0A0', { w: 0.6 });
    K.cyl(g, 4, 31, 0.85, 4.9, 6.1, { t: '#5E9AD6', l: '#3E7FC1', r: '#2F6AA6' }, { w: 0.45, n: 10 });
  }, { name: 'boteco' });
  for (const [x, y, s] of [[-2, 31, 3450], [-6, 27, 3453], [-2, 24, 3456]]) T.cast([x, y], (g) => {
    const f = g.p(x, y, 0); g.fill2([[f[0] - 3, f[1] - 4.4], [f[0] + 3, f[1] - 4.4], [f[0] + 2.6, f[1] - 3.6], [f[0] - 2.6, f[1] - 3.6]], '#F2C230', true); g.segs2([f[0] - 2, f[1], f[0] - 2, f[1] - 4, f[0] + 2, f[1], f[0] + 2, f[1] - 4], '#D9A82A', 0.5);
    g.fill2([[f[0] - 0.5, f[1] - 4.4], [f[0] + 0.5, f[1] - 4.4], [f[0] + 0.5, f[1] - 7.4], [f[0] - 0.5, f[1] - 7.4]], '#8A5A2A', true);
    RJ.person(g, x - 1.4, y + 0.4, 1.3, Object.assign(RJ.who(s, { carnaval: false }), { dir: 0, pose: 'sit', cup: '#F2C230' }));
    RJ.person(g, x + 1.4, y - 0.4, 1.3, Object.assign(RJ.who(s + 1), { dir: 1, pose: 'sit' }));
  }, {});
  // a grandmother on her doorstep, kids running up the alley, a dog
  T.cast([-14, 30.5], (g) => RJ.person(g, -14, 30.5, 0.4, Object.assign(RJ.who(3460, { carnaval: false }), { dir: 1, pose: 'sit', hair: '#D9D6CE', dress: '#9B7FC9', fem: true, hairStyle: 'bun' })), {});
  RJ.walker(T, RJ.who(3461, { carnaval: false, set: { k: 0.75 } }), [[-12, 34], [6, 22], [20, 6], [6, 22]], 1.8, { phase: 0.3 });
  T.actor({ sample: 0.3, period: 14, at(t) { const u = (t / 14) % 1, f = u < 0.5 ? u * 2 : 2 - u * 2, x = lerp(-10, 26, f), y = lerp(33, 22, f); return { x, y, key: u < 0.5 ? 0 : 1, d: u < 0.5 }; },
    draw(g, st) { const c = g.p(0, 0, 0), d = st.d ? 1 : -1; g.fill2([[c[0] - 2.2 * d, c[1] - 2.2], [c[0] + 1.6 * d, c[1] - 2.4], [c[0] + 1.6 * d, c[1] - 1.2], [c[0] - 2.2 * d, c[1] - 1.0]], '#B07A44', true); g.fill2([[c[0] + 1.4 * d, c[1] - 3.6], [c[0] + 2.8 * d, c[1] - 3.2], [c[0] + 2.6 * d, c[1] - 2.0], [c[0] + 1.4 * d, c[1] - 2.2]], '#B07A44', true); g.segs2([c[0] - 1.8 * d, c[1] - 1, c[0] - 1.8 * d, c[1], c[0] + 1.2 * d, c[1] - 1, c[0] + 1.2 * d, c[1], c[0] - 2.2 * d, c[1] - 2, c[0] - 3 * d, c[1] - 3.2], '#7A5230', 0.5); } });
  // utility poles with their tangle of wires along the bottom
  const POLES = [[-18, 32], [0, 16], [20, -4]];
  POLES.forEach(([x, y], k) => T.obj([x, y], (g) => {
    const f = g.p(x, y, 0), t = g.p(x, y, 12); g.fill2([[f[0] - 0.7, f[1]], [f[0] + 0.7, f[1]], [t[0] + 0.45, t[1]], [t[0] - 0.45, t[1]]], '#B9B6AD'); g.line2([[f[0] - 0.7, f[1]], [t[0] - 0.45, t[1]]], { w: 0.45, c: '#5A564E', boil: false });
    if (k + 1 < POLES.length) { const [x2, y2] = POLES[k + 1]; for (let w = 0; w < 6; w++) { const a = [x, y, 11.5 - w * 0.35], b = [x2, y2, 11.5 - w * 0.3], pts = []; for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u) - (1.6 + w * 0.4) * 4 * u * (1 - u)]); } g.fine(pts, { w: 0.25, c: '#3A3530' }); } }
    g.fill2([[t[0] - 1.6, t[1] + 2], [t[0] + 1.6, t[1] + 2], [t[0] + 1.6, t[1] + 4.6], [t[0] - 1.6, t[1] + 4.6]], '#8E9196', true);
    g.glow2('lamp', [t[0] + 1.2, t[1] + 6.4], f, { r: 1.8 });      // (night: the street light every pole carries)
  }, { name: 'poste' }));
});
