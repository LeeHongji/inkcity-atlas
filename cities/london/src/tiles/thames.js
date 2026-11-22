'use strict';
/* The Thames: the spine of the map. A straight embanked reach across the whole map, y 30..70, its water 4.5 u below the
   streets at low tide. What it is made of: the north embankment wall of grey granite blocks (the only river wall the
   camera sees), a green weed band at the waterline, river stairs down to the foreshore, outfall arches, mooring rings;
   at its foot a strip of mud and shingle that widens into Tower Beach below the Tower. Grey-green water holding the
   washed sky, a darker band in the wall's reflection. The map is cut through by the river like a trench in a diorama:
   at the near (east) end the section shows the walls and the water.
   What moves: river buses (Thames Clippers) and sightseeing cruisers in two lanes (westbound keeps north), the police
   launch, the three-masted tall ship of the Tower Bridge timetable (inbound, turning in the Pool, outbound), gulls.
   HMS Belfast lies moored below Tower Bridge. Boats are drawn in parts (LK.boatActors) so they slide under bridges. */
/* drawn inside the streets tile (one map-wide tile only: two overflow the bake budget) */
const THAMES = function (T) {
  const E = LT.END, RN = LT.RIV.N, RS = LT.RIV.S, WL = LT.RIV.WL, G = '#C9C5BA', GD = '#B3AFA4';
  const beach = (x) => 1.2 + 0.7 * (0.5 + 0.5 * Math.sin(x * 0.09 + 1.3)) + (x > -30 && x < 6 ? 1.0 * Math.sin(Math.PI * (x + 30) / 36) : 0);
  T.ground(function (g) {
    // water first: the whole reach, a darker band in the north wall's reflection
    const W = K.rect(-E, RN, E, RS, WL);
    g.fill(W, LK.C.water);
    g.fill(K.rect(-E, RN, E, RN + 4.2, WL), '#93AEAF');
    for (let x = -E; x < E; x += 24) { const R = RNG(Math.round(x + 500)); g.fill([[x, RN + 7 + R() * 6, WL], [x + 14 + R() * 6, RN + 7 + R() * 6, WL], [x + 16, RN + 8.2 + R() * 6, WL], [x + 2, RN + 8.2 + R() * 6, WL]], '#B8CDCB'); }
    g.water(K.rect(-E, RN + 3, E, RS - 8, WL), { dens: 0.7, c: '#6F9093' });
    // the foreshore at the foot of the north wall: mud with shingle, Tower Beach wider
    const fs = []; for (let x = -E; x <= E; x += 4) fs.push([x, RN + beach(x), WL + 0.05]);
    const fsp = [[-E, RN, WL + 0.05]].concat(fs, [[E, RN, WL + 0.05]]);
    g.fill(fsp, LK.C.mud);
    g.fill([[-E, RN, WL + 0.06]].concat(fs.map((p) => [p[0], RN + (p[1] - RN) * 0.45, WL + 0.06]), [[E, RN, WL + 0.06]]), LK.C.shingle);
    g.line(fs, { w: 0.5, c: LK.C.mudD, boil: false });
    { const R = RNG(77), d = []; for (let i = 0; i < 260; i++) { const x = -E + R() * 2 * E, y = RN + R() * beach(x) * 0.9, p = g.p(x, y, WL + 0.07); d.push(p[0] - 0.3, p[1], p[0] + 0.3, p[1]); } g.segs2(d, '#7E6E58', 0.5); }
    // the north wall: granite courses, a weed band at the bottom, the coping on top
    g.fill(K.on('L', RN, -E, E, WL, 0), G);
    g.fill(K.on('L', RN + 0.01, -E, E, WL, WL + 0.9), '#6F7F5E');
    { const s = []; for (let z = WL + 1.4; z < -0.2; z += 1.05) { const a = g.p(-E, RN + 0.02, z), b = g.p(E, RN + 0.02, z); s.push(a[0], a[1], b[0], b[1]); }
      for (let z = WL + 0.9, r = 0; z < -0.3; z += 1.05, r++) for (let x = -E + (r % 2) * 1.6; x < E; x += 3.2) { const a = g.p(x, RN + 0.02, z), b = g.p(x, RN + 0.02, Math.min(z + 1.05, -0.3)); s.push(a[0], a[1], b[0], b[1]); }
      g.segs2(s, GD, 0.3); }
    g.fill(K.on('L', RN + 0.02, -E, E, -0.6, 0), '#DAD6CC');
    g.line([[-E, RN, 0], [E, RN, 0]], { w: 0.9, boil: false }); g.line([[-E, RN, WL], [E, RN, WL]], { w: 0.55, c: '#4E5E4A', boil: false });
    // river stairs down the wall to the foreshore, outfall arches, mooring rings
    for (const sx of [-118, -20, 92, 150]) {
      const st = []; g.fill([[sx, RN + 0.03, 0], [sx + 2.2, RN + 0.03, 0], [sx + 2.2 + 4.5, RN + 0.03, WL], [sx + 4.5, RN + 0.03, WL]], '#B9B4A8');
      for (let i = 1; i < 9; i++) { const t = i / 9, a = g.p(sx + 4.5 * t, RN + 0.04, -(-WL) * t), b = g.p(sx + 2.2 + 4.5 * t, RN + 0.04, WL * t); st.push(a[0], a[1], b[0], b[1]); }
      g.segs2(st, '#8E897E', 0.35); g.line([[sx + 2.2, RN + 0.05, 0.9], [sx + 6.7, RN + 0.05, WL + 0.9]], { w: 0.45, c: '#3A3530', boil: false });
    }
    for (const ox of [-140, -78, -2, 70, 124]) { const a = []; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; a.push([ox + Math.cos(t) * 1.3, RN + 0.03, WL + 0.4 + Math.sin(t) * 1.3]); } g.fill(a, '#3A3833'); }
    { const rr = []; for (let x = -E + 8; x < E; x += 13) { const p = g.p(x, RN + 0.04, -1.6); rr.push(p); } for (const p of rr) g.ring2(p, 0.55, { w: 0.3, c: '#5A564E' }); }
    // granite copings along both banks (the tiles' ground meets them)
    g.fill(K.rect(-E, RN - 1.2, E, RN, 0), '#DAD6CC'); g.line([[-E, RN - 1.2, 0], [E, RN - 1.2, 0]], { w: 0.4, c: '#A9A498', boil: false });
    g.fill(K.rect(-E, RS, E, RS + 1.2, 0), '#DAD6CC'); g.line([[-E, RS, 0], [E, RS, 0]], { w: 0.8, boil: false }); g.line([[-E, RS + 1.2, 0], [E, RS + 1.2, 0]], { w: 0.4, c: '#A9A498', boil: false });
    // the cut section at the near (east) end: walls and the water in section
    const D = WL - 1.1;
    g.fill([[E, RN - 1.2, 0], [E, RN, 0], [E, RN, D], [E, RN - 1.2, D]], C.slabD); g.fill([[E, RS, 0], [E, RS + 1.2, 0], [E, RS + 1.2, D], [E, RS, D]], C.slabD);
    g.fill([[E, RN, WL], [E, RS, WL], [E, RS, D], [E, RN, D]], '#7F9C9E');
    g.fill([[E, RN, WL], [E, RN + beach(E), WL], [E, RN + beach(E), WL - 0.6], [E, RN, WL - 0.6]], LK.C.mudD);
    g.line([[E, RN - 1.2, 0], [E, RN - 1.2, D], [E, RS + 1.2, D], [E, RS + 1.2, 0]], { w: 0.85, boil: false });
    g.line([[E, RN, 0], [E, RN, WL], [E, RS, WL], [E, RS, 0]], { w: 0.7, boil: false });
    g.line([[-E, RN - 1.2, 0], [-E, RS + 1.2, 0]], { w: 0.7, boil: false });
    // a clear fill over the open water the view shows (from the foreshore's edge to where the south bank's edge starts
    // to hide the river): at night the lights' reflections fall on it (SCENE.night.water), never on the mud or the bank
    g.fill(fs.concat([[E, RS - 9.9, WL], [-E, RS - 9.9, WL]]), LK.C.WMASK);
  });

  /* ---------------- HMS Belfast, moored below Tower Bridge ---------------- */
  T.obj([15.5, 55.8, 35.5, 60.8], function (g) {
    g.boilP = 0.25; const i0 = g.cmds.length;
    const y = 58.3, hw = 2.0, x0 = 16, x1 = 35, z = WL, zd = WL + 2.4, light = '#C9CDD0', dark = '#8E979E', mid = '#AEB5BA';
    // the hull: dazzle camouflage in greys, the bow (west) raked
    const hull = (yy) => [[x0 + 1.6, yy, z], [x1, yy, z], [x1 + 0.4, yy, zd], [x0, yy, zd + 0.4]];
    g.fill(hull(y + hw), light);
    const dz = [[x0 + 3, x0 + 6.5, 0.2, 1], [x0 + 9, x0 + 11, 0, 0.7], [x0 + 13.5, x0 + 17, 0.3, 1]];
    for (const [a, b, s, e] of dz) g.fill([[a, y + hw + 0.02, z + 0.2], [b, y + hw + 0.02, z + 0.2], [b - 1.2, y + hw + 0.02, zd - (1 - e) * 1.2], [a + 1.4, y + hw + 0.02, zd - (1 - s) * 1.0]], dark);
    g.fill([[x1, y - hw, z], [x1, y + hw, z], [x1 + 0.4, y + hw, zd], [x1 + 0.4, y - hw, zd]], mid);
    g.fill([[x0, y - hw, zd + 0.4], [x1 + 0.4, y - hw, zd], [x1 + 0.4, y + hw, zd], [x0, y + hw, zd + 0.4]], '#B9AF9C');
    g.outline(hull(y + hw), { w: 0.75, boil: false });
    // superstructure, bridge, two raked funnels, tripod masts, four triple turrets with their guns
    K.box(g, x0 + 6, y - 1.3, x0 + 14.5, y + 1.3, zd, zd + 1.6, { t: '#B9BEC2', l: light, r: mid }, { w: 0.55 });
    K.box(g, x0 + 6.4, y - 1.0, x0 + 9.2, y + 1.0, zd + 1.6, zd + 4.0, { t: '#B9BEC2', l: light, r: mid }, { w: 0.55 });
    g.fill(K.on('L', y + 1.02, x0 + 6.6, x0 + 9.0, zd + 3.1, zd + 3.6), '#3F4A55');
    for (const fx of [x0 + 10.4, x0 + 13.0]) { K.box(g, fx - 0.55, y - 0.7, fx + 0.55, y + 0.7, zd + 1.6, zd + 4.6, { t: '#4A4F55', l: light, r: mid }, { w: 0.5 }); g.fill([[fx - 0.55, y + 0.71, zd + 4.0], [fx + 0.55, y + 0.71, zd + 4.0], [fx + 0.55, y + 0.71, zd + 4.6], [fx - 0.55, y + 0.71, zd + 4.6]], '#3A3F45'); }
    const mast = (mx, h) => { const b1 = g.p(mx - 0.5, y, zd + 1.6), b2 = g.p(mx + 0.5, y, zd + 1.6), t = g.p(mx, y, zd + h); g.segs2([b1[0], b1[1], t[0], t[1], b2[0], b2[1], t[0], t[1]], '#5A6066', 0.45); const ya = g.p(mx, y - 1.4, zd + h - 1.2), yb = g.p(mx, y + 1.4, zd + h - 1.2); g.segs2([ya[0], ya[1], yb[0], yb[1]], '#5A6066', 0.4); };
    mast(x0 + 9.8, 10.5); mast(x0 + 15.0, 8.5);
    for (const [tx, fwd] of [[x0 + 2.6, -1], [x0 + 4.6, -1], [x1 - 4.4, 1], [x1 - 2.2, 1]]) {
      K.cyl(g, tx, y, 0.9, zd + (tx === x0 + 4.6 || tx === x1 - 4.4 ? 0.5 : 0), zd + (tx === x0 + 4.6 || tx === x1 - 4.4 ? 1.3 : 0.8), { t: '#B9BEC2', l: light, r: mid }, { w: 0.45, n: 10 });
      const zz = zd + (tx === x0 + 4.6 || tx === x1 - 4.4 ? 1.05 : 0.55), gs = [];
      for (const dv of [-0.45, 0, 0.45]) { const a = g.p(tx, y + dv, zz), b = g.p(tx + fwd * 2.4, y + dv, zz + 0.25); gs.push(a[0], a[1], b[0], b[1]); }
      g.segs2(gs, '#5A6066', 0.4);
    }
    g.fine([[x0 + 0.2, y, zd + 0.6], [x0 + 9.8, y, zd + 10.5], [x0 + 15, y, zd + 8.5], [x1 + 0.3, y, zd + 0.6]], { w: 0.25, c: '#5A6066' });
    // at night: floodlit from the quay, the bridge windows lit, a white light at each masthead
    LK.flood(g, i0, 0.5, '#EEDCC0', (c) => (c === '#3F4A55' ? '#FFE2A8' : undefined));
    for (const x of [x0 + 3, x0 + 9.5, x0 + 15.5]) g.glow('lantern', x, y + hw + 0.5, zd + 1.0, { r: 2.2, col: '#FFE6C0', base: WL });
    for (const [mx, h] of [[x0 + 9.8, 10.5], [x0 + 15.0, 8.5]]) { const p = g.p(mx, y, zd + h - 1.3); LK.navLight(g, p, '#FFF6E0', 0.4); g.glow2('lantern', p, g.p(mx, y + hw + 0.5, WL), { r: 0.9, col: '#FFF6E0' }); }
  }, { name: 'belfast' });
  LK.flag(T, 35.2, 58.3, WL + 4.2, { L: 1.8, H: 1.0, ph: 0.3 });

  /* ---------------- river traffic ---------------- */
  const lane = (s0, dir) => (t) => { const x = LT.boatX(s0, dir, t), a = clamp(Math.min(x + E + 6, E + 6 - x) / 14, 0, 1); if (a <= 0.02) return null; return { x, y: dir > 0 ? LT.RIV.RE : LT.RIV.RW, ang: dir > 0 ? 0 : Math.PI, alpha: a < 1 ? a : null }; };
  const per = LT.RSPAN / LT.RV;
  LK.boatActors(T, LK.CLIPPER, [[-15, -1], [-1, 7]], lane(0, -1), { period: per });
  LK.boatActors(T, LK.POLICE, [[-10, 0], [0, 5]], lane(130, -1), { period: per });
  LK.boatActors(T, LK.CLIPPER, [[-15, -1], [-1, 7]], lane(250, -1), { period: per });
  LK.boatActors(T, LK.CRUISER(11), [[-6.2, 0], [0, 7]], lane(40, 1), { period: per });
  LK.boatActors(T, LK.CLIPPER, [[-15, -1], [-1, 7]], lane(165, 1), { period: per });
  LK.boatActors(T, LK.CRUISER(23), [[-6.2, 0], [0, 7]], lane(290, 1), { period: per });

  /* ---------------- the tall ship ----------------
     A three-masted barque: a black hull with a white band, a bowsprit, square sails on the fore and main masts, a gaff
     sail on the mizzen, jibs to the bowsprit; a red ensign at the stern. Masts stay below Tower Bridge's walkways. */
  const SAIL = '#F4EFE0', SAILD = '#DDD5C0', HULL = { t: '#A0815C', l: '#2E2B2A', r: '#1F1D1C' };
  const yard = (u, z, w) => (g, P) => g.line([P(u, -w, z), P(u, w, z)], { w: 0.45, c: '#4A3A2C', boil: false, ext: 0 });
  const squares = (u, tiers) => (g, P, vis) => {
    for (const [z0, z1, w] of tiers) {
      const b = 0.45, q = [P(u, -w, z1), P(u + b * 0.3, 0, z1), P(u, w, z1), P(u + b, w * 0.92, (z0 + z1) / 2), P(u + b * 0.6, w * 0.9, z0), P(u + b, 0, z0), P(u + b * 0.6, -w * 0.9, z0), P(u + b, -w * 0.92, (z0 + z1) / 2)];
      g.fill(q, vis.bow ? SAIL : SAILD); g.outline(q, { w: 0.35, c: '#8C8576', boil: false });
      yard(u, z1, w + 0.2)(g, P);
    }
  };
  const mast = (u, h) => (g, P) => { g.line([P(u, 0, 1.8), P(u, 0, h)], { w: 0.75, c: '#4A3A2C', boil: false, ext: 0 }); const sh = []; for (const s of [-1, 1]) { const a = g.p.apply(g, P(u, 0, h - 0.6)), b = g.p.apply(g, P(u - 0.9, s * 1.75, 1.9)); sh.push(a[0], a[1], b[0], b[1]); } g.segs2(sh, '#6B5E4E', 0.25); };
  const SHIP = [
    { box: [-7.0, 5.0], hw: 1.75, z: [0, 1.9], col: HULL }, { bow: [5.0, 7.4], hw: 1.75, z: [0, 1.9], col: HULL, top: '#A0815C' },
    { band: [-7.0, 5.0], hw: 1.75, z: [1.15, 1.5], col: '#F3F1EA' },
    { at: -6.9, fn(g, P) { // the stern ensign, the mizzen's gaff sail
      g.line([P(-6.9, 0, 1.9), P(-7.6, 0, 4.0)], { w: 0.35, c: '#4A3A2C', boil: false, ext: 0 }); const f = [P(-7.6, 0, 4.0), P(-9.0, 0, 3.8), P(-9.0, 0, 3.0), P(-7.6, 0, 3.2)]; g.fill(f, '#C8372D');
    } },
    { at: -3.6, fn(g, P) { mast(-3.6, 10.6)(g, P); const s = [P(-3.6, 0, 2.6), P(-3.6, 0, 9.4), P(-6.8, 0, 8.0), P(-7.0, 0, 2.9)]; g.fill(s, SAIL); g.outline(s, { w: 0.35, c: '#8C8576', boil: false }); } },
    { at: 0, fn(g, P, vis) { mast(0, 13.6)(g, P); squares(0, [[3.0, 6.0, 2.4], [6.2, 8.8, 2.1], [9.0, 11.2, 1.7], [11.4, 12.9, 1.3]])(g, P, vis); } },
    { at: 3.2, fn(g, P, vis) { mast(3.2, 12.6)(g, P); squares(3.2, [[3.0, 5.8, 2.3], [6.0, 8.4, 2.0], [8.6, 10.6, 1.6], [10.8, 12.0, 1.2]])(g, P, vis); } },
    { at: -6.9, fn(g, P) { LK.navLight(g, g.p.apply(g, P(-7.0, 0, 2.7)), '#FFD27A', 0.5); } },     // the stern lantern (night only)
    { at: 7.4, fn(g, P) { g.line([P(6.6, 0, 1.9), P(10.2, 0, 2.9)], { w: 0.6, c: '#4A3A2C', boil: false, ext: 0 }); for (const [a, b] of [[[3.6, 10.6], [9.6, 2.8]], [[3.6, 8.8], [8.2, 2.5]]]) { const j = [P(a[0], 0, a[1]), P(b[0], 0, b[1]), P(lerp(a[0], b[0], 0.15) + 0.6, 0, 2.4)]; g.fill(j, SAIL); g.outline(j, { w: 0.3, c: '#8C8576', boil: false }); } g.fine([P(3.2, 0, 12.6), P(10.2, 0, 2.9)], { w: 0.25, c: '#6B5E4E' }); } },
  ];
  LK.boatActors(T, SHIP, [[-9.2, -2.0], [-2.0, 1.7], [1.7, 5.0], [5.0, 10.4]], (t) => { const s = LT.ship(LT.tc(t)); return s ? { x: s.x, y: s.y, ang: s.ang, alpha: s.alpha } : null; }, { period: LT.CYC, nq: 64, sample: 0.3 });

  /* gulls wheeling over the water */
  for (let i = 0; i < 5; i++) T.actor({ layer: 'top', sample: 5, period: 10, grow: false,
    at(t) { const a = t * (0.35 + i * 0.05) + i * 1.7, f = Math.floor(t * 5 + i) % 4; return { x: -110 + i * 52 + Math.cos(a) * 9, y: 46 + Math.sin(a) * 6, z: 14 + (i % 3) * 3, key: f, f }; },
    draw(g, st) { const o = g.p(0, 0, 0), w = [3.2, 2.4, 1.2, 2.4][st.f], d = [1.4, 0.4, -0.6, 0.4][st.f]; g.line2([[o[0] - w, o[1] - d], [o[0] - 0.6, o[1] - 0.2], [o[0], o[1] + 0.4], [o[0] + 0.6, o[1] - 0.2], [o[0] + w, o[1] - d]], { w: 0.5, c: '#3A3530', boil: false, wob: 0.2 }); } });
};
