// src/components/emotion/input/TextInput.tsx
"use client";

type TextInputProps = {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
};

export function TextInput({ value, onChange, onNext }: TextInputProps) {
  const isValid = value.length >= 10 && value.length <= 400;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid) onNext();
      }}
      className="flex flex-col gap-2"
    >
      <textarea
        className="w-full rounded-md border px-2 py-1.5 text-s leading-snug outline-none"
        rows={6}
        value={value}
        onChange={(e) => {
          const text = e.target.value;
          if (text.length <= 400) onChange(text);
        }}
        placeholder="마음이 힘들었던 경험이나 불편했던 상황을 자유롭게 적어주세요."
      />

      {/* 안내 문구 */}
      <div
        className={`text-[10px] ${isValid ? "text-gray-500" : "text-red-500"}`}
      >
        최소 10자 이상, 최대 400자 이하로 작성해주세요.
      </div>

      {/* 글자 수 */}
      <div className="text-right text-[10px] text-gray-500">
        {value.length} / 400
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`self-end px-3 py-1.5 text-xs rounded-md border
          ${isValid ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
      >
        제출
      </button>
    </form>
  );
}
