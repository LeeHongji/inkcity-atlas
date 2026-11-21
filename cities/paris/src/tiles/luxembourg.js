'use strict';
/* (-100,0) The Luxembourg Gardens, brought down to the left bank's quai (the Pont des Arts lands on this tile's river
   edge at y 0). The palace closes the far side: a long cream front with a domed central pavilion and corner pavilions,
   steep slate roofs. Before it the terrace balustrade and the octagonal Grand Bassin with its jet, where children push
   toy sailboats across the water with long sticks: each boat sails from one child to another, waits to be pushed off
   again, and sails on. Around the basin: gravel, the famous green metal chairs (a reader with his feet up on a second
   chair, a woman sunbathing, chess), flower beds in autumn colours, queens on pedestals, clipped chestnuts in rows
   with pétanque under them, the puppet theatre with children on benches, the sailboat man's little cart. Along the
   river: the quai with plane trees and the backs of the bouquinistes' boxes. */
SF.tile('luxembourg', -100, 0, { rim: 10 }, function (T) {
  const H = 37, BX = 4, BY = 0, BR = 9.5, WZ = -0.5;
  const oct = (cx, cy, r, z) => { const p = []; for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + TAU * i / 8; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]); } return p; };
  T.ground(function (g) {
    K.slab(g, H, { top: PC.gravel });
    g.scuff(K.rect(-H, -H, H, H), { dir: Math.atan2(AY, AX), len: 2.2, c: PC.gravelD, dens: 0.9, w: 0.45, spread: 0.5 });
    // lawns with flower borders on either side of the basin
    for (const r of [[-14, -33, 12, -18], [-14, 18, 12, 33]]) {
      const q = K.rect(r[0], r[1], r[2], r[3]); g.fill(q, PC.lawn); g.grass(q, { dens: 0.9 }); g.outline(q, { w: 0.5, c: '#86A05E', boil: false });
      const fb = K.rect(r[0] + 1, r[1] + 1, r[2] - 1, r[1] + 2.4); g.fill(fb, '#9A7A52');
    }
    // the basin: a stone kerb, the water a little below
    const out = oct(BX, BY, BR + 0.9, 0), inn = oct(BX, BY, BR, WZ);
    g.fill(out, '#E2D8C2'); g.fill(inn, PC.water); g.water(oct(BX, BY, BR * 0.92, WZ), { dens: 1.3 }); g.outline(out, { w: 0.6, boil: false }); g.outline(oct(BX, BY, BR, 0), { w: 0.45, c: '#8C8576', boil: false });
    // the terrace step in front of the palace
    g.fill(K.rect(-22, -30, -17, 30), '#E3D9C3'); g.line([[-17, -30, 0], [-17, 30, 0]], { w: 0.6, c: '#A99A7B', boil: false });
    // the quai along the river edge
    g.fill(K.rect(29, -H, H, H), PC.pave);
  }, { rim: true });

  /* ---------------- the palace ---------------- */
  const STN = { t: '#F2EBDA', l: '#EEE3CA', r: '#D8CBAC' }, SLATE = '#6C7580';
  const block = (x0, y0, x1, y1, Z, rh, name, dome) => T.obj([x0, y0, x1, y1], function (g) {
    g.boilP = 0.25;
    K.box(g, x0, y0, x1, y1, 0, Z, STN, { w: 0.9 });
    for (const face of ['R', 'L']) {
      const p = face === 'L' ? y1 : x1, A0 = face === 'L' ? x0 : y0, A1 = face === 'L' ? x1 : y1, n = Math.max(1, Math.round((A1 - A0) / 2.4)), bw = (A1 - A0) / n, pil = [];
      for (let i = 0; i < n; i++) {
        const m = A0 + bw * (i + 0.5);
        const ar = [K.pt(face, p + 0.04, m - 0.55, 0.6), K.pt(face, p + 0.04, m + 0.55, 0.6)]; for (let k = 0; k <= 6; k++) { const t = Math.PI * k / 6; ar.push(K.pt(face, p + 0.04, m + Math.cos(t) * 0.55, 3.2 + Math.sin(t) * 0.55)); } g.fill(ar, '#5E6B76');
        PA.win(g, face, p, m - 0.55, m + 0.55, 5.0, 7.8, { pane: '#5E6B76' });
        const a = g.p.apply(g, K.pt(face, p + 0.05, A0 + bw * i, 0.3)), b = g.p.apply(g, K.pt(face, p + 0.05, A0 + bw * i, Z - 0.4)); pil.push(a[0], a[1], b[0], b[1]);
      }
      g.segs2(pil, '#CDBF9E', 0.6);
      g.line([K.pt(face, p + 0.05, A0, 4.4), K.pt(face, p + 0.05, A1, 4.4)], { w: 0.35, c: '#B5A684', boil: false, ext: 0 });
    }
    K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, Z, Z + 0.5, STN, { w: 0.6, nohid: true });
    if (dome) {
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const pd = [K.pt('R', x1 + 0.05, cy - 3.2, Z + 0.5), K.pt('R', x1 + 0.05, cy + 3.2, Z + 0.5), K.pt('R', x1 + 0.05, cy, Z + 2.8)]; g.fill(pd, '#F6F0E2'); g.outline(pd, { w: 0.45, c: '#A99A7B', boil: false });
      K.cyl(g, cx, cy, 3.0, Z + 0.5, Z + 3.4, { t: '#E9E2CC', l: '#EEE3CA', r: '#D8CBAC' }, { w: 0.7, n: 12 });
      for (let k = 0; k < 4; k++) { const a = Math.PI * 0.05 + k * 0.3, p = g.p(cx + Math.cos(a) * 3.02, cy + Math.sin(a) * 3.02, Z + 1.2); g.fill2([[p[0] - 0.4, p[1]], [p[0] + 0.4, p[1]], [p[0] + 0.4, p[1] - 4.6], [p[0] - 0.4, p[1] - 4.6]], '#5E6B76', true); }
      K.dome(g, cx, cy, 3.1, Z + 3.4, 4.0, SLATE, { w: 0.75, ribs: 8, ribCol: '#4A525A', ribW: 0.5, shadow: shade(SLATE, 0.15), band: true });
      K.cyl(g, cx, cy, 0.7, Z + 7.3, Z + 8.6, { t: '#E9E2CC', l: '#EEE3CA', r: '#D8CBAC' }, { w: 0.5, n: 8 }); g.disc2(g.p(cx, cy, Z + 9.0), 0.45, PC.gold);
    } else PA.mansard(g, x0 + 0.3, y0 + 0.3, x1 - 0.3, y1 - 0.3, Z + 0.5, { h: rh, d: 1.4, h2: 0.6, col: SLATE, seam: '#5A626C', dormers: 3.0, chim: [[(x0 + x1) / 2, y0 + 1.2, 'x', 3]] });
  }, { name });
  block(-34, -30, -26, -20, 11, 3.6, 'palace pavilion 1');
  block(-33, -20, -25, -5, 9.6, 3.0, 'palace wing 1');
  block(-34, -5, -24, 5, 11, 3.6, 'palace centre', true);
  block(-33, 5, -25, 20, 9.6, 3.0, 'palace wing 2');
  block(-34, 20, -26, 30, 11, 3.6, 'palace pavilion 2');

  /* ---------------- balustrade, statues, trees ---------------- */
  for (const [y0, y1] of [[-30, -4], [4, 30]]) T.obj([-17.4, y0, -16.6, y1], function (g) {
    const b = []; for (let y = y0; y <= y1; y += 0.5) { const p = g.p(-17, y, 0), q = g.p(-17, y, 1.1); b.push(p[0], p[1], q[0], q[1]); } g.segs2(b, '#D8CBAC', 0.5);
    g.line([[-17, y0, 1.2], [-17, y1, 1.2]], { w: 0.7, boil: false }); g.line([[-17, y0, 0.15], [-17, y1, 0.15]], { w: 0.45, c: '#A99A7B', boil: false });
    for (const y of [y0 + 1, y1 - 1]) { K.box(g, -17.6, y - 0.6, -16.4, y + 0.6, 0, 1.6, STN, { w: 0.5, boil: false }); const c = g.p(-17, y, 1.6); g.fill2([[c[0] - 1.8, c[1]], [c[0] + 1.8, c[1]], [c[0] + 1.4, c[1] - 2.6], [c[0] - 1.4, c[1] - 2.6]], '#C9734F', true); K.blooms(g, -17.5, y - 0.5, -16.5, y + 0.5, 2.2, ['#C9463E', '#E6C24F'], { sp: 0.5, r: 0.8 }); }
  }, { name: 'balustrade' });
  // the queens of France on their pedestals, round the basin
  [[-12, -12], [-12, 12], [20, -15], [20, 15]].forEach(([x, y], i) => T.obj([x, y], function (g) {
    K.box(g, x - 0.8, y - 0.8, x + 0.8, y + 0.8, 0, 3.0, STN, { w: 0.55, boil: false });
    const c = g.p(x, y, 3.0); g.fill2([[c[0] - 1.6, c[1]], [c[0] + 1.6, c[1]], [c[0] + 0.9, c[1] - 6.6], [c[0] - 0.9, c[1] - 6.6]], '#E9E2D2', true); g.disc2([c[0], c[1] - 7.6], 1.2, '#E9E2D2'); g.fill2([[c[0] - 1.0, c[1] - 8.6], [c[0] + 1.0, c[1] - 8.6], [c[0], c[1] - 10]], '#E9E2D2', true);
    g.line2([[c[0] - 1.6, c[1]], [c[0] - 0.9, c[1] - 6.6]], { w: 0.4, c: '#9A9384', boil: false }); g.line2([[c[0] + 1.6, c[1]], [c[0] + 0.9, c[1] - 6.6]], { w: 0.4, c: '#9A9384', boil: false });
  }, { name: 'queen' }));
  // clipped chestnuts in rows on the near side (the pétanque ground under them), and planes along the quai
  for (let x = -10; x <= 22; x += 6.4) for (const y of [-33.5, 33.5]) if (!(x > 12 && y > 0)) T.obj([x, y], (g) => PA.clipped(g, x, y, { s: 2.3, h: 4.6, hh: 4.2, turn: true }), { name: 'chestnut' });
  for (let y = -32; y < 34; y += 8) if (Math.abs(y) > 4) T.obj([33.4, y], (g) => PA.plane(g, 33.4, y, { r: 3.6, h: 6.2, turn: 0.5 + h1(y + 3) * 0.4 }), { name: 'quai tree' });
  // the quai parapet with the bouquinistes' boxes (we see their backs and propped lids)
  const BOXY = [-30, -24, -16, -10, 10, 16, 24, 30];
  for (let i = 0; i < BOXY.length; i += 2) { const y0 = BOXY[i] - 2.6, y1 = BOXY[i + 1] + 2.6; T.obj([35.9, y0, 36.7, y1], (g) => { PA.parapet(g, 'y', 36.3, y0, y1); for (const y of [BOXY[i], BOXY[i + 1]]) PA.bouquin(g, 36.3, y, 'y', h1(y + 40) > 0.3, 8800 + y); }, { name: 'bouquinistes' }); }

  /* ---------------- the puppet theatre ---------------- */
  T.obj([22, 20, 30, 26], function (g) {
    K.box(g, 22, 20, 30, 26, 0, 5.4, { t: '#C9B48C', l: '#E9DCC0', r: '#D2C2A0' }, { w: 0.8 });
    K.gable(g, 21.6, 19.6, 30.4, 26.4, 5.4, 2.6, 'x', { a: '#B8443A', b: '#9E3A31', e: '#E9DCC0' }, { c: '#6E2A22' });
    g.fill(K.on('L', 26.03, 23.5, 28.5, 1.6, 4.2), '#7E2A24'); g.fill(K.on('L', 26.04, 24, 28, 2.2, 3.8), '#3A2E26');
    PA.sign(g, 'L', 26, 23, 29, 4.4, 5.2, '#2F5D4B', { seed: 31, word: 'GUIGNOL', ink: '#F3DFA0' });
  }, { name: 'guignol' });
  // Guignol himself at the window, bobbing
  T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 3) % 6; return { x: 26, y: 26.15, z: 2.4, key: f, f }; },
    draw(g, st) { const b = g.p(0, 0, 0), up = [0, 0.8, 1.4, 0.8, 0, -0.4][st.f]; g.fill2([[b[0] - 1.1, b[1] - up], [b[0] + 1.1, b[1] - up], [b[0] + 0.9, b[1] - 3.2 - up], [b[0] - 0.9, b[1] - 3.2 - up]], '#C9463E', true); g.disc2([b[0], b[1] - 4.4 - up], 1.2, '#F2D3B8'); g.fill2([[b[0] - 1.3, b[1] - 5.0 - up], [b[0] + 1.3, b[1] - 5.0 - up], [b[0] + 0.2, b[1] - 7 - up]], '#2A2622', true); g.disc2([b[0] + 0.4, b[1] - 4.5 - up], 0.18, '#2A2622'); } });
  // children on benches watching
  T.cast([26, 29.5], function (g) { for (const y of [28.6, 30.6]) { K.box(g, 22.4, y - 0.4, 29.6, y + 0.4, 0, 1.0, { t: '#2F5D4B', l: '#3E7560', r: '#2F5D4B' }, { w: 0.45, boil: false, nohid: true }); for (let i = 0; i < 5; i++) PA.person(g, 23.2 + i * 1.5, y + 0.1, 1.0, PA.who(8900 + i + y * 10, { dir: 3, pose: 'sit', k: 0.72 })); } }, { name: 'audience' });

  /* ---------------- the toy sailboats and the children ---------------- */
  // six children round the basin with sticks; each boat sails between them on a timetable
  const KIDS = []; for (let i = 0; i < 6; i++) { const a = Math.PI * 0.12 + TAU * i / 6; KIDS.push({ a, x: BX + Math.cos(a) * (BR + 1.7), y: BY + Math.sin(a) * (BR + 1.7), bx: BX + Math.cos(a) * (BR - 1.2), by: BY + Math.sin(a) * (BR - 1.2) }); }
  KIDS.forEach((k, i) => T.cast([k.x, k.y], function (g) {
    const dir = Math.abs(Math.cos(k.a)) > Math.abs(Math.sin(k.a)) ? (Math.cos(k.a) > 0 ? 2 : 0) : (Math.sin(k.a) > 0 ? 3 : 1);
    const F = g.p(k.x, k.y, 0), tip = g.p(k.bx, k.by, 0.8), r = PA.person(g, k.x, k.y, 0, PA.who(8950 + i, { k: 0.72, dir, pose: 'hold', reach: [(tip[0] - F[0]) * 0.35 / 0.72, (tip[1] - F[1]) * 0.35 / 0.72 - 9] }));
    const h = r.hands[0]; g.line2([h, tip], { w: 0.5, c: '#8A6440', boil: false, ext: 0 });
  }, { on: true }));
  // the parents' green chairs and the rental cart by the basin
  const SAILS = ['#C9463E', '#3F5F8F', '#E6C24F', '#F3F1EA', '#5F8F6A'];
  for (let b = 0; b < 5; b++) {
    const route = [0, 3, 1, 4, 2, 5].map((i) => (i + b) % 6), per = 6 * 7.0, hold = 1.6;
    T.actor({ sample: 0.3, period: per, grow: false,
      at(t) {
        const u = (((t + b * 3.1) % per) + per) % per, leg = Math.floor(u / 7.0), f = (u - leg * 7.0);
        const A = KIDS[route[leg % 6]], B = KIDS[route[(leg + 1) % 6]], s = f < hold ? 0 : smooth((f - hold) / (7.0 - hold));
        const x = lerp(A.bx, B.bx, s), y = lerp(A.by, B.by, s), hd = Math.atan2(B.by - A.by, B.bx - A.bx), q = Math.round(hd / (TAU / 16));
        return { x, y, z: WZ, key: 'q' + (((q % 16) + 16) % 16) + (f < hold ? 'r' : 's'), ang: q * TAU / 16, rest: f < hold };
      },
      draw(g, st) {
        const ca = Math.cos(st.ang), sa = Math.sin(st.ang), P = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z);
        g.fill2([P(-1.0, -0.45, 0), P(0.7, -0.45, 0), P(1.3, 0, 0), P(0.7, 0.45, 0), P(-1.0, 0.45, 0)], '#DCEAE8', true);
        const hull = [P(-0.9, -0.38, 0.45), P(0.6, -0.38, 0.45), P(1.15, 0, 0.5), P(0.6, 0.38, 0.45), P(-0.9, 0.38, 0.45)];
        g.fill2(hull, b % 2 ? '#F3F1EA' : '#8A5A3A', true); g.line2(hull, { w: 0.35, c: '#3A3530', close: true, boil: false, wob: 0.2 });
        const m0 = P(0, 0, 0.5), m1 = P(0, 0, 3.6), bm = P(-0.9, 0, 1.0), sail = [m1, [m0[0], m0[1] - 1.0], bm];
        g.fill2(sail, SAILS[b], true); g.line2(sail, { w: 0.3, c: '#3A3530', close: true, boil: false, wob: 0.2 }); g.segs2([m0[0], m0[1], m1[0], m1[1]], '#3A3530', 0.35);
        const nb = [lerp(m1[0], bm[0], 0.5), lerp(m1[1], bm[1], 0.55)]; g.disc2(nb, 0.6, '#F6F3EA');
      } });
  }
  // the basin's jet
  T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 5) % 5; return { x: BX, y: BY, z: WZ, key: f, f }; },
    draw(g, st) { const b = g.p(0, 0, 0), h = 15 + st.f * 0.8; g.fill2([[b[0] - 0.7, b[1]], [b[0] + 0.7, b[1]], [b[0] + 0.3, b[1] - h], [b[0] - 0.3, b[1] - h]], '#E6F1F3', true); const sp = []; for (let k = 0; k < 8; k++) { const a = TAU * k / 8 + st.f * 0.3; sp.push(b[0] + Math.cos(a) * 1.2, b[1] - h + 1, b[0] + Math.cos(a) * 4.2, b[1] - h + 6 + Math.sin(a) * 1.2); } g.segs2(sp, '#EEF6F7', 0.5); g.ring2([b[0], b[1]], 3.4, { c: '#F6FAFA', w: 0.4 }); } });
  // green chairs: a reader with his feet up, a sunbather, two friends talking, chess players
  const chair = (g, x, y, face) => { const p = g.p(x, y, 0), q = g.p(x - (face === 'R' ? 0.6 : 0), y - (face === 'L' ? 0.6 : 0), 0); g.segs2([p[0] - 1.4, p[1], p[0] - 1.2, p[1] - 4.4, p[0] + 1.4, p[1], p[0] + 1.2, p[1] - 4.4], '#2F5D4B', 0.45); g.fill2([[q[0] - 1.8, q[1] - 4.4], [q[0] + 1.8, q[1] - 4.4], [q[0] + 1.6, q[1] - 9.2], [q[0] - 1.6, q[1] - 9.2]], '#3E7560', true); g.fill2(arcPts(p[0], p[1] - 4.5, 1.9, 0, TAU, 8).map((r) => [r[0], p[1] - 4.5 + (r[1] - p[1] + 4.5) * 0.45]), '#2F5D4B', true); };
  const sitC = (x, y, s, face, extra) => T.cast([x, y], function (g) { chair(g, x, y, face); const r = PA.person(g, x, y, 1.3, PA.who(s, Object.assign({ dir: face === 'L' ? 1 : 0, pose: 'sit' }, extra || {}))); if (extra && extra.book) { const h = r.hands[0]; g.fill2([[h[0] - 1.2, h[1] - 0.6], [h[0] + 1.2, h[1] - 1.0], [h[0] + 1.2, h[1] + 0.8], [h[0] - 1.2, h[1] + 1.2]], '#F3EBD6', true); } }, { on: true });
  sitC(-9, -5, 9001, 'R', { book: true, hands: [[3, -9], [2.4, -9.4]] }); sitC(-9.5, 5.5, 9002, 'R'); sitC(-10.5, 7.4, 9003, 'R', { book: true, hands: [[3, -9], [2.4, -9.4]] });
  sitC(16.5, -6, 9004, 'R'); sitC(17, 8, 9005, 'L', { book: true, hands: [[3, -9], [2.4, -9.4]] }); sitC(-2, 14.5, 9006, 'L'); sitC(9.5, 15, 9007, 'L'); sitC(1, -15.5, 9008, 'L', { book: true, hands: [[3, -9], [2.4, -9.4]] });
  T.cast([-2, 25], (g) => PA.person(g, -2, 25, 0.05, PA.who(9009, { dir: 0, lie: -2.5, bare: true })), { on: true });
  // pétanque under the chestnuts: a pointer crouching, two watching, the boules and the jack
  T.cast([4, 29.6], function (g) {
    for (const [x, y, c] of [[2, 30.6, '#8C8C8C'], [3.2, 30.2, '#8C8C8C'], [5.8, 30.8, '#6E6E6E'], [6.9, 30.4, '#D8AE48']]) g.disc2(g.p(x, y, 0.3), 0.6, c);
    PA.person(g, -2.5, 30.4, 0, PA.who(9010, { dir: 0, pose: 'crouch', beret: '#2A2622', top: '#E7E2D6' }));
    PA.person(g, -4.8, 28.8, 0, PA.who(9011, { dir: 0, pose: 'stand' })); PA.person(g, -5.6, 31.2, 0, PA.who(9012, { dir: 0, pose: 'hold' }));
  }, { on: true });
  // walkers on the gravel alleys, a jogger round the basin, people crossing from the Pont des Arts
  PA.walker(T, PA.who(9020), [[35, 0.6], [16, 0.6], [16, 14], [-14, 14], [-14, -14], [16, -14], [16, 0.6]], 1.4, { phase: 0.1 });
  PA.walker(T, PA.who(9021, { top: '#E6C24F', shorts: true, bare: true, dress: undefined }), [[-15, -16], [22, -16], [22, 16], [-15, 16]], 2.4, { phase: 0.3 });
  PA.walker(T, PA.who(9022), [[31, -34], [31, 34]], 1.3, { phase: 0.2 });
  PA.walker(T, PA.who(9023), [[31.5, 34], [31.5, -34]], 1.5, { phase: 0.65 });
  PA.walker(T, PA.who(9024), [[-15, 16], [-15, -16], [22, -16], [22, 16]], 1.2, { phase: 0.55 });
  PA.streetSide(T, { furn: [[-122, -41.6, 'morris'], [-80, -41.6, 'wallace']] });
});
