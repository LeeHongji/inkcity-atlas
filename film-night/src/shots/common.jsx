import React from 'react';
import {Lettering} from '@/components/ui/lettering';
import {Kbd} from '@/components/ui/kbd';

export const smooth = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };

/** Cut in at a shot's start and out at its end (the product's own grammar: hard cuts). */
export function cut(tl, s, from = s.start, to = s.end) {
  const el = `section[data-shot="${s.id}"]`;
  if (from > 0) tl.set(el, {opacity: 1, visibility: 'visible'}, from); else Object.assign(document.querySelector(el).style, {opacity: '1', visibility: 'visible'});
  tl.set(el, {opacity: 0, visibility: 'hidden'}, to);
}

/** Words that come on like a lamp: up in 0.35 s with a warm bloom that settles (the night's captions glow, they are not written). */
export function glowOn(tl, sel, at) {
  tl.fromTo(sel, {opacity: 0, '--bloom': 1}, {opacity: 1, duration: 0.35, ease: 'power2.out', immediateRender: true}, at);
  tl.fromTo(sel, {'--bloom': 1}, {'--bloom': 0, duration: 0.9, ease: 'power2.out', immediateRender: false}, at + 0.2);
}

/** The keycap: a press on the beat (its real pressed state, and the travel drawn a little larger for the film). */
export function press(tl, sel, at) {
  tl.set(`${sel} kbd`, {attr: {'data-pressed': 'true'}}, at);
  tl.fromTo(sel, {y: 0}, {y: 7, duration: 0.07, ease: 'power2.in', immediateRender: false}, at);
  tl.to(sel, {y: 0, duration: 0.22, ease: 'power2.out'}, at + 0.12);
  tl.set(`${sel} kbd`, {attr: {'data-pressed': 'false'}}, at + 0.12);
}

/** The Looseleaf keycap "N", drawn at film scale. */
export function KeyN({id, seed = 'key-n'}) {
  return <span className="key-wrap" id={id}><Kbd seed={seed} className="key-n">N</Kbd></span>;
}

/** A city's name in pale lettering, as the guide writes at night. */
export function Name({id, name, tone = 'marker', note}) {
  return <div className="name-wrap" id={id}>
    <Lettering as="div" tone={tone} wobble={0.5} seed={'nm-' + id} className="name-l">{name}</Lettering>
    {note ? <div className="name-note" id={id + '-note'}>{note}</div> : null}
  </div>;
}
