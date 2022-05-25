import React, { useState } from 'react';
import FormTaskEditing from '../forms/formTaskEditing/FormTaskEditing';
import { useParams } from 'react-router-dom';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { ITaskData } from '../../core/interfaces/interfaces';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../core/hooks/redux';
import { boardSlice } from '../../core/store/reducers/BoardSlice';
import { deleteTaskCreator, moveTaskCreator } from '../../core/store/creators/BoardCreators';

const Task = ({ task, tasks }: { task: ITaskData; tasks: ITaskData[] }) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { t } = useTranslation();
  const { setCurrentTask } = boardSlice.actions;
  const { currentTask } = useAppSelector((state) => state.boardReducer);

  const deleteCurrentTask = async (card = task) => {
    try {
      await dispatch(
        deleteTaskCreator({ boardId: String(id), columnId: card.columnId, taskId: card.id })
      ).unwrap();
    } catch (error) {
      alert(error);
    }
  };

  const handleDeleteTask = async () => {
    confirmAlert({
      title: `${t('conf-modal.titleTask')}`,
      message: `${t('conf-modal.bodyTask')}: ${task.order}`,
      buttons: [
        {
          label: `${t('conf-modal.delete')}`,
          onClick: () => {
            return deleteCurrentTask();
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
  };

  const dragStartHandler = (e: React.DragEvent) => {
    dispatch(setCurrentTask(task));
    e.dataTransfer.setData('task', JSON.stringify(task));
  };

  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
    if (currentTask && currentTask.columnId === task.columnId)
      (e.currentTarget as HTMLElement).style.border = '2px dashed #6C757D';
  };

  const dragLeaveHandler = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.border = '2px solid white';
  };

  const dragEndHandler = async (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.border = '2px solid white';
  };

  const dropHandler = async (e: React.DragEvent, card = task) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).style.border = '2px solid white';

    if (currentTask && currentTask.columnId === card.columnId) {
      await Promise.all(
        tasks.map(async (task: ITaskData) => {
          if (Number(currentTask.order) === card.order) return;

          if (task.id === card.id) {
            try {
              await dispatch(
                moveTaskCreator({ boardId: String(id), task: task, order: currentTask.order })
              ).unwrap();
            } catch (error) {
              alert(error);
            }
          }

          if (task.id === currentTask.id) {
            try {
              await dispatch(
                moveTaskCreator({ boardId: String(id), task: task, order: card.order })
              ).unwrap();
            } catch (error) {
              alert(error);
            }
          }
        })
      );
    }
  };

  const [showTask, setShowTask] = useState(false);
  const handleShow = () => setShowTask(true);
  return (
    <div
      className="item"
      draggable
      onDragStart={dragStartHandler}
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      onDragEnd={dragEndHandler}
      onDrop={dropHandler}
    >
      {task.title}
      <div className="icons">
        <span className="icon" onClick={handleShow}>
          <AiFillEdit />
        </span>
        <span className="icon" onClick={handleDeleteTask}>
          <AiFillDelete />
        </span>
      </div>
      {showTask && <FormTaskEditing setShowTask={setShowTask} task={task} />}
    </div>
  );
};

export default Task;
