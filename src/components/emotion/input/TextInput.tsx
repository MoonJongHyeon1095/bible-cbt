// "use client";

// type TextInputProps = {
//   value: string;
//   onChange: (v: string) => void;
//   onNext: () => void;
// };

// export function TextInput({ value, onChange, onNext }: TextInputProps) {
//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault(); // ← 페이지 리프레시 막기
//         onNext();
//       }}
//       className="flex flex-col gap-2"
//     >
//       {/* <textarea
//         className="w-full h-40 rounded-md border p-3 text-sm"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       /> */}
//       <textarea
//         className="w-full rounded-lg border px-3 py-2 text-sm leading-relaxed outline-none"
//         rows={8}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       />
//       <button
//         type="submit"
//         className="self-end px-4 py-2 text-sm rounded-md border hover:bg-gray-50"
//       >
//         제출
//       </button>
//     </form>
//   );
// }

// src/components/emotion/input/TextInput.tsx
"use client";

type TextInputProps = {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
};

export function TextInput({ value, onChange, onNext }: TextInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="flex flex-col gap-2"
    >
      <textarea
        className="w-full rounded-md border px-2 py-1.5 text-xs leading-snug outline-none"
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="감정을 먼저 자유롭게 적어보세요..."
      />
      <button
        type="submit"
        className="self-end px-3 py-1.5 text-xs rounded-md border hover:bg-gray-50"
      >
        제출
      </button>
    </form>
  );
}
