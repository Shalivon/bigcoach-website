import Ph from './Ph'

export default function Navbar() {
  return (
    <nav id="nav">
      <div className="nav-logo">
        <a href="#golan" aria-label="גולן בובליל">
          <Ph img="logo.png" alt="BIG COACH לוגו" sizes="280px" position="right center" />
        </a>
      </div>
    </nav>
  )
}
