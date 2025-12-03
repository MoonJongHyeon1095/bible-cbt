"use client";

import { useMemo, useRef } from "react";
import { EmotionInputSegment } from "../../types/emotion.types";
import { getColorIndexForSegment } from "../utils/getColorIndex";

/**
 * 세그먼트 id별로 "고정된 색 인덱스"를 계산해 주는 훅.
 *
 * - 같은 id는 렌더가 여러 번 되어도 같은 색 인덱스를 유지.
 * - 인접 세그먼트끼리는 되도록 연속 색이 안 겹치도록 이전 색을 참고.
 */
export function useSegmentColors(
  segments: EmotionInputSegment[]
): Record<string, number> {
  const colorMapRef = useRef<Map<string, number>>(new Map());

  return useMemo(() => {
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
      if (!Object.prototype.hasOwnProperty.call(result, key)) {
        map.delete(key);
      }
    }

    return result;
  }, [segments]);
}
