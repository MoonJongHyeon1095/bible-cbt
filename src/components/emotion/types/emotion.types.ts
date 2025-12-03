// src/components/emotion/types/emotion.types.ts
import { RelativeRect } from "../editor/utils/splitToCharRects";

export type EmotionInputSegment = {
  id: string;
  start: number;
  end: number;
  trimEdges?: boolean;
};

export type EmotionInputOverlay = {
  segment: EmotionInputSegment;
  charRects: RelativeRect[];
  onStartDrag: (edge: "start" | "end") => void;
};

export type ThoughtNodeId = string;
export type EmotionSegmentId = string;

export type ThoughtNode = {
  id: ThoughtNodeId;
  level: number;
  hint?: string;
  userText: string;
  // LLM이 준 감정 설명
  emotionReason?: string;
};

export type EmotionSegment = {
  id: EmotionSegmentId;
  text: string;
  start: number;
  end: number;
  nodes: ThoughtNode[];
};
