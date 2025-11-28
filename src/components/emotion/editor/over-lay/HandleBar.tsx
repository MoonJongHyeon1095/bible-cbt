// src/components/emotion/editor/over-lay/HandleBar.tsx
"use client";

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
        opacity-70                       /* 기본은 꽤 연하게 */
        hover:opacity-100                /* hover 시 완전 진하게 */
        hover:scale-110                  /* 살짝 커지게 */
        active:scale-125                 /* 드래그 시작 순간 더 커짐 */
        transition-opacity transition-transform
        ${className}
      `}
      style={{
        top,
        left,
        height,
        ...style,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown();
      }}
    />
  );
}
