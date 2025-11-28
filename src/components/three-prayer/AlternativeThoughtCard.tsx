// src/components/three-prayer/AlternativeThoughtCard.tsx
"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onReset: () => void;
};

export function AlternativeThoughtCard({ value, onChange, onReset }: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">대안사고 구성</h2>
        <button className="text-xs text-gray-500 underline" onClick={onReset}>
          초기화
        </button>
      </div>
      <textarea
        className="h-64 w-full resize-none rounded-lg border p-3 outline-none focus:ring"
        placeholder='예) "실패한 적도 있지만, 성공한 경험도 있다. 이번에도 다시 시도해 볼 수 있다."'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
