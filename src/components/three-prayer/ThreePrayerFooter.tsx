// src/components/three-prayer/ThreePrayerFooter.tsx
"use client";

export function ThreePrayerFooter() {
  return (
    <footer className="mt-16 border-t border-gray-200 pt-8">
      <div className="mb-6 text-center text-xs text-gray-500">
        <div className="inline-flex flex-col items-center gap-1">
          <span className="rounded-full border px-3 py-1 text-[11px]">
            Copyright © 2025 617ALLIANCE
          </span>
          <div className="mt-2 flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1">
              <span>⭐</span>
              <span>5.0</span>
            </span>
            <span className="h-3 w-px bg-gray-300" />
            <span>총 2개의 후기</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mb-6 max-w-2xl rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-800">
          후기 작성하기
        </h2>

        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>별점을 선택해주세요</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="h-6 w-6 rounded-full border text-[11px] leading-5 hover:bg-yellow-50"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="닉네임 (선택사항, 미입력시 익명)"
            className="w-full rounded-md border px-3 py-1.5 text-xs outline-none focus:border-black md:w-64"
          />
        </div>

        <textarea
          rows={4}
          placeholder="어떤 점이 좋았나요? 솔직한 후기를 남겨주세요 🙂"
          className="w-full rounded-md border px-3 py-2 text-xs outline-none focus:border-black"
        />

        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
          <span>0 / 300</span>
          <button
            type="button"
            className="rounded-full bg-violet-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-600"
          >
            후기 등록하기
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <h3 className="mb-2 text-xs font-semibold text-gray-700">후기 목록</h3>

        <div className="space-y-3 text-xs">
          <article className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">
                  ⭐ 5.0
                </span>
                <span className="font-semibold">익명 사용자</span>
              </div>
              <span className="text-[11px] text-gray-400">2시간 전</span>
            </div>
            <p className="text-[11px] text-gray-700">
              자칫 일기에 멈춰버리는 걱정과 자기 자신에 대한 생각은 되려 처지게
              만드는 경우가 많다. 스스로에 대해 분석하고 생각하는 능력이
              부족할수록 일기도 힘들고, 그럴 때 세칸 구조를 통해 그러한 감정이
              객관화되도록 나 자신을 관찰할 수 있도록 돕는 것은 자기 돌봄의 좋은
              연습이라고 느꼈다.
            </p>
          </article>
        </div>
      </div>
    </footer>
  );
}
