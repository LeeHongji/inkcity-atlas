'use strict';
/* The satellites, off the grid on unlined paint blobs:
   upper left  Versailles: the long garden front of the palace (cream and pink stone, blue slate, gilt), the parterres
               d'eau, the Latona fountain, the Grand Canal with rowing boats;
   upper right La Défense (west, at the end of the axis that runs out of the Étoile): the Grande Arche, a hollow white
               cube with its "cloud" canopy, the esplanade with people on its giant steps, a few glass towers;
   lower left  Mont-Saint-Michel on its rock in the tidal sands: ramparts, the village climbing to the abbey, the spire
               with the gilded archangel, the causeway with the shuttle bus. */
(function () {
  const blob = (g, pts, col, seed) => K.blob2(g, g.P(pts.map((p) => [p[0], p[1], 0])), col, { seed, rag: 0.8 });

  /* ---------------- Versailles ---------------- */
  SF.tile('versailles', -214, 0, { rim: 90, castAt: 160, order: -3, half: 32 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-30, -12], [-22, -30], [2, -32], [26, -24], [32, 0], [28, 26], [4, 32], [-24, 26]], '#B5CF8E', 21);
      // the gravel terrace, the parterres d'eau, the canal running towards us
      g.fill(K.rect(-14, -24, -4, 24), PC.gravel);
      for (const y of [-12, 4]) { const q = K.rect(-11, y, -6, y + 8, -0.2); g.fill(q, PC.water); g.water(q, { dens: 1.2 }); g.outline(K.rect(-11, y, -6, y + 8), { w: 0.45, c: '#7A8C8C', boil: false }); }
      const cn = [[-2, -2.4, -0.3], [30, -2.4, -0.3], [30, 2.4, -0.3], [-2, 2.4, -0.3]]; g.fill(cn, PC.water); g.water(cn, { dens: 1.2 });
      const cr = [[16, -16, -0.3], [20, -16, -0.3], [20, 16, -0.3], [16, 16, -0.3]]; g.fill(cr, PC.water); g.water(cr, { dens: 1.0 });
      g.outline(cn.map((p) => [p[0], p[1], 0]), { w: 0.45, c: '#7A8C8C', boil: false });
      // clipped bosquets either side of the alley
      for (const [x0, y0, x1, y1] of [[-2, -22, 14, -6], [-2, 6, 14, 22]]) { g.fill(K.rect(x0, y0, x1, y1), '#8DAA5C'); const gr = []; for (let x = x0 + 2; x < x1; x += 4) { const a = g.p(x, y0, 0), b = g.p(x, y1, 0); gr.push(a[0], a[1], b[0], b[1]); } g.segs2(gr, '#6E8A3E', 0.6); }
    });
    T.obj([-28, -26, -16, 26], function (g) {
      g.boilP = 0.25;
      const ST = { t: '#F2EBDA', l: '#EFE2CC', r: '#D9C9AC' };
      K.box(g, -28, -26, -16, 26, 0, 7.6, ST, { w: 0.9 });
      K.box(g, -24, -10, -14, 10, 0, 8.4, ST, { w: 0.9 });
      for (let a = -25; a < 25; a += 1.8) { const fx = a > -10 && a < 10 ? -14 : -16; PA.win(g, 'R', fx, a, a + 0.8, 1.0, 3.6, { pane: '#5E6B76' }); PA.win(g, 'R', fx, a, a + 0.8, 4.6, 6.6, { pane: '#5E6B76' }); }
      for (let a = -24; a < -16.4; a += 1.8) PA.win(g, 'L', 26, a, a + 0.8, 1.0, 3.6, { pane: '#5E6B76' });
      const bal = []; for (let a = -26; a <= 26; a += 0.5) { const fx = a > -10 && a < 10 ? -14 : -16, zz = a > -10 && a < 10 ? 8.4 : 7.6, p = g.p(fx, a, zz), q = g.p(fx, a, zz + 0.9); bal.push(p[0], p[1], q[0], q[1]); } g.segs2(bal, '#CDBF9E', 0.4);
      for (let a = -24; a < 25; a += 4) { const fx = a > -10 && a < 10 ? -14 : -16, zz = a > -10 && a < 10 ? 9.3 : 8.5, c = g.p(fx, a, zz); g.fill2([[c[0] - 0.6, c[1]], [c[0] + 0.6, c[1]], [c[0], c[1] - 2.2]], PC.gold, true); }
      // a flat roof behind the balustrade, its trophies and urns in gilt, a glimpse of slate behind
      g.fill(K.rect(-27.6, -25.6, -16.4, 25.6, 8.5), '#D9CDB2'); g.fill(K.rect(-23.6, -9.6, -14.4, 9.6, 9.3), '#D9CDB2');
      K.hip(g, -27, -25, -20, 25, 8.5, 2.2, '#6C7580', { ridge: 44, c: '#3E444B' });
      for (let a = -23; a < 24; a += 6) { const c = g.p(-16, a, 8.6); g.fill2([[c[0] - 0.8, c[1]], [c[0] + 0.8, c[1]], [c[0] + 0.5, c[1] - 2.8], [c[0] - 0.5, c[1] - 2.8]], '#E6D9B8', true); g.disc2([c[0], c[1] - 3.2], 0.7, PC.gold); }
    }, { name: 'palace' });
    // Latona's fountain on the terrace, rowing boats on the canal, strollers
    T.actor({ sample: 5, period: 10, grow: false,
      at(t) { const f = Math.floor(t * 5) % 5; return { x: -9, y: 0, key: f, f }; },
      draw(g, st) { const b = g.p(0, 0, 0); g.fill2(arcPts(b[0], b[1], 7, 0, TAU, 14).map((q) => [q[0], b[1] + (q[1] - b[1]) * 0.45]), '#9DBDBC', true); g.ring2(b, 0.01, {}); for (let k = 0; k < 5; k++) { const a = TAU * k / 5 + st.f * 0.4, p = [b[0] + Math.cos(a) * 4.5, b[1] + Math.sin(a) * 2.0]; g.fill2([[p[0] - 0.3, p[1]], [p[0] + 0.3, p[1]], [b[0] + 0.2, b[1] - 9], [b[0] - 0.2, b[1] - 9]], '#E6F1F3', true); } g.disc2([b[0], b[1] - 9.6], 1.0, PC.gold); } });
    [[0, 28, 9], [0.5, 22, 7]].forEach(([ph, per, s]) => T.actor({ sample: 0.3, period: per, grow: false,
      at(t) { const u = ((t / per + ph) % 1 + 1) % 1, x = u < 0.5 ? lerp(2, 27, smooth(u * 2)) : lerp(27, 2, smooth((u - 0.5) * 2)), y = ph ? -1 : 1, f = Math.floor(t * 2) % 4; return { x, y, z: -0.3, key: (u < 0.5 ? 'a' : 'b') + f, d: u < 0.5 ? 0 : Math.PI, f }; },
      draw(g, st) { K.boat(g, st.d, { kind: 'row', L: 1.7, W: 0.8, hull: '#F3F1EA', stripe: '#3F5F8F', rower: PA.who(1500 + s), ph: st.f / 4 }); } }));
    PA.walker(T, PA.who(1510), [[-12, -22], [-12, 22]], 1.2, { phase: 0.2 });
    PA.walker(T, PA.who(1511), [[-6.5, 22], [-6.5, -22]], 1.1, { phase: 0.6 });
  });

  /* ---------------- La Défense ---------------- */
  SF.tile('defense', 40, -214, { rim: 84, castAt: 156, order: -3, half: 32 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-28, -14], [-18, -30], [6, -32], [28, -20], [30, 6], [22, 28], [-4, 30], [-26, 18]], '#E3DFD4', 23);
      g.fill(K.rect(-10, -10, 10, 30), '#ECE8DE');
      const gr = []; for (let y = -8; y < 30; y += 3) { const a = g.p(-10, y, 0), b = g.p(10, y, 0); gr.push(a[0], a[1], b[0], b[1]); } g.segs2(gr, '#D9D3C4', 0.3);
    });
    // the glass towers behind
    for (const [x0, y0, x1, y1, h, col] of [[-26, -28, -16, -18, 30, '#B9CCD6'], [14, -28, 24, -20, 24, '#A9BCC8'], [-24, -8, -16, 4, 18, '#C3D3DA']]) T.obj([x0, y0, x1, y1], (g) => { K.box(g, x0, y0, x1, y1, 0, h, { t: '#DCE3E6', l: col, r: shade(col, 0.12) }, { w: 0.85 }); const gr = []; for (let z = 2; z < h; z += 2) for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) { const a = g.p.apply(g, K.pt(f, p + 0.02, a0, z)), b = g.p.apply(g, K.pt(f, p + 0.02, a1, z)); gr.push(a[0], a[1], b[0], b[1]); } g.segs2(gr, '#8EA7B6', 0.3); }, { name: 'tower' });
    // the Grande Arche: a hollow cube facing down the axis (+y)
    T.obj([-12, -16, 12, -6], function (g) {
      g.boilP = 0.3;
      const x0 = -12, x1 = 12, y0 = -16, y1 = -6, Z = 24, W = 3.2, WH = { t: '#F6F4EE', l: '#F3F1EA', r: '#DCD8CE' };
      K.box(g, x0, y0, x0 + W, y1, 0, Z, WH, { w: 0.9 }); K.box(g, x1 - W, y0, x1, y1, 0, Z, WH, { w: 0.9 });
      K.box(g, x0, y0, x1, y1, Z - W, Z, WH, { w: 0.95 });
      // the inner faces of the frame, in shade, and a grid of panels on the outer face
      g.fill([[x0 + W, y1, 0], [x0 + W, y0, 0], [x0 + W, y0, Z - W], [x0 + W, y1, Z - W]], '#CFCBC1');
      g.fill([[x0 + W, y0, Z - W], [x1 - W, y0, Z - W], [x1 - W, y1, Z - W], [x0 + W, y1, Z - W]], '#D8D4CA');
      const gr = []; for (let a = x0; a <= x1; a += 1.6) { const p = g.p(a, y1 + 0.02, Z - W), q = g.p(a, y1 + 0.02, Z); gr.push(p[0], p[1], q[0], q[1]); } for (let z = 1.6; z < Z; z += 1.6) for (const xx of [x0, x1 - W]) { const p = g.p(xx, y1 + 0.02, z), q = g.p(xx + W, y1 + 0.02, z); gr.push(p[0], p[1], q[0], q[1]); } g.segs2(gr, '#C9C5BB', 0.3);
      g.line([[x0 + W, y1, 0], [x0 + W, y1, Z - W], [x1 - W, y1, Z - W], [x1 - W, y1, 0]], { w: 0.75, boil: false });
      // the "cloud": a white canopy hung in the opening
      const c = g.p(0, (y0 + y1) / 2, 8.5); g.fill2(K.curve([[c[0] - 16, c[1]], [c[0] - 8, c[1] - 3.4], [c[0] + 6, c[1] - 2.6], [c[0] + 16, c[1] + 0.4], [c[0] + 6, c[1] + 3.0], [c[0] - 8, c[1] + 2.4]], 3, true), 'rgba(246,244,238,0.85)');
    }, { name: 'grande arche' });
    // the giant steps in front, people sitting on them
    T.obj([-10, -6, 10, 2], (g) => { for (let i = 0; i < 6; i++) { const y = -6 + i * 1.3, z = 3.2 - i * 0.55; g.fill(K.rect(-10, y, 10, y + 1.3, z), '#ECE8DE'); g.fill([[-10, y + 1.3, z], [10, y + 1.3, z], [10, y + 1.3, z - 0.55], [-10, y + 1.3, z - 0.55]], '#D5D0C4'); g.line([[-10, y + 1.3, z], [10, y + 1.3, z]], { w: 0.35, c: '#A9A296', boil: false }); } }, { name: 'steps' });
    T.cast([0, -2], (g) => { for (const [x, y, s] of [[-7, -3.6, 0], [-3, -1.0, 1], [2, -4.9, 2], [5.5, -2.3, 3], [8, 0.3, 4]]) PA.person(g, x, y, 3.2 - Math.floor((y + 6) / 1.3) * 0.55, PA.who(1520 + s, { dir: 1, pose: 'sit' })); }, { on: true });
    PA.walker(T, PA.who(1530), [[-6, 3], [-6, 28]], 1.5, { phase: 0.2 });
    PA.walker(T, PA.who(1531), [[5, 28], [5, 3]], 1.3, { phase: 0.5 });
    PA.walker(T, PA.who(1532), [[0, 26], [0, 4]], 1.6, { phase: 0.8 });
  });

  /* ---------------- Mont-Saint-Michel ---------------- */
  SF.tile('msm', 40, 216, { rim: 100, castAt: 166, order: 3, half: 32 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-32, -10], [-22, -30], [4, -32], [28, -22], [32, 6], [24, 28], [-2, 32], [-26, 22]], '#E6DCC0', 31);
      const w = [[-28, 4], [-16, -12], [0, -16], [14, -10], [24, 8], [12, 24], [-10, 26], [-26, 16]];
      blob(g, w, '#B9D3D6', 32); g.water(w.map((p) => [p[0] * 0.9, p[1] * 0.9, 0]), { dens: 0.6 });
      // the causeway towards us
      g.fill([[-1.5, 6, 0.4], [1.5, 6, 0.4], [1.5, 32, 0.4], [-1.5, 32, 0.4]], '#D6CDBA'); g.line([[1.5, 6, 0.4], [1.5, 32, 0.4]], { w: 0.5, boil: false });
    });
    T.obj([-13, -13, 13, 9], function (g) {
      g.boilP = 0.25;
      // the rock: a mound of granite
      const rk = (h) => { const pts = []; for (let i = 0; i < 24; i++) { const a = TAU * i / 24, r = 12 * (1 - h / 30) * (0.9 + 0.1 * Math.sin(a * 3)); pts.push([Math.cos(a) * r, -2 + Math.sin(a) * r, h]); } return pts; };
      g.fill(rk(0).slice(0, 13).concat(rk(10).slice(0, 13).reverse()), '#A8A08E');
      g.fill(rk(10), '#B5AC98');
      // ramparts round the foot, towers
      K.cyl(g, 0, -2, 12.4, 0, 3, { t: '#C9C0AC', l: '#BDB49F', r: '#A69C86' }, { w: 0.8, n: 24 });
      for (const a of [0.2, 0.9, 1.6, 2.6]) { const x = Math.cos(a) * 12.4, y = -2 + Math.sin(a) * 12.4; K.cyl(g, x, y, 1.4, 0, 4.6, { t: '#C9C0AC', l: '#BDB49F', r: '#A69C86' }, { w: 0.6, n: 10 }); K.cone(g, x, y, 1.6, 4.6, 1.8, '#6C7580'); }
      // the village houses climbing the slope
      const R = RNG(9); for (let k = 0; k < 9; k++) { const a = 0.1 + k * 0.28, r = 9 - (k % 3) * 1.5, x = Math.cos(a) * r, y = -2 + Math.sin(a) * r, z = 3 + (k % 3) * 2.5; K.box(g, x - 1.4, y - 1.4, x + 1.4, y + 1.4, z, z + 3, { t: '#E9E2CC', l: R.pick(['#EDE3CC', '#E3D6BC', '#D9CDB4']), r: '#C9BCA2' }, { w: 0.55, boil: false }); K.hip(g, x - 1.6, y - 1.6, x + 1.6, y + 1.6, z + 3, 1.6, '#6C7580', { c: '#3E444B' }); }
      // the abbey on the summit, its church and the spire with the gilded archangel
      K.box(g, -5, -9, 4, -1, 10, 17, { t: '#CFC6B2', l: '#C9BFA9', r: '#AFA48C' }, { w: 0.85 });
      for (let a = -4; a < 3.5; a += 1.6) PA.win(g, 'L', -1, a, a + 0.6, 12, 15.4, { pane: '#5A6E86', surround: false });
      K.gable(g, -5.2, -7, 4.2, -3, 17, 3.6, 'x', { a: '#6C7580', b: '#5A626C', e: '#C9BFA9' }, { c: '#3E444B' });
      K.box(g, 3, -6.5, 5.6, -3.5, 17, 21, { t: '#CFC6B2', l: '#C9BFA9', r: '#AFA48C' }, { w: 0.7 });
      const b = g.p(4.3, -5, 21), t = g.p(4.3, -5, 34); g.fill2([[b[0] - 2.6, b[1]], [b[0] + 2.6, b[1]], [t[0] + 0.3, t[1]], [t[0] - 0.3, t[1]]], '#6C7580'); g.fill2([[b[0] + 0.2, b[1]], [b[0] + 2.6, b[1]], [t[0] + 0.3, t[1]], [t[0], t[1]]], '#5A626C'); g.line2([[b[0] - 2.6, b[1]], t, [b[0] + 2.6, b[1]]], { w: 0.55, c: '#3E444B', boil: false });
      g.fill2([[t[0] - 0.6, t[1]], [t[0] + 0.6, t[1]], [t[0] + 0.4, t[1] - 3.2], [t[0] - 0.4, t[1] - 3.2]], PC.gold, true); g.fill2([[t[0], t[1] - 2.6], [t[0] + 2.0, t[1] - 4.2], [t[0] + 0.4, t[1] - 2.0]], PC.gold, true); g.disc2([t[0], t[1] - 3.6], 0.5, PC.gold);
    }, { name: 'mont saint michel' });
    // the shuttle bus on the causeway, walkers on it, gulls
    T.actor({ sample: 0.3, period: 20, grow: false,
      at(t) { const u = ((t / 20) % 1 + 1) % 1, y = u < 0.5 ? lerp(30, 12, smooth(u * 2)) : lerp(12, 30, smooth((u - 0.5) * 2)); return { x: 0, y, z: 0.4, key: u < 0.5 ? 'a' : 'b', ang: u < 0.5 ? -Math.PI / 2 : Math.PI / 2 }; },
      draw(g, st) { K.bus(g, st.ang, { col: '#F1EFE8', band: '#3F5F8F', L: 4.4, W: 1.4, h: 4.0, n: 3 }); } });
    PA.walker(T, PA.who(1540), [[0.8, 14], [0.8, 31]], 1.2, { z: 0.4, phase: 0.3 });
    T.actor({ layer: 'top', sample: 5, period: 10, grow: false,
      at(t) { const f = Math.floor(t * 3) % 4, u = (t * 0.05) % 1; return { x: -14 + Math.cos(u * TAU) * 10, y: -6 + Math.sin(u * TAU) * 8, z: 26, key: f, f }; },
      draw(g, st) { const p = g.p(0, 0, 0), w = [3, 2, 1, 2][st.f]; for (const d of [0, 7]) g.line2([[p[0] + d - 2, p[1] - w * 0.5], [p[0] + d, p[1]], [p[0] + d + 2, p[1] - w * 0.5]], { w: 0.4, c: '#5E574A', boil: false }); } });
  });
})();
