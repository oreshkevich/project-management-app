import './card.css';
import React, { useEffect, useRef, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { Button } from 'react-bootstrap';

interface IColData {
  title: string;
  id: string;
  order: number;
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

const Card = (props: { data: IColData }) => {
  const boardsObj = [
    {
      id: props.data.order,
      title: props.data.title,
      items: [],
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
