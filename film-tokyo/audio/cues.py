"""Writes plan.json's sound cues and their action beats. Times come from the shot code:
- the opening starts on the page's Shibuya shot, whose green man comes on 0.3 s in (cities/tokyo/src/tiles/shibuya.js);
  the pull-backs and the dive are PULL_T, the dive shot and CLOSE_T in src/shots/tokyo.jsx;
- the words (src/shots/words.jsx) land 0.11 s after their stamp starts; the cuts are the shot boundaries;
- the season wipes start at WIPES and last 1.3 s (the page's WIPE_S).
syncOffset is each file's audible onset (scripts/sfx_landmarks.py).
Usage: python3 audio/cues.py   (then run mix_audio.py)
"""
import json
from pathlib import Path

FILM = Path(__file__).resolve().parent.parent
plan = json.loads((FILM / 'plan.json').read_text())
S = {s['id']: s for s in plan['shots']}
WIPES = [18.6, 20.4, 22.2]
LAND = 0.11
ON = {'cuckoo': 0.004, 'stamp': 0.001, 'dive': 0.527, 'pullback': 0.483, 'pullback-short': 0.288, 'brush': 0.2,
      **{f'tick-{i}': 0.001 for i in range(4)}}   # measured by sfx_landmarks.py
actions = {k: [] for k in S}; cues = []

def shot_at(t):
    return next(s for s in plan['shots'] if s['start'] <= t < s['end'])
def cue(t, aid, f, gain, what, req=True, duck=None):
    s = shot_at(t)
    actions[s['id']].append({'id': aid, 'at': round(t - s['start'], 3), 'action': what, 'soundRequired': req})
    c = {'at': round(t - ON[f], 3), 'syncOffset': ON[f], 'actionId': aid, 'file': f'assets/sfx/{f}.wav', 'gain': gain, 'role': 'sfx', 'kind': f}
    if duck: c['duck'] = duck
    cues.append(c)

SOFT = lambda h: {'db': 2, 'attack': 0.04, 'hold': h, 'release': 0.25}
# 1 · the scramble: the green man comes on 0.3 s in and the crossing calls; the title; the pull-back
for i, (t, g) in enumerate([(0.3, 1.0), (1.1, 0.7), (1.9, 0.45), (2.7, 0.25)]):
    cue(t, f'crossing-{i + 1}', 'cuckoo', g, f'The scramble crossing calls (call {i + 1}), fainter as the camera pulls back', i == 0)
cue(0.8 + LAND, 'title', 'stamp', 1.4, '"Tokyo, redrawn." is stamped on', True, SOFT(0.15))
cue(1.1 + LAND, 'title-seal', 'stamp', 1.0, 'The red 東京 seal is stamped beside it', True)
cue(1.2, 'pull-back', 'pullback', 1.0, 'The camera pulls back from the scramble to the whole city', True)
# 2 · the dive and the landmarks
cue(4.8, 'dive', 'dive', 1.0, 'The camera dives from the whole map into Tokyo Tower', True)
cue(5.7 + LAND, 'taller', 'stamp', 1.3, '"Taller." is stamped on', True, SOFT(0.15))
# the cuts
for i, t in enumerate([7.2, 8.4, 10.8, 13.2, 14.4, 15.6, 16.8]):
    cue(t, f'cut-{shot_at(t)["id"]}', f'tick-{i % 4}', 0.9, f'Hard cut to {shot_at(t)["id"]}', True)
cue(9.65 + LAND, 'finer', 'stamp', 1.3, 'Cut to Tsukiji; "Finer." is stamped on', True, SOFT(0.15))
cue(12.05 + LAND, 'alive', 'stamp', 1.3, 'Cut to the sumo; "Alive." is stamped on', True, SOFT(0.15))
# 5 · the year
cue(18.05 + LAND, 'all-year', 'stamp', 1.3, 'Cut to the Sumida; "All year." is stamped on', True, SOFT(0.15))
for i, w in enumerate(WIPES):
    cue(w, f'wipe-{i + 1}', 'brush', 1.0, f'The next season is brushed on ({["summer", "autumn", "winter"][i]})', True)
for i, (t, name) in enumerate(zip([18.35, 19.25, 21.05, 22.85], ['spring', 'summer', 'autumn', 'winter'])):
    cue(t + LAND, f'season-{name}', 'stamp', 0.55, f'"{name}" is stamped under the words', False)
# 6 · back out to the whole city in the snow
cue(24.6, 'close-out', 'pullback-short', 1.0, 'The camera pulls back to the whole city in the snow', True)
# 7 · the end card
cue(26.5 + LAND, 'end-name', 'stamp', 1.4, '"Tokyo" is stamped on the end card', True, SOFT(0.3))
cue(26.8 + LAND, 'end-seal', 'stamp', 1.0, 'The 東京 seal is stamped beside it', True)

for k, s in S.items(): s['actions'] = sorted(actions[k], key=lambda a: a['at'])
plan['audio']['cues'] = sorted(cues, key=lambda c: c['at'])
(FILM / 'plan.json').write_text(json.dumps(plan, ensure_ascii=False, indent=2))
print(len(cues), 'cues')
