// // src/components/emotion/EmotionCard.tsx
// "use client";

// import type { DistortionRequestPayload } from "@/components/distortion/hooks/useDistortionAnalysis";
// import { useState } from "react";
// import { EmotionCollapsedOverlay } from "./collapsed/EmotionCollapsedOverlay";
// import { EmotionInputSection } from "./EmotionInputSection";
// import { EmotionSegmentsSection } from "./EmotionSegmentSection";
// import { EmotionPrimarySelectModal } from "./modal/EmotionPrimarySelectonModal";
// import {
//   EmotionRegulationChoiceModal,
//   RegulationGoal,
// } from "./modal/EmotionRegulatonChoiceModal";
// import { EmotionIntensityModal } from "./modal/EmtionIntensityModal";
// import type { EmotionSegment } from "./types/emotion.types";

// type EmotionCardProps = {
//   value: string;
//   onChange: (text: string) => void;
//   onReset: () => void;
//   onSegmentsChange?: (segments: EmotionSegment[]) => void;
//   onRequestDive?: (segment: EmotionSegment) => void;

//   // 자동사고를 인지오류 카드로 넘길 때
//   onMoveThoughtToDistortion?: (payload: DistortionRequestPayload) => void;

//   // 접힌 상태 + 요약 belief
//   isCollapsed?: boolean;
//   collapsedBelief?: string;
// };

// type Mode = "input" | "segments";

// const EMOTION_NAME_BY_ID: Record<string, string> = {
//   joy: "기쁨",
//   sad: "슬픔",
//   anger: "분노",
//   fear: "두려움",
//   disgust: "혐오",
//   surprise: "놀람",
//   shame: "수치심",
//   guilt: "죄책감",
//   lonely: "외로움",
//   achievement: "성취감",
//   satisfaction: "만족감",
//   despair: "절망",
//   stuck: "답답함",
// };

// export function EmotionCard({
//   value,
//   onChange,
//   onReset,
//   onSegmentsChange,
//   onRequestDive,
//   onMoveThoughtToDistortion,
//   isCollapsed = false,
//   collapsedBelief,
// }: EmotionCardProps) {
//   const [mode, setMode] = useState<Mode>("input");

//   const [selectedEmotionId, setSelectedEmotionId] = useState<string | null>(
//     null
//   );
//   const [intensity, setIntensity] = useState<number | null>(null);
//   const [regulationGoal, setRegulationGoal] =
//     useState<RegulationGoal>("reduce");

//   const [showEmotionModal, setShowEmotionModal] = useState(false);
//   const [showIntensityModal, setShowIntensityModal] = useState(false);
//   const [showRegulationModal, setShowRegulationModal] = useState(false);

//   const handleReset = () => {
//     onReset();
//     setMode("input");
//     setSelectedEmotionId(null);
//     setIntensity(null);
//     setRegulationGoal("reduce");
//     setShowEmotionModal(false);
//     setShowIntensityModal(false);
//     setShowRegulationModal(false);
//   };

//   const emotionContext =
//     selectedEmotionId && intensity !== null
//       ? {
//           emotionId: selectedEmotionId,
//           emotionName: EMOTION_NAME_BY_ID[selectedEmotionId] ?? "이 감정",
//           intensity,
//           regulationGoal,
//         }
//       : undefined;

//   const beliefText =
//     collapsedBelief && collapsedBelief.trim().length > 0
//       ? collapsedBelief
//       : undefined;

//   return (
//     <div className="rounded-2xl bg-white p-4 shadow-sm">
//       {/* ✅ 헤더: 항상 노출 */}
//       <h2 className="mb-1 text-lg font-semibold">감정 기술</h2>
//       <p className="mb-2 text-xs text-gray-500">
//         {mode === "input"
//           ? "오늘 당신에게 무슨 일이 있었는지 들려주신다면, 우리는 같이 감정을 만드는 생각을 다뤄갈 수 있습니다."
//           : "구간 단위로 자동사고를 추적할 수 있습니다."}
//       </p>

