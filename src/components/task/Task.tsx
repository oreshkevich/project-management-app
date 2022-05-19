import { AiFillDelete, AiFillEdit } from 'react-icons/ai';

interface ITaskData {
  title: string;
  id: string;
  order: number;
  done: boolean;
  description: string;
  userId: string;
  files: { filename: string; fileSize: number }[];
}

const Task = ({ task }: { task: ITaskData }) => {
  // const dragOverHandler = (
  //   e: React.DragEvent<HTMLDivElement> | React.DragEvent<HTMLFormElement>
  // ) => {
  //   e.preventDefault();

  //   if ((e.target as HTMLFormElement).className === 'item') {
  //     (e.target as HTMLFormElement).style.boxShadow = '0 4px 3px gray';
  //   }
  // };

  // function dragLeaveHandler(e: React.DragEvent<HTMLDivElement>) {
  //   (e.target as HTMLDivElement).style.boxShadow = 'none';
  // }

  // function dragStartHandler(
  //   _e: React.DragEvent<HTMLDivElement>,
  //   board: React.SetStateAction<ICard>,
  //   item: React.SetStateAction<IItem>
  // ) {
  //   setCurrentBoard(board as ICard);
  //   setCurrentItem(item as IItem);
  // }
  // function dragEndHandler(e: React.DragEvent<HTMLDivElement>) {
  //   (e.target as HTMLDivElement).style.boxShadow = 'none';
  // }

  // function dropHandler(e: React.DragEvent<HTMLDivElement>, board: ICard, item: IItem) {
  //   e.preventDefault();

  //   const currentIndex = (currentBoard as ICard).items.indexOf(currentItem as IItem);

  //   (currentBoard as ICard).items.splice(currentIndex, 1);
  //   const dropIndex = board.items.indexOf(item);
  //   board.items.splice(dropIndex + 1, 0, currentItem as IItem);
  // }

  // function dropCardHandler() {
  //   console.log(data);
  // }

  // const handleDelete = (idItem: number, board: ICard, itemTitle: string) => {
  //   const isConfirm = confirm(`Точно вы хотите удалить задачу: ${itemTitle}`);
  //   if (!isConfirm) return isConfirm;
  // };

  return (
    <div
      // onDragOver={dragOverHandler}
      // onDragLeave={dragLeaveHandler}
      // onDragStart={(e) => dragStartHandler(e, board as ICard)}
      // onDragEnd={dragEndHandler}
      // onDrop={(e) => dropHandler(e, board as ICard)}
      draggable={true}
      className="item"
    >
      {task.title}
      <span
        className="icon"
        //onClick={() => handleDelete(item.order, board as ICard, item.title)}
      >
        <AiFillDelete />
      </span>
      <span className="icon">
        <AiFillEdit />
      </span>
    </div>
  );
};

export default Task;
