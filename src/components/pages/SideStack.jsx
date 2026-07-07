import WeatherPanel from '../WeatherPanel.jsx'
import ClockPanel from '../ClockPanel.jsx'

export default function SideStack() {
  return (
    <div className="side-stack">
      <WeatherPanel />
      <ClockPanel />
    </div>
  )
}
