import './card.css';
import React, { useState } from 'react';

interface ICard {
  id: number;
  title: string;
  items: IItem[];
}
interface IItem {
  id: number;
  title: string;
}

const Card = () => {
  const [boards, setBoards] = useState<(ICard | null)[]>([
    {
      id: 1,
      title: 'Сделать',
      items: [
        { id: 1, title: 'Пойти в магазин1' },
        { id: 2, title: 'Пойти в магазин2' },
        { id: 3, title: 'Пойти в магазин3' },
      ],
    },
    {
      id: 2,
      title: 'Проверить',
      items: [
        { id: 4, title: 'Код ревью1' },
        { id: 5, title: 'Код ревью2' },
        { id: 6, title: 'Код ревью3' },
      ],
    },
    {
      id: 3,
      title: 'Сделано',
      items: [
        { id: 7, title: 'Код1' },
        { id: 8, title: 'Код2' },
        { id: 9, title: 'Код3' },
      ],
    },
  ]);
  const [currentBoard, setCurrentBoard] = useState<ICard | null>(null);
  const [currentItem, setCurrentItem] = useState<IItem | null>(null);

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if ((e.target as HTMLDivElement).className === 'item') {
      (e.target as HTMLDivElement).style.boxShadow = '0 4px 3px gray';
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

  function dropCardHandler(_e: React.DragEvent<HTMLDivElement>, board: ICard) {
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

  return (
    <div className="appCard">
      {boards.map((board) => (
        <div
          key={(board as ICard).id}
          className="board"
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropCardHandler(e, board as ICard)}
        >
          <div className="board__title">{(board as ICard).title}</div>
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
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Card;
