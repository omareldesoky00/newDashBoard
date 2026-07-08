import WeatherPanel from '../WeatherPanel.jsx'
import ClockPanel from '../ClockPanel.jsx'
import WorldClocksPanel from '../WorldClocksPanel.jsx'

export default function SideStack() {
  return (
    <div className="side-stack">
      <WeatherPanel />
      <div className="clock-column">
        <ClockPanel />
        <WorldClocksPanel />
      </div>
    </div>
  )
}
