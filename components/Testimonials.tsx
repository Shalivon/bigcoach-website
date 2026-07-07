import Ph from './Ph'

// placeholder בסוגריים מרובעים — למילוי לפי עדויות אמיתיות בלבד, לא להמציא
const BA_CAP = '[שם · תוצאה, לדוגמה: ירד 14 ק״ג בתוך 5 חודשים]'
const BA = [1, 2, 3, 4, 5, 6]
const QUOTES = [1, 2, 3, 4, 5, 6].map(
  n =>
    `"[עדות אמיתית ${n}, 2 עד 4 שורות. מומלץ: שינוי במספרים, הליווי המנטלי, הזמינות של גולן, או מישהו שנכשל אצל אחרים והפעם החזיק]"`
)

function BaGroup({ hidden }: { hidden?: boolean }) {
  return (
    <div className="t-group" aria-hidden={hidden || undefined}>
      {BA.map(n => (
        <div className="ba-card" key={n}>
          <Ph img={`ba-${n}.jpg`} alt={hidden ? '' : `לפני ואחרי, מתאמן ${n}`} label={`ba-${n}.jpg (600×760)`} light />
          <div className="cap">{BA_CAP}</div>
        </div>
      ))}
    </div>
  )
}

function TGroup({ hidden }: { hidden?: boolean }) {
  return (
    <div className="t-group" aria-hidden={hidden || undefined}>
      {QUOTES.map((q, i) => (
        <div className="tcard" key={i}>
          <div className="stars">★★★★★</div>
          <p>{q}</p>
          <div className="who">
            {hidden ? <div className="ph" /> : <Ph img={`testi-${i + 1}.jpg`} alt="" />}
            <div>
              <div className="name">[שם]</div>
              <div className="meta">[גיל · מסלול]</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials">
      <div className="testi-head reveal">
        <h2>הם כבר עברו את זה</h2>
        <p className="sec-sub">אנשים אמיתיים. תוצאות אמיתיות. בלי פילטרים.</p>
      </div>

      {/* סליידר לפני/אחרי */}
      <div className="t-slider">
        <div className="t-track">
          <BaGroup />
          <BaGroup hidden />
        </div>
      </div>

      {/* סליידר עדויות כתובות */}
      <div className="t-slider">
        <div className="t-track" style={{ animationDuration: '55s' }}>
          <TGroup />
          <TGroup hidden />
        </div>
      </div>
    </section>
  )
}
