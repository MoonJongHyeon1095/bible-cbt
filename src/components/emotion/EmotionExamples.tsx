// src/components/emotion/EmotionExamples.tsx
"use client";

import { useState } from "react";

type EmotionExample = {
  id: string;
  emoji: string;
  text: string;
};

const EXAMPLES: EmotionExample[] = [
  // 1. 회의/업무 관련
  {
    id: "meeting-plan",
    emoji: "📊",
    text: "팀 회의에서 내 기획안을 발표했는데, 팀장이 '이건 현실성이 없어 보이네요?'라며 3분 만에 잘라버렸어. 2주 동안 밤새 준비한 건데.",
  },
  {
    id: "newbie-comment",
    emoji: "🤖",
    text: "신입사원이 '이거 시로 하면 10분이면 되는데요?'라고 했어. 나는 3시간 걸려서 한 일인데.",
  },
  {
    id: "project-freeze",
    emoji: "🎤",
    text: "프로젝트 발표 중에 갑자기 머릿속이 하얘져서 30초 동안 멈춰 있었어. 청중들 20명이 다 쳐다보는데.",
  },

  // 2. 상사/직장 관계
  {
    id: "boss-criticize",
    emoji: "😡",
    text: "상사가 '이것도 모르세요?'라고 다른 동료 5명에서 말했어. 다들 고개를 숙이고 어색한 웃음만 지었어.",
  },
  {
    id: "lunch-alone",
    emoji: "🍱",
    text: "회사에서 점심시간에 다들 짝지어 나가는데 나한테는 아무도 같이 가자고 안 해. 6개월째 혼밥 중이야.",
  },
  {
    id: "joke-ignored",
    emoji: "🫥",
    text: "회사 자리에서 내 농담에는 아무도 안 웃고, 과장님 농담에만 다들 배꼽 잡고 웃어. 내가 투명 인간 같았어.",
  },

  // 3. 연애/친밀 관계
  {
    id: "birthday-party",
    emoji: "🎉",
    text: "연인이 내가 준비한 깜짝 생일파티 보고 '아 고마워'라고만 하고 10분 만에 친구 전화받으러 나갔어.",
  },
  {
    id: "read-but-no-reply",
    emoji: "💬",
    text: "친구가 내 카톡을 읽고도 8시간째 답장이 없어. 그런데 단톡방에는 계속 말하더라. 나한텐 이래.",
  },
  {
    id: "partner-ignores-kakao",
    emoji: "❣️",
    text: "연인이 내 카톡은 12시간째 안 읽는데, 인스타 스토리는 계속 올려. 나한테만 바쁜 건가?",
  },
  {
    id: "friend-cancels",
    emoji: "🙄",
    text: "친구가 약속을 또 취소했어, 이번이 네 번째야. '미안 급한 일 생겼어'라는 3초 메시지만 보내고 전화도 안 받아.",
  },
  {
    id: "consult-friend",
    emoji: "🫥",
    text: "친구에게 고민 상담했더니 '그건 별로 힘든 아냐? 나는 더 힘들었어'라며 자기 얘기만 1시간.",
  },

  // 4. 비교/관계에서의 소외감
  {
    id: "birthday-msg-count",
    emoji: "🎂",
    text: "생일인데 축하 메시지가 카톡 자동 알림 빼고 2개야. 작년에는 30개 넘게 왔었는데.",
  },
  {
    id: "sns-comparison",
    emoji: "🌏",
    text: "SNS를 보니 대학 동기는 해외여행 중이고, 다른 친구는 승진했다고 올렸어. 나만 제자리인 것 같아.",
  },
  {
    id: "college-reunion",
    emoji: "🎓",
    text: "대학 동기 모임에 갔는데 다들 취업, 결혼, 출산 얘기만 해. 나만 백수에 솔로야. 나 없는 것처럼 대화가 흘러갔어.",
  },
  {
    id: "no-relationship",
    emoji: "💭",
    text: "30대 중반인데 아직 연애 경험이 별로 없어. 주변 사람들은 다 결혼하거나 둘째 낳을 때인데.",
  },
  {
    id: "group-trip-chat",
    emoji: "✈️",
    text: "단톡방에 여행 계획 얘기가 있는데 나한테는 아무도 따로 연락이 없어. 5년 지기 친구들인데.",
  },

  // 5. 가족/부모 관련
  {
    id: "father-disapprove",
    emoji: "🧑‍🦳",
    text: "아버지가 '네가 그렇게 하니까 안 되는 거지'라며 내 선택을 부정하셨어. 1년 동안 고민해서 결정한 건데.",
  },

  // 6. 연애/데이트 비교
  {
    id: "ex-comparison",
    emoji: "😞",
    text: "데이트 중에 계속 전 여자친구 얘기를 해. '걔는 이런 거 좋아했는데'라며 30분째 비교하고 있어.",
  },

  // 7. 자기 목표 실패/좌절
  {
    id: "diet-fail",
    emoji: "⚖️",
    text: "작년에 '올해는 꼭 살 빼겠다'고 다짐했는데 오히려 5kg 쪘어. 또 실패했어.",
  },

  // 8. 면접/성취감 관련
  {
    id: "interview-gap",
    emoji: "📝",
    text: "면접에서 '이력서를 보니 공백이 많네. 그동안 뭐하셨어요?'라는 질문에 제대로 대답을 못 했어.",
  },
];

type Props = {
  onSelect: (text: string) => void;
};

export function EmotionExamples({ onSelect }: Props) {
  const [startIndex, setStartIndex] = useState(0);
  const pageSize = 4;
  const total = EXAMPLES.length;

  const visibleExamples: EmotionExample[] = [];
  for (let i = 0; i < Math.min(pageSize, total); i++) {
    const idx = (startIndex + i) % total;
    visibleExamples.push(EXAMPLES[idx]);
  }

  const handleNext = () => {
    setStartIndex((prev) => (prev + pageSize) % total);
  };

  return (
    <div className="space-y-3 text-xs">
      <p className="text-[11px] text-gray-500">또는 예시를 선택해 보세요:</p>

      {/* 예시 카드 그리드 (4개씩) */}
      <div className="grid gap-2 md:grid-cols-2">
        {visibleExamples.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => onSelect(ex.text)}
            className="flex h-full flex-col items-start gap-1 rounded-2xl border bg-white p-3 text-left text-[11px] shadow-sm hover:border-gray-400"
          >
            {/* ⬇️ 이모지를 텍스트랑 같은 줄, 같은 크기로 */}
            <p className="whitespace-pre-line text-gray-700">
              {ex.emoji} {ex.text}
            </p>
          </button>
        ))}
      </div>

      {/* 다른 예시 보기 버튼 */}
      {total > pageSize && (
        <button
          type="button"
          onClick={handleNext}
          className="mt-2 flex w-full items-center justify-center rounded-2xl border border-indigo-300 bg-indigo-50/60 px-3 py-2 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50"
        >
          <span className="mr-1.5 text-xs">🔀</span>
          <span>다른 예시 보기</span>
        </button>
      )}
    </div>
  );
}
