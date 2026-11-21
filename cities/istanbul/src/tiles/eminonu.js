'use strict';
/* (0,0) Eminönü. What it is: the busiest waterfront of the old city, where the Golden Horn meets the Bosphorus. The
   New Mosque (Yeni Cami) stands on its stepped platform at the west side of the square: a pyramid of lead domes — the
   central dome on four half-domes, little domes at the corners, weight turrets — two minarets with three balconies
   each where the courtyard meets the hall. Behind it (south) the long vaulted Spice Bazaar (MISIR ÇARŞISI), a roof of
   small domes, its gate on the east end and spice shops along its wall with heaped cones of sumac, saffron, paprika.
   On the Horn the ferry pier: a timber deck on piles and a white waiting hall with a clock turret, the berth on its
   north face. On the east edge the quay of the Bosphorus with anglers.
   The clever moment (shot `eminonu`): the Kadıköy ferry comes alongside (src/37_timetable.js, route A); the gangways
   drop; twenty commuters pour off along the pier's east side into the square and scatter; the eighteen who have
   gathered on the pier's west side during the wait file on; the gangways lift and the ferry backs out.
   Who else: pigeons by the hundred on the square (they lift off together now and then), seed sellers at their little
   tables, a simit cart, a tea seller, anglers on the Bosphorus quay, tourists, cats. */
