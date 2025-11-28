// // src/components/emotion/EmotionSegmentsSection.tsx
// "use client";

// import { useState } from "react";
// import { EmotionDiveBlock } from "./dive/EmotionDiveBlock";
// import { SegmentEditor } from "./editor/SegmentEditor";
// import type {
//   EmotionInputSegment,
//   EmotionSegment,
//   ThoughtNode,
//   ThoughtNodeId,
// } from "./types/emotion.types";

// type Props = {
//   text: string; // 감정 카드 전체 텍스트
//   onSegmentsChange?: (segments: EmotionSegment[]) => void;
//   onRequestDive?: (segment: EmotionSegment) => void;
// };

// /** UI 전용 타입들 */
// type ThoughtNodeWithSuggestions = ThoughtNode & {
//   suggestions?: string[];
//   locked?: boolean;
// };

// type DiveBlock = {
//   segment: EmotionSegment;
//   isOpen: boolean;
//   nodes: ThoughtNodeWithSuggestions[];
// };

// /** helper들 전부 여기로 이동 */
// function createThoughtNode(
//   level: number,
//   userText = "",
//   hint?: string
// ): ThoughtNodeWithSuggestions {
//   return {
//     id: crypto.randomUUID(),
//     level,
//     userText,
//     hint:
//       hint ??
//       (level === 0
//         ? "이 감정 뒤에 있는 생각이나 장면을 적어보세요."
//         : "이 생각 뒤에 있는 더 깊은 생각을 적어보세요."),
//     locked: false,
//   };
// }

// function formatTextWithSentenceSpacing(raw: string): string {
//   return raw.replace(
//     /([.!?…？！。])(\s+)/g,
//     (_match, punct: string, spaces: string) => `${punct}${spaces}  `
//   );
// }

// function lockNodeAndAddDeeper(
//   blocks: DiveBlock[],
//   segmentId: string,
//   nodeId: ThoughtNodeId,
//   chosenText: string
// ): DiveBlock[] {
//   return blocks.map((b) => {
//     if (b.segment.id !== segmentId) return b;

//     const updatedNodes = b.nodes.map((n) =>
//       n.id === nodeId
//         ? {
//             ...n,
//             userText: chosenText,
//             suggestions: undefined,
//             locked: true,
//           }
//         : n
//     );

//     const parent = updatedNodes.find((n) => n.id === nodeId);
//     if (!parent) return b;

//     const newNode = createThoughtNode(parent.level + 1);

//     return {
//       ...b,
//       nodes: [...updatedNodes, newNode],
//     };
//   });
// }

// export function EmotionSegmentsSection({
//   text,
//   onSegmentsChange,
//   onRequestDive,
// }: Props) {
//   const [segments, setSegments] = useState<EmotionSegment[] | null>(null);
//   const [diveBlocks, setDiveBlocks] = useState<DiveBlock[]>([]);

//   const displayText = formatTextWithSentenceSpacing(text);

//   /** ↓↓↓ 여기부터는 기존 EmotionCard의 핸들러들 거의 그대로 ↓↓↓ */

//   const handleDiveSegment = (segment: EmotionSegment) => {
//     setDiveBlocks((prev) => {
//       const idx = prev.findIndex((b) => b.segment.id === segment.id);

//       if (idx >= 0) {
//         return prev.map((b, i) =>
//           i === idx ? { ...b, segment, isOpen: true } : { ...b, isOpen: false }
//         );
//       }

//       const closedPrev = prev.map((b) => ({ ...b, isOpen: false }));
//       return [
//         ...closedPrev,
//         {
//           segment,
//           isOpen: true,
//           nodes: [createThoughtNode(0)],
//         },
//       ];
//     });

//     onRequestDive?.(segment);
//   };

//   const handleActiveSegmentChange = (segment: EmotionInputSegment | null) => {
//     setDiveBlocks((prev) => {
//       if (!segment) {
//         const anyOpen = prev.some((b) => b.isOpen);
//         if (!anyOpen) return prev;
//         return prev.map((b) => ({ ...b, isOpen: false }));
//       }

//       const idx = prev.findIndex((b) => b.segment.id === segment.id);
//       if (idx === -1) return prev;

//       const alreadyOnlyThisOpen =
//         prev[idx].isOpen &&
//         prev.every((b, i) => (i === idx ? b.isOpen : !b.isOpen));
//       if (alreadyOnlyThisOpen) return prev;

//       return prev.map((b) =>
//         b.segment.id === segment.id
//           ? { ...b, isOpen: true }
//           : { ...b, isOpen: false }
//       );
//     });
//   };

//   const updateNodeValue = (
//     segmentId: string,
//     nodeId: ThoughtNodeId,
//     nextValue: string
//   ) => {
//     setDiveBlocks((prev) =>
//       prev.map((b) =>
//         b.segment.id !== segmentId
//           ? b
//           : {
//               ...b,
//               nodes: b.nodes.map((n) =>
//                 n.id === nodeId ? { ...n, userText: nextValue } : n
//               ),
//             }
//       )
//     );
//   };

