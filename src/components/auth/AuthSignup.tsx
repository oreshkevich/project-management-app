import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Form } from 'react-bootstrap';
import './auth.css';

import { NewUser } from '../../core/types/types';
import { signup } from '../../core/api/api';

const AuthSignup = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({} as NewUser);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    await signup(formData);
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
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>{t('authentification.name')}*</Form.Label>
        <Form.Control name="name" placeholder={t('authentification.enter-name')} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasiclogin">
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
        {t('authentification.submit-registration')}
      </Button>
    </Form>
  );
};

export default AuthSignup;
