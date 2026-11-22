'use strict';
/* (0,100) Tsim Sha Tsui, the tip of Kowloon facing the Island across the harbour (its land starts at the seawall,
   world y 76 = local -24).
   What is there: the Star Ferry's Tsim Sha Tsui pier, a low hall with a roof terrace and two finger piers out into
   the water (the same two berths as Central, straight across); the old Kowloon-Canton Railway clock tower in red
   brick banded with granite, its clock faces and cupola; the Cultural Centre, windowless, tiled in pink-brown, under
   its great curved roof that sweeps up towards the harbour; the Space Museum's white egg dome; the promenade with the
   Avenue of Stars and Bruce Lee's statue (tourists copy his stance); the bus terminus with double-deckers and a
   minibus waiting; Ocean Terminal on the west with a cruise ship alongside.
   Who: the crowd at the railing watching the Island's lights come on, tourists posing, a couple, a man selling
   balloons, the commuters of the ferry rush (NIGHT STAR casts off as the shot opens, MORNING STAR comes in later). */
SF.tile('tst', 0, 100, { rim: 30 }, function (T) {
  const H = 37, Y0 = HT.HAR.K - 100;            // the seawall in tile-local y (-24)
  T.ground(function (g) {
    HK.ground(g, -H, Y0, H, H, HK.C.pave, { cut: 'y' });
    HK.paving(g, -H, Y0, H, H, { step: 2.4 });
    // the promenade along the harbour: pale granite with a timber edge; the Avenue of Stars' handprint slabs
    g.fill(K.rect(-H, Y0, H, Y0 + 6), '#E9E3D4'); g.fill(K.rect(-H, Y0, H, Y0 + 1.2), '#D9C7A6');
    { const s = []; for (let x = -36; x < -14; x += 2.6) { const q = g.p(x + 1.3, Y0 + 3.6, 0.02); s.push(q); } for (const q of s) { g.fill2([[q[0] - 2.4, q[1]], [q[0], q[1] - 1.3], [q[0] + 2.4, q[1]], [q[0], q[1] + 1.3]], '#D6CBB2', true); g.disc2(q, 0.5, '#B9A27D'); } }
    // the bus terminus: islands and bays
    g.fill(K.rect(4, -4, 35, 15), '#D3CEC2'); for (const y of [1.6, 9.4]) { g.fill(K.rect(5, y - 0.9, 34, y + 0.9), '#E6E1D5'); g.outline(K.rect(5, y - 0.9, 34, y + 0.9), { w: 0.4, c: '#9E9A90', boil: false }); }
    // gardens round the Space Museum and the Cultural Centre
    g.fill(K.rect(-36, 18, -14, 36), '#B5CF8E'); g.grass(K.rect(-36, 18, -14, 36), { dens: 0.6 });
  }, { rim: true });

  /* ---- the pier hall, low, a roof terrace with a rail; the fingers into the harbour ---- */
  T.obj([-8, Y0, 18, Y0 + 7], (g) => {
    const CR = { t: '#E9E2CF', l: '#F3ECD8', r: '#DDD3BA' };
    K.box(g, -8, Y0, 18, Y0 + 7, 0, 4.6, CR, { w: 0.85 });
    g.fill(K.on('L', Y0 + 7.02, -7.6, 17.6, 3.8, 4.6), '#2E6B4E'); g.fill(K.on('R', 18.02, Y0 + 0.4, Y0 + 6.6, 3.8, 4.6), '#245A41');
    for (const xc of [0, 12]) { g.fill(K.on('L', Y0 + 7.02, xc - 2, xc + 2, 0, 3.2), '#5A4E42'); g.mark({ nc: '#F2C887', spill: true }); g.outline(K.on('L', Y0 + 7.03, xc - 2, xc + 2, 0, 3.2), { w: 0.5, boil: false }); }
    HK.board(g, 'L', Y0 + 7.05, -7.2, -2.4, 0.6, 3.4, '#2E6B4E', '天星小輪', { vert: false, en: 'STAR FERRY', rim: '#F3ECD8' });
    HK.board(g, 'L', Y0 + 7.05, 3.0, 9.0, 0.6, 3.4, '#F3ECD8', '尖沙咀', { c: '#2E6B4E', en: 'TSIM SHA TSUI' });
    HK.rail(g, [-7.6, Y0 + 6.8], [17.6, Y0 + 6.8], { h: 1.2 }); HK.rail(g, [17.8, Y0 + 0.2], [17.8, Y0 + 6.8], { h: 1.2 });
  }, { name: 'star ferry pier' });
  for (const [x0, x1] of [[-3, 3], [9, 15]]) {
    const ya = 55 - 100, yb = Y0;
    T.obj([x0, ya, x1, yb], (g) => {
      const Z = HT.HAR.WL;
      const s = []; for (let y = ya + 2; y < yb; y += 4) for (const x of [x0 + 0.4, x1 - 0.4]) { const a = g.p(x, y, 0), b = g.p(x, y, Z); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#6E675C', 0.6);
      K.box(g, x0, ya, x1, yb, -0.5, 0, { t: '#D9D0BA', l: '#B9B0A0', r: '#A69D8C' }, { w: 0.6 });
      HK.paving(g, x0, ya, x1, yb, { step: 1.5, joint: '#C9BFA8' });
      const gy = HT.FERRY.yT - 100;
      HK.rail(g, [x0 + 0.15, ya + 0.3], [x0 + 0.15, gy - 1.6], { h: 1.6 }); HK.rail(g, [x0 + 0.15, gy + 1.6], [x0 + 0.15, yb - 0.4], { h: 1.6 });
      HK.rail(g, [x0 + 0.2, ya + 0.15], [x1 - 0.2, ya + 0.15], { h: 1.6 });
      for (const y of [ya + 1.5, ya + 10]) HK.lamp(g, x1 - 0.5, y, { h: 6.4, arm: -1.2 });
    }, { name: 'ferry finger', under: 0 });
    T.obj([x1 - 0.3, ya + 0.3, x1, yb - 0.2], (g) => HK.rail(g, [x1 - 0.15, ya + 0.4], [x1 - 0.15, yb - 0.4], { h: 1.6 }), { name: 'finger rail' });
  }
  HK.ferryCrowd(T, { f: 'A', at: 'T', fx: -3, gy: HT.FERRY.yT, dy: HT.HAR.K, oy: 100, seed: 63 });
  HK.ferryCrowd(T, { f: 'B', at: 'T', fx: 9, gy: HT.FERRY.yT, dy: HT.HAR.K, oy: 100, seed: 64 });

  /* ---- the Clock Tower: red brick banded with granite, clock faces, a cupola and a lightning rod ---- */
  T.obj([-19, -22, -13, -16], (g) => {
    g.boilP = 0.3;
    const BR = { t: '#C98A6A', l: '#C6785A', r: '#A9634A' }, GR = { t: '#E3DED3', l: '#ECE8DC', r: '#D2CDC1' }, i0 = g.cmds.length;
    K.box(g, -18.6, -21.6, -13.4, -16.4, 0, 2.0, GR, { w: 0.7 });
    K.box(g, -18.2, -21.2, -13.8, -16.8, 2.0, 21.0, BR, { w: 0.8 });
    for (const z of [6, 11, 16]) K.box(g, -18.3, -21.3, -13.7, -16.7, z, z + 0.6, GR, { w: 0.4, boil: false });
    for (const [f, p, a0, a1] of [['L', -16.8, -18.2, -13.8], ['R', -13.8, -21.2, -16.8]]) for (const z of [3, 7.6, 12.6]) K.win(g, f, p + 0.02, f === 'L' ? -16.6 : -19.6, f === 'L' ? -15.4 : -18.4, z, z + 2.4, { style: 'navy', arch: true, w: 0.3 });
    K.box(g, -18.5, -21.5, -13.5, -16.5, 21.0, 22.4, GR, { w: 0.6 });
    for (const [f, p, a] of [['L', -16.5, -16], ['R', -13.5, -19]]) { const c = g.p.apply(g, K.pt(f, p + 0.03, a, 18.6)); g.disc2(c, 4.2, '#FBF8EE'); g.mark({ nc: '#FFF2D0' }); g.glow2('lantern', c, c, { r: 3.4, col: '#FFF0C8' }); g.ring2(c, 4.2, { w: 0.45, c: '#3A3530' }); g.segs2([c[0], c[1], c[0] - 0.4, c[1] - 3.0, c[0], c[1], c[0] + 2.2, c[1] + 0.8], '#2A2622', 0.45); }
    K.box(g, -17.4, -20.4, -14.6, -17.6, 22.4, 25.6, BR, { w: 0.6 });
    K.dome(g, -16, -19, 1.9, 25.6, 2.4, '#C8B48A', { w: 0.5 });
    g.line([[-16, -19, 28], [-16, -19, 31]], { w: 0.4, c: '#3A3530', boil: false, ext: 0 });
    // at night the brick and granite are floodlit warm
    const FL = new Set(['#C98A6A', '#C6785A', '#A9634A', '#E3DED3', '#ECE8DC', '#D2CDC1', '#C8B48A']);
    HK.nite(g, i0, { nc: (c) => (FL.has(c) ? mix(mix(nightColour(c), c, 0.6), '#FFC890', 0.16) : undefined) });
    for (const [z, r] of [[4, 3.2], [11, 2.8], [23.5, 2.4]]) g.glow('lantern', -16, -19, z, { r, col: '#FFC98A' });
  }, { name: 'clock tower' });

  /* ---- the Cultural Centre: windowless tiled walls under the great curved roof ---- */
  T.obj([-37, -12, -20, 14], (g) => {
    g.boilP = 0.25; const i0 = g.cmds.length;
    const TL = { t: '#E1C7B4', l: '#E3C2AC', r: '#C9A690' };
    K.box(g, -36, -10, -21, 13, 0, 7.0, TL, { w: 0.85 });
    // the tile courses
    const s = []; for (let z = 1.2; z < 7; z += 1.1) { for (const [f, p, a0, a1] of [['L', 13, -36, -21], ['R', -21, -10, 13]]) { const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z)); s.push(a[0], a[1], b[0], b[1]); } } g.segs2(s, '#CBA892', 0.28);
    // the roof: a curved slope from the back (y 13, z 7) rising to the harbour end (y -10, z 15), its side faces closed
    const N = 10, prof = []; for (let i = 0; i <= N; i++) { const u = i / N; prof.push([lerp(13, -10, u), 7 + 8 * u * u]); }
    const side = (x) => [[x, 13, 7]].concat(prof.map(([y, z]) => [x, y, z]), [[x, -10, 7]]);
    g.fill(side(-21), TL.r); g.outline(side(-21), { w: 0.6, boil: false });
    for (let i = 0; i < N; i++) { const [ya, za] = prof[i], [yb, zb] = prof[i + 1]; g.fill([[-36, ya, za], [-21, ya, za], [-21, yb, zb], [-36, yb, zb]], mix('#D9B9A2', '#EFDCCB', i / N)); }
    g.line(prof.map(([y, z]) => [-21, y, z]), { w: 0.85, boil: false }); g.line([[-36, 13, 7], [-21, 13, 7]], { w: 0.7, boil: false });
    const ribs = []; for (let x = -34.5; x < -21; x += 1.5) { const pts = prof.map(([y, z]) => g.p(x, y, z + 0.02)); for (let i = 0; i < pts.length - 1; i++) ribs.push(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]); } g.segs2(ribs, '#C9A690', 0.25);
    const i1 = g.cmds.length; K.sign(g, 'L', 13, -34, -23, 1.6, 2.6, '#2C2622', 'HONG KONG CULTURAL CENTRE', { ink: '#E6C24F', w: 0.3 });
    HK.nite(g, i0, { nc: HK.lift(0.3) }); HK.nite(g, i1, { nc: true });          // night: uplit softly, its name lit
    for (const [x, y, z] of [[-21, -10, 1.0], [-21, 1, 1.0], [-28, 13, 1.0]]) g.glow('lantern', x, y, z, { r: 2.4, col: '#FFD9A8' });
  }, { name: 'cultural centre' });
  // the Space Museum's egg dome
  T.obj([-31, 20, -21, 30], (g) => { K.cyl(g, -26, 25, 4.8, 0, 1.4, { t: '#E9E6DE', l: '#F1EFE8', r: '#DCD8CE' }, { n: 20, w: 0.6 }); K.dome(g, -26, 25, 4.8, 1.4, 6.4, '#F6F3EA', { w: 0.7, ribs: 8, ribCol: '#D6D1C4', ribW: 0.5, shadow: '#E3DED3' }); HK.nite(g, 0, { nc: HK.lift(0.5) }); g.glow('lantern', -26, 25, 5.0, { r: 2.4, col: '#E6F0FF' }); }, { name: 'space museum' });   // floodlit at night

  /* ---- the bus terminus: parked double-deckers, a minibus, shelters ---- */
  for (const [x, y, kind, o] of [[12, 5.4, 'bus', { livery: 'kmb', route: '1A' }], [25, 5.4, 'bus', { livery: 'kmb', route: '6' }], [14, -1.6, 'mini', { red: false }], [27, 12.6, 'bus', { livery: 'kmb', route: '2' }]]) {
    const hl = kind === 'bus' ? 7 : 4.6;
    T.obj([x - hl, y - 2.6, x + hl, y + 2.6], (g) => g.at(x, y, 0, (g2) => HK.vehicle(g2, Math.PI, kind, o)), { name: 'bus' });
  }
  for (const y of [1.6, 9.4]) T.obj([6, y - 0.8, 33, y + 0.8], (g) => { const s = []; for (let x = 8; x < 33; x += 6) { const a = g.p(x, y, 0), b = g.p(x, y, 5.2); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#6E7378', 0.45); const r = [[6, y - 1.4, 5.2], [33, y - 1.4, 5.2], [33, y + 1.4, 5.4], [6, y + 1.4, 5.4]]; g.fill(r, '#C9D3D8'); g.outline(r, { w: 0.45, boil: false }); for (const x of [11, 20, 29]) g.glow('lamp', x, y, 4.9, { r: 1.1 }); }, { name: 'bus shelter' });   // lamps under the roof at night
  [[10, 1.2, 1], [16, 1.0, 1], [22, 1.4, 1], [30, 9.0, 1]].forEach(([x, y, d], i) => HK.stand(T, x, y, HK.who(6100 + i, { dir: d, pose: i % 2 ? 'hold' : 'stand', phone: i % 2 === 1 }), { name: 'queue' }));

  /* ---- Ocean Terminal's end and a cruise ship alongside ---- */
  T.obj([21, -45, 37, -14], (g) => {
    K.box(g, 31, -36, 37, -24, -0.5, 6.0, { t: '#DCD8CE', l: '#E9E6DE', r: '#CFCAC0' }, { w: 0.8 });
    g.fill(K.on('L', -24 + 0.02, 31.5, 36.5, 2.0, 5.0), '#93AEBD'); g.mark({ nc: '#FFE6B4' });
    K.box(g, 31, -24, 37, -14, 0, 6.0, { t: '#DCD8CE', l: '#E9E6DE', r: '#CFCAC0' }, { w: 0.8 });
    { const i0 = g.cmds.length; K.sign(g, 'L', -14, 31.6, 36.4, 4.0, 5.2, '#2F4F6E', 'OCEAN TERMINAL', { w: 0.3 }); HK.nite(g, i0, { nc: true }); }
    // the ship: a long white hull with tiers of balconies and a blue funnel (static, moored)
    const Z = HT.HAR.WL, x0 = 23.4, x1 = 30.6, y0 = -43, y1 = -27.5;
    K.box(g, x0, y0 + 1.6, x1, y1, Z, Z + 3.2, { t: '#E9E6DE', l: '#F6F4EE', r: '#DCD8CE' }, { w: 0.8 });
    g.fill(K.on('R', x1 + 0.02, y0 + 1.6, y1, Z, Z + 0.9), '#2F4F6E');
    const bow = [[x0, y0 + 1.6, Z], [x1, y0 + 1.6, Z], [(x0 + x1) / 2, y0 - 1.8, Z + 3.2]]; g.fill(bow.concat(), '#ECE9E1');
    g.fill([[x1, y0 + 1.6, Z], [(x0 + x1) / 2, y0 - 1.8, Z + 3.2], [x1, y0 + 1.6, Z + 3.2]], '#DCD8CE'); g.outline([[x1, y0 + 1.6, Z], [(x0 + x1) / 2, y0 - 1.8, Z + 3.2], [x1, y0 + 1.6, Z + 3.2]], { w: 0.6, boil: false });
    for (let k = 0; k < 2; k++) { const za = Z + 3.2 + k * 2.2; K.box(g, x0 + 0.6 + k * 0.4, y0 + 3 + k * 1.2, x1 - 0.6 - k * 0.4, y1 - 1 - k * 0.6, za, za + 2.2, { t: '#ECE9E1', l: '#F6F4EE', r: '#DCD8CE' }, { w: 0.55, boil: false }); const s = []; for (let y = y0 + 3.6 + k * 1.2; y < y1 - 1.2; y += 0.9) { const a = g.p(x1 - 0.6 - k * 0.4 + 0.03, y, za + 0.5), b = g.p(x1 - 0.6 - k * 0.4 + 0.03, y, za + 1.7); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#7E9AAD', 0.45); HK.nite(g, g.cmds.length - 1, { nc: k ? '#FFE3A6' : '#FFD98A' }); }   // the cabins lit at night
    K.cyl(g, 27, -32, 1.3, Z + 7.6, Z + 10.4, { t: '#2A2622', l: '#3F7FB8', r: '#2F6A9E' }, { n: 12, w: 0.5 });
    // night: deck lights along the ship; December: strings of bulbs along Ocean Terminal's roofline (Harbour City's Christmas lights)
    for (let y = y0 + 3; y < y1 - 1; y += 3.2) g.glow('lantern', x1 - 0.5, y, Z + 7.7, { r: 1.0, col: '#FFF0C8' });
    HK.bulbs2(g, [g.p(31, -14 + 0.05, 6.05), g.p(37, -14 + 0.05, 6.05), g.p(37.05, -24, 6.05), g.p(37.05, -36, 6.05)], 2.0, '#FFD98A', 1.0);
    HK.bulbs2(g, [g.p(31.2, -14.05, 5.6), g.p(31.2, -14.05, 0.3)], 2.0, '#FF6A5A', 1.0); HK.bulbs2(g, [g.p(36.8, -14.05, 5.6), g.p(36.8, -14.05, 0.3)], 2.0, '#7FE08A', 1.0);
    g.glow('neon', 34, -13.9, 2.4, { r: 3.2, col: '#FFD98A' });
  }, { name: 'ocean terminal' });

  /* ---- railings, lamps, palms ---- */
  for (const [a, b] of [[-36.6, -4.6], [19, 30.6]]) T.obj([a, Y0 + 0.1, b, Y0 + 0.5], (g) => { HK.rail(g, [a, Y0 + 0.3], [b, Y0 + 0.3], { h: 1.7 }); HK.railLights(g, a, b, Y0 + 0.3); }, { name: 'seawall rail' });
  for (const [x, y] of [[-12, -16], [-4, -14], [20, -16], [-36, -2], [2, 18], [-12, 30]]) T.obj([x, y], (g) => K.palm(g, x, y, { h: 9, r: 4 }), { name: 'palm' });
  for (const [x, y] of [[-26, -18], [-8, -10.6], [22, -8]]) T.obj([x, y], (g) => HK.lamp(g, x, y, { h: 8, arm: 1.8 }), { name: 'lamp' });

  /* ---- Bruce Lee and the people copying him ---- */
  T.obj([-30, -19.6], (g) => {
    K.box(g, -31.2, -20.8, -28.8, -18.4, 0, 1.2, { t: '#9AA3A8', l: '#B9C0C4', r: '#8E979C' }, { w: 0.5 });
    const r = K.person(g, -30, -19.6, 1.2, { dir: 0, pose: 'crouch', sway: 0.4, skin: '#B88A4E', hair: '#5A3A1E', top: '#B88A4E', bot: '#8A6A3A', shoe: '#5A3A1E', bare: true, hands: [[5, -14], [-1, -11]], k: 1.15 });
    void r; HK.nite(g, 0, { nc: HK.lift(0.55) }); g.glow('lantern', -30, -19.6, 4.0, { r: 2.6, col: '#FFE2B0' });   // in his spotlight at night
  }, { name: 'bruce lee' });
  for (const [x, y, d, s] of [[-27, -17.4, 2, 6201], [-33.4, -16.8, 0, 6202]]) T.cast([x, y], (g) => HK.person(g, x, y, 0, HK.who(s, { dir: d, pose: 'crouch', sway: d ? -0.4 : 0.4, hands: [[4.4, -13], [-1, -11]] })), { name: 'posing' });
  HK.stand(T, -24.6, -15.6, HK.who(6203, { dir: 2, pose: 'hold', phone: true }), { name: 'photographer' });
  // the crowd at the railing watching the Island light up (backs to us)
  [[-34, -23.0], [-31.6, -22.8], [-22, -23.1], [-19.6, -22.9], [-11, -23.0], [-9.2, -22.7], [21, -22.9], [24, -23.1], [27.4, -22.8]].forEach(([x, y], i) => HK.stand(T, x, y, HK.who(6210 + i, { dir: i % 3 === 0 ? 3 : 2, pose: i % 4 === 1 ? 'hold' : 'stand', phone: i % 4 === 1 }), { name: 'watcher' }));
  // a balloon seller
  T.cast([-14.6, -12.4], (g) => { const r = HK.person(g, -14.6, -12.4, 0, HK.elder(6230, { dir: 1, pose: 'hold' })); const h = r.hands[0]; const cs = ['#E06A8A', '#E6C24F', '#5F8FC9', '#8FBF73', '#C8372D']; cs.forEach((c, k) => { const b = [h[0] - 4 + k * 2, h[1] - 16 - (k % 2) * 3]; g.fine2([h, [b[0], b[1] + 2]], { w: 0.2, c: '#5A564E' }); g.disc2(b, 2.0, c); g.disc2([b[0] - 0.6, b[1] - 0.6], 0.5, '#FBF8EE'); }); }, { name: 'balloons' });
  HK.walker(T, HK.who(6241, { scarf: '#3F5F8F' }), [[-36, -20.4], [-4, -20.4]], 1.0, { phase: 0.2 });
  HK.walker(T, HK.who(6242, { rwb: true }), [[-6, 33], [-6, -15], [-2, -15]], 1.1, { phase: 0.5 });
  HK.walker(T, HK.who(6243, { phone: true }), [[36, 18], [0, 18], [0, -14]], 1.0, { phase: 0.8 });
  HK.walker(T, HK.who(6244), [[20, -20], [36, -20]], 0.9, { phase: 0.1 });
});
