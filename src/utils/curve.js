// Small helper so the drawn route line and the moving bus marker
// always agree on exactly the same curve.

// Point at t (0..1) along a quadratic bezier from a to b, bowed
// sideways by `bend` pixels (perpendicular to the straight line a->b).
export function curvedPoint(a, b, t, bend = 0) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const cx = mx + nx * bend
  const cy = my + ny * bend

  const it = 1 - t
  const x = it * it * a.x + 2 * it * t * cx + t * t * b.x
  const y = it * it * a.y + 2 * it * t * cy + t * t * b.y
  return { x, y }
}

// SVG path 'd' for the same curve, for drawing the route line.
export function legPathD(a, b, bend = 0) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const cx = mx + nx * bend
  const cy = my + ny * bend
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`
}

// Routes a leg like an actual street: straight out from `a`, a
// rounded right-angle turn, then straight into `b` — instead of one
// smooth diagonal curve. `offset` shifts the turn sideways, which is
// how parallel lines sharing the same road get visual daylight
// between them (see laneOffsets.js).
function elbowGeometry(a, b, offset = 0, radius = 36) {
  const corner = { x: a.x + offset, y: b.y }
  const vDir = Math.sign(corner.y - a.y) || 1
  const hDir = Math.sign(b.x - corner.x) || 1
  const r = Math.min(radius, Math.abs(corner.y - a.y) / 2, Math.abs(b.x - corner.x) / 2)
  const roundStart = { x: corner.x, y: corner.y - vDir * r }
  const roundEnd = { x: corner.x + hDir * r, y: corner.y }
  return { corner, roundStart, roundEnd }
}

export function elbowPoint(a, b, t, offset = 0) {
  const { corner } = elbowGeometry(a, b, offset)
  if (t <= 0.5) {
    const u = t / 0.5
    return { x: a.x + (corner.x - a.x) * u, y: a.y + (corner.y - a.y) * u }
  }
  const u = (t - 0.5) / 0.5
  return { x: corner.x + (b.x - corner.x) * u, y: corner.y + (b.y - corner.y) * u }
}

export function elbowPathD(a, b, offset = 0) {
  const { corner, roundStart, roundEnd } = elbowGeometry(a, b, offset)
  return `M ${a.x} ${a.y} L ${roundStart.x} ${roundStart.y} Q ${corner.x} ${corner.y} ${roundEnd.x} ${roundEnd.y} L ${b.x} ${b.y}`
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
