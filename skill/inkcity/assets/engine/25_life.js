'use strict';
/* The life kit: nobody in a living map stands still. A person who stays in one place is always doing something, picked
   from a seeded day of small acts (looking round, talking with their hands, on the phone, a laugh, pointing, eating);
   people in company answer each other (one talks, the others listen, they laugh together); friends pose and jump for a
   photo; children chase round a loop; two friends throw a ball; a dog trots ahead of its owner; pigeons peck and now and
   then flutter up. Every helper makes T.actor()s, one per person (each is in front of or behind the things round them
   on their own account; the members of a group read one clock, so they answer in time), and every state has a small
   key, so the drawings are shared and cached. Person coordinates (hands, offsets) are K.person's: wide px from the
   feet, u towards the person's front side, v down.
   A city with its own people (kimono, uniforms, school bags) sets K.lifePerson to its own person function (same
   arguments as K.person, returns the same points). See references/life.md. */
(function () {
K.lifePerson = null;
const LP = () => K.lifePerson || K.person;


/* ---------------- the acts ---------------- */
// each act: n drawings, shown `rate` per second; f(i, w) gives K.person overrides for drawing i; z: a hop per drawing;
// extra(g, r, i, w): something held, drawn on the returned points
const PHONE2 = (g, p, s) => { s = s || 1; const q = [[p[0] - 0.55 * s, p[1] - 1.2 * s], [p[0] + 0.55 * s, p[1] - 1.2 * s], [p[0] + 0.55 * s, p[1] + 0.4 * s], [p[0] - 0.55 * s, p[1] + 0.4 * s]]; g.fill2(q, '#2A2622', true); };
const HIGH = (r) => (r.hands[0][1] < r.hands[1][1] ? r.hands[0] : r.hands[1]);
K.ACTS = {
  rest: { n: 1, rate: 1, f: () => ({}) },
  look: { n: 2, rate: 0.7, f: (i, w) => ({ dir: i ? ((w.dir | 0) + (w.lookTo || 1)) % 4 : w.dir | 0 }) },
  talk: { n: 4, rate: 2.6, f: (i) => ({ hands: [[[-1.9, -9.6], [3.0, -12.4]], [[-0.4, -12.2], [2.6, -11.6]], [[-1.9, -9.6], [3.4, -13.6]], [[0.4, -11.6], [3.2, -12.0]]][i] }) },
  listen: { n: 2, rate: 0.5, f: (i) => ({ hands: i ? [[-0.6, -10.4], [1.0, -10.6]] : null }) },
  phone: { n: 2, rate: 0.6, f: (i) => ({ hands: [[-1.9, -9.6 - i * 0.6], [1.3, -17.6]] }), extra: (g, r) => PHONE2(g, HIGH(r), 0.9) },
  scroll: { n: 1, rate: 1, f: () => ({ pose: 'hold', phone: true }) },
  wave: { n: 4, rate: 4, f: (i) => ({ pose: 'wave', ph: i / 4 }) },
  laugh: { n: 2, rate: 5, z: [0, 0.35], f: (i) => ({ hands: [[0.2, -10.8 + i * 0.3], [1.8, -11.2 + i * 0.3]] }) },
  point: { n: 1, rate: 1, f: () => ({ hands: [[-1.9, -9.6], [6.4, -16.4]] }) },
  stretch: { n: 1, rate: 1, f: () => ({ hands: [[-2.6, -22.2], [2.9, -22.4]] }) },
  clap: { n: 2, rate: 6, f: (i) => ({ hands: i ? [[0.9, -12.8], [2.3, -12.6]] : [[1.5, -12.8], [1.7, -12.7]] }) },
  cheer: { n: 4, rate: 5, f: (i) => ({ pose: 'cheer', ph: i / 4 }) },
  jump: { n: 4, rate: 6, z: [0, 0.9, 1.4, 0.9], f: (i) => ({ pose: 'cheer', ph: 0.25 + i * 0.05 }) },
  peace: { n: 1, rate: 1, f: () => ({ hands: [[-1.9, -9.6], [2.4, -20.0]] }), extra: (g, r) => { const h = HIGH(r); g.segs2([h[0], h[1], h[0] - 0.5, h[1] - 1.6, h[0], h[1], h[0] + 0.5, h[1] - 1.6], '#3A3128', 0.28); } },
  photo: { n: 2, rate: 0.5, f: (i) => ({ hands: [[1.0, -16.6 - i * 0.4], [2.6, -16.8 - i * 0.4]] }), extra: (g, r) => { const a = r.hands[0], b = r.hands[1]; PHONE2(g, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 0.2], 1.15); } },
  eat: { n: 2, rate: 1.4, f: (i) => ({ hands: i ? [[0.8, -9.6], [1.4, -17.4]] : [[0.8, -9.6], [2.6, -12.4]] }), extra: (g, r, i, w) => { if (!w.food) return; const h = HIGH(r); g.disc2([h[0] + 0.3, h[1] - 0.4], 0.75, w.food); } },
  drink: { n: 2, rate: 0.8, f: (i) => ({ hands: i ? [[0.8, -9.6], [1.6, -17.8]] : [[0.8, -9.6], [2.4, -12.6]] }), extra: (g, r, i, w) => { const h = HIGH(r), c = w.cup || '#F3F1EA'; g.fill2([[h[0] - 0.5, h[1] - 1.3], [h[0] + 0.5, h[1] - 1.3], [h[0] + 0.4, h[1] + 0.3], [h[0] - 0.4, h[1] + 0.3]], c, true); } },
  bow: { n: 1, rate: 1, f: () => ({ lean: 2.6, hands: [[0.4, -9.2], [1.6, -9.4]] }) },
  pray: { n: 2, rate: 0.4, f: (i) => ({ lean: i ? 0.9 : 0.4, hands: [[1.3, -14.6], [1.6, -14.7]] }) },
  read: { n: 2, rate: 0.25, f: (i) => ({ hands: i ? [[0.9, -12.0], [2.3, -12.3]] : [[1.0, -12.2], [2.2, -12.0]] }), extra: (g, r, i) => { const a = r.hands[0], b = r.hands[1], c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 0.6], q = [[c[0] - 1.3, c[1] - 0.9], [c[0] + 1.3, c[1] - 0.9 + (i ? 0.3 : 0)], [c[0] + 1.3, c[1] + 0.9], [c[0] - 1.3, c[1] + 0.9]]; g.fill2(q, '#F6F1E4', true); g.line2(q, { w: 0.25, c: '#5A4A3C', close: true, boil: false }); g.line2([[c[0], c[1] - 0.9], [c[0], c[1] + 0.9]], { w: 0.22, c: '#5A4A3C', boil: false }); } },
  sweep: { n: 2, rate: 1.6, f: (i) => ({ lean: 1.0, hands: i ? [[2.6, -11.6], [4.2, -6.8]] : [[1.0, -11.8], [2.0, -6.6]] }) },
};
const ACTS_STAND = ['rest', 'look', 'talk', 'phone', 'scroll', 'laugh', 'point', 'look'];
const ACTS_SIT = ['rest', 'look', 'talk', 'scroll', 'laugh', 'eat', 'drink'];
/* a seeded day of acts: [[act, start, length], ...] filling about `period` seconds (each act 2-6 s, the ones that move
   fast kept short) */
