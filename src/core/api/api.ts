import axios from 'axios';
import { NewUser, User, BoardData, ColData } from '../types/types';
import { checkJson } from '../helpers/helpers';

const API = axios.create({
  baseURL: 'https://goodboard.herokuapp.com/',
});

API.interceptors.request.use((request) => {
  const token = checkJson();

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

export const getColumns = () =>
  API.get(`/boards/${'0e3def8f-eef5-434f-86d8-1792dc860904'}/columns`);

export const createColumn = (colData: ColData) =>
  API.post(`/boards/${'0e3def8f-eef5-434f-86d8-1792dc860904'}/columns`, colData);

export const deleteColumn = (id: string) =>
  API.delete(`/boards/${'0e3def8f-eef5-434f-86d8-1792dc860904'}/columns/${id}`);
