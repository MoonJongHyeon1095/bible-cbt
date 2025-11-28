// src/components/emotion/modal/EmotionIntensityModal.tsx
"use client";

import { useState } from "react";

const EMOTION_NAME_BY_ID: Record<string, string> = {
  joy: "기쁨",
  sad: "슬픔",
  anger: "분노",
  fear: "두려움",
  disgust: "혐오",
  surprise: "놀람",
  shame: "수치심",
  guilt: "죄책감",
  lonely: "외로움",
  achievement: "성취감",
  satisfaction: "만족감",
  despair: "절망",
  stuck: "답답함",
};

function getIntensityLabel(value: number): string {
  if (value === 0) return "0 (전혀 안 느껴짐)";
  if (value <= 25) return "조금 느껴지는 정도 - 불편하시군요";
  if (value <= 45) return "중간 정도 - 상당히 불편하시군요";
  if (value <= 65) return "상당히 강한 정도 - 매우 고통스러우시군요";
  if (value <= 85) return "매우 강렬한 정도 - 극심하게 고통스러우시군요";
  return "거의 최대에 가까운 정도 - 감정이 압도적으로 느껴집니다";
}

type Props = {
  emotionId: string;
  initialValue: number;
  onClose: () => void;
  onConfirm: (value: number) => void;
};

export function EmotionIntensityModal({
  emotionId,
  initialValue,
  onClose,
  onConfirm,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const emotionName = EMOTION_NAME_BY_ID[emotionId] ?? "이 감정";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold">감정 강도 측정</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 space-y-2">
          <p className="text-sm font-medium">
            지금 이 순간,{" "}
            <span className="font-bold text-indigo-700">"{emotionName}"</span>의
            강도는 얼마인가요?
          </p>

          <div className="flex items-baseline gap-1 text-lg font-semibold">
            <span>{value}</span>
            <span className="text-xs text-gray-500">/ 100</span>
          </div>

          <p className="text-[11px] text-gray-600">
            {getIntensityLabel(value)}
          </p>
        </div>

        {/* 슬라이더 */}
        <div className="mb-3 space-y-1">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-gray-500">
            <span>0 (전혀 안 느껴짐)</span>
            <span>50 (중간)</span>
            <span>100 (최대한 강함)</span>
          </div>
        </div>

        <p className="mb-4 text-[11px] text-gray-500">
          💡 정답은 없습니다. 지금 이 순간 당신이 느끼는 그대로를 표현해주세요.
        </p>

        <div className="flex justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-1.5 text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => onConfirm(value)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
