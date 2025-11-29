// // // src/components/emotion/editor/SegmentEditor.tsx
// // "use client";

// // import { useEffect, useMemo, useRef, useState } from "react";
// // import { useActiveSegmentSelection } from "../hooks/useActiveSegmentSelection";
// // import { useDragSegmentEdge } from "../hooks/useDragSegmentEdge";
// // import { useSegmentNotifier } from "../hooks/useSegmentNotifier";
// // import { useSegments } from "../hooks/useSegments";
// // import type {
// //   EmotionInputSegment,
// //   EmotionSegment,
// // } from "../types/emotion.types";
// // import { findNearestIndex } from "../utils/findNearestIndex";
// // import { getColorIndexForSegment } from "../utils/getColorIndex";
// // import type { RelativeRect } from "../utils/splitToCharRects";
// // import { SegmentOverlay } from "./SegmentOverlay";
// // import { TextLayer } from "./TextLayer";

// // type SegmentEditorProps = {
// //   text: string;
// //   onConfirm?: (segments: EmotionSegment[]) => void;
// //   onDiveSegment?: (segment: EmotionSegment) => void;
// //   onActiveSegmentChange?: (segment: EmotionInputSegment | null) => void;
// // };

// // export function SegmentEditor({
// //   text,
// //   onConfirm,
// //   onDiveSegment,
// //   onActiveSegmentChange,
// // }: SegmentEditorProps) {
// //   const [charRects, setCharRects] = useState<RelativeRect[]>([]);
// //   const containerRef = useRef<HTMLDivElement | null>(null);

// //   const { segments, updateSegmentBoundary, addSegment, removeSegment } =
// //     useSegments(text);

// //   const {
// //     startDrag,
// //     handleMouseMove: handleEdgeDragMove,
// //     handleMouseUp: handleEdgeDragUp,
// //   } = useDragSegmentEdge({
// //     charRects,
// //     segments,
// //     updateSegmentBoundary,
// //   });

// //   const notify = useSegmentNotifier(text, segments, onConfirm);

// //   const {
// //     activeSegmentId,
// //     activeCharIndex,
// //     setActiveSegmentId,
// //     handleClick: handleSegmentClick,
// //   } = useActiveSegmentSelection(segments, charRects, containerRef);

// //   useEffect(() => {
// //     if (!onActiveSegmentChange) return;
// //     onActiveSegmentChange(
// //       segments.find((s) => s.id === activeSegmentId) ?? null
// //     );
// //   }, [activeSegmentId, segments, onActiveSegmentChange]);

// //   const colorMapRef = useRef<Map<string, number>>(new Map());

// //   const colorIndexById = useMemo(() => {
// //     const map = colorMapRef.current;
// //     const result: Record<string, number> = {};
// //     let prevColor: number | null = null;

// //     for (const seg of segments) {
// //       let color = map.get(seg.id) ?? null;
// //       if (color === null) {
// //         color = getColorIndexForSegment(seg.id, prevColor);
// //         map.set(seg.id, color);
// //       }
// //       result[seg.id] = color;
// //       prevColor = color;
// //     }

// //     for (const key of map.keys()) {
// //       if (!result[key]) {
// //         map.delete(key);
// //       }
// //     }

// //     return result;
// //   }, [segments]);

// //   const [isAdding, setIsAdding] = useState(false);
// //   const [dragStartIdx, setDragStartIdx] = useState<number | null>(null);
// //   const [draftRange, setDraftRange] = useState<{
// //     start: number;
// //     end: number;
// //   } | null>(null);

// //   const getCharIndexFromEvent = (
// //     e: React.MouseEvent<HTMLDivElement>
// //   ): number | null => {
// //     if (!containerRef.current || charRects.length === 0) return null;

// //     const rect = containerRef.current.getBoundingClientRect();
// //     const x = e.clientX - rect.left;
// //     const y = e.clientY - rect.top;

// //     return findNearestIndex(charRects, x, y);
// //   };

// //   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
// //     if (!isAdding) return;

// //     const idx = getCharIndexFromEvent(e);
// //     if (idx == null) return;

// //     setDragStartIdx(idx);
// //     setDraftRange({ start: idx, end: idx + 1 });
// //     setActiveSegmentId(null);
// //   };

// //   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
// //     if (isAdding) {
// //       if (dragStartIdx == null) return;
// //       const idx = getCharIndexFromEvent(e);
// //       if (idx == null) return;

