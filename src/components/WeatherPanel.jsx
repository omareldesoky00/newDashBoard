import { useWeather } from '../hooks/useWeather.js'
import { useCairoClock } from '../hooks/useCairoClock.js'
import { getHumanTouch } from '../utils/humanTouch.js'

export default function WeatherPanel() {
  const { data, loading, error } = useWeather()
  const { raw } = useCairoClock()
  const { greeting, tip } = getHumanTouch(raw, data)

  return (
    <div className="card">
      <div className="panel-title">☀️ Weather</div>

      {loading && <div style={{ color: 'var(--muted)', fontSize: 13 }}>Loading live weather…</div>}
      {error && <div style={{ color: 'var(--muted)', fontSize: 13 }}>Weather unavailable right now.</div>}

      {data && (
        <>
          <div className="weather-temp">{data.icon} {data.temp}°</div>
          <div className="weather-loc">Cairo, Egypt</div>

          <div className="weather-rows">
            <div className="weather-row">
              <span>💧 Humidity</span>
              <span className="val">{data.humidity}%</span>
            </div>
            <div className="weather-row">
              <span>🌬️ Wind</span>
              <span className="val">{data.wind} km/h</span>
            </div>
          </div>

          <div className="human-touch">
            <div className="human-touch-greeting">{greeting} 👋</div>
            <div className="human-touch-tip">{tip}</div>
          </div>
        </>
      )}
    </div>
  )
}
