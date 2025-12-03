// src/components/emotion/utils/getColorIndex.ts
const COLOR_COUNT = 4;

function hashString(str: string, mod: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % mod;
}

/**
 * 세그먼트 id 기반 기본 색을 뽑되,
 * 바로 이전 색(previousColorIndex)와 같으면 한 칸 회전해서 연속 중복을 줄인다.
 *
 * - segmentId: 세그먼트 고유 id
 * - previousColorIndex: 직전 세그먼트의 색 인덱스 (없으면 null)
 */
export function getColorIndexForSegment(
  segmentId: string,
  previousColorIndex: number | null
) {
  let base = hashString(segmentId, COLOR_COUNT);

  if (previousColorIndex !== null && previousColorIndex === base) {
    base = (base + 1) % COLOR_COUNT;
  }

  return base;
}
