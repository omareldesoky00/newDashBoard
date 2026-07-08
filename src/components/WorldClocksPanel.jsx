import { useEffect, useState } from 'react'

const ZONES = [
  { label: 'Riyadh', flag: '🇸🇦', tz: 'Asia/Riyadh' },
  { label: 'Dubai', flag: '🇦🇪', tz: 'Asia/Dubai' },
  { label: 'London', flag: '🇬🇧', tz: 'Europe/London' },
]

export default function WorldClocksPanel() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="card">
      <div className="panel-title">🌍 World Clocks</div>
      <div className="weather-rows">
        {ZONES.map((z) => {
          const fmt = new Intl.DateTimeFormat('en-US', {
            timeZone: z.tz,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
          return (
            <div className="weather-row" key={z.tz}>
              <span>{z.flag} {z.label}</span>
              <span className="val">{fmt.format(now)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
