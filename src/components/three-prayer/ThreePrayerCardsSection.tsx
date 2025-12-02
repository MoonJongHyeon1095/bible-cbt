// // // src/components/three-prayer/ThreePrayerCardsSection.tsx
// // "use client";

// // import { AlternativeThoughtCard } from "../alternative/AlternativeThoughtCard";
// // import { DistortionCard } from "../distortion/DistortionCard";
// // import type { DistortionRequestPayload } from "../distortion/hooks/useDistortionAnalysis";
// // import { EmotionCard } from "../emotion";
// // import { CollapsedEmotionCard } from "../emotion/collapsed/CollapsedEmotionCard";
// // import type { Step } from "./ThreePrayerLayout";

// // type Props = {
// //   step: Step;
// //   getCardWrapperClass: (s: Step) => string;
// //   getGridColsClass: (s: Step) => string;

// //   // Emotion
// //   emotionValue: string;
// //   onEmotionChange: (v: string) => void;
// //   onEmotionReset: () => void;
// //   onMoveThoughtToDistortion: (payload: DistortionRequestPayload) => void;

// //   // 🔽 비활성 Emotion 카드용 요약 텍스트
// //   collapsedEmotionBelief?: string;

// //   // Distortion
// //   distortionValue: string;
// //   onDistortionChange: (v: string) => void;
// //   onDistortionReset: () => void;
// //   isDistortionLoading: boolean;
// //   onRequestDistortionAnalysis: () => void;

// //   // Alternative
// //   alternativeValue: string;
// //   onAlternativeChange: (v: string) => void;
// //   onAlternativeReset: () => void;
// // };

// // export function ThreePrayerCardsSection({
// //   step,
// //   getCardWrapperClass,
// //   getGridColsClass,
// //   // emotion
// //   emotionValue,
// //   onEmotionChange,
// //   onEmotionReset,
// //   onMoveThoughtToDistortion,
// //   collapsedEmotionBelief,
// //   // distortion
// //   distortionValue,
// //   onDistortionChange,
// //   onDistortionReset,
// //   isDistortionLoading,
// //   onRequestDistortionAnalysis,
// //   // alternative
// //   alternativeValue,
// //   onAlternativeChange,
// //   onAlternativeReset,
// // }: Props) {
// //   return (
// //     <section
// //       className={`grid grid-cols-1 items-start gap-4 ${getGridColsClass(step)}`}
// //     >
// //       {/* Distortion */}
// //       <div className={getCardWrapperClass("distortion")}>
// //         <DistortionCard
// //           value={distortionValue}
// //           onChange={onDistortionChange}
// //           onReset={onDistortionReset}
// //           isLoading={isDistortionLoading}
// //           onRequestAnalysis={onRequestDistortionAnalysis}
// //         />
// //       </div>

// //       {/* Emotion */}
// //       <div className={getCardWrapperClass("emotion")}>
// //         {step === "emotion" ? (
// //           <EmotionCard
// //             value={emotionValue}
// //             onChange={onEmotionChange}
// //             onReset={onEmotionReset}
// //             onMoveThoughtToDistortion={onMoveThoughtToDistortion}
// //           />
// //         ) : (
// //           <CollapsedEmotionCard belief={collapsedEmotionBelief} />
// //         )}
// //       </div>

// //       {/* Alternative */}
// //       <div className={getCardWrapperClass("alternative")}>
// //         <AlternativeThoughtCard
// //           value={alternativeValue}
// //           onChange={onAlternativeChange}
// //           onReset={onAlternativeReset}
// //         />
// //       </div>
// //     </section>
// //   );
// // }

// // src/components/three-prayer/ThreePrayerCardsSection.tsx
// "use client";

// import { AlternativeThoughtCard } from "../alternative/AlternativeThoughtCard";
// import { DistortionCard } from "../distortion/DistortionCard";
// import type { DistortionRequestPayload } from "../distortion/hooks/useDistortionAnalysis";
// import { EmotionCard } from "../emotion";
// import type { Step } from "./ThreePrayerLayout";

// type Props = {
//   step: Step;
//   getCardWrapperClass: (s: Step) => string;
//   getGridColsClass: (s: Step) => string;

