'use client'

import { useEffect, useRef } from 'react'

/*
 * נרטיב הגלילה: שורות נדלקות בזו אחר זו; שורת "יום ראשון" מפרגמנטים.
 * ההתקדמות מחושבת ב-rAF עם החלקת lerp — חלק יותר מ-scroll event.
 */
export default function Story() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const story = ref.current
    if (!story) return
    const lines = [...story.querySelectorAll<HTMLElement>('.story-line:not(.story-frags),.frag')]
    let raf = 0
    let smooth = 0
    let visible = false
    // הלולאה רצה רק כשהסקשן על המסך (IntersectionObserver) — לא שורפים סוללה בשאר הדף.
    const tick = () => {
      raf = 0
      if (!visible) return
      raf = requestAnimationFrame(tick)
      const total = story.offsetHeight - innerHeight
      const p = Math.min(1, Math.max(0, -story.getBoundingClientRect().top / Math.max(1, total)))
      smooth += (p - smooth) * 0.22
      if (Math.abs(p - smooth) < 0.001) smooth = p
      const lit = Math.ceil(smooth * lines.length)
      lines.forEach((l, i) => l.classList.toggle('lit', i < lit))
    }
    const io = new IntersectionObserver(es => {
      visible = es.some(e => e.isIntersecting)
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })
    io.observe(story)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="story" ref={ref}>
      <div className="story-sticky">
        <div className="story-lines">
          <p className="story-line">אתה מכיר את זה.</p>
          <p className="story-line story-frags">
            <span className="frag">יום ראשון.</span>
            <span className="frag">תפריט חדש.</span>
            <span className="frag">מוטיבציה בשמיים.</span>
          </p>
          <p className="story-line">חודש מושלם שאתה על הדברים.</p>
          <p className="story-line">ואז החיים קורים ודברים.</p>
          <p className="story-line">ואתה חוזר לנקודת ההתחלה.</p>
          <p className="story-line final">לא הפעם.</p>
        </div>
      </div>
      <div className="story-spacer" aria-hidden="true" />
    </section>
  )
}