//   const diveFromInput = (
//     segmentId: string,
//     nodeId: ThoughtNodeId,
//     textValue: string
//   ) => {
//     if (!textValue.trim()) return;
//     setDiveBlocks((prev) =>
//       lockNodeAndAddDeeper(prev, segmentId, nodeId, textValue)
//     );
//   };

//   const chooseSuggestion = (
//     segmentId: string,
//     nodeId: ThoughtNodeId,
//     suggestion: string
//   ) => {
//     if (!suggestion.trim()) return;
//     setDiveBlocks((prev) =>
//       lockNodeAndAddDeeper(prev, segmentId, nodeId, suggestion)
//     );
//   };

//   const toggleDiveOpen = (segmentId: string) => {
//     setDiveBlocks((prev) => {
//       const target = prev.find((b) => b.segment.id === segmentId);
//       if (!target) return prev;

//       if (target.isOpen) {
//         return prev.map((b) => ({ ...b, isOpen: false }));
//       }

//       return prev.map((b) =>
//         b.segment.id === segmentId
//           ? { ...b, isOpen: true }
//           : { ...b, isOpen: false }
//       );
//     });
//   };

//   const removeDiveBlock = (segmentId: string) => {
//     setDiveBlocks((prev) => prev.filter((b) => b.segment.id !== segmentId));
//   };

//   return (
//     <>
//       <SegmentEditor
//         text={displayText}
//         onConfirm={(result) => {
//           setSegments(result);
//           onSegmentsChange?.(result);
//         }}
//         onDiveSegment={handleDiveSegment}
//         onActiveSegmentChange={handleActiveSegmentChange}
//       />

//       {diveBlocks.length > 0 && (
//         <div className="mt-4 space-y-2">
//           {diveBlocks.map((block) => (
//             <EmotionDiveBlock
//               key={block.segment.id}
//               segment={block.segment}
//               isOpen={block.isOpen}
//               nodes={block.nodes}
//               fullText={text}
//               onToggle={() => toggleDiveOpen(block.segment.id)}
//               onRemove={() => removeDiveBlock(block.segment.id)}
//               onChangeNode={(nodeId, v) =>
//                 updateNodeValue(block.segment.id, nodeId, v)
//               }
//               onDiveFromInput={(nodeId, v) =>
//                 diveFromInput(block.segment.id, nodeId, v)
//               }
//               onChooseSuggestion={(nodeId, v) =>
//                 chooseSuggestion(block.segment.id, nodeId, v)
//               }
//             />
//           ))}
//         </div>
//       )}
//     </>
//   );
// }

// src/components/emotion/EmotionSegmentSection.tsx
"use client";

import { useState } from "react";
import { EmotionDiveBlock } from "./dive/EmotionDiveBlock";
import { SegmentEditor } from "./editor/SegmentEditor";
import type { RegulationGoal } from "./modal/EmotionRegulatonChoiceModal";
import type {
  EmotionInputSegment,
  EmotionSegment,
  ThoughtNode,
  ThoughtNodeId,
} from "./types/emotion.types";

type EmotionContext = {
  emotionId: string;
  emotionName: string;
  intensity: number;
  regulationGoal: RegulationGoal;
};

type Props = {
  text: string;
  onSegmentsChange?: (segments: EmotionSegment[]) => void;
  onRequestDive?: (segment: EmotionSegment) => void;
  emotionContext?: EmotionContext; // 🔹 추가
};

/** UI 전용 타입들 */
type ThoughtNodeWithSuggestions = ThoughtNode & {
  suggestions?: string[];
  locked?: boolean;
};

type DiveBlock = {
  segment: EmotionSegment;
  isOpen: boolean;
  nodes: ThoughtNodeWithSuggestions[];
};

function createThoughtNode(
  level: number,
  userText = "",
  hint?: string
): ThoughtNodeWithSuggestions {
  return {
    id: crypto.randomUUID(),
    level,
    userText,
    hint:
      hint ??
      (level === 0
        ? "이 감정 뒤에 있는 생각이나 장면을 적어보세요."
        : "이 생각 뒤에 있는 더 깊은 생각을 적어보세요."),
    locked: false,
  };
}

function formatTextWithSentenceSpacing(raw: string): string {
  return raw.replace(
    /([.!?…？！。])(\s+)/g,
    (_match, punct: string, spaces: string) => `${punct}${spaces}  `
  );
}

function lockNodeAndAddDeeper(
  blocks: DiveBlock[],
  segmentId: string,
  nodeId: ThoughtNodeId,
  chosenText: string
): DiveBlock[] {
  return blocks.map((b) => {
    if (b.segment.id !== segmentId) return b;

    const updatedNodes = b.nodes.map((n) =>
      n.id === nodeId
        ? {
            ...n,
            userText: chosenText,
            suggestions: undefined,
            locked: true,
          }
        : n
    );

    const parent = updatedNodes.find((n) => n.id === nodeId);
    if (!parent) return b;

    const newNode = createThoughtNode(parent.level + 1);

    return {
      ...b,
      nodes: [...updatedNodes, newNode],
    };
  });
}

