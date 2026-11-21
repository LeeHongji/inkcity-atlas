'use strict';
/* (0,0) An Eixample block on Passeig de Gràcia (its lit front, y = +37, faces the Passeig).
   Built as an illa: perimeter houses round a hollow interior garden, every corner cut at 45°. Along the Passeig, left
   to right: Casa Lleó i Morera on the corner (cream stone, rounded bay windows, a domed rotunda on the corner),
   Casa Amatller (pink-ochre sgraffito, a stepped Flemish gable of red and gold tiles), Casa Batlló (the "house of
   bones": bone-like stone columns on the lower floors, a facade of blue-green trencadís with skull-mask balconies,
   the scaly dragon's back of a roof and the turret with its four-armed cross), an ordinary house, and on the near
   chamfer La Pedrera, Casa Milà: undulating cream stone with seaweed iron balconies, the warrior chimneys on its roof.
   The side on street x = 50 has modernista houses with shops (FARMÀCIA, FORN DE PA, …); the far wings show their
   courtyard galleries and roof terraces. The interior garden has a playground and trees.
   Who: the Batlló queue and a guide with an umbrella, shoppers with bags, Falqués's bench-lamps with people resting,
   tourists on La Pedrera's roof among the chimneys, someone hanging laundry on a terrat, kids in the courtyard. */
