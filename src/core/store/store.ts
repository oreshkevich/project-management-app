import { modalStateReducer } from './reducers/modalReducer';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../store/reducers/UserSlice';

const userReducer = userSlice.reducer;

export const rootReducer = combineReducers({
  userReducer,
  modalStateReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};
