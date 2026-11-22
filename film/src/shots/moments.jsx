import React from 'react';
import {shot, onDrive} from '../engine.js';
import {paint} from '../city.js';
import {CITIES} from '@/cities';
import {Label, writeLabel, cut} from './common.jsx';
import {SQ, FW, FH} from '../format.js';

// Each city's clever moment, at the page's own camera for it (copied from SHOTS in cities/<slug>/src/35_scene.js),
// between two film frames of its own script.
// `build`: the shot opens on the engine's build at that camera (pen lines, then colour), then the people arrive.
export const MOMENTS = [
  {id: 'tokyo', slug: 'tokyo', shot: 'shibuya', cam: {z: 3.36, cx: 960, cy: 560}, from: 1140, to: 1230, note: 'the scramble crossing', tone: 'tomato'},
  {id: 'paris', slug: 'paris', shot: 'etoile', cam: {z: 3.36, cx: 1252, cy: 438}, from: 1128, to: 1200, note: 'round the Arc, never touching', tone: 'sky'},
  {id: 'london', slug: 'london', shot: 'tbridge', cam: {z: 3.44, cx: 975, cy: 712}, from: 1296, to: 1440, note: 'Tower Bridge lifts', tone: 'tomato'},
  {id: 'venice', slug: 'venice', shot: 'sanmarco', cam: {z: 3.36, cx: 1252, cy: 740}, from: 1185, to: 1290, note: 'acqua alta', tone: 'teal'},
  {id: 'barcelona', slug: 'barcelona', shot: 'gotic', cam: {z: 3.4, cx: 1252, cy: 700}, build: {dur: 0.9, from: 44, to: 108}, from: 1180, to: 1290, note: 'a human tower', tone: 'tangerine'},
  {id: 'chongqing', slug: 'chongqing', shot: 'liziba', cam: {z: 3.05, cx: 1575, cy: 505}, from: 430, to: 550, note: 'through the building', tone: 'grass',
    sq: {z: 3.05, cx: 1626, cy: 578}},   // square: the train and the tower it runs through, clear of the label
];

// the square cut frames each moment with its own camera (sq), centred on what happens
const camOf = m => (SQ && m.sq) || m.cam;

export function momentFrame(m, l, dur) {
  if (m.build && l < m.build.dur) return m.build.from + (m.build.to - m.build.from) * (l / m.build.dur);
  const a = m.build ? m.build.dur : 0;
  return m.from + (m.to - m.from) * Math.min(1, Math.max(0, (l - a) / (dur - a)));
}

export function momentView(m) {
  const c = CITIES.find(c => c.slug === m.slug);
  return function MomentView() {
    return <div className="moment">
      <canvas id={'cv-' + m.id} className="full" width={FW} height={FH} />
      <Label id={'lb-' + m.id} name={c.name} note={m.note} tone={m.tone} seed={'label-' + m.id} />
    </div>;
  };
}

export function momentBuilder(m, first) {
  return tl => {
    const s = shot(m.id), dur = s.end - s.start, cam = camOf(m);
    onDrive(m.id, l => (l < 0 || l > dur) ? null : paint(m.slug, momentFrame(m, l, dur), cam, document.getElementById('cv-' + m.id).getContext('2d')));
    cut(tl, s);
    if (first) tl.fromTo('#lb-' + m.id, {scale: 1.06, rotate: -3, opacity: 0}, {scale: 1, rotate: 0, opacity: 1, duration: 0.22, ease: 'power2.out', immediateRender: true}, s.start);
    writeLabel(tl, 'lb-' + m.id, s.start + (m.build ? 0.15 : 0.05));
  };
}
