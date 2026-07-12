import MapView from '../MapView.jsx'
import LiveOverviewPanel from '../LiveOverviewPanel.jsx'
import NextArrivalsPanel from '../NextArrivalsPanel.jsx'
import ServiceAlertsPanel from '../ServiceAlertsPanel.jsx'
import BusLinesPanel from '../BusLinesPanel.jsx'

export default function MapPage() {
  return (
    <div className="main-grid">
      <LiveOverviewPanel />
      <MapView />
      <div className="card">
        <div className="panel-title">🚌 Next Arrivals</div>
        <NextArrivalsPanel />
        <ServiceAlertsPanel />
      </div>
      <BusLinesPanel />
    </div>
  )
}
