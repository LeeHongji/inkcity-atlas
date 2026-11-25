'use strict';
/* The four satellites, off the grid beyond the loop, each on an unlined paint blob:
   upper left  Mt Fuji over rows of tea, a shinkansen crossing in front on a low viaduct;
   upper right Tokyo Skytree beside the bend of the Sumida;
   lower right Rainbow Bridge over the bay, a pleasure boat passing under it;
   lower left  an outdoor sumō ring under a hanging roof: a bout, the referee, spectators, nobori banners. */
(function () {
  const blob = (g, pts, col, seed) => K.blob2(g, g.P(pts.map((p) => [p[0], p[1], 0])), col, { seed, rag: 0.8 });

  /* a convex prism standing from z0 to z1 on a plan (tile-local points): the sides we see, lit on the left, then its top */
  const prism = (g, pts, z0, z1, cl, cr, top, w) => {
    const n = pts.length; let cx = 0, cy = 0; for (const p of pts) { cx += p[0] / n; cy += p[1] / n; }
    const vis = [];
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[(i + 1) % n]; let nx = b[1] - a[1], ny = a[0] - b[0];
      if (nx * ((a[0] + b[0]) / 2 - cx) + ny * ((a[1] + b[1]) / 2 - cy) < 0) { nx = -nx; ny = -ny; }
      const l = Math.hypot(nx, ny) || 1; vis.push(nx + ny > 0.001 ? (nx - ny) / l : null);
      if (vis[i] != null) g.fill([[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], mix(cl, cr, clamp(0.5 + 0.5 * vis[i], 0, 1)));
    }
    const tp = pts.map((p) => [p[0], p[1], z1]); if (top) g.fill(tp, top);
    if (!w) return;
    if (top) g.outline(tp, { w: w * 0.85, boil: false });
    let s = 0; while (s < n && !(vis[s] != null && vis[(s - 1 + n) % n] == null)) s++;
    const ch = []; for (let k = 0; k < n && s < n; k++) { const i = (s + k) % n; if (vis[i] == null) break; if (!ch.length) ch.push([pts[i][0], pts[i][1], z0]); const b = pts[(i + 1) % n]; ch.push([b[0], b[1], z0]); }
    if (ch.length > 1) { g.line(ch, { w, boil: false }); g.line([ch[0], [ch[0][0], ch[0][1], z1]], { w: w * 0.9, boil: false }); const e = ch[ch.length - 1]; g.line([e, [e[0], e[1], z1]], { w: w * 0.9, boil: false }); }
  };
  /* a rounded plan, half-length L along the heading ang, half-width W (pointier at the ends with a smaller e) */
  const hullPlan = (L, W, ang, e, n) => { const ca = Math.cos(ang), sa = Math.sin(ang), p = []; n = n || 20; for (let i = 0; i < n; i++) { const t = TAU * i / n, c = Math.cos(t), s = Math.sin(t), u = Math.sign(c) * Math.pow(Math.abs(c), e || 0.6) * L, v = Math.sign(s) * Math.pow(Math.abs(s), 0.5) * W; p.push([u * ca - v * sa, u * sa + v * ca]); } return p; };
  /* the Himiko water bus: a flat silver hull under one long glass canopy */
  const himiko = (g, ang) => {
    g.fill(hullPlan(7.6, 2.0, ang, 0.7).map((p) => [p[0], p[1], 0]), '#DCEAF3');
    prism(g, hullPlan(6.8, 1.7, ang, 0.7), 0, 1.0, '#D3DBE0', '#AEB9C1', '#E4E9EC', 0.6);
    prism(g, hullPlan(5.2, 1.3, ang, 0.55), 1.0, 2.2, '#86AECB', '#5F86A6', '#CBD9E2', 0.5);
    g.mark({ nc: '#F6D79A' }, g.cmds.length - 4);
    const ca = Math.cos(ang), sa = Math.sin(ang), sp = [g.p(-5.6 * ca, -5.6 * sa, 2.25), g.p(5.6 * ca, 5.6 * sa, 2.25)];
    g.line2(sp, { w: 0.45, c: '#8C99A3', boil: false });
  };
  /* a car seen from afar (on a bridge or a viaduct): a low body, a glass cabin, lights */
  const miniCar = (g, ang, col) => {
    const sh = K.rbox(g, 0, 0, 2.3, 1.05, ang, 0, 0.01, col, { line: false, nt: true }); K.shadow(g, sh, 0.2);
    const B = K.rbox(g, 0, 0, 2.2, 1.0, ang, 0.35, 1.35, { t: shade(col, -0.15), l: col, r: shade(col, 0.14) }, { w: 0.5 });
    const ca = Math.cos(ang), sa = Math.sin(ang), C2 = K.rbox(g, -0.25 * ca, -0.25 * sa, 1.15, 0.85, ang, 1.35, 2.05, { t: shade(col, -0.2), l: '#C9D6DE', r: '#AFC0CC' }, { w: 0.45 });
    void C2; K.lights(g, B, 0.55);
  };
  /* black-headed gulls (January): a few rocking on the water, one wheeling over them */
  const gulls = (T, pts, season) => T.actor({ sample: 0.25, period: 12, season, grow: false,
    at(t) { const k = Math.floor(t * 3) % 12; return { x: pts[0][0], y: pts[0][1], z: 0, key: k, k }; },
    draw(g, st) {
      pts.forEach(([x, y], i) => { const c = g.p(x - pts[0][0], y - pts[0][1], 0.2); c[1] += ((st.k + i) % 2) * 0.3; TK.gull2(g, c, i % 2 ? 1 : -1, false, 0); });
      const a = st.k / 12 * TAU, c = g.p(Math.cos(a) * 4, Math.sin(a) * 4, 9); TK.gull2(g, c, Math.sin(a) > 0 ? -1 : 1, true, st.k % 2);
    } });

  /* ---------------- Mount Fuji ----------------
     Fuji as it stands over Shizuoka's tea country: the broad cone, steeper towards the flat top, the Hōei crater's
     shoulder on its right flank, the snow (deep in January, a cap in April and late November, gone by late July), the
     dark Aokigahara forest along its foot. In front, rows of tea bushes clipped round, the frost fans on their poles, two
     pickers in sedge hats; a farmer's kei truck at the field's end. On the left, the five-storey Chūreitō pagoda among its
     cherries, with a camera always on it; the Tōkaidō shinkansen runs past on its viaduct. */
  SF.tile('fuji', -205, -5, { rim: 96, castAt: 160, order: -3, half: 30 }, function (T) {
    const CAP = TK.summer() ? 0 : TK.winter() ? 0.62 : TK.autumn() ? 0.3 : 0.4;
    const ROWS = []; for (let k = 0; k < 11; k++) ROWS.push({ y0: -1 + k * 2.5, x0: k < 3 ? -6 : -11 + k * 0.4, x1: k < 2 ? 7.4 : 26 - k * 0.6 });
    const rowY = (r, x) => r.y0 + 0.9 * Math.sin(x * 0.11 + r.y0 * 0.2);
    /* the tea: rounded hedges, each with its sunlit top and shaded front. A row is drawn between xa and xb along its
       24 samples (cut where it is cut). Each row stands up in pieces of 2 u (small props), each an object over the
       ground it covers, so a picker between two rows is behind the row in front of her; the stretch under the
       shinkansen's deck stays on the ground, under the viaduct (VX0..VX1: from 2 u short of the train's line, x 10, so
       no piece behind the viaduct can count as in front of a car on it and draw it under the deck). */
    const VX0 = 8.0, VX1 = 11.6;
    const hedge = (g, r, xa, xb) => {
      const n = 24, S = [];
      for (let i = 0; i <= n; i++) { const x = lerp(r.x0, r.x1, i / n), y = rowY(r, x), bump = 0.12 * Math.sin(i * 2.3 + r.y0); S.push({ x, y, z: 1.15 + bump, i }); }
      const pts = [], at = (x) => { for (let i = 0; i < n; i++) if (x >= S[i].x && x <= S[i + 1].x) { const u = (x - S[i].x) / (S[i + 1].x - S[i].x || 1); return { x, y: lerp(S[i].y, S[i + 1].y, u), z: lerp(S[i].z, S[i + 1].z, u), i: -1 }; } return null; };
      xa = Math.max(xa, r.x0); xb = Math.min(xb, r.x1); if (xb - xa < 0.01) return null;
      pts.push(at(xa)); for (const q of S) if (q.x > xa + 1e-6 && q.x < xb - 1e-6) pts.push(q); pts.push(at(xb));
      if (!g) return pts;
      const top = pts.map((q) => [q.x, q.y - 0.75, q.z]), fr = pts.map((q) => [q.x, q.y + 0.75, q.z]), base = pts.map((q) => [q.x, q.y + 0.95, 0]);
      g.fill(top.concat(fr.slice().reverse()), '#8CC062');
      g.fill(fr.concat(base.slice().reverse()), '#5E8F44');
      g.fill(top.map((p) => [p[0], p[1] + 0.2, p[2] + 0.02]).concat(top.map((p) => [p[0], p[1] + 0.55, p[2] + 0.02]).reverse()), '#A6D27A');
      g.line(base, { w: 0.45, c: '#3F6230', boil: false }); g.fine(top, { w: 0.3, c: '#5E8F44' });
      const tk = []; pts.forEach((q, j) => { if (q.i < 0 || q.i % 2) return; const p = g.p(fr[j][0], fr[j][1], fr[j][2]), b = g.p(base[j][0], base[j][1], 0.2); tk.push(p[0], p[1] + 0.6, lerp(p[0], b[0], 0.5) + 0.3, lerp(p[1], b[1], 0.6)); });
      g.segs2(tk, '#4B7436', 0.25);
      return pts;
    };
    T.ground(function (g) {
      blob(g, [[-31, -14], [-22, -30], [4, -31], [26, -24], [31, 0], [27, 26], [4, 31], [-22, 29], [-31, 12]], '#B5CF8E', 3);
      // the farm road and the earth between the tea rows
      g.fill([[-13.4, -6, 0], [-11.4, -6, 0], [-10.6, 31, 0], [-12.8, 31, 0]], '#D9C9A6');
      g.fill([[-11, -3, 0], [28, -3, 0], [27, 28, 0], [-10.6, 28, 0]], '#B9A27D');
      g.scuff([[-11, -3, 0], [28, -3, 0], [27, 28, 0], [-10.6, 28, 0]], { dir: 0.3, len: 3, c: '#A89169', dens: 0.6, w: 0.4 });
      // the tea under the shinkansen viaduct (the rest of each row stands up, below)
      for (const r of ROWS) hedge(g, r, VX0, VX1);
      // the pagoda's terrace and the steps up to it
      g.fill([[-29, 6, 0], [-17, 6, 0], [-17, 18, 0], [-29, 18, 0]], '#D9D2C2');
      g.outline([[-29, 6, 0], [-17, 6, 0], [-17, 18, 0], [-29, 18, 0]], { w: 0.5, c: '#9A948A', boil: false });
      const st = []; for (let y = 18.6; y < 27; y += 0.8) { const a = g.p(-24.4, y, 0), b = g.p(-21.6, y, 0); st.push(a[0], a[1], b[0], b[1]); } g.segs2(st, '#9A948A', 0.35);
    });
    for (const r of ROWS) {
      const cuts = [r.x0]; for (let x = Math.ceil(r.x0 / 2) * 2; x < r.x1; x += 2) if (x > r.x0 + 0.3 && x < r.x1 - 0.3 && !(x > VX0 - 0.3 && x < VX1 + 0.3)) cuts.push(x);
      if (r.x0 < VX0 && r.x1 > VX1) cuts.push(VX0, VX1);
      cuts.push(r.x1); cuts.sort((a, b) => a - b);
      for (let k = 0; k + 1 < cuts.length; k++) {
        const xa = cuts[k], xb = cuts[k + 1];
        if (xa >= VX0 - 1e-6 && xb <= VX1 + 1e-6) continue;          // under the deck: on the ground
        const pts = hedge(null, r, xa, xb); if (!pts) continue;
        const y0 = Math.min(...pts.map((q) => q.y)) - 0.75, y1 = Math.max(...pts.map((q) => q.y)) + 0.95;
        T.obj([xa, y0, xb, y1], (g) => hedge(g, r, xa, xb), { name: 'tea' });
      }
    }
    // the mountain, painted on the sky behind everything
    T.obj([-30, -31, 20, -10], function (g) {
      g.boilP = 0.15;
      const c = g.p(-5, -16, 0), W = 152, Hh = 140, top = c[1] - Hh, wt = 14;
      const hw = (h) => wt + (W - wt) * Math.pow(1 - h, 1.75);
      const L = [], R = [];
      for (let i = 0; i <= 24; i++) { const h = i / 24, y = c[1] - Hh * h; L.push([c[0] - hw(h) * (1 + 0.02 * Math.sin(i)), y]); R.push([c[0] + hw(h) + (h > 0.42 && h < 0.62 ? Math.sin((h - 0.42) / 0.2 * Math.PI) * 7 : 0), y]); }
      const sum = [[c[0] - wt, top], [c[0] - wt * 0.4, top - 1.6], [c[0] + wt * 0.3, top - 0.8], [c[0] + wt, top]];
      const body = L.slice(0, 24).concat(sum, R.slice(0, 24).reverse());
      const bodyCol = TK.summer() ? '#6F7FA0' : '#8499B8', shCol = TK.summer() ? '#5A6888' : '#6E82A3';
      g.fill2(body, bodyCol);
      // the shaded flank: from the summit's right half down to a line a little right of the middle
      g.fill2([[c[0] + wt * 0.3, top - 0.8], [c[0] + wt, top]].concat(R.slice(0, 24).reverse(), [[c[0] + W * 0.18, c[1]], [c[0] + wt * 0.5, top + 6]]), shCol);
      // the forest along the foot
      const fo = []; for (let i = 0; i <= 30; i++) { const x = c[0] - W * 0.86 + (2 * W * 0.86) * i / 30, edge = Math.abs(x - c[0]) / W; fo.push([x, c[1] - 7 - (1 - edge) * 9 - Math.sin(i * 1.9) * 2.2]); }
      g.fill2(fo.concat([[c[0] + W * 0.86, c[1] + 2], [c[0] - W * 0.86, c[1] + 2]]), '#5E7F55');
      g.fill2(fo.filter((p) => p[0] > c[0] + 10).concat([[c[0] + W * 0.86, c[1] + 2], [c[0] + 10, c[1] + 2]]), '#4E6E48');
      const tt = []; for (let i = 0; i < 26; i++) { const p = fo[i]; tt.push(p[0], p[1], p[0] + 1.4, p[1] - 1.8, p[0] + 1.4, p[1] - 1.8, p[0] + 2.8, p[1] - 0.2); } g.segs2(tt, '#3F5F3C', 0.3);
      // the snow: ragged at its foot, fingers of it down the gullies
      if (CAP > 0) {
        const hc = CAP, n = 22, Q = RNG(5151), bot = c[1] - Hh * (1 - hc), hw0 = hw(1 - hc), edge = [];
        for (let i = 0; i <= n; i++) { const t = i / n, x = c[0] + lerp(hw0, -hw0, t), f = (i % 4 === 1 ? 1 : i % 4 === 3 ? 0.35 : 0.08) * (0.5 + Q() * 0.5); edge.push([x, bot + f * Hh * 0.16 * Math.sqrt(Math.max(0.1, 1 - Math.abs(2 * t - 1) * 0.6))]); }
        const sideR = [], sideL = []; for (let i = 0; i <= 8; i++) { const h = 1 - (1 - hc) * i / 8; sideR.push([c[0] + hw(h) + 0.3, c[1] - Hh * h]); sideL.push([c[0] - hw(h) - 0.3, c[1] - Hh * h]); }
        const sn = sum.slice().concat(sideR.slice(1), K.curve(edge, 3, false), sideL.slice(1).reverse());
        g.fill2(sn, '#F8F7F2'); g.mark({ nc: (q) => mix(nightColour(q), q, 0.25) });
        g.fill2([[c[0] + wt * 0.3, top - 0.8], [c[0] + wt, top]].concat(sideR.slice(1), K.curve(edge, 3, false).filter((p) => p[0] > c[0] + W * 0.14), [[c[0] + W * 0.14 * (1 - hc) + wt * 0.5, bot + 4], [c[0] + wt * 0.5, top + 6]]), '#D3DCE7');
        g.line2(K.curve(edge, 3, false), { w: 0.35, c: '#9AAAC0', boil: false });
      }
      // gullies running down from the crater, the line of the summit
      const gs = []; for (let i = 0; i < 9; i++) { const u = (i - 4) / 4.4, a = [c[0] + u * wt * 0.9, top + 2], h = 0.25 + 0.15 * ((i * 7) % 3), b = [c[0] + u * hw(h) * 0.95, c[1] - Hh * h]; gs.push(a[0], a[1], lerp(a[0], b[0], 0.6), lerp(a[1], b[1], 0.6)); }
      g.segs2(gs, TK.summer() ? '#4E5C7A' : '#6C80A0', 0.35);
      g.line2(body, { w: 0.95, c: '#44536C', boil: false });
    }, { name: 'fuji' });

    // the Chūreitō: five storeys of vermilion under dark roofs, its spire of rings; cherries round it
    T.obj([-26.5, 9, -19.5, 16], function (g) {
      g.boilP = 0.25;
      const cx = -23, cy = 12.5, RED = { t: '#C24A33', l: '#D4553A', r: '#B9432C' };
      K.box(g, cx - 3.4, cy - 3.4, cx + 3.4, cy + 3.4, 0, 0.9, { t: '#E2DCCE', l: '#D9D2C2', r: '#C9C0AE' }, { w: 0.6 });
      let z = 0.9;
      for (let k = 0; k < 5; k++) {
        const s = 2.5 - k * 0.26, h = 2.1 - k * 0.1;
        K.box(g, cx - s, cy - s, cx + s, cy + s, z, z + h, RED, { w: 0.6, boil: false });
        const pl = []; for (const f of [-0.5, 0.5]) { let a = g.p(cx + f * s * 1.2, cy + s + 0.02, z), b = g.p(cx + f * s * 1.2, cy + s + 0.02, z + h); pl.push(a[0], a[1], b[0], b[1]); a = g.p(cx + s + 0.02, cy + f * s * 1.2, z); b = g.p(cx + s + 0.02, cy + f * s * 1.2, z + h); pl.push(a[0], a[1], b[0], b[1]); }
        g.segs2(pl, '#8A2E22', 0.3);
        g.fill(K.on('L', cy + s + 0.03, cx - 0.5, cx + 0.5, z + 0.1, z + h * 0.75), '#3A2A22');
        g.fill(K.on('L', cy + s + 0.03, cx - s, cx + s, z + h - 0.4, z + h), '#F1EFE8');
        g.fill(K.on('R', cx + s + 0.03, cy - s, cy + s, z + h - 0.4, z + h), '#E2DED4');
        TK.roof(g, cx - s, cy - s, cx + s, cy + s, z + h, 1.0, { over: 1.3, lift: 0.55, col: '#3F4A5C', sp: 0.7 });
        z += h + 0.95;
      }
      const sp0 = g.p(cx, cy, z), sp1 = g.p(cx, cy, z + 5.2); g.line2([sp0, sp1], { w: 0.8, c: '#5A4A3C', boil: false });
      const rg = []; for (let i = 1; i < 8; i++) { const p = g.p(cx, cy, z + 0.4 + i * 0.5); rg.push(p[0] - 1.4 + i * 0.08, p[1], p[0] + 1.4 - i * 0.08, p[1]); } g.segs2(rg, '#9A7A2A', 0.6);
      g.disc2(sp1, 0.6, '#DAAD45');
    }, { name: 'churei-to' });
    [[-27.5, 18.5], [-17.4, 18.0], [-28, 6.4], [-15.4, 5.0]].forEach(([x, y], i) => T.obj([x, y], (g) => TK.sakura(g, x, y, { r: 3.0, h: 3.0, seed: 911 + i * 13 })));

    // frost fans over the tea, each on its pole; a kei truck at the field's end
    [[-2, 4.5], [17, 2.2], [-4, 17], [16, 19.6], [4, 25]].forEach(([x, y]) => T.obj([x, y], (g) => {
      const b = g.p(x, y, 0), t = g.p(x, y, 7.2); g.fill2([[b[0] - 0.45, b[1]], [b[0] + 0.45, b[1]], [t[0] + 0.3, t[1]], [t[0] - 0.3, t[1]]], '#9FA39E'); g.line2([b, t], { w: 0.4, c: '#5A564E', boil: false });
      const m = [t[0] + 1.2, t[1] - 0.4]; g.fill2([[t[0] - 0.4, t[1] - 0.6], [m[0] + 0.6, m[1] - 0.6], [m[0] + 0.8, m[1] + 0.7], [t[0] - 0.4, t[1] + 0.5]], '#D9DCDA', true);
      const rim = []; for (let i = 0; i < 12; i++) { const a = TAU * i / 12; rim.push([m[0] + 1.2 + Math.cos(a) * 0.9, m[1] + 0.6 + Math.sin(a) * 2.6]); } g.fill2(rim, '#C3C8C6', true); g.line2(rim, { w: 0.35, c: '#5A564E', close: true, boil: false });
      g.segs2([m[0] + 1.2, m[1] - 1.8, m[0] + 1.2, m[1] + 3.0, m[0] + 0.5, m[1] + 0.6, m[0] + 1.9, m[1] + 0.6], '#6B6458', 0.3);
    }));
    T.obj([-14.1, 20.1, -9.9, 28.9], (g) => g.at(-12, 24.5, 0, (g2) => TK.kei(g2, Math.PI / 2, { cargo: (g3, bed) => { for (const [u, v] of [[-0.6, -0.4], [0.6, 0.4], [-0.6, 0.5]]) { const p = bed.pt(u * 1.8, v * 1.6, 2.0); K.box(g3, p[0] - 0.5, p[1] - 0.5, p[0] + 0.5, p[1] + 0.5, 2.0, 2.9, '#5F8FC9', { w: 0.35, boil: false }); } } })));

    // the pickers along the rows (sedge hats, baskets), each in the furrow just behind row k, which hides her legs;
    // a farmer on the road up to the back of his truck; the photographers at the pagoda
    const picker = (seed, x, k, dir, ph) => T.actor({ sample: 0.25, period: 8, grow: false,
      at(t) { const f = Math.floor((t + ph) * 2) % 8, u = ((t + ph) / 8) % 1, xx = x + (u < 0.5 ? u : 1 - u) * 5; return { x: xx, y: rowY(ROWS[k], xx) - 0.9, z: 0, key: f, f }; },
      draw(g, st) {
        const w = Object.assign(TK.who(seed), { top: '#3F5F8F', bot: '#3F5F8F', bare: false, shorts: false, coat: false, higasa: undefined, uchiwa: undefined, muffler: undefined, cap: undefined });
        const up = st.f === 7, hands = up ? [[-1.4, -12.4], [2.2, -13.6]] : [[1.6, -8.6 + (st.f % 2) * 0.6], [3.2, -7.8 - (st.f % 2) * 0.7]];
        const r = TK.person(g, 0, 0, 0, Object.assign(w, { dir, lean: up ? 0.2 : 2.2, hands }));
        const c = r.crown, hat = [[c[0] - 4.2, c[1] + 2.1], [c[0], c[1] - 1.6], [c[0] + 4.2, c[1] + 2.1], [c[0], c[1] + 2.9]];
        g.fill2(hat, '#D9C48A', true); g.line2(hat, { w: 0.35, c: '#8A7444', close: true, boil: false });
        const h = r.hip, bk = [[h[0] - 2.0, h[1] - 1.0], [h[0] + 2.0, h[1] - 1.0], [h[0] + 1.6, h[1] + 2.0], [h[0] - 1.6, h[1] + 2.0]];
        g.fill2(bk, '#C9A26B', true); g.segs2([bk[0][0], bk[0][1] + 1, bk[1][0], bk[1][1] + 1], '#8A6A3A', 0.3); g.line2(bk, { w: 0.3, c: '#6B4F35', close: true, boil: false });
      } });
    picker(6501, 0, 3, 1, 0); picker(6502, 13, 6, 1, 3.1); picker(6503, 4, 9, 3, 5.6);   // the second one clear of the viaduct
    K.walker(T, TK.who(6504, { cap: '#E3D3A0' }), [[-12, -4], [-11.8, 19.2], [-12.2, 19.4], [-12.4, -4]], 1.3, { phase: 0.2 });
    TK.photo(T, { who: TK.who(6505, { dir: 3 }), x: -22.6, y: 24.2 }, [{ who: TK.who(6506, { dir: 1 }), x: -24.0, y: 19.6 }, { who: TK.kimono(6507, { dir: 1 }), x: -21.8, y: 19.8 }], { seed: 6 });
    TK.idle(T, TK.who(6508, { dir: 3 }), -17.6, 21.8, { acts: ['photo', 'photo', 'look', 'point'], seed: 6508 });   // not straight behind the kimono

    // the shinkansen on its viaduct: piers, the deck with its low walls, catenary masts; an N700 every fourteen seconds
    T.obj([8.4, -26, 11.6, 26], (g) => {
      g.boilP = 0.2;
      for (let y = -24; y < 26; y += 6) K.box(g, 9.4, y - 0.5, 10.6, y + 0.5, 0, 2.2, { t: '#D7D2C6', l: '#E4E0D6', r: '#C9C3B6' }, { w: 0.5, boil: false });
      K.box(g, 8.4, -26, 11.6, 26, 2.2, 3.0, { t: '#C9C3B6', l: '#E4E0D6', r: '#D7D2C6' }, { w: 0.7 });
      K.box(g, 11.3, -26, 11.6, 26, 3.0, 3.8, { t: '#E9E6DE', l: '#F1EFE8', r: '#E4E0D6' }, { w: 0.5, boil: false });
      const ms = []; for (let y = -22; y < 26; y += 8) { const a = g.p(8.6, y, 3.0), b = g.p(8.6, y, 8.4), c2 = g.p(10.6, y, 8.0); ms.push(a[0], a[1], b[0], b[1], b[0], b[1], c2[0], c2[1]); } g.segs2(ms, '#6B6458', 0.45);
      g.fine([[10, -26, 7.6], [10, 26, 7.6]], { w: 0.25, c: '#5A564E' });
    }, { name: 'viaduct', under: 3.0 });
    for (let i = 0; i < 6; i++) T.actor({ sample: 0.3, period: 14, grow: false,
      at(t) { const u = (t / 14) % 1, y = -40 + u * 80 - i * 9.4; if (y < -24 || y > 24) return null; const a = Math.min(1, (y + 24) / 4, (24 - y) / 4); return { x: 10, y, z: 3.0, key: 0, alpha: a < 1 ? a : null, ext: [1.55, 4.6] }; },
      draw(g) { TK.trainCar(g, Math.PI / 2, { kind: 'shin', cab: i === 0 ? 1 : i === 5 ? -1 : 0 }); } });
  });

  /* ---------------- Tokyo Skytree ----------------
     634 m, the tallest tower in the world: a white steel lattice (aijiro, Skytree white) that stands on a tripod and
     rounds off into a circle by 300 m; the Tembo Deck (340-350 m, three floors of glass) and the slimmer Tembo Galleria
     (445-450 m, a glass ramp spiralling up), then the antenna mast (the gain tower) to the top. Tokyo Solamachi wraps its
     foot; the Sumida runs past on the west with Sumida Park's cherries on its bank and the red Azuma Bridge over it; the
     Himiko water bus comes up the river. At night the tower is lit Iki blue; on the fireworks night in July shells burst
     over the river beside it. */
  SF.tile('skytree', 75, -200, { rim: 90, castAt: 160, order: -3, half: 30 }, function (T) {
    const TX = -2, TY = -9, H = 124, MU = H / 634;              // the tower's foot (tile-local), its height, u per metre
    // the silhouette radius (m) at a height (m): the tripod's corners stand out a little further while it is a tripod
    const PROF = [[0, 31], [60, 25.5], [150, 21.4], [250, 18.4], [330, 16.8], [400, 15.2], [445, 14.4], [495, 12.0]];
    const rM = (m) => { for (let i = 1; i < PROF.length; i++) if (m <= PROF[i][0]) { const a = PROF[i - 1], b = PROF[i]; return lerp(a[1], b[1], (m - a[0]) / (b[0] - a[0])); } return 12; };
    const tri = (m) => 1 - smooth(clamp(m / 300, 0, 1));
    const vis = (m) => lerp(0.25, 1 / 3, tri(m));                // the part we see runs from -vis to +vis round the section
    // a point on the section at height m (metres); t: round from the corner that points at us
    const sp = (m, t) => {
      const r = rM(m) * MU, s = tri(m), Rt = r * 1.16, phi = Math.PI / 4 + TAU * t;
      const tt = ((t % 1) + 1) % 1, e = Math.floor(tt * 3), u = tt * 3 - e, a0 = Math.PI / 4 + e * TAU / 3, a1 = a0 + TAU / 3;
      const qx = lerp(Math.cos(a0), Math.cos(a1), u) * Rt, qy = lerp(Math.sin(a0), Math.sin(a1), u) * Rt;
      return [TX + lerp(Math.cos(phi) * r, qx, s), TY + lerp(Math.sin(phi) * r, qy, s), m * MU];
    };
    const Z = (m) => m * MU;
    const W1 = '#EEF2F3', W2 = '#D7E0E6', W3 = '#C3CFD8', INK = '#5B6D7C', LAT = '#9FAEBB';
    const GLASS = '#7C9DB8', GLASSD = '#5F7F9C';
    // a drum (or a frustum) round the tower's axis: the half we see, lit on the left
    const drum = (g, z0, r0, z1, r1, cl, cr, w) => {
      const n = 18, f0 = K.arc(TX, TY, z0, r0, A_L, A_R, n), f1 = K.arc(TX, TY, z1, r1, A_R, A_L, n);
      g.fill(f0.concat(f1), cl);
      const k = Math.round(n * 0.58); g.fill(f0.slice(k).concat(f1.slice(0, n - k + 1)), cr);
      if (w) { g.line(f0, { w, c: INK, boil: false }); g.line([f0[0], f1[n]], { w: w * 0.9, c: INK, boil: false }); g.line([f0[n], f1[0]], { w: w * 0.9, c: INK, boil: false }); }
    };
    // a glass band on a drum: panes between mullions, floor lines
    const band = (g, z0, z1, r, n, floors, diag) => {
      const f0 = K.arc(TX, TY, z0, r + 0.02, A_L, A_R, 18), f1 = K.arc(TX, TY, z1, r + 0.02, A_R, A_L, 18);
      g.fill(f0.concat(f1), GLASS); g.mark({ nc: '#F6D79A' });
      const k = 11; g.fill(f0.slice(k).concat(f1.slice(0, 18 - k + 1)), GLASSD); g.mark({ nc: '#E9BF7E' });
      const s = [];
      for (let i = 1; i < n; i++) { const a = A_L + (A_R - A_L) * i / n, p0 = g.p(TX + Math.cos(a) * r, TY + Math.sin(a) * r, z0), p1 = diag ? g.p(TX + Math.cos(a - 0.35) * r, TY + Math.sin(a - 0.35) * r, z1) : g.p(TX + Math.cos(a) * r, TY + Math.sin(a) * r, z1); s.push(p0[0], p0[1], p1[0], p1[1]); }
      for (const z of floors || []) { const pts = K.arc(TX, TY, z, r + 0.03, A_L, A_R, 18).map((q) => g.p(q[0], q[1], q[2])); for (let i = 0; i + 1 < pts.length; i++) s.push(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]); }
      g.segs2(s, '#E8EEF1', 0.3);
      const hi = []; for (let i = 0; i < 5; i++) { const a = 2.0 - i * 0.22, p = g.p(TX + Math.cos(a) * r, TY + Math.sin(a) * r, lerp(z0, z1, 0.25)), q = g.p(TX + Math.cos(a - 0.08) * r, TY + Math.sin(a - 0.08) * r, lerp(z0, z1, 0.8)); hi.push(p[0], p[1], q[0], q[1]); }
      g.segs2(hi, '#DCEAF2', 0.45);
    };

    T.ground(function (g) {
      blob(g, [[-30, -12], [-24, -29], [0, -31], [26, -26], [31, -4], [28, 22], [6, 30], [-20, 30], [-31, 14]], '#E6E1D6', 7);
      // Sumida Park's lawn along the east bank, the lawn at the front
      g.fill([[-15, -29, 0], [-9.5, -29, 0], [-9.5, 26, 0], [-15, 26, 0]], '#B5CF8E');
      g.fill([[-6, 15, 0], [24, 15, 0], [22, 26, 0], [-6, 27, 0]], '#B5CF8E');
      g.grass([[-15, -29, 0], [-9.5, -29, 0], [-9.5, 26, 0], [-15, 26, 0]], { dens: 0.5 });
      // the plaza: paving joints
      const j = []; for (let x = -8; x <= 26; x += 3.4) { const a = g.p(x, -2, 0), b = g.p(x, 14, 0); j.push(a[0], a[1], b[0], b[1]); }
      for (let y = -2; y <= 14; y += 3.4) { const a = g.p(-8, y, 0), b = g.p(26, y, 0); j.push(a[0], a[1], b[0], b[1]); }
      g.segs2(j, '#D3CDBF', 0.25);
      // the Sumida, wide, with its stone embankment; the far (Asakusa) bank
      const river = K.curve([[-31, -31, 0], [-16, -31, 0], [-15.4, -10, 0], [-16.2, 10, 0], [-15.4, 31, 0], [-31, 31, 0]], 4, false);
      g.fill(river, C.water); g.water(river.map((p) => [p[0] + 0.6, p[1], 0]), { dens: 1.0 });
      g.line([[-16, -30, 0], [-15.4, -10, 0], [-16.2, 10, 0], [-15.4, 30, 0]], { w: 0.55, c: '#5F7F9C', boil: false });
      g.fine([[-16.6, -30, 0], [-16, -10, 0], [-16.8, 10, 0], [-16, 30, 0]], { w: 0.3, c: '#8BA3BD' });
      g.fill([[-34, -31, 0], [-29, -31, 0], [-29.4, 31, 0], [-34, 31, 0]], '#B5CF8E');
      g.line([[-29, -30, 0], [-29.4, 30, 0]], { w: 0.5, c: '#5F7F9C', boil: false });
      // the path along the bank
      g.fill([[-9.5, -29, 0], [-7.6, -29, 0], [-7.6, 26, 0], [-9.5, 26, 0]], '#E9E2CF');
    });

    // the tower, on the Tower Yard podium that wraps its foot
    T.obj([TX - 7.5, TY - 7.5, TX + 7.5, TY + 7.5], function (g) {
      g.boilP = 0.2;
      const i0 = g.cmds.length, ZP = 5.4;
      K.box(g, TX - 7.5, TY - 7.5, TX + 7.5, TY + 7.5, 0, ZP, { t: '#DDE1E3', l: '#EEF0EF', r: '#D8DEE2' }, { w: 0.8 });
      K.win(g, 'L', TY + 7.5, TX - 7.0, TX + 7.0, 0.3, 2.6, { style: 'glass', col: '#E9D3A6', lit: 1 });
      K.win(g, 'R', TX + 7.5, TY - 7.0, TY + 7.0, 0.3, 2.6, { style: 'glass', col: '#E9D3A6', lit: 1 });
      for (const [f, p, a0, a1] of [['L', TY + 7.5, TX - 7, TX + 7], ['R', TX + 7.5, TY - 7, TY + 7]]) {
        K.win(g, f, p, a0, a1, 3.2, 4.8, { style: 'glass', lit: 0.4 });
        const s = []; for (let a = a0 + 1.4; a < a1; a += 1.4) { const q0 = g.p.apply(g, K.pt(f, p + 0.03, a, 0.3)), q1 = g.p.apply(g, K.pt(f, p + 0.03, a, 4.8)); s.push(q0[0], q0[1], q1[0], q1[1]); }
        g.segs2(s, '#8C9AA6', 0.28);
      }
      K.sign(g, 'L', TY + 7.5, TX - 4.2, TX + 4.2, 2.75, 3.45, '#2F4A6E', 'TOKYO SKYTREE', { ink: '#F6F5F1' }); g.mark({ nc: true });
      // the body: the tripod's two faces we see (the corner between them points at us), rounding into the shaft
      const m0 = ZP / MU, lev = []; for (let m = m0; m < 495; m += 8) lev.push(m); lev.push(495);
      const at = (m, t) => g.p.apply(g, sp(m, t));
      const L = lev.map((m) => at(m, vis(m))), Rr = lev.map((m) => at(m, -vis(m))), F = lev.map((m) => at(m, 0)), D = lev.map((m) => at(m, -vis(m) * lerp(0.6, 1, tri(m))));
      g.fill2(L.concat(Rr.slice().reverse()), W1);
      g.fill2(F.concat(Rr.slice().reverse()), W2);
      g.fill2(D.concat(Rr.slice().reverse()), W3);
      // the lattice: diagonals both ways, rings
      const NJ = 12, dg = [], rg = []; let prev = null;
      for (let m = m0; m <= 497; m += 12.5) {
        const v = vis(m), row = []; for (let j = 0; j <= NJ; j++) row.push(at(m, -v + 2 * v * j / NJ));
        if (prev) for (let j = 0; j < NJ; j++) dg.push(prev[j][0], prev[j][1], row[j + 1][0], row[j + 1][1], prev[j + 1][0], prev[j + 1][1], row[j][0], row[j][1]);
        if (Math.round((m - m0) / 12.5) % 2 === 0) for (let j = 0; j < NJ; j++) rg.push(row[j][0], row[j][1], row[j + 1][0], row[j + 1][1]);
        prev = row;
      }
      g.segs2(dg, LAT, 0.24); g.segs2(rg, '#AEBBC6', 0.26);
      // the three legs (two on the silhouette, one pointing at us), heavy at the foot
      const leg = lev.filter((m) => m < 300).map((m) => at(m, 0));
      g.line2(leg, { w: 0.6, c: '#7D8E9C', boil: false });
      g.line2(L, { w: 0.8, c: INK, boil: false }); g.line2(Rr, { w: 0.8, c: INK, boil: false });
      // Tembo Deck: an underside flaring out, three floors of glass, a roof, a cap back to the shaft
      const RD = 5.1, RG = 3.65, rs = (m) => rM(m) * MU;
      drum(g, Z(326), rs(326), Z(338), RD, W2, W3, 0.6);
      drum(g, Z(338), RD, Z(354), RD, W1, W3, 0.75);
      band(g, Z(339.5), Z(352.5), RD, 22, [Z(344), Z(348.5)]);
      drum(g, Z(354), RD + 0.1, Z(357), RD + 0.1, W1, W2, 0.6);
      drum(g, Z(357), RD - 0.3, Z(368), rs(368), W1, W3, 0.6);
      // Tembo Galleria: slimmer, its glass ramp climbing round
      drum(g, Z(436), rs(436), Z(443), RG, W2, W3, 0.55);
      drum(g, Z(443), RG, Z(452), RG, W1, W3, 0.65);
      band(g, Z(444), Z(451), RG, 14, [], true);
      drum(g, Z(452), RG - 0.2, Z(460), rs(460), W1, W3, 0.55);
      // the top of the shaft and the gain tower: a slim white lattice mast with its antenna rings, then the spire
      drum(g, Z(495), rs(495), Z(503), 1.25, W1, W3, 0.6);
      const gz0 = Z(503), gz1 = Z(622), gr = (z) => lerp(1.25, 0.5, (z - gz0) / (gz1 - gz0));
      const gl = [], gR = [], gs = [];
      for (let z = gz0; z <= gz1 + 0.01; z += 1.7) { const a = g.p(TX, TY, z), r = gr(z) * 4.13; gl.push([a[0] - r, a[1]]); gR.push([a[0] + r, a[1]]); }
      g.fill2(gl.concat(gR.slice().reverse()), W1); g.fill2(gl.map((p, i) => [lerp(p[0], gR[i][0], 0.55), p[1]]).concat(gR.slice().reverse()), W2);
      for (let i = 0; i + 1 < gl.length; i++) gs.push(gl[i][0], gl[i][1], gR[i + 1][0], gR[i + 1][1], gR[i][0], gR[i][1], gl[i + 1][0], gl[i + 1][1]);
      g.segs2(gs, LAT, 0.22); g.line2(gl, { w: 0.6, c: INK, boil: false }); g.line2(gR, { w: 0.6, c: INK, boil: false });
      for (const m of [530, 565, 598]) drum(g, Z(m), gr(Z(m)) + 0.45, Z(m) + 0.7, gr(Z(m)) + 0.45, W1, W2, 0.4);
      const tp = g.p(TX, TY, H); g.line2([g.p(TX, TY, gz1), tp], { w: 0.7, c: INK, boil: false });
      // aviation lights
      for (const z of [Z(357), Z(452), Z(598) + 0.7, H]) { const c = g.p(TX + 0.6, TY + 0.6, z); g.disc2(c, 0.55, '#E0503E'); }
      // at night the tower is lit Iki blue (its deck glass warm); the beacon on top glows red
      const SKY = { [W1]: '#A9DCF6', [W2]: '#82BFE4', [W3]: '#6AA4CF', '#EEF0EF': undefined };
      g.mark({ nc: (c) => SKY[c] }, i0 + 40);
      for (const z of [10, 24, 38, 52, 72, 92, 100, 112]) g.glow('lantern', TX, TY, z, { r: z < 60 ? 3.6 : z < 95 ? 2.6 : 1.6, col: '#8FD3FF' });
      g.glow('lantern', TX, TY, Z(346), { r: 4.2, col: '#FFE2A0' }); g.glow('lantern', TX, TY, Z(448), { r: 3, col: '#FFE2A0' });
      g.glow('lantern', TX, TY, H, { r: 1.0, col: '#FF5A48' });
    }, { name: 'skytree' });

    // Tokyo Solamachi's East Yard, along the foot to the east: glass and white fins, a garden on the roof
    T.obj([6, -15, 28, -4], function (g) {
      g.boilP = 0.25;
      K.box(g, 6, -15, 28, -4, 0, 8.2, { t: '#D9DCD9', l: '#F1F0EC', r: '#DCDDDA' }, { w: 0.85 });
      K.win(g, 'L', -4, 6.4, 27.6, 0.3, 2.7, { style: 'glass', col: '#E9D3A6', lit: 1 });
      K.win(g, 'R', 28, -14.6, -4.4, 0.3, 2.7, { style: 'glass', col: '#E9D3A6', lit: 1 });
      for (const z of [3.4, 5.4]) { K.win(g, 'L', -4, 6.4, 27.6, z, z + 1.3, { style: 'glass', lit: 0.5 }); K.win(g, 'R', 28, -14.6, -4.4, z, z + 1.3, { style: 'glass', lit: 0.5 }); }
      const f = []; for (let a = 7.4; a < 27.6; a += 1.05) { const p0 = g.p(a, -3.96, 3.0), p1 = g.p(a, -3.96, 8.0); f.push(p0[0], p0[1], p1[0], p1[1]); }
      for (let a = -14.2; a < -4.4; a += 1.05) { const p0 = g.p(28.04, a, 3.0), p1 = g.p(28.04, a, 8.0); f.push(p0[0], p0[1], p1[0], p1[1]); }
      g.segs2(f, '#A9B4BC', 0.3);
      // shop awnings and the sign
      for (let a = 7; a < 27; a += 4.2) TK.awning(g, 'L', -4, a, a + 3.4, 2.9, 0.8, ['#C9584B', '#3F5F8F', '#E6C24F', '#5E8A4A', '#D98AA4'][Math.round(a) % 5], { drop: 0.35, stripe: '#F6F3EA' });
      K.sign(g, 'L', -4, 14, 25.6, 6.95, 7.9, '#F6F5F1', 'TOKYO SOLAMACHI', { ink: '#3F5F8F', line: false });
      // the roof garden
      g.fill([[7.2, -14.2, 8.22], [27.2, -14.2, 8.22], [27.2, -4.8, 8.22], [7.2, -4.8, 8.22]], '#B5CF8E');
      g.outline([[7.2, -14.2, 8.22], [27.2, -14.2, 8.22], [27.2, -4.8, 8.22], [7.2, -4.8, 8.22]], { w: 0.35, c: '#788F53', boil: false });
      for (const [x, y] of [[10, -10], [15, -7], [21, -11], [25, -7]]) K.tree(g, x, y, TK.leaves({ r: 1.5, h: 1.6, z: 8.2, seed: x * 3 + 1 }, 'zelkova', x));
      K.box(g, 17, -13.6, 19.6, -11.6, 8.2, 9.4, '#CFCAC0', { w: 0.45, boil: false });
    }, { name: 'solamachi' });

    // Azuma Bridge: three red steel arches across the Sumida
    T.obj([-31, 17, -13, 21], function (g) {
      g.boilP = 0.2;
      K.box(g, -31, 17.4, -13, 20.6, 4.6, 5.3, { t: '#C9C3B6', l: '#C9463E', r: '#A8382F' }, { w: 0.7 });
      for (const y of [17.4, 20.6]) {
        const pts = []; for (let i = 0; i <= 36; i++) { const t = i / 36, x = lerp(-31, -13, t), k = (t * 3) % 1; pts.push([x, y, 4.6 - Math.sin(Math.PI * k) * 3.6]); }
        g.line(pts, { w: y > 19 ? 0.9 : 0.5, c: '#A8382F', boil: false });
        const v = []; for (let i = 1; i < 36; i += 2) { const t = i / 36, x = lerp(-31, -13, t), k = (t * 3) % 1, a = g.p(x, y, 4.6 - Math.sin(Math.PI * k) * 3.6), b = g.p(x, y, 4.6); v.push(a[0], a[1], b[0], b[1]); }
        g.segs2(v, '#C9463E', 0.3);
      }
      for (const x of [-25, -19]) K.box(g, x - 0.5, 17.2, x + 0.5, 20.8, 0, 1.0, '#B9B3A6', { w: 0.5, boil: false });
      const rl = []; for (let x = -30.5; x < -13; x += 1.2) { const a = g.p(x, 20.6, 5.3), b = g.p(x, 20.6, 6.2); rl.push(a[0], a[1], b[0], b[1]); } g.segs2(rl, '#A8382F', 0.3);
      g.line([[-31, 20.6, 6.2], [-13, 20.6, 6.2]], { w: 0.45, c: '#A8382F', boil: false });
      for (const x of [-28, -16]) K.lamp(g, x, 20.4, { z: 5.3, h: 4.2 });
    }, { name: 'azuma bridge', under: 4.6 });

    // Sumida Park's cherries along the bank, lamps and benches on the plaza
    const TREES = [[-12.4, -24], [-12.2, -13], [-12.6, -2], [-12.2, 9]];
    TREES.forEach(([x, y], i) => T.obj([x, y], (g) => TK.sakura(g, x, y, { r: 3.6, h: 3.4, seed: 811 + i * 7 })));
    T.obj([-4, 13], (g) => K.lamp(g, -4, 13, { n: 3, h: 7 }));
    T.obj([16.4, 13.4], (g) => K.lamp(g, 16.4, 13.4, { n: 3, h: 7 }));
    T.obj([12, 13.4], (g) => K.bench(g, 12, 13.4, { face: 'L', L: 2 }));
    T.obj([2, 13.4], (g) => K.bench(g, 2, 13.4, { face: 'L', L: 2 }));
    [[25, 2], [28.2, 8.0], [-5, 3]].forEach(([x, y], i) => T.obj([x, y], (g) => K.tree(g, x, y, TK.leaves({ r: 2.2, h: 2.6, seed: 77 + i }, 'zelkova', i))));   // the second stood inside the kitchen car

    // people: friends photographed with the tower behind them, someone shooting straight up it, a talk on the bench,
    // children chasing on the lawn, a jogger and a dog walk on the riverside path; in spring a hanami party under the
    // cherries, in July yukata on tarps waiting for the fireworks
    TK.photo(T, { who: TK.who(6011, { dir: 3 }), x: 5, y: 9 }, [{ who: TK.who(6012, { dir: 1 }), x: 3.6, y: 3.4 }, { who: TK.kimono(6013, { dir: 1 }), x: 6.0, y: 3.8 }], { seed: 2 });
    TK.idle(T, TK.who(6014, { dir: 3 }), 14, 6, { acts: ['photo', 'photo', 'look', 'scroll', 'point'], seed: 6014 });
    TK.idle(T, TK.who(6015, { dir: 3, lookTo: 3 }), 16, 7.6, { acts: ['look', 'point', 'talk', 'photo'], seed: 6015 });
    TK.group(T, [{ who: TK.salary(6016, { dir: 1, sit: true }), x: 12.8, y: 14.6, z: 1.4 }, { who: TK.who(6017, { dir: 1, sit: true }), x: 11.0, y: 14.6, z: 1.4 }], { seed: 9 });   // on the seat (it faces +y), not behind the back
    TK.chase(T, [TK.pupil(6018, { k: 0.8 }), TK.pupil(6019, { k: 0.78 })], [[0, 18], [12, 18], [14, 23], [2, 24]], 3.2, { gap: 0.12 });
    // the jogger and the dog walk keep to their own sides of the riverside path (the jogger passes the dog walk), and turn
    // in front of the tower's podium, which stands over the path from y -16.5 to -1.5 (the dog trots 3.2 u ahead)
    K.walker(T, TK.who(6020, { top: '#E6C24F', bot: '#2F343B', shorts: true }), [[-8.0, -0.8], [-8.0, 24], [-7.8, 24.6], [-7.8, -1.0]], 5.0, { phase: 0.3 });
    TK.dogWalk(T, TK.who(6021, { dir: 1 }), [[-9.0, 20], [-9.0, 2.4], [-9.2, 2.0], [-9.2, 20.4]], 1.9, '#E8D9B8', { phase: 0.5 });
    T.ground((g) => { TK.tarp(g, [[-14.6, -8, 0.04], [-10.2, -8, 0.04], [-10.2, -3, 0.04], [-14.6, -3, 0.04]]); TK.tarp(g, [[-14.6, 3, 0.04], [-10.4, 3, 0.04], [-10.4, 7.4, 0.04], [-14.6, 7.4, 0.04]], { col: TK.summer() ? '#4F8BD0' : '#E9D7A6' }); }, { season: ['spring', 'summer'] });
    TK.group(T, [{ who: TK.who(6022, { dir: 0, sit: true }), x: -13.6, y: -6.4 }, { who: TK.kimono(6023, { dir: 1, sit: true }), x: -12.0, y: -7.2 }, { who: TK.salary(6024, { dir: 2, sit: true }), x: -10.9, y: -5.0, idle: 'drink' }, { who: TK.who(6025, { dir: 3, sit: true }), x: -12.6, y: -4.0 }], { seed: 21, season: ['spring', 'summer'] });
    TK.group(T, [{ who: TK.kimono(6026, { dir: 1, sit: true }), x: -13.4, y: 4.4 }, { who: TK.kimono(6027, { dir: 2, sit: true }), x: -11.4, y: 5.6 }], { seed: 22, season: ['spring', 'summer'] });
    TK.group(T, [{ who: TK.who(6028, { dir: 1 }), x: -10.8, y: -6 }, { who: TK.who(6029, { dir: 3 }), x: -10.6, y: -2.6 }], { seed: 23, season: ['autumn', 'winter'] });

    // a guided tour: the guide's flag up, her group looking up the tower and photographing it (one actor per person, all
    // on one clock)
    {
      const gw = TK.who(6040, { top: '#E6C24F', cap: '#E6C24F', dir: 1 });
      const TOUR = [[0, -1.6, gw, 1, (f) => [f % 12 < 6 ? 'talk' : 'point', f % 4]], [-1.8, 1.0, TK.who(6041), 3, (f) => [f < 12 ? 'photo' : 'look', 0]], [0.2, 1.6, TK.who(6042), 3, (f) => [f % 8 < 4 ? 'look' : 'listen', f % 2]], [2.0, 0.9, TK.kimono(6043), 3, (f) => [f > 14 ? 'photo' : 'listen', 0]], [-0.6, 3.2, TK.who(6044), 3, (f) => [f % 6 < 3 ? 'point' : 'look', 0]]];
      TOUR.forEach(([x, y, w, dir, act]) => T.actor({ sample: 0.25, period: 12, r: 10,
        at(t) { const f = Math.floor(t * 2) % 24, [a, i] = act(f), A = TK.ACTS[a]; return { x: 19 + x, y: 2.6 + y, key: a + (i % A.n), a, i: i % A.n }; },
        draw(g, st) {
          const r = TK.doing(g, Object.assign({}, w, { dir }), st.a, st.i, 0, 0, 0);
          if (w === gw) { const h = r.hands[0][1] < r.hands[1][1] ? r.hands[0] : r.hands[1], t = [h[0], h[1] - 7]; g.line2([h, t], { w: 0.4, c: '#5A4A3C', boil: false }); g.fill2([t, [t[0] + 3.2, t[1] + 1.0], [t[0], t[1] + 2.0]], '#C9463E', true); }
        } }));
    }
    // a kitchen car selling taiyaki, the queue at its hatch
    T.obj([22.6, 7.8, 27.2, 14.1], (g) => g.at(24.2, 10.8, 0, (g2) => {
      const ang = Math.PI / 2, B = K.rbox(g2, 0, -0.6, 2.4, 1.6, ang, 0.9, 4.6, { t: '#F1EFE8', l: '#F6F5F1', r: '#E4E2DA' }, { w: 0.7 });
      K.wheels(g2, B, [-1.6, 1.6], 0.75, 'near', { arch: '#3F3A34' });
      const C2 = K.rbox(g2, 0, 2.4, 0.9, 1.5, ang, 0.9, 3.6, { t: '#C9463E', l: '#D4553A', r: '#B9432C' }, { w: 0.65 }); K.rwin(g2, C2, 'pu', -0.8, 0.8, 2.4, 3.4);
      const hq = B.quad('nv', -0.7, 0.6, 2.2, 3.6); g2.fill(hq, '#E9C48A'); g2.outline(hq, { w: 0.4, boil: false });
      g2.fill([B.pt(-0.7 * 2.4, -1.6, 3.6), B.pt(0.6 * 2.4, -1.6, 3.6), B.pt(0.6 * 2.4, -3.0, 4.4), B.pt(-0.7 * 2.4, -3.0, 4.4)], '#E6C24F');
      for (const f of ['pv', 'nv']) if (B.vis[f]) { const q = B.quad(f, -0.95, 0.95, 4.65, 5.7); g2.fill(q, '#3F5F8F'); g2.mark({ nc: true }); }
      const c = g2.p.apply(g2, B.pt(-0.1, -1.62, 5.15)); TK.word2(g2, c, 1.5, 'たいやき', '#F6F3EA', { w: 0.4 });
      K.lights(g2, C2, 1.4);
    }), { name: 'kitchen car' });
    TK.idle(T, TK.who(6045, { dir: 2 }), 21.0, 11.8, { acts: ['talk', 'eat', 'look', 'scroll'], seed: 6045 });
    TK.group(T, [{ who: TK.pupil(6046, { dir: 2, k: 0.8 }), x: 20.6, y: 13.8 }, { who: TK.who(6047, { dir: 2 }), x: 21.8, y: 14.6, idle: 'eat' }], { seed: 51 });
    [[26.4, -2.2], [27.6, -2.2]].forEach(([x, y], i) => T.obj([x, y], (g) => TK.vend(g, x, y, { face: 'L', col: i ? '#C9463E' : '#F1EFE8', top: i ? '#F1EFE8' : '#3F6FA8' })));
    T.obj([-6, 10, 0, 12], (g) => K.blooms(g, -6, 10, 0, 12, 0, ['#E8665A', '#F2B84A', '#F3F1EA', '#D98AA4'], { r: 1.3, sp: 1.2 }));
    T.ground((g) => TK.tarp(g, [[15, 18.6, 0.04], [19.6, 18.6, 0.04], [19.6, 23, 0.04], [15, 23, 0.04]], { col: '#F2C6D0' }), { season: ['spring', 'autumn'] });
    TK.group(T, [{ who: TK.who(6048, { dir: 1, sit: true }), x: 16.0, y: 19.4 }, { who: TK.who(6049, { dir: 0, sit: true }), x: 15.8, y: 22.0, idle: 'eat' }, { who: TK.pupil(6050, { dir: 3, sit: true, k: 0.8 }), x: 18.6, y: 22.4 }], { seed: 52, season: ['spring', 'autumn'] });

    // the river: the Himiko water bus (Leiji Matsumoto's silver spaceship) up and down between Asakusa and Odaiba,
    // a yakatabune; black-headed gulls in January; the fireworks over the river on the July night
    T.actor({ sample: 0.3, period: 34, grow: false,
      at(t) { const u = (t / 34) % 1, y = 40 - u * 80, a = Math.min(1, (y + 30) / 5, (30 - y) / 5); if (y > 30 || y < -30) return null; return { x: -22, y, z: 0, key: 0, alpha: a < 1 ? a : null, ext: [2.0, 7.6] }; },
      draw(g) { himiko(g, -Math.PI / 2); } });
    T.actor({ sample: 0.3, period: 46, grow: false,
      at(t) { const u = (t / 46 + 0.4) % 1, y = -36 + u * 72, a = Math.min(1, (y + 30) / 5, (30 - y) / 5); if (y > 30 || y < -30) return null; return { x: -19.4, y, z: 0, key: 0, alpha: a < 1 ? a : null, ext: [2.24, 7.1] }; },
      draw(g) { TK.yakata(g, Math.PI / 2, {}); } });
    gulls(T, [[-25, -18], [-20, -2], [-24, 12]], 'winter');
    TK.fireworks(T, [[-22, -16, 46, '#F2B84A', 4.2, 0], [-24, 4, 40, '#E8665A', 3.6, 0.35], [-20, -4, 52, '#8FD3FF', 5.0, 0.7]], { water: 0 });
  });

  /* ---------------- the bay: Rainbow Bridge and Odaiba ----------------
     The Rainbow Bridge (1993) across the harbour: two white towers, each two legs tied by beams, the main cables sagging
     between them and down to the anchorages, the double deck stiffened by a truss; cars stream over it. It passes the
     Daiba, the square island forts built in 1853 against the black ships (No. 3 is a park now, its old cannon still
     there). On the Odaiba shore: the beach of Seaside Park with its boardwalk and palms, and Fuji TV's building (Kenzo
     Tange, 1996), two towers tied by a grid of sky corridors holding a titanium sphere. Boats pass along the shore;
     gulls wheel over it (and in January the black-headed gulls, the yurikamome, sit on the water). */
  SF.tile('odaiba', 208, 8, { rim: 100, castAt: 165, order: 3, half: 32 }, function (T) {
    const BX = -17, BW = 4.0, D0 = 5.2, D1 = 7.4, TZ = 29, Y0 = -31, Y1 = 31, TWR = [-12, 12];
    const WH = { t: '#E9E7E0', l: '#F6F5F0', r: '#DEDCD4' }, BINK = '#6E6A60';
    const cz = (y) => { const a = Math.abs(y); return a <= 12 ? lerp(D1 + 0.7, TZ - 0.6, Math.pow(a / 12, 2)) : lerp(TZ - 0.6, D1 + 0.4, Math.pow((a - 12) / (31 - 12), 0.9)); };
    const SHORE = [[2, -32], [-1, -18], [-4, -4], [-4.5, 8], [-2, 20], [3, 32]];     // the beach's waterline
    T.ground(function (g) {
      blob(g, [[-33, -30], [-12, -34], [12, -34], [33, -28], [34, 6], [30, 32], [4, 34], [-22, 33], [-34, 14]], C.water, 11);
      g.water([[-31, -30, 0], [-6, -30, 0], [-8, 30, 0], [-31, 30, 0]], { dens: 1.0 });
      // Odaiba: the land, the beach, the boardwalk, a lawn
      const land = [[6, -33, 0], [33, -29, 0], [33.5, 6, 0], [30, 33, 0], [8, 33, 0], [5, 20, 0], [3.4, 8, 0], [3.6, -4, 0], [5, -18, 0]];
      g.fill(land, '#E6E1D6');
      const sand = K.curve(SHORE.map((p) => [p[0], p[1], 0]).concat([[8, 33, 0], [5, 20, 0], [3.4, 8, 0], [3.6, -4, 0], [5, -18, 0], [6, -33, 0]]), 3, true);
      g.fill(sand, '#EBDDB5');
      g.fine(K.curve(SHORE.map((p) => [p[0] + 0.9, p[1], 0]), 3, false), { w: 0.6, c: '#D6C79E' });
      g.line(K.curve(SHORE.map((p) => [p[0] - 0.4, p[1], 0]), 3, false), { w: 0.9, c: '#F6F7F3', boil: false });
      g.fine(K.curve(SHORE.map((p) => [p[0] - 1.6, p[1], 0]), 3, false), { w: 0.4, c: '#DCEAF3' });
      const bw = [[5, -33, 0], [9, -33, 0], [9.4, 33, 0], [8, 33, 0], [5, 20, 0], [3.4, 8, 0], [3.6, -4, 0], [5, -18, 0]];
      g.fill([[6.2, -32, 0], [9.6, -32, 0], [9.8, 32, 0], [7.4, 32, 0], [5.6, 20, 0], [4.8, 8, 0], [5.0, -4, 0], [6.0, -18, 0]], '#C9A26B');
      void bw;
      const bd = []; for (let y = -31; y < 32; y += 0.9) { const xa = y < -18 ? lerp(6.2, 6.0, (y + 32) / 14) : y < -4 ? lerp(6.0, 5.0, (y + 18) / 14) : y < 8 ? lerp(5.0, 4.8, (y + 4) / 12) : y < 20 ? lerp(4.8, 5.6, (y - 8) / 12) : lerp(5.6, 7.4, (y - 20) / 12); const a = g.p(xa, y, 0.02), b = g.p(9.6 + (y + 32) / 64 * 0.2, y, 0.02); bd.push(a[0], a[1], b[0], b[1]); }
      g.segs2(bd, '#A8834F', 0.25);
      g.fill([[12, 4, 0], [31, 4, 0], [30, 30, 0], [12, 30, 0]], '#B5CF8E'); g.grass([[12, 4, 0], [31, 4, 0], [30, 30, 0], [12, 30, 0]], { dens: 0.5 });
      g.fill([[10, -14, 0], [33, -14, 0], [33, 4, 0], [10, 4, 0]], '#E2DCCD');
    });

    // the bridge, in two: the far legs, the far cable and the deck; then the near legs, the beams and the near cable
    const cable = (g, x, far) => {
      const pts = []; for (let k = 0; k <= 62; k++) { const y = lerp(Y0, Y1, k / 62); pts.push([x, y, cz(y)]); }
      const hs = []; for (let y = Y0 + 1.4; y < Y1; y += 1.4) { if (Math.abs(Math.abs(y) - 12) < 0.6) continue; const a = g.p(x, y, cz(y)), b = g.p(x, y, D1); hs.push(a[0], a[1], b[0], b[1]); }
      g.segs2(hs, far ? '#C9C4B8' : '#B3AC9E', 0.22);
      g.line(pts, { w: far ? 0.6 : 0.9, c: BINK, boil: false });
      if (!far) for (let y = Y0 + 3; y < Y1; y += 3) g.glow('lantern', x, y, cz(y), { r: 0.6, col: '#FFF4D8' });
    };
    const leg = (g, x, y) => { K.box(g, x - 0.7, y - 0.95, x + 0.7, y + 0.95, 0, TZ, WH, { w: 0.75 }); const s = []; for (const f of [0.35, -0.35]) { const a = g.p(x + 0.7 + 0.02, y + f, 0.5), b = g.p(x + 0.7 + 0.02, y + f, TZ - 0.2); s.push(a[0], a[1], b[0], b[1]); } g.segs2(s, '#C9C4B8', 0.25); K.box(g, x - 0.9, y - 1.15, x + 0.9, y + 1.15, TZ, TZ + 0.7, WH, { w: 0.55, boil: false }); g.disc2(g.p(x, y, TZ + 0.7), 0.5, '#E0503E'); };
    T.obj([BX - BW - 2.2, Y0 - 1, BX + BW + 2.2, Y1 + 1], function (g) {   // to the tower footings' ends
      g.boilP = 0.25;
      for (const y of TWR) { K.box(g, BX - BW - 2.2, y - 1.6, BX + BW + 2.2, y + 1.6, 0, 1.2, '#CFCAC0', { w: 0.6, boil: false }); leg(g, BX - BW - 0.6, y); }
      cable(g, BX - BW, true);
      for (const y of [Y0, Y1]) K.box(g, BX - BW - 1.4, y - 1.4, BX + BW + 1.4, y + 1.4, 0, D1 + 1.2, { t: '#E4E1D8', l: '#ECEAE3', r: '#D6D2C8' }, { w: 0.75 });
      for (const y of [-24, 24]) K.box(g, BX - 2.4, y - 0.9, BX + 2.4, y + 0.9, 0, D0, { t: '#DCD8CF', l: '#E9E6DF', r: '#D3CFC5' }, { w: 0.6, boil: false });
      // the deck: the truss on its side, the roadway on top with its lanes
      K.box(g, BX - BW, Y0 + 1.4, BX + BW, Y1 - 1.4, D0, D1, { t: '#B4B0A6', l: '#F1EFE8', r: '#E4E1D8' }, { w: 0.8 });
      const tr = []; for (let y = Y0 + 1.4; y < Y1 - 1.5; y += 1.5) { const a = g.p(BX + BW + 0.02, y, D0 + 0.1), b = g.p(BX + BW + 0.02, y + 1.5, D1 - 0.1), c = g.p(BX + BW + 0.02, y + 1.5, D0 + 0.1), d = g.p(BX + BW + 0.02, y, D1 - 0.1); tr.push(a[0], a[1], b[0], b[1], d[0], d[1], c[0], c[1], a[0], a[1], d[0], d[1]); }
      g.segs2(tr, '#B9B3A6', 0.25);
      g.line([[BX + BW + 0.02, Y0 + 1.4, (D0 + D1) / 2], [BX + BW + 0.02, Y1 - 1.4, (D0 + D1) / 2]], { w: 0.3, c: '#B9B3A6', boil: false });
      const ln = []; for (let y = Y0 + 2; y < Y1 - 2; y += 2.2) { const a = g.p(BX, y, D1 + 0.02), b = g.p(BX, y + 1.1, D1 + 0.02); ln.push(a[0], a[1], b[0], b[1]); } g.segs2(ln, '#F1EFE8', 0.4);
      g.line([[BX - BW + 0.25, Y0 + 1.4, D1 + 0.5], [BX - BW + 0.25, Y1 - 1.4, D1 + 0.5]], { w: 0.4, c: '#8C8576', boil: false });
    }, { name: 'rainbow bridge', under: D0 });
    T.obj([BX + BW, Y0, BX + BW + 1.4, Y1], function (g) {
      g.boilP = 0.25;
      for (const y of TWR) {
        leg(g, BX + BW + 0.6, y);
        for (const z of [D0 - 2.2, 18.5, TZ - 1.4]) K.box(g, BX - BW - 0.9, y - 0.55, BX + BW + 0.9, y + 0.55, z, z + 1.2, WH, { w: 0.6, boil: false });
        g.glow('lantern', BX, y, TZ, { r: 2.2, col: '#FFFFFF' });
      }
      cable(g, BX + BW, false);
      g.line([[BX + BW - 0.25, Y0 + 1.4, D1 + 0.5], [BX + BW - 0.25, Y1 - 1.4, D1 + 0.5]], { w: 0.4, c: '#8C8576', boil: false });
    }, { name: 'rainbow bridge near' });

    // the traffic over the bridge, both ways
    [[BX - 2.0, 1, 0, '#F1EFE8'], [BX - 2.0, 1, 0.45, '#C9584B'], [BX - 0.8, 1, 0.75, '#2E3A55'], [BX + 0.8, -1, 0.2, '#E6C24F'], [BX + 2.0, -1, 0.6, '#7FA7CF'], [BX + 2.0, -1, 0.9, '#F1EFE8']].forEach(([x, dir, ph, col], i) => T.actor({ sample: 0.25, period: 11 + (i % 3), grow: false,
      at(t) { const P = 11 + (i % 3), u = ((t / P + ph) % 1), y = dir > 0 ? lerp(Y0 + 1.6, Y1 - 1.6, u) : lerp(Y1 - 1.6, Y0 + 1.6, u), a = Math.min(1, u * 10, (1 - u) * 10); return { x, y, z: D1, key: 0, alpha: a < 1 ? a : null, ext: [1.05, 2.3] }; },
      draw(g) { miniCar(g, dir > 0 ? Math.PI / 2 : -Math.PI / 2, col); } }));
    // No. 3 Daiba: a square island fort walled in stone, trees on its banks, a cannon at its point
    T.obj([-31, 5, -23, 14], function (g) {
      g.boilP = 0.3;
      K.box(g, -31, 5, -23, 14, 0, 1.5, { t: '#B5CF8E', l: '#C9C0AE', r: '#B3AA97' }, { w: 0.75 });
      const st = []; for (const z of [0.5, 1.0]) { let a = g.p(-31, 14, z), b = g.p(-23, 14, z); st.push(a[0], a[1], b[0], b[1]); a = g.p(-23, 14, z); b = g.p(-23, 5, z); st.push(a[0], a[1], b[0], b[1]); }
      for (let x = -30.2; x < -23; x += 1.1) { const a = g.p(x, 14, 0), b = g.p(x, 14, 1.5); st.push(a[0], a[1], b[0], b[1]); }
      g.segs2(st, '#8C8576', 0.25);
      K.box(g, -28.6, 7.4, -25.4, 11.6, 1.5, 2.3, { t: '#C6DBA0', l: '#A6C47E', r: '#95B16B' }, { w: 0.4, boil: false });
      for (const [x, y, i] of [[-29.6, 6.2, 0], [-24.2, 6.4, 1], [-29.4, 12.6, 2]]) K.tree(g, x, y, TK.leaves({ r: 1.6, h: 1.8, z: 1.5, seed: 300 + i, col: '#6E9A50' }, 'zelkova', i));
      const c = g.p(-23.6, 13.2, 1.5); g.line2([c, [c[0] + 3.2, c[1] + 0.6]], { w: 1.1, c: '#2E2A26', boil: false }); g.disc2(c, 0.8, '#3A3530');
    }, { name: 'daiba' });

    // Fuji TV: two towers in a grey grid, sky corridors tying them in three planes, the titanium sphere held up high
    T.obj([12, -31, 30, -16], function (g) {
      g.boilP = 0.25;
      const ST = { t: '#D3D7DA', l: '#ECEEEE', r: '#D6DADD' };
      const tower = (x0, x1) => {
        K.box(g, x0, -31, x1, -16, 0, 22, ST, { w: 0.8 });
        for (let z = 1.2; z < 21.5; z += 2.2) { K.win(g, 'L', -16, x0 + 0.3, x1 - 0.3, z, z + 1.1, { style: 'glass', col: '#C9D3DA', lit: 0.55, line: false }); K.win(g, 'R', x1, -30.7, -16.3, z, z + 1.1, { style: 'glass', col: '#BCC7CF', lit: 0.55, line: false }); }
        const s = [];
        for (let a2 = x0 + 0.9; a2 < x1; a2 += 0.9) { const p = g.p(a2, -15.98, 0.4), q = g.p(a2, -15.98, 21.8); s.push(p[0], p[1], q[0], q[1]); }
        for (let a2 = -30.1; a2 < -16; a2 += 0.9) { const p = g.p(x1 + 0.02, a2, 0.4), q = g.p(x1 + 0.02, a2, 21.8); s.push(p[0], p[1], q[0], q[1]); }
        for (let z = 1.1; z < 22; z += 1.1) { let p = g.p(x0, -15.98, z), q = g.p(x1, -15.98, z); s.push(p[0], p[1], q[0], q[1]); p = g.p(x1 + 0.02, -31, z); q = g.p(x1 + 0.02, -16, z); s.push(p[0], p[1], q[0], q[1]); }
        g.segs2(s, '#A3ADB5', 0.24);
      };
      tower(12, 16.5);
      for (const y of [-30, -24.5]) for (let z = 4.4; z < 23; z += 4.4) K.box(g, 16.5, y, 25.5, y + 1.8, z, z + 1.0, ST, { w: 0.45, boil: false });
      tower(25.5, 30);
      for (const x of [18.6, 23.4]) K.box(g, x - 0.45, -18.6, x + 0.45, -17.0, 0, 13.4, ST, { w: 0.5, boil: false });
      for (const z of [4.4, 8.8, 13.2]) { K.box(g, 16.5, -18.8, 25.5, -16.8, z, z + 1.0, ST, { w: 0.55, boil: false }); K.win(g, 'L', -16.8, 16.8, 25.2, z + 0.2, z + 0.8, { style: 'glass', col: '#9FB4C4', lit: 0.8, line: false }); }
      // the sphere: titanium, a band of windows round it
      const sc = g.p(21, -20.6, 17.9), r = 3.5 * 4.13;
      g.disc2(sc, r, '#CCD3D8'); g.fill2(arcPts(sc[0] + r * 0.16, sc[1] + r * 0.1, r * 0.88, -0.8, 2.1, 12).concat([[sc[0] + r * 0.25, sc[1] + r * 0.25]]), '#B2BBC3');
      g.fill2(arcPts(sc[0], sc[1] + r * 0.05, r * 0.97, 0.15, Math.PI - 0.15, 12).concat(arcPts(sc[0], sc[1] + r * 0.05, r * 0.97, Math.PI - 0.15, 0.15, 12).map((p) => [p[0], sc[1] + r * 0.05 + (p[1] - sc[1] - r * 0.05) * 0.18 - r * 0.16])), '#7E95A8'); g.mark({ win: 0.9 });
      const sl = []; for (const k of [-0.55, 0.55]) { const cy2 = sc[1] + k * r * 0.8, rx = r * Math.sqrt(1 - k * k * 0.64), ry = rx * 0.26; let q = null; for (let i = 0; i <= 12; i++) { const a2 = Math.PI * i / 12, p = [sc[0] + Math.cos(a2) * rx, cy2 + Math.sin(a2) * ry]; if (q) sl.push(q[0], q[1], p[0], p[1]); q = p; } }
      g.segs2(sl, '#8E9BA6', 0.3); g.ring2(sc, r, { c: '#5E6A74', w: 0.7 }); g.disc2([sc[0] - r * 0.42, sc[1] - r * 0.45], r * 0.13, '#F2F5F7');
      for (const x of [16.6, 25.4]) { const p = g.p(x, -20.6, 17.9), q = [sc[0] + (p[0] < sc[0] ? -r * 0.98 : r * 0.98), sc[1]]; g.line2([p, q], { w: 1.2, c: '#C3CACF', boil: false }); }
      g.glow('lantern', 21, -20.6, 17.9, { r: 3.4, col: '#BFE3FF' });
    }, { name: 'fuji tv' });

    // the boardwalk's palms and lamps, the beach parasols in July
    [[8.2, -26], [7.6, -10], [7.0, 6], [7.8, 22]].forEach(([x, y]) => T.obj([x, y], (g) => K.palm(g, x, y, { h: 7.5, r: 3.4, fr: 7 })));
    [[8.6, -18], [8.0, -2], [8.2, 14], [9.0, 28]].forEach(([x, y]) => T.obj([x, y], (g) => K.lamp(g, x, y, { h: 6.5 })));
    [[14, 10], [22, 18], [27, 8]].forEach(([x, y], i) => T.obj([x, y], (g) => K.tree(g, x, y, TK.leaves({ r: 2.2, h: 2.6, seed: 410 + i }, 'zelkova', i))));
    [[0.5, 10, '#E8665A'], [-0.5, 18, '#F2B84A'], [1.4, -6, '#5F8FC9']].forEach(([x, y, c]) => T.obj([x, y], (g) => { const b = g.p(x, y, 0), t = g.p(x, y, 5.2); g.line2([b, t], { w: 0.5, c: '#6B6458', boil: false }); const um = []; for (let i = 0; i <= 12; i++) { const a = Math.PI + Math.PI * i / 12; um.push([t[0] + Math.cos(a) * 9, t[1] + 2.4 + Math.sin(a) * 4]); } g.fill2(um, c); for (let i = 0; i < 12; i += 2) g.fill2([t, um[i], um[i + 1]], '#FBFAF6'); g.outline2(um, { w: 0.45, c: shade(c, 0.5), boil: false }); }, { season: 'summer' }));

    // the life on the beach
    TK.photo(T, { who: TK.who(6111, { dir: 2 }), x: 4.0, y: 1.0 }, [{ who: TK.who(6112, { dir: 0 }), x: 0.4, y: 0.8 }, { who: TK.who(6113, { dir: 0 }), x: 0.6, y: 3.2 }], { seed: 5 });   // on the sand, off the dog walk, not straight behind a palm
    TK.toss(T, TK.who(6114, { dir: 1 }), TK.who(6115, { dir: 3 }), 1.0, 12, 0.4, 22, { ball: TK.summer() ? '#E8665A' : '#E8C445', seed: 1.3 });
    TK.chase(T, [TK.pupil(6116, { k: 0.8 }), TK.pupil(6117, { k: 0.76 }), TK.pupil(6118, { k: 0.8 })], [[-2.2, -14], [-3.0, 4], [-2.4, 16], [-1.0, 16], [-1.6, 4], [-0.8, -14]], 3.0, { gap: 0.1 });
    TK.dogWalk(T, TK.who(6119, { dir: 1 }), [[6.6, -28], [5.4, -6], [5.6, 18], [6.4, 18.4], [6.0, -6.4], [6.8, -28.4]], 1.8, '#C98A4A', { phase: 0.3 });   // clear of the palms
    K.walker(T, TK.who(6120), [[11.2, -30], [11.2, 30], [11.4, 30], [11.4, -30]], 1.4, { phase: 0.6 });   // between the benches and Fuji TV
    TK.group(T, [{ who: TK.who(6121, { dir: 2, sit: true }), x: 2.6, y: 8.6 }, { who: TK.who(6122, { dir: 2, sit: true }), x: 2.4, y: 10.4 }, { who: TK.kimono(6123, { dir: 3, sit: true }), x: 4.0, y: 12.0 }], { seed: 41, laughs: 0.6 });
    TK.group(T, [{ who: TK.who(6124, { dir: 1 }), x: 18, y: 6 }, { who: TK.who(6125, { dir: 3 }), x: 18.2, y: 8.8 }], { seed: 42 });
    TK.idle(T, Object.assign(TK.who(6126, { dir: 2, sit: true }), {}), 3.2, 24.0, { acts: ['scroll', 'look', 'rest', 'eat'], seed: 6126, season: ['spring', 'summer'] });
    T.actor({ sample: 0.5, period: 40, grow: false, season: 'summer',
      at() { return { x: 2.0, y: 20.6, key: 0 }; },
      draw(g) { const p = g.p(0, 0, 0.03); g.fill2([[p[0] - 7, p[1]], [p[0] - 1, p[1] - 3.2], [p[0] + 7, p[1]], [p[0] + 1, p[1] + 3.2]], '#E8665A', true); g.fill2([[p[0] - 3.4, p[1] - 1.6], [p[0] - 1, p[1] - 3.2], [p[0] + 1.4, p[1] - 2.0], [p[0] - 1.0, p[1] - 0.4]], '#F3F1EA', true); TK.person(g, 0, 0, 0.1, TK.who(6127, { lie: -2.7, shorts: true, bare: true })); } });

    // on the lawn: a picnic on a mat, a child flying a kite, a bench by the boardwalk
    T.ground((g) => TK.tarp(g, [[14.5, 20, 0.04], [19, 20, 0.04], [19, 24, 0.04], [14.5, 24, 0.04]], { col: '#E9C46A' }), { season: ['spring', 'autumn'] });
    TK.group(T, [{ who: TK.who(6130, { dir: 1, sit: true }), x: 15.6, y: 20.8 }, { who: TK.who(6131, { dir: 0, sit: true }), x: 15.2, y: 23.0, idle: 'eat' }, { who: TK.pupil(6132, { dir: 3, sit: true, k: 0.8 }), x: 17.8, y: 23.6 }, { who: TK.who(6133, { dir: 2, sit: true }), x: 18.4, y: 21.4, idle: 'drink' }], { seed: 43, season: ['spring', 'autumn'] });
    T.obj([12.6, 13], (g) => K.bench(g, 12.6, 13, { L: 2.2 }));
    TK.group(T, [{ who: TK.who(6134, { dir: 0, sit: true }), x: 13.8, y: 12.2, z: 1.4 }, { who: TK.who(6135, { dir: 0, sit: true }), x: 13.8, y: 14.0, z: 1.4 }], { seed: 44 });
    T.actor({ sample: 0.25, period: 8, grow: false,
      at(t) { const f = Math.floor(t * 2) % 8; return { x: 26, y: 24, key: f, f }; },
      draw(g, st) {
        const r = TK.person(g, 0, 0, 0, TK.pupil(6136, { dir: 3, k: 0.85, hands: [[-1.9, -9.6], [2.6, -16.6 - (st.f % 2) * 0.8]] }));
        const h = r.hands[0][1] < r.hands[1][1] ? r.hands[0] : r.hands[1], kc = g.p(-7 + Math.sin(st.f / 8 * TAU) * 1.2, -9, 21 + Math.cos(st.f / 8 * TAU * 2) * 0.8);
        g.fine2(K.curve([h, [lerp(h[0], kc[0], 0.5), lerp(h[1], kc[1], 0.5) + 6], kc], 4, false), { w: 0.25, c: '#5A564E' });
        const k = [[kc[0], kc[1] - 3.4], [kc[0] + 2.4, kc[1]], [kc[0], kc[1] + 3.6], [kc[0] - 2.4, kc[1]]];
        g.fill2(k, '#D4553A', true); g.fill2([k[0], k[1], [kc[0], kc[1]]], '#E6C24F', true); g.line2(k, { w: 0.35, c: '#7A2E22', close: true, boil: false });
        const tl = []; for (let i = 0; i < 6; i++) tl.push([kc[0] + Math.sin(i * 1.3 + st.f) * 1.2, kc[1] + 3.6 + i * 1.6]); g.line2(tl, { w: 0.4, c: '#3F5F8F', boil: false });
      } });
    // on the water: a yakatabune and the water bus along the shore, a dinghy out on the bay; gulls
    // the channel between the bridge's tower footings (x -10.8) and the beach is one boat wide: the water bus follows the
    // yakatabune along it half a lap behind (going opposite ways they ran through each other, and the bus through a footing)
    T.actor({ sample: 0.3, period: 40, grow: false,
      at(t) { const u = (t / 40) % 1, y = -36 + u * 72, a = Math.min(1, (y + 31) / 5, (31 - y) / 5); if (Math.abs(y) > 31) return null; return { x: -8.0, y, z: 0, key: 0, alpha: a < 1 ? a : null, ext: [2.24, 7.1] }; },
      draw(g) { TK.yakata(g, Math.PI / 2, {}); } });
    T.actor({ sample: 0.3, period: 40, grow: false,
      at(t) { const u = (t / 40 + 0.5) % 1, y = -36 + u * 72, a = Math.min(1, (y + 31) / 5, (31 - y) / 5); if (Math.abs(y) > 31) return null; return { x: -8.0, y, z: 0, key: 0, alpha: a < 1 ? a : null, ext: [2.0, 7.6] }; },
      draw(g) { himiko(g, Math.PI / 2); } });
    T.actor({ sample: 0.5, period: 24, grow: false,
      at(t) { const u = (t / 24) % 1, y = -14 + Math.sin(u * TAU) * 8, x = -27 + Math.cos(u * TAU) * 2.4; return { x, y, z: 0, key: Math.round(Math.cos(u * TAU) * 2), ext: [1.0, 2.6] }; },
      draw(g, st) { K.boat(g, st.key > 0 ? Math.PI / 2 : -Math.PI / 2, { kind: 'sail', L: 2.2, W: 0.9, mast: 8 }); } });
    T.actor({ sample: 0.25, period: 9, grow: false,
      at(t) { const k = Math.floor(t * 4) % 36; return { x: -6, y: 0, z: 0, key: k, k }; },
      draw(g, st) { for (const [cx, cy, z, r, ph] of [[-6, -4, 21, 5, 0], [2, 8, 17, 4, 0.4]]) { const a = TAU * (st.k / 36 + ph), c = g.p(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z + Math.sin(a * 2)); TK.gull2(g, c, Math.sin(a) > 0 ? -1 : 1, true, st.k % 2); } } });
    // a windsurfer tacking to and fro off the fort (not in January)
    T.actor({ sample: 0.25, period: 20, grow: false, season: ['spring', 'summer', 'autumn'],
      at(t) { const u = (t / 20) % 1, s = Math.sin(u * TAU), y = 22 + s * 6, x = -27 + Math.cos(u * TAU) * 1.2; return { x, y, z: 0, key: (Math.cos(u * TAU) > 0 ? 'a' : 'b') + (Math.floor(t * 2) % 2), back: Math.cos(u * TAU) <= 0, f: Math.floor(t * 2) % 2, ext: [0.6, 2.9] }; },
      draw(g, st) {
        const ang = st.back ? -Math.PI / 2 : Math.PI / 2, ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v, z) => g.p(u * ca - v * sa, u * sa + v * ca, z);
        g.fill([[-2.2 * ca, -2.2 * sa, 0.02], [0.3 * sa, -0.3 * ca, 0.02], [2.4 * ca, 2.4 * sa, 0.02], [-0.3 * sa, 0.3 * ca, 0.02]].map((p) => [p[0] * 1.2, p[1] * 1.2, 0]), '#DCEAF3');
        const bd = [P(-2.2, -0.4, 0.2), P(2.4, -0.2, 0.25), P(2.6, 0, 0.25), P(2.4, 0.2, 0.25), P(-2.2, 0.4, 0.2)]; g.fill2(bd, '#F6F3EA', true); g.line2(bd, { w: 0.35, close: true, boil: false });
        TK.person(g, -0.6 * ca, -0.6 * sa, 0.25, Object.assign(TK.who(6140, { shorts: true, bare: true }), { dir: st.back ? 3 : 1, hands: [[2.2, -14.6], [3.4, -13.8]], lean: 0.6, k: 0.9 }));
        const m0 = P(0.6, 0, 0.3), m1 = P(0.9, 0, 10.5), cl = P(-1.6 + st.f * 0.2, 0, 5.2), sl = [m0, m1, [cl[0], cl[1]]];
        g.fill2(sl, '#E8665A', true); g.fill2([m1, [lerp(m1[0], cl[0], 0.5), lerp(m1[1], cl[1], 0.5)], [lerp(m0[0], cl[0], 0.4), lerp(m0[1], cl[1], 0.4)], m0], '#F2B84A', true);
        g.line2(sl, { w: 0.4, c: '#7A2E22', close: true, boil: false }); g.line2([m0, m1], { w: 0.4, c: '#3A3530', boil: false });
      } });
    [[8.4, -14], [8.0, 10], [8.6, 25.6]].forEach(([x, y]) => T.obj([x, y], (g) => K.bench(g, x, y, { face: 'R', L: 1.8 })));   // seats end at x 10.4: clear of the walker at 11.2
    T.obj([12, 26, 20, 29], (g) => K.blooms(g, 12, 26.5, 20, 28.8, 0, ['#E8665A', '#F2B84A', '#D98AA4', '#F3F1EA'], { r: 1.3, sp: 1.2 }));
    gulls(T, [[-6, 22], [-7.4, 26], [-5.8, 28.6], [-8.4, 18]], 'winter');
  });

  /* ---------------- the sumō hall (Ryōgoku Kokugikan) ----------------
     The hall cut open on its two near sides: its green copper roof over the far half, the walls with the champions'
     portraits under it, tiers of box seats (masu-seki) stepping down to the ring. The dohyō is a square of packed clay
     with its ring of straw bales; over it hangs the roof of a shrine (shinmei-zukuri) with its purple curtain and the four
     tassels of the four seasons and quarters: green for the east and spring, red for the south and summer, white for
     the west and autumn, black for the north and winter. A bout goes round and round: the salt, the charge, the two locked
     together shoving back and forth, one forced out over the bales; the referee (gyōji) in his silk with his war fan names
     the winner. The crowd claps along, roars and stands up in a wave round the hall. Outside, the wrestlers' banners and
     the yakitori the Kokugikan is known for. */
  SF.tile('ryogoku', 8, 208, { rim: 106, castAt: 170, order: 3, half: 30 }, function (T) {
    const E = 27.5, DB = 7.6, DT = 6.6, DZ = 2.0, RR = 4.6, ZE = 16.5, ZR = 31;    // hall half, dohyō (foot, top, height), ring, roof
    const CUSH = ['#6E5A9A', '#7A5BA0', '#5E5090'], FRAME = '#8A3A30';
    const LIT = (k) => ({ nc: (c) => (typeof c === 'string' && c[0] === '#' ? mix(nightColour(c), c, k) : undefined) });   // under the arena's lights at night
    // the seating plan: masu boxes in square rings round the ring (s: which side, a: along it, d: out from the centre)
    const BOX = 2.4, TIER = (d) => d > 19 ? Math.min(4, Math.floor((d - 19) / 2.1) + 1) * 1.5 : 0;   // the back two sides step up
    const sideOf = (x, y) => (x <= -Math.abs(y) + 0.01 && y < 11) || (x < -11 && y >= 11) ? 'A' : (y <= -Math.abs(x) + 0.01) || (y < -11) ? 'B' : (x >= Math.abs(y)) ? 'C' : 'D';
    const seats = [];                                                  // [x, y, z, who, side, back]
    { const R = RNG(4242);
      for (let ring = 0; ring < 7; ring++) {
        const d = 11.2 + ring * BOX; if (d > 26.4) break;
        for (const [sx, sy, ax] of [[-1, 0, 'y'], [1, 0, 'y'], [0, -1, 'x'], [0, 1, 'x']]) {
          for (let a = -d + BOX / 2; a < d; a += BOX) {
            const cx = sx ? sx * d : a, cy = sy ? sy * d : a, side = sideOf(cx, cy), back = side === 'C' || side === 'D';
            if (!back && false) continue;
            const far = sx < 0 || sy < 0;
            if (!far && d > 24.5) continue;                            // a walkway along the cut on the near sides
            const r0 = R(), n = r0 < 0.14 ? 0 : r0 < 0.6 ? 1 : 2, z = far ? TIER(d + 0.6) : 0;
            for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2) * 1.05 + (R() - 0.5) * 0.2, px = ax === 'y' ? cx + (R() - 0.5) * 0.3 : cx + off, py = ax === 'y' ? cy + off : cy + (R() - 0.5) * 0.3; seats.push([px, py, z, R() < 0.12 ? TK.kimono(7000 + seats.length) : TK.who(7000 + seats.length), side, back]); }
          }
        }
      }
      // ringside: the judges in black crested kimono, the next wrestlers waiting on their cushions
      for (const [x, y, s] of [[-9.4, -2, 'A'], [-9.4, 2, 'A'], [0, -9.4, 'B'], [9.4, 0, 'C'], [0, 9.4, 'D']]) seats.push([x, y, 0, Object.assign(TK.who(7900 + x * 3 + y), { top: '#2A2622', hair: '#2B2420' }), s, s === 'C' || s === 'D', 'judge']);
      seats.push([-9.4, -5.2, 0, { top: '#E8BE9A', skin: '#E8BE9A', hair: '#1F1A18' }, 'A', false, 'rikishi'], [9.4, 4.6, 0, { top: '#D9A57B', skin: '#D9A57B', hair: '#1F1A18' }, 'C', true, 'rikishi']);
    }

    T.ground(function (g) {
      g.fill([[-30, -30, 0], [30, -30, 0], [30, 30, 0], [-30, 30, 0]], '#E9E3D3');
      g.fill([[-E, -E, 0], [E, -E, 0], [E, E, 0], [-E, E, 0]], '#DCD2BC');
      g.outline([[E, -E, 0], [E, E, 0], [-E, E, 0]], { w: 0.6, c: '#8C8576', boil: false });
      // the masu frames and their cushions on the floor (the tiers carry their own)
      const fr = [], cu = [[], [], []]; const R = RNG(77);
      for (let ring = 0; ring < 7; ring++) {
        const d = 11.2 + ring * BOX; if (d > 26.4) break;
        for (const [sx, sy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) for (let a = -d; a < d - 0.01; a += BOX) {
          const far = sx < 0 || sy < 0; if (far && d > 19) continue; if (!far && d > 24.5) continue;
          const q = sx ? [[sx * (d - BOX / 2), a, 0], [sx * (d + BOX / 2), a, 0], [sx * (d + BOX / 2), a + BOX, 0], [sx * (d - BOX / 2), a + BOX, 0]] : [[a, sy * (d - BOX / 2), 0], [a + BOX, sy * (d - BOX / 2), 0], [a + BOX, sy * (d + BOX / 2), 0], [a, sy * (d + BOX / 2), 0]];
          const P = g.P(q); for (let i = 0; i < 4; i++) fr.push(P[i][0], P[i][1], P[(i + 1) % 4][0], P[(i + 1) % 4][1]);
          const c = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2]; for (const [u, v] of [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]]) { const p = g.p(c[0] + u, c[1] + v, 0.02), w2 = 1.35, h2 = 0.75; cu[Math.floor(R() * 3)].push(p[0] - w2, p[1], p[0], p[1] - h2, p[0] + w2, p[1], p[0] - w2, p[1], p[0] + w2, p[1], p[0], p[1] + h2); }
        }
      }
      cu.forEach((a, i) => g.tris2(a, CUSH[i])); g.segs2(fr, FRAME, 0.5);
      // ringside cushions
      const rc = []; for (let a = -9; a <= 9; a += 1.6) for (const [x, y] of [[-9.6, a], [a, -9.6], [9.6, a], [a, 9.6]]) { const p = g.p(x, y, 0.02); rc.push(p[0] - 1.4, p[1], p[0], p[1] - 0.8, p[0] + 1.4, p[1], p[0] - 1.4, p[1], p[0] + 1.4, p[1], p[0], p[1] + 0.8); }
      g.tris2(rc, '#C9584B');
      g.mark(LIT(0.7), 0);
    });

    // the far walls with the champions' portraits, high windows, and the green copper roof over the far half
    T.obj([-E - 0.6, -E - 0.6, E, -E], function (g) {
      g.boilP = 0.25;
      K.box(g, -E, -E - 0.6, E, -E, 0, ZE, { t: '#DCD6C8', l: '#EFE9DC', r: '#E2DCCE' }, { w: 0.8 });
      const i0 = g.cmds.length;
      for (let i = 0; i < 6; i++) portrait(g, 'L', -E, -E + 6 + i * 8.2, 9.6, i);
      for (let a = -E + 2; a < E - 2; a += 3.4) K.win(g, 'L', -E, a, a + 2.2, 14.2, 15.6, { style: 'glass', lit: 0.8 });
      g.mark(LIT(0.6), 0); void i0;
    }, { name: 'hall far wall' });
    T.obj([-E - 0.6, -E, -E, E], function (g) {
      g.boilP = 0.25;
      K.box(g, -E - 0.6, -E, -E, E, 0, ZE, { t: '#DCD6C8', l: '#EFE9DC', r: '#E2DCCE' }, { w: 0.8 });
      for (let i = 0; i < 6; i++) portrait(g, 'R', -E, -E + 6 + i * 8.2, 9.6, i + 6);
      for (let a = -E + 2; a < E - 2; a += 3.4) K.win(g, 'R', -E, a, a + 2.2, 14.2, 15.6, { style: 'glass', lit: 0.8 });
      // the cut: the wall's end on the near side
      g.fill([[-E - 0.6, E, 0], [-E, E, 0], [-E, E, ZE], [-E - 0.6, E, ZE]], '#CFC8B9');
      g.mark(LIT(0.6), 0);
      roof(g);
    }, { name: 'hall side wall' });
    // the tiers on the far two sides, cushions on each step
    for (const s of ['A', 'B']) T.obj(s === 'A' ? [-E, -E, -19, E] : [-19, -E, E, -19], function (g) {
      g.boilP = 0.2;
      for (let k = 3; k >= 0; k--) {
        const d0 = 19 + k * 2.1, d1 = d0 + 2.1, z = (k + 1) * 1.5;
        if (s === 'A') K.box(g, -d1, -E, -d0, E, 0, z, { t: '#E6DECB', l: '#E9E2D2', r: '#D6CCB6' }, { w: 0.5, boil: false });
        else K.box(g, -19 + (k ? 0 : 0), -d1, E, -d0, 0, z, { t: '#E6DECB', l: '#E9E2D2', r: '#D6CCB6' }, { w: 0.5, boil: false });
        const cu = []; for (let a = -E + 1.2; a < E; a += 1.2) { if (s === 'B' && a < -19) continue; const p = s === 'A' ? g.p(-(d0 + d1) / 2, a, z + 0.02) : g.p(a, -(d0 + d1) / 2, z + 0.02); cu.push(p[0] - 1.3, p[1], p[0], p[1] - 0.75, p[0] + 1.3, p[1], p[0] - 1.3, p[1], p[0] + 1.3, p[1], p[0], p[1] + 0.75); }
        g.tris2(cu, CUSH[k % 3]);
        const rl = []; for (let a = -E; a < E; a += 2.4) { if (s === 'B' && a < -19) continue; const p0 = s === 'A' ? g.p(-d0, a, z) : g.p(a, -d0, z), p1 = s === 'A' ? g.p(-d0, a, z + 0.6) : g.p(a, -d0, z + 0.6); rl.push(p0[0], p0[1], p1[0], p1[1]); }
        g.segs2(rl, FRAME, 0.3); g.line(s === 'A' ? [[-d0, -E, z + 0.6], [-d0, E, z + 0.6]] : [[-19, -d0, z + 0.6], [E, -d0, z + 0.6]], { w: 0.3, c: FRAME, boil: false });
      }
      g.mark(LIT(0.7), 0);
    }, { name: 'tiers ' + s });

    // the dohyō and the roof that hangs over it
    T.obj([-DB, -DB, DB, DB], function (g) {
      g.boilP = 0.3;
      const B = [[-DB, -DB], [DB, -DB], [DB, DB], [-DB, DB]], Tp = [[-DT, -DT], [DT, -DT], [DT, DT], [-DT, DT]];
      g.fill([[DB, -DB, 0], [DB, DB, 0], [DT, DT, DZ], [DT, -DT, DZ]], '#B8955F');
      g.fill([[-DB, DB, 0], [DB, DB, 0], [DT, DT, DZ], [-DT, DT, DZ]], '#CDAE80');
      g.fill(Tp.map((p) => [p[0], p[1], DZ]), '#E2C9A0'); g.mark({ spill: true });
      g.line([[-DB, DB, 0], [DB, DB, 0], [DB, -DB, 0]], { w: 0.85 }); g.line([[DB, DB, 0], [DT, DT, DZ]], { w: 0.6 }); g.line([[-DB, DB, 0], [-DT, DT, DZ]], { w: 0.7 }); g.line([[DB, -DB, 0], [DT, -DT, DZ]], { w: 0.7 });
      g.outline(Tp.map((p) => [p[0], p[1], DZ]), { w: 0.6, boil: false });
      // the steps cut in the sides (fumidawara), the straw-bale square round the top, the ring, the two start lines
      for (const a of [-3.2, 3.2]) { g.fill([[a - 0.8, DB - 0.05, 0], [a + 0.8, DB - 0.05, 0], [a + 0.8, DB - 0.5, 1.0], [a - 0.8, DB - 0.5, 1.0]], '#D9BE92'); g.fill([[DB - 0.05, a - 0.8, 0], [DB - 0.05, a + 0.8, 0], [DB - 0.5, a + 0.8, 1.0], [DB - 0.5, a - 0.8, 1.0]], '#C4A26E'); }
      g.line(Tp.concat([Tp[0]]).map((p) => [p[0] * 0.97, p[1] * 0.97, DZ + 0.05]), { w: 1.0, c: '#C9B07A', boil: false });
      const ring = []; for (let i = 0; i <= 36; i++) { const a = TAU * i / 36; ring.push([Math.cos(a) * RR, Math.sin(a) * RR, DZ + 0.05]); }
      g.line(ring, { w: 1.4, c: '#CDB27A', boil: false }); g.line(ring.map((p) => [p[0] * 1.04, p[1] * 1.04, DZ + 0.06]), { w: 0.35, c: '#8A7A5A', boil: false }); g.line(ring.map((p) => [p[0] * 0.96, p[1] * 0.96, DZ + 0.06]), { w: 0.3, c: '#9A8A66', boil: false });
      for (const x of [-0.75, 0.75]) g.line([[x, -0.45, DZ + 0.06], [x, 0.45, DZ + 0.06]], { w: 0.6, c: '#FBFAF6', boil: false });
      // the water bucket and salt basket at two corners
      for (const [x, y] of [[-DT + 0.4, DT + 1.6], [DT + 1.6, -DT + 0.4]]) { K.cyl(g, x, y, 0.55, 0, 1.0, { t: '#E9E2CF', l: '#C9A26B', r: '#A8834F' }, { w: 0.4, n: 8 }); K.box(g, x + 1.0, y - 0.5, x + 2.0, y + 0.5, 0, 0.8, { t: '#FBFAF6', l: '#C9A26B', r: '#A8834F' }, { w: 0.35, boil: false }); }
      // the hanging roof: its purple curtain with the cherry crest, the shrine roof with crossed finials and ridge logs,
      // its cables up to the hall roof; the three far tassels (the near one is its own object, in front of the bout)
      const RE = 6.3, ZC = 19.2;
      for (const [x, y, c] of [[-RE, -RE, '#2E2A26'], [RE, -RE, '#3E8A5A'], [-RE, RE, '#F3F1EA']]) tassel(g, x, y, ZC, c);
      g.fill([[-RE, RE, ZC], [RE, RE, ZC], [RE, RE, ZC + 1.6], [-RE, RE, ZC + 1.6]], '#6B4A8A');
      g.fill([[RE, -RE, ZC], [RE, RE, ZC], [RE, RE, ZC + 1.6], [RE, -RE, ZC + 1.6]], '#58397A');
      const sw = []; for (const f of ['L', 'R']) for (let i = 0; i <= 8; i++) { const a = -RE + 2 * RE * i / 8, p = g.p.apply(g, K.pt(f, RE + 0.05, f === 'L' ? a : a, ZC + 0.15 + (i % 2) * 0.25)); sw.push(p); }
      g.outline([[-RE, RE, ZC], [RE, RE, ZC], [RE, -RE, ZC]], { w: 0.5, c: '#3A2A4A', boil: false, open: true });
      for (const [f, a] of [['L', 0], ['R', 0]]) { const c = g.p.apply(g, K.pt(f, RE + 0.08, a, ZC + 0.8)); for (let i = 0; i < 5; i++) { const t = TAU * i / 5 - Math.PI / 2; g.disc2([c[0] + Math.cos(t) * 0.9, c[1] + Math.sin(t) * 0.9], 0.65, '#FBFAF6'); } g.disc2(c, 0.4, '#E6C24F'); }
      K.box(g, -RE + 0.3, -RE + 0.3, RE - 0.3, RE - 0.3, ZC + 1.6, ZC + 2.3, { t: '#3A3530', l: '#5A4A3C', r: '#4A3A2C' }, { w: 0.5, boil: false });
      K.gable(g, -RE - 0.8, -RE - 0.8, RE + 0.8, RE + 0.8, ZC + 2.3, 4.0, 'x', { a: '#4A4E5A', b: '#4A4E5A', e: '#C9A26B' }, { w: 0.75 });
      const ridge = (x) => g.p(x, 0, ZC + 6.3);
      for (const x of [-4.2, -2.1, 0, 2.1, 4.2]) { const c = g.p(x, 0, ZC + 6.6); g.fill2([[c[0] - 1.2, c[1] - 0.3], [c[0] + 1.2, c[1] + 1.0], [c[0] + 1.2, c[1] - 0.3], [c[0] - 1.2, c[1] - 1.6]], '#C9A26B', true); }
      g.line2([ridge(-RE - 0.8), ridge(RE + 0.8)], { w: 1.3, c: '#2E2A26', boil: false });
      for (const x of [-RE - 0.8, RE + 0.8]) { const c = g.p(x, 0, ZC + 6.3); g.segs2([c[0] - 2.4, c[1] - 3.0, c[0] + 1.0, c[1] + 1.0, c[0] + 2.4, c[1] - 3.0, c[0] - 1.0, c[1] + 1.0], '#6E5A44', 0.8); }
      const gb = g.p(RE + 0.8, 0, ZC + 4.3); g.disc2(gb, 0.6, '#DAAD45');
      const cab = []; for (const [x, y] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) { const a = g.p(x, y, ZC + 4.6), b = g.p(x * 0.4, y * 0.4, ZR - 0.5); cab.push(a[0], a[1], b[0], b[1]); } g.segs2(cab, '#6E6A64', 0.3);
      g.mark(LIT(0.8), 0);
      for (const [x, y] of [[RE, -RE], [-RE, RE], [RE, RE]]) g.glow('neon', x * 0.8, y * 0.8, ZC - 0.6, { r: 5, col: '#FFF1D0' });
    }, { name: 'dohyo' });
    T.obj([6.3, 6.3], (g) => tassel(g, 6.3, 6.3, 19.2, '#C9463E'), { name: 'red tassel' });

    // the bout, the crowd (four quarters, so the ring hides the far ones and the near ones hide the ring)
    bout(T);
    for (const s of ['A', 'B', 'C', 'D']) crowd(T, s, seats.filter((q) => q[4] === s));

    // outside: the banners with the wrestlers' names, the yakitori stand
    nobori(T, [[29.2, -22], [29.2, -17], [29.2, -12], [29.2, -7]], ['#C9463E', '#3F5F8F', '#E6C24F', '#5E8A4A'], ['雷電', '大和', '大山', '金山'], 1);
    nobori(T, [[-22, 29.2], [-17, 29.2], [-12, 29.2]], ['#D98AA4', '#F3F1EA', '#7A5BA0'], ['小山', '中山', '花山'], 2);
    T.obj([19.6, 26.2, 26.4, 28.8], function (g) {
      K.box(g, 20, 26.2, 26, 28.6, 0, 2.6, { t: '#D9B57E', l: '#C9A26B', r: '#B58F58' }, { w: 0.6, boil: false });
      const ps = []; for (const [x, y] of [[20, 28.6], [26, 28.6], [26, 26.2]]) { const a = g.p(x, y, 2.6), b = g.p(x, y, 5.8); ps.push(a[0], a[1], b[0], b[1]); } g.segs2(ps, '#5A4A3C', 0.5);
      TK.awning(g, 'L', 26.2, 19.6, 26.4, 6.4, 2.6, '#C9463E', { drop: 0.7, stripe: '#F3F1EA' });
      // the grill smoking on the counter, skewers on it
      K.box(g, 21, 27.2, 24, 28.2, 2.6, 3.2, '#3A3530', { w: 0.4, boil: false });
      const sk = []; for (let x = 21.3; x < 23.8; x += 0.4) { const a = g.p(x, 27.3, 3.3), b = g.p(x, 28.4, 3.3); sk.push(a[0], a[1], b[0], b[1]); } g.segs2(sk, '#A0714B', 0.35);
      TK.sign(g, 'L', 28.6, 20.6, 25.4, 3.6, 5.4, '#F3F1EA', { word: '焼鳥', ink: '#C9463E' });
      TK.lantern2(g, g.p(26.4, 28.8, 4.8), 1.5, '#D4553A');
    }, { name: 'yakitori stand' });
    TK.idle(T, TK.who(7801, { dir: 1, top: '#F3F1EA', cap: '#F3F1EA' }), 23, 25.3, { acts: ['talk', 'point', 'rest', 'look'], seed: 7801, z: 0 });
    TK.idle(T, Object.assign(TK.salary(7802, { dir: 3 }), { food: '#A0714B' }), 22.4, 29.6, { acts: ['eat', 'eat', 'talk', 'laugh'], seed: 7802 });
    TK.group(T, [{ who: TK.kimono(7803, { dir: 0 }), x: 15.4, y: 29.2 }, { who: TK.who(7804, { dir: 2 }), x: 17.4, y: 29.0 }], { seed: 31 });
    TK.photo(T, { who: TK.who(7805, { dir: 3 }), x: 28.6, y: 2.6 }, [{ who: TK.who(7806, { dir: 1 }), x: 28.4, y: -4.4 }], { seed: 4 });

    /* a champion's portrait high on the wall: a lacquer frame, a wrestler in his embroidered apron (kesho-mawashi) */
    function portrait(g, face, p, a, z, i) {
      const P = (u, v) => g.p.apply(g, K.pt(face, p + 0.06, a + u, z + v)), q = (pts) => pts.map(([u, v]) => P(u, v));
      const fr = q([[-2.3, -3.1], [2.3, -3.1], [2.3, 3.1], [-2.3, 3.1]]), bg = q([[-1.9, -2.7], [1.9, -2.7], [1.9, 2.7], [-1.9, 2.7]]);
      g.fill2(fr, '#5A4636'); g.fill2(bg, ['#D6DEE4', '#E4DACB', '#DCE3D6'][i % 3]);
      g.fill2(q([[-1.5, 0.9], [1.5, 0.9], [1.7, -0.6], [1.1, -2.7], [-1.1, -2.7], [-1.7, -0.6]]), ['#E8BE9A', '#D9A57B', '#E8BE9A'][i % 3]);
      g.fill2(q([[-0.95, -0.4], [0.95, -0.4], [1.05, -2.7], [-1.05, -2.7]]), ['#C9463E', '#3F5F8F', '#DAAD45', '#5E8A4A', '#7A5BA0'][i % 5]);
      g.fill2(q([[-0.95, -0.4], [0.95, -0.4], [0.95, -0.75], [-0.95, -0.75]]), '#2E2A26');
      const h = P(0, 1.75); g.disc2(h, 1.9, ['#E8BE9A', '#D9A57B', '#E8BE9A'][i % 3]); g.disc2(P(0, 2.3), 1.3, '#1F1A18'); g.disc2(P(0.25, 2.75), 0.8, '#1F1A18');
      g.outline2(fr, { w: 0.45, c: '#3A2A22', boil: false });
    }
    /* the green copper roof over the far half, cut along its two hips; the gilded finial on top */
    function roof(g) {
      const e = E + 0.9, A = [0, 0, ZR], c0 = [-e, -e, ZE], cx = [e, -e, ZE], cy = [-e, e, ZE];
      g.fill([cx, [e, -e, ZE - 1.2], [0, 0, ZR - 1.2], A], '#E3DDCF'); g.fill([cy, [-e, e, ZE - 1.2], [0, 0, ZR - 1.2], A], '#E9E4D8');
      g.fill([c0, cx, A], '#6FA88E'); g.fill([c0, cy, A], '#83BAA0');
      const s = [];
      for (let k = -e + 1.3; k < e - 0.5; k += 1.3) {
        const t = Math.abs(k), z = ZE + (ZR - ZE) * (1 - t / e);
        let a = g.p(k, -e, ZE), b = g.p(k, -t, z); s.push(a[0], a[1], b[0], b[1]);
        a = g.p(-e, k, ZE); b = g.p(-t, k, z); s.push(a[0], a[1], b[0], b[1]);
      }
      g.segs2(s, '#4F8A70', 0.3);
      g.line([cx, A, cy], { w: 0.9, c: '#2F5A48', boil: false }); g.line([[e, -e, ZE - 1.2], [0, 0, ZR - 1.2], [-e, e, ZE - 1.2]], { w: 0.5, c: '#8C8576', boil: false });
      g.line([c0, A], { w: 0.5, c: '#2F5A48', boil: false });
      const f0 = g.p(0, 0, ZR), f1 = g.p(0, 0, ZR + 2.6); g.line2([f0, f1], { w: 0.7, c: '#9A7A2A', boil: false }); g.disc2(g.p(0, 0, ZR + 1.3), 0.9, '#DAAD45'); g.disc2(f1, 0.6, '#DAAD45');
    }
    /* a tassel (fusa) hanging from a corner of the roof: its cord, the knot, the fringe */
    function tassel(g, x, y, z, c) {
      const a = g.p(x, y, z), k = g.p(x, y, z - 0.9), t0 = g.p(x, y, z - 1.3), t1 = g.p(x, y, z - 3.3), ink = c === '#F3F1EA' ? '#9A948A' : shade(c, 0.45);
      g.line2([a, k], { w: 0.5, c, boil: false });
      const fr = [[t0[0] - 1.3, t0[1]], [t0[0] + 1.3, t0[1]], [t1[0] + 2.4, t1[1]], [t1[0] - 2.4, t1[1]]];
      g.fill2(fr, c, true); g.fill2([[t0[0] + 0.3, t0[1]], [t0[0] + 1.3, t0[1]], [t1[0] + 2.4, t1[1]], [t1[0] + 0.6, t1[1]]], shade(c, c === '#2E2A26' ? -0.15 : 0.12), true);
      const st = []; for (let i = -3; i <= 3; i++) st.push(t0[0] + i * 0.3, t0[1] + 1.2, t1[0] + i * 0.62, t1[1] - 0.2); g.segs2(st, ink, 0.22);
      g.outline2(fr, { w: 0.35, c: ink, boil: false }); g.disc2(k, 1.25, c); g.ring2(k, 1.25, { c: ink, w: 0.3 });
    }
    /* where everyone is in a bout at time u (0..18): A starts on the -x side; win: which of them wins (0 A, 1 B) */
    function boutAt(u, win) {
      const S = { ap: 0.3, bp: 0.3, ax: -3.0, bx: 3.0, y: 0, gx: 0.6, gy: -4.8, fan: 0, salt: -1 };
      const sgn = win ? -1 : 1, osc = (v) => 1.1 * Math.sin(TAU * v / 3.1) + 0.35 * Math.sin(TAU * v / 1.05 + 1);
      if (u < 2.0) { S.salt = u / 1.4; S.ap = 0.5; S.bp = 0.5; }
      else if (u < 2.5) { const v = (u - 2.0) / 0.5; S.ax = lerp(-3.0, -1.9, v); S.bx = lerp(3.0, 1.9, v); S.ap = S.bp = 1.0; }
      else if (u < 9.0) { const xc = osc(u - 2.5) * (u < 3 ? (u - 2.5) * 2 : 1), w = Math.sin(TAU * (u - 2.5) / 1.6); S.ax = xc - 1.9; S.bx = xc + 1.9; S.ap = 0.75 + 0.25 * w; S.bp = 0.75 - 0.25 * w; S.y = 0.5 * Math.sin(TAU * (u - 2.5) / 4.3); S.gx = xc * 0.5; S.fan = 1; }
      else if (u < 10.5) { const v = smooth((u - 9.0) / 1.5), x0 = osc(6.5), xc = lerp(x0, sgn * 4.3, v); S.ax = xc - 1.9; S.bx = xc + 1.9; S.ap = win ? 0.35 : 1.0; S.bp = win ? 1.0 : 0.35; S.gx = xc * 0.5; S.fan = 1; }
      else if (u < 13.5) { S.ax = win ? -6.1 : 2.4; S.bx = win ? -2.4 : 6.1; S.ap = S.bp = 0; S.gx = sgn * 1.6; S.fan = 2; S.win = win; }
      else if (u < 16.0) { const v = (u - 13.5) / 2.5; S.ax = lerp(win ? -6.1 : 2.4, -3.0, v); S.bx = lerp(win ? -2.4 : 6.1, 3.0, v); S.ap = S.bp = 0; S.gx = lerp(sgn * 1.6, 0, v); }
      else { S.ap = S.bp = 0.9; }
      return S;
    }
    function bout(T) {
      const P = 36, MA = '#2F3A4F', MB = '#7A3A6A';
      const gyoji = Object.assign(TK.who(7700), { dress: '#7A5BA0', top: '#7A5BA0', sleeve: '#7A5BA0', bot: '#7A5BA0', eboshi: true, shoe: '#F3F1EA', bare: false, shorts: false, muffler: undefined, higasa: undefined, uchiwa: undefined, coat: false, jacket: undefined, obi: '#F3F1EA' });
      T.actor({ sample: 0.25, period: P, grow: false, r: 34,
        at(t) { const k = Math.floor((((t % P) + P) % P) * 4); return { x: 0, y: 0, z: DZ, key: k, k }; },
        draw(g, st) {
          const t = st.k / 4, b = t >= 18 ? 1 : 0, S = boutAt(t - b * 18, b);
          // the gyōji on the far side, crouched with his fan held out over the two; he names the winner with it raised
          const hands = S.fan === 2 ? [[-1.4, -11.6], [2.0 * (S.win ? -1 : 1) + 2, -19.2]] : S.fan === 1 ? [[-1.0, -11.0], [3.6, -13.8]] : [[-1.6, -10.2], [2.4, -12.6]];
          const r = TK.person(g, S.gx, S.gy, 0, Object.assign({}, gyoji, { dir: 1, hands, lean: S.fan === 1 ? 1.0 : 0 }));
          const h = r.hands[0][1] < r.hands[1][1] ? r.hands[0] : r.hands[1], fc = [h[0], h[1] - 1.8];
          g.line2([h, [fc[0], fc[1] + 0.9]], { w: 0.45, c: '#3A3530', boil: false });
          const fan = []; for (let i = 0; i < 12; i++) { const a = TAU * i / 12; fan.push([fc[0] + Math.cos(a) * 1.25, fc[1] + Math.sin(a) * 1.5]); }
          g.fill2(fan, '#2A2622', true); g.line2(fan, { w: 0.35, c: '#DAAD45', close: true, boil: false }); g.disc2(fc, 0.35, '#DAAD45');
          g.line2([[fc[0], fc[1] + 1.5], [fc[0] + 0.5, fc[1] + 3.6]], { w: 0.4, c: '#7A5BA0', boil: false });
          // the two wrestlers, the far one first
          const A = () => TK.rikishi(g, S.ax, S.y - 0.2, 0, { dir: 0, push: S.ap, mawashi: MA, k: 1.12 });
          const B = () => TK.rikishi(g, S.bx, S.y + 0.2, 0, { dir: 2, push: S.bp, mawashi: MB, skin: '#D9A57B', k: 1.12 });
          A(); B();
          // a handful of salt thrown over the ring
          g.mark(LIT(0.75), 0);
          if (S.salt >= 0 && S.salt <= 1) { const o = g.p(S.bx - 0.6, 0, 8.6), sp = []; for (let i = 0; i < 9; i++) { const v = S.salt * (0.6 + i * 0.05), x = o[0] - v * 18 + (i % 3) * 0.8, y = o[1] - Math.sin(Math.PI * Math.min(1, v * 1.3)) * 9 + v * 10 + (i % 4) * 0.6; sp.push(x, y, x + 0.5, y + 0.3); } g.segs2(sp, '#FBFAF6', 0.8); }
        } });
    }
    /* the crowd of one quarter: hushed at the crouch, clapping through the bout, a roar and a standing wave round the
       hall when it is won */
    function crowd(T, side, list) {
      const P = 36, at = { A: [-19, 0], B: [0, -19], C: [17, -4], D: [-6, 16] }[side];
      list = list.slice().sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]) || p[2] - q[2]);
      const ang = list.map((q) => ((Math.atan2(q[1], q[0]) / TAU + 1.125) % 1)), ph = list.map((q, i) => h2(i * 7 + 3, 41));
      T.actor({ sample: 0.25, period: P, grow: false, r: 60,
        at(t) {
          const u = ((t % 18) + 18) % 18;
          const m = u < 2.0 ? 's0' : u < 9.0 ? 'k' + (Math.floor(u * 4) % 2) : u < 10.5 ? 'k' + (Math.floor(u * 6) % 2) : u < 13.5 ? 'w' + Math.min(5, Math.floor((u - 10.5) * 2)) : 's1';   // the wave in six steps (each step is a big drawing)
          return { x: at[0], y: at[1], key: m, m };
        },
        draw(g, st) {
          const mode = st.m[0], f = +st.m.slice(1);
          list.forEach((q, i) => {
            let arm = 0;
            if (q[6]) arm = 0;
            else if (mode === 'k') arm = ph[i] < 0.75 ? 1 + ((f + (ph[i] < 0.4 ? 1 : 0)) % 2) : 0;
            else if (mode === 'w') { const wp = f / 5 * 1.5 - 0.25, d = Math.abs(ang[i] - wp); arm = d < 0.2 ? 3 : ph[i] < 0.5 ? 1 + (f % 2) : 0; }
            else if (mode === 's') arm = ph[i] > 0.93 ? (f ? 4 : 1) : 0;
            const c = g.p(q[0] - at[0], q[1] - at[1], q[2] + (arm === 3 ? 0.5 : 0));
            bust(g, c, q[3], q[5], arm, q[6] === 'rikishi');
          });
          g.mark(LIT(0.65), 0);
        } });
    }
    /* someone in the stands, seen from the front or from behind: arm 0 still, 1/2 clapping, 3 arms up, 4 a wave */
    function bust(g, p, w, back, arm, bare) {
      const k = 0.86, s = (u, v) => [p[0] + u * k, p[1] + v * k], top = w.top, skin = w.skin || '#E8BE9A', hair = w.hair || '#2B2420', ink = '#3A3128';
      if (arm === 3 || arm === 4) for (const sx of arm === 3 ? [-1, 1] : [1]) { g.line2([s(sx * 1.6, -3.4), s(sx * 2.5, -6.2), s(sx * 2.3, -8.9)], { w: 1.1, c: bare ? skin : top, boil: false, ext: 0 }); g.disc2(s(sx * 2.3, -9.2), 0.6, skin); }
      const body = [s(-2.3, 0), s(-2.1, -3.2), s(-1.1, -4.3), s(1.1, -4.3), s(2.1, -3.2), s(2.3, 0)];
      g.fill2(body, bare ? skin : top, true); g.outline2(body, { w: 0.28, c: ink, boil: false });
      const hc = s(0, -6.2);
      if (back) { g.disc2(hc, 1.8 * k, hair); if (bare) g.disc2(s(0, -8.2), 0.7 * k, hair); }
      else {
        g.disc2(hc, 1.75 * k, skin); g.fill2(K.curve([s(-1.85, -5.9), s(-1.75, -7.6), s(0, -8.35), s(1.75, -7.6), s(1.85, -6.0), s(1.0, -6.9), s(-0.9, -6.95)], 2, true), hair, true);
        if (bare) g.disc2(s(0, -8.5), 0.7 * k, hair);
        g.disc2(s(-0.55, -6.0), 0.18, ink); g.disc2(s(0.6, -6.0), 0.18, ink);
      }
      if (arm === 1 || arm === 2) { const d = arm === 1 ? 0.25 : 0.9, yv = back ? -9.0 : -3.3; if (back) for (const sx of [-1, 1]) g.line2([s(sx * 1.5, -3.6), s(sx * (d + 0.5), yv + 0.4)], { w: 0.9, c: bare ? skin : top, boil: false, ext: 0 }); g.disc2(s(-d, yv), 0.55, skin); g.disc2(s(d, yv - 0.1), 0.55, skin); }
    }
    /* the banners with wrestlers' names along a side, their free edges stirring */
    /* (each banner is an actor of its own at its pole, on one clock: a row in one actor was in front of or behind
       everything round it at once) */
    function nobori(T, pts, cols, words, seed) {
      pts.forEach(([x, y], i) => T.actor({ sample: 0.25, period: 6, grow: false, r: 30,
        at(t) { const f = Math.floor(t * 2) % 4; return { x, y, key: f, f }; },
        draw(g, st) {
          {
            const b = g.p(0, 0, 0), t = g.p(0, 0, 12.5), sw = [0, 0.7, 1.1, 0.5][(st.f + i) % 4], W = 6.2, Hh = 26;
            g.line2([b, t], { w: 0.55, c: '#6B6458', boil: false });
            g.line2([[t[0], t[1] + 1.0], [t[0] + W + 0.6, t[1] + 1.0]], { w: 0.4, c: '#6B6458', boil: false });
            const top = t[1] + 1.4, fl = [[t[0] + 0.4, top], [t[0] + W, top], [t[0] + W + sw, top + Hh * 0.5], [t[0] + W + sw * 0.6, top + Hh], [t[0] + 0.4, top + Hh]];
            const col = cols[i % cols.length], dark = hex2rgb(col).reduce((a, c) => a + c) < 420;
            g.fill2(fl, col, true); g.fill2([[t[0] + 0.4, top], [t[0] + W, top], [t[0] + W, top + 2.4], [t[0] + 0.4, top + 2.4]], dark ? '#F3F1EA' : shade(col, 0.25), true);
            g.line2(fl, { w: 0.4, c: shade(col, 0.5), close: true, boil: false });
            const n = [...words[i]].length, sz = Math.min(4.4, (Hh - 5) / (n * 1.08));
            TK.word2(g, [t[0] + 0.4 + (W - 0.4) / 2 + sw * 0.3, top + 3 + (Hh - 3) / 2], sz, words[i], dark ? '#F6F3EA' : '#2A2622', { vert: true, w: Math.max(0.5, sz * 0.14) });
          }
        } }));
    }
  });
})();
