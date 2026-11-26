// plan.json shot id -> view + builder.
import {shot} from '../engine.js';
import {key, WIPE_S} from '../city.js';
import {cut} from './common.jsx';
import {OpenView, buildOpen, DiveView, buildDive, SPOTS, spotView, spotBuilder, SeasonsView, buildSeasons, CloseView, buildClose, seasonAt, SEASONS, WIPES} from './tokyo.jsx';
import {EndView, buildEnd, buildWords} from './words.jsx';

export const SHOT_VIEWS = {open: OpenView, dive: DiveView, seasons: SeasonsView, close: CloseView, end: EndView};
export const SHOT_BUILDERS = {open: buildOpen, dive: buildDive};
SPOTS.forEach((m) => { SHOT_VIEWS[m.id] = spotView(m); SHOT_BUILDERS[m.id] = spotBuilder(m); });
Object.assign(SHOT_BUILDERS, {seasons: buildSeasons, close: buildClose, end: (tl) => { const s = shot('end'); cut(tl, s); buildEnd(tl, s); }, words: buildWords});

// which real pages each shot draws from (the rest are unloaded as the film moves on): at most two Tokyos at once
export const PAGES = {open: [key('spring')], dive: [key('spring')], close: [key('winter')], end: [key('winter')]};
SPOTS.forEach((m) => { PAGES[m.id] = [key('spring')]; });
export const pagesAt = (id, t) => {
  if (id !== 'seasons') return PAGES[id] || [];
  const i = seasonAt(t), keep = [SEASONS[i]];
  if (i > 0 && t - WIPES[i - 1] < WIPE_S + 0.1) keep.push(SEASONS[i - 1]);   // the old season, while the brush still shows it
  return keep.map(key);
};
