// src/components/ui/history-toggle-card.tsx
"use client";

import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";

type HistoryToggleCardProps = {
  emotionName?: string;
  intensity?: number;
  title: string; // 큰 문장 (belief)
  subtitle?: string; // segmentText 같이 원래 문장
  isOpen: boolean;
  onToggle: () => void;
  onDelete?: () => void;
  children?: ReactNode;
};

export function HistoryToggleCard({
  emotionName,
  intensity,
  title,
  subtitle,
  isOpen,
  onToggle,
  onDelete,
  children,
}: HistoryToggleCardProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      {/* 헤더 영역 (클릭해서 열고 닫기) */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className="flex w-full items-start justify-between gap-2 px-4 py-3 text-left"
      >
        <div className="flex flex-1 flex-col gap-1">
          {(emotionName || intensity !== undefined) && (
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-emerald-800">
              {emotionName && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5">
                  {emotionName}
                </span>
              )}
              {intensity !== undefined && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5">
                  강도 {intensity}
                </span>
              )}
            </div>
          )}

          <p className="text-sm text-slate-900">{title}</p>

          {subtitle && (
            <p className="text-[11px] italic text-slate-500">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // 토글로 안 올라가게
                onDelete();
              }}
              className="rounded-full bg-slate-50 p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={12} />
            </button>
          )}
          <span className="text-emerald-700">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </div>

      {isOpen && children && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 text-xs text-slate-700">
          {children}
        </div>
      )}
    </div>
  );
}
