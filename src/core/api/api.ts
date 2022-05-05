import axios from 'axios';

import { NewUser, User } from '../types/types';

const API = axios.create({
  baseURL: 'https://goodboard.herokuapp.com/',
});

export const signup = (formData: NewUser) => API.post('/signup', formData);
export const login = (formData: User) => API.post('/signin', formData);
