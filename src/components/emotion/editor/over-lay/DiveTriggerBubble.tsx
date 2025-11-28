// // src/components/emotion/editor/over-lay/DiveTriggerBubble.tsx
// "use client";

// import type { EmotionInputSegment } from "../../types/emotion.types";
// import type { RelativeRect } from "../../utils/splitToCharRects";

// type DiveTriggerBubbleProps = {
//   segment: EmotionInputSegment;
//   charRects: RelativeRect[];
//   index: number;
//   activeCharIndex?: number | null;
//   onDive: () => void;
// };

// export function DiveTriggerBubble({
//   segment,
//   charRects,
//   index,
//   activeCharIndex,
//   onDive,
// }: DiveTriggerBubbleProps) {
//   // ── 세그먼트 전체 bounding box ─────────────────────
//   let minLeft = Infinity;
//   let maxRight = -Infinity;
//   let minTop = Infinity;

//   for (let i = segment.start; i < segment.end; i++) {
//     const rect = charRects[i];
//     if (!rect) continue;
//     minLeft = Math.min(minLeft, rect.left);
//     maxRight = Math.max(maxRight, rect.right);
//     minTop = Math.min(minTop, rect.top);
//   }

//   if (!Number.isFinite(minLeft) || !Number.isFinite(maxRight)) return null;

//   // ── 클릭한 글자 기준 anchor 좌표 ─────────────────────
//   let anchorLeft: number | null = null;
//   let anchorTop: number | null = null;

//   if (
//     typeof activeCharIndex === "number" &&
//     activeCharIndex >= segment.start &&
//     activeCharIndex < segment.end
//   ) {
//     const r = charRects[activeCharIndex];
//     if (r) {
//       anchorLeft = (r.left + r.right) / 2;
//       anchorTop = r.top;
//     }
//   }

//   // 클릭한 글자 정보 없으면 세그먼트 중앙 기준
//   if (anchorLeft === null || anchorTop === null) {
//     const width = maxRight - minLeft;
//     anchorLeft = minLeft + width / 2;
//     anchorTop = minTop;
//   }

//   // SelectionBubble보다 조금 아래에 뜨게 하고 싶으면 top을 살짝 내린다
//   const top = anchorTop + 28;

//   return (
//     <div
//       className="absolute"
//       style={{ left: anchorLeft, top, zIndex: 60 + index }}
//       onClick={(e) => e.stopPropagation()}
//     >
//       <button
//         type="button"
//         className="
//           flex h-6 w-6 items-center justify-center
//           -translate-x-1/2
//           rounded-full border border-gray-200
//           bg-white text-[11px] leading-none
//           shadow-sm
//           transition-colors duration-150
//           hover:bg-gray-50
//         "
//         onClick={(e) => {
//           e.stopPropagation();
//           onDive();
//         }}
//       >
//         ↓
//       </button>
//     </div>
//   );
// }

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
  // ── 세그먼트 전체 bounding box ─────────────────────
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

  // ── 클릭한 글자 기준 anchor 좌표 ─────────────────────
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

  // 클릭한 글자 정보 없으면 세그먼트 중앙 기준
  if (anchorLeft === null || anchorTop === null) {
    const width = maxRight - minLeft;
    anchorLeft = minLeft + width / 2;
    anchorTop = minTop;
  }

  // SelectionBubble보다 조금 아래에 뜨게 하고 싶으면 top을 살짝 내린다
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
          onDive();
        }}
      >
        ↓{/* 위로 붙는 꼬리 (텍스트 쪽을 가리키는 삼각형) */}
        <span
          className="
            pointer-events-none
            absolute left-1/2 bottom-full
            h-2 w-2
            -translate-x-1/2 translate-y-[2px]
            rotate-45
            bg-white
            border-t border-l border-gray-200
          "
        />
      </button>
    </div>
  );
}
