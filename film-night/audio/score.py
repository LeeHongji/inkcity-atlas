"""Original score for "Press N", the inkcity Atlas night film: 30 s, 96 BPM (a beat is 0.625 s), E-flat major.
Day is one plain felt-piano chord; the key turns it to a lydian night (A-flat major 7 with a raised 11th) under a soft
pad; the cities ride a light pulse (soft kick, shaker, a wooden knock, bass) with a felt-piano arpeggio; the twelve
open the pad again; the end rings on E-flat add 9. The lamps' glockenspiel and the key are sound effects (sfx.py), so
they land exactly on the picture. Synthesised with numpy from a fixed seed: no samples, no recordings.
Usage: python3 audio/score.py   -> assets/music.wav (48 kHz, 24-bit stereo)
"""
import numpy as np, wave
from pathlib import Path
from scipy.signal import butter, sosfilt, fftconvolve

SR, DUR, BEAT = 48000, 30.0, 0.625
N = int(SR * DUR)
rng = np.random.default_rng(1123)
OUT = Path(__file__).resolve().parent.parent / 'assets' / 'music.wav'
bus = {k: np.zeros((2, N)) for k in ('keys', 'pad', 'bass', 'drums', 'glock')}

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype='low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype='high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], btype='band', fs=SR, output='sos'), x)
def put(b, t, x, pan=0.0, gain=1.0):
    i = int(round(t * SR)); x = x[: max(0, N - i)]
    if i >= N or not len(x): return
    l, r = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
    bus[b][0, i:i + len(x)] += x * l * gain; bus[b][1, i:i + len(x)] += x * r * gain

def felt(m, dur, vel=1.0):
    """Felt piano: soft hammer, partials that die faster as they climb, a muted thump."""
    n = int((dur + 1.2) * SR); k = np.arange(n) / SR; f = hz(m); x = np.zeros(n)
    for p in range(1, 9):
        fp = f * p * np.sqrt(1 + 0.00025 * p * p)
        if fp > 9000: break
        x += np.sin(2 * np.pi * fp * k + rng.uniform(0, 6.28)) * (1 / p ** 1.4) * np.exp(-k * (0.9 + 0.75 * p) * (f / 260) ** 0.3)
    x *= np.minimum(1, k / 0.007)
    rel = np.clip((dur + 0.35 - k) / 0.35, 0, 1); x *= rel
    thump = lp(rng.standard_normal(n), 300) * np.exp(-k / 0.02) * 0.15
    return (x + thump) * vel

def marimba(m, vel=1.0):
    n = int(1.0 * SR); k = np.arange(n) / SR; f = hz(m)
    x = np.sin(2 * np.pi * f * k) * np.exp(-k / 0.42) + 0.5 * np.sin(2 * np.pi * f * 3.93 * k) * np.exp(-k / 0.06) + 0.18 * np.sin(2 * np.pi * f * 9.2 * k) * np.exp(-k / 0.02)
    mallet = bp(rng.standard_normal(n), 800, 3000) * np.exp(-k / 0.004) * 0.25
    return (x * np.minimum(1, k / 0.002) + mallet) * vel

def pluck(m, vel=1.0, dur=1.6, bright=0.5):
    """Plucked string (Karplus-Strong), the melody voice."""
    f = hz(m); L = max(2, int(round(SR / f))); n = int(dur * SR)
    burst = lp(rng.standard_normal(L), 1500 + 5000 * bright)
    y = np.zeros(n); y[:L] = burst
    g = 0.996 ** (440 / f)
    for i in range(L, n):                      # averaging comb: the string
        y[i] = g * 0.5 * (y[i - L] + y[i - L - 1])
    k = np.arange(n) / SR
    return y / (np.max(np.abs(y)) + 1e-9) * np.minimum(1, (dur - k) / 0.1).clip(0) * vel

