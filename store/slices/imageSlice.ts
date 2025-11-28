import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GeneratedImage, SceneDraft } from "@/types";

interface ImageState {
  sourceImage: string | null;
  mimeType: string;
  prompt: string;
  selectedStyle: string | null;
  aspectRatio: string;
  imageSize: "1K" | "2K" | "4K";
  imageFormat: "PNG" | "JPEG" | "WEBP";
  resultImage: string | null;
  history: GeneratedImage[];
  sceneDrafts: SceneDraft[]; // 场景扩展草稿列表
  activeSceneDraftIndex: number; // 当前活动的草稿索引
}

const initialState: ImageState = {
  sourceImage: null,
  mimeType: "image/png",
  prompt: "",
  selectedStyle: null,
  aspectRatio: "16:9",
  imageSize: "1K",
  imageFormat: "PNG",
  resultImage: null,
  history: [],
  sceneDrafts: [],
  activeSceneDraftIndex: 0,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setSourceImage: (
      state,
      action: PayloadAction<{ image: string; mimeType: string }>
    ) => {
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
    setImageSize: (state, action: PayloadAction<"1K" | "2K" | "4K">) => {
      state.imageSize = action.payload;
    },
    setImageFormat: (state, action: PayloadAction<"PNG" | "JPEG" | "WEBP">) => {
      state.imageFormat = action.payload;
    },
    setResultImage: (state, action: PayloadAction<string | null>) => {
      state.resultImage = action.payload;
    },
    addToHistory: (state, action: PayloadAction<GeneratedImage>) => {
      state.history = [action.payload, ...state.history].slice(0, 10);
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter(
        (item) => item.id !== action.payload
      );
    },
    setHistory: (state, action: PayloadAction<GeneratedImage[]>) => {
      state.history = action.payload;
    },
    resetImageState: (state) => {
      state.sourceImage = null;
      state.prompt = "";
      state.selectedStyle = null;
      state.resultImage = null;
    },
    setSceneDrafts: (state, action: PayloadAction<SceneDraft[]>) => {
      state.sceneDrafts = action.payload || [];
    },
    addSceneDraft: (state, action: PayloadAction<SceneDraft>) => {
      if (!state.sceneDrafts) {
        state.sceneDrafts = [];
      }
      state.sceneDrafts.push(action.payload);
    },
    updateSceneDraft: (
      state,
      action: PayloadAction<{ index: number; draft: Partial<SceneDraft> }>
    ) => {
      if (!state.sceneDrafts) {
        state.sceneDrafts = [];
        return;
      }
      const { index, draft } = action.payload;
      if (state.sceneDrafts[index]) {
        state.sceneDrafts[index] = { ...state.sceneDrafts[index], ...draft };
      }
    },
    removeSceneDraft: (state, action: PayloadAction<number>) => {
      if (!state.sceneDrafts) {
        state.sceneDrafts = [];
        return;
      }
      state.sceneDrafts.splice(action.payload, 1);
      if (state.activeSceneDraftIndex >= state.sceneDrafts.length) {
        state.activeSceneDraftIndex = Math.max(0, state.sceneDrafts.length - 1);
      }
    },
    setActiveSceneDraftIndex: (state, action: PayloadAction<number>) => {
      state.activeSceneDraftIndex = action.payload;
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
  setSceneDrafts,
  addSceneDraft,
  updateSceneDraft,
  removeSceneDraft,
  setActiveSceneDraftIndex,
} = imageSlice.actions;

export default imageSlice.reducer;
