// // // src/components/emotion/modal/EmotionRegulationChoiceModal.tsx
// // "use client";

// // import { Heart } from "lucide-react";
// // import { useState } from "react";

// // const EMOTION_NAME_BY_ID: Record<string, string> = {
// //   joy: "기쁨",
// //   sad: "슬픔",
// //   anger: "분노",
// //   fear: "두려움",
// //   disgust: "혐오",
// //   surprise: "놀람",
// //   shame: "수치심",
// //   guilt: "죄책감",
// //   lonely: "외로움",
// //   achievement: "성취감",
// //   satisfaction: "만족감",
// //   despair: "절망",
// //   stuck: "답답함",
// // };

// // export type RegulationGoal = "reduce" | "accept";

// // type Props = {
// //   emotionId: string;
// //   intensity: number; // 0~100
// //   initialGoal?: RegulationGoal;
// //   onClose: () => void;
// //   onConfirm: (goal: RegulationGoal) => void;
// // };

// // export function EmotionRegulationChoiceModal({
// //   emotionId,
// //   intensity,
// //   initialGoal = "reduce",
// //   onClose,
// //   onConfirm,
// // }: Props) {
// //   const [goal, setGoal] = useState<RegulationGoal>(initialGoal);
// //   const emotionName = EMOTION_NAME_BY_ID[emotionId] ?? "이 감정";

// //   const subtitleText =
// //     goal === "reduce"
// //       ? "✓ 감정을 적절한 수준으로 조절하는 방향으로 진행됩니다"
// //       : "✓ 현재 상태를 인정하며 진행됩니다";

// //   const subtitleClass =
// //     goal === "reduce"
// //       ? "bg-sky-50 text-sky-700 border border-sky-100"
// //       : "bg-emerald-50 text-emerald-700 border border-emerald-100";

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
// //       {/* 패널을 벗어나는 느낌으로 조금 더 큼직하게 */}
// //       <div className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-3xl border border-slate-100 bg-white px-8 py-7 shadow-2xl">
// //         {/* 상단 하트 아이콘 + 타이틀 영역 */}
// //         <div className="flex flex-col items-center mb-6">
// //           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mb-3 shadow-md">
// //             <Heart className="size-8 text-white" />
// //           </div>
// //           <p className="text-[11px] font-semibold text-indigo-500">중앙 단계</p>
// //           <h2 className="mt-1 text-lg font-semibold text-slate-900">
// //             감정 조절 방향 선택
// //           </h2>
// //           <p className="mt-1 text-xs text-slate-600">
// //             지금 느끼는{" "}
// //             <span className="font-semibold">
// //               "{emotionName}" {intensity}점
// //             </span>
// //             을 앞으로 어떻게 다루고 싶은지 정해봅니다.
// //           </p>
// //         </div>

// //         {/* 닫기 버튼 – 우측 상단 */}
// //         <button
// //           type="button"
// //           onClick={onClose}
// //           className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full
// //                      bg-slate-100/80 text-slate-500 shadow-sm
// //                      hover:bg-slate-200 hover:text-slate-700
// //                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
// //                      transition-colors"
// //         >
// //           <span className="text-sm">✕</span>
// //           <span className="sr-only">닫기</span>
// //         </button>

// //         {/* 질문 박스 */}
// //         <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-center text-[13px] font-semibold text-indigo-800">
// //           <span className="font-bold">"{emotionName}"</span>의 강도(
// //           {intensity}점)를 줄이고 싶으신가요?
// //         </div>

// //         {/* 선택 버튼들 */}
// //         <div className="mb-4 grid grid-cols-2 gap-3 text-[13px]">
// //           <button
// //             type="button"
// //             onClick={() => setGoal("reduce")}
// //             className={[
// //               "rounded-2xl px-4 py-5 font-semibold transition text-sm text-center",
// //               goal === "reduce"
// //                 ? "border border-indigo-500 bg-indigo-500 text-white shadow-md"
// //                 : "border border-slate-200 bg-white text-slate-800 hover:border-indigo-300",
// //             ].join(" ")}
// //           >
// //             네, 줄이고 싶습니다
// //           </button>

// //           <button
// //             type="button"
// //             onClick={() => setGoal("accept")}
// //             className={[
// //               "rounded-2xl px-4 py-5 font-semibold transition text-sm text-center",
// //               goal === "accept"
// //                 ? "border border-indigo-500 bg-indigo-500 text-white shadow-md"
// //                 : "border border-slate-200 bg-white text-slate-800 hover:border-indigo-300",
// //             ].join(" ")}
// //           >
// //             아니요, 이 정도면 괜찮습니다
// //           </button>
// //         </div>

