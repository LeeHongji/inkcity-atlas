import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// the city guide: one classic script (IIFE) + one stylesheet, loaded by every city page from ../../gallery/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  define: { "process.env.NODE_ENV": '"production"' },
  build: {
    outDir: "dist-guide", emptyOutDir: true, assetsInlineLimit: 200_000, cssCodeSplit: false,
    lib: { entry: "src/guide/main.tsx", formats: ["iife"], name: "InkGuide", fileName: () => "guide.js", cssFileName: "guide" },
  },
})
