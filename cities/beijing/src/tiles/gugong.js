'use strict';
/* (0,0) The Forbidden City and the Tiananmen gate, the heart of the axis.
   What it is: at the front (south, +y) the Gate of Heavenly Peace: a red podium with five arched doorways, a
   nine-bay hall on it with a double-eaved hip-and-gable roof in imperial yellow, red lanterns for National Day under
   the eaves, flags on the podium. In front of it the Golden Water River with five white marble bridges, two huabiao
   columns and stone lions. Behind it the palace: the Hall of Supreme Harmony on its three-tier white marble terrace
   (double-eaved hip roof, the highest rank), with the dragon ramp up the middle. The red palace wall with its yellow
   coping runs inside the moat along the north and west sides, and the corner tower stands on the north-west corner
   with its many-gabled roof, reflected in the moat.
   Who: tour groups in yellow caps behind a guide's flag, families photographing the gate, a child with a little flag,
   two sentries at the central doorway, visitors leaning on the terrace balustrade, a man flying nothing but looking
   up, people crossing the bridges. The honour guard marches out of the central doorway (actors of the square tile).
   What moves: tourists on loops through the courtyard and across the bridges, the guide's flag, pigeons. */
SF.tile('gugong', 0, 0, { rim: 30 }, function (T) {
  const H = 37, PAVE = '#E7E1D3', MOATZ = -1.8;
  /* ---------------- ground: paving, the moat, the Golden Water River ---------------- */
  T.ground(function (g) {
    K.slab(g, H, { top: PAVE });
    g.scuff(K.rect(-H, -H, H, H), { dir: -0.5, len: 3, c: '#F2EDE2', dens: 0.5, w: 0.45, spread: 0.1 });
    // the moat round the palace's south-east corner: water below its stone banks, along the east side and the south
    const moat = [[33.6, -H, MOATZ], [H, -H, MOATZ], [H, 9.6, MOATZ], [8, 9.6, MOATZ], [8, 5.6, MOATZ], [33.6, 5.6, MOATZ]];
    g.fill(moat, BC.lake);
    g.water(moat, { dens: 0.7 });
    // the far banks' stone faces (the palace side faces us), the near banks' paving drawn over the water's lower edge
    g.fill([[8, 5.6, 0], [33.6, 5.6, 0], [33.6, 5.6, MOATZ], [8, 5.6, MOATZ]], '#CFC8B8');
    g.fill([[33.6, -H, 0], [33.6, 5.6, 0], [33.6, 5.6, MOATZ], [33.6, -H, MOATZ]], '#BDB6A6');
    g.fill([[8, 9.6, 0], [H, 9.6, 0], [H, 11.4, 0], [8, 11.4, 0]], PAVE);
    g.fill([[6.4, 5.6, 0], [8, 5.6, 0], [8, 9.6, 0], [6.4, 9.6, 0]], PAVE);
    g.line([[8, 9.6, 0], [H, 9.6, 0]], { w: 0.7, c: '#8C8576', boil: false }); g.line([[8, 5.6, 0], [8, 9.6, 0]], { w: 0.7, c: '#8C8576', boil: false });
    g.line([[8, 5.6, MOATZ], [33.6, 5.6, MOATZ], [33.6, -H, MOATZ]], { w: 0.5, c: BC.waterD, boil: false });
    // the Golden Water River in front of the gate, with its marble banks
    const riv = [[-H, 31, -1.2], [H, 31, -1.2], [H, 34.4, -1.2], [-H, 34.4, -1.2]];
    g.fill(riv, BC.water); g.water(riv, { dens: 0.6 });
    g.fill([[-H, 31, 0], [H, 31, 0], [H, 31, -1.2], [-H, 31, -1.2]], '#E3DED2');
    g.fill([[-H, 34.4, 0], [H, 34.4, 0], [H, 35.6, 0], [-H, 35.6, 0]], '#EDE9E0');
    g.line([[-H, 34.4, 0], [H, 34.4, 0]], { w: 0.6, c: '#9C9686', boil: false }); g.line([[-H, 31, 0], [H, 31, 0]], { w: 0.6, c: '#9C9686', boil: false });
    // five bridges over it, the middle one widest (the guard's)
    const iB = g.cmds.length;
    for (const [x, w] of [[-14, 2.6], [-7, 3.0], [0, 4.0], [7, 3.0], [14, 2.6]]) {
      const q = [[x - w, 30.6, 0], [x + w, 30.6, 0], [x + w, 34.8, 0], [x - w, 34.8, 0]];
      g.fill(q, '#F4F1EA'); g.fill([[x - w, 34.4, 0], [x + w, 34.4, 0], [x + w, 34.4, -1.2], [x - w, 34.4, -1.2]], '#E6E1D5'); g.outline(q, { w: 0.5, c: '#9C9686', boil: false });
    }
    BN.flood(g, iB, 0.55, BN.WHITE, { fall: 0 });                           // (night: the white marble lit by the gate's floodlights)
    // the courtyard behind the gate: a grey brick path on the axis
    g.fill(K.rect(-3.5, 2, 3.5, 17), '#DCD5C6');
  }, { rim: true });

  /* ---------------- the palace walls, its gate and the corner tower ---------------- */
  // (night: the palace behind the gate is closed and dark, its walls and halls a shade darker than the moon makes them)
  T.obj([-36.5, -36.5, 28.4, -35.2], (g) => { BJ.wall(g, -36.5, -36.5, 28.4, -35.3, 6); BN.crown(g, 0, -0.25); }, { name: 'palace wall' });
  T.obj([-36.5, -35.2, -35.2, 0.6], (g) => { BJ.wall(g, -36.5, -35.2, -35.3, 0.6, 6); BN.crown(g, 0, -0.25); }, { name: 'palace wall' });
  T.obj([27.2, -35.2, 28.4, -5], (g) => { BJ.wall(g, 27.2, -35.2, 28.4, -5, 7); BN.flood(g, 0, 0.55, '#FFD08A'); for (const y of [-29, -19, -10]) g.glow2('lantern', g.p(28.5, y, 2.5), g.p(31, y, 0), { r: 2.0, col: '#FFC872' }); }, { name: 'palace wall' });   // (night: lit along the moat)
  T.obj([-35.2, -0.6, -6, 0.6], (g) => { BJ.wall(g, -35.2, -0.6, -6, 0.6, 7); BN.crown(g, 0, -0.2); }, { name: 'palace wall' });
  T.obj([6, -0.6, 23, 0.6], (g) => { BJ.wall(g, 6, -0.6, 23, 0.6, 7); BN.crown(g, 0, -0.2); }, { name: 'palace wall' });
  // the gate in the south wall (the Gate of Supreme Harmony, simplified): a red gatehouse with a yellow roof
  T.obj([-6, -2.2, 6, 2.2], function (g) {
    K.box(g, -6, -2.2, 6, 2.2, 0, 7.2, { t: '#C9B7A0', l: BC.red, r: shade(BC.red, 0.12) }, { w: 0.8 });
    const pts = [K.pt('L', 2.23, -2.2, 0)]; for (let k = 0; k <= 10; k++) { const t = Math.PI * k / 10; pts.push(K.pt('L', 2.23, -2.2 * Math.cos(t), 3.6 + 2.2 * Math.sin(t))); } pts.push(K.pt('L', 2.23, 2.2, 0));
    g.fill(pts, '#3A2A24'); g.line(pts, { w: 0.5, c: '#5E1E16', boil: false });
    g.fill(K.on('L', 2.22, -6, 6, 6.2, 7.2), BC.band);
    BJ.roof(g, -6, -2.2, 6, 2.2, 7.2, 3.4, { type: 'xie', col: BC.yellow, over: 1.4, lift: 0.6 });
    BN.crown(g, 0, -0.2);
  }, { name: 'palace gate' });
  T.obj([23, -5, 33, 5], function (g) {
    g.boilP = 0.3; const i0 = g.cmds.length;
    K.box(g, 23, -5, 33, 5, 0, 7, { t: '#C9B7A0', l: BC.red, r: shade(BC.red, 0.12) }, { w: 0.9 });
    K.box(g, 23, -5, 33, 5, 0, 0.8, { t: '#B9B6AE', l: '#A9A69E', r: '#97948D' }, { w: 0.5, boil: false, nohid: true, faces: "lr" });
    BJ.rail(g, 23, -5, 33, 5, 7, { h: 0.8 });
    BJ.hallBody(g, 25, -3, 31, 3, 7, 11.5, { bx: 3, by: 3 });
    // a skirt round the bottom storey, then two hip-and-gable roofs crossing (the cross plan of the corner tower)
    BJ.roof(g, 25, -3, 31, 3, 11.5, 3.2, { type: 'hip', col: BC.yellow, top: 0.42, over: 1.6, lift: 0.6 });
    BJ.hallBody(g, 26, -2, 30, 2, 12.8, 13.8, { doors: false, bx: 2, by: 2 });
    BJ.roof(g, 24.4, -1.6, 31.6, 1.6, 13.8, 4.2, { type: 'xie', col: BC.yellow, over: 1.2, lift: 0.7, ridge: 'x' });
    BJ.roof(g, 26.4, -3.6, 29.6, 3.6, 13.8, 4.2, { type: 'xie', col: BC.yellow, over: 1.2, lift: 0.7, ridge: 'y' });
    const f = g.p(28, 0, 18.2); g.disc2([f[0], f[1] - 1.2], 1.1, BC.gold); g.ring2([f[0], f[1] - 1.2], 1.1, { w: 0.35, c: '#7A5A20' });
    // at night the corner tower is floodlit gold, its golden roofs and red walls doubled in the moat below
    BN.flood(g, i0, 0.92, '#FFD08A', { lines: 0.3, fall: 0.3 });
    for (const [x, y, z, r, gx, gy] of [[33, 3, 3.5, 2.4, 33.2, 5.2], [31, 5, 3.5, 2.4, 31, 5.3], [30.6, 2.4, 9.5, 3.0, 32.6, 5.3], [28.4, 1.4, 15.4, 2.2, 30.2, 5.4], [33, -2.4, 4.0, 2.2, 33.4, -2.4]]) g.glow2('lantern', g.p(x, y, z), g.p(gx, gy, 0), { r, col: '#FFC872' });
  }, { name: 'corner tower' });

  /* ---------------- the Hall of Supreme Harmony on its three terraces ---------------- */
  T.obj([-26, -32, 18, -6], function (g) {
    g.boilP = 0.3;
    BJ.terrace(g, -26, -32, 18, -6, 0, 1.6, { sw: 7 });
    BJ.terrace(g, -23, -30, 15, -8.5, 1.6, 3.2, { sw: 6 });
    BJ.terrace(g, -20, -28, 12, -11, 3.2, 4.8, { sw: 5 });
    for (const x of [-18, 10]) { const c = g.p(x, -12.2, 4.8); g.fill2(arcPts(c[0], c[1] - 1.6, 1.8, 0, Math.PI, 8).concat([[c[0] - 1.8, c[1] - 1.6]]), '#6E5A3E', true); g.fill2([[c[0] - 1.9, c[1] - 1.8], [c[0] + 1.9, c[1] - 1.8], [c[0] + 1.7, c[1] - 2.4], [c[0] - 1.7, c[1] - 2.4]], '#5A4A32', true); }
    BJ.hallBody(g, -16, -26, 8, -14, 4.8, 12.6, { bx: 9, by: 4 });
    BJ.roof(g, -16, -26, 8, -14, 12.6, 4.4, { type: 'hip', col: BC.yellow, top: 0.42, over: 2.2, lift: 0.8 });
    BJ.hallBody(g, -14.5, -24.5, 6.5, -15.5, 14.4, 15.8, { doors: false, bx: 7, by: 3 });
    BJ.roof(g, -14.5, -24.5, 6.5, -15.5, 15.8, 7.0, { type: 'hip', col: BC.yellow, over: 2.2, lift: 0.9, rw: 2.0 });
    const b = K.on('L', -15.3, -5.6, -2.4, 14.0, 15.6); g.fill(b, '#3E5E9E'); g.outline(b, { w: 0.5, c: '#C9A23A', boil: false });
    BN.crown(g, 0, -0.25);
  }, { name: 'hall of supreme harmony' });

  /* ---------------- the Tiananmen gate ---------------- */
  T.obj([-19, 17, 19, 29.4], function (g) {
    g.boilP = 0.3;
    const x0 = -19, x1 = 19, y0 = 17, y1 = 29.4, PZ = 9, i0 = g.cmds.length;
    K.box(g, x0, y0, x1, y1, 0, PZ, { t: '#C9B7A0', l: BC.red, r: shade(BC.red, 0.12) }, { w: 1 });
    K.box(g, x0, y0, x1, y1, 0, 1.0, { t: '#C9C3B5', l: '#D7D1C3', r: '#BDB7A9' }, { w: 0.6, boil: false, nohid: true, faces: "lr" });
    // five arched doorways on the front, the middle one the tallest
    for (const [x, w, h] of [[-12, 1.7, 4.4], [-6, 2.0, 5.2], [0, 2.5, 6.4], [6, 2.0, 5.2], [12, 1.7, 4.4]]) {
      const pts = [K.pt('L', y1 + 0.03, x - w, 0)]; for (let k = 0; k <= 10; k++) { const t = Math.PI * k / 10; pts.push(K.pt('L', y1 + 0.03, x - w * Math.cos(t), h - w + w * Math.sin(t))); } pts.push(K.pt('L', y1 + 0.03, x + w, 0));
      g.fill(pts, '#3A2A24'); g.line(pts, { w: 0.55, c: '#5E1E16', boil: false });
    }
    // the white balustrade on the podium, then the hall, its two roofs
    BJ.rail(g, x0 + 0.3, y0 + 0.3, x1 - 0.3, y1 - 0.3, PZ, { h: 1.0, back: true });
    BJ.hallBody(g, -15, y0 + 2, 15, y1 - 2, PZ, PZ + 6.4, { bx: 9, by: 3 });
    BJ.roof(g, -15, y0 + 2, 15, y1 - 2, PZ + 6.4, 3.4, { type: 'hip', col: BC.yellow, top: 0.42, over: 2.0, lift: 0.7 });
    BJ.hallBody(g, -13.5, y0 + 3.2, 13.5, y1 - 3.2, PZ + 7.85, PZ + 9.0, { doors: false, bx: 7, by: 2 });
    BJ.roof(g, -13.5, y0 + 3.2, 13.5, y1 - 3.2, PZ + 9.0, 6.0, { type: 'xie', col: BC.yellow, over: 2.0, lift: 0.9, rw: 1.9 });
    // eight red lanterns under the lower eave (National Day)
    for (let i = 0; i < 8; i++) { const x = -12.6 + i * 3.6, c = g.p(x, y1 - 1.0, PZ + 4.6); TB_lantern2(g, c, 1.9, g.p(x, y1 + 0.6, 0)); }
    // flags at the ends of the podium
    for (const x of [-17.6, 17.6]) { const b = g.p(x, y1 - 0.8, PZ), t = g.p(x, y1 - 0.8, PZ + 6); g.segs2([b[0], b[1], t[0], t[1]], '#6E5A44', 0.4); BJ.flag2(g, [t[0], t[1]], 7, 4.6, 1.1 + x * 0.1); }
    // at night the gate is floodlit: the red walls glow, the yellow roofs turn gold, the doorways stay dark; its lights
    // lie on the Golden Water River in front
    BN.flood(g, i0, 0.9, '#FFD49A', { lines: 0.3, fall: 0.25 });
    for (const [x, z, r] of [[-12, 4.5, 3.2], [0, 4.5, 3.6], [12, 4.5, 3.2], [-7, 12.5, 3.0], [7, 12.5, 3.0], [0, 17.5, 2.8]]) g.glow2('lantern', g.p(x, y1 + 0.2, z), g.p(x, y1 + 0.6, 0), { r, col: '#FFC27A' });
    for (const x of [-16, -6, 6, 16]) g.glow2('lantern', g.p(x, y1 + 0.5, 0.5), g.p(x, y1 + 0.6, 0), { r: 1.0, col: '#FFE2B0' });
  }, { name: 'tiananmen' });
  // stone lions either side of the middle bridges, the two huabiao columns on the pavement
  for (const x of [-24, 24]) T.obj([x, 36], (g) => TB_huabiao(g, x, 36), { name: 'huabiao' });
  // bridge railings (low marble posts) either side of each bridge
  for (const [x, w] of [[-14, 2.6], [-7, 3.0], [0, 4.0], [7, 3.0], [14, 2.6]]) for (const s of [-1, 1]) {
    const xx = x + s * w; T.obj([xx - 0.2, 30.8, xx + 0.2, 34.6], (g) => { const segs = [], dots = []; for (let y = 30.9; y <= 34.6; y += 1.2) { const a = g.p(xx, y, 0), b = g.p(xx, y, 1.2); segs.push(a[0], a[1], b[0], b[1]); dots.push(b); } const a = g.p(xx, 30.9, 0.9), b = g.p(xx, 34.6, 0.9); segs.push(a[0], a[1], b[0], b[1]); g.segs2(segs, '#A9A394', 0.5); for (const d of dots) g.disc2([d[0], d[1] - 0.3], 0.42, '#F7F5EF'); BN.flood(g, 0, 0.62, BN.WHITE, { lines: 0.6, fall: 0 }); }, { name: 'bridge rail' });   // (night: lit by the gate's floodlights)
  }
  // the traffic lights for the guard's crossing on the kerb
  for (const x of [-6.5, 6.5]) T.actor({ sample: 5, period: 10, grow: false, cast: false,
    at(t) { const tc = BJF.cyc(t), red = BJF.HOLD.some(([a, b]) => tc >= a && tc < b); return { x, y: 36.4, key: red ? 'r' : 'g', red }; },
    draw(g, st) { TB_signal(g, st.red, 1); } });

  /* ---------------- the living layer ---------------- */
  // two sentries either side of the central doorway
  for (const x of [-3.6, 3.6]) T.cast([x, 30.2], (g) => BJ.person(g, x, 30.2, 0, BJ.guard(70 + x * 10, { dir: 1, rifle: true, pose: 'stand' })), { on: false });
  // a tour group with its guide in front of the gate, looking up at it
  const grp = [[-29, 35.4], [-30.6, 36.2], [-28.2, 36.6], [-31.8, 35.6], [-27.0, 35.6], [-33.0, 36.4], [-26.0, 36.5]];
  T.cast([-29, 36], (g) => {
    grp.slice().sort((a, b) => a[0] + a[1] - b[0] - b[1]).forEach(([x, y], i) => BJ.person(g, x, y, 0, BJ.tourist(120 + i, '#F2C230', { dir: 3, pose: i % 3 === 0 ? 'hold' : 'stand', phone: i % 3 === 0, reach: i % 3 === 0 ? [0.4, -8.4] : undefined })));
    const r = BJ.person(g, -21.4, 35.9, 0, BJ.who(129, { dir: 2, pose: 'wave', ph: 0.3, top: '#C9463E' })); const hd = r.hands[0]; g.segs2([hd[0], hd[1], hd[0] + 0.4, hd[1] - 7], '#6E5A44', 0.3); g.fill2([[hd[0] + 0.4, hd[1] - 7], [hd[0] + 4.2, hd[1] - 6.4], [hd[0] + 0.4, hd[1] - 5.0]], '#F2C230', true);
  }, { on: false });
  // a family photographing the gate: one kneels with the phone, the others pose with a little flag
  T.cast([14, 32.6], (g) => { BJ.person(g, 12.8, 32.2, 0, BJ.who(132, { dir: 1, pose: 'wave', ph: 0.6 })); BJ.person(g, 14.0, 32.8, 0, BJ.kid(133, { dir: 1, flag: true })); BJ.person(g, 15.4, 32.4, 0, BJ.who(134, { dir: 1 })); }, { on: false });
  T.cast([14.4, 36.4], (g) => BJ.person(g, 14.4, 36.4, 0, BJ.who(131, { dir: 3, pose: 'kneel', hands: [[-0.6, -9], [0.8, -9]] })), { on: false });
  // visitors on the terraces of the hall
  T.cast([-8, -12.2], (g) => { BJ.person(g, -9, -12.2, 4.8, BJ.tourist(140, '#E85A3A', { dir: 1, pose: 'hold', phone: true, reach: [0.4, -8.4] })); BJ.person(g, -7.4, -11.8, 4.8, BJ.tourist(141, '#E85A3A', { dir: 1 })); }, { on: true });
  T.cast([6, -7.3], (g) => { BJ.person(g, 6, -7.3, 1.6, BJ.who(142, { dir: 1, pose: 'stand' })); BJ.person(g, 7.6, -6.9, 1.6, BJ.who(143, { dir: 0, pose: 'stand' })); }, { on: true });
  T.cast([16.6, -18], (g) => BJ.person(g, 16.6, -18, 1.6, BJ.who(144, { dir: 0, pose: 'hold', phone: true, reach: [1, -8] })), { on: true });
  // a couple on the moat bank photographing the corner tower, an old man fishing in the moat
  T.cast([30, 10.6], (g) => { BJ.person(g, 29.4, 10.6, 0, BJ.who(145, { dir: 3, pose: 'hold', phone: true, reach: [0.4, -8.6] })); BJ.person(g, 31.2, 10.9, 0, BJ.who(146, { dir: 3 })); }, { on: false });
  T.cast([20, 10.8], (g) => { const r = BJ.person(g, 20, 10.8, 0, BJ.who(147, { old: true, dir: 3, pose: 'hold', reach: [1.2, -6.6] })); const hd = r.hands[0]; g.segs2([hd[0], hd[1], hd[0] + 10, hd[1] - 9], '#5A4A3C', 0.3); g.fine2([[hd[0] + 10, hd[1] - 9], [hd[0] + 11, hd[1] + 6]], { w: 0.15, c: '#8C8576' }); }, { on: false });
  // walkers: across the courtyard behind the gate, round the front, along the moat
  for (let i = 0; i < 4; i++) K.walker(T, BJ.tourist(150 + i, '#F2C230'), [[-30, 4], [0, 4], [0, 14], [-30, 14]], 1.4, { phase: 0.1 + i * 0.035 });
  K.walker(T, BJ.who(153), [[3.5, 3], [3.5, 15], [5.2, 15], [5.2, 3]], 1.0, { phase: 0.4 });
  K.walker(T, BJ.who(154), [[-24, 15.5], [-24, 30], [-34, 30], [-34, 15.5]], 1.0, { phase: 0.2 });
  K.walker(T, BJ.who(155), [[-33, -4], [-33, -33], [-28, -33], [-28, -4]], 1.1, { phase: 0.6 });
  K.walker(T, BJ.tourist(159, '#E85A3A'), [[20, -33], [24, -33], [24, -8], [20, -8]], 1.0, { phase: 0.3 });
  K.walker(T, BJ.tourist(160, '#E85A3A'), [[20, -33], [24, -33], [24, -8], [20, -8]], 1.0, { phase: 0.35 });
  K.walker(T, BJ.who(157), [[6, 30.1], [6, 36.3], [8, 36.3], [8, 30.1]], 0.9, { phase: 0.5 });
  K.walker(T, BJ.who(158), [[-6, 30.1], [-6, 36.3], [-8, 36.3], [-8, 30.1]], 0.8, { phase: 0.1 });
  // pigeons wheeling over the gate
  T.actor({ layer: 'top', sample: 5, period: 12, grow: false,
    at(t) { const a = t * 0.5; return { x: Math.cos(a) * 14, y: 10 + Math.sin(a) * 8, z: 30, key: 'p' + (Math.floor(t * 6) % 2), up: Math.floor(t * 6) % 2 }; },
    draw(g, st) { const o = g.p(0, 0, 0); for (let i = 0; i < 6; i++) BJ.pigeon2(g, [o[0] + (i % 3) * 5 - 5, o[1] + Math.floor(i / 3) * 4 + (i % 2) * 2], 1.5, (st.up + i) % 2, i === 2 ? '#F1EFE8' : '#9AA0A8'); } });
});

