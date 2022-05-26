import './card.css';
import { Card } from 'react-bootstrap';
import { BoardData, CatchedError } from '../../core/types/types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../core/hooks/redux';
import { deleteBoardCreator } from '../../core/store/creators/BoardCreators';
import { AiFillDelete } from 'react-icons/ai';
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

  const handleDeleteBoard = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
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
      <Card className="card-board m-2" onClick={openBoard}>
        <Card.Body className="d-flex justify-content-between">
          <Card.Title>{data.title}</Card.Title>
          <span className="icon" onClick={handleDeleteBoard}>
            <AiFillDelete />
          </span>
        </Card.Body>
      </Card>
      <ToastNotification message={message} />
    </>
  );
};

export default BoardCard;
