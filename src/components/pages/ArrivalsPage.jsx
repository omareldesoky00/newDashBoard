import ArrivalsBoard from '../ArrivalsBoard.jsx'
import SideStack from './SideStack.jsx'
import FleetStatsPanel from '../FleetStatsPanel.jsx'

export default function ArrivalsPage() {
  return (
    <div className="main-grid arrivals-grid">
      <div className="arrivals-main">
        <ArrivalsBoard />
      </div>
      <SideStack />
      <FleetStatsPanel />
    </div>
  )
}
