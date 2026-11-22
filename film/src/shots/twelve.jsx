import React from 'react';
import {shot, onDrive} from '../engine.js';
import clip from '../../public/clips/twelve.json';
import {CITIES} from '@/cities';
import {Desk} from '@/components/ui/desk';
import {Polaroid, PolaroidImage, PolaroidCaption} from '@/components/ui/polaroid';
import {Lettering} from '@/components/ui/lettering';
import {W, write, cut} from './common.jsx';

// The gallery's desk and Polaroids (gallery-src/src/App.tsx). Each photo is its city page drawing itself, all on the
// same frame: drawn ahead of time by tools/capture-twelve.mjs (twelve live engines in one tab run out of memory).
const TAPES = ['washi-stripes', 'masking', 'washi-dots', 'kraft', 'washi-gingham', 'masking'];
const TILTS = [-1.6, 1.1, -0.6, 1.5, -1.2, 0.7, -1.4, 0.9, -0.8, 1.3, -1.0, 0.6];
const DROP = 0.15;                                         // one Polaroid per sixteenth note (100 BPM); each lands 0.2 s after it starts falling
const pad = n => String(n).padStart(4, '0');

export function TwelveView() {
  return <Desk className="desk-full" seed="atlas-desk" objects={['pencil']}>
    <div className="twelve-head">
      <Lettering as="h2" tone="sky" wobble={0.5} seed="twelve" className="tw-h"><W id="tw-a">Twelve cities.</W></Lettering>
      <p className="tw-note"><W id="tw-b">each one a single page</W><br /><W id="tw-c">that works offline</W></p>
    </div>
    <ol className="twelve-grid">
      {CITIES.map((c, i) => <li key={c.slug} className="tw-cell" id={'tw-' + i}>
        <div style={{rotate: `${TILTS[i]}deg`}}>
          <Polaroid tape="top" tapeKind={TAPES[i % TAPES.length]} seed={`atlas-${c.slug}`} className="tw-polaroid">
            <PolaroidImage date={`No. ${String(i + 1).padStart(2, '0')}`} className="tw-img" seed={c.slug}>
              <img id={'tw-img-' + i} alt="" width={clip.size[0]} height={clip.size[1]} />
            </PolaroidImage>
            <PolaroidCaption className="tw-cap">
              <span>{c.name}</span>
            </PolaroidCaption>
          </Polaroid>
        </div>
      </li>)}
    </ol>
  </Desk>;
}

export function buildTwelve(tl) {
  const s = shot('twelve'), dur = s.end - s.start;
  onDrive('twelve', async l => {
    if (l < -0.2 || l > dur) return;
    const f = pad(Math.min(clip.frames - 1, Math.max(0, Math.floor(l * clip.fps + 1e-6))));
    await Promise.all(CITIES.map((c, i) => {
      const img = document.getElementById('tw-img-' + i), src = `clips/twelve/${c.slug}/${f}.jpg`;
      if (img.getAttribute('src') === src) return null;
      img.setAttribute('src', src); return img.decode();
    }));
  });
  cut(tl, s);
  CITIES.forEach((c, i) => {                               // each one dropped onto the desk: in fast, lands flat
    const at = s.start + 0.1 + i * DROP;                    // lands at s.start + 0.3 + i * DROP, on the sixteenths
    tl.fromTo('#tw-' + i, {opacity: 0}, {opacity: 1, duration: 0.05, ease: 'none', immediateRender: true}, at);
    tl.fromTo('#tw-' + i, {y: -70, scale: 1.1}, {y: 0, scale: 1, duration: 0.2, ease: 'power2.in', immediateRender: true}, at);
  });
  let t = write(tl, '#tw-a', s.start + 2.0, 16);
  t = write(tl, '#tw-b', t + 0.1, 30);
  write(tl, '#tw-c', t + 0.02, 30);
}
