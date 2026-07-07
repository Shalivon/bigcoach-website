const TEXT = (
  <>
    זמינות מלאה 24/7 <em>✦</em> 100% תוצאות <em>✦</em> ליווי בכל הארץ <em>✦</em> קשר ישיר עם גולן <em>✦</em> בלי
    בולשיט <em>✦</em> תכניות מותאמות אישית <em>✦</em>{' '}
  </>
)

export default function Strip() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip-track">
        <span>{TEXT}</span>
        <span>{TEXT}</span>
      </div>
    </div>
  )
}
