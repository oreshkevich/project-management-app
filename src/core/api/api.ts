import axios from 'axios';
import { NewUser, User } from '../types/types';
import { checkJson } from '../helpers/helpers';

const API = axios.create({
  baseURL: 'https://goodboard.herokuapp.com/',
});

API.interceptors.request.use((req) => {
  const token = checkJson();

  if (token && req.headers) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const signup = (formData: NewUser) => API.post('/signup', formData);
export const login = (formData: User) => API.post('/signin', formData);

export const getUsers = () => API.get('/users');
