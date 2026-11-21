import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// builds the gallery into the atlas root: ../index.html + ../gallery/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  // fonts inlined and no module preload, so the page also opens straight from disk (file://), like the cities
  build: { outDir: "dist", emptyOutDir: true, assetsDir: "gallery", assetsInlineLimit: 200_000, modulePreload: false },
})
