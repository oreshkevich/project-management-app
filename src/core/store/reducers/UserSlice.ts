import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '../../types/types';
import { submitLogin, deleteProfile, getProfile, editProfile } from '../creators/UserCreators';
import {
  getColumnsCreator,
  createBoardCreator,
  createColumnCreator,
} from '../creators/BoardCreators';
import { cookies, removeCookies } from '../../cookies/cookies';

const initialState: UserState = {
  token: cookies.get('token'),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, { payload }) {
      state.token = payload;
      removeCookies();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitLogin.fulfilled, (state, { payload }) => {
      state.token = payload.token;
      cookies.set('token', payload.token, { path: '/', maxAge: 86400 });
      cookies.set('password', payload.password, { path: '/', maxAge: 86400 });
      cookies.set('id', payload.id, { path: '/', maxAge: 86400 });
    });
    builder.addCase(getProfile.fulfilled, (_, { payload }) => {
      cookies.set('name', payload.name, { path: '/', maxAge: 86400 });
      cookies.set('login', payload.login, { path: '/', maxAge: 86400 });
    });
    builder.addCase(deleteProfile.fulfilled, (state) => {
      state.token = null;
      removeCookies();
    });
    builder.addCase(deleteProfile.rejected, (state) => {
      state.token = null;
      removeCookies();
    });
    builder.addCase(getProfile.rejected, (state) => {
      state.token = null;
      removeCookies();
    });
    builder.addCase(editProfile.rejected, (state) => {
      state.token = null;
      removeCookies();
    });
    builder.addCase(getColumnsCreator.rejected, (state) => {
      state.token = null;
      removeCookies();
    });
    builder.addCase(createBoardCreator.rejected, (state) => {
      state.token = null;
      removeCookies();
    });
    builder.addCase(createColumnCreator.rejected, (state) => {
      state.token = null;
      removeCookies();
    });
  },
});
