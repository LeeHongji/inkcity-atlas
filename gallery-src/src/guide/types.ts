/* A city's guide: written per city in cities/<slug>/src/guide.js as `window.GUIDE = {...}`.
   Points `at` are world coordinates [x, y, z] (the same units as the tiles); the overlay projects them. */
export type Pt = [number, number, number?]

export type MarginNote = {
  at: Pt                 // what the note points at
  dx: number; dy: number // where the note's text sits, from that point, in wide px (the 1920-wide frame at zoom 1)
  text: string
  w?: number             // text width in wide px (default 230)
}

export type LookFor = {
  at: Pt                 // the detail
  z?: number             // zoom to see it (default 6)
  r?: number             // radius of the pen circle, in world units (default 5)
  text: string
}

export type Place = {
  shot: string           // the place's shot name in the scene (the camera to glide to)
  title: string
  local?: string         // the name in the city's own script, if different
  story: string          // two or three short paragraphs separated by \n\n: the place's history and its people
  look: LookFor[]
}

export type Guide = {
  city: string
  local?: string
  lang?: string          // the language of local names: 'ja', 'zh-Hans', 'zh-Hant', 'pt', 'tr' ...
  intro: string          // two or three sentences, written on the paper beside the title
  notes: MarginNote[]
  places: Place[]
  moment: { shot: string; title: string; text: string; when?: string }
}

declare global {
  interface Window {
    GUIDE?: Guide
    SF?: {
      on: (k: "explore" | "film" | "arrive" | "look", f: (a: unknown) => void) => void
      look?: { night: boolean }
      setLook?: (o: { night?: boolean }) => void
      paper?: () => number[]
      view: () => { mode: string; z: number; cx: number; cy: number; pz: number; w: number; h: number; paused: boolean; gliding: boolean }
      toScreen: (wx: number, wy: number, v?: ReturnType<NonNullable<Window["SF"]>["view"]>) => [number, number]
      prj: (x: number, y: number, z?: number) => [number, number]
      glideTo: (to: string | { z: number; cx: number; cy: number }, ms?: number) => void
      shot: (name: string) => { z: number; cx: number; cy: number; name: string } | undefined
      wide: { z: number; cx: number; cy: number }
      home?: () => { z: number; cx: number; cy: number }
      extent: () => [number, number, number, number]
      boxes?: () => number[][]
      zMin: () => number
      ui?: boolean
      togglePause: () => void
      replay: () => void
      app: { mode: string }
    }
  }
}
