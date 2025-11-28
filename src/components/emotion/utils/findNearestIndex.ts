// src/components/emotion/utils/findNearestIndex.ts

/**
 * 
clientX, clientY는 마우스 커서 위치

각 글자의 중심점 (cx, cy)와의 거리 최소값을 찾음

가장 가까운 글자의 인덱스를 반환 → idx

그 인덱스로 updateSegmentBoundary 호출 → segment.start/end 갱신

즉, 마우스를 이 글자 근처로 끌어오면, 경계가 그 글자 인덱스에 붙는다는 의미.
 */
import type { RelativeRect } from "./splitToCharRects";

export function findNearestIndex(
  charRects: RelativeRect[],
  x: number, // 컨테이너 기준 X
  y: number // 컨테이너 기준 Y
): number {
  if (charRects.length === 0) return 0;

  let bestIdx = 0;
  let bestDist = Infinity;

  charRects.forEach((rect, idx) => {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = cx - x;
    const dy = cy - y;
    const dist = dx * dx + dy * dy;

    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = idx;
    }
  });

  return bestIdx;
}
