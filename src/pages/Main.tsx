import { useEffect } from 'react';
import { BoardData } from '../core/types/types';
import BoardCard from '../components/main/BoardCard';

import { useAppDispatch, useAppSelector } from '../core/hooks/redux';
import { getBoardsCreator } from '../core/store/creators/BoardCreators';
import { CatchedError } from '../core/types/types';

export const Main = () => {
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.boardReducer);

  useEffect(() => {
    const getAllBoards = async () => {
      try {
        await dispatch(getBoardsCreator()).unwrap();
      } catch (error) {
        if ((error as CatchedError).statusCode !== 401) alert((error as CatchedError).message);
      }
    };

    getAllBoards();
  }, [dispatch]);

  return (
    <section className="main pt-5 pl-5 pb-5 d-flex justify-content-center flex-wrap">
      {boards.map((item: BoardData) => (
        <BoardCard data={item} key={item.id} />
      ))}
    </section>
  );
};
