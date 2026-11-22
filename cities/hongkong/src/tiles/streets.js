'use strict';
/* Hong Kong's streets (the one map-wide tile; the harbour and the market lanes are drawn inside it by HARBOUR and
   MARKETS). Compass: north = +y (Kowloon, near), west = +x.
   - The tram street y = -50 (Des Voeux Road) across the whole Island: two tram tracks in the middle, a car lane each
     side (left-hand traffic), tram-stop islands with shelters, green poles on both kerbs carrying the span wires and
     the two contact wires, grey-green railings along the kerbs, zebras painted 望右 LOOK RIGHT at the kerbs.
   - The tunnel road x = -50 from the hills down to the Cross-Harbour Tunnel's Island portal (y 12..24), and on in
     Kowloon from its portal (y 76..88, the two mouths facing us) to the map's edge. A yellow box at the tram crossing.
   - The market lanes x = +50: Graham Street on the Island, Temple Street in Kowloon (MARKETS).
   Traffic is the timetable of src/37_timetable.js: no lights, phases searched so nothing ever overlaps. */
SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const E = HT.END, A = HK.C.asph, LINE = HK.C.line, I = HT.HAR.I, Kw = HT.HAR.K;
  const bands = [[-E, -63, E, -37], [-63, -E, -37, -63], [-63, -37, -37, I], [-63, Kw, -37, E]];
  T.ground(function (g) {
    for (const b of bands) g.fill(K.rect(b[0], b[1], b[2], b[3]), A);
    for (const b of bands) { const alongY = b[3] - b[1] > b[2] - b[0], d = alongY ? Math.atan2(AY, -AX) : Math.atan2(AY, AX), p = K.rect(b[0], b[1], b[2], b[3]); g.scuff(p, { dir: d, len: 9, c: '#DFDACE', dens: 0.4, w: 0.55, spread: 0.05 }); g.scuff(p, { dir: d, len: 6, c: '#C6C0B2', dens: 0.1, w: 0.45, spread: 0.04 }); }
    // the tram tracks: two rails each, a darker setts strip between them
    const rails = [];
    for (const yt of [HT.LANES.TW.c, HT.LANES.TE.c]) {
      g.fill(K.rect(-E, yt - 0.95, E, yt + 0.95), '#C9C3B5');
      for (const dv of [-0.75, 0.75]) { const a = g.p(-E, yt + dv, 0), b = g.p(E, yt + dv, 0); rails.push(a[0], a[1], b[0], b[1]); }
    }
    g.segs2(rails, '#8C877C', 0.42);
    // lane lines between the car lanes and the tracks; the kerbs
    const dash = (a, b, c) => g.line([a, b], { c: c || LINE, w: 0.85, boil: false, ext: 0.2 });
    for (const y of [-55.3, -44.7]) for (let x = -E + 2; x < E - 4; x += 7) { if (x > -65 && x < -35) continue; dash([x, y, 0], [x + 3.4, y, 0]); }
    for (let y = -E + 2; y < E - 4; y += 9) { if (y > -66 && y < -34) continue; if (y > I - 14 && y < Kw + 12) continue; dash([-50, y, 0], [-50, y + 4.2, 0]); }
    const kerb = { w: 0.55, c: '#9E9A90', boil: false };
    for (const y of [-63, -37]) { g.line([[-E, y, 0], [-63, y, 0]], kerb); g.line([[-37, y, 0], [E, y, 0]], kerb); }
    for (const x of [-63, -37]) { g.line([[x, -E, 0], [x, -63, 0]], kerb); g.line([[x, -37, 0], [x, I, 0]], kerb); g.line([[x, Kw, 0], [x, E, 0]], kerb); }
    // the yellow box at the tram crossing
    { const x0 = -62, x1 = -38, y0 = -62, y1 = -38, segs = [], Y = HK.C.yel;
      g.outline(K.rect(x0, y0, x1, y1), { c: Y, w: 0.6, boil: false });
      for (let k = -24; k <= 24; k += 3.4) for (const sgn of [1, -1]) { const pts = []; for (let t = -12; t <= 12; t += 0.5) { const x = -50 + t, y = -50 + sgn * (t - k); if (x >= x0 && x <= x1 && y >= y0 && y <= y1) pts.push([x, y]); } if (pts.length > 1) { const a = g.p(pts[0][0], pts[0][1], 0), b = g.p(pts[pts.length - 1][0], pts[pts.length - 1][1], 0); segs.push(a[0], a[1], b[0], b[1]); } }
      g.segs2(segs, Y, 0.42); }
    // zebras across the tram street, with 望右 LOOK RIGHT at both kerbs (traffic keeps left: look right first)
    for (const zx of [-104, 4, 104]) {
      for (let y = -62; y < -38; y += 2.1) g.fill(K.rect(zx - 2.3, y, zx + 2.3, y + 1.15), LINE);
      for (const yb of [-60.2, -38.6]) {
        const P = (a, z) => [zx + 3.2 + a, yb - z * 0.9, 0.02];
        HK.zh(g, P, 0, 1.5, 1.5, '望右', LINE, { w: 0.42 });
        K.textP(g, P, 3.8, 0, 0.9, 'LOOK RIGHT', LINE, { w: 0.38 });
      }
    }
    // the cut ends at the map's near edges: Kowloon's two streets at y = E, the tram street at x = E
    for (const cx of [-50, 50]) { g.fill([[cx - 13, E, -1.1], [cx + 13, E, -1.1], [cx + 13, E, 0], [cx - 13, E, 0]], C.slab); g.line([[cx - 13, E, 0], [cx - 13, E, -1.1], [cx + 13, E, -1.1], [cx + 13, E, 0]], { w: 0.85, boil: false }); }
    g.fill([[E, -63, -1.1], [E, -37, -1.1], [E, -37, 0], [E, -63, 0]], C.slabD); g.line([[E, -63, 0], [E, -63, -1.1], [E, -37, -1.1], [E, -37, 0]], { w: 0.85, boil: false });
    for (const cx of [-50, 50]) g.line([[cx - 13, -E, 0], [cx + 13, -E, 0]], { w: 0.85, boil: false });
    g.line([[-E, -63, 0], [-E, -37, 0]], { w: 0.85, boil: false });
    // the tram-stop islands
    for (const [x0, x1, y0, y1] of [[-25, -11, -56.6, -54.0], [15, 29, -46.0, -43.4]]) { g.fill(K.rect(x0, y0, x1, y1), '#E2DCCD'); g.outline(K.rect(x0, y0, x1, y1), { w: 0.5, c: '#8E897E', boil: false }); }
  });
  HARBOUR(T);
  MARKETS(T);

  /* ---- the tram-stop shelters: a thin roof on two posts, railings, a timetable board ---- */
  for (const [x0, x1, y0, y1] of [[-25, -11, -56.6, -54.0], [15, 29, -46.0, -43.4]]) {
    const mx = (x0 + x1) / 2, yc = (y0 + y1) / 2;
    T.obj([x0, y0, x1, y1], (g) => {
      HK.rail(g, [x0 + 0.3, y0 + 0.2], [x1 - 0.3, y0 + 0.2], { h: 1.6 }); HK.rail(g, [x0 + 0.3, y1 - 0.2], [x1 - 0.3, y1 - 0.2], { h: 1.6 });
      const s = []; for (const x of [mx - 3.4, mx + 3.4]) { const a = g.p(x, yc, 0), b = g.p(x, yc, 6.4); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#2F5B44', 0.5);
      const r = [[mx - 4.6, y0 - 0.3, 6.4], [mx + 4.6, y0 - 0.3, 6.4], [mx + 4.6, y1 + 0.3, 6.6], [mx - 4.6, y1 + 0.3, 6.6]]; g.fill(r, '#3E7A5A'); g.outline(r, { w: 0.45, c: '#1F3A2C', boil: false });
      const i0 = g.cmds.length; K.sign(g, 'L', y1 - 0.4, mx - 1.8, mx + 1.8, 2.4, 4.4, '#F3F1EA', 'TRAM', { w: 0.3 }); HK.nite(g, i0, { nc: true });
      HK.board(g, 'L', y1 - 0.38, mx - 1.4, mx + 1.4, 4.5, 5.9, '#2F6B4A', '電車', { w: 0.3 });
      for (const x of [mx - 2.4, mx + 2.4]) g.glow('lamp', x, yc, 6.2, { r: 1.2 });          // night: the lamps under the shelter roof
    }, { name: 'tram stop' });
  }
  /* ---- tram poles on both kerbs, span wires across, the two contact wires along (each pole carries its own stretch) ---- */
  const PX = [-158, -136, -114, -92, -71, -29, -6, 16, 34.4, 65.6, 88, 110, 132, 154];
  const WZ = 12.0;
  PX.forEach((x, i) => {
    // at night every pole carries its street lamp
    T.obj([x, -62.4], (g) => { HK.tramPole(g, x, -62.4, WZ + 1.2); g.glow('lamp', x, -61.6, WZ - 0.4, { r: 1.3 }); }, { name: 'tram pole' });
    T.obj([x, -37.6], (g) => {
      HK.tramPole(g, x, -37.6, WZ + 1.2); g.glow('lamp', x, -38.4, WZ - 0.4, { r: 1.3 });
      g.fine([[x, -62.4, WZ + 0.8], [x, -50, WZ + 0.35], [x, -37.6, WZ + 0.8]], { w: 0.28, c: '#3A3530' });
      if (i + 1 < PX.length) for (const yt of [HT.LANES.TW.c, HT.LANES.TE.c]) g.fine([[x, yt, WZ], [PX[i + 1], yt, WZ]], { w: 0.3, c: '#3A3530' });
    }, { name: 'tram pole' });
  });
  /* ---- railings along the tram street's kerbs, in short pieces (gaps at the zebras and crossings) ---- */
  const gaps = [[-108, -100], [0, 8], [100, 108], [-64, -36], [36, 64]];
  for (const y of [-62.8, -37.2]) for (let x = -E + 4; x < E - 4; x += 16) {
    let a = x, b = Math.min(x + 16, E - 4); for (const [g0, g1] of gaps) { if (a >= g0 && a < g1) a = g1; if (b > g0 && b <= g1) b = g0; }
    if (b - a < 2) continue;
    const mid = gaps.find(([g0, g1]) => a < g0 && b > g1);
    const pieces = mid ? [[a, mid[0]], [mid[1], b]] : [[a, b]];
    for (const [p0, p1] of pieces) if (p1 - p0 > 2) T.obj([p0, y - 0.2, p1, y + 0.2], (g) => HK.rail(g, [p0, y], [p1, y]), { name: 'railing' });
  }
  /* ---- lamps along the tunnel road ---- */
  for (const [x, y, arm] of [[-64.2, -130, 2.4], [-35.8, -100, -2.4], [-64.2, -20, 2.4], [-35.8, 4, -2.4], [-64.2, 104, 2.4], [-35.8, 132, -2.4]]) T.obj([x, y], (g) => HK.lamp(g, x, y, { arm }), { name: 'lamp' });

  /* ---- the Cross-Harbour Tunnel portals ---- */
  T.obj([-63, I - 12, -37, I], (g) => {
    const C0 = { t: '#D9D4C8', l: '#E6E1D5', r: '#CFC9BC' };
    K.box(g, -63, I - 12, -37, I, 0, 6.6, C0, { w: 0.9 });
    g.fill(K.rect(-62, I - 11, -38, I - 1, 6.62), '#C7D1AE'); g.grass(K.rect(-62, I - 11, -38, I - 1, 6.62), { dens: 0.5 });
    for (const x of [-60, -52, -44]) { const c = g.p(x + 2, I - 6, 6.6); g.disc2([c[0], c[1] - 2.2], 2.6, '#8FB868'); }
    const i0 = g.cmds.length; K.sign(g, 'L', I, -61, -39, 3.6, 5.2, '#2F4F6E', 'CROSS-HARBOUR TUNNEL', { w: 0.35 }); HK.nite(g, i0, { nc: true }); HK.signGlow(g, 'L', I, -61, -39, 3.6, 5.2, '#8FB8E0', 0.2);
    g.fill(K.on('R', -37, I - 11.5, I - 0.5, 0.3, 3.2), '#C9C3B5');
  }, { name: 'tunnel portal', under: 6 });
  T.obj([-63, Kw, -37, Kw + 12], (g) => {
    const C0 = { t: '#D9D4C8', l: '#E6E1D5', r: '#CFC9BC' }, y1 = Kw + 12;
    K.box(g, -63, Kw, -37, y1, 0, 6.6, C0, { w: 0.9 });
    g.fill(K.rect(-62, Kw + 1, -38, y1 - 1, 6.62), '#C7D1AE'); g.grass(K.rect(-62, Kw + 1, -38, y1 - 1, 6.62), { dens: 0.5 });
    // the two mouths facing us, dark inside, a lit strip on the ceiling
    for (const xc of [HT.LANES.S.c, HT.LANES.N.c]) {
      const m = [[xc - 4.4, y1 + 0.02, 0], [xc + 4.4, y1 + 0.02, 0]]; for (let k = 0; k <= 10; k++) { const t = Math.PI * k / 10; m.push([xc + 4.4 * Math.cos(t), y1 + 0.02, 3.4 + 1.4 * Math.sin(t)]); }
      g.fill(m, '#2E2B28'); g.mark({ nc: '#6A4C2E' }); g.line([[xc - 3, y1 + 0.03, 4.2], [xc + 3, y1 + 0.03, 4.2]], { w: 0.5, c: '#F4D58A', boil: false }); HK.nite(g, g.cmds.length - 1, { nc: '#FFD27A' });   // the tunnel lit amber inside at night
      g.outline(m, { w: 0.6, boil: false });
      g.glow('lantern', xc, y1 + 0.1, 3.0, { r: 3.2, col: '#FFB45C' });
    }
    const i0 = g.cmds.length; K.sign(g, 'L', y1, -61, -39, 5.3, 6.3, '#2F4F6E', 'CROSS-HARBOUR TUNNEL', { w: 0.3 }); HK.nite(g, i0, { nc: true }); HK.signGlow(g, 'L', y1, -61, -39, 5.3, 6.3, '#8FB8E0', 0.2);
  }, { name: 'tunnel portal', under: 6.5 });

  /* ---- traffic ---- */
  const CARCOL = ['#8FA3B5', '#F1EFE8', '#2F343B', '#B9A27D', '#6C7A89', '#E7E2D6'];
  HT.CARS.forEach((c, i) => {
    const hl = HT.HL[c.kind], opt = c.kind === 'bus' ? { livery: c.l === 'W' || c.l === 'E' ? 'ctb' : 'kmb', route: ['5B', '10', '101', '18'][i % 4] } : c.kind === 'mini' ? { red: i % 3 === 0 } : c.kind === 'taxi' ? { green: i === 11 } : { col: CARCOL[i % CARCOL.length] };
    T.actor({ cast: false, sample: 0.18, period: HT.P,
      at(t) {
        const s = HT.carS(c, t); if (s == null) return null;
        const p = HT.place(c.l, s, hl), a = HT.alpha(p.x, p.y, c.l); if (a <= 0.02) return null;
        return { x: p.x, y: p.y, key: c.l, ang: p.ang, alpha: a < 1 ? a : null };
      },
      draw(g, st) { HK.vehicle(g, st.ang, c.kind, opt); } });
  });
  const LIV = [{ zh: '香港電車' }, { col: '#8E2F2F', top: '#F1E6CF', word: 'DING DING' }, { col: '#2F6B4A', zh: '香港電車' }, { col: '#D9A93E', top: '#F6EED8', word: 'MILK TEA', ink: '#5A2A1E' }, { col: '#3F5F8F', top: '#E9EEF2', word: 'HONG KONG' }, { col: '#2F6B4A', zh: '香港電車' }];
  ['TW', 'TE'].forEach((ln, li) => { for (let k = 0; k < HT.TRAM.n; k++) {
    const liv = LIV[li * 3 + k];
    T.actor({ cast: false, sample: 0.18, period: HT.P,
      at(t) {
        const q = HT.tram(ln, k, t); if (!q) return null;
        const p = HT.place(ln, q.s, HT.HL.tram), a = Math.min(1, (HT.END - 3 - Math.abs(p.x)) / 10); if (a <= 0.02) return null;
        return { x: p.x, y: p.y, key: ln, ang: p.ang, alpha: a < 1 ? a : null };
      },
      draw(g, st) { HK.tram(g, st.ang, liv); } });
  } });
});
