'use strict';
/* The three satellites, off the grid on unlined paint blobs:
   lower left  Nan'an, across the Yangtze: the cableway's far station on the bank, stilt houses, figs;
   lower right Jiangbei, across the Jialing: the Grand Theatre, a ship of stacked green glass, its riverside steps;
   upper left  Wulong: the Three Natural Bridges, a karst arch over a gorge with the old courier inn far below. */
(function () {
  const blob = (g, pts, col, seed) => K.blob2(g, g.P(pts.map((p) => [p[0], p[1], 0])), col, { seed, rag: 0.8 });

  /* ---------------- Nan'an: the cableway's far station ---------------- */
  SF.tile('nanan', -100, 250, { rim: 100, castAt: 170, order: 3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-34, -16], [-18, -26], [8, -26], [30, -14], [34, 8], [22, 26], [-8, 28], [-30, 14]], '#C9D3B0', 5);
      blob(g, [[-26, -18], [-8, -22], [14, -20], [22, -8], [12, 4], [-14, 6], [-26, -4]], '#B5C79A', 6);
      g.grass2(g.P(K.rect(-20, -16, 16, 2)), { dens: 0.4 });
      g.fill(K.rect(-14, -20, 10, -16), '#D6CEBD');
    });
    // the station: a hall with the cables entering its river face (hidden, facing the city)
    T.obj([-14, -14, 4, 4], (g) => {
      g.boilP = 0.25;
      K.box(g, -14, -14, 4, 4, 0, 16, { t: '#D9D6CE', l: '#E6E1D5', r: '#CFC9BC' }, { w: 0.9 });
      K.box(g, -14.6, -14.6, 4.6, 4.6, 16, 16.8, '#B9B3A6', { w: 0.7 });
      for (const [a, b] of [[-12, -8], [-6, -2], [0, 3]]) K.win(g, 'L', 4, a, b, 6, 12, { style: 'navy' });
      CQH.sign(g, 'R', 4.65, -12, 2, 13, 15.6, '#C23B2F', '长江索道');
      g.fill(K.on('L', 4.02, -11, -7, 0, 3.6), '#4A4540');
    }, { name: 'nanan station' });
    T.obj([10, -8, 22, 4], (g) => CQ.stilt(g, { x0: 11, y0: -7, x1: 21, y1: 2, zb: 0, zf: 4, n: 2, lanterns: true }), { name: 'nanan stilt' });
    T.obj([-24, 6, -12, 16], (g) => CQ.oldhouse(g, { x0: -24, y0: 7, x1: -13, y1: 15, n: 2, sign: ['火锅', CQC.red] }), { name: 'nanan house' });
    for (const [x, y, r] of [[-24, -10, 5], [16, 14, 4.4], [-4, 14, 4.8]]) T.obj([x, y], (g) => CQ.fig(g, x, y, { r }), { name: 'fig' });
    for (let i = 0; i < 4; i++) T.cast([-4 + i * 2, 8 + (i % 2)], (g) => CQ.person(g, -4 + i * 2, 8 + (i % 2), 0, CQ.who(1600 + i, { dir: 3, pose: i % 2 ? 'hold' : 'stand', phone: i % 2 === 1 })), { name: 'queue' });
    CQ.walk(T, CQ.elder(1610), [[-20, 20], [20, 20]], 1.0, { phase: 0.3 });
  });

  /* ---------------- Jiangbei: the Grand Theatre ---------------- */
  SF.tile('jiangbei', 245, -30, { rim: 104, castAt: 172, order: 3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-34, -22], [-6, -32], [24, -26], [34, -4], [28, 24], [0, 32], [-28, 22], [-36, 0]], '#D3CDBE', 7);
      blob(g, [[-30, 10], [-10, 12], [10, 22], [0, 30], [-24, 24]], '#B5C79A', 8);
      g.fill(K.rect(-30, -20, -24, 20), '#C9C1B0');
      for (let i = 0; i < 8; i++) g.fine([[-30 + i * 0.75, -20, 0], [-30 + i * 0.75, 20, 0]], { w: 0.25, c: '#A39B89' });
    });
    T.obj([-18, -20, 20, 14], (g) => {
      g.boilP = 0.2;
      const GL = (c) => ({ t: shade(c, -0.25), l: c, r: shade(c, 0.12) });
      // stacked glass volumes like decks of a ship, the bow towards the river (-x), a white roof plate on top
      K.box(g, -16, -18, 18, 12, 0, 6, { t: '#E9E6DE', l: '#D9D6CC', r: '#C2BEB2' }, { w: 0.85 });
      const i0 = g.cmds.length;
      K.box(g, -12, -16, 16, 8, 6, 14, GL('#9FC4B7'), { w: 0.8 });
      K.box(g, -6, -13, 14, 4, 14, 21, GL('#B3D3C6'), { w: 0.8 });
      K.box(g, 0, -10, 12, 0, 21, 26, GL('#C9E0D6'), { w: 0.75 });
      CQ.nmark(g, i0, null, { nc: (c) => mix(nightColour(c), '#9FF2CF', 0.55) });   // at night it glows jade through its green glass
      for (const [x, y, z, r] of [[16.3, -4, 10, 4.2], [2, 8.3, 10, 4.2], [14.3, -4.5, 17.5, 3.4], [12.3, -5, 23.5, 2.6]]) g.glow('lantern', x, y, z, { r, col: '#9FF2CF' });
      const ln = []; for (const [x0, y0, x1, y1, z0, z1] of [[-12, -16, 16, 8, 6, 14], [-6, -13, 14, 4, 14, 21], [0, -10, 12, 0, 21, 26]]) { for (let x = x0 + 1.6; x < x1; x += 1.6) { const a = g.p(x, y1, z0), b = g.p(x, y1, z1); ln.push(a[0], a[1], b[0], b[1]); } for (let y = y0 + 1.6; y < y1; y += 1.6) { const a = g.p(x1, y, z0), b = g.p(x1, y, z1); ln.push(a[0], a[1], b[0], b[1]); } }
      g.segs2(ln, '#6F9488', 0.28);
      K.box(g, -2, -12, 14, 2, 26, 26.8, '#F3F1EA', { w: 0.7 });
    }, { name: 'theatre' });
    for (const [x, y] of [[-26, 24], [22, 22], [-30, -26]]) T.obj([x, y], (g) => CQ.fig(g, x, y, { r: 4.4 }), { name: 'fig' });
    for (let i = 0; i < 5; i++) T.cast([-22, -12 + i * 6], (g) => CQ.person(g, -22, -12 + i * 6, 0, CQ.who(1620 + i, { dir: 2, pose: i % 2 ? 'hold' : 'stand', phone: i === 3 })), { name: 'steps' });
    CQ.walk(T, CQ.who(1630), [[-26, -18], [-26, 18]], 1.1, { phase: 0.4 });
  });

  /* ---------------- Wulong: the Three Natural Bridges ---------------- */
  SF.tile('wulong', -225, -40, { rim: 94, castAt: 166, order: -3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-34, -14], [-14, -30], [16, -30], [34, -10], [30, 18], [6, 30], [-22, 26], [-36, 6]], '#B9CC98', 9);
      // the gorge floor: a stream winding through
      const st = K.curve([[-30, 18], [-14, 8], [0, 4], [12, -6], [26, -14]].map((p) => [p[0], p[1], 0]), 6);
      g.line(st, { w: 2.2, c: '#9FC2B3', boil: false }); g.line(st, { w: 0.5, c: '#6F9488', boil: false });
    });
    T.obj([-26, -24, 22, -4], (g) => {
      g.boilP = 0.3;
      // two limestone pillars joined high up by a natural arch; green caps, vertical cracks, a dark void under the arch
      const ROCK = { t: '#9FB27E', l: '#CFC8B8', r: '#B3AB98' };
      CQ.rock(g, [[-22, -25], [-10, -23], [-9, -6], [-17, -4], [-26, -10]], 0, [26, 31, 29, 33, 27]);
      CQ.rock(g, [[6, -23], [18, -25], [23, -12], [19, -5], [7, -6]], 0, [28, 25, 30, 24, 27]);
      CQ.rock(g, [[-10, -21], [7, -21], [7, -8], [-9, -8]], 19, [31, 29, 28, 30]);
      const arch = []; for (let i = 0; i <= 10; i++) { const a = Math.PI * i / 10; arch.push([-2 - Math.cos(a) * 8, -8.02, 19 - Math.sin(a) * 0 + (i === 0 || i === 10 ? 0 : 0)]); }
      g.fill([[-10, -6.02, 0], [6, -6.02, 0], [6, -6.02, 19], [-10, -6.02, 19]], '#5E6A5A');
      g.fill(K.curve([[-10, -6.02, 19], [-6, -6.02, 23.5], [2, -6.02, 23.5], [6, -6.02, 19]], 4).concat([[6, -6.02, 19], [-10, -6.02, 19]]), '#CFC8B8');
      g.fill([[-10, -6.02, 0], [6, -6.02, 0], [6, -6.02, 6], [-10, -6.02, 6]], '#7E8C76');
      g.line(K.curve([[-10, -6.02, 19], [-6, -6.02, 23.5], [2, -6.02, 23.5], [6, -6.02, 19]], 4), { w: 0.7, c: '#4A4540' });
      const cr = []; for (let i = 0; i < 16; i++) { const x = -25 + i * 3, z = 4 + (i * 7) % 18; if (x > -10 && x < 6) continue; const a = g.p(x, -6, z), b = g.p(x + 0.4, -6, z + 7); cr.push(a[0], a[1], b[0], b[1]); } for (let y = -22; y < -6; y += 3) { for (const x of [-10, 22]) { const a = g.p(x, y, 6 + (y * 3) % 10), b = g.p(x, y + 0.5, 14 + (y * 3) % 10); cr.push(a[0], a[1], b[0], b[1]); } } g.segs2(cr, '#8C8473', 0.4);
      for (const [x, y, z] of [[-18, -15, 30], [14, -15, 26.5], [-2, -15, 29.5]]) CQ.fig(g, x, y, { z, r: 2.6, h: 1.2, seed: x + 50 });
      void arch;
    }, { name: 'natural bridge' });
    // the old courier inn in the gorge
    T.obj([-6, 8, 6, 16], (g) => { K.box(g, -6, 8, 6, 16, 0, 3.6, { t: '#D9D3C4', l: '#8A6446', r: '#6E4A36' }, { w: 0.7 }); CQ.tileRoof(g, -6, 8, 6, 16, 3.6, 2.4, 'x', { over: 0.9 }); }, { name: 'inn' });
    for (let i = 0; i < 3; i++) CQ.walk(T, CQ.who(1640 + i), [[-24, 22], [-10, 18], [10, 20], [24, 12]], 0.8, { phase: i * 0.3 });
  });
})();
