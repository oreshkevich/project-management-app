import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../core/hooks/redux';

import { Button, Form } from 'react-bootstrap';
import './auth.css';

import { NewUser, CatchedError } from '../../core/types/types';
import { submitSignup } from '../../core/store/creators/asyncCreators';

const AuthSignup = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({} as NewUser);
  const [requestStatus, setStatus] = useState(true);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async () => {
    try {
      await dispatch(submitSignup(formData)).unwrap();
      setStatus(true);
    } catch (error) {
      alert((error as CatchedError).message);
      setStatus(false);
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
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>{t('authentification.name')}</Form.Label>
        <Form.Control
          {...register('name', {
            required: `${t('authentification.error-name')}`,
            minLength: {
              value: 4,
              message: `${t('authentification.error-name-length')}`,
            },
          })}
          placeholder={t('authentification.enter-name')}
        />
        <div>{errors?.name && <p className="form-error">{errors?.name?.message}</p>}</div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasiclogin">
        <Form.Label>{t('authentification.login')}</Form.Label>
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
        <div>
          {!requestStatus && <p className="form-error">{t('authentification.error-auth')}</p>}
        </div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>{t('authentification.password')}</Form.Label>
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
        {t('authentification.submit-registration')}
      </Button>
    </Form>
  );
};

export default AuthSignup;