SF.tile('eminonu', 0, 0, { rim: 20 }, function (T) {
  const H = 37, YZ = 1.6, PIER = { x0: -2, y0: -37.6, x1: 18.5, y1: -28 };
  T.ground(function (g) {
    IS.ground(g, -H, -28, 28, H, '#E8E0CE', { water: 'ne' });
    IS.paving(g, -H, -28, 28, H, { len: 2.6, dens: 0.55 });
    // the square: a field of big stone slabs; the quay strips
    const sl = []; for (let x = -10; x < 26; x += 4) { const a = g.p(x, -25, 0.01), b = g.p(x, 22, 0.01); sl.push(a[0], a[1], b[0], b[1]); } for (let y = -25; y < 22; y += 4) { const a = g.p(-10, y, 0.01), b = g.p(26, y, 0.01); sl.push(a[0], a[1], b[0], b[1]); }
    g.segs2(sl, '#D9D0BC', 0.35);
    g.fill(K.rect(-H, -28, 28, -25.6), '#DCD4C2'); g.fill(K.rect(24.4, -28, 28, H), '#DCD4C2');
  }, { rim: true });

  /* ---- the New Mosque on its platform ---- */
  T.obj([-36, -13, -11, 21], function (g) {
    g.boilP = 0.3;
    K.box(g, -36, -13, -11, 21, 0, YZ, { t: '#E2DACA', l: '#D3CAB6', r: '#BFB6A2' }, { w: 0.85 });
    for (let i = 0; i < 4; i++) K.box(g, -11, -6 + i * 0.01, -11 + 3.2 - i * 0.8, 14, 0, YZ * (i + 1) / 4, { t: '#E9E2D4', l: '#DCD4C2', r: '#C9C0AC' }, { w: 0.45, boil: false });
    g.fill(K.rect(-35.5, -12.5, -11.5, 20.5, YZ), '#EAE3D4');
  }, { name: 'platform' });
  IS.avlu(T, -33, -12.5, -15, 0, { d: 2.6, H: 4.4, z0: YZ, near: '' });
  T.obj([-33, 0, -14.6, 17.5], (g) => g.at(0, 0, YZ, (g2) => IS.mosque(g2, { cx: -24, cy: 8.6, s: 8.6, H: 8.4, R: 4.6, semis: ['x-', 'x+', 'y-', 'y+'], corner: true, towers: true, domeH: 0.95 })), { on: true, name: 'yeni cami' });
  for (const [x, y] of [[-33.6, -0.6], [-14.4, -0.6]]) T.obj([x, y], (g) => IS.minaret(g, x, y, 30, { r: 0.8, z0: YZ, bal: [15, 19.5, 23.5] }), { on: true, name: 'minaret' });

  /* ---- the Spice Bazaar ---- */
  T.obj([-36, 23, 14, 32], function (g) {
    g.boilP = 0.25;
    const S = { t: '#D6C9AE', l: '#E2D3B4', r: '#CBBB9A' };
    K.box(g, -36, 23, 14, 32, 0, 6.4, S, { w: 0.85 });
    // the roof: a vault line with a row of small domes and chimneys
    for (let x = -33.5; x < 13; x += 3.4) IS.dome(g, x, 27.5, 1.45, 6.4, { drum: 0.35, win: 0, h: 1.1, ribs: 0, alem: false, w: 0.45 });
    // shops in the south wall: low arches with spice sacks out front
    for (let x = -34; x < 11; x += 5) {
      IS.arcade(g, 'L', 32.02, x, x + 4.2, 0, 3.6, 1, { dark: '#5E584E' });
      const c = g.p(x + 2.1, 32.9, 0); const cols = ['#B8322A', '#E3A72F', '#C9662E', '#7A2E3A', '#9AA84A', '#E8C66E'];
      for (let k = 0; k < 3; k++) IS.cone2(g, [c[0] - 3.4 + k * 3.4, c[1] + k * 0.3], 1.6, 2.6, cols[(Math.round(x) + k * 2 + 60) % cols.length]);
    }
    // the gate on the east end
    const q = [[14.02, 25, 0], [14.02, 30, 0]]; for (let k = 0; k <= 8; k++) { const t = Math.PI * k / 8; q.push([14.02, 27.5 + 2.5 * Math.cos(t), 3.6 + 2 * Math.sin(t)]); } g.fill(q, '#4E4A42');
    K.sign(g, 'R', 14.02, 24.2, 30.8, 5.0, 6.2, '#2E5E8A', 'MISIR ÇARŞISI', { w: 0.3 });
  }, { name: 'spice bazaar' });

  /* ---- the ferry pier ---- */
  T.obj([PIER.x0, PIER.y0, PIER.x1, PIER.y1], (g) => IS.iskele(g, PIER.x0, PIER.y0, PIER.x1, PIER.y1, { b: [-1.6, -36.4, 3.8, -29.2], H: 5.6, name: 'KADIKÖY', clock: [1.1, -32.8], bollards: [[5.4, -37], [17.6, -37]] }), { name: 'pier' });
  T.obj([16.8, -32], (g) => IS.lamp(g, 16.8, -32), { on: true, name: 'lamp' });
  // turnstiles at the pier's land end
  T.obj([4.5, -28.6, 13, -27.6], (g) => { for (let x = 5; x < 13; x += 1.8) K.box(g, x, -28.5, x + 0.5, -27.7, 0, 2.2, { t: '#9AA3A8', l: '#B9C0C4', r: '#8E979C' }, { w: 0.4, boil: false }); K.sign(g, 'L', -27.6, 4.8, 12.8, 2.6, 3.4, '#1F4E79', 'ŞEHİR HATLARI', { w: 0.3 }); }, { name: 'turnstiles' });
  // the gangways: down while the ferry is alongside
  T.actor({ sample: 0.2, period: IT.WC, grow: false, cast: false,
    at(t) { const u = IT.emTau(t); if (u < 0.4 || u > 9.1) return null; return { x: 4, y: -37.4, z: 0, key: 'g' }; },
    draw(g) { for (const x of [2.8, 10]) { const q = [[x - 1, 0, 0], [x + 1, 0, 0], [x + 1, -0.9, -0.1], [x - 1, -0.9, -0.1]]; g.fill(q, '#B39872'); g.outline(q, { w: 0.4, boil: false }); const r = []; for (const xx of [x - 1, x + 1]) { const a = g.p(xx, -0.45, 1.1); r.push(...g.p(xx, 0, 1.1), ...a); } g.segs2(r, '#5A564E', 0.35); } } });

  /* ---- trees, lamps, the seed sellers, a simit cart ---- */
  for (const [x, y] of [[-6, 20], [10, 20], [24, -12], [24, 8], [-8, -20]]) T.obj([x, y], (g) => IS.plane(g, x, y, { r: 3.8, h: 5 }), { name: 'plane' });
  for (const [x, y] of [[-8, -6], [20, 14], [6, -23]]) T.obj([x, y], (g) => IS.lamp(g, x, y), { name: 'lamp' });
  T.obj([18, 2], (g) => IS.simitCart(g, 18, 2, { face: 'L' }), { name: 'simit cart' });
  for (const [x, y, s] of [[-4, 4, 1], [2, 12, 2]]) T.cast([x, y], (g) => { const c = g.p(x, y, 1.4); K.box(g, x - 0.8, y - 0.8, x + 0.8, y + 0.8, 0, 1.4, { t: '#C9A26B', l: '#B58F58', r: '#9E7B48' }, { w: 0.4, boil: false }); for (let k = 0; k < 4; k++) g.fill2(arcPts(c[0] - 1.6 + k * 1.1, c[1] - 0.3, 0.5, 0, TAU, 6), '#E6C979', true); IS.stool2(g, g.p(x + 1.6, y + 1.2, 1.3)); IS.person(g, x + 1.6, y + 1.2, 1.3, IS.who(1300 + s, { dir: 2, pose: 'sit', scarf: s === 1 ? '#3B3F47' : undefined, dress: s === 1 ? '#3B3F47' : undefined, hair: '#8E8A84' })); }, { name: 'seed seller' });

  /* ---- pigeons: a flock on the square, lifting off together every 16 s ---- */
  for (let i = 0; i < 26; i++) { const R = RNG(i * 57 + 11), x0 = -9 + R() * 22, y0 = -6 + R() * 22; T.actor({ sample: 0.5, period: 16,
    at(t) { const u = ((t + i * 0.03) % 16 + 16) % 16, up = u > 12.5 && u < 15.2, f = up ? Math.floor(t * 8 + i) % 4 : (Math.floor(t * 2 + i * 1.7) % 3 === 0 ? 'u' : 'p'), h = up ? Math.sin(Math.PI * (u - 12.5) / 2.7) * (7 + (i % 4)) : 0; return { x: x0 + (up ? (u - 12.5) * 1.8 : 0), y: y0 - (up ? (u - 12.5) * 0.8 : 0), z: h, key: up ? 'f' + f : f, f, up, fl: i % 2 ? 1 : -1 }; },
    draw(g, st) { const p = g.p(0, 0, 0); if (st.up) IS.gull2(g, p, st.f); else IS.pigeon2(g, p, st.fl, st.f === 'u'); } }); }

  /* ---- the ferry rush ---- */
  const path = (pts) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, L, len: L[L.length - 1], at(d) { d = clamp(d, 0, L[L.length - 1]); let i = 0; while (i < pts.length - 2 && d > L[i + 1]) i++; const a = pts[i], b = pts[i + 1], f = (d - L[i]) / ((L[i + 1] - L[i]) || 1); return { x: lerp(a[0], b[0], f), y: lerp(a[1], b[1], f), dx: b[0] - a[0], dy: b[1] - a[1] }; } }; };
  const dirOf = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3);
  const walkSt = (q, d, extra) => { const ph = Math.floor((d / 2.4) % 1 * 8), dir = dirOf(q.dx, q.dy); return Object.assign({ x: q.x, y: q.y, z: 0, key: 'w' + dir + '.' + ph, dir, pose: 'walk', ph: ph / 8 }, extra || {}); };
  // where the alighting commuters go: across the square and away (to the tram, the bazaar, the underpass, the quay)
  const EXITS = [[-6, 36], [26, 36], [14.5, 27.5], [-10, -24], [26, -20], [26, 30], [-4, 22], [8, 36]];
  const LOOKS = []; for (let i = 0; i < 20; i++) LOOKS.push(IS.who(1400 + i, i % 7 === 3 ? { phone: true } : i % 9 === 5 ? { load: 'boxes', scarf: undefined, dress: undefined } : {}));
  for (let i = 0; i < 20; i++) {
    const R = RNG(i * 13 + 7), mid = [8 + R() * 14, -18 + R() * 12], ex = EXITS[i % EXITS.length];
    const P = path([[13 + (i % 3) * 0.7, -38.1], [13 + (i % 3) * 0.7, -37.0], [16.6 - (i % 2) * 0.8, -34.5], [16.6 - (i % 2) * 0.8, -27], mid, ex]);
    const t0 = 0.7 + i * 0.15, sp = 2.3 + R() * 0.35, look = LOOKS[i];
    T.actor({ sample: 0.3, period: IT.WC, cast: false,
      at(t) { const u = IT.emTau(t) - t0; if (u < 0) return null; const d = u * sp; if (d > P.len) return null; const a = Math.min(1, (P.len - d) / 2.2, d / 0.8); return walkSt(P.at(d), d, { alpha: a < 1 ? Math.max(0.03, a) : null }); },
      draw(g, st) { IS.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
  }
  // the boarding crowd: they arrive during the wait and stand on the pier's west side, then file aboard
  const ENTR = [[-12, -26], [-6, 36], [26, 36], [26, 6], [-10, 22], [14.5, 27.5]];
  const BLOOKS = []; for (let j = 0; j < 18; j++) BLOOKS.push(IS.who(1450 + j, j % 6 === 2 ? { phone: true } : j % 8 === 5 ? { cup: true } : {}));
  for (let j = 0; j < 18; j++) {
    const spot = [5.0 + (j % 6) * 1.0 + (Math.floor(j / 6) % 2) * 0.45, -35.8 + Math.floor(j / 6) * 1.95], en = ENTR[j % ENTR.length];
    const IN = path([en, [en[0] * 0.5 + 4, -22 + (j % 4)], [6.5 + (j % 4) * 0.8, -27.0], spot]), OUT = path([spot, [6.4 + (j % 3) * 0.6, -36.9], [6.4 + (j % 3) * 0.6, -38.3]]);
    const go = 2.6 + j * 0.27, arr = 18 + j * 3.1, spIn = 1.3, spOut = 1.7, look = BLOOKS[j], wdir = 3;
    T.actor({ sample: 0.3, period: IT.WC, cast: false,
      at(t) {
        const u = IT.emTau(t);
        if (u < go) return { x: spot[0], y: spot[1], z: 0, key: 's' + wdir, dir: wdir, pose: look.phone ? 'hold' : 'stand' };
        if (u < 10) { const d = (u - go) * spOut; if (d > OUT.len) return null; const a = Math.min(1, (OUT.len - d) / 1.2); return walkSt(OUT.at(d), d, { alpha: a < 1 ? Math.max(0.03, a) : null }); }
        if (u < arr) return null;
        const d = (u - arr) * spIn; if (d < IN.len) { const a = Math.min(1, d / 1.2); return walkSt(IN.at(d), d, { alpha: a < 1 ? Math.max(0.03, a) : null }); }
        return { x: spot[0], y: spot[1], z: 0, key: 's' + wdir, dir: wdir, pose: look.phone ? 'hold' : 'stand' };
      },
      draw(g, st) { IS.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.pose, ph: st.ph || 0, phone: look.phone && st.pose === 'hold' })); } });
  }
  // the ferry's horn: a puff of steam from the funnel as it backs out
  T.actor({ sample: 0.2, period: IT.WC, grow: false, cast: false, layer: 'top',
    at(t) { const u = IT.emTau(t); if (u < 9.0 || u > 11.2) return null; const s = IT.ferry('A', t), f = Math.floor((u - 9.0) * 4); return { x: s.x - 1.8 * Math.cos(s.ang), y: s.y - 1.8 * Math.sin(s.ang), z: IT.WL + 9.4, key: 'p' + f, f }; },
    draw(g, st) { const p = g.p(0, 0, 0); for (let i = 0; i <= Math.min(3, st.f); i++) g.disc2([p[0] - i * 2.2, p[1] - 2 - i * 2.6], 1.4 + i * 0.7, 'rgba(246,244,238,' + (0.85 - i * 0.18) + ')'); } });

  /* ---- the quays: anglers on the Bosphorus edge, people by the Horn ---- */
  for (const [y, s] of [[-14, 1501], [-2, 1502], [12, 1503], [26, 1504]]) T.cast([26.6, y], (g) => { IS.person(g, 26.6, y, 0, IS.who(s, { dir: 0, pose: 'hold', fcap: s % 2 ? '#3B3F47' : undefined, scarf: undefined, dress: undefined })); const a = g.p(27, y, 4.2), b = g.p(32, y, 7.2), c = g.p(33.6, y, IT.WL); g.line2([a, b], { w: 0.45, c: '#3A3128', boil: false, ext: 0 }); g.fine2([b, c], { w: 0.22, c: '#5A564E' }); const bk = g.p(25.6, y + 1.2, 0); g.fill2([[bk[0] - 1, bk[1]], [bk[0] + 1, bk[1]], [bk[0] + 1.3, bk[1] - 2], [bk[0] - 1.3, bk[1] - 2]], '#3F7FB8', true); }, { name: 'angler' });
  IS.cat(T, 25.4, -10.6, 0, { c: 0, pose: 'sit' });
  IS.cat(T, -12.6, 18, YZ, { c: 4, pose: 'loaf', fl: -1 });
  IS.catWalk(T, [[-30, -26.4], [-14, -26.4]], { c: 3, speed: 0.9, sit: 7 });
  IS.walker(T, IS.who(1511, { teatray: true, top: '#F3F1EA', bot: '#6E5A44', scarf: undefined, dress: undefined }), [[-8, -26.6], [22, -26.6], [22, 20], [-8, 20]], 1.1, { phase: 0.3 });
  IS.walker(T, IS.who(1512, { tray: true, top: '#F3F1EA', bot: '#3B3F47', scarf: undefined, dress: undefined }), [[-34, -26.2], [-6, -26.2]], 1.0, { phase: 0.6 });
  IS.walker(T, IS.who(1513), [[-34, 34.6], [26, 34.6]], 1.2, { phase: 0.1 });
  T.cast([-20, -26.6], (g) => { IS.person(g, -20, -26.6, 0, IS.who(1521, { dir: 3, pose: 'hold', phone: true })); IS.person(g, -18.6, -26.9, 0, IS.who(1522, { dir: 3, pose: 'wave', ph: 0.3 })); }, { name: 'tourists' });
});
