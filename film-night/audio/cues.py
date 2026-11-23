"""Writes plan.json's sound cues and their action beats. Times come from the shot code: the key goes down at
PRESS = 1.875 (switch.jsx) and at grid start + 0.625 (grid.jsx); the lamps' wave runs from about 2.03 s at 0.7x the
page's speed; the twelve turn at press + waveAt(i); captions glow on at the times in the shot builders.
syncOffset is each file's audible onset (scripts/sfx_landmarks.py).
Usage: python3 audio/cues.py   (then run mix_audio.py)
"""
import json, math
from pathlib import Path

FILM = Path(__file__).resolve().parent.parent
plan = json.loads((FILM / 'plan.json').read_text())
S = {s['id']: s for s in plan['shots']}
ON = {'key': 0.001, 'drop': 0.032, 'shimmer': 0.08, **{f'tink-{i}': 0.001 for i in range(8)}, **{f'light-{i}': 0.001 for i in range(4)}}
actions = {k: [] for k in S}; cues = []

def cue(shot, aid, t, f, gain, what, req=True, duck=None):
    s = S[shot]
    actions[shot].append({'id': aid, 'at': round(t - s['start'], 3), 'action': what, 'soundRequired': req})
    c = {'at': round(t - ON[f], 3), 'syncOffset': ON[f], 'actionId': aid, 'file': f'assets/sfx/{f}.wav', 'gain': gain, 'role': 'sfx', 'kind': f}
    if duck: c['duck'] = duck
    cues.append(c)

SOFT = lambda h: {'db': 2, 'attack': 0.05, 'hold': h, 'release': 0.3}
# 1 · the switch
cue('switch', 'switch-press', 1.875, 'key', 1.5, 'The keycap N is pressed', True, SOFT(0.2))
cue('switch', 'switch-drop', 1.95, 'drop', 1.0, 'The day begins to fade', False)
for i in range(7):
    cue('switch', f'switch-lamps-{i + 1}', 2.03 + i * 0.3125, f'tink-{i}', 1.0 - 0.06 * i, f'Lamps come on, step {i + 1} of the wave from the middle', i == 0)
cue('switch', 'switch-line', 3.75, 'shimmer', 1.4, '"and the city turns to night." glows on', True)
# 2-13 · the cities
for i, sid in enumerate(['tokyo', 'paris', 'venice', 'newyork', 'london', 'chongqing', 'hongkong', 'istanbul', 'rio', 'beijing', 'barcelona', 'lisbon']):
    cue(sid, f'{sid}-cut', S[sid]['start'], f'light-{i % 4}', 1.0, f'Hard cut to {S[sid]["headlineEn"]} at night; its name glows on')
cue('tokyo', 'tokyo-note', 7.95, 'shimmer', 0.55, '"each city lit the way it is lit today" glows on', False)
# 14 · the twelve
press = S['grid']['start'] + 0.625
cue('grid', 'grid-press', press, 'key', 1.5, 'The keycap N is pressed again', True, SOFT(0.2))
waves = sorted(set(round(0.12 + 0.22 * math.hypot(c - 1, (r - 1.5) * 0.9), 2) for c in range(3) for r in range(4)))
for i, d in enumerate(waves[:8]):
    cue('grid', f'grid-wave-{i + 1}', press + d, f'tink-{min(7, i + 1)}', 0.9 - 0.05 * i, f'Tiles turn to night, ring {i + 1} from the middle', i == 0)
cue('grid', 'grid-title', S['grid']['start'] + 1.875, 'shimmer', 1.0, '"Twelve cities. One key." glows on', True)
# 15 · the end
cue('end', 'end-name', S['end']['start'] + 0.15, 'shimmer', 2.0, '"inkcity Atlas" glows on', True, {'db': 4, 'attack': 0.08, 'hold': 0.5, 'release': 0.6})
cue('end', 'end-press', S['end']['start'] + 0.6, 'light-1', 0.6, '"press N for night" glows on', False)

for k, s in S.items(): s['actions'] = actions[k]
plan['audio']['cues'] = sorted(cues, key=lambda c: c['at'])
(FILM / 'plan.json').write_text(json.dumps(plan, ensure_ascii=False, indent=2))
print(len(cues), 'cues;', 'grid wave', waves)
