'use strict';
/* (100,100) Port Vell, at the foot of the Rambla (the Rambla's axis is this tile's y = 0).
   Built: the Plaça del Portal de la Pau on the left with the Columbus column — a stepped plinth with bronze lions and
   reliefs, the iron column, the globe and Columbus pointing out to sea — and the golondrinas' ticket kiosk at the
   quay; across the water on the far quay the Duana (the old customs house: a long stone front, corner pavilions
   with domes, winged griffins); the harbour basin, its far and left edges stone quay walls, open to the sea at +x
   (the seafront promenade stops there); the Rambla de Mar, a wavy timber footbridge across the basin along x = 12,
   whose middle span swings open; sailboats moored along the near quay; the Maremagnum's low glass front.
   Who: tourists round the column, a man with balloons, a painter, a queue for the boats, people crossing the
   footbridge (they wait while it is open), fishermen with rods on the quay edge, pigeons.
   What moves (a 48 s cycle): the footbridge swings open, a golondrina comes in from the sea through the gap and docks
   by the column, the bridge closes and people cross; later it opens again and the boat goes back out to sea. */
SF.tile('port', 100, 100, { rim: 60 }, function (T) {
  const WZ = BST.WZ, BX = 12, SW0 = -2, SW1 = 10, CYC = 48;
  const QUAY = '#E2D8C4', WATER = BP.sea;
  // the swing span's angle (0 closed along y, 1 open along x) and the boat's x, both pure functions of t
  const cyc = (t) => ((t % CYC) + CYC) % CYC;
  const openF = (tc) => tc < 3 ? smooth(tc / 3) : tc < 11 ? 1 : tc < 14 ? 1 - smooth((tc - 11) / 3) : tc < 30 ? 0 : tc < 33 ? smooth((tc - 30) / 3) : tc < 41 ? 1 : tc < 44 ? 1 - smooth((tc - 41) / 3) : 0;
  const boatX = (tc) => tc < 3 ? null : tc < 11 ? lerp(62, 0.5, smooth((tc - 3) / 8)) : tc < 33 ? 0.5 : tc < 41 ? lerp(0.5, 62, smooth((tc - 33) / 8)) : null;

  T.ground(function (g) {
    BC.ground(g, QUAY);
    g.scuff(K.rect(-37, -37, 37, 37), { dir: -0.6, len: 3, c: '#EEE7D8', dens: 0.45, w: 0.45, spread: 0.6 });
    // the basin: water below the quays, a stone wall on its far and left edges
    const bas = [[-5, -20], [37, -20], [37, 28], [-5, 28]];
    g.fill(bas.map(([x, y]) => [x, y, WZ]), WATER); g.water(bas.map(([x, y]) => [x, y, WZ]), { dens: 0.6 });
    g.fill([[-5, -20, 0], [-5, 28, 0], [-5, 28, WZ], [-5, -20, WZ]], '#BFB29A'); g.fill([[-5, -20, 0], [37, -20, 0], [37, -20, WZ], [-5, -20, WZ]], '#CDBFA4');
    g.line([[-5, 28, 0], [-5, -20, 0], [37, -20, 0]], { w: 0.75, boil: false }); g.line([[-5, 28, WZ], [-5, -20, WZ], [37, -20, WZ]], { w: 0.45, c: '#5F8F96', boil: false });
    // the near quay's edge over the water
    g.fill(K.rect(-5, 28, 37, 37), QUAY); g.line([[-5, 28, 0], [37, 28, 0]], { w: 0.75, boil: false });
    // the plaza round the column: radiating paving
    const cc = [-22, 0], seg = []; for (let i = 0; i < 24; i++) { const a = TAU * i / 24, p = g.p(cc[0] + Math.cos(a) * 7, cc[1] + Math.sin(a) * 7, 0), q = g.p(cc[0] + Math.cos(a) * 14, cc[1] + Math.sin(a) * 14, 0); seg.push(p[0], p[1], q[0], q[1]); } g.segs2(seg, '#D3C7AE', 0.3);
    const rr = []; for (let i = 0; i <= 32; i++) { const a = TAU * i / 32; rr.push([cc[0] + Math.cos(a) * 14, cc[1] + Math.sin(a) * 14, 0]); } g.line(rr, { w: 0.4, c: '#C2B494', boil: false });
    // bollards along the quay edges
    const bol = []; for (let y = -18; y < 27; y += 4) bol.push(g.p(-5.6, y, 0)); for (let x = -3; x < 37; x += 4.5) bol.push(g.p(x, -20.6, 0));
    for (const p of bol) { g.fill2([[p[0] - 0.7, p[1]], [p[0] + 0.7, p[1]], [p[0] + 0.6, p[1] - 2.0], [p[0] - 0.6, p[1] - 2.0]], '#4A4540', true); }
  }, { rim: true });

  /* ---- the Duana on the far quay ---- */
  T.obj([-2, -37, 30, -24], function (g) {
    g.boilP = 0.2;
    const ST = { t: '#F0E4CC', l: '#E9D7B4', r: '#D3BF98' }, y1 = -24;
    K.box(g, -2, -37, 30, y1, 0, 11, ST, { w: 0.9 });
    for (let x = 0; x < 29; x += 2.6) { K.win(g, 'L', y1, x, x + 1.3, 1.2, 4.0, { style: 'navy', arch: true }); K.win(g, 'L', y1, x, x + 1.3, 6.0, 9.0, { style: 'navy' }); }
    K.box(g, -2.3, -37.3, 30.3, y1 + 0.3, 11, 11.6, ST, { w: 0.6, nohid: true });
    for (const x of [1.5, 26.5]) {
      K.box(g, x - 3, -36, x + 3, y1 + 0.6, 0, 14, ST, { w: 0.85, nohid: true });
      K.dome(g, x, -30, 3.0, 14, 3.6, '#9DB0A8', { w: 0.7, shadow: '#7F948C' });
      const t = g.p(x, -30, 17.6); g.fill2([[t[0] - 2.8, t[1] - 1], [t[0], t[1] - 4], [t[0] + 2.8, t[1] - 1], [t[0] + 0.8, t[1]], [t[0] - 0.8, t[1]]], '#5E6A62', true);   // a winged griffin
    }
    K.text(g, 'L', y1 + 0.65, 14, 11.9, 1.0, 'PORT DE BARCELONA', '#7A5A2C', { center: true });
  }, { name: 'duana' });
  for (let x = -1; x <= 35; x += 6) T.obj([x, -22.2], (g) => K.palm(g, x, -22.2, { h: 12, r: 4.4, lean: (h1(x * 7) - 0.5) * 0.6 }), { name: 'palm' });

  /* ---- the Columbus column ---- */
  T.obj([-28, -6, -16, 6], function (g) {
    g.boilP = 0.18;
    const cx = -22, cy = 0, BR = { t: '#5E5A4E', l: '#6E6A5C', r: '#4E4A40' }, ST = { t: '#E9DFC9', l: '#E2D6BC', r: '#CABB9C' };
    // steps, the plinth with its bronze reliefs and the four lions
    for (let i = 0; i < 3; i++) K.box(g, cx - 6 + i * 0.8, cy - 6 + i * 0.8, cx + 6 - i * 0.8, cy + 6 - i * 0.8, i * 0.5, i * 0.5 + 0.5, ST, { w: 0.55, nohid: true });
    K.box(g, cx - 3.6, cy - 3.6, cx + 3.6, cy + 3.6, 1.5, 9, ST, { w: 0.8, nohid: true });
    for (const [f, p, a0] of [['L', cy + 3.6, cx - 2.6], ['R', cx + 3.6, cy - 2.6]]) g.fill(K.on(f, p + 0.03, a0, a0 + 5.2, 3, 7), '#6E6A5C');
    for (const [x, y] of [[cx - 4.6, cy + 4.6], [cx + 4.6, cy + 4.6], [cx + 4.6, cy - 4.6]]) { const p = g.p(x, y, 1.5); g.fill2(K.curve([[p[0] - 2.6, p[1]], [p[0] - 2.4, p[1] - 2.4], [p[0] - 0.6, p[1] - 3.4], [p[0] + 1.4, p[1] - 4.8], [p[0] + 2.4, p[1] - 3.6], [p[0] + 2.2, p[1]]], 3, true), '#4A463C', true); g.disc2([p[0] + 1.6, p[1] - 4.6], 1.2, '#5A564A'); }
    K.box(g, cx - 2.6, cy - 2.6, cx + 2.6, cy + 2.6, 9, 11, ST, { w: 0.7, nohid: true });
    // the iron column, fluted, its capital, the globe and Columbus
    K.cyl(g, cx, cy, 1.25, 11, 36, BR, { w: 0.7, n: 12 });
    const fl = []; for (let i = 0; i < 4; i++) { const a = Math.PI * (0.3 + i * 0.12), b = g.p(cx + Math.cos(a) * 1.26, cy + Math.sin(a) * 1.26, 11.5), t = g.p(cx + Math.cos(a) * 1.26, cy + Math.sin(a) * 1.26, 35.5); fl.push(b[0], b[1], t[0], t[1]); } g.segs2(fl, '#3E3A32', 0.3);
    K.cyl(g, cx, cy, 1.9, 36, 37.4, { t: '#C9A86A', l: '#B8955A', r: '#957644' }, { w: 0.6, n: 12 });
    const gl = g.p(cx, cy, 38.6); g.disc2(gl, 1.6 * SX * 0.62, '#B8955A'); g.ring2(gl, 1.6 * SX * 0.62, { w: 0.45, c: '#5E4A2A' }); g.segs2([gl[0] - 4, gl[1], gl[0] + 4, gl[1]], '#7A5E34', 0.3);
    const st = g.p(cx, cy, 39.8);
    const body = [[st[0] - 1.6, st[1]], [st[0] + 1.6, st[1]], [st[0] + 1.3, st[1] - 14], [st[0] - 1.3, st[1] - 14]];
    g.fill2(body, '#4E4A40', true); g.disc2([st[0], st[1] - 15.4], 1.5, '#4E4A40');
    g.line2([[st[0] + 1.0, st[1] - 12.4], [st[0] + 6.6, st[1] - 10.2]], { w: 1.1, c: '#4E4A40', boil: false, ext: 0 });   // the arm pointing out to sea
    g.fill2([[st[0] - 1.6, st[1]], [st[0] - 2.6, st[1] - 9], [st[0] - 1.3, st[1] - 13]], '#3E3A32', true);   // the cloak
  }, { name: 'columbus' });

  /* ---- the Rambla de Mar: the fixed spans (the swing span is an actor) ---- */
  const deck = (y0, y1) => { const P = []; const n = Math.max(2, Math.round((y1 - y0) / 1.2)); for (let i = 0; i <= n; i++) { const y = lerp(y0, y1, i / n); P.push([BX - 2.2 - Math.sin(y * 0.45) * 1.0, y]); } for (let i = n; i >= 0; i--) { const y = lerp(y0, y1, i / n); P.push([BX + 2.2 - Math.sin(y * 0.45) * 1.0, y]); } return P; };
  const drawDeck = (g, P) => {
    const n = P.length / 2;
    const top = P.map(([x, y]) => [x, y, 0.5]); g.fill(top, '#C9A57A');
    const pl = []; for (let i = 0; i < n; i++) { const a = g.p(P[i][0], P[i][1], 0.5), b = g.p(P[P.length - 1 - i][0], P[P.length - 1 - i][1], 0.5); pl.push(a[0], a[1], b[0], b[1]); } g.segs2(pl, '#A8865A', 0.25);
    const ed = P.slice(n); g.fill(ed.map(([x, y]) => [x, y, 0.5]).concat(ed.slice().reverse().map(([x, y]) => [x, y, -0.3])), '#8E6E48');
    g.line(P.slice(0, n).map(([x, y]) => [x, y, 1.6]), { w: 0.45, c: '#6E6A60', boil: false }); g.line(ed.map(([x, y]) => [x, y, 1.6]), { w: 0.45, c: '#6E6A60', boil: false });
    g.line(ed.map(([x, y]) => [x, y, 0.5]), { w: 0.6, boil: false });
  };
  T.obj([BX - 3.4, -20, BX + 3.4, SW0], (g) => drawDeck(g, deck(-20, SW0)), { name: 'rambla de mar north', under: 0.4 });
  T.obj([BX - 3.4, SW1, BX + 3.4, 28], (g) => drawDeck(g, deck(SW1, 28)), { name: 'rambla de mar south', under: 0.4 });
  // the swing span: rotates about its far end from along y (closed) to along x (open); anchored at its free end,
  // drawn early (bias) so walkers on it and the boat beside it come after it
  const SPAN = SW1 - SW0;
  T.actor({ sample: 0.3, period: CYC, grow: false, bias: -20,
    at(t) { const q = Math.round(openF(cyc(t)) * 16), th = q / 16 * Math.PI / 2; return { x: BX + SPAN * Math.sin(th), y: SW0 + SPAN * Math.cos(th), key: q, th }; },
    draw(g, st) {
      const c = Math.cos(st.th), s2 = Math.sin(st.th), ex = BX + SPAN * s2, ey = SW0 + SPAN * c;
      const W = (u, v) => [BX + u * c + v * s2 - ex, SW0 - u * s2 + v * c - ey];
      const P = []; const n = 10;
      for (let i = 0; i <= n; i++) { const v = SPAN * i / n, w = Math.sin((SW0 + v) * 0.45) * 1.0; P.push(W(-2.2 - w, v)); }
      for (let i = n; i >= 0; i--) { const v = SPAN * i / n, w = Math.sin((SW0 + v) * 0.45) * 1.0; P.push(W(2.2 - w, v)); }
      drawDeck(g, P);
      const pv = W(0, 0), piv = g.p(pv[0], pv[1], 0.5); g.disc2(piv, 1.2, '#6E6A60');
    } });

  /* ---- the near quay: the Maremagnum's glass front, moored sailboats ---- */
  T.obj([8, 30, 34, 36.5], function (g) { K.box(g, 8, 30, 34, 36.5, 0, 6.5, { t: '#D9DEE0', l: '#BFD3DC', r: '#A8BECB' }, { w: 0.8 }); const gr = []; for (let x = 10; x < 34; x += 2) { const a = g.p(x, 30, 0), b = g.p(x, 30, 6.5); gr.push(a[0], a[1], b[0], b[1]); } g.segs2(gr, '#8EA7B6', 0.3); g.fill([[7, 29, 6.5], [35, 29, 6.5], [35, 37, 6.5], [7, 37, 6.5]], '#C9392E'); g.outline([[7, 29, 6.5], [35, 29, 6.5], [35, 37, 6.5], [7, 37, 6.5]], { w: 0.6, boil: false }); K.text(g, 'R', 34.05, 33.2, 2.4, 1.0, 'MAREMAGNUM', '#3F5F8F', { center: true }); }, { name: 'maremagnum' });
  for (let i = 0; i < 4; i++) { const x = 18 + i * 4.6, y = 24.5; T.cast([x - 1.6, y - 4, x + 1.6, y + 1], (g) => g.at(x, y, WZ, (g2) => K.boat(g2, -Math.PI / 2, { kind: 'sail', L: 3.6, W: 1.3, hull: ['#F3F1EA', '#2F4A63', '#F3F1EA', '#8E3A36'][i], mast: 9 + i % 2 })), { name: 'moored' }); }

  /* ---- people ---- */
  // round the column: tourists, a balloon seller, a painter
  for (const [x, y, s, d] of [[-14.5, 6, 6100, 2], [-15.6, 7.4, 6101, 3], [-30, 7, 6102, 3], [-12.4, -4, 6103, 2]]) T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(s, { dir: d, pose: s === 6101 ? 'hold' : 'stand', phone: s === 6101 })), {});
  T.cast([-31, -7], (g) => { const r = BC.person(g, -31, -7, 0, BC.who(6110, { dir: 0, pose: 'stand', hands: [[2, -17], [1, -10]] })); const h = r.hands[0]; const cols = ['#C9392E', '#E6C24F', '#4F8FBF', '#7DBF9A', '#D98AA4']; cols.forEach((c, i) => { const b = [h[0] - 4 + i * 2, h[1] - 14 - (i % 2) * 3]; g.segs2([h[0], h[1], b[0], b[1] + 2], '#6E6A60', 0.2); g.disc2(b, 2.0, c); }); }, {});
  // the golondrinas' kiosk and its queue at the quay
  T.obj([-10, 7, -7, 10], (g) => { K.box(g, -10, 7, -7, 10, 0, 4.5, { t: '#2F6A8C', l: '#F1EFE8', r: '#D9D5CA' }, { w: 0.6 }); K.box(g, -10.4, 6.6, -6.6, 10.4, 4.5, 5.1, { t: '#2F6A8C', l: '#3F7A9C', r: '#2F5A7C' }, { w: 0.5, nohid: true }); K.sign(g, 'L', 10, -9.8, -7.2, 3.0, 4.2, '#2F6A8C', 'GOLONDRINES', { line: false }); }, { name: 'kiosk' });
  for (let i = 0; i < 6; i++) { const x = -9 + (i % 2) * 0.6, y = 11.5 + i * 1.5; T.cast([x, y], (g) => BC.person(g, x, y, 0, BC.who(6120 + i, { dir: 3, pose: 'stand' })), {}); }
  // fishermen on the far quay edge
  for (const [x, s] of [[4, 6130], [24, 6131]]) T.cast([x, -21.2], (g) => { const r = BC.person(g, x, -21.2, 0, BC.who(s, { dir: 1, pose: 'stand', hands: [[3, -11], [2, -9.5]], cap: '#3F5F8F' })); const h = r.hands[0]; g.line2([h, [h[0] - 9, h[1] + 9]], { w: 0.4, c: '#5A4A3C', boil: false, ext: 0 }); g.segs2([h[0] - 9, h[1] + 9, h[0] - 9.6, h[1] + 16], '#9A9488', 0.15); }, {});
  // walkers crossing the footbridge: they wait at its ends while the span is open
  for (let i = 0; i < 4; i++) {
    const look = BC.who(6140 + i), dir = i % 2 ? 1 : -1, speed = 1.3, L = 46, off = i * 11;
    T.actor({ sample: 0.3, period: CYC,
      at(t) {
        const tc = cyc(t), open = openF(tc) > 0.02;
        let s = ((t * speed + off) % L + L) % L;                                 // distance along the bridge
        let y = dir > 0 ? -18 + s : 26 - s;
        if (y > -18 && y < 26) { const inGap = (y > SW0 - 3 && y < SW1 + 3); if (open && inGap) y = dir > 0 ? SW0 - 3 : SW1 + 3; }
        if (y <= -18.5 || y >= 26.5) return null;
        const x = BX - Math.sin(y * 0.45) * 1.0 + (i % 2 ? 0.8 : -0.8), ph = Math.floor((s / 2.4) % 1 * 8), wait = open && (y === SW0 - 3 || y === SW1 + 3);
        return { x, y, z: 0.5, key: (wait ? 's' : 'w' + ph) + (dir > 0 ? 1 : 3), dir: dir > 0 ? 1 : 3, ph: ph / 8, wait };
      },
      draw(g, st) { BC.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.wait ? 'stand' : 'walk', ph: st.ph })); } });
  }
  // the golondrina: in from the sea through the open span, docks at the column's quay, back out later
  T.actor({ sample: 0.25, period: CYC, grow: false,
    at(t) { const tc = cyc(t), x = boatX(tc); if (x == null) return null; const out = tc >= 22; const a = Math.min(1, (64 - x) / 8); return { x: x + 7, y: 4, z: WZ, key: out ? 'o' : 'i', out, alpha: a < 1 ? a : null }; },
    draw(g, st) { g.at(-7, 0, 0, (g2) => BC.golondrina(g2, st.out ? 0 : Math.PI, 7)); } });
  // pigeons on the plaza
  for (let i = 0; i < 5; i++) { const x = -18 + (i % 3) * 1.3, y = 9 + Math.floor(i / 3) * 1.1; T.actor({ sample: 5, period: 2, at(t) { const f = Math.floor(t * 2 + i) % 2; return { x, y, key: f, f }; }, draw(g, st) { const c = g.p(0, 0, 0); g.fill2([[c[0] - 1.2, c[1] - 0.6], [c[0] + 0.8, c[1] - 1.0], [c[0] + 1.2, c[1] - 0.2], [c[0] - 0.8, c[1]]], '#9AA0A8', true); g.disc2([c[0] + (st.f ? 1.4 : 1.2), c[1] - (st.f ? 0.4 : 1.2)], 0.5, '#7A808A'); } }); }

  BC.block(T, { corners: { nn: 'bins', np: 'motos' }, noTrees: ['x+'] });
});
