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

// API에서 오는 제안 타입
type ApiSuggestion = {
  belief: string;
  emotion_reason: string;
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
  // belief + emotionReason 둘 다 부모로 올려줌
  onChooseSuggestion: (belief: string, emotionReason?: string) => void;
  // 이미 확정된 노드가 가진 emotionReason
  emotionReason?: string;
  // 왼쪽으로 보내기 (아직 안 쓰면 안 넘겨도 됨)
  onMoveLeft?: (belief: string, emotionReason?: string) => void;
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
  emotionReason,
  onMoveLeft,
}: EmotionDiveCardProps) {
  const label = `${level + 1}단계 자동사고`;

  const [suggestions, setSuggestions] = useState<ApiSuggestion[]>([]);
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

        const data: { suggestions?: ApiSuggestion[] } = await res.json();
        setSuggestions(data.suggestions ?? []);
      } catch (err) {
        console.error("failed to fetch suggestions", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fullText, segmentText, value, level, locked, emotionContext]);

  // 공통 버튼 스타일들
  const primaryDownBtn =
    "inline-flex items-center justify-center rounded-full bg-gray-900 px-3 py-1 text-[11px] font-medium text-white shadow-sm transition-transform duration-150 hover:translate-y-[1px] hover:bg-black";
  const secondaryLeftBtn =
    "group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-[11px] text-gray-600 shadow-sm transition-transform duration-150 hover:-translate-x-[2px] hover:bg-gray-50";

  // 이미 선택이 확정된 노드
  if (locked) {
    return (
      <div className="space-y-2">
        <div className="text-[12px] text-gray-500 dark:text-gray-400">
          {label}
        </div>

        <div className="rounded-md border border-gray-100 bg-gray-50/50 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-900/40">
          <div className="leading-normal text-gray-800 dark:text-gray-100">
            {/* belief */}
            <div className="font-semibold">{value}</div>
            {/* emotionReason 보조 설명 */}
            {emotionReason && (
              <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                {emotionReason}
              </div>
            )}
          </div>

          {/* ✅ 확정된 노드도 항상 왼쪽으로 보내기 버튼 노출 */}
          <div className="mt-2 flex justify-start">
            <button
              type="button"
              className={secondaryLeftBtn}
              onClick={() => onMoveLeft?.(value, emotionReason)}
            >
              <span className="transition-transform duration-150 group-hover:-translate-x-[2px]">
                ←
              </span>
              <span>왼쪽으로 보내기</span>
            </button>
          </div>
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
              key={`${idx}-${s.belief}-${s.emotion_reason}`}
              className="rounded-md border border-gray-100 bg-gray-50/50 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-900/40"
            >
              <div className="leading-normal text-gray-800 dark:text-gray-100">
                {/* belief 강조 */}
                <div className="font-semibold">{s.belief}</div>
                {/* emotion_reason 보조 설명 */}
                {s.emotion_reason && (
                  <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    {s.emotion_reason}
                  </div>
                )}
              </div>

              {/* 🔹 카드 하단 좌/우 버튼 */}
              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  className={secondaryLeftBtn}
                  onClick={() =>
                    onMoveLeft?.(s.belief, s.emotion_reason || undefined)
                  }
                >
                  <span className="transition-transform duration-150 group-hover:-translate-x-[2px]">
                    ←
                  </span>
                  <span>왼쪽으로 보내기</span>
                </button>

                <button
                  type="button"
                  className={primaryDownBtn}
                  onClick={() =>
                    onChooseSuggestion(s.belief, s.emotion_reason || undefined)
                  }
                >
                  이 생각에 대해 더 다루기
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* 직접 입력 */}
      <div className="space-y-2">
        <div className="text-[11px] text-gray-500 dark:text-gray-400">
          직접 입력
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900">
          <textarea
            className="w-full rounded-md border border-transparent bg-transparent px-0 py-0 text-xs leading-normal text-gray-800 outline-none focus:border-transparent focus:ring-0 dark:text-gray-100"
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

          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              className={secondaryLeftBtn}
              onClick={() => onMoveLeft?.(value, emotionReason)}
            >
              <span className="transition-transform duration-150 group-hover:-translate-x-[2px]">
                ←
              </span>
              <span>왼쪽으로 보내기</span>
            </button>

            <button
              type="button"
              className={primaryDownBtn}
              onClick={() => onDiveFromInput(value)}
            >
              이 생각에 대해 더 다루기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
