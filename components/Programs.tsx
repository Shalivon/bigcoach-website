'use client'

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import Ph from './Ph'
import { Arrow, Mask } from './icons'
import { WA_ONLINE, WA_GROUP, WA_PERSONAL, WA_BOXING, WA_MENTAL } from '@/lib/links'

type Prog = {
  key: string
  title: ReactNode
  cap: string
  img: string
  imgLabel: string
  detailTitle: ReactNode
  detailSub: string
  thumb: string
  thumbLabel: string
  text: ReactNode
  rows: { k: string; v: ReactNode }[]
  wa: string
}

const PROGS: Prog[] = [
  {
    key: 'online',
    title: 'ליווי האונליין',
    cap: 'ליווי מלא מכל מקום בארץ, בלי מסגרת פיזית.',
    img: 'prog-online.jpg',
    imgLabel: 'prog-online.jpg (1920×1080)',
    detailTitle: (
      <>
        ליווי
        <br />
        אונליין
      </>
    ),
    detailSub: 'תזונה | אימונים | מנטלי | מכל מקום.',
    thumb: 'prog-online-thumb.jpg',
    thumbLabel: 'prog-online-thumb.jpg',
    text: (
      <>
        תכנית אימונים ותפריט תזונה שנבנים על סמך הנתונים <em>שלך</em> ומתעדכנים בכל שבוע מחדש בהתאם לצרכים שלך
        ואפליקציית מעקב חכמה שמרכזת הכל. מעקב צמוד, התאמות בזמן אמת, ואותי זמין לך בוואטסאפ.
      </>
    ),
    rows: [
      { k: 'עדכון תכנית', v: 'כל שבוע' },
      { k: 'תקשורת', v: 'רציפה ישירות איתי' },
      { k: 'עלות חודשית', v: 'החל מ-690 ש"ח' },
    ],
    wa: WA_ONLINE,
  },
  {
    key: 'group',
    title: (
      <>
        ליווי אונליין &amp;
        <br />
        אימוני קבוצה
      </>
    ),
    cap: 'המסלול הכי נמכר. מסגרת, אנשים ותוצאה.',
    img: 'prog-group.jpg',
    imgLabel: 'prog-group.jpg (1920×1080)',
    detailTitle: (
      <>
        ליווי ואימונים
        <br />
        קבוצתיים
      </>
    ),
    detailSub: 'אנרגיה של קבוצה | יחס 1:1 | ליווי +',
    thumb: 'prog-group-thumb.jpg',
    thumbLabel: 'prog-group-thumb.jpg',
    text: (
      <>
        בנוסף לליווי הצמוד שלי, אתה מקבל אימונים קבוצתיים (עד 5 מתאמנים בקבוצה) בסטודיו שלנו. תפריט, תכנית אימונים
        ומאמן פיזי שזמין לכם בסטודיו להכוונה מדויקת בלייב. המסלול המבוקש ביותר לבאר שבעיים, ולא במקרה.
      </>
    ),
    rows: [
      { k: 'מיקום', v: 'ח"נ ביאליק 137, באר שבע' },
      { k: 'כולל', v: 'אימונים + תפריט + מעקב צמוד' },
      { k: 'עלות חודשית', v: 'החל מ-990 ש"ח' },
    ],
    wa: WA_GROUP,
  },
  {
    key: 'personal',
    title: (
      <>
        ליווי אונליין &amp;
        <br />
        אימונים אישיים
      </>
    ),
    cap: 'המסלול המהיר. אחד על אחד עם גולן.',
    img: 'prog-personal.jpg',
    imgLabel: 'prog-personal.jpg (1920×1080)',
    detailTitle: (
      <>
        מסלול ליווי
        <br />
        פרימיום
      </>
    ),
    detailSub: '100% מתשומת הלב עלייך. גם באימונים.',
    thumb: 'prog-personal-thumb.jpg',
    thumbLabel: 'prog-personal-thumb.jpg',
    text: (
      <>
        אימונים אישיים עם גולן בסטודיו, בתדירות שמתאימה לך, יחד עם מעטפת תזונה וליווי מלאה. הדרך המהירה והטובה
        ביותר לתוצאה תוך כדי עבודה מדויקת ונכונה.
      </>
    ),
    rows: [
      { k: 'תדירות', v: 'עד 3 אימונים אישיים בשבוע' },
      {
        k: 'כולל',
        v: (
          <>
            תכנית מלאה + אימונים <em>איתי</em>
          </>
        ),
      },
      { k: 'עלות חודשית', v: 'החל מ-990 ש"ח' },
    ],
    wa: WA_PERSONAL,
  },
  {
    key: 'boxing',
    title: (
      <>
        BIG
        <br />
        BOX
      </>
    ),
    cap: 'טכניקה, זיעה ופורקן, גם למתחילים מאפס.',
    img: 'prog-boxing.jpg',
    imgLabel: 'prog-boxing.jpg (1920×1080)',
    detailTitle: (
      <>
        אגרוף
        <br />
        BIG BOX
      </>
    ),
    detailSub: 'כושר, ביטחון ופורקן. בשיעור אחד.',
    thumb: 'prog-boxing-thumb.jpg',
    thumbLabel: 'prog-boxing-thumb.jpg',
    text: (
      <>
        שיעורי אגרוף קבוצתיים בסטודיו. טכניקה אמיתית, עבודה על שקיות וכפפות, וכושר שמרגישים אחרי שבוע. מתאים גם
        למתחילים מאפס.
      </>
    ),
    rows: [
      { k: 'רמה', v: 'מתחילים עד מתקדמים' },
      { k: 'מיקום', v: 'ח"נ ביאליק 137, באר שבע' },
      { k: 'עלות חודשית', v: '₪[מחיר] / חודש' },
    ],
    wa: WA_BOXING,
  },
  {
    key: 'mental',
    title: 'ליווי מנטלי',
    cap: 'העבודה הפנימית שמחזיקה את הכל.',
    img: 'prog-mental.jpg',
    imgLabel: 'prog-mental.jpg (1920×1080)',
    detailTitle: (
      <>
        ליווי
        <br />
        מנטלי
      </>
    ),
    detailSub: 'כדי לבנות אימפריה צריך קודם מנטליות ברזל.',
    thumb: 'prog-mental-thumb.jpg',
    thumbLabel: 'prog-mental-thumb.jpg',
    text: (
      <>
        עבודה פנימית מובנית למסלול ברזל. פגישה שבועית 1:1 בה נבנה מערך עבודה הכולל חומרי קריאה, שיחות, בניית
        ביטחון והרגלים שיחזיקו לחיים שלמים אחרי שהליווי נגמר. החלק שאף אחד אחר לא נותן לך.
      </>
    ),
    rows: [
      { k: 'אורך התכנית', v: 'החל מ-6 שבועות' },
      { k: 'מטרה', v: 'לבנות משמעת ברזל' },
      { k: 'עלות לתכנית', v: '1,800 ש"ח' },
    ],
    wa: WA_MENTAL,
  },
]

