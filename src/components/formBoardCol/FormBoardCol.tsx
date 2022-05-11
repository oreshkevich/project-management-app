import axios from 'axios';
import { SetStateAction, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import './formBoardCol.css';

const FormBoard = ({ setShow }: { setShow: (value: SetStateAction<boolean>) => void }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const handleClose = () => setShow(false);
  const handleValue = () => {
async () => {
  console.log(inputValue);
//   try {
//     await axios({
//       url: 'https://goodboard.herokuapp.com/docs/json',
//       headers: {
//         'Content-type': 'application/json',
//       },
//       params: {
//         field: inputValue,
//       },
//       metod: 'POST',
//       data: null,
//     }).then(({ data }) => {
//       return data;
//     });
//   } catch (e) {
//     console.log('sending error', e);
//   }
// };
       
  }



  return (
    <Modal show={true} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('header.create-col__modal')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{t('header.create-col__modal-title')}</Form.Label>
            <Form.Control
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type="text"
              placeholder={t('header.create-col__modal-title')}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('header.create-board__modal-close-button')}
        </Button>
        <Button onClick={handleValue} variant="success">
          {t('header.create-board__modal-submit-button')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormBoard;
