import './card.css';
import { Button, Card } from 'react-bootstrap';
import { BoardData, CatchedError } from '../../core/types/types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../core/hooks/redux';
import { deleteBoardCreator } from '../../core/store/creators/BoardCreators';
import ToastNotification from '../modalWindows/ToastNotitfication';
import { updateToastState } from '../../core/store/reducers/modalReducer';
import { useState } from 'react';
import { confirmAlert, ReactConfirmAlertProps } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const BoardCard = ({ data }: { data: BoardData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');

  const deleteCurrentBoard = async () => {
    try {
      await dispatch(deleteBoardCreator(data.id)).unwrap();
    } catch (error) {
      setMessage((error as CatchedError).message);
      dispatch(updateToastState(true));
    }
  };

  const openBoard = () => navigate(`/board/${data.id}`);

  const handleDeleteBoard = async () => {
    confirmAlert({
      title: `${t('conf-modal.title')}`,
      message: `${t('conf-modal.body')}: ${data.title}`,
      buttons: [
        {
          label: `${t('conf-modal.delete')}`,
          onClick: () => {
            return deleteCurrentBoard();
          },
        },
        {
          label: `${t('conf-modal.cancel')}`,
          onClick: () => {
            return;
          },
        },
      ],
    } as unknown as ReactConfirmAlertProps);
  };

  return (
    <>
      <Card className="m-2" style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{data.title}</Card.Title>
          <Card.Text>Description</Card.Text>
          <div className="board-buttons">
            <Button variant="danger" size="sm" onClick={handleDeleteBoard}>
              {t('main-rote.board-delete-button')}
            </Button>
            <Button variant="primary" size="lg" onClick={openBoard}>
              {t('main-rote.board-open-button')}
            </Button>
          </div>
        </Card.Body>
      </Card>
      <ToastNotification message={message} />
    </>
  );
};

export default BoardCard;
