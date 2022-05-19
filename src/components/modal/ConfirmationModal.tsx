import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { deleteBoard, deleteColumn } from '../../core/api/api';
import { useAppDispatch, useAppSelector } from '../../core/hooks/redux';
import { updateState } from '../../core/store/reducers/modalReducer';

const ConfirmationModal = (props: { page: string; id: string }) => {
  const state = useAppSelector((state) => state.modalStateReducer);
  const dispatch = useAppDispatch();

  const [show, setShow] = useState(state.state);

  const { t } = useTranslation();

  const { id } = useParams();

  const handleClose = () => {
    dispatch(updateState(false));

    setShow(false);
  };

  async function deleteHandler() {
    if (props.page == 'boards') {
      await deleteBoard(props.id);
    } else if (props.page == 'column') {
      await deleteColumn(String(id), props.id);
    }
  }

  useEffect(() => {
    setShow(state.state);
  }, [state.state]);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('conf-modal.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('conf-modal.body')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('conf-modal.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleClose();
              deleteHandler();
            }}
          >
            {t('conf-modal.delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
