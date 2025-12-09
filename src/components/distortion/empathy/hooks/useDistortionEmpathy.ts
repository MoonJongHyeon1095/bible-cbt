// // src/components/distortion/empathy/hooks/useDistortionEmpathy.ts
// "use client";

// import { useState } from "react";
// import type { DistortionRequestPayload } from "../../hooks/useDistortionAnalysis";

// export type DistortionEmpathy = {
//   thoughtEmpathy: string;
//   emotionEmpathy: string;
//   iStatement?: string;
//   soothing: string;
//   question?: string; // 추가
// };

// export function useDistortionEmpathy() {
//   const [empathy, setEmpathy] = useState<DistortionEmpathy | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const reset = () => setEmpathy(null);

//   const runEmpathy = async (payload: DistortionRequestPayload) => {
//     setIsLoading(true);
//     try {
//       const res = await fetch("/api/distortion/empathy", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) return;

//       const data: { result?: DistortionEmpathy } = await res.json();
//       if (data.result) setEmpathy(data.result);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { empathy, isLoading, runEmpathy, reset };
// }

// src/components/distortion/empathy/hooks/useDistortionEmpathy.ts
"use client";

import { useState } from "react";
import type { DistortionRequestPayload } from "../../hooks/useDistortionAnalysis";

export type DistortionEmpathy = {
  thoughtEmpathy: string;
  emotionEmpathy: string;
  iStatement?: string;
  soothing: string;
  question?: string;
};

type EmpathyMap = Record<string, DistortionEmpathy>;

export function useDistortionEmpathy() {
  const [empathyByKey, setEmpathyByKey] = useState<EmpathyMap>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  // 현재 key에 대한 공감문 가져오기
  const getEmpathy = (key: string | null): DistortionEmpathy | null => {
    if (!key) return null;
    return empathyByKey[key] ?? null;
  };

  // 현재 key가 로딩 중인지 여부
  const isLoadingFor = (key: string | null): boolean => {
    if (!key) return false;
    return loadingKey === key;
  };

  // 특정 key만 리셋하거나, key 없으면 전체 리셋
  const reset = (key?: string) => {
    if (!key) {
      setEmpathyByKey({});
      setLoadingKey(null);
      return;
    }

    setEmpathyByKey((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setLoadingKey((prev) => (prev === key ? null : prev));
  };

  // 🔑 key 단위 공감문 생성 (이미 있으면 재호출 X)
  const runEmpathy = async (key: string, payload: DistortionRequestPayload) => {
    if (!key) return;

    // 이미 만들어진 공감문 있으면 그냥 리턴
    if (empathyByKey[key]) return;

    setLoadingKey(key);
    try {
      const res = await fetch("/api/distortion/empathy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return;

      const data: { result?: DistortionEmpathy } = await res.json();
      if (data.result) {
        setEmpathyByKey((prev) => ({
          ...prev,
          [key]: data.result as DistortionEmpathy,
        }));
      }
    } finally {
      setLoadingKey((prev) => (prev === key ? null : prev));
    }
  };

  return { getEmpathy, isLoadingFor, runEmpathy, reset };
}
