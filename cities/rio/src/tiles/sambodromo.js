'use strict';
/* (-100,100) The Sambadrome: Niemeyer's Passarela do Samba on the night... here the afternoon of the parade.
   Built: the avenue (Rua Marquês de Sapucaí) running along x through the tile, 14 u of grey concrete with white edge
   lines and sector numbers; on its far side the concrete grandstand (arquibancada), twelve tiers rising away from the
   avenue to a back wall, with floodlight masts behind; on its near side a row of frisas (front boxes) and two glass
   judges' booths; beyond them a service road, food stalls, people in costume, and the Praça da Apoteose with
   Niemeyer's great "M" arch in the near-right corner.
   Who: a whole samba school parading towards +x on a timetable — the comissão de frente in step, the first couple
   (mestre-sala bowing, porta-bandeira spinning with the flag), the opening float with its crowned golden sun turning,
   alas in rows of four, the baianas spinning their hooped skirts, the drum queen, a bateria of tamborins, caixas and
   surdos, a second float with a macaw beating its wings and destaques in huge feathers, more alas, passistas. In the
   stand ~450 fans; a Mexican wave runs down the stand and every section jumps up when a float passes. Judges in their
   booths, a cameraman, vendors outside.
   The parade's clock is phased so the opening float is in the middle of the frame when the `sambodromo` shot cuts in,
   and the baianas spin through the `desfile` close-up. */
