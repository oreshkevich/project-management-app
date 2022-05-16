import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai';
import { Button } from 'react-bootstrap';
import { deleteColumn, editColumn, getColumns, getTasks } from '../../core/api/api';
import { useTranslation } from 'react-i18next';
import FormTask from '../formTask/FormTask';
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
  boardId: string;
  columnId: string;
  description: string;
  files: [];
  userId: string;
}

interface ICard {
  id: number;
  title: string;
  items: IItem[];
}

interface ICardBoard {
  id?: number;
  title?: string;
  items: IItem[];
}

interface IItem {
  id: number;
  title: string;
}

const Card = ({
  data,
  setCount,
}: {
  data: IColData;
  setCount: Dispatch<SetStateAction<number>>;
}) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [showTask, setShowTask] = useState(false);
  const [countTask, setCountTask] = useState(1);
  const [tasks, setTasks] = useState<Array<ITaskData>>();
  localStorage.setItem('columnId', data.id);
  const boardsObj = [
    {
      id: data.id,
      order: data.order,
      title: data.title,

      items: [
        // { id: 5, title: 'Код ревью1' },
        // { id: 5, title: 'Код ревью2' },
        // { id: 6, title: 'Код ревью3' },
      ],
    },
    // {
    //   id: 2,
    //   title: 'Проверить',
    //   items: [
    //     { id: 4, title: 'Код ревью1' },
    //     { id: 5, title: 'Код ревью2' },
    //     { id: 6, title: 'Код ревью3' },
    //   ],
    // },
    // {
    //   id: 3,
    //   title: 'Сделано',
    //   items: [
    //     { id: 7, title: 'Код1' },
    //     { id: 8, title: 'Код2' },
    //     { id: 9, title: 'Код3' },
    //   ],
    // },
  ];

  const [boards, setBoards] =
    useState<(ICard | ICardBoard | { title: string | undefined } | null)[]>(boardsObj);

  const [currentBoard, setCurrentBoard] = useState<ICard | null>(null);
  const [currentItem, setCurrentItem] = useState<IItem | null>(null);

  const dragOverHandler = (
    e: React.DragEvent<HTMLDivElement> | React.DragEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if ((e.target as HTMLFormElement).className === 'item') {
      (e.target as HTMLFormElement).style.boxShadow = '0 4px 3px gray';
    }
  };

  function dragLeaveHandler(e: React.DragEvent<HTMLDivElement>) {
    (e.target as HTMLDivElement).style.boxShadow = 'none';
  }

  function dragStartHandler(
    _e: React.DragEvent<HTMLDivElement>,
    board: React.SetStateAction<ICard>,
    item: React.SetStateAction<IItem>
  ) {
    setCurrentBoard(board as ICard);
    setCurrentItem(item as IItem);
  }
  function dragEndHandler(e: React.DragEvent<HTMLDivElement>) {
    (e.target as HTMLDivElement).style.boxShadow = 'none';
  }

  function dropHandler(e: React.DragEvent<HTMLDivElement>, board: ICard, item: IItem) {
    e.preventDefault();

    const currentIndex = (currentBoard as ICard).items.indexOf(currentItem as IItem);

    (currentBoard as ICard).items.splice(currentIndex, 1);
    const dropIndex = board.items.indexOf(item);
    board.items.splice(dropIndex + 1, 0, currentItem as IItem);
    setBoards(
      boards.map((b) => {
        if ((b as ICard).id === board.id) {
          return board;
        }
        if ((b as ICard).id === (currentBoard as ICard).id) {
          return currentBoard;
        }
        return b;
      })
    );
  }

  function dropCardHandler(_e: React.DragEvent<HTMLFormElement>, board: ICard) {
    board.items.push(currentItem as IItem);
    const currentIndex = (currentBoard as ICard).items.indexOf(currentItem as IItem);
    (currentBoard as ICard).items.splice(currentIndex, 1);
    setBoards(
      boards.map((b) => {
        if ((b as ICard).id === board.id) {
          return board;
        }
        if ((b as ICard).id === (currentBoard as ICard).id) {
          return currentBoard;
        }
        return b;
      })
    );
  }

  const handleDeleteBoard = (id: number) => {
    const isConfirm = confirm(`Точно вы хотите удалить колонку: ${id}`);
    if (!isConfirm) return isConfirm;
    setBoards(boards.filter((todo) => (todo as ICard).id !== id));
    deleteCurrentBoard();
  };

  const handleDelete = (idItem: number, board: ICard, itemTitle: string) => {
    const isConfirm = confirm(`Точно вы хотите удалить задачу: ${itemTitle}`);
    if (!isConfirm) return isConfirm;

    const boardId = board.id - 1;

    setBoards(
      boards.map((todo) =>
        (todo as ICard).id === board.id
          ? {
              ...todo,
              items: (boards[boardId] as ICard | ICardBoard).items.filter(
                (todo: { id: number }) => todo.id !== idItem
              ),
            }
          : todo
      )
    );
  };
  const [idEditBoard, setIdEditBoard] = useState<number>(-1);
  const [edit, setEdit] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  const handleEdit = (id: number) => {
    setIdEditBoard(id);
    if (!edit) {
      setEdit(!edit);
    }
  };
  const handleEditTodo = (item: string, id: number) => {
    setBoards(
      boards.map((todo) =>
        (todo as ICard).id === id
          ? {
              ...todo,
              title: item,
            }
          : todo
      )
    );
    editColumn(String(id), String(data.id), { title: item, order: data.order });
  };

  const handleEditCancel = (id: number) => {
    const boardId = id - 1;
    setBoards(
      boards.map((todo) =>
        (todo as ICard).id === id
          ? {
              ...todo,
              title: boardsObj[boardId].title,
            }
          : todo
      )
    );

    setEdit(false);
    setIdEditBoard(-1);
  };
  const handleEditForm = (e: React.FormEvent) => {
    e.preventDefault();

    setEdit(false);
    setIdEditBoard(-1);
  };

  async function deleteCurrentBoard() {
    if (data.id) {
      await deleteColumn(String(id), data.id);
      setCount((count) => count - 1);

      const columns = await getColumns(String(id));

      columns.data.map((column: IColData, idx: number) =>
        editColumn(String(id), String(column.id), { title: column.title, order: idx + 1 })
      );
    }
  }

  console.log(tasks);
  const handleShow = () => setShowTask(true);

  useEffect(() => {
    async function getAllTask() {
      const response = await getTasks(String(id), data.id);
      setTasks(response.data);
      setCountTask(response.data.length + 1);
    }

    getAllTask();
  }, [id, data.id]);

  return (
    <div className="app-card">
      {boards.map((board) => (
        <form
          onSubmit={(e) => handleEditForm(e)}
          key={(board as ICard).id}
          className="board"
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropCardHandler(e, board as ICard)}
        >
          <div className="board__title">
            {edit && (board as ICard).id === idEditBoard ? (
              <div className="board__title-button">
                <Button variant="info" type="submit">
                  Sub
                </Button>
                <Button
                  variant="info"
                  type="button"
                  onClick={() => handleEditCancel((board as ICard).id)}
                >
                  Can.
                </Button>

                <input
                  value={(board as ICard).title}
                  onChange={(e) => handleEditTodo(e.target.value, (board as ICard).id)}
                  className="todo__single--input"
                  ref={inputRef}
                />
              </div>
            ) : (
              <div className="todo__single--text" onClick={() => handleEdit((board as ICard).id)}>
                {(board as ICard).title}
              </div>
            )}
          </div>

          <span className="icon" onClick={() => handleDeleteBoard((board as ICard).id)}>
            <AiFillDelete />
          </span>
          <Button variant="success" onClick={handleShow}>
            {t('header.create-task__button')}
          </Button>
          {showTask ? (
            <FormTask
              setShowTask={setShowTask}
              boardId={String(id)}
              columnId={data.id}
              countTask={countTask}
              setCountTask={setCount}
            />
          ) : null}
          {((tasks as ITaskData[]) ? (tasks as ITaskData[]) : []).map((item) => (
            <div
              key={item.order}
              onDragOver={(e) => dragOverHandler(e)}
              onDragLeave={(e) => dragLeaveHandler(e)}
              // onDragStart={(e) => dragStartHandler(e, board as ICard)}
              onDragEnd={(e) => dragEndHandler(e)}
              // onDrop={(e) => dropHandler(e, board as ICard)}
              draggable={true}
              className="item"
            >
              {item.title}
              <span
                className="icon"
                onClick={() => handleDelete(item.order, board as ICard, item.title)}
              >
                <AiFillDelete />
              </span>
            </div>
          ))}
        </form>
      ))}
    </div>
  );
};

export default Card;
