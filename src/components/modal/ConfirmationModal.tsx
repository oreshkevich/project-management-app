import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ConfirmationModal = (props: { data: boolean }) => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    setShow(props.data);
  }, [props.data]);

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