/* small Tiananmen props (shared with the square) */
function TB_lantern2(g, c, r, gp) {
  g.segs2([c[0], c[1] - r * 1.6, c[0], c[1] - r], '#5A4A3C', 0.3);
  const pts = [], i0 = g.cmds.length; for (let i = 0; i < 14; i++) { const t = TAU * i / 14; pts.push([c[0] + Math.cos(t) * r * 0.95, c[1] + Math.sin(t) * r * 0.8]); }
  g.fill2(pts, '#D8322A', true); g.fill2(pts.slice(0, 8).concat([[c[0] + r * 0.2, c[1]]]), '#B92A22', true);
  g.fill2([[c[0] - r * 0.45, c[1] - r * 0.95], [c[0] + r * 0.45, c[1] - r * 0.95], [c[0] + r * 0.45, c[1] - r * 0.7], [c[0] - r * 0.45, c[1] - r * 0.7]], '#E2B13A', true);
  g.fill2([[c[0] - r * 0.45, c[1] + r * 0.7], [c[0] + r * 0.45, c[1] + r * 0.7], [c[0] + r * 0.45, c[1] + r * 0.95], [c[0] - r * 0.45, c[1] + r * 0.95]], '#E2B13A', true);
  g.segs2([c[0], c[1] + r * 0.95, c[0], c[1] + r * 1.7, c[0] - 0.3, c[1] + r * 0.95, c[0] - 0.4, c[1] + r * 1.6, c[0] + 0.3, c[1] + r * 0.95, c[0] + 0.4, c[1] + r * 1.6], '#E2B13A', 0.3);
  // at night a light burns inside: the silk glows red-orange, the gold caps and tassels shine; gp: the ground under it
  const LN = { '#D8322A': '#F25A3A', '#B92A22': '#D23E26', '#E2B13A': '#F6C64E' };
  BN.each(g, i0, (cc) => (LN[cc] ? { nc: LN[cc] } : undefined));
  g.glow2('lantern', c, gp || c, { r: Math.max(1.5, r * 1.15), col: BN.LANT });
}
function TB_lion(g, x, y, s) {
  K.box(g, x - 1.2, y - 1.0, x + 1.2, y + 1.0, 0, 1.6, K.STONE, { w: 0.6 });
  const p = g.p(x, y, 1.6), P = (u, v) => [p[0] + u * s, p[1] + v];
  g.fill2(K.curve([P(-2.4, 0), P(-2.2, -3.2), P(-0.6, -4.4), P(0.4, -7.6), P(2.4, -8.2), P(3.2, -6.2), P(2.4, -4.2), P(2.6, 0)], 2, true), '#8E8A7E', true);
  g.fill2(K.curve([P(-0.2, -6.6), P(0.6, -8.6), P(2.6, -8.8), P(3.4, -7.0), P(2.2, -5.6), P(0.6, -5.4)], 2, true), '#7A766A', true);
  g.line2(K.curve([P(-2.4, 0), P(-2.2, -3.2), P(-0.6, -4.4), P(0.4, -7.6), P(2.4, -8.2), P(3.2, -6.2), P(2.4, -4.2), P(2.6, 0)], 2, true), { w: 0.45, c: '#4A463E', close: true, boil: false });
  g.disc2(P(2.6, -7.4), 0.25, '#2A2622');
}
function TB_huabiao(g, x, y) {
  const i0 = g.cmds.length;
  K.box(g, x - 1.4, y - 1.4, x + 1.4, y + 1.4, 0, 1.2, K.STONE, { w: 0.6 });
  K.cyl(g, x, y, 0.7, 1.2, 11, { t: '#F4F1EA', l: '#F3F0E8', r: '#DAD5C8' }, { w: 0.6, n: 8 });
  const a = g.p(x, y, 8.6); g.fill2([[a[0] - 3.4, a[1] - 0.6], [a[0] + 3.4, a[1] - 1.4], [a[0] + 3.4, a[1] + 0.4], [a[0] - 3.4, a[1] + 1.2]], '#F4F1EA', true); g.outline2([[a[0] - 3.4, a[1] - 0.6], [a[0] + 3.4, a[1] - 1.4], [a[0] + 3.4, a[1] + 0.4], [a[0] - 3.4, a[1] + 1.2]], { w: 0.4, c: '#8C8576', boil: false });
  K.cyl(g, x, y, 1.2, 11, 11.6, K.STONE, { w: 0.5, n: 8 });
  const t = g.p(x, y, 11.6); g.fill2([[t[0] - 0.8, t[1]], [t[0] + 0.8, t[1]], [t[0] + 0.5, t[1] - 2.2], [t[0] - 0.3, t[1] - 2.4]], '#E9E5DC', true);
  const sp = []; for (let z = 2; z < 10.5; z += 1.1) { const q = g.p(x, y + 0.7, z), r = g.p(x + 0.7, y, z + 0.5); sp.push(q[0], q[1], r[0], r[1]); } g.segs2(sp, '#B9B3A4', 0.3);
  // at night the marble column is floodlit from its base
  BN.flood(g, i0, 0.8, BN.WHITE, { lines: 0.4 }); g.glow('lantern', x, y, 5.5, { r: 2.0, col: '#FFE6BE' }); g.glow('lantern', x + 1.6, y + 1.6, 0.4, { r: 0.8, col: '#FFF0D0' });
}
/* a traffic light on a pole (wide-px drawing at the actor's origin): car heads facing both ways, red or green */
function TB_signal(g, red) {
  const b = g.p(0, 0, 0), t = g.p(0, 0, 8.5);
  g.fill2([[b[0] - 0.4, b[1]], [b[0] + 0.4, b[1]], [t[0] + 0.3, t[1]], [t[0] - 0.3, t[1]]], '#5E5A52');
  const h = [t[0] - 1.2, t[1] + 0.5];
  g.fill2([[h[0] - 1.3, h[1] - 4.4], [h[0] + 1.3, h[1] - 4.4], [h[0] + 1.3, h[1] + 0.6], [h[0] - 1.3, h[1] + 0.6]], '#3A3530', true);
  g.disc2([h[0], h[1] - 3.4], 0.75, red ? '#E0503E' : '#5A544A'); if (red) g.mark({ nc: true, light: true });
  g.disc2([h[0], h[1] - 1.7], 0.75, '#5A544A'); g.disc2([h[0], h[1] - 0.0], 0.75, red ? '#5A544A' : '#5FC07A'); if (!red) g.mark({ nc: true, light: true });   // the lit lamp shines at night
}
