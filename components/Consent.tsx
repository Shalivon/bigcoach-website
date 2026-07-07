'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    bcConsent: string | null
  }
}

/* באנר עוגיות — opt-in פעיל; שום דבר לא-חיוני לא נטען בלי הסכמה */
export default function Consent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('bc-consent')
    window.bcConsent = saved || null
    if (!saved) setShow(true)
  }, [])

  function set(v: 'accepted' | 'rejected') {
    localStorage.setItem('bc-consent', v)
    window.bcConsent = v
    setShow(false)
    /* כאן מפעילים סקריפטים של מדידה/שיווק רק אם v==='accepted' */
  }

  return (
    <div className={`consent${show ? ' show' : ''}`} id="consent" role="region" aria-label="הסכמה לשימוש בעוגיות">
      <div className="consent-inner">
        <p>
          האתר משתמש בעוגיות חיוניות לתפעולו. עוגיות נוספות (כגון מדידה ושיווק) יופעלו רק בהסכמתך הפעילה. ניתן
          לדחות את הכל ולהמשיך לגלוש כרגיל. למידע מלא: <a href="/privacy.html">מדיניות הפרטיות</a>.
        </p>
        <div className="consent-btns">
          <button className="c-accept" onClick={() => set('accepted')}>
            מאשר הכל
          </button>
          <button className="c-reject" onClick={() => set('rejected')}>
            דחה הכל
          </button>
        </div>
      </div>
    </div>
  )
}
