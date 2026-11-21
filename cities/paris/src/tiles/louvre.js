'use strict';
/* (0,0) The Louvre and the Cour Napoléon, the middle of the map. The Grande Galerie (Denon) runs along the river side
   (x -31..-23) and a second wing closes the far side (y -31..-23), with taller pavilions at the corner, the middles
   and the ends under square "imperial" domes: cream stone, a ground floor of arched windows, a tall first floor with
   pediments, pilasters between the bays, a balustrade, a steep slate roof with oeil-de-boeuf dormers. The courtyard
   opens towards us so nothing hides it. In it: I. M. Pei's glass pyramid (35 m base, 21.6 m: drawn 14.6 u, 9 u) with
   its diamond lattice and three little pyramidions, triangular fountain pools with jets, the queue snaking between
   rope posts to the entrance, the classic "pinch the pyramid" photo, a mime, the pink Arc du Carrousel with its four
   bronze horses. Along the river edge: the quai with the bouquinistes' boxes open on the parapet, browsers, the
   Pont des Arts landing at y 0. */
SF.tile('louvre', 0, 0, { rim: 20 }, function (T) {
  const H = 37, PX = 3, PY = 2, PB = 7.3, PZ = 9;
  const SLATE = '#6C7580', STN = { t: '#F2EBDA', l: '#EFE5CD', r: '#DACDAE' };
  T.ground(function (g) {
    K.slab(g, H, { top: '#E8E0CE' });
    g.scuff(K.rect(-H, -H, H, H), { dir: -0.6, len: 3.2, c: '#F4EFE4', dens: 0.45, w: 0.5, spread: 0.5 });
    // the paving grid of the courtyard
    const gr = []; for (let a = -22; a < H; a += 4.4) { const p = g.p(a, -22, 0), q = g.p(a, H, 0); gr.push(p[0], p[1], q[0], q[1]); const r = g.p(-22, a, 0), s = g.p(H, a, 0); gr.push(r[0], r[1], s[0], s[1]); } g.segs2(gr, '#D9D0BD', 0.3);
    // the triangular pools
    for (const tri of [[[-20, 9], [-20, 21], [-8, 21]], [[9, -20], [21, -20], [21, -8]]]) {
      const q = tri.map((p) => [p[0], p[1], 0]);
      g.fill(q, '#C9C0AE'); const w = tri.map((p, i) => { const c = [(tri[0][0] + tri[1][0] + tri[2][0]) / 3, (tri[0][1] + tri[1][1] + tri[2][1]) / 3]; return [lerp(p[0], c[0], 0.12), lerp(p[1], c[1], 0.12), -0.3]; });
      g.fill(w, PC.water); g.water(w, { dens: 1.4 }); g.outline(q, { w: 0.55, boil: false });
    }
    // lawns at the near corner (towards the Carrousel and the Tuileries)
    for (const r of [[24, 28, 36, 36], [28, 10, 36, 22]]) { const q = K.rect(r[0], r[1], r[2], r[3]); g.fill(q, PC.lawn); g.grass(q, { dens: 0.8 }); g.outline(q, { w: 0.5, c: '#86A05E', boil: false }); }
    // the quai strip by the river
    g.fill(K.rect(-H, -H, -31.5, H), PC.pave);
  }, { rim: true });

  /* ---------------- the wings ---------------- */
  // a stretch of wing: face 'R' (towards +x) for the river wing, 'L' (towards +y) for the far wing
  const wing = (x0, y0, x1, y1, o) => T.obj([x0, y0, x1, y1], function (g) {
    g.boilP = 0.25; o = o || {};
    const Z = o.z || 10.6;
    K.box(g, x0, y0, x1, y1, 0, Z, STN, { w: 0.9 });
    for (const face of ['L', 'R']) {
      const p = face === 'L' ? y1 : x1, A0 = face === 'L' ? x0 : y0, A1 = face === 'L' ? x1 : y1, n = Math.max(1, Math.round((A1 - A0) / 2.6)), bw = (A1 - A0) / n;
      const pil = [];
      for (let i = 0; i < n; i++) {
        const m = A0 + bw * (i + 0.5);
        PA.win(g, face, p, m - 0.55, m + 0.55, 0.8, 3.6, { pane: '#5E6B76' });
        const ar = []; for (let k = 0; k <= 6; k++) { const t = Math.PI * k / 6; ar.push(K.pt(face, p + 0.05, m - Math.cos(t) * 0.55, 3.6 + Math.sin(t) * 0.55)); } g.fill(ar, '#5E6B76');
        PA.win(g, face, p, m - 0.6, m + 0.6, 5.0, 8.2, { pane: '#5E6B76', rail: true });
        const pd = [K.pt(face, p + 0.06, m - 0.85, 8.45), K.pt(face, p + 0.06, m + 0.85, 8.45), K.pt(face, p + 0.06, m, i % 2 ? 9.2 : 9.0)]; g.fill(pd, '#F6F0E2'); g.outline(pd, { w: 0.3, c: '#B5A684', boil: false, ext: 0 });
        const a = g.p.apply(g, K.pt(face, p + 0.04, A0 + bw * i, 0.4)), b = g.p.apply(g, K.pt(face, p + 0.04, A0 + bw * i, Z - 0.6)); pil.push(a[0], a[1], b[0], b[1]);
      }
      g.segs2(pil, '#CDBF9E', 0.6);
      g.line([K.pt(face, p + 0.05, A0, 4.5), K.pt(face, p + 0.05, A1, 4.5)], { w: 0.35, c: '#B5A684', boil: false, ext: 0 });
    }
    // cornice and balustrade
    K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, Z, Z + 0.5, STN, { w: 0.6, nohid: true });
    const bal = []; for (let a = x0; a <= x1; a += 0.5) { const q = g.p(a, y1 + 0.2, Z + 0.5), r = g.p(a, y1 + 0.2, Z + 1.2); bal.push(q[0], q[1], r[0], r[1]); } for (let a = y0; a <= y1; a += 0.5) { const q = g.p(x1 + 0.2, a, Z + 0.5), r = g.p(x1 + 0.2, a, Z + 1.2); bal.push(q[0], q[1], r[0], r[1]); }
    g.segs2(bal, '#CDBF9E', 0.4);
    // the steep slate roof with round dormers
    const top = PA.mansard(g, x0 + 0.4, y0 + 0.4, x1 - 0.4, y1 - 0.4, Z + 1.2, { h: 3.6, d: 1.6, h2: 0.6, col: SLATE, seam: '#5A626C', dormers: 3.4, chim: o.chim || [] });
    void top;
  }, { name: o && o.name || 'wing' });
  // a pavilion: taller, with a square imperial dome and a lantern
  const pavilion = (x0, y0, x1, y1, name) => T.obj([x0, y0, x1, y1], function (g) {
    g.boilP = 0.3;
    const Z = 12.4, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    K.box(g, x0, y0, x1, y1, 0, Z, STN, { w: 1.0 });
    for (const face of ['L', 'R']) {
      const p = face === 'L' ? y1 : x1, A0 = face === 'L' ? x0 : y0, A1 = face === 'L' ? x1 : y1, m = (A0 + A1) / 2;
      // a great arched window over a door, paired columns, sculpture in the pediment
      const ar = [K.pt(face, p + 0.04, m - 1.2, 0)]; for (let k = 0; k <= 8; k++) { const t = Math.PI * k / 8; ar.push(K.pt(face, p + 0.04, m - Math.cos(t) * 1.2, 4.0 + Math.sin(t) * 1.2)); } ar.push(K.pt(face, p + 0.04, m + 1.2, 0));
      g.fill(ar, '#5E6B76');
      for (const s of [-1, 1]) for (const d of [1.7, 2.4]) { const a = g.p.apply(g, K.pt(face, p + 0.08, m + s * d, 0.4)), b = g.p.apply(g, K.pt(face, p + 0.08, m + s * d, Z - 0.8)); g.segs2([a[0], a[1], b[0], b[1]], '#D2C4A2', 0.9); }
      PA.win(g, face, p, m - 0.7, m + 0.7, 6.4, 9.6, { pane: '#5E6B76', rail: true });
      const pd = [K.pt(face, p + 0.06, m - 2.8, 10.6), K.pt(face, p + 0.06, m + 2.8, 10.6), K.pt(face, p + 0.06, m, 12.0)]; g.fill(pd, '#F6F0E2'); g.outline(pd, { w: 0.4, c: '#A99A7B', boil: false });
    }
    K.box(g, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, Z, Z + 0.6, STN, { w: 0.6, nohid: true });
    // the dome: a steep curved square roof rising to a lantern
    const d = 0.4, h = 6.0, lv = 5;
    for (let k = 0; k < lv; k++) {
      const t0 = k / lv, t1 = (k + 1) / lv, ins = (t) => d + (x1 - x0) / 2 * 0.8 * (1 - Math.cos(t * Math.PI / 2)), z0 = Z + 0.6 + h * Math.sin(t0 * Math.PI / 2), z1 = Z + 0.6 + h * Math.sin(t1 * Math.PI / 2);
      const a0 = ins(t0), a1 = ins(t1);
      g.fill([[x0 + a0, y1 - a0, z0], [x1 - a0, y1 - a0, z0], [x1 - a1, y1 - a1, z1], [x0 + a1, y1 - a1, z1]], shade(SLATE, -0.08 + k * 0.03));
      g.fill([[x1 - a0, y1 - a0, z0], [x1 - a0, y0 + a0, z0], [x1 - a1, y0 + a1, z1], [x1 - a1, y1 - a1, z1]], shade(SLATE, 0.12 + k * 0.02));
    }
    const ai = d + (x1 - x0) / 2 * 0.8, zt = Z + 0.6 + h;
    g.fill(K.rect(x0 + ai, y0 + ai, x1 - ai, y1 - ai, zt), shade(SLATE, -0.15));
    const prof = (sx, sy) => { const pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10, a = d + (x1 - x0) / 2 * 0.8 * (1 - Math.cos(t * Math.PI / 2)); pts.push([sx > 0 ? x1 - a : x0 + a, sy > 0 ? y1 - a : y0 + a, Z + 0.6 + h * Math.sin(t * Math.PI / 2)]); } return pts; };
    g.line(prof(1, 1), { w: 0.7, c: '#3E444B', boil: false }); g.line(prof(-1, 1), { w: 0.55, c: '#3E444B', boil: false }); g.line(prof(1, -1), { w: 0.55, c: '#3E444B', boil: false });
    g.line([[x0 + d, y1 - d, Z + 0.6], [x1 - d, y1 - d, Z + 0.6], [x1 - d, y0 + d, Z + 0.6]], { w: 0.7, c: '#3E444B', boil: false });
    K.box(g, cx - 0.8, cy - 0.8, cx + 0.8, cy + 0.8, zt, zt + 1.6, { t: '#6C7580', l: '#E9E2CC', r: '#D2C4A2' }, { w: 0.5 });
    K.cone(g, cx, cy, 0.9, zt + 1.6, 1.6, SLATE); const f = g.p(cx, cy, zt + 3.2); g.disc2(f, 0.4, PC.gold);
    // gilded crests along the dome's ridges
    for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1]]) { const pr = prof(sx, sy); for (let k = 2; k < pr.length; k += 3) g.disc2(g.p.apply(g, pr[k]), 0.35, PC.gold); }
  }, { name });
  wing(-31, -23, -23, -6, { name: 'denon 1', chim: [[-27, -15, 'x', 3]] });
  wing(-31, 6, -23, 21, { name: 'denon 2', chim: [[-27, 14, 'x', 3]] });
  wing(-23, -31, -6, -23, { name: 'sully 1', chim: [[-15, -27, 'y', 3]] });
  wing(6, -31, 23, -23, { name: 'sully 2', chim: [[14, -27, 'y', 3]] });
  pavilion(-32, -32, -22, -22, 'pavillon corner');
  pavilion(-32, -6, -22, 6, 'pavillon denon');
  pavilion(-6, -32, 6, -22, 'pavillon richelieu');
  pavilion(-32, 21, -22, 31, 'pavillon end 1');
  pavilion(23, -32, 33, -22, 'pavillon end 2');

  /* ---------------- the pyramid ---------------- */
  const pyr = (cx, cy, b, h, name, big) => T.obj([cx - b, cy - b, cx + b, cy + b], function (g) {
    const A = [cx, cy, h], c = [[cx - b, cy - b, 0], [cx + b, cy - b, 0], [cx + b, cy + b, 0], [cx - b, cy + b, 0]];
    // the back faces through the glass, then the two front faces
    g.fill([c[0], c[1], A], 'rgba(170,196,206,0.55)'); g.fill([c[3], c[0], A], 'rgba(176,202,212,0.55)');
    g.fill([c[3], c[2], A], 'rgba(200,222,230,0.80)'); g.fill([c[2], c[1], A], 'rgba(178,204,214,0.85)');
    // the diamond lattice on the front faces
    if (big) {
      const lat = [], n = 9;
      for (const [p, q] of [[c[3], c[2]], [c[2], c[1]]]) for (let i = 1; i < n; i++) {
        const t = i / n, a = [lerp(p[0], q[0], t), lerp(p[1], q[1], t), 0];
        const s1 = g.p.apply(g, a), s2 = g.p.apply(g, A), e1 = g.p.apply(g, [lerp(a[0], p[0], 1), lerp(a[1], p[1], 1), 0]);
        void e1; const L1 = g.p.apply(g, [lerp(p[0], A[0], t), lerp(p[1], A[1], t), lerp(0, h, t)]), L2 = g.p.apply(g, [lerp(q[0], A[0], 1 - t), lerp(q[1], A[1], 1 - t), lerp(0, h, 1 - t)]);
        lat.push(s1[0], s1[1], L1[0], L1[1], s1[0], s1[1], L2[0], L2[1]); void s2;
      }
      g.segs2(lat, '#7E95A0', 0.28);
      const gl = g.p(cx - b * 0.3, cy + b * 0.6, h * 0.35), gl2 = g.p(cx - b * 0.1, cy + b * 0.4, h * 0.55); g.segs2([gl[0], gl[1], gl2[0], gl2[1]], C.white, 0.7);
    }
    g.line([c[3], c[2], c[1]], { w: 0.75, c: '#4A5A62', boil: false }); g.line([c[3], A, c[1]], { w: 0.7, c: '#4A5A62', boil: false }); g.line([c[2], A], { w: 0.8, c: '#3A464C', boil: false });
    g.line([c[0], A], { w: 0.35, c: '#7E95A0', boil: false });
  }, { name });
  pyr(PX, PY, PB, PZ, 'pyramid', true);
  pyr(PX, PY - 14.5, 1.8, 2.2, 'pyramidion 1'); pyr(PX + 14.5, PY, 1.8, 2.2, 'pyramidion 2'); pyr(PX - 13.5, PY, 1.8, 2.2, 'pyramidion 3');
  // the rope posts and the queue to the entrance on the +y face
  T.obj([PX - 6, PY + 9.4, PX + 12, PY + 13.6], (g) => { const r = []; for (const y of [PY + 9.6, PY + 13.4]) for (let x = PX - 6; x <= PX + 12; x += 2) { const a = g.p(x, y, 0), b = g.p(x, y, 1.6); r.push(a[0], a[1], b[0], b[1]); } g.segs2(r, '#8A7A5A', 0.55); for (const y of [PY + 9.6, PY + 13.4]) g.line(K.curve([[PX - 6, y, 1.4], [PX + 3, y, 1.0], [PX + 12, y, 1.4]], 4), { w: 0.4, c: '#9C3A30', boil: false }); }, { name: 'ropes' });
  T.cast([PX + 4, PY + 11.5], function (g) {
    const spots = []; for (let i = 0; i < 9; i++) spots.push([PX - 5 + i * 2, PY + 11.4 + (i % 2) * 0.5, 2]); for (let i = 0; i < 7; i++) spots.push([PX + 11 - i * 2, PY + 15.4 + (i % 2) * 0.4, 0]);
    spots.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
    spots.forEach(([x, y, d], i) => PA.person(g, x, y, 0, PA.who(9700 + i, { dir: d, pose: i % 4 === 2 ? 'hold' : 'stand' })));
  }, { name: 'queue' });
  // fountain jets in the pools
  [[-16, 17], [-12, 18.5], [17, -16], [18.5, -12]].forEach(([x, y], i) => T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 6 + i * 2) % 6; return { x, y, z: -0.3, key: f, f }; },
    draw(g, st) { const b = g.p(0, 0, 0), h = 9 + [0, 1, 2, 1.5, 0.5, 1][st.f]; g.fill2([[b[0] - 0.5, b[1]], [b[0] + 0.5, b[1]], [b[0] + 0.25, b[1] - h], [b[0] - 0.25, b[1] - h]], '#E6F1F3', true); g.fill2(arcPts(b[0], b[1] - h, 1.4, 0, TAU, 8), '#F2F8F8', true); const sp = []; for (let k = 0; k < 6; k++) { const a = TAU * k / 6 + st.f; sp.push(b[0] + Math.cos(a) * 2.2, b[1] + Math.sin(a) * 0.9, b[0] + Math.cos(a) * 2.8, b[1] + Math.sin(a) * 1.1 - 0.4); } g.segs2(sp, '#FBFDFD', 0.5); } }));

  /* ---------------- the Arc du Carrousel ---------------- */
  T.obj([20.4, 17.6, 28.4, 20.6], function (g) {
    g.boilP = 0.35;
    const x0 = 20.4, x1 = 28.4, y0 = 17.6, y1 = 20.6, Z = 7.2, PINK = { t: '#EBD3C6', l: '#E7C6B6', r: '#D2AE9D' };
    K.box(g, x0, y0, x1, y1, 0, Z, PINK, { w: 0.85 });
    const arch = (face, p, m, hw, zs) => { const pts = [K.pt(face, p + 0.03, m - hw, 0), K.pt(face, p + 0.03, m + hw, 0)]; for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10; pts.push(K.pt(face, p + 0.03, m + Math.cos(t) * hw, zs + Math.sin(t) * hw)); } return pts; };
    g.fill(arch('L', y1, 24.4, 1.3, 3.6), '#8E6A5C'); g.fill(arch('L', y1, 21.9, 0.7, 2.5), '#8E6A5C'); g.fill(arch('L', y1, 26.9, 0.7, 2.5), '#8E6A5C'); g.fill(arch('R', x1, 19.1, 0.7, 2.5), '#7E5C50');
    for (const a of [21.15, 22.65, 26.15, 27.65]) { const b = g.p(a, y1 + 0.25, 0), t = g.p(a, y1 + 0.25, 5.4); g.line2([b, t], { w: 1.0, c: '#C98A8A', boil: false }); g.disc2(t, 0.5, '#F2E3D6'); }
    K.box(g, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, Z, Z + 0.5, { t: '#F2E3D6', l: '#F2E3D6', r: '#DCC6B6' }, { w: 0.55, nohid: true });
    // the quadriga on top: four horses and the chariot, in bronze-gold
    const c = g.p(24.4, 19.1, Z + 0.5);
    g.fill2([[c[0] - 6, c[1]], [c[0] + 6, c[1]], [c[0] + 5.6, c[1] - 1.2], [c[0] - 5.6, c[1] - 1.2]], '#8E8063', true);
    for (let k = 0; k < 4; k++) { const hx = c[0] - 4.6 + k * 3.0, hy = c[1] - 1.2; g.fill2([[hx - 1.2, hy], [hx + 1.2, hy], [hx + 1.6, hy - 2.6], [hx + 0.6, hy - 3.6], [hx - 1.4, hy - 2.4]], k % 2 ? '#B89A4E' : '#A6883E', true); }
    g.fill2([[c[0] - 1.4, c[1] - 2.4], [c[0] + 1.4, c[1] - 2.4], [c[0] + 0.9, c[1] - 6.4], [c[0] - 0.9, c[1] - 6.4]], '#C9A955', true); g.disc2([c[0], c[1] - 7.0], 0.8, '#C9A955');
  }, { name: 'arc du carrousel' });

  /* ---------------- the quai: parapet, bouquinistes ---------------- */
  const BOX = [-31, -25, -19, -13, -7, 8, 14, 20, 26, 32];
  for (let i = 0; i < BOX.length; i += 2) {
    const y0 = BOX[i] - 2.6, y1 = Math.min(H, BOX[i + 1] + 2.6);
    T.obj([-36.95, y0, -35.55, y1], function (g) {
      PA.parapet(g, 'y', -36.25, y0, y1);
      for (const y of [BOX[i], BOX[i + 1]]) PA.bouquin(g, -36.25, y, 'y', (y * 7 + 3) % 3 !== 0, 9800 + y);
    }, { name: 'bouquinistes' });
  }
  for (let y = -33; y < 35; y += 9) if (Math.abs(y) > 4) T.obj([-32.8, y], (g) => PA.plane(g, -32.8, y, { r: 3.4, h: 6.6, turn: 0.4 + h1(y + 9) * 0.5 }), { name: 'quai tree' });
  // browsers at the boxes (backs to us), a bouquiniste in a folding chair
  [[-34.4, -24.2, 9810], [-34.3, -12.4, 9811], [-34.5, 13.4, 9812], [-34.4, 15.0, 9813], [-34.3, 26.6, 9814]].forEach(([x, y, s]) => T.cast([x, y], (g) => PA.person(g, x, y, 0, PA.who(s, { dir: 2, pose: 'hold' })), { on: true }));
  T.cast([-34.0, -18.8], (g) => { const p = g.p(-34.0, -18.8, 0); g.segs2([p[0] - 1.6, p[1], p[0] + 0.6, p[1] - 4.4, p[0] + 1.6, p[1], p[0] - 0.6, p[1] - 4.4], '#6E5A44', 0.4); PA.person(g, -34.0, -18.8, 1.3, PA.who(9815, { dir: 0, pose: 'sit', beret: '#2A2622', top: '#5A6B5A' })); }, { on: true });

  /* ---------------- the living layer ---------------- */
  // the pinch: one holds up a finger and thumb "on" the apex, the other takes the photo
  T.cast([16, -6], (g) => { PA.person(g, 13.2, -3.4, 0, PA.who(9830, { dir: 0, pose: 'wave', ph: 0.25 })); PA.person(g, 18.6, 1.0, 0, PA.who(9831, { dir: 2, pose: 'hold', phone: true })); }, { on: true });
  // a mime in white face with his hat on the ground, a few watchers
  T.cast([12, 24.5], function (g) {
    const r = K.person(g, 12, 24.5, 0, { dir: 1, pose: 'wave', ph: 0.5, skin: '#F6F3EC', hair: '#2A2622', hairStyle: 'short', top: '#F3F1EA', bot: '#2A2622', shoe: '#2A2622' });
    const sp = r.shoulders; if (sp) { const st = []; for (let i = 1; i <= 4; i++) { const yy = lerp(sp[0][1] + 0.8, r.hip[1] - 0.3, i / 5); st.push(sp[0][0] - 0.4, yy, sp[1][0] + 0.4, yy); } g.segs2(st, '#2A2622', 0.45); }
    const c = r.crown; g.fill2([[c[0] - 1.6, c[1] + 0.8], [c[0] + 1.6, c[1] + 0.8], [c[0] + 1.3, c[1] - 1.4], [c[0] - 1.3, c[1] - 1.4]], '#2A2622', true);
    const h = g.p(13.4, 26.2, 0); g.fill2(arcPts(h[0], h[1], 1.4, 0, TAU, 8).map((q) => [q[0], h[1] + (q[1] - h[1]) * 0.45]), '#2A2622', true);
    PA.person(g, 15.4, 29.2, 0, PA.who(9833, { dir: 2 })); PA.person(g, 10.2, 30.4, 0, PA.who(9834, { dir: 3, k: 0.75 })); PA.person(g, 13.0, 31.0, 0, PA.who(9835, { dir: 2 }));
  }, { on: true });
  // a guide with a raised flag and her group, benches with people by the pools, children feeding pigeons
  T.cast([20, 8], function (g) { const r = PA.person(g, 19.6, 6.6, 0, PA.who(9850, { dir: 2, pose: 'cheer', ph: 0.25, top: '#E6C24F' })); const h = r.hands[0]; g.line2([[h[0], h[1] + 1], [h[0], h[1] - 6]], { w: 0.4, c: '#3A3530', boil: false }); g.fill2([[h[0], h[1] - 6], [h[0] + 3.2, h[1] - 5.2], [h[0] + 3.2, h[1] - 3.2], [h[0], h[1] - 4.0]], '#C9463E', true); for (const [x, y, s2] of [[21.2, 8.4, 9851], [22.6, 9.6, 9852], [20.4, 9.8, 9853], [23.2, 7.6, 9854], [21.8, 11.2, 9855]]) PA.person(g, x, y, 0, PA.who(s2, { dir: 2, pose: s2 % 2 ? 'hold' : 'stand' })); }, { name: 'tour group' });
  for (const [x, y, f] of [[-6, 23, 'L'], [24, -6, 'R']]) T.cast([x, y], (g) => { K.bench(g, x, y, { face: f, L: 2.4 }); const sx = f === 'R' ? x + 1.0 : x, sy = f === 'L' ? y + 1.0 : y; PA.person(g, sx - (f === 'L' ? 0.9 : 0), sy - (f === 'R' ? 0.9 : 0), 1.3, PA.who(9860 + x, { dir: f === 'L' ? 1 : 0, pose: 'sit' })); PA.person(g, sx + (f === 'L' ? 1.0 : 0), sy + (f === 'R' ? 1.0 : 0), 1.3, PA.who(9861 + x, { dir: f === 'L' ? 1 : 0, pose: 'sit', dress: '#7A5BA0' })); }, { on: true });
  T.cast([-4, 15], function (g) { PA.person(g, -4, 15, 0, PA.who(9870, { k: 0.72, dir: 1, pose: 'kneel' })); const R = RNG(4); for (let i = 0; i < 7; i++) { const p = g.p(-5 + R() * 4, 16.5 + R() * 2.5, 0); g.fill2([[p[0] - 1.0, p[1]], [p[0] + 0.8, p[1] - 0.2], [p[0] + 1.2, p[1] - 1.4], [p[0] - 0.4, p[1] - 1.6]], R() < 0.5 ? '#8C8C94' : '#A3A3AA', true); g.disc2([p[0] + 1.2, p[1] - 1.8], 0.45, '#6E6E78'); } }, { on: true });
  // walkers: from the Pont des Arts along the quai, across the courtyard, round the pyramid
  PA.walker(T, PA.who(9840), [[-36, 0.6], [-33.6, 0.6], [-33.6, 30], [-33.6, 0.6]], 1.4, { phase: 0.1 });
  PA.walker(T, PA.who(9841), [[-33.9, -30], [-33.9, -1.2], [-36, -1.2], [-33.9, -1.2]], 1.3, { phase: 0.5 });
  PA.walker(T, PA.who(9842), [[-19, 32], [34, 32]], 1.5, { phase: 0.3 });
  PA.walker(T, PA.who(9843), [[33, 6], [33, -20]], 1.4, { phase: 0.6 });
  PA.walker(T, PA.who(9844), [[-17, -10], [24, -10], [24, 7], [-17, 7]], 1.5, { phase: 0.0 });
  PA.walker(T, PA.who(9845), [[-17, 7], [24, 7], [24, -10], [-17, -10]], 1.3, { phase: 0.45 });
  PA.walker(T, PA.who(9846, { k: 0.75 }), [[30, -16], [30, 26]], 1.7, { phase: 0.2 });
  PA.streetSide(T, { furn: [[30.5, -41.5, 'morris']] });
});
