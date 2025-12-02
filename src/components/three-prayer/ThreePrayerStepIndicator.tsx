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
  currentIndex,
  getStepLabel,
  onChangeStep,
}: Props) {
  return (
    <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
      <div className="flex flex-wrap gap-2">
        {stepOrder.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => onChangeStep(s)}
            className={`rounded-full px-3 py-1 transition-colors ${
              s === step
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}. {getStepLabel(s)}
          </button>
        ))}
      </div>
      <div>
        {currentIndex + 1} / {stepOrder.length}
      </div>
    </div>
  );
}
