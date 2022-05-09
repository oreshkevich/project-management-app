import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '../../types/types';
import { checkJson } from '../../helpers/helpers';
import { checkToken, submitLogin } from '../creators/asyncCreators';

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
  extraReducers: (builder) => {
    builder.addCase(checkToken.rejected, (state) => {
      localStorage.setItem('token', JSON.stringify(null));
      state.token = null;
    });
    builder.addCase(submitLogin.fulfilled, (state, { payload }) => {
      localStorage.setItem('token', JSON.stringify(payload));
      state.token = payload;
    });
  },
});
