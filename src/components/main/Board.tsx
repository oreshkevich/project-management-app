import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getColumns, deleteColumn, createColumn } from '../../core/api/api';
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
  const [currentColumn, setCurrentColumn] = useState<IColData>();
  const { id } = useParams();

  console.log(columns);

  const handleShow = () => setShowCol(true);

  const getAllColumn = useCallback(async () => {
    const { data } = await getColumns(String(id));
    setColumns(
      [...data].sort((a, b) => {
        return a.order > b.order ? 1 : a.order < b.order ? -1 : 0;
      })
    );
  }, [id]);

  useEffect(() => {
    getAllColumn();
  }, [id, getAllColumn]);

  const dragStartHandler = (e: React.DragEvent, card: IColData) => setCurrentColumn(card);

  const dragOverHandler = (e: React.DragEvent) => e.preventDefault();

  const dropHandler = async (e: React.DragEvent, card: IColData) => {
    e.preventDefault();

    if (columns) {
      await Promise.all(
        columns.map(async (column: IColData) => {
          if (Number(currentColumn?.order) === card.order) return;

          if (column.id === card.id) {
            await deleteColumn(String(id), column.id);
            await createColumn(String(id), {
              title: column.title,
              order: Number(currentColumn?.order),
            });
          }

          if (column.id === currentColumn?.id) {
            await deleteColumn(String(id), column.id);
            await createColumn(String(id), {
              title: column.title,
              order: card.order,
            });
          }
        })
      );

      await getAllColumn();
    }
  };

  return (
    <div>
      <Button variant="success" onClick={handleShow}>
        {t('header.create-col__button')}
      </Button>
      {showCol && (
        <FormColumn
          setShowCol={setShowCol}
          getAllColumn={getAllColumn}
          order={columns?.length || 0}
        />
      )}

      <div className="app-card-data">
        {columns?.map((item: IColData) => (
          <div
            className="app-card"
            key={item.id}
            draggable
            onDragStart={(e) => dragStartHandler(e, item)}
            onDragOver={dragOverHandler}
            onDrop={(e) => dropHandler(e, item)}
          >
            <Card data={item} getAllColumn={getAllColumn} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
