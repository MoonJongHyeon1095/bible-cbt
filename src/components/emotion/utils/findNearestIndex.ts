// src/components/emotion/utils/findNearestIndex.ts
import type { RelativeRect } from "./splitToCharRects";

/**
 * (x, y) 좌표에서 "가장 자연스러운 글자 인덱스"를 찾는다.
 *
 * 1. 줄(row)을 y 기준으로 고르고
 * 2. 그 줄 안에서 x 기준으로 가장 가까운 글자를 찾되,
 *    거리 비슷하면 **왼쪽에 있는 글자**를 우선한다.
 */
export function findNearestIndex(
  charRects: RelativeRect[],
  x: number,
  y: number
): number {
  if (!charRects.length) return 0;

  // 1) 줄별로 그룹핑 (rect.top을 반올림해서 같은 줄로 본다)
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
  //    - 항상 왼쪽→오른쪽 순으로 정렬해 두고
  //    - 거리 비슷하면 왼쪽(cx가 더 작은 것)을 우선
  const centers = bestRow.indices
    .map((idx) => {
      const r = charRects[idx]!;
      const cx = (r.left + r.right) / 2;
      return { idx, cx };
    })
    .sort((a, b) => a.cx - b.cx); // 왼쪽→오른쪽

  // x가 줄의 가장 왼쪽보다 왼쪽이면 맨 앞, 가장 오른쪽보다 오른쪽이면 맨 뒤
  if (x <= centers[0].cx) return centers[0].idx;
  if (x >= centers[centers.length - 1].cx)
    return centers[centers.length - 1].idx;

  // 그 외에는 "가장 가까운 cx", 거리 같으면 더 왼쪽인(cx 작은) 글자
  let best = centers[0];
  let bestDist = Math.abs(x - best.cx);

  for (let i = 1; i < centers.length; i++) {
    const c = centers[i];
    const dist = Math.abs(x - c.cx);

    if (dist < bestDist) {
      best = c;
      bestDist = dist;
    } else if (dist === bestDist && c.cx < best.cx) {
      // 거리 같으면 왼쪽에 있는 글자 우선
      best = c;
    }
  }

  return best.idx;
}
