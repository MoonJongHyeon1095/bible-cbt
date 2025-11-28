// src/components/emotion/EmotionCard.tsx
"use client";

import { useState } from "react";
import { EmotionInputSection } from "./EmotionInputSection";
import { EmotionSegmentsSection } from "./EmotionSegmentSection";
import { EmotionPrimarySelectModal } from "./modal/EmotionPrimarySelectonModal";
import {
  EmotionRegulationChoiceModal,
  RegulationGoal,
} from "./modal/EmotionRegulatonChoiceModal";
import { EmotionIntensityModal } from "./modal/EmtionIntensityModal";
import type { EmotionSegment } from "./types/emotion.types";

type EmotionCardProps = {
  value: string;
  onChange: (text: string) => void;
  onReset: () => void;
  onSegmentsChange?: (segments: EmotionSegment[]) => void;
  onRequestDive?: (segment: EmotionSegment) => void;
};

type Mode = "input" | "segments";

// 모달에서 쓰던 것과 동일 매핑
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

export function EmotionCard({
  value,
  onChange,
  onReset,
  onSegmentsChange,
  onRequestDive,
}: EmotionCardProps) {
  const [mode, setMode] = useState<Mode>("input");

  const [selectedEmotionId, setSelectedEmotionId] = useState<string | null>(
    null
  );
  const [intensity, setIntensity] = useState<number | null>(null);
  const [regulationGoal, setRegulationGoal] =
    useState<RegulationGoal>("reduce");

  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [showIntensityModal, setShowIntensityModal] = useState(false);
  const [showRegulationModal, setShowRegulationModal] = useState(false);

  const handleReset = () => {
    onReset();
    setMode("input");
    setSelectedEmotionId(null);
    setIntensity(null);
    setRegulationGoal("reduce");
    setShowEmotionModal(false);
    setShowIntensityModal(false);
    setShowRegulationModal(false);
  };

  // 세그먼트/LLM 쪽으로 내려줄 감정 컨텍스트
  const emotionContext =
    selectedEmotionId && intensity !== null
      ? {
          emotionId: selectedEmotionId,
          emotionName: EMOTION_NAME_BY_ID[selectedEmotionId] ?? "이 감정",
          intensity,
          regulationGoal,
        }
      : undefined;

  return (
    <div className="relative rounded-2xl bg-white p-4 shadow-sm">
      {/* 제목 */}
      <h2 className="mb-1 text-lg font-semibold">감정 기술</h2>

      {/* 모드별 설명 문구 */}
      <p className="mb-2 text-xs text-gray-500">
        {mode === "input"
          ? "오늘 당신에게 무슨 일이 있었는지 들려주신다면, 우리는 같이 감정을 만드는 생각을 다뤄갈 수 있습니다."
          : "구간 단위로 자동사고를 추적할 수 있습니다."}
      </p>

      {/* 초기화 버튼 */}
      <button
        className="mb-2 text-xs text-gray-500 underline"
        onClick={handleReset}
      >
        초기화
      </button>

      {/* Step 1: 사건 기록 입력 */}
      {mode === "input" && (
        <EmotionInputSection
          value={value}
          onChange={onChange}
          onNext={() => {
            if (!value.trim()) return;
            setShowEmotionModal(true);
          }}
        />
      )}

      {/* Step 3: 세그먼트 모드 */}
      {mode === "segments" && (
        <EmotionSegmentsSection
          text={value}
          onSegmentsChange={onSegmentsChange}
          onRequestDive={onRequestDive}
          emotionContext={emotionContext}
        />
      )}

      {/* 감정 선택 모달 */}
      {showEmotionModal && (
        <EmotionPrimarySelectModal
          initialEmotionId={selectedEmotionId}
          onClose={() => setShowEmotionModal(false)}
          onConfirm={(emotionId) => {
            setSelectedEmotionId(emotionId);
            setShowEmotionModal(false);
            setShowIntensityModal(true);
          }}
        />
      )}

      {/* 강도 모달 */}
      {showIntensityModal && selectedEmotionId && (
        <EmotionIntensityModal
          emotionId={selectedEmotionId}
          initialValue={intensity ?? 20}
          onClose={() => setShowIntensityModal(false)}
          onConfirm={(value) => {
            setIntensity(value);
            setShowIntensityModal(false);
            setShowRegulationModal(true);
          }}
        />
      )}

      {/* “줄이고 싶나요?” 모달 */}
      {showRegulationModal && selectedEmotionId && intensity !== null && (
        <EmotionRegulationChoiceModal
          emotionId={selectedEmotionId}
          intensity={intensity}
          initialGoal={regulationGoal}
          onClose={() => setShowRegulationModal(false)}
          onConfirm={(goal) => {
            setRegulationGoal(goal);
            setShowRegulationModal(false);
            setMode("segments");
          }}
        />
      )}
    </div>
  );
}
