"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Smile, Loader2 } from "lucide-react";
import { Layers } from "lucide-react";
import { MemeDraft } from "@/types";
import { MOOD_PACKS } from "@/lib/constants";
import { useTextPrompts, TextPrompt } from "@/hooks/useTextPrompts";
import { useAppDispatch } from "@/store/hooks";
import { updateMemeDraft } from "@/store/slices/memeSlice";

interface TextPromptGroupsProps {
  activeDraft: MemeDraft | null;
  activeDraftIndex: number;
  activeGroupIndex?: number;
  onGroupSelect?: (index: number) => void;
  getGroupResults: (draft: MemeDraft) => Array<{
    generatedUrl: string | null;
    status: string;
  }>;
  hasSelectedMoodPack: boolean;
  onApplyMoodPack: (packId: string, groupIndex: number | "single") => void;
  onRetryGroup?: (groupIndex: number) => void;
  getTextPrompts: (draft: MemeDraft) => TextPrompt[];
  updateTextPrompts: (prompts: TextPrompt[], draftId: string) => void;
}

export default function TextPromptGroups({
  activeDraft,
  activeDraftIndex,
  activeGroupIndex,
  onGroupSelect,
  getGroupResults,
  hasSelectedMoodPack,
  onApplyMoodPack,
  onRetryGroup,
  getTextPrompts,
  updateTextPrompts,
}: TextPromptGroupsProps) {
  const dispatch = useAppDispatch();
  const groupRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // 滚动到当前选中的分组
  useEffect(() => {
    if (
      activeGroupIndex !== undefined &&
      groupRefs.current.has(activeGroupIndex)
    ) {
      groupRefs.current.get(activeGroupIndex)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeGroupIndex]);

  const [moodPackMenuOpen, setMoodPackMenuOpen] = useState<
    number | "single" | null
  >(null);
  const moodPackMenuRefs = useRef<Map<number | "single", HTMLDivElement>>(
    new Map()
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moodPackMenuOpen === null) return;

      const target = event.target as Node;
      const menuElement = moodPackMenuRefs.current.get(moodPackMenuOpen);

      if (menuElement && !menuElement.contains(target)) {
        setMoodPackMenuOpen(null);
      }
    };

    if (moodPackMenuOpen !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [moodPackMenuOpen]);

  if (!activeDraft) return null;

  const prompts = getTextPrompts(activeDraft);
  const groupResults = getGroupResults(activeDraft);

  const handleAddGroup = () => {
    if (prompts.length >= 5) {
      alert("最多只能添加5个分组");
      return;
    }

    const newPrompts = [...prompts];
    if (prompts.length === 0 && activeDraft) {
      newPrompts.push({
        text: activeDraft.text || "",
        moodPrompt: activeDraft.moodPrompt || "",
        textPosition: activeDraft.textPosition || "bottom",
      });
    } else {
      newPrompts.push({ text: "", moodPrompt: "", textPosition: "bottom" });
    }

    // 手动同步 groupResults，避免 page.tsx 中的 useEffect 逻辑错误地重置了现有结果
    const currentGroupResults = activeDraft.groupResults
      ? [...activeDraft.groupResults]
      : [];

    // 如果之前是单分组且有结果，需要先将单分组结果迁移到数组中
    if (currentGroupResults.length === 0 && prompts.length === 0) {
      if (activeDraft.generatedUrl) {
        currentGroupResults.push({
          generatedUrl: activeDraft.generatedUrl,
          status: activeDraft.status || "done",
        });
      } else {
        // 即使是 pending，也占位
        currentGroupResults.push({
          generatedUrl: null,
          status: "pending",
        });
      }
    }

    // 添加新的 pending 结果
    currentGroupResults.push({
      generatedUrl: null,
      status: "pending",
    });

    // 先更新 groupResults，再更新 prompts，确保数据一致
    dispatch(
      updateMemeDraft({
        index: activeDraftIndex,
        draft: { groupResults: currentGroupResults },
      })
    );

    updateTextPrompts(newPrompts, activeDraft.id);
  };

  const handleRemoveGroup = (index: number) => {
    if (hasSelectedMoodPack) return;

    const newPrompts = [...prompts];
    newPrompts.splice(index, 1);

    // 手动同步 groupResults
    const currentGroupResults = activeDraft.groupResults
      ? [...activeDraft.groupResults]
      : [];

    if (index < currentGroupResults.length) {
      currentGroupResults.splice(index, 1);
    }

    // 先更新 groupResults，再更新 prompts
    dispatch(
      updateMemeDraft({
        index: activeDraftIndex,
        draft: { groupResults: currentGroupResults },
      })
    );

    updateTextPrompts(newPrompts, activeDraft.id);
  };

  const handleUpdatePrompt = (
    index: number,
    field: "text" | "moodPrompt",
    value: string
  ) => {
    if (hasSelectedMoodPack) return;
    const newPrompts = [...prompts];
    newPrompts[index] = { ...newPrompts[index], [field]: value };
    updateTextPrompts(newPrompts, activeDraft.id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
          <Layers size={16} className="text-violet-500" />
          表情文案和动作指令
          {prompts.length > 0 && (
            <span className="text-xs text-gray-500 font-normal">
              ({prompts.length}/5 个分组)
            </span>
          )}
        </label>
        <div className="flex items-center gap-2">
          {prompts.length === 0 && (
            <div
              className="relative"
              ref={(el) => {
                if (el) {
                  moodPackMenuRefs.current.set("single", el);
                } else {
                  moodPackMenuRefs.current.delete("single");
                }
              }}
            >
              <button
                onClick={() => {
                  setMoodPackMenuOpen(
                    moodPackMenuOpen === "single" ? null : "single"
                  );
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <Smile size={14} />
                添加预置情绪套餐
              </button>
              {moodPackMenuOpen === "single" && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto min-w-[200px]">
                  {MOOD_PACKS.filter((p) => p.id !== "custom").map((pack) => (
                    <button
                      key={pack.id}
                      onClick={() => {
                        onApplyMoodPack(pack.id, "single");
                        setMoodPackMenuOpen(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {pack.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            onClick={handleAddGroup}
            disabled={prompts.length >= 5}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-violet-600 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              prompts.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={prompts.length >= 5 ? "最多只能添加5个分组" : "添加分组"}
          >
            <Plus size={14} />
            添加分组
          </button>
        </div>
      </div>

      {prompts.length === 0 ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              表情文案
            </label>
            <input
              type="text"
              value={activeDraft?.text || ""}
              onChange={(e) => {
                if (hasSelectedMoodPack) return;
                dispatch(
                  updateMemeDraft({
                    index: activeDraftIndex,
                    draft: { text: e.target.value },
                  })
                );
              }}
              disabled={hasSelectedMoodPack}
              className={`w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-gray-700 shadow-sm text-sm ${
                hasSelectedMoodPack
                  ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                  : ""
              }`}
              placeholder="输入表情文案"
            />
            {/* 表情文案位置选择 */}
            <div className="mt-2 flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`textPosition-${activeDraftIndex}`}
                  checked={(activeDraft?.textPosition || "bottom") === "top"}
                  onChange={() => {
                    dispatch(
                      updateMemeDraft({
                        index: activeDraftIndex,
                        draft: { textPosition: "top" },
                      })
                    );
                  }}
                  className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">上方</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`textPosition-${activeDraftIndex}`}
                  checked={(activeDraft?.textPosition || "bottom") === "bottom"}
                  onChange={() => {
                    dispatch(
                      updateMemeDraft({
                        index: activeDraftIndex,
                        draft: { textPosition: "bottom" },
                      })
                    );
                  }}
                  className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">下方</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              动作指令
            </label>
            <input
              type="text"
              value={activeDraft?.moodPrompt || ""}
              onChange={(e) => {
                if (hasSelectedMoodPack) return;
                dispatch(
                  updateMemeDraft({
                    index: activeDraftIndex,
                    draft: { moodPrompt: e.target.value },
                  })
                );
              }}
              disabled={hasSelectedMoodPack}
              className={`w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-gray-700 shadow-sm text-sm ${
                hasSelectedMoodPack
                  ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                  : ""
              }`}
              placeholder="例如：大笑、挥手"
            />
          </div>
        </div>
      ) : (
        prompts.map((prompt, index) => {
          const groupResult = groupResults[index] || {
            generatedUrl: null,
            status: "pending" as const,
          };
          const groupStatus = groupResult.status;
          const isActive = index === activeGroupIndex;

          return (
            <div
              key={index}
              ref={(el) => {
                if (el) {
                  groupRefs.current.set(index, el);
                } else {
                  groupRefs.current.delete(index);
                }
              }}
              onClick={() => onGroupSelect?.(index)}
              className={`p-4 rounded-xl border-2 space-y-3 transition-all cursor-pointer ${
                isActive ? "ring-2 ring-violet-200" : ""
              } ${
                isActive
                  ? "border-violet-600"
                  : groupStatus === "generating"
                  ? "border-violet-300"
                  : groupStatus === "done"
                  ? "border-green-200"
                  : groupStatus === "error"
                  ? "border-red-200"
                  : "border-gray-200"
              } ${
                groupStatus === "generating"
                  ? "bg-violet-50"
                  : groupStatus === "done"
                  ? "bg-green-50"
                  : groupStatus === "error"
                  ? "bg-red-50"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">
                    分组 {index + 1}
                  </span>
                  {groupStatus === "generating" && (
                    <div className="flex items-center gap-1 text-xs text-violet-600">
                      <Loader2 className="animate-spin" size={12} />
                      <span>生成中</span>
                    </div>
                  )}
                  {groupStatus === "done" && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <span>✓</span>
                      <span>已完成</span>
                    </div>
                  )}
                  {groupStatus === "error" && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <span>✗</span>
                      <span>生成失败</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {onRetryGroup && (
                    <>
                      {groupStatus === "error" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRetryGroup(index);
                          }}
                          className="px-2 py-1 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded transition-colors"
                          title="重试生成"
                        >
                          重试
                        </button>
                      )}
                      {groupStatus === "done" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRetryGroup(index);
                          }}
                          className="px-2 py-1 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded transition-colors"
                          title="重新生成"
                        >
                          重新生成
                        </button>
                      )}
                      {groupStatus === "pending" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRetryGroup(index);
                          }}
                          disabled={
                            !prompt.text.trim() && !prompt.moodPrompt.trim()
                          }
                          className="px-2 py-1 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={
                            !prompt.text.trim() && !prompt.moodPrompt.trim()
                              ? "请输入文案或动作"
                              : "生成"
                          }
                        >
                          生成
                        </button>
                      )}
                    </>
                  )}
                  {prompts.length > 1 && (
                    <button
                      onClick={() => handleRemoveGroup(index)}
                      disabled={
                        hasSelectedMoodPack || groupStatus === "generating"
                      }
                      className={`p-1 transition-colors ${
                        hasSelectedMoodPack || groupStatus === "generating"
                          ? "cursor-not-allowed opacity-50 text-gray-300"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                      title={
                        hasSelectedMoodPack
                          ? "选择情绪套餐时不能删除分组"
                          : groupStatus === "generating"
                          ? "生成中不可删除"
                          : "删除分组"
                      }
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    表情文案
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={prompt.text}
                      onChange={(e) =>
                        handleUpdatePrompt(index, "text", e.target.value)
                      }
                      disabled={hasSelectedMoodPack}
                      className={`flex-1 p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-gray-700 shadow-sm text-sm ${
                        hasSelectedMoodPack
                          ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                      placeholder="输入表情文案"
                    />
                    <div
                      className="relative"
                      ref={(el) => {
                        if (el) {
                          moodPackMenuRefs.current.set(index, el);
                        } else {
                          moodPackMenuRefs.current.delete(index);
                        }
                      }}
                    >
                      <button
                        onClick={() => {
                          setMoodPackMenuOpen(
                            moodPackMenuOpen === index ? null : index
                          );
                        }}
                        disabled={hasSelectedMoodPack}
                        className={`p-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          hasSelectedMoodPack ? "cursor-not-allowed" : ""
                        }`}
                        title="添加预置情绪套餐"
                      >
                        <Smile size={16} />
                      </button>
                      {moodPackMenuOpen === index && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto min-w-[200px]">
                          {MOOD_PACKS.filter((p) => p.id !== "custom").map(
                            (pack) => (
                              <button
                                key={pack.id}
                                onClick={() => {
                                  onApplyMoodPack(pack.id, index);
                                  setMoodPackMenuOpen(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors border-b border-gray-100 last:border-b-0"
                              >
                                {pack.label}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 表情文案位置选择 */}
                  <div className="mt-2 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`textPosition-group-${activeDraftIndex}-${index}`}
                        checked={(prompt.textPosition || "bottom") === "top"}
                        onChange={() => {
                          const newPrompts = [...prompts];
                          newPrompts[index] = {
                            ...newPrompts[index],
                            textPosition: "top",
                          };
                          updateTextPrompts(newPrompts, activeDraft.id);
                        }}
                        className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-sm text-gray-700">上方</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`textPosition-group-${activeDraftIndex}-${index}`}
                        checked={(prompt.textPosition || "bottom") === "bottom"}
                        onChange={() => {
                          const newPrompts = [...prompts];
                          newPrompts[index] = {
                            ...newPrompts[index],
                            textPosition: "bottom",
                          };
                          updateTextPrompts(newPrompts, activeDraft.id);
                        }}
                        className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-sm text-gray-700">下方</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    动作指令
                  </label>
                  <input
                    type="text"
                    value={prompt.moodPrompt}
                    placeholder="例如：大笑、挥手"
                    onChange={(e) =>
                      handleUpdatePrompt(index, "moodPrompt", e.target.value)
                    }
                    disabled={hasSelectedMoodPack}
                    className={`w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-gray-700 shadow-sm text-sm ${
                      hasSelectedMoodPack
                        ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
