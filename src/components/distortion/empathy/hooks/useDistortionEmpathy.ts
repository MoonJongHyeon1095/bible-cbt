// src/components/distortion/empathy/hooks/useDistortionEmpathy.ts
"use client";

import { useState } from "react";
import type { DistortionRequestPayload } from "../../hooks/useDistortionAnalysis";

export type DistortionEmpathy = {
  thoughtEmpathy: string;
  emotionEmpathy: string;
  iStatement?: string;
  soothing: string;
  question?: string; // 추가
};

export function useDistortionEmpathy() {
  const [empathy, setEmpathy] = useState<DistortionEmpathy | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => setEmpathy(null);

  const runEmpathy = async (payload: DistortionRequestPayload) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/distortion/empathy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return;

      const data: { result?: DistortionEmpathy } = await res.json();
      if (data.result) setEmpathy(data.result);
    } finally {
      setIsLoading(false);
    }
  };

  return { empathy, isLoading, runEmpathy, reset };
}
