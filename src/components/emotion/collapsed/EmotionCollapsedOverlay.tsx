// src/components/emotion/collapsed/EmotionCollapsedOverlay.tsx
"use client";

type Props = {
  beliefText?: string;
};

export function EmotionCollapsedOverlay({ beliefText }: Props) {
  const hasBelief = !!beliefText && beliefText.trim().length > 0;

  return (
    // 🔹 이제는 레이아웃을 차지하는 일반 블록
    <div className="flex flex-col items-center justify-center py-6 text-center">
      {hasBelief ? (
        <div className="max-w-[80%]">
          <span className="mb-1 block text-4xl font-serif leading-none text-gray-700">
            “
          </span>
          <p className="whitespace-pre-wrap font-serif text-[15px] font-semibold leading-relaxed text-gray-900">
            {beliefText}
          </p>
          <span className="mt-1 block text-4xl font-serif leading-none text-gray-700">
            ”
          </span>
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-gray-500">
          아직 인지오류로 넘긴 자동사고가 없습니다.
        </p>
      )}
    </div>
  );
}
