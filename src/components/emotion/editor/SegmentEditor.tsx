// src/components/emotion/editor/SegmentEditor.tsx
"use client";

import { useRef, useState } from "react";
import type {
  EmotionInputSegment,
  EmotionSegment,
} from "../types/emotion.types";
import { SegmentEditorTextBoxSection } from "./SegmentEditorTextBoxSection";
import { SegmentEditorToolbar } from "./SegmentEditorToolbar";
import { useDragSegmentEdge } from "./hooks/useDragSegmentEdge";
import { useSegmentEditorMouseHandlers } from "./hooks/useSegmentEditorMouseHandlers";
import { useSegmentNotifier } from "./hooks/useSegmentNotifier";
import { useSegments } from "./hooks/useSegments";
import { useSyncActiveCharIndex } from "./hooks/useSyncActiveCharIndex";
import { getCharIndexFromEvent } from "./utils/getCharIndexFromEvent";
import type { RelativeRect } from "./utils/splitToCharRects";

type SegmentEditorProps = {
  text: string;
  onConfirm?: (segments: EmotionSegment[]) => void;
  onDiveSegment?: (segment: EmotionSegment) => void;
  activeSegmentId: string | null;
  onActiveSegmentChange?: (segment: EmotionInputSegment | null) => void;
};

export function SegmentEditor({
  text,
  onConfirm,
  onDiveSegment,
  activeSegmentId,
  onActiveSegmentChange,
}: SegmentEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { segments, updateSegmentBoundary, addSegment, removeSegment } =
    useSegments(text);

  const notify = useSegmentNotifier(text, segments, onConfirm);

  const [charRects, setCharRects] = useState<RelativeRect[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);
  const [draftRange, setDraftRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [dragStartIdx, setDragStartIdx] = useState<number | null>(null);

  const { startDrag, handleMouseMove, handleMouseUp } = useDragSegmentEdge({
    text,
    charRects,
    segments,
    updateSegmentBoundary,
  });

  // 부모 activeSegmentId → 내부 activeCharIndex 동기화
  useSyncActiveCharIndex({
    activeSegmentId,
    segments,
    setActiveCharIndex,
  });

  const {
    handleTextClick,
    handleMouseDown,
    handleMouseMoveWithAdd,
    handleMouseUpWithAdd,
    handleMouseLeave,
  } = useSegmentEditorMouseHandlers({
    isAdding,
    setIsAdding,
    dragStartIdx,
    setDragStartIdx,
    draftRange,
    setDraftRange,
    containerRef,
    charRects,
    segments,
    addSegment,
    notify,
    onActiveSegmentChange,
    setActiveCharIndex,
    getCharIndexFromEvent: (e) =>
      getCharIndexFromEvent(e, containerRef, charRects),
    handleEdgeDragMove: handleMouseMove,
    handleEdgeDragUp: handleMouseUp,
  });

  return (
    <div className="w-full">
      <SegmentEditorToolbar
        isAdding={isAdding}
        onToggleAdd={() => {
          if (isAdding) {
            setIsAdding(false);
            setDraftRange(null);
            setDragStartIdx(null);
          } else {
            setIsAdding(true);
            onActiveSegmentChange?.(null);
            setActiveCharIndex(null);
          }
        }}
      />

      <SegmentEditorTextBoxSection
        text={text}
        containerRef={containerRef}
        charRects={charRects}
        onCharRectsChange={setCharRects}
        segments={segments}
        isAdding={isAdding}
        draftRange={draftRange}
        activeSegmentId={activeSegmentId}
        activeCharIndex={activeCharIndex}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) =>
          isAdding ? handleMouseMoveWithAdd(e) : handleMouseMove(e)
        }
        onMouseUp={handleMouseUpWithAdd}
        onMouseLeave={handleMouseLeave}
        onTextClick={handleTextClick}
        onDeleteSegment={(id) => {
          removeSegment(id);
          notify();
          onActiveSegmentChange?.(null);
          setActiveCharIndex(null);
        }}
        onStartDrag={startDrag}
        onDiveSegment={(seg) =>
          onDiveSegment?.({
            id: seg.id,
            start: seg.start,
            end: seg.end,
            text: text.slice(seg.start, seg.end),
            nodes: [],
          })
        }
      />
    </div>
  );
}
