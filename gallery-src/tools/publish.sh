#!/bin/sh
# build the gallery and put it at the atlas root (index.html + gallery/), next to cities/ and thumbs/
set -e
cd "$(dirname "$0")/.."
npx vite build
rm -rf ../gallery
cp -R dist/gallery ../gallery
# a classic deferred script (module scripts and crossorigin links are blocked on file://)
sed -e 's/<script type="module" crossorigin /<script defer /' -e 's/<link rel="stylesheet" crossorigin /<link rel="stylesheet" /' dist/index.html > ../index.html
if grep -q "import\.meta\|^import \|^export " dist/gallery/*.js; then echo "bundle uses module syntax: cannot run as a classic script" >&2; exit 1; fi
# the city guide (loaded by every city page as ../../gallery/guide.js + guide.css)
npx vite build -c vite.guide.config.ts
cp dist-guide/guide.js dist-guide/guide.css ../gallery/
if grep -q "import\.meta\|^import \|^export " ../gallery/guide.js; then echo "guide uses module syntax" >&2; exit 1; fi
# the skill as a download for the page's "Draw your own city" section
(cd ../skill && rm -f ../gallery/inkcity-skill.zip && zip -rq ../gallery/inkcity-skill.zip inkcity -x "*.DS_Store")
echo "published to $(cd .. && pwd)/index.html"
