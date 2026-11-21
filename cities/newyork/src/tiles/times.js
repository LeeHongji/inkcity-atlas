'use strict';
/* (0,100) Times Square: the bowtie plaza where Broadway crosses Seventh Avenue, a canyon of light.
   How it is built: the pedestrian plaza of dark pavers with pale discs runs the length of the tile. At its far (south)
   end stands One Times Square, a narrow tower that is nothing but stacked screens, a news ticker round its waist and the
   New Year's ball on a mast on top. The east side is a wall of three towers whose west faces are giant billboards (the
   screens are actors: a winking face, a fizzing drink, BROADWAY in lights, a skyline at sunset), the far corners carry
   more. On the west side a theatre with a bulb-lit marquee and a vertical blade sign; beyond it Duffy Square with
   Father Duffy in bronze and the NYPD booth. The red steps (TKTS) rise from the plaza towards the far end: people sit
   on the red glass treads facing us, watching a breakdance crew perform in a ring in front of them.
   Who is there: tourists everywhere (I-heart-NY tees, phones up), a Statue of Liberty performer posing for photos, a
   red furry monster and a caped superhero working the crowd, the guitar-playing cowboy in his hat, boots and white
   briefs, a pretzel cart, two NYPD officers and a mounted officer on a white-faced horse, a pedicab waiting.
   What moves: every screen, the ticker, the dancers (a flip, a freeze, a windmill), the monster, the horse, walkers. */
