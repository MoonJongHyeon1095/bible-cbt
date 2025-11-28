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
export function useSegments(text: string) {
  /**
   * segments 상태
   *
   * - 초기값은 splitToInputSegments(text)의 결과.
   * - splitToInputSegments는 text를 문장 단위 등으로 나눠서
   *   [{ id, start, end }, ...] 형태로 만들어주는 유틸.
   *
   *   예: "첫 문장. 두 번째 문장."
   *   → [ {id:.., start:0, end:5}, {id:.., start:7, end:??}, ... ] 이런 식.
   */
  const [segments, setSegments] = useState<EmotionInputSegment[]>(() =>
    splitToInputSegments(text)
  );

  /**
   * text가 바뀔 때마다 기본 구간을 다시 계산.
   *
   * - 사용자가 EmotionInputFlow에서 새로운 텍스트를 입력하면
   *   SegmentEditor에도 text prop이 바뀜.
   * - 그때 기존 segments를 그대로 쓰면 인덱스가 다 꼬이기 때문에,
   *   항상 "현재 text 기준"으로 문장 구간을 새로 계산해서 덮어쓴다.
   */
  useEffect(() => {
    setSegments(splitToInputSegments(text));
  }, [text]);

  /**
   * 드래그로 구간 start/end를 이동시킬 때 호출되는 함수.
   *
   * @param id   : 드래그 중인 segment의 id
   * @param edge : "start"인지 "end"인지 (왼쪽 핸들이냐 오른쪽 핸들이냐)
   * @param newIndex : 글자 인덱스 (charRects로부터 계산된 최종 인덱스)
   *
   * 내부 동작:
   * 1. 해당 id의 segment를 찾아서 edge 쪽 인덱스만 newIndex로 교체
   * 2. 만약 start > end 같은 이상값이 생기면 start/end를 스왑해서 정리
   * 3. 전체 segments를 start 기준으로 재정렬 (겹치든 말든, 최소한 순서는 보장)
   */
  const updateSegmentBoundary = (
    id: string,
    edge: "start" | "end",
    newIndex: number
  ) => {
    setSegments((prev) =>
      // 1차 변환: 드래그한 segment의 start 또는 end만 교체

      prev
        .map((seg) =>
          seg.id === id
            ? {
                ...seg,
                // edge가 "start"면 start만, "end"면 end만 바뀜
                [edge]: newIndex,
              }
            : seg
        )
        // 2차 변환: start > end 같은 이상 케이스를 교정
        .map((seg) => {
          if (seg.start > seg.end) {
            // 잘못 들어온 경우에는 뒤집어서라도
            // "start는 항상 더 작거나 같다" 상태로 유지
            return { ...seg, start: seg.end, end: seg.start };
          }
          return seg;
        })
        // 3차 변환: start 기준으로 정렬
        .sort((a, b) => a.start - b.start)
    );
  };

  /**
   * 특정 id의 segment를 완전히 제거하는 함수.
   *
   * - 사용처: SegmentOverlay.Handles의 X 버튼 클릭 시.
   * - prev 배열에서 해당 id의 segment만 걸러낸다(filter).
   */
  const removeSegment = (id: string) => {
    setSegments((prev) => prev.filter((seg) => seg.id !== id));
  };

  /**
   * 새 구간을 추가하는 함수.
   *
   * @param start : 새 segment의 시작 인덱스 (기본 0)
   * @param end   : 새 segment의 끝 인덱스 (기본 text.length)
   *
   * - 기본값: 전체 텍스트를 덮는 구간 [0, text.length)
   * - 여러 구간이 있을 수 있기 때문에, 새 segment를 추가한 뒤
   *   전체를 start 기준으로 정렬해서 관리.
   * - start >= end 인 경우는 의미 없는 구간이므로 무시.
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
