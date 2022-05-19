import axios from 'axios';
import { NewUser, User, BoardData, ColData } from '../types/types';
import { ITaskCreated, ITaskEdited } from '../interfaces/interfaces';
import { cookies } from '../cookies/cookies';

const API = axios.create({
  baseURL: 'https://goodboard.herokuapp.com/',
});

API.interceptors.request.use((request) => {
  const token = cookies.get('token');

  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

export const signup = (formData: NewUser) => API.post('/signup', formData);
export const login = (formData: User) => API.post('/signin', formData);

export const getUsers = () => API.get('/users');
export const getUser = (id: string) => API.get(`/users/${id}`);
export const updateUser = (id: string, formData: NewUser) => API.put(`/users/${id}`, formData);
export const deleteUser = (id: string) => API.delete(`/users/${id}`);

export const getBoards = () => API.get('/boards');
export const createBoard = (boardData: BoardData) => API.post('/boards', boardData);
export const deleteBoard = (id: string) => API.delete(`/boards/${id}`);

export const getColumns = (boardId: string) => API.get(`/boards/${boardId}/columns`);
export const getColumn = (boardId: string, columnId: string) =>
  API.get(`/boards/${boardId}/columns/${columnId}`);
export const createColumn = (boardId: string, colData: ColData) =>
  API.post(`/boards/${boardId}/columns`, colData);
export const deleteColumn = (boardId: string, columnId: string) =>
  API.delete(`/boards/${boardId}/columns/${columnId}`);
export const editColumn = (boardId: string, columnId: string, colData: ColData) =>
  API.put(`/boards/${boardId}/columns/${columnId}`, colData);

export const getTasks = (boardId: string, columnId: string) =>
  API.get(`/boards/${boardId}/columns/${columnId}/tasks`);
export const createTask = (boardId: string, columnId: string, taskData: ITaskCreated) =>
  API.post(`/boards/${boardId}/columns/${columnId}/tasks`, taskData);
export const deleteTask = (boardId: string, columnId: string, taskId: string) =>
  API.delete(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
export const editTask = (
  boardId: string,
  columnId: string,
  taskId: string,
  taskData: ITaskEdited
) => API.put(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}`, taskData);
