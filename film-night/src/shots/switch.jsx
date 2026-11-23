import React from 'react';
import {shot, onDrive} from '../engine.js';
import {paint} from '../city.js';
import {Lettering} from '@/components/ui/lettering';
import {cut, glowOn, press, KeyN, smooth} from './common.jsx';

// Tokyo at a middle view: the station, Shibuya's screen, the tower: lamps all across the square for the wave to cross.
const CAM = {z: 1.5, cx: 820, cy: 400};
const N0 = 1250;                 // the city's own film frame at the shot's start (alive, well before its ending)
export const PRESS = 1.875;      // beat 4: the key goes down and the night begins
const SLOW = 0.7;                // the page's light-up clock, slowed so the eye can follow the wave
export const lightAt = (l) => (l - PRESS) * SLOW;

export function SwitchView() {
  return <div className="sw">
    <canvas id="sw-cv" className="full" width="1080" height="1080" />
    <div className="sw-title" id="sw-title">
      <div className="sw-press"><Lettering as="span" tone="marker" wobble={0.6} seed="press" className="sw-l">Press</Lettering><KeyN id="sw-key" /></div>
      <p className="sw-line night-note" id="sw-line">and the city<br/>turns to night.</p>
    </div>
    <img id="poster" className="full" src="poster.png" alt="" />
  </div>;
}

export function buildSwitch(tl) {
  const s = shot('switch'), dur = s.end - s.start;
  onDrive('switch', async (l) => {
    if (l < 0 || l > dur) return;
    const n = N0 + l * 30, ctx = document.getElementById('sw-cv').getContext('2d');
    if (l < PRESS) return paint('tokyo', n, CAM, ctx);
    const lt = lightAt(l);
    await paint('tokyo', n, CAM, ctx, {night: true, lightT: lt});
    const a = 1 - smooth((lt - 0.12) / 0.95);                 // the day's last frame fading off, as the page does it
    if (a > 0.003) await paint('tokyo', n, CAM, ctx, {alpha: a});
  });
  cut(tl, s);
  // the first frames are the finished night, for the thumbnail; then the day
  tl.fromTo('#poster', {opacity: 1}, {opacity: 0, duration: 0.3, ease: 'none', immediateRender: true}, 0.3);
  tl.fromTo('#sw-title', {opacity: 0, y: 8}, {opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', immediateRender: true}, 0.65);
  press(tl, '#sw-key', PRESS);
  // the words turn to pale ink with a dark halo, as the guide's notes do at night. They turn quickly, while the paper is
  // still light, so that ink, halo and paper never pass through the same grey together; the dark halo carries them after
  tl.fromTo('#sw-title', {'--cap': '#2C271C', '--halo': 'rgba(240,238,228,0.95)'}, {'--cap': '#ECE5D5', '--halo': 'rgba(24,28,46,0.95)', duration: 0.3, ease: 'power1.inOut', immediateRender: true}, PRESS + 0.1);
  glowOn(tl, '#sw-line', 3.75);
}
