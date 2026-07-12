import { useFleetStats } from '../hooks/useFleetStats.js'
import { BUSES } from '../data/compound.js'

// Every bus in this system runs its loop continuously — there's no
// simulated breakdown or road-closure state — so rather than fabricate
// a fake disruption, this reflects the fleet's real on-time number.
export default function ServiceAlertsPanel() {
  const stats = useFleetStats()

  return (
    <div className="service-alert-row">
      <span className="service-alert-icon">✅</span>
      <div>
        <div className="service-alert-headline">All lines operating normally</div>
        <div className="service-alert-sub">{stats.onTimePct}% on-time across {BUSES.length} active buses</div>
      </div>
    </div>
  )
}
