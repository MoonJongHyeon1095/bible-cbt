// src/components/emotion/EmotionCard.tsx
"use client";

import type { DistortionRequestPayload } from "@/components/distortion/hooks/useDistortionAnalysis";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { EmotionCollapsedOverlay } from "./collapsed/EmotionCollapsedOverlay";
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

  onMoveThoughtToDistortion?: (payload: DistortionRequestPayload) => void;

  isCollapsed?: boolean;
  collapsedBelief?: string;
};

type Mode = "input" | "segments";

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
  onMoveThoughtToDistortion,
  isCollapsed = false,
  collapsedBelief,
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

  const emotionContext =
    selectedEmotionId && intensity !== null
      ? {
          emotionId: selectedEmotionId,
          emotionName: EMOTION_NAME_BY_ID[selectedEmotionId] ?? "이 감정",
          intensity,
          regulationGoal,
        }
      : undefined;

  const beliefText =
    collapsedBelief && collapsedBelief.trim().length > 0
      ? collapsedBelief
      : undefined;

  const bodyWrapperClass = isCollapsed
    ? "pointer-events-none absolute inset-0 opacity-0"
    : "relative opacity-100";

  return (
    <Card className="h-full">
      {/* 🔹 헤더는 그대로 두되, 오른쪽 버튼만 제거 */}
      <CardHeader className="mb-2 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>감정사건 일기</CardTitle>
          <CardDescription>
            {mode === "input"
              ? "오늘 당신에게 무슨 일이 있었는지 들려주신다면, 우리는 같이 감정을 만드는 생각을 다뤄갈 수 있습니다."
              : "구간 단위로 자동사고를 추적할 수 있습니다."}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {/* 🔽 헤더 바로 아래, 본문 위에 내려온 초기화 버튼 */}
        <div className="mb-3 flex justify-end">
          <button
            className="text-[11px] text-gray-500 underline sm:text-xs"
            onClick={handleReset}
          >
            초기화
          </button>
        </div>

        <div className="relative mt-1">
          <div className={bodyWrapperClass}>
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

            {mode === "segments" && (
              <EmotionSegmentsSection
                text={value}
                onSegmentsChange={onSegmentsChange}
                onRequestDive={onRequestDive}
                emotionContext={emotionContext}
                onMoveThoughtToDistortion={onMoveThoughtToDistortion}
              />
            )}

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

          {isCollapsed && <EmotionCollapsedOverlay beliefText={beliefText} />}
        </div>
      </CardContent>
    </Card>
  );
}
