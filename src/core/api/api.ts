import axios from 'axios';
import { NewUser, User } from '../types/types';
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
