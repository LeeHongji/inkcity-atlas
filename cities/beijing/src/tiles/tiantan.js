'use strict';
/* (100,100) The Temple of Heaven and its park, on a morning in October.
   What it is: the Hall of Prayer for Good Harvests, a round timber hall under three tiers of blue glazed roof with a
   gold finial, standing on a three-tier round terrace of white marble with balustrades and stairs on its south side.
   The pale stone way runs south from it. Round it the park: old cypresses with flat dark crowns on yellowing grass,
   paved plazas, a 天坛 signboard.
   Who: the square dancers (the second clever moment): two dozen dancers with red fans follow their leader to the
   music of a portable speaker, step side to side on the beat, and every eight seconds walk briskly into a new
   formation (rows, then two rings that turn opposite ways, then two lines facing each other). Also a ring of
   shuttlecock kickers, card players at stone tables under the cypresses, a man writing 福 on the paving in water with
   a giant brush, visitors on the stairs.
   What moves: the dance (24 s cycle, phased so a change of formation happens in its shot), the shuttlecock, notes
   rising from the speaker, walkers on the stone way. */
SF.tile('tiantan', 100, 100, { rim: 52 }, function (T) {
  const H = 37, PAVE = '#E3DED2', GR = '#C9CC8A', CX = -12, CY = -15;
  T.ground(function (g) {
    K.slab(g, H, { top: PAVE, cut: 'xy' });
    // autumn lawns under the cypresses
    for (const q of [K.rect(23, -35, 35, 35), K.rect(-35, -35, -29, 0), K.rect(-35, 10, -18, 35)]) { g.fill(q, GR); g.grass(q, { dens: 0.6 }); g.outline(q, { w: 0.5, c: '#9AA05E', boil: false }); }
    // the stone way south from the hall, and the dancers' plaza
    g.fill(K.rect(CX - 4.5, 1, CX + 4.5, H), '#EEEAE1'); g.fill(K.rect(CX - 1.2, 1, CX + 1.2, H), '#F5F2EB');
    g.line([[CX - 4.5, 1, 0], [CX - 4.5, H, 0]], { w: 0.4, c: '#B5AE9F', boil: false }); g.line([[CX + 4.5, 1, 0], [CX + 4.5, H, 0]], { w: 0.4, c: '#B5AE9F', boil: false });
    g.scuff(K.rect(-3, 2, 22, 31), { dir: -0.5, len: 3, c: '#EDE9E1', dens: 0.5, w: 0.45 });
    // 福 written in water on the stone way (dark, wet)
    BJ.hanziP(g, (a, z) => [a, 31.5 - z, 0.02], CX - 3.4, 0, 5.2, '福', '#A49F95', { w: 1.1 });
  }, { rim: true });
  BJ.sidewalk(T, ['n', 'w'], { sp: 12, off: { n: 2, w: 4 }, bikes: [['n', 14, 5], ['w', 18, 4]] });

  /* ---------------- the Hall of Prayer for Good Harvests ---------------- */
  T.obj([CX - 15.5, CY - 15.5, CX + 15.5, CY + 15.5], function (g) {
    g.boilP = 0.25; const i0 = g.cmds.length;
    const tiers = [[15, 0, 1.5], [12.6, 1.5, 3.0], [10.2, 3.0, 4.5]];
    for (const [r, z0, z1] of tiers) {
      K.cyl(g, CX, CY, r, z0, z1, { t: BC.marbleS, l: BC.marble, r: BC.marbleD }, { w: 0.8, n: 28 });
      BJ.roundRail(g, CX, CY, r - 0.3, z1, { gap: 0.18 });
      BJ.stairs(g, 'L', CY + r - 0.2, CX, 3.2, z0, z1);
    }
    BJ.roundBody(g, CX, CY, 7.0, 4.5, 11.6, { n: 12 });
    let z = BJ.roundRoof(g, CX, CY, 9.2, 11.6, 5.0, { top: 0.42, col: '#3F64A8' });
    BJ.roundBody(g, CX, CY, 5.8, z, z + 3.0, { doors: false, n: 10 });
    z = BJ.roundRoof(g, CX, CY, 7.5, z + 3.0, 4.4, { top: 0.42, col: '#3F64A8' });
    BJ.roundBody(g, CX, CY, 4.6, z, z + 2.6, { doors: false, n: 8 });
    z = BJ.roundRoof(g, CX, CY, 6.2, z + 2.6, 6.0, { col: '#3F64A8' });
    const f = g.p(CX, CY, z); g.fill2([[f[0] - 1.0, f[1] + 0.4], [f[0] + 1.0, f[1] + 0.4], [f[0] + 0.5, f[1] - 2.4], [f[0] - 0.5, f[1] - 2.4]], BC.gold); g.disc2([f[0], f[1] - 3.2], 1.2, BC.gold); g.ring2([f[0], f[1] - 3.2], 1.2, { w: 0.35, c: '#7A5A20' });
    // at night the Hall of Prayer is floodlit: the three blue roofs glow over the red drum, the white terraces lit,
    // the gold finial shining
    BN.flood(g, i0, 0.84, BN.WHITE, { lines: 0.25 });
    for (const [dx, dy, zz, r] of [[7.6, 7.6, 2.4, 3.0], [0, 10.6, 2.4, 2.6], [10.6, 0, 2.4, 2.6], [5.4, 5.4, 6.5, 2.4]]) g.glow('lantern', CX + dx, CY + dy, zz, { r, col: '#FFE2B8' });
    g.glow2('lantern', [f[0], f[1] - 3.2], [f[0], f[1] - 3.2], { r: 1.2, col: '#FFD870' });
  }, { name: 'hall of prayer' });
  // the signboard by the way
  T.obj([-29.5, 4.4, -20.5, 5.4], function (g) {
    for (const x of [-28.6, -21.4]) { const a = g.p(x, 5, 0), b = g.p(x, 5, 6.4); g.fill2([[a[0] - 0.4, a[1]], [a[0] + 0.4, a[1]], [b[0] + 0.4, b[1]], [b[0] - 0.4, b[1]]], '#6E3A2C'); }
    BJ.sign(g, 'L', 5.2, -29, -21, 2.8, 6.0, '#9E2E24', '天坛', { ink: '#F2C94C', c: '#5E1E16' });
    BJ.roof(g, -29.6, 4.4, -20.4, 5.8, 6.2, 1.2, { type: 'gable', col: '#3F64A8', over: 0.5, lift: 0.3, tiles: false, curl: 0.4, rw: 1.0, gcol: '#9E2E24' });
  }, { name: 'sign' });

  /* ---------------- cypresses ---------------- */
  [[26, -30], [32, -22], [26, -19], [33.5, -1], [25.5, 16], [33, 21], [27, 30], [33, 33], [-33, -30], [-31, -8], [-22, 31], [-33, 27], [6, -33], [-2, -30]].forEach(([x, y], i) =>
    T.obj([x, y], (g) => BJ.pine(g, x, y, { r: 3.0 + (i % 3) * 0.4, h: 4.4 + (i % 2) * 1.2, seed: 60 + i, col: i % 4 === 1 ? '#5A7A52' : BC.pine }), { name: 'cypress' }));

  /* ---------------- card players under the cypresses ---------------- */
  [[29, -9, 600], [29, 7, 610]].forEach(([x, y, s]) => T.cast([x, y], (g) => {
    const seat = (dx, dy, d, w) => { K.box(g, x + dx - 0.5, y + dy - 0.5, x + dx + 0.5, y + dy + 0.5, 0, 1.2, '#C9C3B5', { w: 0.3, boil: false }); BJ.person(g, x + dx, y + dy, 1.2, Object.assign(w, { dir: d, pose: 'sit' })); };
    seat(-1.6, -1.6, 0, BJ.who(s, { old: true })); seat(1.6, -1.6, 1, BJ.who(s + 1, { old: true }));
    K.cyl(g, x, y, 1.4, 0, 2.3, { t: '#D9D5CB', l: '#C9C5BA', r: '#B5B1A6' }, { w: 0.5, n: 10 });
    const tp = g.p(x, y, 2.32); for (let k = 0; k < 6; k++) g.fill2([[tp[0] - 2 + k * 0.7, tp[1] - 0.6], [tp[0] - 1.4 + k * 0.7, tp[1] - 0.8], [tp[0] - 1.2 + k * 0.7, tp[1] + 0.2], [tp[0] - 1.8 + k * 0.7, tp[1] + 0.4]], k % 3 ? '#F7F5EF' : '#C9382E', true);
    seat(-1.6, 1.6, 3, BJ.who(s + 2, { old: true })); seat(1.6, 1.6, 2, BJ.who(s + 3, { old: true, cap: '#5A5A55' }));
    BJ.person(g, x - 3.4, y + 2.6, 0, BJ.who(s + 4, { old: true, dir: 0, pose: 'stand' }));
  }, { on: false }));

  /* ---------------- the man writing in water ---------------- */
  T.cast([CX + 2.6, 32.4], (g) => {
    const r = BJ.person(g, CX + 2.6, 32.4, 0, BJ.who(620, { old: true, dir: 2, pose: 'stand', top: '#F3F1EA', hands: [[-3.4, -10.6], [-2.6, -12.6]] }));
    const hd = r.hands[0], tip = g.p(CX + 0.4, 32.2, 0.1); g.segs2([hd[0] + 0.6, hd[1] - 2.2, tip[0], tip[1] - 0.6], '#8A6A3E', 0.4); g.fill2([[tip[0] - 0.8, tip[1]], [tip[0] + 0.6, tip[1] - 0.3], [tip[0] + 0.2, tip[1] - 1.4], [tip[0] - 0.6, tip[1] - 1.2]], '#E9E2D0', true);
    const b = g.p(CX + 4, 33.6, 0); g.fill2(arcPts(b[0], b[1] - 1.2, 1.4, 0, TAU, 10).map((q) => [q[0], b[1] - 1.2 + (q[1] - b[1] + 1.2) * 0.8]), '#5E8FC9', true);
    BJ.person(g, CX - 6.4, 30.4, 0, BJ.who(621, { dir: 0, pose: 'hold', phone: true, reach: [0.4, -8.6] }));
  }, { on: false });

  /* ---------------- shuttlecock kickers ---------------- */
  const SC = [-25, 20], SRING = [[0, -2.6], [2.6, 0], [0, 2.6], [-2.6, 0]], SK = 0.9;
  SRING.forEach(([dx, dy], i) => {
    const look = BJ.who(630 + i, { old: i % 2 === 0 }), dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 2 : 0) : (dy > 0 ? 3 : 1);
    T.actor({ sample: 5, period: 4 * SK, at(t) { const k = Math.floor(t / SK) % 4, kick = k === i && (t % SK) < 0.35; return { x: SC[0] + dx, y: SC[1] + dy, key: kick ? 'k' : 's', kick }; },
      draw(g, st) { BJ.person(g, 0, 0, 0, Object.assign({}, look, { dir, pose: st.kick ? 'walk' : 'stand', ph: 0.25 })); } });
  });
  T.actor({ sample: 5, period: 4 * SK, grow: false, bias: 2,
    at(t) { const k = Math.floor(t / SK) % 4, u = (t % SK) / SK, a = SRING[k], b = SRING[(k + 1) % 4]; return { x: SC[0] + lerp(a[0], b[0], u) * 0.8, y: SC[1] + lerp(a[1], b[1], u) * 0.8, z: 1.2 + 6 * u * (1 - u) * 4 * 0.6, key: 'c' + Math.floor(u * 6), u }; },
    draw(g) { const o = g.p(0, 0, 0); g.disc2(o, 0.5, '#D23A2E'); g.segs2([o[0] - 0.6, o[1] - 0.4, o[0] - 1.0, o[1] - 2.2, o[0], o[1] - 0.5, o[0], o[1] - 2.4, o[0] + 0.6, o[1] - 0.4, o[0] + 1.0, o[1] - 2.2], '#F2C230', 0.45); } });

  /* ---------------- the square dancers ---------------- */
  const DC = 24, sh = SCENE.shots.find((s) => s.name === 'tiantan'), DOFF = sh ? ((4.0 - sh.a / 30) % DC + DC) % DC : 0;
  const N = 24, GRID = [], RING = [], LINE = [], LX = [7, 19], ctr = [13, 18.5];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) GRID.push([5.2 + c * 3.2, 13.4 + r * 3.0, r, c]);
  // rings: the grid's perimeter goes to the outer ring (by angle), the interior to the inner ring
  const per = [], inn = [];
  GRID.forEach((p, i) => ((p[2] === 0 || p[2] === 3 || p[3] === 0 || p[3] === 5) ? per : inn).push(i));
  const ang = (i) => Math.atan2(GRID[i][1] - ctr[1], GRID[i][0] - ctr[0]);
  per.sort((a, b) => ang(a) - ang(b)); inn.sort((a, b) => ang(a) - ang(b));
  per.forEach((i, k) => { RING[i] = { r: 7.6, a0: -Math.PI + TAU * (k + 0.5) / per.length, s: 1 }; });
  inn.forEach((i, k) => { RING[i] = { r: 3.7, a0: -Math.PI + TAU * (k + 0.5) / inn.length, s: -1 }; });
  // lines: the west half of the grid to the west line, the east half to the east line, row by row
  const west = GRID.map((p, i) => i).filter((i) => GRID[i][3] < 3).sort((a, b) => GRID[a][1] - GRID[b][1] || GRID[a][0] - GRID[b][0]);
  const east = GRID.map((p, i) => i).filter((i) => GRID[i][3] >= 3).sort((a, b) => GRID[a][1] - GRID[b][1] || GRID[b][0] - GRID[a][0]);
  west.forEach((i, k) => { LINE[i] = [LX[0], 9.4 + k * 1.7, 0]; }); east.forEach((i, k) => { LINE[i] = [LX[1], 9.4 + k * 1.7, 2]; });
  const HOLD = 5.5, TR = 2.5, BEAT = 0.5;
  const ARMS = [['cheer', 0.2], ['stand', 0], ['cheer', 0.7], ['stand', 0], ['wave', 0.25], ['wave', 0.65], ['hold', 0], ['stand', 0]];
  const dirOf = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3);
  const slotAt = (i, f, tt) => {   // formation f at dance time tt: position and facing
    if (f === 0) { const g0 = GRID[i]; return [g0[0], g0[1], 1]; }
    if (f === 1) { const R0 = RING[i], a = R0.a0 + R0.s * 0.12 * tt; const x = ctr[0] + Math.cos(a) * R0.r, y = ctr[1] + Math.sin(a) * R0.r * 0.85; return [x, y, dirOf(-Math.sin(a) * R0.s, Math.cos(a) * R0.s)]; }
    const L = LINE[i]; return [L[0], L[1], L[2]];
  };
  const LOOK = []; for (let k = 0; k < 6; k++) LOOK.push(BJ.who(640 + k, { old: true, hairStyle: k % 2 ? 'curly' : 'bob', hair: k % 3 ? '#2B2420' : '#5A3A24', top: ['#D23A2E', '#E7A9A0', '#C9382E', '#F3F1EA', '#D98AA4', '#E85A3A'][k], bot: k % 2 ? '#2F343B' : '#3B3F47', dress: undefined, fan: '#D8322A', cap: undefined }));
  for (let i = 0; i < N; i++) {
    const look = LOOK[i % 6];
    T.actor({ sample: 0.3, period: DC,
      at(t) {
        const u = ((t + DOFF) % DC + DC) % DC, f = Math.floor(u / (HOLD + TR)), w = u - f * (HOLD + TR);
        const beat = Math.floor(u / BEAT) % 8;
        if (w < HOLD) {
          const [x, y, d] = slotAt(i, f, u);
          if (f === 1) { const ph = Math.floor((u * 1.6) % 1 * 8); return { x, y, key: 'r' + d + '.' + ph, dir: d, pose: 'walk', ph: ph / 8 }; }
          const step = [0, 0.5, 0, -0.5][beat % 4], dx = f === 0 ? step : 0, dy = f === 2 ? step * (d === 0 ? 1 : -1) : 0, a = ARMS[beat];
          return { x: x + dx, y: y + dy, key: 'd' + d + a[0] + a[1], dir: d, pose: a[0], ph: a[1] };
        }
        const A = slotAt(i, f, f * (HOLD + TR) + HOLD), B = slotAt(i, (f + 1) % 3, (f + 1) * (HOLD + TR)), s = (w - HOLD) / TR, e = s * s * (3 - 2 * s);
        const d = dirOf(B[0] - A[0], B[1] - A[1]), ph = Math.floor((u * 2.2) % 1 * 8);
        return { x: lerp(A[0], B[0], e), y: lerp(A[1], B[1], e), key: 'w' + d + '.' + ph, dir: d, pose: 'walk', ph: ph / 8 };
      },
      draw(g, st) { BJ.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.pose, ph: st.ph || 0, fanA: st.pose === 'cheer' ? -2.0 : st.pose === 'wave' ? -1.2 : -2.6 })); } });
  }
  // the leader, facing the troupe, and the speaker on its little cart
  const lead = BJ.who(650, { old: true, top: '#F2C230', bot: '#2F343B', hairStyle: 'bob', fan: '#D8322A' });
  T.actor({ sample: 5, period: DC,
    at(t) { const u = ((t + DOFF) % DC + DC) % DC, beat = Math.floor(u / BEAT) % 8, a = ARMS[beat]; return { x: 12.6, y: 30.8, key: 'L' + a[0] + a[1], pose: a[0], ph: a[1] }; },
    draw(g, st) { BJ.person(g, 0, 0, 0, Object.assign({}, lead, { dir: 3, pose: st.pose, ph: st.ph })); } });
  T.cast([17.6, 31.4], (g) => {
    K.box(g, 16.6, 30.6, 18.6, 32.2, 0.6, 1.0, '#5A5E66', { w: 0.4, boil: false });
    K.box(g, 16.9, 30.8, 18.3, 32.0, 1.0, 3.6, { t: '#3A3E46', l: '#4A4E56', r: '#2E3238' }, { w: 0.5 });
    for (const z of [1.8, 2.9]) { const c = g.p(18.3, 31.4, z); g.disc2([c[0], c[1]], 1.3, '#2A2622'); g.disc2([c[0], c[1]], 0.6, '#6A6E75'); g.mark({ nc: z < 2 ? '#7FE0FF' : '#FF7FD0' }); g.glow2('lantern', c, g.p(18.3, 31.4, 0), { r: 0.9, col: z < 2 ? '#7FE0FF' : '#FF7FD0' }); }   // (night: the speaker's LED rings)
    for (const dx of [-0.6, 0.6]) { const w = g.p(17.6 + dx, 32.2, 0.5); g.ring2(w, 1.6, { w: 0.4, c: '#2A2622' }); }
  }, { on: false });
  T.actor({ layer: 'top', sample: 5, period: 3, grow: false,
    at(t) { const u = (t % 3) / 3; return { x: 17.6, y: 31.4, z: 4 + u * 6, key: 'n' + Math.floor(u * 12), u }; },
    draw(g, st) { const o = g.p(0, 0, 0); BJ.note2(g, [o[0] + 2 + Math.sin(st.u * 6) * 1.5, o[1]], 1.1, '#3A3530'); BJ.note2(g, [o[0] - 1.5 + Math.cos(st.u * 5) * 1.2, o[1] + 9], 0.9, '#3A3530'); } });

  /* ---------------- visitors ---------------- */
  K.walker(T, BJ.tourist(660, '#2E8F5A'), [[CX - 3, 36], [CX - 3, 3.4]], 1.2, { phase: 0.1 });
  K.walker(T, BJ.tourist(661, '#2E8F5A'), [[CX - 3, 36], [CX - 3, 3.4]], 1.2, { phase: 0.15 });
  K.walker(T, BJ.who(662), [[CX + 3, 3.4], [CX + 3, 36]], 1.1, { phase: 0.5 });
  K.walker(T, BJ.who(663, { old: true }), [[20, -32], [20, -2], [21.6, -2], [21.6, -32]], 0.7, { phase: 0.3 });
  T.cast([CX - 2.4, 0.2], (g) => { BJ.person(g, CX - 2.6, 1.6, 0, BJ.tourist(664, '#2E8F5A', { dir: 3, pose: 'hold', phone: true, reach: [0.4, -9] })); BJ.person(g, CX + 2.6, 1.8, 0, BJ.tourist(665, '#2E8F5A', { dir: 3 })); }, { on: false });
  T.cast([CX - 5, CY + 8.6], (g) => { BJ.person(g, CX - 5, CY + 8.4, 4.5, BJ.who(666, { dir: 1 })); BJ.person(g, CX + 5.4, CY + 7.8, 4.5, BJ.who(667, { dir: 0, pose: 'hold', phone: true, reach: [0.4, -8.6] })); }, { on: true });
});
