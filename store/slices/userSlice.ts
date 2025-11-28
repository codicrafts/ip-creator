import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserTier, DailyUsage } from "@/types";

export enum UserStatus {
  GUEST = "GUEST", // 游客
  LOGGED_IN = "LOGGED_IN", // 已登录
}

export interface UserState {
  status: UserStatus; // 用户状态：游客或已登录
  userId: string | null; // 用户ID（登录后才有）
  phone: string | null; // 手机号（登录后才有）
  userTier: UserTier;
  sceneUsage: DailyUsage; // 场景扩展使用量
  memeUsage: DailyUsage; // 表情包制作使用量
  membershipExpiresAt: number | null; // 会员过期时间（时间戳）
}

const initialState: UserState = {
  status: UserStatus.GUEST,
  userId: null,
  phone: null,
  userTier: UserTier.FREE,
  sceneUsage: { date: new Date().toLocaleDateString(), count: 0 },
  memeUsage: { date: new Date().toLocaleDateString(), count: 0 },
  membershipExpiresAt: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserStatus: (state, action: PayloadAction<UserStatus>) => {
      state.status = action.payload;
    },
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
    setUserPhone: (state, action: PayloadAction<string | null>) => {
      state.phone = action.payload;
    },
    setUserTier: (state, action: PayloadAction<UserTier>) => {
      state.userTier = action.payload;
    },
    setUserInfo: (
      state,
      action: PayloadAction<{
        userId: string;
        phone: string;
        userTier: UserTier;
        membershipExpiresAt?: number | null;
      }>
    ) => {
      state.userId = action.payload.userId;
      state.phone = action.payload.phone;
      state.userTier = action.payload.userTier;
      state.membershipExpiresAt = action.payload.membershipExpiresAt || null;
      state.status = UserStatus.LOGGED_IN;
    },
    setMembershipExpiresAt: (state, action: PayloadAction<number | null>) => {
      state.membershipExpiresAt = action.payload;
    },
    clearUserInfo: (state) => {
      state.status = UserStatus.GUEST;
      state.userId = null;
      state.phone = null;
      state.userTier = UserTier.FREE;
      state.sceneUsage = { date: new Date().toLocaleDateString(), count: 0 };
      state.memeUsage = { date: new Date().toLocaleDateString(), count: 0 };
      state.membershipExpiresAt = null;
    },
    setSceneUsage: (state, action: PayloadAction<DailyUsage>) => {
      state.sceneUsage = action.payload;
    },
    setMemeUsage: (state, action: PayloadAction<DailyUsage>) => {
      state.memeUsage = action.payload;
    },
    // 兼容旧代码，保留 dailyUsage（映射到 sceneUsage）
    setDailyUsage: (state, action: PayloadAction<DailyUsage>) => {
      state.sceneUsage = action.payload;
    },
    updateSceneUsage: (state, action: PayloadAction<number>) => {
      const today = new Date().toLocaleDateString();
      if (state.sceneUsage.date !== today) {
        state.sceneUsage = { date: today, count: action.payload };
      } else {
        state.sceneUsage.count += action.payload;
      }
    },
    updateMemeUsage: (state, action: PayloadAction<number>) => {
      const today = new Date().toLocaleDateString();
      if (state.memeUsage.date !== today) {
        state.memeUsage = { date: today, count: action.payload };
      } else {
        state.memeUsage.count += action.payload;
      }
    },
    // 兼容旧代码
    updateUsage: (state, action: PayloadAction<number>) => {
      const today = new Date().toLocaleDateString();
      if (state.sceneUsage.date !== today) {
        state.sceneUsage = { date: today, count: action.payload };
      } else {
        state.sceneUsage.count += action.payload;
      }
    },
    resetDailyUsage: (state) => {
      const today = new Date().toLocaleDateString();
      if (state.sceneUsage.date !== today) {
        state.sceneUsage = { date: today, count: 0 };
      }
      if (state.memeUsage.date !== today) {
        state.memeUsage = { date: today, count: 0 };
      }
    },
  },
});

export const {
  setUserStatus,
  setUserId,
  setUserPhone,
  setUserTier,
  setUserInfo,
  setMembershipExpiresAt,
  clearUserInfo,
  setSceneUsage,
  setMemeUsage,
  setDailyUsage,
  updateSceneUsage,
  updateMemeUsage,
  updateUsage,
  resetDailyUsage,
} = userSlice.actions;

export default userSlice.reducer;
