'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react'
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

/* ───── YouTube IFrame API: נטען פעם אחת, רק כשכרטיס יוטיוב מגיע למרכז המסך ───── */
type YTPlayer = {
  playVideo: () => void
  pauseVideo: () => void
  destroy: () => void
}
type YTNS = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string
      playerVars: Record<string, string | number>
      events: { onReady?: (e: { target: YTPlayer }) => void; onStateChange?: (e: { data: number }) => void }
    }
  ) => YTPlayer
  PlayerState: { PLAYING: number; ENDED: number; PAUSED: number }
}
declare global {
  interface Window {
    YT?: YTNS
    onYouTubeIframeAPIReady?: () => void
  }
}
let ytPromise: Promise<YTNS> | null = null
function loadYT(): Promise<YTNS> {
  if (ytPromise) return ytPromise
  ytPromise = new Promise(resolve => {
    if (window.YT?.Player) return resolve(window.YT)
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve(window.YT as YTNS)
    }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    s.async = true
    document.head.appendChild(s)
  })
  return ytPromise
}

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
 * כרטיס אחד.
 * - המדיה (תמונת פתיח / metadata) נטענת רק כשהכרטיס מתקרב למסך.
 * - לחיצה אחת מנגנת: לוידאו מהאחסון קוראים play() על אותו אלמנט בתוך מחוות הלחיצה (iOS דורש את זה);
 *   ליוטיוב הנגן נוצר מראש כשהכרטיס במרכז המסך, והלחיצה קוראת playVideo() ישירות.
 * - רק כרטיס אחד מנגן בכל רגע; כרטיס שיוצא מהמסך נעצר.
 */
function Reel({ id, item, dragDist, hidden, playing, onPlay, onStop }: ReelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const ytHost = useRef<HTMLDivElement>(null)
  const player = useRef<YTPlayer | null>(null)
  const pendingPlay = useRef(false)
  const [near, setNear] = useState(false)
  const [focus, setFocus] = useState(false)
  const [wanted, setWanted] = useState(false)
  const [offscreen, setOffscreen] = useState(false)
  const [ready, setReady] = useState(false)

  // near: תמונת פתיח; focus: הכרטיס במרכז המסך (יוטיוב מאתחל נגן)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ioNear = new IntersectionObserver(
      es => {
        if (es.some(e => e.isIntersecting)) {
          setNear(true)
          ioNear.disconnect()
        }
      },
      { rootMargin: '0px 320px 0px 320px' }
    )
    ioNear.observe(el)
    const ioFocus = new IntersectionObserver(
      es =>
        es.forEach(e => {
          setFocus(e.isIntersecting && e.intersectionRatio >= 0.5)
          setOffscreen(!e.isIntersecting || e.intersectionRatio < 0.2)
        }),
      { threshold: [0, 0.2, 0.5] }
    )
    ioFocus.observe(el)
    return () => {
      ioNear.disconnect()
      ioFocus.disconnect()
    }
  }, [])

  // יוטיוב: יוצרים נגן כשהכרטיס במרכז (או בלחיצה), פעם אחת
  useEffect(() => {
    if (item.type !== 'yt' || !(focus || wanted) || hidden || player.current || !ytHost.current) return
    let cancelled = false
    loadYT().then(YT => {
      if (cancelled || !ytHost.current || player.current) return
      // ה-API מחליף את האלמנט ב-iframe — נותנים לו ילד שאנחנו יוצרים, לא את ה-div של React
      const mount = document.createElement('div')
      ytHost.current.appendChild(mount)
      player.current = new YT.Player(mount, {
        videoId: item.id,
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1, controls: 1, origin: location.origin },
        events: {
          onReady: e => {
            setReady(true)
            if (pendingPlay.current) {
              pendingPlay.current = false
              e.target.playVideo()
            }
          },
          onStateChange: e => {
            if (e.data === YT.PlayerState.PLAYING) onPlay(id)
            else if (e.data === YT.PlayerState.ENDED) onStop(id)
          },
        },
      })
    })
    return () => {
      cancelled = true
    }
  }, [focus, wanted, hidden, item, id, onPlay, onStop])

  // יצא מהמסך בזמן ניגון → עוצרים
  useEffect(() => {
    if (!playing || !offscreen) return
    const v = videoRef.current as (HTMLVideoElement & { webkitDisplayingFullscreen?: boolean }) | null
    if (document.fullscreenElement || v?.webkitDisplayingFullscreen) return
    onStop(id)
  }, [offscreen, playing, id, onStop])

  // כרטיס אחר התחיל לנגן / יצא מהמסך → עוצרים כאן
  useEffect(() => {
    if (playing) return
    const v = videoRef.current
    if (v && !v.paused) {
      v.pause()
      v.muted = true
      v.controls = false
    }
    player.current?.pauseVideo()
  }, [playing])

  useEffect(() => () => player.current?.destroy(), [])

  const handlePlay = () => {
    if (dragDist.current > 8) return
    if (item.type === 'vid') {
      const v = videoRef.current
      if (!v) return
      v.muted = false
      v.controls = true
      v.play().catch(() => {})
      onPlay(id)
    } else {
      if (player.current && ready) player.current.playVideo()
      else {
        pendingPlay.current = true
        setWanted(true)
      }
      onPlay(id)
    }
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

  return (
    <div className={`reel${playing ? ' is-playing' : ''}`} ref={ref}>
      {near && item.type === 'vid' && (
        <video
          ref={videoRef}
          src={vidUrl(item.file)}
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={showFirstFrame}
          onEnded={() => onStop(id)}
        />
      )}
      {near && item.type === 'yt' && (
        <>
          <div className="yt-host" ref={ytHost} />
          {!playing && <Image src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt="" fill sizes={REEL_SIZES} quality={60} />}
        </>
      )}
      {near && !playing && (
        <button type="button" className="reel-play" onClick={handlePlay} aria-label="הפעל וידאו" tabIndex={hidden ? -1 : 0}>
          <span className="play-ic" aria-hidden="true" />
        </button>
      )}
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

  const onPlay = useCallback((id: string) => setActive(id), [])
  const onStop = useCallback((id: string) => setActive(cur => (cur === id ? null : cur)), [])

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
        // בזמן ניגון הקרוסלה עוצרת, כדי שהסרטון לא יברח מהמסך
        if (!reduced && !section.querySelector('.reel.is-playing')) off += 0.55
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
      // לא חוטפים את הפוינטר מנגן פעיל (פקדי הוידאו/יוטיוב)
      if ((e.target as HTMLElement).closest('.reel.is-playing')) return
      drag = true
      lastX = e.clientX
      vel = 0
      dragDist.current = 0
      strip.classList.add('dragging')
      // בלי setPointerCapture: הוא גורם ל-click להישלח ל-strip במקום לכפתור ההפעלה
      addEventListener('pointermove', onMove)
      addEventListener('pointerup', onUp)
      addEventListener('pointercancel', onUp)
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
      removeEventListener('pointermove', onMove)
      removeEventListener('pointerup', onUp)
      removeEventListener('pointercancel', onUp)
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
    addEventListener('resize', measure)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
      removeEventListener('resize', measure)
      strip.removeEventListener('pointerdown', onDown)
      onUp()
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
