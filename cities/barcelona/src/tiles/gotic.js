'use strict';
/* (100,0) Barri Gòtic: Plaça Sant Jaume during La Mercè, and the castellers.
   Built: the square of worn sandstone flags; on its far-left side the Palau de la Generalitat (golden sandstone,
   Renaissance front: a round-arched portal, Sant Jordi and the dragon in a medallion above it, the long balcony on the
   principal floor with officials watching, a balustrade on the roof, the senyera flying); on its far-right side the
   Ajuntament (Casa de la Ciutat: neoclassical, four columns round the door, the statues of Jaume I and Fiveller in
   niches, the flag balcony); at the far corner the Cathedral (its Gothic front with two pinnacled towers and the tall
   openwork spire of the cimbori behind) on the little Pla de la Seu, and the neo-Gothic Pont del Bisbe across the lane
   between it and the Generalitat. Low old houses along the near edges (shops, balconies, senyeres), strings of
   festival pennants over the square.
   Who: the colla (Castellers de Barcelona: red shirts, white trousers, black faixes, red mocadors; the children in
   white helmets) resting by the Generalitat, the gralla players and the drummer, a ring of spectators (phones up),
   officials on both balconies, tourists.
   The castell (a 3 de 7), a pure function of t on a 30 s cycle, phased so the segons start climbing as the
   'gotic' cut lands: the colla walks into the pinya round the three baixos; the segons, terços and quarts climb
   up the back onto each other's shoulders, then the two dosos, the acotxador (who crouches) and the enxaneta, who
   raises a hand at the top (the aleta) as the crowd cheers; the tower unwinds from the top, the pinya cheers and
   breaks up and walks back. Every person is an actor anchored at their own feet (biased by height), so the pinya in
   front hides the base and a climber at the back passes behind the tower. */
