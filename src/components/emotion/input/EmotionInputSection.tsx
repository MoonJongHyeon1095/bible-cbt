// src/components/emotion/input/EmotionInputSection.tsx
"use client";

import { EmotionExamples } from "../EmotionExamples";
import { TextInput } from "./TextInput";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
};

export function EmotionInputSection({ value, onChange, onNext }: Props) {
  return (
    <div className="mt-2 space-y-3">
      <TextInput value={value} onChange={onChange} onNext={onNext} />

      <EmotionExamples
        onSelect={(exampleText) => {
          onChange(exampleText);
        }}
      />
    </div>
  );
}
