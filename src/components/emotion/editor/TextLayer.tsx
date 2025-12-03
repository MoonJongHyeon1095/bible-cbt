// // src/components/emotion/editor/TextLayer.tsx
// "use client";

// import { useEffect } from "react";
// import { splitToCharRects, type RelativeRect } from "../utils/splitToCharRects";

// type TextLayerProps = {
//   text: string;
//   containerRef: React.RefObject<HTMLDivElement | null>;
//   onCharRectsChange: (rects: RelativeRect[]) => void;
// };

// export function TextLayer({
//   text,
//   containerRef,
//   onCharRectsChange,
// }: TextLayerProps) {
//   useEffect(() => {
//     const rects = splitToCharRects(containerRef.current);
//     onCharRectsChange(rects);
//   }, [text, containerRef, onCharRectsChange]);

//   return (
//     <div className="whitespace-pre-wrap text-s leading-relaxed font-sans text-gray-800">
//       {text.split("").map((ch, idx) => (
//         <span key={idx} data-idx={idx}>
//           {ch}
//         </span>
//       ))}
//     </div>
//   );
// }

// // src/components/emotion/editor/TextLayer.tsx
// "use client";

// import { useEffect } from "react";
// import { splitToCharRects, type RelativeRect } from "../utils/splitToCharRects";

// type TextLayerProps = {
//   text: string;
//   containerRef: React.RefObject<HTMLDivElement | null>;
//   onCharRectsChange: (rects: RelativeRect[]) => void;
// };

// export function TextLayer({
//   text,
//   containerRef,
//   onCharRectsChange,
// }: TextLayerProps) {
//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;

//     let rafId: number | null = null;

//     const measure = () => {
//       if (!containerRef.current) return;
//       const rects = splitToCharRects(containerRef.current);
//       onCharRectsChange(rects);
//     };

//     // 처음 한 번 측정 (DOM 렌더 끝난 다음 프레임에)
//     rafId = requestAnimationFrame(measure);

//     // 컨테이너 크기 변할 때마다 다시 측정
//     const observer = new ResizeObserver(() => {
//       if (rafId !== null) cancelAnimationFrame(rafId);
//       rafId = requestAnimationFrame(measure);
//     });

//     observer.observe(el);

//     return () => {
//       observer.disconnect();
//       if (rafId !== null) {
//         cancelAnimationFrame(rafId);
//       }
//     };
//   }, [text, containerRef, onCharRectsChange]);

//   return (
//     <div className="whitespace-pre-wrap text-s leading-relaxed font-sans text-gray-800">
//       {text.split("").map((ch, idx) => (
//         <span key={idx} data-idx={idx}>
//           {ch}
//         </span>
//       ))}
//     </div>
//   );
// }
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
    const el = containerRef.current;
    if (!el) return;

    let frameId: number | null = null;

    const doMeasure = () => {
      const target = containerRef.current;
      if (!target) return;
      const rects = splitToCharRects(target);
      onCharRectsChange(rects);
      frameId = null;
    };

    const requestMeasure = () => {
      if (frameId != null) return;
      frameId = requestAnimationFrame(doMeasure);
    };

    // ✅ text 변동 직후 한 번은 무조건 측정
    requestMeasure();

    // ✅ 실제 사이즈 변할 때만 다시 측정
    const observer = new ResizeObserver(() => {
      requestMeasure();
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frameId != null) {
        cancelAnimationFrame(frameId);
      }
    };
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
