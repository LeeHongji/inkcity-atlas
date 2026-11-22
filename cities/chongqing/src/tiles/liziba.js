'use strict';
/* (100,-100) Liziba: Line 2 runs straight through a residential tower.
   What it is: a 19-storey slab on the Jialing bank (here 17 storeys, 2.8 u each, 32 u long, 14 deep) built together
   with the station: floors 1-5 shops and offices, 6-8 the station, 9 up flats. The two monorail beams run along the
   building's length; trains glide in at the far end, stop at the platform inside (seen through the glazed station
   floors on the river face), and come out of a square opening in the end wall over the viewing plaza, then dive into
   a tunnel under a fig-topped cliff at the plaza's end.
   Levels: the plaza and the slab's foot at z 0 (the street level); behind the plaza the Guihuayuan hill road on a
   terrace at z 19.6, the same height as the station's 8th floor, reached by a long flight of stairs, and a footbridge
   from it into the station (the 8th floor is the "ground floor" of the hill road).
   Who: tourists packed on the viewing plaza with their phones up, a couple pretending to swallow the train, a
   souvenir stall, a bangbang porter climbing the stairs, people waiting on the platform inside, neighbours playing
   mahjong under the fig on the hill road, a man on the footbridge watching.
   Moving: two trains (one per beam) on a timetable phased so a train comes out of the building as the shot opens;
   walkers on the stairs and the plaza.
   Depth: the slab is split along x into a back part (behind both beams), a middle part (the beams' slice, { under })
   and the river face; each train car is two half-car actors so the end wall's opening hides the right parts. */