SF.tile('gotic', 100, 0, { rim: 40 }, function (T) {
  const H = 37, STONE = '#E6CC9C', STONEL = { t: '#F0DEB8', l: '#E6CC9C', r: '#D2B582' }, FLAG = '#F2E6CC';
  const CX = 5, CY = 6;                                  // the castell's centre
  const CYC = 30, T0 = 5.8, sh = SCENE.shots.find((s) => s.name === 'gotic');
  const OFF = sh ? (((5.6 - sh.a / 30) % CYC) + CYC) % CYC : 0;
  const cyc = (t) => { const u = t + OFF; return ((u % CYC) + CYC) % CYC; };
  const scr = (x, y, z) => prj(x, y, z || 0);
  const rel = (from, to, k) => { const a = scr(from[0], from[1], from[2]), b = scr(to[0], to[1], to[2]); return [(b[0] - a[0]), (b[1] - a[1])]; };

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    BC.ground(g, '#E9DCC0');
    // the flagstones of the square
    const sq = K.rect(-21, -21, 29, 29);
    g.fill(sq, '#E4D3B2');
    const jt = []; for (let a = -21; a <= 29; a += 2.5) { const p = g.p(a, -21, 0), q = g.p(a, 29, 0), r = g.p(-21, a, 0), s = g.p(29, a, 0); jt.push(p[0], p[1], q[0], q[1], r[0], r[1], s[0], s[1]); }
    g.segs2(jt, '#D3BF98', 0.28);
    g.scuff(sq, { dir: -0.6, len: 3, c: '#F0E4CC', dens: 0.5, w: 0.45, spread: 0.6 });
    // Pla de la Seu in front of the cathedral, and the lane under the bridge
    g.fill(K.rect(-14, -36, -2, -21), '#E4D3B2'); g.fill(K.rect(-36, -16, -21, -12), '#DCCAA8');
    g.scuff(K.rect(-14, -36, -2, -21), { dir: -0.6, len: 3, c: '#F0E4CC', dens: 0.5, w: 0.45, spread: 0.6 });
    // the Mercè mark painted in the middle of the square: a ring where the pinya stands
    const ring = []; for (let i = 0; i <= 32; i++) { const a = TAU * i / 32; ring.push([CX + Math.cos(a) * 6.4, CY + Math.sin(a) * 6.4, 0]); }
    g.line(ring, { w: 0.4, c: '#CDB68C', boil: false });
  }, { rim: true });

  /* ---------------- the Cathedral (far corner) ---------------- */
  T.obj([-36, -36, -16, -16], function (g) {
    g.boilP = 0.25;
    const ST = { t: '#E9DDC4', l: '#E2D3B4', r: '#CDBB98' };
    // the nave and its roof
    K.box(g, -36, -36, -16, -17, 0, 13, ST, { w: 0.9 });
    K.gable(g, -36.2, -33, -18, -20, 13, 4.5, 'x', { a: '#C9A27D', b: '#B38B66', e: '#E2D3B4' }, { c: '#7A5A3C' });
    // buttresses with pinnacles along the visible side (L, y = -17)
    for (let x = -34; x < -18; x += 4) { K.box(g, x - 0.6, -17, x + 0.6, -15.6, 0, 11, ST, { w: 0.6, nohid: true }); const p = g.p(x, -16.3, 11); g.fill2([[p[0] - 1.6, p[1]], [p[0] + 1.6, p[1]], [p[0], p[1] - 7]], '#E2D3B4', true); g.line2([[p[0] - 1.6, p[1]], [p[0], p[1] - 7], [p[0] + 1.6, p[1]]], { w: 0.45, boil: false }); K.win(g, 'L', -17, x + 1.2, x + 2.8, 4, 10, { style: 'navy', arch: true }); }
    // the cimbori: an octagonal lantern tower with the tall openwork spire, behind the front
    const sx = -25, sy = -26;
    K.cyl(g, sx, sy, 3.6, 13, 22, ST, { w: 0.8, n: 8 });
    for (let i = 0; i < 4; i++) { const a = -Math.PI * 0.2 + i * Math.PI * 0.3, c = [sx + Math.cos(a) * 3.65, sy + Math.sin(a) * 3.65]; g.fill([[c[0] - 0.3, c[1], 15], [c[0] + 0.3, c[1], 15], [c[0] + 0.3, c[1], 20.5], [c[0] - 0.3, c[1], 20.5]], '#4A4F58'); }
    const b = g.p(sx, sy, 22), tip = g.p(sx, sy, 40), wb = 3.4 * SX;
    g.fill2([[b[0] - wb, b[1]], [b[0] + wb, b[1]], tip], '#E2D3B4'); g.fill2([[b[0], b[1]], [b[0] + wb, b[1]], tip], '#CDBB98');
    const tr = []; for (let i = 1; i < 7; i++) { const t = i / 7, y = lerp(b[1], tip[1], t), w = wb * (1 - t); tr.push(b[0] - w, y, b[0] + w, y); } g.segs2(tr, '#9A8A68', 0.35);
    for (let i = 0; i < 6; i++) { const t = (i + 0.5) / 7, y = lerp(b[1], tip[1], t), w = wb * (1 - t); g.fill2([[b[0] - w * 0.5, y - 1], [b[0] + w * 0.3, y - 1], [b[0] - w * 0.1, y - 3.2]], '#5A5F68', true); }
    g.line2([[b[0] - wb, b[1]], tip, [b[0] + wb, b[1]]], { w: 0.75 });
    const cr = []; for (let i = 1; i < 9; i++) { const t = i / 9, y = lerp(b[1], tip[1], t), w = wb * (1 - t); cr.push([b[0] - w - 0.9, y], [b[0] + w + 0.9, y]); } for (const c of cr) g.disc2(c, 0.45, '#E2D3B4');
    g.disc2([tip[0], tip[1] - 1], 0.6, '#D8AE48');
    // the front (R face, x = -16): the portal with its gable, the rose, two pinnacled towers at its ends
    const fr = { t: '#ECE1C9', l: '#E6D8BA', r: '#D5C3A0' };
    K.box(g, -17, -34, -15, -18, 0, 17, fr, { w: 0.9 });
    const gab = [K.pt('R', -14.96, -29.6, 6.0), K.pt('R', -14.96, -22.4, 6.0), K.pt('R', -14.96, -26, 12.8)]; g.fill(gab, '#EFE5CF'); g.outline(gab, { w: 0.45, c: '#9A8A68', boil: false });
    const cro = []; for (let i = 1; i < 6; i++) { const t = i / 6; cro.push(g.p.apply(g, K.pt('R', -14.95, lerp(-29.6, -26, t) - 0.3, lerp(6.0, 12.8, t))), g.p.apply(g, K.pt('R', -14.95, lerp(-22.4, -26, t) + 0.3, lerp(6.0, 12.8, t)))); } for (const c of cro) g.disc2(c, 0.4, '#E6D8BA');
    const pt = [[-28.4, 0], [-23.6, 0], [-23.6, 4.6], [-24.0, 6.6], [-24.9, 8.0], [-26, 8.8], [-27.1, 8.0], [-28.0, 6.6], [-28.4, 4.6]].map(([y, z]) => K.pt('R', -14.97, y, z));
    g.fill(pt, '#4E4A44'); g.outline(pt, { w: 0.5, boil: false });
    for (let k = 1; k <= 2; k++) { const ar = [[-28.4 - k * 0.5, 0], [-28.4 - k * 0.5, 4.6], [-28.0 - k * 0.45, 6.8], [-26, 8.8 + k * 0.7], [-24.0 + k * 0.45, 6.8], [-23.6 + k * 0.5, 4.6], [-23.6 + k * 0.5, 0]].map(([y, z]) => K.pt('R', -14.96, y, z)); g.line(ar, { w: 0.35, c: '#9A8A68', boil: false }); }
    const rose = g.p(-14.95, -26, 14.2); g.disc2(rose, 3.2, '#4E5A6A'); for (let i = 0; i < 8; i++) { const a = TAU * i / 8; g.segs2([rose[0], rose[1], rose[0] + Math.cos(a) * 3.2, rose[1] + Math.sin(a) * 3.2 * 0.95], '#E6D8BA', 0.35); } g.ring2(rose, 3.2, { w: 0.45, c: '#7A6A4A' });
    for (const y of [-33, -19]) {
      K.box(g, -17.5, y - 1.6, -14.5, y + 1.6, 0, 24, fr, { w: 0.8, nohid: true });
      for (let z = 18; z < 24; z += 2.6) K.win(g, 'R', -14.5, y - 0.6, y + 0.6, z, z + 1.8, { style: 'slit', arch: true });
      const p = g.p(-16, y, 24); g.fill2([[p[0] - 2.6, p[1] + 1], [p[0] + 2.6, p[1] + 1], [p[0], p[1] - 22]], '#E6D8BA'); g.fill2([[p[0], p[1] + 1], [p[0] + 2.6, p[1] + 1], [p[0], p[1] - 22]], '#D5C3A0');
      g.line2([[p[0] - 2.6, p[1] + 1], [p[0], p[1] - 22], [p[0] + 2.6, p[1] + 1]], { w: 0.65 });
      for (let i = 1; i < 6; i++) { const t = i / 6; g.disc2([lerp(p[0] - 2.6, p[0], t) - 0.6, lerp(p[1] + 1, p[1] - 22, t)], 0.42, '#E6D8BA'); g.disc2([lerp(p[0] + 2.6, p[0], t) + 0.6, lerp(p[1] + 1, p[1] - 22, t)], 0.42, '#D5C3A0'); }
    }
    // the steps up to the door
    for (let i = 0; i < 3; i++) g.fill([[-15 + i * 1.1, -30, 0.35 * (3 - i)], [-13.9 + i * 1.1, -30, 0.35 * (3 - i)], [-13.9 + i * 1.1, -22, 0.35 * (3 - i)], [-15 + i * 1.1, -22, 0.35 * (3 - i)]], i % 2 ? '#E2D3B4' : '#D8C7A4');
  }, { name: 'cathedral' });

  /* ---------------- the Palau de la Generalitat (far left, its front faces +x) ---------------- */
  T.obj([-36, -12, -21, 26], function (g) {
    g.boilP = 0.25;
    const x1 = -21, Z = 16;
    K.box(g, -36, -12, x1, 26, 0, Z, STONEL, { w: 0.95 });
    const gr = []; for (let z = 1; z < 6; z += 1.0) { const a = g.p(x1 + 0.01, -12, z), b = g.p(x1 + 0.01, 26, z); gr.push(a[0], a[1], b[0], b[1]); } g.segs2(gr, '#CDB283', 0.28);
    // the round-arched portal with its long voussoirs, Sant Jordi's medallion above
    const m = 7, ar = [K.pt('R', x1 + 0.03, m - 2.4, 0), K.pt('R', x1 + 0.03, m + 2.4, 0)]; for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10; ar.push(K.pt('R', x1 + 0.03, m + Math.cos(t) * 2.4, 4.4 + Math.sin(t) * 2.4)); }
    g.fill(ar, '#4A3A2C');
    const vs = []; for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10, a = g.p.apply(g, K.pt('R', x1 + 0.04, m + Math.cos(t) * 2.4, 4.4 + Math.sin(t) * 2.4)), b = g.p.apply(g, K.pt('R', x1 + 0.04, m + Math.cos(t) * 4.2, 4.4 + Math.sin(t) * 4.2)); vs.push(a[0], a[1], b[0], b[1]); } g.segs2(vs, '#B89A68', 0.35);
    g.line(ar.slice(2), { w: 0.5, boil: false });
    const md = g.p(x1 + 0.05, m, 12.8); g.disc2(md, 3.4, '#E9D9B4'); g.ring2(md, 3.4, { w: 0.5, c: '#9A7A48' });
    g.fill2([[md[0] - 1.8, md[1] + 1.2], [md[0] + 1.6, md[1] + 1.0], [md[0] + 1.2, md[1] - 0.6], [md[0] - 1.4, md[1] - 0.4]], '#B9915A', true);   // the horse
    g.fill2([[md[0] - 0.3, md[1] - 0.4], [md[0] + 0.4, md[1] - 0.4], [md[0] + 0.2, md[1] - 2.4], [md[0] - 0.2, md[1] - 2.4]], '#B9915A', true);    // the rider
    g.segs2([md[0] + 0.3, md[1] - 1.6, md[0] + 2.4, md[1] + 1.8], '#7A5A2C', 0.4);                                                         // the lance
    g.fill2([[md[0] + 1.2, md[1] + 2.2], [md[0] + 2.8, md[1] + 1.6], [md[0] + 2.2, md[1] + 2.8]], '#6E8A5A', true);                         // the dragon
    // the principal floor: tall windows with pediments either side, the long balcony in the middle (drawn with its officials below)
    for (const y of [-9, -5, 19, 23]) { K.win(g, 'R', x1, y - 0.9, y + 0.9, 7.6, 11.4, { style: 'navy' }); const a = g.p(x1 + 0.05, y - 1.3, 11.8), b = g.p(x1 + 0.05, y + 1.3, 11.8), c = g.p(x1 + 0.05, y, 13.0); g.fill2([a, b, c], '#F0DEB8', true); g.line2([a, c, b], { w: 0.35, c: '#9A7A48', boil: false }); }
    for (const y of [-9, -5, 1, 13, 19, 23]) K.win(g, 'R', x1, y - 0.7, y + 0.7, 1.5, 4.2, { style: 'navy' });
    for (let y = -9; y <= 23; y += 4) K.win(g, 'R', x1, y - 0.6, y + 0.6, 14, 15.2, { style: 'navy' });
    // the balcony doors behind the officials
    for (const y of [1, 5, 9, 13]) K.win(g, 'R', x1, y - 0.8, y + 0.8, 7.6, 11, { style: 'navy' });
    // officials on the balcony, then its stone balustrade
    [[0.5, 921], [2.4, 922], [4.6, 923], [9.5, 924], [11.4, 925], [13.6, 926]].forEach(([y, s]) => BC.person(g, x1 + 0.9, y, 7.4, BC.who(s, { dir: 0, pose: s % 3 ? 'stand' : 'hold', top: s % 2 ? '#2F343B' : '#3F4D63', jacket: '#F3F1EA', dress: undefined, shorts: false, noLegs: false })));
    K.box(g, x1, -1, x1 + 1.6, 15, 7.0, 7.4, STONEL, { w: 0.6, nohid: true });
    const bl = []; for (let y = -0.7; y < 15; y += 0.55) { const a = g.p(x1 + 1.5, y, 7.4), b = g.p(x1 + 1.5, y, 8.6); bl.push(a[0], a[1], b[0], b[1]); } g.segs2(bl, '#E6CC9C', 0.55); g.segs2(bl, '#B89A68', 0.15);
    K.box(g, x1 + 1.3, -1, x1 + 1.7, 15, 8.6, 8.95, { t: '#F0DEB8', l: '#E6CC9C', r: '#D2B582' }, { w: 0.5, nohid: true });
    BC.drape(g, BC.faces([[x1, 15], [x1, -1], [x1 + 1.7, -1], [x1 + 1.7, 15]]).find((f) => f.n[0] > 0.5), 8, 8.95, 0, 'senyera');
    // the cornice and the roof balustrade
    K.box(g, -36.3, -12.3, x1 + 0.4, 26.3, Z, Z + 0.6, STONEL, { w: 0.6, nohid: true });
    const rb = []; for (let y = -12; y < 26; y += 0.7) { const a = g.p(x1 + 0.2, y, Z + 0.6), b = g.p(x1 + 0.2, y, Z + 1.8); rb.push(a[0], a[1], b[0], b[1]); } g.segs2(rb, '#D2B582', 0.4);
    g.line([[x1 + 0.2, -12, Z + 1.9], [x1 + 0.2, 26, Z + 1.9], [-36, 26, Z + 1.9]], { w: 0.55, boil: false });
  }, { name: 'generalitat' });
  BC.flagActor(T, -28, 7, 17.9, { h: 7, w: 4.6, ht: 3.0 });

  /* ---------------- the Pont del Bisbe over the lane ---------------- */
  T.obj([-31, -16, -27, -12], function (g) {
    const q = { t: '#E9DDC4', l: '#E2D3B4', r: '#CDBB98' };
    K.box(g, -31, -16, -27, -12, 6.5, 11, q, { w: 0.7, nohid: true });
    const ar = []; for (let i = 0; i <= 8; i++) { const t = Math.PI * i / 8; ar.push(K.pt('R', -26.97, -14 - Math.cos(t) * 1.8, 6.5 + Math.sin(t) * 0.9)); } g.fill(ar, '#CDBB98');
    for (const y of [-15.2, -12.8]) K.win(g, 'R', -27, y - 0.45, y + 0.45, 7.6, 10, { style: 'navy', arch: true });
    const sk = g.p(-26.95, -14, 8.9); g.disc2(sk, 0.55, '#F3EEE0'); g.segs2([sk[0] - 0.9, sk[1] + 0.9, sk[0] + 0.9, sk[1] - 0.9], '#5A4A3C', 0.3);
    for (let i = 0; i < 4; i++) { const p = g.p(-27, -15.6 + i * 1.07, 11); g.fill2([[p[0] - 0.7, p[1]], [p[0] + 0.7, p[1]], [p[0], p[1] - 3]], '#E2D3B4', true); }
  }, { name: 'pont del bisbe', under: 6.5 });

  /* ---------------- the Ajuntament (far right, its front faces +y) ---------------- */
  T.obj([-2, -36, 30, -21], function (g) {
    g.boilP = 0.25;
    const y1 = -21, Z = 15, ST = { t: '#F2E8D2', l: '#EDE0C4', r: '#D9C9A6' };
    K.box(g, -2, -36, 30, y1, 0, Z, ST, { w: 0.95 });
    const gr = []; for (let z = 1; z < 5.6; z += 0.9) { const a = g.p(-2, y1 + 0.01, z), b = g.p(30, y1 + 0.01, z); gr.push(a[0], a[1], b[0], b[1]); } g.segs2(gr, '#D2BF98', 0.28);
    for (let x = 0; x < 29; x += 3) if (x < 9 || x > 18) { K.win(g, 'L', y1, x, x + 1.4, 1.4, 4.4, { style: 'navy' }); K.win(g, 'L', y1, x, x + 1.4, 7.2, 10.6, { style: 'navy' }); K.win(g, 'L', y1, x + 0.2, x + 1.2, 12.2, 13.8, { style: 'navy' }); }
    // the central bay: four columns round the door, niches with Jaume I and Fiveller, the flag balcony above
    g.fill(K.on('L', y1 + 0.03, 9.6, 18.4, 0, 6.2), '#E6D7B8');
    g.fill(K.on('L', y1 + 0.05, 12.6, 15.4, 0, 4.8), '#4A3A2C');
    for (const x of [10.2, 12.1, 15.9, 17.8]) { const a = g.p(x, y1 + 0.5, 0), b = g.p(x, y1 + 0.5, 6.0); g.line2([a, b], { w: 1.5, c: '#F6EEDB', boil: false, ext: 0 }); g.line2([[a[0] + 0.8, a[1]], [b[0] + 0.8, b[1]]], { w: 0.3, c: '#B8A57E', boil: false, ext: 0 }); }
    for (const x of [11.1, 16.9]) { const n = g.p(x, y1 + 0.05, 2.0); g.fill2([[n[0] - 0.9, n[1]], [n[0] + 0.9, n[1]], [n[0] + 0.9, n[1] - 9], [n[0] - 0.9, n[1] - 9]], '#CDBB98', true); g.fill2([[n[0] - 0.55, n[1] - 0.2], [n[0] + 0.55, n[1] - 0.2], [n[0] + 0.4, n[1] - 6.6], [n[0] - 0.4, n[1] - 6.6]], '#BDB7A8', true); g.disc2([n[0], n[1] - 7.4], 0.8, '#BDB7A8'); }
    K.box(g, 9.6, y1, 18.4, y1 + 1.2, 6.0, 6.6, ST, { w: 0.6, nohid: true });
    for (const x of [11, 14, 17]) K.win(g, 'L', y1, x - 0.8, x + 0.8, 6.6, 10.4, { style: 'navy' });
    // officials and guests on the flag balcony, its iron rail, the flags hanging from it
    [[10.6, 931], [12.4, 932], [14.6, 933], [16.8, 934]].forEach(([x, s]) => BC.person(g, x, y1 + 0.6, 6.6, BC.who(s, { dir: 1, pose: 'stand', top: s % 2 ? '#2F343B' : '#C9392E', shorts: false })));
    const F = BC.faces([[9.6, y1], [18.4, y1], [18.4, y1 + 1.2], [9.6, y1 + 1.2]]).find((f) => f.n[1] > 0.5);
    const rl = []; for (let x = 9.8; x <= 18.3; x += 0.42) { const a = g.p(x, y1 + 1.15, 6.6), b = g.p(x, y1 + 1.15, 7.7); rl.push(a[0], a[1], b[0], b[1]); } g.segs2(rl, BP.iron, 0.24); g.line([[9.6, y1 + 1.15, 7.7], [18.4, y1 + 1.15, 7.7]], { w: 0.4, c: BP.iron, boil: false });
    BC.drape(g, F, 4.0, 7.7, 0.1, 'senyera');
    BC.drape(g, F, 7.4, 7.7, 0.1, 'bcn');
    // the attic with its name, the cornice
    g.fill(K.on('L', y1 + 0.03, -2, 30, 11.4, 11.9), '#E2D3B4');
    K.box(g, -2.3, -36.3, 30.3, y1 + 0.3, Z, Z + 0.6, ST, { w: 0.6, nohid: true });
    K.box(g, 9, -24, 19, y1 + 0.2, Z + 0.6, Z + 2.6, ST, { w: 0.6, nohid: true });
    K.text(g, 'L', y1 + 0.25, 14, Z + 1.0, 1.1, 'AJUNTAMENT', '#7A6A4A', { center: true });
  }, { name: 'ajuntament' });
  BC.flagActor(T, 13, -28, 17.6, { h: 6.5, w: 4.2, ht: 2.8 });

  /* ---------------- low old houses along the near edges ---------------- */
  const HOUSE = (poly, z, seed, o) => T.obj(BC.bbox(poly), (g) => BC.house(g, Object.assign({ poly, z, seed, gf: 4.2, fl: 3.1, bay: 2.4, col: ['#E8C9A0', '#EDD9B6', '#E2BE96', '#F0DDBE'][seed % 4], flags: 0.3, closedP: 0.1 }, o || {})), { name: 'house' });
  HOUSE([[30, -22], [37, -22], [37, -5], [30, -5]], 10.5, 3);
  HOUSE([[30, -3], [37, -3], [37, 14], [30, 14]], 12, 4);
  HOUSE([[30, 16], [37, 16], [37, 22], [30, 22]], 9.5, 9);
  HOUSE([[24, 24], [37, 24], [37, 27], [27, 37], [24, 37]], 11.5, 5);
  HOUSE([[6, 30], [22, 30], [22, 37], [6, 37]], 10, 6);
  HOUSE([[-14, 30], [4, 30], [4, 37], [-14, 37]], 12, 7);
  HOUSE([[-36, 28], [-16, 28], [-16, 37], [-27, 37], [-37, 27]], 13.5, 8);
  // pennants over the square, from the near houses to the palaces
  T.obj([-21, 18.5, 30, 19.5], (g) => BC.bunting(g, [-21, 19, 14], [30, 19, 10], 16), { name: 'bunting' });
  T.obj([-21, -9.5, 30, -8.5], (g) => BC.bunting(g, [-21, -9, 14], [30, -9, 13], 16, ['#F6F1E4', '#4F8FBF', BP.red, BP.yellow]), { name: 'bunting2' });

  BC.block(T, { corners: { nn: 'bins', np: 'motos', pp: null, pn: null }, skip: {}, palms: true });

  /* ---------------- the colla: walk in, pinya, the castell, walk out ---------------- */
  const SHIRT = '#C9392E';
  const REST = []; { const R = RNG(4401); for (let i = 0; i < 6; i++) for (let j = 0; j < 14; j++) REST.push([-19.2 + i * 1.75 + (R() - 0.5) * 0.5, -6 + j * 2.0 + (R() - 0.5) * 0.6]); for (let i = REST.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)), t = REST[i]; REST[i] = REST[j]; REST[j] = t; } }
  // the tower: [tier, angle, radius, z, k, pose]
  const A3 = [Math.PI * 0.25, Math.PI * 0.25 + TAU / 3, Math.PI * 0.25 - TAU / 3];
  const TOWER = [];
  const TZ = [0, 4.55, 9.0, 13.35, 17.4, 20.3, 22.3], TK = [1.05, 1.0, 0.95, 0.88, 0.68, 0.6, 0.55];
  for (let tier = 0; tier <= 3; tier++) for (let m = 0; m < 3; m++) TOWER.push({ tier, a: A3[m] + tier * 0.0, r: 1.15, z: TZ[tier], k: TK[tier] });
  TOWER.push({ tier: 4, a: Math.PI * 0.75, r: 0.62, z: TZ[4], k: TK[4] }, { tier: 4, a: -Math.PI * 0.25, r: 0.62, z: TZ[4], k: TK[4] });
  TOWER.push({ tier: 5, a: 0, r: 0, z: TZ[5], k: TK[5] }, { tier: 6, a: 0, r: 0, z: TZ[6], k: TK[6] });
  // the climbing timetable: tier i goes up at UP[i] (1 s) and down at DN[i] (0.65 s); the enxaneta's aleta in between
  const UP = [0, T0, T0 + 1.15, T0 + 2.3, T0 + 3.45, T0 + 4.5, T0 + 5.5], TOP = UP[6] + 1.0, ALETA = 1.35;
  const DN = []; DN[6] = TOP + ALETA; DN[5] = DN[6] + 0.7; DN[4] = DN[5] + 0.65; DN[3] = DN[4] + 0.65; DN[2] = DN[3] + 0.65; DN[1] = DN[2] + 0.65;
  const DONE = DN[1] + 0.65, BREAK = DONE + 1.6;
  // the pinya: three rings round the base
  const PINYA = []; for (const [r, n, a0] of [[2.3, 7, 0.2], [3.45, 10, 0.05], [4.6, 13, 0.3]]) for (let i = 0; i < n; i++) PINYA.push({ a: a0 + TAU * i / n, r });
  const BACK = Math.PI * 1.25;                      // the far side, where climbers wait and go up
  const WAIT = (i) => { const a = BACK + (i % 2 ? 1 : -1) * (0.35 + Math.floor(i / 2) * 0.18), r = 5.8 + (i % 3) * 0.7; return [CX + Math.cos(a) * r, CY + Math.sin(a) * r]; };
  const dirTo = (dx, dy) => BC.dirOf(dx, dy);
  const LOOKS = []; for (let i = 0; i < 18; i++) LOOKS.push(BC.casteller(4500 + i, { shirt: SHIRT }));
  const walkSeg = (A, B, t0, v, tc) => { const d = Math.hypot(B[0] - A[0], B[1] - A[1]), u = (tc - t0) * v; if (u <= 0) return null; if (u >= d) return null; const f = u / d; return { x: lerp(A[0], B[0], f), y: lerp(A[1], B[1], f), dir: dirTo(B[0] - A[0], B[1] - A[1]), ph: Math.floor((u / 2.4) % 1 * 8) }; };
  const person = (look, extra) => (g, st) => BC.person(g, 0, 0, 0, Object.assign({}, look, extra || {}, { dir: st.dir, pose: st.pose, ph: st.ph || 0, reach: st.reach, hands: st.hands }));
  let ri = 0;
  /* a pinya member (or a baix): rest -> slot -> rest */
  const pinyaActor = (slot, look, i, baix) => {
    const home = REST[ri++], t0 = 0.6 + h1(i * 17) * 1.4, v = 4.2 + h1(i * 7) * 1.2, back = 19.8 + h1(i * 5) * 1.6;
    const face = dirTo(CX - slot[0], CY - slot[1]);
    const target = baix ? [CX, CY, 4.0] : [CX, CY, 5.4];
    const rch = rel([slot[0], slot[1], 0], target), kk = look.k || 1, sgn = (face === 0 || face === 3) ? 1 : -1;
    const reach = [rch[0] * sgn / kk * (baix ? 0.6 : 0.55), rch[1] / kk * (baix ? 1 : 0.95)];
    T.actor({ sample: 0.5, period: CYC, bias: baix ? 0 : 0,
      at(t) {
        const tc = cyc(t), d1 = Math.hypot(slot[0] - home[0], slot[1] - home[1]), arrive = t0 + d1 / v;
        if (tc < t0) return { x: home[0], y: home[1], key: 'r', dir: (i % 4), pose: 'stand' };
        if (tc < arrive) { const w = walkSeg(home, slot, t0, v, tc); return { x: w.x, y: w.y, key: 'w' + w.dir + '.' + w.ph, dir: w.dir, pose: 'walk', ph: w.ph / 8 }; }
        if (tc < back) {
          const cheer = tc > DONE && tc < BREAK;
          if (cheer) { const ph = Math.floor(tc * 4) % 4; return { x: slot[0], y: slot[1], key: 'c' + ph, dir: face, pose: 'cheer', ph: ph / 4 }; }
          const brace = tc > UP[1] - 0.4 && tc < DONE;
          return { x: slot[0], y: slot[1], key: brace ? 'b' : 's', dir: face, pose: 'stand', reach: brace ? reach : null };
        }
        const w = walkSeg(slot, home, back, v * 0.8, tc);
        if (w) return { x: w.x, y: w.y, key: 'w' + w.dir + '.' + w.ph, dir: w.dir, pose: 'walk', ph: w.ph / 8 };
        return { x: home[0], y: home[1], key: 'r', dir: (i % 4), pose: 'stand' };
      },
      draw: person(look) });
  };
  PINYA.forEach((p, i) => pinyaActor([CX + Math.cos(p.a) * p.r, CY + Math.sin(p.a) * p.r], LOOKS[i % 18], i, false));
  /* a member of the tower: rest -> wait at the back -> climb -> stand on the shoulders below -> climb down -> rest */
  TOWER.forEach((m, i) => {
    const slot = [CX + Math.cos(m.a) * m.r, CY + Math.sin(m.a) * m.r];
    const kid = m.tier >= 4, look = kid ? BC.casteller(4600 + i, { shirt: SHIRT, k: m.k, helmet: true, hairStyle: i % 2 ? 'pony' : 'short' }) : Object.assign({}, LOOKS[(i * 5) % 18], { k: m.k, build: m.tier === 0 ? 0.95 : 0.6 - m.tier * 0.1 });
    if (m.tier === 0) { pinyaActor(slot, Object.assign(look, { k: m.k }), 100 + i, true); return; }
    const home = REST[ri++], wait = WAIT(i), t0 = 0.8 + h1(i * 29) * 1.2, v = 4.0;
    const up0 = UP[m.tier] + (m.tier <= 3 ? (i % 3) * 0.2 : m.tier === 4 ? (i % 2) * 0.25 : 0), up1 = up0 + 0.85;
    const dn0 = DN[m.tier] + (m.tier <= 3 ? (i % 3) * 0.12 : 0), dn1 = dn0 + 0.6;
    const face = m.r > 0 ? dirTo(-Math.cos(m.a), -Math.sin(m.a)) : 1;
    // arms: on the two neighbours' shoulders (trunk tiers), on each other's (dosos)
    let hands = null;
    if (m.tier <= 3) { const nb = TOWER.filter((q) => q.tier === m.tier && q !== m); hands = nb.map((q) => { const r = rel([slot[0], slot[1], m.z], [CX + Math.cos(q.a) * q.r, CY + Math.sin(q.a) * q.r, m.z + 4.2 * q.k]); const s = (face === 0 || face === 3) ? 1 : -1; return [r[0] * s / m.k * 0.42, r[1] / m.k + 0.6]; }); }
    else if (m.tier === 4) { const q = TOWER.find((o) => o.tier === 4 && o !== m), r = rel([slot[0], slot[1], m.z], [CX + Math.cos(q.a) * q.r, CY + Math.sin(q.a) * q.r, m.z + 4.0 * q.k]); const s = (face === 0 || face === 3) ? 1 : -1; hands = [[r[0] * s / m.k, r[1] / m.k - 1], [r[0] * s / m.k * 0.6, r[1] / m.k + 1]]; }
    // the climb: from the waiting spot up the back of the tower to the slot
    const B0 = [CX + Math.cos(BACK) * 2.0, CY + Math.sin(BACK) * 2.0];
    const climb = (f) => { if (f < 0.5) { const u = f / 0.5; return [lerp(wait[0], B0[0], u), lerp(wait[1], B0[1], u), m.z * 0.55 * u]; } const u = (f - 0.5) / 0.5; return [lerp(B0[0], slot[0], u), lerp(B0[1], slot[1], u), lerp(m.z * 0.55, m.z, u)]; };
    T.actor({ sample: 0.5, period: CYC, bias: m.tier * 0.02 + 0.01,
      at(t) {
        const tc = cyc(t), d1 = Math.hypot(wait[0] - home[0], wait[1] - home[1]), arrive = t0 + d1 / v;
        if (tc < t0) return { x: home[0], y: home[1], key: 'r', dir: i % 4, pose: 'stand' };
        if (tc < arrive) { const w = walkSeg(home, wait, t0, v, tc); return { x: w.x, y: w.y, key: 'w' + w.dir + '.' + w.ph, dir: w.dir, pose: 'walk', ph: w.ph / 8 }; }
        if (tc < up0) return { x: wait[0], y: wait[1], key: 'v', dir: dirTo(CX - wait[0], CY - wait[1]), pose: 'stand' };
        if (tc < up1 || (tc >= dn0 && tc < dn1)) {
          const f = tc < up1 ? (tc - up0) / (up1 - up0) : 1 - (tc - dn0) / (dn1 - dn0), q = Math.round(f * 6) / 6, p = climb(q);
          return { x: p[0], y: p[1], z: p[2], key: 'k' + Math.round(q * 6), dir: dirTo(CX - p[0], CY - p[1]), pose: 'stand', reach: [0.5, -19] };
        }
        if (tc < dn0) {
          if (m.tier === 5) return { x: slot[0], y: slot[1], z: m.z, key: 'a', dir: 1, pose: 'crouch' };
          if (m.tier === 6) { const al = tc >= TOP && tc < TOP + ALETA, ph = Math.floor(tc * 5) % 4; return { x: slot[0], y: slot[1], z: m.z, key: al ? 'al' + ph : 'e', dir: 1, pose: al ? 'wave' : 'stand', ph: ph / 4 }; }
          return { x: slot[0], y: slot[1], z: m.z, key: 'st', dir: face, pose: 'stand', hands };
        }
        const back = dn1 + 1.5 + h1(i) * 1.5;
        if (tc < back) { const cheer = tc > DONE && tc < BREAK, ph = Math.floor(tc * 4) % 4; return { x: wait[0], y: wait[1], key: cheer ? 'c' + ph : 'v', dir: dirTo(CX - wait[0], CY - wait[1]), pose: cheer ? 'cheer' : 'stand', ph: ph / 4 }; }
        const w = walkSeg(wait, home, back, v * 0.8, tc);
        if (w) return { x: w.x, y: w.y, key: 'w' + w.dir + '.' + w.ph, dir: w.dir, pose: 'walk', ph: w.ph / 8 };
        return { x: home[0], y: home[1], key: 'r', dir: i % 4, pose: 'stand' };
      },
      draw: person(look, { helmet: kid }) });
  });
  // the rest of the colla who never go in: chatting by the Generalitat
  for (let i = 0; i < 6; i++) { const p = REST[ri++]; T.cast([p[0], p[1]], (g) => BC.person(g, p[0], p[1], 0, Object.assign({}, LOOKS[(i * 7 + 3) % 18], { dir: i % 2 ? 0 : 1, pose: i % 3 ? 'stand' : 'hold' })), { on: true }); }
  // the musicians: three gralla players and a drummer; they play while the tower goes up and comes down
  for (let i = 0; i < 4; i++) {
    const x = -12.5 + (i % 2) * 1.8, y = 22 + Math.floor(i / 2) * 2.0, look = BC.casteller(4700 + i, { shirt: SHIRT });
    T.actor({ sample: 5, period: CYC, at(t) { const tc = cyc(t), play = tc > UP[1] - 0.6 && tc < DONE + 0.4, ph = Math.floor(tc * 6) % 2; return { x, y, key: (play ? 'p' : 's') + ph, play, ph }; },
      draw(g, st) {
        if (i < 3) {
          const r = BC.person(g, 0, 0, 0, Object.assign({}, look, { dir: 0, pose: 'stand', hands: st.play ? [[3.4, -16.8], [4.6, -15.6]] : null }));
          if (st.play) { const m = [r.head[0] + 1.6, r.head[1] + 1.4], e = [m[0] + 5.4, m[1] + 3.2]; g.line2([m, e], { w: 0.8, c: '#6B4A2C', boil: false, ext: 0 }); g.fill2([[e[0] - 0.4, e[1] - 1.0], [e[0] + 1.2, e[1] + 0.4], [e[0] - 0.4, e[1] + 1.2]], '#C9A26B', true); }
        } else {
          const r = BC.person(g, 0, 0, 0, Object.assign({}, look, { dir: 0, pose: 'stand', hands: [[3.0, st.play && st.ph ? -12.4 : -10.6], [2.0, -10.0]] }));
          const d = [r.hip[0] + 3.2, r.hip[1] + 0.5]; g.fill2(arcPts(d[0], d[1], 2.4, 0, TAU, 12).map((q) => [q[0], d[1] + (q[1] - d[1]) * 0.45]), '#E9D9B4', true); g.fill2([[d[0] - 2.4, d[1]], [d[0] + 2.4, d[1]], [d[0] + 2.4, d[1] + 2.4], [d[0] - 2.4, d[1] + 2.4]], '#C9392E', true); g.ring2([d[0], d[1]], 2.4, { w: 0.3, c: '#7A3A2A' });
        }
      } });
  }

  /* ---------------- the crowd round the square ---------------- */
  const SPOTS = [];
  { const R = RNG(4801); for (let i = 0; i < 60; i++) { const a = R() * TAU, r = 9.8 + R() * 4.2, x = CX + Math.cos(a) * r, y = CY + Math.sin(a) * r; if (x < -18 || y < -19 || x > 28 || y > 28) continue; if (x < -6 && y > -4) continue; SPOTS.push([x, y, a]); } }
  SPOTS.forEach(([x, y, a], i) => {
    const look = BC.who(4900 + i, i % 5 === 0 ? { phone: true } : {}), face = dirTo(CX - x, CY - y), sg = (face === 0 || face === 3) ? 1 : -1;
    if (i % 3 === 0) T.actor({ sample: 5, period: CYC, at(t) { const tc = cyc(t), ch = (tc > TOP && tc < TOP + ALETA + 0.6) || (tc > DONE && tc < BREAK); const ph = Math.floor(tc * 4 + i) % 4; return { x, y, key: ch ? 'c' + ph : look.phone ? 'h' : 's', ch, ph }; },
      draw(g, st) { BC.person(g, 0, 0, 0, Object.assign({}, look, { dir: face, pose: st.ch ? 'cheer' : look.phone ? 'hold' : 'stand', ph: st.ph / 4, phone: look.phone && !st.ch, hands: look.phone && !st.ch ? [[2.2, -16.8], [1.6, -16.2]] : null })); } });
    else T.cast([x, y], (g) => BC.person(g, x, y, 0, Object.assign({}, look, { dir: face, pose: look.phone ? 'hold' : 'stand' })), { on: true });
  });
  // tourists crossing the square and coming from the lanes
  BC.walker(T, BC.who(4990), [[24, -18], [24, 26], [-16, 26], [-16, -16]], 1.4, { phase: 0.1 });
  BC.walker(T, BC.who(4991, { sunhat: true }), [[-12, -34], [-4, -24], [-4, -34]], 1.2, { phase: 0.4 });
  BC.walker(T, BC.who(4992), [[-35, -14], [-19, -14]], 1.3, { phase: 0.2 });
});
