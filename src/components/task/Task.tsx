import React, { useState } from 'react';
import FormTaskEditing from '../forms/formTaskEditing/FormTaskEditing';
import { useParams } from 'react-router-dom';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { editTask, getTasks, deleteTask, createTask } from '../../core/api/api';
import { ITaskData } from '../../core/interfaces/interfaces';

import { useAppDispatch, useAppSelector } from '../../core/hooks/redux';
import { boardSlice } from '../../core/store/reducers/BoardSlice';

const Task = ({
  task,
  tasks,
  getAllColumn,
}: {
  task: ITaskData;
  tasks: ITaskData[];
  getAllColumn: () => Promise<void>;
}) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { setCurrentTask } = boardSlice.actions;
  const { currentTask } = useAppSelector((state) => state.boardReducer);

  const deleteCurrentTask = async (card = task) => {
    await deleteTask(String(id), card.columnId, card.id);

    const tasks = await getTasks(String(id), card.columnId);
    const sortTasks = tasks.data.sort((a: ITaskData, b: ITaskData) =>
      a.order > b.order ? 1 : a.order < b.order ? -1 : 0
    );

    await Promise.all(
      sortTasks.map(async (sortTask: ITaskData, idx: number) => {
        if (sortTask.order !== idx + 1)
          await editTask(String(id), sortTask.columnId, sortTask.id, {
            title: sortTask.title,
            order: idx + 1,
            description: sortTask.description,
            userId: sortTask.userId,
            boardId: String(id),
            columnId: sortTask.columnId,
          });
      })
    );
  };

  const handleDeleteTask = async () => {
    const isConfirm = confirm(`Точно вы хотите удалить задание: ${task.order}`);
    if (!isConfirm) return;
    await deleteCurrentTask();
    await getAllColumn();
  };

  const dragStartHandler = () => {
    dispatch(setCurrentTask(task));
  };

  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
    if (currentTask && currentTask.columnId === task.columnId)
      (e.target as HTMLElement).style.boxShadow = '0 4px 3px gray';
  };

  const dragLeaveHandler = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.boxShadow = 'none';
  };

  const dragEndHandler = async (e: React.DragEvent) => {
    (e.target as HTMLElement).style.boxShadow = 'none';

    if (!currentTask) {
      await deleteCurrentTask();
      await getAllColumn();
    }
  };

  const dropHandler = async (e: React.DragEvent, card = task) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).style.boxShadow = 'none';

    if (currentTask && currentTask.columnId === card.columnId) {
      await Promise.all(
        tasks.map(async (task: ITaskData) => {
          if (Number(currentTask.order) === card.order) return;

          if (task.id === card.id) {
            await deleteTask(String(id), task.columnId, task.id);
            await createTask(String(id), task.columnId, {
              title: task.title,
              order: currentTask.order,
              description: task.description,
              userId: task.userId,
            });
          }

          if (task.id === currentTask.id) {
            await deleteTask(String(id), task.columnId, task.id);
            await createTask(String(id), task.columnId, {
              title: task.title,
              order: card.order,
              description: task.description,
              userId: task.userId,
            });
          }
        })
      );

      await getAllColumn();
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
      <span className="icon" onClick={handleDeleteTask}>
        <AiFillDelete />
      </span>
      <span className="icon" onClick={handleShow}>
        <AiFillEdit />
      </span>
      {showTask && (
        <FormTaskEditing getAllColumn={getAllColumn} setShowTask={setShowTask} task={task} />
      )}
    </div>
  );
};

export default Task;