// //       const start = Math.min(dragStartIdx, idx);
// //       const end = Math.max(dragStartIdx, idx + 1);
// //       setDraftRange({ start, end });
// //       return;
// //     }

// //     handleEdgeDragMove(e);
// //   };

// //   const finishAddMode = () => {
// //     setIsAdding(false);
// //     setDragStartIdx(null);
// //     setDraftRange(null);
// //   };

// //   const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
// //     if (isAdding) {
// //       if (
// //         dragStartIdx != null &&
// //         draftRange &&
// //         draftRange.end > draftRange.start
// //       ) {
// //         addSegment(draftRange.start, draftRange.end);
// //         notify();
// //       }
// //       finishAddMode();
// //       return;
// //     }

// //     handleEdgeDragUp(e);
// //   };

// //   const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
// //     if (isAdding) {
// //       finishAddMode();
// //       return;
// //     }
// //     handleEdgeDragUp(e);
// //   };

// //   return (
// //     <div className="flex flex-col gap-1">
// //       {/* + 구간 추가 버튼 (우상단) */}
// //       <div className="flex justify-end">
// //         <button
// //           type="button"
// //           className={`group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-[11px] font-medium text-gray-700 shadow-sm backdrop-blur transition-all hover:-translate-y-[1px] hover:bg-gray-50 hover:shadow-md ${
// //             isAdding ? "ring-1 ring-gray-300 bg-gray-50" : ""
// //           }`}
// //           onClick={() => {
// //             if (isAdding) {
// //               finishAddMode();
// //             } else {
// //               setIsAdding(true);
// //               setActiveSegmentId(null);
// //             }
// //           }}
// //         >
// //           <span className="text-[13px]">＋</span>
// //           <span>구간 추가</span>
// //         </button>
// //       </div>

// //       <div
// //         ref={containerRef}
// //         className={`relative rounded-md border bg-white p-3 overflow-visible ${
// //           isAdding ? "cursor-crosshair" : "cursor-text"
// //         }`}
// //         onMouseDown={handleMouseDown}
// //         onMouseMove={handleMouseMove}
// //         onMouseUp={handleMouseUp}
// //         onMouseLeave={handleMouseLeave}
// //         onClick={isAdding ? undefined : handleSegmentClick}
// //       >
// //         {/* pastel highlight */}
// //         <div className="pointer-events-none absolute inset-0 z-0">
// //           {segments.map((seg) => (
// //             <SegmentOverlay.Highlight
// //               key={seg.id}
// //               segment={seg}
// //               charRects={charRects}
// //               index={colorIndexById[seg.id] ?? 0}
// //               isActive={activeSegmentId === seg.id}
// //             />
// //           ))}

// //           {draftRange && (
// //             <SegmentOverlay.Highlight
// //               segment={draftRange}
// //               charRects={charRects}
// //               index={segments.length}
// //               isActive={true}
// //             />
// //           )}
// //         </div>

// //         {/* 실제 텍스트 */}
// //         <div className="relative z-10">
// //           <TextLayer
// //             text={text}
// //             containerRef={containerRef}
// //             onCharRectsChange={setCharRects}
// //           />
// //         </div>

// //         {/* 핸들 + 삭제 말풍선 + 파고들기 버블 */}
// //         <div className="pointer-events-auto absolute inset-0 z-30">
// //           {segments.map((seg, idx) => (
// //             <div key={seg.id}>
// //               <SegmentOverlay.Handles
// //                 segment={seg}
// //                 charRects={charRects}
// //                 index={colorIndexById[seg.id] ?? 0}
// //                 onStartDrag={(edge) => startDrag(seg.id, edge)}
// //               />

// //               {activeSegmentId === seg.id && (
// //                 <SegmentOverlay.DeleteBubble
// //                   segment={seg}
// //                   charRects={charRects}
// //                   index={idx}
// //                   activeCharIndex={activeCharIndex}
// //                   onDelete={() => {
// //                     removeSegment(seg.id);
// //                     if (activeSegmentId === seg.id) {
// //                       setActiveSegmentId(null);
// //                     }
// //                     notify();
// //                   }}
// //                 />
// //               )}

