'use client'

import { useEffect, useRef } from 'react'
import Ph from './Ph'

// כיתובים לפי עדויות אמיתיות
const BA_CAPS: Record<number, string> = {
  1: 'שי דוכן, 30 · ירד 20 ק"ג (מ-92 ל-80), חצי שנה של מסה וחיטוב ושינוי הרכב גוף',
  2: 'אושר דדון, 24 · ירד 58 ק"ג בתהליך של שנתיים, מגיל 19 עד 21',
  3: 'מיכאל ליסאיצ׳וק · התחיל בגיל 17, אחרי 2 סבבי מסה וחיטוב עלה מ-68 ל-75 ק"ג עם הרכב גוף חדש',
  4: 'בן בטוניה, 23 · ירד 30 ק"ג בחצי שנה, בנה ביטחון עצמי והתקבל לעבודת החלומות שלו + אימון מנטלי שהכפיל את השכר בשנה הראשונה',
  5: 'דאשה, 23 · הורידה 13 ק"ג בתהליך של חצי שנה, תוך שינוי הרכב גוף',
  6: 'אבי, 25 · ירד 20 ק"ג בחצי שנה ובנה קוביות וגוף חדש בחצי שנה נוספת, כולל תהליך מנטלי ומציאת זוגיות',
}
const BA = [1, 2, 3, 4, 5, 6]

/*
 * סליידר לפני/אחרי: גלילה טבעית (אצבע / עכבר / גלגלת) עם snap.
 * בדסקטופ יש גם תנועה עצלה אוטומטית שנעצרת בהובר/מגע ורצה רק כשהסקשן על המסך.
 */
export default function Testimonials() {
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    if (matchMedia('(hover:none), (pointer:coarse)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return
    let raf = 0
    let visible = false
    let paused = false
    let dir = -1 // RTL: scrollLeft שלילי
    let acc = 0
    const tick = () => {
      raf = 0
      if (!visible) return
      raf = requestAnimationFrame(tick)
      if (paused) return
      acc += 0.45
      if (acc < 1) return
      const step = Math.floor(acc)
      acc -= step
      const max = el.scrollWidth - el.clientWidth
      const pos = Math.abs(el.scrollLeft)
      if (pos >= max - 1) dir = 1
      else if (pos <= 1) dir = -1
      el.scrollLeft += dir * step
    }
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(es => {
      visible = es.some(e => e.isIntersecting)
      if (visible) start()
    })
    io.observe(el)
    const pause = () => (paused = true)
    const resume = () => (paused = false)
    // גרירה עם עכבר (במגע הגלילה טבעית)
    let drag = false
    let lastX = 0
    const onDown = (e: PointerEvent) => {
      paused = true
      if (e.pointerType !== 'mouse') return
      drag = true
      lastX = e.clientX
      el.classList.add('dragging')
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      el.scrollLeft -= e.clientX - lastX
      lastX = e.clientX
    }
    const onUp = () => {
      drag = false
      el.classList.remove('dragging')
    }
    const leave = () => {
      onUp()
      resume()
    }
    el.addEventListener('pointerenter', pause)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
      el.removeEventListener('pointerenter', pause)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <section id="testimonials">
      <div className="testi-head reveal">
        <h2>הם כבר עברו את זה</h2>
        <p className="sec-sub">אנשים אמיתיים. תוצאות אמיתיות. בלי פילטרים.</p>
      </div>

      {/* סליידר לפני/אחרי */}
      <div className="t-slider" ref={sliderRef}>
        <div className="t-track">
          <div className="t-group">
            {BA.map(n => (
              <div className="ba-card" key={n}>
                <Ph img={`ba-${n}.jpeg`} alt={`לפני ואחרי, מתאמן ${n}`} label={`ba-${n}.jpeg (600×760)`} light sizes="(max-width:860px) 72vw, 300px" />
                <div className="cap">{BA_CAPS[n]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
