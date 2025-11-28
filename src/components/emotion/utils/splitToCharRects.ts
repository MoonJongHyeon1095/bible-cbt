// src/components/emotion/utils/splitToCharRects.ts
export type RelativeRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export function splitToCharRects(
  container: HTMLElement | null
): RelativeRect[] {
  if (!container) return [];

  const containerRect = container.getBoundingClientRect();

  const spans = Array.from(
    container.querySelectorAll("span[data-idx]")
  ) as HTMLSpanElement[];

  return spans.map((s) => {
    const r = s.getBoundingClientRect();
    return {
      top: r.top - containerRect.top,
      left: r.left - containerRect.left,
      right: r.right - containerRect.left,
      bottom: r.bottom - containerRect.top,
      width: r.width,
      height: r.height,
    };
  });
}
