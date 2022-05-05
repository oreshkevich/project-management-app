import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import './header.css';

function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <header className="header d-flex justify-content-center bg-dark">
      <nav className="nav navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand">
            GoodBoard
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink to="/login" className="nav-link" aria-current="page">
                  {t('header.log-in')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/signup" className="nav-link">
                  {t('header.reqistration')}
                </NavLink>
              </li>
              <NavDropdown title={t('header.language')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => changeLanguage('ru')}>Russian</NavDropdown.Item>
                <NavDropdown.Item onClick={() => changeLanguage('en')}>English</NavDropdown.Item>
              </NavDropdown>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Header;
