import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Modal, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../core/hooks/redux';
import { userSlice } from '../../core/store/reducers/UserSlice';
import { checkToken } from '../../core/store/creators/asyncCreators';
import { CatchedError } from '../../core/types/types';

import './header.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [show, setShow] = useState(false);

  const { token } = useAppSelector((state) => state.userReducer);
  const { setToken } = userSlice.actions;

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const logout = useCallback(() => {
    dispatch(setToken(null));
    navigate('/');
  }, [dispatch, navigate, setToken]);

  useEffect(() => {
    //move when all api request will work
    const check = async () => {
      try {
        await dispatch(checkToken()).unwrap();
      } catch (error) {
        alert((error as CatchedError).message);
      }
    };

    if (token) check();
  }, [dispatch, location, token]);

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
              {token ? (
                <>
                  <li className="nav-item">
                    <Button variant="success" onClick={handleShow}>
                      {t('header.create-board__button')}
                    </Button>
                  </li>
                  <li className="nav-item">
                    <Button variant="link nav-link" onClick={logout}>
                      {t('header.log-out')}
                    </Button>
                  </li>
                </>
              ) : (
                <>
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
                </>
              )}
              <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                  <Modal.Title>{t('header.create-board__modal')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('header.create-board__modal-title')}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t('header.create-board__modal-title')}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>{t('header.create-board__modal-description')}</Form.Label>
                      <Form.Control as="textarea" aria-label="With textarea" />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    {t('header.create-board__modal-close-button')}
                  </Button>
                  <Button variant="success">{t('header.create-board__modal-submit-button')}</Button>
                </Modal.Footer>
              </Modal>
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
