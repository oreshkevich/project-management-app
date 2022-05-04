import { Button, Form } from 'react-bootstrap';
import './auth.css';

const AuthSignup = () => {
  return (
    <Form className="auth d-flex flex-column auth mt-5 mx-auto">
      <Form.Group className="mb-3" controlId="formBasiclogin">
        <Form.Label>Login*</Form.Label>
        <Form.Control placeholder="Enter login" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email*</Form.Label>
        <Form.Control type="email" placeholder="Enter email address" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password*</Form.Label>
        <Form.Control type="password" placeholder="Enter password" />
      </Form.Group>

      <Button variant="outline-*" className="auth__submit mt-2 text-white" type="submit">
        Register
      </Button>
    </Form>
  );
};

export default AuthSignup;
