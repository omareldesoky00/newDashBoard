import { BUSES, STOPS } from '../data/compound.js'

export default function BusLinesPanel() {
  return (
    <div className="card">
      <div className="panel-title">🚏 Bus Lines</div>
      <div className="bus-lines-grid">
        {BUSES.map((bus) => (
          <div className="bus-line-row" key={bus.id}>
            <span className="arrival-badge bus-line-badge" style={{ background: bus.color }}>{bus.id}</span>
            <span className="bus-line-route">
              {STOPS[bus.route[0]].name} – {STOPS[bus.route[1]].name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
