"use client";

import type React from "react";
import { EmotionInputSegment } from "../../types/emotion.types";
import { RelativeRect } from "../utils/splitToCharRects";

type DraftRange = { start: number; end: number } | null;

type Params = {
  // 추가 모드 상태
  isAdding: boolean;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;

  dragStartIdx: number | null;
  setDragStartIdx: React.Dispatch<React.SetStateAction<number | null>>;

  draftRange: DraftRange;
  setDraftRange: React.Dispatch<React.SetStateAction<DraftRange>>;

  // 세그먼트 + 조작 함수들
  segments: EmotionInputSegment[];
  addSegment: (start: number, end: number) => void;
  notify: () => void;

  onActiveSegmentChange?: (segment: EmotionInputSegment | null) => void;
  setActiveCharIndex: React.Dispatch<React.SetStateAction<number | null>>;

  // 좌표 → 문자 인덱스 변환 함수
  getCharIndexFromEvent: (e: React.MouseEvent<HTMLDivElement>) => number | null;

  // 드래그 핸들(왼/오른쪽 경계)용 기본 핸들러
  handleEdgeDragMove: React.MouseEventHandler<HTMLDivElement>;
  handleEdgeDragUp: React.MouseEventHandler<HTMLDivElement>;

  // (지금은 쓰지 않지만 시그니처 맞추려고만 둔 것들)
  containerRef?: React.RefObject<HTMLDivElement | null>;
  charRects?: RelativeRect[];
};

export function useSegmentEditorMouseHandlers({
  isAdding,
  setIsAdding,
  dragStartIdx,
  setDragStartIdx,
  draftRange,
  setDraftRange,
  segments,
  addSegment,
  notify,
  onActiveSegmentChange,
  setActiveCharIndex,
  getCharIndexFromEvent,
  handleEdgeDragMove,
  handleEdgeDragUp,
}: Params) {
  const finishAddMode = () => {
    setIsAdding(false);
    setDragStartIdx(null);
    setDraftRange(null);
  };

  /** 텍스트 클릭 → 활성 세그먼트 변경 (추가 모드 아닐 때만) */
  const handleTextClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (isAdding) return;

    const idx = getCharIndexFromEvent(e);
    if (idx == null) {
      onActiveSegmentChange?.(null);
      setActiveCharIndex(null);
      return;
    }

    const seg = segments.find((s) => idx >= s.start && idx < s.end) ?? null;

    onActiveSegmentChange?.(seg);
    setActiveCharIndex(seg ? idx : null);
  };

  /** 추가 모드에서 마우스 다운 → 드래그 시작점 기록 */
  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isAdding) return;

    const idx = getCharIndexFromEvent(e);
    if (idx == null) return;

    setDragStartIdx(idx);
    setDraftRange({ start: idx, end: idx + 1 });

    // 새 구간 만드는 중에는 활성 세그먼트 해제
    onActiveSegmentChange?.(null);
    setActiveCharIndex(null);
  };

  /** 추가 모드에서 드래그 중 마우스 이동 */
  const handleMouseMoveWithAdd: React.MouseEventHandler<HTMLDivElement> = (
    e
  ) => {
    if (!isAdding) {
      // 안전장치: 혹시라도 잘못 연결되면 edge drag로 넘겨줌
      handleEdgeDragMove(e);
      return;
    }

    if (dragStartIdx == null) return;

    const idx = getCharIndexFromEvent(e);
    if (idx == null) return;

    const start = Math.min(dragStartIdx, idx);
    const end = Math.max(dragStartIdx, idx + 1);

    setDraftRange({ start, end });
  };

  /** 마우스 업: 추가 모드면 새 세그먼트 확정, 아니면 edge drag 끝 */
  const handleMouseUpWithAdd: React.MouseEventHandler<HTMLDivElement> = (e) => {
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
    } else {
      handleEdgeDragUp(e);
    }
  };

  /** 영역 벗어났을 때도 적당히 정리 */
  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (isAdding) {
      finishAddMode();
    } else {
      handleEdgeDragUp(e);
    }
  };

  return {
    handleTextClick,
    handleMouseDown,
    handleMouseMoveWithAdd,
    handleMouseUpWithAdd,
    handleMouseLeave,
  };
}
