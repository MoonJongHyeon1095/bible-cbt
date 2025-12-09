// src/components/distortion/DistortionLayout.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ThoughtTimelineKebab } from "../ui/thought-timeline-kebab";
import { DistortionClassifySection } from "./classify/DistortionClassifySection";
import { DistortionEmpathySection } from "./empathy/DistortionEmpathySection";
import { useDistortionEmpathy } from "./empathy/hooks/useDistortionEmpathy";
import { DistortionHistorySection } from "./history/DistortionHistorySection";
import { useDistortionHistory } from "./history/hooks/useDistortionHistory";
import type { DistortionRequestPayload } from "./hooks/useDistortionAnalysis";

type DistortionLayoutProps = {
  distortionValue: string;
  isLoading?: boolean; // 지금은 안 쓰이지만, 이후 확장용으로 남겨둠
  onChange: (v: string) => void;
  onReset: () => void;
  onRequestAnalysis: () => void;
  seed: DistortionRequestPayload | null;
};

export function DistortionLayout({
  distortionValue,
  isLoading,
  onChange,
  onReset,
  onRequestAnalysis,
  seed,
}: DistortionLayoutProps) {
  // 🔹 히스토리(왼쪽으로 넘긴 생각들)
  const { history, activeNode, activeId, deleteNode, focusNode, clearActive } =
    useDistortionHistory(seed);

  // 현재 선택된 노드 기준 seed (없으면 prop seed)
  const activeSeed: DistortionRequestPayload | null =
    activeNode?.payload ?? seed ?? null;

  // 🔹 공감문 상태 (노드별로 관리하는 훅이라고 가정)
  const {
    getEmpathy,
    isLoadingFor: isEmpathyLoadingFor,
    runEmpathy,
    reset: resetEmpathy,
  } = useDistortionEmpathy();

  const empathyKey = activeNode?.id ?? null;
  const empathy = getEmpathy(empathyKey);
  const isEmpathyLoading = isEmpathyLoadingFor(empathyKey);

  // 노드별 "공감문 읽음" 상태
  const [hasReadMap, setHasReadMap] = useState<Record<string, boolean>>({});

  const hasReadEmpathy = empathyKey ? !!hasReadMap[empathyKey] : false;

  // 🔹 노드별 인지오류 선택 상태 (예: { [nodeId]: ["흑백논리", "과잉일반화"] })
  const [selectedErrorMap, setSelectedErrorMap] = useState<
    Record<string, string[]>
  >({});

  const selectedErrors =
    empathyKey && selectedErrorMap[empathyKey]
      ? selectedErrorMap[empathyKey]
      : [];

  const handleChangeSelectedErrors = (names: string[]) => {
    if (!empathyKey) return;
    setSelectedErrorMap((prev) => ({
      ...prev,
      [empathyKey]: names,
    }));
  };

  // 🔁 activeSeed / activeNode 바뀔 때:
  // - 해당 key에 공감문이 없으면 API 호출
  // - 이미 있으면 훅 내부에서 재호출 안 하도록 막혀 있다고 가정
  useEffect(() => {
    if (!activeSeed || !empathyKey) return;
    runEmpathy(empathyKey, activeSeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSeed, empathyKey]);

  const handleResetAll = () => {
    onReset();

    if (empathyKey) {
      // 현재 노드의 공감문 / 읽음 상태 / 인지오류 선택만 리셋
      resetEmpathy(empathyKey);
      setHasReadMap((prev) => {
        const { [empathyKey]: _, ...rest } = prev;
        return rest;
      });
      setSelectedErrorMap((prev) => {
        const { [empathyKey]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  // 📦 카드 안에 들어갈 “현재 노드에 대한 상세 블록”
  const detailBlock =
    (activeSeed || distortionValue) && empathyKey ? (
      <div className="space-y-4">
        {/* 1) 공감문 (아직 안 읽었을 때만 노출) */}
        {activeSeed && !hasReadEmpathy && (
          <div className="space-y-3 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/80 to-indigo-50/80 px-4 py-4">
            {isEmpathyLoading && (
              <p className="text-sm text-slate-600">
                당신의 마음을 천천히 읽고 있어요...
              </p>
            )}

            {!isEmpathyLoading && empathy && (
              <>
                <DistortionEmpathySection empathy={empathy} />

                <Button
                  type="button"
                  size="sm"
                  className="mt-2 w-full bg-fuchsia-500 text-white hover:bg-fuchsia-600"
                  onClick={() =>
                    setHasReadMap((prev) => ({ ...prev, [empathyKey]: true }))
                  }
                >
                  다음
                </Button>
              </>
            )}
          </div>
        )}

        {/* 2) 공감문을 읽었거나, seed 없이 자유 입력으로 쓰는 경우 → 인지오류 섹션 */}
        {(!activeSeed || hasReadEmpathy) && (
          <>
            <DistortionClassifySection
              seed={activeSeed}
              selectedErrors={selectedErrors}
              onChangeSelectedErrors={handleChangeSelectedErrors}
            />

            {/* 필요한 경우: 여기서 selectedErrors를 바깥(대안사고 단계 등)에 넘기고 싶으면
               - handleChangeSelectedErrors 안에서 상위 콜백 호출하거나
               - useEffect로 selectedErrors 변화를 감지해서 onChange(...) 등으로 전달하면 됨 */}
          </>
        )}
      </div>
    ) : null;

  return (
    <section className="space-y-4">
      {/* 상단 타이틀 */}
      <header className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/90 to-teal-500/90 px-4 py-1.5 text-xs font-medium text-white shadow-md">
          <span className="text-sm">인지오류 검토</span>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">
          지금 이 생각을 한 발 떨어져서 바라보기
        </h2>
      </header>

      {/* 히스토리 카드들 + 각 카드 안 상세 내용 */}
      <DistortionHistorySection
        history={history}
        activeId={activeId}
        onSelect={(id) => {
          // 같은 카드 다시 누르면 닫기, 다른 카드 누르면 그 카드로 전환
          if (activeId === id) {
            clearActive();
          } else {
            focusNode(id);
          }
        }}
        onDelete={deleteNode}
        renderDetail={(node, isOpen) =>
          isOpen ? (
            <>
              {/* ➊ level 오름차순 케밥 타임라인 */}
              <ThoughtTimelineKebab
                items={node.thoughts.map((t) => ({
                  ...t,
                  isCurrent: t.level === node.payload.currentThought.level,
                }))}
              />
              {/* ➋ 케밥과 공감문/인지오류 섹션 사이 여백 */}
              {detailBlock && <div className="mt-6">{detailBlock}</div>}
            </>
          ) : null
        }
      />
    </section>
  );
}
