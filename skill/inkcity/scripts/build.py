"""Make the single self-contained page: every <script src> of the dev page inlined, in order.
usage: python3 build.py <dev.html> <out.html>"""
import re, os, sys
if len(sys.argv) != 3: sys.exit(__doc__)
dev_path, out_path = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(dev_path))
dev = open(dev_path).read()
def inline(m):
    src = open(os.path.join(here, m.group(1))).read()
    src = re.sub(r"^'use strict';\n", '', src)
    return '/* ---- %s ---- */\n%s' % (m.group(1), src.replace('</script>', '<\\/script>'))
body = re.sub(r'<script src="([^"]+)"></script>\n', lambda m: inline(m) + '\n', dev)
first = body.index('/* ---- ')
last = body.index('<script>', first)
html = body[:first] + "<script>\n'use strict';\n" + body[first:last] + '</script>\n' + body[last:]
html = re.sub(r'<title>(.*?) \(dev\)</title>', r'<title>\1</title>', html)
ext = re.findall(r'(?:src|href)="(https?:[^"]+)"', html)
if ext: sys.exit('external references left: %s' % ext)
open(out_path, 'w').write(html)
print(out_path, len(html) // 1024, 'KB')
