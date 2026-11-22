'use strict';
/* The Seine: a channel along y at x -63..-37 right across the map (west is -y, so the water flows towards the top
   right). The water lies 4.2 u below the streets. On the left bank (the side we see) a tall dressed-stone quai wall
   drops to a cobbled lower quai (the bas-port) 1.3 u above the water, where people sit with their legs over the edge,
   someone fishes, a guitarist plays, joggers pass under the bridges; two péniches are moored there, flowers on deck.
   The right bank's paving is drawn over the water's near strip (it hides ~5 u), so the boats keep to x <= -43.
   Four bridges carry the streets and the walkers over it, each built as: the vault (dark underside seen through the
   arches), the span ({ under: -0.6 }: boats and the lower-quai walkers pass under it, cars and walkers on the deck
   stand on it) and the near parapet in pieces ({ on: true }, so people on the deck are behind it):
     Pont d'Iéna (y -100) from the Eiffel Tower to the avenue d'Iéna: stone, eagles on the pier heads;
     Pont Alexandre III (y -50): one low steel arch with gilded garlands, candelabras, four pillars with golden Pegasi;
     Pont des Arts (y 0): the iron footbridge from the Institut to the Louvre, a wooden deck, benches, a painter;
     Pont Neuf (y +50): stone arches with round bays over every pier.
   Two bateaux-mouches run both ways, each as six pieces (PA.boatActors) so the arches cover exactly what is under them. */
/* Drawn into the streets tile (PA.seine(T) at its end): one tile under every place, so the map has a single bake that
   covers the whole view at any zoom rather than two (the explore bake budget is shared by everything on screen). */
