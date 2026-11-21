(() => { const out = []; for (const t of SF.live) { const S = t.statics.filter((o) => !o.ground), n = S.length, adj = S.map(() => []);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { if (!bbHit(S[i].bb, S[j].bb)) continue; if (cmpStatic(S[i], S[j]) < 0) adj[i].push(j); else adj[j].push(i); }
  const nm = (o) => (o.name || 'cast') + '[' + o.fp.map((v) => Math.round(v)).join(',') + ']';
  const col = new Array(n).fill(0), st = [];
  const dfs = (u) => { col[u] = 1; st.push(u); for (const v of adj[u]) { if (col[v] === 1) { const k = st.indexOf(v); out.push(t.name + ': ' + st.slice(k).map((i) => nm(S[i])).join(' -> ')); return true; } if (col[v] === 0 && dfs(v)) return true; } st.pop(); col[u] = 2; return false; };
  for (let i = 0; i < n; i++) if (col[i] === 0) { st.length = 0; if (dfs(i)) break; } }
  return out.length ? out : 'no cycles'; })()
