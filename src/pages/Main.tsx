import { useEffect, useCallback } from 'react';
import { getBoards } from '../core/api/api';
import { BoardData } from '../core/types/types';
import BoardCard from '../components/main/BoardCard';

import { useAppDispatch, useAppSelector } from '../core/hooks/redux';
import { boardSlice } from '../core/store/reducers/BoardSlice';

export const Main = () => {
  const dispatch = useAppDispatch();
  const { setBoards } = boardSlice.actions;
  const { boards } = useAppSelector((state) => state.boardReducer);

  const getAllBoards = useCallback(async () => {
    const { data } = await getBoards();
    dispatch(setBoards(data));
  }, [dispatch, setBoards]);

  useEffect(() => {
    getAllBoards();
  }, [getAllBoards]);

  return (
    <section className="main pt-5 pl-5 pb-5">
      {boards?.map((item: BoardData) => (
        <BoardCard data={item} key={item.id} getAllBoards={getAllBoards} />
      ))}
    </section>
  );
};
