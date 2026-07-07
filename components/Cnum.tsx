'use client'

import { useEffect, useRef } from 'react'

/* מונה חי — נספר כשנכנס למסך (IntersectionObserver), עם easing */
export default function Cnum({ count }: { count: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      es =>
        es.forEach(en => {
          if (!en.isIntersecting) return
          io.unobserve(en.target)
          if (matchMedia('(prefers-reduced-motion:reduce)').matches) {
            el.textContent = count.toLocaleString('en-US')
            return
          }
          const dur = 1400
          const t0 = performance.now()
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / dur)
            const ease = 1 - Math.pow(1 - p, 3)
            el.textContent = Math.round(count * ease).toLocaleString('en-US')
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }),
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [count])

  return (
    <span ref={ref} className="cnum">
      0
    </span>
  )
}