function StageUI({ prog, open, onToggle }: { prog: Prog; open: boolean; onToggle: () => void }) {
  return (
    <>
      <div className="prog-center">
        <div className="prog-title">{prog.title}</div>
        <p className="prog-cap">{prog.cap}</p>
        <button type="button" className="prog-keep" data-lead-open>
          <Mask text="השאר פרטים" />
        </button>
      </div>
      <button className="prog-plus" aria-expanded={open} onClick={onToggle}>
        <span className="pcirc">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div className="prog-detail">
        <div className="pd-head">
          <div>
            <h3>{prog.detailTitle}</h3>
            <div className="sub">{prog.detailSub}</div>
          </div>
          <Ph img={prog.thumb} alt="" label={prog.thumbLabel} />
        </div>
        <p>{prog.text}</p>
        <div className="pd-rows">
          {prog.rows.map(r => (
            <div className="srow" key={r.k}>
              <span className="k">{r.k}</span>
              <span className="v">{r.v}</span>
            </div>
          ))}
        </div>
        <a href={prog.wa} target="_blank" className="btn btn-light">
          קבע שיחת היכרות
          <span className="circle">
            <Arrow />
          </span>
        </a>
      </div>
    </>
  )
}

/*
 * חוויית הגלילה של התוכניות: מרקיזה → תמונה גדלה → חפיסת פאנלים sticky.
 * הכוריאוגרפיה רצה ב-rAF יחיד עם lerp על כל ערך — במקום scroll events — לתנועה חלקה.
 * במובייל (<=860px) הכוריאוגרפיה כבויה והפאנלים נערמים ככרטיסים.
 */
