// // src/components/three-prayer/ThreePrayerLayout.tsx
// "use client";

// import type { ThreePrayerDraft } from "@/types/draft";
// import { useState } from "react";
// import {
//   useDistortionAnalysis,
//   type DistortionRequestPayload,
// } from "../distortion/hooks/useDistortionAnalysis";
// import { ThreePrayerCardsSection } from "./ThreePrayerCardsSection";
// import { ThreePrayerFooter } from "./ThreePrayerFooter";
// import { ThreePrayerHeader } from "./ThreePrayerHeader";
// import { ThreePrayerStepIndicator } from "./ThreePrayerStepIndicator";

// export type Step = "emotion" | "distortion" | "alternative";

// export const stepOrder: Step[] = ["emotion", "distortion", "alternative"];

// type Props = {
//   draft: ThreePrayerDraft;
//   setDraft: React.Dispatch<React.SetStateAction<ThreePrayerDraft>>;
//   onResetAll: () => void;
// };

// export function ThreePrayerLayout({ draft, setDraft }: Props) {
//   const [step, setStep] = useState<Step>("emotion");
//   const currentIndex = stepOrder.indexOf(step);

//   const {
//     distortionText,
//     setDistortionText,
//     isLoading: isDistortionLoading,
//     reset: resetDistortion,
//     runAnalysis,
//   } = useDistortionAnalysis();

//   const [distortionSeed, setDistortionSeed] =
//     useState<DistortionRequestPayload | null>(null);

//   const getStepLabel = (s: Step) => {
//     if (s === "emotion") return "감정 기술 / 자동사고 체크";
//     if (s === "distortion") return "사탄의 거짓말 - 인지오류 검토";
//     return "성경 말씀 - 대안사고 구성";
//   };

//   const getCardWrapperClass = (s: Step) => {
//     const base = "transition-all duration-300 ease-out transform";
//     const active = "scale-100 opacity-100";
//     const inactive = "scale-90 opacity-40 pointer-events-none";
//     return `${base} ${step === s ? active : inactive}`;
//   };

//   const getGridColsClass = (s: Step) => {
//     switch (s) {
//       case "emotion":
//         return "md:grid-cols-[minmax(0,0.5fr)_minmax(0,1.5fr)_minmax(0,0.5fr)]";
//       case "distortion":
//         return "md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.5fr)_minmax(0,0.5fr)]";
//       case "alternative":
//         return "md:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)_minmax(0,1.5fr)]";
//       default:
//         return "md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)_minmax(0,0.8fr)]";
//     }
//   };

//   // Emotion → Distortion로 넘길 때
//   const handleMoveThoughtToDistortion = (payload: DistortionRequestPayload) => {
//     setDistortionSeed(payload);
//     const belief = payload.currentThought.belief ?? "";
//     setDistortionText(belief);
//     setDraft((d) => ({ ...d, distorted: belief }));
//     setStep("distortion");
//   };

//   const handleDistortionChange = (v: string) => {
//     setDistortionText(v);
//     setDraft((d) => ({ ...d, distorted: v }));
//   };

//   const handleDistortionReset = () => {
//     resetDistortion();
//     setDraft((d) => ({ ...d, distorted: "" }));
//   };

//   const handleRequestDistortionAnalysis = () => {
//     if (!distortionSeed) return;
//     runAnalysis(distortionSeed);
//   };

//   // 🔽 비활성 Emotion 카드에서 보여줄 belief 요약 텍스트
//   const collapsedEmotionBelief = distortionSeed?.currentThought.belief ?? "";

//   return (
//     <main className="min-h-screen bg-[#fafafa] p-6">
//       <div className="mx-auto max-w-5xl">
//         <ThreePrayerHeader />

//         <ThreePrayerStepIndicator
//           step={step}
//           stepOrder={stepOrder}
//           currentIndex={currentIndex}
//           getStepLabel={getStepLabel}
//           onChangeStep={setStep}
//         />

//         <ThreePrayerCardsSection
//           step={step}
//           getCardWrapperClass={getCardWrapperClass}
//           getGridColsClass={getGridColsClass}
//           // Emotion
//           emotionValue={draft.prayer}
//           onEmotionChange={(v) => setDraft((d) => ({ ...d, prayer: v }))}
//           onEmotionReset={() => setDraft((d) => ({ ...d, prayer: "" }))}
//           onMoveThoughtToDistortion={handleMoveThoughtToDistortion}
//           collapsedEmotionBelief={collapsedEmotionBelief}
//           // Distortion
//           distortionValue={distortionText}
//           onDistortionChange={handleDistortionChange}
//           onDistortionReset={handleDistortionReset}
//           isDistortionLoading={isDistortionLoading}
//           onRequestDistortionAnalysis={handleRequestDistortionAnalysis}
//           // Alternative
//           alternativeValue={draft.truth}
//           onAlternativeChange={(v) => setDraft((d) => ({ ...d, truth: v }))}
//           onAlternativeReset={() => setDraft((d) => ({ ...d, truth: "" }))}
//         />

//         <ThreePrayerFooter />
//       </div>
//     </main>
//   );
// }

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
    const base = "transition-all duration-300 ease-out transform";
    const active = "scale-100 opacity-100";
    const inactive = "scale-90 opacity-40 pointer-events-none";
    return `${base} ${step === s ? active : inactive}`;
  };

  const getGridColsClass = (s: Step) => {
    switch (s) {
      case "emotion":
        return "md:grid-cols-[minmax(0,0.5fr)_minmax(0,1.5fr)_minmax(0,0.5fr)]";
      case "distortion":
        return "md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.5fr)_minmax(0,0.5fr)]";
      case "alternative":
        return "md:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)_minmax(0,1.5fr)]";
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
    <main className="min-h-screen bg-[#fafafa] p-6">
      <div className="mx-auto max-w-5xl">
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
