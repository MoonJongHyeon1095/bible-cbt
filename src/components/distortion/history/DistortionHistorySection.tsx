// src/components/distortion/history/DistortionHistorySection.tsx
"use client";

import { HistoryToggleCard } from "@/components/ui/history-toggle-card";
import type { ReactNode } from "react";
import type { HistoryNode } from "./hooks/useDistortionHistory";

type Props = {
  history: HistoryNode[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;

  // 각 카드가 열렸을 때 안쪽에 렌더할 내용
  renderDetail?: (node: HistoryNode, isOpen: boolean) => ReactNode;
};

export function DistortionHistorySection({
  history,
  activeId,
  onSelect,
  onDelete,
  renderDetail,
}: Props) {
  if (!history.length) return null;

  return (
    <div className="mt-4 space-y-3">
      {history.map((node) => {
        const isOpen = activeId === node.id;

        return (
          <HistoryToggleCard
            key={node.id}
            emotionName={node.emotionName}
            intensity={node.intensity}
            title={node.text}
            subtitle={node.segmentText}
            isOpen={isOpen}
            onToggle={() => onSelect(node.id)}
            onDelete={() => onDelete(node.id)}
          >
            {renderDetail ? renderDetail(node, isOpen) : null}
          </HistoryToggleCard>
        );
      })}
    </div>
  );
}
