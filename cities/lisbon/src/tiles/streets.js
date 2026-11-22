'use strict';
/* Lisbon's streets, the riverside and the Tagus (one map-wide tile).
   Four streets between the places, each grey basalt setts between white calçada pavements with a black border line;
   tram 28's double track runs along the ones it uses (the trams' poles reach for a wire left undrawn out here: posts
   along the streets became sprites that dragged half the map into the sprite layer). Zebra crossings at the junctions.
   Along the south edge the riverside promenade (Ribeira das Naus): pale limestone, lamps, benches, people strolling,
   fishermen at the edge; then the stone quay wall and the river at z -3, cut like a diorama along the map's near edges.
   On the water: two orange cacilheiros shuttle to their pier, a fragata with an ochre sail and a white yacht run
   along the river (under the bridge, which is its own tile). Traffic: LXT (src/37_traffic.js). */
const LS = { in: 37, out: 63, end: 152, quay: 137, edge: 146, wz: -3, riv: 222, rx: 176, rd: 10 };

SF.tile('streets', 0, 0, { order: -99 }, function (T) {
  const S = LS, ASPH = LC.setts;
  const DX = Math.atan2(AY, AX), DY = Math.atan2(AY, -AX);
  T.ground(function (g) {
    g.boilP = 0.12;
    /* the river: water, its crests, the quay wall above it, the cut sections at the map's near edges */
    const W = [[-S.rx, S.edge, S.wz], [S.rx, S.edge, S.wz], [S.rx, S.riv, S.wz], [-S.rx, S.riv, S.wz]];
    g.fill(W, LC.water); g.mark({ nc: (c) => mix(nightColour(c), '#142036', 0.5) });   // at night: dark, for the lights laid on it
    for (let k = 0; k < 6; k++) { const y0 = S.edge + 4 + k * 12; g.water([[-S.rx, y0, S.wz], [S.rx, y0, S.wz], [S.rx, y0 + 10, S.wz], [-S.rx, y0 + 10, S.wz]], { dens: 0.5 }); }
    g.fill([[-S.rx, S.riv, S.wz], [S.rx, S.riv, S.wz], [S.rx, S.riv, S.wz - 2.2], [-S.rx, S.riv, S.wz - 2.2]], '#5E8F98');
    g.fill([[S.rx, S.edge, S.wz], [S.rx, S.riv, S.wz], [S.rx, S.riv, S.wz - 2.2], [S.rx, S.edge, S.wz - 2.2]], '#4E7F88');
    g.fill([[S.rx, S.edge, 0], [S.rx, S.edge, S.wz - 2.2], [S.rx, S.edge - 0.01, S.wz - 2.2]], '#4E7F88');
    g.line([[-S.rx, S.riv, S.wz], [S.rx, S.riv, S.wz], [S.rx, S.edge, S.wz]], { w: 0.9, c: '#3E6A72', boil: false });
    g.line([[-S.rx, S.riv, S.wz - 2.2], [S.rx, S.riv, S.wz - 2.2], [S.rx, S.edge, S.wz - 2.2]], { w: 0.9, boil: false });
    g.line([[S.rx, S.riv, S.wz], [S.rx, S.riv, S.wz - 2.2]], { w: 0.7, boil: false });
    // the quay wall's face (it looks at us, above the water) and its cut end
    g.fill([[-S.end, S.edge, 0], [S.end, S.edge, 0], [S.end, S.edge, S.wz], [-S.end, S.edge, S.wz]], LC.wall);
    const js = []; for (let x = -S.end + 2; x < S.end; x += 3.4) { const a = g.p(x, S.edge, 0), b = g.p(x, S.edge, S.wz); js.push(a[0], a[1], b[0], b[1]); }
    for (const z of [-1, -2]) { const a = g.p(-S.end, S.edge, z), b = g.p(S.end, S.edge, z); js.push(a[0], a[1], b[0], b[1]); }
    g.segs2(js, '#B5A585', 0.3);
    g.fill([[-S.end, S.edge, S.wz], [S.end, S.edge, S.wz], [S.end, S.edge, S.wz + 0.5], [-S.end, S.edge, S.wz + 0.5]], '#7FA39E');   // the wet line
    g.line([[-S.end, S.edge, 0], [S.end, S.edge, 0]], { w: 0.9, boil: false }); g.line([[-S.end, S.edge, S.wz], [S.end, S.edge, S.wz]], { w: 0.6, c: '#3E6A72', boil: false });
    g.fill([[S.end, S.quay, 0], [S.end, S.edge, 0], [S.end, S.edge, S.wz], [S.end, S.quay, -1.1]], C.slabD);
    // the promenade: limestone flags with a granite kerb at the water
    g.fill(K.rect(-S.end, S.quay, S.end, S.edge), '#ECE6D6');
    const fl = []; for (let x = -S.end + 3; x < S.end; x += 6) { const a = g.p(x, S.quay, 0), b = g.p(x, S.edge, 0); fl.push(a[0], a[1], b[0], b[1]); }
    for (const y of [S.quay + 3, S.quay + 6]) { const a = g.p(-S.end, y, 0), b = g.p(S.end, y, 0); fl.push(a[0], a[1], b[0], b[1]); }
    g.segs2(fl, '#D6CDB8', 0.3);
    g.fill(K.rect(-S.end, S.edge - 1.2, S.end, S.edge, 0.01), '#C9C1B0');
    g.line([[-S.end, S.quay, 0], [S.end, S.quay, 0]], { w: 0.5, c: '#B9AE96', boil: false });

    /* the streets: pavements first, then the setts over them, so every junction is roadway */
    const strips = [];
    for (const c of [-50, 50]) { strips.push(['x', c, -S.end, S.end]); strips.push(['y', c, -S.end, S.quay]); }
    const R = (ax, c, a0, a1, w) => (ax === 'x' ? K.rect(a0, c - w, a1, c + w) : K.rect(c - w, a0, c + w, a1));
    for (const [ax, c, a0, a1] of strips) LX.pave(g, ax === 'x' ? a0 : c - 13, ax === 'x' ? c - 13 : a0, ax === 'x' ? a1 : c + 13, ax === 'x' ? c + 13 : a1, { edge: ax === 'x' ? 'ns' : 'we' });
    for (const [ax, c, a0, a1] of strips) {
      const q = R(ax, c, a0, a1, 10); g.fill(q, ASPH);
      g.scuff(q, { dir: ax === 'x' ? DX : DY, len: 1.0, c: LC.settsD, dens: 1.1, w: 0.4, spread: 1.2 });
      g.scuff(q, { dir: ax === 'x' ? DY : DX, len: 0.8, c: '#CFCBC1', dens: 0.6, w: 0.35, spread: 1.2 });
      for (const s of [-10, 10]) g.line(ax === 'x' ? [[a0, c + s, 0], [a1, c + s, 0]] : [[c + s, a0, 0], [c + s, a1, 0]], { w: 0.5, c: '#A39C8E', boil: false });
    }
    // the cut ends of the streets at the map's edges: a section on the visible ones, a dry stroke on the far ones
    for (const c of [-50, 50]) {
      g.fill([[S.end, c - 13, 0], [S.end, c + 13, 0], [S.end, c + 13, -1.1], [S.end, c - 13, -1.1]], C.slabD); g.line([[S.end, c - 13, 0], [S.end, c - 13, -1.1], [S.end, c + 13, -1.1], [S.end, c + 13, 0]], { w: 0.8 });
    }
    // zebra crossings on the four arms of each junction
    for (const cx of [-50, 50]) for (const cy of [-50, 50]) for (const sg of [-1, 1]) {
      for (let k = -8.6; k <= 8.7; k += 2.15) {
        const y0 = cy + sg * 14.2, y1 = cy + sg * 18.4; g.fill(K.rect(cx + k - 0.6, Math.min(y0, y1), cx + k + 0.6, Math.max(y0, y1), 0.02), '#F4F1E8');
        const x0 = cx + sg * 14.2, x1 = cx + sg * 18.4; g.fill(K.rect(Math.min(x0, x1), cy + k - 0.6, Math.max(x0, x1), cy + k + 0.6, 0.02), '#F4F1E8');
      }
    }
    // tram 28's rails (outside the Alfama, which lays its own)
    for (const pa of [LXT.WB, LXT.EB]) {
      const pts = pa.pts.filter((p) => !(p[0] > 63 && p[1] > 63)), runs = [[]];
      for (let i = 0; i < pts.length; i += 2) { const p = pts[i]; if (Math.abs(p[0]) > S.end + 1 || Math.abs(p[1]) > S.end + 1) continue; runs[runs.length - 1].push(p); }
      for (const run of runs) for (const side of [-0.72, 0.72]) {
        const off = []; for (let i = 0; i < run.length; i++) { const a = run[Math.max(0, i - 1)], b = run[Math.min(run.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; off.push([run[i][0] - dy / l * side, run[i][1] + dx / l * side, 0.03]); }
        for (let i = 0; i < off.length - 1; i += 40) g.fine(off.slice(i, Math.min(off.length, i + 41)), { w: 0.42, c: LC.rail });
      }
    }
  });

  /* ---- the promenade: lamps, benches, bollards ---- */
  for (let x = -140; x <= 140; x += 28) {
    if (Math.abs(x - 50) < 16 || Math.abs(x + 50) < 16 || x === -84) continue;
    T.obj([x, S.quay + 1.4], (g) => K.lamp(g, x, S.quay + 1.4, { h: 9, col: '#2F4A3A' }), { name: 'lamp' });
    if (Math.abs(x) > 4) T.obj([x + 9, S.quay + 1.6], (g) => K.bench(g, x + 9, S.quay + 1.6, { face: 'L', L: 2.4, col: '#7A5A3C' }), { name: 'bench' });
  }
  for (let x = -147; x <= 147; x += 7) if (Math.abs(x) > 8 && !(x > -100 && x < -84) && !(x > -131 && x < -122)) T.obj([x, S.edge - 0.7], (g) => { const a = g.p(x, S.edge - 0.7, 0); g.fill2([[a[0] - 0.7, a[1]], [a[0] + 0.7, a[1]], [a[0] + 0.6, a[1] - 2.2], [a[0] - 0.6, a[1] - 2.2]], '#3A3530'); g.disc2([a[0], a[1] - 2.2], 0.6, '#4A4540'); }, { name: 'bollard' });

  /* ---- people on the promenade ---- */
  [[-128, 1], [-66, 2], [-20, 3], [18, 4], [84, 5], [122, 6]].forEach(([x, i]) => {
    const w = LX.who(4000 + i * 3), back = i % 2;
    LX.walker(T, w, [[x - 18, S.quay + 3.2 + back * 2.4], [x + 18, S.quay + 3.2 + back * 2.4]], 1.1 + (i % 3) * 0.15, { phase: (i * 0.37) % 1 });
  });
  // fishermen at the edge, their rods out over the water; a couple sitting with their legs over the quay
  [[-74, 4100], [104, 4103], [-148 + 12, 4106]].forEach(([x, s]) => T.cast([x, S.edge - 1.6], function (g) {
    const r = LX.person(g, x, S.edge - 1.6, 0, LX.who(s, { dir: 1, pose: 'hold', reach: [-1.4, -9], cap: '#3F5F8F' }));
    const h = r.hands[0], tip = g.p(x - 2, S.edge + 9, 6);
    g.line2([h, tip], { w: 0.35, c: '#4A3A2C', boil: false, ext: 0 }); const wt = g.p(x - 2, S.edge + 9, S.wz); g.fine2([tip, wt], { w: 0.18, c: '#6E6A64' });
    K.box(g, x + 1, S.edge - 3.2, x + 2.6, S.edge - 2.2, 0, 1.0, { t: '#5FA58F', l: '#4F9A82', r: '#3F8270' }, { w: 0.4, boil: false });
  }));
  [[-40, 4110], [70, 4114]].forEach(([x, s]) => T.cast([x, S.edge - 0.4], function (g) {
    for (const [dx, k] of [[0, 0], [2.2, 1]]) K.person(g, x + dx, S.edge - 0.3, 0, LX.who(s + k, { dir: 1, pose: 'sit' }));
  }));

  /* ---- traffic ---- */
  const DRAW = {
    car: (g, a, i) => K.car(g, a, { col: ['#C9584B', '#7FA7CF', '#F1EFE8', '#3F5F8F', '#A4C66B', '#8E8A84'][i % 6], L: 5.2, W: 2.4 }),
    taxi: (g, a) => LX.taxi(g, a), taxiO: (g, a) => LX.taxi(g, a, { old: true }),
    van: (g, a) => K.bus(g, a, { L: 5.0, W: 2.3, h: 5.0, n: 2, band: '#C9584B' }),
    bus: (g, a) => { const i0 = g.cmds.length; K.bus(g, a, { col: '#F1CC48', band: '#E9E2D0', L: 7.0, W: 2.6, h: 6.2, n: 5 }); g.mark({ nc: (c) => (c === C.glass ? '#FFEFC4' : undefined) }, i0); },   // (lit inside at night)
    tuk: (g, a, i) => LX.tuk(g, a, { lights: true, col: ['#3E9A6A', '#C9463E', '#3F7FC2', '#E8A93A'][i % 4], roof: i % 2 ? { t: '#2E2A26', l: '#3A3530', r: '#2E2A26' } : null, driver: LX.who(4200 + i), riders: [LX.who(4210 + i * 3), LX.who(4211 + i * 3), LX.who(4212 + i * 3, { hat: '#E9D8A6' })] }),
  };
  LXT.LANES.forEach((L, li) => {
    for (let k = 0; k < LXT.NV; k++) {
      const kind = LXT.KINDS[li][k], vi = li * 2 + k;
      T.actor({ cast: false, sample: 0.18, period: LXT.P,
        at(t) { const c = LXT.car(li, k, t); if (!c) return null; return { x: c.x, y: c.y, key: 'v', ang: c.ang, alpha: c.alpha }; },
        draw(g, st) { DRAW[kind](g, st.ang, vi); } });
    }
  });
  // trams: anchored at the body's front-most corner (largest x + y), drawn back from there
  for (const dir of ['W', 'E']) for (let j = 0; j < LXT.NT; j++) {
    T.actor({ cast: false, sample: 0.2, period: LXT.P * LXT.NT, grow: false,
      at(t) {
        const st = LXT.tram(dir, j, t); if (!st) return null;
        const qa = Math.round(st.ang / TAU * 96), ang = qa * TAU / 96, pts = LXT.obbPts(st.x, st.y, ang, 6.8, 2.15);
        let best = pts[0]; for (const p of pts) if (p[0] + p[1] > best[0] + best[1]) best = p;
        return { x: best[0], y: best[1], key: 'q' + qa, ang, dx: st.x - best[0], dy: st.y - best[1], alpha: st.alpha };
      },
      draw(g, st) { g.at(st.dx, st.dy, 0, (g2) => LX.tram(g2, st.ang, { riders: 7 + j * 2 + (dir === 'W' ? 0 : 1) })); } });
  }

  /* ---- boats ---- */
  // two cacilheiros: out of the haze at the map's near edge, in to the pier at x = 22, a pause, and back out
  for (let i = 0; i < 2; i++) T.actor({ cast: false, sample: 0.3, period: 70, grow: false,
    at(t) {
      const u = (((t + i * 35) / 70) % 1 + 1) % 1, yIn = S.riv + 14, yPier = S.edge + 14, x = 22 + i * 7;
      let y, ang;
      if (u < 0.36) { y = lerp(yIn, yPier, smooth(u / 0.36)); ang = -Math.PI / 2; }
      else if (u < 0.5) { y = yPier; ang = -Math.PI / 2; }
      else if (u < 0.86) { y = lerp(yPier, yIn, smooth((u - 0.5) / 0.36)); ang = Math.PI / 2; }
      else return null;
      const a = clamp((yIn - y) / 10, 0, 1);
      const f = ang > 0 ? 11 : 9.6; return { x, y: y + f, z: S.wz, key: ang > 0 ? 'o' : 'i', ang, oy: -f, alpha: a < 1 ? Math.max(0.02, a) : null };
    },
    draw(g, st) { g.at(0, st.oy, 0, (g2) => LX.ferry(g2, st.ang)); } });
  // the ferry pier: a floating pontoon with a gangway
  T.obj([18, S.edge, 34, S.edge + 3], function (g) {
    K.box(g, 18, S.edge, 34, S.edge + 3, S.wz, S.wz + 1.2, { t: '#B9B4A8', l: '#8A8478', r: '#77716A' }, { w: 0.6 });
    K.box(g, 19, S.edge + 0.4, 23, S.edge + 2.6, S.wz + 1.2, S.wz + 4.6, { t: '#5E7E9A', l: '#E9E4D8', r: '#D3CCBE' }, { w: 0.5 });
    // night: the waiting room's lamp and a lamp at the pontoon's end, both doubled in the river
    g.glow('lamp', 23.6, S.edge + 1.5, S.wz + 3.8, { r: 1.3, base: S.wz + 1.2 }); g.glow('lamp', 33.4, S.edge + 2.6, S.wz + 1.7, { r: 1.0, base: S.wz + 1.2 });
  }, { name: 'pier' });
  // a fragata (ochre sail) and a white yacht along the river, under the bridge
  const sailer = (i, y, per, ph, dirx, kind) => T.actor({ cast: false, sample: 0.3, period: per, grow: false,
    at(t) { const u = (((t + ph) / per) % 1 + 1) % 1, x = dirx > 0 ? lerp(-S.rx - 10, S.rx + 10, u) : lerp(S.rx + 10, -S.rx - 10, u), a = clamp((S.rx + 4 - Math.abs(x)) / 10, 0, 1); if (a <= 0) return null; return { x: x + (dirx > 0 ? 8 : 0), y, z: S.wz, key: kind, alpha: a < 1 ? Math.max(0.02, a) : null }; },
    draw(g, st) {
      g.at(dirx > 0 ? -8 : 0, 0, 0, (g2) => {
        if (kind === 'frag') { K.boat(g2, dirx > 0 ? 0 : Math.PI, { kind: 'bare', L: 5.5, W: 1.9, hull: '#2F3A4F', stripe: '#C9463E', deck: '#B9A27D' }); const m0 = g2.p(0, 0, 1.4), m1 = g2.p(0, 0, 10.5); g2.line2([m0, m1], { w: 0.6, c: '#4A3A2C', boil: false }); LX.bulb2(g2, g2.p(0, 0, 9.9), 0.4, '#FFF2D0'); const s = dirx > 0 ? 1 : -1, sail = [[m1[0] + 0.3 * s, m1[1] + 0.4], [m1[0] + 11 * s, m1[1] + 9], [m0[0] + 7 * s, m0[1] - 2.5], [m0[0] + 0.3 * s, m0[1] - 2.2]]; g2.fill2(sail, '#D99A3E', true); g2.outline2(sail, { w: 0.5, c: '#8A5A1E', boil: false }); }
        else { const i0 = g2.cmds.length; K.boat(g2, dirx > 0 ? 0 : Math.PI, { kind: 'motor', L: 5.2, W: 1.8, hull: '#F3F1EA', stripe: '#3F5F8F' }); g2.mark({ nc: (c) => (c === C.navy ? '#FFE3A6' : undefined) }, i0); LX.bulb2(g2, g2.p(-0.6, 0, 2.6), 0.4, '#FFF6E0'); }   // (cabin lit, a white light, at night)
      });
    } });
  sailer(0, 196, 70, 0, 1, 'frag');
  sailer(1, 176, 70, 20, -1, 'yacht');
});
