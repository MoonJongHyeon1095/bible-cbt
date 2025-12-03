// // src/components/emotion/hooks/useDragSegmentEdge.ts
// "use client";

// import { useRef, useState, type MouseEventHandler } from "react";
// import type { EmotionInputSegment } from "../../types/emotion.types";
// import { findNearestIndex } from "../utils/findNearestIndex";
// import type { RelativeRect } from "../utils/splitToCharRects";

// type UseDragSegmentEdgeParams = {
//   charRects: RelativeRect[];
//   segments: EmotionInputSegment[]; // 🔹 로그용으로 사용
//   updateSegmentBoundary: (
//     segmentId: string,
//     edge: "start" | "end",
//     idx: number
//   ) => void;
// };

// export function useDragSegmentEdge({
//   charRects,
//   segments,
//   updateSegmentBoundary,
// }: UseDragSegmentEdgeParams) {
//   const [dragInfo, setDragInfo] = useState<{
//     segmentId: string;
//     edge: "start" | "end";
//   } | null>(null);

//   // 드래그 중 마지막 마우스 위치 / 계산 결과 저장
//   const lastDragRef = useRef<{
//     idx: number;
//     clientX: number;
//     clientY: number;
//     containerLeft: number;
//     containerTop: number;
//   } | null>(null);

//   const startDrag = (segmentId: string, edge: "start" | "end") => {
//     setDragInfo({ segmentId, edge });
//   };

//   const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
//     if (!dragInfo) return;
//     if (charRects.length === 0) return;

//     const containerRect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - containerRect.left;
//     const y = e.clientY - containerRect.top;

//     const idx = findNearestIndex(charRects, x, y);

//     lastDragRef.current = {
//       idx,
//       clientX: e.clientX,
//       clientY: e.clientY,
//       containerLeft: containerRect.left,
//       containerTop: containerRect.top,
//     };

//     // ❗ 여기서는 "raw" 인덱스만 넘김
//     updateSegmentBoundary(dragInfo.segmentId, dragInfo.edge, idx);
//   };

//   const handleMouseUp: MouseEventHandler<HTMLDivElement> = () => {
//     if (dragInfo) {
//       const { segmentId, edge } = dragInfo;
//       const seg = segments.find((s) => s.id === segmentId);

//       let highlightIdx: number | null = null;
//       if (seg) {
//         if (edge === "end") {
//           highlightIdx = Math.max(seg.end - 1, seg.start);
//         } else {
//           highlightIdx = seg.start;
//         }
//       }

//       const highlightRect =
//         highlightIdx != null ? charRects[highlightIdx] : undefined;
//       const last = lastDragRef.current;

//       console.log("[drag end]", {
//         segmentId,
//         edge,
//         pointer: last
//           ? {
//               clientX: last.clientX,
//               clientY: last.clientY,
//               relativeX: last.clientX - last.containerLeft,
//               relativeY: last.clientY - last.containerTop,
//             }
//           : null,
//         segment: seg
//           ? {
//               start: seg.start,
//               end: seg.end,
//             }
//           : null,
//         highlight: highlightRect
//           ? {
//               relativeLeft: highlightRect.left,
//               relativeRight: highlightRect.right,
//               top: highlightRect.top,
//               bottom: highlightRect.bottom,
//             }
//           : null,
//       });
//     }

//     setDragInfo(null);
//     lastDragRef.current = null;
//   };

//   return {
//     startDrag,
//     handleMouseMove,
//     handleMouseUp,
//   };
// }
// src/components/emotion/editor/hooks/useDragSegmentEdge.ts
"use client";

import { useRef, useState, type MouseEventHandler } from "react";

import { EmotionInputSegment } from "../../types/emotion.types";
import { findNearestIndex } from "../utils/findNearestIndex";
import type { RelativeRect } from "../utils/splitToCharRects";

type UseDragSegmentEdgeParams = {
  text: string; // 필요하면 디버깅 등에 사용
  charRects: RelativeRect[];
  segments: EmotionInputSegment[];
  updateSegmentBoundary: (
    segmentId: string,
    edge: "start" | "end",
    idx: number
  ) => void;
};

export function useDragSegmentEdge({
  text, // eslint-disable-line @typescript-eslint/no-unused-vars
  charRects,
  segments,
  updateSegmentBoundary,
}: UseDragSegmentEdgeParams) {
  const [dragInfo, setDragInfo] = useState<{
    segmentId: string;
    edge: "start" | "end";
  } | null>(null);

  // 드래그 중 마지막 마우스 위치 / 계산 결과 저장
  const lastDragRef = useRef<{
    idx: number;
    clientX: number;
    clientY: number;
    containerLeft: number;
    containerTop: number;
  } | null>(null);

  const startDrag = (segmentId: string, edge: "start" | "end") => {
    setDragInfo({ segmentId, edge });
  };

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!dragInfo) return;
    if (charRects.length === 0) return;

    const containerRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    const idx = findNearestIndex(charRects, x, y);

    lastDragRef.current = {
      idx,
      clientX: e.clientX,
      clientY: e.clientY,
      containerLeft: containerRect.left,
      containerTop: containerRect.top,
    };

    // 여기서는 raw idx만 넘기고,
    // 공백 스냅은 useSegments.updateSegmentBoundary에서 처리.
    updateSegmentBoundary(dragInfo.segmentId, dragInfo.edge, idx);
  };

  const handleMouseUp: MouseEventHandler<HTMLDivElement> = () => {
    if (dragInfo) {
      const { segmentId, edge } = dragInfo;
      const seg = segments.find((s) => s.id === segmentId);

      let highlightIdx: number | null = null;
      if (seg) {
        if (edge === "end") {
          highlightIdx = Math.max(seg.end - 1, seg.start);
        } else {
          highlightIdx = seg.start;
        }
      }

      const highlightRect =
        highlightIdx != null ? charRects[highlightIdx] : undefined;
      const last = lastDragRef.current;

      console.log("[drag end]", {
        segmentId,
        edge,
        pointer: last
          ? {
              clientX: last.clientX,
              clientY: last.clientY,
              relativeX: last.clientX - last.containerLeft,
              relativeY: last.clientY - last.containerTop,
            }
          : null,
        segment: seg
          ? {
              start: seg.start,
              end: seg.end,
            }
          : null,
        highlight: highlightRect
          ? {
              relativeLeft: highlightRect.left,
              relativeRight: highlightRect.right,
              top: highlightRect.top,
              bottom: highlightRect.bottom,
            }
          : null,
      });
    }

    setDragInfo(null);
    lastDragRef.current = null;
  };

  return {
    startDrag,
    handleMouseMove,
    handleMouseUp,
  };
}
