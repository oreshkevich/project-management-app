import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../core/hooks/redux';
import { updateToastState } from '../../core/store/reducers/modalReducer';

const ConfirmationModal = () => {
  const { t } = useTranslation();
  const state = useAppSelector((state) => state.modalStateReducer);
  const dispatch = useAppDispatch();

  const [show, setShow] = useState(state.state);

  const handleClose = () => {
    dispatch(updateToastState(false));
    setShow(false);
  };

  // async function deleteHandler() {
  //   if (props.page == 'boards') {
  //     await deleteBoard(props.id);

  //     window.location.reload();
  //   } else if (props.page == 'column') {
  //     //
  //   }
  // }

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
          <Button variant="danger" onClick={handleClose}>
            {t('conf-modal.delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
