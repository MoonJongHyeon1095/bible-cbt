// src/components/emotion/EmotionCard.tsx
"use client";

import { useState } from "react";
import { EmotionDiveBlock } from "./dive/EmotionDiveBlock";
import { SegmentEditor } from "./editor/SegmentEditor";
import { TextInput } from "./input/TextInput";
import type {
  EmotionInputSegment,
  EmotionSegment,
  ThoughtNode,
  ThoughtNodeId,
} from "./types/emotion.types";

type EmotionCardProps = {
  value: string;
  onChange: (text: string) => void;
  onReset: () => void;
  onSegmentsChange?: (segments: EmotionSegment[]) => void;
  onRequestDive?: (segment: EmotionSegment) => void;
};

type Mode = "input" | "segments";

/** 이 파일 안에서만 쓰는, suggestions/locked 필드가 추가된 노드 타입 (UI 전용) */
type ThoughtNodeWithSuggestions = ThoughtNode & {
  suggestions?: string[];
  locked?: boolean; // true면 선택이 확정된 노드(더 이상 선택/파고들기 X)
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

/** 문장 사이에 가로 간격(스페이스)을 조금 더 넣기 위한 helper. */
function formatTextWithSentenceSpacing(raw: string): string {
  return raw.replace(
    /([.!?…？！。])(\s+)/g,
    (_match, punct: string, spaces: string) => `${punct}${spaces}  `
  );
}

/** 선택된 텍스트로 현재 노드를 확정 + 다음 단계 빈 노드 추가 (순수 함수) */
function lockNodeAndAddDeeper(
  blocks: DiveBlock[],
  segmentId: string,
  nodeId: ThoughtNodeId,
  chosenText: string
): DiveBlock[] {
  return blocks.map((b) => {
    if (b.segment.id !== segmentId) return b;

    // 1) 해당 노드를 chosenText로 확정하고 suggestions 제거, locked 표시
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

    // 2) 다음 단계용 새 노드 추가 (빈 입력창 + LLM 샘플들)
    const newNode = createThoughtNode(parent.level + 1);

    return {
      ...b,
      nodes: [...updatedNodes, newNode],
    };
  });
}

export function EmotionCard({
  value,
  onChange,
  onReset,
  onSegmentsChange,
  onRequestDive,
}: EmotionCardProps) {
  const [mode, setMode] = useState<Mode>("input");
  const [segments, setSegments] = useState<EmotionSegment[] | null>(null);

  // 여러 문장에 대한 파고들기 블록
  const [diveBlocks, setDiveBlocks] = useState<DiveBlock[]>([]);

  const displayText =
    mode === "segments" ? formatTextWithSentenceSpacing(value) : value;

  const handleReset = () => {
    onReset();
    setSegments(null);
    setDiveBlocks([]);
    setMode("input");
  };

  /** 세그먼트 옆 ↓ 아이콘 눌렀을 때: diveBlock 생성/열기 */
  const handleDiveSegment = (segment: EmotionSegment) => {
    setDiveBlocks((prev) => {
      const idx = prev.findIndex((b) => b.segment.id === segment.id);

      if (idx >= 0) {
        // 이미 있는 세그먼트 → 텍스트/범위 갱신 + 이것만 열기
        return prev.map((b, i) =>
          i === idx ? { ...b, segment, isOpen: true } : { ...b, isOpen: false }
        );
      }

      // 새 세그먼트 → 기존 블록은 모두 접고, 새 블록만 열어서 추가
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

  /** 세그먼트 선택 변경 시: 해당 세그먼트의 카드만 펼치기 */
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

  /** 노드 텍스트 수정 */
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

  /** 직접 입력 기준으로 더 깊이 파고들기 */
  const diveFromInput = (
    segmentId: string,
    nodeId: ThoughtNodeId,
    text: string
  ) => {
    if (!text.trim()) return;
    setDiveBlocks((prev) =>
      lockNodeAndAddDeeper(prev, segmentId, nodeId, text)
    );
  };

  /** LLM 출력 기준으로 더 깊이 파고들기 */
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

  /** 헤더 화살표 클릭: 하나만 열리도록 토글 */
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
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      {/* 제목 */}
      <h2 className="mb-1 text-lg font-semibold">감정 기술</h2>

      {/* 모드별 설명 문구 */}
      <p className="mb-2 text-xs text-gray-500">
        {mode === "input"
          ? "먼저 감정-생각을 자유롭게 기술해주세요."
          : "구간 단위로 자동사고를 추적할 수 있습니다."}
      </p>

      {/* 초기화 버튼 */}
      <button
        className="mb-2 text-xs text-gray-500 underline"
        onClick={handleReset}
      >
        초기화
      </button>

      {/* 입력 모드 */}
      {mode === "input" && (
        <TextInput
          value={value}
          onChange={onChange}
          onNext={() => {
            if (!value.trim()) return;
            setMode("segments");
          }}
        />
      )}

      {/* 구간 편집 모드 */}
      {mode === "segments" && (
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

          {/* 파고들기 토글 리스트 */}
          {diveBlocks.length > 0 && (
            <div className="mt-4 space-y-2">
              {diveBlocks.map((block) => (
                <EmotionDiveBlock
                  key={block.segment.id}
                  segment={block.segment}
                  isOpen={block.isOpen}
                  nodes={block.nodes}
                  fullText={value}
                  onToggle={() => toggleDiveOpen(block.segment.id)}
                  onRemove={() => removeDiveBlock(block.segment.id)}
                  onChangeNode={(nodeId, text) =>
                    updateNodeValue(block.segment.id, nodeId, text)
                  }
                  onDiveFromInput={(nodeId, text) =>
                    diveFromInput(block.segment.id, nodeId, text)
                  }
                  onChooseSuggestion={(nodeId, text) =>
                    chooseSuggestion(block.segment.id, nodeId, text)
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
