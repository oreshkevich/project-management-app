import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '../../types/types';
import { submitLogin, deleteProfile, getProfile, editProfile } from '../creators/UserCreators';
import { cookies } from '../../cookies/cookies';

const initialState: UserState = {
  token: cookies.get('token'),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, { payload }) {
      state.token = payload;
      cookies.set('token', payload, { path: '/', maxAge: 0 });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitLogin.fulfilled, (state, { payload }) => {
      state.token = payload;
      cookies.set('token', payload, { path: '/', maxAge: 3600 });
    });
    builder.addCase(deleteProfile.fulfilled, (state) => {
      state.token = null;
      cookies.set('token', state.token, { path: '/', maxAge: 0 });
    });
    builder.addCase(deleteProfile.rejected, (state) => {
      state.token = null;
      cookies.set('token', state.token, { path: '/', maxAge: 0 });
    });
    builder.addCase(getProfile.rejected, (state) => {
      state.token = null;
      cookies.set('token', state.token, { path: '/', maxAge: 0 });
    });
    builder.addCase(editProfile.rejected, (state) => {
      state.token = null;
      cookies.set('token', state.token, { path: '/', maxAge: 0 });
    });
  },
});
