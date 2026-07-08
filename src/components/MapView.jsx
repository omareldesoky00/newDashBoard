import { STOPS, BUSES, legBend } from '../data/compound.js'
import { legPathD } from '../utils/curve.js'
import { useBusSchedule } from '../hooks/useBusSchedule.js'
import { fmtClock } from '../utils/curve.js'
import { BUS_ICON_PATH } from './icons/BusIcon.jsx'

// Small line-art glyphs so stops read as actual places (a gate, a
// clubhouse, a school...) instead of bare dots on a diagram.
function PlaceIcon({ type, color = '#dde5f7' }) {
  switch (type) {
    case 'gate':
      return (
        <g fill={color}>
          <rect x="-9" y="-9" width="4" height="16" rx="1" />
          <rect x="5" y="-9" width="4" height="16" rx="1" />
          <rect x="-10" y="-12" width="20" height="3.5" rx="1.5" />
        </g>
      )
    case 'clubhouse':
      return (
        <g fill={color}>
          <path d="M -10 2 L 0 -10 L 10 2 Z" />
          <rect x="-7.5" y="2" width="15" height="9" />
        </g>
      )
    case 'school':
      return (
        <g fill={color}>
          <path d="M -11 -2 L 0 -13 L 11 -2 Z" />
          <rect x="-10" y="-2" width="20" height="13" />
          <rect x="-7" y="1" width="4" height="4" fill="#0a1220" />
          <rect x="-2" y="1" width="4" height="4" fill="#0a1220" />
          <rect x="3" y="1" width="4" height="4" fill="#0a1220" />
          <rect x="-0.9" y="-16" width="1.8" height="4.5" />
          <path d="M 0.9 -16 L 6 -14 L 0.9 -12 Z" />
        </g>
      )
    case 'sports':
      return (
        <g fill={color}>
          <path d="M -7 -9 H 7 V -5 A 7 7 0 0 1 -7 -5 Z" />
          <rect x="-1.5" y="-2" width="3" height="5" />
          <rect x="-6" y="3" width="12" height="2.5" rx="1.2" />
        </g>
      )
    case 'mall':
      return (
        <g fill={color}>
          <path d="M -10 -7 Q -5 -3 0 -7 Q 5 -3 10 -7 L 10 -3 L -10 -3 Z" />
          <rect x="-8" y="-3" width="16" height="11" />
          <rect x="-3" y="1" width="6" height="7" fill="#0a1220" />
        </g>
      )
    case 'club':
      return (
        <g fill={color}>
          <path d="M -9 -3 L 0 -12 L 9 -3 Z" />
          <rect x="-9" y="-3" width="18" height="12" />
          <circle cx="0" cy="2" r="2.6" fill="#0a1220" />
        </g>
      )
    case 'hospital':
      return (
        <g>
          <path d="M -9 -2 L 0 -10 L 9 -2 Z" fill={color} />
          <rect x="-9" y="-2" width="18" height="12" fill={color} />
          <rect x="-1.3" y="-8" width="2.6" height="8" fill="#ef4444" />
          <rect x="-4.3" y="-5.3" width="8.6" height="2.6" fill="#ef4444" />
        </g>
      )
    default:
      return null
  }
}

function LakeShape({ stop }) {
  return (
    <g transform={`translate(${stop.x}, ${stop.y + 55})`}>
      <ellipse rx="78" ry="46" fill="#2563eb" opacity="0.25" />
      <ellipse rx="78" ry="46" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.55" />
    </g>
  )
}

function RouteLines({ bus }) {
  const n = bus.route.length
  return (
    <>
      {bus.route.map((stopKey, i) => {
        const from = STOPS[stopKey]
        const to = STOPS[bus.route[(i + 1) % n]]
        const d = legPathD(from, to, legBend(bus, i))
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

function StopBuildings() {
  return Object.values(STOPS).map((s) =>
    s.type && s.type !== 'plain' && s.type !== 'lake' ? (
      <g key={s.key} transform={`translate(${s.x}, ${s.y - 46})`}>
        <circle r="19" fill="#0a1220" stroke="#26385c" strokeWidth="1.5" opacity="0.92" />
        <g transform="scale(1.35)">
          <PlaceIcon type={s.type} />
        </g>
      </g>
    ) : null
  )
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
        <svg
          viewBox="0 0 700 1000"
          style={{
            display: 'block',
            aspectRatio: '7 / 10',
            width: 'auto',
            height: 'min(62vh, 1220px)',
            maxWidth: '100%',
            margin: '0 auto',
          }}
        >
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

          <LakeShape stop={STOPS.lakePlaza} />

          {BUSES.map((bus) => (
            <RouteLines key={bus.id} bus={bus} />
          ))}

          <StopMarkers />
          <StopBuildings />
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
