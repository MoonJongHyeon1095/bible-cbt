// src/components/emotion/editor/hooks/useSegments.ts
"use client";

import { useEffect, useState } from "react";
import type { EmotionInputSegment } from "../../types/emotion.types";
import { normalizeEdgeIndex } from "../utils/normalizeEdgeIndex";
import { splitToInputSegments } from "../utils/splitToInputSegments";

// 간단한 id 생성 헬퍼
function createSegmentId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `seg_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/**
 * 텍스트를 "구간(segment)" 단위로 관리하는 훅.
 *
 * - EmotionInputSegment = { id: string; start: number; end: number }
 *   → 원본 text 문자열 안에서 [start, end) 인덱스 범위를 의미
 */
export function useSegments(text: string) {
  // 🔹 초기값: splitToInputSegments 결과 중 "첫 구간 하나만"
  const [segments, setSegments] = useState<EmotionInputSegment[]>(() => {
    const all = splitToInputSegments(text);
    return all.length > 0 ? [all[0]] : [];
  });

  // 🔹 text가 바뀔 때도 동일하게 "첫 구간 하나만" 쓰도록
  useEffect(() => {
    const all = splitToInputSegments(text);
    setSegments(all.length > 0 ? [all[0]] : []);
  }, [text]);

  /**
   * 세그먼트 경계(start / end)를 업데이트.
   * - rawIdx 는 마우스에서 온 "그대로" 인덱스
   * - 여기서는 범위 클램프만 하고, 공백은 건드리지 않는다.
   */
  const updateSegmentBoundary = (
    segmentId: string,
    edge: "start" | "end",
    rawIdx: number
  ) => {
    setSegments((prev) =>
      prev
        .map((seg) => {
          if (seg.id !== segmentId) return seg;

          const clampedIdx = normalizeEdgeIndex(rawIdx, edge, text);

          if (edge === "start") {
            const nextStart = Math.min(clampedIdx, seg.end);
            return { ...seg, start: nextStart };
          } else {
            const nextEnd = Math.max(clampedIdx, seg.start);
            return { ...seg, end: nextEnd };
          }
        })
        .sort((a, b) => a.start - b.start)
    );
  };

  /**
   * 새 세그먼트 추가.
   * - start / end 그 자체로 사용 (0 ~ text.length 범위만 클램프)
   */
  const addSegment = (start: number, end: number) => {
    const seg: EmotionInputSegment = {
      id: createSegmentId(),
      start: Math.max(0, Math.min(start, text.length)),
      end: Math.max(0, Math.min(end, text.length)),
    };

    setSegments((prev) => [...prev, seg].sort((a, b) => a.start - b.start));
  };

  const removeSegment = (segmentId: string) => {
    setSegments((prev) => prev.filter((s) => s.id !== segmentId));
  };

  return {
    segments,
    updateSegmentBoundary,
    addSegment,
    removeSegment,
  };
}
