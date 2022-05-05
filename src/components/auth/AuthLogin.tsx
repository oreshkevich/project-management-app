import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './auth.css';

const AuthLogin = () => {
  const { t } = useTranslation();

  return (
    <Form className="auth d-flex flex-column auth mx-auto">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>{t('authentication.login')}*</Form.Label>
        <Form.Control type="email" placeholder={t('authentication.enter-login')} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>{t('authentication.password')}*</Form.Label>
        <Form.Control type="password" placeholder={t('authentication.enter-password')} />
      </Form.Group>

      <Button variant="outline-*" className="auth__submit mt-2 text-white" type="submit">
        {t('authentication.submit-login')}
      </Button>
    </Form>
  );
};

export default AuthLogin;
