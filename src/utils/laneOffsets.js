// Automatically keeps route lines from riding on top of each other.
//
// Every bus leg is an edge between two stops. If only one bus ever
// travels a given edge, it gets a gentle fixed bow (for visual style).
// If multiple buses share the exact same edge (e.g. two buses on the
// "same lane" for frequency), each one is assigned its own parallel
// lane, fanned out around the centerline, so they render as distinct
// side-by-side lines instead of overlapping.
//
// Direction-independent: a bus traveling A->B and another traveling
// B->A on the same road still land on consistent, opposite-safe sides,
// because the offset is computed relative to a canonical (sorted)
// direction and flipped for whichever bus runs it backwards.

const LANE_GAP = 34
const SOLO_BOW = 30

export function computeLaneOffsets(buses) {
  const groups = {}

  buses.forEach((bus) => {
    const n = bus.route.length
    for (let i = 0; i < n; i++) {
      const a = bus.route[i]
      const b = bus.route[(i + 1) % n]
      const canonical = [a, b].slice().sort()
      const key = canonical.join('|')
      const sign = a === canonical[0] ? 1 : -1
      if (!groups[key]) groups[key] = []
      groups[key].push({ busId: bus.id, legIndex: i, sign })
    }
  })

  const offsets = {}
  Object.values(groups).forEach((list) => {
    const n = list.length
    list.forEach((item, idx) => {
      const magnitude = n === 1 ? SOLO_BOW : (idx - (n - 1) / 2) * LANE_GAP
      offsets[`${item.busId}:${item.legIndex}`] = item.sign * magnitude
    })
  })
  return offsets
}
