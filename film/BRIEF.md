# Video brief

- Status: production film (plan.json `demo: false`), 43.2 s, 1920×1080, 30 fps, English titles with Chinese lines.
- Style: `repo`. The film uses the Atlas's own paper, ink and Kevin Sans hand, and the gallery's Looseleaf components.
- Repository: the parent folder (inkcity-atlas). Scope: the whole Atlas as published on 2026-11-21, desktop browser. The phone layout is not shown.
- User request (2026-11-21): "做一个分享的宣传视频，不用太长" (a short promo video to share). Links are allowed; the film ends on the live site and the repo.
- Pictures:
  - City frames are drawn by the real pages via `SF.seek` (`src/city.js`).
  - The guide shot is the real Beijing page and overlay, captured by `tools/capture-guide.mjs`.
  - The desk, Polaroids, tape, highlights and index card are imported from `gallery-src`.
- Sound: original score (`audio/score.py`) and effects (`audio/sfx.py`), mixed by the skill's `mix_audio.py`. Evidence is in `evidence/`.
