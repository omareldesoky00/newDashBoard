function Sparkline({ color, seed }) {
  // Deterministic-looking jagged line, purely decorative.
  const points = Array.from({ length: 12 }, (_, i) => {
    const y = 20 - ((Math.sin(i * seed) + 1) / 2) * 16
    return `${i * 10},${y.toFixed(1)}`
  }).join(' ')

  return (
    <svg className="sparkline" viewBox="0 0 110 26" width="110" height="26">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const BUSES = [
  { id: '101', driver: 'Ahmed Hassan', speed: 42, eta: '03:03 PM', color: '#f5941f', iconClass: 'icon-orange', seed: 1.3 },
  { id: '102', driver: 'Mohamed Ali', speed: 35, eta: '02:58 PM', color: '#3b82f6', iconClass: 'icon-blue', seed: 0.9 },
  { id: '103', driver: 'Omar Adel', speed: 51, eta: '02:49 PM', color: '#22c55e', iconClass: 'icon-green', seed: 1.7 },
]

export default function FleetStatus() {
  return (
    <div className="card">
      <div className="fleet-header">
        <h2>Fleet Status</h2>
        <span>3 Active Buses</span>
      </div>

      <div className="fleet-grid">
        {BUSES.map((bus) => (
          <div className="fleet-item" key={bus.id}>
            <div className="fleet-top">
              <div className="fleet-id">
                <div className={`fleet-icon ${bus.iconClass}`}>🚌</div>
                <div>
                  <div className="fleet-name">Bus {bus.id}</div>
                  <div className="fleet-driver">{bus.driver}</div>
                </div>
              </div>
              <span className="status-pill">● On Route</span>
            </div>

            <div className="fleet-bottom">
              <span>⚡ {bus.speed} km/h</span>
              <Sparkline color={bus.color} seed={bus.seed} />
              <span>🕒 ETA {bus.eta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
