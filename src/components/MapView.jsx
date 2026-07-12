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

// A proper dense street grid + city blocks + a park, covering the
// whole canvas, so the map reads like an actual city instead of a
// bare diagram with a couple of decorative lines.
const V_STREETS = [50, 130, 210, 290, 460, 540, 620, 660]
const H_STREETS = [60, 150, 340, 430, 620, 710, 800, 890, 960]
const AVENUES_V = [370]
const AVENUES_H = [230, 540]

function CityBackground() {
  return (
    <>
      {/* Dense minor streets */}
      <g stroke="#16233c" strokeWidth="1.4" fill="none" opacity="0.75">
        {V_STREETS.map((x, i) => (
          <path key={`v${i}`} d={`M ${x} 0 Q ${x + (i % 2 ? 14 : -14)} 500 ${x} 1000`} />
        ))}
        {H_STREETS.map((y, i) => (
          <path key={`h${i}`} d={`M 0 ${y} Q 350 ${y + (i % 2 ? 12 : -12)} 700 ${y}`} />
        ))}
      </g>

      {/* Bolder avenues for hierarchy */}
      <g stroke="#223a63" strokeWidth="3" fill="none" opacity="0.7">
        {AVENUES_V.map((x, i) => (
          <path key={`av${i}`} d={`M ${x} 0 Q ${x - 25} 500 ${x} 1000`} />
        ))}
        {AVENUES_H.map((y, i) => (
          <path key={`ah${i}`} d={`M 0 ${y} Q 350 ${y + 20} 700 ${y}`} />
        ))}
      </g>

      {/* City block texture, checkerboarded across every grid cell */}
      <g fill="#101c30" opacity="0.55">
        {V_STREETS.slice(0, -1).map((x, ci) =>
          H_STREETS.slice(0, -1).map((y, ri) => {
            if ((ci + ri) % 2 !== 0) return null
            const w = (V_STREETS[ci + 1] - x) * 0.62
            const h = (H_STREETS[ri + 1] - y) * 0.62
            if (w < 18 || h < 18) return null
            return <rect key={`b${ci}-${ri}`} x={x + 10} y={y + 10} width={w} height={h} rx="5" />
          })
        )}
      </g>

      {/* Park, with a small pond */}
      <g transform="translate(370, 250)">
        <ellipse rx="88" ry="66" fill="#14532d" opacity="0.6" />
        <ellipse rx="88" ry="66" fill="none" stroke="#4ade80" strokeWidth="1.8" opacity="0.55" />
        <ellipse cx="15" cy="10" rx="28" ry="16" fill="#1d4ed8" opacity="0.5" />
        <text y="-30" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="700" opacity="0.85">City Park</text>
      </g>

      <text x="30" y="500" fill="#3a4d78" fontSize="11" opacity="0.9" transform="rotate(-90 30 500)">Ring Road</text>
      <text x="400" y="45" fill="#3a4d78" fontSize="11" opacity="0.9">Noor Blvd</text>
      <text x="90" y="945" fill="#3a4d78" fontSize="11" opacity="0.9">Compound St</text>
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
            <path d={d} fill="none" stroke="#03060d" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
            {/* Solid colored lane */}
            <path
              d={d}
              fill="none"
              stroke={bus.color}
              strokeWidth="4.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 4px ${bus.color}cc)` }}
            />
            {/* Beaded overlay, flowing to show direction of travel */}
            <path
              d={d}
              fill="none"
              stroke="#f3f6fc"
              strokeWidth="4.6"
              strokeLinecap="round"
              opacity="0.85"
              className="route-beads"
            />
          </g>
        )
      })}
    </>
  )
}

// A small side-view toy bus, always drawn upright — matches the
// reference board's consistent bus icons rather than trying to rotate
// a 2D side-view glyph to face arbitrary directions (which just looks
// like a sliver from some angles).
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
      <g transform="scale(1.5)">
        <BusGlyph color={bus.color} />
      </g>

      {/* Countdown bubble — stays upright regardless of bus heading */}
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
