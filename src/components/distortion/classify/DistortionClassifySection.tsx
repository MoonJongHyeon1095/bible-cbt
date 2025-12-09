// src/components/distortion/classify/DistortionClassifySection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { COGNITIVE_ERROR_DESCRIPTIONS } from "../constants/cognitiveError";
import type { DistortionRequestPayload } from "../hooks/useDistortionAnalysis";

const COGNITIVE_ERROR_NAMES = Object.keys(
  COGNITIVE_ERROR_DESCRIPTIONS
) as (keyof typeof COGNITIVE_ERROR_DESCRIPTIONS)[];

type Props = {
  /** 이 노드(자동사고)에 대한 전체 payload */
  seed: DistortionRequestPayload | null;

  /** 현재 선택된 인지오류 이름들 (흑백논리, 과잉일반화 ...) */
  selectedErrors: string[];

  /** 선택 변경 시 상위로 올려보내기 */
  onChangeSelectedErrors: (names: string[]) => void;
};

/**
 * 인지오류 10개 리스트 + /api/distortion/classify 호출해서
 * AI 추천을 보여주고, 유저가 최대 2개까지 선택하는 섹션
 */
export function DistortionClassifySection({
  seed,
  selectedErrors,
  onChangeSelectedErrors,
}: Props) {
  const [suggested, setSuggested] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastKey, setLastKey] = useState<string | null>(null);

  // 요약 문장 (상황/세그먼트/자동사고 중 하나)
  const summaryText = useMemo(() => {
    if (!seed) return "";
    return (
      seed.currentThought?.belief?.trim() ||
      seed.segmentText?.trim() ||
      seed.fullText?.trim() ||
      ""
    );
  }, [seed]);

  // 🔁 seed가 바뀔 때만 분류 API 호출 (토글 열고 닫을 때는 재호출 X)
  useEffect(() => {
    if (!seed) {
      setSuggested(null);
      setError(null);
      setLastKey(null);
      return;
    }

    const key = JSON.stringify({
      fullText: seed.fullText,
      segmentText: seed.segmentText,
      belief: seed.currentThought?.belief,
    });

    if (lastKey === key) return; // 같은 생각이면 다시 안 부름
    setLastKey(key);

    void classify(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  async function classify(payload: DistortionRequestPayload) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/distortion/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // empathy와 동일하게 payload 전체를 넘긴다고 가정
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("인지오류를 분석하는 중 문제가 발생했습니다.");
      }

      // 백엔드에서 result: string[] (인지오류 이름 배열) 내려준다고 가정
      const data: { result?: string[] } = await res.json();
      const names =
        data.result?.filter((name) =>
          COGNITIVE_ERROR_NAMES.includes(name as any)
        ) ?? [];

      setSuggested(names);

      // 아직 유저 선택이 없으면, AI 추천 1~2개를 기본 선택으로 세팅
      if (!selectedErrors.length && names.length) {
        onChangeSelectedErrors(names.slice(0, 2));
      }
    } catch (e: any) {
      setError(e?.message ?? "인지오류를 분석하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  const toggleError = (name: string) => {
    if (selectedErrors.includes(name)) {
      onChangeSelectedErrors(selectedErrors.filter((n) => n !== name));
    } else if (selectedErrors.length < 2) {
      onChangeSelectedErrors([...selectedErrors, name]);
    } else {
      // 이미 2개 선택된 상태에서 하나 더 누르면, 가장 오래된 것 교체
      onChangeSelectedErrors([selectedErrors[1], name]);
    }
  };

  const isSuggested = (name: string) => suggested?.includes(name) ?? false;
  const canRetry = !!seed && !isLoading;

  return (
    <Card className="h-full border-orange-100 bg-orange-50/40 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-slate-900">
              인지오류 자동 분류
            </CardTitle>
            <p className="text-xs text-slate-600 leading-relaxed">
              이 자동사고에 대해, 인지행동치료에서 자주 다루는{" "}
              <strong>10가지 인지오류</strong> 중 어떤 것들이 가까운지 함께
              골라봅니다.
            </p>
          </div>

          {seed && (
            <div className="rounded-full bg-white/80 px-3 py-1 text-[11px] text-orange-700 border border-orange-100">
              최대 2가지까지 선택
            </div>
          )}
        </div>

        {summaryText && (
          <p className="rounded-2xl bg-white/80 px-3 py-2 text-xs text-slate-700 italic">
            “{summaryText}”
          </p>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 px-3 py-2 text-[11px] text-red-700">
            {error}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
            <Loader2 className="size-4 animate-spin" />
            <span>이 생각에 담긴 인지오류를 분석하고 있어요...</span>
          </div>
        )}

        {!isLoading && seed && (
          <>
            {/* 10가지 인지오류 리스트 */}
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {COGNITIVE_ERROR_NAMES.map((name) => {
                const selected = selectedErrors.includes(name);
                const suggestedFlag = isSuggested(name);
                const desc = COGNITIVE_ERROR_DESCRIPTIONS[name];

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleError(name)}
                    className={[
                      "w-full rounded-2xl border px-3 py-3 text-left transition-all",
                      selected
                        ? "border-emerald-500 bg-emerald-50/80 shadow-sm"
                        : "border-orange-100 bg-white/80 hover:border-emerald-300 hover:bg-emerald-50/40",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {name}
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                          {desc}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {suggestedFlag && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            AI 추천
                          </span>
                        )}
                        {selected && (
                          <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white">
                            선택됨
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 하단 상태/재분석 버튼 */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                현재{" "}
                <strong className="text-emerald-700">
                  {selectedErrors.length}
                </strong>{" "}
                / 2개 선택됨
              </span>

              {canRetry && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1 px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700"
                  onClick={() => seed && classify(seed)}
                >
                  <RefreshCw className="size-3" />
                  다시 분석하기
                </Button>
              )}
            </div>
          </>
        )}

        {!isLoading && !seed && (
          <p className="py-6 text-center text-xs text-slate-500">
            감정 단계에서 자동사고를 왼쪽으로 보낸 뒤,
            <br />
            이곳에서 인지오류를 함께 살펴볼 수 있어요.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
