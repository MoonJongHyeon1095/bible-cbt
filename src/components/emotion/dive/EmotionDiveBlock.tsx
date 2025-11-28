// src/components/emotion/dive/EmotionDiveBlock.tsx
"use client";

import type {
  EmotionSegment,
  ThoughtNode,
  ThoughtNodeId,
} from "../types/emotion.types";
import { EmotionDiveCard } from "./EmotionDiveCard";

/** 이 파일 안에서만 쓰는, locked 필드가 추가된 타입 (UI 전용) */
type ThoughtNodeWithSuggestions = ThoughtNode & {
  locked?: boolean;
};

type EmotionDiveBlockProps = {
  segment: EmotionSegment;
  isOpen: boolean;
  nodes: ThoughtNodeWithSuggestions[];

  fullText: string;

  onToggle: () => void;
  onRemove: () => void;

  /** 노드 텍스트 변경 */
  onChangeNode: (id: ThoughtNodeId, text: string) => void;

  /** 직접 입력으로 더 깊이 파고들기 */
  onDiveFromInput: (id: ThoughtNodeId, text: string) => void;

  /** LLM 출력 선택으로 더 깊이 파고들기 */
  onChooseSuggestion: (id: ThoughtNodeId, text: string) => void;
};

export function EmotionDiveBlock({
  segment,
  isOpen,
  nodes,
  fullText,
  onToggle,
  onRemove,
  onChangeNode,
  onDiveFromInput,
  onChooseSuggestion,
}: EmotionDiveBlockProps) {
  return (
    <div className="overflow-hidden rounded-md border">
      {/* 헤더: 화살표 + 문장 + 삭제 X */}
      <div className="relative">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2 text-xs"
          onClick={onToggle}
        >
          <span className="shrink-0 text-[11px]">{isOpen ? "▼" : "▶"}</span>
          <span className="flex-1 truncate pr-6 text-left">{segment.text}</span>
        </button>

        <button
          type="button"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[10px] text-gray-400 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ✕
        </button>
      </div>

      {/* 내용: 여러 단계의 자동사고/배후 생각 체인 */}
      {isOpen && (
        <div className="border-t bg-gray-50 px-3 py-2 space-y-5">
          {nodes.map((node, index) => (
            <div key={node.id} className="relative pl-4">
              {/* 위 노드와 연결되는 세로 라인 + 동그라미 */}
              {index > 0 && (
                <div className="absolute left-1 top-0 bottom-3 flex flex-col items-center">
                  <div className="h-full w-px bg-gray-300" />
                  <div className="h-2 w-2 rounded-full border border-gray-400 bg-white" />
                </div>
              )}

              <EmotionDiveCard
                level={node.level}
                value={node.userText}
                hint={node.hint}
                locked={!!node.locked}
                segmentText={segment.text}
                fullText={fullText}
                onChange={(v) => onChangeNode(node.id, v)}
                onDiveFromInput={(text) => onDiveFromInput(node.id, text)}
                onChooseSuggestion={(text) => onChooseSuggestion(node.id, text)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
