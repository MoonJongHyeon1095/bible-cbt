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

  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);

  const colorMapRef = useRef<Map<string, number>>(new Map());

  const colorIndexById = useMemo(() => {
    const map = colorMapRef.current;
    const result: Record<string, number> = {};
    let prevColor: number | null = null;

    for (const seg of segments) {
      let color = map.get(seg.id) ?? null;
      if (color === null) {
        color = getColorIndexForSegment(seg.id, prevColor);
        map.set(seg.id, color);
      }
      result[seg.id] = color;
      prevColor = color;
    }

    for (const key of map.keys()) {
      if (!result[key]) {
        map.delete(key);
      }
    }

    return result;
  }, [segments]);

  // 🔎 여기서부터 디버그 로그들

  useEffect(() => {
    console.log(
      "[SEGMENTS]",
      segments.map((s) => ({
        id: s.id,
        start: s.start,
        end: s.end,
        text: text.slice(s.start, s.end),
      }))
    );
  }, [segments, text]);

  useEffect(() => {
    console.log("[CHAR_RECTS 0..4]", charRects.slice(0, 5));
  }, [charRects]);

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

    const idx = findNearestIndex(charRects, x, y);

    console.log("[CLICK]", {
      clientX: e.clientX,
      containerLeft: rect.left,
      x,
      y,
      idx,
      rect: charRects[idx],
    });

    return idx;
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
    <div
      className="
        flex flex-col gap-2
        rounded-2xl border border-slate-200
        bg-slate-50/70 px-4 py-4
        shadow-inner
      "
    >
      {/* + 구간 추가 버튼 */}
      <div className="flex justify-end">
        <button
          type="button"
          className={`
            group inline-flex items-center gap-1
            rounded-full border border-slate-200
            bg-white/90 px-3 py-1
            text-[11px] font-medium text-slate-700
            shadow-sm backdrop-blur
            transition-all
            hover:-translate-y-[1px] hover:bg-slate-50 hover:shadow-md
            ${isAdding ? "ring-1 ring-slate-300 bg-slate-50" : ""}
          `}
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

      {/* 실제 텍스트 / 하이라이트 영역 */}
      <div
        ref={containerRef}
        className={`
          relative mt-2
          rounded-xl border border-slate-200
          bg-white/90 p-3
          overflow-visible
          ${isAdding ? "cursor-crosshair" : "cursor-text"}
        `}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleTextClick}
      >
        {/* // pastel highlight behind text */}
        {charRects.length > 0 && (
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

            {draftRange && (
              <SegmentOverlay.Highlight
                segment={draftRange}
                charRects={charRects}
                index={segments.length}
                isActive={true}
              />
            )}
          </div>
        )}

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
