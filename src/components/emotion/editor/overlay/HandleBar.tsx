// src/components/emotion/editor/overlay/HandleBar.tsx
"use client";

import type React from "react";

type HandleBarProps = {
  top: number;
  left: number;
  className?: string;
  height: number;
  style?: React.CSSProperties;
  onMouseDown: () => void;
};

export function HandleBar({
  top,
  left,
  className,
  height,
  style,
  onMouseDown,
}: HandleBarProps) {
  return (
    <button
      type="button"
      className={`
        absolute
        -translate-x-1/2 -translate-y-1/2
        w-[4px]
        rounded-full cursor-ew-resize
        opacity-80 hover:opacity-100
        transition-opacity transition-transform
        ${className ?? ""}
      `}
      style={{
        left,
        top,
        height,
        zIndex: 50,
        ...style,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onMouseDown();
      }}
    />
  );
}