K.day = function (seed, acts, period) {
  const R = RNG(seed * 7919 + 3), seq = []; let t = 0, last = '';
  while (t < period) {
    let a = R.pick(acts); if (a === last && acts.length > 1) a = R.pick(acts);
    const d = (a === 'wave' || a === 'jump' || a === 'clap' || a === 'cheer' ? 1.2 + R() * 1.4 : a === 'laugh' ? 1.0 + R() * 1.2 : 2.0 + R() * 4.0);
    seq.push([a, t, d]); t += d; last = a;
  }
  return { seq, period: t };
};
const actAt = (day, t) => { const s = day.seq; let lo = 0, hi = s.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (s[m][1] <= t) lo = m; else hi = m - 1; } return s[lo]; };
/* the drawing of person `w` doing act a, drawing i (wide px, feet at the origin + (x, y, z) in u) */
K.doing = function (g, w, a, i, x, y, z) {
  const A = K.ACTS[a] || K.ACTS.rest, o = A.f(i, w) || {};
  const ww = Object.assign({}, w, o); if (o.hands === null) delete ww.hands;
  if (w.sit && ww.pose !== 'cheer') ww.pose = 'sit';
  const r = LP()(g, x || 0, y || 0, z || 0, ww);
  if (A.extra) A.extra(g, r, i, w);
  return r;
};

