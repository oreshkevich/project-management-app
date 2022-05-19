import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = { state: false };

export const updateState = createAction<boolean>('updateState');

export const modalStateReducer = createReducer(initialState, (builder) => {
  builder.addCase(updateState, (state, action) => {
    state.state = action.payload;
  });
});
