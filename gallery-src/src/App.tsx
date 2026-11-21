import * as React from "react"

import { Desk } from "@/components/ui/desk"
import { Polaroid, PolaroidCaption, PolaroidImage } from "@/components/ui/polaroid"
import { StickyNote, StickyNoteContent, StickyNoteTitle } from "@/components/ui/sticky-note"
import { IndexCard, IndexCardContent, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card"
import { CodeBlock } from "@/components/ui/code-block"
import { Highlight } from "@/components/ui/highlight"
import { Underline } from "@/components/ui/underline"
import { Kbd } from "@/components/ui/kbd"
import { Stamp } from "@/components/ui/stamp"
import { Button } from "@/components/ui/button"
import { CITIES, type City } from "./cities"
import { Hanzi } from "./hanzi"

const REPO = "https://github.com/LeeHongji/inkcity-atlas"
const INSTALL = `git clone https://github.com/LeeHongji/inkcity-atlas
cp -r inkcity-atlas/skill/inkcity ~/.claude/skills/`

const HERO = [
  { slug: "venice", name: "Venice", tag: "Acqua alta", x: "0%", y: "4%", r: -8 },
  { slug: "rio", name: "Rio", tag: "Samba", x: "36%", y: "0%", r: 6 },
  { slug: "tokyo", name: "Tokyo", tag: "The scramble", x: "1%", y: "33%", r: -2.5 },
]
const TAPES = ["washi-stripes", "masking", "washi-dots", "kraft", "washi-gingham", "masking"] as const
const TILTS = [-1.6, 1.1, -0.6, 1.5, -1.2, 0.7, -1.4, 0.9, -0.8, 1.3, -1.0, 0.6]

function CityPolaroid({ c, i }: { c: City; i: number }) {
  const no = String(i + 1).padStart(2, "0")
  return (
    <li className="group relative list-none">
      <a href={`cities/${c.slug}/index.html`} className="block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ink-you focus-visible:ring-offset-8 focus-visible:ring-offset-desk">
        <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:rotate-0 group-focus-within:-translate-y-1.5 motion-reduce:transition-none"
          style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}>
          <Polaroid tape="top" tapeKind={TAPES[i % TAPES.length]} seed={`atlas-${c.slug}`} className="w-full gap-3 px-4 pt-4 pb-5">
            <PolaroidImage date={`No. ${no}`} className="aspect-[16/10]" seed={c.slug}>
              <img src={`thumbs/${c.slug}-wide.jpg`} alt={`${c.name} seen whole`} loading="lazy" className="scale-[1.3] transition-transform duration-700 group-hover:scale-[1.36] motion-reduce:transition-none" />
              <img src={`thumbs/${c.slug}-moment.jpg`} alt={`${c.name}: ${c.tag}`} loading="lazy"
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none" />
              <span className="pointer-events-none absolute start-2.5 top-2.5 z-10 rounded-sm bg-photo/95 px-2 py-0.5 font-hand text-[13px] text-ink opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                {c.tag}
              </span>
            </PolaroidImage>
            <PolaroidCaption className="min-h-0 justify-start gap-2.5 px-0.5 pt-1 text-start text-[2rem]">
              <span>{c.name}</span>
              {c.local ? (c.latin
                ? <span className="font-hand text-lg font-normal text-pencil-text">{c.local}</span>
                : <><Hanzi text={c.local} size={22} className="text-pencil-text" /><span className="sr-only">{c.local}</span></>) : null}
            </PolaroidCaption>
            <div className="space-y-2 px-0.5 font-hand text-[15px] leading-snug text-ink-soft">
              <p>{c.fingerprint}</p>
              <p><Highlight tone="yellow" seed={`m-${c.slug}`} className="font-bold text-ink">The moment:</Highlight> {c.moment}</p>
            </div>
          </Polaroid>
        </div>
      </a>
    </li>
  )
}

