'use strict';
/* (-100,0) Causeway Bay, the shopping crush (land to the seawall, local y 24; the typhoon shelter beyond).
   What is there: Times Square's tower with its giant screen over the plaza (the screen runs its loop of colour and
   SALE), SOGO's block with its name, a crossing where the crowd waits and then floods over, slim towers behind;
   on the waterfront the Noonday Gun in its railed garden and the typhoon shelter: a breakwater of piled granite
   with a little light at its end, and inside it sampans and junk-rigged houseboats and yachts rocking at their moorings.
   Who: shoppers with big paper bags crossing on the green man, a girl taking a selfie under the screen, a family,
   a sampan woman ferrying someone out to a yacht. */
SF.tile('causeway', -100, 0, { rim: 10 }, function (T) {
  const H = 37, I = HT.HAR.I, WL = HT.HAR.WL;
  const CYC = 16;            // the crossing: cars on the lane 0..9 s, the green man 9..16 s
  T.ground(function (g) {
    HK.ground(g, -H, -H, H, I, HK.C.pave);
    HK.paving(g, -H, -H, H, I, { step: 2.4 });
    // the plaza in front of Times Square, and the lane with its crossing
    g.fill(K.rect(-36, -14, -8, -4), '#E9E2D2'); HK.paving(g, -36, -14, -8, -4, { step: 3.2, joint: '#D6CDB8' });
    g.fill(K.rect(-H, -1, H, 6), HK.C.asph); g.line([[-H, -1, 0], [H, -1, 0]], { w: 0.5, c: '#9E9A90', boil: false }); g.line([[-H, 6, 0], [H, 6, 0]], { w: 0.5, c: '#9E9A90', boil: false });
    for (let y = -0.6; y < 5.6; y += 1.3) g.fill(K.rect(0, y, 4.4, y + 0.7), HK.C.line);
    HK.zh(g, (a, z) => [5.2 + a, 5.4 - z * 0.9, 0.02], 0, 1.2, 1.2, '望右', HK.C.line, { w: 0.4 });
    // the waterfront: the Noonday Gun's little garden
    g.fill(K.rect(10, 12, 24, I), '#B5CF8E'); g.grass(K.rect(10, 12, 24, I), { dens: 0.6 });
  }, { rim: true });

  /* ---- the typhoon shelter: the breakwater out in the water, boats moored inside ---- */
  T.obj([-37, 39.2, -6, 41.8], (g) => {
    const s = []; for (let x = -37; x < -7; x += 1.4) { const c = g.p(x, 40.5, WL + 0.6); s.push(c); }
    g.fill([[-37, 39.4, WL], [-7, 39.4, WL], [-7, 39.6, WL + 1.6], [-37, 39.6, WL + 1.6]], '#B9B3A6');
    g.fill([[-37, 39.6, WL + 1.6], [-7, 39.6, WL + 1.6], [-7, 41.6, WL], [-37, 41.6, WL]], '#CFC9BC'); g.line([[-37, 39.6, WL + 1.6], [-7, 39.6, WL + 1.6]], { w: 0.6, boil: false }); g.line([[-37, 41.6, WL], [-7, 41.6, WL]], { w: 0.5, boil: false });
    const st = []; for (let k = 0; k < 40; k++) { const R = RNG(k + 5), x = -36.5 + R() * 29, q = g.p(x, 40.6, WL + 0.9); st.push(q[0] - 0.8, q[1], q[0] + 0.8, q[1] - 0.2); } g.segs2(st, '#9E9A90', 0.4);
    const L = g.p(-7.4, 40.5, WL + 1.6); g.fill2([[L[0] - 0.6, L[1]], [L[0] + 0.6, L[1]], [L[0] + 0.5, L[1] - 3.6], [L[0] - 0.5, L[1] - 3.6]], '#C8372D', true); g.disc2([L[0], L[1] - 4.0], 1.4, 'rgba(255,214,140,0.35)'); g.disc2([L[0], L[1] - 4.0], 0.45, '#FFF0C8');
  }, { name: 'breakwater' });
  const MOOR = [[-32, 29, 0.0, 'sam'], [-25, 31.5, 0.2, 'yacht'], [-17, 28.4, -0.1, 'sam'], [-9, 31, 0.1, 'house'], [-29, 35.5, 0.05, 'sam'], [-14, 35.2, 0.15, 'yacht']];
  MOOR.forEach(([x, y, a, kind], i) => T.actor({ sample: 2, period: 4, grow: false,
    at(t) { const f = Math.floor(t * 2 + i * 1.3) % 4; return { x, y, z: WL + [0, 0.12, 0.2, 0.08][f], key: kind + f, f }; },
    draw(g) {
      if (kind === 'sam') HK.sampan(g, a, { L: 3.4 });
      else if (kind === 'yacht') { K.boat(g, a, { kind: 'motor', L: 4.6, W: 1.5, hull: '#F6F4EE', stripe: '#2F4F6E' }); const p = g.p(0, 0, 1.3); g.line2([p, [p[0], p[1] - 22]], { w: 0.4, c: '#5A564E', boil: false, ext: 0 }); g.fine2([[p[0], p[1] - 22], [p[0] + 10, p[1] - 1]], { w: 0.2, c: '#8E8A84' }); }
      else { K.boat(g, a, { kind: 'row', L: 4.4, W: 1.6, hull: '#6E4A30', stripe: '#C8372D', deck: '#B9976A' }); K.rbox(g, -0.6, 0, 2.4, 1.2, a, 1.0, 3.0, { t: '#C9A26B', l: '#B58F58', r: '#9E7B48' }, { w: 0.5 }); const L = g.p(0.6, 0, 3.3); g.fine2([[L[0] - 6, L[1] + 1], [L[0] + 6, L[1] - 2]], { w: 0.2, c: '#3A3530' }); for (let k = 0; k < 5; k++) { const c = [L[0] - 4.8 + k * 2.4, L[1] + 0.5 - k * 0.6]; g.disc2(c, 0.8, k % 2 ? '#E6C24F' : '#C8372D'); } }
    } }));
  // a sampan woman sculling a passenger out to the yachts and back
  T.actor({ sample: 0.3, period: 24, grow: false,
    at(t) { const u = ((t / 24) % 1 + 1) % 1, s = (1 - Math.cos(TAU * u)) / 2, x = lerp(-35, -21, s), y = 25.9, f = Math.floor(t * 2) % 4; return { x, y, z: WL, key: (u < 0.5 ? 'o' : 'i') + f, out: u < 0.5, f }; },
    draw(g, st) { const ang = st.out ? 0 : Math.PI; HK.sampan(g, ang, { L: 3.2, who: HK.who(9101, { hairStyle: 'bun', top: '#3B3F47', cap: undefined }), dir: st.out ? 0 : 2 }); } });

  /* ---- Times Square: the tower and its giant screen ---- */
  T.obj([-36, -36, -12, -16], (g) => {
    HK.tower(g, -35, -35, -13, -16, 0, 42, { col: '#C9D3D8', tone: { t: '#B9C3C8', l: '#D2DBDF', r: '#B3BEC4' }, fl: 2.4, ml: 2.0, lit: 0.3, seed: 31 });
    K.box(g, -30, -30, -18, -21, 42, 46, { t: '#B9C3C8', l: '#C9D3D8', r: '#A9B5BC' }, { w: 0.6 });
    // the atrium portal under the screen
    g.fill(K.on('L', -15.98, -30, -18, 0, 9.6), '#3F4A55'); g.outline(K.on('L', -15.97, -30, -18, 0, 9.6), { w: 0.6, boil: false });
    K.sign(g, 'L', -15.95, -33.6, -14.6, 19.6, 21.4, '#2C2622', 'TIMES SQUARE', { ink: '#F3F1EA', w: 0.3 });
  }, { name: 'times square' });
  T.actor({ sample: 5, period: 8, grow: false,
    at(t) { const f = Math.floor(t * 1.5) % 6; return { x: -24, y: -15.9, key: 's' + f, f }; }, bias: 3,
    draw(g, st) {
      const q = [[-10, 0, 10.4], [10, 0, 10.4], [10, 0, 19.0], [-10, 0, 19.0]];
      const scr = [['#E2572B', '#F2C230'], ['#2F4F9A', '#46D3E6'], ['#C8372D', '#F6F1E6'], ['#3E8A4E', '#F7D046'], ['#B07CFF', '#FF4F7B'], ['#1E1C1A', '#F2C230']][st.f];
      g.fill(q, scr[0]); g.outline(q, { w: 0.7, c: '#2A2622', boil: false });
      if (st.f === 2 || st.f === 5) K.textP(g, (a, z) => [a, 0.05, z], 0, 12.6, 3.4, 'SALE', scr[1], { center: true, w: 1.4 });
      else if (st.f === 1) HK.zh(g, (a, z) => [a, 0.05, z], 0, 17.6, 5.4, '香港', scr[1], { center: true, w: 1.2 });
      else { for (let k = 0; k < 5; k++) g.fill([[-9 + k * 4, 0.05, 11], [-7 + k * 4, 0.05, 11], [-6 + k * 4, 0.05, 18.4], [-8 + k * 4, 0.05, 18.4]], scr[1]); }
    } });
  /* ---- SOGO and slim towers behind ---- */
  T.obj([-9, -36, 13, -16], (g) => {
    K.box(g, -8, -35, 12, -17, 0, 22, { t: '#E3DED3', l: '#ECE7DB', r: '#D6D0C2' }, { w: 0.85 });
    for (const [f, p, a0, a1] of [['L', -17, -8, 12], ['R', 12, -35, -17]]) { g.fill(K.on(f, p + 0.02, a0 + 0.6, a1 - 0.6, 0.4, 5.2), '#F2DDA8'); for (let z = 7; z < 21; z += 3.4) g.fill(K.on(f, p + 0.02, a0 + 0.6, a1 - 0.6, z, z + 1.6), f === 'L' ? '#93AEBD' : '#7E9AAD'); }
    K.sign(g, 'L', -16.95, -4, 8, 16.6, 19.8, '#F6F3EA', 'SOGO', { ink: '#C8372D', w: 0.5 });
  }, { name: 'sogo' });
  for (const [x0, x1, y0, y1, h, col] of [[16, 26, -36, -26, 19, '#E8D3E2'], [27, 36, -34, -24, 15, '#D9E7C5'], [16, 34, -22, -12, 11, '#F2D7B8']]) T.obj([x0, y0, x1, y1], (g) => HK.resi(g, x0, y0, x1, y1, 0, h, { col, lit: 0.3 }), { name: 'tower' });
  // neon over the lane
  for (const [x, z0, z1, col, str, neon] of [[-6, 7, 13, '#2C2622', '金', HK.C.neon[3]], [20, 6, 12, '#2C2622', '酒家', HK.C.neon[0]], [30, 6.4, 11.4, '#C8372D', '士多', null]]) HK.bladeObj(T, x, x > 14 ? -12 : -17, 'y', 3.6, z0, z1, col, str, { neon });

  /* ---- the Noonday Gun in its railed garden ---- */
  T.obj([12, 13, 22, 23], (g) => {
    HK.rail(g, [12, 13], [22, 13], { h: 1.4, c: '#3A3530' }); HK.rail(g, [22, 13], [22, 23], { h: 1.4, c: '#3A3530' }); HK.rail(g, [12, 23], [22, 23], { h: 1.4, c: '#3A3530' }); HK.rail(g, [12, 13], [12, 23], { h: 1.4, c: '#3A3530' });
    K.box(g, 15.6, 16.6, 18.4, 19.4, 0, 0.8, { t: '#9AA3A8', l: '#B9C0C4', r: '#8E979C' }, { w: 0.4 });
    K.rbox(g, 17, 18, 2.6, 0.45, -0.35, 1.0, 1.9, { t: '#3A3F45', l: '#2E3338', r: '#24282C' }, { w: 0.45 });
    for (const dy of [-0.7, 0.7]) { const c = g.p(17, 18 + dy, 1.0); g.disc2(c, 1.2, '#5A4632'); g.ring2(c, 1.2, { w: 0.3, c: '#2A2622' }); }
  }, { name: 'noonday gun' });
  for (const [a, b] of [[-36.6, 9.4], [22.6, 36.6]]) T.obj([a, I - 0.5, b, I - 0.1], (g) => HK.rail(g, [a, I - 0.3], [b, I - 0.3], { h: 1.7 }), { name: 'seawall rail' });
  for (const [x, y] of [[-30, 18], [-14, 18], [28, 18], [-20, 9]]) T.obj([x, y], (g) => K.tree(g, x, y, { r: 3.2, h: 4.2, col: '#6FA06A' }), { name: 'tree' });

  /* ---- the crossing: shoppers wait at the kerb, then flood over on the green man ---- */
  const sh = SCENE.shots.find((s) => s.name === 'causeway'), OFF = sh ? HT.mod(9 - 3.0 - sh.a / 30, CYC) : 0;
  const tau = (t) => HT.mod(t + OFF, CYC);
  for (let i = 0; i < 14; i++) {
    const R = RNG(i * 37 + 11), north = i % 2 === 0, x = 0.4 + R() * 3.6, yA = north ? -2.4 - R() * 1.6 : 7.4 + R() * 1.6, yB = north ? 7.4 + R() * 1.4 : -2.4 - R() * 1.4;
    const look = HK.who(9200 + i, i % 3 === 0 ? { bag: ['#F6F3EA', '#C8372D', '#2C2622'][i % 3] } : i % 3 === 1 ? { phone: true } : {});
    // each person alternates: waits on one side, crosses, waits on the other, crosses back (period 2 cycles)
    T.actor({ sample: 0.3, period: 2 * CYC,
      at(t) {
        const u = HT.mod(t + OFF, 2 * CYC), leg = u < CYC ? 0 : 1, v = u - leg * CYC, from = leg ? yB : yA, to = leg ? yA : yB;
        const start = 9.2 + (i % 5) * 0.25, sp = 2.0 + (i % 3) * 0.25, dist = Math.abs(to - from), dur = dist / sp;
        if (v < start) return { x, y: from, key: 's' + (to > from ? 1 : 3), dir: to > from ? 1 : 3, pose: look.phone ? 'hold' : 'stand' };
        if (v < start + dur) { const d = (v - start) * sp, ph = Math.floor((d / 2.4) % 1 * 8); return { x, y: from + Math.sign(to - from) * d, key: 'w' + (to > from ? 1 : 3) + '.' + ph, dir: to > from ? 1 : 3, pose: 'walk', ph: ph / 8 }; }
        return { x, y: to, key: 's' + (to > from ? 3 : 1), dir: to > from ? 3 : 1, pose: look.phone ? 'hold' : 'stand' };
      },
      draw(g, st) { HK.person(g, 0, 0, 0, Object.assign({}, look, { dir: st.dir, pose: st.pose, ph: st.ph || 0 })); } });
  }
  // a taxi and a minibus on the lane while the crossing is red for walkers
  for (const [kind, k] of [['taxi', 0], ['mini', 1]]) T.actor({ sample: 0.2, period: CYC,
    at(t) { const v = tau(t) - k * 3.2; if (v < 0 || v > 8.4) return null; const x = 40 - v * 10; const a = Math.min(1, (37 - Math.abs(x)) / 6); if (a <= 0.02) return null; return { x, y: 4.0, key: kind, alpha: a < 1 ? a : null }; },
    draw(g) { HK.vehicle(g, Math.PI, kind, {}); } });
  // a pedestrian light at each kerb: red / green man (the actor flips with the cycle)
  for (const [x, y] of [[-0.6, -1.6], [5.0, 6.6]]) T.actor({ sample: 1, period: CYC, grow: false,
    at(t) { const g0 = tau(t) >= 9; return { x, y, key: g0 ? 'g' : 'r', go: g0 }; },
    draw(g, st) { const b = g.p(0, 0, 0), t0 = g.p(0, 0, 5); g.line2([b, t0], { w: 0.5, c: '#5A564E', boil: false, ext: 0 }); g.fill2([[t0[0] - 1.1, t0[1]], [t0[0] + 1.1, t0[1]], [t0[0] + 1.1, t0[1] + 3.0], [t0[0] - 1.1, t0[1] + 3.0]], '#2A2622', true); g.disc2([t0[0], t0[1] + (st.go ? 2.2 : 0.8)], 0.55, st.go ? '#5BE08A' : '#FF4F3C'); } });
  // more life: a selfie under the screen, a family with bags, strollers along the waterfront
  HK.stand(T, -22, -9, HK.who(9301, { dir: 1, pose: 'hold', phone: true, hairStyle: 'long' }), { name: 'selfie' });
  T.cast([-28, -6], (g) => { HK.person(g, -28.6, -6, 0, HK.who(9302, { dir: 0, bag: '#F6F3EA' })); HK.person(g, -27.2, -5.6, 0, HK.who(9303, { dir: 0, k: 0.7 })); HK.person(g, -26, -6.4, 0, HK.who(9304, { dir: 0, rwb: true })); }, { name: 'family' });
  HK.walker(T, HK.who(9305, { scarf: '#C8372D' }), [[-36, 21.6], [9, 21.6]], 1.0, { phase: 0.4 });
  HK.walker(T, HK.who(9306, { phone: true }), [[-34, 9], [-34, 20], [9, 20]], 1.0, { phase: 0.7 });
  HK.walker(T, HK.who(9307, { bag: '#2C2622' }), [[-8, -15], [-8, -3]], 0.9, { phase: 0.2 });
});
