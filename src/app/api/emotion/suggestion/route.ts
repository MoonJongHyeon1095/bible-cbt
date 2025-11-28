// src/app/api/emotion/suggestion/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { fullText, segmentText, currentThought, level } = await req.json();

  const prompt = `
너는 인지행동치료(CBT) 스타일로 자동사고를 정교하게 만들어 주는 상담자다.

[전체 서술]
${fullText}

[초점 문장]
${segmentText}

[현재 단계 정보]
- level: ${level}
- 사용자가 지금까지 떠올린 생각: ${currentThought || "아직 없음"}

위 맥락을 모두 고려해서,
이 감정/상황 뒤에 자동으로 떠오를 수 있는 "배후 생각(자동사고)" 후보를 제안해줘.

요구사항:
- 총 3개
- 각 항목은 **한 줄**로만 쓰되, 내용은 **1~2문장 정도로 충분히 길고 구체적**이어야 한다.
- 표면 생각뿐 아니라, 그 뒤에 있는 부정적인 정서나 신념이 드러나게 쓴다.
- 문장 끝은 "~다" 체로 마무리한다.
- 줄바꿈 없이 한 줄에 모두 쓰고, 항목 사이에만 줄바꿈을 넣는다.

출력 형식(꼭 지켜줘):
1. ...
2. ...
3. ...
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "너는 한국어로 답하는 인지행동치료(CBT) 상담자다. 사용자의 감정과 자동사고를 섬세하고 구체적으로 언어화하는 데 능숙하다.",
      },
      { role: "user", content: prompt },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "";

  const suggestions = text
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);

  return NextResponse.json({ suggestions });
}
