// src/components/three-prayer/ThreePrayerCardsSection.tsx
"use client";

import { RefObject } from "react";
import { AlternativeThoughtCard } from "../alternative/AlternativeThoughtCard";
import { DistortionSection } from "../distortion/DistortionSection";
import type { DistortionRequestPayload } from "../distortion/hooks/useDistortionAnalysis";
import { EmotionCard } from "../emotion";
import type { Step } from "./ThreePrayerLayout";

type Props = {
  step: Step;
  getCardWrapperClass: (s: Step) => string;
  getGridColsClass: (s: Step) => string;

  distortionCardRef?: RefObject<HTMLDivElement | null>;

  // Emotion ...
  emotionValue: string;
  onEmotionChange: (v: string) => void;
  onEmotionReset: () => void;
  onMoveThoughtToDistortion: (payload: DistortionRequestPayload) => void;
  collapsedEmotionBelief?: string;

  // Distortion ...
  distortionSeed: DistortionRequestPayload | null;
  distortionValue: string;
  onDistortionChange: (v: string) => void;
  onDistortionReset: () => void;
  isDistortionLoading: boolean;
  onRequestDistortionAnalysis: () => void;

  // Alternative ...
  alternativeValue: string;
  onAlternativeChange: (v: string) => void;
  onAlternativeReset: () => void;
};

export function ThreePrayerCardsSection({
  step,
  getCardWrapperClass,
  getGridColsClass,
  distortionCardRef,
  // emotion
  emotionValue,
  onEmotionChange,
  onEmotionReset,
  onMoveThoughtToDistortion,
  collapsedEmotionBelief,
  // distortion
  distortionSeed,
  distortionValue,
  onDistortionChange,
  onDistortionReset,
  isDistortionLoading,
  onRequestDistortionAnalysis,
  // alternative
  alternativeValue,
  onAlternativeChange,
  onAlternativeReset,
}: Props) {
  return (
    <section
      className={`mt-4 grid grid-cols-1 items-start gap-5 md:gap-7 ${getGridColsClass(
        step
      )}`}
    >
      {/* Distortion (왼쪽) */}
      <div className="px-1 sm:px-2 lg:px-3">
        <div
          ref={distortionCardRef}
          className={getCardWrapperClass("distortion")}
        >
          <DistortionSection
            distortionValue={distortionValue}
            onChange={onDistortionChange}
            onReset={onDistortionReset}
            isLoading={isDistortionLoading}
            onRequestAnalysis={onRequestDistortionAnalysis}
            seed={distortionSeed}
          />
        </div>
      </div>

      {/* Emotion (가운데) */}
      <div className="px-1 sm:px-2 lg:px-3">
        <div className={getCardWrapperClass("emotion")}>
          <EmotionCard
            value={emotionValue}
            onChange={onEmotionChange}
            onReset={onEmotionReset}
            onMoveThoughtToDistortion={onMoveThoughtToDistortion}
            isCollapsed={step !== "emotion"}
            collapsedBelief={collapsedEmotionBelief}
          />
        </div>
      </div>

      {/* Alternative (오른쪽) */}
      <div className="px-1 sm:px-2 lg:px-3">
        <div className={getCardWrapperClass("alternative")}>
          <AlternativeThoughtCard
            value={alternativeValue}
            onChange={onAlternativeChange}
            onReset={onAlternativeReset}
          />
        </div>
      </div>
    </section>
  );
}
