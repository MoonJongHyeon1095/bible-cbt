// src/components/emotion/modal/EmotionPrimarySelectModal.tsx
"use client";

import { PRIMARY_EMOTIONS, PrimaryEmotion } from "../constants/primaryEmotions";

type Props = {
  initialEmotionId: string | null;
  onClose: () => void;
  onConfirm: (emotionId: string) => void;
};

export function EmotionPrimarySelectModal({
  initialEmotionId,
  onClose,
  onConfirm,
}: Props) {
  const renderGroup = (title: string, category: PrimaryEmotion["category"]) => {
    const items = PRIMARY_EMOTIONS.filter((e) => e.category === category);
    return (
      <section className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-600">{title}</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {items.map((emotion) => {
            // 이미 선택되어 있던 감정은 살짝 링으로 표시만 (모달은 카드 클릭 시 바로 닫힘)
            const isActive = initialEmotionId === emotion.id;

            const baseClasses =
              "group flex flex-col items-start rounded-2xl border px-3 py-2 text-left text-xs transition-all " +
              emotion.color;

            const activeClasses =
              "ring-2 ring-indigo-500 ring-offset-1 shadow-md scale-[1.01]";
            const inactiveClasses = "hover:shadow-sm hover:scale-[1.01]";

            return (
              <button
                key={emotion.id}
                type="button"
                onClick={() => {
                  onConfirm(emotion.id);
                  onClose(); // 카드 클릭하면 바로 선택 + 모달 닫기
                }}
                className={`${baseClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`}
              >
                <span className="mb-0.5 text-sm font-semibold">
                  {emotion.name}
                </span>
                <p className="text-[11px] text-gray-700">
                  {emotion.description}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  💭 {emotion.physical}
                </p>

                {/* 카드 아래로 샤르륵 펼쳐지는 설명 패널 */}
                <div
                  className={`
                    mt-2 w-full overflow-hidden rounded-xl bg-white/95 p-2
                    text-[10px] text-gray-700 shadow-sm
                    opacity-0 max-h-0 translate-y-1
                    transition-all duration-200
                    group-hover:opacity-100 group-hover:max-h-60 group-hover:translate-y-0
                  `}
                >
                  <p className="mb-1 font-semibold text-emerald-700">
                    ✨ 긍정적 측면
                  </p>
                  <ul className="mb-1 list-disc space-y-0.5 pl-4">
                    {emotion.positive.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>

                  <p className="mt-1 mb-1 font-semibold text-amber-700">
                    ⚠️ 주의할 점
                  </p>
                  <ul className="list-disc space-y-0.5 pl-4">
                    {emotion.caution.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      {/* 알파 느낌: 조금 더 넓고 여유 있게 */}
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white px-6 py-7 shadow-xl">
        {/* 우측 상단 X 버튼 – DialogContent 스타일 맞춰서 통일감 */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full
            bg-slate-100/80 text-slate-500 shadow-sm
            hover:bg-slate-200 hover:text-slate-700
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
            transition-colors
          "
        >
          <span className="text-sm">✕</span>
          <span className="sr-only">닫기</span>
        </button>

        <div className="mb-4 pr-10">
          {/* pr-10으로 X 버튼이랑 안 겹치게 여백 */}
          <h2 className="text-sm  text-gray-600">
            지금 이 순간{" "}
            <span className="font-semibold">가장 다루고 싶은 감정</span>을 한
            가지 골라주세요.
          </h2>
        </div>

        <div className="mb-5 rounded-2xl bg-indigo-50 px-4 py-3 text-[11px] text-gray-700">
          <p className="mt-1 text-indigo-700">
            각 감정 카드 위에 마우스를 올리면 이 감정의{" "}
            <span className="font-semibold">긍정적 역할</span>과{" "}
            <span className="font-semibold">주의할 점</span>이 아래에
            나타납니다.
          </p>
        </div>

        <div className="space-y-6 text-xs">
          {renderGroup("기본 정서", "basic")}
          {renderGroup("관계·도덕 정동", "relation")}
          {renderGroup("자기 관련 정동", "self")}
        </div>

        {/* 하단 취소 / 다음 버튼 제거 */}
      </div>
    </div>
  );
}
