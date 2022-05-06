import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '../../types/types';

const initialState: UserState = {
  token: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, { payload }) {
      state.token = payload;
    },
  },
});
