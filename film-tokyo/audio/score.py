"""Original score for "Tokyo, redrawn": 30 s, 100 BPM (a beat is 0.6 s, a bar 2.4 s), D major, in the manner of
Tokyo's own city pop: electric-piano sevenths and ninths, a round syncopated bass, a light kit, a soft synth lead.
The camera pulls back from the Shibuya scramble over two bars of piano alone; the groove comes in with the dive (4.8 s) on the city-pop turn
Gmaj9 | F#7 | Bm9 | Am9 D9; the lead takes the hook over the life and the seasons; the groove stops as the camera
pulls back (24.6 s) and the end card lands on Em9 - A7sus - Dmaj9. The crossing call, stamps, the dive, the cuts and the season wipes
are sound effects (sfx.py), placed on the picture by cues.py. Synthesised with numpy from a fixed seed: no samples.
Usage: python3 audio/score.py   -> assets/music.wav (48 kHz, 24-bit stereo)
"""
import numpy as np, wave
from pathlib import Path
from scipy.signal import butter, sosfilt, fftconvolve

SR, DUR, BEAT = 48000, 30.0, 0.6
BAR = 4 * BEAT
N = int(SR * DUR)
rng = np.random.default_rng(1126)
OUT = Path(__file__).resolve().parent.parent / 'assets' / 'music.wav'
bus = {k: np.zeros((2, N)) for k in ('ep', 'pad', 'bass', 'drums', 'lead', 'bell')}

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype='low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype='high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], btype='band', fs=SR, output='sos'), x)
def put(b, t, x, pan=0.0, gain=1.0):
    i = int(round(t * SR)); x = x[: max(0, N - i)]
    if i >= N or not len(x): return
    l, r = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
    bus[b][0, i:i + len(x)] += x * l * gain; bus[b][1, i:i + len(x)] += x * r * gain

def ep(m, dur, vel=1.0):
    """Electric piano: a warm sine body with a soft second partial, a short bell 'tine' on the attack, gentle tremolo."""
    n = int((dur + 0.9) * SR); k = np.arange(n) / SR; f = hz(m)
    body = np.sin(2 * np.pi * f * k) + 0.28 * np.sin(2 * np.pi * 2 * f * k) * np.exp(-k * 3) + 0.06 * np.sin(2 * np.pi * 3 * f * k) * np.exp(-k * 6)
    tine = 0.22 * vel * np.sin(2 * np.pi * f * 7.0 * k) * np.exp(-k / 0.03)
    env = np.minimum(1, k / 0.004) * np.exp(-k * (0.55 + f / 1400)) * np.clip((dur + 0.25 - k) / 0.25, 0, 1)
    trem = 1 + 0.06 * np.sin(2 * np.pi * 4.6 * k)
    return lp((body + tine) * env * trem, 5200) * vel

def bass(m, dur, vel=1.0):
    """Round bass: sine with a little filtered saw on the attack, short and bouncy."""
    n = int((dur + 0.08) * SR); k = np.arange(n) / SR; f = hz(m)
    saw = 2 * ((f * k) % 1) - 1
    x = np.sin(2 * np.pi * f * k) + 0.25 * lp(saw, 700) * np.exp(-k * 9)
    env = np.minimum(1, k / 0.004) * np.exp(-k * 1.6) * np.clip((dur + 0.06 - k) / 0.06, 0, 1)
    return lp(x * env, 1100) * vel

def lead(m, dur, vel=1.0):
    """A soft synth lead: two detuned triangle-ish voices, low-passed, with a slow vibrato that grows in."""
    n = int((dur + 0.25) * SR); k = np.arange(n) / SR; f = hz(m)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * k) * np.clip(k / 0.35, 0, 1)
    x = 0
    for d in (-0.06, 0.06):
        ph = np.cumsum(f * 2 ** (d / 12) * vib) / SR
        x = x + (2 * np.abs(2 * (ph % 1) - 1) - 1)
    env = np.minimum(1, k / 0.025) * np.clip((dur + 0.2 - k) / 0.2, 0, 1) * (0.85 + 0.15 * np.exp(-k * 4))
    return lp(x * env * 0.5, 2600) * vel

def bell(m, vel=1.0):
    n = int(1.8 * SR); k = np.arange(n) / SR; f = hz(m)
    x = np.sin(2 * np.pi * f * k) * np.exp(-k / 0.8) + 0.35 * np.sin(2 * np.pi * f * 2.76 * k) * np.exp(-k / 0.2) + 0.12 * np.sin(2 * np.pi * f * 5.4 * k) * np.exp(-k / 0.06)
    return x * np.minimum(1, k / 0.002) * vel

