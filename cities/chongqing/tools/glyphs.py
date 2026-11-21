"""Render the hanzi stroke table of src/37_hanzi.js large, to check every character: python3 -I tools/glyphs.py out/glyphs.png"""
import re, json, sys
from PIL import Image, ImageDraw
src = open(__file__.rsplit('/tools/', 1)[0] + '/src/37_hanzi.js', encoding='utf-8').read()
G = [(m.group(1), json.loads(m.group(2))) for m in re.finditer(r"^'(.)': (\[.*\]),$", src, re.M)]
S, cols = 150, 8
rows = (len(G) + cols - 1) // cols
im = Image.new('RGB', (cols * S, rows * S), '#F0EEE4'); d = ImageDraw.Draw(im)
for i, (ch, strokes) in enumerate(G):
    ox, oy = (i % cols) * S + 15, (i // cols) * S + 15; k = (S - 30) / 12
    d.rectangle([ox, oy, ox + 12 * k, oy + 12 * k], outline='#D8D2C2')
    for st in strokes:
        pts = [(ox + st[j] * k, oy + st[j + 1] * k) for j in range(0, len(st), 2)]
        d.line(pts, fill='#2C271C', width=7, joint='curve')
print(len(G), 'glyphs:', ''.join(c for c, _ in G))
im.save(sys.argv[1] if len(sys.argv) > 1 else 'out/glyphs.png')
