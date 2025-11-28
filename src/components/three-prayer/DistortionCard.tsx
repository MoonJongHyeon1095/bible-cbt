// src/components/three-prayer/DistortionCard.tsx
"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onReset: () => void;
};

export function DistortionCard({ value, onChange, onReset }: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">인지오류 검토</h2>
        <button className="text-xs text-gray-500 underline" onClick={onReset}>
          초기화
        </button>
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
