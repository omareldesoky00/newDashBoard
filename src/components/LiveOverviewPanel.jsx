import { useEffect, useState } from 'react'
import { BUSES } from '../data/compound.js'
import { computeBusState } from '../hooks/useBusSchedule.js'

function computeCounts() {
  const now = Date.now()
  let inService = 0
  let atStops = 0
  for (const bus of BUSES) {
    const state = computeBusState(bus, now)
    if (state.type === 'wait') atStops++
    else inService++
  }
  // Every bus in this system is always actively running one of its
  // legs — there's no breakdown/maintenance state to simulate — so
  // Out of Service stays honestly at 0 rather than faking a number.
  return { total: BUSES.length, inService, atStops, outOfService: 0 }
}

export default function LiveOverviewPanel() {
  const [counts, setCounts] = useState(computeCounts)

  useEffect(() => {
    const id = setInterval(() => setCounts(computeCounts()), 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="card">
      <div className="panel-title">📡 Live Overview</div>
      <div className="overview-grid">
        <div className="overview-tile">
          <span className="overview-dot" style={{ background: '#60a5fa' }} />
          <div className="overview-val">{counts.total}</div>
          <div className="overview-label">Total Buses</div>
        </div>
        <div className="overview-tile">
          <span className="overview-dot" style={{ background: 'var(--green)' }} />
          <div className="overview-val">{counts.inService}</div>
          <div className="overview-label">In Service</div>
        </div>
        <div className="overview-tile">
          <span className="overview-dot" style={{ background: '#eab308' }} />
          <div className="overview-val">{counts.atStops}</div>
          <div className="overview-label">At Stops</div>
        </div>
        <div className="overview-tile">
          <span className="overview-dot" style={{ background: '#ef4444' }} />
          <div className="overview-val">{counts.outOfService}</div>
          <div className="overview-label">Out of Service</div>
        </div>
      </div>
    </div>
  )
}
