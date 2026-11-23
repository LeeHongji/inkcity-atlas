import React from 'react';
import {shot} from '../engine.js';
import {Lettering} from '@/components/ui/lettering';
import {cut, glowOn, KeyN} from './common.jsx';

// The end card, over the twelve dimmed at night.
export function EndView() {
  return <div className="end">
    <div className="end-card">
      <Lettering as="div" tone="marker" wobble={0.6} seed="title" className="end-name" id="end-name">inkcity Atlas</Lettering>
      <p className="end-press night-note" id="end-press">press <KeyN id="end-key" seed="key-n-3" /> for night</p>
      <p className="end-url" id="end-url">leehongji.github.io/inkcity-atlas</p>
    </div>
  </div>;
}

export function buildEnd(tl) {
  const s = shot('end');
  cut(tl, s);
  tl.to('#gr-tiles', {opacity: 0.18, duration: 0.6, ease: 'power2.inOut'}, s.start);
  tl.to('#gr-head', {opacity: 0, duration: 0.3}, s.start);
  glowOn(tl, '#end-name', s.start + 0.15);
  glowOn(tl, '#end-press', s.start + 0.6);
  glowOn(tl, '#end-url', s.start + 0.9);
}
