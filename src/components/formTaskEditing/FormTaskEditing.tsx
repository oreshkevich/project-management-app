import { SetStateAction } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TaskData } from '../../core/types/types';
import { editingTask } from '../../core/api/api';
import { useForm } from 'react-hook-form';
import './formTaskEditing.css';
import { cookies } from '../../core/cookies/cookies';

interface IData {
  title: string;
  description: string;
}

const FormTaskEditing = ({
  setShowTask,
  columnId,
  boardId,
  id,
  order,
  valueTitle,
  valueDescription,
}: {
  setShowTask: (value: SetStateAction<boolean>) => void;
  columnId: string;
  boardId: string;
  id: string;
  valueTitle: string;
  valueDescription: string;
  order: number;
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
      order: order,
      description: data.description,
      userId: String(idUser),
      columnId: columnId,
      boardId: boardId,
    };

    await editingTask(id, columnId, boardId, dataOrder);

    handleClose();
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
                value: valueTitle,
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
                value: valueDescription,
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
