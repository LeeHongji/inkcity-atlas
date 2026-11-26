// The film imports the gallery's own Looseleaf components (desk, polaroid, tape, highlight, index card)
// straight from gallery-src; the city pictures come from the real pages through /atlas/ (see server.mjs).
import path from 'node:path';
const repo = path.resolve(new URL('..', import.meta.url).pathname);
export default {
  repoDir: path.join(repo, 'gallery-src'),
  aliases: {'@': path.join(repo, 'gallery-src/src')},
  external: [],
  loaders: {},
  define: {},
  esbuild: {},
};
