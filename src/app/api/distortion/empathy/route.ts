// src/app/api/distortion/empathy/route.ts

/**
번즈식 5단계 제안 기법 

1. 감정 / 사고 공감 : 자연스러운 반응이라고 인정
2. 재진술 : 사용자의 경험 정리 + 강도별 맞춤 공감
3. 나 전달법 : AI의 객관적 의견 제시
4. 달래기 : 사용자의 성숙함 칭찬
 */
import { ThoughtForDistortion } from "@/components/distortion/hooks/useDistortionAnalysis";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const {
    fullText,
    segmentText,
    currentThought,
    previousThoughts,
    emotionContext,
  } = await req.json();

  const systemPrompt = `
너는 한국어로 답하는 공감 전문 심리 상담가이며,
Aaron Beck, David Burns의 CBT(인지행동치료)의 정서 공감 방식을 기반으로 대화한다.

역할 목표:
- 사용자가 표현한 감정과 자동사고를 반박하거나 논쟁하지 않는다.
- '그럴 수 있다'는 정서적 공간을 열어주며,
  감정과 생각의 타당한 배경을 공감하고 따뜻하게 비춘다.
- AI가 인간인 것처럼 묘사하거나,
  "나도 그런 적이 있어요", "겪어봐서 알아요" 같은 표현을 절대 금지한다.

스타일:
- 반드시 존댓말(~요)만 사용한다.
- 짧고 부드럽게, 따뜻하게, 단정 금지.
- 논쟁/가르침/해결책/조언 금지.
- "하지만"으로 이어지는 반박 구조 금지.
- 정서 인정: '충분히 이해돼요', '그럴 수 있어요', '당연한 감정이에요'
- 사실관찰 관점의 I-statement 사용
  예) "제가 느끼기에는 …처럼 보여요", "읽다보니 이런 마음이 느껴져요"

출력 형식(JSON only):
{
  "result": {
    "thoughtEmpathy": "…",
    "emotionEmpathy": "…",
    "iStatement": "…",
    "soothing": "…"
  }
}

필드 정의:
- thoughtEmpathy: 자동사고가 생길 만한 배경/맥락 공감 1~2문장
- emotionEmpathy: 그 감정의 정당성과 자연스러움 인정
- iStatement: 관찰자의 따뜻한 진술(경험 공유 금지, 비교 금지)
- soothing: 차분한 지지/안정감 제공 문장 (칭찬/위로/힘 실어주기)

제약 조건:
- JSON만 출력 (설명/불릿/번호/인용금지)
- 반드시 "~요" 체
`;

  const emotionSection = emotionContext
    ? `
[감정 정보]
- 감정: ${emotionContext.emotionName} (${emotionContext.intensity}/100)
- 목표: ${emotionContext.regulationGoal}
`
    : "";

  const historyText = previousThoughts?.length
    ? previousThoughts
        .map(({ belief }: ThoughtForDistortion) => `- ${belief}`)
        .join("\n")
    : "";

  const prompt = `
${emotionSection}

[전체 서술]
${fullText}

[현재 다루는 초점 문장]
${segmentText}

[현재 자동사고]
${currentThought?.belief ?? ""}

[이전에 떠올린 자동사고 목록]
${historyText}

---

사용자의 입장이 되어, 이 생각과 감정이 충분히 이해된다고 느낄 수 있도록
따뜻하고 조심스럽고 짧게 공감문을 작성하라.

위 systemPrompt의 규칙을 엄격히 지키고,
오직 JSON 형식으로만 출력하라.
`;

  // === LLM 요청 ===
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");

  let parsed: any = null;

  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    try {
      parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    } catch (e) {
      console.error("JSON parse failed:", e, raw);
    }
  }

  // fallback: 최소 구조라도 반환
  if (!parsed?.result) {
    return NextResponse.json({
      result: {
        thoughtEmpathy: raw.trim(),
        emotionEmpathy: "",
        iStatement: "",
        soothing: "",
        question: "",
      },
    });
  }

  return NextResponse.json(parsed);
}
