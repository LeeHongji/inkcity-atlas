'use strict';
/* (0,-100) Jingshan Park, north of the palace on the axis.
   What it is: the hill made from the earth of the palace moat, in three rising terraces wooded in autumn colours
   (red maples, gold ginkgo, dark pines), stone steps up its front, two small green-roofed pavilions on its shoulders
   and on the top the Wanchun Pavilion, square, with three tiers of yellow roof edged in green: the best view over the
   golden roofs of the Forbidden City to the south (towards the viewer).
   Who: visitors along the top looking south at the palace, phones up; climbers on the steps; at the foot of the hill
   an amateur choir in three rows with their songbooks, a conductor and an accordionist (Jingshan's mornings are full
   of singing); a tai chi group in white silk; a man sweeping leaves.
   What moves: the conductor's arms, the tai chi group turning slowly through their form, climbers on the steps,
   walkers round the foot of the hill. */
SF.tile('jingshan', 0, -100, { rim: 20 }, function (T) {
  const H = 37, CX = -2, CY = -10, TIERS = [[27, 0, 5.0], [19.5, 5.0, 10.0], [12, 10.0, 14.0]];
  T.ground(function (g) {
    K.slab(g, H, { top: '#E2DDD0' });
    g.scuff(K.rect(-H, -H, H, H), { dir: -0.5, len: 3, c: '#EDE9E0', dens: 0.4, w: 0.45 });
    const lawn = K.rect(-H, -H, H, H); void lawn;
  }, { rim: true });
  BJ.sidewalk(T, ['s', 'w', 'e'], { sp: 15, off: { s: 0, w: 6, e: 2 }, bikes: [['s', 24, 5], ['e', 20, 4]] });

  // the hill: three terraces with sloped, wooded sides (a squashed rounded square in plan)
  const ring = (r, z, n) => { const p = []; for (let i = 0; i < n; i++) { const a = TAU * i / n, c = Math.cos(a), s = Math.sin(a), k = Math.pow(Math.pow(Math.abs(c), 3) + Math.pow(Math.abs(s), 3), -1 / 3); p.push([CX + c * r * k, CY + s * r * k * 0.95, z]); } return p; };
  T.obj([CX - 27, CY - 26, CX + 27, CY + 26], function (g) {
    g.boilP = 0.2;
    const n = 36;
    TIERS.forEach(([r, z0, z1], ti) => {
      const lo = ring(r, z0, n), hi = ring(r - 3.2, z1, n), quads = [];
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n, a = TAU * (i + 0.5) / n, q = [lo[i], lo[j], hi[j], hi[i]];
        if (Math.cos(a) + Math.sin(a) < -0.25) continue;
        const lit = clamp(0.5 + 0.5 * Math.cos(a - Math.PI * 0.75), 0, 1);
        quads.push({ q, d: Math.cos(a) + Math.sin(a), c: mix('#8E9452', '#B4B872', lit) });
      }
      quads.sort((p, q) => p.d - q.d);
      g.fill(hi, '#C2C07E');
      for (const Q of quads) g.fill(Q.q, Q.c);
      const front = []; for (let i = 0; i <= n; i++) { const a = TAU * i / n; if (Math.cos(a) + Math.sin(a) > -0.25) front.push(lo[i % n]); }
      g.grass(hi, { dens: 0.5 });
      g.line(ring(r, z0, n).filter((p, i) => { const a = TAU * i / n; return Math.cos(a) + Math.sin(a) > -0.25; }), { w: 0.8, c: '#6E6A3E', boil: false });
      g.line(ring(r - 3.2, z1, n).filter((p, i) => { const a = TAU * i / n; return Math.cos(a) + Math.sin(a) > -0.6; }), { w: 0.55, c: '#8E8A5A', boil: false });
      // the stone steps up the front slope (towards +y) of every tier
      const y0 = CY + r * 0.95, y1 = CY + (r - 3.2) * 0.95, sw = 2.6, steps = 7, sg = [];
      for (let k = 0; k <= steps; k++) { const t = k / steps, y = lerp(y0, y1, t), z = lerp(z0, z1, t), a = g.p(CX - sw / 2, y, z), b = g.p(CX + sw / 2, y, z); sg.push(a[0], a[1], b[0], b[1]); }
      g.fill([[CX - sw / 2, y0, z0], [CX + sw / 2, y0, z0], [CX + sw / 2, y1, z1], [CX - sw / 2, y1, z1]], '#E9E4D6');
      g.segs2(sg, '#A9A394', 0.4);
      void ti;
    });
    g.fill(ring(8.8, 14.02, 24), '#E6E1D3'); g.outline(ring(8.8, 14.02, 24), { w: 0.5, c: '#A9A394', boil: false });
  }, { name: 'hill' });
  // trees on the slopes (all stand on the hill)
  const TR = [];
  TIERS.forEach(([r, z0, z1], ti) => { const n = [19, 13, 6][ti]; for (let i = 0; i < n; i++) { const a = -Math.PI * 0.95 + (TAU * 0.98) * (i + 0.5) / n; if (Math.abs(a - Math.PI / 2) < 0.22) continue; const rr = r - 1.8, c = Math.cos(a), s = Math.sin(a), k = Math.pow(Math.pow(Math.abs(c), 3) + Math.pow(Math.abs(s), 3), -1 / 3); TR.push([CX + c * rr * k, CY + s * rr * k * 0.95, (z0 + z1) / 2 + 0.3, ti * 20 + i]); } });
  TR.forEach(([x, y, z, s]) => T.obj([x, y], (g) => {
    const kind = s % 5;
    if (kind === 0 || kind === 3) BJ.maple(g, x, y, { z, r: 3.0, h: 3.0, seed: s, col: kind ? '#E07A3A' : BC.maple });
    else if (kind === 1) BJ.ginkgo(g, x, y, { z, r: 2.6, h: 3.0, seed: s });
    else BJ.pine(g, x, y, { z, r: 3.0, h: 3.0, seed: s, col: kind === 4 ? '#6E8A4E' : BC.pine });
  }, { on: true, name: 'tree' }));
  // the two shoulder pavilions and the Wanchun Pavilion on the top
  for (const sx of [-1, 1]) {
    const px = CX + sx * 14.5, py = CY - 1.0, z = 10.0;
    T.obj([px - 2.4, py - 2.4, px + 2.4, py + 2.4], function (g) {
      BJ.hallBody(g, px - 1.8, py - 1.8, px + 1.8, py + 1.8, z, z + 4.2, { bx: 1, by: 1, doors: false });
      BJ.roof(g, px - 1.8, py - 1.8, px + 1.8, py + 1.8, z + 4.2, 3.2, { type: 'pyr', col: '#4F8F6A', over: 1.0, lift: 0.4 });
    }, { on: true, name: 'pavilion' });
  }
  T.obj([CX - 5, CY - 5, CX + 5, CY + 5], function (g) {
    const z = 14.0;
    BJ.terrace(g, CX - 4.6, CY - 4.6, CX + 4.6, CY + 4.6, z, z + 0.8, { steps: 'L', sw: 2.6, rail: true });
    BJ.hallBody(g, CX - 3.2, CY - 3.2, CX + 3.2, CY + 3.2, z + 0.8, z + 6.2, { bx: 3, by: 3, doors: false });
    BJ.roof(g, CX - 3.2, CY - 3.2, CX + 3.2, CY + 3.2, z + 6.2, 3.0, { type: 'pyr', col: BC.yellow, top: 0.42, over: 1.6, lift: 0.5, c: '#3E6E4A' });
    BJ.hallBody(g, CX - 2.6, CY - 2.6, CX + 2.6, CY + 2.6, z + 7.1, z + 8.2, { bx: 2, by: 2, doors: false });
    BJ.roof(g, CX - 2.6, CY - 2.6, CX + 2.6, CY + 2.6, z + 8.2, 2.6, { type: 'pyr', col: BC.yellow, top: 0.42, over: 1.4, lift: 0.5, c: '#3E6E4A' });
    BJ.hallBody(g, CX - 2.0, CY - 2.0, CX + 2.0, CY + 2.0, z + 9.0, z + 10.0, { bx: 2, by: 2, doors: false });
    BJ.roof(g, CX - 2.0, CY - 2.0, CX + 2.0, CY + 2.0, z + 10.0, 4.2, { type: 'pyr', col: BC.yellow, over: 1.3, lift: 0.5, c: '#3E6E4A' });
  }, { on: true, name: 'wanchun pavilion' });

  // the park's red wall along its far sides, and trees on the level ground round the hill
  T.obj([-37, -37, 37, -35.8], (g) => BJ.wall(g, -37, -37, 37, -35.9, 5), { name: 'wall' });
  T.obj([-37, -35.8, -35.8, 33], (g) => BJ.wall(g, -37, -35.8, -35.9, 33, 5), { name: 'wall' });
  [[26, -30, 'p'], [31, -18, 'm'], [27, -4, 'g'], [32, 8, 'p'], [-31, -28, 'm'], [-24, -33, 'p'], [-31, 2, 'g'], [-30, 14, 'm'], [12, -33, 'g'], [30, 26, 'm']].forEach(([x, y, k], i) => T.obj([x, y], (g) => { if (k === 'p') BJ.pine(g, x, y, { r: 3.4, h: 4.4, seed: 90 + i }); else if (k === 'm') BJ.maple(g, x, y, { r: 3.4, h: 3.8, seed: 90 + i, col: i % 2 ? '#E07A3A' : BC.maple }); else BJ.ginkgo(g, x, y, { r: 3.2, h: 4.4, seed: 90 + i }); }, { name: 'tree' }));

  /* ---------------- the people ---------------- */
  // along the top, looking south over the palace
  [[CX - 7.2, CY + 6.6], [CX - 5.4, CY + 7.4], [CX + 3.6, CY + 7.6], [CX + 5.8, CY + 6.8], [CX + 7.4, CY + 5.0]].forEach(([x, y], i) => T.cast([x, y], (g) => BJ.person(g, x, y, 14.0, BJ.who(700 + i, i % 2 ? { dir: 1, pose: 'hold', phone: true, reach: [0.3, -9] } : { dir: 1 })), { on: true }));
  // climbers on the front steps (walk up and down the three flights)
  const stairZ = (y) => { for (const [r, z0, z1] of TIERS) { const y0 = CY + r * 0.95, y1 = CY + (r - 3.2) * 0.95; if (y <= y0 && y >= y1) return lerp(z0, z1, (y0 - y) / (y0 - y1)); } return y > CY + 27 * 0.95 ? 0 : y < CY + 8.8 * 0.95 ? 14.0 : y > CY + 19.5 * 0.95 ? 5.0 : 10.0; };
  K.walker(T, BJ.who(710), [[CX - 0.6, CY + 30], [CX - 0.6, CY + 6.4]], 0.7, { phase: 0.2, z: (x, y) => stairZ(y) });
  K.walker(T, BJ.tourist(711, '#E85A3A'), [[CX + 0.7, CY + 6.4], [CX + 0.7, CY + 30]], 0.8, { phase: 0.6, z: (x, y) => stairZ(y) });
  // the choir at the foot of the hill, facing their conductor
  const CH = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) CH.push([-9.2 + c * 2.3 + (r % 2) * 0.9, 21.4 + r * 2.0]);
  CH.sort((a, b) => a[0] + a[1] - b[0] - b[1]);
  T.cast([0, 23.4], (g) => { CH.forEach(([x, y], i) => BJ.person(g, x, y, 0, BJ.who(720 + i, { old: i % 3 !== 0, dir: 1, pose: i % 4 === 1 ? 'stand' : 'hold', top: ['#C9382E', '#F3F1EA', '#3F5F8F', '#C9382E', '#F3F1EA'][i % 5] }))); }, { on: false, name: 'choir' });
  T.actor({ sample: 5, period: 2,
    at(t) { const k = Math.floor(t * 4) % 4; return { x: -0.4, y: 30.4, key: 'c' + k, k }; },
    draw(g, st) { BJ.person(g, 0, 0, 0, BJ.who(740, { dir: 3, pose: st.k % 2 ? 'cheer' : 'wave', ph: st.k * 0.25, top: '#2F343B' })); } });
  T.cast([-12.4, 27.6], (g) => { const r = BJ.person(g, -12.4, 27.6, 0, BJ.who(741, { old: true, dir: 0, pose: 'hold', cap: '#5A5A55' })); const hd = r.hands[0]; g.fill2([[hd[0] - 3, hd[1] - 3.4], [hd[0] + 2.4, hd[1] - 3.4], [hd[0] + 2.4, hd[1] + 1.2], [hd[0] - 3, hd[1] + 1.2]], '#C9382E', true); const sg = []; for (let k = 0; k < 6; k++) sg.push(hd[0] - 2.6 + k * 0.9, hd[1] - 3.2, hd[0] - 2.6 + k * 0.9, hd[1] + 1.0); g.segs2(sg, '#F3E3B8', 0.3); }, { on: false });
  // tai chi in white silk, turning slowly through the form
  [[18, 22], [21.2, 22.6], [18.6, 25.4], [21.8, 26]].forEach(([x, y], i) => T.actor({ sample: 5, period: 16,
    at(t) { const k = Math.floor(((t + i * 0.3) / 2) % 8); return { x, y, key: 't' + k, k }; },
    draw(g, st) { const poses = [['stand', 0, 1], ['hold', 0, 1], ['wave', 0.2, 0], ['wave', 0.5, 0], ['hold', 0, 0], ['cheer', 0.3, 1], ['stand', 0, 0], ['hold', 0, 1]]; const [p, ph, d] = poses[st.k]; BJ.person(g, 0, 0, 0, BJ.who(750 + i, { old: true, dir: d, pose: p, ph, top: '#FBFAF6', bot: '#FBFAF6', jacket: undefined })); } }));
  // walkers round the foot of the hill and a sweeper
  K.walker(T, BJ.who(760), [[-33.4, 20], [-33.4, -33.6], [22, -33.6], [22, 18]], 1.0, { phase: 0.1 });
  K.walker(T, BJ.who(761, { old: true }), [[24.4, 18], [24.4, -33.6], [-33.4, -33.6], [-33.4, 20]], 0.8, { phase: 0.5 });
  K.walker(T, BJ.who(762, { top: '#E8742A', cap: '#E8742A' }), [[-30, 30], [-14, 30]], 0.5, { phase: 0.3 });
});
