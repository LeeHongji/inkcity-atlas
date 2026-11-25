'use strict';
/* the world: tiles, static objects, actors, depth order.
   A tile registers ground decals (author order), static objects (depth-sorted by footprint) and actors
   (functions of time). All coordinates a tile author writes are tile-local, in u. */

const TILE_HALF = 37;            // kerb half-size of a neighbourhood tile, u
let OBJ_ID = 0, ACT_ID = 0, XID = 1e6;   // XID: things only some seasons have count apart
/* which seasons a thing belongs to (o.season: a name or a list; none: every season). 'all': here, and counted as always;
   'extra': here, but not in the city's own season, so counted apart; 'skip': not here, but kept in the count, because the
   city's own season has it; 'none': not here and not counted */
function seasonal(o) {
  if (!o || o.season == null) return 'all';
  const l = [].concat(o.season), own = typeof SCENE !== 'undefined' ? SCENE.season : null, mine = l.indexOf(own) >= 0;
  return l.indexOf(LOOK.season) >= 0 ? (mine ? 'all' : 'extra') : (mine ? 'skip' : 'none');
}

class Tile {
  constructor(name, cx, cy, o) {
    this.name = name; this.cx = cx; this.cy = cy; this.o = o || {};
    this.half = this.o.half || TILE_HALF;
    this.rim = this.o.rim == null ? -1 : this.o.rim;                 // frame the slab rim starts (-1: there from f0)
    this.castAt = this.o.castAt == null ? (this.rim < 0 ? -1 : this.rim + 69) : this.o.castAt;
    this.order = this.o.order == null ? (cx + cy) / 100 : this.o.order;
    this.grounds = []; this.objs = []; this.actors = []; this.statics = [];
    this.fp = [cx - this.half, cy - this.half, cx + this.half, cy + this.half];
  }
  _obj(fp, fn, o, extra) {
    o = Object.assign({}, o || {}, extra || {});
    const sn = seasonal(o);
    let f;
    if (!fp) f = this.fp.slice();
    else if (fp.length === 2) f = [fp[0] - 0.01, fp[1] - 0.01, fp[0] + 0.01, fp[1] + 0.01];
    else f = fp.slice();
    if (fp) { f[0] += this.cx; f[2] += this.cx; f[1] += this.cy; f[3] += this.cy; }
    const ob = { id: sn === 'extra' ? XID++ : sn === 'none' ? -1 : OBJ_ID++, absent: sn === 'skip' || sn === 'none', tile: this, fp: f, fn, cast: !!o.cast, on: !!o.on, ground: !!o.ground, rim: !!o.rim, bias: o.bias || 0, noHide: !!o.noHide, name: o.name || '', list: null, bb: null, promoted: false, tall: !!o.tall, under: o.under == null ? null : o.under };
    return ob;
  }
  /* flat things painted on the ground; drawn first, in the order given */
  ground(fn, o) { const ob = this._obj(null, fn, o, { ground: true }); if (!ob.absent) this.grounds.push(ob); return ob; }
  /* a standing thing. fp = [x, y] for a small prop or [x0, y0, x1, y1] for a footprint box (tile-local u) */
  obj(fp, fn, o) { const ob = this._obj(fp, fn, o); if (!ob.absent) this.objs.push(ob); return ob; }
  /* same, but part of the living layer that pops in after the paint (people, animals, flower rows, ...) */
  cast(fp, fn, o) { return this.obj(fp, fn, Object.assign({ cast: true }, o || {})); }
  /* a moving thing: spec.at(t) -> {x, y, z?, key, ...} in tile-local u (or null when absent);
     spec.draw(g, st) draws it around the origin for that state. States with equal key share a drawing. */
  actor(spec) {
    const sn = seasonal(spec);
    const a = Object.assign({ tile: this, id: sn === 'extra' ? XID++ : sn === 'none' ? -1 : ACT_ID++, cast: true, layer: '', r: 12 }, spec);
    if (sn === 'skip' || sn === 'none') return a;
    this.actors.push(a); SF.actors.push(a); return a;
  }
}
SF.tile = function (name, cx, cy, o, fn) {
  const t = new Tile(name, cx, cy, o); t.def = fn; SF.tiles.push(t); SF.tileBy[name] = t; return t;
};

/* ---------- building the display lists ---------- */
/* a season's own colours: SCENE.palette = { autumn: { '#B5CF8E': '#C7C68C' } } swaps a colour in everything that stands
   still (the ground, the buildings, the trees), as it is built in that season: lawns going to straw. People and cars keep
   theirs. The city's own season has no palette. */
