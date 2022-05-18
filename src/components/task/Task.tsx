import { useParams } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai';
import { editTask, getTasks, deleteTask } from '../../core/api/api';

interface ITaskData {
  title: string;
  id: string;
  order: number;
  done: boolean;
  description: string;
  userId: string;
  files: { filename: string; fileSize: number }[];
}

const Task = ({
  task,
  getAllTask,
  columnId,
}: {
  task: ITaskData;
  getAllTask: () => Promise<void>;
  columnId: string;
}) => {
  const { id } = useParams();

  const deleteCurrentTask = async () => {
    await deleteTask(String(id), columnId, task.id);

    const tasks = await getTasks(String(id), columnId);
    const sortTasks = tasks.data.sort((a: ITaskData, b: ITaskData) => {
      return a.order > b.order ? 1 : a.order < b.order ? -1 : 0;
    });

    await Promise.all(
      sortTasks.map(async (sortTask: ITaskData, idx: number) => {
        if (sortTask.order !== idx + 1)
          await editTask(String(id), columnId, sortTask.id, {
            title: sortTask.title,
            order: idx + 1,
            description: sortTask.description,
            userId: sortTask.userId,
            boardId: String(id),
            columnId: columnId,
          });
      })
    );
  };

  const handleDeleteTask = async () => {
    const isConfirm = confirm(`Точно вы хотите удалить задание: ${task.order}`);
    if (!isConfirm) return isConfirm;
    await deleteCurrentTask();
    await getAllTask();
  };

  return (
    <div draggable className="item">
      {task.title}
      <span className="icon" onClick={handleDeleteTask}>
        <AiFillDelete />
      </span>
    </div>
  );
};

export default Task;
