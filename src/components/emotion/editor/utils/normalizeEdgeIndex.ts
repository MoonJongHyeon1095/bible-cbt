// src/components/emotion/editor/utils/normalizeEdgeIndex.ts

/**
 * 드래그로 얻은 raw 인덱스를
 * - 0 ~ text.length 범위 안으로만 클램프해 주는 유틸.
 * 공백 스킵 / trim 같은 건 전혀 안 한다.
 */
export function normalizeEdgeIndex(
  rawIndex: number,
  _edge: "start" | "end",
  text: string
): number {
  if (rawIndex < 0) return 0;
  if (rawIndex > text.length) return text.length;
  return rawIndex;
}
