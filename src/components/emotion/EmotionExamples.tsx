// src/components/emotion/EmotionExamples.tsx
"use client";

import { Shuffle } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

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
    text: "팀 회의에서 내 기획안을 발표했는데, 팀장이 '이건 현실성이 없어 보이네요'라며 3분 만에 잘라버렸어. 2주 동안 밤새 준비한 건데.",
  },
  {
    id: "boss-criticize",
    emoji: "😡",
    text: "상사가 '이것도 모르세요?'라고 다른 동료 5명 앞에서 말했어. 다들 고개를 숙이고 어색한 웃음만 지었어.",
  },
  {
    id: "project-freeze",
    emoji: "🎤",
    text: "프로젝트 발표 중에 갑자기 머릿속이 하얘져서 30초 동안 멈춰 있었어. 청중들 20명이 다 쳐다보는데.",
  },
  {
    id: "ai-compare",
    emoji: "🤖",
    text: "신입사원이 '이거 AI로 하면 10분이면 되는데요'라고 했어. 나는 3시간 걸려서 한 일인데.",
  },

  // 2. 직장 관계 / 소외
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
  {
    id: "performance-ignored",
    emoji: "😖",
    text: "내가 성과를 냈는데 팀장이 회의에서 '팀원들 덕분이죠'라고만 해. 나 혼자 야근하며 마감 맞춘 건데.",
  },

  // 3. 연애/친밀 관계
  {
    id: "partner-ignores-kakao",
    emoji: "❣️",
    text: "연인이 내 카톡은 12시간째 안 읽는데, 인스타 스토리는 계속 올려. 나한테만 바쁜 건가?",
  },
  {
    id: "birthday-party",
    emoji: "🎉",
    text: "연인이 내가 준비한 깜짝 생일파티 보고 '아 고마워'라고만 하고 10분 만에 친구 전화받으러 나갔어.",
  },
  {
    id: "ex-comparison",
    emoji: "😞",
    text: "데이트 중에 계속 전 여자친구 얘기를 해. '걔는 이런 거 좋아했는데'라며 30분째 비교하고 있어.",
  },

  // 4. 친구/대인 관계
  {
    id: "read-but-no-reply",
    emoji: "💬",
    text: "친구가 내 카톡을 읽고도 8시간째 답장이 없어. 그런데 단톡방에는 계속 말하더라. 나한테만 이래.",
  },
  {
    id: "friend-cancels",
    emoji: "🙄",
    text: "친구가 약속을 또 취소했어. 이번이 네 번째야. '미안 급한 일 생겼어'라는 3초 메시지만 보내고 전화도 안 받아.",
  },
  {
    id: "consult-friend",
    emoji: "🫥",
    text: "친구에게 고민 상담했더니 '그건 별로 힘든 거 아닌데? 나는 더 힘들었어'라며 자기 얘기만 1시간 했어.",
  },
  {
    id: "group-trip-chat",
    emoji: "✈️",
    text: "단톡방에 여행 계획 얘기가 있는데 나한테는 아무도 따로 연락이 없어. 5년 지기 친구들인데.",
  },
  {
    id: "friends-without-me",
    emoji: "📸",
    text: "친구들이 나 빼고 만났다는 걸 SNS 사진으로 알게 됐어. 어제까지 '요즘 바빠'라고 했는데 다 거짓말이었네.",
  },

  // 5. 비교/관계에서의 소외감
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

  // 6. 가족/부모 관련
  {
    id: "father-disapprove",
    emoji: "🧑‍🦳",
    text: "아버지가 '네가 그렇게 하니까 안 되는 거지'라며 내 선택을 부정하셨어. 1년 동안 고민해서 결정한 건데.",
  },
  {
    id: "sibling-compare",
    emoji: "😤",
    text: "형제는 부모님께 칭찬받는데, 나는 '형제 좀 본받아라'라는 말만 들어. 평생 비교당하는 느낌이야.",
  },

  // 7. 자기 목표 실패/좌절
  {
    id: "diet-fail",
    emoji: "⚖️",
    text: "작년에 '올해는 꼭 살 빼겠다'고 다짐했는데 오히려 5kg 쪘어. 또 실패했어.",
  },
  {
    id: "exam-fail",
    emoji: "📝",
    text: "자격증 시험에 5번째 떨어졌어. 같이 시작한 친구들은 다 붙었는데 나만 계속 실패야. '머리가 나쁜가?'라는 생각뿐이야.",
  },
  {
    id: "dream-job-fail",
    emoji: "💼",
    text: "꿈꿔왔던 회사에 최종 면접까지 갔는데 떨어졌어. '아쉽지만...'이라는 메일만 왔어. 2년 준비했는데.",
  },

  // 8. 경력/공백/능력 관련
  {
    id: "interview-gap",
    emoji: "📄",
    text: "면접에서 '이력서를 보니 공백이 많네. 그동안 뭐 하셨어요?'라는 질문에 제대로 대답을 못 했어.",
  },
  {
    id: "younger-higher-pay",
    emoji: "💰",
    text: "20대 후배가 나보다 연봉이 높다는 걸 알게 됐어. 나는 10년째 이 일 하는데.",
  },
  {
    id: "too-late-start",
    emoji: "⏰",
    text: "이제 40대인데 새로운 걸 시작하기엔 너무 늦은 것 같아. '그때 했어야 했는데'라는 후회만 남아.",
  },
  {
    id: "youtube-slow",
    emoji: "🎬",
    text: "유튜브 채널을 6개월 동안 운영했는데 구독자가 50명이야. 같이 시작한 친구는 1만 명 넘었어.",
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
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-500">또는 예시를 선택해 보세요:</p>

        {/* 🔁 알파 느낌의 "다른 예시" 버튼 */}
        {total > pageSize && (
          <Button
            type="button"
            onClick={handleNext}
            variant="secondary"
            size="sm"
            className="h-7 gap-1.5 bg-white/70 px-2.5 text-[11px] text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>다른 예시</span>
          </Button>
        )}
      </div>

      {/* 예시 카드 그리드 (4개씩) */}
      <div className="grid gap-2 md:grid-cols-2">
        {visibleExamples.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => onSelect(ex.text)}
            className="flex h-full flex-col items-start gap-1 rounded-2xl border border-gray-200 bg-white p-3 text-left text-[11px] shadow-sm hover:border-gray-400 hover:shadow-md transition-all"
          >
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">
              {ex.emoji} {ex.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
