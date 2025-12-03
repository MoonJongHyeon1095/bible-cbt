// src/components/three-prayer/ThreePrayerLayout.tsx
"use client";

import type { ThreePrayerDraft } from "@/types/draft";
import { useRef, useState } from "react";
import {
  useDistortionAnalysis,
  type DistortionRequestPayload,
} from "../distortion/hooks/useDistortionAnalysis";
import { ThreePrayerCardsSection } from "./ThreePrayerCardsSection";
import { ThreePrayerFooter } from "./ThreePrayerFooter";
import { ThreePrayerHeader } from "./ThreePrayerHeader";
import { ThreePrayerStepIndicator } from "./ThreePrayerStepIndicator";

export type Step = "emotion" | "distortion" | "alternative";
export const stepOrder: Step[] = ["emotion", "distortion", "alternative"];

type Props = {
  draft: ThreePrayerDraft;
  setDraft: React.Dispatch<React.SetStateAction<ThreePrayerDraft>>;
  onResetAll: () => void;
};

export function ThreePrayerLayout({ draft, setDraft }: Props) {
  const [step, setStep] = useState<Step>("emotion");
  const currentIndex = stepOrder.indexOf(step);

  // 🔹 왼쪽 인지오류 카드 DOM 참조
  const distortionCardRef = useRef<HTMLDivElement>(null);

  const {
    distortionText,
    setDistortionText,
    isLoading: isDistortionLoading,
    reset: resetDistortion,
    runAnalysis,
  } = useDistortionAnalysis();

  const [distortionSeed, setDistortionSeed] =
    useState<DistortionRequestPayload | null>(null);

  const getStepLabel = (s: Step) => {
    if (s === "emotion") return "감정 기술 / 자동사고 체크";
    if (s === "distortion") return "사탄의 거짓말 - 인지오류 검토";
    return "성경 말씀 - 대안사고 구성";
  };

  const getCardWrapperClass = (s: Step) => {
    const base = "transition-all duration-300 ease-out transform origin-top";
    const active = "scale-100 md:scale-105 opacity-100";
    const inactive = "scale-95 opacity-40 pointer-events-none";
    return `${base} ${step === s ? active : inactive}`;
  };

  const getGridColsClass = (s: Step) => {
    switch (s) {
      case "emotion":
        // ✅ Emotion 단계: 가운데 카드 확실하게 강조
        // 좌 0.6 / 중앙 2.0 / 우 0.6
        return "md:grid-cols-[minmax(0,0.6fr)_minmax(0,2fr)_minmax(0,0.6fr)]";
      case "distortion":
        // ✅ Distortion 단계: 왼쪽 크게
        return "md:grid-cols-[minmax(0,2fr)_minmax(0,0.6fr)_minmax(0,0.6fr)]";
      case "alternative":
        // ✅ Alternative 단계: 오른쪽 크게
        return "md:grid-cols-[minmax(0,0.6fr)_minmax(0,0.6fr)_minmax(0,2fr)]";
      default:
        return "md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)_minmax(0,0.8fr)]";
    }
  };

  // 🔹 공통: step이 distortion으로 바뀐 직후 왼쪽 카드로 스크롤
  const focusDistortionCard = () => {
    if (!distortionCardRef.current) return;
    // next frame에서 실행해서 레이아웃 반영 후 스크롤
    requestAnimationFrame(() => {
      distortionCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  // Step indicator에서 직접 단계 바꿀 때도 적용
  const handleChangeStep = (next: Step) => {
    setStep(next);
    if (next === "distortion") {
      focusDistortionCard();
    }
  };

  // Emotion → Distortion로 넘길 때
  const handleMoveThoughtToDistortion = (payload: DistortionRequestPayload) => {
    setDistortionSeed(payload);
    const belief = payload.currentThought.belief ?? "";
    setDistortionText(belief);
    setDraft((d) => ({ ...d, distorted: belief }));
    setStep("distortion");
    focusDistortionCard();
  };

  const handleDistortionChange = (v: string) => {
    setDistortionText(v);
    setDraft((d) => ({ ...d, distorted: v }));
  };

  const handleDistortionReset = () => {
    resetDistortion();
    setDraft((d) => ({ ...d, distorted: "" }));
  };

  const handleRequestDistortionAnalysis = () => {
    if (!distortionSeed) return;
    runAnalysis(distortionSeed);
  };

  const collapsedEmotionBelief = distortionSeed?.currentThought.belief ?? "";

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl">
        <ThreePrayerHeader />

        <ThreePrayerStepIndicator
          step={step}
          stepOrder={stepOrder}
          currentIndex={currentIndex}
          getStepLabel={getStepLabel}
          onChangeStep={handleChangeStep}
        />

        <ThreePrayerCardsSection
          step={step}
          getCardWrapperClass={getCardWrapperClass}
          getGridColsClass={getGridColsClass}
          distortionCardRef={distortionCardRef}
          // Emotion
          emotionValue={draft.prayer}
          onEmotionChange={(v) => setDraft((d) => ({ ...d, prayer: v }))}
          onEmotionReset={() => setDraft((d) => ({ ...d, prayer: "" }))}
          onMoveThoughtToDistortion={handleMoveThoughtToDistortion}
          collapsedEmotionBelief={collapsedEmotionBelief}
          // Distortion
          distortionSeed={distortionSeed}
          distortionValue={distortionText}
          onDistortionChange={handleDistortionChange}
          onDistortionReset={handleDistortionReset}
          isDistortionLoading={isDistortionLoading}
          onRequestDistortionAnalysis={handleRequestDistortionAnalysis}
          // Alternative
          alternativeValue={draft.truth}
          onAlternativeChange={(v) => setDraft((d) => ({ ...d, truth: v }))}
          onAlternativeReset={() => setDraft((d) => ({ ...d, truth: "" }))}
        />

        <ThreePrayerFooter />
      </div>
    </main>
  );
}