// //               {activeSegmentId === seg.id && onDiveSegment && (
// //                 <SegmentOverlay.DiveTriggerBubble
// //                   segment={seg}
// //                   charRects={charRects}
// //                   index={idx}
// //                   activeCharIndex={activeCharIndex}
// //                   onDive={() => {
// //                     const full: EmotionSegment = {
// //                       id: seg.id,
// //                       start: seg.start,
// //                       end: seg.end,
// //                       text: text.slice(seg.start, seg.end),
// //                       nodes: [],
// //                     };
// //                     onDiveSegment(full);
// //                   }}
// //                 />
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // src/components/emotion/editor/SegmentEditor.tsx
// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useActiveSegmentSelection } from "../hooks/useActiveSegmentSelection";
// import { useDragSegmentEdge } from "../hooks/useDragSegmentEdge";
// import { useSegmentNotifier } from "../hooks/useSegmentNotifier";
// import { useSegments } from "../hooks/useSegments";
// import type {
//   EmotionInputSegment,
//   EmotionSegment,
// } from "../types/emotion.types";
// import { findNearestIndex } from "../utils/findNearestIndex";
// import { getColorIndexForSegment } from "../utils/getColorIndex";
// import type { RelativeRect } from "../utils/splitToCharRects";
// import { SegmentOverlay } from "./SegmentOverlay";
// import { TextLayer } from "./TextLayer";

// type SegmentEditorProps = {
//   text: string;
//   onConfirm?: (segments: EmotionSegment[]) => void;
//   onDiveSegment?: (segment: EmotionSegment) => void;
//   onActiveSegmentChange?: (segment: EmotionInputSegment | null) => void;

//   // ⬇️ 부모에서 내려주는 "현재 선택된 세그먼트"
//   activeSegmentIdFromParent?: string | null;
// };

// export function SegmentEditor({
//   text,
//   onConfirm,
//   onDiveSegment,
//   onActiveSegmentChange,
//   activeSegmentIdFromParent,
// }: SegmentEditorProps) {
//   const [charRects, setCharRects] = useState<RelativeRect[]>([]);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const { segments, updateSegmentBoundary, addSegment, removeSegment } =
//     useSegments(text);

//   const {
//     startDrag,
//     handleMouseMove: handleEdgeDragMove,
//     handleMouseUp: handleEdgeDragUp,
//   } = useDragSegmentEdge({
//     charRects,
//     segments,
//     updateSegmentBoundary,
//   });

//   const notify = useSegmentNotifier(text, segments, onConfirm);

//   const {
//     activeSegmentId,
//     activeCharIndex,
//     setActiveSegmentId,
//     handleClick: handleSegmentClick,
//   } = useActiveSegmentSelection(segments, charRects, containerRef);

//   // ⬇️ 내부 activeSegmentId가 바뀔 때마다 부모에 알려줌
//   useEffect(() => {
//     if (!onActiveSegmentChange) return;
//     onActiveSegmentChange(
//       segments.find((s) => s.id === activeSegmentId) ?? null
//     );
//   }, [activeSegmentId, segments, onActiveSegmentChange]);

//   // ⬇️ 부모에서 "이 세그먼트를 선택/해제해라"라고 내려보내는 값 반영
//   useEffect(() => {
//     // undefined면 "부모가 신경 안 씀"이라는 의미라 무시
//     if (activeSegmentIdFromParent === undefined) return;

//     // 값이 다를 때만 업데이트
//     if (activeSegmentId !== activeSegmentIdFromParent) {
//       setActiveSegmentId(activeSegmentIdFromParent ?? null);
//     }
//   }, [activeSegmentIdFromParent, activeSegmentId, setActiveSegmentId]);

//   const colorMapRef = useRef<Map<string, number>>(new Map());

//   const colorIndexById = useMemo(() => {
//     const map = colorMapRef.current;
//     const result: Record<string, number> = {};
//     let prevColor: number | null = null;

//     for (const seg of segments) {
//       let color = map.get(seg.id) ?? null;
//       if (color === null) {
//         color = getColorIndexForSegment(seg.id, prevColor);
//         map.set(seg.id, color);
//       }
//       result[seg.id] = color;
//       prevColor = color;
//     }

//     for (const key of map.keys()) {
//       if (!result[key]) {
//         map.delete(key);
//       }
//     }

//     return result;
//   }, [segments]);

//   const [isAdding, setIsAdding] = useState(false);
//   const [dragStartIdx, setDragStartIdx] = useState<number | null>(null);
//   const [draftRange, setDraftRange] = useState<{
//     start: number;
//     end: number;
//   } | null>(null);

//   const getCharIndexFromEvent = (
//     e: React.MouseEvent<HTMLDivElement>
//   ): number | null => {
//     if (!containerRef.current || charRects.length === 0) return null;

