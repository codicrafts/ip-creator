import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import imageReducer from './slices/imageSlice';
import memeReducer from './slices/memeSlice';
import userReducer, { UserState } from './slices/userSlice';
import { GeneratedImage } from '@/types';

export interface RootState {
  app: ReturnType<typeof appReducer>;
  image: ReturnType<typeof imageReducer>;
  meme: ReturnType<typeof memeReducer>;
  user: UserState;
}

export function makeStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: {
      app: appReducer,
      image: imageReducer,
      meme: memeReducer,
      user: userReducer,
    },
    preloadedState: preloadedState,
  });
}

export const store = makeStore();

export type AppDispatch = typeof store.dispatch;

