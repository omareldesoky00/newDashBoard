import { useEffect, useRef, useState } from 'react'
import { STOPS, buildLegs } from '../data/compound.js'
import { elbowPoint } from '../utils/curve.js'

// A single fixed reference point in time, shared by every bus, so that
// reloading the page keeps everyone roughly in sync instead of each
// bus restarting its journey from scratch.
const EPOCH = new Date('2026-01-01T00:00:00Z').getTime()

// Pure function version of the schedule math, usable outside of React
// (e.g. aggregating fleet-wide counts) without violating rules of hooks.
export function computeBusState(bus, nowMs = Date.now()) {
  const legs = buildLegs(bus)
  const totalDuration = legs.reduce((s, l) => s + l.durationSec, 0)

  const nowSec = (nowMs - EPOCH) / 1000 + (bus.phaseOffsetSec || 0)
  let elapsed = nowSec % totalDuration
  if (elapsed < 0) elapsed += totalDuration

  let acc = 0
  let current = legs[0]
  let into = 0
  for (const leg of legs) {
    if (elapsed < acc + leg.durationSec) {
      current = leg
      into = elapsed - acc
      break
    }
    acc += leg.durationSec
  }

  const remaining = current.durationSec - into
  const progress = current.durationSec > 0 ? into / current.durationSec : 0

  let position, stopName, nextStopName
  if (current.type === 'wait') {
    const stop = STOPS[current.stop]
    position = { x: stop.x, y: stop.y }
    stopName = stop.name
    const idx = legs.indexOf(current)
    const nextMove = legs[(idx + 1) % legs.length]
    nextStopName = STOPS[nextMove.to]?.name
  } else {
    const from = STOPS[current.from]
    const to = STOPS[current.to]
    position = elbowPoint(from, to, progress, current.bend || 0)
    stopName = from.name
    nextStopName = to.name
  }

  return { type: current.type, stopName, nextStopName, remaining, progress, position }
}

/**
 * Drives one bus's live state forever: which leg it's on (waiting at a
 * stop, or moving between two stops), how long is left, and its exact
 * x/y position on the map right now. Updates ~5x/second for a smooth
 * glide, using real wall-clock time so "waits 5 min" really is 5 minutes.
 */
export function useBusSchedule(bus) {
  const [state, setState] = useState(() => computeBusState(bus))
  const rafRef = useRef(null)
  const lastUpdateRef = useRef(0)

  useEffect(() => {
    function frame(ts) {
      if (ts - lastUpdateRef.current > 180) {
        lastUpdateRef.current = ts
        setState(computeBusState(bus))
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bus])

  return state
}
