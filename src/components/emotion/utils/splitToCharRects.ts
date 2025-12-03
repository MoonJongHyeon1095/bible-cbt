// // src/components/emotion/utils/splitToCharRects.ts
// export type RelativeRect = {
//   top: number;
//   left: number;
//   right: number;
//   bottom: number;
//   width: number;
//   height: number;
// };

// export function splitToCharRects(
//   container: HTMLElement | null
// ): RelativeRect[] {
//   if (!container) return [];

//   const containerRect = container.getBoundingClientRect();

//   const spans = Array.from(
//     container.querySelectorAll("span[data-idx]")
//   ) as HTMLSpanElement[];

//   return spans.map((s) => {
//     const r = s.getBoundingClientRect();
//     return {
//       top: r.top - containerRect.top,
//       left: r.left - containerRect.left,
//       right: r.right - containerRect.left,
//       bottom: r.bottom - containerRect.top,
//       width: r.width,
//       height: r.height,
//     };
//   });
// }

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

  // 🔥 디버그: 첫 몇 글자만 찍어보기
  console.log("[splitToCharRects] containerRect", {
    left: containerRect.left,
    top: containerRect.top,
    width: containerRect.width,
  });

  const result = spans.map((s, i) => {
    const r = s.getBoundingClientRect();
    const rel = {
      top: r.top - containerRect.top,
      left: r.left - containerRect.left,
      right: r.right - containerRect.left,
      bottom: r.bottom - containerRect.top,
      width: r.width,
      height: r.height,
    };

    if (i < 5 || i === spans.length - 1) {
      console.log(`[char ${i}]`, {
        char: s.textContent,
        absLeft: r.left,
        relLeft: rel.left,
        relRight: rel.right,
        width: rel.width,
        checkWidth: rel.right - rel.left,
      });
    }

    return rel;
  });

  return result;
}