// //         {/* 상태 설명 박스 */}
// //         <div
// //           className={`mb-5 rounded-2xl px-4 py-3 text-center text-[11px] font-medium ${subtitleClass}`}
// //         >
// //           {subtitleText}
// //         </div>

// //         {/* CTA */}
// //         <div className="flex justify-end">
// //           <button
// //             type="button"
// //             onClick={() => onConfirm(goal)}
// //             className="w-full rounded-2xl bg-indigo-500 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
// //           >
// //             다음 단계로 진행하기 →
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // src/components/emotion/modal/EmotionRegulationChoiceModal.tsx
// "use client";

// import { Heart } from "lucide-react";
// import { useState } from "react";

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

// export type RegulationGoal = "reduce" | "accept";

// type Props = {
//   emotionId: string;
//   intensity: number; // 0~100
//   initialGoal?: RegulationGoal;
//   onClose: () => void;
//   onConfirm: (goal: RegulationGoal) => void;
// };

// export function EmotionRegulationChoiceModal({
//   emotionId,
//   intensity,
//   initialGoal = "reduce",
//   onClose,
//   onConfirm,
// }: Props) {
//   const [goal, setGoal] = useState<RegulationGoal>(initialGoal);
//   const emotionName = EMOTION_NAME_BY_ID[emotionId] ?? "이 감정";

//   const subtitleText =
//     goal === "reduce"
//       ? "✓ 감정을 적절한 수준으로 조절하는 방향으로 진행됩니다"
//       : "✓ 현재 상태를 인정하며 진행됩니다";

//   const subtitleClass =
//     goal === "reduce"
//       ? "bg-sky-50 text-sky-700 border border-sky-100"
//       : "bg-emerald-50 text-emerald-700 border border-emerald-100";

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//       {/* EmotionIntensityModal과 비슷한 사이즈/느낌으로 조정 */}
//       <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-100 bg-white px-8 py-8 shadow-2xl">
//         {/* 상단 하트 아이콘 + 타이틀 영역 */}
//         <div className="mb-6 flex flex-col items-center">
//           <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 shadow-md">
//             {/* 🔵 그라데이션 제거, 단색으로 정리 */}
//             <Heart className="size-7 text-white" />
//           </div>
//           <p className="text-[11px] font-semibold text-indigo-500">중앙 단계</p>
//           <h2 className="mt-1 text-lg font-semibold text-slate-900">
//             감정 조절 방향 선택
//           </h2>
//           <p className="mt-1 text-xs text-slate-600 text-center">
//             지금 느끼는{" "}
//             <span className="font-semibold">
//               "{emotionName}" {intensity}점
//             </span>
//             을 앞으로 어떻게 다루고 싶은지 정해봅니다.
//           </p>
//         </div>

//         {/* 닫기 버튼 – 우측 상단 (IntensityModal과 동일 스타일) */}
//         <button
//           type="button"
//           onClick={onClose}
//           className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full
//                      bg-slate-100/80 text-slate-500 shadow-sm
//                      hover:bg-slate-200 hover:text-slate-700
//                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
//                      transition-colors"
//         >
//           <span className="text-sm">✕</span>
//           <span className="sr-only">닫기</span>
//         </button>

//         {/* 질문 박스 */}
//         <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-center text-[13px] font-semibold text-indigo-800">
//           <span className="font-bold">"{emotionName}"</span>의 강도(
//           {intensity}점)를 줄이고 싶으신가요?
//         </div>

//         {/* 선택 버튼들 */}
//         <div className="mb-4 grid grid-cols-2 gap-3 text-[13px]">
//           <button
//             type="button"
//             onClick={() => setGoal("reduce")}
//             className={[
//               "rounded-2xl px-4 py-5 font-semibold transition text-sm text-center",
//               goal === "reduce"
//                 ? "border border-indigo-500 bg-indigo-500 text-white shadow-md"
//                 : "border border-slate-200 bg-white text-slate-800 hover:border-indigo-300",
//             ].join(" ")}
//           >
//             네, 줄이고 싶습니다
//           </button>

//           <button
//             type="button"
//             onClick={() => setGoal("accept")}
//             className={[
//               "rounded-2xl px-4 py-5 font-semibold transition text-sm text-center",
//               goal === "accept"
//                 ? "border border-indigo-500 bg-indigo-500 text-white shadow-md"
//                 : "border border-slate-200 bg-white text-slate-800 hover:border-indigo-300",
//             ].join(" ")}
//           >
//             아니요, 이 정도면 괜찮습니다
//           </button>
//         </div>

