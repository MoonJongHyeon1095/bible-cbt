// src/components/emotion/editor/TextLayer.tsx
"use client";

import { useEffect } from "react";
import { splitToCharRects, type RelativeRect } from "../utils/splitToCharRects";

type TextLayerProps = {
  text: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onCharRectsChange: (rects: RelativeRect[]) => void;
};

export function TextLayer({
  text,
  containerRef,
  onCharRectsChange,
}: TextLayerProps) {
  useEffect(() => {
    const rects = splitToCharRects(containerRef.current);
    onCharRectsChange(rects);
  }, [text, containerRef, onCharRectsChange]);

  return (
    <div className="whitespace-pre-wrap text-s leading-relaxed font-sans text-gray-800">
      {text.split("").map((ch, idx) => (
        <span key={idx} data-idx={idx}>
          {ch}
        </span>
      ))}
    </div>
  );
}
