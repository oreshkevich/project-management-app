import { Dispatch, SetStateAction } from 'react';
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
  boardId,
  countTask,
  setCountTask,
  columnId,
}: {
  setShowTask: (value: SetStateAction<boolean>) => void;
  countTask: number;
  boardId: string;
  columnId: string;
  setCountTask: Dispatch<SetStateAction<number>>;
}) => {
  const { t } = useTranslation();

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
      order: countTask,
      description: data.description,
      userId: idUser,
    };

    setCountTask((countTask) => countTask + 1);
    await createTask(boardId, columnId, dataOrder);
    handleClose();
    window.location.reload();
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
