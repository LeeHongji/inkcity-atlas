'use strict';
/* The plaza: a town hall on the far side, a fountain in the middle, trees, benches, a stall, and people about.
   Tile-local u: +x runs to the lower right of the screen, +y to the lower left, z up. The tile is 74 u across (-37..37).
   Far = small x and small y (the top of the screen): tall things go there so they never hide the square. */
SF.tile('plaza', -50, 0, { rim: 6 }, function (T) {
  const H = 37, FC = [4, 6];                                     // the fountain's centre
  const STONE = { t: '#EFE7D6', l: '#F4EDE0', r: '#DED3BE' }, ROOF = '#C9584B';

  /* ---- ground: the slab, a ring of paler stone round the fountain, a path to the street ---- */
  T.ground(function (g) {
    K.slab(g, H, { top: C.pave, cut: 'y' });           // flush with the street; the +y side is the map's cut edge
    g.fill(K.arc(FC[0], FC[1], 0, 13, 0, TAU, 40), '#E6E0D2');
    g.outline(K.arc(FC[0], FC[1], 0, 13, 0, TAU, 40), { w: 0.55, c: '#BDB4A2', boil: false });
    g.fill(K.rect(17, 2, H, 8), '#E6E0D2');
    g.scuff(K.rect(-H, -H, H, H), { dir: -0.9, len: 1.6, c: C.paveScuff, dens: 0.35, w: 0.6, spread: 1.2 });
  }, { rim: true });

  /* ---- the town hall: a long block, its door on the face that looks at the square (the plane y = -19) ---- */
  T.obj([-31, -31, -7, -19], function (g) {
    K.box(g, -31, -31, -7, -19, 0, 13, STONE, { w: 1 });
    K.box(g, -31.4, -31.4, -6.6, -18.6, 12.4, 13.2, { t: '#F6F1E6', l: '#F6F1E6', r: '#E4DAC6' }, { w: 0.8 });   // cornice
    K.gable(g, -31.6, -31.6, -6.4, -18.4, 13.2, 6, 'x', ROOF, { end: STONE.r });
    for (let i = 0; i < 5; i++) {
      const a = -29.2 + i * 4.6;
      if (i !== 2) K.win(g, 'L', -19, a, a + 2.3, 2.4, 5.8, { style: 'glass' });
      K.win(g, 'L', -19, a, a + 2.3, 7.8, 11.2, { style: 'glass', arch: true });
    }
    K.win(g, 'L', -19, -19.9, -17.1, 0, 5.6, { style: 'dark', arch: true });               // the door
    for (const z of [2.4, 7.8]) K.win(g, 'R', -7, -28.4, -26.2, z, z + 3.4, { style: 'glass' });
    K.box(g, -21.6, -19, -15.4, -17.4, 0, 0.7, K.STONE, { w: 0.6 });                       // a step
    // a clock in the gable end, which faces the lower right
    const c = g.p(-6.4, -25, 15.4); g.disc2(c, 4.6, '#FBF8F0'); g.ring2(c, 4.6, { w: 0.7 });
    g.segs2([c[0], c[1], c[0] + 0.4, c[1] - 3.2, c[0], c[1], c[0] + 2.4, c[1] + 0.8], C.ink, 0.6);
  }, { name: 'hall' });
  // a flagpole in front of the hall; the cloth is an actor so its free edge can move
  T.obj([-2, -16], (g) => K.pole(g, -2, -16, 17), { on: true });
  T.actor({ grow: false, sample: 5, at(t) { const f = Math.floor((t * 1.1 % 1) * 8); return { x: -2, y: -16, z: 16.6, key: f, ph: f / 8 }; },
    draw(g, st) {
      const o = g.p(0, 0, 0), pts = [];
      for (let i = 0; i <= 6; i++) { const u = i / 6; pts.push([o[0] + u * 13, o[1] + Math.sin(st.ph * TAU + u * 4) * 1.4 * u]); }
      for (let i = 6; i >= 0; i--) { const u = i / 6; pts.push([o[0] + u * 13, o[1] + 6.4 + Math.sin(st.ph * TAU + u * 4) * 1.4 * u]); }
      g.fill2(pts, '#5F8FC9'); g.outline2(pts, { w: 0.5, c: '#3A5A86', boil: false });
    } });

  /* ---- the fountain: a stone basin, water, a pedestal; the jets are an actor ---- */
  T.obj([FC[0] - 6, FC[1] - 6, FC[0] + 6, FC[1] + 6], function (g) {
    K.cyl(g, FC[0], FC[1], 6, 0, 1.3, STONE, { w: 0.9, n: 28 });
    const w = K.arc(FC[0], FC[1], 1.05, 5.3, 0, TAU, 28);
    g.fill(w, C.water); g.water(w, { dens: 0.7 });
    K.cyl(g, FC[0], FC[1], 1.1, 1.05, 3.4, STONE, { w: 0.7, n: 12 });
    K.cyl(g, FC[0], FC[1], 2.4, 3.4, 4.0, STONE, { w: 0.7, n: 18, top: C.waterL });
  }, { name: 'fountain' });
  T.actor({ grow: false, sample: 5, at(t) { const f = Math.floor((t * 1.6 % 1) * 8); return { x: FC[0], y: FC[1], z: 4.0, key: f, ph: f / 8 }; },
    draw(g, st) {
      const o = g.p(0, 0, 0), top = g.p(0, 0, 4.2 + 0.4 * Math.sin(st.ph * TAU));
      g.fill2([[o[0] - 0.6, o[1]], [o[0] + 0.6, o[1]], [top[0] + 0.35, top[1]], [top[0] - 0.35, top[1]]], '#F8F9F6');
      for (let i = 0; i < 6; i++) {               // arcs of water falling into the bowl and the basin
        const a = TAU * i / 6 + 0.3, pts = [];
        for (let j = 0; j <= 8; j++) { const u = j / 8, r = 0.4 + 2.6 * u, z = 4.2 - 5.4 * u * u + 1.6 * u; pts.push(g.p(Math.cos(a) * r, Math.sin(a) * r, Math.max(-2.9, z))); }
        g.line2(pts, { w: 0.55, c: '#F8F9F6', boil: false, ext: 0, wob: 0.2 });
      }
      for (let i = 0; i < 3; i++) { const r = 2.0 + ((st.ph + i / 3) % 1) * 3.0; g.line(K.arc(0, 0, -2.95, r, 0, TAU, 20), { w: 0.4, c: '#F3F7F9', close: true, boil: false }); }
    } });

  /* ---- a café on the near corner: a flat roof with its clutter (K.rooftop), a striped awning over the shopfront
     (K.awning), a sign. The small things are what make a block look lived in (drawing.md §12) ---- */
  T.obj([22, -24, 34, -14.2], function (g) {
    K.box(g, 22, -24, 34, -15, 0, 7, { t: '#EFE3CF', l: '#F4ECDD', r: '#DCCDB2' }, { w: 0.9 });
    K.win(g, 'L', -15, 23, 28.6, 0.4, 3.6, { style: 'glass' }); K.win(g, 'L', -15, 29.6, 31.6, 0, 3.6, { style: 'dark' });   // the window, the door
    for (const a of [23.4, 27, 30.6]) K.win(g, 'L', -15, a, a + 2.2, 4.4, 6.2, { style: 'glass' });
    K.win(g, 'R', 34, -22.6, -17, 0.6, 3.6, { style: 'glass' });
    K.awning(g, 'L', -15, 22.6, 33.4, 4.0, 1.4, '#C9584B', { stripe: '#F6F1E6' });
    K.sign(g, 'R', 34, -22, -17.5, 4.4, 6.0, '#2F3F63', 'CAFE');
    K.rooftop(g, 22, -24, 34, -15, 7, { seed: 3 });
  }, { name: 'cafe' });
  K.idle(T, K.who(19, { dir: 1, cup: '#F3F1EA' }), 27.5, -12.4, { acts: ['drink', 'look', 'scroll', 'drink', 'talk'] });   // coffee outside

  /* ---- trees, lamps, benches, a stall ---- */
  for (const [x, y, r] of [[-31, 6, 4.4], [-30, 24, 4.8], [-14, 31, 4.2], [28, -30, 4.6], [14, -31, 3.8]]) T.obj([x, y], (g) => K.tree(g, x, y, { r, h: 5 }), { on: true });
  for (const [x, y] of [[-18, 16], [21, 17], [20, -12]]) T.obj([x, y], (g) => K.lamp(g, x, y, { n: 3 }), { on: true });
  T.obj([-25, 5.8], (g) => K.bench(g, -25, 6, { face: 'R', L: 3 }), { on: true });
  T.obj([13.8, -16], (g) => K.bench(g, 14, -16, { face: 'L', L: 3 }), { on: true });
  T.obj([25.5, 25.5], (g) => K.stall(g, 26, 26, { face: 'L', a: '#5F8FC9', goods(g2, D, L) {
    for (let i = 0; i < 6; i++) { const p = g2.p(-D * 0.4 + (i % 2) * D * 0.8, -L * 0.7 + Math.floor(i / 2) * L * 0.7, 2.9); g2.disc2(p, 1.1, ['#E0623F', '#E6C24F', '#8FBF73'][i % 3]); g2.ring2(p, 1.1, { w: 0.35 }); }
  } }), { on: true });

  /* ---- people who stay put are never still: the life kit (engine/25_life.js) gives each a seeded run of small acts,
     and people in company answer each other. Every person is an actor of their own, at their own feet ---- */
  K.group(T, [{ who: K.who(11, { dir: 0 }), x: -2, y: 15 }, { who: K.who(12, { dir: 2 }), x: 1.5, y: 15.2 }]);   // two chatting by the fountain
  K.idle(T, K.who(13, { dir: 1, k: 0.8 }), 11, 10, { acts: ['wave', 'look', 'jump', 'point', 'wave'] });          // a child at the water
  K.idle(T, K.who(14, { dir: 0, sit: true }), -23.6, 6, { z: 1.3, acts: ['rest', 'look', 'scroll', 'eat', 'read'] });   // on the bench (seat 1.3)
  K.idle(T, K.who(15, { dir: 1 }), 26, 22.4, { acts: ['talk', 'point', 'rest', 'wave'] });                       // the seller behind the stall
  K.idle(T, K.who(16, { dir: 3, food: '#E0623F' }), 25, 31.5, { acts: ['point', 'look', 'talk', 'eat'] });       // a customer in front
  K.group(T, [{ who: K.who(17, { dir: 0 }), x: -17, y: -15 },
    { who: K.who(18, { dir: 2, top: '#2F3F63', jacket: '#F3F1EA', tie: '#7A2E2A' }), x: -14.5, y: -14.8 }]);  // on the hall steps
  K.pigeons(T, -7, 2, 5, { seed: 2 });                                                                         // pigeons on the stone ring
  K.dogWalk(T, K.who(24), [[-33, 35.4], [33, 35.4]], 1.2, '#C98A4A');                                           // a dog walk along the near edge

  /* ---- people walking: K.walker loops a route; each (direction, phase) is one cached drawing ---- */
  // routes keep clear of the fountain, the trees and the people standing about
  K.walker(T, K.who(21), [[34, 5], [15, 5], [15, -8], [-12, -8], [15, -8], [15, 5]], 2.2);
  K.walker(T, K.who(22), [[-21, 32], [-21, -12]], 1.8);
  K.walker(T, K.who(23), [[17, -30], [17, 30]], 2.0, { phase: 0.4 });
});