export function App() {
  const go = React.useCallback(() => { const c = CITIES[Math.floor(Math.random() * CITIES.length)]; location.href = `cities/${c.slug}/index.html` }, [])
  return (
    <Desk as="main" objects={["coffee", "pencil", "clips"]} seed="atlas-desk" className="min-h-dvh overflow-x-clip bg-desk">
      <div className="mx-auto max-w-[1280px] px-5 pt-14 pb-24 sm:px-10 lg:pt-20">

        {/* the title on the desk; a fanned stack of photos and the how-to note beside it */}
        <header className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          <div>
            <p className="font-mono text-[11px] tracking-[0.24em] text-ink-soft uppercase">inkcity · atlas</p>
            <h1 className="mt-5 font-hand text-[clamp(2.9rem,6.6vw,5.4rem)] leading-[0.98] font-bold tracking-tight text-ink">
              Twelve cities,<br />
              <Highlight tone="orange" weight="bold" seed="drawn-alive">drawn alive.</Highlight>
            </h1>
            <p className="mt-7 max-w-[34rem] font-hand text-[1.22rem] leading-relaxed text-ink">
              Each city is a hand-inked map built in code, its districts stitched together and full of small lives:
              traffic on a timetable, crowds that gather and scatter, and{" "}
              <Underline kind="wavy" tone="ink-you" seed="one-moment">one clever moment</Underline>{" "}
              that only that city could have.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button size="lg" onClick={go}>Open a city at random →</Button>
              <a href="#cities-h" className="font-hand text-[1.05rem] text-ink underline decoration-ink/40 decoration-dotted underline-offset-4 hover:decoration-ink">or pick one from the desk</a>
            </div>
          </div>

          <div className="relative mx-auto h-[440px] w-full max-w-[540px] sm:h-[480px]">
            {HERO.map((h, k) => (
              <a key={h.slug} href={`cities/${h.slug}/index.html`} aria-label={`${h.name}: ${h.tag}`}
                className="absolute block w-[62%] transition-transform duration-300 hover:z-30 hover:-translate-y-2"
                style={{ left: h.x, top: h.y, rotate: `${h.r}deg`, zIndex: 10 + k }}>
                <Polaroid seed={`hero-${h.slug}`} fastener={k === 2 ? "binder-clip" : false} tape={k === 0 ? "corner" : false} className="w-full gap-2 px-3 pt-3 pb-2">
                  <PolaroidImage className="aspect-[4/3]" seed={`hero-${h.slug}`}>
                    <img src={`thumbs/${h.slug}-moment.jpg`} alt="" />
                  </PolaroidImage>
                  <PolaroidCaption className="min-h-10 text-[1.45rem]">{h.name}, {h.tag.toLowerCase()}</PolaroidCaption>
                </Polaroid>
              </a>
            ))}
            <div className="absolute -bottom-10 -end-2 z-40 w-[215px] sm:-end-8">
              <StickyNote color="yellow" tilt={3} seed="how-to" className="w-full">
                <StickyNoteTitle>How to visit</StickyNoteTitle>
                <StickyNoteContent>
                  <ul className="mt-1 space-y-1.5 font-hand text-[14px] leading-snug">
                    <li>Watch it <b>draw itself</b> first.</li>
                    <li>Read the <b>notes</b> in the margins.</li>
                    <li>Open the <b>guidebook</b>: each place has its story and things to find.</li>
                    <li><b>Drag</b>, <b>scroll</b>, or <Kbd>R</Kbd> for the tour.</li>
                  </ul>
                </StickyNoteContent>
              </StickyNote>
            </div>
          </div>
        </header>

        {/* the cities */}
        <section aria-labelledby="cities-h" className="mt-28 scroll-mt-10">
          <h2 id="cities-h" className="mb-12 flex items-baseline gap-4 font-hand text-[1.9rem] font-bold text-ink">
            <span>The cities</span>
            <span className="hidden font-hand text-base font-normal text-ink-soft sm:inline">hover a photo to see its moment</span>
          </h2>
          <ol className="grid gap-x-10 gap-y-16 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {CITIES.map((c, i) => <CityPolaroid key={c.slug} c={c} i={i} />)}
          </ol>
        </section>

        {/* the skill: draw your own city */}
        <section aria-labelledby="skill-h" className="mt-32 mb-24 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="min-w-0">
            <p className="font-mono text-[11px] tracking-[0.24em] text-ink-soft uppercase">the skill behind the atlas</p>
            <h2 id="skill-h" className="mt-4 mb-0 font-hand text-[clamp(2.2rem,4.6vw,3.4rem)] leading-[1.02] font-bold text-ink">
              Draw <Highlight tone="green" weight="bold" seed="your-own">your own</Highlight> city.
            </h2>
            <p className="mt-6 max-w-[34rem] font-hand text-[1.15rem] leading-relaxed text-ink">
              Every map here was made with <b>inkcity</b>, a skill for Claude Code. Give it a place, real or invented, and it
              builds one offline page: the places draw themselves, a camera tours them, then the map is yours to explore.
            </p>
            <ul className="mt-6 max-w-[34rem] space-y-2.5 p-0 font-hand text-[1.05rem] leading-snug text-ink-soft">
              <li className="list-none">✎ <b className="text-ink">An engine</b> for isometric ink: pen, broken colour, people, traffic, boats, a camera.</li>
              <li className="list-none">✎ <b className="text-ink">A starter town</b> that already plays, explores and records.</li>
              <li className="list-none">✎ <b className="text-ink">Checks</b> that keep every frame exact and every pan smooth.</li>
              <li className="list-none">✎ <b className="text-ink">Hard-won notes</b> on depth order, timetables and drawing, from twelve cities.</li>
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button size="lg" asChild><a href="gallery/inkcity-skill.zip" download>Download the skill (.zip)</a></Button>
              <a href={REPO} className="font-hand text-[1.05rem] text-ink underline decoration-ink/40 decoration-dotted underline-offset-4 hover:decoration-ink">or read it on GitHub →</a>
            </div>
          </div>
          <div className="relative min-w-0">
            <IndexCard tilt={0.8} seed="install" className="max-w-none">
              <IndexCardHeader><IndexCardTitle>Install it</IndexCardTitle></IndexCardHeader>
              <IndexCardContent className="text-ink-soft">
                <p>Put the skill where Claude Code looks for skills:</p>
                <CodeBlock language="bash" tone="paper" code={INSTALL} wrap className="my-3" />
                <p>Then just ask, in any words:</p>
                <p className="font-bold text-ink">"Draw my home town as a living hand-inked map."</p>
              </IndexCardContent>
            </IndexCard>
            <StickyNote color="green" tilt={-3} seed="skill-note" className="absolute end-8 top-full -mt-5 w-[230px] max-md:hidden">
              <StickyNoteContent>
                <p className="m-0 font-hand text-[14px] leading-snug">Each city here is a folder you can open and change: its places, its people, its guidebook.</p>
              </StickyNoteContent>
            </StickyNote>
          </div>
        </section>

        {/* the colophon */}
        <footer className="relative mt-28 flex flex-wrap items-end justify-between gap-10">
          <IndexCard tilt={-1} seed="colophon" className="max-w-lg">
            <IndexCardHeader><IndexCardTitle>About the atlas</IndexCardTitle></IndexCardHeader>
            <IndexCardContent className="text-ink-soft">
              <p>Every map is drawn in the browser from code, with no photographs and no tiles.</p>
              <p>Each city is one offline page, made with the <b className="text-ink">inkcity</b> skill. The code is on <a className="text-ink-you underline decoration-dotted underline-offset-4" href={REPO}>GitHub</a>.</p>
              <p>This desk is set with <a className="text-ink-you underline decoration-dotted underline-offset-4" href="https://kevintngo.github.io/looseleaf/">Looseleaf</a>, by Kevin T. Ngo.</p>
            </IndexCardContent>
          </IndexCard>
          <Stamp text="12 cities" sub="inkcity atlas" shape="round" ink="red" size={168} tilt={-12} seed="atlas-stamp" className="me-6 mb-4" />
        </footer>
      </div>
    </Desk>
  )
}
