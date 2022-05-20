import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getColumns } from '../../core/api/api';
import { useTranslation } from 'react-i18next';
import Card from './Card';
import FormColumn from '../forms/formColumn/FormColumn';
import { IColData, ITaskData } from '../../core/interfaces/interfaces';
import LoadingIcon from '../loading/LoadingIcon';

const Board = () => {
  const { t } = useTranslation();
  const [showCol, setShowCol] = useState(false);
  const [columns, setColumns] = useState<Array<IColData>>();
  const [currentColumn, setCurrentColumn] = useState<IColData>();
  const [currentTasks, setCurrentTasks] = useState<ITaskData[]>();
  const [currentTask, setCurrentTask] = useState<ITaskData>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const handleShow = () => setShowCol(true);

  const getAllColumn = useCallback(async () => {
    const { data } = await getColumns(String(id));
    setLoading(false);
    setColumns([...data].sort((a, b) => (a.order > b.order ? 1 : a.order < b.order ? -1 : 0)));
  }, [id]);

  useEffect(() => {
    getAllColumn();
  }, [getAllColumn]);

  return (
    <div>
      {loading ? (
        <LoadingIcon />
      ) : (
        <>
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
              <Card
                data={item}
                key={item.id}
                getAllColumn={getAllColumn}
                columns={columns}
                setCurrentColumn={setCurrentColumn}
                currentColumn={currentColumn}
                setCurrentTasks={setCurrentTasks}
                currentTasks={currentTasks}
                setCurrentTask={setCurrentTask}
                currentTask={currentTask}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Board;
