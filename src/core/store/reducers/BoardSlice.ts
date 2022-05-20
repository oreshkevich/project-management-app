import { createSlice } from '@reduxjs/toolkit';
import { BoardState } from '../../types/types';

const initialState: BoardState = {
  boards: [],
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoards(state, { payload }) {
      state.boards = payload;
    },
    addBoard(state, { payload }) {
      state.boards = [...state.boards, payload];
    },
  },
});
