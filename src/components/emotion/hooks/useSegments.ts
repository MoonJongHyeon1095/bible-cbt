// src/components/emotion/hooks/useSegments.ts
"use client";

import { useEffect, useState } from "react";
import type { EmotionInputSegment } from "../types/emotion.types";
import { splitToInputSegments } from "../utils/splitToInputSegments";

/**
 * 텍스트를 "구간(segment)" 단위로 관리하는 훅.
 *
 * - EmotionInputSegment = { id: string; start: number; end: number }
 *   → 원본 text 문자열 안에서 [start, end) 인덱스 범위를 의미
 *
 * 이 훅의 책임:
 * 1. 초기에 text를 문장 단위 등으로 쪼개서 segment 리스트를 만든다.
 * 2. 외부에서 드래그한 결과에 따라 특정 segment의 start / end를 갱신한다.
 * 3. segment를 삭제 / 추가하는 기능을 제공한다.
 * 4. 항상 "start <= end" 이고, 정렬은 start 기준 오름차순이라는 불변식을 유지한다.
 */

// 👉 초기 구간을 "첫 문장 하나만" 쓰게 하는 헬퍼
function buildInitialSegments(text: string): EmotionInputSegment[] {
  const all = splitToInputSegments(text);
  if (!all.length) return [];
  // ✅ 자동으로는 첫 문장만 기본 세그먼트로 사용
  return [all[0]];
}

export function useSegments(text: string) {
  /**
   * segments 상태
   *
   * - 초기값은 buildInitialSegments(text)의 결과.
   *   (splitToInputSegments(text) 전체가 아니라 첫 문장만)
   */
  const [segments, setSegments] = useState<EmotionInputSegment[]>(() =>
    buildInitialSegments(text)
  );

  /**
   * text가 바뀔 때마다 기본 구간을 다시 계산.
   *
   * - 사용자가 EmotionInputFlow에서 새로운 텍스트를 입력하면
   *   SegmentEditor에도 text prop이 바뀜.
   * - 그때 기존 segments를 그대로 쓰면 인덱스가 다 꼬이기 때문에,
   *   항상 "현재 text 기준"으로 문장 구간을 새로 계산하되
   *   자동으로는 첫 문장 하나만 세팅한다.
   */
  useEffect(() => {
    setSegments(buildInitialSegments(text));
  }, [text]);

  /**
   * 드래그로 구간 start/end를 이동시킬 때 호출되는 함수.
   */
  const updateSegmentBoundary = (
    id: string,
    edge: "start" | "end",
    newIndex: number
  ) => {
    setSegments((prev) =>
      prev
        .map((seg) =>
          seg.id === id
            ? {
                ...seg,
                [edge]: newIndex,
              }
            : seg
        )
        .map((seg) => {
          if (seg.start > seg.end) {
            return { ...seg, start: seg.end, end: seg.start };
          }
          return seg;
        })
        .sort((a, b) => a.start - b.start)
    );
  };

  /**
   * 특정 id의 segment를 완전히 제거하는 함수.
   */
  const removeSegment = (id: string) => {
    setSegments((prev) => prev.filter((seg) => seg.id !== id));
  };

  /**
   * 새 구간을 추가하는 함수.
   *
   * - 이걸로 추가하는 세그먼트들은 자동/수동 구분 없이
   *   모두 segments 배열에 들어가므로,
   *   오버레이는 기존처럼 여러 개 동시에 뜬다.
   */
  const addSegment = (start = 0, end = text.length) => {
    if (start >= end) return;

    setSegments((prev) =>
      [...prev, { id: crypto.randomUUID(), start, end }].sort(
        (a, b) => a.start - b.start
      )
    );
  };

  return {
    segments,
    updateSegmentBoundary,
    removeSegment,
    addSegment,
  };
}
