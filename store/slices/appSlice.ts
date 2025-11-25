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
  setIsPaymentModalOpen,
  setIsQuotaModalOpen,
} = appSlice.actions;

export default appSlice.reducer;

