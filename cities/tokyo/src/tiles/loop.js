'use strict';
/* The Yamanote loop: a red-brick arched viaduct right round the city (centre line a rounded square of half-size 152,
   corners of radius 16), carrying two tracks. Steel plate girders span the streets where they run out under it, with
   yellow-and-black clearance bars. A pale stone cornice runs under the deck, a keystone tops every arch; the parapets
   are panelled, the catenary masts carry their arms and wires over the tracks.
   Under the tracks on the outside (gado-shita, as at Yūrakuchō and Shimbashi) every arch is a little place of its own:
   yakitori grills smoking at the street with the master fanning the charcoal, izakaya and oden bars under red lanterns
   and noren, a ramen counter with its customers' backs under the curtain, a standing bar, a kissaten, a liquor shop,
   bicycles parked in one arch, a shutter with drink machines in another. Out on the pavement salarymen sit on beer crates
   round crate tables: one tells a story, the others listen, everyone laughs, and every so often they all raise their
   mugs together (kanpai). The south side's last stretch is the close-up (the 'gado' shot).
   Two silver-and-green trains run the loop in opposite directions.
   Depth: the far half (sides W and N, the top corner) is the tile 'loopFar', drawn before every place; the near half
   (sides E and S, the other three corners) is 'loopNear', drawn after every place. Each side is built in pieces with
   { under: deck } so cars pass under its girders and trains ride on top; the front parapets and the overhead wires are
   the tiles 'railFar' and 'railNear', drawn right after each half. Train cars sort normally, each standing for its depth
   on the front edge of the deck, so they are drawn on the deck, under the parapets and wires, behind whatever stands
   in front of the viaduct (the far half's places, the bridge at Odaiba). */
const YL = { R: 152, RC: 16, H: 4, deck: 9.0, gird: 7.3, tr: 1.9, pitch: 7.4 };
const YL_BRICK = { t: '#C7856A', l: '#B8664E', r: '#9F5540' }, YL_DECK = '#B9B3A6', YL_STEEL = { t: '#7E9A8E', l: '#6F8C80', r: '#5C7A6E' };

/* a point d along a rounded square of half-size r, corner radius rc (anticlockwise in plan), with its heading */
function yLoopAt(d, r, rc) {
  const side = 2 * (r - rc), q = Math.PI / 2 * rc, per = 4 * (side + q);
  d = ((d % per) + per) % per;
  const cs = [[r - rc, r - rc, 0], [-(r - rc), r - rc, Math.PI / 2], [-(r - rc), -(r - rc), Math.PI], [r - rc, -(r - rc), Math.PI * 1.5]];
  for (let i = 0; i < 4; i++) {
    const [cx, cy, a0] = cs[i], sx = cx + Math.cos(a0) * rc, sy = cy + Math.sin(a0) * rc, tx = -Math.sin(a0), ty = Math.cos(a0);
    if (d < side) { const u = d - side; return { x: sx + tx * u, y: sy + ty * u, ang: Math.atan2(ty, tx) }; }
    d -= side;
    if (d < q) { const a = a0 + d / rc; return { x: cx + Math.cos(a) * rc, y: cy + Math.sin(a) * rc, ang: a + Math.PI / 2 }; }
    d -= q;
  }
  return { x: r, y: 0, ang: Math.PI / 2 };
}
const yLoopPer = (r, rc) => 4 * (2 * (r - rc) + Math.PI / 2 * rc);

