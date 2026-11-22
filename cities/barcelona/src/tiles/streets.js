'use strict';
/* The Eixample grid. Every block is an octagon (its corners cut at 45°, the xamfrà): the places stand on the inner
   octagon (half 37, chamfer leg 10) and the streets tile draws the 5 m pavements round them (the kerb octagon, half
   43) and the 14 u roadways, so every crossing opens into an octagonal plaza. The grid runs on past the map's far
   edges (the next blocks' pavement corners show at the cut). Grey "flower" panot on the pavements; Gaudí's blue
   hexagonal panot along Passeig de Gràcia (y = 50, west of x = 50). Zebras cross each arm where the chamfer begins.
   One-way streets with a bus lane on the right and a cycle lane on the left (src/37_traffic.js).
   The seafront: streets along x end at the promenade (x 137–147, palms planted by the places beside it); beyond it
   the sea, with Barceloneta's sand running straight into the water along the beach (y < -63). Boats on the sea,
   people on the pavements. Standing furniture belongs to the places (BC.block), not to this tile. */
const BST = { E: 166, SEA0: 147, SEA1: 200, WZ: -0.6, BEACH: -63, KH: 43, MOUTH0: 80, MOUTH1: 128 };
/* octagon round a centre: half h, 45° cuts with leg c */
BC.oct = (cx, cy, h, c) => [[cx - h + c, cy - h], [cx + h - c, cy - h], [cx + h, cy - h + c], [cx + h, cy + h - c], [cx + h - c, cy + h], [cx - h + c, cy + h], [cx - h, cy + h - c], [cx - h, cy - h + c]];
/* clip a convex polygon to a rectangle */
BC.clip = function (poly, x0, y0, x1, y1) {
  let P = poly;
  const edge = (inside, cut) => { const out = []; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], ia = inside(a), ib = inside(b); if (ia) out.push(a); if (ia !== ib) out.push(cut(a, b)); } P = out; };
  const lx = (X) => (a, b) => { const t = (X - a[0]) / (b[0] - a[0]); return [X, a[1] + (b[1] - a[1]) * t]; };
  const ly = (Y) => (a, b) => { const t = (Y - a[1]) / (b[1] - a[1]); return [a[0] + (b[0] - a[0]) * t, Y]; };
  edge((p) => p[0] >= x0, lx(x0)); if (P.length) edge((p) => p[0] <= x1, lx(x1)); if (P.length) edge((p) => p[1] >= y0, ly(y0)); if (P.length) edge((p) => p[1] <= y1, ly(y1));
  return P;
};

SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const E = BST.E, S0 = BST.SEA0, S1 = BST.SEA1, WZ = BST.WZ, KH = BST.KH, KC = 13.51;
  const W3 = (p) => [p[0], p[1], 0];
  T.ground(function (g) {
    g.boilP = 0.15;
    // the roadway everywhere on land, then the pavement octagons of every block (clipped to the map)
    g.fill(K.rect(-E, -E, 137, E), BP.asph);
    const blocks = [];
    for (let i = -2; i <= 1; i++) for (let j = -2; j <= 2; j++) blocks.push([i * 100, j * 100]);
    for (const [bx, by] of blocks) {
      const k = BC.clip(BC.oct(bx, by, KH, KC), -E, -E, 137, E); if (k.length < 3) continue;
      g.fill(k.map(W3), BP.pave);
      g.scuff(k.map(W3), { dir: -0.55, len: 2.4, c: BP.paveL, dens: 0.35, w: 0.45, spread: 0.7 });
    }
    // asphalt scuffs along the traffic
    for (const c of [-150, -50, 50]) g.scuff(K.rect(c - 7, -E, c + 7, E), { dir: Math.atan2(AY, -AX), len: 9, c: '#DAD5CA', dens: 0.35, w: 0.5, spread: 0.05 });
    for (const c of [-150, -50, 50, 150]) g.scuff(K.rect(-E, c - 7, 137, c + 7), { dir: Math.atan2(AY, AX), len: 9, c: '#DAD5CA', dens: 0.35, w: 0.5, spread: 0.05 });
    // the flower panot: a sparse lattice of little four-petal marks on the pavement rings
    const fl = [];
    for (const [bx, by] of blocks) {
      if (bx < -150 || by < -150 || by > 150) continue;
      for (let a = -42; a <= 42; a += 2.4) for (const [px, py] of [[a, -40], [a, 40], [-40, a], [40, a]]) {
        if (Math.abs(px) + Math.abs(py) > 70 || (bx === 100 && px > 37)) continue;
        if (h2(Math.round((bx + px) * 3), Math.round((by + py) * 3)) < 0.55) continue;
        const p = g.p(bx + px, by + py, 0); fl.push(p[0] - 0.5, p[1], p[0] + 0.5, p[1], p[0], p[1] - 0.3, p[0], p[1] + 0.3);
      }
    }
    g.segs2(fl, '#C9C1B0', 0.35);
    // Passeig de Gràcia: Gaudí's hexagonal panot, blue-grey, on both pavements west of x = 50
    const hx = [], r = 1.15;
    for (const [y0, y1] of [[37.4, 42.6], [57.4, 62.6]]) for (let x = -136; x < 36; x += r * 1.75) for (let y = y0 + 0.6; y < y1; y += r * 1.5) {
      const xx = x + ((Math.round((y - y0) / (r * 1.5)) % 2) ? r * 0.87 : 0), c = [];
      const lx = ((xx % 100) + 150) % 100 - 50; if (Math.abs(lx) > 27.5) continue;
      for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; c.push(g.p(xx + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95, 0)); }
      for (let k = 0; k < 6; k++) hx.push(c[k][0], c[k][1], c[(k + 1) % 6][0], c[(k + 1) % 6][1]);
    }
    g.segs2(hx, '#A9B6BD', 0.3);
    // kerbs
    for (const [bx, by] of blocks) { const k = BC.clip(BC.oct(bx, by, KH, KC), -E, -E, 137, E); if (k.length < 3) continue; const ring = k.map(W3); g.line(ring.concat([ring[0]]), { w: 0.55, c: BP.kerb, boil: false, ext: 0 }); }
    // lane lines (white dashes) and the solid cycle-lane line, broken at the crossings
    const dash = [], solid = [];
    for (const Ln of BCT.lanes) {
      if (Ln.ln === 'bus') continue;
      const off = Ln.ln === 'car' ? 2.55 : 1.55, right = Ln.ax === 'x' ? Ln.d : -Ln.d, c = Ln.c + right * off * (Ln.ln === 'car' ? 1 : 1);
      const hi = Ln.ax === 'x' ? 134 : E - 2;
      for (let s = -E + 2; s < hi; s += (Ln.ln === 'car' ? 7 : 2)) {
        const m = ((s % 100) + 150) % 100 - 50; if (Math.abs(m) > 50 - 25.5) continue;
        const len = Ln.ln === 'car' ? 3.4 : 2.05, a = Ln.ax === 'x' ? g.p(s, c, 0) : g.p(c, s, 0), b = Ln.ax === 'x' ? g.p(s + len, c, 0) : g.p(c, s + len, 0);
        (Ln.ln === 'car' ? dash : solid).push(a[0], a[1], b[0], b[1]);
      }
    }
    g.segs2(dash, '#F6F3EA', 0.8); g.segs2(solid, '#F6F3EA', 0.6);
    // bus lanes: BUS lettering before each crossing
    for (const Ln of BCT.lanes) if (Ln.ln === 'bus') for (const X of [-150, -50, 50, 150]) {
      if (Ln.ax === 'x' && X > 100) continue;
      const s = X - Ln.d * 34; if (Ln.ax === 'x' && (s > 130 || s < -160)) continue; if (Math.abs(s) > 160) continue;
      const P = Ln.ax === 'x' ? (a, z) => [s + a, Ln.c + 1.3 - z, 0] : (a, z) => [Ln.c + 1.3 - z, s - a, 0];
      K.textP(g, P, 0, 0, 2.6, 'BUS', '#F6F3EA', { center: true, w: 0.7 });
    }
    // zebras across every arm where the chamfer begins (20.5..24.5 from the crossing centre), on land only
    for (const X of [-150, -50, 50]) for (const Y of [-150, -50, 50, 150]) for (const sg of [-1, 1]) {
      for (let k = -6.2; k <= 6.3; k += 1.55) {
        const xa = X + sg * 20.8, xb = X + sg * 24.4; if (Math.max(xa, xb) < 136) g.fill(K.rect(Math.min(xa, xb), Y + k - 0.5, Math.max(xa, xb), Y + k + 0.5), '#F6F3EA');
        const ya = Y + sg * 20.8, yb = Y + sg * 24.4; if (Math.abs(ya) < E - 1 && Math.abs(yb) < E - 1) g.fill(K.rect(X + k - 0.5, Math.min(ya, yb), X + k + 0.5, Math.max(ya, yb)), '#F6F3EA');
      }
    }
    // the far edges of the map: an ink line at ground level
    g.line([[-E, E, 0], [-E, -E, 0], [S1, -E, 0]], { w: 0.75, boil: false, ext: 0 });

    /* ---- the seafront ---- */
    // the promenade (granite paving with a timber strip) along the harbour and old town, the beach's sand further up
    const shore = []; for (let i = 0; i <= 24; i++) { const y = lerp(-E, BST.BEACH, i / 24); shore.push([150 + Math.sin(i * 1.3) * 0.9 + Math.sin(i * 0.37) * 1.2, y]); }
    const PM = [[BST.BEACH, BST.MOUTH0], [BST.MOUTH1, E]];
    for (const [ya, yb] of PM) {
      g.fill(K.rect(137, ya, S0, yb), '#E3DACA');
      g.scuff(K.rect(137, ya, S0, yb), { dir: Math.atan2(AY, -AX), len: 3, c: '#EFE9DC', dens: 0.6, w: 0.45, spread: 0.5 });
      g.fill(K.rect(140.5, ya, 142.3, yb), '#CDB48E');
      const plank = []; for (let y = ya; y < yb; y += 1.1) { const a = g.p(140.5, y, 0), b = g.p(142.3, y, 0); plank.push(a[0], a[1], b[0], b[1]); } g.segs2(plank, '#B39A72', 0.25);
    }
    // the sea
    const seaPts = [[S0, E], [S0, BST.MOUTH1], [137, BST.MOUTH1], [137, BST.MOUTH0], [S0, BST.MOUTH0], [S0, BST.BEACH + 2]].concat(shore.slice().reverse().map((p) => [p[0], p[1]])).concat([[S1, -E], [S1, E]]);
    g.fill(seaPts.map((p) => [p[0], p[1], WZ]), BP.sea);
    g.water(seaPts.map((p) => [p[0], p[1], WZ]), { dens: 0.5 });
    // darker water further out
    g.fill([[178, -E, WZ], [S1, -E, WZ], [S1, E, WZ], [178, E, WZ]], 'rgba(111,166,175,0.35)');
    // the beach sand down to the water, a wet band and foam along the line of the sea
    const sand = [[137, -E], [137, BST.BEACH + 2]].concat([[S0, BST.BEACH + 2]]).concat(shore.slice().reverse()).map(W3);
    g.fill(sand, BP.sand);
    g.fill(shore.map((p) => [p[0] - 2.2, p[1], 0]).concat(shore.slice().reverse().map((p) => [p[0], p[1], 0])), BP.sandW);
    g.line(shore.map((p) => [p[0] + 0.6, p[1], WZ]), { w: 0.8, c: '#F6F7F3', boil: false });
    g.line(shore.map((p) => [p[0] + 2.4, p[1], WZ]), { w: 0.5, c: '#E2EFEF', boil: false });
    // the quay wall where the promenade meets the water (its face looks out to sea)
    for (const [ya, yb] of PM) { g.fill([[S0, ya, 0], [S0, yb, 0], [S0, yb, WZ], [S0, ya, WZ]], '#BFB29A'); g.line([[S0, ya, 0], [S0, yb, 0]], { w: 0.75, boil: false, ext: 0 }); g.line([[S0, ya, WZ], [S0, yb, WZ]], { w: 0.5, c: '#5F8F96', boil: false, ext: 0 }); }
    // at night: low lamps along the quay's edge light the promenade, each laying a column of light on the sea
    for (const [ya, yb] of PM) for (let y = ya + 4; y < yb - 2; y += 8) g.glow('lamp', S0 - 0.5, y, 1.3, { r: 0.9 });
    // the harbour mouth: the promenade's quay wall turns along it
    g.fill([[137, BST.MOUTH0, 0], [S0, BST.MOUTH0, 0], [S0, BST.MOUTH0, WZ], [137, BST.MOUTH0, WZ]], '#CDBFA4'); g.line([[137, BST.MOUTH0, 0], [S0, BST.MOUTH0, 0]], { w: 0.75, boil: false });
    g.line([[137, BST.MOUTH1, 0], [S0, BST.MOUTH1, 0]], { w: 0.75, boil: false });
    // a stone groyne where the beach ends
    g.fill([[S0 - 1, BST.BEACH - 1, 0], [S0 + 9, BST.BEACH - 1, WZ + 0.2], [S0 + 9, BST.BEACH + 2.5, WZ + 0.2], [S0 - 1, BST.BEACH + 2.5, 0]], '#C9BFAA');
    g.outline([[S0 - 1, BST.BEACH - 1, 0], [S0 + 9, BST.BEACH - 1, WZ + 0.2], [S0 + 9, BST.BEACH + 2.5, WZ + 0.2], [S0 - 1, BST.BEACH + 2.5, 0]], { w: 0.55, boil: false });

    /* ---- the cut edges on the near sides: ground, promenade, the sea's section ---- */
    const D = 1.1;
    g.fill([[-E, E, 0], [137, E, 0], [137, E, -D], [-E, E, -D]], C.slab); g.line([[-E, E, 0], [-E, E, -D], [137, E, -D]], { w: 0.85 });
    g.fill([[137, E, 0], [S0, E, 0], [S0, E, -D], [137, E, -D]], C.slab);
    g.fill([[S0, E, WZ], [S1, E, WZ], [S1, E, -2.4], [S0, E, -2.4]], '#7FB0B6'); g.fill([[S1, E, WZ], [S1, -E, WZ], [S1, -E, -2.4], [S1, E, -2.4]], '#6C9DA5');
    g.scratch([[S0, E, -0.7], [S1, E, -0.7], [S1, E, -2.3], [S0, E, -2.3]], { c: '#5F8F96' });
    g.line([[-E, E, 0], [S0, E, 0]], { w: 0.85, boil: false }); g.line([[S0, E, WZ], [S1, E, WZ], [S1, -E, WZ]], { w: 0.8, boil: false, c: '#3F6F78' });
    g.line([[S0, E, -2.4], [S1, E, -2.4], [S1, -E, -2.4]], { w: 0.8, boil: false }); g.line([[S1, E, -2.4], [S1, E, WZ]], { w: 0.7, boil: false });
    g.line([[S0, E, 0], [S0, E, -2.4]], { w: 0.6, boil: false }); g.line([[137, E, -D], [S0, E, -D]], { w: 0.6, boil: false });
  });

  /* ---- trees on the pavements beyond the map's outer streets (behind everything, or at the near-left edge) ---- */
  for (let a = -160; a <= 130; a += 10.5) {
    const m = ((a % 100) + 150) % 100 - 50; if (Math.abs(m) > 27) continue;
    T.obj([-161, a], (g) => BC.plane(g, -161, a, { r: 3.6, h: 5.6 }), { name: 'tree' });
    if (a < 128) T.obj([a, -161], (g) => BC.plane(g, a, -161, { r: 3.6, h: 5.6 }), { name: 'tree' });
  }

  /* ---- the traffic ---- */
  const CARS = ['#C9584B', '#E9E2CC', '#3F5F8F', '#8FA3B5', '#F1EFE8', '#7A8C6E', '#B9BCBC', '#B9A27D', '#5F8FC9', '#8E3A36'];
  const draw = (g, ang, kind, col, seed) => {
    if (kind === 'taxi') BC.taxi(g, ang);
    else if (kind === 'bus') BC.bus(g, ang);
    else if (kind === 'tour') BC.tourBus(g, ang, seed);
    else if (kind === 'van') BC.van(g, ang);
    else if (kind === 'moto') BC.scooter(g, ang, BC.who(seed, { bare: false }), col);
    else if (kind === 'bike') BC.bicing(g, ang, BC.who(seed), seed);
    else BC.car(g, ang, { col });
  };
  BCT.lanes.forEach((Ln, li) => {
    for (let k = 0; k < Ln.kinds.length; k++) {
      const kind = Ln.kinds[k], col = CARS[(li * 3 + k * 7) % CARS.length], seed = 7000 + li * 10 + k;
      T.actor({ cast: false, sample: 0.18, period: BCT.P,
        at(t) {
          const p = BCT.pos(li, k, t);
          const lim = Ln.ax === 'x' ? Math.min((E - 3 + p.x) / 10, (134 - p.x) / 6) : (E - 3 - Math.abs(p.y)) / 10, edge = Math.min(1, lim, (E - 3 - Math.abs(p.y)) / 10);
          if (edge <= 0.02) return null;
          return { x: p.x, y: p.y, key: 'v', ang: p.ang, alpha: edge < 1 ? edge : null };
        },
        draw(g, st) { draw(g, st.ang, kind, col, seed); } });
    }
  });

  /* ---- people on the pavements: walking round blocks on their pavement rings ---- */
  const ring = (bx, by, r) => [[bx - r + 13, by - r], [bx + r - 13, by - r], [bx + r, by - r + 13], [bx + r, by + r - 13], [bx + r - 13, by + r], [bx - r + 13, by + r], [bx - r, by + r - 13], [bx - r, by - r + 13]];
  let wi = 0;
  for (const [bx, by] of [[-100, -100], [0, -100], [-100, 0], [0, 0], [-100, 100], [0, 100], [100, 0], [100, -100]]) {
    const n = bx === 0 && by === 0 ? 3 : 2;
    for (let k = 0; k < n; k++) {
      let pts = ring(bx, by, 40.6 + (k % 2) * 0.8); if (k % 2) pts = pts.slice().reverse();
      BC.walker(T, BC.who(7300 + wi), pts, 1.35 + h1(wi * 7) * 0.4, { phase: h1(wi * 13 + 5), cast: false }); wi++;
    }
  }
  // the seafront promenade: strollers, a jogger, a skater
  for (let i = 0; i < 6; i++) { const x = 139 + (i % 3) * 2.6, pts = i < 3 ? [[x, BST.BEACH + 4], [x, BST.MOUTH0 - 2]] : [[x, BST.MOUTH1 + 2], [x, 162]]; BC.walker(T, BC.who(7400 + i, i === 2 ? { top: '#E6C24F', shorts: true, bare: true } : {}), pts, i === 2 ? 3.2 : 1.3 + h1(i) * 0.3, { phase: h1(i * 31), cast: false }); }

  /* ---- boats on the sea ---- */
  // a golondrina running along the coast and back, sailboats tacking further out, a ferry on the horizon line
  T.actor({ cast: false, sample: 0.25, period: 60, grow: false,
    at(t) { const u = (t / 60) % 1, f = u < 0.5 ? u * 2 : 2 - u * 2, y = lerp(150, -150, smooth(f)), d = u < 0.5 ? -1 : 1, a = Math.min(1, (166 - Math.abs(y)) / 12); return { x: 158, y, z: WZ, key: d, d, alpha: a < 1 ? a : null }; },
    draw(g, st) { BC.golondrina(g, st.d > 0 ? Math.PI / 2 : -Math.PI / 2, 3); } });
  for (let i = 0; i < 3; i++) T.actor({ cast: false, sample: 0.3, period: 80, grow: false,
    at(t) { const u = ((t / 80 + i * 0.37) % 1), y = lerp(175, -175, u), x = 172 + i * 8 + Math.sin(u * TAU * 2 + i) * 3, a = Math.min(1, (168 - Math.abs(y)) / 10); if (a <= 0.02) return null; return { x, y, z: WZ, key: 's' + i, alpha: a < 1 ? a : null }; },
    draw(g) { K.boat(g, -Math.PI / 2 + 0.25, { kind: 'sail', L: 3.6, W: 1.3, hull: ['#F3F1EA', '#2F4A63', '#C9584B'][i], mast: 10 + i }); } });
  T.actor({ cast: false, sample: 0.5, period: 120, grow: false,
    at(t) { const u = (t / 120) % 1, y = lerp(-180, 180, u), a = Math.min(1, (170 - Math.abs(y)) / 14); if (a <= 0.02) return null; return { x: 192, y, z: WZ, key: 'f', alpha: a < 1 ? a : null }; },
    // the night ferry to the Balearics: its saloon windows lit
    draw(g) { K.boat(g, Math.PI / 2, { kind: 'ferry', L: 11, W: 3.0, hull: '#F3F1EA', stripe: '#2F5A8C', stackCol: { t: '#2F5A8C', l: '#3F70A8', r: '#2F5A8C' } }); BC.litPanes(g, 0, C.navy, '#FFE3A6', true); } });
});
