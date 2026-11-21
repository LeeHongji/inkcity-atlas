'use strict';
/* Beijing's avenues: four through-streets between the places, 26 u wide, out to the map's cut edge. Right-hand
   traffic: a car lane each way either side of the double yellow centre line, then a white line, then a bike lane each
   way by the kerb (the city of bicycles: cyclists, delivery e-bikes and electric tricycles have their own lanes).
   Zebras on every arm of the four crossings, and one across Chang'an Avenue (y = 50) on the axis, where the honour
   guard crosses from the Tiananmen gate to the flagpole while every lane is held at red (src/37_traffic.js).
   The pavements, their ginkgo trees and the rows of shared bikes belong to the places beside them. */
SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const E = BJT.END, ASPH = '#D3CFC5', LINE = '#F7F5EE', YEL = '#E2B93E';
  T.ground(function (g) {
    g.boilP = 0.1;
    const strips = [[[-63, -E], [-37, E]], [[37, -E], [63, E]], [[-E, -63], [E, -37]], [[-E, 37], [E, 63]]];
    for (const [a, b] of strips) g.fill(K.rect(a[0], a[1], b[0], b[1]), ASPH);
    for (let i = 0; i < 4; i++) {
      const [a, b] = strips[i], alongY = i < 2, d = alongY ? Math.atan2(AY, -AX) : Math.atan2(AY, AX), p = g.P(K.rect(a[0], a[1], b[0], b[1]));
      g.scuff2(p, { dir: d, len: 9, c: '#DFDBD1', dens: 0.4, w: 0.55, spread: 0.05 });
      g.scuff2(p, { dir: d, len: 7, c: '#C2BDB1', dens: 0.1, w: 0.45, spread: 0.04 });
    }
    // the map's cut edge: the road section on the near sides
    for (const c of [-50, 50]) {
      g.fill([[c - 13, E, 0], [c + 13, E, 0], [c + 13, E, -1.1], [c - 13, E, -1.1]], C.slab);
      g.fill([[E, c - 13, 0], [E, c + 13, 0], [E, c + 13, -1.1], [E, c - 13, -1.1]], C.slabD);
      g.line([[c - 13, E, 0], [c - 13, E, -1.1], [c + 13, E, -1.1], [c + 13, E, 0]], { w: 0.9, boil: false });
      g.line([[E, c - 13, 0], [E, c - 13, -1.1], [E, c + 13, -1.1], [E, c + 13, 0]], { w: 0.9, boil: false });
      g.line([[-E, c - 13, 0], [-E, c + 13, 0]], { w: 0.9, boil: false }); g.line([[c - 13, -E, 0], [c + 13, -E, 0]], { w: 0.9, boil: false });
      g.line([[c - 13, E, 0], [c + 13, E, 0]], { w: 0.9, boil: false }); g.line([[E, c - 13, 0], [E, c + 13, 0]], { w: 0.9, boil: false });
    }
    // the double yellow centre line and the white bike-lane lines, broken at the crossings
    const run = (alongY, c, off, col, w, dash) => {
      for (const [s0, s1] of [[-E + 1, -65], [-35, 35], [65, E - 1]]) {
        if (!alongY && c === 50 && off === 0 && s0 === -35) {   // Chang'an: broken where the guard crosses
          run2(alongY, c, off, col, w, dash, -35, -8); run2(alongY, c, off, col, w, dash, 8, 35); continue;
        }
        run2(alongY, c, off, col, w, dash, s0, s1);
      }
    };
    const run2 = (alongY, c, off, col, w, dash, s0, s1) => {
      if (!dash) { const a = alongY ? [c + off, s0, 0] : [s0, c + off, 0], b = alongY ? [c + off, s1, 0] : [s1, c + off, 0]; g.line([a, b], { c: col, w, boil: false, ext: 0 }); return; }
      for (let s = s0; s < s1 - 2; s += 8) { const a = alongY ? [c + off, s, 0] : [s, c + off, 0], b = alongY ? [c + off, Math.min(s1, s + 4.5), 0] : [Math.min(s1, s + 4.5), c + off, 0]; g.line([a, b], { c: col, w, boil: false, ext: 0 }); }
    };
    for (const c of [-50, 50]) for (const alongY of [true, false]) {
      run(alongY, c, -0.45, YEL, 0.7, false); run(alongY, c, 0.45, YEL, 0.7, false);
      run(alongY, c, -7.2, LINE, 0.75, true); run(alongY, c, 7.2, LINE, 0.75, true);
    }
    // zebras on the four arms of each crossing, and stop lines behind them
    for (const cx of [-50, 50]) for (const cy of [-50, 50]) for (const sg of [-1, 1]) {
      for (let k = -12; k <= 12; k += 2.0) {
        const y0 = cy + sg * 14.5, y1 = cy + sg * 19.0;
        g.fill(K.rect(cx + k - 0.6, Math.min(y0, y1), cx + k + 0.6, Math.max(y0, y1)), LINE);
        const x0 = cx + sg * 14.5, x1 = cx + sg * 19.0;
        g.fill(K.rect(Math.min(x0, x1), cy + k - 0.6, Math.max(x0, x1), cy + k + 0.6), LINE);
      }
      g.line([[cx + sg * 20.4, cy - 12.6, 0], [cx + sg * 20.4, cy + 12.6, 0]], { c: LINE, w: 0.9, boil: false });
      g.line([[cx - 12.6, cy + sg * 20.4, 0], [cx + 12.6, cy + sg * 20.4, 0]], { c: LINE, w: 0.9, boil: false });
    }
    // the guard's crossing on the axis: a wide zebra across Chang'an Avenue, and the stop lines either side
    for (let y = 37.6; y < 62.6; y += 2.0) g.fill(K.rect(-4.5, y, 4.5, y + 1.2), LINE);
    g.line([[-8, 50.6, 0], [-8, 62.6, 0]], { c: LINE, w: 1.0, boil: false }); g.line([[8, 37.4, 0], [8, 49.4, 0]], { c: LINE, w: 1.0, boil: false });
    // bike symbols in the bike lanes (a little wheel pair) near each crossing
    const bk = [];
    for (const c of [-50, 50]) for (const s of [-110, -82, 18, 82, 110]) for (const off of [-10, 10]) for (const alongY of [true, false]) {
      const p = alongY ? g.p(c + off, s, 0) : g.p(s, c + off, 0), q = alongY ? g.p(c + off, s + 2.6, 0) : g.p(s + 2.6, c + off, 0);
      bk.push(p[0] - 1.6, p[1], p[0] + 1.6, p[1], q[0] - 1.6, q[1], q[0] + 1.6, q[1], p[0], p[1], q[0], q[1]);
    }
    g.segs2(bk, '#ECEAE2', 0.5);
  });

  /* ---- the traffic ---- */
  const CARS = ['#F1EFE8', '#C9CCCC', '#2F343B', '#F1EFE8', '#3B4B63', '#B9B5AC', '#8E2E2E', '#E7E2D6'];
  const BANDS = ['#3F7F8F', '#4F8F5A', '#3E6FB0', '#8E3A3A', '#6A4A8A'];
  const TRIBOX = ['#3E6FB0', '#E6C24F', '#C9463E', '#5E8F5E'];
  BJT.vehicles.forEach((v, i) => {
    const R = RNG(i * 37 + 5), col = R.pick(CARS), band = R.pick(BANDS), who = BJ.who(3000 + i), box = R.pick(TRIBOX), eb = R() < 0.5 ? '#F2C230' : '#3E8FD0';
    const bcol = R.pick(['#3A3632', '#C9584B', '#5F8FC9', '#3B3F47', '#E6C24F']);
    T.actor({
      cast: false, sample: 0.2, period: v.held ? BJF.CYC : 40, bias: 0,
      at(t) { const s = v.at(t); if (!s) return null; return { x: s.x, y: s.y, key: s.kind + Math.round(s.ang * 100), ang: s.ang, kind: s.kind, alpha: s.alpha }; },
      draw(g, st) {
        const a = st.ang;
        if (st.kind === 'taxi') BJ.taxi(g, a, { band });
        else if (st.kind === 'bus') BJ.bus(g, a, { band: '#C9463E' });
        else if (st.kind === 'van') K.bus(g, a, { L: 5.8, W: 2.45, h: 4.8, n: 3, band: '#5E8FC9' });
        else if (st.kind === 'bike') K.bike(g, a, { col: bcol, who });
        else if (st.kind === 'ebike') BJ.ebike(g, a, { col: eb, seed: 3000 + i });
        else if (st.kind === 'tri') BJ.tri(g, a, { box, seed: 3000 + i });
        else K.car(g, a, { col });
      },
    });
  });
});
