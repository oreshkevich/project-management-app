import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import FormTask from '../forms/formTask/FormTask';
import Task from '../task/Task';
import { IColData } from '../../core/interfaces/interfaces';
import { CatchedError, StateCol } from '../../core/types/types';
import { AiFillDelete } from 'react-icons/ai';
import './card.css';
import { confirmAlert, ReactConfirmAlertProps } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useAppDispatch, useAppSelector } from '../../core/hooks/redux';
import { boardSlice } from '../../core/store/reducers/BoardSlice';
import {
  deleteColumnCreator,
  moveColumnCreator,
  editColumnCreator,
  createTaskCreator,
  deleteTaskCreator,
} from '../../core/store/creators/BoardCreators';
import { updateToastState } from '../../core/store/reducers/modalReducer';
import ToastNotification from '../modalWindows/ToastNotitfication';

const Card = ({ column }: { column: StateCol }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const { setCurrentColumn, setCurrentTasks, setCurrentTask } = boardSlice.actions;
  const { columns } = useAppSelector((state) => state.boardReducer);
  const { currentColumn } = useAppSelector((state) => state.boardReducer);
  const { currentTasks } = useAppSelector((state) => state.boardReducer);
  const { currentTask } = useAppSelector((state) => state.boardReducer);

  const [showTask, setShowTask] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [edit, setEdit] = useState<boolean>(false);
  const [isDrag, setIsDrag] = useState(false);
  const [message, setMessage] = useState('');

  const deleteCurrentColumn = async () => {
    try {
      await dispatch(deleteColumnCreator({ boardId: String(id), columnId: column.id }));
    } catch (error) {
      setMessage((error as CatchedError).message);
      dispatch(updateToastState(true));
    }
  };

  const handleDeleteBoard = async () => {
    confirmAlert({
      title: `${t('conf-modal.titleColumn')}`,
      message: `${t('conf-modal.bodyColumn')}: ${column.order}`,
      buttons: [
        {
          label: `${t('conf-modal.delete')}`,
          onClick: () => {
            return deleteCurrentColumn();
          },
        },
        {
          label: `${t('conf-modal.cancel')}`,
          onClick: () => {
            return;
          },
        },
      ],
    } as unknown as ReactConfirmAlertProps);
  };

  const handleShow = () => setShowTask(true);
  const handleEdit = () => setEdit(true);
  const handleEditCancel = () => setEdit(false);
  const handleEditTodo = (title: string) => setTitle(title);

  const handleEditForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length < 4) return;

    setEdit(false);
    try {
      await dispatch(
        editColumnCreator({
          boardId: String(id),
          columnId: column.id,
          colData: { title, order: column.order },
        })
      );
    } catch (error) {
      setMessage((error as CatchedError).message);
      dispatch(updateToastState(true));
    }
  };

  const dragStartHandler = (e: React.DragEvent, card: IColData = column) => {
    if (e.target === e.currentTarget) {
      dispatch(setCurrentColumn(card));
      dispatch(setCurrentTasks(column.tasks));
      dispatch(setCurrentTask(null));
    } else {
      dispatch(setCurrentTasks(null));
    }
  };

  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
    if (!currentTask || (currentTask && currentTask.columnId !== column.id)) setIsDrag(true);
  };

  const dragLeaveHandler = (e: React.DragEvent) => {
    e.preventDefault();
    if (
      (e.target as HTMLElement).className === 'board over' ||
      (e.target as HTMLElement).className === 'app-card'
    )
      setIsDrag(false);
  };

  const dropHandler = async (e: React.DragEvent, card: IColData = column) => {
    e.preventDefault();
    setIsDrag(false);

    if (currentTask && currentTask.columnId !== card.id) {
      const droppedTask = JSON.parse(e.dataTransfer.getData('task'));

      try {
        await dispatch(
          deleteTaskCreator({
            boardId: String(id),
            columnId: droppedTask.columnId,
            taskId: droppedTask.id,
          })
        ).unwrap();
        await dispatch(
          createTaskCreator({
            boardId: String(id),
            columnId: column.id,
            taskData: {
              title: currentTask.title,
              order: column.tasks.length + 1,
              description: currentTask.description,
              userId: currentTask.userId,
            },
          })
        ).unwrap();
      } catch (error) {
        alert(error);
      }
    }

    if (currentColumn && currentTasks) {
      await Promise.all(
        columns.map(async (column: StateCol) => {
          if (currentColumn.order === card.order) return;

          if (column.id === card.id) {
            const copyTasks = column.tasks ? [...column.tasks] : null;
            try {
              await dispatch(
                moveColumnCreator({
                  boardId: String(id),
                  column: column,
                  order: currentColumn.order,
                  tasks: copyTasks,
                })
              ).unwrap();
            } catch (error) {
              setMessage((error as CatchedError).message);
              dispatch(updateToastState(true));
            }
          }

          if (column.id === currentColumn.id) {
            try {
              await dispatch(
                moveColumnCreator({
                  boardId: String(id),
                  column: column,
                  order: card.order,
                  tasks: currentTasks.length ? currentTasks : null,
                })
              ).unwrap();
            } catch (error) {
              setMessage((error as CatchedError).message);
              dispatch(updateToastState(true));
            }
          }
        })
      );
    }
  };

  return (
    <div
      className="app-card"
      draggable
      onDragStart={dragStartHandler}
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={dropHandler}
    >
      <form onSubmit={handleEditForm} key={column.id} className={isDrag ? 'board over' : 'board'}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="board__title">
            {edit ? (
              <div className="board__title-button">
                <div className="d-inline-flex">
                  <Button variant="light" type="submit">
                    {t('card.submit')}
                  </Button>
                  <Button variant="light" type="button" onClick={handleEditCancel}>
                    {t('card.cancel')}
                  </Button>
                </div>

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
        </div>
        {showTask && (
          <FormTask
            setShowTask={setShowTask}
            columnId={column.id}
            order={column.tasks?.length || 0}
          />
        )}
        <div className="tasks">
          {column.tasks?.length
            ? column.tasks.map((item) => <Task task={item} tasks={column.tasks} key={item.id} />)
            : null}
        </div>

        <Button className="create-task" variant="light" onClick={handleShow}>
          {t('header.create-task__button')}
        </Button>
      </form>
      <ToastNotification message={message} />
    </div>
  );
};

export default Card;