/* ---------------- one person in one place ---------------- */
/* who: K.who(...) (dir = which way they face, sit: on a bench / a step / a mat); o: acts (list of K.ACTS names), seed,
   period (s), z, cast, season, lookTo (+1 / 3: which way 'look' turns) */
K.idle = function (T, who, x, y, o) {
  o = o || {}; const seed = o.seed != null ? o.seed : Math.round(x * 131 + y * 977 + 7);
  const day = K.day(seed, o.acts || (who.sit ? ACTS_SIT : ACTS_STAND), o.period || 40), off = RNG(seed + 5)() * day.period;
  const w = Object.assign({}, who, { lookTo: o.lookTo || who.lookTo || 1 });
  return T.actor({ sample: 0.25, period: day.period, cast: o.cast, season: o.season,
    at(t) {
      const tt = ((t + off) % day.period + day.period) % day.period, s = actAt(day, tt), A = K.ACTS[s[0]];
      const i = Math.floor((tt - s[1]) * A.rate) % A.n;
      return { x, y, z: (o.z || 0) + (A.z ? A.z[i] : 0), key: s[0] + i, a: s[0], i };
    },
    draw(g, st) { K.doing(g, w, st.a, st.i); } });
};

/* ---------------- company ---------------- */
/* people talking together: members [{ who, x, y }] (tile-local u; who.dir: the way each faces, towards the others).
   One talks while the rest listen; each turn ends now and then in everybody laughing; sometimes someone checks a phone.
   Each member is an actor of their own, at their own feet, so each is in front of or behind the things around them on
   their own account (one actor for a whole group was put in front of or behind everything round it at once); they all
   read the same turns, so the answers are always in time. */
K.group = function (T, members, o) {
  o = o || {}; const seed = o.seed != null ? o.seed : Math.round(members[0].x * 37 + members[0].y * 101 + 11), R = RNG(seed * 31 + 9);
  const turns = []; let t = 0;
  while (t < (o.period || 36)) {
    const who = R.int(0, members.length - 1), d = 2.4 + R() * 3.6, joke = R() < (o.laughs == null ? 0.45 : o.laughs);
    turns.push([who, t, d, joke]); t += d + (joke ? 1.4 : 0.4);
  }
  const period = t, off = R() * period;
  const turnAt = (tt) => { tt = ((tt + off) % period + period) % period; let k = 0; while (k < turns.length - 1 && turns[k + 1][1] <= tt) k++; return [turns[k], tt - turns[k][1]]; };
  return members.map((m, j) => T.actor({ sample: 0.25, period, cast: o.cast, season: o.season,
    at(tt) {
      const [[sp, , d, joke], u] = turnAt(tt);
      let a, i;
      if (u < d) { a = sp === j ? 'talk' : (m.idle || 'listen'); i = a === 'talk' ? Math.floor(u * 2.6) % 4 : 0; }
      else if (joke) { a = 'laugh'; i = Math.floor(u * 5) % 2; }
      else { a = m.idle || 'listen'; i = 0; }
      const A = K.ACTS[a];
      return { x: m.x, y: m.y, z: (m.z || 0) + (A.z ? A.z[i] : 0), key: a + i, a, i };
    },
    draw(g, st) { K.doing(g, m.who, st.a, st.i); } }));
};

/* friends posing for a photo: posers [{ who, x, y }] facing the camera holder `shooter` { who, x, y }. They make peace
   signs, wave, then all jump at once; the shooter holds the phone up the whole time and checks the picture after.
   One actor per person, on one clock. */