//   // Emotion
//   emotionValue: string;
//   onEmotionChange: (v: string) => void;
//   onEmotionReset: () => void;
//   onMoveThoughtToDistortion: (payload: DistortionRequestPayload) => void;

//   // 비활성 Emotion 카드용 요약 텍스트
//   collapsedEmotionBelief?: string;

//   // Distortion
//   distortionValue: string;
//   onDistortionChange: (v: string) => void;
//   onDistortionReset: () => void;
//   isDistortionLoading: boolean;
//   onRequestDistortionAnalysis: () => void;

//   // Alternative
//   alternativeValue: string;
//   onAlternativeChange: (v: string) => void;
//   onAlternativeReset: () => void;
// };

// export function ThreePrayerCardsSection({
//   step,
//   getCardWrapperClass,
//   getGridColsClass,
//   // emotion
//   emotionValue,
//   onEmotionChange,
//   onEmotionReset,
//   onMoveThoughtToDistortion,
//   collapsedEmotionBelief,
//   // distortion
//   distortionValue,
//   onDistortionChange,
//   onDistortionReset,
//   isDistortionLoading,
//   onRequestDistortionAnalysis,
//   // alternative
//   alternativeValue,
//   onAlternativeChange,
//   onAlternativeReset,
// }: Props) {
//   return (
//     <section
//       className={`grid grid-cols-1 items-start gap-4 ${getGridColsClass(step)}`}
//     >
//       {/* Distortion */}
//       <div className={getCardWrapperClass("distortion")}>
//         <DistortionCard
//           value={distortionValue}
//           onChange={onDistortionChange}
//           onReset={onDistortionReset}
//           isLoading={isDistortionLoading}
//           onRequestAnalysis={onRequestDistortionAnalysis}
//         />
//       </div>

//       {/* Emotion */}
//       <div className={getCardWrapperClass("emotion")}>
//         <EmotionCard
//           value={emotionValue}
//           onChange={onEmotionChange}
//           onReset={onEmotionReset}
//           onMoveThoughtToDistortion={onMoveThoughtToDistortion}
//           isCollapsed={step !== "emotion"}
//           collapsedBelief={collapsedEmotionBelief}
//         />
//       </div>

//       {/* Alternative */}
//       <div className={getCardWrapperClass("alternative")}>
//         <AlternativeThoughtCard
//           value={alternativeValue}
//           onChange={onAlternativeChange}
//           onReset={onAlternativeReset}
//         />
//       </div>
//     </section>
//   );
// }

// src/components/three-prayer/ThreePrayerCardsSection.tsx
"use client";

import { RefObject } from "react";
import { AlternativeThoughtCard } from "../alternative/AlternativeThoughtCard";
import { DistortionCard } from "../distortion/DistortionCard";
import type { DistortionRequestPayload } from "../distortion/hooks/useDistortionAnalysis";
import { EmotionCard } from "../emotion";
import type { Step } from "./ThreePrayerLayout";

type Props = {
  step: Step;
  getCardWrapperClass: (s: Step) => string;
  getGridColsClass: (s: Step) => string;

  // 🔹 새로 추가: 왼쪽(인지오류) 카드 ref
  distortionCardRef?: RefObject<HTMLDivElement | null>;

  // Emotion ...
  emotionValue: string;
  onEmotionChange: (v: string) => void;
  onEmotionReset: () => void;
  onMoveThoughtToDistortion: (payload: DistortionRequestPayload) => void;
  collapsedEmotionBelief?: string;

  // Distortion ...
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
      className={`grid grid-cols-1 items-start gap-4 ${getGridColsClass(step)}`}
    >
      {/* Distortion (왼쪽) */}
      <div
        ref={distortionCardRef}
        className={getCardWrapperClass("distortion")}
      >
        <DistortionCard
          value={distortionValue}
          onChange={onDistortionChange}
          onReset={onDistortionReset}
          isLoading={isDistortionLoading}
          onRequestAnalysis={onRequestDistortionAnalysis}
        />
      </div>

      {/* Emotion (가운데) */}
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

      {/* Alternative (오른쪽) */}
      <div className={getCardWrapperClass("alternative")}>
        <AlternativeThoughtCard
          value={alternativeValue}
          onChange={onAlternativeChange}
          onReset={onAlternativeReset}
        />
      </div>
    </section>
  );
}
