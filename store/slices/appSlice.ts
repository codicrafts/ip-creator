import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppView, LoadingState } from '@/types';

interface AppState {
  currentView: AppView;
  loadingState: LoadingState;
  errorMsg: string | null;
  viewingHistoryItem: string | null; // history item id
  isSelectionMode: boolean;
  selectedHistoryIds: string[];
  isPaymentModalOpen: boolean;
  isQuotaModalOpen: boolean;
  createPageMode: 'scene' | 'meme'; // 控制 /create 页面的默认 tab
}

const initialState: AppState = {
  currentView: AppView.HOME,
  loadingState: LoadingState.IDLE,
  errorMsg: null,
  viewingHistoryItem: null,
  isSelectionMode: false,
  selectedHistoryIds: [],
  isPaymentModalOpen: false,
  isQuotaModalOpen: false,
  createPageMode: 'scene', // 默认场景扩展模式
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<AppView>) => {
      state.currentView = action.payload;
    },
    setLoadingState: (state, action: PayloadAction<LoadingState>) => {
      state.loadingState = action.payload;
    },
    setErrorMsg: (state, action: PayloadAction<string | null>) => {
      state.errorMsg = action.payload;
    },
    setViewingHistoryItem: (state, action: PayloadAction<string | null>) => {
      state.viewingHistoryItem = action.payload;
    },
    setIsSelectionMode: (state, action: PayloadAction<boolean>) => {
      state.isSelectionMode = action.payload;
    },
    setSelectedHistoryIds: (state, action: PayloadAction<string[]>) => {
      state.selectedHistoryIds = action.payload;
    },
    toggleHistorySelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedHistoryIds.includes(id)) {
        state.selectedHistoryIds = state.selectedHistoryIds.filter(x => x !== id);
      } else {
        if (state.selectedHistoryIds.length < 9) {
          state.selectedHistoryIds.push(id);
        }
      }
    },
    setCreatePageMode: (state, action: PayloadAction<'scene' | 'meme'>) => {
      state.createPageMode = action.payload;
    },
    setIsPaymentModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isPaymentModalOpen = action.payload;
    },
    setIsQuotaModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isQuotaModalOpen = action.payload;
    },
  },
});

export const {
  setCurrentView,
  setLoadingState,
  setErrorMsg,
  setViewingHistoryItem,
  setIsSelectionMode,
  setSelectedHistoryIds,
  toggleHistorySelection,
  setCreatePageMode,
  setIsPaymentModalOpen,
  setIsQuotaModalOpen,
} = appSlice.actions;

export default appSlice.reducer;

