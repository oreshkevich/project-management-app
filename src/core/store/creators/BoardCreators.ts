import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  getColumns,
  getBoards,
  createBoard,
  createColumn,
  getTasks,
  deleteBoard,
  deleteColumn,
  editColumn,
  createTask,
  // deleteTask,
  // editTask,
} from '../../api/api';
import { BoardData, ColData, StateCol } from '../../types/types';
import { IColData, ITaskData, ITaskCreated } from '../../interfaces/interfaces';

export const getColumnsCreator = createAsyncThunk<StateCol[], string>(
  '/getColumns',
  async (id, thunkAPI) => {
    try {
      const { data: columnData } = await getColumns(id);
      const column = await Promise.all(
        columnData.map(async (column: IColData) => {
          const { data: taskData } = await getTasks(String(id), column.id);
          return {
            ...column,
            tasks: taskData.sort((a: IColData, b: IColData) =>
              a.order > b.order ? 1 : a.order < b.order ? -1 : 0
            ),
          };
        })
      );

      return column as StateCol[];
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
    }
  }
);

export const getBoardsCreator = createAsyncThunk<[]>('/getBoards', async (_, thunkAPI) => {
  try {
    const { data } = await getBoards();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
  }
});

export const deleteBoardCreator = createAsyncThunk<string, string>(
  '/deleteBoard',
  async (id, thunkAPI) => {
    try {
      await deleteBoard(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
    }
  }
);

export const createBoardCreator = createAsyncThunk<BoardData, BoardData>(
  '/createBoard',
  async (board, thunkAPI) => {
    try {
      const { data } = await createBoard(board);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
    }
  }
);

export const createColumnCreator = createAsyncThunk<StateCol, { id: string; column: ColData }>(
  '/createColumn',
  async ({ id, column }, thunkAPI) => {
    try {
      const { data } = await createColumn(id, column);
      return { ...data, tasks: [] };
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
    }
  }
);

export const deleteColumnCreator = createAsyncThunk<string, { boardId: string; columnId: string }>(
  '/deleteColumn',
  async ({ boardId, columnId }, thunkAPI) => {
    try {
      await deleteColumn(boardId, columnId);
      const columns = await getColumns(boardId);
      const sortColumns = columns.data.sort((a: IColData, b: IColData) =>
        a.order > b.order ? 1 : a.order < b.order ? -1 : 0
      );
      await Promise.all(
        sortColumns.map(async (column: IColData, idx: number) => {
          if (column.order !== idx + 1)
            await editColumn(boardId, column.id, {
              title: column.title,
              order: idx + 1,
            });
        })
      );
      return columnId;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
    }
  }
);

// export const deleteTaskCreator = createAsyncThunk<
//   string,
//   { boardId: string; columnId: string; taskId: string }
// >('/deleteTask', async ({ boardId, columnId, taskId }, thunkAPI) => {
//   try {
//     await deleteTask(boardId, columnId, taskId);
//     const tasks = await getTasks(boardId, columnId);
//     const sortTasks = tasks.data.sort((a: ITaskData, b: ITaskData) =>
//       a.order > b.order ? 1 : a.order < b.order ? -1 : 0
//     );
//     await Promise.all(
//       sortTasks.map(async (sortTask: ITaskData, idx: number) => {
//         if (sortTask.order !== idx + 1)
//           await editTask(boardId, sortTask.columnId, sortTask.id, {
//             title: sortTask.title,
//             order: idx + 1,
//             description: sortTask.description,
//             userId: sortTask.userId,
//             boardId: boardId,
//             columnId: sortTask.columnId,
//           });
//       })
//     );
//     return taskId;
//   } catch (error) {
//     return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
//   }
// });

export const moveColumnCreator = createAsyncThunk<
  StateCol,
  { boardId: string; column: StateCol; order: number; tasks: ITaskData[] | null }
>('/moveColumn', async ({ boardId, column, order, tasks }, thunkAPI) => {
  try {
    await deleteColumn(boardId, column.id);
    const { data: columnData } = await createColumn(boardId, {
      title: column.title,
      order: order,
    });

    const copyTasks: ITaskData[] = [];

    if (tasks) {
      await Promise.all(
        tasks.map(async (task: ITaskData) => {
          const { data: taskData } = await createTask(boardId, columnData.id, {
            title: task.title,
            order: task.order,
            description: task.description,
            userId: task.userId,
          });
          copyTasks.push(taskData);
        })
      );
    }
    return { ...columnData, order: order, tasks: copyTasks };
  } catch (error) {
    return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
  }
});

export const editColumnCreator = createAsyncThunk<
  StateCol,
  { boardId: string; columnId: string; colData: ColData }
>('/editColumn', async ({ boardId, columnId, colData }, thunkAPI) => {
  try {
    const { data } = await editColumn(boardId, columnId, colData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
  }
});

export const createTaskCreator = createAsyncThunk<
  { columnId: string; task: ITaskData },
  { boardId: string; columnId: string; taskData: ITaskCreated }
>('/createTask', async ({ boardId, columnId, taskData }, thunkAPI) => {
  try {
    const { data } = await createTask(boardId, columnId, taskData);
    return { columnId, task: data };
  } catch (error) {
    return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
  }
});
