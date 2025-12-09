// src/components/ui/thought-timeline-kebab.tsx
"use client";

import type { ThoughtForDistortion } from "@/components/distortion/hooks/useDistortionAnalysis";

type Item = ThoughtForDistortion & {
  isCurrent?: boolean;
};

type Props = {
  items: Item[];
};

export function ThoughtTimelineKebab({ items }: Props) {
  if (!items.length) return null;

  return (
    <div className="relative mt-1 pl-4">
      {/* 세로 라인 */}
      <div className="pointer-events-none absolute left-1 top-1 bottom-1 w-px bg-slate-200" />

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.level} className="relative flex items-start gap-2">
            {/* 동글뱅이 */}
            <div className="mt-1">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  item.isCurrent ? "bg-fuchsia-500" : "bg-emerald-400"
                }`}
              />
            </div>

            {/* 문장 */}
            <div className="space-y-0.5">
              <p
                className={`text-xs leading-relaxed ${
                  item.isCurrent
                    ? "font-semibold text-slate-900"
                    : "text-slate-700"
                }`}
              >
                {item.belief}
              </p>
              {item.emotionReason && (
                <p className="text-[11px] italic text-slate-500">
                  {item.emotionReason}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
