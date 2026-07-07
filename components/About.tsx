import Ph from './Ph'
import Cnum from './Cnum'
import { Arrow, Mask } from './icons'
import { WA_GENERAL } from '@/lib/links'

export default function About() {
  return (
    <section id="about">
      <span className="floater" data-fspeed="-0.08" style={{ top: '12%', left: '8%' }} aria-hidden="true">
        ✦
      </span>
      <span className="floater f-ring" data-fspeed="0.06" style={{ bottom: '16%', left: '30%' }} aria-hidden="true" />
      <div className="about-grid">
        <div className="about-text reveal">
          <h2 className="about-h2">
            אני הבן אדם שיהיה שם <em>כשקשה.</em>
          </h2>
          <p>
            אחרי יותר מ-1,400 מתאמנים וליווים, למדתי דבר אחד: כשיש לך מנטליות מנצחת וראש חזק, הגוף יילך אחריו לכל
            מקום שתבחר.
          </p>
          <p>
            בגלל זה המעטפת שאתה מקבל ממני מתחילה בעבודה מנטלית, חומרי קריאה, צפייה וקשר רציף עם בן אדם אמיתי ולא
            בוט. שעונה לך גם בערב, גם כשנפלת וגם כשאתה בטוח שזה לא בשבילך.
          </p>
          <div className="about-stats">
            <div className="stat">
              <div className="num">
                <Cnum count={1400} />
                <span>+</span>
              </div>
              <div className="lbl">סיימו את התכנית</div>
              <div className="stat-m">
                1,400<span>+</span> סיימו
              </div>
            </div>
            <div className="stat">
              <div className="num">
                <Cnum count={250} />
                <span>+</span>
              </div>
              <div className="lbl">מתאמנים פעילים</div>
              <div className="stat-m">
                250<span>+</span> פעילים
              </div>
            </div>
            <div className="stat">
              <div className="num">24/7</div>
              <div className="lbl">מענה אמיתי</div>
              <div className="stat-m">24/7 זמינות</div>
            </div>
          </div>
          <div className="about-cta-row">
            <a href="#golan" className="btn btn-red">
              מי אני?
              <span className="circle">
                <Arrow />
              </span>
            </a>
            <a href={WA_GENERAL} target="_blank" className="u-link">
              <Mask text="קבע שיחת היכרות" />
            </a>
          </div>
        </div>
        <div className="about-imgs reveal" data-d="1">
          <Ph img="about-1.jpg" alt="גולן בסטודיו" label="about-1.jpg (900×1100)" />
          <div className="about-chip">
            <span className="n">13+</span>
            <span className="l">שנות ניסיון באימון וליווי</span>
          </div>
        </div>
      </div>
    </section>
  )
}
