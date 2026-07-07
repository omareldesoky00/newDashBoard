import { BUSES } from '../data/compound.js'
import { useBusSchedule } from '../hooks/useBusSchedule.js'
import { describeBus } from '../utils/describeBus.js'
import { fmtClock, fmtMinutesWords } from '../utils/curve.js'
import BusIcon from './icons/BusIcon.jsx'

export default function RoutePanel() {
  const bus = BUSES[0] // Bus 101, the "hero" bus shown in this panel
  const state = useBusSchedule(bus)
  const { headline, sub } = describeBus(bus, state)

  const isWaiting = state.type === 'wait'

  return (
    <div className="card">
      <div className="route-header">
        <div className="logo-badge icon-orange" style={{ width: 40, height: 40 }}>
          <BusIcon size={18} color="#0b1220" />
        </div>
        <div>
          <h2>{bus.label}</h2>
          <span>Driver: {bus.driver}</span>
        </div>
      </div>

      <div className="progress-label">Route Progress</div>
      <div className="stop-list">
        <div className={`stop ${isWaiting ? '' : ''}`}>
          <div className="stop-title">{state.stopName}</div>
          <div className={`stop-sub ${isWaiting ? 'current' : ''}`}>
            {isWaiting ? 'Current Stop' : 'Just departed'}
          </div>
        </div>
        <div className={`stop ${!isWaiting ? 'active' : ''}`}>
          <div className="stop-title">{state.nextStopName}</div>
          <div className={`stop-sub ${!isWaiting ? 'current' : ''}`}>
            {isWaiting ? 'Next Stop' : 'En route now'}
          </div>
        </div>
      </div>

      <div className="mini-stats">
        <div className="mini-stat">🧭 Noor Compound</div>
        <div className="mini-stat">🚏 {bus.route.length} stops</div>
        <div className="mini-stat">👤 <span className="val">{bus.driver}</span></div>
        <div className="mini-stat">⏱️ <span className="val">{fmtMinutesWords(state.remaining)}</span></div>
      </div>

      <div className="eta-box">
        <div className="label">{headline}</div>
        <div className="value">{fmtClock(state.remaining)}</div>
        <div className="eta-sub">{sub}</div>
      </div>
    </div>
  )
}
