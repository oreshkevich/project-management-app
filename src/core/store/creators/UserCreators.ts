import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { getUsers, login, signup, updateUser, deleteUser, getUser } from '../../api/api';
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
