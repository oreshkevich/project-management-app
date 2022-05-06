import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Form } from 'react-bootstrap';
import './auth.css';

import { useAppDispatch } from '../../core/hooks/redux';
import { userSlice } from '../../core/store/reducers/UserSlice';

import { User } from '../../core/types/types';
import { login } from '../../core/api/api';

const AuthLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({} as User);

  const { setToken } = userSlice.actions;

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      const { data } = await login(formData);
      dispatch(setToken(data.token));
      navigate('/main');
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: React.SyntheticEvent) => {
    const field = (event.target as HTMLInputElement).name;
    const value = (event.target as HTMLInputElement).value;

    setFormData({ ...formData, [field]: value });
  };

  return (
    <Form
      className="auth d-flex flex-column auth mx-auto"
      onSubmit={handleSubmit}
      onChange={handleChange}
    >
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>{t('authentification.login')}*</Form.Label>
        <Form.Control name="login" placeholder={t('authentification.enter-login')} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>{t('authentification.password')}*</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder={t('authentification.enter-password')}
        />
      </Form.Group>

      <Button variant="outline-*" className="auth__submit mt-2 text-white" type="submit">
        {t('authentification.submit-login')}
      </Button>
    </Form>
  );
};

export default AuthLogin;
