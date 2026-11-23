// plan.json shot id -> view + builder.
import {SwitchView, buildSwitch} from './switch.jsx';
import {NIGHTS, nightView, nightBuilder} from './nights.jsx';
import {GridView, buildGrid} from './grid.jsx';
import {EndView, buildEnd} from './end.jsx';
import {key} from '../city.js';

export const SHOT_VIEWS = {switch: SwitchView, grid: GridView, end: EndView};
export const SHOT_BUILDERS = {switch: buildSwitch};
NIGHTS.forEach((m) => { SHOT_VIEWS[m.id] = nightView(m); SHOT_BUILDERS[m.id] = nightBuilder(m); });
Object.assign(SHOT_BUILDERS, {grid: buildGrid, end: buildEnd});

// which real pages each shot draws from (the rest are unloaded as the film moves on)
export const PAGES = {switch: [key('tokyo', false), key('tokyo', true)], grid: [], end: []};
NIGHTS.forEach((m) => { PAGES[m.id] = [key(m.slug, true)]; });
