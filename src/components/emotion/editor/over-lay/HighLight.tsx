// // // src/components/emotion/editor/over-lay/Highlight.tsx
// // "use client";

// // import type { EmotionSegment } from "../../types/emotion.types";
// // import type { RelativeRect } from "../../utils/splitToCharRects";

// // const COLOR_THEMES = [
// //   {
// //     bgLight: "bg-blue-100/40",
// //     bgDark: "bg-blue-500/30",
// //     borderLight: "border-blue-300",
// //     borderDark: "border-blue-400",
// //   },
// //   {
// //     bgLight: "bg-emerald-100/40",
// //     bgDark: "bg-emerald-500/30",
// //     borderLight: "border-emerald-300",
// //     borderDark: "border-emerald-400",
// //   },
// //   {
// //     bgLight: "bg-violet-100/40",
// //     bgDark: "bg-violet-500/30",
// //     borderLight: "border-violet-300",
// //     borderDark: "border-violet-400",
// //   },
// //   {
// //     bgLight: "bg-amber-100/40",
// //     bgDark: "bg-amber-500/30",
// //     borderLight: "border-amber-300",
// //     borderDark: "border-amber-400",
// //   },
// // ];

// // type SegmentLike = EmotionSegment | { start: number; end: number };

// // function calcLineBoxes(segment: SegmentLike, charRects: RelativeRect[]) {
// //   const lines = new Map<number, any>();

// //   for (let i = segment.start; i < segment.end; i++) {
// //     const rect = charRects[i];
// //     if (!rect) continue;

// //     const key = Math.round(rect.top);
// //     const ex = lines.get(key);
// //     if (!ex) {
// //       lines.set(key, {
// //         top: rect.top,
// //         left: rect.left,
// //         right: rect.right,
// //         height: rect.height,
// //       });
// //     } else {
// //       ex.left = Math.min(ex.left, rect.left);
// //       ex.right = Math.max(ex.right, rect.right);
// //     }
// //   }

// //   return [...lines.values()].sort((a, b) => a.top - b.top);
// // }

// // export function Highlight({
// //   segment,
// //   index,
// //   charRects,
// //   isActive = false,
// // }: {
// //   segment: SegmentLike;
// //   /** SegmentEditor에서 내려준 '색 인덱스' 또는 draft용 index */
// //   index: number;
// //   charRects: RelativeRect[];
// //   isActive?: boolean;
// // }) {
// //   const isRealSegment = (segment as EmotionSegment).id != null;

// //   // 실제 세그먼트는 index를 '색 인덱스'로 그대로 사용,
// //   // draftRange 등은 단순 mod로 회전
// //   const colorIndex = isRealSegment
// //     ? index % COLOR_THEMES.length
// //     : index % COLOR_THEMES.length;

// //   const theme = COLOR_THEMES[colorIndex];
// //   const boxes = calcLineBoxes(segment, charRects);

// //   return boxes.map((b, i) => (
// //     <div
// //       key={i}
// //       className={`
// //       absolute rounded-md pointer-events-none
// //       ${theme.bgLight} dark:${theme.bgDark}
// //       mix-blend-multiply dark:mix-blend-screen
// //       ${
// //         isActive
// //           ? `border-2 shadow-sm ${theme.borderLight} dark:${theme.borderDark}`
// //           : "border border-transparent"
// //       }
// //     `}
// //       style={{
// //         top: b.top,
// //         left: b.left,
// //         width: b.right - b.left,
// //         height: b.height,
// //         zIndex: 0,
// //       }}
// //     />
// //   ));
// // }

// // src/components/emotion/editor/over-lay/Highlight.tsx
// "use client";

// import type { EmotionSegment } from "../../types/emotion.types";
// import type { RelativeRect } from "../../utils/splitToCharRects";

// const COLOR_THEMES = [
//   {
//     bgLight: "bg-blue-100/40",
//     bgDark: "bg-blue-500/30",
//     borderLight: "border-blue-300",
//     borderDark: "border-blue-400",
//   },
//   {
//     bgLight: "bg-emerald-100/40",
//     bgDark: "bg-emerald-500/30",
//     borderLight: "border-emerald-300",
//     borderDark: "border-emerald-400",
//   },
//   {
//     bgLight: "bg-violet-100/40",
//     bgDark: "bg-violet-500/30",
//     borderLight: "border-violet-300",
//     borderDark: "border-violet-400",
//   },
//   {
//     bgLight: "bg-amber-100/40",
//     bgDark: "bg-amber-500/30",
//     borderLight: "border-amber-300",
//     borderDark: "border-amber-400",
//   },
// ];

// type SegmentLike = EmotionSegment | { start: number; end: number };

// // function calcLineBoxes(segment: SegmentLike, charRects: RelativeRect[]) {
// //   const boxes: { top: number; left: number; right: number; height: number }[] =
// //     [];

// //   if (!charRects.length) return boxes;

// //   // 혹시라도 start/end가 범위를 살짝 벗어나 있어도 안전하게 클램프
// //   const start = Math.max(0, Math.min(segment.start, charRects.length - 1));
// //   const end = Math.max(start + 1, Math.min(segment.end, charRects.length));

// //   let current: {
// //     top: number;
// //     left: number;
// //     right: number;
// //     height: number;
// //   } | null = null;

