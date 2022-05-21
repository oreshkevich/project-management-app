import { createSlice } from '@reduxjs/toolkit';
import { BoardState } from '../../types/types';
import {
  getColumnsCreator,
  getBoardsCreator,
  deleteBoardCreator,
  createBoardCreator,
  createColumnCreator,
  deleteColumnCreator,
  moveColumnCreator,
  createTaskCreator,
} from '../creators/BoardCreators';
import { IColData, ITaskData } from '../../interfaces/interfaces';
import { StateCol } from '../../types/types';

const initialState: BoardState = {
  boards: [],
  columns: [] as StateCol[],
  currentColumn: {} as IColData,
  currentTask: {} as ITaskData,
  currentTasks: [],
  temp: [] as StateCol[],
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setCurrentColumn(state, { payload }) {
      state.currentColumn = payload;
    },
    setCurrentTasks(state, { payload }) {
      state.currentTasks = payload;
    },
    setCurrentTask(state, { payload }) {
      state.currentTask = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getColumnsCreator.fulfilled, (state, { payload }) => {
      state.columns = payload.sort((a: IColData, b: IColData) =>
        a.order > b.order ? 1 : a.order < b.order ? -1 : 0
      );
    });
    builder.addCase(getBoardsCreator.fulfilled, (state, { payload }) => {
      state.boards = payload;
      state.columns = [];
      state.currentTasks = [];
      state.currentColumn = {} as IColData;
      state.currentTask = {} as ITaskData;
    });
    builder.addCase(createBoardCreator.fulfilled, (state, { payload }) => {
      state.boards = [...state.boards, payload];
    });
    builder.addCase(createColumnCreator.fulfilled, (state, { payload }) => {
      state.columns = [...state.columns, payload];
    });
    builder.addCase(deleteBoardCreator.fulfilled, (state, { payload }) => {
      state.boards = state.boards.filter((board) => board.id !== payload);
    });
    builder.addCase(deleteColumnCreator.fulfilled, (state, { payload }) => {
      state.columns = state.columns
        .filter((column) => column.id !== payload)
        .map((column, idx) => {
          if (column.order !== idx + 1) {
            return { ...column, order: idx + 1 };
          } else return column;
        });
    });
    builder.addCase(moveColumnCreator.fulfilled, (state, { payload }) => {
      if (state.temp.length) {
        state.columns = [
          ...state.temp.filter((column) => column.order !== payload.order),
          payload,
        ].sort((a: IColData, b: IColData) => (a.order > b.order ? 1 : a.order < b.order ? -1 : 0));
        state.temp = [];
      } else {
        state.temp = [
          ...state.columns.filter((column) => column.order !== payload.order),
          payload,
        ].sort((a: IColData, b: IColData) => (a.order > b.order ? 1 : a.order < b.order ? -1 : 0));
      }
    });
    builder.addCase(createTaskCreator.fulfilled, (state, { payload }) => {
      state.columns = state.columns.map((column) => {
        if (column.id === payload.columnId) {
          column.tasks.push(payload.task);
        }

        return column;
      });
    });
  },
});
