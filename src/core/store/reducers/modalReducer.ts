import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = { state: false };

export const updateToastState = createAction<boolean>('updateState');

export const modalStateReducer = createReducer(initialState, (builder) => {
  builder.addCase(updateToastState, (state, action) => {
    state.state = action.payload;
  });
});
