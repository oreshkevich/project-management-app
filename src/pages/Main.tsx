import { useEffect, useState } from 'react';
import { getBoards } from '../core/api/api';
import { BoardData } from '../core/types/types';
import BoardCard from '../components/main/BoardCard';

export const Main = () => {
  const [boards, setBoards] = useState<Array<BoardData>>();

  async function getAllBoards() {
    const response = await getBoards();

    setBoards(response.data);
  }

  useEffect(() => {
    getAllBoards();
  }, []);

  return (
    <section className="main pt-5 pl-5">
      {boards?.map((item: BoardData) => (
        <BoardCard data={item} key={item.id} />
      ))}
    </section>
  );
};
