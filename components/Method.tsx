const CARDS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" pathLength="90" />
        <circle cx="12" cy="12" r="4.5" pathLength="90" />
        <path d="M12 11.9v.2" pathLength="90" />
      </svg>
    ),
    title: 'תכנית שתפורה אליך.',
    text: 'מתחילים משאלון מעמיק: נתוני גוף, שגרה, פציעות, מה עבד ומה נשבר. מזה נבנית תוכנית אימונים ותפריט שמתאימים לחיים שלך. וכל שבוע הם מתעדכנים לפי מה שקרה בפועל, לא לפי מה שהיה אמור לקרות.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8Z" pathLength="90" />
        <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" pathLength="90" />
      </svg>
    ),
    title: 'אני כאן בשבילך. תמיד.',
    text: 'כל הודעה שלך מגיעה אליי. לא למוקד, לא לתסריט ולא למענה אוטומטי. נפלת ביום רביעי בערב? זה בדיוק הרגע שבו ליווי נמדד. אתה כותב, אני עונה, ממשיכים הלאה. בלי שיפוט.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" pathLength="90" />
      </svg>
    ),
    title: 'קודם כל בונים מנטליות.',
    text: 'דיאטה בלי עבודה מנטלית זו ספירה לאחור לנפילה הבאה. בגלל זה המעטפת כוללת חומרי קריאה וצפייה, בניית ביטחון והרגלים שנשארים איתך גם אחרי שהליווי נגמר. הגוף הולך לאן שהראש מוביל.',
  },
]

export default function Method() {
  return (
    <section id="method">
      <span className="floater" data-fspeed="0.07" style={{ top: '16%', right: '9%' }} aria-hidden="true">
        ✦
      </span>
      <span className="floater f-ring" data-fspeed="-0.05" style={{ bottom: '14%', left: '7%' }} aria-hidden="true" />
      <div className="method-head reveal">
        <h2>
          הפעם אתה תחזיק עד הסוף.
          <br />
          וזה למה.
        </h2>
        <p className="sec-sub">
          בלי קסמים וכל מיני חרטות. השיטה שלי יושבת על 3 עקרונות גדולים וזו המעטפת שתמנע ממך ליפול כמו בפעמים
          הקודמות
        </p>
      </div>
      <div className="method-grid reveal">
        {CARDS.map(c => (
          <div className="mcard" key={c.title}>
            <span className="spot" aria-hidden="true" />
            <div className="micon">{c.icon}</div>
            <h4>{c.title}</h4>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
