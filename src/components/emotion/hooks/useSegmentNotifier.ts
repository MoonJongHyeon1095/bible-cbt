// src/components/emotion/hooks/useSegmentNotifier.ts
"use client";

import type {
  EmotionInputSegment,
  EmotionSegment,
} from "../types/emotion.types";

/**
 * segments 상태를 EmotionSegment로 변환해서 상위 onConfirm으로 알려주는 훅
 */
export function useSegmentNotifier(
  text: string,
  segments: EmotionInputSegment[],
  onConfirm?: (segments: EmotionSegment[]) => void
) {
  const notify = () => {
    if (!onConfirm) return;

    const result: EmotionSegment[] = segments.map((seg) => ({
      id: seg.id,
      text: text.slice(seg.start, seg.end),
      start: seg.start,
      end: seg.end,
      nodes: [],
    }));

    onConfirm(result);
  };

  return notify;
}
