import { computeLaneOffsets } from '../utils/laneOffsets.js'

// A fictional city bus network (not real GPS data) used for the map
// canvas, which is 700 x 1000 units (portrait, for a vertical street
// display panel). Central Station sits in the middle as the hub every
// route runs through, with named districts pushed out to the four
// corners so each route's zigzag has a full quadrant to itself and
// never has to cross another route. `type` drives which little icon
// is drawn for that stop (see PlaceIcon in MapView.jsx).
export const STOPS = {
  centralStation: { key: 'centralStation', name: 'Central Station', x: 350, y: 500, type: 'station' },
  schoolZone: { key: 'schoolZone', name: 'School Zone', x: 110, y: 130, type: 'school' },
  shoppingMall: { key: 'shoppingMall', name: 'Shopping Mall', x: 590, y: 130, type: 'mall' },
  hospital: { key: 'hospital', name: 'Hospital', x: 590, y: 870, type: 'hospital' },
  foodCourt: { key: 'foodCourt', name: 'Food Court', x: 110, y: 870, type: 'foodcourt' },
}

// One bus per district — four routes, four quadrants, so no line ever
// has to share a road with another and they can't cross each other.
//
// Each bus loops forever through: WAIT at route[0] -> MOVE to route[1] ->
// WAIT at route[1] -> MOVE back to route[0] -> ... — a simple shuttle
// between Central Station and its district, same as the reference
// board's numbered lines.
//
// waitSec / travelSec are REAL seconds. If waitSec is 300, the bus will
// genuinely sit at the stop, counting down, for 5 real minutes before
// it starts moving — same as a real arrivals board.
export const BUSES = [
  {
    id: '101',
    label: 'Bus 101',
    driver: 'Ahmed Hassan',
    color: '#f5941f',
    route: ['centralStation', 'schoolZone'],
    waitSec: [4 * 60, 3 * 60],
    travelSec: [7 * 60, 7 * 60],
    phaseOffsetSec: 0,
  },
  {
    id: '102',
    label: 'Bus 102',
    driver: 'Mohamed Ali',
    color: '#3b82f6',
    route: ['centralStation', 'shoppingMall'],
    waitSec: [3 * 60, 3 * 60],
    travelSec: [6 * 60, 6 * 60],
    phaseOffsetSec: 140,
  },
  {
    id: '103',
    label: 'Bus 103',
    driver: 'Omar Adel',
    color: '#22c55e',
    route: ['centralStation', 'hospital'],
    waitSec: [4 * 60, 2 * 60],
    travelSec: [8 * 60, 8 * 60],
    phaseOffsetSec: 60,
  },
  {
    id: '104',
    label: 'Bus 104',
    driver: 'Youssef Sayed',
    color: '#a855f7',
    route: ['centralStation', 'foodCourt'],
    waitSec: [3 * 60, 3 * 60],
    travelSec: [7 * 60, 7 * 60],
    phaseOffsetSec: 200,
  },
]

const LANE_OFFSETS = computeLaneOffsets(BUSES)

export function legBend(bus, legIndex) {
  return LANE_OFFSETS[`${bus.id}:${legIndex}`] ?? 0
}

// Flattens one bus's config into an ordered, looping list of legs:
// { type: 'wait', stop, durationSec } | { type: 'move', from, to, bend, durationSec }
export function buildLegs(bus) {
  const legs = []
  const n = bus.route.length
  for (let i = 0; i < n; i++) {
    const stopKey = bus.route[i]
    const nextKey = bus.route[(i + 1) % n]
    legs.push({ type: 'wait', stop: stopKey, durationSec: bus.waitSec[i] })
    legs.push({
      type: 'move',
      from: stopKey,
      to: nextKey,
      bend: legBend(bus, i),
      durationSec: bus.travelSec[i],
    })
  }
  return legs
}
