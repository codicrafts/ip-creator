import { useRef, useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setMemeDrafts, setActiveDraftIndex } from "@/store/slices/memeSlice";
import { MemeDraft } from "@/types";

export function useMemeFileUpload() {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!result) return;

        const memeDraft: MemeDraft = {
          id: `meme-${Date.now()}`,
          sourceUrl: result,
          generatedUrl: null,
          text: "",
          moodPrompt: "",
          status: "pending",
          animation: "none",
          removeBackground: false,
          refineForeground: false,
        };

        dispatch(setMemeDrafts([memeDraft]));
        dispatch(setActiveDraftIndex(0));
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [dispatch]
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    handleFileChange,
    triggerFileInput,
  };
}


