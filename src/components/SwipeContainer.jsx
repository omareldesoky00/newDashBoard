import { cloneElement, useEffect, useState } from 'react'

// Unattended street display: pages advance on a timer only, sliding
// vertically since the panel is mounted in portrait orientation.
//
// `durations` is how long each page stays on screen before advancing
// to the next one, indexed by the page currently showing — durations[0]
// is how long page 0 shows before switching to page 1, and so on,
// wrapping back to page 0 after the last entry. Falls back to a single
// uniform `autoMs` for any page without its own entry.
export default function SwipeContainer({ pages, durations, autoMs = 120000 }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const duration = durations?.[index] ?? autoMs
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % pages.length)
    }, duration)
    return () => clearTimeout(timer)
  }, [index, durations, autoMs, pages.length])

  return (
    <div className="swipe-root">
      <div
        className="swipe-track"
        style={{ transform: `translateY(-${index * 100}%)` }}
      >
        {pages.map((page, i) => (
          <div className="swipe-page" key={i}>
            {cloneElement(page, { active: i === index })}
          </div>
        ))}
      </div>

      <div className="swipe-dots" aria-hidden="true">
        {pages.map((_, i) => (
          <span key={i} className={`dot-static ${i === index ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  )
}
