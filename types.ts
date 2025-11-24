export enum AppView {
  HOME = 'HOME',
  UPLOAD = 'UPLOAD',
  EDIT = 'EDIT',
  RESULT = 'RESULT',
  PROFILE = 'PROFILE',
  MEME_EDITOR = 'MEME_EDITOR'
}

export interface GeneratedImage {
  id: string; // Added unique ID
  url: string;
  timestamp: number;
  prompt: string;
  style?: string; // Optional style info
}

export enum LoadingState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export enum UserTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export interface DailyUsage {
  date: string; // YYYY-MM-DD
  count: number;
}

export enum AnimationType {
  NONE = 'none',
  SHAKE = 'shake',
  PULSE = 'pulse',
  ZOOM = 'zoom',
  SPIN = 'spin'
}

export interface MemeDraft {
  id: string;
  sourceUrl: string;
  generatedUrl: string | null;
  text: string; // The text overlay
  moodPrompt: string; // e.g., "laughing out loud"
  status: 'pending' | 'generating' | 'done' | 'error';
  animation: AnimationType;
}