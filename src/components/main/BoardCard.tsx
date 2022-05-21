import './card.css';
import { Button, Card } from 'react-bootstrap';
import { BoardData } from '../../core/types/types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../modal/ConfirmationModal';
import { useAppDispatch } from '../../core/hooks/redux';
import { updateState } from '../../core/store/reducers/modalReducer';

const BoardCard = (props: { data: BoardData }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  async function deleteCurrentBoard() {
    dispatch(updateState(true));
  }

  async function openBoard() {
    if (props.data.id) {
      navigate(`/board/${props.data.id}`);
    }
  }

  return (
    <>
      <Card style={{ width: '18rem' }} className="board-card">
        <Card.Body>
          <Card.Title>{props.data.title}</Card.Title>
          <Card.Text>Description</Card.Text>
          <div className="board-buttons">
            <Button variant="danger" size="sm" onClick={async () => deleteCurrentBoard()}>
              {t('main-rote.board-delete-button')}
            </Button>
            <Button variant="primary" size="lg" onClick={async () => openBoard()}>
              {t('main-rote.board-open-button')}
            </Button>
          </div>
        </Card.Body>
      </Card>
      <ConfirmationModal page={'boards'} id={`${props.data.id}`} />
    </>
  );
};

export default BoardCard;
