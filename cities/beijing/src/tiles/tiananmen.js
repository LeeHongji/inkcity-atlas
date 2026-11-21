'use strict';
/* (0,100) Tiananmen Square, the south end of the axis on this map.
   What it is: a vast plain of pale granite slabs. At its north end, by Chang'an Avenue, the flagpole on a white
   marble platform with its balustrade; on the axis south of it the giant National Day flower basket (October), then
   the Monument to the People's Heroes, an obelisk on a two-tier terrace. Along the west side the Great Hall of the
   People's long cream colonnade; tall lamp posts with clusters of white globes; a subway entrance in the north-east
   corner (地铁 天安门, 出口).
   Who: the honour guard (the clever moment: they march out of the gate across the held avenue, raise the flag, stand
   by it, and at the end of the day lower it and march back); the crowd that gathers round the platform for the
   raising, phones up, children waving little flags, and wanders the square in between; swallow kites flown by old
   men at the south end; a tour group behind a flag; a photographer; a street sweeper.
   What moves: the guard and the flag (a 120 s cycle, phased so the crossing fills its shot and the raising its
   close-up), the crowd timetable, kites bobbing on their strings, tourists on loops. */
SF.tile('tiananmen', 0, 100, { rim: 40 }, function (T) {
  const H = 37, STONE = '#E5E0D6', F = BJF, OY = 100;   // OY: global y of the tile centre
  T.ground(function (g) {
    K.slab(g, H, { top: STONE, cut: 'y' });
    // granite slabs: a grid of joints
    const segs = [];
    for (let a = -H + 4; a < H; a += 4) { const p0 = g.p(a, -H, 0), p1 = g.p(a, H, 0), q0 = g.p(-H, a, 0), q1 = g.p(H, a, 0); segs.push(p0[0], p0[1], p1[0], p1[1], q0[0], q0[1], q1[0], q1[1]); }
    g.segs2(segs, '#D3CDC0', 0.3);
    g.scuff(K.rect(-H, -H, H, H), { dir: -0.5, len: 4, c: '#EEEAE2', dens: 0.35, w: 0.45, spread: 0.1 });
    // the axis: a band of paler stone from the flag to the monument
    g.fill(K.rect(-2.6, -37, 2.6, 18), '#ECE7DD');
  }, { rim: true });

  /* ---------------- the flagpole on its platform ---------------- */
  T.obj([-4, -18, 4, -10], function (g) {
    BJ.terrace(g, -4, -18, 4, -10, 0, 0.9, { steps: '', rail: false });
    BJ.rail(g, -4, -18, 4, -10, 0.9, { h: 0.9, back: true, gapL: null });
    K.cyl(g, 0, -14, 1.2, 0.9, 1.6, K.STONE, { w: 0.6, n: 10 });
    const b = g.p(0, -14, 1.6), t = g.p(0, -14, 30);
    g.fill2([[b[0] - 0.55, b[1]], [b[0] + 0.55, b[1]], [t[0] + 0.3, t[1]], [t[0] - 0.3, t[1]]], '#EDEBE5');
    g.fill2([[b[0] + 0.1, b[1]], [b[0] + 0.55, b[1]], [t[0] + 0.3, t[1]], [t[0] + 0.05, t[1]]], '#CFCBC1');
    g.line2([[b[0] - 0.55, b[1]], [t[0] - 0.3, t[1]]], { w: 0.5, boil: false }); g.line2([[b[0] + 0.55, b[1]], [t[0] + 0.3, t[1]]], { w: 0.5, boil: false });
    g.disc2([t[0], t[1] - 0.6], 0.8, BC.gold);
  }, { name: 'flagpole' });
  // the flag on its rope: up and down with the ceremony
  T.actor({ layer: 'top', sample: 5, period: F.CYC, grow: false,
    at(t) { const tc = F.cyc(t), h = F.flagH(tc); if (h <= 0.001) return null; const z = 5 + 22.6 * h, w = Math.floor(t * 5) % 8; return { x: 0, y: -14, z, key: 'f' + w, w }; },
    draw(g, st) { const a = g.p(0, 0, 0); BJ.flag2(g, [a[0] + 0.4, a[1]], 15, 10, st.w * TAU / 8); } });

  /* ---------------- the flower basket ---------------- */
  T.obj([-6, 0, 6, 12], function (g) {
    const c = [0, 6];
    K.cyl(g, c[0], c[1], 5.6, 0, 1.2, { t: '#E7DCC2', l: '#D9C9A2', r: '#C4B38A' }, { w: 0.6, n: 20 });
    K.cyl(g, c[0], c[1], 4.6, 1.2, 4.6, { t: '#E2B13A', l: '#D9A63A', r: '#B98A2A' }, { w: 0.8, n: 20 });
    // the woven basket: diagonal strands
    const sg = []; for (let i = 0; i < 18; i++) { const a = A_L + (A_R - A_L) * i / 17, p = g.p(c[0] + Math.cos(a) * 4.62, c[1] + Math.sin(a) * 4.62, 1.3), q = g.p(c[0] + Math.cos(a + 0.25) * 4.62, c[1] + Math.sin(a + 0.25) * 4.62, 4.5); sg.push(p[0], p[1], q[0], q[1]); } g.segs2(sg, '#9C7420', 0.35);
    // the mound of flowers, fruit and ribbons
    const top = g.p(c[0], c[1], 4.6), R = RNG(77);
    const mound = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + Math.PI * i / 16, r = 16 + (i % 2) * 1.4; mound.push([top[0] + Math.cos(a) * r, top[1] - 2 + Math.sin(a) * r * 1.35]); }
    mound.push([top[0] + 16, top[1] + 2], [top[0] - 16, top[1] + 2]);
    g.fill2(mound, '#5E9F5A'); g.outline2(mound.slice(0, 17), { w: 0.6, c: '#3E6E3A' });
    const cols = ['#E2483D', '#F2C230', '#F07FA0', '#F39A3A', '#FBF4EA', '#C9384E', '#F5D76E'];
    for (let i = 0; i < 70; i++) { const a = Math.PI + R() * Math.PI, d = Math.sqrt(R()) * 15, p = [top[0] + Math.cos(a) * d, top[1] - 2 + Math.sin(a) * d * 1.3]; g.disc2(p, 1.1 + R() * 0.8, R.pick(cols)); }
    // ribbons and the knot on top, a pair of big peaches
    g.fill2([[top[0] - 1.4, top[1] - 24], [top[0] + 1.4, top[1] - 24], [top[0] + 5, top[1] - 30], [top[0] + 2, top[1] - 22], [top[0] - 2, top[1] - 22], [top[0] - 5, top[1] - 30]], '#D8322A', true);
    for (const s of [-1, 1]) { g.disc2([top[0] + s * 8, top[1] - 6], 3.2, '#F7A6A0'); g.disc2([top[0] + s * 8 - 0.8, top[1] - 6.8], 1.2, '#FBD3C8'); }
    g.segs2([top[0] - 1, top[1] - 22, top[0] - 4, top[1] - 4, top[0] + 1, top[1] - 22, top[0] + 4, top[1] - 4], '#D8322A', 0.7);
  }, { name: 'flower basket' });

  /* ---------------- the Monument to the People's Heroes ---------------- */
  T.obj([-8, 19, 8, 35], function (g) {
    g.boilP = 0.3;
    BJ.terrace(g, -8, 19, 8, 35, 0, 1.4, { sw: 4, steps: 'LR' });
    BJ.terrace(g, -5.5, 21.5, 5.5, 32.5, 1.4, 2.8, { sw: 3, steps: 'L' });
    K.box(g, -2.4, 24.6, 2.4, 29.4, 2.8, 5.2, { t: '#E9E5DC', l: '#EFEBE3', r: '#D9D4C8' }, { w: 0.7 });
    // the relief band on the pedestal, then the shaft and its little roof
    g.fill(K.on('L', 29.42, -2.2, 2.2, 3.4, 4.6), '#CFC8B8'); g.fill(K.on('R', 2.42, 24.8, 29.2, 3.4, 4.6), '#C1BAAA');
    K.box(g, -1.3, 25.7, 1.3, 28.3, 5.2, 21, { t: '#EDE9E0', l: '#F3F0E9', r: '#DCD7CB' }, { w: 0.85 });
    g.fill(K.on('L', 28.32, -0.6, 0.6, 9, 18.6), '#D9C9A0');
    BJ.roof(g, -1.3, 25.7, 1.3, 28.3, 21, 1.4, { type: 'hip', col: '#D9D4C8', over: 0.4, lift: 0.1, tiles: false, curl: 0, rw: 0.9 });
  }, { name: 'monument' });

  /* ---------------- the Great Hall of the People (west side) ---------------- */
  T.obj([-37, -26, -28, 26], function (g) {
    g.boilP = 0.25;
    K.box(g, -37, -26, -28, 26, 0, 1.6, { t: '#D9D1C0', l: '#E3DCCB', r: '#CFC7B5' }, { w: 0.7 });
    K.box(g, -36.5, -25.5, -30, 25.5, 1.6, 13, { t: '#E9E2D2', l: '#F2ECDF', r: '#DDD5C4' }, { w: 0.9 });
    // the colonnade on the front (R face): tall columns before a dark recess
    g.fill(K.on('R', -29.97, -14, 14, 1.6, 11), '#9A9080');
    const cs = []; for (let y = -13.6; y <= 13.7; y += 2.25) { const a = g.p(-29.4, y, 1.6), b = g.p(-29.4, y, 11); cs.push(a); void b; }
    for (const a of cs) { const b = [a[0], a[1] - 9.4 * VZ]; g.fill2([[a[0] - 0.9, a[1]], [a[0] + 0.9, a[1]], [b[0] + 0.9, b[1]], [b[0] - 0.9, b[1]]], '#F4EFE4', true); g.line2([[a[0] + 0.9, a[1]], [b[0] + 0.9, b[1]]], { w: 0.4, c: '#9A9080', boil: false }); }
    K.box(g, -36.5, -15, -29.2, 15, 11, 12.2, { t: '#E9E2D2', l: '#F2ECDF', r: '#E4DCCB' }, { w: 0.7 });
    // windows in rows on the side wings
    for (const [a0, a1] of [[-25, -16], [16, 25]]) for (const z of [3, 6.5, 9.5]) for (let a = a0; a < a1 - 1; a += 2.2) K.win(g, 'R', -30, a, a + 1.2, z, z + 2, { style: 'navy' });
    // a band of green-and-yellow glazed tile round the roof edge
    for (const [f, p, a0, a1] of [['R', -30, -25.5, 25.5], ['L', 25.5, -36.5, -30]]) { g.fill(K.on(f, p + 0.03, a0, a1, 12.2, 13), '#D9B24A'); g.fill(K.on(f, p + 0.03, a0, a1, 12.6, 13), '#5E9A6E'); }
    const fl = g.p(-33, 0, 13); g.segs2([fl[0], fl[1], fl[0], fl[1] - 14], '#6E5A44', 0.4); BJ.flag2(g, [fl[0], fl[1] - 14], 9, 6, 0.6);
  }, { name: 'great hall' });

  /* ---------------- the subway entrance ---------------- */
  T.obj([22, -33, 32, -25], function (g) {
    K.box(g, 22, -33, 32, -25, 0, 4.6, { t: '#CFD8DE', l: '#DCE6EC', r: '#BFCBD3' }, { w: 0.8 });
    g.fill(K.on('L', -24.97, 23, 31, 0, 3.6), '#3F4A55'); K.win(g, 'R', 32, -32, -26, 0.6, 3.6, { style: 'glass' });
    BJ.sign(g, 'L', -25, 23.2, 30.8, 3.7, 4.55, '#2E5E9E', '地铁天安门');
    K.box(g, 21.6, -33.4, 32.4, -24.6, 4.6, 5.2, { t: '#9AA7B0', l: '#AAB6BE', r: '#8E9AA3' }, { w: 0.6 });
    BJ.sign(g, 'R', 32, -31.6, -28.4, 2.2, 3.4, '#2F8F5A', '出口');
  }, { name: 'subway' });

  /* ---------------- lamp posts (clusters of white globes) ---------------- */
  for (const [x, y] of [[-20, -30], [20, -20], [-20, -4], [20, 10], [-20, 22], [24, 30]]) T.obj([x, y], (g) => K.lamp(g, x, y, { h: 11, n: 4, col: '#E9E6DE' }), { name: 'lamp' });

  /* ---------------- the honour guard ---------------- */
  // 1 row of the bearer and two escorts, then eight rows of three; tile-local y = global y - OY
  const tailOf = (r) => r * F.RS;
  for (let r = 0; r < F.ROWS; r++) for (let c = -1; c <= 1; c++) {
    const look = BJ.guard(200 + r * 3 + c), bearer = r === 0 && c === 0, x = c * 2.0;
    T.actor({ sample: 0.25, period: F.CYC, cast: false, grow: false,
      at(t) {
        const tc = F.cyc(t), o = tailOf(r);
        let y, dir = 1, walk = false;
        const tOut1 = F.OUT + (F.YH - F.Y0) / F.VW;
        if (tc >= F.OUT && tc < tOut1) { y = Math.min(F.YH, F.Y0 + F.VW * (tc - F.OUT)) - o; walk = true; }
        else if (tc >= tOut1 && tc < F.BACK) y = F.YH - o;
        else if (tc >= F.BACK) { y = F.YH - o - F.VW * (tc - F.BACK); walk = true; dir = 3; }
        else return null;
        if (y < F.Y0 - 0.4) return null;
        const alpha = clamp((y - F.Y0 + 0.4) / 1.4, 0, 1), d = walk ? (dir === 1 ? y - F.Y0 : F.YH - y) : 0, ph = Math.floor((d / 2.6) % 1 * 8);
        const flagged = bearer && (tc < F.RAISE[0] || tc > F.LOWER[1]);
        return { x, y: y - OY, key: (walk ? 'w' + dir + '.' + ph : 's') + (flagged ? 'f' : ''), dir, walk, ph: ph / 8, flagged, alpha: alpha < 1 ? alpha : null };
      },
      draw(g, st) {
        const r2 = BJ.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.walk ? 'walk' : 'stand', ph: st.ph || 0, rifle: !bearer }));
        if (st.flagged) { const sh = r2.shoulders[0]; g.fill2([[sh[0] - 2.2, sh[1] - 0.6], [sh[0] + 1.4, sh[1] - 1.6], [sh[0] + 2.0, sh[1] + 0.6], [sh[0] - 1.6, sh[1] + 1.6]], '#D8322A', true); }
      } });
  }

  /* ---------------- the crowd: gathers for the raising and the lowering, wanders the square in between ---------------- */
  const WATCH = [], R0 = RNG(31);
  for (let i = 0; i < 12; i++) WATCH.push([-7.0 - (i % 3) * 1.7 - R0() * 0.3, -17 + Math.floor(i / 3) * 2.2 + R0() * 0.4]);           // west of the platform
  for (let i = 0; i < 12; i++) WATCH.push([7.0 + (i % 3) * 1.7 + R0() * 0.3, -17 + Math.floor(i / 3) * 2.2 + R0() * 0.4]);             // east
  for (let i = 0; i < 12; i++) WATCH.push([-5.2 + (i % 6) * 2.1 + R0() * 0.3, -8.0 + Math.floor(i / 6) * 1.9 + R0() * 0.3]);          // south
  const NC = WATCH.length, WANDER = [];
  for (let i = 0; i < NC; i++) {
    const W = WATCH[i], R = RNG(i * 13 + 7), side = W[0] < -6 ? -1 : W[0] > 6 ? 1 : (i % 2 ? 1 : -1);
    const spot = () => [clamp(W[0] + side * (5 + R() * 7), -26, 26), clamp(W[1] + (R() - 0.3) * 12, -24, -1)];
    WANDER.push([spot(), spot()]);
  }
  const LOOKS = []; for (let i = 0; i < 18; i++) LOOKS.push(i % 6 === 2 ? BJ.kid(400 + i, { flag: true }) : i % 7 === 3 ? BJ.tourist(400 + i, '#F2C230') : BJ.who(400 + i, i % 4 === 1 ? { flag: true } : {}));
  const dirOf = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3);
  for (let i = 0; i < NC; i++) {
    const look = LOOKS[i % LOOKS.length], R = RNG(i * 71 + 3), spd = 1.6 + R() * 0.6, W = WATCH[i], A = WANDER[i][0], B = WANDER[i][1];
    const arr1 = 4 + R() * 7, lv1 = 22 + R() * 9, arr2 = 86 + R() * 6, lv2 = 103 + R() * 5;
    const face = dirOf(0 - W[0], -14 - W[1]), phoneUp = R() < 0.45, idle = R.int(0, 3);
    // legs of the day: [t0, from, to]: wander A -> watch -> wander B -> watch -> wander A
    const legs = [[arr1 - Math.hypot(W[0] - A[0], W[1] - A[1]) / spd, A, W], [lv1, W, B], [arr2 - Math.hypot(W[0] - B[0], W[1] - B[1]) / spd, B, W], [lv2, W, A]];
    T.actor({ sample: 0.4, period: F.CYC,
      at(t) {
        let tc = F.cyc(t); if (tc >= legs[0][0] + F.CYC) tc -= F.CYC;
        let at = A, li = -1;
        for (let k = 0; k < legs.length; k++) if (tc >= legs[k][0]) li = k;
        if (li < 0) at = A;
        const leg = li < 0 ? null : legs[li];
        if (leg) {
          const [t0, P, Q] = leg, dist = Math.hypot(Q[0] - P[0], Q[1] - P[1]), u = (tc - t0) * spd;
          if (u < dist) { const f = u / dist, d = dirOf(Q[0] - P[0], Q[1] - P[1]), ph = Math.floor((u / 2.4) % 1 * 8); return { x: lerp(P[0], Q[0], f), y: lerp(P[1], Q[1], f), key: 'w' + d + '.' + ph, dir: d, pose: 'walk', ph: ph / 8 }; }
          at = Q;
        }
        const watching = at === W;
        if (watching) {
          const up = phoneUp && ((tc > F.RAISE[0] - 1 && tc < F.RAISE[1] + 1) || (tc > F.LOWER[0] - 1 && tc < F.LOWER[1] + 1));
          return { x: at[0], y: at[1], key: 'v' + face + (up ? 'u' : ''), dir: face, pose: up ? 'hold' : 'stand', up };
        }
        return { x: at[0], y: at[1], key: 'i' + idle, dir: idle, pose: 'stand' };
      },
      draw(g, st) { BJ.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.pose, ph: st.ph || 0, phone: st.up, reach: st.up ? [0.5, -9.2] : undefined, flag: look.flag && !st.up })); } });
  }

  /* ---------------- kites and their flyers at the south end ---------------- */
  [[-17, 16, -7, -8, 28, '#D23A2E', 0], [-24, 28, -8, -8, 24, '#2E6FB0', 1.7]].forEach(([fx, fy, dx, dy, kz, col, ph0], i) => {
    T.cast([fx, fy], (g) => {
      const r = BJ.person(g, fx, fy, 0, BJ.who(460 + i, { old: true, dir: dx > 0 ? 3 : 2, pose: 'hold', reach: [0.6, -8.8], cap: '#5A5A55' }));
      // the reel in his hands
      const hd = r.hands[0]; g.disc2(hd, 1.0, '#C9A26B'); g.ring2(hd, 1.0, { w: 0.3, c: '#6E5A44' });
    }, { on: false });
    T.actor({ layer: 'top', sample: 5, period: 12, grow: false,
      at(t) { const w = Math.floor(t * 4 + i * 3) % 12, bob = Math.sin(t * 0.9 + ph0) * 1.4; return { x: fx + dx, y: fy + dy, z: kz + bob, key: 'k' + w, w, bob }; },
      draw(g, st) {
        const o = g.p(0, 0, 0), hand = g.p(-dx, -dy, 4.4 - (kz + st.bob));
        const pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push([lerp(o[0], hand[0], t), lerp(o[1], hand[1], t) + Math.sin(Math.PI * t) * 6]); }
        g.fine2(pts, { w: 0.25, c: '#6E6658' });
        BJ.kite2(g, [o[0], o[1] - 3], 3.4, col, st.w * TAU / 12);
      } });
  });

  /* ---------------- tourists and a sweeper ---------------- */
  K.walker(T, BJ.tourist(470, '#E85A3A'), [[12, 4], [24, 4], [24, 16], [12, 16]], 1.1, { phase: 0.1 });
  K.walker(T, BJ.tourist(471, '#E85A3A'), [[12, 4], [24, 4], [24, 16], [12, 16]], 1.1, { phase: 0.16 });
  K.walker(T, BJ.who(472), [[-26, -22], [-12, -22], [-12, 14], [-26, 14]], 1.3, { phase: 0.3 });
  K.walker(T, BJ.who(473), [[26, -20], [26, 34], [12, 34], [12, -20]], 1.2, { phase: 0.6 });
  K.walker(T, BJ.who(474, { top: '#E8742A', cap: '#E8742A' }), [[-25, 30], [-12, 30], [-12, 34], [-25, 34]], 0.5, { phase: 0.2 });
});
