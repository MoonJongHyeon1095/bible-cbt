// // src/components/emotion/input/TextInput.tsx
// "use client";

// type TextInputProps = {
//   value: string;
//   onChange: (v: string) => void;
//   onNext: () => void;
// };

// export function TextInput({ value, onChange, onNext }: TextInputProps) {
//   const isValid = value.length >= 10 && value.length <= 400;

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         if (isValid) onNext();
//       }}
//       className="flex flex-col gap-2"
//     >
//       <textarea
//         className="w-full rounded-md border px-2 py-1.5 text-s leading-snug outline-none"
//         rows={6}
//         value={value}
//         onChange={(e) => {
//           const text = e.target.value;
//           if (text.length <= 400) onChange(text);
//         }}
//         placeholder="마음이 힘들었던 경험이나 불편했던 상황을 자유롭게 적어주세요."
//       />

//       {/* 안내 문구 */}
//       <div
//         className={`text-[10px] ${isValid ? "text-gray-500" : "text-red-500"}`}
//       >
//         최소 10자 이상, 최대 400자 이하로 작성해주세요.
//       </div>

//       {/* 글자 수 */}
//       <div className="text-right text-[10px] text-gray-500">
//         {value.length} / 400
//       </div>

//       <button
//         type="submit"
//         disabled={!isValid}
//         className={`self-end px-3 py-1.5 text-xs rounded-md border
//           ${isValid ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
//       >
//         제출
//       </button>
//     </form>
//   );
// }

// src/components/emotion/input/TextInput.tsx
"use client";

import { useCallback } from "react";
import { Textarea } from "../../ui/textarea";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
};

export function TextInput({ value, onChange, onNext }: Props) {
  const isValid = value.length >= 10 && value.length <= 400;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!isValid) return;
        onNext();
      }
    },
    [isValid, onNext]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 shadow-inner">
      {/* 입력 */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="마음이 힘들었던 경험이나 불편했던 상황을 자유롭게 적어주세요."
        className="
          min-h-[180px]
          rounded-xl
          border-slate-200
          bg-white/90
          px-3.5 py-3
          text-sm leading-relaxed
          text-slate-800
          shadow-sm
          placeholder:text-slate-300
          focus-visible:border-indigo-400
          focus-visible:ring-indigo-200
        "
      />

      {/* 안내 + 글자수 */}
      <div className="mt-2 flex items-center justify-between">
        <div
          className={`text-[10px] ${
            isValid ? "text-gray-500" : "text-red-500"
          }`}
        >
          최소 10자 이상, 최대 400자 이하로 작성해주세요.
        </div>

        <span
          className={`text-[10px] ${
            isValid ? "text-slate-500" : "text-red-500"
          }`}
        >
          {value.length}/400
        </span>
      </div>

      {/* 다음 버튼 */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          disabled={!isValid}
          onClick={onNext}
          className={`
            rounded-xl px-4 py-2 text-xs font-semibold transition
            ${
              isValid
                ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm"
                : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60"
            }
          `}
        >
          다음 단계 →
        </button>
      </div>
    </div>
  );
}

// // src/components/emotion/input/TextInput.tsx
// "use client";

// import { Textarea } from "@/components/ui/textarea";

// type TextInputProps = {
//   value: string;
//   onChange: (v: string) => void;
//   onNext: () => void;
// };

// export function TextInput({ value, onChange, onNext }: TextInputProps) {
//   const isValid = value.length >= 10 && value.length <= 400;

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         if (isValid) onNext();
//       }}
//       className="flex flex-col gap-2"
//     >
//       <Textarea
//         rows={6}
//         value={value}
//         onChange={(e) => {
//           const text = e.target.value;
//           if (text.length <= 400) onChange(text);
//         }}
//         placeholder="마음이 힘들었던 경험이나 불편했던 상황을 자유롭게 적어주세요."
//         className="
//           text-sm md:text-sm
//           leading-relaxed
//         "
//       />

//       {/* 안내 문구 */}
//       <div
//         className={`
//           flex items-center justify-between text-[11px] sm:text-xs
//           ${isValid ? "text-gray-500" : "text-red-500"}
//         `}
//       >
//         <span>10자 이상 400자 이하로 적어주세요.</span>
//         <span>{value.length} / 400</span>
//       </div>

//       <button
//         type="submit"
//         disabled={!isValid}
//         className={`
//           self-end rounded-md px-3 py-1 text-[11px] sm:text-xs
//           ${
//             isValid
//               ? "bg-blue-600 text-white hover:bg-blue-700"
//               : "bg-gray-200 text-gray-400"
//           }
//         `}
//       >
//         다음
//       </button>
//     </form>
//   );
// }
