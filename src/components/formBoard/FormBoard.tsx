import { SetStateAction } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import './formBoard.css';

const FormBoard = ({ setShow }: { setShow: (value: SetStateAction<boolean>) => void }) => {
  const { t } = useTranslation();

  const handleClose = () => setShow(false);

  return (
    <Modal show={true} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('header.create-board__modal')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{t('header.create-board__modal-title')}</Form.Label>
            <Form.Control type="text" placeholder={t('header.create-board__modal-title')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('header.create-board__modal-description')}</Form.Label>
            <Form.Control as="textarea" aria-label="With textarea" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('header.create-board__modal-close-button')}
        </Button>
        <Button variant="success">{t('header.create-board__modal-submit-button')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormBoard;