K.photo = function (T, shooter, posers, o) {
  o = o || {}; const seq = [['peace', 2.6], ['wave', 1.6], ['jump', 1.0], ['laugh', 1.2], ['rest', 2.8]], period = seq.reduce((s, q) => s + q[1], 0) + (o.pause || 3);
  const off = (o.seed || 0) * 1.7;
  const stepAt = (tt) => { tt = ((tt + off) % period + period) % period; let s = 0, k = 0; while (k < seq.length && tt >= s + seq[k][1]) { s += seq[k][1]; k++; } return { a: k < seq.length ? seq[k][0] : 'look', u: tt - s, tt, check: k >= seq.length - 1 }; };
  const all = [shooter].concat(posers);
  return all.map((m, j) => T.actor({ sample: 0.25, period, cast: o.cast, season: o.season,
    at(tt) {
      const S = stepAt(tt);
      let a, i;
      if (j === 0) { a = S.check ? 'scroll' : 'photo'; i = 0; }
      else if (S.a === 'peace' && j % 2 === 0) { a = 'wave'; i = Math.floor(S.tt * 4) % 4; }      // one waves while the other makes a peace sign
      else { a = S.a; const A = K.ACTS[a]; i = Math.floor(S.u * A.rate) % A.n; }
      const A = K.ACTS[a];
      return { x: m.x, y: m.y, z: A.z ? A.z[i] : 0, key: a + i, a, i };
    },
    draw(g, st) { K.doing(g, m.who, st.a, st.i); } }));
};

/* ---------------- people on the move ---------------- */
/* children chasing round a closed route (tile-local points): runners keep their distance (gap, 0..1 of the route) and
   the one in front looks back now and then. who: [who, ...] (pinned children's looks). speed u/s. */
K.chase = function (T, kids, pts, speed, o) {
  o = o || {};
  return kids.map((w, i) => K.walker(T, Object.assign({ k: 0.82 }, w), pts, speed || 3.4, { phase: (o.phase || 0) + i * (o.gap || 0.08), cast: o.cast, season: o.season }));
};
/* two people throwing a ball between (x0, y0) and (x1, y1): a throw, the ball's arc, the catch, a pause, back again.
   Three actors on one clock (each person, and the ball at its own place in the air). */
K.toss = function (T, a, b, x0, y0, x1, y1, o) {
  o = o || {}; const fly = o.fly || 1.1, hold = o.hold || 0.9, period = 2 * (fly + hold);
  const dx = x1 - x0, dy = y1 - y0, dA = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), dB = (dA + 2) % 4;
  const state = (t) => { t = ((t + (o.seed || 0)) % period + period) % period; const leg = t < fly + hold ? 0 : 1, u = t - leg * (fly + hold), inAir = u < fly; return { leg, inAir, q: inAir ? Math.round(u / fly * 10) / 10 : 1 }; };
  const pose = (me, S) => {
    const thrower = me === S.leg;
    if (thrower && S.inAir && S.q < 0.3) return ['throw', { hands: [[-1.6, -9.8], [4.6, -15.6]] }];           // the throw follows through
    if (!thrower && S.inAir && S.q > 0.5) return ['ready', { hands: [[2.6, -14.4], [3.6, -14.0]] }];          // hands out for the catch
    if (!thrower && !S.inAir) return ['got', { hands: [[1.4, -12.6], [2.6, -12.4]] }];                        // got it
    return ['rest', {}];
  };
  const person = (me) => { const w = me ? b : a, p = me ? [x1, y1] : [x0, y0];
    return T.actor({ sample: 0.1, period, cast: o.cast, season: o.season,
      at(t) { const [k] = pose(me, state(t)); return { x: p[0], y: p[1], key: k, k }; },
      draw(g, st) { const S = { throw: [{ hands: [[-1.6, -9.8], [4.6, -15.6]] }], ready: [{ hands: [[2.6, -14.4], [3.6, -14.0]] }], got: [{ hands: [[1.4, -12.6], [2.6, -12.4]] }], rest: [{}] }[st.k][0];
        LP()(g, 0, 0, 0, Object.assign({}, w, { dir: me ? dB : dA }, S)); } }); };
  person(0); person(1);
  T.actor({ sample: 0.1, period, cast: o.cast, season: o.season, r: 4,
    at(t) { const S = state(t), from = S.leg ? [x1, y1] : [x0, y0], to = S.leg ? [x0, y0] : [x1, y1], q = S.inAir ? S.q : 1;
      return { x: lerp(from[0], to[0], q), y: lerp(from[1], to[1], q), z: 4.2 + Math.sin(Math.PI * q) * (o.arc || 3.2), key: 0 }; },
    draw(g) { const c = g.p(0, 0, 0); g.disc2(c, 0.95, o.ball || '#E8C445'); g.ring2(c, 0.95, { w: 0.3, c: '#5A4A30' }); } });
};

