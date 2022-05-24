import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { Button, Form } from 'react-bootstrap';
import './auth.css';

import { useAppDispatch } from '../../core/hooks/redux';
import { User } from '../../core/types/types';
import { submitLogin, getProfile } from '../../core/store/creators/UserCreators';
import { updateToastState } from '../../core/store/reducers/modalReducer';
import ToastNotification from '../modalWindows/ToastNotitfication';

import LoadingButton from '../loading/LoadingButton';

const AuthLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [requestStatus, setStatus] = useState(true);
  const [formData, setFormData] = useState({} as User);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(updateToastState(false));
  }, [dispatch]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async () => {
    try {
      setLoading(true);
      const { id } = await dispatch(submitLogin(formData)).unwrap();
      await dispatch(getProfile(id)).unwrap();
      navigate('/main');
      setStatus(true);
    } catch (error) {
      setMessage((error as Error).message);
      setLoading(false);
      setStatus(false);
      dispatch(updateToastState(true));
    }
  };

  const handleChange = (event: React.SyntheticEvent) => {
    const field = (event.target as HTMLInputElement).name;
    const value = (event.target as HTMLInputElement).value;

    setFormData({ ...formData, [field]: value });
  };

  return (
    <>
      <Form
        className="auth d-flex flex-column auth mx-auto"
        onSubmit={handleSubmit(onSubmit)}
        onChange={handleChange}
      >
        <Form.Group className="mb-3" controlId="formBasicEmail">
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

        <div>
          {!requestStatus && <p className="form-error">{t('authentification.error-auth')}</p>}
        </div>

        {loading ? (
          <LoadingButton />
        ) : (
          <Button variant="outline-*" className="auth__submit mt-2 text-white" type="submit">
            {t('authentification.submit-login')}
          </Button>
        )}
      </Form>
      <ToastNotification message={message} />
    </>
  );
};

export default AuthLogin;
