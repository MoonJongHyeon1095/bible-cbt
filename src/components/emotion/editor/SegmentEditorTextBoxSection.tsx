// src/components/emotion/editor/SegmentEditorTextBoxSection.tsx
"use client";

import type { EmotionInputSegment } from "../types/emotion.types";
import { SegmentEditorTextBox } from "./SegmentEditorTextBox";
import { DeleteBubble } from "./overlay/DeleteBubble";
import { DiveTriggerBubble } from "./overlay/DiveTriggerBubble";
import { Handles } from "./overlay/Handles";
import { Highlight } from "./overlay/Highlight";
import type { RelativeRect } from "./utils/splitToCharRects";

export function SegmentEditorTextBoxSection({
  text,
  containerRef,
  charRects,
  onCharRectsChange,
  segments,
  isAdding,
  draftRange,
  activeSegmentId,
  activeCharIndex,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTextClick,
  onDeleteSegment,
  onStartDrag,
  onDiveSegment,
  onActiveSegmentChange,
}: {
  text: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  charRects: RelativeRect[];
  onCharRectsChange: (rects: RelativeRect[]) => void;

  segments: EmotionInputSegment[];
  isAdding: boolean;
  draftRange: { start: number; end: number } | null;

  activeSegmentId: string | null;
  activeCharIndex: number | null;

  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onMouseMove: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave: React.MouseEventHandler<HTMLDivElement>;
  onTextClick: React.MouseEventHandler<HTMLDivElement>;

  onDeleteSegment: (segmentId: string) => void;
  onStartDrag: (segmentId: string, edge: "start" | "end") => void;
  onDiveSegment?: (segment: EmotionInputSegment) => void;
  onActiveSegmentChange?: (segment: EmotionInputSegment | null) => void;
}) {
  return (
    <div className="relative mt-2 rounded-xl border border-slate-200 bg-white">
      {/* 이 div가 padding 포함한 공통 좌표계 */}
      <div
        ref={containerRef}
        className={`relative p-3 ${
          isAdding ? "cursor-crosshair" : "cursor-text"
        }`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onClick={onTextClick}
      >
        <div className="relative z-10">
          <SegmentEditorTextBox
            text={text}
            containerRef={containerRef}
            onCharRectsChange={onCharRectsChange}
          />
        </div>

        {charRects.length > 0 && (
          <>
            <div className="pointer-events-none absolute inset-0 z-0">
              {segments.map((seg, idx) => (
                <Highlight
                  key={seg.id}
                  text={text}
                  segment={seg}
                  index={idx}
                  charRects={charRects}
                  isActive={activeSegmentId === seg.id}
                />
              ))}

              {draftRange && (
                <Highlight
                  key="draft-range"
                  text={text}
                  segment={{ ...draftRange, trimEdges: true }}
                  index={segments.length}
                  charRects={charRects}
                  isActive
                />
              )}
            </div>

            <div className="pointer-events-auto absolute inset-0 z-20">
              {segments.map((seg, idx) => (
                <div
                  key={seg.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onActiveSegmentChange?.(seg);
                  }}
                >
                  <Handles
                    text={text}
                    segment={seg}
                    charRects={charRects}
                    index={idx}
                    onStartDrag={(edge) => onStartDrag(seg.id, edge)}
                  />

                  {activeSegmentId === seg.id && (
                    <DeleteBubble
                      segment={seg}
                      charRects={charRects}
                      index={idx}
                      activeCharIndex={activeCharIndex}
                      onDelete={() => onDeleteSegment(seg.id)}
                    />
                  )}

                  {activeSegmentId === seg.id && onDiveSegment && (
                    <DiveTriggerBubble
                      segment={seg}
                      charRects={charRects}
                      index={idx}
                      activeCharIndex={activeCharIndex}
                      onDive={() => onDiveSegment(seg)}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
