import { useState, useEffect, useCallback } from 'react';
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
  const [count, setCount] = useState(1);
  const { id } = useParams();

  const handleShow = () => setShowCol(true);

  const getAllColumn = useCallback(async () => {
    const { data } = await getColumns(String(id));
    setColumns(data);
    setCount(data.length + 1);
    //console.log(data);
  }, [id]);

  useEffect(() => {
    getAllColumn();
  }, [id, getAllColumn]);

  return (
    <div>
      <Button variant="success" onClick={handleShow}>
        {t('header.create-col__button')}
      </Button>
      {showCol ? (
        <FormColumn
          setShowCol={setShowCol}
          getAllColumn={getAllColumn}
          count={count}
          setCount={setCount}
        />
      ) : null}

      <div className="app-card-data">
        {columns?.map((item: IColData) => (
          <Card data={item} key={item.id} setCount={setCount} />
        ))}
      </div>
    </div>
  );
};

export default Board;
