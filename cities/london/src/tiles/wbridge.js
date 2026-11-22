'use strict';
/* Westminster Bridge (x -63..-37 over the river y 30..70): five low segmental arches of cast iron painted green on
   granite piers with pointed cutwaters, a flat deck flush with the street, Gothic green balustrades on both edges and
   ornate lamp standards with three lanterns. Built as: the deck with its east face, arches and the far balustrade
   ({ under: 0 }: boats pass under, cars and walkers on it), then the near balustrade in two pieces so the traffic and
   the walkers on the near footway are drawn behind it. Tourists cross on the footways. */
SF.tile('wbridge', -50, 50, { order: 1.5, rim: 62, castAt: 140, shared: true, half: 22 }, function (T) {
  // tile-local: x -13..13 (world -63..-37), y -20..20 (world 30..70)
  const X0 = -13, X1 = 13, Y0 = -20, Y1 = 20, WL = LT.RIV.WL, GRN = '#4F7F5E', GRND = '#3B634A', GRNL = '#6E9C7A', STONE = '#CFC8B8';
  const ARCH = LT.WB.arches.map(([a, b]) => [a - 50, b - 50]);
  const crown = -0.7, spring = WL + 0.9;
  const archZ = (y, a, b) => { const m = (a + b) / 2, h = (b - a) / 2, t = (y - m) / h; return spring + (crown - spring) * Math.sqrt(Math.max(0, 1 - t * t)); };
  const balustrade = (g, x, ya, yb, near) => {
    const top = 1.45, segs = [];
    g.fill([[x, ya, 0], [x, yb, 0], [x, yb, 0.35], [x, ya, 0.35]], GRND);
    for (let y = ya + 0.35; y < yb; y += 0.7) { const a = g.p(x, y, 0.35), b = g.p(x, y, top - 0.15); segs.push(a[0], a[1], b[0], b[1]); }
    g.segs2(segs, near ? GRND : '#4A6E56', 0.5);
    g.line([[x, ya, top], [x, yb, top]], { w: near ? 0.8 : 0.6, c: '#2E4A38', boil: false });
    g.line([[x, ya, 0.35], [x, yb, 0.35]], { w: 0.45, c: '#2E4A38', boil: false });
  };
  const lampStd = (g, x, y, far) => {
    const b = g.p(x, y, 0), t = g.p(x, y, 8.6);
    g.fill2([[b[0] - 0.9, b[1]], [b[0] + 0.9, b[1]], [b[0] + 0.5, b[1] - 3], [b[0] - 0.5, b[1] - 3]], GRND);
    g.line2([[b[0], b[1] - 2.8], t], { w: 0.75, c: GRND, boil: false, ext: 0 });
    for (const [dx, dy] of [[-2.0, 1.0], [2.0, 1.0], [0, -0.6]]) { const c = [t[0] + dx, t[1] + dy]; g.fill2([[c[0] - 0.75, c[1]], [c[0] + 0.75, c[1]], [c[0] + 0.95, c[1] - 2.2], [c[0] - 0.95, c[1] - 2.2]], '#F2E3A6'); g.line2([[c[0] - 0.95, c[1] - 2.2], [c[0] + 0.95, c[1] - 2.2]], { w: 0.5, c: GRND, boil: false, ext: 0 }); }
    g.line2([[t[0] - 2.0, t[1] + 1.0], [t[0] + 2.0, t[1] + 1.0]], { w: 0.4, c: GRND, boil: false, ext: 0 });
    // at night its three lanterns are lit; the near ones lay their light on the river below the bridge (the far ones'
    // reflections fall on the water the bridge hides)
    if (far) LK.glowDry(g, 'lamp', x, y, 9.4, { r: 2.4 }); else g.glow2('lamp', [t[0], t[1] - 0.9], b, { r: 2.4 });
  };

  T.obj([X0, Y0, X1, Y1], function (g) {
    g.boilP = 0.3;
    // the deck: footways and the carriageway, the centre line and a bus lane carried across
    g.fill(K.rect(X0, Y0, X1, Y1, 0), '#D9D5CB');
    g.fill(K.rect(X0 + 2.6, Y0, X1 - 2.6, Y1, 0), LK.C.asph);
    LK.sheen(g, K.rect(X0 + 2.6, Y0, X1 - 2.6, Y1, 0), Math.atan2(AY, -AX));
    for (let y = Y0 + 2; y < Y1 - 3; y += 9) g.line([[0, y, 0], [0, y + 4.2, 0]], { c: '#F4F2EC', w: 0.95, boil: false, ext: 0.2 });
    for (const x of [X0 + 2.6, X1 - 2.6]) g.line([[x, Y0, 0], [x, Y1, 0]], { w: 0.5, c: '#9E9A90', boil: false });
    LK.puddle(g, X1 - 4.2, -6, 1.2, 2.2, 811);
    // the far balustrade and its lamps
    balustrade(g, X0 + 0.4, Y0, Y1, false);
    for (const y of [-14, 0, 14]) lampStd(g, X0 + 0.6, y, true);
    // the east face: piers with cutwaters, green arch ribs, spandrels, the cornice
    const F = X1;
    g.fill([[F, Y0, WL], [F, Y1, WL], [F, Y1, 0], [F, Y0, 0]], GRN);
    for (const [a, b] of ARCH) {
      const pts = []; for (let i = 0; i <= 14; i++) { const y = lerp(a, b, i / 14); pts.push([F + 0.02, y, archZ(y, a, b)]); }
      g.fill(pts.concat([[F + 0.02, b, WL], [F + 0.02, a, WL]]), '#5E7C7C');                 // the opening: shadowed water
      g.fill(pts.concat(pts.slice().reverse().map((p) => [p[0], p[1], Math.max(WL, p[2] - 1.0)])), '#48605F');
      g.line(pts, { w: 0.85, c: '#2E4A38', boil: false });
      const rib = pts.map((p) => [p[0] + 0.03, p[1], p[2] + 0.45]); g.line(rib, { w: 0.5, c: GRNL, boil: false });
      // spandrel ironwork: radial ribs from the arch to the deck
      const sp = []; for (let i = 1; i < 14; i += 2) { const y = lerp(a, b, i / 14), q0 = g.p(F + 0.04, y, archZ(y, a, b) + 0.5), q1 = g.p(F + 0.04, y, -0.6); sp.push(q0[0], q0[1], q1[0], q1[1]); } g.segs2(sp, GRND, 0.35);
    }
    // piers between the arches: granite with a cutwater pointing downstream (+x)
    const piers = [[Y0, ARCH[0][0]]]; for (let i = 0; i + 1 < ARCH.length; i++) piers.push([ARCH[i][1], ARCH[i + 1][0]]); piers.push([ARCH[ARCH.length - 1][1], Y1]);
    for (const [a, b] of piers) {
      if (b - a < 0.2) continue;
      const m = (a + b) / 2, h = (b - a) / 2;
      g.fill([[F, a, WL], [F, b, WL], [F, b, spring + 0.3], [F, a, spring + 0.3]], STONE);
      g.fill([[F, a, WL], [F + 1.3, m, WL], [F + 1.3, m, spring + 0.3], [F, a, spring + 0.3]], '#E2DCCD'); g.fill([[F + 1.3, m, WL], [F, b, WL], [F, b, spring + 0.3], [F + 1.3, m, spring + 0.3]], '#BDB5A3');
      g.fill([[F, a, spring + 0.3], [F + 1.3, m, spring + 0.3], [F, b, spring + 0.3]], '#D6CFBF');
      g.outline([[F, a, WL], [F + 1.3, m, WL], [F, b, WL]], { w: 0.5, boil: false }); g.line([[F + 1.3, m, WL], [F + 1.3, m, spring + 0.3]], { w: 0.55, boil: false });
      void h;
    }
    g.fill([[F, Y0, -0.7], [F, Y1, -0.7], [F, Y1, 0], [F, Y0, 0]], GRNL);
    g.line([[F, Y0, 0], [F, Y1, 0]], { w: 0.9, boil: false }); g.line([[F, Y0, -0.7], [F, Y1, -0.7]], { w: 0.5, c: '#2E4A38', boil: false });
    g.line([[X0, Y0, 0], [X1, Y0, 0]], { w: 0.6, boil: false });
  }, { name: 'westminster bridge', under: 0 });
  // the near balustrade in two pieces, with its lamps
  for (const [ya, yb] of [[Y0, 0], [0, Y1]]) T.obj([X1 - 0.6, ya, X1, yb], (g) => { balustrade(g, X1 - 0.3, ya, yb, true); for (const y of [-14, 0, 14]) if (y >= ya && y < yb) lampStd(g, X1 - 0.4, y); }, { on: true, name: 'balustrade' });

  // tourists crossing on the footways, one with an umbrella still up
  LK.walker(T, LK.tourist(5101), [[X1 - 1.3, Y0 - 1], [X1 - 1.3, Y1 + 1]], 1.5, { phase: 0.1 });
  LK.walker(T, LK.who(5102, { umb: '#26314F' }), [[X1 - 1.6, Y1 + 1], [X1 - 1.6, Y0 - 1]], 1.3, { phase: 0.6 });
  LK.walker(T, LK.who(5103), [[X0 + 1.4, Y1 + 1], [X0 + 1.4, Y0 - 1]], 1.6, { phase: 0.3 });
  LK.walker(T, LK.tourist(5104), [[X0 + 1.7, Y0 - 1], [X0 + 1.7, Y1 + 1]], 1.4, { phase: 0.8 });
  // a couple stopped at the near balustrade, photographing the Palace
  T.cast([X1 - 1.5, -4], (g) => { LK.person(g, X1 - 1.5, -4.5, 0, LK.tourist(5105, { dir: 2, pose: 'hold', phone: true })); LK.person(g, X1 - 1.4, -2.6, 0, LK.who(5106, { dir: 2 })); }, { on: true });
});
