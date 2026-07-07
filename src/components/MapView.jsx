import { STOPS, BUSES } from '../data/compound.js'
import { legPathD } from '../utils/curve.js'
import { useBusSchedule } from '../hooks/useBusSchedule.js'
import { fmtClock } from '../utils/curve.js'
import { BUS_ICON_PATH } from './icons/BusIcon.jsx'

function RouteLines({ bus }) {
  const n = bus.route.length
  return (
    <>
      {bus.route.map((stopKey, i) => {
        const from = STOPS[stopKey]
        const to = STOPS[bus.route[(i + 1) % n]]
        const d = legPathD(from, to, bus.bend[i])
        return (
          <g key={`${bus.id}-${i}`}>
            {/* Dark casing gives the lane contrast against the grid, like a real road */}
            <path d={d} fill="none" stroke="#03060d" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            <path
              d={d}
              fill="none"
              stroke={bus.color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="route-glow"
              style={{ filter: `drop-shadow(0 0 7px ${bus.color}cc)` }}
            />
          </g>
        )
      })}
    </>
  )
}

function BusMarker({ bus }) {
  const state = useBusSchedule(bus)
  const { x, y } = state.position
  const isWaiting = state.type === 'wait'

  return (
    <g transform={`translate(${x}, ${y})`}>
      {isWaiting && (
        <circle r="22" fill={bus.color} opacity="0.16" className="wait-pulse" />
      )}
      <rect
        x="-17"
        y="-17"
        width="34"
        height="34"
        rx="11"
        fill="#0b1220"
        stroke={bus.color}
        strokeWidth="3"
        style={{ filter: `drop-shadow(0 2px 6px #000a)` }}
      />
      <g transform="translate(-11, -11)">
        <path d={BUS_ICON_PATH} transform="scale(0.92)" fill="#eef2fa" />
      </g>

      {/* Countdown bubble */}
      <g transform="translate(0,-32)">
        <rect
          x={-24}
          y={-13}
          width="48"
          height="18"
          rx="9"
          fill="#0c1728"
          stroke={bus.color}
          strokeWidth="1.4"
        />
        <text x="0" y="0.5" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#eef2fa" fontFamily="JetBrains Mono, monospace">
          {fmtClock(state.remaining)}
        </text>
      </g>
    </g>
  )
}

function StopMarkers() {
  return Object.values(STOPS).map((s) => (
    <g key={s.key} transform={`translate(${s.x}, ${s.y})`}>
      <circle r="5" fill="#0a1220" stroke="#3a4a6b" strokeWidth="2" />
    </g>
  ))
}

function StopLabels() {
  return Object.values(STOPS).map((s) => (
    <text
      key={s.key}
      x={s.x}
      y={s.y - 14}
      className="city-label strong"
      textAnchor="middle"
    >
      {s.name}
    </text>
  ))
}

export default function MapView() {
  return (
    <div className="map-card card">
      <div className="map-header">
        <h2>Live Route Map</h2>
        <span>Noor Compound Transportation</span>
      </div>

      <div className="map-canvas-wrap">
        <svg viewBox="0 0 700 1000" width="100%" style={{ display: 'block', aspectRatio: '7 / 10' }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#152238" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="700" height="1000" fill="#0a1220" />
          <rect width="700" height="1000" fill="url(#grid)" />

          {/* Faint background road network for flavor */}
          <g stroke="#223351" strokeWidth="2" fill="none" opacity="0.55">
            <path d="M 0 357 Q 210 268 350 393 T 700 321" />
            <path d="M 0 679 Q 210 750 350 643 T 700 714" />
            <path d="M 105 0 Q 140 446 126 1000" />
            <path d="M 595 0 Q 560 446 581 1000" />
          </g>

          {BUSES.map((bus) => (
            <RouteLines key={bus.id} bus={bus} />
          ))}

          <StopMarkers />
          <StopLabels />

          {BUSES.map((bus) => (
            <BusMarker key={bus.id} bus={bus} />
          ))}
        </svg>

        <div className="map-controls">
          <button>+</button>
          <button>−</button>
          <button>⤢</button>
        </div>

        <div className="map-legend">
          {BUSES.map((bus) => (
            <div className="legend-row" key={bus.id}>
              <span className="legend-swatch" style={{ background: bus.color }} />
              {bus.label} — {bus.driver}
            </div>
          ))}
        </div>

        <div className="compass">N</div>
      </div>
    </div>
  )
}
