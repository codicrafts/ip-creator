import { useCallback, useRef, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateMemeDraft } from "@/store/slices/memeSlice";
import { MemeDraft } from "@/types";

export interface TextPrompt {
  text: string;
  moodPrompt: string;
  textPosition?: "top" | "bottom"; // 每个分组的表情文案位置
}

export function useTextPrompts(
  activeDraft: MemeDraft | null,
  activeDraftIndex: number
) {
  const dispatch = useAppDispatch();
  const textPromptsRef = useRef<{
    [key: string]: TextPrompt[];
  }>({});

  const getTextPrompts = useCallback(
    (draft: Partial<MemeDraft> | null): TextPrompt[] => {
      if (!draft || !draft.id) return [];

      const draftId = draft.id;

      // 1. 优先从 ref 获取（最新编辑状态）
      if (textPromptsRef.current[draftId] && textPromptsRef.current[draftId].length > 0) {
        // console.log(`[getTextPrompts] draftId=${draftId}, 从 ref 获取 prompts:`, textPromptsRef.current[draftId]);
        return textPromptsRef.current[draftId];
      }

      // 2. 其次从 Redux store 的 prompts 字段获取（已保存/生成时的状态）
      if (draft.prompts && draft.prompts.length > 0) {
        // console.log(`[getTextPrompts] draftId=${draftId}, 从 draft.prompts 获取 prompts:`, draft.prompts);
        // 同步到 ref 以便后续编辑
        textPromptsRef.current[draftId] = draft.prompts;
        return draft.prompts;
      }

      // 3. 最后回退到单分组模式（基于 draft 自身的字段）
      // console.log(`[getTextPrompts] draftId=${draftId}, 回退到单分组模式`);
      const defaultPrompts = [
        {
          text: draft.text || "",
          moodPrompt: draft.moodPrompt || "",
          textPosition: draft.textPosition || "bottom",
        },
      ];
      // 同时也初始化 ref
      textPromptsRef.current[draftId] = defaultPrompts;
      return defaultPrompts;
    },
    []
  );

  const updateTextPrompts = useCallback(
    (prompts: TextPrompt[], draftId: string) => {
      if (!draftId) return;

      textPromptsRef.current[draftId] = prompts;

      const firstPrompt = prompts[0] || { text: "", moodPrompt: "" };
      dispatch(
        updateMemeDraft({
          index: activeDraftIndex,
          draft: {
            text: firstPrompt.text,
            moodPrompt: firstPrompt.moodPrompt,
            textPosition: firstPrompt.textPosition,
            prompts: prompts, // 同步 prompts 到 Redux
          },
        })
      );
    },
    [activeDraftIndex, dispatch]
  );

  useEffect(() => {
    if (activeDraft) {
      getTextPrompts(activeDraft);
    }
  }, [activeDraft?.id, getTextPrompts]);

  return {
    getTextPrompts,
    updateTextPrompts,
    textPromptsRef,
  };
}

