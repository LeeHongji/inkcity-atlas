'use strict';
/* (0,0) The Empire State Building and Herald Square: the centrepiece.
   What it is: the 1931 Art Deco tower on Fifth Avenue at 34th Street, drawn as it is built: a five-storey limestone base
   filling the lot, a setback, the long shaft with its projecting central bays, then the stepped setbacks of the 72nd to
   86th floors (the observation deck with its rail), the stepped drum of the mooring mast with its ribs, the spire and the
   antenna with a red light. The shaft is limestone with continuous vertical piers between strips of windows and dark
   spandrels, so it reads as one tall striped prism. It stands in the middle of the tile, a little to the far side, so its
   height covers as little of the places behind it as possible. The Fifth Avenue entrance (the 'R' face) has a marquee and
   flags; the 34th Street face ('L') has the queue for the observation deck.
   Around it: on the near right, Herald Square: a paved triangle with green bistro tables and chairs, the bell monument
   (a granite wall, a bronze bell, Minerva above it), trees, planters; behind it a department store with red awnings and
   window displays. On the near left a pair of Koreatown walk-ups (a BBQ place and a deli) with fire escapes and a tank.
   Who is there: tourists craning their necks and photographing the tower, a tour guide with a flag and her group, the
   line for the observation deck, a hot-dog vendor, people at the bistro tables, a couple with shopping bags, an NYPD
   officer, someone with a dog. What moves: walkers across the forecourt and the square, the flags, steam from a vent. */
