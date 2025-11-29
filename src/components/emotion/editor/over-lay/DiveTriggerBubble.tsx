// src/components/emotion/editor/over-lay/DiveTriggerBubble.tsx
"use client";

import type { EmotionInputSegment } from "../../types/emotion.types";
import type { RelativeRect } from "../../utils/splitToCharRects";

type DiveTriggerBubbleProps = {
  segment: EmotionInputSegment;
  charRects: RelativeRect[];
  index: number;
  activeCharIndex?: number | null;
  onDive: () => void;
};

export function DiveTriggerBubble({
  segment,
  charRects,
  index,
  activeCharIndex,
  onDive,
}: DiveTriggerBubbleProps) {
  let minLeft = Infinity;
  let maxRight = -Infinity;
  let minTop = Infinity;

  for (let i = segment.start; i < segment.end; i++) {
    const rect = charRects[i];
    if (!rect) continue;
    minLeft = Math.min(minLeft, rect.left);
    maxRight = Math.max(maxRight, rect.right);
    minTop = Math.min(minTop, rect.top);
  }

  if (!Number.isFinite(minLeft) || !Number.isFinite(maxRight)) return null;

  let anchorLeft: number | null = null;
  let anchorTop: number | null = null;

  if (
    typeof activeCharIndex === "number" &&
    activeCharIndex >= segment.start &&
    activeCharIndex < segment.end
  ) {
    const r = charRects[activeCharIndex];
    if (r) {
      anchorLeft = (r.left + r.right) / 2;
      anchorTop = r.top;
    }
  }

  if (anchorLeft === null || anchorTop === null) {
    const width = maxRight - minLeft;
    anchorLeft = minLeft + width / 2;
    anchorTop = minTop;
  }

  const top = anchorTop + 28;

  return (
    <div
      className="absolute"
      style={{ left: anchorLeft, top, zIndex: 60 + index }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="
          relative flex h-8 w-8 items-center justify-center
          -translate-x-1/2
          rounded-full border
          border-[#CCC8FF]
          bg-[#5B4BFF] bg-opacity-90
          text-white text-[17px] font-extrabold leading-none
          shadow-md shadow-indigo-300/25
          transition-transform duration-150
          hover:translate-y-[2px]
          active:translate-y-[4px]
        "
        onClick={(e) => {
          e.stopPropagation();
          onDive();
        }}
      >
        ↓{/* 꼬리 */}
        <span
          className="
            pointer-events-none
            absolute left-1/2 bottom-full
            h-2.5 w-2.5
            -translate-x-1/2 translate-y-[3px]
            rotate-45
            bg-[#5B4BFF] bg-opacity-90
            border-t border-l border-[#CCC8FF]
          "
        />
      </button>
    </div>
  );
}
