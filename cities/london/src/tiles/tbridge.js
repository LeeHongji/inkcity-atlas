'use strict';
/* Tower Bridge (x 40..60 over the river y 30..70) and its lift, the city's clever moment.
   How it is built: two Gothic towers of pale stone on granite piers in the river. Each tower is four tall octagonal
   corner turrets with pointed caps round a narrower body; the road passes through a pointed arch; a steep slate roof
   with a central flèche. Two high walkways of blue-and-white lattice girders join the towers, sightseers inside. The
   side spans hang from blue suspension chains slung from the towers to posts on the banks. Between the towers, the two
   bascules (leaves) of the opening span.
   The lift (src/37_timetable.js): barriers drop and the lights turn red on both approaches, the bascules rise to 82
   degrees, the tall ship glides through under the walkways, the bascules come down, the barriers lift and the queued
   traffic moves off. Depth: the spans are { under: 0 } (boats under, cars on), the towers { under: 9 } (cars through the
   arches), the walkways { under: 18.5 }. The bascules are actors whose anchors put them under the cars when down and
   between the north tower and the ship (north leaf) or the ship and the south tower (south leaf) when up. */
SF.tile('tbridge', 50, 50, { order: 1.6, rim: 70, castAt: 150, shared: true, half: 22 }, function (T) {
  const TB = LT.TB, WL = LT.RIV.WL, n0 = TB.n0 - 50, n1 = TB.n1 - 50, s0 = TB.s0 - 50, s1 = TB.s1 - 50, Y0 = -20, Y1 = 20, X0 = -10, X1 = 10;
  const ST = { t: '#ECE8DD', l: '#E6E1D4', r: '#CBC4B4' }, ROOF = '#5B6571', BLUE = '#7FA6C6', BLUED = '#5F86A8', WHITE = '#F3F1EA';
  const GIRD = { t: '#9DBAD2', l: BLUE, r: BLUED };
  const RX = 7.0, AZ = 11.8, AT = 15.0, BZ = 21.6, TX = 8.4, TR = 1.55, TZ = 24.4;      // road half width, arch spring and top, body top, turret x, radius, top
  const archTop = (x) => AZ + (AT - AZ) * Math.pow(Math.max(0, 1 - Math.abs(x) / RX), 0.75);

  /* a tower between ya and yb */
  const turret = (g, x, y) => {
    K.cyl(g, x, y, TR, 0, TZ, ST, { w: 0.65, n: 8 });
    const sl = []; for (const z of [4, 9, 14, 19]) { const a = g.p(x - 0.25, y + TR * 0.7, z), b = g.p(x - 0.25, y + TR * 0.7, z + 1.8); sl.push(a[0], a[1], b[0], b[1]); } g.segs2(sl, '#4A4E58', 0.7);
    K.cyl(g, x, y, TR + 0.2, TZ - 0.6, TZ, { t: '#D9D3C4', l: '#D2CBBB', r: '#B9B1A0' }, { w: 0.5, n: 8 });
    K.cone(g, x, y, TR + 0.15, TZ, 3.6, ROOF);
    const t = g.p(x, y, TZ + 3.6), tt = g.p(x, y, TZ + 4.6); g.line2([t, tt], { w: 0.4, c: '#3E4650', boil: false, ext: 0 }); g.disc2(tt, 0.35, '#D9A93E');
  };
  const tower = (g, ya, yb) => {
    g.boilP = 0.3; const i0 = g.cmds.length;
    const m = (ya + yb) / 2, by0 = ya + 0.7, by1 = yb - 0.7;
    // the pier in the river, its cutwater pointing downstream
    K.box(g, X0 - 0.4, ya - 0.5, X1 + 0.4, yb + 0.5, WL, 0, { t: '#C9C3B4', l: '#C3BDAE', r: '#ADA696' }, { w: 0.7 });
    g.fill([[X1 + 0.4, ya - 0.5, WL], [X1 + 2.6, m, WL], [X1 + 2.6, m, 0], [X1 + 0.4, ya - 0.5, 0]], '#D3CDBE'); g.fill([[X1 + 2.6, m, WL], [X1 + 0.4, yb + 0.5, WL], [X1 + 0.4, yb + 0.5, 0], [X1 + 2.6, m, 0]], '#B3AC9C');
    g.line([[X1 + 0.4, yb + 0.5, 0], [X1 + 2.6, m, 0], [X1 + 0.4, ya - 0.5, 0]], { w: 0.6, boil: false }); g.line([[X1 + 2.6, m, 0], [X1 + 2.6, m, WL]], { w: 0.55, boil: false });
    // the far turrets, then the body with its arch, then the near turrets
    turret(g, -TX, ya + TR - 0.2); turret(g, TX, ya + TR - 0.2);
    g.fill([[-RX, by0, 0], [-RX, by1, 0], [-RX, by1, AZ], [-RX, by0, AZ]], '#B9B1A0');            // the far side of the arch passage
    const face = [[-TX, by1, 0], [-RX, by1, 0]]; for (let i = 0; i <= 14; i++) { const x = -RX + 2 * RX * i / 14; face.push([x, by1, archTop(x)]); } face.push([RX, by1, 0], [TX, by1, 0], [TX, by1, BZ], [-TX, by1, BZ]);
    g.fill(face, ST.l); g.fill([[TX, by0, 0], [TX, by1, 0], [TX, by1, BZ], [TX, by0, BZ]], ST.r); g.fill(K.rect(-TX, by0, TX, by1, BZ), ST.t);
    g.outline(face, { w: 0.85 });
    const arch = []; for (let i = 0; i <= 14; i++) { const x = -RX + 2 * RX * i / 14; arch.push([x, by1 + 0.03, archTop(x) + 0.7]); } g.line(arch, { w: 0.45, c: '#A9A193', boil: false });
    for (const z of [AT + 0.9]) g.fine([[-TX, by1 + 0.02, z], [TX, by1 + 0.02, z]], { w: 0.4, c: '#A9A193' });
    for (const x of [-4.6, -1.5, 1.5, 4.6]) K.win(g, 'L', by1 + 0.03, x - 0.55, x + 0.55, 17.6, 20.4, { style: 'dark', arch: true, col: '#4A4E58', w: 0.35 });
    for (const x of []) K.win(g, 'L', by1 + 0.03, x - 0.55, x + 0.55, AZ + 3.9, AZ + 6.2, { style: 'dark', arch: true, col: '#4A4E58', w: 0.35 });
    // the roof: a steep slate hip with dormers, a tall central flèche
    K.hip(g, -TX, by0, TX, by1, BZ, 4.4, ROOF, { ridge: 9, c: '#3E4650', w: 0.7 });
    for (const x of [-4.5, 0, 4.5]) { const b = g.p(x, by1 - 0.4, BZ + 0.5), t = g.p(x, by1 - 0.4, BZ + 2.6), q = [[b[0] - 0.8, b[1]], [b[0] + 0.8, b[1]], [t[0] + 0.8, t[1] + 0.6], [t[0], t[1] - 0.8], [t[0] - 0.8, t[1] + 0.6]]; g.fill2(q, ST.l); g.outline2(q, { w: 0.4, boil: false }); }
    K.hip(g, -1.4, m - 1.4, 1.4, m + 1.4, BZ + 4.0, 5.6, ROOF, { c: '#3E4650', w: 0.6 });
    const fb = g.p(0, m, BZ + 9.6), ft = g.p(0, m, BZ + 11.2); g.line2([fb, ft], { w: 0.5, c: '#3E4650', boil: false, ext: 0 }); g.disc2(ft, 0.45, '#D9A93E');
    turret(g, -TX, yb - TR + 0.2); turret(g, TX, yb - TR + 0.2);
    // at night: the stone towers floodlit pale white, blue light round the piers at their feet
    const PIER = new Set(['#C9C3B4', '#C3BDAE', '#ADA696', '#D3CDBE', '#B3AC9C']);
    LK.flood(g, i0, 0.9, LK.FLOOD.white, (c) => (PIER.has(c) ? mix(LK.floodCol(c, 0.6, LK.FLOOD.white), '#6E9FE6', 0.35) : undefined));
    for (const [x, z, r] of [[0, 5.5, 3.0], [-4.6, 13.5, 2.4], [4.6, 13.5, 2.4], [0, 19, 2.6]]) g.glow('lantern', x, by1 + 0.6, z, { r, col: '#F1EEFF' });
    for (const [y, z, r] of [[m, 8, 2.6], [m, 17, 2.2]]) g.glow('lantern', TX + 0.6, y, z, { r, col: '#F1EEFF' });
    for (const x of [-TX, TX]) g.glow('lantern', x, yb - TR + 0.2, TZ - 1.2, { r: 1.6, col: '#F1EEFF' });
    g.glow('neon', X1 + 1.2, m, 0.6, { r: 3.0, col: '#76AEFF', base: WL });
  };
  /* the suspension chain on one side of a span, from the tower (at yt) down to its post on the bank (at ye) */
  const chain = (g, x, yt, ye, near) => {
    const top = [], bot = [], zt = 19.6, zb = 3.0;
    for (let i = 0; i <= 14; i++) { const f = i / 14, y = lerp(ye, yt, f), z = zb + (zt - zb) * Math.pow(f, 1.75); top.push([x, y, z]); bot.push([x, y, Math.max(1.2, z - 1.15)]); }
    g.fill(top.concat(bot.slice().reverse()), near ? BLUE : '#9AB6CD'); g.mark({ nc: near ? '#9FD0F6' : '#7FAFD8' });   // lines of light at night
    const lat = []; for (let i = 0; i < 14; i++) { const a = g.p.apply(g, top[i]), b = g.p.apply(g, bot[i + 1]); lat.push(a[0], a[1], b[0], b[1]); } g.segs2(lat, WHITE, 0.4);
    g.line(top, { w: near ? 0.75 : 0.55, c: '#2F4A63', boil: false }); g.line(bot, { w: 0.45, c: '#2F4A63', boil: false });
    const hs = []; for (let i = 1; i < 14; i++) { const p = bot[i], a = g.p.apply(g, p), b = g.p(p[0], p[1], 0.6); hs.push(a[0], a[1], b[0], b[1]); } g.segs2(hs, '#4E6E8C', 0.35);
    K.box(g, x - 0.7, ye - 0.7, x + 0.7, ye + 0.7, 0, 3.6, ST, { w: 0.55 }); K.cone(g, x, ye, 0.95, 3.6, 1.6, ROOF);
    for (let i = 2; i < 14; i += near ? 2 : 4) LK.glowDry(g, 'neon', top[i][0], top[i][1], top[i][2] - 0.5, { r: near ? 1.3 : 1.0, col: '#CDE8FF' });
  };
  const span = (g, ya, yb, yt, ye) => {
    g.boilP = 0.3;
    // the girder face under the deck on the east side, then the deck: carriageway between two narrow kerbs
    g.fill([[X1, ya, -1.8], [X1, yb, -1.8], [X1, yb, 0], [X1, ya, 0]], BLUE);
    const gs = []; for (let y = ya + 0.4; y < yb - 0.8; y += 1.6) { const a = g.p(X1 + 0.02, y, -1.7), b = g.p(X1 + 0.02, y + 0.8, -0.1), c = g.p(X1 + 0.02, y + 1.6, -1.7); gs.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); } g.segs2(gs, WHITE, 0.35);
    g.line([[X1, ya, -1.8], [X1, yb, -1.8]], { w: 0.6, boil: false });
    g.fill(K.rect(X0, ya, X1, yb, 0), '#D9D5CB'); g.fill(K.rect(-RX, ya, RX, yb, 0), LK.C.asph);
    for (let y = ya + 1; y < yb - 2; y += 6) g.line([[0, y, 0], [0, y + 3, 0]], { c: '#F4F2EC', w: 0.9, boil: false, ext: 0.2 });
    for (const x of [-RX, RX]) g.line([[x, ya, 0], [x, yb, 0]], { w: 0.5, c: '#9E9A90', boil: false });
    g.line([[X1, ya, 0], [X1, yb, 0]], { w: 0.85, boil: false });
    const rl = []; for (let y = ya; y <= yb; y += 0.8) { const a = g.p(X0 + 0.3, y, 0), b = g.p(X0 + 0.3, y, 1.2); rl.push(a[0], a[1], b[0], b[1]); } g.segs2(rl, '#4E6E8C', 0.35); g.line([[X0 + 0.3, ya, 1.2], [X0 + 0.3, yb, 1.2]], { w: 0.45, c: '#2F4A63', boil: false });
    chain(g, X0 + 0.6, yt, ye, false);
    for (let y = ya + 3; y < yb - 1; y += 6) LK.glowDry(g, 'lamp', X0 + 0.3, y, 2.0, { r: 1.2 });
  };
  const nearRail = (g, ya, yb, yt, ye) => {
    const rl = []; for (let y = ya; y <= yb; y += 0.8) { const a = g.p(X1 - 0.3, y, 0), b = g.p(X1 - 0.3, y, 1.2); rl.push(a[0], a[1], b[0], b[1]); } g.segs2(rl, '#4E6E8C', 0.4); g.line([[X1 - 0.3, ya, 1.2], [X1 - 0.3, yb, 1.2]], { w: 0.55, c: '#2F4A63', boil: false });
    chain(g, X1 - 0.6, yt, ye, true);
    for (let y = ya + 3; y < yb - 1; y += 6) g.glow2('lamp', g.p(X1 - 0.3, y, 2.0), g.p(X1 - 0.3, y, 0), { r: 1.2 });
  };
  /* a high walkway: a lattice girder box between the towers; sightseers in the near one */
  const walkway = (g, x0, x1, near) => {
    g.boilP = 0.25;
    const ya = n1 - 0.7, yb = s0 + 0.7, z0 = TB.walk, z1 = TB.walk + 2.8;
    const i0 = g.cmds.length;
    K.box(g, x0, ya, x1, yb, z0, z0 + 0.5, GIRD, { w: 0.55, nohid: true });
    const xf = x1, lat = [];
    if (near) { g.fill([[x1, ya, z0 + 0.5], [x1, yb, z0 + 0.5], [x1, yb, z1], [x1, ya, z1]], '#CFE0E8'); [[0.6, 0], [2.4, 1], [4.6, 2], [6.6, 3]].forEach(([dy, i]) => LK.bust2(g, g.p(x1 - 0.6, ya + dy, z0 + 0.5), LK.tourist(7300 + i), 0.72)); }
    for (let y = ya; y < yb - 0.1; y += 1.0) { const a = g.p(xf + 0.02, y, z0 + 0.5), b = g.p(xf + 0.02, y + 1.0, z1), c = g.p(xf + 0.02, y + 1.0, z0 + 0.5), d = g.p(xf + 0.02, y, z1); lat.push(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]); }
    g.segs2(lat, near ? BLUED : '#94B2CB', near ? 0.45 : 0.4);
    K.box(g, x0, ya, x1, yb, z1, z1 + 0.5, GIRD, { w: 0.55, nohid: true });
    if (near) g.outline([[x1, ya, z0], [x1, yb, z0], [x1, yb, z1 + 0.5], [x1, ya, z1 + 0.5]], { w: 0.6, c: '#2F4A63', boil: false });
    // at night: the girders traced in light, the glazed walkway lit inside
    const WN = { '#9DBAD2': '#C4E2FA', '#7FA6C6': '#A6D2F4', '#5F86A8': '#86B6E2', '#CFE0E8': '#E6F0FF' };
    g.mark({ nc: (c) => WN[c] }, i0);
    for (let y = ya + 1; y < yb; y += near ? 2.2 : 4.4) for (const z of near ? [z0 + 0.3, z1 + 0.3] : [z1 + 0.3]) LK.glowDry(g, 'neon', x1, y, z, { r: 1.2, col: '#CDE8FF' });
  };

  T.obj([X0, Y0, X1, n0], (g) => span(g, Y0, n0, n0, Y0), { name: 'north span', under: 0 });
  T.obj([X1 - 0.9, Y0, X1, n0], (g) => nearRail(g, Y0, n0, n0, Y0), { on: true, name: 'north chain' });
  T.obj([X0, n0, X1, n1], (g) => tower(g, n0, n1), { name: 'north tower', under: AZ });
  T.obj([X0, n1, X0 + 2.2, s0], (g) => walkway(g, X0, X0 + 2.2, false), { name: 'far walkway', under: TB.walk });
  T.obj([X1 - 2.2, n1, X1, s0], (g) => walkway(g, X1 - 2.2, X1, true), { name: 'near walkway', under: TB.walk });
  T.obj([X0, s0, X1, s1], (g) => tower(g, s0, s1), { name: 'south tower', under: AZ });
  T.obj([X0, s1, X1, Y1], (g) => span(g, s1, Y1, s1, Y1), { name: 'south span', under: 0 });
  T.obj([X1 - 0.9, s1, X1, Y1], (g) => nearRail(g, s1, Y1, s1, Y1), { on: true, name: 'south chain' });

  /* ---------------- the bascules ---------------- */
  const HL = (s0 - n1) / 2, TH = 0.9, BX0 = -RX + 0.1, BX1 = RX - 0.1, NQ = 24;
  const leaf = (north) => {
    const yh = north ? n1 : s0, sg = north ? 1 : -1;
    return T.actor({ grow: false, sample: 0.25, period: LT.CYC,
      at(t) {
        const f = LT.leaf(LT.tc(t)), q = Math.round(f * NQ);
        const anchor = q === 0 ? [X0 + 0.1, Y0 + (north ? 0.1 : 0.2)] : north ? [X0 + 0.1, n1 + 0.1] : [X1 - 0.1, s1 - 0.1];
        return { x: anchor[0], y: anchor[1], z: 0, key: q, q, ax: anchor[0], ay: anchor[1] };
      },
      draw(g, st) {
        const th = (st.q / NQ) * 82 * Math.PI / 180, ox = -st.ax, oy = -st.ay;
        const d = [0, sg * Math.cos(th), Math.sin(th)], n = [0, -sg * Math.sin(th), Math.cos(th)];
        const pt = (x, s, w) => [x + ox, yh + d[1] * s - n[1] * w + oy, d[2] * s - n[2] * w];
        const topF = [pt(BX0, 0, 0), pt(BX1, 0, 0), pt(BX1, HL, 0), pt(BX0, HL, 0)];
        const botF = [pt(BX0, 0, TH), pt(BX1, 0, TH), pt(BX1, HL, TH), pt(BX0, HL, TH)];
        const sideF = [pt(BX1, 0, 0), pt(BX1, HL, 0), pt(BX1, HL, TH), pt(BX1, 0, TH)];
        const endF = [pt(BX0, HL, 0), pt(BX1, HL, 0), pt(BX1, HL, TH), pt(BX0, HL, TH)];
        const vis = (nv) => nv[1] + 0.919 * nv[2] > 0;
        if (!vis(n)) { g.fill(botF, '#6E7E8C'); const ribs = []; for (let i = 1; i < 6; i++) { const a = g.p.apply(g, pt(lerp(BX0, BX1, i / 6), 0, TH)), b = g.p.apply(g, pt(lerp(BX0, BX1, i / 6), HL, TH)); ribs.push(a[0], a[1], b[0], b[1]); } g.segs2(ribs, '#4E5E6C', 0.4); g.outline(botF, { w: 0.6, boil: false }); }
        if (vis(d)) { g.fill(endF, '#8E9AA3'); g.outline(endF, { w: 0.5, boil: false }); }
        g.fill(sideF, BLUED); g.outline(sideF, { w: 0.55, boil: false });
        if (vis(n)) {
          g.fill(topF, LK.C.asph);
          g.line([pt(0, 0.4, -0.02), pt(0, HL - 0.6, -0.02)], { c: '#F4F2EC', w: 0.9, boil: false, ext: 0 });
          g.outline(topF, { w: 0.6, boil: false });
        }
      } });
  };
  leaf(true); leaf(false);

  /* barriers and red lights at both ends (world y 27 southbound, y 73 northbound) */
  for (const [px, py, ax] of [[X1 + 0.6, -23.2, -1], [X0 - 0.6, 23.2, 1]]) T.actor({ grow: false, sample: 5, period: LT.CYC,
    at(t) { const down = LT.barrier(LT.tc(t)); return { x: px, y: py, key: down ? 1 : 0, down }; },
    draw(g, st) {
      const b = g.p(0, 0, 0), t = g.p(0, 0, 5.2);
      g.fill2([[b[0] - 0.5, b[1]], [b[0] + 0.5, b[1]], [t[0] + 0.4, t[1]], [t[0] - 0.4, t[1]]], '#3A3530');
      const L = [t[0] - 1.0, t[1] + 0.6]; g.fill2([[L[0] - 0.8, L[1] - 3.0], [L[0] + 0.8, L[1] - 3.0], [L[0] + 0.8, L[1] + 0.4], [L[0] - 0.8, L[1] + 0.4]], '#2A2622', true);
      g.disc2([L[0], L[1] - 2.2], 0.55, st.down ? '#E0503E' : '#5A544A'); if (st.down) g.mark({ nc: true, light: true });
      g.disc2([L[0], L[1] - 0.6], 0.55, st.down ? '#5A544A' : '#5FC07A'); if (!st.down) g.mark({ nc: true, light: true });
      const h = g.p(0, 0, 2.6), e = st.down ? g.p(ax * 10.6, 0, 2.6) : g.p(0, 0, 12.6);
      const segs = 8; for (let i = 0; i < segs; i++) g.line2([[lerp(h[0], e[0], i / segs), lerp(h[1], e[1], i / segs)], [lerp(h[0], e[0], (i + 1) / segs), lerp(h[1], e[1], (i + 1) / segs)]], { w: 1.0, c: i % 2 ? '#F3F1EA' : '#C8372D', boil: false, ext: 0 });
    } });
});