let SPAL = null, SNOWC = null;
/* snow lying (SCENE.air[season].cover, 0..1): every 3-D fill that faces up (a lawn, a road, a roof, a box's top, a car's
   roof) goes towards snow white, the more the flatter; water and people do not */
function snowCover() {
  const a = typeof SCENE !== 'undefined' && SCENE.air && SCENE.air[LOOK.season];
  return a && a.cover ? { cover: a.cover, col: a.snowCol || '#F3F5F7', water: nightSet().water } : null;
}
function snowOn(cmds, ground) {                               // ground: a flat decal drawn in wide px lies on the ground too
  for (const d of cmds) {
    const up = d.up != null ? d.up : ground ? 1 : 0;
    if ((d.k !== K_FILL && !(ground && d.k === K_DISC)) || !(up > 0.35) || typeof d.c !== 'string' || d.c.length !== 7 || d.c[0] !== '#' || SNOWC.water.has(d.c.toLowerCase())) continue;
    d.c = mix(d.c, SNOWC.col, SNOWC.cover * smooth((up - 0.35) / 0.4));
  }
}
function seasonPal() { const p = typeof SCENE !== 'undefined' && SCENE.palette && SCENE.palette[LOOK.season]; return p ? new Map(Object.entries(p).map(([a, b]) => [a.toLowerCase(), b])) : null; }
function buildObj(ob) {
  const g = new G('o' + ob.tile.name + ob.id);
  g.ox = ob.tile.cx; g.oy = ob.tile.cy;
  ob.fn(g);
  if (SPAL && !ob.cast) for (const d of g.cmds) {
    if (typeof d.c === 'string') { const n = SPAL.get(d.c.toLowerCase()); if (n) d.c = n; }
    if (typeof d.col === 'string') { const n = SPAL.get(d.col.toLowerCase()); if (n) d.col = n; }
  }
  if (SNOWC && !ob.cast) snowOn(g.cmds, ob.ground);
  ob.emits = g.emits || null;
  ob.list = g.cmds; ob.glows = g.glows || null;
  ob.bb = g.bb[0] > g.bb[2] ? [0, 0, 0, 0] : [g.bb[0] - 1.5, g.bb[1] - 1.5, g.bb[2] + 1.5, g.bb[3] + 1.5];
}
const bbHit = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
const SMALL_FP = 6;
/* is static object B in front of the point (x, y, z)? small props: nearer along the view; boxes: the point is behind a front face.
   An object made with { under: h } (a bridge span) covers what is inside its footprint below height h (a boat passing
   under it); whatever is inside it at or above h (someone crossing) stands on it. */
/* SCENE.strictProps: a small prop wholly on the far side of the point (more than 2 u off in x or in y) is never in front
   of it; without it a far prop is in front of anything with a smaller x + y (a utility pole across the street, its wires
   overlapping a person on screen, took the person out of order). */
let STRICT_PROPS;
function objInFrontOfPoint(B, x, y, z) {
  const f = B.fp;
  if (f[2] - f[0] <= SMALL_FP && f[3] - f[1] <= SMALL_FP) {
    if (STRICT_PROPS === undefined) STRICT_PROPS = !!(typeof SCENE !== 'undefined' && SCENE.strictProps);
    if (STRICT_PROPS && (f[2] + 2 <= x || f[3] + 2 <= y)) return false;
    return (f[0] + f[2] + f[1] + f[3]) / 2 + B.bias > x + y;
  }
  if (x >= f[0] && x <= f[2] && y >= f[1] && y <= f[3]) return B.under != null && (z || 0) < B.under;   // on it / inside it / under it
  return x < f[2] && y < f[3];
}
/* -1: A is drawn before B, +1: after */
function cmpStatic(A, B) {
  const a = A.fp, b = B.fp;
  if (A.on || B.on) {
    const cx = (a[0] + a[2]) / 2, cy = (a[1] + a[3]) / 2, dx = (b[0] + b[2]) / 2, dy = (b[1] + b[3]) / 2;
    if (A.on && cx >= b[0] && cx <= b[2] && cy >= b[1] && cy <= b[3]) return 1;
    if (B.on && dx >= a[0] && dx <= a[2] && dy >= a[1] && dy <= a[3]) return -1;
  }
  const e = 0.05;
  const aBehind = a[2] <= b[0] + e || a[3] <= b[1] + e, bBehind = b[2] <= a[0] + e || b[3] <= a[1] + e;
  if (aBehind && !bBehind) return -1;
  if (bBehind && !aBehind) return 1;
  const sa = a[0] + a[2] + a[1] + a[3] + 2 * A.bias, sb = b[0] + b[2] + b[1] + b[3] + 2 * B.bias;
  return sa < sb ? -1 : sa > sb ? 1 : (A.id < B.id ? -1 : 1);
}
/* topological depth sort of a tile's standing objects */
function sortObjs(objs) {
  const n = objs.length, after = new Array(n), indeg = new Int32Array(n);
  for (let i = 0; i < n; i++) after[i] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (!bbHit(objs[i].bb, objs[j].bb)) continue;
    if (cmpStatic(objs[i], objs[j]) < 0) { after[i].push(j); indeg[j]++; } else { after[j].push(i); indeg[i]++; }
  }
  const key = (o) => o.fp[0] + o.fp[2] + o.fp[1] + o.fp[3] + 2 * o.bias;
  const done = new Uint8Array(n), out = [];
  for (let step = 0; step < n; step++) {
    let best = -1, bk = 1e18, anyFree = false;
    for (let i = 0; i < n; i++) if (!done[i] && indeg[i] === 0) { anyFree = true; const k = key(objs[i]); if (k < bk) { bk = k; best = i; } }
    if (!anyFree) for (let i = 0; i < n; i++) if (!done[i]) { const k = key(objs[i]); if (k < bk) { bk = k; best = i; } }   // cycle: take the farthest
    done[best] = 1; out.push(objs[best]);
    for (const j of after[best]) if (indeg[j] > 0) indeg[j]--;
  }
  return out;
}