SF.tile('sambodromo', -100, 100, { rim: 34 }, function (T) {
  const AV0 = -6, AV1 = 10, V = 2.4, LOOP = 220, sh = SCENE.shots.find((s) => s.name === 'sambodromo');
  const OFF = sh ? 20 + 37 - (sh.a / 30) * V : 0;
  const head = (t) => -37 + ((((t * V + OFF) % LOOP) + LOOP) % LOOP);           // x of the parade's front
  const GREEN = '#2E9A5E', PINK = '#EC7DAA', GOLD = '#E9B93A', WHITE = '#F6F4EE';

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    K.slab(g, 37, { top: '#E4DED0' }); const iA = g.cmds.length;
    g.fill(K.rect(-37, AV0, 37, AV1), '#CFCABE');
    g.scuff(K.rect(-37, AV0, 37, AV1), { dir: Math.atan2(AY, AX), len: 8, c: '#DBD6CB', dens: 0.45, w: 0.5, spread: 0.05 });
    g.line([[-37, AV0 + 0.4, 0], [37, AV0 + 0.4, 0]], { w: 0.7, c: '#F6F3EA', boil: false }); g.line([[-37, AV1 - 0.4, 0], [37, AV1 - 0.4, 0]], { w: 0.7, c: '#F6F3EA', boil: false });
    for (let i = 0; i < 4; i++) { const x = -30 + i * 18; K.textP(g, (a, z) => [x + a, AV1 - 1.6 - z, 0], 0, 0, 1.6, String(i + 1), '#F6F3EA', { center: true, w: 0.6 }); }
    RJ.lit(g, iA, 0.72);                                                    // (night: the avenue under the floodlights, bright as day)
    // the service road and the Apoteose plaza on the near side
    const iS = g.cmds.length;
    g.fill(K.rect(-37, 16.4, 37, 22), '#D3CDC0');
    g.fill(K.rect(27, -6, 37, 16.4), '#EAE3D2'); RJ.mosaic(g, 27, -6, 37, 16.4, { sp: 2.4 });
    RJ.lit(g, iS, 0.38);
    RJ.lit(g, 0, 0.28);
  }, { rim: true });

  /* ---------------- the grandstand: 12 tiers in four pieces ---------------- */
  const NT = 10, TD = 2.0, TZ = 1.1, Y0 = -7.4, Z0 = 1.8;
  const tierY = (i) => Y0 - i * TD, tierZ = (i) => Z0 + i * TZ;
  const LOOKS = []; for (let i = 0; i < 28; i++) { const w = RJ.who(5100 + i, { carnaval: false }); if (i % 3 === 0) w.top = GREEN; else if (i % 3 === 1 && i % 2) w.top = PINK; LOOKS.push(w); }
  const SEATS = [];
  for (let i = 0; i < NT; i++) { const R = RNG(5200 + i), row = []; for (let x = -36.2; x < 36.5; x += 1.85) { if (R() < 0.08) { R(); continue; } row.push({ x: x + (R() - 0.5) * 0.4, w: LOOKS[Math.floor(R() * LOOKS.length)] }); } SEATS.push(row); }
  const CONC = { t: '#E6E1D6', l: '#D9D3C6', r: '#BFB8A9' };
  const PIECES = [[-37, -18.5], [-18.5, 0], [0, 18.5], [18.5, 37]];
  PIECES.forEach(([x0, x1], pi) => {
    T.obj([x0, tierY(NT - 1) - TD, x1, Y0], function (g) {
      g.boilP = 0.15;
      // the back wall rising above the top tier, then the tiers from the top down, each with its row of fans
      K.box(g, x0, tierY(NT - 1) - TD - 0.8, x1, tierY(NT - 1) - TD, 0, tierZ(NT - 1) + 1.6, CONC, { w: 0.8 });
      for (let i = NT - 1; i >= 0; i--) {
        K.box(g, x0, tierY(i) - TD, x1, tierY(i), 0, tierZ(i), CONC, { w: 0.6, nb: i > 0 });
        for (const s of SEATS[i]) if (s.x >= x0 && s.x < x1) RJ.bust2(g, g.p(s.x, tierY(i) - 0.9, tierZ(i)), s.w, 0.92);
      }
      // the front wall along the avenue: green with the name in white
      g.fill(K.on('L', Y0 + 0.02, x0, x1, 0.2, Z0 - 0.15), GREEN);
      if (pi === 1 || pi === 2) K.text(g, 'L', Y0 + 0.06, pi === 1 ? -9.25 : 9.25, 0.35, 1.0, pi === 1 ? 'PASSARELA' : 'SAPUCAÍ', WHITE, { center: true, w: 0.55 });
      if (pi === 0 || pi === 3) for (let k = 0; k < 4; k++) g.fill(K.on('L', Y0 + 0.05, x0 + 2 + k * 4.2, x0 + 4.4 + k * 4.2, 0.45, 1.4), [GOLD, PINK, WHITE, PINK][k]);
      // at night the stand is full under the floodlights: everything seen in the white light; a rail of lamps along the front
      RJ.lit(g, 0, 0.6);
      for (let x = x0 + 2.3; x < x1; x += 4.6) { if (Math.round((x - x0) / 4.6) % 2) g.glow2('lamp', g.p(x, Y0 + 0.2, Z0 + 0.2), g.p(x, Y0 + 3.5, 0), { r: 0.9 }); else g.glow2('lantern', g.p(x, Y0 + 0.2, Z0 + 0.2), g.p(x, Y0 + 1.5, 0), { r: 1.0, col: '#FFF2D0' }); }
    }, { name: 'grandstand' });
  });
  // floodlight masts behind the stand
  for (const x of [-26, 0, 26]) T.obj([x, -35.5], (g) => {
    const b = g.p(x, -35.5, 0), t = g.p(x, -35.5, 30);
    g.fill2([[b[0] - 1.0, b[1]], [b[0] + 1.0, b[1]], [t[0] + 0.5, t[1]], [t[0] - 0.5, t[1]]], '#9EA1A0'); g.line2([[b[0] - 1.0, b[1]], [t[0] - 0.5, t[1]]], { w: 0.5, c: '#5A564E', boil: false });
    const q = [[t[0] - 6, t[1] - 5], [t[0] + 6, t[1] - 5], [t[0] + 6, t[1] + 1], [t[0] - 6, t[1] + 1]]; g.fill2(q, '#5A5F64', true);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { g.disc2([t[0] - 4.5 + c * 3, t[1] - 3.2 + r * 2.7], 1.0, '#F6EFC8'); g.mark({ nc: '#FFFCEE' }); }
    g.outline2(q, { w: 0.5, boil: false });
    // at night the floodlights are on, thrown over the stand and the avenue
    g.glow2('lantern', [t[0], t[1] - 2], b, { r: 2.8, col: '#FFF8E6' });
    for (const [dx, y] of [[-9, 0], [9, 4]]) g.glow2('lamp', [t[0] + dx * 0.2, t[1] - 2.4], g.p(x + dx, y, 0), { r: 1.8 });
  }, { name: 'mast' });

  /* ---------------- the near side: frisas, judges, the Apoteose ---------------- */
  const FRISA = [[-35, -27], [-25, -17], [-11, -3], [-1, 7], [9, 17]];
  FRISA.forEach(([a, b], i) => T.obj([a, 11.4, b, 14.2], function (g) {
    K.box(g, a, 11.4, b, 14.2, 0, 1.0, { t: '#E9E4D8', l: '#F1EEE6', r: '#D7D1C4' }, { w: 0.6 });
    g.fill(K.on('L', 14.22, a + 0.3, b - 0.3, 0.2, 0.8), i % 2 ? PINK : GREEN);
    RJ.lit(g, 0, 0.6); for (const x of [a + 1.5, b - 1.5]) g.glow2('lamp', g.p(x, 11.6, 1.5), g.p(x, 8, 0), { r: 1.0 });   // (night: lit)
  }, { name: 'frisa' }));
  // fans in the frisas, standing at the rail with their backs to us, some waving
  const FANS = [[-33.5, 12.4], [-30.8, 12.6], [-28.4, 12.2], [-23.6, 12.5], [-20.4, 12.3], [-9.4, 12.5], [-6.2, 12.4], [0.6, 12.6], [3.8, 12.3], [10.8, 12.5], [14.2, 12.4]];
  FANS.forEach(([x, y], i) => { const w = RJ.who(5300 + i); T.actor({ sample: 5, period: 4,
    at(t) { const ph = Math.floor(((t * 1.2 + i * 0.37) % 1) * 4); return { x, y, z: 0, key: i % 3 === 0 ? 'w' + ph : 's', ph: ph / 4 }; },
    draw(g, st) { RJ.person(g, 0, 0, 0, Object.assign({}, w, { dir: i % 2 ? 2 : 3, pose: i % 3 === 0 ? 'cheer' : 'stand', ph: st.ph || 0 })); RJ.lit(g, 0, 0.6); } }); });
  // the judges' booths: glass boxes with two judges at a desk
  for (const x of [-15.5, 21.5]) T.obj([x - 2.2, 11.2, x + 2.2, 15.2], function (g) {
    K.box(g, x - 2.2, 11.2, x + 2.2, 15.2, 0, 1.8, '#E9E4D8', { w: 0.6 });
    RJ.person(g, x - 0.8, 13.6, 1.8, Object.assign(RJ.who(5340 + x, { carnaval: false }), { dir: 2, pose: 'sit', top: '#2F3A4F', bare: false, noLegs: true }));
    RJ.person(g, x + 1.0, 13.4, 1.8, Object.assign(RJ.who(5341 + x, { carnaval: false }), { dir: 3, pose: 'sit', top: '#F3F1EA', bare: false, noLegs: true }));
    const gl = [[x - 2.2, 15.2, 1.8], [x + 2.2, 15.2, 1.8], [x + 2.2, 15.2, 5.0], [x - 2.2, 15.2, 5.0]]; g.fill(gl, 'rgba(200,226,236,0.45)'); g.outline(gl, { w: 0.5, boil: false });
    const gr = [[x + 2.2, 11.2, 1.8], [x + 2.2, 15.2, 1.8], [x + 2.2, 15.2, 5.0], [x + 2.2, 11.2, 5.0]]; g.fill(gr, 'rgba(180,210,222,0.45)'); g.outline(gr, { w: 0.5, boil: false });
    K.box(g, x - 2.5, 10.9, x + 2.5, 15.5, 5.0, 5.6, '#F1EEE6', { w: 0.6 });
    K.text(g, 'L', 15.53, x, 5.1, 0.42, 'JURADOS', '#2E9A5E', { center: true, w: 0.36 });
    RJ.lit(g, 0, 0.6); g.glow('lantern', x, 13.2, 4.4, { r: 2.0, col: '#FFF2D8', base: 1.8 });   // (night: the judges' booth lit)
  }, { name: 'booth' });
  // the Apoteose "M" at the end of the avenue: two parabolic arches of white concrete joined in the middle; the
  // parade has dispersed (faded) before it reaches the arch, so nothing passes under it
  T.obj([33, -7.4, 35, 12.2], function (g) {
    const xa = 33, xb = 35, ya = -6.4, yb = 11.2, ym = (ya + yb) / 2, top = 22, mid = 15.5;
    const arch = (y0, y1) => { const P = []; for (let i = 0; i <= 14; i++) { const t = i / 14; P.push([lerp(y0, y1, t), top * (1 - Math.pow(2 * t - 1, 2)) * (1 - 0.1 * Math.abs(2 * t - 1))]); } return P; };
    const halves = [arch(ya, ym + 0.6), arch(ym - 0.6, yb)];
    for (const H of halves) {
      const out = H.map(([y, z]) => [xb, y, z]), inn = H.map(([y, z]) => [xb, y, Math.max(0, z - 1.6)]);
      const top_ = H.map(([y, z]) => [xa, y, z]);
      g.fill(top_.concat(out.slice().reverse()), '#E9E6DE');
      g.fill(out.concat(inn.slice().reverse()), '#F6F4EE');
      g.line(out, { w: 0.9, boil: false }); g.line(inn.filter((p) => p[2] > 0.05), { w: 0.7, boil: false }); g.line(top_, { w: 0.6, boil: false });
    }
    const c = [[xb, ym - 2.6, mid + 4], [xb, ym + 2.6, mid + 4], [xb, ym, mid]]; g.fill(c, '#F6F4EE'); g.outline(c, { w: 0.6, boil: false });
    for (const y of [ya, yb]) K.box(g, xa, y - 0.9, xb, y + 0.9, 0, 1.2, '#D9D3C6', { w: 0.6 });
    // at night Niemeyer's arch is floodlit white from its feet
    RJ.flood(g, 0, 1.3, '#EEF2FF');
    for (const y of [ya, yb]) g.glow2('lantern', g.p(xb + 0.6, y, 1.4), g.p(xb + 2, y, 0), { r: 2.4, col: '#F2F4FF' });
    g.glow('lantern', xb, ym, mid + 2, { r: 2.8, col: '#F2F4FF' });
  }, { name: 'apoteose' });
  T.obj([31, 30], (g) => { const f = g.p(31, 30, 0); g.segs2([f[0], f[1], f[0], f[1] - 26], '#6E6A60', 0.5); }, { name: 'flagpole' });

  /* ---------------- outside: food stalls, people in costume, vendors ---------------- */
  for (const [x, y, a, b, word] of [[-30, 26, PINK, WHITE, 'CHURRASCO'], [-12, 28, GOLD, GREEN, 'CERVEJA'], [6, 26, GREEN, WHITE, 'PIPOCA']]) {
    T.obj([x - 3, y - 2, x + 3, y + 2], function (g) {
      K.box(g, x - 3, y - 1.6, x + 3, y + 1.6, 0, 2.8, { t: '#D9B57E', l: '#E6C893', r: '#C9A26B' }, { w: 0.7 });
      RJ.litSign(g, 'L', y + 1.6, x - 2.6, x + 2.6, 1.3, 2.5, a, word);
      const posts = []; for (const [px, py] of [[x - 3, y + 1.6], [x + 3, y + 1.6], [x + 3, y - 1.6], [x - 3, y - 1.6]]) { const p0 = g.p(px, py, 2.8), p1 = g.p(px, py, 6.4); posts.push(p0[0], p0[1], p1[0], p1[1]); }
      g.segs2(posts, '#6E5A44', 0.5);
      for (let i = 0; i < 6; i++) g.fill([[x - 3.5 + i, y - 2.1, 7], [x - 2.5 + i, y - 2.1, 7], [x - 2.5 + i, y + 2.3, 6.2], [x - 3.5 + i, y + 2.3, 6.2]], i % 2 ? b : a);
      g.outline([[x - 3.5, y - 2.1, 7], [x + 2.5, y - 2.1, 7], [x + 2.5, y + 2.3, 6.2], [x - 3.5, y + 2.3, 6.2]], { w: 0.6, boil: false });
      RJ.lit(g, 0, 0.45); for (const dx of [-1.8, 1.8]) RJ.bulb(g, x + dx, y + 1.2, 6.0, { r: 1.2 });   // (night: bulbs under the awning)
    }, { name: 'stall' });
  }
  const crowdOut = [[-27, 30.5, 1], [-25.6, 31.2, 1], [-9.2, 31.5, 1], [-7.8, 30.4, 0], [8.8, 30.2, 1], [-34, 33, 0], [12, 33.5, 1], [15.5, 18.6, 1], [-2, 33, 0], [24, 22, 1], [33, 20, 2]];
  crowdOut.forEach(([x, y, d], i) => T.cast([x, y], (g) => RJ.person(g, x, y, 0, Object.assign(RJ.who(5400 + i), { dir: d, pose: i % 4 === 1 ? 'hold' : i % 4 === 2 ? 'wave' : 'stand', cup: i % 4 === 1 ? '#F2C230' : undefined, ph: 0.3 })), {}));
  // people in costume walking to the concentration, a vendor with a cooler, a cameraman on the avenue's edge
  const walk = (s, pts, sp, o) => RJ.walker(T, Object.assign(RJ.who(s), o || {}), pts, sp, { phase: h1(s) });
  walk(5420, [[-36, 18], [19, 18]], 1.3, { plume: [PINK, GOLD, GREEN], dress: PINK });
  walk(5421, [[19, 19.6], [-36, 19.6]], 1.2, { plume: [GOLD, WHITE], top: GOLD });
  walk(5422, [[-36, 16.6], [19, 16.6]], 1.1, { marin: true });
  walk(5423, [[-20, 34], [16, 34], [16, 24], [-20, 24]], 0.9, { top: WHITE, cap: '#2E9A5E', cup: '#C9392E' });
  T.actor({ sample: 0.3, period: 24,
    at(t) { const u = (t / 24) % 1, f = u < 0.5 ? u * 2 : 2 - u * 2, x = lerp(-28, 16, smooth(f)); return { x, y: 10.7, key: u < 0.5 ? 'a' : 'b', d: u < 0.5 }; },
    draw(g, st) { const r = RJ.person(g, 0, 0, 0, Object.assign(RJ.who(5430, { carnaval: false }), { dir: st.d ? 0 : 2, pose: 'hold', top: '#2A2622', bare: false, cap: '#2A2622' })); const h = r.hands[0]; g.fill2([[h[0] - 1.6, h[1] - 3.2], [h[0] + 1.8, h[1] - 3.2], [h[0] + 1.8, h[1] - 0.6], [h[0] - 1.6, h[1] - 0.6]], '#3A3530', true); g.disc2([h[0] + (st.d ? 2.2 : -2), h[1] - 1.9], 0.9, '#5E7480'); } });

  // palms round the near edges, and a queue of fans in the school's colours at the gate
  for (const x of [-35.5, -25, -16, -5, 6, 17]) T.obj([x, 35.6], (g) => RJ.coco(g, x, 35.6, { h: 12 + h1(x * 7 + 3) * 3, lean: (h1(x) - 0.5) * 0.8 }), { name: 'palm' });
  for (const y of [24, 31]) T.obj([35.6, y], (g) => RJ.coco(g, 35.6, y, { h: 13, lean: 0.3 }), { name: 'palm' });
  T.obj([-36.5, 21.5, -33.5, 24.5], function (g) {
    K.box(g, -36.5, 21.5, -33.5, 24.5, 0, 3.6, '#E9E4D8', { w: 0.6 }); g.fill(K.on('R', -33.48, 22, 24, 1.6, 3.0), '#9FB9C4');
    K.box(g, -36.9, 21.1, -33.1, 24.9, 3.6, 4.2, GREEN, { w: 0.5 }); K.text(g, 'R', -33.06, 23, 3.7, 0.42, 'PORTÃO 7', WHITE, { center: true, w: 0.36 });
    RJ.nightEach(g, 0, (c, d) => (d.k !== K_FILL ? (c === WHITE ? '#FFF8E6' : undefined) : c === '#9FB9C4' ? '#FFE4A4' : RJ.litCol(c, 0.6)));   // (night: the gate lit)
    g.glow('neon', -33, 23, 3.9, { r: 4, col: '#9FF0C0' }); RJ.wallLamp(g, 'R', -33.5, 21.6, 3.3, 1.2);
  }, { name: 'gate' });
  for (let i = 0; i < 6; i++) { const x = -31.6 + i * 1.7, y = 22.5 + (i % 2) * 0.4; T.cast([x, y], (g) => RJ.person(g, x, y, 0, Object.assign(RJ.who(5440 + i), { dir: 2, pose: i === 2 ? 'hold' : 'stand', phone: i === 2, top: i % 2 ? GREEN : PINK })), {}); }
  /* ---------------- the parade ---------------- */
  const LANES = [-3.4, 0.4, 4.2, 8.0];
  const fade = (x, a0, a1) => clamp(Math.min((x - a0) / 5, (a1 - x) / 7), 0, 1);
  // a row of dancers: one actor anchored at its nearest dancer; looks[i] per lane; mode picks the step
  const row = (s, ys, looks, o) => {
    o = o || {}; const n = ys.length, step = o.step || 'samba';
    T.actor({ sample: 0.25, period: LOOP / V, bias: o.bias || 0,
      at(t) {
        const x = head(t) - s; if (x < -37 || x > 31) return null;
        const a = fade(x, -37, 31); if (a <= 0.02) return null;
        const q = Math.floor(((t * 2.2 + s * 0.13) % 2) * 4), sp = o.spin ? Math.floor(((t * 1.6 + s * 0.07) % 1) * 6) : 0;
        return { x, y: ys[n - 1], key: q + '.' + sp, q, sp, alpha: a < 1 ? a : null };
      },
      draw(g, st) {
        for (let i = 0; i < n; i++) {
          const dy = ys[i] - ys[n - 1], L = looks[i % looks.length], q = (st.q + i) % 8;
          if (o.kind === 'baiana') { RJ.baiana(g, 0, dy, L, st.sp, q); continue; }
          let pose = 'walk', ph = q / 8, extra = {};
          if (step === 'samba') { pose = q % 4 === 1 ? 'cheer' : 'walk'; ph = (q % 4) / 4; }
          else if (step === 'comissao') { pose = ['cheer', 'wave', 'cheer', 'stand'][(st.q >> 1) % 4]; ph = (st.q % 2) * 0.5; }
          else if (step === 'drum') { pose = L.drum === 'tamborim' ? 'wave' : 'hold'; ph = (q % 2) * 0.5; extra = { ph: (q % 2) * 0.5 }; }
          RJ.person(g, 0, dy, 0, Object.assign({}, L, { dir: 0, pose, ph }, extra));
        }
        RJ.lit(g, 0, 0.66);                                                   // (night: the school under the floodlights)
      } });
  };
  // the costumes
  const anjo = (s) => RJ.who(s, { set: { top: WHITE, dress: '#E9EEF2', asas: '#F6F4EE', fem: true, flor: undefined, marin: false, chifre: false, crown: '#D9DDE2', bare: true } });
  const ala1 = (s) => RJ.who(s, { set: { top: PINK, dress: GREEN, plume: [PINK, GREEN, GOLD], plumeN: 7, plumeR: 8, marin: false, chifre: false, flor: undefined, asas: undefined, bare: true } });
  const ala2 = (s) => RJ.who(s, { set: { top: GOLD, bot: GREEN, dress: undefined, shorts: false, crown: GOLD, sash: GREEN, marin: false, chifre: false, flor: undefined, asas: undefined } });
  const ala3 = (s) => RJ.who(s, { set: { top: '#2F6DB5', bot: WHITE, dress: undefined, shorts: false, marin: true, sash: WHITE, chifre: false, flor: undefined, asas: undefined } });
  const ritmo = (s, d) => RJ.who(s, { carnaval: false, set: { top: GREEN, bot: WHITE, dress: undefined, shorts: false, bare: false, drum: d, cap: WHITE, sash: PINK } });
  const pass = (s, i) => { const w = RJ.who(s, { carnaval: false }); if (i % 2) Object.assign(w, { top: w.skin, bikini: GOLD, bot: w.skin, shorts: true, dress: undefined, costeiro: [GOLD, PINK, GREEN, GOLD, WHITE], costeiroR: 12, crown: GOLD, fem: true, hairStyle: 'long' }); else Object.assign(w, { top: WHITE, bot: WHITE, jacket: '#F3F1EA', shorts: false, dress: undefined, tophat: WHITE, cap: undefined, hairStyle: 'short', beard: false }); return w; };
  const L4 = LANES, L3 = [-2.6, 2.3, 7.2];
  const mk = (f, s0, n) => { const a = []; for (let i = 0; i < n; i++) a.push(f(s0 + i, i)); return a; };
  row(0, L4, mk(anjo, 5500, 4), { step: 'comissao' }); row(3.5, L4, mk(anjo, 5504, 4), { step: 'comissao' });
  // the first couple: he bows and turns, she spins with the school's flag
  T.actor({ sample: 0.25, period: LOOP / V,
    at(t) { const x = head(t) - 10; if (x < -37 || x > 31) return null; const a = fade(x, -37, 31); if (a <= 0.02) return null; const sp = Math.floor(((t * 1.4) % 1) * 8); return { x, y: 4.6, key: sp, sp, alpha: a < 1 ? a : null }; },
    draw(g, st) {
      const ms = RJ.who(5520, { carnaval: false, set: { top: WHITE, jacket: GOLD, bot: WHITE, shorts: false, tophat: WHITE, hairStyle: 'short', leque: GOLD, dress: undefined } });
      RJ.person(g, 0, -4.4, 0, Object.assign({}, ms, { dir: st.sp < 4 ? 0 : 1, pose: st.sp % 4 === 2 ? 'wave' : 'stand', ph: 0.3 }));
      const pb = RJ.who(5521, { carnaval: false, set: { top: PINK, hairStyle: 'bun', crown: GOLD } });
      RJ.portaBandeira(g, 0, 0, pb, st.sp, GREEN, PINK, GOLD);
      RJ.lit(g, 0, 0.66);
    } });
  // the opening float
  RJ.floatActor(T, head, 16, LOOP / V, 'sun', { GREEN, PINK, GOLD, WHITE });
  for (let r = 0; r < 3; r++) row(40 + r * 3.5, L4, mk(ala1, 5530 + r * 4, 4), { step: 'samba' });
  for (let r = 0; r < 3; r++) row(53 + r * 4, L3, mk((s) => RJ.who(s, { carnaval: false }), 5550 + r * 3, 3), { kind: 'baiana', spin: true });
  // the drum queen, then the bateria: tamborins in front, caixas, surdos at the back
  T.actor({ sample: 0.25, period: LOOP / V,
    at(t) { const x = head(t) - 67; if (x < -37 || x > 31) return null; const a = fade(x, -37, 31); if (a <= 0.02) return null; const q = Math.floor(((t * 2.6) % 1) * 4); return { x, y: 2.6, key: q, q, alpha: a < 1 ? a : null }; },
    draw(g, st) { const w = RJ.who(5560, { carnaval: false }); RJ.person(g, 0, 0, 0, Object.assign(w, { top: w.skin, bikini: GOLD, bot: w.skin, shorts: true, dress: undefined, costeiro: [GOLD, WHITE, GOLD, PINK], costeiroR: 14, crown: GOLD, hairStyle: 'long', fem: true, dir: 0, pose: st.q % 2 ? 'cheer' : 'walk', ph: st.q / 4, glitter: GOLD })); RJ.lit(g, 0, 0.72); } });
  const DRUMS = ['tamborim', 'caixa', 'caixa', 'surdo', 'surdo'];
  DRUMS.forEach((d, r) => row(71 + r * 3.5, L4, mk((s) => ritmo(s, d), 5570 + r * 4, 4), { step: 'drum' }));
  for (let r = 0; r < 3; r++) row(91 + r * 3.5, L4, mk(ala2, 5600 + r * 4, 4), { step: 'samba' });
  RJ.floatActor(T, head, 104, LOOP / V, 'arara', { GREEN, PINK, GOLD, WHITE });
  for (let r = 0; r < 2; r++) row(128 + r * 3.5, L4, mk(ala3, 5620 + r * 4, 4), { step: 'samba' });
  row(137, L4, mk(pass, 5630, 4), { step: 'samba' });

  /* ---- the stand: a Mexican wave running down it, and every section jumping up as a float passes ---- */
  const SECW = 4.6, WAVEP = 9, sw = sh ? (sh.a / 30) : 0;
  for (let si = 0; si < 16; si++) {
    const xc = -37 + SECW * (si + 0.5), xa = xc - SECW / 2, xb = xc + SECW / 2;
    T.actor({ sample: 5, period: 30, grow: false,
      at(t) {
        const H = head(t), fl = [H - 16 - 9, H - 104 - 9].some((c) => Math.abs(c - xc) < 10);
        const wf = 40 - ((((t - sw) % WAVEP) + WAVEP) % WAVEP) * 12, wave = Math.abs(wf - xc) < 4.5;
        if (!fl && !wave) return null;
        const ph = Math.floor((t * 3) % 2);
        return { x: xc, y: Y0 - 0.5, key: ph, ph };
      },
      draw(g, st) {
        const arms = [], flags = [], ay = Y0 - 0.5;
        for (let i = 0; i < NT; i++) for (const s of SEATS[i]) {
          if (s.x < xa || s.x >= xb) continue;
          const p = g.p(s.x - xc, tierY(i) - 0.9 - ay, tierZ(i)), k = 0.92, up = st.ph ? 1 : 0;
          for (const sd of [-1, 1]) arms.push(p[0] + sd * 2.2 * k, p[1] - 3.8 * k, p[0] + sd * (3.3 + up * 0.6) * k, p[1] - (9.6 + up * 0.8) * k);
          if (h2(Math.round(s.x * 10), i) < 0.12) flags.push([p[0] + 3.4 * k, p[1] - 10 * k, s.w.top === PINK ? PINK : GREEN]);
        }
        g.segs2(arms, '#C08A5E', 1.1);
        for (const [x, y, c] of flags) g.fill2([[x, y], [x + 4.5, y + 0.6 + st.ph], [x, y + 3]], c, true);
        RJ.lit(g, 0, 0.6);
      } });
  }

  /* ---- night only (made last of all: RJ.late) ---- */
  RJ.late(-100, 100, (A) => {
    // phones held up and camera flashes twinkling all over the stand, a section at a time
    PIECES.forEach(([x0, x1], pi) => A.actor({ sample: 5, period: 30, grow: false,
      at(t) { if (!LOOK.night) return null; const f = Math.floor(t * 5) % 10; return { x: (x0 + x1) / 2, y: Y0 - 0.5, key: f, f }; },
      draw(g, st) {
        const xc = (x0 + x1) / 2, ay = Y0 - 0.5;
        for (let i = 0; i < NT; i++) for (const s of SEATS[i]) {
          if (s.x < x0 || s.x >= x1) continue;
          const hh = h2(Math.round(s.x * 10) + pi * 7, i * 13 + 5), p = g.p(s.x - xc, tierY(i) - 0.9 - ay, tierZ(i));
          if (hh < 0.07) { g.fill2([[p[0] + 1.6, p[1] - 9.6], [p[0] + 2.6, p[1] - 9.6], [p[0] + 2.6, p[1] - 7.8], [p[0] + 1.6, p[1] - 7.8]], 'rgba(255,255,255,0)'); g.mark({ nc: '#DCEEFF', light: true }); }
          else if (hh < 0.095 && h2(Math.round(s.x * 10), i * 31 + st.f) < 0.45) { g.disc2([p[0] + 1.8, p[1] - 8.4], 0.7, 'rgba(255,255,255,0)'); g.mark({ nc: '#FFFFFF', light: true }); }
        }
      } }));
    // fireworks over the Apoteose as a school enters the avenue: a few bursts that open, fall and fade
    const sh2 = SCENE.shots.find((q) => q.name === 'sambodromo'), T0 = sh2 ? sh2.a / 30 + 1.2 : 0, FP = 24;
    for (let k = 0; k < 3; k++) A.actor({ layer: 'top', sample: 5, period: FP, grow: false,
      at(t) { if (!LOOK.night) return null; const u = ((((t - T0 - k * 0.9) % FP) + FP) % FP) / 2.2; if (u >= 1) return null; const q = Math.floor(u * 11); return { x: 18 - k * 13, y: -15 + k * 3, z: 30 + k * 5, key: q, q }; },
      draw(g, st) {
        const c = g.p(0, 0, 0), u = (st.q + 0.5) / 11, R = 7 + 23 * Math.sqrt(u), fall = 7 * u * u, n = 18, col = ['#FFD45A', '#FF7AB0', '#9FF0C0'][k];
        for (let i = 0; i < n; i++) {
          const a = TAU * i / n + k * 0.4, e = [c[0] + Math.cos(a) * R, c[1] + Math.sin(a) * R * 0.9 + fall], m = [c[0] + Math.cos(a) * R * 0.72, c[1] + Math.sin(a) * R * 0.65 + fall * 0.7];
          g.fill2([[m[0], m[1] - 0.25], [e[0], e[1] - 0.25], [e[0], e[1] + 0.25], [m[0], m[1] + 0.25]], 'rgba(255,255,255,0)'); g.mark({ nc: u < 0.75 ? col : mix(col, '#2A2A40', (u - 0.75) * 2.4) });
          if (i % 2 === 0 && u < 0.8) { g.disc2(e, 0.55, 'rgba(255,255,255,0)'); g.mark({ nc: '#FFF6DC', light: true }); }
        }
      } });
  });
});

