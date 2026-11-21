'use strict';
/* (0,100) Praça do Comércio, the Terreiro do Paço: the great square open to the river.
   Built: yellow Pombaline wings on three sides (west, north, east), three storeys over a ground-floor arcade of round
   arches, terracotta hip roofs, white window surrounds; at the river end of each side wing a taller pavilion (torreão)
   with its own pyramid roof. In the middle of the north side the Arco da Rua Augusta: a white triumphal arch, columns
   either side of the opening, the clock, and the group of Glory crowning Genius and Valour on top. In the centre King
   José I on horseback in green bronze on a white stepped pedestal. The paving is pale limestone in a big diamond
   lattice. Across the promenade the Cais das Colunas: marble steps down into the Tagus between two columns.
   Who: tourists photographing the arch; a guide with a raised umbrella and her group circling the statue; a café
   terrace before the west arcade with a waiter; a gold living statue and two children; a tuk-tuk waiting for fares;
   a couple on the steps by the water; pigeons and a child chasing them. */
SF.tile('comercio', 0, 100, { rim: 30 }, function (T) {
  const H = 37, YEL = { t: '#E3BD55', l: '#F2CC5E', r: '#DDB047' }, WH = { t: '#EAE5DA', l: '#F6F3EB', r: '#E1DBCE' }, WZ = 14.2;
  T.ground(function (g) {
    K.slab(g, H, { top: '#ECE5D3' });
    g.boilP = 0.1;
    // the diamond lattice of the paving
    const segs = [];
    for (let k = -2 * H; k <= 2 * H; k += 8) {
      const l1 = []; for (const t of [-H, H]) { const x = t, y = x + k; if (y >= -H && y <= H) l1.push([x, y]); } for (const t of [-H, H]) { const y = t, x = y - k; if (x >= -H && x <= H) l1.push([x, y]); }
      if (l1.length >= 2) { const a = g.p(l1[0][0], l1[0][1], 0.01), b = g.p(l1[1][0], l1[1][1], 0.01); segs.push(a[0], a[1], b[0], b[1]); }
      const l2 = []; for (const t of [-H, H]) { const x = t, y = -x + k; if (y >= -H && y <= H) l2.push([x, y]); } for (const t of [-H, H]) { const y = t, x = -y + k; if (x >= -H && x <= H) l2.push([x, y]); }
      if (l2.length >= 2) { const a = g.p(l2[0][0], l2[0][1], 0.01), b = g.p(l2[1][0], l2[1][1], 0.01); segs.push(a[0], a[1], b[0], b[1]); }
    }
    g.segs2(segs, '#D2C8B2', 0.45);
    g.scuff(K.rect(-H, -H, H, H), { dir: Math.atan2(AY, AX), len: 2.4, c: '#F5F0E4', dens: 0.3, w: 0.5, spread: 0.6 });
    // the ring of dark calçada round the statue
    const ring = (r) => K.arc(0, 2, 0.02, r, 0, TAU, 40);
    g.fill(ring(11), '#E2D9C5'); g.fill(ring(10.2), '#ECE5D3'); g.outline(ring(11), { w: 0.4, c: '#BFB49C', boil: false });
  }, { rim: true });

  /* ---------------- the wings ---------------- */
  // a run of arcade arches on a face (dark openings between stone piers)
  const arcade = (g, face, p, a0, a1) => {
    const n = Math.max(1, Math.round((a1 - a0) / 3.3));
    for (let i = 0; i < n; i++) {
      const m = lerp(a0, a1, (i + 0.5) / n), hw = (a1 - a0) / n * 0.34, pts = [K.pt(face, p + 0.05, m - hw, 0), K.pt(face, p + 0.05, m + hw, 0)];
      for (let k = 0; k <= 8; k++) { const t = Math.PI * k / 8; pts.push(K.pt(face, p + 0.05, m + hw * Math.cos(t), 3.6 + hw * Math.sin(t))); }
      g.fill(pts, '#6A5634'); g.line(pts.slice(1), { w: 0.4, c: '#4A3A22', boil: false });
      g.fill(K.on(face, p + 0.06, m - hw * 0.6, m + hw * 0.6, 0, 2.6), '#8E7650');
    }
    g.fill(K.on(face, p + 0.04, a0, a1, 0, 0.5), '#E6DFCF');
  };
  const upper = (g, face, p, a0, a1, z0, n) => {
    const nb = Math.max(1, Math.round((a1 - a0) / 3.3));
    for (let s = 0; s < n; s++) for (let b = 0; b < nb; b++) { const m = lerp(a0, a1, (b + 0.5) / nb), z = z0 + s * 3.6; LX.win(g, face, p, m - 0.6, m + 0.6, z + (s === 0 ? 0 : 0.4), z + 2.8, { bal: s === 0, glass: '#5C6E78' }); }
    g.fill(K.on(face, p + 0.05, a0, a1, z0 - 0.7, z0 - 0.4), '#F6F3EB');
  };
  const wing = (x0, y0, x1, y1, inner, zt) => (g) => {
    g.boilP = 0.25;
    K.box(g, x0, y0, x1, y1, 0, zt, YEL, { w: 0.9 });
    for (const face of ['L', 'R']) {
      const p = face === 'L' ? y1 : x1, a0 = face === 'L' ? x0 : y0, a1 = face === 'L' ? x1 : y1;
      if (face === inner) arcade(g, face, p, a0 + 0.6, a1 - 0.6);
      else { const nb = Math.max(1, Math.round((a1 - a0) / 3.3)); for (let b = 0; b < nb; b++) { const m = lerp(a0, a1, (b + 0.5) / nb); LX.win(g, face, p, m - 0.55, m + 0.55, 1.2, 3.4, { glass: '#6A7F8C' }); } }
      upper(g, face, p, a0 + 0.3, a1 - 0.3, 5.2, 2);
      g.fill(K.on(face, p + 0.05, a0, a1, zt - 0.8, zt - 0.3), '#F6F3EB');
    }
    LX.roof(g, x0, y0, x1, y1, zt, 2.6, { ridge: Math.max(0, Math.abs((x1 - x0) - (y1 - y0))) });
  };
  // the pavilion at a wing's river end
  const torreao = (x0, y0, x1, y1) => (g) => {
    K.box(g, x0, y0, x1, y1, 0, WZ + 3.4, YEL, { w: 0.95 });
    for (const face of ['L', 'R']) {
      const p = face === 'L' ? y1 : x1, a0 = face === 'L' ? x0 : y0, a1 = face === 'L' ? x1 : y1;
      arcade(g, face, p, a0 + 0.8, a1 - 0.8); upper(g, face, p, a0 + 0.8, a1 - 0.8, 5.2, 3);
      g.fill(K.on(face, p + 0.05, a0, a1, WZ + 2.6, WZ + 3.1), '#F6F3EB');
      // the royal arms in the pediment
      const m = (a0 + a1) / 2, c = g.p.apply(g, K.pt(face, p + 0.1, m, WZ + 1.2)); g.disc2(c, 1.6, '#F6F3EB'); g.ring2(c, 1.6, { w: 0.35, c: '#9C8A5A' });
    }
    K.hip(g, x0 - 0.4, y0 - 0.4, x1 + 0.4, y1 + 0.4, WZ + 3.4, 4.6, '#B9B4AA', { c: '#5E5A52', w: 0.85 });
    const t = g.p((x0 + x1) / 2, (y0 + y1) / 2, WZ + 8.0); g.line2([t, [t[0], t[1] - 4]], { w: 0.45, c: '#4A4540', boil: false }); g.disc2([t[0], t[1] - 4.2], 0.6, '#C9A44A');
  };
  T.obj([-H, -H, -26, 20], wing(-H, -H, -26, 20, 'R', WZ), { name: 'west wing' });
  T.obj([-H, 20, -26, 31], torreao(-H, 20, -26, 31), { name: 'west torreao' });
  T.obj([26, -H, H, 20], wing(26, -H, H, 20, 'L', WZ), { name: 'east wing' });
  T.obj([26, 20, H, 31], torreao(26, 20, H, 31), { name: 'east torreao' });
  T.obj([-26, -H, -6.5, -27], wing(-26, -H, -6.5, -27, 'L', WZ), { name: 'north wing w' });
  T.obj([6.5, -H, 26, -27], wing(6.5, -H, 26, -27, 'L', WZ), { name: 'north wing e' });

  /* ---------------- the Arco da Rua Augusta ---------------- */
  T.obj([-6.5, -H, 6.5, -25.5], function (g) {
    const y1 = -25.5, Z = 15.5;
    g.boilP = 0.3;
    K.box(g, -6.5, -H, 6.5, y1, 0, Z, WH, { w: 1 });
    // the opening: a tall round arch, Rua Augusta glimpsed through it
    const op = [K.pt('L', y1 + 0.05, -2.6, 0), K.pt('L', y1 + 0.05, 2.6, 0)];
    for (let k = 0; k <= 10; k++) { const t = Math.PI * k / 10; op.push(K.pt('L', y1 + 0.05, 2.6 * Math.cos(t), 8.6 + 2.6 * Math.sin(t))); }
    g.fill(op, '#7C6A52'); g.fill(K.on('L', y1 + 0.06, -2.0, 2.0, 0, 4.2), '#E2CC8A'); g.line(op.slice(1), { w: 0.6, boil: false });
    // paired columns either side, an entablature, the clock in the attic
    for (const m of [-5.2, -3.7, 3.7, 5.2]) { const a = g.p(m, y1 + 0.5, 0.8), b = g.p(m, y1 + 0.5, 10.6); g.fill2([[a[0] - 1.1, a[1]], [a[0] + 1.1, a[1]], [b[0] + 1.1, b[1]], [b[0] - 1.1, b[1]]], '#FBF9F3'); g.line2([[a[0] + 1.1, a[1]], [b[0] + 1.1, b[1]]], { w: 0.35, c: '#B8B0A0', boil: false }); }
    K.box(g, -6.9, -H, 6.9, y1 + 0.8, 10.6, 11.6, WH, { w: 0.7, nohid: true });
    g.fill(K.on('L', y1 + 0.85, -5.5, 5.5, 10.8, 11.4), '#E9E3D6');
    K.text(g, 'L', y1 + 0.85, 0, 10.85, 0.5, 'VIRTVTIBVS MAIORVM', '#8C8576', { center: true });
    const ck = g.p(0, y1 + 0.06, 13.4); g.disc2(ck, 3.2, '#2F3A4F'); g.ring2(ck, 3.2, { w: 0.45, c: '#C9A44A' }); g.segs2([ck[0], ck[1], ck[0] + 0.3, ck[1] - 2.3, ck[0], ck[1], ck[0] + 1.6, ck[1] + 0.6], '#E9D9A0', 0.45);
    // the statue group on its plinth: Glory standing with wreaths over two seated figures
    K.box(g, -4.5, -H + 2, 4.5, y1 - 1.5, Z, Z + 1.6, WH, { w: 0.6 });
    const c = g.p(0, -29.5, Z + 1.6), WS = '#E9E5DB', SD = '#C9C2B2';
    for (const s of [-1, 1]) { const b = [c[0] + s * 8.5, c[1] - 0.4]; g.fill2(K.curve([[b[0] - 3, b[1]], [b[0] + 3, b[1]], [b[0] + 2.4, b[1] - 6], [b[0] + 0.4, b[1] - 9.5], [b[0] - 1.4, b[1] - 8], [b[0] - 2.6, b[1] - 4]], 3, true), WS, true); g.disc2([b[0] + 0.2, b[1] - 10.4], 1.6, WS); g.line2(K.curve([[b[0] - 3, b[1]], [b[0] - 2.6, b[1] - 4], [b[0] - 1.4, b[1] - 8], [b[0] + 0.4, b[1] - 9.5], [b[0] + 2.4, b[1] - 6], [b[0] + 3, b[1]]], 3), { w: 0.45, c: '#8C8576', boil: false }); }
    const gl = [[c[0] - 2.4, c[1]], [c[0] + 2.4, c[1]], [c[0] + 1.6, c[1] - 9], [c[0] + 1.0, c[1] - 14], [c[0] - 1.0, c[1] - 14], [c[0] - 1.8, c[1] - 9]];
    g.fill2(gl, WS, true); g.fill2(gl.slice(1, 4).concat([[c[0], c[1] - 6]]), SD, true); g.line2(gl, { w: 0.5, c: '#8C8576', boil: false, close: true });
    g.disc2([c[0], c[1] - 15.6], 1.7, WS); g.ring2([c[0], c[1] - 15.6], 1.7, { w: 0.4, c: '#8C8576' });
    for (const s of [-1, 1]) { g.line2([[c[0] + s * 1.2, c[1] - 12.5], [c[0] + s * 4.2, c[1] - 18.5]], { w: 0.8, c: WS, boil: false }); g.ring2([c[0] + s * 4.6, c[1] - 19.4], 1.0, { w: 0.5, c: '#7FA35E' }); }
  }, { name: 'arco' });

  /* ---------------- King José I ---------------- */
  T.obj([-3.6, -1.6, 3.6, 5.6], function (g) {
    K.box(g, -3.6, -1.6, 3.6, 5.6, 0, 0.8, WH, { w: 0.7 });
    K.box(g, -2.8, -0.8, 2.8, 4.8, 0.8, 2.0, WH, { w: 0.7 });
    K.box(g, -2.0, 0.0, 2.0, 4.0, 2.0, 8.4, { t: '#EFEBE2', l: '#F7F4EC', r: '#E2DCCF' }, { w: 0.8 });
    // bronze reliefs and the elephants' corner groups suggested by dark panels
    g.fill(K.on('L', 4.05, -1.4, 1.4, 3.2, 6.6), '#5E7A6A'); g.fill(K.on('R', 2.05, 0.6, 3.4, 3.2, 6.6), '#55705F');
    K.box(g, -2.4, -0.4, 2.4, 4.4, 8.4, 8.9, WH, { w: 0.6 });
    // the horse, rearing slightly, facing the river (lower left); the king with his plumed hat
    // the horse walking towards the river (screen left), one foreleg raised; the king upright in his cloak and plumed hat
    const B = '#4E6A5E', BD = '#3C5449', BL = '#6E8C7E', b = g.p(0.6, 2.6, 8.9), k = 1.55, P = (u, v) => [b[0] + u * k, b[1] + v * k];
    const leg = (pts, col) => g.line2(pts.map((q) => P(q[0], q[1])), { w: 1.05 * k, c: col, boil: false, ext: 0, taper: 0.2 });
    leg([[-3.0, -6], [-3.3, -2.6], [-3.4, 0]], BD); leg([[3.0, -6], [2.4, -2.8], [2.8, 0]], BD);
    g.line2([P(5.0, -7.8), P(6.4, -6.2), P(6.6, -3.4)], { w: 1.0 * k, c: BD, boil: false, ext: 0, taper: 0.8 });
    const body = K.curve([[-4.9, -7.4], [-4.2, -9.0], [-1.0, -9.4], [3.0, -9.2], [5.2, -8.0], [5.0, -6.0], [2.6, -5.2], [-2.0, -5.2], [-4.4, -5.8]].map((q) => P(q[0], q[1])), 3, true);
    g.fill2(body, B, true);
    const neck = [P(-4.9, -7.0), P(-3.4, -9.2), P(-5.6, -13.4), P(-7.0, -13.0)]; g.fill2(neck, B, true);
    const head = K.curve([[-5.4, -13.8], [-7.4, -13.6], [-9.6, -11.6], [-9.2, -10.8], [-7.0, -11.6], [-6.0, -12.4]].map((q) => P(q[0], q[1])), 2, true); g.fill2(head, B, true);
    g.fill2([P(-5.8, -13.6), P(-5.4, -14.8), P(-5.0, -13.6)], BD, true);
    g.fill2([P(-3.6, -9.0), P(-5.2, -12.8), P(-4.6, -13.2), P(-3.0, -9.4)], BD, true);
    leg([[-3.8, -6.2], [-5.4, -3.6], [-6.8, -3.9]], B); leg([[3.6, -6.0], [4.4, -2.8], [4.2, 0]], B);
    g.line2(body, { w: 0.5, c: '#22302A', close: true, boil: false });
    g.line2(neck.concat(head.slice(0, 4)), { w: 0.4, c: '#22302A', boil: false });
    g.fill2([P(-1.6, -9.2), P(2.2, -9.2), P(2.0, -7.6), P(-1.4, -7.6)], '#9C7A3A', true);
    // the rider
    g.fill2([P(0.6, -9.6), P(4.2, -10.4), P(4.6, -8.0), P(1.2, -8.6)], BD, true);
    leg([[0.4, -9.6], [-1.0, -7.8], [-0.6, -5.8]], B);
    g.fill2([P(-0.8, -9.4), P(1.4, -9.4), P(0.9, -14.0), P(-0.6, -14.2)], B, true);
    g.fill2([P(-0.2, -13.6), P(-2.6, -12.4), P(-2.6, -11.8), P(0.2, -12.8)], BL, true); g.line2([P(-2.6, -12.0), P(-4.4, -14.6)], { w: 0.45 * k, c: BD, boil: false, ext: 0 });
    g.disc2(P(0.1, -15.3), 1.05 * k, B);
    g.fill2([P(-1.6, -16.0), P(1.8, -16.0), P(1.2, -17.0), P(-1.0, -17.0)], BD, true);
    g.fill2([P(0.4, -17.0), P(2.2, -18.6), P(2.6, -17.6), P(1.2, -16.6)], '#E9E5DB', true);
  }, { name: 'jose I' });

  /* ---------------- the Cais das Colunas, across the promenade ---------------- */
  T.obj([-6.5, 44, 6.5, 53], function (g) {
    g.fill([[-6.5, 44, 0], [6.5, 44, 0], [6.5, 46, 0], [-6.5, 46, 0]], '#F2EEE3');
    LX.steps(g, -6.5, 46, 6.5, 53, LS.wz, 0, 'y', { tread: '#F2EEE3', riser: '#D9D2C2' });
    g.water([[-6.5, 51, LS.wz + 0.05], [6.5, 51, LS.wz + 0.05], [6.5, 53, LS.wz + 0.05], [-6.5, 53, LS.wz + 0.05]], { dens: 0.8 });
  }, { name: 'cais steps' });
  for (const x of [-4.6, 4.6]) T.obj([x, 50], function (g) {
    const z = LS.wz + (53 - 50) / 7 * 3; K.cyl(g, x, 50, 0.75, z, z + 0.8, WH, { n: 10, w: 0.5 }); K.cyl(g, x, 50, 0.55, z + 0.8, z + 7.8, WH, { n: 10, w: 0.6 }); K.cyl(g, x, 50, 0.8, z + 7.8, z + 8.6, WH, { n: 10, w: 0.5 });
  }, { on: true, name: 'column' });
  T.cast([0, 48.5], function (g) { const z = -1.3; LX.person(g, -1.2, 48.2, z, LX.who(501, { dir: 1, pose: 'sit' })); LX.person(g, 1.0, 48.4, z, LX.who(502, { dir: 1, pose: 'sit', dress: '#E77FB3' })); }, { on: true });

  /* ---------------- life on the square ---------------- */
  // the café terrace before the west arcade: cream umbrellas over little tables
  [[-21.5, -12], [-21.5, -3], [-21.5, 6]].forEach(([x, y], i) => T.cast([x + 1, y + 1], function (g) {
    const tb = g.p(x, y, 0), tt = g.p(x, y, 2.4); g.segs2([tb[0], tb[1], tt[0], tt[1]], '#5A4A3C', 0.4); g.fill2(arcPts(tt[0], tt[1], 2.6, 0, TAU, 12).map((p) => [p[0], tt[1] + (p[1] - tt[1]) * 0.5]), '#F3F1EA', true);
    for (const [cx, cy] of [[x - 1.8, y + 0.4], [x + 1.8, y + 0.6]].concat(i === 1 ? [[x + 0.4, y + 2.6]] : [])) { K.box(g, cx - 0.7, cy - 0.7, cx + 0.7, cy + 0.7, 0.9, 1.3, { t: '#B9824A', l: '#A87440', r: '#94653A' }, { w: 0.35, boil: false }); const l0 = g.p(cx + 0.6, cy + 0.6, 0), l1 = g.p(cx + 0.6, cy + 0.6, 0.9); g.segs2([l0[0], l0[1], l1[0], l1[1]], '#5A4A3C', 0.35); }
    LX.person(g, x - 1.8, y + 0.4, 1.3, LX.who(510 + i * 3, { dir: 0, pose: 'sit' })); LX.person(g, x + 1.8, y + 0.6, 1.3, LX.who(511 + i * 3, { dir: 1, pose: 'sit', beer: i !== 1 }));
    if (i === 1) LX.person(g, x + 0.4, y + 2.6, 1.3, LX.who(512 + i * 3, { dir: 1, pose: 'sit' }));
    const up = g.p(x, y, 7.2); g.segs2([tt[0], tt[1], up[0], up[1]], '#5A4A3C', 0.4);
    const um = arcPts(up[0], up[1] + 2.4, 8.4, Math.PI, TAU, 12).concat([[up[0] + 8.4, up[1] + 3.6], [up[0] - 8.4, up[1] + 3.6]]); g.fill2(um, '#EFE6CF', true); g.outline2(um, { w: 0.4, c: '#9C8A5A', boil: false });
  }, { on: true }));
  T.cast([-18.5, 1.5], (g) => { const r = LX.person(g, -18.5, 1.5, 0, LX.who(520, { dir: 1, pose: 'hold', top: '#F7F5EF', bot: '#2F343B', tie: '#2F343B' })); g.fill2(arcPts(r.hands[0][0], r.hands[0][1] - 0.3, 2.2, 0, TAU, 10).map((p) => [p[0], r.hands[0][1] - 0.3 + (p[1] - r.hands[0][1] + 0.3) * 0.35]), '#D9D5CB', true); });
  // tourists photographing the arch
  [[-5, -13, 2], [0, -12.5, 3], [9, -15, 2]].forEach(([x, y, d], i) => T.cast([x, y], (g) => LX.person(g, x, y, 0, LX.who(530 + i, { dir: d, pose: 'hold', reach: [0.4, -12.5], phone: true }))));
  // the living statue on his box and the two children
  T.cast([4, -22], function (g) {
    K.box(g, 2.8, -23.2, 5.2, -20.8, 0, 2.0, { t: '#C9A44A', l: '#D9B85A', r: '#B9943A' }, { w: 0.5, boil: false });
    LX.person(g, 4, -22, 2.0, { skin: '#D4B054', hair: '#C9A44A', top: '#D9B85A', bot: '#C9A44A', shoe: '#C9A44A', dir: 1, pose: 'wave', ph: 0.3, hairStyle: 'short', hat: '#C9A44A' });
    LX.person(g, 5.5, -17.8, 0, LX.who(540, { dir: 2, k: 0.72 })); LX.person(g, 3.2, -17.4, 0, LX.who(541, { dir: 3, k: 0.7, pose: 'cheer', ph: 0.2 }));
  });
  // a tuk-tuk waiting for fares by the east wing, its driver leaning on it
  T.cast([16, 30], function (g) { g.at(16, 30, 0, (g2) => LX.tuk(g2, -Math.PI / 2, { col: '#3E9A6A', roof: { t: '#2E2A26', l: '#3A3530', r: '#2E2A26' } })); LX.person(g, 13.4, 31.6, 0, LX.who(545, { dir: 1, pose: 'stand', cap: '#2E2A26' })); });
  // the guide's group, walking round the statue behind her umbrella
  const loop = []; for (let k = 0; k < 12; k++) { const a = TAU * k / 12; loop.push([Math.cos(a) * 14, 2 + Math.sin(a) * 12]); }
  for (let i = 0; i < 6; i++) {
    const w = i === 0 ? LX.who(550, { top: '#E2483D', dress: undefined, hat: undefined }) : LX.who(550 + i);
    const A = LX.walker(T, w, loop, 0.95, { phase: 0.3 - i * 0.032 });
    if (i === 0) { const d = A.draw; A.draw = function (g, st) { d(g, st); const p = g.p(0, 0, 0); g.segs2([p[0] + 2.6, p[1] - 10, p[0] + 2.8, p[1] - 22], '#3A3530', 0.4); g.fill2(arcPts(p[0] + 2.8, p[1] - 21, 4.2, Math.PI, TAU, 10).concat([[p[0] + 7, p[1] - 20.4], [p[0] - 1.4, p[1] - 20.4]]), '#3F8FD2', true); }; }
  }
  // an ice-cream cart with two children waiting, a couple taking a selfie with the king behind them
  T.cast([-9, 22], function (g) {
    K.box(g, -10.6, 20.8, -7.4, 23.2, 0.9, 3.4, { t: '#F3F1EA', l: '#F6F3EC', r: '#DDD7CA' }, { w: 0.55, boil: false });
    K.sign(g, 'L', 23.2, -10.4, -7.6, 1.6, 2.6, '#E2483D', 'GELADOS', { ink: '#FBF8EE' });
    for (const x of [-10.2, -7.8]) { const w = g.p(x, 23.3, 0.6); g.ring2(w, 1.0, { w: 0.5, c: '#2E2A26' }); }
    const t = g.p(-9, 22, 3.4), u = g.p(-9, 22, 8.6); g.segs2([t[0], t[1], u[0], u[1]], '#5A4A3C', 0.4);
    const um = arcPts(u[0], u[1] + 2, 7, Math.PI, TAU, 10).concat([[u[0] + 7, u[1] + 3], [u[0] - 7, u[1] + 3]]); g.fill2(um, '#E2483D', true); for (let k = 1; k < 10; k += 2) { const a = arcPts(u[0], u[1] + 2, 7, Math.PI + Math.PI * k / 10, Math.PI + Math.PI * (k + 1) / 10, 2); g.fill2(a.concat([[u[0], u[1] + 2]]), '#F7F5EF', true); }
    LX.person(g, -11.4, 21.2, 0, LX.who(570, { dir: 0, pose: 'hold' }));
    LX.person(g, -8.0, 25.6, 0, LX.who(571, { dir: 2, k: 0.72 })); LX.person(g, -10.4, 26.0, 0, LX.who(572, { dir: 3, k: 0.68, pose: 'hold' }));
  }, { name: 'gelados' });
  T.cast([-2, 13], function (g) { LX.person(g, -2.6, 13, 0, LX.who(575, { dir: 1, pose: 'hold', reach: [-3, -13], phone: true })); LX.person(g, -0.8, 13.6, 0, LX.who(576, { dir: 1, pose: 'stand', dress: '#7FB7D9' })); });
  // people crossing the square, a child chasing the pigeons
  LX.walker(T, LX.who(560), [[-24, 34], [26, -14]], 1.2, { phase: 0.1 });
  LX.walker(T, LX.who(561), [[20, 33], [-17, -10]], 1.1, { phase: 0.5 });
  LX.walker(T, LX.who(562, { dress: '#F2C230' }), [[-24, 23], [24, 23]], 1.0, { phase: 0.7 });
  LX.walker(T, LX.who(563, { k: 0.7 }), [[16, 22], [6, 16], [12, 28]], 2.4, { phase: 0.2 });
  T.actor({ sample: 0.3, period: 6, at(t) { const f = Math.floor((t % 6) / 6 * 12); return { x: 11, y: 22, key: 'pg' + f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), R = RNG(7); for (let i = 0; i < 9; i++) { const ox = (R() - 0.5) * 16, oy = (R() - 0.5) * 6, fly = (st.f + i) % 12 < 3, p = [o[0] + ox + (fly ? 2 : 0), o[1] + oy - (fly ? 6 + i % 3 : 0)]; if (fly) g.segs2([p[0] - 1.2, p[1] - 0.6, p[0], p[1], p[0], p[1], p[0] + 1.2, p[1] - 0.6], '#6E6A64', 0.45); else { g.fill2([[p[0] - 0.9, p[1]], [p[0] + 0.9, p[1]], [p[0] + 0.6, p[1] - 0.9], [p[0] - 0.6, p[1] - 0.8]], '#8E8A84', true); g.disc2([p[0] + 0.7, p[1] - 1.1], 0.4, '#6E6A64'); } } } });
});
