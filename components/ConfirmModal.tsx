"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "red" | "violet" | "blue";
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "确认操作",
  message,
  confirmText = "确认",
  cancelText = "取消",
  confirmColor = "red",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const confirmColorClasses = {
    red: "bg-red-500 hover:bg-red-600 text-white",
    violet: "bg-violet-600 hover:bg-violet-700 text-white",
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{message}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 ${confirmColorClasses[confirmColor]}`}
            >
              {isLoading ? "处理中..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

