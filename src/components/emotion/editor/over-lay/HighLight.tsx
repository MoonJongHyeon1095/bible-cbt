// src/components/emotion/editor/over-lay/Highlight.tsx
"use client";

import type { EmotionSegment } from "../../types/emotion.types";
import type { RelativeRect } from "../../utils/splitToCharRects";

const COLOR_THEMES = [
  {
    bgLight: "bg-blue-100/40",
    bgDark: "bg-blue-500/30",
    borderLight: "border-blue-300",
    borderDark: "border-blue-400",
  },
  {
    bgLight: "bg-emerald-100/40",
    bgDark: "bg-emerald-500/30",
    borderLight: "border-emerald-300",
    borderDark: "border-emerald-400",
  },
  {
    bgLight: "bg-violet-100/40",
    bgDark: "bg-violet-500/30",
    borderLight: "border-violet-300",
    borderDark: "border-violet-400",
  },
  {
    bgLight: "bg-amber-100/40",
    bgDark: "bg-amber-500/30",
    borderLight: "border-amber-300",
    borderDark: "border-amber-400",
  },
];

type SegmentLike = EmotionSegment | { start: number; end: number };

function calcLineBoxes(segment: SegmentLike, charRects: RelativeRect[]) {
  const lines = new Map<number, any>();

  for (let i = segment.start; i < segment.end; i++) {
    const rect = charRects[i];
    if (!rect) continue;

    const key = Math.round(rect.top);
    const ex = lines.get(key);
    if (!ex) {
      lines.set(key, {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        height: rect.height,
      });
    } else {
      ex.left = Math.min(ex.left, rect.left);
      ex.right = Math.max(ex.right, rect.right);
    }
  }

  return [...lines.values()].sort((a, b) => a.top - b.top);
}

export function Highlight({
  segment,
  index,
  charRects,
  isActive = false,
}: {
  segment: SegmentLike;
  /** SegmentEditor에서 내려준 '색 인덱스' 또는 draft용 index */
  index: number;
  charRects: RelativeRect[];
  isActive?: boolean;
}) {
  const isRealSegment = (segment as EmotionSegment).id != null;

  // 실제 세그먼트는 index를 '색 인덱스'로 그대로 사용,
  // draftRange 등은 단순 mod로 회전
  const colorIndex = isRealSegment
    ? index % COLOR_THEMES.length
    : index % COLOR_THEMES.length;

  const theme = COLOR_THEMES[colorIndex];
  const boxes = calcLineBoxes(segment, charRects);

  return boxes.map((b, i) => (
    <div
      key={i}
      className={`
      absolute rounded-md pointer-events-none
      ${theme.bgLight} dark:${theme.bgDark}
      mix-blend-multiply dark:mix-blend-screen
      ${
        isActive
          ? `border-2 shadow-sm ${theme.borderLight} dark:${theme.borderDark}`
          : "border border-transparent"
      }
    `}
      style={{
        top: b.top,
        left: b.left,
        width: b.right - b.left,
        height: b.height,
        zIndex: 0,
      }}
    />
  ));
}
