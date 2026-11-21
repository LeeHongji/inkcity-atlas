'use strict';
/* The Yamanote loop: a red-brick arched viaduct right round the city (centre line a rounded square of half-size 152,
   corners of radius 16), carrying two tracks. Steel plate girders span the streets where they run out under it, with
   yellow-and-black clearance bars. In the arches on the outside: izakaya with lanterns and noren, yakitori smoke, a
   ramen counter, tiny bars, shutters, bicycles; people drink outside on beer crates. Catenary masts stand on the back
   edge. Two silver-and-green trains run the loop in opposite directions.
   Depth: the far half (sides W and N, the top corner) is the tile 'loopFar', drawn before every place; the near half
   (sides E and S, the other three corners) is 'loopNear', drawn after every place. Each side is one object with
   { under: deck } so cars pass under its girders and trains ride on top. Train cars in the near half are drawn on top
   of everything (nothing stands in front of the near loop); in the far half they sort normally behind the places. */
const YL = { R: 152, RC: 16, H: 4, deck: 7.0, gird: 5.3, tr: 1.9, pitch: 7.4 };
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
  const R = YL.R, RC = YL.RC, H = YL.H, DZ = YL.deck, L0 = R - RC;
  const GAPS = [[-63, -37], [37, 63]];                      // where the streets pass under
  const SECTIONS = [[-L0, -63], [-37, 37], [63, L0]];
  const TYPES = ['izakaya', 'izakaya', 'yakitori', 'ramen', 'bar', 'shop', 'shutter', 'izakaya', 'bikes', 'shop', 'izakaya', 'shutter'];

  /* one straight side. axis: 'y' (the side runs along y at x = c) or 'x'. Everything is laid out in (a along the side,
     w across it, +w towards the viewer: the face at w = +H is the one we see). */
  function makeSide(T, axis, c, near) {
    const M = axis === 'y' ? (a, w, z) => [c + w, a, z] : (a, w, z) => [a, c + w, z];
    const face = axis === 'y' ? 'R' : 'L', plane = c + H;
    const wbox = (g, a0, w0, a1, w1, z0, z1, col, o) => { const p = M(a0, w0, 0), q = M(a1, w1, 0); K.box(g, Math.min(p[0], q[0]), Math.min(p[1], q[1]), Math.max(p[0], q[0]), Math.max(p[1], q[1]), z0, z1, col, o); };
    // the side is built in pieces (half a section, or one girder) so that a view only re-bakes the pieces it sees:
    // the viaduct is a sprite (trains and cars pass behind and under it) and a single 270 u object made every bake slow
    const arches = [], pieces = [];
    for (const [s0, s1] of SECTIONS) {
      const n = Math.round((s1 - s0) / YL.pitch), first = arches.length, m = Math.floor(n / 2);
      for (let i = 0; i < n; i++) arches.push([s0 + (s1 - s0) * i / n, s0 + (s1 - s0) * (i + 1) / n]);
      pieces.push({ a0: s0, a1: arches[first + m][0], from: first, to: first + m }, { a0: arches[first + m][0], a1: s1, from: first + m, to: first + n });
    }
    for (const [s0, s1] of GAPS) pieces.push({ a0: s0, a1: s1, girder: true });
    for (const pc of pieces) {
      const fp = axis === 'y' ? [c - H - 0.3, pc.a0, c + H + 0.3, pc.a1] : [pc.a0, c - H - 0.3, pc.a1, c + H + 0.3];
      T.obj(fp, function (g) {
        g.boilP = 0.25;
        const A0 = pc.a0, A1 = pc.a1;
        if (!pc.girder) {
          // the brick body, arches opening on the face we see
          wbox(g, A0, -H, A1, H, 0, DZ - 1.2, YL_BRICK, { w: 0.9 });
          const segs = [];
          for (let i = pc.from; i < pc.to; i++) {
            const [a0, a1] = arches[i], m = (a0 + a1) / 2, hw = (a1 - a0) / 2 - 1.15, spring = 3.0, top = spring + hw;
            const op = [K.pt(face, plane + 0.02, m - hw, 0)]; for (let k = 0; k <= 10; k++) { const t = Math.PI * k / 10; op.push(K.pt(face, plane + 0.02, m - hw * Math.cos(t), spring + hw * Math.sin(t))); } op.push(K.pt(face, plane + 0.02, m + hw, 0));
            const type = near ? TYPES[(i * 7 + (axis === 'y' ? 3 : 5) + (c > 0 ? 0 : 2)) % TYPES.length] : (i % 3 === 0 ? 'shop' : i % 3 === 1 ? 'shutter' : 'bar');
            arch(g, type, op, m, hw, spring, top, i);
            for (let k = 1; k < 9; k++) { const t = Math.PI * k / 9, p0 = g.p.apply(g, K.pt(face, plane + 0.03, m - hw * Math.cos(t), spring + hw * Math.sin(t))), p1 = g.p.apply(g, K.pt(face, plane + 0.03, m - (hw + 0.7) * Math.cos(t), spring + (hw + 0.7) * Math.sin(t))); segs.push(p0[0], p0[1], p1[0], p1[1]); }
            for (let z = 0.55; z < DZ - 1.4; z += 0.75) for (let a = a0 + 0.2 + ((z * 4) % 2 < 1 ? 0 : 0.5); a < a1 - 0.6; a += 1.05) {
              const dx = a - m; if (Math.abs(dx) < hw + 0.75 && (z < spring || dx * dx + (z - spring) * (z - spring) < (hw + 0.75) * (hw + 0.75))) continue;
              const p0 = g.p.apply(g, K.pt(face, plane + 0.02, a, z)), p1 = g.p.apply(g, K.pt(face, plane + 0.02, a + 0.55, z)); segs.push(p0[0], p0[1], p1[0], p1[1]);
            }
          }
          g.segs2(segs, '#8E4A38', 0.32);
        } else {
          // a steel girder over the street, a clearance bar in yellow and black
          wbox(g, A0, -H + 0.3, A1, H - 0.3, YL.gird, DZ - 0.3, YL_STEEL, { w: 0.85 });
          const st = []; for (let a = A0 + 2; a < A1 - 1; a += 2.6) { const p0 = g.p.apply(g, K.pt(face, plane - 0.28, a, YL.gird)), p1 = g.p.apply(g, K.pt(face, plane - 0.28, a, DZ - 0.3)); st.push(p0[0], p0[1], p1[0], p1[1]); }
          g.segs2(st, '#4A6458', 0.4);
          for (let k = 0; k < 10; k++) { const a = lerp(A0 + 1, A1 - 1, k / 10), b = lerp(A0 + 1, A1 - 1, (k + 1) / 10); g.fill([K.pt(face, plane - 0.27, a, YL.gird), K.pt(face, plane - 0.27, b, YL.gird), K.pt(face, plane - 0.27, b, YL.gird + 0.55), K.pt(face, plane - 0.27, a, YL.gird + 0.55)], k % 2 ? '#2E2A26' : '#E6C24F'); }
        }
        // the deck slab, the back parapet, ballast, sleepers, rails, masts and wires, the front parapet
        wbox(g, A0, -H - 0.3, A1, H + 0.3, DZ - 1.2, DZ, { t: YL_DECK, l: '#D7D2C6', r: '#C3BDB0' }, { w: 0.85 });
        wbox(g, A0, -H - 0.3, A1, -H + 0.3, DZ, DZ + 0.8, { t: '#D7D2C6', l: '#E4E0D6', r: '#CFCAC0' }, { w: 0.6, boil: false });
        g.fill([M(A0, -H + 0.3, DZ + 0.02), M(A1, -H + 0.3, DZ + 0.02), M(A1, H - 0.3, DZ + 0.02), M(A0, H - 0.3, DZ + 0.02)], '#A9A296');
        const sl = [];
        for (const tw of [-YL.tr, YL.tr]) {
          for (let a = Math.ceil((A0 - 0.6) / 1.25) * 1.25 + 0.6; a < A1; a += 1.25) { const p0 = g.p.apply(g, M(a, tw - 1.1, DZ + 0.05)), p1 = g.p.apply(g, M(a, tw + 1.1, DZ + 0.05)); sl.push(p0[0], p0[1], p1[0], p1[1]); }
          for (const rw of [-0.55, 0.55]) g.fine([M(A0, tw + rw, DZ + 0.12), M(A1, tw + rw, DZ + 0.12)], { w: 0.42, c: '#4A4540' });
          g.fine([M(A0, tw, DZ + 5.7), M(A1, tw, DZ + 5.7)], { w: 0.28, c: '#5A564E' });
        }
        g.segs2(sl, '#7E766A', 0.45);
        const ms = [];
        for (let a = -L0 + 6; a < L0; a += 17) { if (a < A0 || a >= A1) continue; const b = g.p.apply(g, M(a, -H + 0.1, DZ + 0.8)), t = g.p.apply(g, M(a, -H + 0.1, DZ + 6.6)), e = g.p.apply(g, M(a, H - 1.0, DZ + 6.2)); ms.push(b[0], b[1], t[0], t[1], t[0], t[1], e[0], e[1]); }
        g.segs2(ms, '#6B6458', 0.55);
        wbox(g, A0, H - 0.3, A1, H + 0.3, DZ, DZ + 0.8, { t: '#D7D2C6', l: '#E4E0D6', r: '#CFCAC0' }, { w: 0.7, boil: false });
      }, { name: pc.girder ? 'viaduct girder' : 'viaduct', under: DZ });
    }

    /* what is in an arch: interior, then what hangs in the opening */
    function arch(g, type, op, m, hw, spring, top, i) {
      const lit = type === 'izakaya' || type === 'yakitori' || type === 'ramen' || type === 'bar' || type === 'shop';
      const inside = type === 'bar' ? '#5A4636' : lit ? '#E9C48A' : type === 'bikes' ? '#4A433A' : '#AFADA6';
      g.fill(op, inside);
      const P = (a, z, d) => g.p.apply(g, K.pt(face, plane + (d || 0.05), a, z));
      if (lit) g.fill([K.pt(face, plane + 0.03, m - hw, top - 0.2), K.pt(face, plane + 0.03, m + hw, top - 0.2), K.pt(face, plane + 0.03, m + hw, spring + hw * 0.55), K.pt(face, plane + 0.03, m - hw, spring + hw * 0.55)].map((p) => p), 'rgba(90,60,40,0.18)');
      if (type === 'shutter') {
        const sh = []; for (let z = 0.4; z < spring + hw * 0.9; z += 0.45) { const p0 = P(m - hw * (z > spring ? Math.sqrt(Math.max(0, 1 - Math.pow((z - spring) / hw, 2))) : 1), z), p1 = P(m + hw * (z > spring ? Math.sqrt(Math.max(0, 1 - Math.pow((z - spring) / hw, 2))) : 1), z); sh.push(p0[0], p0[1], p1[0], p1[1]); }
        g.segs2(sh, '#8C8A84', 0.3);
      } else if (type === 'bikes') {
        for (let k = 0; k < 3; k++) { const a = m - hw + 1.0 + k * 1.5, c = P(a, 0.9); g.ring2(c, 2.0, { c: '#C9C6BD', w: 0.4 }); g.ring2([c[0] + (face === 'R' ? 4.2 : -4.2) * 0.7, c[1] + 2.2 * 0.7], 2.0, { c: '#C9C6BD', w: 0.4 }); }
      } else {
        // a counter, bottles or goods, then the noren and the lantern
        g.fill([K.pt(face, plane + 0.04, m - hw, 0), K.pt(face, plane + 0.04, m + hw, 0), K.pt(face, plane + 0.04, m + hw, 1.5), K.pt(face, plane + 0.04, m - hw, 1.5)], type === 'bar' ? '#3A2E26' : '#A07C4C');
        if (type === 'shop') { const R2 = RNG(i * 31 + 7), dots = []; for (let k = 0; k < 9; k++) { const p = P(m - hw + 0.6 + R2() * (2 * hw - 1.2), 1.7 + R2() * 0.4); g.disc2(p, 0.8, R2.pick(['#E08A3C', '#C9584B', '#E6C24F', '#8FBF73', '#D98AA4'])); } void dots; }
        if (type === 'bar') { const s = P(m, spring + 1.0); g.fill2([[s[0] - 3, s[1] - 1.1], [s[0] + 3, s[1] - 1.1], [s[0] + 3, s[1] + 1.1], [s[0] - 3, s[1] + 1.1]], '#E7A9A0', true); }
        const ncol = type === 'ramen' ? '#C9463E' : type === 'yakitori' ? '#3F5F8F' : type === 'izakaya' ? (i % 2 ? '#3F5F8F' : '#5A4A3C') : null;
        if (ncol) TK.noren(g, face, plane, m - hw + 0.3, m + hw - 0.3, spring - 0.6, spring + hw * 0.55, ncol, { n: 3, glyph: i + 3 });
        if (type === 'izakaya' || type === 'yakitori') TK.lantern2(g, P(m + hw * 0.62, spring + 0.3, 0.6), 2.3, '#D4553A', { glyph: i + 1 });
        if (type === 'ramen') TK.sign(g, face, plane, m - hw, m + hw, top + 0.3, top + 1.5, '#E6C24F', { seed: i, n: 3 });
      }
    }
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
        quads.push({ q: [at(r, s0, 0), at(r, s1, 0), at(r, s1, DZ - 1.2), at(r, s0, DZ - 1.2)], tone: mix(YL_BRICK.l, YL_BRICK.r, clamp(0.5 + 0.5 * (out ? Math.cos(sm) - Math.sin(sm) : Math.sin(sm) - Math.cos(sm)), 0, 1)), d: at(r, sm, 0)[0] + at(r, sm, 0)[1], out, s0, s1, r });
      }
      quads.sort((p, q) => p.d - q.d);
      const segs = [];
      for (const Q of quads) {
        g.fill(Q.q, Q.tone);
        for (let z = 0.55; z < DZ - 1.4; z += 0.75) for (let t = 0.1 + ((z * 4) % 2 < 1 ? 0 : 0.5); t < 0.95; t += 0.7) { const p0 = g.p.apply(g, at(Q.r, lerp(Q.s0, Q.s1, t), z)), p1 = g.p.apply(g, at(Q.r, lerp(Q.s0, Q.s1, Math.min(1, t + 0.35)), z)); segs.push(p0[0], p0[1], p1[0], p1[1]); }
      }
      g.segs2(segs, '#8E4A38', 0.32);
      const ring = (r, z, A, B) => { const p = []; for (let k = 0; k <= n; k++) p.push(at(r, lerp(A, B, k / n), z)); return p; };
      // the deck: an annulus at deck height, then ballast, rails, parapets
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

  /* the near half: sides E and S, three corners, the pavement in front of the arches and the people on it */
  SF.tile('loopNear', 0, 0, { rim: 118, castAt: 175, order: 2.5, shared: true, half: 160 }, function (T) {
    T.ground(function (g) {
      for (const axis of ['y', 'x']) for (const [s0, s1] of SECTIONS) {
        const M = axis === 'y' ? (a, w) => [R + w, a, 0] : (a, w) => [a, R + w, 0];
        const q = [M(s0, H + 0.3), M(s1, H + 0.3), M(s1, H + 5.5), M(s0, H + 5.5)];
        g.fill(q, '#E4DFD2'); g.line([M(s0, H + 5.5), M(s1, H + 5.5)], { w: 0.55, c: '#A9A296', boil: false });
        g.scuff(q, { dir: axis === 'y' ? Math.atan2(AY, -AX) : Math.atan2(AY, AX), len: 5, c: '#F2EFE6', dens: 0.5, w: 0.5, spread: 0.05 });
      }
    });
    makeSide(T, 'y', R, true); makeSide(T, 'x', R, true);
    makeCorner(T, 1, 1); makeCorner(T, 1, -1); makeCorner(T, -1, 1);

    // people outside the izakaya: a crate table, two crate stools, a beer each
    let seed = 400;
    for (const axis of ['y', 'x']) {
      const M = axis === 'y' ? (a, w) => [R + w, a] : (a, w) => [a, R + w];
      const arches = [];
      for (const [s0, s1] of SECTIONS) { const n = Math.round((s1 - s0) / YL.pitch); for (let i = 0; i < n; i++) arches.push((s0 + (s1 - s0) * (i + 0.5) / n)); }
      arches.forEach((m, i) => {
        const type = TYPES[(i * 7 + (axis === 'y' ? 3 : 5)) % TYPES.length];
        if (type !== 'izakaya' && type !== 'yakitori') return;
        const s = seed += 3, tb = M(m, H + 2.4), p1 = M(m - 1.9, H + 2.3), p2 = M(m + 1.9, H + 2.3);
        const dirA = axis === 'y' ? 1 : 0, dirB = axis === 'y' ? 3 : 2;
        T.cast([tb[0], tb[1]], (g) => {
          const crate = (x, y, z, col) => K.box(g, x - 0.65, y - 0.65, x + 0.65, y + 0.65, z, z + 1.2, col, { w: 0.45, boil: false });
          crate(p2[0], p2[1], 0, '#5F8FC9');
          TK.person(g, p2[0], p2[1], 1.2, (s % 2 ? TK.salary : TK.who)(s + 1, { dir: dirB, pose: 'sit' }));
          crate(tb[0], tb[1], 0, '#E6C24F'); crate(tb[0], tb[1], 1.2, '#E6C24F');
          const mug = (dx, dy) => { const c = g.p(tb[0] + dx, tb[1] + dy, 2.4); g.fill2([[c[0] - 0.6, c[1]], [c[0] + 0.6, c[1]], [c[0] + 0.6, c[1] - 1.6], [c[0] - 0.6, c[1] - 1.6]], '#E9B53C', true); g.fill2([[c[0] - 0.65, c[1] - 1.5], [c[0] + 0.65, c[1] - 1.5], [c[0] + 0.6, c[1] - 2.1], [c[0] - 0.6, c[1] - 2.1]], '#FBF8EE', true); };
          mug(-0.3, -0.3); mug(0.3, 0.25);
          const pl = g.p(tb[0], tb[1], 2.42); g.fill2([[pl[0] - 1.6, pl[1] + 0.3], [pl[0] + 0.4, pl[1] + 0.9], [pl[0] + 1.6, pl[1] - 0.3], [pl[0] - 0.4, pl[1] - 0.9]], '#F3F1EA', true);
          crate(p1[0], p1[1], 0, '#C9584B');
          TK.person(g, p1[0], p1[1], 1.2, (s % 3 ? TK.salary : TK.who)(s, { dir: dirA, pose: 'sit' }));
        }, { on: true });
      });
    }

    /* the trains: two of seven cars, one on each track, running opposite ways at 26 u/s */
    const V = 26, NC = 7, GAP = 9.6;
    const TRAINS = [{ r: R + YL.tr, rc: RC + YL.tr, dir: 1, d0: 905 }, { r: R - YL.tr, rc: RC - YL.tr, dir: -1, d0: 700 }];   // the outer train is over the gado close-up at t = 25 s
    TRAINS.forEach((tr, ti) => {
      const per = yLoopPer(tr.r, tr.rc);
      for (let i = 0; i < NC; i++) {
        const cab = i === 0 ? 1 : i === NC - 1 ? -1 : 0, panto = (i === 2 || i === 4) ? 1.6 : 0;
        const state = (t) => {
          const d = tr.d0 + tr.dir * (V * t - i * GAP), p = yLoopAt(d, tr.r, tr.rc), ang = tr.dir > 0 ? p.ang : p.ang + Math.PI, q = Math.round(ang / (TAU / 64));
          return { x: p.x, y: p.y, z: DZ, key: 'q' + (((q % 64) + 64) % 64), ang: q * TAU / 64, near: p.x > 138 || p.y > 138 };
        };
        for (const nearCopy of [true, false]) {
          T.actor({
            sample: 0.25, period: per / V, grow: false, layer: nearCopy ? 'top' : '',
            at(t) { const st = state(t); return st.near === nearCopy ? st : null; },
            draw(g, st) { TK.trainCar(g, st.ang, { kind: 'yamanote', cab, panto }); },
          });
        }
      }
    });
  });

})();
