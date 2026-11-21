'use strict';
/* (-100,-100) Tokyo Tower in Shiba Park, the far corner of the map. A steel lattice on four legs that curve in from a
   wide base, a two-storey main deck about two fifths of the way up, a small top deck and the antenna; painted in bands
   of international orange and white (proportions from the OSM parts: main deck 120-130 m, top deck 241-251 m of 333 m).
   A four-storey base building stands between the legs. In front: Zōjō-ji's great red gate, rows of little jizō in red
   bonnets with pinwheels that spin, cherry trees, and a school trip in yellow caps following a teacher's flag. */
SF.tile('tower', -100, -100, { rim: 0 }, function (T) {
  const H = 37, CX = -8, CY = -8, TOP = 70, DECK = 27, DECK2 = 52.5;
  const ORANGE = '#D9583E', OTINT = '#EFA690', WTINT = '#F4F1E9', LINE_O = '#A9402C', LINE_W = '#9A948A';
  T.ground(function (g) {
    K.slab(g, H, { top: '#C9DBA5' });
    g.grass(K.rect(-H, -H, H, H), { dens: 0.6 });
    g.fill(K.rect(CX - 16, CY - 16, CX + 16, CY + 16), '#E6E1D5');
    g.fill(K.rect(-2, 10, 30, 22), '#ECE5D2'); g.fill(K.rect(10, -2, 22, 30), '#ECE5D2');
    g.scuff(K.rect(-2, 10, 30, 22), { dir: Math.atan2(AY, AX), len: 3, c: '#DAD0B8', dens: 0.7, w: 0.5 });
  }, { rim: true });

  /* ---------------- the tower ---------------- */
  const wAt = (z) => z <= DECK ? 4.6 + 9.4 * Math.pow(1 - z / DECK, 1.7) : z <= DECK2 ? lerp(3.4, 1.7, (z - DECK - 4) / (DECK2 - DECK - 4)) : z <= 55 ? 1.5 : lerp(0.55, 0.15, (z - 55) / (TOP - 55));
  const LEVELS = [0, 3.5, 7.5, 11.5, 15.5, 19.5, 23.5, 27, 31, 34.5, 38, 41.5, 45, 48.5, 52.5, 55, 59, 63, 67, TOP];
  const white = (z0) => (z0 >= 31 && Math.floor((z0 - 31) / 3.5) % 2 === 1) || (z0 >= 11.5 && z0 < 15.5) || (z0 >= 55 && Math.floor((z0 - 55) / 4) % 2 === 1);
  T.obj([CX - 14.5, CY - 14.5, CX + 14.5, CY + 14.5], function (g) {
    g.boilP = 0.25;
    const C3 = (sx, sy, z) => { const w = wAt(z); return [CX + sx * w, CY + sy * w, z]; };
    // the base building between the legs
    K.box(g, CX - 8, CY - 8, CX + 8, CY + 8, 0, 9.5, { t: '#E9E6DE', l: '#F3F1EA', r: '#E2DFD5' }, { w: 0.9 });
    for (const z of [1.2, 4.2, 7.0]) { K.win(g, 'L', CY + 8, CX - 7, CX + 7, z, z + 1.8, { style: 'glass' }); K.win(g, 'R', CX + 8, CY - 7, CY + 7, z, z + 1.8, { style: 'glass' }); }
    TK.sign(g, 'L', CY + 8, CX - 4, CX + 4, 9.6, 11, '#D9583E', { seed: 500, n: 4 });
    // the faces seen through the lattice (back ones first, faint), then the two faces towards us, banded
    const face = (sa, sb, back) => {
      for (let k = 0; k + 1 < LEVELS.length; k++) {
        const z0 = LEVELS[k], z1 = LEVELS[k + 1]; if (z0 >= DECK && z0 < DECK + 4) continue; if (z0 >= DECK2 && z0 < 55) continue;
        const a0 = C3(sa[0], sa[1], z0), b0 = C3(sb[0], sb[1], z0), a1 = C3(sa[0], sa[1], z1), b1 = C3(sb[0], sb[1], z1), wh = white(z0);
        if (!back && z0 < 55 && z0 >= 11.5) g.fill([a0, b0, b1, a1], wh ? WTINT : OTINT);
        const lc = back ? (wh ? '#C9C3B6' : '#E9A08A') : wh ? LINE_W : LINE_O, P = (p) => g.p(p[0], p[1], p[2]);
        const A0 = P(a0), B0 = P(b0), A1 = P(a1), B1 = P(b1);
        g.segs2([A0[0], A0[1], B1[0], B1[1], B0[0], B0[1], A1[0], A1[1], A1[0], A1[1], B1[0], B1[1]], lc, back ? 0.3 : 0.42);
        if (!back && z1 - z0 > 3 && z0 < DECK) { const m0 = [lerp(A0[0], B0[0], 0.5), lerp(A0[1], B0[1], 0.5)], m1 = [lerp(A1[0], B1[0], 0.5), lerp(A1[1], B1[1], 0.5)]; g.segs2([m0[0], m0[1], m1[0], m1[1]], lc, 0.3); }
      }
    };
    face([-1, -1], [1, -1], true); face([-1, -1], [-1, 1], true);
    face([-1, 1], [1, 1], false); face([1, 1], [1, -1], false);
    // the four legs as continuous lines (front corner heaviest)
    const leg = (sx, sy, w, c) => { const pts = []; for (let z = 0; z <= TOP; z += 1.5) { if (z > 55) { pts.push(C3(sx, sy, z)); continue; } pts.push(C3(sx, sy, z)); } g.line(pts, { w, c, boil: false, wob: 0.3 }); };
    // below the white band the legs stand apart: each a broad orange strip, the base building seen between them
    for (const [sx, sy] of [[-1, 1], [1, -1], [1, 1]]) { const L = [], Rr = []; for (let z = 0; z <= 15.5; z += 1.5) { const w = wAt(z), d = 1.6 * (1 - z / 22); L.push([CX + sx * w - (sy !== sx ? 0 : d), CY + sy * w - (sy !== sx ? d * sy * sx : d), z]); Rr.push([CX + sx * w, CY + sy * w, z]); } const pts = L.concat(Rr.reverse()); g.fill(pts, ORANGE); }
    leg(-1, -1, 0.4, '#E9A08A'); leg(-1, 1, 0.85, LINE_O); leg(1, -1, 0.85, LINE_O); leg(1, 1, 1.05, '#8A3324');
    // the main deck: two storeys of glass in a white frame with orange edges
    const dw = 6.0;
    K.box(g, CX - dw, CY - dw, CX + dw, CY + dw, DECK, DECK + 4, { t: '#F3F1EA', l: '#F6F4EE', r: '#E2DFD5' }, { w: 0.85 });
    for (const z of [DECK + 0.4, DECK + 2.3]) { K.win(g, 'L', CY + dw, CX - dw + 0.4, CX + dw - 0.4, z, z + 1.4, { style: 'glass' }); K.win(g, 'R', CX + dw, CY - dw + 0.4, CY + dw - 0.4, z, z + 1.4, { style: 'glass' }); }
    K.box(g, CX - dw - 0.3, CY - dw - 0.3, CX + dw + 0.3, CY + dw + 0.3, DECK + 4, DECK + 4.5, ORANGE, { w: 0.6 });
    K.box(g, CX - 2.6, CY - 2.6, CX + 2.6, CY + 2.6, DECK2, 55, { t: '#F3F1EA', l: '#F6F4EE', r: '#E2DFD5' }, { w: 0.7 });
    K.win(g, 'L', CY + 2.6, CX - 2.3, CX + 2.3, DECK2 + 0.5, 54.5, { style: 'glass' }); K.win(g, 'R', CX + 2.6, CY - 2.3, CY + 2.3, DECK2 + 0.5, 54.5, { style: 'glass' });
    const t = g.p(CX, CY, TOP), b = g.p(CX, CY, 55); g.line2([b, t], { w: 1.1, c: ORANGE, boil: false });
    for (let k = 0; k < 4; k++) { const p = g.p(CX, CY, 57 + k * 3.4); g.line2([[p[0] - 1.4, p[1]], [p[0] + 1.4, p[1]]], { w: 0.7, c: k % 2 ? '#F3F1EA' : ORANGE, boil: false }); }
    g.disc2(t, 0.7, '#E0503E');
  }, { name: 'tokyo tower' });

  /* ---------------- Zōjō-ji: the great gate, the jizō ---------------- */
  T.obj([22, 8, 30, 24], function (g) {
    g.boilP = 0.35;
    const VERM = { t: '#D9715A', l: '#C9463E', r: '#AE3A32' };
    K.box(g, 22, 8, 30, 24, 0, 0.7, { t: '#E4DFD4', l: '#DAD6CA', r: '#C7C2B6' }, { w: 0.7 });
    K.box(g, 23, 9, 29, 23, 0.7, 7, VERM, { w: 0.85 });
    g.fill(K.on('R', 29.03, 13.5, 18.5, 0.7, 6), '#3A2E26');
    for (let a = 10; a < 23; a += 2.6) g.fill(K.on('R', 29.04, a, a + 0.5, 0.7, 7), '#8A2F26');
    TK.roof(g, 23, 9, 29, 23, 7, 1.6, { over: 1.8, lift: 0.7, col: '#5E646C', ridge: 'y', tiles: false });
    K.box(g, 23.6, 10, 28.4, 22, 8.6, 12.4, VERM, { w: 0.8 });
    for (let a = 11; a < 22; a += 2.2) K.win(g, 'R', 28.4, a, a + 1.2, 9.4, 11.6, { style: 'dark' });
    TK.roof(g, 23.6, 10, 28.4, 22, 12.4, 5.4, { gable: 0.44, over: 2.4, lift: 1.4, col: '#5E646C', end: '#6E5A44', ridge: 'y' });
  }, { name: 'sangedatsumon', under: 6 });
  const JZ = []; for (let r = 0; r < 3; r++) for (let k = 0; k < 7; k++) JZ.push([-32 + k * 2.4, 22 + r * 2.8]);
  T.obj([-33, 21, -15, 30.5], function (g) {
    for (const [x, y] of JZ) {
      const p = g.p(x, y, 0);
      g.fill2([[p[0] - 1.3, p[1]], [p[0] + 1.3, p[1]], [p[0] + 1.1, p[1] - 3.6], [p[0] - 1.1, p[1] - 3.6]], '#C9C6BD', true);
      g.disc2([p[0], p[1] - 4.4], 1.2, '#D7D2C6');
      g.fill2([[p[0] - 1.6, p[1] - 3.9], [p[0] + 1.6, p[1] - 3.9], [p[0] + 1.2, p[1] - 2.2], [p[0] - 1.2, p[1] - 2.2]], '#D4553A', true);   // the red bib
      g.fill2(K.curve([[p[0] - 1.25, p[1] - 4.6], [p[0], p[1] - 6.2], [p[0] + 1.25, p[1] - 4.6]], 2, false).concat([[p[0], p[1] - 4.3]]), '#D4553A', true);   // the bonnet
      g.line2([[p[0] - 1.3, p[1]], [p[0] - 1.1, p[1] - 3.6]], { w: 0.35, c: '#8C8576', boil: false });
    }
  }, { name: 'jizo' });
  for (const [x, y, r] of [[-30, 8, 4.6], [-33, -10, 4.2], [-30, -30, 4.8], [10, -32, 4.4], [24, -26, 4.6], [33, 33, 4.0], [5, 33, 4.2]]) T.obj([x, y], (g) => K.tree(g, x, y, { r, h: 5.5, col: C.leafD }), { on: true });
  for (const [x, y] of [[-22, 14], [16, 32], [33, -6], [-34, 33]]) T.obj([x, y], (g) => TK.sakura(g, x, y, { r: 4.6 }), { on: true });

  /* ---------------- the living layer ---------------- */
  // pinwheels by the jizō, each spinning
  JZ.forEach(([x, y], i) => { if (i % 2) return; T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 9 + i) % 4; return { x: x + 0.9, y: y + 0.4, key: f, f }; },
    draw(g, st) { const b = g.p(0, 0, 0), c = [b[0], b[1] - 7.6]; g.line2([b, c], { w: 0.3, c: '#6B6458', boil: false }); const cols = ['#E9806A', '#F3E3A0', '#8FB7D9', '#C9E3A8']; for (let k = 0; k < 4; k++) { const a = (st.f / 4 + k / 4) * TAU * 0.25 + k * Math.PI / 2; g.fill2([c, [c[0] + Math.cos(a) * 1.8, c[1] + Math.sin(a) * 1.8], [c[0] + Math.cos(a + 0.7) * 1.2, c[1] + Math.sin(a + 0.7) * 1.2]], cols[(k + i) % 4], true); } g.disc2(c, 0.3, '#3A3530'); } }); });
  // the school trip: a teacher with a little flag, a crocodile of kids in yellow caps
  const route = [[34, 16], [-2, 16], [-2, 12.5], [34, 12.5]];
  K.walker(T, TK.who(5501, { top: '#5A6B5A', bot: '#3B3F47' }), route, 1.5, { phase: 0 });
  for (let k = 1; k <= 7; k++) K.walker(T, TK.who(5501 + k, { k: 0.72, cap: '#E6C24F', randoseru: k % 2 ? '#C9463E' : '#2E2A26', top: '#F3F1EA', bot: '#3F4D63' }), route, 1.5, { phase: -k * 0.022 });
  // visitors taking photos of the tower from the lawn
  T.cast([12, 6], (g) => { TK.person(g, 12, 6, 0, TK.who(5520, { dir: 2, pose: 'hold', phone: true })); TK.person(g, 13.6, 7.2, 0, TK.who(5521, { dir: 3, pose: 'wave', ph: 0.15 })); }, { on: true });
  T.cast([-26, 13], (g) => { TK.tarp(g, [[-29, 11, 0.04], [-23, 11, 0.04], [-23, 15, 0.04], [-29, 15, 0.04]]); TK.person(g, -27.5, 10.6, 0, TK.who(5522, { dir: 1, pose: 'sit' })); TK.person(g, -24.5, 10.6, 0, TK.kimono(5523, { dir: 1, pose: 'sit' })); TK.person(g, -22.6, 13.4, 0, TK.who(5524, { dir: 2, pose: 'sit' })); }, { on: true });
  for (let i = 0; i < 4; i++) K.walker(T, i % 2 ? TK.who(5530 + i) : TK.salary(5530 + i), [[-2.2 - i * 0.6, 34], [-2.2 - i * 0.6, 12 + i]], 1.7, { phase: i * 0.3 });
});
