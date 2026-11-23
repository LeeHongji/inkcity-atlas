import React from 'react';
import {shot, onDrive} from '../engine.js';
import {paint, shotCam} from '../city.js';
import {cut, glowOn, Name} from './common.jsx';

// Each city at night, at the camera of its own night signature (a shot of its own film script), from frame a + n.
// dz / dx / dy nudge that camera so the signature sits in the middle square.
export const NIGHTS = [
  {id: 'tokyo', slug: 'tokyo', shot: 'sumida', name: 'Tokyo', tone: 'tomato', n: 40, note: 'each city lit the way it is lit today'},
  {id: 'paris', slug: 'paris', shot: 'eiffel', name: 'Paris', tone: 'marker', n: 40},
  {id: 'venice', slug: 'venice', shot: 'sanmarco', name: 'Venice', tone: 'teal', n: 40},
  {id: 'newyork', slug: 'newyork', shot: 'times', name: 'New York', tone: 'sky', n: 40},
  {id: 'london', slug: 'london', shot: 'westminster', name: 'London', tone: 'tomato', n: 40},
  {id: 'chongqing', slug: 'chongqing', shot: 'hongyadong', name: 'Chongqing', tone: 'marker', n: 40},
  {id: 'hongkong', slug: 'hongkong', shot: 'central', name: 'Hong Kong', tone: 'sky', n: 40},
  {id: 'istanbul', slug: 'istanbul', shot: 'galata', name: 'Istanbul', tone: 'teal', n: 40},
  {id: 'rio', slug: 'rio', shot: 'sambodromo', name: 'Rio de Janeiro', tone: 'grass', n: 40},
  {id: 'beijing', slug: 'beijing', shot: 'gugong', name: 'Beijing', tone: 'tomato', n: 40},
  {id: 'barcelona', slug: 'barcelona', shot: 'montjuic', name: 'Barcelona', tone: 'tangerine', n: 40},
  {id: 'lisbon', slug: 'lisbon', shot: 'arraial', name: 'Lisbon', tone: 'marker', n: 40},
];

export function nightView(m) {
  return function NightView() {
    return <div className="night">
      <canvas id={'cv-' + m.id} className="full" width="1080" height="1080" />
      <Name id={'nm-' + m.id} name={m.name} tone={m.tone} note={m.note} />
    </div>;
  };
}

export function nightBuilder(m) {
  return async (tl) => {
    const s = shot(m.id), dur = s.end - s.start, c = await shotCam(m.slug, m.shot, true);
    const cam = {z: c.z * (m.dz || 1), cx: c.cx + (m.dx || 0), cy: c.cy + (m.dy || 0)}, n0 = c.a + m.n;
    onDrive(m.id, (l) => (l < 0 || l > dur) ? null : paint(m.slug, n0 + l * 30, cam, document.getElementById('cv-' + m.id).getContext('2d'), {night: true}));
    cut(tl, s);
    glowOn(tl, '#nm-' + m.id, s.start + 0.04);
    if (m.note) glowOn(tl, '#nm-' + m.id + '-note', s.start + 0.45);
  };
}
