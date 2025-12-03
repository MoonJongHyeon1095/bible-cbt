// src/components/alternative/AlternativeThoughtCard.tsx
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
};

export function AlternativeThoughtCard({ value, onChange, onReset }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>대안사고 구성</CardTitle>
          <CardDescription>
            상황을 더 균형 있게 보는 문장을 만들어 봅니다. 사실에 근거하면서도
            너무 가혹하지 않은 시선을 담아주세요.
          </CardDescription>
        </div>

        <button
          className="text-[11px] text-gray-500 underline sm:text-xs"
          onClick={onReset}
          type="button"
        >
          초기화
        </button>
      </CardHeader>

      <CardContent>
        <textarea
          className="h-72 w-full resize-none rounded-2xl border px-4 py-3 text-sm leading-relaxed outline-none focus:ring focus:ring-indigo-100"
          placeholder='예) "실패한 적도 있지만, 성공한 경험도 있다. 이번에도 다시 시도해 볼 수 있다."'
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
