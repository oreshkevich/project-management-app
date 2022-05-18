import './card.css';
import { Button, Card } from 'react-bootstrap';
import { BoardData } from '../../core/types/types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { deleteBoard } from '../../core/api/api';

const BoardCard = (props: { data: BoardData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  async function deleteCurrentBoard() {
    if (props.data.id) {
      await deleteBoard(props.data.id);
    }
  }

  async function openBoard() {
    if (props.data.id) {
      navigate(`/board/${props.data.id}`);
    }
  }

  return (
    <Card style={{ width: '18rem' }}>
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
  );
};

export default BoardCard;
