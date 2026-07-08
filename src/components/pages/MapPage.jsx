import RoutePanel from '../RoutePanel.jsx'
import MapView from '../MapView.jsx'

export default function MapPage() {
  return (
    <div className="main-grid">
      <MapView />
      <RoutePanel />
    </div>
  )
}
