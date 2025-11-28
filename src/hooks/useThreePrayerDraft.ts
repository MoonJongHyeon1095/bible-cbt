// src/hooks/useThreePrayerDraft.ts
"use client";

import type { ThreePrayerDraft } from "@/types/draft";
import { useEffect, useState } from "react";

const STORAGE_KEY = "three_prayer_draft_v1";

const EMPTY_DRAFT: ThreePrayerDraft = {
  distorted: "",
  truth: "",
  prayer: "",
};

export function useThreePrayerDraft() {
  const [draft, setDraft] = useState<ThreePrayerDraft>(EMPTY_DRAFT);

  // 초기 로드
  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

    if (saved) {
      try {
        setDraft(JSON.parse(saved));
      } catch {
        // 깨진 데이터면 초기화
        setDraft(EMPTY_DRAFT);
      }
    }
  }, []);

  // 변경 시 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
  }, [draft]);

  const resetAll = () => {
    setDraft(EMPTY_DRAFT);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    draft,
    setDraft,
    resetAll,
  };
}
