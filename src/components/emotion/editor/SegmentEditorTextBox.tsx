// src/components/emotion/editor/SegmentEditorTextBox.tsx
"use client";

import { useEffect } from "react";
import { splitToCharRects, type RelativeRect } from "./utils/splitToCharRects";

type TextLayerProps = {
  text: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onCharRectsChange: (rects: RelativeRect[]) => void;
};

export function SegmentEditorTextBox({
  text,
  containerRef,
  onCharRectsChange,
}: TextLayerProps) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let frameId: number | null = null;

    const measure = () => {
      const target = containerRef.current;
      if (!target) return;
      const rects = splitToCharRects(target);
      onCharRectsChange(rects);
      frameId = null;
    };

    const requestMeasure = () => {
      if (frameId != null) return;
      frameId = requestAnimationFrame(measure);
    };

    // 텍스트 바뀔 때 한 번
    requestMeasure();

    const observer = new ResizeObserver(() => {
      requestMeasure();
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frameId != null) cancelAnimationFrame(frameId);
    };
  }, [text, containerRef, onCharRectsChange]);

  return (
    <div className="whitespace-pre-wrap leading-relaxed break-words text-base text-slate-800">
      {text.split("").map((ch, idx) => (
        <span key={idx} data-idx={idx}>
          {ch}
        </span>
      ))}
    </div>
  );
}
