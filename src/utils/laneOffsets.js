// Automatically keeps route lines from riding on top of each other.
//
// Every bus leg is an edge between two stops. If only one bus ever
// travels a given edge, it gets a gentle fixed offset (for visual
// style). If multiple buses share the exact same edge (e.g. two buses
// on the "same lane" for frequency), each one is assigned its own
// parallel lane, fanned out around the centerline, so they render as
// distinct side-by-side lines instead of overlapping.
//
// A single bus's own outbound and return trip over the same road are
// NOT counted as two different lane users — that previously drew two
// separate offset curves for what's visually one line, doubling every
// route on the map. The return leg mirrors its outbound leg's curve
// instead (negated offset traces the identical path backwards).
//
// Direction-independent otherwise: a bus traveling A->B and another
// traveling B->A on the same road still land on consistent,
// opposite-safe sides, because the offset is computed relative to a
// canonical (sorted) direction and flipped for whichever bus runs it
// backwards.

const LANE_GAP = 80
const SOLO_BOW = 55

export function computeLaneOffsets(buses) {
  const groups = {} // edgeKey -> [{busId, sign}], one entry per bus that uses this edge

  buses.forEach((bus) => {
    const n = bus.route.length
    const seenEdges = new Set()
    for (let i = 0; i < n; i++) {
      const a = bus.route[i]
      const b = bus.route[(i + 1) % n]
      const canonical = [a, b].slice().sort()
      const key = canonical.join('|')
      if (seenEdges.has(key)) continue // this bus's return trip over a road it already counted
      seenEdges.add(key)
      const sign = a === canonical[0] ? 1 : -1
      if (!groups[key]) groups[key] = []
      groups[key].push({ busId: bus.id, sign })
    }
  })

  const baseOffset = {} // `${busId}|${edgeKey}` -> offset, relative to the canonical direction
  Object.entries(groups).forEach(([key, list]) => {
    const n = list.length
    list.forEach((item, idx) => {
      const magnitude = n === 1 ? SOLO_BOW : (idx - (n - 1) / 2) * LANE_GAP
      baseOffset[`${item.busId}|${key}`] = item.sign * magnitude
    })
  })

  // Expand back into per-leg offsets. A bus's first pass over an edge
  // uses its assigned lane; if its route comes back the same way
  // later, that leg mirrors the same curve instead of being fanned out
  // as if it were a different bus.
  const legOffsets = {}
  buses.forEach((bus) => {
    const n = bus.route.length
    const firstPass = new Map() // edgeKey -> offset used the first time this bus crossed it
    for (let i = 0; i < n; i++) {
      const a = bus.route[i]
      const b = bus.route[(i + 1) % n]
      const canonical = [a, b].slice().sort()
      const key = canonical.join('|')
      if (firstPass.has(key)) {
        legOffsets[`${bus.id}:${i}`] = -firstPass.get(key)
      } else {
        const offset = baseOffset[`${bus.id}|${key}`] ?? 0
        firstPass.set(key, offset)
        legOffsets[`${bus.id}:${i}`] = offset
      }
    }
  })

  return legOffsets
}
