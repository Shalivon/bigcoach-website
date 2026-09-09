'use client'

import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import { vidUrl } from '@/lib/assets'

type Item = { type: 'yt'; id: string } | { type: 'vid'; file: string }

// מעורבב: אחסון / יוטיוב / אחסון / יוטיוב... (4 יוטיוב + 6 אחסון)
const ITEMS: Item[] = [
  { type: 'vid', file: 'testi-vid-1.mp4' },
  { type: 'yt', id: 'VJTshfTBQIM' },
  { type: 'vid', file: 'testi-vid-2.mp4' },
  { type: 'yt', id: '4N_29s27YKY' },
  { type: 'vid', file: 'testi-vid-3.mp4' },
  { type: 'yt', id: 'dgIMahX3bWE' },
  { type: 'vid', file: 'testi-vid-4.mp4' },
  { type: 'yt', id: 'OxPmbUJZ1cs' },
  { type: 'vid', file: 'testi-vid-5.mp4' },
  { type: 'vid', file: 'testi-vid-6.mp4' },
]

function Reel({ item, dragDist }: { item: Item; dragDist: MutableRefObject<number> }) {
  const [playing, setPlaying] = useState(false)

  const onPlay = () => {
    if (dragDist.current > 8) return
    setPlaying(true)
  }

  const thumb =
    item.type === 'yt' ? (
      <img src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt="" loading="lazy" />
    ) : (
      <video src={vidUrl(item.file)} muted playsInline preload="metadata" />
    )

  const player =
    item.type === 'yt' ? (
      <iframe
        src={`https://www.youtube.com/embed/${item.id}?autoplay=1&rel=0`}
        title="עדות וידאו"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    ) : (
      <video src={vidUrl(item.file)} controls autoPlay playsInline />
    )

  return (
    <div className="reel">
      {playing ? (
        player
      ) : (
        <button type="button" className="reel-play" onClick={onPlay} aria-label="הפעל וידאו">
          {thumb}
          <span className="play-ic" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

/*
 * קרוסלת עדויות הוידאו: סיבוב אוטומטי + גרירה עם אינרציה, 2 קבוצות משוכפלות ללולאה.
 * לחיצה על כרטיס (ללא גרירה) מפעילה נגן מלא במקום.
 */
export default function Reels() {
  const stripRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragDist = useRef(0)

  useEffect(() => {
    const strip = stripRef.current
    const track = trackRef.current
    if (!strip || !track) return
    const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches
    let off = 0,
      gw = 0,
      drag = false,
      lastX = 0,
      vel = 0,
      raf = 0
    const measure = () => {
      gw = track.scrollWidth / 2
    }
    const onDown = (e: PointerEvent) => {
      drag = true
      lastX = e.clientX
      vel = 0
      dragDist.current = 0
      strip.classList.add('dragging')
      strip.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      off += dx
      vel = dx
      dragDist.current += Math.abs(dx)
    }
    const onUp = () => {
      drag = false
      strip.classList.remove('dragging')
    }
    strip.addEventListener('pointerdown', onDown)
    strip.addEventListener('pointermove', onMove)
    strip.addEventListener('pointerup', onUp)
    strip.addEventListener('pointercancel', onUp)
    addEventListener('resize', measure)
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!gw) {
        measure()
        if (!gw) return
      }
      if (!drag) {
        if (!reduced) off += 0.55
        off += vel
        vel *= 0.94
        if (Math.abs(vel) < 0.05) vel = 0
      }
      off = ((off % gw) + gw) % gw
      track.style.transform = `translate3d(${off.toFixed(1)}px,0,0)`
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', measure)
      strip.removeEventListener('pointerdown', onDown)
      strip.removeEventListener('pointermove', onMove)
      strip.removeEventListener('pointerup', onUp)
      strip.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <section id="reels">
      <span className="floater" data-fspeed="-0.06" style={{ top: '18%', right: '12%' }} aria-hidden="true">
        ✦
      </span>
      <div className="reels-head reveal">
        <h2>ככה נראית ההתחלה האחרונה.</h2>
        <p>רגעים אמיתיים מהאימונים, מהסטודיו ומהדרך. בלי פילטרים ובלי תסריט.</p>
      </div>
      <div className="reels-strip reveal" data-d="1" id="reelsStrip" ref={stripRef}>
        <div className="reels-track" id="reelsTrack" ref={trackRef}>
          <div className="reels-group">
            {ITEMS.map((it, i) => (
              <Reel key={i} item={it} dragDist={dragDist} />
            ))}
          </div>
          <div className="reels-group" aria-hidden="true">
            {ITEMS.map((it, i) => (
              <Reel key={i} item={it} dragDist={dragDist} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
