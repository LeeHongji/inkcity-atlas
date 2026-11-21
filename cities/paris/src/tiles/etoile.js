'use strict';
/* (0,-100) Place de l'Étoile. Twelve avenues meet at the Arc de Triomphe: the Champs-Élysées (+y, east) is the widest,
   the avenue de la Grande-Armée runs west (-y) towards La Défense, the avenue d'Iéna south (-x) to the Pont d'Iéna and
   the Eiffel Tower across the river. The Arc (50 m: drawn 22 u; 45 x 22 m: 20.6 x 10.6 u) stands on a round island
   paved in granite, the great arch facing the Champs-Élysées, the small side arches on the short faces, the relief
   groups on the piers, the frieze, the attic with its row of shields, tourists on the roof terrace and a giant
   tricolour hanging in the arch. A cobbled ring round it. Between the avenues: low hôtels near the ring (so they never
   hide it), taller Haussmann at the back, plane trees. The quai along the -x edge with a parapet.
   THE CLEVER MOMENT: every 8 s a wave of twelve vehicles reaches the ring from all twelve avenues at once and swirls
   round anticlockwise (map view: north +x, so anticlockwise = world angle decreasing) with no lanes: neighbours weave
   in counter-phase (inner, outer, inner) so their lines cross, and each peels off down another avenue. The twelve stay
   exactly 30° apart in angle while on the ring, so they never touch (tools/check_etoile.mjs: >= 0.5 u everywhere).
   The cycle is phased so a wave reaches the ring one second after the cut to the Étoile shot. */