PA.seine = function (T) {
  const X0 = RIVER.X0, X1 = RIVER.X1, WZ = RIVER.WZ, LQ = X0 + RIVER.LQ, LQZ = RIVER.LQZ, YA = -152, YB = 152, YQ = 63;
  const deck = PST.deck;
  T.ground(function (g) {
    // the water, with ragged painted ends where the river leaves the map
    const R = RNG(5), endA = [], endB = [];
    for (let i = 0; i <= 8; i++) { const x = lerp(X0, X1, i / 8); endA.push([x, YA - 2 - R() * 4, WZ]); endB.push([x, YB + 2 + R() * 4, WZ]); }
    const water = endA.concat(endB.slice().reverse());
    g.fill(water, PC.water);
    g.water(K.rect(X0 + 0.5, YA, X1, YB, WZ), { dens: 1.1 });
    g.scuff(K.rect(LQ + 0.5, YA, X1 - 2, YB, WZ), { dir: Math.atan2(AY, -AX), len: 7, c: PC.waterL, dens: 0.35, w: 0.6, spread: 0.05 });
    // the left bank's quai wall, x = X0, from the street down to the lower quai (dressed stone courses)
    const wall = [[X0, YA, 0], [X0, YQ, 0], [X0, YQ, LQZ], [X0, YA, LQZ]];
    g.fill(wall, '#D3C6A8');
    const cs = []; for (let z = -0.7; z > LQZ + 0.1; z -= 0.72) { const a = g.p(X0, YA, z), b = g.p(X0, YQ, z); cs.push(a[0], a[1], b[0], b[1]); }
    for (let y = YA + 1; y < YQ; y += 2.4) for (let z = 0, k = 0; z > LQZ + 0.4; z -= 0.72, k++) { const a = g.p(X0, y + (k % 2) * 1.2, z), b = g.p(X0, y + (k % 2) * 1.2, z - 0.72); cs.push(a[0], a[1], b[0], b[1]); }
    g.segs2(cs, '#B5A784', 0.28);
    g.line([[X0, YA, 0], [X0, YQ, 0]], { w: 0.75, boil: false });
    // the lower quai: cobbles, its edge, then its face down to the water
    const lq = K.rect(X0, YA, LQ, YQ, LQZ);
    g.fill(lq, PC.cobble);
    g.scuff(lq, { dir: Math.atan2(AY, -AX), len: 1.0, c: '#C4B89E', dens: 1.4, w: 0.45, spread: 1.4 });
    g.fill([[LQ, YA, LQZ], [LQ, YQ, LQZ], [LQ, YQ, WZ], [LQ, YA, WZ]], '#BFB194');
    g.line([[LQ, YA, LQZ], [LQ, YQ, LQZ]], { w: 0.6, boil: false });
    g.line([[X0, YA, LQZ], [X0, YQ, LQZ]], { w: 0.45, c: '#8C8064', boil: false });
    g.line([[LQ, YA, WZ], [LQ, YQ, WZ]], { w: 0.45, c: '#5F7F80', boil: false });
    // mooring rings on the lower quai's face
    for (let y = YA + 10; y < YQ - 4; y += 17) { const c = g.p(LQ + 0.02, y, LQZ - 0.6); g.ring2(c, 0.9, { c: '#4A443B', w: 0.35 }); }
    // at night: the lanterns on brackets along the tall quai wall, between the rings (their light lies on the lower
    // quai and doubles in the river)
    for (let y = YA + 18.5; y < YQ - 4; y += 17) if (Math.abs(y + 100) > 8 && Math.abs(y + 50) > 15 && Math.abs(y) > 4) g.glow('lamp', X0 + 0.15, y, -1.3, { r: 1.2, base: LQZ });
    // the right bank's edge line, where the paving meets the water
    g.line([[X1, YA, 0], [X1, YB, 0]], { w: 0.7, boil: false });
  });

  /* ---------------- moored péniches ---------------- */
  const peniche = (y0, y1, hull, cabin, name) => T.obj([LQ + 0.3, y0, LQ + 3.7, y1], function (g) {
    const x0 = LQ + 0.4, x1 = LQ + 3.6, zw = WZ;
    K.box(g, x0, y0, x1, y1, zw, zw + 1.6, { t: '#5E4A3C', l: hull, r: shade(hull, 0.12) }, { w: 0.7 });
    g.fill(K.on('R', x1 + 0.01, y0, y1, zw + 0.2, zw + 0.55), '#E9E2CC');
    K.box(g, x0 + 0.4, y0 + 2, x1 - 0.4, y1 - 4, zw + 1.6, zw + 3.6, { t: '#C9B48C', l: cabin, r: shade(cabin, 0.1) }, { w: 0.6 });
    for (let a = y0 + 2.6; a < y1 - 4.6; a += 2.0) K.win(g, 'R', x1 - 0.4, a, a + 1.0, zw + 2.2, zw + 3.2, { style: 'glass' });
    K.blooms(g, x0 + 0.6, y1 - 3.6, x1 - 0.6, y1 - 0.6, zw + 1.6, ['#C9463E', '#E6C24F', '#E9806A', '#8FBF73'], { sp: 1.0, r: 1.0 });
    g.fill(K.on('R', x1 + 0.02, y0 + 1, y0 + 5, zw + 0.7, zw + 1.3), '#F6F1E4');
  }, { name });
  peniche(-92, -70, '#3F5F4F', '#E9DCC0', 'peniche'); peniche(14, 34, '#7A3A30', '#F1EBDD', 'peniche 2');

  /* ---------------- bridges ---------------- */
  function bridge(yc, hw, o) {
    const y0 = yc - hw, y1 = yc + hw, AR = o.arches, iron = o.kind === 'iron', stone = o.stone || '#E3D8BE', stoneD = shade(stone, 0.12);
    const spring = (a) => (a[0] <= X0 + 0.01 ? LQZ : WZ + 0.2), crownZ = (a) => deck((a[0] + a[1]) / 2) - (iron ? 0.6 : 1.0);
    const archPts = (a, n) => { const m = (a[0] + a[1]) / 2, h = (a[1] - a[0]) / 2, zs = spring(a), zc = crownZ(a), out = []; for (let i = 0; i <= n; i++) { const t = Math.PI * i / n; out.push([m - Math.cos(t) * h, y1, zs + (zc - zs) * Math.sin(t)]); } return out; };
    const xs = (a, b, n) => { const o2 = []; for (let i = 0; i <= n; i++) o2.push(lerp(a, b, i / n)); return o2; };
    // 1 the vault: the underside in shadow, the water beyond seen under it
    T.obj([X0, y0, X1, y1], function (g) {
      for (const a of AR) {
        const pts = archPts(a, 12), zs = spring(a), m = (a[0] + a[1]) / 2, h = (a[1] - a[0]) / 2;
        g.fill(pts, '#6B6455');
        const lo = [[a[0], y1, zs], [a[1], y1, zs], [a[1], y1, zs + 0.9], [a[0], y1, zs + 0.9]];
        g.fill(lo, zs > WZ + 0.5 ? '#BDB196' : '#7E9C9C');
        const far = []; for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10; far.push([m - Math.cos(t) * h * 0.86, y0, zs + (crownZ(a) - zs) * Math.sin(t) * 0.86]); }
        g.fill(far, '#9DB3AE');
      }
    }, { name: o.name + ' vault' });
    // 2 the span: far parapet, the deck, the near face with its arches
    T.obj([X0, y0, X1, y1], function (g) {
      g.boilP = 0.3;
      const xx = xs(X0, X1, 16);
      // far parapet (inner face and cap)
      if (!iron) {
        g.fill(xx.map((x) => [x, y0 + 0.7, deck(x)]).concat(xx.slice().reverse().map((x) => [x, y0 + 0.7, deck(x) + 1.2])), shade(stone, 0.06));
        g.fill(xx.map((x) => [x, y0, deck(x) + 1.2]).concat(xx.slice().reverse().map((x) => [x, y0 + 0.7, deck(x) + 1.2])), shade(stone, -0.12));
        g.line(xx.map((x) => [x, y0 + 0.7, deck(x) + 1.2]), { w: 0.5, boil: false });
      }
      // the deck
      const top = xx.map((x) => [x, y0, deck(x)]).concat(xx.slice().reverse().map((x) => [x, y1, deck(x)]));
      g.fill(top, iron ? '#B8875A' : PC.pave);
      if (iron) { const pl = []; for (let i = 0; i <= 40; i++) { const x = lerp(X0, X1, i / 40), a = g.p(x, y0, deck(x)), b = g.p(x, y1, deck(x)); pl.push(a[0], a[1], b[0], b[1]); } g.segs2(pl, '#94683F', 0.3); }
      else if (o.road) {
        const rw = PST.rw, rd = xx.map((x) => [x, yc - rw, deck(x) + 0.01]).concat(xx.slice().reverse().map((x) => [x, yc + rw, deck(x) + 0.01]));
        g.fill(rd, PC.asph);
        for (const s of [-1, 1]) g.line(xx.map((x) => [x, yc + s * rw, deck(x) + 0.02]), { w: 0.45, c: '#A9A296', boil: false, ext: 0 });
        const dsh = []; for (let x = X0 + 2; x < X1 - 3; x += 8) { const a = g.p(x, yc, deck(x) + 0.02), b = g.p(x + 3.6, yc, deck(x + 3.6) + 0.02); dsh.push(a[0], a[1], b[0], b[1]); } g.segs2(dsh, '#F7F5EE', 0.9);
      }
      // the near face: spandrels over the arches and the piers between them
      const face = stone, faceD = stoneD, ring = [], iF = g.cmds.length;
      let prev = X0;
      const pieces = [];
      for (const a of AR) {
        if (a[0] > prev + 0.01) pieces.push(xs(prev, a[0], 3).map((x) => [x, y1, deck(x)]).concat([[a[0], y1, spring(a)], [prev, y1, prev === X0 ? LQZ : WZ]]));
        const ap = archPts(a, 12); pieces.push(ap.concat(xs(a[1], a[0], 6).map((x) => [x, y1, deck(x)])));
        ring.push(ap); prev = a[1];
      }
      if (prev < X1 - 0.01) pieces.push(xs(prev, X1, 3).map((x) => [x, y1, deck(x)]).concat([[X1, y1, WZ], [prev, y1, WZ]]));
      for (const pc of pieces) g.fill(pc, iron ? '#C9CED0' : face);
      if (iron) {
        // the iron arch ribs and the lattice between rib and deck
        for (const ap of ring) { g.line(ap, { w: 0.75, c: '#4A5458', boil: false }); const lat = []; for (let i = 1; i < ap.length - 1; i += 1) { const p = ap[i], a2 = g.p(p[0], y1, p[2]), b2 = g.p(p[0], y1, deck(p[0]) - 0.15); lat.push(a2[0], a2[1], b2[0], b2[1]); } g.segs2(lat, '#5E686C', 0.3); }
        for (const pc of pieces) g.outline(pc, { w: 0.4, c: '#4A5458', boil: false, ext: 0 });
      } else {
        // voussoirs round each arch, coursing on the piers, the cornice band
        for (const ap of ring) {
          const outer = ap.map((p, i) => { const m = (ap[0][0] + ap[ap.length - 1][0]) / 2, h = (ap[ap.length - 1][0] - ap[0][0]) / 2, t = Math.PI * i / (ap.length - 1); return [m - Math.cos(t) * (h + 0.7), y1 + 0.01, p[2] + Math.sin(t) * 0.7]; });
          g.fill(ap.map((p) => [p[0], y1 + 0.02, p[2]]).concat(outer.slice().reverse()), o.ringCol || shade(stone, -0.1));
          const vj = []; for (let i = 1; i < ap.length - 1; i++) { const a2 = g.p(ap[i][0], y1 + 0.03, ap[i][2]), b2 = g.p(outer[i][0], y1 + 0.03, outer[i][2]); vj.push(a2[0], a2[1], b2[0], b2[1]); } g.segs2(vj, faceD, 0.3);
          g.line(ap, { w: 0.7, boil: false });
        }
        const cs = []; for (let z = WZ + 0.8; z < 0.5; z += 0.8) for (let i = 0; i < AR.length - 1; i++) { const pa = AR[i][1], pb = AR[i + 1][0]; if (z > crownZ(AR[i]) - 0.5) continue; const a2 = g.p(pa, y1 + 0.02, z), b2 = g.p(pb, y1 + 0.02, z); cs.push(a2[0], a2[1], b2[0], b2[1]); }
        g.segs2(cs, faceD, 0.3);
        for (let i = 0; i < AR.length - 1; i++) {   // the cutwater at the foot of each pier
          const pa = AR[i][1], pb = AR[i + 1][0], m = (pa + pb) / 2, cw = [[pa, y1, WZ], [pb, y1, WZ], [pb, y1 + 0.9, WZ + 1.6], [m, y1 + 1.3, WZ + 2.1], [pa, y1 + 0.9, WZ + 1.6]];
          g.fill(cw, shade(stone, 0.05)); g.outline(cw, { w: 0.4, boil: false, c: '#7A6E58' });
        }
      }
      const band = xx.map((x) => [x, y1 + 0.03, deck(x) - 0.55]).concat(xx.slice().reverse().map((x) => [x, y1 + 0.03, deck(x)]));
      g.fill(band, iron ? '#8E9A9C' : shade(stone, -0.14));
      g.line(xx.map((x) => [x, y1, deck(x)]), { w: 0.8, boil: false });
      if (o.garland) {   // Alexandre III: gilded garlands and a cartouche at the crown
        const gl = []; for (let i = 0; i < 14; i++) { const xa = lerp(X0 + 1, X1 - 1, i / 14), xb = lerp(X0 + 1, X1 - 1, (i + 1) / 14), a2 = g.p(xa, y1 + 0.05, deck(xa) - 0.6), m2 = g.p((xa + xb) / 2, y1 + 0.05, deck((xa + xb) / 2) - 1.1), b2 = g.p(xb, y1 + 0.05, deck(xb) - 0.6); gl.push(a2[0], a2[1], m2[0], m2[1], m2[0], m2[1], b2[0], b2[1]); }
        g.segs2(gl, PC.gold, 0.6);
        const c = g.p((X0 + X1) / 2, y1 + 0.06, deck((X0 + X1) / 2) - 1.3); g.fill2(arcPts(c[0], c[1], 2.4, 0, TAU, 10).map((q) => [q[0], c[1] + (q[1] - c[1]) * 0.8]), PC.gold, true);
      }
      if (o.eagles) for (let i = 0; i < AR.length - 1; i++) { const m = (AR[i][1] + AR[i + 1][0]) / 2, c = g.p(m, y1 + 0.1, deck(m) - 1.7); g.disc2(c, 1.3, '#E9E2CC'); g.fill2([[c[0] - 2.2, c[1] - 0.2], [c[0], c[1] - 1.4], [c[0] + 2.2, c[1] - 0.2], [c[0], c[1] + 0.6]], '#E9E2CC', true); g.ring2(c, 1.3, { c: '#8C8064', w: 0.3 }); }
      // at night the stone bridges are floodlit from the water: the face and its arches warm, the gilt bright
      if (!iron) PA.flood(g, iF, 0.5);
    }, { name: o.name, under: -0.6 });
    // 3 the near parapet in three pieces, lamps on it
    const cuts = [X0, X0 + 9, X0 + 17.5, X1];
    for (let k = 0; k < 3; k++) {
      const a0 = cuts[k], a1 = cuts[k + 1];
      T.obj([a0, y1 - 0.7, a1, y1], function (g) {
        const xx = xs(a0, a1, 6), iP = g.cmds.length;
        if (iron) {
          const rl = []; for (let i = 0; i <= Math.round((a1 - a0) / 0.5); i++) { const x = lerp(a0, a1, i / Math.round((a1 - a0) / 0.5)), b = g.p(x, y1 - 0.2, deck(x)), t = g.p(x, y1 - 0.2, deck(x) + 1.3); rl.push(b[0], b[1], t[0], t[1]); }
          g.segs2(rl, '#3A4448', 0.25);
          g.line(xx.map((x) => [x, y1 - 0.2, deck(x) + 1.3]), { w: 0.55, c: '#2E3638', boil: false, ext: 0 });
          g.line(xx.map((x) => [x, y1 - 0.2, deck(x) + 0.5]), { w: 0.3, c: '#2E3638', boil: false, ext: 0 });
        } else {
          g.fill(xx.map((x) => [x, y1, deck(x)]).concat(xx.slice().reverse().map((x) => [x, y1, deck(x) + 1.25])), shade(stone, 0.02));
          g.fill(xx.map((x) => [x, y1 - 0.7, deck(x) + 1.25]).concat(xx.slice().reverse().map((x) => [x, y1, deck(x) + 1.25])), shade(stone, -0.14));
          if (o.balusters) { const bl = []; for (let i = 0; i <= Math.round((a1 - a0) / 0.55); i++) { const x = lerp(a0 + 0.2, a1 - 0.2, i / Math.round((a1 - a0) / 0.55)), b = g.p(x, y1 + 0.02, deck(x) + 0.2), t = g.p(x, y1 + 0.02, deck(x) + 1.05); bl.push(b[0], b[1], t[0], t[1]); } g.segs2(bl, shade(stone, 0.22), 0.45); }
          g.line(xx.map((x) => [x, y1, deck(x) + 1.25]), { w: 0.65, boil: false, ext: 0 });
          if (k === 0) g.line([[a0, y1 - 0.7, deck(a0) + 1.25], [a0, y1, deck(a0) + 1.25], [a0, y1, deck(a0)]], { w: 0.55, boil: false });
          if (o.bays) for (let i = 0; i < AR.length - 1; i++) {   // Pont Neuf: a round bay over each pier
            const m = (AR[i][1] + AR[i + 1][0]) / 2; if (m < a0 || m > a1) continue;
            const r = 1.5, zt = deck(m) + 1.25, b = []; for (let j = 0; j <= 10; j++) { const t = Math.PI * j / 10; b.push([m - Math.cos(t) * r, y1 + Math.sin(t) * r, zt]); }
            g.fill(b.map((p) => [p[0], p[1], zt - 1.25]).concat(b.slice().reverse()), shade(stone, 0.03)); g.fill(b, shade(stone, -0.14)); g.line(b, { w: 0.55, boil: false });
          }
        }
        if (!iron) PA.flood(g, iP, 0.4);                 // (before the lamps: their lanterns keep their own light)
        for (const lx of o.lamps || []) if (lx >= a0 && lx < a1) PA.lamp(g, lx, y1 - 0.35, { z: deck(lx) + (iron ? 0 : 1.25), h: o.lampH || 6.4, refl: [lx, y1 + 1.2, WZ] });
      }, { name: o.name + ' parapet', on: true });
    }
    // lamps on the far parapet go in the span; here in their own small objects so they sort with the deck's walkers
    for (const lx of o.lamps || []) T.obj([lx, y0 + 0.35], (g) => PA.lamp(g, lx, y0 + 0.35, { z: deck(lx) + (iron ? 0 : 1.25), h: o.lampH || 6.4, refl: [lx + 1.2, y1 + 1.2, WZ] }), { on: true, name: 'bridge lamp' });
  }
  const STONE3 = [[X0, X0 + 5.4], [X0 + 6.4, X0 + 13.4], [X0 + 14.2, X0 + 21.6], [X0 + 22.4, X1 - 0.1]];
  bridge(-100, 6, { name: 'pont d iena', arches: STONE3, road: true, eagles: true, lamps: [X0 + 4, X1 - 4], stone: '#E2D7BD' });
  bridge(-50, 13, { name: 'pont alexandre iii', arches: [[X0, X1 - 0.6]], kind: 'stone', road: true, garland: true, balusters: true, stone: '#D9DEDD', ringCol: '#BFC8C9', lamps: [X0 + 6, (X0 + X1) / 2, X1 - 6], lampH: 7.4 });
  bridge(0, 2.2, { name: 'pont des arts', arches: [[X0, X0 + 5], [X0 + 5.6, X0 + 13.4], [X0 + 14, X0 + 20.5], [X0 + 21.1, X1]], kind: 'iron' });
  bridge(50, 13, { name: 'pont neuf', arches: STONE3, road: true, bays: true, lamps: [X0 + 6, X1 - 6], stone: '#E6DCC2' });
  // Alexandre III's four pillars with golden Pegasi, on the banks at the bridge's corners
  for (const [x, y] of [[X0 - 2.4, -61], [X0 - 2.4, -39], [X1 + 2.4, -61], [X1 + 2.4, -39]]) T.obj([x - 1.4, y - 1.4, x + 1.4, y + 1.4], function (g) {
    const i0 = g.cmds.length;
    K.box(g, x - 1.4, y - 1.4, x + 1.4, y + 1.4, 0, 2.2, { t: '#E9E2CC', l: '#E3DCC6', r: '#CFC6AE' }, { w: 0.6 });
    K.box(g, x - 1.0, y - 1.0, x + 1.0, y + 1.0, 2.2, 13, { t: '#E9E2CC', l: '#EDE7D4', r: '#D6CDB4' }, { w: 0.7 });
    g.fill(K.on('L', y + 1.01, x - 0.7, x + 0.7, 5, 10.5), '#E2DAC3'); g.fill(K.on('R', x + 1.01, y - 0.7, y + 0.7, 5, 10.5), '#CDC3A9');
    K.box(g, x - 1.2, y - 1.2, x + 1.2, y + 1.2, 13, 13.6, { t: '#E9E2CC', l: '#EDE7D4', r: '#D6CDB4' }, { w: 0.55 });
    // the gilded Pegasus and its rider
    const c = g.p(x, y, 13.6);
    g.fill2([[c[0] - 2.8, c[1] - 1.0], [c[0] + 2.4, c[1] - 1.4], [c[0] + 3.4, c[1] - 4.4], [c[0] + 1.0, c[1] - 4.8], [c[0] - 2.0, c[1] - 3.8]], PC.gold, true);
    g.fill2([[c[0] + 2.6, c[1] - 3.8], [c[0] + 4.2, c[1] - 7.0], [c[0] + 3.0, c[1] - 7.6], [c[0] + 1.8, c[1] - 4.6]], PC.gold, true);
    g.fill2([[c[0] - 1.0, c[1] - 4.0], [c[0] - 4.6, c[1] - 9.4], [c[0] - 2.4, c[1] - 9.8], [c[0] + 0.4, c[1] - 4.6]], '#E6C25A', true);
    g.fill2([[c[0] - 0.2, c[1] - 4.2], [c[0] + 0.6, c[1] - 4.2], [c[0] + 0.4, c[1] - 8.2], [c[0] - 0.2, c[1] - 8.2]], PC.goldD, true); g.disc2([c[0] + 0.2, c[1] - 8.9], 0.8, PC.goldD);
    g.line2([[c[0] - 2.8, c[1] - 1.0], [c[0] + 2.4, c[1] - 1.4], [c[0] + 3.4, c[1] - 4.4]], { w: 0.4, c: '#7A5A1E', boil: false });
    // floodlit at night, the gilded Pegasus shining at the top
    PA.flood(g, i0, 0.7); g.glow2('lantern', [c[0], c[1] - 4.5], g.p(x, y, 0), { r: 2.2, col: '#FFC864' }); g.glow('lantern', x, y, 6, { r: 2.0, col: '#FFDDA6' });
  }, { name: 'pegasus pillar' });

  /* ---------------- the lower quai's people ---------------- */
  const edge = LQ - 0.35;
  const sitters = [[-140, 1], [-131, 2], [-123, 1], [-117, 3], [-88, 2], [-79, 1], [-74, 2], [-30, 2], [-22, 1], [-18.5, 1], [-6, 2], [8, 1], [12, 2], [24, 1], [30, 2]];
  sitters.forEach(([y, n], i) => T.cast([edge, y], function (g) {
    for (let k = 0; k < n; k++) {
      const yy = y + k * 1.5, w = PA.who(8000 + i * 5 + k, { bare: false });
      PA.person(g, edge, yy, LQZ, Object.assign({}, w, { dir: 0, pose: 'sit' }));
      if (k === 0 && i % 3 === 1) { const c = g.p(edge - 0.6, yy + 0.8, LQZ); g.fill2([[c[0] - 0.4, c[1]], [c[0] + 0.4, c[1]], [c[0] + 0.35, c[1] - 2.4], [c[0] - 0.35, c[1] - 2.4]], '#4F6B3A', true); }
    }
  }, { on: true }));
  // an angler with his rod and line, a guitarist with a little audience
  T.cast([edge - 0.6, -112], function (g) {
    const r = PA.person(g, edge - 0.6, -112, LQZ, PA.who(8101, { dir: 0, pose: 'stand', top: '#5A6B5A', beret: '#2A2622', hands: [[3.6, -12.5], [2.6, -11.2]] }));
    const h = r.hands[0], tip = [h[0] + 22, h[1] - 9]; g.line2([h, tip], { w: 0.45, c: '#4A3A2C', boil: false, ext: 0 });
    const wl = g.p(-55, -106, WZ); g.fine2([tip, [lerp(tip[0], wl[0], 0.5) + 1, lerp(tip[1], wl[1], 0.6)], wl], { w: 0.2, c: '#6E6A60' });
  }, { on: true });
  T.cast([edge - 1.6, -12], function (g) {
    PA.person(g, edge - 0.9, -15.6, LQZ, PA.who(8110, { dir: 0, pose: 'sit' }));
    const r = PA.person(g, edge - 1.3, -12.0, LQZ, PA.who(8111, { dir: 1, pose: 'sit', hands: [[1.8, -6.4], [-2.2, -7.8]], top: '#C9584B' }));
    const hp = r.hip, body = [[hp[0] - 3.6, hp[1] - 2.6], [hp[0] + 0.6, hp[1] - 5.6], [hp[0] + 2.4, hp[1] - 3.8], [hp[0] - 1.2, hp[1] - 0.2]];
    g.fill2(K.curve(body, 3, true), '#B8743A', true); g.disc2([hp[0] - 0.4, hp[1] - 2.8], 0.7, '#3A2A1E');
    g.line2([[hp[0] + 1.6, hp[1] - 4.6], [hp[0] + 6.2, hp[1] - 8.6]], { w: 0.55, c: '#3A2A1E', boil: false, ext: 0 });
    PA.person(g, edge - 0.8, -8.6, LQZ, PA.who(8112, { dir: 2, pose: 'sit' }));
  }, { on: true });
  // joggers and strollers along the lower quai, each between two bridges (the quai is shallow at this scale: a walker
  // just behind a bridge would show his head over its deck, so they turn well clear of every bridge's far side)
  [[1.6, 0.1, 8120, -36, -6.5], [1.3, 0.45, 8121, 3.5, 33], [2.4, 0.7, 8122, -93, -67], [1.4, 0.85, 8123, -150, -111]].forEach(([v, ph, s, y0, y1], i) => PA.walker(T, PA.who(s, i === 2 ? { top: '#E6C24F', bot: '#2A2622', shorts: true, bare: true, dress: undefined, trench: false } : {}), [[X0 + 0.6 + (i % 2) * 0.5, y0], [X0 + 0.6 + (i % 2) * 0.5, y1]], v, { phase: ph, z: LQZ }));

  /* ---------------- the boats ---------------- */
  PA.boatActors(T, -53.2, 1, 34, 0.1, { seed: 3, band: '#2F4A63' });
  PA.boatActors(T, -46.0, -1, 30, 0.62, { seed: 9, band: '#7A2E2A' });
};
