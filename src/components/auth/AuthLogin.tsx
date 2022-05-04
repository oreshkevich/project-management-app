import { Button, Form } from 'react-bootstrap';
import './auth.css';

const AuthLogin = () => {
  return (
    <Form className="auth d-flex flex-column auth mx-auto">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email*</Form.Label>
        <Form.Control type="email" placeholder="Enter email address" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password*</Form.Label>
        <Form.Control type="password" placeholder="Enter password" />
      </Form.Group>

      <Button variant="outline-*" className="auth__submit mt-2 text-white" type="submit">
        Log In
      </Button>
    </Form>
  );
};

export default AuthLogin;