export default function Programs() {
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [overlayShow, setOverlayShow] = useState(false)
  const openRef = useRef(open)
  openRef.current = open

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const stages = [...root.querySelectorAll<HTMLElement>('.prog-stage')]
    let raf = 0
    let g = 0
    const e = stages.map(() => 0)
    let show = false
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (matchMedia('(max-width:860px)').matches) {
        root.style.removeProperty('--p')
        stages.forEach(el => {
          el.style.transform = ''
          const ui = el.querySelector<HTMLElement>('.stage-ui')
          if (ui) ui.style.opacity = ''
        })
        return
      }
      const top = root.getBoundingClientRect().top
      const introDist = innerHeight * 2.5
      const raw = Math.min(1, Math.max(0, -top / introDist))
      const gT = Math.min(1, raw / 0.55)
      g += (gT - g) * 0.2
      if (Math.abs(gT - g) < 0.0004) g = gT
      root.style.setProperty('--p', g.toFixed(4))
      if (raw > 0.6 !== show) {
        show = raw > 0.6
        setOverlayShow(show)
      }
      for (let i = 0; i < stages.length - 1; i++) {
        const next = stages[i + 1]
        const eT = Math.min(1, Math.max(0, (innerHeight - next.getBoundingClientRect().top) / innerHeight))
        e[i] += (eT - e[i]) * 0.2
        if (Math.abs(eT - e[i]) < 0.0004) e[i] = eT
        const el = stages[i]
        const sc = (1 - e[i] * 0.05).toFixed(4)
        const ty = (-e[i] * 34).toFixed(2)
        el.style.transform = el.classList.contains('grow-img')
          ? `translate(50%,-50%) translateY(${ty}vh) scale(${sc})`
          : `translateY(${ty}vh) scale(${sc})`
        const ui = el.querySelector<HTMLElement>('.stage-ui')
        if (ui && e[i] > 0.001) ui.style.opacity = Math.max(0, 1 - e[i] * 1.6).toFixed(3)
        else if (ui && !ui.classList.contains('pi-overlay')) ui.style.opacity = ''
        if (eT > 0.7 && openRef.current === i) setOpen(null)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const toggle = (i: number) => setOpen(o => (o === i ? null : i))
  const intro = PROGS[0]

  return (
    <section id="programs" ref={ref}>
      <div className="pi-sticky">
        <div className="marquee" aria-hidden="true">
          <span>
            התוכניות <em>התוכניות</em> התוכניות <em>התוכניות</em>
          </span>
          <span>
            התוכניות <em>התוכניות</em> התוכניות <em>התוכניות</em>
          </span>
        </div>
        <div className="grow-img prog-stage">
          <Ph img={intro.img} alt="" label={intro.imgLabel} light />
          <div
            className={`pi-overlay stage-ui${overlayShow ? ' show' : ''}${open === 0 ? ' open' : ''}`}
            id="piOverlay"
            data-prog
          >
            <StageUI prog={intro} open={open === 0} onToggle={() => toggle(0)} />
          </div>
        </div>
      </div>
      <div className="pspacer intro" />
      {PROGS.slice(1).map((prog, idx) => {
        const i = idx + 1
        return (
          <Fragment key={prog.key}>
            {/* הפאנלים חייבים להיות ילדים ישירים של הסקשן — אחרת ה-sticky של חפיסת הקלפים נשבר */}
            <div className={`prog-panel prog-stage${open === i ? ' open' : ''}`} data-prog>
              <div className="prog-bg">
                <Ph img={prog.img} alt="" label={prog.imgLabel} />
              </div>
              <div className="stage-ui">
                <StageUI prog={prog} open={open === i} onToggle={() => toggle(i)} />
              </div>
            </div>
            <div className="pspacer" />
          </Fragment>
        )
      })}
    </section>
  )
}
