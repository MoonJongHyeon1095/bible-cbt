// src/components/emotion/modal/EmotionIntensityModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
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
  if (value <= 25) return "조금 느껴지는 정도 - 불편을 느낍니다.";
  if (value <= 45) return "중간 정도 - 상당한 불편을 느낍니다.";
  if (value <= 65) return "상당히 강한 정도 - 매우 고통스럽습니다.";
  if (value <= 85) return "매우 강렬한 정도 - 극심하게 고통스럽습니다.";
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
      {/* 세로로 조금 더 크고, 여백 넉넉하게 */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white px-8 py-8 shadow-2xl">
        {/* 닫기 버튼 – 디자인 시스템 계열 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full
                     bg-slate-100/80 text-slate-500 shadow-sm
                     hover:bg-slate-200 hover:text-slate-700
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                     transition-colors"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">닫기</span>
        </button>

        {/* 헤더 */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-slate-900">
              감정 강도 측정
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              선택한 감정:{" "}
              <span className="font-semibold text-pink-600">
                "{emotionName}"
              </span>
            </p>
          </div>
        </div>

        {/* 뇌의 비밀 박스 */}
        <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4">
          <p className="mb-2 text-sm font-semibold text-sky-800">
            뇌의 비밀 한 가지
          </p>
          <p className="text-sm leading-relaxed text-slate-800">
            많은 사람들이 부정적인 감정을 느낄 때{" "}
            <span className="font-semibold">"그냥 기분이 안 좋아"</span>
            라고만 생각합니다. 하지만 심리학 연구에 따르면,{" "}
            <span className="font-semibold">
              감정을 구체적으로 인식하고 숫자로 표현하는 순간 뇌의 편도체(감정
              중추)가 진정되기 시작합니다.
            </span>
          </p>
          <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
            대표 연구
            <br />
            Lieberman et al. (2007, Psychological Science)
            <br />
            Torre & Lieberman (2018, Emotion Review)
          </p>
        </div>

        {/* 질문 + 점수 – 중앙 정렬 */}
        <div className="mb-5 text-center">
          <p className="text-base font-medium text-slate-900">
            지금 이 순간,{" "}
            <span className="font-bold text-indigo-700">"{emotionName}"</span>의
            강도는 얼마인가요?
          </p>

          {/* 점수 박스 */}
          <div className="mt-5 inline-flex flex-col items-center rounded-2xl border border-rose-300 bg-white px-10 py-6 shadow-sm">
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-5xl font-extrabold text-transparent">
              {value}
            </span>
            <span className="mt-1 text-xs text-slate-500">/ 100</span>
          </div>

          <p className="mt-4 text-sm text-slate-700">
            {getIntensityLabel(value)}
          </p>
        </div>

        {/* 슬라이더 – 좌우 폭 줄여서 중앙 정렬 */}
        <div className="mb-4 space-y-2">
          <div className="mx-auto w-full max-w-sm">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-2 flex justify-between text-[11px] text-gray-500">
              <span>0 (전혀 안 느껴짐)</span>
              <span>50 (중간)</span>
              <span>100 (최대한 강함)</span>
            </div>
          </div>
        </div>

        <p className="mb-6 text-center text-xs text-gray-500">
          💡 <span className="font-medium">정답은 없습니다.</span> 지금 이 순간
          당신이 느끼는 그대로를 표현해주세요.
        </p>

        {/* CTA 버튼 – Button 기본 그라데이션만 사용, 크기만 조정 */}
        <Button
          className="mt-1 w-full py-3.5 text-base font-semibold shadow-md hover:shadow-lg disabled:shadow-none"
          onClick={() => onConfirm(value)}
          disabled={value === 0}
        >
          {value === 0
            ? "강도를 선택해주세요"
            : `"${emotionName}" ${value}점으로 계속하기 →`}
        </Button>
      </div>
    </div>
  );
}
