// src/components/emotion/utils/splitToInputSegments.ts
import type { EmotionInputSegment } from "../types/emotion.types";

export function splitToInputSegments(rawText: string): EmotionInputSegment[] {
  const result: EmotionInputSegment[] = [];
  if (!rawText.trim()) return result;

  let start = 0;

  const pushSegment = (endIndex: number) => {
    const text = rawText.slice(start, endIndex).trim();
    if (!text) return;
    result.push({
      id: crypto.randomUUID(),
      start,
      end: endIndex,
    });
  };

  for (let i = 0; i < rawText.length; i++) {
    const ch = rawText[i];

    const isBoundary = /[.!?…？！。]/.test(ch);
    const next = rawText[i + 1];
    const nextIsSpaceOrNewline = !next || /\s/.test(next);

    if (isBoundary && nextIsSpaceOrNewline) {
      const endIndex = i + 1;
      pushSegment(endIndex);

      // 다음 문장 시작 위치로 이동 (공백 스킵)
      let j = endIndex;
      while (j < rawText.length && /\s/.test(rawText[j])) j++;
      start = j;
      i = j - 1; // for 루프에서 ++ 되면 j부터 다시
    }
  }

  // 마지막 꼬리 처리
  if (start < rawText.length) {
    pushSegment(rawText.length);
  }

  return result;
}
