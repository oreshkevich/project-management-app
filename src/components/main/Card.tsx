import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { createTask } from '../../core/api/api';
import { useTranslation } from 'react-i18next';
import FormTask from '../forms/formTask/FormTask';
import Task from '../task/Task';
import { IColData } from '../../core/interfaces/interfaces';
import { StateCol } from '../../core/types/types';
import { AiFillDelete } from 'react-icons/ai';
import './card.css';
import ConfirmationModal from '../modalWindows/ConfirmationModal';
//import { updateState } from '../../core/store/reducers/modalReducer';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useAppDispatch, useAppSelector } from '../../core/hooks/redux';
import { boardSlice } from '../../core/store/reducers/BoardSlice';
import {
  deleteColumnCreator,
  moveColumnCreator,
  editColumnCreator,
  // createTaskCreator,
} from '../../core/store/creators/BoardCreators';

const Card = ({
  column,
  getAllColumn,
}: {
  column: StateCol;
  getAllColumn: () => Promise<void>;
}) => {
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

  const deleteCurrentColumn = async () => {
    try {
      await dispatch(deleteColumnCreator({ boardId: String(id), columnId: column.id }));
    } catch (error) {
      alert(error);
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
    });
    // const isConfirm = confirm(`Точно вы хотите удалить колонку: ${column.order}`);
    // if (!isConfirm) return;
    //dispatch(updateState(true));
    // await deleteCurrentColumn();
  };

  const handleShow = () => setShowTask(true);
  const handleEdit = () => setEdit(true);
  const handleEditCancel = () => setEdit(false);
  const handleEditTodo = (title: string) => setTitle(title);

  const handleEditForm = async (e: React.FormEvent) => {
    e.preventDefault();
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
      alert(error);
    }
  };

  const dragStartHandler = (e: React.DragEvent, card: IColData = column) => {
    if (e.target === e.currentTarget) {
      dispatch(setCurrentColumn(card));
      dispatch(setCurrentTasks(column.tasks));
      dispatch(setCurrentTask(undefined));
    } else {
      dispatch(setCurrentTasks(undefined));
    }
  };

  const dragOverHandler = (e: React.DragEvent) => e.preventDefault();

  const dropHandler = async (e: React.DragEvent, card: IColData = column) => {
    e.preventDefault();

    if (currentTask && column.tasks) {
      const copyTask = { ...currentTask };
      dispatch(setCurrentTask(undefined));

      await createTask(String(id), column.id, {
        title: copyTask.title,
        order: column.tasks.length + 1,
        description: copyTask.description,
        userId: copyTask.userId,
      });

      await getAllColumn();

      // try {
      //   await dispatch(
      //     createTaskCreator({
      //       boardId: String(id),
      //       columnId: column.id,
      //       taskData: {
      //         title: copyTask.title,
      //         order: column.tasks.length + 1,
      //         description: copyTask.description,
      //         userId: copyTask.userId,
      //       },
      //     })
      //   );
      // } catch (error) {
      //   alert(error);
      // }
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
              alert(error);
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
              alert(error);
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
      onDrop={dropHandler}
    >
      <form onSubmit={handleEditForm} key={column.id} className="board scroll-task">
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
            columnId={column.id}
            order={column.tasks?.length || 0}
          />
        )}
        {column.tasks?.length
          ? column.tasks.map((item) => (
              <Task task={item} tasks={column.tasks} key={item.id} getAllColumn={getAllColumn} />
            ))
          : null}
      </form>
      <ConfirmationModal />
    </div>
  );
};

export default Card;
