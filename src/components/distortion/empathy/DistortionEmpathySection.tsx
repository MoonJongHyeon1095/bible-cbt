// src/components/distortion/empathy/DistortionEmpathyCard.tsx
"use client";

import type { DistortionEmpathy } from "./hooks/useDistortionEmpathy";

type Props = {
  empathy: DistortionEmpathy | null;
};

export function DistortionEmpathySection({ empathy }: Props) {
  if (!empathy) return null;

  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-800">
      {empathy.thoughtEmpathy && <p>{empathy.thoughtEmpathy}</p>}
      {empathy.emotionEmpathy && <p>{empathy.emotionEmpathy}</p>}
      {empathy.iStatement && (
        <p className="text-sky-900">{empathy.iStatement}</p>
      )}
      {empathy.soothing && (
        <p className="text-indigo-900 font-medium">{empathy.soothing}</p>
      )}
      {empathy.question && (
        <p className="mt-1 text-xs text-slate-600">{empathy.question}</p>
      )}
    </div>
  );
}
