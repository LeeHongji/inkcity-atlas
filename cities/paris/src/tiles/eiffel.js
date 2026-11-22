'use strict';
/* (-100,-100) The Eiffel Tower and the Champ de Mars, the far corner of the map. The tower (330 m: drawn 72 u; the
   base 124 m square: 27 u) stands on the axis of the Pont d'Iéna, which lands on this tile's river edge (+x). Four
   lattice legs on wide masonry feet curve in and meet under the second platform; between them, on every face, the
   great decorative arch under the first platform (57 m: z 12.4); the second platform at 115 m (z 25); a single
   tapering shaft to the third platform at 276 m (z 60), the campanile and the antenna. Painted "Eiffel Tower brown"
   (OSM #706550): the lattice faces in a pale tint, the leg edges and the bracing in the brown.
   Lifts: two yellow cabins climb and descend the near legs on their slope, one runs up the shaft from the second to
   the third platform; visitors line the platform rails.
   Around it: the esplanade under the tower with the security queue, the Champ de Mars lawns in front with picnics
   (wine, baguettes, a guitar), souvenir sellers jangling rings of little towers, a merry-go-round by the river, a
   crêpe stand, plane trees along the quai. */
SF.tile('eiffel', -100, -100, { rim: 0 }, function (T) {
  const H = 37, CX = -8, CY = 0, TOP = 72, P1 = 12.4, P2 = 25, P3 = 60;
  const BR = '#66573F', BRD = '#463C2C', TINT = 'rgba(178,160,126,0.5)', TINT2 = 'rgba(150,132,100,0.58)';
  // the tower's colours at night, in its golden lighting
  const EIFFEL_GOLD = { [BR]: '#D27A26', [BRD]: '#A4561C', '#B3A688': '#E59A42', [TINT]: 'rgba(255,196,104,0.62)', [TINT2]: 'rgba(240,158,66,0.66)',
    '#A69777': '#F6C070', '#8E7E60': '#E6A24E', '#7A6B50': '#C98636', '#9E9174': '#D69446', '#B9CCD2': '#FFE6B0', '#9FB4BC': '#F2C77C', '#E9E2CC': '#FFF1C8', '#C9463E': '#FF5A48' };
  const w = (z) => z <= P3 ? 0.55 + 13.0 * Math.exp(-0.058 * z) : lerp(0.55 + 13.0 * Math.exp(-0.058 * P3), 0.3, (z - P3) / (TOP - P3));
  const wi = (z) => Math.max(0, 8.4 * Math.pow(Math.max(0, 1 - z / 21), 1.2));

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    K.slab(g, H, { top: PC.gravel });
    g.scuff(K.rect(-H, -H, H, H), { dir: Math.atan2(AY, AX), len: 2.4, c: PC.gravelD, dens: 0.8, w: 0.45, spread: 0.4 });
    // the Champ de Mars lawns in front and behind, the strip of lawn along the quai
    for (const r of [[-H + 2, 17, 26, H - 2], [-H + 2, -H + 2, -24, 13], [-20, -H + 2, 28, -17]]) {
      const q = K.rect(r[0], r[1], r[2], r[3]); g.fill(q, PC.lawn); g.grass(q, { dens: 0.8 }); g.outline(q, { w: 0.5, c: '#86A05E', boil: false });
    }
    // the esplanade under the tower, the avenue from the bridge
    g.fill(K.rect(CX - 16, CY - 16, CX + 16, CY + 16), '#E7DECB');
    g.fill(K.rect(CX + 16, -6, H, 6), PC.asph);
    g.scuff(K.rect(CX + 16, -6, H, 6), { dir: Math.atan2(AY, AX), len: 7, c: '#DDD8CC', dens: 0.5, w: 0.5, spread: 0.05 });
    for (const s of [-1, 1]) g.line([[CX + 16, s * 6, 0], [H, s * 6, 0]], { w: 0.45, c: '#A9A296', boil: false });
    // the quai promenade along the river edge
    g.fill(K.rect(30, -H, H, H), PC.pave);
    // the carousel's round platform
    g.fill(K.arc(20, 27, 0, 5.2, 0, TAU, 28), '#D9CDB4');
  }, { rim: true });

  /* ---------------- the tower ---------------- */
  T.obj([CX - 14, CY - 14, CX + 14, CY + 14], function (g) {
    g.boilP = 0.2;
    const P = (x, y, z) => g.p(CX + x, CY + y, z), i0 = g.cmds.length;
    // the masonry feet of the four legs
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const c = 10.6; K.box(g, CX + sx * c - 3, CY + sy * c - 3, CX + sx * c + 3, CY + sy * c + 3, 0, 1.2, { t: '#E2D9C5', l: '#D9CFBA', r: '#C5BBA5' }, { w: 0.6, boil: false }); }
    // one face of the lattice: plane at s * w(z) along axis 'y' (the face looks +y: 'L') or 'x' ('R')
    const face = (ax, back) => {
      const pt = (a, z, wz) => ax === 'L' ? P(a, (back ? -1 : 1) * wz, z) : P((back ? -1 : 1) * wz, a, z);
      const lc = back ? '#B3A688' : BR, fl = !back;
      // the two legs below the merge, each a strip from the outer edge to the inner edge
      for (const s of [-1, 1]) {
        const L = [], R = [];
        for (let z = 1.2; z <= 22; z += 1.0) { const ow = w(z), iw = Math.max(wi(z), 0); L.push(pt(s * ow, z, ow)); R.push(pt(s * iw, z, ow)); }
        if (fl) g.fill2(L.concat(R.slice().reverse()), ax === 'L' ? TINT : TINT2);
        const segs = [];
        for (let i = 0; i + 1 < L.length; i++) segs.push(L[i][0], L[i][1], R[i + 1][0], R[i + 1][1], R[i][0], R[i][1], L[i + 1][0], L[i + 1][1]);
        g.segs2(segs, lc, back ? 0.25 : 0.32);
        g.line2(L, { w: back ? 0.35 : 0.85, c: back ? lc : BRD, boil: false, wob: 0.25 });
        g.line2(R, { w: back ? 0.3 : 0.65, c: back ? lc : BR, boil: false, wob: 0.25 });
      }
      // the shaft above the merge, to the third platform
      const L = [], R = [];
      for (let z = 21; z <= P3; z += 2.5) { const ow = w(z); L.push(pt(-ow, z, ow)); R.push(pt(ow, z, ow)); }
      if (fl) g.fill2(L.concat(R.slice().reverse()), ax === 'L' ? TINT : TINT2);
      const xs = []; for (let i = 0; i + 1 < L.length; i++) xs.push(L[i][0], L[i][1], R[i + 1][0], R[i + 1][1], R[i][0], R[i][1], L[i + 1][0], L[i + 1][1], L[i][0], L[i][1], R[i][0], R[i][1]);
      g.segs2(xs, lc, back ? 0.25 : 0.3);
      g.line2(L, { w: back ? 0.3 : 0.75, c: back ? lc : BRD, boil: false, wob: 0.2 }); g.line2(R, { w: back ? 0.3 : 0.75, c: back ? lc : BRD, boil: false, wob: 0.2 });
      // the great arch between the legs under the first platform
      if (fl) {
        const ar = []; for (let i = 0; i <= 14; i++) { const t = Math.PI * i / 14, a = -Math.cos(t) * 8.1, z = 1.2 + Math.sin(t) * (P1 - 2.3); ar.push(pt(a, z, w(z))); }
        g.line2(ar, { w: 1.0, c: BR, boil: false, wob: 0.2 });
        const fil = []; for (let i = 1; i < 14; i++) { const t = Math.PI * i / 14, a = -Math.cos(t) * 8.1, z = 1.2 + Math.sin(t) * (P1 - 2.3), q = pt(a, P1, w(P1)); fil.push(ar[i][0], ar[i][1], q[0], q[1]); }
        g.segs2(fil, BR, 0.28);
      }
    };
    face('L', true); face('R', true);
    face('L', false); face('R', false);
    // the platforms: a deep girder band with the restaurant's glass, a railing on top
    const plat = (z, hw, h, glass) => {
      K.box(g, CX - hw, CY - hw, CX + hw, CY + hw, z, z + h, { t: '#A69777', l: '#8E7E60', r: '#7A6B50' }, { w: 0.8, faces: 'lr' });
      if (glass) { K.win(g, 'L', CY + hw, CX - hw + 0.5, CX + hw - 0.5, z + 0.3, z + h - 0.3, { style: 'glass', col: '#C9D8DC' }); K.win(g, 'R', CX + hw, CY - hw + 0.5, CY + hw - 0.5, z + 0.3, z + h - 0.3, { style: 'glass', col: '#B9CCD2' }); }
      const zt = z + h + 0.01, ib = hw - 1.5, ring = [[[CX - hw, CY + hw], [CX + hw, CY + hw], [CX + ib, CY + ib], [CX - ib, CY + ib]], [[CX + hw, CY + hw], [CX + hw, CY - hw], [CX + ib, CY - ib], [CX + ib, CY + ib]], [[CX - hw, CY - hw], [CX + hw, CY - hw], [CX + ib, CY - ib], [CX - ib, CY - ib]], [[CX - hw, CY - hw], [CX - hw, CY + hw], [CX - ib, CY + ib], [CX - ib, CY - ib]]];
      ring.forEach((q, i) => g.fill(q.map((p) => [p[0], p[1], zt]), i < 2 ? '#B3A688' : '#9E9174'));
      g.line([[CX - ib, CY + ib, zt], [CX + ib, CY + ib, zt], [CX + ib, CY - ib, zt]], { w: 0.4, c: BRD, boil: false });
      const r = []; for (let a = -hw; a <= hw; a += 0.8) { const p = P(a, hw, z + h), q = P(a, hw, z + h + 1.0); r.push(p[0], p[1], q[0], q[1]); const p2 = P(hw, a, z + h), q2 = P(hw, a, z + h + 1.0); r.push(p2[0], p2[1], q2[0], q2[1]); }
      g.segs2(r, BRD, 0.28);
      g.line([[CX - hw, CY + hw, z + h + 1.0], [CX + hw, CY + hw, z + h + 1.0], [CX + hw, CY - hw, z + h + 1.0]], { w: 0.4, c: BRD, boil: false });
    };
    plat(P1, 7.4, 1.1, true);
    plat(P2, 4.1, 0.8, false);
    // the third platform, the slim campanile, the antenna
    K.box(g, CX - 1.4, CY - 1.4, CX + 1.4, CY + 1.4, P3, P3 + 1.0, { t: '#A69777', l: '#8E7E60', r: '#7A6B50' }, { w: 0.6 });
    K.cyl(g, CX, CY, 0.7, P3 + 1.0, P3 + 4.2, { t: '#A69777', l: '#B9CCD2', r: '#9FB4BC' }, { w: 0.5, n: 10 });
    K.cone(g, CX, CY, 0.8, P3 + 4.2, 1.2, BR);
    const a = P(0, 0, P3 + 5.2), b = P(0, 0, TOP); g.line2([a, b], { w: 0.55, c: BRD, boil: false });
    for (let k = 0; k < 3; k++) { const p = P(0, 0, P3 + 6.4 + k * 1.6); g.segs2([p[0] - 0.7, p[1], p[0] + 0.7, p[1]], '#E9E2CC', 0.45); }
    g.disc2(b, 0.4, '#C9463E');
    // the near corner leg drawn again over everything: the heaviest edge
    const E = []; for (let z = 1.2; z <= P3; z += 1.5) { const ow = w(z); E.push(P(ow, ow, z)); } g.line2(E, { w: 1.0, c: BRD, boil: false, wob: 0.2 });
    // at night: the golden lighting (336 sodium lamps set inside the structure since 1985): the lattice faces glow
    // amber-gold, the iron shows in deeper amber over them, the platforms' girders lit; the red light on the antenna
    PA.nightCol(g, i0, (c, fill) => EIFFEL_GOLD[c] || (fill ? PA.floodCol(c, 0.75, '#FFCB80') : undefined), { lines: true });
    for (const [z, r] of [[6, 5.5], [P1 + 1, 4.4], [P2 + 1, 3.4], [40, 2.2], [P3 + 1, 2.2]]) g.glow('lantern', CX, CY, z, { r, col: '#FFB54E' });
  }, { name: 'eiffel tower' });
  /* ---------------- the lifts ---------------- */
  // two cabins on the slope of the near legs (up and down, out of step), one in the shaft above the second platform
  const cabin = (g, col) => { const b = g.p(0, 0, 0); g.fill2([[b[0] - 1.9, b[1]], [b[0] + 1.9, b[1]], [b[0] + 1.9, b[1] - 5.4], [b[0] - 1.9, b[1] - 5.4]], col, true); g.mark({ nc: true }); g.fill2([[b[0] - 1.4, b[1] - 1.6], [b[0] + 1.4, b[1] - 1.6], [b[0] + 1.4, b[1] - 4.6], [b[0] - 1.4, b[1] - 4.6]], '#CFE0E4', true); g.mark({ nc: '#FFE7B0', light: true }); g.line2([[b[0] - 1.9, b[1]], [b[0] + 1.9, b[1]], [b[0] + 1.9, b[1] - 5.4], [b[0] - 1.9, b[1] - 5.4]], { w: 0.4, c: '#5E4A1E', close: true, boil: false }); g.segs2([b[0], b[1] - 1.6, b[0], b[1] - 4.6], '#8C8576', 0.3); };
  const legLift = (sx, sy, per, ph) => T.actor({ sample: 0.3, period: per, grow: false,
    at(t) { const u = ((t / per + ph) % 1 + 1) % 1, s = u < 0.4 ? smooth(u / 0.4) : u < 0.5 ? 1 : u < 0.9 ? 1 - smooth((u - 0.5) / 0.4) : 0, z = 1.2 + s * (P1 - 1.4), r = (w(z) + wi(z)) / 2; return { x: CX + sx * r, y: CY + sy * r, z, key: 0 }; },
    draw(g) { cabin(g, '#E6C24F'); } });
  legLift(1, 1, 22, 0); legLift(-1, 1, 22, 0.5);
  T.actor({ sample: 0.3, period: 30, grow: false,
    at(t) { const u = ((t / 30) % 1 + 1) % 1, s = u < 0.4 ? smooth(u / 0.4) : u < 0.5 ? 1 : u < 0.9 ? 1 - smooth((u - 0.5) / 0.4) : 0; return { x: CX + 0.3, y: CY + w(P2 + 3 + s * 30) - 0.4, z: P2 + 1.6 + s * (P3 - P2 - 3), key: 0 }; },
    draw(g) { cabin(g, '#E9E2CC'); } });

  /* ---------------- around the tower ---------------- */
  // the security queue on the esplanade: a line of visitors along a barrier
  T.obj([CX + 15, 6.6, CX + 26, 7.4], (g) => { const r = []; for (let x = CX + 15; x <= CX + 26; x += 1.1) { const a = g.p(x, 7, 0), b = g.p(x, 7, 1.6); r.push(a[0], a[1], b[0], b[1]); } g.segs2(r, '#6B6458', 0.4); g.line([[CX + 15, 7, 1.6], [CX + 26, 7, 1.6]], { w: 0.45, c: '#6B6458', boil: false }); }, { name: 'barrier' });
  T.cast([CX + 20, 8.6], function (g) { for (let i = 0; i < 9; i++) PA.person(g, CX + 25 - i * 1.25, 8.5 + (i % 2) * 0.4, 0, PA.who(9540 + i, { dir: 2, pose: i % 3 === 0 ? 'hold' : 'stand' })); }, { name: 'queue' });
  // the merry-go-round by the river: a striped canopy on a turning platform (an actor), horses rising and falling
  T.actor({ sample: 5, period: 12, grow: true,
    at(t) { const f = Math.floor(t * 4) % 12; return { x: 20, y: 27 + 4.9, key: f, f }; },
    draw(g, st) {
      const cx = 0, cy = -4.9, r = 4.6, P = (a, rr, z) => g.p(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, z), rot = st.f / 12 * TAU / 6;
      g.fill(K.arc(cx, cy, 0.6, r, 0, TAU, 24), '#C9A26B'); g.outline(K.arc(cx, cy, 0.6, r, 0, TAU, 24), { w: 0.45, boil: false, c: '#6E5A44' });
      const hs = []; for (let i = 0; i < 8; i++) { const a = rot + TAU * i / 8, p = P(a, r - 1, 0.6); hs.push({ a, p, d: Math.cos(a) + Math.sin(a) }); }
      hs.sort((p, q) => p.d - q.d);
      for (const h of hs) { const up = Math.sin(h.a * 3 + st.f) * 1.2, pl = h.p, top = [pl[0], pl[1] - 16]; g.segs2([pl[0], pl[1], top[0], top[1]], '#D8AE48', 0.4); const hb = [pl[0], pl[1] - 6 - up]; g.fill2([[hb[0] - 2.2, hb[1]], [hb[0] + 2.0, hb[1] - 0.4], [hb[0] + 2.6, hb[1] - 2.4], [hb[0] + 1.6, hb[1] - 2.0], [hb[0] - 1.8, hb[1] - 1.6]], ['#F3F1EA', '#E9C46A', '#E7A9A0', '#B9D3E0'][Math.round(h.a * 10) % 4 < 0 ? 0 : Math.round(h.a * 10) % 4], true); g.segs2([hb[0] - 1.6, hb[1], hb[0] - 1.8, hb[1] + 2.6, hb[0] + 1.4, hb[1], hb[0] + 1.6, hb[1] + 2.6], '#8C8576', 0.35); }
      // canopy: striped cone
      const c0 = g.p(cx, cy, 6.8), apex = g.p(cx, cy, 9.4), n = 12;
      const ic = g.cmds.length;
      for (let i = 0; i < n; i++) { const a0 = rot + TAU * i / n, a1 = rot + TAU * (i + 1) / n, p0 = P(a0, r + 0.4, 6.6), p1 = P(a1, r + 0.4, 6.6); if (Math.sin((a0 + a1) / 2) + Math.cos((a0 + a1) / 2) < -0.3) continue; g.fill2([p0, p1, apex], i % 2 ? '#C9463E' : '#F6F1E4', true); }
      const ir = g.cmds.length, rim = K.arc(cx, cy, 6.6, r + 0.4, A_R, A_L, 16).map((q) => g.p(q[0], q[1], q[2])); g.line2(rim, { w: 0.5, c: '#7A2E2A', boil: false });
      g.disc2(apex, 0.6, '#D8AE48'); void c0;
      // at night the merry-go-round is lit: its canopy glows, a ring of bulbs round its rim
      g.mark({ nc: (cc) => mix(cc, '#FFE2A8', 0.15) }, ic); PA.litLines(g, ir, '#FFD27A'); g.mark({ nc: '#FFE9A8', light: true }, g.cmds.length - 1);
    } });
  // the crêpe stand by the queue, souvenir sellers with rings of little towers
  T.obj([24, 12], (g) => { K.stall(g, 24, 12, { face: 'R', L: 2.2, D: 1.4, a: '#2F5D4B', b: '#F3F1EA', goods: (g2, D, L) => { for (let k = 0; k < 3; k++) { const p = g2.p(D - 0.2, -L + 0.8 + k * 1.4, 2.7); g2.disc2(p, 0.9, '#E9C98A'); } } }); g.glow('lamp', 25.4, 12, 5.4, { r: 1.0 }); }, { name: 'crepes' });
  T.cast([27.6, 12.4], (g) => PA.person(g, 27.6, 12.4, 0, PA.who(9560, { dir: 2, pose: 'hold' })), { on: true });
  const seller = (x, y, d, s) => T.cast([x, y], function (g) {
    const r = PA.person(g, x, y, 0, PA.who(s, { dir: d, pose: 'hold', top: '#3B3F47', bot: '#2A2622' }));
    const h = r.hands[0]; g.ring2([h[0], h[1] + 0.8], 1.4, { c: '#B8A57A', w: 0.4 }); for (let k = 0; k < 6; k++) { const a = Math.PI * (0.15 + 0.7 * k / 5), p = [h[0] + Math.cos(a) * 1.4, h[1] + 0.8 + Math.sin(a) * 1.4]; g.fill2([[p[0] - 0.35, p[1] + 1.2], [p[0] + 0.35, p[1] + 1.2], [p[0], p[1] - 0.2]], k % 2 ? '#D8AE48' : '#8E7E60', true); }
  }, { on: true });
  seller(14, 11.2, 1, 9570); seller(-26, 11.4, 0, 9571);
  // picnics on the front lawn: a blanket, wine and a baguette, people sitting round
  const picnic = (cx, cy, wdt, dep, seed, n, col) => T.cast([cx, cy], function (g) {
    const q = [[cx - wdt, cy - dep, 0.05], [cx + wdt, cy - dep, 0.05], [cx + wdt, cy + dep, 0.05], [cx - wdt, cy + dep, 0.05]];
    g.fill(q, col); const ck = []; for (let k = 1; k < 4; k++) { const a = g.p(cx - wdt + 2 * wdt * k / 4, cy - dep, 0.06), b = g.p(cx - wdt + 2 * wdt * k / 4, cy + dep, 0.06); ck.push(a[0], a[1], b[0], b[1]); const c = g.p(cx - wdt, cy - dep + 2 * dep * k / 4, 0.06), d = g.p(cx + wdt, cy - dep + 2 * dep * k / 4, 0.06); ck.push(c[0], c[1], d[0], d[1]); } g.segs2(ck, shade(col, 0.25), 0.4);
    g.outline(q, { w: 0.4, c: shade(col, 0.45), boil: false });
    const b = g.p(cx + 0.3, cy - 0.2, 0.1); g.fill2([[b[0] - 0.45, b[1]], [b[0] + 0.45, b[1]], [b[0] + 0.35, b[1] - 2.6], [b[0] - 0.35, b[1] - 2.6]], '#3F5A2E', true);
    const bg = g.p(cx - 1.0, cy + 0.4, 0.1); g.line2([[bg[0] - 3, bg[1] + 0.5], [bg[0] + 3, bg[1] - 0.8]], { w: 1.1, c: '#D9A85A', boil: false, ext: 0, taper: 0 });
    const seats = []; for (let k = 0; k < n; k++) { const side = k % 3; const t = (Math.floor(k / 3) + 0.5) / Math.ceil(n / 3); seats.push(side === 0 ? [cx - wdt + t * 2 * wdt, cy - dep - 0.3, 1] : side === 1 ? [cx + wdt + 0.3, cy - dep + t * 2 * dep, 2] : [cx - wdt - 0.3, cy + dep - t * 2 * dep, 0]); }
    seats.sort((p, q2) => (p[0] + p[1]) - (q2[0] + q2[1]));
    seats.forEach(([x, y, d], k) => PA.person(g, x, y, 0, PA.who(seed * 10 + k, { dir: d, pose: 'sit' })));
  }, { on: true });
  picnic(-27, 22, 2.6, 2.0, 951, 4, '#E9E2CC'); picnic(-16, 30, 2.4, 1.8, 952, 3, '#C9584B'); picnic(-3, 24, 2.8, 2.0, 953, 5, '#5F8FC9'); picnic(10, 31, 2.2, 1.8, 954, 3, '#E6C24F'); picnic(-31, -27, 2.2, 1.6, 955, 3, '#E9806A');
  // someone lying in the sun, a couple taking the classic photo "holding" the tower
  T.cast([-9, 31.5], (g) => PA.person(g, -9, 31.5, 0.05, PA.who(9580, { dir: 0, lie: -2.4 })), { on: true });
  T.cast([4, 20], function (g) { PA.person(g, 4, 20, 0, PA.who(9581, { dir: 3, pose: 'hold', phone: true })); PA.person(g, 0.8, 16.8, 0, PA.who(9582, { dir: 1, pose: 'cheer', ph: 0.25 })); }, { on: true });
  // plane trees along the quai and the lawn edges
  for (let y = -33; y < 35; y += 8) if (Math.abs(y) > 9) T.obj([33.5, y], (g) => PA.plane(g, 33.5, y, { r: 3.8, h: 6.0, turn: 0.4 + h1(y + 50) * 0.5 }), { name: 'tree' });
  for (const [x, y] of [[-33, 13], [-20, 13], [-33, -13], [-20, -13]]) T.obj([x, y], (g) => PA.plane(g, x, y, { r: 3.6, h: 5.8 }), { name: 'tree' });
  T.obj([35.9, -H, 36.6, -7], (g) => PA.parapet(g, 'y', 36.25, -H, -7), { name: 'parapet' });
  T.obj([35.9, 7, 36.6, H], (g) => PA.parapet(g, 'y', 36.25, 7, H), { name: 'parapet' });
  // walkers: from the bridge to the tower, along the quai, across the lawn path
  PA.walker(T, PA.who(9590), [[34, -3], [CX + 15, -3]], 1.5, { phase: 0.1 });
  PA.walker(T, PA.who(9591), [[CX + 15, 3], [34, 3]], 1.4, { phase: 0.4 });
  PA.walker(T, PA.who(9592), [[31.5, -30], [31.5, 30]], 1.3, { phase: 0.2 });
  PA.walker(T, PA.who(9593, { k: 0.75 }), [[31.8, 30], [31.8, -30]], 1.6, { phase: 0.7 });
  PA.walker(T, PA.who(9594), [[-30, 14.5], [24, 14.5]], 1.4, { phase: 0.5 });
  PA.walker(T, PA.who(9595), [[22, 15.2], [-30, 15.2]], 1.2, { phase: 0.15 });

  /* ---------------- the tower's animated lights (night only) ---------------- */
  // Made last of all (PA.late): an actor's number seeds its pen. Both are on the top layer, return nothing by day, and
  // mark their fills as lights.
  const WX = T.cx + CX, WY = T.cy + CY;
  PA.late.push(function (L) {
    // the sparkle: 20,000 white flash bulbs that twinkle all over the tower for five minutes every hour; here for seven
    // seconds in every 24 (the Eiffel shot's frames fall inside one), the golden lighting staying on under it
    const SPER = 24, SON = 5.5, SLEN = 7;
    L.actor({ layer: 'top', sample: 5, period: SPER, grow: false,
      at(t) {
        if (!LOOK.night) return null;
        const u = (((t - SON) % SPER) + SPER) % SPER; if (u >= SLEN) return null;
        const f = Math.floor(t * 9) % 8; return { x: WX - L.cx, y: WY - L.cy, z: 0, key: 's' + f, f };
      },
      draw(g, st) {
        const R = RNG(4401 + st.f * 97);
        for (let i = 0; i < 110; i++) {
          // a point on one of the two faces we see, or on the back faces through the lattice, weighted to the wide base
          const z = 6 + Math.pow(R(), 1.35) * (P3 + 4 - 6), ow = w(z), iw = z < 21 ? wi(z) : 0, side = R() < 0.5 ? 1 : -1;
          let a = (R() * 2 - 1) * ow; if (Math.abs(a) < iw) a = Math.sign(a || 1) * lerp(iw, ow, R());
          const face = R() < 0.5, back = R() < 0.3, x = face ? (back ? -ow : ow) : a, y = face ? a : (back ? -ow : ow); void side;
          const p = g.p(x, y, z), big = R() < 0.18;
          g.disc2(p, big ? 0.62 : 0.42, big ? '#FFFFFF' : '#FFF6E2'); g.mark({ nc: true, light: big });
        }
      } });
    // the beacon on the top: four marine projectors turning in turn, which reads as one beam sweeping the sky
    const BPER = 16, NB = 24;
    L.actor({ layer: 'top', sample: 5, period: BPER, grow: false,
      at(t) {
        if (!LOOK.night) return null;
        const q = Math.floor((((t / BPER) % 1) + 1) % 1 * NB) % NB; return { x: WX - L.cx, y: WY - L.cy, z: P3 + 3.2, key: 'b' + q, q };
      },
      draw(g, st) {
        const a = -st.q / NB * TAU, ca = Math.cos(a), sa = Math.sin(a), P = (u, v) => g.p(u * ca - v * sa, u * sa + v * ca, 0);
        for (const [u0, u1, v0, v1, al] of [[0.4, 10, 0.2, 0.9, 0.5], [10, 20, 0.9, 1.6, 0.3], [20, 30, 1.6, 2.3, 0.15], [30, 40, 2.3, 3.0, 0.06]]) {
          g.fill2([P(u0, -v0), P(u1, -v1), P(u1, v1), P(u0, v0)], 'rgba(255,234,176,' + al + ')', true); g.mark({ nc: true });
        }
        // the light of the beam: unseen points along its axis, each marked as a light (the engine lays a soft halo on
        // each, added to the frame), wider and fainter as the beam spreads
        for (let i = 0; i < 18; i++) { const u = 1 + i * 1.3 + i * i * 0.045; g.disc2(P(u, 0), 1.4 + u * 0.12, 'rgba(255,232,172,0)'); g.mark({ nc: true, light: true }); }
        g.disc2(g.p(0, 0, 0), 0.9, '#FFF4D6'); g.mark({ nc: true, light: true });
      } });
  });
});
