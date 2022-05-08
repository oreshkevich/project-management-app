import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Form } from 'react-bootstrap';
import './auth.css';

import { useAppDispatch } from '../../core/hooks/redux';
import { userSlice } from '../../core/store/reducers/UserSlice';

import { User } from '../../core/types/types';
import { login } from '../../core/api/api';

import { useForm } from 'react-hook-form';

const AuthLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onBlur' });

  const [formData, setFormData] = useState({} as User);

  const { setToken } = userSlice.actions;

  const onSubmit = async () => {
    console.log(formData);

    try {
      const { data } = await login(formData);
      dispatch(setToken(data.token));
      navigate('/');
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
      onSubmit={handleSubmit(onSubmit)}
      onChange={handleChange}
    >
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>{t('authentification.login')}*</Form.Label>
        <Form.Control
          {...register('login', {
            required: `${t('authentification.error-login')}`,
            minLength: {
              value: 4,
              message: `${t('authentification.error-login-length')}`,
            },
          })}
          placeholder={t('authentification.enter-login')}
        />
        <div>{errors?.login && <p className="form-error">{errors?.login?.message}</p>}</div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>{t('authentification.password')}*</Form.Label>
        <Form.Control
          {...register('password', {
            required: `${t('authentification.error-password')}`,
            minLength: {
              value: 8,
              message: `${t('authentification.error-password-length')}`,
            },
          })}
          type="password"
          placeholder={t('authentification.enter-password')}
        />
        <div>{errors?.password && <p className="form-error">{errors?.password?.message}</p>}</div>
      </Form.Group>

      <Button variant="outline-*" className="auth__submit mt-2 text-white" type="submit">
        {t('authentification.submit-login')}
      </Button>
    </Form>
  );
};

export default AuthLogin;
