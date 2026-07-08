import { computeLaneOffsets } from '../utils/laneOffsets.js'

// A fictional residential compound layout (not real GPS data) used for
// the map canvas, which is 700 x 1000 units (portrait, for a vertical
// street display panel). `type` drives which little building/place
// icon is drawn for that stop (see BUILDING_ICONS in MapView.jsx).
//
// mainGate sits on the bottom edge of the canvas — it's the compound's
// actual entrance, so it belongs on the boundary, not floating in the
// middle of the map.
export const STOPS = {
  mainGate: { key: 'mainGate', name: 'Main Gate', x: 360, y: 980, type: 'gate' },
  centralSquare: { key: 'centralSquare', name: 'Central Square', x: 380, y: 620, type: 'plain' },
  clubhouse: { key: 'clubhouse', name: 'Clubhouse', x: 520, y: 220, type: 'clubhouse' },
  lakePlaza: { key: 'lakePlaza', name: 'Lake Plaza', x: 610, y: 480, type: 'lake' },
  sportsClub: { key: 'sportsClub', name: 'Sports Club', x: 520, y: 830, type: 'sports' },
  schoolZone: { key: 'schoolZone', name: 'School Zone', x: 160, y: 780, type: 'school' },
  noorHospital: { key: 'noorHospital', name: 'Noor Hospital', x: 140, y: 460, type: 'hospital' },
  noorMall: { key: 'noorMall', name: 'Noor Mall', x: 630, y: 720, type: 'mall' },
  noorClub: { key: 'noorClub', name: 'Noor Club', x: 170, y: 240, type: 'club' },
}

// Each bus loops forever through: WAIT at route[0] -> MOVE to route[1] ->
// WAIT at route[1] -> MOVE to route[2] -> ... -> MOVE back to route[0].
//
// waitSec / travelSec are REAL seconds. If waitSec is 300, the bus will
// genuinely sit at the stop, counting down, for 5 real minutes before
// it starts moving — same as a real arrivals board.
//
// There's no per-bus `bend` here anymore — curve shape is computed
// automatically from route topology (see laneOffsets.js), so routes
// that share a road always fan out instead of overlapping, no matter
// how many buses get added later.
export const BUSES = [
  {
    id: '101',
    label: 'Bus 101',
    driver: 'Ahmed Hassan',
    color: '#f5941f',
    route: ['mainGate', 'centralSquare', 'clubhouse'],
    waitSec: [5 * 60, 3 * 60, 4 * 60],
    travelSec: [10 * 60, 8 * 60, 9 * 60],
    phaseOffsetSec: 0,
  },
  {
    id: '102',
    label: 'Bus 102',
    driver: 'Mohamed Ali',
    color: '#3b82f6',
    route: ['centralSquare', 'lakePlaza', 'sportsClub'],
    waitSec: [3 * 60, 2 * 60, 3 * 60],
    travelSec: [7 * 60, 5 * 60, 6 * 60],
    phaseOffsetSec: 140,
  },
  {
    id: '103',
    label: 'Bus 103',
    driver: 'Omar Adel',
    color: '#22c55e',
    route: ['mainGate', 'schoolZone', 'noorHospital'],
    waitSec: [4 * 60, 2 * 60, 3 * 60],
    travelSec: [9 * 60, 6 * 60, 10 * 60],
    phaseOffsetSec: 60,
  },
  {
    id: '104',
    label: 'Bus 104',
    driver: 'Youssef Sayed',
    color: '#a855f7',
    route: ['clubhouse', 'noorMall', 'lakePlaza'],
    waitSec: [3 * 60, 3 * 60, 2 * 60],
    travelSec: [8 * 60, 6 * 60, 7 * 60],
    phaseOffsetSec: 200,
  },
  {
    id: '105',
    label: 'Bus 105',
    driver: 'Khaled Nour',
    color: '#06b6d4',
    route: ['schoolZone', 'centralSquare', 'sportsClub'],
    waitSec: [2 * 60, 3 * 60, 4 * 60],
    travelSec: [6 * 60, 5 * 60, 8 * 60],
    phaseOffsetSec: 90,
  },
  {
    // Same route/lane as Bus 101, offset by roughly half the loop so
    // one is always waiting at a stop while the other is en route —
    // a second bus on a busy line for shorter frequency.
    id: '106',
    label: 'Bus 106',
    driver: 'Mostafa Kamal',
    color: '#eab308',
    route: ['mainGate', 'centralSquare', 'clubhouse'],
    waitSec: [5 * 60, 3 * 60, 4 * 60],
    travelSec: [10 * 60, 8 * 60, 9 * 60],
    phaseOffsetSec: 1170,
  },
  {
    id: '107',
    label: 'Bus 107',
    driver: 'Hana Fathy',
    color: '#f43f5e',
    route: ['mainGate', 'noorClub', 'schoolZone'],
    waitSec: [3 * 60, 2 * 60, 3 * 60],
    travelSec: [7 * 60, 6 * 60, 8 * 60],
    phaseOffsetSec: 250,
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