// //   for (let i = start; i < end; i++) {
// //     const rect = charRects[i];
// //     if (!rect) continue;

// //     if (!current) {
// //       current = {
// //         top: rect.top,
// //         left: rect.left,
// //         right: rect.right,
// //         height: rect.height,
// //       };
// //       continue;
// //     }

// //     // 같은 라인인지 판단: top 차이가 글자 높이의 0.6배 이하면 같은 줄로 본다
// //     const sameLine = Math.abs(rect.top - current.top) < rect.height * 0.6;

// //     if (!sameLine) {
// //       boxes.push(current);
// //       current = {
// //         top: rect.top,
// //         left: rect.left,
// //         right: rect.right,
// //         height: rect.height,
// //       };
// //     } else {
// //       current.left = Math.min(current.left, rect.left);
// //       current.right = Math.max(current.right, rect.right);
// //       current.height = Math.max(current.height, rect.height);
// //     }
// //   }

// //   if (current) boxes.push(current);

// //   return boxes;
// // }
// function calcLineBoxes(segment: SegmentLike, charRects: RelativeRect[]) {
//   const lines = new Map<
//     number,
//     { top: number; left: number; right: number; height: number }
//   >();

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
//       ex.height = Math.max(ex.height, rect.height);
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
//   /** SegmentEditor에서 내려준 '색 인덱스' 또는 draft용 index */
//   index: number;
//   charRects: RelativeRect[];
//   isActive?: boolean;
// }) {
//   const isRealSegment = (segment as EmotionSegment).id != null;

//   const colorIndex = isRealSegment
//     ? index % COLOR_THEMES.length
//     : index % COLOR_THEMES.length;

//   const theme = COLOR_THEMES[colorIndex];
//   const boxes = calcLineBoxes(segment, charRects);

//   return boxes.map((b, i) => (
//     <div
//       key={i}
//       className={`
//         absolute rounded-md pointer-events-none
//         ${theme.bgLight} dark:${theme.bgDark}
//         mix-blend-multiply dark:mix-blend-screen
//         ${
//           isActive
//             ? `border-2 shadow-sm ${theme.borderLight} dark:${theme.borderDark}`
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
  {
    bgLight: "bg-blue-100/40",
    bgDark: "bg-blue-500/30",
    borderLight: "border-blue-300",
    borderDark: "border-blue-400",
  },
  {
    bgLight: "bg-emerald-100/40",
    bgDark: "bg-emerald-500/30",
    borderLight: "border-emerald-300",
    borderDark: "border-emerald-400",
  },
  {
    bgLight: "bg-violet-100/40",
    bgDark: "bg-violet-500/30",
    borderLight: "border-violet-300",
    borderDark: "border-violet-400",
  },
  {
    bgLight: "bg-amber-100/40",
    bgDark: "bg-amber-500/30",
    borderLight: "border-amber-300",
    borderDark: "border-amber-400",
  },
];

type SegmentLike = EmotionSegment | { start: number; end: number };

function calcLineBoxes(segment: SegmentLike, charRects: RelativeRect[]) {
  const boxes: { top: number; left: number; right: number; height: number }[] =
    [];

  // 🔴 charRects 아직 안 들어온 상태면 그냥 종료
  if (charRects.length === 0) {
    // 디버깅용
    // console.warn("[HIGHLIGHT] charRects empty", {
    //   segmentStart: segment.start,
    //   segmentEnd: segment.end,
    // });
    return boxes;
  }

  // 🔒 segment.start / end 를 안전하게 클램프
  const maxIndex = charRects.length - 1;
  const safeStart = Math.max(0, Math.min(segment.start, maxIndex));
  const safeEnd = Math.max(
    safeStart + 1,
    Math.min(segment.end, charRects.length)
  );

  let current: {
    top: number;
    left: number;
    right: number;
    height: number;
  } | null = null;

  for (let i = safeStart; i < safeEnd; i++) {
    const rect = charRects[i];

    if (!rect) {
      // holes 있을 때 디버깅용
      // console.warn("[HIGHLIGHT] missing rect", {
      //   i,
      //   len: charRects.length,
      //   segmentStart: segment.start,
      //   segmentEnd: segment.end,
      // });
      continue;
    }

    if (!current) {
      current = {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        height: rect.height,
      };
      continue;
    }

    const sameLine = Math.abs(rect.top - current.top) < rect.height * 0.6;

    if (!sameLine) {
      boxes.push(current);
      current = {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        height: rect.height,
      };
    } else {
      current.left = Math.min(current.left, rect.left);
      current.right = Math.max(current.right, rect.right);
      current.height = Math.max(current.height, rect.height);
    }
  }

  if (current) boxes.push(current);

  return boxes;
}

export function Highlight({
  segment,
  index,
  charRects,
  isActive = false,
}: {
  segment: SegmentLike;
  index: number;
  charRects: RelativeRect[];
  isActive?: boolean;
}) {
  // 🔒 charRects 없으면 하이라이트 자체를 그리지 않음
  if (charRects.length === 0) return null;

  const isRealSegment = (segment as EmotionSegment).id != null;
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
        ${theme.bgLight} dark:${theme.bgDark}
        mix-blend-multiply dark:mix-blend-screen
        ${
          isActive
            ? `border-2 shadow-sm ${theme.borderLight} dark:${theme.borderDark}`
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