//     const rect = containerRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     return findNearestIndex(charRects, x, y);
//   };

//   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isAdding) return;

//     const idx = getCharIndexFromEvent(e);
//     if (idx == null) return;

//     setDragStartIdx(idx);
//     setDraftRange({ start: idx, end: idx + 1 });
//     setActiveSegmentId(null);
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (isAdding) {
//       if (dragStartIdx == null) return;
//       const idx = getCharIndexFromEvent(e);
//       if (idx == null) return;

//       const start = Math.min(dragStartIdx, idx);
//       const end = Math.max(dragStartIdx, idx + 1);
//       setDraftRange({ start, end });
//       return;
//     }

//     handleEdgeDragMove(e);
//   };

//   const finishAddMode = () => {
//     setIsAdding(false);
//     setDragStartIdx(null);
//     setDraftRange(null);
//   };

//   const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (isAdding) {
//       if (
//         dragStartIdx != null &&
//         draftRange &&
//         draftRange.end > draftRange.start
//       ) {
//         addSegment(draftRange.start, draftRange.end);
//         notify();
//       }
//       finishAddMode();
//       return;
//     }

//     handleEdgeDragUp(e);
//   };

//   const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (isAdding) {
//       finishAddMode();
//       return;
//     }
//     handleEdgeDragUp(e);
//   };

//   return (
//     <div className="flex flex-col gap-1">
//       {/* + 구간 추가 버튼 (우상단) */}
//       <div className="flex justify-end">
//         <button
//           type="button"
//           className={`group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-[11px] font-medium text-gray-700 shadow-sm backdrop-blur transition-all hover:-translate-y-[1px] hover:bg-gray-50 hover:shadow-md ${
//             isAdding ? "ring-1 ring-gray-300 bg-gray-50" : ""
//           }`}
//           onClick={() => {
//             if (isAdding) {
//               finishAddMode();
//             } else {
//               setIsAdding(true);
//               setActiveSegmentId(null);
//             }
//           }}
//         >
//           <span className="text-[13px]">＋</span>
//           <span>구간 추가</span>
//         </button>
//       </div>

//       <div
//         ref={containerRef}
//         className={`relative rounded-md border bg-white p-3 overflow-visible ${
//           isAdding ? "cursor-crosshair" : "cursor-text"
//         }`}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseLeave}
//         onClick={isAdding ? undefined : handleSegmentClick}
//       >
//         {/* pastel highlight */}
//         <div className="pointer-events-none absolute inset-0 z-0">
//           {segments.map((seg) => (
//             <SegmentOverlay.Highlight
//               key={seg.id}
//               segment={seg}
//               charRects={charRects}
//               index={colorIndexById[seg.id] ?? 0}
//               isActive={activeSegmentId === seg.id}
//             />
//           ))}

//           {draftRange && (
//             <SegmentOverlay.Highlight
//               segment={draftRange}
//               charRects={charRects}
//               index={segments.length}
//               isActive={true}
//             />
//           )}
//         </div>

//         {/* 실제 텍스트 */}
//         <div className="relative z-10">
//           <TextLayer
//             text={text}
//             containerRef={containerRef}
//             onCharRectsChange={setCharRects}
//           />
//         </div>

//         {/* 핸들 + 삭제 말풍선 + 파고들기 버블 */}
//         <div className="pointer-events-auto absolute inset-0 z-30">
//           {segments.map((seg, idx) => (
//             <div key={seg.id}>
//               <SegmentOverlay.Handles
//                 segment={seg}
//                 charRects={charRects}
//                 index={colorIndexById[seg.id] ?? 0}
//                 onStartDrag={(edge) => startDrag(seg.id, edge)}
//               />

//               {activeSegmentId === seg.id && (
//                 <SegmentOverlay.DeleteBubble
//                   segment={seg}
//                   charRects={charRects}
//                   index={idx}
//                   activeCharIndex={activeCharIndex}
//                   onDelete={() => {
//                     removeSegment(seg.id);
//                     if (activeSegmentId === seg.id) {
//                       setActiveSegmentId(null);
//                     }
//                     notify();
//                   }}
//                 />
//               )}

//               {activeSegmentId === seg.id && onDiveSegment && (
//                 <SegmentOverlay.DiveTriggerBubble
//                   segment={seg}
//                   charRects={charRects}
//                   index={idx}
//                   activeCharIndex={activeCharIndex}
//                   onDive={() => {
//                     const full: EmotionSegment = {
//                       id: seg.id,
//                       start: seg.start,
//                       end: seg.end,
//                       text: text.slice(seg.start, seg.end),
//                       nodes: [],
//                     };
//                     onDiveSegment(full);
//                   }}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/emotion/editor/SegmentEditor.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDragSegmentEdge } from "../hooks/useDragSegmentEdge";
import { useSegmentNotifier } from "../hooks/useSegmentNotifier";
import { useSegments } from "../hooks/useSegments";
import type {
  EmotionInputSegment,
  EmotionSegment,
} from "../types/emotion.types";
import { findNearestIndex } from "../utils/findNearestIndex";
import { getColorIndexForSegment } from "../utils/getColorIndex";
import type { RelativeRect } from "../utils/splitToCharRects";
import { SegmentOverlay } from "./SegmentOverlay";
import { TextLayer } from "./TextLayer";

type SegmentEditorProps = {
  text: string;
  onConfirm?: (segments: EmotionSegment[]) => void;
  /** 세그먼트 아래 화살표(파고들기) 눌렀을 때 호출 */
  onDiveSegment?: (segment: EmotionSegment) => void;
  /** 활성 세그먼트 (부모에서 관리하는 단일 상태) */
  activeSegmentId: string | null;
  /** 에디터 쪽에서 세그먼트 클릭/변경 시 부모에 알려주기 */
  onActiveSegmentChange?: (segment: EmotionInputSegment | null) => void;
};

export function SegmentEditor({
  text,
  onConfirm,
  onDiveSegment,
  activeSegmentId,
  onActiveSegmentChange,
}: SegmentEditorProps) {
  const [charRects, setCharRects] = useState<RelativeRect[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { segments, updateSegmentBoundary, addSegment, removeSegment } =
    useSegments(text);

  const {
    startDrag,
    handleMouseMove: handleEdgeDragMove,
    handleMouseUp: handleEdgeDragUp,
  } = useDragSegmentEdge({
    charRects,
    segments,
    updateSegmentBoundary,
  });

  const notify = useSegmentNotifier(text, segments, onConfirm);

  // 활성 글자 인덱스(삭제 말풍선/파고들기 말풍선 위치 조정용)
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);

  // 색 인덱스 관리 (id별 고정 + 연속 중복 최소화)
  const colorMapRef = useRef<Map<string, number>>(new Map());

  const colorIndexById = useMemo(() => {
    const map = colorMapRef.current;
    const result: Record<string, number> = {};
    let prevColor: number | null = null;

    for (const seg of segments) {
      let color = map.get(seg.id) ?? null;

      // 처음 보는 세그먼트면 util로 새 색 결정
      if (color === null) {
        color = getColorIndexForSegment(seg.id, prevColor);
        map.set(seg.id, color);
      }

      result[seg.id] = color;
      prevColor = color;
    }

    // 더 이상 존재하지 않는 세그먼트 색은 맵에서 정리
    for (const key of map.keys()) {
      if (!result[key]) {
        map.delete(key);
      }
    }

    return result;
  }, [segments]);

  // ───────────── 새 구간 추가 모드 상태 ─────────────
  const [isAdding, setIsAdding] = useState(false);
  const [dragStartIdx, setDragStartIdx] = useState<number | null>(null);
  const [draftRange, setDraftRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  // 클릭 좌표 → 문자 인덱스 변환
  const getCharIndexFromEvent = (
    e: React.MouseEvent<HTMLDivElement>
  ): number | null => {
    if (!containerRef.current || charRects.length === 0) return null;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    return findNearestIndex(charRects, x, y);
  };

  // 에디터 안 텍스트 클릭(추가 모드가 아닐 때) → 활성 세그먼트 변경
  const handleTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAdding) return;

    const idx = getCharIndexFromEvent(e);
    if (idx == null) {
      onActiveSegmentChange?.(null);
      setActiveCharIndex(null);
      return;
    }

    const seg = segments.find((s) => idx >= s.start && idx < s.end) ?? null;

    onActiveSegmentChange?.(seg ?? null);
    setActiveCharIndex(seg ? idx : null);
  };

  // 부모에서 activeSegmentId를 직접 바꾼 경우(아래 토글 등) → 적당한 위치로 버블 표시
  useEffect(() => {
    if (!activeSegmentId) {
      setActiveCharIndex(null);
      return;
    }

    const seg = segments.find((s) => s.id === activeSegmentId);
    if (!seg) {
      setActiveCharIndex(null);
      return;
    }

    const mid = Math.floor((seg.start + seg.end) / 2);
    setActiveCharIndex((prev) => prev ?? mid);
  }, [activeSegmentId, segments]);

  // ───────────── 컨테이너 마우스 이벤트 ─────────────
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdding) return;

    const idx = getCharIndexFromEvent(e);
    if (idx == null) return;

    setDragStartIdx(idx);
    setDraftRange({ start: idx, end: idx + 1 });
    // 새 구간 만드는 중에는 활성 세그먼트 해제
    onActiveSegmentChange?.(null);
    setActiveCharIndex(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAdding) {
      if (dragStartIdx == null) return;
      const idx = getCharIndexFromEvent(e);
      if (idx == null) return;

      const start = Math.min(dragStartIdx, idx);
      const end = Math.max(dragStartIdx, idx + 1);
      setDraftRange({ start, end });
      return;
    }

    handleEdgeDragMove(e);
  };

  const finishAddMode = () => {
    setIsAdding(false);
    setDragStartIdx(null);
    setDraftRange(null);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAdding) {
      if (
        dragStartIdx != null &&
        draftRange &&
        draftRange.end > draftRange.start
      ) {
        addSegment(draftRange.start, draftRange.end);
        notify();
      }
      finishAddMode();
      return;
    }

    handleEdgeDragUp(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAdding) {
      finishAddMode();
      return;
    }
    handleEdgeDragUp(e);
  };

  return (
    <div className="flex flex-col gap-1">
      {/* + 구간 추가 버튼 */}
      <div className="flex justify-end">
        <button
          type="button"
          className={`group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-[11px] font-medium text-gray-700 shadow-sm backdrop-blur transition-all hover:-translate-y-[1px] hover:bg-gray-50 hover:shadow-md ${
            isAdding ? "ring-1 ring-gray-300 bg-gray-50" : ""
          }`}
          onClick={() => {
            if (isAdding) {
              finishAddMode();
            } else {
              setIsAdding(true);
              onActiveSegmentChange?.(null);
              setActiveCharIndex(null);
            }
          }}
        >
          <span className="text-[13px]">＋</span>
          <span>구간 추가</span>
        </button>
      </div>

      <div
        ref={containerRef}
        className={`relative rounded-md border bg-white p-3 overflow-visible ${
          isAdding ? "cursor-crosshair" : "cursor-text"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleTextClick}
      >
        {/* pastel highlight behind text */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {segments.map((seg) => (
            <SegmentOverlay.Highlight
              key={seg.id}
              segment={seg}
              charRects={charRects}
              index={colorIndexById[seg.id] ?? 0}
              isActive={activeSegmentId === seg.id}
            />
          ))}

          {/* 드래그 중인 임시 구간 하이라이트 */}
          {draftRange && (
            <SegmentOverlay.Highlight
              segment={draftRange}
              charRects={charRects}
              index={segments.length}
              isActive={true}
            />
          )}
        </div>

        {/* text layer */}
        <div className="relative z-10">
          <TextLayer
            text={text}
            containerRef={containerRef}
            onCharRectsChange={setCharRects}
          />
        </div>

        {/* handles + 삭제 말풍선 + 파고들기 화살표 */}
        <div className="pointer-events-auto absolute inset-0 z-30">
          {segments.map((seg, idx) => (
            <div key={seg.id}>
              <SegmentOverlay.Handles
                segment={seg}
                charRects={charRects}
                index={colorIndexById[seg.id] ?? 0}
                onStartDrag={(edge) => startDrag(seg.id, edge)}
              />

              {activeSegmentId === seg.id && (
                <SegmentOverlay.DeleteBubble
                  segment={seg}
                  charRects={charRects}
                  index={idx}
                  activeCharIndex={activeCharIndex}
                  onDelete={() => {
                    removeSegment(seg.id);
                    notify();
                    onActiveSegmentChange?.(null);
                    setActiveCharIndex(null);
                  }}
                />
              )}

              {activeSegmentId === seg.id && onDiveSegment && (
                <SegmentOverlay.DiveTriggerBubble
                  segment={seg}
                  charRects={charRects}
                  index={idx}
                  activeCharIndex={activeCharIndex}
                  onDive={() => {
                    const full: EmotionSegment = {
                      id: seg.id,
                      start: seg.start,
                      end: seg.end,
                      text: text.slice(seg.start, seg.end),
                      nodes: [],
                    };
                    onDiveSegment(full);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
