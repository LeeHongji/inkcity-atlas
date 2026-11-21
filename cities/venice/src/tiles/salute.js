'use strict';
/* (100, 100) Dorsoduro's point: Santa Maria della Salute, the Punta della Dogana, the Zattere.
   - The Salute (Longhena, 1631): an octagon of white Istrian stone with a chapel on every side, a high drum ringed by
     sixteen great scrolls (the "ears"), the huge lead dome with its lantern and the Virgin on top; behind it a smaller
     dome between two slim bell towers. A triumphal-arch portal at the top of a wide flight of steps.
   - The Dogana da Mar at the point where the Grand Canal meets the Giudecca canal: a long low customs house, its
     little tower at the tip with two Atlases carrying a golden ball and Fortune turning on it with the wind.
   - The Zattere: the sunny promenade on the Giudecca canal, a floating café terrace, strollers, a painter at his
     easel, children feeding gulls.
   What moves: Fortune's weathervane, people climbing the steps, strollers, a painter's brush, gulls. */
SF.tile('salute', 100, 100, { rim: 40 }, function (T) {
  const P = VN.PLASTER, ST = { t: '#ECE8DF', l: '#F4F1EA', r: '#E0DBD0' };
  T.ground(function (g) {
    g.boilP = 0.15;
    K.slab(g, 37, { top: VN.paveC });
    VN.pave(g, -37, -37, 37, 37, { col: '#D4CFC4', step: 2.6, ax: 'y' });
    g.fill(K.rect(29, -37, 37, 37), '#E2DED4'); g.fill(K.rect(36.3, -37, 37, 37), VN.istria); g.fill(K.rect(-37, 36.3, 37, 37), VN.istria);
  }, { rim: true });
  VN.finish(T);
  const H = (d, nm) => T.obj([d.x0, d.y0, d.x1, d.y1], (g) => VN.house(g, d), { name: nm || 'house' });

  /* ---------- the Salute ---------- */
  const CX = -4, CY = -8, R0 = 10.5;
  // the back: the presbytery's smaller dome and the two bell towers (behind the octagon)
  T.obj([-15, -36, 7, -22], function (g) {
    g.boilP = 0.22;
    K.box(g, -12, -34, 4, -22, 0, 10, ST, { w: 0.8 });
    K.cyl(g, -4, -28, 4.2, 10, 13.2, ST, { w: 0.6, n: 16 });
    K.dome(g, -4, -28, 4.2, 13.2, 4.0, '#A9B2B5', { w: 0.6, shadow: '#919CA0' });
    K.cyl(g, -4, -28, 0.8, 17.2, 19, ST, { w: 0.45, n: 8 });
    for (const x of [-13, 3]) { K.box(g, x, -36, x + 2.2, -33.8, 0, 14, ST, { w: 0.7 }); K.box(g, x + 0.15, -35.85, x + 2.05, -33.95, 14, 15.8, ST, { w: 0.55 }); K.cone(g, x + 1.1, -34.9, 1.1, 15.8, 2.6, '#A9B2B5', {}); g.fill(VN.archPts('L', -33.78, x + 0.5, x + 1.7, 12.2, 13.6, 'round', 0), '#4A3E34'); }
  }, { name: 'salute presbytery', tall: true });
  T.obj([CX - R0 - 1, CY - R0 - 1, CX + R0 + 1, CY + R0 + 1], function (g) {
    g.boilP = 0.2;
    const oct = (r, z) => { const p = []; for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; p.push([CX + Math.cos(a) * r, CY + Math.sin(a) * r, z]); } return p; };
    // the octagon's faces we can see, with pilasters and a window each
    const lo = oct(R0, 0), hi = oct(R0, 11);
    const vis = []; for (let i = 0; i < 8; i++) { const a = lo[i], b = lo[(i + 1) % 8], nx = (a[1] - b[1]), ny = (b[0] - a[0]); if (nx + ny < 0) continue; vis.push(i); }
    for (let i = 0; i < 8; i++) { const a = lo[i], b = lo[(i + 1) % 8], nx = -(b[1] - a[1]), ny = (b[0] - a[0]); if (nx + ny > 0) continue; void nx; }
    for (const i of [0, 1, 2, 3, 4, 5, 6, 7]) {
      const a = lo[i], b = lo[(i + 1) % 8], mx = (a[0] + b[0]) / 2 - CX, my = (a[1] + b[1]) / 2 - CY; if (mx + my < -0.5) continue;
      const tone = mix(ST.l, ST.r, clamp(0.5 + 0.06 * (mx - my), 0, 1));
      g.fill([a, b, hi[(i + 1) % 8], hi[i]], tone);
      const q = (t, z) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), z];
      g.fill(VN.archPts('L', 0, 0.38, 0.62, 3, 8.6, 'round', 0).map((p) => q(p[0], p[2])), '#55606A');
      const ps = []; for (const t of [0.08, 0.92]) { const A = g.p.apply(g, q(t, 0)), B = g.p.apply(g, q(t, 10.4)); ps.push(A[0], A[1], B[0], B[1]); } g.segs2(ps, '#D6D0C4', 1.0);
      g.fill([q(0, 10.2), q(1, 10.2), q(1, 11), q(0, 11)], '#E6E1D6');
      g.line([a, b], { w: 0.8 }); g.line([hi[i], hi[(i + 1) % 8]], { w: 0.6 });
      // a statue on each corner of the octagon's cornice
      const s = g.p(hi[i][0], hi[i][1], 11); g.fill2([[s[0] - 0.5, s[1]], [s[0] + 0.5, s[1]], [s[0] + 0.4, s[1] - 2.4], [s[0] - 0.4, s[1] - 2.4]], '#F6F2EA', true); g.disc2([s[0], s[1] - 2.8], 0.45, '#F6F2EA');
    }
    g.fill(oct(R0, 11), '#C9C3B6');
    // the drum ringed by the great scrolls
    const rd = 7.2;
    K.cyl(g, CX, CY, rd, 11, 19.4, ST, { w: 0.85, n: 24 });
    for (let i = 0; i < 16; i++) { const a = TAU * i / 16; const mx = Math.cos(a), my = Math.sin(a); if (mx + my < -0.4) continue; const b = g.p(CX + mx * (rd + 2.6), CY + my * (rd + 2.6), 11.2), t = g.p(CX + mx * rd, CY + my * rd, 16.8); const sc = [[b[0], b[1]], [lerp(b[0], t[0], 0.3), b[1] - 1.0], [t[0], t[1] + 0.6], [t[0], t[1] - 0.6]]; g.line2(K.curve(sc, 4), { w: 1.3, c: '#E9E4D9', boil: false, ext: 0 }); g.disc2([b[0], b[1] - 0.4], 1.1, '#E6E1D6'); g.ring2([b[0], b[1] - 0.4], 1.1, { w: 0.35, c: '#A39A8A' }); g.line2(K.curve(sc, 4), { w: 0.35, c: '#A39A8A', boil: false, ext: 0 }); }
    for (let i = 0; i < 8; i++) { const a = TAU * (i + 0.5) / 8, mx = Math.cos(a), my = Math.sin(a); if (mx + my < 0) continue; g.fill(VN.archPts('L', 0, -0.6, 0.6, 14.4, 18.0, 'round', 0).map((p) => [CX + mx * (rd + 0.03) - my * p[0], CY + my * (rd + 0.03) + mx * p[0], p[2]]), '#55606A'); }
    K.dome(g, CX, CY, rd + 0.4, 19.4, 9.6, '#A9B2B5', { w: 0.9, shadow: '#8E999E', ribs: 8, ribCol: '#C9CFD1', ribW: 0.45 });
    K.cyl(g, CX, CY, 1.6, 28.8, 31.4, ST, { w: 0.55, n: 10 });
    K.dome(g, CX, CY, 1.8, 31.4, 1.6, '#A9B2B5', { w: 0.5 });
    const v = g.p(CX, CY, 33); g.fill2([[v[0] - 0.6, v[1]], [v[0] + 0.6, v[1]], [v[0] + 0.45, v[1] - 3.0], [v[0] - 0.45, v[1] - 3.0]], '#F6F2EA', true); g.disc2([v[0], v[1] - 3.4], 0.5, '#F6F2EA');
    // the portal: a triumphal arch on the side facing the steps (+y)
    const pa = CY + R0 * Math.cos(Math.PI / 8) + 0.02;
    g.fill(K.on('L', pa, CX - 3.2, CX + 3.2, 0, 13.2), '#F6F3EC');
    const pd = [[CX - 3.6, pa + 0.02, 13.2], [CX + 3.6, pa + 0.02, 13.2], [CX, pa + 0.02, 15.4]]; g.fill(pd, '#F6F3EC'); g.outline(pd, { w: 0.55, boil: false });
    g.fill(VN.archPts('L', pa + 0.03, CX - 1.6, CX + 1.6, 0, 8.4, 'round', 0), '#4A3A30');
    const cl = []; for (const a of [CX - 2.8, CX - 2.0, CX + 2.0, CX + 2.8]) { const A = g.p(a, pa + 0.04, 0.6), B = g.p(a, pa + 0.04, 11.8); cl.push(A[0], A[1], B[0], B[1]); } g.segs2(cl, '#DCD6CA', 0.9);
  }, { name: 'santa maria della salute', tall: true });
  // the wide flight of steps down to the campo
  T.obj([CX - 6, 1.8, CX + 6, 6.8], function (g) {
    for (let k = 0; k < 5; k++) { const y0 = 1.8 + k * 1.0, z = 2.0 - k * 0.4; K.box(g, CX - 6 + k * 0.3, y0, CX + 6 - k * 0.3, y0 + 1.0, 0, z, ST, { w: 0.45, nohid: true }); }
  }, { name: 'salute steps' });

  /* ---------- the Dogana and its tower ---------- */
  T.obj([12, -37, 31, -27], function (g) {
    g.boilP = 0.2;
    K.box(g, 12, -37, 31, -27, VN.WL, 6.6, { t: '#E2D9C8', l: '#EDE3D2', r: '#DACDB8' }, { w: 0.85 });
    for (let a = 13; a < 30; a += 3.0) g.fill(VN.archPts('L', -26.98, a, a + 2.0, 0, 4.6, 'round', 0), '#6E5E50');
    K.hip(g, 11.6, -37.4, 31.4, -26.6, 6.6, 2.2, VN.roof, { ridge: 10, c: '#7A3A28' });
  }, { name: 'dogana' });
  T.obj([31, -37, 37, -31], function (g) {
    g.boilP = 0.25;
    K.box(g, 31, -37, 37, -31, VN.WL, 9.4, { t: '#E9E3D6', l: '#F3EFE6', r: '#E2DCCF' }, { w: 0.85 });
    g.fill(K.on('R', 37.01, -36, -32, 3, 7.6), '#55606A'); g.fill(K.on('L', -30.99, 32, 36, 3, 7.6), '#55606A');
    K.box(g, 32, -36, 36, -32, 9.4, 11.0, { t: '#E9E3D6', l: '#F3EFE6', r: '#E2DCCF' }, { w: 0.6 });
    const c = g.p(34, -34, 11.0);
    for (const s of [-1, 1]) g.fill2([[c[0] + s * 1.8, c[1]], [c[0] + s * 2.6, c[1]], [c[0] + s * 2.2, c[1] - 3.6], [c[0] + s * 1.4, c[1] - 3.4]], '#C9A44A', true);
    g.disc2([c[0], c[1] - 5.6], 3.0, '#D9B24A'); g.ring2([c[0], c[1] - 5.6], 3.0, { w: 0.45, c: '#8A6A1E' }); g.fine2(arcPts(c[0], c[1] - 5.6, 3.0, Math.PI * 0.1, Math.PI * 0.9, 8).map((q) => [q[0], c[1] - 5.6 + (q[1] - c[1] + 5.6) * 0.3]), { w: 0.3, c: '#8A6A1E' });
  }, { name: 'punta della dogana', tall: true });
  // Fortune turning on the golden ball with the wind
  T.actor({ sample: 5, period: 24, grow: false,
    at(t) { const a = Math.round((0.6 + 0.9 * Math.sin(t * 0.26) + 0.3 * Math.sin(t * 0.71)) * 4) / 4; return { x: 34, y: -34, z: 11.0, key: a, a }; },
    draw(g, st) {
      const c = g.p(0, 0, 0), top = [c[0], c[1] - 8.8], dx = Math.cos(st.a) * 3.4, dy = Math.sin(st.a) * 0.9;
      g.fill2([[top[0] - 0.4, top[1] + 0.4], [top[0] + 0.4, top[1] + 0.4], [top[0] + 0.3, top[1] - 3.2], [top[0] - 0.3, top[1] - 3.2]], '#D9B24A', true); g.disc2([top[0], top[1] - 3.7], 0.5, '#D9B24A');
      g.fill2([[top[0], top[1] - 2.6], [top[0] + dx, top[1] - 2.8 + dy], [top[0] + dx * 0.9, top[1] - 0.6 + dy], [top[0], top[1] - 1.0]], '#E6C25A', true);
      g.line2([[top[0], top[1] - 2.6], [top[0] + dx, top[1] - 2.8 + dy], [top[0] + dx * 0.9, top[1] - 0.6 + dy]], { w: 0.35, c: '#8A6A1E', boil: false, ext: 0 });
    } });

  /* ---------- houses, the Zattere ---------- */
  H({ x0: -37, y0: 10, x1: -25, y1: 24, n: 3, col: P[1], chim: [[-31, 14]], shopR: [12, 20, '#3E5A44', 'OSTERIA'] });
  H({ x0: -37, y0: 26, x1: -24, y1: 37, n: 3, z0: VN.WL, col: P[0], chim: [[-31, 30]], altana: [-30, 31, { wash: ['#F3F1EA', '#5F8FC9', '#E6C24F'] }] });
  H({ x0: -37, y0: -36, x1: -24, y1: -20, n: 3, col: P[3], chim: [[-31, -30]] });
  // the floating café terrace on the Giudecca canal
  T.obj([37.2, 12, 40.6, 26], function (g) {
    K.box(g, 37.2, 12, 40.6, 26, VN.WL - 0.1, -0.2, { t: '#8E9690', l: '#B8875A', r: '#9C7450' }, { w: 0.6 });
    g.fill(K.rect(37.3, 12.1, 40.5, 25.9, -0.18), '#C49A68');
    for (const y of [14.6, 19, 23.4]) { VN.table(g, 39, y, -0.2, { cups: ['#5A3E2E', '#F3F1EA'] }); VN.person(g, 38.2, y - 0.8, 1.1, VN.who(1800 + y * 3, { dir: 0, pose: 'sit' })); VN.person(g, 39.8, y + 0.8, 1.1, VN.who(1810 + y * 3, { dir: 2, pose: 'sit' })); }
    const rl = []; for (let y = 12.2; y < 26; y += 0.8) { const a = g.p(40.6, y, -0.2), b = g.p(40.6, y, 1.0); rl.push(a[0], a[1], b[0], b[1]); } g.segs2(rl, '#6E5A44', 0.3); g.line([[40.6, 12, 1.0], [40.6, 26, 1.0]], { w: 0.45, boil: false, c: '#5E4A3C' });
  }, { name: 'zattere terrace' });
  for (const y of [-20, 4, 30]) T.obj([35.6, y], (g) => VN.lamp(g, 35.6, y, { h: 7 }), { name: 'lamp' });
  for (const [x, y] of [[24, 6], [-16, 30]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.6, h: 5.2, col: '#97A774' }), { name: 'tree' });
  // a painter at his easel facing the Salute
  T.actor({ sample: 5, period: 3,
    at(t) { const f = Math.floor(t * 2) % 3; return { x: 12, y: 22, key: f, f }; },
    draw(g, st) {
      const e = g.p(-1.6, -1.4, 0); g.line2([[e[0] - 1.2, e[1]], [e[0], e[1] - 7.4]], { w: 0.4, c: '#7A5A3C', boil: false, ext: 0 }); g.line2([[e[0] + 1.2, e[1]], [e[0], e[1] - 7.4]], { w: 0.4, c: '#7A5A3C', boil: false, ext: 0 });
      g.fill2([[e[0] - 2.2, e[1] - 6.6], [e[0] + 1.8, e[1] - 7.6], [e[0] + 1.8, e[1] - 3.2], [e[0] - 2.2, e[1] - 2.2]], '#F6F1E4', true); g.fill2([[e[0] - 1.6, e[1] - 4], [e[0] + 1.2, e[1] - 4.8], [e[0] + 0.4, e[1] - 6.4]], '#A9B2B5', true); g.fill2([[e[0] - 1.8, e[1] - 2.8], [e[0] + 1.6, e[1] - 3.6], [e[0] + 1.6, e[1] - 3.2], [e[0] - 1.8, e[1] - 2.4]], '#8DB2A2', true);
      VN.person(g, 0, 0, 0, VN.who(1820, { dir: 3, pose: 'hold', beret: true, fedora: '#7A2E35', hands: [[-4 + st.f, -9], [-2, -8]] }));
    } });
  const Wk = (seed, pts, v, ph, o) => VN.walker(T, seed > 0 ? VN.who(seed, o) : VN.carnival(-seed, (o && o.kind) || 'gown', o), pts, v, { phase: ph });
  Wk(1830, [[33, -24], [33, 34]], 1.3, 0); Wk(1831, [[31, 34], [31, -24]], 1.2, 0.4); Wk(-1832, [[34.5, -22], [34.5, 32]], 0.9, 0.7, { kind: 'gown' });
  Wk(1833, [[-4, 30], [-4, 8], [24, 8], [24, -20]], 1.3, 0.2); Wk(1834, [[-28, 2], [10, 2], [10, 26], [-20, 26]], 1.1, 0.5); Wk(-1835, [[6, 30], [6, 10], [-14, 10], [-14, 30]], 0.9, 0.3, { kind: 'bauta' });
  // people sitting on the Salute's steps
  T.cast([-4, 5], (g) => { VN.person(g, -8, 4.4, 1.2, VN.who(1840, { dir: 1, pose: 'sit' })); VN.person(g, -0.4, 5.2, 0.8, VN.who(1841, { dir: 1, pose: 'sit' })); VN.person(g, 0.8, 4.0, 1.2, VN.carnival(1842, 'cape', { dir: 1, pose: 'sit' })); }, { name: 'on the steps', on: true });
});
