import './card.css';
import React, { useEffect, useRef, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { Button } from 'react-bootstrap';
import { deleteColumn, getAll, getTasks } from '../../core/api/api';
import { useTranslation } from 'react-i18next';
import FormTask from '../formTask/FormTask';
interface IColData {
  title: string;
  id: string;
  order: number;
}

interface ICard {
  id: string;
  order: number;
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

const Card = (props: { data: IColData }) => {
  const [showTask, setShowTask] = useState(false);
  const [task, setTasks] = useState<Array<IColData>>();
  const handleShow = () => setShowTask(true);
  useEffect(() => {
    getAllTask();
  }, []);

  async function getAllTask() {
    const response = await getTasks();

    setTasks(response.data);
  }
  // async function getAllTask() {
  //   const response = await getAll();

  //   setTasks(response.data);
  //   console.log(response.data);
  // }
  console.log(task);
  // goodboard.herokuapp.com/boards/6a9b8c4c-2604-454d-9a76-287748c46f4d/columns/966f1705-2131-41f1-860a-40143199cc64

  const { t } = useTranslation();
  localStorage.setItem('columnId', props.data.id);
  console.log(props.data.id);
  const boardsObj = [
    {
      id: props.data.id,
      order: props.data.order,
      title: props.data.title,
      items: [
        { id: 1, order: 4, title: 'Код ревью1' },
        { id: 2, order: 5, title: 'Код ревью2' },
        { id: 3, order: 6, title: 'Код ревью3' },
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
        if ((b as ICard).order === board.order) {
          return board;
        }
        if ((b as ICard).order === (currentBoard as ICard).order) {
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
        if ((b as ICard).order === board.order) {
          return board;
        }
        if ((b as ICard).order === (currentBoard as ICard).order) {
          return currentBoard;
        }
        return b;
      })
    );
  }

  const handleDeleteBoard = (id: string) => {
    const isConfirm = confirm(`Точно вы хотите удалить колонку: ${id}`);
    if (!isConfirm) return isConfirm;
    deleteCol(id);
    // setBoards(boards.filter((todo) => (todo as ICard).id !== id));
  };

  const handleDelete = (idItem: number, board: ICard, itemTitle: string) => {
    const isConfirm = confirm(`Точно вы хотите удалить задачу: ${itemTitle}`);
    if (!isConfirm) return isConfirm;

    const boardId = board.order - 1;

    setBoards(
      boards.map((todo) =>
        (todo as ICard).order === board.order
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
        (todo as ICard).order === id
          ? {
              ...todo,
              title: item,
            }
          : todo
      )
    );
  };
  const handleEditCancel = (id: number) => {
    const boardId = id - 1;
    setBoards(
      boards.map((todo) =>
        (todo as ICard).order === id
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

  async function deleteCol(id: string) {
    const isConfirm = confirm(`Точно вы хотите удалить колонку: ${id}`);
    if (!isConfirm) return isConfirm;
    if (id) {
      await deleteColumn(id);
    }

    window.location.reload();
  }

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
            {edit && (board as ICard).order === idEditBoard ? (
              <div className="board__title-button">
                <Button variant="info" type="submit">
                  Sub
                </Button>
                <Button
                  variant="info"
                  type="button"
                  onClick={() => handleEditCancel((board as ICard).order)}
                >
                  Can.
                </Button>

                <input
                  value={(board as ICard).title}
                  onChange={(e) => handleEditTodo(e.target.value, (board as ICard).order)}
                  className="todo__single--input"
                  ref={inputRef}
                />
              </div>
            ) : (
              <div
                className="todo__single--text"
                onClick={() => handleEdit((board as ICard).order)}
              >
                {(board as ICard).title}
              </div>
            )}
          </div>

          <span className="icon" onClick={() => deleteCol((board as ICard).id)}>
            <AiFillDelete />
          </span>
          <Button variant="success" onClick={handleShow}>
            {t('header.create-task__button')}
          </Button>
          {showTask ? <FormTask setShowTask={setShowTask} /> : null}
          {(board as ICard).items.map((item) => (
            <div
              key={item.id}
              onDragOver={(e) => dragOverHandler(e)}
              onDragLeave={(e) => dragLeaveHandler(e)}
              onDragStart={(e) => dragStartHandler(e, board as ICard, item)}
              onDragEnd={(e) => dragEndHandler(e)}
              onDrop={(e) => dropHandler(e, board as ICard, item)}
              draggable={true}
              className="item"
            >
              {item.title}
              <span
                className="icon"
                onClick={() => handleDelete(item.id, board as ICard, item.title)}
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
