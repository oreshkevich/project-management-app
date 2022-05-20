import { SetStateAction } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import './formBoard.css';
import { BoardData } from '../../../core/types/types';
import { createBoard } from '../../../core/api/api';
import { boardSlice } from '../../../core/store/reducers/BoardSlice';
import { useAppDispatch } from '../../../core/hooks/redux';

const FormBoard = ({ setShow }: { setShow: (value: SetStateAction<boolean>) => void }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { addBoard } = boardSlice.actions;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<BoardData>({ mode: 'onBlur' });

  const handleClose = () => setShow(false);

  const onSubmit = async (data: BoardData) => {
    const response = await createBoard(data);
    handleClose();
    dispatch(addBoard(response.data));
  };

  return (
    <Modal show={true} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('header.create-board__modal')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>{t('header.create-board__modal-title')}</Form.Label>
            <Form.Control
              {...register('title', {
                required: `${t('header.create-board__modal-error-title')}`,
                minLength: {
                  value: 4,
                  message: `${t('header.create-board__modal-error-title-length')}`,
                },
              })}
              placeholder={t('header.create-board__modal-title')}
            />
            <div>{errors?.title && <p className="form-error">{errors?.title?.message}</p>}</div>
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t('header.create-board__modal-close-button')}
            </Button>
            <Button variant="success" type="submit">
              {t('header.create-board__modal-submit-button')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormBoard;
