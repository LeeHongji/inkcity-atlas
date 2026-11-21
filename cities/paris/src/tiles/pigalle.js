'use strict';
/* (100,100) Pigalle, the near corner of the map. The boulevard de Clichy runs across the tile along x, with its central
   promenade of plane trees and benches; cars and scooters both ways, fading in from the boulevard's ends. On its far
   side the Moulin Rouge: the low red cabaret front with its bulb-lined sign and canopy, the queue for the evening
   show, and on the roof the red windmill whose sails turn all day. Beside it a corner block with a tabac (the red
   "carotte" sign) and a café terrace; on the near side a crêpe stand, a sex-shop-free row of little shops, a Guimard
   entrance to Blanche on the promenade, a Wallace fountain, a Morris column. The tile's near edges are the map's edge. */
SF.tile('pigalle', 100, 100, { rim: 60 }, function (T) {
  const H = 37, BY0 = -9, BY1 = 9, PM0 = -2.2, PM1 = 2.2;     // the boulevard's carriageways, its central promenade
  T.ground(function (g) {
    K.slab(g, H, { top: PC.pave, cut: 'xy' });
    g.fill(K.rect(-H, BY0, H, PM0), PC.asph); g.fill(K.rect(-H, PM1, H, BY1), PC.asph);
    g.fill(K.rect(-H, PM0, H, PM1), PC.gravel);
    for (const y of [BY0, PM0, PM1, BY1]) g.line([[-H, y, 0], [H, y, 0]], { w: 0.5, c: '#A9A296', boil: false });
    for (const r of [[-H, BY0, H, PM0], [-H, PM1, H, BY1]]) g.scuff(K.rect(r[0], r[1], r[2], r[3]), { dir: Math.atan2(AY, AX), len: 8, c: '#DDD8CC', dens: 0.5, w: 0.5, spread: 0.05 });
    const dsh = []; for (const c of [(BY0 + PM0) / 2, (PM1 + BY1) / 2]) for (let x = -H + 2; x < H - 3; x += 7) { const a = g.p(x, c, 0), b = g.p(x + 3, c, 0); dsh.push(a[0], a[1], b[0], b[1]); } g.segs2(dsh, '#F7F5EE', 0.8);
    // zebras where the promenade meets the side street
    for (let k = BY0 + 0.6; k < BY1 - 0.4; k += 1.8) if (k < PM0 || k > PM1) g.fill(K.rect(-6, k, -2, k + 1.1), '#F7F5EE');
    g.scuff(K.rect(-H, -H, H, BY0), { dir: -0.6, len: 3, c: '#F2EEE4', dens: 0.5, w: 0.5, spread: 0.6 });
    g.scuff(K.rect(-H, BY1, H, H), { dir: -0.6, len: 3, c: '#F2EEE4', dens: 0.5, w: 0.5, spread: 0.6 });
  }, { rim: true });

  /* ---------------- the Moulin Rouge ---------------- */
  const MX0 = -30, MX1 = -8, MY0 = -26, MY1 = -13.5, RED = { t: '#C9584B', l: '#B8443A', r: '#9E3A31' };
  T.obj([MX0, MY0, MX1, MY1], function (g) {
    g.boilP = 0.35;
    K.box(g, MX0, MY0, MX1, MY1, 0, 8.6, RED, { w: 0.9 });
    // the bulb-lined sign band, the lettering, the canopy, the doors
    const sb = K.on('L', MY1 + 0.04, MX0 + 2, MX1 - 2, 5.4, 7.9); g.fill(sb, '#7E2A24'); g.outline(sb, { w: 0.4, c: '#4A1A16', boil: false });
    const c = g.p((MX0 + MX1) / 2, MY1 + 0.06, 6.65); PA.letters2(g, c, 46, 3.4, '#F6E7B0', 'MOULIN ROUGE', 0.55, PA.dirOf('L'));
    const bulbs = []; for (let a = MX0 + 2.2; a < MX1 - 2; a += 0.6) { bulbs.push(g.p(a, MY1 + 0.07, 5.5)); bulbs.push(g.p(a, MY1 + 0.07, 7.8)); } for (const b of bulbs) g.disc2(b, 0.32, '#F6E7B0');
    PA.awning(g, 'L', MY1, MX0 + 4, MX1 - 4, 4.8, 2.2, { col: '#2A2622', ink: '#F6E7B0', seed: 3, word: 'BAL DU MOULIN ROUGE' });
    for (const a of [-24, -19, -14]) g.fill(K.on('L', MY1 + 0.03, a - 1.2, a + 1.2, 0, 3.6), '#4A1A16');
    for (let a = MY0 + 1.5; a < MY1 - 1; a += 3) PA.win(g, 'R', MX1, a, a + 1.2, 1.4, 4.2, { pane: '#7E2A24', sc: '#E9C46A' });
    K.box(g, MX0 - 0.3, MY0 - 0.3, MX1 + 0.3, MY1 + 0.3, 8.6, 9.2, { t: '#8E3A30', l: '#E9C46A', r: '#C9A040' }, { w: 0.55, nohid: true });
    // the windmill's body on the roof (its sails are an actor)
    const wx = -24, wy = -20;
    K.box(g, wx - 2.6, wy - 2.6, wx + 2.6, wy + 2.6, 9.2, 16.4, { t: '#C9584B', l: '#B8443A', r: '#9E3A31' }, { w: 0.85 });
    for (let z = 10.6; z < 16; z += 1.4) { const a = g.p(wx - 2.6, wy + 2.62, z), b = g.p(wx + 2.6, wy + 2.62, z), cc = g.p(wx + 2.62, wy - 2.6, z); g.segs2([a[0], a[1], b[0], b[1], b[0], b[1], cc[0], cc[1]], '#8A2E26', 0.3); }
    K.win(g, 'L', wy + 2.6, wx - 0.6, wx + 0.6, 11.4, 13.2, { style: 'dark' });
    K.hip(g, wx - 3.0, wy - 3.0, wx + 3.0, wy + 3.0, 16.4, 3.8, '#6E3A2A', { c: '#3A1E16' });
    // the corner block next door: a tabac and a café
  }, { name: 'moulin rouge' });
  // the sails: four lattice blades turning in the plane facing the boulevard (+y), hub on the windmill's front
  T.actor({ sample: 5, period: 12, grow: false,
    at(t) { const q = Math.floor(t * 4) % 24; return { x: -24, y: -17.1, z: 14.2, key: q, q }; },
    draw(g, st) {
      // the sails turn in the plane of the windmill's front (x-z), drawn back blade first
      const a0 = st.q / 24 * (Math.PI / 2), hub = g.p(0, 0, 0), W = (r, a, w) => g.p(Math.cos(a) * r + Math.cos(a + Math.PI / 2) * w, 0, Math.sin(a) * r + Math.sin(a + Math.PI / 2) * w);
      for (let k = 0; k < 4; k++) {
        const a = a0 + k * Math.PI / 2, L0 = 1.0, L1 = 8.4, w = 1.6;
        const A = W(L0, a, 0), B = W(L1, a, 0), A2 = W(L0, a, w), B2 = W(L1, a, w);
        g.fill2([A, B, B2, A2], '#F1E2C6');
        const lat = []; for (let j = 1; j < 7; j++) { const t = j / 7, p = W(lerp(L0, L1, t), a, 0), p2 = W(lerp(L0, L1, t), a, w); lat.push(p[0], p[1], p2[0], p2[1]); } g.segs2(lat, '#9E3A31', 0.45);
        g.line2([W(0, a, 0), B], { w: 1.0, c: '#4A1A16', boil: false, ext: 0 }); g.line2([A2, B2], { w: 0.6, c: '#9E3A31', boil: false, ext: 0 }); g.line2([B, B2], { w: 0.5, c: '#9E3A31', boil: false, ext: 0 });
      }
      g.disc2(hub, 1.0, '#E9C46A'); g.ring2(hub, 1.0, { c: '#4A1A16', w: 0.4 });
    } });
  // the queue along the canopy
  T.cast([-19, -11.4], function (g) { const sp = []; for (let i = 0; i < 11; i++) sp.push([-29 + i * 1.6, -11.6 + (i % 2) * 0.5]); sp.forEach(([x, y], i) => PA.person(g, x, y, 0, PA.who(1400 + i, { dir: i % 4 === 0 ? 1 : 2, pose: i % 3 === 0 ? 'hold' : 'stand' }))); }, { name: 'show queue' });
  // the doorman
  T.cast([-19, -12.6], (g) => PA.person(g, -6.6, -12.4, 0, { dir: 1, top: '#2A2622', bot: '#2A2622', jacket: '#F3F1EA', tie: '#7E2A24', skin: SKIN[3], hair: HAIR[0], hairStyle: 'buzz', shoe: '#2A2622' }), { on: true });

  /* ---------------- blocks round the boulevard ---------------- */
  T.obj([-36, -36, -30.5, -12], (g) => PA.haus(g, { x0: -36, y0: -36, x1: -30.5, y1: -12, et: 4, seed: 901, faces: 'LR', shopsL: [[-35.4, -31, '#2F3A4F', 'shop']], chim: [[-33, -35, 'x', 3]] }), { name: 'haus 1' });
  T.obj([-6, -36, 10, -12], (g) => PA.haus(g, { x0: -6, y0: -36, x1: 10, y1: -12, et: 4, seed: 902, shopsL: [[-5.4, 3, '#7E2A24', 'cafe'], [4.4, 9.4, '#2F4A3E', 'door']], shopsR: [[-34, -26, '#3F5F8F', 'shop'], [-24, -14, '#7E2A24', 'shop']], chim: [[2, -35, 'x', 4]] }), { name: 'haus tabac' });
  // the tabac's carotte: a red lozenge sign standing out from the corner
  T.obj([10.4, -12.6], (g) => { const c = g.p(10.6, -12.4, 6.4); g.segs2([c[0] - 3, c[1] + 1.2, c[0], c[1]], '#2E3332', 0.4); g.fill2([[c[0], c[1] - 3.6], [c[0] + 1.6, c[1]], [c[0], c[1] + 3.6], [c[0] - 1.6, c[1]]], '#C9463E', true); g.line2([[c[0], c[1] - 3.6], [c[0] + 1.6, c[1]], [c[0], c[1] + 3.6], [c[0] - 1.6, c[1]]], { w: 0.4, c: '#6E1E18', close: true, boil: false }); const lt = []; for (let k = 0; k < 5; k++) lt.push(c[0] - 0.5, c[1] - 2.2 + k * 1.1, c[0] + 0.5, c[1] - 2.2 + k * 1.1); g.segs2(lt, '#F3E3A0', 0.3); }, { on: true, name: 'carotte' });
  PA.waiter(T, PA.terrace(T, 'L', -12, -5.4, 3, { seed: 91, z: 5.2, out: 2.4 }), 9, {});
  T.obj([14, -36, 36, -12], (g) => PA.haus(g, { x0: 14, y0: -36, x1: 36, y1: -12, et: 4, seed: 903, shopsL: [[15, 22, '#2F3A4F', 'shop'], [24, 30, '#5A3E2E', 'shop'], [31, 35, '#2F4A3E', 'door']], shopsR: [[-34, -26, '#7E2A24', 'shop'], [-24, -14, '#3F5F8F', 'shop']], chim: [[25, -35, 'x', 4]] }), { name: 'haus 3' });
  // the near side: a low row of little shops and a crêpe stand (kept low: this is the map's front edge)
  [[-34, -22, '#E9DCC0', '#3F5F8F'], [-20, -6, '#F1E6CF', '#7E2A24'], [6, 20, '#E3D3B8', '#2F4A3E'], [22, 34, '#EFE1C9', '#5A3E2E']].forEach(([x0, x1, col, sc], i) => T.obj([x0, 27, x1, 33], function (g) {
    K.box(g, x0, 27, x1, 33, 0, 6.6, { t: shade(col, -0.15), l: col, r: shade(col, 0.1) }, { w: 0.8 });
    PA.shop(g, 'L', 33, x0 + 0.5, x1 - 0.5, 4.4, sc, 'shop', 950 + i);
    PA.mansard(g, x0, 27, x1, 33, 6.6, { h: 2.0, d: 0.9, h2: 0.3, dormers: 3.4, chim: [[x0 + 0.6, 30, 'y', 2]] });
    // and their fronts to the boulevard: the face we see from the boulevard is the far one (y = 16), we draw an awning edge
  }, { name: 'near shop ' + i }));
  T.obj([-1.5, 17.5], (g) => K.stall(g, -1.5, 17.5, { face: 'R', L: 2.0, D: 1.3, a: '#E6C24F', b: '#F3F1EA', goods: (g2, D, L) => { for (let k = 0; k < 3; k++) g2.disc2(g2.p(D - 0.2, -L + 0.6 + k * 1.3, 2.7), 0.9, '#E9C98A'); } }), { name: 'crepes' });
  T.cast([2.2, 18.2], (g) => { PA.person(g, 2.2, 18.2, 0, PA.who(1420, { dir: 2, pose: 'hold' })); PA.person(g, 3.4, 16.2, 0, PA.who(1421, { dir: 2, k: 0.75 })); }, { on: true });
  // the strip between the boulevard and the shops: trees, benches, a caricaturist, parked scooters
  for (const x of [-32, -22, -11, 9, 19, 29]) T.obj([x, 14.2], (g) => PA.plane(g, x, 14.2, { r: 3.3, h: 6.0, turn: 0.5 + h1(x + 90) * 0.4 }), { name: 'strip tree' });
  for (const x of [-27, 14, 24]) T.cast([x, 20.6], (g) => { K.bench(g, x, 19.4, { face: 'L', L: 2.0 }); PA.person(g, x - 0.8, 20.2, 1.3, PA.who(1460 + x, { dir: 1, pose: 'sit' })); if (x !== 14) PA.person(g, x + 1.0, 20.2, 1.3, PA.who(1461 + x, { dir: 1, pose: 'sit', scarf: '#E6C24F' })); }, { on: true });
  T.cast([-17, 20], (g) => { PA.painter(g, -16, 20, PA.who(1470, { beret: '#B24A3E', top: '#2F3A4F' }), 'R', 1470); PA.person(g, -19.6, 19.4, 1.1, PA.who(1471, { dir: 0, pose: 'sit' })); const st = g.p(-19.6, 19.4, 0); g.segs2([st[0] - 1.4, st[1], st[0] - 1.2, st[1] - 3.8, st[0] + 1.4, st[1], st[0] + 1.2, st[1] - 3.8], '#6E5A44', 0.4); }, { on: true });
  for (let i = 0; i < 4; i++) { const x = 30 - i * 2.6; T.obj([x, 11.6], (g) => g.at(x, 11.6, 0, (g2) => PA.scooter(g2, Math.PI / 2, null, ['#E9E2CC', '#C9463E', '#3F5F8F', '#7A8C6E'][i])), { name: 'parked scooter' }); }

  /* ---------------- the promenade ---------------- */
  for (let x = -33; x <= 33; x += 8.5) if (Math.abs(x - 12) > 4) T.obj([x, -1.2], (g) => PA.plane(g, x, -1.2, { r: 3.4, h: 6.2, turn: 0.5 + h1(x + 400) * 0.4 }), { name: 'promenade tree' });
  T.obj([10, -1.8, 14, 1.8], (g) => PA.metro(g, 12, 0, { ax: 'x' }), { name: 'blanche' });
  T.obj([22.3, -0.6], (g) => PA.wallace(g, 22.3, -0.6), { name: 'wallace' });
  T.obj([-21, 0], (g) => PA.morris(g, -21, 0), { name: 'morris' });
  for (const x of [-29, -4, 30.5]) T.cast([x, -0.6], (g) => { K.bench(g, x, -1.8, { face: 'L', L: 2.0 }); PA.person(g, x - 0.8, -0.8, 1.3, PA.who(1430 + x, { dir: 1, pose: 'sit' })); PA.person(g, x + 1.0, -0.8, 1.3, PA.who(1431 + x, { dir: 1, pose: 'sit', dress: '#C9584B' })); }, { on: true });
  PA.walker(T, PA.who(1441), [[36, 1.3], [-36, 1.3]], 1.5, { phase: 0.6 });
  PA.walker(T, PA.who(1442), [[-36, -10.8], [36, -10.8]], 1.4, { phase: 0.4 });
  PA.walker(T, PA.who(1443, { baguette: true }), [[36, 11], [-36, 11]], 1.2, { phase: 0.1 });
  PA.walker(T, PA.who(1444), [[-36, 24.6], [36, 24.6]], 1.4, { phase: 0.7 });
  PA.walker(T, PA.who(1445), [[36, 35.2], [-36, 35.2]], 1.3, { phase: 0.3 });
  // the boulevard's traffic: two lanes, a timetable that keeps each lane's vehicles apart
  const LN = [[1, (BY0 + PM0) / 2 + 0.4 + 0.0, ['car', 'scooter', 'taxi']], [-1, (PM1 + BY1) / 2, ['scooter', 'car', 'car']]];
  const V = 8, SPN = 84, P = SPN / V, COLS = ['#E9E2CC', '#3F5F8F', '#C9584B', '#7A8C6E', '#2E3134'];
  LN.forEach(([d, y, kinds], li) => kinds.forEach((kind, k) => T.actor({ sample: 0.2, period: P,
    at(t) { const s = ((((li * 17 + k * SPN / kinds.length + d * V * t) % SPN) + SPN) % SPN) - SPN / 2, a = Math.min(1, (SPN / 2 - 2 - Math.abs(s)) / 6); if (a <= 0.02) return null; return { x: s, y: d > 0 ? (PM1 + BY1) / 2 : (BY0 + PM0) / 2, key: 0, ang: d > 0 ? 0 : Math.PI, alpha: a < 1 ? a : null }; },
    draw(g, st) { const col = COLS[(li * 3 + k) % COLS.length]; if (kind === 'taxi') PA.taxi(g, st.ang); else if (kind === 'scooter') PA.scooter(g, st.ang, PA.who(1450 + li * 5 + k, { bare: false }), col); else PA.car(g, st.ang, { col }); } })));
  PA.streetSide(T, { furn: [[78, 41.6, 'velib', 'x']] });
});
