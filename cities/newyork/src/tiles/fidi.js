'use strict';
/* (-100,-100) The Financial District, at the far top of the map.
   One World Trade Center stands at the far corner: a glass podium, then a shaft whose square base is chamfered into
   eight long triangles, so it turns into a square set at 45 degrees at the roof; a white spire with rings above.
   Along the far side, facing us across the plaza: the Stock Exchange (a temple front of six Corinthian columns between
   two piers, a pediment, the giant flag hung across the columns, the taller annex behind) and Federal Hall (a Doric
   temple of eight columns on a high flight of steps, George Washington on his plinth at the foot).
   The middle band is the granite Wall Street plaza, closed to cars by black security bollards: the Charging Bull on its
   plinth with tourists queueing to pose at the horns and a friend taking the photo, pigeons, a hot-dog cart, an NYPD
   officer, suits with coffee walking through. The near half is low so the plaza stays in view: a memorial pool sunk in
   the paving, water falling down its inner walls into the square void, visitors at the bronze parapet among swamp white
   oaks; and the Oculus, the white ribbed station hall spreading its wings, commuters walking in.
   What moves: the falling water, the flag on Federal Hall, walkers, pigeons, the pool visitors' children. */
/* a flag waving from a pole top at (x, y, z) (the kit's NK.flagActor puts its z in twice, so this tile keeps its own) */
function fidiFlag(T, x, y, z, o) {
  o = o || {}; const w = o.w || 5, h = o.h || 3.2, NPH = 8;
  return T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const ph = Math.floor(((t * 0.9) % 1) * NPH); return { x, y, z: 0, key: ph, ph: ph / NPH }; },
    draw(g, st) {
      const P = (u, v) => { const wav = Math.sin(u / w * 5 - st.ph * TAU) * 0.5 * (u / w); return g.p(wav, u, z - v); };
      const n = 7, sw = h / n;
      for (let i = 0; i < n; i++) { const pts = []; for (let k = 0; k <= 6; k++) pts.push(P(w * k / 6, i * sw)); for (let k = 6; k >= 0; k--) pts.push(P(w * k / 6, (i + 1) * sw)); g.fill2(pts, i % 2 ? '#F6F2E8' : '#C9463E', true); }
      const cn = []; for (let k = 0; k <= 3; k++) cn.push(P(w * 0.42 * k / 3, 0)); for (let k = 3; k >= 0; k--) cn.push(P(w * 0.42 * k / 3, sw * 4)); g.fill2(cn, '#2F4A7A', true);
    } });
}
SF.tile('fidi', -100, -100, { rim: 6 }, function (T) {
  const GRAN = '#E4DED2', BRONZE = '#8A6A44', MARBLE = { t: '#EDE9DF', l: '#F4F1EA', r: '#DDD8CC' };

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    NK.lot(g, { inner: GRAN });
    // the plaza: granite setts in a band along x, a cobble lane down its middle
    g.scuff(K.rect(-31, -13, 31, 10), { dir: Math.atan2(AY, AX), len: 2.4, c: '#D3CCBD', dens: 0.9, w: 0.45, spread: 0.06 });
    g.fill(K.rect(-31, -5.5, 31, -2.5), '#D6CEBF'); g.scuff(K.rect(-31, -5.5, 31, -2.5), { dir: 0.3, len: 0.9, c: '#BFB6A4', dens: 1.6, w: 0.5, spread: 1.2 });
    // the WTC plaza round the tower and the pool: paler stone with long joints
    g.fill(K.rect(-31, 11, -5, 31), '#E9E5DC');
    const j = []; for (let x = -30; x < -5; x += 2.4) { const a = g.p(x, 11, 0), b = g.p(x, 31, 0); j.push(a[0], a[1], b[0], b[1]); } g.segs2(j, '#D8D2C5', 0.3);
    // a lawn strip under the oaks and a planted bed at the Oculus
    for (const r of [K.rect(-31, 11, -28.5, 31), K.rect(-8, 11, -5, 31)]) { g.fill(r, C.grass); g.grass(r, { dens: 0.8 }); }
  }, { rim: true });

  /* ---------------- One World Trade Center ---------------- */
  T.obj([-31, -31, -17, -17], function (g) {
    g.boilP = 0.2;
    const cx = -24, cy = -24, h = 7, Z0 = 9, Z1 = 52, ins = 0.86;
    // the podium: dark lower band, then glass fins
    K.box(g, cx - h, cy - h, cx + h, cy + h, 0, 2.6, { t: '#C9CDD0', l: '#7E8A94', r: '#6A7680' }, { w: 0.9 });
    K.box(g, cx - h, cy - h, cx + h, cy + h, 2.6, Z0, { t: '#D9E2E8', l: '#C7D3DB', r: '#A9B9C4' }, { w: 0.9 });
    const fins = []; for (const [f, p, a0, a1] of [['L', cy + h, cx - h, cx + h], ['R', cx + h, cy - h, cy + h]]) for (let a = a0 + 0.8; a < a1; a += 0.8) { const q0 = g.p.apply(g, K.pt(f, p + 0.02, a, 2.7)), q1 = g.p.apply(g, K.pt(f, p + 0.02, a, Z0 - 0.1)); fins.push(q0[0], q0[1], q1[0], q1[1]); }
    g.segs2(fins, '#8FA5B4', 0.3);
    // the chamfered shaft: base square corners B, top square T at the edge midpoints (pulled in a little)
    const B = [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
    const Tp = [[cx, cy - h * ins], [cx + h * ins, cy], [cx, cy + h * ins], [cx - h * ins, cy]];
    const facets = [];
    for (let i = 0; i < 4; i++) {
      const b0 = B[i], b1 = B[(i + 1) % 4], t0 = Tp[i], t1 = Tp[(i + 1) % 4];
      facets.push([[b0[0], b0[1], Z0], [b1[0], b1[1], Z0], [t0[0], t0[1], Z1]]);         // pointing up, on a base edge
      facets.push([[b1[0], b1[1], Z0], [t1[0], t1[1], Z1], [t0[0], t0[1], Z1]]);         // pointing down, from a base corner
    }
    const nrm = (q) => { const ux = q[1][0] - q[0][0], uy = q[1][1] - q[0][1], uz = q[1][2] - q[0][2], vx = q[2][0] - q[0][0], vy = q[2][1] - q[0][1], vz = q[2][2] - q[0][2]; return [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx]; };
    const vis = facets.map((q) => { const n = nrm(q), l = Math.hypot(n[0], n[1], n[2]) || 1; return { q, nx: n[0] / l, ny: n[1] / l, d: (q[0][0] + q[1][0] + q[2][0] + q[0][1] + q[1][1] + q[2][1]) }; }).filter((f) => f.nx + f.ny > 0.01).sort((a, b) => a.d - b.d);
    for (const f of vis) {
      const t = clamp(0.5 + 0.55 * (f.nx - f.ny), 0, 1);
      g.fill(f.q, mix('#CFE0EA', '#9FB6C6', t));
      // floor lines across the facet
      const fl = []; for (let z = Z0 + 3; z < Z1 - 1; z += 3.2) { const pts = []; for (let k = 0; k < 3; k++) { const a = f.q[k], b = f.q[(k + 1) % 3]; if ((a[2] - z) * (b[2] - z) < 0) { const u = (z - a[2]) / (b[2] - a[2]); pts.push(g.p(lerp(a[0], b[0], u), lerp(a[1], b[1], u), z)); } } if (pts.length === 2) fl.push(pts[0][0], pts[0][1], pts[1][0], pts[1][1]); }
      g.segs2(fl, mix('#B5C8D4', '#8AA2B3', t), 0.28);
      g.outline(f.q, { w: 0.75, c: '#4E5F6E', boil: false });
    }
    // a glint down the lit facet
    const gl0 = g.p(cx - h * 0.4, cy + h * 0.8, Z0 + 4), gl1 = g.p(cx - h * 0.1, cy + h * 0.6, Z1 - 8); g.line2([gl0, gl1], { w: 0.9, c: '#F4F8FA', boil: false, ext: 0 });
    // parapet ring and the spire
    const top = Tp.map((p) => [p[0], p[1], Z1]), topU = Tp.map((p) => [p[0], p[1], Z1 + 1.2]);
    g.fill(topU, '#E3E8EA'); for (let i = 0; i < 4; i++) { const a = top[i], b = top[(i + 1) % 4]; if ((b[1] - a[1]) - (b[0] - a[0]) > -0.01 || true) { const q = [a, b, topU[(i + 1) % 4], topU[i]]; const n = nrm(q); if (n[0] + n[1] > 0) g.fill(q, '#C9D3D9'); } }
    g.outline(topU, { w: 0.6, c: '#4E5F6E', boil: false });
    K.cyl(g, cx, cy, 1.5, Z1 + 1.2, Z1 + 3.2, { t: '#E9ECEC', l: '#DCE1E3', r: '#BFC7CB' }, { w: 0.6, n: 10 });
    const s0 = g.p(cx, cy, Z1 + 3.2), s1 = g.p(cx, cy, Z1 + 17);
    g.fill2([[s0[0] - 1.1, s0[1]], [s0[0] + 1.1, s0[1]], [s1[0] + 0.3, s1[1]], [s1[0] - 0.3, s1[1]]], '#EDEFEF');
    g.line2([[s0[0] - 1.1, s0[1]], [s1[0] - 0.3, s1[1]]], { w: 0.5, c: '#6E7E8C', boil: false }); g.line2([[s0[0] + 1.1, s0[1]], [s1[0] + 0.3, s1[1]]], { w: 0.5, c: '#6E7E8C', boil: false });
    for (let k = 1; k < 6; k++) { const p = g.p(cx, cy, Z1 + 3.2 + k * 2.2), w = 1.1 - k * 0.14; g.segs2([p[0] - w - 0.5, p[1], p[0] + w + 0.5, p[1]], '#8E9AA3', 0.35); }
    g.disc2([s1[0], s1[1] - 0.5], 0.45, '#E0503E');
    // the lobby glass at the foot
    K.win(g, 'L', cy + h, cx - h + 1.5, cx + h - 1.5, 0.3, 2.3, { style: 'glass', w: 0.4 });
  }, { name: 'one wtc' });

  /* ---------------- temples: the Stock Exchange and Federal Hall ---------------- */
  // a row of columns in front of the L face at y = yf, with capitals; drawn left to right (far to near)
  const colonnade = (g, xs, yf, z0, z1, r, col, corinth) => {
    for (const x of xs) {
      K.cyl(g, x, yf + r + 0.2, r, z0, z1, col, { w: 0.55, n: 10, nt: true });
      const fl = []; for (const dx of [-0.35, 0.05, 0.4]) { const a = g.p(x + dx * r, yf + r + 0.2 + r * 0.9, z0 + 0.4), b = g.p(x + dx * r, yf + r + 0.2 + r * 0.9, z1 - 0.4); fl.push(a[0], a[1], b[0], b[1]); } g.segs2(fl, shade(col.l, 0.22), 0.25);
      K.box(g, x - r - 0.25, yf, x + r + 0.25, yf + 2 * r + 0.65, z1 - (corinth ? 0.9 : 0.5), z1, col, { w: 0.45, boil: false });
      if (corinth) { const c = g.p(x, yf + 2 * r + 0.66, z1 - 0.5); g.fill2([[c[0] - 1.6, c[1] - 1.2], [c[0] - 0.6, c[1] + 0.6], [c[0] + 0.6, c[1] + 0.6], [c[0] + 1.6, c[1] - 1.2]], '#E3DCCB', true); }
    }
  };
  const pediment = (g, x0, x1, yf, d, z, h, col) => {
    const m = (x0 + x1) / 2, F = [[x0, yf + d, z], [x1, yf + d, z], [m, yf + d, z + h]];
    g.fill([[m, yf, z + h], [x1, yf, z], [x1, yf + d, z], [m, yf + d, z + h]], shade(col.t, 0.1));
    g.fill(F, col.l); g.outline(F, { w: 0.75 });
    const inner = [[x0 + 1.4, yf + d + 0.03, z + 0.4], [x1 - 1.4, yf + d + 0.03, z + 0.4], [m, yf + d + 0.03, z + h - 0.6]]; g.outline(inner, { w: 0.35, c: shade(col.l, 0.3), boil: false });
  };
  // the Stock Exchange
  T.obj([-13, -30, 9, -14], function (g) {
    g.boilP = 0.3;
    K.box(g, -12, -30, 8, -22, 0, 22, { t: '#E3DED2', l: '#E9E4D8', r: '#D3CDBF' }, { w: 0.85 });       // the annex behind
    NK.windows(g, 'R', 8, -29.5, -22.5, 4, 3, 6, 2, { style: 'navy' }); NK.windows(g, 'L', -22, -11.5, 7.5, 17, 1.6, 3, 7, { style: 'navy', hfill: 0.6 });
    K.box(g, -13, -22, 9, -16, 0, 14.5, MARBLE, { w: 0.9 });                                                 // the temple block
    K.box(g, -13, -16, -9.5, -14.2, 0, 14.5, MARBLE, { w: 0.8 }); K.box(g, 5.5, -16, 9, -14.2, 0, 14.5, MARBLE, { w: 0.8 });   // the two piers
    g.fill(K.on('L', -16 + 0.02, -9.5, 5.5, 2, 12.4), '#B9B2A2');                                                // the recess behind the columns
    NK.windows(g, 'L', -16, -9.3, 5.3, 3, 4.5, 2, 5, { style: 'navy', hfill: 0.8, fill: 0.7 });
    K.box(g, -13.4, -16.4, 9.4, -13.6, 0, 1.6, { t: '#DCD6C9', l: '#E6E1D5', r: '#CFC9BB' }, { w: 0.6 });          // the stylobate
    colonnade(g, [-8.4, -5.84, -3.28, -0.72, 1.84, 4.4], -16, 1.6, 12.4, 0.62, { t: '#F2EFE7', l: '#F6F3EC', r: '#E2DDD1' }, true);
    // the flag hung across the columns
    const fz0 = 3.2, fz1 = 11.6, fx0 = -9.2, fx1 = 5.2, fy = -13.7;
    for (let k = 0; k < 13; k++) { const z1 = fz1 - k * (fz1 - fz0) / 13, z0 = z1 - (fz1 - fz0) / 13; g.fill([[fx0, fy, z0], [fx1, fy, z0], [fx1, fy, z1], [fx0, fy, z1]], k % 2 ? '#F6F2E8' : '#C9463E'); }
    g.fill([[fx0, fy + 0.02, fz1 - 4.5], [fx0 + 5.8, fy + 0.02, fz1 - 4.5], [fx0 + 5.8, fy + 0.02, fz1], [fx0, fy + 0.02, fz1]], '#2F4A7A');
    const st = []; for (let i = 0; i < 5; i++) for (let k = 0; k < 4; k++) { const p = g.p(fx0 + 0.6 + i * 1.15, fy + 0.04, fz1 - 0.6 - k * 1.05); st.push(p[0] - 0.3, p[1], p[0] + 0.3, p[1]); } g.segs2(st, '#F6F2E8', 0.35);
    g.outline([[fx0, fy, fz0], [fx1, fy, fz0], [fx1, fy, fz1], [fx0, fy, fz1]], { w: 0.5, c: '#5A3A30', boil: false });
    K.box(g, -13.4, -16.4, 9.4, -13.6, 12.4, 14.6, MARBLE, { w: 0.7 });                                            // the entablature
    NK.text(g, 'L', -13.6, -2, 13.0, 1.1, 'NEW YORK STOCK EXCHANGE', '#6E6650', { center: true, w: 0.3 });
    pediment(g, -13.4, 9.4, -16.4, 2.8, 14.6, 4.6, MARBLE);
  }, { name: 'stock exchange' });
  // Federal Hall: a Doric temple on high steps
  T.obj([13, -30, 31, -11], function (g) {
    g.boilP = 0.3;
    K.box(g, 14, -30, 30, -17.5, 0, 12, MARBLE, { w: 0.9 });
    g.fill(K.on('L', -17.5 + 0.02, 15.5, 28.5, 3.4, 10), '#C9C2B2');
    K.win(g, 'L', -17.5, 20.6, 23.4, 3.4, 8, { style: 'dark' });
    // the steps rising to the portico
    for (let k = 0; k < 6; k++) { const y1 = -11 - k * 1.05, z = (k + 1) * 0.55; K.box(g, 13.6, y1 - 1.05, 30.4, y1, 0, z, { t: '#E4DFD3', l: '#EDE9DF', r: '#D3CDC0' }, { w: 0.4, boil: false, nb: k > 0 }); }
    colonnade(g, [15.2, 17.2, 19.2, 21.2, 23.2, 25.2, 27.2, 29.0], -17.4, 3.3, 10.6, 0.68, { t: '#F2EFE7', l: '#F6F3EC', r: '#E2DDD1' }, false);
    K.box(g, 13.8, -17.6, 30.2, -15.5, 10.6, 12.4, MARBLE, { w: 0.7 });
    pediment(g, 13.8, 30.2, -17.6, 2.0, 12.4, 3.6, MARBLE);
    const p = g.p(31.2, -24, 12.4), t = g.p(31.2, -24, 21); g.line2([p, t], { w: 0.6, c: '#8C8576', boil: false });
  }, { name: 'federal hall' });
  fidiFlag(T, 31.2, -24, 21, { w: 5.2, h: 3.2 });
  // George Washington on his plinth at the foot of the steps
  T.obj([22, -9.5], function (g) {
    K.box(g, 20.8, -10.7, 23.2, -8.3, 0, 3.4, { t: '#C9C3B6', l: '#D6D0C3', r: '#B9B3A6' }, { w: 0.6 });
    NK.person(g, 22, -9.5, 3.4, { dir: 1, pose: 'stand', skin: '#5E6E5A', hair: '#4E5E4A', top: '#5E6E5A', bot: '#55654F', shoe: '#4E5E4A', jacket: '#6A7A64', hairStyle: 'pony', k: 1.25, reach: [-2.5, -11] });
  }, { name: 'washington' });

  /* ---------------- the plaza: the Charging Bull, bollards, the cart ---------------- */
  T.obj([-12, -6, 0, 0], function (g) {
    K.box(g, -11.5, -5.2, -0.5, -0.8, 0, 0.9, { t: '#B9B3A8', l: '#C9C3B8', r: '#A8A296' }, { w: 0.7 });
    const p = g.p(-6, -3, 0.9), s = (u, v) => [p[0] + u, p[1] + v], B = BRONZE, Bl = '#B08C5C', Bd = '#5E4428';
    // tail whipping up, far legs, body, near legs, the lowered head and horns
    g.line2([s(-15, -14), s(-19, -19), s(-16.5, -24), s(-13.5, -22)], { w: 1.2, c: Bd, boil: false, ext: 0 });
    g.fill2([s(-11, -9), s(-9.5, 0), s(-8, 0), s(-8.5, -9)], Bd, true); g.fill2([s(8.5, -8), s(11, 0), s(12.5, 0), s(10.5, -9)], Bd, true);
    const body = [s(-15, -14), s(-12, -19.5), s(-4, -21.5), s(4, -22.5), s(10, -21), s(13, -16), s(14, -10), s(11, -7), s(4, -6.5), s(-4, -7.5), s(-11, -7.5), s(-15, -9.5)];
    g.fill2(body, B, true);
    g.fill2([s(-12, -18.5), s(-4, -20.8), s(4, -21.6), s(9, -20.4), s(4, -18.5), s(-4, -17.5), s(-10, -15.5)], Bl, true);
    g.fill2([s(-11, -9), s(-4, -8), s(4, -7), s(11, -7.5), s(6, -10), s(-4, -10.5)], Bd, true);
    g.fill2([s(-14, -10), s(-12.5, 0), s(-10.8, 0), s(-11, -9.5)], B, true); g.fill2([s(4, -8), s(5.5, 0), s(7.2, 0), s(6.4, -8.5)], B, true);
    const head = [s(11, -20), s(15, -18), s(19.5, -11.5), s(21, -7.5), s(18.5, -6.2), s(15.5, -8), s(12.5, -12)];
    g.fill2(head, B, true); g.fill2([s(17.5, -10), s(21, -7.5), s(18.5, -6.2), s(16, -8)], Bd, true);
    g.fill2([s(14, -17), s(15, -20.5), s(18.5, -23.5), s(16.5, -19.5), s(15.6, -16.8)], '#C9A66E', true); g.fill2([s(16.4, -16.5), s(19, -18.4), s(22.5, -19), s(19.5, -16.2)], '#C9A66E', true);
    g.disc2(s(17.6, -13.2), 0.45, '#2A2018');
    g.line2(body.concat([body[0]]), { w: 0.6, c: '#3E2E1C', boil: false }); g.line2(head, { w: 0.55, c: '#3E2E1C', boil: false });
  }, { name: 'bull' });
  // black security bollards closing the plaza to cars at both ends
  for (const x of [-30.2, 30.2]) for (let y = -11; y <= 8; y += 4.6) T.obj([x, y], (g) => { K.cyl(g, x, y, 0.45, 0, 2.0, { t: '#6A6560', l: '#4A4744', r: '#3A3734' }, { w: 0.35, n: 8 }); }, { name: 'bollard' });
  T.obj([-22, 5], (g) => NK.cart(g, -22, 5, { along: 'x' }), { name: 'cart' });
  T.cast([-18.8, 6.8], (g) => NK.person(g, -18.8, 6.8, 0, NK.who(1211, { dir: 2, pose: 'hold', top: '#F3F1EA', cap: '#2F2C2A' })), { on: true });
  T.cast([-21.5, 9], (g) => { NK.person(g, -22, 9.2, 0, NK.suit(1212, { dir: 3, pose: 'hold' })); }, { on: true });
  // lunch on the benches under the oaks
  for (const [x, s2] of [[-26, 1290], [-15, 1292]]) T.cast([x, 10], (g) => { K.bench(g, x, 10.4, { face: 'L', L: 2.4 }); NK.person(g, x - 1.1, 11.4, 1.3, NK.who(s2, { dir: 1, pose: 'sit', coffee: true })); NK.person(g, x + 1.2, 11.4, 1.3, NK.suit(s2 + 1, { dir: 1, pose: 'sit' })); }, { on: true });

  /* ---------------- the memorial pool ---------------- */
  const PX0 = -27, PX1 = -13, PY0 = 14, PY1 = 28, WZ = -3.2;
  T.obj([PX0 - 0.6, PY0 - 0.6, PX1 + 0.6, PY1 + 0.6], function (g) {
    g.boilP = 0.25;
    // the inner walls we see (far ones), the water, the square void and its walls
    g.fill([[PX0, PY0, 0], [PX1, PY0, 0], [PX1, PY0, WZ], [PX0, PY0, WZ]], '#6E6A64');
    g.fill([[PX0, PY0, 0], [PX0, PY1, 0], [PX0, PY1, WZ], [PX0, PY0, WZ]], '#5E5A54');
    g.fill(K.rect(PX0, PY0, PX1, PY1, WZ), '#7FA6C2');
    g.water(K.rect(PX0 + 0.5, PY0 + 0.5, PX1 - 0.5, PY1 - 0.5, WZ), { dens: 0.6 });
    const v0 = -22.6, v1 = -17.4, w0 = 19.4, w1 = 24.6;
    g.fill(K.rect(v0, w0, v1, w1, WZ), '#2E3236');
    g.fill([[v0, w0, WZ], [v1, w0, WZ], [v1, w0, WZ - 2.5], [v0, w0, WZ - 2.5]], '#E9EEF0'); g.fill([[v0, w0, WZ], [v0, w1, WZ], [v0, w1, WZ - 2.5], [v0, w0, WZ - 2.5]], '#D5DDE1');
    g.outline(K.rect(v0, w0, v1, w1, WZ), { w: 0.5, c: '#2A2622', boil: false });
    // the bronze parapet, names cut into it
    for (const [a, b] of [[[PX0 - 0.6, PY0 - 0.6], [PX1 + 0.6, PY0]], [[PX0 - 0.6, PY0], [PX0, PY1 + 0.6]], [[PX1, PY0], [PX1 + 0.6, PY1 + 0.6]], [[PX0, PY1], [PX1 + 0.6, PY1 + 0.6]]]) K.box(g, a[0], a[1], b[0], b[1], 0, 1.3, { t: '#4A4038', l: '#5E5246', r: '#4E443A' }, { w: 0.55, boil: false });
    const nm = []; for (const [f, p, A0, A1] of [['L', PY1 + 0.6, PX0, PX1], ['R', PX1 + 0.6, PY0, PY1]]) for (let a = A0 + 0.5; a < A1 - 0.5; a += 0.9) { const q = g.p.apply(g, K.pt(f, p + 0.02, a, 0.9)); nm.push(q[0], q[1], q[0] + 1.1, q[1] + (f === 'L' ? 0.6 : -0.6)); } g.segs2(nm, '#2E2620', 0.25);
  }, { name: 'pool' });
  // the water falling down the far inner walls and into the void
  T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const ph = Math.floor((t * 2) % 1 * 6); return { x: PX1 + 0.6, y: PY1 + 0.6, z: 0, key: ph, ph }; },
    draw(g, st) {
      const o = [-(PX1 + 0.6), -(PY1 + 0.6)], s = [];
      const P = (x, y, z) => g.p(x + o[0], y + o[1], z);
      for (let a = PX0 + 0.3; a < PX1; a += 0.55) { const k = (Math.round(a * 4) + st.ph) % 3; const q0 = P(a, PY0 + 0.02, -0.1), q1 = P(a, PY0 + 0.02, WZ + 0.2 + k * 0.4); s.push(q0[0], q0[1], q1[0], q1[1]); }
      for (let a = PY0 + 0.3; a < PY1; a += 0.55) { const k = (Math.round(a * 4) + st.ph) % 3; const q0 = P(PX0 + 0.02, a, -0.1), q1 = P(PX0 + 0.02, a, WZ + 0.2 + k * 0.4); s.push(q0[0], q0[1], q1[0], q1[1]); }
      g.segs2(s, 'rgba(250,252,252,0.9)', 0.32);
      const f = []; for (let a = -22.4; a < -17.6; a += 0.45) { const k = (Math.round(a * 5) + st.ph) % 3; const q0 = P(a, 19.42, WZ - 0.05), q1 = P(a, 19.42, WZ - 0.9 - k * 0.5); f.push(q0[0], q0[1], q1[0], q1[1]); }
      g.segs2(f, 'rgba(160,190,205,0.9)', 0.3);
      const foam = []; for (let a = PX0 + 0.4; a < PX1 - 0.3; a += 0.8) { const q = P(a + (st.ph % 2) * 0.3, PY0 + 0.6, WZ + 0.02); foam.push(q[0] - 0.8, q[1], q[0] + 0.8, q[1]); } g.segs2(foam, '#F6F8F8', 0.45);
    } });
  // swamp white oaks round the pool, in rows
  for (const [x, y] of [[-29.5, 12.5], [-29.5, 21], [-29.5, 29.5], [-9.5, 12.5], [-9.5, 21], [-9.5, 29.5], [-29.5, 4.5]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.2, h: 5.6, col: '#7FAE62' }), { name: 'oak' });
  // visitors at the parapet: a couple reading the names, a father with a child on his shoulders, a woman laying a rose
  T.cast([-20, 12.6], (g) => { NK.person(g, -22.5, 12.8, 0, NK.who(1221, { dir: 1, pose: 'hold' })); NK.person(g, -18.6, 12.7, 0, NK.who(1222, { dir: 1 })); }, { on: true });
  T.cast([-12, 22], (g) => { const r = NK.person(g, -12.1, 22, 0, NK.who(1223, { dir: 2, pose: 'hold', bare: true })); void r; NK.person(g, -12.1, 22, 4.4, Object.assign(NK.who(1224, { dir: 2, pose: 'cheer', ph: 0.25, k: 0.6 }), { noLegs: true })); }, { on: true });
  T.cast([-14.5, 12.8], (g) => { const r = NK.person(g, -14.5, 12.8, 0, NK.who(1225, { dir: 1, pose: 'hold', dress: '#2F2C2A' })); g.fill2([[r.hands[0][0] - 0.3, r.hands[0][1] - 2.4], [r.hands[0][0] + 0.3, r.hands[0][1] - 2.4], [r.hands[0][0] + 0.2, r.hands[0][1] + 0.4], [r.hands[0][0] - 0.2, r.hands[0][1] + 0.4]], '#4E7A3A', true); g.disc2([r.hands[0][0], r.hands[0][1] - 2.7], 0.7, '#C9363E'); }, { on: true });

  /* ---------------- the Oculus ---------------- */
  // a low white vault on an ellipse; its ribs cross at the glass spine and fly on upwards as two wings, highest at the ends
  T.obj([0, 15, 26, 30], function (g) {
    g.boilP = 0.2;
    const cx = 13, cy = 22.5, L = 10.5, W = 4.0, ZS = 5.0, N = 6;
    const wid = (u) => W * Math.sqrt(Math.max(0.08, 1 - u * u));
    const rib = (a, b, wa, wb, col) => { const A = g.p.apply(g, a), B = g.p.apply(g, b), dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l; const q = [[A[0] + nx * wa, A[1] + ny * wa], [B[0] + nx * wb, B[1] + ny * wb], [B[0] - nx * wb, B[1] - ny * wb], [A[0] - nx * wa, A[1] - ny * wa]]; g.fill2(q, col); g.outline2(q, { w: 0.35, c: '#8C979C', boil: false }); };
    const wing = (side) => { for (let i = -N; i <= N; i++) { const u = i / N, x = cx + u * L * 0.9; rib([x, cy, ZS], [x + u * 2.6, cy + side * (3.2 + Math.abs(u) * 2.6), 8.4 + Math.abs(u) * 4.6], 1.2, 0.45, side < 0 ? '#E6EAEB' : '#F8F8F6'); } };
    const ell = (z) => { const pts = []; for (let i = 0; i <= 32; i++) { const a = TAU * i / 32; pts.push([cx + Math.cos(a) * L, cy + Math.sin(a) * W, z]); } return pts; };
    wing(-1);
    // the plinth and the vault: glass between white ribs, far half then near half
    g.fill(ell(0.8), '#EEEFEC'); g.fill(ell(0).slice(0, 17).concat(ell(0.8).slice(0, 17).reverse()), '#DCDFDC');
    const half = (side) => { const pts = []; for (let i = -12; i <= 12; i++) { const u = i / 12; pts.push([cx + u * L, cy + side * wid(u), 0.8]); } for (let i = 12; i >= -12; i--) { const u = i / 12; pts.push([cx + u * L * 0.9, cy, ZS]); } return pts; };
    g.fill(half(-1), '#D2E2EA'); g.fill(half(1), '#DCE9EF');
    const vr = []; for (let i = -N; i <= N; i++) { const u = i / N, a = g.p(cx + u * L * 0.97, cy + wid(u * 0.97), 0.8), b = g.p(cx + u * L * 0.9, cy, ZS); vr.push(a[0], a[1], b[0], b[1]); } g.segs2(vr, '#F8F8F6', 1.0);
    g.line(ell(0.8).slice(0, 17), { w: 0.7, c: '#6E7A80', boil: false });
    const sp = []; for (let i = -N; i <= N; i++) sp.push([cx + (i / N) * L * 0.9, cy, ZS]); g.line(sp, { w: 0.9, c: '#8C979C', boil: false });
    wing(1);
  }, { name: 'oculus' });

  /* ---------------- sidewalk furniture ---------------- */
  T.obj([-20, 34], (g) => NK.subway(g, -20, 34, 'x-', { w: 1.6, L: 5 }), { name: 'subway' });
  for (const [x, y] of [[-34.5, -24], [-34.5, -12], [-34.5, 20], [34.5, -24], [34.5, 20], [10, 34.5], [22, 34.5]]) T.obj([x, y], (g) => NK.tree(g, x, y), { name: 'tree' });
  T.obj([34.5, -6], (g) => NK.citibikes(g, 34.2, -12, 'y', 6), { name: 'citibike' });
  T.obj([-8, 35], (g) => NK.hydrant(g, -8, 35), { name: 'hydrant' });
  T.obj([34.6, 8], (g) => NK.newsbox(g, 34.6, 8, '#2F6DB5'), { name: 'news' });
  T.obj([30, 35], (g) => NK.basket(g, 29.5, 35), { name: 'basket' });

  /* ---------------- the living layer ---------------- */
  // the bull queue: tourists waiting their turn, one at the horns, a friend crouched with the phone
  const Q = [[6, -1.6, 2], [8, -2.0, 2], [10, -1.8, 2], [12, -2.2, 2], [14.2, -2.0, 2]];
  Q.forEach(([x, y, d], k) => T.cast([x, y], (g) => NK.person(g, x, y, 0, (k % 2 ? NK.tourist : NK.who)(1240 + k, { dir: d, pose: k === 2 ? 'hold' : 'stand', phone: k === 2 })), { on: true }));
  T.cast([2.6, -1.0], (g) => NK.person(g, 2.6, -1.0, 0, NK.tourist(1250, { dir: 2, pose: 'cheer', ph: 0.3 })), { on: true });
  T.cast([1.0, 4.5], (g) => { const r = NK.person(g, 1.0, 4.5, 0, NK.who(1251, { dir: 3, pose: 'crouch', reach: [2.5, -12] })); g.fill2([[r.hands[0][0] - 0.6, r.hands[0][1] - 1.6], [r.hands[0][0] + 0.6, r.hands[0][1] - 1.6], [r.hands[0][0] + 0.6, r.hands[0][1] + 0.4], [r.hands[0][0] - 0.6, r.hands[0][1] + 0.4]], '#2A2622', true); }, { on: true });
  T.cast([-15, 5], (g) => NK.person(g, -15, 5, 0, NK.cop(1252, { dir: 0 })), { on: true });
  // a tour guide with her flag and three of her group, at the Federal Hall steps
  T.cast([-2, -10.6], (g) => { const r = NK.person(g, -2, -10.6, 0, NK.who(1260, { dir: 1, pose: 'wave', ph: 0.2, cap: '#E6C24F' })); const hd = r.hands[1] || r.hands[0]; g.line2([hd, [hd[0] + 0.5, hd[1] - 12]], { w: 0.5, c: '#5A4A3C', boil: false }); g.fill2([[hd[0] + 0.5, hd[1] - 12], [hd[0] + 4.6, hd[1] - 11], [hd[0] + 0.5, hd[1] - 9.4]], '#E6C24F', true); }, { on: true });
  for (const [x, y, s] of [[-4.5, -7.2, 1261], [-1.4, -6.8, 1262], [1.6, -7.6, 1263]]) T.cast([x, y], (g) => NK.person(g, x, y, 0, NK.tourist(s, { dir: 3 })), { on: true });
  // suits crossing the plaza with coffee, a courier, commuters into the Oculus
  NK.walker(T, NK.suit(1270, { coffee: true }), [[-28, -8], [28, -8]], 4.6, { phase: 0.1 });
  NK.walker(T, NK.suit(1271, { phone: true }), [[27, 1.5], [-27, 1.5]], 5.0, { phase: 0.4 });
  NK.walker(T, NK.suit(1272, { dress: '#2F2C2A' }), [[-26, -10.5], [26, -10.5]], 4.2, { phase: 0.7 });
  NK.walker(T, NK.who(1273, { tote: '#E9E1CC' }), [[24, -11.5], [-24, -11.5]], 4.4, { phase: 0.25 });
  NK.walker(T, NK.who(1274), [[-2, 8], [-2, 12.5], [-2, 8], [-27, 8]], 4.0, { phase: 0.5 });
  NK.walker(T, NK.suit(1275), [[30, 10.5], [26, 10.5], [26, 22.5], [25.2, 22.5], [25.2, 10.5]], 3.8, { phase: 0.2 });
  NK.walker(T, NK.who(1276, { coffee: true }), [[-30, 4], [6, 4]], 4.5, { phase: 0.6 });
  // pigeons pecking round the bull
  T.actor({ sample: 5, period: 10,
    at(t) { const ph = Math.floor((t * 1.6) % 1 * 4); return { x: -1, y: 1, z: 0, key: ph, ph }; },
    draw(g, st) {
      for (let k = 0; k < 7; k++) {
        const R = RNG(k * 13 + 1), p = g.p(-1 + (R() - 0.5) * 9 - (-1), 1 + (R() - 0.5) * 6 - 1, 0), fl = R() < 0.5 ? 1 : -1, peck = ((k + st.ph) % 4 === 0) ? 1.2 : 0;
        const s = (u, v) => [p[0] + fl * u, p[1] + v];
        g.fill2([s(-1.4, -0.9), s(0.4, -1.5), s(1.0, -1.0), s(0.2, -0.3), s(-1.2, -0.4)], '#8C8E94', true);
        g.fill2([s(0.4, -1.3 + peck * 0.6), s(1.4, -2.0 + peck * 1.2), s(1.8, -1.6 + peck * 1.2), s(1.0, -0.9)], '#6E7078', true);
        g.disc2(s(1.5, -1.9 + peck * 1.2), 0.18, '#2A2622');
      }
    } });
  NK.corners(T);
});
