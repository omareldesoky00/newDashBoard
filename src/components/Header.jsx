import { useCairoClock } from '../hooks/useCairoClock.js'

export default function Header() {
  const { time, date } = useCairoClock()

  return (
    <div className="card header">
      <div className="header-left">
        <div className="logo-badge">🚌</div>
        <div className="header-title">
          <h1>Noor City Bus Dashboard</h1>
          <p>Real-Time Bus Tracking System</p>
        </div>
      </div>
      <div className="header-right">
        <span>{date}</span>
        <span className="clock-big">{time}</span>
        <span className="live-dot"><span className="dot" /> Live</span>
      </div>
    </div>
  )
}
