import React from 'react';
import {Paper} from '@/components/ui/paper';
import {Lettering} from '@/components/ui/lettering';
import {FW, FH} from '../format.js';

/** Text written on by a pen: a clip that opens left to right at handwriting speed. */
export function W({id, children, className = ''}) {
  return <span id={id} className={'w ' + className}>{children}</span>;
}
/** Write `sel` on from `at`; returns when it finishes. cps = characters per second of the hand. */
export function write(tl, sel, at, cps = 26) {
  const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
  if (!el) throw new Error('nothing to write: ' + sel);
  const dur = Math.max(0.22, el.textContent.length / cps);
  tl.fromTo(el, {clipPath: 'inset(-40% 104% -40% -4%)'}, {clipPath: 'inset(-40% -4% -40% -4%)', duration: dur, ease: 'sine.inOut', immediateRender: true}, at);
  return at + dur;
}
/** A line that comes up softly rather than being written. */
export function lift(tl, sel, at, dur = 0.45) {
  tl.fromTo(sel, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: dur, ease: 'power2.out', immediateRender: true}, at);
}
/** Cut in at a shot's start and out at its end (the product's own grammar: hard cuts). */
export function cut(tl, s, from = s.start, to = s.end) {
  const el = `section[data-shot="${s.id}"]`;
  if (from > 0) tl.set(el, {opacity: 1}, from); else document.querySelector(el).style.opacity = '1';
  tl.set(el, {opacity: 0}, to);
}

/* The guide's hand-drawn arrow (same curve as arrowPath in gallery-src/src/guide/Guide.tsx). */
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
export function arrowPath(ax, ay, bx, by, seed, hs = 14) {
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const bend = ((hash(seed) % 2) ? 1 : -1) * Math.min(40, L * 0.16);
  const mx = (ax + bx) / 2 - uy * bend, my = (ay + by) / 2 + ux * bend;
  const tx = bx - mx, ty = by - my, tl = Math.hypot(tx, ty) || 1, hx = tx / tl, hy = ty / tl;
  const h1 = [bx - hx * hs - hy * hs * 0.55, by - hy * hs + hx * hs * 0.55], h2 = [bx - hx * hs + hy * hs * 0.5, by - hy * hs - hx * hs * 0.5];
  return {line: `M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`, head: `M${h1[0]} ${h1[1]} L${bx} ${by} L${h2[0]} ${h2[1]}`};
}
export function PenArrow({id, from, to, seed}) {
  const p = arrowPath(from[0], from[1], to[0], to[1], seed);
  return <svg className="pen-arrow" width={FW} height={FH} viewBox={`0 0 ${FW} ${FH}`}>
    <path id={id + '-l'} d={p.line} pathLength="1" />
    <path id={id + '-h'} d={p.head} pathLength="1" />
  </svg>;
}
export function drawArrow(tl, id, at, dur = 0.45) {
  tl.fromTo(`#${id}-l`, {strokeDashoffset: 1}, {strokeDashoffset: 0, duration: dur, ease: 'power1.inOut', immediateRender: true}, at);
  tl.fromTo(`#${id}-h`, {strokeDashoffset: 1}, {strokeDashoffset: 0, duration: 0.16, ease: 'none', immediateRender: true}, at + dur);
}

/** A taped paper label: the name in the library's riso lettering, a few words in the hand under it. */
export function Label({id, name, note, tone = 'marker', seed}) {
  return <div className="label-wrap" id={id}>
    <Paper tape="top" tapeKind="masking" seed={seed || id} className="label-paper">
      <Lettering as="div" tone={tone} wobble={0.5} seed={'lt-' + id} className="label-name"><W id={id + '-name'}>{name}</W></Lettering>
      {note ? <div className="label-note"><W id={id + '-note'}>{note}</W></div> : null}
    </Paper>
  </div>;
}
/** Write a label's words on: the name, then its note. */
export function writeLabel(tl, id, at) {
  let t = write(tl, `#${id}-name`, at, 16);
  if (document.getElementById(id + '-note')) t = write(tl, `#${id}-note`, t + 0.08, 30);
  return t;
}
