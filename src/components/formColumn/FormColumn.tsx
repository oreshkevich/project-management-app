import { SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ColData } from '../../core/types/types';
import { createColumn } from '../../core/api/api';
import { useForm } from 'react-hook-form';
import './formColumn.css';

interface IData {
  title: string;
}

const FormColumn = ({
  setShowCol,
  getAllColumn,
  order,
}: {
  setShowCol: (value: SetStateAction<boolean>) => void;
  getAllColumn: () => void;
  order: number;
}) => {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ColData>({ mode: 'onBlur' });

  const handleClose = () => setShowCol(false);

  const onSubmit = async (data: IData) => {
    const dataOrder = {
      title: data.title,
      order: order + 1,
    };

    await createColumn(String(id), dataOrder);
    getAllColumn();
    handleClose();
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
