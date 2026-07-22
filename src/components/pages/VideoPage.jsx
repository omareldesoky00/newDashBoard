import { useEffect, useState } from 'react'

const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/announcement.mp4`

export default function VideoPage({ active }) {
  // Bumping playKey forces the video to remount, so it always
  // restarts from 0:00 each time this page swipes back into view.
  const [playKey, setPlayKey] = useState(0)

  useEffect(() => {
    if (active) setPlayKey((k) => k + 1)
  }, [active])

  return (
    <div className="video-page">
      <div className="video-frame-wrap">
       {active && (
  <div className="video-frame-fg">
    <video
      key={playKey}
      className="video-frame"
      src={VIDEO_SRC}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onLoadedMetadata={(event) => {
        event.currentTarget.playbackRate = 1
      }}
    />
  </div>
)}
      </div>
    </div>
  )
}
