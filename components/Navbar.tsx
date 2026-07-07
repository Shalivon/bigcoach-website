import Ph from './Ph'
import { Arrow, Mask } from './icons'

export default function Navbar() {
  return (
    <nav id="nav">
      <div className="nav-logo">
        <a href="#golan" aria-label="גולן בובליל">
          <Ph img="logo.png" alt="BIG COACH לוגו" />
        </a>
      </div>
      <button type="button" className="btn-join" data-lead-open aria-label="קבע שיחת היכרות">
        <Mask text="שיחת היכרות" />
        <span className="circle">
          <Arrow />
        </span>
      </button>
    </nav>
  )
}
