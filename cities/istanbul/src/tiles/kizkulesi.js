'use strict';
/* (100,0) The bay, with the Maiden's Tower (Kız Kulesi). What it is: open water where the Bosphorus widens into the
   Sea of Marmara between Üsküdar and Kadıköy. On a low rock islet a stone terrace with a two-storey white house and
   the tower: a square stone shaft, then a white drum with a gallery, a lead cupola, a lantern and the flag. A small
   landing on the rock with a launch tied up. On the bay's south shore the KADIKÖY pier: a timber deck on piles, a
   pale waiting hall with two turrets, the berth on its north face where the Eminönü ferry docks (route A).
   What moves: the ferry (water.js), a rowing boat circling the tower, dolphins arcing out of the water now and then,
   gulls round the tower, the flag, waves breaking white on the rock. */
SF.tile('kizkulesi', 100, 0, { rim: 30, shared: false }, function (T) {
  const WL = IT.WL, TX = 12, TY = -9;
  T.ground(function (g) {
    // the rock: a low brushed islet with boulders, white water breaking on it
    const R = RNG(31), pts = []; for (let i = 0; i < 14; i++) { const a = TAU * i / 14, r = 7.4 + R() * 1.6; pts.push([TX + Math.cos(a) * r, TY + Math.sin(a) * r * 0.9, WL]); }
    g.fill(pts.map((p) => [TX + (p[0] - TX) * 1.25, TY + (p[1] - TY) * 1.25, WL]), '#D7ECE8');
    g.fill(pts, '#8E8676');
    g.fill(pts.map((p) => [TX + (p[0] - TX) * 0.86, TY + (p[1] - TY) * 0.86, WL + 0.8]), '#A69E8C');
    g.outline(pts, { w: 0.7, c: '#5A5348', boil: false });
    const b = []; for (let i = 0; i < 18; i++) { const a = R() * TAU, r = 6.2 + R() * 2.6, p = g.p(TX + Math.cos(a) * r, TY + Math.sin(a) * r * 0.9, WL + 0.3); b.push(p); }
    for (const p of b) { g.disc2(p, 1.0 + R() * 0.8, '#7E7666'); }
    g.water(K.rect(-34, -32, 34, 20, WL), { dens: 0.35, c: '#5E9396' });
  }, { rim: true });

  /* ---- the Maiden's Tower on its terrace ---- */
  T.obj([TX - 6.5, TY - 6, TX + 6.5, TY + 6], function (g) {
    g.boilP = 0.3;
    const S = { t: '#E3DBC8', l: '#EDE6D6', r: '#D3CAB5' }, W = { t: '#EFEBE1', l: '#F7F4EC', r: '#E3DED2' };
    K.box(g, TX - 6.5, TY - 5.5, TX + 6.5, TY + 5.5, WL + 0.6, 0.6, { t: '#D9D0BC', l: '#C9BFA9', r: '#B5AA93' }, { w: 0.8 });   // the terrace wall
    const rl = []; for (let x = TX - 6.3; x <= TX + 6.3; x += 0.9) { const a = g.p(x, TY + 5.5, 0.6), c = g.p(x, TY + 5.5, 1.6); rl.push(a[0], a[1], c[0], c[1]); } for (let y = TY - 5.3; y <= TY + 5.3; y += 0.9) { const a = g.p(TX + 6.5, y, 0.6), c = g.p(TX + 6.5, y, 1.6); rl.push(a[0], a[1], c[0], c[1]); }
    // the house on the east half of the terrace
    K.box(g, TX + 0.5, TY - 4.5, TX + 5.6, TY + 4.0, 0.6, 7.0, W, { w: 0.8 });
    for (const y of [TY - 3.2, TY - 0.6, TY + 2]) { K.win(g, 'R', TX + 5.62, y, y + 1.3, 1.6, 3.6, { style: 'glass', arch: true, w: 0.4 }); K.win(g, 'R', TX + 5.62, y, y + 1.3, 4.4, 6.2, { style: 'glass', arch: true, w: 0.4 }); }
    K.win(g, 'L', TY + 4.02, TX + 1.6, TX + 3.2, 1.6, 3.6, { style: 'glass', arch: true, w: 0.4 }); K.win(g, 'L', TY + 4.02, TX + 1.6, TX + 3.2, 4.4, 6.2, { style: 'glass', arch: true, w: 0.4 });
    K.hip(g, TX + 0.2, TY - 4.8, TX + 5.9, TY + 4.3, 7.0, 1.6, '#8E9AA2', { ridge: 3, c: IS.C.leadInk, w: 0.6 });
    // the tower: a square stone shaft, the drum, the gallery, the cupola, the lantern
    K.box(g, TX - 4.6, TY - 2.2, TX - 0.2, TY + 2.2, 0.6, 9.6, S, { w: 0.85 });
    for (const z of [3, 6.4]) K.win(g, 'L', TY + 2.22, TX - 3.2, TX - 1.6, z, z + 1.8, { style: 'dark', arch: true, col: '#4E5866', w: 0.35 });
    K.win(g, 'R', TX - 0.18, TY - 0.8, TY + 0.8, 6.4, 8.2, { style: 'dark', arch: true, col: '#4E5866', w: 0.35 });
    K.cyl(g, TX - 2.4, TY, 1.9, 9.6, 13.4, W, { n: 14, w: 0.75, nt: true });
    for (let k = 0; k < 4; k++) { const a = A_L + (A_R - A_L) * (k + 0.5) / 4, q = []; for (const [dz, da] of [[10.4, -0.16], [10.4, 0.16], [12.6, 0.16], [12.6, -0.16]]) q.push([TX - 2.4 + 1.92 * Math.cos(a + da), TY + 1.92 * Math.sin(a + da), dz]); g.fill(q, '#4E5866'); }
    K.cyl(g, TX - 2.4, TY, 2.5, 13.4, 13.8, { t: '#E3DED2', l: '#D3CAB5', r: '#BDB29A' }, { n: 14, w: 0.55 });
    IS.dome(g, TX - 2.4, TY, 1.8, 13.8, { drum: 0.4, win: 0, h: 1.7, ribs: 8 });
    K.cyl(g, TX - 2.4, TY, 0.55, 15.9, 17.0, W, { n: 8, w: 0.45 }); K.cone(g, TX - 2.4, TY, 0.7, 17.0, 0.8, IS.C.lead);
  }, { name: "maiden's tower" });
  IS.flag(T, TX - 2.4, TY, 21.6, { L: 2.4, H: 1.6 }); T.obj([TX - 2.4, TY + 0.01], (g) => IS.pole(g, TX - 2.4, TY + 0.01, 17.8, 3.8), { on: true, name: 'flagpole' });
  // the landing on the rock and the launch tied up
  T.obj([TX - 10, TY + 3, TX - 6, TY + 6], (g) => { K.box(g, TX - 10, TY + 3, TX - 6, TY + 6, WL, 0.2, { t: '#B79A74', l: '#9C8262', r: '#86704F' }, { w: 0.55 }); g.at(TX - 9.5, TY + 9.2, WL, (g2) => K.boat(g2, 0, { kind: 'motor', L: 3.6, W: 1.5, hull: '#F3F1EA', stripe: '#C8372D' })); }, { name: 'landing' });
  T.cast([TX - 7, TY + 4.4], (g) => IS.person(g, TX - 7, TY + 4.4, 0.2, IS.who(1701, { dir: 1, pose: 'wave', ph: 0.4 })), { on: true });
  T.cast([TX + 3, TY + 4.9], (g) => { IS.person(g, TX + 2.2, TY + 4.9, 0.6, IS.who(1702, { dir: 1, pose: 'hold', phone: true })); IS.person(g, TX + 3.6, TY + 5.0, 0.6, IS.who(1703, { dir: 1 })); }, { on: true });

  /* ---- the Kadıköy pier on the bay's south shore ---- */
  T.obj([-12, 24.4, 8, 37], (g) => IS.iskele(g, -12, 24.4, 8, 37, { b: [-1, 27, 7, 35.5], H: 6, name: 'KADIKÖY', clock: [3, 31], bollards: [[-11.4, 25], [7.4, 25]] }), { name: 'kadıköy pier' });
  for (let i = 0; i < 6; i++) T.cast([-9 + i * 1.3, 29 + (i % 2) * 1.6], (g) => IS.person(g, -9 + i * 1.3, 29 + (i % 2) * 1.6, 0, IS.who(1710 + i, { dir: 3, pose: i % 3 === 0 ? 'hold' : 'stand', phone: i % 3 === 0 })), { on: true });

  /* ---- life on the water ---- */
  // a rowing boat circling the tower
  { const who = IS.who(1720, { fcap: '#C8372D' }); T.actor({ grow: false, sample: 0.5, period: 48,
    at(t) { const a = TAU * t / 48, x = TX + Math.cos(a) * 13, y = TY + Math.sin(a) * 10, q = Math.round((a + Math.PI / 2) / (TAU / 32)), ph = Math.floor(t * 2) % 4; return { x, y, z: WL, key: (((q % 32) + 32) % 32) + '.' + ph, ang: q * TAU / 32, ph: ph / 4 }; },
    draw(g, st) { K.boat(g, st.ang, { kind: 'row', L: 2.8, W: 1.2, hull: '#3F7FA8', deck: '#B9976A', rower: who, ph: st.ph }); } }); }
  // dolphins: every 13 s two arc out of the water off the tower
  for (let i = 0; i < 2; i++) T.actor({ grow: false, sample: 0.3, period: 13,
    at(t) { const u = ((t + i * 0.5) % 13 + 13) % 13; if (u > 1.6) return null; const f = u / 1.6, x = -14 + f * 9 + i * 2.5, y = -18 + i * 2, z = WL + Math.sin(Math.PI * f) * 3.2, k = Math.floor(f * 6); return { x, y, z, key: k, k }; },
    draw(g, st) { const p = g.p(0, 0, 0), a = -0.9 + st.k * 0.35, ca = Math.cos(a), sa = Math.sin(a), P = (u, v) => [p[0] + u * ca - v * sa, p[1] + u * sa + v * ca]; const body = [P(-4.4, 0), P(-2, -1.3), P(1.6, -1.4), P(4.2, -0.3), P(4.6, 0.2), P(1.6, 0.9), P(-2.4, 0.7)]; g.fill2(body, '#5E6E7A', true); g.fill2([P(-0.4, -1.3), P(0.6, -2.8), P(1.2, -1.3)], '#4E5E6A', true); g.fill2([P(-4.4, 0), P(-5.6, -1.2), P(-5.2, 0.1), P(-5.6, 1.2)], '#4E5E6A', true); g.line2(body, { w: 0.35, c: '#2E3A44', close: true, boil: false }); g.fill2([P(-1.6, 0.3), P(2.6, 0.2), P(1.6, 0.8), P(-1.6, 0.7)], '#C9D3D9', true); if (st.k < 2 || st.k > 4) for (let j = 0; j < 4; j++) g.disc2([p[0] - 3 + j * 2, p[1] + 3 + (j % 2)], 0.7, '#F6F8F6'); } });
  IS.gulls(T, 3, () => ({ x: TX - 2, y: TY }), { r: 7, z: 20, period: 22 });
});
