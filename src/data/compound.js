// A fictional residential compound layout (not real GPS data) used for
// the map canvas, which is 700 x 1000 units (portrait, for a vertical
// street display panel).

export const STOPS = {
  mainGate: { key: 'mainGate', name: 'Main Gate', x: 322, y: 536 },
  clubhouse: { key: 'clubhouse', name: 'Clubhouse', x: 532, y: 161 },
  centralSquare: { key: 'centralSquare', name: 'Central Square', x: 434, y: 339 },
  lakePlaza: { key: 'lakePlaza', name: 'Lake Plaza', x: 560, y: 768 },
  marinaWalk: { key: 'marinaWalk', name: 'Marina Walk', x: 294, y: 821 },
  sportsClub: { key: 'sportsClub', name: 'Sports Club', x: 441, y: 857 },
  schoolZone: { key: 'schoolZone', name: 'School Zone', x: 175, y: 643 },
  residentialB: { key: 'residentialB', name: 'Residential B', x: 105, y: 304 },
}

// Each bus loops forever through: WAIT at route[0] -> MOVE to route[1] ->
// WAIT at route[1] -> MOVE to route[2] -> ... -> MOVE back to route[0].
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
    route: ['mainGate', 'clubhouse', 'centralSquare'],
    waitSec: [5 * 60, 3 * 60, 4 * 60], // wait at mainGate, clubhouse, centralSquare
    travelSec: [10 * 60, 8 * 60, 9 * 60], // mainGate->clubhouse, clubhouse->centralSquare, centralSquare->mainGate
    bend: [72, -60, 48],
    // Offsets each bus so they don't all start in sync.
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
    bend: [-48, 66, -72],
    phaseOffsetSec: 140,
  },
  {
    id: '103',
    label: 'Bus 103',
    driver: 'Omar Adel',
    color: '#22c55e',
    route: ['mainGate', 'marinaWalk', 'schoolZone', 'residentialB'],
    waitSec: [4 * 60, 2 * 60, 3 * 60, 2 * 60],
    travelSec: [9 * 60, 6 * 60, 7 * 60, 11 * 60],
    bend: [-84, 54, -42, 72],
    phaseOffsetSec: 60,
  },
]

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
      bend: bus.bend[i],
      durationSec: bus.travelSec[i],
    })
  }
  return legs
}
