import { Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai';
import { editTask, getTasks, deleteTask, createTask } from '../../core/api/api';
import { ITaskData } from '../../core/interfaces/interfaces';

const Task = ({
  task,
  tasks,
  getAllTask,
  setCurrentTask,
  setCurrentTasks,
  currentTask,
  currentTasks,
}: {
  task: ITaskData;
  tasks: ITaskData[];
  getAllTask: () => Promise<void>;
  setCurrentTask: Dispatch<SetStateAction<ITaskData | undefined>>;
  setCurrentTasks: Dispatch<SetStateAction<ITaskData[] | undefined>>;
  currentTask: ITaskData | undefined;
  currentTasks: ITaskData[] | undefined;
}) => {
  const { id } = useParams();

  const deleteCurrentTask = async () => {
    await deleteTask(String(id), task.columnId, task.id);

    const tasks = await getTasks(String(id), task.columnId);
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
    await getAllTask();
  };

  const dragStartHandler = () => {
    setCurrentTask(task);
  };

  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).style.boxShadow = '0 4px 3px gray';
  };

  const dragLeaveHandler = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.boxShadow = 'none';
  };

  const dragEndHandler = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.boxShadow = 'none';
  };

  const dropHandler = async (e: React.DragEvent, card = task) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).style.boxShadow = 'none';

    if (currentTask && currentTask.columnId !== card.columnId) {
      console.log(currentTask);
      //console.log(card);
      console.log(currentTasks);

      //await deleteCurrentTask();
      // await createTask(String(id), task.columnId, {
      //   title: task.title,
      //   order: card.order,
      //   description: task.description,
      //   userId: task.userId,
      // });
    }

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

      await getAllTask();
    }
  };

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
    </div>
  );
};

export default Task;
