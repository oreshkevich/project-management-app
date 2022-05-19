import { SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TaskData } from '../../core/types/types';
import { createTask } from '../../core/api/api';
import { useForm } from 'react-hook-form';
import './formTask.css';
import { cookies } from '../../core/cookies/cookies';

interface IData {
  title: string;
  description: string;
}

const FormTask = ({
  setShowTask,
  getAllTask,
  columnId,
  order,
}: {
  setShowTask: (value: SetStateAction<boolean>) => void;
  getAllTask: () => Promise<void>;
  columnId: string;
  order: number;
}) => {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TaskData>({ mode: 'onBlur' });

  const handleClose = () => setShowTask(false);

  const onSubmit = async (data: IData) => {
    const idUser = cookies.get('id');
    const dataOrder = {
      title: data.title,
      order: order + 1,
      description: data.description,
      userId: String(idUser),
    };

    await createTask(String(id), columnId, dataOrder);
    await getAllTask();
    handleClose();
  };

  return (
    <Modal show={true} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('header.create-task__modal')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>{t('header.create-task__modal-title')}</Form.Label>
            <Form.Control
              {...register('title', {
                required: `${t('header.create-board__modal-error-title')}`,
                minLength: {
                  value: 4,
                  message: `${t('header.create-board__modal-error-title-length')}`,
                },
              })}
              placeholder={t('header.create-task__modal-title')}
            />
            <div>{errors?.title && <p className="form-error">{errors?.title?.message}</p>}</div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('header.create-task__modal-description')}</Form.Label>
            <Form.Control
              {...register('description', {
                required: `${t('header.create-board__modal-error-title')}`,
                minLength: {
                  value: 4,
                  message: `${t('header.create-board__modal-error-title-length')}`,
                },
              })}
              placeholder={t('header.create-task__modal-description')}
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

export default FormTask;
