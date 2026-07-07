// A small "human touch" line: a time-of-day greeting plus a short,
// weather-appropriate comfort tip for Cairo/Noor City.
export function getHumanTouch(cairoDate, weather) {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', hour: '2-digit', hour12: false }).format(
      cairoDate
    )
  )

  let greeting
  if (hour < 5) greeting = 'Quiet night at the compound'
  else if (hour < 12) greeting = 'Good morning'
  else if (hour < 17) greeting = 'Good afternoon'
  else if (hour < 21) greeting = 'Good evening'
  else greeting = 'Good night'

  let tip = 'Have a safe ride today.'
  if (weather) {
    if (weather.temp >= 34) tip = 'Very hot out — carry water on your ride.'
    else if (weather.temp >= 28) tip = 'Warm today — buses are air conditioned.'
    else if (weather.temp <= 16) tip = 'Cool tonight — grab a jacket before you head out.'
    else if (weather.wind >= 25) tip = 'Breezy today — hold onto your hat at the stops.'
  }

  return { greeting, tip }
}
