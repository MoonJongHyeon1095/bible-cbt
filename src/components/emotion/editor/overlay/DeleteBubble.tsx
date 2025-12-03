// src/components/emotion/editor/overlay/DeleteBubble.tsx
"use client";

import type { EmotionInputSegment } from "../../types/emotion.types";
import type { RelativeRect } from "../utils/splitToCharRects";

type DeleteBubbleProps = {
  segment: EmotionInputSegment;
  charRects: RelativeRect[];
  index: number;
  activeCharIndex?: number | null;
  onDelete: () => void;
};

export function DeleteBubble({
  segment,
  charRects,
  index,
  activeCharIndex,
  onDelete,
}: DeleteBubbleProps) {
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

  const BUBBLE_HEIGHT = 24;
  const TAIL_HEIGHT = 8;
  const GAP = 4;
  const top = anchorTop - (BUBBLE_HEIGHT + TAIL_HEIGHT + GAP);

  return (
    <div
      className="absolute"
      style={{ left: anchorLeft, top, zIndex: 40 + index }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="
          relative
          flex h-6 w-6 items-center justify-center
          -translate-x-1/2
          rounded-full border border-gray-200
          bg-white text-[11px] leading-none
          shadow-sm
          transition-colors duration-150
          hover:bg-gray-50
        "
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        ✕
        <span
          className="
            pointer-events-none
            absolute left-1/2 top-full
            h-2 w-2
            -translate-x-1/2 -translate-y-[2px]
            rotate-45
            bg-white
            border-b border-r border-gray-200
          "
        />
      </button>
    </div>
  );
}
