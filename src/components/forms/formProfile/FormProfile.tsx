import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../core/hooks/redux';

import { Button, Form } from 'react-bootstrap';

import { NewUser, CatchedError } from '../../../core/types/types';
import { editProfile, deleteProfile } from '../../../core/store/creators/UserCreators';

import { cookies } from '../../../core/cookies/cookies';

const FormProfile = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [requestStatus, setStatus] = useState(true);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm({ mode: 'onBlur' });

  const id = cookies.get('id');

  useEffect(() => {
    const getFormData = async () => {
      try {
        setValue('name', cookies.get('name'), { shouldDirty: true });
        setValue('login', cookies.get('login'), { shouldDirty: true });
        setValue('password', cookies.get('password'), { shouldDirty: true });
      } catch (error) {
        alert((error as CatchedError).message);
      }
    };

    getFormData();
  }, [dispatch, setValue]);

  const onSubmit = async () => {
    try {
      await dispatch(editProfile({ id, formData: getValues() as NewUser })).unwrap();
      setStatus(true);
      alert('Profile was edited');
    } catch (error) {
      alert((error as CatchedError).message);
      setStatus(false);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProfile(id)).unwrap();
      alert('Profile was deleted');
    } catch (error) {
      alert((error as CatchedError).message);
    }
  };

  return (
    <Form className="auth d-flex flex-column auth mx-auto" onSubmit={handleSubmit(onSubmit)}>
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
        {t('profile.save')}
      </Button>
      <Button variant="danger" className="mt-2 text-white" onClick={handleDelete}>
        {t('profile.delete')}
      </Button>
    </Form>
  );
};

export default FormProfile;
