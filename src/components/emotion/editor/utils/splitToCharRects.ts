// src/components/emotion/editor/utils/splitToCharRects.ts
export type RelativeRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export function splitToCharRects(root: HTMLElement | null): RelativeRect[] {
  if (!root) return [];

  const spans = root.querySelectorAll<HTMLSpanElement>("[data-idx]");
  const rootRect = root.getBoundingClientRect();

  const style = window.getComputedStyle(root);
  const paddingLeft = parseFloat(style.paddingLeft || "0") || 0;
  // ❌ paddingTop는 쓰지 말자
  // const paddingTop = parseFloat(style.paddingTop || "0") || 0;

  // ✅ 가로만 padding 보정 유지
  const baseLeft = rootRect.left + paddingLeft;
  // ✅ 세로는 원래처럼 rootRect.top만 사용
  const baseTop = rootRect.top;

  const rects: RelativeRect[] = [];

  spans.forEach((span) => {
    const idx = Number(span.dataset.idx ?? "-1");
    if (Number.isNaN(idx) || idx < 0) return;

    const r = span.getBoundingClientRect();

    rects[idx] = {
      top: r.top - baseTop,
      left: r.left - baseLeft,
      right: r.right - baseLeft,
      bottom: r.bottom - baseTop,
      width: r.width,
      height: r.height,
    };
  });

  return rects;
}
