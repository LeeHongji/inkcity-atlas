import { CJK } from "./cjk"

/* a city name in Chinese characters, drawn with the same pen as the cities' own signs */
export function Hanzi({ text, size = 26, className }: { text: string; size?: number; className?: string }) {
  const chars = [...text]
  const w = size * chars.length + size * 0.12 * (chars.length - 1)
  return (
    <svg aria-hidden="true" width={w} height={size} viewBox={`0 0 ${w} ${size}`} className={className}
      fill="none" stroke="currentColor" strokeWidth={Math.max(1.3, size * 0.075)} strokeLinecap="round" strokeLinejoin="round">
      {chars.map((ch, i) => (CJK[ch] || []).map((st, k) => {
        let d = ""
        for (let j = 0; j < st.length; j += 2) d += `${j ? "L" : "M"}${(i * size * 1.12 + st[j] * size).toFixed(1)} ${(st[j + 1] * size).toFixed(1)}`
        return <path key={`${i}-${k}`} d={d} />
      }))}
    </svg>
  )
}

