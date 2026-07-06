import { useEffect, useRef, useState } from 'react'

/**
 * Animates a point moving back and forth along an SVG <path>.
 * pathRef: ref to the <path> DOM node that defines the route/lane.
 * durationMs: time to travel the full length of the path one way (slow = big number).
 */
export function useAnimatedBus(pathRef, durationMs = 18000) {
  const [pos, setPos] = useState({ x: 0, y: 0, angle: 0 })
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    const pathEl = pathRef.current
    if (!pathEl) return

    const length = pathEl.getTotalLength()

    function frame(timestamp) {
      if (startRef.current === null) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      // ping-pong progress between 0 and 1
      const cycle = (elapsed % (durationMs * 2)) / durationMs
      const t = cycle <= 1 ? cycle : 2 - cycle
      const forward = cycle <= 1

      const point = pathEl.getPointAtLength(t * length)
      // Look a little ahead/behind to compute heading angle for bus rotation
      const delta = 0.5
      const aheadLen = forward
        ? Math.min(length, t * length + delta)
        : Math.max(0, t * length - delta)
      const behindLen = forward
        ? Math.max(0, t * length - delta)
        : Math.min(length, t * length + delta)
      const p1 = pathEl.getPointAtLength(behindLen)
      const p2 = pathEl.getPointAtLength(aheadLen)
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI)

      setPos({ x: point.x, y: point.y, angle })
      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [pathRef, durationMs])

  return pos
}
