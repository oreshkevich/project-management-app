import { SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ColData } from '../../../core/types/types';
import { createColumnCreator } from '../../../core/store/creators/BoardCreators';
import { useForm } from 'react-hook-form';
import './formColumn.css';

import { useAppSelector, useAppDispatch } from '../../../core/hooks/redux';
import { CatchedError } from '../../../core/types/types';

interface IData {
  title: string;
}

const FormColumn = ({ setShowCol }: { setShowCol: (value: SetStateAction<boolean>) => void }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const { columns } = useAppSelector((state) => state.boardReducer);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ColData>({ mode: 'onBlur' });

  const handleClose = () => setShowCol(false);

  const onSubmit = async (data: IData) => {
    const dataOrder = {
      title: data.title,
      order: columns.length + 1,
    };

    try {
      await dispatch(createColumnCreator({ id: String(id), column: dataOrder })).unwrap();
      handleClose();
    } catch (error) {
      alert((error as CatchedError).message);
    }
  };

  return (
    <Modal show={true} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('header.create-col__modal')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>{t('header.create-col__modal-title')}</Form.Label>
            <Form.Control
              {...register('title', {
                required: `${t('header.create-board__modal-error-title')}`,
                minLength: {
                  value: 4,
                  message: `${t('header.create-board__modal-error-title-length')}`,
                },
              })}
              placeholder={t('header.create-col__modal-title')}
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

export default FormColumn;