/* ---------- actors ---------- */
const ACTOR_PERIOD = 60;         // seconds sampled when deciding what can hide an actor
function actorState(a, t) {
  const st = a.at(t);
  if (!st) return null;
  if (st.s != null && !(st.s > 0) && !a.warned) { a.warned = true; window.__err = (window.__err || '') + '[' + a.tile.name + '] actor ' + a.id + ': st.s is a scale and must be > 0 (got ' + st.s + '); use another field for left/right\n'; }
  st.wx = a.tile.cx + st.x; st.wy = a.tile.cy + st.y;
  const p = prj(st.wx, st.wy, st.z || 0);
  st.sx = p[0]; st.sy = p[1];
  return st;
}
const ACT_DL = new Map();
function actorDL(a, st) {
  const key = a.id + '|' + (st.key == null ? '' : st.key);
  let d = ACT_DL.get(key);
  if (d) return d;
  const g = new G('a' + a.id + (a.vary ? key : ''));
  g.boilP = 0;
  // draw around the world origin; the replay translates it to the actor's position
  g.ox = 0; g.oy = 0; g.oz = 0;
  const o = prj(0, 0, 0);
  a.draw(g, st);
  if (SNOWC) snowOn(g.cmds);                                  // snow on a car's roof, a train's
  for (const c of g.cmds) {
    if (c.k === K_FILL || c.k === K_STROKE || c.k === K_SEGS || c.k === K_TRIS) { const p = c.p; for (let i = 0; i < p.length; i += 2) { p[i] -= o[0]; p[i + 1] -= o[1]; } }
    else if (c.k === K_RIB) { const p = c.c; for (let i = 0; i < p.length; i += 2) { p[i] -= o[0]; p[i + 1] -= o[1]; } }
    else { c.x -= o[0]; c.y -= o[1]; }
  }
  const bb = g.bb[0] > g.bb[2] ? [0, 0, 0, 0] : [g.bb[0] - o[0] - 1, g.bb[1] - o[1] - 1, g.bb[2] - o[0] + 1, g.bb[3] - o[1] + 1];
  d = { cmds: g.cmds, bb, comp: new Map() };
  if (ACT_DL.size > 40000) ACT_DL.clear();
  ACT_DL.set(key, d);
  return d;
}

/* the drawings of the poses SF.initWorld did not draw (SCENE.sampleKeys), a few at a time while the page is idle */
function* warmPoses(list) {
  let last = performance.now();
  for (const [a, t] of list) { const st = actorState(a, t); if (st) actorDL(a, st); if (performance.now() - last > 2) { yield 'poses'; last = performance.now(); } }
}

/* ---------- world init ---------- */
/* SF.initWorld runs every tile's def and builds what it made. Run again (a new season), it first puts every tile back the
   way it was before its def ran, so the city is built from scratch with the same counts and seeds */
