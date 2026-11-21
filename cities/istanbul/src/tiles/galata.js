'use strict';
/* (-100,-100) Galata. What it is: the top of the hill north of the Golden Horn. The Galata Tower — a Genoese stone
   cylinder (diameter ~17 m, 63 m with its roof) of rough grey-beige stone, small arched slits climbing it, a cornice,
   the open arcaded gallery near the top with its balcony ring, and a tall lead cone — stands in its little cobbled square
   ringed with cafés. Along the far side runs the lower end of İstiklal Avenue: the red nostalgic tram shuttles from
   the Tünel station to the tile's edge, past Levantine apartment blocks (stone, bay windows, iron balconies, shops:
   books, music, pastry). Down the near side the quay on the Horn, with anglers. On the east edge the avenue climbs
   its ramp to the Galata Bridge (IS.ramp).
   Who is there: crowds on İstiklal, kids hanging on the tram's back step, a Maraş ice-cream man in his embroidered vest
   and fez teasing a child with the cone on his long paddle, tourists photographing the tower, a busker with a saz,
   café tables with tea, cats on the café chairs and on the quay. What moves: the tram, the walkers, the ice-cream trick,
   the flag on the tower, gulls circling it. */
SF.tile('galata', -100, -100, { rim: 0 }, function (T) {
  const H = 37, COB = '#E6DDCB', TW = { x: -16, y: 3, r: 5.4 };
  T.ground(function (g) {
    IS.ground(g, -H, -H, H, 28, COB, {});
    IS.paving(g, -H, -H, H, 28, { len: 2.2, dens: 0.6 });
    // İstiklal: smooth pale paving and the tram rails
    g.fill(K.rect(-H, -28, H, -20), '#EDE6D6');
    { const r = []; for (const d of [-0.9, 0.9]) { const a = g.p(-25, -24 + d, 0), b = g.p(H, -24 + d, 0); r.push(a[0], a[1], b[0], b[1]); } g.segs2(r, '#7E776B', 0.5); }
    // the tower square: a ring of darker setts
    const ring = []; for (let i = 0; i < 28; i++) { const a = TAU * i / 28; ring.push([TW.x + Math.cos(a) * 13, TW.y + Math.sin(a) * 11, 0]); }
    g.fill(ring, '#D9CDB4'); g.outline(ring, { w: 0.45, c: '#B5A68A', boil: false });
    for (let k = 1; k < 4; k++) { const rr = []; for (let i = 0; i <= 28; i++) { const a = TAU * i / 28; rr.push([TW.x + Math.cos(a) * (TW.r + 1 + k * 2), TW.y + Math.sin(a) * (TW.r + 1 + k * 1.6), 0]); } g.fine(rr, { w: 0.3, c: '#C9BB9E' }); }
    // the quay along the Horn
    g.fill(K.rect(-H, 21, H, 28), '#DCD3C0'); g.fill(K.rect(-H, 27.1, H, 28), IS.C.quayTop); g.line([[-H, 21, 0], [H, 21, 0]], { w: 0.4, c: '#B9AF9A', boil: false });
  }, { rim: true });

  /* ---- the north ramp of the Galata Bridge (on the avenue at the tile's east edge) ---- */

  /* ---- the far side of İstiklal: Levantine blocks with shops ---- */
  const shops = [
    [{ word: 'KİTAPÇI', sign: '#2E5E8A', aw: '#2E5E8A' }, { word: 'PLAK', sign: '#7A2E3A' }],
    [{ word: 'PASTANE', sign: '#B8322A', aw: '#E9C46A', stripe: '#B8322A' }, { word: 'ÇİÇEK', sign: '#3F6E5E' }],
    [{ word: 'MÜZİK', sign: '#3B3F47', aw: '#8E3A2E' }, { word: 'KAHVE', sign: '#6E4A33' }],
    [{ word: 'BÜFE', sign: '#E6C24F' }, { word: 'LOKANTA', sign: '#2E6E5A', aw: '#2E6E5A' }],
  ];
  [[-36, -22], [-21.5, -8], [-7.5, 8], [8.5, 24], [24.5, 36]].forEach(([a, b], i) => T.obj([a, -36.5, b, -29.5], (g) => IS.apt(g, a, -36.5, b, -29.5, { floors: 4 + (i % 2), fh: 4.0, col: ['#E7DCC6', '#E9CFA8', '#D9C9B8', '#EAD9BE', '#E3C9B5'][i], shops: shops[i % shops.length], faces: ['L'] }), { name: 'apartment' }));
  // the Tünel station at the avenue's west end
  T.obj([-37, -19.5, -28, -11], function (g) {
    K.box(g, -37, -19.5, -28, -11, 0, 7.5, { t: '#E3D6BE', l: '#EDE2CC', r: '#D8C9AE' }, { w: 0.85 });
    IS.arcade(g, 'R', -27.98, -18.6, -12, 0, 5.2, 3, { dark: '#5E584E' });
    K.box(g, -37.4, -19.9, -27.6, -10.6, 7.5, 8.3, '#CDBFA3', { w: 0.6 });
    K.sign(g, 'R', -27.6, -18.4, -12.2, 5.8, 7.1, '#B8322A', 'TÜNEL', { w: 0.35 });
  }, { name: 'tunel' });

  /* ---- the near side of İstiklal at the east end: a café block, the ice-cream stall ---- */
  T.obj([18, -17, 36, -9], (g) => IS.apt(g, 18, -17, 36, -9, { floors: 3, col: '#E5D3BB', shops: [{ word: 'MEYHANE', sign: '#7A2E3A', aw: '#7A2E3A' }, { word: 'BAKKAL', sign: '#3F6E5E', aw: '#E9E2D2', stripe: '#3F6E5E' }] }), { name: 'apartment' });
  T.obj([-25, -18.5, -20.5, -15.5], function (g) {   // the Maraş ice-cream cart: copper lids, a striped canopy
    K.box(g, -25, -18.5, -20.5, -15.5, 0, 3.2, { t: '#C9A26B', l: '#B8322A', r: '#9E2A22' }, { w: 0.6 });
    for (const x of [-23.8, -22.6, -21.4]) { const c = g.p(x, -17, 3.2); g.fill2(arcPts(c[0], c[1], 1.5, Math.PI, TAU, 8).concat([[c[0] + 1.5, c[1]]]), '#C98A4A', true); g.disc2([c[0], c[1] - 1.6], 0.35, '#8A5A2A'); }
    K.text(g, 'L', -15.48, -24.6, 0.8, 0.9, 'DONDURMA', '#F6F1E2', { w: 0.35 });
    for (const [x, y] of [[-24.8, -15.7], [-20.7, -15.7]]) { const a = g.p(x, y, 3.2), b = g.p(x, y, 7.4); g.line2([a, b], { w: 0.45, c: '#5A4A3C', boil: false }); }
    const can = [[-25.6, -19.2, 7.8], [-19.9, -19.2, 7.8], [-19.9, -14.8, 7.2], [-25.6, -14.8, 7.2]]; g.fill(can, '#E9E2D2');
    for (let i = 0; i < 6; i += 2) g.fill([[-25.6 + i * 0.95, -19.2, 7.8], [-25.6 + (i + 1) * 0.95, -19.2, 7.8], [-25.6 + (i + 1) * 0.95, -14.8, 7.2], [-25.6 + i * 0.95, -14.8, 7.2]], '#B8322A');
    g.outline(can, { w: 0.5, boil: false });
  }, { name: 'ice cream' });

  /* ---- the Galata Tower ---- */
  T.obj([TW.x - TW.r - 0.6, TW.y - TW.r - 0.6, TW.x + TW.r + 0.6, TW.y + TW.r + 0.6], function (g) {
    g.boilP = 0.3;
    const { x, y, r } = TW, S = { t: '#D9CDB4', l: '#E4D9C2', r: '#C3B597' };
    K.cyl(g, x, y, r + 0.5, 0, 2.2, { t: '#D2C6AC', l: '#DCD0B6', r: '#BBAD90' }, { n: 20, w: 0.8, nt: true });
    K.cyl(g, x, y, r, 2.2, 31, S, { n: 20, w: 1.0, nt: true });
    // rough stone courses and small arched slits climbing the shaft
    const st = [], R = RNG(31);
    for (let z = 3.4; z < 30.5; z += 1.3) { const a0 = A_L - 0.05, a1 = A_R + 0.05; let prev = null; for (let i = 0; i <= 10; i++) { const a = lerp(a0, a1, i / 10), p = g.p(x + (r + 0.02) * Math.cos(a), y + (r + 0.02) * Math.sin(a), z + (R() - 0.5) * 0.15); if (prev && R() < 0.75) st.push(prev[0], prev[1], p[0], p[1]); prev = p; } }
    g.segs2(st, '#B4A68A', 0.28);
    for (let k = 0; k < 9; k++) { const a = A_L + (A_R - A_L) * ((k * 0.37) % 1), z = 5 + k * 2.8, da = 0.07, q = [[x + (r + 0.03) * Math.cos(a - da), y + (r + 0.03) * Math.sin(a - da), z], [x + (r + 0.03) * Math.cos(a + da), y + (r + 0.03) * Math.sin(a + da), z]]; for (let j = 0; j <= 4; j++) { const t = Math.PI * j / 4, aa = a + da * Math.cos(t); q.push([x + (r + 0.03) * Math.cos(aa), y + (r + 0.03) * Math.sin(aa), z + 1.4 + 0.3 * Math.sin(t)]); } g.fill(q, '#4E4A42'); }
    // the arched door facing the square
    { const a = Math.PI * 0.42, da = 0.11, q = [[x + (r + 0.55) * Math.cos(a - da), y + (r + 0.55) * Math.sin(a - da), 0], [x + (r + 0.55) * Math.cos(a + da), y + (r + 0.55) * Math.sin(a + da), 0]]; for (let j = 0; j <= 6; j++) { const t = Math.PI * j / 6, aa = a + da * Math.cos(t); q.push([x + (r + 0.55) * Math.cos(aa), y + (r + 0.55) * Math.sin(aa), 2.6 + 0.8 * Math.sin(t)]); } g.fill(q, '#3E3A34'); }
    // the cornice, the upper storeys with big arched windows, the gallery ring and its rail
    K.cyl(g, x, y, r + 0.45, 31, 31.8, { t: '#CFC3A8', l: '#D6CAAE', r: '#B9AB8E' }, { n: 20, w: 0.7, nt: true });
    K.cyl(g, x, y, r - 0.2, 31.8, 37.2, S, { n: 20, w: 0.85, nt: true });
    for (let k = 0; k < 6; k++) { const a = A_L + (A_R - A_L) * (k + 0.5) / 6, da = 0.12, rr = r - 0.17, q = [[x + rr * Math.cos(a - da), y + rr * Math.sin(a - da), 32.4], [x + rr * Math.cos(a + da), y + rr * Math.sin(a + da), 32.4]]; for (let j = 0; j <= 5; j++) { const t = Math.PI * j / 5, aa = a + da * Math.cos(t); q.push([x + rr * Math.cos(aa), y + rr * Math.sin(aa), 35.4 + 0.8 * Math.sin(t)]); } g.fill(q, '#4E5866'); }
    K.cyl(g, x, y, r + 0.9, 32.9, 33.3, { t: '#B9AB8E', l: '#C9BB9E', r: '#A89A7E' }, { n: 20, w: 0.55 });
    const rl = []; for (let k = 0; k < 18; k++) { const a = A_L + (A_R - A_L) * k / 17, p0 = g.p(x + (r + 0.85) * Math.cos(a), y + (r + 0.85) * Math.sin(a), 33.3), p1 = g.p(x + (r + 0.85) * Math.cos(a), y + (r + 0.85) * Math.sin(a), 34.4); rl.push(p0[0], p0[1], p1[0], p1[1]); }
    g.segs2(rl, '#3A3530', 0.32); g.line(K.arc(x, y, 34.4, r + 0.85, A_L, A_R, 16), { w: 0.4, c: '#3A3530', boil: false });
    // the lead cone and the finial
    K.cyl(g, x, y, r + 0.2, 37.2, 37.8, { t: '#B9AB8E', l: '#C9BB9E', r: '#A89A7E' }, { n: 20, w: 0.55 });
    const ap = g.p(x, y, 47.5), base = g.P(K.arc(x, y, 37.8, r + 0.35, A_R, A_L, 16));
    g.fill2(base.concat([ap]), IS.C.lead); g.fill2(base.slice(0, 7).concat([ap]), shade(IS.C.lead, 0.14));
    const sm = []; for (let k = 1; k < 8; k++) { const q = base[k * 2]; sm.push(q[0], q[1], ap[0], ap[1]); } g.segs2(sm, shade(IS.C.lead, 0.22), 0.3);
    g.line2(base, { w: 0.8, c: IS.C.leadInk }); g.line2([base[0], ap], { w: 0.8, c: IS.C.leadInk }); g.line2([base[16], ap], { w: 0.8, c: IS.C.leadInk });
    IS.alem2(g, ap, 1.0);
  }, { name: 'galata tower' });
  // the tower's flag on the gallery
  IS.flag(T, TW.x + TW.r + 0.9, TW.y + 0.4, 38.6, { L: 2.6, H: 1.7 });
  T.obj([TW.x + TW.r + 0.9, TW.y + 0.4], (g) => IS.pole(g, TW.x + TW.r + 0.9, TW.y + 0.4, 33.3, 5.4), { on: true, name: 'flagpole' });

  /* ---- cafés round the square ---- */
  T.obj([-36, -5, -30, 5], (g) => IS.konak(g, -36, -5, -30, 5, { floors: 2, col: IS.WALLS[1], cumba: false, shop: { word: 'KAFE', sign: '#2E6E5A', aw: '#2E6E5A' } }), { name: 'house' });
  T.obj([10, -7, 20, 1], (g) => IS.konak(g, 10, -7, 20, 1, { floors: 3, col: IS.WALLS[3], shop: { word: 'ÇAY', sign: '#B8322A', aw: '#E9E2D2', stripe: '#B8322A' } }), { name: 'house' });
  // the houses stepping down to the quay
  [[-36, 9, -27, 19, 0], [7, 10, 17, 19, 5], [21, 8, 33, 18, 6]].forEach(([a, b, c, d, k]) => T.obj([a, b, c, d], (g) => IS.konak(g, a, b, c, d, { floors: 2 + (k % 2), col: IS.WALLS[k % IS.WALLS.length], shop: k % 3 === 0 ? { word: ['BALIKÇI', 'BAKKAL', 'BERBER'][k % 3], sign: '#2E5E8A' } : null }), { name: 'house' }));
  // plane trees and lamps on the square
  for (const [x, y] of [[2, 3], [-2, 17], [26, 3]]) T.obj([x, y], (g) => IS.plane(g, x, y, { r: 3.6, h: 4.5 }), { name: 'plane' });
  for (const [x, y] of [[-26, -3], [3, 13.6]]) T.obj([x, y], (g) => IS.lamp(g, x, y), { name: 'lamp' });
  // café tables on the square, people drinking tea
  for (const [x, y, s] of [[-26, 2, 1], [-25, 8, 2], [-4, -0.5, 3], [5, 9, 4]]) T.cast([x, y], (g) => {
    IS.stool2(g, g.p(x - 1.6, y - 0.4, 1.3)); IS.person(g, x - 1.6, y - 0.4, 1.3, IS.who(1100 + s * 3, { dir: 0, pose: 'sit', k: 0.95 }));
    IS.teaTable2(g, x, y, 0);
    IS.stool2(g, g.p(x + 1.4, y + 0.8, 1.3)); IS.person(g, x + 1.4, y + 0.8, 1.3, IS.who(1101 + s * 3, { dir: 1, pose: 'sit', k: 0.95, cup: true }));
  }, { name: 'café table' });

  /* ---- the living layer ---- */
  // tourists photographing the tower, a busker with a saz and his listeners, a guide
  T.cast([-6, 5], (g) => { IS.person(g, -5.8, 5.6, 0, IS.who(1131, { dir: 2, pose: 'hold', phone: true })); IS.person(g, -4.4, 6.6, 0, IS.who(1132, { dir: 2, pose: 'wave', ph: 0.3 })); }, { on: true });
  T.cast([-12, 13], (g) => { IS.stool2(g, g.p(-12, 13, 1.3), '#7A5A3C'); const r = IS.person(g, -12, 13, 1.3, IS.who(1133, { dir: 1, pose: 'sit' })); const h = r.hands[0]; g.fill2(arcPts(h[0] - 1.0, h[1] + 0.6, 1.6, 0, TAU, 10), '#A8743D', true); g.line2([[h[0] - 0.4, h[1]], [h[0] + 4.2, h[1] - 3.4]], { w: 0.5, c: '#6B4F35', boil: false, ext: 0 }); }, { on: true });
  T.cast([-8, 16.5], (g) => { IS.person(g, -8.4, 16.4, 0, IS.who(1134, { dir: 2 })); IS.person(g, -6.6, 17.4, 0, IS.who(1135, { dir: 2, k: 0.76 })); }, { on: true });
  // the Maraş ice-cream trick: the vendor offers the cone on his long paddle and whisks it away, again and again
  const kid = IS.who(1141, { k: 0.75, top: '#E6C24F' }), vend = IS.who(1142, { top: '#B8322A', bot: '#3B3F47', jacket: '#E9C46A', hairStyle: 'short', beard: true, scarf: undefined, dress: undefined });
  T.actor({ sample: 5, period: 6, at(t) { const f = Math.floor(((t % 3) + 3) % 3 * 2); return { x: -22.8, y: -14.0, key: f, f }; },
    draw(g, st) {
      const r = IS.person(g, 0, 0, 0, Object.assign({}, vend, { dir: 0, pose: 'hold' }));
      g.fill2([[r.crown[0] - 1.3, r.crown[1] + 0.9], [r.crown[0] + 1.3, r.crown[1] + 0.9], [r.crown[0] + 1.0, r.crown[1] - 1.6], [r.crown[0] - 1.0, r.crown[1] - 1.6]], '#A8251E', true);   // the fez
      const kp = g.p(3.0, 1.4, 0); IS.person(g, 3.0, 1.4, 0, Object.assign({}, kid, { dir: 2, pose: st.f === 2 ? 'cheer' : 'wave', ph: st.f * 0.3 }));
      const tip = st.f === 0 ? [kp[0] - 2.2, kp[1] - 15] : st.f === 1 ? [kp[0] - 1.0, kp[1] - 12] : st.f === 2 ? [kp[0] - 4, kp[1] - 22] : [kp[0] - 7, kp[1] - 19];
      g.line2([r.hands[0], tip], { w: 0.6, c: '#8A6A3A', boil: false, ext: 0 });
      if (st.f !== 3) { g.fill2([[tip[0] - 0.7, tip[1]], [tip[0] + 0.7, tip[1]], [tip[0], tip[1] + 2.4]], '#D9A65A', true); g.disc2([tip[0], tip[1] - 0.4], 1.0, '#F6F0E2'); }
    } });
  // the red nostalgic tram on İstiklal, kids on the back step
  { const X0 = -21, X1 = 27, V = 4.2, Tm = (X1 - X0) / V, DW = 4, PER = 2 * (Tm + DW), kids = [IS.who(1151, { k: 0.75, top: '#3F5F8F' }), IS.who(1152, { k: 0.75, top: '#C9584B', hairStyle: 'short' })];
    T.actor({ sample: 0.2, period: PER, grow: false,
      at(t) { const u = ((t % PER) + PER) % PER; let x, d; if (u < DW) { x = X0; d = 1; } else if (u < DW + Tm) { x = X0 + (X1 - X0) * (1 - Math.cos(Math.PI * (u - DW) / Tm)) / 2; d = 1; } else if (u < 2 * DW + Tm) { x = X1; d = -1; } else { x = X1 - (X1 - X0) * (1 - Math.cos(Math.PI * (u - 2 * DW - Tm) / Tm)) / 2; d = -1; } const ph = Math.floor(t * 2) % 4; return { x, y: -24, key: d + '.' + ph, d, ph: ph / 4 }; },
      draw(g, st) { IS.nostTram(g, st.d > 0 ? 0 : Math.PI, { word: 'TÜNEL-TAKSİM', kids: st.d > 0 ? kids : kids.slice(1), dirSign: 1, ph: st.ph }); } }); }
  // the İstiklal crowd
  const lanes = [[-21.2, 1.25], [-26.8, 1.15], [-22, 1.35], [-26.5, 1.2]];
  for (let i = 0; i < 10; i++) { const [y, sp] = lanes[i % 4], fw = i % 2 === 0; IS.walker(T, IS.who(1160 + i, i === 3 ? { tray: true, top: '#F3F1EA', scarf: undefined } : {}), fw ? [[-27, y], [36, y]] : [[36, y], [-27, y]], sp, { phase: i * 0.137 }); }
  // the quay: anglers on the edge, a cat, walkers
  for (const [x, s] of [[-30, 1171], [-12, 1172], [14, 1173]]) T.cast([x, 26.4], (g) => { IS.person(g, x, 26.4, 0, IS.who(s, { dir: 1, pose: 'hold', fcap: '#3B3F47' })); const a = g.p(x - 0.2, 27, 4.2), b = g.p(x - 0.2, 31.5, 7.5), c = g.p(x - 0.2, 33.5, IT.WL); g.line2([a, b], { w: 0.45, c: '#3A3128', boil: false, ext: 0 }); g.fine2([b, c], { w: 0.22, c: '#5A564E' }); const bk = g.p(x + 1.2, 25.6, 0); g.fill2([[bk[0] - 1, bk[1]], [bk[0] + 1, bk[1]], [bk[0] + 1.3, bk[1] - 2], [bk[0] - 1.3, bk[1] - 2]], '#3F7FB8', true); }, { on: true });
  IS.cat(T, 15.6, 25, 0, { c: 0, pose: 'sit', fl: -1 });
  IS.cat(T, -24.2, 1.2, 1.3, { c: 3, pose: 'loaf' });
  IS.catWalk(T, [[-30, 22.5], [30, 22.5]], { c: 2, speed: 1.0, sit: 5 });
  IS.walker(T, IS.who(1175), [[-34, 23.5], [34, 23.5]], 1.2, { phase: 0.2 }); IS.walker(T, IS.who(1176, { scarf: '#5FA58F' }), [[34, 24.6], [-34, 24.6]], 1.1, { phase: 0.6 });
  IS.walker(T, IS.who(1177), [[30, -10], [30, 18], [24, 21], [30, -10]], 1.1, { phase: 0.1 });
  // gulls round the top of the tower
  IS.gulls(T, 3, () => ({ x: TW.x, y: TW.y }), { r: 9, z: 44, period: 20 });
});
