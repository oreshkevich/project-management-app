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
  deleteTaskCreator,
  moveTaskCreator,
  editTaskCreator,
  editColumnCreator,
} from '../creators/BoardCreators';
import { IColData, ITaskData } from '../../interfaces/interfaces';
import { StateCol } from '../../types/types';

const initialState: BoardState = {
  boards: [],
  columns: [] as StateCol[],
  currentColumn: {} as IColData,
  currentTask: {} as ITaskData,
  currentTasks: [],
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
      state.boards.push(payload);
    });
    builder.addCase(createColumnCreator.fulfilled, (state, { payload }) => {
      state.columns.push(payload);
    });
    builder.addCase(editColumnCreator.fulfilled, (state, { payload }) => {
      const column = state.columns.find((column) => column.id === payload.id);
      if (column) column.title = payload.title;
    });
    builder.addCase(deleteBoardCreator.fulfilled, (state, { payload }) => {
      const boardIdx = state.boards.findIndex((board) => board.id === payload);
      state.boards.splice(boardIdx, 1);
    });
    builder.addCase(deleteColumnCreator.fulfilled, (state, { payload }) => {
      const columnIdx = state.columns.findIndex((column) => column.id === payload);
      state.columns.splice(columnIdx, 1);
      state.columns = state.columns.map((column, idx) => {
        if (column.order !== idx + 1) {
          return { ...column, order: idx + 1 };
        } else return column;
      });
    });
    builder.addCase(moveColumnCreator.fulfilled, (state, { payload }) => {
      const columnIdx = state.columns.findIndex((column) => column.order === payload.order);
      state.columns.splice(columnIdx, 1, payload);
    });
    builder.addCase(moveTaskCreator.fulfilled, (state, { payload }) => {
      const column = state.columns.find((column) => column.id === payload.columnId);
      const taskIdx = column?.tasks.findIndex((task) => task.order === payload.order);

      if (column?.tasks && typeof taskIdx === 'number') column.tasks.splice(taskIdx, 1, payload);
    });
    builder.addCase(createTaskCreator.fulfilled, (state, { payload }) => {
      const column = state.columns.find((column) => column.id === payload.columnId);
      column?.tasks.push(payload.task);
    });
    builder.addCase(deleteTaskCreator.fulfilled, (state, { payload }) => {
      const column = state.columns.find((column) => column.id === payload.columnId);
      const taskIdx = column?.tasks.findIndex((task) => task.id === payload.taskId);

      if (column?.tasks && typeof taskIdx === 'number') {
        column.tasks.splice(taskIdx, 1);
        column.tasks = column?.tasks.map((task, idx) => {
          if (task.order !== idx + 1) {
            return { ...task, order: idx + 1 };
          } else return task;
        });
      }
    });
    builder.addCase(editTaskCreator.fulfilled, (state, { payload }) => {
      const task = state.columns
        .find((column) => column.id === payload.columnId)
        ?.tasks.find((task) => task.id === payload.id);

      if (task) {
        task.title = payload.title;
        task.description = payload.description;
      }
    });
  },
});
