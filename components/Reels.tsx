'use client'

import Image from 'next/image'
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

const REEL_SIZES = '(max-width:680px) 76vw, (max-width:860px) 62vw, (max-width:1180px) 42vw, 280px'
// מגע (טלפון/טאבלט): גלילה טבעית עם snap, כרטיס אחד בכל פעם. עכבר: קרוסלה אוטומטית + גרירה.
const TOUCH_QUERY = '(hover:none), (pointer:coarse)'

type ReelProps = {
  id: string
  item: Item
  dragDist: MutableRefObject<number>
  hidden?: boolean
  playing: boolean
  onPlay: (id: string) => void
  onStop: (id: string) => void
}

/*
 * כרטיס אחד. המדיה (תמונת פתיח / metadata של הוידאו) נטענת רק כשהכרטיס מתקרב למסך —
 * כך במובייל לא נורים 12 בקשות וידאו בטעינת הדף. לחיצה (ללא גרירה) מחליפה לנגן מלא.
 * רק כרטיס אחד מנגן בכל רגע; כרטיס שיוצא מהמסך חוזר לתמונת הפתיח.
 */
function Reel({ id, item, dragDist, hidden, playing, onPlay, onStop }: ReelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    const io = new IntersectionObserver(
      es => {
        if (es.some(e => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 320px 0px 320px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  // יצא מהמסך בזמן ניגון → עוצרים
  useEffect(() => {
    const el = ref.current
    if (!el || !playing) return
    const io = new IntersectionObserver(
      es => {
        if (es.some(e => !e.isIntersecting || e.intersectionRatio < 0.4)) onStop(id)
      },
      { threshold: [0, 0.4] }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [playing, id, onStop])

  const handlePlay = () => {
    if (dragDist.current > 8) return
    onPlay(id)
  }

  // iOS לא מצייר פריים ראשון בלי seek קטן.
  const showFirstFrame = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget
    if (v.currentTime === 0) {
      try {
        v.currentTime = 0.01
      } catch {
        /* ignore */
      }
    }
  }

  let media: React.ReactNode = null
  if (near) {
    if (playing) {
      media =
        item.type === 'yt' ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0&playsinline=1`}
            title="עדות וידאו"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={vidUrl(item.file)} controls autoPlay playsInline preload="auto" onEnded={() => onStop(id)} />
        )
    } else {
      const thumb =
        item.type === 'yt' ? (
          <Image src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt="" fill sizes={REEL_SIZES} quality={60} />
        ) : (
          <video src={vidUrl(item.file)} muted playsInline preload="metadata" onLoadedMetadata={showFirstFrame} />
        )
      media = (
        <button type="button" className="reel-play" onClick={handlePlay} aria-label="הפעל וידאו" tabIndex={hidden ? -1 : 0}>
          {thumb}
          <span className="play-ic" aria-hidden="true" />
        </button>
      )
    }
  }

  return (
    <div className={`reel${playing ? ' is-playing' : ''}`} ref={ref}>
      {media}
    </div>
  )
}

/*
 * קרוסלת עדויות הוידאו.
 * עכבר: סיבוב אוטומטי + גרירה עם אינרציה, 2 קבוצות משוכפלות ללולאה; הלולאה רצה רק כשהסקשן על המסך.
 * מגע: גלילה טבעית עם scroll-snap (CSS) — בלי JS על התנועה, הקבוצה המשוכפלת מוסתרת.
 */
export default function Reels() {
  const sectionRef = useRef<HTMLElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragDist = useRef(0)
  const [active, setActive] = useState<string | null>(null)

  const onPlay = (id: string) => setActive(id)
  const onStop = (id: string) => setActive(cur => (cur === id ? null : cur))

  useEffect(() => {
    const section = sectionRef.current
    const strip = stripRef.current
    const track = trackRef.current
    if (!section || !strip || !track) return
    if (matchMedia(TOUCH_QUERY).matches) return
    const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches
    let off = 0,
      gw = 0,
      drag = false,
      lastX = 0,
      vel = 0,
      raf = 0,
      visible = false
    const measure = () => {
      gw = track.scrollWidth / 2
    }
    const loop = () => {
      raf = 0
      if (!visible) return
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
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop)
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
    const io = new IntersectionObserver(
      es => {
        visible = es.some(e => e.isIntersecting)
        if (visible) start()
      },
      { rootMargin: '120px 0px' }
    )
    io.observe(section)
    strip.addEventListener('pointerdown', onDown)
    strip.addEventListener('pointermove', onMove)
    strip.addEventListener('pointerup', onUp)
    strip.addEventListener('pointercancel', onUp)
    addEventListener('resize', measure)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
      removeEventListener('resize', measure)
      strip.removeEventListener('pointerdown', onDown)
      strip.removeEventListener('pointermove', onMove)
      strip.removeEventListener('pointerup', onUp)
      strip.removeEventListener('pointercancel', onUp)
    }
  }, [])

  const group = (prefix: string, hidden?: boolean) =>
    ITEMS.map((it, i) => {
      const id = `${prefix}-${i}`
      return (
        <Reel key={id} id={id} item={it} dragDist={dragDist} hidden={hidden} playing={active === id} onPlay={onPlay} onStop={onStop} />
      )
    })

  return (
    <section id="reels" ref={sectionRef}>
      <span className="floater" data-fspeed="-0.06" style={{ top: '18%', right: '12%' }} aria-hidden="true">
        ✦
      </span>
      <div className="reels-head reveal">
        <h2>ככה נראית ההתחלה האחרונה.</h2>
        <p>רגעים אמיתיים מהאימונים, מהסטודיו ומהדרך. בלי פילטרים ובלי תסריט.</p>
      </div>
      <div className="reels-strip reveal" data-d="1" id="reelsStrip" ref={stripRef}>
        <div className="reels-track" id="reelsTrack" ref={trackRef}>
          <div className="reels-group">{group('a')}</div>
          <div className="reels-group" aria-hidden="true">
            {group('b', true)}
          </div>
        </div>
      </div>
    </section>
  )
}
