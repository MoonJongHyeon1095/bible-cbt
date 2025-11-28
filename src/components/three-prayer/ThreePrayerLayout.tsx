// // src/components/three-prayer/ThreePrayerLayout.tsx
// "use client";

// import type { ThreePrayerDraft } from "@/types/draft";
// import { useState } from "react";
// import { EmotionCard } from "../emotion";
// import { AlternativeThoughtCard } from "./AlternativeThoughtCard";
// import { DistortionCard } from "./DistortionCard";

// type Props = {
//   draft: ThreePrayerDraft;
//   setDraft: React.Dispatch<React.SetStateAction<ThreePrayerDraft>>;
//   onResetAll: () => void; // 지금은 안 쓰지만 나중에 사용할 수 있으니 남겨둠
// };

// type Step = "emotion" | "distortion" | "alternative";

// const stepOrder: Step[] = ["emotion", "distortion", "alternative"];

// export function ThreePrayerLayout({ draft, setDraft }: Props) {
//   const [step, setStep] = useState<Step>("emotion");
//   const currentIndex = stepOrder.indexOf(step);

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

//   return (
//     <main className="min-h-screen bg-[#fafafa] p-6">
//       <div className="mx-auto max-w-5xl">
//         {/* 상단 헤더 */}
//         <header className="mb-6">
//           <h1 className="text-2xl font-bold">세칸 기도문</h1>
//           <p className="text-sm text-gray-600">
//             먼저 감정을 기술하고, 그 다음 악마의 거짓말을 적은 뒤, 마지막으로
//             대안적 사고를 작성합니다.
//           </p>
//         </header>

//         {/* 단계 인디케이터 */}
//         <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
//           <div className="flex flex-wrap gap-2">
//             {stepOrder.map((s, i) => (
//               <button
//                 key={s}
//                 type="button"
//                 onClick={() => setStep(s)}
//                 className={`rounded-full px-3 py-1 transition-colors ${
//                   s === step
//                     ? "bg-black text-white"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 {i + 1}. {getStepLabel(s)}
//               </button>
//             ))}
//           </div>
//           <div>
//             {currentIndex + 1} / {stepOrder.length}
//           </div>
//         </div>

//         {/* 세 칸 레이아웃 */}
//         <section className="grid items-start gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)_minmax(0,0.8fr)]">
//           {/* 왼쪽: 인지왜곡 */}
//           <div className={getCardWrapperClass("distortion")}>
//             <DistortionCard
//               value={draft.distorted}
//               onChange={(v) => setDraft((d) => ({ ...d, distorted: v }))}
//               onReset={() => setDraft((d) => ({ ...d, distorted: "" }))}
//             />
//           </div>

//           {/* 가운데: 감정 기술 */}
//           <div className={getCardWrapperClass("emotion")}>
//             <EmotionCard
//               value={draft.prayer}
//               onChange={(v) => setDraft((d) => ({ ...d, prayer: v }))}
//               onReset={() => setDraft((d) => ({ ...d, prayer: "" }))}
//             />
//           </div>

//           {/* 오른쪽: 대안사고 */}
//           <div className={getCardWrapperClass("alternative")}>
//             <AlternativeThoughtCard
//               value={draft.truth}
//               onChange={(v) => setDraft((d) => ({ ...d, truth: v }))}
//               onReset={() => setDraft((d) => ({ ...d, truth: "" }))}
//             />
//           </div>
//         </section>

//         {/* ↓↓↓ 여기부터는 단계와 무관하게 항상 나오는 Footer 영역 ↓↓↓ */}
//         <footer className="mt-16 border-t border-gray-200 pt-8">
//           {/* Copyright + 요약 별점 */}
//           <div className="mb-6 text-center text-xs text-gray-500">
//             <div className="inline-flex flex-col items-center gap-1">
//               <span className="rounded-full border px-3 py-1 text-[11px]">
//                 Copyright © 2025 617ALLIANCE
//               </span>
//               {/* 별점/리뷰 개수 간단 표시 (실제 기능은 나중에 붙여도 됨) */}
//               <div className="mt-2 flex items-center gap-2 text-[11px]">
//                 <span className="inline-flex items-center gap-1">
//                   <span>⭐</span>
//                   <span>5.0</span>
//                 </span>
//                 <span className="h-3 w-px bg-gray-300" />
//                 <span>총 2개의 후기</span>
//               </div>
//             </div>
//           </div>

