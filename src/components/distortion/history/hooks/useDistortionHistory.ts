// src/components/distortion/history/hooks/useDistortionHistory.ts
"use client";

import { useEffect, useState } from "react";
import type {
  DistortionRequestPayload,
  ThoughtForDistortion,
} from "../../hooks/useDistortionAnalysis";

export type HistoryNode = {
  id: string;
  payload: DistortionRequestPayload;

  // 카드 헤더용 파생 필드
  text: string;
  segmentText?: string;
  emotionName?: string;
  intensity?: number;

  // 케밥 타임라인용
  thoughts: ThoughtForDistortion[];
};

type UseDistortionHistoryResult = {
  history: HistoryNode[];
  activeNode: HistoryNode | null;
  activeId: string | null;
  addFromSeed: (seed: DistortionRequestPayload) => void;
  deleteNode: (id: string) => void;
  focusNode: (id: string) => void;
  clearActive: () => void;
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
    // 지운 게 active였다면 닫기
    setActiveId((prevId) => (prevId === id ? null : prevId));
  };

  const focusNode = (id: string) => {
    setActiveId(id);
  };

  const clearActive = () => {
    setActiveId(null);
  };

  const activeNode = history.find((n) => n.id === activeId) ?? null;

  return {
    history,
    activeNode,
    activeId,
    addFromSeed,
    deleteNode,
    focusNode,
    clearActive,
  };
}