/* ---------------- animals ---------------- */
/* a little dog (wide px, feet at p), facing screen-right when s = 1; f: trot drawing 0..3; sniff: nose down */
K.dog2 = function (g, p, s, col, f, sniff) {
  const ink = '#3A3128', K2 = 1.3, P = (u, v) => [p[0] + s * u * K2, p[1] + v * K2], leg = [0.6, -0.6, -0.6, 0.6], L = leg[f & 3];
  const body = K.curve([P(-3.0, -3.0), P(-2.6, -4.6), P(1.6, -4.8), P(2.6, -3.6), P(2.2, -2.6), P(-2.4, -2.4)], 2, true);
  for (const [u, d] of [[-2.0, L], [1.6, -L]]) g.line2([P(u, -2.8), P(u + d * 0.5, 0)], { w: 0.5, c: shade(col, 0.25), boil: false });
  g.fill2(body, col, true); g.line2(body, { w: 0.32, c: ink, close: true, boil: false });
  for (const [u, d] of [[-1.6, -L], [2.0, L]]) g.line2([P(u, -2.8), P(u + d * 0.5, 0)], { w: 0.55, c: col, boil: false });
  const hy = sniff ? -2.4 : -5.6, head = K.curve([P(1.8, hy + 0.6), P(2.2, hy - 1.0), P(3.6, hy - 0.9), P(4.4, hy + 0.2), P(3.4, hy + 0.9)], 2, true);
  g.fill2(head, col, true); g.line2(head, { w: 0.3, c: ink, close: true, boil: false });
  g.fill2([P(2.2, hy - 0.8), P(2.6, hy - 2.1), P(3.1, hy - 0.8)], shade(col, 0.3), true);                // an ear
  g.disc2(P(4.35, hy + 0.15), 0.4, ink); g.disc2(P(3.3, hy - 0.2), 0.26, ink);                             // nose, eye
  g.line2([P(-2.9, -4.2), P(-3.8, -5.6 + (f & 1) * 0.7)], { w: 0.45, c: col, boil: false });              // the tail wags
};
/* someone walking a dog along a closed route: the dog trots a little ahead on its lead and stops to sniff now and then
   (its owner waits) */
