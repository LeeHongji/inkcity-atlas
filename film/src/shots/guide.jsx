import React from 'react';
import {shot, onDrive} from '../engine.js';
import {Cursor, paintCursor} from '../kit/cursor.jsx';
import {Label, writeLabel, cut} from './common.jsx';
import wide from '../../public/clips/guide.json';
import square from '../../public/clips/guide-sq.json';
import {SQ} from '../format.js';

// The real Beijing page and its guide overlay, captured frame by frame on a controlled clock by
// tools/capture-guide.mjs (real clicks on the guidebook; the page's own glides, fades and red pen).
// The square cut records the page in a 864 x 748 window (1080 x 935) and sets it under a strip of paper for the caption.
const clip = SQ ? square : wide, DIR = SQ ? 'clips/guide-sq' : 'clips/guide', TOP = SQ ? 1080 - clip.size[1] : 0;
const pad = n => String(n).padStart(4, '0');
const [place, look] = clip.events.map(e => ({...e, y: e.y + TOP}));   // {frame, x, y} in film px
const T = f => f / clip.fps;
const S0 = T(clip.scroll.from), S1 = T(clip.scroll.to);
// the pointer: in from the map, onto "The Hutongs", over the panel while it scrolls, onto the dumplings
const [MAP, PANEL] = SQ ? [[430, TOP + 600], [870, TOP + 560]] : [[1180, 780], [1640, 760]];
const KEYS = [
  {at: T(place.frame) - 0.9, x: MAP[0], y: MAP[1]}, {at: T(place.frame) - 0.1, x: place.x, y: place.y},
  {at: S0 - 0.1, x: place.x, y: place.y}, {at: S0 + 0.25, x: PANEL[0], y: PANEL[1]}, {at: S1, x: PANEL[0], y: PANEL[1]},
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
    const img = document.getElementById('guide-img'), src = `${DIR}/${pad(Math.min(clip.frames - 1, Math.max(0, Math.floor(l * clip.fps + 1e-6))))}.jpg`;
    if (img.getAttribute('src') !== src) { img.setAttribute('src', src); await img.decode(); }
  });
  cut(tl, s);
  const at = s.start + T(place.frame) + 0.45;             // once the story is on the page
  tl.fromTo('#lb-guide', {opacity: 0, y: 14}, {opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', immediateRender: true}, at);
  writeLabel(tl, 'lb-guide', at + 0.05);
}
