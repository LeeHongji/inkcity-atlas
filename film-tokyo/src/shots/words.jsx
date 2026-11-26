import React from 'react';
import {Lettering} from '@/components/ui/lettering';
import {stamp, lift, Seal} from './common.jsx';
import {WIPES, SEASONS} from './tokyo.jsx';
import {WIPE_S} from '../city.js';

/* The film's few words, over every shot: one big word in the Looseleaf hand and one short line, ink on a paper halo.
   They are stamped on, as a hanko lands; the title and the end card carry the red seal. Times are film seconds. */
export const WORDS = [
  {id: 'w-title', big: 'Tokyo, redrawn.', seal: true, at: 0.8, sealAt: 1.1, out: 5.3},
  {id: 'w-tall', big: 'Taller.', line: 'landmarks drawn from the real buildings', at: 5.7, lineAt: 6.0, out: 9.6, cut: true},
  {id: 'w-fine', big: 'Finer.', line: 'real Japanese on every sign', at: 9.65, lineAt: 9.95, out: 12.0, cut: true},
  {id: 'w-alive', big: 'Alive.', line: 'everyone is doing something', at: 12.05, lineAt: 12.35, out: 18.0, cut: true},
  {id: 'w-year', big: 'All year.', at: 18.05, out: 24.6, cut: true},
];
// the season's name under "All year.", changed when the brush is half way across
export const SEASON_AT = [18.35, ...WIPES.map((w) => w + WIPE_S / 2)];

export function WordsView() {
  return <div className="words">
    {WORDS.map((w) => <div key={w.id} className="wd" id={w.id}>
      <div className="wd-head">
        <Lettering as="div" tone="tomato" wobble={0.6} seed={w.id} className="wd-big" id={w.id + '-big'}>{w.big}</Lettering>
        {w.seal ? <Seal id={w.id + '-seal'} className="wd-seal" /> : null}
      </div>
      {w.line ? <p className="wd-line" id={w.id + '-line'}>{w.line}</p> : null}
      {w.id === 'w-year' ? <div className="wd-seasons">{SEASONS.map((s) => <p key={s} className="wd-line wd-season" id={'w-year-' + s}>{s}</p>)}</div> : null}
    </div>)}
  </div>;
}

export function buildWords(tl) {
  for (const w of WORDS) {
    tl.set('#' + w.id, {opacity: 1}, 0);
    stamp(tl, `#${w.id}-big`, w.at);
    if (w.seal) stamp(tl, `#${w.id}-seal`, w.sealAt);
    if (w.line) tl.fromTo(`#${w.id}-line`, {opacity: 0, y: 8}, {opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', immediateRender: true}, w.lineAt);
    if (w.cut) tl.set('#' + w.id, {opacity: 0}, w.out);          // gone on the cut
    else lift(tl, '#' + w.id, w.out);
  }
  SEASONS.forEach((s, i) => {
    stamp(tl, '#w-year-' + s, SEASON_AT[i]);
    if (i < 3) tl.set('#w-year-' + s, {opacity: 0}, SEASON_AT[i + 1]);
  });
}

/* The end card, over the whole city in the snow: the city's name with its seal, the atlas, the address. */
export function EndView() {
  return <div className="end">
    <div className="end-card">
    <div className="end-head">
      <Lettering as="div" tone="tomato" wobble={0.6} seed="end" className="end-name" id="end-name">Tokyo</Lettering>
      <Seal id="end-seal" className="end-seal" />
    </div>
    <p className="end-atlas" id="end-atlas">an inkcity Atlas city</p>
    <p className="end-url" id="end-url">leehongji.github.io/inkcity-atlas</p>
    </div>
  </div>;
}
export function buildEnd(tl, s) {
  stamp(tl, '#end-name', s.start + 0.1);
  stamp(tl, '#end-seal', s.start + 0.4);
  tl.fromTo('#end-atlas', {opacity: 0, y: 8}, {opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', immediateRender: true}, s.start + 0.7);
  tl.fromTo('#end-url', {opacity: 0, y: 8}, {opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', immediateRender: true}, s.start + 1.0);
}
