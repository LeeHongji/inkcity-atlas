'use strict';
/* The Galata Bridge (x -63..-37 over the Golden Horn, y -72..-28), the clever moment. What it is: a two-level bridge.
   The upper deck (z 6) carries the avenue across: the T1 tram on its two tracks in the middle, a car lane each side, a
   footway along each rail lined with anglers. Under it, on both sides, the lower deck: a row of fish restaurants on a
   promenade just above the water, open to the Horn under the upper deck, each with its coloured valance, hanging lamps
   and a name board; diners at the tables, waiters, a tout with a menu. The middle span (y -60..-40) has no lower deck:
   the Golden Horn ferries pass under it. Steel girders, grey-blue, on concrete piers.
   Seen from the south-east, the east side is a living cutaway: the restaurants under the deck, the anglers above them
   casting and reeling in a wave that runs down the rail (each angler 0.45 s after the one before, a silvery fish on
   some lines), their lines falling past the restaurant awnings into the water, cats waiting at the buckets, the tram
   and the cars crossing behind them, a simit seller and a tea seller walking the footway.
   Depth: lower-deck restaurants (bias: before the deck), the upper deck { under: 6 } (boats under, everything on it at
   z 6 on it), the east rail in pieces { on: true } so the anglers and the traffic are behind it. Ramps up to the deck are
   drawn by the neighbouring tiles (IS.ramp), so they sort with the buildings beside them. */
/* a ramp of the avenue up to the bridge deck: world box x -63..-37, y wy0..wy1, rising from z 0 at the land end to the
   deck at the water end (IT.zAve). Drawn from the tile T that owns it (tile-local = world - T's centre). */
IS.ramp = function (T, wy0, wy1) {
  const ox = T.cx, oy = T.cy, x0 = -63 - ox, x1 = -37 - ox, y0 = wy0 - oy, y1 = wy1 - oy, Z = (yy) => IT.zAve(yy + oy);
  T.obj([x0, y0, x1, y1], function (g) {
    g.boilP = 0.3;
    const n = 12, ys = []; for (let i = 0; i <= n; i++) ys.push(lerp(y0, y1, i / n));
    // the east wall: dressed stone with two dark arches (passages under the ramp), the parapet
    const wallTop = ys.map((y) => [x1, y, Z(y)]), base = [[x1, y1, 0], [x1, y0, 0]];
    g.fill(wallTop.concat(base), '#D5CCB8');
    const st = []; for (let z = 1.1; z < 6; z += 1.1) { let a = null; for (const y of ys) { if (Z(y) > z + 0.1) { const p = g.p(x1 + 0.02, y, z); if (a) st.push(a[0], a[1], p[0], p[1]); a = p; } else a = null; } }
    g.segs2(st, '#B9AF9A', 0.3);
    const ym = (y0 + y1) / 2, hi = Z(y0) > Z(y1) ? y0 : y1, archY = lerp(ym, hi, 0.45);
    if (Math.max(Z(y0), Z(y1)) > 4) { const q = [[x1 + 0.02, archY - 2.2, 0], [x1 + 0.02, archY + 2.2, 0]]; for (let k = 0; k <= 8; k++) { const t = Math.PI * k / 8; q.push([x1 + 0.02, archY + 2.2 * Math.cos(t), 2.2 + 1.6 * Math.sin(t)]); } g.fill(q, '#4E4A42'); }
    g.line(wallTop, { w: 0.8, boil: false }); g.line(base, { w: 0.8, boil: false });
    g.line([[x1, y0, 0], [x1, y0, Z(y0)]], { w: 0.7, boil: false }); g.line([[x1, y1, 0], [x1, y1, Z(y1)]], { w: 0.7, boil: false });
    // the end face towards the water (the north abutment over the Horn faces +y)
    if (Z(y1) > 0.5) { g.fill([[x0, y1, IT.WL], [x1, y1, IT.WL], [x1, y1, Z(y1)], [x0, y1, Z(y1)]], '#C9C0AC'); g.outline([[x0, y1, IT.WL], [x1, y1, IT.WL], [x1, y1, Z(y1)], [x0, y1, Z(y1)]], { w: 0.75, boil: false }); }
    // the surface: footways, lanes, the tram bed and rails
    const strip = (a, b, col) => g.fill(ys.map((y) => [a, y, Z(y)]).concat(ys.slice().reverse().map((y) => [b, y, Z(y)])), col);
    strip(x0, x1, IS.C.asph); strip(x0, x0 + 2.6, IS.C.pave); strip(x1 - 2.6, x1, IS.C.pave); strip(-55 - ox, -45 - ox, '#C9C2B2');
    const r = []; for (const c of [-52.6, -47.4]) for (const d of [-1, 1]) for (let i = 0; i < n; i++) { const a = g.p(c + d - ox, ys[i], Z(ys[i])), b = g.p(c + d - ox, ys[i + 1], Z(ys[i + 1])); r.push(a[0], a[1], b[0], b[1]); }
    g.segs2(r, '#7E776B', 0.5);
    // the far (west) parapet
    const par = (x) => { const top = ys.map((y) => [x, y, Z(y) + 1.0]); g.line(top, { w: 0.6, c: '#8C8576', boil: false }); const ps = []; for (const y of ys) { const a = g.p(x, y, Z(y)), b = g.p(x, y, Z(y) + 1.0); ps.push(a[0], a[1], b[0], b[1]); } g.segs2(ps, '#A39C8E', 0.4); };
    par(x0 + 0.3);
    par(x1 - 0.3);
  }, { name: 'ramp', under: 0 });
};

