import { useEffect, useState } from 'react'

// Noor City / New Cairo coordinates
const LAT = 30.078
const LON = 31.285

const WEATHER_ICON = (code) => {
  if (code === 0) return '☀️'
  if ([1, 2].includes(code)) return '🌤️'
  if (code === 3) return '☁️'
  if ([45, 48].includes(code)) return '🌫️'
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️'
  if ([71, 73, 75, 85, 86].includes(code)) return '🌨️'
  if ([95, 96, 99].includes(code)) return '⛈️'
  return '🌡️'
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
const windCompass = (deg) => COMPASS[Math.round(deg / 45) % 8]

const fmtHM = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Africa/Cairo' })

export function useWeather({ pollMs = 10 * 60 * 1000 } = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,weather_code&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Africa%2FCairo`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Weather request failed: ${res.status}`)
        const json = await res.json()
        if (cancelled) return
        setData({
          temp: Math.round(json.current.temperature_2m),
          feelsLike: Math.round(json.current.apparent_temperature),
          humidity: Math.round(json.current.relative_humidity_2m),
          wind: Math.round(json.current.wind_speed_10m),
          windDir: windCompass(json.current.wind_direction_10m),
          pressure: Math.round(json.current.pressure_msl),
          cloudCover: Math.round(json.current.cloud_cover),
          icon: WEATHER_ICON(json.current.weather_code),
          high: Math.round(json.daily.temperature_2m_max[0]),
          low: Math.round(json.daily.temperature_2m_min[0]),
          uvIndex: Math.round(json.daily.uv_index_max[0]),
          sunrise: fmtHM(json.daily.sunrise[0]),
          sunset: fmtHM(json.daily.sunset[0]),
        })
        setError(null)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchWeather()
    const id = setInterval(fetchWeather, pollMs)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [pollMs])

  return { data, error, loading }
}
