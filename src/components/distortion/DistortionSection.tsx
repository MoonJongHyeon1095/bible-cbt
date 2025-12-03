// src/components/distortion/DistortionSection.tsx
"use client";

import { useState } from "react";
import { CognitiveErrorExplanationModal } from "./CognitveErrorExplanationModal";
import { DistortionCard } from "./DistortionCard";
import { COGNITIVE_ERROR_DESCRIPTIONS } from "./constants/cognitiveError";
import type { DistortionRequestPayload } from "./hooks/useDistortionAnalysis";

const COGNITIVE_ERROR_NAMES = [
  "흑백논리",
  "과잉일반화",
  "독심술",
  "파국화",
  "감정적 추론",
  "당위적 사고",
  "명명화",
  "개인화",
  "긍정 할인",
  "확대와 축소",
];

type DistortionSectionProps = {
  // 🔹 위쪽에서 내려줄 것들 (이미 ThreePrayerLayout에 다 있음)
  distortionValue: string;
  isLoading?: boolean;
  onChange: (v: string) => void;
  onReset: () => void;
  onRequestAnalysis: () => void;

  // 🔹 Emotion 단계에서 만들어둔 seed (없을 수도 있으니 null 허용)
  seed: DistortionRequestPayload | null;
};

export function DistortionSection({
  distortionValue,
  isLoading,
  onChange,
  onReset,
  onRequestAnalysis,
  seed,
}: DistortionSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedErrorName, setSelectedErrorName] = useState<string | null>(
    null
  );

  const handleOpenErrorModal = (name: string) => {
    setSelectedErrorName(name);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // seed가 없을 수도 있으니 방어적으로 뽑기
  const fullText = seed?.fullText ?? "";
  const segmentText = seed?.segmentText ?? "";
  const currentThought = seed?.currentThought;

  const userThought =
    currentThought?.belief || distortionValue || segmentText || fullText;

  const errorDescription =
    (selectedErrorName && COGNITIVE_ERROR_DESCRIPTIONS[selectedErrorName]) ??
    "";

  const handleReset = () => {
    onReset();
    setSelectedErrorName(null);
  };

  return (
    <>
      {/* 1) 인지오류 텍스트 + 자동분석 버튼 */}
      <DistortionCard
        value={distortionValue}
        onChange={onChange}
        onReset={handleReset}
        isLoading={isLoading}
        // seed 없으면 자동 분석 버튼 비활성화 (안 보내지는 게 안전)
        onRequestAnalysis={seed ? onRequestAnalysis : undefined}
      />

      {/* seed 없을 땐 아래 질문 UI/모달은 안 보여줘도 됨 */}
      {seed && (
        <>
          {/* 2) 인지오류 유형 버튼들 */}
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-500">
              어떤 종류의 인지오류에 더 가까운지 직접 골라보시고, 자세한 설명을
              보고 싶으면 눌러보세요.
            </p>
            <div className="flex flex-wrap gap-2">
              {COGNITIVE_ERROR_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleOpenErrorModal(name)}
                  className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-800 hover:bg-orange-100"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* 3) 인지오류 설명 모달 */}
          {selectedErrorName && (
            <CognitiveErrorExplanationModal
              open={modalOpen}
              errorName={selectedErrorName}
              errorDescription={errorDescription}
              userThought={userThought}
              userExperience={fullText}
              onClose={handleCloseModal}
            />
          )}
        </>
      )}
    </>
  );
}
