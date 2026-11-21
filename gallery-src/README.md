# gallery-src

The source of the Atlas gallery (`../index.html`) and of the guide overlay every city page loads
(`../gallery/guide.js`, `../gallery/guide.css`).

- `src/App.tsx`, `src/cities.ts`: the gallery page (the desk, the photos, the "draw your own city" section).
- `src/guide/`: the guide overlay laid over a city's canvas: margin notes, the guidebook, look-for circles, the
  responsive layouts (a side panel on landscape screens, a bottom sheet on portrait ones). Its words come from each
  city's `src/guide.js`; its types are in `src/guide/types.ts`.
- `src/components/ui/`, `src/lib/`, `src/hooks/`, `src/styles/`: [Looseleaf](https://kevintngo.github.io/looseleaf/)
  by Kevin T. Ngo, copied in as source the way the library is meant to be used (MIT, see `LOOSELEAF-LICENSE`).
- `tools/publish.sh`: builds both bundles into the atlas root and zips `../skill/inkcity` for download.
- `tools/guide-check.mjs`, `tools/guide-sizes.mjs`: drive a city's real guidebook in headless Chrome and shoot every
  place and look-for item, or the guide at eight screen sizes. `tools/extend-font.py` adds the Atlas's accented
  letters to Kevin Sans.

```sh
npm install
npm run dev            # the gallery with hot reload
npm run publish        # build everything into the atlas root
```
