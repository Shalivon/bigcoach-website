import Ph from './Ph'

// placeholder בסוגריים מרובעים — למילוי לפי עדויות אמיתיות בלבד, לא להמציא
const BA_CAP = '[שם · תוצאה, לדוגמה: ירד 14 ק״ג בתוך 5 חודשים]'
const BA = [1, 2, 3, 4, 5, 6]

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
    </section>
  )
}
