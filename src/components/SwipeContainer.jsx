import { cloneElement, useEffect, useState } from 'react'

// Unattended street display: pages advance on a timer only, sliding
// vertically since the panel is mounted in portrait orientation.
export default function SwipeContainer({ pages, autoMs = 120000 }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % pages.length)
    }, autoMs)
    return () => clearInterval(timer)
  }, [autoMs, pages.length])

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
