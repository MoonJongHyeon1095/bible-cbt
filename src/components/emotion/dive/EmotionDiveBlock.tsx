// // src/components/emotion/dive/EmotionDiveBlock.tsx
// "use client";

// import { useState } from "react";
// import type { RegulationGoal } from "../modal/EmotionRegulatonChoiceModal";
// import type {
//   EmotionSegment,
//   ThoughtNode,
//   ThoughtNodeId,
// } from "../types/emotion.types";
// import { EmotionDiveCard } from "./EmotionDiveCard";

// type EmotionContext = {
//   emotionId: string;
//   emotionName: string;
//   intensity: number;
//   regulationGoal: RegulationGoal;
// };

// type ThoughtNodeWithSuggestions = ThoughtNode & {
//   locked?: boolean;
// };

// type EmotionDiveBlockProps = {
//   segment: EmotionSegment;
//   isOpen: boolean; // ✅ 이제 "초기값" 역할만
//   nodes: ThoughtNodeWithSuggestions[];
//   fullText: string;
//   emotionContext?: EmotionContext;

//   onToggle: () => void;
//   onRemove: () => void;
//   onChangeNode: (id: ThoughtNodeId, text: string) => void;
//   onDiveFromInput: (id: ThoughtNodeId, text: string) => void;
//   // belief + emotionReason 같이 받음
//   onChooseSuggestion: (
//     id: ThoughtNodeId,
//     belief: string,
//     emotionReason?: string
//   ) => void;
// };

// export function EmotionDiveBlock({
//   segment,
//   isOpen,
//   nodes,
//   fullText,
//   emotionContext,
//   onToggle,
//   onRemove,
//   onChangeNode,
//   onDiveFromInput,
//   onChooseSuggestion,
// }: EmotionDiveBlockProps) {
//   // 🔹 isOpen은 "초기값"으로만 사용, 이후엔 로컬 state만 신뢰
//   const [open, setOpen] = useState<boolean>(isOpen);

//   const handleToggleClick = () => {
//     setOpen((prev) => !prev); // UI 즉시 토글
//     onToggle(); // 부모는 참고만 하도록 호출
//   };

//   return (
//     <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900/40">
//       {/* 헤더 */}
//       <div className="relative">
//         <button
//           type="button"
//           className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-gray-800 dark:text-gray-100"
//           onClick={handleToggleClick}
//         >
//           <span className="shrink-0 text-[11px]">{open ? "▼" : "▶"}</span>
//           <span className="flex-1 truncate pr-6 text-left">{segment.text}</span>
//         </button>

//         <button
//           type="button"
//           className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[10px] text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
//           onClick={(e) => {
//             e.stopPropagation();
//             onRemove();
//           }}
//         >
//           ✕
//         </button>
//       </div>

//       {/* 내용: 언마운트하지 않고 hidden 처리만 */}
//       <div
//         className={`space-y-6 border-t bg-gray-50 px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900 ${
//           open ? "" : "hidden"
//         }`}
//       >
//         {nodes.map((node, index) => (
//           <div key={node.id} className="relative pl-5 pt-1.5 pb-3">
//             {index > 0 && (
//               <div className="absolute left-1 top-0 bottom-4 flex flex-col items-center">
//                 <div className="h-full w-px bg-gray-300 dark:bg-neutral-600" />
//                 <div className="h-2.5 w-2.5 rounded-full border border-gray-400 bg-white dark:border-neutral-400 dark:bg-neutral-900" />
//               </div>
//             )}

//             <EmotionDiveCard
//               level={node.level}
//               value={node.userText}
//               hint={node.hint}
//               locked={!!node.locked}
//               segmentText={segment.text}
//               fullText={fullText}
//               emotionContext={emotionContext}
//               emotionReason={node.emotionReason}
//               onChange={(v) => onChangeNode(node.id, v)}
//               onDiveFromInput={(text) => onDiveFromInput(node.id, text)}
//               onChooseSuggestion={(belief, emotionReason) =>
//                 onChooseSuggestion(node.id, belief, emotionReason)
//               }
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// src/components/emotion/dive/EmotionDiveBlock.tsx
"use client";

import type { RegulationGoal } from "../modal/EmotionRegulatonChoiceModal";
import type {
  EmotionSegment,
  ThoughtNode,
  ThoughtNodeId,
} from "../types/emotion.types";
import { EmotionDiveCard } from "./EmotionDiveCard";

type EmotionContext = {
  emotionId: string;
  emotionName: string;
  intensity: number;
  regulationGoal: RegulationGoal;
};

type ThoughtNodeWithSuggestions = ThoughtNode & {
  locked?: boolean;
};

type EmotionDiveBlockProps = {
  segment: EmotionSegment;
  isOpen: boolean;
  nodes: ThoughtNodeWithSuggestions[];
  fullText: string;
  emotionContext?: EmotionContext;

  onToggle: () => void;
  onRemove: () => void;
  onChangeNode: (id: ThoughtNodeId, text: string) => void;
  onDiveFromInput: (id: ThoughtNodeId, text: string) => void;
  onChooseSuggestion: (
    id: ThoughtNodeId,
    belief: string,
    emotionReason?: string
  ) => void;
};

export function EmotionDiveBlock({
  segment,
  isOpen,
  nodes,
  fullText,
  emotionContext,
  onToggle,
  onRemove,
  onChangeNode,
  onDiveFromInput,
  onChooseSuggestion,
}: EmotionDiveBlockProps) {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900/40">
      {/* 헤더 */}
      <div className="relative">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-gray-800 dark:text-gray-100"
          onClick={onToggle}
        >
          <span className="shrink-0 text-[11px]">{isOpen ? "▼" : "▶"}</span>
          <span className="flex-1 truncate pr-6 text-left">{segment.text}</span>
        </button>

        <button
          type="button"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[10px] text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ✕
        </button>
      </div>

      {/* 내용: 언마운트하지 않고 hidden 처리만 */}
      <div
        className={`space-y-6 border-t bg-gray-50 px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900 ${
          isOpen ? "" : "hidden"
        }`}
      >
        {nodes.map((node, index) => (
          <div key={node.id} className="relative pl-5 pt-1.5 pb-3">
            {index > 0 && (
              <div className="absolute left-1 top-0 bottom-4 flex flex-col items-center">
                <div className="h-full w-px bg-gray-300 dark:bg-neutral-600" />
                <div className="h-2.5 w-2.5 rounded-full border border-gray-400 bg-white dark:border-neutral-400 dark:bg-neutral-900" />
              </div>
            )}

            <EmotionDiveCard
              level={node.level}
              value={node.userText}
              hint={node.hint}
              locked={!!node.locked}
              segmentText={segment.text}
              fullText={fullText}
              emotionContext={emotionContext}
              emotionReason={node.emotionReason}
              onChange={(v) => onChangeNode(node.id, v)}
              onDiveFromInput={(text) => onDiveFromInput(node.id, text)}
              onChooseSuggestion={(belief, emotionReason) =>
                onChooseSuggestion(node.id, belief, emotionReason)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