SF.tile('empire', 0, 0, { rim: 26 }, function (T) {
  const LIME = { t: '#ECE7DA', l: '#DCD5C3', r: '#C3BBA8' }, STRIP = '#8F98A0', MULL = '#F1EEE6';
  const CX = -9, CY = -9;                          // the shaft's centre

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    NK.lot(g, { inner: '#E3DED3' });
    // Herald Square: a warm granite-paved triangle with joints
    const hs = [[14, 31, 0], [31, 31, 0], [31, 2, 0], [14, 2, 0]];
    g.fill(hs, '#E6DCC8'); g.scuff(hs, { dir: Math.atan2(AY, AX), len: 3, c: '#D3C6AC', dens: 0.7, w: 0.45, spread: 0.05 });
    g.outline(hs, { w: 0.45, c: '#B9AE96', boil: false });
    // the forecourt in front of the tower: big paving squares
    const fc = []; for (let x = -13; x <= 13; x += 4) { const a = g.p(x, 2, 0), b = g.p(x, 31, 0); fc.push(a[0], a[1], b[0], b[1]); } for (let y = 2; y <= 31; y += 4) { const a = g.p(-13, y, 0), b = g.p(13, y, 0); fc.push(a[0], a[1], b[0], b[1]); }
    g.segs2(fc, '#D2CCBF', 0.35);
    // planters round Herald Square (soil)
    for (const [x0, y0, x1, y1] of [[15, 29, 30, 30.6], [29.4, 4, 31, 28]]) g.fill(K.rect(x0, y0, x1, y1), '#9C8C70');
  }, { rim: true });

  /* ---------------- the Empire State Building ---------------- */
  // a limestone box whose visible faces carry vertical window strips between piers
  const deco = (g, x0, y0, x1, y1, z0, z1, o) => {
    o = o || {}; K.box(g, x0, y0, x1, y1, z0, z1, LIME, { w: o.w || 0.9 });
    const sp = o.sp || 1.55, segs = [];
    for (const [f, pl, A0, A1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
      for (let a = A0 + sp * 0.5; a < A1 - sp * 0.3; a += sp) {
        const q = K.on(f, pl + 0.03, a - 0.32, a + 0.32, z0 + (o.b || 0.4), z1 - (o.t || 0.4));
        g.fill(q, f === 'L' ? STRIP : shade(STRIP, 0.1));
        const p0 = g.p.apply(g, K.pt(f, pl + 0.05, a, z0 + (o.b || 0.4))), p1 = g.p.apply(g, K.pt(f, pl + 0.05, a, z1 - (o.t || 0.4)));
        segs.push(p0[0], p0[1], p1[0], p1[1]);
      }
    }
    g.segs2(segs, MULL, 0.3);
  };
  // the base: five storeys over the whole lot, shops and the Fifth Avenue entrance
  T.obj([-27, -20, 9, 2], function (g) {
    K.box(g, -27, -20, 9, 2, 0, 6.6, LIME, { w: 1 });
    NK.windows(g, 'L', 2, -26.5, 8.5, 2.6, 1.3, 3, 16, { style: 'navy', fill: 0.45, hfill: 0.62 });
    NK.windows(g, 'R', 9, -19.5, 1.5, 2.6, 1.3, 3, 10, { style: 'navy', fill: 0.45, hfill: 0.62 });
    // ground floor: shop glass along 34th St, the entrance on Fifth
    for (let x = -26; x < 7; x += 4.2) K.win(g, 'L', 2.02, x, x + 3.2, 0.2, 2.3, { style: 'glass', w: 0.35 });
    g.fill(K.on('R', 9.03, -11.5, -6.5, 0, 2.5), '#3A3530');
    g.fill(K.on('R', 9.06, -12, -6, 2.5, 3.0), '#B79A5A');
    NK.text(g, 'R', 9.06, -9, 2.55, 0.38, 'EMPIRE STATE', '#3A3128', { center: true, w: 0.3 });
    for (const y of [-16, -3]) K.win(g, 'R', 9.02, y - 1.4, y + 1.4, 0.2, 2.3, { style: 'glass', w: 0.35 });
    NK.cornice(g, -27, -20, 9, 2, 6.6, { t: '#E4DECF', l: '#D3CBB7', r: '#BCB39E' }, { h: 0.6, d: 0.3 });
  }, { name: 'esb base' });
  // the tower: setback, shaft with central bays, the stepped crown, the mast
  // (shifted a little towards Fifth so the spire does not line up with the far corner's waiting crowd)
  T.obj([-21.5, -19.5, 8.5, -3.5], (g0) => g0.at(2.5, -2.5, 0, function (g) {
    g.boilP = 0.3;
    deco(g, -24, -17, 6, -1, 6.6, 8.6, { sp: 1.7 });
    deco(g, -21.5, -15.5, 3.5, -2.5, 8.6, 15.5, { sp: 1.5 });                 // the wings, set back at the 21st floor
    deco(g, -19, -15, 1, -3, 15.5, 19, { sp: 1.45 });                         // and again at the 30th
    deco(g, -16, -14, -2, -4, 19, 46, { sp: 1.35, b: 0.5 });                  // the shaft
    deco(g, -12, -14, -6, -3, 19, 45.4, { sp: 1.2, b: 0.5, w: 0.75 });       // its central bay on 34th St
    deco(g, -16, -11.5, -1, -6.5, 19, 45.4, { sp: 1.2, b: 0.5, w: 0.75 });  // and on Fifth
    deco(g, -14.5, -12.6, -3.5, -5.4, 46, 48.4, { sp: 1.2 });
    deco(g, -13.4, -11.6, -4.6, -6.4, 48.4, 50.4, { sp: 1.1 });
    deco(g, -12.4, -10.8, -5.6, -7.2, 50.4, 52.2, { sp: 1.0 });
    // the observation deck rail
    const rl = []; for (const [a, b] of [[[-12.6, -7.0], [-5.4, -7.0]], [[-5.4, -7.0], [-5.4, -11.0]]]) { for (let k = 0; k <= 8; k++) { const t = k / 8, x = lerp(a[0], b[0], t), y = lerp(a[1], b[1], t), p0 = g.p(x, y, 52.2), p1 = g.p(x, y, 52.9); rl.push(p0[0], p0[1], p1[0], p1[1]); } const q0 = g.p(a[0], a[1], 52.9), q1 = g.p(b[0], b[1], 52.9); rl.push(q0[0], q0[1], q1[0], q1[1]); }
    g.segs2(rl, '#5E5A52', 0.3);
    // the mooring mast: a stepped drum with ribs, the spire, the antenna
    const steps = [[2.3, 52.2, 54.6], [1.8, 54.6, 57.0], [1.3, 57.0, 58.8], [0.85, 58.8, 60.0]];
    for (const [r, z0, z1] of steps) {
      K.cyl(g, CX, CY, r, z0, z1, { t: '#EEF0EE', l: '#D9DEE0', r: '#AEB6BA' }, { w: 0.6, n: 14 });
      const rb = []; for (let k = 0; k < 7; k++) { const a = Math.PI * 0.75 - Math.PI * k / 6, p0 = g.p(CX + Math.cos(a) * r, CY + Math.sin(a) * r, z0 + 0.1), p1 = g.p(CX + Math.cos(a) * r, CY + Math.sin(a) * r, z1 - 0.1); rb.push(p0[0], p0[1], p1[0], p1[1]); }
      g.segs2(rb, '#8E979C', 0.28);
    }
    K.cone(g, CX, CY, 0.6, 60.0, 1.6, '#C9CED0');
    const a0 = g.p(CX, CY, 61), a1 = g.p(CX, CY, 66.5);
    g.line2([a0, a1], { w: 0.6, c: '#5E5A52', boil: false, ext: 0 });
    g.segs2([a0[0] - 0.6, a0[1] - 5, a0[0] + 0.6, a0[1] - 5, a0[0] - 0.4, a0[1] - 10, a0[0] + 0.4, a0[1] - 10], '#5E5A52', 0.35);
    g.disc2(a1, 0.55, '#E0503E');
  }), { name: 'empire state' });
  // the marquee canopy over the entrance and two flagpoles
  T.obj([9.5, -10], (g) => {
    K.box(g, 9, -12.4, 11.4, -5.6, 3.1, 3.5, '#B79A5A', { w: 0.5, boil: false });
    for (const y of [-12, -6]) { const b = g.p(11.2, y, 0), t = g.p(11.2, y, 3.1); g.segs2([b[0], b[1], t[0], t[1]], '#7A6A4A', 0.4); }
  }, { name: 'marquee' });
  for (const y of [-14.5, -3.5]) { T.obj([9.6, y], (g) => { const b = g.p(9.6, y, 6.6), t = g.p(9.6, y, 12); g.line2([b, t], { w: 0.5, c: '#5E5A52', boil: false }); g.disc2(t, 0.4, C.gold); }); NK.flagActor(T, 9.6, y, 11.8, { w: 3.6, h: 2.2, phase: y * 0.13 }); }

  /* ---------------- the department store (behind Herald Square) ---------------- */
  T.obj([14, -31, 31, -3], function (g) {
    const col = { t: '#E3DDD0', l: '#E0D6C2', r: '#C9BDA6' };
    K.box(g, 14, -31, 31, -3, 0, 18.5, col, { w: 1 });
    NK.windows(g, 'L', -3, 14.5, 30.5, 5.2, 3.2, 4, 7, { style: 'navy', fill: 0.6, hfill: 0.55 });
    NK.windows(g, 'R', 31, -30.5, -3.5, 5.2, 3.2, 4, 11, { style: 'navy', fill: 0.6, hfill: 0.55 });
    // display windows with mannequins, red awnings over them
    for (const [f, pl, A0, A1] of [['L', -3, 14.6, 30.4], ['R', 31, -30.4, -3.6]]) {
      const n = Math.round((A1 - A0) / 3.4), w = (A1 - A0) / n;
      for (let i = 0; i < n; i++) {
        const a = A0 + i * w;
        g.fill(K.on(f, pl + 0.03, a + 0.3, a + w - 0.3, 0.3, 3.4), '#EDE6D6');
        for (let k = 0; k < 2; k++) { const p = g.p.apply(g, K.pt(f, pl + 0.04, a + w * (0.33 + k * 0.34), 0.5)); g.fill2([[p[0] - 0.6, p[1]], [p[0] + 0.6, p[1]], [p[0] + 0.9, p[1] - 5], [p[0] - 0.9, p[1] - 5]], ['#C9463E', '#2F2C2A', '#E6C24F', '#5F8FC9'][(i + k) % 4], true); g.disc2([p[0], p[1] - 6.1], 0.9, '#E9E1CC'); }
        g.outline(K.on(f, pl + 0.04, a + 0.3, a + w - 0.3, 0.3, 3.4), { w: 0.4, boil: false });
      }
      NK.awning(g, f, pl, A0, A1, 4.5, 1.5, '#C23B33', {});
    }
    NK.cornice(g, 14, -31, 31, -3, 18.5, { t: '#E3DDD0', l: '#D3C7B0', r: '#BBAE96' }, { h: 0.9, d: 0.6 });
    NK.tank(g, 20, -25, 19.4, { r: 1.9, h: 3.6 });
    NK.roofStuff(g, 15, -30, 30, -5, 19.4, 7);
  }, { name: 'dept store' });
  T.obj([24, -6], (g) => { const b = g.p(24, -6, 19.4), t = g.p(24, -6, 25); g.line2([b, t], { w: 0.5, c: '#5E5A52', boil: false }); });
  NK.flagActor(T, 24, -6, 24.8, { w: 4, h: 2.5, phase: 0.4 });

  /* ---------------- Koreatown walk-ups (near left) ---------------- */
  T.obj([-31, 17, -22, 31], (g) => NK.walkup(g, -31, 17, -22, 31, 3, { face: 'L', col: NYC.brick, shop: { col: '#C9463E', word: 'BBQ', awning: '#2F2C2A' }, tx: 0.4, ty: 0.3 }), { name: 'walkup bbq' });
  T.obj([-21.5, 19, -14, 31], (g) => NK.walkup(g, -21.5, 19, -14, 31, 4, { face: 'L', col: NYC.brick2, shop: { col: '#2F6B4F', word: 'DELI', awning: '#E6C24F', stripe: '#2F6B4F' }, tank: false }), { name: 'walkup deli' });
  // a low block filling the far strip behind the base
  T.obj([-31, -31, -2, -22], (g) => { NK.block(g, -31, -31, -2, -22, 9, { t: '#D9D2C4', l: NYC.brick3, r: shade(NYC.brick3, 0.14) }); NK.windows(g, 'L', -22, -30.5, -2.5, 1.5, 3.6, 2, 9, { style: 'glass' }); });
  T.obj([-31, -19, -28, 15], (g) => { NK.block(g, -31, -19, -28, 15, 5, { t: '#D9D2C4', l: '#C9BFA9', r: '#B3A891' }); NK.windows(g, 'R', -28, -18.5, 14.5, 1.2, 3.6, 1, 9, { style: 'glass' }); }, { name: 'side shops' });

  /* ---------------- Herald Square furniture ---------------- */
  // the bell monument: a granite wall, a bronze bell, Minerva on top, the clock
  T.obj([18, 5, 26, 8], function (g) {
    const GR = { t: '#CFC9BC', l: '#C2BBAB', r: '#A9A292' }, BR = '#5C8C7A', BRD = '#456E5E';
    K.box(g, 18, 5, 26, 8, 0, 6.4, GR, { w: 0.85 });
    // the arched opening on the square side with the great bell hanging in it
    const op = [K.pt('L', 8.03, 19.6, 0.8), K.pt('L', 8.03, 24.4, 0.8)]; for (let k = 0; k <= 8; k++) { const t = Math.PI * k / 8; op.push(K.pt('L', 8.03, 22 + 2.4 * Math.cos(t), 3.6 + 2.0 * Math.sin(t))); }
    g.fill(op, '#4A4540');
    const bc = g.p(22, 8.06, 4.9), bell = [[bc[0] - 1.6, bc[1]], [bc[0] + 1.6, bc[1]], [bc[0] + 2.0, bc[1] + 6.0], [bc[0] + 3.0, bc[1] + 7.2], [bc[0] - 3.0, bc[1] + 7.2], [bc[0] - 2.0, bc[1] + 6.0]];
    g.fill2(bell, '#7E9C6A', true); g.fill2([[bc[0] + 0.4, bc[1]], [bc[0] + 1.6, bc[1]], [bc[0] + 2.0, bc[1] + 6.0], [bc[0] + 3.0, bc[1] + 7.2], [bc[0] + 0.8, bc[1] + 7.2]], '#5E7E52', true);
    g.outline2(bell, { w: 0.4, c: '#2F4A30', boil: false });
    // the clock on the side
    const cl = g.p(26.03, 6.5, 4.4); g.disc2(cl, 1.6, '#F1EEE6'); g.ring2(cl, 1.6, { w: 0.4, c: '#3A3128' }); g.segs2([cl[0], cl[1], cl[0], cl[1] - 1.1, cl[0], cl[1], cl[0] + 0.8, cl[1] + 0.3], '#3A3128', 0.3);
    K.box(g, 17.6, 4.6, 26.4, 8.4, 6.4, 7.0, '#B3AC9C', { w: 0.6, boil: false });
    // Minerva in green bronze with her spear, the two bell ringers with their hammers
    const bz = { skin: BR, hair: BRD, top: BR, bot: BRD, shoe: BRD, dress: BR, hairStyle: 'long', ink: '#2F4A40' };
    const m = K.person(g, 22, 6.6, 7.0, Object.assign({}, bz, { dir: 1, k: 1.35, pose: 'hold' }));
    g.segs2([m.hands[0][0] + 0.4, m.hands[0][1] + 6, m.hands[0][0] + 1.4, m.hands[0][1] - 12], '#2F4A40', 0.5);
    for (const [x, d] of [[19.4, 0], [24.6, 1]]) { const r = K.person(g, x, 7.2, 7.0, Object.assign({}, bz, { dir: d, k: 0.95, hairStyle: 'bald', pose: 'cheer', ph: 0.3 })); g.segs2([r.hands[0][0], r.hands[0][1], r.hands[0][0] + (d ? -2.4 : 2.4), r.hands[0][1] - 1.4], '#2F4A40', 0.6); }
  }, { name: 'bell monument' });
  for (const [x, y] of [[15.4, 9.5], [30.2, 13], [30.2, 24], [15.6, 29.8]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.3, h: 5, col: '#8DB868' }));
  for (const [x, y] of [[-10, 33.5], [3, 33.5], [33.5, 18]]) T.obj([x, y], (g) => NK.tree(g, x, y, { r: 3.2 }));
  T.obj([7.5, 22], (g) => NK.subway(g, 7.5, 22, 'y-', { w: 1.8, L: 5.5 }), { name: 'subway' });
  T.obj([-11, 28.5], (g) => NK.citibikes(g, -11, 28.5, 'x', 6), { name: 'citibikes' });
  T.obj([33.5, 6], (g) => NK.hydrant(g, 33.5, 6));
  T.obj([-3, 34.2], (g) => NK.basket(g, -3, 34.2));
  T.obj([12, 34.2], (g) => NK.mailbox(g, 12, 34.2));

  /* ---------------- the living layer ---------------- */
  // bistro tables in Herald Square: two chairs and two people each
  const TABLES = [[19, 15, 860], [24.5, 17, 864], [19.5, 21, 868], [21, 26.5, 872]];
  for (const [x, y, s] of TABLES) T.cast([x, y], (g) => {
    const chair = (cx, cy) => { K.box(g, cx - 0.5, cy - 0.5, cx + 0.5, cy + 0.5, 1.1, 1.35, '#3E6B4F', { w: 0.35, boil: false }); const p = g.p(cx, cy, 1.1), q = g.p(cx, cy, 0); g.segs2([p[0] - 1.2, p[1], q[0] - 1.2, q[1], p[0] + 1.2, p[1], q[0] + 1.2, q[1]], '#3E6B4F', 0.35); };
    chair(x - 1.4, y); NK.person(g, x - 1.4, y, 1.3, NK.who(s, { dir: 0, pose: 'sit', coffee: s % 8 === 0 }));
    K.cyl(g, x, y, 0.9, 2.0, 2.2, '#4E7B5F', { w: 0.35, n: 10 }); const st = g.p(x, y, 2.0), sb = g.p(x, y, 0); g.segs2([st[0], st[1], sb[0], sb[1]], '#3E6B4F', 0.4);
    const cup = g.p(x + 0.3, y + 0.2, 2.2); g.fill2([[cup[0] - 0.4, cup[1]], [cup[0] + 0.4, cup[1]], [cup[0] + 0.35, cup[1] - 1.1], [cup[0] - 0.35, cup[1] - 1.1]], '#F3F1EA', true);
    if (s % 3) { chair(x + 1.4, y); NK.person(g, x + 1.4, y, 1.3, NK.who(s + 1, { dir: 2, pose: 'sit' })); }
  }, { on: true });
  // the queue for the observation deck along the base, facing the door
  T.cast([-6, 4.2], (g) => { for (let i = 0; i < 8; i++) { const w = i % 3 === 1 ? NK.tourist(900 + i) : NK.who(900 + i); NK.person(g, -15 + i * 1.6, 3.6 + (i % 2) * 0.5, 0, Object.assign(w, { dir: 0, pose: i % 4 === 2 ? 'hold' : 'stand', phone: i % 4 === 2 })); } }, { on: true });
  // tourists craning up at the tower, one photographing it
  T.cast([-4, 14], (g) => { NK.person(g, -5, 13, 0, NK.tourist(911, { dir: 2, pose: 'hold', phone: true })); NK.person(g, -3, 14.5, 0, NK.who(912, { dir: 3, pose: 'wave', ph: 0.25 })); }, { on: true });
  // the tour guide with her flag and her group
  T.cast([4, 10], (g) => {
    const r = NK.person(g, 4.5, 9.5, 0, NK.who(920, { dir: 1, pose: 'hold', top: '#E6C24F', cap: '#E6C24F' }));
    const h = r.hands[0]; g.segs2([h[0], h[1], h[0] + 1, h[1] - 14], '#5E5A52', 0.4); g.fill2([[h[0] + 1, h[1] - 14], [h[0] + 5, h[1] - 13], [h[0] + 1, h[1] - 11]], '#C9463E', true);
    for (let i = 0; i < 5; i++) NK.person(g, 2 + (i % 3) * 1.7, 12 + Math.floor(i / 3) * 1.8, 0, NK.tourist(921 + i, { dir: 3 }));
  }, { on: true });
  // the hot-dog cart and its vendor, a customer
  T.cast([-6, 23], (g) => { NK.person(g, -8.6, 23, 0, NK.who(930, { dir: 0, pose: 'hold', top: '#F3F1EA', cap: '#2F6DB5' })); NK.cart(g, -6, 23, { along: 'x' }); NK.person(g, -5.5, 25.6, 0, NK.who(931, { dir: 3, pose: 'hold' })); }, { on: true });
  // an NYPD officer at the corner of the square
  T.cast([13, 30], (g) => NK.person(g, 13, 30, 0, NK.cop(940, { dir: 1 })), { on: true });
  // a couple with shopping bags outside the store
  T.cast([28, 1], (g) => { for (const [dx, s] of [[0, 941], [1.6, 942]]) { const r = NK.person(g, 27 + dx, 1, 0, NK.who(s, { dir: 1, pose: 'hold' })); const h = r.hands[0]; g.fill2([[h[0] - 1.2, h[1]], [h[0] + 1.2, h[1]], [h[0] + 1.1, h[1] + 3], [h[0] - 1.1, h[1] + 3]], '#C23B33', true); } }, { on: true });

  /* walkers: across the forecourt, round Herald Square, along the walk-ups */
  NK.walker(T, NK.who(950), [[-12, 8], [11, 8], [11, 31.5], [-12, 31.5]], 5.2, { phase: 0.1 });
  NK.walker(T, NK.suit(951, { coffee: true }), [[-12, 31.5], [-12, 8], [11, 8], [11, 31.5]], 5.6, { phase: 0.5 });
  NK.walker(T, NK.who(952, { tote: '#E9E1CC' }), [[14.6, 3.2], [14.6, 28.2], [27.4, 28.2], [27.4, 3.2]], 4.6, { phase: 0.2 });
  NK.walker(T, NK.tourist(953), [[27.4, 28.2], [14.6, 28.2], [14.6, 3.2], [27.4, 3.2]], 4.4, { phase: 0.65 });
  NK.walker(T, NK.who(954), [[-33.5, -30], [-33.5, 30]], 4.8, { phase: 0.3 });
  NK.walker(T, NK.who(955, { phone: true }), [[33.6, -30], [33.6, 30]], 4.5, { phase: 0.7 });
  NK.walker(T, NK.suit(956), [[-30, -33.6], [30, -33.6]], 5.5, { phase: 0.15 });
  NK.walker(T, NK.who(957), [[30, 33.8], [-30, 33.8]], 5.0, { phase: 0.45 });
  // a dog walker with a terrier
  const dw = NK.who(958);
  T.actor({ sample: 0.25, period: 24,
    at(t) { const L = 48, d = ((t * 4.2) % (2 * L)), fw = d < L, x = fw ? -12 + d * 0.5 : -12 + (2 * L - d) * 0.5, ph = Math.floor((d / 2.4) % 1 * 8); return { x, y: 19 - (x + 12) * 0.25, key: (fw ? 'f' : 'b') + ph, fw, ph: ph / 8 }; },
    draw(g, st) { const r = NK.person(g, 0, 0, 0, Object.assign({}, dw, { dir: st.fw ? 0 : 2, pose: 'walk', ph: st.ph })); const p = g.p(st.fw ? 2.6 : -2.6, st.fw ? 0.6 : -0.6, 0); NK.dog2(g, p, st.fw ? 1 : -1, '#E9E1CC', st.ph); g.fine2([r.hands[0], [p[0] + (st.fw ? 2.8 : -2.8), p[1] - 3]], { w: 0.22, c: '#3A3128' }); } });
  NK.steamActor(T, 31.5, 33, { z: 0.2, H: 8, n: 4, w: 1.3, drift: 3, per: 2.6, phase: 0.3 });
  NK.corners(T);
});
