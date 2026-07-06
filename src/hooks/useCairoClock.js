import { useEffect, useState } from 'react'

// Always shows real Cairo local time, no matter where the viewer is,
// by formatting the current instant with the Africa/Cairo timezone.
export function useCairoClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Cairo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  const dateFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Cairo',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return {
    time: timeFmt.format(now),
    date: dateFmt.format(now),
    raw: now,
  }
}
