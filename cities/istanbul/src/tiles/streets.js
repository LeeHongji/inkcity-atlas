'use strict';
/* Istanbul's streets, with the water (water.js) in the same map-wide tile.
   - The avenue x = -50 runs the whole map: two car lanes (right-hand traffic: southbound on the west side, x -58;
     northbound x -42) and the T1 tram's two tracks in the middle (x -52.6 / -47.4), paved between the rails. It crosses
     the Golden Horn on the Galata Bridge (its own tile, bridge.js) and climbs to the deck on ramps (drawn by the
     neighbouring tiles).
   - The street y = 50 west of the avenue (lanes y 44 westbound, y 56 eastbound); its cars turn into and out of the
     avenue (src/37_timetable.js). East of the avenue it is Sirkeci square, paved and pedestrian, with a great round bed
     of tulips, benches, a simit cart, a shoe-shiner, pigeons, down to the Bosphorus quay.
   - On the Asian side: the Üsküdar sea-wall promenade (y -63..-37) with benches, erguvan trees and people with tea on
     the wall; the Kadıköy waterfront (y 37..63) where the red nostalgic tram shuttles to its terminus by the pier.
   Vehicles fade out at the cut ends of the streets. */
SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const E = IT.END, EA = 137, A = IS.C.asph, PV = IS.C.pave, LINE = '#F5F2EA';
  T.ground(function (g) {
    // the avenue (not over the Horn), the west street, the intersection
    for (const [y0, y1] of [[-E, IT.HORN.N], [IT.HORN.S, E]]) g.fill(K.rect(-63, y0, -37, y1), A);
    g.fill(K.rect(-E, 37, -37, 63), A);
    // footways along the avenue and the west street
    for (const [y0, y1] of [[-E, IT.HORN.N], [IT.HORN.S, 37], [63, E]]) { g.fill(K.rect(-63, y0, -60.4, y1), PV); g.fill(K.rect(-39.6, y0, -37, y1), PV); }
    g.fill(K.rect(-E, 37, -63, 39.6), PV); g.fill(K.rect(-E, 60.4, -63, 63), PV);
    // the tram tracks: paved bed, two rails each
    for (const [y0, y1] of [[-E, IT.HORN.N], [IT.HORN.S, E]]) {
      g.fill(K.rect(-55.0, y0, -45.0, y1), '#C9C2B2');
      const r = []; for (const c of [-52.6, -47.4]) for (const d of [-1.0, 1.0]) { const a = g.p(c + d, y0 + 0.5, 0), b = g.p(c + d, y1 - 0.5, 0); r.push(a[0], a[1], b[0], b[1]); }
      g.segs2(r, '#7E776B', 0.5);
      g.scuff(K.rect(-55, y0, -45, y1), { dir: Math.atan2(AY, -AX), len: 2.2, c: '#B5AE9E', dens: 0.5, w: 0.45, spread: 0.04 });
    }
    // lane edges, the west street's centre dashes, scuffs
    const dash = (a, b) => g.line([a, b], { c: LINE, w: 0.9, boil: false, ext: 0.2 });
    for (let y = -E + 3; y < E - 5; y += 9) { if (y > IT.HORN.N - 4 && y < IT.HORN.S + 2) continue; if (y > 30 && y < 70) continue; for (const x of [-55.3, -44.7]) dash([x, y, 0], [x, y + 4.2, 0]); }
    for (let x = -E + 3; x < -70; x += 9) dash([x, 50, 0], [x + 4.2, 50, 0]);
    g.scuff(K.rect(-60.4, -E, -55, E), { dir: Math.atan2(AY, -AX), len: 8, c: '#E2DDD1', dens: 0.4, w: 0.5, spread: 0.05 });
    g.scuff(K.rect(-45, -E, -39.6, E), { dir: Math.atan2(AY, -AX), len: 8, c: '#E2DDD1', dens: 0.4, w: 0.5, spread: 0.05 });
    g.scuff(K.rect(-E, 39.6, -63, 60.4), { dir: Math.atan2(AY, AX), len: 8, c: '#E2DDD1', dens: 0.4, w: 0.5, spread: 0.05 });
    // zebra crossings on the avenue's south arm and the west street's west arm, stop lines
    for (let x = -61.6; x < -38; x += 2.2) if (x < -55.3 || x > -44.9) g.fill(K.rect(x, 65.5, x + 1.2, 70), LINE);
    for (let y = 38.5; y < 62; y += 2.2) g.fill(K.rect(-70, y, -65.5, y + 1.2), LINE);
    g.line([[-37.5, 33.5, 0], [-44.9, 33.5, 0]], { c: LINE, w: 1.0, boil: false }); g.line([[-55.3, 71.5, 0], [-62.5, 71.5, 0]], { c: LINE, w: 1.0, boil: false });
    g.line([[-71.5, 37.5, 0], [-71.5, 50, 0]], { c: LINE, w: 1.0, boil: false });
    // kerbs
    const kerb = { w: 0.55, c: '#A39C8E', boil: false };
    for (const x of [-60.4, -39.6]) { g.line([[x, -E, 0], [x, IT.HORN.N, 0]], kerb); g.line([[x, IT.HORN.S, 0], [x, 37, 0]], kerb); g.line([[x, 63, 0], [x, E, 0]], kerb); }
    for (const y of [39.6, 60.4]) g.line([[-E, y, 0], [-63, y, 0]], kerb);
    // Sirkeci square: pale stone paving, a ring of darker stone round the tulip bed
    g.fill(K.rect(-37, 37, IT.BOS.W, 63), '#E7DFCD');
    IS.paving(g, -37, 37, IT.BOS.W, 63, { len: 2.6, dens: 0.6 });
    const ring = []; for (let i = 0; i < 24; i++) { const a = TAU * i / 24; ring.push([-6 + Math.cos(a) * 9.5, 50 + Math.sin(a) * 9.5, 0]); }
    g.fill(ring, '#D3C7AE'); g.outline(ring, { w: 0.5, c: '#A89A7E', boil: false });
    const bed = []; for (let i = 0; i < 24; i++) { const a = TAU * i / 24; bed.push([-6 + Math.cos(a) * 7.8, 50 + Math.sin(a) * 7.8, 0.02]); }
    g.fill(bed, '#8A6A4A'); g.outline(bed, { w: 0.55, c: '#5A4632', boil: false });
    // the quay at the square's end: coping
    g.fill(K.rect(IT.BOS.W - 1.0, 37, IT.BOS.W, 63), IS.C.quayTop);
    IS.quayLights(g, [[IT.BOS.W - 0.6, 41], [IT.BOS.W - 0.6, 50], [IT.BOS.W - 0.6, 59]]);   // at night low lights along Sirkeci's quay
    // the Asian promenades: paving, coping on the water side
    g.fill(K.rect(IT.BOS.E, -63, EA, -37), '#E3DCCB'); IS.paving(g, IT.BOS.E, -63, EA, -37, { len: 2.6 });
    g.fill(K.rect(IT.BOS.E, -38, EA, -37), IS.C.quayTop);
    g.fill(K.rect(IT.BOS.E, 37, EA, 63), '#E3DCCB'); IS.paving(g, IT.BOS.E, 37, EA, 63, { len: 2.6 });
    g.fill(K.rect(IT.BOS.E, 37, EA, 38), IS.C.quayTop);
    { const r = []; for (const d of [-1.0, 1.0]) { const a = g.p(84, 52 + d, 0), b = g.p(EA - 0.5, 52 + d, 0); r.push(a[0], a[1], b[0], b[1]); } g.segs2(r, '#7E776B', 0.5); g.fill(K.rect(83.4, 49.6, 84.2, 54.4), '#7E776B'); }
    // the cut ends at the map's near edges (the avenue's south end, the promenades' east ends) and the far edges
    const D = 1.1;
    g.fill([[-63, E, -D], [-37, E, -D], [-37, E, 0], [-63, E, 0]], C.slab); g.line([[-63, E, 0], [-63, E, -D], [-37, E, -D], [-37, E, 0]], { w: 0.85, boil: false });
    for (const [y0, y1] of [[-63, -37], [37, 63]]) { g.fill([[EA, y1, -D], [EA, y0, -D], [EA, y0, 0], [EA, y1, 0]], C.slabD); g.line([[EA, y1, 0], [EA, y1, -D], [EA, y0, -D], [EA, y0, 0]], { w: 0.85, boil: false }); }
    g.line([[-63, -E, 0], [-37, -E, 0]], { w: 0.85, boil: false }); g.line([[-E, 37, 0], [-E, 63, 0]], { w: 0.85, boil: false });
    for (const [x0, y0, x1, y1] of [[-63, -E, -37, IT.HORN.N], [-63, IT.HORN.S, -37, E], [-E, 37, -37, 63], [IT.BOS.E, -63, EA, -37], [IT.BOS.E, 37, EA, 63]]) { g.line([[x0, y0, 0], [x0, y1, 0]], { w: 0.6, c: '#8C8576', boil: false }); }
  });
  ISWATER(T);

  /* ---- street furniture: lamps and plane trees on the footways, benches and a kiosk in Sirkeci square ---- */
  for (const y of [-140, -112, 80, 108, 136]) { T.obj([-61.6, y], (g) => IS.lamp(g, -61.6, y), { name: 'lamp' }); T.obj([-38.4, y + 14], (g) => IS.lamp(g, -38.4, y + 14), { name: 'lamp' }); }
  for (const x of [-140, -112, -84]) { T.obj([x, 38.4], (g) => IS.plane(g, x, 38.4, { r: 4.2, h: 5 }), { name: 'plane' }); T.obj([x + 12, 61.6], (g) => IS.plane(g, x + 12, 61.6, { r: 4.0, h: 5 }), { name: 'plane' }); }
  for (const [x, y, f] of [[-26, 41, 'L'], [10, 41, 'L'], [-28, 58, 'R'], [18, 59, 'R']]) T.obj([x, y], (g) => K.bench(g, x, y, { face: f, L: 2.4, col: '#7A5A3C' }), { name: 'bench' });
  for (const [x, y] of [[-33, 40], [24, 40], [-33, 60], [24, 60]]) T.obj([x, y], (g) => IS.lamp(g, x, y), { name: 'lamp' });
  for (const x of [-26, 6]) T.obj([x, 62], (g) => IS.erguvan(g, x, 62, { r: 3.6 }), { name: 'erguvan' });
  // the Asian promenades: railings on the sea wall, benches, lamps, erguvan
  for (let x = IT.BOS.E + 1; x < EA - 2; x += 13) { const x1 = Math.min(EA - 1, x + 12); T.obj([x, -38.7, x1, -37.3], (g) => { K.box(g, x, -38.7, x1, -37.3, 0, 0.9, { t: '#E2DACA', l: '#D3CAB6', r: '#BFB6A2' }, { w: 0.6, boil: false }); g.glow('lamp', (x + x1) / 2, -38, 1.5, { r: 0.9 }); }, { name: 'parapet' }); }   // at night a lamp on each length of the sea wall
  for (const x of [84, 106, 126]) { T.obj([x, -61], (g) => IS.erguvan(g, x, -61, { r: 4 }), { name: 'erguvan' }); T.obj([x + 10, -61.5], (g) => IS.lamp(g, x + 10, -61.5), { name: 'lamp' }); }
  for (const x of [96, 128]) T.obj([x, 61.5], (g) => IS.plane(g, x, 61.5, { r: 4.0 }), { name: 'plane' });
  for (const x of [104, 140]) T.obj([x, 61.6], (g) => IS.lamp(g, x, 61.6), { name: 'lamp' });
  // the tram stop by the Kadıköy pier: a little shelter with a sign
  T.obj([86, 55.5, 92, 57.5], (g) => { K.box(g, 86, 55.5, 92, 57.5, 0, 0.5, '#C9C1AE', { w: 0.5 }); for (const x of [86.4, 91.6]) { const a = g.p(x, 57.2, 0.5), b = g.p(x, 57.2, 5.4); g.line2([a, b], { w: 0.5, c: '#3F4A44', boil: false }); } g.fill(K.rect(85.6, 55.2, 92.4, 57.9, 5.4), '#3F6E5E'); g.outline(K.rect(85.6, 55.2, 92.4, 57.9, 5.4), { w: 0.55, boil: false }); const j0 = g.cmds.length; K.sign(g, 'L', 57.9, 86.4, 91.6, 4.4, 5.4, '#F1E7CF', 'KADIKÖY', { w: 0.3 }); IS.litSign(g, j0); }, { name: 'tram stop' });

  /* ---- the traffic ---- */
  const CARC = ['#F1EFE8', '#8FA3B5', '#2F343B', '#C9584B', '#B9A27D', '#6C7A89'];
  const NQ = 48, fade = (x, y) => clamp((E - 2 - Math.max(Math.abs(x), Math.abs(y))) / 10, 0, 1);
  IT.CARS.forEach((c, i) => {
    const col = CARC[i % CARC.length];
    T.actor({ cast: false, sample: 0.2, period: IT.PR,
      at(t) {
        const s = IT.vehicle(c, t); if (!s) return null;
        const a = fade(s.x, s.y); if (a <= 0.02) return null;
        const q = Math.round(s.ang / (TAU / NQ));
        return { x: s.x, y: s.y, z: IT.onAve(s.x) ? IT.zAve(s.y) : 0, key: 'q' + q, ang: q * TAU / NQ, alpha: a < 1 ? a : null };
      },
      draw(g, st) { if (c.kind === 'taxi') IS.taxi(g, st.ang); else if (c.kind === 'dolmus') IS.dolmus(g, st.ang); else if (c.kind === 'bus') IS.bus(g, st.ang); else K.car(g, st.ang, { col }); } });
  });
  IT.TRAMS.forEach((tr) => { for (let k = 0; k < tr.n; k++) T.actor({ cast: false, sample: 0.2, period: IT.PR,
    at(t) { const s = IT.tramSec(tr, k, t); if (!s) return null; const a = fade(s.x, s.y); if (a <= 0.02) return null; return { x: s.x, y: s.y, z: IT.zAve(s.y), key: 't', ang: s.ang, alpha: a < 1 ? a : null }; },
    draw(g, st) { IS.t1Car(g, st.ang, { cab: k === 0 ? 1 : k === tr.n - 1 ? -1 : 0, panto: k === 1 }); } }); });

  /* ---- the red nostalgic tram on the Kadıköy waterfront: shuttles between the map edge and its terminus ---- */
  { const X0 = 92, X1 = 148, V = 6, Tm = (X1 - X0) / V, DW = 4, PER = 2 * (Tm + DW);
    const kids = [IS.who(951, { k: 0.75, hairStyle: 'short', top: '#C9584B' }), IS.who(952, { k: 0.75, top: '#3F5F8F' })];
    T.actor({ cast: false, sample: 0.2, period: PER,
      at(t) {
        const u = ((t % PER) + PER) % PER; let x, d;
        if (u < DW) { x = X0; d = 1; } else if (u < DW + Tm) { const f = (u - DW) / Tm; x = X0 + (X1 - X0) * (1 - Math.cos(Math.PI * f)) / 2; d = 1; } else if (u < 2 * DW + Tm) { x = X1; d = -1; } else { const f = (u - 2 * DW - Tm) / Tm; x = X1 - (X1 - X0) * (1 - Math.cos(Math.PI * f)) / 2; d = -1; }
        const a = clamp((EA + 4 - x) / 9, 0, 1); if (a <= 0.02) return null;
        const ph = Math.floor(t * 2) % 4;
        return { x, y: 52, key: 'n' + d + '.' + ph, d, ph: ph / 4, alpha: a < 1 ? a : null };
      },
      draw(g, st) { IS.nostTram(g, st.d > 0 ? 0 : Math.PI, { word: 'KADIKÖY-MODA', kids: st.d > 0 ? kids : kids.slice(0, 1), dirSign: 1, ph: st.ph }); } }); }

  /* ---- people ---- */
  // the avenue's footways, the west street, the square, the promenades
  const W = (seed, pts, sp, ph, o) => IS.walker(T, IS.who(seed, o), pts, sp, { phase: ph, cast: false });
  W(801, [[-61.7, -150], [-61.7, -100]], 1.3, 0.1); W(802, [[-38.3, -100], [-38.3, -150]], 1.4, 0.4);
  W(803, [[-61.7, 76], [-61.7, 150]], 1.2, 0.3); W(804, [[-38.3, 150], [-38.3, 72]], 1.3, 0.6, { tray: true, top: '#F3F1EA', bot: '#3B3F47' });
  W(805, [[-150, 38.3], [-75, 38.3]], 1.3, 0.2); W(806, [[-80, 61.7], [-150, 61.7]], 1.2, 0.7);
  W(807, [[-35, 46], [20, 46], [20, 54], [-35, 54]], 1.3, 0.0); W(808, [[22, 56], [-30, 56], [-30, 43], [22, 43]], 1.4, 0.5, { scarf: '#8E79C0', dress: '#3F5F8F' });
  W(809, [[76, -44], [132, -44]], 1.2, 0.3); W(810, [[132, -55], [80, -55]], 1.3, 0.6, { teatray: true });
  W(811, [[78, 42], [132, 42]], 1.25, 0.15); W(812, [[132, 44.5], [80, 44.5]], 1.1, 0.55, { scarf: '#C9584B' });
  W(813, [[100, 59], [132, 59]], 1.2, 0.8);
  // the square: the tulip bed, a simit cart and its seller, a shoe-shiner and his customer, pigeons, a couple on a bench
  T.cast([-6, 50], (g) => IS.tulips(g, -12.5, 44, 0.5, 56, IS.C.tulip, { band: 2 }), { name: 'tulips' });
  T.obj([14, 40.5], (g) => IS.simitCart(g, 14, 40.5, { face: 'L' }), { name: 'simit cart' });
  T.cast([16.6, 41.5], (g) => IS.person(g, 16.6, 41.6, 0, IS.who(821, { dir: 1, pose: 'hold', top: '#F3F1EA', bot: '#3B3F47', cap: '#3B3F47' })), { on: true });
  T.cast([11.5, 44], (g) => IS.person(g, 11.5, 44.2, 0, IS.who(822, { dir: 3, pose: 'hold' })), { on: true });
  T.cast([-22, 59.5], (g) => {   // the shoe-shiner: brass box, kneeling, a man on a stool with his foot on the box
    const p = g.p(-22, 59.4, 0); g.fill2([[p[0] - 2.4, p[1]], [p[0] + 2.4, p[1]], [p[0] + 2.2, p[1] - 3.6], [p[0] - 2.2, p[1] - 3.6]], '#C9982A', true);
    g.fill2([[p[0] - 1.2, p[1] - 3.6], [p[0] + 1.2, p[1] - 3.6], [p[0], p[1] - 6.2]], '#E3C46A', true); g.outline2([[p[0] - 2.4, p[1]], [p[0] + 2.4, p[1]], [p[0] + 2.2, p[1] - 3.6], [p[0] - 2.2, p[1] - 3.6]], { w: 0.35, c: '#6B4F1E', boil: false });
    IS.person(g, -23.6, 60.2, 0, IS.who(823, { dir: 0, pose: 'kneel', top: '#6E5A44', fcap: '#3B3F47', hands: [[7, -4], [6, -3]] }));
    IS.stool2(g, g.p(-19.6, 58.4, 1.3), '#7A5A3C'); IS.person(g, -19.6, 58.4, 1.3, IS.who(824, { dir: 1, pose: 'sit', top: '#3B3F47', bot: '#3B3F47', jacket: '#F3F1EA', tie: '#C9584B', phone: true }));
  }, { on: true });
  T.cast([12, 59], (g) => { K.bench(g, 18, 59, { face: 'R', L: 2.4, col: '#7A5A3C' }); IS.person(g, 19.8, 58.2, 1.3, IS.who(825, { dir: 0, pose: 'sit', cup: true })); IS.person(g, 19.8, 60.2, 1.3, IS.who(826, { dir: 0, pose: 'sit', scarf: '#E8D9B8' })); }, { on: true });
  // pigeons pecking on the square; every 14 s they lift off together and settle again
  for (let i = 0; i < 10; i++) { const R = RNG(i * 31 + 5), x0 = -2 + R() * 22, y0 = 39 + R() * 4; T.actor({ sample: 0.5, period: 14, grow: true,
    at(t) { const u = ((t + 3) % 14 + 14) % 14, up = u > 11 && u < 13.2, f = up ? Math.floor(t * 8 + i) % 4 : (Math.floor(t * 2 + i * 1.7) % 3 === 0 ? 'u' : 'p'), h = up ? Math.sin(Math.PI * (u - 11) / 2.2) * 5 : 0; return { x: x0 + (up ? (u - 11) * 1.5 : 0), y: y0, z: h, key: up ? 'f' + f : f, f, up, fl: i % 2 ? 1 : -1 }; },
    draw(g, st) { const p = g.p(0, 0, 0); if (st.up) IS.gull2(g, p, st.f); else IS.pigeon2(g, p, st.fl, st.f === 'u'); } }); }
  // cats: one on the square's bench end, one asleep on the Üsküdar wall, one walking the Kadıköy promenade
  IS.cat(T, 22, 61, 0, { c: 0, pose: 'loaf', fl: -1 });
  IS.cat(T, 104, -38, 0.9, { c: 1, pose: 'loaf' });
  IS.cat(T, 128, -38, 0.9, { c: 3, pose: 'sit', fl: -1 });
  IS.catWalk(T, [[96, 40], [130, 40], [130, 46], [96, 46]], { c: 4, speed: 1.0, sit: 8 });
  // people sitting on the Üsküdar sea wall with tea, an angler, a tea seller
  for (const [x, s] of [[90, 831], [92.4, 832], [122, 833], [134, 834]]) T.cast([x, -38], (g) => IS.person(g, x, -38, 0.9, IS.who(s, { dir: 1, pose: 'sit', cup: s % 2 === 0 })), { on: true });
  T.cast([110, -39.6], (g) => { IS.person(g, 110, -39.6, 0, IS.who(835, { dir: 1, pose: 'hold', fcap: '#5A6B5A' })); const a = g.p(110, -39.2, 5.0), b = g.p(110, -33, 8.6), c = g.p(110, -31, IT.WL); g.line2([a, b], { w: 0.5, c: '#3A3530', boil: false, ext: 0 }); g.fine2([b, c], { w: 0.25, c: '#5A564E' }); IS.glowWet(g, 'lantern', 110, -33, 8.6, { r: 0.7, col: IS.N.tip }); }, { on: true });   // at night a glow stick on the rod tip
});
