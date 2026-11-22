'use strict';
/* ACQUA ALTA in Piazza San Marco: everything that moves with the tide, added to the sanmarco tile (SM.tile).
   The tide cycle (SM.PT = 60 s) is phased so that the San Marco shot opens just before the siren:
     0      the siren wails from the clock tower; people start for the passerelle
     1.6    water wells up out of the drain grates; the lagoon climbs the Molo's wall
     8.6    the whole square is one sheet of water, the campanile and the arcades reflected in it
     21     the tide turns: the sheet breaks into pools, the pools shrink back into the drains
     29     dry; the boards empty; people come back out of the arcades and walk the square again
   The water is one actor drawn before everything standing on the square (anchored at its far corner): pools are
   discs round the drains (their wet rims painted first, so where pools join no edge shows), then the full sheet with
   its reflections. Its key is the level in 20 steps. */
SM.acqua = function (T) {
  const PT = SM.PT, WLV = VN.WL;
  const sh = SCENE.shots.find((s) => s.name === 'sanmarco');
  const OFF = sh ? ((((-0.5 - sh.a / 30) % PT) + PT) % PT) : 0;
  const tauOf = (t) => ((((t + OFF) % PT) + PT) % PT);
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const level = (tau) => tau < 1.3 ? 0 : tau < 6.6 ? ease((tau - 1.3) / 5.3) : tau < 21 ? 1 : tau < 29 ? 1 - ease((tau - 21) / 8) : 0;
  SM.level = (t) => level(tauOf(t)); SM.tau = tauOf;
  const Q = 12, HMAX = 0.8, X0 = -28.95, Y0 = -19.95, X1 = 37, Y1 = 37;
  // the drains: delay (the low ones near the basilica go first) and how far their pool reaches
  const DR = SM.DRAINS.map(([x, y], i) => ({ x, y, d: clamp(0.04 + (x + y + 40) / 160 * 0.32 + h1(i * 7.3) * 0.08, 0, 0.5), R: 11 + h1(i * 3.1) * 6 }));
  const radius = (dr, lq) => { const k = clamp((lq - dr.d) / (0.8 - dr.d), 0, 1); return dr.R * Math.pow(k, 0.75); };
  const depthAt = (x, y, lq) => {
    if (lq <= 0 || x < X0 || y < Y0) return 0;
    if (lq >= 0.8) return lq * HMAX;
    for (const dr of DR) { const r = radius(dr, lq); if (r > 0 && (x - dr.x) * (x - dr.x) + (y - dr.y) * (y - dr.y) < r * r * 0.85) return lq * HMAX * 0.7; }
    return 0;
  };
  SM.depth = (x, y, t) => depthAt(x, y, Math.round(SM.level(t) * Q) / Q);

  /* ---- the water ---- */
  T.actor({ grow: false, sample: 0.5, period: PT, bias: -2,
    at(t) { const lq = Math.round(level(tauOf(t)) * Q) / Q; if (lq <= 0) return null; const n = LOOK.night && lq >= 0.8; return { x: X0, y: Y0, z: 0, key: lq + (n ? 'n' : ''), lq, n }; },
    draw(g, st) {
      const lq = st.lq, h = lq * HMAX, ox = -X0, oy = -Y0;          // draw in tile coords, shifted so the anchor is the origin
      const W = (x, y, z) => [x + ox, y + oy, z];
      const clipW = (P) => VN.clipBox(P, X0, Y0, X1, Y1).map((p) => W(p[0], p[1], p[2]));
      if (lq < 0.8) {
        const rings = [], pools = [];
        const blob = (dr, r, z, i) => { const o = []; for (let k = 0; k < 26; k++) { const a = TAU * k / 26, m = 1 + 0.16 * Math.sin(3 * a + i * 1.7) + 0.09 * Math.sin(5 * a + i * 2.9) + 0.05 * Math.sin(8 * a + i); o.push([dr.x + Math.cos(a) * r * m, dr.y + Math.sin(a) * r * m, z]); } return o; };
        DR.forEach((dr, i) => { const r = radius(dr, lq); if (r <= 0.05) return; rings.push(clipW(blob(dr, r + 0.7, 0.02, i))); pools.push(clipW(blob(dr, r, h * 0.6, i))); });
        for (const q of rings) if (q.length > 2) g.fill(q, '#C4BEB2');
        for (const q of pools) if (q.length > 2) g.fill(q, VN.flood);
        for (const dr of DR) { const r = radius(dr, lq); if (r < 1.5) continue; const c = g.p.apply(g, W(dr.x, dr.y, h * 0.6)); for (const k of [0.35, 0.7]) g.line2(arcPts(c[0], c[1], r * k * SX * 0.5, 0, TAU, 14).map((q) => [q[0], c[1] + (q[1] - c[1]) * 0.55]), { w: 0.3, c: '#D4E3DD', boil: false, close: true }); }
      } else {
        // the full sheet over the square
        const sheet = [W(X0, Y0, h), W(X1, Y0, h), W(X1, Y1, h), W(X0, Y1, h)];
        g.fill(sheet, VN.flood);
        const S = g.P(sheet), sg = VN.area(S) > 0 ? 1 : -1;
        const clipS = (P) => { let o = P; for (let i = 0; i < 4 && o.length > 2; i++) o = VN.clip(o, S[i], S[(i + 1) % 4], sg); return o; };
        const refl = (pts, col) => { const P = clipS(g.P(pts.map((p) => W(p[0], p[1], 2 * h - p[2])))); if (P.length > 2) g.fill2(P, mix(col, VN.flood, 0.66), true); };
        // reflections: the Procuratie's arcade front, the basilica's facade, the palace, the campanile
        refl([[-29, -14, 0], [-29, 37, 0], [-29, 37, 12.6], [-29, -14, 12.6]], '#EFEAE0');
        refl([[-29, -14, 5.4], [-29, 37, 5.4], [-29, 37, 8.6], [-29, -14, 8.6]], '#8E96A0');
        refl([[-27, -20, 0], [-4, -20, 0], [-4, -20, 11.4], [-27, -20, 11.4]], '#F2E8DA');
        refl([[-24, -20, 1.5], [-7, -20, 1.5], [-7, -20, 5], [-24, -20, 5]], '#C9A13A');
        refl([[-2.5, -18, 0], [26, -18, 0], [26, -18, 4.4], [-2.5, -18, 4.4]], '#B9A898');
        refl([[-2.5, -18, 9], [26, -18, 9], [26, -18, 15.5], [-2.5, -18, 15.5]], '#E9B9A6');
        const r0 = g.cmds.length;
        refl([[-1, -8.5, 1.2], [4.5, -8.5, 1.2], [4.5, -14, 1.2], [4.5, -14, 28], [4.5, -8.5, 28], [-1, -8.5, 28]], '#C47454');
        refl([[-1, -8.5, 28], [4.5, -8.5, 28], [4.5, -14, 28], [4.5, -14, 37.4], [4.5, -8.5, 37.4], [-1, -8.5, 37.4]], '#F3EFE6');
        refl([[-1, -8.5, 37.4], [4.5, -8.5, 37.4], [4.5, -14, 37.4], [1.75, -11.25, 48.4]], '#6F9A86');
        refl([[30.3, -10.8, 1.3], [31.7, -10.8, 1.3], [31.7, -10.8, 14], [30.3, -10.8, 14]], '#B9A9A0');
        refl([[30.3, -0.8, 1.3], [31.7, -0.8, 1.3], [31.7, -0.8, 14], [30.3, -0.8, 14]], '#B9A9A0');
        if (st.n) {   // at night the flooded square doubles the lights: the floodlit fronts glow in it, every lamp lays a broken column on it
          const sea = nightColour(VN.flood), L1 = VN.litStone(1);
          g.mark({ nc: (c) => { const l = L1(c); return l ? mix(l, sea, 0.45) : undefined; } }, r0);
          for (const [x, y, z, col] of SM.LIGHTS) {
            if (x < X0 + 0.5 || y < Y0 + 0.5) continue;
            for (let k = 0; k < 6; k++) {
              const zz = 2 * h - z - 0.4 - k * 1.15, w = (1.5 - k * 0.17) * (0.8 + 0.4 * h1(x * 3 + y * 7 + k)), dx = (h1(x + y * 5 + k * 3) - 0.5) * 0.5;
              const a = g.p.apply(g, W(x + dx - w * 0.5, y + dx + w * 0.5, zz)), b = g.p.apply(g, W(x + dx + w * 0.5, y + dx - w * 0.5, zz));
              const P = clipS([[a[0], a[1]], [b[0], b[1]], [b[0], b[1] + 0.9], [a[0], a[1] + 0.9]]); if (P.length > 2) { g.fill2(P, 'rgba(' + col + ',' + (0.75 - k * 0.1).toFixed(2) + ')', true); g.mark({ nc: true }); }
            }
          }
        }
        const rp = []; for (let i = 0; i < 160; i++) { const x = lerp(X0 + 1, X1 - 1, h1(i * 1.37)), y = lerp(Y0 + 1, Y1 - 1, h1(i * 2.91)), c = g.p.apply(g, W(x, y, h)), l = 2 + h1(i * 5.3) * 6; rp.push(c[0] - l, c[1], c[0] + l, c[1]); }
        g.segs2(rp, VN.flood, 1.3);
        g.water(sheet, { dens: 0.5 });
        g.line([W(X1, Y0, h), W(X1, Y1, h), W(X0, Y1, h)], { w: 0.4, c: '#E9F2EE', boil: false, ext: 0 });
      }
    } });

  /* ---- the lagoon climbing the banks: the Molo's wall and the Grand Canal's, in pieces ---- */
  const lagZ = (t) => { const l = level(tauOf(t)); return WLV + (HMAX - WLV) * clamp(l * 1.15, 0, 1); };
  const band = (f, a0, a1) => T.actor({ grow: false, sample: 0.5, period: PT,
    at(t) { const z = Math.round((lagZ(t) - WLV) * 6) / 6 + WLV; if (z <= WLV + 0.05) return null; return f === 'R' ? { x: 36.9, y: a0, z: 0, key: z.toFixed(2), zz: z } : { x: a0, y: 36.9, z: 0, key: z.toFixed(2), zz: z }; },
    draw(g, st) {
      const P = f === 'R' ? K.on('R', 0.13, 0, a1 - a0, WLV, Math.min(0, st.zz)) : K.on('L', 0.13, 0, a1 - a0, WLV, Math.min(0, st.zz));
      g.fill(P, f === 'R' ? VN.lagoon : VN.water);
      const top = f === 'R' ? [[0.13, 0, Math.min(0, st.zz)], [0.13, a1 - a0, Math.min(0, st.zz)]] : [[0, 0.13, Math.min(0, st.zz)], [a1 - a0, 0.13, Math.min(0, st.zz)]];
      g.line(top, { w: 0.4, c: '#EEF5F1', boil: false, ext: 0 });
    } });
  for (let a = -37; a < 37; a += 12.4) { band('R', a, Math.min(37, a + 12.4)); band('L', a, Math.min(37, a + 12.4)); }

  /* ---- the passerelle: planks on trestles, in pieces so people sort with them ---- */
  const ZB = 1.5;
  const board = (x0, y0, x1, y1) => T.obj([x0, y0, x1, y1], function (g) {
    g.boilP = 0.15;
    const alongY = (y1 - y0) > (x1 - x0), legs = [];
    if (alongY) for (let y = y0 + 0.6; y < y1; y += 2.6) for (const x of [x0 + 0.3, x1 - 0.3]) { const a = g.p(x, y, 0), b = g.p(x, y, ZB); legs.push(a[0], a[1], b[0], b[1]); }
    else for (let x = x0 + 0.6; x < x1; x += 2.6) for (const y of [y0 + 0.3, y1 - 0.3]) { const a = g.p(x, y, 0), b = g.p(x, y, ZB); legs.push(a[0], a[1], b[0], b[1]); }
    g.segs2(legs, '#6E5A44', 0.55);
    K.box(g, x0, y0, x1, y1, ZB - 0.3, ZB, { t: '#C49A68', l: '#A88052', r: '#94703F' }, { w: 0.5, nohid: true });
    const pl = []; if (alongY) for (let y = y0 + 1.2; y < y1; y += 1.2) { const a = g.p(x0, y, ZB), b = g.p(x1, y, ZB); pl.push(a[0], a[1], b[0], b[1]); } else for (let x = x0 + 1.2; x < x1; x += 1.2) { const a = g.p(x, y0, ZB), b = g.p(x, y1, ZB); pl.push(a[0], a[1], b[0], b[1]); }
    g.segs2(pl, '#9C7450', 0.25);
  }, { name: 'passerella' });
  const AX = -15.2, BY = -16, HB = 1.0;
  for (let y = -19.4; y < 35.6; y += 9.2) board(AX - HB, y, AX + HB, Math.min(35.6, y + 9.2));
  for (let x = AX + HB; x < 34.6; x += 9.6) board(x, BY - HB, Math.min(34.6, x + 9.6), BY + HB);

  /* ---- the people of the square: boards, waders, posers, a café, an orchestra, pigeons ---- */
  const V = 1.8, VW = 1.7;
  const routeA = [[AX - 0.3, 36.5], [AX - 0.3, -18.8]], routeB = [[34.5, BY], [AX + 0.5, BY], [AX + 0.5, -18.8]];
  const rLen = (r) => { let L = 0; for (let i = 0; i < r.length - 1; i++) L += Math.hypot(r[i + 1][0] - r[i][0], r[i + 1][1] - r[i][1]); return L; };
  const rAt = (r, s) => { for (let i = 0; i < r.length - 1; i++) { const a = r[i], b = r[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (s <= l || i === r.length - 2) { const u = clamp(s / l, 0, 1), dx = b[0] - a[0], dy = b[1] - a[1]; return { x: a[0] + dx * u, y: a[1] + dy * u, dir: Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3) }; } s -= l; } };
  const LA = rLen(routeA), LB = rLen(routeB);
  const zOn = (r, L, s) => { const e = Math.min(s, L - s); return e < 1.4 ? ZB * clamp(e / 1.4, 0, 1) : ZB; };
  // slots: route A every 3 s from 0.8 to 21, route B the same but 1.5 s later so they alternate where B joins A
  const SL = [];
  for (let k = -20; k * 1.6 + 0.8 <= 21; k++) { SL.push({ r: routeA, L: LA, t0: 0.8 + k * 1.6, who: null, join: k < 0 }); SL.push({ r: routeB, L: LB, t0: 0.8 + 0.8 + k * 1.6 + (LA - LB) / V, who: null, join: k < 0 }); }
  const slotPos = (sl, tau) => (tau - sl.t0) * V;
  // the wanderers: a loop of the square per tide cycle each; at the siren they make for the nearest board
  const loops = [
    [[-24, 2], [-6, 2], [-6, 30], [-24, 30]], [[-26, 32], [-8, 32], [-8, 6], [-26, 6]], [[-22, -14], [-2, -12], [-4, 4], [-22, 2]],
    [[4, 2], [22, -6], [24, 14], [6, 18]], [[2, 28], [10, 4], [24, 2], [20, 18]], [[-20, 20], [-10, 12], [-24, -6]], [[8, -12], [28, -12], [28, 8], [8, 10]],
    [[-12, 26], [2, 14], [-10, -4]], [[-26, 14], [-2, 20], [-2, 34], [-20, 34]], [[14, -4], [32, 2], [26, 20]], [[-6, -14], [10, -12], [12, 0], [-4, -4]],
    [[-28, -10], [-18, -2], [-26, 24]], [[0, 34], [18, 20], [4, 10]], [[20, -12], [32, -8], [32, 12]],
  ];
  const loopAt = (pts, tau) => { const r = pts.concat([pts[0]]), L = rLen(r); const p = rAt(r, ((tau / PT) * L) % L); return p; };
  const near = (x, y) => { // the closest boarding point beside a route, and its distance along it
    const c = []; const sA = clamp(36.5 - y, 1.5, LA - 2); c.push({ sl: 'A', s: sA, px: AX + (x > AX ? 1.7 : -1.9), py: 36.5 - sA, r: routeA });
    if (x > AX + 2) { const sB = clamp(34.5 - x, 1.5, 48); c.push({ sl: 'B', s: sB, px: 34.5 - sB, py: BY + (y > BY ? 1.6 : -1.6), r: routeB }); }
    c.forEach((q) => { q.d = Math.hypot(q.px - x, q.py - y); }); c.sort((a, b) => a.d - b.d); return c[0];
  };
  const people = loops.map((lp, i) => {
    const react = 0.3 + i * 0.2, p0 = loopAt(lp, react), e = near(p0.x, p0.y), arr = react + e.d / VW;
    // the first free slot of that route that passes the boarding point after they get there
    let best = null; for (const sl of SL) { if (sl.who != null || sl.r !== e.r) continue; const tp = sl.t0 + e.s / V; if (tp >= arr + 0.4 && (!best || tp < best.tp)) best = { sl, tp }; }
    if (!best) return null;
    best.sl.who = i;
    const up = best.tp, end = best.sl.t0 + best.sl.L / V, back = 31 + i * 0.75, arcade = [-28.6, -10 + (i * 3.7) % 44];
    let ta = back + 4; for (let k = 0; k < 3; k++) { const q = loopAt(lp, ta); ta = back + Math.hypot(q.x - arcade[0], q.y - arcade[1]) / VW; }
    return { i, lp, react, p0, e, arr, up, sl: best.sl, end, back, arcade, ta };
  }).filter(Boolean);
  const dirTo = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3);
  const walkSt = (x, y, dir, d, z, extra) => Object.assign({ x, y, z: z || 0, dir, ph: Math.floor((d / 2.4) % 1 * 8) / 8, pose: 'walk' }, extra || {});
  const wadeQ = (x, y, t) => Math.round(SM.depth(x, y, t) / HMAX * 4) / 4 * HMAX;
  const looks = (i) => { const R = RNG(400 + i); const k = R(); return k < 0.22 ? VN.carnival(400 + i, R.pick(['gown', 'cape', 'volto', 'jester'])) : VN.who(400 + i, k < 0.4 ? { boots: true } : {}); };
  for (const P of people) {
    const w = looks(P.i);
    T.actor({ sample: 0.25, period: PT,
      at(t) {
        const tau = tauOf(t); let s;
        if (tau < P.react) { const q = loopAt(P.lp, tau), q2 = loopAt(P.lp, tau + 0.05); s = walkSt(q.x, q.y, dirTo(q2.x - q.x, q2.y - q.y), tau * VW); }
        else if (tau < P.arr) { const u = (tau - P.react) / (P.arr - P.react), x = lerp(P.p0.x, P.e.px, u), y = lerp(P.p0.y, P.e.py, u); s = walkSt(x, y, dirTo(P.e.px - P.p0.x, P.e.py - P.p0.y), tau * VW); }
        else if (tau < P.up) { const q = rAt(P.sl.r, P.e.s); s = { x: P.e.px, y: P.e.py, z: 0, dir: dirTo(q.x - P.e.px, q.y - P.e.py), pose: 'stand', ph: 0 }; }
        else if (tau < P.end) {
          const sp = slotPos(P.sl, tau), q = rAt(P.sl.r, sp), k = clamp((tau - P.up) / 0.5, 0, 1);
          const x = lerp(P.e.px, q.x, k), y = lerp(P.e.py, q.y, k), z = lerp(0, zOn(P.sl.r, P.sl.L, sp), k), a = clamp((P.sl.L - sp) / 1.2, 0, 1);
          s = walkSt(x, y, q.dir, sp, z, a < 1 ? { alpha: a } : {});
        } else if (tau < P.back) return null;
        else if (tau < P.ta) { const q = loopAt(P.lp, P.ta), u = (tau - P.back) / (P.ta - P.back), x = lerp(P.arcade[0], q.x, u), y = lerp(P.arcade[1], q.y, u), a = clamp((tau - P.back) / 0.6, 0, 1); s = walkSt(x, y, dirTo(q.x - P.arcade[0], q.y - P.arcade[1]), tau * VW, 0, a < 1 ? { alpha: a } : {}); }
        else { const q = loopAt(P.lp, tau), q2 = loopAt(P.lp, tau + 0.05); s = walkSt(q.x, q.y, dirTo(q2.x - q.x, q2.y - q.y), tau * VW); }
        const wd = s.z > 0.2 ? 0 : wadeQ(s.x, s.y, t);
        s.wd = wd; s.key = s.pose + s.dir + '.' + s.ph + '.' + wd.toFixed(2);
        return s;
      },
      draw(g, st) { VN.person(g, 0, 0, 0, Object.assign({}, w, { dir: st.dir, pose: st.pose, ph: st.ph, wade: st.wd })); } });
  }
  // the rest of the slots: people coming onto the boards at their start (out of the Ala Napoleonica, off the Molo)
  SL.filter((sl) => sl.who == null && !sl.join).forEach((sl, j) => {
    const w = j % 4 === 1 ? VN.carnival(500 + j, ['bauta', 'gown', 'medico', 'cape'][j % 4]) : VN.who(500 + j);
    T.actor({ sample: 0.25, period: PT,
      at(t) {
        const tau = tauOf(t), sp = slotPos(sl, tau); if (sp < 0 || sp > sl.L) return null;
        const q = rAt(sl.r, sp), a = clamp(Math.min(sp, sl.L - sp) / 1.2, 0, 1);
        return Object.assign(walkSt(q.x, q.y, q.dir, sp, zOn(sl.r, sl.L, sp)), { key: q.dir + '.' + Math.floor((sp / 2.4) % 1 * 8), alpha: a < 1 ? a : null });
      },
      draw(g, st) { VN.person(g, 0, 0, 0, Object.assign({}, w, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
  });
  // waders in rubber boots, crossing the piazzetta whatever the tide
  [[[2, 30], [24, -10]], [[30, 10], [-2, 4]], [[-26, 16], [-18, -12]], [[12, -12], [20, 22]]].forEach((rt, i) => {
    const w = VN.who(560 + i, { shoe: '#2F4F2F', bot: '#3B3F47' }), L = 2 * Math.hypot(rt[1][0] - rt[0][0], rt[1][1] - rt[0][1]), sp = L / (PT / (i % 2 + 1));
    T.actor({ sample: 0.25, period: PT,
      at(t) { const tau = tauOf(t), d = (tau * sp + i * 7) % L, half = L / 2, fw = d < half, u = fw ? d / half : (d - half) / half, a = fw ? rt[0] : rt[1], b = fw ? rt[1] : rt[0], x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u), wd = wadeQ(x, y, t), dir = dirTo(b[0] - a[0], b[1] - a[1]), ph = Math.floor((d / 2.4) % 1 * 8) / 8; return { x, y, dir, ph, wd, key: dir + '.' + ph + '.' + wd.toFixed(2) }; },
      draw(g, st) { VN.person(g, 0, 0, 0, Object.assign({}, w, { dir: st.dir, pose: 'walk', ph: st.ph, wade: st.wd })); } });
  });
  // Carnival costumes posing in front of the basilica and by the columns, photographers before them
  [[-20, -14, 'gown', 1, 0], [-17.5, -15, 'gown', 1, 1], [-12, -13.5, 'bauta', 1, 2], [26, -6, 'medico', 0, 3], [27, -3.5, 'gown', 1, 4], [-23, -12.5, 'cape', 1, 5]].forEach(([x, y, kd, dir, i]) => {
    const w = VN.carnival(600 + i, kd);
    T.actor({ sample: 5, period: PT,
      at(t) { const tau = tauOf(t), wd = wadeQ(x, y, t), pz = Math.floor((tau + i * 1.7) / 3.4) % 3; return { x, y, wd, pz, key: pz + '.' + wd.toFixed(2) }; },
      draw(g, st) { VN.person(g, 0, 0, 0, Object.assign({}, w, { dir, pose: st.pz === 1 ? 'wave' : st.pz === 2 ? 'hold' : 'stand', ph: 0.25, wade: st.wd })); } });
  });
  [[-18, -6, 3, 0], [-13, -7, 3, 1], [22, -4, 0, 2], [-21, -5, 3, 3]].forEach(([x, y, dir, i]) => {
    const w = VN.who(640 + i, { shoe: '#E6C24F' });
    T.actor({ sample: 5, period: PT, at(t) { const wd = wadeQ(x, y, t); return { x, y, wd, key: wd.toFixed(2) }; },
      draw(g, st) { const r = VN.person(g, 0, 0, 0, Object.assign({}, w, { dir, pose: 'hold', wade: st.wd })); const h = r.hands[0]; g.fill2([[h[0] - 1.2, h[1] - 1.6], [h[0] + 1.2, h[1] - 1.6], [h[0] + 1.2, h[1] + 0.2], [h[0] - 1.2, h[1] + 0.2]], '#2A2622', true); } });
  });

  /* ---- Caffè Quadri's tables, its orchestra on the little stage ---- */
  for (const [y, n] of [[2, 2], [8, 2], [14, 1], [20, 2], [26, 2]]) T.cast([-25.5, y], function (g) {
    VN.table(g, -25.5, y, 0, { cups: ['#F3F1EA', '#C9463E'] }); g.glow('lantern', -25.5, y, 2.9, { r: 0.7, col: '#FFC870' });   // a little table lamp at night
    for (let k = 0; k < n; k++) { const sx = -25.5 + (k ? 1.6 : -1.5), sy = y + (k ? 0.6 : -0.8), w = (y + k) % 3 === 0 ? VN.carnival(700 + y + k, 'volto') : VN.who(700 + y * 3 + k); VN.person(g, sx, sy, 1.3, Object.assign({}, w, { dir: k ? 2 : 0, pose: 'sit' })); }
  }, { name: 'quadri tables' });
  T.obj([-27.6, -9.4, -23.2, -2.6], function (g) {
    K.box(g, -27.6, -9.4, -23.2, -2.6, 0, 1.0, { t: '#B8875A', l: '#9C7450', r: '#8A6440' }, { w: 0.55 });
    K.box(g, -27.2, -8.8, -25.6, -6.0, 1.0, 2.8, { t: '#2A2622', l: '#3A3632', r: '#2A2622' }, { w: 0.5 });     // the piano
    const musician = (x, y, i, inst) => { const r = VN.person(g, x, y, 1.0, VN.who(720 + i, { dir: 0, pose: inst === 'piano' ? 'sit' : 'hold', top: '#2A2622', bot: '#2A2622', tie: true, scarf: null, beanie: null, colombina: null })); const hh = r.hands[0];
      if (inst === 'violin') { g.fill2([[hh[0] - 0.6, hh[1] - 3.6], [hh[0] + 1.4, hh[1] - 4.2], [hh[0] + 1.6, hh[1] - 3.0], [hh[0] - 0.4, hh[1] - 2.4]], '#9C5A34', true); g.line2([[hh[0] - 2.4, hh[1] - 1.2], [hh[0] + 3.0, hh[1] - 4.6]], { w: 0.3, c: '#E9E2CC', boil: false, ext: 0 }); }
      if (inst === 'bass') { g.fill2(K.curve([[hh[0] + 1, hh[1] + 4], [hh[0] + 3.2, hh[1] + 1], [hh[0] + 2.4, hh[1] - 4], [hh[0] + 1.0, hh[1] - 10], [hh[0] - 0.4, hh[1] - 3], [hh[0] - 0.8, hh[1] + 2]], 3, true), '#8A4A2A', true); } };
    musician(-26.4, -5.2, 0, 'violin'); musician(-24.4, -7.2, 1, 'bass'); musician(-24.4, -4.0, 2, 'violin');
    const ps = g.P([[-26.0, -8.4, 1.3]]); VN.person(g, -25.0, -8.6, 1.0, VN.who(723, { dir: 2, pose: 'sit', top: '#2A2622' })); void ps;
    for (const y of [-8.8, -3.2]) g.glow('lamp', -23.4, y, 5.4, { r: 1.3 });                                // the stage's lamps at night
  }, { name: 'orchestra' });

  /* ---- the two red lions of the piazzetta dei Leoncini, children riding them ---- */
  for (const [x, y, kid] of [[-34, -32.5, 0], [-30.4, -32.5, 1]]) T.obj([x - 1.4, y - 0.8, x + 1.4, y + 0.8], function (g) {
    K.box(g, x - 1.4, y - 0.8, x + 1.4, y + 0.8, 0, 1.2, { t: '#D9D2C4', l: '#E6E0D4', r: '#CFC8BA' }, { w: 0.5 });
    const c = g.p(x, y, 1.2); g.fill2([[c[0] - 3.6, c[1] - 0.2], [c[0] + 3.2, c[1] - 1.2], [c[0] + 3.4, c[1] - 4.4], [c[0] + 1.8, c[1] - 5.4], [c[0] - 2.6, c[1] - 3.2]], '#B5584B', true); g.disc2([c[0] + 2.4, c[1] - 4.4], 1.6, '#A34C40');
    g.line2([[c[0] - 3.6, c[1] - 0.2], [c[0] - 2.6, c[1] - 3.2], [c[0] + 1.8, c[1] - 5.4], [c[0] + 3.4, c[1] - 4.4], [c[0] + 3.2, c[1] - 1.2]], { w: 0.4, c: '#6E2A22', boil: false });
    if (kid === 0 || true) VN.person(g, x - 0.2, y + 0.1, 2.4, VN.who(740 + kid, { dir: kid ? 0 : 1, pose: 'sit', k: 0.72 }));
  }, { name: 'leoncini', cast: true });

  /* ---- the Moors striking the bell, the siren ---- */
  T.actor({ sample: 5, period: 12, grow: false,
    at(t) { const u = (t % 12) / 12, f = u < 0.08 ? 1 : u > 0.5 && u < 0.58 ? 2 : 0; return { x: -29.6, y: -14.6, z: 18.1, key: f, f }; },
    draw(g, st) {
      for (const [x, y, s, i] of [[-6.4, -2.4, 1, 1], [-1.4, -2.4, -1, 2]]) {
        const p = g.p(x, y, 0), up = st.f === i;
        g.fill2([[p[0] - 1.6, p[1]], [p[0] + 1.6, p[1]], [p[0] + 1.2, p[1] - 6.4], [p[0] - 1.2, p[1] - 6.4]], '#4A4436', true); g.disc2([p[0], p[1] - 7.4], 1.2, '#4A4436');
        const sh2 = [p[0] + s * 1.0, p[1] - 5.6], hd = up ? [p[0] + s * 1.6, p[1] - 10.4] : [p[0] + s * 3.4, p[1] - 6.2];
        g.line2([sh2, hd], { w: 0.7, c: '#4A4436', boil: false, ext: 0 }); g.fill2([[hd[0] - 0.8, hd[1] - 0.4], [hd[0] + 0.8, hd[1] - 0.4], [hd[0] + 0.8, hd[1] + 0.6], [hd[0] - 0.8, hd[1] + 0.6]], '#4A4436', true);
      }
    } });
  T.actor({ layer: 'top', sample: 5, period: PT, grow: false,
    at(t) { const tau = tauOf(t); if (tau > 4.4) return null; const f = Math.floor(tau * 4) % 4; return { x: -33, y: -17, z: 23, key: f, f }; },
    draw(g, st) { const c = g.p(0, 0, 0); for (let k = 0; k < 3; k++) { const r = 4 + ((st.f + k * 1.33) % 4) * 3.2; for (const s of [-1, 1]) g.line2(arcPts(c[0], c[1], r, s > 0 ? -0.6 : Math.PI - 0.6, s > 0 ? 0.6 : Math.PI + 0.6, 6), { w: 0.55, c: '#C9463E', boil: false, ext: 0 }); } } });

  /* ---- pigeons: pecking on the stone; at the siren they fly up to the Procuratie's cornice; back when it's dry ---- */
  for (let i = 0; i < 9; i++) {
    const hx = -8 + (h1(i * 3.7) - 0.5) * 10, hy = 10 + (h1(i * 5.1) - 0.5) * 12, cy = -10 + i * 4.6, t1 = 1.6 + i * 0.12, t2 = 33 + i * 0.4;
    T.actor({ sample: 0.3, period: PT, grow: true,
      at(t) {
        const tau = tauOf(t);
        const fly = (a, b, u) => { const e = ease(u); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), z: lerp(a[2], b[2], e) + Math.sin(u * Math.PI) * 6 }; };
        let p, pose = 'peck', fl = (i % 2) ? 1 : -1;
        if (tau < t1 || tau >= t2 + 2.2) { const hop = Math.floor((tau + i) * 1.3) % 5; p = { x: hx + hop * 0.3, y: hy + (hop % 2) * 0.3, z: 0 }; pose = hop % 2 ? 'peck' : 'stand'; }
        else if (tau < t1 + 2.2) { p = fly([hx, hy, 0], [-29.6, cy, 12.7], (tau - t1) / 2.2); pose = 'fly'; fl = -1; }
        else if (tau < t2) { p = { x: -29.6, y: cy, z: 12.7 }; pose = Math.floor(tau + i) % 3 ? 'stand' : 'peck'; }
        else { p = fly([-29.6, cy, 12.7], [hx, hy, 0], (tau - t2) / 2.2); pose = 'fly'; fl = 1; }
        const f = pose === 'fly' ? Math.floor(tau * 10) % 4 : 0;
        return { x: p.x, y: p.y, z: p.z, pose, f, fl, key: pose + f + fl };
      },
      draw(g, st) { VN.pigeon(g, g.p(0, 0, 0), st.pose, st.f, st.fl); } });
  }
};
