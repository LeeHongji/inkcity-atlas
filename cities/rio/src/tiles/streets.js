'use strict';
/* Rio's streets, the beach, the ocean and the bay (one map-wide tile).
   Every block is ringed by a 6 u pavement of Portuguese stone (pale limestone with black basalt motifs); 14 u roadways
   between, yellow centre dashes, zebras on every arm. Along the ocean edge: Avenida Atlântica (the street at x = 150),
   then Burle Marx's calçadão with the black-and-white wave running parallel to the shore (x 157–167), the sand down to
   the surf (shore ~186), the Atlantic to x = 205. Along the far right edge: the bay road (y = -150), its quay promenade
   (y -163..-157) and Guanabara Bay to y = -184. Traffic is a timetable (src/37_traffic.js). Boats: the Niterói ferry
   in the bay, fishing boats and a cargo ship on the ocean, breakers rolling in along the whole beach. */
const RS = { E: 166, KH: 43, CAL0: 157, CAL1: 167, SEA1: 205, BAYQ: -163, BAY1: -184, WZ: -0.6 };
RS.shore = function (y) {
  const base = 186 + Math.sin(y * 0.07) * 1.0 + Math.sin(y * 0.023 + 1) * 0.9;
  return y < -105 ? lerp(RS.CAL1, base, smooth((y + 128) / 23)) : base;
};

SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const E = RS.E, KH = RS.KH, C0 = RS.CAL0, C1 = RS.CAL1, S1 = RS.SEA1, BQ = RS.BAYQ, B1 = RS.BAY1, WZ = RS.WZ;
  const blocks = []; for (const bx of [-200, -100, 0, 100]) for (const by of [-100, 0, 100, 200]) blocks.push([bx, by]);
  const clipR = (x0, y0, x1, y1) => [Math.max(x0, -E), Math.max(y0, -157), Math.min(x1, C0), Math.min(y1, E)];
  T.ground(function (g) {
    g.boilP = 0.12;
    /* ---- water first: the bay strip and the ocean ---- */
    const bay = [[-E, B1, WZ], [S1, B1, WZ], [S1, BQ, WZ], [-E, BQ, WZ]];
    g.fill(bay, RP.bay); g.water(bay, { dens: 0.45 });
    const ocean = [[C1, BQ, WZ], [S1, BQ, WZ], [S1, E, WZ], [C1, E, WZ]];
    g.fill(ocean, RP.sea); g.water(ocean, { dens: 0.5 });
    g.fill([[196, B1, WZ], [S1, B1, WZ], [S1, E, WZ], [196, E, WZ]], 'rgba(70,140,160,0.25)');
    /* ---- land: the roadway everywhere, then the pavement rings of every block ---- */
    g.fill(K.rect(-E, -157, C0, E), RP.asph);
    for (const [bx, by] of blocks) {
      const r = clipR(bx - KH, by - KH, bx + KH, by + KH); if (r[0] >= r[2] || r[1] >= r[3]) continue;
      g.fill(K.rect(r[0], r[1], r[2], r[3]), RP.pave);
    }
    // asphalt scuffs along the traffic
    for (const c of [-150, -50, 50, 150]) g.scuff(K.rect(c - 7, -157, c + 7, E), { dir: Math.atan2(AY, -AX), len: 9, c: '#E0DACD', dens: 0.3, w: 0.5, spread: 0.05 });
    for (const c of [-150, -50, 50, 150]) g.scuff(K.rect(-E, c - 7, C0, c + 7), { dir: Math.atan2(AY, AX), len: 9, c: '#E0DACD', dens: 0.3, w: 0.5, spread: 0.05 });
    // the Portuguese stone: black motifs on the rings (not under the places)
    for (const [bx, by] of blocks) {
      const r = clipR(bx - KH, by - KH, bx + KH, by + KH); if (r[0] >= r[2] || r[1] >= r[3]) continue;
      RJ.mosaic(g, r[0], r[1], r[2], r[3], { sp: 2.6, skip: (x, y) => Math.abs(x - bx) < 37.6 && Math.abs(y - by) < 37.6 });
      g.line(K.rect(r[0], r[1], r[2], r[3]).concat([[r[0], r[1], 0]]), { w: 0.5, c: RP.kerb, boil: false, ext: 0 });
    }
    // yellow centre dashes, broken at the crossings
    const dash = [];
    for (const c of [-150, -50, 50, 150]) {
      for (let s = -157; s < E - 2; s += 7) { const m = ((s % 100) + 150) % 100 - 50; if (Math.abs(m) > 50 - 14 || s < -142) continue; const a = g.p(c, s, 0), b = g.p(c, s + 3.4, 0); dash.push(a[0], a[1], b[0], b[1]); }
      for (let s = -E + 1; s < C0 - 9; s += 7) { const m = ((s % 100) + 150) % 100 - 50; if (Math.abs(m) > 50 - 14 || s > 140) continue; const a = g.p(s, c, 0), b = g.p(s + 3.4, c, 0); dash.push(a[0], a[1], b[0], b[1]); }
    }
    g.segs2(dash, '#E6B83A', 0.85);
    // zebras on every arm of every crossing
    for (const X of [-150, -50, 50, 150]) for (const Y of [-150, -50, 50, 150]) for (const sg of [-1, 1]) {
      for (let k = -5.8; k <= 5.9; k += 1.45) {
        const xa = X + sg * 8, xb = X + sg * 11.6; if (Math.max(xa, xb) < C0 && Math.min(xa, xb) > -E) g.fill(K.rect(Math.min(xa, xb), Y + k - 0.45, Math.max(xa, xb), Y + k + 0.45), '#F6F3EA');
        const ya = Y + sg * 8, yb = Y + sg * 11.6; if (Math.min(ya, yb) > -157 && Math.max(ya, yb) < E) g.fill(K.rect(X + k - 0.45, Math.min(ya, yb), X + k + 0.45, Math.max(ya, yb)), '#F6F3EA');
      }
    }
    /* ---- the bay promenade and the calçadão ---- */
    g.fill(K.rect(-E, BQ, C1, -157), '#E9E2D2');
    RJ.mosaic(g, -E, BQ, C0, -157, { sp: 2.4 });
    g.line([[-E, BQ, 0], [C1, BQ, 0]], { w: 0.8, boil: false, ext: 0 });
    RJ.waves(g, C0, C1, -157, 63, { lam: 8.4, amp: 1.35, bw: 1.3, gap: 2.6 }); RJ.wavesX(g, C0, C1, 63, E, { lam: 10, amp: 1.2, bw: 1.15, gap: 2.4 });
    g.line([[C0, -157, 0], [C0, E, 0]], { w: 0.55, c: RP.kerb, boil: false, ext: 0 });
    /* ---- the sand, its wet edge and the foam ---- */
    const sh = []; for (let y = -128; y <= E + 0.01; y += 4) sh.push([RS.shore(y), y]);
    const sand = [[C1, -128, 0]].concat(sh.map((p) => [p[0], p[1], 0])).concat([[C1, E, 0]]);
    g.fill(sand, RP.sand);
    g.scuff(sand, { dir: -0.4, len: 1.6, c: RP.sandD, dens: 0.35, w: 0.45, spread: 1.2 });
    g.fill(sh.map((p) => [p[0] - 3, p[1], 0]).concat(sh.slice().reverse().map((p) => [p[0], p[1], 0])), RP.sandW);
    g.line([[C1, -128, 0], [C1, E, 0]], { w: 0.6, c: '#B8A57E', boil: false, ext: 0 });
    g.line(sh.map((p) => [p[0] + 0.5, p[1], WZ]), { w: 0.9, c: RP.foam, boil: false });
    g.line(sh.map((p) => [p[0] + 2.6, p[1], WZ]), { w: 0.6, c: '#E4F1F1', boil: false });
    g.line(sh.map((p) => [p[0] + 5.5, p[1], WZ]), { w: 0.45, c: '#D4EAEC', boil: false });
    /* ---- far edges: an ink line at ground level ---- */
    g.line([[-E, E, 0], [-E, BQ, 0]], { w: 0.75, boil: false, ext: 0 });
    g.line([[-E, BQ, WZ], [-E, B1, WZ], [S1, B1, WZ]], { w: 0.7, c: '#3F6F78', boil: false, ext: 0 });
    /* ---- the cut edges on the near sides: ground, sand, the sea's section ---- */
    const D = 1.1, se = RS.shore(E);
    g.fill([[-E, E, 0], [C1, E, 0], [C1, E, -D], [-E, E, -D]], C.slab); g.scratch([[-E, E, -0.2], [C1, E, -0.2], [C1, E, -D], [-E, E, -D]], { c: '#B9A88C' });
    g.fill([[C1, E, 0], [se, E, 0], [se, E, -D], [C1, E, -D]], '#D9C08C');
    g.fill([[se, E, WZ], [S1, E, WZ], [S1, E, -2.4], [se, E, -2.4]], '#6FAEB8'); g.fill([[S1, E, WZ], [S1, B1, WZ], [S1, B1, -2.4], [S1, E, -2.4]], '#5E9AA6');
    g.scratch([[se, E, -0.8], [S1, E, -0.8], [S1, E, -2.3], [se, E, -2.3]], { c: '#4F858F' });
    g.line([[-E, E, 0], [se, E, 0]], { w: 0.85, boil: false }); g.line([[-E, E, -D], [se, E, -D]], { w: 0.85, boil: false });
    g.line([[se, E, WZ], [S1, E, WZ], [S1, B1, WZ]], { w: 0.8, boil: false, c: '#3F6F78' });
    g.line([[se, E, -2.4], [S1, E, -2.4], [S1, B1, -2.4]], { w: 0.8, boil: false }); g.line([[S1, E, -2.4], [S1, E, WZ]], { w: 0.7, boil: false });
    g.line([[-E, E, 0], [-E, E, -D]], { w: 0.7, boil: false }); g.line([[se, E, -D], [se, E, -2.4]], { w: 0.6, boil: false });
  });

  /* ---- the traffic ---- */
  const CARS = ['#F3F1EA', '#B9BCBC', '#2F343B', '#C9392E', '#8FA3B5', '#F3F1EA', '#3F5F8F', '#B9A27D', '#6C7A89'];
  const draw = (g, ang, kind, col, seed) => {
    if (kind === 'taxi') RJ.taxi(g, ang);
    else if (kind === 'bus') RJ.bus(g, ang, seed);
    else if (kind === 'kombi') RJ.kombi(g, ang, ['#3F78B5', '#C9392E', '#3A9A5B'][seed % 3]);
    else if (kind === 'moto') RJ.moto(g, ang, RJ.who(seed, { carnaval: false }), { vest: '#EE8A2E', col: ['#C9392E', '#2A2622', '#2F6DB5'][seed % 3], pass: seed % 2 ? RJ.who(seed + 50) : null });
    else if (kind === 'bike') K.bike(g, ang, { col: '#EE8A2E', who: RJ.who(seed), seed });
    else RJ.car(g, ang, { col });
  };
  RJT.lanes.forEach((Ln, li) => {
    for (let k = 0; k < Ln.kinds.length; k++) {
      const kind = Ln.kinds[k], col = CARS[(li * 3 + k * 7) % CARS.length], seed = 9000 + li * 10 + k;
      T.actor({ cast: false, sample: 0.18, period: RJT.P,
        at(t) { const p = RJT.pos(li, k, t), a = RJT.alpha(li, p.s); if (a <= 0.02) return null; return { x: p.x, y: p.y, key: 'v', ang: p.ang, alpha: a < 1 ? a : null }; },
        draw(g, st) { draw(g, st.ang, kind, col, seed); } });
    }
  });

  /* ---- people on the pavements, walking round the blocks ---- */
  let wi = 0;
  for (const [bx, by] of [[-100, -100], [0, -100], [-100, 0], [0, 0], [-100, 100], [0, 100], [100, -100], [100, 0], [100, 100]]) {
    for (let k = 0; k < 2; k++) {
      const r = 40 + (k % 2) * 0.9; let pts = [[bx - r, by - r], [bx + r, by - r], [bx + r, by + r], [bx - r, by + r]]; if (k % 2) pts = pts.slice().reverse();
      RJ.walker(T, RJ.who(7300 + wi), pts, 1.3 + h1(wi * 7) * 0.4, { phase: h1(wi * 13 + 5), cast: false }); wi++;
    }
  }
  // the calçadão: strollers, joggers, a skater, cyclists on the wave
  for (let i = 0; i < 8; i++) {
    const x = 159 + (i % 4) * 2.2, fwd = i % 2 === 0, pts = fwd ? [[x, -150], [x, 172]] : [[x, 172], [x, -150]];
    const w = RJ.who(7400 + i, i === 2 || i === 5 ? { beach: true } : {});
    if (i === 3) { T.actor({ cast: false, sample: 0.3, period: 322 / 5, at(t) { const u = ((t * 5 + 40) % 322), y = 170 - u, a = Math.min(1, (u) / 8, (322 - u) / 8); return { x: 164.2, y, key: 'b', alpha: a < 1 ? a : null }; }, draw(g) { K.bike(g, -Math.PI / 2, { col: '#EE8A2E', who: RJ.who(7480), seed: 7480 }); } }); continue; }
    T.actor({ cast: false, sample: 0.25, period: 322 / (i === 1 ? 3.4 : 1.3),
      at(t) { const sp = i === 1 ? 3.4 : 1.3 + h1(i) * 0.3, u = ((t * sp + h1(i * 9) * 322) % 322), y = fwd ? -150 + u : 172 - u, a = Math.min(1, u / 6, (322 - u) / 6), ph = Math.floor((u / 2.4) % 1 * 8); return { x, y, key: (fwd ? 1 : 3) + '.' + ph, dir: fwd ? 1 : 3, ph: ph / 8, alpha: a < 1 ? a : null }; },
      draw(g, st) { RJ.person(g, 0, 0, 0, Object.assign({}, w, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
  }

  /* ---- boats ---- */
  // the Niterói ferry crossing the bay and back
  T.actor({ cast: false, sample: 0.3, period: 70, grow: false,
    at(t) { const u = (t / 70) % 1, f = u < 0.5 ? u * 2 : 2 - u * 2, x = lerp(48, 220, smooth(f)), a = Math.min(1, (212 - x) / 10); if (a <= 0.02) return null; return { x, y: -175, z: WZ, key: u < 0.5 ? 1 : 0, d: u < 0.5, alpha: a < 1 ? a : null }; },
    draw(g, st) { RJ.ferry(g, st.d ? 0 : Math.PI); } });
  // sailboats in the bay
  for (let i = 0; i < 2; i++) T.actor({ cast: false, sample: 0.4, period: 90, grow: false,
    at(t) { const u = ((t / 90 + i * 0.5) % 1), x = lerp(-160, 200, u), a = Math.min(1, (x + 160) / 10, (200 - x) / 10, Math.abs(x - 1) > 46 ? 1 : 0); if (a <= 0.02) return null; return { x, y: -170 - i * 8, z: WZ, key: 's' + i, alpha: a < 1 ? a : null }; },
    draw(g) { K.boat(g, 0.15, { kind: 'sail', L: 3.2, W: 1.2, hull: ['#F3F1EA', '#2F4A63'][i], mast: 9 }); } });
  // out on the ocean: fishing boats and a cargo ship on the horizon line
  for (let i = 0; i < 2; i++) T.actor({ cast: false, sample: 0.5, period: 120, grow: false,
    at(t) { const u = ((t / 120 + i * 0.45) % 1), y = lerp(-170, 170, u), a = Math.min(1, (168 - Math.abs(y)) / 10, (Math.abs(y - 48) - 16) / 6); if (a <= 0.02) return null; return { x: 203, y, z: WZ, key: 'f' + i, alpha: a < 1 ? a : null }; },
    draw(g) { K.boat(g, Math.PI / 2, { kind: 'motor', L: 3.4, W: 1.3, hull: ['#3F78B5', '#D9463B'][i], stripe: '#F3F1EA' }); } });
  // breakers rolling in along the whole beach: a curl of white water that runs up the sand and fades
  for (let i = 0; i < 14; i++) {
    const y0 = -110 + i * 20 + h1(i * 7) * 6, per = 5.5 + h1(i * 3) * 2, off = h1(i * 11) * per;
    T.actor({ cast: false, sample: 0.4, period: per, grow: false,
      at(t) { const u = (((t + off) / per) % 1), q = Math.floor(u * 10); if (q >= 9) return null; const xs = RS.shore(y0 + 9); return { x: xs + 9 - q * 0.9, y: y0 + 9, z: WZ, key: q, q, alpha: q > 6 ? (9 - q) / 3 : null }; },
      draw(g, st) {
        const pts = [], n = 10, len = 18;
        for (let k = 0; k <= n; k++) { const v = -len + len * k / n; pts.push(g.p(Math.sin(k / n * Math.PI) * 0.9 - 0.1 * st.q, v, 0)); }
        const back = pts.map((p) => [p[0] - 2.6, p[1] - 1.5]).reverse();
        g.fill2(pts.concat(back), 'rgba(246,248,243,0.75)');
        g.line2(pts, { w: 0.7, c: '#FFFFFF', boil: false });
      } });
  }
});
