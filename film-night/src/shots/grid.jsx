import React from 'react';
import {shot, onRender} from '../engine.js';
import {cut, glowOn, press, KeyN} from './common.jsx';

// The twelve, each page's own wide view drawn by day and at night ahead of time with the paper taken out
// (tools/grid-images.mjs), three by four on one sheet. The key is pressed and they turn to night in a ring from the
// middle of the grid; the paper turns in the same ring, out to the edges of the frame.
export const CITIES = ['tokyo', 'paris', 'newyork', 'london', 'barcelona', 'venice', 'lisbon', 'istanbul', 'rio', 'beijing', 'hongkong', 'chongqing'];
export const GPRESS = 0.625;          // shot-local: the key goes down on the second beat
const cell = (i) => [i % 3, Math.floor(i / 3)];
const W0 = 0.12, WK = 0.22, FADE = 0.5;   // the ring: a place at distance d (in tiles) turns W0 + WK d after the press, over FADE
export const waveAt = (i) => { const [c, r] = cell(i); return W0 + WK * Math.hypot(c - 1, (r - 1.5) * 0.9); };   // seconds after the press
// distance units in pixels, from the tile pitch (330 across; 194 down, scaled by the 0.9 above); the grid's middle
const UX = 330, UY = 194 / 0.9, MX = 540, MY = 575;
const inOut = (x) => (x < 0.5 ? 2 * x * x : 1 - 2 * (1 - x) * (1 - x));     // GSAP's power1.inOut
// the night paper's mask at tau seconds after the press: opaque where the ring has passed, clear where it has not
function paperMask(tau) {
  const d0 = (tau - W0) / WK;                                // the ring's leading edge: nothing has turned beyond it
  if (d0 <= 0) return 'linear-gradient(transparent, transparent)';
  const stops = [];
  for (let k = 0; k <= 12; k++) { const d = (d0 * k) / 12, a = inOut(Math.min(1, Math.max(0, (tau - W0 - WK * d) / FADE))); stops.push(`rgba(0,0,0,${a.toFixed(4)}) ${((100 * k) / 12).toFixed(2)}%`); }
  return `radial-gradient(ellipse ${(UX * d0).toFixed(1)}px ${(UY * d0).toFixed(1)}px at ${MX}px ${MY}px, ${stops.join(', ')})`;
}

export function GridView() {
  return <div className="grid" id="gr-bg">
    <div className="gr-paper" id="gr-paper" />
    <div className="gr-head" id="gr-head"><KeyN id="gr-key" seed="key-n-2" /><span className="gr-title night-note" id="gr-title">Twelve cities. One key.</span></div>
    <ul className="gr-tiles" id="gr-tiles">
      {CITIES.map((c, i) => <li key={c} className="gr-tile">
        <img src={`clips/grid/${c}-day.png`} alt="" id={'gr-d' + i} />
        <img src={`clips/grid/${c}-night.png`} alt="" className="gr-night" id={'gr-n' + i} />
      </li>)}
    </ul>
  </div>;
}

export function buildGrid(tl) {
  const s = shot('grid'), at = s.start + GPRESS;
  cut(tl, s, s.start, 30);                                   // the twelve stay under the end card
  press(tl, '#gr-key', at);
  CITIES.forEach((c, i) => {
    tl.fromTo('#gr-n' + i, {opacity: 0}, {opacity: 1, duration: FADE, ease: 'power1.inOut', immediateRender: true}, at + waveAt(i));
    tl.set('#gr-d' + i, {opacity: 0}, at + waveAt(i) + FADE);   // the day underneath goes once the night covers it
  });
  // the paper's ring is set every frame (the timeline is seeked with its callbacks suppressed)
  onRender('grid', (l) => { const el = document.getElementById('gr-paper'), m = paperMask(Math.min(l - GPRESS, 1.6)); if (el) { el.style.maskImage = m; el.style.webkitMaskImage = m; } });
  glowOn(tl, '#gr-title', s.start + 1.875);   // once the ring has reached the top of the frame
}
