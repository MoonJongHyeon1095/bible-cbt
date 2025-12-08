// // src/components/distortion/history/DistortionHistoryItem.tsx
// "use client";

// import { motion } from "framer-motion";
// import { X } from "lucide-react";
// import type { HistoryNode } from "./hooks/useDistortionHistory";

// type Props = {
//   node: HistoryNode;
//   onDelete: (id: string) => void;
//   onFocus: (id: string) => void;
// };

// export function DistortionHistoryItem({ node, onDelete, onFocus }: Props) {
//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: -6 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="relative cursor-pointer rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50/60"
//       onClick={() => onFocus(node.id)}
//     >
//       <button
//         type="button"
//         className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow"
//         onClick={(e) => {
//           e.stopPropagation();
//           onDelete(node.id);
//         }}
//       >
//         <X size={14} />
//       </button>

//       {node.emotionName && (
//         <div className="mb-1 flex gap-2 text-xs text-emerald-800">
//           <span>{node.emotionName}</span>
//           {node.intensity !== undefined && (
//             <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px]">
//               강도 {node.intensity}
//             </span>
//           )}
//         </div>
//       )}

//       <p className="text-sm leading-snug text-slate-900">{node.text}</p>

//       {node.segmentText && (
//         <p className="mt-1 text-xs italic text-slate-600">
//           “{node.segmentText}”
//         </p>
//       )}
//     </motion.div>
//   );
// }

// src/components/distortion/history/DistortionHistoryItem.tsx
"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { HistoryNode } from "./hooks/useDistortionHistory";

type Props = {
  node: HistoryNode;
  onDelete: (id: string) => void;
  onFocus: (id: string) => void;
};

export function DistortionHistoryItem({ node, onDelete, onFocus }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative cursor-pointer rounded-lg border border-slate-200 bg-white/90 p-2 text-xs shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50/60"
      onClick={() => onFocus(node.id)}
    >
      <button
        type="button"
        className="absolute -right-1 -top-1 rounded-full bg-white p-0.5 shadow"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(node.id);
        }}
      >
        <X size={11} />
      </button>

      {node.emotionName && (
        <div className="mb-0.5 flex gap-2 text-[11px] text-emerald-800">
          <span>{node.emotionName}</span>
          {node.intensity !== undefined && (
            <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px]">
              강도 {node.intensity}
            </span>
          )}
        </div>
      )}

      <p className="text-[12px] leading-snug text-slate-900">{node.text}</p>

      {node.segmentText && (
        <p className="mt-0.5 text-[11px] italic text-slate-600">
          “{node.segmentText}”
        </p>
      )}
    </motion.div>
  );
}
