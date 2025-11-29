// src/components/distortion/DistortionCard.tsx
"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onReset: () => void;

  // 🔽 새로 추가 (옵션)
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
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">인지오류 검토</h2>

        <div className="flex items-center gap-2">
          {onRequestAnalysis && (
            <button
              type="button"
              className="rounded-full border px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-50"
              onClick={onRequestAnalysis}
              disabled={isLoading}
            >
              {isLoading ? "분석 중..." : "자동 분석 불러오기"}
            </button>
          )}

          <button
            className="text-xs text-gray-500 underline"
            onClick={onReset}
            type="button"
          >
            초기화
          </button>
        </div>
      </div>

      <textarea
        className="h-64 w-full resize-none rounded-lg border p-3 outline-none focus:ring"
        placeholder='예) "난 항상 실패해. 아무리 해도 소용없어."'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