def pad(ms, t0, t1, vel=1.0, att=0.5, rel=1.2, bright=1600):
    n = int((t1 - t0 + rel) * SR); k = np.arange(n) / SR; x = np.zeros(n)
    for m in ms:
        for d in (-0.08, 0.0, 0.07):
            f = hz(m + d); ph = rng.uniform(0, 1)
            x += (2 * np.abs(2 * ((f * k + ph) % 1) - 1) - 1) * 0.33
    env = np.minimum(1, k / att) * np.clip((t1 - t0 + rel - k) / rel, 0, 1)
    return lp(x * env, bright, 2) / max(1, len(ms)) * vel

def kick(vel=1.0):
    n = int(0.32 * SR); k = np.arange(n) / SR
    f = 52 + 80 * np.exp(-k / 0.025)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-k / 0.14) * vel
def snare(vel=1.0):
    """A soft, round snare and clap: filtered noise with a smooth tail, a low tone underneath (no rattle)."""
    n = int(0.3 * SR); k = np.arange(n) / SR
    noise = lp(bp(rng.standard_normal(n), 1200, 6500), 7000) * np.exp(-k / 0.075)
    tone = np.sin(2 * np.pi * 190 * k) * np.exp(-k / 0.04) * 0.6
    return (noise * 0.9 + tone) * np.minimum(1, k / 0.002) * vel
def hat(vel=1.0, open_=False):
    n = int((0.22 if open_ else 0.06) * SR); k = np.arange(n) / SR
    return lp(hp(rng.standard_normal(n), 7000), 13000) * np.exp(-k / (0.07 if open_ else 0.018)) * np.minimum(1, k / 0.001) * vel

# ---------- harmony ----------
CH = {'Gmaj9': [59, 62, 66, 69], 'F#7': [58, 61, 64, 68], 'Bm9': [62, 66, 69, 73], 'Am9': [60, 64, 67, 71],
      'D9': [54, 57, 60, 64], 'Em9': [55, 59, 62, 66], 'A7sus': [62, 64, 67, 71], 'Dmaj9': [54, 57, 61, 64, 69]}
ROOT = {'Gmaj9': 31, 'F#7': 30, 'Bm9': 35, 'Am9': 33, 'D9': 38, 'Em9': 28, 'A7sus': 33, 'Dmaj9': 26}
G0, G1 = 4.8, 24.6                                    # the groove: in with the dive, out as the camera pulls back
LOOP = [('Gmaj9', 4), ('F#7', 4), ('Bm9', 4), ('Am9', 2), ('D9', 2)]
PLAN = [(0.0, 'Gmaj9'), (2.4, 'F#7')]                 # the scramble and the pull-back: piano alone
t = G0
while t < G1 - 1e-6:
    for name, beats in LOOP:
        if t < G1 - 1e-6: PLAN.append((round(t, 3), name))
        t += beats * BEAT
PLAN += [(24.6, 'Em9'), (25.5, 'A7sus'), (26.4, 'Dmaj9')]
def span(i): return PLAN[i][0], (PLAN[i + 1][0] if i + 1 < len(PLAN) else DUR)

for i, (t0, name) in enumerate(PLAN):
    t0, t1 = span(i); ch = CH[name]
    if t0 < G0 or t0 >= G1:                            # the opening and the close: rolled chords, a pad, a long bass
        last = t0 >= 26.4
        for j, m in enumerate(ch): put('ep', t0 + 0.05 + j * 0.06, ep(m, min(2.6, t1 - t0 + 0.4) + (1.8 if last else 0), 0.55), pan=-0.3 + 0.15 * j)
        put('pad', t0, pad(ch, t0, t1 + (1.0 if last else 0), 0.7))
        if t0 > 0: put('bass', t0, bass(ROOT[name] + 12, min(2.2, t1 - t0), 0.5))
        continue
    # the groove: piano on the "and" of 1, on 2, the "and" of 3 (a city-pop comp), short and bright
    for off, d, v in [(0.5, 0.35, 0.42), (1.0, 0.25, 0.32), (2.5, 0.35, 0.4), (3.5, 0.2, 0.28)]:
        tt = t0 + off * BEAT
        if tt < t1 - 1e-6:
            for j, m in enumerate(ch): put('ep', tt + j * 0.008, ep(m, d, v), pan=-0.25 + 0.17 * j)
    put('pad', t0, pad(ch, t0, t1, 0.35, att=0.3, rel=0.6))
    # bass: root on 1, the octave popped on the "and" of 2, a passing note into the next chord
    r = ROOT[name] + 12
    for off, m, d, v in [(0.0, r, 0.5, 0.75), (0.75, r, 0.2, 0.45), (1.5, r + 12, 0.18, 0.55), (2.0, r, 0.4, 0.65), (3.0, r + 7, 0.25, 0.5), (3.5, r + 10, 0.2, 0.45)]:
        tt = t0 + off * BEAT
        if tt < t1 - 1e-6: put('bass', tt, bass(m, d, v))

