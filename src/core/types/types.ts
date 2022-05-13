import { rootReducer, setupStore } from '../store/store';

export type User = {
  login: string;
  password: string;
};

export type NewUser = User & {
  name: string;
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export type UserState = {
  token: string | null;
};

export type CatchedError = {
  statusCode: number;
  message: string;
};

export type BoardData = {
  title: string;
  id: string | null;
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

export type Boards = {
  data: [BoardData];
};
