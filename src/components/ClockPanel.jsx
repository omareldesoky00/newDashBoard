import { useCairoClock } from '../hooks/useCairoClock.js'

export default function ClockPanel() {
  const { time, date } = useCairoClock()

  return (
    <div className="card">
      <div className="panel-title">🕒 Current Time</div>
      <div className="clock-time">{time}</div>
      <div className="clock-date">{date}</div>
      <div className="tz-pill">Africa / Cairo</div>
    </div>
  )
}