SF.tile('passeig', 0, 0, { rim: 24 }, function (T) {
  T.ground(function (g) {
    BC.ground(g, '#E3DCCB');
    // the interior garden: gravel, a lawn, a sandpit
    g.fill(K.rect(-23, -23, 18, 18), '#E2D6B8'); g.scuff(K.rect(-23, -23, 18, 18), { dir: -0.6, len: 2.5, c: '#EEE4CC', dens: 0.5, w: 0.45, spread: 0.6 });
    K.lawn(g, -20, -20, -2, 2, { col: '#B7CC8E' });
    g.fill(K.curve([[2, -16, 0], [12, -18, 0], [15, -10, 0], [8, -6, 0], [1, -9, 0]], 4, true), '#EEDDB0');
  }, { rim: true });

  const HOUSE = (poly, z, seed, o) => T.obj(BC.bbox(poly), (g) => BC.house(g, Object.assign({ poly, z, seed }, o || {})), { name: 'house' });
  /* ---- far wings: their courtyard faces (galleries) and roofs ---- */
  HOUSE([[-27, -37], [-6, -37], [-6, -23], [-37, -23], [-37, -27]], 21, 11, { shops: () => null, col: '#E9D6B0' });
  HOUSE([[-6, -37], [12, -37], [12, -23], [-6, -23]], 22.5, 12, { shops: () => null, col: '#EAD0A8' });
  HOUSE([[12, -37], [27, -37], [30, -34], [30, -23], [12, -23]], 20, 13, { shops: () => null, col: '#E6DCC4' });
  HOUSE([[23, -23], [30, -23], [30, -8], [23, -8]], 20, 19, { shops: () => null, col: '#E9D6B0' });
  HOUSE([[-37, -23], [-23, -23], [-23, -2], [-37, -2]], 21.5, 14, { shops: () => null, col: '#ECD9B8' });
  HOUSE([[-37, -2], [-23, -2], [-23, 23], [-37, 23]], 20.5, 15, { shops: () => null, col: '#E4C9A2' });

  /* ---- the side on street x = 50: shops ---- */
  HOUSE([[30, -34], [37, -27], [37, -8], [30, -8]], 21, 16, { col: '#EAD9B6', flags: 0.2, closedP: 0.12, bay: 2.4 });
  HOUSE([[23, -8], [37, -8], [37, 7], [23, 7]], 22, 17, { col: '#E8C9A6', flags: 0.25, tribune: [1, 4, 11] });
  HOUSE([[23, 7], [37, 7], [37, 18], [23, 18]], 20, 18, { col: '#EFE0C2', flags: 0.2 });

  /* ---- Casa Lleó i Morera on the left corner ---- */
  T.obj([-37, 23, -20, 37], function (g) {
    const poly = [[-37, 23], [-20, 23], [-20, 37], [-27, 37], [-37, 27]], Z = 21;
    const F = BC.house(g, { poly, z: Z, seed: 21, col: '#F1E6CF', bay: 2.8, flags: 0.3, curvy: true, tribune: [2, 2, 6], tribColor: '#F4ECDA', roofItems: false });
    // the rotunda on the corner: a round tower of bay windows, a little dome
    K.cyl(g, -31.5, 31.5, 2.8, 4.6, Z + 1, { t: '#F4ECDA', l: '#F1E6CF', r: '#DCCDB0' }, { w: 0.8, n: 16 });
    for (let z = 6; z < Z; z += 3.3) for (let i = 0; i < 3; i++) { const a = Math.PI * (0.2 + i * 0.22), c = [-31.5 + Math.cos(a) * 2.85, 31.5 + Math.sin(a) * 2.85]; g.fill([[c[0] - 0.5, c[1] + 0.5, z], [c[0] + 0.5, c[1] - 0.5, z], [c[0] + 0.5, c[1] - 0.5, z + 2.1], [c[0] - 0.5, c[1] + 0.5, z + 2.1]], BP.pane); }
    K.cyl(g, -31.5, 31.5, 3.1, Z + 1, Z + 1.6, '#F4ECDA', { w: 0.6, n: 16 });
    const cols = []; for (let i = 0; i < 5; i++) { const a = Math.PI * (0.05 + i * 0.22), b = g.p(-31.5 + Math.cos(a) * 2.4, 31.5 + Math.sin(a) * 2.4, Z + 1.6), t2 = g.p(-31.5 + Math.cos(a) * 2.4, 31.5 + Math.sin(a) * 2.4, Z + 4.2); cols.push(b[0], b[1], t2[0], t2[1]); } g.segs2(cols, '#F4ECDA', 0.9);
    K.dome(g, -31.5, 31.5, 2.8, Z + 4.2, 3.0, '#E2D7BE', { w: 0.7, shadow: '#C9BB9C', ribs: 8, ribCol: '#B8A988', ribW: 0.3 });
    const t = g.p(-31.5, 31.5, Z + 7.2); g.disc2([t[0], t[1] - 1], 0.8, '#D8AE48');
    // carved flowers over the windows: little rosettes
    for (const f of F) if (f.vis && f.L > 3) for (let a = 1.4; a < f.L - 1; a += 2.8) { const c = g.p.apply(g, f.P(a, 15.6, 0.05)); g.disc2(c, 0.7, '#E2C9A0'); g.disc2(c, 0.3, '#C9A06A'); }
  }, { name: 'lleo morera' });

  /* ---- Casa Amatller: sgraffito and the stepped gable ---- */
  T.obj([-20, 23, -8, 37], function (g) {
    const poly = [[-20, 23], [-8, 23], [-8, 37], [-20, 37]], Z = 20.5, col = '#EDC7AE';
    const F = BC.house(g, { poly, z: Z, seed: 22, col, bay: 3.0, flags: 0.2, roofItems: false, shut: '#8A5A3A', shops: (f, i, n) => (i === 1 ? 'door' : 'shop') });
    const f = F.find((q) => q.n[1] > 0.5);
    // sgraffito: a field of small ornament marks on the upper wall
    const sg = []; for (let z = 9; z < Z - 1; z += 1.1) for (let a = 0.6; a < f.L - 0.4; a += 1.1) { const c = g.p.apply(g, f.P(a + ((z * 7) % 2) * 0.5, z, 0.04)); sg.push(c[0] - 0.4, c[1], c[0] + 0.4, c[1] - 0.4); } g.segs2(sg, '#D9A88A', 0.3);
    // the stepped gable on the front: steps of red and gold glazed tile
    const st = [[0, Z + 1], [0.9, Z + 1], [0.9, Z + 2.4], [2.2, Z + 2.4], [2.2, Z + 3.9], [3.6, Z + 3.9], [3.6, Z + 5.6], [5.0, Z + 5.6], [5.0, Z + 7.3], [7.0, Z + 7.3], [7.0, Z + 5.6], [8.4, Z + 5.6], [8.4, Z + 3.9], [9.8, Z + 3.9], [9.8, Z + 2.4], [11.1, Z + 2.4], [11.1, Z + 1], [12, Z + 1]];
    const pts = st.map(([a, z]) => f.P(f.L - a, z, 0)); pts.push(f.P(0, Z + 0.9, 0), f.P(f.L, Z + 0.9, 0));
    g.fill(pts.slice(0, st.length).concat([f.P(0, Z + 1, 0), f.P(f.L, Z + 1, 0)]).reverse(), col);
    for (let r = 0; r < 4; r++) { const z0 = Z + 1.6 + r * 1.5; g.fill(f.q(1.6 + r * 1.3, f.L - 1.6 - r * 1.3, z0, z0 + 0.5, 0.03), r % 2 ? '#C9584B' : '#D8AE48'); }
    g.line(st.map(([a, z]) => f.P(f.L - a, z, 0)), { w: 0.7, boil: false });
    const c = g.p.apply(g, f.P(f.L / 2, Z + 8.4, 0)); g.disc2(c, 0.6, '#D8AE48');
  }, { name: 'amatller' });

  /* ---- Casa Batlló ---- */
  T.obj([-8, 23, 6, 37], function (g) {
    g.boilP = 0.2;
    const x0 = -8, x1 = 6, y1 = 37, Z = 20, R = RNG(2306);
    const tones = { t: '#E9E2D2', l: '#DCD8D4', r: '#C9C3BC' };
    K.box(g, x0, 23, x1, y1, 0, Z, tones, { w: 0.9 });
    const f = BC.faces([[x0, 23], [x1, 23], [x1, y1], [x0, y1]]).find((q) => q.n[1] > 0.5);   // runs from x1 to x0 (right to left)
    // the trencadís wall of the upper floors: a pale blue-green field speckled with glass and ceramic discs
    g.fill(f.q(0, f.L, 9.4, Z, 0.02), '#BFD3D6');
    const dots = []; for (let i = 0; i < 150; i++) { const a = R() * f.L, z = 9.6 + R() * (Z - 10); dots.push([g.p.apply(g, f.P(a, z, 0.04)), R.pick(['#7FB0C4', '#9AC7B4', '#D9A6C4', '#E9D27A', '#6F98B8', '#F3F1EA', '#A7C79A'])]); }
    for (const [c, col] of dots) g.fill2([[c[0] - 0.45, c[1] - 0.2], [c[0] + 0.4, c[1] - 0.4], [c[0] + 0.35, c[1] + 0.35], [c[0] - 0.3, c[1] + 0.3]], col, true);
    for (let i = 0; i < 14; i++) { const c = g.p.apply(g, f.P(0.8 + R() * (f.L - 1.6), 10 + R() * (Z - 11), 0.05)); g.disc2(c, 0.85, R.pick(['#E9D27A', '#7FB0C4', '#D98AA4', '#9AC7B4'])); g.ring2(c, 0.85, { w: 0.2, c: '#6E7E8C' }); }
    // the lower floors in grey stone: wide organic windows between the bone columns
    g.fill(f.q(0, f.L, 0, 9.4, 0.02), '#D8D0C2');
    const cols = [0.6, 3.4, 6.2, 9.0, 11.8, 13.4];
    for (let i = 0; i + 1 < cols.length; i++) {
      const a0 = cols[i] + 0.35, a1 = cols[i + 1] - 0.35, m = (a0 + a1) / 2, w = (a1 - a0) / 2, op = [];
      for (let k = 0; k <= 12; k++) { const t = TAU * k / 12; op.push(f.P(m + Math.cos(t) * w, 6.2 + Math.sin(t) * 2.4 * (Math.sin(t) > 0 ? 1.15 : 0.9), 0.04)); }
      g.fill(op, '#4E5A62'); g.line(op, { w: 0.35, c: '#7A7466', boil: false, close: true });
      g.fill(f.q(a0 + 0.2, a1 - 0.2, 0.2, 3.4, 0.04), i === 2 ? '#5A4632' : '#C9DCE2');
    }
    for (const a of cols) { const b0 = g.p.apply(g, f.P(a, 0, 0.1)), b1 = g.p.apply(g, f.P(a, 4.2, 0.1)), b2 = g.p.apply(g, f.P(a, 9.2, 0.1)); g.line2(K.curve([b0, [b1[0] + 0.5, b1[1]], [b1[0] - 0.4, b1[1] - 3], b2], 3, false), { w: 1.6, c: '#EFE9DC', boil: false, ext: 0 }); g.disc2([b1[0] + 0.2, b1[1] - 1.5], 0.9, '#EFE9DC'); g.line2([b0, b2], { w: 0.25, c: '#A39A88', boil: false }); }
    // windows of the upper floors with the skull-mask balconies
    for (let z = 10.6; z < Z - 2; z += 3.0) for (let i = 0; i < 4; i++) {
      const m = 1.9 + i * 3.4, op = f.q(m - 0.8, m + 0.8, z, z + 2.3, 0.04); g.fill(op, '#4E5A62');
      const mk = []; for (let k = 0; k <= 10; k++) { const t = Math.PI * k / 10; mk.push(g.p.apply(g, f.P(m + Math.cos(t) * 1.2, z + 0.25 + Math.sin(t) * 1.1, 0.6))); }
      mk.push(g.p.apply(g, f.P(m - 1.2, z - 0.2, 0.6)), g.p.apply(g, f.P(m + 1.2, z - 0.2, 0.6)));
      g.fill2(mk, '#F1ECE0', true); g.outline2(mk, { w: 0.3, c: '#8C8576', boil: false });
      for (const d of [-0.45, 0.45]) g.disc2(g.p.apply(g, f.P(m + d, z + 0.7, 0.62)), 0.32, '#3A3530');
    }
    // the roof: the dragon's back, a hump of scales shading from green to blue to rose, white bulbs along the spine
    const hump = (a, h) => Z + 0.4 + h * Math.sin(Math.PI * clamp(a / f.L, 0, 1));
    const sk = []; for (let k = 0; k <= 16; k++) { const a = f.L * k / 16; sk.push(f.P(a, hump(a, 5.5), -3)); }
    const front = []; for (let k = 0; k <= 16; k++) { const a = f.L * k / 16; front.push(f.P(a, hump(a, 3.0), 0)); }
    g.fill(front.concat(sk.slice().reverse()), '#7FB09C');
    for (let r = 0; r < 4; r++) for (let k = 0; k < 16; k++) { const a = f.L * (k + 0.5) / 16, t = (r + 0.5) / 4, c = g.p.apply(g, f.P(a, lerp(hump(a, 3.0), hump(a, 5.5), t), -3 * t)); g.fill2(arcPts(c[0], c[1], 1.1, 0, Math.PI, 5), ['#6FA894', '#7FA7C4', '#B79AC0', '#D9A6B4'][(r + (k > 8 ? 1 : 0)) % 4], true); }
    g.line(front, { w: 0.7, boil: false }); g.line(sk, { w: 0.6, c: '#4F6E64', boil: false });
    for (let k = 1; k < 16; k += 2) { const a = f.L * k / 16; g.disc2(g.p.apply(g, f.P(a, hump(a, 5.5) + 0.3, -3)), 0.75, '#F3EFE4'); }
    // the turret with the four-armed cross
    const tp = f.P(f.L - 2.0, 0, -2.5);
    K.cyl(g, tp[0], tp[1], 1.3, Z, Z + 7, { t: '#EFE9DC', l: '#E9DDC4', r: '#CFC2A6' }, { w: 0.6, n: 10 });
    const tb = g.p(tp[0], tp[1], Z + 7.6); g.disc2(tb, 1.4, '#D8C7A0'); g.ring2(tb, 1.4, { w: 0.35, c: '#7A6A4A' });
    g.segs2([tb[0], tb[1] - 1.4, tb[0], tb[1] - 5.2, tb[0] - 1.8, tb[1] - 3.6, tb[0] + 1.8, tb[1] - 3.6], '#D8AE48', 0.9);
    g.disc2([tb[0], tb[1] - 5.4], 0.5, '#D8AE48');
  }, { name: 'batllo' });

  /* ---- an ordinary house, then La Pedrera on the near chamfer ---- */
  HOUSE([[6, 23], [18, 23], [18, 37], [6, 37]], 21, 23, { col: '#EADCC0', flags: 0.3, tribune: [2, 3, 9] });
  T.obj([18, 18, 37, 37], function (g) {
    g.boilP = 0.18;
    const poly = [[18, 18], [37, 18], [37, 27], [27, 37], [18, 37]], Z = 21, ST = { t: '#F2EBDD', l: '#EDE3D0', r: '#D9CCB4' };
    const F = BC.prism(g, poly, 0, Z, ST, { w: 0.9, nt: true });
    const R = RNG(2401);
    for (const f of F) {
      if (!f.vis) continue;
      // storey bands that swell and dip: the undulating stone, with sinuous openings between and seaweed iron balconies
      const wav = (a, k) => 1.1 * Math.sin(a * 0.62 + k * 1.3) + 0.35 * Math.sin(a * 1.7 + k);
      for (let k = 0; k < 6; k++) {
        const zb = 1.5 + k * 3.3, n = Math.max(2, Math.round(f.L / 3.1));
        for (let i = 0; i < n; i++) {
          const a0 = f.L * i / n + 0.55, a1 = f.L * (i + 1) / n - 0.55, op = [];
          for (let j = 0; j <= 6; j++) { const a = lerp(a0, a1, j / 6); op.push(f.P(a, zb + 0.5 + wav(a, k) * 0.4, 0.03)); }
          for (let j = 6; j >= 0; j--) { const a = lerp(a0, a1, j / 6); op.push(f.P(a, zb + 2.6 + wav(a, k + 1) * 0.3 - Math.pow((j / 6 - 0.5) * 2, 2) * 0.35, 0.03)); }
          g.fill(op, '#525C62');
          if (k > 0) { const ir = []; for (let j = 0; j < 9; j++) { const a = lerp(a0 + 0.1, a1 - 0.1, j / 8), c = g.p.apply(g, f.P(a, zb + 0.55 + wav(a, k) * 0.4 + R() * 0.9, 0.5)); ir.push(c); } g.line2(ir, { w: 0.55, c: '#2E3230', boil: false, wob: 1.6 }); for (let j = 0; j < 3; j++) { const c = ir[1 + j * 3]; g.segs2([c[0], c[1], c[0] + (R() - 0.5) * 2, c[1] - 1.6, c[0], c[1], c[0] + (R() - 0.5) * 2.4, c[1] + 1.2], '#2E3230', 0.35); } }
        }
        const band = []; for (let j = 0; j <= 20; j++) { const a = f.L * j / 20; band.push(f.P(a, zb + 0.35 + wav(a, k) * 0.4, 0.06)); }
        g.line(band, { w: 0.4, c: '#BFB29A', boil: false });
      }
      // the wavy top edge
      const top = []; for (let j = 0; j <= 20; j++) { const a = f.L * j / 20; top.push(f.P(a, Z + 1.0 + Math.sin(a * 0.55 + f.i) * 1.3, 0)); }
      g.fill(top.concat([f.P(f.L, Z, 0), f.P(0, Z, 0)]), '#EDE3D0'); g.line(top, { w: 0.8, boil: false });
    }
    g.fill(poly.map((p) => [p[0], p[1], Z + 0.8]), '#E9DFC9');
    g.outline(poly.map((p) => [p[0], p[1], Z + 0.8]), { w: 0.55, c: '#8A7A5A', boil: false });
    // the roof: the stair towers and the warrior chimneys (stone, and some clad in trencadís)
    const ch = [[21, 21, 1.3, 5.5, '#E2D6BE'], [26, 22, 0.9, 4.6, '#E8DCC4'], [31, 22.5, 1.2, 5.8, '#E2D6BE'], [22, 27, 0.9, 4.2, '#9AC4A8'], [21, 33, 1.0, 4.8, '#E8DCC4'], [27, 30, 1.4, 6.2, '#E2D6BE'], [33, 26, 0.85, 4.0, '#E8DCC4']];
    for (const [x, y, r, h, col] of ch) {
      K.cyl(g, x, y, r, Z + 0.8, Z + 0.8 + h * 0.7, { t: col, l: col, r: shade(col, 0.12) }, { w: 0.55, n: 8 });
      const t = g.p(x, y, Z + 0.8 + h * 0.7), hw = r * SX * 1.1;
      g.fill2([[t[0] - hw, t[1]], [t[0] + hw, t[1]], [t[0] + hw * 0.4, t[1] - h * 1.1], [t[0], t[1] - h * 1.3], [t[0] - hw * 0.4, t[1] - h * 1.1]], col, true);
      g.fill2([[t[0] - hw * 0.5, t[1] - h * 0.6], [t[0] + hw * 0.5, t[1] - h * 0.6], [t[0] + hw * 0.5, t[1] - h * 0.4], [t[0] - hw * 0.5, t[1] - h * 0.4]], '#5A5F62', true);   // the warrior's eye slit
      g.line2([[t[0] - hw, t[1]], [t[0] - hw * 0.4, t[1] - h * 1.1], [t[0], t[1] - h * 1.3], [t[0] + hw * 0.4, t[1] - h * 1.1], [t[0] + hw, t[1]]], { w: 0.45, c: '#6E6450', boil: false });
    }
  }, { name: 'pedrera' });

  /* ---- the pavements: trees, bench-lamps, the chamfer furniture ---- */
  BC.block(T, { skip: { 'y+': [[-24, 24]], 'x+': [[16, 40]] }, corners: { nn: 'bins', pn: 'bicing', np: 'motos', pp: 'none' } });
  for (const x of [-30, 14]) T.obj([x, 41.5], (g) => BC.benchLamp(g, x, 41.5, 'x'), { name: 'bench-lamp' });

  /* ---- the interior garden ---- */
  for (const [x, y, r] of [[-17, -12, 3.6], [-6, -17, 3.4], [-15, 8, 3.8], [9, -1, 3.2], [-2, 10, 3.0]]) T.obj([x, y], (g) => BC.plane(g, x, y, { r, h: 6.2 }), { name: 'yard tree' });
  T.obj([4, -14, 8, -10], (g) => { const a = g.p(4.5, -13.5, 0), b = g.p(4.5, -13.5, 4.5), c = g.p(7.5, -10.5, 4.5), d = g.p(7.5, -10.5, 0); g.segs2([a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1], c[0], c[1], d[0], d[1]], '#C9584B', 0.7); g.segs2([lerp(b[0], c[0], 0.3), lerp(b[1], c[1], 0.3), lerp(b[0], c[0], 0.3), lerp(b[1], c[1], 0.3) + 8], '#4A4540', 0.25); }, { name: 'swing' });

  /* ---- people ---- */
  // the queue for Casa Batlló along the pavement, a guide with an umbrella
  for (let i = 0; i < 9; i++) { const x = 4.8 - i * 1.55, y = 39.4 + (i % 2) * 0.5; T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(2500 + i, { dir: i % 4 === 3 ? 1 : 0, pose: i % 3 === 0 ? 'hold' : 'stand', phone: i % 3 === 0 })), {}); }
  T.cast([8.4, 40.6], (g) => { const r = BC.person(g, 8.4, 40.6, 0, BC.who(2510, { dir: 1, pose: 'stand', hands: [[2.4, -18], [1.0, -10]] })); const h = r.hands[0], t = [h[0] + 0.6, h[1] - 7]; g.segs2([h[0], h[1], t[0], t[1]], '#3A3530', 0.4); g.fill2(arcPts(t[0], t[1] + 1.2, 3.0, Math.PI, TAU, 8), '#E6C24F', true); }, {});
  // people resting on the bench-lamps
  T.cast([-29, 41.0], (g) => { BC.person(g, -29.2, 41.0, 1.4, BC.who(2520, { dir: 1, pose: 'sit' })); BC.person(g, -30.8, 41.1, 1.4, BC.who(2521, { dir: 1, pose: 'sit', bag: '#C9584B' })); }, { bias: 1 });
  // shoppers along the Passeig
  BC.walker(T, BC.who(2530, { bag: '#E9DFC6' }), [[-34, 39.8], [33, 39.8]], 1.3, { phase: 0.2 });
  BC.walker(T, BC.who(2531, { bag: '#2F3A4F' }), [[33, 40.4], [-34, 40.4]], 1.2, { phase: 0.6 });
  BC.walker(T, BC.who(2532), [[40, -30], [40, 30]], 1.4, { phase: 0.3 });
  // tourists on La Pedrera's roof walking among the chimneys
  BC.walker(T, BC.who(2540, { cap: '#3F5F8F' }), [[20, 24], [29, 25], [24, 31]], 0.9, { phase: 0.1, z: 21.8 });
  BC.walker(T, BC.who(2541), [[33, 21], [24, 20], [20, 29]], 0.8, { phase: 0.5, z: 21.8 });
  T.cast([29.5, 27.5], (g) => BC.person(g, 29.5, 27.5, 21.8, BC.who(2542, { dir: 0, pose: 'hold', phone: true })), { on: true });
  // a terrat: someone hanging laundry, a couple with a vermouth
  T.cast([-30, -12], (g) => BC.person(g, -30, -12, 22.4, BC.who(2550, { dir: 1, pose: 'stand', hands: [[2, -19], [3, -18]] })), { on: true });
  T.cast([2, -30], (g) => { BC.person(g, 1, -30, 23.4, BC.who(2551, { dir: 1, pose: 'stand' })); BC.person(g, 3, -29, 23.4, BC.who(2552, { dir: 2, pose: 'hold' })); }, { on: true });
  // kids in the courtyard, a grandfather on a bench
  BC.walker(T, BC.who(2560, { k: 0.72 }), [[-16, -6], [-6, -6], [-6, -16], [-16, -16]], 1.6, { phase: 0.0 });
  BC.walker(T, BC.who(2561, { k: 0.7, hairStyle: 'pony' }), [[-14, -4], [-4, -4], [-4, -14], [-14, -14]], 1.7, { phase: 0.45 });
  T.cast([6, 2], (g) => { K.bench(g, 6, 2, { face: 'R', L: 2.2 }); BC.person(g, 7.1, 2, 1.3, BC.who(2562, { dir: 0, pose: 'sit', hair: '#C9C6BD' })); }, {});
});