let WORLD0 = null;
SF.initWorld = function (only) {
  if (!WORLD0) WORLD0 = { obj: OBJ_ID, act: ACT_ID, actors: SF.actors.slice(), tiles: SF.tiles.map((t) => [t, t.grounds.slice(), t.objs.slice(), t.actors.slice()]) };
  else {
    OBJ_ID = WORLD0.obj; ACT_ID = WORLD0.act; XID = 1e6; SF.actors = WORLD0.actors.slice(); ACT_DL.clear();
    SF.tiles = WORLD0.tiles.map(([t, gr, ob, ac]) => { t.grounds = gr.slice(); t.objs = ob.slice(); t.actors = ac.slice(); t.statics = []; t.skip = false; for (const o of gr.concat(ob)) o.promoted = false; return t; });
  }
  SF.tiles.sort((a, b) => a.order - b.order);
  SPAL = seasonPal(); SNOWC = snowCover();
  for (const t of SF.tiles) {
    if (only && only.indexOf(t.name) < 0 && t.name !== 'streets' && !t.o.shared) { t.skip = true; continue; }   // shared: ground under several places
    const fail = (e, what) => { window.__err = (window.__err || '') + '[' + t.name + '] ' + what + ': ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e) + '\n'; };
    try { t.def(t); } catch (e) { fail(e, 'def'); }
    const safe = (ob) => { try { buildObj(ob); } catch (e) { fail(e, 'object ' + (ob.name || ob.id)); ob.list = []; ob.bb = [0, 0, 0, 0]; } };
    for (const ob of t.grounds) safe(ob);
    for (const ob of t.objs) safe(ob);
    t.objs = sortObjs(t.objs);
    t.statics = t.grounds.concat(t.objs);
    let b = [1e9, 1e9, -1e9, -1e9], bn = [1e9, 1e9, -1e9, -1e9];
    for (const ob of t.statics) {
      if (ob.bb[0] === ob.bb[2]) continue;
      b = [Math.min(b[0], ob.bb[0]), Math.min(b[1], ob.bb[1]), Math.max(b[2], ob.bb[2]), Math.max(b[3], ob.bb[3])];
      if (!ob.cast) bn = [Math.min(bn[0], ob.bb[0]), Math.min(bn[1], ob.bb[1]), Math.max(bn[2], ob.bb[2]), Math.max(bn[3], ob.bb[3])];
    }
    t.bb = b; t.bbNoCast = bn[0] > bn[2] ? b : bn;
  }
  if (window.__mark) window.__mark('tiles built');
  SF.live = SF.tiles.filter((t) => !t.skip);
  SF.actors = SF.actors.filter((a) => !a.tile.skip);
  // global static order: tiles back to front, grounds then standing objects
  SF.statics = [];
  for (const t of SF.live) for (const ob of t.statics) { ob.gi = SF.statics.length; SF.statics.push(ob); }

  // which standing objects can hide an actor? those become sprites drawn in order with the actors
  const standing = SF.statics.filter((o) => !o.ground);
  // SCENE.sampleKeys = n (a city of many lively people): an actor's first n poses are drawn here, and the rest are taken
  // to fill the box those n fill, widened by a quarter; their drawings are made later, in idle time (warmPoses). Without
  // it every pose of every actor is drawn now.
  const lim = (typeof SCENE !== 'undefined' && SCENE.sampleKeys) || 0, later = [];
  for (const a of SF.actors) {
    a.cand = [];
    if (a.layer === 'top') continue;
    const T = a.period || ACTOR_PERIOD, step = a.sample || 0.2, rects = [], seen = lim ? new Map() : null;
    let u = [1e9, 1e9, -1e9, -1e9], ub = null, pb = null;
    for (let t = 0; t < T; t += step) {
      const st = actorState(a, t); if (!st) continue;
      let bb;
      if (!lim) bb = actorDL(a, st).bb;
      else {
        const k = String(st.key); bb = seen.get(k);
        if (!bb) {
          if (seen.size < lim) { bb = actorDL(a, st).bb; ub = ub ? [Math.min(ub[0], bb[0]), Math.min(ub[1], bb[1]), Math.max(ub[2], bb[2]), Math.max(ub[3], bb[3])] : bb.slice(); }
          else { const w = (ub[2] - ub[0]) / 4, h = (ub[3] - ub[1]) / 4; bb = [ub[0] - w, ub[1] - h, ub[2] + w, ub[3] + h]; later.push([a, t]); }
          seen.set(k, bb);
        }
      }
      pb = pb ? [Math.min(pb[0], bb[0]), Math.min(pb[1], bb[1]), Math.max(pb[2], bb[2]), Math.max(pb[3], bb[3])] : bb.slice();
      const d = { bb }, s = st.s == null ? 1 : st.s;
      const r = [st.sx + d.bb[0] * s, st.sy + d.bb[1] * s, st.sx + d.bb[2] * s, st.sy + d.bb[3] * s, st.wx, st.wy, st.z || 0];
      rects.push(r); u = [Math.min(u[0], r[0]), Math.min(u[1], r[1]), Math.max(u[2], r[2]), Math.max(u[3], r[3])];
    }
    // the box any pose of this actor fills, with room to spare: the frame skips an actor whose box is off screen before it
    // looks up (or draws) the pose at all
    if (pb) { const m = 0.15 * Math.max(pb[2] - pb[0], pb[3] - pb[1]) + 3; a.pb = [pb[0] - m, pb[1] - m, pb[2] + m, pb[3] + m]; }
    const near = standing.filter((o) => bbHit(o.bb, u));
    for (const ob of near) {
      if (ob.promoted || ob.noHide) continue;                // { noHide: true }: overhead wires and the like never hide anybody
      for (const r of rects) if (bbHit(ob.bb, r) && objInFrontOfPoint(ob, r[4], r[5], r[6])) { ob.promoted = true; break; }
    }
  }
  if (window.__mark) window.__mark('actors sampled');
  if (typeof R !== 'undefined') { R.jobs = R.jobs.filter((j) => j.key !== 'poses'); if (later.length) R.jobs.push({ key: 'poses', low: true, gen: warmPoses(later), fn() {} }); }
  // closure: anything standing in front of a sprite and overlapping it must be a sprite too
  const sprites = [];
  for (const ob of SF.statics) {
    if (ob.ground) continue;
    if (!ob.promoted) for (const s of sprites) if (bbHit(s.bb, ob.bb)) { ob.promoted = true; break; }
    if (ob.promoted) sprites.push(ob);
  }
  SF.sprites = sprites;
  for (const a of SF.actors) a.cand = sprites;

  // line boil: a contour may boil only if no paint laid down later covers it (later in its own object, or in a later object)
  const fillsOf = (ob) => {
    if (ob.fills) return ob.fills;
    const f = [];
    ob.list.forEach((d, qi) => {
      if (d.k === K_FILL) { const p = d.p; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let q = 0; q < p.length; q += 2) { if (p[q] < x0) x0 = p[q]; if (p[q] > x1) x1 = p[q]; if (p[q + 1] < y0) y0 = p[q + 1]; if (p[q + 1] > y1) y1 = p[q + 1]; } f.push({ qi, bb: [x0, y0, x1, y1], p }); }
      else if (d.k === K_DISC) f.push({ qi, bb: [d.x - d.r, d.y - d.r, d.x + d.r, d.y + d.r], disc: d });
    });
    return (ob.fills = f);
  };
  const covered = (f, x, y) => x > f.bb[0] && x < f.bb[2] && y > f.bb[1] && y < f.bb[3] && (f.disc ? Math.hypot(x - f.disc.x, y - f.disc.y) < f.disc.r : pointInPoly(x, y, f.p));
  for (let i = 0; i < SF.statics.length; i++) {
    const ob = SF.statics[i];
    let hasBoil = false;
    for (const d of ob.list) if (d.k === K_RIB && d.bo) { hasBoil = true; break; }
    if (!hasBoil) continue;
    const later = [];
    for (let j = i + 1; j < SF.statics.length; j++) { const o2 = SF.statics[j]; if (bbHit(o2.bb, ob.bb)) later.push(o2); }
    const own = fillsOf(ob);
    ob.list.forEach((d, qi) => {
      if (d.k !== K_RIB || !d.bo) return;
      const c = d.c, n = c.length / 2, pts = [];
      for (const u of [0.04, 0.27, 0.5, 0.73, 0.96]) { const k = Math.min(n - 1, Math.round(u * (n - 1))); pts.push(c[2 * k], c[2 * k + 1]); }
      let free = true;
      outer:
      for (let q = 0; q < pts.length; q += 2) {
        const x = pts[q], y = pts[q + 1];
        for (const f of own) if (f.qi > qi && covered(f, x, y)) { free = false; break outer; }
        for (const o2 of later) { if (x < o2.bb[0] || x > o2.bb[2] || y < o2.bb[1] || y > o2.bb[3]) continue; for (const f of fillsOf(o2)) if (covered(f, x, y)) { free = false; break outer; } }
      }
      d.live = free;
    });
  }
  for (const ob of SF.statics) ob.fills = null;
  if (window.__mark) window.__mark('boil');
};
