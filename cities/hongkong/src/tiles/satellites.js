'use strict';
/* The satellites, off the grid, each on an unlined paint blob (compass: north = +y, west = +x):
   south (upper right)  Aberdeen: the typhoon shelter crowded with wooden fishing junks dressed in flags, the fish
                        market's shed on the quay, sampans criss-crossing with a woman sculling at the stern;
   west (lower right)   Lantau: the Tian Tan Buddha in bronze on his three-tiered altar on the hilltop, the long stair
                        with pilgrims, and the Ngong Ping cable car's gondolas gliding up to him;
   north (lower left)   the Tsing Ma Bridge: its two portal towers, the main cables' great sag and the hangers, the
                        double deck with traffic (left-hand), water and two green islets below. */
(function () {
  const blob = (g, pts, col, seed) => K.blob2(g, g.P(pts.map((p) => [p[0], p[1], 0])), col, { seed, rag: 0.8 });

  /* ---------------- Aberdeen ---------------- */
  SF.tile('aberdeen', 6, -214, { rim: 92, castAt: 160, order: -3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-30, -6], [-22, -27], [4, -29], [26, -18], [30, 6], [18, 26], [-6, 28], [-26, 16]], HK.C.water, 21);
      const q = K.curve([[-28, -22, 0], [26, -22, 0], [26, -12, 0], [-28, -12, 0]], 2, true); g.fill(K.rect(-28, -26, 26, -14), '#E6E1D5'); void q;
      g.water(K.rect(-24, -12, 24, 24), { dens: 0.8, c: '#6F9396' });
      g.line([[-28, -14, 0], [26, -14, 0]], { w: 0.7, boil: false });
    });
    T.obj([-20, -25, 4, -17], (g) => { K.box(g, -20, -24, 4, -18, 0, 3.6, { t: '#C9D3D8', l: '#B9C3C8', r: '#A9B5BC' }, { w: 0.7 }); K.gable(g, -20.6, -24.6, 4.6, -17.4, 3.6, 1.6, 'x', { a: '#7E9AAD', b: '#6E8A9D', e: '#B9C3C8' }, { w: 0.55 }); g.fill(K.on('L', -17.98, -18, 2, 0, 2.6), '#5E584E'); K.sign(g, 'L', -17.96, -17, 1, 2.7, 3.5, '#C8372D', 'FISH MARKET', { w: 0.3 }); }, { name: 'fish market' });
    // fishing junks moored in a raft, flags on lines from the masts
    const junk = (x, y, s) => T.obj([x - 6, y - 2, x + 6, y + 2], (g) => {
      g.at(x, y, -0.6, (g2) => {
        K.boat(g2, 0, { kind: 'row', L: 6, W: 1.8, hull: '#6E4A30', stripe: '#C8372D', deck: '#B9976A' });
        const ic = g2.cmds.length; K.rbox(g2, -2.6, 0, 1.8, 1.4, 0, 1.2, 3.4, { t: '#C9A26B', l: '#E9DCC0', r: '#C9B48A' }, { w: 0.5 }); HK.nite(g2, ic, { nc: (c) => ({ '#E9DCC0': '#FFE0A0', '#C9B48A': '#E9BF78' })[c] });   // the cabin lit at night
        for (const mx of [-3.2, 2.0]) g2.line([[mx, 0, 1.2], [mx, 0, 9]], { w: 0.5, c: '#3A2A1E', boil: false, ext: 0 });
        const a = g2.p(-3.2, 0, 9), b = g2.p(2.0, 0, 9), c = g2.p(5.6, 0, 1.4), d = g2.p(-6, 0, 1.4), fl = ['#C8372D', '#E6C24F', '#3F7FB8', '#5FA58F', '#F3F1EA'];
        for (const [p, q] of [[d, a], [a, b], [b, c]]) { g2.fine2([p, q], { w: 0.2, c: '#5A564E' }); for (let k = 1; k < 6; k++) { const m = [lerp(p[0], q[0], k / 6), lerp(p[1], q[1], k / 6)]; g2.fill2([[m[0] - 0.5, m[1]], [m[0] + 0.5, m[1]], [m[0], m[1] + 1.2]], fl[(k + s) % 5], true); } }
        HK.leds2(g2, [a[0], a[1], a[0] + 0.01, a[1]], '#FFFBEE', 0.7); g2.glow2('lantern', a, g2.p(-3.2, 0, 0), { r: 1.2, col: '#FFF4DC' });   // the masthead light at night
      });
    }, { name: 'fishing junk' });
    junk(-14, -4, 0); junk(-14, 1.6, 2); junk(4, -6, 1); junk(4, -0.4, 3);
    for (let i = 0; i < 2; i++) T.actor({ sample: 0.3, period: 30, grow: false,
      at(t) { const u = HT.mod(t / 30 + i * 0.5, 1), s = (1 - Math.cos(TAU * u)) / 2, x = lerp(-20, 18, s), y = 10 + i * 6 + Math.sin(TAU * u) * 2; return { x, y, z: -0.6, key: (u < 0.5 ? 'e' : 'w'), e: u < 0.5 }; },
      draw(g, st) { HK.sampan(g, st.e ? 0 : Math.PI, { L: 3.2, who: HK.who(9990 + i, { hairStyle: 'bun', top: '#3B3F47', cap: '#C9A26B' }), dir: st.e ? 0 : 2 }); } });
    T.cast([-6, -16], (g) => { HK.person(g, -6, -16, 0, HK.elder(9993, { dir: 1, apron: '#3F5F8F' })); HK.person(g, -3.8, -15.6, 0, HK.who(9994, { dir: 2, rwb: true })); }, { name: 'buyers' });
  });

  /* ---------------- the Tian Tan Buddha on Lantau ---------------- */
  SF.tile('buddha', 214, 4, { rim: 100, castAt: 166, order: 3, half: 30 }, function (T) {
    T.ground(function (g) { blob(g, [[-30, -4], [-20, -27], [6, -28], [27, -14], [29, 10], [14, 27], [-12, 28], [-28, 14]], '#A9C98A', 33); g.grass(K.rect(-24, -22, 24, 22), { dens: 0.5, c: '#86AA66' }); });
    // the hill with its terraces and the altar, the Buddha on top
    T.obj([-20, -20, 14, 14], (g) => {
      g.boilP = 0.2;
      for (let k = 0; k < 4; k++) { const r = 16 - k * 3.2, z0 = k * 2.2; K.cyl(g, -3, -3, r, z0, z0 + 2.2, { t: k ? '#E3DED3' : '#9DBF7E', l: k ? '#D9D4C8' : '#8FB070', r: k ? '#C3BDB0' : '#7E9F62' }, { n: 28, w: 0.6 }); }
      // the stair up the front
      const st = []; for (let k = 0; k < 14; k++) { const y = 13 - k * 0.9, z = Math.min(8.8, k * 0.66), a = g.p(-5.4, y, z), b = g.p(-0.6, y, z); st.push(a[0], a[1], b[0], b[1]); } g.segs2(st, '#B9B3A6', 0.5);
      // the Buddha seated in bronze: lotus throne, crossed legs, the robe over the left shoulder, the right hand raised in
      // blessing, the left resting on the lap; the head with its curls, ushnisha and long ears (wide px, scaled)
      const B = '#7E8E7A', BL = '#93A28C', BD = '#66755F', c = g.p(-3, -3, 8.8), S = 1.9, P = (u, v) => [c[0] + u * S, c[1] + v * S];
      const poly = (pts, col) => g.fill2(pts.map((q) => P(q[0], q[1])), col, true);
      poly([[-12, -1], [12, -1], [10.5, -5], [-10.5, -5]], '#A9A08A');
      for (let k = 0; k < 9; k++) { const x = -10.5 + k * 2.6; poly([[x - 1.5, -4.6], [x, -8.4], [x + 1.5, -4.6]], '#B9B09A'); }
      poly([[-11.6, -7], [11.6, -7], [10.4, -11.6], [5, -13.4], [-5, -13.4], [-10.4, -11.6]], B);
      poly([[-7.6, -12], [7.6, -12], [6.6, -24], [5.2, -27.6], [-5.2, -27.6], [-6.6, -24]], BL);
      poly([[2.0, -27.6], [5.2, -27.6], [6.6, -24], [7.6, -12], [3.6, -12]], BD);
      poly([[-6.4, -26], [1.6, -14], [-0.4, -13], [-7.4, -22]], BD);
      poly([[-4.2, -14.2], [2.4, -14.2], [2.6, -12.2], [-4.6, -12.2]], BL);
      poly([[5.6, -20], [9.4, -20.6], [10.2, -27], [8.6, -27.6], [7.6, -22]], BL);
      poly([[8.4, -27.2], [10.6, -27.4], [10.4, -30.2], [8.8, -30]], BL);
      poly([[-1.4, -27.6], [1.4, -27.6], [1.2, -29.4], [-1.2, -29.4]], BD);
      g.disc2(P(0, -32.6), 3.4 * S, BL); g.fill2(arcPts(P(0, -33)[0], P(0, -33)[1], 3.4 * S, Math.PI, TAU, 10), B, true); g.disc2(P(0, -36.4), 1.2 * S, B);
      const curls = []; for (let k = 0; k < 16; k++) { const a = Math.PI + Math.PI * (k % 8) / 7, r = (3.0 - (k / 8 | 0) * 1.2) * S, q = P(0, -33); curls.push(q[0] + Math.cos(a) * r, q[1] + Math.sin(a) * r, q[0] + Math.cos(a) * r + 0.01, q[1] + Math.sin(a) * r); } g.segs2(curls, BD, 0.9);
      poly([[-3.4, -32.6], [-4.0, -29.4], [-3.2, -29.6]], B); poly([[3.4, -32.6], [4.0, -29.4], [3.2, -29.6]], B);
      g.disc2(P(-1.1, -32.4), 0.25 * S, '#3E4A3A'); g.disc2(P(1.1, -32.4), 0.25 * S, '#3E4A3A');
      g.outline2([[-7.6, -12], [7.6, -12], [6.6, -24], [5.2, -27.6], [-5.2, -27.6], [-6.6, -24]].map((q) => P(q[0], q[1])), { w: 0.6, c: '#3E4A3A', boil: false });
      g.outline2([[-11.6, -7], [11.6, -7], [10.4, -11.6], [5, -13.4], [-5, -13.4], [-10.4, -11.6]].map((q) => P(q[0], q[1])), { w: 0.6, c: '#3E4A3A', boil: false });
      g.ring2(P(0, -32.6), 3.4 * S, { w: 0.6, c: '#3E4A3A' });
    }, { name: 'tian tan buddha' });
    [[-4, 11.6, 3], [-2.4, 9.4, 3], [-3.8, 7.4, 3]].forEach(([x, y, d], i) => HK.stand(T, x, y, HK.who(9995 + i, { dir: d, pose: 'walk', ph: i * 0.3 }), { z: Math.min(8.8, (13 - y) / 0.9 * 0.66), name: 'pilgrim' }));
    // the cable car: a line of gondolas gliding up from the lower right
    const A = [28, 20, 22], Bp = [12, -12, 16];
    T.obj([12, -12], (g) => { const a = g.p(A[0], A[1], A[2]), b = g.p(Bp[0], Bp[1], Bp[2]); g.fine2([a, b], { w: 0.3, c: '#3A3530' }); const tw = g.p(Bp[0], Bp[1], 0); g.line2([tw, b], { w: 0.7, c: '#8E979C', boil: false, ext: 0 }); }, { name: 'cable' });
    for (let i = 0; i < 4; i++) T.actor({ sample: 0.5, period: 24, grow: false, layer: 'top',
      at(t) { const u = HT.mod(t / 24 + i / 4, 1); const a = Math.min(1, u / 0.1, (1 - u) / 0.1); return { x: lerp(A[0], Bp[0], u), y: lerp(A[1], Bp[1], u), z: lerp(A[2], Bp[2], u), key: 'g', alpha: a < 1 ? a : null }; },
      draw(g) { const o = g.p(0, 0, 0); g.fine2([o, [o[0], o[1] + 2.4]], { w: 0.25, c: '#3A3530' }); const q = [[o[0] - 1.6, o[1] + 2.4], [o[0] + 1.6, o[1] + 2.4], [o[0] + 1.4, o[1] + 5.4], [o[0] - 1.4, o[1] + 5.4]]; g.fill2(q, '#C8372D', true); g.fill2([[o[0] - 1.2, o[1] + 2.9], [o[0] + 1.2, o[1] + 2.9], [o[0] + 1.1, o[1] + 4.0], [o[0] - 1.1, o[1] + 4.0]], '#C9DCE6', true); g.outline2(q, { w: 0.3, c: '#5A1E18', boil: false }); } });
  });

  /* ---------------- the Tsing Ma Bridge ---------------- */
  SF.tile('tsingma', 8, 214, { rim: 106, castAt: 170, order: 3, half: 30 }, function (T) {
    const ZD = 6, TX = 15;
    const cab = (x) => { const u = Math.abs(x) / TX; return Math.abs(x) <= TX ? ZD + 2 + 14 * u * u : ZD + 16 - (Math.abs(x) - TX) * 1.15; };
    T.ground(function (g) {
      blob(g, [[-30, -8], [-22, -26], [4, -28], [26, -16], [30, 8], [16, 27], [-8, 28], [-27, 14]], HK.C.water, 41);
      g.water(K.rect(-24, -20, 24, 22), { dens: 0.8, c: '#6F9396' });
      for (const [cx, cy, r] of [[-22, -10, 7], [22, 8, 6]]) { const c = K.curve([[cx - r, cy, 0], [cx, cy - r * 0.8, 0], [cx + r, cy, 0], [cx, cy + r * 0.8, 0]], 4, true); g.fill(c, '#A9C98A'); g.outline(c, { w: 0.5, c: '#6E8A50', boil: false }); }
    });
    T.obj([-28, -2, 28, 2], (g) => {
      g.boilP = 0.2;
      // the deck (two levels), the towers, the cables and hangers
      K.box(g, -28, -1.6, 28, 1.6, ZD - 1.6, ZD, { t: '#D9D4C8', l: '#E6E1D5', r: '#CFC9BC' }, { w: 0.7 });
      const s = []; for (let x = -27; x <= 27; x += 1.5) { const a = g.p(x, 1.62, ZD - 1.5), b = g.p(x, 1.62, ZD - 0.2); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#B9B3A6', 0.3);
      for (const x of [-TX, TX]) { for (const y of [-1.8, 1.8]) K.box(g, x - 0.7, y - 0.5, x + 0.7, y + 0.5, 0, ZD + 16.4, { t: '#E9E6DE', l: '#F1EFE8', r: '#D9D4C8' }, { w: 0.6 }); for (const z of [ZD + 1, ZD + 9, ZD + 16]) K.box(g, x - 0.6, -1.8, x + 0.6, 1.8, z, z + 0.9, { t: '#E9E6DE', l: '#F1EFE8', r: '#D9D4C8' }, { w: 0.5, boil: false }); }
      for (const y of [-1.7, 1.7]) { const pts = []; for (let x = -28; x <= 28; x += 1) pts.push([x, y, cab(x)]); g.line(pts, { w: 0.6, c: '#8E2F2F', boil: false, ext: 0 }); const h = []; for (let x = -TX + 1.5; x < TX; x += 1.5) { const a = g.p(x, y, cab(x)), b = g.p(x, y, ZD); h.push(a[0], a[1], b[0], b[1]); } g.segs2(h, '#A9A296', 0.22); }
      // at night: the lights along the tops of its main cables, the towers lit, lamps along the deck
      for (const y of [-1.7, 1.7]) { const pts = []; for (let x = -28; x <= 28; x += 1) pts.push(g.p(x, y, cab(x) + 0.2)); HK.bulbs2(g, pts, 1.6, '#FFF0C8', 0.9); }
      for (const x of [-TX, TX]) for (const z of [ZD + 4, ZD + 13]) g.glow('lantern', x, 0, z, { r: 2.4, col: '#FFF0D0' });
      for (let x = -24; x <= 24; x += 8) g.glow('lantern', x, 1.6, ZD + 0.4, { r: 1.0, col: '#FFD98A' });
    }, { name: 'tsing ma', under: ZD });
    // traffic on the deck, keeping left
    for (let i = 0; i < 4; i++) T.actor({ sample: 0.25, period: 9.4, grow: false,
      at(t) { const dir = i % 2 ? -1 : 1, u = HT.mod(t / 9.4 + i * 0.27, 1), x = dir * lerp(-27, 27, u), a = Math.min(1, (27 - Math.abs(x)) / 3); if (a <= 0.03) return null; return { x, y: dir > 0 ? -0.8 : 0.8, z: ZD, key: 'v', alpha: a < 1 ? a : null }; },
      draw(g) { const dir = i % 2 ? -1 : 1, col = ['#C8372D', '#F2EEE2', '#8FA3B5', '#E6C24F'][i], L = i === 2 ? 2.8 : 1.7, B = K.rbox(g, 0, 0, L, 0.75, dir > 0 ? 0 : Math.PI, 0.2, i === 2 ? 2.6 : 1.3, col, { w: 0.4 }); for (const f of ['pv', 'nv']) if (B.vis[f]) g.fill(B.quad(f, -0.8, 0.8, i === 2 ? 1.5 : 0.75, i === 2 ? 2.3 : 1.15), '#5E6A72');
        HK.light2(g, g.p(dir * (L - 0.25), 0, 0.6), 0.35, '#F6E7A8'); HK.light2(g, g.p(-dir * (L - 0.25), 0, 0.6), 0.3, '#D0483A'); } });   // head and tail lights at night
  });
})();