/* ---------------- parade helpers ---------------- */
/* a baiana: a white hooped skirt with the school's stripes turning as she spins, a lace hem, a turban, arms up */
RJ.baiana = function (g, x, y, w, sp, q) {
  const f = g.p(x, y, 0), R = 7.2, hip = [f[0], f[1] - 10.3];
  RJ.person(g, x, y, 0, Object.assign({}, w, { dir: sp < 3 ? 0 : 1, pose: 'cheer', ph: (q % 4) / 4, noLegs: true, top: '#F6F4EE', bare: true, turban: '#F6F4EE', dress: undefined, hairStyle: 'bun' }));
  const sk = [];
  for (let i = 0; i <= 16; i++) { const a = Math.PI * i / 16; sk.push([f[0] + Math.cos(a) * R, f[1] + Math.sin(a) * R * 0.32]); }
  const body = [[hip[0] - 2.4, hip[1]], [hip[0] + 2.4, hip[1]], [f[0] + R, f[1]]].concat(sk.slice(1, 16)).concat([[f[0] - R, f[1]]]);
  g.fill2(body, '#F6F4EE', true);
  // stripes running down the skirt, moving round as she turns
  const stripes = [];
  for (let k = 0; k < 6; k++) {
    const a = ((k / 6 + sp / 36) % 1) * Math.PI, c = Math.cos(a);
    const b = [f[0] + c * R, f[1] + Math.sin(a) * R * 0.32], t = [hip[0] + c * 2.4, hip[1]];
    stripes.push(t[0], t[1], b[0], b[1]);
  }
  g.segs2(stripes, '#2E9A5E', 1.1);
  g.fill2(sk.map((p) => [p[0], p[1]]).concat(sk.slice().reverse().map((p) => [f[0] + (p[0] - f[0]) * 0.94, p[1] - 1.4])), '#EC7DAA', true);
  g.line2(body.concat([body[0]]), { w: 0.4, c: '#8C8576', boil: false });
};
/* the porta-bandeira: a wide gown spinning, the school's flag on its pole held high */
RJ.portaBandeira = function (g, x, y, w, sp, c1, c2, gold) {
  const f = g.p(x, y, 0), R = 6.2, hip = [f[0], f[1] - 10.3], a0 = sp / 8 * TAU;
  const r = RJ.person(g, x, y, 0, Object.assign({}, w, { dir: sp < 4 ? 0 : 1, pose: 'stand', noLegs: true, hands: [[1.2, -19.6], [2.8, -26]] }));
  const sk = [[hip[0] - 2.2, hip[1]], [hip[0] + 2.2, hip[1]]];
  for (let i = 0; i <= 14; i++) { const a = Math.PI * i / 14; sk.push([f[0] + Math.cos(a) * R * (1 + 0.12 * Math.sin(a * 3 + a0)), f[1] + Math.sin(a) * R * 0.32]); }
  g.fill2([[hip[0] + 2.2, hip[1]]].concat(sk.slice(2)).concat([[hip[0] - 2.2, hip[1]]]), c2, true);
  const st = []; for (let k = 0; k < 5; k++) { const a = ((k / 5 + sp / 40) % 1) * Math.PI, c = Math.cos(a); st.push(hip[0] + c * 2.2, hip[1], f[0] + c * R, f[1] + Math.sin(a) * R * 0.32); }
  g.segs2(st, gold, 0.8);
  g.line2([[hip[0] + 2.2, hip[1]]].concat(sk.slice(2)).concat([[hip[0] - 2.2, hip[1]]]), { w: 0.4, c: shade(c2, 0.5), boil: false });
  // the flag: a pole from her hands, the cloth waving
  const h = r.hands[1], top = [h[0] + 1.5, h[1] - 9];
  g.line2([[h[0] - 0.4, h[1] + 3], top], { w: 0.5, c: '#6E5A44', boil: false, ext: 0 });
  const wv = (u) => Math.sin(u * 3 + a0) * 1.2 * u, W = 11, H = 7, cl = [];
  for (let k = 0; k <= 6; k++) cl.push([top[0] + W * k / 6, top[1] + 1 + wv(k / 6)]);
  for (let k = 6; k >= 0; k--) cl.push([top[0] + W * k / 6, top[1] + 1 + H + wv(k / 6)]);
  g.fill2(cl, c1, true);
  g.disc2([top[0] + W * 0.5, top[1] + 1 + H * 0.5 + wv(0.5)], 2.2, '#F6F4EE'); g.disc2([top[0] + W * 0.5, top[1] + 1 + H * 0.5 + wv(0.5)], 1.2, gold);
  g.line2(cl, { w: 0.35, c: shade(c1, 0.5), close: true, boil: false });
};
/* a float (carro alegórico) on the parade's clock, anchored at its front near corner. kind 'sun': a tiered stage with
   destaques in front of a giant crowned golden sun whose rays turn; 'arara': a giant macaw beating its wings. */
