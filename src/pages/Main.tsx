import { useEffect, useState } from 'react';
import { getBoards } from '../core/api/api';
import { BoardData } from '../core/types/types';
import BoardCard from '../components/main/BoardCard';
import LoadingIcon from '../components/loading/LoadingIcon';

export const Main = () => {
  const [boards, setBoards] = useState<Array<BoardData>>();
  const [loading, setLoading] = useState(true);

  async function getAllBoards() {
    const { data } = await getBoards();

    setBoards(data);
    setLoading(false);
  }

  useEffect(() => {
    getAllBoards();
  }, []);

  return (
    <section className="main pt-5 pl-5">
      {loading ? (
        <LoadingIcon />
      ) : (
        boards?.map((item: BoardData) => <BoardCard data={item} key={item.id} />)
      )}
    </section>
  );
};
