import { BUSES } from '../data/compound.js'
import { useBusSchedule } from '../hooks/useBusSchedule.js'
import { describeBus } from '../utils/describeBus.js'
import { fmtClock } from '../utils/curve.js'

function ArrivalRow({ bus }) {
  const state = useBusSchedule(bus)
  const { headline, sub, tone } = describeBus(bus, state)
  const progressPct = Math.min(100, Math.round(state.progress * 100))

  return (
    <div className={`arrival-row tone-${tone}`}>
      <div className="arrival-left">
        <div className="arrival-badge" style={{ background: bus.color }}>{bus.id}</div>
        <div>
          <div className="arrival-headline">{headline}</div>
          <div className="arrival-sub">{sub}</div>
        </div>
      </div>

      <div className="arrival-right">
        <div className="arrival-countdown">{fmtClock(state.remaining)}</div>
        <div className="arrival-bar-track">
          <div
            className="arrival-bar-fill"
            style={{ width: `${progressPct}%`, background: bus.color }}
          />
        </div>
      </div>
    </div>
  )
}

export default function ArrivalsBoard() {
  return (
    <div className="card">
      <div className="fleet-header">
        <h2>Arrivals Board</h2>
        <span>{BUSES.length} Active Buses</span>
      </div>

      <div className="arrivals-list">
        {BUSES.map((bus) => (
          <ArrivalRow key={bus.id} bus={bus} />
        ))}
      </div>
    </div>
  )
}
