import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './auth.css';

const AuthSignup = () => {
  const { t } = useTranslation();

  return (
    <Form className="auth d-flex flex-column auth mx-auto">
      <Form.Group className="mb-3" controlId="formBasiclogin">
        <Form.Label>{t('authentification.login')}*</Form.Label>
        <Form.Control placeholder={t('authentification.enter-login')} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>{t('authentification.email')}*</Form.Label>
        <Form.Control type="email" placeholder={t('authentification.enter-email')} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>{t('authentification.password')}*</Form.Label>
        <Form.Control type="password" placeholder={t('authentification.enter-password')} />
      </Form.Group>

      <Button variant="outline-*" className="auth__submit mt-2 text-white" type="submit">
        {t('authentification.submit-registration')}
      </Button>
    </Form>
  );
};

export default AuthSignup;