def bass(m, dur, vel=1.0):
    n = int((dur + 0.1) * SR); k = np.arange(n) / SR; f = hz(m)
    x = (np.sin(2 * np.pi * f * k) + 0.35 * np.sin(4 * np.pi * f * k) * np.exp(-k * 5) + 0.12 * np.sin(6 * np.pi * f * k) * np.exp(-k * 9))
    env = np.minimum(1, k / 0.006) * np.exp(-k * 2.2) * np.clip((dur + 0.08 - k) / 0.08, 0, 1)
    return lp(x * env, 900) * vel

def glock(m, vel=1.0):
    n = int(1.6 * SR); k = np.arange(n) / SR; f = hz(m)
    x = np.sin(2 * np.pi * f * k) * np.exp(-k / 0.7) + 0.4 * np.sin(2 * np.pi * f * 2.76 * k) * np.exp(-k / 0.18) + 0.2 * np.sin(2 * np.pi * f * 5.4 * k) * np.exp(-k / 0.05)
    return x * np.minimum(1, k / 0.001) * vel

def shaker(vel=1.0):
    n = int(0.09 * SR); k = np.arange(n) / SR
    return bp(rng.standard_normal(n), 4500, 11000) * np.minimum(1, k / 0.01) * np.exp(-k / 0.025) * vel
def knock(vel=1.0):
    n = int(0.15 * SR); k = np.arange(n) / SR
    return (bp(rng.standard_normal(n), 1400, 2600, 3) * np.exp(-k / 0.018) * 2 + np.sin(2 * np.pi * 820 * k) * np.exp(-k / 0.03) * 0.5) * vel
def kick(vel=1.0):
    n = int(0.3 * SR); k = np.arange(n) / SR
    f = 62 + 70 * np.exp(-k / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-k / 0.12) * vel


def pad(ms, t0, t1, vel=1.0, att=0.6, rel=1.2, bright=1400):
    """A soft pad: detuned triangles per note, low-passed, slow in and out."""
    n = int((t1 - t0 + rel) * SR); k = np.arange(n) / SR; x = np.zeros(n)
    for m in ms:
        for d in (-0.07, 0.0, 0.06):
            f = hz(m + d); ph = rng.uniform(0, 1)
            x += (2 * np.abs(2 * ((f * k + ph) % 1) - 1) - 1) * 0.33
    env = np.minimum(1, k / att) * np.clip((t1 - t0 + rel - k) / rel, 0, 1)
    return lp(x * env, bright, 2) / max(1, len(ms)) * vel

# ---------- harmony ----------
CH = {'Eb': [51, 55, 58, 63], 'Abmaj7#11': [56, 60, 63, 67, 74], 'Eb/G': [55, 58, 63, 67], 'Cm9': [51, 55, 58, 60, 62],
      'Bbsus': [58, 63, 65, 70], 'Fm9': [53, 56, 60, 63, 67], 'Ebadd9': [51, 58, 63, 65, 70]}
ROOT = {'Eb': 39, 'Abmaj7#11': 44, 'Eb/G': 43, 'Cm9': 48, 'Bbsus': 46, 'Fm9': 41, 'Ebadd9': 39}
PLAN = [(0.0, 'Eb'), (1.875, 'Abmaj7#11'), (3.75, 'Eb/G'), (5.0, 'Fm9'), (6.25, 'Bbsus'),            # the switch
        (7.5, 'Abmaj7#11'), (10.0, 'Eb/G'), (12.5, 'Cm9'), (15.0, 'Bbsus'), (17.5, 'Abmaj7#11'),     # the cities, a chord a bar
        (20.0, 'Eb/G'), (22.5, 'Fm9'),
        (23.75, 'Bbsus'), (24.375, 'Abmaj7#11'),                                                    # the twelve
        (27.5, 'Ebadd9')]                                                                           # the end
