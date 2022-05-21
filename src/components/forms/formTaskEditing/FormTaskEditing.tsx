import { SetStateAction } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TaskData } from '../../../core/types/types';
import { ITaskData } from '../../../core/interfaces/interfaces';
import './formTaskEditing.css';
import { useForm } from 'react-hook-form';
import { editTask } from '../../../core/api/api';

interface IData {
  title: string;
  description: string;
}

const FormTaskEditing = ({
  setShowTask,
  task,
  getAllColumn,
}: {
  setShowTask: (value: SetStateAction<boolean>) => void;
  task: ITaskData;
  getAllColumn: () => Promise<void>;
}) => {
  const { t } = useTranslation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TaskData>({ mode: 'onBlur' });

  const handleClose = () => setShowTask(false);

  const onSubmit = async (data: IData) => {
    const dataOrder = {
      title: data.title,
      order: task.order,
      description: data.description,
      userId: task.userId,
      columnId: task.columnId,
      boardId: task.boardId,
    };

    await editTask(task.boardId, task.columnId, task.id, dataOrder);
    handleClose();
    await getAllColumn();
  };

  return (
    <Modal show={true} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('header.create-task__modal-editing')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>{t('header.create-task__modal-title')}</Form.Label>
            <Form.Control
              {...register('title', {
                value: task.title,
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
                value: task.description,
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
              {t('header.create-board__modal-submit-button-editing')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormTaskEditing;
