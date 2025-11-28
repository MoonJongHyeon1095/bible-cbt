// src/components/emotion/dive/EmotionDiveCard.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { RegulationGoal } from "../modal/EmotionRegulatonChoiceModal";

type EmotionContext = {
  emotionId: string;
  emotionName: string;
  intensity: number;
  regulationGoal: RegulationGoal;
};

type EmotionDiveCardProps = {
  value: string;
  onChange: (v: string) => void;
  level: number;
  hint?: string;
  locked: boolean;
  segmentText: string;
  fullText: string;
  emotionContext?: EmotionContext;
  onDiveFromInput: (text: string) => void;
  onChooseSuggestion: (text: string) => void;
};

export function EmotionDiveCard({
  value,
  onChange,
  level,
  hint,
  locked,
  fullText,
  segmentText,
  emotionContext,
  onDiveFromInput,
  onChooseSuggestion,
}: EmotionDiveCardProps) {
  const label = `${level + 1}단계 자동사고`;

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (locked) return;
    if (hasRequested.current) return;
    if (!segmentText.trim()) return;

    hasRequested.current = true;
    setIsLoading(true);

    (async () => {
      try {
        const res = await fetch("/api/emotion/suggestion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullText,
            segmentText,
            currentThought: value,
            level,
            emotionContext,
          }),
        });

        if (!res.ok) {
          console.error("suggestions api error", await res.text());
          return;
        }

        const data: { suggestions?: string[] } = await res.json();
        setSuggestions(data.suggestions ?? []);
      } catch (err) {
        console.error("failed to fetch suggestions", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fullText, segmentText, value, level, locked, emotionContext]);

  // 이미 선택이 확정된 노드
  if (locked) {
    return (
      <div className="space-y-2">
        <div className="text-[12px] text-gray-500 dark:text-gray-400">
          {label}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 text-xs leading-normal text-gray-800 dark:text-gray-100">
            {value}
          </div>
          <button
            type="button"
            disabled
            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-[10px] text-gray-300 dark:border-neutral-700 dark:text-neutral-600"
          >
            ↓
          </button>
        </div>
      </div>
    );
  }

  // 아직 선택되지 않은 노드
  return (
    <div className="space-y-4">
      <div className="text-[12px] text-gray-500 dark:text-gray-400">
        {label}
      </div>

      {/* LLM 제안 */}
      <div className="space-y-3">
        {isLoading && suggestions.length === 0 && (
          <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
            <span className="h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-transparent dark:border-neutral-600 dark:border-t-transparent" />
            <span>자동사고 후보를 불러오는 중...</span>
          </div>
        )}

        {!isLoading &&
          suggestions.length > 0 &&
          suggestions.map((s, idx) => (
            <div
              key={`${idx}-${s}`}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex-1 text-xs leading-normal text-gray-800 dark:text-gray-100">
                {s}
              </div>
              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-[10px] hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100 dark:hover:bg-neutral-800"
                onClick={() => onChooseSuggestion(s)}
              >
                ↓
              </button>
            </div>
          ))}
      </div>

      {/* 직접 입력 */}
      <div className="space-y-2">
        <div className="text-[11px] text-gray-500 dark:text-gray-400">
          직접 입력
        </div>

        <div className="flex items-start gap-3">
          <textarea
            className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs leading-normal text-gray-800 outline-none focus:ring-2 focus:ring-black/70 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100 dark:focus:ring-white/70"
            rows={3}
            placeholder={
              hint ??
              (level === 0
                ? "이 감정 뒤에 있는 생각이나 장면을 적어보세요."
                : "이 생각 뒤에 있는 더 깊은 생각을 적어보세요.")
            }
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />

          <button
            type="button"
            className="mt-2 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-[10px] hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100 dark:hover:bg-neutral-800"
            onClick={() => onDiveFromInput(value)}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}
