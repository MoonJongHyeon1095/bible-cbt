// src/components/distortion/DistortionCard.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onReset: () => void;

  isLoading?: boolean;
  onRequestAnalysis?: () => void;
};

export function DistortionCard({
  value,
  onChange,
  onReset,
  isLoading,
  onRequestAnalysis,
}: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>인지오류 검토</CardTitle>
          <CardDescription>
            자동사고 속에 숨은 왜곡된 생각, 과장된 해석, 흑백논리 등을 차분히
            적어보세요.
          </CardDescription>
        </div>

        <div className="flex flex-col items-end gap-1 text-xs sm:text-[13px]">
          {onRequestAnalysis && (
            <button
              type="button"
              className="rounded-full border px-3 py-1 text-[11px] text-gray-600 hover:bg-gray-50 disabled:opacity-60"
              onClick={onRequestAnalysis}
              disabled={isLoading}
            >
              {isLoading ? "분석 중..." : "자동 분석"}
            </button>
          )}

          <button
            className="text-[11px] text-gray-500 underline sm:text-xs"
            onClick={onReset}
            type="button"
          >
            초기화
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <textarea
          className="h-72 w-full resize-none rounded-2xl border px-4 py-3 text-sm leading-relaxed outline-none focus:ring focus:ring-indigo-100"
          placeholder='예) "난 항상 실패해. 아무리 해도 소용없어."'
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