# drums: kick on 1 and 3 (and the "and" of 3), snare on 2 and 4, eighth hats with an open hat on the last "and"
t = G0
while t < G1 - 1e-6:
    s8 = int(round((t - G0) / (BEAT / 2))); beat = (s8 // 2) % 4; off = s8 % 2
    put('drums', t, hat(0.28 if off else 0.18, open_=(beat == 3 and off == 1)), pan=0.3)
    if not off and beat in (0, 2): put('drums', t, kick(0.85))
    if off and beat == 2: put('drums', t, kick(0.45))
    if not off and beat in (1, 3): put('drums', t, snare(0.5), pan=-0.05)
    t += BEAT / 2
put('drums', G1, kick(0.8)); put('drums', G1, hat(0.3, open_=True), pan=0.3)     # the last hit as the camera pulls back
# a pickup into the groove: two soft snare ghosts before the dive
for tt, v in [(G0 - 0.3, 0.18), (G0 - 0.15, 0.26)]: put('drums', tt, snare(v), pan=-0.05)

# the lead: the hook over the life (12.0) and again, higher, over the seasons (19.2); rests while the words land
HOOK = [(0.0, 78, 0.5), (0.5, 81, 0.5), (1.0, 83, 0.9), (2.0, 81, 0.4), (2.5, 78, 0.4), (3.0, 76, 0.9),
        (4.0, 78, 0.5), (4.5, 81, 0.5), (5.0, 83, 0.5), (5.5, 85, 0.9), (6.5, 83, 0.4), (7.0, 81, 1.0)]   # beats, MIDI, beats
for start, shift, v in [(12.0, 0, 0.42), (19.2, 0, 0.46)]:
    for b, m, d in HOOK:
        tt = start + b * BEAT
        if tt < G1 - 0.05: put('lead', tt, lead(m + shift, d * BEAT, v), pan=0.12)
# a bell answers at the turn of each section, and rings the end
for tt, m, v in [(4.2, 86, 0.3), (4.35, 90, 0.26), (9.6, 93, 0.22), (18.0, 90, 0.26), (26.5, 86, 0.35), (26.8, 93, 0.3), (27.1, 97, 0.22)]:
    put('bell', tt, bell(m, v), pan=0.35)

# ---------- mix ----------
GAIN = {'ep': 0.55, 'pad': 0.35, 'bass': 0.5, 'drums': 0.42, 'lead': 0.34, 'bell': 0.28}
dry = sum(bus[k] * g for k, g in GAIN.items())
dry[0] = hp(dry[0], 40); dry[1] = hp(dry[1], 40)
ir_n = int(1.6 * SR); k = np.arange(ir_n) / SR                     # a bright, medium room: daylight
irL = lp(rng.standard_normal(ir_n), 7000) * np.exp(-k / 0.42); irR = lp(rng.standard_normal(ir_n), 7000) * np.exp(-k / 0.42)
send = bus['ep'] * 0.5 + bus['pad'] * 0.4 + bus['lead'] * 0.6 + bus['bell'] * 0.9 + bus['drums'] * 0.08
wetL = fftconvolve(send[0], irL)[:N]; wetR = fftconvolve(send[1], irR)[:N]
wet = np.stack([wetL, wetR]); wet *= 0.24 / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(dry))
mix = dry + wet
tail = np.arange(N) / SR; mix *= np.clip((DUR - tail) / 1.0, 0, 1)
mix /= np.max(np.abs(mix)) + 1e-9; mix *= 10 ** (-3 / 20)
OUT.parent.mkdir(parents=True, exist_ok=True)
pcm = (np.clip(mix.T, -1, 1) * 8388607).astype('<i4')
with wave.open(str(OUT), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(3); w.setframerate(SR)
    w.writeframes(pcm.reshape(-1).view('<u1').reshape(-1, 4)[:, :3].tobytes())
print('wrote', OUT, f'{DUR} s,', len(PLAN), 'chords')