(function () {
  const R = YL.R, RC = YL.RC, H = YL.H, DZ = YL.deck, L0 = R - RC, ZB = DZ - 1.2;      // ZB: the top of the brick
  const GAPS = [[-63, -37], [37, 63]];                      // where the streets pass under
  const SECTIONS = [[-L0, -63], [-37, 37], [63, L0]];
  const SPRING = 3.8, PAVE = 10;                             // where the arches spring; the pavement in front of the near arches
  // what each arch on the near sides holds; the south side's last section (arches 21-29) is the close-up
  const GADO = { 20: 'shop', 21: 'bikes', 22: 'oden', 23: 'yakitori', 24: 'izakaya', 25: 'ramen', 26: 'tachinomi', 27: 'yakitori', 28: 'kissa', 29: 'shutter' };
  const TYPES = ['izakaya', 'yakitori', 'shop', 'ramen', 'bar', 'izakaya', 'bikes', 'oden', 'shutter', 'shokudo', 'izakaya', 'tachinomi'];
  const typeOf = (axis, i, near) => !near ? (i % 3 === 0 ? 'shop' : i % 3 === 1 ? 'shutter' : 'bar') : axis === 'x' && GADO[i] ? GADO[i] : TYPES[(i * 7 + (axis === 'y' ? 3 : 5)) % TYPES.length];
  const ramenLive = (axis, i, near) => near && ((axis === 'x' && GADO[i]) || i % 2 === 1);
  const ARCHES = (() => { const a = []; for (const [s0, s1] of SECTIONS) { const n = Math.round((s1 - s0) / YL.pitch); for (let i = 0; i < n; i++) a.push([s0 + (s1 - s0) * i / n, s0 + (s1 - s0) * (i + 1) / n]); } return a; })();
  const DRINK = ['izakaya', 'yakitori', 'oden', 'tachinomi'];
  // the signs: a board across the arch under its fanlight, the noren below it, the lanterns beside the door
  const LOOKS = {
    izakaya: [{ board: '#F6F3EA', word: '居酒屋', ink: '#B83A30', noren: '#3F5F8F', nw: '酒', lan: '酒' }, { board: '#2F3A4F', word: '酒', ink: '#F6F3EA', noren: '#5A4A3C', nw: '居酒屋', lan: '酒' }],
    yakitori: [{ board: '#C9463E', word: '焼鳥', ink: '#F6F3EA', noren: '#2F3A4F', nw: '焼鳥', lan: '焼鳥' }],
    oden: [{ board: '#E6C24F', word: 'おでん', ink: '#2A2622', noren: '#7A5A3C', nw: '酒', lan: 'おでん' }],
    ramen: [{ board: '#E6C24F', word: 'ラーメン', ink: '#B83A30', noren: '#C9463E', nw: 'ラーメン' }],
    tachinomi: [{ board: '#2F3A4F', word: 'ビール', ink: '#F6F3EA', lan: '酒' }],
    kissa: [{ board: '#5A4636', word: '喫茶', ink: '#F6F3EA' }],
    shokudo: [{ board: '#F6F3EA', word: '食堂', ink: '#2A2622', noren: '#F3F1EA', nw: '食堂', nInk: '#3F5F8F' }],
    shop: [{ board: '#3F5F8F', word: '酒', ink: '#F6F3EA' }, { board: '#F6F3EA', word: 'タバコ', ink: '#B83A30' }],
  };
  const lookOf = (type, i) => { const l = LOOKS[type]; return l ? l[i % l.length] : null; };

  /* one straight side. axis: 'y' (the side runs along y at x = c) or 'x'. Everything is laid out in (a along the side,
     w across it, +w towards the viewer: the face at w = +H is the one we see). */
  function makeSide(T, axis, c, near, rail) {
    const M = axis === 'y' ? (a, w, z) => [c + w, a, z] : (a, w, z) => [a, c + w, z];
    const face = axis === 'y' ? 'R' : 'L', plane = c + H;
    const wbox = (g, a0, w0, a1, w1, z0, z1, col, o) => { const p = M(a0, w0, 0), q = M(a1, w1, 0); K.box(g, Math.min(p[0], q[0]), Math.min(p[1], q[1]), Math.max(p[0], q[0]), Math.max(p[1], q[1]), z0, z1, col, o); };
    const masts = (A0, A1) => { const l = []; for (let a = -L0 + 6; a < L0; a += 17) if (a >= A0 && a < A1) l.push(a); return l; };
    // the side is built in pieces (half a section, or one girder) so that a view only re-bakes the pieces it sees:
    // the viaduct is a sprite (trains and cars pass behind and under it) and a single 270 u object made every bake slow
    const pieces = [];
    let k0 = 0;
    for (const [s0, s1] of SECTIONS) {
      const n = Math.round((s1 - s0) / YL.pitch), m = Math.floor(n / 2);
      pieces.push({ a0: s0, a1: ARCHES[k0 + m][0], from: k0, to: k0 + m }, { a0: ARCHES[k0 + m][0], a1: s1, from: k0 + m, to: k0 + n });
      k0 += n;
    }
    for (const [s0, s1] of GAPS) pieces.push({ a0: s0, a1: s1, girder: true });
    // the front parapet of a piece, with the overhead wires and the masts' arms and droppers over the tracks
    const railDraw = (pc) => function (g) {
      g.boilP = 0.25;
      const A0 = pc.a0, A1 = pc.a1;
      for (const tw of [-YL.tr, YL.tr]) {
        g.fine([M(A0, tw, DZ + 5.7), M(A1, tw, DZ + 5.7)], { w: 0.28, c: '#5A564E' });
        g.fine([M(A0, tw, DZ + 6.3), M(A1, tw, DZ + 6.3)], { w: 0.2, c: '#6B6458' });
      }
      const ms = [], bl = [];
      for (const a of masts(A0, A1)) {
        const t = g.p.apply(g, M(a, -H + 0.1, DZ + 7.0)), e = g.p.apply(g, M(a, H - 0.6, DZ + 6.6)), m1 = g.p.apply(g, M(a, -H + 0.1, DZ + 6.0)), m2 = g.p.apply(g, M(a, YL.tr, DZ + 5.7)), m3 = g.p.apply(g, M(a, -YL.tr, DZ + 5.7));
        ms.push(t[0], t[1], e[0], e[1], m1[0], m1[1], e[0], e[1]);
        bl.push(m2[0], m2[1] - 0.9, m2[0], m2[1], m3[0], m3[1] - 0.9, m3[0], m3[1]);
      }
      g.segs2(ms, '#6B6458', 0.55); g.segs2(bl, '#3A3530', 0.45);
      wbox(g, A0, H - 0.3, A1, H + 0.3, DZ, DZ + 0.8, { t: '#D7D2C6', l: '#E4E0D6', r: '#CFCAC0' }, { w: 0.7, boil: false });
      const pp = []; for (let a = A0 + 1.6; a < A1; a += 1.6) { const p0 = g.p.apply(g, K.pt(face, plane + 0.32, a, DZ + 0.05)), p1 = g.p.apply(g, K.pt(face, plane + 0.32, a, DZ + 0.75)); pp.push(p0[0], p0[1], p1[0], p1[1]); }
      g.segs2(pp, '#B9B3A6', 0.25);
    };
    // Each piece is two objects: the body (brick, girder, deck, rails, the masts' posts), and in front of it the front
    // parapet with the overhead wires and the masts' arms over the tracks, which go in a tile of their own drawn right
    // after the loop's half (rail = that tile: only the parapets are made). A train car stands for its depth on the
    // front edge of the deck (see the trains below): no body is then in front of it, every front parapet along it is
    // (its box runs 0.3 u past the parapet for that), and all the bodies come before all the parapets, so the car is
    // drawn on the deck under the parapet's top and the wires.
    for (const pc of pieces) {
      const fp = axis === 'y' ? [c - H - 0.3, pc.a0, c + H + 0.3, pc.a1] : [pc.a0, c - H - 0.3, pc.a1, c + H + 0.3];
      const fpF = axis === 'y' ? [c + H - 0.3, pc.a0, c + H + 0.6, pc.a1] : [pc.a0, c + H - 0.3, pc.a1, c + H + 0.6];
      if (rail) { T.obj(fpF, railDraw(pc), { name: 'viaduct parapet', under: DZ + 1 }); continue; }
      T.obj(fp, function (g) {
        g.boilP = 0.25;
        const A0 = pc.a0, A1 = pc.a1, F = (a, z, d) => g.p.apply(g, K.pt(face, plane + (d || 0.02), a, z));
        if (!pc.girder) {
          // the brick body, arches opening on the face we see
          wbox(g, A0, -H, A1, H, 0, ZB, YL_BRICK, { w: 0.9 });
          const segs = [], vs = [];
          for (let i = pc.from; i < pc.to; i++) {
            const [a0, a1] = ARCHES[i], m = (a0 + a1) / 2, hw = (a1 - a0) / 2 - 1.0, top = SPRING + hw;
            const op = [K.pt(face, plane + 0.02, m - hw, 0)]; for (let k = 0; k <= 12; k++) { const t = Math.PI * k / 12; op.push(K.pt(face, plane + 0.02, m - hw * Math.cos(t), SPRING + hw * Math.sin(t))); } op.push(K.pt(face, plane + 0.02, m + hw, 0));
            arch(g, typeOf(axis, i, near), op, m, hw, top, i);
            // the arch ring: voussoirs in two courses, a keystone
            for (let k = 1; k < 11; k++) { const t = Math.PI * k / 11, p0 = F(m - hw * Math.cos(t), SPRING + hw * Math.sin(t), 0.03), p1 = F(m - (hw + 0.75) * Math.cos(t), SPRING + (hw + 0.75) * Math.sin(t), 0.03); vs.push(p0[0], p0[1], p1[0], p1[1]); }
            const ring = []; for (let k = 0; k <= 12; k++) { const t = Math.PI * k / 12; ring.push(F(m - (hw + 0.78) * Math.cos(t), SPRING + (hw + 0.78) * Math.sin(t), 0.03)); } g.fine2(ring, { w: 0.32, c: '#8E4A38' });
            g.fill([K.pt(face, plane + 0.04, m - 0.35, top - 0.05), K.pt(face, plane + 0.04, m + 0.35, top - 0.05), K.pt(face, plane + 0.04, m + 0.45, top + 0.85), K.pt(face, plane + 0.04, m - 0.45, top + 0.85)], '#E2D6C2');
            // brick courses round the arch, a pilaster line between the arches
            for (let z = 0.5; z < ZB - 1.0; z += 0.6) for (let a = a0 + 0.15 + ((z * 5) % 2 < 1 ? 0 : 0.45); a < a1 - 0.5; a += 0.9) {
              const dx = a - m; if (Math.abs(dx) < hw + 0.8 && (z < SPRING || dx * dx + (z - SPRING) * (z - SPRING) < (hw + 0.8) * (hw + 0.8))) continue;
              const p0 = F(a, z), p1 = F(a + 0.5, z); segs.push(p0[0], p0[1], p1[0], p1[1]);
            }
            const pl = F(a1, 0.1), pu = F(a1, ZB - 1.0); vs.push(pl[0], pl[1], pu[0], pu[1]);
          }
          g.segs2(segs, '#8E4A38', 0.28); g.segs2(vs, '#86412F', 0.32);
          // the stone cornice under the deck
          wbox(g, A0, H - 0.05, A1, H + 0.25, ZB - 0.95, ZB - 0.1, { t: '#E8DECB', l: '#E2D6C2', r: '#D2C4AC' }, { w: 0.45, boil: false });
        } else {
          // a steel girder over the street, a clearance bar in yellow and black
          wbox(g, A0, -H + 0.3, A1, H - 0.3, YL.gird, DZ - 0.3, YL_STEEL, { w: 0.85 });
          const st = []; for (let a = A0 + 2; a < A1 - 1; a += 2.6) { const p0 = g.p.apply(g, K.pt(face, plane - 0.28, a, YL.gird)), p1 = g.p.apply(g, K.pt(face, plane - 0.28, a, DZ - 0.3)); st.push(p0[0], p0[1], p1[0], p1[1]); }
          g.segs2(st, '#4A6458', 0.4);
          const rv = []; for (let a = A0 + 0.7; a < A1; a += 0.65) for (const z of [YL.gird + 0.25, DZ - 0.55]) { const p = g.p.apply(g, K.pt(face, plane - 0.27, a, z)); rv.push(p[0] - 0.15, p[1], p[0] + 0.15, p[1]); }
          g.segs2(rv, '#3F5A4E', 0.4);
          for (let k = 0; k < 10; k++) { const a = lerp(A0 + 1, A1 - 1, k / 10), b = lerp(A0 + 1, A1 - 1, (k + 1) / 10); g.fill([K.pt(face, plane - 0.27, a, YL.gird), K.pt(face, plane - 0.27, b, YL.gird), K.pt(face, plane - 0.27, b, YL.gird + 0.55), K.pt(face, plane - 0.27, a, YL.gird + 0.55)], k % 2 ? '#2E2A26' : '#E6C24F'); }
        }
        // the deck slab, the back parapet, ballast, sleepers, rails, the masts' posts
        wbox(g, A0, -H - 0.3, A1, H + 0.3, DZ - 1.2, DZ, { t: YL_DECK, l: '#D7D2C6', r: '#C3BDB0' }, { w: 0.85 });
        wbox(g, A0, -H - 0.3, A1, -H + 0.3, DZ, DZ + 0.8, { t: '#D7D2C6', l: '#E4E0D6', r: '#CFCAC0' }, { w: 0.6, boil: false });
        g.fill([M(A0, -H + 0.3, DZ + 0.02), M(A1, -H + 0.3, DZ + 0.02), M(A1, H - 0.3, DZ + 0.02), M(A0, H - 0.3, DZ + 0.02)], '#A9A296');
        const sl = [];
        for (const tw of [-YL.tr, YL.tr]) {
          for (let a = Math.ceil((A0 - 0.6) / 1.25) * 1.25 + 0.6; a < A1; a += 1.25) { const p0 = g.p.apply(g, M(a, tw - 1.1, DZ + 0.05)), p1 = g.p.apply(g, M(a, tw + 1.1, DZ + 0.05)); sl.push(p0[0], p0[1], p1[0], p1[1]); }
          for (const rw of [-0.55, 0.55]) g.fine([M(A0, tw + rw, DZ + 0.12), M(A1, tw + rw, DZ + 0.12)], { w: 0.42, c: '#4A4540' });
        }
        g.segs2(sl, '#7E766A', 0.45);
        const ms = [];
        for (const a of masts(A0, A1)) { const b = g.p.apply(g, M(a, -H + 0.1, DZ + 0.8)), t = g.p.apply(g, M(a, -H + 0.1, DZ + 7.0)); ms.push(b[0], b[1], t[0], t[1]); }
        g.segs2(ms, '#6B6458', 0.55);
        g.line([M(A0, H + 0.3, DZ - 1.2), M(A1, H + 0.3, DZ - 1.2)], { w: 0.4, c: '#8C8576', boil: false });
      }, { name: pc.girder ? 'viaduct girder' : 'viaduct', under: DZ });
    }
    if (rail) return null;

    /* what is in an arch: its inside, the fanlight, the board, the noren, the lanterns, what stands in it */
    function arch(g, type, op, m, hw, top, i) {
      const P = (a, z, d) => g.p.apply(g, K.pt(face, plane + (d || 0.05), a, z));
      const Q = (a0, a1, z0, z1, d) => K.on(face, plane + (d || 0.04), a0, a1, z0, z1);
      const L = lookOf(type, i), lit = !!L || type === 'bar';
      const inside = type === 'bar' ? '#5A4636' : type === 'kissa' ? '#E9D3A6' : lit ? '#E9C48A' : type === 'bikes' ? '#4A433A' : '#AFADA6';
      g.fill(op, inside);
      if (type === 'shutter') {
        const sh = []; for (let z = 0.35; z < top - 0.1; z += 0.42) { const w = z > SPRING ? hw * Math.sqrt(Math.max(0, 1 - Math.pow((z - SPRING) / hw, 2))) : hw, p0 = P(m - w, z), p1 = P(m + w, z); sh.push(p0[0], p0[1], p1[0], p1[1]); }
        g.segs2(sh, '#8C8A84', 0.3);
        const s0 = P(m - hw, 1.0, 0.06), s1 = P(m + hw, 1.0, 0.06); g.line2([s0, s1], { w: 0.4, c: '#6B6458', boil: false });
        return;
      }
      if (type === 'bikes') {
        for (let k = 0; k < 4; k++) { const a = m - hw + 0.7 + k * 1.0, c0 = P(a, 0.85), c1 = P(a + 0.9, 0.85); g.ring2(c0, 2.2, { c: '#C9C6BD', w: 0.35 }); g.ring2(c1, 2.2, { c: '#C9C6BD', w: 0.35 }); const s = P(a + 0.3, 2.0); g.segs2([c0[0], c0[1], s[0], s[1], s[0], s[1], c1[0], c1[1]], ['#C9584B', '#5F8FC9', '#E6C24F', '#C9C6BD'][k], 0.4); }
        const lp = P(m, top - 0.4, 0.06); g.disc2(lp, 0.9, '#F2E3A6'); g.mark({ nc: true, light: true });
        return;
      }
      // the fanlight in the head of the arch, its glazing bars
      const fl = []; for (let k = 0; k <= 12; k++) { const t = Math.PI * k / 12; fl.push(K.pt(face, plane + 0.03, m - (hw - 0.15) * Math.cos(t), SPRING + 0.95 + (hw - 0.15) * Math.sin(t) * ((top - SPRING - 1.05) / hw))); }
      g.fill(fl, type === 'bar' ? '#8A5A4A' : '#F3DEB0'); g.mark({ nc: '#FFD98A' });
      const gb = []; for (let k = 1; k < 4; k++) { const t = Math.PI * k / 4, p0 = P(m, SPRING + 0.95), p1 = P(m - (hw - 0.2) * Math.cos(t), SPRING + 0.95 + (hw - 0.2) * Math.sin(t) * ((top - SPRING - 1.05) / hw)); gb.push(p0[0], p0[1], p1[0], p1[1]); }
      g.segs2(gb, '#6B4F35', 0.3);
      // inside: shelves of bottles, a counter
      const R2 = RNG(i * 31 + (axis === 'y' ? 7 : 3)), bt = [];
      for (const zs of [2.0, 2.9]) { const s0 = P(m - hw + 0.3, zs), s1 = P(m + hw - 0.3, zs); g.line2([s0, s1], { w: 0.35, c: '#8A6A3A', boil: false }); for (let a = m - hw + 0.5; a < m + hw - 0.4; a += 0.42 + R2() * 0.2) { const p = P(a, zs); bt.push([p, R2.pick(['#5E8A4A', '#8A5A3A', '#DCE3E6', '#C98A3A', '#3F5F3F', '#C9463E'])]); } }
      for (const [p, c2] of bt) g.fill2([[p[0] - 0.4, p[1]], [p[0] + 0.4, p[1]], [p[0] + 0.35, p[1] - 2.0], [p[0] - 0.35, p[1] - 2.0]], c2, true);
      g.fill(Q(m - hw, m + hw, 0, 1.4), type === 'bar' ? '#3A2E26' : '#A07C4C'); g.fill(Q(m - hw, m + hw, 1.3, 1.5, 0.05), type === 'bar' ? '#2A2220' : '#C9A26B');
      if (type === 'kissa') { const cu = P(m - 0.8, 1.55, 0.06); g.fill2([[cu[0] - 0.7, cu[1]], [cu[0] + 0.7, cu[1]], [cu[0] + 0.5, cu[1] - 1.1], [cu[0] - 0.5, cu[1] - 1.1]], '#F6F3EA', true); }
      if (type === 'bar') {
        const q = Q(m - hw * 0.8, m + hw * 0.8, SPRING + 0.1, SPRING + 0.9, 0.06); g.fill(q, '#2A2622'); g.outline(q, { w: 0.4, c: '#E7A9A0', boil: false });
        const i1 = g.cmds.length; K.text(g, face, plane + 0.08, m, SPRING + 0.25, 0.5, 'BAR', '#F2A0B8', { center: true }); g.mark({ nc: true }, i1);
        const c2 = P(m, SPRING + 0.5, 0.1); g.glow2('neon', c2, c2, { r: 4, col: '#F2A0B8' });
        return;
      }
      // the board under the fanlight, the noren below it
      if (!(type === 'ramen' && ramenLive(axis, i, near))) { board(g, m, hw, L); if (L.noren) noren(g, m, hw, L, 0); }
      // lanterns on brackets beside the door
      if (L.lan) for (const s of type === 'izakaya' ? [-1, 1] : [1]) lantern(g, P(m + s * (hw + 0.45), SPRING - 0.9, 0.9), 2.9, L.lan);
      // a string of small lanterns along the cornice over the drinking places
      if (DRINK.indexOf(type) >= 0) TK.lanternString2(g, P(m - hw - 0.9, ZB - 1.05, 0.3), P(m + hw + 0.9, ZB - 1.05, 0.3), 4, ['#D4553A', '#F3F1EA'], 2.4);
      // a menu board on the pier
      if (DRINK.indexOf(type) >= 0 || type === 'shokudo') { const a = m - hw - 0.75, q = Q(a - 0.42, a + 0.42, 1.0, 3.4, 0.06); g.fill(q, '#F6F3EA'); g.outline(q, { w: 0.3, c: '#8C8576', boil: false }); const c2 = P(a, 2.2, 0.08); TK.word2(g, c2, 1.25, ['焼鳥', 'ビール', '肉', '魚', '酒'][i % 5], '#2A2622', { vert: true, w: 0.32 }); }
    }
    function board(g, m, hw, L) { TK.sign(g, face, plane, m - hw + 0.05, m + hw - 0.05, SPRING - 0.05, SPRING + 0.95, L.board, { word: L.word, ink: L.ink }); }
    /* the noren in a doorway: three panels, a word across them; f: a stir of air */
    function noren(g, m, hw, L, f) {
      const z0 = SPRING - 1.55, z1 = SPRING - 0.05;
      TK.noren(g, face, plane, m - hw + 0.25, m + hw - 0.25, z0 + f * 0.1, z1, L.noren, { n: 3 });
      const n = [...L.nw].length, h = Math.min(0.95, (2 * hw - 0.8) / (n * 1.08));
      TK.word(g, face, plane + 0.16, face === 'L' ? m : m, (z0 + z1) / 2 + 0.05, h, L.nw, L.nInk || '#F6F3EA');
    }
    /* a red paper lantern with a word down it */
    function lantern(g, c, r, word) {
      const b = [c[0], c[1] - r - 1.6]; g.line2([b, [c[0], c[1] - r]], { w: 0.4, c: '#3A3530', boil: false });
      TK.lantern2(g, c, r, '#D4553A');
      const n = [...word].length; TK.word2(g, [c[0], c[1] + 0.1], Math.min(r * 0.8, r * 1.6 / (n * 1.08)), word, '#2A2622', { vert: true, w: 0.34 });
    }
    return { face, plane, front: (g, m, hw, L, f) => { board(g, m, hw, L); noren(g, m, hw, L, f); } };
  }

  /* one corner of the loop: the curved brick body (whichever face looks at us), the deck, rails and parapets */
  function makeCorner(T, sx, sy) {
    const cx = sx * L0, cy = sy * L0, a0 = Math.atan2(sy, sx) - Math.PI / 4, a1 = a0 + Math.PI / 2, n = 18;
    const fp = [Math.min(cx, cx + sx * (RC + H)), Math.min(cy, cy + sy * (RC + H)), Math.max(cx, cx + sx * (RC + H)), Math.max(cy, cy + sy * (RC + H))];
    T.obj(fp, function (g) {
      g.boilP = 0.25;
      const at = (r, a, z) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r, z];
      const quads = [];
      for (let k = 0; k < n; k++) {
        const s0 = lerp(a0, a1, k / n), s1 = lerp(a0, a1, (k + 1) / n), sm = (s0 + s1) / 2, out = Math.cos(sm) + Math.sin(sm) > 0, r = out ? RC + H : RC - H;
        quads.push({ q: [at(r, s0, 0), at(r, s1, 0), at(r, s1, ZB), at(r, s0, ZB)], tone: mix(YL_BRICK.l, YL_BRICK.r, clamp(0.5 + 0.5 * (out ? Math.cos(sm) - Math.sin(sm) : Math.sin(sm) - Math.cos(sm)), 0, 1)), d: at(r, sm, 0)[0] + at(r, sm, 0)[1], out, s0, s1, r });
      }
      quads.sort((p, q) => p.d - q.d);
      const segs = [];
      for (const Q of quads) {
        g.fill(Q.q, Q.tone);
        for (let z = 0.5; z < ZB - 1.0; z += 0.6) for (let t = 0.1 + ((z * 5) % 2 < 1 ? 0 : 0.5); t < 0.95; t += 0.7) { const p0 = g.p.apply(g, at(Q.r, lerp(Q.s0, Q.s1, t), z)), p1 = g.p.apply(g, at(Q.r, lerp(Q.s0, Q.s1, Math.min(1, t + 0.35)), z)); segs.push(p0[0], p0[1], p1[0], p1[1]); }
      }
      g.segs2(segs, '#8E4A38', 0.28);
      const ring = (r, z, A, B) => { const p = []; for (let k = 0; k <= n; k++) p.push(at(r, lerp(A, B, k / n), z)); return p; };
      // the cornice, then the deck: an annulus at deck height, then ballast, rails, parapets
      for (const Q of quads) if (Q.out) g.fill([at(Q.r + 0.15, Q.s0, ZB - 0.95), at(Q.r + 0.15, Q.s1, ZB - 0.95), at(Q.r + 0.15, Q.s1, ZB - 0.1), at(Q.r + 0.15, Q.s0, ZB - 0.1)], '#E2D6C2');
      const top = ring(RC + H + 0.3, DZ, a0, a1).concat(ring(RC - H - 0.3, DZ, a1, a0));
      const sideOut = ring(RC + H + 0.3, DZ - 1.2, a0, a1).concat(ring(RC + H + 0.3, DZ, a1, a0));
      g.fill(sideOut, '#C9C3B6');
      g.fill(top, YL_DECK);
      g.fill(ring(RC + H - 0.3, DZ + 0.02, a0, a1).concat(ring(RC - H + 0.3, DZ + 0.02, a1, a0)), '#A9A296');
      const sl = [];
      for (const tw of [-YL.tr, YL.tr]) { for (let k = 0; k <= 20; k++) { const a = lerp(a0, a1, k / 20), p0 = g.p.apply(g, at(RC + tw - 1.1, a, DZ + 0.05)), p1 = g.p.apply(g, at(RC + tw + 1.1, a, DZ + 0.05)); sl.push(p0[0], p0[1], p1[0], p1[1]); } }
      g.segs2(sl, '#7E766A', 0.45);
      for (const tw of [-YL.tr, YL.tr]) for (const rw of [-0.55, 0.55]) g.fine(ring(RC + tw + rw, DZ + 0.12, a0, a1), { w: 0.42, c: '#4A4540' });
      for (const r of [RC - H, RC + H]) { const pts = ring(r, DZ + 0.8, a0, a1); g.fill(ring(r, DZ, a0, a1).concat(pts.slice().reverse()), '#E4E0D6'); g.line(pts, { w: 0.6, boil: false }); }
      g.line(ring(RC + H + 0.3, DZ - 1.2, a0, a1), { w: 0.8, boil: false });
      for (const Q of quads) if (Q.out) g.line([Q.q[0], Q.q[1]], { w: 0.9, boil: false });
    }, { name: 'viaduct corner', under: DZ });
  }

  /* the far half: sides W and N and the top corner */
  SF.tile('loopFar', 0, 0, { rim: 118, castAt: 175, order: -2.5, shared: true, half: 160 }, function (T) {
    makeSide(T, 'y', -R, false); makeSide(T, 'x', -R, false); makeCorner(T, -1, -1);
  });
  /* the front parapets and overhead wires of each half, in tiles of their own drawn just after that half: every deck
     piece of a side comes before every parapet, and a train car is drawn between the two (see makeSide) */
  SF.tile('railFar', 0, 0, { rim: 118, castAt: 175, order: -2.4, shared: true, half: 160 }, function (T) {
    makeSide(T, 'y', -R, false, true); makeSide(T, 'x', -R, false, true);
  });
  SF.tile('railNear', 0, 0, { rim: 118, castAt: 175, order: 2.6, shared: true, half: 160 }, function (T) {
    makeSide(T, 'y', R, true, true); makeSide(T, 'x', R, true, true);
  });

  /* the near half: sides E and S, three corners, the pavement in front of the arches and the life on it */
  SF.tile('loopNear', 0, 0, { rim: 118, castAt: 175, order: 2.5, shared: true, half: 160 }, function (T) {
    T.ground(function (g) {
      for (const axis of ['y', 'x']) for (const [s0, s1] of SECTIONS) {
        const M = axis === 'y' ? (a, w) => [R + w, a, 0] : (a, w) => [a, R + w, 0];
        const q = [M(s0, H + 0.3), M(s1, H + 0.3), M(s1, H + PAVE), M(s0, H + PAVE)];
        g.fill(q, '#E4DFD2'); g.line([M(s0, H + PAVE), M(s1, H + PAVE)], { w: 0.6, c: '#A9A296', boil: false });
        g.fill([M(s0, H + PAVE - 0.4), M(s1, H + PAVE - 0.4), M(s1, H + PAVE), M(s0, H + PAVE)], '#D3CDBF');
        // paving joints, the yellow tactile strip, a manhole now and then
        const j = []; for (let a = s0 + 1.8; a < s1; a += 1.8) { const p = g.p.apply(g, M(a, H + 0.4)), q2 = g.p.apply(g, M(a, H + PAVE - 0.4)); j.push(p[0], p[1], q2[0], q2[1]); }
        for (const w of [H + 3.4, H + 6.4]) { const p = g.p.apply(g, M(s0, w)), q2 = g.p.apply(g, M(s1, w)); j.push(p[0], p[1], q2[0], q2[1]); }
        g.segs2(j, '#D3CDBF', 0.25);
        g.fill([M(s0, H + 7.4), M(s1, H + 7.4), M(s1, H + 8.0), M(s0, H + 8.0)], '#E9C84F');
        for (let a = s0 + 9; a < s1 - 4; a += 23) { const c = g.p.apply(g, M(a, H + 5.2)); const mh = arcPts(c[0], c[1], 2.4, 0, TAU, 14).map((p) => [p[0], c[1] + (p[1] - c[1]) * 0.55]); g.fill2(mh, '#B9B3A6'); g.line2(mh, { w: 0.3, c: '#8C8576', close: true, boil: false }); }
        g.scuff(q, { dir: axis === 'y' ? Math.atan2(AY, -AX) : Math.atan2(AY, AX), len: 5, c: '#F2EFE6', dens: 0.4, w: 0.5, spread: 0.05 });
      }
    });
    const S = makeSide(T, 'y', R, true), Sx = makeSide(T, 'x', R, true);
    makeCorner(T, 1, 1); makeCorner(T, 1, -1); makeCorner(T, -1, 1);

    // the life of the arches on both near sides
    let seed = 400;
    for (const [axis, side] of [['y', S], ['x', Sx]]) {
      const W = (a, w) => axis === 'y' ? [R + w, a] : [a, R + w];
      // facing: towards the arches (dirIn), away from them (dirOut), along the side (dirA +a, dirB -a)
      const dirIn = axis === 'y' ? 2 : 3, dirOut = axis === 'y' ? 0 : 1, dirA = axis === 'y' ? 1 : 0, dirB = axis === 'y' ? 3 : 2;
      ARCHES.forEach(([a0, a1], i) => {
        const type = typeOf(axis, i, true), m = (a0 + a1) / 2, hw = (a1 - a0) / 2 - 1.0, L = lookOf(type, i), s = seed += 7;
        const gado = axis === 'x' && GADO[i];
        if (DRINK.indexOf(type) >= 0 && (gado || i % 2 === 0)) {
          const stand = type === 'tachinomi' || (s % 5 === 0);
          const tb = W(m, H + 3.9), who = (k) => Object.assign((k % 3 === 2 ? TK.who : TK.salary)(s + k, { blush: (s + k) % 3 === 0 }), { higasa: undefined, uchiwa: undefined });
          const mem = stand
            ? [{ w: who(0), d: [0, -1.5], dir: dirOut }, { w: who(1), d: [-1.7, 0.2], dir: dirA }, { w: who(2), d: [1.7, -0.1], dir: dirB }, { w: who(3), d: [0.2, 1.6], dir: dirIn }]
            : [{ w: who(0), d: [-0.3, -1.6], dir: dirOut }, { w: who(1), d: [-1.9, 0.3], dir: dirA }, { w: who(2), d: [0.4, 1.7], dir: dirIn }].concat(gado || s % 3 ? [{ w: who(3), d: [1.9, 0], dir: dirB }] : []);
          table(T, tb, mem.map((q) => { const p = W(m + q.d[0], H + 3.9 + q.d[1]); return { who: q.w, x: p[0] - tb[0], y: p[1] - tb[1], dir: q.dir, sit: !stand }; }), { seed: s, stand, axis });
        }
        if (gado && DRINK.indexOf(type) >= 0) {
          const c0 = W(a1 - 0.2, H + 0.9); T.obj([c0[0], c0[1]], (g) => { for (let k = 0; k < 3; k++) { const x = c0[0], y = c0[1]; K.box(g, x - 0.65, y - 0.6, x + 0.65, y + 0.6, k * 1.1, k * 1.1 + 1.1, ['#E6C24F', '#C9584B', '#E6C24F'][k], { w: 0.4, boil: false }); const bt = []; for (let j = 0; j < 3; j++) { const p = g.p(x - 0.35 + j * 0.35, y, k * 1.1 + 1.1); bt.push(p[0], p[1], p[0], p[1] - 1.6); } if (k === 2) g.segs2(bt, '#6B4A2A', 0.7); } }, { name: 'crates' });
          const b0 = W(m - hw - 0.4, H + 2.2); T.obj([b0[0], b0[1]], (g) => { const f = g.p(b0[0], b0[1], 0), t = g.p(b0[0], b0[1], 3.0); const q = [[f[0] - 2.4, f[1] - 0.6], [f[0] + 2.4, f[1] + 0.6], [t[0] + 1.9, t[1] + 0.9], [t[0] - 1.9, t[1] - 0.3]]; g.fill2(q, '#2F3A4F'); g.outline2(q, { w: 0.4, c: '#1F2633', boil: false }); TK.word2(g, [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2 + 0.4], 2.0, ['ビール', '焼鳥', '酒', 'おでん'][i % 4], '#F6F3EA', { vert: true, w: 0.4 }); }, { name: 'menu board' });
        }
        if (type === 'yakitori' && (gado || i % 3 === 0)) grill(T, W(m + 0.4, H + 1.2), axis, dirOut, s);   // clear of the crate behind the table
        if (type === 'ramen' && ramenLive(axis, i, true)) ramen(T, W(m, H + 0.6), axis, side, m, hw, L, dirIn, s);
        if (type === 'shutter' && (gado || i % 2 === 0)) { const p = W(m + 1.4, H + 1.1); T.obj([p[0], p[1]], (g) => { TK.vend(g, p[0], p[1], { face: axis === 'y' ? 'R' : 'L', col: '#F1EFE8', top: '#C9463E' }); }, { name: 'vending' }); const q = W(m - 1.0, H + 1.1); T.obj([q[0], q[1]], (g) => TK.vend(g, q[0], q[1], { face: axis === 'y' ? 'R' : 'L', col: '#3F6FA8', top: '#F1EFE8' }), { name: 'vending' }); }
        // three bicycles parked along the arch one behind the other, each its own object with its own length on the ground
        if (type === 'bikes' && (gado || i % 2 === 0)) [[-0.2, 1.2], [0.3, 2.5], [-0.1, 3.8]].forEach(([da, dw], k) => {
          const q = W(m + da, H + dw), e0 = W(m + da - 3.4, H + dw - 0.5), e1 = W(m + da + 3.4, H + dw + 0.5);
          T.obj([Math.min(e0[0], e1[0]), Math.min(e0[1], e1[1]), Math.max(e0[0], e1[0]), Math.max(e0[1], e1[1])], (g) => parked(g, 0, 0, axis === 'y' ? Math.PI / 2 : 0, ['#C9584B', '#3F5F8F', '#E6C24F'][k], q), { name: 'bike' });
        });
      });
      // people going home along the pavement, a bicycle among them. The pavement stops where the streets run out under
      // the girders (cars come and go there), so each walker keeps to one stretch of it, along the kerb side and back
      // 1.2 u further out; the bicycle rides the last stretch on its own line, between them and the tables
      SECTIONS.forEach(([s0, s1], k) => K.walker(T, (k === 1 ? TK.who : TK.salary)(seed + 1 + k, k === 2 ? { blush: true } : undefined), [W(s0 + 1.5, H + 8.3), W(s1 - 1.5, H + 8.3), W(s1 - 1.5, H + 9.5), W(s0 + 1.5, H + 9.5)], 1.35, { phase: [0.1, 0.55, 0.8][k], sample: 1 }));
      cyclist(T, axis, H + 7.3, seed + 4);
    }

    /* a crate table on the pavement and the people round it: one tells a story while the others listen and sip, they
       all laugh, and now and then they raise their mugs together (kanpai); seated on crates or standing (tachinomi) */
    function table(T, at, mem, o) {
      const R0 = RNG(o.seed * 17 + 3), turns = []; let t = 0, n = 0;
      while (t < 30) {
        const j = R0.int(0, mem.length - 1), d = 2.2 + R0() * 2.8, sip = (j + 1 + R0.int(0, mem.length - 2)) % mem.length;
        turns.push(['t', j, t, d, sip]); t += d; n++;
        if (n % 4 === 3) { turns.push(['k', -1, t, 1.6, -1]); t += 1.6; turns.push(['l', -1, t, 1.2, -1]); t += 1.2; }
        else if (R0() < 0.4) { turns.push(['l', -1, t, 1.3, -1]); t += 1.3; }
      }
      const period = t, off = R0() * period;
      const SIT = { hold: [[1.6, -5.4], [2.8, -6.8]], sip: [[1.6, -5.4], [1.3, -12.1]], talk: [[[-1.2, -6.6], [3.0, -9.0]], [[0.4, -8.8], [2.8, -8.0]], [[-1.2, -6.6], [3.4, -10.2]], [[0.8, -8.2], [3.2, -8.6]]], laugh: [[[0.2, -6.4], [1.6, -6.8]], [[0.3, -6.0], [1.7, -6.3]]], kan: [[[1.6, -5.4], [2.4, -14.4]], [[1.6, -5.4], [3.7, -13.2]]] };
      const STD = { hold: [[-1.6, -9.6], [2.6, -11.4]], sip: [[-1.6, -9.6], [1.4, -17.6]], talk: TK.ACTS.talk.f ? [0, 1, 2, 3].map((i) => TK.ACTS.talk.f(i).hands) : null, laugh: [[[0.2, -10.8], [1.8, -11.2]], [[0.2, -10.5], [1.8, -10.9]]], kan: [[[-1.6, -9.6], [2.6, -20.2]], [[-1.6, -9.6], [3.8, -18.8]]] };
      const zT = o.stand ? 3.3 : 2.5, zS = 1.25, A = o.stand ? STD : SIT;
      // the moment on the table's clock: a turn of talk (who talks, who sips), the kanpai, or everyone laughing
      const now = (tt) => {
        tt = ((tt + off) % period + period) % period;
        let k = 0; while (k < turns.length - 1 && turns[k + 1][2] <= tt) k++;
        const [kind, j, t0, d, sip] = turns[k], u = tt - t0;
        if (kind === 't') return { kind, j, f: (Math.floor(u * 2.6) % 2) * 2, sp: u > d * 0.35 && u < d * 0.7 ? sip : -1 };
        return { kind, j: -1, f: kind === 'k' ? (u < 0.8 ? 0 : 1) : Math.floor(u * 5) % 2, sp: -1 };
      };
      // what person i's mug is doing: raised (kanpai), at the lips, in hand, or put down on the table (talking, laughing)
      const role = (S, i) => S.kind === 'k' ? 'up' : S.kind === 'l' || i === S.j ? 'none' : i === S.sp ? 'sip' : 'hold';
      // The table and everyone round it are separate actors on one clock, each at its own feet (one actor for the lot was
      // put in front of or behind everything round it at once): the table at its middle with the mugs put down on it,
      // each drinker on their own crate.
      T.actor({ sample: 0.5, period, r: 8,
        at(tt) { const S = now(tt), down = mem.map((q, i) => (role(S, i) === 'none' ? 1 : 0)).join(''); return { x: at[0], y: at[1], key: down, down }; },
        draw(g, st) {
          for (const z of o.stand ? [0, 1.1, 2.2] : [0, 1.25]) K.box(g, -0.7, -0.6, 0.7, 0.6, z, z + (o.stand ? 1.1 : 1.25), z ? '#E6C24F' : '#C9584B', { w: 0.4, boil: false });
          K.box(g, -1.5, -1.1, 1.5, 1.1, zT - 0.2, zT, { t: '#C9A26B', l: '#A07C4C', r: '#8A6A3A' }, { w: 0.4, boil: false });
          const pl = g.p(0.3, -0.2, zT); g.fill2([[pl[0] - 1.8, pl[1]], [pl[0], pl[1] - 0.9], [pl[0] + 1.8, pl[1]], [pl[0], pl[1] + 0.9]], '#F6F3EA', true);
          const sk = []; for (let k = 0; k < 3; k++) sk.push(pl[0] - 1.2 + k * 0.5, pl[1] + 0.3, pl[0] - 0.2 + k * 0.5, pl[1] - 0.4); g.segs2(sk, '#8A5A3A', 0.5);
          const ed = g.p(-0.8, 0.5, zT); for (let k = 0; k < 4; k++) g.disc2([ed[0] + k * 0.45, ed[1] - (k % 2) * 0.3], 0.35, '#7FAE5E');
          mem.forEach((q, i) => { if (st.down[i] === '1') { const c = g.p(q.x * 0.35, q.y * 0.35, zT); mug(g, [c[0], c[1] - 0.2], 0); } });
        } });
      mem.forEach((q, i) => T.actor({ sample: 0.5, period, r: 10,
        at(tt) { const S = now(tt), rl = role(S, i), f = S.kind === 't' ? (i === S.j ? S.f : 0) : S.f; return { x: at[0] + q.x, y: at[1] + q.y, key: S.kind + rl + f, kind: S.kind, rl, f }; },
        draw(g, st) {
          let hands, hop = 0, lean = 0;
          if (st.kind === 'k') hands = A.kan[st.f];
          else if (st.kind === 'l') { hands = A.laugh[st.f]; hop = st.f ? 0.25 : 0; lean = st.f ? 1.2 : -0.5; }
          else if (st.rl === 'none') hands = A.talk[st.f];
          else if (st.rl === 'sip') hands = A.sip;
          else hands = A.hold;
          if (q.sit) K.box(g, -0.6, -0.6, 0.6, 0.6, 0, zS, ['#3F6FA8', '#C9584B', '#E6C24F', '#5E8A4A'][i % 4], { w: 0.4, boil: false });
          const r = TK.person(g, 0, 0, (q.sit ? zS : 0) + hop, Object.assign({}, q.who, { dir: q.dir, pose: q.sit ? 'sit' : 'stand', hands, lean }));
          if (st.rl !== 'none') { const h = r.hands[0][1] < r.hands[1][1] ? r.hands[0] : r.hands[1]; mug(g, h, st.rl === 'sip' ? 0.5 : 0); }
        } }));
    }
    /* a beer mug at a hand (wide px): glass, the beer, a head of foam, a handle */
    function mug(g, h, tilt) {
      const x = h[0], y = h[1] - 0.2, sk = tilt * 0.6;
      g.fill2([[x - 0.65 + sk, y - 1.6], [x + 0.65 + sk, y - 1.6], [x + 0.6, y + 0.35], [x - 0.6, y + 0.35]], '#E9B53C', true);
      g.fill2([[x - 0.72 + sk, y - 2.15], [x + 0.72 + sk, y - 2.15], [x + 0.68 + sk, y - 1.5], [x - 0.68 + sk, y - 1.5]], '#FBF8EE', true);
      g.line2([[x + 0.65, y - 1.2], [x + 1.25, y - 1.0], [x + 1.2, y - 0.1], [x + 0.6, y]], { w: 0.3, c: '#C9A24A', boil: false });
    }
    /* a yakitori grill at the street, its master fanning the charcoal, the smoke going up and drifting off */
    function grill(T, at, axis, dirOut, s) {
      const master = Object.assign(TK.who(s + 900), { top: '#F6F3EA', bot: '#2F343B', bare: false, coat: false, jacket: undefined, muffler: undefined, higasa: undefined, uchiwa: undefined, cap: '#F6F3EA', shorts: false });
      const ux = axis === 'y' ? 0 : 1, uy = axis === 'y' ? 1 : 0, wx = axis === 'y' ? 1 : 0, wy = axis === 'y' ? 0 : 1;
      // the master stands between the arch and the grill (an actor of his own, at his own feet, 0.75 u behind it), fanning
      T.actor({ sample: 0.2, period: 4, r: 10,
        at(t) { const fan = Math.floor(t * 5) % 2; return { x: at[0] - wx * 0.75, y: at[1] - wy * 0.75, key: fan, fan }; },
        draw(g, st) {
          const fan = st.fan, r = TK.person(g, 0, 0, 0, Object.assign({}, master, { dir: dirOut, hands: fan ? [[2.4, -10.6], [3.4, -12.8]] : [[2.4, -10.6], [2.8, -10.4]] }));
          const h = r.hands[1][1] < r.hands[0][1] ? r.hands[1] : r.hands[0], fc = [h[0] + 0.8, h[1] - 1.4 - fan * 0.6];
          g.line2([h, fc], { w: 0.35, c: '#8A6A4A', boil: false }); g.disc2(fc, 1.4, '#F3F1EA'); g.ring2(fc, 1.4, { c: '#5A4636', w: 0.3 });
        } });
      T.actor({ sample: 0.2, period: 4, r: 20,
        at(t) { const f = Math.floor(t * 5) % 20; return { x: at[0], y: at[1], key: f, f }; },
        draw(g, st) {
          // the grill on its legs, the coals, the skewers
          const gx0 = -ux * 1.6, gy0 = -uy * 1.6, gx1 = ux * 1.6, gy1 = uy * 1.6;
          K.box(g, Math.min(gx0, gx1) - wx * 0.45, Math.min(gy0, gy1) - wy * 0.45, Math.max(gx0, gx1) + wx * 0.45, Math.max(gy0, gy1) + wy * 0.45, 2.0, 2.9, { t: '#3A3530', l: '#4A4540', r: '#2E2A26' }, { w: 0.45, boil: false });
          const lg = []; for (const [x, y] of [[gx0, gy0], [gx1, gy1]]) { const a = g.p(x + wx * 0.4, y + wy * 0.4, 0), b = g.p(x + wx * 0.4, y + wy * 0.4, 2.0); lg.push(a[0], a[1], b[0], b[1]); } g.segs2(lg, '#3A3530', 0.5);
          const co = []; for (let k = 0; k < 7; k++) { const p = g.p(lerp(gx0, gx1, (k + 0.5) / 7), lerp(gy0, gy1, (k + 0.5) / 7), 2.92); co.push(p); }
          for (const [k, p] of co.entries()) { g.disc2(p, 0.55, (k + st.f) % 3 ? '#E8663A' : '#F2B84A'); g.mark({ nc: true, light: true }); }
          const sk = []; for (let k = 0; k < 6; k++) { const a = g.p(lerp(gx0, gx1, (k + 0.6) / 6) - wx * 0.6, lerp(gy0, gy1, (k + 0.6) / 6) - wy * 0.6, 3.05), b = g.p(lerp(gx0, gx1, (k + 0.6) / 6) + wx * 0.7, lerp(gy0, gy1, (k + 0.6) / 6) + wy * 0.7, 3.05); sk.push(a[0], a[1], b[0], b[1]); } g.segs2(sk, '#A0714B', 0.4);
          for (let k = 0; k < 6; k++) { const p = g.p(lerp(gx0, gx1, (k + 0.6) / 6), lerp(gy0, gy1, (k + 0.6) / 6), 3.1); g.disc2(p, 0.45, '#8A4A2A'); g.disc2([p[0] + 0.7, p[1] + 0.3], 0.4, '#9A5A32'); }
          g.glow2('lantern', co[3], co[3], { r: 2.4, col: '#FF8A40' });
          // smoke: puffs rise from the coals, swell, drift away and thin out
          for (let k = 0; k < 6; k++) {
            const u = ((st.f / 20) + k / 6) % 1, base = co[(k * 3) % 7], x = base[0] + u * 16 + Math.sin(u * 7 + k) * 1.5, y = base[1] - 2 - u * 22, rr = 1.0 + u * 2.6, a = 0.5 * (1 - u);
            const al = (0.3 + a).toFixed(2); for (const [dx, dy, kr] of [[0, 0, 1], [rr * 0.7, rr * 0.2, 0.75], [-rr * 0.6, rr * 0.3, 0.7]]) g.disc2([x + dx, y + dy], rr * kr, 'rgba(240,238,232,' + al + ')');
          }
        } });
    }
    /* the ramen counter: customers on stools inside, their backs and legs under the noren, a stir in the curtain */
    function ramen(T, at, axis, side, m, hw, L, dirIn, s) {
      const ux = axis === 'y' ? 0 : 1, uy = axis === 'y' ? 1 : 0, wx = axis === 'y' ? 1 : 0, wy = axis === 'y' ? 0 : 1;
      const cus = [0, 1].map((k) => Object.assign(TK.who(s + 600 + k, { dir: dirIn }), { higasa: undefined, uchiwa: undefined }));
      T.actor({ sample: 0.25, period: 6, r: 16,
        at(t) { const f = Math.floor(t * 2) % 12; return { x: at[0], y: at[1], key: f, f }; },
        draw(g, st) {
          for (let k = 0; k < 2; k++) {
            const da = (k - 0.5) * 1.6, x = ux * da - wx * 1.25, y = uy * da - wy * 1.25, eat = (st.f + k * 3) % 4 < 2;
            K.cyl(g, x, y, 0.4, 0, 0.35, { t: '#C9463E', l: '#B8B2A6', r: '#9A948A' }, { w: 0.35, n: 8 });
            TK.person(g, x, y, 0.35, Object.assign({}, cus[k], { k: 0.78, pose: 'sit', hands: eat ? [[1.4, -9.0], [2.0, -11.4]] : [[1.4, -7.4], [2.4, -7.6]], lean: eat ? 1.4 : 0.6 }));
          }
                    g.at(-at[0], -at[1], 0, (g2) => side.front(g2, m, hw, L, st.f % 3 === 0 ? 1 : 0));
          const steam = []; for (let k = 0; k < 3; k++) { const p = g.p((k - 1) * 1.2 * ux - wx * 1.6, (k - 1) * 1.2 * uy - wy * 1.6, 4.9), u = ((st.f / 12) + k * 0.33) % 1; steam.push(p[0] - 0.6 + Math.sin(u * 6) * 0.7, p[1] - u * 5, p[0] + 0.6 + Math.sin(u * 6 + 1) * 0.7, p[1] - u * 5 - 2.4); }
          g.segs2(steam, 'rgba(250,248,240,0.75)', 0.7);
        } });
    }
    /* a bicycle on its stand (no rider), tile-local, relative to the object's anchor p */
    function parked(g, x, y, ang, col, p) {
      const ca = Math.cos(ang), sa = Math.sin(ang), pt = (u, z) => g.p(p[0] + x + u * ca, p[1] + y + u * sa, z);
      const wheel = (u) => { const t = [], h = pt(u, 1.3); for (let i = 0; i < 20; i++) { const a = TAU * i / 20; t.push(pt(u + Math.cos(a) * 1.3, 1.3 + Math.sin(a) * 1.3)); } g.line2(t, { c: '#3A3632', w: 0.6, close: true, boil: false, wob: 0.2 }); g.disc2(h, 0.25, '#3A3632'); };
      wheel(-2.0); wheel(2.0);
      const A = pt(-2.0, 1.3), B = pt(2.0, 1.3), seat = pt(-0.7, 3.3), bar = pt(1.5, 3.6), bb = pt(0, 1.35);
      g.segs2([A[0], A[1], seat[0], seat[1], seat[0], seat[1], bb[0], bb[1], bb[0], bb[1], bar[0], bar[1], bar[0], bar[1], B[0], B[1], A[0], A[1], bb[0], bb[1], seat[0], seat[1], bar[0], bar[1]], col, 0.6);
      const bk = pt(1.9, 3.2); g.fill2([[bk[0] - 0.9, bk[1]], [bk[0] + 0.9, bk[1]], [bk[0] + 0.8, bk[1] - 1.0], [bk[0] - 0.8, bk[1] - 1.0]], '#B9B6AD', true);
      const s0 = pt(-1.05, 3.4), s1 = pt(-0.35, 3.35); g.line2([s0, s1], { c: '#3A3632', w: 0.8, boil: false, ext: 0 });
    }
    /* a cyclist riding the last stretch of the pavement and back */
    function cyclist(T, axis, w, s) {
      const A0 = SECTIONS[2][0] + 4, A1 = L0 - 4, L = A1 - A0, V = 3.2, P = 2 * L / V, rider = TK.salary(s, { k: 0.9 });
      T.actor({ sample: 0.5, period: P, r: 16,
        at(t) { const d = ((t * V) % (2 * L) + 2 * L) % (2 * L), back = d > L, a = back ? A1 - (d - L) : A0 + d, ww = w; const p = axis === 'y' ? [R + ww, a] : [a, R + ww]; return { x: p[0], y: p[1], key: back ? 1 : 0, back, ext: axis === 'y' ? [0.7, 3.75] : [3.75, 0.7] }; },
        draw(g, st) { const ang = axis === 'y' ? (st.back ? -Math.PI / 2 : Math.PI / 2) : (st.back ? Math.PI : 0); K.bike(g, ang, { who: rider, col: '#C9C6BD' }); } });
    }

    /* the trains: two of seven cars, one on each track, running opposite ways at 26 u/s.
       A car is long and the viaduct is in pieces, so a car does not stand for its depth at its centre. On a straight it
       stands at its far end (the end with the smaller x or y), on the front edge of the deck (w = H + 0.3, the edge of
       the bodies' boxes): no deck piece is then in front of it (one ahead of its centre used to be, and its deck cut off
       the car's front), while every front parapet along the car is, and the places in front of the viaduct are as
       before. On a corner it stands where none of the neighbouring sides' bodies is in front of it. The drawing is moved
       back to the car's real place; the offset depends only on the drawing's key (the side and the quantised heading). */
    const V = 26, NC = 7, GAP = 9.6, HL = 4.6, HW = 1.55;
    const TRAINS = [{ r: R + YL.tr, rc: RC + YL.tr, dir: 1, d0: 905 }, { r: R - YL.tr, rc: RC - YL.tr, dir: -1, d0: 700 }];   // the outer train is over the gado close-up at t = 25 s
    TRAINS.forEach((tr, ti) => {
      const per = yLoopPer(tr.r, tr.rc), LS = tr.r - tr.rc;
      // where a car at p (heading index q) stands for its depth, and its drawing's offset back to p
      const stand = (p, q) => {
        const ax = Math.abs(p.x), ay = Math.abs(p.y);
        // (the nearer track's cars stand 0.2 u further out than the other's, so a car on it is in front of one beside it)
        if (ay <= LS + 1e-6 && ax > LS) {                       // side E or W
          const c = p.x > 0 ? R : -R, x = c + H + (p.x > c ? 0.5 : 0.3);
          return { x, y: p.y - HL, dx: p.x - x, dy: HL, side: p.x > 0 ? 'E' : 'W', ext: [0.08, HL] };
        }
        if (ax <= LS + 1e-6 && ay > LS) {                       // side S or N
          const c = p.y > 0 ? R : -R, y = c + H + (p.y > c ? 0.5 : 0.3);
          return { x: p.x - HL, y, dx: HL, dy: p.y - y, side: p.y > 0 ? 'S' : 'N', ext: [HL, 0.08] };
        }
        // a corner: the offset comes from the heading (the car's place on the arc, to 0.9 u)
        const sx = p.x > 0 ? 1 : -1, sy = p.y > 0 ? 1 : -1, th = q * TAU / 64 - tr.dir * Math.PI / 2;
        const qx = sx * L0 + Math.cos(th) * tr.rc, qy = sy * L0 + Math.sin(th) * tr.rc;
        let tx = qx, ty = qy;
        if (sx > 0 && sy < 0) tx = R + H + 1.3;                // the right corner: in front of side E's bodies
        else if (sx < 0 && sy > 0) ty = R + H + 1.3;           // the left corner: in front of side S's bodies
        else if (sx < 0 && sy < 0) { tx = Math.max(qx, -R + H + 1.3); ty = Math.max(qy, -R + H + 1.3); }   // the top corner
        return { x: p.x + tx - qx, y: p.y + ty - qy, dx: qx - tx, dy: qy - ty, side: 'c' + (sx > 0 ? 1 : 0) + (sy > 0 ? 1 : 0) };
      };
      for (let i = 0; i < NC; i++) {
        const cab = i === 0 ? 1 : i === NC - 1 ? -1 : 0, panto = (i === 2 || i === 4) ? 1.6 : 0;
        T.actor({
          sample: 0.25, period: per / V, grow: false,
          at(t) {
            const d = tr.d0 + tr.dir * (V * t - i * GAP), p = yLoopAt(d, tr.r, tr.rc), ang = tr.dir > 0 ? p.ang : p.ang + Math.PI;
            const q = (((Math.round(ang / (TAU / 64))) % 64) + 64) % 64, a = q * TAU / 64, s = stand(p, q);
            const hx = Math.abs(Math.cos(a)) * HL + Math.abs(Math.sin(a)) * HW, hy = Math.abs(Math.sin(a)) * HL + Math.abs(Math.cos(a)) * HW;
            // ext (the car's ground box for ordering it among other movers): on a straight, its length along the track
            // and a sliver across it at the stand point (so of two cars side by side the one on the nearer track goes
            // second); on a corner, a box round the stand point that holds the whole car
            return { x: s.x, y: s.y, z: DZ, key: 'q' + q + s.side, ang: a, dx: s.dx, dy: s.dy, ext: s.ext || [Math.abs(s.dx) + hx, Math.abs(s.dy) + hy] };
          },
          draw(g, st) { g.at(st.dx, st.dy, 0, (g2) => TK.trainCar(g2, st.ang, { kind: 'yamanote', cab, panto })); },
        });
      }
    });
  });

})();
