// // // src/app/api/emotion/suggestion/route.ts
// // import { NextRequest, NextResponse } from "next/server";
// // import OpenAI from "openai";

// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY,
// // });

// // export async function POST(req: NextRequest) {
// //   const { fullText, segmentText, currentThought, level } = await req.json();

// //   const prompt = `
// // 너는 인지행동치료(CBT) 스타일로 자동사고를 정교하게 만들어 주는 상담자다.

// // [전체 서술]
// // ${fullText}

// // [초점 문장]
// // ${segmentText}

// // [현재 단계 정보]
// // - level: ${level}
// // - 사용자가 지금까지 떠올린 생각: ${currentThought || "아직 없음"}

// // 위 맥락을 모두 고려해서,
// // 이 감정/상황 뒤에 자동으로 떠오를 수 있는 "배후 생각(자동사고)" 후보를 제안해줘.

// // 요구사항:
// // - 총 3개
// // - 각 항목은 **한 줄**로만 쓰되, 내용은 **1~2문장 정도로 충분히 길고 구체적**이어야 한다.
// // - 표면 생각뿐 아니라, 그 뒤에 있는 부정적인 정서나 신념이 드러나게 쓴다.
// // - 문장 끝은 "~다" 체로 마무리한다.
// // - 줄바꿈 없이 한 줄에 모두 쓰고, 항목 사이에만 줄바꿈을 넣는다.

// // 출력 형식(꼭 지켜줘):
// // 1. ...
// // 2. ...
// // 3. ...
// // `;

// //   const completion = await openai.chat.completions.create({
// //     model: "gpt-4.1-mini",
// //     messages: [
// //       {
// //         role: "system",
// //         content:
// //           "너는 한국어로 답하는 인지행동치료(CBT) 상담자다. 사용자의 감정과 자동사고를 섬세하고 구체적으로 언어화하는 데 능숙하다.",
// //       },
// //       { role: "user", content: prompt },
// //     ],
// //   });

// //   const text = completion.choices[0]?.message?.content ?? "";

// //   const suggestions = text
// //     .split("\n")
// //     .map((line) => line.replace(/^\d+\.\s*/, "").trim())
// //     .filter(Boolean);

// //   return NextResponse.json({ suggestions });
// // }

// // src/app/api/emotion/suggestion/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// type EmotionContext = {
//   emotionId: string;
//   emotionName: string;
//   intensity: number;
//   regulationGoal: "reduce" | "accept";
// };

// export async function POST(req: NextRequest) {
//   const {
//     fullText,
//     segmentText,
//     currentThought,
//     level,
//     emotionContext,
//   }: {
//     fullText: string;
//     segmentText: string;
//     currentThought?: string;
//     level: number;
//     emotionContext?: EmotionContext;
//   } = await req.json();

//   const goalText = emotionContext
//     ? emotionContext.regulationGoal === "reduce"
//       ? "이 감정의 강도를 줄이고 싶어함"
//       : "지금 느끼는 감정을 있는 그대로 인정하며 다루고 싶어함"
//     : null;

//   const emotionSection = emotionContext
//     ? `
// [선택한 핵심 감정 정보]
// - 감정 이름: ${emotionContext.emotionName} (${emotionContext.emotionId})
// - 현재 강도: ${emotionContext.intensity} / 100
// - 사용자의 목표: ${goalText}
// `
//     : "";

//   const prompt = `
// 너는 인지행동치료(CBT) 스타일로 자동사고를 정교하게 만들어 주는 상담자다.

// ${emotionSection}

// [전체 서술]
// ${fullText}

// [초점 문장]
// ${segmentText}

// [현재 단계 정보]
// - level: ${level}
// - 사용자가 지금까지 떠올린 생각: ${currentThought || "아직 없음"}

// 위 맥락을 모두 고려해서,
// 이 감정/상황 뒤에 자동으로 떠오를 수 있는 "배후 생각(자동사고)" 후보를 제안해줘.
// 특히 위에서 제시된 감정 이름, 강도, 사용자의 목표와 연결될 수 있도록
// 왜 그런 감정이 그 정도 강도로 느껴질지 설명해 주는 형태의 생각이어야 한다.

// 요구사항:
// - 총 3개
// - 각 항목은 **한 줄**로만 쓰되, 내용은 **1~2문장 정도로 충분히 길고 구체적**이어야 한다.
// - 표면 생각뿐 아니라, 그 뒤에 있는 부정적인 정서나 신념이 드러나게 쓴다.
// - 문장 끝은 "~다" 체로 마무리한다.
// - 줄바꿈 없이 한 줄에 모두 쓰고, 항목 사이에만 줄바꿈을 넣는다.

// 출력 형식(꼭 지켜줘):
// 1. ...
// 2. ...
// 3. ...
// `;

//   const completion = await openai.chat.completions.create({
//     model: "gpt-4.1-mini",
//     messages: [
//       {
//         role: "system",
//         content:
//           "너는 한국어로 답하는 인지행동치료(CBT) 상담자다. 사용자의 감정과 자동사고를 섬세하고 구체적으로 언어화하는 데 능숙하다.",
//       },
//       { role: "user", content: prompt },
//     ],
//   });

//   const text = completion.choices[0]?.message?.content ?? "";

//   const suggestions = text
//     .split("\n")
//     .map((line) => line.replace(/^\d+\.\s*/, "").trim())
//     .filter(Boolean);

//   return NextResponse.json({ suggestions });
// }
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
- 사용자의 목표: ${goalText}
`
    : "";

  const prompt = `
너는 인지행동치료(CBT) 스타일로 자동사고를 정교하게 만들어 주는 상담자다.

${emotionSection}

[전체 서술]
${fullText}

[초점 문장]
${segmentText}

[현재 단계 정보]
- level: ${level}
- 사용자가 지금까지 떠올린 생각: ${currentThought || "아직 없음"}

위 맥락을 모두 고려해서,
이 감정/상황 뒤에 자동으로 떠오를 수 있는 "배후 생각(자동사고)" 후보를 제안해줘.
특히 위에서 제시된 감정 이름, 강도, 사용자의 목표와 연결될 수 있도록
왜 그런 감정이 그 정도 강도로 느껴질지 설명해 주는 형태의 생각이어야 한다.

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

  // 줄바꿈이 있든 없든 "n. " 패턴 기준으로 통으로 쪼갬
  const normalized = text.replace(/\r\n/g, "\n").trim();

  let suggestions = normalized
    .split(/\s*\d+\.\s*/g) // 1. / 2. / 3. 기준으로 split
    .map((s) => s.trim())
    .filter(Boolean);

  // 혹시라도 번호가 전혀 없어서 한 덩어리만 나오면 그대로 반환
  if (suggestions.length === 0 && normalized) {
    suggestions = [normalized];
  }

  return NextResponse.json({ suggestions });
}
