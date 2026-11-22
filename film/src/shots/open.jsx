import React from 'react';
import {shot, onDrive} from '../engine.js';
import {paint} from '../city.js';
import {Highlight} from '@/components/ui/highlight';
import {Lettering} from '@/components/ui/lettering';
import {W, write, cut} from './common.jsx';
import {SQ, FW, FH} from '../format.js';

// Tokyo whole, set right of centre so the title has blank paper on the left.
// Square: the title takes the empty top-left corner of the diamond, the city sits low and right.
const CAM = SQ ? {z: 0.53, cx: 945, cy: 313} : {z: 0.62, cx: 560, cy: 548};
// Film frames: the build (0..175) over 0.3..3.9 s, then life at 1x.
const B0 = 0.3, B1 = 3.9, NB = 175;
export const openFrame = l => l < B0 ? 0 : l < B1 ? (l - B0) / (B1 - B0) * NB : NB + (l - B1) * 30;

export function OpenView() {
  return <div className="open">
    <canvas id="open-cv" className="full" width={FW} height={FH} />
    <div className="open-title">
      <Lettering as="h1" tone="marker" wobble={0.6} seed="title" className="ot-name"><W id="ot-a">inkcity</W><br /><W id="ot-b">Atlas</W></Lettering>
      <p className="ot-sub"><W id="ot-c">twelve cities,</W><br />
        <span className="ot-hl" id="ot-hl"><Highlight tone="yellow" weight="heavy" seed="drawn-alive">drawn alive.</Highlight></span></p>
    </div>
    <img id="poster" className="full" src={SQ ? 'poster-sq.png' : 'poster.png'} alt="" />
  </div>;
}

export function buildOpen(tl) {
  const s = shot('open'), dur = s.end - s.start;
  onDrive('open', l => (l < 0 || l > dur) ? null : paint('tokyo', openFrame(l), CAM, document.getElementById('open-cv').getContext('2d')));
  cut(tl, s);
  // the first frames are the finished opening, for thumbnails; then the film starts from blank paper
  tl.fromTo('#poster', {opacity: 1}, {opacity: 0, duration: 0.3, ease: 'none', immediateRender: true}, 0.3);
  let t = write(tl, '#ot-a', 0.9, 12);
  t = write(tl, '#ot-b', t + 0.02, 12);
  t = write(tl, '#ot-c', t + 0.15, 22);
  write(tl, '#ot-hl', t + 0.05, 20);
}
