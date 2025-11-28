// src/components/emotion/types/emotion.types.ts

import { RelativeRect } from "../utils/splitToCharRects";

/**
 * 텍스트 편집기 안에서 사용하는 "가벼운" 세그먼트 타입.
 * - text, nodes 없이 start/end 인덱스만 들고 있음.
 * - SegmentEditor / 하이라이트 / 핸들 드래그 등 "구간 편집" 로직에서만 사용.
 */
export type EmotionInputSegment = {
  /** 고유 ID (SegmentEditor 내부에서 식별용) */
  id: string;
  /** 텍스트 내에서의 시작 인덱스 (inclusive) */
  start: number;
  /** 텍스트 내에서의 끝 인덱스 (exclusive) */
  end: number;
};

/**
 * 화면에 그려지는 하이라이트/핸들 오버레이용 props 묶음.
 * - segment: 어느 구간을 그릴지
 * - charRects: 각 글자(char)의 좌표 리스트
 * - onStartDrag: 사용자가 구간의 시작/끝 핸들을 드래그할 때 호출
 */
export type EmotionInputOverlay = {
  segment: EmotionInputSegment;
  charRects: RelativeRect[];
  onStartDrag: (edge: "start" | "end") => void;
};

/**
 * 한 세그먼트 안에서 "생각/느낌" 하나를 표현하는 노드.
 * 예: 왜곡된 생각, 진실, 기도 등의 한 줄 텍스트.
 *
 * ⚠ LLM 제안(suggestions)은 도메인 모델에 포함하지 않는다.
 *    - 화면 상의 후보 리스트/로딩 등은 EmotionCard 쪽 UI 상태에서만 관리.
 */
export type ThoughtNode = {
  /** 고유 ID */
  id: ThoughtNodeId;
  /** 노드의 단계/깊이 (0, 1, 2 등 – 트리/단계 표현용) */
  level: number;
  /** 이 노드가 무엇을 쓰는 칸인지 힌트 (placeholder 느낌) */
  hint?: string;
  /** 사용자가 실제로 입력한 텍스트 또는 LLM belief 출력(선택/확정된 값) */
  userText: string;
  // 🔹 LLM이 준 감정 설명을 저장할 필드
  emotionReason?: string;
};

/**
 * 최종 도메인 모델에서 사용하는 "완성된" 감정 세그먼트.
 * - raw text 조각과 그 위치(start/end)
 * - 그 세그먼트에 딸려 있는 ThoughtNode 리스트
 */
export type EmotionSegment = {
  /** 고유 ID (EmotionInputSegment와 1:1 대응 가능) */
  id: EmotionSegmentId;
  /** 이 세그먼트에 해당하는 실제 텍스트 조각 */
  text: string;
  /** 원본 전체 텍스트 내에서의 시작 인덱스 (inclusive) */
  start: number;
  /** 원본 전체 텍스트 내에서의 끝 인덱스 (exclusive) */
  end: number;
  /** 이 구간에 대한 생각/느낌 노드들 */
  nodes: ThoughtNode[];
};

/** 세그먼트 ID 전용 별칭 타입 (가독성, 타입 안전성 용) */
export type EmotionSegmentId = string;

/** ThoughtNode ID 전용 별칭 타입 */
export type ThoughtNodeId = string;
