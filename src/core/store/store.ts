import { modalStateReducer } from './reducers/modalReducer';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../store/reducers/UserSlice';
import { isConfirmReducer } from './reducers/closeModalReducer';

const userReducer = userSlice.reducer;

export const rootReducer = combineReducers({
  userReducer,
  modalStateReducer,
  isConfirmReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};
