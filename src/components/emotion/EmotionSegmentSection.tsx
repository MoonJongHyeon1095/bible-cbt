// // src/components/emotion/EmotionSegmentSection.tsx
// "use client";

// import { useState } from "react";
// import { EmotionDiveBlock } from "./dive/EmotionDiveBlock";
// import { SegmentEditor } from "./editor/SegmentEditor";
// import type { RegulationGoal } from "./modal/EmotionRegulatonChoiceModal";
// import type {
//   EmotionInputSegment,
//   EmotionSegment,
//   ThoughtNode,
//   ThoughtNodeId,
// } from "./types/emotion.types";

// type EmotionContext = {
//   emotionId: string;
//   emotionName: string;
//   intensity: number;
//   regulationGoal: RegulationGoal;
// };

// type Props = {
//   text: string;
//   onSegmentsChange?: (segments: EmotionSegment[]) => void;
//   onRequestDive?: (segment: EmotionSegment) => void;
//   emotionContext?: EmotionContext; // 🔹 추가
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
//   emotionContext,
// }: Props) {
//   const [segments, setSegments] = useState<EmotionSegment[] | null>(null);
//   const [diveBlocks, setDiveBlocks] = useState<DiveBlock[]>([]);

//   const displayText = formatTextWithSentenceSpacing(text);

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
//               emotionContext={emotionContext}
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
  emotionContext?: EmotionContext;
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

// 🔹 belief / emotionReason 둘 다 저장할 수 있게 payload 타입 정의
type LockPayload = {
  belief: string;
  emotionReason?: string;
};

function lockNodeAndAddDeeper(
  blocks: DiveBlock[],
  segmentId: string,
  nodeId: ThoughtNodeId,
  chosen: LockPayload
): DiveBlock[] {
  return blocks.map((b) => {
    if (b.segment.id !== segmentId) return b;

    const updatedNodes = b.nodes.map((n) =>
      n.id === nodeId
        ? {
            ...n,
            userText: chosen.belief, // 🔹 핵심 문장
            emotionReason: chosen.emotionReason, // 🔹 부연 설명 같이 저장
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
      lockNodeAndAddDeeper(prev, segmentId, nodeId, {
        belief: textValue,
      })
    );
  };

  const chooseSuggestion = (
    segmentId: string,
    nodeId: ThoughtNodeId,
    belief: string,
    emotionReason?: string
  ) => {
    if (!belief.trim()) return;
    setDiveBlocks((prev) =>
      lockNodeAndAddDeeper(prev, segmentId, nodeId, {
        belief,
        emotionReason,
      })
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
              onChooseSuggestion={(nodeId, belief, emotionReason) =>
                chooseSuggestion(
                  block.segment.id,
                  nodeId,
                  belief,
                  emotionReason
                )
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
