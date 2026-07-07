import ArrivalsBoard from '../ArrivalsBoard.jsx'
import SideStack from './SideStack.jsx'

export default function ArrivalsPage() {
  return (
    <div className="main-grid arrivals-grid">
      <div className="arrivals-main">
        <ArrivalsBoard />
      </div>
      <SideStack />
    </div>
  )
}
