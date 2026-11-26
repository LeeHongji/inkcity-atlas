import React from 'react';
import seal from '../seal.json';

export const smooth = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
export const inOut = (t) => { t = Math.max(0, Math.min(1, t)); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

/** Cut in at a shot's start and out at its end (the city's own tour grammar: hard cuts). */
export function cut(tl, s, from = s.start, to = s.end) {
  const el = `section[data-shot="${s.id}"]`;
  if (from > 0) tl.set(el, {opacity: 1, visibility: 'visible'}, from); else Object.assign(document.querySelector(el).style, {opacity: '1', visibility: 'visible'});
  tl.set(el, {opacity: 0, visibility: 'hidden'}, to);
}

/** Words stamped on, the way a hanko lands: down from a little above and larger in 0.11 s, a small give, settled. */
export function stamp(tl, sel, at) {
  tl.fromTo(sel, {opacity: 0, scale: 1.14, y: -6}, {opacity: 1, scale: 1, y: 0, duration: 0.11, ease: 'power3.in', immediateRender: true}, at);
  tl.fromTo(sel, {scale: 1}, {scale: 0.985, duration: 0.05, ease: 'power1.out', immediateRender: false, yoyo: true, repeat: 1}, at + 0.11);
}

/** Words lifted off: up and away in 0.25 s. */
export function lift(tl, sel, at) {
  tl.to(sel, {opacity: 0, y: -14, duration: 0.25, ease: 'power2.in'}, at);
}

/* The red seal, 東京, white on vermilion like a carved name seal. Its two characters are the strokes of Tokyo's own
   lettering table (cities/tokyo/src/37_kana.js, via tools/seal.mjs), the hand the city's signs are written in. */
const SEAL_RED = '#C8352B';
function sealEdge() {
  // a softly uneven rectangle: a carved stone's edge, printed by hand (fixed, so every frame is the same)
  const pts = [], jit = [0.6, -0.4, 0.3, -0.7, 0.5, -0.2, 0.7, -0.5, 0.2, -0.6, 0.4, -0.3];
  const W = 56, H = 104, r = 5, n = 3;
  const side = (x0, y0, x1, y1, j) => { for (let i = 0; i < n; i++) { const u = i / n; pts.push([x0 + (x1 - x0) * u + (y1 - y0 ? jit[(j + i) % 12] : 0), y0 + (y1 - y0) * u + (x1 - x0 ? jit[(j + i + 5) % 12] : 0)]); } };
  side(r, 0, W - r, 0, 0); side(W, r, W, H - r, 3); side(W - r, H, r, H, 6); side(0, H - r, 0, r, 9);
  return 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' L') + ' Z';
}
const EDGE = sealEdge();
export function Seal({id, className = ''}) {
  const glyph = (c, dy) => seal[c].map((s, i) => <polyline key={c + i} points={s.map((v, j) => (j % 2 ? dy + 6 + v * 4.4 : 6 + v * 4.4).toFixed(2)).join(' ')} />);
  return <svg id={id} className={'seal ' + className} viewBox="-2 -2 60 108" width="60" height="108" aria-label="東京">
    <path d={EDGE} fill={SEAL_RED} />
    <g fill="none" stroke="#F6F1E4" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">{glyph('東', 0)}{glyph('京', 47)}</g>
  </svg>;
}
