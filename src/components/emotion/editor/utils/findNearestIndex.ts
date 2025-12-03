import type { RelativeRect } from "./splitToCharRects";

/**
 * (x, y) 좌표에서 "가장 자연스러운 글자 인덱스"를 찾는다.
 *
 * 1. 줄(row)을 y 기준으로 고르고
 * 2. 그 줄 안에서 x 기준으로 가장 가까운 글자를 찾되,
 *    거리 비슷하면 **왼쪽에 있는 글자**를 우선한다.
 * 3. x가 줄의 오른쪽 끝/왼쪽 끝을 충분히 벗어나면
 *    위/아래 줄로 스냅(snap)시킨다.
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
  let bestRowIndex = 0;
  let bestRowDist = Infinity;

  rows.forEach((row, idx) => {
    const cy = row.top + row.height / 2;
    const dy = Math.abs(y - cy);
    if (dy < bestRowDist) {
      bestRowDist = dy;
      bestRow = row;
      bestRowIndex = idx;
    }
  });

  // 현재 줄의 x 중심값들 계산
  const centers = bestRow.indices
    .map((idx) => {
      const r = charRects[idx]!;
      const cx = (r.left + r.right) / 2;
      return { idx, cx };
    })
    .sort((a, b) => a.cx - b.cx); // 왼쪽→오른쪽

  if (!centers.length) return 0;

  const first = centers[0];
  const last = centers[centers.length - 1];

  // 🔧 "줄 경계 넘어가기" 허용 폭 (줄 높이의 0.6배 정도)
  const overflow = bestRow.height * 0.6;

  // 2-1) 오른쪽 끝을 충분히 넘으면 아래 줄 첫 글자로 스냅
  if (
    x > last.cx + overflow &&
    bestRowIndex < rows.length - 1 // 아래 줄 있음
  ) {
    const nextRow = rows[bestRowIndex + 1];
    const nextCenters = nextRow.indices
      .map((idx) => {
        const r = charRects[idx]!;
        const cx = (r.left + r.right) / 2;
        return { idx, cx };
      })
      .sort((a, b) => a.cx - b.cx);

    return nextCenters[0].idx; // 아래 줄의 첫 글자
  }

  // 2-2) 왼쪽 끝을 충분히 넘으면 윗줄 마지막 글자로 스냅 (보너스)
  if (x < first.cx - overflow && bestRowIndex > 0) {
    const prevRow = rows[bestRowIndex - 1];
    const prevCenters = prevRow.indices
      .map((idx) => {
        const r = charRects[idx]!;
        const cx = (r.left + r.right) / 2;
        return { idx, cx };
      })
      .sort((a, b) => a.cx - b.cx);

    return prevCenters[prevCenters.length - 1].idx; // 윗줄의 마지막 글자
  }

  // 3) 그 줄 안에서 x 기준으로 가장 가까운 글자 선택
  if (x <= first.cx) return first.idx;
  if (x >= last.cx) return last.idx;

  let best = first;
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
