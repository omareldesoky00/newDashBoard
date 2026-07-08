import { useEffect, useState } from 'react'
import { computeFleetStats } from '../utils/fleetStats.js'

export function useFleetStats() {
  const [stats, setStats] = useState(() => computeFleetStats())

  useEffect(() => {
    const id = setInterval(() => setStats(computeFleetStats()), 5000)
    return () => clearInterval(id)
  }, [])

  return stats
}
