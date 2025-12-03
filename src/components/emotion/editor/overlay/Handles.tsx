// src/components/emotion/editor/overlay/Handles.tsx
"use client";

import type { EmotionInputSegment } from "../../types/emotion.types";
import { calcLineBoxesForSegment } from "../utils/calculateBoxesForSegment";
import type { RelativeRect } from "../utils/splitToCharRects";
import { HandleBar } from "./HandleBar";

const HANDLE_COLORS = [
  // index 0 → emerald (하이라이트 0번과 맞추기)
  "bg-emerald-500 dark:bg-emerald-400",
  // index 1 → blue
  "bg-blue-500 dark:bg-blue-400",
  // index 2 → violet
  "bg-violet-500 dark:bg-violet-400",
  // index 3 → amber
  "bg-amber-500 dark:bg-amber-400",
];

// 🔹 텍스트 밖으로 얼마나 뺄지
const OUTER_MARGIN = 0;

type HandlesProps = {
  text: string;
  segment: EmotionInputSegment;
  charRects: RelativeRect[];
  index: number;
  onStartDrag: (edge: "start" | "end") => void;
};

export function Handles({
  text,
  segment,
  charRects,
  index,
  onStartDrag,
}: HandlesProps) {
  if (charRects.length === 0) return null;

  const boxes = calcLineBoxesForSegment(text, segment, charRects);
  if (!boxes.length) return null;

  const first = boxes[0];
  const last = boxes[boxes.length - 1];

  const handleHeight = first.height * 0.6;
  const colorIndex = index % HANDLE_COLORS.length;
  const theme = HANDLE_COLORS[colorIndex];

  return (
    <>
      {/* 왼쪽 핸들: 텍스트 왼쪽 바깥으로 살짝 */}
      <HandleBar
        left={first.left - OUTER_MARGIN}
        top={first.top + first.height / 2}
        height={handleHeight}
        className={theme}
        onMouseDown={() => onStartDrag("start")}
      />

      {/* 오른쪽 핸들: 텍스트 오른쪽 바깥으로 살짝 */}
      <HandleBar
        left={last.right + OUTER_MARGIN}
        top={last.top + last.height / 2}
        height={handleHeight}
        className={theme}
        onMouseDown={() => onStartDrag("end")}
      />
    </>
  );
}
