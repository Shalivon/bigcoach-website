'use client'

import { useEffect, useRef, useState } from 'react'

const VIDS = ['vid-1.mp4', 'vid-2.mp4', 'vid-3.mp4', 'vid-4.mp4', 'vid-5.mp4', 'vid-6.mp4']

function Reel({ vid }: { vid: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [err, setErr] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      es =>
        es.forEach(en => {
          const v = en.target.querySelector('video')
          if (!v) return
          if (en.isIntersecting) v.play().catch(() => {})
          else v.pause()
        }),
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reel ph${loaded ? ' has-img' : ''}`} data-label={`${vid} (1080×1920)`}>
      {!err && (
        <video
          src={`/assets/vid/${vid}`}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          onError={() => setErr(true)}
        />
      )}
    </div>
  )
}

/*
 * קרוסלת הסרטונים: סיבוב אוטומטי + גרירה עם אינרציה, 2 קבוצות משוכפלות ללולאה.
 * הכל רץ ב-rAF יחיד עם transform — ללא reflow.
 */
export default function Reels() {
  const stripRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

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
      strip.classList.add('dragging')
      strip.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      off += dx
      vel = dx
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
            {VIDS.map(v => (
              <Reel key={v} vid={v} />
            ))}
          </div>
          <div className="reels-group" aria-hidden="true">
            {VIDS.map(v => (
              <Reel key={v} vid={v} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
