// Automatically keeps route lines from riding on top of each other.
//
// Every bus leg is an edge between two stops. If only one bus ever
// travels a given edge, it gets a gentle fixed offset (for visual
// style). If multiple buses share the exact same edge (e.g. two buses
// on the "same lane" for frequency), each one is assigned its own
// parallel lane, fanned out around the centerline, so they render as
// distinct side-by-side lines instead of overlapping.
//
// A bus's outbound and return trip over the same road use the SAME
// offset — both the drawn line (MapView's RouteLines, which only ever
// renders the canonical direction once) and the moving marker
// (useBusSchedule, which reparametrizes to that same canonical
// direction regardless of which way the bus is actually driving) key
// off the offset for the *edge*, not the leg, so they can never
// disagree about which path is being traced.

const LANE_GAP = 80
// Solo edges (the normal case now — one bus per district) don't need
// any sideways shift; the spider path already has its own shape.
const SOLO_BOW = 0

export function computeLaneOffsets(buses) {
  const groups = {} // edgeKey -> [{busId}], one entry per bus that uses this edge

  buses.forEach((bus) => {
    const n = bus.route.length
    const seenEdges = new Set()
    for (let i = 0; i < n; i++) {
      const a = bus.route[i]
      const b = bus.route[(i + 1) % n]
      const key = [a, b].slice().sort().join('|')
      if (seenEdges.has(key)) continue // this bus's return trip over a road it already counted
      seenEdges.add(key)
      if (!groups[key]) groups[key] = []
      groups[key].push({ busId: bus.id })
    }
  })

  const edgeOffset = {} // `${busId}|${edgeKey}` -> offset
  Object.entries(groups).forEach(([key, list]) => {
    const n = list.length
    list.forEach((item, idx) => {
      edgeOffset[`${item.busId}|${key}`] = n === 1 ? SOLO_BOW : (idx - (n - 1) / 2) * LANE_GAP
    })
  })

  // Expand to per-leg offsets: every leg of a bus that crosses a given
  // edge gets that edge's offset, regardless of which direction it's
  // traveling that leg.
  const legOffsets = {}
  buses.forEach((bus) => {
    const n = bus.route.length
    for (let i = 0; i < n; i++) {
      const a = bus.route[i]
      const b = bus.route[(i + 1) % n]
      const key = [a, b].slice().sort().join('|')
      legOffsets[`${bus.id}:${i}`] = edgeOffset[`${bus.id}|${key}`] ?? 0
    }
  })

  return legOffsets
}
