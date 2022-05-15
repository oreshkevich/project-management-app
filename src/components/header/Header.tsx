import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { cookies } from '../../core/cookies/cookies';

import { useAppDispatch, useAppSelector } from '../../core/hooks/redux';
import { userSlice } from '../../core/store/reducers/UserSlice';

import FormBoard from '../formBoard/FormBoard';

import './header.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [show, setShow] = useState(false);
  const [scroll, setScroll] = useState(false);
  const { token } = useAppSelector((state) => state.userReducer);
  const { setToken } = userSlice.actions;
  const cookieToken = cookies.get('token');

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const handleShow = () => setShow(true);

  const logout = useCallback(() => {
    dispatch(setToken(null));
    navigate('/home');
  }, [dispatch, navigate, setToken]);

  useEffect(() => {
    if (!cookieToken && token) {
      alert('Сookie expired, please login again');
      logout();
    }
  }, [cookieToken, token, logout]);

  const handleScroll = () => {
    window.scrollY > 0 ? setScroll(true) : setScroll(false);
  };

  window.addEventListener('scroll', handleScroll);

  return (
    <header
      className={
        scroll
          ? 'header d-flex justify-content-center scroll'
          : 'header d-flex justify-content-center'
      }
    >
      <nav
        className={
          scroll
            ? 'nav navbar navbar-expand-lg navbar-light'
            : 'nav navbar navbar-expand-lg navbar-dark'
        }
      >
        <div className="container-fluid">
          <NavLink to={'/home'} className="navbar-brand">
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
            {token && (
              <Button className="createBoard" variant="success" onClick={handleShow}>
                {t('header.create-board__button')}
              </Button>
            )}
            <ul className="navbar-nav">
              {token ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/main" className="nav-link">
                      {t('header.go-to-main')}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/profile" className="nav-link">
                      {t('header.edit')}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <Button variant="link nav-link" className="logout" onClick={logout}>
                      {t('header.log-out')}
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      {t('header.log-in')}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/signup" className="nav-link">
                      {t('header.reqistration')}
                    </NavLink>
                  </li>
                </>
              )}
              {show ? <FormBoard setShow={setShow} /> : null}
              <li className="nav-item">
                <NavDropdown title={t('header.language')} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={() => changeLanguage('ru')}>Russian</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => changeLanguage('en')}>English</NavDropdown.Item>
                </NavDropdown>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;
