'use strict';
/* The Manhattan grid: four one-way avenues (along y, north = +y) and four one-way cross streets (along x), running out
   past the map in stubs that end in a dry brush stroke, so the grid reads as going on forever.
   An avenue, kerb to kerb (26 u): a green protected bike lane behind a buffer of flexi-posts and planters, two travel
   lanes, a terracotta "BUS ONLY" lane at the right-hand kerb. A cross street: one travel lane between two lanes of parked cars.
   Ladder crosswalks on every arm, stop lines, manholes (some steaming), two orange-and-white Con Ed stacks in coned-off
   work zones, cobra-head lamps on the kerbs, and at every junction mast-arm signals (actors showing the lights of the
   plan in 37_traffic.js) on poles with green street-name blades. The traffic and the people waiting on the corners are
   all timetables from NYT. */
const NYS = { K: 13, END: 186, AV: [-150, -50, 50, 150], ST: [-150, -50, 50, 150] };
const NY_AVNAME = ['3 AV', '5 AV', '6 AV', '7 AV'], NY_STNAME = ['14 ST', '34 ST', '42 ST', '59 ST'];
const NY_MANHOLES = [[-48.5, 98], [-45, -8], [-48.5, -96], [51, 28], [46, -118], [-147, 22], [149, -32], [152, 112], [22, -49], [-80, 47], [112, -152], [-118, 148], [62, 152], [-30, -147]];
const NY_STACKS = [[-96, -39.5], [104, 60.5], [-120, 160.5]];

SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const S = NYS, H = S.K, E = S.END, ASPH = NYC.asph, LINE = '#F7F5EE';
  const inJ = (v, list) => list.some((c) => Math.abs(v - c) < H + 0.01);
  // words painted on the road: letters stretched along the lane (up = the way traffic drives), nearest word first
  const roadText = (g, cx, cy, ux, uy, words, h, col) => {
    const rx = -uy, ry = ux, k = 0.4;
    words.forEach((w, n) => { const z0 = -h * 0.5 + (n - (words.length - 1) / 2) * h * 1.35 * 1; NK.textP(g, (a, z) => [cx + rx * a * k + ux * z, cy + ry * a * k + uy * z, 0.02], 0, z0, h, w, col, { center: true, w: 0.5 }); });
  };
  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    g.boilP = 0.15;
    // the outer sidewalk ring beyond the outer kerbs
    const O0 = 163, O1 = 170, WALK = NYC.walk;
    for (const s of [-1, 1]) {
      g.fill(K.rect(-O1, s > 0 ? O0 : -O1, O1, s > 0 ? O1 : -O0), WALK); g.fill(K.rect(s > 0 ? O0 : -O1, -O1, s > 0 ? O1 : -O0, O1), WALK);
    }
    for (const X of S.AV) for (const s of [-1, 1]) g.fill(K.rect(X - H, s > 0 ? O0 - 0.5 : -E - 4, X + H, s > 0 ? E + 4 : -O0 + 0.5), ASPH);
    for (const Y of S.ST) for (const s of [-1, 1]) g.fill(K.rect(s > 0 ? O0 - 0.5 : -E - 4, Y - H, s > 0 ? E + 4 : -O0 + 0.5, Y + H), ASPH);
    // the grid inside
    for (const X of S.AV) g.fill(K.rect(X - H, -O0, X + H, O0), ASPH);
    for (const Y of S.ST) g.fill(K.rect(-O0, Y - H, O0, Y + H), ASPH);
    // outer kerb lines
    const kl = { w: 0.6, c: '#A9A296', boil: false };
    for (const s of [-1, 1]) {
      const edge = [];
      let prev = -O0;
      for (const c of S.AV.concat([O0 + H])) { const a = prev, b = c - H; if (b > a) edge.push([a, b]); prev = c + H; }
      for (const [a, b] of edge) { g.line([[a, s * O0, 0], [Math.min(b, O0), s * O0, 0]], kl); g.line([[s * O0, a, 0], [s * O0, Math.min(b, O0), 0]], kl); g.line([[a, s * O1, 0], [Math.min(b, O1), s * O1, 0]], kl); g.line([[s * O1, a, 0], [s * O1, Math.min(b, O1), 0]], kl); }
    }
    // the scuffed asphalt
    for (const X of S.AV) g.scuff(K.rect(X - H, -E, X + H, E), { dir: Math.atan2(AY, -AX), len: 9, c: '#DCD8CF', dens: 0.35, w: 0.55, spread: 0.05 });
    for (const Y of S.ST) g.scuff(K.rect(-E, Y - H, E, Y + H), { dir: Math.atan2(AY, AX), len: 9, c: '#DCD8CF', dens: 0.35, w: 0.55, spread: 0.05 });
    for (const X of S.AV) g.scuff(K.rect(X - H, -E, X + H, E), { dir: Math.atan2(AY, -AX), len: 6, c: NYC.asphD, dens: 0.1, w: 0.45, spread: 0.05 });
    // avenue paint: the bike lane (green) and its buffer, the bus lane (terracotta), lane lines, symbols
    const A = NYT.AVL;
    S.AV.forEach((X, i) => {
      const m = -NYT.AV[i].d, segs = [];
      const xb0 = X + m * (-12.7), xb1 = X + m * (-9.3), xbus0 = X + m * 7.4, xbus1 = X + m * 12.9;
      for (let k = 0; k <= S.ST.length; k++) {
        const y0 = k === 0 ? -E : S.ST[k - 1] + H + 1, y1 = k === S.ST.length ? E : S.ST[k] - H - 1;
        g.fill(K.rect(Math.min(xb0, xb1), y0, Math.max(xb0, xb1), y1), NYC.bike);
        { const q0 = X + m * (-9.2), q1 = X + m * (-4.8), hs = []; g.line([[q0, y0, 0], [q0, y1, 0]], { w: 0.5, c: LINE, boil: false }); g.line([[q1, y0, 0], [q1, y1, 0]], { w: 0.5, c: LINE, boil: false }); for (let y = y0 + 2; y < y1 - 3; y += 3.2) { const a = g.p(q0, y, 0), b = g.p(q1, y + 2.4, 0); hs.push(a[0], a[1], b[0], b[1]); } g.segs2(hs, LINE, 0.4); }
        g.fill(K.rect(Math.min(xbus0, xbus1), y0 + (k === 0 ? 0 : 10), Math.max(xbus0, xbus1), y1 - (k === S.ST.length ? 0 : 10)), NYC.bus);
                for (let y = y0 + 2; y < y1 - 3; y += 9) { const a = g.p(X + m * 1.4, y, 0), b = g.p(X + m * 1.4, y + 4.2, 0); segs.push(a[0], a[1], b[0], b[1]); }
        // "BUS ONLY" in each block, the letters tall along the lane, read by the drivers coming up behind
        if (y1 - y0 > 40) roadText(g, X + m * 10.25, (y0 + y1) / 2 + NYT.AV[i].d * 4, 0, NYT.AV[i].d, ['BUS', 'ONLY'], 3.4, LINE);
        // bike symbols in the bike lane
        for (const yy of [y0 + 12, y1 - 12]) if (y1 - y0 > 30) { const c = g.p(X + m * (-11), yy, 0); g.ring2([c[0] - 1.4, c[1] + 0.6], 1.0, { w: 0.4, c: LINE }); g.ring2([c[0] + 1.4, c[1] - 0.6], 1.0, { w: 0.4, c: LINE }); g.segs2([c[0] - 1.4, c[1] + 0.6, c[0] + 0.2, c[1] - 0.8, c[0] + 0.2, c[1] - 0.8, c[0] + 1.4, c[1] - 0.6], LINE, 0.4); }
      }
      g.segs2(segs, LINE, 0.75);
    });
    // cross-street lane dashes
    for (const Y of S.ST) for (const e of [-5.9, 5.9]) { const segs = []; for (let x = -E + 2; x < E - 4; x += 12.4) { if (Math.abs(Math.abs(x) - 50) < 22 || Math.abs(Math.abs(x) - 150) < 22) continue; const a = g.p(x, Y + e, 0), b = g.p(x, Y + e + Math.sign(e) * 1.4, 0); segs.push(a[0], a[1], b[0], b[1]); } g.segs2(segs, LINE, 0.5); }
    // ladder crosswalks on the four arms of every junction, and the stop lines
    for (const X of S.AV) for (const Y of S.ST) for (const s of [-1, 1]) {
      for (let k = -H + 1.1; k <= H - 1; k += 2.2) {
        g.fill(K.rect(X + k - 0.65, Math.min(Y + s * 14.2, Y + s * 19.6), X + k + 0.65, Math.max(Y + s * 14.2, Y + s * 19.6)), LINE);
        g.fill(K.rect(Math.min(X + s * 14.2, X + s * 19.6), Y + k - 0.65, Math.max(X + s * 14.2, X + s * 19.6), Y + k + 0.65), LINE);
      }
    }
    NYT.AV.forEach((A2, i) => S.ST.forEach((Y) => { const y = Y - A2.d * 21.2; g.line([[A2.x - H + 0.4, y, 0], [A2.x + H - 0.4, y, 0]], { c: LINE, w: 1.0, boil: false }); }));
    NYT.ST.forEach((S2) => S.AV.forEach((X) => { const x = X - S2.d * 21.2; g.line([[x, S2.y - H + 0.4, 0], [x, S2.y + H - 0.4, 0]], { c: LINE, w: 1.0, boil: false }); }));
    // manhole covers
    for (const [x, y] of NY_MANHOLES) { const p = g.P(K.arc(x, y, 0, 1.3, 0, TAU, 12)); g.fill2(p, '#9A958B'); g.outline2(p, { w: 0.35, c: '#6E6A62', boil: false }); }
    // the stub ends: a ragged dry-brush edge
    for (const s of [-1, 1]) for (const c of S.AV) {
      for (const ay of [true, false]) {
        const e = s * E, R = RNG(Math.round(c * 7 + s * 3 + (ay ? 1 : 2))), pts = [];
        for (let k = 0; k <= 8; k++) { const t = -H + 2 * H * k / 8, j = (R() - 0.5) * 3; pts.push(ay ? [c + t, e + s * (2 + j), 0] : [e + s * (2 + j), c + t, 0]); }
        g.fill(pts.concat(ay ? [[c + H, e - s * 0.5, 0], [c - H, e - s * 0.5, 0]] : [[e - s * 0.5, c + H, 0], [e - s * 0.5, c - H, 0]]), ASPH);
      }
    }
  });

  /* ---------------- parked cars, work zones, lamps ---------------- */
  // parked cars on both sides of the cross streets, kept clear of junctions
  const R = RNG(4242), PCOL = ['#2F3238', '#C9CCCC', '#8FA3B5', '#F1EFE8', '#6C2E2E', '#3F5F8F', '#B9A27D', '#4A5A48', '#2F3238'];
  const okAlong = (v, list) => list.every((c) => Math.abs(v - c) > 27);
  // the avenue's planted buffer between the bike lane and the traffic: flexi-posts and a planter now and then
  NYT.AV.forEach((A2, i) => {
    const xb = A2.x + (-A2.d) * NYT.AVL.buf;
    for (let y = -176; y < 176; y += 16) {
      if (!okAlong(y, NYS.ST) || Math.abs(y) > 172) continue;
      const kk = Math.round(y / 16 + i * 3);
      if (kk % 3 === 0) T.obj([xb, y], (g) => { K.box(g, xb - 1.0, y - 2.4, xb + 1.0, y + 2.4, 0, 1.4, { t: '#B9A487', l: '#A8936F', r: '#8E7B5C' }, { w: 0.45, boil: false }); for (const dy of [-1.4, 0, 1.4]) K.bush(g, xb, y + dy, { r: 0.9, z: 1.4, col: kk % 2 ? '#8DB868' : '#B5CF8E' }); }, { name: 'planter' });
      else { T.obj([xb, y], (g) => { for (const dy of [-4, 0, 4]) { const a = g.p(xb, y + dy, 0), b = g.p(xb, y + dy, 2.2); g.fill2([[a[0] - 0.35, a[1]], [a[0] + 0.35, a[1]], [b[0] + 0.35, b[1]], [b[0] - 0.35, b[1]]], '#F6F3EA', true); g.fill2([[b[0] - 0.35, b[1] + 0.9], [b[0] + 0.35, b[1] + 0.9], [b[0] + 0.35, b[1] + 1.4], [b[0] - 0.35, b[1] + 1.4]], '#C9463E', true); } }, { name: 'posts' }); }
    }
  });
  NYT.ST.forEach((S2, j) => {
    for (const side of [-1, 1]) {
      const yp = S2.y + side * 9.0;
      for (let x = -158; x < 158; x += 12.4) {
        if (!okAlong(x, NYS.AV) || R() < 0.42) continue;
        if (NY_STACKS.some(([sx, sy]) => Math.abs(sx - x) < 9 && Math.abs(sy - yp) < 4)) continue;
        const col = R.pick(PCOL), ang = S2.d > 0 ? 0 : Math.PI;
        T.obj([x, yp], (g) => g.at(x, yp, 0, (g2) => K.car(g2, ang, { col })), { name: 'parked' });
      }
    }
  });
  // Con Ed work zones: the striped stack, a ring of cones, a barrel
  for (const [x, y] of NY_STACKS) {
    T.obj([x, y], (g) => {
      for (let k = 0; k < 8; k++) { const a = TAU * k / 8, c = g.p(x + Math.cos(a) * 3.2, y + Math.sin(a) * 2.2, 0); if (Math.sin(a) < -0.3) g.fill2([[c[0] - 0.7, c[1]], [c[0] + 0.7, c[1]], [c[0], c[1] - 2.4]], '#E8742C', true); }
      NK.stack(g, x, y);
      for (let k = 0; k < 8; k++) { const a = TAU * k / 8, c = g.p(x + Math.cos(a) * 3.2, y + Math.sin(a) * 2.2, 0); if (Math.sin(a) >= -0.3) { g.fill2([[c[0] - 0.7, c[1]], [c[0] + 0.7, c[1]], [c[0], c[1] - 2.4]], '#E8742C', true); g.fill2([[c[0] - 0.45, c[1] - 0.9], [c[0] + 0.45, c[1] - 0.9], [c[0] + 0.3, c[1] - 1.4], [c[0] - 0.3, c[1] - 1.4]], '#F6F2E8', true); } }
    }, { name: 'stack' });
    NK.steamActor(T, x, y, { z: 9.4, H: 15, n: 5, w: 1.6, drift: 5, per: 2.2, cast: false });
  }
  // steaming manholes
  NY_MANHOLES.forEach(([x, y], k) => { if (k % 3 === 0) NK.steamActor(T, x, y, { z: 0.2, H: 9, n: 4, w: 1.5, drift: 3, per: 2.8, phase: k * 0.37, cast: false }); });
  // cobra-head lamps on the near kerb of each street, arms over the road
  for (const X of NYS.AV) for (let y = -160; y <= 160; y += 34) { if (!okAlong(y, NYS.ST)) continue; T.obj([X + 13.3, y], (g) => NK.lamp(g, X + 13.3, y, -1, 0, { L: 5 }), { name: 'lamp' }); }
  for (const Y of NYS.ST) for (let x = -160; x <= 160; x += 34) { if (!okAlong(x, NYS.AV)) continue; T.obj([x, Y + 13.3], (g) => NK.lamp(g, x, Y + 13.3, 0, -1, { L: 5 }), { name: 'lamp' }); }

  /* ---------------- signals ---------------- */
  // a pole with a mast arm along (dx, dy) of length L at height h, a street-name blade on top
  const pole = (g, x, y, arms, names) => {
    const f = g.p(x, y, 0), t = g.p(x, y, 11.2);
    g.fill2([[f[0] - 1.0, f[1]], [f[0] + 1.0, f[1]], [f[0] + 0.8, f[1] - 1.6], [f[0] - 0.8, f[1] - 1.6]], '#4A4744');
    g.fill2([[f[0] - 0.55, f[1] - 1.5], [f[0] + 0.55, f[1] - 1.5], [t[0] + 0.4, t[1]], [t[0] - 0.4, t[1]]], '#5A5650');
    for (const [dx, dy, L] of arms) { const a = g.p(x, y, 10.6), b = g.p(x + dx * L, y + dy * L, 10.6), c = g.p(x, y, 8.6); g.line2([a, b], { w: 0.75, c: '#4A4744', boil: false, ext: 0 }); g.line2([c, g.p(x + dx * L * 0.35, y + dy * L * 0.35, 10.6)], { w: 0.45, c: '#4A4744', boil: false, ext: 0 }); }
    names.forEach(([word, ax], k) => {
      const z = 11.4 + k * 1.15, L = 2.6, P = ax === 'x' ? (s, zz) => [x + s, y + 0.05, zz] : (s, zz) => [x + 0.05, y - s, zz];
      g.fill([P(-L, z), P(L, z), P(L, z + 1.0), P(-L, z + 1.0)], '#2E7D4F'); NK.textP(g, P, 0, z + 0.22, 0.56, word, '#F6F3EA', { center: true, w: 0.3 });
    });
  };
  NYT.AV.forEach((A2, i) => NYT.ST.forEach((S2, j) => {
    const X = A2.x, Y = S2.y, c = 12.4;
    // avenue: far-side arm over the travel lanes; southbound heads face us (+y), northbound show their backs
    const ay = A2.d < 0 ? Y - c : Y + c, axp = X + c;
    // cross street: eastbound heads face us (+x) on the far side; westbound show their backs
    const cx = S2.d < 0 ? X - c : X + c, cyp = Y + c;
    const nearPole = A2.d > 0 || S2.d > 0;
    if (A2.d < 0) T.obj([axp, ay], (g) => pole(g, axp, ay, [[-1, 0, 19]], [[NY_AVNAME[i], 'x'], [NY_STNAME[j], 'y']]), { name: 'signal' });
    if (S2.d < 0) T.obj([cx, cyp], (g) => pole(g, cx, cyp, [[0, -1, 19]], A2.d < 0 ? [] : [[NY_AVNAME[i], 'x'], [NY_STNAME[j], 'y']]), { name: 'signal' });
    if (nearPole) T.obj([X + c, Y + c], (g) => pole(g, X + c, Y + c, (A2.d > 0 ? [[-1, 0, 19]] : []).concat(S2.d > 0 ? [[0, -1, 19]] : []), A2.d < 0 || S2.d < 0 ? [] : [[NY_AVNAME[i], 'x'], [NY_STNAME[j], 'y']]), { name: 'signal' });
    // the heads: one actor per approach, keyed by its light
    const head = (g, st, face, lamps) => {
      for (const [hx, hy] of lamps) {
        const top = g.p(hx, hy, 10.4), w = 2.3, h = 11, x0 = top[0] - w, y0 = top[1] + 0.4;
        g.fill2([[top[0] - 0.15, top[1]], [top[0] + 0.15, top[1]], [top[0] + 0.15, y0], [top[0] - 0.15, y0]], '#3A3632', true);
        const box = [[x0, y0], [x0 + 2 * w, y0], [x0 + 2 * w, y0 + h], [x0, y0 + h]];
        if (face) {
          g.fill2([[x0 - 1.1, y0 - 0.7], [x0 + 2 * w + 1.1, y0 - 0.7], [x0 + 2 * w + 1.1, y0 + h + 0.7], [x0 - 1.1, y0 + h + 0.7]], '#2A2622', true);
          g.fill2(box, '#4A4540', true);
          [['#E0503E', 'R'], ['#F0B43C', 'A'], ['#62C47E', 'G']].forEach(([col, k], q) => g.disc2([x0 + w, y0 + 1.9 + q * 3.6], 1.45, st.l === k ? col : '#5E5850'));
          const lit = st.l === 'R' ? 0 : st.l === 'A' ? 1 : 2; g.disc2([x0 + w, y0 + 1.9 + lit * 3.6], 2.5, st.l === 'R' ? 'rgba(224,80,62,0.3)' : st.l === 'A' ? 'rgba(240,180,60,0.3)' : 'rgba(98,196,126,0.3)');
        } else {
          g.fill2(box, '#3A3632', true);
          const lit = st.l === 'R' ? 0 : st.l === 'A' ? 1 : 2; g.fill2([[x0 + 2 * w - 0.3, y0 + 0.5 + lit * 3.6], [x0 + 2 * w + 0.9, y0 + 0.7 + lit * 3.6], [x0 + 2 * w + 0.9, y0 + 3.1 + lit * 3.6], [x0 + 2 * w - 0.3, y0 + 3.3 + lit * 3.6]], st.l === 'R' ? '#E0503E' : st.l === 'A' ? '#F0B43C' : '#62C47E', true);
        }
      }
    };
    const aLamps = [[X + (-A2.d) * NYT.AVL.t1, A2.d < 0 ? Y - c : Y + c], [X + (-A2.d) * NYT.AVL.t2 * 0.9, A2.d < 0 ? Y - c : Y + c]];
    const cLamps = [[S2.d < 0 ? X - c : X + c, Y + 3.3], [S2.d < 0 ? X - c : X + c, Y - 3.3]];
    T.actor({ sample: 5, period: 10, grow: false, cast: false,
      at(t) { const l = NYT.light(i, j, 'ave', t); return { x: X, y: A2.d < 0 ? Y - c : Y + c, z: 0, key: 'a' + l, l }; },
      draw(g, st) { const yy = A2.d < 0 ? Y - c : Y + c; head(g, st, A2.d < 0, aLamps.map(([hx, hy]) => [hx - X, hy - yy])); } });
    T.actor({ sample: 5, period: 10, grow: false, cast: false,
      at(t) { const l = NYT.light(i, j, 'crs', t); return { x: S2.d < 0 ? X - c : X + c, y: Y, z: 0, key: 'c' + l, l }; },
      draw(g, st) { const xx = S2.d < 0 ? X - c : X + c; head(g, st, S2.d < 0, cLamps.map(([hx, hy]) => [hx - xx, hy - Y])); } });
  }));

  /* ---------------- the traffic ---------------- */
  const CABCOL = ['#2F3238', '#C9CCCC', '#8FA3B5', '#F1EFE8', '#3F5F8F', '#6C2E2E'];
  // side-by-side vehicles: an actor sorts by x + y, so a car in the far lane that is a little ahead would be painted over
  // the car beside it in the near lane. A small bias per lane (ranked across the street) keeps lanes in order.
  const laneBias = new Map();
  for (const L of NYT.LANES) {
    if (L.kind === 'bike') { laneBias.set(L, 0); continue; }
    const sib = NYT.LANES.filter((M2) => M2.axis === L.axis && M2.kind !== 'bike' && (L.axis === 'y' ? M2.ai === L.ai : M2.sj === L.sj)).map((M2) => M2.c).sort((p, q) => p - q);
    const r = sib.indexOf(L.c), n = sib.length;
    laneBias.set(L, n === 1 ? 0 : (r / (n - 1) - 0.5) * (n === 2 ? 8 : 11));
  }
  NYT.tracks.forEach((tr, ti) => {
    const M = NYT.copies(tr), col = CABCOL[ti % CABCOL.length], who = NK.who(7000 + ti, { cap: undefined }), box = ['#2FA58F', '#C9463E', '#E8742C', '#2F6DB5'][ti % 4];
    for (let m = 0; m < M; m++) T.actor({ cast: false, sample: 0.25, period: NYT.PER * M, grow: false, bias: laneBias.get(tr.lane),
      // anchored at the vehicle's far end (smallest x or y), drawn half a length on: a car whose far end is behind a
      // building is ordered behind it, like the car beside it, so two cars side by side are never split by a sprite
      at(t) { const p = NYT.at(tr, m, t); if (!p) return null; const ax = tr.lane.axis === 'x'; return { x: ax ? p.x - p.len / 2 : p.x, y: ax ? p.y : p.y - p.len / 2, key: 'h' + Math.round(p.ang * 100), ang: p.ang, ox: ax ? p.len / 2 : 0, oy: ax ? 0 : p.len / 2, alpha: p.alpha < 1 ? p.alpha : null }; },
      draw(g, st) { g.at(st.ox, st.oy, 0, (g2) => this.draw0(g2, st)); },
      draw0(g, st) {
        const k = tr.type, a = st.ang;
        if (k === 'cab') NK.cab(g, a); else if (k === 'cabv') NK.cab(g, a, { van: true }); else if (k === 'black') NK.blackcar(g, a);
        else if (k === 'bus') NK.bus(g, a); else if (k === 'truck') NK.truck(g, a, { stripe: ['#C9463E', '#2F6DB5', '#3E8E5A'][ti % 3] }); else if (k === 'fire') NK.fire(g, a);
        else if (k === 'bike') NK.deliBike(g, a, { who, box }); else K.car(g, a, { col });
      } });
  });
});

