// // src/components/emotion/dive/EmotionDiveCard.tsx
// "use client";

// import { useEffect, useRef, useState } from "react";

// type EmotionDiveCardProps = {
//   value: string;
//   onChange: (v: string) => void;

//   /** 현재 노드 단계 (0 = 첫 자동사고, 1 이후는 배후 생각 단계) */
//   level: number;
//   hint?: string;

//   /** 이 노드가 이미 한 번 선택되어 아래 단계가 생성된 상태인지 여부 */
//   locked: boolean;

//   /** 이 노드가 속한 세그먼트의 원본 텍스트 (API 프롬프트 용) */
//   segmentText: string;

//   /** 직접 입력(텍스트 영역)으로 더 깊이 파고들기 */
//   onDiveFromInput: (text: string) => void;

//   /** 특정 LLM 출력을 선택해서 더 깊이 파고들기 */
//   onChooseSuggestion: (text: string) => void;
// };

// export function EmotionDiveCard({
//   value,
//   onChange,
//   level,
//   hint,
//   locked,
//   segmentText,
//   onDiveFromInput,
//   onChooseSuggestion,
// }: EmotionDiveCardProps) {
//   const label = `${level + 1}단계 자동사고`;

//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const hasRequested = useRef(false); // 중복 요청 방지

//   // 🔥 처음 나타났을 때 한 번만 LLM 제안 요청
//   useEffect(() => {
//     if (locked) return; // 이미 확정된 노드는 제안 불필요
//     if (hasRequested.current) return;
//     if (!segmentText.trim()) return;

//     hasRequested.current = true;
//     setIsLoading(true);

//     (async () => {
//       try {
//         const res = await fetch("/api/emotion/suggestion", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             segmentText,
//             currentThought: value,
//             level,
//           }),
//         });

//         if (!res.ok) {
//           console.error("suggestions api error", await res.text());
//           return;
//         }

//         const data: { suggestions?: string[] } = await res.json();
//         setSuggestions(data.suggestions ?? []);
//       } catch (err) {
//         console.error("failed to fetch suggestions", err);
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, [segmentText, value, level, locked]);

//   // 이미 선택이 확정된 노드: 텍스트만 보여주고, 더 깊이 파고들기는 비활성화
//   if (locked) {
//     return (
//       <div className="space-y-1.5">
//         <div className="text-[11px] text-gray-500">{label}</div>

//         <div className="flex items-center gap-1">
//           {/* 왼쪽 단계로 보내기 버튼 (향후 연결용, 지금은 UI만) */}
//           <button
//             type="button"
//             className="flex h-6 w-6 items-center justify-center rounded-full border text-[10px]"
//           >
//             ←
//           </button>

//           <div className="flex-1 text-xs leading-normal">{value}</div>

//           {/* 이미 아래 단계가 만들어졌으므로 ↓ 는 비활성화 */}
//           <button
//             type="button"
//             disabled
//             className="flex h-6 w-6 items-center justify-center rounded-full border text-[10px] text-gray-300"
//           >
//             ↓
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 아직 선택되지 않은 노드: LLM 제안 + 직접 입력이 같은 위상으로 세로 배치
//   return (
//     <div className="space-y-1.5">
//       <div className="text-[11px] text-gray-500">{label}</div>

//       {/* LLM 제안 카드들 */}
//       <div className="space-y-2 mt-1">
//         {isLoading && suggestions.length === 0 && (
//           <div className="flex items-center gap-2 text-[11px] text-gray-400">
//             <span className="h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-transparent" />
//             <span>자동사고 후보를 불러오는 중...</span>
//           </div>
//         )}

//         {!isLoading &&
//           suggestions.length > 0 &&
//           suggestions.map((s, idx) => (
//             <div key={`${idx}-${s}`} className="flex items-center gap-1">
//               {/* 왼쪽 단계로 보내기 (나중에 연동할 수 있게만 UI 남겨둠) */}
//               <button
//                 type="button"
//                 className="flex h-6 w-6 items-center justify-center rounded-full border text-[10px]"
//               >
//                 ←
//               </button>

//               {/* 제안 텍스트 박스 */}
//               <button
//                 type="button"
//                 className="flex-1 rounded-md border bg-white px-2 py-1.5 text-left text-xs hover:bg-gray-50"
//                 onClick={() => onChooseSuggestion(s)}
//               >
//                 {s}
//               </button>

//               {/* 이 제안으로 더 깊이 파고들기 */}
//               <button
//                 type="button"
//                 className="flex h-6 w-6 items-center justify-center rounded-full border text-[10px]"
//                 onClick={() => onChooseSuggestion(s)}
//               >
//                 ↓
//               </button>
//             </div>
//           ))}
//       </div>

//       {/* 직접 입력 카드 */}
//       <div className="space-y-0.5">
//         <div className="text-[11px] text-gray-500">직접 입력</div>

//         <div className="flex items-start gap-1">
//           {/* 왼쪽 단계로 보내기 (향후 연결용) */}
//           <button
//             type="button"
//             className="mt-3 flex h-6 w-6 items-center justify-center rounded-full border text-[10px]"
//           >
//             ←
//           </button>

