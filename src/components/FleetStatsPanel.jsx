import { useFleetStats } from '../hooks/useFleetStats.js'
import { fmtMinutesWords } from '../utils/curve.js'
import { BUSES } from '../data/compound.js'

export default function FleetStatsPanel() {
  const stats = useFleetStats()

  return (
    <div className="card">
      <div className="panel-title">📊 Today's Service</div>
      <div className="fleet-stats-grid">
        <div className="fleet-stat">
          <div className="fleet-stat-val">{stats.tripsToday}</div>
          <div className="fleet-stat-label">Trips completed</div>
        </div>
        <div className="fleet-stat">
          <div className="fleet-stat-val">{stats.onTimePct}%</div>
          <div className="fleet-stat-label">On-time</div>
        </div>
        <div className="fleet-stat">
          <div className="fleet-stat-val">{fmtMinutesWords(stats.avgWaitSec)}</div>
          <div className="fleet-stat-label">Avg wait at stops</div>
        </div>
        <div className="fleet-stat">
          <div className="fleet-stat-val">{stats.totalKm} km</div>
          <div className="fleet-stat-label">Driven today</div>
        </div>
      </div>
      <div className="fleet-mini-legend">
        {BUSES.map((bus) => (
          <div className="legend-row" key={bus.id}>
            <span className="legend-swatch" style={{ background: bus.color }} />
            {bus.label} — {bus.driver}
          </div>
        ))}
      </div>
    </div>
  )
}
