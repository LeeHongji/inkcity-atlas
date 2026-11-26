# Video brief

- **Status:** production film (plan.json `demo: false`), 30 s, 1080×1080, 30 fps, English only, for X.
- **Style:** `repo`. The film uses the Atlas's own paper and ink, the Kevin Sans hand, and the gallery's Looseleaf
  `Lettering`. Its red seal is cut from Tokyo's own stroke table.
- **Repository:** the parent folder (inkcity-atlas).
- **Scope:** the rebuilt Tokyo as published in `main@42b1a1a` (2026-11-25), the Tokyo page by day in a desktop browser.
  The night, the guide and the phone layout are not shown.
- **User request (2026-11-26):** "给新的东京界面做一个展示的小视频，用来发X" (a short showcase video of the new Tokyo for
  X). Decided without asking, on the user's standing preferences and the last X film:
  - square for X, about 30 s;
  - minimal English captions in the product's hand;
  - smooth sounds;
  - the site's address on the end card.
- **Pictures:** the real Tokyo page in hidden iframes (`src/city.js`):
  - `SF.seek(n, cam)` at the film's own cameras, including pull-backs and a dive that the page redraws at every zoom;
  - the four seasons (`?season=`), joined by the page's own season wipe, recomposed frame by frame.
- **Sound:** original score (`audio/score.py`) and effects (`audio/sfx.py`). They are placed by `audio/cues.py` and
  mixed by the skill's `mix_audio.py`. Evidence is in `evidence/`.
