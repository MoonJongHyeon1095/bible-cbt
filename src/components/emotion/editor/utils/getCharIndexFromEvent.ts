"use client";

import type React from "react";
import { findNearestIndex } from "./findNearestIndex";
import { RelativeRect } from "./splitToCharRects";

/**
 * 마우스 이벤트가 가리키는 지점에서
 * 가장 가까운 글자 인덱스를 찾아준다.
 */
export function getCharIndexFromEvent(
  e: React.MouseEvent<HTMLDivElement>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  charRects: RelativeRect[]
): number | null {
  const container = containerRef.current;
  if (!container || charRects.length === 0) return null;

  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const idx = findNearestIndex(charRects, x, y);
  if (idx == null || idx < 0 || idx >= charRects.length) return null;

  return idx;
}
