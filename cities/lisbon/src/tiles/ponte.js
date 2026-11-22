'use strict';
/* The Ponte 25 de Abril, leaving the map across the Tagus for Almada and Cristo Rei (a shared tile in the river).
   A suspension bridge in international red: a concrete anchorage on the promenade where the deck comes out of the
   city, a stiffening truss under the road (the railway hides inside it), two towers standing in the river on stone
   piers (two legs, three cross-beams), the main cables sagging from tower to tower with hangers to the deck, backstays
   down to the ends. Deck at z 13, so the fragata's mast passes under. Cars run both ways on top.
   Depth: the deck is cut into pieces of ~15 u (one object each, under: 11) so a boat half under it is right at both
   faces; each tower is two objects, the far leg behind the deck, the near leg (with the beams) in front of it.
   At night: the lights strung along the suspension cables, the white road lights on the deck's parapets, a red light
   on each tower top, all of them laid twice on the Tagus. */
SF.tile('ponte', -50, 185, { rim: 70, castAt: 150, shared: true, half: 12 }, function (T) {
  const RED = '#B8452F', REDT = { t: '#C9583F', l: '#B8452F', r: '#9A3726' }, DZ = 13, TZ = 34, Y0 = -48, Y1 = 52, TY = [-23, 23], HW = 4.4;
  // the main cable's height at y (one side): towers at TY, sag to DZ + 1 at mid-span, backstays straight to the ends
  const cab = (y) => {
    if (y <= TY[0]) return lerp(DZ + 0.5, TZ, (y - (Y0 + 4)) / (TY[0] - (Y0 + 4)));
    if (y >= TY[1]) return lerp(TZ, DZ + 0.5, (y - TY[1]) / (Y1 - TY[1]));
    const u = (y - TY[0]) / (TY[1] - TY[0]); return DZ + 1.0 + (TZ - DZ - 1.0) * Math.pow(2 * u - 1, 2);
  };
  /* the anchorage block on the promenade */
  T.obj([-6.5, -50, 6.5, -42], function (g) {
    K.box(g, -6.5, -50, 6.5, -42, 0, DZ + 0.8, { t: '#D9D3C6', l: '#E4DED2', r: '#CFC8B9' }, { w: 0.85 });
    const s = []; for (let z = 2.5; z < DZ; z += 2.6) { const a = g.p(-6.5, -42, z), b = g.p(6.5, -42, z), c = g.p(6.5, -50, z); s.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); } g.segs2(s, '#B9B2A2', 0.3);
  }, { name: 'anchorage' });
  /* deck pieces: truss, road, the cables and hangers above this stretch */
  for (let y = -42; y < Y1; y += 15) {
    const ya = y, yb = Math.min(Y1, y + 15);
    T.obj([-HW - 0.3, ya, HW + 0.3, yb], function (g) {
      g.boilP = 0.15;
      // far cable and its hangers first, then the deck, then the near ones
      const cable = (x) => { const pts = []; for (let k = 0; k <= 10; k++) { const yy = lerp(ya, yb, k / 10); pts.push([x, yy, cab(yy)]); } g.line(pts, { w: 0.75, c: '#7A2A1C', boil: false, ext: 0 }); const hs = []; for (let yy = Math.ceil(ya / 3) * 3; yy < yb; yy += 3) { if (yy > TY[0] - 1 && yy < TY[0] + 1 || yy > TY[1] - 1 && yy < TY[1] + 1) continue; const a = g.p(x, yy, DZ), b = g.p(x, yy, cab(yy)); if (cab(yy) - DZ > 0.6) hs.push(a[0], a[1], b[0], b[1]); } g.segs2(hs, '#8A3020', 0.22); };
      cable(-HW);
      K.box(g, -HW, ya, HW, yb, DZ - 2.2, DZ - 0.5, REDT, { w: 0.7, nb: false, faces: 'lr' });
      const tr = []; for (let yy = ya; yy < yb - 0.1; yy += 2.5) { const a = g.p(HW, yy, DZ - 2.2), b = g.p(HW, yy + 1.25, DZ - 0.5), c = g.p(HW, yy + 2.5, DZ - 2.2); tr.push(a[0], a[1], b[0], b[1], b[0], b[1], c[0], c[1]); } g.segs2(tr, '#7A2A1C', 0.35);
      g.fill(K.rect(-HW, ya, HW, yb, DZ - 0.5), '#8E877C');
      g.fill(K.rect(-HW + 0.2, ya, HW - 0.2, yb, DZ - 0.45), '#A39C90');
      for (const x of [-1.6, 1.6]) for (let yy = ya + 0.5; yy < yb; yy += 3) g.fine([[x, yy, DZ - 0.43], [x, Math.min(yb, yy + 1.6), DZ - 0.43]], { w: 0.3, c: '#F3F1EA' });
      K.box(g, -HW, ya, -HW + 0.3, yb, DZ - 0.5, DZ + 0.4, REDT, { w: 0.4, boil: false, faces: 'tl' });
      K.box(g, HW - 0.3, ya, HW, yb, DZ - 0.5, DZ + 0.4, REDT, { w: 0.45, boil: false });
      cable(HW);
      // night: lights along both main cables, road lights on the parapets (each reflected in the river below)
      for (const x of [-HW, HW]) for (let yy = Math.ceil(ya / 4.5) * 4.5; yy < yb; yy += 4.5) { if (Math.abs(yy - TY[0]) < 1.5 || Math.abs(yy - TY[1]) < 1.5) continue; g.glow('lantern', x, yy, cab(yy) + 0.2, { r: 0.75, col: '#FFF4DC', base: LS.wz }); }
      for (const x of [-HW + 0.15, HW - 0.15]) { const off = x > 0 ? 0 : 3; for (let yy = Math.ceil((ya - off) / 6) * 6 + off; yy < yb; yy += 6) g.glow('lantern', x, yy, DZ + 0.9, { r: 1.3, col: '#FFF0D2', base: LS.wz }); }
    }, { under: DZ - 2.2, name: 'deck' });
  }
  /* the towers: stone piers in the water, two legs, the beams */
  for (const ty of TY) {
    T.obj([-HW - 1.6, ty - 1.2, -HW - 0.2, ty + 1.2], function (g) {
      K.box(g, -HW - 2.2, ty - 2.2, -HW + 0.6, ty + 2.2, LS.wz, LS.wz + 2.4, { t: '#D9D3C6', l: '#C9C2B2', r: '#B5AE9E' }, { w: 0.6 });
      K.box(g, -HW - 1.6, ty - 0.9, -HW - 0.2, ty + 0.9, LS.wz + 2.4, TZ + 0.6, REDT, { w: 0.8 });
    }, { name: 'tower far leg' });
    T.obj([HW + 0.2, ty - 1.2, HW + 1.6, ty + 1.2], function (g) {
      K.box(g, HW - 0.6, ty - 2.2, HW + 2.2, ty + 2.2, LS.wz, LS.wz + 2.4, { t: '#D9D3C6', l: '#C9C2B2', r: '#B5AE9E' }, { w: 0.6 });
      K.box(g, HW + 0.2, ty - 0.9, HW + 1.6, ty + 0.9, LS.wz + 2.4, TZ + 0.6, REDT, { w: 0.8 });
      for (const z of [DZ + 4, DZ + 12, TZ - 1.2]) K.box(g, -HW - 1.0, ty - 0.6, HW + 1.0, ty + 0.6, z, z + 1.6, REDT, { w: 0.6 });
      K.box(g, -HW - 1.0, ty - 0.6, HW + 1.0, ty + 0.6, DZ - 3.8, DZ - 2.2, REDT, { w: 0.6 });
      // the saddles where the cables go over
      for (const x of [-HW, HW]) { const p = g.p(x, ty, TZ + 0.8); g.disc2(p, 1.1, '#7A2A1C'); }
      for (const x of [-HW - 0.9, HW + 0.9]) LX.glowDry(g, 'lantern', x, ty, TZ + 1.0, { r: 0.9, col: '#FF5A44' });   // night: the red light on each tower top
    }, { name: 'tower near leg' });
  }
  /* cars both ways on the deck (fading where the deck leaves the map) */
  for (let i = 0; i < 6; i++) {
    const dirY = i % 2 ? 1 : -1, lane = dirY > 0 ? -1.8 : 1.8, per = 15, col = ['#C9584B', '#F1EFE8', '#3F5F8F', '#7FA7CF', '#EDE4C9', '#2E2E2C'][i];
    T.actor({ cast: false, sample: 0.2, period: per, grow: false,
      at(t) { const u = (((t / per + i * 0.37) % 1) + 1) % 1, y = dirY > 0 ? lerp(Y0 + 2, Y1 + 4, u) : lerp(Y1 + 4, Y0 + 2, u), a = Math.min((y - Y0 - 2) / 6, (Y1 + 4 - y) / 6); if (a <= 0) return null; return { x: lane, y, z: DZ - 0.4, key: dirY, ang: dirY > 0 ? Math.PI / 2 : -Math.PI / 2, alpha: a < 1 ? Math.max(0.02, a) : null }; },   // (ang: the head lamps' beams at night)
      draw(g) { K.car(g, dirY > 0 ? Math.PI / 2 : -Math.PI / 2, { col, L: 4.6, W: 1.6 }); } });
  }
});
