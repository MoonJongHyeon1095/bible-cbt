// // src/components/emotion/utils/findNearestIndex.ts

// /**
//  *
// clientX, clientY는 마우스 커서 위치

// 각 글자의 중심점 (cx, cy)와의 거리 최소값을 찾음

// 가장 가까운 글자의 인덱스를 반환 → idx

// 그 인덱스로 updateSegmentBoundary 호출 → segment.start/end 갱신

// 즉, 마우스를 이 글자 근처로 끌어오면, 경계가 그 글자 인덱스에 붙는다는 의미.
//  */
// import type { RelativeRect } from "./splitToCharRects";

// export function findNearestIndex(
//   charRects: RelativeRect[],
//   x: number, // 컨테이너 기준 X
//   y: number // 컨테이너 기준 Y
// ): number {
//   if (charRects.length === 0) return 0;

//   let bestIdx = 0;
//   let bestDist = Infinity;

//   charRects.forEach((rect, idx) => {
//     const cx = rect.left + rect.width / 2;
//     const cy = rect.top + rect.height / 2;
//     const dx = cx - x;
//     const dy = cy - y;
//     const dist = dx * dx + dy * dy;

//     if (dist < bestDist) {
//       bestDist = dist;
//       bestIdx = idx;
//     }
//   });

//   return bestIdx;
// }

// src/components/emotion/utils/findNearestIndex.ts
import type { RelativeRect } from "./splitToCharRects";

/**
 * (x, y) 좌표에서 "가장 가까워 보이는 글자 인덱스"를 찾는다.
 *
 * 1. 먼저 세로(y) 기준으로 가장 가까운 줄(row)을 고르고
 * 2. 그 줄 안에서 가로(x) 기준으로 가장 가까운 글자를 고른다.
 *
 * 이렇게 해야 줄 끝 근처에서 아래로 드래그할 때
 * 첫 줄 맨 마지막 글자에 계속 붙어있지 않고
 * 자연스럽게 아래 줄로 넘어간다.
 */
export function findNearestIndex(
  charRects: RelativeRect[],
  x: number,
  y: number
): number {
  if (!charRects.length) return 0;

  // 1) 줄별로 그룹핑 (rect.top 을 반올림해서 같은 줄로 본다)
  const rowMap = new Map<
    number,
    { top: number; height: number; indices: number[] }
  >();

  for (let i = 0; i < charRects.length; i++) {
    const r = charRects[i];
    if (!r) continue;

    const key = Math.round(r.top);
    const existing = rowMap.get(key);
    if (!existing) {
      rowMap.set(key, {
        top: r.top,
        height: r.height,
        indices: [i],
      });
    } else {
      existing.indices.push(i);
    }
  }

  const rows = [...rowMap.values()].sort((a, b) => a.top - b.top);
  if (!rows.length) return 0;

  // 2) y 기준으로 가장 가까운 줄 선택
  let bestRow = rows[0];
  let bestRowDist = Infinity;

  for (const row of rows) {
    const cy = row.top + row.height / 2;
    const dy = Math.abs(y - cy);
    if (dy < bestRowDist) {
      bestRowDist = dy;
      bestRow = row;
    }
  }

  // 3) 그 줄 안에서 x 기준으로 가장 가까운 글자 선택
  let bestIdx = bestRow.indices[0];
  let bestXDist = Infinity;

  for (const idx of bestRow.indices) {
    const r = charRects[idx];
    if (!r) continue;
    const cx = (r.left + r.right) / 2;
    const dx = Math.abs(x - cx);
    if (dx < bestXDist) {
      bestXDist = dx;
      bestIdx = idx;
    }
  }

  return bestIdx;
}
