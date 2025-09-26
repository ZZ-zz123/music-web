import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import userReducer from './slices/userSlice';
import playlistReducer from './slices/playlistSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    user: userReducer,
    playlist: playlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
