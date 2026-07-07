'use client'

import { useEffect, useRef, useState } from 'react'
import Ph from './Ph'
import { Arrow, CloseIcon } from './icons'

/*
 * פופאפ הנחת כוחות הביטחון — נפתח רק אחרי 60% עומק גלילה, פעם בסשן (לא טיימר).
 */
export default function DiscPopup() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [sent, setSent] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const lastFocus = useRef<Element | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('bc-disc-shown') === '1') return
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      if (max > 0 && scrollY / max > 0.6) {
        sessionStorage.setItem('bc-disc-shown', '1')
        removeEventListener('scroll', onScroll)
        lastFocus.current = document.activeElement
        setOpen(true)
      }
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => setVisible(true))
    const focusT = setTimeout(() => phoneRef.current?.focus(), 400)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key !== 'Tab' || !cardRef.current) return
      const els = [...cardRef.current.querySelectorAll<HTMLElement>('button,input,a,[tabindex]')].filter(
        el => !(el as HTMLButtonElement).disabled
      )
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      cancelAnimationFrame(raf)
      clearTimeout(focusT)
      removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function close() {
    setVisible(false)
    setTimeout(() => {
      setOpen(false)
      ;(lastFocus.current as HTMLElement | null)?.focus?.()
    }, 350)
  }

  async function submit() {
    const phone = phoneRef.current
    if (!phone) return
    const val = phone.value.replace(/\D/g, '')
    if (val.length < 9) {
      phone.style.borderColor = 'var(--red)'
      phone.focus()
      return
    }
    setSent(true)
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: val,
          discount: true,
          source: 'bigcoach-website-security-popup',
          ts: new Date().toISOString(),
        }),
      })
    } catch (err) {
      console.error('[lead] submit failed', err)
    }
    setTimeout(close, 1600)
  }

  if (!open) return null

  return (
    <div
      className={`disc-popup-overlay${visible ? ' disc-visible' : ' disc-hidden'}`}
      id="discPopup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discPopupTitle"
      onClick={e => {
        if (e.target === e.currentTarget) close()
      }}
      style={{ display: 'flex' }}
    >
      <div className="disc-popup" id="discPopupCard" ref={cardRef}>
        <div className="disc-popup-img">
          <Ph img="security.jpg" alt="אנשי כוחות הביטחון" label="security.jpg (600×780)" />
        </div>
        <div className="disc-popup-body">
          <button className="disc-close" aria-label="סגור חלון" onClick={close}>
            <CloseIcon />
          </button>
          <div className="disc-bignum">
            15%<span>הנחה</span>
          </div>
          <h2 id="discPopupTitle">
            אתה שומר עלינו.
            <br />
            תן לגולן לשמור עליך.
          </h2>
          <p className="disc-popup-sub">הטבה לאנשי כוחות הביטחון על כל תוכנית ליווי.</p>
          <ul className="disc-checks">
            <li>תוכנית ליווי אישית שמותאמת לשגרת חייל</li>
            <li>תזונה שעובדת עם הכוננויות, לא נגדן</li>
            <li>15% הנחה על כל תוכנית ליווי, בלי תנאים</li>
          </ul>
          <p className="disc-popup-sub2">השאר מספר טלפון ונחזור אליך תוך שעה.</p>
          <div className="disc-form">
            <div className="disc-input-row">
              <label htmlFor="discPhone" className="sr-only">
                מספר טלפון
              </label>
              <input type="tel" id="discPhone" name="phone" placeholder="מספר טלפון" autoComplete="tel" dir="ltr" ref={phoneRef} />
              <button type="button" className="disc-submit" disabled={sent} onClick={submit}>
                {sent ? (
                  'נשלח!'
                ) : (
                  <>
                    שלח
                    <span className="circle">
                      <Arrow />
                    </span>
                  </>
                )}
              </button>
            </div>
            <p className="disc-legal">הפרטים ישמשו ליצירת קשר בלבד ולא יועברו לצד שלישי.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