//           {/* 리뷰 작성 박스 */}
//           <div className="mx-auto mb-6 max-w-2xl rounded-2xl bg-white p-4 shadow-sm">
//             <h2 className="mb-3 text-sm font-semibold text-gray-800">
//               후기 작성하기
//             </h2>

//             {/* 닉네임 + 별점 */}
//             <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//               <div className="flex items-center gap-2 text-xs text-gray-600">
//                 <span>별점을 선택해주세요</span>
//                 <div className="flex gap-1">
//                   {[1, 2, 3, 4, 5].map((n) => (
//                     <button
//                       key={n}
//                       type="button"
//                       className="h-6 w-6 rounded-full border text-[11px] leading-5 hover:bg-yellow-50"
//                     >
//                       {n}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <input
//                 type="text"
//                 placeholder="닉네임 (선택사항, 미입력시 익명)"
//                 className="w-full rounded-md border px-3 py-1.5 text-xs outline-none focus:border-black md:w-64"
//               />
//             </div>

//             {/* 내용 입력 */}
//             <textarea
//               rows={4}
//               placeholder="어떤 점이 좋았나요? 솔직한 후기를 남겨주세요 🙂"
//               className="w-full rounded-md border px-3 py-2 text-xs outline-none focus:border-black"
//             />

//             <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
//               <span>0 / 300</span>
//               <button
//                 type="button"
//                 className="rounded-full bg-violet-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-600"
//               >
//                 후기 등록하기
//               </button>
//             </div>
//           </div>

//           {/* 후기 목록 (샘플) */}
//           <div className="mx-auto max-w-2xl">
//             <h3 className="mb-2 text-xs font-semibold text-gray-700">
//               후기 목록
//             </h3>

//             <div className="space-y-3 text-xs">
//               <article className="rounded-2xl bg-white p-4 shadow-sm">
//                 <div className="mb-1 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">
//                       ⭐ 5.0
//                     </span>
//                     <span className="font-semibold">익명 사용자</span>
//                   </div>
//                   <span className="text-[11px] text-gray-400">2시간 전</span>
//                 </div>
//                 <p className="text-[11px] text-gray-700">
//                   자칫 일기에 멈춰버리는 걱정과 자기 자신에 대한 생각은 되려
//                   처지게 만드는 경우가 많다. 스스로에 대해 분석하고 생각하는
//                   능력이 부족할수록 일기도 힘들고, 그럴 때 세칸 구조를 통해
//                   그러한 감정이 객관화되도록 나 자신을 관찰할 수 있도록 돕는
//                   것은 자기 돌봄의 좋은 연습이라고 느꼈다.
//                 </p>
//               </article>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </main>
//   );
// }

// src/components/three-prayer/ThreePrayerLayout.tsx
"use client";

import type { ThreePrayerDraft } from "@/types/draft";
import { useState } from "react";
import { EmotionCard } from "../emotion";
import { AlternativeThoughtCard } from "./AlternativeThoughtCard";
import { DistortionCard } from "./DistortionCard";

type Props = {
  draft: ThreePrayerDraft;
  setDraft: React.Dispatch<React.SetStateAction<ThreePrayerDraft>>;
  onResetAll: () => void; // 지금은 안 쓰지만 나중에 사용할 수 있으니 남겨둠
};

type Step = "emotion" | "distortion" | "alternative";

const stepOrder: Step[] = ["emotion", "distortion", "alternative"];

