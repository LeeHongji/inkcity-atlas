/* The city guide: mounted over a city page's canvas. The page loads its words (cities/<slug>/src/guide.js sets
   window.GUIDE), then this bundle; the map's engine exposes window.SF. */
import { createRoot } from "react-dom/client"
import "../styles/looseleaf.css"
import "./guide.css"
import { InkProvider } from "@/lib/ink/react"
import { Guide } from "./Guide"

function mount() {
  const g = window.GUIDE, sf = window.SF
  if (!g || !sf) return
  sf.ui = false                                     // the guide draws its own controls
  document.getElementById("atlas")?.remove()        // and its own way back to the Atlas
  const host = document.createElement("div"); host.id = "ink-guide"; document.body.appendChild(host)
  createRoot(host).render(<InkProvider tier="lo"><Guide g={g} /></InkProvider>)
}
if (!/[?&](f|film)(=|&|$)/.test(location.search)) {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount()
}
