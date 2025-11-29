// src/components/distortion/hooks/useDistortionAnalysis.ts
"use client";

import { RegulationGoal } from "@/components/emotion/modal/EmotionRegulatonChoiceModal";
import { useState } from "react";
type EmotionContext = {
  emotionId: string;
  emotionName: string;
  intensity: number;
  regulationGoal: RegulationGoal;
};

export type ThoughtForDistortion = {
  level: number;
  belief: string;
  emotionReason?: string;
};

export type DistortionRequestPayload = {
  fullText: string;
  segmentText: string;
  // 현재 선택된 노드
  currentThought: ThoughtForDistortion;
  // level >= 2 일 때, 이전 단계 노드들 (필요하면 비우면 됨)
  previousThoughts?: ThoughtForDistortion[];
  emotionContext?: EmotionContext;
};

export function useDistortionAnalysis() {
  const [distortionText, setDistortionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => setDistortionText("");

  const runAnalysis = async (payload: DistortionRequestPayload) => {
    setIsLoading(true);
    try {
      // 🔥 여기서 LLM API 호출 (예시)
      const res = await fetch("/api/emotion/distortion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("distortion api error", await res.text());
        return;
      }

      const data: { result?: string } = await res.json();
      if (data.result) {
        setDistortionText(data.result);
      }
    } catch (e) {
      console.error("failed to fetch distortion analysis", e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    distortionText,
    setDistortionText,
    isLoading,
    reset,
    runAnalysis,
  };
}
