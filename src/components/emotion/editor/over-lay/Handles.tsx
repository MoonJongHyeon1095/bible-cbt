// // src/components/emotion/editor/over-lay/Handles.tsx
// "use client";

// import type { EmotionInputSegment } from "../../types/emotion.types";
// import type { RelativeRect } from "../../utils/splitToCharRects";
// import { HandleBar } from "./HandleBar";

// const HANDLE_COLORS = [
//   "bg-blue-500",
//   "bg-emerald-500",
//   "bg-violet-500",
//   "bg-amber-500",
// ];

// // highlight에서 쓰던 hash 함수 복붙
// function hashString(str: string, mod: number): number {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = (hash * 31 + str.charCodeAt(i)) | 0;
//   }
//   return Math.abs(hash) % mod;
// }

// type HandlesProps = {
//   segment: EmotionInputSegment;
//   charRects: RelativeRect[];
//   index: number;
//   onStartDrag: (edge: "start" | "end") => void;
// };

// export function Handles({
//   segment,
//   charRects,
//   index,
//   onStartDrag,
// }: HandlesProps) {
//   const startRect = charRects[segment.start];
//   const endRect = charRects[segment.end - 1];
//   if (!startRect || !endRect) return null;

//   const handleHeight = startRect.height * 0.5;

//   // id 기반으로 색 고정
//   const colorIndex = hashString(segment.id, HANDLE_COLORS.length);
//   const theme = HANDLE_COLORS[colorIndex];

//   return (
//     <>
//       <HandleBar
//         left={startRect.left - 2}
//         top={startRect.top + startRect.height / 2}
//         height={handleHeight}
//         className={theme}
//         onMouseDown={() => onStartDrag("start")}
//       />
//       <HandleBar
//         left={endRect.right + 2}
//         top={endRect.top + endRect.height / 2}
//         height={handleHeight}
//         className={theme}
//         onMouseDown={() => onStartDrag("end")}
//       />
//     </>
//   );
// }

// src/components/emotion/editor/over-lay/Handles.tsx
"use client";

import type { EmotionInputSegment } from "../../types/emotion.types";
import type { RelativeRect } from "../../utils/splitToCharRects";
import { HandleBar } from "./HandleBar";

const HANDLE_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
];

type HandlesProps = {
  segment: EmotionInputSegment;
  charRects: RelativeRect[];
  /**
   * SegmentEditor에서 내려준 '색 인덱스'
   * (Highlight와 동일하게 맞추기 위해 사용)
   */
  index: number;
  onStartDrag: (edge: "start" | "end") => void;
};

export function Handles({
  segment,
  charRects,
  index,
  onStartDrag,
}: HandlesProps) {
  const startRect = charRects[segment.start];
  const endRect = charRects[segment.end - 1];
  if (!startRect || !endRect) return null;

  const handleHeight = startRect.height * 0.5;

  const colorIndex = index % HANDLE_COLORS.length;
  const theme = HANDLE_COLORS[colorIndex];

  return (
    <>
      <HandleBar
        left={startRect.left - 2}
        top={startRect.top + startRect.height / 2}
        height={handleHeight}
        className={theme}
        onMouseDown={() => onStartDrag("start")}
      />
      <HandleBar
        left={endRect.right + 2}
        top={endRect.top + endRect.height / 2}
        height={handleHeight}
        className={theme}
        onMouseDown={() => onStartDrag("end")}
      />
    </>
  );
}
