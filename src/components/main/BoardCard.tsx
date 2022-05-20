import './card.css';
import { Button, Card } from 'react-bootstrap';
import { BoardData } from '../../core/types/types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../modal/ConfirmationModal';
import { useAppDispatch } from '../../core/hooks/redux';
import { updateState } from '../../core/store/reducers/modalReducer';
import { deleteBoard } from '../../core/api/api';

const BoardCard = ({
  data,
  getAllBoards,
}: {
  data: BoardData;
  getAllBoards: () => Promise<void>;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const deleteCurrentBoard = async () => {
    dispatch(updateState(true));
    await deleteBoard(String(data.id));
    await getAllBoards();
  };

  const openBoard = () => navigate(`/board/${data.id}`);

  return (
    <>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{data.title}</Card.Title>
          <Card.Text>Description</Card.Text>
          <div className="board-buttons">
            <Button variant="danger" size="sm" onClick={deleteCurrentBoard}>
              {t('main-rote.board-delete-button')}
            </Button>
            <Button variant="primary" size="lg" onClick={openBoard}>
              {t('main-rote.board-open-button')}
            </Button>
          </div>
        </Card.Body>
      </Card>
      <ConfirmationModal />
    </>
  );
};

export default BoardCard;
