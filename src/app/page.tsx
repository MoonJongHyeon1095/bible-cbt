// src/app/page.tsx
"use client";

import { ThreePrayerLayout } from "@/components/three-prayer/ThreePrayerLayout";
import { useThreePrayerDraft } from "@/hooks/useThreePrayerDraft";

export default function Home() {
  const { draft, setDraft, resetAll } = useThreePrayerDraft();

  return (
    <ThreePrayerLayout
      draft={draft}
      setDraft={setDraft}
      onResetAll={resetAll}
    />
  );
}
