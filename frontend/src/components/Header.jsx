import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🗳️</span>
            <span className="logo-text">PollVault</span>
          </Link>

          {!isHome && (
            <Link to="/create" className="btn-header">
              Create New Poll
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
