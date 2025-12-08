// src/components/three-prayer/ThreePrayerStepIndicator.tsx
"use client";

import type { Step } from "./ThreePrayerLayout";

type Props = {
  step: Step;
  stepOrder: Step[];
  currentIndex: number;
  getStepLabel: (s: Step) => string;
  onChangeStep: (s: Step) => void;
};

export function ThreePrayerStepIndicator({
  step,
  stepOrder,
  currentIndex, // 시그니처 유지용
  getStepLabel,
  onChangeStep,
}: Props) {
  // 화면에 보이는 순서: [왼쪽, 가운데, 오른쪽]
  // 가운데가 emotion(1단계)
  const visualOrder: Step[] = ["distortion", "emotion", "alternative"];

  return (
    <div className="mb-6 flex justify-start">
      {/* 전체 레일: 연한 캡슐 형태 */}
      <div className="w-full max-w-xl rounded-full bg-gray-100/80 px-1.5 py-1 shadow-sm">
        <div className="flex gap-1.5">
          {visualOrder.map((s) => {
            const isActive = s === step;
            const flowIndex = stepOrder.indexOf(s); // 0,1,2 → 단계 번호

            return (
              <button
                key={s}
                type="button"
                onClick={() => onChangeStep(s)}
                className={[
                  "flex-1 flex items-center justify-center gap-1 rounded-full",
                  "text-[11px] font-medium transition-colors",
                  "h-8",
                  isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : "bg-transparent text-gray-500 hover:bg-white/60",
                ].join(" ")}
              >
                <span className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-black/5 text-[10px]">
                  {flowIndex + 1}
                </span>
                <span className="truncate">{getStepLabel(s)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
