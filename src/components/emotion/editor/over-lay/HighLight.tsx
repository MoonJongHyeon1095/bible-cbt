// "use client";

// import type { EmotionSegment } from "../../types/emotion.types";
// import type { RelativeRect } from "../../utils/splitToCharRects";

// // 배경/보더를 분리해서 정의
// const COLOR_THEMES = [
//   { bg: "bg-blue-100/30", border: "border-blue-300" },
//   { bg: "bg-emerald-100/30", border: "border-emerald-300" },
//   { bg: "bg-violet-100/30", border: "border-violet-300" },
//   { bg: "bg-amber-100/30", border: "border-amber-300" },
// ];

// type SegmentLike = EmotionSegment | { start: number; end: number };

// // 간단한 문자열 해시 → 0 ~ (mod-1)
// function hashString(str: string, mod: number): number {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = (hash * 31 + str.charCodeAt(i)) | 0; // 32비트 int
//   }
//   return Math.abs(hash) % mod;
// }

// function calcLineBoxes(segment: SegmentLike, charRects: RelativeRect[]) {
//   const lines = new Map<number, any>();

//   for (let i = segment.start; i < segment.end; i++) {
//     const rect = charRects[i];
//     if (!rect) continue;

//     const key = Math.round(rect.top);
//     const ex = lines.get(key);
//     if (!ex) {
//       lines.set(key, {
//         top: rect.top,
//         left: rect.left,
//         right: rect.right,
//         height: rect.height,
//       });
//     } else {
//       ex.left = Math.min(ex.left, rect.left);
//       ex.right = Math.max(ex.right, rect.right);
//     }
//   }

//   return [...lines.values()].sort((a, b) => a.top - b.top);
// }

// export function Highlight({
//   segment,
//   index,
//   charRects,
//   isActive = false,
// }: {
//   segment: SegmentLike;
//   index: number;
//   charRects: RelativeRect[];
//   isActive?: boolean;
// }) {
//   // EmotionSegment 라면 id 기반으로 색 고정, 아니면 index 사용 (draftRange용)
//   const colorIndex =
//     (segment as EmotionSegment).id != null
//       ? hashString((segment as EmotionSegment).id, COLOR_THEMES.length)
//       : index % COLOR_THEMES.length;

//   const theme = COLOR_THEMES[colorIndex];
//   const boxes = calcLineBoxes(segment, charRects);

//   return boxes.map((b, i) => (
//     <div
//       key={i}
//       className={`
//         absolute rounded-md pointer-events-none
//         ${theme.bg}
//         mix-blend-multiply
//         ${
//           isActive
//             ? `border-2 shadow-sm ${theme.border}`
//             : "border border-transparent"
//         }
//       `}
//       style={{
//         top: b.top,
//         left: b.left,
//         width: b.right - b.left,
//         height: b.height,
//         zIndex: 0,
//       }}
//     />
//   ));
// }

// src/components/emotion/editor/over-lay/Highlight.tsx
"use client";

import type { EmotionSegment } from "../../types/emotion.types";
import type { RelativeRect } from "../../utils/splitToCharRects";

const COLOR_THEMES = [
  { bg: "bg-blue-100/30", border: "border-blue-300" },
  { bg: "bg-emerald-100/30", border: "border-emerald-300" },
  { bg: "bg-violet-100/30", border: "border-violet-300" },
  { bg: "bg-amber-100/30", border: "border-amber-300" },
];

type SegmentLike = EmotionSegment | { start: number; end: number };

function calcLineBoxes(segment: SegmentLike, charRects: RelativeRect[]) {
  const lines = new Map<number, any>();

  for (let i = segment.start; i < segment.end; i++) {
    const rect = charRects[i];
    if (!rect) continue;

    const key = Math.round(rect.top);
    const ex = lines.get(key);
    if (!ex) {
      lines.set(key, {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        height: rect.height,
      });
    } else {
      ex.left = Math.min(ex.left, rect.left);
      ex.right = Math.max(ex.right, rect.right);
    }
  }

  return [...lines.values()].sort((a, b) => a.top - b.top);
}

export function Highlight({
  segment,
  index,
  charRects,
  isActive = false,
}: {
  segment: SegmentLike;
  /** SegmentEditor에서 내려준 '색 인덱스' 또는 draft용 index */
  index: number;
  charRects: RelativeRect[];
  isActive?: boolean;
}) {
  const isRealSegment = (segment as EmotionSegment).id != null;

  // 실제 세그먼트는 index를 '색 인덱스'로 그대로 사용,
  // draftRange 등은 단순 mod로 회전
  const colorIndex = isRealSegment
    ? index % COLOR_THEMES.length
    : index % COLOR_THEMES.length;

  const theme = COLOR_THEMES[colorIndex];
  const boxes = calcLineBoxes(segment, charRects);

  return boxes.map((b, i) => (
    <div
      key={i}
      className={`
        absolute rounded-md pointer-events-none
        ${theme.bg}
        mix-blend-multiply
        ${
          isActive
            ? `border-2 shadow-sm ${theme.border}`
            : "border border-transparent"
        }
      `}
      style={{
        top: b.top,
        left: b.left,
        width: b.right - b.left,
        height: b.height,
        zIndex: 0,
      }}
    />
  ));
}
