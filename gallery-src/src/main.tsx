import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/looseleaf.css"
import { InkProvider } from "@/lib/ink/react"
import { App } from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InkProvider tier="lo">
      <App />
    </InkProvider>
  </StrictMode>,
)