export function ThreePrayerLayout({ draft, setDraft }: Props) {
  const [step, setStep] = useState<Step>("emotion");
  const currentIndex = stepOrder.indexOf(step);

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

  // 현재 단계에 따라 가로 폭 비율 다르게
  const getGridColsClass = (s: Step) => {
    switch (s) {
      case "emotion":
        // 왼쪽 0.5 : 가운데 1.5 : 오른쪽 0.5
        return "md:grid-cols-[minmax(0,0.5fr)_minmax(0,1.5fr)_minmax(0,0.5fr)]";
      case "distortion":
        // 왼쪽 1.5 : 가운데 0.5 : 오른쪽 0.5
        return "md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.5fr)_minmax(0,0.5fr)]";
      case "alternative":
        // 왼쪽 0.5 : 가운데 0.5 : 오른쪽 1.5
        return "md:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)_minmax(0,1.5fr)]";
      default:
        return "md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)_minmax(0,0.8fr)]";
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] p-6">
      <div className="mx-auto max-w-5xl">
        {/* 상단 헤더 */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold">세칸 기도문</h1>
          <p className="text-sm text-gray-600">
            먼저 감정을 기술하고, 그 다음 악마의 거짓말을 적은 뒤, 마지막으로
            대안적 사고를 작성합니다.
          </p>
        </header>

        {/* 단계 인디케이터 */}
        <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex flex-wrap gap-2">
            {stepOrder.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(s)}
                className={`rounded-full px-3 py-1 transition-colors ${
                  s === step
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}. {getStepLabel(s)}
              </button>
            ))}
          </div>
        </div>

        {/* 세 칸 레이아웃 */}
        <section
          className={`grid grid-cols-1 items-start gap-4 ${getGridColsClass(
            step
          )}`}
        >
          {/* 왼쪽: 인지왜곡 */}
          <div className={getCardWrapperClass("distortion")}>
            <DistortionCard
              value={draft.distorted}
              onChange={(v) => setDraft((d) => ({ ...d, distorted: v }))}
              onReset={() => setDraft((d) => ({ ...d, distorted: "" }))}
            />
          </div>

          {/* 가운데: 감정 기술 */}
          <div className={getCardWrapperClass("emotion")}>
            <EmotionCard
              value={draft.prayer}
              onChange={(v) => setDraft((d) => ({ ...d, prayer: v }))}
              onReset={() => setDraft((d) => ({ ...d, prayer: "" }))}
            />
          </div>

          {/* 오른쪽: 대안사고 */}
          <div className={getCardWrapperClass("alternative")}>
            <AlternativeThoughtCard
              value={draft.truth}
              onChange={(v) => setDraft((d) => ({ ...d, truth: v }))}
              onReset={() => setDraft((d) => ({ ...d, truth: "" }))}
            />
          </div>
        </section>

        {/* ↓↓↓ 여기부터는 단계와 무관하게 항상 나오는 Footer 영역 ↓↓↓ */}
        <footer className="mt-16 border-t border-gray-200 pt-8">
          {/* Copyright + 요약 별점 */}
          <div className="mb-6 text-center text-xs text-gray-500">
            <div className="inline-flex flex-col items-center gap-1">
              <span className="rounded-full border px-3 py-1 text-[11px]">
                Copyright © 2025 617ALLIANCE
              </span>
              {/* 별점/리뷰 개수 간단 표시 (실제 기능은 나중에 붙여도 됨) */}
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1">
                  <span>⭐</span>
                  <span>5.0</span>
                </span>
                <span className="h-3 w-px bg-gray-300" />
                <span>총 2개의 후기</span>
              </div>
            </div>
          </div>

          {/* 리뷰 작성 박스 */}
          <div className="mx-auto mb-6 max-w-2xl rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-800">
              후기 작성하기
            </h2>

            {/* 닉네임 + 별점 */}
            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>별점을 선택해주세요</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="h-6 w-6 rounded-full border text-[11px] leading-5 hover:bg-yellow-50"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="닉네임 (선택사항, 미입력시 익명)"
                className="w-full rounded-md border px-3 py-1.5 text-xs outline-none focus:border-black md:w-64"
              />
            </div>

            {/* 내용 입력 */}
            <textarea
              rows={4}
              placeholder="어떤 점이 좋았나요? 솔직한 후기를 남겨주세요 🙂"
              className="w-full rounded-md border px-3 py-2 text-xs outline-none focus:border-black"
            />

            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
              <span>0 / 300</span>
              <button
                type="button"
                className="rounded-full bg-violet-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-600"
              >
                후기 등록하기
              </button>
            </div>
          </div>

          {/* 후기 목록 (샘플) */}
          <div className="mx-auto max-w-2xl">
            <h3 className="mb-2 text-xs font-semibold text-gray-700">
              후기 목록
            </h3>

            <div className="space-y-3 text-xs">
              <article className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">
                      ⭐ 5.0
                    </span>
                    <span className="font-semibold">익명 사용자</span>
                  </div>
                  <span className="text-[11px] text-gray-400">2시간 전</span>
                </div>
                <p className="text-[11px] text-gray-700">
                  자칫 일기에 멈춰버리는 걱정과 자기 자신에 대한 생각은 되려
                  처지게 만드는 경우가 많다. 스스로에 대해 분석하고 생각하는
                  능력이 부족할수록 일기도 힘들고, 그럴 때 세칸 구조를 통해
                  그러한 감정이 객관화되도록 나 자신을 관찰할 수 있도록 돕는
                  것은 자기 돌봄의 좋은 연습이라고 느꼈다.
                </p>
              </article>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
