import {Link, withRouter} from 'react-router-dom'
import {TiHome} from 'react-icons/ti'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    history.replace('/login')
    Cookies.remove('jwt_token')
  }

  return (
    <nav className="header-section">
      <Link to="/" className="link-item">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="nav-website-logo-img"
        />
      </Link>
      <ul className="sm-page list-container">
        <Link to="/" className="link-item">
          <li key="home" className="route-link">
            <TiHome className="nav-bar-image" />
          </li>
        </Link>
        <Link to="/jobs" className="link-item">
          <li key="jobLg" className="route-link">
            <BsBriefcaseFill className="nav-bar-image" />
          </li>
        </Link>
        <li key="logout" className="route-link">
          <button
            type="button"
            onClick={onClickLogout}
            className="sm-page nav-button"
          >
            {' '}
            <FiLogOut className="nav-bar-image" />
          </button>
        </li>
      </ul>
      <ul className="lg-page list-container">
        <Link to="/" className="link-item">
          <li key="homeLg" className="route-link">
            Home
          </li>
        </Link>
        <Link to="/jobs" className="link-item">
          <li key="jobLg" className="route-link">
            Jobs
          </li>
        </Link>
      </ul>
      <button
        type="button"
        onClick={onClickLogout}
        className="lg-page header-button"
      >
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
