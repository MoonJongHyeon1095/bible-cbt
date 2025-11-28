// src/app/api/emotion/suggestion/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type EmotionContext = {
  emotionId: string;
  emotionName: string;
  intensity: number;
  regulationGoal: "reduce" | "accept";
};

type Suggestion = {
  belief: string;
  emotion_reason: string;
};

export async function POST(req: NextRequest) {
  const {
    fullText,
    segmentText,
    currentThought,
    level,
    emotionContext,
  }: {
    fullText: string;
    segmentText: string;
    currentThought?: string;
    level: number;
    emotionContext?: EmotionContext;
  } = await req.json();

  const systemPrompt = `
너는 한국어로 답하는 인지행동치료(CBT) 상담자다.

역할:
- 사용자가 겪은 사건, 선택한 감정(이름/강도), 그리고 현재까지의 생각을 바탕으로
  그 뒤에 숨은 "배후 생각(자동사고)"을 또렷하게 문장으로 잡아주는 것이 너의 일이다.
- 오로지 "지금 이 감정이 이렇게 강하게 느껴지도록 만드는 핵심 주장"을 드러내는 데 집중한다.

스타일:
- 반드시 한국어로, 자연스러운 1인칭 자동사고 형태로 쓴다. ("나는 …다", "분명 …일 것이다" 등)
- 표면적인 생각이 아니라, 그 뒤에 있는 부정적인 신념·의미·해석·두려워하는 결과가 드러나도록 쓴다.
- 구체적인 사건 묘사를 그대로 반복하지 말고, 그 사건들에서 사용자가 스스로에 대해 형성한 ‘한 단계 일반화된 믿음’이나 ‘규칙’의 형태로 표현한다.
- 다만 너무 막연한 인생 전체에 대한 철학이 아니라, 현재 상황·관계 맥락에 밀접하게 연결된 믿음으로 쓴다.
- 감정 이름/강도와 regulationGoal(감정을 줄이고 싶은지/수용하고 싶은지)을 반영한다.
- 자율성/관계성/유능성(SDT) 관점을 고려하되, "자율성 / 관계성 / 유능성"이라는 단어 자체는 사용하지 않는다.

형식 제약:
- 자동사고 후보를 총 5개 만든다.
- 각 항목은 belief, emotion_reason 두 필드로 구성된다.
  - belief: [초점 문장]을 읽고 떠오르는 숨겨진 핵심 주장, 신념, 믿음, 관점. (1인칭 시점, 자동사고 문장 1~2문장. 초점 문장을 그대로 반복하지 말고, 그 문장이 의미하는 바를 한 단계 일반화하여 표현한다. **사용자가 카드에 적어 넣을 핵심 문장이라고 생각하고 쓴다.**)
  - emotion_reason: [전체 서술]과 선택한 감정(이름/강도), regulationGoal을 참고하여, 위 belief가 지금 감정 강도를 만들어내는 이유를 설명하는 문장 1~2문장. **belief를 이해하기 위한 부연 설명으로만 쓴다.**
- 모든 문장은 반드시 "~다" 체로 마무리한다.
- 출력은 오직 JSON만 허용되며, 그 외 자연어 설명, 주석, 번호, 불릿, 인용구는 절대 포함하지 않는다.

출력 형식(반드시 정확히 이 구조로만 출력하라):

{
  "automatic_thoughts": [
    {
      "belief": "…",
      "emotion_reason": "…"
    }
  ]
}
`;

  const goalText = emotionContext
    ? emotionContext.regulationGoal === "reduce"
      ? "이 감정의 강도를 줄이고 싶어함"
      : "지금 느끼는 감정을 있는 그대로 인정하며 다루고 싶어함"
    : null;

  const emotionSection = emotionContext
    ? `
[선택한 핵심 감정 정보]
- 감정 이름: ${emotionContext.emotionName} (${emotionContext.emotionId})
- 현재 강도: ${emotionContext.intensity} / 100
- regulationGoal (사용자의 목표): ${goalText}
`
    : "";

  const prompt = `
${emotionSection}

[전체 서술]
${fullText}

[초점 문장]
${segmentText}

[현재 단계 정보]
- level: ${level}
- 사용자가 지금까지 떠올린 생각: ${currentThought || "아직 없음"}

위 맥락을 모두 고려해서,
이 감정/상황 뒤에 자동으로 떠오를 수 있는 "배후 생각(자동사고)" 후보를 제안하라.
각 후보는 belief(배후 주장)와 emotion_reason(그 주장이 지금 감정 강도를 만들고 있는 이유)로 나누어 표현하라.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";

  // 혹시 앞뒤에 잡소리 붙어도 JSON만 잘라내기 위한 방어 코드
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  let suggestions: Suggestion[] = [];

  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    const jsonText = raw.slice(jsonStart, jsonEnd + 1);

    try {
      const parsed = JSON.parse(jsonText) as {
        automatic_thoughts?: Suggestion[];
      };

      if (Array.isArray(parsed.automatic_thoughts)) {
        suggestions = parsed.automatic_thoughts
          .filter(
            (item) =>
              typeof item.belief === "string" &&
              typeof item.emotion_reason === "string"
          )
          .map((item) => ({
            belief: item.belief.trim(),
            emotion_reason: item.emotion_reason.trim(),
          }));
      }
    } catch (e) {
      console.error("Failed to parse JSON from LLM:", e, raw);
    }
  }

  // 파싱 실패 시, 통짜 텍스트 한 개라도 넘겨주기 (최소한의 fallback)
  if (suggestions.length === 0 && raw.trim()) {
    suggestions = [
      {
        belief: raw.trim(),
        emotion_reason: "",
      },
    ];
  }

  return NextResponse.json({ suggestions });
}
