'use strict';
/* The four satellites, off the grid beyond the loop, each on an unlined paint blob:
   upper left  Mt Fuji over rows of tea, a shinkansen crossing in front on a low viaduct;
   upper right Tokyo Skytree beside the bend of the Sumida;
   lower right Rainbow Bridge over the bay, a pleasure boat passing under it;
   lower left  an outdoor sumō ring under a hanging roof: a bout, the referee, spectators, nobori banners. */
(function () {
  const blob = (g, pts, col, seed) => K.blob2(g, g.P(pts.map((p) => [p[0], p[1], 0])), col, { seed, rag: 0.8 });

  /* ---------------- Mt Fuji ---------------- */
  SF.tile('fuji', -205, -5, { rim: 96, castAt: 160, order: -3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-32, -8], [-24, -30], [0, -34], [24, -24], [32, 0], [26, 24], [2, 30], [-24, 24]], '#B5CF8E', 3);
      // tea rows: dark green ridges across the front
      for (let k = 0; k < 6; k++) { const y = 6 + k * 3.2, pts = []; for (let i = 0; i <= 10; i++) { const x = lerp(-18 + k, 22 - k * 1.5, i / 10); pts.push([x, y + Math.sin(i * 0.8) * 0.6, 0]); } g.line(pts, { w: 1.6, c: '#5E8A4A', boil: false }); g.line(pts.map((p) => [p[0], p[1] - 0.6, 0]), { w: 0.7, c: '#8FBF73', boil: false }); }
    });
    T.obj([-30, -30, 18, 4], function (g) {
      const c = g.p(-6, -12, 0), apex = g.p(-6, -12, 36), R = 30 * 4.13 / 2 * 1.05;
      const L = [c[0] - R, c[1] + 4], Rr = [c[0] + R, c[1] + 4];
      const mt = [L, [lerp(L[0], apex[0], 0.55) - 3, lerp(L[1], apex[1], 0.55)], [apex[0] - 6, apex[1] + 2], [apex[0] + 6, apex[1] + 2], [lerp(Rr[0], apex[0], 0.55) + 3, lerp(Rr[1], apex[1], 0.55)], Rr];
      g.fill2(mt, '#8FA5BF');
      g.fill2([[apex[0] + 1, apex[1] + 2], [apex[0] + 6, apex[1] + 2], [lerp(Rr[0], apex[0], 0.55) + 3, lerp(Rr[1], apex[1], 0.55)], Rr, [c[0] + 10, c[1] + 4]], '#7489A3');
      // the snow cap with a ragged lower edge
      const sn = [[apex[0] - 6, apex[1] + 2], [apex[0] + 6, apex[1] + 2]], n = 9;
      const sL = [lerp(apex[0] - 6, L[0], 0.34), lerp(apex[1] + 2, L[1], 0.34)], sR = [lerp(apex[0] + 6, Rr[0], 0.34), lerp(apex[1] + 2, Rr[1], 0.34)];
      sn.push(sR); for (let i = n; i >= 0; i--) { const t = i / n; sn.push([lerp(sL[0], sR[0], t), lerp(sL[1], sR[1], t) + (i % 2 ? 6 : 1) + Math.sin(i * 2.1) * 2]); } sn.push(sL);
      g.fill2(sn, '#F8F7F2'); g.fill2(sn.filter((p) => p[0] > apex[0] + 1).concat([[apex[0] + 1, apex[1] + 2]]), '#DCE3EA');
      g.line2(mt, { w: 1.0, c: '#4E5F78' }); g.line2(sn.slice(2, sn.length - 1), { w: 0.5, c: '#9AAAC0', boil: false });
      const rid = []; for (let i = 0; i < 6; i++) { const t = 0.2 + i * 0.12, a = [lerp(apex[0] - 3 + i * 1.2, c[0] - R * 0.6 + i * R * 0.24, t), lerp(apex[1] + 2, c[1] + 4, t)]; rid.push(a[0], a[1], a[0] + (i - 2.5) * 1.6, a[1] + 9); } g.segs2(rid, '#6E829C', 0.4);
    }, { name: 'fuji' });
    // the low viaduct the shinkansen runs on
    T.obj([8, -26, 12, 26], (g) => { K.box(g, 8.6, -26, 11.4, 26, 1.6, 2.4, { t: '#D7D2C6', l: '#E4E0D6', r: '#C9C3B6' }, { w: 0.7 }); const po = []; for (let y = -24; y < 26; y += 6) { const a = g.p(11.4, y, 0), b = g.p(11.4, y, 1.6); po.push(a[0], a[1], b[0], b[1]); } g.segs2(po, '#9A948A', 0.8); }, { name: 'viaduct', under: 2.4 });
    for (let i = 0; i < 6; i++) T.actor({ sample: 0.3, period: 14, grow: false,
      at(t) { const u = (t / 14) % 1, y = -40 + u * 80 - i * 9.4; if (y < -24 || y > 24) return null; const a = Math.min(1, (y + 24) / 4, (24 - y) / 4); return { x: 10, y, z: 2.4, key: 0, alpha: a < 1 ? a : null }; },
      draw(g) { TK.trainCar(g, Math.PI / 2, { kind: 'shin', cab: i === 0 ? 1 : i === 5 ? -1 : 0 }); } });
  });

  /* ---------------- Tokyo Skytree ---------------- */
  SF.tile('skytree', 5, -205, { rim: 90, castAt: 160, order: -3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-26, -8], [-18, -26], [4, -28], [24, -18], [28, 4], [18, 24], [-6, 26], [-24, 16]], '#E3DFD4', 7);
      // the bend of the river along the front
      const r = K.curve([[-26, 8, 0], [-8, 12, 0], [8, 10, 0], [26, 14, 0], [24, 22, 0], [6, 19, 0], [-10, 21, 0], [-24, 18, 0]], 5, true);
      g.fill(r, C.water); g.water(r, { dens: 0.8 }); g.outline(r, { w: 0.55, c: '#5F7F9C', boil: false });
    });
    T.obj([-22, -6, 6, 4], (g) => { K.box(g, -22, -5, 6, 3, 0, 5.5, { t: '#E9E6DE', l: '#F1EFE8', r: '#DCD8CE' }, { w: 0.85 }); K.win(g, 'L', 3, -21, 5, 1, 4.4, { style: 'glass' }); }, { name: 'solamachi' });
    T.obj([4, -14, 14, -4], function (g) {
      g.boilP = 0.25;
      const i0 = g.cmds.length;
      const cx = 9, cy = -9, TOP = 88, w = (z) => z < 60 ? lerp(4.6, 1.7, Math.pow(z / 60, 0.8)) : lerp(1.6, 0.5, (z - 60) / (TOP - 60));
      const L = [], Rr = []; for (let z = 0; z <= 80; z += 2) { const p = g.p(cx, cy, z), ww = w(z) * 4.13 / 2 * 1.1; L.push([p[0] - ww, p[1]]); Rr.push([p[0] + ww, p[1]]); }
      g.fill2(L.concat(Rr.slice().reverse()), '#E9EEF1'); g.fill2(Rr.map((p, i) => [lerp(L[i][0], p[0], 0.55), p[1]]).concat(Rr.slice().reverse()), '#D3DCE2');
      const lat = []; for (let i = 0; i + 1 < L.length; i++) { lat.push(L[i][0], L[i][1], Rr[i + 1][0], Rr[i + 1][1], Rr[i][0], Rr[i][1], L[i + 1][0], L[i + 1][1]); } g.segs2(lat, '#A9B6C0', 0.28);
      g.line2(L, { w: 0.8, c: '#6E7E8C', boil: false }); g.line2(Rr, { w: 0.8, c: '#6E7E8C', boil: false });
      for (const [z, r, h] of [[48, 3.6, 3.0], [62, 2.6, 1.8]]) { K.cyl(g, cx, cy, r, z, z + h, { t: '#E9EEF1', l: '#C3D6E0', r: '#A8BECB' }, { w: 0.7, n: 14 }); K.cyl(g, cx, cy, r + 0.3, z + h, z + h + 0.4, '#E9EEF1', { w: 0.5, n: 14 }); }
      const a = g.p(cx, cy, 80), t = g.p(cx, cy, TOP); g.line2([a, t], { w: 0.9, c: '#6E7E8C', boil: false }); g.disc2(t, 0.5, '#E0503E');
      // at night the tower is lit pale blue (its 'Iki' lighting); the beacon on top blinks red
      const SKY = { '#E9EEF1': '#A6DAF5', '#D3DCE2': '#79B4DA', '#C3D6E0': '#8EC6E8', '#A8BECB': '#6CA3C9' };
      g.mark({ nc: (c) => SKY[c] || (c === '#E0503E' ? c : undefined) }, i0);
      for (const z of [8, 20, 32, 44, 50, 63, 74]) g.glow('lantern', cx, cy, z, { r: z < 45 ? 3.4 : 2.4, col: '#8FD3FF' });
      g.glow('lantern', cx, cy, TOP, { r: 0.8, col: '#FF5A48' });
    }, { name: 'skytree' });
    T.cast([-4, 6.4], (g) => { TK.person(g, -4, 6.4, 0, TK.who(6001, { dir: 2, pose: 'hold', phone: true })); TK.person(g, -2.4, 7.0, 0, TK.who(6002, { dir: 3 })); }, { on: true });
  });

  /* ---------------- Rainbow Bridge ---------------- */
  SF.tile('odaiba', 208, 8, { rim: 100, castAt: 165, order: 3, half: 32 }, function (T) {
    T.ground(function (g) {
      const w = [[-28, -10], [-18, -28], [6, -30], [26, -20], [30, 6], [22, 26], [-2, 30], [-24, 20]];
      blob(g, w, C.water, 11);
      g.water(w.map((p) => [p[0] * 0.85, p[1] * 0.85, 0]), { dens: 0.9 });
      blob(g, [[8, 10], [20, 8], [26, 16], [20, 24], [10, 22]], '#EBDDB5', 12);          // the beach
      blob(g, [[-26, -8], [-14, -10], [-12, -2], [-24, 2]], '#B5CF8E', 13);
    });
    const BX = (y) => [-24 + (y + 24) * 0, y];
    void BX;
    // the bridge along y: two white towers, the deck, the cables
    T.obj([-3, -26, 3, 26], function (g) {
      g.boilP = 0.3;
      K.box(g, -2.4, -26, 2.4, 26, 5.2, 6.4, { t: '#E9E6DE', l: '#F3F1EA', r: '#D9D5CA' }, { w: 0.8 });
      const piers = []; for (const y of [-24, -10, 10, 24]) { const a = g.p(2.4, y, 0), b = g.p(2.4, y, 5.2); piers.push(a[0], a[1], b[0], b[1]); } g.segs2(piers, '#C9C3B6', 1.6);
      const towers = [-10, 10];
      for (const y of towers) { K.box(g, -2.8, y - 0.8, -1.8, y + 0.8, 0, 22, '#F3F1EA', { w: 0.7 }); K.box(g, 1.8, y - 0.8, 2.8, y + 0.8, 0, 22, '#F3F1EA', { w: 0.7 }); K.box(g, -2.8, y - 0.6, 2.8, y + 0.6, 14, 15.4, '#F3F1EA', { w: 0.6 }); K.box(g, -2.8, y - 0.6, 2.8, y + 0.6, 20.6, 22, '#F3F1EA', { w: 0.6 }); }
      for (const x of [-2.3, 2.3]) {
        const pts = []; for (let k = 0; k <= 30; k++) { const y = lerp(-26, 26, k / 30), dz = Math.abs(y) < 10 ? 21.5 - 15 * (1 - Math.pow(y / 10, 2)) : 21.5 - (Math.abs(y) - 10) / 16 * 15; pts.push([x, y, Math.max(6.6, dz)]); }
        g.line(pts, { w: 0.7, c: '#8C8576', boil: false });
        const hs = []; for (let k = 2; k < 30; k += 2) { const p = pts[k], a = g.p(p[0], p[1], p[2]), b = g.p(p[0], p[1], 6.4); hs.push(a[0], a[1], b[0], b[1]); } g.segs2(hs, '#B9B3A6', 0.25);
      }
    }, { name: 'rainbow bridge', under: 5.2 });
    T.actor({ sample: 0.3, period: 26, grow: false,
      at(t) { const u = (t / 26) % 1, x = -26 + u * 52, a = Math.min(1, Math.min(u, 1 - u) * 10); return { x: x + 3.1, y: 4, z: 0, key: 0, alpha: a < 1 ? a : null }; },
      draw(g) { g.at(-3.1, 0, 0, (g2) => TK.yakata(g2, 0, {})); } });
    T.actor({ sample: 0.3, period: 18, grow: false,
      at(t) { const u = (t / 18) % 1, y = 24 - u * 48, a = Math.min(1, Math.min(u, 1 - u) * 10); return { x: 0, y, z: 6.4, key: 0, alpha: a < 1 ? a : null }; },
      draw(g) { K.car(g, -Math.PI / 2, { col: '#F1EFE8' }); } });
    T.cast([16, 16], (g) => { TK.tarp(g, [[13, 14, 0.04], [18, 14, 0.04], [18, 18, 0.04], [13, 18, 0.04]], { col: '#F2C6D0' }); TK.person(g, 15.6, 13.6, 0, TK.who(6101, { dir: 1, pose: 'sit' })); TK.person(g, 19.0, 17.4, 0, TK.who(6102, { dir: 2, lie: -2.6, shorts: true, bare: true })); }, { on: true });
  });

  /* ---------------- the sumō ring ---------------- */
  SF.tile('ryogoku', 8, 208, { rim: 106, castAt: 170, order: 3, half: 30 }, function (T) {
    T.ground(function (g) {
      blob(g, [[-26, -10], [-14, -26], [10, -26], [26, -12], [26, 12], [12, 26], [-12, 26], [-26, 10]], '#E6DCC4', 17);
      for (let k = 0; k < 3; k++) { const r = 17 + k * 3.2, ring = []; for (let i = 0; i <= 24; i++) { const a = TAU * i / 24; ring.push([Math.cos(a) * r, Math.sin(a) * r, 0]); } g.line(ring, { w: 0.4, c: '#C9B98C', boil: false }); }
    });
    // the raised clay square, the straw-bale ring, the hanging roof on four posts with the coloured tassels
    T.obj([-10, -10, 10, 10], function (g) {
      g.boilP = 0.3;
      K.box(g, -9, -9, 9, 9, 0, 2.2, { t: '#D9B98A', l: '#C9A270', r: '#B08A5A' }, { w: 0.85 });
      for (let i = 0; i < 3; i++) K.box(g, 9 + i * 0.8, -2, 9 + (i + 1) * 0.8, 2, 0, 2.2 - i * 0.7, { t: '#D9B98A', l: '#C9A270', r: '#B08A5A' }, { w: 0.4, boil: false });
      const ring = []; for (let i = 0; i <= 28; i++) { const a = TAU * i / 28; ring.push([Math.cos(a) * 6.4, Math.sin(a) * 6.4, 2.25]); } g.line(ring, { w: 1.3, c: '#C9B07A', boil: false }); g.line(ring.map((p) => [p[0] * 1.03, p[1] * 1.03, 2.3]), { w: 0.4, c: '#8A7A5A', boil: false });
      // the hanging roof, high enough that the bout stays in view; the near post is its own object (drawn in front)
      const posts = [], cols = ['#5E8A4A', '#C9463E', '#F3F1EA', '#2E2A26'];
      [[-8, -8], [8, -8], [-8, 8]].forEach(([x, y], i) => { const a = g.p(x, y, 2.2), b = g.p(x, y, 18); posts.push({ a, b, c: cols[i] }); });
      for (const p of posts) g.line2([p.a, p.b], { w: 0.9, c: '#4A3A2C', boil: false });
      TK.roof(g, -8.5, -8.5, 8.5, 8.5, 18, 4.6, { gable: 0.4, over: 1.6, lift: 0.9, col: '#6E5A44', end: '#C9A26B', tiles: false });
      for (const p of posts) { g.fill2([[p.b[0] - 1.0, p.b[1]], [p.b[0] + 1.0, p.b[1]], [p.b[0] + 0.6, p.b[1] + 5], [p.b[0] - 0.6, p.b[1] + 5]], p.c, true); g.disc2([p.b[0], p.b[1] + 0.4], 1.1, p.c); }
    }, { name: 'dohyo' });
    T.obj([8, 8], (g) => { const a = g.p(8, 8, 2.2), b = g.p(8, 8, 18); g.line2([a, b], { w: 0.9, c: '#4A3A2C', boil: false }); g.fill2([[b[0] - 1.0, b[1]], [b[0] + 1.0, b[1]], [b[0] + 0.6, b[1] + 5], [b[0] - 0.6, b[1] + 5]], '#2E2A26', true); g.disc2([b[0], b[1] + 0.4], 1.1, '#2E2A26'); }, { on: true, name: 'near post' });
    // spectators on cushions round the ring (busts), nobori banners
    T.obj([-24, -24, 24, 24], function (g) {
      for (let k = 0; k < 26; k++) {
        const a = TAU * k / 26 + 0.1, r = 15 + (k % 2) * 3, x = Math.cos(a) * r, y = Math.sin(a) * r; if (x + y > 9) continue;
        const p = g.p(x, y, 0.4); g.fill2([[p[0] - 2.4, p[1] + 0.8], [p[0] + 2.4, p[1] + 0.8], [p[0] + 2.4, p[1] - 0.4], [p[0] - 2.4, p[1] - 0.4]], '#C9584B', true);
        TK.bust2(g, p, TK.who(6200 + k), 0.92);
      }
    }, { name: 'spectators far', bias: -20 });
    T.cast([16, 8], (g) => { for (const [x, y, s] of [[17, 6, 1], [15, 11, 2], [11, 15, 3], [6, 17, 4]]) TK.person(g, x, y, 0.4, TK.who(6300 + s, { dir: 2, pose: 'sit' })); }, { on: true });
    // the bout: two wrestlers locked together, swaying; the referee with his fan
    T.actor({ sample: 5, period: 10, grow: false,
      at(t) { const f = Math.floor(t * 2.4) % 6; return { x: 0.4, y: 0.4, z: 2.2, key: f, f }; },
      draw(g, st) { const s = [0, 0.6, 1, 0.6, 0, -0.5][st.f]; TK.rikishi(g, -2.4 + s * 0.4, -0.2, 0, { dir: 0, push: 0.6 + s * 0.2 }); TK.rikishi(g, 2.6 + s * 0.4, 0.4, 0, { dir: 2, push: 0.6 - s * 0.2, mawashi: '#7A3A6A', skin: '#D9A57B' }); } });
    T.actor({ sample: 5, period: 10, grow: false,
      at(t) { const f = Math.floor(t * 1.6) % 4; return { x: 4.6, y: 5.0, z: 2.2, key: f, f }; },
      draw(g, st) { const r = TK.person(g, 0, 0, 0, TK.who(6400, { dir: 3, dress: '#7A5BA0', top: '#7A5BA0', sleeve: '#7A5BA0', eboshi: true, pose: st.f % 2 ? 'wave' : 'hold', ph: 0.25 })); const h = r.hands[st.f % 2 ? 1 : 0]; g.line2([h, [h[0] + 1, h[1] - 2.6]], { w: 0.5, c: '#3A3530', boil: false }); g.fill2([[h[0] + 0.2, h[1] - 2.4], [h[0] + 2.4, h[1] - 3.6], [h[0] + 2.0, h[1] - 5.6], [h[0], h[1] - 4.8]], '#C9A04F', true); } });
    [[-20, -6, '#C9463E'], [-16, -14, '#3F5F8F'], [-8, -20, '#E6C24F'], [2, -22, '#6FAE6A']].forEach(([x, y, col], i) => T.actor({ sample: 5, period: 10, grow: false,
      at(t) { const f = Math.floor(t * 3 + i) % 4; return { x, y, key: f, f }; },
      draw(g, st) { const b = g.p(0, 0, 0), t = g.p(0, 0, 14); g.line2([b, t], { w: 0.6, c: '#6B6458', boil: false }); const sw = [0, 0.8, 1.2, 0.6][st.f]; const fl = [[t[0] + 0.3, t[1] + 0.6], [t[0] + 3.4 + sw * 0.3, t[1] + 0.6], [t[0] + 3.4 + sw, t[1] + 26], [t[0] + 0.3, t[1] + 26]]; g.fill2(fl, col, true); g.line2(fl, { w: 0.4, c: shade(col, 0.5), close: true, boil: false }); for (let k = 0; k < 4; k++) TK.glyph2(g, [t[0] + 1.9 + sw * 0.5, t[1] + 5 + k * 5], 2.6, '#F6F3EA', 700 + i * 5 + k); } }));
  });
})();
