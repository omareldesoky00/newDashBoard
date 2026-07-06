export default function RoutePanel() {
  return (
    <div className="card">
      <div className="route-header">
        <div className="logo-badge icon-orange" style={{ width: 40, height: 40, fontSize: 18 }}>🚌</div>
        <div>
          <h2>Noor City Route</h2>
          <span>Bus #101</span>
        </div>
      </div>

      <div className="progress-label">Route Progress</div>
      <div className="stop-list">
        <div className="stop">
          <div className="stop-title">Rehab</div>
          <div className="stop-sub">Next Stop</div>
        </div>
        <div className="stop active">
          <div className="stop-title">Noor City</div>
          <div className="stop-sub current">Current Location</div>
        </div>
        <div className="stop">
          <div className="stop-title">Madinaty</div>
          <div className="stop-sub">Final Stop</div>
        </div>
      </div>

      <div className="mini-stats">
        <div className="mini-stat">📍 30.078°N</div>
        <div className="mini-stat">🧭 31.285°E</div>
        <div className="mini-stat">↔️ <span className="val">15.6 km</span></div>
        <div className="mini-stat">⏱️ <span className="val">28 mins</span></div>
      </div>

      <div className="eta-box">
        <div className="label">Estimated Arrival</div>
        <div className="value">03:03 PM</div>
      </div>
    </div>
  )
}
