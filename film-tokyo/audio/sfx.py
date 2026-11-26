"""Sound effects for "Tokyo, redrawn", synthesised from seeded noise and sines (no samples, no recordings), all soft and
smooth (no grain, no crackle): the scramble's crossing signal (a soft electronic cuckoo, as Tokyo's crossings call),
words stamped on like a hanko (a muted thock), the pull-backs and the dive (soft whooshes), a cut (a short wooden tick
pitched to the key), a season brushed on (a broad brush swish).
Usage: python3 audio/sfx.py   -> assets/sfx/*.wav (48 kHz, 16-bit mono)
"""
import numpy as np, wave
from pathlib import Path
from scipy.signal import butter, sosfilt

SR = 48000
OUT = Path(__file__).resolve().parent.parent / 'assets' / 'sfx'
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(1125)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype='low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype='high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], btype='band', fs=SR, output='sos'), x)
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def pink(n):
    w = rng.standard_normal(n); X = np.fft.rfft(w); f = np.fft.rfftfreq(n, 1 / SR); X[1:] /= np.sqrt(f[1:]); X[0] = 0
    x = np.fft.irfft(X, n); return x / (np.max(np.abs(x)) + 1e-12)
def save(name, x, peak_db=-12.0):
    x = np.asarray(x, dtype=np.float64); x = x / (np.max(np.abs(x)) + 1e-12) * 10 ** (peak_db / 20)
    fade = min(len(x), int(0.006 * SR)); x[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(str(OUT / name), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())
    print(f'{name:16s} {len(x) / SR:5.2f} s')

def cuckoo():
    """The scramble's lights changing: Tokyo's crossing signal, a soft electronic cuckoo, two falling notes (kak-ko),
    pure sines with a round attack."""
    n = int(0.75 * SR); k = np.arange(n) / SR; x = np.zeros(n)
    for t0, m, d in [(0.0, 88, 0.16), (0.2, 84, 0.34)]:
        j = int(t0 * SR); kk = np.arange(n - j) / SR; f = hz(m)
        env = np.minimum(1, kk / 0.012) * np.exp(-kk / (d * 0.6)) * np.clip((d + 0.12 - kk) / 0.12, 0, 1)
        x[j:] += (np.sin(2 * np.pi * f * kk) + 0.08 * np.sin(4 * np.pi * f * kk)) * env
    return x

def stamp():
    """Words stamped on like a hanko: a muted thock (a low body, a felt pat on paper), then a lighter lift."""
    n = int(0.34 * SR); k = np.arange(n) / SR
    body = np.sin(2 * np.pi * 120 * k) * np.exp(-k / 0.045) + 0.45 * np.sin(2 * np.pi * 260 * k) * np.exp(-k / 0.02)
    pat = lp(bp(pink(n), 400, 3000), 3500) * np.exp(-k / 0.012) * 0.7
    lift = lp(bp(pink(n), 800, 3000), 3500) * np.exp(-np.clip(k - 0.16, 0, None) / 0.02) * (k >= 0.16) * 0.12
    return (body + pat + lift) * np.minimum(1, k / 0.0015)

def whoosh(d, rise=True):
    """The camera diving in (or pulling back): a soft whoosh, band-passed pink noise whose centre glides up (down),
    swelling to the end of the move and settling."""
    n = int((d + 0.4) * SR); k = np.arange(n) / SR; u = np.clip(k / d, 0, 1)
    lo = bp(pink(n), 500, 1800); hi = bp(pink(n), 1800, 6500)            # airy bands: no low rumble, no grain
    mixu = u if rise else 1 - u
    env = (np.sin(np.pi * u * 0.92) ** 1.5) * np.clip((d + 0.4 - k) / 0.4, 0, 1)
    return lp(0.5 * lo * (1 - 0.6 * mixu) + hi * (0.3 + 0.7 * mixu), 7000) * env

def tick(m):
    """A cut: a short wooden tick, pitched to the key, with a soft low tap under it."""
    n = int(0.35 * SR); k = np.arange(n) / SR; f = hz(m)
    x = np.sin(2 * np.pi * f * k) * np.exp(-k / 0.07) + 0.35 * np.sin(2 * np.pi * f * 2.9 * k) * np.exp(-k / 0.018)
    tap = np.sin(2 * np.pi * hz(m - 24) * k) * np.exp(-k / 0.05) * 0.5
    return (x + tap) * np.minimum(1, k / 0.0015)

def brush(d=1.3):
    """A season brushed on: a broad, smooth brush swish that sweeps across with the wipe (pink noise, a gentle band
    that opens and closes), raised-cosine, no gaps."""
    n = int((d + 0.3) * SR); k = np.arange(n) / SR; u = np.clip(k / d, 0, 1)
    e = np.where(u < 0.5, 2 * u * u, 1 - 2 * (1 - u) ** 2)                  # the wipe's own ease
    env = np.sin(np.pi * u) ** 1.2
    lo = bp(pink(n), 250, 1500); hi = bp(pink(n), 1500, 6000)
    return lp(lo * (0.8 - 0.4 * e) + hi * (0.25 + 0.5 * np.sin(np.pi * e)), 7000) * env

save('cuckoo.wav', cuckoo(), -20)
save('stamp.wav', stamp(), -10)
save('dive.wav', whoosh(2.4, True), -15)
save('pullback.wav', whoosh(3.0, False), -16)
save('pullback-short.wav', whoosh(1.8, False), -16)
for i, m in enumerate([74, 78, 81, 86]): save(f'tick-{i}.wav', tick(m), -17)
save('brush.wav', brush(), -14)
