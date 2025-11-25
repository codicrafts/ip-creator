import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MemeDraft, AnimationType } from '@/types';

interface MemeState {
  memeDrafts: MemeDraft[];
  activeDraftIndex: number;
  selectedMoodPack: string;
  isExporting: boolean;
  exportWithBackground: boolean;
}

const initialState: MemeState = {
  memeDrafts: [],
  activeDraftIndex: 0,
  selectedMoodPack: 'custom',
  isExporting: false,
  exportWithBackground: true, // 默认有背景色
};

const memeSlice = createSlice({
  name: 'meme',
  initialState,
  reducers: {
    setMemeDrafts: (state, action: PayloadAction<MemeDraft[]>) => {
      state.memeDrafts = action.payload;
    },
    updateMemeDraft: (state, action: PayloadAction<{ index: number; draft: Partial<MemeDraft> }>) => {
      const { index, draft } = action.payload;
      if (state.memeDrafts[index]) {
        state.memeDrafts[index] = { ...state.memeDrafts[index], ...draft };
      }
    },
    setActiveDraftIndex: (state, action: PayloadAction<number>) => {
      state.activeDraftIndex = action.payload;
    },
    setSelectedMoodPack: (state, action: PayloadAction<string>) => {
      state.selectedMoodPack = action.payload;
    },
    setIsExporting: (state, action: PayloadAction<boolean>) => {
      state.isExporting = action.payload;
    },
    setExportWithBackground: (state, action: PayloadAction<boolean>) => {
      state.exportWithBackground = action.payload;
    },
  },
});

export const {
  setMemeDrafts,
  updateMemeDraft,
  setActiveDraftIndex,
  setSelectedMoodPack,
  setIsExporting,
  setExportWithBackground,
} = memeSlice.actions;

export default memeSlice.reducer;

