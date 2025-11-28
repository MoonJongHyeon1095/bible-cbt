// src/components/emotion/modal/EmotionRegulationChoiceModal.tsx
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

export type RegulationGoal = "reduce" | "accept";

type Props = {
  emotionId: string;
  intensity: number; // 0~100
  initialGoal?: RegulationGoal;
  onClose: () => void;
  onConfirm: (goal: RegulationGoal) => void;
};

export function EmotionRegulationChoiceModal({
  emotionId,
  intensity,
  initialGoal = "reduce",
  onClose,
  onConfirm,
}: Props) {
  const [goal, setGoal] = useState<RegulationGoal>(initialGoal);
  const emotionName = EMOTION_NAME_BY_ID[emotionId] ?? "이 감정";

  const subtitleText =
    goal === "reduce"
      ? "✓ 감정을 적절한 수준으로 조절하는 방향으로 진행됩니다"
      : "✓ 현재 상태를 인정하며 진행됩니다";

  const subtitleClass =
    goal === "reduce"
      ? "bg-sky-50 text-sky-700 border border-sky-100"
      : "bg-emerald-50 text-emerald-700 border border-emerald-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-5 shadow-xl">
        {/* 헤더 */}
        <div className="mb-4 flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-indigo-500">
              중앙 단계
            </p>
            <h2 className="text-sm font-semibold text-slate-900">
              감정 조절 방향 선택
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-400 transition hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 질문 박스 */}
        <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-center text-[13px] font-semibold text-indigo-800">
          <span className="font-bold">"{emotionName}"</span>의 강도(
          {intensity}점)를 줄이고 싶으신가요?
        </div>

        {/* 선택 버튼들 */}
        <div className="mb-3 grid grid-cols-2 gap-2 text-[13px]">
          <button
            type="button"
            onClick={() => setGoal("reduce")}
            className={[
              "rounded-2xl px-3 py-4 font-semibold transition",
              goal === "reduce"
                ? "border border-indigo-500 bg-indigo-500 text-white shadow-md"
                : "border border-slate-200 bg-white text-slate-800 hover:border-indigo-300",
            ].join(" ")}
          >
            네, 줄이고 싶습니다
          </button>

          <button
            type="button"
            onClick={() => setGoal("accept")}
            className={[
              "rounded-2xl px-3 py-4 font-semibold transition",
              goal === "accept"
                ? "border border-indigo-500 bg-indigo-500 text-white shadow-md"
                : "border border-slate-200 bg-white text-slate-800 hover:border-indigo-300",
            ].join(" ")}
          >
            아니요, 이 정도면 괜찮습니다
          </button>
        </div>

        {/* 상태 설명 박스 */}
        <div
          className={`mb-4 rounded-2xl px-4 py-3 text-center text-[11px] font-medium ${subtitleClass}`}
        >
          {subtitleText}
        </div>

        {/* CTA */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onConfirm(goal)}
            className="w-full rounded-2xl bg-indigo-500 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            다음 단계로 진행하기 →
          </button>
        </div>
      </div>
    </div>
  );
}
