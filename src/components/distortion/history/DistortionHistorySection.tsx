// // // src/components/distortion/history/DistortionHistoryStack.tsx
// // "use client";

// // import { AnimatePresence, motion } from "framer-motion";
// // import { ChevronDown, ChevronUp } from "lucide-react";
// // import type { ReactNode } from "react";
// // import { DistortionHistoryItem } from "./DistortionHistoryItem";
// // import type { HistoryNode } from "./hooks/useDistortionHistory";

// // type Props = {
// //   history: HistoryNode[];
// //   isExpanded: boolean;
// //   toggle: () => void;
// //   onDelete: (id: string) => void;
// //   onFocus: (id: string) => void;

// //   // 🔽 토글 열렸을 때, 선택된 노드와 관련된 상세 블록
// //   detailBlock?: ReactNode;
// // };

// // export function DistortionHistorySection({
// //   history,
// //   isExpanded,
// //   toggle,
// //   onDelete,
// //   onFocus,
// //   detailBlock,
// // }: Props) {
// //   // 맨 앞이 "가장 최근에 왼쪽으로 넘긴 생각"
// //   const latest = history[0];
// //   const rest = history.slice(1); // 아래 케밥에는 이전 것들만

// //   return (
// //     <div className="space-y-2">
// //       {/* 🔼 토글 헤더: 최신 생각 카드 자체가 토글 버튼 역할 */}
// //       <button type="button" onClick={toggle} className="w-full text-left">
// //         <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm shadow-sm hover:bg-emerald-50/80">
// //           <div className="mb-1 flex items-center justify-between text-[11px] text-emerald-800">
// //             <span className="flex items-center gap-1 text-emerald-900">
// //               {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
// //             </span>
// //           </div>

// //           {latest ? (
// //             <>
// //               <div className="mb-1 flex flex-wrap items-center gap-2 text-emerald-900 font-medium">
// //                 {latest.emotionName && <span>{latest.emotionName}</span>}
// //                 {latest.intensity !== undefined && (
// //                   <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] text-emerald-700">
// //                     강도 {latest.intensity}
// //                   </span>
// //                 )}
// //               </div>

// //               <p className="line-clamp-2 text-sm text-slate-900">
// //                 “{latest.text}”
// //               </p>
// //             </>
// //           ) : (
// //             <p className="text-xs text-slate-500">
// //               아직 감정/생각 기록이 없어요.
// //             </p>
// //           )}
// //         </div>
// //       </button>

// //       {/* 🔽 토글 열렸을 때: 상세 블록 + 이전 노드들 */}
// //       <AnimatePresence initial={false}>
// //         {isExpanded && (detailBlock || rest.length > 0) && (
// //           <motion.div
// //             layout
// //             initial={{ opacity: 0, height: 0 }}
// //             animate={{ opacity: 1, height: "auto" }}
// //             exit={{ opacity: 0, height: 0 }}
// //             className="space-y-3 overflow-hidden rounded-2xl bg-slate-50/40 p-3"
// //           >
// //             {detailBlock && (
// //               <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
// //                 {detailBlock}
// //               </div>
// //             )}

// //             {rest.length > 0 && (
// //               <div className="space-y-2">
// //                 {rest.map((node) => (
// //                   <DistortionHistoryItem
// //                     key={node.id}
// //                     node={node}
// //                     onDelete={onDelete}
// //                     onFocus={onFocus}
// //                   />
// //                 ))}
// //               </div>
// //             )}
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </div>
// //   );
// // }
// // src/components/distortion/history/DistortionHistorySection.tsx
// "use client";

// import { AnimatePresence, motion } from "framer-motion";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import type { ReactNode } from "react";
// import { DistortionHistoryItem } from "./DistortionHistoryItem";
// import type { HistoryNode } from "./hooks/useDistortionHistory";

// type Props = {
//   history: HistoryNode[];
//   isExpanded: boolean;
//   toggle: () => void;
//   onDelete: (id: string) => void;
//   onFocus: (id: string) => void;

//   // 🔽 토글 열렸을 때, 선택된 노드와 관련된 상세 블록
//   detailBlock?: ReactNode;
// };

// export function DistortionHistorySection({
//   history,
//   isExpanded,
//   toggle,
//   onDelete,
//   onFocus,
//   detailBlock,
// }: Props) {
//   // 맨 앞이 "방금 왼쪽으로 넘긴 현재 문장"
//   const latest = history[0];
//   const rest = history.slice(1); // 아래 케밥에는 이전 것들만

//   return (
//     <div className="space-y-2">
//       {/* 🔼 토글 제목: 현재 문장 + 감정/강도 + 화살표 */}
//       <button
//         type="button"
//         onClick={toggle}
//         className="flex w-full items-center justify-between gap-2 text-left"
//       >
//         {latest ? (
//           <>
//             <div className="flex flex-1 flex-wrap items-center gap-2">
//               {latest.emotionName && (
//                 <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-800">
//                   {latest.emotionName}
//                 </span>
//               )}
//               {latest.intensity !== undefined && (
//                 <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
//                   강도 {latest.intensity}
//                 </span>
//               )}
//               <span className="line-clamp-1 text-sm text-slate-900">
//                 “{latest.text}”
//               </span>
//             </div>

//             <span className="flex-shrink-0 text-emerald-700">
//               {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </span>
//           </>
//         ) : (
//           <div className="flex flex-1 items-center justify-between gap-2">
//             <span className="text-xs text-slate-500">
//               아직 감정/생각 기록이 없어요.
//             </span>
//             <span className="flex-shrink-0 text-emerald-700">
//               {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </span>
//           </div>
//         )}
//       </button>

//       {/* 🔽 토글 열렸을 때: 상세 블록 + 이전 노드들 (케밥) */}
//       <AnimatePresence initial={false}>
//         {isExpanded && (detailBlock || rest.length > 0) && (
//           <motion.div
//             layout
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="space-y-3 overflow-hidden rounded-2xl bg-slate-50/40 p-3"
//           >
//             {detailBlock && (
//               <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
//                 {detailBlock}
//               </div>
//             )}

//             {rest.length > 0 && (
//               <div className="space-y-2">
//                 {rest.map((node) => (
//                   <DistortionHistoryItem
//                     key={node.id}
//                     node={node}
//                     onDelete={onDelete}
//                     onFocus={onFocus}
//                   />
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// src/components/distortion/history/DistortionHistorySection.tsx
"use client";

import { HistoryToggleCard } from "@/components/ui/history-toggle-card";
import { ThoughtTimelineKebab } from "@/components/ui/thought-timeline-kebap";
import type { HistoryNode } from "./hooks/useDistortionHistory";

type Props = {
  history: HistoryNode[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export function DistortionHistorySection({
  history,
  activeId,
  onSelect,
  onDelete,
}: Props) {
  if (!history.length) return null;

  return (
    <div className="mt-4 space-y-3">
      {history.map((node) => (
        <HistoryToggleCard
          key={node.id}
          emotionName={node.emotionName}
          intensity={node.intensity}
          title={node.text}
          subtitle={node.segmentText}
          isOpen={activeId === node.id}
          onToggle={() => onSelect(node.id)}
          onDelete={() => onDelete(node.id)}
        >
          {/* 케밥: level 오름차순, 마지막이 현재 문장 */}
          <ThoughtTimelineKebab
            items={node.thoughts.map((t) => ({
              ...t,
              isCurrent: t.level === node.payload.currentThought.level,
            }))}
          />
        </HistoryToggleCard>
      ))}
    </div>
  );
}
