import { configureStore, combineReducers } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import imageReducer from './slices/imageSlice';
import memeReducer from './slices/memeSlice';
import userReducer, { UserState } from './slices/userSlice';
import { GeneratedImage } from '@/types';

const rootReducer = combineReducers({
  app: appReducer,
  image: imageReducer,
  meme: memeReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as any,
  });
}

export const store = makeStore();

export type AppDispatch = typeof store.dispatch;

