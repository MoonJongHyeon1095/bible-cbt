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
  index: number; // 지금은 안 써도 시그니처 유지
  activeCharIndex?: number | null;
  onDive: () => void;
};

export function DiveTriggerBubble({
  segment,
  charRects,
  activeCharIndex,
  onDive,
}: DiveTriggerBubbleProps) {
  // activeCharIndex 있으면 거기 기준, 없으면 세그먼트 끝 글자 기준
  const targetIndex =
    activeCharIndex != null
      ? activeCharIndex
      : Math.max(segment.end - 1, segment.start);

  const rect = charRects[targetIndex];
  if (!rect) return null;

  const top = rect.top - 8; // 하이라이트보다 살짝 위
  const left = rect.right + 8;

  return (
    <div className="pointer-events-auto absolute" style={{ top, left }}>
      {/* group으로 묶어서 hover 시 툴팁 보이게 */}
      <div className="group relative flex items-center gap-1.5">
        {/* 동그란 ↓ 버튼 */}
        <button
          type="button"
          onClick={onDive}
          className="
            flex h-7 w-7 items-center justify-center
            rounded-full border
            border-gray-300 bg-white text-[11px]
            shadow-sm
            hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600
            active:scale-95
            transition-colors transition-transform
            dark:border-neutral-600 dark:bg-neutral-900 dark:text-gray-100
            dark:hover:border-indigo-400 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300
          "
        >
          ↓
        </button>

        {/* 말풍선 툴팁 */}
        <div
          className="
            pointer-events-none absolute left-full ml-2
            top-1/2 -translate-y-1/2
            whitespace-nowrap rounded-full
            bg-black/80 px-3 py-1
            text-[11px] font-medium text-white
            opacity-0 shadow-lg
            transition-opacity group-hover:opacity-100
            dark:bg-white/95 dark:text-neutral-900
          "
        >
          이 생각을 더 다뤄보기
        </div>
      </div>
    </div>
  );
}
