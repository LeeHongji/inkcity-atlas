// plan.json shot id -> view + builder.
import {OpenView, buildOpen} from './open.jsx';
import {MOMENTS, momentView, momentBuilder} from './moments.jsx';
import {GuideView, buildGuide} from './guide.jsx';
import {TwelveView, buildTwelve} from './twelve.jsx';
import {SkillView, buildSkill, EndView, buildEnd} from './skill.jsx';

export const SHOT_VIEWS = {open: OpenView, guide: GuideView, twelve: TwelveView, skill: SkillView, end: EndView};
export const SHOT_BUILDERS = {open: buildOpen};
MOMENTS.forEach((m, i) => { SHOT_VIEWS[m.id] = momentView(m); SHOT_BUILDERS[m.id] = momentBuilder(m, i === 0); });
Object.assign(SHOT_BUILDERS, {guide: buildGuide, twelve: buildTwelve, skill: buildSkill, end: buildEnd});

// which real pages each shot draws from (the rest are unloaded as the film moves on)
export const PAGES = {open: ['tokyo'], guide: [], twelve: [], skill: ['starter'], end: ['starter']};
MOMENTS.forEach(m => { PAGES[m.id] = [m.slug]; });
