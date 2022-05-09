import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { getUsers, login, signup } from '../../api/api';
import { User, NewUser } from '../../types/types';

export const checkToken = createAsyncThunk('/check', async (_, thunkAPI) => {
  try {
    await getUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
  }
});

export const submitLogin = createAsyncThunk<string, User>('/signin', async (formData, thunkAPI) => {
  try {
    const { data } = await login(formData);
    return data.token;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
  }
});

export const submitSignup = createAsyncThunk<unknown, NewUser>(
  '/signup',
  async (formData, thunkAPI) => {
    try {
      await signup(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
    }
  }
);
