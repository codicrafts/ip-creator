import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MemeDraft, AnimationType } from '@/types';

interface MemeState {
  memeDrafts: MemeDraft[];
  activeDraftIndex: number;
  selectedMoodPack: string[];
  isExporting: boolean;
  exportWithBackground: boolean;
}

const initialState: MemeState = {
  memeDrafts: [],
  activeDraftIndex: 0,
  selectedMoodPack: [],
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
        // 使用展开运算符创建新对象，确保 Redux 能检测到变化
        const currentDraft = state.memeDrafts[index];
        state.memeDrafts[index] = { 
          ...currentDraft, 
          ...draft,
          // 如果更新了 groupResults，确保是新数组引用（Immer 需要新引用来检测变化）
          ...(draft.groupResults && { groupResults: draft.groupResults }),
        };
      }
    },
    updateMemeDraftGroupResult: (state, action: PayloadAction<{ index: number; groupIndex: number; result: Partial<{ generatedUrl: string | null; status: "pending" | "generating" | "done" | "error" }> }>) => {
      const { index, groupIndex, result } = action.payload;
      const draft = state.memeDrafts[index];
      if (draft && draft.groupResults && draft.groupResults[groupIndex]) {
        // 更新指定分组的结果
        draft.groupResults[groupIndex] = {
          ...draft.groupResults[groupIndex],
          ...result,
        };
        
        // 检查所有分组是否已完成，如果是，更新草稿整体状态
        // 只要没有 generating 和 pending 状态，就算完成（无论成功还是失败）
        const allCompleted = draft.groupResults.every(r => r.status === 'done' || r.status === 'error');
        if (allCompleted) {
          // 如果全部完成，检查是否有任何错误
          const hasError = draft.groupResults.some(r => r.status === 'error');
          // 如果全都是 error，则整体状态为 error；只要有一个 done，整体状态就可以是 done（或者根据业务逻辑调整）
          // 这里为了配合 GenerateButton 的逻辑（只要不是 generating 就显示重新生成），我们可以设置为 done 或 error
          // 如果所有都失败，则 error；否则 done（表示部分成功或全部成功）
          const allFailed = draft.groupResults.every(r => r.status === 'error');
          draft.status = allFailed ? 'error' : 'done';
        }
      }
    },
    setActiveDraftIndex: (state, action: PayloadAction<number>) => {
      state.activeDraftIndex = action.payload;
    },
    setSelectedMoodPack: (state, action: PayloadAction<string[]>) => {
      state.selectedMoodPack = action.payload;
    },
    toggleMoodPack: (state, action: PayloadAction<string>) => {
      const packId = action.payload;
      if (packId === 'custom') {
        // custom 是单选，选择 custom 时清空其他选择
        state.selectedMoodPack = [];
        return;
      }
      const index = state.selectedMoodPack.indexOf(packId);
      if (index === -1) {
        // 添加选择
        state.selectedMoodPack.push(packId);
      } else {
        // 移除选择
        state.selectedMoodPack.splice(index, 1);
      }
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
  updateMemeDraftGroupResult,
  setActiveDraftIndex,
  setSelectedMoodPack,
  toggleMoodPack,
  setIsExporting,
  setExportWithBackground,
} = memeSlice.actions;

export default memeSlice.reducer;