/* the ramps are tiles of their own, there from frame 0 like the streets (cars climb them before the places build),
   ordered between the places beside them: the north one after Galata and before the bridge (it is behind it), the south one after the bridge (it is in front of
   its south end) and before Eminönü */
SF.tile('rampN', -50, -83, { order: -1.95, shared: true, half: 13 }, function (T) { IS.ramp(T, -94, -72); });
SF.tile('rampS', -50, -17, { order: -1.05, shared: true, half: 13 }, function (T) { IS.ramp(T, -28, -6); });
SF.tile('kopru', -50, -50, { order: -1.1, shared: true, half: 26 }, function (T) {
  const X0 = -13, X1 = 13, Y0 = -22, Y1 = 22, DZ = 6, WL = IT.WL, OP = [-10, 10];
  const STEEL = { t: '#AEB8BF', l: '#8E9BA6', r: '#7A8893' }, CON = { t: '#C9C3B6', l: '#BDB6A7', r: '#A9A293' };

  // the water under the bridge: the deck's shade
  T.ground(function (g) {
    g.fill(K.rect(X0, Y0, X1 + 1.5, Y1, WL), 'rgba(52,84,90,0.30)');
    g.fill(K.rect(X0, OP[0], X1, OP[1], WL), 'rgba(40,70,76,0.25)');
  });
  // concrete piers under the decks
  // (none at the south end: that row would stand in the strip the Eminönü quay and the ramp hide; drawn before the
  // deck, which covers them, so none can show on the road)
  for (const y of [-21, OP[0] - 0.6, OP[1] + 0.6]) for (const x of [X0 + 1.6, -4, 4, X1 - 1.6]) T.obj([x, y], (g) => { K.cyl(g, x, y, 0.9, WL, -0.5, CON, { w: 0.55, n: 10 }); }, { name: 'pier', bias: -60 });

  /* ---- the lower deck restaurants (east side, seen as a cutaway) ---- */
  const REST = [
    { y0: -21.6, y1: -15.8, val: '#2E6E5A', name: 'BALIK', seed: 1 }, { y0: -15.6, y1: -10.6, val: '#2B4F7A', name: 'HALİÇ', seed: 2 },
    { y0: 10.6, y1: 16.2, val: '#A8372E', name: 'KÖPRÜ', seed: 3 }, { y0: 16.4, y1: 21.6, val: '#C98A2E', name: 'MEYHANE', seed: 4 },
  ];
  for (const R0 of REST) {
    T.obj([8.4, R0.y0, X1 + 0.2, R0.y1], function (g) {
      g.boilP = 0.3;
      const ya = R0.y0, yb = R0.y1, RR = RNG(R0.seed * 91);
      K.box(g, 8.4, ya, X1 + 0.2, yb, -0.6, 0, { t: '#B79A74', l: '#9C8262', r: '#86704F' }, { w: 0.6 });                  // the floor on its beams
      K.box(g, 8.4, ya, 9.4, yb, 0, DZ - 0.8, { t: '#E9E2D2', l: '#EFE9DC', r: '#E2D9C6' }, { w: 0.6 });                   // the kitchen wall
      g.fill(K.on('R', 9.42, ya + 0.6, ya + 2.0, 0, 3.6), '#4E4A42');                                                       // a door
      g.fill(K.on('R', 9.42, ya + 2.6, yb - 0.6, 1.4, 3.8), '#E9C98A');                                                     // a lit hatch
      // tables along the terrace, two diners each (back to front)
      const tabs = []; for (let y = ya + 1.6; y < yb - 0.8; y += 2.7) tabs.push(y);
      for (const y of tabs) {
        const tc = g.p(11.2, y, 1.9);
        IS.person(g, 10.2, y, 1.3, IS.who(R0.seed * 100 + Math.round(y * 3), { dir: 0, pose: 'sit', k: 0.92 }));
        K.cyl(g, 11.2, y, 0.12, 0, 1.85, '#5A4A3C', { n: 6, w: 0.35, nt: true });
        g.fill2(arcPts(tc[0], tc[1], 1, 0, TAU, 12).map((q) => [tc[0] + (q[0] - tc[0]) * 3.2, tc[1] + (q[1] - tc[1]) * 1.5]), '#F6F3EA', true);
        g.line2(arcPts(tc[0], tc[1], 1, 0, TAU, 12).map((q) => [tc[0] + (q[0] - tc[0]) * 3.2, tc[1] + (q[1] - tc[1]) * 1.5]), { w: 0.3, c: '#8C8576', close: true, boil: false });
        IS.glass2(g, [tc[0] - 1.0, tc[1] + 0.3], 0.6); g.fill2([[tc[0] + 0.2, tc[1] - 0.2], [tc[0] + 2.0, tc[1] - 0.6], [tc[0] + 1.8, tc[1] + 0.3]], '#C9CED2', true);
        if (RR() < 0.7) IS.person(g, 12.2, y + 0.3, 1.3, IS.who(R0.seed * 100 + Math.round(y * 3) + 1, { dir: 2, pose: 'sit', k: 0.92 }));
      }
      // the valance under the upper deck: scalloped cloth with the name, lamps hanging under it
      const vz0 = DZ - 2.0, vz1 = DZ - 0.8, q = [[X1 + 0.15, ya, vz1], [X1 + 0.15, yb, vz1]];
      for (let k = 0; k <= 10; k++) { const yy = lerp(yb, ya, k / 10); q.push([X1 + 0.15, yy, vz0 + (k % 2 ? 0.0 : 0.35)]); }
      g.fill(q, R0.val); g.outline(q, { w: 0.4, c: shade(R0.val, 0.5), boil: false });
      K.text(g, 'R', X1 + 0.18, yb - 0.5, vz0 + 0.42, 0.62, R0.name, '#F6F1E2', { w: 0.32 });
      for (let y = ya + 1.4; y < yb - 0.5; y += 2.7) { const a = g.p(X1 - 0.6, y, vz0), b = g.p(X1 - 0.6, y, vz0 - 1.0); g.line2([a, b], { w: 0.25, c: '#3A3530', boil: false, ext: 0 }); g.disc2(b, 0.75, '#F6D98A'); }
    }, { name: 'restaurant', bias: -40 });
  }
  // the west lower deck: its floor and the backs of its restaurants (mostly hidden)
  for (const [ya, yb] of [[-21.6, -10.6], [10.6, 21.6]]) T.obj([X0 - 0.2, ya, -8.4, yb], (g) => { K.box(g, X0 - 0.2, ya, -8.4, yb, -0.6, 0, { t: '#B79A74', l: '#9C8262', r: '#86704F' }, { w: 0.5 }); K.box(g, -9.4, ya, -8.4, yb, 0, DZ - 0.8, { t: '#E9E2D2', l: '#EFE9DC', r: '#E2D9C6' }, { w: 0.5 }); }, { name: 'west deck', bias: -40 });

  /* ---- the upper deck ---- */
  T.obj([X0, Y0, X1, Y1], function (g) {
    g.boilP = 0.25;
    // the girders: the east fascia (riveted steel), the south end
    g.fill(K.on('R', X1, Y0, Y1, DZ - 0.8, DZ), STEEL.r);
    g.fill(K.on('L', Y1, X0, X1, DZ - 0.8, DZ), STEEL.l);
    const rv = []; for (let y = Y0 + 0.8; y < Y1; y += 1.6) rv.push(g.p(X1 + 0.02, y, DZ - 0.4)); for (const p of rv) g.disc2(p, 0.28, '#5E6B76');
    g.line([[X1, Y0, DZ - 0.8], [X1, Y1, DZ - 0.8]], { w: 0.6, boil: false });
    // the surface
    g.fill(K.rect(X0, Y0, X1, Y1, DZ), IS.C.asph);
    g.fill(K.rect(X0, Y0, X0 + 2.6, Y1, DZ), IS.C.pave); g.fill(K.rect(X1 - 2.6, Y0, X1, Y1, DZ), IS.C.pave);
    g.fill(K.rect(-5, Y0, 5, Y1, DZ), '#C9C2B2');
    const r = []; for (const c of [-2.6, 2.6]) for (const d of [-1, 1]) { const a = g.p(c + d, Y0, DZ), b = g.p(c + d, Y1, DZ); r.push(a[0], a[1], b[0], b[1]); }
    g.segs2(r, '#7E776B', 0.5);
    for (let y = Y0 + 2; y < Y1 - 3; y += 9) for (const x of [-5.3, 5.3]) g.line([[x, y, DZ], [x, y + 4.2, DZ]], { c: '#F5F2EA', w: 0.9, boil: false, ext: 0.2 });
    for (const y of OP) g.line([[X0, y, DZ + 0.01], [X1, y, DZ + 0.01]], { w: 0.45, c: '#8C8576', boil: false });   // the opening span's joints
    g.line([[X0, Y1, DZ], [X1, Y1, DZ]], { w: 0.7, boil: false }); g.line([[X1, Y0, DZ], [X1, Y1, DZ]], { w: 0.9, boil: false }); g.line([[X0, Y0, DZ], [X0, Y1, DZ]], { w: 0.7, boil: false });
    // the far (west) rail and its lamp posts
    const ps = []; for (let y = Y0; y <= Y1 + 0.01; y += 1.0) { const a = g.p(X0 + 0.3, y, DZ), b = g.p(X0 + 0.3, y, DZ + 1.6); ps.push(a[0], a[1], b[0], b[1]); }
    g.segs2(ps, '#5E6B76', 0.35); g.line([[X0 + 0.3, Y0, DZ + 1.6], [X0 + 0.3, Y1, DZ + 1.6]], { w: 0.55, c: '#4A5560', boil: false });
    for (const y of [-18, -6, 6, 18]) IS.lamp(g, X0 + 0.3, y, { z: DZ, h: 9 });
  }, { name: 'galata bridge', under: DZ });
  // the near (east) rail in pieces, with lamp posts and the anglers' buckets
  for (let y = Y0; y < Y1 - 0.1; y += 5.5) {
    const ya = y, yb = Math.min(Y1, y + 5.5);
    T.obj([X1 - 0.5, ya, X1, yb], (g) => {
      const ps = []; for (let yy = ya; yy <= yb + 0.01; yy += 1.0) { const a = g.p(X1 - 0.25, yy, DZ), b = g.p(X1 - 0.25, yy, DZ + 1.6); ps.push(a[0], a[1], b[0], b[1]); }
      g.segs2(ps, '#5E6B76', 0.4); g.line([[X1 - 0.25, ya, DZ + 1.6], [X1 - 0.25, yb, DZ + 1.6]], { w: 0.7, c: '#4A5560', boil: false });
      if (Math.abs(((ya - Y0) / 5.5) % 2 - 1) < 0.01) IS.lamp(g, X1 - 0.25, ya + 2.75, { z: DZ, h: 9 });
    }, { on: true, name: 'rail' });
  }

  /* ---- the anglers: a wave of casts running down each rail ---- */
  const CYC = 9;
  // the state of a cast at time u (0..CYC): the rod's angle above horizontal and where the line ends
  const castAt = (u) => {
    if (u < 4.6) return { k: 'w' + (Math.floor(u * 1.2) % 2), th: 0.5 + (Math.floor(u * 1.2) % 2) * 0.04, line: 'down' };
    if (u < 5.8) { const f = Math.floor((u - 4.6) / 0.3); return { k: 'r' + f, th: 0.55 + f * 0.1, line: 'reel', f: f / 4 }; }
    if (u < 6.4) return { k: 'b', th: 1.95, line: 'short' };
    if (u < 6.9) return { k: 'c', th: 0.25, line: 'fly' };
    return { k: 's' + (u < 7.8 ? 0 : 1), th: 0.42, line: u < 7.8 ? 'land' : 'down' };
  };
  const anglers = [];
  for (let y = Y0 + 1.4, i = 0; y < Y1 - 0.5; y += 3.3, i++) anglers.push({ side: 1, x: X1 - 1.15, y, i, seed: 600 + i });
  for (let y = Y0 + 2.6, i = 0; y < Y1 - 0.5; y += 4.6, i++) anglers.push({ side: -1, x: X0 + 1.15, y, i, seed: 640 + i });
  anglers.forEach((A) => {
    const who = IS.who(A.seed, { fcap: h1(A.seed) < 0.6 ? ['#3B3F47', '#5A6B5A', '#C9584B', '#3F5F8F'][A.seed % 4] : undefined, scarf: undefined, dress: undefined, hairStyle: 'short', bare: false });
    const lag = A.i * 0.45 + (A.side < 0 ? 2.1 : 0), fishy = (n) => h2(A.seed, n) < 0.45;
    T.actor({ sample: 0.5, period: CYC * 4,
      at(t) {
        const u = (((t - lag) % CYC) + CYC) % CYC, n = Math.floor((t - lag) / CYC), s = castAt(u), fish = (s.line === 'reel' || s.line === 'short') && fishy(n);
        return { x: A.x, y: A.y, z: DZ, key: s.k + (fish ? 'f' : ''), cs: s, fish };
      },
      draw(g, st) {
        const sg = A.side, s = st.cs;
        // the bucket at the feet
        const bk = g.p(-sg * 0.2, 1.2, 0); g.fill2([[bk[0] - 1.1, bk[1]], [bk[0] + 1.1, bk[1]], [bk[0] + 1.4, bk[1] - 2.2], [bk[0] - 1.4, bk[1] - 2.2]], '#3F7FB8', true); g.fill2(arcPts(bk[0], bk[1] - 2.2, 1.4, 0, TAU, 10).map((q) => [q[0], bk[1] - 2.2 + (q[1] - bk[1] + 2.2) * 0.35]), '#2E5E8A', true);
        const r = IS.person(g, 0, 0, 0, Object.assign({}, who, { dir: sg > 0 ? 0 : 2, pose: 'hold' }));
        const hand = r.hands[0], Lr = 6.5, tipW = [sg * (0.8 + Lr * Math.cos(s.th)), 0, 3.3 + Lr * Math.sin(s.th)], tip = g.p(tipW[0], tipW[1], tipW[2]);
        g.line2([hand, tip], { w: 0.8, c: '#2E2418', boil: false, ext: 0 }); g.disc2(hand, 0.55, '#8C8576');
        const lo = { w: 0.22, c: '#5A564E' };
        const deep = sg > 0 ? WL - DZ : -1.2;             // west lines vanish behind the deck
        if (s.line === 'down' || s.line === 'land') { const e = g.p(tipW[0] + sg * 0.4, 0, deep); g.fine2([tip, e], lo); if (sg > 0) { g.disc2(g.p(tipW[0] + sg * 0.4, 0, WL - DZ + 0.05), 0.5, '#F6F3EA'); } }
        else if (s.line === 'reel') { const zz = lerp(WL - DZ, tipW[2] - 2.6, s.f), e = g.p(tipW[0] + sg * 0.2, 0, sg > 0 ? zz : Math.max(zz, deep)); g.fine2([tip, e], lo); if (st.fish && (sg > 0 || zz > deep)) IS.fish2(g, g.p(tipW[0] + sg * 0.2, 0, zz)); }
        else if (s.line === 'short') { const e = g.p(tipW[0] - sg * 0.6, 0, tipW[2] - 2.4); g.fine2([tip, e], lo); if (st.fish) IS.fish2(g, e); }
        else if (s.line === 'fly') { const pts = []; for (let k = 0; k <= 10; k++) { const f = k / 10; pts.push(g.p(tipW[0] + sg * f * 6, 0, tipW[2] + Math.sin(Math.PI * f) * 2.5 - f * 4)); } g.fine2(pts, lo); }
      } });
  });
  // cats waiting for a fish by the buckets
  IS.cat(T, X1 - 1.6, -12.2, DZ, { c: 0, pose: 'sit' });
  IS.cat(T, X1 - 1.7, 8.9, DZ, { c: 1, pose: 'loaf', fl: -1 });
  IS.cat(T, X0 + 1.7, -3.4, DZ, { c: 2, pose: 'sit', fl: -1 });
  // a simit seller and a tea seller walking the east footway, a couple crossing the west one
  IS.walker(T, IS.who(661, { tray: true, top: '#F3F1EA', bot: '#3B3F47', scarf: undefined }), [[X1 - 2.4, Y1 + 3], [X1 - 2.4, Y0 - 3]], 1.1, { z: (x, y) => IT.zAve(y - 50), phase: 0.3 });
  IS.walker(T, IS.who(662, { teatray: true, top: '#F3F1EA', bot: '#6E5A44', scarf: undefined }), [[X1 - 2.2, Y0 - 3], [X1 - 2.2, Y1 + 3]], 1.2, { z: (x, y) => IT.zAve(y - 50), phase: 0.7 });
  IS.walker(T, IS.who(663), [[X0 + 2.2, Y1 + 3], [X0 + 2.2, Y0 - 3]], 1.3, { z: (x, y) => IT.zAve(y - 50), phase: 0.5 });
  // waiters on the lower deck terraces, a tout with a menu
  for (const [ya, yb, s] of [[11.2, 21.2, 671], [-21.2, -11.2, 672]]) IS.walker(T, IS.who(s, { top: '#F3F1EA', bot: '#2F343B', tie: '#2F343B', scarf: undefined, dress: undefined, teatray: s === 671 }), [[X1 - 0.6, ya], [X1 - 0.6, yb]], 0.9, { phase: s === 671 ? 0.2 : 0.6 });
  T.cast([X1 - 0.5, 13.4], (g) => IS.person(g, X1 - 0.5, 13.4, 0, IS.who(673, { dir: 0, pose: 'wave', ph: 0.25, top: '#F3F1EA', bot: '#2F343B', scarf: undefined, dress: undefined })), {});
  // gulls over the bridge
  IS.gulls(T, 4, () => ({ x: 6, y: 0 }), { r: 12, z: 16, period: 30 });
});
/* a little silver fish hanging nose down (wide px point = the hook) */
IS.fish2 = function (g, p) { g.fill2([[p[0], p[1]], [p[0] + 0.7, p[1] + 1.2], [p[0] + 0.5, p[1] + 3.2], [p[0], p[1] + 3.6], [p[0] - 0.5, p[1] + 3.2], [p[0] - 0.7, p[1] + 1.2]], '#C9D3D9', true); g.fill2([[p[0] - 0.9, p[1] + 4.4], [p[0] + 0.9, p[1] + 4.4], [p[0], p[1] + 3.4]], '#9AA6AE', true); g.segs2([p[0] - 0.4, p[1] + 1.4, p[0] + 0.4, p[1] + 2.8], '#7E8A92', 0.3); };
