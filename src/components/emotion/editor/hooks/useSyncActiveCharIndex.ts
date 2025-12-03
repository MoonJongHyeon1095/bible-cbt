"use client";

import type React from "react";
import { useEffect } from "react";
import { EmotionInputSegment } from "../../types/emotion.types";

type Params = {
  activeSegmentId: string | null;
  segments: EmotionInputSegment[];
  setActiveCharIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

/**
 * 부모에서 내려준 activeSegmentId가 바뀔 때,
 * 적당한 문자 인덱스(중간 지점)를 골라 activeCharIndex로 맞춰주는 훅.
 */
export function useSyncActiveCharIndex({
  activeSegmentId,
  segments,
  setActiveCharIndex,
}: Params) {
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

    // 이미 다른 곳에서 한 번 세팅된 값이 있으면 유지, 없으면 중간값으로
    setActiveCharIndex((prev) => prev ?? mid);
  }, [activeSegmentId, segments, setActiveCharIndex]);
}
