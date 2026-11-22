'use strict';
/* (-100,0) the hotpot street: a row of hotpot restaurants and the tables spilling out in front of them.
   What it is: four-storey concrete restaurants with huge red signs, vertical boards and strings of red lanterns,
   extractor hoods breathing steam; in front of them a broad paved forecourt crowded with round tables, each with a
   split pot (red chilli broth and pale broth) bubbling on a burner, diners on low plastic stools, a few big red
   umbrellas, crates of beer. A noodle (xiaomian) stall and a fruit kiosk along the street at the front.
   Levels: all at z 0, the forecourt open to the street in front; the restaurants are kept to 14 u so that the car
   street behind them is never hidden.
   Who: a dozen tables of diners (chopsticks, bowls, beer), waiters carrying trays and pots between the tables, a chef
   at a doorway, a family at the noodle stall, a man carrying a crate of beer on his shoulder.
   Moving: red steam rising off every pot, waiters on their rounds, walkers along the front. */
SF.tile('huoguo', -100, 0, { rim: 8 }, function (T) {
  const H = 37;
  T.ground(function (g) {
    K.slab(g, H, { top: '#DCC9B4' });
    g.fill(K.rect(-37, -8, 37, 30), '#D9D0C0');
    const s = []; for (let x = -37; x <= 37; x += 2.6) { const a = g.p(x, -8, 0), b = g.p(x, 30, 0); s.push(a[0], a[1], b[0], b[1]); } for (let y = -8; y <= 30; y += 2.6) { const a = g.p(-37, y, 0), b = g.p(37, y, 0); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#C9BFAD', 0.22);
    CQ.paving(g, -37, -8, 37, 30, 0, { dens: 0.3 });
  }, { rim: true });

  /* ---- the restaurants along the back ---- */
  const R = [[-36, -20, 11, '#E3DCCB'], [-19, -6, 13.6, '#D9D3C4'], [-5, 9, 12, '#E7E1D2'], [10, 22, 13.6, '#DDD5C2'], [23, 36, 10.4, '#E3DCCB']];
  R.forEach(([x0, x1, h, col], i) => {
    T.obj([x0, -30, x1, -8], (g) => {
      CQ.block(g, { x0, y0: -30, x1, y1: -8, h, gf: 4.2, st: 3.1, col, seed: 1100 + i * 7, shop: [i % 2 ? '火锅' : '火锅', i % 3 === 1 ? '#B8322A' : CQC.red], cage: i % 2 === 0, tank: true });
      // a big name board across the first floor, a vertical board at the corner, lantern strings
      CQH.sign(g, 'L', -8 + 0.1, x0 + 1, x1 - 1, 4.6, 7.0, i % 2 ? '#C8392E' : '#2F2A26', i === 2 ? '重庆火锅' : '火锅', { ink: i % 2 ? '#F6E7B8' : '#E2B550' });
      CQH.sign(g, 'L', -7.2, x1 - 2.2, x1 - 0.4, 7.4, Math.min(h - 0.6, 13), CQC.red, i % 2 ? '小面' : '火锅', { vert: true, ink: '#F6E7B8' });
      for (let x = x0 + 1.5; x < x1 - 2.4; x += 2.4) CQ.lantern2(g, g.p(x, -7.6, 3.9), 0.9);
      // an extractor hood on the roof
      K.box(g, x1 - 4, -26, x1 - 1.5, -23, h, h + 2.2, { t: '#A9ACA9', l: '#C3C6C3', r: '#9A9D9A' }, { w: 0.5, boil: false });
    }, { name: 'restaurant' });
    CQ.steamActor(T, x1 - 2.75, -24.5, h + 2.6, 1.2, 'rgba(236,226,218,0.65)', i * 5 + 1);
  });

  /* ---- the tables in the forecourt ---- */
  const TB = [[-30, -2], [-21, -1], [-12, -2.5], [-3, -1.5], [6, -2], [15, -1], [24, -2.5], [32, -1], [-26, 8], [-16, 9], [-6, 8], [4, 9.5], [14, 8.5], [24, 9], [-20, 18], [-9, 19], [2, 18], [13, 19.5]];
  TB.forEach(([x, y], i) => {
    const seeds = [1200 + i * 4, 1201 + i * 4, 1202 + i * 4, 1203 + i * 4], um = i % 5 === 2;
    T.cast([x, y], (g) => {
      // far diners, the table and its pot, near diners: one drawing so the stools and people never sort wrong
      const seat = (dx, dy, d, s) => { CQ.stool(g, x + dx, y + dy, s % 3 ? '#C9463E' : '#4F7FB8'); CQ.person(g, x + dx, y + dy, 1.3, CQ.who(s, { dir: d, pose: 'sit', reach: [3.2, 2.4], bowl: s % 2 === 0 })); };
      seat(-3.2, 0, 0, seeds[0]); seat(0, -3.2, 1, seeds[1]);
      CQ.hotpot(g, x, y);
      seat(3.2, 0, 2, seeds[2]); if (i % 4 !== 3) seat(0, 3.2, 3, seeds[3]);
      if (um) { const b = g.p(x, y, 2.4), t = g.p(x, y, 9.5); g.segs2([b[0], b[1], t[0], t[1]], '#5A564E', 0.5); g.fill2(arcPts(t[0], t[1] + 2.2, 11, Math.PI, TAU, 12).map((p) => [p[0], p[1] - (p[1] - t[1] - 2.2) * 0.45]), '#C8392E', true); g.line2(arcPts(t[0], t[1] + 2.2, 11, Math.PI, TAU, 12).map((p) => [p[0], p[1] - (p[1] - t[1] - 2.2) * 0.45]), { w: 0.5, c: '#7A1E18', boil: false }); g.glow('lamp', x, y, 8.6, { r: 1.0 }); }   // a bulb hung under the umbrella (night)
    }, { name: 'table' });
    T.actor({ sample: 5, period: 10, at(t) { const ph = Math.floor(t * 5 + i * 1.7) % 8; return { x, y, z: 2.6, key: ph, ph }; }, draw(g, st) { CQ.steam2(g, st.ph, 1.25, 'rgba(226,150,128,0.62)'); } });
  });
  // beer crates stacked by a door, a chef in the doorway
  T.obj([-1, -6.5], (g) => { for (let i = 0; i < 3; i++) K.box(g, -2, -7.4, 0.2, -5.6, i * 1.1, i * 1.1 + 1.0, { t: '#2E6B3E', l: '#3F7F4F', r: '#2E5F3E' }, { w: 0.4, boil: false }); }, { name: 'crates' });
  T.cast([9.5, -6.6], (g) => CQ.person(g, 9.5, -6.6, 0, CQ.who(1290, { dir: 1, top: '#F3F1EA', bot: '#3B3F47', cap: '#F3F1EA', pose: 'hold' })), { name: 'chef' });

  /* ---- the noodle stall and a fruit kiosk at the front ---- */
  T.obj([-32, 31, -26, 35], (g) => {
    K.box(g, -32, 31, -26, 35, 0, 2.6, { t: '#D9D3C4', l: '#E6B84A', r: '#C9A03A' }, { w: 0.6 });
    CQH.sign(g, 'L', 35, -31.6, -26.4, 0.6, 2.2, '#C8392E', '小面', { line: false });
    K.cyl(g, -27.6, 32.4, 1.0, 2.6, 3.8, { t: '#5A564E', l: '#9C9A94', r: '#7A7872' }, { w: 0.45, n: 10 });
    CQ.person(g, -29, 30.2, 0, CQ.who(1291, { dir: 1, top: '#F3F1EA', pose: 'hold' }));
    g.glow('lamp', -30.5, 33, 3.0, { r: 0.9 });                                 // a bulb on the counter (night)
  }, { name: 'xiaomian' });
  CQ.steamActor(T, -27.6, 32.4, 4.2, 1);
  for (const [x, y, d, s] of [[-22, 32, 2, 1292], [-19, 33.5, 2, 1293], [-21, 35.5, 1, 1294]]) T.cast([x, y], (g) => { CQ.stool(g, x, y, '#4F7FB8'); CQ.person(g, x, y, 1.3, CQ.who(s, { dir: d, pose: 'sit', bowl: true, reach: [2.6, 3], k: s === 1294 ? 0.75 : 1 })); }, { name: 'noodle eater' });
  T.obj([22, 31, 30, 35], (g) => { K.stall(g, 26, 33, { face: 'L', L: 2.0, D: 1.6, a: '#3F7F4F', b: '#F3F1EA', goods: (g2, D, L) => { for (let i = 0; i < 8; i++) g2.disc2(g2.p(-D * 0.4 + (i % 2) * 0.8, -L + 0.6 + i * 0.5, 2.9), 0.9, ['#E08A3C', '#E6C24F', '#C8392E', '#8FBF73'][i % 4]); } }); g.glow('lamp', 26, 33, 5.8, { r: 1.0 }); }, { name: 'fruit' });   // a bulb under the canopy (night)

  /* ---- walkers: waiters on their rounds, passers-by ---- */
  const waiter = (seed, pts, ph) => CQ.walk(T, CQ.who(seed, { top: '#2F2A26', bot: '#2F2A26', jacket: '#C8392E' }), pts, 1.5, { phase: ph, draw: (g, w) => { const r = CQ.person(g, 0, 0, 0, Object.assign(w, { pose: 'walk' })); const h = r.hands[1]; g.fill2([[h[0] - 3, h[1] - 0.8], [h[0] + 3, h[1] - 0.8], [h[0] + 2.6, h[1] + 0.4], [h[0] - 2.6, h[1] + 0.4]], '#9C9A94', true); g.disc2([h[0], h[1] - 1.6], 1.2, '#C8392E'); } });
  waiter(1295, [[-34, 3.5], [30, 3.5]], 0.1); waiter(1296, [[30, 13.5], [-30, 13.5]], 0.5); waiter(1297, [[-26, 24], [20, 24], [20, 13.6], [-26, 13.6]], 0.3);
  CQ.walk(T, CQ.who(1298), [[-36, 28], [34, 28]], 1.3, { phase: 0.2 });
  CQ.walk(T, CQ.who(1299, { umbrella: '#E6C24F' }), [[34, 27], [-36, 27]], 1.1, { phase: 0.65 });
  CQ.walk(T, CQ.bangWho(1300), [[34, 26], [-36, 26]], 0.9, { phase: 0.4, porter: { load: ['#3F7F4F', '#3F7F4F'] } });
});