const LZ = { X0: 22, X1: 36, Y0: -37, Y1: -5, ST: 2.8, N: 17, BA: 29.5, BB: 33, Z: 15.4, TER: 19.6 };
SF.tile('liziba', 100, -100, { rim: 22 }, function (T) {
  const H = 37, L = LZ, ZT = L.N * L.ST, Z = L.Z, SH = SCENE.shots.find((s) => s.name === 'liziba');
  const SLAB = '#E4DCCB', SLABR = '#CFC6B4', TOP = '#D5CEC0';

  T.ground(function (g) {
    K.slab(g, H, { top: '#DAD2C1' });
    // the viewing plaza: big square slabs
    g.fill(K.rect(-4, 3, 21, 36), '#DDD6C7');
    const s = []; for (let x = -4; x <= 21; x += 3) { const a = g.p(x, 3, 0), b = g.p(x, 36, 0); s.push(a[0], a[1], b[0], b[1]); } for (let y = 3; y <= 36; y += 3) { const a = g.p(-4, y, 0), b = g.p(21, y, 0); s.push(a[0], a[1], b[0], b[1]); }
    g.segs2(s, '#C6BEAD', 0.25);
    CQ.paving(g, -36, 3, 21, 36, 0, { dens: 0.3 });
    g.fill(K.rect(22, -4, 36.5, 26), '#D6D0C2');
  }, { rim: true });

  /* ---- the hill road terrace (far-left), its stairs, the houses on it ---- */
  T.obj([-37, -37, -4, 2], (g) => {
    CQ.terrace(g, -37, -37, -4, 2, 0, L.TER, { top: '#DCD6C8' });
    CQ.rail(g, 'R', -4.3, -36, 1.5, L.TER, { h: 1.4 });
    CQ.rail(g, 'L', 1.7, -36, -4.5, L.TER, { h: 1.4 });
    CQ.railLamps(g, [-4.3, -34, L.TER + 1.5], [-4.3, 1.2, L.TER + 1.5], 8.5, { base: L.TER });   // lamps on the railing (night)
    g.fill(K.rect(-34, -34, -10, -26, L.TER), '#C9C3B5');
    // shops built into the foot of the retaining wall, facing the alley under the footbridge
    for (const [y0, y1, sg] of [[-34, -27, ['火锅', CQC.red]], [-24, -17, ['小面', '#E6B84A']], [-13, -6, ['茶馆', '#3F6B4E']]]) {
      g.fill(K.on('R', -3.97, y0, y1, 0, 3.4), '#4A4540'); g.fill(K.on('R', -3.96, y0 + 0.6, y1 - 0.6, 0.2, 2.9), '#E9C98A');
      CQH.sign(g, 'R', -3.9, y0 - 0.2, y1 + 0.2, 3.6, 5.2, sg[1], sg[0]);
    }
  }, { name: 'hill road' });
  // the long flight up the terrace's front wall: climbs towards -x
  T.obj([-34, 2, -5, 6.5], (g) => { CQ.steps(g, -34, 2.2, -5, 6.5, 0, L.TER, 'x', { rise: 0.62 }); CQ.rail(g, 'L', 6.4, -34, -5, 0, { h: 1.2 });
    for (const x of [-9, -16, -23, -30]) { const z = clamp((-5 - x) / 29, 0, 1) * L.TER; g.glow('lamp', x, 6.4, z + 1.4, { r: 0.9, base: z }); } }, { name: 'stairs' });   // a lamp every few flights (night)
  for (const [x0, y0, x1, y1, n, sg, col] of [[-36, -36, -27, -29, 2, ['茶馆', '#3F6B4E'], CQC.plaster], [-26, -36, -17, -30, 3, null, '#D9CDB4'], [-36, -26, -29, -16, 2, ['小面', '#D9732F'], '#E3DCCB']]) {
    T.obj([x0, y0, x1, y1], (g) => CQ.oldhouse(g, { x0, y0, x1, y1, z: L.TER, n, sign: sg, col, signFace: x1 - x0 > y1 - y0 ? 'L' : 'R' }), { on: true, name: 'hill house' });
  }
  T.obj([-14, -14], (g) => CQ.fig(g, -14, -14, { z: L.TER, r: 5.4, h: 4.4 }), { on: true });
  T.cast([-20, 0.6], (g) => CQ.pots(g, [-35, 0.6, L.TER], [-6, 0.6, L.TER], 8, 41), { on: true, name: 'pots' });
  T.cast([-31, -28.6], (g) => CQ.washing(g, [-36, -28.6, L.TER + 4.6], [-27, -28.6, L.TER + 4.6], 42), { on: true, name: 'washing' });
  T.cast([-22, -8], (g) => g.at(-22, -8.5, L.TER, (g2) => CQ.mahjong(g2, 0, 0, [401, 402, 403, 404])), { on: true, name: 'mahjong' });
  T.cast([-9, -4], (g) => { CQ.person(g, -8, -4, L.TER, CQ.elder(405, { dir: 0, cage: true, pose: 'hold', bird: '#7FA9C9' })); CQ.person(g, -8.5, -0.5, L.TER, CQ.elder(406, { dir: 0, pose: 'stand' })); }, { on: true });

  /* ---- the footbridge from the hill road into the station's 8th floor ---- */
  T.obj([-4, -24, 22, -18], (g) => {
    const z = L.TER;
    K.box(g, -4, -24, 22, -18, z - 1.2, z, { t: '#D9D3C4', l: '#BDB6A6', r: '#A9A190' }, { w: 0.7 });
    CQ.rail(g, 'L', -18.3, -4, 22, z, { h: 1.5, sp: 1.0 }); CQ.rail(g, 'L', -23.7, -4, 22, z, { h: 1.5, sp: 1.0 });
    const p = g.p(8, -18, z - 1.2), q = g.p(8, -18, 0); g.fill2([[p[0] - 1.1, p[1]], [p[0] + 1.1, p[1]], [q[0] + 1.3, q[1]], [q[0] - 1.3, q[1]]], '#C3BCAD'); g.outline2([[p[0] - 1.1, p[1]], [q[0] - 1.3, q[1]], [q[0] + 1.3, q[1]], [p[0] + 1.1, p[1]]], { w: 0.5, boil: false });
    CQH.sign(g, 'L', -18.2, 2, 8, z + 1.7, z + 3.6, '#2F5F8F', '出口');
    CQ.railLamps(g, [-2, -18.3, z + 1.6], [20, -18.3, z + 1.6], 7.5, { base: z });              // lamps on its railing (night)
    CQ.person(g, 12, -20.5, z, CQ.who(407, { dir: 0, pose: 'hold', phone: true }));
  }, { name: 'footbridge' });

  /* ---- the slab: back part (behind both beams) ---- */
  const winRows = (g, f, p, a0, a1, z0, z1, skipStation) => {
    const W = []; const nw = Math.max(1, Math.round(Math.abs(a1 - a0) / 2.4));
    for (let k = 0; k < L.N; k++) { const zz = k * L.ST; if (zz < z0 || zz >= z1) continue; if (skipStation && k >= 5 && k <= 7) continue;
      for (let i = 0; i < nw; i++) { const a = a0 + (a1 - a0) * (i + 0.5) / nw; W.push(K.on(f, p + 0.03, a - 0.55, a + 0.55, zz + (k < 5 ? 0.6 : 0.8), zz + (k < 5 ? 2.2 : 2.0))); } }
    for (const q of W) g.fill(q, '#5E6872');
  };
  T.obj([L.X0, L.Y0, L.BA - 2, L.Y1], (g) => {
    g.boilP = 0.2;
    const x0 = L.X0, x1 = L.BA - 2, y0 = L.Y0, y1 = L.Y1;
    K.box(g, x0, y0, x1, y1, 0, ZT, { t: TOP, l: SLAB, r: SLABR }, { w: 0.9 });
    winRows(g, 'L', y1, x0, x1, 0, ZT, true);
    // the station inside: back wall, platform with its edge line, the floor and ceiling seen through the openings
    g.fill(K.on('R', x1 + 0.02, y0, y1, 3.0, Z + 6.4), '#3E4448'); g.mark({ nc: '#BFA982' }); g.fill(K.on('R', x1 + 0.025, y0, y1, 3.0, Z - 1.6), '#4A5054');
    g.fill(K.rect(x1, y0, x1 + 1.5, y1, Z), '#BDB8AE'); g.mark({ nc: '#F3E4C2' });
    g.fill(K.on('R', x1 + 0.03, y0, y1, Z + 3.6, Z + 5.4), '#5A646C'); g.mark({ nc: '#FFF1CF' });                   // at night the station is lit inside
    for (let y = y0 + 2; y < y1; y += 4) CQH.sign(g, 'R', x1 + 0.04, y, y + 1.6, Z + 4.0, Z + 5.0, '#2F5F8F', '李子坝站', { line: false });
    // the beams running through the station (drawn here, behind the trains)
    for (const bx of [L.BA, L.BB]) { g.fill([[bx + 0.75, y0, Z - 2], [bx + 0.75, y1, Z - 2], [bx + 0.75, y1, Z], [bx + 0.75, y0, Z]], CQC.concreteD); g.fill(K.rect(bx - 0.75, y0, bx + 0.75, y1, Z), CQC.concrete); g.fill(K.on('L', y1, bx - 0.75, bx + 0.75, Z - 2, Z), CQC.concrete); }
    // people waiting on the platform
    for (let i = 0; i < 6; i++) { const y = y0 + 4 + i * 4.6; K.person(g, x1 + 0.7, y, Z, CQ.who(410 + i, { dir: i % 2 ? 0 : 3, pose: i === 2 ? 'hold' : 'stand', k: 0.95 })); }
  }, { name: 'slab back' });

  /* ---- the slab: the beams' slice (trains inside it are covered: { under }) ---- */
  T.obj([L.BA - 2, L.Y0, 34.7, L.Y1], (g) => {
    g.boilP = 0.2;
    const x0 = L.BA - 2, x1 = 34.7, y1 = L.Y1, zo0 = Z - 2.3, zo1 = Z + 4.8;
    // the end wall in two pieces round the opening, the opening's soffit, the top
    g.fill(K.on('L', y1, x0 - 0.4, x1, 0, zo0), SLAB); g.fill(K.on('L', y1, x0 - 0.4, x1, zo1, ZT), SLAB); g.fill(K.on('L', y1, x0 - 0.4, x0 + 0.4, zo0, zo1), SLAB);
    g.fill([[x0, y1, zo1], [x1, y1, zo1], [x1, y1 - 2.4, zo1], [x0, y1 - 2.4, zo1]], '#B8B0A0'); g.mark({ nc: '#D9BE8A' });   // the station's light spills out of the opening
    g.fill(K.rect(x0, L.Y0, x1, y1, ZT), TOP);
    g.line([[x0, y1, zo0], [x1, y1, zo0], [x1, y1, zo1], [x0, y1, zo1], [x0, y1, zo0]], { w: 0.75 });
    g.line([[x0, y1, ZT], [x1, y1, ZT]], { w: 0.8 }); g.line([[x0, L.Y0, ZT], [x1, L.Y0, ZT]], { w: 0.8 });
    winRows(g, 'L', y1, x0 + 0.8, x1 - 0.8, 0, zo0 - 1.4); winRows(g, 'L', y1, x0 + 0.8, x1 - 0.8, zo1 + 1.4, ZT);
    CQH.sign(g, 'L', y1 + 0.02, x0 + 0.6, x1 - 0.6, zo1 + 0.4, zo1 + 2.4, '#2F5F8F', '李子坝');
  }, { under: 99, name: 'slab middle' });

  /* ---- the slab: the river face, the station floors glazed (the trains show through) ---- */
  T.obj([34.7, L.Y0, L.X1, L.Y1], (g) => {
    g.boilP = 0.2;
    const x0 = 34.7, x1 = L.X1, y0 = L.Y0, y1 = L.Y1, zs0 = 5 * L.ST, zs1 = 8 * L.ST;
    g.fill(K.on('R', x1, y0, y1, 0, zs0), SLABR); g.fill(K.on('R', x1, y0, y1, zs1, ZT), SLABR);
    g.fill(K.on('L', y1, x0, x1, 0, ZT), SLAB); g.fill(K.rect(x0, y0, x1, y1, ZT), TOP);
    // shop floors 1-5: glass at the bottom, offices above
    g.fill(K.on('R', x1 + 0.03, y0 + 1, y1 - 1, 0.3, 3.4), '#4E555B');
    for (let y = y0 + 3; y < y1 - 1; y += 3) g.fine([[x1 + 0.05, y, 0.3], [x1 + 0.05, y, 3.4]], { w: 0.3, c: '#9A958A' });
    winRows(g, 'R', x1, y1, y0, 4.2, zs0); winRows(g, 'R', x1, y1, y0, zs1 + 0.1, ZT);
    // the station band: translucent glazing, mullions, a light orange stripe (the line's colour)
    g.fill(K.on('R', x1, y0, y1, zs0 + 0.6, zs1 - 0.6), 'rgba(196,214,222,0.32)'); g.mark({ nc: 'rgba(255,226,166,0.42)' });   // the lit station glows through its glass
    const m = []; for (let y = y0; y <= y1 + 0.01; y += 2.0) { const a = g.p(x1, y, zs0 + 0.6), b = g.p(x1, y, zs1 - 0.6); m.push(a[0], a[1], b[0], b[1]); } g.segs2(m, '#7A858C', 0.35);
    g.fill(K.on('R', x1 + 0.02, y0, y1, zs0, zs0 + 0.6), '#E0602F'); g.mark({ nc: '#FF7A3E' }); g.fill(K.on('R', x1 + 0.02, y0, y1, zs1 - 0.6, zs1), '#BDB5A3');
    for (let y = y0 + 3; y < y1 - 1; y += 6.5) g.glow('lantern', x1 + 0.3, y, (zs0 + zs1) / 2, { r: 3.0, col: '#FFE0A0' });
    // laundry and air conditioners on the flats
    const R = RNG(77), ac = [];
    for (let k = 9; k < L.N; k++) for (let y = y0 + 2; y < y1 - 1; y += 4.8) { if (R() < 0.45) { const q = K.on('R', x1 + 0.4, y + 1.1, y + 1.9, k * L.ST + 0.5, k * L.ST + 1.1); g.fill(q, '#EEEDE7'); ac.push(q); } else if (R() < 0.2) { for (let j = 0; j < 3; j++) g.fill(K.on('R', x1 + 0.6, y - 0.3 + j * 0.6, y + 0.1 + j * 0.6, k * L.ST + 0.4, k * L.ST + 1.6), R.pick(['#E2725B', '#F4F1E8', '#6E9BC8', '#E6C24F'])); } }
    g.line([[x1, y0, 0], [x1, y0, ZT]], { w: 0.9 }); g.line([[x1, y1, 0], [x1, y1, ZT]], { w: 0.8 });
    g.line([[x1, y0, ZT], [x1, y1, ZT], [x0, y1, ZT]], { w: 0.85 }); g.line([[x1, y1, 0], [x1, y0, 0]], { w: 0.85 }); g.line([[x0, y1, 0], [x1, y1, 0]], { w: 0.85 });
    g.line([[x1, y0, zs0], [x1, y1, zs0]], { w: 0.5, boil: false }); g.line([[x1, y0, zs1], [x1, y1, zs1]], { w: 0.5, boil: false });
    // rooftop: water tanks, a little garden
    for (const y of [-31, -16]) K.box(g, x0 - 3, y - 1.2, x0 - 0.5, y + 1.2, ZT, ZT + 2, { t: '#D7D9D6', l: '#C3C6C3', r: '#A9ACA9' }, { w: 0.5, boil: false });
  }, { name: 'slab river face' });

  /* ---- the beams in the open, their piers, the tunnel cliff ---- */
  for (const [y0, y1] of [[L.Y1, 11], [11, 30]]) T.obj([L.BA - 1, y0, L.BB + 1, y1], (g) => {
    for (const bx of [L.BA, L.BB]) K.box(g, bx - 0.75, y0, bx + 0.75, y1, Z - 2.0, Z, CQC.concrete, { w: 0.6, boil: false });
  }, { under: Z, name: 'beam' });
  T.obj([31.25, 11], (g) => {
    K.box(g, 30.45, 10.2, 32.05, 11.8, 0, Z - 3.2, CQC.concrete, { w: 0.6 });
    K.box(g, L.BA - 1.2, 10, L.BB + 1.2, 12, Z - 3.2, Z - 2.0, CQC.concreteD, { w: 0.6 });
  }, { name: 'pier' });
  T.obj([21, 30, 37, 37], (g) => {
    g.boilP = 0.25;
    CQ.terrace(g, 21, 30, 37, 37, 0, Z + 4.8, { top: '#9FB27E', wall: '#B9B09C', wallR: '#A39A86' });
    g.grass2(g.P(K.rect(21, 30, 37, 37, Z + 4.8)), { dens: 0.6 });
    // the tunnel mouth on the far face shows a dark arch rim over the beams
    for (const bx of [L.BA, L.BB]) { const a = g.p(bx - 1.6, 30, Z + 3.6), b = g.p(bx + 1.6, 30, Z + 3.6); g.line2([a, b], { w: 0.6, c: '#3A3530', boil: false }); }
    // low shrubs and a blossoming plum at the near corner, kept clear of the trains behind
    for (const [x, y] of [[26, 35.5], [33, 36], [36, 33]]) { const c = g.p(x, y, Z + 4.8); g.disc2([c[0], c[1] - 1.6], 2.2, '#7FA35E'); g.disc2([c[0] + 1.4, c[1] - 2.4], 1.6, '#93B56E'); }
    CQ.bloom(g, 23, 36, { z: Z + 4.8, r: 2.4, h: 2.4 });
  }, { name: 'tunnel cliff' });

  /* ---- a noodle stall under the beams at the slab's foot: the cook, stools, eaters ---- */
  T.obj([25, 3, 29, 6], (g) => {
    K.box(g, 25, 3, 29, 6, 0, 2.6, { t: '#D9D3C4', l: '#C9463E', r: '#A9382F' }, { w: 0.6 });
    CQH.sign(g, 'L', 6, 25.3, 28.7, 0.6, 2.2, '#E6B84A', '小面', { line: false });
    K.cyl(g, 27.6, 4.4, 1.0, 2.6, 3.8, { t: '#5A564E', l: '#9C9A94', r: '#7A7872' }, { w: 0.45, n: 10 });
    CQ.person(g, 26, 2.3, 0, CQ.who(590, { dir: 0, pose: 'hold', top: '#F3F1EA', cap: '#F3F1EA' }));
    g.glow('lamp', 26, 4.5, 3.0, { r: 0.9 });                                    // a bulb on the counter (night)
  }, { name: 'noodle stall' });
  CQ.steamActor(T, 27.6, 4.4, 4.2, 0.9);
  for (const [x, y, d, s] of [[25, 10, 3, 591], [28, 10.5, 2, 592], [31, 9.5, 1, 593], [27, 14, 3, 594]]) T.cast([x, y], (g) => { CQ.stool(g, x, y, s % 2 ? '#C9463E' : '#4F7FB8'); CQ.person(g, x, y, 1.3, CQ.who(s, { dir: d, pose: 'sit', bowl: true, reach: [2.6, 3] })); }, { name: 'eater' });

  /* ---- the plaza: railing, a souvenir stall, trees ---- */
  T.obj([17, 22], (g) => { K.stall(g, 17, 22, { face: 'R', L: 2.4, D: 1.4, a: '#C8392E', b: '#F3F1EA' }); g.glow('lamp', 17, 22, 5.8, { r: 1.0 }); }, { name: 'stall' });   // a bulb under the canopy (night)
  T.obj([-1, 33], (g) => CQ.fig(g, -1, 33, { r: 4.6, h: 4.2 }), { name: 'fig' });
  T.obj([-30, 30], (g) => CQ.bloom(g, -30, 30, { r: 3.6 }), { name: 'plum' });
  T.obj([-20, 34], (g) => K.lamp(g, -20, 34, { h: 8, col: '#4A4E52' }), { name: 'lamp' });

  /* ---- the crowd on the plaza, phones up at the end wall ---- */
  const crowd = [];
  for (let i = 0; i < 22; i++) { const R = RNG(500 + i); crowd.push([2 + (i % 6) * 2.4 + R() * 1.2, 8 + Math.floor(i / 6) * 3.1 + R() * 1.2, i]); }
  for (const [x, y, i] of crowd) T.cast([x, y], (g) => CQ.person(g, x, y, 0, CQ.who(520 + i, { dir: i % 5 === 0 ? 0 : 3, pose: i % 3 ? 'hold' : 'stand', phone: i % 3 !== 0 })), { name: 'crowd' });
  // the couple "swallowing" the train: one leans back with mouth open, the other crouches with the phone
  T.cast([8, 25], (g) => { K.person(g, 8, 25, 0, CQ.who(560, { dir: 1, pose: 'cheer', ph: 0.25 })); CQ.person(g, 3.5, 30.5, 0, CQ.who(561, { dir: 3, pose: 'crouch', phone: true })); }, { name: 'swallow' });
  T.cast([-12, 18], (g) => { CQ.person(g, -12, 18, 0, CQ.who(562, { dir: 0, pose: 'hold', phone: true })); CQ.person(g, -10, 20, 0, CQ.who(563, { dir: 0, umbrella: '#E08A5C', pose: 'hold' })); }, { name: 'pair' });

  /* ---- walkers: up and down the stairs (a porter among them), across the plaza ---- */
  const zst = (x) => clamp((-5 - x) / 29, 0, 1) * L.TER;
  CQ.walk(T, CQ.bangWho(570), [[-2, 4.4], [-35, 4.4], [-35, -6], [-35, 4.4]], 0.9, { z: (x, y) => (y < 2 ? L.TER : zst(x)), porter: { load: ['#C9B48A', '#8FA36B'] }, phase: 0.1 });
  CQ.walk(T, CQ.who(571), [[-35, 4.6], [-2, 4.6], [10, 10], [-2, 4.6]], 1.3, { z: (x) => zst(x), phase: 0.5 });
  CQ.walk(T, CQ.elder(572), [[-2, 4.2], [-35, 4.2]], 0.8, { z: (x) => zst(x), phase: 0.75 });
  CQ.walk(T, CQ.who(573), [[-30, 18], [0, 18], [0, 34], [-30, 34]], 1.5, { phase: 0.2 });
  CQ.walk(T, CQ.who(574), [[-28, -20], [-7, -20], [-7, -26], [-28, -26]], 1.2, { z: L.TER, phase: 0.4 });

  /* ---- the trains ---- */
  // the head of a train along its beam, as a function of the time since it set off; then the cars behind it.
  // NC cars of length 2*HL; head runs from far beyond the slab's far end, stops with the train at the platform,
  // then runs out of the end wall and into the tunnel cliff.
  const NC = 4, HL = 3.4, TL = NC * 2 * HL, V = 9, PER = 34, DW = 8;
  const STOP = L.Y1 - 1.2;                                     // head position (along +y) at the platform stop
  const headA = (u) => {                                       // u seconds into the run, heading +y
    const a = 2.2, d0 = STOP - V * V / (2 * a);                // decelerate into the stop, dwell, accelerate out
    const tA = (d0 - (L.Y0 - TL - 4)) / V, tB = tA + V / a, tC = tB + DW;
    if (u < tA) return L.Y0 - TL - 4 + V * u;
    if (u < tB) { const w = u - tA; return d0 + V * w - a * w * w / 2; }
    if (u < tC) return STOP;
    const w = u - tC; return STOP + Math.min(a * w * w / 2, V * V / (2 * a)) + Math.max(0, w - V / a) * V;
  };
  // phase: train A comes out of the end wall ~1.5 s after the Liziba shot cuts in
  const tOut = (() => { for (let u = 0; u < PER; u += 0.02) if (headA(u) > L.Y1 + 2) return u; return 0; })();
  const OFF = SH ? SH.a / 30 + 1.5 - tOut : 0;
  for (const beam of [0, 1]) for (let c = 0; c < NC; c++) for (const hseg of [0, 1]) {
    const bx = beam ? L.BB : L.BA;
    const back = c * 2 * HL + (1 - hseg) * HL;                 // distance of this half's rear end behind the head (A)
    T.actor({ grow: false, sample: 0.25, period: PER,
      at(t) {
        const u = ((((t - OFF - (beam ? PER * 0.5 : 0)) % PER) + PER) % PER);
        const hd = headA(u);
        // beam B runs the same timetable mirrored along the beam (heading -y, from the tunnel to the far end)
        const m = (s) => beam ? 2 * STOP - TL - s : s;
        const r0 = hd - back - HL, r1 = hd - back;                 // this half along A
        let ya = m(r0), yb = m(r1); if (ya > yb) { const q = ya; ya = yb; yb = q; }
        if (yb < L.Y0 + 0.5 || yb > 30.2) return null;           // inside the slab's far end, or (even partly) in the tunnel
        const cab = (c === 0 && hseg === 1) ? 1 : (c === NC - 1 && hseg === 0) ? -1 : 0;
        const ang = beam ? -Math.PI / 2 : Math.PI / 2;
        const gw = cab ? null : hseg ? 'pu' : 'nu';
        return { x: bx, y: (ya + yb) / 2, z: Z, key: beam + '.' + cab + '.' + gw, ang, cab, gw };
      },
      draw(g, st) { CQ.monoCar(g, st.ang, { hl: HL / 2, cab: st.cab, half: true, gw: st.gw }); } });
  }
});
