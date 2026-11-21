'use strict';
/* (-100,100) Montjuïc seen from Plaça d'Espanya, the classic view up the axis (turned to run along +x here).
   Built: the hill on the left as a terrace with a rubble retaining wall and pines; on it the Palau Nacional (MNAC):
   a long pale stone front, the big central dome on its drum, two smaller domes, four corner towers like belfries;
   the cascade of water steps down the hill between two flights of stairs; the Magic Fountain's great round basin at
   the foot; the Avinguda de Maria Cristina running to the two red-brick Venetian towers at the near end, lamps
   along it; exhibition halls on either side, gardens.
   Who: people sitting on the steps to watch the fountain, a crowd round the basin (phones up), couples on the
   avenue, a family with a stroller. What moves: the Magic Fountain dances — rings of jets rise and fall in waves,
   the centre jet shoots up, the colours change every few seconds (a pure function of t); strollers; a few people
   climbing the stairs. */
SF.tile('montjuic', -100, 100, { rim: 64 }, function (T) {
  const HILL = 8, HX = -18, FX = 2, FY = 0, FR = 7.2;
  const STN = { t: '#EFE6D2', l: '#E8DCC2', r: '#D3C3A2' }, BRICK = { t: '#C9734F', l: '#C46A48', r: '#A5563A' };
  const stepZ = (x) => (x <= HX ? HILL : x >= -6 ? 0 : HILL * (-6 - x) / 12);
  T.ground(function (g) {
    BC.ground(g, '#E3DCCB');
    // the avenue and the plaza round the fountain
    g.fill(K.rect(-6, -10, 37, 10), '#E6DCC6'); g.scuff(K.rect(-6, -10, 37, 10), { dir: Math.atan2(AY, AX), len: 3, c: '#F0E8D6', dens: 0.5, w: 0.45, spread: 0.5 });
    // gardens either side
    for (const r of [[-6, 12, 37, 30], [-6, -30, 8, -12]]) { const p = K.rect(r[0], r[1], r[2], r[3]); g.fill(p, '#BCD093'); g.grass(p, { dens: 0.7 }); g.outline(p, { w: 0.4, c: '#7F9A5E', boil: false }); }
    // the fountain's basin: a low stone rim round shallow water
    const rim = [], wat = []; for (let i = 0; i < 40; i++) { const a = TAU * i / 40; rim.push([FX + Math.cos(a) * FR, FY + Math.sin(a) * FR * 0.95, 0]); wat.push([FX + Math.cos(a) * (FR - 0.8), FY + Math.sin(a) * (FR - 0.8) * 0.95, 0.05]); }
    g.fill(rim, '#D9CDB4'); g.fill(wat, '#9FC9D2'); g.water(wat, { dens: 0.9 }); g.outline(rim, { w: 0.6, boil: false }); g.outline(wat, { w: 0.4, c: '#6F9AA6', boil: false });
  }, { rim: true });

  /* ---- the hill: a terrace with a retaining wall, pines, the palace on top ---- */
  T.obj([-37, -37, HX, 37], function (g) {
    g.boilP = 0.2;
    const poly = [[-37, -27], [-27, -37], [HX, -37], [HX, 37], [-27, 37], [-37, 27]];
    BC.prism(g, poly, 0, HILL, { t: '#C9D39A', l: '#BFA27A', r: '#A88C66' }, { w: 0.85, top: '#C9D39A' });
    g.grass(poly.map((p) => [p[0], p[1], HILL]), { dens: 0.6 });
    const rb = []; const R = RNG(2201); for (let i = 0; i < 70; i++) { const p = g.p(HX + 0.02, lerp(-36, 36, R()), R() * (HILL - 0.5)); rb.push(p[0] - 0.8, p[1], p[0] + 0.8, p[1] - 0.2); } g.segs2(rb, '#8C7458', 0.4);
    // the terrace in front of the palace
    g.fill(K.rect(-24, -16, HX, 16, HILL), '#E6DCC6');
  }, { name: 'hill' });
  T.obj([-35, -16, -22, 16], function (g) {
    g.boilP = 0.18;
    const z0 = HILL;
    K.box(g, -35, -16, -24, 16, z0, z0 + 9, STN, { w: 0.9 });
    for (let y = -14; y < 15; y += 2.6) { K.win(g, 'R', -24, y, y + 1.3, z0 + 1, z0 + 4, { style: 'navy', arch: true }); K.win(g, 'R', -24, y + 0.2, y + 1.1, z0 + 5.4, z0 + 7.6, { style: 'navy' }); }
    // the portico in the middle
    g.fill([[-24, -5, z0 + 8], [-22, -5, z0 + 8], [-22, 5, z0 + 8], [-24, 5, z0 + 8]], '#F2EADA'); g.fill(K.on('R', -21.98, -5, 5, z0 + 7.4, z0 + 8), '#E8DCC2'); g.line([[-22, -5, z0 + 7.4], [-22, 5, z0 + 7.4]], { w: 0.5, boil: false }); g.fill(K.on('R', -23.95, -4, 4, z0, z0 + 7.4), '#8C8476');
    const col = []; for (let y = -4.4; y <= 4.5; y += 1.8) { const a = g.p(-21.9, y, z0), b = g.p(-21.9, y, z0 + 7.4); col.push(a[0], a[1], b[0], b[1]); } g.segs2(col, '#F6EEDB', 1.2);
    // corner towers like belfries
    for (const [x, y] of [[-26, -14], [-26, 14], [-33, -14], [-33, 14]]) { K.box(g, x - 1.4, y - 1.4, x + 1.4, y + 1.4, z0 + 9, z0 + 16, STN, { w: 0.7, nohid: true }); K.win(g, 'R', x + 1.4, y - 0.6, y + 0.6, z0 + 12, z0 + 14.5, { style: 'dark', arch: true }); K.dome(g, x, y, 1.6, z0 + 16, 2.2, '#D9CFB8', { w: 0.6 }); const t = g.p(x, y, z0 + 18.4); g.segs2([t[0], t[1], t[0], t[1] - 3], '#8A7A5A', 0.5); }
    // the side domes and the big central dome on its drum
    for (const y of [-9, 9]) { K.cyl(g, -29.5, y, 2.4, z0 + 9, z0 + 11, STN, { w: 0.6, n: 12 }); K.dome(g, -29.5, y, 2.4, z0 + 11, 2.8, '#C9C2B2', { w: 0.6, shadow: '#ADA594' }); }
    K.cyl(g, -29.5, 0, 4.6, z0 + 9, z0 + 13, STN, { w: 0.8, n: 18 });
    for (let i = 0; i < 6; i++) { const a = -Math.PI * 0.15 + i * 0.22, c = [-29.5 + Math.cos(a) * 4.65, Math.sin(a) * 4.65]; g.fill([[c[0], c[1] - 0.3, z0 + 10], [c[0], c[1] + 0.3, z0 + 10], [c[0], c[1] + 0.3, z0 + 12.2], [c[0], c[1] - 0.3, z0 + 12.2]], '#5A6470'); }
    K.dome(g, -29.5, 0, 4.4, z0 + 13, 5.6, '#C9C2B2', { w: 0.8, shadow: '#A8A090', ribs: 12, ribCol: '#9A9282', ribW: 0.35 });
    const lan = g.p(-29.5, 0, z0 + 18.6); K.cyl(g, -29.5, 0, 0.9, z0 + 18.4, z0 + 20.4, STN, { w: 0.5, n: 8 }); g.disc2([lan[0], lan[1] - 8.5], 0.6, '#D8AE48');
  }, { name: 'palau nacional', on: true });
  for (const [x, y] of [[-34, -30], [-30, -24], [-24, -32], [-34, 24], [-28, 30], [-22, 26], [-21, -22]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.6, h: 4.6, z: HILL, col: '#6E9A50' }), { name: 'pine', on: true });

  /* ---- the cascade and the stairs down the hill ---- */
  T.obj([HX, -8, -6, 8], function (g) {
    g.boilP = 0.2;
    const n = 12;
    for (let i = 0; i < n; i++) {
      const xa = HX + i, xb = xa + 1, z = HILL * (1 - (i + 1) / n);
      for (const [ya, yb, col] of [[-8, -3, '#E6DCC6'], [3, 8, '#E6DCC6'], [-3, 3, '#A9D3DC']]) {
        g.fill([[xa, ya, z], [xb, ya, z], [xb, yb, z], [xa, yb, z]], i % 2 && col !== '#A9D3DC' ? '#DED3BA' : col);
        g.fill([[xb, ya, z], [xb, yb, z], [xb, yb, z - HILL / n], [xb, ya, z - HILL / n]], col === '#A9D3DC' ? '#F3FAFB' : '#C9BCA0');
      }
    }
    // the low walls of the cascade
    for (const y of [-3, 3]) g.line([[HX, y, HILL + 0.6], [-6, y, 0.6]], { w: 0.7, c: '#9A8A68', boil: false });
    for (const y of [-8, 8]) g.line([[HX, y, HILL + 0.4], [-6, y, 0.4]], { w: 0.6, boil: false });
  }, { name: 'cascade' });

  /* ---- the Venetian towers at the near end of the avenue, lamps, the halls ---- */
  for (const y of [-7, 7]) T.obj([28.5, y - 1.5, 31.5, y + 1.5], function (g) {
    K.box(g, 28.5, y - 1.5, 31.5, y + 1.5, 0, 17, BRICK, { w: 0.8 });
    const br = []; for (let z = 1; z < 17; z += 1.2) { const a = g.p(28.5, y + 1.52, z), b = g.p(31.5, y + 1.52, z), c = g.p(31.52, y - 1.5, z); br.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); } g.segs2(br, '#A5563A', 0.25);
    K.win(g, 'L', y + 1.5, 29.4, 30.6, 13.5, 16, { style: 'dark', arch: true }); K.win(g, 'R', 31.5, y - 0.6, y + 0.6, 13.5, 16, { style: 'dark', arch: true });
    K.box(g, 28.2, y - 1.8, 31.8, y + 1.8, 17, 17.6, { t: '#EFE6D2', l: '#E8DCC2', r: '#D3C3A2' }, { w: 0.6, nohid: true });
    const b = g.p(30, y, 17.6), t = g.p(30, y, 22); g.fill2([[b[0] - 6, b[1]], [b[0] + 6, b[1]], t], '#C46A48', true); g.fill2([[b[0], b[1]], [b[0] + 6, b[1]], t], '#A5563A', true); g.line2([[b[0] - 6, b[1]], t, [b[0] + 6, b[1]]], { w: 0.6, boil: false });
  }, { name: 'venetian tower' });
  for (let x = 12; x <= 26; x += 7) for (const y of [-9, 9]) T.obj([x, y], (g) => BC.lamp(g, x, y, { side: y > 0 ? -1 : 1 }), { name: 'lamp' });
  T.obj([-4, -35, 26, -13], function (g) { K.box(g, -4, -33, 26, -13, 0, 8, STN, { w: 0.85 }); for (let x = -2; x < 25; x += 3) K.win(g, 'L', -13, x, x + 1.5, 1.5, 6.5, { style: 'navy', arch: true }); K.text(g, 'L', -12.95, 11, 6.8, 0.9, 'FIRA DE BARCELONA', '#7A5A2C', { center: true }); }, { name: 'fira hall' });
  for (const [x, y] of [[0, 20], [10, 24], [20, 20], [30, 25], [-2, -22], [34, -20]]) T.obj([x, y], (g) => BC.plane(g, x, y, { r: 3.6, h: 5.6 }), { name: 'tree' });

  /* ---- the Magic Fountain: rings of jets in waves, colours changing ---- */
  const PAL = [['#E86AA6', '#F6C2DC'], ['#4FA8E6', '#BFE2F8'], ['#F0BE3A', '#FBE6A6'], ['#9A7CE0', '#DCD0F6'], ['#4FC898', '#C6F0DC']];
  T.actor({ sample: 5, period: 60, grow: false,
    at(t) { const pat = Math.floor(t / 6) % 5, q = Math.floor(t * 6) % 36; return { x: FX + FR * 0.7, y: FY + FR * 0.7, key: pat + '.' + q, pat, q }; },
    draw(g, st) {
      const ox = -FR * 0.7, oy = -FR * 0.7, [c0, c1] = PAL[st.pat], ph = st.q / 36 * TAU;
      const jets = [];
      for (let i = 0; i < 18; i++) { const a = TAU * i / 18, h = st.pat % 2 ? 5 + 6 * Math.max(0, Math.sin(ph + i * 0.7)) : 4 + 8 * Math.max(0, Math.sin(ph * 2 - a)); jets.push([ox + Math.cos(a) * 5.4, oy + Math.sin(a) * 5.4 * 0.95, h, 1]); }
      for (let i = 0; i < 10; i++) { const a = TAU * i / 10 + 0.3, h = 8 + 7 * Math.max(0, Math.sin(ph + (st.pat > 2 ? a * 2 : 0))); jets.push([ox + Math.cos(a) * 3.0, oy + Math.sin(a) * 2.9, h, 1.3]); }
      jets.push([ox, oy, 14 + 10 * Math.max(0, Math.sin(ph * 0.5 + 1)), 2.6]);
      jets.sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]));
      for (const [x, y, h, w] of jets) {
        const b = g.p(x, y, 0.1), t = g.p(x, y, h), sp = w * 1.6;
        g.fill2([[b[0] - w * 0.5, b[1]], [b[0] + w * 0.5, b[1]], [t[0] + sp * 0.5, t[1] + 2], [t[0], t[1] - 1.2], [t[0] - sp * 0.5, t[1] + 2]], c1, true);
        g.fill2([[b[0] - w * 0.2, b[1]], [b[0] + w * 0.2, b[1]], [t[0] + 0.2, t[1] + 1], [t[0] - 0.2, t[1] + 1]], c0, true);
        g.segs2([t[0] - sp, t[1] + 3.2, t[0] - sp * 0.4, t[1] + 0.2, t[0] + sp * 0.4, t[1] + 0.2, t[0] + sp, t[1] + 3.2], '#FFFFFF', 0.35);
      }
      const mist = []; for (let i = 0; i < 16; i++) { const a = TAU * i / 16 + st.q * 0.2, p = g.p(ox + Math.cos(a) * 5.4, oy + Math.sin(a) * 5.2, 0.4); mist.push(p); } for (const p of mist) g.disc2(p, 1.0, c1);
    } });

  /* ---- people ---- */
  // sitting on the steps beside the cascade, watching
  for (let i = 0; i < 12; i++) { const x = HX + 1.5 + (i % 6) * 2, y = i < 6 ? -6.5 + (i % 2) : 5.0 + (i % 2), z = stepZ(x + 0.5); T.cast([x, y], (g) => BC.person(g, x, y, z + 0.3, BC.who(2210 + i, { dir: 0, pose: 'sit' })), { on: true }); }
  // round the basin: a ring of spectators, some with phones up
  for (let i = 0; i < 14; i++) { const a = -Math.PI * 0.9 + i * (Math.PI * 1.8 / 13), r = FR + 1.6 + (i % 2) * 1.1, x = FX + Math.cos(a) * r, y = FY + Math.sin(a) * r; if (x < -5) continue; const face = BC.dirOf(FX - x, FY - y), ph = i % 3 === 0; T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(2230 + i, { dir: face, pose: ph ? 'hold' : 'stand', phone: ph, hands: ph ? [[2.2, -16.8], [1.6, -16.2]] : null })), {}); }
  // strollers on the avenue, a family with a stroller, people climbing the stairs
  BC.walker(T, BC.who(2250), [[34, -4], [12, -4]], 1.2, { phase: 0.0 }); BC.walker(T, BC.who(2251, { sunhat: true }), [[12, 4.5], [34, 4.5]], 1.1, { phase: 0.5 });
  BC.walker(T, BC.who(2252), [[33, 2], [12, 2]], 1.0, { phase: 0.3, extra: (g, st) => { const s = st.dir === 0 || st.dir === 3 ? 1 : -1, p = g.p(0, 0, 0), q = [p[0] + s * 5.2, p[1] - 0.6]; for (const d of [-1.6, 1.4]) { g.disc2([q[0] + d, q[1] - 0.2], 0.7, '#2A2622'); } g.fill2(K.curve([[q[0] - 2.4, q[1] - 1.4], [q[0] + 2.4, q[1] - 1.4], [q[0] + 2.6, q[1] - 4.4], [q[0] + 0.4, q[1] - 6.2], [q[0] - 2.2, q[1] - 4.0]], 2, true), '#3F5F8F', true); g.segs2([q[0] - s * 2.2, q[1] - 3.6, q[0] - s * 3.6, q[1] - 7.6], '#2A2622', 0.4); } });
  BC.walker(T, BC.who(2253), [[-7, 6.2], [HX + 0.4, 6.2]], 0.7, { phase: 0.2, z: (x) => stepZ(x) });
  BC.walker(T, BC.who(2254), [[HX + 0.4, -5.5], [-7, -5.5]], 0.7, { phase: 0.6, z: (x) => stepZ(x) });
  // up on the terrace in front of the palace
  for (const [x, y, s] of [[-20, -10, 2260], [-21, 11, 2261]]) T.cast([x, y], (g) => BC.person(g, x, y, HILL, BC.who(s, { dir: 0, pose: 'hold', phone: true })), { on: true });

  BC.block(T, { skip: { 'x+': [[-12, 12]] }, corners: { nn: 'bins', np: 'bicing', pp: 'motos' }, noTrees: ['x-'] });
});
