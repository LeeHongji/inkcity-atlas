'use strict';
/* (0,-100) The Peak: the Island's green hill rising behind Central, drawn as a stack of terraces (a diorama's contour
   layers) dense with trees, a few white villas with red roofs, Lugard Road's path round the slope with walkers.
   The Peak Tram climbs straight up it from the lower terminus on Garden Road (the tile's near edge, by the trams) to
   the Peak Tower at the top: a funicular, two green-and-cream cars on one cable, one going up as the other comes down,
   passing each other on the loop half way; the track rides a viaduct of trestles over the falling ground, 28 degrees.
   On top, the Peak Tower: a concrete pedestal holding the upper terminus, crowned by its upturned bowl ('the wok'),
   and its terrace where the crowd at the rail looks out over the city as the lights come on. 山頂 THE PEAK.
   Who: the queue at the lower terminus, riders in the cars, the crowd on the terrace, hikers, a dog walker. */
SF.tile('peak', 0, -100, { rim: 4 }, function (T) {
  const H = 37, C0 = [-10, -24], NL = 7, DZ = 4.2;
  const rad = (k, th) => (47 - 5.9 * k) * (1 + 0.11 * Math.sin(3 * th + k * 0.7) + 0.05 * Math.sin(5 * th + 2 * k));
  const ring = (k) => { const p = []; for (let i = 0; i < 40; i++) { const th = TAU * i / 40, r = rad(k, th); p.push([clamp(C0[0] + Math.cos(th) * r, -H, H), clamp(C0[1] + Math.sin(th) * r, -H, H)]); } return p; };
  const RINGS = []; for (let k = 1; k <= NL; k++) RINGS.push(ring(k));
  const inside = (pts, x, y) => pointInPoly(x, y, pts.flat());
  const hAt = (x, y) => { let h = 0; for (let k = 0; k < NL; k++) if (inside(RINGS[k], x, y)) h = (k + 1) * DZ; return h; };
  // the tram line: x 8 from the lower terminus (y 31, z 0) straight up to the upper terminus (y -23, z 28)
  const TX = 8, Y0 = 31, Y1 = -23, ZT = 28, zt = (y) => ZT * (Y0 - y) / (Y0 - Y1);
  const loopX = (y, s) => { const m = clamp(1 - Math.abs(y - 4) / 7, 0, 1); return TX + s * 1.7 * smooth(Math.min(1, m * 1.6)); };

  T.ground(function (g) {
    HK.ground(g, -H, -H, H, H, HK.C.hill);
    g.grass(K.rect(-H, -H, H, H), { dens: 0.4, c: HK.C.hillD });
    // Garden Road at the foot, paved
    g.fill(K.rect(-H, 24, H, H), HK.C.pave); HK.paving(g, -H, 24, H, H, { step: 2.4 });
  }, { rim: true });

  /* ---- the terraces of the hill ---- */
  T.obj([-H, -H, H, H], (g) => {
    g.boilP = 0.15;
    for (let k = 0; k < NL; k++) {
      const pts = RINGS[k], z0 = k * DZ, z1 = (k + 1) * DZ, n = pts.length, quads = [];
      for (let i = 0; i < n; i++) {
        const a = pts[i], b = pts[(i + 1) % n], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        let nx = b[1] - a[1], ny = -(b[0] - a[0]); if (nx * (mx - C0[0]) + ny * (my - C0[1]) < 0) { nx = -nx; ny = -ny; }
        const L = Math.hypot(nx, ny) || 1; if ((nx + ny) / L <= 0.02) continue;
        quads.push({ q: [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], d: mx + my, t: clamp(0.5 + 0.5 * (nx - ny) / L, 0, 1) });
      }
      quads.sort((p, q) => p.d - q.d);
      for (const qd of quads) g.fill(qd.q, mix('#A99A78', '#8E7F60', qd.t));
      const top = pts.map((p) => [p[0], p[1], z1]); g.fill(top, mix(HK.C.hill, '#B5D08E', k / NL));
      g.line(top.concat([top[0]]), { w: 0.6, c: '#5E7A44', boil: false });
      for (const qd of quads) g.line([qd.q[0], qd.q[1]], { w: 0.4, c: '#6E6248', boil: false });
      g.grass(top, { dens: 0.25, c: '#7FA463' });
    }
  }, { name: 'the peak' });

  /* ---- trees thick on the slopes, villas ---- */
  const R = RNG(4242);
  for (let i = 0; i < 46; i++) {
    const x = -34 + R() * 68, y = -34 + R() * 56; if (Math.abs(x - TX) < 4.5 || (x > -2 && x < 18 && y < -16)) continue;
    const z = hAt(x, y), col = R.pick(['#5E8F52', '#6FA06A', '#4E7E46', '#7FAE5E']);
    T.obj([x, y], (g) => K.tree(g, x, y, { r: 2.4 + R() * 1.6, h: 3.0, col, z }), { on: true, name: 'tree' });
  }
  for (const [x, y, col] of [[-26, 2, '#F3F1EA'], [20, -10, '#F3EFE3'], [-30, -12, '#ECE7DB']]) { const z = hAt(x, y); T.obj([x - 3, y - 2.5, x + 3, y + 2.5], (g) => { K.box(g, x - 3, y - 2.5, x + 3, y + 2.5, z, z + 4.2, { t: '#E9E6DE', l: col, r: shade(col, 0.1) }, { w: 0.7 }); K.win(g, 'L', y + 2.5, x - 2, x - 0.6, z + 1, z + 3, { style: 'glass' }); K.win(g, 'L', y + 2.5, x + 0.6, x + 2, z + 1, z + 3, { style: 'glass' }); K.hip(g, x - 3.4, y - 2.9, x + 3.4, y + 2.9, z + 4.2, 2.0, '#B8564A', { w: 0.6 }); g.glow('lamp', x, y + 2.6, z + 3.4, { r: 0.9, base: z }); }, { on: true, name: 'villa' }); }   // night: the lamp over the door

  /* ---- the tram line: a viaduct of trestles, two rails, the passing loop (in pieces, back to front) ---- */
  for (let y = Y1; y < Y0; y += 9) {
    const ya = y, yb = Math.min(Y0, y + 9);
    T.obj([TX - 2.4, ya, TX + 2.4, yb], (g) => {
      const s = [];
      for (let yy = ya; yy <= yb + 0.01; yy += 3) { const z = zt(yy), zg = hAt(TX, yy); for (const sx of [-1, 1]) { const x = yy > -3 && yy < 11 ? loopX(yy, sx) : TX + sx * 1.0; const a = g.p(x, yy, z - 0.3), b = g.p(x, yy, zg); s.push(a[0], a[1], b[0], b[1]); } }
      g.segs2(s, '#7E7466', 0.55);
      // the deck and sleepers, rails (two tracks through the loop)
      const st = 0.8, sl = [], rl = [];
      for (const side of yb > -3 && ya < 11 ? [-1, 1] : [0]) {
        const xs = (yy) => side ? loopX(yy, side) : TX;
        for (let yy = ya; yy < yb; yy += st) { const a = g.p(xs(yy) - 1.1, yy, zt(yy)), b = g.p(xs(yy) + 1.1, yy, zt(yy)); sl.push(a[0], a[1], b[0], b[1]); }
        for (const dv of [-0.55, 0.55]) for (let yy = ya; yy < yb - 0.01; yy += 1) { const y2 = Math.min(yb, yy + 1), a = g.p(xs(yy) + dv, yy, zt(yy)), b = g.p(xs(y2) + dv, y2, zt(y2)); rl.push(a[0], a[1], b[0], b[1]); }
      }
      g.segs2(sl, '#8E6E4E', 0.7); g.segs2(rl, '#4A4540', 0.4);
    }, { on: true, name: 'tram line' });
  }
  // the lower terminus on Garden Road
  T.obj([2, 27, 15, 36], (g) => {
    K.box(g, 2, 31, 15, 36, 0, 5.4, { t: '#E9E2CF', l: '#F3ECD8', r: '#DDD3BA' }, { w: 0.8 });
    g.fill(K.on('L', 36.02, 5, 11, 0, 3.8), '#5A4E42'); g.mark({ nc: '#F2C887', spill: true });
    const i0 = g.cmds.length; K.sign(g, 'L', 36.04, 3, 14, 4.0, 5.2, '#2E6B4E', 'PEAK TRAM', { w: 0.3 }); HK.nite(g, i0, { nc: true }); HK.signGlow(g, 'L', 36.04, 3, 14, 4.0, 5.2, '#8FE0B0', 0.2);
    const r = [[1.4, 26.6, 5.0], [15.6, 26.6, 5.0], [15.6, 31, 5.4], [1.4, 31, 5.4]]; g.fill(r, '#3E7A5A'); g.outline(r, { w: 0.5, c: '#1F3A2C', boil: false });
    for (const x of [4, 8.5, 13]) g.glow('lamp', x, 28.8, 4.8, { r: 1.1 });          // night: lamps under the canopy
  }, { name: 'lower terminus' });
  [[4.4, 37.6, 3], [5.8, 38.0, 3], [7.2, 37.5, 3], [11.6, 38.0, 2], [13.0, 37.6, 3]].forEach(([x, y, d], i) => HK.stand(T, x, y - 1.6, HK.who(9700 + i, { dir: d, pose: i % 2 ? 'hold' : 'stand', phone: i % 2 === 1 }), { name: 'queue' }));

  /* ---- the Peak Tower: the pedestal with the upper terminus, the bowl on top, the terrace ---- */
  const PT = { x: 8, y: -28 }, zb = hAt(PT.x, PT.y);
  T.obj([-2, -37, 18, -19], (g) => {
    g.boilP = 0.25;
    const CN = { t: '#DDD8CC', l: '#E9E4D8', r: '#CFC9BC' };
    K.box(g, 1, -35, 15, -21, zb, ZT, CN, { w: 0.85 });
    for (const [f, p, a0, a1] of [['L', -21, 1, 15], ['R', 15, -35, -21]]) { for (let z = zb + 3; z < ZT - 1; z += 3.2) { g.fill(K.on(f, p + 0.02, a0 + 0.8, a1 - 0.8, z, z + 1.4), f === 'L' ? '#93AEBD' : '#7E9AAD'); g.mark({ nc: f === 'L' ? '#FFE6B4' : '#F2CF8E' }); } }   // lit at night
    g.fill(K.on('L', -20.98, 5.6, 10.4, ZT - 4.2, ZT), '#4A4038'); g.mark({ nc: '#E9B96A', spill: true });
    // the terrace deck round the top, with its rail
    g.fill(K.rect(-1.4, -36.6, 17.4, -19.4, ZT), '#E3DED3'); g.outline(K.rect(-1.4, -36.6, 17.4, -19.4, ZT), { w: 0.6, boil: false });
    g.fill([[-1.4, -19.4, ZT - 0.6], [17.4, -19.4, ZT - 0.6], [17.4, -19.4, ZT], [-1.4, -19.4, ZT]], '#C9C3B5'); g.fill([[17.4, -36.6, ZT - 0.6], [17.4, -19.4, ZT - 0.6], [17.4, -19.4, ZT], [17.4, -36.6, ZT]], '#B9B3A6');
    // the 'wok': a long crescent roof on four legs over the terrace, its ends swept up
    const legs = []; for (const [x, y] of [[3, -32], [13, -32], [3, -24], [13, -24]]) { const a = g.p(x, y, ZT), b = g.p(x, y, ZT + 3.8); legs.push(a[0], a[1], b[0], b[1]); } g.segs2(legs, '#9AA3A8', 0.9);
    const N = 16, cx = PT.x, cy = PT.y, hw = 4.6, top = (u) => ZT + 5.0 + 4.4 * u * u, bot = (u) => ZT + 3.8 + 1.4 * u * u, X = (u) => cx + u * 11, iw = g.cmds.length;
    const back = [], front = [], under = [];
    for (let i = 0; i <= N; i++) { const u = -1 + 2 * i / N; back.push([X(u), cy - hw * (1 - 0.25 * u * u), top(u)]); front.push([X(u), cy + hw * (1 - 0.25 * u * u), top(u)]); under.push([X(u), cy + hw * 0.7 * (1 - 0.3 * u * u), bot(u)]); }
    g.fill(back.concat(front.slice().reverse()), '#C9CED1');
    g.fill(front.concat(under.slice().reverse()), '#E9E6DE');
    const endF = [front[N], back[N], [X(1) + 0.4, cy, bot(1)], under[N]]; g.fill(endF, '#B9C0C4');
    g.line(back, { w: 0.6, boil: false }); g.line(front, { w: 0.85, boil: false }); g.line(under, { w: 0.6, boil: false });
    g.line([front[0], back[0]], { w: 0.6, boil: false }); g.outline(endF, { w: 0.5, boil: false });
    const rib = []; for (let i = 2; i < N; i += 2) { const a = g.p.apply(g, front[i]), b = g.p.apply(g, under[i]); rib.push(a[0], a[1], b[0], b[1]); } g.segs2(rib, '#B3B8BB', 0.3);
    // at night the bowl is lit from beneath, warm white, and the terrace under it
    HK.nite(g, iw, { nc: (c) => ({ '#E9E6DE': '#FFEFD0', '#C9CED1': mix(nightColour('#C9CED1'), '#C9CED1', 0.5), '#B9C0C4': '#E9D9B8', '#B3B8BB': '#F2D9A8' })[c] });
    for (const u of [-0.7, 0, 0.7]) g.glow('lantern', X(u), cy + 2, ZT + 3.6, { r: 3.0, col: '#FFE9C0' });
    HK.board(g, 'L', -20.9, 3.6, 12.4, ZT - 6.0, ZT - 3.4, '#2E6B4E', '山頂', { en: 'THE PEAK', rim: '#F3ECD8' });
  }, { on: true, name: 'peak tower' });
  // the crowd at the terrace rail looking out at the city (backs half to us), a couple taking a selfie
  [[0, -19.8, 1], [2.4, -20.0, 1], [5.2, -19.9, 0], [10.8, -20.1, 1], [13.4, -19.8, 0], [17.0, -22, 0], [17.0, -26, 0], [17.0, -31, 0]].forEach(([x, y, d], i) => HK.stand(T, x, y, HK.who(9720 + i, { dir: d, pose: i % 3 === 1 ? 'hold' : 'stand', phone: i % 3 === 1 }), { z: ZT, name: 'view' }));
  T.obj([16.6, -36.6, 17.6, -19.4], (g) => HK.rail(g, [17.3, -36.4, ZT], [17.3, -19.6, ZT], { h: 1.6 }), { on: true, name: 'rail' });
  T.obj([-1.4, -19.9, 17.4, -19.3], (g) => { HK.rail(g, [-1.2, -19.5, ZT], [17.2, -19.5, ZT], { h: 1.6 }); HK.railLights(g, -1.2, 17.2, -19.5, { base: ZT, z: 1.6, step: 6 }); }, { on: true, name: 'rail' });

  /* ---- the two cars: the funicular (each drawn on the slope around its centre) ---- */
  for (let k = 0; k < 2; k++) T.actor({ sample: 0.2, period: HT.PEAK.C, grow: false,
    at(t) { const u = HT.peakU(k, t), y = lerp(Y0 - 3.4, Y1 + 3.4, u), x = y > -3 && y < 11 ? loopX(y, k ? 1 : -1) : TX; return { x, y, z: zt(y), key: 'c' + k }; },
    draw(g) {
      const s = ZT / (Y0 - Y1), hl = 3.2, hw = 1.3, P = (dx, dy, dz) => [dx, dy, -s * dy + dz];
      const cream = '#EFE6C8', green = '#2F6B4A';
      const sideB = [P(hw, -hl, 0.3), P(hw, hl, 0.3), P(hw, hl, 1.6), P(hw, -hl, 1.6)], sideT = [P(hw, -hl, 1.6), P(hw, hl, 1.6), P(hw, hl, 3.4), P(hw, -hl, 3.4)];
      const end = [P(-hw, hl, 0.3), P(hw, hl, 0.3), P(hw, hl, 3.4), P(-hw, hl, 3.4)], roof = [P(-hw, -hl, 3.4), P(hw, -hl, 3.4), P(hw, hl, 3.4), P(-hw, hl, 3.4)];
      g.fill(sideB, '#245A41'); g.fill(sideT, shade(cream, 0.1));
      for (let i = 0; i < 4; i++) { const a = -hl + 0.4 + i * 1.55; g.fill([P(hw + 0.02, a, 1.9), P(hw + 0.02, a + 1.2, 1.9), P(hw + 0.02, a + 1.2, 3.0), P(hw + 0.02, a, 3.0)], i === 1 ? HK.C.litD : '#7E9AAD'); g.mark({ nc: '#FFE3A6', light: i % 2 === 1 }); }   // lit inside at night
      g.fill(end, green); g.fill([P(-hw * 0.7, hl + 0.02, 1.9), P(hw * 0.7, hl + 0.02, 1.9), P(hw * 0.7, hl + 0.02, 3.0), P(-hw * 0.7, hl + 0.02, 3.0)], '#C9DCE6'); g.mark({ nc: '#FFEFCC', light: true });
      g.fill(roof, '#D9D3C2');
      for (const q of [sideB, sideT, end, roof]) g.outline(q, { w: 0.5, boil: false });
    } });
  /* ---- hikers on the slope path, a dog walker by the terminus ---- */
  HK.walker(T, HK.who(9740, { cap: '#C8372D', bag: '#3F5F8F' }), [[-30, 14], [-8, 14], [-8, 6]], 0.8, { phase: 0.2, z: (x, y) => hAt(x, y) });
  HK.walker(T, HK.who(9741, { scarf: '#E6C24F' }), [[-20, -6], [-2, -6]], 0.7, { phase: 0.5, z: (x, y) => hAt(x, y) });
  HK.walker(T, HK.who(9742), [[-34, 32], [-4, 32]], 0.9, { phase: 0.3 });
  HK.walker(T, HK.helper(9743, { phone: true }), [[34, 30.6], [18, 30.6]], 0.8, { phase: 0.6 });
});
