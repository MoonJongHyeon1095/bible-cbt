// src/components/emotion/editor/utils/calcLineBoxesForSegment.ts
import type { RelativeRect } from "./splitToCharRects";

export type LineBox = {
  top: number;
  left: number;
  right: number;
  height: number;
};

type Options = {
  trimEdges?: boolean;
};

export function calcLineBoxesForSegment(
  text: string,
  segment: { start: number; end: number },
  charRects: RelativeRect[],
  options: Options = {}
): LineBox[] {
  const { trimEdges = false } = options;

  const boxes: LineBox[] = [];
  if (charRects.length === 0) return boxes;

  const maxIndex = charRects.length - 1;
  let safeStart = Math.max(0, Math.min(segment.start, maxIndex));
  let safeEnd = Math.max(
    safeStart + 1,
    Math.min(segment.end, charRects.length)
  );

  // 🔵 오직 trimEdges=true인 경우에만 공백 제거
  if (trimEdges) {
    while (safeEnd > safeStart + 1 && /\s/.test(text[safeEnd - 1] ?? "")) {
      safeEnd--;
    }
    while (safeStart < safeEnd - 1 && /\s/.test(text[safeStart] ?? "")) {
      safeStart++;
    }
  }

  let current: LineBox | null = null;

  for (let i = safeStart; i < safeEnd; i++) {
    const rect = charRects[i];
    if (!rect) continue;

    if (!current) {
      current = {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        height: rect.height,
      };
      continue;
    }

    const sameLine = Math.abs(rect.top - current.top) < rect.height * 0.6;

    if (!sameLine) {
      boxes.push(current);
      current = {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        height: rect.height,
      };
    } else {
      current.left = Math.min(current.left, rect.left);
      current.right = Math.max(current.right, rect.right);
      current.height = Math.max(current.height, rect.height);
    }
  }

  if (current) boxes.push(current);
  return boxes;
}