export function EmotionSegmentsSection({
  text,
  onSegmentsChange,
  onRequestDive,
  emotionContext,
}: Props) {
  const [segments, setSegments] = useState<EmotionSegment[] | null>(null);
  const [diveBlocks, setDiveBlocks] = useState<DiveBlock[]>([]);

  const displayText = formatTextWithSentenceSpacing(text);

  const handleDiveSegment = (segment: EmotionSegment) => {
    setDiveBlocks((prev) => {
      const idx = prev.findIndex((b) => b.segment.id === segment.id);

      if (idx >= 0) {
        return prev.map((b, i) =>
          i === idx ? { ...b, segment, isOpen: true } : { ...b, isOpen: false }
        );
      }

      const closedPrev = prev.map((b) => ({ ...b, isOpen: false }));
      return [
        ...closedPrev,
        {
          segment,
          isOpen: true,
          nodes: [createThoughtNode(0)],
        },
      ];
    });

    onRequestDive?.(segment);
  };

  const handleActiveSegmentChange = (segment: EmotionInputSegment | null) => {
    setDiveBlocks((prev) => {
      if (!segment) {
        const anyOpen = prev.some((b) => b.isOpen);
        if (!anyOpen) return prev;
        return prev.map((b) => ({ ...b, isOpen: false }));
      }

      const idx = prev.findIndex((b) => b.segment.id === segment.id);
      if (idx === -1) return prev;

      const alreadyOnlyThisOpen =
        prev[idx].isOpen &&
        prev.every((b, i) => (i === idx ? b.isOpen : !b.isOpen));
      if (alreadyOnlyThisOpen) return prev;

      return prev.map((b) =>
        b.segment.id === segment.id
          ? { ...b, isOpen: true }
          : { ...b, isOpen: false }
      );
    });
  };

  const updateNodeValue = (
    segmentId: string,
    nodeId: ThoughtNodeId,
    nextValue: string
  ) => {
    setDiveBlocks((prev) =>
      prev.map((b) =>
        b.segment.id !== segmentId
          ? b
          : {
              ...b,
              nodes: b.nodes.map((n) =>
                n.id === nodeId ? { ...n, userText: nextValue } : n
              ),
            }
      )
    );
  };

  const diveFromInput = (
    segmentId: string,
    nodeId: ThoughtNodeId,
    textValue: string
  ) => {
    if (!textValue.trim()) return;
    setDiveBlocks((prev) =>
      lockNodeAndAddDeeper(prev, segmentId, nodeId, textValue)
    );
  };

  const chooseSuggestion = (
    segmentId: string,
    nodeId: ThoughtNodeId,
    suggestion: string
  ) => {
    if (!suggestion.trim()) return;
    setDiveBlocks((prev) =>
      lockNodeAndAddDeeper(prev, segmentId, nodeId, suggestion)
    );
  };

  const toggleDiveOpen = (segmentId: string) => {
    setDiveBlocks((prev) => {
      const target = prev.find((b) => b.segment.id === segmentId);
      if (!target) return prev;

      if (target.isOpen) {
        return prev.map((b) => ({ ...b, isOpen: false }));
      }

      return prev.map((b) =>
        b.segment.id === segmentId
          ? { ...b, isOpen: true }
          : { ...b, isOpen: false }
      );
    });
  };

  const removeDiveBlock = (segmentId: string) => {
    setDiveBlocks((prev) => prev.filter((b) => b.segment.id !== segmentId));
  };

  return (
    <>
      <SegmentEditor
        text={displayText}
        onConfirm={(result) => {
          setSegments(result);
          onSegmentsChange?.(result);
        }}
        onDiveSegment={handleDiveSegment}
        onActiveSegmentChange={handleActiveSegmentChange}
      />

      {diveBlocks.length > 0 && (
        <div className="mt-4 space-y-2">
          {diveBlocks.map((block) => (
            <EmotionDiveBlock
              key={block.segment.id}
              segment={block.segment}
              isOpen={block.isOpen}
              nodes={block.nodes}
              fullText={text}
              emotionContext={emotionContext}
              onToggle={() => toggleDiveOpen(block.segment.id)}
              onRemove={() => removeDiveBlock(block.segment.id)}
              onChangeNode={(nodeId, v) =>
                updateNodeValue(block.segment.id, nodeId, v)
              }
              onDiveFromInput={(nodeId, v) =>
                diveFromInput(block.segment.id, nodeId, v)
              }
              onChooseSuggestion={(nodeId, v) =>
                chooseSuggestion(block.segment.id, nodeId, v)
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
