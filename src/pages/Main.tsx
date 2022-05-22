import { useEffect, useState } from 'react';
import { BoardData } from '../core/types/types';
import BoardCard from '../components/main/BoardCard';
import LoadingIcon from '../components/loading/LoadingIcon';

import { useAppDispatch, useAppSelector } from '../core/hooks/redux';
import { getBoardsCreator } from '../core/store/creators/BoardCreators';
import { CatchedError } from '../core/types/types';

export const Main = () => {
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.boardReducer);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const getAllBoards = async () => {
      try {
        await dispatch(getBoardsCreator()).unwrap();
      } catch (error) {
        if ((error as CatchedError).statusCode !== 401) alert((error as CatchedError).message);
      }
    };

    getAllBoards();
    setLoading(false);
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <LoadingIcon />
      ) : (
        <>
          <form
            className="form-inline my-2 my-lg-0 pt-5 m-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="form-control mx-auto"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={(event) => setSearchText(event.target.value)}
              autoFocus
            />
          </form>
          <section className="main pt-3 pb-5 d-flex justify-content-center flex-wrap">
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
