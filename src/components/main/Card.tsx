import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { deleteColumn, editColumn, getColumns, getTasks } from '../../core/api/api';
import { useTranslation } from 'react-i18next';
import FormTask from '../formTask/FormTask';
import Task from '../task/Task';

import { AiFillDelete } from 'react-icons/ai';
import './card.css';

interface IColData {
  title: string;
  id: string;
  order: number;
}

interface ITaskData {
  title: string;
  id: string;
  order: number;
  done: boolean;
  description: string;
  userId: string;
  files: { filename: string; fileSize: number }[];
}

const Card = ({ data, getAllColumn }: { data: IColData; getAllColumn: () => void }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [showTask, setShowTask] = useState(false);
  const [tasks, setTasks] = useState<Array<ITaskData>>();
  const [title, setTitle] = useState(data.title);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    async function getAllTask() {
      const response = await getTasks(String(id), data.id);
      setTasks(response.data);
    }

    getAllTask();
  }, [id, data.id]);

  const deleteCurrentBoard = async () => {
    if (data.id) {
      await deleteColumn(String(id), data.id);
      const columns = await getColumns(String(id));

      await Promise.all(
        columns.data.map(async (column: IColData, idx: number) => {
          if (column.order !== idx + 1)
            await editColumn(String(id), String(column.id), {
              title: column.title,
              order: idx + 1,
            });
        })
      );
    }
  };

  const handleDeleteBoard = async () => {
    const isConfirm = confirm(`Точно вы хотите удалить колонку: ${data.order}`);
    if (!isConfirm) return isConfirm;
    await deleteCurrentBoard();
    getAllColumn();
  };

  const handleShow = () => setShowTask(true);
  const handleEdit = () => setEdit(true);
  const handleEditCancel = () => setEdit(false);
  const handleEditTodo = (title: string) => setTitle(title);

  const handleEditForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setEdit(false);
    await editColumn(String(id), String(data.id), { title, order: data.order });
    getAllColumn();
  };

  return (
    <form onSubmit={handleEditForm} key={data.id} className="board">
      <div className="board__title">
        {edit ? (
          <div className="board__title-button">
            <Button variant="info" type="submit">
              Sub
            </Button>
            <Button variant="info" type="button" onClick={handleEditCancel}>
              Can.
            </Button>

            <input
              defaultValue={title}
              onChange={(e) => handleEditTodo(e.target.value)}
              className="todo__single--input"
            />
          </div>
        ) : (
          <div className="todo__single--text" onClick={handleEdit}>
            {title}
          </div>
        )}
      </div>

      <span className="icon" onClick={handleDeleteBoard}>
        <AiFillDelete />
      </span>
      <Button variant="success" onClick={handleShow}>
        {t('header.create-task__button')}
      </Button>
      {/* {showTask ? (
          <FormTask
            setShowTask={setShowTask}
            boardId={String(id)}
            columnId={data.id}
            countTask={countTask}
            setCountTask={setCount}
          />
        ) : null} */}
      {tasks?.map((item) => (
        <Task task={item} key={item.order} />
      ))}
    </form>
  );
};

export default Card;
