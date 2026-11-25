'use strict';
/* (-100,0) Meiji Jingū and a corner of Yoyogi Park. The gravel approach runs in from the near left (+y) through the
   shrine forest, a hundred thousand trees planted by hand in 1920: under the first torii, past the wall of sake
   barrels given by the brewers (and, across the path, the Burgundy wine barrels, whose backs we see), under the great
   torii of 1,500-year-old cypress, the largest wooden torii of its kind, to the south gate (Minami Shinmon) of the
   inner courtyard. In the courtyard: the worship hall of plain cypress under its green copper roof, the husband-and-wife
   camphors tied with a straw rope, the wall of ema, the wedding procession walking slowly round the gravel (the priest
   and the shrine maiden first, the bride in her white wataboshi under a big red parasol held by an attendant, the
   groom, the families). At the New Year a crowd waits instead to pray. In Yoyogi's corner the rockabilly dancers twist
   round their radio, joggers and a dog go round, children play. */
SF.tile('meiji', -100, 0, { rim: 6 }, function (T) {
  const H = 37, M = -12, GRAV = '#ECE5D2', COPPER = '#6FA38E', CYP = { t: '#D9C19C', l: '#CDAE86', r: '#B39470' }, POST = '#9A7A56';
  const STONE = { t: '#E3DED2', l: '#D9D4C8', r: '#C3BEB1' }, WHITE = { t: '#EFEADD', l: '#F6F2E8', r: '#E3DCCB' };
  const LIT = { nc: (c) => mix(nightColour(c), c, 0.3) };

  /* ---------------- helpers ---------------- */
  const trim = (g, x0, y0, x1, y1, z, ov, lift, th) => {
    th = th || 0.4; const X0 = x0 - ov, X1 = x1 + ov, Y0 = y0 - ov, Y1 = y1 + ov, N = 12;
    const side = (a0, b0, a1, b1) => { const top = [], bot = []; for (let i = 0; i <= N; i++) { const t = i / N, zz = z + lift * Math.pow(Math.abs(2 * t - 1), 2.4), x = lerp(a0, a1, t), y = lerp(b0, b1, t); top.push([x, y, zz]); bot.push([x, y, zz - th]); } g.fill(top.concat(bot.slice().reverse()), '#E9E2CF'); g.line(bot, { w: 0.4, c: '#3A3530', boil: false }); };
    side(X0, Y1, X1, Y1); side(X1, Y1, X1, Y0);
  };
  const roof = (g, x0, y0, x1, y1, z, h, o) => { TK.roof(g, x0, y0, x1, y1, z, h, Object.assign({ col: COPPER, tc: '#4F8070', sp: 0.8, w: 0.9, end: '#CDAE86' }, o)); trim(g, x0, y0, x1, y1, z, o.over == null ? 2 : o.over, o.lift == null ? 0.9 : o.lift, o.th); };
  // a cypress wall on its two visible faces: posts, a tie beam, white plaster above it
  const cyp = (g, x0, y0, x1, y1, z0, z1, o) => {
    o = o || {}; K.box(g, x0, y0, x1, y1, z0, z1, CYP, { w: o.w || 0.85 });
    const s = [];
    for (const [f, p, a0, a1, k] of [['L', y1, x0, x1, 0], ['R', x1, y0, y1, 1]]) {
      if (o.faces && o.faces.indexOf(f) < 0) continue;
      const n = Math.max(1, Math.round((a1 - a0) / (o.bay || 3))), bw = (a1 - a0) / n, hz = z1 - z0;
      g.fill(K.on(f, p + 0.03, a0, a1, z1 - hz * 0.24, z1), k ? '#E3DCCB' : '#F3EFE4');
      for (let i = 0; i <= n; i++) { const a = a0 + i * bw; g.fill(K.on(f, p + 0.04, a - 0.25, a + 0.25, z0, z1), POST); }
      g.fill(K.on(f, p + 0.05, a0, a1, z1 - hz * 0.26, z1 - hz * 0.2), POST);
      for (let i = 0; i < n; i++) for (let j = 1; j < 4; j++) { const a = a0 + i * bw + bw * j / 4, q0 = g.p.apply(g, K.pt(f, p + 0.04, a, z0 + 0.3)), q1 = g.p.apply(g, K.pt(f, p + 0.04, a, z1 - hz * 0.27)); s.push(q0[0], q0[1], q1[0], q1[1]); }
    }
    g.segs2(s, '#A88A64', 0.28);
  };
  const route = (pts) => { const seg = [], L = [0]; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); } return { seg, L, total: L[L.length - 1] }; };
  const at = (R, d) => { d = ((d % R.total) + R.total) % R.total; let i = 0; while (i < R.seg.length - 1 && d > R.L[i + 1]) i++; const [a, b] = R.seg[i], u = (d - R.L[i]) / ((R.L[i + 1] - R.L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return { x: a[0] + dx * u, y: a[1] + dy * u, dir: Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ux: dx / l, uy: dy / l }; };
  // a person in one place going through a round of acts: seq [[act, secs, dir], ...]; act: a TK.ACTS name or
  // { n, rate, f(i) -> pose overrides, extra(g, r, i) }
  const busy = (who, x, y, seq, o) => {
    o = o || {}; const period = seq.reduce((s, q) => s + q[1], 0);
    return T.actor({ sample: 0.25, period, season: o.season, r: o.r || 12,
      at(t) { t = ((t + (o.off || 0)) % period + period) % period; let k = 0, s = 0; while (k < seq.length - 1 && t >= s + seq[k][1]) { s += seq[k][1]; k++; } const a = seq[k][0], A2 = typeof a === 'string' ? TK.ACTS[a] : a, i = Math.floor((t - s) * A2.rate) % A2.n; return { x: x + (o.dx ? o.dx(t) : 0), y, z: o.z || 0, key: k + '.' + i, k, i }; },
      draw(g, st) { const [a, , dir] = seq[st.k], w = Object.assign({}, who, dir == null ? {} : { dir }); let r; if (typeof a === 'string') r = TK.doing(g, w, a, st.i); else { r = TK.person(g, 0, 0, 0, Object.assign(w, a.f(st.i))); if (a.extra) a.extra(g, r, st.i); } if (o.after) o.after(g, r, st); } });
  };
  // someone walking a closed route who stops on the way: stops [[distance, [[act, secs], ...], facing], ...]
  const pilgrim = (who, pts, speed, stops, o) => {
    o = o || {}; const R = route(pts), ev = []; let t = 0, d = 0;
    for (const [sd, acts, face] of stops) { t += (sd - d) / speed; const secs = acts.reduce((s, q) => s + q[1], 0); ev.push({ t0: t, t1: t + secs, d: sd, acts, face }); t += secs; d = sd; }
    const period = t + (R.total - d) / speed;
    return T.actor({ sample: 0.25, period, season: o.season, r: 14,
      at(tt) {
        tt = ((tt + (o.phase || 0) * period) % period + period) % period;
        let dd = null, tp = 0, dp = 0;
        for (const [j, e] of ev.entries()) {
          if (tt < e.t0) { dd = dp + (tt - tp) * speed; break; }
          if (tt < e.t1) { const p = at(R, e.d); let s = e.t0, k = 0; while (k < e.acts.length - 1 && tt >= s + e.acts[k][1]) { s += e.acts[k][1]; k++; } const a = e.acts[k][0], A2 = TK.ACTS[a], i = Math.floor((tt - s) * A2.rate) % A2.n; return { x: p.x, y: p.y, key: j + '.' + k + '.' + i, a, i, dir: e.face }; }
          tp = e.t1; dp = e.d;
        }
        if (dd == null) dd = dp + (tt - tp) * speed;
        const p = at(R, dd), ph = Math.floor((dd / 2.4) % 1 * 8);
        return { x: p.x, y: p.y, key: 'w' + p.dir + '.' + ph, dir: p.dir, ph: ph / 8 };
      },
      draw(g, st) { if (st.a) TK.doing(g, Object.assign({}, who, { dir: st.dir }), st.a, st.i); else TK.person(g, 0, 0, 0, Object.assign({}, who, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
  };

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    K.slab(g, H, { top: '#95B16B' });
    // the forest floor: moss and leaf litter in the shade
    g.grass(K.rect(-H, -H, H, H), { dens: 0.5, c: '#5E7A45' });
    g.scuff(K.rect(-H, -H, H, H), { dir: 0.6, len: 1.4, c: '#7E9A5A', dens: 0.6, w: 0.5, spread: 2 });
    // the inner courtyard's white gravel
    g.fill(K.rect(-36, -37, 16, -4.4), GRAV); g.scuff(K.rect(-36, -37, 16, -4.4), { dir: -0.35, len: 2.4, c: '#DAD0B8', dens: 0.9, w: 0.45, spread: 1.0 });
    // the approach: wide gravel with a kerb of stone on either side
    g.fill(K.rect(M - 4.2, -4.4, M + 4.2, H), GRAV); g.scuff(K.rect(M - 4.2, -4.4, M + 4.2, H), { dir: Math.atan2(-AY, AX), len: 3, c: '#DAD0B8', dens: 0.9, w: 0.45, spread: 0.08 });
    for (const x of [M - 4.2, M + 4.2]) g.line([[x, -4.4, 0], [x, H, 0]], { w: 0.5, c: '#B9AE96', boil: false });
    // Yoyogi's lawn in the near corner, its path, the paved spot where the dancers meet
    const lawn = K.curve([[14, 14, 0], [26, 11, 0], [37, 12, 0], [37, 37, 0], [10, 37, 0], [8.5, 26, 0]], 4, true);
    g.fill(lawn, '#B5CF8E'); g.grass(lawn, { dens: 0.8 });
    const loop = []; for (let i = 0; i <= 40; i++) { const a = TAU * i / 40; loop.push([24 + Math.cos(a) * 9.5, 25 + Math.sin(a) * 8, 0]); }
    const loop2 = []; for (let i = 0; i <= 40; i++) { const a = TAU * i / 40; loop2.push([24 + Math.cos(a) * 7.8, 25 + Math.sin(a) * 6.4, 0]); }
    g.fill(loop, '#E9DDBA'); g.fill(loop2, '#B5CF8E'); g.grass(loop2, { dens: 0.7 });
    g.line(loop, { w: 0.5, c: '#C9B98C', close: true, boil: false }); g.line(loop2, { w: 0.5, c: '#C9B98C', close: true, boil: false });
    g.fill(K.rect(14, 5.5, 31, 13), '#E2DCCD'); g.outline(K.rect(14, 5.5, 31, 13), { w: 0.45, c: '#B9B1A0', boil: false });
    g.fill(K.rect(-3.6, 8.5, 8, 10.5), '#E2DCCD');
  }, { rim: true });

  /* ---------------- the inner courtyard ---------------- */
  // the cloister (kairō): a corridor of cypress under a copper roof; we see its outer wall, with lattice windows
  const kairo = (x0, y0, x1, y1, ridge) => T.obj([x0, y0, x1, y1], function (g) {
    g.lit(LIT, () => {
      K.box(g, x0, y0, x1, y1, 0, 4.4, WHITE, { w: 0.75 });
      for (const [f, p, a0, a1] of [['L', y1, x0, x1], ['R', x1, y0, y1]]) {
        if ((f === 'L' && ridge === 'y') || (f === 'R' && ridge === 'x')) continue;
        const n = Math.max(1, Math.round((a1 - a0) / 3)), bw = (a1 - a0) / n, s = [];
        for (let i = 0; i <= n; i++) { const a = a0 + i * bw; g.fill(K.on(f, p + 0.03, a - 0.22, a + 0.22, 0, 4.4), POST); }
        for (let i = 0; i < n; i++) { const q = K.on(f, p + 0.03, a0 + i * bw + 0.8, a0 + (i + 1) * bw - 0.8, 1.8, 3.4); g.fill(q, '#8A7A5A'); for (let j = 1; j < 6; j++) { const a = lerp(a0 + i * bw + 0.8, a0 + (i + 1) * bw - 0.8, j / 6), q0 = g.p.apply(g, K.pt(f, p + 0.05, a, 1.8)), q1 = g.p.apply(g, K.pt(f, p + 0.05, a, 3.4)); s.push(q0[0], q0[1], q1[0], q1[1]); } }
        g.segs2(s, '#D9C9A8', 0.35); g.fill(K.on(f, p + 0.04, a0, a1, 0, 0.5), '#B9B3A5');
      }
      roof(g, x0, y0, x1, y1, 4.4, 1.7, { over: 0.8, lift: 0.25, ridge, sp: 0.75, th: 0.25 });
    });
  }, { name: 'kairo' });
  kairo(-36.6, -37, -34.6, -4.4, 'y'); kairo(14, -37, 16, -4.4, 'y');
  kairo(-34.6, -6.4, -18, -4.4, 'x'); kairo(-6, -6.4, 14, -4.4, 'x');
  // the worship hall (haiden): plain cypress on a stone base, white curtains in the open front, a deep copper roof with a
  // porch roof sweeping out over the steps
  T.obj([-31, -37, 7, -22.4], function (g) {
    g.boilP = 0.3;
    g.lit(LIT, () => {
      K.box(g, -31, -36.4, 7, -24.6, 0, 1.2, STONE, { w: 0.85 });
      for (let i = 0; i < 3; i++) K.box(g, M - 5, -24.6, M + 5, -24.6 + 0.75 * (3 - i), 0, 0.4 * (i + 1), STONE, { w: 0.45, boil: false });
      cyp(g, -29.5, -35.6, 5.5, -26.4, 1.2, 9.4, { bay: 3.5 });
      // the open front: white curtains with the purple band at the top, the dark hall behind
      g.fill(K.on('L', -26.35, M - 7, M + 7, 1.2, 7.2), '#4A3A30');
      for (let i = 0; i < 4; i++) { const a0 = M - 7 + i * 3.5, q = K.on('L', -26.3, a0 + 0.2, a0 + 3.3, 4.2, 7.2); g.fill(q, '#F6F3EA'); g.mark({ nc: '#FFF1D0' }); g.fill(K.on('L', -26.28, a0 + 0.2, a0 + 3.3, 6.6, 7.2), '#6B4A8A'); g.outline(q, { w: 0.3, c: '#8C8576', boil: false }); }
      // the porch: posts and a gilded box of offerings
      for (const x of [M - 5, M - 1.7, M + 1.7, M + 5]) K.box(g, x - 0.28, -24.9, x + 0.28, -24.3, 1.2, 8.0, { t: '#C9A880', l: POST, r: '#8A6A4A' }, { w: 0.45, nohid: true });
      K.box(g, M - 3.4, -25.6, M + 3.4, -24.9, 1.2, 2.9, { t: '#B08E66', l: '#C9A880', r: '#9A7A56' }, { w: 0.55 });
      const s = []; for (let x = M - 3.1; x < M + 3.4; x += 0.42) { const a = g.p(x, -25.6, 2.92), b = g.p(x, -24.9, 2.92); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#6E5040', 0.35);
      const cr = g.p(M, -24.85, 2.05); g.disc2(cr, 1.6, '#D9B04F'); g.ring2(cr, 1.6, { w: 0.35, c: '#7A5A2A' });   // the chrysanthemum crest
      K.box(g, -30.2, -36.3, 6.2, -25.7, 9.4, 10.2, { t: '#B39470', l: '#C9A880', r: '#A08060' }, { w: 0.5 });
      roof(g, -30.2, -36.3, 6.2, -25.7, 10.2, 10.5, { gable: 0.4, over: 3.0, lift: 1.4, ridge: 'x', th: 0.45 });
      roof(g, M - 5.6, -25.4, M + 5.6, -24.0, 8.0, 1.8, { over: 1.0, lift: 0.7, ridge: 'x', tiles: true, gable: 0.4, th: 0.35 });   // the porch roof (kōhai)
      const ch = g.p(6.2 + 3.0, -31, 10.2 + 10.5 * 0.6 + 1.3); g.disc2(ch, 1.5, '#D9B04F'); g.ring2(ch, 1.5, { w: 0.35, c: '#7A5A2A' });
    });
  }, { name: 'shrine hall' });
  // the south gate (Minami Shinmon): cypress posts, closed side bays, a copper roof
  T.obj([-18, -6.6, -6, -4.0], function (g) {
    g.lit(LIT, () => {
      K.box(g, -18, -6.6, -6, -4.0, 0, 0.5, STONE, { w: 0.6 });
      cyp(g, -18, -6.4, -15, -4.2, 0.5, 7.4, { bay: 3, faces: 'L' });
      for (const x of [-15, -9]) K.box(g, x - 0.35, -6.5, x + 0.35, -5.8, 0, 7.4, { t: '#C9A880', l: POST, r: '#8A6A4A' }, { w: 0.5, nohid: true });
      cyp(g, -9, -6.4, -6, -4.2, 0.5, 7.4, { bay: 3 });
      for (const x of [-18, -15, -9, -6]) K.box(g, x - 0.35, -4.5, x + 0.35, -3.8, 0, 7.4, { t: '#C9A880', l: POST, r: '#8A6A4A' }, { w: 0.5, nohid: true });
      K.box(g, -18.3, -4.6, -5.7, -3.9, 6.6, 7.4, { t: '#C9A880', l: '#CDAE86', r: '#9A7A56' }, { w: 0.5 });
      roof(g, -18.3, -6.7, -5.7, -3.9, 7.6, 5.2, { gable: 0.42, over: 1.8, lift: 0.9, ridge: 'x', th: 0.4 });
    });
    const c = g.p(M, -4.0, 6.0); g.disc2(c, 1.4, '#D9B04F'); g.ring2(c, 1.4, { w: 0.35, c: '#7A5A2A' });
  }, { name: 'south gate', under: 5.8 });
  // the husband-and-wife camphors, a straw rope with white paper streamers between them
  T.obj([-28, -15], (g) => K.tree(g, -28, -15, { r: 5.6, h: 7.5, col: '#5E8A4A', ink: '#3C5A30' }), { on: true });
  T.obj([-21.5, -13], (g) => K.tree(g, -21.5, -13, { r: 5.0, h: 7.0, col: '#6E9A50', ink: '#3C5A30' }), { on: true });
  T.obj([-27, -16, -22, -12.5], (g) => { const a = g.p(-27.4, -14.6, 4.2), b = g.p(-22.0, -12.8, 4.0); const pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t) + 2.6 * 4 * t * (1 - t)]); } g.line2(pts, { w: 1.3, c: '#D9C68A', boil: false }); for (let k = 1; k < 5; k++) { const p = pts[k * 2]; g.fill2([[p[0] - 0.5, p[1]], [p[0] + 0.5, p[1]], [p[0] + 0.3, p[1] + 2.8], [p[0] - 0.3, p[1] + 2.8]], '#F6F3EA', true); } }, { name: 'rope', bias: 2 });
  // the wall of ema: hundreds of little wooden plaques with wishes, round a sacred tree; the table where they are written
  T.obj([7.5, -22.6, 14, -21.4], function (g) {
    const x0 = 7.6, x1 = 13.8, y0 = -22.5, y1 = -21.5;
    K.box(g, x0, y0, x1, y1, 0, 4.4, { t: '#C9A26B', l: '#B58F58', r: '#A07C4C' }, { w: 0.6 });
    const R = RNG(9), s = [];
    for (let r = 0; r < 4; r++) for (let k = 0; k < 9; k++) { const p = g.p(x0 + 0.5 + k * 0.66 + (R() - 0.5) * 0.15, y1 + 0.05, 0.9 + r * 0.85); g.fill2([[p[0] - 0.85, p[1]], [p[0] + 0.85, p[1]], [p[0] + 0.85, p[1] - 1.4], [p[0], p[1] - 1.9], [p[0] - 0.85, p[1] - 1.4]], R() < 0.15 ? '#F3E3C0' : '#E9D3A6', true); s.push(p[0] - 0.5, p[1] - 0.7, p[0] + 0.4, p[1] - 0.9); }
    g.segs2(s, '#8A5A3A', 0.3);
    TK.roof(g, x0, y0, x1, y1, 4.4, 1.0, { over: 0.5, lift: 0.1, col: '#6E5A44', tiles: false, ridge: 'x' });
  }, { name: 'ema' });
  T.obj([11, -26], (g) => K.tree(g, 11, -26, { r: 4.4, h: 7.5, col: '#5E8A4A', ink: '#3C5A30' }), { on: true });
  T.obj([10.9 - 3.05, -20.4, 10.9 + 3.05, -19.6], (g) => {   // fp lengthened to sort as a box (as a small prop it stood in front of the writer at its left end)
    K.box(g, 8.4, -20.4, 13.4, -19.6, 0, 2.6, { t: '#C9A880', l: '#B39470', r: '#9A7A56' }, { w: 0.55 }); const s = []; for (let k = 0; k < 5; k++) { const p = g.p(8.9 + k * 0.95, -20.0, 2.62); s.push(p[0] - 0.8, p[1], p[0] + 0.8, p[1] - 0.5); } g.segs2(s, '#E9D3A6', 0.9); }, { name: 'ema table' });
  // the juyosho, where amulets are sold, along the courtyard's west side
  T.obj([-34.4, -24, -30.6, -9], function (g) {
    g.lit(LIT, () => {
      cyp(g, -34.4, -24, -30.8, -9, 0, 5.2, { bay: 3, faces: 'R' });
      g.fill(K.on('R', -30.77, -22.6, -10.4, 1.6, 4.2), '#E9D3A6'); g.mark({ nc: '#FFE3A6' });
      const s = []; for (let y = -22.6; y < -10.4; y += 1.2) { const a = g.p(-30.74, y, 1.6), b = g.p(-30.74, y, 4.2); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#8A6A4A', 0.3);
      K.box(g, -30.8, -22.8, -30.0, -10.2, 0, 1.5, { t: '#C9A880', l: '#B39470', r: '#9A7A56' }, { w: 0.5 });
      roof(g, -34.4, -24, -30.8, -9, 5.2, 2.0, { over: 0.9, lift: 0.3, ridge: 'y', sp: 0.75, th: 0.3 });
    });
  }, { name: 'juyosho' });
  // two big bronze lanterns at the gate
  for (const x of [-20, -4]) T.obj([x, -2.6], (g) => {
    const y = -2.6; K.box(g, x - 1.0, y - 1.0, x + 1.0, y + 1.0, 0, 1.0, STONE, { w: 0.5, nohid: true });
    K.cyl(g, x, y, 0.45, 1.0, 4.0, { t: '#7E8A72', l: '#6E7A64', r: '#5A6452' }, { w: 0.5, n: 8 });
    K.box(g, x - 0.8, y - 0.8, x + 0.8, y + 0.8, 4.0, 5.6, { t: '#7E8A72', l: '#6E7A64', r: '#5A6452' }, { w: 0.5, nohid: true });
    for (const [f, p] of [['L', y + 0.8], ['R', x + 0.8]]) { g.fill(K.on(f, p + 0.02, (f === 'L' ? x : y) - 0.45, (f === 'L' ? x : y) + 0.45, 4.3, 5.3), '#E9D3A6'); g.mark({ nc: '#FFD28A', light: true }); }
    g.glow('lantern', x, y, 4.8, { r: 2.6, col: '#FFD28A' });
    K.hip(g, x - 1.3, y - 1.3, x + 1.3, y + 1.3, 5.6, 1.4, '#5E7A6A', { w: 0.5 });
  }, { name: 'bronze lantern' });

  /* ---------------- the approach ---------------- */
  // the great torii: two cypress pillars a metre and more thick, the long curved kasagi, the tie beam through the pillars
  T.obj([M - 9.3, 6.8, M + 9.3, 9.2], (g) => g.lit(LIT, () => TK.torii(g, M, 8, { w: 13.6, h: 21, axis: 'x', col: '#A8957A', top: '#8E7C64', r: 1.1 })), { name: 'great torii', under: 15 });
  T.obj([M - 6.9, 31.5, M + 6.9, 33.0], (g) => g.lit(LIT, () => TK.torii(g, M, 32.2, { w: 8.8, h: 12, axis: 'x', col: '#A8957A', top: '#8E7C64', r: 0.65 })), { name: 'first torii', under: 9 });
  // the sake barrels, given every year by the brewers' association: straw-wrapped komodaru stacked on a stepped rack,
  // each with its brewer's painted label
  const LABEL = [['#F6F1E4', '#C9463E', 'disc'], ['#F3EAD0', '#2F5FA8', 'band'], ['#2E2A26', '#D9B04F', 'ring'], ['#F6F1E4', '#2E2A26', 'word'], ['#E9C46A', '#C9463E', 'word'], ['#C9463E', '#F6F3EA', 'word'], ['#F3EAD0', '#3F7F5A', 'wave'], ['#F6F1E4', '#7A3B6B', 'band']];
  T.obj([-24.6, 14.2, -20.2, 33.8], function (g) {
    const xf = -20.4, y0 = 14.4, y1 = 33.6, tiers = 4, step = 1.0, R = RNG(4), DZ = 2.5;
    K.box(g, -24.6, y0, -24.0, y1, 0, tiers * DZ + 0.6, { t: '#A07C4C', l: '#B58F58', r: '#8A6A44' }, { w: 0.5 });
    for (let k = 0; k < tiers; k++) K.box(g, -24.0, y0, xf - k * step, y1, k * DZ, k * DZ + 0.35, { t: '#B58F58', l: '#A07C4C', r: '#8A6A44' }, { w: 0.45 });
    for (let k = 0; k < tiers; k++) {
      const z = k * DZ + 0.35, x = xf - k * step - 0.55, n = 10;
      for (let i = n - 1; i >= 0; i--) {
        const y = y0 + 0.8 + i * (y1 - y0 - 1.6) / (n - 1), c = g.p(x, y, z), lb = LABEL[Math.floor(R() * LABEL.length)];
        const w = 3.3, h = 7.0, body = [[c[0] - w, c[1] - 0.5], [c[0] - w * 1.05, c[1] - h * 0.5], [c[0] - w, c[1] - h], [c[0] + w, c[1] - h], [c[0] + w * 1.05, c[1] - h * 0.5], [c[0] + w, c[1] - 0.5]];
        g.fill2(body, '#E3D3AE', true);
        const lab = [[c[0] - w * 0.86, c[1] - 1.1], [c[0] - w * 0.9, c[1] - h + 0.7], [c[0] + w * 0.9, c[1] - h + 0.7], [c[0] + w * 0.86, c[1] - 1.1]]; g.fill2(lab, lb[0], true);
        const m = [c[0], c[1] - h * 0.5];
        if (lb[2] === 'disc') { g.disc2(m, 2.2, lb[1]); TK.word2(g, m, 2.8, '酒', '#F6F3EA', { w: 0.4 }); }
        else if (lb[2] === 'band') { g.fill2([[lab[1][0], lab[1][1]], [lab[2][0], lab[2][1]], [lab[2][0], lab[2][1] + 1.3], [lab[1][0], lab[1][1] + 1.3]], lb[1], true); g.fill2([[lab[0][0], lab[0][1] - 1.3], [lab[3][0], lab[3][1] - 1.3], [lab[3][0], lab[3][1]], [lab[0][0], lab[0][1]]], lb[1], true); TK.word2(g, m, 2.6, '酒', '#2E2A26', { w: 0.4 }); }
        else if (lb[2] === 'ring') { g.ring2(m, 2.0, { w: 0.6, c: lb[1] }); g.disc2(m, 0.8, lb[1]); }
        else if (lb[2] === 'wave') { const s = []; for (let j = 0; j < 3; j++) s.push(m[0] - 2.2, m[1] - 1.2 + j * 1.2, m[0] - 0.7, m[1] - 1.9 + j * 1.2, m[0] - 0.7, m[1] - 1.9 + j * 1.2, m[0] + 0.7, m[1] - 1.2 + j * 1.2, m[0] + 0.7, m[1] - 1.2 + j * 1.2, m[0] + 2.2, m[1] - 1.9 + j * 1.2); g.segs2(s, lb[1], 0.5); }
        else TK.word2(g, m, 3.2, '酒', lb[1], { w: 0.45 });
        g.segs2([c[0] - w, c[1] - h * 0.2, c[0] + w, c[1] - h * 0.2, c[0] - w, c[1] - h * 0.82, c[0] + w, c[1] - h * 0.82], '#A88E5E', 0.4);   // the straw ropes
        g.outline2(body, { w: 0.35, c: '#6E5A3E', boil: false });
        const top = arcPts(c[0], c[1] - h, w, Math.PI, TAU, 8).map((q) => [q[0], c[1] - h + (q[1] - (c[1] - h)) * 0.4]); g.fill2(top.concat([[c[0] + w, c[1] - h], [c[0] - w, c[1] - h]]), '#D9C9A0', true);
      }
    }
  }, { name: 'sake barrels' });
  // across the path, the rack of Burgundy wine barrels given in 2006; from here we see their back ends
  T.obj([-3.6, 15.5, -0.6, 30.5], function (g) {
    const x1 = -0.8, y0 = 15.8, y1 = 30.2;
    for (let k = 0; k < 3; k++) K.box(g, -3.4, y0, x1, y1, k * 2.1, k * 2.1 + 0.3, { t: '#9A8A72', l: '#8A7A62', r: '#7A6A52' }, { w: 0.45 });
    for (let k = 0; k < 3; k++) for (let i = 0; i < 9; i++) {
      const c = g.p(x1 + 0.02, y0 + 0.9 + i * (y1 - y0 - 1.8) / 8, k * 2.1 + 1.25), r = 3.0;
      const e = arcPts(c[0], c[1], r, 0, TAU, 14).map((q) => [c[0] + (q[0] - c[0]) * 0.62, q[1]]); g.fill2(e, '#B07A4A', true);
      g.line2(e, { w: 0.35, c: '#5A3A22', close: true, boil: false }); g.ring2(c, r * 0.62, { w: 0.3, c: '#3A2A1E' });
      g.segs2([c[0] - 1.4, c[1] - 1.2, c[0] + 1.4, c[1] - 1.6, c[0] - 1.6, c[1] + 0.6, c[0] + 1.6, c[1] + 0.2], '#8A5A34', 0.3);
    }
  }, { name: 'wine barrels' });
  // low bamboo fences along the path's edges, where the wood begins
  T.obj([M + 4.4, -2, M + 5.0, 36], (g) => { const s = []; for (let y = -1.6; y < 35.8; y += 0.9) { const a = g.p(M + 4.7, y, 0), b = g.p(M + 4.7, y, 1.1); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#B59A6A', 0.4); for (const z of [0.5, 1.0]) g.line([[M + 4.7, -1.6, z], [M + 4.7, 35.8, z]], { w: 0.35, c: '#8A7448', boil: false }); }, { name: 'fence' });
  T.obj([M - 5.0, -2, M - 4.4, 13.6], (g) => { const s = []; for (let y = -1.6; y < 13.4; y += 0.9) { const a = g.p(M - 4.7, y, 0), b = g.p(M - 4.7, y, 1.1); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#B59A6A', 0.4); for (const z of [0.5, 1.0]) g.line([[M - 4.7, -1.6, z], [M - 4.7, 13.4, z]], { w: 0.35, c: '#8A7448', boil: false }); }, { name: 'fence' });

  /* ---------------- the forest ---------------- */
  // evergreen camphor, oak and chinquapin mostly, a few zelkova that turn; trees close to the path stand alone (people walk
  // past them), the deep wood behind is drawn in clumps
  const TREE = (g, x, y, r, h, i) => K.tree(g, x, y, i % 5 === 3 ? TK.leaves({ r, h, col: '#6E9A50', ink: '#3C5A30' }, 'zelkova', i) : { r, h, col: ['#4F7A42', '#5E8A4A', '#456F3B', '#6A9450', '#557F45'][i % 5], ink: '#2A4426', seed: i * 13 + 5 });
  const CONE = (g, x, y, h, i) => K.cypress(g, x, y, { h, r: 2.4, col: i % 2 ? '#3F6B3A' : '#4A7A42' });
  // a jittered grid of trees over an area, skipping what keep() refuses: [x, y, r, h, kind]
  const plant = (x0, y0, x1, y1, sp, seed, keep) => { const R = RNG(seed), out = []; for (let y = y0; y <= y1; y += sp) for (let x = x0 + ((Math.round((y - y0) / sp)) % 2) * sp * 0.5; x <= x1; x += sp) { const p = [x + (R() - 0.5) * sp * 0.5, y + (R() - 0.5) * sp * 0.5]; if (keep && !keep(p[0], p[1])) continue; out.push([p[0], p[1], 4.2 + R() * 1.6, 7 + R() * 2.4, R() < 0.18 ? 'cone' : 'tree']); } return out; };
  const wood = (list, name) => { const xs = list.map((q) => q[0]), ys = list.map((q) => q[1]); T.obj([Math.min(...xs) - 0.5, Math.min(...ys) - 0.5, Math.max(...xs) + 0.5, Math.max(...ys) + 0.5], (g) => list.slice().sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])).forEach(([x, y, r, h, k], i) => k === 'cone' ? CONE(g, x, y, h * 1.6, i) : TREE(g, x, y, r, h, i)), { name }); };
  // the deep wood: west of the barrels, and east of the courtyard
  wood(plant(-36, -3, -26, 36.5, 4.6, 11), 'wood west');
  wood(plant(18, -36.5, 36.5, -14, 4.8, 12), 'wood east');
  wood(plant(18, -12, 36.5, 3.5, 4.8, 13, (x, y) => !(x > 26 && y > -1)), 'wood east');
  // trees by the path stand alone, people pass behind them
  const NEAR = plant(-23.5, -2, -17.5, 12.5, 4.4, 14).concat(plant(-24, 34.5, -17.5, 36.5, 4.4, 15), plant(1.5, 14.5, 6.5, 36.5, 5.0, 16), [[14.5, -1.2, 4.4, 7.5, 'tree'], [9.5, -1.8, 4.0, 7, 'cone'], [4.6, 1.2, 3.8, 7.5, 'tree']]);
  for (const q of NEAR) for (const [px, py] of [[M - 6.8, 8], [M + 6.8, 8]]) { const dx = q[0] - px, dy = q[1] - py, d = Math.hypot(dx, dy); if (d < 2.4) { q[0] = px + dx / d * 2.4; q[1] = py + dy / d * 2.4; } }   // none in a torii pillar
  NEAR.forEach(([x, y, r, h, k], i) => T.obj([x, y], (g) => k === 'cone' ? CONE(g, x, y, h * 1.6, i) : TREE(g, x, y, r * 0.9, h, i + 3), { on: true }));
  // the understory along the path: low shrubs
  // (the great torii's pillars stand in these rows at y = 8, so the bushes leave them room, and each row is two objects, one
  // behind the pillar and one in front of it)
  for (const [x, bs, r] of [[M - 6.1, [[0, '#6E9A50'], [1.9, '#5E8A4A'], [3.8, '#5E8A4A'], [5.4, '#5E8A4A'], [10.6, '#5E8A4A'], [12.6, '#5E8A4A']], 1.3], [M + 6.1, [[0, '#6E9A50'], [1.9, '#557F45'], [3.8, '#557F45'], [5.6, '#557F45'], [10.4, '#557F45'], [12.6, '#6E9A50']], 1.2]])
    for (const part of [bs.filter((b) => b[0] < 8), bs.filter((b) => b[0] > 8)]) T.obj([x - 0.9, part[0][0] - 1, x + 0.9, part[part.length - 1][0] + 1], (g) => { for (const [y, col] of part) K.bush(g, x, y, { r, col }); }, { name: 'shrubs' });
  T.obj([-4, 31.5, 1, 36.5], (g) => { for (const [x, y] of [[-3, 32.4], [-0.6, 33.6], [-2.2, 35.4], [0.4, 35.8]]) K.bush(g, x, y, { r: 1.5, col: '#5E8A4A' }); }, { name: 'shrubs' });
  T.obj([-4, -1.5, 1, 14], (g) => { for (const [x, y] of [[-2.6, 0.2], [-0.4, 2.4], [-2.8, 4.6], [0.2, 7.6], [-2.2, 10.2], [-0.6, 12.8]]) K.bush(g, x, y, { r: 1.6, col: (x + y) % 2 > 0 ? '#5E8A4A' : '#4F7A42' }); }, { name: 'shrubs' });
  // Yoyogi's own trees, a cherry among them
  [[35.5, 14.5, 3.6, 'ginkgo'], [35.5, 21.5, 3.6, 'ginkgo'], [34.5, 35, 3.4, 'zelkova']].forEach(([x, y, r, kind], i) => T.obj([x, y], (g) => K.tree(g, x, y, TK.leaves({ r, h: 5.2 }, kind, i)), { on: true }));
  T.obj([12.5, 19.2], (g) => TK.sakura(g, 12.5, 19.2, { r: 4.4 }), { on: true });
  for (const [x, y] of [[16.4, 18.2], [32.2, 18.0], [16.0, 31.4], [32.4, 31.6]]) T.obj([x, y], (g) => K.lamp(g, x, y, { h: 7.5 }), { name: 'lamp' });
  T.obj([20.0 - 3.05, 14.7, 20.0 + 3.05, 16.7], (g) => K.bench(g, 20.0, 14.9, { face: 'L', L: 1.8 }), { name: 'bench' });   // off the path; fp: the bench, lengthened to sort as a box
  T.obj([10.2, 6.1, 16.8, 6.3], (g) => { K.sign(g, 'L', 6.2, 10.2, 16.8, 2.8, 4.6, '#3F6B3A', 'YOYOGI PARK', { w: 0.45 }); const s = []; for (const x of [10.6, 16.4]) { const a = g.p(x, 6.2, 0), b = g.p(x, 6.2, 2.8); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#3A3530', 0.6); }, { name: 'park sign' });
  // the dancers' radio
  T.obj([22.6, 9.6], (g) => { const p = g.p(22.6, 9.6, 0); g.fill2([[p[0] - 2.4, p[1]], [p[0] + 2.4, p[1]], [p[0] + 2.4, p[1] - 2.6], [p[0] - 2.4, p[1] - 2.6]], '#3A3530', true); g.disc2([p[0] - 1.2, p[1] - 1.3], 0.85, '#8C8576'); g.disc2([p[0] + 1.2, p[1] - 1.3], 0.85, '#8C8576'); g.line2([[p[0] - 1.6, p[1] - 2.6], [p[0], p[1] - 3.8], [p[0] + 1.6, p[1] - 2.6]], { w: 0.4, c: '#3A3530', boil: false }); }, { name: 'radio' });

  /* ---------------- the living layer ---------------- */
  // the wedding: walks slowly round the courtyard behind the priest and the shrine maiden; the bride's attendant holds the
  // big red parasol over her
  const PROC = [[-4, -17.6], [6, -17.6], [6, -9.8], [-4, -9.8]], PR = route(PROC), SPD = 0.75;
  const PRIEST = TK.who(3101, { top: '#F6F3EA', dress: '#BFD3DD', sleeve: '#F6F3EA', eboshi: true, hairStyle: 'short', glasses: false, cap: undefined, muffler: undefined, higasa: undefined, uchiwa: undefined });
  const MIKO = TK.who(3103, { top: '#F6F3EA', dress: '#C9463E', sleeve: '#F6F3EA', hairStyle: 'long', hair: '#1F1A18', cap: undefined, glasses: false, muffler: undefined, higasa: undefined, uchiwa: undefined });
  const BRIDE = TK.who(3104, { top: '#F6F3EA', dress: '#F6F3EA', sleeve: '#F6F3EA', hood: true, hair: '#1F1A18', cap: undefined, glasses: false, muffler: undefined, higasa: undefined, uchiwa: undefined });
  const ATT = TK.who(3110, { top: '#2E2A26', dress: '#3F4D63', sleeve: '#2E2A26', hairStyle: 'short', hair: '#1F1A18', cap: undefined, muffler: undefined, higasa: undefined, uchiwa: undefined });
  const GROOM = TK.who(3105, { top: '#2E2A26', dress: '#6C7A89', sleeve: '#2E2A26', hairStyle: 'short', hair: '#1F1A18', cap: undefined, glasses: false, muffler: undefined, higasa: undefined, uchiwa: undefined });
  const FAM = [TK.who(3106, { top: '#2E2A26', dress: '#2E2A26', sleeve: '#2E2A26', hairStyle: 'bun', muffler: undefined, higasa: undefined, uchiwa: undefined }), TK.salary(3107, { top: '#2E2A26', bot: '#2E2A26', tie: '#F3F1EA' }), TK.who(3108, { top: '#2E2A26', dress: '#2E2A26', sleeve: '#2E2A26', hairStyle: 'bun', hair: '#8E8A84', muffler: undefined, higasa: undefined, uchiwa: undefined }), TK.salary(3109, { top: '#2E2A26', bot: '#2E2A26', hair: '#8E8A84', tie: '#F3F1EA' })];
  const walkOn = (d) => { const p = at(PR, d), ph = Math.floor((d / 2.0) % 1 * 8); return { x: p.x, y: p.y, dir: p.dir, ux: p.ux, uy: p.uy, ph: ph / 8, key: p.dir + '.' + ph }; };
  const PARA = (g, h, c) => {   // the red wagasa held up by its long handle
    const um = []; for (let k = 0; k <= 16; k++) { const a = Math.PI + Math.PI * k / 16; um.push([c[0] + Math.cos(a) * 10.5, c[1] + 3.0 + Math.sin(a) * 4.2]); }
    g.line2([[h[0], h[1]], [c[0], c[1]]], { w: 0.55, c: '#4A3A2C', boil: false });
    g.fill2(um, '#C9463E'); const rib = []; for (let k = 2; k < 16; k += 2) rib.push(c[0], c[1] - 1.2, um[k][0], um[k][1]); g.segs2(rib, '#8A2F26', 0.32);
    g.fill2(um.slice(0, 9).concat([[c[0], c[1] + 3.0]]), '#B23D32'); g.line2(um, { w: 0.55, c: '#7A2A22', boil: false }); g.disc2([c[0], c[1] - 1.2], 0.6, '#2E2A26');
  };
  const ORDER = [[PRIEST, 0], [MIKO, 2.0], ['pair', 4.4], [GROOM, 7.4], [FAM[0], 9.6], [FAM[1], 11.4], [FAM[2], 13.4], [FAM[3], 15.2]];
  // one actor per person; the bride's attendant walks a step behind and to the side of her, holding the parasol over her
  // head (the parasol is his: where her head is comes from her pose, not drawn)
  const PSEAS = ['spring', 'summer', 'autumn'], bkOf = (st) => [-st.ux * 1.1 - st.uy * 0.7, -st.uy * 1.1 + st.ux * 0.7];
  ORDER.forEach(([w, gap]) => {
    T.actor({ sample: 0.5, period: PR.total / SPD, season: PSEAS, r: 18,
      at(t) { return walkOn(t * SPD - gap); },
      draw(g, st) { TK.person(g, 0, 0, 0, Object.assign({}, w === 'pair' ? BRIDE : w, { dir: st.dir, pose: 'walk', ph: st.ph })); } });
    if (w === 'pair') T.actor({ sample: 0.5, period: PR.total / SPD, season: PSEAS, r: 18,
      at(t) { const st = walkOn(t * SPD - gap), bk = bkOf(st); st.x += bk[0]; st.y += bk[1]; return st; },
      draw(g, st) {
        const bk = bkOf(st), ra = TK.person(g, 0, 0, 0, Object.assign({}, ATT, { dir: st.dir, pose: 'walk', ph: (st.ph + 0.5) % 1, hands: [[2.2, -16.6], [2.6, -15.8]] }));
        const rb = TK.person(new G('bride'), -bk[0], -bk[1], 0, Object.assign({}, BRIDE, { dir: st.dir, pose: 'walk', ph: st.ph }));
        PARA(g, ra.hands[0], [rb.crown[0] + 0.4, rb.crown[1] - 4.6]);
      } });
  });
  // the New Year instead: the first week of January, a crowd waiting its turn to pray before the hall, and pilgrims at the gate
  [[-17, -21], [-11.5, -20.9], [-6, -21]].forEach(([cx, cy], j) =>   // (a step in front of the pilgrims' way along the steps' foot)
    TK.group(T, [0, 1, 2, 3, 4].map((k) => ({ who: (k % 4 === 1 ? TK.kimono : k % 4 === 3 ? TK.salary : TK.who)(3300 + j * 10 + k, { dir: 3 }), x: cx - 2 + (k % 3) * 1.8 + (k > 2 ? 0.9 : 0), y: cy + (k > 2 ? 2.0 : 0) })), { season: 'winter', seed: 20 + j, laughs: 0.3 }));
  // (the approach's lanes are about a body's width apart, a person being about 1 u across: the family at M - 3.2 / M - 2.25,
  // the pilgrims up at M - 1.3, these at M - 0.35 / M + 0.75 inside the pilgrims' loop, the pilgrims down at M + 1.8)
  for (let i = 0; i < 5; i++) K.walker(T, i % 3 === 1 ? TK.kimono(3320 + i) : TK.who(3320 + i), [[M - 0.35, 36.5], [M - 0.35, -8.6], [M + 0.75, -8.6], [M + 0.75, 36.5]], 1.3, { phase: i / 5, season: 'winter' });

  // pilgrims along the approach: a bow at the great torii going in (and at the gate), on to the hall, and back out
  // (all three on the one route, a third of a round apart, so they never meet: up at M - 1.3, through the gaps the New Year
  // crowd leaves in front of the hall, a bow at the foot of the steps, back down at M + 1.8, round the winter walkers' loop)
  const IN = (x) => [[x, 36.8], [x, 9.6], [x, -9.0], [M - 2.45, -9.0], [M - 2.45, -22.1], [M + 3.05, -22.1], [M + 3.05, -9.6], [M + 1.8, -9.6], [M + 1.8, 36.8]];
  const bowAt = (pts, k) => route(pts).L[k] + 0.01;
  [[M - 1.3, 0, 3401], [M - 1.3, 0.35, 3402], [M - 1.3, 0.65, 3403]].forEach(([x, ph, s], i) => { const pts = IN(x); pilgrim((i % 2 ? TK.kimono : TK.who)(s, {}), pts, 1.5, [[bowAt(pts, 1), [['bow', 1.6], ['rest', 0.4]], 3], [bowAt(pts, 4), [['bow', 1.2], ['bow', 1.2], ['clap', 1.0], ['pray', 2.6], ['bow', 1.2]], 3]], { phase: ph }); });
  // people at the hall: two bows, two claps, a prayer, one more bow
  [[M - 4.0, -22.0, 3411, 0], [M + 4.6, -22.0, 3412, 4.1]].forEach(([x, y, s, off]) => busy((s % 2 ? TK.who : TK.kimono)(s, { dir: 3 }), x, y, [['bow', 1.4], ['bow', 1.4], ['clap', 1.2], ['pray', 3.0], ['bow', 1.4], ['look', 2.6]], { off, season: ['spring', 'summer', 'autumn'] }));
  // a family on the gravel: parents and two children walking in together
  [[TK.who(3421, {}), 0], [TK.who(3422, { k: 0.66, hair: '#1F1A18', skin: SKIN[0], cap: '#E6C24F', glasses: false, beard: false }), 0.012], [TK.who(3423, {}), 0.024], [TK.who(3424, { k: 0.58, hair: '#1F1A18', skin: SKIN[0], glasses: false, beard: false }), 0.036]].forEach(([w, ph]) => K.walker(T, w, [[M - 3.2, 36.8], [M - 3.2, -2.6], [M - 2.25, -2.6], [M - 2.25, 36.8]], 1.2, { phase: 0.45 + ph }));   // up the left edge, clear of the first torii's pillar
  // a priest sweeping the gravel with a bamboo broom, a step at a time
  { const sweeper = TK.who(3431, { top: '#F6F3EA', dress: '#8FB7D9', sleeve: '#F6F3EA', hairStyle: 'short', glasses: false, cap: undefined, muffler: undefined, higasa: undefined, uchiwa: undefined });
    const BROOM = { n: 2, rate: 1.4, f: (i) => ({ lean: 1.0, hands: i ? [[2.4, -12.0], [3.6, -8.4]] : [[1.0, -12.2], [1.8, -8.2]] }), extra: (g, r, i) => { const a = r.hands[0], b = r.hands[1], top = [a[0] - (b[0] - a[0]) * 0.6, a[1] - (b[1] - a[1]) * 0.6], f = r.hands[0][0] < r.hands[1][0] ? 1 : -1, end = [b[0] + f * (i ? 3.4 : 2.2), r.hip[1] + 10.4]; g.line2([top, end], { w: 0.5, c: '#B59A6A', boil: false }); g.fill2([[end[0] - 2.4, end[1] + 0.4], [end[0] + 2.4, end[1] + 0.4], [end[0] + 1.0, end[1] - 1.6], [end[0] - 1.0, end[1] - 1.6]], '#9A8A5A', true); } };
    busy(sweeper, M + 3.6, 2.0, [[BROOM, 5.0, 1], ['look', 1.4, 1], [BROOM, 4.0, 1], ['rest', 1.2, 2]], { dx: (t) => Math.sin(t / 13.6 * TAU) * 0.4, season: ['spring', 'summer', 'autumn'] }); }   // on the right edge, clear of the lanes
  // writing an ema at the table, then hanging it on the wall
  const WRITE = { n: 2, rate: 1.6, f: (i) => ({ lean: 1.6, hands: [[2.6, -10.8 + i * 0.3], [3.4, -10.6]] }) };
  const HANG = { n: 1, rate: 1, f: () => ({ hands: [[2.4, -16.0], [3.0, -15.6]] }), extra: (g, r) => { const h = r.hands[1]; g.fill2([[h[0] - 0.85, h[1]], [h[0] + 0.85, h[1]], [h[0] + 0.85, h[1] - 1.4], [h[0], h[1] - 1.9], [h[0] - 0.85, h[1] - 1.4]], '#E9D3A6', true); } };
  busy(TK.kimono(3441, {}), 9.6, -18.9, [[WRITE, 4.6, 3], ['look', 1.4, 1], [HANG, 2.4, 3], ['talk', 2.4, 1]], { off: 0 });
  busy(TK.who(3442, {}), 12.0, -19.0, [['talk', 2.0, 3], [WRITE, 4.0, 3], ['laugh', 1.4, 2], [HANG, 2.6, 3], ['photo', 2.4, 3]], { off: 2.5 });
  busy(TK.who(3443, {}), 13.4, -15.6, [['look', 3.0, 3], ['point', 1.6, 3], ['photo', 2.6, 3], ['scroll', 2.4, 1]], { off: 1.1 });
  // a family photo in front of the great torii
  TK.photo(T, { who: TK.who(3451, { dir: 3 }), x: M + 3.4, y: 13.4 }, [{ who: TK.kimono(3452, { dir: 1 }), x: M + 2.75, y: 9.8 }, { who: TK.who(3453, { dir: 1, k: 0.66 }), x: M + 3.5, y: 10.0 }, { who: TK.who(3454, { dir: 1 }), x: M + 4.25, y: 9.7 }], { seed: 2, pause: 6 });   // to the right, out of the walkers' lanes

  // Yoyogi: rockabilly dancers in leather twisting round their radio, with people stopping to watch
  const ROCK = [0, 1, 2, 3].map((i) => TK.who(3200 + i, { top: '#2A2622', jacket: i % 2 ? '#F3F1EA' : undefined, bot: '#3F4D63', shoe: '#2A2622', hairStyle: 'short', hair: '#1F1A18', bare: false, beard: false, glasses: i === 2, muffler: undefined, higasa: undefined, uchiwa: undefined }));
  [[19.6, 8.4, 0], [24.4, 8.0, 1], [20.6, 11.6, 0], [25.4, 11.8, 2]].forEach(([x, y, dir], i) => T.actor({ sample: 5, period: 10, grow: false,
    at(t) { const f = Math.floor(t * 3.2 + i * 1.5) % 6; return { x, y, key: f, f }; },
    draw(g, st) {
      const pose = [['walk', 0.0], ['crouch', 0], ['walk', 0.5], ['cheer', 0.25], ['crouch', 0], ['walk', 0.25]][st.f];
      const r = TK.person(g, 0, 0, 0, Object.assign({}, ROCK[i], { dir: [dir, dir, dir, dir, (dir + 1) % 4, dir][st.f], pose: pose[0], ph: pose[1], sway: st.f === 1 ? 0.9 : st.f === 4 ? -0.9 : 0 }));
      const c = r.crown; g.fill2(K.curve([[c[0] - 1.6, c[1] + 0.8], [c[0] - 0.6, c[1] - 1.6], [c[0] + 2.6, c[1] - 2.4], [c[0] + 2.8, c[1] - 0.8], [c[0] + 1.4, c[1] + 0.6]], 2, true), '#1F1A18', true);   // the pompadour
    } }));
  TK.group(T, [{ who: TK.who(3210, { dir: 2 }), x: 28.4, y: 11.0 }, { who: TK.kimono(3211, { dir: 2 }), x: 28.0, y: 13.0 }, { who: TK.who(3212, { dir: 3 }), x: 26.0, y: 14.6 }], { seed: 4, laughs: 0.6 });
  busy(TK.who(3213, { dir: 2 }), 29.4, 7.4, [['photo', 3.0], ['look', 1.6], ['clap', 1.4], ['photo', 2.4]], { off: 1 });
  TK.group(T, [{ who: TK.who(3214, { dir: 1, sit: true }), x: 19.2, y: 15.9 }, { who: TK.who(3215, { dir: 1, sit: true }), x: 20.8, y: 15.9 }], { seed: 11 });
  // a jogger, a dog walker and children chasing round the lawn's loop
  // (the jogger on the outer half of the path, the dog walker, the other way round, on the inner half)
  const ring = (rx, ry) => { const o = []; for (let i = 0; i < 16; i++) { const a = TAU * i / 16; o.push([24 + Math.cos(a) * rx, 25 + Math.sin(a) * ry]); } return o; };
  K.walker(T, TK.who(3220, { top: '#E08A3C', shorts: true, bot: '#2F343B', cap: '#3B3F47' }), ring(9.05, 7.55), 4.2, {});
  TK.dogWalk(T, TK.who(3221, { top: '#7FB7D9' }), ring(8.25, 6.85).reverse(), 1.3, '#C98A4A', { phase: 0.3 });
  TK.chase(T, [TK.who(3225, { top: '#C9463E', skin: SKIN[0], hair: '#1F1A18' }), TK.who(3226, { top: '#5F8FC9', skin: SKIN[1], hair: '#1F1A18' }), TK.who(3227, { top: '#E6C24F', skin: SKIN[0], hair: '#1F1A18' })], [[20, 21], [28.5, 21], [28.5, 28.5], [20, 28.5]], 3.2, { gap: 0.07, season: ['spring', 'summer', 'autumn'] });
  // spring: a picnic under the cherry; summer and autumn: friends on a mat
  T.ground((g) => TK.tarp(g, [[10.8, 21.8, 0.04], [14.8, 21.8, 0.04], [14.8, 24.8, 0.04], [10.8, 24.8, 0.04]], { col: '#E7A9A0' }), { name: 'mat', season: ['spring', 'summer', 'autumn'] });   // flat on the grass: ground, under its sitters
  TK.group(T, [{ who: TK.who(3001, { dir: 1, sit: true }), x: 11.8, y: 21.6 }, { who: TK.who(3002, { dir: 1, sit: true, dress: '#F3E3A0' }), x: 13.8, y: 21.6 }, { who: TK.kimono(3003, { dir: 2, sit: true }), x: 14.3, y: 23.4 }, { who: TK.who(3004, { dir: 3, sit: true }), x: 12.6, y: 25.0 }], { seed: 7, laughs: 0.6, season: ['spring', 'summer', 'autumn'] });
  // autumn: a Shichi-Go-San visit, the father photographing the girl of seven in her red kimono with her bag of
  // chitose-ame and her little brother of five in haori and hakama, their mother beside them
  { const kid = { skin: SKIN[0], hair: '#1F1A18', cap: undefined, glasses: false, beard: false, muffler: undefined, shoe: '#F3F1EA' };
    const GIRL = TK.who(3242, Object.assign({}, kid, { k: 0.62, dress: '#C9463E', top: '#C9463E', sleeve: '#C9463E', obi: '#E6C24F', hairStyle: 'bun' })), BOY = TK.who(3243, Object.assign({}, kid, { k: 0.55, top: '#2E2A26', sleeve: '#2E2A26', dress: '#8E8A84', hairStyle: 'short' }));
    const MUM = TK.kimono(3241, { dress: '#6B4A6A', top: '#6B4A6A', sleeve: '#6B4A6A', obi: '#E9D9B0' }), DAD = TK.salary(3240, { coat: false });
    const seq = [['peace', 2.4], ['wave', 1.6], ['rest', 2.0], ['laugh', 1.4], ['look', 2.4]], period = seq.reduce((s, q) => s + q[1], 0);
    const step = (t) => { t = ((t % period) + period) % period; let k = 0, s = 0; while (k < seq.length - 1 && t >= s + seq[k][1]) { s += seq[k][1]; k++; } const A2 = TK.ACTS[seq[k][0]], i = Math.floor((t - s) * A2.rate) % A2.n; return { key: k + '.' + i, k, i }; };
    const FX = 1.0, FY = -14.6;                          // where the family stands (a step back from the procession's way)
    const one = (dx, dy, draw) => T.actor({ sample: 0.25, period, season: 'autumn', r: 16, at(t) { return Object.assign({ x: FX + dx, y: FY + dy }, step(t)); }, draw });
    one(-1.4, -1.2, (g, st) => TK.doing(g, Object.assign({}, MUM, { dir: 1 }), st.k === 2 ? 'talk' : 'rest', 0));
    one(0.2, -0.9, (g, st) => {
      const a = seq[st.k][0], rg = TK.doing(g, Object.assign({}, GIRL, { dir: 1, hands: [[-1.9, -9.6], [1.0, -10.6]] }), a === 'peace' ? 'peace' : a, a === 'peace' ? 0 : st.i);
      const h = rg.hands[0][1] > rg.hands[1][1] ? rg.hands[0] : rg.hands[1], bag = [[h[0] - 0.55, h[1] - 0.6], [h[0] + 0.55, h[1] - 0.6], [h[0] + 0.55, h[1] + 3.6], [h[0] - 0.55, h[1] + 3.6]];
      g.fill2(bag, '#F6F3EA', true); g.fill2([[h[0] - 0.55, h[1] + 1.2], [h[0] + 0.55, h[1] + 1.2], [h[0] + 0.55, h[1] + 1.9], [h[0] - 0.55, h[1] + 1.9]], '#C9463E', true); g.outline2(bag, { w: 0.3, boil: false });
    });
    one(1.4, -0.4, (g, st) => { const a = seq[st.k][0]; TK.doing(g, Object.assign({}, BOY, { dir: 1 }), a === 'laugh' ? 'jump' : a, st.i); });
    one(0.8, 3.2, (g, st) => TK.doing(g, Object.assign({}, DAD, { dir: 3 }), st.k === 4 ? 'scroll' : 'photo', 0)); }
  // winter, on the snow day: children throw snowballs by their snowman; another pats it into shape
  T.obj([24.4, 28.2], (g) => TK.snowman(g, 24.4, 28.2, 1), { name: 'snowman', season: 'winter' });
  TK.toss(T, TK.who(3330, { k: 0.7, skin: SKIN[0], hair: '#1F1A18', cap: '#C9463E', glasses: false, beard: false, higasa: undefined }), TK.who(3331, { k: 0.68, skin: SKIN[0], hair: '#1F1A18', glasses: false, beard: false, higasa: undefined }), 19.4, 25.2, 29.0, 27.6, { season: 'winter', ball: '#F6F7F9', arc: 2.4 });
  busy(TK.who(3332, { k: 0.66, skin: SKIN[0], hair: '#1F1A18', glasses: false, beard: false, higasa: undefined }), 22.4, 29.2, [[{ n: 2, rate: 1.6, f: (i) => ({ pose: 'crouch', hands: [[2.6, -9.4 + i * 0.8], [3.2, -8.8 + i * 0.6]] }) }, 4.0, 0], ['wave', 1.4, 1], ['jump', 1.0, 1]], { season: 'winter' });
});
