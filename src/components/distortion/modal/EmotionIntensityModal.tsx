// src/components/EmotionIntensityModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Heart, Info } from "lucide-react";

interface EmotionIntensityModalProps {
  open: boolean;
  emotion: string;
  currentIntensity: number;
  targetIntensity: number;
  onTargetIntensityChange: (value: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EmotionIntensityModal({
  open,
  emotion,
  currentIntensity,
  targetIntensity,
  onTargetIntensityChange,
  onConfirm,
  onCancel,
}: EmotionIntensityModalProps) {
  const changeLabel =
    targetIntensity < currentIntensity * 0.3
      ? "크게 낮추기"
      : targetIntensity < currentIntensity * 0.6
      ? "중간 정도 낮추기"
      : "조금만 낮추기";

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="max-w-xl rounded-3xl border border-slate-200 bg-slate-50/95 px-6 py-6 shadow-xl sm:max-w-2xl">
        <DialogTitle className="sr-only">감정 강도 조절하기</DialogTitle>
        <DialogDescription className="sr-only">
          {emotion} 감정을 현재 강도에서 목표 강도로 조절하는 단계입니다.
        </DialogDescription>

        <div className="space-y-8">
          {/* 헤더 */}
          <header className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">
              <Heart className="size-3" />
              <span>{emotion} 감정 강도 조절</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              지금 느끼는 감정을 어느 정도까지 줄이고 싶나요?
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              감정을 완전히 없애기보다는, 나를 지켜주면서도 일상을 살 수 있을
              정도의 수준까지 조절해 보는 단계입니다.
            </p>
          </header>

          {/* 간단 안내 */}
          <section className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 size-4 text-slate-500" />
              <div className="space-y-1">
                <p>
                  감정은 나에게 중요한 신호라서 완전히 0점으로 없앨 필요는
                  없어요. 다만 너무 높은 강도는 나를 소진시킬 수 있기 때문에,
                  “지금보다 어느 정도 낮추면 숨이 조금 트일까?” 를 생각하며
                  숫자를 골라보면 좋습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 현재 강도 + 목표 강도 */}
          <section className="grid gap-4 sm:grid-cols-2">
            {/* 현재 강도 카드 */}
            <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-5 text-center">
              <p className="mb-2 text-xs font-medium text-slate-500">
                현재 강도
              </p>
              <p className="mb-3 text-sm text-slate-700">
                지금 느끼는 "{emotion}" 감정의 세기
              </p>
              <div className="text-4xl font-bold text-rose-600 sm:text-5xl">
                {currentIntensity}
                <span className="ml-1 text-base font-normal text-slate-400">
                  /100
                </span>
              </div>
            </div>

            {/* 목표 강도 카드 + 슬라이더 */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-5">
              <p className="mb-2 text-xs font-medium text-emerald-700">
                목표 강도
              </p>
              <p className="mb-3 text-sm text-slate-700">
                이 작업을 마쳤을 때, 어느 정도까지 내려가 있으면 좋을까요?
              </p>

              <div className="mb-4 text-center">
                <div className="text-3xl font-bold text-emerald-700 sm:text-4xl">
                  {targetIntensity}
                  <span className="ml-1 text-base font-normal text-slate-400">
                    /100
                  </span>
                </div>
                <p className="mt-1 text-xs text-emerald-800">{changeLabel}</p>
              </div>

              <div className="space-y-2">
                <Slider
                  value={[targetIntensity]}
                  onValueChange={([value]) => onTargetIntensityChange(value)}
                  max={currentIntensity}
                  min={0}
                  step={5}
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>0 (거의 해소됨)</span>
                  <span>{currentIntensity} (지금)</span>
                </div>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                0점이 아니어도 괜찮아요. “지금보다 이 정도면 조금 숨 쉴 수
                있겠다” 싶은 숫자를 골라 주시면 됩니다.
              </p>
            </div>
          </section>

          {/* 버튼 영역 */}
          <footer className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              className="flex-1 py-3 text-sm border-slate-300"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              variant="primary"
              className="flex-1 py-3 text-sm"
            >
              이 목표로 진행하기
            </Button>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
