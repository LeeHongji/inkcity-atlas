# Video brief

- Status: production film (plan.json `demo: false`), 30.0 s, 1080×1080, 30 fps, English only, for X.
- Style: `repo`. The film uses the Atlas's own paper, ink and Kevin Sans hand, the guide's night colours, and the gallery's Looseleaf `Kbd` and `Lettering`.
- Repository: the parent folder (inkcity-atlas). Scope: the night look as published in `main@32b81e5` (2026-11-22), the twelve city pages in a desktop browser. The phone layout and the gallery page are not shown.
- User request (2026-11-23): "先做一个展示切换夜晚的X发布视频" (an X post video showing the switch to night). Decided without asking, on the user's standing preferences: square for X, 30 s, minimal English captions in the product's hand, smooth sounds, the site's address on the end card.
- Pictures:
  - The switch: the real Tokyo page draws day frames (`SF.seek`) and night frames with its own light-up clock (`lightT`), the day laid over it fading as `drawSwap` fades it (`src/city.js`, `src/shots/switch.jsx`).
  - The twelve nights: each city page with `?night`, at its own signature camera.
  - The grid: each page's wide view by day and at night, drawn ahead of time (`tools/grid-images.mjs`).
- Sound: original score (`audio/score.py`) and effects (`audio/sfx.py`), placed by `audio/cues.py`, mixed by the skill's `mix_audio.py`. Evidence is in `evidence/`.
