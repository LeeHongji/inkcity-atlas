'use strict';
/* (-100,100) Choi Hung Estate, 彩虹邨 ("rainbow village"), the public housing of the 1960s in Kowloon (here moved to the
   harbour's edge; land from local y -24).
   What it is: long slab blocks with open access corridors, their faces painted in the rainbow (red, orange, yellow,
   green, blue, violet, a band to each section), stair towers at the ends, air-conditioners and laundry poles; in
   front, the famous basketball court with the low rainbow-striped wall behind it; a sitting-out pavilion; a small
   wet-market block; the estate's name board 彩虹邨 CHOI HUNG ESTATE.
   Who: a pickup game of basketball (a shot arcs up every few seconds, the ball bounces), kids racing round the court,
   four aunties at mahjong in the pavilion, elders doing their evening stretches, someone posing in front of the
   rainbow wall for a photo, a delivery rider. */
SF.tile('choihung', -100, 100, { rim: 24 }, function (T) {
  const H = 37, Y0 = HT.HAR.K - 100;
  const RAIN = ['#E2574C', '#EF8A3C', '#F2C84B', '#7DBB62', '#4E8FCB', '#8E6CC0'];
  T.ground(function (g) {
    HK.ground(g, -H, Y0, H, H, HK.C.pave, { cut: 'y' });
    HK.paving(g, -H, Y0, H, H, { step: 2.4 });
    // the basketball court
    g.fill(K.rect(-17, 1, 15, 19), '#C9634E'); g.fill(K.rect(-15.6, 2.4, 13.6, 17.6), '#D9785E');
    const L = { c: '#F6F1E6', w: 0.55, boil: false };
    g.outline(K.rect(-15.6, 2.4, 13.6, 17.6, 0.01), L); g.line([[-1, 2.4, 0.01], [-1, 17.6, 0.01]], L);
    g.line(K.arc(-1, 10, 0.01, 2.6, 0, TAU, 20), L);
    for (const s of [-1, 1]) { const x0 = s < 0 ? -15.6 : 13.6, x1 = x0 - s * 5; g.outline([[x0, 7.6, 0.01], [x1, 7.6, 0.01], [x1, 12.4, 0.01], [x0, 12.4, 0.01]], L); g.line(K.arc(x0, 10, 0.01, 6.8, s < 0 ? -1.2 : Math.PI - 1.2 + 0, s < 0 ? 1.2 : Math.PI + 1.2, 16), L); }
    g.fill(K.rect(-H, Y0, H, Y0 + 4), '#E9E3D4');
  }, { rim: true });

  /* ---- the slab blocks, painted in rainbow sections ---- */
  const slab = (x0, x1, y0, y1, h, i0) => T.obj([x0, y0, x1, y1], (g) => {
    g.boilP = 0.2;
    K.box(g, x0, y0, x1, y1, 0, h, { t: '#E3DED3', l: '#ECE7DB', r: '#D2CCBF' }, { w: 0.85 });
    // rainbow sections on the long face, the end face in one colour
    const n = 6, w = (x1 - x0) / n;
    for (let k = 0; k < n; k++) g.fill(K.on('L', y1 + 0.02, x0 + k * w, x0 + (k + 1) * w, 2.4, h - 0.6), RAIN[(k + i0) % 6]);
    g.fill(K.on('R', x1 + 0.02, y0, y1, 2.4, h - 0.6), shade(RAIN[(i0 + 5) % 6], 0.1));
    // the access corridors: a pale rail line and a dark gap at each floor, doors and windows in rhythm
    const s = [], d = [];
    for (let z = 2.4; z < h - 1; z += 2.2) {
      const a = g.p(x0, y1 + 0.04, z + 0.15), b = g.p(x1, y1 + 0.04, z + 0.15); s.push(a[0], a[1], b[0], b[1]);
      const c = g.p(x0, y1 + 0.04, z + 0.9), e = g.p(x1, y1 + 0.04, z + 0.9); s.push(c[0], c[1], e[0], e[1]);
      for (let x = x0 + 0.8; x < x1 - 0.5; x += 1.5) { const q0 = g.p(x, y1 + 0.05, z + 1.05), q1 = g.p(x, y1 + 0.05, z + 1.95); d.push(q0[0], q0[1], q1[0], q1[1]); }
      for (let y = y0 + 0.8; y < y1 - 0.5; y += 1.6) { const q0 = g.p(x1 + 0.05, y, z + 1.0), q1 = g.p(x1 + 0.05, y, z + 1.9); d.push(q0[0], q0[1], q1[0], q1[1]); }
    }
    g.segs2(s, '#F6F3EA', 0.45); HK.nite(g, g.cmds.length - 1, { nc: '#E4F0FF' }); g.segs2(d, '#5A6470', 0.9);   // at night the access corridors are lit cool white
    // laundry on poles from some windows
    const R = RNG(x0 * 3 + 7); for (let k = 0; k < 9; k++) { const x = lerp(x0 + 1, x1 - 2, R()), z = 4 + R() * (h - 8), q0 = g.p(x, y1 + 0.05, z), q1 = g.p(x + 0.6, y1 + 2.0, z); g.fine2([q0, q1], { w: 0.22, c: '#6E675C' }); for (let i = 0; i < 3; i++) { const m = [lerp(q0[0], q1[0], (i + 0.6) / 3.2), lerp(q0[1], q1[1], (i + 0.6) / 3.2)]; g.fill2([[m[0] - 0.4, m[1]], [m[0] + 0.4, m[1]], [m[0] + 0.4, m[1] + 1.5], [m[0] - 0.4, m[1] + 1.5]], ['#F3F1EA', '#E06A8A', '#5F8FC9', '#E6C24F'][(i + k) % 4], true); } }
    // the stair tower at the near end, the roof tanks
    K.box(g, x1 - 2.4, y1, x1, y1 + 2.0, 0, h + 1.6, { t: '#DAD4C6', l: '#E6E1D5', r: '#CFC9BC' }, { w: 0.6 });
    for (let x = x0 + 4; x < x1 - 4; x += 10) K.box(g, x, (y0 + y1) / 2 - 1, x + 2.6, (y0 + y1) / 2 + 1, h, h + 1.6, { t: '#CFD6D9', l: '#B9C3C7', r: '#A5AFB4' }, { w: 0.4, boil: false });
    // at night lamps over the ground-floor lobbies light the court and the paths
    for (let x = x0 + 4; x < x1 - 4; x += 8) g.glow('lamp', x, y1 + 0.3, 2.1, { r: 1.0 });
    // at night most windows are lit too (invisible by day; drawn last, clear of the stair tower)
    for (let z = 2.4; z + 1.95 < h - 0.4; z += 2.2) {
      for (let x = x0 + 0.8; x < x1 - 2.9; x += 1.5) { g.fill(K.on('L', y1 + 0.06, x - 0.36, x + 0.36, z + 1.05, z + 1.95), HK.NONE); g.mark({ win: 0.64 }); }
      for (let y = y0 + 0.8; y < y1 - 0.5; y += 1.6) { g.fill(K.on('R', x1 + 0.06, y - 0.36, y + 0.36, z + 1.0, z + 1.9), HK.NONE); g.mark({ win: 0.6 }); }
    }
  }, { name: 'estate block' });
  slab(-35, -3, -21, -13, 28, 0);
  slab(3, 35, -23, -15, 23, 2);
  T.obj([-35, -12.6, -21, -11.4], (g) => HK.board(g, 'L', -11.4, -34.4, -21.6, 2.6, 5.6, '#F3F1EA', '彩虹邨', { c: '#8E6CC0', en: 'CHOI HUNG ESTATE', ink: '#3A3128' }), { name: 'estate sign' });

  /* ---- the rainbow wall behind the court ---- */
  T.obj([-17, -1.4, 15, -0.2], (g) => {
    const n = 12, w = 32 / n;
    for (let k = 0; k < n; k++) g.fill(K.on('L', -0.2, -17 + k * w, -17 + (k + 1) * w, 0, 3.0), RAIN[k % 6]);
    K.box(g, -17, -1.4, 15, -0.2, 3.0, 3.3, { t: '#F3F1EA', l: '#ECE7DB', r: '#D2CCBF' }, { w: 0.45, boil: false });
    g.outline(K.on('L', -0.2, -17, 15, 0, 3.0), { w: 0.6, boil: false });
  }, { name: 'rainbow wall' });
  // the hoops
  for (const [x, s] of [[-16.4, 1], [14.4, -1]]) T.obj([x, 10], (g) => { const b = g.p(x, 10, 0), t = g.p(x, 10, 7.6); g.line2([b, t], { w: 0.8, c: '#3F4A55', boil: false, ext: 0 }); const bd = [g.p(x + s * 0.6, 8.8, 7.0), g.p(x + s * 0.6, 11.2, 7.0), g.p(x + s * 0.6, 11.2, 9.0), g.p(x + s * 0.6, 8.8, 9.0)]; g.fill2(bd, '#F6F3EA', true); g.outline2(bd, { w: 0.4, boil: false }); const r = []; for (let i = 0; i <= 12; i++) { const a = TAU * i / 12; r.push(g.p(x + s * (1.4 + Math.cos(a) * 0.8), 10 + Math.sin(a) * 0.8, 7.4)); } g.line2(r, { w: 0.45, c: '#E2572B', boil: false, ext: 0 }); g.fine2([r[0], [r[0][0], r[0][1] + 2]], { w: 0.2, c: '#F6F3EA' }); }, { name: 'hoop' });

  /* ---- the pickup game: players moving, a shot every 6 s ---- */
  const P = 6, HOOP = [13.0, 10, 7.4];
  const players = [[[-6, 6], [4, 13], [8, 7]], [[-2, 14], [6, 5], [10, 12]], [[2, 9], [9, 9], [5, 14]], [[-9, 11], [0, 6], [6, 11]]];
  players.forEach((pts, i) => {
    const look = HK.who(9500 + i, { top: i % 2 ? '#F3F1EA' : '#C8372D', jacket: undefined, scarf: undefined, bare: true, shorts: true, bot: i % 2 ? '#3B3F47' : '#C8372D' });
    T.actor({ sample: 0.3, period: 3 * P,
      at(t) { const u = HT.mod(t + i * 0.7, 3 * P) / P, k = Math.floor(u), f = u - k, a = pts[k], b = pts[(k + 1) % 3], s = (1 - Math.cos(Math.PI * Math.min(1, f * 1.4))) / 2, x = lerp(a[0], b[0], s), y = lerp(a[1], b[1], s), dx = b[0] - a[0], dy = b[1] - a[1], moving = f * 1.4 < 1;
        const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = Math.floor(t * 6) % 8;
        return moving ? { x, y, key: 'r' + dir + '.' + ph, dir, pose: 'walk', ph: ph / 8 } : { x, y, key: 'c' + (i % 2), dir: 0, pose: 'crouch' }; },
      draw(g, st) { HK.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.pose, ph: st.ph || 0, sway: 0.3 })); } });
  });
  // the shooter: dribbles, jumps and shoots; the ball arcs to the hoop and bounces out
  T.actor({ sample: 0.2, period: P,
    at(t) { const u = HT.mod(t, P), jump = u > 2.2 && u < 3.0 ? Math.sin(Math.PI * (u - 2.2) / 0.8) * 1.4 : 0, f = Math.floor(t * 6) % 4; return { x: 4, y: 9.4, z: jump, key: u > 2.2 && u < 3.0 ? 'j' : 'd' + f, shoot: u > 2.2 && u < 3.0, f }; },
    draw(g, st) { HK.person(g, 0, 0, 0, HK.who(9510, { dir: 0, top: '#3F5F8F', bare: true, shorts: true, bot: '#3F5F8F', jacket: undefined, scarf: undefined, pose: st.shoot ? 'cheer' : 'hold', ph: 0.2, reach: st.shoot ? undefined : [3, -5 + (st.f % 2) * 2] })); } });
  T.actor({ sample: 0.1, period: P, layer: 'top', grow: false,
    at(t) { const u = HT.mod(t, P); let x, y, z;
      if (u < 2.4) { x = 5.0; y = 9.6; z = 0.4 + Math.abs(Math.sin(u * Math.PI * 2.2)) * 2.2; }
      else if (u < 3.6) { const s = (u - 2.4) / 1.2; x = lerp(5.0, HOOP[0], s); y = lerp(9.6, HOOP[1], s); z = lerp(7.2, HOOP[2] + 0.4, s) + Math.sin(Math.PI * s) * 4.4; }
      else { const s = (u - 3.6) / 2.4; x = lerp(HOOP[0], 5.0, s); y = lerp(HOOP[1], 9.6, s); z = Math.abs(Math.cos(s * Math.PI * 2.5)) * (HOOP[2] + 0.4) * (1 - s) + 0.4; }
      return { x, y, z, key: 'b' }; },
    draw(g) { const c = g.p(0, 0, 0); g.disc2(c, 1.25, '#E2572B'); g.ring2(c, 1.25, { w: 0.3, c: '#5A2A1E' }); g.segs2([c[0] - 1.2, c[1], c[0] + 1.2, c[1]], '#5A2A1E', 0.2); } });
  // kids racing round the court, a girl posing at the rainbow wall, her friend photographing
  HK.walker(T, HK.who(9520, { k: 0.72, cap: '#E6C24F' }), [[-18, 0], [16, 0], [16, 20], [-18, 20]], 2.2, { loop: true, phase: 0.1 });
  HK.walker(T, HK.who(9521, { k: 0.7 }), [[-18, 0], [16, 0], [16, 20], [-18, 20]], 2.2, { loop: true, phase: 0.18 });
  HK.stand(T, -10, 0.6, HK.who(9522, { dir: 1, pose: 'wave', ph: 0.3, hairStyle: 'long', top: '#F3F1EA' }), { name: 'posing' });
  HK.stand(T, -9, 4.8, HK.who(9523, { dir: 3, pose: 'hold', phone: true }), { name: 'photographer' });

  /* ---- the sitting-out pavilion with a mahjong game ---- */
  T.obj([18, 2, 30, 14], (g) => {
    K.box(g, 18, 2, 30, 14, 0, 0.4, { t: '#D9D0BA', l: '#C9C0AA', r: '#B9B09A' }, { w: 0.5 });
    const ps = []; for (const [x, y] of [[18.6, 2.6], [29.4, 2.6], [18.6, 13.4], [29.4, 13.4]]) { const a = g.p(x, y, 0.4), b = g.p(x, y, 6.6); ps.push(a[0], a[1], b[0], b[1]); } g.segs2(ps, '#C8372D', 0.8);
    // the mahjong table and the four aunties (back ones first), the roof last
    const tb = (sx, sy, d, s) => HK.person(g, sx, sy, 0.4, HK.elder(s, { dir: d, pose: 'sit', reach: d < 2 ? [3, -9] : [-3, -9] }));
    tb(24, 6.2, 1, 9531); tb(21.8, 8.0, 0, 9532);
    K.box(g, 22.6, 6.8, 25.4, 9.6, 0.4, 2.6, { t: '#3E8A4E', l: '#7A5C40', r: '#6A4E36' }, { w: 0.45 });
    const c = g.p(24, 8.2, 2.62); for (let k = 0; k < 12; k++) { const a = TAU * k / 12; g.fill2([[c[0] + Math.cos(a) * 3.4 - 0.4, c[1] + Math.sin(a) * 1.6 - 0.3], [c[0] + Math.cos(a) * 3.4 + 0.4, c[1] + Math.sin(a) * 1.6 - 0.3], [c[0] + Math.cos(a) * 3.4 + 0.4, c[1] + Math.sin(a) * 1.6 + 0.3], [c[0] + Math.cos(a) * 3.4 - 0.4, c[1] + Math.sin(a) * 1.6 + 0.3]], '#F6F1DE', true); }
    tb(26.2, 8.4, 2, 9533); tb(24, 10.4, 3, 9534);
    const rf = [[17.4, 1.4, 6.6], [30.6, 1.4, 6.6], [30.6, 14.6, 6.6], [17.4, 14.6, 6.6]]; K.hip(g, 17.4, 1.4, 30.6, 14.6, 6.6, 2.4, '#3E8A4E', { w: 0.6 }); void rf;
    g.glow('lamp', 24, 8, 6.2, { r: 1.4, base: 0.4 });                                  // night: the lamp under the pavilion's roof
  }, { name: 'pavilion' });
  // elders stretching in the evening
  for (const [x, y, s] of [[-28, 22, 9541], [-24, 25, 9542], [-31, 26, 9543]]) T.actor({ sample: 0.5, period: 4,
    at(t) { const f = Math.floor(t * 1.5 + s) % 4; return { x, y, key: 'e' + f, f }; },
    draw(g, st) { HK.person(g, 0, 0, 0, HK.elder(s, { dir: 1, pose: st.f % 2 ? 'cheer' : 'wave', ph: st.f * 0.25 })); } });

  /* ---- a small wet-market block and its sign, trees, a delivery rider ---- */
  T.obj([6, 24, 30, 35], (g) => {
    K.box(g, 6, 24, 30, 35, 0, 6.4, { t: '#D9D4C8', l: '#E6E1D5', r: '#CFC9BC' }, { w: 0.8 });
    g.fill(K.on('L', 35.02, 7, 29, 0, 3.6), '#F2DDA8'); const s = []; for (let x = 8; x < 29; x += 1.4) { const q = g.p(x, 35.05, 1.0); s.push(q[0] - 0.6, q[1], q[0] + 0.6, q[1] - 0.3); } g.segs2(s, '#8FBF4E', 1.2);
    HK.board(g, 'L', 35.05, 10, 20, 4.0, 6.0, '#3F7F5A', '街市', { en: 'MARKET' });
  }, { name: 'market' });
  for (const [x, y] of [[-34, 6], [-34, 16], [-20, 30], [20, 20], [34, 4]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.2, h: 4.4, col: '#6FA06A' }), { name: 'tree' });
  T.actor({ sample: 0.25, period: 72 / 4,
    at(t) { const L = 72, d = HT.mod(t * 4, L), x = -36 + d, a = Math.min(1, (36 - Math.abs(x)) / 4); if (a <= 0.02) return null; return { x, y: -22.4, key: 'r', alpha: a < 1 ? a : null }; },
    draw(g) { K.bike(g, 0, { col: '#E6C24F', who: HK.who(9551, { top: '#E6C24F', jacket: undefined, cap: '#E6C24F' }) }); const q = g.p(-1.6, 0, 3.4); g.fill2([[q[0] - 1.6, q[1] - 2.6], [q[0] + 1.6, q[1] - 2.6], [q[0] + 1.6, q[1]], [q[0] - 1.6, q[1]]], '#E6C24F', true); } });
  HK.walker(T, HK.elder(9552, { rwb: true }), [[-36, -10], [-20, -10], [-20, 0]], 0.7, { phase: 0.3 });
  HK.walker(T, HK.who(9553, { phone: true }), [[36, -11], [20, -11], [20, 22], [4, 22]], 1.0, { phase: 0.6 });
});
