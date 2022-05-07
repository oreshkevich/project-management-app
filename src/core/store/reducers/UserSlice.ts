import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '../../types/types';

const initialState: UserState = {
  token: JSON.parse(localStorage.getItem('token') || ''),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, { payload }) {
      localStorage.setItem('token', JSON.stringify(payload));
      state.token = payload;
    },
  },
});
