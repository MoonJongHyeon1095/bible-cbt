// src/components/emotion/editor/overlay/Highlight.tsx
"use client";

import type { EmotionSegment } from "../../types/emotion.types";
import { calcLineBoxesForSegment } from "../utils/calculateBoxesForSegment";
import type { RelativeRect } from "../utils/splitToCharRects";

const COLOR_THEMES = [
  {
    bgLight: "bg-emerald-100/40",
    bgDark: "bg-emerald-500/30",
    borderLight: "border-emerald-300",
    borderDark: "border-emerald-400",
  },
  {
    bgLight: "bg-blue-100/40",
    bgDark: "bg-blue-500/30",
    borderLight: "border-blue-300",
    borderDark: "border-blue-400",
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

type SegmentLike =
  | EmotionSegment
  | { start: number; end: number; trimEdges?: boolean };

export function Highlight({
  text,
  segment,
  index,
  charRects,
  isActive = false,
}: {
  text: string;
  segment: SegmentLike;
  index: number;
  charRects: RelativeRect[];
  isActive?: boolean;
}) {
  if (charRects.length === 0) return null;

  const colorIndex = index % COLOR_THEMES.length;
  const theme = COLOR_THEMES[colorIndex];

  const trimEdges = (segment as any).trimEdges === true;

  const boxes = calcLineBoxesForSegment(text, segment, charRects, {
    trimEdges,
  });

  return boxes.map((b, i) => (
    <div
      key={i}
      className={`absolute rounded-md pointer-events-none
        ${theme.bgLight} dark:${theme.bgDark}
        mix-blend-multiply dark:mix-blend-screen
        ${
          isActive
            ? `border-2 shadow-sm ${theme.borderLight} dark:${theme.borderDark}`
            : "border border-transparent"
        }`}
      style={{
        top: b.top,
        left: b.left,
        width: Math.ceil(b.right - b.left),
        height: b.height,
        zIndex: 0,
      }}
    />
  ));
}