SF.tile('times', 0, 100, { rim: 36 }, function (T) {
  const H = 37, PAVE = '#CBC7C0', DISC = '#E6E3DC';
  const STEPS = { x0: -12, x1: 4, y0: 4, y1: 17, n: 10, top: 7.4 };

  /* ---------------- ground ---------------- */
  T.ground(function (g) {
    NK.lot(g, { inner: PAVE });
    const pl = K.rect(-31, -31, 31, 31);
    g.scuff(pl, { dir: Math.atan2(AY, -AX), len: 5, c: '#D8D4CD', dens: 0.5, w: 0.5, spread: 0.05 });
    const d = []; for (let x = -28; x < 29; x += 4.6) for (let y = -28; y < 29; y += 4.6) { const p = g.p(x + ((y * 7) % 2), y, 0); d.push(p); }
    for (const p of d) g.fill2([[p[0] - 1.1, p[1]], [p[0], p[1] - 0.6], [p[0] + 1.1, p[1]], [p[0], p[1] + 0.6]], DISC, true);
    // the performance ring: a chalk circle and a cardboard mat
    g.fill(K.arc(-4, 25.5, 0.01, 4.4, 0, TAU, 20), '#D7CDB8');
    g.fill([[-7, 23.5, 0.02], [-1, 23.5, 0.02], [-1, 27.5, 0.02], [-7, 27.5, 0.02]], '#C9A774');
    g.outline(K.arc(-4, 25.5, 0.02, 4.4, 0, TAU, 20), { w: 0.4, c: '#F6F3EA', boil: false });
  }, { rim: true });

  /* ---------------- billboard screens: actors keyed by their frame ---------------- */
  // a screen on a face. face 'R': plane x = p, seen from left (y = A) to right (y = B < A). face 'L': plane y = p, x from A to B.
  const screen = (face, p, A, B, z0, z1, kind, o) => {
    o = o || {}; const W = Math.abs(B - A), Hh = z1 - z0, NPH = o.nph || 8, per = o.per || 4;
    const ax = face === 'R' ? p : A, ay = face === 'R' ? B : p;
    const Q = face === 'R' ? (u, v) => [p + 0.08 - ax, A - u - ay, z0 + v] : (u, v) => [A + u - ax, p + 0.08 - ay, z0 + v];
    T.actor({ sample: 5, period: 20, grow: false,
      at(t) { const ph = Math.floor(((t / per + (o.phase || 0)) % 1) * NPH); return { x: ax, y: ay, z: 0, key: kind + ph, ph }; },
      draw(g, st) { TS_paint(g, Q, W, Hh, kind, st.ph, NPH, o); } });
  };
  const rect = (g, Q, u0, v0, u1, v1, col) => g.fill([Q(u0, v0), Q(u1, v0), Q(u1, v1), Q(u0, v1)], col);
  function TS_paint(g, Q, W, Hh, kind, ph, NPH, o) {
    const t = ph / NPH;
    if (kind === 'face') {               // a giant smiling face that winks
      rect(g, Q, 0, 0, W, Hh, '#F2C12E');
      const cx = W / 2, cz = Hh / 2, r = Math.min(W, Hh) * 0.36, ring = [];
      for (let i = 0; i < 24; i++) { const a = TAU * i / 24; ring.push(Q(cx + Math.cos(a) * r, cz + Math.sin(a) * r)); }
      g.fill(ring, '#FBF3D6');
      const wink = ph % 4 === 2;
      g.fill([Q(cx - r * 0.45, cz + r * 0.25), Q(cx - r * 0.25, cz + r * 0.25), Q(cx - r * 0.25, cz + r * 0.55), Q(cx - r * 0.45, cz + r * 0.55)], '#2C271C');
      if (wink) g.fill([Q(cx + r * 0.2, cz + r * 0.32), Q(cx + r * 0.5, cz + r * 0.32), Q(cx + r * 0.5, cz + r * 0.4), Q(cx + r * 0.2, cz + r * 0.4)], '#2C271C');
      else g.fill([Q(cx + r * 0.25, cz + r * 0.25), Q(cx + r * 0.45, cz + r * 0.25), Q(cx + r * 0.45, cz + r * 0.55), Q(cx + r * 0.25, cz + r * 0.55)], '#2C271C');
      const sm = []; for (let i = 0; i <= 10; i++) { const a = Math.PI * (1.15 + 0.7 * i / 10); sm.push(Q(cx + Math.cos(a) * r * 0.6, cz + Math.sin(a) * r * 0.6)); }
      for (let i = 10; i >= 0; i--) { const a = Math.PI * (1.15 + 0.7 * i / 10); sm.push(Q(cx + Math.cos(a) * r * 0.42, cz - r * 0.05 + Math.sin(a) * r * 0.42)); }
      g.fill(sm, '#C9463E');
      for (const s of [-1, 1]) g.fill([Q(cx + s * r * 0.62, cz - r * 0.05), Q(cx + s * r * 0.82, cz - r * 0.05), Q(cx + s * r * 0.82, cz + r * 0.1), Q(cx + s * r * 0.62, cz + r * 0.1)], '#F2A3A0');
    } else if (kind === 'drink') {       // a fizzing drink on red, bubbles rising
      rect(g, Q, 0, 0, W, Hh, '#C9362E');
      for (let i = 0; i < 5; i++) rect(g, Q, 0, Hh * i / 5, W, Hh * i / 5 + Hh * 0.04, '#D9473C');
      const cx = W * 0.35, gl = [Q(cx - W * 0.12, Hh * 0.12), Q(cx + W * 0.12, Hh * 0.12), Q(cx + W * 0.16, Hh * 0.8), Q(cx - W * 0.16, Hh * 0.8)];
      g.fill(gl, '#F6EBD0'); g.fill([Q(cx - W * 0.11, Hh * 0.14), Q(cx + W * 0.11, Hh * 0.14), Q(cx + W * 0.135, Hh * 0.6), Q(cx - W * 0.135, Hh * 0.6)], '#7A3A22');
      for (let i = 0; i < 6; i++) { const v = ((i / 6 + t) % 1) * Hh * 0.45 + Hh * 0.16, u = cx + (((i * 37) % 10) / 10 - 0.5) * W * 0.18; const c = Q(u, v); g.disc2(g.p.apply(g, c), 0.55 + 0.25 * (i % 2), '#F6EBD0'); }
      NK.textP(g, Q, W * 0.72, Hh * 0.42, Math.min(Hh * 0.18, W * 0.07), 'FIZZ', '#FBF8EE', { center: true });
      NK.textP(g, Q, W * 0.72, Hh * 0.22, Math.min(Hh * 0.08, W * 0.035), 'ICE COLD', '#FBF8EE', { center: true });
    } else if (kind === 'broadway') {    // BROADWAY in chasing lights over a dancer's silhouette
      rect(g, Q, 0, 0, W, Hh, '#2C2440');
      const n = 18; for (let i = 0; i < n; i++) { const on = (i + ph) % 3 === 0; const u = W * (i + 0.5) / n; g.disc2(g.p.apply(g, Q(u, Hh * 0.93)), 0.45, on ? '#FBE9A6' : '#7A6A55'); g.disc2(g.p.apply(g, Q(u, Hh * 0.07)), 0.45, on ? '#7A6A55' : '#FBE9A6'); }
      NK.textP(g, Q, W / 2, Hh * 0.62, Math.min(Hh * 0.16, W * 0.075), 'BROADWAY', '#F6D36A', { center: true });
      const k = ph % 2 ? 1 : -1, cx = W / 2, z = Hh * 0.18;
      g.fill([Q(cx - 0.4, z), Q(cx + 0.4, z), Q(cx + 0.5, z + 3.2), Q(cx - 0.5, z + 3.2)], '#E6739A');
      g.fill([Q(cx - 0.6, z + 3.2), Q(cx + 0.6, z + 3.2), Q(cx + 2.2 * k, z + 5.4), Q(cx + 1.6 * k, z + 5.8)], '#E6739A');
      g.fill([Q(cx - 0.5, z + 3.2), Q(cx + 0.5, z + 3.2), Q(cx - 1.8 * k, z + 1.0), Q(cx - 2.3 * k, z + 1.4)], '#E6739A');
      g.disc2(g.p.apply(g, Q(cx, z + 4.0)), 1.6, '#E6739A');
      NK.textP(g, Q, W / 2, Hh * 0.38, Math.min(Hh * 0.07, W * 0.03), 'NOW PLAYING', '#FBF8EE', { center: true });
    } else if (kind === 'sky') {         // a skyline at sunset, the sun sliding down
      const bands = ['#F2A65A', '#E8845A', '#C9586A', '#7A4A7A']; for (let i = 0; i < 4; i++) rect(g, Q, 0, Hh * (1 - (i + 1) / 4), W, Hh * (1 - i / 4), bands[3 - i]);
      const sc = Q(W * 0.6, Hh * (0.75 - 0.4 * t)), sp = g.p.apply(g, sc); g.disc2(sp, Math.min(W, Hh) * 0.6, '#FBE3A0');
      const R = RNG(5), bl = [Q(0, 0)]; let u = 0; while (u < W) { const w = W * (0.04 + R() * 0.07), h = Hh * (0.15 + R() * 0.4); bl.push(Q(u, h), Q(u + w, h)); u += w; } bl.push(Q(W, 0));
      g.fill(bl, '#3A2E40');
      NK.textP(g, Q, W / 2, Hh * 0.82, Math.min(Hh * 0.1, W * 0.05), 'NEW YORK', '#FBF8EE', { center: true });
    } else if (kind === 'stripes') {     // a fashion ad: colour panels sliding, a model's silhouette
      const cols = ['#5FB0C9', '#F2C12E', '#E6739A', '#8FBF73'];
      for (let i = 0; i < 5; i++) { const u0 = ((i / 4 + t) % 1.25 - 0.125) * W; rect(g, Q, clamp(u0, 0, W), 0, clamp(u0 + W / 4, 0, W), Hh, cols[i % 4]); }
      const cx = W * 0.5; g.fill([Q(cx - 1.2, 0), Q(cx + 1.2, 0), Q(cx + 1.6, Hh * 0.55), Q(cx - 1.6, Hh * 0.55)], '#2C271C'); g.disc2(g.p.apply(g, Q(cx, Hh * 0.66)), Math.min(W, Hh) * 0.09 * 3.2, '#2C271C');
      NK.textP(g, Q, W / 2, Hh * 0.82, Math.min(Hh * 0.09, W * 0.06), 'SALE', '#FBF8EE', { center: true });
    } else if (kind === 'phone') {       // a big phone, its screen cycling through colours
      rect(g, Q, 0, 0, W, Hh, '#E9EAE6');
      const cx = W / 2, pw = Math.min(W * 0.3, Hh * 0.3); rect(g, Q, cx - pw, Hh * 0.08, cx + pw, Hh * 0.92, '#2C271C');
      rect(g, Q, cx - pw * 0.85, Hh * 0.14, cx + pw * 0.85, Hh * 0.86, ['#5FB0C9', '#E6739A', '#8FBF73', '#F2C12E'][ph % 4]);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) rect(g, Q, cx - pw * 0.7 + i * pw * 0.5, Hh * 0.2 + j * Hh * 0.15, cx - pw * 0.7 + i * pw * 0.5 + pw * 0.36, Hh * 0.2 + j * Hh * 0.15 + Hh * 0.1, '#FBF8EE');
    } else if (kind === 'ticker') {      // the news ticker: words sliding along a dark band
      rect(g, Q, 0, 0, W, Hh, '#1E1C22');
      const words = 'BREAKING NEWS - CITY WEATHER SUNNY 75 - SUBWAY ON TIME - ', h = Hh * 0.56, adv = h * 5.5 / 6, len = words.length * adv;
      for (let i = 0; i < words.length * 2; i++) { const a = -t * len + i * adv; if (a < 0.2 || a > W - adv) continue; NK.textP(g, Q, a, Hh * 0.22, h, words[i % words.length], '#F2C12E', { w: 0.4 }); }
    } else if (kind === 'stack') {       // One Times Square's stacked screens: bands that change together
      const pal = [['#2F6DB5', '#F2C12E', '#C9463E'], ['#8FBF73', '#2C2440', '#E6739A'], ['#F2A65A', '#5FB0C9', '#2C271C'], ['#E9EAE6', '#C9362E', '#2F6DB5']][ph % 4];
      const n = 3; for (let i = 0; i < n; i++) { rect(g, Q, 0, Hh * i / n, W, Hh * (i + 1) / n - 0.5, pal[i]); }
      NK.textP(g, Q, W / 2, Hh * (1 / 3) * 0.3, Math.min(Hh * 0.08, W * 0.12), ph % 2 ? 'LIVE' : 'NYC', '#FBF8EE', { center: true });
    }
    const fr = [Q(0, 0), Q(W, 0), Q(W, Hh), Q(0, Hh)]; g.outline(fr, { w: 0.6, c: '#2C271C', boil: false });
  }

  /* ---------------- the far end: One Times Square and the corner towers ---------------- */
  T.obj([-5, -31, 5, -22], function (g) {               // One Times Square
    const x0 = -5, y0 = -31, x1 = 5, y1 = -22, Hh = 30;
    K.box(g, x0, y0, x1, y1, 0, 6, { t: '#D9D3C6', l: '#3A3632', r: '#2F2C2A' }, { w: 0.9 });
    g.fill(K.on('L', y1 + 0.03, x0 + 0.6, x1 - 0.6, 0.4, 4.6), '#E9D3A6');
    K.box(g, x0, y0, x1, y1, 6, Hh, { t: '#D9D3C6', l: '#4A4540', r: '#3A3632' }, { w: 0.9 });
    // the side faces carry billboards too (static art)
    const rf = K.on('R', x1 + 0.05, y0 + 0.5, y1 - 0.5, 9, 26); g.fill(rf, '#C9463E');
    NK.text(g, 'R', x1 + 0.08, (y0 + y1) / 2, 20, 2.0, 'NEWS', '#FBF8EE', { center: true }); NK.text(g, 'R', x1 + 0.08, (y0 + y1) / 2, 14, 1.4, 'LIVE 24/7', '#FBF8EE', { center: true });
    g.outline(rf, { w: 0.5, boil: false });
    // the top: a frame, the mast, the ball
    K.box(g, x0 + 1, y0 + 1, x1 - 1, y1 - 1, Hh, Hh + 1.6, { t: '#C9C3B6', l: '#6E6A62', r: '#5A5650' }, { w: 0.6, boil: false });
    const m0 = g.p(0, -26.5, Hh + 1.6), m1 = g.p(0, -26.5, Hh + 9.5); g.line2([m0, m1], { w: 0.9, boil: false, c: '#5A5650' });
    const b = g.p(0, -26.5, Hh + 8.2); g.disc2(b, 3.0, '#DCE6EE'); g.fill2(arcPts(b[0] + 0.6, b[1] + 0.6, 2.4, -0.4, 2.0, 8), '#AFC3D2');
    const sp = []; for (let i = 0; i < 9; i++) { const a = TAU * i / 9; sp.push(b[0] + Math.cos(a) * 1.1, b[1] + Math.sin(a) * 1.1, b[0] + Math.cos(a) * 2.6, b[1] + Math.sin(a) * 2.6); } g.segs2(sp, '#FBF8EE', 0.35);
    g.ring2(b, 3.0, { w: 0.5, c: '#5A6470' });
    NK.text(g, 'L', y1 + 0.05, x0 + 1, Hh - 2.6, 1.6, '1 TIMES SQ', '#F6F3EA', { w: 0.35 });
  }, { name: 'one times square' });
  screen('L', -22, -4.6, 4.6, 7.0, 13.0, 'ticker', { nph: 12, per: 6 });
  screen('L', -22, -4.6, 4.6, 13.6, 27.4, 'stack', { nph: 4, per: 6 });

  T.obj([-31, -31, -7, -24], function (g) {             // the far-left corner tower: a huge billboard on its front
    K.box(g, -31, -31, -7, -24, 0, 33, { t: '#D9D3C6', l: '#B9C6CE', r: '#9FAFBA' }, { w: 1 });
    NK.windows(g, 'R', -7, -30.5, -24.5, 3, 3.4, 9, 2, { style: 'navy' });
    g.fill(K.on('L', -23.97, -30.5, -7.5, 0, 4.4), '#E9D3A6');
    NK.roofStuff(g, -31, -31, -7, -24, 33, 7);
  }, { name: 'corner tower L' });
  screen('L', -24, -30.4, -7.6, 6, 30, 'face', { nph: 8, per: 5 });

  T.obj([7, -31, 31, -24], function (g) {               // the far-right corner: a hotel with a curved screen
    K.box(g, 7, -31, 31, -24, 0, 26, { t: '#D9D3C6', l: '#E7DFCA', r: '#CFC5AC' }, { w: 1 });
    NK.windows(g, 'R', 31, -30.5, -24.5, 3, 3.4, 7, 2, { style: 'glass' });
    g.fill(K.on('L', -23.97, 7.5, 30.5, 0, 4.4), '#E9D3A6');
    NK.sign(g, 'L', -24, 22, 30.4, 22.5, 25, '#2C2440', 'HOTEL', { ink: '#F6D36A' });
    NK.tank(g, 26, -28, 26.5, { r: 1.6, h: 3.0, leg: 1.6 });
  }, { name: 'corner tower R' });
  screen('L', -24, 7.6, 21, 7, 21.5, 'drink', { nph: 6, per: 2.4 });

  /* ---------------- the east wall: three towers, billboards facing the plaza ---------------- */
  const EAST = [[-22, -6, 28, 'sky', 5.2, '#AFC3CF'], [-6, 10, 23, 'broadway', 1.6, '#C9BFA9'], [10, 28, 17, 'stripes', 6, '#B9654C']];
  for (const [y0, y1, h, kind, per, col] of EAST) {
    T.obj([-31, y0, -16, y1], function (g) {
      K.box(g, -31, y0, -16, y1, 0, h, { t: '#D9D3C6', l: col, r: shade(col, 0.12) }, { w: 1 });
      // a shop floor of glass and light under the billboard
      g.fill(K.on('R', -15.97, y0 + 0.5, y1 - 0.5, 0, 4.6), '#F0DDAF');
      for (let a = y0 + 2.5; a < y1; a += 2.6) g.fine([K.pt('R', -15.95, a, 0), K.pt('R', -15.95, a, 4.6)], { w: 0.35, c: '#7A6A55' });
      NK.windows(g, 'L', y1, -30.5, -16.5, 5, 3.3, Math.floor((h - 6) / 3.3), 4, { style: kind === 'stripes' ? 'glass' : 'navy' });
      NK.roofStuff(g, -31, y0, -16, y1, h, Math.round(y0 * 3 + 50));
      if (kind === 'stripes') NK.tank(g, -27, y0 + 4, h + 0.4, { r: 1.5, h: 2.8, leg: 1.5 });
    }, { name: 'east wall' });
    screen('R', -16, y1 - 0.6, y0 + 0.6, 5.6, h - 1.4, kind, { nph: kind === 'broadway' ? 6 : 8, per });
  }

  /* ---------------- the west side: a theatre, Duffy Square ---------------- */
  T.obj([19, -20, 31, -3], function (g) {
    K.box(g, 19, -20, 31, -3, 0, 13, { t: '#D9D3C6', l: '#C9A27D', r: '#B08A64' }, { w: 1 });
    NK.windows(g, 'R', 31, -19.5, -3.5, 6, 3.4, 2, 5, { style: 'navy', arch: true });
    // the marquee over the doors, ringed with bulbs, the show's name
    K.box(g, 19.5, -3, 30.5, -1.2, 4.6, 6.6, { t: '#E9E6DE', l: '#2C2440', r: '#221C33' }, { w: 0.6, boil: false });
    NK.text(g, 'L', -1.15, 25, 5.15, 0.95, 'THE SHOW', '#F6D36A', { center: true, w: 0.35 });
    const bl = []; for (let x = 19.8; x < 30.4; x += 0.7) { bl.push(g.p(x, -1.18, 6.45), g.p(x, -1.18, 4.75)); } for (const p of bl) g.disc2(p, 0.32, '#FBE9A6');
    g.fill(K.on('L', -2.97, 20, 30, 0, 4.4), '#4A3A2E'); for (let x = 21; x < 30; x += 2.2) g.fill(K.on('L', -2.95, x, x + 1.4, 0.2, 3.8), '#E9D3A6');
    // the vertical blade sign on the corner
    const b0 = g.p(30.6, -2.6, 8), b1 = g.p(30.6, -2.6, 16); const bw = 2.2;
    g.fill2([[b0[0] - bw, b0[1] - 0.6], [b0[0] + bw, b0[1] + 0.6], [b1[0] + bw, b1[1] + 0.6], [b1[0] - bw, b1[1] - 0.6]], '#C9362E');
    const ch = 'THEATRE'; for (let i = 0; i < ch.length; i++) NK.textP(g, (a, z) => [30.65 + a * 0.0, -2.6 + a * 0.62, z], -0.4, 15 - i * 1.05, 0.8, ch[i], '#F6D36A', { center: true, w: 0.35 });
    g.outline2([[b0[0] - bw, b0[1] - 0.6], [b0[0] + bw, b0[1] + 0.6], [b1[0] + bw, b1[1] + 0.6], [b1[0] - bw, b1[1] - 0.6]], { w: 0.5, boil: false });
    NK.roofStuff(g, 19, -20, 31, -3, 13, 21);
  }, { name: 'theatre' });
  // the theatre's billboard on 6th Avenue (static)
  T.obj([31, -12], function (g) { const q = K.on('R', 31.06, -19, -5, 6.5, 12.2); g.fill(q, '#2F6DB5'); NK.text(g, 'R', 31.1, -12, 8.4, 1.9, 'TONIGHT', '#FBF8EE', { center: true }); g.outline(q, { w: 0.5, boil: false }); }, { on: true });

  // Father Duffy in bronze on his plinth with the Celtic cross behind; the NYPD booth; a souvenir cart
  T.obj([21.5, 8.5, 25.5, 12.5], function (g) {
    const c = g.p(23.5, 10.5, 0);
    K.box(g, 22.6, 9.6, 24.4, 11.4, 0, 3.4, { t: '#D9D3C6', l: '#C9C3B6', r: '#B4AE9F' }, { w: 0.6 });
    const cr = g.p(23.0, 9.8, 3.4); g.fill2([[cr[0] - 0.5, cr[1]], [cr[0] + 0.5, cr[1]], [cr[0] + 0.5, cr[1] - 13], [cr[0] - 0.5, cr[1] - 13]], '#B4AE9F'); g.fill2([[cr[0] - 2.8, cr[1] - 10.2], [cr[0] + 2.8, cr[1] - 10.2], [cr[0] + 2.8, cr[1] - 9.2], [cr[0] - 2.8, cr[1] - 9.2]], '#B4AE9F');
    K.person(g, 23.6, 10.8, 3.4, { skin: '#7A6A4A', hair: '#6A5A3C', top: '#6E5E40', bot: '#6E5E40', shoe: '#5A4A30', dir: 1, pose: 'hold', ink: '#3A3020', k: 1.05 });
    void c;
  }, { name: 'duffy' });
  T.obj([23, 17, 27.5, 21.5], function (g) {
    K.box(g, 23, 17, 27.5, 21.5, 0, 5.2, { t: '#E9EAE6', l: '#F3F1EA', r: '#D9DAD6' }, { w: 0.7 });
    g.fill(K.on('L', 21.53, 23.6, 26.9, 1.2, 4.2), C.glass); g.fill(K.on('R', 27.53, 17.6, 20.9, 1.2, 4.2), C.glass);
    g.fill(K.on('L', 21.55, 23, 27.5, 4.4, 5.2), '#2F4A7A'); NK.text(g, 'L', 21.58, 25.25, 4.5, 0.62, 'POLICE', '#FBF8EE', { center: true, w: 0.3 });
    const l = g.p(25.2, 19.2, 5.2); g.disc2([l[0], l[1] - 0.9], 0.8, '#5E8FC9'); g.ring2([l[0], l[1] - 0.9], 0.8, { w: 0.35, c: '#2F4A7A' });
  }, { name: 'nypd booth' });

  /* ---------------- the red steps ---------------- */
  const S = STEPS, dz = S.top / S.n, dy = (S.y1 - S.y0) / S.n;
  T.obj([S.x0, S.y0, S.x1, S.y1], function (g) {
    const RED = '#D84A3E', RED2 = '#B9372E', SIDE = 'rgba(200,64,54,0.92)';
    // the side wall we see (x = x1): a staircase profile of red glass, then each tread from the top down
    K.box(g, S.x0, S.y0 - 1.2, S.x1, S.y0, 0, S.top + 1.2, { t: '#E9EAE6', l: '#C9D8E0', r: '#B4C6D0' }, { w: 0.6, boil: false });
    const prof = [[S.x1, S.y1, 0], [S.x1, S.y0, 0], [S.x1, S.y0, S.top]];
    for (let k = 0; k < S.n; k++) { const y = S.y0 + (k + 1) * dy, z = S.top - k * dz; prof.push([S.x1, y, z]); prof.push([S.x1, y, z - dz]); }
    g.fill(prof, SIDE);
    for (let k = 0; k < S.n; k++) {
      const ya = S.y0 + k * dy, yb = ya + dy, z = S.top - k * dz;
      g.fill([[S.x0, ya, z], [S.x1, ya, z], [S.x1, yb, z], [S.x0, yb, z]], k % 2 ? '#E3584A' : '#DE5446');
      g.fill([[S.x0, yb, z], [S.x1, yb, z], [S.x1, yb, z - dz], [S.x0, yb, z - dz]], RED2);
      g.line([[S.x0, yb, z], [S.x1, yb, z]], { w: 0.5, c: '#8E2A22', boil: false });
    }
    g.outline(prof, { w: 0.7, c: '#7A241E', boil: false });
    // the TKTS sign on the side
    NK.sign(g, 'R', S.x1, S.y0 + 0.6, S.y0 + 5.6, 1.0, 2.6, '#C9362E', 'TKTS');
    // handrails down the steps
    for (const x of [S.x0 + 0.3, S.x0 + (S.x1 - S.x0) / 2, S.x1 - 0.3]) g.fine([[x, S.y0, S.top + 1.6], [x, S.y1, 1.6], [x, S.y1 + 0.4, 0]], { w: 0.35, c: '#E9EAE6' });
    void RED;
  }, { name: 'red steps' });
  // the people on the steps, row by row, facing us (front rows come later in the sort)
  let seed = 1200;
  for (let k = 0; k < S.n - 1; k += 1) {
    const yb = S.y0 + (k + 0.62) * dy, z = S.top - k * dz, R = RNG(k * 17 + 3), n = k % 2 ? 4 : 5;
    const spots = []; for (let i = 0; i < n; i++) if (R() < 0.82) spots.push(S.x0 + 1.3 + (S.x1 - S.x0 - 2.6) * (i + 0.25 + R() * 0.5) / n);
    if (!spots.length) continue;
    const s0 = seed; seed += 10;
    T.cast([S.x0 + 4, yb], (g) => {
      spots.forEach((x, i) => {
        const w = (i + k) % 4 === 0 ? NK.tourist(s0 + i) : NK.who(s0 + i);
        const sel = (i * 3 + k) % 7 === 0;
        NK.person(g, x, yb, z - 0.05, Object.assign({}, w, { dir: (i + k) % 3 === 0 ? 0 : 1, pose: sel ? 'hold' : 'sit', phone: sel }));
      });
    }, { on: true });
  }

  /* ---------------- the living layer ---------------- */
  // the breakdance crew in the ring: one flips, one freezes, one does windmills; the hat for tips
  const DANCE = [NK.who(1301, { top: '#E8742C', bot: '#2F2C2A', cap: '#2F2C2A', bare: true }), NK.who(1302, { top: '#F3F1EA', bot: '#3C5C8A', bare: true }), NK.who(1303, { top: '#2F6DB5', bot: '#2F2C2A', cap: '#C9463E' })];
  DANCE.forEach((w, d) => T.actor({ sample: 5, period: 10,
    at(t) { const ph = Math.floor(((t * 0.6 + d * 0.33) % 1) * 8); return { x: -5.8 + d * 2.0, y: 25 + (d === 1 ? 1.4 : 0), z: 0, key: ph, ph }; },
    draw(g, st) {
      const ph = st.ph;
      if (ph < 2) K.person(g, 0, 0, 0, Object.assign({}, w, { dir: 1, pose: 'crouch', sway: ph ? 0.6 : -0.6 }));
      else if (ph < 4) K.person(g, 0, 0, 3.2, Object.assign({}, w, { dir: 1, lie: Math.PI / 2 + (ph - 2.5) * 0.5 }));
      else if (ph < 6) K.person(g, 0, 0, 0.8, Object.assign({}, w, { dir: 0, lie: (ph - 4) * Math.PI / 2 }));
      else K.person(g, 0, 0, 0, Object.assign({}, w, { dir: ph % 2 ? 0 : 1, pose: 'cheer', ph: ph / 8 }));
    } }));
  T.cast([-1.4, 28.4], (g) => { const h = g.p(-1.4, 28.4, 0); g.fill2([[h[0] - 1.6, h[1]], [h[0] + 1.6, h[1]], [h[0] + 1.2, h[1] - 0.9], [h[0] - 1.2, h[1] - 0.9]], '#2F2C2A', true); }, { on: true });
  // the ring of watchers on the sides of the ring, some cheering
  [[-10.5, 22.5, 0], [-10.8, 25.2, 0], [-10.2, 28, 0], [2.4, 22.8, 2], [2.8, 25.6, 2], [2.2, 28.4, 2], [-7.5, 30.5, 3], [-3.0, 31.0, 3]].forEach(([x, y, d], i) => {
    const w = i % 3 === 0 ? NK.tourist(1320 + i) : NK.who(1320 + i);
    if (i % 2 === 0) T.actor({ sample: 5, period: 10, at(t) { const ph = Math.floor(((t * 0.8 + i * 0.27) % 1) * 4); return { x, y, key: ph, ph }; }, draw(g, st) { NK.person(g, 0, 0, 0, Object.assign({}, w, { dir: d, pose: st.ph < 2 ? 'cheer' : 'stand', ph: st.ph / 4 })); } });
    else T.cast([x, y], (g) => NK.person(g, x, y, 0, Object.assign({}, w, { dir: d, pose: i % 4 === 1 ? 'hold' : 'stand', phone: i % 4 === 1 })), { on: true });
  });
  // the guitar cowboy (hat, boots, white briefs, a guitar) with two tourists posing beside him
  T.cast([12, 22], (g) => {
    NK.person(g, 13.4, 22.4, 0, NK.tourist(1340, { dir: 1, pose: 'wave', ph: 0.2 }));
    const r = NK.person(g, 12, 22, 0, { skin: '#E8BE9A', hair: '#D9B560', hairStyle: 'long', top: '#E8BE9A', bot: '#FBFAF6', shorts: true, shoe: '#8A5A3A', bare: true, dir: 1, pose: 'hold', hat: '#F6F2E8' });
    const hd = r.hands[0], c = [hd[0] - 0.5, hd[1] + 0.6];
    g.fill2([[c[0] - 2.2, c[1] - 1.2], [c[0] + 0.6, c[1] - 1.6], [c[0] + 1.2, c[1] + 0.8], [c[0] - 1.8, c[1] + 1.4]], '#C98A4A', true);
    g.disc2([c[0] - 0.5, c[1]], 0.5, '#4A3426'); g.line2([[c[0] + 0.6, c[1] - 0.4], [c[0] + 5.0, c[1] - 3.0]], { w: 0.55, c: '#6E4A2E', boil: false, ext: 0 });
    g.fill2([[r.hip[0] - 1.6, r.hip[1] - 2.0], [r.hip[0] + 1.6, r.hip[1] - 2.0], [r.hip[0] + 1.6, r.hip[1] - 1.2], [r.hip[0] - 1.6, r.hip[1] - 1.2]], '#E8BE9A', true);
    NK.person(g, 10.4, 21.6, 0, NK.who(1341, { dir: 0, pose: 'hold', phone: true }));
  }, { on: true });
  // the green Statue of Liberty performer, torch up, a family posing; a photographer kneeling
  T.cast([8, -6], (g) => {
    NK.person(g, 9.6, -5.4, 0, NK.who(1350, { dir: 1, k: 0.75 }));
    const r = K.person(g, 8, -6, 0, { skin: '#7FB8A4', hair: '#6FA894', top: '#7FB8A4', bot: '#7FB8A4', dress: '#7FB8A4', shoe: '#5F9884', dir: 1, pose: 'wave', ph: 0.25, ink: '#2F5A4C' });
    const c = r.crown; for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.15 + 0.7 * i / 6); g.segs2([c[0], c[1] + 1, c[0] + Math.cos(a) * 3, c[1] + 1 + Math.sin(a) * 3], '#6FA894', 0.6); }
    const hd = r.hands[0]; g.fill2([[hd[0] - 0.4, hd[1]], [hd[0] + 0.4, hd[1]], [hd[0] + 0.5, hd[1] - 2.8], [hd[0] - 0.5, hd[1] - 2.8]], '#6FA894', true); g.fill2([[hd[0] - 0.7, hd[1] - 2.8], [hd[0] + 0.7, hd[1] - 2.8], [hd[0], hd[1] - 5.0]], '#F2C12E', true);
    NK.person(g, 6.6, -5.0, 0, NK.tourist(1351, { dir: 1, pose: 'wave', ph: 0.6 }));
    NK.person(g, 9.8, -0.5, 0, NK.who(1352, { dir: 3, pose: 'kneel', hands: [[2.4, -10.5], [3.6, -10.8]] }));
  }, { on: true });
  // the red furry monster wandering the plaza, a caped superhero; a family photographing the monster
  const MON = { skin: '#D9473C', hair: '#C9362E', hairStyle: 'curly', top: '#D9473C', bot: '#D9473C', shoe: '#E8742C', bare: false, build: 1, k: 1.08, ink: '#7A241E' };
  T.actor({ sample: 0.3, period: 24,
    at(t) { const u = (t / 24) % 1, a = u * TAU, x = Math.cos(a) * 4.5, y = -14 + Math.sin(a) * 3, ph = Math.floor((t * 1.6 % 1) * 8), dx = -4.5 * Math.sin(a), dy = 3 * Math.cos(a), dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3); return { x, y, key: dir + '.' + ph, dir, ph }; },
    draw(g, st) {
      const r = K.person(g, 0, 0, 0, Object.assign({}, MON, { dir: st.dir, pose: 'walk', ph: st.ph / 8 }));
      const h = r.head, R2 = r.headR; if (st.dir < 2) { g.disc2([h[0] - R2 * 0.35, h[1] - R2 * 0.3], R2 * 0.32, '#FBFAF6'); g.disc2([h[0] + R2 * 0.35, h[1] - R2 * 0.3], R2 * 0.32, '#FBFAF6'); g.disc2([h[0] - R2 * 0.3, h[1] - R2 * 0.25], R2 * 0.14, '#2A2622'); g.disc2([h[0] + R2 * 0.4, h[1] - R2 * 0.25], R2 * 0.14, '#2A2622'); g.fill2([[h[0] - R2 * 0.4, h[1] + R2 * 0.35], [h[0] + R2 * 0.4, h[1] + R2 * 0.35], [h[0], h[1] + R2 * 0.1]], '#E8742C', true); }
    } });
  T.actor({ sample: 0.3, period: 30,
    at(t) { const u = (t / 30) % 1, a = -u * TAU + 1, x = 11.5 + Math.cos(a) * 2.5, y = -14 + Math.sin(a) * 3, ph = Math.floor((t * 1.7 % 1) * 8), dx = Math.sin(a), dy = -Math.cos(a), dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3); return { x, y, key: dir + '.' + ph, dir, ph }; },
    draw(g, st) {
      const back = st.dir >= 2, w = { skin: '#E8BE9A', hair: '#2B2420', top: '#2F6DB5', bot: '#2F6DB5', shoe: '#C9362E', bare: false, build: 0.7, dir: st.dir, pose: 'walk', ph: st.ph / 8 };
      const F = g.p(0, 0, 0);
      if (!back) g.fill2([[F[0] - 2.6, F[1] - 17], [F[0] + 2.6, F[1] - 17], [F[0] + 3.4, F[1] - 4], [F[0] - 3.4, F[1] - 4]], '#C9362E', true);
      const r = K.person(g, 0, 0, 0, w);
      g.fill2([[r.hip[0] - 1.8, r.hip[1] - 1.0], [r.hip[0] + 1.8, r.hip[1] - 1.0], [r.hip[0] + 1.8, r.hip[1] + 0.2], [r.hip[0] - 1.8, r.hip[1] + 0.2]], '#E6C24F', true);
      if (back) g.fill2([[F[0] - 2.6, F[1] - 17], [F[0] + 2.6, F[1] - 17], [F[0] + 3.4, F[1] - 4], [F[0] - 3.4, F[1] - 4]], '#C9362E', true);
    } });
  T.cast([-8.5, -5.5], (g) => { NK.person(g, -8.5, -5.5, 0, NK.tourist(1360, { dir: 0, pose: 'hold', phone: true })); NK.person(g, -9.6, -3.8, 0, NK.who(1361, { dir: 0, k: 0.72, pose: 'wave', ph: 0.3 })); }, { on: true });

  // the mounted officer: a white-faced bay horse walking a slow loop round the plaza
  const COP = NK.cop(1370, { cap: '#2E3A55' });
  const MY0 = -19, MY1 = 2, MV = 2.0, MPER = 2 * (MY1 - MY0) / MV;
  T.actor({ sample: 0.3, period: MPER,
    at(t) {
      const u = ((t / MPER) % 1), out = u < 0.5, y = out ? lerp(MY1, MY0, u * 2) : lerp(MY0, MY1, u * 2 - 1), d = Math.abs(y - MY1) + (out ? 0 : 100);
      const ph = Math.floor((d / 3.2) % 1 * 8), fl = out ? 1 : -1;
      return { x: 16.6, y, key: fl + '.' + ph, fl, ph, rd: out ? 3 : 1 };
    },
    draw(g, st) {
      // a bay horse in side view (screen px, facing right when fl = 1): barrel, neck and head, black points, mane, tail
      const c = g.p(0, 0, 0), fl = st.fl, s = (u, v) => [c[0] + fl * u, c[1] + v], BAY = '#8A5634', BAYD = '#6E4228', PT = '#33231A';
      const sw = Math.sin(st.ph / 8 * TAU);
      const leg = (u, d, far) => { const k = d * 1.8, top = -14; g.fill2([s(u - 1.3, top), s(u + 1.3, top), s(u + 0.9 + k * 0.4, -7), s(u + 0.7 + k, -1.2), s(u - 0.5 + k, -1.2), s(u - 0.6 + k * 0.4, -7)], far ? BAYD : BAY, true); g.fill2([s(u - 0.7 + k * 0.5, -6.5), s(u + 0.9 + k * 0.5, -6.5), s(u + 0.8 + k, -1.2), s(u - 0.6 + k, -1.2)], PT, true); g.fill2([s(u - 0.8 + k, -1.4), s(u + 1.0 + k, -1.4), s(u + 1.2 + k, 0), s(u - 0.9 + k, 0)], '#2A2622', true); };
      leg(-7.5, -sw, true); leg(7.0, sw, true);
      g.fill2([s(-12.5, -17.5), s(-13.6, -12), s(-14.2, -7.5), s(-12.8, -7.8), s(-11.6, -13)], PT, true);           // tail
      const body = [s(-10, -22), s(-4, -21.2), s(3, -21.6), s(6, -23.2), s(10, -19.5), s(9.4, -14.6), s(4, -13), s(-3, -12.6), s(-9.5, -13.8), s(-12.2, -17.2)];
      g.fill2(body, BAY, true); g.fill2([s(-9.5, -13.8), s(-3, -12.6), s(4, -13), s(9.4, -14.6), s(8, -16), s(-2, -15), s(-10, -16)], BAYD, true);
      const neck = [s(4.4, -22.6), s(8.6, -30.2), s(11.4, -30.6), s(12.2, -27.6), s(10.4, -19.4), s(7.2, -18.8)]; g.fill2(neck, BAY, true);
      const head = [s(9.0, -31.6), s(11.2, -31.8), s(16.6, -26.4), s(16.2, -24.4), s(13.6, -24.2), s(10.8, -27.4)]; g.fill2(head, BAY, true);
      g.fill2([s(11.6, -30.4), s(12.3, -30.6), s(16.0, -26.2), s(15.4, -25.6)], '#F3F1EA', true);                       // the blaze
      g.fill2([s(9.2, -31.4), s(9.8, -34.2), s(10.8, -31.6)], BAYD, true);
      g.fill2([s(4.2, -22.6), s(8.4, -30.4), s(9.4, -31.2), s(8.0, -27.4), s(5.6, -23.4)], PT, true);                   // mane
      g.disc2(s(12.6, -28.4), 0.45, '#1E1A16');
      g.line2(body.concat([body[0]]), { w: 0.55, c: '#3A2418', boil: false, wob: 0.3 }); g.line2([s(8.6, -30.2), s(9.0, -31.6), s(11.2, -31.8), s(16.6, -26.4), s(16.2, -24.4), s(13.6, -24.2), s(12.2, -27.6), s(10.4, -19.4)], { w: 0.5, c: '#3A2418', boil: false, wob: 0.3 });
      g.line2([s(14.2, -25), s(9.4, -24.5), s(3.2, -23.0)], { w: 0.35, c: '#2A2622', boil: false });                     // reins
      g.fill2([s(-4.4, -22.0), s(3.4, -22.2), s(3.0, -16.4), s(-4.0, -16.2)], '#2E3A55', true);                         // saddle cloth
      leg(-5.6, sw, false); leg(8.6, -sw, false);
      // the officer in the saddle: a boot hanging down the near side, the body seated above it
      const kn = s(0.4, -19.5); g.fill2([[kn[0] - 1.1, kn[1] - 3], [kn[0] + 1.1, kn[1] - 3], [kn[0] + 1.3, kn[1] + 5.0], [kn[0] - 0.8, kn[1] + 5.0]], '#2E3A55', true); g.fill2([[kn[0] - 1.0, kn[1] + 4.6], [kn[0] + 2.1 * fl, kn[1] + 4.6], [kn[0] + 2.1 * fl, kn[1] + 6.0], [kn[0] - 1.0, kn[1] + 6.0]], '#2A2622', true);
      NK.person(g, -0.25 * fl, 0.25 * fl, 5.15, Object.assign({}, COP, { dir: st.rd, pose: 'sit', noLegs: true, k: 1, lean: 0 }));
    } });
  // two officers on foot by the booth, a pretzel cart, a pedicab and its driver, a tourist family with a map
  T.cast([21, 23], (g) => { NK.person(g, 21, 23.2, 0, NK.cop(1380, { dir: 1, pose: 'hold', coffee: true })); NK.person(g, 22.6, 24.0, 0, NK.cop(1381, { dir: 2 })); }, { on: true });
  T.obj([-10, -20], (g) => NK.cart(g, -10, -20, { along: 'x', umb: ['#2F6DB5', '#F6F2E8'] }));
  T.cast([-10, -17.6], (g) => { NK.person(g, -11.6, -17.6, 0, NK.who(1385, { dir: 3, pose: 'hold' })); NK.person(g, -8.4, -17.8, 0, NK.tourist(1386, { dir: 3, pose: 'hold', coffee: true })); }, { on: true });
  T.obj([14.5, 27.5], function (g) {                    // a pedicab waiting: the rider's bike in front, the two-seat cab behind
    g.at(14.5, 27.5, 0, (g2) => {
      const ang = -Math.PI / 2, wh = (u, v) => { const c = g2.p(v, u, 1.3); g2.ring2(c, 4.3, { w: 0.8, c: '#3A3632' }); g2.disc2(c, 0.5, '#3A3632'); };
      wh(4.6, -2.2);
      K.rbox(g2, 0, 3.4, 1.2, 2.2, ang, 1.4, 2.6, { t: '#C9362E', l: '#D9473C', r: '#B9372E' }, { w: 0.55 });
      K.rbox(g2, 0, 4.5, 0.25, 2.2, ang, 2.6, 5.0, { t: '#C9362E', l: '#D9473C', r: '#B9372E' }, { w: 0.5 });
      const posts = []; for (const [v, u] of [[-2.1, 2.3], [2.1, 2.3], [-2.1, 4.6], [2.1, 4.6]]) { const a = g2.p(v, u, 2.6), b = g2.p(v, u, 7.0); posts.push(a[0], a[1], b[0], b[1]); } g2.segs2(posts, '#3A3632', 0.45);
      K.rbox(g2, 0, 3.5, 1.5, 2.4, ang, 7.0, 7.4, { t: '#2F6DB5', l: '#2A5E9C', r: '#244E84' }, { w: 0.5 });
      K.bike(g2, ang, { col: '#2F2C2A', who: NK.who(1390, { top: '#E6C24F', cap: '#2F2C2A' }) });
      wh(4.6, 2.2);
    });
  }, { name: 'pedicab' });
  T.cast([16.5, 12], (g) => { NK.person(g, 16.5, 12, 0, NK.tourist(1395, { dir: 2, pose: 'hold' })); NK.person(g, 17.8, 13.2, 0, NK.who(1396, { dir: 2, k: 0.74 })); const p = g.p(16.9, 12, 5.0); g.fill2([[p[0] - 2.2, p[1] - 1.2], [p[0] + 2.2, p[1] - 1.6], [p[0] + 2.2, p[1] + 0.6], [p[0] - 2.2, p[1] + 1.0]], '#F3EBD0', true); }, { on: true });
  // the TKTS queue down the side of the steps, facing the booth window
  T.cast([6, 9], (g) => { for (let i = 4; i >= 0; i--) NK.person(g, 6.4 + (i % 2) * 0.3, 4.6 + i * 1.7, 0, (i % 2 ? NK.who : NK.tourist)(1400 + i, { dir: 3, pose: i % 3 === 0 ? 'hold' : 'stand', phone: i % 3 === 0 })); }, { on: true });

  // walkers streaming through the plaza and along the sidewalks
  const routes = [
    [[-14.2, -22], [-14.2, 31], [-14.4, -22]], [[-6, -21.5], [14, -21.5], [-6, -21.3]], [[-8, 1.6], [6, 1.6], [-8, 1.8]],
    [[-34, -28], [-34, 28], [-34, -28]], [[34, -28], [34, 28], [34, -28]], [[-28, 34], [28, 34], [-28, 34]],
    [[-28, -34], [28, -34], [-28, -34]], [[8, 14], [8, 31], [9, 14]],
  ];
  routes.forEach((r, i) => NK.walker(T, i % 3 === 0 ? NK.tourist(1420 + i) : i % 4 === 1 ? NK.suit(1420 + i) : NK.who(1420 + i, { coffee: i % 5 === 2 }), r, 3.0 + (i % 3) * 0.5, { phase: i * 0.31 }));
  NK.corners(T);
});
