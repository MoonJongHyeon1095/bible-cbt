// src/components/emotion/editor/SegmentEditor.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useActiveSegmentSelection } from "../hooks/useActiveSegmentSelection";
import { useDragSegmentEdge } from "../hooks/useDragSegmentEdge";
import { useSegmentNotifier } from "../hooks/useSegmentNotifier";
import { useSegments } from "../hooks/useSegments";
import type {
  EmotionInputSegment,
  EmotionSegment,
} from "../types/emotion.types";
import { getColorIndexForSegment } from "../utils/getColorIndex";
import type { RelativeRect } from "../utils/splitToCharRects";
import { SegmentOverlay } from "./SegmentOverlay";
import { TextLayer } from "./TextLayer";

type SegmentEditorProps = {
  text: string;
  onConfirm?: (segments: EmotionSegment[]) => void;
  /** 세그먼트 아래 화살표(파고들기) 눌렀을 때 호출 */
  onDiveSegment?: (segment: EmotionSegment) => void;
  onActiveSegmentChange?: (segment: EmotionInputSegment | null) => void;
};

export function SegmentEditor({
  text,
  onConfirm,
  onDiveSegment,
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

  const {
    activeSegmentId,
    activeCharIndex,
    setActiveSegmentId,
    handleClick: handleSegmentClick,
  } = useActiveSegmentSelection(segments, charRects, containerRef);

  // 활성 세그먼트가 바뀔 때 상위(EmotionCard)에 알려주기
  useEffect(() => {
    if (!onActiveSegmentChange) return;

    onActiveSegmentChange(
      segments.find((s) => s.id === activeSegmentId) ?? null
    );
  }, [activeSegmentId, segments]);

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

    for (let i = 0; i < charRects.length; i++) {
      const c = charRects[i];
      if (!c) continue;
      if (x >= c.left && x <= c.right && y >= c.top && y <= c.top + c.height) {
        return i;
      }
    }
    return null;
  };

  // ───────────── 컨테이너 마우스 이벤트 ─────────────
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdding) return;

    const idx = getCharIndexFromEvent(e);
    if (idx == null) return;

    setDragStartIdx(idx);
    setDraftRange({ start: idx, end: idx + 1 });
    setActiveSegmentId(null);
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
    <div className="flex flex-col gap-2">
      <div
        ref={containerRef}
        className={`relative border rounded-md p-3 overflow-visible ${
          isAdding ? "cursor-crosshair" : "cursor-text"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={isAdding ? undefined : handleSegmentClick}
      >
        {/* pastel highlight behind text */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {segments.map((seg) => (
            <SegmentOverlay.Highlight
              key={seg.id}
              segment={seg}
              charRects={charRects}
              // 👉 index를 '색 인덱스'로 사용
              index={colorIndexById[seg.id] ?? 0}
              isActive={activeSegmentId === seg.id}
            />
          ))}

          {/* 드래그 중인 임시 구간 하이라이트 */}
          {draftRange && (
            <SegmentOverlay.Highlight
              segment={draftRange}
              charRects={charRects}
              // draft는 그냥 마지막 색 기준으로 하나 돌려 쓰기
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
        <div className="absolute inset-0 z-30 pointer-events-auto">
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
                    if (activeSegmentId === seg.id) {
                      setActiveSegmentId(null);
                    }
                    notify();
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

      {/* + 구간 추가 버튼 */}
      <div className="flex justify-between items-center text-xs">
        <button
          type="button"
          className={`rounded-md border px-2 py-1 text-xs hover:bg-gray-50 ${
            isAdding ? "bg-gray-100" : ""
          }`}
          onClick={() => {
            if (isAdding) {
              finishAddMode();
            } else {
              setIsAdding(true);
              setActiveSegmentId(null);
            }
          }}
        >
          {isAdding ? "구간 선택 취소" : "+ 구간 추가"}
        </button>

        {isAdding && (
          <span className="text-[11px] text-gray-400">
            텍스트를 드래그해서 새 구간을 선택하세요
          </span>
        )}
      </div>
    </div>
  );
}
