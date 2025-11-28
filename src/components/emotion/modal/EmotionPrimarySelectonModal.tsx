// src/components/emotion/modal/EmotionPrimarySelectModal.tsx
"use client";

import { useState } from "react";

type PrimaryEmotion = {
  id: string;
  name: string;
  category: "basic" | "relation" | "self";
  description: string;
};

const PRIMARY_EMOTIONS: PrimaryEmotion[] = [
  // 기본 정서
  {
    id: "joy",
    name: "기쁨",
    category: "basic",
    description: "반가움, 즐거움, 감사함 등",
  },
  {
    id: "sad",
    name: "슬픔",
    category: "basic",
    description: "상실감, 눈물이 날 것 같은 느낌 등",
  },
  {
    id: "anger",
    name: "분노",
    category: "basic",
    description: "억울함, 화가 치밀어 오르는 느낌 등",
  },
  {
    id: "fear",
    name: "두려움",
    category: "basic",
    description: "불안, 위협을 감지하는 느낌 등",
  },
  {
    id: "disgust",
    name: "혐오",
    category: "basic",
    description: "꺼리고 피하고 싶은 느낌 등",
  },
  {
    id: "surprise",
    name: "놀람",
    category: "basic",
    description: "예상치 못한 일에 당황한 느낌 등",
  },

  // 관계·도덕 정동
  {
    id: "shame",
    name: "수치심",
    category: "relation",
    description: "남 앞에서 부끄럽고 숨고 싶은 느낌",
  },
  {
    id: "guilt",
    name: "죄책감",
    category: "relation",
    description: "내가 잘못했다는 자책, 미안함",
  },
  {
    id: "lonely",
    name: "외로움",
    category: "relation",
    description: "연결되지 못한 느낌, 혼자인 느낌",
  },

  // 자기 관련 정동
  {
    id: "achievement",
    name: "성취감",
    category: "self",
    description: "해냈다는 뿌듯함과 만족",
  },
  {
    id: "satisfaction",
    name: "만족감",
    category: "self",
    description: "지금 상태에 대한 편안함",
  },
  {
    id: "despair",
    name: "절망",
    category: "self",
    description: "희망이 없고 막막한 느낌",
  },
  {
    id: "stuck",
    name: "답답함",
    category: "self",
    description: "막혀 있고 풀리지 않는 느낌",
  },
];

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
  const [selectedId, setSelectedId] = useState<string | null>(initialEmotionId);

  const handleConfirm = () => {
    if (!selectedId) return;
    onConfirm(selectedId);
  };

  const renderGroup = (title: string, category: PrimaryEmotion["category"]) => {
    const items = PRIMARY_EMOTIONS.filter((e) => e.category === category);
    return (
      <section className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-600">{title}</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {items.map((emotion) => {
            const isActive = selectedId === emotion.id;
            return (
              <button
                key={emotion.id}
                type="button"
                onClick={() => setSelectedId(emotion.id)}
                className={`flex flex-col items-start rounded-2xl border px-3 py-2 text-left text-xs transition
                  ${
                    isActive
                      ? "border-indigo-500 bg-indigo-50"
                      : "bg-white hover:border-gray-400"
                  }`}
              >
                <span className="mb-0.5 text-sm font-semibold">
                  {emotion.name}
                </span>
                <p className="text-[11px] text-gray-600">
                  {emotion.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">자동사고 체크</h2>
            <p className="text-xs text-gray-600">
              당신이 느낀 감정을 <span className="font-semibold">1가지</span>{" "}
              선택해주세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 rounded-2xl bg-indigo-50 px-4 py-3 text-[11px] text-gray-700">
          <p>가장 다루고 싶은 주요 감정을 골라주세요.</p>
        </div>

        <div className="space-y-4 text-xs">
          {renderGroup("기본 정서", "basic")}
          {renderGroup("관계·도덕 정동", "relation")}
          {renderGroup("자기 관련 정동", "self")}
        </div>

        <div className="mt-5 flex justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-1.5 text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!selectedId}
            onClick={handleConfirm}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white disabled:opacity-40"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
