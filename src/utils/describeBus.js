import { fmtClock, fmtMinutesWords } from './curve.js'

// Produces a varied, human-sounding status line for an arrivals board,
// given the live state from useBusSchedule.
export function describeBus(bus, state) {
  const { type, stopName, nextStopName, remaining } = state

  if (type === 'wait') {
    if (remaining <= 20) {
      return { headline: `Boarding now at ${stopName}`, sub: `Departs in ${fmtClock(remaining)}`, tone: 'urgent' }
    }
    if (remaining <= 60) {
      return { headline: `Doors open — ${stopName}`, sub: `Departs in ${fmtClock(remaining)}`, tone: 'soon' }
    }
    return {
      headline: `Waiting at ${stopName}`,
      sub: `Departs for ${nextStopName} in ${fmtMinutesWords(remaining)}`,
      tone: 'waiting',
    }
  }

  // moving
  if (remaining <= 20) {
    return { headline: `Arriving at ${nextStopName}`, sub: `Pulling in now`, tone: 'urgent' }
  }
  if (remaining <= 60) {
    return {
      headline: `Approaching ${nextStopName}`,
      sub: `Arriving in ${fmtClock(remaining)}`,
      tone: 'soon',
    }
  }
  return {
    headline: `En route to ${nextStopName}`,
    sub: `Arriving in ${fmtMinutesWords(remaining)} — departed ${stopName}`,
    tone: 'moving',
  }
}