//         {/* 상태 설명 박스 */}
//         <div
//           className={`mb-5 rounded-2xl px-4 py-3 text-center text-[11px] font-medium ${subtitleClass}`}
//         >
//           {subtitleText}
//         </div>

//         {/* CTA – 그라데이션 없이 단색 인디고 버튼 */}
//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={() => onConfirm(goal)}
//             className="w-full rounded-2xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
//           >
//             다음 단계로 진행하기 →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/emotion/modal/EmotionRegulationChoiceModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";

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

export type RegulationGoal = "reduce" | "accept";

type Props = {
  emotionId: string;
  intensity: number; // 0~100
  initialGoal?: RegulationGoal;
  onClose: () => void;
  onConfirm: (goal: RegulationGoal) => void;
};

export function EmotionRegulationChoiceModal({
  emotionId,
  intensity,
  // initialGoal = "reduce",  // 🔹 UI 상에서는 선택 후에만 반응하도록, 기본값은 쓰지 않음
  onClose,
  onConfirm,
}: Props) {
  const [goal, setGoal] = useState<RegulationGoal | null>(null);
  const emotionName = EMOTION_NAME_BY_ID[emotionId] ?? "이 감정";

  const subtitleText =
    goal === "reduce"
      ? "✓ 감정을 적절한 수준으로 조절하는 방향으로 진행됩니다"
      : "✓ 현재 상태를 인정하며 진행됩니다";

  const subtitleClass =
    goal === "reduce"
      ? "bg-sky-50 text-sky-700 border border-sky-100"
      : "bg-emerald-50 text-emerald-700 border border-emerald-100";

  const hasSelection = goal !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      {/* EmotionIntensityModal과 비슷한 사이즈/여백 */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-100 bg-white px-8 py-8 shadow-2xl">
        {/* 닫기 버튼 – IntensityModal과 통일 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full
                     bg-slate-100/80 text-slate-500 shadow-sm
                     hover:bg-slate-200 hover:text-slate-700
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                     transition-colors"
        >
          <span className="text-sm">✕</span>
          <span className="sr-only">닫기</span>
        </button>

        {/* 헤더 – IntensityModal 헤더와 정렬/구조 유사하게 */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 shadow-md">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              감정 조절 방향 선택
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              선택한 감정:{" "}
              <span className="font-semibold text-pink-600">
                "{emotionName}" ({intensity}점)
              </span>
            </p>
          </div>
        </div>

        {/* 질문 박스 – 중앙 정렬 영역 바로 위 안내 문구 느낌 */}
        <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-center text-[13px] font-semibold text-indigo-800">
          <span className="font-bold">"{emotionName}"</span>의 강도(
          {intensity}점)를 줄이고 싶으신가요?
        </div>

        {/* 네 / 아니오 선택 버튼 – 크기 살짝 줄이고 중앙에 집중 */}
        <div className="mb-4 grid grid-cols-2 gap-3 text-[13px]">
          <button
            type="button"
            onClick={() => setGoal("reduce")}
            className={[
              "rounded-2xl px-3 py-4 text-xs md:text-sm font-semibold transition text-center",
              goal === "reduce"
                ? "border border-indigo-500 bg-indigo-500 text-white shadow-md"
                : "border border-slate-200 bg-white text-slate-800 hover:border-indigo-300",
            ].join(" ")}
          >
            네, 줄이고 싶습니다
          </button>

          <button
            type="button"
            onClick={() => setGoal("accept")}
            className={[
              "rounded-2xl px-3 py-4 text-xs md:text-sm font-semibold transition text-center",
              goal === "accept"
                ? "border border-indigo-500 bg-indigo-500 text-white shadow-md"
                : "border border-slate-200 bg-white text-slate-800 hover:border-indigo-300",
            ].join(" ")}
          >
            아니요, 이 정도면 괜찮습니다
          </button>
        </div>

        {/* 아래 내용은 선택 후에만 노출 */}
        {hasSelection && (
          <>
            {/* 상태 설명 박스 – 중앙 정렬 유지 */}
            <div
              className={`mb-5 rounded-2xl px-4 py-3 text-center text-[16px] font-medium ${subtitleClass}`}
            >
              {subtitleText}
            </div>

            {/* CTA – 디자인 시스템 Button 사용, IntensityModal 스타일에 맞춤 */}
            <Button
              className="mt-1 w-full py-3.5 text-base font-semibold shadow-md hover:shadow-lg disabled:shadow-none"
              onClick={() => goal && onConfirm(goal)}
              disabled={!goal}
            >
              다음 단계로 진행하기 →
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
