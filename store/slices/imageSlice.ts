import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GeneratedImage } from '@/types';

interface ImageState {
  sourceImage: string | null;
  mimeType: string;
  prompt: string;
  selectedStyle: string | null;
  aspectRatio: string;
  imageSize: '1K' | '2K' | '4K';
  imageFormat: 'PNG' | 'JPEG' | 'WEBP';
  resultImage: string | null;
  history: GeneratedImage[];
}

const initialState: ImageState = {
  sourceImage: null,
  mimeType: 'image/png',
  prompt: '',
  selectedStyle: null,
  aspectRatio: '16:9',
  imageSize: '1K',
  imageFormat: 'PNG',
  resultImage: null,
  history: [],
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setSourceImage: (state, action: PayloadAction<{ image: string; mimeType: string }>) => {
      state.sourceImage = action.payload.image;
      state.mimeType = action.payload.mimeType;
      // 保存到 localStorage（在 action 外部处理，避免在 reducer 中直接操作 localStorage）
    },
    setPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = action.payload;
    },
    setSelectedStyle: (state, action: PayloadAction<string | null>) => {
      state.selectedStyle = action.payload;
    },
    setAspectRatio: (state, action: PayloadAction<string>) => {
      state.aspectRatio = action.payload;
    },
    setImageSize: (state, action: PayloadAction<'1K' | '2K' | '4K'>) => {
      state.imageSize = action.payload;
    },
    setImageFormat: (state, action: PayloadAction<'PNG' | 'JPEG' | 'WEBP'>) => {
      state.imageFormat = action.payload;
    },
    setResultImage: (state, action: PayloadAction<string | null>) => {
      state.resultImage = action.payload;
    },
    addToHistory: (state, action: PayloadAction<GeneratedImage>) => {
      state.history = [action.payload, ...state.history].slice(0, 10);
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter(item => item.id !== action.payload);
    },
    setHistory: (state, action: PayloadAction<GeneratedImage[]>) => {
      state.history = action.payload;
    },
    resetImageState: (state) => {
      state.sourceImage = null;
      state.prompt = '';
      state.selectedStyle = null;
      state.resultImage = null;
    },
  },
});

export const {
  setSourceImage,
  setPrompt,
  setSelectedStyle,
  setAspectRatio,
  setImageSize,
  setImageFormat,
  setResultImage,
  addToHistory,
  removeFromHistory,
  setHistory,
  resetImageState,
} = imageSlice.actions;

export default imageSlice.reducer;

