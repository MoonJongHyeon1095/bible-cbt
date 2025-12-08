// src/components/distortion/DistortionSection.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DistortionClassifySection } from "./classify/DistortionClassifySection";
import { CognitiveErrorExplanationModal } from "./CognitveErrorExplanationModal";
import { COGNITIVE_ERROR_DESCRIPTIONS } from "./constants/cognitiveError";
import { DistortionEmpathySection } from "./empathy/DistortionEmpathySection";
import { useDistortionEmpathy } from "./empathy/hooks/useDistortionEmpathy";
import { DistortionHistorySection } from "./history/DistortionHistorySection";
import { useDistortionHistory } from "./history/hooks/useDistortionHistory";
import type { DistortionRequestPayload } from "./hooks/useDistortionAnalysis";

const COGNITIVE_ERROR_NAMES = [
  "흑백논리",
  "과잉일반화",
  "독심술",
  "파국화",
  "감정적 추론",
  "당위적 사고",
  "명명화",
  "개인화",
  "긍정 할인",
  "확대와 축소",
];

type DistortionSectionProps = {
  distortionValue: string;
  isLoading?: boolean;
  onChange: (v: string) => void;
  onReset: () => void;
  onRequestAnalysis: () => void;
  seed: DistortionRequestPayload | null;
};

export function DistortionSection({
  distortionValue,
  isLoading,
  onChange,
  onReset,
  onRequestAnalysis,
  seed,
}: DistortionSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedErrorName, setSelectedErrorName] = useState<string | null>(
    null
  );
  const [hasReadEmpathy, setHasReadEmpathy] = useState(false);

  const {
    empathy,
    isLoading: isEmpathyLoading,
    runEmpathy,
    reset: resetEmpathy,
  } = useDistortionEmpathy();

  const { history, activeNode, activeId, deleteNode, focusNode } =
    useDistortionHistory(seed);

  // 현재 선택된 노드 기반 seed (없으면 prop seed 사용)
  const activeSeed: DistortionRequestPayload | null =
    activeNode?.payload ?? seed ?? null;

  const fullText = activeSeed?.fullText ?? "";
  const segmentText = activeSeed?.segmentText ?? "";
  const currentThought = activeSeed?.currentThought;
  const emotionContext = activeSeed?.emotionContext;

  const userThought =
    currentThought?.belief || distortionValue || segmentText || fullText;

  const errorDescription =
    (selectedErrorName && COGNITIVE_ERROR_DESCRIPTIONS[selectedErrorName]) ??
    "";

  // activeSeed 바뀔 때마다 공감문/플래그 리셋 + 새 공감문 요청
  useEffect(() => {
    if (!activeSeed) {
      resetEmpathy();
      setHasReadEmpathy(false);
      return;
    }
    resetEmpathy();
    setHasReadEmpathy(false);
    runEmpathy(activeSeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSeed]);

  const handleResetAll = () => {
    onReset();
    setSelectedErrorName(null);
    setHasReadEmpathy(false);
    resetEmpathy();
  };

  // 🔽 토글 박스 안에 들어갈 상세 블록
  const detailBlock =
    activeSeed || distortionValue ? (
      <div className="space-y-4">
        {/* 현재 선택된 자동사고 한 줄 요약 */}
        {activeSeed && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs sm:text-[13px]">
            <p className="mb-1 flex flex-wrap items-center gap-2 text-emerald-900 font-medium">
              {emotionContext ? (
                <>
                  <span>{emotionContext.emotionName}</span>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] text-emerald-700">
                    강도 {emotionContext.intensity}
                  </span>
                </>
              ) : (
                <span>현재 살펴보는 자동사고</span>
              )}
            </p>
            {currentThought?.belief ? (
              <p className="italic text-slate-800">"{currentThought.belief}"</p>
            ) : (
              segmentText && (
                <p className="italic text-slate-800">"{segmentText}"</p>
              )
            )}
          </div>
        )}

        {/* 1) 공감문 */}
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
                  onClick={() => setHasReadEmpathy(true)}
                >
                  이 공감문은 읽어봤어요 · 이제 왜곡된 생각 정리해볼게요
                </Button>
              </>
            )}
          </div>
        )}

        {/* 2) 공감문을 읽었거나, seed 없이 자유 입력으로 쓰는 경우 */}
        {(!activeSeed || hasReadEmpathy) && (
          <>
            <DistortionClassifySection
              value={distortionValue}
              onChange={onChange}
              onReset={handleResetAll}
              isLoading={isLoading}
              onRequestAnalysis={activeSeed ? onRequestAnalysis : undefined}
            />

            {/* 3) activeSeed가 있을 때만 인지 오류 후보 선택 영역 */}
            {activeSeed && (
              <>
                <div className="mt-4 space-y-3 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/80 to-amber-50/80 px-4 py-4">
                  <p className="text-[13px] font-medium text-orange-900">
                    이 생각은 어떤 인지오류에 더 가까운가요?
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {COGNITIVE_ERROR_NAMES.map((name) => (
                      <Button
                        key={name}
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="rounded-full border-orange-200 bg-white/80 px-3 py-1 text-[11px] text-orange-800 hover:bg-orange-50"
                        onClick={() => {
                          setSelectedErrorName(name);
                          setModalOpen(true);
                        }}
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedErrorName && (
                  <CognitiveErrorExplanationModal
                    open={modalOpen}
                    errorName={selectedErrorName}
                    errorDescription={errorDescription}
                    userThought={userThought}
                    userExperience={fullText}
                    onClose={() => setModalOpen(false)}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    ) : null;

  return (
    <section className="space-y-4">
      {/* 상단 타이틀 */}
      <header className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/90 to-teal-500/90 px-4 py-1.5 text-xs font-medium text-white shadow-md">
          <span>좌측 (2)</span>
          <span className="text-sm">인지오류 검토</span>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">
          지금 이 생각을 한 발 떨어져서 바라보기
        </h2>
      </header>

      {/* 이제 박스는 이 토글 하나뿐이고, 안쪽에 상세내용이 다 들어감 */}
      <DistortionHistorySection
        history={history}
        activeId={activeId}
        onSelect={focusNode}
        onDelete={deleteNode}
      />
    </section>
  );
}
