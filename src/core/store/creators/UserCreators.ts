import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { login, signup, updateUser, deleteUser, getUser } from '../../api/api';
import { User, NewUser } from '../../types/types';
import jwt_decode from 'jwt-decode';

export const submitLogin = createAsyncThunk<
  { token: string; password: string; login: string; id: string },
  User
>('/signin', async (formData, thunkAPI) => {
  try {
    const { data } = await login(formData);
    return {
      token: data.token,
      login: formData.login,
      password: formData.password,
      id: (jwt_decode(String(data.token)) as { userId: string }).userId,
    };
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

export const editProfile = createAsyncThunk<unknown, { id: string; formData: NewUser }>(
  '/edit',
  async ({ id, formData }, thunkAPI) => {
    try {
      await updateUser(id, formData);
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
    }
  }
);

export const deleteProfile = createAsyncThunk<unknown, string>('/delete', async (id, thunkAPI) => {
  try {
    await deleteUser(id);
  } catch (error) {
    return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
  }
});

export const getProfile = createAsyncThunk<{ name: string; login: string }, string>(
  '/user',
  async (id, thunkAPI) => {
    try {
      const { data } = await getUser(id);
      return data as { name: string; login: string };
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data);
    }
  }
);
