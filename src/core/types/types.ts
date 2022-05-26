import { IColData, ITaskData } from '../interfaces/interfaces';
import { rootReducer, setupStore } from '../store/store';

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export type UserState = {
  token: string | null;
};

export type StateCol = {
  title: string;
  id: string;
  order: number;
  tasks: ITaskData[];
};

export type BoardState = {
  boards: BoardData[];
  columns: StateCol[];
  currentColumn: IColData;
  currentTask: ITaskData;
  currentTasks: ITaskData[];
};

export type User = {
  login: string;
  password: string;
};

export type NewUser = User & {
  name: string;
};

export type CatchedError = {
  statusCode: number;
  message: string;
};

export type BoardData = {
  title: string;
  id: string;
};

export type ColData = {
  title: string;
  order: number;
};

export type TaskData = {
  title: string;
  order: number;
  description: string;
};
