import Header from './components/Header.jsx'
import SwipeContainer from './components/SwipeContainer.jsx'
import MapPage from './components/pages/MapPage.jsx'
import ArrivalsPage from './components/pages/ArrivalsPage.jsx'
import VideoPage from './components/pages/VideoPage.jsx'

export default function App() {
  return (
    <div className="dashboard">
      <Header />
      <SwipeContainer
        pages={[<MapPage key="map" />, <ArrivalsPage key="arrivals" />, <VideoPage key="video" />]}
        durations={[20000, 20000, 120000]}
      />
    </div>
  )
}
