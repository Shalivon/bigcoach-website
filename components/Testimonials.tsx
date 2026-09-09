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

function BaGroup({ hidden }: { hidden?: boolean }) {
  return (
    <div className="t-group" aria-hidden={hidden || undefined}>
      {BA.map(n => (
        <div className="ba-card" key={n}>
          <Ph img={`ba-${n}.jpeg`} alt={hidden ? '' : `לפני ואחרי, מתאמן ${n}`} label={`ba-${n}.jpeg (600×760)`} light />
          <div className="cap">{BA_CAPS[n]}</div>
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
