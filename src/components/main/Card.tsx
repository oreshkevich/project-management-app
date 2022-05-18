import React, { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {
  deleteColumn,
  editColumn,
  getColumns,
  getTasks,
  createColumn,
  createTask,
} from '../../core/api/api';
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

const Card = ({
  data,
  getAllColumn,
  currentColumn,
  setCurrentColumn,
  columns,
  currentTasks,
  setCurrentTasks,
}: {
  data: IColData;
  getAllColumn: () => void;
  currentColumn: IColData | undefined;
  setCurrentColumn: Dispatch<SetStateAction<IColData | undefined>>;
  setCurrentTasks: Dispatch<SetStateAction<ITaskData[] | undefined>>;
  columns: IColData[];
  currentTasks: ITaskData[] | undefined;
}) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [showTask, setShowTask] = useState(false);
  const [tasks, setTasks] = useState<Array<ITaskData>>();
  const [title, setTitle] = useState(data.title);
  const [edit, setEdit] = useState<boolean>(false);

  const getAllTask = useCallback(async () => {
    const response = await getTasks(String(id), data.id);
    setTasks(response.data);
  }, [id, data.id]);

  useEffect(() => {
    getAllTask();
  }, [getAllTask]);

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

  const dragStartHandler = () => {
    setCurrentColumn(data);
    setCurrentTasks(tasks);
  };

  const dragOverHandler = (e: React.DragEvent) => e.preventDefault();

  const dropHandler = async (e: React.DragEvent, card: IColData = data) => {
    e.preventDefault();

    if (columns) {
      await Promise.all(
        columns.map(async (column: IColData) => {
          if (Number(currentColumn?.order) === card.order) return;

          if (column.id === card.id) {
            const copyTasks = tasks ? [...tasks] : null;

            await deleteColumn(String(id), column.id);
            const response = await createColumn(String(id), {
              title: column.title,
              order: Number(currentColumn?.order),
            });

            if (copyTasks) {
              await Promise.all(
                copyTasks.map(async (task: ITaskData) => {
                  await createTask(String(id), response.data.id, {
                    title: task.title,
                    order: task.order,
                    description: task.description,
                    userId: task.userId,
                  });
                })
              );
            }
          }

          if (column.id === currentColumn?.id) {
            await deleteColumn(String(id), column.id);
            const response = await createColumn(String(id), {
              title: column.title,
              order: card.order,
            });

            if (currentTasks) {
              await Promise.all(
                currentTasks.map(async (task: ITaskData) => {
                  await createTask(String(id), response.data.id, {
                    title: task.title,
                    order: task.order,
                    description: task.description,
                    userId: task.userId,
                  });
                })
              );
            }
          }
        })
      );

      getAllColumn();
    }
  };

  return (
    <div
      className="app-card"
      draggable
      onDragStart={dragStartHandler}
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
    >
      <form onSubmit={handleEditForm} key={data.id} className="board scroll-task">
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
        {showTask && (
          <FormTask
            setShowTask={setShowTask}
            columnId={data.id}
            getAllTask={getAllTask}
            order={tasks?.length || 0}
          />
        )}
        {tasks?.map((item) => (
          <Task task={item} key={item.order} />
        ))}
      </form>
    </div>
  );
};

export default Card;
