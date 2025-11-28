// src/components/emotion/hooks/useActiveSegmentSelection.ts
"use client";

import React, { useState } from "react";
import type { EmotionInputSegment } from "../types/emotion.types";
import type { RelativeRect } from "../utils/splitToCharRects";

/**
 * 텍스트 영역을 클릭했을 때
 * - 그 좌표가 포함된 글자 인덱스를 찾고
 * - 그 인덱스를 포함하는 세그먼트를 active로 만드는 훅
 */
export function useActiveSegmentSelection(
  segments: EmotionInputSegment[],
  charRects: RelativeRect[],
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!containerRef.current || charRects.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 글자 인덱스 찾기
    let foundIndex = -1;
    for (let i = 0; i < charRects.length; i++) {
      const c = charRects[i];
      if (!c) continue;
      if (x >= c.left && x <= c.right && y >= c.top && y <= c.top + c.height) {
        foundIndex = i;
        break;
      }
    }
    if (foundIndex === -1) return;

    const seg = segments.find(
      (s) => foundIndex >= s.start && foundIndex < s.end
    );
    if (!seg) return;

    setActiveSegmentId(seg.id);
    setActiveCharIndex(foundIndex); // 클릭한 위치도 같이 기억
  };

  return { activeSegmentId, activeCharIndex, setActiveSegmentId, handleClick };
}
