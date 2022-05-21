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
import FormTask from '../forms/formTask/FormTask';
import Task from '../task/Task';
import { IColData, ITaskData } from '../../core/interfaces/interfaces';
import { AiFillDelete } from 'react-icons/ai';
import './card.css';
import ConfirmationModal from '../modalWindows/ConfirmationModal';
// import { useAppDispatch } from '../../core/hooks/redux';
// import { updateState } from '../../core/store/reducers/modalReducer';

const Card = ({
  data,
  getAllColumn,
  currentColumn,
  setCurrentColumn,
  columns,
  currentTasks,
  setCurrentTasks,
  setCurrentTask,
  currentTask,
}: {
  data: IColData;
  getAllColumn: () => Promise<void>;
  currentColumn: IColData | undefined;
  setCurrentColumn: Dispatch<SetStateAction<IColData | undefined>>;
  setCurrentTasks: Dispatch<SetStateAction<ITaskData[] | undefined>>;
  setCurrentTask: Dispatch<SetStateAction<ITaskData | undefined>>;
  columns: IColData[];
  currentTasks: ITaskData[] | undefined;
  currentTask: ITaskData | undefined;
}) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [showTask, setShowTask] = useState(false);
  const [tasks, setTasks] = useState<Array<ITaskData>>();
  const [title, setTitle] = useState(data.title);
  const [edit, setEdit] = useState<boolean>(false);

  const getAllTask = useCallback(async () => {
    const response = await getTasks(String(id), data.id);
    setTasks(
      [...response.data].sort((a, b) => (a.order > b.order ? 1 : a.order < b.order ? -1 : 0))
    );
  }, [id, data.id]);

  useEffect(() => {
    getAllTask();
  }, [getAllTask]);

  // const dispatch = useAppDispatch();

  // async function callModal() {
  //   dispatch(updateState(true));
  // }

  const deleteCurrentBoard = async () => {
    await deleteColumn(String(id), data.id);

    const columns = await getColumns(String(id));
    const sortColumns = columns.data.sort((a: IColData, b: IColData) =>
      a.order > b.order ? 1 : a.order < b.order ? -1 : 0
    );

    await Promise.all(
      sortColumns.map(async (column: IColData, idx: number) => {
        if (column.order !== idx + 1)
          await editColumn(String(id), column.id, {
            title: column.title,
            order: idx + 1,
          });
      })
    );
  };

  const handleDeleteBoard = async () => {
    const isConfirm = confirm(`Точно вы хотите удалить колонку: ${data.order}`);
    if (!isConfirm) return;
    // callModal();
    await deleteCurrentBoard();
    await getAllColumn();
  };

  const handleShow = () => setShowTask(true);
  const handleEdit = () => setEdit(true);
  const handleEditCancel = () => setEdit(false);
  const handleEditTodo = (title: string) => setTitle(title);

  const handleEditForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setEdit(false);
    await editColumn(String(id), data.id, { title, order: data.order });
    await getAllColumn();
  };

  const dragStartHandler = (e: React.DragEvent, card: IColData = data) => {
    if (e.target === e.currentTarget) {
      setCurrentColumn(card);
      setCurrentTasks(tasks);
      setCurrentTask(undefined);
    } else {
      setCurrentTasks(undefined);
    }
  };

  const dragOverHandler = (e: React.DragEvent) => e.preventDefault();

  const insertTasks = async (allTasks: ITaskData[], columnId: string) => {
    await Promise.all(
      allTasks.map(async (task: ITaskData) => {
        await createTask(String(id), columnId, {
          title: task.title,
          order: task.order,
          description: task.description,
          userId: task.userId,
        });
      })
    );
  };

  const insertColumn = async (column: IColData, order: number) => {
    await deleteColumn(String(id), column.id);
    return await createColumn(String(id), {
      title: column.title,
      order: order,
    });
  };

  const dropHandler = async (e: React.DragEvent, card: IColData = data) => {
    e.preventDefault();

    if (currentTask && tasks) {
      const copyTask = { ...currentTask };
      setCurrentTask(undefined);

      await createTask(String(id), data.id, {
        title: copyTask.title,
        order: tasks.length + 1,
        description: copyTask.description,
        userId: copyTask.userId,
      });

      await getAllTask();
    }

    if (currentColumn && currentTasks) {
      await Promise.all(
        columns.map(async (column: IColData) => {
          if (currentColumn.order === card.order) return;

          if (column.id === card.id) {
            const copyTasks = tasks ? [...tasks] : null;
            const response = await insertColumn(column, currentColumn.order);
            if (copyTasks) await insertTasks(copyTasks, response.data.id);
          }

          if (column.id === currentColumn.id) {
            const response = await insertColumn(column, card.order);
            if (currentTasks) await insertTasks(currentTasks, response.data.id);
          }
        })
      );

      await getAllColumn();
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
          <Task
            task={item}
            tasks={tasks}
            currentTask={currentTask}
            key={item.id}
            getAllTask={getAllTask}
            setCurrentTask={setCurrentTask}
          />
        ))}
      </form>
      <ConfirmationModal page={'column'} id={data.id} />
    </div>
  );
};

export default Card;
