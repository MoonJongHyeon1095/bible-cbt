// src/components/emotion/editor/SegmentEditorToolbar.tsx
"use client";

type SegmentEditorToolbarProps = {
  isAdding: boolean;
  onToggleAdd: () => void;
};

export function SegmentEditorToolbar({
  isAdding,
  onToggleAdd,
}: SegmentEditorToolbarProps) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        className={`
          group inline-flex items-center gap-1
          rounded-full border border-slate-200
          bg-white/90 px-3 py-1
          text-[11px] font-medium text-slate-700
          shadow-sm backdrop-blur
          transition-all
          hover:-translate-y-[1px] hover:bg-slate-50 hover:shadow-md
          ${isAdding ? "ring-1 ring-slate-300 bg-slate-50" : ""}
        `}
        onClick={onToggleAdd}
      >
        <span className="text-[13px]">＋</span>
        <span>구간 추가</span>
      </button>
    </div>
  );
}
