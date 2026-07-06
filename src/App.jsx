import Header from './components/Header.jsx'
import RoutePanel from './components/RoutePanel.jsx'
import MapView from './components/MapView.jsx'
import WeatherPanel from './components/WeatherPanel.jsx'
import ClockPanel from './components/ClockPanel.jsx'
import FleetStatus from './components/FleetStatus.jsx'

export default function App() {
  return (
    <div className="dashboard">
      <Header />

      <div className="main-grid">
        <RoutePanel />
        <MapView />
        <div className="side-stack">
          <WeatherPanel />
          <ClockPanel />
        </div>
      </div>

      <FleetStatus />
    </div>
  )
}
