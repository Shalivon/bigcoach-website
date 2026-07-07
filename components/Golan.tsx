import Ph from './Ph'
import CredToggle from './CredToggle'
import { Arrow, Mask } from './icons'
import { WA_GENERAL } from '@/lib/links'

export default function Golan() {
  return (
    <section id="golan">
      <div className="golan-bigword" aria-hidden="true">
        BIG COACH
      </div>
      <div className="golan-head reveal">
        <div>
          <h2>האיש שמאחורי המכונה</h2>
        </div>
      </div>
      <div className="golan-grid">
        <div className="golan-photo reveal">
          <Ph img="golan.jpg" alt="גולן בובליל" label="golan.jpg (800×1000)" />
        </div>
        <div className="golan-card reveal" data-d="1">
          <div>
            <h3>גולן בובליל</h3>
            <div className="role">פאפא ג&apos;י | ביג קואוצ&apos; | אבא של ישראל</div>
            <p>
              התחלתי את הדרך בגיל 12, באומניות לחימה. בגיל 15 כבר הייתי מדריך. מאז ועד היום, בין אם על המזרן,
              במדים או באולם האימונים, חיפשתי דבר אחד: איך לוקחים בן אדם ומוציאים ממנו את הגרסה החזקה שלו.
            </p>
            <p>
              בצבא הייתי <b>ראש מדור קרב מגע של חטיבת גולני</b>. בעולם האזרחי ניהלתי רשתות כושר גדולות. אבל הרגע
              ששינה לי את החיים היה כשהבנתי שאני לא רוצה לנהל מערכת, אני רוצה לשנות אנשים. אחד אחד.
            </p>
            <p>
              היום אני עושה את זה דרך ביג קואוצ&apos;, עם כל מה שצברתי בדרך: <b>לחימה, ניהול, ראש, וגוף.</b>
            </p>
            <div className="golan-creds">
              <div className="cred">
                <span className="cred-ic">★</span>
                <div>
                  <div className="cred-t">ראש מדור קרב מגע, חטיבת גולני</div>
                </div>
              </div>
              <div className="cred">
                <span className="cred-ic">★</span>
                <div>
                  <div className="cred-t">מנהל מקצועי בעבר ברשתות כושר מובילות</div>
                </div>
              </div>
              <div className="cred">
                <span className="cred-ic">★</span>
                <div>
                  <div className="cred-t">מאמן ומדריך מגיל 15, מעל 13 שנות ניסיון</div>
                </div>
              </div>
            </div>
            <CredToggle />
          </div>
          <div className="golan-cta-row">
            <button type="button" className="golan-direct" data-lead-open>
              <Mask text="השאר פרטים" />
            </button>
            <span className="golan-cta-or">או</span>
            <a href={WA_GENERAL} target="_blank" className="golan-lead-btn">
              <Mask text="קבע שיחת היכרות" />
              <span className="circle">
                <Arrow />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
