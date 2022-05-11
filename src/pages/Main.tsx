import { useEffect, useState } from 'react';
import Board from '../components/main/Board';
import { getBoards } from '../core/api/api';
import { BoardData } from '../core/types/types';

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
    <section className="main container pt-5 main-route">
      {boards?.map((item: BoardData) => (
        <Board data={item} key={item.id} />
      ))}
    </section>
  );
};
