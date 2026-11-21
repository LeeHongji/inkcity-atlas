'use strict';
/* (-100,100) the Yangtze cableway: the Xinhua Road station on its cliff, the cabins crossing the river.
   What it is: a plain 1980s station hall on the cliff top above the Yangtze, the track cables leaving through a wide
   opening in its river face and sagging 1,100 m across the water to Nan'an (the satellite on the far bank). Two red
   cabins shuttle on two tracks, one out while the other comes back, passing each other over the middle of the river.
   Below the station the cliff is hung with timber stilt houses (diaojiaolou) on posts, a zigzag stair between them.
   Levels: the cliff top (a terrace, z 16) with the station on it; the stilt houses' floors at 11 and 6 on posts down
   to the lane at z 0 that runs along the Yangtze road. The terrace keeps 22 u clear of the car street behind it.
   Who: a queue of tourists at the ticket window, a couple photographing from the cliff rail, a porter on the zigzag,
   a grandmother hanging washing on a stilt-house balcony, a man smoking on his doorstep, kids on the stair.
   Moving: the two cabins (timed so they pass over mid-river in the shot, with a barge below), walkers on the stair.
   The cables are drawn flat with this tile's ground (they never hide anything but cars far below them). */
SF.tile('suodao', -100, 100, { rim: 52 }, function (T) {
  const H = 37, ZT = 16, ZS = 21.5, SH = SCENE.shots.find((s) => s.name === 'suodao');
  const TRK = [-7, -2.4], FAR = 156, ZF = 13, SAG = 7;            // cable tracks (local x), far station (local y), its height
  const cz = (u) => lerp(ZS, ZF, u) - SAG * 4 * u * (1 - u);
  const cable = (g, ya, yb) => { for (const x of TRK) for (const d of [-0.5, 0.5]) { const pts = []; for (let i = 0; i <= 16; i++) { const y = lerp(ya, yb, i / 16), u = (y - 14) / (FAR - 14); pts.push([x + d, y, cz(u) + (d > 0 ? 0 : 0.3)]); } g.line(pts, { w: 0.4, c: '#3A3530', boil: false, wob: 0.1 }); } };

  T.ground(function (g) {
    K.slab(g, H, { top: '#DAD1BE', cut: '' });
    g.fill(K.rect(-37, 28, 37, 37), '#D8CFBE'); CQ.paving(g, -37, 28, 37, 37, 0);
    // the cables: two track ropes and a haul rope per track, sagging to the far bank
    cable(g, 44, FAR);
  }, { rim: true });
  // the near stretch of the cables, from the station to beyond the road, stands as its own object (over the cars)
  T.obj([-8, 30, -1, 45], (g) => cable(g, 14, 44.5), { under: 99, name: 'cables' });

  /* ---- the cliff top and the station ---- */
  T.obj([-30, -22, 22, 14], (g) => {
    CQ.terrace(g, -30, -22, 22, 14, 0, ZT, { top: '#D7D0C0' });
    CQ.rail(g, 'L', 13.6, 6, 21.5, ZT, { h: 1.4 }); CQ.rail(g, 'R', 21.6, -21, 13.5, ZT, { h: 1.4 });
    CQ.rail(g, 'L', 13.6, -29.5, -16, ZT, { h: 1.4 });
  }, { name: 'cliff' });
  T.obj([-15, 0, 5, 14], (g) => {
    const z = ZT; g.boilP = 0.25;
    K.box(g, -15, 0, 5, 14, z, z + 9, { t: '#D9D6CE', l: '#E6E1D5', r: '#CFC9BC' }, { w: 0.9 });
    // the opening the cables leave through, dark inside, the bull wheels just visible
    g.fill(K.on('L', 14.02, -10, 1, z + 3.4, z + 7.6), '#3A3F44');
    for (const x of TRK) { const c = g.p(x, 13.5, z + 5.6); g.ring2(c, 2.2, { w: 0.6, c: '#8C8576' }); }
    K.box(g, -15.6, -0.6, 5.6, 14.6, z + 9, z + 9.8, '#B9B3A6', { w: 0.7 });
    CQH.sign(g, 'L', 14.65, -13, 3, z + 9.9, z + 12.2, '#C23B2F', '长江索道');
    for (const [a, b] of [[-14, -11], [2, 4.4]]) K.win(g, 'L', 14, a, b, z + 1.2, z + 7.4, { style: 'navy' });
    for (let y = 1.5; y < 13; y += 3.2) K.win(g, 'R', 5, y, y + 1.8, z + 4.2, z + 7.2, { style: 'navy' });
    g.fill(K.on('R', 5.02, 1, 4, z, z + 3), '#4A4540');
  }, { on: true, name: 'station' });
  T.obj([8, -2, 13, 2], (g) => { K.box(g, 8, -2, 13, 2, ZT, ZT + 3.6, { t: '#D9D3C4', l: '#C23B2F', r: '#A3322A' }, { w: 0.6 }); g.fill(K.on('L', 2.02, 9, 12, ZT + 1.4, ZT + 2.8), '#E9DEC0'); }, { on: true, name: 'ticket' });
  T.obj([-29, -21, -17, -9], (g) => CQ.block(g, { x0: -29, y0: -21, x1: -17, y1: -9, z: ZT, h: 26, col: '#E3D9C8', seed: 77, st: 2.8, shop: ['火锅', CQC.red], shopR: ['小面', '#E6B84A'], garden: true }), { on: true, name: 'cliff tower' });
  T.obj([-6, -19], (g) => CQ.fig(g, -6, -19, { z: ZT, r: 5.4, h: 4.6 }), { on: true });
  T.obj([14, -16], (g) => CQ.bloom(g, 14, -16, { z: ZT, r: 3.6 }), { on: true });

  /* ---- the stilt houses down the cliff face and the zigzag stair between them ---- */
  T.obj([-34, 14, -18, 26], (g) => CQ.stilt(g, { x0: -34, y0: 14.2, x1: -20, y1: 22, zb: 0, zf: 9.5, n: 2, lanterns: true }), { name: 'stilt 1' });
  T.obj([6, 14, 22, 24], (g) => CQ.stilt(g, { x0: 8, y0: 14.2, x1: 21, y1: 21.5, zb: 0, zf: 6, n: 2, wood: '#7A5A44' }), { name: 'stilt 2' });
  T.obj([24, 2, 36, 18], (g) => CQ.stilt(g, { x0: 25, y0: 2, x1: 35, y1: 15, zb: 0, zf: 3.5, n: 3, ridge: 'y' }), { name: 'stilt 3' });
  T.obj([-16, 14, 4, 26], (g) => {
    // two flights against the cliff, with a landing: z 0 -> 8 climbing towards -x, then 8 -> 16 climbing towards +x
    CQ.steps(g, -15, 20, 3, 23.5, 0, 8, 'x', { rise: 0.6 });
    g.fill(K.rect(-16, 14.2, -12, 23.5, 8), '#D9D2C2'); K.box(g, -16, 17, -12, 20, 0, 8, { t: '#D9D2C2', l: CQC.wall, r: CQC.wallD }, { w: 0.6 });
    const n = 14; for (let i = 0; i < n; i++) { const xa = -12 + 15 * i / n, xb = -12 + 15 * (i + 1) / n, z = 8 + 8 * (i + 1) / n; g.fill(K.rect(xa, 14.2, xb, 17, z), i % 2 ? '#DAD3C3' : '#D0C8B6'); g.fill(K.on('L', 17, xa, xb, z - 8 / n, z), '#C2BAA8'); }
    CQ.rail(g, 'L', 23.4, -15, 3, 0, { h: 1.1 });
  }, { name: 'zigzag' });

  /* ---- people ---- */
  for (let i = 0; i < 9; i++) { const x = 6 + (i % 3) * 1.8, y = 3 + Math.floor(i / 3) * 2.2 + h1(i) * 0.6; T.cast([x, y], (g) => CQ.person(g, x, y, ZT, CQ.who(1000 + i, { dir: 3, pose: i % 3 === 1 ? 'hold' : 'stand', phone: i % 3 === 1, umbrella: i === 4 ? '#5F8FC9' : undefined })), { on: true, name: 'queue' }); }
  T.cast([16, 12.5], (g) => { CQ.person(g, 16, 12.5, ZT, CQ.who(1010, { dir: 1, pose: 'hold', phone: true })); CQ.person(g, 18, 12.6, ZT, CQ.who(1011, { dir: 1, pose: 'wave', ph: 0.3 })); }, { on: true, name: 'photo' });
  T.cast([-27, 22.6], (g) => CQ.person(g, -27, 22.6, 9.5, CQ.elder(1012, { dir: 1, pose: 'hold' })), { on: true, name: 'balcony' });
  T.cast([15, 22.5], (g) => { CQ.stool(g, 15, 23.6, '#8A6446'); K.person(g, 15, 23.6, 1.3, CQ.elder(1013, { dir: 1, pose: 'sit', reach: [2.4, 1] })); }, { name: 'doorstep' });
  CQ.steamActor(T, 16.5, 22, 4.2, 0.6, 'rgba(220,216,206,0.6)', 3);
  const zz = (x, y) => y > 17.5 ? clamp((3 - x) / 18, 0, 1) * 8 : 8 + clamp((x + 12) / 15, 0, 1) * 8;
  CQ.walk(T, CQ.bangWho(1020), [[2.5, 21.8], [-14.5, 21.8], [-14, 15.6], [2.6, 15.6], [2.6, 15], [-14, 15.6], [-14.5, 21.8]], 0.7, { z: zz, porter: { load: ['#C9B48A', '#5F8FC9'] }, phase: 0.2 });
  CQ.walk(T, CQ.who(1021, { k: 0.78 }), [[2.5, 22.2], [-14.5, 22.2], [-14, 15.8], [2.6, 15.8], [-14, 15.8], [-14.5, 22.2]], 1.1, { z: zz, phase: 0.6 });
  CQ.walk(T, CQ.who(1022), [[-34, 31], [30, 31]], 1.3, { phase: 0.3 });
  CQ.walk(T, CQ.elder(1023, { cage: true }), [[24, 33], [-20, 33]], 0.9, { phase: 0.7 });
  CQ.walk(T, CQ.who(1024), [[-14, -4], [-2, -4], [-2, -12], [-14, -12]], 1.2, { z: ZT, phase: 0.1 });

  /* ---- the cabins: a shuttle on two tracks, passing over the middle of the river in the shot ---- */
  const RUN = 26, DW = 6, CYC = 2 * (RUN + DW);
  const u0 = (t) => { const c = ((t % CYC) + CYC) % CYC; if (c < DW) return 0; if (c < DW + RUN) return smooth((c - DW) / RUN); if (c < 2 * DW + RUN) return 1; return 1 - smooth((c - 2 * DW - RUN) / RUN); };
  // phase: the cabins meet (u = 0.5) four seconds into the shot
  const OFF = SH ? SH.a / 30 + 4 - (DW + RUN / 2) : 0;
  [0, 1].forEach((k) => {
    const riders = [CQ.who(1030 + k * 3), CQ.who(1031 + k * 3), CQ.who(1032 + k * 3)];
    T.actor({ grow: false, sample: 0.3, period: CYC,
      at(t) { const a = u0(t - OFF), u = k ? 1 - a : a; const y = 14 + (FAR - 14) * u; if (y < 15.2 || y > FAR - 18) return null; return { x: TRK[k], y, z: cz(u), key: 'c' + k, ang: Math.PI / 2 }; },
      draw(g, st) { CQ.cabin(g, st.ang, { col: k ? '#B8392E' : '#C9502F', riders }); } });
  });
});
