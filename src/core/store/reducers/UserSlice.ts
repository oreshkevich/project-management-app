import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '../../types/types';
import { checkJson } from '../../helpers/helpers';

const initialState: UserState = {
  token: checkJson(),
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
