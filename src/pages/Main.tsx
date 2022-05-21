import { useEffect, useState } from 'react';
import { getBoards } from '../core/api/api';
import { BoardData } from '../core/types/types';
import BoardCard from '../components/main/BoardCard';
import LoadingIcon from '../components/loading/LoadingIcon';

export const Main = () => {
  const [boards, setBoards] = useState<Array<BoardData>>();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  async function getAllBoards() {
    const { data } = await getBoards();

    setBoards(data);
    setLoading(false);
  }

  useEffect(() => {
    getAllBoards();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingIcon />
      ) : (
        <>
          <form className="form-inline my-2 my-lg-0">
            <input
              className="form-control mx-auto"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={(event) => setSearchText(event.target.value)}
              autoFocus
            />
          </form>
          <section className="row" style={{ width: '100%' }}>
            {boards
              ?.filter((value: BoardData) => {
                if (!searchText) {
                  return value;
                } else if (value.title.toLowerCase().includes(searchText.toLowerCase())) {
                  return value;
                }
              })
              .map((item: BoardData) => (
                <BoardCard data={item} key={item.id} />
              ))}
          </section>
        </>
      )}
    </>
  );
};