K.dogWalk = function (T, who, pts, speed, col, o) {
  o = o || {}; const seg = [], L = [0];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const total = L[L.length - 1], walk = total / speed, stops = o.stops || 2, stopT = 2.4, period = walk + stops * stopT;
  const state = (t) => {
    t = ((t + (o.phase || 0) * period) % period + period) % period;
    const leg = period / stops, k = Math.floor(t / leg), u = t - k * leg, moving = u < leg - stopT;
    const d = (k * (leg - stopT) + (moving ? u : leg - stopT)) * speed % total;
    let i = 0; while (i < seg.length - 1 && d > L[i + 1]) i++;
    const [a, b] = seg[i], v = (d - L[i]) / ((L[i + 1] - L[i]) || 1), dx = b[0] - a[0], dy = b[1] - a[1], ln = Math.hypot(dx, dy) || 1;
    const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3), ph = moving ? Math.floor((d / 2.4) % 1 * 8) : 0, df = moving ? Math.floor(t * 8) % 4 : Math.floor(t * 3) % 2;
    return { x: a[0] + dx * v, y: a[1] + dy * v, dir, ph: ph / 8, ux: dx / ln, uy: dy / ln, moving, df, kph: ph };
  };
  // the owner, and the lead out to where the dog is (the dog is an actor of its own, 3.2 u ahead, so each of them is in
  // front of or behind the things around them on their own account)
  T.actor({ sample: 0.25, period, cast: o.cast, season: o.season,
    at(t) { const S = state(t); return Object.assign(S, { key: S.dir + '.' + S.kph + (S.moving ? '' : 's') }); },
    draw(g, st) {
      const dp = g.p(st.ux * 3.2, st.uy * 3.2, 0), s = (st.ux - st.uy) >= 0 ? 1 : -1;
      const r = LP()(g, 0, 0, 0, Object.assign({}, who, st.moving ? { dir: st.dir, pose: 'walk', ph: st.ph } : { dir: st.dir, hands: [[-1.9, -9.6], [2.6, -11.2]] }));
      const h = r.hands[1] || r.hands[0]; g.line2([h, [dp[0] + s * 1.9 * 1.3, dp[1] - 4.6 * 1.3]], { w: 0.25, c: '#C9463E', boil: false });
    } });
  return T.actor({ sample: 0.25, period, cast: o.cast, season: o.season, r: 6,
    at(t) { const S = state(t), sd = (S.ux - S.uy) >= 0 ? 1 : -1; return { x: S.x + S.ux * 3.2, y: S.y + S.uy * 3.2, key: sd + '.' + S.df + (S.moving ? '' : 's'), sd, df: S.df, moving: S.moving }; },   // sd: which way it faces (st.s is the engine's scale)
    draw(g, st) { K.dog2(g, g.p(0, 0, 0), st.sd, col || '#C98A4A', st.df, !st.moving); } });
};
/* a pigeon (wide px, feet at p), facing s; peck: head down; fl: wings up (0..1) */
K.pigeon2 = function (g, p, s, peck, fl) {
  const k = 1.45, P = (u, v) => [p[0] + s * u * k, p[1] + v * k], ink = '#3A3128';
  const body = K.curve([P(-1.9, -1.4), P(-0.9, -2.5), P(1.0, -2.4), P(1.6, -1.6), P(0.6, -0.9), P(-1.4, -1.0)], 2, true);
  g.fill2(body, '#9AA0A8', true); g.line2(body, { w: 0.22, c: ink, close: true, boil: false });
  if (fl) { const wg = [P(-0.6, -2.2), P(-1.6, -2.4 - 3.0 * fl), P(0.8, -2.2 - 2.4 * fl), P(0.8, -2.2)]; g.fill2(wg, '#7E848D', true); g.line2(wg, { w: 0.2, c: ink, close: true, boil: false }); }
  else g.fill2([P(-1.5, -1.7), P(0.4, -2.2), P(0.9, -1.6), P(-0.9, -1.3)], '#7E848D', true);
  const h = peck ? [1.9, -0.9] : [1.5, -3.0]; g.disc2(P(h[0], h[1]), 0.62 * k, '#6E8A82'); g.disc2(P(h[0] + 0.25, h[1] - 0.12), 0.16 * k, ink);
  g.line2([P(h[0] + 0.5, h[1] + 0.05), P(h[0] + 0.95, h[1] + 0.25)], { w: 0.22, c: '#C9A07A', boil: false });
  if (!fl) { const a = P(-0.2, -1.0), b = P(-0.2, 0), c = P(0.4, -1.0), d = P(0.4, 0); g.segs2([a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]], '#C97A6A', 0.2); }
};
/* a few pigeons pecking round (x, y) within r u; every so often they all flutter up and come down a little way off */
K.pigeons = function (T, x, y, n, o) {
  o = o || {}; const R = RNG((o.seed || 1) * 613 + 5), birds = [];
  for (let i = 0; i < (n || 5); i++) birds.push({ dx: (R() - 0.5) * 2 * (o.r || 2.4), dy: (R() - 0.5) * 2 * (o.r || 2.4), s: R() < 0.5 ? 1 : -1, ph: R() });
  birds.sort((a, b) => (a.dx + a.dy) - (b.dx + b.dy));
  const period = o.period || 14, flyAt = period - 2.2;
  return T.actor({ sample: 0.2, period, cast: o.cast, season: o.season, r: 10,
    at(t) {
      t = ((t + (o.seed || 0) * 2.3) % period + period) % period;
      if (t >= flyAt) { const u = (t - flyAt) / 2.2, k = Math.min(9, Math.floor(u * 10)); return { x, y, key: 'f' + k, fly: k / 9, i: 0 }; }
      return { x, y, key: 'p' + (Math.floor(t * 3) % 4), fly: -1, i: Math.floor(t * 3) % 4 };
    },
    draw(g, st) {
      for (const [j, b] of birds.entries()) {
        const up = st.fly >= 0 ? Math.sin(Math.PI * st.fly) * 6 : 0, sh = st.fly >= 0 ? st.fly * 1.6 : 0;
        const c = g.p(b.dx + sh, b.dy - sh * 0.4, 0); c[1] -= up;
        K.pigeon2(g, c, b.s, st.fly < 0 && ((j + st.i) % 3 === 0), st.fly >= 0 ? 0.4 + 0.6 * Math.abs(Math.sin(st.fly * 18 + j)) : 0);
      }
    } });
};
})();