//       {/* ✅ 헤더 아래 영역을 한 덩어리로 묶어서, 여기만 접었다 펼쳤다 */}
//       <div className="relative mt-2">
//         {/* 본문(입력/세그먼트/모달 트리거) */}
//         <div className={isCollapsed ? "invisible" : ""}>
//           <button
//             className="mb-2 text-xs text-gray-500 underline"
//             onClick={handleReset}
//           >
//             초기화
//           </button>

//           {mode === "input" && (
//             <EmotionInputSection
//               value={value}
//               onChange={onChange}
//               onNext={() => {
//                 if (!value.trim()) return;
//                 setShowEmotionModal(true);
//               }}
//             />
//           )}

//           {mode === "segments" && (
//             <EmotionSegmentsSection
//               text={value}
//               onSegmentsChange={onSegmentsChange}
//               onRequestDive={onRequestDive}
//               emotionContext={emotionContext}
//               onMoveThoughtToDistortion={onMoveThoughtToDistortion}
//             />
//           )}

//           {showEmotionModal && (
//             <EmotionPrimarySelectModal
//               initialEmotionId={selectedEmotionId}
//               onClose={() => setShowEmotionModal(false)}
//               onConfirm={(emotionId) => {
//                 setSelectedEmotionId(emotionId);
//                 setShowEmotionModal(false);
//                 setShowIntensityModal(true);
//               }}
//             />
//           )}

//           {showIntensityModal && selectedEmotionId && (
//             <EmotionIntensityModal
//               emotionId={selectedEmotionId}
//               initialValue={intensity ?? 20}
//               onClose={() => setShowIntensityModal(false)}
//               onConfirm={(value) => {
//                 setIntensity(value);
//                 setShowIntensityModal(false);
//                 setShowRegulationModal(true);
//               }}
//             />
//           )}

//           {showRegulationModal && selectedEmotionId && intensity !== null && (
//             <EmotionRegulationChoiceModal
//               emotionId={selectedEmotionId}
//               intensity={intensity}
//               initialGoal={regulationGoal}
//               onClose={() => setShowRegulationModal(false)}
//               onConfirm={(goal) => {
//                 setRegulationGoal(goal);
//                 setShowRegulationModal(false);
//                 setMode("segments");
//               }}
//             />
//           )}
//         </div>

//         {/* 🔒 접힌 상태일 때: 본문은 invisible 이라 클릭/선택 불가 + 요약 인용구만 보임 */}
//         {isCollapsed && <EmotionCollapsedOverlay beliefText={beliefText} />}
//       </div>
//     </div>
//   );
// }

// src/components/emotion/EmotionCard.tsx
"use client";

import type { DistortionRequestPayload } from "@/components/distortion/hooks/useDistortionAnalysis";
import { useState } from "react";
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

  // 🔹 collapsed일 때 본문을 레이아웃 밖으로 빼기 위한 클래스
  const bodyWrapperClass = isCollapsed
    ? "pointer-events-none absolute inset-0 opacity-0"
    : "relative opacity-100";

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      {/* 항상 보이는 헤더 */}
      <h2 className="mb-1 text-lg font-semibold">감정 기술</h2>
      <p className="mb-2 text-xs text-gray-500">
        {mode === "input"
          ? "오늘 당신에게 무슨 일이 있었는지 들려주신다면, 우리는 같이 감정을 만드는 생각을 다뤄갈 수 있습니다."
          : "구간 단위로 자동사고를 추적할 수 있습니다."}
      </p>

      {/* 헤더 아래 영역 */}
      <div className="relative mt-2">
        {/* 🧠 실제 에디터/세그먼트 영역 (상태는 계속 유지됨) */}
        <div className={bodyWrapperClass}>
          <button
            className="mb-2 text-xs text-gray-500 underline"
            onClick={handleReset}
          >
            초기화
          </button>

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

        {/* 📌 접힌 상태일 때 보여줄 요약 인용구 (이게 카드 높이를 결정) */}
        {isCollapsed && <EmotionCollapsedOverlay beliefText={beliefText} />}
      </div>
    </div>
  );
}
