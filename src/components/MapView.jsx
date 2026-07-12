import { STOPS, BUSES, legBend } from '../data/compound.js'
import { legPathD } from '../utils/curve.js'
import { useBusSchedule } from '../hooks/useBusSchedule.js'
import { fmtClock } from '../utils/curve.js'

const HUB_KEY = 'centralStation'

// Small line-art glyphs so stops read as actual places (a school, a
// mall, a hospital...) instead of bare dots on a diagram.
function PlaceIcon({ type, color = '#dde5f7' }) {
  switch (type) {
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
    case 'mall':
      return (
        <g fill={color}>
          <path d="M -10 -7 Q -5 -3 0 -7 Q 5 -3 10 -7 L 10 -3 L -10 -3 Z" />
          <rect x="-8" y="-3" width="16" height="11" />
          <rect x="-3" y="1" width="6" height="7" fill="#0a1220" />
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
    case 'foodcourt':
      return (
        <g>
          <circle r="10" fill="none" stroke={color} strokeWidth="2" />
          <path d="M -4 -6 L 4 6 M 4 -6 L -4 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </g>
      )
    case 'station':
      return (
        <g fill={color}>
          <path d="M -13 -3 Q 0 -17 13 -3 Z" />
          <rect x="-13" y="-3" width="26" height="15" rx="1.5" />
          <rect x="-9" y="2" width="5.5" height="7" fill="#0a1220" />
          <rect x="-2.75" y="2" width="5.5" height="7" fill="#0a1220" />
          <rect x="3.5" y="2" width="5.5" height="7" fill="#0a1220" />
        </g>
      )
    default:
      return null
  }
}

// A loose street grid + a couple of city blocks + a park, so the map
// reads like an actual place instead of a bare diagram on a dot-grid.
function CityBackground() {
  return (
    <>
      <g stroke="#1b2942" strokeWidth="3" fill="none" opacity="0.65">
        <path d="M 0 120 Q 350 90 700 130" />
        <path d="M 0 300 Q 350 340 700 290" />
        <path d="M 0 700 Q 350 730 700 680" />
        <path d="M 0 900 Q 350 870 700 910" />
        <path d="M 90 0 Q 60 500 100 1000" />
        <path d="M 600 0 Q 630 500 580 1000" />
      </g>

      {/* City block texture */}
      <g fill="#101c30" opacity="0.5">
        <rect x="120" y="150" width="90" height="60" rx="6" />
        <rect x="480" y="150" width="90" height="55" rx="6" />
        <rect x="120" y="750" width="90" height="60" rx="6" />
        <rect x="480" y="740" width="90" height="60" rx="6" />
        <rect x="30" y="420" width="70" height="60" rx="6" />
        <rect x="600" y="430" width="70" height="60" rx="6" />
      </g>

      {/* Park */}
      <g transform="translate(350, 275)">
        <ellipse rx="72" ry="54" fill="#14532d" opacity="0.55" />
        <ellipse rx="72" ry="54" fill="none" stroke="#4ade80" strokeWidth="1.6" opacity="0.5" />
        <text y="5" textAnchor="middle" fill="#86efac" fontSize="11" opacity="0.8">City Park</text>
      </g>

      <text x="52" y="640" fill="#33456c" fontSize="11" opacity="0.85" transform="rotate(-90 52 640)">Ring Road</text>
      <text x="470" y="70" fill="#33456c" fontSize="11" opacity="0.85">Noor Blvd</text>
    </>
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
            <path d={d} fill="none" stroke="#03060d" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            {/* Solid colored lane */}
            <path
              d={d}
              fill="none"
              stroke={bus.color}
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 3px ${bus.color}aa)` }}
            />
            {/* Beaded overlay, flowing to show direction of travel */}
            <path
              d={d}
              fill="none"
              stroke="#f3f6fc"
              strokeWidth="3.4"
              strokeLinecap="round"
              opacity="0.8"
              className="route-beads"
            />
          </g>
        )
      })}
    </>
  )
}

// A small side-view bus, rotated to face the direction it's actually
// traveling (or the direction it's about to depart, while parked).
function BusGlyph({ color }) {
  return (
    <g style={{ filter: 'drop-shadow(0 2px 4px #000a)' }}>
      <rect x="-13" y="-7" width="26" height="13" rx="3" fill="#eef2fa" stroke="#0b1220" strokeWidth="1.1" />
      <rect x="-13" y="-7" width="26" height="4.5" rx="2" fill={color} />
      <rect x="-10" y="-1.6" width="5" height="4.6" rx="0.8" fill="#38bdf8" />
      <rect x="-3.5" y="-1.6" width="5" height="4.6" rx="0.8" fill="#38bdf8" />
      <rect x="3" y="-1.6" width="5" height="4.6" rx="0.8" fill="#38bdf8" />
      <circle cx="-7.5" cy="6.3" r="2.4" fill="#0b1220" />
      <circle cx="7.5" cy="6.3" r="2.4" fill="#0b1220" />
      <circle cx="12" cy="-1" r="1.1" fill="#fde68a" />
    </g>
  )
}

function BusMarker({ bus }) {
  const state = useBusSchedule(bus)
  const { x, y } = state.position
  const isWaiting = state.type === 'wait'

  return (
    <g transform={`translate(${x}, ${y})`}>
      {isWaiting && (
        <circle r="20" fill={bus.color} opacity="0.16" className="wait-pulse" />
      )}
      <g transform={`rotate(${state.heading})`}>
        <BusGlyph color={bus.color} />
      </g>

      {/* Countdown bubble — stays upright regardless of bus heading */}
      <g transform="translate(0,-26)">
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

function districtStops() {
  return Object.values(STOPS).filter((s) => s.key !== HUB_KEY)
}

function StopMarkers() {
  return districtStops().map((s) => (
    <g key={s.key} transform={`translate(${s.x}, ${s.y})`}>
      <circle r="5" fill="#0a1220" stroke="#3a4a6b" strokeWidth="2" />
    </g>
  ))
}

function StopBuildings() {
  return districtStops().map((s) => (
    <g key={s.key} transform={`translate(${s.x}, ${s.y - 46})`}>
      <circle r="19" fill="#0a1220" stroke="#26385c" strokeWidth="1.5" opacity="0.92" />
      <g transform="scale(1.35)">
        <PlaceIcon type={s.type} />
      </g>
    </g>
  ))
}

function StopLabels() {
  return districtStops().map((s) => (
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

// Central Station gets its own distinct treatment — bigger badge with
// a dashed ring — since every route runs through it.
function CentralHub() {
  const s = STOPS[HUB_KEY]
  return (
    <g transform={`translate(${s.x}, ${s.y})`}>
      <circle r="42" fill="none" stroke="#f5941f" strokeWidth="1.6" strokeDasharray="4 5" opacity="0.7" />
      <circle r="27" fill="#0a1220" stroke="#f5941f" strokeWidth="2.4" />
      <g transform="scale(1.5)">
        <PlaceIcon type="station" color="#f5941f" />
      </g>
      <text y="60" className="city-label strong" textAnchor="middle" fontSize="14">
        {s.name}
      </text>
    </g>
  )
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
            height: 'min(32vh, 620px)',
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

          <CityBackground />

          {BUSES.map((bus) => (
            <RouteLines key={bus.id} bus={bus} />
          ))}

          <StopMarkers />
          <StopBuildings />
          <StopLabels />
          <CentralHub />

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
