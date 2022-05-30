import { modalStateReducer } from './reducers/modalReducer';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../store/reducers/UserSlice';
import { boardSlice } from './reducers/BoardSlice';
import { isConfirmReducer } from './reducers/closeModalReducer';

const userReducer = userSlice.reducer;
const boardReducer = boardSlice.reducer;

export const rootReducer = combineReducers({
  userReducer,
  boardReducer,
  modalStateReducer,
  isConfirmReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};
