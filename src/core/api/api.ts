import axios from 'axios';
import { NewUser, User, BoardData, ColData, TaskData } from '../types/types';
import { cookies } from '../cookies/cookies';

const API = axios.create({
  baseURL: 'https://goodboard.herokuapp.com/',
});

const BOARDID = localStorage.getItem('boardId');
const COLUMNID = localStorage.getItem('columnId');

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
export const createColumn = (colData: ColData) => API.post(`/boards/${BOARDID}/columns`, colData);
export const deleteColumn = (id: string) => API.delete(`/boards/${BOARDID}/columns/${id}`);

export const getTasks = () => API.get(`/boards/${BOARDID}/columns/${COLUMNID}/tasks`);
export const createTask = (colData: TaskData) =>
  API.post(`/boards/${BOARDID}/columns/${COLUMNID}/tasks`, colData);
export const deleteTask = (id: string) =>
  API.delete(`/boards/${BOARDID}/columns/${COLUMNID}/tasks/${id}`);
