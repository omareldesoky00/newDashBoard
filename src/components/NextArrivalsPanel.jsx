import { useEffect, useState } from 'react'
import { BUSES } from '../data/compound.js'
import { useBusSchedule, computeBusState } from '../hooks/useBusSchedule.js'

function NextArrivalRow({ bus }) {
  const state = useBusSchedule(bus)
  const isWaiting = state.type === 'wait'
  const mins = Math.max(1, Math.round(state.remaining / 60))
  const place = isWaiting ? state.stopName : state.nextStopName
  const verb = isWaiting ? 'Departs' : 'Arrives'

  return (
    <div className="next-arrival-row">
      <span className="arrival-badge next-arrival-badge" style={{ background: bus.color }}>{bus.id}</span>
      <span className="next-arrival-place">{place}</span>
      <span className="next-arrival-mins">
        {verb} {mins} min
      </span>
    </div>
  )
}

function orderBySoonest() {
  return [...BUSES].sort((a, b) => computeBusState(a).remaining - computeBusState(b).remaining)
}

export default function NextArrivalsPanel() {
  const [order, setOrder] = useState(orderBySoonest)

  useEffect(() => {
    const id = setInterval(() => setOrder(orderBySoonest()), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="next-arrivals-list">
      {order.slice(0, 5).map((bus) => (
        <NextArrivalRow key={bus.id} bus={bus} />
      ))}
    </div>
  )
}