const ET = { W: 8, OM: 30, V: 10, VE: 17, R0: 21.2, A: 3.0, KW: 3, LANE: 2.8, RIN: 26.5, RING: 28.2, ISL: 13, ROAD: 5.6, COR: 7.5 };
SF.tile('etoile', 0, -100, { rim: 26 }, function (T) {
  const H = 37, D2R = Math.PI / 180, AV = [], RING = ET.RING, ISL = ET.ISL;
  for (let j = 0; j < 12; j++) AV.push({ phi: 30 * j * D2R, w: j === 3 ? ET.ROAD + 1.2 : ET.ROAD });
  const edgeR = (phi) => 36.6 / Math.max(Math.abs(Math.cos(phi)), Math.abs(Math.sin(phi)));
  const inCorr = (x, y, m) => AV.some((a) => { const u = x * Math.cos(a.phi) + y * Math.sin(a.phi), v = -x * Math.sin(a.phi) + y * Math.cos(a.phi); return u > 0 && Math.abs(v) < a.w + m; });

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    K.slab(g, H, { top: PC.pave });
    g.scuff(K.rect(-H, -H, H, H), { dir: -0.6, len: 3, c: '#F2EEE4', dens: 0.35, w: 0.5, spread: 0.6 });
    // avenues: asphalt strips from the ring to the tile edge, with kerbs
    for (const a of AV) {
      const ux = Math.cos(a.phi), uy = Math.sin(a.phi), nx = -uy, ny = ux, r1 = edgeR(a.phi) + 2, w = a.w;
      const q = [[ux * 20 + nx * w, uy * 20 + ny * w, 0], [ux * r1 + nx * w, uy * r1 + ny * w, 0], [ux * r1 - nx * w, uy * r1 - ny * w, 0], [ux * 20 - nx * w, uy * 20 - ny * w, 0]];
      g.fill(q.map((p) => [clamp(p[0], -H, H), clamp(p[1], -H, H), 0]), PC.asph);
    }
    // the ring of setts
    const ring = K.arc(0, 0, 0, RING, 0, TAU, 72);
    g.fill(ring, '#D3CBBA');
    const setts = [];
    for (let r = ISL + 1.2; r < RING - 0.4; r += 1.15) for (let i = 0; i < 72; i++) { const a0 = TAU * i / 72, a1 = a0 + TAU / 72 * 0.8, p = g.p(Math.cos(a0) * r, Math.sin(a0) * r, 0), q = g.p(Math.cos(a1) * r, Math.sin(a1) * r, 0); setts.push(p[0], p[1], q[0], q[1]); }
    g.segs2(setts, '#BDB3A0', 0.28);
    g.scuff(K.rect(-RING, -RING, RING, RING), { dir: 0.3, len: 6, c: '#E1DACB', dens: 0.25, w: 0.5, spread: 0.3 });
    g.line(K.arc(0, 0, 0, RING, 0, TAU, 72), { w: 0.55, c: '#8C8576', boil: false });
    // lane hints on the avenues: a dashed centre line
    const dsh = [];
    for (const a of AV) { const ux = Math.cos(a.phi), uy = Math.sin(a.phi); for (let r = RING + 2; r < edgeR(a.phi) - 2; r += 7) { const p = g.p(ux * r, uy * r, 0), q = g.p(ux * (r + 3.2), uy * (r + 3.2), 0); dsh.push(p[0], p[1], q[0], q[1]); } }
    g.segs2(dsh, '#F7F5EE', 0.85);
    for (const a of AV) { const ux = Math.cos(a.phi), uy = Math.sin(a.phi), nx = -uy, ny = ux; for (const s of [-1, 1]) { const r1 = edgeR(a.phi) - 0.3; g.line([[ux * (RING + 0.2) + nx * s * a.w, uy * (RING + 0.2) + ny * s * a.w, 0], [ux * r1 + nx * s * a.w, uy * r1 + ny * s * a.w, 0]], { w: 0.45, c: '#A9A296', boil: false, ext: 0 }); } }
    // the island: granite, a ring of bronze bollards
    g.fill(K.arc(0, 0, 0, ISL, 0, TAU, 48), '#E4DCCB');
    g.scuff(K.rect(-ISL, -ISL, ISL, ISL), { dir: -0.8, len: 2, c: '#F3EEE2', dens: 0.6, w: 0.45, spread: 1 });
    g.line(K.arc(0, 0, 0, ISL, 0, TAU, 48), { w: 0.7, boil: false });
    // the quai strip along the river edge (x = -H): gravel under trees
    g.fill(K.rect(-H, -H, -31, H), '#E9E1CF');
  }, { rim: true });

  /* ---------------- the Arc de Triomphe ---------------- */
  const AX0 = -10.3, AX1 = 10.3, AY0 = -5.3, AY1 = 5.3, Z1 = 13.0, ZC = 14.6, ZA = 20.4, ZT = 21.2;
  const ST = { t: '#EFE6CE', l: '#EADFC3', r: '#D7C9A8' };
  T.obj([AX0 - 0.4, AY0 - 0.4, AX1 + 0.4, AY1 + 0.4], function (g) {
    g.boilP = 0.35;
    K.box(g, AX0 - 0.4, AY0 - 0.4, AX1 + 0.4, AY1 + 0.4, 0, 0.7, { t: '#E4DCCB', l: '#DCD2BE', r: '#C9BFA9' }, { w: 0.7 });
    K.box(g, AX0, AY0, AX1, AY1, 0.7, Z1, ST, { w: 1.0 });
    // the great arch on the face towards the Champs-Élysées
    const arch = (face, p, m, hw, zs) => { const pts = [K.pt(face, p + 0.02, m - hw, 0.7), K.pt(face, p + 0.02, m + hw, 0.7)]; for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12; pts.push(K.pt(face, p + 0.02, m + Math.cos(t) * hw, zs + Math.sin(t) * hw)); } return pts; };
    const big = arch('L', AY1, 0, 3.3, 9.0);
    g.fill(big, '#A9997A');
    g.fill([K.pt('L', AY1 + 0.03, -3.3, 0.7), K.pt('L', AY1 + 0.03, 0.4, 0.7), K.pt('L', AY1 + 0.03, -3.3, 5.5)], '#D8CFBC');           // the floor seen inside
    g.fill([K.pt('L', AY1 + 0.03, -3.3, 9.0), K.pt('L', AY1 + 0.03, -1.0, 11.6), K.pt('L', AY1 + 0.03, 3.0, 10.4), K.pt('L', AY1 + 0.03, 3.3, 9.0), K.pt('L', AY1 + 0.03, 3.3, 7.6)], '#8E7F62');   // vault shadow
    const ring = arch('L', AY1 + 0.03, 0, 3.75, 9.0).slice(2);
    g.fill(ring.concat(big.slice(2).reverse()), '#E2D6B8');
    g.line(big.slice(2), { w: 0.75, boil: false });
    // the small side arch on the short face
    const side = arch('R', AX1, 0, 1.9, 6.0); g.fill(side, '#A2926F'); g.fill(arch('R', AX1 + 0.03, 0, 2.25, 6.0).slice(2).concat(side.slice(2).reverse()), '#D2C4A2'); g.line(side.slice(2), { w: 0.6, boil: false });
    // relief groups on the four pier faces we see: a pale panel, figures in a few strokes
    const relief = (face, p, a0, a1, seed) => {
      const q = K.on(face, p + 0.04, a0, a1, 2.2, 7.8); g.fill(q, face === 'L' ? '#E3D7B9' : '#CDBF9E');
      const R = RNG(seed), segs = [], Q = g.P(q), cx = (Q[0][0] + Q[2][0]) / 2, cy = (Q[0][1] + Q[2][1]) / 2;
      for (let i = 0; i < 9; i++) { const x = cx + (R() - 0.5) * 9, y = cy + (R() - 0.5) * 14; segs.push(x, y + 2.5, x + (R() - 0.5) * 1.6, y - 2.6); }
      g.segs2(segs, '#A2926F', 0.55);
      for (let i = 0; i < 4; i++) g.disc2([cx + (R() - 0.5) * 8, cy - 4 + (R() - 0.5) * 6], 0.8, '#B5A684');
      g.outline(q, { w: 0.3, c: '#A2926F', boil: false, ext: 0 });
    };
    relief('L', AY1, -9.2, -4.6, 3); relief('L', AY1, 4.6, 9.2, 7);
    relief('R', AX1, -4.6, -2.6, 11); relief('R', AX1, 2.6, 4.6, 13);
    // entablature: the frieze band, the cornice
    g.fill(K.on('L', AY1 + 0.04, AX0, AX1, 11.6, Z1), '#E2D5B5'); g.fill(K.on('R', AX1 + 0.04, AY0, AY1, 11.6, Z1), '#CBBC99');
    const fz = []; for (let a = AX0 + 0.4; a < AX1; a += 0.55) { const p = g.p(a, AY1 + 0.05, 11.9), q = g.p(a + 0.25, AY1 + 0.05, 12.7); fz.push(p[0], p[1], q[0], q[1]); } g.segs2(fz, '#B5A684', 0.32);
    K.box(g, AX0 - 0.35, AY0 - 0.35, AX1 + 0.35, AY1 + 0.35, Z1, ZC, ST, { w: 0.75, nohid: true });
    // the attic with its row of shields, the top cornice, the roof terrace's parapet
    K.box(g, AX0 + 0.1, AY0 + 0.1, AX1 - 0.1, AY1 - 0.1, ZC, ZA, ST, { w: 0.9, nohid: true });
    const sh = []; for (let a = AX0 + 1.0; a < AX1 - 0.5; a += 1.25) sh.push(g.p(a, AY1 - 0.05, 17.4)); for (const p of sh) { g.fill2([[p[0] - 1.1, p[1] - 1.5], [p[0] + 1.1, p[1] - 1.5], [p[0] + 1.0, p[1] + 0.6], [p[0], p[1] + 1.6], [p[0] - 1.0, p[1] + 0.6]], '#DCCFAF', true); }
    for (let a = AY0 + 1.2; a < AY1 - 0.5; a += 1.25) { const p = g.p(AX1 - 0.05, a, 17.4); g.fill2([[p[0] - 1.1, p[1] - 1.5], [p[0] + 1.1, p[1] - 1.5], [p[0] + 1.0, p[1] + 0.6], [p[0], p[1] + 1.6], [p[0] - 1.0, p[1] + 0.6]], '#C4B593', true); }
    g.line([K.pt('L', AY1 - 0.08, AX0 + 0.1, 16.0), K.pt('L', AY1 - 0.08, AX1 - 0.1, 16.0), K.pt('R', AX1 - 0.08, AY0 + 0.1, 16.0)], { w: 0.35, c: '#B5A684', boil: false });
    K.box(g, AX0 - 0.2, AY0 - 0.2, AX1 + 0.2, AY1 + 0.2, ZA, ZT, ST, { w: 0.75, nohid: true });
    // the roof: a flat terrace with a low parapet at the back
    g.fill(K.rect(AX0 + 0.3, AY0 + 0.3, AX1 - 0.3, AY1 - 0.3, ZT + 0.01), '#E0D8C6');
    K.box(g, AX0 - 0.2, AY0 - 0.2, AX1 + 0.2, AY0 + 0.3, ZT, ZT + 0.9, ST, { w: 0.5, nohid: true, boil: false });
    K.box(g, AX0 - 0.2, AY0 - 0.2, AX0 + 0.3, AY1 + 0.2, ZT, ZT + 0.9, ST, { w: 0.5, nohid: true, boil: false });
    K.box(g, AX0 + 2, AY0 + 1, AX0 + 4.4, AY0 + 3, ZT, ZT + 2.2, '#D9D1BE', { w: 0.5, boil: false });     // the stair head
  }, { name: 'arc de triomphe' });
  // tourists on the roof terrace, behind the front and side parapets (drawn after them, inside this piece)
  T.cast([AX1 - 1.5, AY1 - 1.5], function (g) {
    const spots = [[-7, 4.0, 1], [-5.6, 4.2, 3], [-2, 4.1, 1], [-0.6, 3.8, 2], [3.4, 4.2, 1], [6.8, 3.9, 0], [8.8, 2.0, 0], [8.9, -1.5, 3], [5.0, -2.5, 2], [0.5, -0.5, 1]];
    spots.forEach(([x, y, d], i) => PA.person(g, x, y, ZT, PA.who(9200 + i, { dir: d, pose: i % 4 === 1 ? 'hold' : 'stand', k: 0.95 })));
    K.box(g, AX0 - 0.2, AY1 - 0.3, AX1 + 0.2, AY1 + 0.2, ZT, ZT + 0.9, ST, { w: 0.5, nohid: true, boil: false });
    K.box(g, AX1 - 0.3, AY0 - 0.2, AX1 + 0.2, AY1 + 0.2, ZT, ZT + 0.9, ST, { w: 0.5, nohid: true, boil: false });
  }, { on: true, name: 'arc roof' });
  // the giant tricolour hanging in the great arch, its free edge moving
  T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 4) % 8; return { x: 0, y: AY1 - 0.5, key: f, f }; },
    draw(g, st) {
      const cols = ['#2F4A8F', '#F6F3EA', '#C9463E'], w = 2.3, sw = Math.sin(st.f / 8 * TAU) * 0.35;
      for (let k = 0; k < 3; k++) {
        const a0 = -w + 2 * w * k / 3, a1 = -w + 2 * w * (k + 1) / 3, q = [];
        for (let i = 0; i <= 6; i++) { const z = 11.4 - i * 1.2, b = Math.sin(i * 0.8 + st.f / 8 * TAU) * 0.18 * i / 6; q.push([a0 + b + sw * i / 6, 0, z]); }
        for (let i = 6; i >= 0; i--) { const z = 11.4 - i * 1.2, b = Math.sin(i * 0.8 + st.f / 8 * TAU) * 0.18 * i / 6; q.push([a1 + b + sw * i / 6, 0, z]); }
        g.fill(q, cols[k]);
      }
      g.line([[-w - 0.3, 0, 11.5], [w + 0.3, 0, 11.5]], { w: 0.6, c: '#5E574A', boil: false });
    } });
  // visitors on the island (on the near side, clear of the Arc's shadow), a guard
  T.cast([8.5, 8.0], (g) => { PA.person(g, 8.0, 8.0, 0, PA.who(9230, { dir: 2, pose: 'hold' })); PA.person(g, 9.6, 6.6, 0, PA.who(9231, { dir: 3, pose: 'wave', ph: 0.2 })); }, { on: true });
  T.cast([-4.5, 9.4], (g) => { PA.person(g, -5.2, 9.2, 0, PA.who(9232, { dir: 3, pose: 'hold' })); PA.person(g, -3.6, 10.0, 0, PA.who(9233, { dir: 2 })); PA.person(g, -2.2, 9.0, 0, PA.who(9234, { dir: 3, k: 0.75 })); }, { on: true });
  T.cast([11.8, -2.0], (g) => PA.person(g, 11.8, -2.0, 0, { dir: 1, top: '#2F3A4F', bot: '#2F3A4F', cap: '#2F3A4F', skin: SKIN[2], hair: HAIR[0], hairStyle: 'short', shoe: '#2A2622' }), { on: true });

  /* ---------------- the blocks between the avenues ---------------- */
  // each wedge gets the biggest axis-aligned box that stays out of every avenue corridor and the ring's pavement
  const ok = (x, y) => x >= -30 && x <= 36.4 && y >= -36.4 && y <= 36.4 && Math.hypot(x, y) >= RING + 1.6 && !inCorr(x, y, 1.1);
  const boxOk = (b) => { for (let i = 0; i <= 8; i++) { const t = i / 8; if (!ok(lerp(b[0], b[2], t), b[1]) || !ok(lerp(b[0], b[2], t), b[3]) || !ok(b[0], lerp(b[1], b[3], t)) || !ok(b[2], lerp(b[1], b[3], t))) return false; } return true; };
  const BLOCKS = [];
  for (let k = 0; k < 12; k++) {
    const al = (15 + 30 * k) * D2R; let seed = null;
    for (let r = 52; r >= 30 && !seed; r -= 0.5) { const x = Math.cos(al) * r, y = Math.sin(al) * r; if (ok(x, y) && ok(x + 0.5, y + 0.5) && ok(x - 0.5, y - 0.5)) seed = [x - 0.25, y - 0.25, x + 0.25, y + 0.25]; }
    if (!seed) continue;
    let b = seed, grew = true;
    while (grew) { grew = false; for (let s = 0; s < 4; s++) { const nb = b.slice(); nb[s] += s < 2 ? -0.25 : 0.25; if (boxOk(nb)) { b = nb; grew = true; } } }
    if ((b[2] - b[0]) < 2.6 || (b[3] - b[1]) < 2.6) continue;
    BLOCKS.push(b.map((v) => Math.round(v * 4) / 4));
  }
  BLOCKS.forEach((b, i) => {
    const s = (b[0] + b[2] + b[1] + b[3]) / 2, big = Math.min(b[2] - b[0], b[3] - b[1]) > 5, et = !big ? 1 : s < -20 ? 4 : s < 10 ? 3 : 2;
    const shops = (b[2] - b[0]) > 5.5 && et > 1 ? { shopsL: [[b[0] + 0.8, b[0] + Math.min(5, b[2] - b[0] - 1), ['#2F4A3E', '#7E2A24', '#2F3A4F'][i % 3]]] } : {};
    T.obj(b, (g) => PA.haus(g, Object.assign({ x0: b[0], y0: b[1], x1: b[2], y1: b[3], et, bay: 2.4, rdc: et === 1 ? 4.2 : 4.6, seed: 300 + i, mans: { dormers: (b[2] - b[0]) > 4 ? 2.4 : 0 }, chim: Math.min(b[2] - b[0], b[3] - b[1]) > 5 ? [[b[0] + 0.7, (b[1] + b[3]) / 2, 'y', 3]] : [] }, shops)), { name: 'block' });
  });

  /* ---------------- trees, lamps, the quai ---------------- */
  const trees = [];
  for (const a of AV) {
    const ux = Math.cos(a.phi), uy = Math.sin(a.phi), nx = -uy, ny = ux, far = ux + uy < 0.2;
    if (!far && !(a.phi > 2.5 && a.phi < 3.8)) continue;
    for (let r = RING + 4; r < edgeR(a.phi) - 2; r += 6) for (const s of [-1, 1]) { const x = ux * r + nx * s * (a.w + 1.2), y = uy * r + ny * s * (a.w + 1.2); if (Math.abs(x) < 35.5 && Math.abs(y) < 35.5 && !BLOCKS.some((b) => x > b[0] - 1 && x < b[2] + 1 && y > b[1] - 1 && y < b[3] + 1)) trees.push([x, y]); }
  }
  for (let y = -33; y < 34; y += 6.5) if (!inCorr(-33.5, y, 1)) trees.push([-33.5, y]);
  trees.forEach(([x, y], i) => T.obj([x, y], (g) => PA.plane(g, x, y, { r: 3.4, h: 5.6, turn: 0.3 + h1(i) * 0.6 }), { name: 'tree' }));
  for (let k = 0; k < 12; k++) { const al = (15 + 30 * k) * D2R, x = Math.cos(al) * (RING + 1.3), y = Math.sin(al) * (RING + 1.3); if (x < -30) continue; T.obj([x, y], (g) => PA.lamp(g, x, y, { h: 9 }), { name: 'lamp' }); }
  // the quai parapet between the avenues that reach the river
  const cuts = [-H, -21 - 6.6, -21 + 6.6, -6.6, 6.6, 21 - 6.6, 21 + 6.6, H];
  for (let i = 0; i < cuts.length - 1; i += 2) T.obj([-36.95, cuts[i], -36.25, cuts[i + 1]], (g) => PA.parapet(g, 'y', -36.6, cuts[i], cuts[i + 1]), { name: 'parapet' });
  // the Métro: Charles de Gaulle – Étoile, an entrance on the Champs-Élysées' pavement
  T.obj([12.6, 28, 16.4, 35.6], (g) => PA.metro(g, 14.5, 31.8, { ax: 'y' }), { name: 'metro' });

  /* ---------------- the living layer ---------------- */
  // strollers on the pavements round the ring (each on a short arc between two avenues), on the quai
  for (let k = 0; k < 12; k++) {
    if (k % 2) continue;
    const a0 = (30 * k + 7) * D2R, a1 = (30 * k + 23) * D2R, r = RING + 1.4, pts = [];
    for (let i = 0; i <= 4; i++) { const a = lerp(a0, a1, i / 4); pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
    PA.walker(T, PA.who(9300 + k), pts.concat(pts.slice(1, -1).reverse()), 1.2, { phase: k * 0.13 });
  }
  PA.walker(T, PA.who(9320), [[-34.6, -30], [-34.6, -10]], 1.4, { phase: 0.2 });
  PA.walker(T, PA.who(9321), [[-34.6, 30], [-34.6, 10]], 1.3, { phase: 0.6 });

  /* ---- THE WAVE ---- */
  const sh = SCENE.shots.find((s) => s.name === 'etoile'), OFF = sh ? (((sh.a / 30 + 1.0) % ET.W) + ET.W) % ET.W : 0;
  const MS = [3, 6, 2, 5, 7, 4, 2, 6, 3, 7, 5, 4];
  const KIND = ['car', 'taxi', 'car', 'scooter', 'car', 'car', 'scooter', 'car', 'taxi', 'car', 'scooter', 'car'];
  const COLS = ['#C9584B', '#2E3134', '#E9E2CC', '#E6C24F', '#3F5F8F', '#8FA3B5', '#F1EFE8', '#7A8C6E', '#2E3134', '#B24A3E', '#D98AA4', '#F1EFE8'];
  // the path of the car from avenue j that leaves after m avenues, tau seconds after its wave reaches the ring
  ET.path = function (j, m, tau) {
    const phi = 30 * j * D2R, ux = Math.cos(phi), uy = Math.sin(phi), nx = -uy, ny = ux;
    if (tau < 0) { const r = ET.RIN - ET.V * tau; if (r > edgeR(phi) + 1) return null; return [ux * r - nx * ET.LANE, uy * r - ny * ET.LANE, r]; }
    const de = 30 * m - 9, te = de / ET.OM;
    if (tau <= te) {
      const dphi = ET.OM * tau, th = (30 * j - 4.5 - dphi) * D2R, rw = ET.R0 + ET.A * Math.sin(ET.KW * dphi * D2R + j * Math.PI);
      const b = Math.min(1, dphi / 12, (de - dphi) / 12), sb = b * b * (3 - 2 * b), r = 26.6 + (rw - 26.6) * sb;
      return [Math.cos(th) * r, Math.sin(th) * r, 0];
    }
    const pa = (30 * j - 30 * m) * D2R, ax = Math.cos(pa), ay = Math.sin(pa), mx = -ay, my = ax, r = ET.RIN + ET.VE * (tau - te);
    if (r > edgeR(pa) + 1) return null; return [ax * r + mx * ET.LANE, ay * r + my * ET.LANE, r];
  };
  const edgeFade = (p) => { if (!p[2]) return 1; const lim = Math.max(Math.abs(p[0]), Math.abs(p[1])); return clamp((37.4 - lim) / 5, 0, 1); };
  for (let j = 0; j < 12; j++) {
    const kind = KIND[j], col = COLS[j], seed = 9400 + j;
    // two actors per avenue, one for the even waves and one for the odd: a car's life (approach, ring, exit) is longer
    // than a wave period, so a car still leaving overlaps the next wave's arrival on another lane
    for (const par of [0, 1]) T.actor({ sample: 0.15, period: 2 * ET.W, cast: true,
      at(t) {
        const u = t - OFF, n0 = Math.floor((u + 2.6) / ET.W), n = ((n0 % 2) + 2) % 2 === par ? n0 : n0 - 1, tau = u - n * ET.W, m = MS[(((j + 5 * n) % 12) + 12) % 12];
        const tt = tau, p = ET.path(j, m, tt), q = ET.path(j, m, tt + 0.06) || ET.path(j, m, tt - 0.06);
        if (!p) return null;
        let ang = q ? Math.atan2(q[1] - p[1], q[0] - p[0]) : 0; if (!ET.path(j, m, tt + 0.06)) ang += Math.PI;
        const qa = Math.round(ang / (TAU / 48)), a = edgeFade(p);
        if (a <= 0.02) return null;
        return { x: p[0], y: p[1], key: 'h' + (((qa % 48) + 48) % 48), ang: qa * TAU / 48, alpha: a < 1 ? a : null };
      },
      draw(g, st) {
        if (kind === 'taxi') PA.taxi(g, st.ang);
        else if (kind === 'scooter') PA.scooter(g, st.ang, PA.who(seed, { bare: false }), col);
        else PA.car(g, st.ang, { col });
      } });
  }
});