RJ.floatActor = function (T, head, s, period, kind, P) {
  const HL = 9, HW = 4.6, Y = 2.2;
  const looks = []; for (let i = 0; i < 6; i++) { const w = RJ.who(5700 + i * 7 + (kind === 'sun' ? 0 : 50), { carnaval: false }); Object.assign(w, { top: i % 2 ? P.GOLD : w.skin, bikini: i % 2 ? undefined : P.GOLD, bot: i % 2 ? P.GREEN : w.skin, shorts: true, dress: undefined, costeiro: [P.GOLD, P.PINK, P.WHITE, P.GREEN, P.GOLD], costeiroR: 11 + (i % 3) * 2, crown: P.GOLD, fem: !(i % 2), hairStyle: i % 2 ? 'short' : 'long' }); looks.push(w); }
  T.actor({ sample: 0.25, period, grow: false,
    at(t) {
      const xf = head(t) - s; if (xf < -37 || xf > 31) return null;
      const a = clamp(Math.min((xf + 37) / 16, (31 - xf) / 10), 0, 1); if (a <= 0.02) return null;
      const q = Math.floor(((t * 1.5) % 1) * 6), d = Math.floor(((t * 2.4) % 2) * 2);
      return { x: xf, y: Y + HW, key: q + '.' + d, q, d, alpha: a < 1 ? a : null };
    },
    draw(g, st) {
      const cx = -HL, cy = -HW, C = (u, v, z) => [cx + u, cy + v, z];
      // the chassis skirt, decorated in the school's colours
      K.box(g, cx - HL, cy - HW, cx + HL, cy + HW, 0, 2.2, { t: '#E9E2CC', l: P.GREEN, r: shade(P.GREEN, 0.15) }, { w: 0.8 });
      const sc = []; for (let u = -HL + 1; u < HL; u += 2) { const a = g.p.apply(g, C(u, HW + 0.03, 0.4)), b = g.p.apply(g, C(u + 1, HW + 0.03, 1.8)); sc.push(a[0], a[1], b[0], b[1]); } g.segs2(sc, P.GOLD, 0.6);
      g.fill([C(-HL, HW + 0.04, 1.8), C(HL, HW + 0.04, 1.8), C(HL, HW + 0.04, 2.2), C(-HL, HW + 0.04, 2.2)], P.GOLD);
      if (kind === 'sun') {
        // the sun at the back: a golden disc facing the near side, its rays turning, a crown on top
        const sc_ = C(-HL + 4.5, 0, 9.5), R = 5.2, rays = [], rot = st.q / 6 * (TAU / 12);
        for (let i = 0; i < 12; i++) { const a = rot + TAU * i / 12, b = a + 0.16, c = a - 0.16; rays.push([sc_[0] + Math.cos(a) * R * 1.75, 0, sc_[2] + Math.sin(a) * R * 1.75], [sc_[0] + Math.cos(b) * R * 0.9, 0, sc_[2] + Math.sin(b) * R * 0.9], [sc_[0] + Math.cos(c) * R * 0.9, 0, sc_[2] + Math.sin(c) * R * 0.9]); }
        for (let i = 0; i < 12; i++) { const tri = rays.slice(i * 3, i * 3 + 3).map((p) => [p[0], cy, p[2]]); g.fill(tri, i % 2 ? '#F2C94E' : '#E39A2A'); g.mark({ nc: i % 2 ? '#FFD45A' : '#FFA838' }); g.outline(tri, { w: 0.4, c: '#9A6A1E', boil: false }); }
        const disc = []; for (let i = 0; i < 24; i++) { const a = TAU * i / 24; disc.push([sc_[0] + Math.cos(a) * R, cy, sc_[2] + Math.sin(a) * R]); }
        g.fill(disc, '#F2C94E'); g.mark({ nc: '#FFD45A', light: true }); g.outline(disc, { w: 0.8, c: '#9A6A1E', boil: false });   // (night: the sun shines)
        const fc = g.p(sc_[0], cy, sc_[2]); g.disc2([fc[0] - 3.2, fc[1] - 2], 0.9, '#7A4A1E'); g.disc2([fc[0] + 3.4, fc[1] + 1.6], 0.9, '#7A4A1E');
        g.line2(arcPts(fc[0] + 0.3, fc[1] + 1, 5, 0.4, 2.0, 6), { w: 0.6, c: '#7A4A1E', boil: false });
        const ct = g.p(sc_[0], cy, sc_[2] + R + 0.4); g.fill2([[ct[0] - 6, ct[1] + 1], [ct[0] + 6, ct[1] + 1], [ct[0] + 7, ct[1] - 6], [ct[0] + 3, ct[1] - 2.5], [ct[0], ct[1] - 8], [ct[0] - 3, ct[1] - 2.5], [ct[0] - 7, ct[1] - 6]], P.GOLD, true);
        g.line2([[ct[0] - 6, ct[1] + 1], [ct[0] - 7, ct[1] - 6], [ct[0] - 3, ct[1] - 2.5], [ct[0], ct[1] - 8], [ct[0] + 3, ct[1] - 2.5], [ct[0] + 7, ct[1] - 6], [ct[0] + 6, ct[1] + 1]], { w: 0.5, c: '#9A6A1E', boil: false });
        for (const dx of [-3, 0, 3]) g.disc2([ct[0] + dx, ct[1] - 1], 0.8, dx ? P.PINK : P.GREEN);
      } else {
        // the macaw: body and head at the back, wings beating up and down
        const b = C(-HL + 5, 0, 6), up = st.q % 3, wy = [3.5, 1.0, -1.6][up];
        const P3 = (u, z) => g.p(b[0] + u, cy, b[2] + z);
        for (const sd of [-1, 1]) { const wing = [P3(0, 4), P3(sd * 9, 6 + wy * 2), P3(sd * 11, 3 + wy * 2.4), P3(sd * 8, 1 + wy), P3(sd * 2, 1.5)]; g.fill2(wing, sd < 0 ? '#2F6DB5' : '#3A86D0', true); g.fill2(wing.slice(1, 4), '#F2C94E', true); g.line2(wing.concat([wing[0]]), { w: 0.5, c: '#1F3F6F', boil: false }); }
        const body = [P3(-2, 0), P3(2, 0), P3(2.6, 6), P3(1.5, 10), P3(-1.5, 10), P3(-2.4, 5)]; g.fill2(body, '#D9302B', true); g.line2(body.concat([body[0]]), { w: 0.6, c: '#7A1F1A', boil: false });
        const hd = P3(0.5, 11.6); g.disc2(hd, 3.6, '#D9302B'); g.fill2([[hd[0] + 2, hd[1] - 0.5], [hd[0] + 6, hd[1] + 1.5], [hd[0] + 2.4, hd[1] + 3.2]], '#3A3530', true); g.disc2([hd[0] - 1.6, hd[1] - 0.6], 1.2, '#F6F4EE'); g.disc2([hd[0] - 1.6, hd[1] - 0.6], 0.5, '#2A2622');
        const tl = [P3(-0.5, 0), P3(0.8, 0), P3(0.4, -5), P3(-0.8, -5)]; void tl;
      }
      // the stage: two tiers with destaques in feathers, dancers on the deck in front
      K.box(g, cx - 2, cy - 3.4, cx + 4, cy + 3.4, 2.2, 4.4, { t: P.PINK, l: shade(P.PINK, 0.05), r: shade(P.PINK, 0.18) }, { w: 0.6 });
      K.box(g, cx - 1, cy - 2.0, cx + 2.4, cy + 2.0, 4.4, 6.6, { t: P.GOLD, l: shade(P.GOLD, 0.05), r: shade(P.GOLD, 0.18) }, { w: 0.6 });
      RJ.person(g, cx + 0.7, cy, 6.6, Object.assign({}, looks[0], { dir: 0, pose: st.d ? 'cheer' : 'wave', ph: 0.25 }));
      RJ.person(g, cx + 2.6, cy - 2.2, 4.4, Object.assign({}, looks[1], { dir: 0, pose: 'wave', ph: st.d * 0.5 }));
      RJ.person(g, cx + 2.6, cy + 2.2, 4.4, Object.assign({}, looks[2], { dir: 0, pose: 'cheer', ph: st.d * 0.5 }));
      for (let i = 0; i < 3; i++) RJ.person(g, cx + 6.5, cy - 3 + i * 3, 2.2, Object.assign({}, looks[3 + i], { dir: 0, pose: (i + st.d) % 2 ? 'cheer' : 'walk', ph: st.d * 0.5, costeiro: undefined }));
      // at night the float is a blaze of light: everything lit, bulbs along its gold skirt (clear by day), the colours kept
      RJ.lit(g, 0, 0.74);
      for (let k = 0; k < 7; k++) { const u = -HL + 1.3 + k * (2 * HL - 2.6) / 6; RJ.navLight(g, g.p.apply(g, C(u, HW + 0.06, 2.0)), k % 2 ? '#FFE9A0' : '#FFF6DC', 0.42); }
    } });
};
