import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = { state: false };

export const isConfirm = createAction<boolean>('isConfirm');

export const isConfirmReducer = createReducer(initialState, (builder) => {
  builder.addCase(isConfirm, (state, action) => {
    state.state = action.payload;
  });
});
