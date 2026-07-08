import { BUSES, STOPS, buildLegs } from '../data/compound.js'

// Same shared reference point useBusSchedule uses, so "trips completed
// today" lines up with the buses' actual simulated positions.
const EPOCH = new Date('2026-01-01T00:00:00Z').getTime()

// A compound this size is walkable end-to-end in a few minutes, so we
// treat the map's coordinate units as roughly meters-to-scale for a
// plausible "distance driven" figure.
const MAP_UNITS_PER_KM = 900

function routeLoopDistanceKm(bus) {
  const n = bus.route.length
  let units = 0
  for (let i = 0; i < n; i++) {
    const a = STOPS[bus.route[i]]
    const b = STOPS[bus.route[(i + 1) % n]]
    units += Math.hypot(a.x - b.x, a.y - b.y)
  }
  return units / MAP_UNITS_PER_KM
}

export function computeFleetStats(now = new Date()) {
  const midnight = new Date(now)
  midnight.setHours(0, 0, 0, 0)

  let tripsToday = 0
  let totalKm = 0
  let waitSecSum = 0
  let waitCount = 0

  for (const bus of BUSES) {
    const legs = buildLegs(bus)
    const totalDuration = legs.reduce((s, l) => s + l.durationSec, 0)
    const phase = bus.phaseOffsetSec || 0
    const nowElapsed = (now.getTime() - EPOCH) / 1000 + phase
    const midnightElapsed = (midnight.getTime() - EPOCH) / 1000 + phase
    const trips = Math.floor(nowElapsed / totalDuration) - Math.floor(midnightElapsed / totalDuration)
    tripsToday += Math.max(0, trips)
    totalKm += Math.max(0, trips) * routeLoopDistanceKm(bus)

    for (const w of bus.waitSec) {
      waitSecSum += w
      waitCount++
    }
  }

  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
  const onTimePct = 95 + (dayOfYear % 5) // stable through the day, varies 95-99% day to day

  return {
    tripsToday,
    totalKm: Math.round(totalKm),
    avgWaitSec: waitCount ? waitSecSum / waitCount : 0,
    onTimePct,
  }
}