/* the people waiting on the corners and crossing with the walk signal. Each place registers the people of the junctions
   it owns (the junctions on its far side, and the map's edge ones next to it), so they pop in with that place. */
NK.CORNER_LOOKS = null;
NK.corners = function (T) {
  if (!NK.CORNER_LOOKS) { NK.CORNER_LOOKS = []; for (let i = 0; i < 30; i++) NK.CORNER_LOOKS.push(i % 7 === 2 ? NK.suit(800 + i) : i % 9 === 4 ? NK.tourist(800 + i) : i % 11 === 6 ? NK.who(800 + i, { phone: true }) : i % 13 === 8 ? NK.who(800 + i, { coffee: true }) : NK.who(800 + i)); }
  const own = (v, c) => clamp(v - 50, -100, 100) === c;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    if (!own(NYT.AV[i].x, T.cx) || !own(NYT.ST[j].y, T.cy)) continue;
    for (let k = 0; k < NYT.pedN(i, j); k++) {
      const look = NK.CORNER_LOOKS[(i * 31 + j * 7 + k * 3) % NK.CORNER_LOOKS.length];
      T.actor({ sample: 0.5, period: NYT.CYC * 2,
        at(t) { const p = NYT.ped(i, j, k, t); return { x: p.x - T.cx, y: p.y - T.cy, key: (p.walk ? 'w' + p.dir + '.' + p.ph : 's' + p.dir), dir: p.dir, walk: p.walk, ph: p.ph / 8 }; },
        draw(g, st) { NK.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.walk ? 'walk' : (look.phone ? 'hold' : 'stand'), ph: st.ph || 0 })); } });
    }
  }
};
