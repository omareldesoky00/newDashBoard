import RoutePanel from '../RoutePanel.jsx'
import MapView from '../MapView.jsx'
import SideStack from './SideStack.jsx'

export default function MapPage() {
  return (
    <div className="main-grid">
      <MapView />
      <RoutePanel />
      <SideStack />
    </div>
  )
}
