// src/components/emotion/EmotionSegmentSection.tsx
"use client";

import type {
  DistortionRequestPayload,
  ThoughtForDistortion,
} from "@/components/distortion/hooks/useDistortionAnalysis";
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

  // 🔽 새로 추가: 인지오류 카드로 넘기는 콜백
  onMoveThoughtToDistortion?: (payload: DistortionRequestPayload) => void;
};

/** UI 전용 타입들 */
type ThoughtNodeWithSuggestions = ThoughtNode & {
  suggestions?: string[];
  locked?: boolean;
};

type DiveBlock = {
  segment: EmotionSegment;
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

// belief / emotionReason 둘 다 저장할 수 있게 payload 타입 정의
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
            userText: chosen.belief,
            emotionReason: chosen.emotionReason,
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
  onMoveThoughtToDistortion,
}: Props) {
  const [segments, setSegments] = useState<EmotionSegment[] | null>(null);
  const [diveBlocks, setDiveBlocks] = useState<DiveBlock[]>([]);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);

  const displayText = formatTextWithSentenceSpacing(text);

  /** 에디터에서 “파고들기” 화살표 눌렀을 때 */
  const handleDiveSegment = (segment: EmotionSegment) => {
    setDiveBlocks((prev) => {
      const idx = prev.findIndex((b) => b.segment.id === segment.id);

      if (idx >= 0) {
        // 이미 있는 블록이면 segment 정보만 최신으로 갱신
        return prev.map((b, i) => (i === idx ? { ...b, segment } : b));
      }

      // 새 블록 추가
      return [
        ...prev,
        {
          segment,
          nodes: [createThoughtNode(0)],
        },
      ];
    });

    // 이 세그먼트를 “현재 활성 세그먼트”로
    setActiveSegmentId(segment.id);
    onRequestDive?.(segment);
  };

  /** 에디터에서 세그먼트 클릭 등으로 활성 세그먼트가 바뀌었을 때 */
  const handleEditorActiveChange = (segment: EmotionInputSegment | null) => {
    const id = segment?.id ?? null;
    setActiveSegmentId(id);
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

  /** 인지오류 카드로 보내기 */
  const handleMoveLeftForNode = (
    segment: EmotionSegment,
    node: ThoughtNodeWithSuggestions,
    allNodes: ThoughtNodeWithSuggestions[]
  ) => {
    if (!onMoveThoughtToDistortion) return;

    const belief = node.userText.trim();
    if (!belief) return;

    const currentThought: ThoughtForDistortion = {
      level: node.level,
      belief,
      emotionReason: node.emotionReason,
    };

    const previousThoughts: ThoughtForDistortion[] = allNodes
      .filter((n) => n.level < node.level && n.userText.trim())
      .sort((a, b) => a.level - b.level)
      .map((n) => ({
        level: n.level,
        belief: n.userText,
        emotionReason: n.emotionReason,
      }));

    const payload: DistortionRequestPayload = {
      fullText: text,
      segmentText: segment.text,
      currentThought,
      ...(previousThoughts.length ? { previousThoughts } : {}),
      ...(emotionContext ? { emotionContext } : {}),
    };

    onMoveThoughtToDistortion(payload);
  };

  /** 아래 블록 헤더 토글 클릭 */
  const toggleDiveOpen = (segmentId: string) => {
    setActiveSegmentId((prev) => (prev === segmentId ? null : segmentId));
  };

  const removeDiveBlock = (segmentId: string) => {
    setDiveBlocks((prev) => prev.filter((b) => b.segment.id !== segmentId));
    setActiveSegmentId((prev) => (prev === segmentId ? null : prev));
  };

  return (
    <>
      <SegmentEditor
        text={displayText}
        activeSegmentId={activeSegmentId}
        onConfirm={(result) => {
          setSegments(result);
          onSegmentsChange?.(result);
        }}
        onDiveSegment={handleDiveSegment}
        onActiveSegmentChange={handleEditorActiveChange}
      />

      {diveBlocks.length > 0 && (
        <div className="mt-4 space-y-2">
          {diveBlocks.map((block) => (
            <EmotionDiveBlock
              key={block.segment.id}
              segment={block.segment}
              isOpen={activeSegmentId === block.segment.id}
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
              onMoveLeft={(node) =>
                handleMoveLeftForNode(block.segment, node, block.nodes)
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
