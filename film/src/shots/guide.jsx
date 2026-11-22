import React from 'react';
import {shot, onDrive} from '../engine.js';
import {Cursor, paintCursor} from '../kit/cursor.jsx';
import {Label, writeLabel, cut} from './common.jsx';
import clip from '../../public/clips/guide.json';

// The real Beijing page and its guide overlay, captured frame by frame on a controlled clock by
// tools/capture-guide.mjs (real clicks on the guidebook; the page's own glides, fades and red pen).
const pad = n => String(n).padStart(4, '0');
const [place, look] = clip.events;                       // {frame, x, y} in film px
const T = f => f / clip.fps;
const S0 = T(clip.scroll.from), S1 = T(clip.scroll.to);
// the pointer: in from the map, onto "The Hutongs", over the panel while it scrolls, onto the dumplings
const KEYS = [
  {at: T(place.frame) - 0.9, x: 1180, y: 780}, {at: T(place.frame) - 0.1, x: place.x, y: place.y},
  {at: S0 - 0.1, x: place.x, y: place.y}, {at: S0 + 0.25, x: 1640, y: 760}, {at: S1, x: 1640, y: 760},
  {at: T(look.frame) - 0.1, x: look.x, y: look.y},
];
const CLICKS = [T(place.frame), T(look.frame)];

export function GuideView() {
  return <div className="guide">
    <img id="guide-img" className="full" alt="" />
    <Cursor id="guide" color="#2C271C" stroke="#F8F5EE" />
    <Label id="lb-guide" name="Every place has a story." note="open one, and the map takes you there" tone="tomato" seed="label-guide" />
  </div>;
}

export function buildGuide(tl) {
  const s = shot('guide'), dur = s.end - s.start;
  onDrive('guide', async l => {
    const cur = document.querySelector('[data-cursor="guide"]');
    paintCursor(cur, l, KEYS, CLICKS, [KEYS[0].at, T(look.frame) + 1.3]);
    if (l < 0 || l > dur) return;
    const img = document.getElementById('guide-img'), src = `clips/guide/${pad(Math.min(clip.frames - 1, Math.max(0, Math.floor(l * clip.fps + 1e-6))))}.jpg`;
    if (img.getAttribute('src') !== src) { img.setAttribute('src', src); await img.decode(); }
  });
  cut(tl, s);
  const at = s.start + T(place.frame) + 0.45;             // once the story is on the page
  tl.fromTo('#lb-guide', {opacity: 0, y: 14}, {opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', immediateRender: true}, at);
  writeLabel(tl, 'lb-guide', at + 0.05);
}
