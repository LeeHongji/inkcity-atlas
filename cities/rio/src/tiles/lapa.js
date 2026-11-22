'use strict';
/* (0,0) Lapa and the edge of Santa Teresa.
   Built: the Arcos da Lapa — the old Carioca aqueduct, two tiers of white round arches on square piers with a deck on
   top that now carries the Santa Teresa tram — running along x from the Santa Teresa plateau (a hill held up by a
   tall stone retaining wall, villas and gardens on top) to the tram station at the other end. The Selarón Steps climb
   the plateau's wall from the square: every riser and both side walls covered in tiles, mostly red with yellow, green
   and blue. Largo da Lapa below: Portuguese stone, a big fig tree, colonial two-storey fronts (tall doors, iron
   balconies, pastel walls) along the near edges with their bars.
   Who: the yellow bonde shuttling across the arches with kids hanging off its running board; tourists posing and
   sitting on the steps; a roda de samba round a table (cavaquinho, pandeiro, surdo) with couples dancing; a capoeira
   ring with a berimbau; caipirinha carts; revellers in costume; people at the bar doors. */
SF.tile('lapa', 0, 0, { rim: 26 }, function (T) {
  const PZ = 13.2, AY0 = -24, AY1 = -20, AX0 = -14, AX1 = 30, BAY = 4.4;
  const WHITE = { t: '#EFEDE6', l: '#F6F4EE', r: '#DCD8CD' };

  T.ground(function (g) {
    K.slab(g, 37, { top: '#ECE7DA' });
    RJ.mosaic(g, -13, -19, 37, 37, { sp: 2.6, skip: (x, y) => y > 27 && x < 23 });
    g.fill(K.rect(-37, 27, 23, 37), '#E2DCCD');
    // tram rails in the cobbles from the arches' end to the station
  }, { rim: true });

  /* ---------------- Santa Teresa: the plateau on its retaining wall ---------------- */
  T.obj([-37, -37, -14, -14], function (g) {
    g.boilP = 0.2;
    K.box(g, -37, -37, -14, -14, 0, PZ, { t: '#B9CC8A', l: '#C9BFA9', r: '#AFA48D' }, { w: 1 });
    // stone courses on the wall faces, and plants spilling over the top
    const seg = [];
    for (let z = 1.2; z < PZ; z += 1.2) for (const [f, p, a0, a1] of [['L', -14, -37, -14], ['R', -14, -37, -14]]) { const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z)); seg.push(a[0], a[1], b[0], b[1]); }
    g.segs2(seg, '#A69B84', 0.3);
    const R = RNG(4401);
    for (let i = 0; i < 26; i++) { const onL = i % 2 === 0, a = lerp(-36, -15, R()), p = onL ? g.p(a, -14, PZ - R() * 3) : g.p(-14, a, PZ - R() * 3), r = 2 + R() * 2.4; g.fill2(arcPts(p[0], p[1], r, 0, TAU, 8).map((q) => [q[0], p[1] + (q[1] - p[1]) * 0.8]), R() < 0.5 ? '#6E9C52' : '#5E8F4E'); }
    g.grass(K.rect(-37, -37, -14, -14, PZ), { dens: 0.5 });
    // the garden path and the tram track running on to the hill
    g.line([[-37, -22, PZ], [-14, -22, PZ]], { w: 0.4, c: '#5A564E', boil: false }); g.line([[-37, -21.2, PZ], [-14, -21.2, PZ]], { w: 0.4, c: '#5A564E', boil: false });
  }, { name: 'santa teresa' });
  const VILLAS = [[-36, -36, -27, -27, '#F0B9A0', 4410], [-25, -36, -16, -28, '#CFE3D8', 4411], [-35, -18.6, -27, -14.6, '#F3E3B8', 4412]];
  for (const [x0, y0, x1, y1, c, s] of VILLAS) T.obj([x0, y0, x1, y1], (g) => {
    K.box(g, x0, y0, x1, y1, PZ, PZ + 6.4, c, { w: 0.8 });
    RJ.colonial(g, 'L', y1, x0 + 0.4, x1 - 0.4, PZ, PZ + 6.2, c, s); RJ.colonial(g, 'R', x1, y0 + 0.4, y1 - 0.4, PZ, PZ + 6.2, c, s + 1);
    K.hip(g, x0 - 0.6, y0 - 0.6, x1 + 0.6, y1 + 0.6, PZ + 6.4, 2.4, '#C9704F');
  }, { name: 'casarão', on: true });
  T.obj([-19, -17], (g) => K.tree(g, -19, -17, { r: 4.2, h: 5, z: PZ, col: '#5E8F4E' }), { on: true });

  /* ---------------- the Arcos da Lapa: pieces of two bays, people pass under them ---------------- */
  const piers = []; for (let x = AX0 + 0.7; x <= AX1 + 0.01; x += BAY) piers.push(x);
  for (let pi = 0; pi < piers.length - 1; pi += 2) {
    const xa = pi === 0 ? AX0 : piers[pi] - 0.7, xb = Math.min(piers[Math.min(pi + 2, piers.length - 1)] - 0.7, AX1 + 1.4);
    T.obj([xa, AY0 - 0.3, xb, AY1 + 0.3], function (g) {
      g.boilP = 0.2;
      const ps = piers.filter((x) => x >= xa - 0.01 && x < xb - 0.01);
      for (const px of ps) {
        // the pier and, beside it towards +x, the bay's spandrels over the two round arches
        K.box(g, px - 0.75, AY0, px + 0.75, AY1, 0, PZ - 1.0, WHITE, { w: 0.7, nb: false });
        const nx = px + BAY; if (nx > AX1 + 0.8) continue;
        for (const [zs, zt] of [[5.4, 7.9], [9.6, PZ - 1.0]]) {
          const c = (px + nx) / 2, r = (nx - px - 1.5) / 2, pts = [[px + 0.75, AY1, zt], [px + 0.75, AY1, zs]];
          for (let k = 0; k <= 10; k++) { const a = Math.PI - Math.PI * k / 10; pts.push([c + Math.cos(a) * r, AY1, zs + Math.sin(a) * r]); }
          pts.push([nx - 0.75, AY1, zs], [nx - 0.75, AY1, zt]);
          g.fill(pts, WHITE.l); g.line(pts.slice(1, -1), { w: 0.55, boil: false });
          // the soffit: a sliver of the arch's underside seen through the opening
          const so = []; for (let k = 0; k <= 10; k++) { const a = Math.PI - Math.PI * k / 10; so.push([c + Math.cos(a) * r, AY1, zs + Math.sin(a) * r]); } for (let k = 10; k >= 0; k--) { const a = Math.PI - Math.PI * k / 10; so.push([c + Math.cos(a) * r, AY1 - 0.9, zs + Math.sin(a) * r - 0.05]); }
          g.fill(so, '#D9D4C8');
        }
        g.fill(K.on('L', AY1 + 0.02, px + 0.75, nx - 0.75, 7.9, 8.4), '#E6E2D7');
      }
      // the deck with its parapet and the tram rails
      K.box(g, xa, AY0 - 0.3, xb, AY1 + 0.3, PZ - 1.0, PZ, WHITE, { w: 0.8 });
      g.fine([[xa, AY1 + 0.25, PZ + 0.7], [xb, AY1 + 0.25, PZ + 0.7]], { w: 0.4, c: '#8C8576' });
      g.line([[xa, -22, PZ], [xb, -22, PZ]], { w: 0.35, c: '#5A564E', boil: false }); g.line([[xa, -21.2, PZ], [xb, -21.2, PZ]], { w: 0.35, c: '#5A564E', boil: false });
      // at night the arches are floodlit white from projectors at the piers' feet (RioLuz's permanent lighting, 2026), the
      // soffits glowing deeper in the openings
      RJ.flood(g, 0, 1.2, '#FFE9C4', (c, d) => (d.k === K_FILL && c === '#D9D4C8' ? '#D9B98A' : undefined));
      for (const px of ps) g.glow2('lantern', g.p(px + 0.2, AY1 + 0.9, 0.6), g.p(px, AY1 + 2.5, 0), { r: 1.7, col: '#FFEBC8' });
    }, { name: 'arcos', under: PZ });
  }
  // the tram station at the far end of the arches
  T.obj([AX1 + 1.4, -27, 37, -17], function (g) {
    K.box(g, AX1 + 1.4, -27, 37, -17, 0, PZ, { t: '#E9E4D6', l: '#F3E3B8', r: '#E2CFA2' }, { w: 0.9 });
    for (let z = 1; z < PZ - 2; z += 4) K.win(g, 'L', -17, AX1 + 2.4, 36, z, z + 2.4, { style: 'navy', arch: true });
    K.box(g, AX1 + 1, -27.4, 37.4, -16.6, PZ, PZ + 0.6, '#C9704F', { w: 0.6 });
    RJ.litSign(g, 'L', -17, AX1 + 2, 36.6, PZ - 1.8, PZ - 0.5, '#2F5A3A', 'BONDE');
    RJ.flood(g, 0, 0.6, '#F5D29A'); for (const a of [AX1 + 2.6, 35.8]) RJ.wallLamp(g, 'L', -17, a, 4.6, 1.1);
  }, { name: 'estação' });

  /* ---------------- the Selarón Steps ---------------- */
  const SX0 = -33, SX1 = -27.5, SY0 = 7, SY1 = -14, NS = 24;
  const TILE = ['#D9302B', '#D9302B', '#E04A3A', '#F2C230', '#2F6DB5', '#3A9A5B', '#D9302B', '#F3F1EA'];
  T.obj([SX0 - 1, SY1, SX1 + 1, SY0], function (g) {
    g.boilP = 0.2;
    const run = (SY0 - SY1) / NS, rise = PZ / NS, R = RNG(4420);
    // the right-hand side wall first (it runs the whole flight), then the steps from the top down
    const wall = [[SX1, SY0, 0], [SX1, SY0, 1.6], [SX1, SY1, PZ + 1.6], [SX1, SY1, 0]];
    for (let i = 0; i < NS; i++) {
      const y = SY1 + i * run, z = PZ - i * rise;
      K.box(g, SX0, y, SX1, y + run, 0, z, { t: '#B9AFA0', l: TILE[i % TILE.length], r: '#9E9282' }, { w: 0.4, nb: true });
      // tiles on the riser: little squares in mixed colours
      const tl = []; for (let k = 0; k < 6; k++) { const a = SX0 + 0.3 + k * 0.9, q = K.on('L', y + run + 0.02, a, a + 0.7, z - rise + 0.06, z - 0.06); g.fill(q, R.pick(TILE)); void tl; }
    }
    g.fill(wall, '#D9302B');
    // the side wall's mosaic: a field of coloured tiles
    for (let k = 0; k < 120; k++) { const t = R(), y = lerp(SY0, SY1, t), ztop = lerp(1.6, PZ + 1.6, t), z = R() * (ztop - 0.6), q = [[SX1 + 0.02, y - 0.35, z], [SX1 + 0.02, y + 0.35, z], [SX1 + 0.02, y + 0.35, z + 0.55], [SX1 + 0.02, y - 0.35, z + 0.55]]; g.fill(q, R.pick(TILE)); }
    g.outline(wall, { w: 0.7, boil: false });
    g.line([[SX0, SY1, PZ + 1.6], [SX0, SY0, 1.6]], { w: 0.5, boil: false });
    // at night lamps on the side wall light the flight, the tiles keeping their colours
    RJ.lit(g, 0, 0.5);
    for (const t of [0.12, 0.42, 0.72]) { const y = lerp(SY0, SY1, t), z = lerp(1.6, PZ + 1.6, t); g.glow('lamp', SX1 + 0.5, y, z + 0.6, { r: 1.2, base: lerp(0, PZ, t) }); }
  }, { name: 'escadaria selarón' });
  // tourists posing and sitting on the steps
  const STEP = (t) => [lerp(SX0 + 1, SX1 - 1, 0.5), lerp(SY0, SY1, t), lerp(0, PZ, t) + 0.05];
  for (const [t, dx, s, pose, d] of [[0.25, -1.2, 4430, 'sit', 1], [0.42, 1.0, 4431, 'wave', 1], [0.6, -1.0, 4432, 'sit', 1], [0.78, 0.8, 4433, 'stand', 1], [0.12, 1.4, 4434, 'hold', 3]]) {
    const p = STEP(t); T.cast([p[0] + dx, p[1]], (g) => RJ.person(g, p[0] + dx, p[1], p[2], Object.assign(RJ.who(s), { dir: d, pose, phone: pose === 'hold', ph: 0.3 })), { on: true });
  }
  T.cast([-30, 10], (g) => RJ.person(g, -30, 10.5, 0, Object.assign(RJ.who(4436), { dir: 2, pose: 'hold', phone: true })), {});

  /* ---------------- the bonde on the arches ---------------- */
  const BX0 = -33, BX1 = AX1 - 1, BP = 40;
  T.actor({ sample: 0.25, period: BP, grow: false,
    at(t) {
      const u = ((t / BP) % 1 + 1) % 1, f = u < 0.12 ? 0 : u < 0.5 ? smooth((u - 0.12) / 0.38) : u < 0.62 ? 1 : 1 - smooth((u - 0.62) / 0.38);
      const x = lerp(BX0, BX1, f), dir = u < 0.5 ? 1 : -1, ph = Math.floor((t * 2) % 1 * 4);
      return { x: x + 5.6, y: -19.6, z: PZ, key: dir + '.' + ph, dir, ph: ph / 4 };
    },
    draw(g, st) { g.at(-5.6, -2.0, 0, (g2) => RJ.bonde(g2, st.dir > 0 ? 0 : Math.PI, { ph: st.ph, seed: 2 })); } });

  /* ---------------- the colonial fronts along the near edges ---------------- */
  const FR = [[-36, 29, -26, 36.5, '#BFD9EA', 'BAR'], [-25, 29, -15, 36.5, '#F2D24B', 'SAMBA'], [-14, 29, -4, 36.5, '#E9A0B8', 'BOTEQUIM'], [-3, 29, 7, 36.5, '#A8D5BA', 'ARMAZÉM'], [8, 29, 18, 36.5, '#F0B9A0', 'CHOPERIA'], [29, -12, 36.5, 0, '#F3E3B8', 'BAR'], [29, 1, 36.5, 13, '#CFE3D8', 'SUCOS'], [29, 14, 36.5, 26, '#E9A23B', 'LAPA']];
  FR.forEach(([x0, y0, x1, y1, c, word], i) => T.obj([x0, y0, x1, y1], (g) => {
    g.boilP = 0.25; const h = 8.4 + (i % 3) * 0.8;
    K.box(g, x0, y0, x1, y1, 0, h, c, { w: 0.85 });
    const face = y1 > 36 ? 'L' : 'R', p = face === 'L' ? y1 : x1, a0 = face === 'L' ? x0 : y0, a1 = face === 'L' ? x1 : y1;
    RJ.colonial(g, face, p, a0 + 0.3, a1 - 0.3, 0, h - 0.2, c, 4450 + i, { bar: true, lamps: true });   // (night: Lapa's bars open)
    RJ.litSign(g, face, p + 0.05, a0 + 1.2, a1 - 1.2, 3.6, 4.6, shade(c, 0.45), word);
    K.hip(g, x0 - 0.5, y0 - 0.5, x1 + 0.5, y1 + 0.5, h, 2.0, '#C9704F');
  }, { name: 'sobrado' }));
  // people at the bar doors on the pavement outside
  for (const [x, y, s, d] of [[-31, 38.4, 4460, 1], [-29.6, 39.2, 4461, 2], [-20, 38.6, 4462, 1], [-8.6, 38.8, 4463, 0], [2.6, 38.4, 4464, 1], [13, 38.6, 4465, 0], [38.2, -6, 4466, 0], [38.8, 7, 4467, 3], [38.4, 20, 4468, 0]])
    T.cast([x, y], (g) => RJ.person(g, x, y, 0, Object.assign(RJ.who(s), { dir: d, pose: s % 3 === 0 ? 'hold' : 'stand', cup: s % 3 === 0 ? '#F2C230' : undefined })), {});

  /* ---------------- the square: fig tree, roda de samba, capoeira, carts ---------------- */
  T.obj([-6, -6], (g) => K.tree(g, -6, -6, { r: 7.4, h: 5.8, col: '#4F8A45' }), { name: 'figueira' });
  T.obj([22, -12], (g) => K.tree(g, 22, -12, { r: 5.2, h: 5.4, col: '#5E8F4E' }), { name: 'árvore' });
  // the roda de samba: musicians round a table, a cavaquinho, a pandeiro, a surdo
  T.cast([6, 12], (g) => {
    const f = g.p(6, 12, 0); g.glow2('lantern', [f[0], f[1] - 6.2], f, { r: 1.6, col: '#FFCF7C' }); /* (night: a lamp on the musicians' table) */ g.fill2(arcPts(f[0], f[1] - 4, 6, 0, TAU, 14).map((q) => [q[0], f[1] - 4 + (q[1] - f[1] + 4) * 0.5]), '#F3F1EA', true); g.segs2([f[0] - 3, f[1], f[0] - 3, f[1] - 4, f[0] + 3, f[1], f[0] + 3, f[1] - 4], '#8C8576', 0.5);
    for (let k = 0; k < 4; k++) g.fill2([[f[0] - 3 + k * 1.8, f[1] - 4.6], [f[0] - 2.4 + k * 1.8, f[1] - 4.6], [f[0] - 2.5 + k * 1.8, f[1] - 6.4], [f[0] - 2.9 + k * 1.8, f[1] - 6.4]], '#F2C230', true);
    const M = [[3.4, 9.6, 2, 'pandeiro'], [8.6, 9.8, 2, 'cav'], [3.2, 14.4, 1, 'surdo'], [8.8, 14.2, 0, 'cav'], [6, 15.6, 1, 'voz']];
    for (const [x, y, d, ins] of M) { const r = RJ.person(g, x, y, 1.3, Object.assign(RJ.who(4470 + x * 3), { dir: d, pose: 'sit', hands: ins === 'cav' ? [[2.6, -10.6], [-1.2, -10.2]] : ins === 'pandeiro' ? [[1.6, -14], [2.2, -11]] : undefined, drum: ins === 'surdo' ? 'caixa' : undefined }));
      const h = r.hands[0];
      if (ins === 'cav') { g.fill2([[h[0] - 2.6, h[1] + 0.6], [h[0] + 0.4, h[1] - 0.4], [h[0] + 0.6, h[1] + 1.2], [h[0] - 2.4, h[1] + 2.0]], '#B07A44', true); g.disc2([h[0] - 2.2, h[1] + 1.3], 1.3, '#B07A44'); }
      if (ins === 'pandeiro') { g.disc2(h, 1.4, '#E9DCC0'); g.ring2(h, 1.4, { w: 0.35, c: '#7A5A3C' }); } }
    for (let k = 0; k < 6; k++) { const x = 6 + Math.cos(k) * 7, y = 12 + Math.sin(k) * 6; if (y < 10) continue; void x; }
  }, {});
  // couples dancing samba de gafieira near the musicians
  for (const [x, y, s] of [[13, 19, 4480], [-1, 18, 4482], [12, 6, 4484]]) T.actor({ sample: 5, period: 3,
    at(t) { const q = Math.floor(((t * 1.5 + s) % 1) * 4); return { x, y, key: q, q }; },
    draw(g, st) { RJ.person(g, -0.9, 0, 0, Object.assign(RJ.who(s), { dir: st.q < 2 ? 0 : 1, pose: st.q % 2 ? 'wave' : 'walk', ph: st.q / 4 })); RJ.person(g, 0.9, 0.4, 0, Object.assign(RJ.who(s + 1, { set: { dress: '#D9463B', fem: true, hairStyle: 'long' } }), { dir: st.q < 2 ? 1 : 0, pose: st.q % 2 ? 'cheer' : 'walk', ph: (st.q + 2) / 4 })); } });
  // the capoeira ring: two players in the ginga, a berimbau, people clapping round them
  const CC = [20, 4];
  for (let k = 0; k < 7; k++) { const a = TAU * k / 7, x = CC[0] + Math.cos(a) * 5, y = CC[1] + Math.sin(a) * 4.2, d = Math.abs(Math.cos(a)) > Math.abs(Math.sin(a)) ? (Math.cos(a) > 0 ? 2 : 0) : (Math.sin(a) > 0 ? 3 : 1);
    T.actor({ sample: 5, period: 2, at(t) { const q = Math.floor((t * 2 + k * 0.3) % 2); return { x, y, key: q, q }; },
      draw(g, st) { const w = RJ.who(4490 + k, { carnaval: false, set: { top: '#F6F4EE', bot: '#F6F4EE', shorts: false, dress: undefined } }); const r = RJ.person(g, 0, 0, 0, Object.assign(w, { dir: d, pose: k === 0 ? 'stand' : 'hold', hands: k === 0 ? [[2, -18], [-1, -9]] : st.q ? [[1.2, -14], [1.6, -14.4]] : [[0.6, -12], [2.2, -12.4]] }));
        if (k === 0) { const h = r.hands[0]; g.line2([[h[0] - 1, h[1] + 9], [h[0] + 1.5, h[1] - 6]], { w: 0.5, c: '#7A5A3C', boil: false }); g.disc2([h[0] - 0.4, h[1] + 4], 1.4, '#C99A5A'); } } }); }
  for (const k of [0, 1]) T.actor({ sample: 5, period: 3,
    at(t) { const q = Math.floor(((t * 1.2) % 1) * 4), a = TAU * (t / 6 + k * 0.5); return { x: CC[0] + Math.cos(a) * 1.4, y: CC[1] + Math.sin(a) * 1.0, key: q + '.' + k, q }; },
    draw(g, st) { const w = RJ.who(4500 + k, { carnaval: false, set: { top: '#F6F4EE', bot: '#F6F4EE', bare: true, shorts: false, dress: undefined } }); if (st.q === 2 && k) RJ.person(g, 0, 0, 0.5, Object.assign(w, { lie: -0.4, pose: 'stand', dir: 0 })); else RJ.person(g, 0, 0, 0, Object.assign(w, { dir: k ? 1 : 0, pose: st.q % 2 ? 'crouch' : 'kneel', sway: st.q === 1 ? 0.7 : -0.5 })); } });
  // caipirinha carts with fruit, revellers in costume walking through
  for (const [x, y, a] of [[16, -6, '#3A9A5B'], [-4, 24, '#F2C230']]) T.obj([x, y], (g) => {
    K.stall(g, x, y, { face: 'L', L: 2.2, D: 1.4, a, b: '#F6F3EA', goods: (g2, D, L) => { for (let i = 0; i < 6; i++) { const p = g2.p(-D + 0.5 + (i % 3) * 0.9, -L + 0.6 + Math.floor(i / 3) * 1.6, 2.9); g2.disc2(p, 0.7, ['#9CCB4A', '#F2C230', '#E04A3A'][i % 3]); } } });
    RJ.bulb(g, x, y, 5.9, { r: 1.3 }); RJ.lit(g, 0, 0.45);                  // (night: a bulb under the awning)
  }, { name: 'barraca' });
  T.cast([17.6, -3.6], (g) => RJ.person(g, 17.6, -3.6, 0, Object.assign(RJ.who(4510), { dir: 1, pose: 'hold', cup: '#C9E39A' })), {});
  RJ.walker(T, RJ.who(4511, { set: { asas: '#BFE3EE', dress: '#F3D3E6', fem: true } }), [[-10, -16], [26, -16], [26, 24], [-10, 24]], 1.0, { phase: 0.1 });
  RJ.walker(T, RJ.who(4512, { set: { marin: true } }), [[26, 24], [-10, 24], [-10, -16], [26, -16]], 1.1, { phase: 0.4 });
  RJ.walker(T, RJ.who(4513, { set: { plume: ['#E86A9A', '#F2C230', '#5FC0B0'], top: '#E86A9A' } }), [[-12, 2], [27, 2]], 0.9, { phase: 0.7 });
  // people walking under the arches
  RJ.walker(T, RJ.who(4514), [[4, -32], [4, -15]], 1.0, { phase: 0.2 });
  RJ.walker(T, RJ.who(4515), [[12.6, -15], [12.6, -32]], 1.1, { phase: 0.6 });
});