//           <textarea
//             className="flex-1 rounded-md border px-2 py-1.5 text-xs leading-normal focus:outline-none focus:ring-2 focus:ring-black/70"
//             rows={3}
//             placeholder={
//               hint ??
//               (level === 0
//                 ? "이 감정 뒤에 있는 생각이나 장면을 적어보세요."
//                 : "이 생각 뒤에 있는 더 깊은 생각을 적어보세요.")
//             }
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//           />

//           {/* 이 입력 내용으로 더 깊이 파고들기 */}
//           <button
//             type="button"
//             className="mt-3 flex h-6 w-6 items-center justify-center rounded-full border text-[10px]"
//             onClick={() => onDiveFromInput(value)}
//           >
//             ↓
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/components/emotion/dive/EmotionDiveCard.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type EmotionDiveCardProps = {
  value: string;
  onChange: (v: string) => void;

  /** 현재 노드 단계 (0 = 첫 자동사고, 1 이후는 배후 생각 단계) */
  level: number;
  hint?: string;

  /** 이 노드가 이미 한 번 선택되어 아래 단계가 생성된 상태인지 여부 */
  locked: boolean;

  /** 이 노드가 속한 세그먼트의 원본 텍스트 (API 프롬프트 용) */
  segmentText: string;
  /** 감정 카드 전체 서술 텍스트 */
  fullText: string;

  /** 직접 입력(텍스트 영역)으로 더 깊이 파고들기 */
  onDiveFromInput: (text: string) => void;

  /** 특정 LLM 출력을 선택해서 더 깊이 파고들기 */
  onChooseSuggestion: (text: string) => void;
};

export function EmotionDiveCard({
  value,
  onChange,
  level,
  hint,
  locked,
  fullText,
  segmentText,
  onDiveFromInput,
  onChooseSuggestion,
}: EmotionDiveCardProps) {
  const label = `${level + 1}단계 자동사고`;

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasRequested = useRef(false); // 중복 요청 방지

  // 처음 나타났을 때 한 번만 LLM 제안 요청
  useEffect(() => {
    if (locked) return;
    if (hasRequested.current) return;
    if (!segmentText.trim()) return;

    hasRequested.current = true;
    setIsLoading(true);

    (async () => {
      try {
        const res = await fetch("/api/emotion/suggestion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullText,
            segmentText,
            currentThought: value,
            level,
          }),
        });

        if (!res.ok) {
          console.error("suggestions api error", await res.text());
          return;
        }

        const data: { suggestions?: string[] } = await res.json();
        setSuggestions(data.suggestions ?? []);
      } catch (err) {
        console.error("failed to fetch suggestions", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [segmentText, value, level, locked]);

  // 이미 선택이 확정된 노드
  if (locked) {
    return (
      <div className="space-y-2">
        <div className="text-[12px] text-gray-500">{label}</div>

        <div className="flex items-center gap-3">
          <div className="flex-1 text-xs leading-normal text-gray-800">
            {value}
          </div>

          {/* 이미 아래 단계가 만들어졌으므로 ↓ 는 비활성화 */}
          <button
            type="button"
            disabled
            className="flex h-6 w-6 items-center justify-center rounded-full border text-[10px] text-gray-300"
          >
            ↓
          </button>
        </div>
      </div>
    );
  }

  // 아직 선택되지 않은 노드: LLM 제안 + 직접 입력
  return (
    <div className="space-y-4">
      <div className="text-[12px] text-gray-500">{label}</div>

      {/* LLM 제안 텍스트들 */}
      <div className="space-y-3">
        {isLoading && suggestions.length === 0 && (
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span className="h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-transparent" />
            <span>자동사고 후보를 불러오는 중...</span>
          </div>
        )}

        {!isLoading &&
          suggestions.length > 0 &&
          suggestions.map((s, idx) => (
            <div
              key={`${idx}-${s}`}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex-1 text-xs leading-normal text-gray-800">
                {s}
              </div>

              {/* 이 제안으로 더 깊이 파고들기 – 텍스트는 클릭 안됨, ↓만 동작 */}
              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-full border text-[10px] hover:bg-gray-50"
                onClick={() => onChooseSuggestion(s)}
              >
                ↓
              </button>
            </div>
          ))}
      </div>

      {/* 직접 입력 박스 */}
      <div className="space-y-2">
        <div className="text-[11px] text-gray-500">직접 입력</div>

        <div className="flex items-start gap-3">
          <textarea
            className="flex-1 rounded-md border px-2 py-2 text-xs leading-normal focus:outline-none focus:ring-2 focus:ring-black/70"
            rows={3}
            placeholder={
              hint ??
              (level === 0
                ? "이 감정 뒤에 있는 생각이나 장면을 적어보세요."
                : "이 생각 뒤에 있는 더 깊은 생각을 적어보세요.")
            }
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />

          {/* 이 입력 내용으로 더 깊이 파고들기 */}
          <button
            type="button"
            className="mt-2 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] hover:bg-gray-50"
            onClick={() => onDiveFromInput(value)}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}
