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
        placeholder="마음이 힘들었던 경험이나 불편했던 상황을 자유롭게 적어주세요."
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
