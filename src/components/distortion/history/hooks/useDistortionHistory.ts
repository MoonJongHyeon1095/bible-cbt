// // src/components/distortion/history/hooks/useDistortionHistory.ts
// "use client";

// import { useEffect, useState } from "react";
// import type { DistortionRequestPayload } from "../../hooks/useDistortionAnalysis";

// export type HistoryNode = {
//   id: string;
//   text: string;
//   segmentText?: string;
//   emotionName?: string;
//   intensity?: number;
//   payload: DistortionRequestPayload;
// };

// type UseDistortionHistoryResult = {
//   history: HistoryNode[];
//   isExpanded: boolean;
//   toggle: () => void;
//   addFromSeed: (seed: DistortionRequestPayload) => void;
//   deleteNode: (id: string) => void;
//   focusNode: (id: string) => void;
//   activeNode: HistoryNode | null;
// };

// export function useDistortionHistory(
//   seed: DistortionRequestPayload | null
// ): UseDistortionHistoryResult {
//   const [history, setHistory] = useState<HistoryNode[]>([]);
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [activeId, setActiveId] = useState<string | null>(null);

//   // 새로운 seed 들어올 때마다 맨 위에 쌓기 + active 지정
//   useEffect(() => {
//     if (!seed) return;
//     const belief = seed.currentThought?.belief?.trim();
//     if (!belief) return;

//     const node: HistoryNode = {
//       id: crypto.randomUUID(),
//       text: belief,
//       segmentText: seed.segmentText,
//       emotionName: seed.emotionContext?.emotionName,
//       intensity: seed.emotionContext?.intensity,
//       payload: seed,
//     };

//     setHistory((prev) => [node, ...prev]);
//     setActiveId(node.id);
//     setIsExpanded(true);
//   }, [seed]);

//   const toggle = () => {
//     setIsExpanded((prev) => !prev);
//   };

//   const deleteNode = (id: string) => {
//     setHistory((prev) => prev.filter((n) => n.id !== id));
//     setActiveId((prev) => (prev === id ? null : prev));
//   };

//   const focusNode = (id: string) => {
//     setHistory((prev) => {
//       const idx = prev.findIndex((n) => n.id === id);
//       if (idx === -1) return prev;
//       const node = prev[idx];
//       const rest = prev.filter((n) => n.id !== id);
//       return [node, ...rest];
//     });
//     setActiveId(id);
//   };

//   const addFromSeed = (payload: DistortionRequestPayload) => {
//     const belief = payload.currentThought?.belief?.trim();
//     if (!belief) return;

//     const node: HistoryNode = {
//       id: crypto.randomUUID(),
//       text: belief,
//       segmentText: payload.segmentText,
//       emotionName: payload.emotionContext?.emotionName,
//       intensity: payload.emotionContext?.intensity,
//       payload,
//     };

//     setHistory((prev) => [node, ...prev]);
//     setActiveId(node.id);
//     setIsExpanded(true);
//   };

//   const activeNode: HistoryNode | null =
//     history.find((n) => n.id === activeId) ?? history[0] ?? null;

//   return {
//     history,
//     isExpanded,
//     toggle,
//     addFromSeed,
//     deleteNode,
//     focusNode,
//     activeNode,
//   };
// }
"use client";

import { useEffect, useState } from "react";
import type {
  DistortionRequestPayload,
  ThoughtForDistortion,
} from "../../hooks/useDistortionAnalysis";

export type HistoryNode = {
  id: string;
  payload: DistortionRequestPayload;

  // 덮어쓰기 편하게 파생 필드들
  text: string;
  segmentText?: string;
  emotionName?: string;
  intensity?: number;

  // 케밥에 쓸 정렬된 생각 리스트
  thoughts: ThoughtForDistortion[];
};

type UseDistortionHistoryResult = {
  history: HistoryNode[];
  activeNode: HistoryNode | null;
  activeId: string | null;
  addFromSeed: (seed: DistortionRequestPayload) => void;
  deleteNode: (id: string) => void;
  focusNode: (id: string) => void;
};

function buildNode(payload: DistortionRequestPayload): HistoryNode | null {
  const belief = payload.currentThought?.belief?.trim();
  if (!belief) return null;

  const thoughts: ThoughtForDistortion[] = [
    ...(payload.previousThoughts ?? []),
    payload.currentThought,
  ].sort((a, b) => a.level - b.level);

  return {
    id: crypto.randomUUID(),
    payload,
    text: belief,
    segmentText: payload.segmentText,
    emotionName: payload.emotionContext?.emotionName,
    intensity: payload.emotionContext?.intensity,
    thoughts,
  };
}

export function useDistortionHistory(
  seed: DistortionRequestPayload | null
): UseDistortionHistoryResult {
  const [history, setHistory] = useState<HistoryNode[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Emotion 단계에서 새로 왼쪽으로 보내면 자동으로 히스토리에 쌓기
  useEffect(() => {
    if (!seed) return;
    const node = buildNode(seed);
    if (!node) return;

    setHistory((prev) => [node, ...prev]);
    setActiveId(node.id);
  }, [seed]);

  const addFromSeed = (payload: DistortionRequestPayload) => {
    const node = buildNode(payload);
    if (!node) return;

    setHistory((prev) => [node, ...prev]);
    setActiveId(node.id);
  };

  const deleteNode = (id: string) => {
    setHistory((prev) => prev.filter((n) => n.id !== id));

    setActiveId((prevId) => {
      if (prevId !== id) return prevId;
      const next = history.find((n) => n.id !== id);
      return next?.id ?? null;
    });
  };

  const focusNode = (id: string) => {
    setActiveId(id);
  };

  const activeNode = history.find((n) => n.id === activeId) ?? null;

  return { history, activeNode, activeId, addFromSeed, deleteNode, focusNode };
}
