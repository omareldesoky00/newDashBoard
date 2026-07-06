import { useRef } from 'react'
import { useAnimatedBus } from '../hooks/useAnimatedBus.js'

// Route paths (stylised, not real GPS data) drawn on a 1000x560 canvas.
const ROUTE_101 = 'M 460 300 C 520 260, 560 200, 600 170 S 700 120, 760 90' // Noor -> Rehab
const ROUTE_102 = 'M 460 300 C 540 310, 620 340, 680 380 S 760 420, 800 430' // Noor -> Madinaty
const ROUTE_103 = 'M 460 300 C 380 320, 300 340, 250 360 S 300 420, 420 430 S 700 440, 800 430' // Loop

function BusMarker({ pathRef, color, label, durationMs }) {
  const { x, y, angle } = useAnimatedBus(pathRef, durationMs)
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <circle r="13" fill={color} stroke="#0b1220" strokeWidth="3" />
      <text
        x="0"
        y="1"
        transform={`rotate(${-angle})`}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill="#0b1220"
      >
        🚌
      </text>
    </g>
  )
}

export default function MapView() {
  const path101Ref = useRef(null)
  const path102Ref = useRef(null)
  const path103Ref = useRef(null)

  return (
    <div className="map-card card">
      <div className="map-header">
        <h2>Live Route Map</h2>
        <span>Noor City Transportation</span>
      </div>

      <div className="map-canvas-wrap">
        <svg viewBox="0 0 1000 560" width="100%" height="480" style={{ display: 'block' }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#152238" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="560" fill="#0a1220" />
          <rect width="1000" height="560" fill="url(#grid)" />

          {/* Faint background road network for flavor */}
          <g stroke="#223351" strokeWidth="2" fill="none" opacity="0.7">
            <path d="M 0 200 Q 300 150 500 220 T 1000 180" />
            <path d="M 0 380 Q 300 420 500 360 T 1000 400" />
            <path d="M 150 0 Q 200 250 180 560" />
            <path d="M 850 0 Q 800 250 830 560" />
            <path d="M 480 0 L 480 560" opacity="0.4" />
          </g>

          {/* Route lines */}
          <path ref={path101Ref} d={ROUTE_101} fill="none" stroke="#f5941f" strokeWidth="4" strokeLinecap="round" />
          <path ref={path102Ref} d={ROUTE_102} fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
          <path ref={path103Ref} d={ROUTE_103} fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />

          {/* City labels */}
          <text x="700" y="70" className="city-label">New Cairo City</text>
          <text x="720" y="100" className="city-label strong">EL REHAB CITY</text>
          <text x="400" y="285" className="city-label strong">NOOR CITY</text>
          <text x="180" y="380" className="city-label strong">— origin —</text>
          <text x="810" y="455" className="city-label strong">MADINATY</text>

          {/* Hub marker (current location) */}
          <g transform="translate(460,300)">
            <circle r="10" fill="#0a1220" stroke="#3b82f6" strokeWidth="4" />
            <circle r="4" fill="#3b82f6" />
          </g>

          {/* Animated bus markers, each with its own slow speed */}
          <BusMarker pathRef={path101Ref} color="#f5941f" label="101" durationMs={16000} />
          <BusMarker pathRef={path102Ref} color="#3b82f6" label="102" durationMs={19000} />
          <BusMarker pathRef={path103Ref} color="#22c55e" label="103" durationMs={24000} />
        </svg>

        <div className="map-controls">
          <button>+</button>
          <button>−</button>
          <button>⤢</button>
        </div>

        <div className="map-legend">
          <div className="legend-row">
            <span className="legend-swatch" style={{ background: '#f5941f' }} />
            Bus 101 (Rehab)
          </div>
          <div className="legend-row">
            <span className="legend-swatch" style={{ background: '#3b82f6' }} />
            Bus 102 (Madinaty)
          </div>
          <div className="legend-row">
            <span className="legend-swatch" style={{ background: '#22c55e' }} />
            Bus 103 (Loop)
          </div>
        </div>

        <div className="compass">N</div>
      </div>
    </div>
  )
}
