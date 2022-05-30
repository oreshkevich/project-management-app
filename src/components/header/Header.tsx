import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, NavDropdown, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { cookies } from '../../core/cookies/cookies';
import { ITaskEdited } from '../../core/interfaces/interfaces';

import { useAppDispatch, useAppSelector } from '../../core/hooks/redux';
import { userSlice } from '../../core/store/reducers/UserSlice';

import { getBoard, getBoards, getUsers } from '../../core/api/api';

import FormBoard from '../forms/formBoard/FormBoard';

import './header.css';
import { updateToastState } from '../../core/store/reducers/modalReducer';
import ToastNotification from '../modalWindows/ToastNotitfication';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isClick, setIsClick] = useState(false);
  const [show, setShow] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [search, setSearch] = useState('');
  const [allTasks, setAllTasks] = useState([] as ITaskEdited[]);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(true);
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
      setMessage(t('messages.cookie'));
      dispatch(updateToastState(true));
      logout();
    }
  }, [cookieToken, token, logout, dispatch, t]);

  const submitSearch = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      setAllTasks([]);
      const res: ITaskEdited[] = [];
      const { data } = await getBoards();
      const idBoards = data.map((board: { id: string }) => board.id);

      await Promise.all(
        idBoards.map(async (id: string) => {
          const { data } = await getBoard(id);
          data.columns.forEach((column: { tasks: ITaskEdited[] }) => {
            const tasks = column.tasks.map((task) => {
              return {
                ...task,
                boardId: id,
              };
            });
            res.push(...tasks);
          });
        })
      );

      const re = new RegExp(search, 'gi');
      const { data: userData } = await getUsers();
      const userIds = userData
        .filter((user: { name: string }) => user.name.match(re))
        .map((user: { id: string }) => user.id);

      setAllTasks((prevTasks) =>
        [...prevTasks, ...res].filter(
          (task) =>
            task.title.match(re) || task.description.match(re) || userIds.includes(task.userId)
        )
      );
    } catch (error) {
      alert(error);
    }
  };

  const handleScroll = () => {
    window.scrollY > 0 ? setScroll(true) : setScroll(false);
  };

  window.addEventListener('scroll', handleScroll);

  return (
    <>
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
              <span onClick={() => setIsOpen(!isOpen)} className="navbar-toggler-icon"></span>
            </button>
            <div className={`${isOpen ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
              {token && (
                <>
                  <Button className="createBoard" variant="secondary" onClick={handleShow}>
                    {t('header.create-board__button')}
                  </Button>
                  <div className="search-tasks">
                    <Form onSubmit={submitSearch}>
                      <Form.Control
                        className="search-tasks__input"
                        placeholder="Search Tasks"
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={() => setIsClick(true)}
                      />
                      <button
                        type="button"
                        className="search-tasks__close btn-close"
                        aria-label="Close"
                        onClick={() => setIsClick(false)}
                        style={!isClick ? { display: 'none' } : { display: 'inherit' }}
                      ></button>
                    </Form>

                    <div className="search-tasks__results-wrapper">
                      <ul
                        style={!isClick ? { display: 'none' } : { display: 'inherit' }}
                        className="search-tasks__results"
                      >
                        {allTasks.map((task, idx) => (
                          <li onClick={() => navigate(`/board/${task.boardId}`)} key={idx}>
                            {task.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
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
                    <NavDropdown.Item onClick={() => changeLanguage('ru')}>
                      Russian
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => changeLanguage('en')}>
                      English
                    </NavDropdown.Item>
                  </NavDropdown>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <ToastNotification message={message} />
    </>
  );
};
export default Header;
