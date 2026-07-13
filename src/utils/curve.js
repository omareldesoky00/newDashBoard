// Small helper so the drawn route line and the moving bus marker
// always agree on exactly the same path.

// Fractions of (dx, dy) from `a` toward `b` describing a long,
// multi-turn "spider leg" / circuit-trace path — several right-angle
// turns including a small hook-back (steps 5->6 briefly retreat in x
// before continuing on), instead of one short diagonal hop. The x
// fractions dip but never leave [0, 1], so the path still can't wander
// past `a` or `b` into a neighboring route's quadrant.
const SPIDER_FRACTIONS = [
  [0, 0],
  [0, 0.25],
  [0.35, 0.25],
  [0.35, 0.5],
  [0.8, 0.5],
  [0.8, 0.68],
  [0.6, 0.68], // hook back — a short u-turn before the final approach
  [0.6, 0.9],
  [1, 0.9],
  [1, 1],
]

// `offset` nudges the path sideways (tapered to 0 at both endpoints,
// so it still starts/ends exactly on the stops), for the rare case
// two buses share a road — see laneOffsets.js.
function spiderWaypoints(a, b, offset = 0) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return SPIDER_FRACTIONS.map(([fx, fy]) => ({
    x: a.x + dx * fx + offset * Math.sin(fx * Math.PI),
    y: a.y + dy * fy,
  }))
}

function roundedPolylineD(points, radius = 26) {
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const next = points[i + 1]
    const toPrev = { x: prev.x - curr.x, y: prev.y - curr.y }
    const toNext = { x: next.x - curr.x, y: next.y - curr.y }
    const lenPrev = Math.hypot(toPrev.x, toPrev.y) || 1
    const lenNext = Math.hypot(toNext.x, toNext.y) || 1
    const r = Math.min(radius, lenPrev / 2, lenNext / 2)
    const p1 = { x: curr.x + (toPrev.x / lenPrev) * r, y: curr.y + (toPrev.y / lenPrev) * r }
    const p2 = { x: curr.x + (toNext.x / lenNext) * r, y: curr.y + (toNext.y / lenNext) * r }
    d += ` L ${p1.x} ${p1.y} Q ${curr.x} ${curr.y} ${p2.x} ${p2.y}`
  }
  const last = points[points.length - 1]
  d += ` L ${last.x} ${last.y}`
  return d
}

function polylinePointAt(points, t) {
  const segCount = points.length - 1
  const segT = Math.max(0, Math.min(1, t)) * segCount
  const segIndex = Math.min(segCount - 1, Math.floor(segT))
  const u = segT - segIndex
  const p0 = points[segIndex]
  const p1 = points[segIndex + 1]
  return { x: p0.x + (p1.x - p0.x) * u, y: p0.y + (p1.y - p0.y) * u }
}

export function spiderPoint(a, b, t, offset = 0) {
  return polylinePointAt(spiderWaypoints(a, b, offset), t)
}

export function spiderPathD(a, b, offset = 0) {
  return roundedPolylineD(spiderWaypoints(a, b, offset))
}

export function fmtClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

export function fmtMinutesWords(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  if (m === 0) return `${r}s`
  if (r === 0) return `${m} min`
  return `${m}m ${r}s`
}
