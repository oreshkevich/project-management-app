import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getColumns } from '../../core/api/api';
import { useTranslation } from 'react-i18next';
import Card from './Card';
import FormColumn from '../formColumn/FormColumn';

interface IColData {
  title: string;
  id: string;
  order: number;
}

const Board = () => {
  const { t } = useTranslation();
  const [showCol, setShowCol] = useState(false);
  const [columns, setColumns] = useState<Array<IColData>>();
  const handleShow = () => setShowCol(true);
  const { id } = useParams();

  useEffect(() => {
    const getAllColumn = async () => {
      const response = await getColumns(String(id));

      setColumns(response.data);
    };

    getAllColumn();
  }, [id]);

  return (
    <div>
      <Button variant="success" onClick={handleShow}>
        {t('header.create-col__button')}
      </Button>
      {showCol ? <FormColumn setShowCol={setShowCol} /> : null}

      <div className="app-card-data">
        {columns?.map((item: IColData) => (
          <Card data={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default Board;
