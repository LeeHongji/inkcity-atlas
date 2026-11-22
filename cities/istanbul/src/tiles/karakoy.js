'use strict';
/* (0,-100) Karaköy. What it is: the old port quarter at the mouth of the Golden Horn, where the Horn meets the
   Bosphorus. On the Horn the KARAKÖY ferry station (a two-storey white building with the name over the water side and
   a clock), the ferry to Üsküdar coming alongside its quay; west of it the gilded fish-sandwich boats (balık ekmek) moored
   at the quay, rocking, their grills smoking, cooks in white handing sandwiches up to the customers on low stools. On
   the Bosphorus edge the fish market: stalls under red awnings with fish on ice, the fishmongers calling, gulls and a
   gang of cats. Inland the Kılıç Ali Paşa mosque (Sinan: one dome on a square hall, a half-dome behind, a portico of
   five little domes, one minaret), the banks' street with its heavy stone façades, and the baklava shop with a queue
   out of the door; a tea garden on the Bosphorus edge under the plane trees.
   What moves: the boats rocking, the smoke, the queue shuffling, gulls, cats, walkers, the ferry (water.js). */
SF.tile('karakoy', 0, -100, { rim: 14 }, function (T) {
  const H = 37, Q = 28;   // the quays: the Horn at y 28, the Bosphorus at x 28
  T.ground(function (g) {
    IS.ground(g, -H, -H, Q, Q, '#E6DECC', { water: 'se' });
    IS.paving(g, -H, -H, Q, Q, { len: 2.4 });
    g.fill(K.rect(-H, 20, Q, Q), '#DCD3C0'); g.fill(K.rect(16, -H, Q, Q), '#DCD3C0');            // the quay strips
    g.fill(K.rect(-H, -24, 16, -17), '#EDE6D6');                                                  // the banks' street
    IS.quayLights(g, [[-34, 27.4], [-6, 27.4], [27.4, 23], [27.4, 13], [27.4, 4], [27.4, -8], [27.4, -19], [27.4, -30]]);   // at night low lights along the quays
  }, { rim: true });

  /* ---- Kılıç Ali Paşa mosque ---- */
  T.obj([-35, -35, -16, -17], (g) => IS.mosque(g, { cx: -25.5, cy: -27.5, s: 6.6, H: 7.2, R: 4.2, semis: ['x-'], towers: true, domeH: 0.9 }), { name: 'kılıç ali paşa' });
  T.obj([-34, -20.9, -17, -17.5], (g) => IS.portico(g, -32, -19, -17.5, 3.4, 4.8, { n: 5 }), { name: 'portico' });
  T.obj([-15.6, -33.6], (g) => IS.minaret(g, -15.6, -33.6, 24, { r: 0.75, bal: [14.5] }), { name: 'minaret' });
  /* ---- the banks' street: heavy stone façades; the baklava shop with its queue ---- */
  T.obj([-12, -36, 4, -25], (g) => IS.apt(g, -12, -36, 4, -25, { floors: 4, fh: 4.4, col: '#D9D3C6', shops: [{ word: 'BANKA', sign: '#3B3F47' }] }), { name: 'bank' });
  T.obj([6, -36, 26, -25], (g) => IS.apt(g, 6, -36, 26, -25, { floors: 4, fh: 4.0, col: '#E8D7BB', balc: true, shops: [{ word: 'BAKLAVA', sign: '#2E6E5A', aw: '#2E6E5A', lit: '#F0D9A0' }, { word: 'BÖREK', sign: '#B8322A', aw: '#E9E2D2', stripe: '#B8322A' }] }), { name: 'baklava' });
  // the houses inland
  T.obj([-36, -10, -26, 2], (g) => IS.konak(g, -36, -10, -26, 2, { floors: 3, col: IS.WALLS[4], shop: { word: 'KOKOREÇ', sign: '#B8322A', aw: '#B8322A' } }), { name: 'house' });
  T.obj([-36, 5, -27, 15], (g) => IS.konak(g, -36, 5, -27, 15, { floors: 2, col: IS.WALLS[7], shop: { word: 'BÜFE', sign: '#E6C24F' } }), { name: 'house' });
  /* ---- the ferry station on the Horn quay ---- */
  T.obj([-1, 18, 14, 27], function (g) {
    const W = { t: '#E9E3D3', l: '#F4F0E6', r: '#DDD6C5' };
    K.box(g, -1, 18, 14, 27, 0, 9.6, W, { w: 0.85 });
    for (let x = 0; x < 13.5; x += 2.5) { K.win(g, 'L', 27.02, x + 0.4, x + 1.9, 1.0, 3.9, { style: 'glass', arch: true, w: 0.4 }); K.win(g, 'L', 27.02, x + 0.4, x + 1.9, 5.6, 8.2, { style: 'glass', arch: true, w: 0.4 }); }
    for (let y = 19; y < 26; y += 2.5) K.win(g, 'R', 14.02, y + 0.3, y + 1.8, 5.6, 8.2, { style: 'glass', arch: true, w: 0.4 });
    g.fill(K.on('L', 27.03, -1, 14, 4.6, 5.1), '#D6CFBE');
    { const j0 = g.cmds.length; K.sign(g, 'L', 27.04, 1.5, 11.5, 8.5, 9.5, '#1F4E79', 'KARAKÖY', { w: 0.35 }); IS.litSign(g, j0, { col: '#CFE2FF' }); }
    for (const x of [0.4, 6.5, 12.6]) g.glow('lamp', x, 27.6, 4.85, { r: 1.1 });   // at night lamps on the quay face, their light on the Horn
    K.hip(g, -1.6, 17.4, 14.6, 27.6, 9.6, 2.6, '#8E9AA2', { ridge: 6, c: IS.C.leadInk, w: 0.75 });
    const c = g.p(6.5, 27.05, 11.0); K.box(g, 5.3, 21.8, 7.7, 24.2, 11.3, 14.4, W, { w: 0.6 }); K.hip(g, 5.0, 21.5, 8.0, 24.5, 14.4, 1.8, '#8E9AA2', { c: IS.C.leadInk, w: 0.55 }); const cc = g.p(6.5, 24.22, 13.0); g.disc2(cc, 1.15, '#FBF8EE'); g.mark({ nc: '#FFF4D8' }); g.ring2(cc, 1.15, { w: 0.35, c: '#3A3530' }); g.segs2([cc[0], cc[1], cc[0], cc[1] - 0.8, cc[0], cc[1], cc[0] + 0.6, cc[1] + 0.2], '#3A3530', 0.3); IS.glowDry(g, 'lantern', 6.5, 24.22, 13.0, { r: 1.2, col: '#FFF1D0' }); void c;   // the clock lit at night
  }, { name: 'karaköy pier' });
  IS.flag(T, 13.6, 26.6, 15.2, { L: 2.6, H: 1.7 }); T.obj([13.6, 26.6], (g) => IS.pole(g, 13.6, 26.6, 9.6, 5.6), { on: true, name: 'flagpole' });

  /* ---- the fish-sandwich boats moored at the Horn quay (they rock; the grills smoke) ---- */
  const BOATS = [{ x: -26, col: '#B8322A', trim: '#E3B53A', name: 'BALIK EKMEK' }, { x: -15, col: '#2B4F7A', trim: '#E3B53A', name: 'BALIK EKMEK' }];
  BOATS.forEach((B, bi) => {
    const cook = IS.who(1600 + bi, { top: '#F3F1EA', bot: '#F3F1EA', cap: '#F3F1EA', scarf: undefined, dress: undefined });
    T.actor({ sample: 2, period: 4, grow: false,
      at(t) { const f = Math.floor(((t * 2 + bi * 1.3) % 4 + 4) % 4), n = LOOK.night; return { x: B.x + 4.4, y: 31.4, z: IT.WL, key: f + (n ? 'n' : ''), f, n }; },
      draw(g, st) {
        const rock = [0, 0.18, 0, -0.18][st.f], P = (x, y, z) => [x - 4.4, y, z + rock * (x - 0) * 0.15];
        // the hull: a gilded, carved boat with a raised stern
        const hull = [P(-4.6, -2.2, 0), P(3.2, -2.2, 0), P(4.4, 0, 0.4), P(3.2, 2.2, 0), P(-4.6, 2.2, 0)];
        const top = hull.map((p) => [p[0], p[1], p[2] + 2.0 + (p[0] < -3.5 ? 0.9 : 0)]);
        g.fill([hull[4], hull[3], top[3], top[4]], B.col); g.fill([hull[3], hull[2], top[2], top[3]], shade(B.col, 0.1));
        g.fill(top, '#C9A26B'); g.outline(top, { w: 0.6, boil: false }); g.line([hull[4], hull[3], hull[2]], { w: 0.6, boil: false });
        g.line([[top[4][0], top[4][1] + 0.02, top[4][2] - 0.5], [top[3][0], top[3][1] + 0.02, top[3][2] - 0.5]], { w: 0.7, c: B.trim, boil: false });
        const orn = []; for (let x = -4; x < 3; x += 0.9) { const p = g.p.apply(g, P(x, 2.22, 1.0)); orn.push(p[0] - 0.5, p[1], p[0], p[1] - 0.8, p[0], p[1] - 0.8, p[0] + 0.5, p[1]); } g.segs2(orn, B.trim, 0.35); IS.litLines(g, g.cmds.length - 1);
        // the grill under a little canopy, the cook
        { const j0 = g.cmds.length; K.box(g, -2.6, -1.0, -0.4, 0.6, 2.0, 3.2, { t: '#3A3530', l: '#5A564E', r: '#4A4540' }, { w: 0.45, boil: false }); IS.litCols(g, j0, { '#3A3530': '#F0703A' }, { light: true }); }   // the grill glows at night
        IS.person(g, 0.8, 0.4, 2.0, Object.assign({}, cook, { dir: 1, pose: 'hold' }));
        for (const [x, y] of [[-4.2, -2.0], [-4.2, 2.0], [2.8, -2.0], [2.8, 2.0]]) { const a = g.p.apply(g, P(x, y, 2.0)), b = g.p.apply(g, P(x, y, 7.6)); g.line2([a, b], { w: 0.45, c: B.trim, boil: false, ext: 0 }); }
        const can = [P(-4.6, -2.4, 7.6), P(3.4, -2.4, 7.6), P(3.4, 2.4, 7.2), P(-4.6, 2.4, 7.2)]; g.fill(can, B.col); g.mark({ nc: true }); g.outline(can, { w: 0.5, boil: false });
        K.textP(g, (a, z) => P(a, 2.42, z), -3.6, 6.25, 0.7, B.name, '#F6E7A8', { w: 0.3 });
        // smoke from the grill
        const sm = g.p.apply(g, P(-1.5, -0.2, 3.4)); for (let i = 0; i < 3; i++) { g.disc2([sm[0] - i * 1.6 + st.f * 0.3, sm[1] - 3 - i * 2.6], 1.2 + i * 0.5, 'rgba(236,232,224,' + (0.7 - i * 0.18) + ')'); g.mark({ nc: 'rgba(255,196,150,' + (0.5 - i * 0.14).toFixed(2) + ')' }); }
        // at night the boat is lit up: a string of bulbs along the canopy's edge, its gilding shining, its lights broken on
        // the Horn below
        if (st.n) {
          for (let x = -4.2; x < 3.3; x += 1.05) { const p = g.p.apply(g, P(x, 2.42, 7.15)); g.disc2([p[0], p[1] + 0.3], 0.42, '#FFE7A0'); g.mark({ nc: true, light: true }); }
          for (let k = 0; k < 4; k++) { const a = g.p.apply(g, P(-4.2 + k * 0.4, 2.9, -0.4 - k * 0.9)), b = g.p.apply(g, P(3.0 - k * 0.5, 2.9, -0.4 - k * 0.9)); g.fill2([[a[0], a[1]], [b[0], b[1]], [b[0], b[1] + 0.7], [a[0], a[1] + 0.7]], 'rgba(255,214,140,' + (0.5 - k * 0.1).toFixed(2) + ')'); g.mark({ nc: true }); }
        }
      } });
  });
  // the customers on the quay: low stools, sandwiches, ayran
  for (const [x, s] of [[-30, 1], [-25, 2], [-19, 3], [-12, 4]]) T.cast([x, 24.5], (g) => { IS.stool2(g, g.p(x, 24, 1.3)); IS.person(g, x, 24, 1.3, IS.who(1610 + s, { dir: 1, pose: 'sit', cup: s % 2 === 1 })); IS.stool2(g, g.p(x + 2, 24.9, 1.3), '#C8372D'); IS.person(g, x + 2, 24.9, 1.3, IS.who(1620 + s, { dir: 1, pose: 'hold' })); }, { name: 'eaters' });

  /* ---- the fish market on the Bosphorus edge ---- */
  for (const [y0, y1, aw, seed] of [[14, 19, '#B8322A', 1], [6, 11, '#2E6E5A', 2], [-2, 3, '#B8322A', 3]]) T.obj([17, y0, 20.5, y1], function (g) {
    const i0 = g.cmds.length;
    K.box(g, 17, y0, 20.5, y1, 0, 2.4, { t: '#E9EEF0', l: '#CFD6DA', r: '#B9C1C6' }, { w: 0.6, boil: false });
    const R = RNG(seed * 77), fish = [];
    for (let y = y0 + 0.5; y < y1 - 0.3; y += 0.9) for (let x = 17.4; x < 20.2; x += 1.2) fish.push([x + R() * 0.3, y, R.pick(['#C9D3D9', '#B9C4CC', '#D98A8A', '#C9D3D9', '#E0C8A8'])]);
    for (const [x, y, c] of fish) { const p = g.p(x, y, 2.45); g.fill2([[p[0] - 1.4, p[1]], [p[0], p[1] - 0.5], [p[0] + 1.2, p[1]], [p[0], p[1] + 0.5]], c, true); g.fill2([[p[0] + 1.2, p[1]], [p[0] + 1.8, p[1] - 0.5], [p[0] + 1.8, p[1] + 0.5]], shade(c, 0.15), true); }
    for (const [x, y] of [[17.2, y0 + 0.2], [17.2, y1 - 0.2]]) { const a = g.p(x, y, 2.4), b = g.p(x, y, 7.0); g.line2([a, b], { w: 0.45, c: '#5A564E', boil: false }); }
    const can = [[16.6, y0 - 0.3, 7.0], [16.6, y1 + 0.3, 7.0], [21.6, y1 + 0.3, 6.0], [21.6, y0 - 0.3, 6.0]]; g.fill(can, aw); g.outline(can, { w: 0.55, boil: false });
    const lamp = g.p(19, (y0 + y1) / 2, 6.0); g.line2([lamp, [lamp[0], lamp[1] + 3]], { w: 0.3, c: '#3A3530', boil: false }); g.disc2([lamp[0], lamp[1] + 3.6], 0.8, '#E8573A');
    // at night the red lamp that makes the fish look fresh is on, the fish on the ice glisten under it
    g.mark({ nc: '#FF6A48' }); IS.lift(g, i0, 0.5); IS.litCols(g, i0, { [aw]: true });
    g.glow2('lantern', [lamp[0], lamp[1] + 3.6], g.p(19, (y0 + y1) / 2, 0), { r: 1.6, col: '#FF7A55' });
  }, { name: 'fish stall' });
  for (const [y, s] of [[16.5, 1], [8.5, 2], [0.5, 3]]) { T.cast([21.6, y], (g) => IS.person(g, 21.6, y, 0, IS.who(1630 + s, { dir: 0, pose: s === 2 ? 'wave' : 'hold', ph: 0.2, top: '#E9E2D2', bot: '#3B3F47', fcap: s === 1 ? '#3B3F47' : undefined, scarf: undefined, dress: undefined })), { name: 'fishmonger' }); T.cast([24.5, y + 1.2], (g) => IS.person(g, 24.5, y + 1.2, 0, IS.who(1640 + s, { dir: 2, pose: 'stand' })), { name: 'customer' }); }
  for (const [x, y, c, p] of [[22.6, 13.2, 0, 'sit'], [23.4, 4.4, 3, 'sit'], [21.4, -4, 1, 'loaf'], [26.2, 18.6, 2, 'stretch'], [25.4, 21.2, 4, 'sit']]) IS.cat(T, x, y, 0, { c, pose: p, fl: x > 23 ? -1 : 1 });
  IS.catWalk(T, [[18, 22], [26, 22], [26, -6], [18, -6]], { c: 5, speed: 1.0, sit: 6 });
  IS.gulls(T, 4, () => ({ x: 22, y: 10 }), { r: 7, z: 13, period: 24 });
  IS.gulls(T, 3, () => ({ x: -20, y: 31 }), { r: 6, z: 10, period: 20 });

  /* ---- the tea garden on the Bosphorus edge (north part) ---- */
  for (const [x, y, s] of [[20, -20, 1], [24.5, -16, 2], [20, -11, 3], [24.5, -7, 4]]) T.cast([x, y], (g) => { IS.stool2(g, g.p(x - 1.5, y - 0.3, 1.3)); IS.person(g, x - 1.5, y - 0.3, 1.3, IS.who(1650 + s * 2, { dir: 0, pose: 'sit' })); IS.teaTable2(g, x, y, 0); IS.stool2(g, g.p(x + 1.3, y + 0.9, 1.3)); IS.person(g, x + 1.3, y + 0.9, 1.3, IS.who(1651 + s * 2, { dir: 1, pose: 'sit', cup: true })); }, { name: 'tea table' });
  for (const [x, y] of [[18, -22.5], [26, -13], [18, -5.5]]) T.obj([x, y], (g) => { IS.plane(g, x, y, { r: 4.2, h: 5.6 }); g.glow('lamp', x, y, 4.6, { r: 0.9 }); }, { name: 'plane' });   // at night a bulb hung in each tree over the tea tables
  for (const [x, y] of [[-6, 14], [8, 12]]) T.obj([x, y], (g) => IS.erguvan(g, x, y, { r: 3.8 }), { name: 'erguvan' });
  for (const [x, y] of [[-2, -14], [14, 4], [-20, 18]]) T.obj([x, y], (g) => IS.lamp(g, x, y), { name: 'lamp' });

  /* ---- the plaza: an Ottoman street fountain (sebil), benches, a kiosk, people ---- */
  T.obj([-6, -6, 0, 0], (g) => IS.floodlit(g, 0.66, null, () => { const M = { t: '#ECE6D8', l: '#F3EFE6', r: '#DFD8C9' }; K.cyl(g, -3, -3, 2.6, 0, 4.2, M, { n: 8, w: 0.7, nt: true }); IS.arcade(g, 'R', -0.4, -4.6, -1.4, 0.8, 3.6, 1, { dark: '#9FB8BE' }); K.cyl(g, -3, -3, 3.2, 4.2, 4.7, M, { n: 8, w: 0.5 }); IS.dome(g, -3, -3, 2.6, 4.7, { drum: 0, h: 2.0, ribs: 8, w: 0.6 }); }), { name: 'sebil' });
  T.obj([6, -10, 10, -6], (g) => { K.box(g, 6, -10, 10, -6, 0, 3.6, { t: '#2E6E5A', l: '#3F7F6A', r: '#2E5E4E' }, { w: 0.6 }); g.fill(K.on('L', -5.98, 6.4, 9.6, 1.4, 3.0), '#E9E2D2'); g.mark({ nc: '#FFE2A0', win: 1, spill: true }); const j0 = g.cmds.length; K.sign(g, 'L', -5.96, 6.2, 9.8, 3.0, 3.6, '#E6C24F', 'GAZETE', { w: 0.28 }); IS.litSign(g, j0); K.hip(g, 5.6, -10.4, 10.4, -5.6, 3.6, 0.8, '#2E5E4E', { c: '#1E3E34', w: 0.5 }); }, { name: 'kiosk' });
  for (const [x, y] of [[-12, 0], [-12, 8]]) T.obj([x, y], (g) => K.bench(g, x, y, { face: 'R', L: 2.2, col: '#7A5A3C' }), { name: 'bench' });
  T.cast([-10.6, 4], (g) => { IS.person(g, -10.4, -0.6, 1.3, IS.who(1681, { dir: 0, pose: 'sit', hair: '#B9B3A8', cup: true })); IS.person(g, -10.4, 1.0, 1.3, IS.who(1682, { dir: 0, pose: 'sit', hair: '#8E8A84', cap: '#3B3F47' })); IS.person(g, -10.4, 8.4, 1.3, IS.who(1683, { dir: 0, pose: 'sit', phone: true, pose2: 0 })); IS.cat2(g, g.p(-10.4, 6.6, 1.3), { c: 2, pose: 'loaf' }); }, { on: true, name: 'bench sitters' });
  T.cast([4, -5], (g) => { IS.person(g, 4.4, -5.0, 0, IS.who(1684, { dir: 2, pose: 'hold' })); IS.person(g, 8.0, -4.4, 0, IS.who(1685, { dir: 1, pose: 'hold', top: '#2E6E5A' })); }, { name: 'kiosk' });
  for (let i = 0; i < 8; i++) { const R = RNG(i * 19 + 4), x0 = -4 + R() * 12, y0 = 2 + R() * 8; T.actor({ sample: 0.5, period: 18,
    at(t) { const u = ((t + 9) % 18 + 18) % 18, up = u > 14 && u < 16.6, f = up ? Math.floor(t * 8 + i) % 4 : (Math.floor(t * 2 + i * 1.7) % 3 === 0 ? 'u' : 'p'), h = up ? Math.sin(Math.PI * (u - 14) / 2.6) * 6 : 0; return { x: x0 + (up ? (u - 14) * 1.5 : 0), y: y0, z: h, key: up ? 'f' + f : f, f, up, fl: i % 2 ? 1 : -1 }; },
    draw(g, st) { const p = g.p(0, 0, 0); if (st.up) IS.gull2(g, p, st.f); else IS.pigeon2(g, p, st.fl, st.f === 'u'); } }); }

  /* ---- the baklava queue, walkers ---- */
  for (let i = 0; i < 6; i++) T.actor({ sample: 1, period: 12, at(t) { const sh = ((t / 2 + i) % 6), step = Math.floor(sh) === 0 ? 0.6 : 0; return { x: 16.6 - i * 1.25 + step, y: -23.2 + (i % 2) * 0.4, key: 's' + (i % 3 === 1 ? 'p' : ''), }; }, draw(g) { IS.person(g, 0, 0, 0, IS.who(1660 + i, { dir: 0, pose: i % 3 === 1 ? 'hold' : 'stand', phone: i % 3 === 1 })); } });
  IS.walker(T, IS.who(1671), [[-34, -20], [14, -20]], 1.3, { phase: 0.2 });
  IS.walker(T, IS.who(1672, { scarf: '#C9584B', dress: '#3B3F47' }), [[14, -21.5], [-34, -21.5]], 1.2, { phase: 0.5 });
  IS.walker(T, IS.who(1673, { tray: true, top: '#F3F1EA', scarf: undefined, dress: undefined }), [[-20, 21], [12, 21], [12, -8], [-20, -8]], 1.0, { phase: 0.1 });
  IS.walker(T, IS.who(1674), [[-22, 10], [10, 10], [10, -12], [-22, -12]], 1.2, { phase: 0.6 });
  IS.walker(T, IS.who(1675, { load: 'boxes', top: '#8A7A64', scarf: undefined, dress: undefined, cap: '#3B3F47' }), [[-30, 18], [-30, -14], [-14, -14], [-14, 18]], 0.8, { phase: 0.3 });
});