def span(i): return PLAN[i][0], (PLAN[i + 1][0] if i + 1 < len(PLAN) else DUR)
for i, (t0, name) in enumerate(PLAN):
    t0, t1 = span(i); ch = CH[name]
    if t0 < 1.875:                                                     # day: one plain chord, rolled
        for j, m in enumerate(ch): put('keys', 0.32 + j * 0.05, felt(m, 1.6, 0.5), pan=-0.2 + 0.1 * j)
        continue
    put('pad', t0, pad(ch, t0, t1, 0.9 if t0 < 7.5 or t0 >= 23.75 else 0.55), pan=0)
    if t0 < 7.5 or t0 >= 23.75:                                       # the switch and the twelve: chords, rolled slowly
        for j, m in enumerate(ch): put('keys', t0 + 0.06 + j * 0.07, felt(m + 12 * (t0 >= 27.5 and j == len(ch) - 1), min(2.4, t1 - t0 + 0.6), 0.55), pan=-0.3 + 0.15 * j)
        put('bass', t0, bass(ROOT[name], t1 - t0, 0.5))
    else:                                                              # the cities: an eighth-note arpeggio, roots on 1 and 3
        arp = ch[1:] + [ch[1] + 12]
        t, j = t0, 0
        while t < t1 - 1e-6:
            put('keys', t, felt(arp[j % len(arp)] + 12, 0.28, 0.38 if j % 2 == 0 else 0.26), pan=-0.35 + 0.7 * ((j % 4) / 3))
            if j % 4 == 0: put('bass', t, bass(ROOT[name], BEAT * 1.7, 0.6))
            t += BEAT / 2; j += 1
# a high glockenspiel line over the cities, a note every second bar
for t, m in [(8.75, 87), (13.75, 84), (18.75, 87), (21.25, 91)]: put('glock', t, glock(m, 0.35), pan=0.4)

# drums: the cities only; shaker eighths, a knock on 2 and 4, a soft kick on 1 and 3
t = 7.5
while t < 23.75 - 1e-6:
    s8 = int(round((t - 7.5) / (BEAT / 2))); beat = (s8 // 2) % 4
    put('drums', t, shaker(0.32 if s8 % 2 else 0.2), pan=0.35)
    if s8 % 2 == 0 and beat in (1, 3): put('drums', t, knock(0.4), pan=-0.15)
    if s8 % 2 == 0 and beat in (0, 2): put('drums', t, kick(0.55))
    t += BEAT / 2

# ---------- mix ----------
GAIN = {'keys': 0.6, 'pad': 0.42, 'bass': 0.34, 'drums': 0.36, 'glock': 0.3}
dry = sum(bus[k] * g for k, g in GAIN.items())
dry[0] = hp(dry[0], 55); dry[1] = hp(dry[1], 55)
ir_n = int(2.4 * SR); k = np.arange(ir_n) / SR                        # a larger, darker room than the day film's: night air
irL = lp(rng.standard_normal(ir_n), 4500) * np.exp(-k / 0.7); irR = lp(rng.standard_normal(ir_n), 4500) * np.exp(-k / 0.7)
send = bus['keys'] * 0.7 + bus['pad'] * 0.4 + bus['glock'] * 0.9
wetL = fftconvolve(send[0], irL)[:N]; wetR = fftconvolve(send[1], irR)[:N]
wet = np.stack([wetL, wetR]); wet *= 0.3 / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(dry))
mix = dry + wet
tail = np.arange(N) / SR; mix *= np.clip((DUR - tail) / 1.2, 0, 1)
mix /= np.max(np.abs(mix)) + 1e-9; mix *= 10 ** (-3 / 20)
OUT.parent.mkdir(parents=True, exist_ok=True)
pcm = (np.clip(mix.T, -1, 1) * 8388607).astype('<i4')
with wave.open(str(OUT), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(3); w.setframerate(SR)
    w.writeframes(pcm.reshape(-1).view('<u1').reshape(-1, 4)[:, :3].tobytes())
print('wrote', OUT, f'{DUR} s')
