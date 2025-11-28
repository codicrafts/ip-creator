"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setUserTier,
  setSceneUsage,
  setMemeUsage,
  setUserStatus,
  setUserInfo,
  setMembershipExpiresAt,
} from "@/store/slices/userSlice";
import { addToHistory, setHistory } from "@/store/slices/imageSlice";
import { GeneratedImage } from "@/types";
import { UserTier, DailyUsage } from "@/types";
import { UserStatus, UserState } from "@/store/slices/userSlice";
import { getTodayDateString } from "@/lib/date-utils";

const SCENE_USAGE_KEY = "ip_creative_scene_usage";
const MEME_USAGE_KEY = "ip_creative_meme_usage";
const STORAGE_KEY = "ip_creative_history_v1";

interface ReduxProviderProps {
  children: React.ReactNode;
  initialUserState?: Partial<UserState>;
  initialHistory?: GeneratedImage[];
}

// 初始化 Redux state 的组件
function ReduxInitializer({
  initialUserState,
  initialHistory,
}: {
  initialUserState?: Partial<UserState>;
  initialHistory?: GeneratedImage[];
}) {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.user.userId);
  const userTier = useAppSelector((state) => state.user.userTier);
  const sceneUsage = useAppSelector((state) => state.user.sceneUsage);
  const memeUsage = useAppSelector((state) => state.user.memeUsage);
  const history = useAppSelector((state) => state.image.history);
  const initialized = useRef(false);

  // 使用 SSR 传入的初始状态
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 用户状态已通过 preloadedState 设置，不需要在 useEffect 中再次设置
    // 但如果 initialUserState 存在且当前状态为空（客户端导航），则设置
    if (initialUserState) {
      // 设置用户信息
      if (initialUserState.userId) {
        // 只在状态未初始化时设置（避免覆盖 SSR 数据）
        // 如果当前没有 userId 或 userId 不匹配，说明是客户端导航，需要设置
        if (!currentUserId || currentUserId !== initialUserState.userId) {
          dispatch(
            setUserInfo({
              userId: initialUserState.userId,
              phone: initialUserState.phone || "",
              userTier: initialUserState.userTier || UserTier.FREE,
              membershipExpiresAt:
                (initialUserState as any).membershipExpiresAt || null,
            })
          );
          if (initialUserState.sceneUsage) {
            dispatch(setSceneUsage(initialUserState.sceneUsage));
          }
          if (initialUserState.memeUsage) {
            dispatch(setMemeUsage(initialUserState.memeUsage));
          }
          if ((initialUserState as any).membershipExpiresAt !== undefined) {
            dispatch(
              setMembershipExpiresAt(
                (initialUserState as any).membershipExpiresAt
              )
            );
          }
        }
      } else {
        // 游客状态
        dispatch(setUserStatus(UserStatus.GUEST));

        // 加载游客的使用量（从 localStorage）
        const savedSceneUsage = localStorage.getItem(SCENE_USAGE_KEY);
        if (savedSceneUsage) {
          try {
            const usage = JSON.parse(savedSceneUsage);
            dispatch(setSceneUsage(usage));
          } catch (e) {
            console.error("Failed to load scene usage", e);
          }
        }

        const savedMemeUsage = localStorage.getItem(MEME_USAGE_KEY);
        if (savedMemeUsage) {
          try {
            const usage = JSON.parse(savedMemeUsage);
            dispatch(setMemeUsage(usage));
          } catch (e) {
            console.error("Failed to load meme usage", e);
          }
        }
      }
    }

    // 历史记录已通过 preloadedState 设置，不需要在 useEffect 中设置
    // 但如果 initialHistory 存在且当前 history 为空，则设置（用于客户端导航）
    if (initialHistory && initialHistory.length > 0 && history.length === 0) {
      dispatch(setHistory(initialHistory));
    }
  }, [dispatch, initialUserState, initialHistory, history]);

  const userStatus = useAppSelector((state) => state.user.status);

  useEffect(() => {
    // 只有游客状态才保存到 localStorage，登录用户的使用次数由后端管理
    if (userStatus === UserStatus.GUEST) {
      localStorage.setItem(SCENE_USAGE_KEY, JSON.stringify(sceneUsage));
    }
  }, [sceneUsage, userStatus]);

  useEffect(() => {
    // 只有游客状态才保存到 localStorage，登录用户的使用次数由后端管理
    if (userStatus === UserStatus.GUEST) {
      localStorage.setItem(MEME_USAGE_KEY, JSON.stringify(memeUsage));
    }
  }, [memeUsage, userStatus]);

  // 历史记录不再保存到 localStorage，改为保存到数据库

  // 日期检查和重置已在 SSR 侧处理（getUserInfoFromDB），客户端不再需要检查
  // 如果需要在客户端检查，应该使用 getTodayDateString() 而不是 toLocaleDateString()

  return null;
}

export default function ReduxProvider({
  children,
  initialUserState,
  initialHistory,
}: ReduxProviderProps) {
  // 创建 store 实例（使用初始状态）
  const storeRef = useRef<ReturnType<typeof makeStore> | null>(null);
  if (!storeRef.current) {
    const preloadedState: any = {};
    if (initialUserState) {
      // 将用户状态（包括使用次数）作为初始状态传入
      preloadedState.user = {
        status: initialUserState.userId
          ? UserStatus.LOGGED_IN
          : UserStatus.GUEST,
        userId: initialUserState.userId || null,
        phone: initialUserState.phone || null,
        userTier: initialUserState.userTier || UserTier.FREE,
        sceneUsage: initialUserState.sceneUsage || {
          date: getTodayDateString(),
          count: 0,
        },
        memeUsage: initialUserState.memeUsage || {
          date: getTodayDateString(),
          count: 0,
        },
        membershipExpiresAt:
          (initialUserState as any).membershipExpiresAt || null,
      };
    }
    if (initialHistory) {
      preloadedState.image = {
        sourceImage: null,
        mimeType: "image/png",
        prompt: "",
        selectedStyle: null,
        aspectRatio: "16:9",
        imageSize: "1K",
        imageFormat: "PNG",
        resultImage: null,
        history: initialHistory,
      };
    }
    storeRef.current = makeStore(preloadedState);
  }

  return (
    <Provider store={storeRef.current}>
      <ReduxInitializer
        initialUserState={initialUserState}
        initialHistory={initialHistory}
      />
      {children}
    </Provider>
  );
}
